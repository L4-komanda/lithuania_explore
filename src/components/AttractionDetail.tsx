import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useUserActions } from '@/lib/UserActionContext';
import { useToast } from '@/hooks/use-toast';
import { Attraction } from '@/lib/types';
import { Camera, Star, MapPin, Users, CalendarClock, Upload } from 'lucide-react';
import RatingDialog from './RatingDialog';


interface AttractionDetailProps {
  attraction: Attraction | null;
  isOpen: boolean;
  onClose: () => void;
}
const AttractionDetail: React.FC<AttractionDetailProps> = ({ 
  attraction, 
  isOpen, 
  onClose 
}) => {
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { 
      registerVisit, 
      hasVisited, 
      getVisitInfo,
      addReview,
      getReviewsForAttraction,
      addUploadedImage,
      getImagesForAttraction
    } = useUserActions();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('loggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('loggedIn', loggedIn.toString());
  }, [loggedIn]);

  if (!attraction) return null;

  const visitInfo = getVisitInfo(attraction.id);
  const isRegistered = hasVisited(attraction.id);

  const userReviews = getReviewsForAttraction(attraction.id);
  const userImages = getImagesForAttraction(attraction.id);
  
  const hasUserRated = userReviews.length > 0;

  const allReviews = [
    ...userReviews,
    // Mock reviews data (for existing display)
    ...[
      { id: 'r1', attractionId: attraction.id, userName: 'Petras J.', date: new Date('2023-05-15'), rating: 5, comment: 'Nuostabi vieta, verta aplankyti!' },
      { id: 'r2', attractionId: attraction.id, userName: 'Ona K.', date: new Date('2023-06-22'), rating: 4, comment: 'Labai gražu, bet pilna turistų.' },
      { id: 'r3', attractionId: attraction.id, userName: 'Tomas B.', date: new Date('2023-07-10'), rating: 5, comment: 'Fantastiška atmosfera ir vaizdai.' },
    ].filter(review => !userReviews.some(ur => ur.id === review.id))
  ];
  
  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((acc, review) => acc + review.rating, 0) / allReviews.length 
    : 0;
  
  // Mock gallery images (additional to the main image)
  const mockGalleryImages = [
    "https://images.unsplash.com/photo-1518803194621-27188ba362c9?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541410813355-b6b17fb6e7b8?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596395819057-e37d48e362b4?q=80&w=1000&auto=format&fit=crop"
  ];
  
  const allImages = [
    attraction.image,
    ...userImages.map(img => img.url),
    ...mockGalleryImages
  ];
  
  const handleRegister = () => {
    if (loggedIn) {
      registerVisit(attraction.id);
      setConfirmationOpen(true);
    }
    else {
      toast({
        title: "Prašome prisijungti",
        description: "Norėdami užregistruoti apsilankymą, pirmiausia prisijunkite.",
      });
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    toast({
      title: "Apsilankymas užregistruotas",
      description: `Jūs pažymėjote, kad aplankėte ${attraction.name}`,
    });
  };

  const handleUploadPhotos = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };
  
    const handleRatePlace = () => {
      setRatingDialogOpen(true);
    };
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        // Handle file upload (create URL for preview)
        Array.from(files).forEach(file => {
          const imageUrl = URL.createObjectURL(file);
          addUploadedImage(attraction.id, imageUrl);
        });
        
        toast({
          title: "Nuotraukos įkeltos",
          description: `Sėkmingai įkėlėte ${files.length} nuotrauką(-as)`,
        });
        
        // Switch to photos tab to show uploaded images
        setActiveTab("photos");
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  
    const handleRatingSubmit = (data: { rating: number; comment: string }) => {
        addReview(attraction.id, "Jonas P.", data.rating, data.comment);
      setRatingDialogOpen(false);
      
      toast({
        title: "Įvertinimas išsaugotas",
        description: "Ačiū už jūsų atsiliepimą!",
      });
      
      // Switch to reviews tab to show the new review
      setActiveTab("reviews");
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          {/* Hero image */}
          <div className="relative w-full h-48 sm:h-64">
            <img 
              src={attraction.image} 
              alt={attraction.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-bold">{attraction.name}</h2>
              <div className="flex items-center mt-1">
                <span className="mr-1">{averageRating.toFixed(1)}</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm opacity-80">({allReviews.length} atsiliepimai)</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-4 border-b sticky top-0 bg-white z-10">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="info">Informacija</TabsTrigger>
                  <TabsTrigger value="photos">Nuotraukos</TabsTrigger>
                  <TabsTrigger value="reviews">Atsiliepimai</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="info" className="p-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">{attraction.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Vieta</h4>
                      <p className="text-sm text-muted-foreground">
                        Adresas: {attraction.adress}
                      </p>
                    </div>
                  </div>

                  
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Lankytojai</h4>
                      <p className="text-sm text-muted-foreground">
                        42 žmonės pažymėjo, kad aplankė šią vietą
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Geriausias laikas aplankyti</h4>
                      <p className="text-sm text-muted-foreground">
                        Pavasaris–Vasara
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="photos" className="p-6">
                <Carousel className="w-full">
                  <CarouselContent>
                  {allImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex aspect-video items-center justify-center p-1">
                          <img
                            src={image}
                            alt={`${attraction.name} - Nuotrauka ${index + 1}`}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6">
                <div className="space-y-4">
                {allReviews.map(review => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                        <div className="font-medium">{review.userName}</div>
                          <div className="text-sm text-muted-foreground">
                          {review.date.toLocaleDateString('lt-LT')}
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="p-4 border-t">
            {isRegistered ? (
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  className="sm:flex-1 gap-2" 
                  onClick={handleUploadPhotos}
                >
                  <Upload size={18} />
                  <span>Įkelti nuotraukas</span>
                </Button>
                {!hasUserRated && (
                  <Button 
                    variant="outline" 
                    className="sm:flex-1 gap-2"
                    onClick={handleRatePlace}
                  >
                    <Star size={18} />
                    <span>Įvertinti vietą</span>
                  </Button>
                )}
                {/* Hidden file input for image upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={handleRegister}
              >
                Registruoti apsilankymą
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apsilankymas užregistruotas</DialogTitle>
            <DialogDescription>
              Jūs pažymėjote, kad aplankėte {attraction.name}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleCloseConfirmation}>
              Gerai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Rating dialog */}
      <RatingDialog
        isOpen={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        onSubmit={handleRatingSubmit}
        attractionName={attraction?.name || ''}
      />
    </>
  );
};

export default AttractionDetail;