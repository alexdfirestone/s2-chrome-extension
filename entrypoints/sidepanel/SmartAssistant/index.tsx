'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useSmartAssistant } from './hooks/useSmartAssistant';
import SuggestedQuestions from './components/SuggestedQuestions'
import QueryInput from './components/QueryInput';
import SelectedChips from './components/SelectedChips';
import ResultCards from './components/ResultCards';
import GeneratedAnswer from './components/GeneratedAnswer';
import { ErrorMessage } from './components/ErrorMessage';
import { useState, useMemo } from 'react';
import { AIPromptService } from './services/api';

const demoData = [
  {
    question: "What does our company do?",
    answers: [
      {
        title: "Core Business",
        content: "Our company, TechInnovate Solutions, specializes in developing cutting-edge software solutions for businesses across various industries."
      },
      {
        title: "Services",
        content: "We offer custom software development, cloud migration services, AI and machine learning integration, and cybersecurity consulting."
      }
    ]
  },
  {
    question: "How long has the company been in business?",
    answers: [
      {
        title: "Company History",
        content: "TechInnovate Solutions was founded in 2005 by a group of tech enthusiasts with a vision to transform the digital landscape."
      },
      {
        title: "Growth",
        content: "Over the past 18 years, we've grown from a small startup to a global company with offices in 5 countries and over 1000 employees."
      }
    ]
  }
];

export function SmartAssistant() {
  const {
    query,
    currentQuestion,
    isLoading,
    results,
    selectedChips,
    generatedAnswer,
    error,
    setQuery,
    handleSubmit,
    handleSuggestedQuestion,
    handleAddChip,
    handleRemoveChip,
    handleGenerateAnswer,
    handleReset,
    setResults,
    loadingMore,
    hasMore,
    handleLoadMore,
  } = useSmartAssistant(demoData);

  const aiService = useMemo(() => new AIPromptService(), []);

  const handleUseExactAnswer = (answer: any) => {
    console.log('Using exact answer:', answer);
  };

  return (
    <div className="flex flex-col h-full">
      {currentQuestion && (
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-semibold truncate flex-1 mr-2">{currentQuestion}</h2>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-hidden flex flex-col">
        {error && <ErrorMessage message={error} />}
        {!currentQuestion ? (
          <div className="flex-1 overflow-hidden flex flex-col items-center justify-center p-6 space-y-8">
            <SuggestedQuestions 
              questions={demoData} 
              onQuestionSelect={handleSuggestedQuestion} 
            />
            <QueryInput
              query={query}
              isLoading={isLoading}
              onQueryChange={setQuery}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex flex-col space-y-4 sticky top-0 bg-background z-10">
              {generatedAnswer && <GeneratedAnswer answer={generatedAnswer} />}
              <SelectedChips chips={selectedChips} onRemove={handleRemoveChip} />
              <Button 
                onClick={handleGenerateAnswer} 
                disabled={isLoading || selectedChips.length === 0}
                className="w-full"
              >
                {isLoading ? 'Generating...' : 'Generate Answer'}
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <ResultCards 
                  results={results} 
                  onSelect={handleAddChip}
                  onUseExactAnswer={handleUseExactAnswer}
                  selectedIds={selectedChips}
                  hasMore={hasMore}
                  isLoading={loadingMore}
                  onLoadMore={handleLoadMore}
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