
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import StaffManagement from "@/components/admin/StaffManagement";
import SecuritySettings from "@/components/admin/SecuritySettings";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useStaffManagement } from "@/hooks/useStaffManagement";

const AdminSettings = () => {
  const { isAuthenticated } = useAdminAuth();
  const { staffList, addStaff, removeStaff, changeAdminPassword } = useStaffManagement();
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a small delay to ensure auth state is properly loaded
  useEffect(() => {
    console.log("AdminSettings: Checking authentication state:", isAuthenticated);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    console.log("AdminSettings: Still loading...");
    return <div className="container flex items-center justify-center min-h-[80vh]">読み込み中...</div>;
  }
  
  // If not authenticated, show login page
  if (!isAuthenticated) {
    console.log("AdminSettings: Not authenticated, showing login");
    return <AdminLogin />;
  }

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
