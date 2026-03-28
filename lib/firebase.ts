// Firebase Robust Mock System for resqmap
import { initializeApp, getApps, getApp } from 'firebase/app';
import * as firestore from 'firebase/firestore';
import * as database from 'firebase/database';
import * as authLib from 'firebase/auth';
import * as storageLib from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isMock = !firebaseConfig.apiKey;

let app: any;
try {
  if (!isMock) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } else {
    app = { options: { projectId: 'mock-project' } };
  }
} catch (e) {
  app = { options: { projectId: 'mock-project' } };
}

// Client Services
export const db = !isMock ? firestore.getFirestore(app) : { type: 'firestore-mock' } as any;
export const auth = !isMock ? authLib.getAuth(app) : { type: 'auth-mock' } as any;
export const rtdb = !isMock ? database.getDatabase(app) : { type: 'rtdb-mock' } as any;
export const storage = !isMock ? storageLib.getStorage(app) : {} as any;

// Mock-aware Wrappers for Firebase Firestore
export const collection = (db: any, path: string) => {
  if (!isMock) return firestore.collection(db, path);
  return { path, type: 'mock-collection' };
};

export const doc = (db: any, colOrPath: string, id?: string) => {
  if (!isMock) return firestore.doc(db, colOrPath, id as string);
  return { id, path: colOrPath, type: 'mock-doc' };
};

export const query = (col: any, ...constraints: any[]) => {
  if (!isMock) return firestore.query(col, ...constraints);
  return col; // return collection mock
};

export const onSnapshot = (q: any, cb: any) => {
  if (!isMock) return firestore.onSnapshot(q, cb);
  // Return empty success for mock
  setTimeout(() => cb({ docs: [], docChanges: () => [] }), 500);
  return () => { };
};

export const getDoc = (ref: any) => {
  if (!isMock) return firestore.getDoc(ref);
  return Promise.resolve({ exists: () => true, data: () => ({}) });
};

export const setDoc = (ref: any, data: any, options: any) => {
  if (!isMock) return firestore.setDoc(ref, data, options);
  return Promise.resolve();
};

export const updateDoc = (ref: any, data: any) => {
  if (!isMock) return firestore.updateDoc(ref, data);
  return Promise.resolve();
};

// Mock-aware Wrappers for Firebase Auth
export const signInWithEmailAndPassword = async (_auth: any, email: string, pass: string) => {
  if (!isMock) return authLib.signInWithEmailAndPassword(_auth, email, pass);
  return { user: { uid: 'mock-uid', email, displayName: 'Mock Admin', getIdToken: () => Promise.resolve('mock-token') } };
};

export const onAuthStateChanged = (auth: any, cb: any) => {
  if (!isMock) return authLib.onAuthStateChanged(auth, cb);
  setTimeout(() => cb({ uid: 'mock-uid', email: 'admin@resqmap.in', displayName: 'Mock Admin', getIdToken: () => Promise.resolve('mock-token') }), 500);
  return () => { };
};

export const signOut = async (auth: any) => {
  if (!isMock) return authLib.signOut(auth);
  return Promise.resolve();
};

export { isMock };
