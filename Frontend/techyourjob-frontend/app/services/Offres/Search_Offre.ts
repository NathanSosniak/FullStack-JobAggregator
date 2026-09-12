const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchPosts(query: string, page: number) {
  const res = await fetch(
    `${BACKEND_URL}/posts/search?q=${encodeURIComponent(query)}&page=${page}`,
    {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!res.ok) throw new Error("Erreur API");

  return res.json();
}
