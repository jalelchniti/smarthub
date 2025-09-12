# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Architecture Overview

**Static Frontend-Only React Application** - No backend services except Firebase Realtime Database and Authentication.

**Key Features**:
- ✅ 17 React SPA routes with TypeScript + Vite
- ✅ Firebase Realtime Database (booking system) + Authentication (admin access)  
- ✅ Brevo form integration for lead collection
- ✅ WhatsApp contact integration (+216 99 456 059)
- ✅ Revenue Simulator with SmartHub income protection policy (private route)
- ✅ Multi-user room booking system with real-time synchronization
- ✅ Enterprise-grade admin authentication (Firebase Auth)
- ✅ Payment choice modal system with offline/online options
- ✅ Static deployment ready for any hosting platform

**Development Constraints**:
- No backend endpoints - use external services only (Brevo, WhatsApp, Firebase)
- Focus on frontend-only features and integrations
- All dynamic functionality via Firebase services or external APIs
- Firebase integration uses CDN scripts (no npm package) - see index.html

## Essential Development Commands

**Daily Development Workflow**:
```bash
npm install    # First-time setup
npm run dev    # Development server (localhost:5173)
```

**CRITICAL - Pre-commit requirements (MUST pass before committing)**:
```bash
npm run build  # TypeScript + Vite build - catches TypeScript errors
npm run lint   # ESLint checks - catches code quality issues
```

**Production Build & Preview**:
```bash
npm run build   # Creates dist/ folder for deployment
npm run preview # Preview the production build locally
```

**Testing**: Manual testing only (no automated test framework configured)

**Key npm Scripts**:
- `npm run dev` - Start Vite development server with HMR
- `npm run build` - TypeScript compilation + Vite production build  
- `npm run lint` - ESLint with TypeScript and React rules
- `npm run preview` - Preview production build locally

**Common Development Tasks**:
- **Add new page**: Create component in `src/pages/`, add route in `src/App.tsx`
- **Add new UI component**: Create in `src/components/ui/`, follow existing patterns
- **Update Firebase rules**: Use `update-firebase.html` utility or Firebase Console
- **Add new form field**: Remember uppercase names for Brevo compatibility
- **Debug Firebase**: Check browser console and Firebase Console for auth/database errors

### Deployment Configuration
**Server configuration files** (CRITICAL for SPA routing):
- `.htaccess` - Apache server configuration with MIME types and SPA routing
- `web.config` - IIS server configuration with URL rewrite rules  
- `netlify.toml` - Netlify hosting configuration with redirects and headers
- `public/_redirects` - Netlify-specific redirects (takes precedence over netlify.toml)

### Resolved Deployment Issues (September 2025)

#### MIME Type Error - RESOLVED ✅
**Previous Issue**: Assets served as HTML instead of correct MIME types on production server.

**Root Cause Identified**: 
1. **Vite Configuration**: `base: './'` created relative asset paths that broke on nested routes
2. **Apache Rewrite Rules**: SPA redirect rules were catching asset requests

**Solutions Applied**:
- ✅ **Fixed Vite Config**: Changed `base: './'` to `base: '/'` for absolute asset paths
- ✅ **Enhanced .htaccess**: Added explicit asset protection rules before SPA routing
- ✅ **Rebuilt Application**: All assets now use absolute `/assets/` paths

