import React, { useEffect, useRef, useState } from "react";
import { attractions } from "@/lib/data";
import AttractionMarker from "./AttractionMarker";
import AttractionDetail from './AttractionDetail';
import { Attraction } from '@/lib/types';

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const selectedAttraction = selectedAttractionId 
    ? attractions.find(attr => attr.id === selectedAttractionId) || null 
    : null;
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (attractionId: string) => {
    setSelectedAttractionId(attractionId);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

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
         isSelected={selectedAttractionId === attraction.id}
            onClick={() => handleMarkerClick(attraction.id)}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
      {/* Attraction detail dialog */}
      <AttractionDetail 
        attraction={selectedAttraction} 
        isOpen={detailOpen} 
        onClose={handleCloseDetail} 
      />
    </div>
    
  );
};

export default Map;
