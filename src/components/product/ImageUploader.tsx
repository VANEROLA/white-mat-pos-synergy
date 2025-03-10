
import React, { useState } from "react";
import { ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  imagePreview: string | null;
  onFileChange: (file: File) => void;
  error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  imagePreview, 
  onFileChange, 
  error 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.match('image.*')) {
        toast.error("画像ファイルのみアップロードできます");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("画像サイズは5MB以下にしてください");
        return;
      }

      onFileChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center">
        <ImageIcon size={16} className="mr-1.5" />
        商品画像 <span className="text-red-500 ml-1">*</span>
      </label>
      
      <div className="space-y-3">
        {imagePreview && (
          <div className="mt-2 relative w-40 h-40 mx-auto border rounded-md overflow-hidden">
            <img 
              src={imagePreview} 
              alt="プレビュー" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className={`relative border-2 ${error ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors`}>
          <div className="flex flex-col items-center justify-center py-5 px-4">
            <Upload size={24} className="text-gray-500 mb-2" />
            <p className="text-sm text-gray-600 mb-2">クリックして画像をアップロード</p>
            <p className="text-xs text-gray-500">JPG, PNG, GIF (最大5MB)</p>
          </div>
          
          <label className="absolute inset-0 cursor-pointer flex items-center justify-center">
            <input 
              type="file" 
              className="sr-only" 
              onChange={handleFileChange}
              accept="image/*"
            />
            <span className="sr-only">ファイルを選択</span>
          </label>
        </div>
        
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUploader;
