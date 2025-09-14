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

// Environment variables validation
const validateFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_DATABASE_URL',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Firebase configuration incomplete. Missing environment variables:', missing);
    console.error('🔧 Please check your .env file and ensure all Firebase variables are set.');
    return false;
  }

  console.log('✅ Firebase configuration validated successfully');
  return true;
};

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase using CDN
let app: unknown;
let database: ReturnType<Window['firebase']['database']> | null = null;
let auth: ReturnType<Window['firebase']['auth']> | null = null;

// Firebase CDN availability checker with retry mechanism
const waitForFirebaseCDN = async (maxRetries = 10, delay = 500): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    if (typeof window !== 'undefined' && window.firebase) {
      console.log(`✅ Firebase CDN loaded successfully (attempt ${i + 1})`);
      return true;
    }

    console.log(`⏳ Waiting for Firebase CDN... (attempt ${i + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  console.error('❌ Firebase CDN not available after maximum retries');
  return false;
};

const initializeFirebase = async (): Promise<boolean> => {
  try {
    // Validate environment variables first
    if (!validateFirebaseConfig()) {
      return false;
    }

    // Wait for Firebase CDN to be available
    const cdnAvailable = await waitForFirebaseCDN();
    if (!cdnAvailable) {
      console.error('❌ Firebase CDN scripts not loaded. Please check index.html');
      return false;
    }

    // Initialize Firebase services
    if (!app) {
      console.log('🚀 Initializing Firebase app...');
      app = window.firebase.initializeApp(firebaseConfig);
    }

    if (!database) {
      console.log('🗄️ Initializing Firebase Database...');
      database = window.firebase.database();
    }

    if (!auth) {
      console.log('🔐 Initializing Firebase Auth...');
      auth = window.firebase.auth();
    }

    console.log('✅ Firebase initialized successfully');
    return true;

  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);

    // Provide specific error diagnostics
    if (error instanceof Error) {
      if (error.message.includes('app/duplicate-app')) {
        console.warn('⚠️ Firebase app already initialized, continuing...');
        return true;
      } else if (error.message.includes('invalid-api-key')) {
        console.error('🔑 Invalid Firebase API key. Please check your .env file.');
      } else if (error.message.includes('network')) {
        console.error('🌐 Network error. Please check your internet connection.');
      }
    }

    return false;
  }
};

// Initialize Firebase with proper async handling
let isFirebaseAvailable = false;
let firebaseInitPromise: Promise<boolean> | null = null;

// Get Firebase initialization promise
const getFirebaseInitialization = (): Promise<boolean> => {
  if (!firebaseInitPromise) {
    firebaseInitPromise = initializeFirebase().then(success => {
      isFirebaseAvailable = success;
      return success;
    });
  }
  return firebaseInitPromise;
};

// Synchronous check for already initialized Firebase
const isFirebaseReady = (): boolean => {
  return isFirebaseAvailable && !!app && !!database && !!auth;
};

export {
  database,
  auth,
  initializeFirebase,
  isFirebaseAvailable,
  getFirebaseInitialization,
  isFirebaseReady,
  validateFirebaseConfig
};
export default app;