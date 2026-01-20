# Choix Techniques - RideNow

Ce document présente les technologies choisies pour le projet RideNow et justifie leur utilisation.

## 🛠️ Stack Technologique

### NestJS (Backend)
- **Pourquoi ?** Modularité exemplaire, support natif de TypeScript, et architecture inspirée d'Angular facilitant la maintenance sur le long terme.
- **Avantage**: Gestion simplifiée des injections de dépendances et des intercepteurs pour la validation.

### Next.js 14 (Frontend)
- **Pourquoi ?** Le framework React le plus complet actuellement. L'App Router permet des performances optimales avec le Server-Side Rendering (SSR).
- **Avantage**: SEO optimisé nativement et temps de chargement réduit.

### Prisma (ORM)
- **Pourquoi ?** Offre une couche d'abstraction type-safe par-dessus PostgreSQL.
- **Avantage**: Moins d'erreurs SQL en production et migrations fluides.

### Supabase (Storage)
- **Pourquoi ?** Solution de stockage cloud simple à intégrer avec une API robuste pour la gestion des images.
- **Avantage**: Gestion des buckets, politiques de sécurité (RLS) et serveurs CDN intégrés.

### PostgreSQL via Neon
- **Pourquoi ?** Base de données relationnelle robuste avec des capacités serverless.
- **Avantage**: Mise à l'échelle automatique et branches de base de données pour le développement.

### Framer Motion
- **Pourquoi ?** Bibliothèque d'animations pour React permettant de créer des interfaces utilisateur "Premium" avec peu de code.
- **Avantage**: Animations fluides, transitions de pages et gestes intuitifs.

### Tailwind CSS 4 & Vanilla CSS
- **Pourquoi ?** Tailwind pour la rapidité de prototypage et Vanilla CSS (Modules) pour le contrôle total sur les designs spécifiques (glassmorphism, dégradés complexes).

## 🚀 Justifications des Principes

- **Modularité**: L'application est divisée en modules logiques pour permettre une extension facile (ex: ajout d'un système de messagerie ou de paiement).
- **Sécurité "Stateless"**: L'utilisation de JWT permet d'avoir un backend sans état, facilitant la mise à l'échelle.
- **Expérience Développeur (DX)**: TypeScript est utilisé partout pour minimiser les erreurs de runtime.
- **Aesthetics First**: Le choix des outils graphiques (Lucide, Framer Motion) reflète l'objectif du projet : offrir une expérience utilisateur haut de gamme.
