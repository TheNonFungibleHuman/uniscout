import { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile,
    signOut as firebaseSignOut, 
    onAuthStateChanged, 
    User 
} from 'firebase/auth';

// Initialize Firebase configuration from Environment Variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

let auth: any;
let googleProvider: any;
let isFirebaseInitialized = false;

// Attempt to initialize Firebase
if (firebaseConfig.apiKey) {
    try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
        isFirebaseInitialized = true;
        console.log("Firebase initialized successfully");
    } catch (e) {
        console.error("Firebase initialization failed:", e);
    }
} else {
    console.log("Firebase config missing. Defaulting to Mock Auth mode.");
}

// Mapper from Firebase User to our AuthUser
// Note: We store 'role' in displayName for simplified handling in this demo if strictly using Firebase
// In a real app, this would be in Firestore or Custom Claims.
const mapFirebaseUser = (user: User, overrideType?: 'applicant' | 'mentor' | 'university'): AuthUser => {
    // Try to parse type from photoURL hack or metadata if we were storing it there
    // For this demo, we will default to applicant unless explicitly told otherwise during session creation
    return {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        emailVerified: user.emailVerified,
        image: user.photoURL || undefined,
        createdAt: new Date(user.metadata.creationTime || Date.now()),
        updatedAt: new Date(user.metadata.lastSignInTime || Date.now()),
        type: overrideType || 'applicant' // Default, will be patched by local storage state in App.tsx usually
    };
};

// --- MOCK AUTH UTILITIES (Fallback) ---
const MOCK_SESSION_KEY = 'gradwyn_mock_session';

const performMockLogin = async (email?: string, type: 'applicant' | 'mentor' | 'university' = 'applicant') => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: AuthUser = {
        id: 'mock-' + Date.now(),
        name: email ? email.split('@')[0] : 'Demo User',
        email: email || 'demo@gradwyn.edu',
        emailVerified: true,
        image: `https://ui-avatars.com/api/?name=${email || 'User'}&background=random`,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: type
    };
    
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockUser));
    window.dispatchEvent(new Event('auth-state-change'));
    
    return { data: mockUser, error: null };
};

export const authClient = {
  signIn: {
    social: async ({ provider, role = 'applicant' }: { provider: 'google' | 'github', role?: 'applicant' | 'mentor' | 'university' }) => {
        if (isFirebaseInitialized && auth) {
            if (provider === 'google') {
                 try {
                    const result = await signInWithPopup(auth, googleProvider);
                    // Persist role preference locally since we can't easily set custom claims from client
                    localStorage.setItem('gradwyn_user_role', role);
                    return { data: mapFirebaseUser(result.user, role), error: null };
                 } catch (error: any) {
                    if (['auth/configuration-not-found', 'auth/api-key-not-valid'].includes(error.code)) {
                        return await performMockLogin(undefined, role);
                    }
                    if (error.code === 'auth/popup-closed-by-user') return { data: null, error: "Sign-in cancelled." };
                    return { data: null, error: error.message };
                 }
            }
            return { data: null, error: "Provider not supported" };
        }
        return await performMockLogin(undefined, role);
    },
    
    signUpEmail: async ({ email, password, name, role }: { email: string, password: string, name: string, role: 'applicant' | 'mentor' | 'university' }) => {
        if (isFirebaseInitialized && auth) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                localStorage.setItem('gradwyn_user_role', role);
                return { data: mapFirebaseUser(userCredential.user, role), error: null };
            } catch (error: any) {
                if (['auth/configuration-not-found', 'auth/api-key-not-valid'].includes(error.code)) {
                    return await performMockLogin(email, role);
                }
                return { data: null, error: error.message };
            }
        }
        return await performMockLogin(email, role);
    },

    signInEmail: async ({ email, password }: { email: string, password: string }) => {
        if (isFirebaseInitialized && auth) {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                // Retrieve stored role or default
                const storedRole = localStorage.getItem('gradwyn_user_role') as 'applicant' | 'mentor' | 'university' | null;
                return { data: mapFirebaseUser(userCredential.user, storedRole || 'applicant'), error: null };
            } catch (error: any) {
                if (['auth/configuration-not-found', 'auth/api-key-not-valid'].includes(error.code)) {
                    return await performMockLogin(email, 'applicant'); // Default to applicant for mock login
                }
                return { data: null, error: error.message };
            }
        }
        return await performMockLogin(email, 'applicant');
    }
  },
  
  signOut: async () => {
     if (isFirebaseInitialized && auth) {
         try {
            await firebaseSignOut(auth);
            localStorage.removeItem(MOCK_SESSION_KEY);
            window.dispatchEvent(new Event('auth-state-change'));
            return { data: true, error: null };
         } catch (error: any) {
            return { data: null, error: error.message };
         }
     } else {
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
        const syncSessionState = (firebaseUser: User | null) => {
            if (firebaseUser) {
                const storedRole = localStorage.getItem('gradwyn_user_role') as 'applicant' | 'mentor' | 'university' | null;
                setData(mapFirebaseUser(firebaseUser, storedRole || 'applicant'));
            } else {
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

        if (isFirebaseInitialized && auth) {
            unsubscribeFirebase = onAuthStateChanged(auth, (user) => {
                syncSessionState(user);
            }, (err) => {
                syncSessionState(null);
                setError(err);
            });
        } else {
            syncSessionState(null);
        }

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