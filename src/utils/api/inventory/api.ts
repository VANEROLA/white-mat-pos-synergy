
import { toast } from "sonner";
import { ApiResponse, InventoryUpdatePayload } from "@/types";
import { addLogEntry } from "../logs";
import { saveOrderToHistory } from "../orders";
import { updateProductStockCounts } from "./storage";

// Simulated API endpoint for inventory system
const API_ENDPOINT = "https://api.example.com/inventory";

/**
 * Updates inventory in external system
 * In a real application, this would connect to an actual API
 */
export const updateInventory = async (payload: InventoryUpdatePayload): Promise<ApiResponse> => {
  try {
    // In a real application, this would be a fetch request to the API
    console.log("Sending inventory update:", payload);
    
    // Update product stock counts in localStorage
    updateProductStockCounts(payload);
    
    // Add to local storage for order history
    saveOrderToHistory(payload);
    
    // Log this action
    addLogEntry({
      action: "inventory_update",
      details: `Updated inventory for order ${payload.orderId} with ${payload.products.length} products`
    });
    
    // Simulate API call with a delay
    return await new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful response
        resolve({
          success: true,
          message: "在庫の更新に成功しました",
          data: {
            orderId: payload.orderId,
            updatedAt: new Date().toISOString(),
          }
        });
      }, 800);
    });
  } catch (error) {
    console.error("Inventory update failed:", error);
    toast.error("在庫の更新に失敗しました。もう一度お試しください。");
    
    // Log error
    addLogEntry({
      action: "inventory_update_error",
      details: `Failed to update inventory for order: ${error}`
    });
    
    return {
      success: false,
      message: "在庫の更新に失敗しました",
    };
  }
};
