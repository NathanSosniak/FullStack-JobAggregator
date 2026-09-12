import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Delete_User_Experience(ID: number) {
  const res = await secureFetch(`${BACKEND_URL}/user/experience/${ID}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Erreur API ${res.status}: ${await res.text()}`);
  return res.json();
}
