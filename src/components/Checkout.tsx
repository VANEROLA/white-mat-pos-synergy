
import React from "react";
import { CartState, InventoryUpdatePayload, Product } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertTriangle, BadgePercent, WifiOff } from "lucide-react";
import { updateInventory, generateOrderId } from "@/utils/api";
import { toast } from "sonner";
import { useTax } from "@/contexts/TaxContext";
import { useConnection } from "@/contexts/ConnectionContext";

interface CheckoutProps {
  open: boolean;
  cart: CartState;
  onClose: () => void;
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  open,
  cart,
  onClose,
  onComplete,
}) => {
  const [status, setStatus] = React.useState<"initial" | "processing" | "success" | "failed" | "offline">("initial");
  const [orderId, setOrderId] = React.useState<string>("");
  const { taxRate } = useTax();
  const { status: connectionStatus, isOnlineMode } = useConnection();
  
  // チェックアウトダイアログが開かれたときの初期状態
  React.useEffect(() => {
    if (open) {
      // オフラインモードの場合は、初期状態をオフラインに設定
      if (!isOnlineMode || connectionStatus !== 'connected') {
        setStatus("offline");
      } else {
        setStatus("initial");
      }
      setOrderId(generateOrderId());
    }
  }, [open, isOnlineMode, connectionStatus]);
  
  const taxAmount = Math.round(cart.total * (taxRate / 100));
  const totalWithTax = cart.total + taxAmount;
  
  const handleProcessOrder = async () => {
    if (cart.items.length === 0) return;
    
    // オフラインモードの場合
    if (!isOnlineMode || connectionStatus !== 'connected') {
      setStatus("offline");
      // 親コンポーネントのhandleCompleteCheckoutが自動的にオフラインモードの処理を行う
      setTimeout(() => {
        onComplete();
        onClose();
      }, 1500);
      return;
    }
    
    setStatus("processing");
    
    const payload: InventoryUpdatePayload = {
      products: cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
      })),
      orderId,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const response = await updateInventory(payload);
      
      if (response.success) {
        setStatus("success");
        toast.success("注文が完了しました");
      } else {
        setStatus("failed");
        toast.error("在庫の更新に失敗しました");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setStatus("failed");
      toast.error("処理中にエラーが発生しました");
    }
  };
  
  const handleClose = () => {
    // 処理中でない場合のみ閉じることができる
    if (status !== "processing") {
      onClose();
      
      // チェックアウトが成功した場合、またはオフラインモードの場合
      if (status === "success" || status === "offline") {
        onComplete();
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md glass border border-white/50">
        <DialogHeader>
          <DialogTitle className="text-center">注文を確定する</DialogTitle>
          <DialogDescription className="text-center">
            {status === "initial" && "在庫管理システムと連携します"}
            {status === "processing" && "処理中..."}
            {status === "success" && "注文が完了しました"}
            {status === "failed" && "処理に失敗しました"}
            {status === "offline" && "オフラインモードで注文を保存します"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {(status === "initial" || status === "offline") && (
            <div className="animate-fade-in space-y-4">
              <div className="rounded-lg bg-secondary p-4">
                <h3 className="text-sm font-medium mb-2">注文情報</h3>
                <p className="text-xs text-muted-foreground mb-1">注文ID: {orderId}</p>
                <p className="text-xs text-muted-foreground">商品点数: {cart.items.length}点</p>
                
                {status === "offline" && (
                  <div className="mt-2 flex items-center gap-1.5 text-orange-600 text-xs">
                    <WifiOff size={14} />
                    <span>オフラインモード: データは後で同期されます</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">小計:</span>
                  <span>¥{cart.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    <BadgePercent size={14} className="mr-1" />
                    消費税 ({taxRate}%):
                  </span>
                  <span>¥{taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2">
                  <span>合計:</span>
                  <span>¥{totalWithTax.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
          
          {status === "processing" && (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <Loader2 size={48} className="animate-spin text-primary mb-4" />
              <p className="text-center">在庫管理システムと連携中...</p>
            </div>
          )}
          
          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <CheckCircle size={48} className="text-green-500 mb-4" />
              <p className="text-center mb-1">注文処理が完了しました</p>
              <p className="text-sm text-muted-foreground text-center">注文ID: {orderId}</p>
            </div>
          )}
          
          {status === "failed" && (
            <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
              <AlertTriangle size={48} className="text-destructive mb-4" />
              <p className="text-center">在庫の更新に失敗しました</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                もう一度お試しいただくか、管理者にお問い合わせください
              </p>
            </div>
          )}
          
          {status === "offline" && (
            <div className="flex flex-col items-center justify-center py-5 animate-fade-in">
              <WifiOff size={40} className="text-orange-500 mb-3" />
              <p className="text-center">オフラインモードで注文を処理します</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                オンラインに接続したときに自動的に同期されます
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          {status === "initial" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button onClick={handleProcessOrder}>
                確定する
              </Button>
            </>
          )}
          
          {status === "offline" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button onClick={handleProcessOrder} variant="default" className="bg-orange-500 hover:bg-orange-600">
                オフラインで確定する
              </Button>
            </>
          )}
          
          {status === "processing" && (
            <Button disabled>
              <Loader2 size={16} className="mr-2 animate-spin" />
              処理中...
            </Button>
          )}
          
          {(status === "success" || status === "failed") && (
            <Button onClick={handleClose}>
              {status === "success" ? "完了" : "閉じる"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Checkout;
