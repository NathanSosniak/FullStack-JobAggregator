import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Upload_Candidature(offre_id: number, fichier: File) {
  const formData = new FormData();
  formData.append("doc", fichier);
  formData.append("offre_id", String(offre_id));

  const url = `${BACKEND_URL}/uploadtest`;

  const res = await secureFetch(url, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }
  return res.json();
}
