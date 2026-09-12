# [Recuperer infos API]

# [Recuperation donnees]

## Description de la features :

Permet de scrapper l'API de WeLoceDev pour obtenir toute les informations des postes en entreprises

## Technique

### Dependances :

import -> requests, json, time
API -> `https://epi-api.welovedevs.com`

### Fichier cles :

@Get_Offre_API.py -> Fichier permettant d'aller chercher automatiquement les donnees et d'aller les enregistrer dans un fichier json @Data.json

### Flux de donnees

Python -> API -> Python -> JSON

### 🧠 Logique de fonctionnement

Au lancement du fichier python on va aller chercher sur leurs API toute les donnees des postes et des entreprises et les enregistre dans un json

### 🧪 Tests

Aucun test pour le moment

### 🔐 Sécurité

Cle securise dans le .env

## 🚀 Déploiement / Configuration

Utiliser dans le containeur Schulder

## 📌 Notes complémentaires
