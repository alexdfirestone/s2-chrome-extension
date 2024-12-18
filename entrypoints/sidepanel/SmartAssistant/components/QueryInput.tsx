import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface QueryInputProps {
  query: string;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const QueryInput = ({ query, isLoading, onQueryChange, onSubmit }: QueryInputProps) => (
  <form onSubmit={onSubmit} className="flex space-x-2 p-4 w-full max-w-2xl">
    <Input
      type="text"
      placeholder="Ask about TechInnovate..."
      value={query}
      onChange={(e) => onQueryChange(e.target.value)}
      className="flex-grow"
    />
    <Button type="submit" disabled={isLoading}>
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
    </Button>
  </form>
);

export default QueryInput