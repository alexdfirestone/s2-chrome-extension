import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
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
  const streamingDivRef = useRef<HTMLDivElement>(null);

  // Add useEffect to handle auto-scrolling
  useEffect(() => {
    if (isStreaming && streamingDivRef.current) {
      streamingDivRef.current.scrollTop = streamingDivRef.current.scrollHeight;
    }
  }, [streamingContent, isStreaming]);

  // Filter out final_response tags from streaming content
  const filteredStreamingText = streamingContent?.blocks[0]?.data?.text
    ?.replace(/<final_response>|<\/final_response>/g, '') || '';

  // Use streaming content if available, otherwise use answer
  const editorValue = streamingContent || answer

  return (
    <>
      {isStreaming ? (
        <div 
          ref={streamingDivRef}
          className="w-full p-4 pl-8 border border-gray-300 rounded-t-md overflow-auto"
          style={{ 
            minHeight: '250px',
            maxHeight: '500px',
            fontSize: '14px'
          }}
        >
          {filteredStreamingText}
        </div>
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
    </>
  );
};

export default AnswerTextArea;