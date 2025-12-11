// src/firebase/provider.tsx
'use client';
import {
  createContext,
  useContext,
  type ReactNode,
  type FC,
  useMemo,
} from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { initializeFirebase } from '.';

interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export const FirebaseProvider: FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  auth,
  firestore,
}) => {
  const value = useMemo(
    () => ({ firebaseApp, auth, firestore }),
    [firebaseApp, auth, firestore]
  );
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextValue => {
  const context = useContext(FirebaseContext);
  if (!context) {
    // This should never happen, but it's a good safeguard
    console.warn(
      'useFirebase must be used within a FirebaseProvider. Initializing a new Firebase app as a fallback.'
    );
    return initializeFirebase();
  }
  return context;
};

export const useFirebaseApp = (): FirebaseApp => useFirebase().firebaseApp;
export const useAuth = (): Auth => useFirebase().auth;
export const useFirestore = (): Firestore => useFirebase().firestore;
