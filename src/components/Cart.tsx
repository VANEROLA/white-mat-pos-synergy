
import React from "react";
import { CartItem, CartState } from "@/types";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartProps {
  cart: CartState;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  return (
    <div className="glass rounded-xl p-6 h-full flex flex-col animate-fade-in">
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
        <div className="flex flex-col items-center justify-center flex-grow py-6 text-muted-foreground">
          <ShoppingCart size={32} className="mb-2 opacity-30" />
          <p>カートに商品がありません</p>
          <p className="text-sm">商品を追加してください</p>
        </div>
      ) : (
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
      )}
      
      {cart.items.length > 0 && (
        <>
          <Separator className="bg-muted/50 my-4" />
          
          <div className="mt-auto">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">小計:</span>
              <span>¥{cart.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">消費税 (10%):</span>
              <span>¥{Math.round(cart.total * 0.1).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold mb-6">
              <span>合計:</span>
              <span className="text-lg">¥{Math.round(cart.total * 1.1).toLocaleString()}</span>
            </div>
            
            <Button 
              className="w-full py-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-sm transition-all"
              onClick={onCheckout}
            >
              注文を確定する
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const subtotal = item.price * item.quantity;
  
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      onRemoveItem(item.id);
    }
  };
  
  return (
    <div className="py-3 animate-slide-up">
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted/30">
          <img
            src={item.imageUrl || 'https://placehold.co/100x100?text=' + item.name}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <div className="flex-grow min-w-0">
          <h4 className="font-medium text-sm leading-tight truncate">{item.name}</h4>
          <p className="text-sm text-muted-foreground">¥{item.price.toLocaleString()} × {item.quantity}</p>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <button
                onClick={handleDecrement}
                className="text-muted-foreground hover:text-foreground rounded-full p-1"
              >
                <Minus size={14} />
              </button>
              <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
              <button
                onClick={handleIncrement}
                className="text-muted-foreground hover:text-foreground rounded-full p-1"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">¥{subtotal.toLocaleString()}</span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-muted-foreground hover:text-destructive transition-colors rounded-full p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
