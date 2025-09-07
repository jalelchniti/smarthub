# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Current Implementation Status

**IMPORTANT DISCREPANCY ALERT**: The README.md file describes backend features, multiple dashboards, and complex authentication systems that are **NOT YET IMPLEMENTED** in the current codebase. The current implementation is a **static frontend-only** React application.

**Current Reality**:
- ✅ Static React SPA with 4 pages (Home, Rooms, Teachers, LearnMore)  
- ✅ Brevo form integration for lead collection
- ✅ WhatsApp contact integration (+216 99 730 144)
- ✅ Static deployment to OVH hosting
- ❌ NO backend server currently exists
- ❌ NO authentication system implemented
- ❌ NO dashboard system implemented
- ❌ NO real-time features implemented

**When developing, ALWAYS**:
1. Verify current codebase state (static React app)
2. Don't assume backend endpoints exist
3. Focus on frontend-only features until backend is implemented
4. Use external services (Brevo, WhatsApp) for dynamic functionality

## Project Overview

SmartHub is a React + TypeScript educational platform built with Vite, serving as an informational showcase for a local educational facility in Tunis City Center. The platform features a modern, responsive design showcasing educational services, workspace rental, and teacher-student connection services.

## Essential Development Commands

### Frontend Commands
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Static Site Commands
- No backend currently exists - this is a frontend-only application
- All functionality is handled client-side with static data

## Architecture & Tech Stack

### Current Tech Stack
- **React 19** with TypeScript 5.8
- **Vite 7.1** for build tooling and development server
- **Tailwind CSS 3.4** for styling with custom color palette and premium gradients
- **React Router DOM 7.8** for client-side routing
- **Lucide React** for icons and visual elements
- **Static Architecture**: No backend - all content is static with form submissions via WhatsApp integration

### Project Structure
```
src/                      # Frontend React application
├── components/           # Reusable React components
│   ├── ui/              # UI components (Button, Card, Input)
│   ├── Navigation.tsx   # Site navigation
│   ├── Footer.tsx       # Site footer
│   ├── GoogleMapEmbed.tsx # Location map integration
│   ├── StudentTCA.tsx   # Student call-to-action buttons
│   ├── TeacherTCA.tsx   # Teacher call-to-action buttons
│   ├── StudentTCAForm.tsx # Student contact form
│   └── TeacherTCAForm.tsx # Teacher contact form
├── pages/               # Main page components
│   ├── Home.tsx         # Home page with hero section
│   ├── Rooms.tsx        # Workspace rental information
│   ├── Teachers.tsx     # Teacher services showcase
│   └── LearnMore.tsx    # Learning programs and subjects
├── App.tsx              # Main application component
└── main.tsx             # Application entry point

public/                  # Static assets
├── images/              # Image assets
└── index.html           # HTML template
```

## Environment Configuration

### Frontend Environment (copy `.env.example` to `.env`)
- `VITE_USE_BACKEND=false` - Currently disabled (static site)
- `VITE_API_URL` - Reserved for future backend integration
- `VITE_EMAIL_VERIFICATION=false` - Future feature flag
- `VITE_REAL_TIME_FEATURES=false` - Future feature flag

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

### Content & Messaging Guidelines
**Core Value Proposition**: SmartHub connects competent teachers with serious students
- **Dual Audience**: All content should address both teachers and students
- **Quality Focus**: Emphasize "compétents" (competent) teachers and "sérieux" (serious) students
- **Selection Process**: Highlight "sélection rigoureuse" (rigorous selection)
- **Academic Coverage**: Comprehensive levels from primary through university plus adult professional development
- **Location Integration**: "centre de Tunis" should be clickable and lead to location popup
- **Contact Priority**: WhatsApp +216 99 730 144 as primary contact method

### Styling Guidelines
**CRITICAL: All content must be center-aligned**
- Global CSS rules: `* { text-align: center; }` in `src/index.css`
- Extensive use of `text-center` classes on all elements
- **Interactive Elements Protection**: Explicit left alignment for buttons, inputs, forms

### Architecture Patterns
- **Progressive Integration**: Frontend operates with static data or dynamic backend via feature flags
- **Component-Based Design**: Reusable UI components with consistent styling patterns
- **Premium Design System**: Gradient backgrounds, glassmorphism effects, hover animations

