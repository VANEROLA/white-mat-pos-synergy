import { InventoryUpdatePayload, Order } from "@/types";
import { addLogEntry } from "./logs";
import { clearOldLogs } from "./logs";

/**
 * Save order to local history
 */
export const saveOrderToHistory = (payload: InventoryUpdatePayload): void => {
  try {
    // Get existing orders from localStorage
    const existingOrdersJson = localStorage.getItem('orderHistory') || '[]';
    const existingOrders: Order[] = JSON.parse(existingOrdersJson);
    
    // Calculate total
    const total = payload.products.reduce((sum, product) => {
      return sum + (product.price || 0) * product.quantity;
    }, 0);
    
    // Create a mock order for the history
    const order: Order = {
      id: payload.orderId,
      items: payload.products.map(p => ({
        id: p.id,
        name: p.name || `Product ${p.id}`,
        price: p.price || 0,
        quantity: p.quantity,
        imageUrl: p.imageUrl || '',
        category: p.category || ''
      })),
      total: total,
      timestamp: payload.timestamp,
      status: 'completed'
    };
    
    // Add to existing orders, but keep only the last 30
    const updatedOrders = [order, ...existingOrders].slice(0, 30);
    
    try {
      // Try to save to localStorage
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
    } catch (storageError) {
      // Handle storage full error
      if (storageError instanceof DOMException && 
          (storageError.name === "QuotaExceededError" || storageError.code === 22)) {
        
        // Emergency cleanup: try clearing old logs
        const logsCleared = clearOldLogs();
        
        if (logsCleared) {
          try {
            // Try again after clearing logs
            localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
            return;
          } catch (secondAttemptError) {
            // Still failing, try with fewer orders
          }
        }
        
        try {
          // Keep only 10 most recent orders
          const minimalOrders = [order, ...existingOrders.slice(0, 9)];
          localStorage.setItem('orderHistory', JSON.stringify(minimalOrders));
          
          addLogEntry({
            action: "order_history_minimal_save",
            details: `Saved minimal order history due to storage limitations`
          });
        } catch (fallbackError) {
          // If that still fails, just store the current order
          try {
            localStorage.setItem('orderHistory', JSON.stringify([order]));
            
            addLogEntry({
              action: "order_history_single_save",
              details: `Saved only current order due to severe storage limitations`
            });
          } catch (finalError) {
            console.error("Could not store order history at all due to storage limitations");
            
            addLogEntry({
              action: "order_history_save_failed",
              details: `Failed to save order history completely`
            });
          }
        }
      } else {
        throw storageError; // Re-throw if it's not a storage quota issue
      }
    }
  } catch (error) {
    console.error("Failed to save order to history:", error);
    
    addLogEntry({
      action: "order_save_error",
      details: `Failed to save order to history: ${error}`
    });
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
    
    try {
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
      
      // Log the action
      addLogEntry({
        action: "order_update",
        details: `Updated order ${updatedOrder.id}`
      });
      
      return true;
    } catch (storageError) {
      // Handle storage full error
      if (storageError instanceof DOMException && 
          (storageError.name === "QuotaExceededError" || storageError.code === 22)) {
        
        try {
          // Try with fewer orders but make sure to include the updated one
          const minimalOrders = updatedOrders.slice(0, 10);
          
          // Ensure the updated order is included
          if (!minimalOrders.some(o => o.id === updatedOrder.id)) {
            minimalOrders.pop(); // Remove the last one
            minimalOrders.push(updatedOrder); // Add the updated one
          }
          
          localStorage.setItem('orderHistory', JSON.stringify(minimalOrders));
          
          addLogEntry({
            action: "order_update_minimal",
            details: `Updated order ${updatedOrder.id} with reduced history`
          });
          
          return true;
        } catch (fallbackError) {
          console.error("Failed to update order even with reduced history:", fallbackError);
          return false;
        }
      } else {
        throw storageError; // Re-throw if it's not a storage quota issue
      }
    }
  } catch (error) {
    console.error("Failed to update order:", error);
    return false;
  }
};

/**
 * Clean up old orders to free storage space
 */
export const cleanupOrderHistory = (): boolean => {
  try {
    const existingOrdersJson = localStorage.getItem('orderHistory') || '[]';
    const existingOrders: Order[] = JSON.parse(existingOrdersJson);
    
    // Keep only orders from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentOrders = existingOrders.filter(order => {
      const orderDate = new Date(order.timestamp);
      return orderDate > thirtyDaysAgo;
    });
    
    // Keep at most 30 recent orders
    const trimmedOrders = recentOrders.slice(0, 30);
    
    localStorage.setItem('orderHistory', JSON.stringify(trimmedOrders));
    
    addLogEntry({
      action: "order_history_cleanup",
      details: `Cleaned up order history to ${trimmedOrders.length} recent orders`
    });
    
    return true;
  } catch (error) {
    console.error("Failed to clean up order history:", error);
    return false;
  }
};
