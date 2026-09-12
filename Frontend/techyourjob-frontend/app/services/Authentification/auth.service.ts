const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Register(
  name: string,
  firstname: string,
  email: string,
  password: string,
  role: string = "user",
) {
  console.log(name, firstname, email, password);
  const res = await fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    cache: "no-store", // Sert a ne pas garder ce qu'on met en cache de next
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      firstname,
      email,
      password,
      role,
    }),
  });
  if (!res.ok) throw new Error("Erreur API");

  return res.json();
}

export async function Login(email: string, password: string) {
  console.log(email, password);
  const res = await fetch(`${BACKEND_URL}/login`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  if (!res.ok) throw new Error("Erreur API");

  return res.ok;
}
