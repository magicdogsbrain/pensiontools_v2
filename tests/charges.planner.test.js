/**
 * Fund and platform charges in today's planner — where the setting lives, who gets the default, and how a locked plan
 * is kept at 0% (research/charges-setting.md §3, T7; rules 1 and 3).
 *
 *  - ONE stored place: stressTool.settings.chargesPct (percent a year). Never in the Decision settings, so it can never
 *    move decisionSettingsChecksum.
 *  - The 0.5 default is WRITTEN: by the new-plan template (getDefaultScenario), the schema-2 migration (unlocked plans),
 *    the reader of an unlocked plan that has no Stress settings at all, "Reset to defaults" and unlock (D2). It is never
 *    in a default that is merged UNDER a stored plan (getDefaultStressSettings, getDefaultStressDB), or every locked plan
 *    would quietly read 0.5 (R1).
 *  - An unlocked COPY of a plan with no setting gets its effective value written, 0 (D7): the copy reproduces the
 *    original's figures and the 0 is visible and changeable.
 *  - The engine config carries the charge only when there is one: absent or 0 leaves the config exactly as it was.
 *
 * Guest mode drives the real repositories (FirestoreService keeps a guest's plans in sessionStorage).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData, loadScenario } from '../src/firebase/FirestoreService.js';
import {
  getDefaultScenario, getDefaultStressSettings, getDefaultDecisionSettings, seedDecisionFromStress, seedStressFromDecision,
  createNewScenario, duplicateScenario, getActiveStressSettings, invalidateScenarioCache, chargesPatchOnUnlock, chargesForCopy
} from '../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, loadStressDB, invalidateStressCache, createSimulationConfigFromSettings, saveStressSettings, resetStressSettings } from '../src/storage/StressRepository.js';
import { invalidateCache as invalidateDecisionCache, decisionSettingsChecksum } from '../src/storage/DecisionRepository.js';
import { SCHEMA_VERSION } from '../src/storage/schema.js';
import { DEFAULT_CHARGES_PCT } from '../src/services/Charges.js';

const GUEST_KEY = 'pt_guest_scenarios';
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
const seedGuest = (list) => { enterGuestMode(); clearGuestData(); sessionStorage.setItem(GUEST_KEY, JSON.stringify(list)); fresh(); };
const stored = () => JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]');
afterEach(() => { leaveGuestMode(); clearGuestData(); fresh(); });

/** A plan as a 6.15–6.18 app stored it (version 1, no charge), locked or not. */
const v1Plan = ({ id = 'guest-p', locked = false, history = [], stress = { equityMin: 300000, bondMin: 150000, cashTarget: 50000, duration: 30, baseSalary: 30000, pa: 12570, brl: 50270, hrl: 125140 } } = {}) => ({
  id, isActive: true, schemaVersion: 1, planDetails: { name: 'P', description: '' }, enabledTools: ['stress', 'decision'],
  strategy: { id: 'pots-and-valves', params: {}, lockedAt: '2026-01-01T00:00:00.000Z', engineVersion: '6.18.0' },
  decisionTool: { settings: { equityMin: 300000, baseSalary: 30000, ...(locked ? { locked: true, lockedAt: '2026-05-01T00:00:00.000Z', lockedBy: 'first record' } : {}) }, history, taxYears: {} },
  ...(stress ? { stressTool: { settings: stress } } : {})
});

