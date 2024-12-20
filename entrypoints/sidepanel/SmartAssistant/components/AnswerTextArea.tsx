import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { EditorContainer } from '@/components/EditorJs/EditorJs';


interface AnswerTextAreaProps {
  answer: string;
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent?: {
    time: number;
    blocks: Array<{
      id: string;
      type: string;
      data: { text: string };
    }>;
    version: string;
  };
}

const AnswerTextArea = ({ 
  answer, 
  isLoading, 
  isStreaming, 
  streamingContent 
}: AnswerTextAreaProps) => {
  const [externalUpdateCounter, setExternalUpdateCounter] = useState(0);

  // Use streaming content if available, otherwise use answer
  const editorValue = streamingContent || {
    time: Date.now(),
    blocks: [
      {
        id: "answer-block",
        type: "paragraph",
        data: {
          text: answer
        }
      }
    ],
    version: "2.28.2"
  };

  return (
    <Card>
      <CardContent>
        {isStreaming ? (
          <textarea
            className="w-full p-4 pl-8 border border-gray-300 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
            value={answer}
            readOnly
            style={{ 
              resize: 'none',
              minHeight: '250px',
              overflow: 'hidden',
              fontSize: '14px'
            }}
          />
        ) : (
          <div className="border border-gray-300 rounded-t-md">
            <EditorContainer
              value={editorValue}
              readOnly={isLoading}
              externalUpdate={externalUpdateCounter}
              onChange={() => {}}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnswerTextArea;