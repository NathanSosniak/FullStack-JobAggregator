# [Route Upload Fichier Test]

# [Route PUT]

## Description de la features :

Cette route permet à un candidat de téléverser un fichier de réponse (code, zip, doc) pour un test technique lié à une offre d'emploi.

## Technique

### Dependances :

- **../../MINIO** : Stockage d'objets.
- **../../config_multer** : Gestionnaire d'upload local temporaire.
- **../../DB** : Base de données PostgreSQL.
- **../../Middleware** : Authentification (`auth`).

### Fichier cles :

- **Upload_fichier.js** : Logique de transfert MinIO et mise à jour DB.
- **config_multer.js** : Configuration des types de fichiers et limites.

### Flux de donnees

1.  **Candidat** : Envoie un fichier via un formulaire (clé `doc`) et un `offre_id`.
2.  **Backend (Multer)** : Réceptionne le fichier temporairement sur le disque.
3.  **Backend (Logiciel)** :
    - Définit un chemin structuré : `offre_{id}/user_{id}/{nom_fichier}`.
    - Téléverse le fichier vers le bucket MinIO "candidatures".
    - Supprime le fichier temporaire local via `fs.unlinkSync`.
4.  **Base de données** :
    - Utilise `INSERT ... ON CONFLICT` sur la table `candidature`.
    - Ajoute le chemin du nouveau fichier au tableau `fichier_candidats` existant via `array_append`.

### 🧠 Logique de fonctionnement

- **Structure MinIO** : Les fichiers sont organisés par offre et par utilisateur pour éviter les collisions et faciliter la récupération par la sandbox Docker.
- **Mise à jour Atomique** : L'utilisation de `array_append` dans une requête `UPDATE` permet de conserver l'historique des fichiers envoyés si le candidat fait plusieurs tentatives.
- **Nettoyage** : Le fichier n'est jamais conservé sur le serveur backend après son transfert réussi vers MinIO.

### 🧪 Tests

- **CI GitHub**. (pas encore)

### 🔐 Sécurité

- **Authentification** : Token obligatoire pour identifier l'utilisateur.
- **Validation** : Vérifie la présence du fichier et de l'ID de l'offre.
- **Isolation** : L'utilisateur ne peut uploader que dans son propre dossier (`req.token.id`).

## 🚀 Déploiement / Configuration

- Conteneur **backend**.

## 📌 Notes complémentaires

None
