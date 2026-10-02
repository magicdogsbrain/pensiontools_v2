/**
 * How the ISA and savings grow, in today's planner's saved plans (6.22.0; research/saver-lock-and-savings-growth.md §3.3,
 * §3.4, tests 9–11 and 13; the owner's decision (B) of 2 Oct 2026).
 *
 *  - ONE stored place: stressTool.settings.isaGrowth ('cash' | 'invested'). Never in the Decision settings, so it can
 *    never move decisionSettingsChecksum.
 *  - Schema version 3: every UNLOCKED plan is given "Mostly cash"; a LOCKED plan is not touched at all (no setting, which
 *    every engine reads as the fixed 3% a year it was locked with), and the runner refuses any step that tries.
 *  - The default is WRITTEN — the new-plan template, the reader of an unlocked plan with no Stress settings, "Reset to
 *    defaults", an unlocked copy (owner D3) and unlock (owner D4) — and never put in a default merged UNDER a stored plan
 *    (getDefaultStressSettings, getDefaultStressDB), or every locked plan would quietly read it (R1).
 *  - The engine config carries the choice only when the plan has one.
 *
 * The migration is run over the 12 corpus fixtures exactly as the read path runs it (normalizeScenario, then the chain),
 * from version 0 and from version 2 (the shape a 6.19.0–6.21.0 plan is stored in).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { SCHEMA_VERSION, isNewerSchema } from '../src/storage/schema.js';
import { MIGRATIONS, migrateScenario, deepCopy } from '../src/storage/migrations.js';
import { normalizeScenario, upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { decisionSettingsChecksum, invalidateCache as invalidateDecisionCache } from '../src/storage/DecisionRepository.js';
import { DEFAULT_ISA_GROWTH } from '../src/services/IsaGrowth.js';
import { DEFAULT_CHARGES_PCT } from '../src/services/Charges.js';
import { enterGuestMode, leaveGuestMode } from '../src/firebase/AuthService.js';
import { clearGuestData, loadScenario } from '../src/firebase/FirestoreService.js';
import {
  getDefaultScenario, getDefaultStressSettings, getDefaultDecisionSettings, seedDecisionFromStress, seedStressFromDecision,
  createNewScenario, duplicateScenario, getActiveStressSettings, invalidateScenarioCache, unlockPatchesOf, chargesPatchOnUnlock
} from '../src/storage/ScenarioRepository.js';
import { getStressSettingsAsync, loadStressDB, invalidateStressCache, createSimulationConfigFromSettings, saveStressSettings, resetStressSettings } from '../src/storage/StressRepository.js';

const PLANS_DIR = resolve(__dirname, 'fixtures', 'plans');
const names = readdirSync(PLANS_DIR).filter((f) => /^\d\d-.*\.json$/.test(f)).sort();
const load = (f) => JSON.parse(readFileSync(join(PLANS_DIR, f), 'utf8'));
const normalised = (f) => normalizeScenario(load(f)).scenario;
const NOW = new Date('2026-10-02T08:00:00.000Z');
const AFTER_APRIL = new Date('2027-04-06T12:00:00.000Z');
/** The fixture as a 6.19.0–6.21.0 app stored it: version 2, through the shipped steps 1 and 2 alone. */
const atV2 = (f) => migrateScenario(normalised(f), { now: NOW, target: 2, migrations: MIGRATIONS.slice(0, 2) }).scenario;
const isLocked = (s) => !!(s && s.decisionTool && s.decisionTool.settings && s.decisionTool.settings.locked);
const LOCKED = names.filter((f) => isLocked(normalised(f)));
const UNLOCKED = names.filter((f) => !isLocked(normalised(f)));
const bytes = (v) => JSON.stringify(v);

