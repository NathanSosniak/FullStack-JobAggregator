# Route post

## Description de la features :

La route post permet d'afficher l'intégralité des informations d'une annonce à partir d'un id entrant.

## Technique

### Dependances :

- **make-fetch-happen** pour faire des requêtes vers une API externe
- **fs** pour utiliser mon fichier json

### Fichier cles :

- **DB.js** pour effectuer des requêtes SQL au sein de notre base de données

### Flux de donnees

- colonnes de la table "postes"
- colonne "nom_compagnie" de la table "entreprise"
- requête à l'API nominatim pour récupérer la localisation à partir ce coordonnées (latitude, longitude)
- JSON dans lequel sont enregistrés les coordonnées et lieux

### 🧠 Logique de fonctionnement

La route grouped_posts prend 1 paramètre obligatoire :

- **id :** entier  
  Indique l'id du poste dont il faut aller chercher l'ensemble des informations.

**Conversion des coordonnées latitude et longitude en lieu :**  
Si la requête SQL renvoie des coordonnées latitude et longitude non nulles, alors on les transforme en lieu nommé :

- Si les données sont déjà enregistrées dans le fichier "reverseloc.json" alors on les extrait.
- Sinon, on fait une requête à l'API nominatim, on extrait la ville et le pays, on les enregistre dans le json et on les renvoie à l'utilisateur.
- Si jamais la requête est nulle ou échoue, alors on ne renvoit que le contenu de la requête SQL en mentionnant que le lieu n'a pas été trouvé.

Si la requête SQL renvoie des coordonnées latitude et longitude nulles, alors on ne renvoit que la requête SQL à l'utilisateur sans jamais faire mention d'un lieu nommé.

### Informations renvoyées

- id du poste
- nom de l'entreprise
- type de contrat
- description
- langue
- nombre de jour en télétravail par semaine
- fréquence du télétravail
- années d'expérience requises
- devise de la monnaie du salaire
- salaire annuel moyen
  - réalisation de la moyenne entre le salaire minimum et maximum
- récurrence
- durée écoulée depuis la publication
  - si la durée est inférieure à un jour, on ne renvoit que les heures et minutes
  - si la durée est inférieure à deux jours, on renvoit "jour" sans "s"
  - sinon on renvoit les jours, heures et minutes avec un "s" à "jours"
- catégorie
- nom en français
- nom en anglais
- latitude
- longitude
- skills
- titre de la profession
- le lieu

**Exemples :**  
Cas où des coordonnées sont fournies :

```json
{
  "id_poste": 1,
  "nom_compagnie": "Sensefuel",
  "type_contrat": "{\"permanent\": true}",
  "description": "Sensefuel\nFondée en 2017 par Christophe et Stéphane, Sensefuel développe une plateforme SaaS de recherche e-commerce et de découverte produits fondée sur une puissante technologie de Deep Learning.\nAvec plus de 100 clients en France et en Europe, Sensefuel offre ses services à de multiples acteurs de l’e-commerce. La solution permet à nos clients d’optimiser leur performance en améliorant les taux",
  "langues": "fr",
  "remote_policy": 3,
  "frequency_remote": "hybrid",
  "annee_experience": 3,
  "salaire_currency": "€",
  "salaire_moyen_annuel": "52 000",
  "recurrence": "year",
  "since_posted": "01 jour 15h50",
  "categorie": "backend",
  "display_name_en": "Back-end developer",
  "display_name_fr": "Back-end developer",
  "latitude": 49.416672,
  "longitude": 2.83333,
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
  "titre": "Senior Back-End Developer",
  "place": ["Compiègne", "France"]
}
```

Cas où des coordonnées sont fournies mais aucun résultat n'est trouvé :

```json
{
  "id_poste": 2,
  "nom_compagnie": "Synapse Informatique",
  "type_contrat": "{\"permanent\": true}",
  "description": "Pour renforcer nos équipes, nous recherchons un(e) ingénieur .net / SQL pour notre site de Marseille.\nAu sein d’une petite équipe agile, animée par un chef de projet et en relation avec le PO, vous avez comme principales missions :\n•\tassurer le lead technique de l’équipe,\n•\tanalyser le besoin métier communiqué par le client pour définir la meilleure stratégie de réalisation,\n•\técrire le code corre",
  "langues": "fr",
  "remote_policy": 2,
  "frequency_remote": "hybrid",
  "annee_experience": 3,
  "salaire_currency": "€",
  "salaire_moyen_annuel": "50 000",
  "recurrence": "year",
  "since_posted": "22 jours 07h32",
  "categorie": "lead developer",
  "display_name_en": "Lead developer",
  "display_name_fr": "Lead developer",
  "latitude": 100000000000000,
  "longitude": 1e29,
  "skills": [
    {
      "name": ".NET core",
      "value": 100
    },
    {
      "name": "WPF",
      "value": 100
    },
    {
      "name": "Microsoft SQL Server",
      "value": 100
    },
    {
      "name": "Android",
      "value": 50
    },
    {
      "name": "Agile",
      "value": 50
    },
    {
      "name": "C#",
      "value": 50
    },
    {
      "name": "SCRUM",
      "value": 50
    }
  ],
  "titre": "Ingénieur .net / SQL confirmé(e) - Lead - H/F ",
  "place": "Not found"
}
```

Cas où des coordonnées ne sont pas fournies :

```json
[
  {
    "id_poste": 3,
    "nom_compagnie": "UBIK Ingénierie",
    "type_contrat": "{\"permanent\": true}",
    "description": "Concepteur-développeur confirmé, vous disposez d'au moins 2 ans d'expériences en développement en Java.\nNous recherchons des développeurs passionnés qui se démarquent par leur culture technologique, leur esprit d’équipe et leur pragmatisme.\nNous offrons un environnement bienveillant où le partage est une valeur clé tant entre nous qu'envers la communauté open source.\nAu sein d'une équipe, vos miss",
    "langues": "fr",
    "remote_policy": 2,
    "frequency_remote": "hybrid",
    "annee_experience": 2,
    "salaire_currency": null,
    "salaire_moyen_annuel": "41 000",
    "recurrence": "year",
    "since_posted": "23 jours 04h07",
    "categorie": "fullstack",
    "display_name_en": "Fullstack developer",
    "display_name_fr": "Fullstack developer",
    "latitude": null,
    "longitude": null,
    "skills": [
      {
        "name": "Java",
        "value": 100
      },
      {
        "name": "Spring",
        "value": 70
      },
      {
        "name": "Angular",
        "value": 50
      },
      {
        "name": "vueJS",
        "value": 50
      },
      {
        "name": "React",
        "value": 50
      },
      {
        "name": "Javascript",
        "value": 30
      },
      {
        "name": "PostgreSQL",
        "value": 70
      },
      {
        "name": "Docker",
        "value": 70
      },
      {
        "name": "NodeJS",
        "value": 50
      },
      {
        "name": "Git",
        "value": 80
      },
      {
        "name": "Kubernetes",
        "value": 50
      }
    ],
    "titre": "Développeur.se  Full stack Java"
  }
]
```

### 🔐 Sécurité

- vérification du type du paramètre obligatoire, id doit être un entier
- gestion d'erreur au sein de la conversion de coordonnées en lieu nommé
- gestion d'erreur si aucun poste n'est trouvé avec l'id fourni
- try/catch pour la gestion d'erreur

## 🚀 Déploiement / Configuration

- import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js"
- l'API est déployée dans le conteneur "backend" de docker
