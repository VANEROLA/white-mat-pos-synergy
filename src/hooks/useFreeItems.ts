import { useCallback } from "react";
import { CartItem } from "@/types";
import { addLogEntry } from "@/utils/api/logs";

interface FreeItemRecord {
  id: string;
  staffName: string;
  reason: string;
  notes: string;
  timestamp: string;
  products: CartItem[];
}

// Helper function to compress product data by removing unnecessary fields
const compressProducts = (products: CartItem[]): Partial<CartItem>[] => {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    // Only include imageUrl if it exists and is not too long
    ...(product.imageUrl && product.imageUrl.length < 100 ? { imageUrl: product.imageUrl } : {})
  }));
};

export const useFreeItems = () => {
  const getFreeItems = useCallback((): FreeItemRecord[] => {
    try {
      return JSON.parse(localStorage.getItem("freeItems") || "[]");
    } catch (error) {
      console.error("Error retrieving free items:", error);
      
      addLogEntry({
        action: "free_items_retrieval_error",
        details: `Failed to retrieve free items: ${error}`,
      });
      
      return [];
    }
  }, []);

  const clearOldFreeItems = useCallback(() => {
    try {
      const existingItems = JSON.parse(localStorage.getItem("freeItems") || "[]");
      
      // Keep only items from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const filteredItems = existingItems.filter((item: FreeItemRecord) => {
        const itemDate = new Date(item.timestamp);
        return itemDate > thirtyDaysAgo;
      });
      
      // Save filtered items
      localStorage.setItem("freeItems", JSON.stringify(filteredItems));
      
      return true;
    } catch (error) {
      console.error("Error clearing old free items:", error);
      return false;
    }
  }, []);

  const saveFreeItems = useCallback((item: FreeItemRecord) => {
    try {
      // Compress product data to save space
      const compressedItem = {
        ...item,
        products: compressProducts(item.products || [])
      };
      
      // Aggressive cleanup before trying to save
      // Clear old logs first to make space
      try {
        localStorage.removeItem("systemLogs");
      } catch (e) {
        console.log("Failed to clear logs:", e);
      }
      
      // Then try to retrieve existing items with error handling
      let existingItems: FreeItemRecord[] = [];
      try {
        existingItems = JSON.parse(localStorage.getItem("freeItems") || "[]");
      } catch (parseError) {
        console.error("Error parsing existing items, resetting:", parseError);
        existingItems = [];
      }
      
      // Limit the number of items to store
      const updatedItems = [compressedItem, ...existingItems].slice(0, 5);
      
      // Try progressive fallbacks for storage
      const storageSteps = [
        () => localStorage.setItem("freeItems", JSON.stringify(updatedItems)),
        () => localStorage.setItem("freeItems", JSON.stringify([compressedItem])),
        () => {
          // If still failing, try with even more compressed data
          const minimalItem = {
            id: compressedItem.id,
            staffName: compressedItem.staffName,
            reason: compressedItem.reason,
            timestamp: compressedItem.timestamp,
            // Truncate notes if present
            ...(compressedItem.notes ? { notes: compressedItem.notes.substring(0, 20) } : { notes: "" }),
            // Only keep minimal product info
            products: compressedItem.products.map(p => ({ 
              id: p.id, 
              name: p.name.substring(0, 10), 
              price: p.price, 
              quantity: p.quantity 
            }))
          };
          localStorage.setItem("freeItems", JSON.stringify([minimalItem]));
        },
        // Last resort: clear everything and just save the ID
        () => {
          localStorage.clear(); // Clear all storage
          localStorage.setItem("freeItems", JSON.stringify([{
            id: compressedItem.id,
            staffName: compressedItem.staffName,
            reason: compressedItem.reason,
            timestamp: compressedItem.timestamp,
            notes: "",
            products: []
          }]));
        }
      ];
      
      // Try each storage method in sequence until one works
      for (let i = 0; i < storageSteps.length; i++) {
        try {
          storageSteps[i]();
          
          // Log the success level
          addLogEntry({
            action: `free_items_saved_level_${i}`,
            details: `Saved free item with compression level ${i}`,
          });
          
          return; // Successfully saved
        } catch (storageError) {
          console.error(`Storage attempt ${i} failed:`, storageError);
          // Continue to next fallback
        }
      }
      
      // If we get here, all attempts failed
      throw new Error("保存できませんでした。ブラウザのストレージが一杯です。");
      
    } catch (error) {
      console.error("Error saving free items:", error);
      
      addLogEntry({
        action: "free_items_error",
        details: `Failed to save free items: ${error}`,
      });
      
      throw error;
    }
  }, []);

  return {
    saveFreeItems,
    getFreeItems,
    clearOldFreeItems
  };
};