## Recent UI/UX Improvements & Bug Fixes (Latest Update)

### Home Page Enhancements
- **Hero Section Added**: Complete hero section with compelling messaging about connecting competent teachers with serious students
- **Interactive Location Links**: "centre de Tunis" text is clickable and opens location popup modal
- **Enhanced Value Proposition**: Clear messaging about SmartHub's core service of matching quality teachers with committed students

### Content Standardization
- **Unified Subject Categories**: 9 comprehensive subjects aligned across Teachers and LearnMore pages:
  - Mathématiques (Calculator icon), Physique (Target icon), Français (Languages icon)
  - Anglais (Globe icon), Sciences Naturelles (BookOpen icon), Arabe (Settings icon)
  - Informatique (Laptop icon), Économie & Gestion (TrendingUp icon), ESP: Anglais Spécialisé (Star icon)
- **Academic Level Coverage**: Explicitly states coverage for "Primaire, Collège, Secondaire et Universitaire" plus adult professional development
- **Process Simplification**: LearnMore page streamlined to 3-step process: Contact → Enroll → Learn

### Footer & Contact Updates
- **Address Standardization**: Updated to "13, Rue de Belgique" across all pages
- **Schedule Optimization**: Removed Sunday hours, updated Saturday to split schedule (9:00-13:00, 15:00-18:00)
- **Visual Improvements**: Clock icon properly aligned with "Horaires" header
- **WhatsApp Button Cleanup**: Removed WhatsApp TCA buttons from footer for cleaner design
- **Description Enhancement**: Expanded footer description with professional messaging about competent teachers and exceptional teaching experience

### Critical Bug Fixes (Sept 2025)
- **✅ RESOLVED: Form Redirect Issue**: Both student and teacher subscription forms now properly redirect to local thank you pages instead of Brevo's default form pages
  - StudentSubscriptionForm: Fixed redirect to `/thank-you/student`
  - TeacherSubscriptionForm: Fixed redirect to `/thank-you/teacher`
  - **UPDATED**: Forms now use iframe submission method to bypass popup security restrictions
- **✅ RESOLVED: Thank You Page Navigation**: "Explorer le Site" and "Découvrir nos Services" buttons now redirect to Home page (`/`) instead of external URLs that showed blank pages
- **✅ RESOLVED: Git Repository URL**: Updated CLAUDE.md documentation to reflect correct repository URL (`jalelchniti/u-smart-net.git`) instead of placeholder
- **🔄 ONGOING: Brevo Integration Issue**: Despite multiple attempts, forms are still not successfully sending data to Brevo CRM

## Page Structure

The platform features **4 main pages** with consistent styling:

### Public Pages
- **Home** (`/`) - Hero section with services overview, stats, and call-to-action forms
- **Rooms** (`/rooms`) - Workspace rental showcase with pricing and amenities
- **Teachers** (`/teachers`) - Teacher services, subjects, and connection process
- **LearnMore** (`/learn-more`) - Educational programs, subjects, and learning process

### Interactive Features
- **WhatsApp Integration**: Primary contact method via +216 99 730 144
- **Google Maps Integration**: Interactive location display for facility address
- **Brevo Contact Forms**: Student and Teacher subscription forms with proper Brevo integration
- **Form Success States**: Premium thank-you pages with WhatsApp call-to-action integration

## Business Context

**SmartHub Educational Facility - Tunis City Center**
- **Address**: 13, Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis
- **Contact**: +216 99 730 144 | admin@u-smart.net
- **Hours**: Mon-Fri (8:00-20:00), Sat (9:00-13:00, 15:00-18:00)
- **Services**: Teacher workspace rental (3 rooms), in-person educational services connecting competent teachers with serious students

## Quick Development Workflow

### Starting Development
1. Start frontend: `npm run dev` (localhost:5173)
2. Visit pages: `/`, `/rooms`, `/teachers`, `/learn-more`

### First Time Setup
```bash
npm install                  # Install dependencies
npm run build               # Verify build works (no .env required for static build)
```

### Environment Setup (Optional)
Environment variables are only needed if you plan to enable future backend features:
```bash
cp .env.example .env         # Configure environment for future backend integration
# Note: Current static build works without any .env configuration
```

