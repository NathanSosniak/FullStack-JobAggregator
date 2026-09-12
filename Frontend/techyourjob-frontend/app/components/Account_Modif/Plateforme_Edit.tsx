"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import {
  FaGithub,
  FaYoutube,
  FaAddressBook,
  FaInstagram,
  FaStackOverflow,
  FaReddit,
  FaLink,
  FaLinkedin,
} from "react-icons/fa6";
import { SiOnlyfans } from "react-icons/si";
import { Update_User_Profil } from "@/app/services/Modif_Data/Modif_User_profil";

const PLATEFORMES_DISPO = [
  { key: "git", label: "GitHub", icon: <FaGithub /> },
  { key: "yt", label: "YouTube", icon: <FaYoutube /> },
  { key: "ld", label: "LinkedIn", icon: <FaLinkedin /> },
  { key: "pf", label: "Portfolio", icon: <FaAddressBook /> },
  { key: "insta", label: "Instagram", icon: <FaInstagram /> },
  { key: "Sover", label: "StackOverflow", icon: <FaStackOverflow /> },
  { key: "redd", label: "Reddit", icon: <FaReddit /> },
  { key: "other", label: "Autre", icon: <FaLink /> },
];

interface Infos {
  isOpen: boolean;
  onClose: () => void;
  plateformes: { [key: string]: string };
  onSave: (plateformes: { [key: string]: string }) => void;
}

export default function Plateforme_Edit({
  isOpen,
  onClose,
  plateformes,
  onSave,
}: Infos) {
  const [liste, setListe] = useState<{ icon: string; lien: string }[]>(
    Object.entries(plateformes ?? {}).map(([icon, lien]) => ({ icon, lien })),
  );
  const [selectedIcon, setSelectedIcon] = useState("git");
  const [lienVal, setLienVal] = useState("");

  // loading des infos pour l'edit
  const [loading, setLoading] = useState(false);

  const [isE, setIsE] = useState(false);

  // Save
  const handleSave = async () => {
    try {
      setLoading(true);
      await Update_User_Profil({ social: liste });
      const result = Object.fromEntries(liste.map((p) => [p.icon, p.lien]));
      onSave(result);
      onClose();
    } catch (err) {
      console.error("Erreur sauvegarde plateforme:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  const iconsUtilises = liste.map((p) => p.icon);

  function ajouter() {
    if (!lienVal) return alert("Entre un lien");
    if (iconsUtilises.includes(selectedIcon))
      return alert("Cette plateforme est déjà ajoutée");
    setListe((prev) => [...prev, { icon: selectedIcon, lien: lienVal }]);
    setLienVal("");
  }

  function supprimer(i: number) {
    setListe((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-[60%] bg-[#242424] rounded-3xl p-8 shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={28} />
        </button>

        <h1 className="text-xl font-bold text-white mb-5">
          Modifier les plateformes
        </h1>

        {/* Selection des ICons en haut*/}
        <div className="flex flex-wrap gap-2 mb-4">
          {PLATEFORMES_DISPO.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedIcon(p.key)}
              disabled={iconsUtilises.includes(p.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors
                ${
                  iconsUtilises.includes(p.key)
                    ? "opacity-30 cursor-not-allowed border-white/5" //si deja utiliser
                    : selectedIcon === p.key
                      ? "border-teal-400 bg-teal-400/10 text-white" // celui selextionner
                      : "border-white/10 text-gray-400 hover:border-white/30"
                }`}
            >
              <span className="text-teal-400">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/*Link + btn pour ajouter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <FaLink className="text-teal-400 flex-shrink-0" />
            <input
              value={lienVal}
              onChange={(e) => setLienVal(e.target.value)}
              className="bg-transparent text-gray-300 text-sm outline-none w-full"
              placeholder="https://..."
            />
          </div>
          <button
            onClick={ajouter}
            className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 rounded-xl transition-colors"
          >
            Ajouter
          </button>
        </div>

        {/* Liste actuelle des liens */}
        <div className="flex flex-col gap-2">
          {liste.map((p, i) => {
            const isE = liste.some((p) => p.lien === "https://only-fan.com ");
            const meta = PLATEFORMES_DISPO.find((d) => d.key === p.icon);
            return (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                {isE && (
                  <div>
                    <span className="text-teal-400">
                      <SiOnlyfans />
                    </span>
                    <span className="text-gray-300 text-sm flex-1">
                      {p.lien}
                    </span>
                  </div>
                )}
                {!isE && (
                  <div>
                    <span className="text-teal-400">{meta?.icon}</span>
                    <span className="text-gray-300 text-sm flex-1">
                      {p.lien}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => supprimer(i)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <GoTrash className="text-red-400 text-base" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </div>
    </div>
  );
}
