import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { EditorContainer } from '@/components/EditorJs/EditorJs';
import { Button } from "@/components/ui/button";
import { RulerIcon, ScissorsIcon, SpellCheckIcon, DramaIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  modifyAnswer?: (shortcutType: string) => void;
  isGenerating?: boolean;
}

const AnswerTextArea = ({ 
  answer, 
  isLoading, 
  isStreaming, 
  streamingContent,
  modifyAnswer,
  isGenerating 
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

  const renderModificationButtons = () => (
    <div className="flex gap-1 p-1 border-b border-gray-300">
      <Button 
        onClick={() => modifyAnswer?.("longer")} 
        variant="ghost" 
        size="sm"
        className="h-7 px-2 text-xs"
        disabled={isGenerating}
      >
        <RulerIcon className="size-3 mr-1" />
        Longer
      </Button>
      <Button 
        onClick={() => modifyAnswer?.("concise")} 
        variant="ghost" 
        size="sm"
        className="h-7 px-2 text-xs"
        disabled={isGenerating}
      >
        <ScissorsIcon className="size-3 mr-1" />
        Concise
      </Button>
      <Button 
        onClick={() => modifyAnswer?.("grammar")} 
        variant="ghost" 
        size="sm"
        className="h-7 px-2 text-xs"
        disabled={isGenerating}
      >
        <SpellCheckIcon className="size-3 mr-1" />
        Grammar
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={isGenerating}
          >
            <DramaIcon className="size-3 mr-1" />
            Tone
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => modifyAnswer?.("tone-formal")}>Formal</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => modifyAnswer?.("tone-friendly")}>Friendly</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => modifyAnswer?.("tone-persuasive")}>Persuasive</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => modifyAnswer?.("tone-confident")}>Confident</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <>
      {isStreaming ? (
        <div className="border border-gray-300 rounded-t-md">
          {renderModificationButtons()}
          <div 
            ref={streamingDivRef}
            className="w-full p-4 pl-8 overflow-auto"
            style={{ 
              minHeight: '250px',
              maxHeight: '500px',
              fontSize: '14px'
            }}
          >
            {filteredStreamingText}
          </div>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-t-md">
          {renderModificationButtons()}
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