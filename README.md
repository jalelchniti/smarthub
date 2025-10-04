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
- **Base de données**: Firebase 10.7 Realtime Database (système de réservation)
- **Authentification**: Firebase Authentication (accès admin enterprise-grade)
- **Déploiement**: Site statique prêt pour tout hébergeur avec configurations serveur incluses
- **Intégrations**: Formulaires Brevo + Contact WhatsApp + Firebase

## 📄 Pages Disponibles

### Pages Principales
- **Accueil** (`/`) - Section héro avec présentation des services
- **Espaces** (`/rooms`) - Location d'espaces de travail (3 salles)
- **Enseignants** (`/teachers`) - Services et matières enseignées
- **Apprendre Plus** (`/learn-more`) - Programmes éducatifs détaillés
- **Système de Réservation** (`/booking`) - Réservation en temps réel des salles avec Firebase

### Pages Administrateur (Sécurisées)
- **Connexion Admin** (`/admin/firebase-login`) - Authentification Firebase enterprise
- **Dashboard Admin** (`/admin/firebase-bookings`) - Gestion sécurisée des réservations

### Pages Privées
- **Simulateur de Revenus** (`/simulation`) - Outil exclusif enseignants avec garantie de revenu minimum
- **Inscription Étudiant** (`/register/student`) - Formulaire complet d'inscription
- **Inscription Enseignant** (`/register/teacher`) - Formulaire complet d'inscription

### Pages de Remerciement
- **Étudiant** (`/thank-you/student`) - Confirmation d'inscription étudiant
- **Enseignant** (`/thank-you/teacher`) - Confirmation d'inscription enseignant

## 🎯 Fonctionnalités

### Fonctionnalités Principales
- **Localisation Française**: Contenu entièrement en français
- **Design Responsive**: Mobile-first avec effets premium glassmorphisme
- **Intégration WhatsApp**: Contact direct via +216 99 730 144
- **Formulaires Brevo**: Collecte de leads avec autorépondeurs email
- **Carte Interactive**: Localisation Google Maps intégrée
- **9 Matières**: Mathématiques, Physique, Français, Anglais, Sciences de la Vie et de la Terre, Arabe, Informatique, Économie & Gestion, ESP

### 🆕 Nouvelles Fonctionnalités (Décembre 2025 - Janvier 2025)
- **🛡️ Garantie de Revenu**: 12 TND/heure minimum pour enseignants avec remise automatique jusqu'à 35%
- **📊 Simulateur Intelligent**: Calcul en temps réel des revenus nets avec protection SmartHub
- **📅 Système de Réservation**: Réservation multi-utilisateur en temps réel via Firebase
- **🔐 Authentification Enterprise**: Firebase Authentication pour accès admin sécurisé
- **📧 Email de Protection**: Template démonstration de la politique de protection des revenus

## 🏢 Contexte Professionnel

**SmartHub - Facilité Éducative**
- **Adresse**: 13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis
- **Contact**: +216 99 730 144 | contact@smarthub.com.tn
- **Horaires**: Lun-Sam (9:00-13:00, 15:00-18:00), Dim (10:00-13:00)
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
- **Dépôt**: https://github.com/jalelchniti/smarthub.git
- **Branche**: master
- **Compatibilité**: Tous hébergeurs statiques (Netlify, Vercel, GitHub Pages, Apache, IIS)

### Configuration Build
- **Output**: `dist/` directory
- **Assets**: `assets/` subdirectory
- **Base Path**: Absolue (`/`) pour déploiement /smarthub/

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

