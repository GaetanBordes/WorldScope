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

ou

```bash
ngrok http 4000
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
