
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReasonSelector from "./freeItem/ReasonSelector";
import AddReasonForm from "./freeItem/AddReasonForm";
import EditReasonForm from "./freeItem/EditReasonForm";
import StaffInfoSection from "./freeItem/StaffInfoSection";
import NotesSection from "./freeItem/NotesSection";
import { ItemSelectionList } from "./freeItem/ItemSelectionList";
import { CartItem } from "@/types";
import { useFreeItemForm } from "@/hooks/useFreeItemForm";

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
  const {
    staffName,
    setStaffName,
    notes,
    setNotes,
    selectedReasonId,
    setSelectedReasonId,
    showAddReason,
    setShowAddReason,
    showEditReason,
    setShowEditReason,
    newReasonName,
    setNewReasonName,
    reasons,
    setReasons,
    selectedItemsWithQuantity,
    setSelectedItemsWithQuantity,
    selectAll,
    setSelectAll,
    resetForm,
    handleSubmit
  } = useFreeItemForm(cartItems);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>無料処理の承認</DialogTitle>
          <DialogDescription>
            担当者名と理由は必須項目です。無料にする商品と数量を選択してください。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <StaffInfoSection 
            staffName={staffName} 
            setStaffName={setStaffName} 
          />

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

          <ItemSelectionList 
            cartItems={cartItems}
            selectedItemsWithQuantity={selectedItemsWithQuantity}
            setSelectedItemsWithQuantity={setSelectedItemsWithQuantity}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
          />

          <NotesSection 
            notes={notes} 
            setNotes={setNotes} 
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="mr-2">
            キャンセル
          </Button>
          <Button 
            type="button" 
            onClick={() => handleSubmit(onApprove, onClose)}
          >
            承認
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreeItemDialog;
