# Route User

## Description de la features :

La route user permet de récupérer les informations d'un utilisateur via son token.

## Technique

### Fichier cles :

- **DB.js** pour effectuer des requêtes SQL au sein de notre base de données
- **Middleware.js** pour importer la fonction **auth()** qui vérifie la validité du token

### Flux de donnees

- token (id et email)
- colonnes de la table "utilisateur" sauf le mot de passe
- colonnes de la table "profil_utilisateur"
- colonnes de la table "experience_utilisateur"
- colonnes de la table "formation_utilisateur"

### 🧠 Logique de fonctionnement

- Vérification de la validité du token
- S'il y a un token, on récupère l'id pour extraire toutes les infos de l'utilisateur dans les tables "utilisateur", "profil_utilisateur", "experience_utilisateur" et "formation_utilisateur"
- Quoiqu'il arrive l'utilisateur sera enregistré dans la table "utilisateur" car on utilise son token pour y accéder et le token et généré suite à un login qui crée une ligne pour l'utilisateur dans cette table de la DB.

### Format de réponse

```json
{
  "global": [
    {
      "id_utilisateur": 1,
      "nom": "Sosniak",
      "prenom": "Nathan",
      "pays": "France",
      "localisation": "Lille",
      "latitude_secteur": 50.633333,
      "longitude_secteur": 3.066667,
      "role": null,
      "email": "nathan.sosniak@epitech.eu",
      "telephone": "01 01 01 01 01",
      "age": 19
    }
  ],
  "profil": [
    {
      "id_profil": 1,
      "banniere": "http://localhost:5000/user/img/1/banner",
      "photo_profil": "http://localhost:5000/user/img/1/avatar",
      "biographie": "Je suis étudiant en informatique à Epitech !",
      "plateforme": {
        "yt": "https://www.youtube.com/@Neysseun",
        "git": "https://github.com/NathanSosniak"
      },
      "profession_actuelle": "Etudiant",
      "experiences_annees": 1,
      "document": [
        {
          "URL": "http://localhost:5000/user/img/1/doc/1-doc-9be9cd86-97cc-4fa5-85e5-3ed63003b9eb",
          "title": "logo",
          "fileName": "1-doc-9be9cd86-97cc-4fa5-85e5-3ed63003b9eb"
        },
        {
          "URL": "http://localhost:5000/user/img/1/doc/1-doc-9be9cd86-97cc-4fa5-85e5-3ed63003b9eb",
          "title": "logo",
          "fileName": "1-doc-9be9cd86-97cc-4fa5-85e5-3ed63003b9eb"
        }
      ],
      "langues": ["français", "anglais"],
      "nb_vues_profil": 0,
      "candidatures_envoyees": 0,
      "candidatures_consultees": 0,
      "candidatures_positives": 0,
      "candidatures_refusees": 0
    }
  ],
  "experience": [
    {
      "id_experience": 4,
      "id_entreprise": 2,
      "nom_entreprise": "Synapse Informatique",
      "titre": null,
      "date_debut": "2026-01-04T00:00:00.000Z",
      "date_fin": null,
      "description": null,
      "compétences": null,
      "logo": "https://ui-avatars.com/api/?name=synapseinformatique&background=random"
    },
    {
      "id_experience": 1,
      "id_entreprise": 85,
      "nom_entreprise": "FYUL",
      "titre": "130kg RDL",
      "date_debut": "2025-10-10T00:00:00.000Z",
      "date_fin": null,
      "description": null,
      "compétences": null,
      "logo": "http://localhost:5000/logo/fyul.io"
    },
    {
      "id_experience": 5,
      "id_entreprise": null,
      "nom_entreprise": "LSMinfo",
      "titre": "Stage de 3e",
      "date_debut": "2020-01-01T00:00:00.000Z",
      "date_fin": null,
      "description": null,
      "compétences": null,
      "logo": null
    }
  ],
  "formation": [
    {
      "id_formation": 2,
      "id_entreprise": null,
      "nom_établissement": "collège de marly",
      "titre": null,
      "date_debut": "2025-08-01T00:00:00.000Z",
      "date_fin": "2026-05-12T00:00:00.000Z",
      "description": null,
      "compétences": ["Backend", "IA", "Data"],
      "diplome": null,
      "logo": null
    },
    {
      "id_formation": 3,
      "id_entreprise": 85,
      "nom_établissement": "FYUL",
      "titre": "ok",
      "date_debut": "2010-01-01T00:00:00.000Z",
      "date_fin": null,
      "description": null,
      "compétences": null,
      "diplome": null,
      "logo": "http://localhost:5000/logo/fyul.io"
    }
  ]
}
```

### 🔐 Sécurité

- données accessibles uniquement via le token
- si l'utilisateur ne figure pas dans une table, une liste vide est renvoyée en tant que valeur
- try/catch pour la gestion d'erreur

## 🚀 Déploiement / Configuration

- import de la route dans le fichier "index.js" puis import de "index.js" dans "API.js"
- l'API est déployée dans le conteneur "backend" de docker
