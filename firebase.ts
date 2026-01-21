
// Fix: Ensuring initializeApp is correctly imported as a named export from 'firebase/app'
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace these with your project's actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo5FPjk9q9U__7KMiGPDsDYo4_lxGXKIY",
  authDomain: "zari-perfumes.firebaseapp.com",
  projectId: "zari-perfumes",
  storageBucket: "zari-perfumes.firebasestorage.app",
  messagingSenderId: "392420202064",
  appId: "1:392420202064:web:c3ff36213e95786cbee355",
  measurementId: "G-60V8L157ZF"
};

// Initialize Firebase with a check for existing apps to prevent the "no exported member" error 
// and handle hot-module replacement properly.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
