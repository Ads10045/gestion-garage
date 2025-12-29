# Gestion Garage - Système de Gestion d'Atelier Automobile

Application complète de gestion d'atelier automobile avec backend Node.js et frontend Angular.

## 🚀 Fonctionnalités

### Gestion des Clients
- CRUD complet (Créer, Lire, Modifier, Supprimer)
- Recherche par nom, prénom, téléphone
- Affichage des véhicules associés
- Suppression en cascade (client → véhicules → fiches)

### Gestion des Véhicules
- Enregistrement des informations complètes (immatriculation, marque, modèle, etc.)
- Association automatique avec le client
- Historique des fiches techniques
- Suppression en cascade (véhicule → fiches)

### Fiches Techniques (Visites Techniques)
- Diagnostic complet avec date et heure
- État des composants (moteur, freins, suspension, électrique, carrosserie)
- Gestion des pannes identifiées
- Liste des pièces changées
- Calcul automatique des coûts (pièces + main d'œuvre)
- Statuts : En cours, Réparé, Non réparable, À revoir
- Gravité : Mineure, Majeure, Critique
- **Impression optimisée** : Design facture avec section signatures
- Suppression en cascade (fiche → pannes → pièces)

### Tableau de Bord
- Statistiques en temps réel (clients, véhicules, fiches)
- Liste des fiches récentes
- Navigation rapide

### Interface Utilisateur
- Design moderne et responsive
- Icônes claires pour toutes les actions
- Support multilingue (FR, EN, AR)
- Mode d'impression optimisé pour les fiches

## 🛠️ Technologies

### Backend
- **Node.js** avec Express.js
- **PostgreSQL** comme base de données
- **Sequelize** ORM
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **Swagger** pour la documentation API

### Frontend
- **Angular 18** (standalone components)
- **Tailwind CSS** pour le styling
- **ngx-translate** pour l'internationalisation
- **RxJS** pour la gestion réactive

## 📦 Installation

### Prérequis
- Node.js (v18+)
- PostgreSQL (v14+)
- npm ou yarn

### Backend

```bash
cd backend-nodejs
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL

# Créer la base de données
createdb visite_technique

# Démarrer le serveur
npm start
```

Le serveur backend démarre sur `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install

# Démarrer le serveur de développement
npm start
```

L'application frontend est accessible sur `http://localhost:4200`

## 🔧 Configuration

### Variables d'environnement (.env)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=visite_technique
DB_USER=postgres
DB_PASS=votre_mot_de_passe
JWT_SECRET=votre_secret_jwt
```

### Utilisateur par défaut

```
Username: admin
Password: admin
```

## 📊 Structure de la Base de Données

### Tables principales
- `client` - Informations clients
- `vehicule` - Informations véhicules
- `fiche_technique` - Fiches de diagnostic
- `fiche_panne` - Pannes identifiées
- `fiche_piece` - Pièces changées
- `users` - Utilisateurs du système

### Migrations récentes
- ✅ Migration DATE → TIMESTAMP WITH TIME ZONE (support date + heure)
- ✅ Nettoyage des tables Laravel inutilisées
- ✅ Backup automatique avant modifications

## 🎨 Fonctionnalités Récentes

### Version actuelle
- ✅ Support complet date + heure dans les fiches techniques
- ✅ Suppressions en cascade fonctionnelles
- ✅ Design facture pour l'impression des fiches
- ✅ Section signatures (mécanicien + client)
- ✅ Icônes épurées dans toute l'interface
- ✅ Affichage des véhicules associés dans la recherche
- ✅ Base de données nettoyée et optimisée

### Améliorations UI/UX
- Navigation par icônes claires
- Boutons d'action cohérents (modifier, supprimer, retour)
- Impression optimisée sur une page A4
- Tooltips sur tous les boutons
- Indicateurs d'état compacts (lignes colorées)

## 📝 Scripts Utiles

### Backend

```bash
# Export de la base de données
node export-db.js

# Nettoyage des tables inutilisées
node cleanup-db.js

# Migration des colonnes date
node migrate-dates.js

# Créer un utilisateur admin
node seed-user.js
```

### Backup

Un backup JSON est automatiquement créé avant toute opération de nettoyage :
- Format : `backup_YYYY-MM-DDTHH-MM-SS-MMMZ.json`
- Contient toutes les données de toutes les tables
- Dernier backup : `backup_2025-12-29T10-33-00-876Z.json`

## 🔒 Sécurité

- Authentification JWT
- Mots de passe hashés avec bcryptjs
- Protection CORS configurée
- Validation des données côté backend
- Suppression en cascade pour éviter les orphelins

## 📖 Documentation API

La documentation Swagger est disponible sur : `http://localhost:3000/api-docs`

### Endpoints principaux

```
POST   /api/auth/login          - Connexion
GET    /api/clients             - Liste des clients
POST   /api/clients             - Créer un client
GET    /api/clients/:id         - Détails d'un client
PUT    /api/clients/:id         - Modifier un client
DELETE /api/clients/:id         - Supprimer un client

GET    /api/vehicules           - Liste des véhicules
POST   /api/vehicules           - Créer un véhicule
GET    /api/vehicules/:id       - Détails d'un véhicule
PUT    /api/vehicules/:id       - Modifier un véhicule
DELETE /api/vehicules/:id       - Supprimer un véhicule

GET    /api/fiches              - Liste des fiches
POST   /api/fiches              - Créer une fiche
GET    /api/fiches/:id          - Détails d'une fiche
PUT    /api/fiches/:id          - Modifier une fiche
DELETE /api/fiches/:id          - Supprimer une fiche
GET    /api/fiches/recent       - Fiches récentes

GET    /api/stats               - Statistiques globales
```

## 🐛 Dépannage

### Le serveur backend ne démarre pas
- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les credentials dans le fichier `.env`
- Assurez-vous que la base de données existe

### Les dates n'affichent pas l'heure
- Vérifiez que la migration TIMESTAMP a été exécutée
- Les anciennes fiches afficheront 00:00 jusqu'à modification
- Les nouvelles fiches incluent automatiquement l'heure

### Erreur de suppression
- Les suppressions en cascade sont implémentées manuellement
- Redémarrez le serveur backend si nécessaire

## 📄 Licence

Ce projet est privé et destiné à un usage interne.

## 👥 Auteurs

Développé pour la gestion d'atelier automobile.

---

**Dernière mise à jour** : 29 décembre 2024
**Version** : 1.0.0
