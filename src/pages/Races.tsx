import React, { useEffect } from "react";
import { races, pastRaces } from "@/lib/data";
import RaceCard from "@/components/RaceCard";
import { Race } from "@/lib/types";

const RacesPage: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 md:pb-8 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <section className="mb-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Lenktynės ir maratonai
            </h1>
            <p className="text-muted-foreground">
              Dalyvaukite įvairiose lenktynėse ir bėgimo renginiuose visoje
              Lietuvoje, įveikite naujus iššūkius ir pasiekite savo tikslus.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Artėjančios lenktynės</h2>
          {races && races.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {races.map((race: Race, index: number) => (
                <div
                  key={race.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RaceCard race={race} />{" "}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-xl p-6 text-center">
              <p className="text-muted-foreground">
                Šiuo metu nėra artėjančių lenktynių.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Praėjusios lenktynės</h2>
          {pastRaces && pastRaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastRaces.map((race: Race, index: number) => (
                <div
                  key={race.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <RaceCard race={race} isPast={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-xl p-6 text-center">
              <p className="text-muted-foreground">
                Šiuo metu nėra praėjusių lenktynių istorijos.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RacesPage;
