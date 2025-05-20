
import React, { useState, useEffect } from "react";
import { HeaderSection } from "@/components/options/HeaderSection";
import { TabsSection } from "@/components/options/TabsSection";
import { SaveSettingsButton } from "@/components/options/SaveSettingsButton";
import SidebarMenu from "@/components/SidebarMenu";
import { useOptions } from "@/contexts/OptionsContext";

export const OptionsLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { displayOptions } = useOptions();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Apply settings to document when they change
  useEffect(() => {
    // Apply dark mode
    if (displayOptions.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-950', 'text-white');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-gray-950', 'text-white');
    }

    // Apply large text
    if (displayOptions.largeText) {
      document.documentElement.classList.add('text-lg');
    } else {
      document.documentElement.classList.remove('text-lg');
    }

    // Apply high contrast mode
    if (displayOptions.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply compact mode
    if (displayOptions.compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }
  }, [displayOptions]);

  return (
    <div className={`container mx-auto py-6 px-4 md:px-6 max-w-6xl ${displayOptions.largeText ? 'text-lg' : ''}`}>
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
