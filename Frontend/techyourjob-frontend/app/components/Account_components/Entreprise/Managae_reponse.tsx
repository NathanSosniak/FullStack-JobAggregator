"use client";

import { useEffect, useState } from "react";
import { Get_Fichier_Candidature } from "@/app/services/Test_Feature/Get_Fichier_Candidature";
import AddTestTechnique from "./AJouter_test_technique";
import { Get_Enterprise } from "@/app/services/Test_Feature/Get_Poste_Entreprise";
import { Get_Info_Test } from "@/app/services/Test_Feature/Offre_Service";
import { Update_Stats_User } from "@/app/services/Data/Update_stats";

// pour toute les offres
interface Poste {
  id_poste: number;
  display_name_fr: string;
}

export default function Reponse_candidats() {
  //pr les postes
  const [postes, setPostes] = useState<Poste[]>([]);
  const [selectedPoste, setSelectedPoste] = useState<number | null>(null);

  // tt les candidats
  const [candidats, setCandidats] = useState<Record<string, string[]>>({});

  // poste des l'entreprise
  useEffect(() => {
    const fetchPostes = async () => {
      const data = await Get_Enterprise(1);
      setPostes(data?.offre ?? []);
    };
    fetchPostes();
  }, []);

  const handleSelectePoste = async (ID_Poste: number) => {
    setSelectedPoste(ID_Poste);
    await Get_info_test(ID_Poste);
  };

  // info pour les test technique
  const [status, setStatus] = useState("");

  const Get_info_test = async (ID_POste: number) => {
    try {
      const data = await Get_Info_Test(ID_POste);
      setStatus(data.statut);
    } catch (err: any) {
      // regle le pb dans les logs
      if (err?.message?.includes("404")) {
        setStatus("en_attente");
      } else {
        console.error(
          "Vraie erreur technique lors de la récupération du test :",
          err,
        );
        setStatus("en_attente");
      }
    }
  };

  // au lancement on va chercher les fichiers de s candidats pour le le moment on prend que le poste numero 1
  useEffect(() => {
    if (selectedPoste === null) {
      setCandidats({});
      return;
    }
    const fetchCandidats = async () => {
      const data = await Get_Fichier_Candidature(selectedPoste);
      const fichiers: string[] = data?.fichier_candidats ?? [];

      const grouped: Record<string, string[]> = {};
      for (const f of fichiers) {
        const parts = f.split("/");
        const userKey = parts.slice(1, 2).join("/");
        if (!grouped[userKey]) grouped[userKey] = [];
        grouped[userKey].push(f);
      }
      setCandidats(grouped);
    };
    fetchCandidats();
  }, [selectedPoste]);

  // pour laner le test d'un utilisateur
  const handleLancer = async (fichierPaths: string[]) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/docker/start`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fichierPaths }),
      },
    );
    const { url } = await res.json();
    window.open(url, "_blank");
  };

  // les user donc les datas
  const users = Object.entries(candidats);

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a] flex justify-center items-start p-4 pt-12">
      <div className="flex flex-col lg:flex-row bg-[#242424] rounded-3xl p-6 w-full max-w-[900px] gap-5">
        {/* liste des offre a gauche */}
        <div className="lg:w-[280px] shrink-0 flex flex-col gap-2">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
            Offres
          </span>
          <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
            {postes.length === 0 ? (
              <p className="text-white/15 text-xs text-center py-4">
                Aucune offre
              </p>
            ) : (
              postes.map((poste) => (
                <button
                  key={poste.id_poste}
                  onClick={() => handleSelectePoste(poste.id_poste)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    selectedPoste === poste.id_poste
                      ? "bg-white/10 border-white/20 text-white font-semibold"
                      : "bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
                  }`}
                >
                  {poste.display_name_fr}
                </button>
              ))
            )}
          </div>
        </div>

        {/* partie des candidature */}
        <div className="flex-1">
          {selectedPoste === null ? (
            /* aucune offre selectionner */
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <p className="text-white/15 text-sm">Sélectionnez une offre</p>
            </div>
          ) : status === "publie" ? (
            /* le test est publie alors on montre les candidatures */
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_80px] gap-3 px-4 py-3 border-b border-white/10">
                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                  Candidat
                </span>
                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                  Fichiers
                </span>
                <span></span>
              </div>

              {users.length === 0 ? (
                <p className="text-white/15 text-xs text-center py-8">
                  Aucun candidat
                </p>
              ) : (
                users.map(([userKey, fichiers]) => {
                  const userId = parseInt(userKey.split("_")[1]);
                  return (
                    <div
                      key={userKey}
                      className="grid grid-cols-[1fr_auto_80px] gap-3 px-4 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex flex-wrap gap-2 items-center">
                        <button
                          onClick={async () => {
                            try {
                              window.open(`/account?user=${userId}`, "_blank");
                              await Update_Stats_User(userId, {
                                nb_vues_profil: 1,
                              });
                            } catch (err) {
                              console.error("Erreur stats refus :", err);
                            }
                          }}
                          className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border border-white/10 transition-all"
                        >
                          Voir
                        </button>
                        <button
                          onClick={async () => {
                            window.alert("Candidature acceptee !");
                            try {
                              await Update_Stats_User(userId, {
                                candidatures_positives: 1,
                              });
                            } catch (err) {
                              console.error("Erreur stats refus :", err);
                            }
                          }}
                          className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border border-emerald-500/20 transition-all"
                        >
                          Valider
                        </button>
                        <button
                          onClick={async () => {
                            window.alert("Candidature refusée !");
                            try {
                              await Update_Stats_User(userId, {
                                candidatures_refusees: 1,
                              });
                            } catch (err) {
                              console.error("Erreur stats positives :", err);
                            }
                          }}
                          className="bg-red-500/15 hover:bg-red-500/25 text-red-400 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg border border-red-500/20 transition-all"
                        >
                          Refuser
                        </button>
                      </div>
                      <span className="text-white/40 text-xs whitespace-nowrap">
                        {fichiers.length} fichier(s)
                      </span>
                      <button
                        onClick={() => handleLancer(fichiers)}
                        className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-lg border border-indigo-500/20 transition-all"
                      >
                        Lancer
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* une offre est selectionner mis aucun test n'existe */
            <AddTestTechnique
              ID_poste={selectedPoste}
              onSuccess={() => handleSelectePoste(selectedPoste)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
