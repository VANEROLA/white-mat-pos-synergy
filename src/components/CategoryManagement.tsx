
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load categories from localStorage
  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("カテゴリー名を入力してください");
      return;
    }

    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast.error("このカテゴリーは既に存在します");
      return;
    }

    const newCategoryItem: Category = {
      id: `CAT-${Date.now()}`,
      name: newCategory.trim()
    };

    setCategories([...categories, newCategoryItem]);
    setNewCategory("");
    toast.success("カテゴリーを追加しました");
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    
    if (!editingCategory.name.trim()) {
      toast.error("カテゴリー名を入力してください");
      return;
    }

    // Check if category name already exists (excluding the current one)
    if (categories.some(cat => 
      cat.id !== editingCategory.id && 
      cat.name.toLowerCase() === editingCategory.name.trim().toLowerCase()
    )) {
      toast.error("このカテゴリー名は既に存在します");
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    
    setEditingCategory(null);
    toast.success("カテゴリーを更新しました");
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Check if any products are using this category
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const categoryInUse = allProducts.some((product: any) => 
      product.category.toLowerCase() === categories.find(c => c.id === categoryId)?.name.toLowerCase()
    );

    if (categoryInUse) {
      toast.error("このカテゴリーは商品で使用されているため削除できません");
      return;
    }

    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success("カテゴリーを削除しました");
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">
            <Plus size={16} className="mr-1" />
            カテゴリー管理
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>カテゴリー管理</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {/* Add new category */}
            <div className="flex items-center space-x-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="新しいカテゴリー名"
                className="flex-1"
              />
              <Button onClick={handleAddCategory}>
                <Plus size={16} className="mr-1" />
                追加
              </Button>
            </div>
            
            {/* Categories list */}
            <div className="border rounded-md">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  カテゴリーがありません
                </div>
              ) : (
                <ul className="divide-y">
                  {categories.map((category) => (
                    <li key={category.id} className="p-3 flex justify-between items-center">
                      {editingCategory?.id === category.id ? (
                        <div className="flex flex-1 items-center space-x-2">
                          <Input
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleUpdateCategory}>
                            <Save size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>
                            <X size={16} />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span>{category.name}</span>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEditCategory(category)}>
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
