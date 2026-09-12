"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import { Update_User_Formation } from "@/app/services/Formation/Modif_User_formation";
import { Delete_User_Formation } from "@/app/services/Formation/Delete_Formation_User";
import { Add_User_Formation } from "@/app/services/Formation/Add_Formation_User";

interface CompetenceItem {
  competence: string;
  source: string;
}

// interface des formations
interface Props {
  isOpen: boolean;
  onClose: () => void;
  formationId: number;
  institution_name: string;
  title: string;
  start: string;
  end: string;
  description: string;
  skills: CompetenceItem[];
  degree: string;
  onSave: () => void;
}

export default function Formation_Edit({
  isOpen,
  onClose,
  formationId,
  institution_name,
  title,
  start,
  end,
  description,
  skills,
  degree,
  onSave,
}: Props) {
  // pour la creation d'une nouvelle formation
  const isCreation = formationId === -1;

  // pour le forms d'info
  const [form, setForm] = useState({
    institution_name,
    title,
    start: start?.split("T")[0] ?? "", // date bon format
    end: end?.split("T")[0] ?? "",
    description,
    degree: degree ?? "",
  });
  // on met les skills au bon format et on verifie
  const [formSkills, setFormSkills] = useState<string[]>(
    (skills ?? []).map((s: any) =>
      typeof s === "string" ? s : s.competence ?? "",
    ),
  );
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;
  // quand on change els infos
  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  // ajouter un skills
  function addSkill() {
    const trimmed = newSkill.trim();
    if (trimmed && !formSkills.includes(trimmed)) {
      setFormSkills((prev) => [...prev, trimmed]);
      setNewSkill("");
    }
  }

  // remove un skill
  function removeSkill(i: number) {
    setFormSkills((prev) => prev.filter((_, idx) => idx !== i));
  }

  // pour sauvegarder les infos das la db quand on clique sur save et quand on veut en ajouter une
  async function handleSave() {
    setLoading(true);
    try {
      const payload = {
        institution_name: form.institution_name,
        title: form.title,
        start: form.start,
        end: form.end,
        description: form.description,
        skills: formSkills,
        degree: form.degree,
      };

      if (isCreation) {
        await Add_User_Formation(payload);
      } else {
        await Update_User_Formation(formationId, payload);
      }
      onSave();
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  }

  // pour delete une formation
  async function handleDelete() {
    if (!confirm("Supprimer cette formation ?")) return;
    setLoading(true);
    try {
      await Delete_User_Formation(formationId);
      onSave();
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-400/50 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-[60%] max-h-[85vh] overflow-y-auto bg-[#242424] rounded-3xl p-8 shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={28} />
        </button>

        <h1 className="text-xl font-bold text-white mb-6">
          {isCreation ? "Ajouter une formation" : "Modifier la formation"}
        </h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-1 block">
              Établissement
            </label>
            <input
              className={inputClass}
              value={form.institution_name}
              onChange={(e) => handleChange("institution_name", e.target.value)}
              placeholder="Nom de l'établissement"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Titre</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Titre de la formation"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Diplôme</label>
            <input
              className={inputClass}
              value={form.degree}
              onChange={(e) => handleChange("degree", e.target.value)}
              placeholder="Diplôme obtenu"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Début</label>
              <input
                type="date"
                className={inputClass}
                value={form.start}
                onChange={(e) => handleChange("start", e.target.value)}
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Fin</label>
              <input
                type="date"
                className={inputClass}
                value={form.end}
                onChange={(e) => handleChange("end", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">
              Description
            </label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-none`}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Description de la formation"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">
              Compétences
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formSkills.map((skill, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 bg-teal-400/10 text-teal-400 text-xs px-3 py-1.5 rounded-lg"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(i)}
                    className="hover:text-white"
                  >
                    <IoClose size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                placeholder="Ajouter une compétence"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-teal-400/20 text-teal-400 rounded-xl text-sm hover:bg-teal-400/30 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Sauvegarder"}
        </button>
        {!isCreation && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="py-3 px-5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            <GoTrash size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
