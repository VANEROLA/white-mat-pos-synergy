
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export type ConnectionStatus = 'connected' | 'unstable' | 'disconnected';

export interface ConnectionContextType {
  status: ConnectionStatus;
  isOnlineMode: boolean;
  pendingActions: any[];
  toggleConnectionMode: () => void;
  addPendingAction: (action: any) => void;
  clearPendingActions: () => void;
  syncPendingActions: () => Promise<boolean>;
  checkConnection: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ConnectionStatus>('connected');
  const [isOnlineMode, setIsOnlineMode] = useState<boolean>(navigator.onLine);
  const [pendingActions, setPendingActions] = useState<any[]>([]);

  const checkConnection = async () => {
    try {
      // シミュレートされたAPI接続テスト - 実際のアプリでは実際のエンドポイントに対して行う
      const testEndpoint = "https://api.example.com/ping";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const startTime = Date.now();
      const response = await fetch(testEndpoint, { 
        method: 'HEAD',
        signal: controller.signal
      }).catch(() => null);
      clearTimeout(timeoutId);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (!response) {
        setStatus('disconnected');
        return;
      }
      
      // レスポンス時間に基づいて接続品質を評価
      if (responseTime < 1000) {
        setStatus('connected');
      } else if (responseTime < 2000) {
        setStatus('unstable');
      } else {
        setStatus('disconnected');
      }
    } catch (error) {
      console.error("Connection check failed:", error);
      setStatus('disconnected');
    }
  };

  // ブラウザのオンライン/オフライン状態を監視
  useEffect(() => {
    const handleOnline = () => {
      setIsOnlineMode(true);
      checkConnection();
    };
    
    const handleOffline = () => {
      setIsOnlineMode(false);
      setStatus('disconnected');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 初期接続チェック
    checkConnection();
    
    // 定期的に接続をチェック (30秒ごと)
    const intervalId = setInterval(checkConnection, 30000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  const toggleConnectionMode = () => {
    setIsOnlineMode(prev => !prev);
  };

  const addPendingAction = (action: any) => {
    setPendingActions(prev => [...prev, action]);
    // LocalStorageに保存
    localStorage.setItem('pendingActions', JSON.stringify([...pendingActions, action]));
  };

  const clearPendingActions = () => {
    setPendingActions([]);
    localStorage.removeItem('pendingActions');
  };

  const syncPendingActions = async () => {
    if (status !== 'connected' || pendingActions.length === 0) return false;
    
    try {
      // ペンディング中のアクションを処理
      for (const action of pendingActions) {
        if (action.type === 'inventory_update') {
          await processInventoryUpdate(action.payload);
        }
        // 他のタイプのアクションがあれば、ここで処理
      }
      
      // すべてのアクションが成功したらクリア
      clearPendingActions();
      return true;
    } catch (error) {
      console.error("Failed to sync pending actions:", error);
      return false;
    }
  };

  // 在庫更新処理をシミュレート
  const processInventoryUpdate = async (payload: any) => {
    try {
      const { updateInventory } = await import('@/utils/api');
      const result = await updateInventory(payload);
      if (result.success) {
        toast.success("オフラインデータが同期されました");
      }
      return result;
    } catch (error) {
      console.error("Failed to process inventory update:", error);
      toast.error("オフラインデータの同期に失敗しました");
      throw error;
    }
  };

  // マウント時にLocalStorageからペンディングアクションを読み込む
  useEffect(() => {
    const storedActions = localStorage.getItem('pendingActions');
    if (storedActions) {
      setPendingActions(JSON.parse(storedActions));
    }
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        status,
        isOnlineMode,
        pendingActions,
        toggleConnectionMode,
        addPendingAction,
        clearPendingActions,
        syncPendingActions,
        checkConnection
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};

// 接続ステータスに基づいて適切なアイコンと色を返す
export const getConnectionStatusIcon = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="text-green-500" />;
    case 'unstable':
      return <AlertCircle className="text-amber-500" />;
    case 'disconnected':
      return <XCircle className="text-red-500" />;
  }
};