### Firebase Integration
- **Système de Réservation**: Base de données temps réel pour réservations de salles
- **Authentification Admin**: Firebase Auth pour accès sécurisé (jalel.chniti@smarthub.com.tn, jalel.chniti@gmail.com)
- **Configuration CDN**: Utilisation des scripts CDN Firebase (pas d'installation npm requise)
- **Variables d'Environnement**: Configuration via fichier `.env` pour clés API et auth

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
│   ├── BookingSystem.tsx  # Système de réservation Firebase
│   ├── RevenueSimulator.tsx # Simulateur de revenus avec protection
│   ├── StudentRegistration.tsx # Formulaire d'inscription étudiant
│   ├── TeacherRegistration.tsx # Formulaire d'inscription enseignant
│   ├── StudentThankYou.tsx # Page de remerciement étudiant
│   ├── TeacherThankYou.tsx # Page de remerciement enseignant
│   ├── FirebaseAdminLogin.tsx # Connexion admin Firebase
│   └── FirebaseAdminBookings.tsx # Dashboard admin sécurisé
├── services/
│   ├── firebaseAuthService.ts    # Service d'authentification Firebase
│   ├── firebaseBookingService.ts # Service de réservation Firebase
│   └── adminAuthService.ts       # Service d'auth admin (legacy)
├── App.tsx                # Composant principal
└── main.tsx               # Point d'entrée

public/
├── images/               # Assets d'images
└── index.html           # Template HTML avec scripts Firebase CDN

docs/
└── mailing_Lists/        # Templates d'emails
    ├── Student/          # Autorépondeurs étudiants
    └── Teacher/          # Emails de protection revenus
```

## 🎨 Design System

- **Couleurs Principales**: Bleus (#3b82f6, #1e40af, #1e3a8a)
- **Couleurs Secondaires**: Violets (#8b5cf6, #7c3aed, #6d28d9)
- **Typographie**: Inter (Google Fonts)
- **Effets**: Gradients, glassmorphisme, animations hover
- **Alignement**: Centré par défaut (text-center global)

## 🚀 Améliorations Récentes (Décembre 2025)

### 🆕 Nouvelles Fonctionnalités Majeures
- **✅ Politique de Protection Revenus**: Garantie 12 TND/heure minimum pour enseignants
- **✅ Simulateur Avancé**: Calcul automatique avec remises SmartHub jusqu'à 35%
- **✅ Système de Réservation**: Firebase Realtime Database avec synchronisation temps réel
- **✅ Authentification Enterprise**: Firebase Auth pour admin avec sécurité Google (jalel.chniti@smarthub.com.tn, jalel.chniti@gmail.com)
- **✅ Email Marketing Enseignants**: Templates démonstration politique de protection
- **✅ Détection Intelligente**: Application automatique des remises selon revenus horaires
- **✅ Sécurité Renforcée**: Remplacement des mots de passe codés en dur par Firebase Auth
- **✅ Session Management**: Gestion automatique des tokens et état d'authentification

### Configuration Déploiement Production
- **✅ Types MIME**: Configuration correcte pour tous fichiers (.js, .css, .svg, .mjs)
- **✅ Routage SPA**: Gestion serveur des routes React Router
- **✅ Chargement Modules**: Optimisation ES modules
- **✅ Scripts Brevo**: Chargement optimisé avec React
- **✅ Chemins Assets**: Base path absolue pour déploiement /smarthub/
- **✅ Navigation React**: Utilisation useNavigate() pour SPA

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

✅ **Application Complète avec Fonctionnalités Avancées**
- **12 pages fonctionnelles** (incluant réservation, simulation et admin sécurisé)
- **Politique unique de protection**: 12 TND/heure minimum garanti
- **Système de réservation temps réel** via Firebase
- **Authentification admin enterprise** avec Firebase Auth
- **Simulateur de revenus intelligent** avec remises automatiques
- **Email marketing avancé** avec templates de protection revenus
- **Intégration Brevo complète** pour collecte de leads
- **Contact WhatsApp intégré** (+216 99 730 144)
- **Build de production optimisé** avec Vite 7.1
- **Design responsive premium** avec glassmorphisme
- **Configuration serveur multi-plateforme** (.htaccess, web.config)
- **Navigation React Router optimisée** avec useNavigate()
- **Tous les builds TypeScript et ESLint réussissent**

🎯 **Avantages Concurrentiels SmartHub**
- **Protection financière automatique** des enseignants
- **Transparence totale** des coûts et remises
- **Réservation en temps réel** multi-utilisateur
- **Calculs intelligents** tenant compte de la TVA tunisienne

❌ **Fonctionnalités Futures** (non implémentées)
- Backend API avec base de données relationnelle
- Notifications email automatiques via Brevo
- Système de paiement intégré
- Gestion avancée des utilisateurs avec rôles personnalisés

---

**SmartHub** - Excellence Éducative au Centre-Ville de Tunis