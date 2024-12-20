import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { ResultCard } from './ResultCard';
import { ResultItem } from '../types';

export interface ResultCardsProps {
  results: ResultItem[];
  onSelect: (result: ResultItem) => void;
  onUseExactAnswer: (answer: any) => void;
  selectedIds: string[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;

}

const ResultCards = ({ 
  results, 
  onSelect, 
  onUseExactAnswer, 
  selectedIds,
  hasMore,
  isLoading,
  onLoadMore
}: ResultCardsProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && !isLoading && hasMore && onLoadMore && results.length >= 5) {
      onLoadMore();
    }
  }, [inView, isLoading, hasMore, onLoadMore, results.length]);

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-4 w-full">
        {results.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
            isSelected={selectedIds.includes(result.id)}
            onSelect={onSelect}
            onUseExactAnswer={onUseExactAnswer}
          />
        ))}

        {(hasMore || isLoading) && results.length > 0 && (
          <div 
            ref={ref}
            className="py-2 flex justify-center items-center"
            style={{ minHeight: '40px' }}
          >
            {isLoading && (
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCards;