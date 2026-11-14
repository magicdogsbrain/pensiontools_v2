/**
 * Move a locked plan's start (6.53.0; research/plan-start.md §4 "Migration of existing plans", §6 decisions 4–7 and 12,
 * §7 "the migration"): a locked plan whose income was set to start after the tax year work stopped is moved, under the
 * lock, to start in that tax year — one confirmed write the guard lets through only as exactly that move.
 *
 * The subject is the corpus's fixture 03 (Alex, fictional: a full index-linked gilt ladder locked on 1 July 2026 to start
 * in 2027/28, three months recorded in 2026/27 before that start) once Alex has said they stopped work in October 2023,
 * read on 4 November 2026: the move makes 2023/24 the plan's first tax year, four years earlier, so today is its year 3,
 * three months of which had gone when the plan was locked.
 *
 * Covered here: the move on fixture 03 (both copies of year 0, the steps and the income by year, the dated figures, the
 * records rewritten in their derived fields only — every other byte compared —, the document and plan of record archived
 * and written again as seen from where the lock's pots stood, one journey entry, the unlock count untouched, and a
 * migration of the chain touching none of it); the guard (`reAnchor` passes only as that move, both copies to the same
 * value; the pin allowance refuses a key already saved; the month work stopped writable on a locked plan); the question
 * and the offer; how the plan reads after the move (records, the ladder's month, where the pots stood, plan vs actual's
 * yardstick); the back-fill reaching the lived months, never over a recorded month; V7's question; and the words.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import {
  stopAskOf, stopLeftOf, moveOfferOf, moveBlockedOf, stopChangeOf, planMoveOf, reAnchorCopy, reAnchorRecords, positionAfterMove, moveAnchorOf,
  strategyBlockAfterMove, moveFactsOf, REANCHOR_STRESS_KEYS, REANCHOR_DECISION_KEYS, MOVED_SOURCE, MOVED_NOTE, startLaterOf
} from '../src/services/PlanMove.js';
import { runForDocument, planFor } from '../src/answers/plan/lastsRun.js';
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';
import { applyPatch } from '../src/answers/plan/about.js';
import { lockedStartOf, stopAskPatch, lockedStopAnswer } from '../src/answers/plan/about.js';
import { ABOUT } from '../src/v7/copy/about.js';
import { ALL_WRITES, WRITES, CLOSE_WRITES } from '../src/answers/plan/schema.js';
import { lockedPlanWriteRefusal, lockedWriteRefusal, LOCKED_BOOKKEEPING } from '../src/services/LockedPlanGuard.js';
import { timingPinPatch, TIMING_PIN_KEYS, deriveTiming, decisionAnchorYear } from '../src/services/PlanTiming.js';
import { lockedPotsAsOf } from '../src/services/PlanFromToday.js';
import { decisionSettingsChecksum, planOfRecordFor } from '../src/services/PlanCommit.js';
import { compileSteps, defaultSpYear } from '../src/services/IncomeSchedule.js';
import { migrateStressSettings } from '../src/services/PlanReading.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';
import { generateGlidepathSchedule } from '../src/services/GlidepathService.js';
import { recordYearLabel, recordSourceWords, yearRowHtml, firstSetUpPlanYear, lockedStartHtml, spCountOf, planVsActualWords, LOCKED_STOP_REFUSED } from '../src/ui/planStartUi.js';
import { writtenWhen } from '../src/ui/components/PlanDocumentView.js';
import { ladderPosition, ladderMonthAdvice, firstRungOf, documentLadder } from '../src/services/LadderPosition.js';
import { whereAmI } from '../src/services/PlanDocument.js';
import { fillOffer, earliestFillMonth, planFillStart, notSetUpWords, fillMarks } from '../src/services/MonthFill.js';
import { getDefaultStressSettings } from '../src/storage/stressDefaults.js';
import { setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { setEquityOverride } from '../src/services/EquityIndex.js';
import { bannedHits } from './v7/render/checkScreen.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');
const read = (name) => JSON.parse(readFileSync(join(PLANS, name + '.json'), 'utf8'));
const GILTS = JSON.parse(readFileSync(join(PLANS, 'market', 'gilts.json'), 'utf8'));
const EQUITY = JSON.parse(readFileSync(join(PLANS, 'market', 'equity.json'), 'utf8'));
const NOW = new Date(2026, 10, 4, 12);   // 4 November 2026: tax year 2026/27
const TODAY = '2026-11-04';
const copy = (v) => JSON.parse(JSON.stringify(v));
const taxYearKeyOf = (ym) => { const [y, m] = ym.split('-').map(Number); const Y = m >= 4 ? y : y - 1; return String(Y % 100).padStart(2, '0') + '/' + String((Y + 1) % 100).padStart(2, '0'); };

/**
 * Fixture 03 as the planner reads it, saying Alex stopped work in October 2023 (the month written as a locked plan may).
 * From 7.4.3 a plan with recorded months moves to the tax year they begin in (PlanMove.pickUpYearOf), so Alex has recorded
 * the month work stopped as well (a copy of the first month, dated then): the plan was picked up from the stop, and the move
 * is to the stop's tax year, as before. With no month said, no month is recorded either: the question is a plan's with none
 * (one with months recorded is moved to their tax year, tests/startFromRecords.test.js).
 */
function alex(stop = '2023-10') {
  const raw = read('20-locked-start-after-stop');
  if (stop) raw.stressTool.settings.stoppedWork = stop;
  if (stop && stop < '2026-04') recordedFromStop(raw, stop);
  if (!stop) raw.decisionTool.history = [];
  return upgradeScenario(raw, { now: NOW }).scenario;
}
/** A stored plan (raw) that has also recorded the month work stopped, first: a copy of its first month, dated then (7.4.3). */
function recordedFromStop(raw, stop) {
  raw.decisionTool.history = [{ ...raw.decisionTool.history[0], date: stop, taxYear: taxYearKeyOf(stop) }, ...raw.decisionTool.history];
  return raw;
}
function at(now, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now });
  setLinkersOverride(GILTS, now);
  try { return fn(); } finally { vi.useRealTimers(); }
}
/**
 * The plan as the move's transform leaves it, in memory (PlanMove.planMoveOf: both copies of the settings moved, no document) —
 * the reading a plan stored with a later start is read by. Since 7.10.0 nothing WRITES it: a locked plan's start changes by
 * unlock and a new lock (the move under the lock, movePatch, is gone).
 */
function transformed(plan, now = NOW) {
  const m = planMoveOf(plan, now);
  return m ? { ...plan, stressTool: { ...plan.stressTool, settings: m.stress }, decisionTool: { ...plan.decisionTool, settings: m.decision }, planDocument: null } : null;
}
const DERIVED = ['yearNum', 'bridgeYear', 'planStartYear', 'strategySource', 'strategyNote', 'settingsChecksum'];
const without = (o, keys) => { const out = { ...o }; for (const k of keys) delete out[k]; return out; };

beforeAll(() => { setEquityOverride(EQUITY); });
afterAll(() => { setLinkersOverride(null); setEquityOverride(null); vi.useRealTimers(); });

describe('the question and the offer on a locked plan', () => {
  it('a locked retired plan that does not say when work stopped is asked, once: "Leave it" is remembered', () => {
    const p = alex(null);
    expect(stopAskOf(p, NOW)).toBe(true);
    expect(moveOfferOf(p, NOW)).toBeNull();
    expect(stopLeftOf(p, NOW)).toBe(false);
    p.stressTool.settings.stopMonthLeft = true;
    expect(stopAskOf(p, NOW)).toBe(false);
    // not asked again, but the month can still be said without unlocking; once said, that is over
    expect(stopLeftOf(p, NOW)).toBe(true);
    p.stressTool.settings.stoppedWork = '2023-10';
    expect(stopLeftOf(p, NOW)).toBe(false);
  });
  it('a draft is never asked here (its own form asks) and never offered the move (its Save moves it)', () => {
    const p = alex(null);
    p.decisionTool.settings.locked = false;
    expect(stopAskOf(p, NOW)).toBe(false);
    const q = alex();
    q.decisionTool.settings.locked = false;
    expect(moveOfferOf(q, NOW)).toBeNull();
  });
  it('the offer: the stop\'s tax year earlier than the plan\'s first; none for a stop in that year or later, or one still to come', () => {
    expect(moveOfferOf(alex(), NOW)).toEqual({ stopMonth: '2023-10', from: 2027, to: 2023, years: 4 });
    expect(moveOfferOf(alex('2027-05'), NOW)).toBeNull();      // still to come
    expect(moveOfferOf(alex('2027-04'), new Date(2027, 5, 1))).toBeNull();   // the plan's own first tax year: nothing to move
    expect(stopAskOf(alex(), NOW)).toBe(false);                // said: not asked again
  });
});

/**
 * The tests below record the month work stopped as well, so their moves still go to the stop's tax year (7.4.3). These pin
 * the same fixtures as they were given before, with their months beginning after the stop: the move now goes to the tax year
 * the earliest recorded month is in, or nowhere when year 0 is that year already.
 */
describe('the original inputs, read from 7.4.3: the move goes to where the recorded months begin', () => {
  it('fixture 03, stopped October 2023, months from July 2026: to 2026/27, not the stop\'s 2023/24', () => {
    const raw = read('20-locked-start-after-stop'); raw.stressTool.settings.stoppedWork = '2023-10';
    const p = upgradeScenario(raw, { now: NOW }).scenario;
    expect(startLaterOf(p, NOW)).toEqual({ kind: 'move', start: 2027, stopMonth: '2023-10', to: 2026, blocked: false, recordsFrom: '2026-07' });
    expect(moveOfferOf(p, NOW)).toEqual({ stopMonth: '2023-10', from: 2027, to: 2026, years: 1, recordsFrom: '2026-07' });
  });
  it('fixture 13, stopped October 2023, months from November 2024, year 0 2024/25: nothing to move', () => {
    const raw = read('13-stopped-drawing-since'); raw.stressTool.settings.stoppedWork = '2023-10';
    const p = upgradeScenario(raw, { now: NOW }).scenario;
    expect(moveOfferOf(p, NOW)).toBeNull();
    expect(startLaterOf(p, NOW)).toBeNull();
  });
  for (const stop of ['2025-06', '2024-06']) {
    it('fixture 04, stopped ' + stop + ', months from this tax year, year 0 this tax year: nothing to move', () => {
      const raw = read('04-buckets-running'); raw.stressTool.settings.stoppedWork = stop;
      const p = upgradeScenario(raw, { now: NOW }).scenario;
      expect(moveOfferOf(p, NOW)).toBeNull();
      expect(startLaterOf(p, NOW)).toBeNull();
    });
  }
});

