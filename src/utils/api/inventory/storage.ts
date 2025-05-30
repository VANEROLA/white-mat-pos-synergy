import { InventoryUpdatePayload, Product } from "@/types";
import { addLogEntry } from "../logs";

/**
 * Update product stock counts in localStorage
 */
export const updateProductStockCounts = (payload: InventoryUpdatePayload): void => {
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
      const SAMPLE_PRODUCTS = getSampleProducts();
      
      try {
        localStorage.setItem('sampleProducts', JSON.stringify(SAMPLE_PRODUCTS));
        sampleProducts = SAMPLE_PRODUCTS;
      } catch (storageError) {
        // Handle storage error for sample products
        console.error("Failed to save sample products:", storageError);
        sampleProducts = SAMPLE_PRODUCTS; // Still use them in memory
        
        // Log the error
        addLogEntry({
          action: "sample_products_storage_error",
          details: `Failed to save sample products due to storage limitations`
        });
      }
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
        productMap.set(product.id, product);
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
    
    // Safe storage function with fallback
    const safeStore = (key: string, data: any) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error(`Failed to save ${key}:`, error);
        
        // If it's a storage quota issue, try to save a minimal version
        if (error instanceof DOMException && 
            (error.name === "QuotaExceededError" || error.code === 22)) {
          
          try {
            // For products, limit to just the ones we modified
            if (key === 'products' || key === 'sampleProducts') {
              // Only keep the modified products to save space
              const modifiedProductIds = new Set(payload.products.map(p => p.id));
              const minimalProductList = data.filter((p: Product) => modifiedProductIds.has(p.id));
              
              localStorage.setItem(key, JSON.stringify(minimalProductList));
              
              addLogEntry({
                action: "storage_minimal_save",
                details: `Saved minimal version of ${key} due to storage limitations`
              });
              
              return true;
            }
          } catch (fallbackError) {
            console.error(`Failed minimal save for ${key}:`, fallbackError);
            return false;
          }
        }
        
        return false;
      }
    };
    
    // Try to save both collections
    const sampleSaved = safeStore('sampleProducts', updatedSampleProducts);
    const productsSaved = safeStore('products', updatedProducts);
    
    if (sampleSaved && productsSaved) {
      console.log("Updated stock counts successfully");
    } else {
      console.warn("Partial or failed update of stock counts due to storage limitations");
    }
    
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
 * サンプル商品データを取得する
 */
const getSampleProducts = (): Product[] => {
  return [
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
};
