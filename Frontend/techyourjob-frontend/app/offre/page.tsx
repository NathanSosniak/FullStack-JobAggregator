"use client";
import Header from "../components/NavBar/header";
import SearchBar from "../components/Autre/searchBar";
import Postlite from "../components/Offre/post-lite";
import SideBareFiltre from "../components/Offre/SideBareFiltre";
import Offre_Preview from "../components/Offre/Offre_Preview";

import { useState, useEffect } from "react";
import { Get_Offre } from "../services/Offres/Offre_Service";

// test
import dynamic from "next/dynamic";
import Footer from "../components/Autre/Footer";
const MapView = dynamic(() => import("../components/Offre/map_offre"), {
  ssr: false,
});

interface OffreFilterState {
  reverse: string;
  page: number;
  remote: string | null;
  contract: string | null;
  minsalary: number | null;
  maxsalary: number | null;
  location: string | null;
  distance: number | null;
  language: string | null;
  experience: number | null;
  age: number | null;
}

export default function Offre_Page() {
  // pour connaitre le dernier ID
  const [actuelId, setactuelId] = useState(1);

  //cordonnee de la recherche
  const [mapCentre, setMapCentre] = useState<[number, number]>([
    48.8566, 2.3522,
  ]);

  // tout les points des postes
  const [pointsPoste, setPointsPoste] = useState<any[]>([]);

  //  constante pour openOn envoie la liste des postes trouvés au composant parent
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // pour verifier si on recherche ou non
  const [isSearching, setIsSearching] = useState(false);

  const [FIltre, setFIltre] = useState<OffreFilterState>({
    reverse: "false",
    page: 1,
    remote: null,
    contract: null,
    minsalary: null,
    maxsalary: null,
    location: null,
    distance: null,
    language: null,
    experience: null,
    age: null,
  });

  // affichage de la map ou non selon si filtre loc ou distance active
  const showMap = FIltre.location !== null || FIltre.distance !== null;

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data =
          (await Get_Offre(
            FIltre.reverse,
            actuelId,
            FIltre.minsalary,
            FIltre.maxsalary,
            FIltre.location,
            FIltre.distance,
            FIltre.contract,
            FIltre.remote,
            FIltre.language,
            FIltre.experience,
            FIltre.age,
          )) || {};
        // setTest(Array.isArray(data) ? data : []);
        const posts = Array.isArray(data.posts) ? data.posts : [];
        setTest(posts);

        setPointsPoste(
          posts
            .filter((p: any) => p.latitude && p.longitude)
            // .map(p => [p.latitude, p.longitude] as [number, number])
            .map((p: any) => ({
              id: p.id_poste,
              lat: p.latitude,
              lon: p.longitude,
            })),
        );

        if (
          data.filters?.entry_lat != null &&
          data.filters?.entry_lon != null
        ) {
          setMapCentre([data.filters.entry_lat, data.filters.entry_lon]);
        }
      } catch (err) {
        console.error("Erreur API :", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [FIltre, actuelId]);

  // pour mettre els points a jour sur la map
  const updateMapPoints = (posts: any[]) => {
    setPointsPoste(
      posts
        .filter((p: any) => p.latitude && p.longitude)
        .map((p: any) => ({
          id: p.id_poste,
          lat: p.latitude,
          lon: p.longitude,
        })),
    );
  };

  const [selectedPost, setSelectedPost] = useState<any>(null);

  return (
    <div className="flex flex-col bg-[#242424] min-h-screen">
      <Header />

      {/* Barre de recherche */}
      <div className="flex bg-[#1A1A1A] py-8 border-b border-white/10">
        <div className="mx-auto">
          <SearchBar
            onSearchSuccess={(searchResults) => {
              setIsSearching(true);
              setTest(searchResults);
              updateMapPoints(searchResults);
            }}
            onResetSearch={() => {
              setIsSearching(false);
            }}
          />
        </div>
      </div>

      {/* Titre + bouton Filtres */}
      <div className="flex flex-row justify-between items-center px-15 py-5">
        <h1 className="font-bold text-2xl md:text-4xl">Recommandation Job</h1>
        <button className="text-sm text-gray-400 border border-white/15 px-4 py-2 rounded-full hover:border-white/30 transition-colors">
          Filtres
        </button>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-[0.6fr_2.4fr] mt-2">
        {/* Sidebar */}
        <div className="border-r border-white/10">
          <SideBareFiltre
            onFilterChange={(newFilters) =>
              setFIltre((prev) => ({ ...prev, ...newFilters }))
            }
          />
        </div>

        {showMap ? (
          <div className="px-5 py-2 h-[75vh]">
            <MapView
              location={mapCentre}
              distance={FIltre.distance}
              points={pointsPoste}
              onMarkerClick={(id) => {
                const poste = test.find((p) => p.id_poste === id);
                if (poste) {
                  setSelectedPost(poste);
                  setOpen(true);
                }
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-4 md:px-5 md:mr-8 py-2">
              {(test ?? []).map((item, i) => (
                <Postlite
                  key={i}
                  job={item}
                  onClick={() => {
                    setSelectedPost(item);
                    setOpen(true);
                  }}
                />
              ))}
            </div>

            <div className="flex flex-row justify-center gap-20 py-6">
              <button
                onClick={() => {
                  if (actuelId <= 1) return;
                  setFIltre((prev) => ({ ...prev, reverse: "true" }));
                  setactuelId(test[0]?.id_poste - 1);
                  console.log(actuelId);
                }}
                className="text-sm text-gray-400 border border-white/15 px-4 py-2 rounded-full hover:border-white/30 transition-colors"
              >
                Page précédente
              </button>
              <button
                onClick={() => {
                  setFIltre((prev) => ({ ...prev, reverse: "false" }));
                  setactuelId(test[test.length - 1]?.id_poste);
                }}
                className="text-sm text-gray-400 border border-white/15 px-4 py-2 rounded-full hover:border-white/30 transition-colors"
              >
                Page suivante
              </button>
            </div>
          </div>
        )}
      </div>

      {open && selectedPost && (
        <Offre_Preview onClose={() => setOpen(false)} Poste={selectedPost} />
      )}

      <Footer />
    </div>
  );
}
