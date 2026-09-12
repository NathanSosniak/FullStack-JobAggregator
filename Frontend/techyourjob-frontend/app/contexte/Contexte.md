# [COntexte Data intra page]

# [Donnees/ frontend]

## Description de la features :

Le contexte est un dossier qui contient un fichier, UserCOntext.js, il permet si un utiloisateur est connecte de recuperer sa photo de profile et de la sauvegarder. C'est une couche au dessus des pages ce qui veut dire que si on bascule de page nous n'avons pas besoin d'aller refaire une requete pour obtenir la photyo de profile ce qui saute un petit sintillement de la PP sans ca.
Ca permet de recuperer en avance et d'afficher proprement

## Technique

### Dependances :

N'a aucune dependance autre que celle de react lui meme

### Fichier cles :

utilise le fichier suiovant @UserCOntext.js --> permet d'aller chercher notre PP
@Get_User_Info --> route du backend piur aller chercher les infos de l'utulisateur connecte donc ca PP
@layout.tsx --> permet de passer ses donnees issu du fichier a la couche supperieur

### Flux de donnees

Token --> ID --> route --> PP --> Contexte --> page profile
--> page account
--> . . .

### 🧠 Logique de fonctionnement

Fonctionne au dessus des pages de base pour ne pas avoir besoin de refetch l'infos

### 🧪 Tests

Aucun

### 🔐 Sécurité

Securite instaure dans le backend + si fichier present ou non + verificationtoken

## 🚀 Déploiement / Configuration

Present dans le docker Frontend

## 📌 Notes complémentaires

Non
