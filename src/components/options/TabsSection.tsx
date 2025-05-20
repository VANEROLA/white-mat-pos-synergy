
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Bell, ShoppingCart, Lock } from "lucide-react";
import { DisplayTab } from "@/components/options/DisplayTab";
import { NotificationsTab } from "@/components/options/NotificationsTab";
import { POSTab } from "@/components/options/POSTab";
import { SecurityTab } from "@/components/options/SecurityTab";
import type { DisplayOptions, NotificationOptions, POSOptions, SecurityOptions } from "@/hooks/useOptionsState";

interface TabsSectionProps {
  displayOptions: DisplayOptions;
  notificationOptions: NotificationOptions;
  posOptions: POSOptions;
  securityOptions: SecurityOptions;
  themeColor: string;
  handleDisplayOptionChange: (key: keyof DisplayOptions) => void;
  handleNotificationOptionChange: (key: keyof NotificationOptions) => void;
  handlePOSOptionChange: (key: keyof POSOptions) => void;
  handleSecurityOptionChange: (key: keyof SecurityOptions) => void;
  setThemeColor: (value: string) => void;
  setSecurityOptions: React.Dispatch<React.SetStateAction<SecurityOptions>>;
}

export const TabsSection: React.FC<TabsSectionProps> = ({
  displayOptions,
  notificationOptions,
  posOptions,
  securityOptions,
  themeColor,
  handleDisplayOptionChange,
  handleNotificationOptionChange,
  handlePOSOptionChange,
  handleSecurityOptionChange,
  setThemeColor,
  setSecurityOptions
}) => {
  return (
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
  );
};
