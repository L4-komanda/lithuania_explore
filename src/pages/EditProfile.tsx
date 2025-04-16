import React, { useEffect, useState } from 'react';
import { currentUser } from '@/lib/data';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Image as ImageIcon } from 'lucide-react';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setFirstName(currentUser.name || '');
    setAvatar(currentUser.avatar || '');
  }, []);

  const generateDefaultAvatar = () => {
    const name = firstName || 'User';
    return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff`;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser: any = { firstName, avatar };
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = password;

    localStorage.setItem('user', JSON.stringify(updatedUser));

    toast({
      variant: 'default',
      title: 'Profilis atnaujintas',
      description: 'Pakeitimai išsaugoti sėkmingai.',
    });

    setTimeout(() => navigate('/profile'), 1000);
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDeletion = () => {
    if (confirmPassword !== 'test123') {
      toast({
        variant: 'destructive',
        title: 'Klaida',
        description: 'Neteisingas slaptažodis.',
      });
      return;
    }
    

    localStorage.removeItem('user');
    localStorage.setItem('loggedIn', 'false');
    toast({
      variant: 'destructive',
      title: 'Profilis ištrintas',
      description: 'Jūsų paskyra buvo pašalinta.',
    });
    navigate('/login');
  };

  return (
    <div className="pt-24 pb-0 animate-fade-in">
      <div className="flex-grow flex items-center justify-center bg-white px-4 py-12">
        <div className="max-w-md w-full mx-auto rounded-lg p-8 bg-green-50 shadow-md animate-slide-in">
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-2">
              <img
                src={avatar || generateDefaultAvatar()}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow"
              />

              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('avatarInput')?.click()}
                className="flex items-center text-sm gap-1 text-primary hover:text-primary/80 font-medium"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Keisti nuotrauką</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-4">Redaguoti profilį</h1>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Vardas</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">El. paštas</label>
              <Input value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Naujas slaptažodis</label>
              <Input value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-white bg-[#4ed07e] hover:bg-[#22c55e] hover:scale-105"
            >
              Išsaugoti
            </button>
          </form>

          <button
            onClick={handleDelete}
            className="mt-6 w-full flex items-center justify-center gap-2 text-red-600 border border-red-600 py-2 rounded-md hover:bg-red-50 hover:scale-105"
          >
            <Trash2 className="w-5 h-5" />
            Ištrinti profilį
          </button>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg animate-slide-in space-y-4">
            <h2 className="text-xl font-semibold text-center">Patvirtinkite ištrynimą</h2>
            <p className="text-sm text-muted-foreground text-center">
              Įveskite savo el. paštą ir slaptažodį, kad patvirtintumėte paskyros ištrynimą.
            </p>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="El. paštas"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Slaptažodis"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-muted-foreground hover:underline"
              >
                Atšaukti
              </button>
              <button
                onClick={confirmDeletion}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Ištrinti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
