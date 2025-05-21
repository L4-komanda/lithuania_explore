import React, { useState, useEffect, useRef } from 'react';
import { Race } from '@/lib/types';
import { Calendar, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Fireworks } from 'fireworks-js';

interface RaceCardProps {
  race: Race;
}

const RaceCard: React.FC<RaceCardProps> = ({ race }) => {
  const [isRegistered, setIsRegistered] = useState(race.participants.includes('user-1'));
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksRef = useRef<HTMLDivElement | null>(null);

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

  const handleRegister = () => {
    if (!isRegistered && !isFull) {
      setIsRegistered(true);
      setShowFireworks(true);
    }
  };

  const isFull = race.participants.length >= race.maxParticipants;
  const formattedDate = new Date(race.date).toLocaleDateString('lt-LT', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div className="group relative rounded-2xl overflow-hidden h-full flex flex-col bg-white shadow-sm border border-border/40 transition-all hover:shadow-md">
      {/* Fireworks animation */}
      {showFireworks && <div ref={fireworksRef} className="absolute inset-0 z-50" />}

      {/* Background image with overlay */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src={race.image} 
          alt={race.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Race name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-xl font-bold text-white">{race.name}</h3>
          <p className="text-white/90 text-sm">{race.distance} km</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="space-y-3 mb-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formattedDate}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{race.location.name}</span>
          </div>
          
          {/* Participants */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>{race.participants.length} / {race.maxParticipants} dalyvių</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{race.description}</p>
        
        {/* Registration button or status */}
        <div className="mt-auto">
          <button 
            className={cn(
              "w-full py-2 px-4 rounded-lg font-medium transition-all",
              isRegistered 
                ? "bg-secondary text-foreground cursor-default border-2 border-green-500" 
                : isFull 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-white hover:bg-primary/90"
            )}
            disabled={isRegistered || isFull}
            onClick={handleRegister}
          >
            {isRegistered 
              ? "Jau užsiregistravote" 
              : isFull 
                ? "Registracija uždaryta" 
                : "Registruotis"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;
