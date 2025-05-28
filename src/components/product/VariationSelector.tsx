
import React from "react";
import { Product, ProductVariation } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

interface VariationSelectorProps {
  product: Product;
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product, variation?: ProductVariation) => void;
}

const VariationSelector: React.FC<VariationSelectorProps> = ({
  product,
  open,
  onClose,
  onSelect,
}) => {
  const handleSelect = (variation?: ProductVariation) => {
    if (variation) {
      // Create a new product object with variation data
      const variationProduct: Product = {
        ...product,
        id: `${product.id}-${variation.id}`,
        name: `${product.name} (${variation.name})`,
        price: variation.price,
        stockCount: variation.stockCount,
        imageUrl: variation.imageUrl || product.imageUrl,
      };
      onSelect(variationProduct, variation);
    } else {
      onSelect(product);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package size={18} />
            {product.name} - オプション選択
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between p-4 h-auto"
            onClick={() => handleSelect()}
          >
            <div className="flex items-center gap-3">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="text-left">
                <div className="font-medium">通常版</div>
                <div className="text-sm text-muted-foreground">
                  ¥{product.price.toLocaleString()}
                </div>
              </div>
            </div>
          </Button>

          {product.variations?.map((variation) => (
            <Button
              key={variation.id}
              variant="outline"
              className="w-full justify-between p-4 h-auto"
              onClick={() => handleSelect(variation)}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={variation.imageUrl || product.imageUrl} 
                  alt={variation.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="text-left">
                  <div className="font-medium">{variation.name}</div>
                  <div className="text-sm text-muted-foreground">
                    ¥{variation.price.toLocaleString()}
                    {variation.stockCount !== undefined && ` - 在庫: ${variation.stockCount}`}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VariationSelector;
