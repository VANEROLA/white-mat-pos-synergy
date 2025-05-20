
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { ArrowLeft, Plus, Save, Trash, UserCog } from "lucide-react";
import AdminLogin from "@/components/admin/AdminLogin";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useStaffManagement } from "@/hooks/useStaffManagement";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminAuth();
  const { 
    staffList,
    addStaff,
    removeStaff,
    changeAdminPassword
  } = useStaffManagement();
  
  const [newStaffId, setNewStaffId] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Handle adding new staff member
  const handleAddStaff = () => {
    if (!newStaffId.trim() || !newStaffName.trim()) {
      toast.error("スタッフIDと名前を入力してください");
      return;
    }

    if (addStaff(newStaffId, newStaffName)) {
      toast.success("スタッフを追加しました");
      setNewStaffId("");
      setNewStaffName("");
    } else {
      toast.error("同じIDのスタッフが既に存在します");
    }
  };

  // Handle removing a staff member
  const handleRemoveStaff = (id: string) => {
    if (removeStaff(id)) {
      toast.success("スタッフを削除しました");
    } else {
      toast.error("スタッフの削除に失敗しました");
    }
  };

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
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <h1 className="text-2xl font-bold">管理者設定</h1>
      </div>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="staff">スタッフ管理</TabsTrigger>
          <TabsTrigger value="security">セキュリティ設定</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>スタッフ管理</CardTitle>
              <CardDescription>
                無料処理を行えるスタッフを管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-staff-id">スタッフID</Label>
                    <Input
                      id="new-staff-id"
                      value={newStaffId}
                      onChange={(e) => setNewStaffId(e.target.value)}
                      placeholder="スタッフIDを入力"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-staff-name">スタッフ名</Label>
                    <Input
                      id="new-staff-name"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      placeholder="スタッフ名を入力"
                    />
                  </div>
                </div>
                <Button onClick={handleAddStaff} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  スタッフを追加
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>スタッフID</TableHead>
                    <TableHead>スタッフ名</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                        登録されているスタッフはありません
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffList.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>{staff.id}</TableCell>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStaff(staff.id)}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
