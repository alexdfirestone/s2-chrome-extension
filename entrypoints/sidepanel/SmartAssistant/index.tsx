'use client';

import { RotateCcw, ChevronUp, ChevronDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSmartAssistant } from './hooks/useSmartAssistant';
import SuggestedQuestions from './components/SuggestedQuestions'
import QueryInput from './components/QueryInput';
import SelectedChips from './components/SelectedChips';
import ResultCards from './components/ResultCards';
import GeneratedAnswer from './components/AnswerTextArea';
import { ErrorMessage } from './components/ErrorMessage';
import { useState, useMemo, useRef, useCallback } from 'react';
import { AIPromptService } from './services/api';
import AnswerTextArea from './components/AnswerTextArea';
import { ActiveQuery } from './components/ActiveQuery';
import { ExpandableSection } from './components/ExpandableSection';
import { ResultsDrawer } from './components/ResultsDrawer';
import { TopDrawer } from './components/TopDrawer';
import { DrawerSystem } from './components/DrawerSystem';

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

  const handleUseExactAnswer = (answer: any) => {
    console.log('Using exact answer:', answer);
  };

  const controlsSectionRef = useRef<HTMLDivElement>(null);

  const getControlsHeight = useCallback(() => {
    if (controlsSectionRef.current) {
      const rect = controlsSectionRef.current.getBoundingClientRect();
      return rect.bottom;
    }
    return 0;
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        {currentQuestion && <ActiveQuery currentQuestion={currentQuestion} onReset={handleReset} />}
      </div>
      
      <div className="flex-1 overflow-hidden relative">
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
          <div className="h-full flex flex-col relative">
            {/* Scrollable content area containing both controls and answer */}
            <div className="flex-1 overflow-auto z-0">
              <div className="p-4 space-y-6">
                {/* Controls Section - Add an id for easy scrolling */}
                <div 
                  ref={controlsSectionRef} 
                  className="space-y-3"
                  id="controls-section"
                >
                  <SelectedChips chips={selectedChips} onRemove={handleRemoveChip} />
                  <Button 
                    onClick={handleGenerateAnswer} 
                    disabled={isLoading || selectedChips.length === 0}
                    variant="secondary"
                    className="w-full"
                  >
                    {isLoading ? 'Generating...' : 'Generate Answer'}
                  </Button>
                </div>

                {/* Answer Section */}
                <div className="relative z-0">
                  {generatedAnswer && (
                    <AnswerTextArea 
                      answer={generatedAnswer}
                      isLoading={isStreaming}
                      isStreaming={isStreaming}
                      streamingContent={currentAnswer}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Smart Assistant Drawer */}
            <div className="border-t fixed bottom-0 left-0 right-0 bg-background z-50">
              <ResultsDrawer
                title="Smart Assistant"
                subtitle="Click to view the most relevant content from your knowledge vault"
                results={results}
                onSelect={handleAddChip}
                onUseExactAnswer={handleUseExactAnswer}
                hasMore={hasMore}
                isLoading={loadingMore}
                onLoadMore={handleLoadMore}
                selectedIds={selectedChips.map(chip => chip.id)}
                getControlsHeight={getControlsHeight}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartAssistant;