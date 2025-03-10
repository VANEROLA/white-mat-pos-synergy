
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FreeItem {
  id: string;
  staffName: string;
  reason: string;
  notes?: string;
  timestamp: string;
}

const FreeItems = () => {
  const [freeItems, setFreeItems] = React.useState<FreeItem[]>([]);

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem("freeItems") || "[]");
    setFreeItems(items.sort((a: FreeItem, b: FreeItem) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">無料処理履歴</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日時</TableHead>
              <TableHead>担当者</TableHead>
              <TableHead>理由</TableHead>
              <TableHead>補足メモ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {freeItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {format(new Date(item.timestamp), 'yyyy/MM/dd HH:mm')}
                </TableCell>
                <TableCell>{item.staffName}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FreeItems;
