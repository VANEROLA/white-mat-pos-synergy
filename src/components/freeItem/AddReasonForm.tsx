
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FreeItemReason, saveReasons } from "@/utils/freeItemReasons";

interface AddReasonFormProps {
  newReasonName: string;
  setNewReasonName: (name: string) => void;
  reasons: FreeItemReason[];
  setReasons: (reasons: FreeItemReason[]) => void;
  setSelectedReasonId: (id: string) => void;
  onComplete: () => void;
}

const AddReasonForm: React.FC<AddReasonFormProps> = ({
  newReasonName,
  setNewReasonName,
  reasons,
  setReasons,
  setSelectedReasonId,
  onComplete,
}) => {
  const handleAddNewReason = () => {
    if (!newReasonName.trim()) {
      toast.error("理由を入力してください");
      return;
    }

    const newReason = {
      id: `custom_${Date.now()}`,
      name: newReasonName.trim(),
    };

    const updatedReasons = [...reasons, newReason];
    setReasons(updatedReasons);
    setSelectedReasonId(newReason.id);
    setNewReasonName("");
    onComplete();

    saveReasons(updatedReasons);
    toast.success("新しい理由が追加されました");
  };

  return (
    <div className="grid gap-2 bg-muted/30 p-3 rounded-md">
      <Label htmlFor="new-reason">新しい理由を追加</Label>
      <div className="flex gap-2">
        <Input
          id="new-reason"
          value={newReasonName}
          onChange={(e) => setNewReasonName(e.target.value)}
          placeholder="新しい理由を入力"
          className="flex-1"
        />
        <Button type="button" onClick={handleAddNewReason} size="sm">
          追加
        </Button>
      </div>
    </div>
  );
};

export default AddReasonForm;
