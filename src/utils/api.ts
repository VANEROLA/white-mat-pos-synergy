import { toast } from "sonner";
import { ApiResponse, InventoryUpdatePayload, Order, LogEntry, Product } from "@/types";

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

/**
 * Update product stock counts in localStorage
 */
const updateProductStockCounts = (payload: InventoryUpdatePayload): void => {
  try {
    // Get existing products from localStorage
    const productsJson = localStorage.getItem('products') || '[]';
    let products: Product[] = JSON.parse(productsJson);
    
    // Get the sample products from localStorage or use default sample products
    const sampleProductsJson = localStorage.getItem('sampleProducts');
    let sampleProducts: Product[] = [];
    
    if (sampleProductsJson) {
      sampleProducts = JSON.parse(sampleProductsJson);
    } else {
      // Save SAMPLE_PRODUCTS to localStorage if they don't exist yet
      const SAMPLE_PRODUCTS = [
        {
          id: "1",
          name: "カフェラテ",
          price: 480,
          imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80",
          category: "コーヒー",
          stockCount: 100
        },
        // ... other sample products
      ];
      localStorage.setItem('sampleProducts', JSON.stringify(SAMPLE_PRODUCTS));
      sampleProducts = SAMPLE_PRODUCTS;
    }
    
    // Create a map for faster lookups
    const productMap = new Map<string, Product>();
    
    // Add all products to the map
    [...products, ...sampleProducts].forEach(product => {
      productMap.set(product.id, { ...product });
    });
    
    // Update stock counts for each product in the order
    payload.products.forEach(item => {
      const product = productMap.get(item.id);
      if (product) {
        // Initialize stockCount if undefined
        if (typeof product.stockCount === 'undefined') {
          product.stockCount = 100; // Default initial stock
        }
        
        // Decrease stock by the ordered quantity
        product.stockCount = Math.max(0, product.stockCount - item.quantity);
        
        // Update the map
        productMap.set(item.id, product);
      }
    });
    
    // Update both collections
    const updatedSampleProducts = sampleProducts.map(product => {
      const updatedProduct = productMap.get(product.id);
      return updatedProduct || product;
    });
    
    const updatedProducts = products.map(product => {
      const updatedProduct = productMap.get(product.id);
      return updatedProduct || product;
    });
    
    // Save back to localStorage
    localStorage.setItem('sampleProducts', JSON.stringify(updatedSampleProducts));
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    
    console.log("Updated stock counts:", { updatedSampleProducts, updatedProducts });
    
    // Log the stock update
    addLogEntry({
      action: "stock_update",
      details: `Updated stock counts for ${payload.products.length} products in order ${payload.orderId}`
    });
  } catch (error) {
    console.error("Failed to update stock counts:", error);
    
    addLogEntry({
      action: "stock_update_error",
      details: `Failed to update stock counts: ${error}`
    });
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
