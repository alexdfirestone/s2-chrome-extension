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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              <p className="text-xs font-medium text-muted-foreground">Current Question</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-dashed"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              New
            </Button>
          </div>
          <p className="text-sm font-medium leading-normal break-words w-full">{currentQuestion}</p>
        </div>
      </div>
    );
  }