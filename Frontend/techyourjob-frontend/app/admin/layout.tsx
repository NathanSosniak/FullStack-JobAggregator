import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //ici le children grace a react cest directement page.tsx dans admin, ca va etre remplacer lorsque cest executé par ce qui est dans le dossier avec lui
  // recup des cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value; //?. ca sert a ne pas faire crash , ne pas avoir d'erreur. ca remplace par 'undefined' si il trouve pas de token

  // si pas de token go home
  if (!token) {
    redirect("/");
  }

  try {
    const secret = process.env.ACCESS_SECRET_KEY ?? "";
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    // AFFICHE LE CONTENU DU TOKEN DANS LE TERMINAL
    console.log("Token décodé :", decoded);
    console.log("Rôle de l'utilisateur :", decoded.role);

    if (decoded.role !== "admin") {
      console.log("Redirection ! Le rôle n'est pas admin.");
      redirect("/");
    }
  } catch (error) {
    console.log("Erreur de vérification JWT :", error);
    redirect("/");
  }

  // si on arrive la ca redirige bien vers notre admin
  return <>{children}</>;
}
