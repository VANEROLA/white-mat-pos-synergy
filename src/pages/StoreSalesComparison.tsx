import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, Download, BarChart3, Building, LayoutGrid, Columns3, Rows3, List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/sales-data/DateRangePicker";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import HamburgerMenu from "@/components/HamburgerMenu";
import { useCSVOperations } from "@/hooks/useCSVOperations";
import SidebarMenu from "@/components/SidebarMenu";
import { toast } from "sonner";
import StoreSearchPanel from "@/components/StoreSearchPanel";

interface StoreSalesComparisonProps {
  toggleMenu?: () => void;
  isMenuOpen?: boolean;
}

type ViewSize = "compact" | "default" | "expanded";
type ViewMode = "table" | "card" | "grid";
type SortOrder = "asc" | "desc";
type SortField = "name" | "quantity" | "revenue" | null;

interface Store {
  id: number;
  name: string;
  totalSales: number;
  transactions: number;
  averagePerTransaction: number;
}

interface ProductStore {
  storeId: number;
  storeName: string;
  quantity: number;
  revenue: number;
}

interface Product {
  productName: string;
  productCategory: string;
  stores: ProductStore[];
}

const StoreSalesComparison: React.FC<StoreSalesComparisonProps> = ({ toggleMenu, isMenuOpen }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("by-store");
  const [isLoading, setIsLoading] = useState(false);
  const [viewSize, setViewSize] = useState<ViewSize>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const { exportProductsToCSV } = useCSVOperations();

  const storeData: Store[] = [
    { id: 1, name: "新宿店", totalSales: 1250000, transactions: 2145, averagePerTransaction: 582.7 },
    { id: 2, name: "渋谷店", totalSales: 980000, transactions: 1876, averagePerTransaction: 522.4 },
    { id: 3, name: "池袋店", totalSales: 870000, transactions: 1562, averagePerTransaction: 557.0 },
    { id: 4, name: "上野店", totalSales: 650000, transactions: 1123, averagePerTransaction: 578.8 },
    { id: 5, name: "横浜店", totalSales: 1120000, transactions: 1987, averagePerTransaction: 563.7 }
  ];

  const productComparisonData: Product[] = [
    { 
      productName: "コーヒー (大)",
      productCategory: "コーヒー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 320, revenue: 160000 },
        { storeId: 2, storeName: "渋谷店", quantity: 280, revenue: 140000 },
        { storeId: 3, storeName: "池袋店", quantity: 260, revenue: 130000 },
        { storeId: 4, storeName: "上野店", quantity: 210, revenue: 105000 },
        { storeId: 5, storeName: "横浜店", quantity: 290, revenue: 145000 }
      ] 
    },
    { 
      productName: "カプチーノ",
      productCategory: "コーヒー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 180, revenue: 108000 },
        { storeId: 2, storeName: "渋谷店", quantity: 150, revenue: 90000 },
        { storeId: 3, storeName: "池袋店", quantity: 165, revenue: 99000 },
        { storeId: 4, storeName: "上野店", quantity: 120, revenue: 72000 },
        { storeId: 5, storeName: "横浜店", quantity: 170, revenue: 102000 }
      ] 
    },
    { 
      productName: "チョコレートクッキー",
      productCategory: "ベーカリー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 95, revenue: 28500 },
        { storeId: 2, storeName: "渋谷店", quantity: 110, revenue: 33000 },
        { storeId: 3, storeName: "池袋店", quantity: 85, revenue: 25500 },
        { storeId: 4, storeName: "上野店", quantity: 75, revenue: 22500 },
        { storeId: 5, storeName: "横浜店", quantity: 105, revenue: 31500 }
      ] 
    },
    { 
      productName: "抹茶ラテ",
      productCategory: "ティー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 150, revenue: 75000 },
        { storeId: 2, storeName: "渋谷店", quantity: 180, revenue: 90000 },
        { storeId: 3, storeName: "池袋店", quantity: 130, revenue: 65000 },
        { storeId: 4, storeName: "上野店", quantity: 90, revenue: 45000 },
        { storeId: 5, storeName: "横浜店", quantity: 160, revenue: 80000 }
      ] 
    },
    { 
      productName: "アメリカーノ",
      productCategory: "コーヒー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 200, revenue: 80000 },
        { storeId: 2, storeName: "渋谷店", quantity: 170, revenue: 68000 },
        { storeId: 3, storeName: "池袋店", quantity: 150, revenue: 60000 },
        { storeId: 4, storeName: "上野店", quantity: 130, revenue: 52000 },
        { storeId: 5, storeName: "横浜店", quantity: 190, revenue: 76000 }
      ] 
    },
    { 
      productName: "チーズケーキ",
      productCategory: "ケーキ",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 120, revenue: 72000 },
        { storeId: 2, storeName: "渋谷店", quantity: 90, revenue: 54000 },
        { storeId: 3, storeName: "池袋店", quantity: 85, revenue: 51000 },
        { storeId: 4, storeName: "上野店", quantity: 60, revenue: 36000 },
        { storeId: 5, storeName: "横浜店", quantity: 100, revenue: 60000 }
      ] 
    },
    { 
      productName: "ティラミス",
      productCategory: "ケーキ",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 75, revenue: 45000 },
        { storeId: 2, storeName: "渋谷店", quantity: 60, revenue: 36000 },
        { storeId: 3, storeName: "池袋店", quantity: 50, revenue: 30000 },
        { storeId: 4, storeName: "上野店", quantity: 40, revenue: 24000 },
        { storeId: 5, storeName: "横浜店", quantity: 70, revenue: 42000 }
      ] 
    },
    { 
      productName: "カフェモカ",
      productCategory: "コーヒー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 140, revenue: 84000 },
        { storeId: 2, storeName: "渋谷店", quantity: 120, revenue: 72000 },
        { storeId: 3, storeName: "池袋店", quantity: 115, revenue: 69000 },
        { storeId: 4, storeName: "上野店", quantity: 90, revenue: 54000 },
        { storeId: 5, storeName: "横浜店", quantity: 135, revenue: 81000 }
      ] 
    },
    { 
      productName: "ショコラケーキ",
      productCategory: "ケーキ",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 85, revenue: 59500 },
        { storeId: 2, storeName: "渋谷店", quantity: 70, revenue: 49000 },
        { storeId: 3, storeName: "池袋店", quantity: 65, revenue: 45500 },
        { storeId: 4, storeName: "上野店", quantity: 45, revenue: 31500 },
        { storeId: 5, storeName: "横浜店", quantity: 80, revenue: 56000 }
      ] 
    },
    { 
      productName: "フレーバーティー",
      productCategory: "ティー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 110, revenue: 49500 },
        { storeId: 2, storeName: "渋谷店", quantity: 140, revenue: 63000 },
        { storeId: 3, storeName: "池袋店", quantity: 90, revenue: 40500 },
        { storeId: 4, storeName: "上野店", quantity: 70, revenue: 31500 },
        { storeId: 5, storeName: "横浜店", quantity: 120, revenue: 54000 }
      ] 
    },
    { 
      productName: "抹茶ケーキ",
      productCategory: "ケーキ",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 65, revenue: 42250 },
        { storeId: 2, storeName: "渋谷店", quantity: 80, revenue: 52000 },
        { storeId: 3, storeName: "池袋店", quantity: 55, revenue: 35750 },
        { storeId: 4, storeName: "上野店", quantity: 40, revenue: 26000 },
        { storeId: 5, storeName: "横浜店", quantity: 75, revenue: 48750 }
      ] 
    },
    { 
      productName: "クロワッサン",
      productCategory: "ベーカリー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 160, revenue: 48000 },
        { storeId: 2, storeName: "渋谷店", quantity: 130, revenue: 39000 },
        { storeId: 3, storeName: "池袋店", quantity: 120, revenue: 36000 },
        { storeId: 4, storeName: "上野店", quantity: 95, revenue: 28500 },
        { storeId: 5, storeName: "横浜店", quantity: 145, revenue: 43500 }
      ] 
    },
    { 
      productName: "アイスコーヒー",
      productCategory: "コーヒー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 230, revenue: 103500 },
        { storeId: 2, storeName: "渋谷店", quantity: 200, revenue: 90000 },
        { storeId: 3, storeName: "池袋店", quantity: 180, revenue: 81000 },
        { storeId: 4, storeName: "上野店", quantity: 150, revenue: 67500 },
        { storeId: 5, storeName: "横浜店", quantity: 220, revenue: 99000 }
      ] 
    },
    { 
      productName: "フルーツタルト",
      productCategory: "ケーキ",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 55, revenue: 38500 },
        { storeId: 2, storeName: "渋谷店", quantity: 45, revenue: 31500 },
        { storeId: 3, storeName: "池袋店", quantity: 40, revenue: 28000 },
        { storeId: 4, storeName: "上野店", quantity: 30, revenue: 21000 },
        { storeId: 5, storeName: "横浜店", quantity: 50, revenue: 35000 }
      ] 
    },
    { 
      productName: "パン・オ・ショコラ",
      productCategory: "ベーカリー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 80, revenue: 28000 },
        { storeId: 2, storeName: "渋谷店", quantity: 65, revenue: 22750 },
        { storeId: 3, storeName: "池袋店", quantity: 60, revenue: 21000 },
        { storeId: 4, storeName: "上野店", quantity: 45, revenue: 15750 },
        { storeId: 5, storeName: "横浜店", quantity: 75, revenue: 26250 }
      ] 
    },
  ];

  const highestRevenueProduct = useMemo(() => {
    if (productComparisonData.length === 0) return null;
    
    return productComparisonData
      .map(product => {
        const totalRevenue = product.stores.reduce((sum, store) => sum + store.revenue, 0);
        return {
          productName: product.productName,
          productCategory: product.productCategory,
          totalRevenue,
          highestStore: product.stores.reduce((max, store) => 
            max.revenue > store.revenue ? max : store
          )
        };
      })
      .reduce((max, current) => 
        max.totalRevenue > current.totalRevenue ? max : current
      );
  }, [productComparisonData]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>();
    productComparisonData.forEach(product => {
      categories.add(product.productCategory);
    });
    return Array.from(categories);
  }, [productComparisonData]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...productComparisonData];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.productName.toLowerCase().includes(query) || 
        product.productCategory.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(product => product.productCategory === selectedCategory);
    }

    if (selectedStore && selectedStore !== "all") {
      result = result.filter(product => 
        product.stores.some(store => store.storeName === selectedStore)
      );
    }
    
    if (sortField) {
      result = [...result].sort((a, b) => {
        if (sortField === "name") {
          return sortOrder === "asc" 
            ? a.productName.localeCompare(b.productName) 
            : b.productName.localeCompare(a.productName);
        }
        
        const aValue = a.stores.reduce((sum, store) => sum + store[sortField === "quantity" ? "quantity" : "revenue"], 0);
        const bValue = b.stores.reduce((sum, store) => sum + store[sortField === "quantity" ? "quantity" : "revenue"], 0);
        
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      });
    }
    
    return result;
  }, [productComparisonData, searchQuery, selectedCategory, selectedStore, sortField, sortOrder]);

  const paginatedProductData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const handleExportCSV = () => {
    let exportData;

    if (activeTab === "by-store") {
      exportData = storeData.map(store => ({
        name: store.name,
        price: store.totalSales,
        category: "店舗別売上",
        stockCount: store.transactions
      }));
    } else {
      exportData = [];
      filteredAndSortedProducts.forEach(product => {
        product.stores.forEach(store => {
          exportData.push({
            name: `${product.productName} (${store.storeName})`,
            price: store.revenue,
            category: product.productCategory,
            stockCount: store.quantity
          });
        });
      });
    }

    exportProductsToCSV(exportData);
    toast.success("CSVファイルのエクスポートが完了しました");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStore("all");
    setSortField(null);
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getTableClasses = () => {
    switch (viewSize) {
      case "compact":
        return {
          table: "text-xs",
          header: "h-8 px-2",
          cell: "p-2"
        };
      case "expanded":
        return {
          table: "text-base",
          header: "h-14 px-6",
          cell: "p-6"
        };
      default:
        return {
          table: "text-sm",
          header: "h-12 px-4",
          cell: "p-4"
        };
    }
  };

  const tableClasses = getTableClasses();
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className="cursor-pointer"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && setCurrentPage(prev => prev + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderTableView = (product: Product) => {
    return (
      <div className="rounded-md border overflow-auto">
        <UITable className={tableClasses.table}>
          <TableHeader>
            <TableRow>
              <TableHead className={tableClasses.header}>店舗</TableHead>
              <TableHead className={tableClasses.header}>数量</TableHead>
              <TableHead className={tableClasses.header}>売上</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.stores.map((store) => (
              <TableRow key={store.storeId}>
                <TableCell className={tableClasses.cell}>{store.storeName}</TableCell>
                <TableCell className={tableClasses.cell}>{store.quantity}個</TableCell>
                <TableCell className={tableClasses.cell}>{formatCurrency(store.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </UITable>
      </div>
    );
  };

  const renderCardView = (product: Product) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {product.stores.map((store) => (
          <Card key={store.storeId} className="h-full">
            <CardHeader className="pb-1 pt-2 px-3">
              <CardTitle className={viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-lg" : "text-sm"}>
                {store.storeName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 px-3">
              <div className={`grid grid-cols-2 gap-1 ${viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-base" : "text-xs"}`}>
                <div>数量:</div>
                <div className="font-semibold text-right">{store.quantity}個</div>
                <div>売上:</div>
                <div className="font-semibold text-right">{formatCurrency(store.revenue)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderGridView = (product: Product) => {
    return (
      <div className="grid grid-cols-2 gap-1">
        {product.stores.map((store) => (
          <div key={store.storeId} className="flex justify-between border p-1 rounded-md">
            <div className={`font-medium ${viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-base" : "text-xs"}`}>
              {store.storeName}
            </div>
            <div className="flex gap-2">
              <div className={viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-base" : "text-xs"}>
                {store.quantity}個
              </div>
              <div className={`font-semibold ${viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-base" : "text-xs"}`}>
                {formatCurrency(store.revenue)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getFilterSummary = () => {
    const filters = [];
    if (searchQuery) filters.push(`検索: ${searchQuery}`);
    if (selectedCategory !== "all") filters.push(`カテゴリ: ${selectedCategory}`);
    if (selectedStore !== "all") filters.push(`店舗: ${selectedStore}`);
    
    if (filters.length === 0) return null;
    
    return (
      <div className="text-sm text-muted-foreground mt-1 mb-3">
        適用フィルター: {filters.join(" / ")} {" "}
        <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-6 px-2 text-xs">
          リセット
        </Button>
      </div>
    );
  };

  const renderProductCount = () => {
    return (
      <div className="text-sm text-muted-foreground mb-2">
        全 {filteredAndSortedProducts.length} 件中 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} 件表示
      </div>
    );
  };

  return (
    <div className="container mx-auto py-4 px-3 md:px-4">
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => {
          if (toggleMenu) toggleMenu();
        }}
      />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HamburgerMenu 
            isOpen={isMenuOpen || false} 
            toggleMenu={toggleMenu || (() => {})} 
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-0">店舗間売上データ</h1>
            <p className="text-sm text-muted-foreground">店舗間の売上の比較と分析</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </div>
      
      {highestRevenueProduct && (
        <Card className="mb-4 bg-muted/20 border-primary/20">
          <CardHeader className="pb-2 pt-3">
            <CardTitle className="text-base flex justify-between items-center">
              <span>最高売上商品</span>
              <span className="text-primary font-bold">{formatCurrency(highestRevenueProduct.totalRevenue)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm font-medium">{highestRevenueProduct.productName}</span>
                  <span className="text-xs text-muted-foreground ml-2">({highestRevenueProduct.productCategory})</span>
                </div>
              </div>
              <div className="flex gap-4 mt-1 md:mt-0 md:ml-auto">
                <div className="text-xs">
                  <span className="text-muted-foreground">最高売上店舗:</span>
                  <span className="font-semibold ml-1">{highestRevenueProduct.highestStore.storeName}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">店舗売上:</span>
                  <span className="font-semibold ml-1">{formatCurrency(highestRevenueProduct.highestStore.revenue)}</span>
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">数量:</span>
                  <span className="font-semibold ml-1">{highestRevenueProduct.highestStore.quantity}個</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="by-store" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3">
          <TabsList className="mb-3 md:mb-0">
            <TabsTrigger value="by-store" className="flex items-center gap-1 text-xs">
              <Building className="h-3 w-3" />
              <span>店舗別</span>
            </TabsTrigger>
            <TabsTrigger value="by-product" className="flex items-center gap-1 text-xs">
              <BarChart3 className="h-3 w-3" />
              <span>商品別</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-muted-foreground">表示:</span>
            <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && setViewMode(val as ViewMode)} size="sm">
              <ToggleGroupItem value="table" aria-label="テーブル表示" title="テーブル表示" className="h-8 w-8">
                <Table className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="カード表示" title="カード表示" className="h-8 w-8">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="グリッド表示" title="グリッド表示" className="h-8 w-8">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <div className="flex bg-muted rounded-md p-0.5 ml-1">
              <Button
                variant={viewSize === "compact" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewSize("compact")}
                title="コンパクト表示"
              >
                <Columns3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewSize === "default" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewSize("default")}
                title="標準表示"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewSize === "expanded" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewSize("expanded")}
                title="拡大表示"
              >
                <Rows3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="by-store">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
              <div>
                <CardTitle className="text-lg">店舗別売上比較</CardTitle>
                <CardDescription className="text-xs">
                  店舗ごとの売上とトランザクション数の比較
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 h-8"
                onClick={handleExportCSV}
              >
                <Download className="h-3 w-3" />
                <span className="text-xs">CSV</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <div className="rounded-md border overflow-auto">
                <UITable className={tableClasses.table}>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={tableClasses.header}>店舗名</TableHead>
                      <TableHead className={tableClasses.header}>総売上</TableHead>
                      <TableHead className={tableClasses.header}>取引数</TableHead>
                      <TableHead className={tableClasses.header}>取引平均</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeData.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className={`font-medium ${tableClasses.cell}`}>{store.name}</TableCell>
                        <TableCell className={tableClasses.cell}>{formatCurrency(store.totalSales)}</TableCell>
                        <TableCell className={tableClasses.cell}>{store.transactions}件</TableCell>
                        <TableCell className={tableClasses.cell}>{formatCurrency(store.averagePerTransaction)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </UITable>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="by-product">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
              <div>
                <CardTitle className="text-lg">商品別店舗比較</CardTitle>
                <CardDescription className="text-xs">
                  商品ごとの店舗間販売実績の比較
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  className="text-xs border rounded px-2 py-1 h-8"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={3}>3件</option>
                  <option value={5}>5件</option>
                  <option value={10}>10件</option>
                  <option value={filteredAndSortedProducts.length}>全て</option>
                </select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 h-8"
                  onClick={handleExportCSV}
                >
                  <Download className="h-3 w-3" />
                  <span className="text-xs">CSV</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <StoreSearchPanel
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                sortField={sortField}
                sortOrder={sortOrder}
                handleSort={handleSort}
                handleResetFilters={handleResetFilters}
                categories={uniqueCategories}
                stores={storeData}
              />
            
              {renderProductCount()}
            
              {paginatedProductData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  {paginatedProductData.map((product, index) => (
                    <div key={index} className="pb-4 border-b last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-medium ${viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-lg" : "text-sm"}`}>
                          {product.productName}
                          <span className="text-muted-foreground ml-2 text-xs">
                            ({product.productCategory})
                          </span>
                        </h3>
                      </div>
                      
                      {viewMode === "table" && renderTableView(product)}
                      {viewMode === "card" && renderCardView(product)}
                      {viewMode === "grid" && renderGridView(product)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  検索条件に一致する商品がありません。
                </div>
              )}
              
              {renderPagination()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreSalesComparison;
