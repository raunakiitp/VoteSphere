import { FirebaseApp, initializeApp, getApps, getApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

// Guard: only initialize when real config is present.
// During SSR/build, env vars for NEXT_PUBLIC_ are embedded at build-time.
// Server-only vars (like GEMINI_API_KEY) are never exposed here.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Only initialize if we have a valid API key to avoid SSR errors
const hasValidConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10);

const app: FirebaseApp = hasValidConfig
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : (getApps().length ? getApp() : initializeApp(firebaseConfig)); 

let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

if (typeof window !== 'undefined') {
  try {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
  } catch (error) {
    console.error("Firebase init error:", error);
    // Fallbacks for type safety
    auth = {} as Auth;
    db = {} as Firestore;
    storage = {} as FirebaseStorage;
    googleProvider = {} as GoogleAuthProvider;
  }
} else {
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
  googleProvider = {} as GoogleAuthProvider;
}

export { auth, db, storage, googleProvider };

export const getAnalyticsInstance = async () => {
  if (typeof window === 'undefined') return null;
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    if (await isSupported()) return getAnalytics(app);
  } catch {}
  return null;
};

export const getMessagingInstance = async () => {
  if (typeof window === 'undefined') return null;
  try {
    const { getMessaging, isSupported } = await import('firebase/messaging');
    if (await isSupported()) return getMessaging(app);
  } catch {}
  return null;
};

export default app;
