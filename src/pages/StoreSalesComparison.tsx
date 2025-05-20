
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, Download, BarChart3, Building, LayoutGrid, Columns3, Rows3, List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/sales-data/DateRangePicker";
import { 
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import HamburgerMenu from "@/components/HamburgerMenu";
import { useCSVOperations } from "@/hooks/useCSVOperations";
import SidebarMenu from "@/components/SidebarMenu";
import { toast } from "sonner";

interface StoreSalesComparisonProps {
  toggleMenu?: () => void;
  isMenuOpen?: boolean;
}

// View sizes for the tables
type ViewSize = "compact" | "default" | "expanded";
type ViewMode = "table" | "card" | "grid";

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
  const { exportProductsToCSV } = useCSVOperations();

  // Mock store data
  const storeData = [
    { id: 1, name: "新宿店", totalSales: 1250000, transactions: 2145, averagePerTransaction: 582.7 },
    { id: 2, name: "渋谷店", totalSales: 980000, transactions: 1876, averagePerTransaction: 522.4 },
    { id: 3, name: "池袋店", totalSales: 870000, transactions: 1562, averagePerTransaction: 557.0 },
    { id: 4, name: "上野店", totalSales: 650000, transactions: 1123, averagePerTransaction: 578.8 },
    { id: 5, name: "横浜店", totalSales: 1120000, transactions: 1987, averagePerTransaction: 563.7 }
  ];

  // Expanded mock product comparison data
  const productComparisonData = [
    { 
      productName: "コーヒー (大)",
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
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 75, revenue: 45000 },
        { storeId: 2, storeName: "渋谷店", quantity: 60, revenue: 36000 },
        { storeId: 3, storeName: "池袋店", quantity: 50, revenue: 30000 },
        { storeId: 4, storeName: "上野店", quantity: 40, revenue: 24000 },
        { storeId: 5, storeName: "横浜店", quantity: 70, revenue: 42000 }
      ] 
    }
  ];

  // Paginate product data
  const paginatedProductData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return productComparisonData.slice(startIndex, endIndex);
  }, [productComparisonData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(productComparisonData.length / itemsPerPage);

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
      // Flattened product comparison data
      exportData = [];
      productComparisonData.forEach(product => {
        product.stores.forEach(store => {
          exportData.push({
            name: `${product.productName} (${store.storeName})`,
            price: store.revenue,
            category: "商品別売上",
            stockCount: store.quantity
          });
        });
      });
    }

    exportProductsToCSV(exportData);
    toast.success("CSVファイルのエクスポートが完了しました");
  };

  // Get table classes based on view size
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
  
  // Navigate to different pages
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Render pagination controls
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

  // Render table view
  const renderTableView = (product: typeof productComparisonData[0]) => {
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

  // Render card view
  const renderCardView = (product: typeof productComparisonData[0]) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {product.stores.map((store) => (
          <Card key={store.storeId} className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className={viewSize === "compact" ? "text-sm" : viewSize === "expanded" ? "text-xl" : "text-base"}>
                {store.storeName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className={`grid grid-cols-2 gap-2 ${viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-base" : "text-sm"}`}>
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

  // Render grid view
  const renderGridView = (product: typeof productComparisonData[0]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {product.stores.map((store) => (
          <div key={store.storeId} className="flex justify-between border p-3 rounded-md">
            <div className={`font-medium ${viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-lg" : "text-sm"}`}>
              {store.storeName}
            </div>
            <div className="flex gap-4">
              <div className={viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-lg" : "text-sm"}>
                {store.quantity}個
              </div>
              <div className={`font-semibold ${viewSize === "compact" ? "text-xs" : viewSize === "expanded" ? "text-lg" : "text-sm"}`}>
                {formatCurrency(store.revenue)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={() => {
          if (toggleMenu) toggleMenu();
        }}
      />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HamburgerMenu 
            isOpen={isMenuOpen || false} 
            toggleMenu={toggleMenu || (() => {})} 
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">店舗間売上データ</h1>
            <p className="text-muted-foreground">店舗間の売上の比較と分析</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </div>
      
      <Tabs defaultValue="by-store" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="by-store" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>店舗別</span>
            </TabsTrigger>
            <TabsTrigger value="by-product" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>商品別</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground mr-1">表示モード:</span>
            <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && setViewMode(val as ViewMode)}>
              <ToggleGroupItem value="table" aria-label="テーブル表示" title="テーブル表示">
                <Table className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="カード表示" title="カード表示">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="グリッド表示" title="グリッド表示">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <span className="text-sm text-muted-foreground ml-2 mr-1">サイズ:</span>
            <div className="flex bg-muted rounded-md p-1">
              <Button
                variant={viewSize === "compact" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewSize("compact")}
                title="コンパクト表示"
              >
                <Columns3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewSize === "default" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewSize("default")}
                title="標準表示"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewSize === "expanded" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>店舗別売上比較</CardTitle>
                <CardDescription>
                  店舗ごとの売上とトランザクション数の比較
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4" />
                <span>CSVエクスポート</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>商品別店舗比較</CardTitle>
                <CardDescription>
                  商品ごとの店舗間販売実績の比較
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <select 
                    className="text-sm border rounded px-2 py-1"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={3}>3件</option>
                    <option value={5}>5件</option>
                    <option value={10}>10件</option>
                    <option value={productComparisonData.length}>全て</option>
                  </select>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleExportCSV}
                >
                  <Download className="h-4 w-4" />
                  <span>CSVエクスポート</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {paginatedProductData.map((product, index) => (
                <div key={index} className="mb-8">
                  <h3 className={`font-medium mb-2 ${viewSize === "compact" ? "text-sm" : viewSize === "expanded" ? "text-xl" : "text-lg"}`}>
                    {product.productName}
                  </h3>
                  
                  {viewMode === "table" && renderTableView(product)}
                  {viewMode === "card" && renderCardView(product)}
                  {viewMode === "grid" && renderGridView(product)}
                </div>
              ))}
              
              {renderPagination()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreSalesComparison;