describe('the step itself', () => {
  it('is the third entry, named in plain English, and SCHEMA_VERSION is 3', () => {
    expect(SCHEMA_VERSION).toBe(3);
    expect(MIGRATIONS.length).toBe(3);
    expect(MIGRATIONS[2].to).toBe(3);
    expect(MIGRATIONS[2].name).toMatch(/ISAs and savings grow/);
    expect(MIGRATIONS[2].name).toMatch(/Mostly cash/);
    expect(MIGRATIONS[0].to).toBe(1);
    expect(MIGRATIONS[1].to).toBe(2);   // the shipped steps are still there, unchanged in place
  });
  it('the corpus has locked and unlocked plans to test it on', () => {
    expect(LOCKED).toEqual(['03-gilt-ladder-runup.json', '04-buckets-running.json', '05-saver-committed.json', '06-pre-6.4-no-timing.json']);
    expect(UNLOCKED.length).toBe(8);
  });
});

describe('an UNLOCKED plan is given "Mostly cash" in its Stress settings — and nothing else changes', () => {
  for (const f of UNLOCKED) {
    it(f + ' (from version 0 and from version 2)', () => {
      const v2 = atV2(f);
      expect(v2.schemaVersion).toBe(2);
      expect('isaGrowth' in v2.stressTool.settings).toBe(false);
      for (const input of [normalised(f), v2]) {
        const m = migrateScenario(input, { now: NOW });
        expect(m.error).toBeNull();
        expect(m.to).toBe(3);
        const out = m.scenario;
        expect(out.schemaVersion).toBe(3);
        expect(out.stressTool.settings.isaGrowth).toBe(DEFAULT_ISA_GROWTH);
        expect(DEFAULT_ISA_GROWTH).toBe('cash');
        // Everything else is exactly the version-2 plan: the step patches ONE key.
        const { isaGrowth, ...rest } = out.stressTool.settings;
        expect(bytes(rest)).toBe(bytes(v2.stressTool.settings));
        const { schemaVersion: a, stressTool: sa, ...outRoot } = out;
        const { schemaVersion: b, stressTool: sb, ...v2Root } = v2;
        expect(bytes(outRoot)).toBe(bytes(v2Root));
        // A Stress setting only: the Decision settings (and so the checksum) do not move; nothing paid in is written.
        expect('isaGrowth' in out.decisionTool.settings).toBe(false);
        expect(decisionSettingsChecksum(out.decisionTool.settings)).toBe(decisionSettingsChecksum(input.decisionTool.settings));
        expect(bytes(out.accumulationTool)).toBe(bytes(v2.accumulationTool));
      }
    });
  }
});

describe('a LOCKED plan is not touched at all', () => {
  for (const f of LOCKED) {
    it(f + ': Stress and Decision settings, checksum, plan document, archives and history byte-identical; no choice', () => {
      const raw = load(f);
      for (const input of [normalised(f), atV2(f)]) {
        const v2 = input.schemaVersion === 2 ? input : atV2(f);
        const m = migrateScenario(input, { now: NOW });
        expect(m.error).toBeNull();
        expect(m.scenario.schemaVersion).toBe(3);
        const out = m.scenario;
        expect('isaGrowth' in out.stressTool.settings).toBe(false);
        expect(bytes(out.stressTool)).toBe(bytes(v2.stressTool));
        expect(bytes(out.decisionTool)).toBe(bytes(v2.decisionTool));
        expect(decisionSettingsChecksum(out.decisionTool.settings)).toBe(decisionSettingsChecksum(raw.decisionTool.settings));
        expect(bytes(out.planDocument)).toBe(bytes(raw.planDocument));
        expect(bytes(out.planDocumentArchive)).toBe(bytes(raw.planDocumentArchive));
        const { schemaVersion: a, ...o } = out; const { schemaVersion: b, ...p } = v2;
        expect(bytes(o)).toBe(bytes(p));
        // …so its engine config has no choice: the ISA grows at the fixed rate it was locked with.
        expect('isaGrowth' in createSimulationConfigFromSettings({}, out.stressTool.settings)).toBe(false);
      }
    });
  }
  it('a locked plan that already carries a choice keeps it as it is', () => {
    const s = atV2('03-gilt-ladder-runup.json'); s.stressTool.settings.isaGrowth = 'invested';
    expect(migrateScenario(s, { now: NOW }).scenario.stressTool.settings.isaGrowth).toBe('invested');
  });
  it('the runner refuses a step 3 that would touch a locked plan\'s Stress settings', () => {
    const input = atV2('04-buckets-running.json'); const before = bytes(input);
    const m = migrateScenario(input, { now: NOW, target: 3, migrations: [...MIGRATIONS.slice(0, 2), { to: 3, name: 'bad', up: (s) => { s.stressTool.settings.isaGrowth = 'cash'; } }] });
    expect(m.error).toBeInstanceOf(Error);
    expect(m.error.message).toMatch(/Stress settings of a locked plan/);
    expect(m.scenario).toBe(input);
    expect(bytes(input)).toBe(before);
  });
});

