# [Route Expériences Utilisateur]

# [Route API (CRUD)]

## Description de la features :

Ce module permet à un utilisateur authentifié de gérer ses expériences professionnelles. Il supporte la création (POST), la modification (PUT) et la suppression (DELETE) d'expériences.

## Technique

### Dependances :

- **express** : Framework web.
- **../DB** : Connexion PostgreSQL.
- **../Middleware** : Fonction `auth` pour identifier l'utilisateur via son token.

### Fichier cles :

- **put_userExperience.js** : Contient toute la logique CRUD des expériences.
- **Middleware.js** : Sécurise les accès.

### Flux de donnees

- **POST/PUT** : Client -> Body JSON (nom entreprise, titre, dates, etc.) -> Backend -> DB.
- **DELETE** : Client -> ID Expérience -> Backend -> DB.

### 🧠 Logique de fonctionnement

- **Normalisation de texte** : Une fonction `normalizeText` est utilisée pour nettoyer les noms d'entreprises (suppression des accents, parenthèses, espaces, minuscules).
- **Liaison automatique** : Lors de l'ajout ou de la modification, le backend compare le nom de l'entreprise saisi avec la table `entreprise`. S'il y a correspondance, l'ID de l'entreprise est automatiquement lié à l'expérience.
- **Mise à jour partielle (PUT)** : Si certains champs sont manquants dans la requête, le backend récupère les valeurs actuelles en base de données pour ne pas les écraser par du vide (fusion des données).
- **Sécurité par propriétaire** : Toutes les opérations SQL filtrent par `id_utilisateur = req.token.id`, garantissant qu'un utilisateur ne peut modifier que ses propres expériences.

### 🧪 Tests

- **CI GitHub**. (pas encore)

### 🔐 Sécurité

- **Authentification obligatoire** : Toutes les routes nécessitent un token JWT valide.
- **Isolation des données** : Impossible de modifier ou supprimer l'expérience d'un autre utilisateur grâce au filtrage par l'ID du token.
- **Sanitisation** : Les entrées sont traitées et les requêtes SQL sont paramétrées.

## 🚀 Déploiement / Configuration

- Conteneur **backend**.

## 📌 Notes complémentaires

None
