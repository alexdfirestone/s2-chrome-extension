import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { ResultCard } from './ResultCard';
import { ResultItem } from '../types';
import { Skeleton } from '@/components/ui/skeleton';

export interface ResultCardsProps {
  results: ResultItem[];
  onSelect: (result: ResultItem) => void;
  onUseExactAnswer: (answer: any) => void;
  selectedIds: string[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
}

const LoadingSkeleton = () => (
  <div className="px-4 space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="p-4 rounded-md border space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-3 w-1/5" />
      </div>
    ))}
  </div>
);

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

  if (isLoading && results.length === 0) {
    return <LoadingSkeleton />;
  }

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