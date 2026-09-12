# [Route Recherche d'Offres (Full-Text Search)]

# [Route GET]

## Description de la features :

Cette route permet d'effectuer une recherche textuelle avancée (Full-Text Search) sur l'intégralité des offres d'emploi. Elle utilise la puissance de PostgreSQL pour indexer et classer les résultats par pertinence (ranking) en fonction des mots-clés saisis.

## Technique

### Dependances :

- **express** : Framework web.
- **../../DB** : Connexion à la base de données.
- **PostgreSQL Full-Text Search** : Utilisation de `tsvector`, `tsquery` et `ts_rank`.

### Fichier cles :

- **searchPosts.js** : Contient l'algorithme de recherche et de pondération.
- **DB.js** : Exécution de la requête complexe.

### Flux de donnees

1.  **Utilisateur** : Saisit une recherche (`q`) et une page (`page`).
2.  **Backend** : Formate la requête (jointure des mots par `&`), calcule l'offset pour la pagination.
3.  **Base de données** :
    - Détermine le dictionnaire de langue (`french`, `english` ou `simple`).
    - Pondère les champs (Titre/Entreprise = A, Description = B, Skills = C, Secteurs = D).
    - Calcule le rang de pertinence.
4.  **Réponse** : Liste JSON de 15 postes triés par pertinence et date.

### 🧠 Logique de fonctionnement

- **Pagination** : 15 résultats par page. L'offset est calculé via `(page - 1) * 15`.
- **Dictionnaires de langue** : La recherche s'adapte à la langue de l'offre pour une meilleure lemmatisation.
- **Pondération (Ranking)** :
  - **A (Haut)** : Titre du poste, nom de l'entreprise.
  - **B** : Description, catégorie.
  - **C** : Compétences (extraites du JSONB).
  - **D (Bas)** : Type et secteur d'activité de l'entreprise.
- **Opérateur logique** : Les mots saisis sont combinés avec l'opérateur `&` (ET), signifiant que tous les mots doivent être présents (ou leurs dérivés).

### 🧪 Tests

- **CI GitHub** : Intégration continue.

### 🔐 Sécurité

- **Validation des entrées** : Vérification que la requête `q` n'est pas vide et que `page` est un entier.
- **Requêtes paramétrées** : Protection contre les injections SQL malgré la complexité de la requête.

## 🚀 Déploiement / Configuration

- Déployé dans le conteneur **backend**.

## 📌 Notes complémentaires

Cette route est plus performante qu'un simple `LIKE` car elle gère les synonymes, les pluriels et la pertinence des résultats.
