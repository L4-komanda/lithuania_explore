import React, { useState } from "react";
import { Attraction } from "@/lib/types";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

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
              "w-8 h-8 drop-shadow-md transition-colors",
              isSelected ? "text-primary" : "text-primary/80 hover:text-primary"
            )}
            fill={isSelected ? "rgba(59, 130, 246, 0.2)" : "transparent"}
          />

          {/* Rating circle */}
          <div
            className={cn(
              "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-xs font-semibold flex items-center justify-center shadow-sm transition-transform",
              isSelected || hovered ? "scale-110" : "scale-100"
            )}
          >
            {attraction.rating}
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default AttractionMarker;
