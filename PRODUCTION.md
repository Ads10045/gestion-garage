# Déploiement Gestion Garage - Informations de Production

**Date de déploiement** : 29 décembre 2024  
**Version** : 1.0.0

---

## 🌐 URLs de Production

### Backend API
- **URL Production** : https://backend-nodejs-five.vercel.app
- **URL Alternative** : https://backend-nodejs-d0n6ba714-ads10.vercel.app
- **Dashboard Vercel** : https://vercel.com/ads10/backend-nodejs

### Frontend Application
- **URL Production** : https://gestion-garage-frontend.vercel.app *(en cours de déploiement)*
- **Dashboard Vercel** : https://vercel.com/ads10/gestion-garage-frontend

### Repository GitHub
- **URL** : https://github.com/Ads10045/gestion-garage
- **Branche** : main

---

## 🗄️ Base de Données PostgreSQL (Neon)

### Informations de Connexion

```env
DB_HOST=ep-hidden-smoke-aft4i376.c-2.us-west-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=npg_7Ngrox9UiFKw
```

### Connection String Complète

```
postgresql://neondb_owner:npg_7Ngrox9UiFKw@ep-hidden-smoke-aft4i376.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
```

### Détails du Projet Neon

- **Project ID** : green-cake-23294322
- **Project Name** : gestion-garage
- **Region** : aws-us-west-2 (US West - Oregon)
- **Dashboard** : https://console.neon.tech/app/projects/green-cake-23294322

---

## 🔐 Credentials de l'Application

### Utilisateur Administrateur

```
Username: admin
Password: admin
```

⚠️ **Important** : Changez ce mot de passe après le premier déploiement !

### JWT Secret

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

⚠️ **Important** : Générez un nouveau secret sécurisé pour la production !

---

## 📊 Endpoints API Principaux

### Base URL
```
https://backend-nodejs-five.vercel.app/api
```

### Endpoints Disponibles

#### Authentification
```bash
POST /api/auth/login
Body: { "username": "admin", "password": "admin" }
```

#### Statistiques
```bash
GET /api/stats
Response: { "totalClients": 0, "totalVehicules": 0, "totalFiches": 0 }
```

#### Clients
```bash
GET    /api/clients              # Liste des clients (paginée)
POST   /api/clients              # Créer un client
GET    /api/clients/:id          # Détails d'un client
PUT    /api/clients/:id          # Modifier un client
DELETE /api/clients/:id          # Supprimer un client
```

#### Véhicules
```bash
GET    /api/vehicules            # Liste des véhicules (paginée)
POST   /api/vehicules            # Créer un véhicule
GET    /api/vehicules/:id        # Détails d'un véhicule
PUT    /api/vehicules/:id        # Modifier un véhicule
DELETE /api/vehicules/:id        # Supprimer un véhicule
```

#### Fiches Techniques
```bash
GET    /api/fiches               # Liste des fiches (paginée)
POST   /api/fiches               # Créer une fiche
GET    /api/fiches/:id           # Détails d'une fiche
PUT    /api/fiches/:id           # Modifier une fiche
DELETE /api/fiches/:id           # Supprimer une fiche
GET    /api/fiches/recent        # Fiches récentes
```

#### Documentation API
```bash
GET /api-docs                    # Swagger UI
```

---

## 🧪 Tests de l'API

### Test de Connexion

```bash
curl https://backend-nodejs-five.vercel.app/api/stats
```

**Réponse attendue** :
```json
{
  "totalClients": 0,
  "totalVehicules": 0,
  "totalFiches": 0
}
```

### Test d'Authentification

