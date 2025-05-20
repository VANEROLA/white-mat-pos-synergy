
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "lucide-react";
import { useStoreAuthContext } from "@/contexts/StoreAuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const StoreLogin: React.FC = () => {
  const [storeId, setStoreId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, isAuthenticated } = useStoreAuthContext();
  const navigate = useNavigate();

  // ログイン処理を実行
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeId) {
      toast.error("店舗IDを入力してください");
      return;
    }
    
    if (!password) {
      toast.error("パスワードを入力してください");
      return;
    }
    
    setIsLoggingIn(true);
    console.log("StoreLogin: Login form submitted");
    
    // ログイン処理を実行し、成功したら即座にリダイレクト
    const success = login(storeId, password);
    if (success) {
      console.log("StoreLogin: Login successful, redirecting...");
      toast.success("店舗システムにログインしました");
      navigate("/", { replace: true });
    } else {
      console.log("StoreLogin: Login failed");
      toast.error("店舗IDまたはパスワードが正しくありません");
      setPassword("");
      setIsLoggingIn(false);
    }
  };

  // ログイン済みならリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Store className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">店舗ログイン</CardTitle>
          <CardDescription className="text-center">
            店舗IDとパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeId">店舗ID</Label>
              <Input
                id="storeId"
                placeholder="店舗IDを入力"
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "ログイン中..." : "ログイン"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default StoreLogin;
