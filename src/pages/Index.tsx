import React, { useEffect, useState } from "react";
import Map from "@/components/Map";
import AttractionGallery from "@/components/AttractionGallery";
import { attractions } from "@/lib/data";
import { MapPin, Image } from "lucide-react";
import { Attraction as AttractionType } from "@/lib/types";

const IndexPage: React.FC = () => {
  const [selectedAttraction, setSelectedAttraction] =
    useState<AttractionType | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    window.scrollTo({ top: 0 });
  }, []);

  const openGallery = (attraction: AttractionType) => {
    setSelectedAttraction(attraction);
    setIsGalleryOpen(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <section className="mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Atraskite <span className="text-primary">Lietuvos</span>{" "}
              lankytinas vietas
            </h1>
            <p className="text-muted-foreground">
              Planuokite savo keliones, dalyvaukite lenktynėse ir atraskite
              nepakartojamą Lietuvos grožį
            </p>
          </div>

          {/* Main map */}
          <div className="relative animate-scale-in">
            <Map />
          </div>
        </section>

        {/* Featured attractions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Populiariausios vietos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.slice(0, 3).map((attraction, index) => (
              <div
                key={attraction.id}
                className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-md animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 py-1 px-2 rounded-full glass-card text-lg font-bold flex items-center">
                    <span>{attraction.rating}</span>
                    <span className="ml-1 text-yellow-500">★</span>
                  </div>
                  <button
                    onClick={() => openGallery(attraction)}
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors"
                  >
                    <Image className="w-5 h-5 text-primary" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {attraction.name}
                      </h3>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{attraction.category}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {attraction.description}
                  </p>
                  <button
                    className="mt-4 text-primary font-medium text-sm hover:underline"
                    onClick={() => openGallery(attraction)}
                  >
                    Plačiau →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery modal */}
        {selectedAttraction && (
          <AttractionGallery
            attraction={selectedAttraction}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default IndexPage;
