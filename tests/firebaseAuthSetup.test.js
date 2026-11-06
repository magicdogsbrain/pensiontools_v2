/**
 * How the two pages make Firebase Auth (src/firebase/config.js for the planner, src/v7/effects/planSource.js for the
 * preview), pinned as text:
 *   - initializeAuth, never getAuth: getAuth() hands Firebase its browserPopupRedirectResolver, which on Safari, iPhone and
 *     iPad loads Google's sign-in iframe (apis.google.com) the moment the page opens (the night run of 1 Nov 2026).
 *   - the persistence list is getAuth()'s own — IndexedDB first, then local storage, then session storage — so a sign-in
 *     Firebase stored under either page, before or after 6.46.0, is found. 6.46.0 named local storage alone: Firebase
 *     keeps a sign-in in IndexedDB, so none was seen and everyone was signed out once (decided 3 Nov 2026).
 *   - the resolver is handed to signInWithPopup alone (AuthService.js, effects/account.js).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const LIST = /initializeAuth\(app, \{ persistence: \[(F\.)?indexedDBLocalPersistence, (F\.)?browserLocalPersistence, (F\.)?browserSessionPersistence\] \}\)/;

describe('Firebase Auth is made the same way on both pages', () => {
  for (const file of ['src/firebase/config.js', 'src/v7/effects/planSource.js']) {
    it(`${file}: initializeAuth with the library's own persistence list, no getAuth, no pop-up resolver at creation`, () => {
      const code = read(file).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');   // the code alone: the comments name getAuth to say why it is not used
      expect(code).toMatch(LIST);
      expect(code).not.toMatch(/\bgetAuth\(/);   // the call; the comments may name it
      expect(code).not.toMatch(/popupRedirectResolver:/);
    });
  }
  it('the pop-up resolver goes to signInWithPopup alone, on both pages', () => {
    for (const file of ['src/firebase/AuthService.js', 'src/v7/effects/account.js']) {
      expect(read(file)).toMatch(/signInWithPopup\([^;]{0,160}?browserPopupRedirectResolver\)/);
    }
  });
});

describe('both pages keep ONE stored sign-in (7.1.0)', () => {
  // Firebase keeps a sign-in under a key holding the app's name: the new app's own name ("pt-preview") was never read by the
  // classic planner, so every hand-over opened it as if nobody were signed in. Both pages now make the default app.
  it('the classic planner and the new app each make the default Firebase app; the old name is used only to carry its sign-in over', () => {
    expect(read('src/firebase/config.js')).toMatch(/app = initializeApp\(firebaseConfig\);/);
    const v7 = read('src/v7/effects/planSource.js');
    expect(v7).toMatch(/const app = F\.initializeApp\(firebaseConfig\);/);
    expect(v7.match(/F\.initializeApp\(/g).length).toBe(2);
    expect(v7).toMatch(/F\.initializeAuth\(F\.initializeApp\(firebaseConfig, OLD_APP_NAME\)/);
  });
});
