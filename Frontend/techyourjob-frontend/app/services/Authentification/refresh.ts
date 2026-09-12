const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function secureFetch(url: string, options: RequestInit = {}) {
  //securite pour pas boucle sur auth si on est deja dedans
  const isAuthPage =
    typeof window !== "undefined" && window.location.pathname === "/auth";

  // je fais la requête de base
  const firstRequest = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // s'il y a un code 401 donc access token invalide
  if (firstRequest.status === 401) {
    if (isAuthPage) {
      return firstRequest;
    }

    const refreshRequest = await fetch(`${BACKEND_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    //s'il y a un code 401 donc le refresh token invalide
    if (!refreshRequest.ok) {
      window.location.href = "/auth";
      return firstRequest;
    }

    // et je réexécute la requête initiale
    const secondRequest = await fetch(url, {
      ...options,
      credentials: "include",
    });

    return secondRequest;
  }

  return firstRequest;
}
