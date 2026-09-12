import { secureFetch } from "../Authentification/refresh";

export async function Update_Privilege(userId: number, role: string) {
  const res = await secureFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/privilege/${userId}/${role}`,
    {
      method: "PUT",
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur back ${res.status}: ${body}`);
  }
  return res.json();
}
