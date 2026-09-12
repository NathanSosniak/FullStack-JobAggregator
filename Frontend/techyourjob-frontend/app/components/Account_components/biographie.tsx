"use client";
import { useState } from "react";

import { IoBookOutline } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";

import Bio_Edit from "../Account_Modif/Bio_Edit";

interface Info {
  biographie: string;
}

export default function Biographie_account({
  isEdit,
  infos,
}: {
  isEdit: boolean;
  infos: Info;
}) {
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet consectetur. Malesuada lacus nunc vitae in. Rutrum et ipsum tincidunt quis aliquet id libero sit pretium. Diam metus feugiat nunc mauris risus felis. Erat viverra sociis pellentesque non at. Id nullam porttitor et non sed.\n\nElit lectus dictum eu fermentum at habitasse. Neque nunc justo ullamcorper nunc tellus nam. Ut a viverra risus mi...",
  );

  // pour l'extension du txt
  const [expanded, setExpanded] = useState(false);

  // temporaire !!
  const [bio, setBio] = useState(infos.biographie);
  ////////

  // poup edit bio
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl p-5 gap-4">
      <Bio_Edit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        biographie={bio}
        onSave={setBio}
      />
      <h1 className="flex items-center gap-3 text-white font-bold">
        Biographie
        {isEdit == true && (
          <span onClick={() => setIsEditOpen(true)} className="cursor-pointer">
            <FaPencil className="text-gray-500 text-sm" />
          </span>
        )}
      </h1>

      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
        {/* {infos.biographie} */}
        {bio}
      </p>

      {bio && bio.split("\n").join("").length > 200 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
        >
          <IoBookOutline className="text-base" />
          {expanded ? "Voir moins" : "Voir plus"}
        </button>
      )}

      <div className="bg-white/12 h-px w-full"></div>

      <button className="flex items-center justify-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-white transition-colors">
        <IoBookOutline className="text-base" />
        Voir plus
      </button>
    </div>
  );
}
