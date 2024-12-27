import { useState, useEffect } from 'react';
import { browser } from 'wxt/browser';
import { AIPromptService } from '../services/api';
import { ResultItem, ModelOption } from '../types';
import { QuestionClassificationType } from '../types';

const aiService = new AIPromptService();


export const useSmartAssistant = (
  isDrawerOpen: boolean,
  setIsDrawerOpen: (open: boolean) => void
) => {
  const [query, setQuery] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [selectedChips, setSelectedChips] = useState<ResultItem[]>([]);
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [modelOptions] = useState<ModelOption[]>([
      {
        id: 1,
        value: "gpt-4o",
        label: "Fastest",
        caption: "For Fast and reliable results.",
        prompt: {
          text: "getText4UserPrompt",
          table: "getTable2SystemPrompt"
        }
      },
      {
        id: 2,
        value: "gpt-4o",
        label: "Advanced Reasoning",
        caption: "Designed for complex reasoning tasks, delivering thorough and insightful responses.",
        prompt: {
          text: "getText2UserPrompt",
          table: "getTable2SystemPrompt"
        }
      },
      {
        id: 3,
        value: "claude-3-5-sonnet-20241022",
        label: "Technical & Quantitative",
        caption: "Specialized for technical and quantitative queries, ensuring accuracy and depth.",
        prompt: {
          text: "getText4UserPrompt",
          table: "getTable2SystemPrompt"
        }
      }
    ]);
  const [answerGenerationModel, setAnswerGenerationModel] = useState<ModelOption>(modelOptions[0]);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [questionClassification, setQuestionClassification] = useState<QuestionClassificationType>(null);
  const [customContext, setCustomContext] = useState('');
  const [autoSelectEnabled, setAutoSelectEnabled] = useState(true);

  const performSearch = async (searchText: string, shouldReset = false) => {
    if (shouldReset) {
      handleReset();
    }

    setQuery(searchText);
    setCurrentQuestion(searchText);
    setIsLoading(true);
    setError(null);
    setCurrentBatch(0);
    setHasMore(true);

    try {
      console.log('🎯 Initial search for:', searchText);
      const [searchResults, questionResponse] = await Promise.all([
        aiService.searchSimilar({
          contentToSearch: searchText,
          k: 5,
          returnAnswer: true,
          contentType: 'BOTH',
          searchType: 'HYBRID'
        }),
        aiService.createQuestion(searchText)
      ]);

      console.log('📝 Question created:', questionResponse);

      if (questionResponse?.question_id) {
        setQuestionId(questionResponse.question_id);
        
        const classificationResponse = await aiService.classifyQuestions([{
          question_id: questionResponse.question_id,
          text: searchText
        }]);

        // Handle classification response
        if (classificationResponse?.[0]) {
          console.log(`🔍 Question classified: ${classificationResponse[0].question_id}, Classification: ${classificationResponse[0].classification}`);
          setQuestionClassification(classificationResponse[0].classification as QuestionClassificationType);
          
          // Set drawer state based on classification
          setIsDrawerOpen(classificationResponse[0].classification !== 'AUTO');
          
          // If the question is already answered, set the answer
          if (classificationResponse[0].is_answered && classificationResponse[0].answer_block) {
            setGeneratedAnswer(classificationResponse[0].answer_block);
            setCurrentAnswer(classificationResponse[0].answer_block);
          }
        }
      }

      const transformedResults = searchResults.map((result, index) => ({
        id: result.questionData.question_id || `result-${index}`,
        score: result.score || 0,
        rank: index + 1,
        title: result.metadata.parent_name || 'Untitled',
        content: result.questionData.text || '',
        metadata: {
          ...result.metadata,
          frequency: result.metadata.frequency || undefined,
          status: result.metadata.status || undefined
        },
        answer_block: result.questionData.answer_block || ''
      }));

      setResults(transformedResults);
      setCurrentBatch(1);

      console.log(`✨ Found ${transformedResults.length} initial results`);
    } catch (error) {
      console.error('❌ Error in search:', error);
      setError('Failed to get results. Please try again.');
      setIsDrawerOpen(true); // Open drawer on error
    } finally {
      setIsLoading(false);
    }
  };

  // Text selection listener
  useEffect(() => {
    if (!autoSelectEnabled) return;

    const messageListener = async (message: any) => {
      if (message.type === 'TEXT_SELECTED' && message.data) {
        await performSearch(message.data.text, true);
      }
    };

    browser.runtime.onMessage.addListener(messageListener);
    return () => browser.runtime.onMessage.removeListener(messageListener);
  }, [autoSelectEnabled]); // Added autoSelectEnabled to dependencies

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await performSearch(query);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) {
      console.log('⏸️ Skipping load more - already loading or no more results');
      return;
    }

    console.log('📚 Loading more results...');
    try {
      setLoadingMore(true);
      
      console.log(`Loading more - offset: ${results.length}, k: 5`);
      const moreResults = await aiService.searchSimilar({
        contentToSearch: query,
        k: 5,
        offset: results.length,
        returnAnswer: true,
        contentType: 'BOTH',
        searchType: 'HYBRID'
      });

      console.log(`Received ${moreResults.length} new results`);

      if (moreResults.length === 0) {
        console.log('No more results available, setting hasMore to false');
        setHasMore(false);
        return;
      }

      const existingIds = new Set(results.map(r => r.id));
      const transformedResults = moreResults
        .map((result, index) => ({
          id: result.questionData.question_id || `result-${results.length + index}`,
          score: result.score || 0,
          rank: results.length + index + 1,
          title: result.metadata.parent_name || 'Untitled',
          content: result.questionData.text || '',
          metadata: {
            ...result.metadata,
            frequency: result.metadata.frequency || undefined,
            status: result.metadata.status || undefined
          },
          answer_block: result.questionData.answer_block || ''
        }))
        .filter(result => !existingIds.has(result.id));

      console.log(`Adding ${transformedResults.length} unique results`);

      if (transformedResults.length === 0) {
        console.log('No new unique results, setting hasMore to false');
        setHasMore(false);
        return;
      }

      setResults(prev => [...prev, ...transformedResults]);
      setCurrentBatch(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more results:', error);
      setError('Failed to load more results.');
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setQuery(question);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const handleAddChip = (result: ResultItem) => {
    if (!selectedChips.some(chip => chip.id === result.id)) {
      setSelectedChips([...selectedChips, result]);
    }
  };

  const handleRemoveChip = (id: string) => {
    setSelectedChips(selectedChips.filter(chip => chip.id !== id));
  };

  const handleGenerateAnswer = async () => {
    console.log('🤖 Generating answer...', {
      selectedChips: selectedChips.length,
      questionId,
      model: answerGenerationModel.label,
      customContext: customContext
    });
    if (selectedChips.length === 0 || !questionId) return;

    // Clear previous answers
    setCurrentAnswer(null);
    setGeneratedAnswer('');
    
    setIsGenerating(true);
    setIsStreaming(true);
    setError(null);

    try {
      const params = {
        rfp_id: '',
        question: questionId,
        similarResponses: selectedChips.map(chip => chip.id),
        additionalContext: customContext,
        answerGenerationModel: answerGenerationModel.value,
        responseType: 'text',
        answerGenerationSettings: {
          IncludeQuestionaireDetails: false,
          IncludeFirmProfileDetails: false
        },
        prompt: answerGenerationModel.prompt,
        currentAnswerBlock: null,
        isFollowUp: false
      };

      console.log('🌊 Starting stream processing...');
      const reader = await aiService.generateAnswer(params);
      if (!reader) throw new Error('Response body is null');

      let accumulatedResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        accumulatedResponse += text;
        
        // Check for final response in streaming content
        const finalResponseMatch = /<final_response>([\s\S]*?)<\/final_response>/g.exec(accumulatedResponse);
        const textToShow = finalResponseMatch ? finalResponseMatch[1].trim() : accumulatedResponse;
        
        // Update streaming content
        setCurrentAnswer({
          time: Date.now(),
          blocks: [{
            id: `block-${Date.now()}`,
            type: "paragraph",
            data: { text: textToShow }
          }],
          version: "2.30.6"
        });
      }

      // Process final response
      const finalResponseMatch = /<final_response>([\s\S]*?)<\/final_response>/g.exec(accumulatedResponse);
      const finalText = finalResponseMatch ? finalResponseMatch[1].trim() : accumulatedResponse;
      setGeneratedAnswer(finalText);

      console.log('✅ Answer generation complete');
    } catch (error) {
      console.error('❌ Error generating answer:', error);
      setError('Failed to generate answer. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    console.log('🔄 Resetting Smart Assistant state');
    setQuery('');
    setCurrentQuestion('');
    setCustomContext('')
    setResults([]);
    setSelectedChips([]);
    setGeneratedAnswer('');
    setError(null);
    setCurrentBatch(0);
    setHasMore(true);
    setLoadingMore(false);
    setIsGenerating(false);
    setCurrentAnswer(null);
    setIsStreaming(false);
    setQuestionClassification(null);
    setIsDrawerOpen(true); // Always open drawer on reset
  };

  const isItemSelected = (resultId: string) => {
    return selectedChips.some(chip => chip.id === resultId);
  };

  const handleCreateQuestion = async (questionText: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await aiService.createQuestion(questionText);
    } catch (error) {
      setError('Failed to create question. Please try again.');
      console.error('Error creating question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyAnswer = async (shortcutType: string, customPrompt?: string) => {
    if (!currentAnswer || !questionId) return;

    setIsGenerating(true);
    setIsStreaming(true);
    setError(null);

    try {
      // Extract text content from current answer
      const paragraphBlocks = currentAnswer.blocks.filter((block: any) => block.type === 'paragraph');
      const tableBlocks = currentAnswer.blocks.filter((block: any) => block.type === 'table');
      const combinedText = paragraphBlocks.map((block: any) => block.data.text).join('\n\n');

      const params: any = {
        rfp_id: '',
        question: questionId,
        similarResponses: selectedChips.map(chip => chip.id),
        additionalContext: customContext,
        answerGenerationModel: answerGenerationModel.value,
        responseType: 'text',
        answerGenerationSettings: {
          IncludeQuestionaireDetails: false,
          IncludeFirmProfileDetails: false
        },
        prompt: answerGenerationModel.prompt,
        isFollowUp: true,
        currentContent: combinedText,
        shortcutType,
        customPrompt: customPrompt || ''
      };

      const reader = await aiService.generateAnswer(params);
      if (!reader) throw new Error('Response body is null');

      let accumulatedResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        accumulatedResponse += text;
        
        const finalResponseMatch = /<final_response>([\s\S]*?)<\/final_response>/g.exec(accumulatedResponse);
        const textToShow = finalResponseMatch ? finalResponseMatch[1].trim() : accumulatedResponse;
        
        // Create new editor block with tables preserved
        const newBlocks = [
          ...tableBlocks,
          {
            id: `block-${Date.now()}`,
            type: "paragraph",
            data: { text: textToShow }
          }
        ];

        setCurrentAnswer({
          time: Date.now(),
          blocks: newBlocks,
          version: currentAnswer.version
        });
      }

      const finalResponseMatch = /<final_response>([\s\S]*?)<\/final_response>/g.exec(accumulatedResponse);
      const finalText = finalResponseMatch ? finalResponseMatch[1].trim() : accumulatedResponse;

      // Create final blocks with tables preserved
      const finalBlocks = [
        ...tableBlocks,
        {
          id: `block-${Date.now()}`,
          type: "paragraph",
          data: { text: finalText }
        }
      ];

      const finalAnswer = {
        time: Date.now(),
        blocks: finalBlocks,
        version: currentAnswer.version
      };

      setCurrentAnswer(finalAnswer);
      setGeneratedAnswer(finalText);

    } catch (error) {
      console.error('Error modifying answer:', error);
      setError('Failed to modify answer. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  return {
    query,
    currentQuestion,
    isLoading,
    isGenerating,
    loadingMore,
    results,
    selectedChips,
    generatedAnswer,
    error,
    hasMore,
    setQuery,
    handleSubmit,
    handleSuggestedQuestion,
    handleAddChip,
    handleRemoveChip,
    handleGenerateAnswer,
    handleReset,
    handleLoadMore,
    isItemSelected,
    handleCreateQuestion,
    questionId,
    isStreaming,
    currentAnswer,
    isDrawerOpen,
    setIsDrawerOpen,
    questionClassification,
    customContext,
    setCustomContext,
    handleModifyAnswer,
    autoSelectEnabled,
    setAutoSelectEnabled,
  };
};