"use client";

import { FaPencil } from "react-icons/fa6";
import { TbTarget } from "react-icons/tb";
import { useState } from "react";

import Competences_Plus from "../Voir_Plus_Account/Competence_Plus";
import Competence_Edit from "../Account_Modif/Competence_Edit";
import { Get_User_Info } from "@/app/services/Info_User_Service";

function SourceLogo({
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
  const safeName = name || "??";
  const words = safeName.trim().split(/\s+/);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : safeName.slice(0, 2).toUpperCase();

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
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
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

function Competence({
  logo,
  name,
  titre,
  emplacement,
}: {
  logo: string | null;
  name: string;
  titre: string;
  emplacement: string;
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[64px_1fr] gap-4 items-center py-3">
        <SourceLogo name={name} logoUrl={logo} />
        <div className="flex flex-col">
          <h2 className="text-white text-[15px] font-bold">{titre}</h2>
          <h6 className="text-gray-400 text-[13px] font-normal">
            {emplacement}
          </h6>
        </div>
      </div>
    </div>
  );
}

interface CompetenceItem {
  competence: string;
  source: string;
  sourceType: "experience" | "formation";
  sourceId: number;
  logo: string | null;
}

interface Info {
  competences_experience: CompetenceItem[];
  competences_formation: CompetenceItem[];
}

export default function Competence_Preview({
  isEdit,
  infos: initialInfos,
}: {
  isEdit: boolean;
  infos: Info;
}) {
  // poup voir tt competences
  const [isOpen, setIsOpen] = useState(false);
  // popup de modif
  const [isEditOpen, setIsEditOpen] = useState(false);

  // pourn stocker toute les competeneces entiere
  const [competences, setCompetences] = useState<CompetenceItem[]>([
    ...initialInfos.competences_experience,
    ...initialInfos.competences_formation,
  ]);

  // affichage 3 dernieres
  async function refreshCompetences() {
    try {
      const data = await Get_User_Info();
      const fromExp = (data.experience ?? []).flatMap((e: any) =>
        (e["compétences"] ?? []).map((c: string) => ({
          competence: c,
          source: e.nom_entreprise,
          sourceType: "experience" as const,
          sourceId: e.id_experience,
          logo: e.logo ?? null,
        })),
      );
      const fromForm = (data.formation ?? []).flatMap((f: any) =>
        (f["compétences"] ?? []).map((c: string) => ({
          competence: c,
          source: f["nom_établissement"],
          sourceType: "formation" as const,
          sourceId: f.id_formation,
          logo: f.logo ?? null,
        })),
      );
      setCompetences([...fromExp, ...fromForm]);
    } catch (err) {
      console.error("Erreur refresh compétences:", err);
    }
  }

  const apercu = competences.slice(-3);

  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl p-5 w-[300px]">
      <Competences_Plus
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        competences={competences}
      />
      <Competence_Edit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        competences={competences}
        onRefresh={refreshCompetences}
      />
      <h1 className="flex items-center gap-3 text-white text-xl font-bold mb-2">
        Compétences
        {isEdit == true && (
          <span onClick={() => setIsEditOpen(true)} className="cursor-pointer">
            <FaPencil className="text-gray-500 text-sm" />
          </span>
        )}
      </h1>
      {apercu.map(({ competence, source, logo }, i) => (
        <div key={i}>
          <div className="bg-white/12 h-px w-full"></div>
          <Competence
            logo={logo}
            name={source}
            titre={competence}
            emplacement={source}
          />
        </div>
      ))}
      <div className="bg-white/12 h-px w-full"></div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 text-gray-400 text-sm py-3 cursor-pointer hover:text-white transition-colors"
      >
        <TbTarget className="text-base" />
        Voir plus
      </button>
    </div>
  );
}
