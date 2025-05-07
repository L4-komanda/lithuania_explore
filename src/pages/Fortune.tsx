
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, User, Calendar, Scan } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { attractions } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type MoonPhase = 'newMoon' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous' | 
                'fullMoon' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent';

type Horoscope = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 
                'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

type ScanStage = 'ready' | 'scanning' | 'scanned' | 'completed';

const FortunePage: React.FC = () => {
  const [moonPhase, setMoonPhase] = useState<MoonPhase>('fullMoon');
  const [horoscope, setHoroscope] = useState<Horoscope>('aries');
  const [birthYear, setBirthYear] = useState<string>('1990');
  const [scanStage, setScanStage] = useState<ScanStage>('ready');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestedAttraction, setSuggestedAttraction] = useState<any>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const { toast } = useToast();

  const palmScanImages = [
    'https://www.wikihow.com/images/thumb/e/eb/Read-Palms-Step-3Bullet1.jpg/v4-728px-Read-Palms-Step-3Bullet1.jpg.webp',
    'https://www.wikihow.com/images/thumb/a/a2/Read-Palms-Step-4Bullet2.jpg/v4-728px-Read-Palms-Step-4Bullet2.jpg.webp',
    'https://www.wikihow.com/images/thumb/a/aa/Read-Palms-Step-5Bullet2.jpg/v4-728px-Read-Palms-Step-5Bullet2.jpg.webp',
    'https://www.wikihow.com/images/thumb/2/2c/Read-Palms-Step-6Bullet4.jpg/v4-728px-Read-Palms-Step-6Bullet4.jpg.webp'
  ];

  useEffect(() => {
    if (scanStage === 'scanning') {
      toast({
        title: "Vyksta skenavimas",
        description: "Palaukite, skenuojamas jūsų delnas...",
      });
      
      const timeout = setTimeout(() => {
        const randomImageIndex = Math.floor(Math.random() * palmScanImages.length);
        setScanResult(palmScanImages[randomImageIndex]);
        setScanStage('scanned');
        
        toast({
          title: "Skenavimas baigtas",
          description: "Dabar galite burti savo ateitį!",
        });
      }, 5000); // 5 second delay
      
      return () => clearTimeout(timeout);
    }
  }, [scanStage, toast]);

  const handleScan = () => {
    if (scanStage === 'ready') {
      setScanStage('scanning');
    } else if (scanStage === 'scanned') {
      // Handle fortune telling
      const moonValue = ['newMoon', 'waxingCrescent', 'firstQuarter', 'waxingGibbous', 
                      'fullMoon', 'waningGibbous', 'lastQuarter', 'waningCrescent'].indexOf(moonPhase);
      const horoscopeValue = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                            'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'].indexOf(horoscope);
      const yearValue = parseInt(birthYear) % 100;
      
      // Use all values to create a seemingly complex but actually deterministic selection
      const index = (moonValue + horoscopeValue + yearValue) % attractions.length;
      setSuggestedAttraction(attractions[index]);
      setIsOpen(true);
      setScanStage('ready');
      setScanResult(null);
      
      toast({
        title: "Būrimas atliktas",
        description: "Pagal jūsų duomenis, parinkta tinkamiausia vieta!",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-center">
          <Moon className="inline-block mr-2 text-primary" /> Būrimas
        </h1>
        <p className="text-center text-muted-foreground mb-10">
          Pagal mėnulio fazę, delno skanavimą, horoskopą ir gimimo metus išbursime jums tinkamiausią lankytiną vietą!
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Įveskite savo duomenis būrimui</CardTitle>
            <CardDescription>
              Pateikite informaciją, pagal kurią išbursime jums tinkamiausią lankytiną vietą
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Moon className="text-primary h-5 w-5" />
                <Label>Mėnulio fazė</Label>
              </div>
              <Select value={moonPhase} onValueChange={(value) => setMoonPhase(value as MoonPhase)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite mėnulio fazę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newMoon">Jaunatis</SelectItem>
                  <SelectItem value="waxingCrescent">Priešpilnis (didėjantis)</SelectItem>
                  <SelectItem value="firstQuarter">Pirmas ketvirtis</SelectItem>
                  <SelectItem value="waxingGibbous">Beveik pilnatis</SelectItem>
                  <SelectItem value="fullMoon">Pilnatis</SelectItem>
                  <SelectItem value="waningGibbous">Po pilnaties</SelectItem>
                  <SelectItem value="lastQuarter">Paskutinis ketvirtis</SelectItem>
                  <SelectItem value="waningCrescent">Delčia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="text-primary h-5 w-5" />
                <Label>Horoskopo ženklas</Label>
              </div>
              <Select value={horoscope} onValueChange={(value) => setHoroscope(value as Horoscope)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite horoskopo ženklą" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aries">Avinas</SelectItem>
                  <SelectItem value="taurus">Jautis</SelectItem>
                  <SelectItem value="gemini">Dvyniai</SelectItem>
                  <SelectItem value="cancer">Vėžys</SelectItem>
                  <SelectItem value="leo">Liūtas</SelectItem>
                  <SelectItem value="virgo">Mergelė</SelectItem>
                  <SelectItem value="libra">Svarstyklės</SelectItem>
                  <SelectItem value="scorpio">Skorpionas</SelectItem>
                  <SelectItem value="sagittarius">Šaulys</SelectItem>
                  <SelectItem value="capricorn">Ožiaragis</SelectItem>
                  <SelectItem value="aquarius">Vandenis</SelectItem>
                  <SelectItem value="pisces">Žuvys</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary h-5 w-5" />
                <Label>Gimimo metai</Label>
              </div>
              <Select value={birthYear} onValueChange={setBirthYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Pasirinkite gimimo metus" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 80 }, (_, i) => 2025 - i).map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scan className="text-primary h-5 w-5" />
                <Label>Delno skenavimas</Label>
              </div>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-3 cursor-pointer hover:border-primary transition-colors relative" 
                style={{height: "220px"}}
              >
                {scanStage === 'ready' && !scanResult && (
                  <div className="text-center">
                    <Scan className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Pridėkite delną prie skenavimo ploto</p>
                  </div>
                )}

                {scanStage === 'scanning' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-lg">
                    <div className="h-full w-full relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-full w-1 bg-primary animate-pulse shadow-lg" 
                        style={{
                          animation: "scanMove 5s linear",
                          boxShadow: "0 0 10px 5px rgba(var(--primary), 0.3)"
                        }}></div>
                      <style >{`
                        @keyframes scanMove {
                          0% { left: 0; }
                          50% { left: 100%; }
                          100% { left: 0; }
                        }
                      `}</style>
                    </div>
                    <p className="absolute text-primary font-medium">Skenuojama...</p>
                  </div>
                )}

                {scanResult && scanStage === 'scanned' && (
                  <div className="h-full w-full">
                    <img 
                      src={scanResult} 
                      alt="Scan result" 
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleScan}
              disabled={scanStage === 'scanning'}
            >
              {scanStage === 'ready' && (
                <>
                  <Scan className="mr-2 h-4 w-4" /> Skenuoti
                </>
              )}
              {scanStage === 'scanning' && (
                <>
                  <Scan className="mr-2 h-4 w-4 animate-pulse" /> Skenuojama...
                </>
              )}
              {scanStage === 'scanned' && (
                <>
                  <Moon className="mr-2 h-4 w-4" /> Burti
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Suggestion Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Moon className="text-primary h-5 w-5" />
              Jūsų išburta vieta
            </DialogTitle>
            <DialogDescription>
              Pagal pateiktus duomenis, mėnulio fazę, horoskopą ir delno skaitymą
            </DialogDescription>
          </DialogHeader>
          
          {suggestedAttraction && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={suggestedAttraction.image} 
                  alt={suggestedAttraction.name} 
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold">{suggestedAttraction.name}</h3>
                <p className="text-muted-foreground text-sm">{suggestedAttraction.category}</p>
                <p className="mt-2">{suggestedAttraction.description}</p>
                
                <div className="mt-4 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">Kodėl ši vieta jums tinka:</h4>
                  <ul className="text-sm space-y-1">
                  <li>•
                    {horoscope === 'aries' ? ' Jūsų avinui tinka aktyvios vietos' :
                    horoscope === 'taurus' ? ' Jautis mėgsta komfortą ir gamtą' :
                    horoscope === 'gemini' ? ' Dvyniams patinka dinamiškos ir socialios vietos' :
                    horoscope === 'cancer' ? ' Vėžys jaučiasi geriausiai namų aplinkoje ar prie vandens' :
                    horoscope === 'leo' ? ' Liūtui tinka prabangios ir dėmesio vertos vietos' :
                    horoscope === 'virgo' ? ' Mergelei patinka tvarkingos ir struktūruotos erdvės' :
                    horoscope === 'libra' ? ' Svarstyklėms svarbu estetika ir harmonija' :
                    horoscope === 'scorpio' ? ' Skorpionui patinka paslaptingos ir gilios vietos' :
                    horoscope === 'sagittarius' ? ' Šauliui patinka kelionės ir nuotykiai' :
                    horoscope === 'capricorn' ? ' Ožiaragiui tinka struktūruotos, ambicingos vietos' :
                    horoscope === 'aquarius' ? ' Vandenis mėgsta inovacijas ir nestandartines vietas' :
                    horoscope === 'pisces' ? ' Žuvims patinka ramios, kūrybingos vietos' :
                    ' Jūsų horoskopas rodo potraukį įvairioms vietoms'}
                    </li>                   
                    <li>•
                    {moonPhase === 'newMoon' ? ' Per jaunatį ši vieta suteikia atsinaujinimo jausmą' :
                    moonPhase === 'waxingCrescent' ? ' Augančio pjautuvo metu čia tvyro viltis ir augimas' :
                    moonPhase === 'firstQuarter' ? ' Per pirmą ketvirtį vieta įkvepia veikti' :
                    moonPhase === 'waxingGibbous' ? ' Augančio beveik pilno mėnulio metu čia jaučiama įtampa prieš viršūnę' :
                    moonPhase === 'fullMoon' ? ' Pilnaties metu ši vieta ypač magiška' :
                    moonPhase === 'waningGibbous' ? ' Mažėjant mėnuliui vieta skatina apmąstymus' :
                    moonPhase === 'lastQuarter' ? ' Per paskutinį ketvirtį tinka užbaigti pradėtus darbus' :
                    moonPhase === 'waningCrescent' ? ' Mažėjantis pjautuvas skatina ramybę ir atsipalaidavimą' :
                    ' Esama mėnulio fazė palankiausia šiai vietai'}
                    </li>
                    <li>• Jūsų gimimo metai ({birthYear}) kuria harmoniją su šia vieta</li>
                    <li>• Jūsų delno skenavimo rezultatas atskleidė ypatingą ryšį su šia vieta</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Uždaryti</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FortunePage;
