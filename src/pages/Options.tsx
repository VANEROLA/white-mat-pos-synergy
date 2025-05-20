
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, Palette, Bell, ShoppingCart, Lock, Menu } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import SidebarMenu from "@/components/SidebarMenu";
import { DisplayTab } from "@/components/options/DisplayTab";
import { NotificationsTab } from "@/components/options/NotificationsTab";
import { POSTab } from "@/components/options/POSTab";
import { SecurityTab } from "@/components/options/SecurityTab";

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            className="mr-2 md:hidden"
            aria-label="メニューを開く"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <SidebarMenu 
            isOpen={isMenuOpen}
            onClose={closeMenu}
            toggleMenu={toggleMenu}
            className="mr-3"
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">オプション設定</h1>
            <p className="text-muted-foreground">システムの動作と表示をカスタマイズします</p>
          </div>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Info size={16} />
              <span className="hidden md:inline">ヘルプ</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h3 className="font-medium">オプション設定について</h3>
              <p className="text-sm text-muted-foreground">
                このページでは、アプリケーションの挙動と見た目を自由にカスタマイズできます。変更はリアルタイムで反映され「設定を保存」ボタンで永続化されます。
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                設定項目にカーソルを合わせると、詳細な説明が表示されます。
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Tabs defaultValue="display" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette size={16} />
            <span>表示設定</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span>通知設定</span>
          </TabsTrigger>
          <TabsTrigger value="pos" className="flex items-center gap-2">
            <ShoppingCart size={16} />
            <span>レジ操作</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock size={16} />
            <span>セキュリティ</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="display">
          <DisplayTab 
            displayOptions={displayOptions}
            themeColor={themeColor}
            handleDisplayOptionChange={handleDisplayOptionChange}
            setThemeColor={setThemeColor}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsTab 
            notificationOptions={notificationOptions}
            handleNotificationOptionChange={handleNotificationOptionChange}
          />
        </TabsContent>
        
        <TabsContent value="pos">
          <POSTab 
            posOptions={posOptions}
            handlePOSOptionChange={handlePOSOptionChange}
          />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityTab 
            securityOptions={securityOptions}
            handleSecurityOptionChange={handleSecurityOptionChange}
            setSecurityOptions={setSecurityOptions}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveSettings} size="lg" className="px-8 py-6 text-lg font-medium">
          すべての設定を保存
        </Button>
      </div>
    </div>
  );
};

export default Options;
