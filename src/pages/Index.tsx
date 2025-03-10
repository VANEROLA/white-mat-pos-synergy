
import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { Product, CartState, CartItem } from "@/types";
import { cn } from "@/lib/utils";

import POSHeader from "@/components/POSHeader";
import ProductItem from "@/components/ProductItem";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

// Mock products data
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "カフェラテ",
    price: 480,
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80",
    category: "コーヒー",
    stockCount: 100
  },
  {
    id: "2",
    name: "カプチーノ",
    price: 450,
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=80",
    category: "コーヒー",
    stockCount: 80
  },
  {
    id: "3",
    name: "エスプレッソ",
    price: 380,
    imageUrl: "https://images.unsplash.com/photo-1596952954288-16862d37405d?w=500&auto=format&fit=crop&q=80",
    category: "コーヒー",
    stockCount: 120
  },
  {
    id: "4",
    name: "抹茶ラテ",
    price: 520,
    imageUrl: "https://images.unsplash.com/photo-1582198684221-9eb29d335c33?w=500&auto=format&fit=crop&q=80",
    category: "ティー",
    stockCount: 75
  },
  {
    id: "5",
    name: "ミルクティー",
    price: 420,
    imageUrl: "https://images.unsplash.com/photo-1592429929785-ba94aea023b1?w=500&auto=format&fit=crop&q=80",
    category: "ティー",
    stockCount: 90
  },
  {
    id: "6",
    name: "フルーツティー",
    price: 480,
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80",
    category: "ティー",
    stockCount: 60
  },
  {
    id: "7",
    name: "チョコレートケーキ",
    price: 580,
    imageUrl: "https://images.unsplash.com/photo-1565808229224-264b35aa092b?w=500&auto=format&fit=crop&q=80",
    category: "ケーキ",
    stockCount: 40
  },
  {
    id: "8",
    name: "チーズケーキ",
    price: 560,
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&auto=format&fit=crop&q=80",
    category: "ケーキ",
    stockCount: 35
  },
  {
    id: "9",
    name: "クロワッサン",
    price: 280,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
    category: "ベーカリー",
    stockCount: 50
  },
  {
    id: "10",
    name: "パニーニ",
    price: 650,
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop&q=80",
    category: "サンドイッチ",
    stockCount: 30
  },
  {
    id: "11",
    name: "アボカドトースト",
    price: 580,
    imageUrl: "https://images.unsplash.com/photo-1603046891744-1f058b8a8739?w=500&auto=format&fit=crop&q=80",
    category: "サンドイッチ",
    stockCount: 25
  },
  {
    id: "12",
    name: "フルーツサンド",
    price: 450,
    imageUrl: "https://images.unsplash.com/photo-1628294895290-192f6f73860e?w=500&auto=format&fit=crop&q=80",
    category: "サンドイッチ",
    stockCount: 40
  }
];

// Group products by category
const groupProductsByCategory = (products: Product[]): Record<string, Product[]> => {
  return products.reduce<Record<string, Product[]>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
};

const Index: React.FC = () => {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
  });
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  
  // Filter products when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);
  
  // Group products by category
  const categories = groupProductsByCategory(filteredProducts);
  const categoryNames = Object.keys(categories);
  
  // Cart Functions
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existingItemIndex = prev.items.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        
        const newTotal = calculateTotal(updatedItems);
        return { items: updatedItems, total: newTotal };
      } else {
        // Add new item
        const newItem: CartItem = { ...product, quantity: 1 };
        const newItems = [...prev.items, newItem];
        const newTotal = calculateTotal(newItems);
        return { items: newItems, total: newTotal };
      }
    });
    
    // Show toast notification
    toast.success(`${product.name}をカートに追加しました`);
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCart(prev => {
      const updatedItems = prev.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      const newTotal = calculateTotal(updatedItems);
      return { items: updatedItems, total: newTotal };
    });
  };
  
  const handleRemoveFromCart = (id: string) => {
    setCart(prev => {
      const updatedItems = prev.items.filter(item => item.id !== id);
      const newTotal = calculateTotal(updatedItems);
      return { items: updatedItems, total: newTotal };
    });
  };
  
  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error("カートに商品がありません");
      return;
    }
    
    setIsCheckoutOpen(true);
  };
  
  const handleCompleteCheckout = () => {
    setCart({ items: [], total: 0 });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <POSHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Product Section - 3/4 Width */}
          <div className="lg:col-span-3 glass rounded-xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">商品一覧</h2>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="商品名または分類を検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[250px] bg-white/50 backdrop-blur-sm border-muted"
                  />
                </div>
                
                <Button size="sm" variant="outline" onClick={() => setIsAddProductOpen(true)}>
                  <Plus size={16} className="mr-1" /> 商品追加
                </Button>
              </div>
            </div>
            
            {categoryNames.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>商品が見つかりませんでした</p>
                <p className="text-sm">検索条件を変更してお試しください</p>
              </div>
            ) : (
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-lg bg-muted/50 p-1 mb-6">
                  <Tab
                    key="all"
                    className={({ selected }) =>
                      cn(
                        "w-full rounded-md py-2 text-sm font-medium leading-5 transition-all",
                        "ring-white ring-opacity-60 ring-offset-2 focus:outline-none",
                        selected
                          ? "bg-white text-primary shadow"
                          : "text-muted-foreground hover:bg-white/[0.12] hover:text-foreground"
                      )
                    }
                  >
                    すべて
                  </Tab>
                  
                  {categoryNames.map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        cn(
                          "w-full rounded-md py-2 text-sm font-medium leading-5 transition-all",
                          "ring-white ring-opacity-60 ring-offset-2 focus:outline-none",
                          selected
                            ? "bg-white text-primary shadow"
                            : "text-muted-foreground hover:bg-white/[0.12] hover:text-foreground"
                        )
                      }
                    >
                      {category}
                    </Tab>
                  ))}
                </Tab.List>
                
                <Tab.Panels>
                  <Tab.Panel key="all">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.map((product) => (
                        <ProductItem
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  </Tab.Panel>
                  
                  {categoryNames.map((category) => (
                    <Tab.Panel key={category}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories[category].map((product) => (
                          <ProductItem
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                          />
                        ))}
                      </div>
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            )}
          </div>
          
          {/* Cart Section - 1/4 Width */}
          <div className="lg:col-span-1">
            <Cart
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
      
      {/* Checkout Dialog */}
      <Checkout
        open={isCheckoutOpen}
        cart={cart}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={handleCompleteCheckout}
      />
    </div>
  );
};

export default Index;
