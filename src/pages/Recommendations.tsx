import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Lightbulb } from "lucide-react";

const RecommendationsPage: React.FC = () => {
  const recommendedAttractions = [
    {
      id: "rec-1",
      name: "Birštono apžvalgos bokštas",
      reason: "Populiarus tarp panašaus amžiaus vartotojų",
      image:
        "https://www.visitbirstonas.lt/data/tourism_objects/landing/bokstas_2019_07_13_vaidotas_grigas__4_.jpg?v=1747140495",
    },
    {
      id: "rec-2",
      name: "Ventės ragas",
      reason: "Kadangi patiko Kuršių Nerija",
      image:
        "https://welovelithuania.com/content/uploads/2021/02/Vente_2021.jpg?v=1612639337",
    },
    {
      id: "rec-3",
      name: "Europos parkas",
      reason: "Mėgstantiems meną ir gamtą",
      image:
        "https://kelioniuklubas.lt/wp-content/uploads/2020/04/Europos-parkas.jpg",
    },
    {
    id: "rec-4",
    name: "Pūčkorių atodanga",
    reason: "Žinau, kaip tau patinka vaizdingi takai – čia tikrai sužavės panorama",
    image:
        "https://welovelithuania.com/content/uploads/2018/10/Puckoriai-2-1920x1280.jpg",
    },
    {
    id: "rec-5",
    name: "Pažaislio vienuolynas",
    reason: "Kandagi mėgstate ramybę: istorinė ir architektūrinė vertybė netoli Kauno marių",
    image:
        "https://www.visit.kaunas.lt/assets/Uploads/_resampled/FillWyIxMDUwIiwiNTI1Il0/Pazaislio-vienuolynas-A.Aleksandravicius-nuotr..jpg",
    },
    {
    id: "rec-6",
    name: "Žagarės regioninis parkas",
    reason: "Tau patiktų – mažai žmonių",
    image:
        "https://zemaitijosstd.lrv.lt/media/viesa/saugykla/2023/9/CnLBfKvmn0U.JPG",
    },
    {
    id: "rec-7",
    name: "Medžių lajų takas Anykščiuose",
    reason: "Tavo žvilgsnis dažnai klaidžioja - čia jis ras kur pakilti",
    image:
        "https://www.anyksciai.lt/data/public/uploads/2016/01/0.537541001453102748.jpg",
    },
    {
    id: "rec-8",
    name: "Raigardo slėnis (Druskininkai)",
    reason: "Tavo sielai reikia žalumos",
    image:
        "https://www.pamatyklietuvoje.lt/api/Photo/b88cee9a-5c96-416e-a91a-d88d42fa2b0e/0/3810/1462/resize",
    },

  
    
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight flex items-center justify-center">
            <Lightbulb className="w-8 h-8 mr-3 text-primary" />
            Jums Rekomenduojamos Vietos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Atraskite naujas įdomias Lietuvos vietas, parinktas specialiai jums!
            Ateityje šios rekomendacijos bus dar labiau pritaikytos pagal jūsų
            pomėgius ir aplankytas vietas.
          </p>
        </header>

        <section>
          {recommendedAttractions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedAttractions.map((attraction, index) => (
                <Card
                  key={attraction.id}
                  className="overflow-hidden transition-all hover:shadow-lg animate-slide-in group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <AspectRatio
                    ratio={16 / 9}
                    className="bg-muted rounded-t-lg overflow-hidden"
                  >
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </AspectRatio>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-xl tracking-tight">
                      {attraction.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-4">
                    <p className="text-sm text-muted-foreground">
                      {attraction.reason}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Šiuo metu neturime jums specialių rekomendacijų. Aplankykite
              daugiau vietų, kad galėtume geriau jus pažinti!
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default RecommendationsPage;
