# Route PUT user/profil

## Description de la features :

La route PUT user/profil permet à l'utilisateur de modifier ses informations dans la table "profil_utilisateur"

## Technique

### Dependances :

- **fs** pour supprimer l'image stockée temporairement une fois qu'elle est envoyée vers minio

### Fichier cles :

- **DB.js** pour importer les paramètres de connexion à la base de données
- **MINIO.js** pour importer les paramètres de connexion au stockage minio
- **config_multer** pour définir la façon dont sont traités les fichiers uploadés
- **user_image.js** pour récupérer les images depuis leur URL
- **Middleware.js** pour protéger la route avec le token de l'utilisateur

### Flux de donnees

- images importées/supprimées (bannière, photo de profil, documents), interaction entre le serveur, la DB et Minio
- biographie
- liens vers les plateformes sociales
- profession/activité actuelle
- années d'expérience
- langues

### 🧠 Logique de fonctionnement

Pour modifier les informations purement textuelles :

```json
{
  "bio": "Je suis Nathan !",
  "social": { "git": "https://mongithub/", "yt": "https://monyoutube" },
  "job": "étudiant",
  "xp": "1",
  "language": ["français", "anglais"]
}
```

/!\ L'ensemble des clés n'est pas obligé d'être envoyé à chaque requête. Seul le champ destiné à être modifié doit l'être.  
Si un champ n'est pas fourni, alors la valeur actuelle dans la DB est conservée.

Pour modifier la bannière et photo de profil :
L'envoi de fichier se fait via le **form-data**. Il faut impérativement respecter la clé attendue par le backend pour stocker les fichiers au bon endroit :

- **avatar** pour la photo de profil
- **banner** pour la bannière

Une fois uploadée, l'image est stockée temporairement en local grâce à multer et possède des propriétés telles que son titre ou le chemin où elle est stockée. Le middleware "config_multer.js" permet également de rendre les images exploitables dans la requête. Une fois envoyée vers minio, l'url d'accès à cette image est créée et elle est supprimée du stockage temporaire.

Pour ajouter un document :
Même principe que la bannière et la photo de profil, il faut passer par le **form-data**. la clé attendue par le backend est nommée **"doc"**.  
Petite subtilité, il est possible d'ajouter un titre à ce document en passant ceci dans le body :

```json
{
  "docTitle": "Mon super titre !"
}
```

Contrairement à la bannière et à la photo de profil, le nom du fichier d'un document possède un id unique ce qui permet à chaque upload de ne pas écraser le précédent et d'en stocker plusieurs. De plus, avant d'ajouter un document, je reprends ceux déjà présent dans la DB.

Tous les documents d'un utilisateur sont stockés dans une liste et suivent le schéma suivant :

```json
{
  "URL": "lien de l'image",
  "title": "titre du document",
  "fileName": "nom du fichier de l'image dans minio"
}
```

Pour supprimer un document :
Il faut envoyer un body respectant le schéma ci-dessous:

```json
{
  "docToDelete": "nom du fichier de l'image dans minio (et donc le fileName dans le json du document)"
}
```

Le document sera supprimé de la liste des documents de l'utilisateur dans la DB et du stockage minio.

/!\ Dans une même requête, l'algorithme rend possible la suppression et l'ajout de document, pas forcément la peine de faire deux requêtes.

### 🔐 Sécurité

- un seul fichier à la fois peut-être uploadé par catégorie
- fichier uploadé de 10Mo maximum
- fichier png, jpeg et jpg uniquement pour l'upload de fichier
- route protégée, les informations de l'utilisateur sont modifiables uniquement si un token valide est présent
- try/catch pour la gestion d'erreur

## 🚀 Déploiement / Configuration

- import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js"
- l'API est déployée dans le conteneur "backend" de docker
