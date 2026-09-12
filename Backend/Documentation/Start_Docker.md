# [Route Lancement Sandbox Docker]

# [Route POST]

## Description de la features :

Cette fonctionnalité permet de lancer un environnement de développement (IDE) sécurisé et isolé dans un conteneur Docker. Elle permet de charger les fichiers d'un candidat directement depuis MinIO dans une sandbox pour que le recruteur puisse tester le code en temps réel.

## Technique

### Dependances :

- **dockerode** : Pour piloter le moteur Docker depuis Node.js.
- **tar-stream** : Pour créer l'archive contenant les fichiers à injecter.
- **../../MINIO** : Pour récupérer les fichiers de candidatures.
- **Image Docker `sandbox-ide`** : Image de base contenant l'IDE (ex: Code-Server).

### Fichier cles :

- **Start_Docker.js** : Orchestrateur de la sandbox.
- **sandbox-firewall.sh** : Script de sécurisation réseau exécuté au démarrage.

### Flux de donnees

1.  **Client** : Envoie une liste de chemins MinIO (`fichierPaths`).
2.  **Backend** :
    - Récupère chaque fichier dans le bucket "candidatures" de Minio.
    - Compresse ces fichiers dans un flux `tar`.
    - Crée un conteneur Docker avec des limites strictes.
    - Démarre le conteneur.
    - Exécute un script de firewall interne.
    - Injecte l'archive `tar` dans le répertoire home du conteneur.
3.  **Réponse** : Renvoie l'URL publique (hôte + port dynamique) de la sandbox.

### 🧠 Logique de fonctionnement

- **Préparation** : Les fichiers sont récupérés sous forme de `Buffer` depuis MinIO et ajoutés à un `tar-stream`.
- **Isolation Docker** :
  - **Ressources** : Limite à 512 Mo de RAM et 50% de CPU.
  - **Sécurité** : Désactivation de l'escalade de privilèges (`no-new-privileges`) et suppression de toutes les capacités Linux (`CapDrop: ALL`).
  - **Réseau** : Ajout limité de capacités pour autoriser les gestionnaires de paquets (via le script firewall).
- **Cycle de vie** :
  - Le port 8080 du conteneur est mappé sur un port aléatoire de l'hôte.
  - Le conteneur s'auto-détruit après 30 minutes (`setTimeout` + `AutoRemove`).
- **Persistance** : Les fichiers sont injectés dans `/home/coder`.

### 🧪 Tests

- Tests de charge et de sécurité manuels (vérification des limites CPU/RAM) ainsi que le firewqll.

### 🔐 Sécurité

- **Sandbox Hardened** : Utilisation d'un profil de sécurité Docker restrictif.
- **Firewall** : Exécution de `sandbox-firewall.sh` en root dès le démarrage pour verrouiller les accès réseau sortants.
- **Nettoyage automatique** : Suppression forcée après expiration du délai pour éviter la consommation de ressources.

## 🚀 Déploiement / Configuration

- Nécessite l'accès au socket Docker (`/var/run/docker.sock`) sur l'hôte où tourne le backend.
- L'image `sandbox-ide` doit être présente localement.

## 📌 Notes complémentaires

None
