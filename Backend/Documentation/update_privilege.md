# [Route Admin Mise à jour Privilège]

# [Route PUT]

## Description de la features :

Cette route permet à un administrateur de modifier le rôle d'un utilisateur dans la base de données. Elle permet de basculer un compte entre les rôles "admin", "user" et "enterprise".

## Technique

### Dependances :

- **express** : Framework web pour Node.js.
- **../../DB** : Module de connexion à la base de données PostgreSQL.
- **../../Middleware** : Fonctions `auth` (authentification) et `isAdmin` (vérification des droits administrateur).

### Fichier cles :

- **update_privilege.js** : Contient la logique de mise à jour du rôle utilisateur.
- **DB.js** : Gère l'exécution de la requête SQL `UPDATE`.
- **Middleware.js** : Garantit que seuls les administrateurs peuvent modifier les privilèges.

### Flux de donnees

1.  **Administrateur** : Envoie une requête PUT à `/admin/privilege/:id/:role`.
2.  **Middleware** : Valide la session et les droits administrateur.
3.  **Backend** : Vérifie la validité de l'ID utilisateur et la conformité du nouveau rôle.
4.  **Base de données** : Exécute `UPDATE utilisateur SET role = $1 WHERE id_utilisateur = $2`.
5.  **Réponse** : Confirmation de mise à jour (200) ou erreur (400, 404, 500).

### 🧠 Logique de fonctionnement

- La route extrait l'ID de l'utilisateur (`id`) et le nouveau rôle (`role`) depuis les paramètres de l'URL.
- **Validation de l'ID** : Vérifie que l'identifiant est bien un nombre entier.
- **Validation du Rôle** : Vérifie que le rôle fourni fait partie de la liste autorisée : `"admin"`, `"user"`, ou `"enterprise"`. Si le rôle est invalide, une erreur 400 est retournée.
- **Exécution SQL** : Met à jour la colonne `role` dans la table `utilisateur`.
- **Vérification d'existence** : Si aucune ligne n'est modifiée, la route renvoie une erreur 404 car l'utilisateur n'existe pas.

### 🧪 Tests

- **CI GitHub** : Tests d'intégration continue. (pas encore)

### 🔐 Sécurité

- **Contrôle d'accès** : Accès strictement réservé aux administrateurs via les middlewares `auth` et `isAdmin`.
- **Validation stricte des types** : L'ID et le rôle sont validés avant toute interaction avec la base de données.
- **Requêtes paramétrées** : Utilisation de placeholders (`$1`, `$2`) pour prévenir les injections SQL.
- **Whitelisting** : Seuls trois rôles spécifiques sont acceptés, empêchant l'attribution de rôles arbitraires ou malveillants.

## 🚀 Déploiement / Configuration

- Déployé dans le conteneur **backend**.

## 📌 Notes complémentaires

None
