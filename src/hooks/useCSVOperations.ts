import { useState } from 'react';
import { toast } from 'sonner';
import { Product } from '@/types';

export interface CSVField {
  key: keyof Product;
  label: string;
  required: boolean;
  selected?: boolean;  // Added the selected property as optional
}

export const CSV_FIELDS: CSVField[] = [
  { key: 'id', label: 'ID', required: false },
  { key: 'name', label: '商品名', required: true },
  { key: 'price', label: '価格', required: true },
  { key: 'category', label: 'カテゴリー', required: true },
  { key: 'stockCount', label: '在庫数', required: false },
  { key: 'imageUrl', label: '画像URL', required: false },
];

export const useCSVOperations = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFields, setSelectedFields] = useState<CSVField[]>(CSV_FIELDS);

  const exportProductsToCSV = (products: Product[], fields?: CSVField[]) => {
    try {
      // Use selected fields or default to all fields
      const fieldsToExport = fields || selectedFields;
      
      // Get keys of fields to export
      const headers = fieldsToExport.map(field => field.key);
      
      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...products.map(product => 
          headers.map(header => {
            const value = product[header as keyof Product];
            // Handle values with commas by wrapping in quotes
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : String(value);
          }).join(",")
        )
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `inventory_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSVファイルのエクスポートが完了しました");
      return true;
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("CSVファイルのエクスポートに失敗しました");
      return false;
    }
  };

  const processCSVFile = async (file: File, selectedImportFields?: CSVField[], onComplete?: () => void) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const rows = text.split("\n");
      
      // Parse headers (first row)
      const headers = rows[0].split(",").map(h => h.trim());
      
      // Get all required fields
      const allRequiredFields = CSV_FIELDS.filter(field => field.required).map(field => field.key);
      
      // Check if all required fields are present
      const missingFields = allRequiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        toast.error(`CSVファイルに必須フィールドがありません: ${missingFields.join(", ")}`);
        setIsProcessing(false);
        return false;
      }
      
      // Get existing products to avoid duplicates
      const existingProductsJson = localStorage.getItem("products") || "[]";
      let existingProducts: Product[] = JSON.parse(existingProductsJson);
      const existingIds = new Set(existingProducts.map(p => p.id));
      
      // Parse product data
      const newProducts: Product[] = [];
      let updatedProducts = 0;
      let skippedRows = 0;
      
      // Process each row (skip header)
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Skip empty rows
        
        // Parse CSV row (handling quoted values)
        const values: string[] = [];
        let currentValue = "";
        let insideQuotes = false;
        
        for (let char of rows[i]) {
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue);
            currentValue = "";
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue); // Add the last value
        
        // Create product object by mapping headers to values
        const product: Partial<Product> = {};
        let isValid = true;
        
        headers.forEach((header, index) => {
          if (index < values.length) {
            const value = values[index].trim();
            
            if (header === "id") {
              product.id = value || `PROD-${Date.now()}-${i}`;
            } else if (header === "name") {
              if (!value) {
                isValid = false;
                return;
              }
              product.name = value;
            } else if (header === "price") {
              const price = Number(value);
              if (isNaN(price) || price < 0) {
                isValid = false;
                return;
              }
              product.price = price;
            } else if (header === "category") {
              if (!value) {
                isValid = false;
                return;
              }
              product.category = value;
            } else if (header === "stockCount") {
              const stockCount = Number(value);
              if (!isNaN(stockCount) && stockCount >= 0) {
                product.stockCount = stockCount;
              } else {
                product.stockCount = 0;
              }
            } else if (header === "imageUrl") {
              product.imageUrl = value || "https://placehold.co/200x200?text=商品";
            }
          }
        });
        
        // Ensure all required fields are present
        if (!isValid || !product.name || !product.price || !product.category) {
          skippedRows++;
          continue;
        }
        
        // Add required fields if missing
        if (!product.id) {
          product.id = `PROD-${Date.now()}-${i}`;
        }
        if (!product.imageUrl) {
          product.imageUrl = "https://placehold.co/200x200?text=商品";
        }
        if (product.stockCount === undefined) {
          product.stockCount = 0;
        }
        
        // Update existing product or add new one
        if (product.id && existingIds.has(product.id)) {
          // Update existing product
          existingProducts = existingProducts.map(p => 
            p.id === product.id ? { ...p, ...product as Product } : p
          );
          updatedProducts++;
        } else {
          // Add new product
          newProducts.push(product as Product);
        }
      }
      
      // Save changes to localStorage
      const updatedProductsList = [...existingProducts, ...newProducts];
      localStorage.setItem("products", JSON.stringify(updatedProductsList));
      
      // Show success message
      toast.success(
        `CSVインポート完了: ${newProducts.length}件の商品を追加、${updatedProducts}件更新、${skippedRows}件スキップしました`
      );
      
      if (onComplete) {
        onComplete();
      }
      
      return true;
    } catch (error) {
      console.error("CSV processing error:", error);
      toast.error("CSVファイルの処理中にエラーが発生しました");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const getCSVTemplate = (fields?: CSVField[]) => {
    try {
      // Use selected fields or default to all fields
      const fieldsToExport = fields || selectedFields;
      
      // Get keys and create headers
      const headers = fieldsToExport.map(field => field.key);
      
      // Create example row
      const exampleValues: Record<keyof Product, string> = {
        id: "PROD-EXAMPLE-001",
        name: "サンプル商品",
        price: "500",
        category: "コーヒー",
        stockCount: "100",
        imageUrl: "https://placehold.co/200x200?text=サンプル"
      };
      
      const exampleRow = headers.map(header => exampleValues[header as keyof Product]);
      
      const csvContent = [
        headers.join(","),
        exampleRow.join(",")
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `inventory_template.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("テンプレートをダウンロードしました");
      return true;
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("テンプレートのダウンロードに失敗しました");
      return false;
    }
  };

  return {
    isProcessing,
    exportProductsToCSV,
    processCSVFile,
    getCSVTemplate,
    selectedFields,
    setSelectedFields,
    CSV_FIELDS
  };
};
