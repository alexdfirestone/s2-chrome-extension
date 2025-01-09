import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ResultCards from './ResultCards';
import SelectedChips from './SelectedChips';
import { ResultItem } from '../types';

interface DrawerSystemProps {
  // Top drawer props
  topTitle: string;
  topSubtitle?: string;
  topChildren: React.ReactNode;
  topFooter?: React.ReactNode;
  // Bottom drawer props
  bottomTitle: string;
  bottomSubtitle?: string;
  results: any[];
  onSelect: (result: any) => void;
  onUseExactAnswer: (answer: any) => void;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
  selectedIds: string[];
  selectedChips: ResultItem[];
  handleRemoveChip: (chip: string) => void;
  handleGenerateAnswer: () => void;
}

export function DrawerSystem({
  topTitle,
  topSubtitle,
  topChildren,
  bottomTitle,
  bottomSubtitle,
  results,
  onSelect,
  onUseExactAnswer,
  hasMore,
  isLoading,
  onLoadMore,
  selectedIds,
  selectedChips,
  handleRemoveChip,
  handleGenerateAnswer,
}: DrawerSystemProps) {
  const [activeDrawer, setActiveDrawer] = useState<'top' | 'bottom'>('bottom');
  const [availableHeight, setAvailableHeight] = useState(0);
  const [topCollapsedHeight, setTopCollapsedHeight] = useState(0);
  const [bottomCollapsedHeight, setBottomCollapsedHeight] = useState(0);

  const topHeaderRef = useRef<HTMLDivElement>(null);
  const bottomHeaderRef = useRef<HTMLDivElement>(null);
  const topChipsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateHeights = () => {
      // Add a small delay to ensure DOM is fully rendered
      setTimeout(() => {
        if (containerRef.current) {
          const viewportHeight = window.innerHeight;
          const containerTop = containerRef.current.getBoundingClientRect().top;
          setAvailableHeight(viewportHeight - containerTop);
        }

        // Calculate collapsed heights
        const topHeaderHeight = topHeaderRef.current?.offsetHeight || 0;
        const bottomHeaderHeight = bottomHeaderRef.current?.offsetHeight || 0;
        const topChipsAreaHeight = topChipsRef.current?.offsetHeight || 0;

        setTopCollapsedHeight(topHeaderHeight + topChipsAreaHeight);
        setBottomCollapsedHeight(bottomHeaderHeight);
      }, 0);
    };

    calculateHeights();
    window.addEventListener('resize', calculateHeights);
    
    // Recalculate when chips change
    const observer = new MutationObserver(calculateHeights);
    if (topChipsRef.current) {
      observer.observe(topChipsRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
    }

    return () => {
      window.removeEventListener('resize', calculateHeights);
      observer.disconnect();
    };
  }, [selectedChips, isLoading]);

  const expandedHeight = availableHeight - (activeDrawer === 'top' ? bottomCollapsedHeight : topCollapsedHeight);

  return (
    <div ref={containerRef} className="fixed inset-0 flex flex-col">
      {/* Top Drawer */}
      <div className="bg-muted border-b overflow-auto flex-1">
        <div className="flex flex-col">
          <div 
            ref={topHeaderRef}
            onClick={() => setActiveDrawer(activeDrawer === 'top' ? 'bottom' : 'top')}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/10"
          >
            <div className="flex items-center gap-2 flex-1">
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-300 ${
                  activeDrawer === 'top' ? 'rotate-180' : ''
                }`} 
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{topTitle}</span>
                {activeDrawer !== 'top' && topSubtitle && (
                  <span className="text-xs text-muted-foreground">{topSubtitle}</span>
                )}
              </div>
            </div>
          </div>

          <div ref={topChipsRef}>
            <div className="px-4 pb-4 space-y-3">
              <div className="pt-3">
                <SelectedChips chips={selectedChips} onRemove={handleRemoveChip} />
              </div>
              <Button 
                onClick={handleGenerateAnswer} 
                disabled={isLoading || selectedChips.length === 0}
                variant="secondary"
                className="w-full"
              >
                {isLoading ? 'Generating...' : 'Generate Answer'}
              </Button>
            </div>
          </div>

          <div 
            style={{ height: activeDrawer === 'top' ? `${expandedHeight}px` : '0' }}
            className="overflow-auto transition-all duration-300 ease-in-out"
          >
            {topChildren}
          </div>
        </div>
      </div>

      {/* Bottom Drawer */}
      <div className={`border-t fixed bottom-0 left-0 right-0 ${activeDrawer === 'bottom' ? 'bg-muted' : 'bg-background'}`}>
        <div 
          ref={bottomHeaderRef}
          onClick={() => setActiveDrawer(activeDrawer === 'bottom' ? 'top' : 'bottom')}
          className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/10"
        >
          <div className="flex items-center gap-2 flex-1">
            <ChevronUp 
              className={`w-4 h-4 transition-transform duration-300 ${
                activeDrawer === 'bottom' ? 'rotate-180' : ''
              }`} 
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{bottomTitle}</span>
              {activeDrawer !== 'bottom' && bottomSubtitle && (
                <span className="text-xs text-muted-foreground">{bottomSubtitle}</span>
              )}
            </div>
          </div>
        </div>

        <div 
          style={{ height: activeDrawer === 'bottom' ? `${expandedHeight}px` : '0' }}
          className="overflow-auto transition-all duration-300 ease-in-out"
        >
          <ResultCards 
            results={results}
            onSelect={onSelect}
            onUseExactAnswer={onUseExactAnswer}
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={onLoadMore}
            selectedIds={selectedIds}
          />
        </div>
      </div>
    </div>
  );
}