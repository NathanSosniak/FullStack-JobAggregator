# TechYourJob - Frontend 💻

Ceci est l'application client pour la plateforme **TechYourJob**, développée avec **Next.js**. Elle offre une interface moderne, fluide et réactive pour les candidats et les recruteurs du secteur tech.

## 🛠️ Stack Technique

- **Framework :** [Next.js 15+](https://nextjs.org/) (App Router)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Style :** [Tailwind CSS 4+](https://tailwindcss.com/)
- **Animations :** [Framer Motion](https://www.framer.com/motion/)
- **Cartographie :** [Leaflet](https://leafletjs.org/) (via react-leaflet) pour la visualisation des offres.
- **UI Components :** Radix UI (Slider), Lucide React, Headless UI.
- **Gestion d'état :** React Context API (UserContext).

## ✨ Fonctionnalités Client

### 🔍 Recherche et Navigation

- **Exploration d'offres :** Système de recherche puissant avec filtres avancés (salaire, contrat, télétravail, expérience, distance).
- **Vue Carte interactive :** Visualisation géographique des postes disponibles.
- **Annuaire des Entreprises :** Liste filtrable des entreprises partenaires et consultation de leurs pages dédiées.

### 👤 Gestion de Compte & Profil

- **Profil Utilisateur :** Gestion complète du CV en ligne (biographie, expériences professionnelles, formations, compétences techniques).
- **Gestion de documents :** Upload et visualisation de documents (CV, portfolio) stockés via l'Object Storage.
- **Dashboard Statistique :** Suivi des candidatures (envoyées, acceptées, refusées) et vues du profil.
- **Recommandations IA :** Suggestions personnalisées d'offres d'emploi basées sur le score de matching du profil.

### 🏢 Espace Recruteur

- **Gestion des Candidatures :** Visualisation des fichiers déposés par les candidats.
- **Tests Techniques :** Création et publication de tests techniques pour les offres d'emploi.
- **Lancement de tests :** Intégration possible avec Docker pour exécuter les tests candidats.

### 🛡️ Administration

- **Panel Admin :** Interface de gestion globale permettant de rechercher, modifier ou supprimer des utilisateurs, des entreprises et des annonces.

### 🔑 Authentification & Sécurité

- Flux d'authentification complet (Inscription, Connexion, Déconnexion).
- Récupération de mot de passe par email (Forgot/Reset password).
- Sécurisation des requêtes via un système de **Secure Fetch** avec rotation de tokens (Access/Refresh).
- En-têtes de sécurité configurés (X-Frame-Options, HSTS, No-Sniff).

## 📁 Structure du Projet

- `app/` : Cœur de l'application (pages, layouts et contextes de données).
- `components/` : Composants UI modulaires (NavBar, Filtres, Modals, Previews d'offres).
- `services/` : Logique de communication avec l'API Backend (Authentification, Data, Offres).
- `contexte/` : Gestion de l'état global utilisateur (Context API).
- `public/` : Assets statiques, logos et fichiers de cache pour le dashboard.

## 🚀 Installation et Développement

### Prérequis

- **Node.js** (v20.9.0 recommandé)
- **npm** ou **pnpm**

### Étapes de lancement

1. **Installer les dépendances :**

   ```bash
   npm install
   ```

2. **Configurer l'environnement :**
   Créez un fichier `.env.local` à la racine de ce dossier :

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`.

### Build pour la production

```bash
npm run build
npm start
```

## 🐳 Docker

Un `Dockerfile` est disponible pour déployer l'application de manière isolée.

```bash
docker build -t techyourjob-frontend .
docker run -p 3000:3000 techyourjob-frontend
```

---

Projet réalisé par l'équipe de développement TechYourJob.
