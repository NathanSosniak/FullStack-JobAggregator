"use client";
import { useState, useEffect } from "react";
import { Get_Unique_Offre } from "../../services/Offres/Offre_Unique_Service";

import { MdOutlinePlace, MdHomeWork } from "react-icons/md";
import { TbBrandDaysCounter } from "react-icons/tb";
import { IoFileTray } from "react-icons/io5";
import { FaBookmark, FaTimes, FaBriefcase } from "react-icons/fa";

import Test_Technique from "../Technique/Test_Technique";

export default function Offre_Preview({
  onClose,
  Poste,
}: {
  onClose: () => void;
  Poste: Record<string, any>;
}) {
  const [DataPoste, setDataPoste] = useState<Record<string, any>>({});
  const [isTestOpen, setIsTestOpen] = useState(false);

  const [Langue, setLangue] = useState("None");
  useEffect(() => {
    async function load() {
      try {
        const data = await Get_Unique_Offre(Poste.id_poste);
        setDataPoste(data);
        console.log("lagrin", data);
        if (data.langues == "fr") {
          setLangue("Français");
        }
      } catch (err) {
        console.error("Erreur API :", err);
      }
    }

    load();
  }, [Poste.id_poste]);
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center">
      {isTestOpen && (
        <Test_Technique
          id_test={Poste.id_poste}
          isOpen={true}
          onClose={() => setIsTestOpen(false)}
          nomEntreprise={DataPoste?.nom_compagnie}
          consignes=""
          attendues=""
        />
      )}
      {/* bg blur */}
      <div
        className="absolute inset-0 backdrop-blur-md bg-black/50"
        onClick={onClose}
      />

      {/* carte */}
      <div className="relative z-10 w-[680px] max-h-[90vh] overflow-y-auto bg-[#111113] border border-white/10 rounded-2xl shadow-2xl">
        {/* header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            {/* Logo*/}
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300 font-semibold text-sm">
              <img
                src={Poste.logo}
                className="object-cover rounded-xl"
                alt={Poste.logo}
              ></img>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">
                Entreprise
              </p>
              <h3 className="text-gray-200 font-medium text-base leading-tight">
                {DataPoste?.nom_compagnie}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* save */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all text-sm">
              <FaBookmark size={11} />
              Sauvegarder
            </button>
            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-gray-500 hover:bg-white/5 hover:text-gray-200 transition-all"
            >
              <FaTimes size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_220px] gap-0">
          {/* gauche avec description */}
          <div className="p-6 border-r border-white/10 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-600">
                  il y a {DataPoste?.since_posted}
                </span>
              </div>
              <h1 className="text-xl font-semibold text-white leading-snug">
                {DataPoste?.display_name_fr}
              </h1>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              {Poste.description}
            </p>

            {/* competences */}
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                Compétences requises
              </h2>
              <div className="flex flex-wrap gap-2">
                {DataPoste?.skills?.map((skill: any) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs border border-purple-800/40 bg-purple-950/30 text-purple-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            {/* type contrat*/}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/5 text-gray-300">
                <FaBriefcase size={10} />
                {Langue !== "None"
                  ? Langue
                  : DataPoste?.langues || "Non renseigné"}
              </span>
            </div>
          </div>

          {/* partie droite details */}
          <div className="p-5 flex flex-col gap-5">
            {/* Localisation */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MdOutlinePlace size={15} className="text-purple-400 shrink-0" />
              <span>
                {DataPoste?.place?.[0] === "Non renseigne"
                  ? "Non renseigné"
                  : `${DataPoste?.place?.[0] || ""}, ${
                      DataPoste?.place?.[1] || ""
                    }`}
              </span>
            </div>

            {/* Salaire */}
            <div className="bg-purple-950/30 border border-purple-800/30 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1">
                Salaire annuel
              </p>
              <p className="text-2xl font-semibold text-purple-300">
                {DataPoste?.salaire_moyen_annuel || "Non renseigné"}{" "}
                {DataPoste?.salaire_currency}
              </p>
            </div>

            {/* Infos */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-3">
                Détails
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <IoFileTray size={14} className="text-gray-500 shrink-0" />
                  <span className="text-gray-300">
                    {DataPoste?.categorie || "Non renseigné"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MdHomeWork size={14} className="text-gray-500 shrink-0" />
                  <span className="text-gray-300">
                    {DataPoste?.frequency_remote || "Non renseigné"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <TbBrandDaysCounter
                    size={14}
                    className="text-gray-500 shrink-0"
                  />
                  <span className="text-gray-300">
                    {DataPoste?.remote_policy || "X"} j / semaine
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton Postuler */}
            <button
              onClick={() => setIsTestOpen(true)}
              className="mt-auto w-full bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-all"
            >
              Postuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
