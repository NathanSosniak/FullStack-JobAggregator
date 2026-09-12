"use client";

import { useState, useEffect } from "react";

import Header from "../components/NavBar/header";
import Entreprise_Preview from "../components/Entreprise/Entreprise_Complet";
import SideBareEntreprise from "../components/Entreprise/FIltre_entreprise";
import Entreprise_lite from "../components/Entreprise/Entreprise_lite";

import { Get_Enterprises } from "../services/Entreprise/Get_Enterprises";
import { Get_Enterprise_Top } from "../services/Entreprise/Top_X_entreprise";
import Footer from "../components/Autre/Footer";

export default function Entreprise_All() {
  // const entreprise
  const [entreprises, setEntreprises] = useState<any[]>([]);
  const [topEntreprises, setTopEntreprises] = useState<any[]>([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState<any>(null);

  // save des id
  const [startId, setStartId] = useState(0);
  const [history, setHistory] = useState<number[]>([0]);

  // pour les filtres
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sectors: null,
    types: null,
  });

  // pour le top des entreprises
  useEffect(() => {
    const fetchTop = async () => {
      const top = await Get_Enterprise_Top(5);
      setTopEntreprises(top);
    };
    fetchTop();
  }, []);

  // pour les pages
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 5;

  // on va recuperer X entreprise et on gere les filtres pour aller recharger
  useEffect(() => {
    const fetchEntreprises = async () => {
      setLoading(true);
      try {
        const data = await Get_Enterprises(
          false,
          startId,
          filters.sectors || undefined,
          filters.types || undefined,
        );
        setEntreprises(data);
      } catch {
        setEntreprises([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEntreprises();
  }, [filters, startId]);

  const handleFilterChange = (newFilter: any) => {
    setFilters((prev) => ({ ...prev, ...newFilter }));
    setPage(0);
  };

  const Top = topEntreprises[0];
  const petite = topEntreprises.slice(1);

  return (
    <div className="flex flex-col bg-[#0a0a0a] min-h-screen text-zinc-400">
      <Header />

      {/* Entreprises a la une */}
      <div className="px-8 py-8 border-b border-white/[0.05]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-4 bg-purple-500 rounded-full" />
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500">
            Entreprises à la une
          </h2>
        </div>

        {Top && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4">
            <div
              onClick={() => setSelectedEntreprise(Top)}
              className="bg-[#121212] border border-purple-500/20 rounded-[2rem] p-6 flex flex-col justify-between cursor-pointer hover:border-purple-500/40 hover:bg-[#161616] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-900/20 border border-purple-500/20 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                    {Top.logo ? (
                      <img
                        src={Top.logo}
                        alt={Top.nom_compagnie}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-purple-400 font-bold text-lg">
                        {Top.nom_compagnie?.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100 tracking-tight group-hover:text-purple-400 transition-colors">
                      {Top.nom_compagnie}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      {Top.type_entreprise} - {Top.ville}
                    </p>
                  </div>
                </div>
                <div className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-1 rounded-md border border-purple-500/20 font-bold uppercase tracking-wider">
                  Featured
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  {(Top.secteur_entreprise || [])
                    .slice(0, 2)
                    .map((s: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] px-3 py-1 rounded-lg bg-zinc-800/50 border border-white/[0.05] text-zinc-300 font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                    Offres
                  </span>
                  <span className="text-lg font-black text-purple-400 leading-none">
                    {Top.nb_offre ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {petite.map((e: any) => (
              <div
                key={e.id_entreprise}
                onClick={() => setSelectedEntreprise(e)}
                className="bg-[#121212] border border-white/[0.05] rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer hover:bg-[#161616] hover:border-zinc-700 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-white/[0.05] flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                  {e.logo ? (
                    <img
                      src={e.logo}
                      alt={e.nom_compagnie}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-zinc-400 font-bold text-sm">
                      {e.nom_compagnie?.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">
                    {e.nom_compagnie}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {e.ville}
                    </p>
                    <span className="text-xs font-bold text-purple-500/80">
                      {e.nb_offre ?? 0} offres
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-[300px_1fr] bg-[#0d0d0d]">
        <div className="border-r border-white/[0.05] bg-[#0a0a0a]/50 backdrop-blur-sm">
          <SideBareEntreprise onFilterChange={handleFilterChange} />
        </div>
        <div className="flex flex-col bg-[#0d0d0d]">
          <div className="flex flex-row justify-between items-center px-10 py-6">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                Toutes les entreprises
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Découvrez les entreprises qui recrutent dans la tech
              </p>
            </div>
            <div className="bg-zinc-800/50 px-4 py-1.5 rounded-full border border-white/[0.05]">
              <span className="text-xs font-bold text-zinc-300">
                {entreprises.length} entreprises
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-8 pb-10">
            {entreprises.map((item: any) => (
              <Entreprise_lite
                onClick={() => setSelectedEntreprise(item)}
                key={item.id_entreprise}
                entreprise={item}
              />
            ))}
            {!loading && (
              <div className="flex items-center justify-between px-2 pt-4">
                <button
                  disabled={history.length <= 1}
                  onClick={() => {
                    const prev = [...history];
                    prev.pop();
                    setHistory(prev);
                    setStartId(prev[prev.length - 1]);
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-full border border-white/[0.05] bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Précédent
                </button>
                <span className="text-xs text-zinc-500 font-medium">
                  Page {page + 1}
                </span>
                <button
                  disabled={entreprises.length < 5}
                  onClick={() => {
                    const lastId =
                      entreprises[entreprises.length - 1]?.id_entreprise;
                    if (lastId != null) {
                      setHistory((prev) => [...prev, lastId + 1]);
                      setStartId(lastId + 1);
                    }
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-full border border-white/[0.05] bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            )}
            {selectedEntreprise && (
              <Entreprise_Preview
                entreprise={selectedEntreprise}
                onClose={() => setSelectedEntreprise(null)}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
