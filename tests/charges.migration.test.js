/**
 * Schema version 2 (6.19.0): fund and platform charges written into every UNLOCKED plan, and nothing at all done to a
 * LOCKED one (research/charges-setting.md §4, rule 3).
 *
 * The owner's rule: "Locked plans keep their figures. A locked plan with no stored setting runs at 0% until it is
 * unlocked … Unlocked plans that already exist get 0.5 through a schemaVersion 2 migration." The step must never touch
 * a locked plan's settings (Stress or Decision), its plan document, its archives or its history, and a locked plan's
 * decisionSettingsChecksum must not move. The chain runner now ENFORCES the Stress half too, from this step on.
 *
 * Run over the 12 corpus fixtures exactly as the read path runs it (normalizeScenario, then the chain), at version 0
 * (every fixture) and at version 1 (the shape a 6.15–6.18 plan is stored in: the fixtures taken to version 1 by the
 * shipped step 1 alone).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { SCHEMA_VERSION, isNewerSchema } from '../src/storage/schema.js';
import { MIGRATIONS, migrateScenario, deepCopy } from '../src/storage/migrations.js';
import { normalizeScenario, upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { decisionSettingsChecksum } from '../src/storage/DecisionRepository.js';
import { DEFAULT_CHARGES_PCT } from '../src/services/Charges.js';

const PLANS_DIR = resolve(__dirname, 'fixtures', 'plans');
const names = readdirSync(PLANS_DIR).filter((f) => /^\d\d-.*\.json$/.test(f)).sort();
const load = (f) => JSON.parse(readFileSync(join(PLANS_DIR, f), 'utf8'));
const normalised = (f) => normalizeScenario(load(f)).scenario;
const NOW = new Date('2026-10-01T08:00:00.000Z');
const AFTER_APRIL = new Date('2027-04-06T12:00:00.000Z');
/** The fixture as a 6.15–6.18 app stored it: version 1, through the shipped step 1 only. */
const atV1 = (f) => migrateScenario(normalised(f), { now: NOW, target: 1, migrations: MIGRATIONS.slice(0, 1) }).scenario;
/** The chain as 6.19.0–6.21.0 shipped it: up to step 2 (step 3, 6.22.0, has its own file: tests/isaGrowth.storage.test.js). */
const TO_V2 = { target: 2, migrations: MIGRATIONS.slice(0, 2) };
const isLocked = (s) => !!(s && s.decisionTool && s.decisionTool.settings && s.decisionTool.settings.locked);
const LOCKED = names.filter((f) => isLocked(normalised(f)));
const UNLOCKED = names.filter((f) => !isLocked(normalised(f)));
const bytes = (v) => JSON.stringify(v);

describe('the step itself', () => {
  it('is the second entry, named in plain English (SCHEMA_VERSION has moved on past it: 3 from 6.22.0)', () => {
    expect(SCHEMA_VERSION).toBeGreaterThanOrEqual(2);
    expect(MIGRATIONS[1].to).toBe(2);
    expect(MIGRATIONS[1].name).toMatch(/charges/i);
    expect(MIGRATIONS[0].to).toBe(1);   // the shipped step is still first and unchanged in place
  });
  it('the corpus has locked and unlocked plans to test it on', () => {
    expect(LOCKED).toEqual(['03-gilt-ladder-runup.json', '04-buckets-running.json', '05-saver-committed.json', '06-pre-6.4-no-timing.json']);
    expect(UNLOCKED.length).toBe(8);
  });
});

