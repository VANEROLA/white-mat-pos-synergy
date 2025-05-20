
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();
  
  const handleBackClick = () => {
    // Log out before navigating away
    logout();
    navigate(-1);
  };
  
  return (
    <div className="flex items-center mb-6">
      <Button 
        variant="outline" 
        size="sm" 
        className="mr-4"
        onClick={handleBackClick}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        戻る
      </Button>
      <h1 className="text-2xl font-bold">管理者設定</h1>
    </div>
  );
};

export default AdminHeader;
