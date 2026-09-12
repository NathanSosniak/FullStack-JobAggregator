# [Route Admin Recherche Utilisateur]

# [Route GET]

## Description de la features :

Cette route permet à un administrateur de rechercher des utilisateurs au sein de la base de données en utilisant une chaîne de caractères. La recherche s'effectue sur le nom, le prénom ou l'adresse email.

## Technique

### Dependances :

- **express** : Framework web.
- **../../DB** : Module de connexion à PostgreSQL.
- **../../Middleware** : Fonctions `auth` et `isAdmin`.

### Fichier cles :

- **rechercher_user.js** : Logique de recherche des utilisateurs.
- **DB.js** : Exécution de la requête SQL de recherche.
- **Middleware.js** : Protection de l'accès.

### Flux de donnees

1.  **Administrateur** : Envoie une requête GET à `/admin/user/search?info=recherche`.
2.  **Middleware** : Vérifie l'authentification et les droits admin.
3.  **Backend** : Récupère le paramètre `info` et construit la requête SQL avec des wildcards (`%`).
4.  **Base de données** : Effectue une recherche insensible à la casse (`LOWER`) sur plusieurs colonnes.
5.  **Réponse** : Retourne une liste (JSON) de 20 utilisateurs maximum correspondant aux critères.

### 🧠 Logique de fonctionnement

- La recherche utilise le paramètre de requête `info` (`req.query.info`).
- **Insensibilité à la casse** : Utilisation de la fonction SQL `LOWER()` sur les colonnes et sur la valeur recherchée pour garantir que "Admin" et "admin" retournent les mêmes résultats.
- **Correspondance partielle** : Utilisation de l'opérateur `LIKE` avec `%` de chaque côté de la chaîne de recherche.
- **Colonnes ciblées** : `nom`, `prenom`, `email`.
- **Limitation** : Les résultats sont limités à **20 entrées** par requête pour optimiser les performances et sont triés par nom dans l'ordre alphabétique.

### 🧪 Tests

- **CI GitHub** : Tests automatisés. (pas encore)

### 🔐 Sécurité

- **Accès restreint** : Route protégée par les middlewares `auth` et `isAdmin`.
- **Prévention des injections SQL** : Utilisation de requêtes paramétrées (`$1`).
- **Principe du moindre privilège** : Seules les colonnes nécessaires (`id`, `nom`, `prenom`, `email`, `role`) sont renvoyées. Le mot de passe n'est jamais exposé.

## 🚀 Déploiement / Configuration

- Déployé dans le conteneur **backend**.

## 📌 Notes complémentaires

None
