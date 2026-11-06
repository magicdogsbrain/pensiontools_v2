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
import { movedPlanOf, movePatch, laterDraftPatch, withLaterDraft } from '../src/answers/plan/moveStart.js';
import { runForDocument } from '../src/answers/plan/lastsRun.js';
import { applyPatch, aboutPatch, lockedStartOf, aboutOf } from '../src/answers/plan/about.js';
import { lockPatch } from '../src/answers/plan/lock.js';
import { splitPatches } from '../src/answers/plan/household.js';
import { homeOf } from '../src/answers/plan/home.js';
import { MOVE_START_WRITES, ALL_WRITES, LOCK_WRITES, LATER_DRAFT_WRITES } from '../src/answers/plan/schema.js';
import { lockedPlanWriteRefusal } from '../src/services/LockedPlanGuard.js';
import { getDefaultStressSettings } from '../src/storage/stressDefaults.js';
import { setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { amountAtAge, defaultSpYear, compileSteps } from '../src/services/IncomeSchedule.js';
import { successorOf } from '../src/services/PlanClose.js';
import { lockedStartHtml, moveStartQuestion, moveStartDoneWords } from '../src/ui/planStartUi.js';
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
    for (const f of ['01-fresh-default', '02-pnv-draft', '09-couple-a', '12-lumpy-db-gia', '03-gilt-ladder-runup', '04-buckets-running', '05-saver-committed', '06-pre-6.4-no-timing', '10-couple-b', '11-guest-demo', '13-stopped-drawing-since', '18-moved-to-new-plan', '18-moved-to-new-plan-next', '19-back-to-work', '19-back-to-work-saving']) {
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
  const unsaved = (edit = null) => alex((raw) => { delete raw.stressTool.settings.firstTaxYear; if (edit) edit(raw); });
  it('an aged, retired, locked plan reads the Decision copy\'s year 0, not this tax year; the pin writes that year', () => {
    const p = unsaved();
    expect(p.decisionTool.settings.firstTaxYear).toBe(2027);
    const ss = effectiveStressSettings(p, { now: NOW });
    expect(ss.firstTaxYear).toBe(2027);
    expect(deriveTiming(ss, NOW).firstTaxYear).toBe(2027);
    // the planner's load path pins what it reads: the year the plan was locked with, as the Decision copy says
    expect(timingPinPatch(p.stressTool.settings, ss)).toMatchObject({ firstTaxYear: 2027 });
    // still offered the move by the person's own confirm, and the release note says nothing changed
    expect(startLaterOf(p, NOW)).toMatchObject({ kind: 'ask', start: 2027, thisYear: 2026 });
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

/** Fixture 03 (Alex, fictional: a gilt ladder locked to start in 2027/28), as the planner reads it. */
function alex(edit = null) {
  const raw = read('03-gilt-ladder-runup');
  delete raw.stressTool.settings.stoppedWork;
  if (edit) edit(raw);
  return up(raw);
}
function moved(plan, how = {}) {
  return at(NOW, () => {
    const mp = movedPlanOf(plan, { now: NOW, ...how });
    const run = runForDocument(mp.plan, { today: TODAY, essentials: 0 });
    return movePatch(plan, { now: NOW, run, ...how });
  });
}
const refusal = (plan, data) => lockedPlanWriteRefusal(plan, data, getDefaultStressSettings());

describe('the move with no month said: "I\'m already drawing: start it this tax year" (fixture 03)', () => {
  const plan = alex();
  it('offered beside the question, only when asked for; the to-do asks the month and offers this tax year', () => {
    expect(moveOfferOf(plan, NOW)).toBeNull();
    expect(moveOfferOf(plan, NOW, { thisYear: true })).toEqual({ stopMonth: null, from: 2027, to: 2026, years: 1, thisYear: true });
    expect(startLaterOf(plan, NOW)).toEqual({ kind: 'ask', start: 2027, thisYear: 2026 });
    // "Leave it" no longer puts the question away while the start is later than this tax year
    const left = alex((raw) => { raw.stressTool.settings.stopMonthLeft = true; });
    expect(startLaterOf(left, NOW)).toEqual({ kind: 'ask', start: 2027, thisYear: 2026 });
    const ls = lockedStartOf(left, { today: TODAY });
    expect(ls.ask).toBe(true);
    expect(ls.leave).toBe(false);
    expect(ls.nowMove).toMatchObject({ yearStop: '2026/27', yearStart: '2027/28', spAsk: false, how: { thisYear: true } });
    expect(ls.nowMove.confirm[0]).toEqual({ id: 'firstNow', slots: { yearStop: '2026/27', yearStart: '2027/28' } });
    for (const l of ls.nowMove.confirm) expect(ABOUT.lockedStart.confirm.lines[l.id], l.id).toBeTruthy();
  });
  const out = moved(plan, { thisYear: true });
  const after = applyPatch(plan, out.patch);
  it('one write of declared paths, which the guard lets through; no month is written; both copies at this tax year', () => {
    expect(out.ok).toBe(true);
    expect(out.line).toEqual({ id: 'movedNow', slots: { year: '2026/27' } });
    for (const k of Object.keys(out.patch)) expect(MOVE_START_WRITES).toContain(k);
    expect(refusal(plan, out.patch)).toBeNull();
    expect(after.stressTool.settings.stoppedWork).toBeUndefined();
    expect(after.stressTool.settings.firstTaxYear).toBe(2026);
    expect(after.decisionTool.settings.firstTaxYear).toBe(2026);
    expect(after.decisionTool.settings.locked).toBe(true);
    expect(after.journey[after.journey.length - 1].label).toBe('The plan’s start moved to 2026/27, this tax year');
    expect(startLaterOf(after, NOW)).toBeNull();
    expect(laterStartEffects(after, NOW)).toEqual([]);
  });
  it('the guard: refused at another year, with a month made up, or with any other setting beside it', () => {
    const m = planMoveOf(plan, NOW, { thisYear: true });
    expect(refusal(plan, { [S]: m.stress, [D]: m.decision })).toBeNull();
    expect(refusal(plan, { [S]: { ...m.stress, firstTaxYear: 2025 }, [D]: m.decision })).not.toBeNull();
    expect(refusal(plan, { [S]: { ...m.stress, stoppedWork: '2026-05' }, [D]: m.decision })).not.toBeNull();
    expect(refusal(plan, { [S]: { ...m.stress, baseSalary: 1 }, [D]: m.decision })).toEqual(['stress.baseSalary']);
    expect(refusal(plan, { [S]: { ...m.stress, firstTaxYear: 2028 }, [D]: { ...m.decision, firstTaxYear: 2028 } })).not.toBeNull();
    // and every other change to a locked plan's settings stays refused
    expect(refusal(plan, { [S + '.duration']: 40 })).not.toBeNull();
  });
  it('the guard: a move with no month that is consistent in every key, to a year other than this one, is refused', () => {
    // built as the move builds it, but to an older year: both copies, every moved key and the lock's position agree
    const consistent = (p, to) => {
      const ss = p.stressTool.settings, ds = p.decisionTool.settings, from = 2027;
      const stress = reAnchorCopy(ss, from - to, to, 'stress');
      return { [S]: stress, [D]: { ...reAnchorCopy(ds, from - to, to, 'decision'), lockedPosition: positionAfterMove(stress, ds.lockedAt) } };
    };
    expect(refusal(plan, consistent(plan, 2026))).toBeNull();
    // before the tax year the plan was locked in (fixture 03 was locked in 2026/27): never this tax year
    for (const to of [2020, 2024, 2025]) expect(refusal(plan, consistent(plan, to)), String(to)).not.toBeNull();
    // a plan locked in an earlier tax year: the lock's own year passes without a clock, and is refused with one
    const older = alex((raw) => { raw.decisionTool.settings.lockedAt = '2025-07-01T08:15:00.000Z'; });
    const w = consistent(older, 2025);
    expect(lockedPlanWriteRefusal(older, w, getDefaultStressSettings())).toBeNull();
    expect(lockedPlanWriteRefusal(older, w, getDefaultStressSettings(), { now: NOW })).not.toBeNull();
    expect(lockedPlanWriteRefusal(older, consistent(older, 2026), getDefaultStressSettings(), { now: NOW })).toBeNull();
    expect(lockedPlanWriteRefusal(plan, consistent(plan, 2026), getDefaultStressSettings(), { now: NOW })).toBeNull();
  });
  it('the planner\'s words: the confirm names this tax year and no month; the toast likewise', () => {
    const m = planMoveOf(plan, NOW, { thisYear: true });
    const q = moveStartQuestion(m, {});
    expect(q.html).toContain('this tax year');
    expect(q.html).not.toContain('you stopped work (');
    expect(moveStartDoneWords(m)).toContain(', this tax year.');
    const html = lockedStartHtml({ ask: true, start: 2027, thisYear: 2026, leave: false });
    expect(html).toContain('moveLockedPlanStart(\'now\')');
    expect(html).not.toContain('Leave it');
    expect(lockedStartHtml({ ask: true, start: 2027 })).toContain('Leave it');
  });
});

describe('the move with a stop month (fixture 03, stopped October 2023)', () => {
  it('as before: to the stop\'s tax year, the month kept, the guard lets it through', () => {
    const plan = alex((raw) => { raw.stressTool.settings.stoppedWork = '2023-10'; });
    expect(startLaterOf(plan, NOW)).toEqual({ kind: 'move', start: 2027, stopMonth: '2023-10', to: 2023, blocked: false });
    const out = moved(plan);
    expect(out.ok).toBe(true);
    expect(out.line.id).toBe('moved');
    expect(refusal(plan, out.patch)).toBeNull();
    const after = applyPatch(plan, out.patch);
    expect(after.stressTool.settings.stoppedWork).toBe('2023-10');
    expect(after.stressTool.settings.firstTaxYear).toBe(2023);
  });
});

describe('the State Pension given only as a plan year: its date asked, and written with the move (fixture 03)', () => {
  // the move of 4 years would land the State Pension's year on 12, which the planner reads as "at 67"
  const spByYear = (raw) => { const s = raw.stressTool.settings; s.stoppedWork = '2023-10'; s.spStartDate = null; s.spWeeklyAmount = 0; s.statePension = 12000; s.statePensionYear = 8; };
  const plan = alex(spByYear);
  it('was blocked; now the move asks the date: the to-do is the move, never "only once unlocked"', () => {
    expect(moveOfferOf(plan, NOW)).toBeNull();
    expect(moveBlockedOf(plan, NOW)).toEqual({ stopMonth: '2023-10', from: 2027, to: 2023, why: 'statePension', spFix: 'spDate' });
    expect(startLaterOf(plan, NOW)).toEqual({ kind: 'move', start: 2027, stopMonth: '2023-10', to: 2023, blocked: false, spAsk: true });
    const ls = lockedStartOf(plan, { today: TODAY });
    expect(ls.move).toMatchObject({ spAsk: true, how: null, confirm: [] });   // waits for a date
    expect(ls.blocked).toBeNull();
    const typed = lockedStartOf(plan, { today: TODAY, typed: { moveSpDate: '14 March 2029' } });
    expect(typed.move.how).toEqual({ spStartDate: '14 March 2029' });
    expect(typed.move.confirm.map((l) => l.id)).toContain('spDate');
    expect(lockedStartOf(plan, { today: TODAY, typed: { moveSpDate: 'soon' } }).spError).toBe('notADate');
  });
  it('the box names the tax year the plan pays it from as it stands; the confirm says so when the date is in another', () => {
    // year 0 2027/28, State Pension plan year 8: paid from 2035/36 as it stands
    expect(spPlanTaxYearOf(plan)).toBe(2035);
    const ls = lockedStartOf(plan, { today: TODAY });
    expect(ls.spPlanYear).toBe('2035/36');
    expect(fill(ABOUT.lockedStart.spPlanYear, { year: ls.spPlanYear })).toBe('Your plan pays it from 2035/36 as it stands. A date in another tax year moves it there.');
    // a date in 2028/29: said, in both apps
    const other = lockedStartOf(plan, { today: TODAY, typed: { moveSpDate: '14 March 2029' } });
    const line = other.move.confirm.find((l) => l.id === 'spDateMoved');
    expect(line).toEqual({ id: 'spDateMoved', slots: { dateTaxYear: '2028/29', paidFrom: '2035/36' } });
    expect(fill(ABOUT.lockedStart.confirm.lines.spDateMoved, line.slots)).toBe('That date is in 2028/29; the plan had paid your State Pension from 2035/36, so it now starts in 2028/29.');
    const m = planMoveOf(plan, NOW, { spStartDate: '14 March 2029' });
    expect(moveStartQuestion(m, {}).html).toContain('That date is in 2028/29; the plan had paid your State Pension from 2035/36, so it now starts in 2028/29.');
    expect(lockedStartHtml({ offer: { stopMonth: '2023-10', from: 2027, to: 2023 }, spAsk: true, spPlanYear: 2035 })).toContain('Your plan pays it from 2035/36 as it stands.');
    // a date in that same tax year: nothing more to say
    const same = lockedStartOf(plan, { today: TODAY, typed: { moveSpDate: '1 June 2035' } });
    expect(same.move.confirm.map((l) => l.id)).toContain('spDate');
    expect(same.move.confirm.map((l) => l.id)).not.toContain('spDateMoved');
    expect(moveStartQuestion(planMoveOf(plan, NOW, { spStartDate: '1 June 2035' }), {}).html).not.toContain('That date is in');
    for (const t of [ABOUT.lockedStart.spPlanYear, ABOUT.lockedStart.confirm.lines.spDateMoved]) expect(bannedHits(fill(t, { year: '2035/36', dateTaxYear: '2028/29', paidFrom: '2035/36' }), SCOPES)).toEqual([]);
  });
  it('the move writes the date and the weekly figure in both copies; the State Pension starts in the date\'s tax year', () => {
    const out = moved(plan, { spStartDate: '14 March 2029' });
    expect(out.ok).toBe(true);
    expect(refusal(plan, out.patch)).toBeNull();
    const after = applyPatch(plan, out.patch);
    const s = after.stressTool.settings;
    expect(s.spStartDate).toBe('14 March 2029');
    expect(s.spWeeklyAmount).toBe(Math.round(12000 / 52 * 100) / 100);
    expect(s.firstTaxYear).toBe(2023);
    expect(after.decisionTool.settings.spStartDate).toBe('14 March 2029');
    expect(startLaterOf(after, NOW)).toBeNull();
  });
  it('the guard: a date the planner cannot read, a weekly figure made up, or a date on a plan that had one are refused', () => {
    const m = planMoveOf(plan, NOW, { spStartDate: '14 March 2029' });
    expect(refusal(plan, { [S]: m.stress, [D]: m.decision })).toBeNull();
    expect(refusal(plan, { [S]: { ...m.stress, spStartDate: 'soon' }, [D]: m.decision })).not.toBeNull();
    expect(refusal(plan, { [S]: { ...m.stress, spWeeklyAmount: 300 }, [D]: m.decision })).not.toBeNull();
    const dated = alex((raw) => { raw.stressTool.settings.stoppedWork = '2023-10'; });
    const md = planMoveOf(dated, NOW);
    expect(refusal(dated, { [S]: { ...md.stress, spStartDate: '1 May 2031' }, [D]: md.decision })).not.toBeNull();
  });
  it('withSpDate touches only a State Pension given by plan year', () => {
    const byDate = { spStartDate: '1 May 2031', spWeeklyAmount: 200, statePension: 9000 };
    expect(withSpDate(byDate, '1 June 2031')).toBe(byDate);
    expect(withSpDate({ statePension: 10400 }, '1 June 2031')).toEqual({ statePension: 10400, spStartDate: '1 June 2031', spWeeklyAmount: 200 });
    // the case it is for: moved 4 years, a plan year 8 would land on 12, read as "at 67": the copy cannot say it, so it is kept
    expect(reAnchorCopy({ shapeAgeNow: 60, duration: 30, statePension: 10400, statePensionYear: 8 }, 4, 2023).statePensionYear).toBe(8);
    expect(defaultSpYear({ shapeAgeNow: 56, statePensionYear: 12 })).toBe(11);
  });
});

// ---- 4. the caveat ---------------------------------------------------------------------------------------------------------

describe('a plan that draws from a pension before it can usually be taken says so, in both apps', () => {
  const base = { currentAge: 52, currentAgeAsOf: '2026-06-01', retired: true, stoppedWork: '2026-06', equityMin: 200000, bondMin: 100000, cashTarget: 30000, duration: 40 };
  it('a fictional Sam who stopped at 52: 55 (55 before 6 April 2028? no: 57)', () => {
    const e = earlyPensionDrawOf(base, NOW);
    expect(e).toEqual({ age: 57, taxYear: 2026 });
    expect(earlyPensionDrawWords(e)).toBe('Before 57, this plan pays you from your other savings, not your pension.');   // a fact from 7.4.1: the engines hold it back
    expect(earlyPensionDrawOf({ ...base, currentAge: 54 }, NOW)).toEqual({ age: 55, taxYear: 2026 });
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
    expect(h.pensionAccess).toEqual({ age: '57' });
    const older = homeOf([{ plan: up(read('02-pnv-draft')) }], read('02-pnv-draft').id, { today: TODAY });
    expect(older.pensionAccess).toBeNull();
    for (const t of [HOME.pensionAccess, LASTS.pensionAccess, ABOUT.lockedStart.now, ABOUT.lockedStart.nowOpen, ABOUT.lockedStart.spLabel, ABOUT.lockedStart.spHelp, ABOUT.lockedStart.spError,
      ABOUT.lockedStart.confirm.lines.firstNow, ABOUT.lockedStart.confirm.lines.spDate, ABOUT.derived.laterStop, ABOUT.derived.laterNow, ABOUT.toast.movedNow, HOME.items['start.ask'].detail]) {
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