describe('the guard: the pin only fills in; the month work stopped is always writable', () => {
  const stored = { baseSalary: 40000, firstTaxYear: 2028, retired: true, retireAge: null };
  it('a pin key already saved is refused on a locked plan; an absent one goes', () => {
    expect(lockedWriteRefusal('stress', { locked: true, stored, next: { ...stored, firstTaxYear: 2026 } })).toEqual(['firstTaxYear']);
    expect(lockedWriteRefusal('stress', { locked: true, stored, next: { ...stored, retired: false } })).toEqual(['retired']);
    expect(lockedWriteRefusal('stress', { locked: true, stored, next: { ...stored, retireAge: 66 } })).toBeNull();   // null is absent
    expect(lockedWriteRefusal('stress', { locked: true, stored: { baseSalary: 1 }, next: { baseSalary: 1, firstTaxYear: 2028, currentAgeAsOf: '2026-06-12' } })).toBeNull();
  });
  it('the pin itself never writes over a saved key', () => {
    expect(timingPinPatch({ retired: true, retireAge: 60, currentAge: 64 }, { retired: true, retireAge: null, firstTaxYear: 2028, currentAge: 64 })).toEqual({ firstTaxYear: 2028 });
    for (const k of TIMING_PIN_KEYS) expect(timingPinPatch({ [k]: 'saved' }, { [k]: 'other' })).toBeNull();
  });
  it('the month work stopped and "Leave it" are named bookkeeping: a locked plan may write them, and nothing else beside them', () => {
    expect(LOCKED_BOOKKEEPING.stress).toEqual(expect.arrayContaining(['stoppedWork', 'stopMonthLeft']));
    const plan = alex(null);
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings.stoppedWork': '2023-10' }, getDefaultStressSettings())).toBeNull();
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings.stopMonthLeft': true }, getDefaultStressSettings())).toBeNull();
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings.stoppedWork': '2023-10', 'stressTool.settings.firstTaxYear': 2023 }, getDefaultStressSettings())).toEqual(['stress.firstTaxYear']);
  });
  it('the month alone changes no figure of a locked plan: where its pots stand and the year it runs from are as they were', () => {
    const p0 = alex(null), p1 = alex();
    expect(lockedPotsAsOf(p1)).toEqual(lockedPotsAsOf(p0));
    const s0 = effectiveStressSettings(p0, { now: NOW }), s1 = effectiveStressSettings(p1, { now: NOW });
    expect(s1.potsAsOf).toEqual(s0.potsAsOf);
    expect(deriveTiming(s1, NOW).firstTaxYear).toBe(deriveTiming(s0, NOW).firstTaxYear);
  });
});

describe('every figure counted from year 0 keeps its tax year (fictional, Sam)', () => {
  const sam = {
    firstTaxYear: 2029, shapeAgeNow: 62, duration: 30, incomeShape: 'phases', baseSalary: 30000,
    incomeSteps: [{ fromAge: 62, amount: 30000, decline: 1 }, { fromAge: 75, amount: 24000 }],
    targetSchedule: null, dbAmount: 6000, dbStartYear: 3, spStartDate: null, spWeeklyAmount: 0, statePension: 11000, statePensionYear: 5,
    extraIncomes: [{ label: 'Rent', annual: 5000, startYear: 0, endYear: 4 }], extraWithdrawals: [{ label: 'Roof', amount: 9000, year: 2, years: 2 }],
    windfalls: [{ label: 'Gift', amount: 20000, year: 6 }]
  };
  it('moved three years back: steps, final-salary pension, State Pension by year, streams, spends and lump sums the same tax years', () => {
    const out = reAnchorCopy(sam, 3, 2026);
    expect(out).toMatchObject({ firstTaxYear: 2026, shapeAgeNow: 59, duration: 33, dbStartYear: 6, statePensionYear: 8 });
    // the first step falls 1% a year: its slope stays where it was, from 62, and a level step at its figure pays the new years
    expect(out.incomeSteps).toEqual([{ fromAge: 59, amount: 30000 }, { fromAge: 62, amount: 30000, decline: 1 }, { fromAge: 75, amount: 24000 }]);
    expect(out.extraIncomes).toEqual([{ label: 'Rent', annual: 5000, startYear: 3, endYear: 7 }]);
    expect(out.extraWithdrawals).toEqual([{ label: 'Roof', amount: 9000, year: 5, years: 2 }]);
    expect(out.windfalls).toEqual([{ label: 'Gift', amount: 20000, year: 9 }]);
    expect(out.targetSchedule).toBeNull();
    expect(reAnchorCopy(sam, 0, 2029)).toEqual(sam);
  });
  it('the income by year takes its first figure k more times in front, whatever made it; the steps then give the same figures', () => {
    const own = { ...sam, incomeSteps: [], incomeShape: 'level', targetSchedule: [31000, 30000, 29000] };
    expect(reAnchorCopy(own, 2, 2027).targetSchedule).toEqual([31000, 31000, 31000, 30000, 29000]);
    const stepped = { ...sam, targetSchedule: compileSteps(sam, 62) };
    const out = reAnchorCopy(stepped, 3, 2026);
    expect(out.targetSchedule.slice(3)).toEqual(stepped.targetSchedule);
    expect(out.targetSchedule).toEqual(compileSteps(out, 59));
  });
  it('the State Pension by date is not moved: its date says when', () => {
    expect(reAnchorCopy({ ...sam, spStartDate: '14 March 2031', spWeeklyAmount: 230 }, 3, 2026).statePensionYear).toBe(5);
  });
});

