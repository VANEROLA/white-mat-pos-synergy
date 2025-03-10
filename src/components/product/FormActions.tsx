
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormActionsProps {
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end pt-4">
      <Button type="button" variant="outline" onClick={() => navigate("/")} className="mr-2">
        キャンセル
      </Button>
      <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
        {isSubmitting ? "保存中..." : (
          <>
            <Check size={16} className="mr-1" />
            商品を保存
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
