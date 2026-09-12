import { secureFetch } from "../Authentification/refresh";

export async function Delete_Poste(userId: number) {
  const res = await secureFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post/${userId}`,
    {
      method: "DELETE",
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur back ${res.status}: ${body}`);
  }
  return res.json();
}
