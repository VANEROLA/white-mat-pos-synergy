
import React from "react";
import { ShoppingCart } from "lucide-react";

const EmptyCart: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-6 text-muted-foreground">
      <ShoppingCart size={32} className="mb-2 opacity-30" />
      <p>カートに商品がありません</p>
      <p className="text-sm">商品を追加してください</p>
    </div>
  );
};

export default EmptyCart;
