# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartHub is a French-language training and tutoring center in Tunis, Tunisia. Built with React 19 + TypeScript 5.8 + Vite 7.1, it serves as the primary platform for educational services including academic tutoring, exam preparation, professional training, and teacher training programs. The facility also offers classroom rentals as a complementary service.

**Business Focus (Updated Oct 2025)**:
- **80% Training & Tutoring**: Academic support, exam preparation, professional training, teacher training
- **20% Classroom Rentals**: Complementary service for independent teachers

**Business Context**: Operated by ELMAOUIA ET.CO (SARL), the facility is located at 13 Rue de Belgique, Tunis (+216 99 730 144, contact@smarthub.com.tn).

## Essential Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start BOTH backend + frontend servers (http://localhost:5174 + http://localhost:3001)
npm run dev:client   # Start frontend only (Vite dev server)
npm run server       # Start backend only (Express API server)
npm run build        # TypeScript compilation + production build (outputs to dist/)
npm run lint         # Run ESLint checks
npm run preview      # Preview production build locally

# Production Deployment (Without Admin Section)
npx vite build       # Build for production (skips TypeScript errors, excludes admin)
                     # See DEPLOYMENT_GUIDE.md for complete FTP upload instructions
cp src/App.backup.tsx src/App.tsx  # Restore admin after deployment

# Testing the build
npm run build && npm run preview  # Verify production build works
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 19, TypeScript 5.8, React Router DOM 7.8
- **Backend**: Node.js + Express 5.1 (API server on port 3001)
- **Styling**: Tailwind CSS 3.4 with custom theme (blue/purple gradients, glassmorphism effects)
- **Icons**: Lucide React
- **Data Storage**: Backend API writes to JSON files in project (`src/data/admin-data.json`)
- **Build Tool**: Vite 7.1
- **Deployment**: Static hosting on OVH via FTP (credentials in .env)
- **Dev Tools**: Nodemon (backend auto-reload), Concurrently (run both servers)
- **Note**: Firebase integration was removed in favor of the Express backend system

### Admin System Data Storage (UPDATED - Backend API)
- **Storage Method**: Backend Express API writes to JSON file (`src/data/admin-data.json`)
- **API Base URL**: http://localhost:3001/api
- **Backend Server**: `server/index.js` - Express API with CRUD endpoints
- **Storage Utility**: `src/utils/adminDataStorage.ts` - Frontend API client (async fetch)
- **Data Structure**: Single AdminData object containing all entities (rooms, teachers, students, groups, bookings, payments)
- **Automatic Backups**: Created in `src/data/backups/` on every save
- **Version Control**: Built-in versioning system for data migration
- **Backup/Export**: Download/upload JSON files via API endpoints
- **TypeScript Types**: Full type definitions in `src/types/admin.types.ts`
- **Benefits**: Permanent storage, Git version control, multi-computer access

### Application Structure

**Route Architecture** (`src/App.tsx`):
- Public routes with Navigation/Footer wrapper
- Private routes without wrapper (registration forms, thank you pages)
- **Admin routes** (localStorage authentication required)
- Hidden routes (revenue simulator at `/simulation`)

**Public Pages**:
- `/` - Home page showcasing training programs (Updated Oct 5, 2025 - Phase 1 Complete)
- `/formations` - Main training programs page (Coming in Phase 2)
- `/rooms` - 3 classroom rentals with updated pricing structure (HT/TTC display, 20% discount for independent teachers)
- `/teachers` - Teacher services and training programs
- `/learn-more` - Detailed educational programs
- `/simulation` - Private teacher revenue calculator (12 TND/hour minimum guarantee)
- `/parentsimulator` - Parent cost calculator
- `/our-mission` - Mission statement page

**Admin System Pages** (UPDATED):
- `/admin/login` - Admin authentication page (authentication disabled - free access)
- `/admin` - Dashboard with overview metrics
- `/admin/bookings` - **✅ IMPLEMENTED** - Full booking management with CRUD operations
- `/admin/students` - **✅ IMPLEMENTED** - Student enrollment management with complete registration forms
- `/admin/student-payments` - **✅ IMPLEMENTED** - Student payment tracking with invoice generation
- `/admin/data-preview` - **✅ IMPLEMENTED** - Comprehensive data preview with advanced filtering and export
- `/admin/room-status` - Real-time room status viewer (placeholder - Phase 2)
- `/admin/working-hours` - Working hours configuration (placeholder - Phase 3)
- `/admin/teachers` - Teacher management (placeholder - Phase 4)
- `/admin/teacher-payments` - Teacher payment processing (placeholder - Phase 6)
- `/admin/reports` - Financial reports and analytics (placeholder - Phase 7)

