import React, { useEffect, useRef, useState } from "react";
import { attractions } from "@/lib/data";
import AttractionMarker from "./AttractionMarker";
import { Button } from "./ui/button";
import { MapIcon, Route, Navigation, Car } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import AttractionDetail from "./AttractionDetail";

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedAttractionId, setSelectedAttractionId] = useState<
    string | null
  >(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    []
  );
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const selectedAttraction = selectedAttractionId
    ? attractions.find((attr) => attr.id === selectedAttractionId) || null
    : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (attractionId: string) => {
    if (isCreatingRoute) {
      if (selectedDestinations.includes(attractionId)) {
        setSelectedDestinations(
          selectedDestinations.filter((id) => id !== attractionId)
        );
      } else {
        setSelectedDestinations([...selectedDestinations, attractionId]);
      }
    } else {
      const selectedAttraction = attractions.find(
        (attr) => attr.id === attractionId
      );
      if (selectedAttraction) {
        setSelectedAttractionId(attractionId);
        setDetailOpen(true);
      }
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  const handleCreateRoute = () => {
    setIsCreatingRoute(true);
  };

  const handleCalculateRoute = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRouteCalculated(true);
    }, 2000);
  };

  const handleSaveRoute = () => {
    navigate("/myroutes");
  };

  const handleCancelRouteCreation = () => {
    setIsCreatingRoute(false);
    setSelectedDestinations([]);
    setRouteCalculated(false);  // important to switch back to URL image
    setLoading(false);          // just in case
  };


  return (
    <div className="relative w-full h-full min-h-[1000px] overflow-hidden rounded-xl shadow-md">
      <img
        src={
          routeCalculated
            ? "route.png"
            : "https://i.ibb.co/KjKFTMQL/lietuvos-zemelapis.png"
        }
        alt="Map background"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          loading ? "opacity-50 blur-sm" : ""
        }`}
      />

      {isCreatingRoute && (
        <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-md shadow-md">
          <div className="mb-4">
            <h3 className="font-bold">Maršruto informacija</h3>
            <p>Pradinė vieta: Studentu g. 48, Kaunas</p>
            <p>
              Pasirinktos vietos:{" "}
              {selectedDestinations
                .map((id) => attractions.find((attr) => attr.id === id)?.name)
                .join(", ")}
            </p>
            {routeCalculated && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" />
                  <p>Bendras atstumas: 392 km</p>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  <p className="font-medium">Pėsčiomis: 82 val.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-primary" />
                  <p className="font-medium">Automobiliu: 4 val. 59 min.</p>
                </div>
              </div>
            )}
          </div>
          {!routeCalculated ? (
            <Button onClick={handleCalculateRoute} disabled={loading}>
              {loading ? "Skaičiuojama..." : "Skaičiuoti optimalų maršrutą"}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSaveRoute}>Išsaugoti</Button>
              <Button variant="outline" onClick={handleCancelRouteCreation}>
                Atšaukti
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Only show attraction markers when not loading */}
      {!loading && attractions.map((attraction) => (
        <AttractionMarker
          key={attraction.id}
          attraction={attraction}
          isSelected={selectedDestinations.includes(attraction.id)}
          onClick={() => handleMarkerClick(attraction.id)}
        />
      ))}

      {/* Attraction detail dialog */}
      <AttractionDetail
        attraction={selectedAttraction}
        isOpen={detailOpen}
        onClose={handleCloseDetail}
      />

      {!isCreatingRoute && loggedIn && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            className="bg-white backdrop-blur-sm shadow-sm"
            onClick={handleCreateRoute}
          >
            <MapIcon className="mr-2 h-4 w-4" />
            Sukurti maršrutą
          </Button>
          <Link to="/myroutes">
            <Button
              variant="outline"
              className="bg-white backdrop-blur-sm shadow-sm"
            >
              Mano maršrutai
            </Button>
          </Link>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default Map;
