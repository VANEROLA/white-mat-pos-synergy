
import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from "lucide-react";
import { CartItem } from "@/types";

interface SelectedItemWithQuantity {
  item: CartItem;
  freeQuantity: number;
}

interface ItemSelectionListProps {
  cartItems: CartItem[];
  selectedItemsWithQuantity: SelectedItemWithQuantity[];
  setSelectedItemsWithQuantity: React.Dispatch<React.SetStateAction<SelectedItemWithQuantity[]>>;
  selectAll: boolean;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ItemSelectionList: React.FC<ItemSelectionListProps> = ({
  cartItems,
  selectedItemsWithQuantity,
  setSelectedItemsWithQuantity,
  selectAll,
  setSelectAll,
}) => {
  // Effect to update selectAll state when all items are selected or deselected
  useEffect(() => {
    if (cartItems.length > 0) {
      const allSelected = cartItems.every(item => 
        selectedItemsWithQuantity.some(selected => selected.item.id === item.id)
      );
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [selectedItemsWithQuantity, cartItems, setSelectAll]);

  const isItemSelected = (item: CartItem) => {
    return selectedItemsWithQuantity.some(selected => selected.item.id === item.id);
  };

  const getFreeQuantityForItem = (item: CartItem) => {
    const selectedItem = selectedItemsWithQuantity.find(selected => selected.item.id === item.id);
    return selectedItem ? selectedItem.freeQuantity : 0;
  };

  const handleToggleItem = (item: CartItem) => {
    const isSelected = isItemSelected(item);
    
    if (isSelected) {
      // Remove item from selection
      setSelectedItemsWithQuantity(prevItems => 
        prevItems.filter(selected => selected.item.id !== item.id)
      );
    } else {
      // Add item with default free quantity of 1
      const newItem = { item, freeQuantity: 1 };
      setSelectedItemsWithQuantity(prevItems => [...prevItems, newItem]);
    }
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
  };

  const handleIncrementFreeQuantity = (item: CartItem) => {
    setSelectedItemsWithQuantity(prevItems => 
      prevItems.map(selected => {
        if (selected.item.id === item.id) {
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
        if (selected.item.id === item.id) {
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
              onCheckedChange={() => handleToggleItem(item)}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDecrementFreeQuantity(item);
                  }}
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
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleIncrementFreeQuantity(item);
                  }}
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
  );
};
