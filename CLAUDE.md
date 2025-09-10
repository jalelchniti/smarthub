# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Architecture Overview

**Static Frontend-Only React Application** - No backend services except Firebase Realtime Database and Authentication.

**Key Features**:
- ✅ 13 React SPA routes with TypeScript + Vite
- ✅ Firebase Realtime Database (booking system) + Authentication (admin access)  
- ✅ Brevo form integration for lead collection
- ✅ WhatsApp contact integration (+216 99 456 059)
- ✅ Revenue Simulator with SmartHub income protection policy (private route)
- ✅ Multi-user room booking system with real-time synchronization
- ✅ Enterprise-grade admin authentication (Firebase Auth)
- ✅ Static deployment ready for any hosting platform

**Development Constraints**:
- No backend endpoints - use external services only (Brevo, WhatsApp, Firebase)
- Focus on frontend-only features and integrations
- All dynamic functionality via Firebase services or external APIs

## Essential Development Commands

**CRITICAL - Pre-commit requirements**:
```bash
npm run build  # TypeScript + Vite build (must pass)
npm run lint   # ESLint checks (must pass)
```

**Development workflow**:
```bash
npm install    # First-time setup
npm run dev    # Development server (localhost:5173)
npm run preview # Preview production build
```

**Testing**: Manual testing only (no test framework configured)

### Deployment Configuration
**Server configuration files** (CRITICAL for SPA routing):
- `.htaccess` - Apache server configuration with MIME types and SPA routing
- `web.config` - IIS server configuration with URL rewrite rules  
- `netlify.toml` - Netlify hosting configuration with redirects and headers
- `public/_redirects` - Netlify-specific redirects (takes precedence over netlify.toml)

### Known Deployment Issues

