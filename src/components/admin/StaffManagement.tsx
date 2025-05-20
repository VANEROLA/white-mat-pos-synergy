
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash } from "lucide-react";
import { StaffMember } from "@/hooks/useStaffManagement";

interface StaffManagementProps {
  staffList: StaffMember[];
  addStaff: (id: string, name: string) => boolean;
  removeStaff: (id: string) => boolean;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ 
  staffList, 
  addStaff, 
  removeStaff 
}) => {
  const [newStaffId, setNewStaffId] = useState("");
  const [newStaffName, setNewStaffName] = useState("");

  // Handle adding new staff member
  const handleAddStaff = () => {
    if (!newStaffId.trim() || !newStaffName.trim()) {
      toast.error("スタッフIDと名前を入力してください");
      return;
    }

    if (addStaff(newStaffId, newStaffName)) {
      toast.success("スタッフを追加しました");
      setNewStaffId("");
      setNewStaffName("");
    } else {
      toast.error("同じIDのスタッフが既に存在します");
    }
  };

  // Handle removing a staff member
  const handleRemoveStaff = (id: string) => {
    if (removeStaff(id)) {
      toast.success("スタッフを削除しました");
    } else {
      toast.error("スタッフの削除に失敗しました");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>スタッフ管理</CardTitle>
        <CardDescription>
          無料処理を行えるスタッフを管理します
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-staff-id">スタッフID</Label>
              <Input
                id="new-staff-id"
                value={newStaffId}
                onChange={(e) => setNewStaffId(e.target.value)}
                placeholder="スタッフIDを入力"
              />
            </div>
            <div>
              <Label htmlFor="new-staff-name">スタッフ名</Label>
              <Input
                id="new-staff-name"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="スタッフ名を入力"
              />
            </div>
          </div>
          <Button onClick={handleAddStaff} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            スタッフを追加
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>スタッフID</TableHead>
              <TableHead>スタッフ名</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  登録されているスタッフはありません
                </TableCell>
              </TableRow>
            ) : (
              staffList.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.id}</TableCell>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStaff(staff.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default StaffManagement;
