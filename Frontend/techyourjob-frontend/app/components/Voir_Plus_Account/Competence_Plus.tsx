"use client";
import { IoClose } from "react-icons/io5";

interface CompetenceItem {
  competence: string;
  source: string;
  logo: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  competences: CompetenceItem[];
}

function SourceLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
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
    "bg-teal-500", "bg-violet-500", "bg-rose-500", "bg-amber-500",
    "bg-blue-500", "bg-emerald-500", "bg-pink-500", "bg-indigo-500",
    "bg-orange-500", "bg-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < safeName.length; i++) {
    hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];

  return (
    <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-bold text-lg">{initials}</span>
    </div>
  );
}

function Competence({ titre, emplacement, logo }: { titre: string; emplacement: string; logo: string | null }) {
  return (
    <div className="grid grid-cols-[64px_1fr] gap-4 items-center py-3">
      <SourceLogo name={emplacement} logoUrl={logo} />
      <div className="flex flex-col">
        <h2 className="text-white text-[15px] font-bold">{titre}</h2>
        <h6 className="text-gray-400 text-[13px]">{emplacement}</h6>
      </div>
    </div>
  );
}

export default function Competences_Plus({ isOpen, onClose, competences }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-[60%] bg-[#242424] rounded-3xl p-8 shadow-2xl border border-white/10 max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={28} />
        </button>
        <h1 className="text-xl font-bold text-white mb-5">Toutes les compétences</h1>
        {competences.map(({ competence, source, logo }, i) => (
          <div key={i}>
            <div className="bg-white/12 h-px w-full" />
            <Competence titre={competence} emplacement={source} logo={logo} />
          </div>
        ))}
      </div>
    </div>
  );
}