# Route Logout

## Description de la features :

La route logout permet de supprimer le token de l'utilisateur stocké dans le navigateur.

## Technique

### Fichier cles :

- **Middleware.js** pour importer la fonction **auth()** qui vérifie la validité du token

### Flux de donnees

- token(id et email)

### 🧠 Logique de fonctionnement

- si un token valable est stocké dans le navigateur, alors il est supprimé et l'utilisateur est redirigé vers la page "/"

### 🔐 Sécurité

- vérification de la validité du token grâce à la fonction **auth()**
- try/catch pour la gestion d'erreur

## 🚀 Déploiement / Configuration

- import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js"
- l'API est déployée dans le conteneur "backend" de docker
