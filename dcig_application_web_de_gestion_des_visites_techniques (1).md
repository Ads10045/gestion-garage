# DCIG – Application Web de Gestion des Visites Techniques Automobile

## 1. Objectif du document
Ce document de conception générale et initiale (DCIG) décrit l’architecture, les fonctionnalités et les choix techniques d’une application web destinée à la gestion et à la consultation des visites techniques des véhicules.

L’application est conçue pour démarrer sur un PC standard (Windows, Linux ou macOS) et s’appuie sur une base de données PostgreSQL.

---

## 2. Objectifs de l’application

- Centraliser les informations clients, véhicules et visites techniques
- Permettre une recherche rapide par client ou par immatriculation
- Offrir une navigation simple et fluide entre les écrans
- Fournir un tableau de bord synthétique à l’accueil
- Garantir la fiabilité et la traçabilité des données

---

## 3. Périmètre fonctionnel

### 3.1 Écran d’accueil (Dashboard)

L’application démarre sur un tableau de bord contenant :

- Nombre total de clients
- Nombre total de véhicules
- Nombre total de visites techniques
- Dernières visites techniques enregistrées

---

### 3.2 Zone de recherche globale

Une zone de recherche est disponible en permanence sur l’écran principal.

#### Critères de recherche

1. **Client**
   - Nom (autocomplete)
   - Prénom (autocomplete)

2. **Véhicule**
   - Immatriculation composée de 3 champs :
     - XXXXX
     - XX
     - FFFFF

#### Comportement

- L’autocomplétion s’appuie sur les données existantes en base
- La recherche peut être effectuée par client ou directement par immatriculation

---

### 3.3 Résultat de recherche

#### Cas 1 : Client possédant plusieurs véhicules

- Affichage d’une liste de véhicules du client
- Chaque véhicule affiche :
  - Immatriculation
  - Marque
  - Modèle

#### Cas 2 : Client possédant un seul véhicule

- Accès direct à la fiche du véhicule

---

### 3.4 Fiche véhicule

Lors du clic sur un véhicule :

- Affichage des informations générales du véhicule
- Liste des visites techniques associées

Chaque visite affiche :
- Date de la visite
- Résultat (valide / non valide)
- Centre de visite

---

### 3.5 Détail d’une visite technique

Lors du clic sur une visite :

- Affichage complet des détails de la visite :
  - Date
  - Kilométrage
  - Résultat
  - Observations
  - Défauts constatés

#### Navigation

- Bouton « Précédent »
- Bouton « Suivant »
- Bouton « Retour à la liste des visites »

---

## 4. Architecture technique

### 4.0 Responsive & Résolutions supportées

L’application est entièrement **responsive** et conçue avec **TailwindCSS**.

Résolutions prises en charge dès le démarrage :

- Mobile : ≥ 360px
- Tablette : ≥ 768px
- Laptop : ≥ 1024px
- Desktop : ≥ 1280px
- Large écran : ≥ 1536px

Le layout s’adapte automatiquement grâce aux breakpoints Tailwind (`sm`, `md`, `lg`, `xl`, `2xl`).



### 4.1 Architecture globale

- Architecture 3 tiers :
  - Frontend
  - Backend
  - Base de données

---

### 4.2 Technologies proposées

#### Backend

- Java 17
- Spring Boot 3.x
- Spring MVC
- Spring Data JPA
- API REST

#### Frontend

- Angular 16+
- TypeScript
- HTML
- **TailwindCSS (obligatoire)**
- Design responsive (mobile, tablette, desktop)

#### Base de données

- PostgreSQL

---

## 5. Modèle de données (simplifié)

> L’interface utilisateur est conçue en **mobile-first** avec TailwindCSS, puis enrichie pour les écrans plus larges.



### Client

- id
- nom
- prenom
- telephone
- email

### Vehicule

- id
- immatriculation_part1
- immatriculation_part2
- immatriculation_part3
- marque
- modele
- client_id

### VisiteTechnique

- id
- date_visite
- kilometrage
- resultat
- observations
- vehicule_id

---

## 6. Sécurité et bonnes pratiques

- Validation des entrées utilisateur
- Gestion des erreurs côté backend
- Logs applicatifs
- Séparation claire des responsabilités

---

## 7. Évolutions possibles

- Authentification et gestion des rôles
- Export PDF des visites techniques
- Notifications (email)
- Statistiques avancées

---

# README – Application Web de Gestion des Visites Techniques

## 1. Description

Cette application web permet de rechercher des clients, leurs véhicules et de consulter l’historique des visites techniques associées.

---

## 2. Prérequis

- Java 17
- Node.js 18+
- PostgreSQL 14+
- Maven

---

## 3. Installation

### Base de données

1. Créer une base PostgreSQL
2. Configurer les paramètres de connexion dans `application.yml`

### Backend

```bash
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
npm install
npm start
```

---

## 4. Démarrage

- Backend : http://localhost:8080
- Frontend : http://localhost:4200

---

## 5. Utilisation

1. Accéder au dashboard
2. Utiliser la zone de recherche
3. Sélectionner un véhicule
4. Consulter les visites techniques

---

## 6. Licence

Projet interne – usage professionnel.

