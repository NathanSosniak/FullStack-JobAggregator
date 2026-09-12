import { secureFetch } from "../Authentification/refresh";

export async function Rechercher_poste(query: string) {
  const res = await secureFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/poste/search?info=${encodeURIComponent(
      query,
    )}`,
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur back ${res.status}: ${body}`);
  }
  return res.json();
}
