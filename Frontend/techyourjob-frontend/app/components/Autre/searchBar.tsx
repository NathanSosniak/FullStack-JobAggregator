"use client";

import { useEffect, useState } from "react";

import { CiSearch } from "react-icons/ci";
import { searchPosts } from "@/app/services/Offres/Search_Offre";

export default function SearchBar({
  onSearchSuccess,
  onResetSearch,
}: {
  onSearchSuccess: (posts: any[]) => void;
  onResetSearch: () => void;
}) {
  // on declare les constante qui servent pour notre fonction de recherche de filtre
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // recherche
  const handleSearch = async () => {
    // si la bare est vide on affiche ceux de base
    if (!query.trim()) {
      onResetSearch();
      return;
    }

    // va rechercher les postes
    try {
      const data = await searchPosts(query, page);

      // on renvoie le tableau directement comme le backend l'envoi
      const posts = Array.isArray(data) ? data : [];

      // on envoie els postes
      onSearchSuccess(posts);
    } catch (err) {
      console.error("Erreur API searchposte :", err);
    }
  };

  // pour lancer la recherche
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-[#1C1C1C] border border-white/15 w-[550px] h-14 rounded-full flex items-center px-2 pl-5 gap-3">
        <CiSearch className="text-[#717171] text-xl shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Métier, titre, mot clé..."
          className="bg-transparent text-white placeholder-[#717171] text-sm flex-1 outline-none"
        />

        <div className="h-5 md:h-6 w-px bg-white/20 shrink-0" />

        <button
          onClick={handleSearch}
          className="bg-[#8308D4] text-white text-sm font-semibold px-6 h-10 rounded-full shrink-0 hover:bg-[#9a0af5] transition-colors"
        >
          <span className="hidden xs:inline">Recherche</span>
          <span className="xs:hidden">Rechercher</span>
        </button>
      </div>
    </div>
  );
}