**Current Working Configuration** (`.htaccess`):
```apache
# Explicitly serve static files with correct MIME types
RewriteCond %{REQUEST_URI} \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ [NC]
RewriteRule ^.*$ - [L]

# Protect assets directory specifically
RewriteRule ^assets/ - [L]

# Then handle SPA routing for everything else
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Result**: All production routes including `/admin/firebase-login` now load correctly with proper MIME types.

## Critical Development Rules

### Navigation & Form Patterns
- **React Router ONLY**: Always use `useNavigate()` hook, never `window.location.href`
- **Brevo Form Fields**: CRITICAL - Always use uppercase field names (`NOM`, `PRENOM`, `EMAIL`) for compatibility
- **Form Redirects**: Use local thank you pages with React Router navigation

### Firebase Integration  
- **Hybrid Architecture**: Firebase npm package installed for TypeScript support + CDN scripts in HTML for runtime
- **CDN Scripts**: Firebase 10.7.1 compat versions loaded via HTML `<script>` tags in `index.html`
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
- React 19.1 + TypeScript 5.8 + Vite 7.1
- Tailwind CSS 3.4 (custom blue/purple gradients, glassmorphism effects)
- React Router DOM 7.8 (client-side routing)
- Firebase 10.7.1 (Realtime Database + Authentication via CDN)
- Lucide React (icons), ESLint 9.33, Prettier 3.6.2

### Application Architecture

**Route Structure** (`src/App.tsx`):
- **Public with Navigation**: `/` (Home), `/rooms`, `/teachers`, `/learn-more`, `/revenue-simulator`, `/booking-system` - with Navigation + Footer
- **Registration Pages**: `/register/student`, `/register/teacher` - standalone pages with custom navigation
- **Thank You Pages**: `/thank-you/student`, `/thank-you/teacher` - standalone without navigation/footer
- **Payment Pages**: `/booking/thank-you`, `/payment/online-coming-soon` - standalone without navigation/footer
- **Legacy Private Routes**: `/simulation`, `/booking` - hidden routes for backward compatibility
- **Admin Authentication**: `/admin/login` (legacy), `/admin/firebase-login` (current)
- **Admin Dashboard**: `/admin/bookings` (deprecated), `/admin/firebase-bookings` (current), `/admin/legacy` (reference)

**Key Service Architecture**:
```
src/
├── services/                    # Firebase service layer (3 services)
│   ├── firebaseAuthService.ts      # Admin authentication (current)
│   ├── firebaseBookingService.ts   # Booking CRUD + fee calculations
│   └── adminAuthService.ts         # Legacy auth (deprecated)
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx, Card.tsx, Input.tsx  # UI primitives
│   │   ├── StudentSubscriptionForm.tsx      # Brevo student forms
│   │   ├── TeacherSubscriptionForm.tsx      # Brevo teacher forms
│   │   └── PaymentChoiceModal.tsx           # Payment method selection
│   ├── Navigation.tsx           # Main navigation with responsive design
│   ├── Footer.tsx              # Site footer with business info
│   └── GoogleMapEmbed.tsx      # Embedded Google Maps component
├── pages/                       # 17 page components
│   ├── Home.tsx, Rooms.tsx, Teachers.tsx, LearnMore.tsx    # Public pages
│   ├── RevenueSimulator.tsx                               # Income calculator
│   ├── BookingSystem.tsx                                 # Room booking system
│   ├── FirebaseAdminLogin.tsx, FirebaseAdminBookings.tsx # Admin system
│   ├── StudentRegistration.tsx, TeacherRegistration.tsx  # Registration
│   ├── BookingThankYou.tsx, PaymentOnlineComingSoon.tsx  # Payment flow
│   └── [Other admin and thank you pages]
```

## Key Configuration Files

- **`vite.config.ts`**: Build configuration with absolute base path (`/`) for proper asset serving, asset file naming with hashes, CORS headers for dev server
- **`package.json`**: Dependencies - React 19.1, TypeScript 5.8, Vite 7.1, Firebase 10.7.1 (npm + CDN hybrid), Tailwind CSS 3.4, React Router DOM 7.8
- **`tsconfig.json`**: Project references architecture with separate app/node configs
- **`tailwind.config.js`**: Custom design system with primary/secondary colors (blue/purple gradients), Inter font family
- **`eslint.config.js`**: TypeScript-ESLint flat config with React hooks and refresh plugins
- **`firebase.json`**: Firebase hosting config with SPA rewrites (all routes → /index.html)
- **`index.html`**: Firebase CDN scripts (10.7.1), Brevo forms CSS/JS, meta tags for SEO

## Environment Configuration

**Firebase Environment Variables** (`.env` file required for booking system and admin authentication):
- `VITE_FIREBASE_API_KEY` - Firebase project API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_DATABASE_URL` - Firebase Realtime Database URL
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID

**OVH Hosting Configuration** (production deployment):
- `OVH_FTP_Login` - OVH FTP username for file uploads
- `OVH_FTP_Folder` - Target folder on OVH server (./smarthub)
- `OVH_FTP_Password` - FTP access password
- `OVH_FTP_URL` - FTP server URL for file transfers
- `OVH_SSH_URL` - SSH access for server management
- `OVH_MAILING_LIST_NEWSLETTER` - Newsletter mailing list address
- `OVH_MAILING_LIST_OWNER` - Admin email for mailing list management
- `OVH_MAILING_LIST_SUBSCRIBE` - Subscription endpoint
- `OVH_MAILING_LIST_UNSUBSCRIBE` - Unsubscription endpoint

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

