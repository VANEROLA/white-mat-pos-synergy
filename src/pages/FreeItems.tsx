
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
import { ArrowLeft, ChevronDown, ChevronUp, Package } from "lucide-react";
import { CartItem } from '@/types';

interface FreeItem {
  id: string;
  staffName: string;
  reason: string;
  notes?: string;
  timestamp: string;
  products?: CartItem[]; // Add products to the FreeItem interface
}

const FreeItems = () => {
  const [freeItems, setFreeItems] = React.useState<FreeItem[]>([]);
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const location = useLocation();
  const fromSidebar = location.state?.fromSidebar;

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem("freeItems") || "[]");
    setFreeItems(items.sort((a: FreeItem, b: FreeItem) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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
              <TableHead>商品</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {freeItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  履歴がありません
                </TableCell>
              </TableRow>
            ) : (
              freeItems.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow>
                    <TableCell>
                      {format(new Date(item.timestamp), 'yyyy/MM/dd HH:mm')}
                    </TableCell>
                    <TableCell>{item.staffName}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                    <TableCell>{item.notes || '-'}</TableCell>
                    <TableCell>
                      {item.products && item.products.length > 0 ? (
                        <div className="flex items-center">
                          <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{item.products.length}点の商品</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {item.products && item.products.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {expandedItems[item.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedItems[item.id] && item.products && (
                    <TableRow className="bg-muted/20">
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4">
                          <h4 className="font-medium mb-2">商品リスト</h4>
                          <div className="space-y-2">
                            {item.products.map((product, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-background rounded">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-muted rounded overflow-hidden mr-2">
                                    {product.imageUrl ? (
                                      <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover" 
                                      />
                                    ) : (
                                      <Package className="w-full h-full p-1" />
                                    )}
                                  </div>
                                  <span>{product.name}</span>
                                </div>
                                <div className="text-sm text-muted-foreground flex gap-4">
                                  <span>{product.quantity}点</span>
                                  <span>{product.price.toLocaleString()}円</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FreeItems;
