
import React from "react";
import { CartState, CartItem } from "@/types";
import { Button } from "@/components/ui/button";

interface CartCheckoutButtonProps {
  cart: CartState;
  taxRate: number;
  onCheckout: () => void;
}

const CartCheckoutButton: React.FC<CartCheckoutButtonProps> = ({
  cart,
  taxRate,
  onCheckout,
}) => {
  const calculateSubtotal = (items: CartItem[]): number => {
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
  
  const subtotal = calculateSubtotal(cart.items);
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const totalWithTax = subtotal + taxAmount;
  
  return (
    <div className="fixed bottom-0 right-4 left-auto w-80 lg:w-96 z-50">
      <div className="glass rounded-t-xl p-4 border-t">
        <Button 
          className="w-full py-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-lg transition-all text-lg"
          onClick={onCheckout}
        >
          注文を確定する ¥{totalWithTax.toLocaleString()}
        </Button>
      </div>
    </div>
  );
};

export default CartCheckoutButton;
