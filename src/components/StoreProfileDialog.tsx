
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStoreAuth } from "@/hooks/useStoreAuth";
import { toast } from "sonner";

interface StoreProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StoreProfileDialog: React.FC<StoreProfileDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { storeInfo, updateStoreInfo } = useStoreAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>(storeInfo?.avatarUrl || "");
  const [storeName, setStoreName] = useState<string>(storeInfo?.storeName || "");

  // ダイアログが開いたときに現在の値をセット
  React.useEffect(() => {
    if (open && storeInfo) {
      setAvatarUrl(storeInfo.avatarUrl || "");
      setStoreName(storeInfo.storeName);
    }
  }, [open, storeInfo]);

  const handleSave = () => {
    if (!storeInfo) return;
    
    const success = updateStoreInfo({
      storeName,
      avatarUrl: avatarUrl || undefined,
    });
    
    if (success) {
      toast.success("プロフィールを更新しました");
      onOpenChange(false);
    } else {
      toast.error("プロフィールの更新に失敗しました");
    }
  };

  const getInitials = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : "S";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ストアプロフィール編集</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-2xl">
              {getInitials(storeName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="grid w-full max-w-sm gap-2">
            <Label htmlFor="avatar-url">アイコン画像URL</Label>
            <Input
              id="avatar-url"
              type="text"
              placeholder="画像のURLを入力してください"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              インターネット上の画像URLを入力してください（JPG, PNG, GIF）
            </p>
          </div>
          
          <div className="grid w-full max-w-sm gap-2">
            <Label htmlFor="store-name">店舗名</Label>
            <Input
              id="store-name"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            保存する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoreProfileDialog;
