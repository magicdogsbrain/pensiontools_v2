/**
 * Firebase Configuration
 *
 * IMPORTANT: Replace the firebaseConfig values with your own Firebase project credentials.
 * Get these from: Firebase Console > Project Settings > Your apps > Web app
 *
 * To set up Firebase:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Add a web app to your project
 * 4. Copy the config values here
 * 5. Enable Authentication (Email/Password and Google)
 * 6. Enable Firestore Database
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0",
  authDomain: "pensiontools-4b237.firebaseapp.com",
  projectId: "pensiontools-4b237",
  storageBucket: "pensiontools-4b237.firebasestorage.app",
  messagingSenderId: "760877353696",
  appId: "1:760877353696:web:2d6f7173c8d7fab6fd9e85",
  measurementId: "G-80XX542QZE"
};

// Check if Firebase is configured
export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
}

// Initialize Firebase
let app = null;
let auth = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Use emulators in development (optional)
    if (import.meta.env?.DEV && import.meta.env?.VITE_USE_EMULATORS === 'true') {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('Using Firebase emulators');
    }
  } else {
    console.warn('Firebase not configured. Login required to save data.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, auth, db };
export default firebaseConfig;
