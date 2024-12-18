// New component for individual card
import { PlusCircleIcon, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResultItem } from '../types';

interface ResultCardProps {
  result: ResultItem;
  isSelected: boolean;
  onSelect: (content: string) => void;
  onUseExactAnswer: (answer: any) => void;
}

export const ResultCard = ({ result, isSelected, onSelect, onUseExactAnswer }: ResultCardProps) => {
  return (
    <div
      className={`p-5 rounded-md transition-all duration-300 ${
        isSelected ? "bg-primary/5 border-primary/20" : ""
      } border shadow-sm`}
      style={{ backgroundColor: isSelected ? undefined : '#F9F9FB' }}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm text-primary/80 text-left">
              {result.metadata.parent_name}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10">
              Score: {result.score.toFixed(2)}
            </span>
            <p className="text-xs text-gray-500">
              Last Saved: {result.metadata.last_saved}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-sm">
            Q: {result.title}
          </p>
          <div className="text-sm text-gray-700 leading-relaxed">
            {result.content}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-auto sm:h-8 py-2 sm:py-0 flex-1 flex items-center justify-center gap-2 px-3 hover:bg-primary/10 border-primary/20 text-primary"
            onClick={() => onSelect(result.content)}
            disabled={isSelected}
          >
            <PlusCircleIcon
              className={`h-4 w-4 ${isSelected ? "text-primary" : "text-primary/60"}`}
            />
            <span className="text-xs whitespace-nowrap">
              {isSelected ? "Added" : "Include in Answer"}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-auto sm:h-8 py-2 sm:py-0 flex-1 flex items-center justify-center gap-2 px-3 hover:bg-primary/10 border-primary/20 text-primary"
            onClick={() => onUseExactAnswer(result.answer_block)}
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs whitespace-nowrap">
              Use As Written
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};