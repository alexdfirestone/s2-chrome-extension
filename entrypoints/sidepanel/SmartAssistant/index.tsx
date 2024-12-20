'use client';

import { RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSmartAssistant } from './hooks/useSmartAssistant';
import SuggestedQuestions from './components/SuggestedQuestions'
import QueryInput from './components/QueryInput';
import SelectedChips from './components/SelectedChips';
import ResultCards from './components/ResultCards';
import GeneratedAnswer from './components/AnswerTextArea';
import { ErrorMessage } from './components/ErrorMessage';
import { useState, useMemo } from 'react';
import { AIPromptService } from './services/api';
import AnswerTextArea from './components/AnswerTextArea';

export function SmartAssistant() {
  const {
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
    isStreaming,
    currentAnswer    
  } = useSmartAssistant();

  const aiService = useMemo(() => new AIPromptService(), []);

  const [isAnswerExpanded, setIsAnswerExpanded] = useState(true);
  const [isResultsExpanded, setIsResultsExpanded] = useState(true);

  const handleUseExactAnswer = (answer: any) => {
    console.log('Using exact answer:', answer);
  };

  return (
    <div className="h-full flex flex-col">
      {currentQuestion && (
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-lg font-semibold truncate flex-1 mr-2">{currentQuestion}</h2>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        {error && <ErrorMessage message={error} />}
        {!currentQuestion ? (
          <div className="h-full flex flex-col items-center justify-center p-6 space-y-8">
            <SuggestedQuestions onQuestionSelect={handleSuggestedQuestion} />
            <QueryInput
              query={query}
              isLoading={isLoading}
              onQueryChange={setQuery}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex flex-col min-h-0 flex-1">
              <button 
                onClick={() => setIsAnswerExpanded(!isAnswerExpanded)}
                className="flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/40"
              >
                <span className="font-medium">Answer Generation</span>
                {isAnswerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className={`overflow-auto transition-all ${
                isAnswerExpanded ? 'flex-1' : 'h-0'
              }`}>
                <div className="p-4">
                  {generatedAnswer && (
                    <AnswerTextArea 
                      answer={generatedAnswer}
                      isLoading={isStreaming}
                      isStreaming={isStreaming}
                      streamingContent={currentAnswer}
                    />
                  )}
                  <SelectedChips chips={selectedChips} onRemove={handleRemoveChip} />
                  <Button 
                    onClick={handleGenerateAnswer} 
                    disabled={isLoading || selectedChips.length === 0}
                    className="w-full mt-4"
                  >
                    {isLoading ? 'Generating...' : 'Generate Answer'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col min-h-0 flex-1">
              <button 
                onClick={() => setIsResultsExpanded(!isResultsExpanded)}
                className="flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/40"
              >
                <span className="font-medium">Search Results ({results.length})</span>
                {isResultsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className={`overflow-auto transition-all ${
                isResultsExpanded ? 'flex-1' : 'h-0'
              }`}>
                <ResultCards 
                  results={results} 
                  onSelect={handleAddChip}
                  onUseExactAnswer={handleUseExactAnswer}
                  hasMore={hasMore}
                  isLoading={loadingMore}
                  onLoadMore={handleLoadMore}
                  selectedIds={selectedChips.map(chip => chip.id)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartAssistant;