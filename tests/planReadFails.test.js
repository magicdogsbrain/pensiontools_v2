/**
 * When the store cannot hand the plans back (a failed read, not a settings recipe that throws), the full view must know
 * (lead4.md R2, D1; the check of step LEFT, problem 3):
 *   - readActiveScenarioAsync THROWS a PlanReadError on a failed read: "no plan" (an account with none) and "could not read"
 *     are not the same answer. getActiveScenarioAsync keeps its "a plan or null" answer for the callers that only need that;
 *   - the settings reader (loadStressDBAsync) says the fault, never the factory settings in the plan's place;
 *   - the budget reader (getBudgetAsync) says the fault, never the starter budget;
 *   - an account with no plans at all still reads as "no plan" (null), not as a fault.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const store = { fail: false, list: [] };
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => true, isLoggedIn: () => true, isGuest: () => false }));
vi.mock('../src/firebase/FirestoreService.js', () => ({
  loadAllScenarios: async () => { if (store.fail) throw new Error('unavailable'); return store.list.map((s) => JSON.parse(JSON.stringify(s))); },
  loadScenario: async () => null,
  saveScenario: vi.fn(async () => {}),
  createScenario: vi.fn(async () => 'x'),
  deleteScenarioDoc: vi.fn(async () => {}),
  setActiveScenarioDoc: vi.fn(async () => {}),
  isScenarioNewerThanApp: () => false,
  loadUserProfile: async () => null,
  saveUserProfile: async () => {}
}));

const { readActiveScenarioAsync, getActiveScenarioAsync, invalidateScenarioCache } = await import('../src/storage/ScenarioRepository.js');
const { loadStressDBAsync, invalidateStressCache } = await import('../src/storage/StressRepository.js');
const { getBudgetAsync } = await import('../src/storage/BudgetRepository.js');
const { isPlanReadError } = await import('../src/reading/readFault.js');

const quiet = () => vi.spyOn(console, 'error').mockImplementation(() => {});

beforeEach(() => { store.fail = false; store.list = []; invalidateScenarioCache(); invalidateStressCache(); });

describe('a plan the store cannot hand back', () => {
  it('readActiveScenarioAsync throws a PlanReadError; getActiveScenarioAsync still answers null', async () => {
    const q = quiet();
    store.fail = true;
    let err = null; try { await readActiveScenarioAsync(); } catch (e) { err = e; }
    expect(isPlanReadError(err)).toBe(true);
    expect(await getActiveScenarioAsync()).toBeNull();
    q.mockRestore();
  });
  it('the settings reader says the fault: never the factory settings in the plan\'s place', async () => {
    const q = quiet();
    store.fail = true;
    let err = null, db = null; try { db = await loadStressDBAsync(); } catch (e) { err = e; }
    expect(db).toBeNull();
    expect(isPlanReadError(err)).toBe(true);
    q.mockRestore();
  });
  it('the budget reader says the fault: never the starter budget', async () => {
    const q = quiet();
    store.fail = true;
    await expect(getBudgetAsync()).rejects.toThrow();
    q.mockRestore();
  });
  it('the read is tried again next time (a fault is not kept as the answer)', async () => {
    const q = quiet();
    store.fail = true;
    await expect(readActiveScenarioAsync()).rejects.toThrow();
    store.fail = false; store.list = [{ id: 'kim', isActive: true, planDetails: { name: 'Kim' } }];
    expect((await readActiveScenarioAsync()).id).toBe('kim');
    q.mockRestore();
  });
  it('an account with no plans at all reads as no plan, not as a fault', async () => {
    expect(await readActiveScenarioAsync()).toBeNull();
  });
});