### Adding New Features
1. **Always** run `npm run build` first to verify current state
2. **Always** maintain French localization for all new features
3. **Always** preserve center-alignment styling patterns
4. Follow existing component patterns and styling conventions

### Common Build Issues
- Unclosed JSX elements (most common)
- Unmatched brackets/parentheses in JSX
- Unused imports (warnings become errors)
- Type assignment issues ('any' to strict types)

## Component Architecture

### UI Components (`/src/components/ui/`)
- **Button**: Reusable button component with variant support
- **Card**: Container component with consistent styling
- **Input**: Form input component with validation styling

### Feature Components
- **Navigation**: Site header with responsive navigation menu
- **Footer**: Site footer with contact information and business details
- **GoogleMapEmbed**: Interactive map showing facility location
- **StudentTCA/TeacherTCA**: Call-to-action buttons triggering contact forms
- **StudentTCAForm/TeacherTCAForm**: Brevo-integrated subscription forms with proper field mapping and validation

## Brevo Form Integration

### Form Configuration
The subscription forms are fully integrated with Brevo (formerly Sendinblue) for email marketing and lead collection:

**Student Form Endpoint:** (CORRECTED - from original Brevo form)
```
https://e631d0f7.sibforms.com/serve/MUIFACIS_HvUBL38dN3sbehcT-uiPwKQ5Js32ozCj4_6JnlMRkBf-X9MjN62cIkuWWom-z41m6gDgRKIlxq9dHliaq6skHgdAALE4jWto2JyyjMtP9asgwdYnG-Z4oSdUSUo7T45jGoJD9fYqhijgraWcAKtoDVwUg_1HxbG8ivPIqPXcBZ5dHVrryAyzi-lD5jyxXuGTmkOuUkG
```

**Teacher Form Endpoint:** (CORRECTED - from original Brevo form)
```
https://e631d0f7.sibforms.com/serve/MUIFAOl0zZjF9_ETgLWZ1u9kUW5ZHwhDBg3EkmUE5vao2JdvBLDFgKQfMyG7fHUYoTlRcZ-vdATljkhFuMWnM3VYg4OnDhVv4C8Cc2j_P8CRHn94CbppJIbDDiHoyB7Lw7PLYY-zw4P7jL_cMhTsudsYJ_Vk5jWWj5zhxWtUsPJWHXvXWQp9VxM_iaUoKbl4Jxu6RnvCV8ZLqi5x
```

### Field Mapping Requirements
**CRITICAL**: Brevo requires exact field name matching. Forms use uppercase field names:
- `NOM` - Last name (required, maxLength: 200)
- `PRENOM` - First name (required, maxLength: 200) 
- `SMS` - Phone number (required, 6-19 digits with country code)
- `SMS__COUNTRY_CODE` - Country code selector (default: +216 TN)
- `EMAIL` - Email address (required, email validation)
- `email_address_check` - Hidden anti-spam field (always empty string)
- `locale` - Language setting (always 'fr')

