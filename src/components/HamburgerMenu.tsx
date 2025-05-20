
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
      className={cn("relative", className)}
      onClick={toggleMenu}
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
    >
      {isOpen ? (
        <X className="h-4 w-4" />
      ) : (
        <Menu className="h-4 w-4" />
      )}
    </Button>
  );
};

export default HamburgerMenu;
