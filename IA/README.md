# TechYourJob - Intelligence Artificielle (IA) 🧠

Ce dossier contient le moteur de recommandation d'offres d'emploi de la plateforme **TechYourJob**. Il s'agit d'un service autonome capable de calculer la similarité entre le profil d'un utilisateur et les milliers d'annonces disponibles.

## 🚀 Vue d'ensemble

Le moteur utilise une approche de **Machine Learning classique** (non-générative) pour garantir rapidité, légèreté (< 500 Mo) et une exécution 100% locale sans dépendance externe.

- **Modèle :** K-Nearest Neighbors (KNN) via Scikit-Learn.
- **Vectorisation :** TF-IDF (Term Frequency-Inverse Document Frequency).
- **Service :** API REST haute performance avec FastAPI.

## ✨ Fonctionnalités

- **Matching intelligent :** Calcule un score de pertinence entre un utilisateur et les postes.
- **Pondération sémantique :** Les compétences techniques et les intitulés de postes sont sur-pondérés par rapport aux descriptions pour améliorer la précision.
- **Inférence ultra-rapide :** Résultats renvoyés en quelques millisecondes.
- **Sécurisation des données :** Gestion propre des valeurs manquantes (NaN) pour éviter les erreurs de formatage JSON.

## 📁 Structure du dossier

- `ia.py` : Le serveur FastAPI qui expose l'endpoint `/recommend`.
- `ia.ipynb` : Notebook Jupyter utilisé pour l'entraînement, les tests et l'export du modèle.
- `model_ia.joblib` : Le modèle KNN entraîné et sérialisé.
- `vectorizer.joblib` : Le vectoriseur TF-IDF contenant le dictionnaire technique.
- `postes_data.pkl` : Version compressée de la base de données des postes utilisée pour le calcul de distance.
- `Doc/` : Documentation détaillée sur les choix technologiques et le fonctionnement interne.

## 🛠️ Stack Technique

- **Langage :** Python 3.12+
- **Bibliothèques :**
  - `scikit-learn` : Pour le KNN et la vectorisation.
  - `pandas` & `numpy` : Traitement des données.
  - `fastapi` & `uvicorn` : Serveur API.
  - `joblib` : Sérialisation des modèles.

## 🚀 Installation et Lancement

### Lancement Local

1. **Installer les dépendances :**

   ```bash
   pip install -r requirements.txt
   ```

2. **Démarrer le service :**
   ```bash
   uvicorn ia:app --host 0.0.0.0 --port 8000
   ```
   L'API sera disponible sur `http://localhost:8000`.

### Via Docker (Recommandé)

Le service est automatiquement orchestré par le `compose.yaml` à la racine.

```bash
docker build -t techyourjob-ia .
docker run -p 8000:8000 techyourjob-ia
```

## 📈 Entraînement et Mise à jour

Pour mettre à jour le modèle avec de nouvelles données :

1. Ouvrez le notebook `ia.ipynb`.
2. Exécutez les cellules pour récupérer les dernières données de la DB.
3. Entraînez le modèle et exportez les fichiers `.joblib` et `.pkl`.
4. Redémarrez le conteneur IA.

---

Projet réalisé par l'équipe de développement TechYourJob.
