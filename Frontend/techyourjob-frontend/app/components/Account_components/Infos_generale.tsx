"use client";
import { useState } from "react";

import { FaPencil } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";

import Infos_Edit from "../Account_Modif/Infos_Generale_Edit";

interface Info {
  nom: string;
  prenom: string;
  profession_actuelle: string;
  localisation: string;
  pays: string;
  banniere: string;
  PP: string;
}

export default function Infos_generale({
  isEdit,
  infos,
}: {
  isEdit: boolean;
  infos: Info;
}) {
  const [data, setData] = useState<Info>(infos);

  // pour ouvrir la poup modif
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl p-5 gap-3">
      <Infos_Edit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        infos={infos}
        onSave={(newInfos) => setData({ ...data, ...newInfos })}
      />
      <h1 className="flex items-center gap-3 text-white font-bold">
        Informations Générales
        {isEdit == true && (
          <span>
            <FaPencil
              onClick={() => setIsEditOpen(true)}
              className="text-gray-500 text-sm cursor-pointer"
            />
          </span>
        )}
      </h1>

      <div className="relative mb-8">
        <img
          className="w-full h-36 object-cover rounded-2xl bg-[#1e3a4a]"
          src={data.banniere}
        />
        <img
          className="absolute -bottom-8 left-4 w-20 h-20 object-cover rounded-xl border-[3px] border-[#242424]"
          src={data.PP}
        />
      </div>

      <div className="flex flex-row items-start gap-6 pl-24 pb-2">
        <div className="flex flex-col flex-1">
          <h1 className="text-white font-bold text-base">
            {data.nom} {data.prenom}
          </h1>
          <p className="text-gray-400 text-xs leading-snug">
            {data.profession_actuelle}
          </p>
        </div>
        <span className="flex items-center gap-1 pt-0.5 whitespace-nowrap flex-shrink-0">
          <HiOutlineLocationMarker className="text-purple-400" />
          <h2 className="text-gray-300 text-sm">
            {data.localisation} {data.pays}
          </h2>
        </span>
        <div className="grid grid-cols-[32px_1fr] gap-2 items-start flex-shrink-0">
          {/* <img src={logo} className="w-8 h-8 object-cover rounded-lg" /> */}
          {/* <div className="flex flex-col">
            <h2 className="text-white font-bold text-xs leading-snug">
              {Ecole_emplacement}
            </h2>
            <h6 className="text-gray-400 text-xs font-normal">{Date}</h6>
          </div> */}
        </div>
      </div>
    </div>
  );
}
