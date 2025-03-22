
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
import { 
  Download, 
  Upload, 
  RefreshCw, 
  ArrowUpDown, 
  FileDown, 
  Settings 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useCSVOperations, CSVField, CSV_FIELDS } from "@/hooks/useCSVOperations";

const InventoryManagement: React.FC = () => {
  const navigate = useNavigate();
  const { products, loadProducts } = useProductData("");
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    isProcessing, 
    exportProductsToCSV, 
    processCSVFile, 
    getCSVTemplate, 
    selectedFields, 
    setSelectedFields, 
    CSV_FIELDS 
  } = useCSVOperations();

  // Dialog states
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setImportDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  // Local states for field selection
  const [exportFields, setExportFields] = useState<CSVField[]>(CSV_FIELDS);
  const [importFields, setImportFields] = useState<CSVField[]>(CSV_FIELDS);
  const [templateFields, setTemplateFields] = useState<CSVField[]>(CSV_FIELDS);

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
    // Filter out unselected fields
    const fieldsToExport = exportFields.filter(field => field.selected !== false);
    exportProductsToCSV(products, fieldsToExport);
    setExportDialogOpen(false);
  };

  const handleUploadClick = () => {
    setImportDialogOpen(true);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast.error("CSVファイルのみアップロード可能です");
        return;
      }
      
      // Import with selected fields
      const fieldsToImport = importFields.filter(field => field.selected !== false);
      processCSVFile(file, fieldsToImport, () => {
        loadProducts();
        setImportDialogOpen(false);
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleGetTemplate = () => {
    // Filter out unselected fields
    const fieldsToExport = templateFields.filter(field => field.selected !== false);
    getCSVTemplate(fieldsToExport);
    setTemplateDialogOpen(false);
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

  // Toggle field selection for export
  const toggleExportField = (field: CSVField) => {
    // Don't allow deselecting required fields
    if (field.required) return;
    
    setExportFields(fields => 
      fields.map(f => 
        f.key === field.key 
          ? { ...f, selected: f.selected === false ? undefined : false } 
          : f
      )
    );
  };

  // Toggle field selection for import
  const toggleImportField = (field: CSVField) => {
    // Don't allow deselecting required fields
    if (field.required) return;
    
    setImportFields(fields => 
      fields.map(f => 
        f.key === field.key 
          ? { ...f, selected: f.selected === false ? undefined : false } 
          : f
      )
    );
  };

  // Toggle field selection for template
  const toggleTemplateField = (field: CSVField) => {
    // Don't allow deselecting required fields
    if (field.required) return;
    
    setTemplateFields(fields => 
      fields.map(f => 
        f.key === field.key 
          ? { ...f, selected: f.selected === false ? undefined : false } 
          : f
      )
    );
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
                onClick={() => setExportDialogOpen(true)} 
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
              <Button
                onClick={() => setTemplateDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-2 sm:w-auto"
              >
                <FileDown size={18} />
                テンプレート
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

      {/* CSV Export Options Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>CSVエクスポート設定</DialogTitle>
            <DialogDescription>
              エクスポートするフィールドを選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {exportFields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox 
                  id={`export-${field.key}`} 
                  checked={field.selected !== false}
                  onCheckedChange={() => toggleExportField(field)}
                  disabled={field.required}
                />
                <label
                  htmlFor={`export-${field.key}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setExportDialogOpen(false)} variant="outline">
              キャンセル
            </Button>
            <Button onClick={handleExportCSV}>
              エクスポート
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Options Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>CSVインポート設定</DialogTitle>
            <DialogDescription>
              インポートに含めるフィールドを選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {importFields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox 
                  id={`import-${field.key}`} 
                  checked={field.selected !== false}
                  onCheckedChange={() => toggleImportField(field)}
                  disabled={field.required}
                />
                <label
                  htmlFor={`import-${field.key}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setImportDialogOpen(false)} variant="outline">
              キャンセル
            </Button>
            <Button onClick={handleFileSelect}>
              CSVファイルを選択
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Download Options Dialog */}
      <Dialog open={isTemplateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>テンプレート設定</DialogTitle>
            <DialogDescription>
              テンプレートに含めるフィールドを選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {templateFields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox 
                  id={`template-${field.key}`} 
                  checked={field.selected !== false}
                  onCheckedChange={() => toggleTemplateField(field)}
                  disabled={field.required}
                />
                <label
                  htmlFor={`template-${field.key}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setTemplateDialogOpen(false)} variant="outline">
              キャンセル
            </Button>
            <Button onClick={handleGetTemplate}>
              テンプレートをダウンロード
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