describe('the income from the old start on is the figure it was, whatever the first step does (fictional, Sam)', () => {
  const base = { firstTaxYear: 2028, shapeAgeNow: 66, duration: 20, incomeShape: 'phases', baseSalary: 40000 };
  const withSchedule = (s) => ({ ...s, targetSchedule: compileSteps(s, s.shapeAgeNow) });
  const cases = {
    'level': [{ fromAge: 66, amount: 34000 }, { fromAge: 72, amount: 29000 }],
    'falling 1% a year': [{ fromAge: 66, amount: 34000, decline: 1 }, { fromAge: 72, amount: 29000 }],
    'moving evenly to the next': [{ fromAge: 66, amount: 40000, glideToNext: true }, { fromAge: 76, amount: 30000 }],
    'falling, begun before the start': [{ fromAge: 63, amount: 36000, decline: 2 }, { fromAge: 75, amount: 28000 }]
  };
  for (const [name, steps] of Object.entries(cases)) {
    it('a first step ' + name + ': every year from 2028/29 on as it was, the new years at the figure 2028/29 had', () => {
      const s = withSchedule({ ...base, incomeSteps: steps });
      const out = reAnchorCopy(s, 2, 2026);
      expect(out.targetSchedule.slice(2)).toEqual(s.targetSchedule);
      expect(out.targetSchedule.slice(0, 2)).toEqual([s.targetSchedule[0], s.targetSchedule[0]]);
      // the steps, compiled from the new start, give the same figures (to the penny)
      compileSteps(out, 64).forEach((v, y) => expect(v).toBeCloseTo(out.targetSchedule[y], 6));
    });
  }
  it('a plan still carrying the old "Declining with age" profile: fixed at the old start, so the slope keeps its tax years', () => {
    const now = new Date(2026, 10, 4, 12);
    const s = { ...base, retired: true, currentAge: 64, currentAgeAsOf: '2026-06-01', incomeSteps: [{ fromAge: 66, amount: 30000 }], spendingProfile: 'declining' };
    s.targetSchedule = compileSteps(s, 66);
    const read = (x) => migrateStressSettings({ settings: x, budget: null, lastModified: null, checksum: null }, now).settings;
    const out = reAnchorCopy(s, 2, 2026, 'stress');
    expect(out).toMatchObject({ spendingProfile: 'flat', spendingMigratedFrom: 'declining', incomeShape: 'phases' });
    expect(read(out).targetSchedule.slice(2)).toEqual(read(s).targetSchedule);
    // the Decision copy: its income by year, as DecisionRepository fixes it on read
    const d = reAnchorCopy({ ...s, targetSchedule: s.targetSchedule }, 2, 2026, 'decision');
    expect(d.spendingProfile).toBe('flat');
    expect(d.targetSchedule.slice(2)[7]).toBe(Math.round(s.targetSchedule[7] * 0.99 ** 3));
  });
});

describe('the State Pension given as a plan year keeps its tax year (fictional, Alex)', () => {
  const spByYear = (spy) => (raw) => { const s = raw.stressTool.settings; s.spStartDate = null; s.spWeeklyAmount = 0; s.statePension = 12000; s.statePensionYear = spy; };
  function alexWith(edit) { const raw = recordedFromStop(read('20-locked-start-after-stop'), '2023-10'); raw.stressTool.settings.stoppedWork = '2023-10'; edit(raw); return upgradeScenario(raw, { now: NOW }).scenario; }
  const spTaxYear = (s) => s.firstTaxYear + defaultSpYear(s);
  it('the planner\'s default year (12, read as "at 67") is left as it is: it follows the start age, so 2028/29 stays 2028/29', () => {
    const plan = alexWith(spByYear(12));
    const m = planMoveOf(plan, NOW);
    expect(m.stress.statePensionYear).toBe(12);
    expect(spTaxYear(m.stress)).toBe(spTaxYear(plan.stressTool.settings));
    expect(spTaxYear(m.stress)).toBe(2028);
    // 7.10.0: no move is written under the lock any more — the guard refuses the moved settings whole, as any change to them
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings': m.stress, 'decisionTool.settings': m.decision }, getDefaultStressSettings())).not.toBeNull();
  });
  it('a year given by hand moves k later; one that would land on 12 is not offered (it would read as "at 67"), and the guard refuses it', () => {
    const plan9 = alexWith(spByYear(9));
    const m9 = planMoveOf(plan9, NOW);
    expect(m9.stress.statePensionYear).toBe(13);
    expect(spTaxYear(m9.stress)).toBe(spTaxYear(plan9.stressTool.settings));
    const plan8 = alexWith(spByYear(8));
    expect(moveOfferOf(plan8, NOW)).toBeNull();
    expect(planMoveOf(plan8, NOW)).toBeNull();
    expect(moveBlockedOf(plan8, NOW)).toEqual({ stopMonth: '2023-10', from: 2027, to: 2023, why: 'statePension', spFix: 'spDate' });   // 7.4.0: its date is asked in the move
    expect(moveBlockedOf(plan9, NOW)).toBeNull();
    const ss = plan8.stressTool.settings, ds = plan8.decisionTool.settings;
    const stress = { ...reAnchorCopy(ss, 4, 2023), stoppedWork: '2023-10', statePensionYear: 12 };
    const decision = { ...reAnchorCopy(ds, 4, 2023, 'decision'), lockedPosition: positionAfterMove(stress, ds.lockedAt) };
    expect(lockedPlanWriteRefusal(plan8, { 'stressTool.settings': stress, 'decisionTool.settings': decision }, getDefaultStressSettings())).not.toBeNull();
  });
  it('a year landing on 12 where 67 falls in that very year is kept; the Decision copy is read as the year it says', () => {
    expect(reAnchorCopy({ shapeAgeNow: 57, duration: 30, statePension: 9000, statePensionYear: 10 }, 2, 2026).statePensionYear).toBe(12);
    expect(reAnchorCopy({ shapeAgeNow: 66, duration: 20, statePension: 9000, statePensionYear: 12 }, 2, 2026, 'decision').statePensionYear).toBe(14);
  });
});

