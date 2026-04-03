import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Log missing config for debugging (redact API key)
const apiKeyToLog = firebaseConfig.apiKey || '';
const isEnvOverridden = !!(typeof process !== 'undefined' && process.env.FIREBASE_API_KEY);

if (!apiKeyToLog || apiKeyToLog === 'REPLACED_BY_ENV_VAR' || apiKeyToLog === 'undefined') {
  console.error("Firebase API Key is missing, placeholder, or 'undefined' string!", {
    isMissing: !apiKeyToLog,
    isPlaceholder: apiKeyToLog === 'REPLACED_BY_ENV_VAR',
    isUndefinedString: apiKeyToLog === 'undefined',
    isEnvOverridden
  });
} else if (!apiKeyToLog.startsWith('AIza')) {
  console.error("Firebase API Key does not start with 'AIza'. This is likely an invalid key.", { isEnvOverridden });
} else {
  console.log("Firebase API Key detected", { 
    isEnvOverridden, 
    length: apiKeyToLog.length,
    prefix: apiKeyToLog.substring(0, 8) + "..."
  });
}

if (!firebaseConfig.authDomain) console.error("Firebase Auth Domain is missing!");
if (!firebaseConfig.projectId) console.error("Firebase Project ID is missing!");

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, process.env.FIREBASE_FIRESTORE_DATABASE_ID || undefined);
