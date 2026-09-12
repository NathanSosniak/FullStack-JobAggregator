# Route Register

## Description de la features :

La route register permet d'ajouter un nouvel utilisateur dans la base de données de postgres.

## Technique

### Dependances :

- **brypt** pour hasher le mot de passe

### Fichier cles :

- **DB.js** pour importer les paramètres de connexion à la base de données

### Flux de donnees

- nom
- prénom
- mot de passe hashé
- adresse mail

### 🧠 Logique de fonctionnement

- un body est envoyé par l'utilisateur :
  {
  "name": ...,
  "firstname": ...,
  "email": ...,
  "password": ...
  }

- une requête check si l'email est déjà enregistrée et si oui l'utilisateur ne peut pas être ajouté
- sinon les infos de l'utilisateur sont ajoutées et son mot de passe et hashé

### 🔐 Sécurité

- **Protection Anti-Spam (Rate Limiting Strict) :** Implémentation du middleware `express-rate-limit` configuré de manière très stricte (maximum 3 créations de compte par heure et par adresse IP) pour bloquer les créations de comptes en masse par des bots et protéger les ressources de la base de données.
- **Hachage sécurisé :** Utilisation de `bcrypt` (avec un coût de 10) pour hacher et saler le mot de passe avant insertion, garantissant qu'aucun mot de passe n'est stocké en clair.
- **Prévention des Injections SQL :** Utilisation exclusive de requêtes paramétrées (`$1, $2`, etc.) lors des interactions avec PostgreSQL pour neutraliser toute tentative d'injection SQL malveillante depuis les champs du formulaire.


## 🚀 Déploiement / Configuration

- import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js"
- l'API est déployée dans le conteneur "backend" de docker