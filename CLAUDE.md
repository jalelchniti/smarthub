# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartHub is a French-language static website for an educational facility in Tunis, Tunisia. Built with React 19 + TypeScript 5.8 + Vite 7.1, it serves as a showcase for classroom rentals, teacher services, and facilitates connections between qualified teachers and serious students.

**Business Context**: Operated by ELMAOUIA ET.CO (SARL), the facility is located at 13 Rue de Belgique, Tunis, managed by Mme Souad Dkhili (+216 99 456 059, souad.dkhili@u-smart.net).

## Essential Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server on http://localhost:5173
npm run build        # TypeScript compilation + production build (outputs to dist/)
npm run lint         # Run ESLint checks
npm run preview      # Preview production build locally

# Testing the build
npm run build && npm run preview  # Verify production build works
```

## Architecture Overview

### Tech Stack
- **Frontend**: React 19, TypeScript 5.8, React Router DOM 7.8
- **Styling**: Tailwind CSS 3.4 with custom theme (blue/purple gradients, glassmorphism effects)
- **Icons**: Lucide React
- **Backend**: Firebase Realtime Database + Firebase Authentication (CDN-based, no npm package)
- **Build Tool**: Vite 7.1
- **Deployment**: Static hosting on OVH via FTP (credentials in .env)

### Firebase Integration (Critical)
- **Configuration**: Uses Firebase CDN scripts loaded in `index.html` (NOT npm packages)
- **Initialization**: Async initialization pattern in `src/config/firebase.ts` with retry mechanism
- **Auth**: Firebase Authentication for admin access (authorized emails: jalel.chniti@smarthub.com.tn, jalel.chniti@gmail.com)
- **Database**: Firebase Realtime Database for booking system
- **Environment Variables**: All Firebase config in `.env` file (VITE_FIREBASE_* variables)

### Application Structure

**Route Architecture** (`src/App.tsx`):
- Public routes with Navigation/Footer wrapper
- Private routes without wrapper (registration forms, thank you pages)
- Secure admin routes (Firebase authentication required)
- Hidden routes (revenue simulator at `/simulation`)

**Key Pages**:
- `/` - Home page with hero section
- `/rooms` - 3 classroom rentals with interactive image galleries
- `/teachers` - Teacher services and 9 subjects offered
- `/learn-more` - Detailed educational programs
- `/booking-system` - Real-time booking via Firebase
- `/simulation` - Private teacher revenue calculator (12 TND/hour minimum guarantee)
- `/parentsimulator` - Parent cost calculator
- `/our-mission` - Mission statement page
- `/admin/firebase-login` - Secure admin authentication
- `/admin/firebase-bookings` - Admin dashboard for managing bookings

**Services Layer** (`src/services/`):
- `firebaseAuthService.ts` - Enterprise Firebase Authentication with session management
- `firebaseBookingService.ts` - Multi-user booking system with real-time sync
- `adminAuthService.ts` - Legacy admin service (being phased out)

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

### Firebase Booking System
- Real-time synchronization across devices
- Multi-user booking support
- Fee calculation with VAA tracking
- Payment status tracking (pending/paid/cancelled)
- Room availability checks before booking
- Data structure: `bookings/{bookingId}`, `rooms/{roomId}`, `timeSlots/`

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

### Firebase Development
1. Always await `getFirebaseInitialization()` before using Firebase services
2. Check `isFirebaseReady()` for synchronous availability checks
3. Firebase CDN scripts load async - handle loading states in components
4. Never hardcode Firebase config - use environment variables only
5. Admin auth emails are whitelisted at Firebase console level

### Component Patterns
- Use React Router's `useNavigate()` for all internal navigation
- Handle Firebase initialization states with loading indicators
- Brevo form submissions should navigate to thank you pages after success
- All monetary calculations must include 19% TVA
- Use Tailwind classes for styling (avoid inline styles)

### TypeScript Best Practices
- Strict mode enabled (`tsconfig.app.json`)
- Interface definitions for all Firebase data structures
- Type-safe environment variable access via `import.meta.env`
- Proper typing for Firebase CDN global objects (`Window` interface extensions)

### State Management
- No external state library (React hooks only)
- Firebase auth state managed by `FirebaseAuthService` class
- Local storage used for booking data persistence (see `secureBookingStorage.ts`)

## Common Issues & Solutions

**Firebase CDN not loading**: Check `index.html` script tags are present and network connectivity
**Build fails**: Run `npm run build` - check TypeScript errors first
**MIME type errors in production**: Ensure `.htaccess` or `web.config` properly configured
**Brevo forms not working**: Verify form IDs match Brevo console configuration
**Routes not working after deploy**: Ensure server-side rewrite rules direct all routes to `index.html`

## Important Files to Check

- `.env` - Contains all Firebase config and deployment credentials (never commit)
- `index.html` - Firebase CDN script tags, Brevo integration scripts
- `src/config/firebase.ts` - Firebase initialization with retry logic
- `src/App.tsx` - Route definitions and layout structure
- `vite.config.ts` - Build configuration for production
- `tailwind.config.js` - Theme customization
- `docs/elmaouia_business_model.md` - Business context and financial model

## Multi-language Support

**Primary Language**: French (all UI text)
**Target Audience**: Tunisian students, teachers, and parents
**Currency**: TND (Tunisian Dinar)
**Contact Hours**: Tunisian business hours (Mon-Sat 9:00-18:00, Sun 10:00-13:00)

## Git Repository

- **Remote**: https://github.com/jalelchniti/smarthub.git
- **Branch**: master (primary deployment branch)
- **Deployment flow**: Commit → Push → FTP upload to OVH

## Security Considerations

- Firebase API keys are restricted by domain in Firebase Console
- Admin access controlled via Firebase Authentication with email whitelist
- No sensitive data in repository (`.env` in `.gitignore`)
- OVH credentials stored only in `.env` file
- Legacy admin password system replaced by Firebase Auth (enterprise-grade)