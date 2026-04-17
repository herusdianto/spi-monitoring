const admin = require('firebase-admin');

let db = null;

function initializeFirebase() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not set. Add your Firebase service account JSON to .env');
  }
  
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (err) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is invalid JSON');
  }
  
  if (!serviceAccount.private_key) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is missing private_key. Download from Firebase Console > Project Settings > Service Accounts');
  }
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || 'spi-monitoring'
    });
  }
  
  db = admin.firestore();
  return db;
}

function getFirestore() {
  if (!db) {
    initializeFirebase();
  }
  return db;
}

function verifyToken(token) {
  return admin.auth().verifyIdToken(token);
}

module.exports = {
  initializeFirebase,
  getFirestore,
  verifyToken,
  admin
};