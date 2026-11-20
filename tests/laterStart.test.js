/**
 * No later start (7.4.0; the design's Release B): a retired person's plan starts in the tax year they stopped work, or the
 * tax year they pick it up from — never later. Nobody retired has months before their plan.
 *
 * Covered here:
 *  - the engine defaults: no retiree's DERIVED year 0 is above this tax year, for many timings on every month of several
 *    years (a property test); a plan with no age starts this tax year; the start-year choices end at this tax year;
 *  - a retired draft saved with a later year is READ from the earlier one (PlanMove.laterDraftOf, PlanReading), every figure
 *    counted from year 0 keeping its age and tax year, and WRITTEN only by its next Save (V7: every settings save carries it;
 *    the lock too); opening it writes nothing;
 *  - every plan whose year 0 is the stop's tax year, this one or earlier reads byte for byte as before; savers, closed plans
 *    and the plan that carries a closed one on (the successor carve-out) are left alone;
 *  - the move of a locked plan's start, extended: to this tax year with no month said ("I'm already drawing"), and with the
 *    State Pension's date asked where the plan gives it only as a plan year — each one confirmed write the guard lets
 *    through as exactly that move, and nothing else;
 *  - the plain caveat where a plan draws from a pension before it can usually be taken;
 *  - laterStartEffects, the release note's per-plan lines, on every shape.
 *
 * Every person and figure is fictional (Alex, Sam).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { effectiveStressSettings, laterDraftReading } from '../src/services/PlanReading.js';
import { deriveTiming, taxYearStartOf, taxYearOfMonth, migrateTiming, startYearChoices, pinTiming, earlyPensionDrawOf, earlyPensionDrawWords, ageInTaxYear, timingPinPatch } from '../src/services/PlanTiming.js';
import {
  laterDraftOf, laterStartEffects, startLaterOf, moveOfferOf, moveBlockedOf, planMoveOf, isSuccessorOrClosed, withSpDate, reAnchorCopy, laterDraftSentence, positionAfterMove, spPlanTaxYearOf, withLockedStart
} from '../src/services/PlanMove.js';
import { laterDraftPatch, withLaterDraft } from '../src/answers/plan/moveStart.js';
import { runForDocument } from '../src/answers/plan/lastsRun.js';
import { applyPatch, aboutPatch, lockedStartOf, aboutOf } from '../src/answers/plan/about.js';
import { lockPatch } from '../src/answers/plan/lock.js';
import { splitPatches } from '../src/answers/plan/household.js';
import { homeOf } from '../src/answers/plan/home.js';
import { ALL_WRITES, LOCK_WRITES, LATER_DRAFT_WRITES } from '../src/answers/plan/schema.js';
import { lockedPlanWriteRefusal } from '../src/services/LockedPlanGuard.js';
import { getDefaultStressSettings } from '../src/storage/stressDefaults.js';
import { setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { amountAtAge, defaultSpYear, compileSteps } from '../src/services/IncomeSchedule.js';
import { successorOf } from '../src/services/PlanClose.js';
import { startSummaryHtml } from '../src/ui/startingPotsWords.js';
import { ABOUT } from '../src/v7/copy/about.js';
import { HOME } from '../src/v7/copy/home.js';
import { LASTS } from '../src/v7/copy/lasts.js';
import { bannedHits } from './v7/render/checkScreen.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');
const read = (name) => JSON.parse(readFileSync(join(PLANS, name + '.json'), 'utf8'));
const GILTS = JSON.parse(readFileSync(join(PLANS, 'market', 'gilts.json'), 'utf8'));
const NOW = new Date(2026, 10, 4, 12);   // 4 November 2026: tax year 2026/27
const TODAY = '2026-11-04';
const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));
const S = 'stressTool.settings', D = 'decisionTool.settings';
const SCOPES = ['all', 'record', 'retired', 'saver'];
const up = (raw, now = NOW) => upgradeScenario(raw, { now }).scenario;

function at(now, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now });
  setLinkersOverride(GILTS, now);
  try { return fn(); } finally { vi.useRealTimers(); }
}

/** A fictional draft (Sam): retired, saved with year 0 next April, as "next 6 April" saved it before 7.3.3. */
function samDraft({ stop = null, fty = 2027 } = {}) {
  const raw = read('02-pnv-draft');
  const s = raw.stressTool.settings;
  // fixture 02 as "next 6 April" saved it before 7.4.0: year 0 2027/28, the income from the age reached then (63)
  const age = 63 - (2027 - fty);
  Object.assign(s, { firstTaxYear: fty, retired: true, shapeAgeNow: age, legacyFirstTaxYear: fty });
  s.incomeSteps = [{ ...s.incomeSteps[0], fromAge: age }, ...s.incomeSteps.slice(1)];
  s.targetSchedule = compileSteps(s, age);
  raw.decisionTool.settings.firstTaxYear = fty;
  raw.decisionTool.settings.targetSchedule = s.targetSchedule;
  if (stop) s.stoppedWork = stop; else delete s.stoppedWork;
  return up(raw);
}

