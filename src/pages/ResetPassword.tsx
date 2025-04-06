
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Užpildykite visus tuščius laukus",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Slaptažodis turi būti sudarytas iš bent 8 simbolių",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Slaptažodžiai nesutampa",
      });
      return;
    }
    
    // Show success dialog
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/login');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="pt-24 pb-0 animate-fade-in">
      <div className="flex-grow flex items-center justify-center bg-white px-4 py-12">
        <div className="max-w-md w-full mx-auto rounded-lg p-8 bg-green-50 shadow-md animate-slide-in">
          <div className="flex justify-center mb-6">
            <div className="bg-lime rounded-full p-3 border-2 border-[#4d9560]">
              <Lock className="h-8 w-8 text-[#4d9560]" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-forest mb-2">Naujas Slaptažodis</h1>
          <p className="text-center text-gray-600 mb-8">
            Įveskite naują slaptažodį
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-base font-medium text-gray-700">
                Naujas slaptažodis
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-8"
                  placeholder="Įveskite naują slaptažodį"
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">
                Naujo slaptažodžio patvirtinimas
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-8"
                  placeholder="Patvirtinkite naują slaptažodį"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn-secondary border rounded-lg bg-white h-10 transition-all duration-200 hover:scale-105"
              >
                Atšaukti
              </button>
              <button 
                type="submit" 
                className="btn-primary border rounded-lg bg-[#4ed07e] h-10 transition-all duration-200 hover:bg-[#22c55e] hover:scale-105"
              >
                Išsaugoti
              </button>
            </div>
          </form>
          
          <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-forest font-bold">
                  Slaptažodis Pakeistas!
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center">
                  Jūsų slaptažodis pakeistas sėkmingai
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="text-center">
                <Button 
                  onClick={handleSuccessClose}
                  className="bg-leaf  rounded-lg bg-[#4ed07e] h-10 transition-all duration-200 hover:bg-[#22c55e] hover:scale-105 mx-auto"
                >
                  Gerai
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;