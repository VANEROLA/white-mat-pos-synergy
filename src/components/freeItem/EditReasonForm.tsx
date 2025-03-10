
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FreeItemReason, isDefaultReason, saveReasons } from "@/utils/freeItemReasons";

interface EditReasonFormProps {
  newReasonName: string;
  setNewReasonName: (name: string) => void;
  selectedReasonId: string;
  reasons: FreeItemReason[];
  setReasons: (reasons: FreeItemReason[]) => void;
  onComplete: () => void;
}

const EditReasonForm: React.FC<EditReasonFormProps> = ({
  newReasonName,
  setNewReasonName,
  selectedReasonId,
  reasons,
  setReasons,
  onComplete,
}) => {
  const handleEditReason = () => {
    if (!newReasonName.trim()) {
      toast.error("理由を入力してください");
      return;
    }

    if (!selectedReasonId) {
      toast.error("編集する理由を選択してください");
      return;
    }

    if (isDefaultReason(selectedReasonId)) {
      toast.error("デフォルトの理由は編集できません");
      onComplete();
      setNewReasonName("");
      return;
    }

    const updatedReasons = reasons.map(reason => 
      reason.id === selectedReasonId 
        ? { ...reason, name: newReasonName.trim() } 
        : reason
    );

    setReasons(updatedReasons);
    setNewReasonName("");
    onComplete();

    saveReasons(updatedReasons);
    toast.success("理由が更新されました");
  };

  return (
    <div className="grid gap-2 bg-muted/30 p-3 rounded-md">
      <Label htmlFor="edit-reason">理由を編集</Label>
      <div className="flex gap-2">
        <Input
          id="edit-reason"
          value={newReasonName}
          onChange={(e) => setNewReasonName(e.target.value)}
          placeholder="理由を編集"
          className="flex-1"
        />
        <Button type="button" onClick={handleEditReason} size="sm">
          更新
        </Button>
      </div>
    </div>
  );
};

export default EditReasonForm;
