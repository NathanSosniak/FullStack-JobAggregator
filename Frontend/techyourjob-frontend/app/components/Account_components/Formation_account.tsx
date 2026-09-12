"use client";
import { useState } from "react";
import { LiaBuromobelexperte } from "react-icons/lia";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaPencil } from "react-icons/fa6";
import { PiGraduationCap } from "react-icons/pi";
import { IoAddOutline } from "react-icons/io5";

import { Get_User_Info } from "@/app/services/Info_User_Service";
import Formation_Edit from "../Account_Modif/Formation_Edit";

interface CompetenceItem {
  competence: string;
  source: string;
}

interface Info {
  id_formation: number;
  nom_établissement: string;
  titre: string;
  date_debut: string;
  date_fin: string;
  description: string;
  compétences: any;
  competences_formation: CompetenceItem[];
  diplome: string;
  logo: string | null;
}

// onstruction du logo, va le chercher si existe sinon generer un logo avec les initiale du nom + couleur de fond aleatoire en fonction des lettres
function InstitutionLogo({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-16 h-16 object-cover rounded-xl border border-white/10 bg-white"
      />
    );
  }

  const words = name.trim().split(/\s+/);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

  const colors = [
    "bg-teal-500",
    "bg-violet-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];

  return (
    <div
      className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white font-bold text-lg">{initials}</span>
    </div>
  );
}

// composents formation
function Formation({
  logo,
  Nom,
  Titre,
  Date,
  Description,
}: {
  logo: string | null;
  Nom: string;
  Titre: string;
  Date: string;
  Description: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-row items-start gap-4 w-full">
        <InstitutionLogo name={Nom} logoUrl={logo} />
        <div className="flex flex-col flex-1">
          <div className="flex flex-row justify-between items-start w-full">
            <span className="flex items-center gap-2">
              <PiGraduationCap className="text-teal-400 text-lg" />
              <h1 className="text-white font-bold text-sm">{Nom}</h1>
            </span>
            <div className="flex flex-col items-end gap-0.5 cursor-pointer">
              <h4 className="flex items-center gap-1 text-sm text-gray-300">
                Diplôme <RiFilePaper2Line className="text-teal-400 text-base" />
              </h4>
              <h4 className="flex items-center gap-1 text-sm text-gray-300">
                Compétences{" "}
                <LiaBuromobelexperte className="text-teal-400 text-base" />
              </h4>
            </div>
          </div>
          <h6 className="text-gray-400 text-sm">{Titre}</h6>
          <h6 className="text-gray-500 text-xs">{Date}</h6>
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">
        {expanded ? Description : Description.slice(0, 280)}
        {!expanded && Description.length > 280 && (
          <span>
            {" "}
            hac{" "}
            <button
              onClick={() => setExpanded(true)}
              className="text-gray-300 underline cursor-pointer"
            >
              ...voir plus
            </button>
          </span>
        )}
      </p>
    </div>
  );
}

export default function Formation_Account({
  isEdit,
  infos: initialInfos,
}: {
  isEdit: boolean;
  infos: Info[];
}) {
  // formation sell=ectionner
  const [selectedFormation, setSelectedFormation] = useState<Info | null>(null);
  // lst formations, on va les parser et les mettre ssous le bon format avec sources
  const [formations, setFormations] = useState(
    (initialInfos ?? []).map((f: any) => ({
      ...f,
      competences_formation: Array.isArray(f.compétences)
        ? f.compétences.map((s: any) =>
            typeof s === "string" ? { competence: s, source: "" } : s,
          )
        : [],
    })),
  );

  // on refresh les forations ici sans faire f5
  async function refreshFormations() {
    try {
      const data = await Get_User_Info();
      const mapped = (data.formation ?? []).map((f: any) => ({
        ...f,
        competences_formation: Array.isArray(f.compétences)
          ? f.compétences.map((s: any) =>
              typeof s === "string" ? { competence: s, source: "" } : s,
            )
          : [],
      }));
      setFormations(mapped);
    } catch (err) {
      console.error("Erreur refresh:", err);
    }
  }

  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl p-5 gap-5">
      {selectedFormation && (
        <Formation_Edit
          isOpen={true}
          onClose={() => setSelectedFormation(null)}
          formationId={selectedFormation.id_formation}
          institution_name={selectedFormation.nom_établissement}
          title={selectedFormation.titre}
          start={selectedFormation.date_debut}
          end={selectedFormation.date_fin}
          description={selectedFormation.description}
          skills={selectedFormation.competences_formation}
          degree={selectedFormation.diplome}
          onSave={() => {
            setSelectedFormation(null);
            refreshFormations();
          }}
        />
      )}
      <h1 className="flex items-center gap-3 text-white font-bold">
        Formations
        {isEdit == true && (
          <span
            onClick={() => setSelectedFormation(formations[0])}
            className="cursor-pointer"
          >
            <FaPencil className="text-gray-500 text-sm" />
          </span>
        )}
      </h1>

      {formations.map((f, i) => (
        <div key={f.id_formation}>
          <div className="flex justify-between items-start">
            <Formation
              logo={f.logo}
              Nom={f.nom_établissement}
              Titre={f.titre}
              Date={`${f.date_debut} - ${f.date_fin}`}
              Description={f.description}
            />
            {isEdit == true && (
              <span
                onClick={() => setSelectedFormation(f)}
                className="cursor-pointer ml-2 mt-1"
              >
                <FaPencil className="text-gray-500 text-sm hover:text-white transition-colors" />
              </span>
            )}
          </div>
          {i < formations.length - 1 && (
            <div className="bg-white/12 h-px w-full mt-4" />
          )}
        </div>
      ))}
      <div className="bg-white/12 h-px w-full" />
      {isEdit == true && (
        <button
          onClick={() =>
            setSelectedFormation({
              id_formation: -1,
              nom_établissement: "",
              titre: "",
              date_debut: "",
              date_fin: "",
              description: "",
              compétences: [],
              competences_formation: [],
              diplome: "",
              logo: null,
            })
          }
          className="flex items-center justify-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
        >
          <IoAddOutline className="text-base" />
          Ajouter une formation
        </button>
      )}
    </div>
  );
}
