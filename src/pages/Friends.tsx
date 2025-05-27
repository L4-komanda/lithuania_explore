import React, { useEffect, useState, useRef } from "react";
import { Users, UserPlus, Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FriendSwiper from "@/components/FriendSwiper"; // Assuming FriendSwiper can handle onAddFriend, myFriendIds, pendingRequestIds
import { Fireworks } from "fireworks-js";
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

// Avatar URLs and initial data (no changes here, kept for context)
const MariusAvatar =
  "https://tse2.mm.bing.net/th/id/OIP.VQFS87B9B6m48zndrdJtOwHaHa?pid=ImgDet&w=202&h=202&c=7";
const LauraAvatar =
  "https://th.bing.com/th/id/OIP.8Jgrql6AURBKuMQ9SjAoXwHaHa?w=187&h=187&c=7&r=0&o=5&pid=1.7";
const TomasAvatar =
  "https://th.bing.com/th/id/OIP.SUtrBgRKMnXlNTeEpHiLqwHaHa?w=188&h=187&c=7&r=0&o=5&pid=1.7";
const AnaAvatar =
  "https://th.bing.com/th?id=OIF.o6%2f5ERcNF5eObopA1P8Axw&w=180&h=180&c=7&r=0&o=5&pid=1.7";
const JonasAvatar =
  "https://th.bing.com/th/id/OIP.elHU6Jqw2_3tLuGYFyVdVwHaE8?w=300&h=200&c=7&r=0&o=5&pid=1.7";
const IevaAvatar =
  "https://th.bing.com/th/id/OIP.uFGte3ozCTi32NrdViW0fwHaHa?w=163&h=180&c=7&r=0&o=5&pid=1.7";
const RutaAvatar =
  "https://th.bing.com/th/id/OIP.McIG0719a1O6pm4uIoKcdAHaHP?w=170&h=180&c=7&r=0&o=5&pid=1.7";
const LinasAvatar =
  "https://th.bing.com/th/id/OIP.xXaWJJM-8ygqIB_-PpZSmAAAAA?w=215&h=180&c=7&r=0&o=5&pid=1.7";
const AgneAvatar =
  "https://th.bing.com/th/id/OIP.-FxlY_07bDKcByShVWx15gHaJD?w=159&h=194&c=7&r=0&o=5&pid=1.7";
const GitanasAvatar =
  "https://th.bing.com/th?id=OIF.ok7CSadh%2fEtpcK6PMGdI5A&w=177&h=180&c=7&r=0&o=5&pid=1.7";
const IngridaAvatar =
  "https://th.bing.com/th/id/OIP.DaiYyO5SixrLuwsn9sLv5gHaE8?w=272&h=181&c=7&r=0&o=5&pid=1.7";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
}

const initialMyFriendsData: Friend[] = [
  {
    id: "my-friend-1",
    name: "Marius Kazlauskas",
    avatar: MariusAvatar,
    status: "online",
  },
  {
    id: "my-friend-2",
    name: "Laura Petraitytė",
    avatar: LauraAvatar,
    status: "offline",
  },
  {
    id: "my-friend-3",
    name: "Tomas Jonaitis",
    avatar: TomasAvatar,
    status: "online",
  },
];

const invitationFriendsData: Friend[] = [
  {
    id: "invite-1",
    name: "Petras Kovalskis",
    avatar: AnaAvatar,
    status: "online",
  },
  {
    id: "invite-2",
    name: "Jonas Petraitis",
    avatar: JonasAvatar,
    status: "offline",
  },
  {
    id: "invite-3",
    name: "Ieva Jankauskienė",
    avatar: IevaAvatar,
    status: "online",
  },
  {
    id: "invite-4",
    name: "Linas Kleiza",
    avatar: LinasAvatar,
    status: "offline",
  },
];

const initialSuggestedFriendsData: Friend[] = [
  {
    id: "suggest-1",
    name: "Rūta Meilutytė",
    avatar: RutaAvatar,
    status: "online",
  },
  {
    id: "suggest-2",
    name: "Agnė Bilotaitė",
    avatar: AgneAvatar,
    status: "online",
  },
  {
    id: "suggest-3",
    name: "Gitanas Nausėda",
    avatar: GitanasAvatar,
    status: "online",
  },
  {
    id: "suggest-4",
    name: "Ingrida Šimonytė",
    avatar: IngridaAvatar,
    status: "offline",
  },
];

