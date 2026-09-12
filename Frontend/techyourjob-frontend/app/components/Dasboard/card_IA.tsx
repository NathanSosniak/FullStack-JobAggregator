"use client";

import { useEffect, useState } from "react";
import Offre_Preview from "../Offre/Offre_Preview";
import { Get_Unique_Offre } from "@/app/services/Offres/Offre_Unique_Service";

interface Poste {
  id_poste: number;
  titre: string;
  skills_clean: string;
  salaire_min: number | null;
  salaire_max: number | null;
  description?: string;
  logo?: string;
}

export default function JobRecommendations() {
  const [results, setResults] = useState<Poste[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // pour le poste selextionner
  const [selectedPoste, setSelectedPoste] = useState<Poste | null>(null);
  // pour le chargement d'une offre
  const [loadingOffreId, setLoadingOffreId] = useState<number | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) {
        setError("Vous devez être connecté pour voir les recommandations.");
        return;
      }
      if (res.status === 400) {
        const body = await res.json().catch(() => ({}));
        setError(
          body.error ||
            "Votre profil est incomplet. Ajoutez vos compétences pour obtenir des recommandations.",
        );
        return;
      }
      if (res.status === 503) {
        setError(
          "Le service de recommandation est temporairement indisponible. Réessayez dans quelques instants.",
        );
        return;
      }
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}`);
      }
      const data: Poste[] = await res.json();
      setResults(data);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // quand on click sur un poste
  const handleSelectPoste = async (poste: Poste) => {
    try {
      setLoadingOffreId(poste.id_poste);

      // on get les infos de l'offre
      const donneesCompletes = await Get_Unique_Offre(poste.id_poste);

      // on fuse les infos avec celle qu'on a deja sinon la description ca pete un cable
      setSelectedPoste({
        ...poste,
        ...donneesCompletes,
        description: donneesCompletes.description || poste.description,
      });
    } catch (err) {
      console.error(
        "Impossible de récupérer les détails complets de l'offre :",
        err,
      );
      setSelectedPoste(poste);
    } finally {
      setLoadingOffreId(null);
    }
  };

  const formatSalaire = (poste: Poste): string | null => {
    if (poste.salaire_min && poste.salaire_max)
      return `${poste.salaire_min} - ${poste.salaire_max} k€`;
    if (poste.salaire_min) return `À partir de ${poste.salaire_min} k€`;
    if (poste.salaire_max) return `Jusqu'à ${poste.salaire_max} k€`;
    return null;
  };

  return (
    // recommandation
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Recommandations</h1>
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="text-sm text-gray-500 hover:text-gray-800 disabled:opacity-40 transition-colors"
        >
          ↻ Actualiser
        </button>
      </div>
      <p className="text-gray-500 mb-6 text-sm">
        Offres sélectionnées en fonction de votre profil.
      </p>

      {/* chargement en mode grille */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl p-4 animate-pulse bg-white shadow-sm"
            >
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="flex flex-wrap gap-1 mb-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-5 bg-gray-100 rounded w-12" />
                ))}
              </div>
              <div className="h-3 bg-gray-100 rounded w-1/3 mt-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Erreur */}
      {!loading && error && (
        <div className="text-center py-10">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button
            onClick={fetchRecommendations}
            className="text-sm text-blue-500 hover:underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* affichage des offres en grille */}
      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.slice(0, 6).map((poste) => (
            <div
              key={poste.id_poste}
              onClick={() => handleSelectPoste(poste)}
              className="flex flex-col justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md hover:border-blue-200 cursor-pointer"
            >
              <div>
                <h2 className="font-semibold text-base mb-2 line-clamp-2 text-gray-900">
                  {poste.titre}
                </h2>

                {poste.skills_clean && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {poste.skills_clean
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-100"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {formatSalaire(poste) && (
                <p className="text-sm font-medium text-gray-600 mt-auto pt-2 border-t border-gray-50">
                  {formatSalaire(poste)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Si aucun resultat */}
      {!loading && !error && results.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-10">
          Aucune recommandation disponible.
        </p>
      )}

      {/* // pour afficher le poste */}
      {selectedPoste && (
        <Offre_Preview
          Poste={selectedPoste}
          onClose={() => setSelectedPoste(null)}
        />
      )}
    </div>
  );
}
