import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// on va aller delete une formation avec son ID
export async function Delete_User_Formation(ID: number) {
  const res = await secureFetch(`${BACKEND_URL}/user/formation/${ID}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Erreur API ${res.status}: ${await res.text()}`);
  return res.json();
}
