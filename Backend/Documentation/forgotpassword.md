# Routes Forgot / Reset Password

## Description de la feature :

Ce module gère l'intégralité du flux de récupération de mot de passe pour les utilisateurs. Il est composé de deux routes principales : `/forgot-password` et `/reset-password`.

Son but est de permettre à un utilisateur ayant oublié son mot de passe de recevoir un lien sécurisé par email pour en créer un nouveau. Le système génère une **URL unique contenant un token JWT** à usage unique et d'une durée de vie limitée (1 heure).

L'enjeu majeur de cette route réside dans la **sécurité**. Elle doit interagir avec la base de données et le service de messagerie (Brevo) sans jamais divulguer d'informations sensibles sur l'existence ou non d'un compte, tout en s'assurant que seul le propriétaire légitime puisse modifier son mot de passe.

## Technique

### Dépendances :

- **jsonwebtoken (jwt)** pour générer et vérifier les tokens de sécurité uniques.
- **nodemailer** pour interagir avec le serveur SMTP (Brevo) et envoyer les emails.
- **bcrypt** pour hacher le nouveau mot de passe avant son insertion en base de données.
- **dotenv** pour charger les variables d'environnement (identifiants SMTP, clés secrètes).

### Flux de données

**Étape 1 : Demande de réinitialisation (`/forgot-password`)**

- Le frontend envoie une adresse email.
- Le backend nettoie l'email et interroge la table `utilisateur` de la base de données.
- Si l'email est trouvé, génération d'un token JWT et envoi d'un mail avec le lien de réinitialisation.

**Étape 2 : Changement du mot de passe (`/reset-password`)**

- Le frontend renvoie le token, l'ID de l'utilisateur et le nouveau mot de passe.
- Le backend vérifie la validité et l'intégrité du token.
- Hachage du nouveau mot de passe et mise à jour dans la base de données.

### 🧠 Logique de fonctionnement

**Route `/forgot-password` :**

- L'adresse email fournie est formatée (suppression des espaces invisibles via `trim()` et passage en minuscules via `toLowerCase()`).
- Indépendamment du fait que l'email existe ou non en base de données, la route renvoie toujours un statut 200 au client.
- Si l'utilisateur existe, un token JWT est généré en combinant la `SECRET_KEY` globale et le mot de passe actuel de l'utilisateur.
- Un email contenant l'URL de réinitialisation est envoyé via le transporteur Brevo configuré dans la route.

**Route `/reset-password` :**

- Le backend récupère les informations de l'utilisateur via son ID.
- Le token est vérifié avec la même clé combinée (`SECRET_KEY` + ancien mot de passe). Ainsi, dès que le mot de passe est changé, la clé secrète change, ce qui invalide instantanément le token (il devient à usage unique).
- Le nouveau mot de passe est haché en utilisant `bcrypt`.
- La base de données est mise à jour.

### 🔐 Sécurité

- **Anti-énumération de comptes :** La route `/forgot-password` renvoie toujours un succès (200) que l'email existe ou non, empêchant ainsi un attaquant de deviner quelles adresses emails sont enregistrées dans la base.
- **Tokens dynamiques et éphémères :** Le token JWT expire au bout d'une heure. De plus, le token dépend du mot de passe actuel de l'utilisateur, ce qui le rend inutilisable dès que la réinitialisation a eu lieu.
- **Sanétisation des entrées :** Utilisation systématique de `trim()` et `LOWER()` pour éviter les erreurs d'identification liées à la casse ou aux espaces.
- **Hachage cryptographique :** Les mots de passe ne transitent jamais en clair et sont hachés via `bcrypt` avant stockage.
- **Protection des identifiants :** Toutes les clés secrètes et identifiants SMTP (Brevo) sont stockés dans le fichier `.env` et masqués.

## 🚀 Déploiement / Configuration

- Le système de messagerie nécessite une configuration SMTP valide chez Brevo, avec un expéditeur vérifié (`MAIL_SENDER`).
- L'API est déployée dans le conteneur `backend` de Docker.
