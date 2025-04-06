
import React, { useEffect, useState } from 'react';
import { currentUser, races, friends } from '@/lib/data';
import { User, MapPin, Flag, Settings, Users, Award, Calendar, ChevronRight, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProfilePage: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    window.scrollTo({ top: 0 });
  }, []);

  const [selectedRace, setSelectedRace] = useState<string | null>(null);

  const registeredRaces = races.filter(race => 
    race.participants.includes(currentUser.id)
  );

  const getRaceStatus = (raceDate: string) => {
    const now = new Date();
    const raceTime = new Date(raceDate);
    
    if (now > raceTime) {
      return "Pasibaigusios";
    } else {
      return "Einamos";
    }
  };

  const getRemainingTime = (raceDate: string) => {
    const now = new Date();
    const raceTime = new Date(raceDate);
    
    if (now > raceTime) {
      return "Lenktynės baigtos";
    }
    
    const diff = raceTime.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getRaceDetails = (raceId: string) => {
    const race = races.find(r => r.id === raceId);
    if (!race) return null;
    
    const isFinished = new Date() > new Date(race.date);
    
    return {
      leadingParticipants: [
        { id: 'user-5', name: 'Petras Jonaitis', position: 1, time: '1:23:45' },
        { id: 'user-8', name: 'Ona Petraitienė', position: 2, time: '1:24:12' },
        { id: 'user-1', name: 'Jonas Petraitis', position: 3, time: '1:25:30' },
      ],
      remainingStages: isFinished ? 0 : 2,
      totalStages: 5,
      userPosition: isFinished ? 3 : null,
      stageProgress: isFinished ? 100 : 60,
    };
  };

  const selectedRaceDetails = selectedRace ? getRaceDetails(selectedRace) : null;

  return (
    <div className="pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-6 animate-slide-in">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                </div>
                <h1 className="text-2xl font-bold mb-1">{currentUser.name}</h1>
                <p className="text-muted-foreground text-sm mb-4">{currentUser.email}</p>
                
                <div className="flex gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{registeredRaces.length}</div>
                    <div className="text-xs text-muted-foreground">Lenktynės</div>
                  </div>
                  <div className="h-10 border-l border-border"></div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{friends.length}</div>
                    <div className="text-xs text-muted-foreground">Draugai</div>
                  </div>
                  <div className="h-10 border-l border-border"></div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">0</div>
                    <div className="text-xs text-muted-foreground">Aplankytos vietos</div>
                  </div>
                </div>
                
                <button className="flex items-center text-sm gap-1 text-primary hover:text-primary/80 font-medium">
                  <Settings className="w-4 h-4" />
                  <span>Redaguoti profilį</span>
                </button>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 animate-slide-in mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Draugai</h2>
              </div>
              
              <div className="divide-y divide-border">
                {friends.map(friend => (
                  <div key={friend.id} className="flex items-center gap-3 py-2">
                    <div className="relative">
                      <img src={friend.avatar} alt={friend.name} className="h-8 w-8 rounded-full" />
                      <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{friend.name}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{friend.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium">
                Peržiūrėti visus
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="results" className="animate-slide-in">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="results">Lenktynių rezultatai</TabsTrigger>
                <TabsTrigger value="visited">Aplankytos vietos</TabsTrigger>
                <TabsTrigger value="awards">Apdovanojimai</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-6">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Flag className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">Asmeniniai rezultatai</h2>
                    </div>
                    
                    <select className="px-3 py-1 text-sm rounded-md border border-input bg-background">
                      <option value="all">Visos lenktynės</option>
                      <option value="current">Einamos</option>
                      <option value="finished">Pasibaigusios</option>
                    </select>
                  </div>
                  
                  {registeredRaces.length > 0 ? (
                    <div className="space-y-4">
                      {registeredRaces.map(race => (
                        <div 
                          key={race.id} 
                          className={`p-4 rounded-lg border transition-colors ${
                            selectedRace === race.id ? 'bg-secondary border-primary' : 'border-border hover:bg-secondary/50'
                          }`}
                          onClick={() => setSelectedRace(race.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{race.name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  getRaceStatus(race.date) === "Einamos" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {getRaceStatus(race.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{new Date(race.date).toLocaleDateString('lt-LT')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{race.location.name}</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                              selectedRace === race.id ? 'rotate-90' : ''
                            }`} />
                          </div>
                          
                          {selectedRace === race.id && selectedRaceDetails && (
                            <div className="mt-4 pt-4 border-t border-border space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div>
                                  <div className="text-sm text-muted-foreground mb-1">Laikas iki starto</div>
                                  <div className="font-medium">{getRemainingTime(race.date)}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-muted-foreground mb-1">Etapai</div>
                                  <div className="font-medium">
                                    {selectedRaceDetails.remainingStages > 0 
                                      ? `${selectedRaceDetails.totalStages - selectedRaceDetails.remainingStages}/${selectedRaceDetails.totalStages}` 
                                      : `${selectedRaceDetails.totalStages}/${selectedRaceDetails.totalStages} (Baigta)`
                                    }
                                  </div>
                                </div>
                                {selectedRaceDetails.userPosition && (
                                  <div>
                                    <div className="text-sm text-muted-foreground mb-1">Jūsų vieta</div>
                                    <div className="font-medium">{selectedRaceDetails.userPosition}</div>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Progresas</div>
                                <Progress value={selectedRaceDetails.stageProgress} className="h-2" />
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium mb-2">Pirmaujantys dalyviai</div>
                                <div className="bg-muted/30 rounded-lg overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="w-10">#</TableHead>
                                        <TableHead>Vardas</TableHead>
                                        <TableHead className="text-right">Laikas</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedRaceDetails.leadingParticipants.map(participant => (
                                        <TableRow key={participant.id} className={participant.id === currentUser.id ? "bg-primary/10" : ""}>
                                          <TableCell>{participant.position}</TableCell>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              {participant.id === currentUser.id && (
                                                <span className="text-xs text-primary font-medium">JŪS</span>
                                              )}
                                              {participant.name}
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-right">{participant.time}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                {getRaceStatus(race.date) === "Einamos" && (
                                  <button className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90">
                                    Fiksuoti etapą
                                  </button>
                                )}
                                <button className="px-3 py-1.5 text-sm font-medium bg-secondary text-foreground rounded-md hover:bg-secondary/80">
                                  Pilna informacija
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <p>Nėra užregistruotų lenktynių rezultatų</p>
                      <button className="mt-2 text-primary hover:underline">
                        Naršyti lenktynes
                      </button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="visited" className="space-y-6">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Aplankytos vietos</h2>
                  </div>
                  
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Dar neturite aplankytų vietų</p>
                    <button className="mt-2 text-primary hover:underline">
                      Naršyti lankytinas vietas
                    </button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="awards" className="space-y-6">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Apdovanojimai</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-secondary/50 p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium">Pirma registracija</h3>
                      <p className="text-xs text-muted-foreground mt-1">Užsiregistravote į pirmąsias lenktynes</p>
                    </div>
                    
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="rounded-lg bg-muted/30 p-4 flex flex-col items-center text-center opacity-60">
                        <div className="h-12 w-12 bg-muted/50 rounded-full flex items-center justify-center mb-2">
                          <Award className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium">???</h3>
                        <p className="text-xs text-muted-foreground mt-1">Dar neatrakintas apdovanojimas</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