const FriendsPage: React.FC = () => {
  const [myFriends, setMyFriends] = useState<Friend[]>(initialMyFriendsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSwiper, setShowSwiper] = useState(false);
  const [clickedFriendIds, setClickedFriendIds] = useState<string[]>([]);
  const fireworksInstanceRef = useRef<Fireworks | null>(null);
  const { toast } = useToast(); // Initialize toast
  const [friendsForSwiper, setFriendsForSwiper] = useState<Friend[]>([]); // State for swiper content

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    window.scrollTo({ top: 0 });

    return () => {
      fireworksInstanceRef.current?.stop(true);
      fireworksInstanceRef.current = null;
    };
  }, []);

  const filteredMyFriends = myFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFriendFromSuggestion = (friendToAdd: Friend) => {
    if (
      myFriends.some((f) => f.id === friendToAdd.id) ||
      clickedFriendIds.includes(friendToAdd.id)
    ) {
      // Already a friend or request already sent
      return;
    }

    // Optimistically add to UI as 'request sent'
    // In a real app, this would become a friend after confirmation or stay as 'request sent'
    setClickedFriendIds((prev) => [...prev, friendToAdd.id]);

    // Simulate adding to friends for demo, or this could be an API call
    // For this example, we'll add to myFriends directly after a delay
    // to simulate a request being accepted, or just mark as 'request sent'.
    // The prompt says "Draugas pridėtas", so we add them to myFriends.
    setMyFriends((prev) => [...prev, friendToAdd]);

    toast({
      title: "Draugas pridėtas!",
      description: `${friendToAdd.name} sėkmingai pridėtas prie tavo draugų.`,
    });

    if (!fireworksInstanceRef.current) {
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100%";
      container.style.height = "100%";
      container.style.zIndex = "9999";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);

      fireworksInstanceRef.current = new Fireworks(container, {
        hue: { min: 0, max: 360 },
        delay: { min: 15, max: 30 },
        acceleration: 1.05,
        friction: 0.98,
        gravity: 1.5,
        particles: 70,
        explosion: 7,
        autoresize: true,
        brightness: { min: 50, max: 80 },
        decay: { min: 0.015, max: 0.03 },
      });

      fireworksInstanceRef.current.start();
      setTimeout(() => {
        fireworksInstanceRef.current?.stop(true);
        if (container.parentNode === document.body) {
          document.body.removeChild(container);
        }
        fireworksInstanceRef.current = null;
      }, 3000);
    }
  };

  const handleRemoveFriend = (friendIdToRemove: string) => {
    setMyFriends((prev) =>
      prev.filter((friend) => friend.id !== friendIdToRemove)
    );
    // Also remove from clickedFriendIds if they were just added and then removed
    setClickedFriendIds((prev) => prev.filter((id) => id !== friendIdToRemove));
  };

  const openSwiperForNewFriends = () => {
    const discoverableFriends = initialSuggestedFriendsData.filter(
      (potentialFriend) =>
        !myFriends.some((myFriend) => myFriend.id === potentialFriend.id) &&
        !clickedFriendIds.includes(potentialFriend.id)
    );
    setFriendsForSwiper(discoverableFriends);
    setShowSwiper(true);
  };

  const openSwiperForInvitations = () => {
    // Assuming invitationFriendsData are also people you can "add" (send a request to)
    // If they were incoming invites, FriendSwiper would need different logic
    const relevantInvitations = invitationFriendsData.filter(
      (potentialFriend) =>
        !myFriends.some((myFriend) => myFriend.id === potentialFriend.id) &&
        !clickedFriendIds.includes(potentialFriend.id)
    );
    setFriendsForSwiper(relevantInvitations);
    setShowSwiper(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <Toaster /> {/* Add Toaster component here */}
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <section className="mb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Draugai
            </h1>
            <p className="text-muted-foreground">
              Pridėkite naujus draugus, bendraukite ir kartu atraskite Lietuvą.
            </p>
          </div>
        </section>

        {/* Search and actions */}
        <section className="mb-8 animate-slide-in">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Ieškoti savo draugų..."
                className="w-full pl-10 py-2 border border-input bg-background rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={openSwiperForNewFriends} // Updated onClick handler
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Ieškoti naujų draugų
            </Button>
          </div>
        </section>

        {/* Friends list */}
        <section className="mb-8">
          <div className="glass-card rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-secondary/50 border-b border-border flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <h2 className="font-semibold">
                Mano draugai ({myFriends.length})
              </h2>
            </div>

            <div className="divide-y divide-border">
              {filteredMyFriends.length > 0 ? (
                filteredMyFriends.map((friend, index) => (
                  <div
                    key={friend.id}
                    className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${
                          friend.status === "online"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{friend.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {friend.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-primary hover:text-primary/80"
                      >
                        Rodyti profilį
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        onClick={() => handleRemoveFriend(friend.id)}
                        title="Atsisakyti draugystės"
                      >
                        <XCircle className="h-4 w-4 mr-1 sm:mr-0" />
                        <span className="hidden sm:inline ml-1">
                          Atsisakyti
                        </span>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>
                    {searchTerm
                      ? `Nerasta draugų pagal paiešką "${searchTerm}"`
                      : "Jūs kol kas neturite draugų."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Friend suggestions ("Kvietimai į draugus" section) */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Kvietimai į draugus</h2>
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary/5 hover:text-primary"
              onClick={openSwiperForInvitations} // Updated onClick handler
            >
              Peržiūrėti visus kvietimus
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {initialSuggestedFriendsData.slice(0, 6).map((friend, index) => {
              const isAlreadyFriend = myFriends.some(
                (mf) => mf.id === friend.id
              );
              // If they are a friend, 'clickedFriendIds' doesn't matter for "Request Sent" state.
              // "Request Sent" is only if they are NOT a friend, but a request IS pending.
              const isRequestSent =
                !isAlreadyFriend && clickedFriendIds.includes(friend.id);
              const isDisabled = isAlreadyFriend || isRequestSent;

              return (
                <div
                  key={friend.id}
                  className="glass-card rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 transition-all hover:shadow-lg animate-slide-in shadow-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="font-medium">{friend.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize mb-2">
                      {friend.status}
                    </p>
                    <Button
                      size="sm"
                      className={`mt-1 w-full sm:w-auto text-xs ${
                        isAlreadyFriend
                          ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
                          : isRequestSent
                          ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      }`}
                      onClick={() =>
                        !isDisabled && handleAddFriendFromSuggestion(friend)
                      }
                      disabled={isDisabled}
                    >
                      {isAlreadyFriend
                        ? "Jau draugas"
                        : isRequestSent
                        ? "Užklausa išsiųsta"
                        : "Pridėti draugą"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Friend swiper */}
        {showSwiper && (
          <FriendSwiper
            friends={friendsForSwiper}
            onClose={() => setShowSwiper(false)}
            onAddFriend={handleAddFriendFromSuggestion}
            myFriendIds={myFriends.map((f) => f.id)}
            pendingRequestIds={clickedFriendIds}
          />
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
