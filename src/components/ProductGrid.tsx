
import React, { useMemo } from "react";
import { Tab } from "@headlessui/react";
import { Product } from "@/types";
import { cn } from "@/lib/utils";
import ProductItem from "@/components/ProductItem";

interface ProductGridProps {
  filteredProducts: Product[];
  categories: Record<string, Product[]>;
  categoryNames: string[];
  handleAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  filteredProducts,
  categories,
  categoryNames,
  handleAddToCart,
}) => {
  // Function to determine optimal grid columns based on item count
  const getOptimalGridClass = (itemCount: number) => {
    if (itemCount <= 2) return "grid-cols-2";
    if (itemCount <= 3) return "grid-cols-3";
    if (itemCount <= 4) return "grid-cols-4";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5";
  };

  // Memoize the grid class for "all" products
  const allProductsGridClass = useMemo(() => 
    getOptimalGridClass(filteredProducts.length), 
    [filteredProducts.length]
  );

  // Memoize grid classes for each category
  const categoryGridClasses = useMemo(() => {
    const classes: Record<string, string> = {};
    
    categoryNames.forEach(category => {
      classes[category] = getOptimalGridClass(categories[category].length);
    });
    
    return classes;
  }, [categories, categoryNames]);

  if (categoryNames.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>商品が見つかりませんでした</p>
        <p className="text-sm">検索条件を変更してお試しください</p>
      </div>
    );
  }

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <Tab
          key="all"
          className={({ selected }) =>
            cn(
              "px-6 py-2 rounded-md text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap border",
              selected
                ? "bg-white text-foreground border-gray-200 shadow-sm"
                : "bg-white/80 text-muted-foreground hover:bg-white/90 border-gray-100"
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
                "px-6 py-2 rounded-md text-sm font-medium transition-all flex-shrink-0 whitespace-nowrap border",
                selected
                  ? "bg-white text-foreground border-gray-200 shadow-sm"
                  : "bg-white/80 text-muted-foreground hover:bg-white/90 border-gray-100"
              )
            }
          >
            {category}
          </Tab>
        ))}
      </Tab.List>
      
      <Tab.Panels>
        <Tab.Panel key="all">
          <div className={`grid gap-3 md:gap-4 ${allProductsGridClass}`}>
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
            <div className={`grid gap-3 md:gap-4 ${categoryGridClasses[category]}`}>
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
  );
};

export default ProductGrid;
