
import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleAddProductClick: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  searchQuery,
  setSearchQuery,
  handleAddProductClick,
}) => {
  return (
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
        
        <Button size="sm" variant="outline" onClick={handleAddProductClick}>
          <Plus size={16} className="mr-1" /> 商品追加
        </Button>
      </div>
    </div>
  );
};

export default SearchPanel;