#### Persistent MIME Type Error on Netlify
**Issue**: Assets served as HTML instead of correct MIME types:
```
Refused to apply style from '/admin/assets/index-B5ytOgF7.css' 
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

**Root Cause**: Netlify SPA redirect rules are too broad and catching asset requests.

**Current Configuration** (`public/_redirects`):
```
# Static assets served directly (should have highest priority)
/assets/*    /assets/:splat    200
/*           /index.html       200!
```

**Attempted Solutions**:
- ✅ Added explicit `/assets/*` rule before catch-all
- ✅ Used `200!` status to force rule precedence  
- ✅ Updated `netlify.toml` with `force=false`
- ❌ **Still not working** - Netlify continues serving HTML for asset requests

**Next Troubleshooting Steps**:
1. Try alternative Netlify redirect syntax
2. Consider using `_headers` file for explicit MIME types
3. Test with different asset path patterns
4. Contact Netlify support for SPA + asset serving configuration

## Critical Development Rules

### Navigation & Form Patterns
- **React Router ONLY**: Always use `useNavigate()` hook, never `window.location.href`
- **Brevo Form Fields**: CRITICAL - Always use uppercase field names (`NOM`, `PRENOM`, `EMAIL`) for compatibility
- **Form Redirects**: Use local thank you pages with React Router navigation

### Firebase Integration  
- **CDN-Based**: Firebase loaded via HTML script tags (no npm dependency)
- **Environment Variables**: All Firebase config via `.env` file (required for booking/admin)
- **Admin Access**: Email-based verification (jalel.chniti@smarthub.com.tn, jalel.chniti@gmail.com)
- **Service Pattern**: Use `FirebaseBookingService` and `FirebaseAuthService` classes

### SmartHub Business Logic
- **Income Protection**: 12 TND/hour minimum guaranteed for teachers (automatic discount up to 35%)
- **VAT Calculation**: 19% Tunisia rate applied to room costs only, not teacher revenue
- **Room Pricing**: Synchronized between `RevenueSimulator.tsx` and `firebaseBookingService.ts`
- **Contact Integration**: WhatsApp +216 99 456 059 for all CTAs

## Architecture & Tech Stack

**Core Stack**:
- React 19 + TypeScript 5.8 + Vite 7.1
- Tailwind CSS 3.4 (custom blue/purple gradients, glassmorphism effects)
- React Router DOM 7.8 (client-side routing)
- Firebase 10.7.1 (Realtime Database + Authentication)
- Lucide React (icons), ESLint 9.34, Prettier 3.6.2

### Application Architecture

**Route Structure** (`src/App.tsx`):
- **Public**: `/` (Home), `/rooms`, `/teachers`, `/learn-more` - with Navigation + Footer
- **Registration**: `/register/student`, `/register/teacher` - full page forms
- **Thank You**: `/thank-you/student`, `/thank-you/teacher` - standalone pages
- **Private**: `/simulation` - revenue simulator (hidden from navigation)
- **Booking**: `/booking` - room booking system (real-time Firebase)
- **Admin**: `/admin/firebase-login`, `/admin/firebase-bookings` - protected routes

**Key Service Architecture**:
```
src/
├── services/                  # Firebase service layer
│   ├── firebaseAuthService.ts      # Admin authentication
│   ├── firebaseBookingService.ts   # Booking CRUD + fee calculations
│   └── adminAuthService.ts         # Legacy auth (deprecated)
├── config/
│   └── firebase.ts                 # Firebase configuration (CDN-based)
├── components/ui/               # Reusable components  
│   ├── *SubscriptionForm.tsx       # Brevo form integrations
│   ├── Button.tsx, Card.tsx, Input.tsx # UI primitives
├── pages/                       # Page components
│   ├── RevenueSimulator.tsx        # Income protection calculator
│   ├── BookingSystem.tsx           # Real-time room booking
│   ├── FirebaseAdmin*.tsx          # Secure admin dashboard
```

## Key Configuration Files

- **`vite.config.ts`**: Build configuration with relative base path (`./`) for hosting-agnostic deployment, optimized asset naming with hashes
- **`package.json`**: Dependencies and build scripts - React 19, TypeScript 5.8, Vite 7.1, Firebase 10.7.1
- **`tsconfig.json`**: TypeScript project references architecture (app + node configs)
- **`tailwind.config.js`**: Custom design system (blue/purple gradients, Inter font)
- **`eslint.config.js`**: Modern ESLint config with TypeScript-ESLint 8.41, React hooks plugin
- **`firebase.json`**: Firebase hosting and functions configuration with SPA routing support

## Environment Configuration

**Firebase Environment Variables** (`.env` file required for booking system and admin authentication):
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

## SmartHub Booking System (Enhanced - December 2025)

### Purpose & Features
- **Multi-user room booking system** for SmartHub's 3 educational spaces
- **Date-based bookings** starting September 15th, 2025
- **Multi-slot selection**: Select multiple time slots before confirming all at once
- **Sunday availability**: 8:00 AM - 1:00 PM only
- **Weekday availability**: 8:00 AM - 8:00 PM (with lunch break 1:00-3:00 PM)
- **Real-time synchronization** across all devices via Firebase
- **Comprehensive fee tracking**: Automatic calculation and storage of all costs
- **VAT compliance**: 19% Tunisia standard rate applied and tracked

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
  feeCalculation?: {
    subtotalHT: number; // Amount before VAT
    vatAmount: number; // 19% VAT amount
    totalTTC: number; // Total with VAT included
    hourlyRate: number; // Rate per hour for this booking
    vatRate: number; // VAT rate used (0.19)
  };
  paymentStatus?: 'pending' | 'paid' | 'cancelled';
}
```

### UI/UX Features
- **Week/Month view calendar** with navigation controls
- **Room selection** (Salle 1: 15 capacity, Salle 2/3: 9 capacity each)
- **Multi-slot selection** with visual feedback
- **Day-specific time slots** (Sunday vs weekdays)
- **Privacy-focused interface** (hides existing booking details)
- **Fee calculator modal** with real-time pricing
- **Conflict detection** with alternative suggestions
- **Batch booking confirmation** for multiple slots

### Firebase Configuration
- **Database Rules**: Public read/write (temporary for development)
- **Fee Calculation**: Automatic calculation and storage with each booking
- **Management Tools**: 
  - `update-firebase.html`: Database structure updates
  - `purge-firebase.html`: Complete data purge utility

### Business Rules
- **Start Date**: September 15th, 2025 (configurable)
- **Room Capacity**: Salle 1 (15), Salle 2 (9), Salle 3 (9)
- **Subjects**: Same 9 standardized subjects as Teachers page
- **Duration**: 30 minutes to 3 hours in 30-minute increments
- **Contact Required**: Phone or email for all bookings
- **Fee Structure**: Synchronized with `Rooms.tsx` pricing tiers
- **VAT Rate**: 19% (Tunisia standard rate) applied to all bookings
- **Payment Status**: Automatic tracking (pending/paid/cancelled)

### Payment Flow & User Experience (NEXT IMPLEMENTATION)
- **Post-Booking Payment Choice**: After successful Firebase booking submission, user is presented with payment options
- **Payment Methods**: 
  - **Online Payment**: Integration with Paymee.tn payment gateway (Tunisia's leading payment processor)
  - **Sur Place Payment**: Pay on arrival at SmartHub facility
- **Online Payment Flow**: Redirect to Paymee.tn gateway → Payment processing → Automatic status update to 'paid' in Firebase
- **Sur Place Payment Flow**: Redirect to thank you page → 3-second auto-redirect to home page → Booking status remains 'pending'
- **Payment Status Integration**: Real-time update of booking payment status based on user choice and gateway response

## Firebase Admin Authentication System (NEW - January 2025)

### Purpose & Security
- **Enterprise-Grade Authentication**: Firebase Authentication replaces hardcoded passwords
- **Authorized Admin Emails**: jalel.chniti@smarthub.com.tn and jalel.chniti@gmail.com
- **Session Management**: Firebase Auth tokens with automatic session handling
- **Security Features**: Enterprise encryption, audit logging, DDOS protection
- **Password Reset**: Integrated Firebase password reset functionality

### Technical Implementation
- **Authentication Service**: `src/services/firebaseAuthService.ts`
- **Login Page**: `src/pages/FirebaseAdminLogin.tsx` (route: `/admin/firebase-login`)
- **Protected Dashboard**: `src/pages/FirebaseAdminBookings.tsx` (route: `/admin/firebase-bookings`)
- **Auth State Management**: Real-time authentication state with listeners
- **Access Control**: Email-based admin verification with custom claims support

### Authentication Flow
1. **Login Process**: Email/password validation through Firebase Auth
2. **Admin Verification**: Check against authorized email list
3. **Session Creation**: Firebase Auth token with automatic refresh
4. **Dashboard Access**: Protected routes with authentication guards
5. **Secure Logout**: Complete session termination and token invalidation

### Firebase Configuration Requirements
- **Firebase Console Setup**: Enable Authentication > Email/Password provider
- **Admin User Creation**: Create accounts for authorized emails in Firebase Console
- **Environment Variables**: Complete Firebase configuration in `.env` file
- **Security Rules**: Email-based admin access control (production-ready)

### User Experience Features
- **Professional Login UI**: Glassmorphism design matching SmartHub aesthetics
- **Setup Instructions**: Built-in Firebase configuration guidance
- **Error Handling**: French localized error messages with user-friendly feedback
- **Loading States**: Real-time authentication status with proper loading indicators
- **Password Visibility**: Toggle for secure password entry
- **Auto-Redirect**: Seamless navigation after successful authentication

### Security Advantages Over Legacy System
- ✅ **No Hardcoded Passwords**: Eliminates security vulnerabilities in source code
- ✅ **Enterprise Infrastructure**: Google Cloud security with 99.9% uptime
- ✅ **Audit Logging**: Automatic tracking of all authentication events
- ✅ **Session Security**: Secure token-based authentication with auto-refresh
- ✅ **Password Recovery**: Integrated email-based password reset
- ✅ **Scalable Access**: Easy addition/removal of admin users
- ✅ **GDPR Compliance**: Enterprise-grade data protection

### Migration Notes
- **Legacy Routes**: Old hardcoded auth system preserved at `/admin/login` and `/admin/legacy`
- **New Primary Routes**: Firebase auth at `/admin/firebase-login` and `/admin/firebase-bookings`
- **Backward Compatibility**: Both systems operational during transition period
- **Data Consistency**: Same Firebase Realtime Database for booking data

## Admin Bookings Management System (Enhanced - January 2025)

### Purpose & Access
- **Primary Admin Route**: `/admin/firebase-bookings` - Firebase-authenticated dashboard
- **Legacy Route**: `/admin/bookings` - Previous hardcoded password system (deprecated)
- **Target Audience**: Authorized SmartHub administrators (jalel.chniti@smarthub.com.tn, jalel.chniti@gmail.com)
- **Function**: Comprehensive booking overview, filtering, and management with enterprise security

### Technical Implementation
- **Primary Location**: `src/pages/FirebaseAdminBookings.tsx` (Firebase-authenticated)
- **Legacy Location**: `src/pages/AdminBookings.tsx` (deprecated hardcoded auth)
- **Route Type**: Protected routes with authentication guards
- **Data Source**: Firebase Realtime Database synchronized with public booking system
- **Access Control**: Firebase Authentication with email-based admin verification
- **Session Management**: Automatic redirect to login if not authenticated

### Admin Dashboard Features
- **Complete Booking Overview**: All bookings with detailed information
- **Advanced Filtering**: Search by teacher, subject, contact, room, status, and date
- **Export Functionality**: CSV export of filtered booking data
- **Real-time Updates**: Automatic synchronization with Firebase database
- **Revenue Tracking**: Total paid and pending revenue calculations
- **Detailed Views**: Expandable booking details with cost breakdowns
- **Secure Session**: Firebase Auth token validation with automatic refresh
- **Admin Profile**: Display authenticated admin information and session stats
- **Bulk Operations**: Multi-select booking management with confirmation dialogs

### Data Management
- **Booking Details**: Teacher info, contact details, fee calculations, payment status
- **Cost Breakdown**: HT, VAT, TTC amounts with hourly rates
- **Status Tracking**: Pending, paid, cancelled status management
- **Fee Calculations**: Automatic calculation storage with VAT compliance
- **Revenue Analytics**: Real-time totals and financial summaries

### UI/UX Features
- **Professional Admin Design**: Glassmorphism with blue/purple gradients
- **Responsive Layout**: Mobile-friendly admin interface
- **Status Badges**: Color-coded payment status indicators
- **Interactive Filters**: Real-time search and filtering
- **Expandable Cards**: Detailed view on demand
- **Export Tools**: CSV download with date stamps

### Business Rules
- **Data Privacy**: Admin access to contact information and payment details with audit logging
- **Financial Tracking**: Complete cost transparency with VAT compliance
- **Operational Efficiency**: Quick overview and management of all bookings
- **Export Capability**: Data backup and reporting functionality
- **Access Security**: Email-based admin verification with session monitoring
- **Compliance**: Enterprise-grade authentication meeting security standards

## Quick Development Workflow

### Starting Development
```bash
npm install                  # First-time setup
npm run dev                 # Start development (localhost:5173)
```

### Firebase Admin Setup (First Time)
```bash
# 1. Configure .env file with Firebase credentials
# 2. Access Firebase Console: https://console.firebase.google.com
# 3. Enable Authentication > Email/Password provider
# 4. Create admin user accounts for authorized emails:
#    - jalel.chniti@smarthub.com.tn
#    - jalel.chniti@gmail.com
# 5. Test admin login at: http://localhost:5173/admin/firebase-login
```

### Before Committing
```bash
npm run build               # Must pass without errors
npm run lint                # Must pass without warnings
```

### Deployment Ready
- Build creates `dist/` folder ready for static hosting
- Firebase hosting configuration included with SPA routing
- Environment variables required for booking system and admin authentication (.env file)
- Firebase Console access required for admin user management
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
- **Admin Panel**: Firebase Authentication required for booking management with enterprise security
- **Legacy System**: Previous hardcoded password system deprecated in favor of Firebase Auth

## Firebase Configuration (Database Only)

### Current Firebase Setup
**Status**: ✅ **SIMPLIFIED** - Firebase Functions and email solutions removed
**Current Configuration**: Firebase Realtime Database only for booking system
**Architecture**: Frontend-only with external services for all dynamic functionality

### What's Included:
- ✅ **Firebase Realtime Database** for multi-user booking system
- ✅ **Firebase Authentication** for enterprise-grade admin security
- ✅ **CDN-based Firebase integration** (no npm firebase dependency)
- ✅ **Environment variables** for Firebase configuration (.env file)
- ✅ **Real-time synchronization** across all devices and admin sessions
- ✅ **Session management** with automatic token refresh
- ✅ **Authorized admin emails** with email-based access control
- ✅ **Hosting configuration** for Firebase deployment (optional)

### What's Been Removed:
- ❌ **Firebase Functions** (eliminated entire `/functions` directory)
- ❌ **Email notification functions** (will use Brevo for email notifications)
- ❌ **Server-side email processing** (maintaining frontend-only architecture)
- ❌ **Firebase Functions configuration** from `firebase.json`
- ❌ **Node.js server dependencies** (staying purely static)

### Advantages of Firebase-Integrated Architecture:
- ✅ **100% Static Application** (no server-side code except Firebase services)
- ✅ **Enterprise Security** (Firebase Authentication with Google infrastructure)
- ✅ **Cost-Effective** (Realtime Database + Auth, no Functions billing)
- ✅ **Simpler Deployment** (no custom authentication to manage)
- ✅ **Consistent Architecture** (all external integrations via Firebase)
- ✅ **Enhanced Security** (no hardcoded passwords, enterprise-grade encryption)
- ✅ **Easier Maintenance** (Firebase handles auth complexity)
- ✅ **Audit Compliance** (automatic logging and session tracking)

### Future Email Notifications (Brevo-Based):
If email notifications are needed, they will be implemented via:
- **Brevo transactional email API** called from frontend
- **Professional email templates** matching SmartHub design
- **Error handling** with user feedback
- **No server-side dependencies** maintaining static architecture

## Firebase Services Architecture (Updated - January 2025)

### Service Layer Implementation
**Location**: `src/services/` directory with modular Firebase service architecture

#### Firebase Authentication Service (`firebaseAuthService.ts`)
- **Enterprise Authentication**: Email/password authentication with Firebase Auth
- **Admin Access Control**: Email-based verification for authorized administrators
- **Session Management**: Real-time auth state with automatic token refresh
- **Error Handling**: French localized error messages for all authentication scenarios
- **Security Features**: Automatic logout, password reset, audit logging capabilities

#### Firebase Booking Service (`firebaseBookingService.ts`)
- **Realtime Database**: Multi-user booking system with conflict detection
- **Data Synchronization**: Real-time updates across all connected clients
- **Fee Calculations**: Automatic cost computation with VAT compliance
- **CRUD Operations**: Complete booking lifecycle management (create, read, update, delete)

#### Admin Authentication Service (`adminAuthService.ts`)
- **Legacy System**: Hardcoded password authentication (deprecated)
- **Maintained for Reference**: Transition period compatibility

### Firebase Configuration (`src/config/firebase.ts`)
- **CDN Integration**: Firebase SDK loaded via HTML script tags (no npm dependency)
- **Environment Variables**: Complete Firebase project configuration via `.env`
- **Service Initialization**: Automatic Firebase app and service initialization
- **Error Handling**: Graceful fallback when Firebase services unavailable

### Authentication Architecture

#### Admin Email Authorization
```typescript
const allowedAdminEmails = [
  'jalel.chniti@smarthub.com.tn',
  'jalel.chniti@gmail.com'
];
```

#### Authentication State Management
- **Real-time State**: Authentication state listeners with automatic updates
- **Session Persistence**: Firebase Auth handles session tokens automatically
- **Route Protection**: Authentication guards for admin routes
- **Automatic Redirects**: Seamless navigation based on authentication status

#### Security Implementation
- **Email Verification**: Admin access restricted to authorized email addresses
- **Token Security**: Firebase-managed JWT tokens with automatic refresh
- **Session Monitoring**: Real-time authentication state across browser tabs
- **Logout Protection**: Complete session termination with token invalidation

### Development Environment Setup

#### Firebase Console Configuration Required
1. **Project Setup**: Use existing `u-smart-booking` Firebase project
2. **Authentication Enable**: Enable Email/Password provider in Authentication section
3. **Admin User Creation**: Manually create admin accounts in Firebase Console > Authentication > Users
4. **Database Rules**: Configure Realtime Database rules for booking system

#### Environment Variables (`.env` file)
```bash
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=AIzaSyBnjZRrhG7qmJqcZcJWO7FnN2LznNSk07k
VITE_FIREBASE_AUTH_DOMAIN=u-smart-booking.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://u-smart-booking-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=u-smart-booking
VITE_FIREBASE_STORAGE_BUCKET=u-smart-booking.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=512917348858
VITE_FIREBASE_APP_ID=1:512917348858:web:77d83cc427db118f118443

# Legacy Admin Protection (Deprecated)
VITE_ADMIN_PASSWORD=SmartHub2025Admin!
```

### Route Protection Strategy
- **Public Routes**: All standard pages accessible without authentication
- **Protected Admin Routes**: Firebase Authentication required for admin dashboard access
- **Automatic Redirects**: Unauthenticated users redirected to login page
- **Session Validation**: Real-time authentication state monitoring

### Error Handling & User Experience
- **French Localization**: All authentication messages in French language
- **Professional UI**: Glassmorphism design consistent with SmartHub branding
- **Loading States**: Real-time feedback during authentication processes
- **Setup Guidance**: Built-in Firebase configuration instructions for administrators
- **Fallback Support**: Graceful degradation when Firebase services unavailable

### Production Deployment Considerations
- **Environment Security**: Firebase configuration via environment variables only
- **Admin User Management**: Use Firebase Console for production admin account creation
- **Database Rules**: Implement proper Firebase Realtime Database security rules
- **CDN Reliability**: Firebase SDK served via Google CDN for optimal performance
- **Monitoring**: Firebase Console provides authentication analytics and user management

## Payment Integration System (NEXT PRIORITY - January 2025)

### Paymee.tn Integration Architecture
- **Payment Gateway**: Paymee.tn (Tunisia's leading payment processor)
- **Integration Method**: Frontend redirect integration maintaining static architecture
- **Payment Flow**: Post-booking payment choice → Gateway redirect → Callback handling → Firebase status update
- **Security**: Paymee.tn handles all payment processing, SmartHub receives payment confirmations only

### Implementation Plan

#### Phase 1: Payment Choice Modal (Next Implementation)
- **Location**: `src/components/ui/PaymentChoiceModal.tsx`
- **Trigger**: After successful booking submission to Firebase
- **UI Features**: Professional modal with two clear payment options
- **User Experience**: 
  - Modal appears immediately after booking confirmation
  - Clear pricing display with total amount
  - Two prominent buttons: "Payer en ligne" and "Payer sur place"
  - Professional design matching SmartHub glassmorphism aesthetics

#### Phase 2: Paymee.tn Integration Components
- **Payment Service**: `src/services/paymeePaymentService.ts`
- **Payment Success Page**: `src/pages/PaymentSuccess.tsx`
- **Payment Failure Page**: `src/pages/PaymentFailure.tsx`
- **Booking Thank You Page**: `src/pages/BookingThankYou.tsx` (for sur place payments)

#### Phase 3: Payment Flow Implementation
1. **Sur Place Payment Flow**:
   - User selects "Payer sur place"
   - Immediate redirect to `BookingThankYou.tsx`
   - Thank you page displays booking confirmation
   - Auto-redirect to home page after 3 seconds
   - Booking status remains 'pending' in Firebase

2. **Online Payment Flow**:
   - User selects "Payer en ligne"
   - Redirect to Paymee.tn gateway with booking details
   - Payment processing at Paymee.tn
   - Success: Return to `PaymentSuccess.tsx` + Update Firebase status to 'paid'
   - Failure: Return to `PaymentFailure.tsx` + Booking status remains 'pending'

#### Phase 4: Route Configuration Updates
```typescript
// New routes to add to src/App.tsx
- **Payment Success**: `/payment/success` - Paymee.tn success callback
- **Payment Failure**: `/payment/failure` - Paymee.tn failure callback  
- **Booking Thank You**: `/booking/thank-you` - Sur place payment confirmation
```

### Technical Implementation Details

#### Payment Choice Modal Component
- **Modal Trigger**: Show after successful `FirebaseBookingService.createBooking()`
- **Props**: `{ bookingId: string, totalAmount: number, onClose: () => void }`
- **State Management**: Local state for payment method selection
- **Responsive Design**: Mobile-first with clear call-to-action buttons

#### Firebase Integration Updates
- **Booking Status Enhancement**: Ensure 'pending' status is set initially
- **Payment Status Update**: Function to update status to 'paid' after Paymee success
- **Booking Retrieval**: Method to retrieve booking details for payment processing

#### Paymee.tn Integration Requirements
- **Merchant Account**: SmartHub merchant account with Paymee.tn
- **API Configuration**: Payment gateway configuration and callback URLs
- **Environment Variables**: Paymee API keys and merchant settings
- **Security**: Payment amount verification and callback validation

### User Experience Flow
1. **User completes booking form** → Firebase booking created with 'pending' status
2. **Payment choice modal appears** → User selects payment method
3. **Sur Place Option**: Thank you page → 3-second auto-redirect to home
4. **Online Option**: Paymee.tn gateway → Payment → Success/Failure page
5. **Status Updates**: Firebase booking status updated based on payment outcome

### Business Benefits
- **Increased Conversions**: Multiple payment options reduce booking abandonment
- **Cash Flow**: Online payments provide immediate revenue
- **Operational Efficiency**: Automatic payment status tracking
- **User Convenience**: Choice between online and on-site payment

### Future Enhancements (Later Phases)
- **Email Notifications**: Brevo integration for payment confirmations
- **SMS Notifications**: Payment confirmations via SMS
- **Payment Analytics**: Revenue tracking and payment method analytics
- **Refund System**: Integration with Paymee.tn refund capabilities

## Future Development Roadmap

### ❌ Fonctionnalités Futures (Non Implémentées)
- Backend API avec base de données relationnelle
- Notifications email automatiques via Brevo
- Gestion avancée des utilisateurs avec rôles personnalisés
- Système de facturation automatique
- Intégration CRM avancée