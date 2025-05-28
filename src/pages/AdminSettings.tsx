
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import StaffManagement from "@/components/admin/StaffManagement";
import SecuritySettings from "@/components/admin/SecuritySettings";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useStaffManagement } from "@/hooks/useStaffManagement";

const AdminSettings: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { staffList, addStaff, removeStaff, changeAdminPassword } = useStaffManagement();
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // ページ読み込み時のディレイを大幅に短縮
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 50); // 300msから50msに短縮
    
    return () => clearTimeout(timer);
  }, []);
  
  // ローディング中は最小限の表示
  if (isLoading || isPageLoading) {
    console.log("AdminSettings: Loading...");
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  // 認証されていない場合はログイン画面を表示
  if (!isAuthenticated) {
    console.log("AdminSettings: Not authenticated, showing login");
    return <AdminLogin />;
  }

  // 認証されている場合は管理画面を表示
  console.log("AdminSettings: Authenticated, showing admin panel");
  return (
    <div className="container mx-auto py-8">
      <AdminHeader />

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="staff">スタッフ管理</TabsTrigger>
          <TabsTrigger value="security">セキュリティ設定</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff">
          <StaffManagement 
            staffList={staffList}
            addStaff={addStaff}
            removeStaff={removeStaff}
          />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings 
            changeAdminPassword={changeAdminPassword}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
