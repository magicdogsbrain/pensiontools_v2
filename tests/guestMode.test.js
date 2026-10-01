import { describe, it, expect } from 'vitest';
import { enterGuestMode, isGuest, isLoggedIn, leaveGuestMode } from '../src/firebase/AuthService.js';
import { createScenario, loadAllScenarios, loadScenario, saveScenario, deleteScenarioDoc, setActiveScenarioDoc, hasCloudData, clearGuestData, guestSnapshot, isScenarioNewerThanApp } from '../src/firebase/FirestoreService.js';
import { createNewScenario, duplicateScenario, listScenariosAsync, getActiveScenarioAsync, invalidateScenarioCache, isPlanNewerThanApp, saveActiveHoldings, saveActivePlanDocument } from '../src/storage/ScenarioRepository.js';
import { SCHEMA_VERSION, PLAN_NEWER_MESSAGE, PLAN_NEWER_CODE } from '../src/storage/schema.js';
import { handoffPayload } from '../src/services/GuestMeter.js';

const GUEST_KEY = 'pt_guest_scenarios';   // FirestoreService's guest store (not exported there)
const seedGuest = (list) => { clearGuestData(); sessionStorage.setItem(GUEST_KEY, JSON.stringify(list)); invalidateScenarioCache(); invalidateStressCache(); };
const guestStored = () => JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]');
import { getStressSettingsAsync, saveStressSettings, invalidateStressCache } from '../src/storage/StressRepository.js';

describe('guest mode — everything works, nothing leaves the tab', () => {
  it('a guest counts as logged in for the tools, and the store is local', async () => {
    enterGuestMode();
    expect(isGuest()).toBe(true);
    expect(isLoggedIn()).toBe(true);
    clearGuestData();
    expect(await hasCloudData()).toBe(false);
    const id = await createScenario({ planDetails: { name: 'Try-it plan' }, isActive: true, stressTool: { settings: { baseSalary: 1 } } });
    expect(id.startsWith('guest-')).toBe(true);
    let all = await loadAllScenarios();
    expect(all.length).toBe(1);
    await saveScenario(id, { planDetails: { name: 'Renamed' } });
    all = await loadAllScenarios();
    expect(all[0].planDetails.name).toBe('Renamed');
    expect(await hasCloudData()).toBe(true);
    await setActiveScenarioDoc(id);
    expect((await loadAllScenarios())[0].isActive).toBe(true);
    await deleteScenarioDoc(id);
    expect((await loadAllScenarios()).length).toBe(0);
  });
  it('the repositories work end to end for a guest (create plan, save stress settings, read them back)', async () => {
    enterGuestMode(); clearGuestData(); invalidateScenarioCache(); invalidateStressCache();
    const id = await createNewScenario('Try-it plan', 'guest', ['stress', 'decision'], { stressSettings: { configured: true, equityMin: 250000 } }, true);
    invalidateScenarioCache(); invalidateStressCache();
    const list = await listScenariosAsync();
    expect(list.some((s) => s.id === id)).toBe(true);
    const active = await getActiveScenarioAsync();
    expect(active && active.id).toBe(id);
    await saveStressSettings({ baseSalary: 31000 });
    invalidateStressCache();
    const s = await getStressSettingsAsync();
    expect(s.baseSalary).toBe(31000);
    expect(s.equityMin).toBe(250000);
    leaveGuestMode(); clearGuestData();
    expect(isLoggedIn()).toBe(false);
  });
  it('a guest save with dot-notation keys is folded onto its path, as updateDoc would read it (6.13.0)', async () => {
    enterGuestMode(); clearGuestData();
    const id = await createScenario({ planDetails: { name: 'P' }, isActive: true, stressTool: { settings: { baseSalary: 1, equityMin: 7 } }, decisionTool: { settings: { locked: false }, history: [{ m: 1 }], taxYears: {} } });
    await saveScenario(id, { 'decisionTool.settings': { locked: true, lockedAt: 't' }, 'stressTool.settings.baseSalary': 2, holdings: { lines: [] } });
    const [s] = await loadAllScenarios();
    expect(Object.keys(s).some((k) => k.includes('.'))).toBe(false);
    expect(s.decisionTool.settings).toEqual({ locked: true, lockedAt: 't' });
    expect(s.decisionTool.history).toEqual([{ m: 1 }]);
    expect(s.stressTool.settings).toEqual({ baseSalary: 2, equityMin: 7, chargesPct: 0.5 });   // created unlocked: the 6.19.0 default charge
    expect(s.holdings).toEqual({ lines: [] });
    expect(s.planDetails.name).toBe('P');
    expect(s.id).toBe(id);
    expect(typeof s.lastModified).toBe('string');
    // a plain (undotted) save still merges at the root and is left as it is
    await saveScenario(id, { planDetails: { name: 'Q' } });
    expect((await loadAllScenarios())[0].planDetails.name).toBe('Q');
    leaveGuestMode(); clearGuestData();
  });
});

