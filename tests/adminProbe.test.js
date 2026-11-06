/**
 * The classic planner's gear (Administration) follows the account signed in NOW. The probe read of adminPrivate/access
 * used to run once per page load, so a second account signed in after the administrator in the same tab kept the
 * administrator's gear (found 6 Nov 2026; display only — the rules refused that account's reads). It now runs again
 * whenever the signed-in account changes. Firestore and the sign-in are faked here; the rules themselves are tested
 * against the emulator (e2e/signed-in/admins-rule.spec.js).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const state = vi.hoisted(() => ({ user: null, admins: new Set(), probes: [] }));

vi.mock('firebase/firestore', () => ({
  doc: (_db, ...path) => ({ path: path.join('/') }),
  getDoc: async (ref) => {
    if (ref.path === 'adminPrivate/access') {
      state.probes.push(state.user && state.user.uid);
      if (!state.user || !state.admins.has(state.user.uid)) throw new Error('permission-denied');
    }
    return { exists: () => false, data: () => ({}) };
  },
  setDoc: vi.fn(), deleteDoc: vi.fn(), addDoc: vi.fn(), collection: vi.fn(), getDocs: vi.fn(),
  serverTimestamp: vi.fn(), query: vi.fn(), orderBy: vi.fn(), limit: vi.fn()
}));
vi.mock('../src/firebase/config.js', () => ({ db: {}, isFirebaseConfigured: () => true }));
vi.mock('../src/firebase/AuthService.js', () => ({ getCurrentUser: () => state.user }));

describe('the admin probe follows the signed-in account', () => {
  beforeEach(() => { vi.resetModules(); state.user = null; state.admins = new Set(['uid-alex']); state.probes = []; });

  it('the administrator, then another account in the same tab: the gear goes; back again: it returns', async () => {
    const svc = await import('../src/firebase/AdminConfigService.js');
    state.user = { uid: 'uid-alex' };
    await svc.initAdminConfig();
    expect(svc.isAdminUser()).toBe(true);

    state.user = { uid: 'uid-sam' };          // signed out, then Sam signed in, no reload
    await svc.initAdminConfig();
    expect(svc.isAdminUser()).toBe(false);

    state.user = { uid: 'uid-alex' };
    await svc.initAdminConfig();
    expect(svc.isAdminUser()).toBe(true);
    expect(state.probes).toEqual(['uid-alex', 'uid-sam', 'uid-alex']);
  });

  it('the same account again asks once; nobody signed in is never an administrator', async () => {
    const svc = await import('../src/firebase/AdminConfigService.js');
    state.user = { uid: 'uid-sam' };
    await svc.initAdminConfig();
    await svc.initAdminConfig();
    expect(state.probes).toEqual(['uid-sam']);
    expect(svc.isAdminUser()).toBe(false);
    state.user = null;
    await svc.initAdminConfig();
    expect(svc.isAdminUser()).toBe(false);
  });
});
