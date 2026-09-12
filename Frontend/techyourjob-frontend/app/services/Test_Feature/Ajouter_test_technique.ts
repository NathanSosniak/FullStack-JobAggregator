import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = "http://localhost:5000";

interface TestTechniqueData {
  description: string;
  dateRendu: string;
  consignes: string;
  fichiersAttendus: string[];
  statut: string;
}

export async function Save_Test_Technique(
  idPoste: number,
  data: TestTechniqueData,
) {
  const response = await secureFetch(
    `${BACKEND_URL}/poste/test-technique/${idPoste}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `Erreur serveur ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }

  return { message: "Succès" };
}
