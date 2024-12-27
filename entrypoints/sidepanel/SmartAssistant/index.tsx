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
  const [isCustomContextOpen, setIsCustomContextOpen] = useState(false);

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
    customContext,
    setCustomContext,
    handleModifyAnswer,
    autoSelectEnabled,
    setAutoSelectEnabled,
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
    if (currentAnswer) {
      // Extract text from each block and join with line breaks
      const textToCopy = currentAnswer.blocks.map((block: any) => block.data.text).join('\n');
      
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    }
  }, [currentAnswer]);

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
              <div className="flex items-center justify-center mt-4 space-x-2">
                <span className="text-xs text-muted-foreground">Auto-select text</span>
                <div className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={autoSelectEnabled}
                    onChange={(e) => setAutoSelectEnabled(e.target.checked)}
                    className="peer sr-only"
                    id="auto-select"
                  />
                  <label
                    htmlFor="auto-select"
                    className="relative h-3 w-5 cursor-pointer rounded-full bg-gray-200 
                    transition-colors duration-200 ease-in-out peer-checked:bg-green-500
                    after:absolute after:left-[2px] after:top-[1px] after:h-2 after:w-2
                    after:rounded-full after:bg-white after:transition-transform 
                    after:duration-200 peer-checked:after:translate-x-2"
                  />
                </div>
              </div>
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
            <div className="flex-1 overflow-auto z-0">
              <div className="p-4 space-y-4">
                <div ref={controlsSectionRef} className="space-y-2" id="controls-section">
                  <div className="flex justify-center mb-2">
                    {isLoading ? (
                      <Skeleton className="h-5 w-16" />
                    ) : currentQuestion && (
                      <ClassificationBadge initialType={questionClassification} />
                    )}
                  </div>
                  <SelectedChips chips={selectedChips} onRemove={handleRemoveChip} />
                  {selectedChips.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center">Select context below</p>
                  )}
                  <div className="">
                    <Button 
                      onClick={() => setIsCustomContextOpen(!isCustomContextOpen)}
                      variant="link"
                      size="sm"
                      className="w-full text-xs"
                    >
                      {isCustomContextOpen ? 'Hide Custom Context' : '+ Add Custom Context'}
                    </Button>
                    {isCustomContextOpen && (
                      <textarea
                        value={customContext}
                        onChange={(e) => setCustomContext(e.target.value)}
                        placeholder="Add custom context..."
                        className="w-full min-h-[60px] mt-1 p-2 text-sm rounded-sm border"
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleGenerateAnswerWithDrawer}
                      disabled={isGenerating || selectedChips.length === 0}
                      className="flex-1"
                    >
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                    {generatedAnswer && (
                      <Button 
                        onClick={handleCopyAnswer}
                        disabled={isCopied}
                        variant="outline"
                      >
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="relative z-0">
                  {(isGenerating || generatedAnswer) && (
                    <AnswerTextArea 
                      answer={currentAnswer}
                      isLoading={isGenerating}
                      isStreaming={isStreaming}
                      streamingContent={currentAnswer}
                      modifyAnswer={handleModifyAnswer}
                      isGenerating={isGenerating}
                    />
                  )}
                </div>
              </div>
            </div>

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