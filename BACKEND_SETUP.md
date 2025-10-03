# Backend Setup - Node.js/Express API

## Overview

SmartHub now uses a Node.js/Express backend to persist admin data to JSON files in the project structure instead of browser localStorage.

## Architecture

```
Client (React)  <-->  Backend API (Express)  <-->  admin-data.json (File System)
Port 5174            Port 3001                     src/data/admin-data.json
```

## What Changed

### Before (localStorage)
- Data saved in browser localStorage
- Lost when clearing browser data
- Not shared between browsers/computers
- No version control

### After (File-based with Backend)
- Data saved to `src/data/admin-data.json`
- Permanent storage in project files
- Shared across all users
- Can be committed to Git
- Automatic backups created

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts **both** servers concurrently:
- **Backend API**: http://localhost:3001
- **Frontend (Vite)**: http://localhost:5174

### Separate Servers (Optional)
```bash
# Terminal 1: Backend only
npm run server

# Terminal 2: Frontend only
npm run dev:client
```

## API Endpoints

All endpoints use base URL: `http://localhost:3001/api`

### GET /admin/data
Load all admin data from JSON file

**Response:**
```json
{
  "rooms": [...],
  "teachers": [...],
  "students": [...],
  "bookings": [...],
  ...
}
```

### POST /admin/data
Save admin data to JSON file

**Request Body:**
```json
{
  "rooms": [...],
  "teachers": [...],
  "students": [...],
  ...
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin data saved successfully",
  "last_updated": "2025-10-03T10:18:45.308Z"
}
```

### GET /admin/backup
Download current data as backup JSON file

**Response:** File download `smarthub-backup-2025-10-03.json`

### POST /admin/restore
Restore data from backup file

**Request Body:** Complete AdminData JSON object

**Response:**
```json
{
  "success": true,
  "message": "Data restored successfully from backup"
}
```

### GET /health
Backend health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T10:18:45.308Z",
  "dataFile": "C:\\Users\\asus\\smarthub\\src\\data\\admin-data.json"
}
```

## File Structure

```
smarthub/
├── server/
│   └── index.js              # Express backend server
├── src/
│   ├── data/
│   │   ├── admin-data.json   # Main data file (written by backend)
│   │   └── backups/          # Automatic backups
│   └── utils/
│       └── adminDataStorage.ts  # Updated to use API
└── package.json              # Updated scripts
```

## Data Persistence

### Automatic Backups
Every time data is saved, a backup is created in `src/data/backups/`:
- `admin-data-{timestamp}.json`
- `before-restore-{timestamp}.json` (when restoring)

### Manual Backup/Restore
Use `AdminDataStorage` methods:
```typescript
// Download backup
await AdminDataStorage.downloadBackup();

// Restore from file
await AdminDataStorage.restoreBackup(file);
```

## Security Notes

⚠️ **Current Setup - Development Only**
- No authentication on backend API
- CORS allows all origins
- No data validation
- No rate limiting

For production deployment, you need:
- Proper authentication (JWT, sessions)
- Request validation
- CORS whitelist
- HTTPS
- Database instead of JSON files

## Dependencies

```json
{
  "dependencies": {
    "express": "^5.1.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.10",
    "concurrently": "^9.2.1"
  }
}
```

## Troubleshooting

### Backend not starting
- Check if port 3001 is available
- Look for errors in console
- Ensure `server/index.js` exists

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check browser console for CORS errors
- Ensure `API_BASE_URL` in `adminDataStorage.ts` is correct

### Data not saving
- Check backend console for errors
- Verify file permissions on `src/data/admin-data.json`
- Ensure backups directory exists

### Port conflicts
- Frontend moved to port 5174 (5173 was in use)
- Backend uses port 3001
- Change ports in `server/index.js` or `vite.config.ts` if needed

## Migration from localStorage

Old data in localStorage is **not automatically migrated**. To migrate:

1. Open browser console on old system
2. Run: `localStorage.getItem('smarthub_admin_data_v1')`
3. Copy the JSON
4. Save as file
5. Use "Restore from backup" in new system

## Git Integration

### What to commit
✅ Commit `src/data/admin-data.json` - Main data file
✅ Commit `server/index.js` - Backend code
❌ Don't commit `src/data/backups/*` - Add to `.gitignore`

### .gitignore addition
```
src/data/backups/
```

## Benefits

✅ **Permanent storage** - Data persists across browsers/computers
✅ **Version control** - Track data changes in Git
✅ **Backup system** - Automatic backups on every save
✅ **Multi-user** - Share data between team members
✅ **No quota limits** - Unlike localStorage (5-10MB limit)
✅ **Easy deployment** - Just deploy the project with data

## Next Steps

1. Add authentication to backend API
2. Implement proper database (PostgreSQL, MongoDB)
3. Add data validation and sanitization
4. Set up production deployment
5. Implement real-time updates with WebSockets
