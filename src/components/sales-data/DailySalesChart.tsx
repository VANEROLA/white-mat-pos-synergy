
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRange } from "react-day-picker";
import { format, differenceInDays, addDays, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

interface DailySale {
  date: string;
  revenue: number;
  transactions: number;
}

interface DailySalesChartProps {
  dateRange?: DateRange;
  viewType: string;
}

const DailySalesChart: React.FC<DailySalesChartProps> = ({ dateRange, viewType }) => {
  const [data, setData] = useState<DailySale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof DailySale, direction: 'ascending' | 'descending' }>({
    key: 'date',
    direction: 'descending'
  });

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      
      // In a real application, this would be an API call with the date range
      setTimeout(() => {
        const mockData: DailySale[] = [];
        
        if (dateRange?.from && dateRange?.to) {
          // Generate data for each day in the range
          const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
          
          days.forEach(day => {
            // Generate some random data
            const revenue = Math.floor(Math.random() * 50000) + 10000;
            const transactions = Math.floor(Math.random() * 30) + 10;
            
            mockData.push({
              date: format(day, 'yyyy/MM/dd'),
              revenue,
              transactions
            });
          });
        }
        
        setData(mockData);
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, [dateRange]);

  // Sort function for the table data
  const sortData = (key: keyof DailySale) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      if (sortConfig.key === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    if (sortConfig.key === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
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
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip 
              formatter={(value: any, name: string) => {
                if (name === '取引数') return `${value}件`;
                return formatCurrency(value);
              }}
              labelFormatter={(label) => `日付: ${label}`}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="transactions" name="取引数" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" name="売上" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('date')}
              >
                日付
                {sortConfig.key === 'date' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('transactions')}
              >
                取引数
                {sortConfig.key === 'transactions' && (
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
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.transactions}件</TableCell>
                <TableCell>{formatCurrency(item.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default DailySalesChart;
