
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Menu } from "lucide-react";
import HamburgerMenu from "@/components/HamburgerMenu";

const Options: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 表示設定のオプション
  const [displayOptions, setDisplayOptions] = useState({
    darkMode: false,
    showProductImages: true,
    largeText: false,
    compactMode: false,
    highContrastMode: false,
    animationsEnabled: true
  });

  // 通知設定のオプション
  const [notificationOptions, setNotificationOptions] = useState({
    enableNotifications: true,
    soundEnabled: true,
    showLowStockAlerts: true,
    showOrderCompletionAlerts: true,
    vibrateOnAlert: false,
    emailNotifications: false
  });

  // レジ操作のオプション
  const [posOptions, setPosOptions] = useState({
    quickCheckout: false,
    confirmBeforeRemove: true,
    showLastOrderSummary: true,
    autoSaveCart: true,
    clearCartAfterCheckout: true,
    showTaxBreakdown: false,
    requireStaffIdForDiscounts: true
  });

  // セキュリティ設定
  const [securityOptions, setSecurityOptions] = useState({
    autoLockScreen: false,
    autoLockTimeout: 5,
    requirePinForRefunds: true,
    showActivityLogs: true,
    allowBiometricAuth: false
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
    setPosOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key}の設定を変更しました`);
  };

  const handleSecurityOptionChange = (key: keyof typeof securityOptions) => {
    if (key === 'autoLockTimeout') return;
    
    setSecurityOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key}の設定を変更しました`);
  };

  const handleSaveSettings = () => {
    // 設定の保存処理（実際にはローカルストレージやデータベースに保存）
    toast.success("すべての設定を保存しました");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <HamburgerMenu 
            isOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            className="mr-3"
          />
          <h1 className="text-2xl font-bold">オプション設定</h1>
        </div>
      </div>
      
      <Tabs defaultValue="display" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="display">表示設定</TabsTrigger>
          <TabsTrigger value="notifications">通知設定</TabsTrigger>
          <TabsTrigger value="pos">レジ操作</TabsTrigger>
          <TabsTrigger value="security">セキュリティ</TabsTrigger>
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
              
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast">ハイコントラストモード</Label>
                <Switch 
                  id="high-contrast" 
                  checked={displayOptions.highContrastMode}
                  onCheckedChange={() => handleDisplayOptionChange('highContrastMode')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">アニメーションを有効化</Label>
                <Switch 
                  id="animations" 
                  checked={displayOptions.animationsEnabled}
                  onCheckedChange={() => handleDisplayOptionChange('animationsEnabled')}
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
                  className="justify-start flex-wrap"
                >
                  <ToggleGroupItem value="blue" className="bg-blue-500 hover:bg-blue-600 h-8 w-8 mr-2"></ToggleGroupItem>
                  <ToggleGroupItem value="green" className="bg-green-500 hover:bg-green-600 h-8 w-8 mr-2"></ToggleGroupItem>
                  <ToggleGroupItem value="purple" className="bg-purple-500 hover:bg-purple-600 h-8 w-8 mr-2"></ToggleGroupItem>
                  <ToggleGroupItem value="rose" className="bg-rose-500 hover:bg-rose-600 h-8 w-8 mr-2"></ToggleGroupItem>
                  <ToggleGroupItem value="amber" className="bg-amber-500 hover:bg-amber-600 h-8 w-8 mr-2"></ToggleGroupItem>
                  <ToggleGroupItem value="teal" className="bg-teal-500 hover:bg-teal-600 h-8 w-8 mr-2"></ToggleGroupItem>
                  <ToggleGroupItem value="indigo" className="bg-indigo-500 hover:bg-indigo-600 h-8 w-8 mr-2"></ToggleGroupItem>
                  <ToggleGroupItem value="pink" className="bg-pink-500 hover:bg-pink-600 h-8 w-8"></ToggleGroupItem>
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
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="order-completion">注文完了通知</Label>
                <Switch 
                  id="order-completion" 
                  checked={notificationOptions.showOrderCompletionAlerts}
                  disabled={!notificationOptions.enableNotifications}
                  onCheckedChange={() => handleNotificationOptionChange('showOrderCompletionAlerts')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="vibrate">振動を有効化</Label>
                <Switch 
                  id="vibrate" 
                  checked={notificationOptions.vibrateOnAlert}
                  disabled={!notificationOptions.enableNotifications}
                  onCheckedChange={() => handleNotificationOptionChange('vibrateOnAlert')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">メール通知</Label>
                <Switch 
                  id="email-notifications" 
                  checked={notificationOptions.emailNotifications}
                  disabled={!notificationOptions.enableNotifications}
                  onCheckedChange={() => handleNotificationOptionChange('emailNotifications')}
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
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">カートを自動保存</Label>
                <Switch 
                  id="auto-save" 
                  checked={posOptions.autoSaveCart}
                  onCheckedChange={() => handlePOSOptionChange('autoSaveCart')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="clear-cart">チェックアウト後にカートをクリア</Label>
                <Switch 
                  id="clear-cart" 
                  checked={posOptions.clearCartAfterCheckout}
                  onCheckedChange={() => handlePOSOptionChange('clearCartAfterCheckout')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="tax-breakdown">税金内訳を表示</Label>
                <Switch 
                  id="tax-breakdown" 
                  checked={posOptions.showTaxBreakdown}
                  onCheckedChange={() => handlePOSOptionChange('showTaxBreakdown')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="staff-id">割引にスタッフIDを要求</Label>
                <Switch 
                  id="staff-id" 
                  checked={posOptions.requireStaffIdForDiscounts}
                  onCheckedChange={() => handlePOSOptionChange('requireStaffIdForDiscounts')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>セキュリティ設定</CardTitle>
              <CardDescription>
                セキュリティオプションをカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-lock">画面自動ロック</Label>
                <Switch 
                  id="auto-lock" 
                  checked={securityOptions.autoLockScreen}
                  onCheckedChange={() => handleSecurityOptionChange('autoLockScreen')}
                />
              </div>
              
              {securityOptions.autoLockScreen && (
                <div className="pl-4 ml-4 border-l-2 border-muted pt-2 pb-3">
                  <Label htmlFor="lock-timeout" className="mb-2 block">自動ロックまでの時間（分）</Label>
                  <div className="flex gap-4">
                    <Button 
                      variant={securityOptions.autoLockTimeout === 1 ? "default" : "outline"} 
                      onClick={() => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: 1 }))}
                    >
                      1
                    </Button>
                    <Button 
                      variant={securityOptions.autoLockTimeout === 5 ? "default" : "outline"}
                      onClick={() => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: 5 }))}
                    >
                      5
                    </Button>
                    <Button 
                      variant={securityOptions.autoLockTimeout === 10 ? "default" : "outline"}
                      onClick={() => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: 10 }))}
                    >
                      10
                    </Button>
                    <Button 
                      variant={securityOptions.autoLockTimeout === 30 ? "default" : "outline"}
                      onClick={() => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: 30 }))}
                    >
                      30
                    </Button>
                  </div>
                </div>
              )}
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="pin-refunds">返金処理にPINを要求</Label>
                <Switch 
                  id="pin-refunds" 
                  checked={securityOptions.requirePinForRefunds}
                  onCheckedChange={() => handleSecurityOptionChange('requirePinForRefunds')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="activity-logs">アクティビティログを表示</Label>
                <Switch 
                  id="activity-logs" 
                  checked={securityOptions.showActivityLogs}
                  onCheckedChange={() => handleSecurityOptionChange('showActivityLogs')}
                />
              </div>
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="biometric">生体認証を許可</Label>
                <Switch 
                  id="biometric" 
                  checked={securityOptions.allowBiometricAuth}
                  onCheckedChange={() => handleSecurityOptionChange('allowBiometricAuth')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          すべての設定を保存
        </Button>
      </div>
    </div>
  );
};

export default Options;
