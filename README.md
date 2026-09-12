# TechYourJob 🚀

TechYourJob est une plateforme moderne d'agrégation d'offres d'emploi spécialisée dans le secteur de la technologie. Elle utilise l'intelligence artificielle pour proposer des recommandations personnalisées aux utilisateurs en fonction de leur profil et de leurs compétences.

## 🌟 Fonctionnalités principales

- **Agrégateur d'offres :** Centralisation d'offres d'emploi provenant de diverses sources via des scripts de scraping automatisés.
- **Système de Recommandation IA :** Utilisation du modèle _Nearest Neighbors_ avec _TfidfVectorizer_ pour faire matcher les profils utilisateurs avec les postes les plus pertinents.
- **Gestion de Profil :** Création de profils détaillés incluant expériences professionnelles, formations et compétences techniques.
- **Recherche Avancée :** Filtrage précis des offres par technologie, localisation et type de poste.
- **Tableau de Bord :** Visualisation de données et statistiques sur le marché de l'emploi tech.
- **Stockage Sécurisé :** Gestion des documents (CV, logos) via Minio (Object Storage).
- **Test technique :** les entreprises peuvent mettre en place des tests techniques et lancer depuis notre application les fichiers que les candidats déposent.

## 🛠️ Architecture Technique

Le projet repose sur une architecture micro-services conteneurisée :

- **Frontend :** [Next.js](https://nextjs.org/) (React) avec Tailwind CSS et TypeScript.
- **Backend :** [Node.js](https://nodejs.org/) avec Express.js.
- **Base de Données :** [PostgreSQL](https://www.postgresql.org/) avec l'extension spatiale **PostGIS**.
- **Service IA :** Python avec [FastAPI](https://fastapi.tiangolo.com/) et [Scikit-learn](https://scikit-learn.org/).
- **Traitement de Données :** Scripts Python pour le scraping et le pré-processing.
- **Stockage :** [Minio](https://min.io/) pour la gestion des fichiers S3-compatible.
- **Orchestration :** [Docker](https://www.docker.com/) & Docker Compose.

## 🚀 Installation et Lancement

### Prérequis

- [Docker](https://www.docker.com/get-started) et [Docker Compose](https://docs.docker.com/compose/install/) installés sur votre machine.

### Étapes de lancement

1.  **Cloner le dépôt :**

    ```bash
    git clone <repository-url>
    cd B-YEP-200-LIL-2-1-jobaggregator-4
    ```

2.  **Configurer les variables d'environnement :**
    Créez un fichier `.env` à la racine du projet en vous basant sur les besoins identifiés dans le `compose.yaml`.

3.  **Lancer l'application avec Docker Compose :**

    ```bash
    docker compose up --build
    ```

4.  **Ajouter des données à la base de données :**
    Pour peupler la base avec les données initiales (offres, entreprises, statistiques), il est nécessaire de créer un environnement virtuel Python et d'installer les dépendances avant d'exécuter le script de mise à jour :

    ```bash
    # Créer et activer l'environnement virtuel
    python3 -m venv venv
    source venv/bin/activate  # Sur Windows : venv\Scripts\activate

    # Installer les dépendances
    pip install -r requirements.txt

    # Lancer le script d'ajout de données
    python Data/Get_Data_API/UpdateDB.py
    ```

5.  **Accéder aux services :**
    - **Frontend :** `http://localhost:3000`
    - **Backend API :** `http://localhost:5000`
    - **Service IA :** `http://localhost:8000`
    - **Console Minio :** `http://localhost:9001`

## 📁 Structure du Projet

- `Frontend/techyourjob-frontend/` : Application client Next.js.
- `Backend/` : API Node.js/Express et logique métier.
- `IA/` : Modèles de prédiction et service API FastAPI.
- `Data/` : Scripts de scraping (`Get_Data_API`) et outils de dashboarding.
- `Rapport/` : Documentation stratégique, étude de marché et business plan.
- `db/` : Données persistantes de la base de données.
- `Cyber/` : Notes liées à la sécurité du projet.

## 📊 Intelligence Artificielle

Le moteur de recommandation traite les descriptions de postes et les compétences des utilisateurs pour calculer un score de similarité. Il prend en compte :

- L'intitulé du poste (avec une pondération forte).
- Les compétences techniques.
- Les stop words français pour affiner la précision.

Les modèles sont entraînés périodiquement et exportés via `joblib` pour être servis par l'API IA.

---

Projet réalisé dans le cadre du cursus Epitech.
