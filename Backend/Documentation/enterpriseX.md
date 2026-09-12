# [Route Liste des Entreprises]

# [Route GET]

## Description de la features :

Cette route permet de récupérer une liste d'entreprises de manière paginée avec des options de filtrage par secteur d'activité et par type d'entreprise. Elle renvoie également les offres d'emploi associées à chaque entreprise trouvée.

## Technique

### Dependances :

- **express** : Serveur web.
- **../DB** : Connexion à la base de données PostgreSQL.

### Fichier cles :

- **enterpriseX.js** : Logique de filtrage, de pagination et d'agrégation des offres.
- **DB.js** : Interaction avec les tables `entreprise` et `poste`.

### Flux de donnees

1.  **Client** : Appelle `/enterprise/:reverse/:start` avec des filtres optionnels (`sectors`, `types`).
2.  **Backend** : Valide les paramètres, transforme les filtres (chaînes CSV) en tableaux SQL.
3.  **Base de données** :
    - Filtre les entreprises selon le sens de navigation (`reverse`) et le point de départ (`start`).
    - Effectue une jointure/sous-requête pour agréger les offres d'emploi au format JSON.
4.  **Réponse** : Liste de 5 entreprises avec leurs détails et leurs offres.

### 🧠 Logique de fonctionnement

- **Pagination par curseur** : Utilise `:start` (ID de l'entreprise) et `:reverse` (booléen) pour naviguer sans les problèmes de performance du `OFFSET`.
- **Filtres** :
  - `sectors` : Recherche par intersection de tableaux (`&&` en SQL).
  - `types` : Recherche par correspondance de valeur dans un tableau (`ANY`).
- **Agrégation JSON** : La requête utilise `json_agg` et `json_build_object` pour inclure les offres directement dans l'objet entreprise, évitant ainsi le problème des requêtes N+1.
- **Gestion des Logos** : Formate l'URL du logo si celui-ci est stocké localement ou utilise l'URL externe.

### 🧪 Tests

- **CI GitHub**. (pas encore)

### 🔐 Sécurité

- **Validation des types** : Vérification stricte que `reverse` est un booléen et `start` un entier.
- **Requêtes préparées** : Utilisation de paramètres SQL pour sécuriser les filtres et les variables de pagination.

## 🚀 Déploiement / Configuration

- Conteneur **backend**.

## 📌 Notes complémentaires

None
