
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
      size="icon"
      className={cn("flex items-center justify-center", className)}
      onClick={toggleMenu}
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
    </Button>
  );
};

export default HamburgerMenu;
