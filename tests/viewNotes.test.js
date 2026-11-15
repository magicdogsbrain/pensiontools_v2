/**
 * The full view's sign-out clears the simple view's notes (7.11.0; src/ui/viewNotes.js, src/firebase/AuthService.js
 * logOut): the signed-in note, this browser's copy of the choice of view and the strip's "Not now". Before this, a
 * sign-out in the full view left the note and the copy behind, and the site's address went on opening the full view's
 * landing page for whoever used the browser next. Only those three keys go; a refused sign-out leaves them; a browser
 * that refuses its storage is left as it is.
 * And its sign-in puts them back for someone whose account says the full view (AuthService.viewNotesAtSignIn, at the
 * one settings read per sign-in): without it, the first sign-out in the full view (the hour-idle one among them) left
 * such a person on the simple view's front door at the site's address from then on, while Your account said the full
 * view. Anyone else gets no note from it, as before; a copy the account no longer holds goes.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const firebase = vi.hoisted(() => ({ signOut: null, listener: null }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (a, cb) => { firebase.listener = cb; return () => {}; },
  GoogleAuthProvider: class {},
  createUserWithEmailAndPassword: vi.fn(), signInWithEmailAndPassword: vi.fn(), signInWithPopup: vi.fn(),
  signOut: (...a) => firebase.signOut(...a),
  sendPasswordResetEmail: vi.fn(), sendEmailVerification: vi.fn(), updateProfile: vi.fn(), deleteUser: vi.fn()
}));
vi.mock('../src/firebase/config.js', () => ({ auth: {}, db: {}, app: null, default: {}, isFirebaseConfigured: () => true }));

import { SIMPLE_VIEW_NOTES, clearSimpleViewNotes, followViewChoice } from '../src/ui/viewNotes.js';
import { logOut, viewNotesAtSignIn, initAuthStateListener, enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
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

/** A storage stand-in that counts every write. */
function counting(start = {}) {
  const map = new Map(Object.entries(start));
  const writes = [];
  return {
    map, writes,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { writes.push(['set', k]); map.set(k, String(v)); },
    removeItem: (k) => { writes.push(['remove', k]); map.delete(k); }
  };
}
const all = (st) => Object.fromEntries(st.map);

describe('followViewChoice: the account\'s settings, read at the full view\'s sign-in', () => {
  it('the full view chosen: the signed-in note and the copy are set, and nothing else is touched', () => {
    const st = counting(OTHERS);
    followViewChoice({ lastSeenVersion: '7.10.0', view: 'full' }, st);
    expect(all(st)).toEqual({ ...OTHERS, [SIGNED_IN_KEY]: '1', [VIEW_KEY]: 'full' });
    expect(st.writes).toEqual([['set', SIGNED_IN_KEY], ['set', VIEW_KEY]]);
  });
  it('a browser already in step writes nothing', () => {
    const st = counting({ [SIGNED_IN_KEY]: '1', [VIEW_KEY]: 'full', [ASKED_KEY]: '1' });
    followViewChoice({ view: 'full' }, st);
    expect(st.writes).toEqual([]);
  });
  it('the simple view chosen, or no choice: the copy goes (another device chose, or a copy left by someone else); the signed-in note and "Not now" stay; nothing is set', () => {
    for (const profile of [{ view: 'simple' }, { lastSeenVersion: '7.10.0' }, { view: 'expert' }, {}]) {
      const st = counting({ [SIGNED_IN_KEY]: '1', [VIEW_KEY]: 'full', [ASKED_KEY]: '1', ...OTHERS });
      followViewChoice(profile, st);
      expect(all(st), JSON.stringify(profile)).toEqual({ [SIGNED_IN_KEY]: '1', [ASKED_KEY]: '1', ...OTHERS });
      expect(st.writes, JSON.stringify(profile)).toEqual([['remove', VIEW_KEY]]);
      const bare = counting(OTHERS);
      followViewChoice(profile, bare);
      expect(bare.writes, JSON.stringify(profile)).toEqual([]);   // someone who never chose, as before: no note at all
    }
  });
  it('nothing read (no settings yet, or a read that failed): nothing changes', () => {
    for (const profile of [null, undefined, 'full', 1]) {
      const st = counting({ [VIEW_KEY]: 'full' });
      followViewChoice(profile, st);
      expect(st.writes, String(profile)).toEqual([]);
    }
  });
  it('a storage that refuses, or none: nothing breaks', () => {
    const refusing = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); }, removeItem: () => { throw new Error('blocked'); } };
    expect(() => followViewChoice({ view: 'full' }, refusing)).not.toThrow();
    expect(() => followViewChoice({ view: 'simple' }, refusing)).not.toThrow();
    expect(() => followViewChoice({ view: 'full' }, null)).not.toThrow();
  });
});

describe('the full view\'s sign-in (AuthService.viewNotesAtSignIn, at index.html\'s one settings read per sign-in)', () => {
  const ALEX = { uid: 'alex-uid', email: 'alex@example.test', emailVerified: true };
  const SAM = { uid: 'sam-uid', email: 'sam@example.test', emailVerified: true };
  initAuthStateListener();
  const signIn = (user) => firebase.listener(user);
  beforeEach(() => { localStorage.clear(); for (const [k, v] of Object.entries(OTHERS)) localStorage.setItem(k, v); leaveGuestMode(); signIn(null); });

  it('signed in, the account saying the full view: the notes come back, so the site\'s address opens the full view again', () => {
    signIn(ALEX);
    viewNotesAtSignIn({ view: 'full' }, ALEX);
    expect(kept()).toEqual({ ...OTHERS, [SIGNED_IN_KEY]: '1', [VIEW_KEY]: 'full' });
  });
  it('signed in, the account saying the simple view or nothing: no note is set', () => {
    signIn(ALEX);
    viewNotesAtSignIn({ view: 'simple' }, ALEX);
    viewNotesAtSignIn({ lastSeenVersion: '7.10.0' }, ALEX);
    viewNotesAtSignIn(null, ALEX);
    expect(kept()).toEqual(OTHERS);
  });
  it('a read that lands after a sign-out, or after someone else signed in, or for a guest, changes nothing', () => {
    signIn(null);
    viewNotesAtSignIn({ view: 'full' }, ALEX);
    expect(kept()).toEqual(OTHERS);
    signIn(SAM);
    viewNotesAtSignIn({ view: 'full' }, ALEX);
    expect(kept()).toEqual(OTHERS);
    viewNotesAtSignIn({ view: 'full' }, null);
    expect(kept()).toEqual(OTHERS);
    signIn(null);
    const guest = enterGuestMode();
    viewNotesAtSignIn({ view: 'full' }, guest);
    expect(kept()).toEqual(OTHERS);
    leaveGuestMode();
  });
  it('the page reads the settings once per sign-in and hands them over with the user it read them for', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    expect((html.match(/loadUserProfile\(\)/g) || []).length).toBe(1);
    expect(html).toContain('const who = getCurrentUser(), prof = await loadUserProfile(); viewNotesAtSignIn(prof, who);');
    expect(html).toMatch(/import \{[^}]*\bviewNotesAtSignIn\b[^}]*\} from '\.\/src\/firebase\/index\.js';/);
  });
});
