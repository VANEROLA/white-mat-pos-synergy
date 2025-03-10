
import React, { useEffect, useCallback } from "react";
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
import { AlertCircle } from "lucide-react";

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
    handleSubmit,
    submitError,
    setSubmitError
  } = useFreeItemForm(cartItems);

  // Memoize the close handler to prevent re-renders
  const handleClose = useCallback(() => {
    setSubmitError(null); // Clear any errors when closing
    onClose();
  }, [onClose, setSubmitError]);

  // Only reset the form when the dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
      setSubmitError(null);
    }
  }, [open, resetForm, setSubmitError]);

  // Memoize the submission handler
  const handleApproveSubmit = useCallback(() => {
    handleSubmit(onApprove, onClose);
  }, [handleSubmit, onApprove, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>無料処理の承認</DialogTitle>
          <DialogDescription>
            担当者名と理由は必須項目です。無料にする商品と数量を選択してください。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {submitError && (
            <div className="bg-destructive/20 p-3 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
              <span className="text-destructive">{submitError}</span>
            </div>
          )}

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
          <Button type="button" variant="outline" onClick={handleClose} className="mr-2">
            キャンセル
          </Button>
          <Button 
            type="button" 
            onClick={handleApproveSubmit}
          >
            承認
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreeItemDialog;
