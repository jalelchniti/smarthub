# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartHub is a React + TypeScript educational platform built with Vite, featuring a progressive integration architecture that bridges static content display with dynamic backend functionality. The platform serves as both an informational showcase for a local educational facility in Tunis City Center and a fully functional workspace management system with authentication, booking, and real-time features.

## Essential Development Commands

### Frontend Commands
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Backend Commands (from `/backend` directory)
- `npm run dev` - Start backend development server with tsx watch (http://localhost:3001)
- `npm run build` - Build backend (TypeScript compilation)
- `npm run start` - Start production backend server
- `npm run test` - Run Jest tests with coverage
- `npm run lint` - Run ESLint for backend code quality

### Database Commands (from `/backend` directory)
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database (SQLite dev)
- `npm run db:migrate` - Create and apply database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with initial data

### Single Test Execution
- `npm test -- --testPathPattern=specific-test.test.ts` - Run specific test file

## Architecture & Tech Stack

### Frontend Stack
- **React 19** with TypeScript 5.8
- **Vite 7.1** for build tooling and development server
- **Tailwind CSS 3.4** for styling with custom color palette
- **React Router DOM 7.8** for client-side routing
- **Socket.IO Client 4.8** for real-time WebSocket connections
- **Lucide React** for icons

### Backend Stack (Dual Architecture)
**Development/Local Backend (Full MVC):**
- **Node.js + Express 4.21** with TypeScript in clean MVC pattern
- **Prisma ORM 5.22** with SQLite (development) and PostgreSQL (production)
- **JWT Authentication** with bcrypt hashing and email verification
- **Socket.IO WebSocket server** for real-time features
- **Redis** for session storage and caching
- **Role Management** with hybrid role system

**Production Backend (OVH CGI):**
- **Node.js CGI** execution model for shared hosting
- **MySQL database** with full authentication system
- **Stateless API endpoints** via query parameters
- **CORS-enabled** for cross-origin requests

### Project Structure
```
src/                      # Frontend React application
├── components/           # React components
│   ├── notifications/   # Real-time notification components
│   ├── dashboard/       # Live dashboard components
│   ├── calendar/        # Live calendar components
│   └── messaging/       # Real-time messaging components
├── pages/               # Page components (Home, Auth, dashboards)
├── contexts/            # React contexts (Auth, Notifications)
├── hooks/               # Custom React hooks
├── services/            # API and WebSocket services
└── types/               # TypeScript type definitions

backend/                 # Node.js + Express API server (MVC)
├── src/
│   ├── controllers/     # API route handlers
│   ├── services/        # Business logic layer
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Auth, security middleware
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Express server
└── prisma/
    ├── schema.prisma    # Database schema
    └── seed.ts          # Database seed data
```

## Environment Configuration

### Frontend Environment (copy `.env.example` to `.env`)
- `VITE_USE_BACKEND=true` - Enable backend integration
- `VITE_API_URL=http://localhost:3001/api` - Backend API URL for development
- `VITE_EMAIL_VERIFICATION=false` - Email verification features
- `VITE_REAL_TIME_FEATURES=false` - Real-time WebSocket features

### Backend Environment (copy `backend/.env.example` to `backend/.env`)
- `DATABASE_URL="file:./dev.db"` - Database connection (SQLite dev)
- `JWT_SECRET` - JWT token signing key
- `JWT_EXPIRES_IN=7d` - Token expiration time
- `PORT=3001` - Server port
- `NODE_ENV=development` - Environment mode
- `FRONTEND_URL=http://localhost:5173` - Frontend URL for CORS

## Critical Development Rules

### Build Requirements
- **ALWAYS** run `npm run build` and `npm run lint` before committing
- **ALWAYS** verify zero build errors before deployment discussions
- **NEVER** commit without successful build verification

### Privacy Protection Policy
**CRITICAL: No personal data shall be displayed in public pages**
- **Public Pages**: NO personal teacher data, names, photos, or private information
- **Contact Integration**: All contact buttons must use WhatsApp +216 99 730 144
- **Data Protection**: Individual teachers' personal data secured in backend only
- **Public Content**: Only facility information, subjects, and general statistics allowed

### Financial Information Policy
**CRITICAL: Money references are ONLY allowed in SuperAdmin Dashboard**
- **SuperAdmin Dashboard**: Full financial data (revenue, earnings, payments)
- **All Other Dashboards**: NO money references whatsoever
- **Replacement Metrics**: Use engagement, sessions, interactions, completions instead

### Styling Guidelines
**CRITICAL: All content must be center-aligned**
- Global CSS rules: `* { text-align: center; }` in `src/index.css`
- Extensive use of `text-center` classes on all elements
- **Interactive Elements Protection**: Explicit left alignment for buttons, inputs, forms

### Architecture Patterns
- **Progressive Integration**: Frontend operates with static data or dynamic backend via feature flags
- **Component-Based Design**: Reusable UI components with consistent styling patterns
- **Premium Design System**: Gradient backgrounds, glassmorphism effects, hover animations

## Dashboard System

The platform features **13 specialized dashboards** with unique gradient themes:

### SuperAdmin Dashboard (1)
- **SuperAdmin**: `/super-admin` - Royal purple with crown theme, platform oversight

### Specialized Admin Dashboards (10)
- **General Admin**: `/generaladmin` - Blue gradient, platform administration
- **Teacher Admin**: `/teacheradmin` - Green gradient, education management
- **Content Admin**: `/contentadmin` - Purple gradient, content management
- **Marketing Admin**: `/marketingadmin` - Pink gradient, marketing operations
- **Analytics Admin**: `/analyticsadmin` - Cyan gradient, analytics
- **Financial Admin**: `/financialadmin` - Yellow gradient, financial management
- **Support Admin**: `/supportadmin` - Gray gradient, support management
- **Academic Admin**: `/academicadmin` - Emerald gradient, academics
- **Safety Admin**: `/safetyadmin` - Red gradient, safety & compliance
- **User Admin**: `/useradmin` - Indigo gradient, user management

### User Self-Service Dashboards (2)
- **Teacher Dashboard**: `/teacher` - Emerald theme, session & performance management
- **Student Dashboard**: `/student` - Blue theme, booking & progress tracking

### Authentication & Access
- **Route Protection**: ProtectedRoute component with role-based access
- **Temporary Bypass**: All dashboards accessible without login for development
- **Default Test Accounts**: See README.md for account credentials

## Business Context

**SmartHub Educational Facility - Tunis City Center**
- **Address**: Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis
- **Contact**: +216 99 730 144 | contact@smarthub.com.tn
- **Hours**: Mon-Fri (8:00-20:00), Sat-Sun (9:00-18:00)
- **Services**: Teacher workspace rental (3 rooms), in-person educational services only

## Quick Development Workflow

### Starting Development
1. Start frontend: `npm run dev` (localhost:5173)
2. Start backend: `cd backend && npm run dev` (localhost:3001)
3. Access dashboards directly via URLs (auth bypass enabled)

### Backend Setup (First Time)
```bash
cd backend
cp .env.example .env          # Configure environment
npm run db:generate          # Generate Prisma client  
npm run db:push             # Apply schema changes
npm run test                # Verify functionality
```

### Adding New Features
1. **Always** run `npm run build` first to verify current state
2. **Always** maintain French localization for all new features
3. **Always** preserve center-alignment styling patterns
4. Create appropriate test coverage for backend changes

### Common Build Issues
- Unclosed JSX elements (most common)
- Unmatched brackets/parentheses in JSX
- Unused imports (warnings become errors)
- Type assignment issues ('any' to strict types)

## Real-Time Features

### WebSocket Infrastructure
- **Socket.IO Server**: Complete WebSocket server with JWT authentication
- **Real-Time Notifications**: 14+ notification types with instant delivery
- **Live Dashboard Updates**: Periodic stats broadcasting every 30 seconds
- **Instant Messaging**: Real-time conversations with read receipts
- **Live Calendar**: Real-time booking and session event broadcasting

### Frontend Real-Time Components
- **NotificationProvider**: React context for notification state
- **NotificationToast**: Animated toast notifications with priority-based styling
- **NotificationCenter**: Comprehensive notification history with filtering
- **MessagingInterface**: Complete chat UI with conversations
- **Live Dashboard**: Real-time stats and activity feeds

## API Endpoints

### Development Backend (Express MVC)
```
/api/auth                   - Authentication endpoints
/api/notifications          - Notification management
/api/calendar/events        - Live calendar events
/api/dashboard/overview     - Dashboard data with live metrics
/api/conversations          - Conversation management
/api/messages               - Real-time message operations
```

### Production Backend (OVH CGI)
```
/smarthub/api.cgi?endpoint=test     - API health check
/smarthub/api.cgi?endpoint=rooms    - Room data and availability
/smarthub/api.cgi?endpoint=auth     - Authentication system
/smarthub/api.cgi?endpoint=users    - User management
```

## Key Configuration Files

**Frontend:**
- `vite.config.ts` - Vite configuration with React plugin and base path
- `tailwind.config.js` - Custom colors and Inter font family
- `tsconfig.json` - Project references architecture
- `eslint.config.js` - ESLint with TypeScript and React rules

**Backend:**
- `backend/tsconfig.json` - Backend TypeScript configuration
- `backend/prisma/schema.prisma` - Complete database schema with all models

## Deployment to OVH

### Automated Git Deployment (Primary Method)
**Repository**: https://github.com/jalelchniti/smarthubnew.git
**Branch**: master
**Target Domain**: www.smarthub.com.tn → `/smarthub/` folder

**OVH Git Integration**:
- **Webhook URL**: OVH-provided webhook endpoint
- **Automatic Build**: Configured for `npm run build` if Node.js available
- **Deploy Trigger**: Push to `master` branch
- **Status**: DNS configured correctly, domains propagating

### Manual Deployment (Backup Method)
**FTP/SSH Credentials**:
- **Host**: fohaixl.cluster100.hosting.ovh.net
- **FTP Server**: ftp.cluster100.hosting.ovh.net
- **SSH Server**: ssh.cluster100.hosting.ovh.net:22
- **Username**: fohaixl
- **Password**: [Reset via OVH Manager - documented passwords may be outdated]
- **Deploy Directory**: `/www/smarthub/`

**Frontend Deployment**:
```bash
# Build production version
npm run build

# Upload via FileZilla or SCP
# Target: /www/smarthub/ directory
```

**Backend Deployment**:
```bash
# Upload api.cgi via FTP
# Set executable permissions: chmod 755 api.cgi
```

### Database Configuration
- **MySQL Host**: fohaixladmin.mysql.db
- **Database**: fohaixladmin
- **User**: fohaixladmin
- **Password**: database@122 (as configured in api.cgi)

### Git Integration Setup
**GitHub Repository**: https://github.com/jalelchniti/smarthubnew.git
**GitHub Webhook**: Configured with OVH-provided webhook URL
**OVH Configuration**: www.smarthub.com.tn domain → smarthub folder

**Common Issues**:
- **AttachedDomain not found**: Ensure domain is properly configured in Multisite
- **404 webhook errors**: Wait for DNS propagation before activating Git
- **Git status "Inactif"**: Domain configuration needs to propagate first

### Live URLs After Deployment
- **Primary URL**: https://smarthub.com.tn/ (DNS configured, propagating)
- **Secondary URL**: https://www.smarthub.com.tn/ (DNS configured, propagating)
- **Additional Domain**: https://u-smart.tn/ (DNS configured, propagating)
- **Additional Domain**: https://www.u-smart.tn/ (DNS configured, propagating)
- **Fallback URL**: http://fohaixl.cluster100.hosting.ovh.net/smarthub/
- **Backend API**: http://fohaixl.cluster100.hosting.ovh.net/smarthub/api.cgi
- **API Test**: http://fohaixl.cluster100.hosting.ovh.net/smarthub/api.cgi?endpoint=status

## Important Development Notes

- **Contact Integration**: WhatsApp primary contact when backend is disabled
- **Progressive Authentication**: Registration/Login available when `VITE_USE_BACKEND=true`
- **French Localization**: All dashboards fully localized in French
- **Privacy Protection**: Individual teachers' personal data secured in backend
- **Content Validation**: French/Arabic profanity detection across form inputs
- **Activity Logging**: Comprehensive tracking with filtering and export capabilities
- **Git Deployment Preferred**: Use OVH Git integration for automatic deployment
- **Webhook Integration**: GitHub pushes trigger automatic deployments via OVH webhook
- **Fallback Methods**: FTP/SSH available for manual deployment when needed

## DNS Configuration (Updated)

**Current Status**: Both domains correctly configured and propagating

### Domain Setup
- **smarthub.com.tn** → A record → `5.135.23.164` (OVH server)
- **www.smarthub.com.tn** → A record → `5.135.23.164` (OVH server)
- **u-smart.tn** → A record → `5.135.23.164` (OVH server)
- **www.u-smart.tn** → A record → `5.135.23.164` (OVH server)

### OVH Server Details
- **Server IP**: `5.135.23.164`
- **Hostname**: `fohaixl.cluster100.hosting.ovh.net`
- **DNS Servers**: `dns1.tn.ovh.net`, `ns1.tn.ovh.net`

### Propagation Timeline
- **Local DNS**: 15-30 minutes
- **Global DNS**: 24-48 hours maximum
- **SSL Certificates**: Auto-issued after domain validation