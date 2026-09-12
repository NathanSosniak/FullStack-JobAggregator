# Réflexion autour du choix du modèle

## Objectif du modèle

L’objectif principal de ce modèle est de proposer des recommandations d’offres d’emploi pertinentes et personnalisées en fonction du profil de l’utilisateur.  
L’idée était de mettre en place une solution capable d’analyser automatiquement les compétences, les expériences passées et les intitulés de postes afin de rapprocher efficacement un utilisateur des offres les plus adaptées.

Ce système permet également :

- d’améliorer l’expérience utilisateur,
- de faciliter la recherche d’emploi,
- et de proposer des recommandations rapides sans intervention manuelle.

---

## Pourquoi ce choix technique ?

Le choix de `TfidfVectorizer` et de `NearestNeighbors` a été fait pour plusieurs raisons :

### Simplicité et efficacité

Ces outils permettent de mettre en place rapidement un système de recommandation performant sans nécessiter un très grand volume de données ou une infrastructure complexe.

### Traitement du texte

Les offres d’emploi et les profils utilisateurs contiennent principalement des données textuelles :

- intitulés de postes,
- compétences,
- descriptions,
- expériences.

`TfidfVectorizer` permet de transformer ces informations textuelles en vecteurs numériques exploitables par un modèle de machine learning.

### Recherche de similarité

Le modèle `NearestNeighbors` est particulièrement adapté à un système de recommandation basé sur la similarité.  
Il permet de comparer les profils utilisateurs aux offres d’emploi afin d’identifier les postes les plus proches en fonction des compétences et des expériences.

### Performance et légèreté

Cette approche reste légère en ressources et rapide à exécuter, ce qui facilite son intégration dans une application web et son futur déploiement via Docker.

---

## Pondération des données

Une réflexion a également été menée sur l’importance des différentes informations utilisées par le modèle.

Toutes les données n’ayant pas la même valeur dans une recherche d’emploi, un système de pondération a été ajouté afin de donner plus d’importance :

- au titre du poste,
- aux compétences techniques (_skills_),

Cette approche permet d’obtenir des recommandations plus cohérentes et plus précises.

---

## Gestion du bruit et amélioration de la précision

Afin d’améliorer les performances du modèle, une liste de _stop words_ français a été utilisée.

Cela permet de supprimer les mots peu utiles ou trop fréquents dans les descriptions, comme :

- “le”,
- “de”,
- “avec”,
- “et”.

Cette étape réduit le bruit dans les données et améliore la qualité des vecteurs générés par `TfidfVectorizer`.

---

## 🧪 Tests effectués

Des profils fictifs ont été ajoutés manuellement dans la base de données afin de tester la pertinence des recommandations générées par le modèle.

Ces profils contenaient :

- différents métiers dans la tech,
- plusieurs anciens métiers,
- des compétences (_skills_) variées,
- ainsi que différents niveaux d’expérience.

L’objectif était de simuler plusieurs types de parcours professionnels afin de vérifier que les recommandations proposées correspondaient correctement aux profils utilisateurs.

Ces tests ont permis de valider le bon fonctionnement du système de recommandation et d’ajuster certains paramètres du modèle afin d’améliorer la précision des résultats.

### Ajustements réalisés

Plusieurs ajustements ont été effectués pendant les tests :

- amélioration des pondérations,
- ajout des _stop words_,
- nettoyage des données,

Ces modifications ont permis d’améliorer progressivement la qualité des recommandations.

---

## Limites actuelles

Le modèle présente encore certaines limites :

- dépendance à la qualité des données disponibles,
- absence d’analyse sémantique avancée, ( plus lourd )
- recommandations limitées si peu d’informations sont renseignées par l’utilisateur.
- les 3 recommandations ne sont pas toutes pertinentes parfois (minimum 2 sur 3).

Ces limites pourront être améliorées dans de futures versions grâce à des modèles NLP plus avancés.

---
