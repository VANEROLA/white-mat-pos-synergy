
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
            "object-cover w-full h-full transition-transform duration-700 cursor-pointer",
            isHovering && "scale-105"
          )}
          loading="lazy"
          onClick={handleAddToCart}
        />
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
