"use client";

import React, { useEffect, useRef, useState } from "react";
import DataCandidatureEntreprise from "../../../public/data/cache/candidatures_entreprise.json";
import DataCandidatureProfession from "../../../public/data/cache/candidatures_profession.json";

interface rond {
  color: string;
  text: string;
  value: number;
}

const RondItem = ({ color, text, value }: rond) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full`}
        style={{ backgroundColor: color }}
      ></span>
      <div className="flex flex-row">
        <h3 className="text-black">{text}</h3>
        <h3 className="text-black">{value}%</h3>
      </div>
    </div>
  );
};

// constante pour le donuts
const RADIUS = 90;
const STROKE = 28;
const SIZE = 260;
const C = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// fonction d'affichage d'un donuts
function DonutChart({
  data,
  total,
  label,
  value,
}: {
  data: any[];
  total: number | string | undefined;
  label: string;
  value?: number | string;
}) {
  const sum = data.reduce((s, d) => s + d.value, 0);
  let offset = CIRCUMFERENCE * 0.25;
  console.log(DataCandidatureEntreprise, "licorne");
  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full -rotate-90">
        {data.map((item, i) => {
          const dash = (item.value / sum) * CIRCUMFERENCE;
          const seg = (
            <circle
              key={i}
              cx={C}
              cy={C}
              r={RADIUS}
              fill="none"
              stroke={item.color}
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-black text-3xl font-bold">{total}</span>
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
    </div>
  );
}

const test = [
  {
    total: 2241,
  },
  {
    label: "Jetdev",
    value: 27.18,
    color: "#47AD95",
  },
  {
    label: "HoppR",
    value: 16.29,
    color: "#2A9EBD",
  },
  {
    label: "UBIK Ingénierie",
    value: 11.74,
    color: "#8208D4",
  },
  {
    label: "Autres",
    value: 44.79,
    color: "#414141",
  },
];

export default function Card_data({ type }: { type: boolean }) {
  console.log("test", type);
  const [gauche, setGauche] = useState<boolean>(false);
  useEffect(() => {
    setGauche(type);
  }, [type]);

  return (
    <div className="flex flex-col bg-white rounded-2xl p-4 h-full shadow-sm transition-transform hover:scale-[1.02]">
      <div className="flex flex-row justify-between">
        {gauche ? (
          <h1 className="text-black">Entreprises</h1>
        ) : (
          <h1 className="text-black">Profession</h1>
        )}
        <div className="flex flex-col gap-2">
          <select
            id="periode"
            className="w-45 px-2 py-0.5 bg-white border border-gray-300 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
          >
            <option value="" disabled>
              Sélectionnez une période
            </option>
            <option value="react">Cette semaine</option>
            <option value="vue">Mois</option>
            <option value="svelte">Année</option>
          </select>
        </div>
      </div>
      <div>
        {gauche ? (
          <DonutChart
            total={DataCandidatureEntreprise[0].total}
            label="Candidatures"
            data={DataCandidatureEntreprise.slice(1)}
          />
        ) : (
          <DonutChart
            total={DataCandidatureProfession[0].total}
            label="Candidatures"
            data={DataCandidatureProfession.slice(1)}
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
        {gauche
          ? DataCandidatureEntreprise.slice(1).map((item: any, id: number) => (
              <RondItem
                key={id}
                color={item.color}
                text={item.label}
                value={item.value}
              />
            ))
          : DataCandidatureProfession.slice(1).map((item: any, id: number) => (
              <RondItem
                key={id}
                color={item.color}
                text={item.label}
                value={item.value}
              />
            ))}
      </div>
    </div>
  );
}
