
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface CartTaxSelectorProps {
  taxRate: number;
  setTaxRate: (rate: number) => void;
  onFreeItemClick: () => void;
}

const CartTaxSelector: React.FC<CartTaxSelectorProps> = ({
  taxRate,
  setTaxRate,
  onFreeItemClick,
}) => {
  const taxOptions = [0, 8, 10];

  return (
    <div className="fixed bottom-0 right-4 left-auto w-80 lg:w-96 z-40">
      <div className="glass rounded-t-xl p-4 border-t">
        <div className="flex gap-2">
          {taxOptions.map((rate) => (
            <Button
              key={rate}
              variant={rate === taxRate ? "default" : "outline"}
              className={cn(
                "flex-1 py-6 text-lg font-medium transition-all",
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
            className="flex-1 py-6 text-lg font-medium border border-input hover:bg-accent hover:text-accent-foreground transition-all"
            onClick={onFreeItemClick}
          >
            <Gift className="mr-2 h-5 w-5" />
            無料
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartTaxSelector;
