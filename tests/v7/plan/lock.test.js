/**
 * "Lock the plan" in V7 (research/v7/road-to-7.md step 6): the pure reader and the three writers of answers/plan/lock.js.
 *  - lockPatch on every unlocked corpus plan: exactly the declared paths (LOCK_WRITES); the plan read back is locked at the
 *    stage the planner would give it; the Decision settings written equal the planner's seed (PlanCommit.seedDecisionFromStress,
 *    the same function the repository re-exports) with the lock's flags; the plan of record equals PlanLock.buildPlanOfRecord
 *    on the same settings; the document is plain data (no undefined, no function, no Date, no NaN); the journey gains the
 *    stage change; Undo is byte for byte; a second lock is refused;
 *  - unlockPatch on every locked corpus plan: the flags, the two archives (ten kept at most), the defaults of unlockPatchesOf,
 *    exactly the declared paths (UNLOCK_WRITES); the guard allows it, and refuses the same patch with any other setting;
 *  - documentPatch: the document only (DOCUMENT_WRITES), the old one archived with its date, the note the planner sets;
 *  - the seed never produces a key outside DECISION_SEED_KEYS (fast-check over random Stress and Decision settings);
 *  - isLockReversal: the exact reverse and nothing else;
 *  - the lock step, the "Where you are" comparison line and the four sentences of "Your plan as locked" (read.js).
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { lockPatch, unlockPatch, documentPatch, applyPatch, isLockReversal, shapeRefsOf, LOCKED_BY, ARCHIVE_KEEP, NOTE_REFRESHED, NOTE_CREATED } from '../../../src/answers/plan/lock.js';
import { runForDocument } from '../../../src/answers/plan/lastsRun.js';
import { LOCK_WRITES, UNLOCK_WRITES, DOCUMENT_WRITES, DECISION_SEED_KEYS, LOCK_FLAG_WRITES, ALL_WRITES, BOOKKEEPING_WRITES } from '../../../src/answers/plan/schema.js';
import { planPage } from '../../../src/answers/plan/read.js';
import { parse, format, screenName } from '../../../src/v7/router/routes.js';
import { planStage, effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { seedDecisionFromStress, unlockPatchesOf, planOfRecordFor, getDefaultDecisionSettings, decisionSettingsChecksum } from '../../../src/services/PlanCommit.js';
import * as Repo from '../../../src/storage/ScenarioRepository.js';
import * as DecisionRepo from '../../../src/storage/DecisionRepository.js';
import { buildPlanOfRecord, PLAN_OF_RECORD_CPI } from '../../../src/services/PlanLock.js';
import { lockedPlanWriteRefusal, isLockedSettings, isUnlock } from '../../../src/services/LockedPlanGuard.js';
import { getDefaultStressSettings } from '../../../src/storage/stressDefaults.js';
import { deriveStage, journeyAppend } from '../../../src/services/LifeStage.js';
import { PLAN_DOCUMENT_VERSION } from '../../../src/services/PlanDocument.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { LOCK } from '../../../src/v7/copy/lock.js';
import { corpus, entriesAt, entryOf, TODAY, DATES, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const isLocked = (p) => !!(p.decisionTool && p.decisionTool.settings && p.decisionTool.settings.locked);
const UNLOCKED = Object.values(C).filter((p) => !isLocked(p));
const LOCKED = Object.values(C).filter((p) => isLocked(p));
const copy = (v) => JSON.parse(JSON.stringify(v));

/** The run every lock test shares, once per plan (about half a second each). */
const runs = new Map();
const runOf = (plan) => { const k = String(plan.id); if (!runs.has(k)) runs.set(k, runForDocument(plan, { today: TODAY })); return runs.get(k); };

