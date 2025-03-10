
import { useState } from "react";
import { CartState, CartItem, Product } from "@/types";
import { toast } from "sonner";
import { addLogEntry } from "@/utils/api";

export const useCart = () => {
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
  });
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isFreeOrder, setIsFreeOrder] = useState<boolean>(false);

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
    
    // ログを記録
    addLogEntry({
      action: "add_to_cart",
      details: `Added ${product.name} to cart`,
      userId: ""
    });
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart(prev => {
      const updatedItems = prev.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      const newTotal = calculateTotal(updatedItems);
      return { items: updatedItems, total: newTotal };
    });
    
    addLogEntry({
      action: "update_quantity",
      details: `Updated quantity for product ${id} to ${quantity}`,
      userId: ""
    });
  };
  
  const handleRemoveFromCart = (id: string) => {
    setCart(prev => {
      const updatedItems = prev.items.filter(item => item.id !== id);
      const newTotal = calculateTotal(updatedItems);
      return { items: updatedItems, total: newTotal };
    });
    
    addLogEntry({
      action: "remove_from_cart",
      details: `Removed product ${id} from cart`,
      userId: ""
    });
  };
  
  const calculateTotal = (items: CartItem[]): number => {
    if (isFreeOrder) return 0;
    return items.reduce((sum, item) => {
      if (item.originalPrice !== undefined) {
        const freeQuantity = Math.min(item.quantity, item.freeQuantity || 0);
        const paidQuantity = item.quantity - freeQuantity;
        return sum + (item.originalPrice * paidQuantity);
      } else {
        return sum + (item.price * item.quantity);
      }
    }, 0);
  };
  
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error("カートに商品がありません");
      return;
    }
    
    setIsCheckoutOpen(true);
  };
  
  const handleCompleteCheckout = async () => {
    // Reset all cart items to their original prices if they were made free
    cart.items.forEach(item => {
      if (item.originalPrice !== undefined) {
        item.price = item.originalPrice;
        delete item.originalPrice;
        delete item.freeQuantity;
      }
    });
    
    setCart({ items: [], total: 0 });
    setIsFreeOrder(false);
    
    addLogEntry({
      action: "checkout_complete",
      details: `Completed checkout with ${cart.items.length} items`,
      userId: ""
    });
  };

  const setOrderToFree = () => {
    setIsFreeOrder(true);
    setCart(prev => ({ ...prev, total: 0 }));
  };

  const handleApplyFreeItems = (items: CartItem[]) => {
    setCart(prev => {
      const updatedItems = prev.items.map(item => {
        // Find if this item is in the free items list
        const freeItem = items.find(fi => fi.id === item.id);
        
        if (freeItem) {
          // If the item should be free
          if (!item.originalPrice) {
            // Save the original price if not already saved
            return {
              ...item,
              originalPrice: item.price,
              price: 0,
              freeQuantity: freeItem.quantity
            };
          } else {
            // Update free quantity if already marked as free
            return {
              ...item,
              freeQuantity: freeItem.quantity
            };
          }
        }
        return item;
      });
      
      const newTotal = calculateTotal(updatedItems);
      return { items: updatedItems, total: newTotal };
    });
  };

  return {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleCheckout,
    handleCompleteCheckout,
    setOrderToFree,
    handleApplyFreeItems,
    isFreeOrder
  };
};
