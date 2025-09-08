# SmartHub - Espaces d'Apprentissage & Enseignants Experts

SmartHub est une vitrine web statique construite avec React + TypeScript + Vite, présentant une facilité éducative professionnelle située au centre-ville de Tunis. La plateforme met en valeur les services éducatifs, la location d'espaces de travail, et facilite la connection entre enseignants compétents et étudiants sérieux.

## 🚀 Démarrage Rapide

```bash
npm install
npm run dev
```
Visitez `http://localhost:5173`

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript 5.8 + Vite 7.1
- **Styling**: Tailwind CSS 3.4 avec thème personnalisé
- **Routage**: React Router DOM 7.8
- **Icons**: Lucide React
- **Déploiement**: Site statique prêt pour tout hébergeur avec configurations serveur incluses
- **Intégrations**: Formulaires Brevo + Contact WhatsApp

## 📄 Pages Disponibles

### Pages Principales
- **Accueil** (`/`) - Section héro avec présentation des services
- **Espaces** (`/rooms`) - Location d'espaces de travail (3 salles)
- **Enseignants** (`/teachers`) - Services et matières enseignées
- **Apprendre Plus** (`/learn-more`) - Programmes éducatifs détaillés

### Pages de Remerciement
- **Étudiant** (`/thank-you/student`) - Confirmation d'inscription étudiant avec navigation React Router
- **Enseignant** (`/thank-you/teacher`) - Confirmation d'inscription enseignant avec navigation React Router

## 🎯 Fonctionnalités

- **Localisation Française**: Contenu entièrement en français
- **Design Responsive**: Mobile-first avec effets premium glassmorphisme
- **Intégration WhatsApp**: Contact direct via +216 99 730 144
- **Formulaires Brevo**: Collecte de leads avec autorépondeurs email
- **Carte Interactive**: Localisation Google Maps intégrée
- **9 Matières**: Mathématiques, Physique, Français, Anglais, Sciences Naturelles, Arabe, Informatique, Économie & Gestion, ESP

## 🏢 Contexte Professionnel

**SmartHub - Facilité Éducative**
- **Adresse**: 13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis
- **Contact**: +216 99 730 144 | souad.dkhili@u-smart.net
- **Horaires**: Lun-Ven (8:00-20:00), Sam (9:00-13:00, 15:00-18:00)
- **Services**: Location d'espaces de travail pour enseignants, services éducatifs en présentiel

## 🛠️ Commandes de Développement

```bash
# Développement
npm run dev          # Serveur de développement (port 5173)
npm run build        # Build de production
npm run lint         # Vérification qualité du code
npm run preview      # Aperçu du build de production
```

## 🌐 Déploiement

### Déploiement Statique Universel
- **Dépôt**: https://github.com/jalelchniti/u-smart-net.git
- **Branche**: master
- **Compatibilité**: Tous hébergeurs statiques (Netlify, Vercel, GitHub Pages, Apache, IIS)

### Configuration Build
- **Output**: `dist/` directory
- **Assets**: `assets/` subdirectory
- **Base Path**: Relatif (`./`) pour compatibilité universelle

### Configurations Serveur Incluses
- **Apache**: `.htaccess` avec routage SPA et types MIME
- **IIS**: `web.config` avec réécriture URL et compression
- **Résolution Issues**: MIME types, chargement modules, conflits scripts

## 📋 Intégrations

### Formulaires Brevo
- **Collecte de Leads**: Formulaires étudiants et enseignants
- **Champs**: NOM, PRENOM, EMAIL, SMS (avec code pays)
- **Autorépondeurs**: Emails de bienvenue personnalisés
- **Navigation**: Pages de remerciement locales avec React Router (useNavigate)

### WhatsApp Business
- **Numéro**: +216 99 730 144
- **Integration**: Boutons d'appel à l'action sur toutes les pages
- **Messages Pré-remplis**: Contexte personnalisé selon la page

## 📁 Structure du Projet