### Form State Management
```typescript
const [formData, setFormData] = useState({
  NOM: '',
  PRENOM: '',
  SMS: '',
  EMAIL: ''
});

// CRITICAL: Preserve field name case - do NOT convert to lowercase
const handleInputChange = (e) => {
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

### SMS Validation Rules
- Must contain 6-19 digits
- Must include country code without +/0 prefix
- Example format: 33xxxxxxxxx for France, 216xxxxxxxx for Tunisia
- Country code selected separately via dropdown

### Success/Error Handling
- **Success**: Shows premium thank-you page with WhatsApp integration
- **Error**: Displays user-friendly error message with retry option
- **Validation**: Client-side validation with Brevo server-side verification
- **Fixed Redirect Issue**: Forms now properly redirect to local thank you pages (`/thank-you/student`, `/thank-you/teacher`) instead of Brevo's default pages

### Troubleshooting Brevo Integration
**CRITICAL ISSUE - STILL UNRESOLVED:**
🚨 **Despite multiple attempted solutions, Brevo is still not receiving form submissions.**

#### **Attempted Solutions (All Failed):**

**Solution 1: Quick Field/URL Fix**
- ❌ Fixed endpoint URLs to match original Brevo HTML forms exactly
- ❌ Corrected field names from `LANDLINE_NUMBER` to `SMS`
- ❌ Reverted email input type from 'email' to 'text'
- ❌ Updated placeholders to match Brevo originals
- **Result**: Still no data received by Brevo

**Solution 2: Native Form Submission**
- ❌ Replaced `fetch()` with native HTML form submission
- ❌ Used `document.createElement('form')` and `form.submit()`
- ❌ Opened submissions in `_blank` target
- **Problem**: User redirected to Brevo success page instead of our thank you pages

**Solution 3: Hidden Iframe Submission (Current)**
- 🔄 Implemented iframe-based form submission
- 🔄 Forms submit to hidden iframe to bypass popup security restrictions
- 🔄 User immediately redirected to local thank you pages
- **Status**: Technical implementation works, but Brevo still not receiving data

#### **Root Cause Analysis:**
After extensive debugging, the issue appears to be:
1. **Form endpoint URLs** - Even with correct URLs from original HTML, submissions may be blocked
2. **Security restrictions** - Browser security policies blocking cross-origin submissions from React apps
3. **Brevo form validation** - Possible server-side validation differences between HTML forms and programmatic submissions
4. **Field validation mismatch** - Brevo may have specific validation rules not matching our implementation

**Common Issues:**
1. **Forms not submitting**: Check endpoint URLs match exactly from `/docs/` directory
2. **Field validation errors**: Ensure field names are uppercase (NOM, PRENOM, SMS, EMAIL)
3. **SMS validation fails**: Verify country code + number format (no +/0 prefix)
4. **Missing submissions**: Confirm `email_address_check` and `locale` hidden fields are included
5. **Case sensitivity**: Never convert field names to lowercase in form state management
6. **Configuration Mismatch**: React form components may not be fully aligned with Brevo CRM attribute requirements

**Known Compatibility Issues:**
- Form field validation may not match Brevo's exact requirements
- Country code handling might need adjustment for international submissions  
- SMS format validation could conflict with Brevo's expected input format
- Hidden field implementation may require verification against current Brevo setup

**Original Brevo HTML Sources:**
- Student form: `/docs/Demande info apprenant HTML Code`
- Teacher form: `/docs/Demande info Prof HTML Code`

**Form Testing:**
- Test both success and error states
- Verify SMS validation with different country codes
- Confirm WhatsApp integration in success pages works correctly
- **✅ RESOLVED**: Form submissions now properly redirect to local thank you pages
- **✅ RESOLVED**: Thank you page "Explorer le Site" buttons now correctly redirect to Home page (`/`)
- **❌ FAILED**: Multiple attempts to submit data to Brevo endpoint unsuccessful
- **❌ PENDING**: Validation of all field mappings with current Brevo CRM configuration

#### **Next Solution: Brevo API Integration**
🔄 **Recommended approach: Replace form submissions with direct Brevo API calls**

**Brevo API Benefits:**
- Direct contact creation via REST API
- Proper error handling and response validation
- No cross-origin security restrictions
- Better control over field mapping and validation
- Real-time confirmation of successful submissions

**Implementation Plan:**
1. **API Setup**: Configure Brevo API credentials and endpoint
2. **Contact Creation**: Use `/v3/contacts` endpoint to create contacts directly
3. **List Assignment**: Automatically assign to appropriate email lists (student/teacher)
4. **Error Handling**: Implement proper error responses and user feedback
5. **Testing**: Verify contact creation in Brevo CRM dashboard

**API Endpoint Structure:**
```typescript
// POST https://api.brevo.com/v3/contacts
{
  email: formData.EMAIL,
  attributes: {
    NOM: formData.NOM,
    PRENOM: formData.PRENOM,
    SMS: formData.SMS,
    SMS__COUNTRY_CODE: countryCode
  },
  listIds: [studentListId], // or [teacherListId]
  updateEnabled: true
}
```

**Required for API Implementation:**
- Brevo API key (from Brevo dashboard)
- Student and Teacher list IDs
- Proper CORS handling for API calls
- Backend proxy or serverless function (due to API key security)

## Key Configuration Files

**Key Configuration Files:**
- `vite.config.ts` - Vite configuration with React plugin and relative base path
- `tailwind.config.js` - Custom colors (primary blues, secondary purples) and Inter font
- `tsconfig.json` - Project references architecture with app and node configs
- `eslint.config.js` - ESLint with TypeScript, React hooks, and React refresh rules
- `package.json` - Dependencies and build scripts for static site deployment

## Deployment to OVH

### Automated Git Deployment (Primary Method)
**Repository**: https://github.com/jalelchniti/u-smart-net.git
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

**Static Site Deployment**:
```bash
# Build production version
npm run build

