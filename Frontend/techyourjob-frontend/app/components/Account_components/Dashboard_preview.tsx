"use client";
import { useState, useEffect } from "react";
import { CiViewTable } from "react-icons/ci";

import DashboardModal from "../Dasboard/card-dashboard";
import { Get_User_Info } from "@/app/services/Info_User_Service";

function Rond({
  couleur,
  nombre,
  titre,
  preview1,
  preview2,
}: {
  couleur: string;
  nombre: number | string;
  titre: string;
  preview1: string;
  preview2: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
        <div
          className={`w-[72px] h-[72px] rounded-full border-[6px] ${couleur} flex items-center justify-center`}
        >
          <h3 className="text-white text-xl font-bold">{nombre}</h3>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-white text-sm font-semibold">{titre}</h2>
          <div className="flex flex-col">
            <p className="text-[11px] text-gray-400">{preview1}</p>
            <p className="text-[11px] text-gray-400">{preview2}</p>
            <p className="text-[11px] text-gray-600">…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashBoardPreviewProps {
  infos?: any;
}

export default function DashBoard_Preview({ infos }: DashBoardPreviewProps) {
  //date
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ovuerture du dashboard
  const [dashboardOpen, setDashboardOpen] = useState(false);

  // data user
  const [Data, setData] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const data = await Get_User_Info();
      setData(data);
      console.log(data.profil[0].candidatures_envoyees, "ddd");
    };
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col bg-[#242424] rounded-3xl items-center gap-5 p-6 w-[300px]">
      {dashboardOpen && (
        <DashboardModal
          isOpen={dashboardOpen}
          onClose={() => setDashboardOpen(false)}
        />
      )}
      <h1 className="flex items-center gap-3 text-white font-semibold">
        Aperçu du Dashboard
        <span>
          <CiViewTable />
        </span>
      </h1>

      {/* Partie date */}
      <div className="flex flex-row items-center gap-2">
        <p className="text-gray-400 text-sm">Du</p>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={`rounded-lg px-3 py-1.5 text-xs border outline-none transition-all cursor-pointer [color-scheme:dark]
            ${
              startDate
                ? "bg-purple-950/50 border-purple-800/60 text-purple-300"
                : "bg-white/5 border-white/10 text-gray-300 focus:border-purple-700/50 focus:bg-purple-950/20"
            }`}
        />
        <p className="text-gray-400 text-sm">au</p>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={`rounded-lg px-3 py-1.5 text-xs border outline-none transition-all cursor-pointer [color-scheme:dark]
            ${
              endDate
                ? "bg-purple-950/50 border-purple-800/60 text-purple-300"
                : "bg-white/5 border-white/10 text-gray-300 focus:border-purple-700/50 focus:bg-purple-950/20"
            }`}
        />
      </div>

      <div className="flex flex-col gap-5 w-full">
        <Rond
          couleur="border-blue-500"
          nombre={Data?.profil?.[0]?.candidatures_envoyees || 0}
          titre="Candidatures Soumises"
          preview1="Apple iOS Designer - 16/04/2026"
          preview2="Google Data Analyst - 12/03/2026"
        />
        <Rond
          couleur="border-teal-400"
          nombre={Data?.profil?.[0]?.candidatures_positives || 0}
          titre="Candidatures Acceptées"
          preview1="Epitech AER - 01/04/2026"
          preview2="Aranet Stagiaire Data - 10/02/2026"
        />
        <Rond
          couleur="border-purple-500"
          nombre={Data?.profil?.[0]?.candidatures_refusees || 0}
          titre="Candidatures Rejetées"
          preview1="Amazon Web Designer - 17/03/2026"
          preview2="CapGemini IA Engineer - 06/01/2026"
        />
      </div>

      <div className="bg-white/15 w-[80%] h-px" />

      <p
        onClick={() => setDashboardOpen(true)}
        className="text-gray-400 text-xs flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
      >
        → Consulter l'intégralité du Dashboard
      </p>
    </div>
  );
}
