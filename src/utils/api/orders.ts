
import { InventoryUpdatePayload, Order } from "@/types";

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
    // We import addLogEntry here to avoid circular dependency
    const { addLogEntry } = require('./logs');
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
