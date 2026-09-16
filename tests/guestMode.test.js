import { describe, it, expect } from 'vitest';
import { enterGuestMode, isGuest, isLoggedIn, leaveGuestMode } from '../src/firebase/AuthService.js';
import { createScenario, loadAllScenarios, saveScenario, deleteScenarioDoc, setActiveScenarioDoc, hasCloudData, clearGuestData } from '../src/firebase/FirestoreService.js';
import { createNewScenario, listScenariosAsync, getActiveScenarioAsync, invalidateScenarioCache } from '../src/storage/ScenarioRepository.js';
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
    expect(s.stressTool.settings).toEqual({ baseSalary: 2, equityMin: 7 });
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
