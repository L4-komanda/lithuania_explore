import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserPlusIcon } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Klaida',
        description: 'Užpildykite visus laukelius.',
      });
      return;
    }

    if (!email.includes('@')) {
      toast({
        variant: 'destructive',
        title: 'Klaida',
        description: 'Neteisingas el. pašto formatas.',
      });
      return;
    }

    toast({
      variant: 'default',
      title: 'Sėkminga registracija!',
      description: `Sveikas, ${username}!`,
    });

    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div className="pt-24 pb-0 animate-fade-in">
      <div className="flex-grow flex items-center justify-center bg-white px-4 py-12">
        <div className="max-w-md w-full mx-auto rounded-lg p-8 bg-green-50 shadow-md animate-slide-in">
          <div className="flex justify-center mb-6">
            <div className="bg-lime rounded-full p-3 border-2 border-[#4d9560]">
              <UserPlusIcon className="h-8 w-8 text-[#4d9560]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Registracija</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Vartotojo vardas
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="vardenis"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                El. pašto adresas
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vardenis.pav@gmail.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Slaptažodis
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#4ed07e] hover:bg-[#22c55e] hover:scale-105"
            >
              Registruotis
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Jau turite paskyrą?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:underline"
              >
                Prisijungti
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
