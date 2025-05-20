
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Bell, Volume2, AlertTriangle, CheckCheck, Vibrate, Mail } from "lucide-react";
import { SettingRow } from "./SettingRow";

interface NotificationsTabProps {
  notificationOptions: {
    enableNotifications: boolean;
    soundEnabled: boolean;
    showLowStockAlerts: boolean;
    showOrderCompletionAlerts: boolean;
    vibrateOnAlert: boolean;
    emailNotifications: boolean;
  };
  handleNotificationOptionChange: (key: keyof typeof notificationOptions) => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notificationOptions,
  handleNotificationOptionChange
}) => {
  return (
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
  );
};
