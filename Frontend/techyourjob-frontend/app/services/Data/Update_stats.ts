import { secureFetch } from "../Authentification/refresh";

const ENV_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const BACKEND_URL = ENV_URL.endsWith("/") ? ENV_URL.slice(0, -1) : ENV_URL;

interface StatsUpdateFields {
  nb_vues_profil?: number;
  candidatures_envoyees?: number;
  candidatures_consultees?: number;
  candidatures_positives?: number;
  candidatures_refusees?: number;
}

export async function Update_Stats_User(
  ID: number,
  fieldsToUpdate: StatsUpdateFields,
) {
  const res = await secureFetch(`${BACKEND_URL}/candidatures/${ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fieldsToUpdate),
  });

  if (!res.ok) {
    if (res.status === 404) {
      return [];
    }

    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }

  return res.json();
}
