
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StaffInfoSectionProps {
  staffName: string;
  setStaffName: (name: string) => void;
}

const StaffInfoSection: React.FC<StaffInfoSectionProps> = ({
  staffName,
  setStaffName
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="staff-name">担当者ID</Label>
      <Input
        id="staff-name"
        value={staffName}
        onChange={(e) => setStaffName(e.target.value)}
        placeholder="担当者IDを入力"
      />
    </div>
  );
};

export default StaffInfoSection;
