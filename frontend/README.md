# Worldscope

## Description

App interactive de géopolitique en temps réel.

## Structure du projet

- `backend/` : API, auth, base de données SQLite
- `frontend/` : UI React, Vite, MapLibre

## Installation

1. Cloner le dépôt
2. Backend :
   ```bash
   cd backend && npm install && npx prisma migrate dev
   ```
3. Frontend :

   ```bash
   cd frontend && npm install
   ```

### Lancement

- Backend : npm run dev (nodemon)

- Frontend : npm run dev (Vite)

**Environnements**

- Copier .env.example en .env dans chaque dossier.

#### Roadmap (3 semaines)

1. Semaine 1 : Auth & structure API + UI de base

2. Semaine 2 : Intégration Carto & APIs externes

3. Semaine 3 : Tests, déploiement

**Fin de l'initialisation**  
Nous avons maintenant la structure de base, les commandes et le README prêts pour démarrer le développement."

## Configuration des scripts et premier commit

1. **Back-end** (dans `backend/package.json`) :

   ```json
   "scripts": {
     "dev": "nodemon src/server.js",
     "build": "echo 'No build step needed'",
     "start": "node src/server.js"
   }
   ```

   **Front-end** (dans frontend/package.json) :

   ```json
   "scripts": {
   "dev": "vite",
   "build": "vite build",
   "preview": "vite preview"
   }
   ```

Fichier .env.example dans chaque dossier :

- backend/.env.example :
  DATABASE_URL="file:./dev.db"
  JWT_SECRET=your_jwt_secret
  SMTP_USER=your_email@example.com
  SMTP_PASS=your_email_password

- frontend/.env.example
  VITE_API_URL=http://localhost:4000

## Mise en place CI/CD (optionnel)

- Créer .github/workflows/ci.yml :

  name: CI
  on: [push]
  jobs:
  backend:
  runs-on: ubuntu-latest
  steps: - uses: actions/checkout@v2 - uses: actions/setup-node@v2
  with: node-version: '18' - name: Install and Test Backend
  run: |
  cd backend
  npm install
  npx prisma migrate deploy
  npm test
  frontend:
  runs-on: ubuntu-latest
  steps: - uses: actions/checkout@v2 - uses: actions/setup-node@v2
  with: node-version: '18' - name: Install and Build Frontend
  run: |
  cd frontend
  npm install
  npm run build

### étapes (Semaine 1)

- Authentification : endpoints d'inscription, connexion, middleware JWT.

- Email verification : configuration de Nodemailer et templates d'email.

- UI de base : pages Login/Signup, layout principal.

- Connexion Back–Front : tests manuels avec Postman et intégration Axios.

- Poursuite semaine 2 et 3 : intégration map, APIs ACLED, tests, optimisation, déploiement sur Vercel/Heroku.

```bash
npm install # installe concurrently
cd backend && npm install # installe axios, cors, etc.
cd ../frontend && npm install
cd .. # retour à la racine
npm run dev # lance backend+proxy sur 4000, frontend sur 5173
```

Ngrok (ou localtunnel)
Expose le backend sur localhost:4000

```bash
npx ngrok http 4000 --region=eu --hostname=worldscope.loca.lt
```

Ou

```bash
npx localtunnel --port 4000 --subdomain worldscope
```

Pour ainsi avoir 3 services :

- Backend/API + proxy ACLED (port 4000)

- Frontend Vite (port 5173)

- Tunnel public (ngrok / loca.lt)

Résumé des ports
Service Commande Port
Backend + proxy ACLED npm run start:backend / via dev 4000
Frontend Vite npm run start:frontend 5173
Tunnel public (ngrok) npx ngrok http 4000 dynamiquement (ex: abcd.ngrok.io)
