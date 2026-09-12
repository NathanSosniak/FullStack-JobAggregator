"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";

import { Update_User_Global } from "@/app/services/Modif_Data/Modif_User_Global";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  telephone: string;
  onSave: (email: string, telephone: string) => void;
}

function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(?=\d)/g, "$1 ")
    .trim();
}

export default function Contact_Edit({
  isOpen,
  onClose,
  email,
  telephone,
  onSave,
}: Props) {
  const [emailVal, setEmailVal] = useState(email);
  const [phoneVal, setPhoneVal] = useState(telephone);

  // loading pour le changement de donnee
  const [loading, setLoading] = useState(false);

  // Save
  const handleSave = async () => {
    try {
      setLoading(true);
      await Update_User_Global({ tel: phoneVal, email: emailVal });
      onSave(emailVal, phoneVal);
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
          Modifier le contact
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <MdLocalPhone className="text-teal-400 text-lg flex-shrink-0" />
            <input
              value={phoneVal}
              maxLength={14}
              minLength={14}
              onChange={(e) => setPhoneVal(formatPhone(e.target.value))}
              className="bg-transparent text-gray-300 text-sm outline-none w-full"
              placeholder="Ex : 06 05 04 02 .."
            />
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <AiOutlineMail className="text-teal-400 text-lg flex-shrink-0" />
            <input
              value={emailVal}
              onChange={(e) => setEmailVal(e.target.value)}
              className="bg-transparent text-gray-300 text-sm outline-none w-full"
              placeholder="Email"
            />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={() => {
              if (phoneVal.length < 14)
                return alert("Numéro de téléphone invalide");
              if (!emailVal.includes("@") || !emailVal.includes("."))
                return alert("Email invalide");
              handleSave();
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
