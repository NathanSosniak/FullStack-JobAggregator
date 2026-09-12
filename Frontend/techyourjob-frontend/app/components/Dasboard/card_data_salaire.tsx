"use client";

import { useEffect, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Get_Salaries_By_Page } from "@/app/services/Data/Get_Salary_service";

export default function Card_Data_Salaire() {
  const [page, setPage] = useState(1);
  const [salaries, setSalaries] = useState<any[]>([]);

  // quand on change de page
  useEffect(() => {
    async function loadData() {
      try {
        const data = await Get_Salaries_By_Page(page);
        console.log("qqqqqq", data);
        setSalaries(data);
      } catch (err) {
        console.error("Erreur chargement salaires:", err);
      }
    }
    loadData();
  }, [page]);

  return (
    <div className="flex flex-col bg-white rounded-2xl p-4 h-full shadow-sm transition-transform hover:scale-[1.02] gap-7">
      <div className="flex flex-row justify-between">
        <h1 className="text-black">Salaire</h1>
        <div className="flex flex-col gap-2">
          <select
            id="periode"
            defaultValue=""
            className="w-45 px-2 py-0.5 bg-white border border-gray-300 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-black focus:border-black text-gray-700"
          >
            <option value="" disabled>
              Sélectionnez une période
            </option>
            <option value="semaine">Cette semaine</option>
            <option value="mois">Mois</option>
            <option value="annee">Année</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col w-full rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#8E8E8E] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Métier</th>
              <th className="px-4 py-3 font-semibold">Entreprise</th>
              <th className="px-4 py-3 font-semibold">Salaires</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {salaries.map((data, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-800">
                  {data.titre}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {data.nom_compagnie}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {data.salaire_annuel_moyen}
                  {"K "}
                  {data.salaire_currency || "€"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-black">Page {page}/10</h3>
        <div className="flex gap-5 px-5">
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="cursor-pointer text-black disabled:opacity-30"
          >
            <GoArrowLeft />
          </button>
          <button
            disabled={salaries.length < 6}
            onClick={() => setPage((prev) => prev + 1)}
            className="cursor-pointer text-black disabled:opacity-30"
          >
            <GoArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
