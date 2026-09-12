"use client";

import { useState } from "react";
import Plateforme_Edit from "../Account_Modif/Plateforme_Edit";

import {
  FaPencil,
  FaGithub,
  FaYoutube,
  FaAddressBook,
  FaInstagram,
  FaStackOverflow,
  FaReddit,
  FaLink,
  FaLinkedin,
} from "react-icons/fa6";
import { SiOnlyfans } from "react-icons/si";

//github, yt, linkdine, pf, insta, stackoverflow, autre, reddit
// git, yt, ld, pf, insta, Sover, other, redd

function renderLogo(type: string) {
  switch (type) {
    case "git":
      return <FaGithub className="text-teal-400 text-lg" />;
    case "yt":
      return <FaYoutube className="text-teal-400 text-lg" />;
    case "ld":
      return <FaLinkedin className="text-teal-400 text-lg" />;
    case "pf":
      return <FaAddressBook className="text-teal-400 text-lg" />;
    case "insta":
      return <FaInstagram className="text-teal-400 text-lg" />;
    case "of":
      return <SiOnlyfans className="text-teal-400 text-lg" />;
    case "Sover":
      return <FaStackOverflow className="text-teal-400 text-lg" />;
    case "redd":
      return <FaReddit className="text-teal-400 text-lg" />;
    default:
      return <FaLink className="text-teal-400 text-lg" />;
  }
}

function Plateforme({ icon, lien }: { icon: string; lien: string }) {
  return (
    <div className="flex items-center gap-3">
      {renderLogo(icon)}
      <h6 className="text-gray-300 text-sm">{lien}</h6>
    </div>
  );
}

interface PlateformeItem {
  [key: string]: string;
}

interface Info {
  plateforme: PlateformeItem;
}

export default function Plateforme_Account({
  isEdit,
  infos,
}: {
  isEdit: boolean;
  infos: Info;
}) {
  const plateformes = Object.entries(infos.plateforme ?? {}).map(
    ([icon, lien]) => ({ icon, lien: lien as string }),
  );

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [data, setData] = useState(infos.plateforme ?? {});

  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl p-5 gap-4">
      <Plateforme_Edit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        plateformes={data}
        onSave={setData}
      />
      <h1 className="flex items-center gap-3 text-white font-bold">
        Plateformes
        {isEdit == true && (
          <span onClick={() => setIsEditOpen(true)} className="cursor-pointer">
            <FaPencil className="text-gray-500 text-sm" />
          </span>
        )}
      </h1>

      <div className="flex flex-col gap-3">
        {plateformes.map((p, i) => (
          <Plateforme key={i} icon={p.icon} lien={p.lien} />
        ))}
      </div>
    </div>
  );
}
