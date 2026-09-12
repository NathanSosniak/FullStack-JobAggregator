# [Route Admin Recherche Entreprise]

# [Route GET]

## Description de la features :

Cette route permet aux administrateurs de rechercher des entreprises enregistrées dans la plateforme en filtrant par leur nom de compagnie.

## Technique

### Dependances :

- **express** : Serveur Node.js.
- **../../DB** : Driver de base de données.
- **../../Middleware** : Protection `auth` et `isAdmin`.

### Fichier cles :

- **rechercher_entreprise.js** : Logique de recherche entreprise.
- **DB.js** : Requête SQL sur la table `entreprise`.
- **Middleware.js** : Vérification des privilèges.

### Flux de donnees

1.  **Requête** : GET `/admin/entreprise/search?info=nom`.
2.  **Sécurité** : Passage par les filtres d'authentification et d'administration.
3.  **Traitement** : Extraction de l'info de recherche et exécution SQL.
4.  **Sortie** : Liste JSON contenant l'ID et le nom des entreprises.

### 🧠 Logique de fonctionnement

- Utilise `req.query.info` comme base de recherche.
- Applique un filtre SQL `LIKE` insensible à la casse sur la colonne `nom_compagnie`.
- Les résultats sont ordonnés alphabétiquement.
- Une limite de **20 résultats** est appliquée.

### 🧪 Tests

- **CI GitHub**. (pas encore)

### 🔐 Sécurité

- Vérification systématique du rôle administrateur.
- Requêtes paramétrées pour la sécurité de la base de données.

## 🚀 Déploiement / Configuration

- Conteneur **backend**.

## 📌 Notes complémentaires

None