describe('the counts of years from year 0 move with it: the ladder\'s first gilt, a phased start, the ways\' dials', () => {
  it('a phased start, Bridge & engine\'s cash years (3 when not set), Ladder & ratchet\'s ladder years (from the plan\'s length when not set), and every stash', () => {
    expect(reAnchorCopy({ accessMethod: 'ufpls', ufplsYears: 5 }, 2, 2026).ufplsYears).toBe(7);
    expect(reAnchorCopy({ accessMethod: 'drawdown', ufplsYears: 5 }, 2, 2026).ufplsYears).toBe(5);
    expect(reAnchorCopy({ strategyId: 'bridge-and-engine', strategyParams: { bridgeAge: 67 } }, 2, 2026).strategyParams).toEqual({ bridgeAge: 67, cashYears: 5 });
    expect(reAnchorCopy({ strategyId: 'ladder-and-ratchet', strategyParams: { ladderYears: 12 } }, 2, 2026).strategyParams).toEqual({ ladderYears: 14 });
    // not set: the years worked out from the plan's length before the move (20 years: 10; none saved: 35, so 15), two more
    expect(reAnchorCopy({ strategyId: 'ladder-and-ratchet', strategyParams: { drawAnnual: 30000 }, duration: 20 }, 2, 2026).strategyParams).toEqual({ drawAnnual: 30000, ladderYears: 12 });
    expect(reAnchorCopy({ strategyId: 'ladder-and-ratchet', strategyParams: { drawAnnual: 30000 } }, 2, 2026).strategyParams).toEqual({ drawAnnual: 30000, ladderYears: 17 });
    expect(strategyBlockAfterMove({ id: 'ladder-and-ratchet', params: {} }, 'ladder-and-ratchet', 2, 20)).toEqual({ id: 'ladder-and-ratchet', params: { ladderYears: 12 } });
    expect(reAnchorCopy({ strategyId: 'pots-and-valves', strategyParams: {} }, 2, 2026).strategyParams).toEqual({});
    const state = { 'full-il-gilt': { strategyParams: { cashYears: 1 }, savedAt: 'x' }, 'floor-and-flex': { strategyParams: { horizonAge: 90 } } };
    expect(reAnchorCopy({ strategyId: 'pots-and-valves', strategyState: state }, 2, 2026).strategyState).toEqual({ 'full-il-gilt': { strategyParams: { cashYears: 3 }, savedAt: 'x' }, 'floor-and-flex': { strategyParams: { horizonAge: 90 } } });
    expect(strategyBlockAfterMove({ id: 'full-il-gilt', params: { cashYears: 2 } }, 'full-il-gilt', 2)).toEqual({ id: 'full-il-gilt', params: { cashYears: 4 } });
    const other = { id: 'full-il-gilt', params: { cashYears: 2 } };
    expect(strategyBlockAfterMove(other, 'pots-and-valves', 2)).toBe(other);   // not the block the plan reads
  });
});

describe('Ladder & ratchet and Bridge & engine keep their tax years through a move, the dial set or not (fixture 03)', () => {
  // Fixture 03 drawing by each way, moved from 2027/28 to 2023/24: the base ladder, and the bridge's cash, pay the same tax
  // years before and after. Before 6.55.0 an unset ladder was worked out again from the moved plan's length and ended a
  // year earlier.
  function drawingBy(id, dials) {
    const raw = read('20-locked-start-after-stop');
    raw.stressTool.settings.stoppedWork = '2023-10';
    raw.stressTool.settings.strategyId = id;
    raw.stressTool.settings.strategyParams = { ...(raw.stressTool.settings.strategyParams || {}), ...dials };
    delete raw.stressTool.settings.strategyParams.ladderYears;
    if (dials.ladderYears != null) raw.stressTool.settings.strategyParams.ladderYears = dials.ladderYears;
    if (raw.strategy) raw.strategy = { ...raw.strategy, id, params: { ...(raw.strategy.params || {}), ...dials } };
    delete raw.stressTool.settings.strategyState;
    return upgradeScenario(raw, { now: NOW }).scenario;
  }
  const taxYears = (plan, id) => at(NOW, () => {
    const p = planFor(effectiveStressSettings(plan, { now: NOW }), NOW);
    const c = deriveCompareConfigs(p);
    const first = p.runFirstTaxYear || p.firstTaxYear;
    return Array.from({ length: id === 'bridge-and-engine' ? c.be.cashYears : c.lr.ladderYears }, (_, i) => first + i);
  });
  for (const [id, dials] of [['ladder-and-ratchet', {}], ['ladder-and-ratchet', { ladderYears: 10 }], ['bridge-and-engine', {}], ['bridge-and-engine', { cashYears: 3 }]]) {
    it(id + ' ' + JSON.stringify(dials), () => {
      const plan = drawingBy(id, dials);
      const before = taxYears(plan, id);
      const after = taxYears(at(NOW, () => transformed(plan)), id);
      expect(before.length).toBeGreaterThan(0);
      expect(after.at(-1)).toBe(before.at(-1));          // the same last tax year
      expect(after[0]).toBe(2026);                       // run from today, the current tax year
    });
  }
});

