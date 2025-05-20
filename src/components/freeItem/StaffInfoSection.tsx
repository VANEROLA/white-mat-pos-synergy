
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useStaffManagement } from "@/hooks/useStaffManagement";
import { AlertCircle, Check } from "lucide-react";

interface StaffInfoSectionProps {
  staffName: string;
  setStaffName: (name: string) => void;
}

const StaffInfoSection: React.FC<StaffInfoSectionProps> = ({
  staffName,
  setStaffName
}) => {
  const { isValidStaff, getStaffName } = useStaffManagement();
  const [isDirty, setIsDirty] = useState(false);
  const [staffDisplay, setStaffDisplay] = useState<string | null>(null);

  // Update validation when staff ID changes
  useEffect(() => {
    if (isDirty && staffName.trim()) {
      setStaffDisplay(getStaffName(staffName));
    } else {
      setStaffDisplay(null);
    }
  }, [staffName, isDirty, getStaffName]);

  return (
    <div className="grid gap-2">
      <Label htmlFor="staff-name">担当者ID</Label>
      <div className="relative">
        <Input
          id="staff-name"
          value={staffName}
          onChange={(e) => {
            setStaffName(e.target.value);
            if (!isDirty) setIsDirty(true);
          }}
          placeholder="担当者IDを入力"
          className={isDirty && staffName ? 
            (isValidStaff(staffName) ? "pr-10 border-green-500" : "pr-10 border-red-500") : ""}
        />
        {isDirty && staffName && (
          isValidStaff(staffName) ? (
            <div className="absolute inset-y-0 right-3 flex items-center text-green-500">
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <div className="absolute inset-y-0 right-3 flex items-center text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )
        )}
      </div>
      {isDirty && staffName && isValidStaff(staffName) && staffDisplay && (
        <p className="text-sm text-green-600">{staffDisplay}</p>
      )}
      {isDirty && staffName && !isValidStaff(staffName) && (
        <p className="text-sm text-red-500">無効な担当者IDです</p>
      )}
    </div>
  );
};

export default StaffInfoSection;
