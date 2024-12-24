import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    adjustHeight();
  }, [query]);

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex space-x-2 w-full">
        <textarea
          ref={textareaRef}
          placeholder="Ask about TechInnovate..."
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            adjustHeight();
          }}
          className="flex-grow resize-none overflow-hidden min-h-[40px] max-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          rows={1}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </form>
  );
};

export default QueryInput;