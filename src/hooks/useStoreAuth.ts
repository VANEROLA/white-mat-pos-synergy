
import { useState, useEffect, useCallback } from "react";

export interface StoreAuthState {
  isAuthenticated: boolean;
  login: (storeId: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
  storeInfo: StoreInfo | null;
  updateStoreInfo: (info: Partial<StoreInfo>) => boolean;
}

export interface StoreInfo {
  storeId: string;
  storeName: string;
  avatarUrl?: string;
}

export const useStoreAuth = (): StoreAuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  
  // 初回マウント時に認証状態をチェック
  useEffect(() => {
    console.log("StoreAuth: Initializing authentication state");
    const authStatus = checkAuthStatus();
    setIsLoading(false);
    
    if (authStatus && !storeInfo) {
      // ログイン状態だがストア情報がない場合は取得する
      const storedInfo = localStorage.getItem("storeInfo");
      if (storedInfo) {
        try {
          setStoreInfo(JSON.parse(storedInfo));
        } catch (error) {
          console.error("Error parsing store info:", error);
          logout(); // 情報が壊れていたらログアウト
        }
      }
    }
  }, []);

  // 認証トークンのステータスを確認する関数
  const checkAuthStatus = useCallback((): boolean => {
    try {
      const storeAuthToken = localStorage.getItem("storeAuthToken");
      if (storeAuthToken) {
        const tokenData = JSON.parse(storeAuthToken);
        const currentTime = new Date().getTime();
        const isValid = tokenData.expiry > currentTime;
        
        console.log("StoreAuth: Token status check -", isValid ? "valid" : "expired");
        
        if (isValid) {
          setIsAuthenticated(true);
          return true;
        } else {
          // 期限切れのトークンを削除
          console.log("StoreAuth: Token expired, removing");
          localStorage.removeItem("storeAuthToken");
          localStorage.removeItem("storeInfo");
          setIsAuthenticated(false);
          return false;
        }
      } else {
        console.log("StoreAuth: No token found");
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("StoreAuth: Error checking token", error);
      localStorage.removeItem("storeAuthToken");
      localStorage.removeItem("storeInfo");
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // 定期的に認証状態をチェック（30秒ごと）
  useEffect(() => {
    const intervalId = setInterval(checkAuthStatus, 30000);
    return () => clearInterval(intervalId);
  }, [checkAuthStatus]);

  // ログイン処理
  const login = useCallback((storeId: string, password: string): boolean => {
    console.log("StoreAuth: Login attempt");
    setIsLoading(true);
    
    // デフォルトの店舗情報 (実際のアプリでは API から取得する)
    const defaultStores: Record<string, {password: string, name: string}> = {
      "store1": { password: "1234", name: "東京本店" },
      "store2": { password: "1234", name: "大阪支店" },
      "store3": { password: "1234", name: "名古屋支店" },
      "VANEROLA": { password: "1234", name: "VANEROLA" }
    };
    
    // 店舗IDが存在し、パスワードが一致するか確認
    const storeData = defaultStores[storeId];
    if (storeData && storeData.password === password) {
      console.log("StoreAuth: Password correct, creating token");
      // 1日の有効期限を持つ認証トークンを設定
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
      localStorage.setItem("storeAuthToken", JSON.stringify({ 
        expiry: expiryTime,
        storeId: storeId
      }));
      
      // 店舗情報を保存
      const newStoreInfo: StoreInfo = {
        storeId: storeId,
        storeName: storeData.name,
      };
      
      localStorage.setItem("storeInfo", JSON.stringify(newStoreInfo));
      setStoreInfo(newStoreInfo);
      setIsAuthenticated(true);
      
      console.log("StoreAuth: Authentication successful");
      setIsLoading(false);
      return true;
    }
    
    console.log("StoreAuth: Store ID or password incorrect");
    setIsLoading(false);
    return false;
  }, []);

  // ログアウト処理
  const logout = useCallback((): void => {
    console.log("StoreAuth: Logout called");
    localStorage.removeItem("storeAuthToken");
    localStorage.removeItem("storeInfo");
    setIsAuthenticated(false);
    setStoreInfo(null);
  }, []);

  // 店舗情報の更新
  const updateStoreInfo = useCallback((info: Partial<StoreInfo>): boolean => {
    if (!storeInfo) return false;
    
    try {
      const updatedInfo = { ...storeInfo, ...info };
      localStorage.setItem("storeInfo", JSON.stringify(updatedInfo));
      setStoreInfo(updatedInfo);
      return true;
    } catch (error) {
      console.error("Error updating store info:", error);
      return false;
    }
  }, [storeInfo]);

  return {
    isAuthenticated,
    login,
    logout,
    isLoading,
    storeInfo,
    updateStoreInfo
  };
};
