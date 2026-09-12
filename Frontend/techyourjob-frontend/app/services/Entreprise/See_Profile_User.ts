import { secureFetch } from "../Authentification/refresh";

export async function See_Profile_User(ID: string) {
  const res = await secureFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/${ID}/account`,
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }
  return res.json();
}
