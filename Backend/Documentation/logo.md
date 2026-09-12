# Route logo

## Description de la features :

La route logo permet de faire une requête à l'API logo.dev.

Son but est d'utiliser **uniquement les noms de domaines** enregistrés dans la colonne "logo" de la table "entreprise". A partir de ce nom de domaine est construite une **URL** dans laquelle on retrouve également **une clé (token)** permettant d'effectuer une requête vers l'API de logo.dev et d'en tirer un logo.

L'enjeu de cette route est là, elle permet d'utiliser le nom de domaine renvoyé par la route "/grouped_posts" dans la clé "logo" **sans jamais dévoiler le token**. Sans elle, nous étions obligés de renvoyer l'url construite avec le token en clair dans le résultat de la route "/grouped_posts".

Elle joue alors un rôle de **sécurité** en permettant de faire une requête vers l'api de logo.dev **sans jamais dévoiler le token**.

## Technique

### Dependances :

- **make-fetch-happen** pour faire des requêtes vers une API externe
- **fs** pour parcourir et utiliser le cache

### Flux de donnees

- requête vers l'API de logo.dev afin de fournir un logo
- interaction avec le cache pour les images déjà enregistrées

### 🧠 Logique de fonctionnement

- je fournis un nom de domaine valide correspondant à une entreprise de notre base de données
- quoiqu'il arrive, une image sera donnée par logo.dev (la vérification est faite au préalable grâce au fichier [add_logo.py](../../Data/add_logo.py))
- je vérifie si ce nom_de_domaine.png est déjà enregistré dans [cache](../Cache/Images/)
- si c'est le cas, j'envoie l'image
- sinon, je fais une requête à l'api de logo.dev pour sauvegarder et renvoyer l'image

### 🔐 Sécurité

- on vérifie si la réponse de la requête renvoie un statut 200
- permet de ne pas révéler le token
- try/catch pour la gestion d'erreur

## 🚀 Déploiement / Configuration

- import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js"
- l'API est déployée dans le conteneur "backend" de docker
