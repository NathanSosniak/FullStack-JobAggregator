# [Upload de fichier dans la db]

# [Route]

## Description de la features :

La feature permet a un utilisateur connecte de pouvoir upload des fichiers de maniere 100% securise dans notre base de donnees ainsi que notre lieu de stockage (minio) et d'avoir la certitude que personne n'a touche a son fichier

## Technique

### Dependances :

`crypto` --> librairie js qui permet de crypter des donnees, en loccurence ici un hash `sha256`
`fs` --> permet ici d'aller chercher un fichier (file searcher)

### Fichier cles :

Upload_fichier.js

### Flux de donnees

Utilisateurs (fichier) --> site inernet --> route backend |--> stockage BD
|--> stockage minio

### 🧠 Logique de fonctionnement

COncretement, l'utilkisateur connecet va upload un fichier, nous allons l'encrypter avec une cle et le sauvegarder dans minio qui est structure sous cette forme :

candidatures/
├── offre_7/
│ ├── user_42/
│ │ └── projet.zip
│ └── user_43/
│ └── projet.zip
└── offre_12/
└── user_42/
└── test.zip

On va stocker dans la DB postgress le chemin d'acces, l'utilisateurs le poste mais egalement la cle de hashage.
Stocker la cle va nous permettre d'avoir une double verifrication, on va verifier a l'arrive si la cle est identique a celle de depart et si la fonction `genererHash` nous redonne la meme que celle de la dd, comme ca pas de changement externe possible

### 🧪 Tests

Aucun

### 🔐 Sécurité

- Utilisateur doit etre connecte
- Double securite au niveau du chiffrement

## 🚀 Déploiement / Configuration

Upload dans la partie Backend du projet

## 📌 Notes complémentaires

Aucune
