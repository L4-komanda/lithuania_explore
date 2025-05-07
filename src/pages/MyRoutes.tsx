import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Edit, ArrowLeft, Car, Navigation, Route, MapPin, TextCursorIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { attractions } from '@/lib/data';
import { Attraction } from '@/lib/types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input"

// Define a type for a saved route
interface RoutePoint {
  attraction: Attraction;
  distanceToPrev: number | null;
  timeByCarToPrev: number | null;
  timeByFootToPrev: number | null;
}

interface SavedRoute {
  id: string;
  name: string;
  startPoint: string;
  points: RoutePoint[];
  totalDistance: number;
  totalTimeByFoot: number;
  totalTimeByCar: number;
}

// Update the default route to reflect the new start point and route
const createDefaultRoute = (): SavedRoute => {
  const AukstumalaAttraction = attractions.find(a => a.name.includes('Aukštumalos')) || attractions[0];
  const KryziuAttraction = attractions.find(a => a.name.includes('Kryžių')) || attractions[1];

  const points = [AukstumalaAttraction, KryziuAttraction].map((attraction, index) => {
    const distance = 352;
    const timeByCar = 4.99; // 4 hours 59 minutes
    const timeByFoot = 82; // 82 hours

    return {
      attraction,
      distanceToPrev: index === 0 ? distance : distance,
      timeByCarToPrev: index === 0 ? timeByCar : timeByCar,
      timeByFootToPrev: index === 0 ? timeByFoot : timeByFoot
    };
  });

  return {
    id: "default-route",
    name: "Pirmas maršrutas",
    startPoint: "Studentų g. 48, Kaunas",
    points: points,
    totalDistance: 352,
    totalTimeByFoot: 4920,
    totalTimeByCar: 299
  };
};

