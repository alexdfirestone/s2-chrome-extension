import { X } from 'lucide-react';

interface SelectedChipsProps {
  chips: string[];
  onRemove: (chip: string) => void;
}

const SelectedChips = ({ chips, onRemove }: SelectedChipsProps) => (
  <div className="flex flex-wrap gap-2">
    {chips.map((chip, index) => (
      <div key={index} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center justify-between w-full max-w-xs">
        <span className="truncate flex-1">{chip}</span>
        <button
          onClick={() => onRemove(chip)}
          className="ml-2 focus:outline-none"
          aria-label={`Remove ${chip}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
);

export default SelectedChips