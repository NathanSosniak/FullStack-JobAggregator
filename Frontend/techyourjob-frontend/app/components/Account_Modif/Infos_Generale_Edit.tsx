"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Update_User_Global } from "@/app/services/Modif_Data/Modif_User_Global";
import { Update_User_Profil } from "@/app/services/Modif_Data/Modif_User_profil";

interface Info {
  nom: string;
  prenom: string;
  profession_actuelle: string;
  localisation: string;
  pays: string;
  PP?: string;
  banniere?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  infos: Info;
  onSave: (infos: Info) => void;
}

export default function Infos_Edit({ isOpen, onClose, infos, onSave }: Props) {
  const [form, setForm] = useState<Info>(infos);
  const [loading, setLoading] = useState(false);

  // Constante pour avatar er banniere
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      await Promise.all([
        Update_User_Global({
          name: form.nom,
          firstname: form.prenom,
          location: form.localisation,
          country: form.pays,
        }),
        Update_User_Profil({
          job: form.profession_actuelle,
          ...(avatar && { avatar }),
          ...(banner && { banner }),
        }),
      ]);

      onSave({
        ...form,
        ...(avatarPreview && { PP: avatarPreview }),
        ...(bannerPreview && { banniere: bannerPreview }),
      });
      onClose();
    } catch (err) {
      console.error("Erreur sauvegarde infos:", err);
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

        <h1 className="text-xl font-bold text-white mb-6">
          Modifier les informations
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-gray-400 text-xs">Nom</label>
              <input
                value={form.nom ?? ""}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-300 text-sm outline-none focus:border-teal-400/50 transition-colors"
                placeholder="Nom"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-gray-400 text-xs">Prenom</label>
              <input
                value={form.prenom ?? ""}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-300 text-sm outline-none focus:border-teal-400/50 transition-colors"
                placeholder="Prenom"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-xs">Profession actuelle</label>
            <input
              value={form.profession_actuelle ?? ""}
              onChange={(e) =>
                setForm({ ...form, profession_actuelle: e.target.value })
              }
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-300 text-sm outline-none focus:border-teal-400/50 transition-colors"
              placeholder="Ex: Etudiant a Epitech"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-gray-400 text-xs">Localisation</label>
              <input
                value={form.localisation ?? ""}
                onChange={(e) =>
                  setForm({ ...form, localisation: e.target.value })
                }
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-300 text-sm outline-none focus:border-teal-400/50 transition-colors"
                placeholder="Ex: Lille"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-gray-400 text-xs">Pays</label>
              <input
                value={form.pays ?? ""}
                onChange={(e) => setForm({ ...form, pays: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-300 text-sm outline-none focus:border-teal-400/50 transition-colors"
                placeholder="Ex: France"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-gray-400 text-xs">Banniere</label>
              {bannerPreview && (
                <img
                  src={bannerPreview}
                  className="w-full h-16 object-cover rounded-xl"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setBanner(file);
                  setBannerPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-500 text-sm outline-none file:mr-3 file:bg-white/10 file:border-0 file:text-gray-500 file:text-xs file:font-semibold file:rounded-lg file:px-3 file:py-1"
              />
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-gray-400 text-xs">Photo de profil</label>
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  className="w-16 h-16 object-cover rounded-full border border-white/10"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setAvatar(file);
                  setAvatarPreview(file ? URL.createObjectURL(file) : null);
                }}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-gray-500 text-sm outline-none file:mr-3 file:bg-white/10 file:border-0 file:text-gray-500 file:text-xs file:font-semibold file:rounded-lg file:px-3 file:py-1"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
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
