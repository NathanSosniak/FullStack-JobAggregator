# Suggestion d'emploie

# Modèle de prédiction SKlearn

## Description de la features :

Notre modèle de prédiction permet de recommander des offres d’emploi en fonction des données de l’utilisateur.
Grâce à SQLAlchemy, nous effectuons des requêtes vers notre base de données afin de récupérer les informations les plus pertinentes concernant les postes disponibles. Nous appliquons ensuite le même traitement aux utilisateurs préalablement ajoutés dans la base de données afin de tester et valider le bon fonctionnement du modèle.

Une fois les données récupérées, elles sont converties en fichiers CSV (users et postes). Ces fichiers sont ensuite traités avec TfidfVectorizer, qui transforme les données textuelles en vecteurs mathématiques exploitables par le modèle de prédiction NearestNeighbors.

Après l’entraînement du modèle, les différents éléments sont exportés au format .pkl via joblib :

le modèle d’intelligence artificielle,
les données vectorisées,
ainsi que l’ensemble des données utilisées.

Un système de pondération est appliqué afin d’accorder davantage d’importance au titre du poste et aux compétences demandées.
De plus, pour réduire le bruit dans les données et améliorer la précision des recommandations, une liste de stop words français est utilisée.

## Technique

### Dependances :

- Pandas

- TfidVectorizer

- NearestNeighbors

- Joblib

- SqlAlchemy

### Fichier cles :

Le notebook Jupyter principal est nommé 'ia.ipynb'.

### Flux de donnees

- Connexion à la base de données avec SQLAlchemy
- Requêtes vers la base afin de récupérer les données des postes et des utilisateurs
- Transformation des données en fichiers CSV
- Vectorisation des données textuelles avec TfidfVectorizer
- Entraînement du modèle NearestNeighbors
- Export des modèles et données avec joblib

### 🧪 Tests

Des profils fictifs ont été ajoutés dans la base de données avec :

différents métiers dans la tech,
des compétences variées,
plusieurs niveaux d’expérience.

Ces tests permettent de vérifier la pertinence des recommandations générées par le modèle sur différents types de profils.
L’objectif est d’obtenir au minimum 2 recommandations pertinentes sur 3.

## 🚀 Déploiement / Configuration

Le déploiement sera intégré au front-end en utilisant les données de l’utilisateur connecté.
Un conteneur Docker dédié à l’intelligence artificielle sera également mis en place afin d’isoler et de déployer le modèle de manière indépendante.