describe('guest plans carry the schema version and go through the same upgrade (6.15.0)', () => {
  it('a plan a guest creates is born current, the version at its root and in neither settings map', async () => {
    enterGuestMode(); clearGuestData(); invalidateScenarioCache(); invalidateStressCache();
    const id = await createNewScenario('Guest plan', '', ['stress', 'decision'], {}, true);
    const s = await loadScenario(id);
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect('schemaVersion' in s.stressTool.settings).toBe(false);
    expect('schemaVersion' in s.decisionTool.settings).toBe(false);
    // …and so is a copy of it, and what the hand-off would carry into an account
    invalidateScenarioCache();
    const copyId = await duplicateScenario(id, 'Copy');
    expect((await loadScenario(copyId)).schemaVersion).toBe(SCHEMA_VERSION);
    const payload = handoffPayload(guestSnapshot(), 't');
    expect(payload.scenarios.length).toBe(2);
    for (const p of payload.scenarios) expect(p.schemaVersion).toBe(SCHEMA_VERSION);
    leaveGuestMode(); clearGuestData();
  });

  it('a guest READ now normalises and upgrades an old plan, and writes it back to the tab\'s store with nothing dropped', async () => {
    enterGuestMode();
    const old = {
      id: 'guest-old', isActive: true, createdAt: '2026-05-01T00:00:00.000Z', lastModified: '2026-05-02T00:00:00.000Z', enabledTools: ['stress'],
      planDetails: { name: 'Old guest plan', description: '' },
      decisionTool: { settings: { equityMin: 1 }, history: [], taxYears: {} },
      stressTool: { settings: { baseSalary: 1, strategyId: 'gilt-rotation', strategyParams: { rotateCutAge: 75, floorToAge: 80 } } },
      budgetTool: { settings: { version: 1 } }, journey: [{ stage: 'saving', at: 't' }], somethingFromTheFuture: { keep: 1 },
      'stressTool.settings.baseSalary': 31000                     // a phantom field an older guest save left behind
    };
    seedGuest([old]);
    const [s] = await loadAllScenarios();
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(Object.keys(s).some((k) => k.includes('.'))).toBe(false);
    expect(s.stressTool.settings.baseSalary).toBe(31000);
    expect(s.strategy).toEqual({ id: 'pots-and-valves', params: {}, lockedAt: '2026-05-01T00:00:00.000Z', engineVersion: s.strategy.engineVersion });
    expect(Object.keys(s.stressTool.settings.strategyState)).toEqual(['floor-to-age']);   // the flat bag sorted, once
    expect(s.stressTool.settings.strategyParams).toEqual({ rotateCutAge: 75, floorToAge: 80 });
    expect(s.decisionTool).toEqual(old.decisionTool);
    for (const k of ['budgetTool', 'journey', 'somethingFromTheFuture', 'planDetails', 'createdAt', 'lastModified', 'enabledTools', 'id', 'isActive']) expect(s[k], k).toEqual(old[k]);
    expect(guestStored()).toEqual([s]);                           // written back
    const stamp = sessionStorage.getItem(GUEST_KEY);
    expect(await loadScenario('guest-old')).toEqual(s);
    expect(sessionStorage.getItem(GUEST_KEY)).toBe(stamp);        // and only once
    leaveGuestMode(); clearGuestData();
  });

  it('an old hand-off item handed to createScenario is stored upgraded', async () => {
    enterGuestMode(); clearGuestData();
    const id = await createScenario({ planDetails: { name: 'Stashed long ago (from guest)' }, isActive: true, decisionTool: { settings: {}, history: [], taxYears: {} }, stressTool: { settings: { pacwMin: 5 } } });
    const s = guestStored().find((x) => x.id === id);
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(s.stressTool.settings).toEqual({ pacwMin: 5, equityMin: 5, chargesPct: 0.5 });   // + 6.19.0: an unlocked plan gets the default charge
    expect(s.strategy.id).toBe('pots-and-valves');
    leaveGuestMode(); clearGuestData();
  });

  it('a plan newer than this code: flagged for the shell, every save refused, nothing written', async () => {
    enterGuestMode();
    const newer = { id: 'guest-new', isActive: true, schemaVersion: SCHEMA_VERSION + 1, planDetails: { name: 'From the future', description: '' }, decisionTool: { settings: { movedKey: 1 }, history: [], taxYears: {} }, stressTool: { settings: { baseSalary: 9 } } };
    const other = { id: 'guest-cur', isActive: false, schemaVersion: SCHEMA_VERSION, planDetails: { name: 'Current', description: '' }, strategy: { id: 'pots-and-valves', params: {}, lockedAt: 't', engineVersion: 'x' }, decisionTool: { settings: {}, history: [], taxYears: {} }, stressTool: { settings: {} } };
    seedGuest([newer, other]);
    const before = sessionStorage.getItem(GUEST_KEY);
    expect(isPlanNewerThanApp()).toBe(false);                     // nothing loaded yet
    const active = await getActiveScenarioAsync();
    expect(active.id).toBe('guest-new');
    expect(isPlanNewerThanApp()).toBe(true);                      // the active plan
    expect(isPlanNewerThanApp(active)).toBe(true);
    expect(isPlanNewerThanApp(other)).toBe(false);
    expect(isScenarioNewerThanApp('guest-new')).toBe(true);
    expect(sessionStorage.getItem(GUEST_KEY)).toBe(before);       // the read wrote nothing
    for (const save of [
      () => saveStressSettings({ baseSalary: 31000 }),
      () => saveActiveHoldings({ lines: [{ ticker: 'X' }] }),
      () => saveActivePlanDocument({ version: 2 }),
      () => saveScenario('guest-new', { 'planDetails.name': 'Renamed' })
    ]) {
      let err = null;
      try { await save(); } catch (e) { err = e; }
      expect(err, String(save)).not.toBeNull();
      expect(sessionStorage.getItem(GUEST_KEY), String(save)).toBe(before);
    }
    await expect(saveScenario('guest-new', { holdings: { lines: [] } })).rejects.toMatchObject({ code: PLAN_NEWER_CODE, message: PLAN_NEWER_MESSAGE });
    // the current plan beside it saves as usual, and the person can switch to it
    await saveScenario('guest-cur', { 'planDetails.name': 'Current, renamed' });
    expect(guestStored().find((x) => x.id === 'guest-cur').planDetails.name).toBe('Current, renamed');
    await setActiveScenarioDoc('guest-cur');
    invalidateScenarioCache();
    expect((await getActiveScenarioAsync()).id).toBe('guest-cur');
    expect(isPlanNewerThanApp()).toBe(false);
    expect(guestStored().find((x) => x.id === 'guest-new').stressTool.settings).toEqual({ baseSalary: 9 });
    leaveGuestMode(); clearGuestData(); invalidateScenarioCache(); invalidateStressCache();
  });

  it('the refusal does not depend on the plan having been read first: the save checks the stored copy', async () => {
    enterGuestMode();
    seedGuest([{ id: 'guest-unread', isActive: true, schemaVersion: SCHEMA_VERSION + 3, planDetails: { name: 'Never loaded here' }, stressTool: { settings: { baseSalary: 9 } } }]);
    const before = sessionStorage.getItem(GUEST_KEY);
    expect(isScenarioNewerThanApp('guest-unread')).toBe(false);
    await expect(saveScenario('guest-unread', { 'stressTool.settings': { baseSalary: 1 } })).rejects.toMatchObject({ code: PLAN_NEWER_CODE });
    expect(sessionStorage.getItem(GUEST_KEY)).toBe(before);
    expect(isScenarioNewerThanApp('guest-unread')).toBe(true);
    leaveGuestMode(); clearGuestData(); invalidateScenarioCache(); invalidateStressCache();
  });
});
