# [Route Admin Supprimer Utilisateur]

# [Route DELETE]

## Description de la features :

Cette route permet à un administrateur de supprimer un utilisateur de la base de données via son identifiant unique. Elle inclut une sécurité spécifique pour empêcher un administrateur de supprimer son propre compte par erreur.

## Technique

### Dependances :

- **express** : Framework web pour Node.js.
- **../../DB** : Module de connexion à la base de données PostgreSQL.
- **../../Middleware** : Fonctions `auth` (authentification) et `isAdmin` (vérification des droits administrateur).

### Fichier cles :

- **delete_user.js** : Contient la logique de la route de suppression.
- **DB.js** : Gère les requêtes vers la base de données.
- **Middleware.js** : Assure la protection de la route.

### Flux de donnees

1.  **Administrateur** : Envoie une requête DELETE à `/admin/user/:id`.
2.  **Middleware** : Valide l'identité et les droits admin.
3.  **Backend** : Vérifie la validité de l'ID et s'assure qu'il ne s'agit pas de l'ID de l'admin actuel.
4.  **Base de données** : Exécute `DELETE FROM utilisateur WHERE id_utilisateur = $1`.
5.  **Réponse** : Succès (200) ou Erreur (400, 403, 404, 500).

### 🧠 Logique de fonctionnement

- Récupération de l'ID depuis `req.params.id`.
- Validation : l'ID doit être un entier.
- **Auto-protection** : Comparaison de l'ID à supprimer avec `req.token.id`. Si les deux correspondent, la suppression est refusée avec une erreur 403 ("You can't delete your own account").
- Exécution de la suppression dans la table `utilisateur`.
- Gestion des cas où l'utilisateur n'existe pas (404).

### 🧪 Tests

- **CI GitHub** : Intégration continue.

### 🔐 Sécurité

- **Double protection Middleware** : `auth` et `isAdmin`.
- **Prévention du "suicide" de compte** : Un admin ne peut pas se supprimer lui-même via cette route.
- **Sanitisation** : Validation du type de l'ID.
- **Sécurité SQL** : Utilisation de requêtes préparées/paramétrées.

## 🚀 Déploiement / Configuration

- Déployé dans le conteneur **backend**. (pas encore)

## 📌 Notes complémentaires

None
