import React, { useEffect, useRef, useState } from "react";
import { attractions } from "@/lib/data";
import AttractionMarker from "./AttractionMarker";

const Map: React.FC = () => {
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[1000px] overflow-hidden rounded-xl shadow-md">
      <img
        src="https://i.ibb.co/ccNqtGQH/lietuvos-map.png"
        alt="Map background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {attractions.map((attraction) => (
        <AttractionMarker
          key={attraction.id}
          attraction={attraction}
          isSelected={selectedAttraction === attraction.id}
          onClick={() => setSelectedAttraction(attraction.id)}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default Map;