describe('an UNLOCKED plan gets the default, 0.5% a year, in its Stress settings — and nothing else changes', () => {
  for (const f of UNLOCKED) {
    it(f + ' (from version 0 and from version 1)', () => {
      const v1 = atV1(f);
      expect(v1.schemaVersion).toBe(1);
      expect('chargesPct' in v1.stressTool.settings).toBe(false);
      for (const input of [normalised(f), v1]) {
        const m = migrateScenario(input, { now: NOW, ...TO_V2 });
        expect(m.error).toBeNull();
        expect(m.to).toBe(2);
        const out = m.scenario;
        expect(out.schemaVersion).toBe(2);
        expect(out.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
        // Everything else is exactly the version-1 plan: the step patches ONE key.
        const { chargesPct, ...rest } = out.stressTool.settings;
        expect(bytes(rest)).toBe(bytes(v1.stressTool.settings));
        const { schemaVersion: a, stressTool: sa, ...outRoot } = out;
        const { schemaVersion: b, stressTool: sb, ...v1Root } = v1;
        expect(bytes(outRoot)).toBe(bytes(v1Root));
        // The setting is a Stress setting only: the Decision settings (and so the checksum) do not move.
        expect('chargesPct' in out.decisionTool.settings).toBe(false);
        expect(decisionSettingsChecksum(out.decisionTool.settings)).toBe(decisionSettingsChecksum(input.decisionTool.settings));
      }
    });
  }
  it('08 (phantom dotted keys) gets it too — the chain runs after normalisation', () => {
    const u = upgradeScenario(load('08-dotted-keys.json'), { now: NOW });   // the whole chain (to 3): step 2 is in it
    expect(u.error).toBeNull();
    expect(u.write).toBe(true);
    expect(u.scenario.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect(Object.keys(u.scenario).some((k) => k.includes('.'))).toBe(false);
  });
});

describe('a LOCKED plan is not touched at all', () => {
  for (const f of LOCKED) {
    it(f + ': Stress and Decision settings, checksum, plan document, archives and history byte-identical; no charge key', () => {
      const raw = load(f);
      for (const input of [normalised(f), atV1(f)]) {
        const v1 = input.schemaVersion === 1 ? input : atV1(f);
        const m = migrateScenario(input, { now: NOW, ...TO_V2 });
        expect(m.error).toBeNull();
        expect(m.scenario.schemaVersion).toBe(2);
        const out = m.scenario;
        expect('chargesPct' in out.stressTool.settings).toBe(false);
        expect(bytes(out.stressTool)).toBe(bytes(v1.stressTool));
        expect(bytes(out.decisionTool)).toBe(bytes(v1.decisionTool));
        expect(decisionSettingsChecksum(out.decisionTool.settings)).toBe(decisionSettingsChecksum(raw.decisionTool.settings));
        expect(bytes(out.planDocument)).toBe(bytes(raw.planDocument));
        expect(bytes(out.planDocumentArchive)).toBe(bytes(raw.planDocumentArchive));
        expect(bytes(out.decisionTool.history)).toBe(bytes(raw.decisionTool.history));
        expect(bytes(out.decisionTool.planOfRecord)).toBe(bytes(raw.decisionTool.planOfRecord));
        // The whole plan is the version-1 plan with only the version mark moved.
        const { schemaVersion: a, ...o } = out; const { schemaVersion: b, ...p } = v1;
        expect(bytes(o)).toBe(bytes(p));
      }
    });
  }
  it('a locked plan that already carries a charge keeps it as it is', () => {
    const s = atV1('03-gilt-ladder-runup.json'); s.stressTool.settings.chargesPct = 1.25;
    expect(migrateScenario(s, { now: NOW, ...TO_V2 }).scenario.stressTool.settings.chargesPct).toBe(1.25);
  });
});

describe('shape by shape', () => {
  const base = (over = {}) => ({
    id: 'p', schemaVersion: 1, planDetails: { name: 'P' }, strategy: { id: 'pots-and-valves', params: {}, lockedAt: 't', engineVersion: '6.18.0' },
    decisionTool: { settings: { equityMin: 1 }, history: [], taxYears: {} },
    stressTool: { settings: { equityMin: 2 } }, ...over
  });
  const up = (s) => migrateScenario(s, { now: NOW, ...TO_V2 });

  it('a charge already saved is kept (0 included); an invalid one is replaced by the default', () => {
    for (const v of [0, 0.05, 1.25, 3]) expect(up(base({ stressTool: { settings: { chargesPct: v } } })).scenario.stressTool.settings.chargesPct).toBe(v);
    for (const v of [null, -1, 3.5, '0.5', 'x']) expect(up(base({ stressTool: { settings: { chargesPct: v } } })).scenario.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
  });
  it('an unlocked plan with records (from before auto-lock, R10) gets the default; its Decision side is untouched', () => {
    const s = base({ decisionTool: { settings: { equityMin: 1 }, history: [{ date: '2026-09', equity: 1, settingsChecksum: 'x' }], taxYears: { '26/27': { yearSetupComplete: true } } } });
    const out = up(s).scenario;
    expect(out.stressTool.settings.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect(bytes(out.decisionTool)).toBe(bytes(s.decisionTool));
  });
  it('a plan with no Stress settings is left without them (the reader gives an unlocked plan the default)', () => {
    for (const over of [{ stressTool: undefined }, { stressTool: {} }, { stressTool: { settings: null } }]) {
      const s = base(over); if (over.stressTool === undefined) delete s.stressTool;
      const m = up(s);
      expect(m.error).toBeNull();
      expect(bytes(m.scenario.stressTool)).toBe(bytes(s.stressTool));
    }
  });
  it('a locked plan with no Stress settings is left without them', () => {
    const s = base({ decisionTool: { settings: { locked: true }, history: [], taxYears: {} } }); delete s.stressTool;
    const m = up(s);
    expect(m.error).toBeNull();
    expect('stressTool' in m.scenario).toBe(false);
  });
  it('unknown keys survive, at every level', () => {
    const s = base(); s.futureRoot = 1; s.stressTool.futureTool = 2; s.stressTool.settings.futureSetting = 'x';
    const out = up(s).scenario;
    expect(out.futureRoot).toBe(1); expect(out.stressTool.futureTool).toBe(2); expect(out.stressTool.settings.futureSetting).toBe('x');
  });
  it('is idempotent and clock-free: run again on its own output (version mark removed, a later clock) it changes nothing', () => {
    for (const f of names) {
      const once = migrateScenario(normalised(f), { now: NOW, ...TO_V2 }).scenario;
      const { schemaVersion, ...unstamped } = deepCopy(once);
      const again = migrateScenario({ ...unstamped, schemaVersion: 1 }, { now: AFTER_APRIL, ...TO_V2 });
      expect(again.error, f).toBeNull();
      expect(again.scenario, f).toEqual(once);
      expect(migrateScenario(once, { now: AFTER_APRIL, ...TO_V2 }).changed, f).toBe(false);
    }
  });
  it('the caller\'s object is never changed', () => {
    const s = base(); const before = bytes(s);
    up(s);
    expect(bytes(s)).toBe(before);
  });
});

describe('the runner enforces it: no step from 2 on may change a LOCKED plan\'s Stress settings', () => {
  const locked = () => atV1('04-buckets-running.json');
  const chain = (up) => ({ now: NOW, target: 2, migrations: [MIGRATIONS[0], { to: 2, name: 'bad', up }] });
  it('adding, changing or removing any Stress key of a locked plan abandons the chain; the plan is left as it was', () => {
    for (const bad of [
      (s) => { s.stressTool.settings.chargesPct = 0.5; },
      (s) => { s.stressTool.settings.equityMin += 1; },
      (s) => { delete s.stressTool.settings.duration; },
      (s) => { s.stressTool.settings = { ...s.stressTool.settings }; s.stressTool.settings.x = 1; },
      (s) => ({ ...s, stressTool: { settings: {} } })
    ]) {
      const input = locked(); const before = bytes(input);
      const m = migrateScenario(input, chain(bad));
      expect(m.error).toBeInstanceOf(Error);
      expect(m.error.message).toMatch(/Stress settings of a locked plan/);
      expect(m.changed).toBe(false);
      expect(m.scenario).toBe(input);
      expect(bytes(input)).toBe(before);
    }
  });
  it('the same change to an UNLOCKED plan is allowed', () => {
    const m = migrateScenario(atV1('02-pnv-draft.json'), chain((s) => { s.stressTool.settings.x = 1; }));
    expect(m.error).toBeNull();
    expect(m.scenario.stressTool.settings.x).toBe(1);
  });
  it('step 1 (shipped) is not held to it, so a version-0 locked plan still makes the whole journey', () => {
    for (const f of LOCKED) expect(migrateScenario(normalised(f), { now: NOW, ...TO_V2 }).error, f).toBeNull();
  });
});

describe('a tab left open across the release (the newer-than-app guard)', () => {
  it('a version-2 plan is newer than a version-1 app: handed back untouched, flagged, no write', () => {
    const v2 = migrateScenario(normalised('02-pnv-draft.json'), { now: NOW, ...TO_V2 }).scenario;
    expect(v2.schemaVersion).toBe(2);
    const before = bytes(v2);
    // The 6.15–6.18 app: its chain ends at step 1.
    const old = migrateScenario(v2, { now: NOW, target: 1, migrations: MIGRATIONS.slice(0, 1) });
    expect(old.newer).toBe(true);
    expect(old.changed).toBe(false);
    expect(old.scenario).toBe(v2);
    expect(bytes(v2)).toBe(before);
  });
  it('a plan from a version after this one is newer than this app', () => {
    expect(isNewerSchema({ schemaVersion: SCHEMA_VERSION })).toBe(false);
    expect(isNewerSchema({ schemaVersion: SCHEMA_VERSION + 1 })).toBe(true);
    const u = upgradeScenario({ ...normalised('02-pnv-draft.json'), schemaVersion: SCHEMA_VERSION + 1 }, { now: NOW });
    expect(u.newer).toBe(true);
    expect(u.write).toBe(false);
    expect('chargesPct' in u.scenario.stressTool.settings).toBe(false);   // not given the default by an app that is older than it
  });
});
