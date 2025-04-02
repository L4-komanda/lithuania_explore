
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VerificationDialogProps {
  onClose: () => void;
}

const VerificationDialog: React.FC<VerificationDialogProps> = ({ onClose }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length < 6) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Įveskite visus 6 skaitmenis",
      });
      return;
    }
    
    // Any code is accepted as per requirements
    onClose();
    navigate('/resetpassword');
  };

  const handleCancel = () => {
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only allow digits
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    // Create a new array from the current verification code
    const newCode = verificationCode.split('');
    
    // Update the value at the specified index
    newCode[index] = value;
    
    // Set the new verification code
    setVerificationCode(newCode.join(''));
    
    // Move focus to the next input if a digit was entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to the previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-center text-keliauk">
          Patvirtinimo Kodas
        </DialogTitle>
        <DialogDescription className="text-center">
          Įveskite 6 skaitmenų kodą, kurį gavote nurodytu el. pašto adresu
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div className="space-y-4">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 text-center">
            Patvirtinimo Kodas
          </label>
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={verificationCode[index] || ''}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-lg text-center border border-keliauk/30 focus:border-keliauk rounded-md focus:outline-none focus:ring-2 focus:ring-keliauk focus:ring-opacity-50"
                autoFocus={index === 0}
              />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="bg-cream text-black border-cream rounded-lg"
          >
            Atgal
          </Button>
          <Button
            type="submit"
            className="bg-keliauk rounded-lg border-cream text-black bg-[#4ed07e] transition-all duration-200 hover:bg-[#22c55e] hover:scale-105"
          >
            Pateikti
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default VerificationDialog;
