import { secureFetch } from "../Authentification/refresh";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function Update_User_Profil(data: {
  bio?: string;
  social?: { icon: string; lien: string }[];
  job?: string;
  xp?: string;
  language?: number;
  avatar?: File;
  banner?: File;
  doc?: File;
  docTitle?: string;
  docToDelete?: string;
}) {
  const formData = new FormData();

  if (data.bio) formData.append("bio", data.bio);
  if (data.job) formData.append("job", data.job);
  if (data.xp) formData.append("xp", data.xp);
  if (data.language) formData.append("language", String(data.language));
  if (data.docTitle) formData.append("docTitle", data.docTitle);
  if (data.docToDelete) formData.append("docToDelete", data.docToDelete);

  if (data.social) {
    const socialObj = data.social.reduce(
      (acc, { icon, lien }) => {
        if (lien) acc[icon] = lien;
        return acc;
      },
      {} as Record<string, string>,
    );
    formData.append("social", JSON.stringify(socialObj));
  }

  if (data.avatar) formData.append("avatar", data.avatar);
  if (data.banner) formData.append("banner", data.banner);
  if (data.doc) formData.append("doc", data.doc);

  const res = await secureFetch(`${BACKEND_URL}/user/profil`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Erreur API ${res.status}: ${body}`);
  }

  return res.json();
}
