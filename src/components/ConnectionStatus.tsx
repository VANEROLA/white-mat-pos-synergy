
import React from "react";
import { useConnection, getConnectionStatusIcon } from "@/contexts/ConnectionContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className }) => {
  const { 
    status, 
    isOnlineMode, 
    toggleConnectionMode, 
    pendingActions,
    syncPendingActions
  } = useConnection();

  const statusText = {
    connected: "通信状態: 良好",
    unstable: "通信状態: 不安定",
    disconnected: "通信状態: 切断"
  };

  const handleSync = async () => {
    if (status === 'connected' && pendingActions.length > 0) {
      await syncPendingActions();
    }
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="flex items-center gap-2 text-sm">
        <span className="w-5 h-5">
          {getConnectionStatusIcon(status)}
        </span>
        <span className="text-muted-foreground">{statusText[status]}</span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className={cn(
          "gap-1.5",
          !isOnlineMode && "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
        )}
        onClick={toggleConnectionMode}
      >
        {isOnlineMode ? (
          <>
            <Wifi size={14} />
            <span>オンライン</span>
          </>
        ) : (
          <>
            <WifiOff size={14} />
            <span>オフライン</span>
          </>
        )}
      </Button>
      
      {pendingActions.length > 0 && status === 'connected' && (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handleSync}
          className="text-xs"
        >
          同期 ({pendingActions.length})
        </Button>
      )}
    </div>
  );
};

export default ConnectionStatus;