```bash
curl -X POST https://backend-nodejs-five.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

**Réponse attendue** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

---

## ⚙️ Variables d'Environnement Vercel

### Backend (backend-nodejs)

Variables configurées dans Vercel :

```env
DB_HOST=ep-hidden-smoke-aft4i376.c-2.us-west-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASS=npg_7Ngrox9UiFKw (sensitive)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production (sensitive)
NODE_ENV=production
```

### Frontend (gestion-garage-frontend)

```env
NODE_ENV=production
```

---

## 🔄 Mise à Jour du Frontend

### Étape 1 : Mettre à jour l'URL de l'API

Éditer `frontend/src/app/services/api.service.ts` :

```typescript
private apiUrl = 'https://backend-nodejs-five.vercel.app/api';
```

### Étape 2 : Commit et Push

```bash
cd frontend
git add src/app/services/api.service.ts
git commit -m "Update API URL for production"
git push
```

Vercel redéploiera automatiquement le frontend.

---

## 📝 Commandes Utiles

### Redéployer le Backend

```bash
cd backend-nodejs
npx vercel --prod
```

### Redéployer le Frontend

```bash
cd frontend
npx vercel --prod
```

### Voir les Logs

```bash
# Backend
npx vercel logs https://backend-nodejs-five.vercel.app

# Frontend
npx vercel logs https://gestion-garage-frontend.vercel.app
```

### Ajouter une Variable d'Environnement

```bash
cd backend-nodejs
npx vercel env add VARIABLE_NAME production
```

---

## 🔧 Configuration SSL (Neon)

La connexion à Neon nécessite SSL. Configuration dans `config/database.js` :

```javascript
dialectOptions: {
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('neon.tech') ? {
        require: true,
        rejectUnauthorized: false
    } : false
}
```

---

## 📦 Structure du Projet

```
gestion-garage/
├── backend-nodejs/          # API Node.js + Express
│   ├── config/             # Configuration DB
│   ├── controllers/        # Contrôleurs API
│   ├── models/             # Modèles Sequelize
│   ├── routes/             # Routes Express
│   ├── server.js           # Point d'entrée
│   └── vercel.json         # Config Vercel
│
├── frontend/               # Application Angular
│   ├── src/
│   │   ├── app/           # Composants Angular
│   │   └── assets/        # Assets statiques
│   └── vercel.json        # Config Vercel
│
├── README.md              # Documentation
├── SPECIFICATION.md       # Spécifications techniques
└── DEPLOYMENT.md          # Guide de déploiement
```

---

## 🚨 Sécurité - Actions Recommandées

### Immédiatement

1. ✅ Changer le mot de passe admin
2. ✅ Générer un nouveau JWT_SECRET sécurisé
3. ✅ Configurer CORS pour autoriser uniquement le domaine frontend

### Avant Production

1. ⚠️ Activer l'authentification sur toutes les routes sensibles
2. ⚠️ Implémenter rate limiting
3. ⚠️ Configurer les logs et monitoring
4. ⚠️ Backup automatique de la base de données
5. ⚠️ Configurer un domaine personnalisé

---

## 📊 Monitoring et Logs

### Vercel Dashboard

- **Backend** : https://vercel.com/ads10/backend-nodejs
- **Frontend** : https://vercel.com/ads10/gestion-garage-frontend

### Neon Dashboard

- **Database** : https://console.neon.tech/app/projects/green-cake-23294322

### Métriques Disponibles

- Requests per second
- Response time
- Error rate
- Database connections
- Storage usage

---

## 🆘 Support et Dépannage

### Erreur : "Database connection failed"

1. Vérifier les variables d'environnement Vercel
2. Vérifier que Neon est accessible
3. Vérifier la configuration SSL

### Erreur : "CORS policy"

Ajouter le domaine frontend dans `server.js` :

```javascript
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://gestion-garage-frontend.vercel.app'
  ]
}));
```

### Logs Backend

```bash
npx vercel logs https://backend-nodejs-five.vercel.app --follow
```

---

## 📞 Contacts

- **Email Support** : abachyouness@gmail.com
- **GitHub Issues** : https://github.com/Ads10045/gestion-garage/issues
- **Vercel Support** : https://vercel.com/support

---

**Dernière mise à jour** : 29 décembre 2024, 12:30 CET  
**Statut** : ✅ Backend déployé | 🔄 Frontend en cours
