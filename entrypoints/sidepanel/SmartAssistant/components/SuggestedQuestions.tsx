import React from 'react';
import { Button } from '@/components/ui/button';

interface DemoQuestion {
  question: string;
}

interface SuggestedQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

const demoQuestions: DemoQuestion[] = [
  {
    question: "💰 Could you describe your investment philosophy?"
  },
  {
    question: "⚖️ What is your approach to position sizing and portfolio rebalancing?"
  },
  {
    question: "💼 How do you identify, measure, and manage portfolio risk?"
  }
];

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onQuestionSelect }) => {
  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {demoQuestions.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            size="lg"
            onClick={() => onQuestionSelect(item.question)}
            className="text-left h-auto whitespace-normal p-4 hover:bg-gray-50"
          >
            {item.question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;