/** Firestore's rules for a value (seedProblems-style): no undefined, no function, no Date, no NaN or Infinity, anywhere. */
function plainProblems(v, at = '', out = []) {
  if (v === undefined) out.push(at + ': undefined');
  else if (typeof v === 'function') out.push(at + ': a function');
  else if (v instanceof Date) out.push(at + ': a Date');
  else if (typeof v === 'number' && !Number.isFinite(v)) out.push(at + ': ' + String(v));
  else if (Array.isArray(v)) v.forEach((x, i) => plainProblems(x, at + '[' + i + ']', out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) plainProblems(x, at + '.' + k, out);
  return out;
}

describe('the lifted functions are the repositories\' own, by the same names', () => {
  it('ScenarioRepository and DecisionRepository re-export PlanCommit\'s functions, the very same objects', () => {
    expect(Repo.seedDecisionFromStress).toBe(seedDecisionFromStress);
    expect(Repo.unlockPatchesOf).toBe(unlockPatchesOf);
    expect(Repo.getDefaultDecisionSettings).toBe(getDefaultDecisionSettings);
    expect(DecisionRepo.decisionSettingsChecksum).toBe(decisionSettingsChecksum);
    expect(PLAN_OF_RECORD_CPI).toBe(0.04);
  });
  it('PlanLock.buildPlanOfRecord delegates to planOfRecordFor: the same record but the clock', async () => {
    const plan = entryOf(C['04-buckets-running']).plan;
    const s = plan.decisionTool.settings;
    const theirs = await buildPlanOfRecord(s);
    const mine = planOfRecordFor(s, now);
    const bar = (o) => { const { savedAt, ...rest } = o; return rest; };
    expect(bar(mine)).toEqual(bar(theirs));
    expect(mine.savedAt).toBe(now.toISOString());
    expect(theirs.savedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('the declared paths', () => {
  it('LOCK_WRITES is the seed\'s keys under decisionTool.settings, the three flags, the plan of record, the document and the journey; no path twice; all in ALL_WRITES', () => {
    expect(LOCK_WRITES.length).toBe(DECISION_SEED_KEYS.length + 3 + 3);
    expect(new Set(LOCK_WRITES).size).toBe(LOCK_WRITES.length);
    expect(LOCK_FLAG_WRITES).toEqual(['decisionTool.settings.locked', 'decisionTool.settings.lockedAt', 'decisionTool.settings.lockedBy']);
    for (const k of [...LOCK_WRITES, ...UNLOCK_WRITES, ...DOCUMENT_WRITES]) expect(ALL_WRITES).toContain(k);
    expect(DECISION_SEED_KEYS).toEqual([...DECISION_SEED_KEYS].sort());
    expect(new Set(DECISION_SEED_KEYS).size).toBe(DECISION_SEED_KEYS.length);
    expect(new Set(ALL_WRITES).size).toBe(ALL_WRITES.length);
  });
  it('the seed never produces a key outside DECISION_SEED_KEYS: random Stress settings over random Decision settings (fast-check), and every default key is listed', () => {
    for (const k of Object.keys(getDefaultDecisionSettings())) expect(DECISION_SEED_KEYS, k).toContain(k);
    // the keys the seed reads as a list or a map keep their shape (the planner's own seed maps over them); every other key takes any value
    const LISTS = ['taggedFunds', 'incomeSteps', 'windfalls'];
    const MAPS = ['strategyParams'];
    const scalar = fc.oneof(fc.integer({ min: -5, max: 500000 }), fc.boolean(), fc.constant(null), fc.string({ maxLength: 8 }), fc.array(fc.integer({ min: 0, max: 100 }), { maxLength: 3 }));
    // a date is a date or nothing (the planner's own deriveTiming reads it as text); an age is a number or nothing
    const DATES_ = ['spStartDate'];
    const AGES = ['currentAge', 'retireAge', 'shapeAgeNow'];
    const plainKeys = [...DECISION_SEED_KEYS.filter((k) => !LISTS.includes(k) && !MAPS.includes(k) && !DATES_.includes(k) && !AGES.includes(k)), 'retired', 'protectionMult', 'targetSchedule', 'cadence', 'unknownKey', 'extraIncomes'];
    const settings = fc.tuple(
      fc.dictionary(fc.constantFrom(...plainKeys), scalar),
      fc.dictionary(fc.constantFrom(...DATES_), fc.constantFrom(null, '', '2031-03-12', '2029-11-02')),
      fc.dictionary(fc.constantFrom(...AGES), fc.oneof(fc.constant(null), fc.integer({ min: 18, max: 90 }))),
      fc.dictionary(fc.constantFrom(...LISTS), fc.oneof(fc.constant(undefined), fc.array(fc.record({ name: fc.string({ maxLength: 4 }), value: fc.integer({ min: 0, max: 1000 }) }), { maxLength: 2 }))),
      fc.dictionary(fc.constantFrom(...MAPS), fc.oneof(fc.constant(undefined), fc.record({ cashYears: fc.integer({ min: 1, max: 5 }) })))
    ).map(([a, d, g, b, c]) => ({ ...a, ...d, ...g, ...Object.fromEntries(Object.entries(b).filter(([, v]) => v !== undefined)), ...Object.fromEntries(Object.entries(c).filter(([, v]) => v !== undefined)) }));
    fc.assert(fc.property(settings, settings, (stress, decision) => {
      const seeded = seedDecisionFromStress(stress, decision);
      for (const k of Object.keys(seeded)) if (JSON.stringify(seeded[k]) !== JSON.stringify(decision[k])) expect(DECISION_SEED_KEYS, 'the seed changed "' + k + '"').toContain(k);
    }), { numRuns: 300 });
    // the stress settings of every corpus plan, over its own decision settings
    for (const raw of Object.values(C)) {
      const plan = entryOf(raw).plan;
      const seeded = seedDecisionFromStress(effectiveStressSettings(plan, { now }), plan.decisionTool.settings || {});
      for (const k of Object.keys(seeded)) if (JSON.stringify(seeded[k]) !== JSON.stringify((plan.decisionTool.settings || {})[k])) expect(DECISION_SEED_KEYS, raw.id + ' ' + k).toContain(k);
    }
  });
});

describe('lockPatch on every unlocked corpus plan: the planner\'s commitPlanLock, field for field, in one patch', { timeout: 120_000 }, () => {
  for (const raw of UNLOCKED) {
    it(`${raw.id}`, () => {
      const plan = entryOf(raw).plan;
      const run = runOf(plan);
      const P = lockPatch(plan, { now, run, entries: [{ plan }] });
      expect(P.ok).toBe(true);
      expect(P.errors).toEqual({});
      // exactly the declared paths; a previous value for every path
      for (const k of Object.keys(P.patch)) expect(LOCK_WRITES, k).toContain(k);
      expect(Object.keys(P.previous).sort()).toEqual(Object.keys(P.patch).sort());
      for (const k of LOCK_FLAG_WRITES) expect(P.patch, k).toHaveProperty(k);
      expect(P.patch['decisionTool.settings.locked']).toBe(true);
      expect(P.patch['decisionTool.settings.lockedAt']).toBe(now.toISOString());
      expect(P.patch['decisionTool.settings.lockedBy']).toBe(LOCKED_BY);
      expect(P.lockedAt).toBe(now.toISOString());
      expect(P.line).toEqual({ id: 'locked', slots: { date: '2 October 2026' } });
      // the plan read back: locked, at the stage the planner derives, with a document
      const after = applyPatch(plan, P.patch);
      expect(isLockedSettings(after.decisionTool.settings)).toBe(true);
      const stage = planStage(after, { now });
      expect(stage.locked).toBe(true);
      expect(['committed-saving', 'bridge', 'running']).toContain(stage.key);
      expect(stage.hasDocument).toBe(true);
      // the Decision settings written are the planner's seed with the flags (an undefined of the seed leaves the key as it was)
      const ds = plan.decisionTool.settings || {};
      const seeded = seedDecisionFromStress(effectiveStressSettings(plan, { now }), ds);
      const want = copy({ ...ds, ...Object.fromEntries(Object.entries(seeded).filter(([, v]) => v !== undefined)), locked: true, lockedAt: now.toISOString(), lockedBy: LOCKED_BY });
      expect(after.decisionTool.settings).toEqual(want);
      // the plan of record: the planner's own builder on the same settings (the seed, before the flags), to the byte
      if (!(plan.decisionTool && plan.decisionTool.planOfRecord)) {
        const por = P.patch['decisionTool.planOfRecord'];
        expect(por).toEqual(planOfRecordFor({ ...ds, ...seeded }, now));
        expect(por.settingsChecksum).toBe(decisionSettingsChecksum(after.decisionTool.settings));   // the lock's flags never move the checksum
        expect(por.savedAt).toBe(now.toISOString());
        expect(por.drawdown.length).toBeGreaterThan(0);
      }
      // the document: version 3, dated by the same clock, locked by the preview, plain data, its journey the plan's as it was
      const doc = P.patch.planDocument;
      expect(doc.version).toBe(PLAN_DOCUMENT_VERSION);
      expect(doc.createdAt).toBe(now.toISOString());
      expect(doc.lockedAt).toBe(now.toISOString());
      expect(doc.lockedBy).toBe(LOCKED_BY);
      expect(doc.note).toBeUndefined();
      expect(doc.planName).toBe(plan.planDetails.name || 'My plan');
      expect(doc.strategy.id).toBe(run.r.strategyId || effectiveStressSettings(plan, { now }).strategyId || 'pots-and-valves');
      expect(doc.strategy.r.samples).toBeUndefined();
      expect(doc.strategy.p.pnvCfg).toBeUndefined();
      expect(doc.journey.length).toBe(Array.isArray(plan.journey) ? plan.journey.length : 0);
      expect(plainProblems(doc)).toEqual([]);
      expect(plainProblems(P.patch)).toEqual([]);
      expect(JSON.parse(JSON.stringify(P.patch))).toEqual(P.patch);
      // the journey: the stage change the lock causes, dated by the same clock (the planner's journeyAppend)
      const before = Array.isArray(plan.journey) ? plan.journey : [];
      const expected = journeyAppend(before, deriveStage({ ...after, stressTool: { ...after.stressTool, settings: effectiveStressSettings(after, { now }) } }, now), now);
      if (expected !== before) { expect(P.patch.journey).toEqual(expected); expect(after.journey[after.journey.length - 1].at).toBe(now.toISOString()); }
      else expect('journey' in P.patch).toBe(false);
      // the guard lets the lock through (an unlocked plan), Undo is byte for byte, a second lock is refused
      expect(lockedPlanWriteRefusal(plan, P.patch, getDefaultStressSettings())).toBe(null);
      expect(JSON.stringify(applyPatch(after, P.previous))).toBe(JSON.stringify(plan));
      expect(lockPatch(after, { now, run, entries: [] })).toMatchObject({ ok: false, errors: { plan: 'locked' }, patch: {} });
      // a reversal and nothing else
      const back = Object.fromEntries(Object.entries(P.previous).map(([k, v]) => [k, v === undefined ? null : v]));
      expect(isLockReversal(after, back, P.lockedAt)).toBe(true);
      expect(isLockReversal(after, back, '2026-10-03T00:00:00.000Z')).toBe(false);
      expect(isLockReversal(plan, back, P.lockedAt)).toBe(false);
      expect(isLockReversal(after, { ...back, 'stressTool.settings.duration': 30 }, P.lockedAt)).toBe(false);
      expect(isLockReversal(after, { ...back, 'decisionTool.settings.locked': true }, P.lockedAt)).toBe(false);
      expect(isLockReversal(after, { ...back, planDocument: doc }, P.lockedAt)).toBe(false);
      const elsewhere = applyPatch(after, { 'decisionTool.settings.lockedBy': 'locked from Stress settings' });
      expect(isLockReversal(elsewhere, back, P.lockedAt)).toBe(false);
    });
  }
  it('a bad run is refused; a plan with a plan of record keeps it (the planner writes one only when there is none)', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    expect(lockPatch(plan, { now, run: null, entries: [] })).toMatchObject({ ok: false, errors: { plan: 'noRun' } });
    expect(lockPatch(plan, { now, run: { p: null, r: {} }, entries: [] })).toMatchObject({ ok: false, errors: { plan: 'noRun' } });
    const withPor = copy(plan);
    withPor.decisionTool.planOfRecord = { savedAt: '2026-01-01T00:00:00.000Z', drawdown: [], glidepath: [] };
    const P = lockPatch(withPor, { now, run: runOf(plan), entries: [] });
    expect(P.ok).toBe(true);
    expect('decisionTool.planOfRecord' in P.patch).toBe(false);
  });
  it('the budget\'s figures reach the document as the planner\'s _shapeRefs make them: only with a line above zero; the household\'s shared budget read as the partner\'s lines', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    expect(shapeRefsOf(plan, [])).toEqual({ essentials: 0, budgetGross: 0 });
    const withBudget = copy(plan);
    withBudget.budgetTool.settings = { ...withBudget.budgetTool.settings, lines: [{ id: 'l1', heading: 'Home', label: 'Rent', annual: 30000, tier: 'essential' }, { id: 'l2', heading: 'Fun', label: 'Holidays', annual: 3000, tier: 'discretionary' }] };
    const refs = shapeRefsOf(withBudget, []);
    expect(refs.essentials).toBeGreaterThan(30000);   // grossed up through the planner's own tax sum (BudgetModel.grossUpAnnual)
    expect(refs.budgetGross).toBeGreaterThan(refs.essentials);
    const P = lockPatch(withBudget, { now, run: runOf(plan), entries: [] });
    expect(P.patch.planDocument.layers.essentials).toBe(refs.essentials);
    expect(P.patch.planDocument.layers.budgetGross).toBe(refs.budgetGross);
    // shared from a partner (ScenarioRepository.getActiveBudget): the partner's lines, this plan's own side of who pays —
    // paying all of it, the partner's figures; paying half (the planner's default: 100 less the partner's share), half of them
    const partner = copy(withBudget); partner.id = 'PartnerPlan01';
    const sharer = copy(plan); sharer.budgetTool.sharedFrom = 'PartnerPlan01';
    const half = shapeRefsOf(sharer, [{ plan: partner }, { plan: sharer }]);
    expect(half.essentials).toBeGreaterThan(0);
    expect(half.essentials).toBeLessThan(refs.essentials);
    const all = copy(sharer); all.budgetTool.settings = { ...all.budgetTool.settings, mySharePct: 100 };
    expect(shapeRefsOf(all, [{ plan: partner }, { plan: all }])).toEqual(refs);
    expect(shapeRefsOf(sharer, [{ plan: sharer }])).toEqual({ essentials: 0, budgetGross: 0 });
  });
});

describe('unlockPatch on every locked corpus plan: the planner\'s unlockPlan, field for field, plus the defaults an unlock gives', () => {
  for (const raw of LOCKED) {
    it(`${raw.id}`, () => {
      const plan = entryOf(raw).plan;
      const at = new Date(2026, 9, 3, 12);
      const U = unlockPatch(plan, { now: at });
      expect(U.ok).toBe(true);
      for (const k of Object.keys(U.patch)) expect(UNLOCK_WRITES, k).toContain(k);
      expect(Object.keys(U.previous).sort()).toEqual(Object.keys(U.patch).sort());
      expect(U.patch['decisionTool.settings.locked']).toBe(false);
      expect(U.patch['decisionTool.settings.unlockedAt']).toBe(at.toISOString());
      expect(U.patch['decisionTool.settings.unlockCount']).toBe((+plan.decisionTool.settings.unlockCount || 0) + 1);
      expect(U.patch.planDocument).toBe(null);
      expect(U.patch['decisionTool.planOfRecord']).toBe(null);
      // the archives: the last nine kept and the current one dated (the repository's slice(-9) + push)
      const docs = Array.isArray(plan.planDocumentArchive) ? plan.planDocumentArchive : [];
      expect(U.patch.planDocumentArchive.length).toBe(Math.min(docs.length, ARCHIVE_KEEP - 1) + (plan.planDocument ? 1 : 0));
      if (plan.planDocument) expect(U.patch.planDocumentArchive[U.patch.planDocumentArchive.length - 1]).toEqual({ ...plan.planDocument, archivedAt: at.toISOString() });
      const pors = Array.isArray(plan.decisionTool.planOfRecordArchive) ? plan.decisionTool.planOfRecordArchive : [];
      expect(U.patch['decisionTool.planOfRecordArchive'].length).toBe(Math.min(pors.length, ARCHIVE_KEEP - 1) + (plan.decisionTool.planOfRecord ? 1 : 0));
      // the defaults of unlockPatchesOf, exactly, on the settings the planner's loader reads
      const defaults = unlockPatchesOf(effectiveStressSettings(plan, { now: at })) || {};
      for (const [k, v] of Object.entries(defaults)) expect(U.patch['stressTool.settings.' + k]).toBe(v);
      for (const k of ['chargesPct', 'isaGrowth']) if (!(k in defaults)) expect('stressTool.settings.' + k in U.patch).toBe(false);
      // the guard allows the unlock as one write, and refuses it with any other setting riding along
      expect(lockedPlanWriteRefusal(plan, U.patch, getDefaultStressSettings())).toBe(null);
      const duration = (+effectiveStressSettings(plan, { now: at }).duration || 35) + 1;
      expect(lockedPlanWriteRefusal(plan, { ...U.patch, 'stressTool.settings.duration': duration }, getDefaultStressSettings())).toEqual(['stress.duration']);
      expect(lockedPlanWriteRefusal(plan, { ...U.patch, 'decisionTool.settings.baseSalary': 1 }, getDefaultStressSettings())).toEqual(['decision.baseSalary']);
      expect(lockedPlanWriteRefusal(plan, { ...U.patch, 'stressTool.settings.chargesPct': 2 }, getDefaultStressSettings())).toEqual(['stress.chargesPct']);
      // without the unlock, the defaults alone are refused on a locked plan
      if (Object.keys(defaults).length) expect(lockedPlanWriteRefusal(plan, Object.fromEntries(Object.entries(defaults).map(([k, v]) => ['stressTool.settings.' + k, v])), getDefaultStressSettings())).not.toBe(null);
      // the plan read back: unlocked, a draft again; Undo byte for byte
      const after = applyPatch(plan, U.patch);
      expect(isLockedSettings(after.decisionTool.settings)).toBe(false);
      expect(isUnlock(plan.decisionTool.settings, after.decisionTool.settings)).toBe(true);
      expect(['saving', 'approaching', 'draft-retired', 'unknown']).toContain(planStage(after, { now: at }).key);
      expect(JSON.stringify(applyPatch(after, U.previous))).toBe(JSON.stringify(plan));
      expect(plainProblems(U.patch)).toEqual([]);
      expect(unlockPatch(after, { now: at })).toMatchObject({ ok: false, errors: { plan: 'notLocked' } });
    });
  }
  it('ten versions kept at most: an archive of twelve keeps the last nine and the current one', () => {
    const plan = entryOf(C['04-buckets-running']).plan;
    const full = copy(plan);
    full.planDocumentArchive = Array.from({ length: 12 }, (_, i) => ({ ...plan.planDocument, createdAt: '2025-0' + ((i % 9) + 1) + '-01T00:00:00.000Z', i, archivedAt: '2025-12-01T00:00:00.000Z' }));
    const U = unlockPatch(full, { now });
    expect(U.patch.planDocumentArchive.length).toBe(ARCHIVE_KEEP);
    expect(U.patch.planDocumentArchive.slice(0, 9).map((d) => d.i)).toEqual([3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(U.patch.planDocumentArchive[9].archivedAt).toBe(now.toISOString());
  });
});

describe('documentPatch: a new version from today\'s settings, the document only', { timeout: 60_000 }, () => {
  it('on a locked plan with a document (04): the old one archived with its date, the new one with the planner\'s note, nothing else written', () => {
    const plan = entryOf(C['04-buckets-running']).plan;
    const at = new Date(2026, 9, 3, 12);
    const D = documentPatch(plan, { now: at, run: runOf(plan), entries: [{ plan }] });
    expect(D.ok).toBe(true);
    expect(Object.keys(D.patch).sort()).toEqual([...DOCUMENT_WRITES].sort());
    expect(D.patch.planDocumentArchive[D.patch.planDocumentArchive.length - 1]).toEqual({ ...plan.planDocument, archivedAt: at.toISOString() });
    const doc = D.patch.planDocument;
    expect(doc.note).toBe(NOTE_REFRESHED);
    expect(doc.lockedAt).toBe(plan.decisionTool.settings.lockedAt);
    expect(doc.lockedBy).toBe(plan.decisionTool.settings.lockedBy);
    expect(doc.createdAt).toBe(at.toISOString());
    expect(doc.journey.length).toBe(plan.journey.length);
    expect(plainProblems(doc)).toEqual([]);
    const after = applyPatch(plan, D.patch);
    expect(after.decisionTool.settings).toEqual(plan.decisionTool.settings);
    expect(after.decisionTool.planOfRecord).toEqual(plan.decisionTool.planOfRecord);
    expect(after.stressTool).toEqual(plan.stressTool);
    expect(lockedPlanWriteRefusal(plan, D.patch, getDefaultStressSettings())).toBe(null);
    expect(JSON.stringify(applyPatch(after, D.previous))).toBe(JSON.stringify(plan));
    expect(D.line.id).toBe('newVersion');
  });
  it('on a plan locked before documents existed (06): the first document, no archive, the planner\'s "created after lock" note', () => {
    const plan = entryOf(C['06-pre-6.4-no-timing']).plan;
    expect(plan.planDocument).toBeFalsy();
    const D = documentPatch(plan, { now, run: runOf(plan), entries: [{ plan }] });
    expect(D.ok).toBe(true);
    expect(Object.keys(D.patch)).toEqual(['planDocument']);
    expect(D.patch.planDocument.note).toBe(NOTE_CREATED);
    expect(D.line.id).toBe('firstVersion');
    expect(D.previous).toEqual({ planDocument: undefined });
  });
  it('refused on an unlocked plan, and without a run', () => {
    const plan = entryOf(C['02-pnv-draft']).plan;
    expect(documentPatch(plan, { now, run: runOf(plan), entries: [] })).toMatchObject({ ok: false, errors: { plan: 'notLocked' } });
    expect(documentPatch(entryOf(C['04-buckets-running']).plan, { now, run: null, entries: [] })).toMatchObject({ ok: false, errors: { plan: 'noRun' } });
  });
});

describe('property: over random unlocked plans, a lock writes only declared paths and reverses byte for byte; the three writes never meet an undeclared path', { timeout: 120_000 }, () => {
  it('fast-check over the corpus with random names, journeys and plan-of-record states', () => {
    const base = UNLOCKED.map((raw) => entryOf(raw).plan);
    const arb = fc.record({
      i: fc.integer({ min: 0, max: base.length - 1 }),
      name: fc.string({ minLength: 0, maxLength: 12 }),
      journey: fc.constantFrom(undefined, [], [{ stage: 'saving', label: 'Saving', at: '2025-01-01T00:00:00.000Z' }]),
      por: fc.boolean()
    });
    fc.assert(fc.property(arb, ({ i, name, journey, por }) => {
      const plan = copy(base[i]);
      plan.planDetails = { ...(plan.planDetails || {}), name };
      if (journey === undefined) delete plan.journey; else plan.journey = journey;
      if (por) plan.decisionTool.planOfRecord = { savedAt: '2026-01-01T00:00:00.000Z', drawdown: [], glidepath: [] }; else delete plan.decisionTool.planOfRecord;
      const P = lockPatch(plan, { now, run: runOf(base[i]), entries: [{ plan }] });
      expect(P.ok).toBe(true);
      for (const k of Object.keys(P.patch)) expect(LOCK_WRITES).toContain(k);
      expect('decisionTool.planOfRecord' in P.patch).toBe(!por);
      expect(P.patch.planDocument.planName).toBe(name || 'My plan');
      const after = applyPatch(plan, P.patch);
      expect(JSON.stringify(applyPatch(after, P.previous))).toBe(JSON.stringify(plan));
      const U = unlockPatch(after, { now });
      for (const k of Object.keys(U.patch)) expect(UNLOCK_WRITES).toContain(k);
      const D = documentPatch(after, { now, run: runOf(base[i]), entries: [] });
      for (const k of Object.keys(D.patch)) expect(DOCUMENT_WRITES).toContain(k);
      for (const k of [...Object.keys(P.patch), ...Object.keys(U.patch), ...Object.keys(D.patch)]) expect(ALL_WRITES).toContain(k);
      expect(BOOKKEEPING_WRITES).toEqual(['lastModified']);
    }), { numRuns: 40 });
  });
});

describe('the lock step, the address and the plan page (read.js)', () => {
  it('the lock step is its own screen: #/plan/<id>/lock parses, formats and names plan.lock', () => {
    const r = parse('#/plan/abc/lock');
    expect(r).toEqual({ screen: 'plan', q: null, step: 'lock', planId: 'abc', focus: null });
    expect(format(r)).toBe('#/plan/abc/lock');
    expect(screenName(r)).toBe('plan.lock');
    expect(screenName(parse('#/plan/abc/plan'))).toBe('plan');
  });
  for (const today of DATES) {
    it(`at ${today}: an unlocked plan's lock step says not locked, a saver's says so, the way of drawing is named; a locked plan's says locked and links to "Your plan as locked"`, () => {
      const entries = entriesAt(today);
      for (const e of entries) {
        const pg = planPage(entries, e.plan.id, 'lock', { today });
        const step = pg.steps.find((s) => s.id === 'lock');
        expect(step, e.plan.id).toBeTruthy();
        expect(PLAN.strategies[step.strategyId] || step.strategyId).toBeTypeOf('string');
        if (pg.locked) {
          expect(step.locked).toBe(true);
          expect(step.result.text).toMatch(/^Locked \d+ \w+ \d{4}$/);
          expect(step.buttons).toEqual([{ id: 'seeLocked', href: '#/plan/' + e.plan.id + '/plan', slots: {} }]);
          expect(step.listed).toBe(false);
          expect(step.done).toBe(true);
        } else {
          expect(step.locked).toBe(false);
          expect(step.result.text).toBe('Not locked');
          expect(step.buttons).toEqual([]);
          expect(step.notes).toEqual(pg.saver ? ['lock.what', 'lock.saver'] : ['lock.what']);
          expect(step.saver).toBe(pg.saver);
          expect(step.listed).toBe(pg.stageKey !== 'unknown');
        }
        for (const n of step.notes) expect(PLAN.notes[n], n).toBeTypeOf('string');
      }
      expect(PLAN.buttons.seeLocked).toBe('Your plan as locked');
      expect(PLAN.buttons.lockIt).toBeUndefined();
    });
  }
  it('"Your plan as locked" opens on the four sentences (03, 04, 05): the steps before and after tax by age, the State Pension, the bad case, the cut rules; a bought strategy says no cuts', () => {
    const entries = entriesAt(TODAY);
    const ids = (plan) => planPage(entries, plan.id, 'plan', { today: TODAY }).steps.find((s) => s.id === 'plan').lines.map((l) => l.id);
    const ladder = entries.find((e) => e.plan.id === C['03-gilt-ladder-runup'].id).plan;
    const buckets = entries.find((e) => e.plan.id === C['04-buckets-running'].id).plan;
    const saver = entries.find((e) => e.plan.id === C['05-saver-committed'].id).plan;
    const L = planPage(entries, ladder.id, 'plan', { today: TODAY }).steps.find((s) => s.id === 'plan');
    expect(L.lines.filter((l) => l.id === 'says.pays').length).toBe(ladder.planDocument.steps.length);
    expect(L.lines[0].id).toBe('says.pays');
    expect(L.lines[0].sentence.text).toMatch(/^From age \d+: £[\d,]+ a year before tax, £[\d,]+ a month after tax \(tax year \d{4}\/\d{2}\)$/);
    expect(ids(ladder).filter((id) => id.startsWith('says.'))).toEqual([...Array(ladder.planDocument.steps.length).fill('says.pays'), 'says.sp', 'says.badContract', 'says.cutsBought']);
    expect(L.lines.find((l) => l.id === 'says.badContract').sentence.text).toMatch(/^Every year is bought by contract, so no future and no start year can run it out\. Left at the end, at today’s prices: typically £[\d,]+; in a bad case \(the worst 1 in 10\) £[\d,]+$/);
    expect(L.lines.find((l) => l.id === 'says.cutsBought').sentence.text).toBe('Income cuts: none. This way of drawing pays the plan in full until it cannot');
    for (const l of L.lines.filter((x) => x.id.startsWith('says.'))) expect(l.source).toMatchObject({ kind: 'locked', at: '1 July 2026' });
    const B = planPage(entries, buckets.id, 'plan', { today: TODAY }).steps.find((s) => s.id === 'plan');
    expect(ids(buckets).filter((id) => id.startsWith('says.'))).toEqual([...Array(buckets.planDocument.steps.length).fill('says.pays'), 'says.sp', 'says.bad', 'says.cuts']);
    expect(B.lines.find((l) => l.id === 'says.bad').sentence.text).toMatch(/^Your plan lasts in .+ futures? out of 10\. Left at the end/);
    expect(B.lines.find((l) => l.id === 'says.cuts').sentence.text).toMatch(/^Income cuts: in a slump, after \d+ months? in a row below the plan’s line, income is cut by \d+% for \d+ months and by \d+% if the slump lasts; the cut ends once the pots are £[\d,]+ above the line again, and missed income is made up later$/);
    const S = planPage(entries, saver.id, 'plan', { today: TODAY }).steps.find((s) => s.id === 'plan');
    expect(S.lines.filter((l) => l.id.startsWith('says.')).length).toBeGreaterThanOrEqual(4);
    expect(S.hasDocument).toBe(true);
    expect(S.documentOn).toMatch(/\d{4}$/);
    expect(Array.isArray(S.unlockDefaults)).toBe(true);
    // an unlocked plan: no sentence of the lock's
    const draft = entries.find((e) => e.plan.id === C['02-pnv-draft'].id).plan;
    expect(ids(draft).some((id) => id.startsWith('says.'))).toBe(false);
    for (const id of ['says.pays', 'says.sp', 'says.spAssumed', 'says.noSp', 'says.bad', 'says.badContract', 'says.cuts', 'says.cutsOff', 'says.cutsBought']) expect(PLAN.lines[id], id).toBe('');
  });
  it('"Where you are" compares like with like (04, running, six months recorded): taken, what the plan said for those months, the difference and its cause', () => {
    const entries = entriesAt(TODAY);
    const buckets = entries.find((e) => e.plan.id === C['04-buckets-running'].id).plan;
    const W = planPage(entries, buckets.id, 'where', { today: TODAY }).steps.find((s) => s.id === 'where');
    const cmp = W.lines.find((l) => /^where\.compare/.test(l.id));
    expect(cmp).toBeTruthy();
    const months = W.figures.months;
    expect(months).toBeGreaterThan(0);
    expect(W.figures.said).toBe(W.figures.planned != null ? Math.round(W.figures.planned / 12) * months : W.figures.said);
    expect(cmp.sentence.text).toMatch(/^£[\d,]+ taken; the plan said £[\d,]+ for (those months|that month); (£[\d,]+ (less because income was cut in .+|less than the plan said|more than the plan said)|the same as the plan said)$/);
    expect(Math.abs(W.figures.drawn - W.figures.said)).toBe(W.figures.diff);
    const cut = buckets.decisionTool.history.filter((h) => h.inProtection === true).length;
    expect(W.figures.cutMonths).toBe(cut);
    if (W.figures.drawn < W.figures.said && cut > 0) expect(cmp.id).toBe('where.compareLessCut');
    else if (W.figures.drawn < W.figures.said) expect(cmp.id).toBe('where.compareLess');
    else if (W.figures.drawn > W.figures.said) expect(cmp.id).toBe('where.compareMore');
    else expect(cmp.id).toBe('where.compareSame');
    expect(cmp.sentence.text).not.toMatch(/to go|countdown/i);
    for (const id of ['where.compareLess', 'where.compareLessCut', 'where.compareMore', 'where.compareSame']) expect(PLAN.lines[id], id).toBe('');
    // a saver's plan (05): the saver's reading, no comparison line
    const saver = entries.find((e) => e.plan.id === C['05-saver-committed'].id).plan;
    const S = planPage(entries, saver.id, 'where', { today: TODAY }).steps.find((s) => s.id === 'where');
    expect(S.lines.some((l) => /^where\.compare/.test(l.id))).toBe(false);
  });
  it('the words: every slot of the lock\'s copy is filled by the screen, the toast lines exist for every write', () => {
    for (const id of ['locked', 'unlocked', 'newVersion', 'firstVersion', 'undone', 'unchanged']) expect(LOCK.toast[id]).toBeTypeOf('string');
    for (const id of ['locked', 'notLocked', 'notHere', 'usedUp', 'nobody', 'storage', 'failed', 'noWorker', 'readonly', 'noRun']) expect(LOCK.problems[id]).toBeTypeOf('string');
    expect(LOCK.buttons.lock).toBe('Lock this plan');
    expect(LOCK.buttons.confirm).toBe('Lock it');
    expect(LOCK.buttons.notNow).toBe('Not now');
    expect(LOCK.unlock.button).toBe('Unlock this plan');
    expect(LOCK.document.button).toBe('Write a new version from today’s settings');
    expect(PLAN.notes['lock.saver']).toBe('You can lock it while you are still saving: the plan then follows your pot each month until you stop.');
    expect(PLAN.page.unlock).not.toMatch(/planner/);
  });
});
