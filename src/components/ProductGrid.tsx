
import React from "react";
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
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
