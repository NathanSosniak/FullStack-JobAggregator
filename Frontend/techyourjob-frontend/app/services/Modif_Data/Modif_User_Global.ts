import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Update_User_Global(data: {
  name?: string;
  firstname?: string;
  email?: string;
  tel?: string;
  age?: string;
  country?: string;
  location?: string;
}) {
  const res = await secureFetch(`${BACKEND_URL}/user/global`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }

  return res.json();
}
