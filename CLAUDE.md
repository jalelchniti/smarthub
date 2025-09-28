# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server (Vite, port 5173)
npm run build        # TypeScript compilation + Vite production build
npm run lint         # ESLint code quality check
npm run preview      # Preview production build locally

# No test command - testing should be done manually through UI
```

## Technology Stack

- **Frontend**: React 19 + TypeScript 5.8 + Vite 7.1
- **Styling**: Tailwind CSS 3.4 with custom theme
- **Routing**: React Router DOM 7.8 with nested route structure
- **Database**: Firebase Realtime Database (CDN-based, no npm dependency)
- **Authentication**: Firebase Authentication (admin access only)
- **Icons**: Lucide React
- **Deployment**: Static build outputs to `dist/` directory

## Architecture Overview

### Route Structure
The application uses a unique nested routing structure in `App.tsx:54-72` where most pages are wrapped with Navigation + Footer, while admin, thank-you, and registration pages have isolated layouts:

```typescript
// Isolated pages (no nav/footer)
/thank-you/student, /thank-you/teacher
/booking/thank-you, /payment/online-coming-soon
/admin/login, /admin/firebase-login
/admin/bookings, /admin/firebase-bookings
/register/student, /register/teacher
/simulation (private revenue simulator)

// Regular pages (with nav/footer)
/, /rooms, /teachers, /learn-more, /our-mission, /booking-system
```

### Firebase Integration
- Uses **CDN scripts** loaded in `index.html`, not npm packages
- Configuration through environment variables in `.env`
- Real-time booking system with conflict prevention
- Enterprise authentication for admin access (`jalel.chniti@smarthub.com.tn`, `jalel.chniti@gmail.com`)

### Service Layer Architecture
- `firebaseAuthService.ts`: Enterprise auth with role-based access
- `firebaseBookingService.ts`: Real-time booking management with VAT calculations
- `adminAuthService.ts`: Legacy auth service (kept for reference)

### Business Logic
- **Créneau System**: 1.5-3 hour booking slots only (validated in `firebaseBookingService.ts:209-220`)
- **Dynamic Pricing**: Room-based rates with student count tiers
- **VAT Handling**: Tunisia standard 19% VAT on all bookings
- **Payment Tracking**: Multi-status system (pending/paid/cancelled)

## Key Development Patterns

### Component Structure
- UI components in `src/components/ui/` (Button, Card, Input, etc.)
- Page-specific components in `src/pages/`
- Shared components in `src/components/` (Navigation, Footer, GoogleMapEmbed)

### State Management
- No external state library - uses React hooks and Firebase real-time listeners
- Authentication state managed in `FirebaseAuthService` with callback pattern
- Booking data synchronized via Firebase real-time database

### Form Handling
- Brevo integration for lead collection with autoresponders
- WhatsApp integration with pre-filled messages (+216 99 456 059)
- Payment method selection (online/offline) with coming soon pages

## Firebase Configuration

### Database Structure
```
/
├── rooms: { "1": {name, capacity}, "2": {...}, "3": {...} }
├── bookings: { [id]: Booking }
├── timeSlots: { weekdays: [...], sunday: [...] }
├── weekDays: [...]
└── lastUpdated: timestamp
```

### Authentication
- Admin users only: `jalel.chniti@smarthub.com.tn`, `jalel.chniti@gmail.com`
- Custom claims used for role verification
- Session management with automatic token refresh

## Build and Deployment

### Build Configuration
- **Output**: `dist/` directory with optimized assets
- **Base Path**: Absolute (`/`) for deployment at domain root
- **Assets**: Organized in `assets/` subdirectory with hash-based naming
- **Server Configs**: Includes `.htaccess` and `web.config` for SPA routing

### Deployment Requirements
- Static hosting compatible (Netlify, Vercel, Firebase Hosting)
- MIME type configuration for `.mjs` and other ES modules
- SPA routing support (all routes serve `index.html`)
- Firebase environment variables must be configured

## Business Context

**SmartHub** is an educational facility in Tunis offering:
- 3 meeting rooms for rent (different capacities and pricing)
- Teacher services with guaranteed minimum revenue (12 TND/hour)
- Student registration with Brevo CRM integration
- Real-time booking system for space management

### Contact Information
- **Address**: 13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis
- **Phone**: +216 99 456 059
- **Email**: souad.dkhili@u-smart.net
- **Hours**: Mon-Sat (9:00-13:00, 15:00-18:00), Sun (10:00-13:00)

## Development Notes

### Critical Constraints
- Créneau duration must be 1.5-3 hours only (business rule)
- All pricing includes 19% Tunisia VAT
- Firebase uses CDN scripts, not npm dependencies
- Admin authentication requires specific email domains

### When Working with Bookings
- Always validate créneau duration before database operations
- Use `FirebaseBookingService.calculateBookingFees()` for accurate pricing
- Check conflicts with `checkBookingConflict()` before creating bookings
- Update `lastUpdated` timestamp after any database modifications

### When Working with Authentication
- Initialize `FirebaseAuthService` before any auth operations
- Use enterprise emails only for admin access
- Handle auth state changes through callback pattern
- Never hardcode credentials - use Firebase environment variables