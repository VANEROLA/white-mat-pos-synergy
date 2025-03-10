
import React from "react";
import { CalendarDays, Clock } from "lucide-react";
import ConnectionStatus from "./ConnectionStatus";

const POSHeader: React.FC = () => {
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">POSシステム</h1>
        <p className="text-muted-foreground text-sm">白を基調としたマットなデザイン</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 md:gap-6">
        <ConnectionStatus />
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays size={18} className="text-primary/70" />
          <span className="text-sm font-medium">{formatDate(currentTime)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={18} className="text-primary/70" />
          <span className="text-sm font-medium">{formatTime(currentTime)}</span>
        </div>
      </div>
    </header>
  );
};

export default POSHeader;
