
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Automatically redirect to admin page if already authenticated
  useEffect(() => {
    console.log("AdminLogin: Authentication state changed:", isAuthenticated);
    if (isAuthenticated || loginSuccess) {
      console.log("AdminLogin: Redirecting to /admin");
      // Use a small delay to ensure state is fully updated
      const redirectTimer = setTimeout(() => {
        navigate("/admin");
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, loginSuccess, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AdminLogin: Login form submitted");
    
    if (login(password)) {
      console.log("AdminLogin: Login successful");
      setLoginSuccess(true); // Set local success state
      toast.success("管理者画面にログインしました");
    } else {
      console.log("AdminLogin: Login failed");
      toast.error("パスワードが正しくありません");
      setPassword(""); // Clear password field on failed login
    }
  };

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
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
