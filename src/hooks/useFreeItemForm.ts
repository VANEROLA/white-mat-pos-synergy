
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CartItem } from "@/types";
import { FreeItemReason, loadSavedReasons } from "@/utils/freeItemReasons";
import { useFreeItems } from "./useFreeItems";

export interface SelectedItemWithQuantity {
  item: CartItem;
  freeQuantity: number;
}

interface UseFreeItemFormResult {
  staffName: string;
  setStaffName: (name: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  selectedReasonId: string;
  setSelectedReasonId: (id: string) => void;
  showAddReason: boolean;
  setShowAddReason: (show: boolean) => void;
  showEditReason: boolean;
  setShowEditReason: (show: boolean) => void;
  newReasonName: string;
  setNewReasonName: (name: string) => void;
  reasons: FreeItemReason[];
  setReasons: (reasons: FreeItemReason[]) => void;
  selectedItemsWithQuantity: SelectedItemWithQuantity[];
  setSelectedItemsWithQuantity: React.Dispatch<React.SetStateAction<SelectedItemWithQuantity[]>>;
  selectAll: boolean;
  setSelectAll: (select: boolean) => void;
  resetForm: () => void;
  handleSubmit: (onApprove: (staffName: string, reason: string, notes?: string, selectedItems?: CartItem[]) => void, onClose: () => void) => void;
}

export const useFreeItemForm = (cartItems: CartItem[]): UseFreeItemFormResult => {
  const [staffName, setStaffName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedReasonId, setSelectedReasonId] = useState("");
  const [showAddReason, setShowAddReason] = useState(false);
  const [showEditReason, setShowEditReason] = useState(false);
  const [newReasonName, setNewReasonName] = useState("");
  const [reasons, setReasons] = useState<FreeItemReason[]>([]);
  const [selectedItemsWithQuantity, setSelectedItemsWithQuantity] = useState<SelectedItemWithQuantity[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const { saveFreeItems } = useFreeItems();

  // Load reasons once at initialization
  useEffect(() => {
    const savedReasons = loadSavedReasons();
    setReasons(savedReasons);
  }, []);

  const resetForm = useCallback(() => {
    setSelectedItemsWithQuantity([]);
    setSelectAll(false);
    setStaffName("");
    setNotes("");
    setSelectedReasonId("");
  }, []);

  const handleSubmit = useCallback((
    onApprove: (staffName: string, reason: string, notes?: string, selectedItems?: CartItem[]) => void, 
    onClose: () => void
  ) => {
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
      // Create a new item with the specified free quantity
      return {
        ...item,
        quantity: freeQuantity, // Only the free quantity is saved as a free item
      };
    });

    try {
      saveFreeItems({
        id: Date.now().toString(),
        staffName,
        reason: reasonText,
        notes: notes || "",
        timestamp: new Date().toISOString(),
        products: freeItemsToSave,
      });

      onApprove(staffName, reasonText, notes, freeItemsToSave);
      resetForm();
      onClose();
      toast.success("無料処理が承認されました");
    } catch (error) {
      console.error("Failed to save free items:", error);
      toast.error("保存中にエラーが発生しました。スペースに空きがありません");
    }
  }, [staffName, selectedReasonId, selectedItemsWithQuantity, notes, reasons, saveFreeItems, resetForm]);

  return {
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
  };
};
