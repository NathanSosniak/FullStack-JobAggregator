# [Route Admin Recherche Poste]

# [Route GET]

## Description de la features :

Cette route permet à un administrateur de rechercher des offres d'emploi (postes) par leur titre. Elle facilite la gestion des annonces en permettant de trouver rapidement un poste spécifique.

## Technique

### Dependances :

- **express** : Framework web.
- **../../DB** : Connexion à la base de données.
- **../../Middleware** : `auth` et `isAdmin`.

### Fichier cles :

- **rechercher_poste.js** : Logique de filtrage des postes.
- **DB.js** : Interaction avec la table `poste`.
- **Middleware.js** : Sécurisation de l'accès.

### Flux de donnees

1.  **Admin** -> GET `/admin/poste/search?info=titre_recherche`.
2.  **Middleware** -> Validation administrateur.
3.  **Backend** -> Préparation de la requête `LIKE`.
4.  **DB** -> Recherche dans la table `poste` sur la colonne `titre`.
5.  **Réponse** -> Liste JSON des postes trouvés (ID et Titre).

### 🧠 Logique de fonctionnement

- Récupération du terme de recherche via `req.query.info`.
- Recherche SQL `LIKE` avec `%` pour permettre des correspondances partielles.
- **Formatage** : Utilisation de `LOWER()` pour ignorer la casse.
- **Tri et Limite** : Résultats triés par titre par ordre croissant, limité aux **20 premiers résultats**.

### 🧪 Tests

- **CI GitHub** : Intégration continue. (pas encore)

### 🔐 Sécurité

- Réservé aux administrateurs.
- Utilisation de paramètres de requête SQL sécurisés pour éviter les injections.

## 🚀 Déploiement / Configuration

- Service **backend**.

## 📌 Notes complémentaires

None
