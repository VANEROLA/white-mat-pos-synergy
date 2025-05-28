import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Product, ProductVariation } from "@/types";
import { addLogEntry } from "@/utils/api";
import { Package, Tag } from "lucide-react";
import FormField from "./product/FormField";
import ImageUploader from "./product/ImageUploader";
import CategorySelect from "./product/CategorySelect";
import FormActions from "./product/FormActions";
import ProductFormHeader from "./product/ProductFormHeader";
import VariationManager from "./product/VariationManager";
import { Category } from "./CategoryManagement";

interface ProductFormProps {
  onSubmit: (product: Omit<Product, "id">) => void;
  isSubmitting?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stockCount: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  const loadCategories = () => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  };

  useEffect(() => {
    loadCategories();
    
    window.addEventListener('categoryChange', loadCategories);
    
    return () => {
      window.removeEventListener('categoryChange', loadCategories);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setImagePreview(loadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    if (errors.imageUrl) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.imageUrl;
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

    if (!imagePreview && !selectedFile) {
      newErrors.imageUrl = "商品画像を選択してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("入力内容にエラーがあります");
      return;
    }

    const imageUrlToUse = imagePreview || "https://placehold.co/200x200?text=商品";

    const productData: Omit<Product, "id"> = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      imageUrl: imageUrlToUse,
      stockCount: formData.stockCount ? Number(formData.stockCount) : 0,
      variations: variations.length > 0 ? variations : undefined,
    };

    onSubmit(productData);

    addLogEntry({
      action: "product_create_attempt",
      details: `Attempted to create product: ${formData.name}${variations.length > 0 ? ` with ${variations.length} variations` : ''}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <ProductFormHeader />

      <div className="space-y-4">
        <FormField
          label="商品名"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="例: カフェラテ"
          icon={Package}
          error={errors.name}
          required
        />

        <FormField
          label="価格 (円)"
          name="price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          min="1"
          placeholder="例: 480"
          icon={Tag}
          error={errors.price}
          required
        />

        <CategorySelect
          categories={categories}
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
        />

        <ImageUploader
          imagePreview={imagePreview}
          onFileChange={handleFileChange}
          error={errors.imageUrl}
        />

        <FormField
          label="在庫数"
          name="stockCount"
          value={formData.stockCount}
          onChange={handleChange}
          type="number"
          min="0"
          placeholder="例: 100"
          icon={Package}
          error={errors.stockCount}
          required
        />

        <VariationManager
          variations={variations}
          onChange={setVariations}
        />
      </div>

      <FormActions isSubmitting={isSubmitting} />
    </form>
  );
};

export default ProductForm;
