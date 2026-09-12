const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
import { secureFetch } from "./Authentification/refresh";

export async function Get_User_Info() {
  const url = `${BACKEND_URL}/user`;

  const res = await secureFetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  // if (!res.ok) throw new Error("Erreur API");
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }
  return res.json();
}
