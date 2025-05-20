
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, ChartPie, Table } from "lucide-react";
import { 
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/sales-data/DateRangePicker";
import ProductSalesChart from "@/components/sales-data/ProductSalesChart";
import DailySalesChart from "@/components/sales-data/DailySalesChart";
import FreeItemsTable from "@/components/sales-data/FreeItemsTable";

const SalesData = () => {
  const [activeTab, setActiveTab] = useState("product");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [viewType, setViewType] = useState("chart");

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">売上データ</h1>
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
          
          {activeTab !== "free-items" && (
            <Select value={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="表示形式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chart">グラフ</SelectItem>
                <SelectItem value="table">表</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="product">
          <Card>
            <CardHeader>
              <CardTitle>商品別売上データ</CardTitle>
              <CardDescription>
                期間内の商品別売上を表示します
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ProductSalesChart 
                dateRange={dateRange} 
                viewType={viewType} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>日別売上データ</CardTitle>
              <CardDescription>
                期間内の日別売上を表示します
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <DailySalesChart 
                dateRange={dateRange} 
                viewType={viewType} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="free-items">
          <Card>
            <CardHeader>
              <CardTitle>無料処理データ</CardTitle>
              <CardDescription>
                無料処理された商品と理由の一覧を表示します
              </CardDescription>
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
