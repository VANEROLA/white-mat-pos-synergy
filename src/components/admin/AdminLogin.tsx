
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // ログイン処理を実行
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("パスワードを入力してください");
      return;
    }
    
    setIsLoggingIn(true); // ログイン中フラグをセット
    console.log("AdminLogin: Login form submitted");
    
    if (login(password)) {
      console.log("AdminLogin: Login successful");
      toast.success("管理者画面にログインしました");
      setLoginSuccess(true);
      
      // ログイン成功したらすぐにリダイレクト
      navigate("/admin", { replace: true });
    } else {
      console.log("AdminLogin: Login failed");
      toast.error("パスワードが正しくありません");
      setPassword(""); // 失敗したらパスワードをクリア
      setIsLoggingIn(false);
    }
  };

  // ログイン成功後のリダイレクト処理（バックアップ）
  useEffect(() => {
    if (loginSuccess || isAuthenticated) {
      console.log("AdminLogin: Redirecting to admin page");
      navigate("/admin", { replace: true });
    }
  }, [loginSuccess, isAuthenticated, navigate]);

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <UserCog className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">管理者ログイン</CardTitle>
          <CardDescription className="text-center">
            管理者画面にアクセスするにはパスワードが必要です
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="管理者パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
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

export default AdminLogin;
