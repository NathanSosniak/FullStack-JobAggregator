const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Get_Unique_Offre(id: number) {
  const url = `${BACKEND_URL}/post/${id}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
}
