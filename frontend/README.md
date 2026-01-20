# RideNow - Frontend

Le frontend de RideNow est une application web moderne et élégante construite avec **Next.js**, offrant une expérience utilisateur fluide pour la location de véhicules premium.

## 🎨 Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Design & Styles**: Tailwind CSS 4 & Vanilla CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icônes**: [Lucide React](https://lucide.dev/)
- **Gestion d'état**: React Hooks & Context API
- **Authentification**: Intégration JWT personnalisée

## ✨ Fonctionnalités

- **Catalogue de Véhicules**: Recherche en temps réel, filtres par type et affichage en grille responsive.
- **Expérience Premium**: Design moderne avec effets de glassmorphism, dégradés et animations fluides.
- **Espace Client**: Gestion du profil, historique (simulé) et déconnexion sécurisée.
- **Tableaux de Bord**:
    - **Admin**: Statistiques globales, gestion complète des utilisateurs et de la flotte.
    - **Manager**: Gestion simplifiée des véhicules et analytics opérationnels.
- **Responsive**: Optimisé pour mobiles, tablettes et ordinateurs.

## 🛠️ Installation

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configuration des variables d'environnement** :
   Créez un fichier `.env.local` basé sur `.env.local.example` :
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

## 🚀 Lancement

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm run start
```

## 🏗️ Structure du Projet

- `src/app`: Routes de l'application (Pages, Layouts).
- `src/components`: Composants UI réutilisables.
- `src/lib`: Services API, utilitaires et contexte d'authentification.
- `src/assets`: Images et ressources statiques.
- `public/`: Fichiers publics accessibles directement.

## 📄 Licence

Ce projet est sous licence privée.
