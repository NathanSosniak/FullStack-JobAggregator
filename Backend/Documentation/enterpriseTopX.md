# [Service Top Entreprises]

# [Service Frontend / API]

## Description de la features :

Ce service permet de récupérer une liste des meilleures entreprises (Top X) classées par leur rang. Il est utilisé principalement sur le front-end pour afficher des classements ou des entreprises mises en avant.

## Technique

### Dependances :

- **Fetch API** : Utilisé pour effectuer la requête HTTP.
- **Backend API** : Dépend de l'endpoint `/enterpriseTop/:rank`.

### Fichier cles :

- **Top_X_entreprise.ts** : Service TypeScript gérant l'appel API.

### Flux de donnees

1.  **Composant Frontend** : Appelle la fonction `Get_Enterprise_Top(rank)`.
2.  **Service** : Effectue une requête GET vers `http://localhost:5000/enterpriseTop/${rank}`.
3.  **Backend** : Traite la demande et renvoie les entreprises triées par score/rang.
4.  **Frontend** : Reçoit et traite le JSON pour l'affichage.

### 🧠 Logique de fonctionnement

- La fonction prend un paramètre `rank` qui définit le nombre d'entreprises à récupérer (ou le seuil de classement).
- Elle vérifie si la réponse est "OK" (`res.ok`).
- En cas d'erreur (404, 500, etc.), elle extrait le corps de la réponse et lève une exception détaillée.

### 🧪 Tests

- **Tests manuels** : Vérification de l'affichage dans l'interface utilisateur.
- **CI GitHub** : Tests de compilation TypeScript. (pas encore)

### 🔐 Sécurité

- **Gestion d'erreurs** : Capture et remonte les erreurs API pour éviter les plantages silencieux du front-end.
- **CORS** : Nécessite une configuration CORS appropriée sur le backend (port 5000).

## 🚀 Déploiement / Configuration

- Déployé dans le cadre du **frontend** (Next.js/React).
- L'URL de l'API est actuellement configurée en dur sur `localhost:5000`.

## 📌 Notes complémentaires

None
