import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Attraction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface EditAttractionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attraction: Attraction | null;
  onSave: (updatedAttraction: Attraction) => void;
}

const EditAttractionDialog: React.FC<EditAttractionDialogProps> = ({
  isOpen,
  onClose,
  attraction,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (attraction) {
      setName(attraction.name);
      setDescription(attraction.description);
      setCategory(attraction.category);
    }
  }, [attraction]);

  const handleSave = () => {
    if (!attraction) return;

    if (!name.trim() || !description.trim() || !category.trim()) {
      toast({
        title: "Klaida",
        description: "Visi laukai turi būti užpildyti.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      ...attraction,
      name,
      description,
      category,
    });
    onClose();
  };

  if (!attraction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Redaguoti lankytiną vietą</DialogTitle>
          <DialogDescription>
            Pakeiskite informaciją apie "{attraction.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Pavadinimas
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Aprašymas
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Kategorija
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Atšaukti
          </Button>
          <Button onClick={handleSave}>Išsaugoti</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAttractionDialog;
