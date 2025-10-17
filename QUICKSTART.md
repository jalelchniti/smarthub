# SmartHub - Quick Start Guide

**For full documentation, see [CLAUDE.md](./CLAUDE.md)**

## Essential Commands

```bash
# Start development (frontend + backend)
npm run dev          # Both servers: http://localhost:5174 + http://localhost:3001

# Build for production
npx vite build       # Excludes admin (restore with: cp src/App.backup.tsx src/App.tsx)

# Backend only
npm run server       # Express API on port 3001
```

## Key Architecture Points

### Dual Storage System
- **Firebase**: Public booking system (`/booking` page, real-time sync)
- **JSON + Express**: Internal admin system (students, payments, local backup)

### Important Files
- `server/index.js` - Express backend (required for admin features)
- `src/App.tsx` / `src/App.backup.tsx` - Production vs development versions
- `src/data/admin-data.json` - Admin data (backend writes here)
- `.env` - Firebase credentials + FTP deployment config

## Common Workflows

### Working on Admin Features
1. Ensure backend is running: `npm run server`
2. Use `AdminDataStorage.load()` / `.save()` (both async)
3. Import types from `src/types/admin.types.ts`
4. Always handle loading states with spinners

### Working on Public Booking
1. Use `firebaseBookingService.ts` for CRUD operations
2. Authenticate via `firebaseAuthService.ts`
3. Authorized users: jalel.chniti@smarthub.com.tn

### Deployment to Production
1. Admin routes auto-excluded from production build
2. Teachers page uses static fallback (no backend needed)
3. Upload `dist/` to OVH via FTP (see `DEPLOYMENT_GUIDE.md`)
4. Restore admin locally: `cp src/App.backup.tsx src/App.tsx`

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend not connecting | Run `npm run server` or `npm run dev` |
| Data not saving | Check Express server on port 3001 |
| Admin loads forever | Start backend server |
| Teachers page error (prod) | Expected - uses FALLBACK_TEACHERS array |
| Firebase auth fails | Check `.env` credentials |

## Business Rules

- **Teacher Revenue Protection**: 12 TND/hour minimum guarantee
- **Room Pricing**: Flat rate per room (25 TND HT Salle 1, 20 TND HT Salle 2/3)
- **VAT**: 7% for rooms, 19% for teacher services
- **Independent Teachers**: 20% discount with own students

## Tech Stack Quick Reference

- React 19 + TypeScript 5.8 + Vite 7.1
- Tailwind CSS 3.4 (blue/purple gradients)
- Express 5.1 backend (port 3001)
- Firebase Realtime Database + Auth
- JSON file storage (with automatic backups)

---

**Full details in [CLAUDE.md](./CLAUDE.md)**