const MyRoutes: React.FC = () => {
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [editingRoute, setEditingRoute] = useState<SavedRoute | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Format time in minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}val. ${mins}min`;
  };
  const handleCalculateRoute = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRouteCalculated(true);
    }, 2000);
  };
  // Initialize with saved routes or default if empty
  useEffect(() => {
    //const storedRoutes = localStorage.getItem('savedRoutes');
    let routes: SavedRoute[] = [];//storedRoutes ? JSON.parse(storedRoutes) : [];
    
    // Add default route if there are no routes
    if (routes.length === 0) {
      routes = [createDefaultRoute()];
      localStorage.setItem('savedRoutes', JSON.stringify(routes));
    }
    
    setSavedRoutes(routes);
  }, []);

  const handleDeleteRoute = (id: string) => {
    setShowDeleteDialog(true);
    setRouteToDelete(id);
  };

  const confirmDeleteRoute = () => {
    if (routeToDelete) {
      const updatedRoutes = savedRoutes.filter(route => route.id !== routeToDelete);
      localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes));
      setSavedRoutes(updatedRoutes);
  
      toast({
        title: "Maršrutas ištrintas",
        description: "Maršrutas sėkmingai pašalintas"
      });
    }
    setShowDeleteDialog(false);
    setRouteToDelete(null);
  };
  
  const cancelDeleteRoute = () => {
    setShowDeleteDialog(false);
    setRouteToDelete(null);
  };

  const handleEditRoute = (route: SavedRoute) => {
    setEditingRoute(route);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingRoute) {
      const updatedRoutes = savedRoutes.map(route => 
        route.id === editingRoute.id ? editingRoute : route
      );
      
      localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes));
      setSavedRoutes(updatedRoutes);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Maršrutas atnaujintas",
        description: "Maršrutas sėkmingai išsaugotas"
      });
    }
  };

  const handleUpdateDestination = (index: number, newAttraction: Attraction) => {
    if (editingRoute) {
      const updatedPoints = [...editingRoute.points];
      updatedPoints[index] = {
        ...updatedPoints[index],
        attraction: newAttraction
      };
  
      setEditingRoute({
        ...editingRoute,
        points: updatedPoints
      });
    }
  };

  const handleRecalculateRoute = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEditingRoute({
        ...editingRoute,
        totalDistance: 235,
        totalTimeByCar: 3 * 60 + 18,
        totalTimeByFoot: 53 * 60,
      });
      setShowSummary(true);
    }, 2000);
  };

  // Initially hide the "Bendra informacija" section and only show it after recalculation.
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mano maršrutai</h1>
            <p className="text-muted-foreground mt-1">
              Suplanuoti kelionių maršrutai
            </p>
          </div>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Grįžti į žemėlapį
          </Button>
        </div>

        {savedRoutes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Neturite išsaugotų maršrutų</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Route className="h-4 w-4" />
                      <span>Maršrutas</span>
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Atstumas</span>
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>Kelionės laikas automobiliu</span>
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Navigation className="h-4 w-4" />
                      <span>Kelionės laikas pėsčiomis</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <TextCursorIcon className="h-4 w-4" />
                      <span>Veiksmai</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedRoutes.map((route, index) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">{index+1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{route.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {route.startPoint} → {route.points.map(p => p.attraction.name).join(' → ')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {route.totalDistance.toFixed(1)} km
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatTime(route.totalTimeByCar)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatTime(route.totalTimeByFoot)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditRoute(route)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteRoute(route.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Route Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redaguoti maršrutą</DialogTitle>
            </DialogHeader>
            
            {editingRoute && (
              <>
                <div className="pt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Pradinė vieta</label>
                    <Input
                      value={editingRoute.startPoint}
                      onChange={(e) => setEditingRoute({ ...editingRoute, startPoint: e.target.value })}
                      placeholder="Įveskite pradinę vietą"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Vietos</h3>
                    <div className="space-y-2">
                      {editingRoute.points.map((point, idx) => (
                        <div key={point.attraction.id} className="p-3 bg-muted rounded-md">
                          <p className="font-medium">{point.attraction.name}</p>
                          <div className="mt-2">
                            <label htmlFor={`destination-${idx}`} className="block text-sm font-medium text-gray-700">
                              Pakeisti vietą
                            </label>
                            <select
                              id={`destination-${idx}`}
                              value={point.attraction.id}
                              onChange={(e) => {
                                const newAttraction = attractions.find(a => a.id === e.target.value);
                                if (newAttraction) {
                                  handleUpdateDestination(idx, newAttraction);
                                }
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              {attractions.map(attraction => (
                                <option key={attraction.id} value={attraction.id}>{attraction.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      setLoading(true); // Set loading state to true
                      setShowSummary(false); // Hide summary initially
                      setTimeout(() => {
                        // Simulate recalculation logic
                        setEditingRoute({
                          ...editingRoute,
                          totalDistance: 235,
                          totalTimeByCar: 3 * 60 + 18,
                          totalTimeByFoot: 53 * 60,
                        });
                        setLoading(false); // Set loading state to false
                        setShowSummary(true); // Show summary after recalculation
                      }, 2000); // Add 2-second delay
                    }}
                  >
                    {loading ? "Skaičiuojama..." : "Skaičiuoti optimalų maršrutą"}
                  </Button>
                  {showSummary && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="font-medium">Bendra informacija</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <span>Bendras atstumas:</span>
                        <span>{editingRoute?.totalDistance} km</span>
                        <span>Automobiliu:</span>
                        <span>{formatTime(editingRoute?.totalTimeByCar || 0)}</span>
                        <span>Pėsčiomis:</span>
                        <span>{formatTime(editingRoute?.totalTimeByFoot || 0)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Atšaukti
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Išsaugoti
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Patvirtinkite pašalinimą</AlertDialogTitle>
              <AlertDialogDescription>
                Ar tikrai norite ištrinti šį maršrutą?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelDeleteRoute}>Atšaukti</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteRoute}>Ištrinti</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MyRoutes;