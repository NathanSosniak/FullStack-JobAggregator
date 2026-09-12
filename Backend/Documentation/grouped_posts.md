# Route grouped_posts

## Description de la features :

La route grouped_posts permet de récupérer 15 offres d'emploi au maximum selon des filtres et d'afficher les informations nécessaires à leur prévisualisation.

## Technique

### Dependances :

- **make-fetch-happen** pour faire des requêtes vers une API externe
- **fs** pour utiliser mon fichier json

### Fichier cles :

- **DB.js** pour effectuer des requêtes SQL au sein de notre base de données

### Flux de donnees

- colonnes de la table "postes"
- colonne "nom_compagnie" de la table "entreprise"
- requête à l'API nominatim pour récupérer les coordonnées (latitude et longitude) d'un lieu
- JSON dans lequel sont enregistrés les lieux et leurs coordonnées

### 🧠 Logique de fonctionnement

La route grouped_posts prend 2 paramètres obligatoires :

- **reverse :** booléen (true ou false)  
  Indique le sens dans lequel sont parcourue les lignes de la DB. Ce paramètre est utile pour la pagination lorque l'on souhaite parcourir les pages dans l'ordre croissant ou décroissant.

- **start :** entier  
  Indique la ligne à partir de laquelle on commence à parcourir la DB.

La route grouped_posts prend 9 paramètres facultatifs :

- **minsalary :** entier  
  Indique le salaire annuel minimum désiré.

- **maxsalary :** entier
  Indique le salaire annuel maximum désiré.

- **location :** chaine de caractères  
  Indique la ville de référence à partir de laquelle un rayon sera ajouté (le paramètre **distance**). Cela permet de définir un périmètre dans lequel doivent se trouver les annonces

      - L'entrée est une ville en chaine de caractères qui est convertie en coordonnées (latitude et longitude) afin de les comparer avec les coordonnées du postes. Ceci permet de savoir si la distance entre les deux points est inférieure ou égale à la **distance** rentrée en paramètre.
      - Soit la ville et ses coordonnées sont déjà enregistrées dans le fichier "loc.json", soit on récupère les informations via une requête à l'API de nominatim.
      - La ville entrée et sauvegardée est formatée (on enlève les accents et les majuscules) afin de ne pas faire de requête inutile. Cela évite les doublons du type (Compiègne/Compiegne/compiègne/compiegne)

- **distance :** entier  
  Indique le rayon en kilomètre dans lequel doivent se trouver les annonces à partir d'un point de référence (paramètre **location**).

**Remarque :** les paramètres **location** et **distance** fonctionnent de pair. Si un n'est pas défini, alors aucun filtre de localisation n'est pris en compte.

- **contract :** chaine de caractères
  Filtre selon le type de contrat désiré.

- **remote :** chaine de caractères ("no", "hybrid" ou "fullTime")  
  Filtre selon l'importance du télétravail dans une offre.

- **language :** chaine de caractère (fr/en)  
  Filtre selon la langue de l'offre.

- **experience :** entier  
  Filtre selon les années d'expérience requises et sélectionne tous les postes dont ce paramètre est inférieur ou égal à la valeur entrée.

- **age :** entier
  Définit un nombre de jour maximum et sélectionne les offres dont la date de publication n'excède pas cette durée.

### Informations renvoyées

**informations concernant les paramètres de la requête**

- latitude et longitude de la location si définie et valide sinon ces 2 paramètres valent "null"

**informations à propos des postes**

- id du poste
- nom du métier
- nom de l'entreprise
- skills
- description
- salaire annuel moyen
  - réalisation de la moyenne entre le salaire minimum et maximum
- devise du salaire
- durée écoulée depuis la publication
  - si la durée est inférieure à un jour, on ne renvoit que les heures et minutes
  - si la durée est inférieure à deux jours, on renvoit "jour" sans "s"
  - sinon on renvoit les jours, heures et minutes avec un "s" à "jours"
- latitude du poste
- longitude du poste

**Exemple :**

```json
{
  "filters": {
    "entry_lat": null,
    "entry_lon": null
  },
  "posts": [
    {
      "id_poste": 1,
      "display_name_fr": "Back-end developer",
      "nom_compagnie": "Sensefuel",
      "logo": null,
      "skills": [
        {
          "name": "Javascript",
          "value": 50
        },
        {
          "name": "NodeJS",
          "value": 50
        },
        {
          "name": "Docker",
          "value": 50
        }
      ],
      "description": "Sensefuel\nFondée en 2017 par Christophe et Stéphane, Sensefuel développe une plateforme SaaS de recherche e-commerce et de découverte produits fondée sur une puissante technologie de Deep Learning.\nAvec plus de 100 clients en France et en Europe, Sensefuel offre ses services à de multiples acteurs de l’e-commerce. La solution permet à nos clients d’optimiser leur performance en améliorant les taux",
      "salaire_currency": "€",
      "salaire_annuel_moyen": "52K",
      "since_posted": "19 jours 22h30",
      "latitude": 50.6048844,
      "longitude": 3.156265
    }
  ]
}
```

### 🔐 Sécurité

- formatage du paramètre **location**
- filtrage par périmètre uniquement si **location** et **distance** sont rentrés
- gestion des erreurs au sein de la conversion d'un lieu en coordonnées
- vérification du type des deux paramètres obligatoires, reverse doit être un booléen et start un entier
- on vérifie si la requête ne renvoit pas un contenu nul
- try/catch pour la gestion d'erreur

## 🚀 Déploiement / Configuration

- import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js"
- l'API est déployée dans le conteneur "backend" de docker
