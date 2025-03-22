
import React, { useState, useRef } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Product } from "@/types";
import { useProductData } from "@/hooks/useProductData";
import { Download, Upload, RefreshCw, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InventoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const { products, loadProducts } = useProductData("");
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortField) return 0;
    
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      const strA = String(valueA).toLowerCase();
      const strB = String(valueB).toLowerCase();
      return sortDirection === "asc" 
        ? strA.localeCompare(strB) 
        : strB.localeCompare(strA);
    }
  });

  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = ["id", "name", "price", "category", "stockCount", "imageUrl"];
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
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("CSVファイルのエクスポートに失敗しました");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const processCSVFile = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const rows = text.split("\n");
      
      // Parse headers (first row)
      const headers = rows[0].split(",").map(h => h.trim());
      
      // Required fields check
      const requiredFields = ["name", "price", "category"];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        toast.error(`CSVファイルに必須フィールドがありません: ${missingFields.join(", ")}`);
        setIsProcessing(false);
        return;
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
      
      // Reload product list
      loadProducts();
    } catch (error) {
      console.error("CSV processing error:", error);
      toast.error("CSVファイルの処理中にエラーが発生しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast.error("CSVファイルのみアップロード可能です");
        return;
      }
      
      processCSVFile(file);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const updateStockCount = (product: Product, newStockCount: number) => {
    try {
      // Get all products
      const productsJson = localStorage.getItem("products") || "[]";
      let products: Product[] = JSON.parse(productsJson);
      
      // Get sample products
      const sampleProductsJson = localStorage.getItem("sampleProducts");
      let sampleProducts: Product[] = sampleProductsJson ? JSON.parse(sampleProductsJson) : [];
      
      // Find and update the product
      let updated = false;
      
      // Check if product is in regular products
      products = products.map(p => {
        if (p.id === product.id) {
          updated = true;
          return { ...p, stockCount: newStockCount };
        }
        return p;
      });
      
      // If not found in regular products, check sample products
      if (!updated) {
        sampleProducts = sampleProducts.map(p => {
          if (p.id === product.id) {
            updated = true;
            return { ...p, stockCount: newStockCount };
          }
          return p;
        });
      }
      
      // Save changes
      localStorage.setItem("products", JSON.stringify(products));
      if (sampleProductsJson) {
        localStorage.setItem("sampleProducts", JSON.stringify(sampleProducts));
      }
      
      // Reload products
      loadProducts();
      toast.success(`${product.name}の在庫数を${newStockCount}に更新しました`);
    } catch (error) {
      console.error("Failed to update stock count:", error);
      toast.error("在庫数の更新に失敗しました");
    }
  };

  const handleStockUpdate = (product: Product, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newStockCount = parseInt(value);
    
    if (!isNaN(newStockCount) && newStockCount >= 0) {
      updateStockCount(product, newStockCount);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="glass rounded-xl p-6 animate-fade-in mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold mb-4 md:mb-0">在庫管理</h1>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate("/")} 
                className="sm:w-auto"
              >
                POSレジに戻る
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/add-product")} 
                className="sm:w-auto"
              >
                新規商品追加
              </Button>
              <Button 
                onClick={handleExportCSV} 
                className="flex items-center gap-2 sm:w-auto"
              >
                <Download size={18} />
                CSVエクスポート
              </Button>
              <Button 
                onClick={handleUploadClick} 
                variant="secondary" 
                className="flex items-center gap-2 sm:w-auto"
                disabled={isProcessing}
              >
                {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Upload size={18} />}
                CSVインポート
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".csv" 
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("id")} className="cursor-pointer whitespace-nowrap">
                    ID {sortField === "id" && (
                      <ArrowUpDown size={14} className={`inline ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </TableHead>
                  <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                    商品名 {sortField === "name" && (
                      <ArrowUpDown size={14} className={`inline ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </TableHead>
                  <TableHead onClick={() => handleSort("price")} className="cursor-pointer">
                    価格 {sortField === "price" && (
                      <ArrowUpDown size={14} className={`inline ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </TableHead>
                  <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                    カテゴリー {sortField === "category" && (
                      <ArrowUpDown size={14} className={`inline ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </TableHead>
                  <TableHead onClick={() => handleSort("stockCount")} className="cursor-pointer">
                    在庫数 {sortField === "stockCount" && (
                      <ArrowUpDown size={14} className={`inline ml-1 ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                    )}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      商品が見つかりません
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="whitespace-nowrap font-mono text-xs">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>¥{product.price.toLocaleString()}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={product.stockCount ?? 0}
                          onChange={(e) => handleStockUpdate(product, e)}
                          className="w-20"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
