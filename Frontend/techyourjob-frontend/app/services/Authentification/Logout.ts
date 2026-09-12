import { secureFetch } from "./refresh";
const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export async function Logout_User() {
  try {
    const response = await secureFetch(`${BACKEND_URL}/logout`, {
      method: "GET",
    });

    if (response.ok) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);

    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
    throw error;
  }
}
