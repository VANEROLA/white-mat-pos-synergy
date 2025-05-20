
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Lock, RefreshCw, FileText, Fingerprint } from "lucide-react";
import { SettingRow } from "./SettingRow";
import { AutoLockTimeSelector } from "./AutoLockTimeSelector";
import { Separator } from "@/components/ui/separator";

interface SecurityTabProps {
  securityOptions: {
    autoLockScreen: boolean;
    autoLockTimeout: number;
    requirePinForRefunds: boolean;
    showActivityLogs: boolean;
    allowBiometricAuth: boolean;
  };
  handleSecurityOptionChange: (key: keyof typeof securityOptions) => void;
  setSecurityOptions: React.Dispatch<React.SetStateAction<typeof securityOptions>>;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  securityOptions,
  handleSecurityOptionChange,
  setSecurityOptions
}) => {
  return (
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
          <AutoLockTimeSelector 
            autoLockTimeout={securityOptions.autoLockTimeout}
            onChange={(minutes) => setSecurityOptions(prev => ({ ...prev, autoLockTimeout: minutes }))}
          />
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
  );
};
