import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { ResultItem } from '../types';
import { useState } from 'react';
import { ViewOnlyEditorContainer } from '@/components/EditorJs/EditorJs';

interface SelectedChipsProps {
  chips: ResultItem[];
  onRemove: (id: string) => void;
}

const SelectedChips = ({ chips, onRemove }: SelectedChipsProps) => {
  const [expandedChips, setExpandedChips] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedChips(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <div key={chip.id} className="bg-secondary text-secondary-foreground rounded-lg w-full max-w-xs">
          <div className="px-3 py-1 text-sm flex items-center justify-between">
            <span className="truncate flex-1">{chip.content}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleExpand(chip.id)}
                className="focus:outline-none"
                aria-label={expandedChips[chip.id] ? "Collapse answer" : "Expand answer"}
              >
                {expandedChips[chip.id] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => onRemove(chip.id)}
                className="focus:outline-none"
                aria-label={`Remove ${chip.content}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          {expandedChips[chip.id] && (
            <div className="px-3 py-2 text-sm border-t border-secondary-foreground/10">
              <ViewOnlyEditorContainer 
                value={chip.answer_block}
                uniqueId={`chip-${chip.id}`}
                backgroundColor='#F9F9FB'
                minHeight={25}
            />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectedChips;