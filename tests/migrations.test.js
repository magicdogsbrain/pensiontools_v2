/**
 * Saved-plan schema version and the migration chain (6.15.0, V7 plan step 2).
 *
 * The chain is run over the 12 corpus fixtures (tests/fixtures/plans/NN-*.json) — the saved-plan shapes every
 * later change is tested against — exactly as the read path runs it: normalizeScenario, then migrateScenario.
 *
 * The contract block at the top is modelled on tests/releases.test.js: SCHEMA_VERSION cannot move without a
 * migration entry, and an entry cannot be added without moving SCHEMA_VERSION.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { SCHEMA_VERSION, schemaVersionOf, isNewerSchema, PlanNewerThanAppError, PLAN_NEWER_MESSAGE, PLAN_NEWER_CODE } from '../src/storage/schema.js';
import { MIGRATIONS, migrateScenario, deepCopy, decisionSettingsFrozen } from '../src/storage/migrations.js';
import { normalizeScenario, upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { decisionSettingsChecksum } from '../src/storage/DecisionRepository.js';
import { getDefaultScenario } from '../src/storage/ScenarioRepository.js';
import { sortLegacyParams } from '../src/services/StrategyState.js';
import { normaliseHoldings, HOLDINGS_VERSION } from '../src/services/HoldingsRecord.js';
import { ENGINE_VERSION } from '../src/strategies/version.js';

const PLANS_DIR = resolve(__dirname, 'fixtures', 'plans');
const names = readdirSync(PLANS_DIR).filter((f) => /^\d\d-.*\.json$/.test(f)).sort();
const load = (f) => JSON.parse(readFileSync(join(PLANS_DIR, f), 'utf8'));
/** The fixture as the read path hands it to the chain. */
const normalised = (f) => normalizeScenario(load(f)).scenario;

const BEFORE_APRIL = new Date('2027-04-05T12:00:00.000Z');
const AFTER_APRIL = new Date('2027-04-06T12:00:00.000Z');
const NOW = new Date('2026-09-30T08:00:00.000Z');

function hasUndefined(v) {
  if (v === undefined) return true;
  if (Array.isArray(v)) return v.some(hasUndefined);
  if (v && typeof v === 'object') return Object.values(v).some(hasUndefined);
  return false;
}

describe('the schema contract', () => {
  it('SCHEMA_VERSION is a whole number and equals the last migration\'s "to"', () => {
    expect(Number.isInteger(SCHEMA_VERSION)).toBe(true);
    expect(SCHEMA_VERSION).toBeGreaterThanOrEqual(1);
    expect(MIGRATIONS.length).toBeGreaterThan(0);
    expect(MIGRATIONS[MIGRATIONS.length - 1].to).toBe(SCHEMA_VERSION);
  });
  it('the chain is contiguous from 1, and every entry has a name and an up()', () => {
    MIGRATIONS.forEach((m, i) => {
      expect(m.to, 'entry ' + i).toBe(i + 1);
      expect(typeof m.name === 'string' && m.name.length > 0, 'entry ' + i + ' name').toBe(true);
      expect(typeof m.up, 'entry ' + i + ' up').toBe('function');
    });
  });
  it('this release is schema version 2', () => {
    // Moving this number is a deliberate act: add the next MIGRATIONS entry and a fixture of the old shape
    // (RELEASING.md, "Saved-plan schema version"), then change it here. 6.19.0: step 2, fund and platform charges.
    expect(SCHEMA_VERSION).toBe(2);
  });
  it('a plan with no version, or a version that is not a whole number, reads as 0', () => {
    for (const v of [undefined, null, '1', 1.5, -1, NaN, {}]) expect(schemaVersionOf({ schemaVersion: v })).toBe(0);
    expect(schemaVersionOf({})).toBe(0);
    expect(schemaVersionOf(null)).toBe(0);
    expect(schemaVersionOf({ schemaVersion: 3 })).toBe(3);
    expect(isNewerSchema({ schemaVersion: SCHEMA_VERSION })).toBe(false);
    expect(isNewerSchema({ schemaVersion: SCHEMA_VERSION + 1 })).toBe(true);
    expect(isNewerSchema({})).toBe(false);
  });
  it('the refusal error carries the plain message and a code the shell can test', () => {
    const e = new PlanNewerThanAppError('abc');
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toBe(PLAN_NEWER_MESSAGE);
    expect(e.message).toBe('This plan was updated by a newer version of the app — reload the page.');
    expect(e.code).toBe(PLAN_NEWER_CODE);
    expect(e.scenarioId).toBe('abc');
  });
  it('a new plan is born at the current version, at the ROOT — outside both settings maps', () => {
    const s = getDefaultScenario('P');
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect('schemaVersion' in s.decisionTool.settings).toBe(false);
    expect('schemaVersion' in s.stressTool.settings).toBe(false);
    const m = migrateScenario(s, { now: NOW });
    expect(m.changed).toBe(false);
    expect(m.scenario).toBe(s);
  });
});

