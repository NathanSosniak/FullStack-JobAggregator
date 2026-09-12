"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

import { Update_User_Profil } from "@/app/services/Modif_Data/Modif_User_profil";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  biographie: string;
  onSave: (bio: string) => void;
}

const MAX = 500;

export default function Bio_Edit({
  isOpen,
  onClose,
  biographie,
  onSave,
}: Props) {
  // value de la vio
  const [value, setValue] = useState(biographie);
  // logading changement infos
  const [loading, setLoading] = useState(false);

  // Save
  const handleSave = async () => {
    try {
      setLoading(true);
      await Update_User_Profil({ bio: value });
      onSave(value);
      onClose();
    } catch (err) {
      console.error("Erreur sauvegarde bio:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
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
          Modifier la biographie
        </h1>

        <textarea
          value={value}
          onChange={(e) =>
            e.target.value.length <= MAX && setValue(e.target.value)
          }
          className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-gray-300 text-sm leading-relaxed resize-none outline-none focus:border-teal-400/50 transition-colors"
          placeholder="Écris ta biographie..."
        />

        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500 text-xs">
            {value.length} / {MAX}
          </span>
          <button
            onClick={() => {
              handleSave();
              onSave(value);
              onClose();
            }}
            className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
