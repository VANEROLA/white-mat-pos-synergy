
import React from "react";
import { CartState, CartItem } from "@/types";
import { BadgePercent } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import TaxSelector from "./TaxSelector";

interface CartSummaryProps {
  cart: CartState;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  onFreeItemClick: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  taxRate,
  setTaxRate,
  onFreeItemClick,
}) => {
  const taxOptions = [0, 8, 10];
  
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
    <>
      <Separator className="bg-muted/50 my-4" />
      
      <div className="mt-auto">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">小計:</span>
          <span>¥{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-muted-foreground flex items-center">
            <BadgePercent size={14} className="mr-1" />
            消費税 ({taxRate}%):
          </span>
          <span>¥{taxAmount.toLocaleString()}</span>
        </div>
        
        <TaxSelector 
          taxRate={taxRate}
          setTaxRate={setTaxRate}
          taxOptions={taxOptions}
          onFreeItemClick={onFreeItemClick}
        />
        
        <div className="flex justify-between font-semibold mb-2 bg-muted/20 p-2 rounded-md">
          <span>合計:</span>
          <span className="text-lg">¥{totalWithTax.toLocaleString()}</span>
        </div>
      </div>
    </>
  );
};

export default CartSummary;
