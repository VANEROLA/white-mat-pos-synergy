import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, Download, BarChart3, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import HamburgerMenu from "@/components/HamburgerMenu";
import { useCSVOperations } from "@/hooks/useCSVOperations";

interface StoreSalesComparisonProps {
  toggleMenu?: () => void;
  isMenuOpen?: boolean;
}

const StoreSalesComparison: React.FC<StoreSalesComparisonProps> = ({ toggleMenu, isMenuOpen }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [activeTab, setActiveTab] = useState("by-store");
  const [isLoading, setIsLoading] = useState(false);
  const { exportProductsToCSV } = useCSVOperations();

  // Mock store data
  const storeData = [
    { id: 1, name: "新宿店", totalSales: 1250000, transactions: 2145, averagePerTransaction: 582.7 },
    { id: 2, name: "渋谷店", totalSales: 980000, transactions: 1876, averagePerTransaction: 522.4 },
    { id: 3, name: "池袋店", totalSales: 870000, transactions: 1562, averagePerTransaction: 557.0 },
    { id: 4, name: "上野店", totalSales: 650000, transactions: 1123, averagePerTransaction: 578.8 },
    { id: 5, name: "横浜店", totalSales: 1120000, transactions: 1987, averagePerTransaction: 563.7 }
  ];

  // Mock product comparison data
  const productComparisonData = [
    { 
      productName: "コーヒー (大)",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 320, revenue: 160000 },
        { storeId: 2, storeName: "渋谷店", quantity: 280, revenue: 140000 },
        { storeId: 3, storeName: "池袋店", quantity: 260, revenue: 130000 }
      ] 
    },
    { 
      productName: "カプチーノ",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 180, revenue: 108000 },
        { storeId: 2, storeName: "渋谷店", quantity: 150, revenue: 90000 },
        { storeId: 3, storeName: "池袋店", quantity: 165, revenue: 99000 }
      ] 
    },
    { 
      productName: "チョコレートクッキー",
      stores: [
        { storeId: 1, storeName: "新宿店", quantity: 95, revenue: 28500 },
        { storeId: 2, storeName: "渋谷店", quantity: 110, revenue: 33000 },
        { storeId: 3, storeName: "池袋店", quantity: 85, revenue: 25500 }
      ] 
    }
  ];

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
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HamburgerMenu 
            isOpen={isMenuOpen || false} 
            toggleMenu={toggleMenu || (() => {})} 
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">店舗間売上データ共有</h1>
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
                <span>CSV出力</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="rounded-md border overflow-auto">
                <UITable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>店舗名</TableHead>
                      <TableHead>総売上</TableHead>
                      <TableHead>取引数</TableHead>
                      <TableHead>取引平均</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeData.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell>{formatCurrency(store.totalSales)}</TableCell>
                        <TableCell>{store.transactions}件</TableCell>
                        <TableCell>{formatCurrency(store.averagePerTransaction)}</TableCell>
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4" />
                <span>CSV出力</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              {productComparisonData.map((product, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-lg font-medium mb-2">{product.productName}</h3>
                  <div className="rounded-md border overflow-auto">
                    <UITable>
                      <TableHeader>
                        <TableRow>
                          <TableHead>店舗</TableHead>
                          <TableHead>数量</TableHead>
                          <TableHead>売上</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {product.stores.map((store) => (
                          <TableRow key={store.storeId}>
                            <TableCell>{store.storeName}</TableCell>
                            <TableCell>{store.quantity}個</TableCell>
                            <TableCell>{formatCurrency(store.revenue)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </UITable>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreSalesComparison;
