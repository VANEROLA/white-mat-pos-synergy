
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Clock } from "lucide-react";

interface AutoLockTimeSelectorProps {
  autoLockTimeout: number;
  onChange: (minutes: number) => void;
}

export const AutoLockTimeSelector: React.FC<AutoLockTimeSelectorProps> = ({ 
  autoLockTimeout, 
  onChange 
}) => {
  return (
    <div className="pl-6 ml-4 border-l-2 border-muted py-4">
      <Label htmlFor="lock-timeout" className="text-base font-medium mb-3 block">
        自動ロックまでの時間（分）
      </Label>
      <div className="flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={autoLockTimeout === 1 ? "default" : "outline"} 
                onClick={() => onChange(1)}
                className="w-16 h-10"
              >
                1分
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>最短の自動ロック時間です。セキュリティを最も重視する設定です。</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={autoLockTimeout === 5 ? "default" : "outline"}
                onClick={() => onChange(5)}
                className="w-16 h-10"
              >
                5分
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>バランスの取れた自動ロック時間です。多くの状況で推奨されます。</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={autoLockTimeout === 10 ? "default" : "outline"}
                onClick={() => onChange(10)}
                className="w-16 h-10"
              >
                10分
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>長めの自動ロック時間です。信頼できる環境での使用に適しています。</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={autoLockTimeout === 30 ? "default" : "outline"}
                onClick={() => onChange(30)}
                className="w-16 h-10"
              >
                30分
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>最も長い自動ロック時間です。安全な環境での使用に適しています。</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mt-3 text-sm text-muted-foreground flex items-center">
        <Clock size={14} className="mr-1" />
        <span>操作がない場合、{autoLockTimeout}分後に画面がロックされます</span>
      </div>
    </div>
  );
};
