"use client";

import { useState, useEffect } from "react";
import "../globals.css";

interface Company {
  id_entreprise: number;
  nom_compagnie: string;
  logo: string | null;
}

export default function LogoCarousel() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // génère la liste des IDs (de 1 à 15)
    const ids = Array.from({ length: 15 }, (_, i) => i + 1);

    const fetchAll = async () => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}enterprise/${id}`).then(
              (res) => {
                if (!res.ok) throw new Error();
                return res.json();
              },
            ),
          ),
        );

        const validCompanies = results
          .filter(
            (r): r is PromiseFulfilledResult<Company> =>
              r.status === "fulfilled",
          )
          .map((r) => r.value);

        setCompanies(validCompanies);
      } catch (err) {
        console.error("Erreur logos :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading || companies.length === 0) {
    return <div className="h-16 w-full bg-white/5 animate-pulse rounded-lg" />;
  }

  // doublage du tableau pour l'effet de défilement infini
  const track = [...companies, ...companies];

  return (
    <div className="w-full overflow-hidden py-4">
      <div className="flex w-max items-center animate-[scroll_30s_linear_infinite]">
        {track.map((company, index) => (
          <div
            key={`${company.id_entreprise}-${index}`}
            className="mx-8 shrink-0"
          >
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.nom_compagnie}
                className="h-12 w-auto max-w-[140px] object-contain transition duration-300 rounded-full"
              />
            ) : (
              <span className="text-xs text-gray-400 font-medium">
                {company.nom_compagnie}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
