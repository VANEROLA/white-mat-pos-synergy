
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  description?: string;
  tooltipText: string;
}

export const SettingRow: React.FC<SettingRowProps> = ({ 
  icon, 
  label, 
  checked, 
  onChange, 
  disabled = false,
  description,
  tooltipText
}) => {
  return (
    <div className="group">
      <div className="flex items-center justify-between py-3 transition-colors hover:bg-accent/20 px-3 rounded-lg">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center space-x-4 cursor-help">
              <div className={`p-2 rounded-full ${checked ? 'bg-primary/10' : 'bg-muted'}`}>
                {icon}
              </div>
              <div>
                <Label htmlFor={label} className="text-base font-medium">{label}</Label>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{label}</h4>
              <p className="text-sm text-muted-foreground">
                {tooltipText}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <Switch 
          id={label} 
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      <Separator />
    </div>
  );
};
