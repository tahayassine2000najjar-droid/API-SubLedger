# SubLedger API

API de gestion d'abonnements pour la startup FinTech SubLedger. Permet l'authentification JWT, la gestion des abonnements, et le calcul des dépenses.

## Fonctionnalités

- Authentification des utilisateurs (JWT)
- Gestion des abonnements (CRUD)
- Calcul des dépenses et statistiques
- Contrôle d'accès basé sur les rôles (user/admin)

## Prérequis

- Node.js 20+
- MongoDB 7+
- Docker (optionnel)

## Installation

```bash
npm install
```

## Configuration

Copier le fichier `.env.example` vers `.env` et ajuster les variables :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/subledger
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
```

## Utilisation

### Développement

```bash
npm run dev
```

### Production

```bash
npm start
```

## Utilisation avec Docker

### Développement

```bash
docker compose up
```

L'API sera accessible sur `http://localhost:5000`.

### Production

```bash
docker build --target production -t subledger .
docker run -p 5000:5000 --env-file .env subledger
```

## Tests

```bash

npm test


npm run test:unit


npm run test:integration
```

## Structure du projet

```
├── .github/workflows/   # CI pipeline
├── src/
│   ├── config/          # Configuration (DB)
│   ├── controllers/     # Logique métier
│   ├── middlewares/      # Auth, rôles, validation
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes Express
│   ├── utils/           # Utilitaires (calculs)
│   ├── app.js           # Configuration Express
│   └── server.js        # Point d'entrée
├── tests/
│   ├── unit/            # Tests unitaires
│   └── integration/     # Tests d'intégration
├── compose.yaml         # Orchestration Docker
├── Dockerfile           # Image Docker multi-stage
└── package.json
```

## API Endpoints

### Auth

| Méthode | Route              | Description          |
|---------|--------------------|----------------------|
| POST    | /api/auth/signup   | Inscription          |
| POST    | /api/auth/login    | Connexion            |

### Abonnements (protégés)

| Méthode | Route                       | Description             |
|---------|-----------------------------|-------------------------|
| POST    | /api/subscriptions          | Créer un abonnement     |
| GET     | /api/subscriptions          | Lister mes abonnements  |
| GET     | /api/subscriptions/:id      | Détail d'un abonnement  |
| PUT     | /api/subscriptions/:id      | Modifier un abonnement  |
| DELETE  | /api/subscriptions/:id      | Supprimer un abonnement |

### Admin (protégé, rôle admin)

| Méthode | Route              | Description          |
|---------|--------------------|----------------------|
| GET     | /api/admin/users   | Lister les utilisateurs |
