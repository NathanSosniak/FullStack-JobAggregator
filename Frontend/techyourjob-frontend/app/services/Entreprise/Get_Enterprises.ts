export async function Get_Enterprises(
  reverse: boolean = false,
  start: number = 0,
  sectors?: string[],
  types?: string[],
) {
  const params = new URLSearchParams();
  if (sectors?.length) params.set("sectors", sectors.join(","));
  if (types?.length) params.set("types", types.join(","));

  const query = params.toString() ? `?${params.toString()}` : "";
  const url = `${process.env.NEXT_PUBLIC_API_URL}/enterprise/${reverse}/${start}${query}`;

  console.log("Fetching:", url);

  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 404) {
      return [];
    }
    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }
  return res.json();
}
