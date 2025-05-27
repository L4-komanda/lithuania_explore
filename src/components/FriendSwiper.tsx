import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Check,
  User,
  UserCheck, // Added for "Already Friend"
  Send, // Added for "Request Sent"
} from "lucide-react";
// Ensure Friend type is correctly imported, matching FriendsPage
// For example: import { Friend } from "@/lib/types"; or define it if not shared
// Assuming the Friend interface from FriendsPage is:
interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
}
import { useToast } from "@/components/ui/use-toast"; // Assuming this path is correct

interface FriendSwiperProps {
  friends: Friend[];
  onClose: () => void;
  onAddFriend: (friend: Friend) => void; // New prop
  myFriendIds: string[]; // New prop
  pendingRequestIds: string[]; // New prop
}

const FriendSwiper: React.FC<FriendSwiperProps> = ({
  friends,
  onClose,
  onAddFriend,
  myFriendIds,
  pendingRequestIds,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // If no friends are passed, or the list becomes empty, show a message and close.
    if (!friends || friends.length === 0) {
      toast({
        title: "Nėra pasiūlymų",
        description: "Šiuo metu nėra naujų draugų pasiūlymų.",
      });
      onClose();
    }
  }, [friends, onClose, toast]);

  // Early return if friends list is empty to prevent errors
  if (!friends || friends.length === 0) {
    return null;
  }

  const currentFriend = friends[currentIndex];

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setDirection("left");
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setDirection("");
      }, 300);
    }
  };

  const goToNext = () => {
    if (currentIndex < friends.length - 1) {
      setDirection("right");
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setDirection("");
      }, 300);
    } else {
      toast({
        title: "Nėra daugiau profilių",
        description: "Jūs peržiūrėjote visus galimus draugus šiame sąraše.",
      });
      // Optionally close swiper after last card view attempt:
      // onClose();
    }
  };

  const handleLike = () => {
    if (currentFriend) {
      // Call the onAddFriend prop passed from FriendsPage
      // This function will handle the actual adding logic, toast, and fireworks
      onAddFriend(currentFriend);
      goToNext(); // Proceed to the next card
    }
  };

  const handleSkip = () => {
    goToNext();
  };

  // Determine the state of the "Like" button
  const isAlreadyFriend =
    currentFriend && myFriendIds.includes(currentFriend.id);
  const isRequestSent =
    currentFriend &&
    !isAlreadyFriend && // Only consider "request sent" if not already a friend
    pendingRequestIds.includes(currentFriend.id);
  const likeButtonDisabled = isAlreadyFriend || isRequestSent;

  let likeButtonTitle = "Pridėti į draugus";
  let LikeIcon = Check;

  if (isAlreadyFriend) {
    likeButtonTitle = "Jau draugas";
    LikeIcon = UserCheck;
  } else if (isRequestSent) {
    likeButtonTitle = "Užklausa išsiųsta";
    LikeIcon = Send;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="relative w-full max-w-md overflow-hidden shadow-xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="relative h-[500px] overflow-y-auto no-scrollbar">
          {currentFriend && ( // Ensure currentFriend exists before rendering its details
            <div
              className={`absolute inset-0 transition-transform duration-300 ease-out ${
                direction === "left"
                  ? "translate-x-full"
                  : direction === "right"
                  ? "-translate-x-full"
                  : ""
              }`}
              // Add a key to force re-render on friend change, ensuring animation resets properly
              key={currentFriend.id}
            >
              <div className="relative h-64 bg-gradient-to-b from-primary/20 to-background">
                <img
                  src={currentFriend.avatar}
                  alt={currentFriend.name}
                  className="w-full h-full object-cover object-center opacity-80"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-32" />
              </div>

              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">{currentFriend.name}</h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1 text-sm">
                    <User className="h-4 w-4" />
                    <span>ID: {currentFriend.id.slice(-6)}</span>{" "}
                    {/* Show partial ID for brevity */}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        currentFriend.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <div>
                      <p className="font-medium">Statusas</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {currentFriend.status}
                      </p>
                    </div>
                  </div>

                  <div className="bg-secondary/50 p-3 rounded-lg">
                    <p className="text-center text-sm text-muted-foreground">
                      Čia galėtų būti daugiau informacijos apie šį vartotoją,
                      pvz. pomėgiai, lankytinos vietos, mėgstamos veiklos ir
                      t.t.
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-card flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            aria-label="Ankstesnis"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-14 w-14 border-destructive text-destructive hover:bg-destructive/10"
            onClick={handleSkip}
            aria-label="Praleisti"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={`rounded-full h-14 w-14 border-green-500 text-green-500 hover:bg-green-500/10
              ${
                likeButtonDisabled
                  ? "opacity-60 cursor-not-allowed !border-muted !text-muted-foreground hover:!bg-transparent"
                  : ""
              }`}
            onClick={handleLike}
            disabled={likeButtonDisabled}
            title={likeButtonTitle}
            aria-label={likeButtonTitle}
          >
            <LikeIcon className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={goToNext}
            disabled={currentIndex >= friends.length - 1}
            aria-label="Sekantis"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {friends.length > 1 && ( // Only show dots if there's more than one card
          <div className="absolute bottom-[calc(theme(spacing.16)_+_theme(spacing.4)_+_1px)] left-0 right-0 flex justify-center gap-1 pb-2">
            {/* Positioned above the control buttons footer */}
            {friends.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FriendSwiper;
