
import React, { createContext, useContext, ReactNode } from "react";
import { useOptionsState } from "@/hooks/useOptionsState";
import type { DisplayOptions, NotificationOptions, POSOptions, SecurityOptions } from "@/hooks/useOptionsState";

interface OptionsContextType {
  displayOptions: DisplayOptions;
  notificationOptions: NotificationOptions;
  posOptions: POSOptions;
  securityOptions: SecurityOptions;
  themeColor: string;
  setThemeColor: (value: string) => void;
  handleDisplayOptionChange: (key: keyof DisplayOptions) => void;
  handleNotificationOptionChange: (key: keyof NotificationOptions) => void;
  handlePOSOptionChange: (key: keyof POSOptions) => void;
  handleSecurityOptionChange: (key: keyof SecurityOptions) => void;
  setSecurityOptions: React.Dispatch<React.SetStateAction<SecurityOptions>>;
  handleSaveSettings: () => void;
}

const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

export const OptionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const optionsState = useOptionsState();

  return (
    <OptionsContext.Provider value={optionsState}>
      {children}
    </OptionsContext.Provider>
  );
};

export const useOptions = (): OptionsContextType => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error("useOptions must be used within an OptionsProvider");
  }
  return context;
};
