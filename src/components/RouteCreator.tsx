import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Check, Car, Navigation, Plus } from "lucide-react";
import { attractions } from '@/lib/data';
import { Attraction } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Route points with travel time and distance estimations
interface RoutePoint {
  attraction: Attraction;
  distanceToPrev: number | null; // in km
  timeByCarToPrev: number | null; // in minutes
  timeByFootToPrev: number | null; // in minutes
}

interface RouteData {
  id: string;
  name: string;
  startPoint: string;
  points: RoutePoint[];
  totalDistance: number;
  totalTimeByFoot: number;
  totalTimeByCar: number;
}

interface RouteCreatorProps {
  onCancel: () => void;
}

// Create route path drawing on map (simplified for demo)
const RoutePathSimulation: React.FC<{points: RoutePoint[]}> = ({ points }) => {
  if (points.length < 1) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {points.map((point, index) => (
        <React.Fragment key={point.attraction.id}>
          {index > 0 && (
            <div 
              className="absolute border-2 border-blue-500 z-10"
              style={{
                top: `${30 + Math.min(point.attraction.location.lat * 6, 80)}%`,
                left: `${Math.max(point.attraction.location.lng * 2, 20) - 10}%`,
                width: '10px',
                height: '10px',
                borderRadius: '50%'
              }}
            />
          )}
          {/* Draw line to next point */}
          {index < points.length - 1 && (
            <div 
              className="absolute border-b-2 border-dashed border-blue-500 z-5"
              style={{
                top: `${30 + Math.min(point.attraction.location.lat * 6, 80)}%`,
                left: `${Math.max(point.attraction.location.lng * 2, 20)}%`,
                width: '50px',
                transform: 'rotate(20deg)',
                transformOrigin: '0 0'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const RouteCreator: React.FC<RouteCreatorProps> = ({ onCancel }) => {
  const [selectedAttractions, setSelectedAttractions] = useState<Attraction[]>([]);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddAttraction = (attraction: Attraction) => {
    setSelectedAttractions([...selectedAttractions, attraction]);
    setRouteCalculated(false);
  };

  const handleRemoveAttraction = (id: string) => {
    setSelectedAttractions(selectedAttractions.filter(attr => attr.id !== id));
    setRouteCalculated(false);
  };

  const calculateOptimalRoute = () => {
    // For this demo, we'll just use the current order
    // In a real app, this would use a TSP algorithm
    
    setRouteCalculated(true);
    
    toast({
      title: "Maršrutas sukurtas",
      description: "Optimaliausias maršrutas apskaičiuotas",
    });
  };

  const getTotalDistance = () => {
    return routePoints.reduce((sum, point) => sum + (point.distanceToPrev || 0), 0).toFixed(1);
  };
  
  const getTotalTimeByCar = () => {
    const totalMinutes = routePoints.reduce(
      (sum, point) => sum + (point.timeByCarToPrev || 0), 0
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}min`;
  };
  
  const getTotalTimeByFoot = () => {
    const totalMinutes = routePoints.reduce(
      (sum, point) => sum + (point.timeByFootToPrev || 0), 0
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}min`;
  };

  const saveRoute = () => {
    // In a real app, this would save to a database
    // For this demo, we'll use localStorage
    const savedRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]');
    
    const newRoute: RouteData = {
      id: Date.now().toString(),
      name: `Maršrutas į ${selectedAttractions.map(a => a.name).join(', ')}`,
      startPoint: "Studentu g. 48, Kaunas",
      points: routePoints,
      totalDistance: parseFloat(getTotalDistance()),
      totalTimeByFoot: routePoints.reduce((sum, point) => sum + (point.timeByFootToPrev || 0), 0),
      totalTimeByCar: routePoints.reduce((sum, point) => sum + (point.timeByCarToPrev || 0), 0)
    };
    
    savedRoutes.push(newRoute);
    localStorage.setItem('savedRoutes', JSON.stringify(savedRoutes));
    
    toast({
      title: "Maršrutas išsaugotas",
      description: "Maršrutas sėkmingai išsaugotas",
    });
    
    onCancel();
    navigate('/myroutes');
  };

  return (
    <>
      <Sheet open={true} onOpenChange={onCancel}>
        <SheetContent side="right" className="w-full sm:w-[400px] pt-20">
          <SheetHeader>
            <SheetTitle>Sukurti maršrutą</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div>
              <div className="font-medium mb-2">Pradinė vieta</div>
              <div className="flex items-center p-3 bg-secondary rounded-md">
                <div className="flex-1">
                  <p className="font-medium">Studentu g. 48, Kaunas</p>
                  <p className="text-xs text-muted-foreground">Jūsų dabartinė vieta</p>
                </div>
              </div>
            </div>
            
            {/* Selected destinations */}
            <div>
              <div className="font-medium mb-2">Pasirinktos vietos</div>
              {selectedAttractions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nepasirinkta jokių vietų</p>
              ) : (
                <div className="space-y-2">
                  {selectedAttractions.map((attr, index) => (
                    <div key={attr.id} className="flex items-center bg-secondary p-3 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{attr.name}</p>
                        <p className="text-xs text-muted-foreground">{attr.category}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveAttraction(attr.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Add attractions */}
            <div>
              <div className="font-medium mb-2">Pridėti lankytinas vietas</div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {attractions
                  .filter(attr => !selectedAttractions.some(selected => selected.id === attr.id))
                  .map(attr => (
                    <div key={attr.id} className="flex items-center bg-secondary/50 p-3 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{attr.name}</p>
                        <p className="text-xs text-muted-foreground">{attr.category}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAddAttraction(attr)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                }
              </div>
            </div>
            
            {/* Route calculation results */}
            {routeCalculated && routePoints.length > 0 && (
              <div className="border rounded-md p-4 bg-muted/20">
                <h3 className="font-semibold mb-2">Maršruto duomenys</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Bendras atstumas:</span>
                    <span className="font-medium">{getTotalDistance()} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>Automobilis:</span>
                    </div>
                    <span className="font-medium">{getTotalTimeByCar()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      <span>Pėsčiomis:</span>
                    </div>
                    <span className="font-medium">{getTotalTimeByFoot()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="flex gap-2">
              {selectedAttractions.length > 0 && !routeCalculated ? (
                <>
                  <Button 
                    className="flex-1" 
                    onClick={calculateOptimalRoute}
                  >
                    Skaičiuoti optimalų maršrutą
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onCancel}
                  >
                    Atšaukti
                  </Button>
                </>
              ) : routeCalculated ? (
                <Button 
                  className="flex-1"
                  onClick={saveRoute}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Išsaugoti maršrutą
                </Button>
              ) : null}
              <Button 
                variant="outline" 
                onClick={onCancel}
              >
                Atšaukti
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Render route path on the map */}
      {routeCalculated && <RoutePathSimulation points={routePoints} />}
    </>
  );
};

export default RouteCreator;