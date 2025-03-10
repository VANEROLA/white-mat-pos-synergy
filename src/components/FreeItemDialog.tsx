import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface FreeItemDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: (staffName: string, reason: string, notes?: string) => void;
}

interface FreeItemReason {
  id: string;
  name: string;
}

const FreeItemDialog: React.FC<FreeItemDialogProps> = ({
  open,
  onClose,
  onApprove,
}) => {
  const [staffName, setStaffName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [showAddReason, setShowAddReason] = useState(false);
  const [newReasonName, setNewReasonName] = useState("");
  const [reasons, setReasons] = useState<FreeItemReason[]>([
    { id: "damaged", name: "商品の損傷" },
    { id: "customer_service", name: "顧客サービス" },
    { id: "promotion", name: "プロモーション" },
    { id: "employee", name: "従業員購入" },
    { id: "other", name: "その他" },
  ]);

  useEffect(() => {
    try {
      const savedReasons = localStorage.getItem("freeItemReasons");
      if (savedReasons) {
        const parsedReasons = JSON.parse(savedReasons);
        if (Array.isArray(parsedReasons) && parsedReasons.length > 0) {
          setReasons(parsedReasons);
        }
      }
    } catch (error) {
      console.error("Failed to load free item reasons:", error);
    }
  }, []);

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
    setShowAddReason(false);

    localStorage.setItem("freeItemReasons", JSON.stringify(updatedReasons));
    toast.success("新しい理由が追加されました");
  };

  const handleSubmit = () => {
    if (!staffName.trim()) {
      toast.error("担当者名は必須です");
      return;
    }

    if (!selectedReasonId) {
      toast.error("理由の選択は必須です");
      return;
    }

    const selectedReason = reasons.find((r) => r.id === selectedReasonId);
    const reasonText = selectedReason ? selectedReason.name : "";

    const freeItems = JSON.parse(localStorage.getItem("freeItems") || "[]");
    freeItems.push({
      id: Date.now().toString(),
      staffName,
      reason: reasonText,
      notes: notes || "",
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("freeItems", JSON.stringify(freeItems));

    onApprove(staffName, reasonText, notes);
    onClose();
    setStaffName("");
    setNotes("");
    setSelectedReasonId("");
    toast.success("無料処理が承認されました");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>無料処理の承認</DialogTitle>
          <DialogDescription>
            担当者名と理由は必須項目です。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="staff-name">担当者名</Label>
            <Input
              id="staff-name"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="担当者名を入力"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="reason">理由</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => setShowAddReason(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                新しい理由
              </Button>
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

          {showAddReason && (
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
          )}

          <div className="grid gap-2">
            <Label htmlFor="notes">補足メモ (任意)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="備考やメモを入力"
              className="h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="mr-2">
            キャンセル
          </Button>
          <Button type="button" onClick={handleSubmit}>
            承認
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreeItemDialog;
