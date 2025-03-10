
import React, { useState } from 'react';
import { 
  History, 
  FileText, 
  Home,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ 
  isOpen, 
  onClose,
  onNavigate,
  currentRoute
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleNavigate = (route: string) => {
    onNavigate(route);
    // Don't close the sidebar on navigation
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out bg-white shadow-lg",
        collapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 flex items-center justify-between border-b">
            {!collapsed && (
              <h2 className="font-semibold text-lg">メニュー</h2>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto"
              onClick={toggleCollapse}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>
          
          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-2">
              <ul className="space-y-1">
                <li>
                  <Button
                    variant={currentRoute === "/" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={() => handleNavigate("/")}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    {!collapsed && <span>ホーム</span>}
                  </Button>
                </li>
                
                <li>
                  <Button
                    variant={currentRoute === "/order-history" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={() => handleNavigate("/order-history")}
                  >
                    <History className="mr-2 h-5 w-5" />
                    {!collapsed && <span>注文履歴</span>}
                  </Button>
                </li>
                
                <li>
                  <Button
                    variant={currentRoute === "/system-logs" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={() => handleNavigate("/system-logs")}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    {!collapsed && <span>システムログ</span>}
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className={cn(
                "w-full", 
                collapsed && "justify-center px-2"
              )}
              onClick={onClose}
            >
              <X className="mr-2 h-5 w-5" />
              {!collapsed && <span>閉じる</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
