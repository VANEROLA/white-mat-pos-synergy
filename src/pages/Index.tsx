
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import POSHeader from "@/components/POSHeader";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import SearchPanel from "@/components/SearchPanel";
import ProductGrid from "@/components/ProductGrid";
import { useProductData } from "@/hooks/useProductData";
import { useCart } from "@/hooks/useCart";

interface IndexProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

const Index: React.FC<IndexProps> = ({ toggleMenu, isMenuOpen }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  const { 
    filteredProducts, 
    categories, 
    categoryNames, 
    loadProducts 
  } = useProductData(searchQuery);
  
  const { 
    cart, 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    handleAddToCart, 
    handleUpdateQuantity, 
    handleRemoveFromCart, 
    handleCheckout, 
    handleCompleteCheckout,
    setOrderToFree,
    isFreeOrder,
    handleApplyFreeItems
  } = useCart();
  
  const handleAddProductClick = () => {
    navigate('/add-product');
  };
  
  const onCompleteCheckout = () => {
    handleCompleteCheckout();
    loadProducts();
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <POSHeader 
            toggleMenu={toggleMenu} 
            isMenuOpen={isMenuOpen} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 glass rounded-xl p-6 animate-fade-in">
            <SearchPanel 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleAddProductClick={handleAddProductClick}
            />
            
            <ProductGrid 
              filteredProducts={filteredProducts}
              categories={categories}
              categoryNames={categoryNames}
              handleAddToCart={handleAddToCart}
            />
          </div>
          
          <div className="lg:col-span-1">
            <Cart
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onCheckout={handleCheckout}
              onApplyFreeItems={handleApplyFreeItems}
            />
          </div>
        </div>
      </div>
      
      <Checkout
        open={isCheckoutOpen}
        cart={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={onCompleteCheckout}
        isFreeOrder={isFreeOrder}
      />
    </div>
  );
};

export default Index;