**Core Utilities**:
- `server/index.js` - Express backend API server (port 3001)
- `src/utils/adminDataStorage.ts` - Frontend API client for backend communication
- `src/utils/secureBookingStorage.ts` - Legacy booking storage (public booking system)
- `src/contexts/AuthContext.tsx` - Admin authentication context (currently bypassed)
- `src/types/admin.types.ts` - TypeScript interfaces for all admin data models
- `src/pages/admin/Bookings.tsx` - Full booking management module
- `src/pages/admin/Students.tsx` - Student enrollment management module
- `src/pages/admin/StudentPayments.tsx` - Student payment tracking module
- `src/pages/admin/DataPreview.tsx` - Data preview and export module with advanced filtering
- `src/components/admin/AdminLayout.tsx` - Admin layout with sidebar and top bar navigation (Accueil Admin + Aperçu des Données)
- `src/components/admin/AdminSidebar.tsx` - Admin navigation sidebar

### Design System

**Colors** (defined in `tailwind.config.js`):
- Primary: Blue shades (#3b82f6, #2563eb, #1d4ed8, #1e3a8a)
- Secondary: Purple shades (#8b5cf6, #7c3aed)
- Background: Gradient from slate-50 to blue-50

**Typography**: Inter font (Google Fonts)
**Visual Effects**: Gradients, glassmorphism, hover animations, pulse effects with delays
**Layout**: Centered text alignment by default (text-center global)

### Critical Business Logic

**Teacher Revenue Protection Policy**:
- SmartHub guarantees teachers minimum 12 TND/hour
- Automatic discount calculation (up to 35%) when teacher rates exceed minimum
- Parent pays full teacher rate, SmartHub subsidizes difference
- Implementation in `src/pages/RevenueSimulator.tsx`
- TVA (VAT) = 19% applied to all teacher revenue calculations

**Room Rental Pricing Policy (Updated Oct 2025)**:
- All room prices displayed as HT (tax excluded) and TTC (tax included)
- TVA (VAT) = 7% applied to all room rental prices
- 20% discount for independent teachers bringing their own students
- SmartHub fees include: Space rental + Student management (attendance, discipline, payment tracking)

**9 Subjects Offered**:
1. Mathématiques
2. Physique
3. Français
4. Anglais
5. Sciences de la Vie et de la Terre
6. Arabe
7. Informatique
8. Économie & Gestion
9. ESP (Éducation Scientifique Physique)

## Integration Points

### Brevo Forms (Lead Collection)
- Student registration: Collects NOM, PRENOM, EMAIL, SMS (with country code)
- Teacher registration: Same fields
- Autoresponder emails configured in Brevo
- Navigation after submission: Use React Router's `useNavigate()` to `/thank-you/student` or `/thank-you/teacher`
- **Never use** `window.location.href` for internal navigation (breaks SPA)

### WhatsApp Integration
- Business number: +216 99 456 059
- Pre-filled messages customized per page context
- CTA buttons on all public pages

### Admin Authentication System
- **Status**: CURRENTLY DISABLED - Free access to all admin pages
- **Method**: Simple localStorage-based authentication (available but bypassed)
- **Default User**: jalel.chniti@smarthub.com.tn (configured in `admin-data.json`)
- **Password**: Stored as simple hash (demo - NOT production-grade)
- **Protection**: `ProtectedRoute` component removed from routes - direct access enabled
- **Role-Based Access**: Manager, Staff, Accountant roles defined but not enforced
- **Context**: `AuthContext` provides authentication state (currently unused)
- **Note**: Authentication can be re-enabled by wrapping admin routes with `ProtectedRoute` component

## Deployment Configuration

### Build Output
- Directory: `dist/`
- Assets subdirectory: `assets/`
- Base path: `/` (absolute paths for deployment)

### Server Configurations Included
- **Apache**: `.htaccess` with SPA routing, MIME types, compression
- **IIS**: `web.config` with URL rewriting, compression
- **Static hosts**: Works with Netlify, Vercel, GitHub Pages

### OVH FTP Deployment
- Credentials in `.env` file
- Target folder: `./smarthub`
- Login: fohaixl-webmaster
- Server: ftp.cluster100.hosting.ovh.net

### Production Build Process (Without Admin Section)

**Important**: The production deployment excludes all admin functionality for security. Only public pages are deployed to OVH.

**Step-by-step process**:

1. **Create production App.tsx** (without admin routes):
   ```bash
   # Original App.tsx is backed up automatically to src/App.backup.tsx
   # Production version removes all admin imports and routes
   ```

2. **Build for production**:
   ```bash
   npx vite build  # Skips TypeScript errors, builds only
   ```
   - Output: `dist/` folder (~460 KB + 5.5 MB images)
   - Admin code excluded from bundle
   - All public routes functional

3. **Restore development version**:
   ```bash
   cp src/App.backup.tsx src/App.tsx  # Restore admin functionality
   ```

4. **Upload to OVH via FTP**:
   - See `DEPLOYMENT_GUIDE.md` for complete file list
   - Upload `dist/` contents to `/smarthub/` on OVH server
   - Ensure `.htaccess` is uploaded (critical for routing)

**Files excluded from production**:
- `src/pages/admin/**` - All admin pages
- `src/components/admin/**` - All admin components
- `src/contexts/AuthContext.tsx` - Authentication
- `src/utils/adminDataStorage.ts` - Admin data API
- `src/types/admin.types.ts` - Admin types
- `src/data/**` - Admin data files
- `server/**` - Express backend (local only)

**Key files**:
- `src/App.backup.tsx` - Development version with admin (restore anytime)
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions with file list

**Local development**: Admin system always available at `http://localhost:5176/admin` after restoring App.backup.tsx

## Development Guidelines

### Admin System Development
1. **Data Operations**: Always use `await AdminDataStorage.load()` and `await AdminDataStorage.save()` - Both are async
2. **Backend Requirement**: Ensure backend server is running (`npm run server` or `npm run dev`)
3. **API Endpoints**: All data operations go through Express API at http://localhost:3001/api
4. **React Hook**: Use `useAdminData()` hook in components for reactive data updates with async loading
5. **Authentication**: Currently disabled - all admin routes have free access
6. **Type Safety**: Import types from `src/types/admin.types.ts` for all admin data
7. **Versioning**: Data structure version is in `admin-data.json` - update when schema changes
8. **Loading States**: Always handle loading states with spinners when using async data operations
9. **Error Handling**: Backend errors are displayed to user via alert() - check browser console for details

### Component Patterns
- Use React Router's `useNavigate()` for all internal navigation
- Handle loading states with loading indicators
- Brevo form submissions should navigate to thank you pages after success
- All monetary calculations must include 19% TVA
- Use Tailwind classes for styling (avoid inline styles)
- Admin components use `AdminLayout` wrapper with sidebar navigation

### TypeScript Best Practices
- Strict mode enabled (`tsconfig.app.json`)
- Interface definitions in `src/types/admin.types.ts` for all data models
- Type-safe environment variable access via `import.meta.env`
- Use discriminated unions for status fields (e.g., `'active' | 'inactive'`)

### State Management
- No external state library (React hooks only)
- Admin auth state managed by `AuthContext` provider (currently bypassed)
- Admin data managed by async API calls to Express backend
- All admin components use local state with `useState` and `useEffect` for data loading
- Public booking data uses `secureBookingStorage.ts` (legacy system)

## Common Issues & Solutions

**Backend not connecting**: Ensure Express server is running on port 3001 (`npm run server` or `npm run dev`)
**Data not persisting**: Check if backend server is running and `admin-data.json` file has write permissions
**"Cannot read properties of null"**: Component tried to access data before it loaded - add loading state check
**Admin pages show loading forever**: Backend server not running - start with `npm run server`
**CORS errors**: Backend has CORS enabled for all origins - check if API_BASE_URL in adminDataStorage.ts is correct
**Port conflicts**: Frontend uses 5174, backend uses 3001 - change in vite.config.ts or server/index.js if needed
**Build fails**: Run `npm run build` - check TypeScript errors first
**MIME type errors in production**: Ensure `.htaccess` or `web.config` properly configured
**Brevo forms not working**: Verify form IDs match Brevo console configuration
**Routes not working after deploy**: Ensure server-side rewrite rules direct all routes to `index.html`

## Important Files to Check

- `.env` - Contains deployment credentials (never commit)
- `index.html` - Brevo integration scripts
- `src/App.tsx` - Route definitions and layout structure (includes admin routes)
- `src/App.backup.tsx` - Development version backup with admin routes (restore anytime)
- `server/index.js` - Express backend API server with all endpoints
- `src/data/admin-data.json` - Main data file (written by backend API)
- `src/data/backups/` - Automatic backups created on every save
- `src/utils/adminDataStorage.ts` - Frontend API client for backend communication
- `src/contexts/AuthContext.tsx` - Authentication logic (currently bypassed)
- `src/types/admin.types.ts` - TypeScript interfaces for all data models
- `src/pages/admin/Bookings.tsx` - Booking management module implementation
- `src/pages/admin/Students.tsx` - Student management module implementation
- `src/pages/admin/StudentPayments.tsx` - Payment tracking module implementation
- `src/pages/admin/DataPreview.tsx` - Data preview and export module implementation
- `src/components/admin/AdminLayout.tsx` - Admin layout with top bar navigation (Accueil Admin + Aperçu des Données)
- `src/components/admin/AdminSidebar.tsx` - Admin sidebar navigation (includes Data Preview link)
- `vite.config.ts` - Build configuration for production
- `tailwind.config.js` - Theme customization
- `package.json` - Scripts updated for concurrent frontend/backend servers
- `DEPLOYMENT_GUIDE.md` - Complete FTP deployment guide with file list (Updated Oct 5, 2025)
- `BACKEND_SETUP.md` - Detailed backend architecture documentation
- `docs/elmaouia_business_model.md` - Business context and financial model

## Multi-language Support

**Primary Language**: French (all UI text)
**Target Audience**: Tunisian students, teachers, and parents
**Currency**: TND (Tunisian Dinar)
**Contact Hours**: Tunisian business hours (Mon-Sat 9:00-18:00, Sun 10:00-13:00)

## Git Repository

- **Remote**: https://github.com/jalelchniti/smarthub.git
- **Branch**: main (primary deployment branch)
- **Deployment flow**: Commit → Push → FTP upload to OVH

## Security Considerations

- **Admin Authentication**: Simple localStorage-based (DEMO only - NOT production-grade)
- **Password Storage**: Base64 hashing only (use bcrypt/argon2 in production)
- **Session Management**: localStorage tokens (vulnerable to XSS - use httpOnly cookies in production)
- **Data Storage**: Browser localStorage (can be inspected - use server-side database in production)
- **Production Recommendations**:
  - Implement proper backend authentication (JWT, OAuth)
  - Use HTTPS for all admin routes
  - Add rate limiting for login attempts
  - Implement CSRF protection
  - Use secure password hashing (bcrypt, argon2)
  - Move data to server-side database with proper access controls
- No sensitive credentials in repository (`.env` in `.gitignore`)
- OVH deployment credentials stored only in `.env` file

## Admin System Implementation Status

**✅ Phase 0: Foundation (COMPLETED - Oct 3, 2025)**
- Express backend API server with CRUD endpoints
- JSON data storage in project files (permanent, version-controlled)
- TypeScript type definitions for all data models
- localStorage-based authentication system (currently bypassed)
- Admin layout with sidebar navigation + top bar navigation (Accueil Admin + Aperçu des Données)
- Free access to all admin routes (no login required)
- Admin dashboard with overview metrics
- Automatic backup system for data safety

**✅ Phase 1: Room Booking System (COMPLETED - Oct 3, 2025)**
- Full CRUD operations (Create, Read, Update, Delete)
- Room selection dropdown (3 rooms available)
- Group selection with teacher auto-assignment
- Date and time picker with duration calculation
- Status management: Confirmé, Terminé, Annulé
- Search by room, group, teacher, notes
- Filter by status and date
- Real-time data persistence via backend API
- Mock data: 1 booking created for G1 group

**✅ Phase 4: Student Management (COMPLETED - Oct 3, 2025)**
- Full student enrollment system with comprehensive registration form
- Student information: Name, DOB, CIN, Email, Phone, Address
- Parent/Guardian information: Name, Relationship, Phone, Email
- Emergency contact information
- CRUD operations with status management (Actif, Inactif, Diplômé, Retiré)
- Search by name, email, phone, CIN, parent name
- Filter by status
- Mock data: 3 students created (Yasmine, Omar, Mariem)
- All enrolled in G1 - Mathématiques Bac group

**✅ Phase 5: Student Payment Tracking (COMPLETED - Oct 3, 2025)**
- Payment registration with auto-generated invoice numbers (INV-YYYY-MM-XXX)
- Student selection from active students
- Amount input with TND currency
- Payment date picker
- Period covered field (e.g., "Octobre 2025")
- Payment methods: Espèces, Chèque, Virement Bancaire, Paiement Mobile
- Status management: Payé, Paiement Partiel, En Attente
- Dashboard statistics: Total, Paid, Pending amounts
- Search by student, invoice, period, amount
- Filter by status and month
- CRUD operations with real-time updates

**✅ Data Preview & Export Module (COMPLETED - Oct 3, 2025)**
- Comprehensive data visualization for all system entities
- Advanced filtering by data type: All, Students, Teachers, Groups, Bookings, Student Payments
- Search functionality across all fields (names, emails, phones, subjects, invoices)
- Date range filters: Today, 7 days, 30 days, 1 year, custom date range
- Statistics dashboard showing total counts per entity type
- Collapsible filter panel for cleaner interface
- Export filtered data as JSON with timestamped filenames
- Responsive tables with color-coded status badges
- Accessible from sidebar navigation and top bar (Aperçu des Données button)
- Real-time data refresh functionality

**⏳ Phase 2: Room Status Viewer (PENDING)**
- Module placeholder created at `/admin/room-status`
- Real-time room availability display needed

**⏳ Phase 3: Working Hours Configuration (PENDING)**
- Module placeholder created at `/admin/working-hours`
- Schedule configuration needed

**⏳ Phase 4: Teacher Management (PENDING - Partially Implemented)**
- Mock data: 3 teachers created (Ahmed Ben Salah, Fatma Trabelsi, Mohamed Gharbi)
- Module placeholder exists at `/admin/teachers`
- Full CRUD interface not yet implemented

**⏳ Phase 6: Teacher Payment Processing (PENDING)**
- Module placeholder created at `/admin/teacher-payments`
- Payment calculation and processing needed

**⏳ Phase 7: Financial Reports (PENDING)**
- Module placeholder created at `/admin/reports`
- Analytics and reporting features needed

## Mock Data Available

**Teachers (3):**
1. Ahmed Ben Salah - Mathématiques, Physique (40 TND/h)
2. Fatma Trabelsi - Français, Anglais (35 TND/h)
3. Mohamed Gharbi - Informatique (40 TND/h)

**Students (3):**
1. Yasmine Jebali - Bac Mathématiques
2. Omar Hamdi - Needs math support
3. Mariem Khedri - Bac Sciences (excellent student)

**Groups (1):**
- G1 - Mathématiques Bac (Teacher: Ahmed Ben Salah, 3 students enrolled)
  - Schedule: Monday & Wednesday 14:00-16:00

**Rooms (3):**
- Salle 1 (Premium, 15 capacity, 30 TND HT for 1-9 persons, 35 TND HT for 10-15 persons)
- Salle 2 (Standard, 9 capacity, 25 TND HT for 1-9 persons)
- Salle 3 (Standard, 9 capacity, 25 TND HT for 1-9 persons)

**Room Pricing Structure (Updated Oct 2025):**
- All prices shown as HT (tax excluded) and TTC (including 7% VAT)
- Individual category removed, merged into group pricing
- New tiers: 1-9 personnes, 10-15 personnes (Salle 1 only)
- SmartHub fees include: Space + Student management (attendance, discipline, payment)
- **Special Offer:** 20% discount for independent teachers with their own students

**Bookings (1):**
- G1 group in Salle 1 on Oct 4, 2025 (10:00-12:00)

## Training Focus Refactoring Project

**Documentation Location**: `docs/refactoring_training_focused/`
- `refactoring_training_focused.md` - Project overview and objectives
- `planning.md` - Detailed phases and timeline
- `tasks.md` - Complete task list (118 tasks)

**Project Objective**: Transform SmartHub from room rental focus (60/40) to training center focus (80/20)

### Phase 1: Navigation & Home Page (✅ COMPLETED - Oct 5, 2025)

**Changes Implemented**:
1. **Navigation Menu** (`src/components/Navigation.tsx`):
   - Replaced "Salles" link with "Formations" link
   - New route: `/formations` (to be created in Phase 2)
   - Rooms page still accessible via direct URL `/rooms`

2. **Home Page Hero Section** (`src/pages/Home.tsx`):
   - Updated mission statement to focus on training and tutoring
   - New text: "Centre de formation et de tutorat académique au cœur de Tunis. Cours de soutien scolaire pour tous les niveaux, préparation aux examens nationaux et internationaux, formations spécialisées pour adultes et professionnels."
   - Changed CTA button from "Découvrir nos Salles" to "Nos Formations" (links to `/formations`)

3. **Home Page Services Section** (`src/pages/Home.tsx`):
   - Expanded from 2 to 5 services
   - New services:
     1. **Cours de Soutien Scolaire** - Academic tutoring for all levels
     2. **Préparation aux Examens** - TOEFL, DELF, SAT, Bac, Concours preparation
     3. **Formations Professionnelles** - Web Design, Social Media, AI training
     4. **⭐ Formation des Formateurs** (NEW) - Digital Teacher program with AI tools and modern pedagogy
     5. **Location d'Espaces** - Classroom rentals (moved to 5th position as complementary service)

4. **Home Page Statistics** (`src/pages/Home.tsx`):
   - Updated main stats section:
     - 300+ Étudiants Formés (was: 12+ Enseignants Experts)
     - 18+ Programmes de Formation (was: 234h Disponibilité)
     - 15+ Enseignants Certifiés (new stat)
     - 95% Taux de Réussite (was: 4.9★ Note Moyenne)
   - Updated Registration CTA stats section to match

**Files Modified**:
- `src/components/Navigation.tsx` - Menu navigation updated
- `src/pages/Home.tsx` - Hero, services, and stats updated

### Phase 2: Formations Page (✅ COMPLETED - Oct 5, 2025)

**New Page Created**: `src/pages/Formations.tsx`

**Features Implemented**:
1. **Hero Section** - Gradient background with GraduationCap icon and main title
2. **Section 1: Soutien Scolaire** (`#soutien-scolaire`)
   - 4 academic levels: Primaire, Collège, Secondaire, Universitaire
   - Subjects listed for each level
   - Pedagogical approach cards (petits groupes, suivi individualisé, rapports mensuels, résultats garantis)
   - CTA: "S'inscrire au Soutien Scolaire"

3. **Section 2: Préparation aux Examens** (`#preparation-examens`)
   - National exams: Concours 6ème, 9ème, Bac, University exams
   - International exams: TOEFL, TOEIC, IELTS, Cambridge, DELF, DALF, SAT, ACT, GMAT, GRE
   - Session formats: Intensive, Practice exams, Stress management
   - CTA: "S'inscrire à la Préparation Examens"

4. **Section 3: Formations Adultes** (`#formations-adultes`)
   - 5 language training programs:
     - Anglais Général (A1-C2)
     - Anglais Conversationnel
     - Anglais des Affaires
     - Préparation TOEFL/TOEIC
     - DELF tous niveaux
   - Format & Duration card: 2-6 months, 4-8 person groups
   - CTA: "S'inscrire aux Formations Langues"

5. **Section 4: Formations Professionnelles** (`#formations-professionnelles`)
   - 3 specialized training domains:
     - Web Design & Développement (HTML, CSS, JS, WordPress, Shopify)
     - Social Media Management (Strategy, Meta Ads, Analytics, ROI)
     - Intelligence Artificielle (ChatGPT, Midjourney, DALL-E, Automation)
   - Duration: 1-3 months with SmartHub certification
   - CTA: "S'inscrire aux Formations Pro"

6. **Section 5: Formation des Formateurs** (`#formation-formateurs`) ⭐ **PREMIUM**
   - Premium dark gradient background (indigo-purple-pink)
   - "NOUVEAU PROGRAMME" badge
   - Title: "Devenez un Digital Teacher Certifié"
   - **Programme Digital Teacher**:
     - Outils Technopédagogiques (Google Classroom, Moodle, Zoom, Gamification)
     - IA pour l'Enseignement (ChatGPT, correction auto, Canva AI)
     - Gestion Classe Virtuelle (Animation online, engagement, hybrid courses)
   - **Enhancement Compétences Pédagogiques**:
     - Techniques Modernes (pédagogie active, différenciation, neurosciences)
     - Gestion & Communication (groupes difficiles, CNV, conflits, parents)
   - **4 Spécialisations**: Adultes (Andragogie), Langues, STEM, Coaching
   - **Formats**: Intensif (2 weeks, 30h), Étalé (2-3 months, 40h), Workshops, Coaching
   - **Certifications**: SmartHub Certificate, Digital Teacher Badge, Portfolio
   - CTA: "Devenir Digital Teacher" (premium button with border)

7. **Section 6: Avantages SmartHub**
   - 6 key advantages with icon cards:
     - Enseignants Certifiés (15+ teachers)
     - Taux de Réussite 95%
     - Petits Groupes (6-8 students max)
     - Emplacement Central (13 Rue de Belgique, Tunis)
     - Technologie Moderne (digital tools)
     - Certification Reconnue

8. **Final CTA Section**
   - Gradient background (blue-indigo-purple)
   - Two registration buttons: "Je suis Étudiant" / "Je suis Enseignant"
   - Contact phone number: +216 99 730 144

**Route Added**: `/formations` in `src/App.tsx`

**All Anchor Links Working**:
- `#soutien-scolaire`
- `#preparation-examens`
- `#formations-adultes`
- `#formations-professionnelles`
- `#formation-formateurs`

**Design System**: Consistent with existing pages using Tailwind gradients, glassmorphism, hover effects

### Phase 3: Update Existing Pages (✅ COMPLETED - Oct 5, 2025)

**Pages Updated**:

1. **Teachers Page** (`src/pages/Teachers.tsx`)
   - Updated Hero description to emphasize training focus: "spécialisés dans le soutien scolaire, la préparation aux examens et la formation professionnelle"
   - Added new section "Nos Domaines d'Expertise" with 4 cards:
     - Soutien Scolaire (blue, BookOpen icon)
     - Préparation aux Examens (green, Target icon)
     - Formations Adultes (purple, Globe icon)
     - ⭐ Formation des Formateurs (premium gradient, GraduationCap icon with "NOUVEAU" badge)
   - Updated Stats section:
     - 18+ Programmes de Formation
     - 300+ Apprenants Formés
     - 15+ Enseignants Certifiés
     - 95% Taux de Réussite

2. **LearnMore Page** (`src/pages/LearnMore.tsx`)
   - Updated Hero title: "Programmes de Formation SmartHub"
   - Updated Hero description to focus on training programs and mention "Formation des Formateurs"
   - Emphasizes comprehensive training offerings

3. **OurMission Page** (`src/pages/Our_Mission.tsx`)
   - Updated Hero title: "Notre Mission - Centre de Formation & Tutorat Académique"
   - Updated mission statement to position SmartHub as training and tutoring center
   - Changed tagline badges: "Formation + Tutorat + Excellence"
   - Emphasizes support from academic tutoring to Teacher Training

**Files Modified**:
- `src/pages/Teachers.tsx` - Added expertise domains section and updated stats
- `src/pages/LearnMore.tsx` - Updated hero with training focus
- `src/pages/Our_Mission.tsx` - Updated mission statement and positioning

### Phase 4: Testing & Validation (✅ COMPLETED - Oct 5, 2025)

**Testing Results**:

1. **Navigation & Routes** ✅
   - All navigation menu links working correctly
   - "Formations" link in navigation menu functioning
   - `/formations` route accessible and rendering correctly
   - All page routes working: Home, Formations, Rooms, Teachers, LearnMore, OurMission

2. **Anchor Links** ✅
   - All 5 anchor links on Formations page tested and working:
     - `#soutien-scolaire` ✅
     - `#preparation-examens` ✅
     - `#formations-adultes` ✅
     - `#formations-professionnelles` ✅
     - `#formation-formateurs` ✅
   - Links from Home page services section navigate correctly to Formations sections

3. **Production Build** ✅
   - TypeScript compilation successful for all refactored files
   - No new errors introduced by refactoring
   - Only pre-existing errors in admin files (unrelated to this refactoring)
   - Files verified: Navigation.tsx, Home.tsx, Formations.tsx, Teachers.tsx, LearnMore.tsx, Our_Mission.tsx, App.tsx

4. **Design Consistency** ✅
   - All pages use consistent Tailwind gradient system
   - Glassmorphism effects applied uniformly
   - Hover animations and transitions consistent
   - Color scheme: blue-indigo-purple-pink gradients maintained
   - Formation des Formateurs sections have premium dark gradient design

5. **Mobile Responsiveness** ✅
   - Grid layouts responsive (1 column mobile, 2-3 columns tablet, 4 columns desktop)
   - Navigation menu has mobile hamburger menu (from existing Navigation component)
   - All CTAs and buttons properly sized for mobile
   - Text scales appropriately for different screen sizes

**Summary**: All 4 phases of the refactoring project completed successfully with zero errors in refactored code.

## Refactoring Project Summary

**Total Time**: Phases 1-4 completed in one session (Oct 5, 2025)

**Files Created**: 1
- `src/pages/Formations.tsx` - Comprehensive training programs page

**Files Modified**: 8
- `src/components/Navigation.tsx` - Updated menu (Salles → Formations)
- `src/pages/Home.tsx` - New hero, services, stats
- `src/pages/Teachers.tsx` - Added expertise domains, white background for Formation des Formateurs card
- `src/pages/LearnMore.tsx` - Updated focus, fixed registration link
- `src/pages/Our_Mission.tsx` - Updated mission, changed CTA to "Nos Formations"
- `src/pages/Formations.tsx` - Fixed Format & Durée card background to white
- `src/components/Footer.tsx` - Enhanced contact visibility with gray-800 backgrounds and white text
- `src/App.tsx` - Added Formations route

**Additional Polish & Fixes (Oct 5, 2025)**:
1. **Footer Contact Enhancement**:
   - Phone and email now displayed with gray-800 background cards
   - White text with semibold font-weight and larger text size
   - Improved visibility and prominence in footer

2. **Formations Page**:
   - Fixed "Format & Durée" card background from gradient to white
   - Consistent white background across all cards in Formations Adultes section
   - Purple accent color maintained for visual consistency

3. **Teachers Page**:
   - Aligned Formation des Formateurs card background to white
   - Gradient moved to icon circle only
   - Consistent with other expertise domain cards

4. **Our Mission Page**:
   - Changed "Découvrir nos Salles" button to "Nos Formations"
   - Updated link from `/rooms` to `/formations`
   - Updated WhatsApp message to focus on training programs

5. **Learn More Page**:
   - Fixed "S'inscrire Maintenant" link from `/register` to `/register/student`
   - Proper navigation to student registration form

**Key Achievement**: Successfully transformed SmartHub from 60/40 room rental focus to 80/20 training center focus with comprehensive "Formation des Formateurs" program as flagship offering. All UI elements polished with enhanced visibility and consistent design.

## Rooms Page Pricing Update (Oct 7, 2025)

**Changes Implemented**:

1. **Simplified Pricing Structure** (`src/pages/Rooms.tsx`):
   - Removed individual (1 person) pricing category
   - Merged 2-6 and 7-9 person tiers into single "1-9 personnes" category
   - **Salle 1**: 30 TND HT (1-9 persons), 35 TND HT (10-15 persons)
   - **Salle 2**: 25 TND HT (1-9 persons)
   - **Salle 3**: 25 TND HT (1-9 persons)

2. **Tax Display Enhancement**:
   - All prices now shown in both HT (Hors Taxes) and TTC (Toutes Taxes Comprises)
   - VAT = 7% for room rentals (different from 19% for teacher services)
   - TTC prices displayed in bold dark gray font for better visibility
   - Example: 30 TND HT → 32.10 TND TTC (TVA 7%)

3. **SmartHub Fees Explanation**:
   - Added clarification below "Tarification" header
   - Text: "(Frais SmartHub = Espace + gestion d'élèves : assiduité, discipline et paiement)"
   - Displayed in bold dark brown (amber-900) for prominence
   - Explains that fees include space rental + comprehensive student management

4. **Independent Teachers Discount**:
   - New promotional badge: "OFFRE ENSEIGNANTS INDÉPENDANTS"
   - 20% discount for independent teachers with their own students
   - Purple-blue gradient background with graduation cap icon 🎓
   - Prominently displayed in each room's pricing section

**Files Modified**:
- `src/pages/Rooms.tsx` - Complete pricing structure overhaul
- `CLAUDE.md` - Documentation updated with new pricing policy

**Business Impact**:
- Clearer pricing transparency with HT/TTC display
- Competitive advantage for independent teachers (20% discount)
- Better understanding of SmartHub value proposition (space + management services)
- Aligned with Tunisian tax regulations (7% VAT for space rental vs 19% for services)