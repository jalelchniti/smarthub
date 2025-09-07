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
- **Déploiement**: Site statique prêt pour déploiement
- **Intégrations**: Formulaires Brevo + Contact WhatsApp

## 📄 Pages Disponibles

### Pages Principales
- **Accueil** (`/`) - Section héro avec présentation des services
- **Espaces** (`/rooms`) - Location d'espaces de travail (3 salles)
- **Enseignants** (`/teachers`) - Services et matières enseignées
- **Apprendre Plus** (`/learn-more`) - Programmes éducatifs détaillés

### Pages de Remerciement
- **Étudiant** (`/thank-you/student`) - Confirmation d'inscription étudiant
- **Enseignant** (`/thank-you/teacher`) - Confirmation d'inscription enseignant

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
- **Contact**: +216 99 730 144 | admin@u-smart.net
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

### Déploiement Statique
- **Dépôt**: https://github.com/jalelchniti/u-smart-net.git
- **Branche**: master

### Configuration Build
- **Output**: `dist/` directory
- **Assets**: `assets/` subdirectory

## 📋 Intégrations

### Formulaires Brevo
- **Collecte de Leads**: Formulaires étudiants et enseignants
- **Champs**: NOM, PRENOM, EMAIL, SMS (avec code pays)
- **Autorépondeurs**: Emails de bienvenue personnalisés
- **Redirection**: Pages de remerciement locales

### WhatsApp Business
- **Numéro**: +216 99 730 144
- **Integration**: Boutons d'appel à l'action sur toutes les pages
- **Messages Pré-remplis**: Contexte personnalisé selon la page

## 📁 Structure du Projet

```
src/
├── components/
│   ├── ui/                 # Composants UI réutilisables
│   ├── Navigation.tsx      # Navigation principale
│   ├── Footer.tsx          # Pied de page
│   ├── GoogleMapEmbed.tsx  # Carte Google Maps
│   ├── Student/TeacherTCA.tsx  # Boutons d'appel à l'action
│   └── Student/TeacherTCAForm.tsx  # Formulaires Brevo
├── pages/
│   ├── Home.tsx           # Page d'accueil
│   ├── Rooms.tsx          # Espaces de travail
│   ├── Teachers.tsx       # Services enseignants
│   └── LearnMore.tsx      # Programmes éducatifs
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

## 📖 Documentation

Voir `CLAUDE.md` pour les directives complètes de développement, les règles critiques, et les détails d'architecture.

## 🚦 Status Actuel

✅ **Application Statique Complète**
- 4 pages principales fonctionnelles
- Intégration Brevo pour collecte de leads
- Contact WhatsApp intégré
- Build de production optimisé
- Design responsive premium

❌ **Fonctionnalités Futures** (non implémentées)
- Backend API
- Système d'authentification
- Dashboards administrateur
- Fonctionnalités temps réel

---

**SmartHub** - Excellence Éducative au Centre-Ville de Tunis