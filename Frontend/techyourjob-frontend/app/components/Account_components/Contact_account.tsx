"use client";
import { useState } from "react";

import { FaPencil } from "react-icons/fa6";
import { MdLocalPhone } from "react-icons/md";
import { AiOutlineMail } from "react-icons/ai";
import Contact_Edit from "../Account_Modif/Contact_Edit";

interface Info {
  email: string;
  telephone: string;
}

export default function Contact_account({
  isEdit,
  infos,
}: {
  isEdit: boolean;
  infos: Info;
}) {
  // const [Phone, setPhone] = useState("+33 7 87 93 47 91");
  // const [Email, setEmail] = useState("nathan.sosniak@epitech.eu");

  // temporiairement !!!1!
  const [email, setEmail] = useState(infos.email);
  const [telephone, setTelephone] = useState(infos.telephone);

  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl p-5 gap-4">
      <Contact_Edit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        email={email}
        telephone={telephone}
        onSave={(e, t) => {
          setEmail(e);
          setTelephone(t);
        }}
      />
      <h1 className="flex items-center gap-3 text-white font-bold">
        Contact
        {isEdit == true && (
          <span onClick={() => setIsEditOpen(true)} className="cursor-pointer">
            <FaPencil className="text-gray-500 text-sm" />
          </span>
        )}
      </h1>

      <div className="flex flex-row gap-10">
        <span className="flex items-center gap-2">
          <MdLocalPhone className="text-teal-400 text-lg" />
          <h2 className="text-gray-300 text-sm">{telephone}</h2>
        </span>
        <span className="flex items-center gap-2">
          <AiOutlineMail className="text-teal-400 text-lg" />
          <h2 className="text-gray-300 text-sm">{infos.email}</h2>
        </span>
      </div>
    </div>
  );
}
