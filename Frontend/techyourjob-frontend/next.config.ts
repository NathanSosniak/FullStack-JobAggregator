// Frontend/techyourjob-frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // pins root to this directory
  },
  async headers() {
    return [
      {
        // applique c règles à toutes les pages du site
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // ca permet de refuser que tout autre site ne puisse afficher el notre dans une frame et donc modifier des choses a notre insu (jsp comment on écrit insu)
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // éviter que du js puisse etre executé quand un mec esaye de mettre une photo de profil , camouflage du js derriere la photo et ptetre virus etc dc
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload", // ca force a utilisé uniquement les requetes https sinon ils pourraient faire des dingueries entre l'interval des requetes http et https et les secondes la ca veut dire pendant 2 ans MDR on est large
          },
        ],
      },
    ];
  },
};

export default nextConfig;