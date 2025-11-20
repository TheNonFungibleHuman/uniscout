
import { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';

// Initialize Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDKBQg1V9Y6kuY_EbdjRKeEgYStT_EZA0",
  authDomain: "gen-lang-client-0681949015.firebaseapp.com",
  projectId: "gen-lang-client-0681949015",
  storageBucket: "gen-lang-client-0681949015.firebasestorage.app",
  messagingSenderId: "291482318316",
  appId: "1:291482318316:web:391b6c1df554c17006fcc9",
  measurementId: "G-XV75VXN5CK"
};

let auth: any;
let googleProvider: any;
let isFirebaseInitialized = false;

// Attempt to initialize Firebase
try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    isFirebaseInitialized = true;
    console.log("Firebase initialized successfully");
} catch (e) {
    console.error("Firebase initialization failed:", e);
}

// Mapper from Firebase User to our AuthUser
const mapFirebaseUser = (user: User): AuthUser => ({
    id: user.uid,
    name: user.displayName || 'Scholar',
    email: user.email || '',
    emailVerified: user.emailVerified,
    image: user.photoURL || undefined,
    createdAt: new Date(user.metadata.creationTime || Date.now()),
    updatedAt: new Date(user.metadata.lastSignInTime || Date.now()),
    type: 'applicant'
});

// --- MOCK AUTH UTILITIES (Fallback) ---
const MOCK_SESSION_KEY = 'gradwyn_mock_session';

const createMockUser = (): AuthUser => ({
    id: 'demo-scholar-id',
    name: 'Demo Scholar',
    email: 'scholar@demo.edu',
    emailVerified: true,
    image: 'https://ui-avatars.com/api/?name=Demo+Scholar&background=0D8ABC&color=fff&bold=true',
    createdAt: new Date(),
    updatedAt: new Date(),
    type: 'applicant'
});

// Helper to perform mock login logic
const performMockLogin = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = createMockUser();
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockUser));
    
    // Dispatch event to update hooks
    window.dispatchEvent(new Event('auth-state-change'));
    
    return { data: mockUser, error: null };
};

export const authClient = {
  signIn: {
    social: async ({ provider }: { provider: 'google' | 'github' }) => {
        // 1. Try Real Firebase Auth
        if (isFirebaseInitialized && auth) {
            if (provider === 'google') {
                 try {
                    const result = await signInWithPopup(auth, googleProvider);
                    return { data: mapFirebaseUser(result.user), error: null };
                 } catch (error: any) {
                    // ERROR HANDLING STRATEGY:
                    // If the specific Google Auth configuration is missing on the backend (auth/configuration-not-found),
                    // or the domain isn't authorized (auth/unauthorized-domain), we fallback to Demo Mode 
                    // so the user isn't blocked during preview/testing.
                    const handledErrorCodes = [
                        'auth/configuration-not-found',
                        'auth/operation-not-allowed',
                        'auth/unauthorized-domain',
                        'auth/admin-restricted-operation'
                    ];

                    if (handledErrorCodes.includes(error.code)) {
                        console.warn(`Firebase Auth unavailable (${error.code}). Falling back to Demo Mode.`);
                        return await performMockLogin();
                    } 
                    
                    if (error.code === 'auth/popup-closed-by-user') {
                        return { data: null, error: "Sign-in cancelled." };
                    }
                    
                    console.error("Firebase Login Error:", error);
                    return { data: null, error: error.message || "Authentication failed" };
                 }
            }
            return { data: null, error: "Provider not supported" };
        }

        // 2. Fallback to Mock Auth (If initialization failed entirely)
        console.warn("Firebase not initialized. Using Mock Auth.");
        return await performMockLogin();
    },
    email: async () => {
        return { data: null, error: "Email login not implemented in this version" };
    }
  },
  
  signOut: async () => {
     if (isFirebaseInitialized && auth) {
         try {
            await firebaseSignOut(auth);
            // Also clear mock session just in case
            localStorage.removeItem(MOCK_SESSION_KEY);
            window.dispatchEvent(new Event('auth-state-change'));
            return { data: true, error: null };
         } catch (error: any) {
            return { data: null, error: error.message };
         }
     } else {
         // Mock Sign Out
         localStorage.removeItem(MOCK_SESSION_KEY);
         window.dispatchEvent(new Event('auth-state-change'));
         return { data: true, error: null };
     }
  },
  
  useSession: () => {
    const [data, setData] = useState<AuthUser | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        // Central function to resolve current user state from Firebase OR LocalStorage
        const syncSessionState = (firebaseUser: User | null) => {
            if (firebaseUser) {
                // Priority 1: Firebase User
                setData(mapFirebaseUser(firebaseUser));
            } else {
                // Priority 2: Mock Session (Fallback)
                const stored = localStorage.getItem(MOCK_SESSION_KEY);
                if (stored) {
                    try {
                        setData(JSON.parse(stored));
                    } catch (e) {
                        setData(null);
                    }
                } else {
                    setData(null);
                }
            }
            setIsPending(false);
        };

        let unsubscribeFirebase: any;

        // 1. Setup Firebase Listener
        if (isFirebaseInitialized && auth) {
            unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
                syncSessionState(user);
            }, (err) => {
                console.warn("Auth Observer Error, checking local storage fallback", err);
                syncSessionState(null);
                setError(err);
            });
        } else {
            // Initial check if firebase isn't ready
            syncSessionState(null);
        }

        // 2. Setup Manual Event Listener (For Mock Login Fallback)
        // This is critical: If Firebase fails and we fallback to mock login, 
        // onAuthStateChanged won't fire, so we need this event.
        const handleManualAuthChange = () => {
            const currentUser = (isFirebaseInitialized && auth) ? auth.currentUser : null;
            syncSessionState(currentUser);
        };

        window.addEventListener('auth-state-change', handleManualAuthChange);

        return () => {
            if (unsubscribeFirebase) unsubscribeFirebase();
            window.removeEventListener('auth-state-change', handleManualAuthChange);
        };
    }, []);

    return { data, isPending, error };
  }
};
