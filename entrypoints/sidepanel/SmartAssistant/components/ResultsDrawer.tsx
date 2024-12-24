import { ChevronUp } from 'lucide-react';
import ResultCards from './ResultCards';
import { useState, useRef, useEffect } from 'react';

interface ResultsDrawerProps {
  title: string;
  subtitle?: string;
  results: any[];
  onSelect: (result: any) => void;
  onUseExactAnswer: (answer: any) => void;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
  selectedIds: string[];
  getControlsHeight: () => number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResultsDrawer({
  title,
  subtitle,
  results,
  onSelect,
  onUseExactAnswer,
  hasMore,
  isLoading,
  onLoadMore,
  selectedIds,
  getControlsHeight,
  defaultOpen = false,
  open,
  onOpenChange,
}: ResultsDrawerProps) {
  const [isExpandedInternal, setIsExpandedInternal] = useState(defaultOpen);
  const isExpanded = open !== undefined ? open : isExpandedInternal;
  const setIsExpanded = onOpenChange || setIsExpandedInternal;
  const headerRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState(0);

  const handleExpandToggle = () => {
    if (!isExpanded) {
      // Find the controls section and scroll it into view instantly
      const controlsSection = document.getElementById('controls-section');
      controlsSection?.scrollIntoView({ 
        block: 'start',
      });
      
      setTimeout(() => {
        setIsExpanded(true);
      }, 50);
    } else {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const calculateHeight = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        if (isExpanded) {
          const controlsBottom = getControlsHeight();
          const viewportHeight = window.innerHeight;
          const newHeight = viewportHeight - controlsBottom;
          setDrawerHeight(Math.max(newHeight, headerHeight));
        } else {
          setDrawerHeight(headerHeight);
        }
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, [isExpanded, getControlsHeight, selectedIds]);

  useEffect(() => {
    if (defaultOpen) {
      const controlsSection = document.getElementById('controls-section');
      controlsSection?.scrollIntoView({ block: 'start' });
      
      // Calculate initial height
      if (headerRef.current) {
        const controlsBottom = getControlsHeight();
        const viewportHeight = window.innerHeight;
        const newHeight = viewportHeight - controlsBottom;
        setDrawerHeight(Math.max(newHeight, headerRef.current.offsetHeight));
      }
    }
  }, [defaultOpen, getControlsHeight]);

  return (
    <div 
      style={{ height: drawerHeight }} 
      className="transition-all duration-300 ease-in-out fixed bottom-0 left-0 right-0 z-[9999] flex flex-col shadow-lg rounded-t-lg bg-white"
    >
      <div 
        ref={headerRef}
        onClick={handleExpandToggle}
        className="flex-shrink-0 flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <ChevronUp className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            {!isExpanded && subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="w-full h-full">
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