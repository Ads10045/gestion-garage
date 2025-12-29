# Spécification Technique - Gestion Garage

## Vue d'ensemble du Projet

Application web complète de gestion d'atelier automobile permettant la gestion des clients, véhicules et fiches techniques de diagnostic.

## Architecture Technique

### Stack Technologique

#### Backend
- **Runtime** : Node.js v18+
- **Framework** : Express.js
- **Base de données** : PostgreSQL 14+
- **ORM** : Sequelize
- **Authentification** : JWT (jsonwebtoken)
- **Sécurité** : bcryptjs pour le hachage des mots de passe
- **Documentation API** : Swagger UI

#### Frontend
- **Framework** : Angular 18 (Standalone Components)
- **Styling** : Tailwind CSS
- **Internationalisation** : ngx-translate
- **HTTP Client** : Angular HttpClient
- **Reactive Programming** : RxJS

## Modèle de Données

### Entités Principales

#### Client
```typescript
{
  id: number (PK, auto-increment)
  nom: string
  prenom: string
  cin: string
  email: string
  telephone: string
  adresse: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relations** :
- `hasMany` Vehicule (1:N)

#### Vehicule
```typescript
{
  id: number (PK, auto-increment)
  immatriculationPart1: string (5 chars)
  immatriculationPart2: string (2 chars)
  immatriculationPart3: string (5 chars)
  marque: string
  modele: string
  typeVehicule: string
  carburant: string
  couleur: string
  puissanceFiscale: number
  anneeMiseCirculation: number
  numeroChassis: string
  kilometrageCompteur: number
  client_id: number (FK → client.id)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relations** :
- `belongsTo` Client (N:1)
- `hasMany` FicheTechnique (1:N)

#### FicheTechnique
```typescript
{
  id: number (PK, auto-increment)
  immatriculation: string (virtuel, calculé)
  marque: string (virtuel)
  modele: string (virtuel)
  annee: number (virtuel)
  kilometrage: number
  dateDiagnostic: timestamp with time zone
  dateReparation: timestamp with time zone (nullable)
  descriptionDiagnostic: text
  gravite: enum('MINEURE', 'MAJEURE', 'CRITIQUE')
  reparable: boolean
  etatMoteur: enum('BON', 'MOYEN', 'MAUVAIS')
  etatFreins: enum('BON', 'MOYEN', 'MAUVAIS')
  etatSuspension: enum('BON', 'MOYEN', 'MAUVAIS')
  etatElectrique: enum('BON', 'MOYEN', 'MAUVAIS')
  etatCarrosserie: enum('BON', 'MOYEN', 'MAUVAIS')
  etatGeneral: enum('BON', 'MOYEN', 'MAUVAIS')
  coutPieces: decimal
  coutMainOeuvre: decimal
  dureeReparationHeures: integer
  observationMecanicien: text
  statut: enum('EN_COURS', 'REPARE', 'NON_REPARABLE', 'A_REVOIR')
  vehicule_id: number (FK → vehicule.id)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relations** :
- `belongsTo` Vehicule (N:1)
- `hasMany` FichePanne (1:N)
- `hasMany` FichePiece (1:N)

#### FichePanne
```typescript
{
  fiche_id: number (FK → fiche_technique.id)
  panne: string
}
```

#### FichePiece
```typescript
{
  fiche_id: number (FK → fiche_technique.id)
  piece: string
}
```

#### User
```typescript
{
  id: number (PK, auto-increment)
  username: string (unique)
  password: string (hashed)
  role: enum('admin', 'user')
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Règles Métier

### Gestion des Clients

1. **Création** :
   - Tous les champs sont requis sauf l'adresse
   - Le CIN doit être unique
   - Email et téléphone doivent être valides

2. **Modification** :
   - Seuls les utilisateurs admin peuvent modifier
   - Impossible de modifier si des véhicules sont associés sans confirmation

3. **Suppression** :
   - Suppression en cascade manuelle :
     - Client → Véhicules → Fiches → Pannes/Pièces
   - Confirmation obligatoire
   - Réservée aux administrateurs

### Gestion des Véhicules

1. **Création** :
   - Doit être associé à un client existant
   - L'immatriculation est composée de 3 parties (XXXXX-XX-XXXXX)
   - Le kilométrage compteur est optionnel

2. **Modification** :
   - Impossible de changer le client propriétaire
   - Mise à jour du kilométrage lors de chaque fiche

3. **Suppression** :
   - Suppression en cascade manuelle :
     - Véhicule → Fiches → Pannes/Pièces
   - Confirmation obligatoire

### Gestion des Fiches Techniques

1. **Création** :
   - Date et heure de diagnostic pré-remplies avec l'heure actuelle
   - Doit être associée à un véhicule existant
   - Les informations du véhicule sont copiées automatiquement
   - Statut par défaut : "EN_COURS"
   - Gravité par défaut : "MINEURE"

2. **Modification** :
   - Possibilité de modifier la date/heure du diagnostic
   - Mise à jour du statut selon l'avancement
   - Ajout/suppression de pannes et pièces

3. **Suppression** :
   - Suppression en cascade manuelle :
     - Fiche → Pannes → Pièces
   - Confirmation obligatoire

4. **Calculs Automatiques** :
   - Coût total = Coût pièces + Coût main d'œuvre
   - Affichage formaté en DH (Dirhams)

## API REST

### Endpoints Clients

```
GET    /api/clients?query=&page=0&size=10
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id
```

**Pagination** : Format PageResponse
```typescript
{
  content: Client[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number,
  first: boolean,
  last: boolean,
  empty: boolean
}
```

### Endpoints Véhicules

```
GET    /api/vehicules?part1=&part2=&part3=&page=0&size=10
POST   /api/vehicules
GET    /api/vehicules/:id
PUT    /api/vehicules/:id
DELETE /api/vehicules/:id
```

### Endpoints Fiches Techniques

```
GET    /api/fiches?query=&page=0&size=10
POST   /api/fiches
GET    /api/fiches/:id
PUT    /api/fiches/:id
DELETE /api/fiches/:id
GET    /api/fiches/recent
```

### Endpoints Authentification

```
POST   /api/auth/login
```

**Request** :
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response** :
```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

### Endpoints Statistiques

```
GET    /api/stats
```

**Response** :
```json
{
  "totalClients": 111,
  "totalVehicules": 114,
  "totalFiches": 59
}
```

## Fonctionnalités Frontend

### Pages Principales

1. **Login** (`/login`)
   - Authentification JWT
   - Redirection vers dashboard après connexion

2. **Dashboard** (`/dashboard`)
   - Statistiques globales
   - Liste des 5 fiches récentes
   - Navigation rapide

3. **Recherche** (`/search`)
   - Onglet recherche clients
   - Onglet recherche véhicules (par immatriculation)
   - Pagination
   - Affichage des véhicules associés pour chaque client

4. **Détail Client** (`/clients/:id`)
   - Informations complètes
   - Liste des véhicules associés
   - Actions : Modifier, Supprimer, Ajouter véhicule

5. **Formulaire Client** (`/clients/new`, `/clients/:id/edit`)
   - Création/modification
   - Validation des champs

6. **Détail Véhicule** (`/vehicules/:id`)
   - Informations complètes
   - Lien vers le client propriétaire
   - Historique des fiches techniques
   - Actions : Modifier, Supprimer, Ajouter fiche

7. **Formulaire Véhicule** (`/vehicules/new/:clientId`)
   - Création avec client pré-sélectionné
   - Saisie immatriculation en 3 parties

8. **Liste Fiches** (`/fiches`)
   - Toutes les fiches avec pagination
   - Filtres par statut, gravité
   - Recherche par immatriculation

9. **Détail Fiche** (`/fiches/:id`)
   - Affichage style facture
   - Section signatures (mécanicien + client)
   - Impression optimisée A4
   - Actions : Modifier, Supprimer, Imprimer

10. **Formulaire Fiche** (`/fiches/new/:vehiculeId`)
    - Création avec véhicule pré-sélectionné
    - Champ date/heure avec valeur par défaut (maintenant)
    - Sélection pannes et pièces depuis config
    - Calcul automatique coût total

### Composants Réutilisables

- **Header** : Navigation principale avec icônes
- **Search** : Recherche clients/véhicules
- **Pagination** : Composant de pagination réutilisable

### Internationalisation

Langues supportées :
- Français (par défaut)
- Anglais
- Arabe (avec support RTL)

Fichiers de traduction :
- `assets/i18n/fr.json`
- `assets/i18n/en.json`
- `assets/i18n/ar.json`

## Sécurité

### Authentification
- JWT stocké dans localStorage
- Token envoyé dans header `Authorization: Bearer <token>`
- Expiration du token : configurable (par défaut 24h)

### Autorisation
- Rôles : `admin`, `user`
- Seuls les admins peuvent :
  - Créer/modifier/supprimer des clients
  - Créer/modifier/supprimer des véhicules
  - Créer/modifier/supprimer des fiches

### Protection des Routes
- Routes backend protégées par middleware JWT
- Routes frontend protégées par AuthGuard
- Redirection vers login si non authentifié

## Migrations et Maintenance

### Migrations Effectuées

1. **Migration DATE → TIMESTAMP** (`migrate-dates.js`)
   - Conversion de `date_diagnostic` et `date_reparation`
   - Type : `DATE` → `TIMESTAMP WITH TIME ZONE`
   - Permet le stockage de l'heure

2. **Nettoyage Base de Données** (`cleanup-db.js`)
   - Suppression de 17 tables Laravel inutilisées
   - Tables conservées : `client`, `vehicule`, `fiche_technique`, `fiche_panne`, `fiche_piece`, `users`

### Scripts de Maintenance

1. **Export Base de Données** (`export-db.js`)
   - Export JSON de toutes les tables
   - Nom fichier : `backup_YYYY-MM-DDTHH-MM-SS-MMMZ.json`
   - Contient métadonnées + données

2. **Seed Utilisateur** (`seed-user.js`)
   - Création utilisateur admin par défaut
   - Username: `admin`, Password: `admin`

## Améliorations Récentes

### Version 1.0.0 (29/12/2024)

#### Backend
- ✅ Support datetime complet (date + heure)
- ✅ Migration colonnes TIMESTAMP
- ✅ Suppression en cascade manuelle
- ✅ Sanitisation des payloads (gestion FK)
- ✅ Inclusion associations dans réponses API
- ✅ Endpoint migration pour ALTER TABLE

#### Frontend
- ✅ Champ datetime-local dans formulaire fiche
- ✅ Affichage date + heure partout (format dd/MM/yyyy HH:mm)
- ✅ Design facture pour impression
- ✅ Section signatures (mécanicien + client)
- ✅ Icônes épurées (boutons icon-only)
- ✅ Optimisation impression (CSS @media print)
- ✅ Affichage véhicules associés dans recherche

#### Base de Données
- ✅ Nettoyage tables inutilisées
- ✅ Backup automatique avant modifications
- ✅ Structure optimisée (4 tables principales + 2 jonction)

## Configuration Environnement

### Variables Backend (.env)
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=visite_technique
DB_USER=postgres
DB_PASS=your_password
JWT_SECRET=your_jwt_secret
```

### Configuration Frontend
- API URL : `http://localhost:3000/api`
- Langues : FR, EN, AR
- Pagination par défaut : 10 éléments

## Déploiement

### Prérequis Production
- Node.js 18+
- PostgreSQL 14+
- Reverse proxy (nginx recommandé)
- SSL/TLS pour HTTPS

### Étapes Déploiement

1. **Backend**
   ```bash
   cd backend-nodejs
   npm install --production
   node server.js
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   ng build --configuration production
   # Servir dist/ avec nginx
   ```

3. **Base de Données**
   - Créer la base `visite_technique`
   - Exécuter migrations si nécessaire
   - Créer utilisateur admin

## Tests

### Tests Backend
- Tests unitaires : À implémenter
- Tests d'intégration : À implémenter
- Tests API : Collection Postman disponible

### Tests Frontend
- Tests unitaires : À implémenter
- Tests E2E : À implémenter

## Roadmap

### Fonctionnalités Futures
- [ ] Gestion des rendez-vous
- [ ] Notifications par email/SMS
- [ ] Historique des modifications
- [ ] Export PDF des fiches
- [ ] Statistiques avancées (graphiques)
- [ ] Gestion des stocks de pièces
- [ ] Facturation automatique
- [ ] Multi-garage (SaaS)

### Améliorations Techniques
- [ ] Tests automatisés (Jest, Jasmine)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry, LogRocket)
- [ ] Cache Redis
- [ ] WebSockets pour temps réel
- [ ] PWA (Progressive Web App)

## Support et Maintenance

### Logs
- Backend : Console logs
- Frontend : Browser console
- Base de données : PostgreSQL logs

### Backup
- Backup automatique quotidien recommandé
- Script export-db.js pour backup manuel
- Rétention : 30 jours minimum

### Monitoring
- Uptime monitoring recommandé
- Alertes sur erreurs critiques
- Surveillance espace disque PostgreSQL

---

**Document Version** : 1.0.0  
**Dernière Mise à Jour** : 29 décembre 2024  
**Auteur** : Équipe Développement
