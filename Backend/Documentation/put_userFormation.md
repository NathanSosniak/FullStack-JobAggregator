# [Route Formations Utilisateur]

# [Route API (CRUD)]

## Description de la features :

Ce module permet à un utilisateur authentifié de gérer son parcours académique (formations). Il permet de créer, modifier et supprimer des entrées de formation dans le profil utilisateur.

## Technique

### Dependances :

- **express**.
- **../DB**.
- **../Middleware** : Fonction `auth`.

### Fichier cles :

- **put_userFormation.js** : Logique de gestion des formations.

### Flux de donnees

- **POST** : Création d'une nouvelle formation.
- **PUT** : Modification d'une formation existante via son ID.
- **DELETE** : Suppression d'une formation via son ID.

### 🧠 Logique de fonctionnement

- **Liaison avec les établissements** : Similaire aux expériences, le système tente de lier le nom de l'établissement à une entreprise existante dans la base de données via la fonction `normalizeText`.
- **Gestion du PUT** : Le système vérifie quels champs sont fournis dans le `req.body`. Pour les champs manquants, il effectue une requête préalable pour récupérer les anciennes valeurs et maintenir l'intégrité des données.
- **Champs gérés** : Nom de l'établissement, titre de la formation, dates (début/fin), description, compétences acquises et diplôme obtenu.

### 🧪 Tests

- **CI GitHub**. (pas encore)

### 🔐 Sécurité

- **Protection par Token** : Route accessible uniquement aux utilisateurs connectés.
- **Propriété des données** : L'ID de l'utilisateur est extrait du token et utilisé systématiquement dans les clauses `WHERE` pour empêcher toute manipulation de données tierces.
- **Requêtes paramétrées** : Protection contre les injections SQL.

## 🚀 Déploiement / Configuration

- Conteneur **backend**.

## 📌 Notes complémentaires

None
