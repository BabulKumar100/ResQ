import * as admin from 'firebase-admin';

// 4. Role-Based Auth Fix 
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  try {
    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
      });
    } else {
      admin.initializeApp({
        projectId: projectId || 'mock-project',
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
      });
    }
  } catch (err) {
    console.warn('Firebase Admin init failed - falling back to mock');
  }
}

// Robust mock objects for server-side
const db = admin.apps.length ? admin.firestore() : { 
  collection: () => ({ 
    doc: () => ({ set: () => Promise.resolve(), update: () => Promise.resolve(), get: () => Promise.resolve({ exists: false, data: () => ({}) }) }),
    where: () => ({ get: () => Promise.resolve({ empty: true, docs: [], size: 0 }) })
  }),
  batch: () => ({ update: () => {}, set: () => {}, commit: () => Promise.resolve() })
} as any;

const auth = admin.apps.length ? admin.auth() : { 
  getUserByEmail: () => Promise.reject(new Error('Admin Auth Mocked')), 
  createUser: () => Promise.resolve({ uid: 'mock-uid' }) 
} as any;

const rtdb = admin.apps.length ? admin.database() : { ref: () => ({ set: () => Promise.resolve() }) } as any;

export { db, auth, rtdb, admin };
