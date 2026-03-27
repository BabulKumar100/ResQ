// Firebase initialization with fallback
let app: any = null;
let db: any = null;
let rtdb: any = null;
let auth: any = null;
let storage: any = null;

// Check if Firebase config is available
const hasFirebaseConfig = !!(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY
);

if (hasFirebaseConfig) {
  try {
    const { initializeApp } = require('firebase/app');
    const { getFirestore, enableIndexedDbPersistence } = require('firebase/firestore');
    const { getDatabase } = require('firebase/database');
    const { getAuth } = require('firebase/auth');
    const { getStorage } = require('firebase/storage');

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    auth = getAuth(app);
    storage = getStorage(app);

    // Enable offline persistence for Firestore
    enableIndexedDbPersistence(db).catch((err: any) => {
      if (err.code !== 'failed-precondition') {
        console.warn('Firestore persistence error:', err);
      }
    });
  } catch (error) {
    console.warn('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase configuration incomplete. Using Neon database instead.');
}

export { app, db, rtdb, auth, storage };
export default app;
