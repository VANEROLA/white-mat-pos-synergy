
import React from "react";
import { Product } from "@/types";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onAddToCart }) => {
  const [isHovering, setIsHovering] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };
  
  return (
    <div 
      className={cn(
        "glass rounded-xl p-4 transition-all duration-300 overflow-hidden hover-lift",
        isAdding && "bg-accent/50",
        "animate-scale-in"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-muted/30">
        <img 
          src={product.imageUrl || 'https://placehold.co/200x200?text=商品'}
          alt={product.name}
          className={cn(
            "object-cover w-full h-full transition-transform duration-700",
            isHovering && "scale-105"
          )}
          loading="lazy"
        />
        <div 
          className={cn(
            "absolute inset-0 bg-black/0 flex items-center justify-center transition-all duration-300",
            isHovering ? "bg-black/5" : "opacity-0"
          )}
        >
          <button 
            onClick={handleAddToCart}
            className={cn(
              "bg-white text-primary rounded-full p-2 shadow-md transform transition-all duration-300",
              isHovering ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">¥{product.price.toLocaleString()}</p>
          {product.stockCount !== undefined && (
            <p className="text-xs text-muted-foreground">在庫: {product.stockCount}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