describe('shape by shape', () => {
  const base = (over = {}) => ({
    id: 'p', schemaVersion: 2, planDetails: { name: 'P' }, strategy: { id: 'pots-and-valves', params: {}, lockedAt: 't', engineVersion: '6.21.0' },
    decisionTool: { settings: { equityMin: 1 }, history: [], taxYears: {} },
    stressTool: { settings: { equityMin: 2, chargesPct: 0.5 } }, ...over
  });
  const up = (s) => migrateScenario(s, { now: NOW });

  it('a valid choice already saved is kept; anything else is replaced by "Mostly cash"', () => {
    for (const v of ['cash', 'invested']) expect(up(base({ stressTool: { settings: { isaGrowth: v } } })).scenario.stressTool.settings.isaGrowth).toBe(v);
    for (const v of [null, 0.03, 'Cash', 'funds', '', {}]) expect(up(base({ stressTool: { settings: { isaGrowth: v } } })).scenario.stressTool.settings.isaGrowth).toBe('cash');
  });
  it('a plan whose fund list holds ISA funds gets it too (those funds still decide its ISA)', () => {
    const s = base({ stressTool: { settings: { taggedFunds: [{ ticker: 'VWRP', value: 50000, wrapper: 'ISA' }] } } });
    expect(up(s).scenario.stressTool.settings.isaGrowth).toBe('cash');
  });
  it('an unlocked plan with records (from before auto-lock) gets it; its Decision side is untouched', () => {
    const s = base({ decisionTool: { settings: { equityMin: 1 }, history: [{ date: '2026-09', equity: 1, settingsChecksum: 'x' }], taxYears: {} } });
    const out = up(s).scenario;
    expect(out.stressTool.settings.isaGrowth).toBe('cash');
    expect(bytes(out.decisionTool)).toBe(bytes(s.decisionTool));
  });
  it('a plan with no Stress settings is left without them', () => {
    for (const over of [{ stressTool: undefined }, { stressTool: {} }, { stressTool: { settings: null } }]) {
      const s = base(over); if (over.stressTool === undefined) delete s.stressTool;
      const m = up(s);
      expect(m.error).toBeNull();
      expect(bytes(m.scenario.stressTool)).toBe(bytes(s.stressTool));
    }
  });
  it('is idempotent and clock-free; the caller\'s object is never changed', () => {
    for (const f of names) {
      const once = migrateScenario(normalised(f), { now: NOW }).scenario;
      const { schemaVersion, ...unstamped } = deepCopy(once);
      const again = migrateScenario({ ...unstamped, schemaVersion: 2 }, { now: AFTER_APRIL });
      expect(again.error, f).toBeNull();
      expect(again.scenario, f).toEqual(once);
      expect(migrateScenario(once, { now: AFTER_APRIL }).changed, f).toBe(false);
    }
    const s = base(); const before = bytes(s);
    up(s);
    expect(bytes(s)).toBe(before);
  });
  it('every corpus plan\'s Decision checksum is the same after the whole read path (upgradeScenario) to version 3', () => {
    for (const f of names) {
      const raw = load(f);
      const u = upgradeScenario(raw, { now: NOW });
      expect(u.error, f).toBeNull();
      expect(u.scenario.schemaVersion, f).toBe(3);
      expect(decisionSettingsChecksum(u.scenario.decisionTool.settings), f).toBe(decisionSettingsChecksum(normalised(f).decisionTool.settings));
    }
  });
  it('a version-3 plan is newer than a 6.21.0 app: handed back untouched', () => {
    const v3 = migrateScenario(normalised('02-pnv-draft.json'), { now: NOW }).scenario;
    const old = migrateScenario(v3, { now: NOW, target: 2, migrations: MIGRATIONS.slice(0, 2) });
    expect(old.newer).toBe(true);
    expect(old.scenario).toBe(v3);
    expect(isNewerSchema({ schemaVersion: 3 })).toBe(false);
    expect(isNewerSchema({ schemaVersion: 4 })).toBe(true);
  });
});

