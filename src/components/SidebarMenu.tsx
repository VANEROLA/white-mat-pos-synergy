
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Sheet,
  SheetContent,
  SheetTrigger 
} from "@/components/ui/sheet";
import { Home, Package, History, FileText, Gift, Database, UserCog, Settings } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (path: string) => void;
  currentRoute?: string;
  className?: string;
}

const SidebarMenu: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  currentRoute,
  className 
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

  const menuItems = [
    { icon: Home, label: "POSレジ", path: "/" },
    { icon: History, label: "注文履歴", path: "/order-history" },
    { icon: Package, label: "商品追加", path: "/add-product" },
    { icon: Database, label: "在庫管理", path: "/inventory" },
    { icon: Gift, label: "無料処理", path: "/free-items" },
    { icon: Settings, label: "オプション", path: "/options" },
    { icon: FileText, label: "システムログ", path: "/system-logs" },
    { icon: UserCog, label: "管理者設定", path: "/admin" },
  ];

  // Menu content that will be displayed in the drawer
  const menuContent = (
    <div className={cn("flex flex-col space-y-1", className)}>
      {menuItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
          onClick={() => handleNavigate(item.path)}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
            isActive(item.path)
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  // Always use Sheet component now for a slide-in menu
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-4">
        <div className="py-4">
          <h2 className="text-lg font-semibold mb-4">メニュー</h2>
          {menuContent}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMenu;
