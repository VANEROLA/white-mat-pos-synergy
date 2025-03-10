
import React from "react";
import { BadgePercent, Check } from "lucide-react";
import { useTax } from "@/contexts/TaxContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TaxRateSettings: React.FC = () => {
  const { taxRate, setTaxRate } = useTax();
  
  const taxOptions = [0, 8, 10];
  
  return (
    <div className="py-2">
      <h3 className="text-sm font-medium px-3 mb-2 flex items-center">
        <BadgePercent size={16} className="mr-2" />
        税率の設定
      </h3>
      
      <div className="flex items-center gap-2 px-3 mt-2">
        {taxOptions.map((rate) => (
          <Button
            key={rate}
            variant={rate === taxRate ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-9 min-w-[50px] font-medium",
              rate === taxRate ? "bg-primary text-primary-foreground" : ""
            )}
            onClick={() => setTaxRate(rate)}
          >
            {rate}%
            {rate === taxRate && <Check size={14} className="ml-1" />}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TaxRateSettings;