describe('the chain over the plan corpus', () => {
  it('covers all 12 fixtures, none of which carries a version yet', () => {
    expect(names.length).toBe(12);
    for (const f of names) expect(schemaVersionOf(load(f)), f).toBe(0);
  });

  for (const f of names) {
    describe(f, () => {
      it('reaches the current version with no error, and the input is not touched', () => {
        const input = normalised(f);
        const before = JSON.stringify(input);
        const m = migrateScenario(input, { now: NOW });
        expect(m.error).toBeNull();
        expect(m.newer).toBe(false);
        expect(m.from).toBe(0);
        expect(m.to).toBe(SCHEMA_VERSION);
        expect(m.changed).toBe(true);
        expect(m.scenario).not.toBe(input);
        expect(m.scenario.schemaVersion).toBe(SCHEMA_VERSION);
        expect(JSON.stringify(input)).toBe(before);
        expect(hasUndefined(m.scenario)).toBe(false);   // Firestore refuses undefined
      });

      it('migrating twice equals migrating once — by version, and step by step', () => {
        const once = migrateScenario(normalised(f), { now: NOW }).scenario;
        const twice = migrateScenario(once, { now: AFTER_APRIL });
        expect(twice.changed).toBe(false);
        expect(twice.scenario).toBe(once);
        // The steps themselves are idempotent: run again on their own output (version mark removed, a later clock).
        const { schemaVersion, ...unstamped } = deepCopy(once);
        const again = migrateScenario(unstamped, { now: AFTER_APRIL });
        expect(again.error).toBeNull();
        expect(again.scenario).toEqual(once);
        // …and the whole read path is: normalise + migrate, then again.
        const u1 = upgradeScenario(load(f), { now: NOW });
        const u2 = upgradeScenario(u1.scenario, { now: NOW });
        expect(u1.write).toBe(true);
        expect(u2.write).toBe(false);
        expect(u2.scenario).toBe(u1.scenario);
      });

      it('every root key survives, and only the keys the step owns may differ', () => {
        const input = normalised(f);
        const out = migrateScenario(input, { now: NOW }).scenario;
        for (const k of Object.keys(input)) expect(k in out, 'root key ' + k).toBe(true);
        const mayChange = new Set(['schemaVersion', 'strategy', 'stressTool', 'holdings']);
        for (const k of Object.keys(input)) if (!mayChange.has(k)) expect(JSON.stringify(out[k]), 'root key ' + k).toBe(JSON.stringify(input[k]));
        expect(Object.keys(out).filter((k) => !(k in input))).toEqual(['schemaVersion']);   // every fixture already has a strategy block
        // Stress settings: nothing removed, nothing already there changed.
        const a = input.stressTool.settings, b = out.stressTool.settings;
        for (const k of Object.keys(a)) expect(JSON.stringify(b[k]), 'stress ' + k).toBe(JSON.stringify(a[k]));
      });

      it('the Decision side is byte-identical: settings, checksum, history, tax years, plan of record', () => {
        const input = normalised(f);
        const out = migrateScenario(input, { now: NOW }).scenario;
        expect(JSON.stringify(out.decisionTool)).toBe(JSON.stringify(input.decisionTool));
        expect(decisionSettingsChecksum(out.decisionTool.settings)).toBe(decisionSettingsChecksum(input.decisionTool.settings));
      });

      it('the plan document and its archive are byte-identical to the stored file', () => {
        const raw = load(f);
        const out = upgradeScenario(raw, { now: NOW }).scenario;
        expect(JSON.stringify(out.planDocument)).toBe(JSON.stringify(raw.planDocument));
        expect(JSON.stringify(out.planDocumentArchive)).toBe(JSON.stringify(raw.planDocumentArchive));
      });

      it('the result is the same with "now" either side of 6 April 2027', () => {
        const a = migrateScenario(normalised(f), { now: BEFORE_APRIL }).scenario;
        const b = migrateScenario(normalised(f), { now: AFTER_APRIL }).scenario;
        expect(JSON.stringify(a)).toBe(JSON.stringify(b));
        const c = migrateScenario(normalised(f), { now: '2031-01-01T00:00:00.000Z' }).scenario;
        expect(JSON.stringify(c)).toBe(JSON.stringify(a));
      });
    });
  }

  it('the locked fixtures are in the set, and each keeps its checksum and plan document', () => {
    const locked = names.filter((f) => load(f).decisionTool?.settings?.locked);
    expect(locked.length).toBeGreaterThanOrEqual(3);
    expect(locked.some((f) => !!load(f).planDocument)).toBe(true);
    for (const f of locked) {
      const raw = load(f);
      const out = upgradeScenario(raw, { now: NOW }).scenario;
      expect(decisionSettingsFrozen(out), f).toBe(true);
      expect(decisionSettingsChecksum(out.decisionTool.settings), f).toBe(decisionSettingsChecksum(raw.decisionTool.settings));
      expect(JSON.stringify(out.planDocument), f).toBe(JSON.stringify(raw.planDocument));
      expect(JSON.stringify(out.decisionTool.history), f).toBe(JSON.stringify(raw.decisionTool.history));
    }
  });

  it('07 (the pre-6.13 flat bag) has its per-strategy settings written down, the flat fields left as they are', () => {
    const input = normalised('07-pre-6.13-flat-params.json');
    expect(input.stressTool.settings.strategyState).toBeUndefined();
    const out = migrateScenario(input, { now: NOW }).scenario;
    const expected = sortLegacyParams(input.stressTool.settings).strategyState;
    expect(Object.keys(expected).length).toBeGreaterThan(0);
    expect(out.stressTool.settings.strategyState).toEqual(expected);
    expect(out.stressTool.settings.strategyParams).toEqual(input.stressTool.settings.strategyParams);
    expect(out.stressTool.settings.strategyId).toBe(input.stressTool.settings.strategyId);
    expect(sortLegacyParams(out.stressTool.settings)).toBe(out.stressTool.settings);   // the lazy reader now has nothing to do
  });

  it('08 (phantom dotted keys) is normalised first, then stamped: no dotted key, the latest edits kept', () => {
    const raw = load('08-dotted-keys.json');
    const u = upgradeScenario(raw, { now: NOW });
    expect(u.write).toBe(true);
    expect(u.error).toBeNull();
    expect(Object.keys(u.scenario).some((k) => k.includes('.'))).toBe(false);
    expect(u.scenario.schemaVersion).toBe(SCHEMA_VERSION);
    expect(u.scenario.decisionTool.settings).toEqual(raw['decisionTool.settings']);
    expect(u.scenario.planDetails.name).toBe(raw['planDetails.name']);
  });
});

