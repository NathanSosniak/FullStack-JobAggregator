# TechYourJob - Données (Data) 📊

Ce dossier contient l'ensemble des scripts et services dédiés à l'acquisition, au traitement, à l'analyse et à la mise à jour des données pour la plateforme **TechYourJob**.

## 📁 Structure du dossier

### 1. `Get_Data_API/`

Ce module gère la récupération des offres d'emploi depuis l'API de WeLoveDevs, le pré-traitement des données et leur insertion dans la base de données PostgreSQL.

- **Scraping :** `Get_Offre_API.py` récupère les données brutes.
- **Pré-traitement :** Le Notebook `Pre_Processing.ipynb` nettoie les descriptions et formate les données.
- **Insertion :** `Add_API_DB.py` lit les données nettoyées et les insère dans les tables `entreprise` et `poste`.
- **Orchestration :** `UpdateDB.py` lance l'intégralité du pipeline de mise à jour. Ce processus est également automatisé par un conteneur Docker via une tâche Cron.

### 2. `Add_entreprise/`

Scripts dédiés à l'enrichissement des profils d'entreprises dans la base de données. Exécutés à la suite de `UpdateDB.py`.

- **Logos :** `add_logo.py` récupère automatiquement les logos des entreprises via l'API _logo.dev_ ou génère des initiales avec _ui-avatars_.
- **Statistiques :** `add_stats.py` calcule et met à jour les agrégats (visites, clics, postulations).
- **Classement (Ranking) :** `add_ranking.py` attribue un score normalisé et un classement aux entreprises basé sur leur attractivité (calcul incluant des logarithmes népériens pour lisser les disparités).

### 3. `Dashboard/`

Module destiné à la génération de données statistiques pour le Frontend.

- Utilise des notebooks Jupyter (`candidatures_profession.ipynb`, `Entreprise_Candidature.ipynb`) pour analyser les données de la base.
- Un conteneur Docker avec un service Cron exécute ces notebooks toutes les 15 minutes et génère des fichiers JSON stockés dans le cache du Frontend.

### 4. `Get_DB/`

Outils pour extraire des informations spécifiques de la base de données.

- `get_entreprises.py` génère un fichier JSON répertoriant les entreprises pour le cache du Backend.

## 🚀 Peupler la base de données

Pour initialiser ou mettre à jour l'ensemble des données dans le projet (entreprises, offres, logos, statistiques et classements), vous devez exécuter le script principal d'orchestration depuis le dossier racine du projet ou directement depuis `Data/` :

```bash
# Assurez-vous d'avoir installé les dépendances et activé votre environnement virtuel
python Get_Data_API/UpdateDB.py
```

_Note : Les accès à la base de données et aux API externes nécessitent un fichier `.env` correctement configuré (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `PORT_DB`, `LOGODEV_KEY`, etc.)._
