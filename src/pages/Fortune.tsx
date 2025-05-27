import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, User, Calendar, Scan } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { attractions } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const PREDICTION_MUSIC_PATH = "src/lib/waiting_music.mp3";

type MoonPhase =
  | "newMoon"
  | "waxingCrescent"
  | "firstQuarter"
  | "waxingGibbous"
  | "fullMoon"
  | "waningGibbous"
  | "lastQuarter"
  | "waningCrescent";

type Horoscope =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

type ScanStage = "ready" | "scanning" | "scanned" | "completed";

const FortunePage: React.FC = () => {
  const [moonPhase, setMoonPhase] = useState<MoonPhase>("fullMoon");
  const [horoscope, setHoroscope] = useState<Horoscope>("aries");
  const [birthYear, setBirthYear] = useState<string>("1990");
  const [scanStage, setScanStage] = useState<ScanStage>("ready");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestedAttraction, setSuggestedAttraction] = useState<any>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const { toast } = useToast();

  const predictionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const palmScanImages = [
    "https://www.wikihow.com/images/thumb/e/eb/Read-Palms-Step-3Bullet1.jpg/v4-728px-Read-Palms-Step-3Bullet1.jpg.webp",
    "https://www.wikihow.com/images/thumb/a/a2/Read-Palms-Step-4Bullet2.jpg/v4-728px-Read-Palms-Step-4Bullet2.jpg.webp",
    "https://www.wikihow.com/images/thumb/a/aa/Read-Palms-Step-5Bullet2.jpg/v4-728px-Read-Palms-Step-5Bullet2.jpg.webp",
    "https://www.wikihow.com/images/thumb/2/2c/Read-Palms-Step-6Bullet4.jpg/v4-728px-Read-Palms-Step-6Bullet4.jpg.webp",
  ];

  useEffect(() => {
    if (scanStage === "scanning") {
      toast({
        title: "Vyksta skenavimas",
        description: "Palaukite, skenuojamas jūsų delnas...",
      });

      const timeout = setTimeout(() => {
        const randomImageIndex = Math.floor(
          Math.random() * palmScanImages.length
        );
        setScanResult(palmScanImages[randomImageIndex]);
        setScanStage("scanned");

        toast({
          title: "Skenavimas baigtas",
          description: "Dabar galite burti savo ateitį!",
        });
      }, 5000); // 5 second delay

      return () => clearTimeout(timeout);
    }
  }, [scanStage, toast]);

  useEffect(() => {
    return () => {
      if (predictionTimeoutRef.current) {
        clearTimeout(predictionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    return () => {
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []);

  const handleScan = () => {
    const audioElement = audioRef.current;
    if (predictionTimeoutRef.current) {
      clearTimeout(predictionTimeoutRef.current);
      predictionTimeoutRef.current = null;
      if (audioElement && !audioElement.paused) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    }

    if (scanStage === "ready") {
      setScanStage("scanning");
    } else if (scanStage === "scanned" && !isPredicting) {
      setIsPredicting(true);

      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch((error) => {
          console.warn(
            "Audio autoplay was prevented for prediction music:",
            error
          );
        });
      }

      predictionTimeoutRef.current = setTimeout(() => {
        if (audioElement) {
          audioElement.pause();
          audioElement.currentTime = 0;
        }
        const moonValue = [
          "newMoon",
          "waxingCrescent",
          "firstQuarter",
          "waxingGibbous",
          "fullMoon",
          "waningGibbous",
          "lastQuarter",
          "waningCrescent",
        ].indexOf(moonPhase);
        const horoscopeValue = [
          "aries",
          "taurus",
          "gemini",
          "cancer",
          "leo",
          "virgo",
          "libra",
          "scorpio",
          "sagittarius",
          "capricorn",
          "aquarius",
          "pisces",
        ].indexOf(horoscope);
        const yearValue = parseInt(birthYear) % 100;

        const index =
          (moonValue + horoscopeValue + yearValue + attractions.length) %
          attractions.length;
        setSuggestedAttraction(attractions[index]);

        setIsPredicting(false);
        setIsOpen(true);

        setScanStage("ready");
        setScanResult(null);
        predictionTimeoutRef.current = null;

        toast({
          title: "Būrimas atliktas!",
          description: "Pagal jūsų duomenis, parinkta tinkamiausia vieta!",
        });
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <style>{`
        .prediction-in-progress-dialog > button[aria-label="Close"],
        .prediction-in-progress-dialog > button.absolute.right-4.top-4 {
          display: none !important;
        }
      `}</style>
      <audio ref={audioRef} src={PREDICTION_MUSIC_PATH} loop />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-center">
          <Moon className="inline-block mr-2 text-primary" /> Būrimas
        </h1>
        <p className="text-center text-muted-foreground mb-10">
          Pagal mėnulio fazę, delno skanavimą, horoskopą ir gimimo metus
          išbursime jums tinkamiausią lankytiną vietą!
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Įveskite savo duomenis būrimui</CardTitle>
            <CardDescription>
              Pateikite informaciją, pagal kurią išbursime jums tinkamiausią
              lankytiną vietą
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Moon Phase, Horoscope, Birth Year Selects remain the same */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Moon className="text-primary h-5 w-5" />
                <Label htmlFor="moonPhaseSelect">Mėnulio fazė</Label>
              </div>
              <Select
                value={moonPhase}
                onValueChange={(value) => setMoonPhase(value as MoonPhase)}
              >
                <SelectTrigger id="moonPhaseSelect">
                  <SelectValue placeholder="Pasirinkite mėnulio fazę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newMoon">Jaunatis</SelectItem>
                  <SelectItem value="waxingCrescent">
                    Priešpilnis (didėjantis)
                  </SelectItem>
                  <SelectItem value="firstQuarter">Pirmas ketvirtis</SelectItem>
                  <SelectItem value="waxingGibbous">Beveik pilnatis</SelectItem>
                  <SelectItem value="fullMoon">Pilnatis</SelectItem>
                  <SelectItem value="waningGibbous">Po pilnaties</SelectItem>
                  <SelectItem value="lastQuarter">
                    Paskutinis ketvirtis
                  </SelectItem>
                  <SelectItem value="waningCrescent">Delčia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="text-primary h-5 w-5" />
                <Label htmlFor="horoscopeSelect">Horoskopo ženklas</Label>
              </div>
              <Select
                value={horoscope}
                onValueChange={(value) => setHoroscope(value as Horoscope)}
              >
                <SelectTrigger id="horoscopeSelect">
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
                <Label htmlFor="birthYearSelect">Gimimo metai</Label>
              </div>
              <Select value={birthYear} onValueChange={setBirthYear}>
                <SelectTrigger id="birthYearSelect">
                  <SelectValue placeholder="Pasirinkite gimimo metus" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 80 }, (_, i) => 2025 - i).map(
                    (year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  )}
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
                style={{ height: "420px" }} // Increased height
              >
                {scanStage === "ready" && !scanResult && !isPredicting && (
                  <div className="text-center">
                    <Scan className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />{" "}
                    <p className="text-sm text-muted-foreground">
                      Pridėkite delną prie skenavimo ploto
                    </p>
                  </div>
                )}

                {scanStage === "scanning" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-lg">
                    <div className="h-full w-full relative overflow-hidden rounded-lg">
                      {" "}
                      <div
                        className="absolute top-0 h-full w-1 bg-primary animate-pulse"
                        style={{
                          boxShadow:
                            "0 0 10px 5px hsla(var(--primary, 222.2 47.4% 11.2%), 0.3)",
                          animation: "scanMove 2s linear infinite",
                        }}
                      ></div>
                      <style>{`
                        @keyframes scanMove {
                          0% { left: 0%; }
                          50% { left: calc(100% - 0.25rem); } /* 0.25rem is w-1 in Tailwind */
                          100% { left: 0%; }
                        }
                      `}</style>
                    </div>
                    <p className="absolute text-primary font-medium">
                      Skenuojama...
                    </p>
                  </div>
                )}

                {scanResult && scanStage === "scanned" && (
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
              disabled={scanStage === "scanning" || isPredicting}
            >
              {isPredicting ? (
                <>
                  <Moon className="mr-2 h-4 w-4 animate-spin" /> Buriama... 🎶
                </>
              ) : scanStage === "ready" ? (
                <>
                  <Scan className="mr-2 h-4 w-4" /> Skenuoti
                </>
              ) : scanStage === "scanning" ? (
                <>
                  <Scan className="mr-2 h-4 w-4 animate-pulse" /> Skenuojama...
                </>
              ) : scanStage === "scanned" ? (
                <>
                  <Moon className="mr-2 h-4 w-4" /> Burti
                </>
              ) : null}
            </Button>
          </CardContent>
        </Card>
      </div>

      {isPredicting && (
        <Dialog open={isPredicting}>
          <DialogContent
            className="prediction-in-progress-dialog flex flex-col items-center justify-center text-center p-10 sm:max-w-sm"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <Moon className="h-16 w-16 md:h-20 md:w-20 animate-spin text-primary mb-6" />
            <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
              Buriama...
            </DialogTitle>
            <DialogDescription className="text-md md:text-lg text-muted-foreground">
              Jūsų likimas netrukus paaiškės! 🎶
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Moon className="text-primary h-5 w-5" />
              Jūsų išburta vieta
            </DialogTitle>
            <DialogDescription>
              Pagal pateiktus duomenis, mėnulio fazę, horoskopą ir delno
              skaitymą
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
                <h3 className="text-lg font-semibold">
                  {suggestedAttraction.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {suggestedAttraction.category}
                </p>
                <p className="mt-2">{suggestedAttraction.description}</p>

                <div className="mt-4 pt-3 border-t">
                  <h4 className="text-sm font-medium mb-2">
                    Kodėl ši vieta jums tinka:
                  </h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {" "}
                    <li>
                      {horoscope === "aries"
                        ? " Jūsų avinui tinka aktyvios vietos"
                        : horoscope === "taurus"
                        ? " Jautis mėgsta komfortą ir gamtą"
                        : horoscope === "gemini"
                        ? " Dvyniams patinka dinamiškos ir socialios vietos"
                        : horoscope === "cancer"
                        ? " Vėžys jaučiasi geriausiai namų aplinkoje ar prie vandens"
                        : horoscope === "leo"
                        ? " Liūtui tinka prabangios ir dėmesio vertos vietos"
                        : horoscope === "virgo"
                        ? " Mergelei patinka tvarkingos ir struktūruotos erdvės"
                        : horoscope === "libra"
                        ? " Svarstyklėms svarbu estetika ir harmonija"
                        : horoscope === "scorpio"
                        ? " Skorpionui patinka paslaptingos ir gilios vietos"
                        : horoscope === "sagittarius"
                        ? " Šauliui patinka kelionės ir nuotykiai"
                        : horoscope === "capricorn"
                        ? " Ožiaragiui tinka struktūruotos, ambicingos vietos"
                        : horoscope === "aquarius"
                        ? " Vandenis mėgsta inovacijas ir nestandartines vietas"
                        : horoscope === "pisces"
                        ? " Žuvims patinka ramios, kūrybingos vietos"
                        : " Jūsų horoskopas rodo potraukį įvairioms vietoms"}
                    </li>
                    <li>
                      {moonPhase === "newMoon"
                        ? " Per jaunatį ši vieta suteikia atsinaujinimo jausmą"
                        : moonPhase === "waxingCrescent"
                        ? " Augančio pjautuvo metu čia tvyro viltis ir augimas"
                        : moonPhase === "firstQuarter"
                        ? " Per pirmą ketvirtį vieta įkvepia veikti"
                        : moonPhase === "waxingGibbous"
                        ? " Augančio beveik pilno mėnulio metu čia jaučiama įtampa prieš viršūnę"
                        : moonPhase === "fullMoon"
                        ? " Pilnaties metu ši vieta ypač magiška"
                        : moonPhase === "waningGibbous"
                        ? " Mažėjant mėnuliui vieta skatina apmąstymus"
                        : moonPhase === "lastQuarter"
                        ? " Per paskutinį ketvirtį tinka užbaigti pradėtus darbus"
                        : moonPhase === "waningCrescent"
                        ? " Mažėjantis pjautuvas skatina ramybę ir atsipalaidavimą"
                        : " Esama mėnulio fazė palankiausia šiai vietai"}
                    </li>
                    <li>
                      Jūsų gimimo metai ({birthYear}) kuria harmoniją su šia
                      vieta
                    </li>
                    <li>
                      Jūsų delno skenavimo rezultatas atskleidė ypatingą ryšį su
                      šia vieta
                    </li>
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
