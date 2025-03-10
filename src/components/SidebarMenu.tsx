
import React from "react";
import { X, Gift } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

import TaxRateSettings from "@/components/TaxRateSettings";

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentRoute,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const routes = [
    {
      path: "/",
      name: "POS",
    },
    {
      path: "/add-product",
      name: "商品追加",
    },
    {
      path: "/order-history",
      name: "注文履歴",
    },
    {
      path: "/free-items",
      name: "無料処理履歴",
      icon: Gift,
    },
    {
      path: "/system-logs",
      name: "システムログ",
    },
  ];
  
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      ></div>
      
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-background z-50 transform transition-transform duration-300 ease-in-out shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">メニュー</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
              <X size={20} />
            </button>
          </div>
          
          <TaxRateSettings />
          
          <nav className="mt-4">
            {routes.map((route) => (
              <div key={route.path} className="mb-2">
                <button
                  onClick={() => onNavigate(route.path)}
                  className={cn(
                    "flex items-center w-full p-2 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    currentRoute === route.path ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  {route.name}
                </button>
              </div>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              POS System v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;
