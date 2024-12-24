import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ActiveQueryProps {
    currentQuestion: string;
    onReset: () => void;
  }
  
  export function ActiveQuery({ currentQuestion, onReset }: ActiveQueryProps) {
    return (
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-xs font-medium text-muted-foreground">Current Question</p>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium leading-normal flex-1 break-words">{currentQuestion}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="shrink-0 border-dashed"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              New
            </Button>
          </div>
        </div>
      </div>
    );
  }