describe('step 0 → 1, shape by shape', () => {
  const base = () => ({
    id: 'p', isActive: true, enabledTools: ['stress', 'decision'], createdAt: '2025-11-02T10:00:00.000Z', lastModified: '2026-01-05T10:00:00.000Z',
    planDetails: { name: 'P', description: '' },
    decisionTool: { settings: { equityMin: 1 }, history: [], taxYears: {} },
    stressTool: { settings: { equityMin: 2 } }
  });

  it('a plan older than the strategy schema gets the incumbent strategy, dated from the plan itself — not from today', () => {
    const a = migrateScenario(base(), { now: BEFORE_APRIL }).scenario;
    expect(a.strategy).toEqual({ id: 'pots-and-valves', params: {}, lockedAt: '2025-11-02T10:00:00.000Z', engineVersion: ENGINE_VERSION });
    const noCreated = base(); delete noCreated.createdAt;
    expect(migrateScenario(noCreated, { now: NOW }).scenario.strategy.lockedAt).toBe('2026-01-05T10:00:00.000Z');
    const undated = base(); delete undated.createdAt; delete undated.lastModified;
    expect(migrateScenario(undated, { now: NOW }).scenario.strategy.lockedAt).toBe(NOW.toISOString());   // the clock passed in, only when the plan has no date of its own
  });

  it('an existing strategy block is left exactly as it is', () => {
    const s = base(); s.strategy = { id: 'full-il-gilt', params: { cashYears: 3 }, lockedAt: 't', engineVersion: '6.4.0', somethingNew: 1 };
    expect(migrateScenario(s, { now: NOW }).scenario.strategy).toEqual(s.strategy);
  });

  it('the three renamed Stress keys are filled in once; a value already saved wins; the old keys stay', () => {
    const s = base(); s.stressTool.settings = { pacwMin: 300000, cgtMin: 100000, csh2Target: 40000, cashTarget: 55000 };
    const st = migrateScenario(s, { now: NOW, target: 1, migrations: MIGRATIONS.slice(0, 1) }).scenario.stressTool.settings;   // step 1 alone (step 2 adds the charge)
    expect(st).toEqual({ pacwMin: 300000, cgtMin: 100000, csh2Target: 40000, equityMin: 300000, bondMin: 100000, cashTarget: 55000 });
  });

  it('holdings: a bare array or an unversioned record is put in today\'s shape with its unknown keys kept; a current record is untouched', () => {
    const arr = base(); arr.holdings = [{ ticker: 'vwrp', wrapper: 'isa', value: '1,000' }];
    expect(migrateScenario(arr, { now: NOW }).scenario.holdings).toEqual(normaliseHoldings(arr.holdings));
    const old = base(); old.holdings = { lines: [{ ticker: 'TR29', wrapper: 'SIPP', value: 5 }], importedFrom: 'a future field' };
    const h = migrateScenario(old, { now: NOW }).scenario.holdings;
    expect(h.version).toBe(HOLDINGS_VERSION);
    expect(h.importedFrom).toBe('a future field');
    expect(h.lines).toEqual(normaliseHoldings(old.holdings).lines);
    const cur = base(); cur.holdings = { version: HOLDINGS_VERSION, updatedAt: null, source: 'typed', offerDismissed: false, lines: [{ ticker: 'X', odd: true }] };
    expect(migrateScenario(cur, { now: NOW }).scenario.holdings).toEqual(cur.holdings);
    expect('holdings' in migrateScenario(base(), { now: NOW }).scenario).toBe(false);   // no record is not an empty record
  });

  it('keys nobody here has heard of survive at every level', () => {
    const s = base();
    s.futureRoot = { a: [1, { b: 2 }] };
    s.stressTool.futureTool = 7; s.stressTool.settings.futureSetting = 'x';
    s.decisionTool.futureThing = { z: 1 }; s.decisionTool.settings.futureSetting = 'y';
    const out = migrateScenario(s, { now: NOW }).scenario;
    expect(out.futureRoot).toEqual({ a: [1, { b: 2 }] });
    expect(out.stressTool.futureTool).toBe(7);
    expect(out.stressTool.settings.futureSetting).toBe('x');
    expect(out.decisionTool).toEqual(s.decisionTool);
  });

  it('a plan with almost nothing in it is stamped and not invented', () => {
    const out = migrateScenario({ planDetails: { name: 'Bare' } }, { now: NOW });
    expect(out.error).toBeNull();
    expect(Object.keys(out.scenario).sort()).toEqual(['planDetails', 'schemaVersion', 'strategy']);
    for (const junk of [null, undefined, 'x', 7, []]) {
      const m = migrateScenario(junk, { now: NOW });
      expect(m.scenario).toBe(junk); expect(m.changed).toBe(false); expect(m.error).toBeNull();
    }
  });

  it('values that are not plain data (a Firestore Timestamp, a Date) are carried, not flattened', () => {
    class Stamp { constructor(s) { this.seconds = s; } }
    const s = base(); s.serverTime = new Stamp(5); s.when = new Date(0);
    const out = migrateScenario(s, { now: NOW }).scenario;
    expect(out.serverTime).toBe(s.serverTime);
    expect(out.when).toBe(s.when);
  });
});

