"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { GoTrash } from "react-icons/go";

import { Update_User_Experience } from "@/app/services/Experience/Modif_User_Experience";
import { Update_User_Formation } from "@/app/services/Formation/Modif_User_formation";

interface CompetenceItem {
  competence: string;
  source: string;
  sourceType: "experience" | "formation";
  sourceId: number;
  logo: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  competences: CompetenceItem[];
  onRefresh: () => Promise<void>;
}

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
  titre,
  emplacement,
  onDelete,
}: {
  titre: string;
  emplacement: string;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-[64px_1fr_28px] gap-4 items-center py-3">
      <img className="w-16 h-16 object-cover rounded-xl border border-white/10 bg-[#333]" />
      <div className="flex flex-col">
        <h2 className="text-white text-[15px] font-bold">{titre}</h2>
        <h6 className="text-gray-400 text-[13px]">{emplacement}</h6>
      </div>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <GoTrash className="text-red-400 text-base" />
      </button>
    </div>
  );
}

export default function Competence_Edit({
  isOpen,
  onClose,
  competences,
  onRefresh,
}: Props) {
  const [liste, setListe] = useState(competences);
  const [loading, setLoading] = useState(false);

  if (isOpen && liste !== competences && !loading) {
    setListe(competences);
  }

  if (!isOpen) return null;

  // pour gerer le deleyte obj
  async function handleDelete(index: number) {
    const item = liste[index];
    setLoading(true);
    try {
      // on recupere toute les competences de la meme source
      const sameSrcSkills = liste
        .filter(
          (c) =>
            c.sourceType === item.sourceType && c.sourceId === item.sourceId,
        )
        .map((c) => c.competence)
        .filter((c) => c !== item.competence);

      // om va update la table en question selon si c'est une formation ou une experience en allant la retirer
      if (item.sourceType === "experience") {
        await Update_User_Experience(item.sourceId, { skills: sameSrcSkills });
      } else {
        await Update_User_Formation(item.sourceId, { skills: sameSrcSkills });
      }

      // on met a jour la liste en locale pour ne pas a rafraichir
      setListe((prev) => prev.filter((_, idx) => idx !== index));

      // on refresh le parent
      await onRefresh();
    } catch (err) {
      console.error("Erreur suppression compétence:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-[60%] bg-[#242424] rounded-3xl p-8 shadow-2xl border border-white/10 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={28} />
        </button>

        <h1 className="text-xl font-bold text-white mb-5">
          Modifier les compétences
        </h1>

        {liste.map(({ competence, source, sourceType, logo }, i) => (
          <div key={i}>
            <div className="bg-white/12 h-px w-full" />
            <div className="grid grid-cols-[64px_1fr_28px] gap-4 items-center py-3">
              <SourceLogo name={source} logoUrl={logo} />
              <div className="flex flex-col">
                <h2 className="text-white text-[15px] font-bold">
                  {competence}
                </h2>
                <h6 className="text-gray-400 text-[13px]">
                  {source}
                  <span className="text-gray-600 text-xs ml-2">
                    ({sourceType === "experience" ? "Expérience" : "Formation"})
                  </span>
                </h6>
              </div>
              <button
                onClick={() => handleDelete(i)}
                disabled={loading}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <GoTrash className="text-red-400 text-base" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
