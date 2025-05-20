
import React, { useState } from "react";
import { useOptionsState } from "@/hooks/useOptionsState";
import { HeaderSection } from "@/components/options/HeaderSection";
import { TabsSection } from "@/components/options/TabsSection";
import { SaveSettingsButton } from "@/components/options/SaveSettingsButton";

const Options: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const {
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
  } = useOptionsState();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 max-w-6xl">
      <HeaderSection 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        closeMenu={closeMenu} 
      />
      
      <TabsSection
        displayOptions={displayOptions}
        notificationOptions={notificationOptions}
        posOptions={posOptions}
        securityOptions={securityOptions}
        themeColor={themeColor}
        handleDisplayOptionChange={handleDisplayOptionChange}
        handleNotificationOptionChange={handleNotificationOptionChange}
        handlePOSOptionChange={handlePOSOptionChange}
        handleSecurityOptionChange={handleSecurityOptionChange}
        setThemeColor={setThemeColor}
        setSecurityOptions={setSecurityOptions}
      />
      
      <SaveSettingsButton onSave={handleSaveSettings} />
    </div>
  );
};

export default Options;
