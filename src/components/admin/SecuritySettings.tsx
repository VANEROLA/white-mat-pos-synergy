
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface SecuritySettingsProps {
  changeAdminPassword: (currentPassword: string, newPassword: string) => boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ 
  changeAdminPassword 
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle changing admin password
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("すべてのパスワードフィールドを入力してください");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("新しいパスワードが一致しません");
      return;
    }

    if (changeAdminPassword(currentPassword, newPassword)) {
      toast.success("管理者パスワードを変更しました");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error("現在のパスワードが正しくありません");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>管理者パスワード変更</CardTitle>
        <CardDescription>
          管理者画面へのアクセスパスワードを変更します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="current-password">現在のパスワード</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-password">新しいパスワード</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">新しいパスワード (確認)</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleChangePassword} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          パスワードを変更
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SecuritySettings;
