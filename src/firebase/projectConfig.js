/* global __PT_EMULATORS__ */
/**
 * The Firebase project's public settings — data only (research/v7/your-plan.md 4.1, 4.2). The planner's config.js
 * initialises the app from these; the preview's one Firebase file (src/v7/effects/planSource.js) reads the same project
 * read-only, so a sign-in made in the planner carries over (one site, one project, kept on this device).
 *
 * These values identify the project to Google's servers; they are not secrets (the security rules are).
 *
 * The signed-in browser tests (research/v7/after-7.md §3) run against the local Firebase emulators, never the live
 * project. Their build alone is made with VITE_EMULATORS=1, which vite.config.js and vite.v7.config.js hand to Vite's
 * `define` as __PT_EMULATORS__: then the settings below are a `demo-` project's (a project whose name starts with
 * "demo-" cannot reach any live service, and has no real key) and EMULATOR_HOSTS says where the two emulators listen. The
 * define makes the choice a constant, so each build carries one set of settings and drops the other: the published build
 * holds no emulator address and the emulator build no live project id or key (tests/emulatorBuild.test.js reads both).
 * Anything that runs without Vite's define (the unit tests, Node scripts) gets the live settings and no emulators.
 */
const EMULATORS = typeof __PT_EMULATORS__ === 'boolean' && __PT_EMULATORS__;

export const firebaseConfig = Object.freeze(EMULATORS
  ? {
      apiKey: 'demo-api-key',
      authDomain: 'demo-pensiontools.firebaseapp.com',
      projectId: 'demo-pensiontools',
      storageBucket: 'demo-pensiontools.appspot.com',
      messagingSenderId: '000000000000',
      appId: '1:000000000000:web:0000000000000000000000'
    }
  : {
      apiKey: 'AIzaSyBdbve0H70D-Ch69WlaxEly7PVBFVRB5p0',
      authDomain: 'pensiontools-4b237.firebaseapp.com',
      projectId: 'pensiontools-4b237',
      storageBucket: 'pensiontools-4b237.firebasestorage.app',
      messagingSenderId: '760877353696',
      appId: '1:760877353696:web:2d6f7173c8d7fab6fd9e85'
    });

/**
 * Where the local emulators listen (firebase.json's emulators block), in the emulator build only; null in every other
 * build, so nothing connects anywhere but the project above.
 */
export const EMULATOR_HOSTS = EMULATORS
  ? Object.freeze({ auth: 'http://127.0.0.1:9099', firestoreHost: '127.0.0.1', firestorePort: 8080 })
  : null;

/** True once the placeholder has been replaced with a real project. */
export function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== 'YOUR_API_KEY';
}
