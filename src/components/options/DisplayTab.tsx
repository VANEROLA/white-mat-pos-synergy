
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Moon, Image, Text, Smartphone, Contrast, MonitorSmartphone } from "lucide-react";
import { SettingRow } from "./SettingRow";
import { ThemeColorPicker } from "./ThemeColorPicker";

interface DisplayOptionProps {
  displayOptions: {
    darkMode: boolean;
    showProductImages: boolean;
    largeText: boolean;
    compactMode: boolean;
    highContrastMode: boolean;
    animationsEnabled: boolean;
  };
  themeColor: string;
  handleDisplayOptionChange: (key: keyof typeof displayOptions) => void;
  setThemeColor: (value: string) => void;
}

export const DisplayTab: React.FC<DisplayOptionProps> = ({
  displayOptions,
  themeColor,
  handleDisplayOptionChange,
  setThemeColor
}) => {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg pb-6">
        <CardTitle className="flex items-center gap-2">
          <Text size={20} className="text-primary" />
          表示設定
        </CardTitle>
        <CardDescription>
          アプリケーションの外観と表示方法をカスタマイズします
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <SettingRow
          icon={<Moon size={18} className="text-indigo-600" />}
          label="ダークモード"
          checked={displayOptions.darkMode}
          onChange={() => handleDisplayOptionChange('darkMode')}
          tooltipText="画面の明るさを抑え、暗い環境での使用に適した表示モードに切り替えます。目の疲れを軽減し、バッテリー消費も抑えられます。"
        />
        
        <SettingRow
          icon={<Image size={18} className="text-emerald-600" />}
          label="商品画像を表示"
          checked={displayOptions.showProductImages}
          onChange={() => handleDisplayOptionChange('showProductImages')}
          tooltipText="商品一覧やカート内に商品の画像を表示します。視覚的に商品を識別しやすくなりますが、オフにすると表示速度が向上します。"
        />
        
        <SettingRow
          icon={<Text size={18} className="text-amber-600" />}
          label="大きいテキスト"
          checked={displayOptions.largeText}
          onChange={() => handleDisplayOptionChange('largeText')}
          tooltipText="アプリ全体のフォントサイズを大きくします。視認性が向上しますが、一画面に表示できる情報量は減少します。"
        />
        
        <SettingRow
          icon={<Smartphone size={18} className="text-rose-600" />}
          label="コンパクトモード"
          checked={displayOptions.compactMode}
          onChange={() => handleDisplayOptionChange('compactMode')}
          tooltipText="余白を減らし、より多くの情報を画面に表示します。小さな画面のデバイスに最適ですが、タッチ操作の精度が求められます。"
        />
        
        <SettingRow
          icon={<Contrast size={18} className="text-purple-600" />}
          label="ハイコントラストモード"
          checked={displayOptions.highContrastMode}
          onChange={() => handleDisplayOptionChange('highContrastMode')}
          tooltipText="テキストと背景のコントラストを高め、視認性を向上させます。視覚障害のある方や明るい環境での使用に適しています。"
        />
        
        <SettingRow
          icon={<MonitorSmartphone size={18} className="text-cyan-600" />}
          label="アニメーションを有効化"
          checked={displayOptions.animationsEnabled}
          onChange={() => handleDisplayOptionChange('animationsEnabled')}
          tooltipText="画面遷移やボタン操作時のアニメーション効果を制御します。オフにするとパフォーマンスが向上し、より素早い操作が可能になります。"
        />
        
        <ThemeColorPicker themeColor={themeColor} onChange={setThemeColor} />
      </CardContent>
    </Card>
  );
};