// ---- the repositories (guest store = the same code path as Firestore) ----

const GUEST_KEY = 'pt_guest_scenarios';
const fresh = () => { invalidateScenarioCache(); invalidateStressCache(); invalidateDecisionCache(); };
const seedGuest = (list) => { enterGuestMode(); clearGuestData(); sessionStorage.setItem(GUEST_KEY, JSON.stringify(list)); fresh(); };
const stored = () => JSON.parse(sessionStorage.getItem(GUEST_KEY) || '[]');
afterEach(() => { leaveGuestMode(); clearGuestData(); fresh(); });

/** A plan as a 6.19.0–6.21.0 app stored it (version 2, a charge, no ISA choice), locked or not. */
const v2Plan = ({ id = 'guest-p', locked = false, history = [], stress = { equityMin: 300000, bondMin: 150000, cashTarget: 50000, duration: 30, baseSalary: 30000, pa: 12570, brl: 50270, hrl: 125140, isaBalance: 60000, chargesPct: 0.5 } } = {}) => ({
  id, isActive: true, schemaVersion: 2, planDetails: { name: 'P', description: '' }, enabledTools: ['stress', 'decision'],
  strategy: { id: 'pots-and-valves', params: {}, lockedAt: '2026-01-01T00:00:00.000Z', engineVersion: '6.21.0' },
  decisionTool: { settings: { equityMin: 300000, baseSalary: 30000, ...(locked ? { locked: true, lockedAt: '2026-05-01T00:00:00.000Z', lockedBy: 'first record' } : {}) }, history, taxYears: {} },
  ...(stress ? { stressTool: { settings: stress } } : {})
});

