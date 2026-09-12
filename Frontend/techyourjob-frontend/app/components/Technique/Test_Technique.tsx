"use client";
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { TfiClipboard } from "react-icons/tfi";
import { FiUploadCloud, FiFile, FiTrash2 } from "react-icons/fi";
import { LuCalendarX, LuCalendarCheck, LuFileCheck } from "react-icons/lu";

import { Upload_Candidature } from "@/app/services/Test_Feature/Upload_Candidature";
import { Get_Info_Test } from "@/app/services/Test_Feature/Offre_Service";

const ETAPES = [
  { id: 0, label: "Consignes" },
  { id: 1, label: "Attendues" },
  { id: 2, label: "Test Technique" },
];

interface Props {
  id_test: number;
  isOpen: boolean;
  onClose: () => void;
  nomEntreprise?: string;
  consignes?: string;
  attendues?: string;
  datePublication?: string;
  dateLimit?: string;
  fichiersAttendus?: string[];
}

export default function Test_Technique({
  id_test,
  isOpen,
  onClose,
  nomEntreprise = "Nom entreprise",
  consignes = "",
  attendues = "",
  datePublication = "12 mai 2025",
  dateLimit = "26 mai 2025",
  fichiersAttendus = ["README.md", "dockerfile", ".zip complet du projet"],
}: Props) {
  const [etape, setEtape] = useState(0);

  const [consigne, setConsigne] = useState("");
  const [dateRendu, setDateRendu] = useState("");
  const [fichierRendu, setFichierRendu] = useState([]);
  const [attendue, setAttendues] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await Get_Info_Test(id_test);
        setConsigne(data.consigne);
        setDateRendu(data.date_rendue);
        setFichierRendu(data.fichier_attendues);
        setAttendues(data.attendues);
      } catch (err) {
        console.error("Erreur API :", err);
      }
    }

    load();
  }, [id_test]);

  if (!isOpen) return null;
  const [fichier, setFichier] = useState<File | null>(null);
  const [envoye, setEnvoye] = useState(false);

  const handleFichier = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".py")) {
      setFichier(f);
      setEnvoye(false);
    }
    e.target.value = "";
  };

  const handleEnvoyer = async () => {
    if (!fichier) return;
    try {
      await Upload_Candidature(id_test, fichier);
      setEnvoye(true);
    } catch (err) {
      console.error("Erreur upload:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-[70%] h-[80vh] bg-[#242424] rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <TfiClipboard className="text-teal-400" size={18} />
            <h1 className="text-white font-bold text-lg">Test Technique</h1>
            <span className="text-gray-500 text-sm">-</span>
            <span className="text-gray-400 text-sm">{nomEntreprise}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-[180px_1fr] flex-1 overflow-hidden">
          {/* Sidebar etapes */}
          <div className="flex flex-col gap-1 p-4 border-r border-white/10">
            {ETAPES.map((e) => (
              <button
                key={e.id}
                onClick={() => setEtape(e.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                  ${
                    etape === e.id
                      ? "bg-teal-500/15 text-teal-400 border border-teal-400/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${
                    etape === e.id
                      ? "bg-teal-500 text-white"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {e.id + 1}
                </span>
                {e.label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className="flex flex-col gap-5 overflow-y-auto p-8">
            {/* Consignes */}
            {etape === 0 && (
              <>
                <h2 className="text-white font-bold text-base">
                  Consignes du projet
                </h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-300 text-sm leading-relaxed min-h-64">
                  {consigne || (
                    <span className="text-gray-500 italic">
                      L'entreprise n'a pas encore renseigne les consignes.
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Attendues */}
            {etape === 1 && (
              <>
                <h2 className="text-white font-bold text-base">
                  Ce qui est attendu
                </h2>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center flex-shrink-0">
                      <LuCalendarCheck size={18} className="text-teal-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs">
                        Date de publication
                      </span>
                      <span className="text-white text-sm font-semibold">
                        {datePublication}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 border border-red-400/20 rounded-2xl px-5 py-4">
                    <div className="w-9 h-9 rounded-xl bg-red-400/10 flex items-center justify-center flex-shrink-0">
                      <LuCalendarX size={18} className="text-red-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-xs">
                        Date limite d'envoi
                      </span>
                      <span className="text-red-400 text-sm font-semibold">
                        {dateRendu}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fichiers attendus */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <LuFileCheck size={15} className="text-teal-400" />
                    <h3 className="text-white text-sm font-semibold">
                      Fichiers attendus
                    </h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {fichierRendu.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                      >
                        <FiFile
                          size={14}
                          className="text-teal-400 flex-shrink-0"
                        />
                        <span className="text-gray-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description attendues */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-gray-300 text-sm leading-relaxed">
                  {attendue || (
                    <span className="text-gray-500 italic">
                      L'entreprise n'a pas encore renseigne les attendus.
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Test Technique */}
            {etape === 2 && (
              <div className="flex flex-col gap-6 flex-1">
                <h2 className="text-white font-bold text-base">
                  Deposer votre test technique
                </h2>

                {!fichier ? (
                  <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-2xl p-16 cursor-pointer hover:border-teal-400/50 hover:bg-teal-400/5 transition-all">
                    <FiUploadCloud size={36} className="text-gray-500" />
                    <p className="text-gray-400 text-sm">
                      Glissez votre fichier ou cliquez pour parcourir
                    </p>
                    <span className="text-gray-600 text-xs">
                      Format accepte : Tout type
                    </span>
                    <input
                      type="file"
                      accept=".py"
                      onChange={handleFichier}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FiFile size={20} className="text-teal-400" />
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">
                          {fichier.name}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {(fichier.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-gray-400 hover:text-red-400 cursor-pointer transition-colors text-sm">
                      <FiTrash2 size={16} />
                      Remplacer
                      <input
                        type="file"
                        accept=".py"
                        onChange={handleFichier}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {envoye && (
                  <p className="text-teal-400 text-sm">
                    Test envoye avec succes.
                  </p>
                )}

                <div className="flex justify-end pt-4 border-t border-white/10 mt-auto">
                  <button
                    onClick={handleEnvoyer}
                    disabled={!fichier || envoye}
                    className="bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    {envoye ? "Test envoye" : "Envoyer le test"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
