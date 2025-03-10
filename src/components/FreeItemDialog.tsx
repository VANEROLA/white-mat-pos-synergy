
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import ReasonSelector from "./freeItem/ReasonSelector";
import AddReasonForm from "./freeItem/AddReasonForm";
import EditReasonForm from "./freeItem/EditReasonForm";
import { FreeItemReason, loadSavedReasons } from "@/utils/freeItemReasons";
import { CartItem } from "@/types";

interface FreeItemDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: (staffName: string, reason: string, notes?: string, selectedItems?: CartItem[]) => void;
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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    setReasons(loadSavedReasons());
  }, []);

  useEffect(() => {
    if (open) {
      setSelectAll(true);
      setSelectedItems(cartItems.map(item => item.id));
    }
  }, [open, cartItems]);

  const handleSubmit = () => {
    if (!staffName.trim()) {
      toast.error("担当者名は必須です");
      return;
    }

    if (!selectedReasonId) {
      toast.error("理由の選択は必須です");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("少なくとも1つの商品を選択してください");
      return;
    }

    const selectedReason = reasons.find((r) => r.id === selectedReasonId);
    const reasonText = selectedReason ? selectedReason.name : "";

    // Get only the selected cart items
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));

    const freeItems = JSON.parse(localStorage.getItem("freeItems") || "[]");
    freeItems.push({
      id: Date.now().toString(),
      staffName,
      reason: reasonText,
      notes: notes || "",
      timestamp: new Date().toISOString(),
      products: selectedCartItems,
    });
    localStorage.setItem("freeItems", JSON.stringify(freeItems));

    onApprove(staffName, reasonText, notes, selectedCartItems);
    onClose();
    setStaffName("");
    setNotes("");
    setSelectedReasonId("");
    toast.success("無料処理が承認されました");
  };

  const handleToggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, itemId]);
      if (selectedItems.length + 1 === cartItems.length) {
        setSelectAll(true);
      }
    }
  };

  const handleToggleAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
      setSelectAll(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>無料処理の承認</DialogTitle>
          <DialogDescription>
            担当者名と理由は必須項目です。無料にする商品を選択してください。
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

          <div className="grid gap-2 mt-2">
            <Label>無料にする商品を選択</Label>
            <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
              <div className="flex items-center space-x-2 pb-2 mb-2 border-b">
                <Checkbox 
                  id="select-all" 
                  checked={selectAll} 
                  onCheckedChange={handleToggleAll}
                />
                <label 
                  htmlFor="select-all" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  すべて選択
                </label>
              </div>
              
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 py-1.5">
                  <Checkbox 
                    id={`item-${item.id}`} 
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleToggleItem(item.id)}
                  />
                  <label 
                    htmlFor={`item-${item.id}`} 
                    className="flex justify-between w-full text-sm leading-none cursor-pointer"
                  >
                    <span className="truncate flex-grow">{item.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      ¥{item.price.toLocaleString()} × {item.quantity}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

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
