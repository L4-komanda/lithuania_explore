import React, { useEffect, useState, useRef } from 'react';
import { friends } from '@/lib/data';
import { Users, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FriendSwiper from '@/components/FriendSwiper';
import { Fireworks } from 'fireworks-js';

const FriendsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSwiper, setShowSwiper] = useState(false);
  const [clickedFriendIds, setClickedFriendIds] = useState<string[]>([]);
  const fireworksContainerRef = useRef<HTMLDivElement | null>(null);
  const fireworksInstanceRef = useRef<Fireworks | null>(null);
  
  // Animation on component mount
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    window.scrollTo({ top: 0 });
    
    return () => {
      // Cleanup fireworks on unmount
      fireworksInstanceRef.current?.stop();
    };
  }, []);
  
  // Filter friends based on search term
  const filteredFriends = friends.filter(
    friend => friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddFriend = (friendId: string) => {
    setClickedFriendIds((prev) => [...prev, friendId]);

    if (!fireworksInstanceRef.current) {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '9999';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);

      fireworksInstanceRef.current = new Fireworks(container, {
        hue: { min: 0, max: 360 },
        delay: { min: 15, max: 30 },
        acceleration: 1.05,
        friction: 0.98,
        gravity: 1.5,
        particles: 50,
        explosion: 5,
        autoresize: true,
        brightness: { min: 50, max: 80 },
        decay: { min: 0.015, max: 0.03 },
        boundaries: { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight },
      });

      fireworksInstanceRef.current.start();
      setTimeout(() => {
        fireworksInstanceRef.current?.stop();
        document.body.removeChild(container);
        fireworksInstanceRef.current = null;
      }, 3000); // Fireworks last for 3 seconds
    }
  };
  
  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <section className="mb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Draugai
            </h1>
            <p className="text-muted-foreground">
              Pridėkite naujus draugus, bendraukite ir kartu atraskite Lietuvą.
            </p>
          </div>
        </section>
        
        {/* Search and actions */}
        <section className="mb-8 animate-slide-in">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Ieškoti draugų..."
                className="w-full pl-10 py-2 border border-input bg-white rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => setShowSwiper(true)}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Pridėti draugą
            </Button>
          </div>
        </section>
        
        {/* Friends list */}
        <section className="mb-8">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 bg-secondary/50 border-b border-border flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <h2 className="font-semibold">Mano draugai ({friends.length})</h2>
            </div>
            
            <div className="divide-y divide-border">
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend, index) => (
                  <div 
                    key={friend.id} 
                    className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <img 
                        src={friend.avatar} 
                        alt={friend.name} 
                        className="h-12 w-12 rounded-full"
                      />
                      <div 
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{friend.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{friend.status}</p>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      Rodyti profilį
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Nerasta draugų pagal paiešką "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Friend suggestions */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Rekomenduojami draugai</h2>
            <Button 
              variant="outline" 
              className="text-primary border-primary hover:bg-primary/5"
              onClick={() => setShowSwiper(true)}
            >
              Peržiūrėti visus
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {friends.slice(0, 3).map((friend, index) => (
              <div 
                key={friend.id}
                className="glass-card rounded-xl p-4 flex items-center gap-4 transition-all hover:shadow-md animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img 
                  src={friend.avatar} 
                  alt={friend.name} 
                  className="h-14 w-14 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{friend.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{friend.status}</p>
                  <button 
                    className={`mt-2 text-sm ${clickedFriendIds.includes(friend.id) ? 'text-gray-500' : 'text-primary'} hover:underline`}
                    onClick={() => handleAddFriend(friend.id)}
                    disabled={clickedFriendIds.includes(friend.id)}
                  >
                    {clickedFriendIds.includes(friend.id) ? "Užklausa išsiųsta" : "Pridėti draugą"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Friend swiper */}
        {showSwiper && (
          <FriendSwiper friends={friends} onClose={() => setShowSwiper(false)} />
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
