
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, ChartPie, ChartBar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/sales-data/DateRangePicker";
import ProductSalesTable from "@/components/sales-data/ProductSalesTable";
import DailySalesTable from "@/components/sales-data/DailySalesTable";
import FreeItemsTable from "@/components/sales-data/FreeItemsTable";
import HamburgerMenu from "@/components/HamburgerMenu";

const SalesData = ({ toggleMenu, isMenuOpen }: { toggleMenu?: () => void, isMenuOpen?: boolean }) => {
  const [activeTab, setActiveTab] = useState("product");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <HamburgerMenu 
              isOpen={isMenuOpen || false} 
              toggleMenu={toggleMenu || (() => {})} 
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">売上データ</h1>
          <div className="md:hidden">
            <HamburgerMenu 
              isOpen={isMenuOpen || false} 
              toggleMenu={toggleMenu || (() => {})} 
              className="ml-2"
            />
          </div>
          <p className="text-muted-foreground">販売データを分析して店舗のパフォーマンスを把握</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <DateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </div>
      
      <Tabs defaultValue="product" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="product" className="flex items-center gap-2">
              <ChartPie className="h-4 w-4" />
              <span>商品別</span>
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              <span>日別</span>
            </TabsTrigger>
            <TabsTrigger value="free-items" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              <span>無料処理</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="product">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>商品別売上データ</CardTitle>
                <CardDescription>
                  期間内の商品別売上を表示します
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => {
                  const productSalesTable = document.querySelector('div[data-product-sales-table]');
                  if (productSalesTable && typeof (productSalesTable as any).handleExportCSV === 'function') {
                    (productSalesTable as any).handleExportCSV();
                  }
                }}
              >
                <Download className="h-4 w-4" />
                <span>CSV出力</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <ProductSalesTable 
                dateRange={dateRange} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>日別売上データ</CardTitle>
                <CardDescription>
                  期間内の日別売上を表示します
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => {
                  const dailySalesTable = document.querySelector('div[data-daily-sales-table]');
                  if (dailySalesTable && typeof (dailySalesTable as any).handleExportCSV === 'function') {
                    (dailySalesTable as any).handleExportCSV();
                  }
                }}
              >
                <Download className="h-4 w-4" />
                <span>CSV出力</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <DailySalesTable 
                dateRange={dateRange} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="free-items">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>無料処理データ</CardTitle>
                <CardDescription>
                  無料処理された商品と理由の一覧を表示します
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => {
                  const freeItemsTable = document.querySelector('div[data-free-items-table]');
                  if (freeItemsTable && typeof (freeItemsTable as any).handleExportCSV === 'function') {
                    (freeItemsTable as any).handleExportCSV();
                  }
                }}
              >
                <Download className="h-4 w-4" />
                <span>CSV出力</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-2">
              <FreeItemsTable dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesData;
