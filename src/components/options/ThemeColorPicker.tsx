
import React from "react";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ColorOptionProps {
  color: string;
  name: string;
  selectedColor: string;
}

interface ThemeColorPickerProps {
  themeColor: string;
  onChange: (value: string) => void;
}

const ColorOption: React.FC<ColorOptionProps> = ({ color, name, selectedColor }) => {
  // Create color styles dynamically
  const bgColorClass = `bg-${color}-500`;
  const hoverClass = `hover:bg-${color}-600`;
  const isSelected = color === selectedColor;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <ToggleGroupItem 
              value={color} 
              className={`${bgColorClass} ${hoverClass} h-8 w-8 rounded-full transition-transform hover:scale-110 ${isSelected ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
              style={isSelected ? {boxShadow: '0 0 0 2px white'} : {}}
              aria-label={`${name}テーマ`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}テーマ</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ themeColor, onChange }) => {
  const colorOptions = [
    { color: "blue", name: "ブルー" },
    { color: "green", name: "グリーン" },
    { color: "purple", name: "パープル" },
    { color: "rose", name: "ローズ" },
    { color: "amber", name: "アンバー" },
    { color: "teal", name: "ティール" },
    { color: "indigo", name: "インディゴ" },
    { color: "pink", name: "ピンク" }
  ];

  return (
    <div className="mt-6 mb-3">
      <Label className="text-base font-medium mb-3 block">テーマカラー</Label>
      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-3">
          アプリ全体のアクセントカラーを選択します。UIの主要な部分に適用されます。
        </p>
        <ToggleGroup 
          type="single" 
          value={themeColor}
          onValueChange={(value) => {
            if (value) {
              onChange(value);
              toast.success(`テーマカラーを${value}に変更しました`);
            }
          }}
          className="flex flex-wrap gap-2"
        >
          {colorOptions.map(option => (
            <ColorOption 
              key={option.color}
              color={option.color}
              name={option.name}
              selectedColor={themeColor}
            />
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};
