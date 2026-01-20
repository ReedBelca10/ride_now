# RideNow - Backend

Le backend de RideNow est une API robuste et scalable construite avec **NestJS**, fournissant tous les services nécessaires pour la gestion d'une flotte de véhicules, les réservations et l'administration des utilisateurs.

## 🚀 Technologies

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Langage**: TypeScript
- **Base de données**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentification**: JWT (JSON Web Tokens) & Passport.js
- **Stockage d'images**: Supabase Storage
- **Emails**: Nodemailer

## 📋 Fonctionnalités

- **Gestion des Utilisateurs**: Inscription, connexion, profils et gestion des rôles (Admin, Manager, User).
- **Gestion de Flotte**: CRUD complet des véhicules, archivage/restauration et gestion des images.
- **Tableau de Bord Admin**: Statistiques détaillées, croissance des utilisateurs, revenus et analytics de réservation.
- **Tableau de Bord Manager**: Navigation simplifiée pour la gestion opérationnelle de la flotte.
- **Sécurité**: Routes protégées par rôles et hachage des mots de passe avec Bcrypt.

## 🛠️ Installation

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configuration des variables d'environnement** :
   Copiez le fichier `.env.example` vers `.env` et remplissez les informations nécessaires (Base de données, Supabase, JWT secret, etc.).
   ```bash
   cp .env.example .env
   ```

3. **Générer le client Prisma** :
   ```bash
   npx prisma generate
   ```

4. **Appliquer les migrations de base de données** :
   ```bash
   npx prisma migrate dev
   ```

## 🚀 Lancement

```bash
# Mode développement (avec watch mode)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e
```

## 🏗️ Structure du Projet

- `src/auth`: Logique d'authentification et gardes.
- `src/admin`: Endpoints et services pour le tableau de bord administratif.
- `src/vehicles`: Gestion des données et des images des véhicules.
- `src/users`: Gestion des profils et des données utilisateurs.
- `prisma/`: Schéma de la base de données et scripts de seed.

## 📄 Licence

Ce projet est sous licence privée.