```
src/
├── components/
│   ├── ui/                 # Composants UI réutilisables
│   │   ├── Button.tsx          # Bouton réutilisable
│   │   ├── Card.tsx            # Composant carte
│   │   ├── Input.tsx           # Champ de saisie
│   │   ├── StudentRegistration.tsx  # Formulaire étudiant simplifié (3 champs)
│   │   └── TeacherRegistration.tsx  # Formulaire enseignant simplifié (3 champs)
│   ├── Navigation.tsx      # Navigation principale
│   ├── Footer.tsx          # Pied de page
│   ├── GoogleMapEmbed.tsx  # Carte Google Maps
│   ├── StudentTCA.tsx      # Boutons d'appel à l'action étudiant
│   └── TeacherTCA.tsx      # Boutons d'appel à l'action enseignant
├── pages/
│   ├── Home.tsx           # Page d'accueil
│   ├── Rooms.tsx          # Espaces de travail
│   ├── Teachers.tsx       # Services enseignants
│   ├── LearnMore.tsx      # Programmes éducatifs
│   ├── StudentThankYou.tsx # Page de remerciement étudiant
│   └── TeacherThankYou.tsx # Page de remerciement enseignant
├── App.tsx                # Composant principal
└── main.tsx               # Point d'entrée

public/
├── images/               # Assets d'images
└── index.html           # Template HTML
```

## 🎨 Design System

- **Couleurs Principales**: Bleus (#3b82f6, #1e40af, #1e3a8a)
- **Couleurs Secondaires**: Violets (#8b5cf6, #7c3aed, #6d28d9)
- **Typographie**: Inter (Google Fonts)
- **Effets**: Gradients, glassmorphisme, animations hover
- **Alignement**: Centré par défaut (text-center global)

## 🚀 Améliorations Récentes (Sept 2025)

### Résolution Complète des Problèmes de Déploiement
- **✅ Types MIME**: Configuration correcte pour tous fichiers (.js, .css, .svg, .mjs)
- **✅ Routage SPA**: Gestion serveur des routes React Router
- **✅ Chargement Modules**: Résolution conflits ES modules
- **✅ Scripts Brevo**: Chargement optimisé sans conflit avec React
- **✅ Chemins Assets**: Base path relative pour compatibilité universelle
- **✅ Navigation React**: Replacement window.location.href par useNavigate() pour SPA

### Configuration Multi-Plateforme
- **Apache**: `.htaccess` avec compression, sécurité, cache
- **IIS**: `web.config` avec réécriture URL, types MIME, compression
- **Hébergement Statique**: Compatible Netlify, Vercel, GitHub Pages
- **CDN/Storage**: Support AWS S3, Google Cloud, Azure Storage

### Optimisations Techniques
- **Vite 7.1**: Configuration rollup optimisée pour production
- **Build Assets**: Organisation structurée avec hash pour cache
- **Sécurité**: Headers X-Frame-Options, X-Content-Type-Options
- **Performance**: Compression gzip, cache statique optimisé

## 📖 Documentation

Voir `CLAUDE.md` pour les directives complètes de développement, les règles critiques, et les détails d'architecture.

## 🚦 Status Actuel

✅ **Application Statique Complète & Optimisée**
- 4 pages principales fonctionnelles
- Intégration Brevo complète et fonctionnelle pour collecte de leads
- Formulaires d'inscription simplifiés (3 champs: NOM, PRENOM, EMAIL)
- Contact WhatsApp intégré (+216 99 730 144)
- Build de production optimisé avec Vite 7.1
- Design responsive premium avec glassmorphisme
- Configuration serveur multi-plateforme (.htaccess, web.config)
- Résolution complète des problèmes de déploiement
- Hébergement-agnostique prêt pour production
- Navigation React Router avec useNavigate() optimisée
- Tous les builds TypeScript et ESLint réussissent

❌ **Fonctionnalités Futures** (non implémentées)
- Backend API
- Système d'authentification
- Dashboards administrateur
- Fonctionnalités temps réel

---

**SmartHub** - Excellence Éducative au Centre-Ville de Tunis