describe('a step that fails or breaks a rule leaves the plan exactly as it was', () => {
  const locked = () => normalised('03-gilt-ladder-runup.json');
  const draft = () => normalised('02-pnv-draft.json');
  const run = (input, up) => migrateScenario(input, { now: NOW, target: 1, migrations: [{ to: 1, name: 'bad', up }] });
  const untouched = (input, m, before) => {
    expect(m.error).toBeInstanceOf(Error);
    expect(m.changed).toBe(false);
    expect(m.scenario).toBe(input);             // the ORIGINAL object
    expect(m.to).toBe(m.from);
    expect(JSON.stringify(input)).toBe(before); // and nothing in it was altered on the way
    expect('schemaVersion' in input).toBe(false);
  };

  it('a step that throws — even after it has started changing things', () => {
    const input = locked(); const before = JSON.stringify(input);
    const m = run(input, (s) => { s.stressTool.settings.equityMin = -1; delete s.planDocument; s.decisionTool.history.length = 0; throw new Error('boom'); });
    untouched(input, m, before);
    expect(m.error.message).toBe('boom');
  });

  it('a throw in a later step abandons the earlier steps too', () => {
    const input = draft(); const before = JSON.stringify(input);
    const m = migrateScenario(input, { now: NOW, target: 2, migrations: [MIGRATIONS[0], { to: 2, name: 'bad', up: () => { throw new Error('second'); } }] });
    untouched(input, m, before);
  });

  it('a step that changes the plan document, its archive, the plan of record or the history', () => {
    for (const up of [
      (s) => { s.planDocument.planName = 'rewritten'; },
      (s) => { s.planDocumentArchive = []; },
      (s) => { s.decisionTool.planOfRecord = { savedAt: 'x' }; },
      (s) => { s.decisionTool.planOfRecordArchive = [{}]; },
      (s) => { s.decisionTool.history[0].equity += 1; },
      (s) => { s.decisionTool.history = s.decisionTool.history.slice(1); }
    ]) { const input = locked(); const before = JSON.stringify(input); untouched(input, run(input, up), before); }
  });

  it('a step that adds, renames or removes ANY key in the Decision settings of a locked plan, or one with records', () => {
    for (const up of [
      (s) => { s.decisionTool.settings.newKey = 1; },
      (s) => { delete s.decisionTool.settings.baseSalary; },
      (s) => { s.decisionTool.settings.schemaVersion = 1; }
    ]) { const input = locked(); const before = JSON.stringify(input); untouched(input, run(input, up), before); }
    // not locked, but a month has been recorded against it
    const withHistory = draft(); withHistory.decisionTool.history = [{ date: '2026-09', equity: 1 }];
    untouched(withHistory, run(withHistory, (s) => { s.decisionTool.settings.newKey = 1; }), JSON.stringify(withHistory));
    // not locked, no months, but a tax year has been set up
    const withYear = draft(); withYear.decisionTool.taxYears = { '26/27': { yearSetupComplete: true } };
    untouched(withYear, run(withYear, (s) => { s.decisionTool.settings.newKey = 1; }), JSON.stringify(withYear));
    // a draft with nothing recorded MAY have its Decision settings patched by a future step
    const free = draft();
    const ok = run(free, (s) => { s.decisionTool.settings.newKey = 1; });
    expect(ok.error).toBeNull();
    expect(ok.scenario.decisionTool.settings.newKey).toBe(1);
  });

  it('a step that drops a root key, or rebuilds the plan from a fixed list', () => {
    const a = locked(); untouched(a, run(a, (s) => { delete s.journey; }), JSON.stringify(a));
    const b = draft(); untouched(b, run(b, (s) => ({ planDetails: s.planDetails, decisionTool: s.decisionTool, stressTool: s.stressTool })), JSON.stringify(b));
    const c = draft(); untouched(c, run(c, () => null), JSON.stringify(c));
  });

  it('a chain with a gap, or one that stops short of the target', () => {
    const a = draft(); untouched(a, migrateScenario(a, { now: NOW, target: 3, migrations: [MIGRATIONS[0], { to: 3, name: 'gap', up: (s) => s }] }), JSON.stringify(a));
    const b = draft(); untouched(b, migrateScenario(b, { now: NOW, target: SCHEMA_VERSION + 1 }), JSON.stringify(b));
  });

  it('upgradeScenario never asks for a write when the chain failed', () => {
    const orig = MIGRATIONS[0].up;
    MIGRATIONS[0].up = () => { throw new Error('boom'); };
    try {
      const raw = load('08-dotted-keys.json');   // needs normalising too — still no write
      const u = upgradeScenario(raw, { now: NOW });
      expect(u.error).toBeInstanceOf(Error);
      expect(u.write).toBe(false);
      expect(u.scenario).toEqual(normalizeScenario(raw).scenario);   // opened as it is
    } finally { MIGRATIONS[0].up = orig; }
  });
});

