import { Button } from '@/components/ui/button';
import { DemoQuestion } from '../types';

interface SuggestedQuestionsProps {
  questions: DemoQuestion[];
  onQuestionSelect: (question: string) => void;
}

const SuggestedQuestions = ({ questions, onQuestionSelect }: SuggestedQuestionsProps) => (
  <div className="w-full max-w-2xl">
    <div className="grid grid-cols-1 gap-4">
      {questions.map((item, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onQuestionSelect(item.question)}
          className="text-left h-auto whitespace-normal p-4"
        >
          {item.question}
        </Button>
      ))}
    </div>
  </div>
);

export default SuggestedQuestions