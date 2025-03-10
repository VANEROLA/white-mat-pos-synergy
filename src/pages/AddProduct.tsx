
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/components/ProductForm";
import { Product } from "@/types";
import { toast } from "sonner";
import { addLogEntry } from "@/utils/api";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (productData: Omit<Product, "id">) => {
    setIsSubmitting(true);

    // Simulate API call to save product
    setTimeout(() => {
      try {
        // Get existing products from localStorage
        const existingProductsJson = localStorage.getItem("products") || "[]";
        const existingProducts: Product[] = JSON.parse(existingProductsJson);

        // Create a new product with a unique ID
        const newProduct: Product = {
          ...productData,
          id: `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        };

        // Add to existing products
        const updatedProducts = [...existingProducts, newProduct];

        // Save back to localStorage
        localStorage.setItem("products", JSON.stringify(updatedProducts));

        // Log success
        addLogEntry({
          action: "product_create_success",
          details: `Created new product: ${newProduct.name} (ID: ${newProduct.id})`,
        });

        toast.success("商品が正常に追加されました");
        navigate("/");
      } catch (error) {
        console.error("Failed to save product:", error);
        
        // Log error
        addLogEntry({
          action: "product_create_error",
          details: `Failed to create product: ${error}`,
        });
        
        toast.error("商品の追加に失敗しました。もう一度お試しください。");
      } finally {
        setIsSubmitting(false);
      }
    }, 800); // Simulate network delay
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="glass rounded-xl p-6 animate-fade-in">
          <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
