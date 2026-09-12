# [Route Admin Supprimer Entreprise]

# [Route DELETE]

## Description de la features :

Cette route permet à un administrateur de supprimer une entreprise de la base de données en utilisant son identifiant unique.

## Technique

### Dependances :

- **express** : Framework web.
- **../../DB** : Connexion PostgreSQL.
- **../../Middleware** : `auth` et `isAdmin`.

### Fichier cles :

- **delete_enterprise.js** : Logique de suppression d'entreprise.
- **DB.js** : Interaction avec la base de données.
- **Middleware.js** : Protection des accès.

### Flux de donnees

1.  **Admin** -> Requête DELETE `/admin/enterprise/:id`.
2.  **Middleware** -> Validation session et rôle.
3.  **Backend** -> Vérification format ID.
4.  **DB** -> `DELETE FROM entreprise WHERE id_entreprise = $1`.
5.  **Réponse** -> 200 OK ou codes d'erreurs.

### 🧠 Logique de fonctionnement

- Extraction de l'ID depuis les paramètres.
- Vérification que l'ID est un entier (renvoi 400 sinon).
- Suppression dans la table `entreprise`.
- Si aucune ligne n'est impactée, renvoi d'une erreur 404 ("The enterprise does not exist").
- En cas d'erreur serveur, renvoi d'un statut 500.

### 🧪 Tests

- **CI GitHub** : Tests automatisés. (pas encore)

### 🔐 Sécurité

- Accès restreint aux administrateurs via `auth` et `isAdmin`.
- Validation stricte du type de paramètre (ID).
- Protection contre les injections SQL via le passage de paramètres au driver DB.

## 🚀 Déploiement / Configuration

- Fait partie du service **backend**.

## 📌 Notes complémentaires

None
