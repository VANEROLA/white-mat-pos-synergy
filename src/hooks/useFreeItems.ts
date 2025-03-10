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

export const useFreeItems = () => {
  const saveFreeItems = useCallback((item: FreeItemRecord) => {
    try {
      // Get existing records
      const existingItems = JSON.parse(localStorage.getItem("freeItems") || "[]");
      
      // Only store the last 20 records to prevent localStorage overflow
      const updatedItems = [item, ...existingItems].slice(0, 20);
      
      try {
        // Try to store the data
        localStorage.setItem("freeItems", JSON.stringify(updatedItems));
        
        // Log success
        addLogEntry({
          action: "free_items_saved",
          details: `Added free item record: ${item.id}`,
        });
      } catch (storageError) {
        console.error("Storage error:", storageError);
        
        // If storage is full, try a more aggressive cleanup
        if (storageError instanceof DOMException && 
            (storageError.name === "QuotaExceededError" || storageError.code === 22)) {
          
          // Keep only the 5 most recent items to free up space
          const reducedItems = [item, ...existingItems.slice(0, 4)];
          try {
            localStorage.setItem("freeItems", JSON.stringify(reducedItems));
            
            // Log fallback success
            addLogEntry({
              action: "free_items_saved_fallback",
              details: `Added free item with reduced history due to storage constraints`,
            });
            
            return; // Successfully saved with reduced history
          } catch (fallbackError) {
            // If still failing, try just saving the current item
            try {
              localStorage.setItem("freeItems", JSON.stringify([item]));
              
              // Log minimal fallback success
              addLogEntry({
                action: "free_items_saved_minimal",
                details: `Added only the current free item due to severe storage constraints`,
              });
              
              return; // Successfully saved current item only
            } catch (minimalError) {
              // If all attempts fail, try clearing some other data to make room
              try {
                // Try to clear less critical data (e.g., logs)
                localStorage.removeItem("systemLogs");
                localStorage.setItem("freeItems", JSON.stringify([item]));
                
                addLogEntry({
                  action: "storage_emergency_cleanup",
                  details: `Cleared logs to save free item data`,
                });
                
                return; // Successfully saved after emergency cleanup
              } catch (emergencyError) {
                throw new Error("すべての保存方法が失敗しました。ブラウザのキャッシュをクリアしてください。");
              }
            }
          }
        } else {
          throw storageError; // Re-throw if it's a different error
        }
      }
    } catch (error) {
      console.error("Error saving free items:", error);
      
      addLogEntry({
        action: "free_items_error",
        details: `Failed to save free items: ${error}`,
      });
      
      throw error;
    }
  }, []);

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

  return {
    saveFreeItems,
    getFreeItems,
    clearOldFreeItems
  };
};
