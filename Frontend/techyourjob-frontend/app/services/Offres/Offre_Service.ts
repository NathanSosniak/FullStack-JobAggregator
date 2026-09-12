const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Get_Offre(
  reverse: string | boolean,
  start: number,
  minsalary: number | null = null,
  maxsalary: number | null = null,
  location: string | null = null,
  distance: number | null = null,
  contract: string | null = null,
  remote: string | null = null,
  language: string | null = null,
  experience: number | null = null,
  age: number | null = null,
) {
  const params = new URLSearchParams();

  if (minsalary) params.append("minsalary", minsalary.toString());
  if (maxsalary) params.append("maxsalary", maxsalary.toString());
  if (location) params.append("location", location);
  if (distance) params.append("distance", distance.toString());
  if (contract) params.append("contract", contract);
  if (remote) params.append("remote", remote);
  if (language) params.append("language", language);
  if (experience) params.append("experience", experience.toString());
  if (age) params.append("age", age.toString());

  const url = `${BACKEND_URL}/grouped_posts/${reverse}/${start}?${params.toString()}`;

  const res = await fetch(url, {
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
