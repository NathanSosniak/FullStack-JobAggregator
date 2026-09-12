# [Ajout Data into DB]

# [Ajout Donnees]

## Description de la features :

Permet d'ajouter dans la base de donnee PostGress nos informnations issu de l'API WeLoveDev qui se trouvent dans notre json

## Technique

### Dependances :

import -> jsonpath_ng, json, psycopg, dotenv, os, datetime

### Fichier cles :

@Add_API_DB.py -> Fichier disposant de deux partie, une partie permet d'aller chercher les infos du json pour les entreprises et pour les postes.
La deuxieme partie s'occupe de les rentrer un a un dans la base de doneee.
@Data.json -> Fichier contenant toute les infos issu de la base de donnee
@UpdateDB.py -> Fichier d'aller lancer automatiquement tout le processus d'ajout a la DB

### Flux de donnees

Python -> Json -> DB -> Python (message reussite ou erreur)

### 🧠 Logique de fonctionnement

AU lancement du fichier Python @UpdateDB.py le fichier va automatiquement appeller @Add_API_DB.py et prendre les bonnes inforamtions de @Data.json et les renseigner dans la base de donnees, la table Poste et Entreprise

### 🧪 Tests

Aucun test pour le moment

### 🔐 Sécurité

Credential securise dans le .env

## 🚀 Déploiement / Configuration

AUcun deploiment

## 📌 Notes complémentaires
