# Route PUT user/global

## Description de la features :

La route PUT user/global permet de modifier les informations de l'utilisateur dans la table "utilisateur" de la DB.

## Technique

### Dependances :

- **make-fetch-happen** pour faire des requêtes vers une API externe
- **fs** pour utiliser mon fichier json

### Fichier cles :

- **DB.js** pour effectuer des requêtes SQL au sein de notre base de données
- **Middleware.js** pour protéger la route avec le token de l'utilisateur

### Flux de donnees

Informations permettant de remplir les colonnes de la table "utilisateur":

- nom
- prénom
- email
- téléphone
- âge
- pays
- ville

Requête à l'API de nominatim pour convertir le lieu d'habitation d'un utilisateur en coordonnées géographiques.

### 🧠 Logique de fonctionnement

Ci dessous se trouve le template du body à envoyer pour modifier les informations :

````json
Pour modifier les informations purement textuelles :

```json
{
  "name": "Sosniak",
  "firstname": "Nathan",
  "email": "nathan.sosniak@epitech.eu",
  "tel": "01 01 01 01 01",
  "age": "19",
  "country": "France",
  "location": "Lille"
}
````

L'ensemble des clés ne doit pas obligatoirement être envoyé pour modifier une seule information. En effet, si une valeur est manquante, alors celle stockée dans la DB actuellement est reprise.

Si une "location" est fournie, alors la requête à l'API de nominatim va la convertir en latitude et longitude afin de les ajouter dans la DB. Une sécurité est prévue pour gérer les requêtes qui échouent.

Un cache est mis en place pour éviter de faire une requête si la location a déjà été recherchée.

### 🔐 Sécurité

- route protégée grâce au token et au middleware
- gestion des erreurs pour la requête externe
- reprise des valeurs actuelles si un champ est manquant
- encapsulation try/catch pour la gestion d'erreurs

## 🚀 Déploiement / Configuration

- import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js"
- l'API est déployée dans le conteneur "backend" de docker
