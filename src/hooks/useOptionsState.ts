
import { useState, useEffect } from "react";
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

// Load settings from localStorage
const loadSettings = <T extends object>(key: string, defaultValue: T): T => {
  try {
    const savedSettings = localStorage.getItem(key);
    return savedSettings ? JSON.parse(savedSettings) : defaultValue;
  } catch (error) {
    console.error(`Error loading settings for ${key}:`, error);
    return defaultValue;
  }
};

export function useOptionsState() {
  // 表示設定のオプション
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>(() => 
    loadSettings('displayOptions', {
      darkMode: false,
      showProductImages: true,
      largeText: false,
      compactMode: false,
      highContrastMode: false,
      animationsEnabled: true
    })
  );

  // 通知設定のオプション
  const [notificationOptions, setNotificationOptions] = useState<NotificationOptions>(() =>
    loadSettings('notificationOptions', {
      enableNotifications: true,
      soundEnabled: true,
      showLowStockAlerts: true,
      showOrderCompletionAlerts: true,
      vibrateOnAlert: false,
      emailNotifications: false
    })
  );

  // レジ操作のオプション
  const [posOptions, setPosOptions] = useState<POSOptions>(() =>
    loadSettings('posOptions', {
      quickCheckout: false,
      confirmBeforeRemove: true,
      showLastOrderSummary: true,
      autoSaveCart: true,
      clearCartAfterCheckout: true,
      showTaxBreakdown: false,
      requireStaffIdForDiscounts: true
    })
  );

  // セキュリティ設定
  const [securityOptions, setSecurityOptions] = useState<SecurityOptions>(() =>
    loadSettings('securityOptions', {
      autoLockScreen: false,
      autoLockTimeout: 5,
      requirePinForRefunds: true,
      showActivityLogs: true,
      allowBiometricAuth: false
    })
  );

  // テーマカラーの選択
  const [themeColor, setThemeColor] = useState(() => 
    localStorage.getItem('themeColor') || "blue"
  );

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('displayOptions', JSON.stringify(displayOptions));
  }, [displayOptions]);

  useEffect(() => {
    localStorage.setItem('notificationOptions', JSON.stringify(notificationOptions));
  }, [notificationOptions]);

  useEffect(() => {
    localStorage.setItem('posOptions', JSON.stringify(posOptions));
  }, [posOptions]);

  useEffect(() => {
    localStorage.setItem('securityOptions', JSON.stringify(securityOptions));
  }, [securityOptions]);

  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
    document.documentElement.style.setProperty('--primary-color', `var(--${themeColor}-500)`);
    document.documentElement.style.setProperty('--primary-color-dark', `var(--${themeColor}-600)`);
    document.documentElement.style.setProperty('--primary-color-light', `var(--${themeColor}-400)`);
  }, [themeColor]);

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
    // 設定を永続化（すでにuseEffectで実装済み）
    // 追加の処理が必要な場合はここに追加
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
