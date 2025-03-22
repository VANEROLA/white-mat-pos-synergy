import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

import { Home, Package, History, FileText, Gift, Database } from "lucide-react";

interface SidebarProps {
  className?: string;
}

const SidebarMenu = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { icon: Home, label: "POSレジ", path: "/" },
    { icon: Package, label: "商品追加", path: "/add-product" },
    { icon: Database, label: "在庫管理", path: "/inventory" },
    { icon: History, label: "注文履歴", path: "/order-history" },
    { icon: Gift, label: "無料処理", path: "/free-items" },
    { icon: FileText, label: "システムログ", path: "/system-logs" },
  ];

  return (
    <div className="flex flex-col space-y-1">
      {menuItems.map((item) => (
        <Link
          key={item.label}
          to={item.path}
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
};

export default SidebarMenu;
