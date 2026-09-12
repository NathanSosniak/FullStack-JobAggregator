"use client";
import { useState } from "react";
import Offre_Preview from "../Offre/Offre_Preview";

export default function Entreprise_Preview({
  entreprise,
  onClose,
}: {
  entreprise: any;
  onClose: () => void;
}) {
  if (!entreprise) return null;

  const offres = entreprise.offre || [];

  // poste selectionner
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [open, setOpen] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-end transition-all duration-500"
      onClick={onClose}
    >
      <div
        className="bg-[#0a0a0a] h-full w-[580px] flex flex-col border-l border-white/[0.08] shadow-2xl overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-white/[0.05] bg-gradient-to-b from-purple-500/[0.03] to-transparent">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[1.5rem] bg-zinc-900 border border-white/[0.05] flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
                {entreprise.logo ? (
                  <img
                    src={entreprise.logo}
                    alt={entreprise.nom_compagnie}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-zinc-500 font-bold text-3xl">
                    {entreprise.nom_compagnie?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-black text-zinc-100 tracking-tight">
                  {entreprise.nom_compagnie}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-zinc-400 font-medium">
                    {entreprise.type_entreprise}
                  </p>
                  <div className="h-1 w-1 rounded-full bg-zinc-700" />
                  <p className="text-xs text-zinc-500 font-medium">
                    {entreprise.ville.slice(2, -2)}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/[0.05] text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all group"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:rotate-90 transition-transform"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Secteurs */}
          <div className="flex gap-2 flex-wrap">
            {(entreprise.secteur_entreprise || []).map((s: any, i: number) => (
              <span
                key={i}
                className="text-[10px] px-4 py-1.5 rounded-lg bg-zinc-900 border border-white/[0.05] text-zinc-300 font-bold uppercase tracking-wider"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 bg-zinc-900/30">
          {[
            {
              label: "Offres actives",
              value: entreprise.nb_offre ?? "0",
              highlight: true,
            },
            {
              label: "Ranking",
              value: entreprise.rank ? `#${entreprise.rank}` : "N/A",
            },
            {
              label: "Localisation",
              value: entreprise.ville.slice(2, -2) || "N/A",
            },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className="flex flex-col items-center py-6 border-r border-white/[0.05] last:border-r-0 justify-center text-center group hover:bg-white/[0.02] transition-colors"
            >
              <p
                className={`text-lg font-black tracking-tight ${
                  highlight ? "text-purple-400" : "text-zinc-100"
                }`}
              >
                {value}
              </p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="p-8 border-b border-white/[0.05]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-3 bg-purple-500 rounded-full" />
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              À propos
            </p>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            {entreprise.nom_compagnie} est une entreprise visionnaire évoluant
            dans le secteur{" "}
            <span className="text-zinc-200">
              {(entreprise.secteur_entreprise || [])[0] || "non renseigné"}
            </span>
            , basée à {entreprise.ville.slice(2, -2) || "Non reseigné"}. Elle
            cultive une culture d'innovation et propose actuellement{" "}
            {entreprise.nb_offre ?? 0} opportunités de carrière pour rejoindre
            ses équipes.
          </p>
        </div>

        {/* Offres */}
        <div className="p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3 bg-purple-500 rounded-full" />
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                Offres disponibles
              </p>
            </div>
            <span className="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded border border-purple-500/20 font-black">
              {offres.length}
            </span>
          </div>

          {offres.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/[0.05] rounded-[2rem]">
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
                Aucune offre disponible
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {offres.map((offre: any) => (
                <div
                  key={offre.id_poste}
                  onClick={() => {
                    setSelectedPost(offre);
                    setOpen(true);
                  }}
                  className="bg-zinc-900/50 border border-white/[0.05] rounded-2xl px-6 py-5 flex items-center justify-between hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer transition-all group"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">
                      {offre.display_name_fr}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {offre.since_posted}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-black text-purple-400">
                      {offre.salaire_annuel_moyen || "Non renseigné"}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
                      / an
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {open && selectedPost && (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <Offre_Preview onClose={() => setOpen(false)} Poste={selectedPost} />
        </div>
      )}
    </div>
  );
}
