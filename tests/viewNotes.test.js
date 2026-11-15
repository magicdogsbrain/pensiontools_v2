/**
 * The full view's sign-out clears the simple view's notes (7.11.0; src/ui/viewNotes.js, src/firebase/AuthService.js
 * logOut): the signed-in note, this browser's copy of the choice of view and the strip's "Not now". Before this, a
 * sign-out in the full view left the note and the copy behind, and the site's address went on opening the full view's
 * landing page for whoever used the browser next. Only those three keys go; a refused sign-out leaves them; a browser
 * that refuses its storage is left as it is.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const firebase = vi.hoisted(() => ({ signOut: null }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: () => () => {},
  GoogleAuthProvider: class {},
  createUserWithEmailAndPassword: vi.fn(), signInWithEmailAndPassword: vi.fn(), signInWithPopup: vi.fn(),
  signOut: (...a) => firebase.signOut(...a),
  sendPasswordResetEmail: vi.fn(), sendEmailVerification: vi.fn(), updateProfile: vi.fn(), deleteUser: vi.fn()
}));
vi.mock('../src/firebase/config.js', () => ({ auth: {}, db: {}, app: null, default: {}, isFirebaseConfigured: () => true }));

import { SIMPLE_VIEW_NOTES, clearSimpleViewNotes } from '../src/ui/viewNotes.js';
import { logOut } from '../src/firebase/AuthService.js';
import { SIGNED_IN_KEY } from '../src/v7/effects/place.js';
import { VIEW_KEY, ASKED_KEY } from '../src/v7/effects/view.js';

const OTHERS = { pt_lastActivity: '1', pt_lastSeenVersion: '7.10.0', pt_guest_minutes: '12' };
const fill = () => {
  localStorage.clear();
  for (const [k, v] of Object.entries({ [SIGNED_IN_KEY]: '1', [VIEW_KEY]: 'full', [ASKED_KEY]: '1', ...OTHERS })) localStorage.setItem(k, v);
};
const kept = () => Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)]));

describe('the simple view\'s notes', () => {
  beforeEach(fill);
  it('are the simple view\'s own three keys', () => {
    expect([...SIMPLE_VIEW_NOTES].sort()).toEqual([SIGNED_IN_KEY, VIEW_KEY, ASKED_KEY].sort());
  });
  it('clearSimpleViewNotes removes those three and nothing else', () => {
    clearSimpleViewNotes();
    expect(kept()).toEqual(OTHERS);
  });
  it('a storage that refuses, or none: nothing breaks', () => {
    const refusing = { removeItem: () => { throw new Error('blocked'); } };
    expect(() => clearSimpleViewNotes(refusing)).not.toThrow();
    expect(() => clearSimpleViewNotes(null)).not.toThrow();
  });
});

describe('the full view\'s sign-out (AuthService.logOut: the header\'s button, the idle sign-out, the email gate)', () => {
  beforeEach(fill);
  it('signs out, then clears the three notes', async () => {
    const order = [];
    firebase.signOut = () => { order.push(['signOut', localStorage.getItem(VIEW_KEY)]); return Promise.resolve(); };
    await logOut();
    expect(order).toEqual([['signOut', 'full']]);
    expect(kept()).toEqual(OTHERS);
  });
  it('a sign-out that fails leaves them: the person is still signed in', async () => {
    firebase.signOut = () => Promise.reject(new Error('network'));
    await expect(logOut()).rejects.toThrow('network');
    expect(localStorage.getItem(SIGNED_IN_KEY)).toBe('1');
    expect(localStorage.getItem(VIEW_KEY)).toBe('full');
  });
  it('every one of the full view\'s sign-outs goes through logOut, and the page\'s own script names none of the keys', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    expect((html.match(/await logOut\(\);/g) || []).length).toBe(2);   // the header's Sign Out and the hour-idle sign-out
    for (const key of SIMPLE_VIEW_NOTES) expect(html).not.toContain(key);
    for (const f of ['src/ui/components/AuthScreen.js', 'src/ui/components/AuthPanel.js']) expect(readFileSync(join(process.cwd(), f), 'utf8'), f).toMatch(/await logOut\(\)/);
  });
});