describe('the defaults', () => {
  it('a new plan is born with 0.5% a year in its Stress settings, and none in its Decision settings', () => {
    const s = getDefaultScenario('New');
    expect(s.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect(DEFAULT_CHARGES_PCT).toBe(0.5);
    expect('chargesPct' in s.decisionTool.settings).toBe(false);
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
  });
  it('the defaults merged UNDER a stored plan never carry it (or a locked plan would read 0.5)', () => {
    expect('chargesPct' in getDefaultStressSettings()).toBe(false);
    expect('chargesPct' in getDefaultDecisionSettings()).toBe(false);
    expect('chargesPct' in loadStressDB().settings).toBe(false);   // getDefaultStressDB, when nothing is loaded
  });
  it('a new plan through the repositories (a guest\'s "+ New plan", the setup wizard, the partner plan, a demo) gets 0.5', async () => {
    enterGuestMode(); clearGuestData(); fresh();
    const id = await createNewScenario('Mine', '', ['stress', 'decision'], { stressSettings: { configured: true, equityMin: 250000 } }, true);
    expect((await loadScenario(id)).stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    const demo = await createNewScenario('Demo', '', ['stress'], { stressSettings: { baseSalary: 1, chargesPct: 1.1 } }, false);
    expect((await loadScenario(demo)).stressTool.settings.chargesPct).toBe(1.1);   // a demo that says otherwise keeps its own
    fresh();
    expect((await getStressSettingsAsync()).chargesPct).toBe(DEFAULT_CHARGES_PCT);
  });
});

describe('the copies between the two tools', () => {
  it('Stress → Decision never carries it (the Decision settings are checksummed)', () => {
    const d = seedDecisionFromStress({ equityMin: 1, chargesPct: 1.25 }, {});
    expect('chargesPct' in d).toBe(false);
    const base = { equityMin: 1, baseSalary: 2 };
    expect(decisionSettingsChecksum(seedDecisionFromStress({ ...base, chargesPct: 1.25 }, {}))).toBe(decisionSettingsChecksum(seedDecisionFromStress(base, {})));
  });
  it('Decision → Stress keeps the plan\'s own charge, and gives none to a plan that had none', () => {
    expect(seedStressFromDecision({ equityMin: 1 }, { chargesPct: 1.25 }, 't').chargesPct).toBe(1.25);
    expect(seedStressFromDecision({ equityMin: 1 }, { chargesPct: 0 }, 't').chargesPct).toBe(0);
    expect('chargesPct' in seedStressFromDecision({ equityMin: 1, chargesPct: 2 }, {}, 't')).toBe(false);
  });
});

describe('the engine config carries the charge only when there is one', () => {
  const S = { equityMin: 300000, bondMin: 150000, cashTarget: 50000, duration: 30, baseSalary: 30000, pa: 12570, brl: 50270, hrl: 125140 };
  it('a valid charge above 0 goes in as it is', () => {
    for (const v of [0.05, 0.5, 1.25, 3]) expect(createSimulationConfigFromSettings({}, { ...S, chargesPct: v }).chargesPct).toBe(v);
  });
  it('absent, 0 or invalid: no key at all — the config is exactly the one it always was', () => {
    const plain = createSimulationConfigFromSettings({}, S);
    expect('chargesPct' in plain).toBe(false);
    for (const v of [0, -1, 3.5, '0.5', null, NaN]) {
      const cfg = createSimulationConfigFromSettings({}, { ...S, chargesPct: v });
      expect('chargesPct' in cfg, String(v)).toBe(false);
      expect(JSON.stringify(cfg)).toBe(JSON.stringify(plain));
    }
  });
});

describe('loading a plan (guest store = the same code path as Firestore)', () => {
  it('an UNLOCKED version-1 plan is given 0.5 on its first load, written back once; its runs take it', async () => {
    seedGuest([v1Plan()]);
    const s = await getStressSettingsAsync();
    expect(s.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect(stored()[0].schemaVersion).toBe(SCHEMA_VERSION);
    expect(stored()[0].stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect(createSimulationConfigFromSettings({}, s).chargesPct).toBe(DEFAULT_CHARGES_PCT);
  });
  it('a LOCKED version-1 plan loads with no charge (0%): its Stress settings and Decision checksum are as they were', async () => {
    const plan = v1Plan({ locked: true, history: [{ date: '2026-06', settingsChecksum: 'c' }] });
    seedGuest([plan]);
    const s = await getStressSettingsAsync();
    expect('chargesPct' in s).toBe(false);
    expect('chargesPct' in createSimulationConfigFromSettings({}, s)).toBe(false);
    const after = stored()[0];
    expect(after.schemaVersion).toBe(SCHEMA_VERSION);
    // The only Stress key the load writes is the plan's start (the 6.13.5 timing pin, for locked plans too); no charge.
    const { legacyFirstTaxYear, ...rest } = after.stressTool.settings;
    expect(rest).toEqual(plan.stressTool.settings);
    expect('chargesPct' in after.stressTool.settings).toBe(false);
    expect(after.decisionTool).toEqual(plan.decisionTool);
    expect(decisionSettingsChecksum(after.decisionTool.settings)).toBe(decisionSettingsChecksum(plan.decisionTool.settings));
  });
  it('a plan with no Stress settings at all: an unlocked one reads the default, a locked one reads none', async () => {
    seedGuest([v1Plan({ stress: null })]);
    expect((await getActiveStressSettings()).chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect((await getStressSettingsAsync()).chargesPct).toBe(DEFAULT_CHARGES_PCT);
    seedGuest([v1Plan({ stress: null, locked: true })]);
    expect('chargesPct' in (await getActiveStressSettings())).toBe(false);
    expect('chargesPct' in (await getStressSettingsAsync())).toBe(false);
  });
});

describe('unlocking a plan locked before charges (D2): it gets the default from then on', () => {
  it('chargesPatchOnUnlock: the default when the plan has no valid charge, nothing when it has one', () => {
    expect(chargesPatchOnUnlock({})).toEqual({ chargesPct: DEFAULT_CHARGES_PCT });
    expect(chargesPatchOnUnlock(null)).toEqual({ chargesPct: DEFAULT_CHARGES_PCT });
    for (const v of [undefined, null, -1, 4, '1']) expect(chargesPatchOnUnlock({ chargesPct: v })).toEqual({ chargesPct: DEFAULT_CHARGES_PCT });
    for (const v of [0, 0.05, 1.25, 3]) expect(chargesPatchOnUnlock({ chargesPct: v })).toBeNull();
  });
});

describe('a copy (D7): it reproduces the original\'s figures, with the charge written down', () => {
  it('chargesForCopy: the effective value of the original, explicitly', () => {
    expect(chargesForCopy({})).toBe(0);
    expect(chargesForCopy({ chargesPct: 1.25 })).toBe(1.25);
    expect(chargesForCopy({ chargesPct: 9 })).toBe(0);
    expect(chargesForCopy(null)).toBe(0);
  });
  it('an unlocked copy of a plan locked before charges gets 0 written; a copy that carries records stays locked with no key', async () => {
    seedGuest([v1Plan({ id: 'guest-src', locked: true })]);
    await getStressSettingsAsync();
    fresh();
    const draftId = await duplicateScenario('guest-src', 'Draft copy', { carryHistory: false });
    const draft = await loadScenario(draftId);
    expect(draft.decisionTool.settings.locked).toBe(false);
    expect(draft.stressTool.settings.chargesPct).toBe(0);

    seedGuest([v1Plan({ id: 'guest-src2', locked: true, history: [{ date: '2026-06', settingsChecksum: 'c' }] })]);
    await getStressSettingsAsync();
    fresh();
    const lockedId = await duplicateScenario('guest-src2', 'Copy with records', { carryHistory: true });
    const lockedCopy = await loadScenario(lockedId);
    expect(lockedCopy.decisionTool.settings.locked).toBe(true);
    expect('chargesPct' in lockedCopy.stressTool.settings).toBe(false);
  });
  it('a copy of a plan that has a charge keeps it', async () => {
    seedGuest([{ ...v1Plan({ id: 'guest-src3' }), schemaVersion: 2, stressTool: { settings: { equityMin: 1, chargesPct: 1.25 } } }]);
    const id = await duplicateScenario('guest-src3', 'Copy');
    expect((await loadScenario(id)).stressTool.settings.chargesPct).toBe(1.25);
  });
});

describe('Reset to defaults gives an unlocked plan the default charge, not none', () => {
  it('the reset settings carry 0.5', async () => {
    enterGuestMode(); clearGuestData(); fresh();
    await createNewScenario('Mine', '', ['stress', 'decision'], {}, true);
    await saveStressSettings({ chargesPct: 1.5 });
    await resetStressSettings();
    fresh();
    expect((await getStressSettingsAsync()).chargesPct).toBe(DEFAULT_CHARGES_PCT);
  });
});
