
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRange } from "react-day-picker";
import { format } from 'date-fns';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

interface ProductSale {
  productName: string;
  quantity: number;
  revenue: number;
}

interface ProductSalesChartProps {
  dateRange?: DateRange;
  viewType: string;
}

const ProductSalesChart: React.FC<ProductSalesChartProps> = ({ dateRange, viewType }) => {
  const [data, setData] = useState<ProductSale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProductSale, direction: 'ascending' | 'descending' }>({
    key: 'revenue',
    direction: 'descending'
  });

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      // In a real application, this would be an API call with the date range
      // For demo purposes, we'll use mock data
      
      setTimeout(() => {
        const mockData: ProductSale[] = [
          { productName: "コーヒー (大)", quantity: 185, revenue: 92500 },
          { productName: "コーヒー (小)", quantity: 245, revenue: 73500 },
          { productName: "カプチーノ", quantity: 98, revenue: 58800 },
          { productName: "エスプレッソ", quantity: 56, revenue: 22400 },
          { productName: "カフェラテ", quantity: 127, revenue: 76200 },
          { productName: "アメリカーノ", quantity: 75, revenue: 37500 },
          { productName: "チョコレートクッキー", quantity: 112, revenue: 33600 },
          { productName: "チーズケーキ", quantity: 43, revenue: 21500 },
        ];
        
        setData(mockData);
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, [dateRange]);

  // Sort function for the table data
  const sortData = (key: keyof ProductSale) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  return (
    <>
      {viewType === 'chart' ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="productName" 
              angle={-45} 
              textAnchor="end"
              height={80} 
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip 
              formatter={(value: any, name: string) => {
                if (name === '数量') return `${value}個`;
                return formatCurrency(value);
              }} 
            />
            <Legend />
            <Bar yAxisId="left" dataKey="quantity" name="数量" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="revenue" name="売上" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>商品名</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('quantity')}
              >
                数量
                {sortConfig.key === 'quantity' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('revenue')}
              >
                売上金額
                {sortConfig.key === 'revenue' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.quantity}個</TableCell>
                <TableCell>{formatCurrency(item.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default ProductSalesChart;
