/**
 * Today's app's entry for a plan from a V7 answer (src/ui/components/NewPlanFromSeed.js), its steps with Firebase,
 * the repositories and the page stood in for — the review of 1 Oct 2026:
 *  - a browser that blocks site data: the entry hands back a do-nothing entry and the page goes on starting (it threw
 *    on a bare `localStorage` and left a blank page);
 *  - signing out by ANY route deletes a waiting seed (only the menu's Logout did; the idle timer and the verify-email
 *    screen's "Sign out" call logOut() alone) — and the first "nobody" of a signed-out visit does not;
 *  - the landing page's "Just try it" in a tab that holds plans carries on with them; only an empty tab gets the demo;
 *  - the Budget page's guide: only on a plan made from a V7 answer, with the plan's own target.
 * The browser walk is tests/integration/newPlanFromSeed.browser.mjs.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const auth = { listeners: [] };
const store = { has: false, active: null, stress: null };
vi.mock('../../src/firebase/index.js', () => ({
  isFirebaseConfigured: () => false, isLoggedIn: () => false,
  enterGuestMode: () => ({ uid: 'guest', isGuest: true }),
  onAuthStateChange: (fn) => { auth.listeners.push(fn); return () => {}; }
}));
vi.mock('../../src/firebase/FirestoreService.js', () => ({
  loadAllScenarios: async () => [], hasCloudData: async () => store.has,
  createScenario: async () => 'id', setActiveScenarioDoc: async () => {}, deleteScenarioDoc: async () => {}
}));
vi.mock('../../src/storage/ScenarioRepository.js', async (orig) => ({ ...(await orig()), invalidateScenarioCache: () => {}, getActiveScenarioAsync: async () => store.active }));
vi.mock('../../src/storage/StressRepository.js', async (orig) => ({ ...(await orig()), invalidateStressCache: () => {}, getStressSettingsAsync: async () => store.stress }));
vi.mock('../../src/storage/DecisionRepository.js', () => ({ invalidateCache: () => {} }));
vi.mock('../../src/ui/components/LandingPage.js', () => ({ hideLandingPage: vi.fn() }));
vi.mock('../../src/ui/components/AuthScreen.js', () => ({ showAuthScreenWithTab: vi.fn() }));

import { startSeedEntry, storageOf, planTargetGuide, planFromAnswer, NO_ENTRY } from '../../src/ui/components/NewPlanFromSeed.js';
import { SEED_KEY, RECEIPT_KEY, seedToScenario } from '../../src/services/PlanSeed.js';
import { grossUpAnnual } from '../../src/services/BudgetModel.js';
import { seedA, seedBCouple, memoryStorage } from './fixtures/planSeeds.js';

const fresh = (seed) => ({ ...seed, createdAt: new Date(Date.now() - 60000).toISOString() });
function fakeWindow({ local = memoryStorage(), session = memoryStorage(), hash = '' } = {}) {
  return {
    localStorage: local, sessionStorage: session,
    location: { hash, pathname: '/', search: '' }, history: { replaceState: vi.fn() },
    showToast: vi.fn(), appPrompt: vi.fn(), appConfirm: vi.fn(async () => false), openToolSettingsTab: vi.fn(),
    document
  };
}
const shell = () => ({ showMainApp: vi.fn(async () => {}), maybeAnnounceRelease: vi.fn(), startGuestMeter: vi.fn(), startGuest: vi.fn(async () => {}) });

beforeEach(() => { auth.listeners = []; store.has = false; store.active = null; store.stress = null; document.body.innerHTML = '<div id="guestBanner" style="display:none"></div>'; });

describe('a browser that blocks site data (found 1 Oct 2026: a blank page)', () => {
  const blocked = {
    get localStorage() { throw new DOMException('Access is denied for this document.', 'SecurityError'); },
    get sessionStorage() { throw new DOMException('Access is denied for this document.', 'SecurityError'); },
    location: { hash: '#new-plan', pathname: '/', search: '' }, history: { replaceState: vi.fn() }, document
  };
  it('storageOf never throws', () => {
    expect(storageOf(blocked, 'localStorage')).toBe(null);
    expect(storageOf({}, 'localStorage')).toBe(null);
    const m = memoryStorage();
    expect(storageOf({ localStorage: m }, 'localStorage')).toBe(m);
  });
  it('the entry starts, does nothing, and never throws: nothing waiting, nothing to clear, "Just try it" still works', async () => {
    let entry;
    expect(() => { entry = startSeedEntry(shell(), blocked); }).not.toThrow();
    expect(await entry.keepIfWaiting({ uid: 'u' })).toBe(false);
    expect(() => entry.clear()).not.toThrow();
    expect(typeof entry.tryWithoutAccount).toBe('function');
    expect(auth.listeners.length).toBe(0);
    expect(NO_ENTRY.tryWithoutAccount).toBe(null);
  });
});

describe('signing out, by any route, deletes a waiting seed', () => {
  it('a signed-in user becoming nobody (the menu, the idle timer, the verify-email screen): the seed goes, with a "cleared" receipt', () => {
    const w = fakeWindow({ local: memoryStorage({ [SEED_KEY]: JSON.stringify(fresh(seedA())) }) });
    startSeedEntry(shell(), w);
    const signOutWatch = auth.listeners[auth.listeners.length - 1];
    signOutWatch({ uid: 'u1' });
    expect(w.localStorage.has(SEED_KEY)).toBe(true);
    signOutWatch(null);
    expect(w.localStorage.has(SEED_KEY)).toBe(false);
    expect(Object.values(JSON.parse(w.sessionStorage.getItem(RECEIPT_KEY)))).toEqual([{ outcome: 'cleared' }]);
  });
  it('the first "nobody" of a signed-out visit is not a sign-out: the seed waits for the sign-in it was kept for', () => {
    const w = fakeWindow({ local: memoryStorage({ [SEED_KEY]: JSON.stringify(fresh(seedA())) }) });
    startSeedEntry(shell(), w);
    expect(auth.listeners.length).toBe(1);               // not on #new-plan: no offer, only the sign-out watch
    auth.listeners[0](null);
    auth.listeners[0](null);
    expect(w.localStorage.has(SEED_KEY)).toBe(true);
  });
  it('the menu\'s Logout calls clear() itself: the same', () => {
    const w = fakeWindow({ local: memoryStorage({ [SEED_KEY]: JSON.stringify(fresh(seedA())) }) });
    startSeedEntry(shell(), w).clear();
    expect(w.localStorage.has(SEED_KEY)).toBe(false);
  });
});

describe('"Just try it" on the landing page (found 1 Oct 2026: it deleted the tab\'s plans made from V7 answers)', () => {
  it('a tab that holds plans: carry on with them — the planner on them, the meter and the banner — never startGuest', async () => {
    store.has = true;
    const s = shell();
    await startSeedEntry(s, fakeWindow()).tryWithoutAccount();
    expect(s.startGuest).not.toHaveBeenCalled();
    expect(s.showMainApp).toHaveBeenCalledWith({ uid: 'guest', isGuest: true });
    expect(s.startGuestMeter).toHaveBeenCalled();
    expect(document.getElementById('guestBanner').style.display).toBe('flex');
  });
  it('an empty tab: the demo plan, as before', async () => {
    const s = shell();
    await startSeedEntry(s, fakeWindow()).tryWithoutAccount();
    expect(s.startGuest).toHaveBeenCalledWith(null);
    expect(s.showMainApp).not.toHaveBeenCalled();
  });
});

describe('the Budget page\'s guide: the plan\'s own target, only on a plan made from a V7 answer', () => {
  it('a plan made in the planner: none', async () => {
    store.active = { id: 'x', planDetails: { name: 'Mine' } };
    expect(await planFromAnswer()).toBe(null);
    expect(await planTargetGuide()).toBe(null);
  });
  it('one person: the chosen £1,800 a month (and its yearly figure before tax)', async () => {
    const { yours } = seedToScenario(seedA(), new Date(2026, 9, 1, 15));
    store.active = yours; store.stress = yours.stressTool.settings;
    const g = await planTargetGuide();
    expect(Math.abs(g.monthly - 1800)).toBeLessThanOrEqual(0.5);
    expect(g.grossAnnual).toBe(Math.round(grossUpAnnual(1800 * 12)));
    expect(g.steps).toBe(false);
  });
  it('a couple: your part to start with, and it says the shape has steps', async () => {
    const { yours } = seedToScenario(seedBCouple(), new Date(2026, 9, 1, 15));
    store.active = yours; store.stress = yours.stressTool.settings;
    const g = await planTargetGuide();
    expect(Math.abs(g.monthly - 2000)).toBeLessThanOrEqual(0.5);
    expect(g.steps).toBe(true);
  });
});
