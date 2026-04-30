import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBuLhH-9F0hh6ouIMspbMd5zcuHlJTQR8I",
  authDomain: "gen-lang-client-0681949015.firebaseapp.com",
  projectId: "gen-lang-client-0681949015",
  storageBucket: "gen-lang-client-0681949015.firebasestorage.app",
  messagingSenderId: "291482318316",
  appId: "1:291482318316:web:4ca78b068fc7e44406fcc9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);