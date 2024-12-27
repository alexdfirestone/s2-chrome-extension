// New component for individual card
import { PlusCircleIcon, Copy, Star, StarHalf, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResultItem } from '../types';
import {ViewOnlyEditorContainer } from '../../../../components/EditorJs/EditorJs';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export interface ResultCardProps {
  result: ResultItem;
  isSelected: boolean;
  onSelect: (result: ResultItem) => void;
  onUseExactAnswer: (answer: any) => void;
}

const getScoreBadge = (score: number) => {
  const roundedScore = Math.round(score * 100);
  let icon;
  let color;

  if (score >= 0.9) {
    icon = <Star className="w-3 h-3" />;
    color = "bg-green-100 text-green-800 hover:bg-green-100";
  } else if (score >= 0.7) {
    icon = <StarHalf className="w-3 h-3" />;
    color = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
  } else {
    icon = <StarOff className="w-3 h-3" />;
    color = "bg-red-100 text-red-800 hover:bg-red-100";
  }

  return (
    <Badge variant="secondary" className={`text-xs px-2 py-0.5 flex items-center gap-1 ${color}`}>
      {icon}
      <span className="font-medium">Similarity:</span> {roundedScore}%
    </Badge>
  );
};

export const ResultCard = ({ result, isSelected, onSelect, onUseExactAnswer }: ResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
            {getScoreBadge(result.score)}
            <p className="text-xs text-gray-500">
              Last Saved: {result.metadata.last_saved}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-sm">
            Q: {result.content}
          </p>
          <div className={`text-sm text-gray-700 leading-relaxed relative ${!isExpanded ? 'max-h-[200px] overflow-hidden' : ''}`}>
            <ViewOnlyEditorContainer 
              value={result.answer_block}
              uniqueId={`result-card-${result.id}`}
              backgroundColor='#F9F9FB'
              minHeight={50}
            />
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#F9F9FB] to-transparent" />
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary/80 hover:text-primary transition-colors mt-1"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-auto sm:h-8 py-2 sm:py-0 flex-1 flex items-center justify-center gap-2 px-3 hover:bg-primary/10 border-primary/20 text-primary"
            onClick={() => onSelect(result)}
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
            onClick={() => {
              const textToCopy = result.answer_block.blocks.map((block: any) => block.data.text).join('\n');
              navigator.clipboard.writeText(textToCopy);
            }}
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs whitespace-nowrap">
              Copy Answer
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};