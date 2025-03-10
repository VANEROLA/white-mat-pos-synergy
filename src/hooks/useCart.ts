
import { useState } from "react";
import { CartState, CartItem, Product, InventoryUpdatePayload } from "@/types";
import { toast } from "sonner";
import { addLogEntry } from "@/utils/api";
import { useConnection } from "@/contexts/ConnectionContext";
import { generateOrderId } from "@/utils/api";

export const useCart = () => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
  });
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const { status, isOnlineMode, addPendingAction } = useConnection();

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        
        const newTotal = calculateTotal(updatedItems);
        return { items: updatedItems, total: newTotal };
      } else {
        const newItem: CartItem = { ...product, quantity: 1 };
        const newItems = [...prev.items, newItem];
        const newTotal = calculateTotal(newItems);
        return { items: newItems, total: newTotal };
      }
    });
    
    toast.success(`${product.name}をカートに追加しました`, {
      duration: 1500,
      position: "top-right"
    });
    
    // オフラインでもログは記録するが、LocalStorageに保存
    if (isOnlineMode && status === 'connected') {
      addLogEntry({
        action: "add_to_cart",
        details: `Added ${product.name} to cart`,
        userId: ""
      });
    } else {
      const logEntry = {
        action: "add_to_cart",
        details: `Added ${product.name} to cart`,
        userId: "",
        timestamp: new Date().toISOString()
      };
      // オフライン時のログをLocalStorageに保存
      const offlineLogs = JSON.parse(localStorage.getItem('offlineLogs') || '[]');
      localStorage.setItem('offlineLogs', JSON.stringify([...offlineLogs, logEntry]));
    }
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart(prev => {
      const updatedItems = prev.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      const newTotal = calculateTotal(updatedItems);
      return { items: updatedItems, total: newTotal };
    });
    
    // オフラインでもログは記録するが、LocalStorageに保存
    if (isOnlineMode && status === 'connected') {
      addLogEntry({
        action: "update_quantity",
        details: `Updated quantity for product ${id} to ${quantity}`,
        userId: ""
      });
    } else {
      const logEntry = {
        action: "update_quantity",
        details: `Updated quantity for product ${id} to ${quantity}`,
        userId: "",
        timestamp: new Date().toISOString()
      };
      const offlineLogs = JSON.parse(localStorage.getItem('offlineLogs') || '[]');
      localStorage.setItem('offlineLogs', JSON.stringify([...offlineLogs, logEntry]));
    }
  };
  
  const handleRemoveFromCart = (id: string) => {
    setCart(prev => {
      const updatedItems = prev.items.filter(item => item.id !== id);
      const newTotal = calculateTotal(updatedItems);
      return { items: updatedItems, total: newTotal };
    });
    
    // オフラインでもログは記録するが、LocalStorageに保存
    if (isOnlineMode && status === 'connected') {
      addLogEntry({
        action: "remove_from_cart",
        details: `Removed product ${id} from cart`,
        userId: ""
      });
    } else {
      const logEntry = {
        action: "remove_from_cart",
        details: `Removed product ${id} from cart`,
        userId: "",
        timestamp: new Date().toISOString()
      };
      const offlineLogs = JSON.parse(localStorage.getItem('offlineLogs') || '[]');
      localStorage.setItem('offlineLogs', JSON.stringify([...offlineLogs, logEntry]));
    }
  };
  
  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error("カートに商品がありません");
      return;
    }
    
    setIsCheckoutOpen(true);
  };
  
  const handleCompleteCheckout = async () => {
    // オフラインモードの場合は在庫更新をキューに追加
    if (!isOnlineMode || status !== 'connected') {
      const orderId = generateOrderId();
      const payload: InventoryUpdatePayload = {
        products: cart.items.map(item => ({
          id: item.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          category: item.category,
        })),
        orderId,
        timestamp: new Date().toISOString(),
      };
      
      // オフラインモード用のActionをキューに追加
      addPendingAction({
        type: 'inventory_update',
        payload
      });
      
      // 在庫更新をローカルで行う
      updateLocalInventory(payload);
      
      toast.success("オフラインモードで注文が保存されました。オンライン時に同期します");
    }
    
    setCart({ items: [], total: 0 });
    
    // オフラインでもログは記録するが、LocalStorageに保存
    if (isOnlineMode && status === 'connected') {
      addLogEntry({
        action: "checkout_complete",
        details: `Completed checkout with ${cart.items.length} items`,
        userId: ""
      });
    } else {
      const logEntry = {
        action: "checkout_complete",
        details: `Completed checkout with ${cart.items.length} items`,
        userId: "",
        timestamp: new Date().toISOString()
      };
      const offlineLogs = JSON.parse(localStorage.getItem('offlineLogs') || '[]');
      localStorage.setItem('offlineLogs', JSON.stringify([...offlineLogs, logEntry]));
    }
  };

  // ローカルの在庫を更新する関数
  const updateLocalInventory = (payload: InventoryUpdatePayload) => {
    try {
      // 既存の商品をLocalStorageから取得
      const productsJson = localStorage.getItem('products') || '[]';
      const sampleProductsJson = localStorage.getItem('sampleProducts') || '[]';
      
      let products = JSON.parse(productsJson);
      let sampleProducts = JSON.parse(sampleProductsJson);
      
      // 商品の在庫を更新
      payload.products.forEach(item => {
        // ユーザー追加商品の更新
        const productIndex = products.findIndex((p: Product) => p.id === item.id);
        if (productIndex !== -1) {
          if (typeof products[productIndex].stockCount === 'undefined') {
            products[productIndex].stockCount = 100;
          }
          products[productIndex].stockCount = Math.max(0, products[productIndex].stockCount - item.quantity);
        }
        
        // サンプル商品の更新
        const sampleIndex = sampleProducts.findIndex((p: Product) => p.id === item.id);
        if (sampleIndex !== -1) {
          if (typeof sampleProducts[sampleIndex].stockCount === 'undefined') {
            sampleProducts[sampleIndex].stockCount = 100;
          }
          sampleProducts[sampleIndex].stockCount = Math.max(0, sampleProducts[sampleIndex].stockCount - item.quantity);
        }
      });
      
      // 更新した商品をLocalStorageに保存
      localStorage.setItem('products', JSON.stringify(products));
      localStorage.setItem('sampleProducts', JSON.stringify(sampleProducts));
      
      // オフラインでの注文履歴を保存
      const existingOrdersJson = localStorage.getItem('orderHistory') || '[]';
      const existingOrders = JSON.parse(existingOrdersJson);
      
      // 注文を作成
      const total = payload.products.reduce((sum, product) => {
        return sum + (product.price || 0) * product.quantity;
      }, 0);
      
      const order = {
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
        status: 'completed',
        syncStatus: 'pending' // オフラインで作成されたことを示す
      };
      
      // 注文履歴を更新
      const updatedOrders = [order, ...existingOrders];
      localStorage.setItem('orderHistory', JSON.stringify(updatedOrders));
      
    } catch (error) {
      console.error("Failed to update local inventory:", error);
      toast.error("ローカル在庫の更新に失敗しました");
    }
  };

  return {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleCheckout,
    handleCompleteCheckout
  };
};
