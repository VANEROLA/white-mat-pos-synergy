
import React, { useState } from "react";
import { HeaderSection } from "@/components/options/HeaderSection";
import { TabsSection } from "@/components/options/TabsSection";
import { SaveSettingsButton } from "@/components/options/SaveSettingsButton";
import SidebarMenu from "@/components/SidebarMenu";

export const OptionsLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
      
      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        toggleMenu={toggleMenu}
      />
      
      <TabsSection />
      
      <SaveSettingsButton />
    </div>
  );
};
