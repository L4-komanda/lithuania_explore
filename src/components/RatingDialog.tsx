
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: { rating: number; comment: string }) => void;
  attractionName: string;
}

const RatingDialog: React.FC<RatingDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  attractionName
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Reikalingas įvertinimas",
        description: "Prašome pasirinkti įvertinimą nuo 1 iki 5 žvaigždučių.",
        variant: "destructive"
      });
      return;
    }

    // Submit with fixed name "Jonas P."
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Įvertinti vietą: {attractionName}</DialogTitle>
          <DialogDescription>
            Pasidalinkite savo patirtimi apie šią vietą su kitais keliautojais
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="rating" className="text-sm font-medium">Jūsų įvertinimas</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={
                      (hoverRating ? star <= hoverRating : star <= rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="text-sm font-medium">Papasakokite apie savo patirtį</label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Pasidalinkite savo įspūdžiais apie šią vietą"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="sm:flex-1" onClick={onClose}>
            Atšaukti
          </Button>
          <Button className="sm:flex-1" onClick={handleSubmit}>
            Išsaugoti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
