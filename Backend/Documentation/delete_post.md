# [Route Admin Supprimer Poste]

# [Route DELETE]

## Description de la features :

Cette route permet à un administrateur de supprimer définitivement une offre d'emploi (poste) de la base de données en utilisant son identifiant unique (ID).

## Technique

### Dependances :

- **express** : Framework web pour Node.js.
- **../../DB** : Module de connexion à la base de données PostgreSQL.
- **../../Middleware** : Fonctions `auth` (authentification) et `isAdmin` (vérification des droits administrateur).

### Fichier cles :

- **delete_post.js** : Contient la logique de la route de suppression.
- **DB.js** : Gère les requêtes vers la base de données.
- **Middleware.js** : Assure que seul un administrateur authentifié peut accéder à cette route.

### Flux de donnees

1.  **Client** : Envoie une requête DELETE à `/admin/post/:id` avec un token d'administrateur.
2.  **Backend (Middleware)** : Vérifie le token (`auth`) et les droits (`isAdmin`).
3.  **Backend (Route)** : Extrait l'ID et vérifie sa validité.
4.  **Base de données** : Exécute la requête `DELETE FROM poste WHERE id_poste = $1`.
5.  **Client** : Reçoit une confirmation (200), une erreur client (400, 403, 404) ou une erreur serveur (500).

### 🧠 Logique de fonctionnement

- La route récupère l'ID depuis les paramètres de l'URL (`req.params.id`).
- Elle vérifie si l'ID fourni est bien un nombre entier. Si ce n'est pas le cas, elle renvoie une erreur 400.
- Une requête SQL `DELETE` est envoyée à la table `poste`.
- Si aucune ligne n'est supprimée (`rowCount === 0`), cela signifie que le poste n'existe pas, et une erreur 404 est renvoyée.
- En cas de succès, un message "Post deleted" est renvoyé avec un statut 200.

### 🧪 Tests

- **CI GitHub** : Tests automatisés lors de l'intégration continue. (pas encore)

### 🔐 Sécurité

- **Authentification** : L'utilisateur doit être connecté (`auth`).
- **Autorisation** : L'utilisateur doit posséder le rôle d'administrateur (`isAdmin`).
- **Validation des entrées** : Vérification que l'ID est un entier pour prévenir les erreurs de requête ou les manipulations.
- **Requêtes paramétrées** : Utilisation de `$1` pour éviter les injections SQL.

## 🚀 Déploiement / Configuration

- Déployé dans le conteneur **backend**.
- La route est importée dans le point d'entrée des routes admin et enregistrée dans l'API globale.

## 📌 Notes complémentaires

None
