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

## Règles Métier Détaillées

### 1. Gestion des Clients

#### 1.1 Création de Client

**Champs Obligatoires** :
- `nom` : Nom de famille (string, non vide)
- `prenom` : Prénom (string, non vide)
- `telephone` : Numéro de téléphone (format: 06XXXXXXXX ou 07XXXXXXXX)
- `email` : Adresse email (format valide)

**Champs Optionnels** :
- `cin` : Carte d'identité nationale (unique si fourni)
- `adresse` : Adresse complète

**Validations** :
- Email : Format valide (regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
- Téléphone : 10 chiffres commençant par 06 ou 07
- CIN : Unique dans la base de données
- Nom/Prénom : Minimum 2 caractères

**Règles de Création** :
1. Vérifier l'unicité du CIN si fourni
2. Vérifier l'unicité de l'email
3. Normaliser le format du téléphone (supprimer espaces/tirets)
4. Capitaliser la première lettre du nom et prénom
5. Créer automatiquement les timestamps (createdAt, updatedAt)

#### 1.2 Modification de Client

**Autorisations** :
- Seuls les utilisateurs avec rôle `admin` peuvent modifier
- Impossible de modifier l'ID

**Champs Modifiables** :
- Tous les champs sauf `id`, `createdAt`
- `updatedAt` est mis à jour automatiquement

**Validations** :
- Mêmes validations que la création
- Si CIN modifié, vérifier l'unicité
- Si email modifié, vérifier l'unicité

**Règles Spéciales** :
- Si le client a des véhicules associés, afficher un avertissement
- Conserver l'historique des modifications (audit trail recommandé)

#### 1.3 Suppression de Client

**Autorisations** :
- Réservée aux administrateurs uniquement
- Confirmation obligatoire (double confirmation recommandée)

**Suppression en Cascade** :
1. Récupérer tous les véhicules du client
2. Pour chaque véhicule :
   - Récupérer toutes les fiches techniques
   - Pour chaque fiche :
     - Supprimer toutes les pannes associées (`fiche_panne`)
     - Supprimer toutes les pièces associées (`fiche_piece`)
     - Supprimer la fiche technique
   - Supprimer le véhicule
3. Supprimer le client

**Ordre de Suppression** :
```
Client
  └─ Véhicule 1
      └─ Fiche 1
          ├─ Pannes
          └─ Pièces
      └─ Fiche 2
          ├─ Pannes
          └─ Pièces
  └─ Véhicule 2
      └─ Fiche 3
          ├─ Pannes
          └─ Pièces
```

**Règles de Sécurité** :
- Transaction atomique (tout ou rien)
- Backup automatique recommandé avant suppression massive
- Log de l'opération avec user_id et timestamp

#### 1.4 Recherche de Client

**Critères de Recherche** :
- Nom (recherche partielle, insensible à la casse)
- Prénom (recherche partielle, insensible à la casse)
- Téléphone (recherche exacte ou partielle)
- Email (recherche partielle)
- CIN (recherche exacte)

**Pagination** :
- Taille par défaut : 10 éléments
- Taille maximum : 100 éléments
- Tri par défaut : `nom ASC, prenom ASC`

**Inclusions** :
- Liste des véhicules associés avec détails complets :
  - Immatriculation complète (3 parties)
  - Marque et modèle
  - Année de mise en circulation

### 2. Gestion des Véhicules

#### 2.1 Création de Véhicule

**Champs Obligatoires** :
- `immatriculationPart1` : 5 caractères alphanumériques
- `immatriculationPart2` : 1-2 caractères alphabétiques
- `immatriculationPart3` : 1-5 caractères alphanumériques
- `marque` : Marque du véhicule (string, non vide)
- `modele` : Modèle du véhicule (string, non vide)
- `client_id` : ID du client propriétaire (FK valide)

**Champs Optionnels** :
- `typeVehicule` : Type (Tourisme, Utilitaire, etc.)
- `anneeMiseCirculation` : Année (1900-année courante)
- `numeroChassis` : Numéro de châssis (unique si fourni)
- `carburant` : Type de carburant (Essence, Diesel, Électrique, Hybride)
- `kilometrageCompteur` : Kilométrage actuel (≥ 0)
- `puissanceFiscale` : Puissance fiscale (1-50 CV)
- `couleur` : Couleur du véhicule

**Validations** :
- Immatriculation : Format XXXXX-XX-XXXXX
  - Part1 : 5 caractères (chiffres ou lettres)
  - Part2 : 1-2 lettres
  - Part3 : 1-5 caractères (chiffres ou lettres)
- Année : Entre 1900 et année courante + 1
- Kilométrage : Nombre positif ou zéro
- Puissance fiscale : Entre 1 et 50
- Numéro châssis : Unique si fourni

**Règles de Création** :
1. Vérifier que le client existe
2. Vérifier l'unicité de l'immatriculation complète
3. Vérifier l'unicité du numéro de châssis si fourni
4. Normaliser l'immatriculation (majuscules)
5. Initialiser le kilométrage à 0 si non fourni
6. Créer automatiquement les timestamps

**Règles Métier Spécifiques** :
- Un véhicule ne peut avoir qu'un seul propriétaire
- L'immatriculation est immuable après création
- Le kilométrage ne peut que croître (validation lors des fiches)

#### 2.2 Modification de Véhicule

**Autorisations** :
- Seuls les administrateurs peuvent modifier
- Le propriétaire (client) ne peut pas être changé

**Champs Modifiables** :
- Tous sauf : `id`, `immatriculationPart1/2/3`, `client_id`, `createdAt`
- `updatedAt` est mis à jour automatiquement

**Validations** :
- Mêmes validations que la création
- Kilométrage : Ne peut pas diminuer par rapport à la dernière fiche
- Si numéro châssis modifié, vérifier l'unicité

**Règles Spéciales** :
- Si modification du kilométrage, vérifier cohérence avec fiches existantes
- Mise à jour automatique du kilométrage lors de création de fiche

#### 2.3 Suppression de Véhicule

**Autorisations** :
- Réservée aux administrateurs
- Confirmation obligatoire

**Suppression en Cascade** :
1. Récupérer toutes les fiches techniques du véhicule
2. Pour chaque fiche :
   - Supprimer toutes les pannes (`fiche_panne`)
   - Supprimer toutes les pièces (`fiche_piece`)
   - Supprimer la fiche technique
3. Supprimer le véhicule

**Règles de Sécurité** :
- Transaction atomique
- Vérifier que le véhicule existe
- Log de l'opération

#### 2.4 Recherche de Véhicule

**Critères de Recherche** :
- Immatriculation (recherche partielle sur chaque partie)
- Marque (recherche partielle, insensible à la casse)
- Modèle (recherche partielle, insensible à la casse)
- Client (par nom ou ID)

**Pagination** :
- Taille par défaut : 10 éléments
- Tri par défaut : `immatriculationPart1 ASC`

**Inclusions** :
- Informations du client propriétaire
- Historique des fiches techniques (optionnel)

### 3. Gestion des Fiches Techniques

#### 3.1 Création de Fiche Technique

**Champs Obligatoires** :
- `vehicule_id` : ID du véhicule (FK valide)
- `kilometrage` : Kilométrage au moment du diagnostic (≥ kilométrage précédent)
- `dateDiagnostic` : Date et heure du diagnostic (format ISO 8601)
- `gravite` : Niveau de gravité (MINEURE, MAJEURE, CRITIQUE)
- `reparable` : Booléen (true/false)
- `statut` : Statut de la fiche (EN_COURS, REPARE, NON_REPARABLE, A_REVOIR)
- États des composants :
  - `etatMoteur` : BON, MOYEN, MAUVAIS
  - `etatFreins` : BON, MOYEN, MAUVAIS
  - `etatSuspension` : BON, MOYEN, MAUVAIS
  - `etatElectrique` : BON, MOYEN, MAUVAIS
  - `etatCarrosserie` : BON, MOYEN, MAUVAIS
  - `etatGeneral` : BON, MOYEN, MAUVAIS

**Champs Optionnels** :
- `descriptionDiagnostic` : Description détaillée
- `pannes` : Liste des pannes identifiées (array de strings)
- `piecesChangees` : Liste des pièces changées (array de strings)
- `coutPieces` : Coût total des pièces (≥ 0)
- `coutMainOeuvre` : Coût de la main d'œuvre (≥ 0)
- `dureeReparationHeures` : Durée estimée en heures (≥ 0)
- `dateReparation` : Date de fin de réparation (si REPARE)
- `observationMecanicien` : Observations du mécanicien

**Valeurs par Défaut** :
- `dateDiagnostic` : Date et heure actuelles
- `gravite` : MINEURE
- `reparable` : true
- `statut` : EN_COURS
- Tous les états : BON
- `coutPieces` : 0
- `coutMainOeuvre` : 0
- `dureeReparationHeures` : 0

**Validations** :
- Véhicule existe et est actif
- Kilométrage ≥ dernier kilométrage enregistré pour ce véhicule
- Date diagnostic ≤ date actuelle (pas de diagnostic futur)
- Si dateReparation fournie : dateReparation ≥ dateDiagnostic
- Coûts : Nombres positifs ou zéro
- Durée : Nombre entier positif ou zéro
- Gravité : Valeur dans l'enum (MINEURE, MAJEURE, CRITIQUE)
- Statut : Valeur dans l'enum (EN_COURS, REPARE, NON_REPARABLE, A_REVOIR)
- États : Valeurs dans l'enum (BON, MOYEN, MAUVAIS)

**Règles de Création** :
1. Vérifier que le véhicule existe
2. Récupérer et copier les informations du véhicule :
   - Immatriculation (calculée depuis les 3 parties)
   - Marque
   - Modèle
   - Année de mise en circulation
3. Vérifier cohérence du kilométrage avec l'historique
4. Créer la fiche technique
5. Si pannes fournies, créer les entrées dans `fiche_panne`
6. Si pièces fournies, créer les entrées dans `fiche_piece`
7. Mettre à jour le kilométrage du véhicule si supérieur

**Règles Métier Spécifiques** :
- Si `gravite` = CRITIQUE → `reparable` devrait être évalué avec attention
- Si `etatGeneral` = MAUVAIS → `gravite` devrait être au moins MAJEURE
- Si `statut` = REPARE → `dateReparation` doit être fournie
- Si `statut` = NON_REPARABLE → `reparable` = false
- Coût total = `coutPieces` + `coutMainOeuvre`

**Liste des Pannes Prédéfinies** :
- PANNE_MOTEUR
- FUITE_HUILE
- USURE_FREINS
- PROBLEME_SUSPENSION
- DEFAUT_ELECTRIQUE
- CORROSION_CHASSIS
- PNEUMATIQUES_USES
- EMBRAYAGE_FATIGUE
- BATTERIE_FAIBLE
- SYSTEME_ECHAPPEMENT
- ECLAIRAGE_DEFECTUEUX
- DIRECTION_ASSISTEE
- REFROIDISSEMENT_MOTEUR
- FREIN_A_MAIN_FAIBLE

**Liste des Pièces Prédéfinies** :
- PLAQUETTES_FREIN
- DISQUES_FREIN
- FILTRE_HUILE
- FILTRE_AIR
- FILTRE_HABITACLE
- BOUGIES_ALLUMAGE
- KIT_DISTRIBUTION
- POMPE_A_EAU
- AMORTISSEURS_AV
- AMORTISSEURS_AR
- BATTERIE
- JOINTS_SPY
- COURROIE_ACCESSOIRE
- LIQUIDE_REFROIDISSEMENT
- LIQUIDE_FREIN
- HUILE_MOTEUR
- PNEUMATIQUES
- ESSUIE_GLACES

#### 3.2 Modification de Fiche Technique

**Autorisations** :
- Seuls les administrateurs peuvent modifier
- Modification possible tant que statut ≠ REPARE (recommandation)

**Champs Modifiables** :
- Tous sauf : `id`, `vehicule_id`, `createdAt`
- `updatedAt` est mis à jour automatiquement

**Validations** :
- Mêmes validations que la création
- Si modification du kilométrage : doit rester ≥ kilométrage précédent
- Si passage à statut REPARE : `dateReparation` obligatoire
- Si modification de `dateDiagnostic` : doit inclure date ET heure

**Règles Spéciales** :
- Modification des pannes : Supprimer anciennes + créer nouvelles
- Modification des pièces : Supprimer anciennes + créer nouvelles
- Si changement de statut vers REPARE :
  - Vérifier que `dateReparation` est fournie
  - `dateReparation` ≥ `dateDiagnostic`
  - Mettre à jour automatiquement si non fournie (date actuelle)

**Workflow de Statut** :
```
EN_COURS → REPARE (réparation terminée)
EN_COURS → NON_REPARABLE (véhicule irréparable)
EN_COURS → A_REVOIR (nécessite expertise supplémentaire)
A_REVOIR → EN_COURS (retour en réparation)
A_REVOIR → REPARE (réparation terminée)
A_REVOIR → NON_REPARABLE (confirmé irréparable)
```

#### 3.3 Suppression de Fiche Technique

**Autorisations** :
- Réservée aux administrateurs
- Confirmation obligatoire

**Suppression en Cascade** :
1. Supprimer toutes les pannes associées (`fiche_panne`)
2. Supprimer toutes les pièces associées (`fiche_piece`)
3. Supprimer la fiche technique

**Règles de Sécurité** :
- Transaction atomique
- Vérifier que la fiche existe
- Log de l'opération avec raison de suppression

**Restrictions** :
- Impossible de supprimer si statut = REPARE (recommandation)
- Archivage recommandé au lieu de suppression définitive

#### 3.4 Recherche de Fiche Technique

**Critères de Recherche** :
- Immatriculation du véhicule
- Statut (EN_COURS, REPARE, NON_REPARABLE, A_REVOIR)
- Gravité (MINEURE, MAJEURE, CRITIQUE)
- Période (date début - date fin)
- Client (par nom ou ID)

**Pagination** :
- Taille par défaut : 10 éléments
- Tri par défaut : `dateDiagnostic DESC` (plus récentes en premier)

**Inclusions** :
- Informations du véhicule
- Informations du client
- Liste des pannes
- Liste des pièces changées

#### 3.5 Impression de Fiche Technique

**Format** :
- Style facture professionnelle
- Optimisée pour A4 (210 x 297 mm)
- Une seule page si possible

**Sections Obligatoires** :
1. **En-tête** :
   - Logo/Nom du garage
   - Adresse et contact du garage
   - Numéro de fiche (FT-{id})
   - Date et heure du diagnostic

2. **Informations Véhicule** :
   - Immatriculation complète
   - Marque et modèle
   - Année de mise en circulation
   - Kilométrage au diagnostic

3. **Informations Client** :
   - Nom complet
   - Téléphone
   - Email (optionnel)

4. **Diagnostic** :
   - État des composants (indicateurs colorés)
   - Liste des pannes identifiées
   - Gravité et réparabilité

5. **Réparation** :
   - Liste des pièces changées
   - Coût pièces
   - Coût main d'œuvre
   - Coût total
   - Durée estimée

6. **Observations** :
   - Observations du mécanicien

7. **Signatures** :
   - Zone signature mécanicien (avec date)
   - Zone signature client (avec date)

8. **Pied de page** :
   - Mention légale
   - Numéro de page

**Règles d'Impression** :
- Couleurs préservées pour les indicateurs d'état
- Marges réduites (10mm)
- Police lisible (minimum 10pt)
- Pas de boutons d'action visibles
- Fond blanc pour économie d'encre

### 4. Règles de Cohérence Globales

#### 4.1 Intégrité Référentielle

**Contraintes de Clés Étrangères** :
- `vehicule.client_id` → `client.id` (CASCADE DELETE manuel)
- `fiche_technique.vehicule_id` → `vehicule.id` (CASCADE DELETE manuel)
- `fiche_panne.fiche_id` → `fiche_technique.id` (CASCADE DELETE manuel)
- `fiche_piece.fiche_id` → `fiche_technique.id` (CASCADE DELETE manuel)

**Règles** :
- Impossible de supprimer un client avec véhicules sans cascade
- Impossible de supprimer un véhicule avec fiches sans cascade
- Impossible de créer une fiche pour un véhicule inexistant
- Impossible de créer un véhicule pour un client inexistant

#### 4.2 Cohérence Temporelle

**Règles de Dates** :
- `dateDiagnostic` ≤ Date actuelle
- `dateReparation` ≥ `dateDiagnostic` (si fournie)
- `createdAt` ≤ `updatedAt`
- Fiches triées par `dateDiagnostic` DESC par défaut

**Règles de Kilométrage** :
- Kilométrage ne peut que croître pour un véhicule donné
- Kilométrage fiche ≥ Kilométrage véhicule
- Mise à jour automatique du kilométrage véhicule si fiche > véhicule

#### 4.3 Règles de Calcul

**Coût Total** :
```
coutTotal = coutPieces + coutMainOeuvre
```

**Durée Totale** :
```
dureeReparationHeures (entier, en heures)
```

**Immatriculation Complète** :
```
immatriculation = immatriculationPart1 + "-" + immatriculationPart2 + "-" + immatriculationPart3
Exemple: "12345-A-67"
```

#### 4.4 Règles de Sécurité et Audit

**Authentification** :
- JWT obligatoire pour toutes les routes sauf `/api/auth/login`
- Token expiré après 24h (configurable)
- Refresh token recommandé

**Autorisation** :
- Rôle `admin` : Toutes les opérations CRUD
- Rôle `user` : Lecture seule (recommandation)

**Audit Trail** :
- Log de toutes les opérations de suppression
- Log des modifications sensibles (changement de statut, coûts)
- Traçabilité : user_id, timestamp, action, entity_id

**Validation des Entrées** :
- Sanitisation de toutes les entrées utilisateur
- Protection contre injection SQL (via Sequelize ORM)
- Protection contre XSS (échappement HTML côté frontend)
- Limitation de taille des champs texte :
  - `descriptionDiagnostic` : 5000 caractères max
  - `observationMecanicien` : 5000 caractères max
  - Autres champs texte : 255 caractères max

### 5. Règles de Performance

**Pagination** :
- Toujours paginer les listes (max 100 éléments par page)
- Index sur colonnes de recherche fréquente :
  - `client.nom`, `client.prenom`, `client.telephone`
  - `vehicule.immatriculationPart1/2/3`
  - `fiche_technique.dateDiagnostic`, `fiche_technique.statut`

**Cache** :
- Statistiques globales : Cache 5 minutes
- Liste des pannes/pièces prédéfinies : Cache permanent

**Optimisations** :
- Eager loading des relations fréquentes (client → vehicules, vehicule → fiches)
- Lazy loading pour relations volumineuses
- Index composite sur recherches multi-critères



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
