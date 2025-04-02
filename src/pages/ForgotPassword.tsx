
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import VerificationDialog from '@/components/VerificationDialog';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Įveskite savo el. pašto adresą",
      });
      return;
    }
    
    if (!email.includes('@')) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Įveskite teisingą el. pašto adresą",
      });
      return;
    }
    
    // Open verification dialog (in a real app, this would send an email first)
    setIsVerificationOpen(true);
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-forest to-forest/90 px-4 py-12 animate-fade-in">
      <div className="glass-card max-w-md w-full mx-auto rounded-xl p-8 animate-slide-in bg-green-50">
        <div className="flex justify-center mb-6">
          <div className="bg-lime rounded-full p-3 border-2 border-[#4d9560]">
            <Mail className="h-8 w-8 text-[#4d9560]" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-forest mb-2">Pamiršau slaptažodį</h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          Įveskite el. pašto adresą, susietą su Jūsų „Keliauk.lt" paskyra, ir mes atsiųsime Jums patvirtinimo kodą,
          kurį suvedus galėsite nustatyti naują slaptažodį.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2  text-sm ">
            <label htmlFor="email" className="block text-base font-medium text-gray-700 ">
              El. pašto adresas
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full h-8 rounded-sm"
              placeholder="vardenis.pav@gmail.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 ">
            <button 
              type="button" 
              onClick={handleBackToMain}
              className="btn-secondary border rounded-lg bg-white h-10 transition-all duration-200 hover:scale-105"
            >
              Atgal į prisijungimą
            </button>
            <button 
              type="submit" 
              className="btn-primary border rounded-lg bg-[#4ed07e] h-10 transition-all duration-200 hover:bg-[#22c55e] hover:scale-105"
            >
              Pateikti
            </button>
          </div>
        </form>
        
        <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
          <VerificationDialog onClose={() => setIsVerificationOpen(false)} />
        </Dialog>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
