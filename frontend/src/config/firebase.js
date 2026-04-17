import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'spi-monitoring.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'spi-monitoring',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'spi-monitoring.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abc123'
};

let app;
let auth;
let db;

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
  observeAuth
};