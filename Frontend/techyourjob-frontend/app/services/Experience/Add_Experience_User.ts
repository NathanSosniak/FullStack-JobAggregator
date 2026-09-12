import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Add_User_Experience(data: {
  enterprise_name?: string;
  title?: string;
  start?: string;
  end?: string;
  description?: string;
  skills?: string[];
}) {
  const res = await secureFetch(`${BACKEND_URL}/user/experience`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erreur API ${res.status}: ${await res.text()}`);
  return res.json();
}
