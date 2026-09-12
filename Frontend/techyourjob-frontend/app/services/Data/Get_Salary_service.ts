import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Get_Salaries_By_Page(page: number = 1) {
  const res = await secureFetch(`${BACKEND_URL}/dashboard/salary/${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
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
