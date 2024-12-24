import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableSectionProps {
    title: string;
    subtitle?: string | number;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }
  
  export function ExpandableSection({ 
    title, 
    subtitle, 
    isExpanded, 
    onToggle, 
    children 
  }: ExpandableSectionProps) {
    return (
      <div className="flex flex-col min-h-0">
        <button 
          onClick={onToggle}
          className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{title}</span>
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
          {isExpanded ? 
            <ChevronUp className="w-4 h-4 text-muted-foreground" /> : 
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          }
        </button>
        
        <div className={`overflow-auto transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-[500px]' : 'max-h-0'
        }`}>
          {children}
        </div>
      </div>
    );
  }