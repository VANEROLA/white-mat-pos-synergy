
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface AdminAuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAdminAuth = (): AdminAuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 初回マウント時に認証状態をチェック
  useEffect(() => {
    console.log("Auth: Initializing authentication state");
    checkAuthStatus();
  }, []);

  // 認証トークンのステータスを確認する関数
  const checkAuthStatus = useCallback(() => {
    try {
      const adminAuthToken = localStorage.getItem("adminAuthToken");
      if (adminAuthToken) {
        const tokenData = JSON.parse(adminAuthToken);
        const currentTime = new Date().getTime();
        const isValid = tokenData.expiry > currentTime;
        
        console.log("Auth: Token status check -", isValid ? "valid" : "expired");
        
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          // 期限切れのトークンを削除
          console.log("Auth: Token expired, removing");
          localStorage.removeItem("adminAuthToken");
          setIsAuthenticated(false);
        }
      } else {
        console.log("Auth: No token found");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth: Error checking token", error);
      localStorage.removeItem("adminAuthToken");
      setIsAuthenticated(false);
    }
  }, []);

  // 管理画面外に移動した場合にログアウトする
  useEffect(() => {
    if (!location.pathname.includes("/admin") && isAuthenticated) {
      console.log("Auth: Leaving admin area, logging out");
      logout();
    }
  }, [location.pathname, isAuthenticated]);

  // 定期的に認証状態をチェック（30秒ごと）
  useEffect(() => {
    const intervalId = setInterval(checkAuthStatus, 30000);
    return () => clearInterval(intervalId);
  }, [checkAuthStatus]);

  // ログイン処理
  const login = useCallback((password: string): boolean => {
    console.log("Auth: Login attempt");
    // デフォルトパスワードまたは保存されたパスワードを取得
    const storedPassword = localStorage.getItem("adminPassword") || "1234";
    
    if (password === storedPassword) {
      console.log("Auth: Password correct, creating token");
      // 2時間の有効期限を持つ認証トークンを設定
      const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000);
      localStorage.setItem("adminAuthToken", JSON.stringify({ expiry: expiryTime }));
      
      setIsAuthenticated(true);
      console.log("Auth: Authentication successful");
      return true;
    }
    
    console.log("Auth: Password incorrect");
    return false;
  }, []);

  // ログアウト処理
  const logout = useCallback((): void => {
    console.log("Auth: Logout called");
    localStorage.removeItem("adminAuthToken");
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    login,
    logout
  };
};
