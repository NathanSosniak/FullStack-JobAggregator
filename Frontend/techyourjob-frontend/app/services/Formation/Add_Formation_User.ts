import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

// on va aller ajouter une nouvelle formation
export async function Add_User_Formation(data: {
  institution_name?: string;
  title?: string;
  start?: string;
  end?: string;
  description?: string;
  skills?: string[];
  degree?: string;
}) {
  const res = await secureFetch(`${BACKEND_URL}/user/formation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur API ${res.status}: ${await res.text()}`);
  return res.json();
}
