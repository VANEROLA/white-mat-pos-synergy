
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
}

interface ThemeColorPickerProps {
  themeColor: string;
  onChange: (value: string) => void;
}

const ColorOption: React.FC<ColorOptionProps> = ({ color, name }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem 
          value={color} 
          className={`bg-${color}-500 hover:bg-${color}-600 h-8 w-8 mr-2 rounded-full transition-transform hover:scale-110`}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p>{name}テーマ</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ themeColor, onChange }) => {
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
          <ColorOption color="blue" name="ブルー" />
          <ColorOption color="green" name="グリーン" />
          <ColorOption color="purple" name="パープル" />
          <ColorOption color="rose" name="ローズ" />
          <ColorOption color="amber" name="アンバー" />
          <ColorOption color="teal" name="ティール" />
          <ColorOption color="indigo" name="インディゴ" />
          <ColorOption color="pink" name="ピンク" />
        </ToggleGroup>
      </div>
    </div>
  );
};
