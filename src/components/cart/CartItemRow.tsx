
import React from "react";
import { CartItem } from "@/types";
import { Trash2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isFree = item.originalPrice !== undefined;
  const freeQuantity = isFree ? (item.freeQuantity || 0) : 0;
  const paidQuantity = item.quantity - freeQuantity;
  const displayPrice = isFree ? item.originalPrice : item.price;
  const subtotal = displayPrice * paidQuantity;
  
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
          <h4 className="font-medium text-sm leading-tight truncate">
            {item.name}
            {isFree && freeQuantity > 0 && (
              <span className="ml-1 text-green-500 text-xs">
                ({freeQuantity}/{item.quantity}個無料)
              </span>
            )}
          </h4>
          
          <p className="text-sm text-muted-foreground">
            {isFree ? (
              <>
                <span>¥{displayPrice.toLocaleString()}</span>
                {freeQuantity === item.quantity && (
                  <span className="text-green-500 ml-1">すべて無料</span>
                )}
              </>
            ) : (
              `¥${item.price.toLocaleString()}`
            )} × {item.quantity}
          </p>
          
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
              <span className={cn("font-medium text-sm", isFree && freeQuantity === item.quantity && "text-green-500")}>
                ¥{subtotal.toLocaleString()}
              </span>
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

export default CartItemRow;
