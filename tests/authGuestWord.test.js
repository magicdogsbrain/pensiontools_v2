/**
 * The planner's auth service and guest mode (src/firebase/AuthService.js): Firebase's "nobody" while guest mode is on says
 * nothing new and is ignored. Guest mode is the planner's own nobody-signed-in, kept in this window, and Firebase holds no
 * user for it. Entered before Firebase's first word — the ?demo= link, or the preview's hand-over of a plan kept in this
 * window after its 6 s wait (src/ui/components/OpenPlace.js straightIn) — that word used to end it: currentUser null, and
 * every listener told "signed out", index.html's putting the sign-in screen up with "You've been signed out" over the plan
 * the visitor was promised. A sign-in from guest mode still arrives, and a signed-in user becoming nobody is still a
 * sign-out; with nobody in guest mode the first "nobody" is heard as it always was.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

const firebase = vi.hoisted(() => ({ cb: null }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (auth, fn) => { firebase.cb = fn; return () => {}; },
  GoogleAuthProvider: class {},
  createUserWithEmailAndPassword: vi.fn(), signInWithEmailAndPassword: vi.fn(), signInWithPopup: vi.fn(), signOut: vi.fn(),
  sendPasswordResetEmail: vi.fn(), sendEmailVerification: vi.fn(), updateProfile: vi.fn(), deleteUser: vi.fn()
}));
vi.mock('../src/firebase/config.js', () => ({ auth: {}, db: {}, app: null, default: {}, isFirebaseConfigured: () => true }));

import { onAuthStateChange, enterGuestMode, leaveGuestMode, isGuest, isLoggedIn, getCurrentUser } from '../src/firebase/AuthService.js';

describe('guest mode and Firebase\'s word (2 Nov 2026)', () => {
  const heard = [];
  beforeAll(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    expect(typeof firebase.cb, 'the service subscribes to Firebase as it loads').toBe('function');
    onAuthStateChange((u) => heard.push(u));
  });

  it('guest mode entered before the first word survives "nobody": nobody is told "signed out"', () => {
    enterGuestMode();
    firebase.cb(null);
    expect(isGuest()).toBe(true);
    expect(isLoggedIn()).toBe(true);
    expect(heard).toEqual([]);
  });

  it('a sign-in from guest mode arrives; the signed-in user becoming nobody is a sign-out, heard', () => {
    const user = { uid: 'u1', email: 'alex@example.com', emailVerified: true };
    firebase.cb(user);
    expect(isGuest()).toBe(false);
    expect(getCurrentUser()).toBe(user);
    expect(heard).toEqual([user]);
    firebase.cb(null);
    expect(isLoggedIn()).toBe(false);
    expect(heard).toEqual([user, null]);
  });

  it('with nobody in guest mode, "nobody" is heard as it always was', () => {
    leaveGuestMode();
    firebase.cb(null);
    expect(heard.length).toBe(3);
    expect(heard[2]).toBe(null);
    expect(isLoggedIn()).toBe(false);
  });
});
