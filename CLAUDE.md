# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Current Implementation Status

**IMPORTANT**: This is a **static frontend-only** React application. The README.md describes some backend features that are **NOT YET IMPLEMENTED**.

**Current Reality**:
- ✅ Static React SPA with 10 routes (Home, Rooms, Teachers, LearnMore, /subjects redirect + registration & thank you pages + private revenue simulator + **NEW: Booking System**)
- ✅ Brevo form integration for lead collection
- ✅ WhatsApp contact integration (+216 99 456 059)
- ✅ Revenue Simulator for teachers (private route)
- ✅ **NEW: Complete Date-Based Booking System** with Firebase Realtime Database
- ✅ Static deployment ready for any hosting platform
- ✅ Firebase hosting configuration included
- 📝 **Email notifications** (will be implemented via Brevo integration)
- ❌ NO authentication system implemented
- ❌ NO dashboard system implemented

**When developing, ALWAYS**:
1. Verify current codebase state (static React app)
2. Don't assume backend endpoints exist
3. Focus on frontend-only features
4. Use external services (Brevo, WhatsApp) for dynamic functionality

## Essential Development Commands

### Core Commands (ALWAYS run before committing)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality checks

### Development Commands
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run preview` - Preview production build locally
- `npm install` - Install dependencies (required on first setup)
- Prettier 3.6.2 available for code formatting (not in scripts)

### Important Notes
- **CRITICAL**: Always run `npm run build` and `npm run lint` before committing
- **TESTING**: No test framework configured (manual testing only)
- **Static Only**: This is a frontend-only application with no backend

## Architecture & Tech Stack

### Current Tech Stack
- **React 19** with TypeScript 5.8
- **Vite 7.1** for build tooling and development server
- **Tailwind CSS 3.4** for styling with custom color palette and premium gradients
- **React Router DOM 7.8** for client-side routing
- **Lucide React** for icons and visual elements
- **Firebase 10.7** for Realtime Database (booking system)
- **ESLint 9.34** with TypeScript support and React hooks plugin
- **Prettier 3.6.2** for code formatting (available, not in scripts)
- **Static Architecture**: No backend - all content is static with form submissions via external services

### Application Architecture

**Route Structure** (defined in `src/App.tsx`):
- **Main Pages**: `/` (Home), `/rooms`, `/teachers`, `/learn-more`, `/subjects` (redirects to LearnMore), **`/booking`** (NEW: Room booking system) - Include Navigation + Footer
- **Thank You Pages**: `/thank-you/student`, `/thank-you/teacher` - Standalone pages without nav/footer
- **Registration Pages**: `/register/student`, `/register/teacher` - Full page forms with own nav/footer
- **Private Pages**: `/simulation` - Revenue simulator for teachers (hidden from public navigation)

**Component Architecture**:
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx         # Standardized button with variants
│   │   ├── Card.tsx           # Glassmorphism card containers
│   │   ├── Input.tsx          # Form inputs with validation styling
│   │   ├── StudentSubscriptionForm.tsx  # Modal form (Brevo integration)
│   │   └── TeacherSubscriptionForm.tsx  # Modal form (Brevo integration)
│   ├── Navigation.tsx         # Site header with responsive menu
│   ├── Footer.tsx             # Business info and contact details
│   └── GoogleMapEmbed.tsx     # Interactive location popup
├── pages/                     # Page-level components
│   ├── Home.tsx               # Hero + services overview + dual CTAs
│   ├── Rooms.tsx              # 3 workspace rental rooms
│   ├── Teachers.tsx           # 9 subjects + teacher connection
│   ├── LearnMore.tsx          # Educational programs (3-step process)
│   ├── StudentThankYou.tsx    # Success page with WhatsApp CTA
│   ├── TeacherThankYou.tsx    # Success page with WhatsApp CTA
│   ├── StudentRegistration.tsx # Full page form (simplified 3-field)
│   ├── TeacherRegistration.tsx # Full page form (simplified 3-field)
│   ├── RevenueSimulator.tsx   # Private revenue calculator for teachers (/simulation)
│   └── BookingSystem.tsx      # NEW: Date-based room booking system with Firebase
├── App.tsx                    # Route configuration and layout logic
└── main.tsx                   # Application entry point
```

## Key Configuration Files

- **`vite.config.ts`**: Build configuration with relative base path (`./`) for hosting-agnostic deployment, optimized asset naming with hashes
- **`package.json`**: Dependencies and build scripts - React 19, TypeScript 5.8, Vite 7.1, Firebase 10.7
- **`tsconfig.json`**: TypeScript project references architecture (app + node configs)
- **`tailwind.config.js`**: Custom design system (blue/purple gradients, Inter font)
- **`eslint.config.js`**: Modern ESLint config with TypeScript-ESLint 8.41, React hooks plugin
- **`firebase.json`**: Firebase hosting and functions configuration with SPA routing support

