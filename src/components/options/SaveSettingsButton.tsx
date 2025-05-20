
import React from "react";
import { Button } from "@/components/ui/button";
import { useOptions } from "@/contexts/OptionsContext";

export const SaveSettingsButton: React.FC = () => {
  const { handleSaveSettings } = useOptions();
  
  return (
    <div className="mt-8 flex justify-end">
      <Button onClick={handleSaveSettings} size="lg" className="px-8 py-6 text-lg font-medium">
        すべての設定を保存
      </Button>
    </div>
  );
};
