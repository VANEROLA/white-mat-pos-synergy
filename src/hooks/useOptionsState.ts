
import { useState } from "react";
import { toast } from "sonner";

export interface DisplayOptions {
  darkMode: boolean;
  showProductImages: boolean;
  largeText: boolean;
  compactMode: boolean;
  highContrastMode: boolean;
  animationsEnabled: boolean;
}

export interface NotificationOptions {
  enableNotifications: boolean;
  soundEnabled: boolean;
  showLowStockAlerts: boolean;
  showOrderCompletionAlerts: boolean;
  vibrateOnAlert: boolean;
  emailNotifications: boolean;
}

export interface POSOptions {
  quickCheckout: boolean;
  confirmBeforeRemove: boolean;
  showLastOrderSummary: boolean;
  autoSaveCart: boolean;
  clearCartAfterCheckout: boolean;
  showTaxBreakdown: boolean;
  requireStaffIdForDiscounts: boolean;
}

export interface SecurityOptions {
  autoLockScreen: boolean;
  autoLockTimeout: number;
  requirePinForRefunds: boolean;
  showActivityLogs: boolean;
  allowBiometricAuth: boolean;
}

export function useOptionsState() {
  // 表示設定のオプション
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    darkMode: false,
    showProductImages: true,
    largeText: false,
    compactMode: false,
    highContrastMode: false,
    animationsEnabled: true
  });

  // 通知設定のオプション
  const [notificationOptions, setNotificationOptions] = useState<NotificationOptions>({
    enableNotifications: true,
    soundEnabled: true,
    showLowStockAlerts: true,
    showOrderCompletionAlerts: true,
    vibrateOnAlert: false,
    emailNotifications: false
  });

  // レジ操作のオプション
  const [posOptions, setPosOptions] = useState<POSOptions>({
    quickCheckout: false,
    confirmBeforeRemove: true,
    showLastOrderSummary: true,
    autoSaveCart: true,
    clearCartAfterCheckout: true,
    showTaxBreakdown: false,
    requireStaffIdForDiscounts: true
  });

  // セキュリティ設定
  const [securityOptions, setSecurityOptions] = useState<SecurityOptions>({
    autoLockScreen: false,
    autoLockTimeout: 5,
    requirePinForRefunds: true,
    showActivityLogs: true,
    allowBiometricAuth: false
  });

  // テーマカラーの選択
  const [themeColor, setThemeColor] = useState("blue");

  const handleDisplayOptionChange = (key: keyof DisplayOptions) => {
    setDisplayOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key}の設定を変更しました`);
  };

  const handleNotificationOptionChange = (key: keyof NotificationOptions) => {
    setNotificationOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key}の設定を変更しました`);
  };

  const handlePOSOptionChange = (key: keyof POSOptions) => {
    setPosOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key}の設定を変更しました`);
  };

  const handleSecurityOptionChange = (key: keyof SecurityOptions) => {
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

  return {
    displayOptions,
    notificationOptions,
    posOptions,
    securityOptions,
    themeColor,
    setThemeColor,
    handleDisplayOptionChange,
    handleNotificationOptionChange,
    handlePOSOptionChange,
    handleSecurityOptionChange,
    setSecurityOptions,
    handleSaveSettings
  };
}
