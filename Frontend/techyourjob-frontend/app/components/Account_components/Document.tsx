"use client";
import { useState, useEffect } from "react";
import { FaPencil } from "react-icons/fa6";
import { GoDownload } from "react-icons/go";
import { GrView } from "react-icons/gr";

import { Get_User_Info } from "@/app/services/Info_User_Service";
type Doc = { name: string; src: string | null };

// les edits
import Document_Edit from "../Account_Modif/Document_Edit";

// affichage d'n document (on passe l'img donc le liens, le titre et le onVIew pour ouvrir en grand)
function Document({
  image,
  titre,
  onView,
}: {
  image: string | null;
  titre: string;
  onView: () => void;
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[90px_1fr_28px] gap-3 items-center py-3">
        <div>
          <img
            src={image ?? undefined}
            className="w-[90px] h-[65px] object-cover rounded-md border border-white/15 bg-white"
          />
        </div>
        <div>
          <h2 className="text-white text-[13px] font-medium leading-snug">
            {titre}
          </h2>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <GoDownload className="text-[#8208D4] text-lg" />
          <GrView onClick={onView} className="text-teal-400 text-lg" />
        </div>
      </div>
    </div>
  );
}

export default function Document_priview({ isEdit }: { isEdit: any }) {
  console.log("isedit ?", isEdit);
  // ouverture popup
  const [isDocumentEdit, setIsDocumentEdit] = useState(false);

  const [docs, setDocs] = useState<Doc[]>([]);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);

  async function fetchDocs() {
    try {
      const data = await Get_User_Info();
      const profil = data.profil?.[0];
      if (profil?.document) {
        // on va ne prmeier verifier si c'est une chaine string ou si c'est deja parses, si c'est pas le cas on le fait
        const parsed =
          typeof profil.document === "string"
            ? JSON.parse(profil.document)
            : profil.document;
        // on veirfie que c'est toujours un array et on va recuperer ce qui nous interesse (le titre et l'url pour notre composents en dessous)
        const mapped: Doc[] = (Array.isArray(parsed) ? parsed : []).map(
          (d: any) => ({
            name: d.title || d.fileName,
            src: d.URL || null,
          }),
        );
        setDocs(mapped);
      }
    } catch (err) {
      console.error("Erreur fetch documents:", err);
    }
  }

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl p-5 w-[300px]">
      {/* Ouverture poup  */}
      <Document_Edit
        isOpen={isDocumentEdit}
        onClose={() => setIsDocumentEdit(false)}
        docs={docs}
        setDocs={setDocs}
        refreshDocs={fetchDocs}
      />
      {viewerSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setViewerSrc(null)}
        >
          <img
            src={viewerSrc}
            className="max-w-[80%] max-h-[80vh] rounded-xl object-contain"
          />
        </div>
      )}

      <h1 className="flex items-center gap-3 text-white font-semibold mb-3">
        Documents
        {isEdit == true && (
          <span
            onClick={() => setIsDocumentEdit(true)}
            className="cursor-pointer"
          >
            <FaPencil className="text-gray-400 text-sm" />
          </span>
        )}
      </h1>
      {docs.length === 0 && (
        <p className="text-gray-500 text-sm">Aucun document</p>
      )}

      {/* Pour X nombre de couments alors on affiche les docuemnts avec nos infos */}
      {docs.map((doc, i) => (
        <div key={i}>
          {i > 0 && <div className="bg-white/12 h-px w-full" />}
          <Document
            image={doc.src}
            titre={doc.name}
            onView={() => doc.src && setViewerSrc(doc.src)}
          />
        </div>
      ))}
    </div>
  );
}
