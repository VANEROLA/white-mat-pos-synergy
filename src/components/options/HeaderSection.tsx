
import React from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import HamburgerMenu from "@/components/HamburgerMenu";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderSectionProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  isMenuOpen, 
  toggleMenu, 
  closeMenu 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        {isMobile && (
          <HamburgerMenu 
            isOpen={isMenuOpen} 
            toggleMenu={toggleMenu}
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">オプション設定</h1>
          <p className="text-muted-foreground">システムの動作と表示をカスタマイズします</p>
        </div>
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Info size={16} />
            <span className="hidden md:inline">ヘルプ</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h3 className="font-medium">オプション設定について</h3>
            <p className="text-sm text-muted-foreground">
              このページでは、アプリケーションの挙動と見た目を自由にカスタマイズできます。変更はリアルタイムで反映され「設定を保存」ボタンで永続化されます。
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              設定項目にカーソルを合わせると、詳細な説明が表示されます。
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