## Environment Configuration

**Firebase Environment Variables** (`.env` file required for booking system):
- `VITE_FIREBASE_API_KEY` - Firebase project API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_DATABASE_URL` - Firebase Realtime Database URL
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

**Future environment variables**:
- `VITE_USE_BACKEND=false` - Backend feature flag
- `VITE_API_URL` - Backend API endpoint
- `VITE_EMAIL_VERIFICATION=false` - Email verification feature flag

## Critical Development Rules

### Build Requirements
- **ALWAYS** run `npm run build` and `npm run lint` before committing
- **NEVER** commit without successful build verification

### Core Business Rules
- **Privacy Protection**: NO personal teacher data, names, or photos on public pages
- **Contact Integration**: All contact uses WhatsApp +216 99 456 059
- **Value Proposition**: "SmartHub connects competent teachers with serious students"
- **Language**: All content in French
- **Academic Coverage**: Primary through University + adult professional development

### Styling Requirements
- **Center Alignment**: Global `text-center` on all content (except interactive elements)
- **Design System**: Blue/purple gradients, glassmorphism effects, Inter font
- **9 Standardized Subjects**: Mathématiques, Physique, Français, Anglais, Sciences Naturelles, Arabe, Informatique, Économie & Gestion, ESP

### Navigation Rules
- **React Router**: Always use `useNavigate()` hook, never `window.location.href`
- **Form Redirects**: Local thank you pages (`/thank-you/student`, `/thank-you/teacher`)

### Common Build Issues to Avoid
- Unclosed JSX elements (most common TypeScript error)
- Unused imports (ESLint warnings become build errors)
- Missing dependencies in useEffect hooks
- Invalid React Router navigation patterns

## Brevo Form Integration Architecture

### Form Types & Purposes
- **Modal Forms** (`StudentSubscriptionForm`, `TeacherSubscriptionForm`): Quick subscription via popup modals
- **Full Page Forms** (`StudentRegistration`, `TeacherRegistration`): Dedicated registration pages
- **All forms simplified to 3 fields**: `NOM`, `PRENOM`, `EMAIL` for reliable Brevo compatibility

### Current Form Implementation
- **Submission Method**: Iframe-based submission for modal forms, fetch API for page forms
- **Success Handling**: Local thank you page redirects using React Router `useNavigate()`
- **Validation**: Client-side required field validation
- **Field Names**: CRITICAL - Always uppercase (`NOM`, `PRENOM`, `EMAIL`) for Brevo compatibility

### Brevo Endpoints (Working)
```
Student: https://e631d0f7.sibforms.com/serve/MUIFAB-_U5cHi7yXPk-t-VsHxhIe5hUlyI4fk3aEJoUpcHMvzLmI1WWWuyry9wDdUrd99qUslb10bqrpJlh4jBi0cjoFpUhKfQZm4TWmVLKUIaCmigZXaZYzDhzOMvcJ3bGGjhKUowaqQJshY76uQpAVz5FlSzx-SwKWB8qp1AeMPUwI_gqFNRIycYni5TJft1XcxDNPodqkuA2d

Teacher: https://e631d0f7.sibforms.com/serve/MUIFACcBK_aC-0JXT6lhpKFd8xYgm8CkGlXfM0HWzSh8m8U1OEIE1i-NJDIy_bfQTi2uHU5zbq7S7SsevyYlMHqe4rAL293UZ8QRycK_4SKQ5ezhdlBZutVnLcnFaH3XDsZU3PD38oOl3VkZJ4la2AQcreq9mAK1pndPWQ3euYECoeNCoLIg36Vkqr0oh_NACEtdxrV-vZeJbVJq
```

## Business Context

**SmartHub Educational Facility - Tunis City Center**
- **Address**: 13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis
- **Contact**: +216 99 456 059 | souad.dkhili@u-smart.net
- **Hours**: Mon-Fri (8:00-20:00), Sat (9:00-13:00, 15:00-18:00)
- **Services**: Teacher workspace rental (3 rooms), in-person educational services connecting competent teachers with serious students

## Deployment

### Hosting-Agnostic Static Site Deployment
**Repository**: https://github.com/jalelchniti/u-smart-net.git
**Branch**: master

**Build Process**:
```bash
# Build production version
npm run build

