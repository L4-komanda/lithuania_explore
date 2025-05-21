import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, Check, MapPin, Calendar, User } from 'lucide-react';
import { Friend } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Fireworks } from 'fireworks-js';

interface FriendSwiperProps {
  friends: Friend[];
  onClose: () => void;
}

const FriendSwiper: React.FC<FriendSwiperProps> = ({ friends, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (showFireworks && fireworksRef.current) {
      const fireworks = new Fireworks(fireworksRef.current, {
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

      fireworks.start();
      setTimeout(() => {
        fireworks.stop();
        setShowFireworks(false);
      }, 3000); // Fireworks last for 3 seconds
    }
  }, [showFireworks]);

  const currentFriend = friends[currentIndex];
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setDirection('');
      }, 300);
    }
  };
  
  const goToNext = () => {
    if (currentIndex < friends.length - 1) {
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection('');
      }, 300);
    } else {
      // End of the stack
      toast({
        title: "Nėra daugiau profilių",
        description: "Jūs peržiūrėjote visus galimus draugus.",
      });
    }
  };
  
  const handleLike = () => {
    toast({
      title: "Užklausa išsiųsta",
      description: `Draugystės užklausa išsiųsta ${currentFriend.name}`,
    });
    setShowFireworks(true);
    goToNext();
  };
  
  const handleSkip = () => {
    goToNext();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {showFireworks && <div ref={fireworksRef} className="absolute inset-0 z-50" />}
      <Card className="relative w-full max-w-md overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 z-10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        
        <div className="relative h-[500px] overflow-y-auto">
          <div 
            className={`absolute inset-0 transition-transform duration-300 ease-out ${
              direction === 'left' ? 'translate-x-full' : 
              direction === 'right' ? '-translate-x-full' : ''
            }`}
          >
            <div className="relative h-64 bg-gradient-to-b from-primary/20 to-background">
              <img 
                src={currentFriend.avatar} 
                alt={currentFriend.name}
                className="w-full h-full object-cover object-center opacity-80"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-32" />
            </div>
            
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">{currentFriend.name}</h2>
                <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <User className="h-4 w-4" />
                  <span>ID: {currentFriend.id}</span>
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${currentFriend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div>
                    <p className="font-medium">Statusas</p>
                    <p className="text-sm text-muted-foreground capitalize">{currentFriend.status}</p>
                  </div>
                </div>
                
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <p className="text-center text-muted-foreground">
                    Čia galėtų būti daugiau informacijos apie šį vartotoją, pvz. pomėgiai, lankytinos
                    vietos, mėgstamos veiklos ir t.t.
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </div>
        
        <div className="p-4 border-t bg-card flex items-center justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-14 w-14 border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleSkip}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-14 w-14 border-green-500 text-green-500 hover:bg-green-50"
            onClick={handleLike}
          >
            <Check className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-12 w-12"
            onClick={goToNext}
            disabled={currentIndex === friends.length - 1}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-1 pb-2">
          {friends.map((_, index) => (
            <div 
              key={index} 
              className={`h-1 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FriendSwiper;
