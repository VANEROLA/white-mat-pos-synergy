
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface StoreSearchPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedStore: string;
  setSelectedStore: (store: string) => void;
  sortField: "name" | "quantity" | "revenue" | null;
  sortOrder: "asc" | "desc";
  handleSort: (field: "name" | "quantity" | "revenue" | null) => void;
  handleResetFilters: () => void;
  categories: string[];
  stores: { id: number; name: string }[];
}

const StoreSearchPanel: React.FC<StoreSearchPanelProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStore,
  setSelectedStore,
  sortField,
  sortOrder,
  handleSort,
  handleResetFilters,
  categories,
  stores
}) => {
  return (
    <div className="mb-3">
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <div className="relative flex-grow">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="商品名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue placeholder="カテゴリ選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全てのカテゴリ</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedStore} 
            onValueChange={setSelectedStore}
          >
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue placeholder="店舗選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全ての店舗</SelectItem>
              {stores.map(store => (
                <SelectItem key={store.id} value={store.name}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                <Filter className="h-3 w-3" />
                <span className="text-xs">並び替え</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1">
              <div className="space-y-1">
                <Button 
                  variant={sortField === "name" ? "default" : "ghost"} 
                  size="sm" 
                  className="w-full justify-start text-xs h-8" 
                  onClick={() => handleSort("name")}
                >
                  商品名 {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
                <Button 
                  variant={sortField === "quantity" ? "default" : "ghost"} 
                  size="sm" 
                  className="w-full justify-start text-xs h-8" 
                  onClick={() => handleSort("quantity")}
                >
                  数量 {sortField === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
                <Button 
                  variant={sortField === "revenue" ? "default" : "ghost"} 
                  size="sm" 
                  className="w-full justify-start text-xs h-8" 
                  onClick={() => handleSort("revenue")}
                >
                  売上 {sortField === "revenue" && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {(searchQuery || selectedCategory !== "all" || selectedStore !== "all") && (
        <div className="text-xs text-muted-foreground mb-2">
          適用フィルター: 
          {searchQuery && `検索: ${searchQuery}`} 
          {selectedCategory !== "all" && (searchQuery ? ` / カテゴリ: ${selectedCategory}` : `カテゴリ: ${selectedCategory}`)} 
          {selectedStore !== "all" && ((searchQuery || selectedCategory !== "all") ? ` / 店舗: ${selectedStore}` : `店舗: ${selectedStore}`)} {" "}
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-5 px-1 text-xs">
            リセット
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoreSearchPanel;
