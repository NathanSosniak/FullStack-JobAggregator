# Route GET user/img

## Description de la features :

La route GET user/img permet d'aller chercher et de distribuer les documents et images de l'utilisateur stockés dans le bucket "documents" de Minio. Elle fonctionne en étroite relation avec la route de mise à jour de profil (`PUT /user/profil`) et la configuration du téléversement (`config_multer.js`).

## Technique

### Fichiers clés :

- **MINIO.js :** paramètres de connexion au stockage de Minio (méthode `getObject`).
- **config_multer.js :** gère le filtrage, la taille maximale (10 Mo) et la génération du nom final des fichiers en transit.
- **index.js / API.js :** fichiers d'enregistrement et d'orchestration des routes de l'application.

### Flux de donnees

- **Entrée :** Paramètres de requête dans l'URL (`:id`, `:type`, `:name`).
- **Sortie :** Flux binaire du fichier (`Stream`) envoyé directement dans la réponse HTTP (via `.pipe(res)`).

### 🧠 Logique de fonctionnement

La route admet 3 paramètres obligatoires au sein de son URL (`/user/img/:id/:type/:name`) :

- **id** -> Identifiant de l'utilisateur (`req.token.id` généré à l'upload) pour lequel on veut récupérer les fichiers.
- **type** -> Type de document à récupérer. Admet trois valeurs strictes définies lors du traitement de profil :
  - `"avatar"` : Photo de profil de l'utilisateur.
  - `"banner"` : Image de bannière de l'utilisateur.
  - `"doc"` : Documents annexes (ex: CV, justificatifs).
- **name** -> Nom exact du document présent sur le support de stockage.

#### Résolution des chemins sur MinIO :

1. **Si le type est un document (`type === "doc"`) :**
   La route pointe vers le sous-dossier `docs` de l'utilisateur. Elle va chercher l'objet en parcourant le chemin : `user_id/docs/nom_du_document`.

   _Note de structure :_ Pour ce type de fichier, le nom (`name`) est généré dynamiquement lors du téléversement via Multer sous la forme suivante : `${req.token.id}-doc-${uuidv4()}${ext}`. Cette encapsulation par un ID unique (UUID v4) garantit l'historisation en base de données et évite l'écrasement des anciens documents sur le serveur MinIO.

2. **Si le contenu est une image (`avatar` ou `banner`) :**
   La route va chercher l'objet à la racine du dossier de l'utilisateur sur MinIO en parcourant le chemin : `user_id/nom_de_l_image`.

   _Note de structure :_ Contrairement aux documents, les images conservent leur nom original (`file.originalname`). Lors d'un nouvel upload via la route de profil, l'ancien fichier ayant le même nom sur MinIO est écrasé, et l'URL d'accès reste inchangée.

#### Distribution :

Le fichier n'est pas chargé intégralement en mémoire RAM sur le backend. Il est récupéré sous forme de flux de données (`stream = minioClient.getObject(...)`), puis redirigé en temps réel vers le client à l'aide de la méthode `stream.pipe(res)`.

### 🔐 Sécurité

- **Validation des formats en amont :** Les fichiers de type `avatar` et `banner` servis par cette route ont subi une validation par expression régulière (`\.(jpg|jpeg|png)$/i`) lors de l'upload pour bloquer tout fichier exécutable ou malveillant.
- **Encapsulation des erreurs :** L'intégralité du traitement de lecture et de streaming est encapsulée dans un bloc `try/catch`. Si le fichier est introuvable sur MinIO ou si la connexion au serveur d'objets échoue, l'erreur est logguée côté serveur (`console.error`) et la route retourne proprement un code `500 Internal server error` pour ne pas exposer l'architecture logicielle.

## 🚀 Déploiement / Configuration

- Import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js".
- L'URL publique d'exposition de cette route est construite dynamiquement lors des phases d'upload sous la forme : `http://localhost:${process.env.PORT_BACK}/user/img/:id/:type/:name`.
- L'API est déployée dans le conteneur "backend" de Docker.
