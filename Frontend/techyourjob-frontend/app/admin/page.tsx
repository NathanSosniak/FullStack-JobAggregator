"use client";

import { useState } from "react";
import { Rechercher_user } from "../services/Admin/Search_User";
import { Update_Privilege } from "../services/Admin/Elevation_User";
import { Delete_User } from "../services/Admin/Delete_User";
import { Delete_Entreprise } from "../services/Admin/Delete_Entreprise";
import { Rechercher_entreprise } from "../services/Admin/Search_entreprise";
import { Delete_Poste } from "../services/Admin/Delete_Poste";
import { Rechercher_poste } from "../services/Admin/Search_poste";

const AdminDashboard = () => {
  interface User {
    id_utilisateur: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
  }

  // user part
  const [user_search, setUser_search] = useState("");
  const [user, setUser] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  //affichage role dispo
  const [isUpd, setIsUpd] = useState<number | null>(null);

  // entreprise part
  const [entreprise_search, setEntreprise_search] = useState("");
  interface Entreprise {
    id_entreprise: number;
    nom_compagnie: string;
  }
  const [entreprise, setEntreprise] = useState<Entreprise[]>([]);

  // poste part
  interface Poste {
    id_poste: number;
    titre: string;
    nom_compagnie?: string;
    type_contrat?: string;
  }
  const [poste, setPoste] = useState<Poste[]>([]);
  //offres
  const [searchOffre, setSearchOffre] = useState("");

  // fonction de recherche
  const handleSearch = async (what: string) => {
    setLoading(true);
    try {
      if (what == "user") {
        const data = await Rechercher_user(user_search);
        setUser(data);
      }
      if (what == "entreprise") {
        const data = await Rechercher_entreprise(entreprise_search);
        setEntreprise(data);
      }
      if (what == "poste") {
        const data = await Rechercher_poste(searchOffre);
        setPoste(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // pour supprimer un utilisateur
  const handeDelete_user = async (userId: number) => {
    setLoading(true);
    try {
      await Delete_User(userId);
      setUser((prev) => prev.filter((u) => u.id_utilisateur !== userId));
      setIsUpd(null);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // pour changer de role un utilisateur
  const handleRoleChange = async (userId: number, role: string) => {
    try {
      await Update_Privilege(userId, role);
      setUser((prev) =>
        prev.map((u) => (u.id_utilisateur === userId ? { ...u, role } : u)),
      );
      setIsUpd(null);
    } catch (err) {
      console.error(err);
    }
  };

  // pour supprimer une entreprise
  const handleDelete_entreprise = async (id: number) => {
    setLoading(true);
    try {
      await Delete_Entreprise(id);
      setEntreprise((prev) => prev.filter((e) => e.id_entreprise !== id));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // pour supprimer un poste
  const handleDetele_poste = async (id: number) => {
    setLoading(true);
    try {
      await Delete_Poste(id);
      setPoste((prev) => prev.filter((p) => p.id_poste !== id));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#242424] min-h-screen font-sans text-[#8e8e8e] p-4 md:p-8">
      {/* le title */}

      <div className="mx-auto mb-10 px-4">
        <h1 className="text-3xl font-extrabold text-[#7288c9] tracking-tight">
          Admin / Tech Your Job
        </h1>
      </div>

      {/* div globale pr les colonnes */}
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/*offres*/}
        <div className="bg-[#2c2c2c] p-6 rounded-3xl shadow-xl">
          <h2 className="text-[#7288c9] font-bold text-lg mb-4 px-2">
            Annonces
          </h2>

          {/* la tite barre de recherche */}
          <input
            type="text"
            placeholder="Chercher une offre..."
            value={searchOffre}
            onChange={(e) => setSearchOffre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch("poste")}
            className="w-full bg-[#242424] border border-[#8e8e8e]/20 text-[#8e8e8e] text-sm rounded-full px-4 py-2 mb-6 focus:outline-none focus:border-[#7288c9]/50 transition"
          />

          <div className="space-y-4">
            {/* on a enleve le filter, just un map normal */}
            {loading ? (
              <p className="text-[#8e8e8e] text-xs text-center py-4">
                Recherche...
              </p>
            ) : poste.length === 0 ? (
              <p className="text-[#8e8e8e]/40 text-xs text-center py-4">
                Aucun poste trouvé
              </p>
            ) : (
              // partie des postes
              poste.map((off) => (
                <div
                  key={off.id_poste}
                  className="bg-[#242424] border border-[#8e8e8e]/20 p-5 rounded-2xl transition hover:border-[#7288c9]/50"
                >
                  <h3 className="font-bold text-white text-md">{off.titre}</h3>

                  <p className="text-sm text-[#8e8e8e] mt-1">
                    {off.nom_compagnie} / {off.type_contrat}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => handleDetele_poste(off.id_poste)}
                      className="flex-1 bg-[#7288c9] text-[#242424] font-bold py-2 rounded-full text-s hover:opacity-90 transition"
                    >
                      Supprimer le poste
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* utilisateurs */}

        <div className="bg-[#2c2c2c] p-6 rounded-3xl shadow-xl">
          <h2 className="text-[#7288c9] font-bold text-lg mb-4 px-2">
            Utilisateurs
          </h2>

          {/* barre de recherche user */}
          <input
            type="text"
            placeholder="Chercher un utilisateur..."
            value={user_search}
            onChange={(e) => setUser_search(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch("user")}
            className="w-full bg-[#242424] border border-[#8e8e8e]/20 text-[#8e8e8e] text-sm rounded-full px-4 py-2 mb-6 focus:outline-none focus:border-[#7288c9]/50 transition"
          />

          <div className="space-y-4">
            {/* on a enleve le filter ici aussi */}
            {loading ? (
              <p className="text-[#8e8e8e] text-xs text-center py-4">
                Recherche...
              </p>
            ) : user.length === 0 ? (
              <p className="text-[#8e8e8e]/40 text-xs text-center py-4">
                {user_search.length >= 2
                  ? "Aucun utilisateur trouvé"
                  : "Essayer avec + de 2 caracteres"}
              </p>
            ) : (
              // partie des users
              user.map((usr) => (
                <div
                  key={usr.id_utilisateur}
                  className="bg-[#242424] border border-[#8e8e8e]/20 p-5 rounded-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white">
                        {usr.prenom} {usr.nom}
                      </h3>
                      <p className="text-[10px] text-[#8e8e8e] truncate">
                        {usr.email}
                      </p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#7288c9]/20 text-[#7288c9] font-bold uppercase">
                      {usr.role}
                    </span>
                  </div>
                  <div className="flex gap-2 flax-row">
                    <button
                      onClick={() => handeDelete_user(usr.id_utilisateur)}
                      className="flex-1 bg-[#2c2c2c] border border-[#7288c9] text-[#7288c9] py-2 rounded-full text-[15px] font-bold hover:bg-[#7288c9] hover:text-[#242424] transition"
                    >
                      Supprimer l'utilisateur
                    </button>
                    <button
                      onClick={() =>
                        setIsUpd(
                          isUpd === usr.id_utilisateur
                            ? null
                            : usr.id_utilisateur,
                        )
                      }
                      className="flex-1 bg-[#2c2c2c] border border-[#7288c9] text-[#7288c9] py-2 rounded-full text-[15px] font-bold hover:bg-[#7288c9] hover:text-[#242424] transition"
                    >
                      Elever les privilèges
                    </button>
                  </div>
                  {isUpd === usr.id_utilisateur && (
                    <div className="flex gap-2 mt-5 flax-row">
                      <button
                        onClick={() =>
                          handleRoleChange(usr.id_utilisateur, "user")
                        }
                        className="flex-1 bg-[#2c2c2c] border border-[#7288c9] text-[#7288c9] py-2 rounded-full text-[15px] font-bold hover:bg-[#7288c9] hover:text-[#242424] transition"
                      >
                        User
                      </button>
                      <button
                        onClick={() =>
                          handleRoleChange(usr.id_utilisateur, "enterprise")
                        }
                        className="flex-1 bg-[#2c2c2c] border border-[#7288c9] text-[#7288c9] py-2 rounded-full text-[15px] font-bold hover:bg-[#7288c9] hover:text-[#242424] transition"
                      >
                        Entreprise
                      </button>
                      <button
                        onClick={() =>
                          handleRoleChange(usr.id_utilisateur, "admin")
                        }
                        className="flex-1 bg-[#2c2c2c] border border-[#7288c9] text-[#7288c9] py-2 rounded-full text-[15px] font-bold hover:bg-[#7288c9] hover:text-[#242424] transition"
                      >
                        Admin
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* boites*/}
        <div className="bg-[#2c2c2c] p-6 rounded-3xl shadow-xl">
          <h2 className="text-[#7288c9] font-bold text-lg mb-4 px-2">
            Partenaires
          </h2>

          {/* barre de recherche boite */}
          <input
            type="text"
            placeholder="Chercher une boite..."
            value={entreprise_search}
            onChange={(e) => setEntreprise_search(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch("entreprise")}
            className="w-full bg-[#242424] border border-[#8e8e8e]/20 text-[#8e8e8e] text-sm rounded-full px-4 py-2 mb-6 focus:outline-none focus:border-[#7288c9]/50 transition"
          />

          <div className="space-y-4">
            {/* et ici aussi le filter est parti */}
            {loading ? (
              <p className="text-[#8e8e8e] text-xs text-center py-4">
                Recherche...
              </p>
            ) : entreprise.length === 0 ? (
              <p className="text-[#8e8e8e]/40 text-xs text-center py-4">
                Aucune entreprise trouvée
              </p>
            ) : (
              // partie des entreprises
              entreprise.map((ent) => (
                <div
                  key={ent.id_entreprise}
                  className="bg-[#242424] border border-[#8e8e8e]/20 p-5 rounded-2xl"
                >
                  <h3 className="font-bold text-white">{ent.nom_compagnie}</h3>
                  <button
                    onClick={() => handleDelete_entreprise(ent.id_entreprise)}
                    className="w-full mt-4 bg-white/5 border border-[#8e8e8e]/30 text-[#7288c9] py-2 rounded-full font-bold hover:bg-[#7288c9] hover:text-[#242424] transition"
                  >
                    Supprimer l'entreprise
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
