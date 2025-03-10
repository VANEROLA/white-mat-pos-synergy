import { useCallback } from "react";
import { CartItem } from "@/types";

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
      
      // Only store the last 50 records to prevent localStorage overflow
      const updatedItems = [item, ...existingItems].slice(0, 50);
      
      // Store with handling for potential quota errors
      try {
        localStorage.setItem("freeItems", JSON.stringify(updatedItems));
      } catch (error) {
        // If storage is full, try removing older items
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          // Keep only the 20 most recent items
          const reducedItems = [item, ...existingItems].slice(0, 20);
          localStorage.setItem("freeItems", JSON.stringify(reducedItems));
        } else {
          throw error; // Re-throw if it's a different error
        }
      }
    } catch (error) {
      console.error("Error saving free items:", error);
      throw error;
    }
  }, []);

  const getFreeItems = useCallback((): FreeItemRecord[] => {
    try {
      return JSON.parse(localStorage.getItem("freeItems") || "[]");
    } catch (error) {
      console.error("Error retrieving free items:", error);
      return [];
    }
  }, []);

  return {
    saveFreeItems,
    getFreeItems
  };
};