describe('the pots\' floors after a move start from the pots entered, in the tax year they were entered (fictional, Alex)', () => {
  it('fixture 13 (Pots & Valves, locked November 2024) moved to 2023/24: its floors for 2024/25 are the pots as entered', () => {
    const raw = recordedFromStop(read('13-stopped-drawing-since'), '2023-10');   // its months begin with the stop's (7.4.3)
    raw.stressTool.settings.stoppedWork = '2023-10';
    const plan = upgradeScenario(raw, { now: NOW }).scenario;
    const m = planMoveOf(plan, NOW);
    expect(m).not.toBeNull();
    expect(m.to).toBe(2023);
    const d0 = plan.decisionTool.settings, d1 = m.decision;
    const lived = 2024 - d1.firstTaxYear;
    const por = planOfRecordFor(d1, new Date(d0.lockedAt));
    const entered = generateGlidepathSchedule({ ...d0, duration: d0.duration }, 0.04)[0].totalMin;
    expect(por.glidepath[lived].year).toBe(lived);
    expect(por.glidepath[lived].totalMin).toBe(Math.round(entered));
    for (let y = 0; y < lived; y++) expect(por.glidepath[y]).toEqual({ year: y, lived: true });
    expect(por.glidepath.at(-1).year).toBe(d1.duration);
  });
  it('the Decision tool counts the floors from the pots\' plan year (`potsYear`); without it, exactly as before', async () => {
    const ty = { pa: 12570, brl: 50270, other: 0, cpi: 0.03, isTaxEfficient: true, isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 0, confirmedSalary: 30000 };
    const settings = { baseSalary: 30000, equityMin: 300000, bondMin: 150000, cashTarget: 40000, duration: 22, firstTaxYear: 2023, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3 };
    const deps = (extra) => ({ settings, history: [], allTaxYears: { '23/24': ty, '24/25': ty, '25/26': ty, '26/27': ty }, spInfo: { amount: 0, isReceiving: false }, ...extra });
    const inPotsYear = await calcDecisionPWA('2024-11', 300000, 150000, 40000, deps({ potsYear: 1 }));
    expect([inPotsYear.adjEquityMin, inPotsYear.adjBondMin, inPotsYear.adjCashTarget]).toEqual([300000, 150000, 40000]);
    const later = await calcDecisionPWA('2026-11', 300000, 150000, 40000, deps({ potsYear: 1 }));
    expect(later.adjEquityMin).toBe(Math.round(300000 * 1.03 * 1.03 * (1 - 2 / 21)));
    const asBefore = await calcDecisionPWA('2026-11', 300000, 150000, 40000, deps({}));
    expect(asBefore.adjEquityMin).toBe(Math.round(300000 * 1.03 ** 3 * (1 - 3 / 22)));
  });
});

