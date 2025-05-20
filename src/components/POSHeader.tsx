
import React, { useState } from "react";
import { CalendarDays, Clock, User } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import { useStoreAuth } from "@/hooks/useStoreAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StoreProfileDialog from "./StoreProfileDialog";

interface POSHeaderProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const POSHeader: React.FC<POSHeaderProps> = ({ toggleMenu, isMenuOpen }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { storeInfo, logout } = useStoreAuth();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : "S";
  };

  return (
    <header className="glass rounded-xl py-4 px-6 mb-6 flex justify-between items-center w-full animate-fade-in">
      <div className="flex items-center gap-2">
        <HamburgerMenu 
          isOpen={isMenuOpen} 
          toggleMenu={toggleMenu} 
          className="mr-2" 
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">POSシステム</h1>
          <p className="text-muted-foreground text-sm">
            {storeInfo ? storeInfo.storeName : "未ログイン"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays size={16} className="text-primary/70" />
          <span className="text-sm font-medium">{formatDate(currentTime)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} className="text-primary/70" />
          <span className="text-sm font-medium">{formatTime(currentTime)}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={storeInfo?.avatarUrl} />
              <AvatarFallback>
                {storeInfo ? getInitials(storeInfo.storeName) : "G"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>ストア管理</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              プロフィール編集
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <StoreProfileDialog 
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />
    </header>
  );
};

export default POSHeader;
