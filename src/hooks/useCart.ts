
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
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error("カートに商品がありません");
      return;
    }
    
    setIsCheckoutOpen(true);
  };
  
  const handleCompleteCheckout = () => {
    setCart({ items: [], total: 0 });
    
    addLogEntry({
      action: "checkout_complete",
      details: `Completed checkout with ${cart.items.length} items`,
      userId: ""
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
    handleCompleteCheckout
  };
};
