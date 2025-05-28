
import React, { useState } from "react";
import { ProductVariation } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Package } from "lucide-react";

interface VariationManagerProps {
  variations: ProductVariation[];
  onChange: (variations: ProductVariation[]) => void;
}

const VariationManager: React.FC<VariationManagerProps> = ({
  variations,
  onChange,
}) => {
  const [newVariation, setNewVariation] = useState({
    name: "",
    price: "",
    stockCount: "",
  });

  const addVariation = () => {
    if (!newVariation.name.trim() || !newVariation.price.trim()) return;

    const variation: ProductVariation = {
      id: `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newVariation.name,
      price: Number(newVariation.price),
      stockCount: newVariation.stockCount ? Number(newVariation.stockCount) : 0,
    };

    onChange([...variations, variation]);
    setNewVariation({ name: "", price: "", stockCount: "" });
  };

  const removeVariation = (id: string) => {
    onChange(variations.filter(v => v.id !== id));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center">
        <Package size={16} className="mr-1.5" />
        バリエーション
      </label>
      
      <div className="space-y-3">
        {variations.map((variation) => (
          <div key={variation.id} className="flex items-center gap-2 p-3 border rounded-lg">
            <div className="flex-grow">
              <div className="font-medium">{variation.name}</div>
              <div className="text-sm text-muted-foreground">
                ¥{variation.price.toLocaleString()} - 在庫: {variation.stockCount}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeVariation(variation.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}

        <div className="border-2 border-dashed border-muted rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
            <Input
              placeholder="バリエーション名"
              value={newVariation.name}
              onChange={(e) => setNewVariation(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="価格"
              type="number"
              value={newVariation.price}
              onChange={(e) => setNewVariation(prev => ({ ...prev, price: e.target.value }))}
            />
            <Input
              placeholder="在庫数"
              type="number"
              value={newVariation.stockCount}
              onChange={(e) => setNewVariation(prev => ({ ...prev, stockCount: e.target.value }))}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariation}
            disabled={!newVariation.name.trim() || !newVariation.price.trim()}
          >
            <Plus size={16} className="mr-1" />
            バリエーションを追加
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VariationManager;
