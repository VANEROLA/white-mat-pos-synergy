
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HamburgerMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  className?: string;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, toggleMenu, className }) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={cn("relative p-2 focus:outline-none", className)}
      onClick={toggleMenu}
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </Button>
  );
};

export default HamburgerMenu;
