# [Route Détails Entreprise]

# [Route GET]

## Description de la features :

Cette route permet de récupérer l'intégralité des informations d'une entreprise spécifique via son identifiant, ainsi que la liste exhaustive de toutes les offres d'emploi (postes) qu'elle a publiées.

## Technique

### Dependances :

- **express** : Framework web.
- **../DB** : Module de connexion à la base de données PostgreSQL.

### Fichier cles :

- **enterpriseID.js** : Gère la récupération des données de l'entreprise et de ses postes.
- **DB.js** : Exécute les requêtes SQL.

### Flux de donnees

1.  **Client** : Envoie une requête GET à `/enterprise/:id`.
2.  **Backend** : Exécute deux requêtes SQL en parallèle (une pour l'entreprise, une pour ses postes).
3.  **Base de données** : Retourne les informations de profil de l'entreprise et la liste des postes associés.
4.  **Backend** : Fusionne les résultats (les postes sont ajoutés dans une clé `offre`).
5.  **Réponse** : Retourne un objet JSON complet de l'entreprise.

### 🧠 Logique de fonctionnement

- **Récupération de l'entreprise** : Extrait les statistiques (visites, clics, score, rang) et les informations de base.
- **Formatage du Logo** : Si le logo est un chemin local (ne commence pas par `https`), il est préfixé par l'URL du serveur de logos local.
- **Récupération des Postes** : Jointure entre la table `poste` et `entreprise` pour récupérer les offres liées à l'ID fourni.
- **Calcul du délai de publication** : Transforme la date de publication en une chaîne lisible (ex: "02 jours 15h30" ou "05h12").
- **Fusion des données** : Les offres sont injectées dans l'objet entreprise sous la propriété `offre`.

### 🧪 Tests

- **CI GitHub**. (pas encore)

### 🔐 Sécurité

- **Gestion du 404** : Si l'ID ne correspond à aucune entreprise, une erreur 404 est renvoyée.
- **Requêtes paramétrées** : Utilisation de `$1` pour prévenir les injections SQL.

## 🚀 Déploiement / Configuration

- Conteneur **backend**.

## 📌 Notes complémentaires

Cette route est essentielle pour la page de profil public d'une entreprise.
