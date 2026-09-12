import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Update_User_Formation(
  ID: number,
  data: {
    institution_name?: string;
    title?: string;
    start?: string;
    end?: string;
    description?: string;
    skills?: string[];
    degree?: string;
  },
) {
  const res = await secureFetch(`${BACKEND_URL}/user/formation/${ID}`, {
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
