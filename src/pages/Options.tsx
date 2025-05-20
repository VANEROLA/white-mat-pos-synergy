
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import { toast } from "sonner";
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Image, 
  TextSize, 
  Smartphone, 
  Contrast, 
  MonitorSmartphone,
  Bell, 
  Volume2, 
  AlertTriangle, 
  CheckCheck, 
  Vibrate, 
  Mail,
  Zap, 
  AlertCircle,
  Receipt, 
  Save, 
  ShoppingCart, 
  FileText,
  UserCog,
  Lock, 
  Clock, 
  RefreshCw, 
  Fingerprint,
  Info,
  Palette
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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

  const ColorOption = ({ color, name }: { color: string; name: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem 
            value={color} 
            className={`bg-${color}-500 hover:bg-${color}-600 h-8 w-8 mr-2 rounded-full transition-transform hover:scale-110`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}テーマ</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const SettingRow = ({ 
    icon, 
    label, 
    checked, 
    onChange, 
    disabled = false,
    description,
    tooltipText
  }: { 
    icon: React.ReactNode;
    label: string;
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
    description?: string;
    tooltipText: string;
  }) => (
    <div className="group">
      <div className="flex items-center justify-between py-3 transition-colors hover:bg-accent/20 px-3 rounded-lg">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center space-x-4 cursor-help">
              <div className={`p-2 rounded-full ${checked ? 'bg-primary/10' : 'bg-muted'}`}>
                {icon}
              </div>
              <div>
                <Label htmlFor={label} className="text-base font-medium">{label}</Label>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{label}</h4>
              <p className="text-sm text-muted-foreground">
                {tooltipText}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
        
        <Switch 
          id={label} 
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      <Separator />
    </div>
  );

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMenu}
            className="mr-3"
            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
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
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg pb-6">
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} className="text-primary" />
                表示設定
              </CardTitle>
              <CardDescription>
                アプリケーションの外観と表示方法をカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SettingRow
                icon={<Moon size={18} className="text-indigo-600" />}
                label="ダークモード"
                checked={displayOptions.darkMode}
                onChange={() => handleDisplayOptionChange('darkMode')}
                tooltipText="画面の明るさを抑え、暗い環境での使用に適した表示モードに切り替えます。目の疲れを軽減し、バッテリー消費も抑えられます。"
              />
              
              <SettingRow
                icon={<Image size={18} className="text-emerald-600" />}
                label="商品画像を表示"
                checked={displayOptions.showProductImages}
                onChange={() => handleDisplayOptionChange('showProductImages')}
                tooltipText="商品一覧やカート内に商品の画像を表示します。視覚的に商品を識別しやすくなりますが、オフにすると表示速度が向上します。"
              />
              
              <SettingRow
                icon={<TextSize size={18} className="text-amber-600" />}
                label="大きいテキスト"
                checked={displayOptions.largeText}
                onChange={() => handleDisplayOptionChange('largeText')}
                tooltipText="アプリ全体のフォントサイズを大きくします。視認性が向上しますが、一画面に表示できる情報量は減少します。"
              />
              
              <SettingRow
                icon={<Smartphone size={18} className="text-rose-600" />}
                label="コンパクトモード"
                checked={displayOptions.compactMode}
                onChange={() => handleDisplayOptionChange('compactMode')}
                tooltipText="余白を減らし、より多くの情報を画面に表示します。小さな画面のデバイスに最適ですが、タッチ操作の精度が求められます。"
              />
              
              <SettingRow
                icon={<Contrast size={18} className="text-purple-600" />}
                label="ハイコントラストモード"
                checked={displayOptions.highContrastMode}
                onChange={() => handleDisplayOptionChange('highContrastMode')}
                tooltipText="テキストと背景のコントラストを高め、視認性を向上させます。視覚障害のある方や明るい環境での使用に適しています。"
              />
              
              <SettingRow
                icon={<MonitorSmartphone size={18} className="text-cyan-600" />}
                label="アニメーションを有効化"
                checked={displayOptions.animationsEnabled}
                onChange={() => handleDisplayOptionChange('animationsEnabled')}
                tooltipText="画面遷移やボタン操作時のアニメーション効果を制御します。オフにするとパフォーマンスが向上し、より素早い操作が可能になります。"
              />
              
              <div className="mt-6 mb-3">
                <Label className="text-base font-medium mb-3 block">テーマカラー</Label>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    アプリ全体のアクセントカラーを選択します。UIの主要な部分に適用されます。
                  </p>
                  <ToggleGroup 
                    type="single" 
                    value={themeColor}
                    onValueChange={(value) => {
                      if (value) {
                        setThemeColor(value);
                        toast.success(`テーマカラーを${value}に変更しました`);
                      }
                    }}
                    className="flex flex-wrap gap-2"
                  >
                    <ColorOption color="blue" name="ブルー" />
                    <ColorOption color="green" name="グリーン" />
                    <ColorOption color="purple" name="パープル" />
                    <ColorOption color="rose" name="ローズ" />
                    <ColorOption color="amber" name="アンバー" />
                    <ColorOption color="teal" name="ティール" />
                    <ColorOption color="indigo" name="インディゴ" />
                    <ColorOption color="pink" name="ピンク" />
                  </ToggleGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg pb-6">
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-emerald-600" />
                通知設定
              </CardTitle>
              <CardDescription>
                通知の受け取り方と表示方法をカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SettingRow
                icon={<Bell size={18} className="text-emerald-600" />}
                label="通知を有効化"
                checked={notificationOptions.enableNotifications}
                onChange={() => handleNotificationOptionChange('enableNotifications')}
                tooltipText="システムからの重要な通知を受け取ります。在庫不足や注文完了など、業務に関わる情報をリアルタイムで確認できます。"
              />
              
              <SettingRow
                icon={<Volume2 size={18} className="text-emerald-600" />}
                label="通知音"
                checked={notificationOptions.soundEnabled}
                onChange={() => handleNotificationOptionChange('soundEnabled')}
                disabled={!notificationOptions.enableNotifications}
                description="通知時にサウンドを再生します"
                tooltipText="通知が届いたときに音で知らせます。騒がしい環境でも通知を見逃さないようにできますが、静かな環境では無効にすることをお勧めします。"
              />
              
              <SettingRow
                icon={<AlertTriangle size={18} className="text-amber-600" />}
                label="在庫不足アラート"
                checked={notificationOptions.showLowStockAlerts}
                onChange={() => handleNotificationOptionChange('showLowStockAlerts')}
                disabled={!notificationOptions.enableNotifications}
                description="商品の在庫が少なくなったときに通知します"
                tooltipText="商品の在庫が設定した閾値を下回ったときに通知します。在庫切れになる前に補充の手配ができるようになります。"
              />
              
              <SettingRow
                icon={<CheckCheck size={18} className="text-green-600" />}
                label="注文完了通知"
                checked={notificationOptions.showOrderCompletionAlerts}
                onChange={() => handleNotificationOptionChange('showOrderCompletionAlerts')}
                disabled={!notificationOptions.enableNotifications}
                description="注文処理が完了したときに通知します"
                tooltipText="注文が完了したときに通知を表示します。複数のスタッフが同時に操作する環境で、誰かが処理を完了したことをリアルタイムで知ることができます。"
              />
              
              <SettingRow
                icon={<Vibrate size={18} className="text-purple-600" />}
                label="振動を有効化"
                checked={notificationOptions.vibrateOnAlert}
                onChange={() => handleNotificationOptionChange('vibrateOnAlert')}
                disabled={!notificationOptions.enableNotifications}
                description="通知時に端末を振動させます"
                tooltipText="通知が届いたときに端末を振動させます。音が出せない環境でも通知に気づきやすくなりますが、対応デバイスでのみ機能します。"
              />
              
              <SettingRow
                icon={<Mail size={18} className="text-blue-600" />}
                label="メール通知"
                checked={notificationOptions.emailNotifications}
                onChange={() => handleNotificationOptionChange('emailNotifications')}
                disabled={!notificationOptions.enableNotifications}
                description="重要な通知をメールでも受け取ります"
                tooltipText="重要な通知を登録されたメールアドレスにも送信します。システムから離れているときでも重要な情報を見逃しません。"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pos">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg pb-6">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-amber-600" />
                レジ操作設定
              </CardTitle>
              <CardDescription>
                レジ操作の挙動と表示をカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SettingRow
                icon={<Zap size={18} className="text-amber-600" />}
                label="クイックチェックアウト"
                checked={posOptions.quickCheckout}
                onChange={() => handlePOSOptionChange('quickCheckout')}
                tooltipText="確認画面をスキップして素早くチェックアウトできるようにします。操作ステップが減る分、確認ミスのリスクは高まるため、慣れたスタッフ向けの設定です。"
              />
              
              <SettingRow
                icon={<AlertCircle size={18} className="text-rose-600" />}
                label="削除前に確認"
                checked={posOptions.confirmBeforeRemove}
                onChange={() => handlePOSOptionChange('confirmBeforeRemove')}
                tooltipText="カートから商品を削除する前に確認ダイアログを表示します。誤操作による商品の削除を防ぎますが、操作ステップは増加します。"
              />
              
              <SettingRow
                icon={<Receipt size={18} className="text-purple-600" />}
                label="前回の注文サマリーを表示"
                checked={posOptions.showLastOrderSummary}
                onChange={() => handlePOSOptionChange('showLastOrderSummary')}
                tooltipText="新しい注文を開始したとき、直前の注文内容のサマリーを表示します。続けて同じような注文を受ける場合に便利です。"
              />
              
              <SettingRow
                icon={<Save size={18} className="text-blue-600" />}
                label="カートを自動保存"
                checked={posOptions.autoSaveCart}
                onChange={() => handlePOSOptionChange('autoSaveCart')}
                tooltipText="カートの内容を自動的に保存し、予期せぬシステム再起動やブラウザの更新があっても内容を復元できるようにします。"
              />
              
              <SettingRow
                icon={<ShoppingCart size={18} className="text-emerald-600" />}
                label="チェックアウト後にカートをクリア"
                checked={posOptions.clearCartAfterCheckout}
                onChange={() => handlePOSOptionChange('clearCartAfterCheckout')}
                tooltipText="注文完了後、カートを自動的に空にします。連続して異なる注文を処理する場合に便利ですが、同じような注文が続く場合は無効にするとよいでしょう。"
              />
              
              <SettingRow
                icon={<FileText size={18} className="text-indigo-600" />}
                label="税金内訳を表示"
                checked={posOptions.showTaxBreakdown}
                onChange={() => handlePOSOptionChange('showTaxBreakdown')}
                tooltipText="レシートや注文確認画面に税金の詳細な内訳を表示します。税率の違う商品が混在する場合に特に役立ちます。"
              />
              
              <SettingRow
                icon={<UserCog size={18} className="text-cyan-600" />}
                label="割引にスタッフIDを要求"
                checked={posOptions.requireStaffIdForDiscounts}
                onChange={() => handlePOSOptionChange('requireStaffIdForDiscounts')}
                tooltipText="割引を適用する際にスタッフIDの入力を要求します。不正な割引の適用を防ぎ、誰がいつ割引を行ったかを記録します。"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg pb-6">
              <CardTitle className="flex items-center gap-2">
                <Lock size={20} className="text-slate-600" />
                セキュリティ設定
              </CardTitle>
              <CardDescription>
                セキュリティと認証のオプションをカスタマイズします
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SettingRow
                icon={<Lock size={18} className="text-slate-600" />}
                label="画面自動ロック"
                checked={securityOptions.autoLockScreen}
                onChange={() => handleSecurityOptionChange('autoLockScreen')}
                tooltipText="一定時間操作がない場合、自動的に画面をロックします。不在時に第三者による不正操作を防止します。"
              />
              
              {securityOptions.autoLockScreen && (
                <div className="pl-6 ml-4 border-l-2 border-muted py-4">
                  <Label htmlFor="lock-timeout" className="text-base font-medium mb-3 block">自動ロックまでの時間（分）</Label>
                  <div className="flex gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={securityOptions.autoLockTimeout === 1 ? "default" : "outline"} 
                            onClick={() => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: 1 }))}
                            className="w-16 h-10"
                          >
                            1分
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>最短の自動ロック時間です。セキュリティを最も重視する設定です。</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={securityOptions.autoLockTimeout === 5 ? "default" : "outline"}
                            onClick={() => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: 5 }))}
                            className="w-16 h-10"
                          >
                            5分
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>バランスの取れた自動ロック時間です。多くの状況で推奨されます。</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={securityOptions.autoLockTimeout === 10 ? "default" : "outline"}
                            onClick={() => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: 10 }))}
                            className="w-16 h-10"
                          >
                            10分
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>長めの自動ロック時間です。信頼できる環境での使用に適しています。</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant={securityOptions.autoLockTimeout === 30 ? "default" : "outline"}
                            onClick={() => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: 30 }))}
                            className="w-16 h-10"
                          >
                            30分
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>最も長い自動ロック時間です。安全な環境での使用に適しています。</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="mt-3 text-sm text-muted-foreground flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>操作がない場合、{securityOptions.autoLockTimeout}分後に画面がロックされます</span>
                  </div>
                </div>
              )}
              <Separator className="my-2" />
              
              <SettingRow
                icon={<RefreshCw size={18} className="text-red-600" />}
                label="返金処理にPINを要求"
                checked={securityOptions.requirePinForRefunds}
                onChange={() => handleSecurityOptionChange('requirePinForRefunds')}
                tooltipText="返金処理を行う際に認証PINの入力を要求します。不正な返金処理を防止し、権限のあるスタッフのみが返金できるようにします。"
              />
              
              <SettingRow
                icon={<FileText size={18} className="text-blue-600" />}
                label="アクティビティログを表示"
                checked={securityOptions.showActivityLogs}
                onChange={() => handleSecurityOptionChange('showActivityLogs')}
                tooltipText="システム内で行われたすべての重要な操作の記録を表示します。誰がいつどのような操作を行ったかを追跡できます。"
              />
              
              <SettingRow
                icon={<Fingerprint size={18} className="text-purple-600" />}
                label="生体認証を許可"
                checked={securityOptions.allowBiometricAuth}
                onChange={() => handleSecurityOptionChange('allowBiometricAuth')}
                tooltipText="指紋認証やFace IDなどの生体認証を使用したログインを許可します。パスワード入力より素早く安全にログインできますが、対応デバイスが必要です。"
              />
            </CardContent>
          </Card>
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
