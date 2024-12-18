import { useState } from 'react';
import { AIPromptService } from '../services/api';
import { DemoQuestion, ResultItem } from '../types';

const aiService = new AIPromptService();

export const useSmartAssistant = (demoData: DemoQuestion[]) => {
  const [query, setQuery] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentBatch, setCurrentBatch] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentQuestion(query);
    setCurrentBatch(0); // Reset batch count on new search
    setHasMore(true); // Reset hasMore flag

    try {
      const searchResults = await aiService.searchSimilar({
        contentToSearch: query,
        k: 5,
        returnAnswer: true,
        contentType: 'BOTH',
        searchType: 'HYBRID'
      });

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
      setCurrentBatch(1); // Set to 1 since we've loaded the first batch
    } catch (error) {
      setError('Failed to get results. Please try again.');
      console.error('Error searching similar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      
      const moreResults = await aiService.searchSimilar({
        contentToSearch: query,
        k: 5,
        offset: currentBatch * 5, // Add offset for pagination
        returnAnswer: true,
        contentType: 'BOTH',
        searchType: 'HYBRID'
      });

      if (moreResults.length === 0) {
        setHasMore(false);
        return;
      }

      const transformedResults = moreResults.map((result, index) => ({
        id: result.questionData.question_id || `result-${currentBatch * 5 + index}`,
        score: result.score || 0,
        rank: currentBatch * 5 + index + 1,
        title: result.metadata.parent_name || 'Untitled',
        content: result.questionData.text || '',
        metadata: {
          ...result.metadata,
          frequency: result.metadata.frequency || undefined,
          status: result.metadata.status || undefined
        },
        answer_block: result.questionData.answer_block || ''
      }));

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

  const handleAddChip = (title: string) => {
    if (!selectedChips.includes(title)) {
      setSelectedChips([...selectedChips, title]);
    }
  };

  const handleRemoveChip = (title: string) => {
    setSelectedChips(selectedChips.filter(chip => chip !== title));
  };

  const handleGenerateAnswer = async () => {
    if (selectedChips.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.generateAnswer(selectedChips);
      setGeneratedAnswer(response.answer);
    } catch (error) {
      setError('Failed to generate answer. Please try again.');
      console.error('Error generating answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setCurrentQuestion('');
    setResults([]);
    setSelectedChips([]);
    setGeneratedAnswer('');
    setError(null);
    setCurrentBatch(0);
    setHasMore(true);
    setLoadingMore(false);
  };

  return {
    query,
    currentQuestion,
    isLoading,
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
  };
};