### Common Development Pitfalls to Avoid
- **TypeScript Build Errors**: Unclosed JSX elements, unused imports (ESLint fails build)
- **Navigation Issues**: Never use `window.location.href`, always `useNavigate()` from React Router
- **Firebase CDN Issues**: Firebase scripts are in index.html (CDN), not npm packages
- **Form Field Names**: MUST be uppercase for Brevo (`NOM`, `PRENOM`, `EMAIL`)
- **Route Confusion**: Use public routes `/revenue-simulator`, `/booking-system` for user access
- **Missing Dependencies**: Include all dependencies in useEffect hooks to avoid warnings

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
- **Hours**: Mon-Sat (9:00-13:00, 15:00-18:00), Sun (10:00-13:00)
- **Services**: Teacher workspace rental (3 rooms), in-person educational services connecting competent teachers with serious students

## Deployment

### Hosting-Agnostic Static Site Deployment
**Repository**: https://github.com/jalelchniti/smarthub.git
**Branch**: master
**Production Hosting**: OVH shared hosting via FTP deployment
**Live Application**: https://www.smarthub.com.tn (deployed September 11, 2025)

**Build Process**:
```bash
# Build production version
npm run build

# Deploy dist/ contents to any static hosting provider
# Primary: OVH shared hosting via manual FTP upload to domain root
# Files deployed at root level (/) for direct access at www.smarthub.com.tn
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
- **Sunday availability**: 10:00 AM - 1:00 PM only
- **Mon-Sat availability**: 9:00 AM - 1:00 PM, 3:00 PM - 6:00 PM (with lunch break 1:00-3:00 PM)
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

### Payment Flow & User Experience (✅ IMPLEMENTED - September 2025)
- **Post-Booking Payment Choice**: After successful Firebase booking submission, user is presented with payment options via professional modal
- **Payment Methods**: 
  - **Online Payment**: "Coming Soon" page with future Paymee.tn integration details
  - **Sur Place Payment**: Pay on arrival at SmartHub facility
- **Online Payment Flow**: Redirect to PaymentOnlineComingSoon page → User can return home or make new booking
- **Sur Place Payment Flow**: Redirect to BookingThankYou page → 3-second countdown with auto-redirect to home page → Booking status remains 'pending'
- **Payment Choice Modal**: Professional glassmorphism modal showing booking total and count with clear payment options
- **Enhanced UX**: Smooth transitions, countdown timers, manual navigation options, and consistent SmartHub branding

### Payment Choice Components (✅ IMPLEMENTED - September 2025)

#### PaymentChoiceModal (`src/components/ui/PaymentChoiceModal.tsx`)
- **Purpose**: Modal dialog for payment method selection after successful booking
- **Props**: `isOpen`, `onClose`, `totalAmount`, `bookingCount`
- **Features**: Professional glassmorphism design, booking summary, two clear payment options
- **Navigation**: Routes to appropriate payment pages based on user choice
- **Form Reset**: Automatically resets booking form and closes all modals on selection

#### PaymentOnlineComingSoon (`src/pages/PaymentOnlineComingSoon.tsx`)
- **Route**: `/payment/online-coming-soon` (standalone page without navigation/footer)
- **Purpose**: "Coming Soon" page for online payment with future features preview
- **Features**: Professional design, contact information for offline payment, navigation options
- **Future Integration**: Placeholder for Paymee.tn payment gateway implementation

#### BookingThankYou (`src/pages/BookingThankYou.tsx`)
- **Route**: `/booking/thank-you` (standalone page without navigation/footer)
- **Purpose**: Confirmation page for offline payment choice with auto-redirect
- **Features**: 3-second countdown timer, manual navigation options, booking confirmation details
- **Auto-Navigation**: Automatic redirect to home page after 3 seconds
- **Business Info**: Contact details and next steps for payment at SmartHub facility

#### Booking System Integration
- **Modified Flow**: `BookingSystem.tsx` now shows PaymentChoiceModal instead of alert on successful booking
- **State Management**: Added `showPaymentChoice`, `bookingTotal`, `bookingCount` state variables
- **Fee Calculation**: Automatically calculates total amount for payment choice display
- **Error Handling**: Maintains original error flow for failed bookings

## Rooms Page Navigation Enhancement (✅ IMPLEMENTED - September 2025)

### Purpose & Features
- **Enhanced User Experience**: Added direct navigation buttons to key SmartHub tools from Rooms page
- **Strategic Placement**: Navigation buttons positioned above WhatsApp CTA for maximum visibility
- **Responsive Design**: Buttons stack vertically on mobile, horizontally on desktop
- **Professional Styling**: Glassmorphism effects consistent with SmartHub design system

### Navigation Buttons Implementation
- **Revenue Simulator Button**: Routes to `/revenue-simulator` (public route with header/footer)
- **Booking System Button**: Routes to `/booking-system` (public route with header/footer)
- **Visual Hierarchy**: Simulator button uses subtle white/transparent styling, booking button uses prominent blue styling
- **Icons**: Calculator icon for simulator, BookOpen icon for booking system
- **Hover Effects**: Scale transform and color transitions for enhanced interactivity

### Technical Implementation
- **Location**: `src/pages/Rooms.tsx` - added above existing WhatsApp CTA section
- **Navigation**: Uses `useNavigate()` hook for React Router navigation
- **Responsive Classes**: `flex-col sm:flex-row` for mobile-first responsive layout
- **Accessibility**: Full keyboard navigation support with proper button semantics

### Public Route Access
- **New Public Routes**: Both `/revenue-simulator` and `/booking-system` now accessible with full navigation and footer
- **Maintained Legacy**: Original private routes `/simulation` and `/booking` preserved for backward compatibility
- **SEO Benefits**: Public routes improve discoverability and user access to key tools

### User Experience Flow
1. **User visits Rooms page** → Sees room information and pricing
2. **Navigation buttons displayed** → Clear call-to-action for next steps
3. **Revenue Simulator access** → Teachers can calculate potential earnings with full site navigation
4. **Booking System access** → Users can make reservations with full site navigation
5. **WhatsApp contact** → Final fallback for direct communication

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
- **Setup Instructions**: Available on-demand (no automatic popup interruption)
- **Error Handling**: French localized error messages with user-friendly feedback
- **Loading States**: Real-time authentication status with proper loading indicators
- **Password Visibility**: Toggle for secure password entry
- **Auto-Redirect**: Seamless navigation after successful authentication
- **Non-Intrusive Experience**: Configuration popup removed from automatic display

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

### Deployment Status (September 2025)
- ✅ **Production Deployed**: https://www.smarthub.com.tn
- ✅ **All Files Uploaded**: Root level deployment (index.html, assets/, images/)
- ✅ **Server Configuration**: Enhanced .htaccess with asset protection rules
- ✅ **Static Assets**: All CSS, JS bundles, and images properly served with correct MIME types
- ✅ **SPA Routing**: All routes including `/admin/firebase-login` load correctly
- ✅ **MIME Type Issues**: Resolved through Vite config and Apache configuration fixes
- ✅ **Firebase Integration**: Ready for testing on production (configuration popup removed)
- ✅ **Payment Choice Enhancement**: Deployed September 11, 2025 with new payment flow components

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
- **Payment Choice Flow**: CRITICAL - After booking success, PaymentChoiceModal appears automatically (no more alert messages)
- **Auto-Redirect**: BookingThankYou page auto-redirects to home after 3 seconds for smooth UX
- **Public Tool Access**: CRITICAL - Use `/revenue-simulator` and `/booking-system` for public access with navigation/footer
- **Legacy Routes**: Private routes `/simulation` and `/booking` still work but are hidden from public navigation

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

## Firebase Services Architecture (Updated - September 2025)

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

## Payment Integration System (✅ PHASE 1 COMPLETE - September 2025)

### Current Implementation Status
- **✅ Phase 1 Complete**: Payment choice modal and user experience flow fully implemented
- **🔄 Phase 2 Pending**: Paymee.tn gateway integration for online payments
- **✅ Sur Place Flow**: Complete offline payment experience with confirmation and auto-redirect

### Paymee.tn Integration Architecture (Future Phase 2)
- **Payment Gateway**: Paymee.tn (Tunisia's leading payment processor)
- **Integration Method**: Frontend redirect integration maintaining static architecture
- **Payment Flow**: Post-booking payment choice → Gateway redirect → Callback handling → Firebase status update
- **Security**: Paymee.tn handles all payment processing, SmartHub receives payment confirmations only

### ✅ Phase 1: Payment Choice Modal (COMPLETED - September 2025)
- **Location**: `src/components/ui/PaymentChoiceModal.tsx` ✅
- **Trigger**: After successful booking submission to Firebase ✅
- **UI Features**: Professional modal with two clear payment options ✅
- **User Experience**: ✅
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