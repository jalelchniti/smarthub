# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Current Implementation Status

**IMPORTANT**: This is a **static frontend-only** React application. The README.md describes some backend features that are **NOT YET IMPLEMENTED**.

**Current Reality**:
- ✅ Static React SPA with 6 routes (Home, Rooms, Teachers, LearnMore + thank you pages)
- ✅ Brevo form integration for lead collection
- ✅ WhatsApp contact integration (+216 99 456 059)
- ✅ Static deployment ready for any hosting platform
- ❌ NO backend server currently exists
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
- **ESLint 9.34** with TypeScript support and React hooks plugin
- **Static Architecture**: No backend - all content is static with form submissions via external services

### Application Architecture

**Route Structure** (defined in `src/App.tsx`):
- **Main Pages**: `/` (Home), `/rooms`, `/teachers`, `/learn-more` - Include Navigation + Footer
- **Thank You Pages**: `/thank-you/student`, `/thank-you/teacher` - Standalone pages without nav/footer
- **Registration Pages**: `/register/student`, `/register/teacher` - Full page forms with own nav/footer

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
│   └── TeacherRegistration.tsx # Full page form (simplified 3-field)
├── App.tsx                    # Route configuration and layout logic
└── main.tsx                   # Application entry point
```

## Key Configuration Files

- **`vite.config.ts`**: Build configuration with relative base path (`./`) for hosting-agnostic deployment
- **`package.json`**: Dependencies and build scripts - React 19, TypeScript 5.8, Vite 7.1
- **`tsconfig.json`**: TypeScript project references architecture (app + node configs)
- **`tailwind.config.js`**: Custom design system (blue/purple gradients, Inter font)
- **`eslint.config.js`**: Code quality rules with TypeScript and React hooks support

## Environment Configuration

**No `.env` file required** - this is a static site that works without environment variables.
**Future environment variables** (when backend is implemented):
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
- No environment variables or server setup required
- All modern hosting platforms supported

## Important Notes

- **Form Field Names**: CRITICAL - Always use uppercase (`NOM`, `PRENOM`, `EMAIL`) for Brevo compatibility
- **React Router Navigation**: CRITICAL - Always use `useNavigate()` hook, never `window.location.href`
- **Static Architecture**: No backend - Brevo handles form submissions and email automation
- **French Localization**: All content fully localized in French language
- **Premium Design**: Gradient backgrounds and glassmorphism effects throughout
- **Privacy Compliant**: Lead data via Brevo, no personal data storage on site