# Vercel Deployment Guide - Gestion Garage

## 📋 Prérequis

1. Compte Vercel : https://vercel.com
2. Vercel CLI installé : `npm install -g vercel`
3. Base de données PostgreSQL accessible publiquement (ex: Neon, Supabase, Railway)

## 🚀 Déploiement

### Option 1 : Déploiement via Interface Web Vercel (Recommandé)

#### Backend (API Node.js)

1. **Connecter le Repository**
   - Aller sur https://vercel.com/new
   - Importer le repository : `https://github.com/Ads10045/gestion-garage`
   - Sélectionner le dossier `backend-nodejs`

2. **Configuration du Projet**
   - Framework Preset: `Other`
   - Root Directory: `backend-nodejs`
   - Build Command: `npm install`
   - Output Directory: (laisser vide)
   - Install Command: `npm install`

3. **Variables d'Environnement**
   Ajouter dans Settings → Environment Variables :
   ```
   PORT=3000
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_NAME=visite_technique
   DB_USER=your-db-user
   DB_PASS=your-db-password
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=production
   ```

4. **Déployer**
   - Cliquer sur "Deploy"
   - URL du backend : `https://your-backend.vercel.app`

#### Frontend (Angular)

1. **Connecter le Repository**
   - Aller sur https://vercel.com/new
   - Importer le même repository
   - Sélectionner le dossier `frontend`

2. **Configuration du Projet**
   - Framework Preset: `Angular`
   - Root Directory: `frontend`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist/frontend/browser`
   - Install Command: `npm install`

3. **Variables d'Environnement**
   ```
   NODE_ENV=production
   ```

4. **Mettre à jour l'URL de l'API**
   - Éditer `frontend/src/app/services/api.service.ts`
   - Remplacer `http://localhost:3000/api` par l'URL du backend Vercel
   - Exemple : `https://your-backend.vercel.app/api`

5. **Déployer**
   - Cliquer sur "Deploy"
   - URL du frontend : `https://your-frontend.vercel.app`

### Option 2 : Déploiement via CLI

#### Backend

```bash
cd backend-nodejs
vercel

# Suivre les prompts:
# - Set up and deploy? Yes
# - Which scope? (sélectionner votre compte)
# - Link to existing project? No
# - Project name? gestion-garage-backend
# - Directory? ./
# - Override settings? No

# Ajouter les variables d'environnement
vercel env add DB_HOST
vercel env add DB_PORT
vercel env add DB_NAME
vercel env add DB_USER
vercel env add DB_PASS
vercel env add JWT_SECRET

# Redéployer avec les variables
vercel --prod
```

#### Frontend

```bash
cd frontend
vercel

# Suivre les prompts:
# - Set up and deploy? Yes
# - Which scope? (sélectionner votre compte)
# - Link to existing project? No
# - Project name? gestion-garage-frontend
# - Directory? ./
# - Override settings? Yes
#   - Build Command? npm run vercel-build
#   - Output Directory? dist/frontend/browser
#   - Development Command? npm start

# Déployer en production
vercel --prod
```

## 🗄️ Configuration Base de Données PostgreSQL

### Option 1 : Neon (Recommandé - Gratuit)

1. Créer un compte sur https://neon.tech
2. Créer un nouveau projet
3. Créer une base de données `visite_technique`
4. Copier les credentials de connexion
5. Utiliser ces credentials dans les variables d'environnement Vercel

### Option 2 : Supabase

1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Aller dans Settings → Database
4. Copier les credentials de connexion
5. Utiliser ces credentials dans les variables d'environnement Vercel

### Option 3 : Railway

1. Créer un compte sur https://railway.app
2. Créer un nouveau projet PostgreSQL
3. Copier les credentials de connexion
4. Utiliser ces credentials dans les variables d'environnement Vercel

## 🔧 Post-Déploiement

### 1. Initialiser la Base de Données

```bash
# Créer les tables (Sequelize le fera automatiquement au premier démarrage)
# Ou exécuter manuellement les migrations si nécessaire

# Créer l'utilisateur admin
# Utiliser le script seed-user.js localement puis exporter les données
```

### 2. Tester l'API

```bash
curl https://your-backend.vercel.app/api/stats
```

### 3. Mettre à Jour le Frontend

Éditer `frontend/src/app/services/api.service.ts` :

```typescript
private apiUrl = 'https://your-backend.vercel.app/api';
```

Puis redéployer :

```bash
cd frontend
git add .
git commit -m "Update API URL for production"
git push
# Vercel redéploiera automatiquement
```

## 🔒 Sécurité

### CORS

Le backend doit autoriser le domaine frontend. Éditer `backend-nodejs/server.js` :

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

### Variables d'Environnement

- ⚠️ Ne jamais commiter le fichier `.env`
- ✅ Toujours utiliser les variables d'environnement Vercel
- ✅ Utiliser un JWT_SECRET fort en production

## 📊 Monitoring

### Logs Vercel

```bash
# Voir les logs du backend
vercel logs https://your-backend.vercel.app

# Voir les logs du frontend
vercel logs https://your-frontend.vercel.app
```

### Dashboard Vercel

- Analytics : https://vercel.com/dashboard/analytics
- Deployments : https://vercel.com/dashboard
- Settings : https://vercel.com/dashboard/settings

## 🔄 Déploiement Continu

Vercel redéploie automatiquement à chaque push sur la branche `main` :

```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel détecte le push et redéploie automatiquement
```

## 🐛 Dépannage

### Erreur : "Cannot find module"
- Vérifier que toutes les dépendances sont dans `package.json`
- Vérifier que `node_modules` n'est pas dans `.gitignore`

### Erreur : "Database connection failed"
- Vérifier les variables d'environnement
- Vérifier que la base de données est accessible publiquement
- Vérifier les credentials

### Erreur : "CORS policy"
- Vérifier la configuration CORS dans `server.js`
- Ajouter le domaine frontend dans la liste des origines autorisées

### Frontend ne charge pas l'API
- Vérifier l'URL de l'API dans `api.service.ts`
- Vérifier que le backend est déployé et accessible
- Vérifier les logs du navigateur (F12)

## 📝 Checklist Déploiement

- [ ] Backend déployé sur Vercel
- [ ] Frontend déployé sur Vercel
- [ ] Base de données PostgreSQL configurée
- [ ] Variables d'environnement configurées
- [ ] URL de l'API mise à jour dans le frontend
- [ ] CORS configuré correctement
- [ ] Utilisateur admin créé
- [ ] Tests de l'API effectués
- [ ] Tests du frontend effectués
- [ ] Domaine personnalisé configuré (optionnel)

## 🌐 Domaines Personnalisés (Optionnel)

1. Aller dans Settings → Domains
2. Ajouter votre domaine personnalisé
3. Configurer les DNS selon les instructions Vercel
4. Attendre la propagation DNS (quelques minutes à quelques heures)

---

**Support** : https://vercel.com/docs
**Status** : https://www.vercel-status.com
