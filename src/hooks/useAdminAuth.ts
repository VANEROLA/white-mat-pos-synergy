
import { useState, useEffect, useCallback } from "react";

export interface AdminAuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

export const useAdminAuth = (): AdminAuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 初回マウント時に認証状態をチェック
  useEffect(() => {
    console.log("AdminAuth: Initializing authentication state");
    const authStatus = checkAuthStatus();
    setIsAuthenticated(authStatus);
    setIsLoading(false); // 初期チェック後はすぐにローディングを完了
  }, []);

  // 認証トークンのステータスを確認する関数
  const checkAuthStatus = useCallback(() => {
    try {
      const adminAuthToken = localStorage.getItem("adminAuthToken");
      if (adminAuthToken) {
        const tokenData = JSON.parse(adminAuthToken);
        const currentTime = new Date().getTime();
        const isValid = tokenData.expiry > currentTime;
        
        console.log("AdminAuth: Token status check -", isValid ? "valid" : "expired");
        
        if (isValid) {
          return true;
        } else {
          // 期限切れのトークンを削除
          console.log("AdminAuth: Token expired, removing");
          localStorage.removeItem("adminAuthToken");
          return false;
        }
      } else {
        console.log("AdminAuth: No token found");
        return false;
      }
    } catch (error) {
      console.error("AdminAuth: Error checking token", error);
      localStorage.removeItem("adminAuthToken");
      return false;
    }
  }, []);

  // 定期的に認証状態をチェック（60秒ごとに変更 - 頻度を下げる）
  useEffect(() => {
    const intervalId = setInterval(() => {
      const authStatus = checkAuthStatus();
      setIsAuthenticated(authStatus);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [checkAuthStatus]);

  // ログイン処理
  const login = useCallback((password: string): boolean => {
    console.log("AdminAuth: Login attempt");
    
    // デフォルトパスワードまたは保存されたパスワードを取得
    const storedPassword = localStorage.getItem("adminPassword") || "1234";
    
    if (password === storedPassword) {
      console.log("AdminAuth: Password correct, creating token");
      // 2時間の有効期限を持つ認証トークンを設定
      const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000);
      localStorage.setItem("adminAuthToken", JSON.stringify({ expiry: expiryTime }));
      
      setIsAuthenticated(true);
      console.log("AdminAuth: Authentication successful");
      return true;
    }
    
    console.log("AdminAuth: Password incorrect");
    return false;
  }, []);

  // ログアウト処理
  const logout = useCallback((): void => {
    console.log("AdminAuth: Logout called");
    localStorage.removeItem("adminAuthToken");
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    login,
    logout,
    isLoading
  };
};
