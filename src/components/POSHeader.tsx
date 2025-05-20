
import React from "react";
import { CalendarDays, Clock, User } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";

interface POSHeaderProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const POSHeader: React.FC<POSHeaderProps> = ({ toggleMenu, isMenuOpen }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

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
          <p className="text-muted-foreground text-sm">白を基調としたマットなデザイン</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays size={16} className="text-primary/70" />
          <span className="text-sm font-medium">{formatDate(currentTime)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} className="text-primary/70" />
          <span className="text-sm font-medium">{formatTime(currentTime)}</span>
        </div>

        <div className="flex items-center justify-center p-2 rounded-full bg-secondary hover:bg-secondary/80 cursor-pointer">
          <User size={20} className="text-primary/70" />
        </div>
      </div>
    </header>
  );
};

export default POSHeader;
