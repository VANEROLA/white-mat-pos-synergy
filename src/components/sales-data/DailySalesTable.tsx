
import React, { useState, useEffect } from 'react';
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

interface DailySalesTableProps {
  dateRange?: DateRange;
}

const DailySalesTable: React.FC<DailySalesTableProps> = ({ dateRange }) => {
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
  
  const exportToCSV = () => {
    const csvData = sortedData.map(item => ({
      date: item.date,
      transactions: item.transactions,
      revenue: item.revenue
    }));
    
    // Convert to CSV and download
    const csvContent = "日付,取引数,売上金額\n" + 
      csvData.map(item => `${item.date},${item.transactions},${item.revenue}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `daily_sales_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  return (
    <>
      <div className="rounded-md border overflow-auto">
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
      </div>
    </>
  );
};

export default DailySalesTable;