# Upload dist/ contents via FileZilla or SCP
# Target: /www/smarthub/ directory
```

### Git Integration Setup
**GitHub Repository**: https://github.com/jalelchniti/u-smart-net.git
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

## Email Marketing and Follow-ups

### Brevo CRM Integration

SmartHub uses Brevo (formerly Sendinblue) for comprehensive email marketing, lead nurturing, and customer relationship management.

#### Contact Attributes System
**Location**: `/docs/mailing_Lists/Brevo-CRM-Attributes.md`

**Basic Attributes (collected in first contact):**
- **NOM** (Text) - Last name / Surname
- **PRENOM** (Text) - First name / Given name  
- **EMAIL** (Text) - Email address (primary identifier)
- **SMS** (Text) - Mobile phone number for SMS campaigns
- **SMS__COUNTRY_CODE** - Country code (handled separately)

**Extended Attributes (collected later):**
- **CLASS** (Number) - Student's class level or grade
- **SECTION** (Multiple-choice) - Student's section or specialization
- **JOB_TITLE** (Text) - Professional job title/position (teachers)
- **LINKEDIN** (Text) - LinkedIn profile URL (teachers)
- **WHATSAPP** (Text) - WhatsApp number
- **OPT_IN** (Boolean) - General opt-in consent status
- **DOUBLE_OPT_IN** (Category) - Double opt-in confirmation status

#### Segmentation Strategy
- **User Type**: Students vs Teachers (based on form source)
- **Academic Level**: Using CLASS attribute for students
- **Academic Specialization**: Using SECTION attribute for students  
- **Professional**: Using JOB_TITLE for teachers
- **Geographic**: Using contact timezone and location data
- **Engagement**: Using opt-in status and email activity

### Autoresponder Email Templates

#### Student Welcome Series
**Location**: `/docs/mailing_Lists/Student/`

**Template: Autoresponder-01-Student.html**
- **Purpose**: First contact welcome email for student subscribers
- **Design**: Premium HTML with app-consistent styling (glassmorphism, gradients)
- **Mobile Responsive**: Optimized for all email clients including Outlook

**Personalization Tokens Used:**
```html
{{ contact.PRENOM }} - First name personalization in greetings
{{ contact.NOM }} - Last name for WhatsApp integration  
{{ contact.EMAIL }} - Email confirmation in footer
{{ unsubscribe }} - Brevo unsubscribe link
{{ update_profile }} - Profile management link
{{ tracking_pixel }} - Email analytics tracking
```

**Content Structure:**
1. **Header Section**: SmartHub branding with premium gradient background
2. **Hero Section**: Personalized welcome with contact's first name
3. **Value Proposition**: Core messaging about connecting competent teachers with serious students
4. **Features Grid**: Key service benefits and facility amenities
5. **Stats Section**: SmartHub achievements and numbers
6. **Call-to-Action**: Links to website pages with UTM tracking
7. **WhatsApp Integration**: Direct contact with pre-filled personal message
8. **Footer**: Complete business information and legal compliance

**Technical Features:**
- **Email Client Compatibility**: MSO conditional comments for Outlook
- **CSS Validation**: All email-safe CSS properties
- **UTM Tracking**: Comprehensive campaign tracking for analytics
- **Anti-spam**: Proper headers and authentication compliance

#### Advanced Personalization (Future Implementation)
**Conditional Content Blocks:**
```html
{% if contact.CLASS %}
<!-- Class-specific content for students -->
{% endif %}

{% if contact.SECTION %}  
<!-- Section-specific content for academic specialization -->
{% endif %}

