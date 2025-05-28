
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { 
  Home, 
  Package, 
  History, 
  FileText, 
  Gift, 
  Database, 
  UserCog, 
  Settings,
  ChartBar,
  BarChart3
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (path: string) => void;
  currentRoute?: string;
  className?: string;
  toggleMenu?: () => void;
}

const SidebarMenu: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  currentRoute,
  className,
  toggleMenu
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (currentRoute) {
      return currentRoute === path;
    }
    return location.pathname === path;
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    if (onClose) {
      onClose();
    }
  };

  // Reorganized menu items for better flow
  const menuItems = [
    { icon: Home, label: "POSレジ", path: "/" },
    { icon: Package, label: "商品追加", path: "/add-product" },
    { icon: Database, label: "在庫管理", path: "/inventory" },
    { icon: History, label: "注文履歴", path: "/order-history" },
    { icon: Gift, label: "無料処理", path: "/free-items" }, 
    { icon: ChartBar, label: "売上データ", path: "/sales-data" },
    { icon: BarChart3, label: "店舗間売上データ共有", path: "/store-sales-comparison" },
    { icon: Settings, label: "オプション", path: "/options" },
    { icon: FileText, label: "システムログ", path: "/system-logs" },
    { icon: UserCog, label: "管理者設定", path: "/admin" },
  ];

  // Menu content that will be displayed in the sheet
  const menuContent = (
    <div className={cn("flex flex-col space-y-1", className)}>
      {menuItems.map((item) => (
        <TooltipProvider key={item.path} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={item.path}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.path === "/" && "レジ操作画面に移動します"}
              {item.path === "/add-product" && "新しい商品を登録できます"}
              {item.path === "/inventory" && "在庫状況を管理します"}
              {item.path === "/order-history" && "過去の注文履歴を表示します"}
              {item.path === "/free-items" && "無料商品の処理を行います"}
              {item.path === "/sales-data" && "売上データを分析します"} 
              {item.path === "/store-sales-comparison" && "店舗間の売上を比較します"}
              {item.path === "/options" && "システム設定をカスタマイズします"}
              {item.path === "/system-logs" && "システムログを確認します"}
              {item.path === "/admin" && "管理者向け詳細設定を行います"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-64 p-4 bg-background border-r"
        style={{ zIndex: 9999 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">メニュー</h2>
        </div>
        {menuContent}
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMenu;
