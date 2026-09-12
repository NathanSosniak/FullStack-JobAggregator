# Moteur de Recommandation d'Offres (IA)


## 1. Contexte et Problématique Utilisateur

Dans le cadre de notre plateforme **TechYourJob**, le volume d'offres d'emploi est massif. Résultat : l'utilisateur peut vite se retrouver noyé sous la masse d'annonces, qui peinent à trouver des annonces parfaitement alignées avec leurs compétences réelles. Les filtres de recherche classiques par mots-clés stricts atteignent vite leurs limites face à des profils atypiques ou multi-compétences.

### Notre objectif produit
Permettre à l'utilisateur de prendre de meilleures décisions dès sa connexion en lui proposant directement sur son **Tableau de Bord**, une recommandation des 5 offres d'emploi les plus pertinentes au vu de son profil, sans qu'il n'ait besoin d'effectuer la moindre recherche manuelle.

### Contraintes techniques strictes (Cahier des charges)
* **Contrôle exclusif :** Interdiction de confier l'IA à une API tierce payante ou opaque. Le modèle doit être exécuté localement sous notre contrôle.
* **Empreinte disque :** Le modèle et ses dépendances doivent peser **moins de 500 Mo** sur le disque.
* **Performance :** Le temps de traitement doit être **inférieur à 5 secondes** par offre.
* **Intégration UI :** L'output doit être affiché de manière native sur le Dashboard dès l'authentification.

---

## 2. Solution Technique Implémentée (How)

Pour que ça reste léger et rapide, on a séparé le travail en deux : d'un côté notre Backend API (Node.js/Express) et de l'autre un Service IA dédié (Python/FastAPI) connecté a un modèle de prédiction NearestNeighbors. Les deux communiquent en HTTP à l'intérieur de notre réseau Docker.

```text
[ Navigateur Client ]
         │
         │  Requête HTTPS (Dashboard)
         │  + Token JWT dans le Header
         ▼
[ Backend API - Node.js ] ◄───( SQL )───► [ Base PostgreSQL ]
         │                                   (Profil, Exp, Formations)
         │
         │  POST /recommend
         │  (Payload : Texte concaténé & pondéré)
         ▼
[ Service IA - FastAPI ]
         │
         │  Inférence Locale :
         │  1. Vectorisation (TF-IDF)
         │  2. Similarité (KNN)
         ▼
   [ Top 5 Offres ] ──( Réponse JSON )──► Renvoyé au Client via le Backend
```

### A. Phase 1 : Extraction et Pondération des Données (Backend Node.js)
Dès que l'utilisateur charge son tableau de bord, la route Express `POST /recommend` récupère les données de son profil en base de données à l'aide de trois requêtes SQL parallèles (`Promise.all`) :
1. Les informations globales du profil (`profil_utilisateur`).
2. Les 5 dernières expériences professionnelles (`experience_utilisateur`).
3. Les 3 dernières formations suivies (`formation_utilisateur`).

**Prompt textuel (Text Weighting) :** Afin de donner un poids mathématique plus important aux différents éléments du profil, nous appliquons un coefficient de duplication sur les chaînes de caractères avant d'envoyer le bloc textuel brut à l'IA :
* La **profession actuelle** est répétée **8 fois**.
* Les **compétences techniques** (issues des expériences et formations) sont répétées **5 fois** .
* Les **titres des postes passés** sont répétés **3 fois**.
* Les descriptions textuelles amènent du contexte.

### B. Phase 2 : Vectorisation et Similarité Mathématique (Service IA FastAPI)
Le texte structuré est envoyé au conteneur IA. Nous utilisons une approche combinant la vectorisation **TF-IDF** (*Term Frequency-Inverse Document Frequency*) et l'algorithme des **K-Plus Proches Voisins (KNN)** :

1. **Transformation vectorielle :** Le composant `vectorizer.joblib` convertit le texte de l'utilisateur en un vecteur numérique reflétant l'importance de chaque terme technique par rapport au dictionnaire global.

