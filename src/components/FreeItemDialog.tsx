import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";
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

interface SelectedItemWithQuantity {
  item: CartItem;
  freeQuantity: number;
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
  const [selectedItemsWithQuantity, setSelectedItemsWithQuantity] = useState<SelectedItemWithQuantity[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setReasons(loadSavedReasons());
  }, []);

  useEffect(() => {
    if (open) {
      // Reset form values when dialog opens
      setSelectedItemsWithQuantity([]);
      setSelectAll(false);
      setStaffName("");
      setNotes("");
      setSelectedReasonId("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!staffName.trim()) {
      toast.error("担当者名は必須です");
      return;
    }

    if (!selectedReasonId) {
      toast.error("理由の選択は必須です");
      return;
    }

    if (selectedItemsWithQuantity.length === 0) {
      toast.error("少なくとも1つの商品を選択してください");
      return;
    }

    const selectedReason = reasons.find((r) => r.id === selectedReasonId);
    const reasonText = selectedReason ? selectedReason.name : "";

    // Convert selected items with quantities to modified cart items for saving
    const freeItemsToSave = selectedItemsWithQuantity.map(({ item, freeQuantity }) => {
      // If making all items free, just pass the original item
      if (freeQuantity === item.quantity) {
        return item;
      }
      
      // Otherwise, create a new item with the specified free quantity
      return {
        ...item,
        quantity: freeQuantity, // Only the free quantity is saved as a free item
      };
    });

    const freeItems = JSON.parse(localStorage.getItem("freeItems") || "[]");
    freeItems.push({
      id: Date.now().toString(),
      staffName,
      reason: reasonText,
      notes: notes || "",
      timestamp: new Date().toISOString(),
      products: freeItemsToSave,
    });
    localStorage.setItem("freeItems", JSON.stringify(freeItems));

    onApprove(staffName, reasonText, notes, freeItemsToSave);
    setStaffName("");
    setNotes("");
    setSelectedReasonId("");
    setSelectedItemsWithQuantity([]);
    setSelectAll(false);
    onClose();
    toast.success("無料処理が承認されました");
  };

  const isItemSelected = (item: CartItem) => {
    return selectedItemsWithQuantity.some(selected => selected.item === item);
  };

  const getFreeQuantityForItem = (item: CartItem) => {
    const selectedItem = selectedItemsWithQuantity.find(selected => selected.item === item);
    return selectedItem ? selectedItem.freeQuantity : 0;
  };

  const handleToggleItem = (item: CartItem, index: number) => {
    const isSelected = isItemSelected(item);
    
    if (isSelected) {
      // Remove item from selection
      setSelectedItemsWithQuantity(prevItems => 
        prevItems.filter(selected => selected.item !== item)
      );
    } else {
      // Add item with default free quantity of 1
      setSelectedItemsWithQuantity(prevItems => [
        ...prevItems,
        { item, freeQuantity: 1 }
      ]);
    }
    
    // Update selectAll state based on whether all items would be selected
    const newSelectedCount = isSelected ? 
      selectedItemsWithQuantity.length - 1 : 
      selectedItemsWithQuantity.length + 1;
    
    setSelectAll(newSelectedCount === cartItems.length);
  };

  const handleToggleAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedItemsWithQuantity([]);
    } else {
      // Select all items with default free quantity of 1 for each
      const allItems = cartItems.map(item => ({
        item,
        freeQuantity: 1
      }));
      setSelectedItemsWithQuantity(allItems);
    }
    setSelectAll(!selectAll);
  };

  const handleIncrementFreeQuantity = (item: CartItem) => {
    setSelectedItemsWithQuantity(prevItems => 
      prevItems.map(selected => {
        if (selected.item === item) {
          // Don't exceed the total quantity of the item
          const newFreeQuantity = Math.min(selected.freeQuantity + 1, item.quantity);
          return { ...selected, freeQuantity: newFreeQuantity };
        }
        return selected;
      })
    );
  };

  const handleDecrementFreeQuantity = (item: CartItem) => {
    setSelectedItemsWithQuantity(prevItems => 
      prevItems.map(selected => {
        if (selected.item === item) {
          // Minimum free quantity is 1, if less than 1, remove the item
          const newFreeQuantity = selected.freeQuantity - 1;
          if (newFreeQuantity < 1) {
            return selected; // Will be filtered out below
          }
          return { ...selected, freeQuantity: newFreeQuantity };
        }
        return selected;
      }).filter(selected => selected.freeQuantity >= 1)
    );
  };

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
              
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center space-x-2 py-1.5 border-b last:border-b-0">
                  <Checkbox 
                    id={`item-${item.id}-${index}`} 
                    checked={isItemSelected(item)}
                    onCheckedChange={() => handleToggleItem(item, index)}
                  />
                  <label 
                    htmlFor={`item-${item.id}-${index}`} 
                    className="flex justify-between w-full text-sm leading-none cursor-pointer"
                  >
                    <span className="truncate flex-grow">{item.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      ¥{item.price.toLocaleString()} × {item.quantity}
                    </span>
                  </label>
                  
                  {isItemSelected(item) && (
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        type="button"
                        onClick={() => handleDecrementFreeQuantity(item)}
                        className="rounded-full p-1 bg-gray-100 hover:bg-gray-200"
                        disabled={getFreeQuantityForItem(item) <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-medium w-6 text-center">
                        {getFreeQuantityForItem(item)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrementFreeQuantity(item)}
                        className="rounded-full p-1 bg-gray-100 hover:bg-gray-200"
                        disabled={getFreeQuantityForItem(item) >= item.quantity}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
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
