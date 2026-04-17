import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'spi-monitoring.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'spi-monitoring',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'spi-monitoring.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123'
};

let app;
let auth;
let db;
const googleProvider = new GoogleAuthProvider();

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}

export function getFirebaseAuth() {
  if (!auth) {
    initFirebase();
  }
  return auth;
}

export async function signInWithGoogle() {
  const auth = getFirebaseAuth();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      return null;
    }
    throw error;
  }
}

export function logout() {
  const auth = getFirebaseAuth();
  return signOut(auth);
}

export function getFirebaseDb() {
  if (!db) {
    initFirebase();
  }
  return db;
}

export async function getCurrentUser() {
  return new Promise((resolve) => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export function observeAuth(callback) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export default {
  initFirebase,
  getFirebaseAuth,
  getFirebaseDb,
  getCurrentUser,
  observeAuth,
  signInWithGoogle,
  logout
};