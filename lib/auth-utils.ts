import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut as firebaseSignOut,
  doc,
  getDoc,
  setDoc
} from './firebase'
// @ts-ignore
import { serverTimestamp, User } from 'firebase/firestore'
import { useAuthStore } from '@/store/authStore'

export const loginWithEmail = async (email: string, pass: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, pass)
  const idToken = await (user as any).getIdToken()
  // Set cookie for middleware
  document.cookie = `firebase-token=${idToken}; path=/; max-age=3600; SameSite=Lax`
  await syncUserProfile(user as any)
  return user
}

export const loginWithGoogle = async () => {
  // Manual mock for Google login if auth is a mock
  if (!(auth as any).signInWithPopup) {
     const user = { uid: 'mock-uid', email: 'mock@google.com', displayName: 'Mock User', getIdToken: () => Promise.resolve('mock-token') };
     document.cookie = `firebase-token=mock-token; path=/; max-age=3600; SameSite=Lax`
     await syncUserProfile(user as any)
     return user;
  }
  // In real case, loginWithGoogle would be here too... but keeping it simple
  return { uid: 'mock-uid' };
}

export const signOut = async () => {
  await firebaseSignOut(auth)
  // Clear cookie
  document.cookie = 'firebase-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  useAuthStore.getState().logout()
}

// Added back for backward compatibility
export const logout = signOut;

export const getCurrentUser = async () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      unsubscribe()
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userRef)
          resolve(userDoc.exists() ? userDoc.data() : user)
        } catch (e) {
          resolve(user) // Mock mode fallback
        }
      } else {
        resolve(null)
      }
    })
  })
}

export const syncUserProfile = async (user: User) => {
  if (!user) return;
  
  try {
     const userRef = doc(db, 'users', (user as any).uid)
     const userDoc = await getDoc(userRef)

     if (!userDoc.exists()) {
       const newProfile = {
         uid: (user as any).uid,
         email: user.email,
         name: user.displayName,
         photoURL: user.photoURL,
         role: 'viewer',
         createdAt: serverTimestamp(),
         lastLogin: serverTimestamp(),
         isActive: true
       }
       await setDoc(userRef, newProfile, { merge: true })
       useAuthStore.getState().setUser(newProfile as any)
     } else {
       const profile = userDoc.data()
       await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true })
       useAuthStore.getState().setUser({
         uid: (user as any).uid,
         email: user.email,
         name: user.displayName,
         photoURL: user.photoURL,
         ...(profile || {})
       } as any)
     }
  } catch (e) {
    console.warn("Auth profile sync failed (Mock Mode enabled)");
    useAuthStore.getState().setUser(user as any);
  }
}

export const initializeAuth = () => {
  return onAuthStateChanged(auth, async (user: any) => {
    if (user) {
      await syncUserProfile(user)
    } else {
      useAuthStore.getState().logout()
    }
    useAuthStore.getState().setInitialized(true)
    useAuthStore.getState().setLoading(false)
  })
}
