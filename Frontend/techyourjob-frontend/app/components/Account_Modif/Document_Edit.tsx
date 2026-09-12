"use client";
import { useState, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { GoDownload, GoTrash } from "react-icons/go";
import { GrView } from "react-icons/gr";

import { Update_User_Profil } from "@/app/services/Modif_Data/Modif_User_profil";

// type de document
type Doc = { name: string; src: string | null };

// max size du fichier
const MAX_SIZE_MB = 10;

// on verifie si le fichier n'excede pas une certaine taille
async function validateFile(file: File): Promise<string | null> {
  // on fait un chek de la taille
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `${file.name} dépasse ${MAX_SIZE_MB}MB`;
  }

  // on verifie le magic byte de merde
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // on va verifier pour la deuxieme fois apres le backend si c'est bien un type de fichier autorise
  const isPDF =
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46; // PDF
  const isPNG =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47; // PNG
  const isJPG = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff; // JPEG

  if (!isPDF && !isPNG && !isJPG) {
    return `${file.name} : type de fichier non autorisé`;
  }

  // on verifie la double extension
  const nameParts = file.name.split(".");
  if (nameParts.length > 2) {
    return `${file.name} : extension suspecte détectée`;
  }

  return null;
}

export default function Document_Edit({
  isOpen,
  onClose,
  docs,
  setDocs,
  refreshDocs,
}: {
  isOpen: boolean;
  onClose: () => void;
  docs: Doc[];
  setDocs: React.Dispatch<React.SetStateAction<Doc[]>>;
  refreshDocs: () => Promise<void>;
}) {
  const [visualiseurFile, setVisualiseurFile] = useState<string | null>(null); // pour visualiser en grd k'image
  const [loading, setLoading] = useState(false); // pour le chargement d'un fichier
  const RefDuFIchier = useRef<HTMLInputElement>(null); // pour savoir le fichier actuelle

  if (!isOpen) return null;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // liste de tout les fichiers
    const files = Array.from(e.target.files ?? []);

    // on fait une verif sur tout les fichiers
    for (const file of files) {
      const error = await validateFile(file);
      if (error) {
        alert(error);
        continue;
      }

      // on met le loading car on pupload une img
      setLoading(true);
      try {
        // on send le fichier + son nom au back
        await Update_User_Profil({
          doc: file,
          docTitle: file.name,
        });

        // On refresh les docs depuis la db
        await refreshDocs();
      } catch (err) {
        console.error("Erreur upload:", err);
        alert("Erreur lors de l'upload");
      } finally {
        setLoading(false);
      }
    }

    e.target.value = "";
  }

  // pour delete un doc
  async function deleteDoc(i: number) {
    const doc = docs[i];
    setLoading(true);
    try {
      // on send le nom du doc a degager dans la db
      await Update_User_Profil({
        docToDelete: doc.name,
      });

      // On refresh depuis la DB
      await refreshDocs();
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Viewer pour voir le doc en plein ecran */}
      {visualiseurFile && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/80"
          onClick={() => setVisualiseurFile(null)}
        >
          <img
            src={visualiseurFile}
            className="max-w-[80%] max-h-[80vh] rounded-xl object-contain"
          />
        </div>
      )}

      {/* fermer  */}
      <div className="relative w-[60%] bg-[#242424] rounded-3xl p-8 shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={28} />
        </button>

        <h1 className="text-xl font-bold text-white mb-5">
          Modifier les documents
        </h1>

        {/* Liste des documentss */}
        <div className="flex flex-col gap-2 mb-5">
          {docs.map((doc, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3"
            >
              <div className="w-12 h-9 bg-[#333] rounded-md flex items-center justify-center flex-shrink-0">
                {doc.src ? (
                  <img
                    src={doc.src}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  // a degager c'est temporaireiement pour la mise en upload
                  <GoDownload className="text-gray-500 text-base" />
                )}
              </div>
              <span className="flex-1 text-gray-300 text-sm truncate">
                {doc.name}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setVisualiseurFile(doc.src ?? "")}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <GrView className="text-teal-400 text-base" />
                </button>
                <button
                  onClick={() => deleteDoc(i)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <GoTrash className="text-red-400 text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upload d'un documen */}
        <div
          className="border-2 border-dashed border-white/15 hover:border-teal-400/40 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors"
          onClick={() => RefDuFIchier.current?.click()}
        >
          <GoDownload className="text-teal-400 text-2xl" />
          <p className="text-gray-400 text-sm">
            Cliquer pour uploader un document
          </p>
          <p className="text-gray-600 text-xs">PDF, PNG, JPG acceptés</p>
          {/* // input du fichier, qui envoie notre document dans notre fonction de upload */}
          <input
            ref={RefDuFIchier}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>
    </div>
  );
}
