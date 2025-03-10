import { toast } from "sonner";
import { ApiResponse, InventoryUpdatePayload, Product } from "@/types";
import { addLogEntry } from "./logs";
import { saveOrderToHistory } from "./orders";

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
        {
          id: "2",
          name: "カプチーノ",
          price: 450,
          imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=80",
          category: "コーヒー",
          stockCount: 80
        },
        {
          id: "3",
          name: "エスプレッソ",
          price: 380,
          imageUrl: "https://images.unsplash.com/photo-1596952954288-16862d37405d?w=500&auto=format&fit=crop&q=80",
          category: "コーヒー",
          stockCount: 120
        },
        {
          id: "4",
          name: "抹茶ラテ",
          price: 520,
          imageUrl: "https://images.unsplash.com/photo-1582198684221-9eb29d335c33?w=500&auto=format&fit=crop&q=80",
          category: "ティー",
          stockCount: 75
        },
        {
          id: "5",
          name: "ミルクティー",
          price: 420,
          imageUrl: "https://images.unsplash.com/photo-1592429929785-ba94aea023b1?w=500&auto=format&fit=crop&q=80",
          category: "ティー",
          stockCount: 90
        },
        {
          id: "6",
          name: "フルーツティー",
          price: 480,
          imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
          category: "ティー",
          stockCount: 60
        },
        {
          id: "7",
          name: "チョコレートケーキ",
          price: 580,
          imageUrl: "https://images.unsplash.com/photo-1565808229224-264b35aa092b?w=500&auto=format&fit=crop&q=80",
          category: "ケーキ",
          stockCount: 40
        },
        {
          id: "8",
          name: "チーズケーキ",
          price: 560,
          imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=80",
          category: "ケーキ",
          stockCount: 35
        },
        {
          id: "9",
          name: "クロワッサン",
          price: 280,
          imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
          category: "ベーカリー",
          stockCount: 50
        },
        {
          id: "10",
          name: "パニーニ",
          price: 650,
          imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
          category: "サンドイッチ",
          stockCount: 30
        },
        {
          id: "11",
          name: "アボカドトースト",
          price: 580,
          imageUrl: "https://images.unsplash.com/photo-1603046891744-1f058b8a8739?w=500&auto=format&fit=crop&q=80",
          category: "サンドイッチ",
          stockCount: 25
        },
        {
          id: "12",
          name: "フルーツサンド",
          price: 450,
          imageUrl: "https://images.unsplash.com/photo-1628294895290-192f6f73860e?w=500&auto=format&fit=crop&q=80",
          category: "サンドイッチ",
          stockCount: 40
        }
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
