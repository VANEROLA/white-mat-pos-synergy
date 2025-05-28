
import React, { useState } from "react";
import { CartState, CartItem } from "@/types";
import { ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTax } from "@/contexts/TaxContext";
import FreeItemDialog from "@/components/FreeItemDialog";
import { addLogEntry } from "@/utils/api";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import CartCheckoutButton from "@/components/cart/CartCheckoutButton";
import EmptyCart from "@/components/cart/EmptyCart";

interface CartProps {
  cart: CartState;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onApplyFreeItems?: (items: CartItem[]) => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onApplyFreeItems,
}) => {
  const { taxRate, setTaxRate } = useTax();
  const [isFreeItemDialogOpen, setIsFreeItemDialogOpen] = useState(false);
    
  const handleFreeItemApproved = (staffName: string, reason: string, notes?: string, selectedItems?: CartItem[]) => {
    setTaxRate(0);
    
    addLogEntry({
      action: "apply_free_item",
      details: `Staff member ${staffName} approved free item: ${reason}${notes ? ` (Notes: ${notes})` : ''}`,
      userId: staffName
    });
    
    if (selectedItems && selectedItems.length > 0 && onApplyFreeItems) {
      onApplyFreeItems(selectedItems);
    }
  };
  
  return (
    <div className="relative h-full flex flex-col">
      <div className="glass rounded-xl p-6 flex flex-col animate-fade-in flex-1 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingCart size={18} /> カート
          </h2>
          <div className="text-sm text-muted-foreground">
            {cart.items.length} {cart.items.length === 1 ? '商品' : '商品'}
          </div>
        </div>
        
        <Separator className="bg-muted/50 my-2" />
        
        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="flex-grow overflow-y-auto scrollbar-hide my-2 pr-2">
              {cart.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>
            
            <CartSummary 
              cart={cart}
              taxRate={taxRate}
              setTaxRate={setTaxRate}
              onFreeItemClick={() => setIsFreeItemDialogOpen(true)}
            />
          </>
        )}
        
        <FreeItemDialog 
          open={isFreeItemDialogOpen}
          onClose={() => setIsFreeItemDialogOpen(false)}
          onApprove={handleFreeItemApproved}
          cartItems={cart.items}
        />
      </div>
      
      {cart.items.length > 0 && (
        <CartCheckoutButton 
          cart={cart}
          taxRate={taxRate}
          onCheckout={onCheckout}
        />
      )}
    </div>
  );
};

export default Cart;