{% if contact.JOB_TITLE %}
<!-- Professional content for teachers -->
{% endif %}
```

**Note**: Basic subscription forms only collect NOM, PRENOM, EMAIL, SMS. Advanced attributes like CLASS and SECTION are collected in follow-up interactions.

### Email Campaign Strategy

#### Student Journey
1. **Welcome Email**: Immediate autoresponder (implemented)
2. **Information Package**: Detailed program information (24h delay)
3. **Teacher Introduction**: Meet our teachers series (3-day delay)
4. **Class-Specific Content**: Targeted by academic level (1 week)
5. **Success Stories**: Social proof and testimonials (2 weeks)
6. **Re-engagement**: Special offers for inactive subscribers (1 month)

#### Teacher Journey  
1. **Welcome Email**: Professional onboarding autoresponder
2. **Facility Tour**: Virtual tour of workspace amenities
3. **Success Framework**: Teaching excellence methodology
4. **Community Integration**: How to connect with serious students
5. **Professional Development**: Ongoing training opportunities

### WhatsApp Integration in Emails

**Pre-filled Message Templates:**
```
Student Contact:
"Bonjour! Je suis [PRENOM] [NOM] et je viens de m'inscrire à la newsletter SmartHub. J'aimerais en savoir plus sur vos programmes. Mon email est [EMAIL]."

Teacher Contact:  
"Bonjour! Je suis [PRENOM] [NOM], enseignant(e). J'ai reçu votre email et j'aimerais discuter des opportunités chez SmartHub. Email: [EMAIL]."
```

### Technical Implementation

#### Email Template Development
- **HTML5 + CSS3**: Modern email standards with fallbacks
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Brand Consistency**: Matches SmartHub website design system
- **Performance**: Optimized images and minimal external dependencies

#### Testing & Quality Assurance
- **Email Client Testing**: Gmail, Outlook, Apple Mail, Mobile clients
- **Brevo Template Validation**: Server-side template syntax verification
- **UTM Tracking Verification**: Campaign attribution testing
- **A/B Testing Ready**: Template variations for optimization

#### Analytics & Monitoring
- **Open Rates**: Track email engagement by segment
- **Click-through Rates**: Monitor CTA performance and page visits  
- **Conversion Tracking**: Form submissions to WhatsApp contacts
- **Unsubscribe Monitoring**: List health and content optimization

### Future Enhancements

#### Advanced Automation
- **Behavioral Triggers**: Activity-based email sequences
- **Dynamic Content**: Real-time personalization based on CRM data
- **Multi-channel Integration**: SMS + Email + WhatsApp coordination
- **Lead Scoring**: Automated qualification and routing

#### Content Expansion
- **Teacher Spotlight Series**: Individual teacher feature emails
- **Subject-Specific Newsletters**: Mathematics, Sciences, Languages focus
- **Parent Communication**: Family engagement for younger students
- **Alumni Success**: Graduate achievement showcases

## Important Development Notes

- **Contact Integration**: Dual integration - Brevo forms for lead collection + WhatsApp +216 99 730 144 for direct contact
- **Brevo Forms**: Properly integrated subscription forms with correct endpoints and field mapping
- **Email Marketing**: Comprehensive autoresponder system with personalization and premium design
- **Static Architecture**: No backend - Brevo handles form submissions and email automation, WhatsApp handles direct contact
- **French Localization**: All content fully localized in French language
- **Privacy Protection**: Lead data collected via Brevo, no personal data storage on site, GDPR compliant
- **Subject Consistency**: Always use the standardized 9-subject list with proper icons
- **Hero Section**: Home page includes comprehensive value proposition messaging
- **Interactive Elements**: Location references clickable and open Google Maps popup
- **Center Alignment**: Global center-alignment required except for interactive form elements
- **Premium Design**: Gradient backgrounds and glassmorphism effects throughout website and emails
- **Git Deployment**: Use OVH Git integration for automatic deployment to production domains
- **Form Field Names**: CRITICAL - Always use uppercase field names (NOM, PRENOM, SMS, EMAIL) for Brevo compatibility
- **Email Personalization**: CRITICAL - Only use basic attributes (PRENOM, NOM, EMAIL, SMS) in first contact autoresponders
- **Brevo Integration Status**: ONGOING ISSUE - Form submissions via HTML endpoints not working, API integration required
- **Current Form Method**: Hidden iframe submission with immediate redirect to local thank you pages (user experience fixed, but data not reaching Brevo)

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