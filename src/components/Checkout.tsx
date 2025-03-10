
import React from "react";
import { CartState, InventoryUpdatePayload } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { updateInventory, generateOrderId } from "@/utils/api";
import { toast } from "sonner";

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
  const [status, setStatus] = React.useState<"initial" | "processing" | "success" | "failed">("initial");
  const [orderId, setOrderId] = React.useState<string>("");
  
  // Reset the state when the dialog opens
  React.useEffect(() => {
    if (open) {
      setStatus("initial");
      setOrderId(generateOrderId());
    }
  }, [open]);
  
  const handleProcessOrder = async () => {
    if (cart.items.length === 0) return;
    
    setStatus("processing");
    
    const payload: InventoryUpdatePayload = {
      products: cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
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
    // Only allow closing if we're not in the middle of processing
    if (status !== "processing") {
      onClose();
      
      // If checkout was successful, reset the cart
      if (status === "success") {
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
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {status === "initial" && (
            <div className="animate-fade-in space-y-4">
              <div className="rounded-lg bg-secondary p-4">
                <h3 className="text-sm font-medium mb-2">注文情報</h3>
                <p className="text-xs text-muted-foreground mb-1">注文ID: {orderId}</p>
                <p className="text-xs text-muted-foreground">商品点数: {cart.items.length}点</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">小計:</span>
                  <span>¥{cart.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">消費税 (10%):</span>
                  <span>¥{Math.round(cart.total * 0.1).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2">
                  <span>合計:</span>
                  <span>¥{Math.round(cart.total * 1.1).toLocaleString()}</span>
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
