"use client";
import { useState } from "react";
import { LiaBuromobelexperte } from "react-icons/lia";
import { FaPencil } from "react-icons/fa6";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { IoBookOutline, IoAddOutline } from "react-icons/io5";
import Experience_Pro_Edit from "../Account_Modif/ExperiencePro_Edit";

import { Get_User_Info } from "@/app/services/Info_User_Service";

// inerface des competences
interface CompetenceItem {
  competence: string;
  source: string;
}

// infos
interface Info {
  id_experience: number;
  titre: string;
  date_debut: string;
  date_fin: string;
  description: string;
  nom_entreprise: string;
  competences_experience: CompetenceItem[];
  logo: string | null;
}

// fonction pour gerer les logos, on va le chercher ou alors on en creer un
function EnterpriseLogo({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  // si y a un logo en DB on affiche
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-16 h-16 object-cover rounded-xl border border-white/10 bg-white"
      />
    );
  }

  // sinon  on ve le gerer, si y a 2 mots ca prend la premiere lettre de chaque inon ca prend les deux premiere lettre du mot
  const words = name.trim().split(/\s+/);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

  // liste de couleurs pour le fond
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
  // petit truc qui met un score sur chaque lettre exemple o = 50 ca additionne tout et ca accumule tout en 1 pour faire la couleur avec le fon
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

interface ExperienceProAccountProps {
  isEdit: boolean;
  infos: {
    experience: Info[];
    competences_experience: CompetenceItem[];
  };
}

// experience div
function Experience_Pro({
  competences_experience,
  logo,
  entrepriseName,
  titre,
  Lieu,
  Date,
  Description,
}: {
  competences_experience: CompetenceItem[];
  logo: string | null;
  entrepriseName: string;
  titre: string;
  Lieu: string;
  Date: string;
  Description: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-row items-start gap-4 w-full">
        <EnterpriseLogo name={entrepriseName} logoUrl={logo} />
        <div className="flex flex-col flex-1">
          <div className="flex flex-row justify-between items-center w-full">
            <span className="flex items-center gap-2">
              <MdOutlineMapsHomeWork className="text-teal-400" />
              <h1 className="text-white font-bold text-sm">{titre}</h1>
            </span>
            <h4 className="flex items-center gap-1 text-sm text-gray-300">
              Compétences
              <LiaBuromobelexperte className="text-teal-400 text-base" />
            </h4>
          </div>
          <h6 className="text-gray-400 text-sm">{Lieu}</h6>
          <h6 className="text-gray-500 text-xs">{Date}</h6>
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">
        {expanded ? Description : Description.slice(0, 280)}
        {!expanded && Description.length > 280 && (
          <span>
            {" "}
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

export default function ExperiencePro_account({
  isEdit,
  infos: initialInfos,
}: ExperienceProAccountProps) {
  // on prend l'experience selectionner
  const [selectedExp, setSelectedExp] = useState<Info | null>(null);

  // lst des experiences
  const [experiences, setExperiences] = useState(
    // on prend un array et si vide ou undefined on met []
    (initialInfos.experience ?? []).map((exp: any) => ({
      ...exp,
      competences_experience: Array.isArray(exp.compétences)
        ? // ici on recoit de la db un array de string mais nous on veut dans l'interface des objets
          exp.compétences.map((s: any) =>
            // on prend l'element et on fait donc conpetences 'element' source "" comme ca c'est valide
            typeof s === "string" ? { competence: s, source: "" } : s,
          )
        : [],
    })),
  );

  // on refresh les experiences, c'est exactement comme au dessus
  async function refreshExperiences() {
    try {
      const data = await Get_User_Info();
      const mapped = (data.experience ?? []).map((exp: any) => ({
        ...exp,
        competences_experience: Array.isArray(exp.compétences)
          ? exp.compétences.map((s: any) =>
              typeof s === "string" ? { competence: s, source: "" } : s,
            )
          : [],
      }));
      setExperiences(mapped);
    } catch (err) {
      console.error("Erreur refresh:", err);
    }
  }
  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl p-5 gap-5">
      {/* on envoie l'experience selectionner */}
      {selectedExp && (
        <Experience_Pro_Edit
          isOpen={true}
          onClose={() => setSelectedExp(null)}
          experienceId={selectedExp.id_experience}
          enterprise_name={selectedExp.nom_entreprise}
          title={selectedExp.titre}
          start={selectedExp.date_debut}
          end={selectedExp.date_fin}
          description={selectedExp.description}
          skills={selectedExp.competences_experience}
          onSave={() => {
            setSelectedExp(null);
            refreshExperiences();
          }}
        />
      )}

      <h1 className="flex items-center gap-3 text-white font-bold">
        Expériences Professionnelles
        {/* on ouvre la premiere experince */}
        {isEdit == true && (
          <span
            onClick={() => setSelectedExp(experiences[0])}
            className="cursor-pointer"
          >
            <FaPencil className="text-gray-500 text-sm" />
          </span>
        )}
      </h1>

      {experiences.map((exp, i) => (
        <div key={exp.id_experience}>
          <div className="flex justify-between items-start">
            <Experience_Pro
              competences_experience={exp.competences_experience}
              logo={exp.logo}
              entrepriseName={exp.nom_entreprise}
              titre={exp.titre}
              Lieu={exp.nom_entreprise}
              Date={`${exp.date_debut} - ${exp.date_fin}`}
              Description={exp.description}
            />
            {/* on met un crayon pour modifier l'experience */}
            {isEdit == true && (
              <span
                onClick={() => setSelectedExp(exp)}
                className="cursor-pointer ml-2 mt-1"
              >
                <FaPencil className="text-gray-500 text-sm hover:text-white transition-colors" />
              </span>
            )}
          </div>
          {i < experiences.length - 1 && (
            <div className="bg-white/12 h-px w-full mt-4" />
          )}
        </div>
      ))}

      <div className="bg-white/12 h-px w-full" />
      {isEdit == true && (
        <button
          onClick={() =>
            setSelectedExp({
              id_experience: -1,
              titre: "",
              date_debut: "",
              date_fin: "",
              description: "",
              nom_entreprise: "",
              competences_experience: [],
              logo: null,
            })
          }
          className="flex items-center justify-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
        >
          <IoAddOutline className="text-base" />
          Ajouter une expérience
        </button>
      )}
    </div>
  );
}
