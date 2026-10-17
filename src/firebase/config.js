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
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration: the project's public settings live in projectConfig.js (data only), which the preview's
// read-only plan source reads too (research/v7/your-plan.md 4.1).
import { firebaseConfig, isFirebaseConfigured } from './projectConfig.js';
export { isFirebaseConfigured };

// Initialize Firebase
let app = null;
let auth = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Explicit choice (audit L12): local persistence, bounded by the app's 1-hour inactivity sign-out.
    setPersistence(auth, browserLocalPersistence).catch(() => {});
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
