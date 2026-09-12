"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ArrowUpRight, Calendar } from "lucide-react";

import { Get_User_Info } from "@/app/services/Info_User_Service";
import Card_data from "./card_data";
import Card_Data_Salaire from "./card_data_salaire";
import JobRecommendations from "./card_IA";

const DateInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatDate = (val: string) => {
    if (!val) return "";
    const [y, m, d] = val.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div
      className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-3 border border-white/10 text-white cursor-pointer relative"
      onClick={() => inputRef.current?.showPicker()}
    >
      {formatDate(value)}
      <Calendar size={14} className="text-white/40" />
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 0,
          height: 0,
        }}
      />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  subValue,
  variant = "white",
  trendValue,
  trend = "up",
}: any) => {
  const variants = {
    blue: "bg-[#1e73be] text-white",
    green: "bg-[#064e3b] text-white",
    purple: "bg-[#a855f7] text-white",
    white: "bg-white text-slate-900",
    grey: "bg-[#e3dfde] text-slate-900",
  };

  return (
    <div
      className={`${
        variants[variant as keyof typeof variants]
      } rounded-2xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm transition-transform hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
          {title}
        </span>
        <div
          className={`p-1 rounded-full border ${
            variant === "white" ? "border-slate-200" : "border-white/20"
          }`}
        >
          <ArrowUpRight size={14} />
        </div>
      </div>
      <h3 className="text-4xl font-bold my-2">{value}</h3>
      <div className="flex items-center gap-2">
        {trendValue && (
          <div
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              variant === "white"
                ? "bg-slate-100 text-slate-700"
                : "bg-white/20"
            }`}
          >
            {trendValue} {trend === "up" ? "▲" : "▼"}
          </div>
        )}
        <p className="text-[10px] opacity-70 italic">{subValue}</p>
      </div>
    </div>
  );
};

export default function DashboardModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-04-28");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  // pour le nombre en attente
  const attente =
    (Data?.profil?.[0]?.candidatures_envoyees || 0) -
    (Data?.profil?.[0]?.candidatures_positives || 0) -
    (Data?.profil?.[0]?.candidatures_refusees || 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay avec flou */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-[#242424] w-full max-w-5xl max-h-[90vh] rounded-[40px] overflow-hidden shadow-2xl border border-white/5 flex flex-col">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Dashboard
              </h1>
            </div>
            <h2 className="text-xl">Statistiques du profil</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-0">
          {/* Filtres Date */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <button className="bg-white/5 px-5 py-2 rounded-xl text-xs font-bold border border-white/10 hover:bg-white/2 transition-colors">
              Depuis toujours
            </button>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span>Du</span>
              <DateInput value={dateFrom} onChange={setDateFrom} />
              <span>au</span>
              <DateInput value={dateTo} onChange={setDateTo} />
            </div>
          </div>

          {/* Grille Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Candidatures Envoyées"
              value={Data?.profil?.[0]?.candidatures_envoyees || 0}
              variant="blue"
              trendValue="5"
              subValue="de plus que la semaine dernière"
            />

            <StatCard
              title="Candidatures Acceptées"
              value={Data?.profil?.[0]?.candidatures_positives || 0}
              variant="green"
              trendValue="3"
              trend="down"
              subValue="de moins que la semaine dernière"
            />
            <StatCard
              title="Candidatures Refusées"
              value={Data?.profil?.[0]?.candidatures_refusees || 0}
              variant="purple"
              trendValue="6"
              subValue="de plus que la semaine dernière"
            />

            {/* Graphique de Vues */}
            {/* <div className="bg-white rounded-2xl p-5 flex flex-col justify-between min-h-[160px]"></div> */}
            <StatCard
              title="Vu du profil"
              variant="grey"
              value={Data?.profil?.[0]?.nb_vues_profil || 0}
              trendValue="3"
              subValue="vs. 12 la semaine dernière"
            />

            <StatCard
              title="Candidatures Consultées"
              value={Data?.profil?.[0]?.candidatures_consultees || 0}
              trendValue="3"
              subValue="vs. 12 la semaine dernière"
            />
            <StatCard
              title="Candidatures en Attente"
              value={attente || 0}
              trendValue="3"
              trend="down"
              subValue="vs. 6 la semaine dernière"
            />
          </div>

          {/* Section Recommandations */}
          <div className="mt-10 pb-4">
            <h2 className="text-white text-lg font-semibold mb-6">Données</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <Card_data type={false} />
              </div>
              <div className="flex flex-col">
                <Card_data type={true} />
              </div>
            </div>
            <div className="w-full mt-7">
              <Card_Data_Salaire />
            </div>
          </div>

          {/* recommandation IA */}
          <div className="mt-10 pb-4">
            <JobRecommendations />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px !important;
          display: block !important;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent !important;
          margin-block: 40px !important;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #7c3aed !important;
          border-radius: 20px !important;
        }
        .custom-scrollbar {
          scrollbar-width: thin !important;
          scrollbar-color: #7c3aed transparent !important;
        }
      `}</style>
    </div>
  );
}
