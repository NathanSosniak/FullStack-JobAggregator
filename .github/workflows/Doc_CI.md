# [CI Github]

# [CI github]

## Description de la features :

Permet de realiser automatiquement les test pour le CI de github

## Technique

### Dependances :

npm install --save-dev jest supertest --> pour realliser des test automatise

### Fichier cles :

ci.yml --> fichier ou l'ont met les commandes a execute le CI

### Flux de donnees

Pull request --> merge

### 🧪 Tests

Checkout --> va telecharger les fichiers du repo
Setup Node --> Installe node
Install backend deps --> installe dependance backend
Lint backend --> lance lint
Run backend tests --> lance les tests du backend
