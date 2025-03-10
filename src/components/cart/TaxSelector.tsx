
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface TaxSelectorProps {
  taxRate: number;
  setTaxRate: (rate: number) => void;
  taxOptions: number[];
  onFreeItemClick: () => void;
}

const TaxSelector: React.FC<TaxSelectorProps> = ({
  taxRate,
  setTaxRate,
  taxOptions,
  onFreeItemClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex gap-2">
        {taxOptions.map((rate) => (
          <Button
            key={rate}
            variant={rate === taxRate ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 min-w-[40px] text-xs px-2",
              rate === taxRate 
                ? "bg-primary text-primary-foreground" 
                : "border border-input hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setTaxRate(rate)}
          >
            {rate}%
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs px-2 border border-input hover:bg-accent hover:text-accent-foreground"
          onClick={onFreeItemClick}
        >
          <Gift className="mr-1 h-3 w-3" />
          無料
        </Button>
      </div>
    </div>
  );
};

export default TaxSelector;
