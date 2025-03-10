
import React from "react";
import { Tag } from "lucide-react";
import { Category } from "@/components/CategoryManagement";

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  value,
  onChange,
  error,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center">
        <Tag size={16} className="mr-1.5" />
        カテゴリー <span className="text-red-500 ml-1">*</span>
      </label>
      <select
        name="category"
        value={value}
        onChange={onChange}
        className={`flex h-10 w-full rounded-md border ${error ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
      >
        <option value="">カテゴリーを選択</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CategorySelect;
