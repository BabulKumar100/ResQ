import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'dispatcher' | 'rescuer' | 'viewer';
}

// Sign in with email and password
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Create new account
export const registerWithEmail = async (email: string, password: string, name: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create rescuer profile
  await setDoc(doc(db, 'rescuers', user.uid), {
    userId: user.uid,
    name,
    email,
    role: 'viewer', // Default role
    lat: 0,
    lng: 0,
    status: 'offline',
    agency: '',
    fuelPct: 100,
    crewCount: 0,
    equipment: [],
    createdAt: new Date(),
  });

  return user;
};

// Sign in with Google
export const loginWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Check if rescuer profile exists
  const rescuerSnap = await getDoc(doc(db, 'rescuers', user.uid));
  if (!rescuerSnap.exists()) {
    await setDoc(doc(db, 'rescuers', user.uid), {
      userId: user.uid,
      name: user.displayName || 'Unknown',
      email: user.email,
      role: 'viewer',
      lat: 0,
      lng: 0,
      status: 'offline',
      agency: '',
      fuelPct: 100,
      crewCount: 0,
      equipment: [],
      createdAt: new Date(),
    });
  }

  return user;
};

// Sign out
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Get current user with role
export const getCurrentAuthUser = async (user: User): Promise<AuthUser | null> => {
  try {
    const rescuerSnap = await getDoc(doc(db, 'rescuers', user.uid));
    if (!rescuerSnap.exists()) {
      return null;
    }

    const rescuerData = rescuerSnap.data();
    return {
      uid: user.uid,
      email: user.email || '',
      name: rescuerData.name || user.displayName || 'Unknown',
      role: rescuerData.role || 'viewer',
    };
  } catch (error) {
    console.error('Error fetching auth user:', error);
    return null;
  }
};

// Listen to auth state changes
export const listenToAuthState = (callback: (user: AuthUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const authUser = await getCurrentAuthUser(user);
      callback(authUser);
    } else {
      callback(null);
    }
  });
};

// Verify ID token on server
export const verifyIdToken = async (idToken: string): Promise<any> => {
  // This is called server-side from firebaseAdmin
  // Client gets token with: await auth.currentUser?.getIdToken()
  return idToken; // Server will verify this with adminAuth.verifyIdToken()
};
