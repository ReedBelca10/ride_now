# RideNow - Plateforme Premium de réservation de Véhicules

RideNow est une application web moderne et élégante permettant la location de véhicules premium et sportifs. Le projet est divisé en deux parties principales : un frontend React/Next.js et un backend NestJS.

## 🚀 Structure du Projet

```bash
.
├── backend/          # Backend NestJS (API REST, Prisma, Supabase)
├── frontend/         # Frontend Next.js (App Router, Framer Motion)
├── docs/             # Documentation technique (Architecture, Choix techniques)
└── README.md         # Ce fichier
```

## ✨ Fonctionnalités Principales

- **Catalogue de Véhicules**: Recherche dynamique, filtres avancés et design premium.
- **Espace Administrateur**: Gestion complète des utilisateurs, de la flotte et des statistiques.
- **Espace Manager**: Gestion opérationnelle des véhicules et analytics.
- **Espace Client**: Profil utilisateur et historique des réservations (à venir).
- **Design Moderne**: Interface responsive avec effets de glassmorphism et animations fluides.

## 🛠️ Stack Technologique

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/)
- **Style**: Tailwind CSS 4 & Vanilla CSS (Modules)
- **Animations**: Framer Motion
- **Icônes**: Lucide React

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Base de données**: PostgreSQL via [Neon](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Stockage d'images**: [Supabase Storage](https://supabase.com/storage)
- **Authentification**: JWT

## 📖 Documentation

Pour plus de détails, consultez les documents suivants dans le dossier `docs/` :
- [Architecture globale](docs/architecture.md)
- [Choix technologiques](docs/choix-techniques.md)

Chaque sous-projet possède également son propre README détaillé :
- [Documentation Backend](backend/README.md)
- [Documentation Frontend](frontend/README.md)

## 🛠️ Installation Rapide

1. **Backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env # Configurez vos variables
   npm run start:dev
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local # Configurez vos variables
   npm run dev
   ```

## 📄 Licence

Ce projet est sous licence privée.
