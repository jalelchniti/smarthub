# SmartHub - Educational Platform

SmartHub is a comprehensive educational platform built with React + TypeScript + Vite, featuring a complete dashboard ecosystem for educational workspace management in Tunis City Center.

## 🚀 Quick Start

### Frontend Development
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`

### Backend Development
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:3001`

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Socket.IO Client
- **Backend**: Node.js + Express + Prisma ORM + SQLite/PostgreSQL + Socket.IO
- **Authentication**: JWT with role-based permissions
- **Real-Time**: WebSocket server & client with live notifications
- **Messaging**: Instant messaging with conversations
- **Notifications**: Priority-based sounds and visual indicators
- **Design**: Premium glassmorphism with gradient themes

## 📊 Dashboard System

### 13 Specialized Dashboards

**SuperAdmin Dashboard** (`/super-admin`)
- Platform oversight with crown theme
- System health and performance monitoring

**10 Specialized Admin Dashboards**
- General Admin (`/generaladmin`) - Blue theme
- Teacher Admin (`/teacheradmin`) - Green theme  
- Content Admin (`/contentadmin`) - Purple theme
- Marketing Admin (`/marketingadmin`) - Pink theme
- Analytics Admin (`/analyticsadmin`) - Cyan theme
- Financial Admin (`/financialadmin`) - Yellow theme
- Support Admin (`/supportadmin`) - Gray theme
- Academic Admin (`/academicadmin`) - Emerald theme
- Safety Admin (`/safetyadmin`) - Red theme
- User Admin (`/useradmin`) - Indigo theme

**User Self-Service Dashboards**
- Teacher Dashboard (`/teacher`) - Emerald theme - Session & earnings management
- Student Dashboard (`/student`) - Blue theme - Course booking & progress tracking

## 🎯 Features

- **Multi-Role Authentication**: SuperAdmin, Specialized Admins, Teachers, Students
- **French Localization**: Complete French language support
- **Responsive Design**: Mobile-first with premium styling
- **Real-Time Features**: Live notifications, calendar updates, messaging
- **WebSocket Integration**: Instant updates and presence tracking
- **Progressive Architecture**: Static showcase + dynamic backend + live features

## 🏢 Business Context

**SmartHub Educational Facility**
- Location: Tunis City Center (Rue de Belgique, Immeuble MAE)
- Services: Teacher workspace rental, educational sessions
- Contact: +216 99 730 144 | admin@u-smart.net
- Hours: Mon-Fri (8:00-20:00), Weekends (9:00-18:00)

## 🛠️ Development

### Build Commands
```bash
# Frontend
npm run build    # Production build
npm run lint     # Code quality check
npm run preview  # Preview production build

# Backend
cd backend
npm run build    # Backend build
npm run test     # Run tests
npm run db:studio # Database GUI
```

### Environment Setup
Create `.env` file in project root:
```env
VITE_USE_BACKEND=true
VITE_API_URL=http://localhost:3001/api
```

Create `backend/.env` file:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret"
PORT=3001
```

## 📋 Test Accounts

**Development Access** (No login required currently)
- SuperAdmin: admin@u-smart.net/admin123456
- Specialized Admins: [role]admin@u-smart.net/admin123456
- Teacher: marie.dubois@example.com/teacher123
- Student: student@example.com/student123

## 🚦 Development Status

✅ **Phase 1**: Static showcase website
✅ **Phase 2**: Backend + Authentication + Role system
✅ **Phase 3**: Complete dashboard ecosystem  
✅ **Phase 4**: Real-time backend infrastructure (Complete)
🚧 **Phase 5**: Frontend real-time integration (Week 1 Complete ✅)

**Current Status**: Real-time notifications fully integrated - 1 week remaining

## 📁 Project Structure

```
src/
├── components/          # React components
│   └── notifications/  # Real-time notification components
├── pages/              # Dashboard pages (13 total)
├── contexts/           # Authentication & Notification contexts
├── services/           # API services & WebSocket client
├── utils/              # Notification sound system
└── types/              # TypeScript definitions

backend/
├── src/
│   ├── controllers/    # API endpoints
│   ├── services/       # Business logic
│   ├── routes/         # Route definitions
│   └── types/          # Backend types
└── prisma/            # Database schema
```

## 📖 Documentation

See `CLAUDE.md` for comprehensive development guidelines and architecture details.

## 🤝 Contributing

This is a private educational platform project for SmartHub Tunis.

---

**SmartHub** - Educational Excellence in Tunis City Center
<!-- OVH Git Integration Test - Thu, Sep  4, 2025  5:56:06 PM -->
