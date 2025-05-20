
import React from "react";
import { Button } from "@/components/ui/button";

interface SaveSettingsButtonProps {
  onSave: () => void;
}

export const SaveSettingsButton: React.FC<SaveSettingsButtonProps> = ({ onSave }) => {
  return (
    <div className="mt-8 flex justify-end">
      <Button onClick={onSave} size="lg" className="px-8 py-6 text-lg font-medium">
        すべての設定を保存
      </Button>
    </div>
  );
};
