const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Get_Fichier_Candidature(id: number) {
  const params = new URLSearchParams();

  const url = `${BACKEND_URL}/get_test/${id}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }
  return res.json();
}
