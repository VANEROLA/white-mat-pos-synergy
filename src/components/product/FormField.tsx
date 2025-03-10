
import React from "react";
import { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: LucideIcon;
  error?: string;
  required?: boolean;
  type?: string;
  min?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  type = "text",
  min,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 flex items-center">
        <Icon size={16} className="mr-1.5" />
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        min={min}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
