
import React, { useState, useEffect } from 'react';
import { DateRange } from "react-day-picker";
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface FreeItem {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  price: number;
  reason: string;
  staff: string;
  location: string;
}

interface FreeItemsTableProps {
  dateRange?: DateRange;
}

const FreeItemsTable: React.FC<FreeItemsTableProps> = ({ dateRange }) => {
  const [data, setData] = useState<FreeItem[]>([]);
  const [filteredData, setFilteredData] = useState<FreeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof FreeItem, direction: 'ascending' | 'descending' }>({
    key: 'date',
    direction: 'descending'
  });

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      
      // In a real application, this would be an API call with the date range
      setTimeout(() => {
        const mockData: FreeItem[] = [
          {
            id: "F001",
            date: "2023/05/15 09:23:45",
            productName: "コーヒー (大)",
            quantity: 1,
            price: 500,
            reason: "お客様への謝罪",
            staff: "山田太郎",
            location: "東京店"
          },
          {
            id: "F002",
            date: "2023/05/16 11:45:20",
            productName: "エスプレッソ",
            quantity: 2,
            price: 800,
            reason: "製品不良",
            staff: "佐藤花子",
            location: "大阪店"
          },
          {
            id: "F003",
            date: "2023/05/17 14:30:05",
            productName: "チョコレートクッキー",
            quantity: 3,
            price: 900,
            reason: "常連客サービス",
            staff: "鈴木一郎",
            location: "名古屋店"
          },
          {
            id: "F004",
            date: "2023/05/18 16:12:30",
            productName: "カフェラテ",
            quantity: 1,
            price: 600,
            reason: "お客様への謝罪",
            staff: "高橋みどり",
            location: "福岡店"
          },
          {
            id: "F005",
            date: "2023/05/19 10:05:15",
            productName: "チーズケーキ",
            quantity: 2,
            price: 1000,
            reason: "店舗イベント",
            staff: "田中健太",
            location: "札幌店"
          },
          {
            id: "F006",
            date: "2023/05/20 13:45:00",
            productName: "アメリカーノ",
            quantity: 4,
            price: 2000,
            reason: "社内利用",
            staff: "伊藤洋子",
            location: "東京店"
          },
          {
            id: "F007",
            date: "2023/05/21 09:10:45",
            productName: "カプチーノ",
            quantity: 2,
            price: 1200,
            reason: "お客様への謝罪",
            staff: "渡辺直人",
            location: "大阪店"
          },
        ];
        
        setData(mockData);
        setFilteredData(mockData);
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, [dateRange]);

  // Filter data based on search term
  useEffect(() => {
    if (!filter) {
      setFilteredData(data);
      return;
    }
    
    const lowercasedFilter = filter.toLowerCase();
    const filtered = data.filter(item => {
      return (
        item.productName.toLowerCase().includes(lowercasedFilter) ||
        item.reason.toLowerCase().includes(lowercasedFilter) ||
        item.staff.toLowerCase().includes(lowercasedFilter) ||
        item.location.toLowerCase().includes(lowercasedFilter)
      );
    });
    
    setFilteredData(filtered);
  }, [filter, data]);

  // Sort function for the table data
  const sortData = (key: keyof FreeItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
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

  // Export free items data to CSV
  const exportToCSV = () => {
    const csvData = sortedData.map(item => ({
      id: item.id,
      date: item.date,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      reason: item.reason,
      staff: item.staff,
      location: item.location
    }));
    
    // Convert to CSV and download
    const csvContent = "ID,日時,商品,数量,金額,理由,スタッフ,店舗\n" + 
      csvData.map(item => 
        `${item.id},${item.date},"${item.productName}",${item.quantity},${item.price},"${item.reason}","${item.staff}","${item.location}"`
      ).join("\n");
    
    // Add BOM for UTF-8 to handle Japanese characters
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `free_items_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate the total value of free items
  const totalValue = filteredData.reduce((sum, item) => sum + item.price, 0);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="w-full md:w-1/3">
          <Input 
            placeholder="検索..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="text-right">
          <p>合計金額: <span className="font-bold">{formatCurrency(totalValue)}</span></p>
          <p>件数: <span className="font-bold">{filteredData.length}件</span></p>
        </div>
      </div>
      
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('date')}
              >
                日時
                {sortConfig.key === 'date' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('productName')}
              >
                商品
                {sortConfig.key === 'productName' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
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
                onClick={() => sortData('price')}
              >
                金額
                {sortConfig.key === 'price' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('reason')}
              >
                理由
                {sortConfig.key === 'reason' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('staff')}
              >
                スタッフ
                {sortConfig.key === 'staff' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => sortData('location')}
              >
                店舗
                {sortConfig.key === 'location' && (
                  <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.staff}</TableCell>
                <TableCell>{item.location}</TableCell>
              </TableRow>
            ))}
            {sortedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">データがありません</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FreeItemsTable;
