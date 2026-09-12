"use client";
import { useState } from "react";

import { Save_Test_Technique } from "@/app/services/Test_Feature/Ajouter_test_technique";

interface TestForm {
  description: string;
  dateRendu: string;
  consignes: string;
  fichiersAttendus: string[];
}

interface AddTestTechniqueProps {
  ID_poste: number;
  onSuccess?: () => void;
}

export default function AddTestTechnique({
  ID_poste,
  onSuccess,
}: AddTestTechniqueProps) {
  const [form, setForm] = useState<TestForm>({
    description: "",
    dateRendu: "",
    consignes: "",
    fichiersAttendus: [],
  });
  const [newFichier, setNewFichier] = useState("");

  const updateField = (field: keyof TestForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addFichier = () => {
    if (!newFichier.trim()) return;
    setForm((prev) => ({
      ...prev,
      fichiersAttendus: [...prev.fichiersAttendus, newFichier.trim()],
    }));
    setNewFichier("");
  };

  const removeFichier = (index: number) =>
    setForm((prev) => ({
      ...prev,
      fichiersAttendus: prev.fichiersAttendus.filter((_, i) => i !== index),
    }));

  const handleSubmit = async () => {
    if (!form.description.trim()) return;
    try {
      await Save_Test_Technique(ID_poste, {
        description: form.description,
        dateRendu: form.dateRendu,
        consignes: form.consignes,
        fichiersAttendus: form.fichiersAttendus,
        statut: "publie",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Erreur sauvegarde bio:", err);
    }
  };

  const inputClass =
    "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors w-full";

  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl gap-5 p-6 w-full max-w-[520px]">
      <h1 className="text-white font-bold text-base tracking-wide">
        Ajouter un test technique
      </h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* champs*/}
        <div className="flex-1 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Description
            </span>
            <input
              type="text"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Nom du test"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Date de rendu
            </span>
            <input
              type="date"
              value={form.dateRendu}
              onChange={(e) => updateField("dateRendu", e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Consignes
            </span>
            <textarea
              value={form.consignes}
              onChange={(e) => updateField("consignes", e.target.value)}
              rows={3}
              placeholder="Consignes du test..."
              className={`${inputClass} resize-none`}
            />
          </label>
        </div>

        {/* files */}
        <div className="lg:w-[200px] flex flex-col gap-3">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
            Fichiers attendus
          </span>

          <div className="flex gap-2">
            <input
              type="text"
              value={newFichier}
              onChange={(e) => setNewFichier(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFichier()}
              placeholder="ex: main.py"
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors flex-1 min-w-0"
            />
            <button
              onClick={addFichier}
              className="bg-white/10 hover:bg-white/20 text-white/60 hover:text-white px-3 rounded-xl border border-white/10 text-sm font-bold transition-all shrink-0"
            >
              ＋
            </button>
          </div>

          <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto">
            {form.fichiersAttendus.length === 0 ? (
              <p className="text-white/15 text-xs text-center py-4">
                Aucun fichier
              </p>
            ) : (
              form.fichiersAttendus.map((fichier, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                >
                  <span className="text-white/70 text-xs truncate flex-1 mr-2 font-mono">
                    {fichier}
                  </span>
                  <button
                    onClick={() => removeFichier(i)}
                    className="text-white/20 hover:text-red-400 text-xs transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* // pour envoyer le test */}
      <button
        onClick={handleSubmit}
        className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm py-3 rounded-xl border border-white/10 transition-all active:scale-[0.98]"
      >
        Ajouter
      </button>
    </div>
  );
}
