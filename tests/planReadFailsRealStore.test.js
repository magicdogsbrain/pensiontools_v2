/**
 * A plan read the STORE refuses (the check of step LEFT, round 2): the real FirestoreService over a Firestore whose reads
 * reject. tests/planReadFails.test.js mocks the store itself; this one keeps the real store, so a fault the store swallows
 * (an answer of "no plans" in place of "could not read") fails here (lead4.md R2, D1):
 *   - loadAllScenarios rejects: a refused read is never answered as an account with no plans;
 *   - readActiveScenarioAsync throws a PlanReadError, and the settings reader says the fault (never the factory settings);
 *   - hasCloudData rejects (the page cannot tell, so it never offers the first-plan wizard on that answer);
 *   - nothing is written on the strength of a refused read: choosing a plan and deleting everything both stop.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const fs = { failReads: false, docs: [], batches: 0 };
vi.mock('firebase/firestore', async (orig) => {
  const m = await orig();
  const refused = () => { const e = new Error('Missing or insufficient permissions.'); e.code = 'permission-denied'; return e; };
  return {
    ...m,
    collection: () => ({}),
    doc: () => ({}),
    getDocs: async () => {
      if (fs.failReads) throw refused();
      return { forEach: (fn) => fs.docs.forEach((d) => fn({ id: d.id, data: () => JSON.parse(JSON.stringify(d)) })) };
    },
    getDoc: async () => { if (fs.failReads) throw refused(); return { exists: () => false, data: () => null }; },
    writeBatch: () => { fs.batches++; return { update() {}, delete() {}, set() {}, commit: async () => {} }; },
    setDoc: async () => {},
    updateDoc: async () => {}
  };
});
vi.mock('../src/firebase/config.js', () => ({ db: {}, isFirebaseConfigured: () => true, auth: {} }));
vi.mock('../src/firebase/AuthService.js', () => ({ getCurrentUser: () => ({ uid: 'u1' }), isGuest: () => false, isLoggedIn: () => true, onAuthChange: () => () => {} }));
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => true, isLoggedIn: () => true, isGuest: () => false, getCurrentUser: () => ({ uid: 'u1' }) }));

const { loadAllScenarios, hasCloudData, setActiveScenarioDoc, wipeAllUserData } = await import('../src/firebase/FirestoreService.js');
const { readActiveScenarioAsync, invalidateScenarioCache } = await import('../src/storage/ScenarioRepository.js');
const { loadStressDBAsync, invalidateStressCache } = await import('../src/storage/StressRepository.js');
const { isPlanReadError } = await import('../src/reading/readFault.js');

beforeEach(() => {
  fs.failReads = false; fs.docs = []; fs.batches = 0;
  invalidateScenarioCache(); invalidateStressCache();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('a plan read the store refuses', () => {
  it('loadAllScenarios rejects: never [] (an account with no plans) in its place', async () => {
    fs.failReads = true;
    await expect(loadAllScenarios()).rejects.toThrow();
  });
  it('readActiveScenarioAsync throws a PlanReadError through the real store', async () => {
    fs.failReads = true;
    let err = null, plan; try { plan = await readActiveScenarioAsync(); } catch (e) { err = e; }
    expect(plan).toBeUndefined();
    expect(isPlanReadError(err)).toBe(true);
  });
  it('the settings reader says the fault: never the factory settings', async () => {
    fs.failReads = true;
    let err = null, db = null; try { db = await loadStressDBAsync(); } catch (e) { err = e; }
    expect(db).toBeNull();
    expect(isPlanReadError(err)).toBe(true);
  });
  it('hasCloudData rejects: "could not read" is not "no plans yet"', async () => {
    fs.failReads = true;
    await expect(hasCloudData()).rejects.toThrow();
  });
  it('choosing a plan and deleting everything stop on a refused read (nothing written)', async () => {
    fs.failReads = true;
    await expect(setActiveScenarioDoc('kim')).rejects.toThrow();
    await expect(wipeAllUserData()).rejects.toThrow();
    expect(fs.batches).toBe(0);
  });
  it('an account with no plans still reads as none; an account with a plan reads it', async () => {
    expect(await loadAllScenarios()).toEqual([]);
    expect(await hasCloudData()).toBe(false);
    expect(await readActiveScenarioAsync()).toBeNull();
    invalidateScenarioCache();
    fs.docs = [{ id: 'kim', isActive: true, planDetails: { name: 'Kim' } }];
    expect((await readActiveScenarioAsync()).id).toBe('kim');
    expect(await hasCloudData()).toBe(true);
  });
});
