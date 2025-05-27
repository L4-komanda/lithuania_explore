import React, { useState, useEffect, useRef } from "react";
import { Race } from "@/lib/types";
import { Calendar, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fireworks } from "fireworks-js";

interface RaceCardProps {
  race: Race;
  isPast?: boolean;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, isPast = false }) => {
  const [currentParticipantsCount, setCurrentParticipantsCount] = useState(
    race.participants.length
  );
  const [isRegistered, setIsRegistered] = useState(
    !isPast && race.participants.includes("user-1")
  );
  const [showFireworks, setShowFireworks] = useState(false);
  const fireworksRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showFireworks && fireworksRef.current && !isPast) {
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
        boundaries: {
          x: 0,
          y: 0,
          width: fireworksRef.current.clientWidth,
          height: fireworksRef.current.clientHeight,
        },
      });

      fireworks.start();
      const timer = setTimeout(() => {
        fireworks.stop();
        setShowFireworks(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        if (fireworks.isRunning) {
          fireworks.stop();
        }
      };
    }
  }, [showFireworks, isPast]);

  const isFull = currentParticipantsCount >= race.maxParticipants;

  const handleRegister = () => {
    if (!isPast && !isRegistered && !isFull) {
      setIsRegistered(true);
      setCurrentParticipantsCount((prevCount) => prevCount + 1);
      setShowFireworks(true);
    }
  };

  const formattedDate = new Date(race.date).toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden h-full flex flex-col bg-card shadow-sm border border-border/40 transition-all",
        isPast ? "opacity-75" : "hover:shadow-md"
      )}
    >
      {!isPast && showFireworks && (
        <div
          ref={fireworksRef}
          className="absolute inset-0 z-50 pointer-events-none"
        />
      )}

      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={typeof race.image === "string" ? race.image : race.image.src}
          alt={race.name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 ease-out",
            isPast ? "filter grayscale" : "group-hover:scale-105"
          )}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-xl font-bold text-white">{race.name}</h3>
          <p className="text-white/90 text-sm">{race.distance} km</p>
        </div>

        {isPast && (
          <div className="absolute top-2 right-2 bg-muted text-muted-foreground px-2 py-1 text-xs font-semibold rounded shadow z-20">
            PRAĖJĘS
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col bg-background">
        {" "}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{race.location.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>
              {currentParticipantsCount} / {race.maxParticipants} dalyvių
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {race.description}
        </p>
        <div className="mt-auto">
          <button
            className={cn(
              "w-full py-2 px-4 rounded-lg font-medium transition-all text-sm",
              isPast
                ? "bg-muted text-muted-foreground cursor-default"
                : isRegistered
                ? "bg-green-100 text-green-700 border-2 border-green-500 cursor-default"
                : isFull
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            disabled={isPast || isRegistered || isFull}
            onClick={handleRegister}
          >
            {isPast
              ? "Renginys įvyko"
              : isRegistered
              ? "✓ Jau užsiregistravote"
              : isFull
              ? "Registracija uždaryta"
              : "Registruotis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;
