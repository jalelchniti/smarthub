# Firebase Setup for SmartHub Booking System

This guide will help you set up Firebase Realtime Database for centralized booking storage across multiple teachers and devices.

## Prerequisites

- Google Account
- Node.js and npm installed
- SmartHub project already set up

## Step 1: Create Firebase Project

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create New Project**:
   - Click "Add project"
   - Project name: `SmartHub-Bookings`
   - Enable Google Analytics (optional)
   - Choose your country/region
   - Accept terms and create project

## Step 2: Enable Realtime Database

1. **In Firebase Console**, go to "Build" → "Realtime Database"
2. **Create Database**:
   - Choose "Start in test mode" (for now)
   - Select location closest to Tunisia (Europe-west1)
3. **Database Rules** (Important for Security):
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true,
       "bookings": {
         ".validate": "newData.hasChildren(['roomId', 'day', 'timeSlot', 'teacherName'])"
       }
     }
   }
   ```

## Step 3: Get Firebase Configuration

1. **In Firebase Console**, go to Project Settings (gear icon)
2. **Scroll to "Your apps"** section
3. **Add web app**:
   - App nickname: `SmartHub-Booking-Web`
   - Don't enable Firebase Hosting (we'll use static hosting)
   - Register app
4. **Copy the Firebase config** (it looks like this):
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "smarthub-bookings.firebaseapp.com",
     databaseURL: "https://smarthub-bookings-default-rtdb.firebaseio.com/",
     projectId: "smarthub-bookings",
     storageBucket: "smarthub-bookings.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456"
   };
   ```

## Step 4: Install Firebase SDK

**Run this command in your SmartHub project**:
```bash
npm install firebase
```

If you get Windows permission errors, try:
```bash
npm install firebase --force
```

## Step 5: Update Firebase Configuration

1. **Open** `src/config/firebase.ts`
2. **Replace the placeholder config** with your actual Firebase config:
   ```typescript
   const firebaseConfig = {
     // Paste your actual config here
     apiKey: "your-actual-api-key",
     authDomain: "your-actual-project.firebaseapp.com",
     databaseURL: "your-actual-database-url",
     projectId: "your-actual-project-id",
     storageBucket: "your-actual-storage-bucket",
     messagingSenderId: "your-actual-sender-id",
     appId: "your-actual-app-id"
   };
   ```

## Step 6: Environment Variables (Recommended)

For security, create `.env` file in project root:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 7: Update Firebase Config to Use Environment Variables

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Step 8: Test the Setup

1. **Build the project**: `npm run build`
2. **Run development server**: `npm run dev`
3. **Visit**: `http://localhost:5173/booking`
4. **Create a test booking** - it should save to Firebase
5. **Check Firebase Console** → Database → Data to see the booking

## Step 9: Production Security (Important!)

For production, update Firebase Rules to be more secure:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      ".write": false
    },
    "timeSlots": {
      ".read": true,
      ".write": false
    },
    "weekDays": {
      ".read": true,
      ".write": false
    },
    "bookings": {
      ".read": true,
      ".write": true,
      "$bookingId": {
        ".validate": "newData.hasChildren(['roomId', 'day', 'timeSlot', 'teacherName', 'contactInfo']) && newData.child('teacherName').isString() && newData.child('contactInfo').isString()"
      }
    },
    "lastUpdated": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Deployment Notes

### Environment Variables for Hosting Platforms:

**Netlify**:
- Go to Site Settings → Environment Variables
- Add all VITE_FIREBASE_* variables

**Vercel**:
- Go to Project Settings → Environment Variables
- Add all VITE_FIREBASE_* variables

**GitHub Pages**:
- Use GitHub Secrets for environment variables

## Features After Setup

✅ **Multi-Teacher Access**: All teachers see the same bookings
✅ **Real-Time Sync**: Changes appear instantly on all devices
✅ **Conflict Prevention**: No double-booking possible
✅ **Cross-Device**: Works on phones, tablets, computers
✅ **Persistent Storage**: Data survives browser refreshes
✅ **Scalable**: Handles multiple concurrent users

## Troubleshooting

### Firebase SDK Installation Issues
If `npm install firebase` fails:
```bash
# Try force install
npm install firebase --force

# Or use yarn
npm install -g yarn
yarn add firebase
```

### Database Rules Errors
If you get permission denied errors:
1. Go to Firebase Console → Database → Rules
2. Temporarily use test mode rules
3. Gradually tighten security

### Connection Issues
- Check your internet connection
- Verify Firebase config is correct
- Check browser console for errors

### CORS Issues
- Make sure your domain is added to Firebase Auth domains
- Check Firebase Console → Authentication → Settings → Authorized domains

## Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Check browser developer console
3. Verify all environment variables are set correctly
4. Test with a simple Firebase write operation first

---

**Next Steps**: Once Firebase is set up, the booking system will automatically handle multi-teacher access with real-time synchronization!