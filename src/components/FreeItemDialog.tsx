
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface FreeItemDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: (staffName: string, reason: string) => void;
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
  const [customReason, setCustomReason] = useState("");
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [reasons, setReasons] = useState<FreeItemReason[]>([
    { id: "damaged", name: "商品の損傷" },
    { id: "customer_service", name: "顧客サービス" },
    { id: "promotion", name: "プロモーション" },
    { id: "employee", name: "従業員購入" },
    { id: "other", name: "その他" },
  ]);

  // Load saved reasons from localStorage
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
    if (!customReason.trim()) {
      toast.error("理由を入力してください");
      return;
    }

    const newReason = {
      id: `custom_${Date.now()}`,
      name: customReason.trim(),
    };

    const updatedReasons = [...reasons, newReason];
    setReasons(updatedReasons);
    setSelectedReasonId(newReason.id);
    setCustomReason("");

    // Save to localStorage
    localStorage.setItem("freeItemReasons", JSON.stringify(updatedReasons));
  };

  const handleSubmit = () => {
    if (!staffName.trim()) {
      toast.error("担当者名を入力してください");
      return;
    }

    if (!selectedReasonId) {
      toast.error("理由を選択してください");
      return;
    }

    const selectedReason = reasons.find((r) => r.id === selectedReasonId);
    const reasonText = selectedReason ? selectedReason.name : "";

    onApprove(staffName, reasonText);
    onClose();
    toast.success("無料処理が承認されました");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>無料処理の承認</DialogTitle>
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
            <Label htmlFor="reason">理由</Label>
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

          <div className="grid gap-2">
            <Label htmlFor="custom-reason">新しい理由を追加</Label>
            <div className="flex gap-2">
              <Textarea
                id="custom-reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="新しい理由を入力"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddNewReason} className="self-end">
                追加
              </Button>
            </div>
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
