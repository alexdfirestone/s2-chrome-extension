import { ChevronDown } from 'lucide-react';

interface TopDrawerProps {
  isExpanded: boolean;
  onToggle: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function TopDrawer({
  isExpanded,
  onToggle,
  title,
  subtitle,
  children,
  footer
}: TopDrawerProps) {
  return (
    <div className="bg-background border-b">
      {/* Preview Bar (always visible) */}
      <div 
        onClick={onToggle}
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/10"
      >
        <div className="flex items-center gap-2 flex-1">
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{title}</span>
            {!isExpanded && subtitle && (
              <span className="text-xs text-muted-foreground">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Drawer Content */}
      <div 
        className={`overflow-auto transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>

      {/* Footer (always visible) */}
      {footer && (
        <div className="border-t border-border/40">
          {footer}
        </div>
      )}
    </div>
  );
}