// ---- 1. the engine defaults ------------------------------------------------------------------------------------------------

describe('no retiree\'s derived year 0 is above this tax year (property)', () => {
  const days = [];
  for (let y = 2025; y <= 2029; y++) for (let m = 0; m < 12; m++) for (const d of [1, 5, 6, 15, 28]) days.push(new Date(y, m, d, 12));
  const timings = [];
  for (const age of [45, 52, 55, 58, 61, 64, 67, 72, 80]) {
    for (const asOf of [null, '2024-02-29', '2025-04-05', '2025-10-17']) {
      for (const retired of [true, undefined]) {
        for (const stopBack of [null, 0, 3, 11, 30, 120]) timings.push({ age, asOf, retired, stopBack });
      }
    }
  }
  it('deriveTiming, migrateTiming and the pin: a retiree with nothing saved starts in the stop\'s tax year or this one, and the choices end at this tax year', () => {
    let checked = 0;
    for (const now of days) {
      const thisTY = taxYearStartOf(now);
      for (const t of timings) {
        const s = { currentAge: t.age, ...(t.asOf ? { currentAgeAsOf: t.asOf } : {}), ...(t.retired !== undefined ? { retired: t.retired } : {}), shapeAgeNow: t.age };
        if (t.stopBack != null) { const d = new Date(now.getFullYear(), now.getMonth() - t.stopBack, 1); s.stoppedWork = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
        const tm = deriveTiming(s, now);
        if (tm.mode !== 'retired') continue;
        checked++;
        // never later than this tax year: a stop month of April read on 1 to 5 April included (its stop can only be in the
        // tax year ending on the 5th: PlanTiming.stopTaxYearSoFar)
        expect(tm.firstTaxYear, JSON.stringify({ s, now })).toBeLessThanOrEqual(thisTY);
        expect(Math.max(...tm.startOptions)).toBe(thisTY);
        expect(migrateTiming(s, null, now).firstTaxYear).toBeLessThanOrEqual(thisTY);
        expect(pinTiming(s, null, now).firstTaxYear).toBeLessThanOrEqual(thisTY);
        expect(Math.max(...startYearChoices(tm).map((c) => c.year))).toBeLessThanOrEqual(thisTY);
        expect(tm.yearsToStart).toBe(Math.max(0, tm.firstTaxYear - thisTY));
      }
    }
    expect(checked).toBeGreaterThan(10000);
  });
  it('a plan with no age starts this tax year, and is pinned so; a pin saved the old way stays as saved for the engines', () => {
    for (const now of days) {
      const thisTY = taxYearStartOf(now);
      expect(deriveTiming({}, now).firstTaxYear).toBe(thisTY);
      expect(pinTiming({}, null, now).legacyFirstTaxYear).toBe(thisTY);
    }
    expect(deriveTiming({ legacyFirstTaxYear: 2030 }, NOW).firstTaxYear).toBe(2030);
  });
  it('the successor carve-out: the plan that carries a closed one on keeps its year 0, the next tax year included', () => {
    const closed = up(read('18-moved-to-new-plan'));
    const next = up(read('18-moved-to-new-plan-next'));
    expect(isSuccessorOrClosed(closed)).toBe(true);
    expect(isSuccessorOrClosed(next)).toBe(true);
    // made at a change-over month next tax year: its year 0 is that tax year, and nothing reads it earlier
    const made = successorOf(up(read('13-stopped-drawing-since')), { month: '2027-05', now: NOW, nextPlanId: 'x' });
    const plan = { ...(made.plan || made), id: 'succ' };
    const fty = plan.stressTool.settings.firstTaxYear;
    expect(fty).toBe(2027);
    expect(laterDraftOf(plan, plan.stressTool.settings, NOW)).toBeNull();
    expect(startLaterOf(plan, NOW)).toBeNull();
    expect(laterStartEffects(plan, NOW)).toEqual([]);
    expect(effectiveStressSettings(plan, { now: NOW }).firstTaxYear).toBe(2027);
  });
});

// ---- 2. a retired draft saved with a later year ---------------------------------------------------------------------------

describe('a retired draft saved with a later start is read from the earlier one, and written only by its Save', () => {
  it('no month: read from this tax year; every income step keeps its age, the end age kept, one more year drawn', () => {
    const p = samDraft();
    const stored = copy(p);
    const r = laterDraftReading(p, { now: NOW });
    expect(r).toMatchObject({ from: 2027, to: 2026, years: 1, stopMonth: null, legacy: false });
    const ss = effectiveStressSettings(p, { now: NOW });
    expect(ss.firstTaxYear).toBe(2026);
    expect(ss.shapeAgeNow).toBe(r.before.shapeAgeNow - 1);
    expect(ss.duration).toBe(r.before.duration + 1);
    expect(ss.shapeAgeNow + ss.duration).toBe(r.before.shapeAgeNow + r.before.duration);
    for (let age = r.before.shapeAgeNow; age < r.before.shapeAgeNow + r.before.duration; age++) {
      expect(amountAtAge(ss.incomeSteps, age, 0)).toBe(amountAtAge(r.before.incomeSteps, age, 0));
    }
    expect(ss.targetSchedule.slice(1)).toEqual(r.before.targetSchedule);
    expect(deriveTiming(ss, NOW).firstTaxYear).toBe(2026);
    expect(p).toEqual(stored);   // reading wrote nothing, not even in memory
    expect(laterDraftSentence(r)).toBe('Your plan runs from 2026/27, this tax year.');
  });
  it('a month work stopped: read from the stop\'s tax year; the State Pension by date keeps its tax year', () => {
    const p = samDraft({ stop: '2024-07' });
    const r = laterDraftReading(p, { now: NOW });
    expect(r).toMatchObject({ from: 2027, to: 2024, years: 3, stopMonth: '2024-07' });
    const ss = effectiveStressSettings(p, { now: NOW });
    expect(ss.firstTaxYear).toBe(2024);
    expect(ss.spStartDate).toBe(r.before.spStartDate);
    expect(laterDraftSentence(r)).toBe('Your plan runs from 2024/25, the tax year you stopped work.');
  });
  it('a plan with no age, pinned the old way to next year, is read from this tax year', () => {
    const raw = read('02-pnv-draft');
    const s = raw.stressTool.settings;
    for (const k of ['currentAge', 'currentAgeAsOf', 'retired', 'retireAge', 'firstTaxYear', 'stoppedWork']) delete s[k];
    s.legacyFirstTaxYear = 2027;
    delete raw.budgetTool;   // no age anywhere: the Budget's would be folded in
    const p = up(raw);
    expect(deriveTiming(p.stressTool.settings, NOW).firstTaxYear).toBe(2027);
    const r = laterDraftReading(p, { now: NOW });
    expect(r).toMatchObject({ legacy: true, from: 2027, to: 2026 });
    expect(deriveTiming(effectiveStressSettings(p, { now: NOW }), NOW).firstTaxYear).toBe(2026);
    expect(laterDraftPatch(p, { now: NOW }).patch).toEqual({ [S + '.legacyFirstTaxYear']: 2026 });
  });
  it('left alone: locked, recorded, closed or carried on, a saver, and every start already the stop\'s, this one or earlier', () => {
    const locked = samDraft(); locked.decisionTool.settings.locked = true;
    expect(laterDraftOf(locked, locked.stressTool.settings, NOW)).toBeNull();
    const recorded = samDraft(); recorded.decisionTool.history = [{ date: '2026-10-01' }];
    expect(laterDraftOf(recorded, recorded.stressTool.settings, NOW)).toBeNull();
    const closed = samDraft(); closed.closedAt = '2026-10';
    expect(laterDraftOf(closed, closed.stressTool.settings, NOW)).toBeNull();
    const saver = up(read('05-saver-committed'));
    expect(laterDraftOf(saver, saver.stressTool.settings, NOW)).toBeNull();
    for (const fty of [2026, 2025, 2023]) expect(laterDraftOf(samDraft({ fty }), samDraft({ fty }).stressTool.settings, NOW)).toBeNull();
  });
  it('every plan of the corpus whose year 0 is not later reads byte for byte as the settings it reads without the draft rule', () => {
    for (const f of ['01-fresh-default', '02-pnv-draft', '09-couple-a', '12-lumpy-db-gia', '20-locked-start-after-stop', '04-buckets-running', '05-saver-committed', '06-pre-6.4-no-timing', '10-couple-b', '11-guest-demo', '13-stopped-drawing-since', '18-moved-to-new-plan', '18-moved-to-new-plan-next', '19-back-to-work', '19-back-to-work-saving']) {
      const p = up(read(f));
      expect(laterDraftReading(p, { now: NOW }), f).toBeNull();
    }
  });
  it('V7: every save of the draft\'s settings carries the reading, the step\'s own values winning; Undo puts back every byte', () => {
    const p = samDraft({ stop: '2024-07' });
    const ld = laterDraftPatch(p, { now: NOW });
    expect(ld.patch[S + '.firstTaxYear']).toBe(2024);
    expect(ld.patch[D + '.firstTaxYear']).toBe(2024);
    for (const k of Object.keys(ld.patch)) { expect(LATER_DRAFT_WRITES).toContain(k); expect(ALL_WRITES).toContain(k); }
    // the About step's own save on that draft: the end age typed again, nothing else changed
    const step = aboutPatch(p, {}, { today: TODAY });
    expect(step.ok).toBe(true);
    const w = withLaterDraft(p, step, { now: NOW });
    const after = applyPatch(p, w.patch);
    expect(after.stressTool.settings.firstTaxYear).toBe(2024);
    expect(laterDraftReading(after, { now: NOW })).toBeNull();
    // read again after the save: every figure as it read before the save
    const before = effectiveStressSettings(p, { now: NOW }), saved = effectiveStressSettings(after, { now: NOW });
    for (const k of ['firstTaxYear', 'shapeAgeNow', 'duration', 'incomeSteps', 'targetSchedule', 'spStartDate']) expect(saved[k], k).toEqual(before[k]);
    // Undo: the previous values back, byte for byte
    const undone = applyPatch(after, w.previous);
    expect(undone.stressTool.settings).toEqual(p.stressTool.settings);
    // a write that touches no setting is left as it is
    const other = { ok: true, patch: { 'holdings': {} }, previous: {} };
    expect(withLaterDraft(p, other, { now: NOW })).toBe(other);
  });
  it('V7 "Use this split" on such a draft, paired with a partner: the reading is written with the split, so read again every tax year keeps its income', () => {
    const a = samDraft({ stop: '2024-07' });
    const b = up(read('10-couple-b'));
    expect(a.decisionTool.settings.locked).not.toBe(true);
    const ra = effectiveStressSettings(a, { now: NOW }), rb = effectiveStressSettings(b, { now: NOW });
    expect(ra.firstTaxYear).toBe(2024);
    // a split that keeps each plan's own schedule: the write must leave every tax year's income where it was
    const split = { applies: true, names: { a: 'Sam', b: 'Alex' },
      schedules: { together: { a: ra.targetSchedule, b: rb.targetSchedule }, own: { a: ra.targetSchedule, b: rb.targetSchedule } },
      steps: { a: ra.incomeSteps, b: rb.incomeSteps } };
    const p = splitPatches(a, b, split, { today: TODAY });
    expect(p.mode).toBe('write');
    const wa = p.writes.find((w) => w.planId === String(a.id));
    for (const k of Object.keys(wa.patch)) expect(ALL_WRITES).toContain(k);
    expect(wa.patch[S + '.firstTaxYear']).toBe(2024);
    const after = applyPatch(a, wa.patch);
    expect(laterDraftReading(after, { now: NOW })).toBeNull();
    const again = effectiveStressSettings(after, { now: NOW });
    for (const k of ['firstTaxYear', 'duration', 'shapeAgeNow']) expect(again[k], k).toEqual(ra[k]);
    // aligned by tax year: year y of each reading is the same tax year, with the same income
    expect(again.targetSchedule).toEqual(ra.targetSchedule.map((v) => Math.round(v)));   // the split's schedule is in whole pounds
    expect(again.incomeSteps).toEqual(ra.incomeSteps);
    // Undo: every byte back
    expect(applyPatch(after, wa.previous).stressTool.settings).toEqual(a.stressTool.settings);
    expect(applyPatch(after, wa.previous).decisionTool.settings).toEqual(a.decisionTool.settings);
  });
  it('the lock of such a draft locks it as it reads: its Stress settings from the earlier start, the Decision tool seeded so', () => {
    const p = samDraft({ stop: '2024-07' });
    const out = at(NOW, () => {
      const run = runForDocument(p, { today: TODAY, essentials: 0 });
      return lockPatch(p, { now: NOW, run });
    });
    expect(out.ok).toBe(true);
    expect(out.patch[S + '.firstTaxYear']).toBe(2024);
    expect(out.patch[D + '.firstTaxYear']).toBe(2024);
    for (const k of Object.keys(out.patch)) expect([...LOCK_WRITES, ...LATER_DRAFT_WRITES]).toContain(k);
    // Undo of the lock gives back the draft with its start saved as it read: the reversal is the lock's own paths only
    for (const k of Object.keys(out.previous)) expect(LOCK_WRITES).toContain(k);
    const after = applyPatch(p, out.patch);
    expect(after.planDocument.timing.firstTaxYear).toBe(2024);
    expect(startLaterOf(after, NOW)).toBeNull();
  });
});

describe('a locked plan that never saved its year 0 keeps the year it was locked with (PlanMove.withLockedStart)', () => {
  /** Fixture 03 (locked, year 0 2027/28) with its Stress copy saving no year 0 and no month work stopped. */
  const unsaved = (edit = null) => alex((raw) => { delete raw.stressTool.settings.firstTaxYear; if (edit) edit(raw); }, { months: true });
  it('an aged, retired, locked plan reads the Decision copy\'s year 0, not this tax year; the pin writes that year', () => {
    const p = unsaved();
    expect(p.decisionTool.settings.firstTaxYear).toBe(2027);
    const ss = effectiveStressSettings(p, { now: NOW });
    expect(ss.firstTaxYear).toBe(2027);
    expect(deriveTiming(ss, NOW).firstTaxYear).toBe(2027);
    // the planner's load path pins what it reads: the year the plan was locked with, as the Decision copy says
    expect(timingPinPatch(p.stressTool.settings, ss)).toMatchObject({ firstTaxYear: 2027 });
    // still offered the move by the person's own confirm, and the release note says nothing changed
    // (7.4.3: its months begin in July 2026, so the move goes to 2026/27 without the question)
    expect(startLaterOf(p, NOW)).toMatchObject({ kind: 'move', start: 2027, to: 2026, recordsFrom: '2026-07' });
    expect(laterStartEffects(p, NOW)).toEqual(['Your plan is locked, so nothing changed. Its home shows how to move its start.']);
  });
  it('no Decision year: the plan document\'s; neither: the year it read until 7.4.0 (next April)', () => {
    const doc = unsaved((raw) => { delete raw.decisionTool.settings.firstTaxYear; raw.planDocument = { ...(raw.planDocument || {}), timing: { ...((raw.planDocument || {}).timing || {}), firstTaxYear: 2028 } }; });
    expect(effectiveStressSettings(doc, { now: NOW }).firstTaxYear).toBe(2028);
    const none = unsaved((raw) => { delete raw.decisionTool.settings.firstTaxYear; delete raw.planDocument; });
    expect(effectiveStressSettings(none, { now: NOW }).firstTaxYear).toBe(2027);
  });
  it('fixture 06 (locked, no age, no year pinned) reads the calendar year after today, as it did before 7.4.0', () => {
    const p = up(read('06-pre-6.4-no-timing'));
    const ss = effectiveStressSettings(p, { now: NOW });
    expect(deriveTiming(ss, NOW)).toMatchObject({ mode: 'legacy', firstTaxYear: 2027 });
    expect(ss.legacyFirstTaxYear).toBe(2027);
  });
  it('left as it is: a saved year, a month work stopped, a saver, every unlocked plan, and any shape', () => {
    const saved = alex();
    expect(withLockedStart(saved, saved.stressTool.settings, NOW)).toBe(saved.stressTool.settings);
    const stopped = unsaved((raw) => { raw.stressTool.settings.stoppedWork = '2023-10'; });
    expect(withLockedStart(stopped, stopped.stressTool.settings, NOW)).toBe(stopped.stressTool.settings);
    const draft = unsaved((raw) => { raw.decisionTool.settings.locked = false; });
    expect(withLockedStart(draft, draft.stressTool.settings, NOW)).toBe(draft.stressTool.settings);
    const saver = up(read('05-saver-committed'));
    expect(withLockedStart(saver, saver.stressTool.settings, NOW)).toBe(saver.stressTool.settings);
    for (const v of [null, {}, 3]) expect(withLockedStart(v, { a: 1 }, NOW)).toEqual({ a: 1 });
  });
});

// ---- 3. the move of a locked plan's start, extended -----------------------------------------------------------------------

/**
 * Fixture 03 (Alex, fictional: a gilt ladder locked to start in 2027/28), as the planner reads it, with no month recorded:
 * from 7.4.3 a plan with recorded months moves to the tax year they begin in, without the question or "this tax year"
 * (tests/startFromRecords.test.js). `months`: keep the fixture's three months of 2026/27.
 */
function alex(edit = null, { months = false } = {}) {
  const raw = read('20-locked-start-after-stop');
  delete raw.stressTool.settings.stoppedWork;
  if (!months) raw.decisionTool.history = [];
  if (edit) edit(raw);
  return up(raw);
}
const refusal = (plan, data) => lockedPlanWriteRefusal(plan, data, getDefaultStressSettings());

// ---- 4. the caveat ---------------------------------------------------------------------------------------------------------

describe('a plan that draws from a pension before it can usually be taken says so, in both apps', () => {
  const base = { currentAge: 52, currentAgeAsOf: '2026-06-01', retired: true, stoppedWork: '2026-06', equityMin: 200000, bondMin: 100000, cashTarget: 30000, duration: 40 };
  it('a fictional Sam who stopped at 52: 55 (55 before 6 April 2028? no: 57)', () => {
    const e = earlyPensionDrawOf(base, NOW);
    // 52 on 1 June 2026, so 57 on 2 June 2031: the tax year from 6 April 2031 starts with Sam 56, the plan opens the pension
    // from April 2032 (ruling G: both facts said, the law's age and the plan's first open year)
    expect(e).toEqual({ age: 57, taxYear: 2026, opensTaxYear: 2032 });
    expect(earlyPensionDrawWords(e)).toBe('You can take money from your pension from 57. This plan takes it from April 2032, the first tax year you start at 57 or over; until then your ISA and savings pay.');
    // 54: 55 on 2 June 2027 (before 6 April 2028, so 55); 2027/28 starts with them 54, so it opens from April 2028
    expect(earlyPensionDrawOf({ ...base, currentAge: 54 }, NOW)).toEqual({ age: 55, taxYear: 2026, opensTaxYear: 2028 });
  });
  it('absent at or past the age, with no pension pot, and without an age', () => {
    expect(earlyPensionDrawOf({ ...base, currentAge: 60 }, NOW)).toBeNull();
    expect(earlyPensionDrawOf({ ...base, equityMin: 0, bondMin: 0, cashTarget: 0 }, NOW)).toBeNull();
    expect(earlyPensionDrawOf({ equityMin: 100000 }, NOW)).toBeNull();
  });
  it('shown on the classic run summary and the V7 home; the words pass the banned list', () => {
    expect(startSummaryHtml(base)).toContain('data-note="pension-access"');
    expect(startSummaryHtml({ ...base, currentAge: 60 })).not.toContain('pension-access');
    const raw = read('02-pnv-draft');
    Object.assign(raw.stressTool.settings, { currentAge: 52, currentAgeAsOf: '2026-06-01', stoppedWork: '2026-06', firstTaxYear: 2026, retired: true });
    Object.assign(raw.budgetTool.settings, { currentAge: 52, currentAgeAsOf: '2026-06-01' });
    const plan = up(raw);
    const h = homeOf([{ plan }], plan.id, { today: TODAY });
    // 7.4.1: the age, and (the corpus plan's ISA cannot pay every year before 57) by how much a year the other savings run short
    expect(h.pensionAccess).toMatchObject({ age: '57', short: { amount: expect.stringMatching(/^£[\d,]+$/), years: expect.stringMatching(/^\d{4}\/\d{2} to \d{4}\/\d{2}$/) } });
    const older = homeOf([{ plan: up(read('02-pnv-draft')) }], read('02-pnv-draft').id, { today: TODAY });
    expect(older.pensionAccess).toBeNull();
    for (const t of [HOME.pensionAccess, HOME.pensionShort, LASTS.pensionAccess, ABOUT.lockedStart.laterLocked, ABOUT.derived.laterStop, ABOUT.derived.laterNow]) {   // (7.10.0: the start's to-do, the move under the lock and their words are gone)
      expect(bannedHits(t.replace(/\{year\}/g, '2026/27').replace(/\{\w+\}/g, '57'), SCOPES), t).toEqual([]);
    }
  });
});

// ---- 5. laterStartEffects ----------------------------------------------------------------------------------------------------

describe('laterStartEffects: the release note\'s lines for one plan', () => {
  it('tolerates any shape', () => {
    for (const v of [{}, null, undefined, 3, 'x', [], { stressTool: null }, { stressTool: { settings: null }, decisionTool: 7 }]) expect(laterStartEffects(v, NOW)).toEqual([]);
  });
  it('a saver, a closed plan, a plan already starting on time: nothing', () => {
    expect(laterStartEffects(up(read('05-saver-committed')), NOW)).toEqual([]);
    expect(laterStartEffects(up(read('18-moved-to-new-plan')), NOW)).toEqual([]);
    expect(laterStartEffects(up(read('13-stopped-drawing-since')), NOW)).toEqual([]);
  });
  it('a retired draft with a later year, and a locked plan whose year 0 is later', () => {
    expect(laterStartEffects(samDraft(), NOW)).toEqual(['Your plan now runs from 2026/27, this tax year: one more year is drawn, and every figure counted from its start moves with it.']);
    // stopped in an earlier tax year: 2024/25 and 2025/26 are lived years, read as lived; from today's pots only 2026/27 is newly drawn
    expect(laterStartEffects(samDraft({ stop: '2024-07' }), NOW)).toEqual(['Your plan now runs from 2024/25, the tax year you stopped work. From today, one more year is drawn, and every figure counted from its start moves with it.']);
    // saved two years later: two years newly drawn from today
    expect(laterStartEffects(samDraft({ fty: 2028 }), NOW)).toEqual(['Your plan now runs from 2026/27, this tax year: 2 more years are drawn, and every figure counted from its start moves with it.']);
    expect(laterStartEffects(alex(), NOW)).toEqual(['Your plan is locked, so nothing changed. Its home shows how to move its start.']);
    for (const l of [...laterStartEffects(samDraft(), NOW), ...laterStartEffects(alex(), NOW)]) expect(bannedHits(l, SCOPES)).toEqual([]);
  });
  it('a plan with no age, pinned the old way: it only starts earlier, and no figure is said to move', () => {
    const raw = read('02-pnv-draft');
    const s = raw.stressTool.settings;
    for (const k of ['currentAge', 'currentAgeAsOf', 'retired', 'retireAge', 'firstTaxYear', 'stoppedWork']) delete s[k];
    s.legacyFirstTaxYear = 2030;
    delete raw.budgetTool;
    const lines = laterStartEffects(up(raw), NOW);
    expect(lines).toEqual(['Your plan now runs from 2026/27, this tax year, not from April 2030.']);
    for (const l of lines) expect(bannedHits(l, SCOPES)).toEqual([]);
  });
});

// ---- 6. V7 About: the draft's line said once ---------------------------------------------------------------------------------

describe('V7 "About you and when" on such a draft says once where the plan starts', () => {
  it('the derived lines begin with it, and the start choice reads the earlier year', () => {
    const p = samDraft({ stop: '2024-07' });
    const a = aboutOf([{ plan: p }], p.id, { today: TODAY });
    expect(a.derived[0]).toEqual({ id: 'laterStop', slots: { year: '2024/25' } });
    expect(a.derived.filter((d) => d.id.startsWith('later')).length).toBe(1);
    const fresh = up(read('13-stopped-drawing-since'));
    expect(aboutOf([{ plan: fresh }], fresh.id, { today: TODAY }).derived.some((d) => d.id.startsWith('later'))).toBe(false);
  });
  it('a plan with no age, pinned the old way, says it too (this tax year), as the planner\'s Timing summary does', () => {
    const raw = read('02-pnv-draft');
    const s = raw.stressTool.settings;
    for (const k of ['currentAge', 'currentAgeAsOf', 'retired', 'retireAge', 'firstTaxYear', 'stoppedWork']) delete s[k];
    s.legacyFirstTaxYear = 2027;
    delete raw.budgetTool;
    const p = up(raw);
    const a = aboutOf([{ plan: p }], p.id, { today: TODAY });
    expect(a.derived[0]).toEqual({ id: 'laterNow', slots: { year: '2026/27' } });
    expect(laterDraftSentence(laterDraftReading(p, { now: NOW }))).toBe('Your plan runs from 2026/27, this tax year.');
  });
});
