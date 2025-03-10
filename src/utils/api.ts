import { toast } from "sonner";
import { ApiResponse, InventoryUpdatePayload, Order, LogEntry } from "@/types";

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

/**
 * Generates a unique order ID
 */
export const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Save order to local history
 */
const saveOrderToHistory = (payload: InventoryUpdatePayload): void => {
  try {
    // Get existing orders from localStorage
    const existingOrdersJson = localStorage.getItem('orderHistory') || '[]';
    const existingOrders: Order[] = JSON.parse(existingOrdersJson);
    
    // Create a mock order for the history
    const order: Order = {
      id: payload.orderId,
      items: payload.products.map(p => ({
        id: p.id,
        name: `Product ${p.id}`, // We don't have the names in the payload, this would normally come from the API
        price: 0, // Similarly, we don't have prices in the payload
        quantity: p.quantity,
        imageUrl: '', // No image in payload
        category: ''  // No category in payload
      })),
      total: 0, // We don't have the total in the payload
      timestamp: payload.timestamp,
      status: 'completed'
    };
    
    // Add to existing orders
    const updatedOrders = [order, ...existingOrders];
    
    // Save back to localStorage
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
  } catch (error) {
    console.error("Failed to save order to history:", error);
  }
};

/**
 * Get order history from localStorage
 */
export const getOrderHistory = (): Order[] => {
  try {
    const ordersJson = localStorage.getItem('orderHistory') || '[]';
    return JSON.parse(ordersJson);
  } catch (error) {
    console.error("Failed to retrieve order history:", error);
    return [];
  }
};

/**
 * Update an existing order
 */
export const updateOrder = (updatedOrder: Order): boolean => {
  try {
    const existingOrdersJson = localStorage.getItem('orderHistory') || '[]';
    const existingOrders: Order[] = JSON.parse(existingOrdersJson);
    
    const updatedOrders = existingOrders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    );
    
    localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    
    // Log the action
    addLogEntry({
      action: "order_update",
      details: `Updated order ${updatedOrder.id}`
    });
    
    return true;
  } catch (error) {
    console.error("Failed to update order:", error);
    return false;
  }
};

/**
 * Add a log entry
 */
export const addLogEntry = (entry: Pick<LogEntry, 'action' | 'details' | 'userId'>): void => {
  try {
    const existingLogsJson = localStorage.getItem('systemLogs') || '[]';
    const existingLogs: LogEntry[] = JSON.parse(existingLogsJson);
    
    const newLog: LogEntry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    const updatedLogs = [newLog, ...existingLogs];
    
    // Keep only the last 100 logs
    const trimmedLogs = updatedLogs.slice(0, 100);
    
    localStorage.setItem('systemLogs', JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error("Failed to add log entry:", error);
  }
};

/**
 * Get system logs
 */
export const getSystemLogs = (): LogEntry[] => {
  try {
    const logsJson = localStorage.getItem('systemLogs') || '[]';
    return JSON.parse(logsJson);
  } catch (error) {
    console.error("Failed to retrieve system logs:", error);
    return [];
  }
};