describe('a plan newer than this code', () => {
  it('is handed back untouched, flagged, with no write asked for', () => {
    const s = { ...normalised('02-pnv-draft.json'), schemaVersion: SCHEMA_VERSION + 1, shapeFromTheFuture: { x: 1 } };
    const before = JSON.stringify(s);
    const m = migrateScenario(s, { now: NOW });
    expect(m.newer).toBe(true);
    expect(m.changed).toBe(false);
    expect(m.error).toBeNull();
    expect(m.scenario).toBe(s);
    expect(m.from).toBe(SCHEMA_VERSION + 1);
    expect(JSON.stringify(s)).toBe(before);
    const u = upgradeScenario({ ...s, 'planDetails.name': 'phantom' }, { now: NOW });
    expect(u.newer).toBe(true);
    expect(u.write).toBe(false);   // not even the normalise repair: an old tab writes nothing to a newer plan
  });
});

describe('longer chains (the shape V7 will use)', () => {
  it('a plan at version 1 runs only the steps above it, in order', () => {
    const calls = [];
    const chain = [
      { to: 1, name: 'one', up: (s) => { calls.push(1); s.a = 1; } },
      { to: 2, name: 'two', up: (s) => { calls.push(2); s.b = (s.a || 0) + 1; } },
      { to: 3, name: 'three', up: (s) => { calls.push(3); return { ...s, c: 3 }; } }
    ];
    const from0 = migrateScenario({ planDetails: {} }, { now: NOW, migrations: chain, target: 3 });
    expect(calls).toEqual([1, 2, 3]);
    expect(from0.scenario).toEqual({ planDetails: {}, a: 1, b: 2, c: 3, schemaVersion: 3 });
    calls.length = 0;
    const from1 = migrateScenario({ planDetails: {}, schemaVersion: 1 }, { now: NOW, migrations: chain, target: 3 });
    expect(calls).toEqual([2, 3]);
    expect(from1.from).toBe(1); expect(from1.to).toBe(3);
    expect(from1.scenario).toEqual({ planDetails: {}, schemaVersion: 3, b: 1, c: 3 });
  });
});
