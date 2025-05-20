
import { useState, useEffect } from "react";

export interface StaffMember {
  id: string;
  name: string;
}

interface StaffManagementState {
  staffList: StaffMember[];
  addStaff: (id: string, name: string) => boolean;
  removeStaff: (id: string) => boolean;
  isValidStaff: (staffId: string) => boolean;
  getStaffName: (staffId: string) => string | null;
  changeAdminPassword: (currentPassword: string, newPassword: string) => boolean;
}

export const useStaffManagement = (): StaffManagementState => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  // Load staff list on component mount
  useEffect(() => {
    const savedStaffList = localStorage.getItem("authorizedStaff");
    if (savedStaffList) {
      try {
        setStaffList(JSON.parse(savedStaffList));
      } catch (error) {
        console.error("Error parsing staff list:", error);
        setStaffList([]);
      }
    } else {
      // Initialize with default staff if none exists
      const defaultStaff = [{ id: "admin", name: "管理者" }];
      localStorage.setItem("authorizedStaff", JSON.stringify(defaultStaff));
      setStaffList(defaultStaff);
    }
  }, []);

  // Save staff list whenever it changes
  useEffect(() => {
    localStorage.setItem("authorizedStaff", JSON.stringify(staffList));
  }, [staffList]);

  // Add a new staff member
  const addStaff = (id: string, name: string): boolean => {
    // Check if ID already exists
    if (staffList.some(staff => staff.id === id)) {
      return false;
    }

    setStaffList(prev => [...prev, { id, name }]);
    return true;
  };

  // Remove a staff member
  const removeStaff = (id: string): boolean => {
    const initialLength = staffList.length;
    setStaffList(prev => prev.filter(staff => staff.id !== id));
    return initialLength > staffList.length;
  };

  // Check if a staff ID is valid
  const isValidStaff = (staffId: string): boolean => {
    return staffList.some(staff => staff.id === staffId);
  };

  // Get staff name by ID
  const getStaffName = (staffId: string): string | null => {
    const staff = staffList.find(staff => staff.id === staffId);
    return staff ? staff.name : null;
  };

  // Change the admin password
  const changeAdminPassword = (currentPassword: string, newPassword: string): boolean => {
    const storedPassword = localStorage.getItem("adminPassword") || "1234";
    
    if (currentPassword === storedPassword) {
      localStorage.setItem("adminPassword", newPassword);
      return true;
    }
    
    return false;
  };

  return {
    staffList,
    addStaff,
    removeStaff,
    isValidStaff,
    getStaffName,
    changeAdminPassword
  };
};
