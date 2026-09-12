# [Route Récupération Fichiers Candidats (Test)]

# [Route GET]

## Description de la features :

Cette route permet de récupérer l'intégralité des chemins d'accès aux fichiers déposés par tous les candidats ayant postulé à un test technique spécifique lié à une offre.

## Technique

### Dependances :

- **express** : Framework web.
- **../../DB** : Module de connexion à la base de données PostgreSQL.

### Fichier cles :

- **Get_Candidats_test.js** : Gère l'extraction et l'agrégation des fichiers de candidatures.
- **DB.js** : Exécute la requête complexe sur la table `candidature`.

### Flux de donnees

1.  **Client** : Envoie une requête GET à `/get_test/:id` (ID du poste).
2.  **Backend** : Vérifie la validité de l'ID.
3.  **Base de données** :
    - Parcourt la table `candidature`.
    - Utilise `unnest` pour décomposer les tableaux de fichiers.
    - Utilise `array_agg` pour regrouper tous les fichiers de tous les candidats dans un seul tableau global.
4.  **Réponse** : Renvoie un objet JSON contenant la liste `fichier_candidats`.

### 🧠 Logique de fonctionnement

- La route cible la table `candidature` filtrée par `id_poste`.
- Elle traite le cas où la colonne `fichier_candidats` pourrait être nulle via `COALESCE`.
- L'utilisation de `unnest` combiné à `array_agg` permet de transformer plusieurs lignes de tableaux en un seul grand tableau de chaînes de caractères (chemins MinIO).

### 🧪 Tests

- **CI GitHub**. (pas encore)

### 🔐 Sécurité

- **Validation du type** : Vérification que l'ID du poste est bien un entier.
- **Requêtes paramétrées** : Protection contre les injections SQL.

## 🚀 Déploiement / Configuration

- Déployé dans le conteneur **backend**.

## 📌 Notes complémentaires

Cette route est principalement utilisée par le système de correction ou de revue pour accéder aux travaux des candidats.
