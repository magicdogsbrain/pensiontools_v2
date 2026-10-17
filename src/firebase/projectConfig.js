/**
 * The Firebase project's public settings — data only (research/v7/your-plan.md 4.1, 4.2). The planner's config.js
 * initialises the app from these; the preview's one Firebase file (src/v7/effects/planSource.js) reads the same project
 * read-only, so a sign-in made in the planner carries over (one site, one project, kept on this device).
 *
 * These values identify the project to Google's servers; they are not secrets (the security rules are).
 */
export const firebaseConfig = Object.freeze({
  apiKey: 'AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0',
  authDomain: 'pensiontools-4b237.firebaseapp.com',
  projectId: 'pensiontools-4b237',
  storageBucket: 'pensiontools-4b237.firebasestorage.app',
  messagingSenderId: '760877353696',
  appId: '1:760877353696:web:2d6f7173c8d7fab6fd9e85'
});

/** True once the placeholder has been replaced with a real project. */
export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== 'YOUR_API_KEY';
}
