
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShoppingCart, Zap, AlertCircle, Receipt, Save, FileText, UserCog } from "lucide-react";
import { SettingRow } from "./SettingRow";

interface POSTabProps {
  posOptions: {
    quickCheckout: boolean;
    confirmBeforeRemove: boolean;
    showLastOrderSummary: boolean;
    autoSaveCart: boolean;
    clearCartAfterCheckout: boolean;
    showTaxBreakdown: boolean;
    requireStaffIdForDiscounts: boolean;
  };
  handlePOSOptionChange: (key: keyof typeof posOptions) => void;
}

export const POSTab: React.FC<POSTabProps> = ({
  posOptions,
  handlePOSOptionChange
}) => {
  return (
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
  );
};
