
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Options: React.FC = () => {
  // 表示設定のオプション
  const [displayOptions, setDisplayOptions] = useState({
    darkMode: false,
    showProductImages: true,
    largeText: false,
    compactMode: false
  });

  // 通知設定のオプション
  const [notificationOptions, setNotificationOptions] = useState({
    enableNotifications: true,
    soundEnabled: true,
    showLowStockAlerts: true
  });

  // レジ操作のオプション
  const [posOptions, setPostOptions] = useState({
    quickCheckout: false,
    confirmBeforeRemove: true,
    showLastOrderSummary: true
  });

  // テーマカラーの選択
  const [themeColor, setThemeColor] = useState("blue");

  const handleDisplayOptionChange = (key: keyof typeof displayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key}の設定を変更しました`);
  };

  const handleNotificationOptionChange = (key: keyof typeof notificationOptions) => {
    setNotificationOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key}の設定を変更しました`);
  };

  const handlePOSOptionChange = (key: keyof typeof posOptions) => {
    setPostOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key}の設定を変更しました`);
  };

  const handleSaveSettings = () => {
    // 設定の保存処理（実際にはローカルストレージやデータベースに保存）
    toast.success("すべての設定を保存しました");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">オプション設定</h1>
      
      <Tabs defaultValue="display" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="display">表示設定</TabsTrigger>
          <TabsTrigger value="notifications">通知設定</TabsTrigger>
          <TabsTrigger value="pos">レジ操作</TabsTrigger>
        </TabsList>
        
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>表示設定</CardTitle>
              <CardDescription>
                アプリケーションの表示方法をカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">ダークモード</Label>
                <Switch 
                  id="dark-mode" 
                  checked={displayOptions.darkMode}
                  onCheckedChange={() => handleDisplayOptionChange('darkMode')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="product-images">商品画像を表示</Label>
                <Switch 
                  id="product-images" 
                  checked={displayOptions.showProductImages}
                  onCheckedChange={() => handleDisplayOptionChange('showProductImages')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="large-text">大きいテキスト</Label>
                <Switch 
                  id="large-text" 
                  checked={displayOptions.largeText}
                  onCheckedChange={() => handleDisplayOptionChange('largeText')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-mode">コンパクトモード</Label>
                <Switch 
                  id="compact-mode" 
                  checked={displayOptions.compactMode}
                  onCheckedChange={() => handleDisplayOptionChange('compactMode')}
                />
              </div>
              <Separator />
              
              <div className="pt-2">
                <Label className="mb-2 block">テーマカラー</Label>
                <ToggleGroup 
                  type="single" 
                  value={themeColor}
                  onValueChange={(value) => {
                    if (value) setThemeColor(value);
                    toast.success(`テーマカラーを${value}に変更しました`);
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="blue" className="bg-blue-500 hover:bg-blue-600 h-8 w-8"></ToggleGroupItem>
                  <ToggleGroupItem value="green" className="bg-green-500 hover:bg-green-600 h-8 w-8"></ToggleGroupItem>
                  <ToggleGroupItem value="purple" className="bg-purple-500 hover:bg-purple-600 h-8 w-8"></ToggleGroupItem>
                  <ToggleGroupItem value="rose" className="bg-rose-500 hover:bg-rose-600 h-8 w-8"></ToggleGroupItem>
                  <ToggleGroupItem value="amber" className="bg-amber-500 hover:bg-amber-600 h-8 w-8"></ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>
                通知の受け取り方をカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-notifications">通知を有効化</Label>
                <Switch 
                  id="enable-notifications" 
                  checked={notificationOptions.enableNotifications}
                  onCheckedChange={() => handleNotificationOptionChange('enableNotifications')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-enabled">通知音</Label>
                <Switch 
                  id="sound-enabled" 
                  checked={notificationOptions.soundEnabled}
                  disabled={!notificationOptions.enableNotifications}
                  onCheckedChange={() => handleNotificationOptionChange('soundEnabled')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="low-stock-alerts">在庫不足アラート</Label>
                <Switch 
                  id="low-stock-alerts" 
                  checked={notificationOptions.showLowStockAlerts}
                  disabled={!notificationOptions.enableNotifications}
                  onCheckedChange={() => handleNotificationOptionChange('showLowStockAlerts')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pos">
          <Card>
            <CardHeader>
              <CardTitle>レジ操作設定</CardTitle>
              <CardDescription>
                レジ操作の動作をカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="quick-checkout">クイックチェックアウト</Label>
                <Switch 
                  id="quick-checkout" 
                  checked={posOptions.quickCheckout}
                  onCheckedChange={() => handlePOSOptionChange('quickCheckout')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="confirm-remove">削除前に確認</Label>
                <Switch 
                  id="confirm-remove" 
                  checked={posOptions.confirmBeforeRemove}
                  onCheckedChange={() => handlePOSOptionChange('confirmBeforeRemove')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="last-order-summary">前回の注文サマリーを表示</Label>
                <Switch 
                  id="last-order-summary" 
                  checked={posOptions.showLastOrderSummary}
                  onCheckedChange={() => handlePOSOptionChange('showLastOrderSummary')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings}>
          すべての設定を保存
        </Button>
      </div>
    </div>
  );
};

export default Options;
