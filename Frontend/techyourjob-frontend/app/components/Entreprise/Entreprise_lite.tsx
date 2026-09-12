"use client";

interface Entreprise {
  id: number;
  nom_compagnie: string;
  logo: string;
  type_entreprise: string;
  secteur_entreprise: string[];
  ville: string;
  nb_offre: number;
}

export default function Entreprise_lite({
  entreprise,
  onClick,
}: {
  entreprise: Entreprise;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-[#121212] border border-white/[0.05] rounded-2xl px-6 py-4 grid grid-cols-[56px_1fr_auto] gap-6 items-center cursor-pointer hover:border-zinc-700 hover:bg-[#161616] hover:translate-x-1 transition-all duration-300 group"
    >
      {/* Logo */}
      <div className="w-14 h-14 rounded-xl bg-zinc-800/50 border border-white/[0.05] flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
        {entreprise.logo ? (
          <img
            src={entreprise.logo}
            alt={entreprise.nom_compagnie}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-zinc-400 font-bold text-lg">
            {entreprise.nom_compagnie?.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-3">
          <p className="text-base font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">
            {entreprise.nom_compagnie}
          </p>
          <div className="h-1 w-1 rounded-full bg-zinc-700" />
          <p className="text-xs text-zinc-500 font-medium truncate">
            {entreprise.ville ? entreprise.ville.slice(2, -2) : "Non fourni"}
          </p>
        </div>
        <div className="flex gap-2">
          {(entreprise.secteur_entreprise || ["Non renseigné"])
            .slice(0, 3)
            .map((s, i) => (
              <span
                key={i}
                className="text-[10px] px-2.5 py-1 rounded-md bg-zinc-800/80 border border-white/[0.05] text-zinc-400 font-semibold uppercase tracking-wider"
              >
                {s}
              </span>
            ))}
        </div>
      </div>

      {/* Offres */}
      <div className="flex flex-col items-end gap-1">
        <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg">
          <p className="text-sm font-black text-purple-400">
            {entreprise.nb_offre ?? 0}
          </p>
        </div>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          offres
        </p>
      </div>
    </div>
  );
}
