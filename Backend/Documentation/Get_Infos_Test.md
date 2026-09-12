# [Route Informations Test Technique]

# [Route GET]

## Description de la features :

Cette route permet de récupérer les consignes et les modalités d'un test technique associé à un poste spécifique.

## Technique

### Dependances :

- **express**.
- **../../DB**.

### Fichier cles :

- **Get_Infos_Test.js** : Logique de récupération des consignes de test.

### Flux de donnees

1.  **Client** : Requête GET `/test_post/:id`.
2.  **Backend** : Interroge la table `candidature`.
3.  **Base de données** : Extrait les consignes, la date de rendu, les fichiers attendus et les objectifs.
4.  **Sortie** : Objet JSON contenant les détails du test.

### 🧠 Logique de fonctionnement

- La route interroge la table `candidature` pour récupérer les métadonnées du test technique défini pour un poste.
- Elle retourne spécifiquement :
  - `consigne` : Texte descriptif de l'exercice.
  - `date_rendue` : Date limite.
  - `fichier_attendues` : Liste ou description des fichiers requis.
  - `attendues` : Critères d'évaluation ou attentes.

### 🧪 Tests

- **CI GitHub**. (pas encore)

### 🔐 Sécurité

- Validation de l'ID en entrée.
- Gestion d'erreur 404 si aucun test n'est configuré pour l'ID de poste fourni.

## 🚀 Déploiement / Configuration

- Conteneur **backend**.

## 📌 Notes complémentaires

None
