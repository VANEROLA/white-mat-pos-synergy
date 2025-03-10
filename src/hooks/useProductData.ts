
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { toast } from "sonner";

export const useProductData = (searchQuery: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    try {
      const sampleProductsJson = localStorage.getItem("sampleProducts");
      let sampleProducts: Product[] = [];
      
      if (sampleProductsJson) {
        sampleProducts = JSON.parse(sampleProductsJson);
      } else {
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
        localStorage.setItem("sampleProducts", JSON.stringify(SAMPLE_PRODUCTS));
        sampleProducts = SAMPLE_PRODUCTS;
      }
      
      const userProductsJson = localStorage.getItem("products");
      const userProducts: Product[] = userProductsJson ? JSON.parse(userProductsJson) : [];
      
      const allProducts = [...sampleProducts, ...userProducts];
      setProducts(allProducts);
      
      if (!searchQuery) {
        setFilteredProducts(allProducts);
      } else {
        const query = searchQuery.toLowerCase();
        setFilteredProducts(
          allProducts.filter(
            product => 
              product.name.toLowerCase().includes(query) || 
              product.category.toLowerCase().includes(query)
          )
        );
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("商品の読み込みに失敗しました");
    }
  };

  const groupProductsByCategory = (products: Product[]): Record<string, Product[]> => {
    return products.reduce<Record<string, Product[]>>((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {});
  };

  useEffect(() => {
    loadProducts();
  }, [searchQuery]);

  const categories = groupProductsByCategory(filteredProducts);
  const categoryNames = Object.keys(categories);

  return {
    products,
    filteredProducts,
    categories,
    categoryNames,
    loadProducts
  };
};
