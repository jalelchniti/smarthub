// Firebase configuration for SmartHub Booking System (CDN Version)
// Using Firebase CDN loaded in index.html - no npm installation needed!
// To set up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project called "SmartHub-Bookings"
// 3. Enable Realtime Database
// 4. Get your config from Project Settings > General > Web apps
// 5. Replace the config below with your actual Firebase config

// Using Firebase Compat SDK from CDN (loaded in index.html)
declare global {
  interface Window {
    firebase: {
      initializeApp: (config: object) => unknown;
      database: () => {
        ref: (path?: string) => {
          once: (eventType: string) => Promise<{ exists: () => boolean; val: () => unknown }>;
          set: (value: unknown) => Promise<void>;
          update: (updates: Record<string, unknown>) => Promise<void>;
          push: () => { key: string; set: (value: unknown) => Promise<void> };
          remove: () => Promise<void>;
          on: (eventType: string, callback: (snapshot: { exists: () => boolean; val: () => unknown }) => void) => unknown;
          off: (eventType: string, callback: unknown) => void;
        };
      };
      auth: () => {
        signInWithEmailAndPassword: (email: string, password: string) => Promise<{
          user: {
            uid: string;
            email: string;
            displayName?: string;
            customClaims?: Record<string, unknown>;
          };
        }>;
        signOut: () => Promise<void>;
        onAuthStateChanged: (callback: (user: {
          uid: string;
          email: string;
          displayName?: string;
          customClaims?: Record<string, unknown>;
        } | null) => void) => () => void;
        currentUser: {
          uid: string;
          email: string;
          displayName?: string;
          customClaims?: Record<string, unknown>;
        } | null;
      };
    };
  }
}

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project-id.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://your-project-id-default-rtdb.firebaseio.com/",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Initialize Firebase using CDN
let app: unknown;
let database: ReturnType<Window['firebase']['database']> | null = null;
let auth: ReturnType<Window['firebase']['auth']> | null = null;

const initializeFirebase = () => {
  if (typeof window !== 'undefined' && window.firebase) {
    try {
      // Check if already initialized
      if (!app) {
        app = window.firebase.initializeApp(firebaseConfig);
      }
      if (!database) {
        database = window.firebase.database();
      }
      if (!auth) {
        auth = window.firebase.auth();
      }
      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return false;
    }
  }
  return false;
};

// Initialize on module load
const isFirebaseAvailable = initializeFirebase();

export { database, auth, initializeFirebase, isFirebaseAvailable };
export default app;