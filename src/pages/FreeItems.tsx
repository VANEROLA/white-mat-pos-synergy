
import React from 'react';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FreeItem {
  id: string;
  staffName: string;
  reason: string;
  notes?: string;
  timestamp: string;
}

const FreeItems = () => {
  const [freeItems, setFreeItems] = React.useState<FreeItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const fromSidebar = location.state?.fromSidebar;

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem("freeItems") || "[]");
    setFreeItems(items.sort((a: FreeItem, b: FreeItem) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => fromSidebar ? navigate('/') : navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <h1 className="text-2xl font-bold">無料処理履歴</h1>
      </div>

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
            {freeItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  履歴がありません
                </TableCell>
              </TableRow>
            ) : (
              freeItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {format(new Date(item.timestamp), 'yyyy/MM/dd HH:mm')}
                  </TableCell>
                  <TableCell>{item.staffName}</TableCell>
                  <TableCell>{item.reason}</TableCell>
                  <TableCell>{item.notes || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FreeItems;
