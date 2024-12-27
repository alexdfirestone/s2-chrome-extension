'use client';

import { RotateCcw, ChevronUp, ChevronDown, PlusCircle, Wand2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSmartAssistant } from './hooks/useSmartAssistant';
import SuggestedQuestions from './components/SuggestedQuestions'
import QueryInput from './components/QueryInput';
import SelectedChips from './components/SelectedChips';
import ResultCards from './components/ResultCards';
import GeneratedAnswer from './components/AnswerTextArea';
import { ErrorMessage } from './components/ErrorMessage';
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { AIPromptService } from './services/api';
import AnswerTextArea from './components/AnswerTextArea';
import { ActiveQuery } from './components/ActiveQuery';
import { ExpandableSection } from './components/ExpandableSection';
import { ResultsDrawer } from './components/ResultsDrawer';
import { TopDrawer } from './components/TopDrawer';
import { DrawerSystem } from './components/DrawerSystem';
import { CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ClassificationBadge from './components/ClassificationBadge';
import { Skeleton } from "@/components/ui/skeleton";

export function SmartAssistant() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const {
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
    handleSubmit: originalHandleSubmit,
    handleSuggestedQuestion,
    handleAddChip,
    handleRemoveChip,
    handleGenerateAnswer,
    handleReset,
    handleLoadMore,
    isStreaming,
    currentAnswer,
    questionClassification,
  } = useSmartAssistant(isDrawerOpen, setIsDrawerOpen);

  const handleUseExactAnswer = (answer: any) => {
    console.log('Using exact answer:', answer);
  };

  const controlsSectionRef = useRef<HTMLDivElement>(null);

  const getControlsHeight = useCallback(() => {
    if (controlsSectionRef.current) {
      const rect = controlsSectionRef.current.getBoundingClientRect();
      return rect.bottom + 8;
    }
    return 0;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    setIsDrawerOpen(true);
    await originalHandleSubmit(e);
  };

  const handleSuggestedQuestionWithDrawer = (question: string) => {
    setIsDrawerOpen(true);
    handleSuggestedQuestion(question);
  };

  const handleGenerateAnswerWithDrawer = () => {
    setIsDrawerOpen(false);
    handleGenerateAnswer();
  };

  const handleCopyAnswer = useCallback(() => {
    if (generatedAnswer) {
      navigator.clipboard.writeText(generatedAnswer);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    }
  }, [generatedAnswer]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        {currentQuestion && <ActiveQuery currentQuestion={currentQuestion} onReset={handleReset} />}
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {error && <ErrorMessage message={error} />}
        
        {!currentQuestion ? (
          <div className="h-full flex flex-col items-center justify-center p-6 space-y-8">
            <CardHeader className="text-center">
              <h2 className="text-2xl font-bold">AdviserGPT</h2>
              <Badge variant={'secondary'}>Broswer Extension - Beta</Badge>
            </CardHeader>
            <SuggestedQuestions onQuestionSelect={handleSuggestedQuestionWithDrawer} />
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
                  <div className="flex justify-center">
                    {isLoading ? (
                      <Skeleton className="h-6 w-20" />
                    ) : currentQuestion && (
                      <ClassificationBadge initialType={questionClassification} />
                    )}
                  </div>
                  <SelectedChips chips={selectedChips} onRemove={handleRemoveChip} />
                  <div className="space-y-2">
                    {selectedChips.length === 0 && (
                      <p className="text-xs text-muted-foreground/75 text-center italic px-4">
                        Select context below to generate an answer
                      </p>
                    )}
                    <Button 
                      onClick={handleGenerateAnswerWithDrawer}
                      disabled={isGenerating || selectedChips.length === 0}
                      variant="default"
                      className="w-full"
                    >
                      {isGenerating ? 'Generating Answer...' : 'Generate Answer'}
                    </Button>
                    {generatedAnswer && (
                      <Button 
                        onClick={handleCopyAnswer}
                        disabled={isCopied}
                        variant="secondary"
                        className="w-full"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Answer
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Answer Section */}
                <div className="relative z-0">
                  {(isGenerating || generatedAnswer) && (
                    <AnswerTextArea 
                      answer={generatedAnswer}
                      isLoading={isGenerating}
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
                defaultOpen={true}
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                title="Smart Assistant"
                subtitle={isLoading ? "Searching..." : "Click to view the most relevant content from your knowledge vault"}
                results={results}
                onSelect={handleAddChip}
                onUseExactAnswer={handleUseExactAnswer}
                hasMore={hasMore}
                isLoading={loadingMore || isLoading}
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