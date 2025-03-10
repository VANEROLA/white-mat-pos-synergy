
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Product } from "@/types";
import { addLogEntry } from "@/utils/api";
import { Package, Image, Tag, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => void;
  isSubmitting?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
    stockCount: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "商品名は必須です";
    }

    if (!formData.price.trim()) {
      newErrors.price = "価格は必須です";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "価格は正の数値を入力してください";
    }

    if (!formData.category.trim()) {
      newErrors.category = "カテゴリーは必須です";
    }

    if (formData.stockCount && (isNaN(Number(formData.stockCount)) || Number(formData.stockCount) < 0)) {
      newErrors.stockCount = "在庫数は0以上の数値を入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("入力内容にエラーがあります");
      return;
    }

    const productData: Omit<Product, "id"> = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl || "https://placehold.co/200x200?text=商品",
      ...(formData.stockCount ? { stockCount: Number(formData.stockCount) } : {}),
    };

    onSubmit(productData);

    // Log the action
    addLogEntry({
      action: "product_create_attempt",
      details: `Attempted to create product: ${formData.name}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-semibold">新しい商品を追加</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Package size={16} className="mr-1.5" />
            商品名 <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="例: カフェラテ"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Tag size={16} className="mr-1.5" />
            価格 (円) <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            name="price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            min="1"
            placeholder="例: 480"
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Tag size={16} className="mr-1.5" />
            カテゴリー <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="例: コーヒー"
            className={errors.category ? "border-red-500" : ""}
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Image size={16} className="mr-1.5" />
            画像URL
          </label>
          <Input
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://例.com/画像.jpg"
          />
          <p className="text-xs text-muted-foreground mt-1">※空白の場合はデフォルト画像が使用されます</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 flex items-center">
            <Package size={16} className="mr-1.5" />
            在庫数
          </label>
          <Input
            name="stockCount"
            value={formData.stockCount}
            onChange={handleChange}
            type="number"
            min="0"
            placeholder="例: 100"
            className={errors.stockCount ? "border-red-500" : ""}
          />
          {errors.stockCount && <p className="text-red-500 text-sm mt-1">{errors.stockCount}</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="button" variant="outline" onClick={() => navigate("/")} className="mr-2">
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : (
            <>
              <Check size={16} className="mr-1" />
              商品を保存
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
