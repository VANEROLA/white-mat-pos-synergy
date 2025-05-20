
import React, { useState, useEffect } from 'react';
import { Order } from '@/types';
import { getOrderHistory, updateOrder, addLogEntry } from '@/utils/api';
import POSHeader from '@/components/POSHeader';
import { Button } from '@/components/ui/button';
import { Edit, Eye, ArrowLeft, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/SidebarMenu';
import HamburgerMenu from '@/components/HamburgerMenu';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load orders from API
    const loadOrders = () => {
      const history = getOrderHistory();
      setOrders(history);
    };
    
    loadOrders();
  }, []);

  const toggleMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditMode(false);
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      setEditedOrder({...selectedOrder});
      setIsEditMode(true);
    }
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setEditedOrder(null);
    setIsEditMode(false);
  };

  const handleSaveChanges = () => {
    if (editedOrder) {
      const success = updateOrder(editedOrder);
      
      if (success) {
        toast.success('注文情報が更新されました');
        
        // Update local state
        setOrders(orders.map(order => 
          order.id === editedOrder.id ? editedOrder : order
        ));
        
        setSelectedOrder(editedOrder);
        setIsEditMode(false);
      } else {
        toast.error('注文情報の更新に失敗しました');
      }
    }
  };

  const handleStatusChange = (status: Order['status']) => {
    if (editedOrder) {
      setEditedOrder({...editedOrder, status});
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP');
  };

  const getStatusClass = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'canceled':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <HamburgerMenu 
            isOpen={isSidebarOpen} 
            toggleMenu={toggleMenu} 
            className="mr-4"
          />
          <h1 className="text-2xl font-semibold">注文履歴</h1>
        </div>
        
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
        </div>
        
        {orders.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-lg text-muted-foreground">注文履歴がありません</p>
          </div>
        ) : (
          <div className="glass rounded-xl p-6 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">注文ID</th>
                    <th className="text-left py-3 px-4">日時</th>
                    <th className="text-left py-3 px-4">商品数</th>
                    <th className="text-left py-3 px-4">状態</th>
                    <th className="text-right py-3 px-4">アクション</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                      <td className="py-3 px-4">{formatDate(order.timestamp)}</td>
                      <td className="py-3 px-4">{order.items.length}点</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                          {order.status === 'completed' && '完了'}
                          {order.status === 'canceled' && 'キャンセル'}
                          {order.status === 'processing' && '処理中'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          詳細
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Order Detail/Edit Dialog */}
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? '注文情報の編集' : '注文詳細'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">注文ID:</p>
                  <p className="font-mono">{selectedOrder.id}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">日時:</p>
                  <p>{formatDate(selectedOrder.timestamp)}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">状態:</p>
                  {isEditMode ? (
                    <div className="flex gap-2 mt-1">
                      <Button 
                        size="sm"
                        variant={editedOrder?.status === 'completed' ? 'default' : 'outline'}
                        className={editedOrder?.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
                        onClick={() => handleStatusChange('completed')}
                      >
                        完了
                      </Button>
                      <Button 
                        size="sm"
                        variant={editedOrder?.status === 'processing' ? 'default' : 'outline'}
                        className={editedOrder?.status === 'processing' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                        onClick={() => handleStatusChange('processing')}
                      >
                        処理中
                      </Button>
                      <Button 
                        size="sm"
                        variant={editedOrder?.status === 'canceled' ? 'default' : 'outline'}
                        className={editedOrder?.status === 'canceled' ? 'bg-red-500 hover:bg-red-600' : ''}
                        onClick={() => handleStatusChange('canceled')}
                      >
                        キャンセル
                      </Button>
                    </div>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedOrder.status)}`}>
                      {selectedOrder.status === 'completed' && '完了'}
                      {selectedOrder.status === 'canceled' && 'キャンセル'}
                      {selectedOrder.status === 'processing' && '処理中'}
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">商品:</p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <span>{item.name || `Product ${item.id}`}</span>
                        <span className="text-sm">
                          {item.quantity}点
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                {isEditMode ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditMode(false)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      キャンセル
                    </Button>
                    <Button onClick={handleSaveChanges}>
                      <Save className="mr-2 h-4 w-4" />
                      保存
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCloseDialog}
                    >
                      閉じる
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={handleEditOrder}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      編集
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
