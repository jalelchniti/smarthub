# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartHub is a French-language static website for an educational facility in Tunis, Tunisia. Built with React 19 + TypeScript 5.8 + Vite 7.1, it serves as a showcase for classroom rentals, teacher services, and facilitates connections between qualified teachers and serious students.

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
- `/` - Home page with hero section
- `/rooms` - 3 classroom rentals with interactive image galleries
- `/teachers` - Teacher services and 9 subjects offered
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
- TVA (VAT) = 19% applied to all calculations

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
- Salle 1 (Premium, 15 capacity, 40 TND/h)
- Salle 2 (Standard, 9 capacity, 35 TND/h)
- Salle 3 (Standard, 9 capacity, 35 TND/h)

**Bookings (1):**
- G1 group in Salle 1 on Oct 4, 2025 (10:00-12:00)