describe('the defaults', () => {
  it('a new plan is born "Mostly cash" in its Stress settings, and with nothing in its Decision settings', () => {
    const s = getDefaultScenario('New');
    expect(s.stressTool.settings.isaGrowth).toBe('cash');
    expect(s.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect('isaGrowth' in s.decisionTool.settings).toBe(false);
    expect(s.schemaVersion).toBe(3);
  });
  it('the defaults merged UNDER a stored plan never carry it (or a locked plan would read it)', () => {
    expect('isaGrowth' in getDefaultStressSettings()).toBe(false);
    expect('isaGrowth' in getDefaultDecisionSettings()).toBe(false);
    expect('isaGrowth' in loadStressDB().settings).toBe(false);   // getDefaultStressDB, when nothing is loaded
  });
  it('a new plan through the repositories gets it; a demo that says otherwise keeps its own', async () => {
    enterGuestMode(); clearGuestData(); fresh();
    const id = await createNewScenario('Mine', '', ['stress', 'decision'], { stressSettings: { configured: true, equityMin: 250000 } }, true);
    expect((await loadScenario(id)).stressTool.settings.isaGrowth).toBe('cash');
    const demo = await createNewScenario('Demo', '', ['stress'], { stressSettings: { baseSalary: 1, isaGrowth: 'invested' } }, false);
    expect((await loadScenario(demo)).stressTool.settings.isaGrowth).toBe('invested');
    fresh();
    expect((await getStressSettingsAsync()).isaGrowth).toBe('cash');
  });
});

describe('the copies between the two tools', () => {
  it('Stress → Decision never carries it (the Decision settings are checksummed)', () => {
    expect('isaGrowth' in seedDecisionFromStress({ equityMin: 1, isaGrowth: 'invested' }, {})).toBe(false);
    const b = { equityMin: 1, baseSalary: 2 };
    expect(decisionSettingsChecksum(seedDecisionFromStress({ ...b, isaGrowth: 'invested' }, {}))).toBe(decisionSettingsChecksum(seedDecisionFromStress(b, {})));
  });
  it('Decision → Stress keeps the plan\'s own choice, and gives none to a plan that had none', () => {
    expect(seedStressFromDecision({ equityMin: 1 }, { isaGrowth: 'invested' }, 't').isaGrowth).toBe('invested');
    expect('isaGrowth' in seedStressFromDecision({ equityMin: 1, isaGrowth: 'cash' }, {}, 't')).toBe(false);
  });
});

describe('the engine config carries the choice only when the plan has one', () => {
  const S = { equityMin: 300000, bondMin: 150000, cashTarget: 50000, duration: 30, baseSalary: 30000, pa: 12570, brl: 50270, hrl: 125140, isaBalance: 60000 };
  it('"cash" and "invested" go in as they are; isaReturn is unchanged', () => {
    const plain = createSimulationConfigFromSettings({}, S);
    for (const v of ['cash', 'invested']) {
      const cfg = createSimulationConfigFromSettings({}, { ...S, isaGrowth: v });
      expect(cfg.isaGrowth).toBe(v);
      expect(cfg.isaReturn).toBe(plain.isaReturn);
      expect('isaGrowthMix' in cfg).toBe(false);   // "invested" reads the run's own pension pots
    }
  });
  it('absent or invalid: no key at all — the config is exactly the one it always was', () => {
    const plain = createSimulationConfigFromSettings({}, S);
    expect('isaGrowth' in plain).toBe(false);
    for (const v of [null, 'Cash', 0.03, 'funds']) expect(JSON.stringify(createSimulationConfigFromSettings({}, { ...S, isaGrowth: v }))).toBe(JSON.stringify(plain));
  });
});

describe('loading a plan', () => {
  it('an UNLOCKED version-2 plan is given "Mostly cash" on its first load, written back once; its runs take it', async () => {
    seedGuest([v2Plan()]);
    const s = await getStressSettingsAsync();
    expect(s.isaGrowth).toBe('cash');
    expect(stored()[0].schemaVersion).toBe(3);
    expect(stored()[0].stressTool.settings.isaGrowth).toBe('cash');
    expect(createSimulationConfigFromSettings({}, s).isaGrowth).toBe('cash');
  });
  it('a LOCKED version-2 plan loads with no choice: its Stress settings and Decision checksum are as they were', async () => {
    const plan = v2Plan({ locked: true, history: [{ date: '2026-06', settingsChecksum: 'c' }] });
    seedGuest([plan]);
    const s = await getStressSettingsAsync();
    expect('isaGrowth' in s).toBe(false);
    expect('isaGrowth' in createSimulationConfigFromSettings({}, s)).toBe(false);
    const after = stored()[0];
    expect(after.schemaVersion).toBe(3);
    const { legacyFirstTaxYear, ...rest } = after.stressTool.settings;
    expect(rest).toEqual(plan.stressTool.settings);
    expect(after.decisionTool).toEqual(plan.decisionTool);
  });
  it('a plan with no Stress settings at all: an unlocked one reads "Mostly cash", a locked one reads none', async () => {
    seedGuest([v2Plan({ stress: null })]);
    expect((await getActiveStressSettings()).isaGrowth).toBe('cash');
    expect((await getStressSettingsAsync()).isaGrowth).toBe('cash');
    seedGuest([v2Plan({ stress: null, locked: true })]);
    expect('isaGrowth' in (await getActiveStressSettings())).toBe(false);
    expect('isaGrowth' in (await getStressSettingsAsync())).toBe(false);
  });
});

describe('unlocking a plan locked before the choice (owner D4): it grows like cash from then on', () => {
  it('unlockPatchesOf: the charge and the ISA choice together; nothing when the plan has both', () => {
    expect(unlockPatchesOf({})).toEqual({ chargesPct: DEFAULT_CHARGES_PCT, isaGrowth: 'cash' });
    expect(unlockPatchesOf(null)).toEqual({ chargesPct: DEFAULT_CHARGES_PCT, isaGrowth: 'cash' });
    expect(unlockPatchesOf({ chargesPct: 0.5 })).toEqual({ isaGrowth: 'cash' });
    expect(unlockPatchesOf({ isaGrowth: 'invested' })).toEqual({ chargesPct: DEFAULT_CHARGES_PCT });
    expect(unlockPatchesOf({ chargesPct: 0, isaGrowth: 'cash' })).toBeNull();
    expect(unlockPatchesOf({ chargesPct: 1, isaGrowth: 'nonsense' })).toEqual({ isaGrowth: 'cash' });
    expect(chargesPatchOnUnlock({ chargesPct: 0.5 })).toBeNull();   // the charges half is unchanged
  });
  it('index.html writes the one patch and lists what it changes', () => {
    const src = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    const at = src.indexOf('window.unlockDecisionSettings');
    const body = src.slice(at, src.indexOf('window.createNewPlanForSettings', at));
    expect(body).toMatch(/unlockPatchesOf\(await getStressSettingsAsync\(\)\)/);
    expect(body).toMatch(/unlockNotesHtml\(/);
    expect(body).not.toMatch(/chargesPatchOnUnlock/);
  });
});

describe('a copy (owner D3): an unlocked copy is a new plan, so it starts "Mostly cash"', () => {
  it('an unlocked copy of a plan locked before the choice gets "cash"; a copy that carries records stays as it was', async () => {
    seedGuest([v2Plan({ id: 'guest-src', locked: true })]);
    await getStressSettingsAsync();
    fresh();
    const draftId = await duplicateScenario('guest-src', 'Draft copy', { carryHistory: false });
    const draft = await loadScenario(draftId);
    expect(draft.decisionTool.settings.locked).toBe(false);
    expect(draft.stressTool.settings.isaGrowth).toBe('cash');
    expect(draft.stressTool.settings.chargesPct).toBe(0.5);   // its own charge, kept

    seedGuest([v2Plan({ id: 'guest-src2', locked: true, history: [{ date: '2026-06', settingsChecksum: 'c' }] })]);
    await getStressSettingsAsync();
    fresh();
    const lockedId = await duplicateScenario('guest-src2', 'Copy with records', { carryHistory: true });
    const lockedCopy = await loadScenario(lockedId);
    expect(lockedCopy.decisionTool.settings.locked).toBe(true);
    expect('isaGrowth' in lockedCopy.stressTool.settings).toBe(false);
  });
  it('a copy of a plan that has a choice keeps it', async () => {
    seedGuest([{ ...v2Plan({ id: 'guest-src3' }), schemaVersion: 3, stressTool: { settings: { equityMin: 1, chargesPct: 0.5, isaGrowth: 'invested' } } }]);
    const id = await duplicateScenario('guest-src3', 'Copy');
    expect((await loadScenario(id)).stressTool.settings.isaGrowth).toBe('invested');
  });
});

describe('Reset to defaults gives an unlocked plan "Mostly cash"', () => {
  it('the reset settings carry it', async () => {
    enterGuestMode(); clearGuestData(); fresh();
    await createNewScenario('Mine', '', ['stress', 'decision'], {}, true);
    await saveStressSettings({ isaGrowth: 'invested' });
    await resetStressSettings();
    fresh();
    expect((await getStressSettingsAsync()).isaGrowth).toBe('cash');
  });
});