2. **Calcul de distance :** Le modèle KNN (`model_ia.joblib`) calcule instantanément les distances entre le vecteur de l'utilisateur et les vecteurs des offres d'emploi pré-calculés et stockés dans notre dataframe `postes_data.pkl`. Il extrait les 5 vecteurs les plus proches (les plus similaires).

3. **Sécurisation des types (Données financières) :** Afin de prévenir les plantages de formatage JSON dus aux valeurs manquantes dans les salaires, nous passons les rémunérations à travers une fonction `safe_float`. Elle intercepte les valeurs `NaN` (Not a Number) issues de l'environnement Python/Pandas pour les convertir proprement en `null` JavaScript.

---

## 3. Sécurité, Résilience et Gestion des Pannes

* **Contrôle d'accès (RBAC) :** La route `/recommend` est protégée par notre middleware d'authentification `auth`. Le backend Express n'accepte aucun identifiant utilisateur fourni par le corps de la requête client ; il extrait de manière sécurisé le `userId` depuis le jeton d'authentification (`req.token.id`) décodé côté serveur.

* **Validation en amont :** Si les tables SQL renvoient un profil totalement vierge ou insuffisant (longueur du texte construit < 3 caractères), le backend Node.js bloque immédiatement le flux et retourne une erreur `400 Bad Request`. Cela évite d'exécuter des calculs inutiles sur l'IA pour des profils vides.

* **Circuit Breaking et Fallback :** Le service IA fonctionnant de manière isolée dans son conteneur Docker, son appel réseau (`fetch`) est encapsulé dans un bloc `try/catch` sur le backend Node.js. Si le conteneur IA subit une panne ou un redémarrage, l'erreur est interceptée et l'API renvoie un code HTTP `503 Service Temporarily Unavailable` au frontend. L'application globale ne crashe pas.

* **Centralisation des erreurs IA :** Si le traitement vectoriel échoue en Python, FastAPI lève une exception `HTTPException (500)`. Celle-ci est interceptée par le Backend et transmise au client sous la forme d'un code HTTP `502 Bad Gateway` ("Erreur interne du moteur IA") avec des logs explicites côté serveur.

---
couple
## 4. Compromis et Alternatives Rejetées (Trade-offs)

### Alternative Rejetée : Utilisation d'un LLM local (ex: Llama-3-8B ou Mistral-7B via Ollama)
Nous avons envisagé d'intégrer un grand modèle de langage (LLM) quantifié en local pour effectuer une analyse sémantique avancée et générer des résumés de profils personnalisés.
* **Pourquoi nous l'avons rejeté :** Un LLM, même compressé, requiert un espace de stockage minimal de 4 Go à 5 Go, ce qui dépasse la limite des **500 Mo** imposée par le sujet. De plus, le temps de réponse d'un LLM par requête s'élève à plusieurs dizaines de secondes, dépassant la limite **5 secondes** et dégrade l'expérience utilisateur sur le Dashboard.

### Compromis Retenu : Le couple TF-IDF / KNN
* **Avantages :** * Les fichiers (`model_ia.joblib`, `vectorizer.joblib` et `postes_data.pkl`) ne pèsent que quelques mégaoctets

  * Le code s'exécute en **quelques millisecondes**, garantissant un affichage instantané et fluide du Dashboard pour l'utilisateur.

  * Le système est 100 % autonome, gratuit et sans aucune dépendance à internet

* **Inconvénients et limites :** Le modèle TF-IDF est basé sur une approche purement lexicale. Il ne comprend pas nativement les synonymes stricts (ex: un profil indiquant "Développeur Front-End" et une offre affichant uniquement "Ingénieur Interface" sans autre mot commun). 

* **Atténuation du risque :** Nous compensons cette limite de manière logicielle en amont en sur-pondérant massivement les mots-clés des compétences techniques concrètes (`competences.repeat(5)`), qui restent identiques et universels d'une offre à l'autre dans le domaine de la tech (ex: "React", "Docker", "Node.js").