describe('the records after a move: what names the old start, and only that', () => {
  const recs = [
    { date: '2023-03', taxYear: '22/23', yearNum: 0, bridgeYear: true, planStartYear: 2028, settingsChecksum: 'a', sipp: 1 },
    { date: '2026-07', taxYear: '26/27', yearNum: 0, bridgeYear: true, planStartYear: 2028, strategySource: 'SIPP cash (the plan\'s year 0 is 2028/29)', strategyNote: 'Run-up…', settingsChecksum: 'a', sipp: 2 },
    { date: '2026-08', taxYear: '26/27', yearNum: 0, settingsChecksum: 'old', sipp: 3 },
    { date: '2026-09', taxYear: '26/27', yearNum: 0, sipp: 4 }
  ];
  const ds = { baseSalary: 1, unlockCount: 1 };
  const cur = decisionSettingsChecksum(ds);
  recs[0].settingsChecksum = cur; recs[1].settingsChecksum = cur;
  const out = reAnchorRecords(recs, { to: 2023, decisionBefore: ds, decisionAfter: { ...ds, firstTaxYear: 2023 } });
  const next = decisionSettingsChecksum({ ...ds, firstTaxYear: 2023 });
  it('a month still before the new start keeps its stored mark as it was (nothing writes it again); one now inside is a plan month', () => {
    expect(out[0]).toMatchObject({ yearNum: 0, bridgeYear: true, planStartYear: 2028, settingsChecksum: next });
    expect(out[1]).toMatchObject({ yearNum: 3, strategySource: MOVED_SOURCE, strategyNote: MOVED_NOTE, settingsChecksum: next });
    expect('bridgeYear' in out[1] || 'planStartYear' in out[1]).toBe(false);
  });
  it('another way of drawing\'s words on a month before the old start stay byte for byte: only the run-up\'s are replaced', () => {
    const others = [
      { date: '2026-07', taxYear: '26/27', yearNum: 0, bridgeYear: true, planStartYear: 2028, strategyId: 'floor-and-flex', strategySource: 'the essentials rung', strategyNote: 'Essentials come from the rung; the rest of this month\'s draw is treats from the flex sleeve (sell units for it).' },
      { date: '2026-08', taxYear: '26/27', yearNum: 0, bridgeYear: true, planStartYear: 2028, strategyId: 'bridge-and-engine', strategySource: 'the engine', strategyNote: 'Past the bridge: the engine pays the rest.' },
      { date: '2026-09', taxYear: '26/27', yearNum: 0, bridgeYear: true, planStartYear: 2028, strategyId: 'full-il-gilt', strategySource: 'cash, before the ladder\'s first year', strategyNote: 'Before the ladder\'s first year (2028/29): this month comes from your cash. Nothing is sold.' }
    ];
    const moved2 = reAnchorRecords(others, { to: 2023, decisionBefore: {}, decisionAfter: { firstTaxYear: 2023 } });
    for (const i of [0, 1]) {
      expect(moved2[i].strategySource).toBe(others[i].strategySource);
      expect(moved2[i].strategyNote).toBe(others[i].strategyNote);
      expect('bridgeYear' in moved2[i]).toBe(false);
    }
    expect(moved2[2]).toMatchObject({ strategySource: MOVED_SOURCE, strategyNote: MOVED_NOTE });
  });
  it('a month recorded under settings the plan was unlocked from stays so marked; one with no stamp gets none', () => {
    expect(out[2].settingsChecksum).toBe('old');
    expect(out[2].yearNum).toBe(3);
    expect('settingsChecksum' in out[3]).toBe(false);
    expect(out.map((h) => h.sipp)).toEqual([1, 2, 3, 4]);
  });
});

// ---- 7.10.0: the move under the lock is gone (spec-7100 §7, step 12); the question, its write and the words that stay -------

