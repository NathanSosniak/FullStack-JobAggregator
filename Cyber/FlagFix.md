# Configuration des En-têtes de Sécurité HTTP (Security Headers)

# Configuration / Sécurité (Frontend)

## Description de la features :
Cette feature consiste en la mise en place globale d'en-têtes HTTP de sécurité (*Security Headers*) au niveau du serveur Next.js. Concrètement, elle intercepte toutes les requêtes entrantes de l'application frontend pour y injecter des règles de sécurité lues par les navigateurs des utilisateurs. Cela permet de blinder l'application contre plusieurs types d'attaques courantes validées lors de nos scans de vulnérabilités (OWASP ZAP).

![alt text](<Capture d’écran du 2026-05-17 20-30-00.png>)

## Technique

### Dependances :
- **Libs / packages utilisés :** Aucun package externe. Utilisation de la fonctionnalité native d'asynchronisme des en-têtes de Next.js via l'interface `NextConfig`.
- **Autres features internes :** Impacte l'ensemble des routes du Frontend.

### Fichier cles :
- `Frontend/techyourjob-frontend/next.config.ts` : Unique fichier modifié pour intégrer la fonction `headers()`.

### Flux de donnees
1. **Requête :** Le navigateur de l'utilisateur demande une page.
2. **Traitement Serveur :** Le conteneur Docker Frontend (Next.js) intercepte la demande.
3. **Injection :** La fonction `headers()` de `next.config.ts` injecte les métadonnées de sécurité dans la réponse HTTP.
4. **Application :** Le navigateur reçoit la page et applique immédiatement les restrictions (interdiction des iframes, forçage du HTTPS, etc.).

### 🧠 Logique de fonctionnement
La configuration applique trois règles majeures sur le pattern de route `/(.*)` (c'est-à-dire l'intégralité du site) :

1. **`X-Frame-Options: DENY`**
   - *Rôle :* Interdit formellement l'intégration de notre site dans une balise `<iframe>` ou `<frame>` par un site tiers.
   - *Objectif :* Bloque les attaques de **Clickjacking** où un attaquant tenterait de superposer notre site de manière invisible pour détourner les clics des utilisateurs.

2. **`X-Content-Type-Options: nosniff`**
   - *Rôle :* Force le navigateur à respecter strictement le type MIME envoyé par le serveur (ex: bloquer un fichier si le serveur dit que c'est une image mais qu'il contient du script).
   - *Objectif :* Empêche le **MIME-Sniffing** et l'exécution de scripts malveillants masqués dans des fichiers statiques.

3. **`Strict-Transport-Security (HSTS)`**
   - *Rôle :* Donne l'ordre au navigateur de ne communiquer avec le site **qu'en HTTPS sécurisé** pendant une durée de 2 ans (`max-age=63072000`).
   - *Objectif :* Élimine le risque d'interception de données si l'utilisateur se connecte depuis un réseau public non sécurisé.

### 🧪 Tests
- **Outil utilisé :** **OWASP ZAP** (Outil DAST d'analyse dynamique de sécurité).
- **Méthodologie :** 1. Scan automatisé sur l'environnement public.

- Lancement d'un *Active Scan* (Scan Actif) en profondeur sur l'arborescence authentifiée.
- **Résultat :** **0 faille d'injection (Flag Rouge)** détectée sur l'ensemble du projet. Validation réussie de la disparition des alertes *Medium* liées au Clickjacking, HSTS et X-Content-Type après reconstruction de l'image Docker.

![alt text](<Capture d’écran du 2026-05-17 21-05-33.png>)

### 🔐 Sécurité

- **Reste à faire (CSP) :** L'alerte concernant la *Content Security Policy (CSP)* a été volontairement laissée de côté pour ce sprint. Sa mise en place nécessite un inventaire complet de toutes les ressources externes pour éviter de bloquer des fonctionnalités ou des styles graphiques essentiels au site. Elle fera l'objet d'un ticket dédié.

## 🚀 Déploiement / Configuration
- **Périmètre :** Applicatif Frontend uniquement (`techyourjob-frontend`).
- **Impact conteneur :** Modifie le comportement du conteneur de build de Next.js.
- **Commande de déploiement indispensable :** Pour que les modifications soient appliquées dans l'environnement virtualisé, l'image Docker doit impérativement être reconstruite avec la commande :
  ```bash
  docker compose up --build