
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { FreeItemReason, isDefaultReason, saveReasons } from "@/utils/freeItemReasons";

interface ReasonSelectorProps {
  selectedReasonId: string;
  setSelectedReasonId: (id: string) => void;
  reasons: FreeItemReason[];
  setReasons: (reasons: FreeItemReason[]) => void;
  onAddReason: () => void;
  onEditReason: (reasonName: string) => void;
}

const ReasonSelector: React.FC<ReasonSelectorProps> = ({
  selectedReasonId,
  setSelectedReasonId,
  reasons,
  setReasons,
  onAddReason,
  onEditReason,
}) => {
  const handleDeleteReason = () => {
    if (!selectedReasonId) {
      toast.error("削除する理由を選択してください");
      return;
    }

    if (isDefaultReason(selectedReasonId)) {
      toast.error("デフォルトの理由は削除できません");
      return;
    }

    const updatedReasons = reasons.filter(reason => reason.id !== selectedReasonId);
    setReasons(updatedReasons);
    setSelectedReasonId("");

    saveReasons(updatedReasons);
    toast.success("理由が削除されました");
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="reason">理由</Label>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={onAddReason}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            新しい理由
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 text-xs"
            disabled={!selectedReasonId || isDefaultReason(selectedReasonId)}
            onClick={() => {
              if (selectedReasonId) {
                const reason = reasons.find(r => r.id === selectedReasonId);
                if (reason) {
                  onEditReason(reason.name);
                }
              }
            }}
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            編集
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            disabled={!selectedReasonId || isDefaultReason(selectedReasonId)}
            onClick={handleDeleteReason}
          >
            <Trash className="h-3.5 w-3.5 mr-1" />
            削除
          </Button>
        </div>
      </div>
      <Select value={selectedReasonId} onValueChange={setSelectedReasonId}>
        <SelectTrigger id="reason">
          <SelectValue placeholder="理由を選択" />
        </SelectTrigger>
        <SelectContent>
          {reasons.map((reason) => (
            <SelectItem key={reason.id} value={reason.id}>
              {reason.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReasonSelector;