describe('a locked plan\'s start on "About you and when" and in the planner: the month asked once, never a move (7.10.0)', () => {
  const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
  it('asks a locked plan that does not say when work stopped; writes the month, or "Leave it", and nothing else; the later start said', () => {
    const p = alex(null);
    expect(lockedStartOf(p, { today: TODAY })).toEqual({ ask: true, leave: true, change: null, left: false, later: { start: 'April 2027' } });
    const month = stopAskPatch(p, { stopMonth: 'October 2023' }, { today: TODAY });
    expect(month.patch).toEqual({ 'stressTool.settings.stoppedWork': '2023-10' });
    expect(lockedPlanWriteRefusal(p, month.patch, getDefaultStressSettings())).toBeNull();
    expect(stopAskPatch(p, { stopAskLeft: 'yes' }, { today: TODAY }).patch).toEqual({ 'stressTool.settings.stopMonthLeft': true });
    expect(stopAskPatch(p, { stopMonth: '2027-01' }, { today: TODAY }).errors).toEqual({ stopMonth: 'month-ahead' });
    expect(stopAskPatch(p, { stopMonth: 'soon' }, { today: TODAY }).errors).toEqual({ stopMonth: 'notAMonth' });
    expect(stopAskPatch(p, { endAge: '99' }, { today: TODAY }).errors).toEqual({ plan: 'locked' });   // any other box: locked, as before
    expect(stopAskPatch(p, { moveSpDate: '14 March 2032' }, { today: TODAY }).errors).toEqual({ plan: 'locked' });   // the move's box is gone
    const draft = alex(null); draft.decisionTool.settings.locked = false;
    expect(stopAskPatch(draft, { stopMonth: '2023-10' }, { today: TODAY }).ok).toBe(false);
  });
  it('once the month is said, it stays changeable; the later start is said and never offered as a move', () => {
    expect(lockedStartOf(alex(), { today: TODAY })).toEqual({ ask: false, leave: false, change: 'October 2023', left: false, later: { start: 'April 2027' } });
    const p = alex(null); p.stressTool.settings.stopMonthLeft = true;
    expect(lockedStartOf(p, { today: TODAY })).toEqual({ ask: false, leave: false, change: null, left: true, later: { start: 'April 2027' } });
    const later = stopAskPatch(p, { stopMonth: 'October 2023' }, { today: TODAY });
    expect(later.patch).toEqual({ 'stressTool.settings.stoppedWork': '2023-10' });
    expect(lockedPlanWriteRefusal(p, later.patch, getDefaultStressSettings())).toBeNull();
  });
  it('the guard: year 0 moved under the lock — one copy or both, with the keys the move used to rewrite — is refused', () => {
    const p = alex();
    const m = planMoveOf(p, NOW);
    expect(m).not.toBeNull();   // the transform still reads (a plan stored with a later start)
    const both = { 'stressTool.settings.firstTaxYear': m.to, 'decisionTool.settings.firstTaxYear': m.to };
    for (const k of ['shapeAgeNow', 'duration', 'incomeSteps']) { both['stressTool.settings.' + k] = m.stress[k]; both['decisionTool.settings.' + k] = m.decision[k]; }
    const refused = lockedPlanWriteRefusal(p, both, getDefaultStressSettings(), { now: NOW });
    expect(refused).toEqual(expect.arrayContaining(['stress.firstTaxYear', 'decision.firstTaxYear']));
    expect(lockedPlanWriteRefusal(p, { 'stressTool.settings.firstTaxYear': m.to }, getDefaultStressSettings())).toEqual(['stress.firstTaxYear']);
    expect(lockedPlanWriteRefusal(p, { 'strategy.params': { ...(p.strategy && p.strategy.params), cashYears: 6 } }, getDefaultStressSettings())).toEqual(['strategy']);
  });
  it('the planner\'s line: the question, the month folded, the later start with how it changes; no button moves the start', () => {
    const ask = lockedStartHtml({ ask: true, start: 2027 });
    expect(ask).toContain('<div class="row-flex"');
    expect(ask).toContain('id="tmLockedStopLeave"');
    expect(plain(ask)).toContain('When did you stop work?');
    const changed = lockedStartHtml({ stopped: '2023-10', later: 2027 });
    expect(changed).toContain('Change the month you stopped work');
    expect(changed).toContain('The right month<input type="month" id="tmLockedStopMonth"');
    expect(plain(changed)).toContain('Your plan is set to start in April 2027. To change its start, unlock the plan (Settings), change the start under Timing, and lock it again.');
    const left = lockedStartHtml({ left: true });
    expect(left).toContain('id="tmLockedStopLater"');
    expect(left).not.toContain('tmLockedStopLeave');
    expect(lockedStartHtml({})).toBe('');
    for (const html of [ask, changed, left, lockedStartHtml({ ask: true, start: 2027, later: 2027 })]) {
      expect(html).not.toMatch(/tmMoveStartBtn|tmMoveNowBtn|moveLockedPlanStart|Move the plan/);
      expect(bannedHits(plain(html), ['all', 'retired']), html).toEqual([]);
    }
    for (const w of [ABOUT.lockedStart.ask, ABOUT.lockedStart.askHelp, ABOUT.lockedStart.laterLocked.replace('{start}', 'April 2027'), ...Object.values(LOCKED_STOP_REFUSED)]) expect(bannedHits(w, ['all', 'retired']), w).toEqual([]);
  });
  it('a month said wrongly is put right while the plan is locked, by the same rules: never ahead, never before 16', () => {
    const p = alex('2015-10');
    expect(stopChangeOf(p, NOW)).toBe('2015-10');
    const fix = stopAskPatch(p, { stopMonth: '2023-10' }, { today: TODAY });
    expect(fix.patch).toEqual({ 'stressTool.settings.stoppedWork': '2023-10' });
    expect(lockedPlanWriteRefusal(p, fix.patch, getDefaultStressSettings())).toBeNull();
    expect(stopAskPatch(p, { stopMonth: '2027-02' }, { today: TODAY }).errors).toEqual({ stopMonth: 'month-ahead' });
    expect(stopAskPatch(p, { stopMonth: '1970-01' }, { today: TODAY }).errors).toEqual({ stopMonth: 'too-early' });   // Alex is 64
    expect(lockedStopAnswer('2023-10', NOW, 64)).toEqual({ error: null, value: '2023-10' });
    expect(lockedStopAnswer('1970-01', NOW, 64).error).toBe('too-early');
    for (const k of ['required', 'notAMonth', 'month-ahead', 'too-early']) { expect(LOCKED_STOP_REFUSED[k]).toBeTruthy(); expect(ABOUT.lockedStart.errors[k]).toBeTruthy(); }
    expect(ABOUT.lockedStart.help).toBe('Like 2023-10, or October 2023.');
  });
  it('plan vs actual\'s heading: the lock\'s date, or — for a plan whose start was moved before 7.10.0 — when it was written again', () => {
    const day = (d) => d.toISOString().slice(0, 10);
    const por = { savedAt: '2026-07-01T08:15:00.000Z', assumedCpi: 0.04 };
    expect(planVsActualWords(por, '2026-07-01T08:15:00.000Z', day).head).toBe('— against the projection frozen when this plan was locked (2026-07-01, 4% assumed CPI)');
    const w = planVsActualWords({ ...por, savedAt: '2026-11-04T08:15:00.000Z', rewrittenFor: 'start moved to 2023/24' }, '2026-07-01T08:15:00.000Z', day);
    expect(w.head).toBe('— against the projection written again on 2026-11-04, when the plan\'s start moved to 2023/24 (the plan was locked 2026-07-01; 4% assumed CPI)');
    expect(w.foot).not.toMatch(/never moves/);
    expect(writtenWhen(alex().planDocument)).toBe('As written when the plan was locked');
  });
  it('the anchor read for the question is the Decision tool\'s', () => {
    expect(moveAnchorOf({ firstTaxYear: 2027 }, { firstTaxYear: 2028 })).toBe(2028);
    expect(moveAnchorOf({ firstTaxYear: 2027 }, {})).toBe(2027);
    expect(moveAnchorOf({}, {})).toBeNull();
    expect(positionAfterMove(planMoveOf(alex(), NOW).stress, null)).toBeNull();
  });
});
