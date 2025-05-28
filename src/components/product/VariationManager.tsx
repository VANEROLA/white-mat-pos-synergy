
import React, { useState } from "react";
import { ProductVariation } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Package, ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";

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
    imageFile: null as File | null,
    imagePreview: null as string | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        toast.error("画像ファイルのみアップロードできます");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("画像サイズは5MB以下にしてください");
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setNewVariation(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: loadEvent.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariation = () => {
    if (!newVariation.name.trim() || !newVariation.price.trim()) {
      toast.error("バリエーション名と価格は必須です");
      return;
    }

    const variation: ProductVariation = {
      id: `var-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newVariation.name,
      price: Number(newVariation.price),
      stockCount: newVariation.stockCount ? Number(newVariation.stockCount) : 0,
      imageUrl: newVariation.imagePreview || undefined,
    };

    onChange([...variations, variation]);
    setNewVariation({ 
      name: "", 
      price: "", 
      stockCount: "", 
      imageFile: null, 
      imagePreview: null 
    });
    toast.success("バリエーションを追加しました");
  };

  const removeVariation = (id: string) => {
    onChange(variations.filter(v => v.id !== id));
    toast.success("バリエーションを削除しました");
  };

  return (
    <div className="space-y-6">
      {variations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">登録済みバリエーション</h4>
          {variations.map((variation) => (
            <Card key={variation.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {variation.imageUrl && (
                    <img 
                      src={variation.imageUrl} 
                      alt={variation.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-dashed border-2">
        <CardContent className="p-6">
          <h4 className="font-medium mb-4 flex items-center gap-2">
            <Plus size={16} />
            新しいバリエーションを追加
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  バリエーション名 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="例: Lサイズ"
                  value={newVariation.name}
                  onChange={(e) => setNewVariation(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  価格 <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="例: 580"
                  type="number"
                  value={newVariation.price}
                  onChange={(e) => setNewVariation(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">在庫数</label>
                <Input
                  placeholder="例: 50"
                  type="number"
                  value={newVariation.stockCount}
                  onChange={(e) => setNewVariation(prev => ({ ...prev, stockCount: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <ImageIcon size={16} />
                バリエーション画像
              </label>
              
              {newVariation.imagePreview ? (
                <div className="space-y-3">
                  <div className="w-32 h-32 mx-auto border rounded-lg overflow-hidden">
                    <img 
                      src={newVariation.imagePreview} 
                      alt="プレビュー" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewVariation(prev => ({ 
                      ...prev, 
                      imageFile: null, 
                      imagePreview: null 
                    }))}
                    className="w-full"
                  >
                    画像を削除
                  </Button>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Upload size={24} className="text-gray-500 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">画像をアップロード</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF (最大5MB)</p>
                  </div>
                  
                  <label className="absolute inset-0 cursor-pointer">
                    <input 
                      type="file" 
                      className="sr-only" 
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={addVariation}
              disabled={!newVariation.name.trim() || !newVariation.price.trim()}
            >
              <Plus size={16} className="mr-1" />
              バリエーションを追加
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VariationManager;
