import { Button } from '@/components/ui/button';
import { Send, Loader2, ArrowUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface QueryInputProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const QueryInput = ({ query, isLoading, onQueryChange, onSubmit }: QueryInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [query]);

  return (
    <form onSubmit={onSubmit} className="w-full relative">
      <textarea
        ref={textareaRef}
        placeholder="Ask a question..."
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          adjustHeight();
        }}
        onKeyDown={handleKeyDown}
        className="w-full resize-none overflow-hidden min-h-[40px] max-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        rows={1}
        style={{ paddingRight: query ? '3rem' : '1rem' }}
      />
      {query && (
        <div className="absolute right-2 bottom-2">
          <Button 
            type="submit" 
            disabled={isLoading}
            size="sm"
            variant="default"
            className="h-8 w-8 p-0 hover:bg-gray-700 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" /> 
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

export default QueryInput;