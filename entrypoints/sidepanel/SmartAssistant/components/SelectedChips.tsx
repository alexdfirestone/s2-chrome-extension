import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { ResultItem } from '../types';
import { useState } from 'react';
import { ViewOnlyEditorContainer } from '@/components/EditorJs/EditorJs';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="relative pt-6 px-3 overflow-hidden">
      <AnimatePresence>
        {chips.map((chip, index) => (
          <motion.div
            key={chip.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              duration: 0.2,
              ease: [0.32, 0.72, 0, 1]
            }}
            style={{
              transform: expandedChips[chip.id] ? 'translateY(0)' : `translateY(-${index * 4}px)`,
              zIndex: expandedChips[chip.id] ? 50 : 40 - index,
              position: 'relative'
            }}
            className={`
              relative w-full bg-secondary text-secondary-foreground rounded-lg 
              transition-all duration-200 ease-in-out
              hover:translate-y-0
              ${expandedChips[chip.id] 
                ? 'shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)]' 
                : 'shadow-[0_2px_4px_-2px_rgba(0,0,0,0.05)]'}
            `}
          >
            <div 
              className={`
                px-4 py-2.5 text-sm flex items-center justify-between
                border-l-4 border-primary/30 bg-secondary/98 backdrop-blur-sm
                rounded-l-lg
              `}
            >
              <span className="truncate flex-1 font-medium">{chip.content}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleExpand(chip.id)}
                  className="text-secondary-foreground/70 hover:text-secondary-foreground 
                            transition-colors focus:outline-none"
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
                  className="text-secondary-foreground/70 hover:text-destructive 
                            transition-colors focus:outline-none"
                  aria-label={`Remove ${chip.content}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {expandedChips[chip.id] && (
              <div className="px-4 py-3 text-sm border-t border-secondary-foreground/10">
                <ViewOnlyEditorContainer 
                  value={chip.answer_block}
                  uniqueId={`chip-${chip.id}`}
                  backgroundColor='#F9F9FB'
                  minHeight={25}
                />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SelectedChips;