
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryManagement from "@/components/CategoryManagement";

const ProductFormHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-semibold">新しい商品を追加</h1>
      </div>
      <CategoryManagement />
    </div>
  );
};

export default ProductFormHeader;
