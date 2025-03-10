
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  notes: string;
  setNotes: (notes: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  setNotes
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="notes">補足メモ (任意)</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="備考やメモを入力"
        className="h-20"
      />
    </div>
  );
};

export default NotesSection;
