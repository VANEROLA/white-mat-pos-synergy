
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import ReasonSelector from "./freeItem/ReasonSelector";
import AddReasonForm from "./freeItem/AddReasonForm";
import EditReasonForm from "./freeItem/EditReasonForm";
import { FreeItemReason, loadSavedReasons } from "@/utils/freeItemReasons";
import { CartItem } from "@/types";

interface FreeItemDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: (staffName: string, reason: string, notes?: string) => void;
  cartItems: CartItem[];
}

const FreeItemDialog: React.FC<FreeItemDialogProps> = ({
  open,
  onClose,
  onApprove,
  cartItems,
}) => {
  const [staffName, setStaffName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [showAddReason, setShowAddReason] = useState(false);
  const [showEditReason, setShowEditReason] = useState(false);
  const [newReasonName, setNewReasonName] = useState("");
  const [reasons, setReasons] = useState<FreeItemReason[]>([]);

  useEffect(() => {
    setReasons(loadSavedReasons());
  }, []);

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
      timestamp: new Date().toISOString(),
      products: cartItems, // Store the cart items with the free order record
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

          <ReasonSelector
            selectedReasonId={selectedReasonId}
            setSelectedReasonId={setSelectedReasonId}
            reasons={reasons}
            setReasons={setReasons}
            onAddReason={() => {
              setShowEditReason(false);
              setShowAddReason(true);
              setNewReasonName("");
            }}
            onEditReason={(reasonName) => {
              setNewReasonName(reasonName);
              setShowAddReason(false);
              setShowEditReason(true);
            }}
          />

          {showAddReason && (
            <AddReasonForm
              newReasonName={newReasonName}
              setNewReasonName={setNewReasonName}
              reasons={reasons}
              setReasons={setReasons}
              setSelectedReasonId={setSelectedReasonId}
              onComplete={() => setShowAddReason(false)}
            />
          )}

          {showEditReason && (
            <EditReasonForm
              newReasonName={newReasonName}
              setNewReasonName={setNewReasonName}
              selectedReasonId={selectedReasonId}
              reasons={reasons}
              setReasons={setReasons}
              onComplete={() => setShowEditReason(false)}
            />
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
