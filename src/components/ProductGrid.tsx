
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
  );
};

export default ProductGrid;