# Deploy dist/ contents to any static hosting provider
# Supported platforms: Netlify, Vercel, GitHub Pages, Apache servers, IIS servers, AWS S3, etc.
```

### Server Configuration Files
- **Apache**: `.htaccess` with SPA routing, MIME types, security headers
- **IIS**: `web.config` with URL rewrite rules, compression, font support
- **Both configurations handle React Router properly and resolve deployment issues**

## Email Marketing Integration

### Brevo CRM System
- **Purpose**: Lead collection and email marketing automation
- **Contact Attributes**: `NOM`, `PRENOM`, `EMAIL` (basic), extended attributes collected later
- **Autoresponders**: Welcome email series for students and teachers
- **Email Templates**: Located in `/docs/mailing_Lists/` with premium HTML design

### Current Email Campaign Status
- ✅ Student autoresponder template implemented (premium design)
- ✅ Brevo CRM attribute mapping documented
- ✅ Forms successfully submitting to Brevo with simplified 3-field structure
- ✅ WhatsApp integration in email templates with personalized messaging
- ✅ **NEW: Teacher income protection demo email** (`/docs/mailing_Lists/Teacher/SmartHub_Income_Protection_Demo.html`)

## Revenue Simulator (Private Tool)

### Purpose & Access
- **Private Route**: `/simulation` - Hidden from public navigation and menus
- **Target Audience**: Teachers only (shared via private marketing campaigns)
- **Function**: Interactive calculator for monthly net revenue estimation

### Technical Implementation
- **Location**: `src/pages/RevenueSimulator.tsx`
- **Route Type**: Standalone page without navigation/footer (like thank you pages)
- **Data Source**: Room pricing synchronized with `Rooms.tsx` component
- **State Management**: React hooks for real-time calculations

### Calculation Logic
- **Monthly Revenue**: Students × Fee per student
- **Room Rental Cost HT**: Hourly rate × Weekly hours × 4.33 weeks/month (VAT excluded)
- **VAT Application**: 19% tax on room rental cost only
- **Room Rental Cost TTC**: HT + VAT (VAT included)
- **Net Income**: Revenue - Room costs TTC

### Form Parameters
- **Room Selection**: Dropdown with capacity limits from actual room data
- **Students per Group**: Number input with room capacity validation
- **Session Duration**: Hours per session (0.5 - 8 hours)
- **Weekly Sessions**: Number of sessions per week
- **Student Fees**: TND per month (recommended: 120 TND)

### Design Features
- **Professional Styling**: Matches SmartHub design system (blue/purple gradients)
- **Enhanced Visibility**: Large fonts, colorful icons, improved contrast
- **Real-time Updates**: Instant calculation as parameters change
- **Profitability Indicators**: Visual feedback for viable configurations
- **Room Rate Display**: Shows current hourly rate based on group size
- **Transparent Cost Breakdown**: Displays both HT and TTC room costs with VAT details

### Business Rules
- **Recommendation**: 120 TND/month per student (prominently displayed)
- **VAT Rate**: 19% (Tunisia standard rate) applied to room rental only
- **Room Pricing**: Exact rates from operational room data
- **Cost Display**: Shows HT (VAT excluded), VAT amount, and TTC (VAT included) separately
- **Final Calculation**: Net income = Teacher revenue - Room cost TTC
- **Confidentiality**: Private tool for internal marketing only

### SmartHub Income Protection Policy (NEW - December 2025)
- **Minimum Hourly Income**: 12 TND/hour guaranteed (average teacher wage in Tunisia)
- **Automatic Discount**: Up to 35% reduction on room rental when teacher earns below minimum
- **Smart Calculation**: Accounts for VAT impact (discount HT by X saves teacher X × 1.19 total)
- **Real-time Application**: Automatic detection and application without paperwork
- **Transparent Display**: Shows original costs, discount applied, and final savings
- **Business Philosophy**: Ensures teacher financial security to build long-term partnerships
- **Financial Capacity**: Based on 8,000 TND monthly target with 2,800 TND discount budget

### VAT Implementation Details
**CRITICAL**: VAT is applied to room rental costs, NOT teacher revenue
- **Step 1**: Calculate monthly room cost HT (hourly rate × total hours)
- **Step 2**: Calculate VAT amount (room cost HT × 19%)
- **Step 3**: Calculate room cost TTC (HT + VAT)
- **Step 4**: Calculate net income (teacher revenue - room cost TTC)
- **Step 5**: **NEW - Apply SmartHub protection if hourly income < 12 TND**
- **Display**: Shows breakdown of HT, VAT, TTC, and any discounts applied for transparency

### Income Protection Calculation Logic
**CRITICAL**: Discount calculation must account for VAT impact
- **Detection**: If `netIncome / monthlyHours < 12`, apply discount
- **Required discount**: `(12 - currentHourlyRate) × monthlyHours ÷ 1.19` (VAT factor)
- **Discount cap**: Maximum 35% of room cost HT
- **Final calculation**: New TTC cost = (OriginalHT - Discount) × 1.19
- **UI display**: Shows original vs discounted costs with percentage saved

## SmartHub Booking System (NEW - September 2025)

### Purpose & Features
- **Multi-user room booking system** for SmartHub's 3 educational spaces
- **Date-based bookings** starting September 15th, 2025
- **Flexible booking periods**: 1 week, 2 weeks, 3 weeks, or 1 month
- **Sunday availability**: 8:00 AM - 1:00 PM only
- **Weekday availability**: 8:00 AM - 8:00 PM (with lunch break 1:00-3:00 PM)
- **Real-time synchronization** across all devices via Firebase

### Technical Implementation
- **Location**: `src/pages/BookingSystem.tsx`
- **Route**: `/booking` (accessible from main navigation)
- **Database**: Firebase Realtime Database for centralized storage
- **Real-time Updates**: Automatic synchronization across all users
- **Conflict Detection**: Prevents double-booking with duration logic
- **Firebase CDN**: No npm installation required, uses CDN scripts in `index.html`

### Data Structure
```typescript
interface Booking {
  id?: string;
  roomId: string;
  date: string; // YYYY-MM-DD format
  timeSlot: string; // "08:00", "08:30", etc.
  teacherName: string;
  subject: string;
  studentCount: number;
  duration: number; // Hours (0.5, 1, 1.5, 2, 2.5, 3)
  contactInfo: string;
  bookingPeriod: 'week' | '2weeks' | '3weeks' | 'month';
  endDate?: string; // For recurring bookings
}
```

### UI/UX Features
- **Week-view calendar** with navigation controls
- **Room selection** (Salle 1: 15 capacity, Salle 2/3: 9 capacity each)
- **Day-specific time slots** (Sunday vs weekdays)
- **Booking form modal** with period selection
- **Conflict visualization** with hover details
- **Booking cancellation** for existing reservations

### Firebase Configuration
- **Database Rules**: Public read/write (temporary for development)
- **Structure Update**: Automatic migration from old to new data format
- **Backup**: `update-firebase.html` utility for manual structure updates

### Business Rules
- **Start Date**: September 15th, 2025 (configurable)
- **Room Capacity**: Salle 1 (15), Salle 2 (9), Salle 3 (9)
- **Subjects**: Same 9 standardized subjects as Teachers page
- **Duration**: 30 minutes to 3 hours in 30-minute increments
- **Contact Required**: Phone or email for all bookings

## Quick Development Workflow

### Starting Development
```bash
npm install                  # First-time setup
npm run dev                 # Start development (localhost:5173)
```

### Before Committing
```bash
npm run build               # Must pass without errors
npm run lint                # Must pass without warnings
```

### Deployment Ready
- Build creates `dist/` folder ready for static hosting
- Firebase hosting configuration included with SPA routing
- Environment variables required only for booking system (.env file)
- All modern hosting platforms supported (Netlify, Vercel, GitHub Pages, Firebase, Apache, IIS)

## Important Notes

- **Form Field Names**: CRITICAL - Always use uppercase (`NOM`, `PRENOM`, `EMAIL`) for Brevo compatibility
- **React Router Navigation**: CRITICAL - Always use `useNavigate()` hook, never `window.location.href`
- **Static Architecture**: No backend - Brevo handles form submissions and email automation
- **French Localization**: All content fully localized in French language
- **Premium Design**: Gradient backgrounds and glassmorphism effects throughout
- **Privacy Compliant**: Lead data via Brevo, no personal data storage on site
- **Firebase Integration**: Booking system uses Firebase CDN approach (no npm install required)
- **Income Protection**: CRITICAL - 12 TND/hour minimum guaranteed with automatic up to 35% room discount
- **Teacher Marketing**: Use income protection as key value proposition in teacher recruitment campaigns

## NEXT STEPS (To Complete Email Notifications)

### Brevo Email Notification Integration (Planned)
**Status**: 📝 **PLANNED** - Will implement Brevo-based email notifications
**Approach**: Frontend-only solution using Brevo's transactional email API
**What it does**: Automatically sends booking confirmation emails via Brevo when new bookings are created

### Planned Implementation:
1. **Brevo API Setup** 📝 **TODO**: Configure Brevo transactional email templates
2. **Frontend Integration** 📝 **TODO**: Add Brevo email service to booking system
3. **Email Templates** 📝 **TODO**: Create professional booking confirmation templates
4. **Error Handling** 📝 **TODO**: Implement proper email delivery error handling

### Advantages of Brevo Approach:
- ✅ **No Firebase Functions dependency** (stays on free tier)
- ✅ **Frontend-only solution** (consistent with app architecture)
- ✅ **Professional email templates** with SmartHub branding
- ✅ **Reliable delivery** via established email service
- ✅ **Easy maintenance** and template updates

### Future Implementation:
- **Booking confirmations** sent to customers
- **Admin notifications** sent to `jalel.chniti@gmail.com`
- **Professional HTML templates** matching SmartHub design
- **Error handling** with user feedback