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
import { initializeAuth, connectAuthEmulator, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration: the project's public settings live in projectConfig.js (data only), which the preview's
// read-only plan source reads too (research/v7/your-plan.md 4.1).
import { firebaseConfig, isFirebaseConfigured, EMULATOR_HOSTS } from './projectConfig.js';
export { isFirebaseConfigured };

// Initialize Firebase
let app = null;
let auth = null;
let db = null;

try {
  if (isFirebaseConfigured()) {
    app = initializeApp(firebaseConfig);
    // Auth without the pop-up resolver. getAuth() would hand Firebase its browserPopupRedirectResolver, and on Safari,
    // iPhone and iPad that resolver loads Google's sign-in iframe (apis.google.com) the moment the page opens — a request
    // to Google from a visitor who never signs in (the night run of 1 Nov 2026, WebKit). The resolver goes to
    // signInWithPopup instead (AuthService.js), the one place it is needed. The persistence list is getAuth()'s own —
    // IndexedDB first, then local storage, then session storage — so a sign-in Firebase stored before 6.46.0 (in IndexedDB)
    // is found and kept: 6.46.0 named local storage alone, which saw none of them and signed everyone out once (found
    // 3 Nov 2026). Bounded by the app's 1-hour inactivity sign-out (audit L12).
    auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence] });
    db = getFirestore(app);

    // The signed-in browser tests' build only (projectConfig.js EMULATOR_HOSTS, made with VITE_EMULATORS=1): the local
    // emulators of a demo- project. Null in every other build, so this is dropped from the published bundle.
    if (EMULATOR_HOSTS) {
      connectAuthEmulator(auth, EMULATOR_HOSTS.auth, { disableWarnings: true });
      connectFirestoreEmulator(db, EMULATOR_HOSTS.firestoreHost, EMULATOR_HOSTS.firestorePort);
    }
  } else {
    console.warn('Firebase not configured. Login required to save data.');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, auth, db };
export default firebaseConfig;
