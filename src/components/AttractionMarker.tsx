import React, { useState } from "react";
import { Attraction } from "@/lib/types";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserActions } from '@/lib/UserActionContext';

interface AttractionMarkerProps {
  attraction: Attraction;
  isSelected: boolean;
  onClick: () => void;
}

const AttractionMarker: React.FC<AttractionMarkerProps> = ({
  attraction,
  isSelected,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const { hasVisited } = useUserActions();

  const isVisited = hasVisited(attraction.id);
  const style = {
    left: `${((attraction.location.lng - 20) / 8) * 100}%`,
    top: `${((56.5 - attraction.location.lat) / 3) * 100}%`,
    transform: "translate(-50%, -50%)",
    zIndex: isSelected ? 10 : 1,
  };

  return (
    <div className="absolute" style={style}>
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          isSelected || hovered ? "scale-110" : "scale-100"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        {/* Pin */}
        <div className="relative cursor-pointer">
        <MapPin 
            className={cn(
              "w-10 h-10 drop-shadow-md transition-colors",
              isSelected
                ? "text-[#4ED07E]"
                : "text-[#4ED07E] hover:text-[#4ED07E]"
            )} 
            fill={isSelected ? "rgba(59, 130, 246, 0.2)" : isVisited ? "rgba(34, 197, 94, 0.2)" : "transparent"} 
          />

          

          {/* Visited badge */}
          {isVisited && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Tooltip that appears on hover or selection */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max max-w-[200px] glass-card rounded-lg p-2 shadow-lg transition-all",
            isSelected || hovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1 pointer-events-none"
          )}
        >
          <div className="text-sm font-medium">{attraction.name}</div>
          <div className="text-xs text-muted-foreground">
            {attraction.category}
          </div>
          {isVisited && (
            <div className="mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">
              Aplankyta
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttractionMarker;
