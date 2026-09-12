# TechYourJob - Backend ⚙️

Ceci est l'API Backend de la plateforme **TechYourJob**. Elle gère la logique métier, l'authentification, le stockage des données et l'orchestration des environnements de test sécurisés.

## 🛠️ Stack Technique

- **Runtime :** [Node.js](https://nodejs.org/) (v25+)
- **Framework :** [Express.js](https://expressjs.com/)
- **Base de Données :** [PostgreSQL](https://www.postgresql.org/) avec l'extension **PostGIS** pour la géolocalisation.
- **Stockage d'Objets :** [MinIO](https://min.io/) (compatible S3) pour les documents et images.
- **Authentification :** JSON Web Tokens (JWT) avec rotation de tokens (Access & Refresh).
- **Orchestration :** [Dockerode](https://github.com/apocas/dockerode) pour la gestion dynamique des sandboxes.

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Sécurité

- **Gestion des sessions :** Inscription, connexion sécurisée (bcrypt) et déconnexion.
- **Sécurité avancée :** Rate limiting par IP, cookies `httpOnly`, et système de rafraîchissement de token.
- **Récupération :** Flux de réinitialisation de mot de passe par email via Brevo (SMTP).

### 💼 Gestion des Offres (Postes)

- **Recherche Full-Text :** Recherche avancée indexée par pertinence (titre, entreprise, compétences, description).
- **Géolocalisation :** Filtrage des offres par distance (rayon en km) autour d'une ville grâce à PostGIS.
- **Détails complets :** Récupération exhaustive des informations d'un poste et de l'entreprise associée.

### 👤 Profils & Utilisateurs

- **Gestion CRUD :** Mise à jour des informations globales, du profil, des expériences professionnelles et des formations.
- **Médias :** Upload et gestion d'avatars, bannières et documents (CV) sur MinIO.

### 🧪 Tests Techniques & Sandbox

- **Évaluation :** Les recruteurs peuvent définir des consignes et fichiers attendus pour chaque offre.
- **Candidature :** Les candidats déposent leurs solutions (scripts Python, zip) de manière sécurisée.
- **Sandbox Docker :** Lancement dynamique d'un environnement de développement (code-server) isolé pour tester les rendus des candidats sans risque pour le système hôte.

### 🛡️ Administration

- Gestion des privilèges utilisateurs (Admin/User/Entreprise).
- Modération : Suppression d'utilisateurs, d'entreprises ou d'annonces.

## 📁 Structure du Projet

- `script/` :
  - `API.js` : Point d'entrée du serveur Express.
  - `Routes/` : Définition modulaire de tous les endpoints de l'API.
  - `DB.js` & `MINIO.js` : Configurations des clients de données.
  - `Middleware.js` : Gardes d'authentification et de rôle.
- `Documentation/` : Fiches techniques détaillées pour chaque fonctionnalité majeure.
- `Cache/` : Stockage local des logos et données de géocodage inversé pour optimiser les performances.
- `tests/` : Tests unitaires et d'intégration utilisant **Jest** et **Supertest**.

## 🚀 Installation et Lancement

### Prérequis

- **Node.js** (v20+ recommandé)
- **PostgreSQL** avec **PostGIS**
- **MinIO** configuré

### Étapes de lancement (Local)

1. **Installer les dépendances :**

   ```bash
   npm install
   ```

2. **Variables d'environnement :**
   Configurez les accès DB, MinIO et les clés secrètes JWT dans votre environnement ou via un fichier `.env`.

3. **Lancer le serveur :**
   ```bash
   npm start
   ```
   L'API sera exposée sur `http://localhost:5000`.

### Tests

```bash
npm test
```

## 🐳 Déploiement Docker

L'application est conçue pour être conteneurisée.

```bash
docker build -t techyourjob-backend .
```

_Note : Le backend nécessite l'accès au socket Docker de l'hôte (`/var/run/docker.sock`) pour les fonctionnalités de Sandbox._

---

Projet réalisé par l'équipe de développement TechYourJob.
