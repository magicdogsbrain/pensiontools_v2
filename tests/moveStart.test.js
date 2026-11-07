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
  stopAskOf, stopLeftOf, moveOfferOf, moveBlockedOf, stopChangeOf, planMoveOf, reAnchorCopy, reAnchorRecords, reAnchorAllowance, positionAfterMove, moveAnchorOf,
  strategyBlockAfterMove, moveFactsOf, REANCHOR_STRESS_KEYS, REANCHOR_DECISION_KEYS, MOVED_SOURCE, MOVED_NOTE
} from '../src/services/PlanMove.js';
import { movedPlanOf, movePatch, noteMoved } from '../src/answers/plan/moveStart.js';
import { runForDocument, planFor } from '../src/answers/plan/lastsRun.js';
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';
import { applyPatch } from '../src/answers/plan/about.js';
import { lockedStartOf, stopAskPatch, lockedStopAnswer } from '../src/answers/plan/about.js';
import { ABOUT } from '../src/v7/copy/about.js';
import { MOVE_START_WRITES, ALL_WRITES, WRITES, CLOSE_WRITES } from '../src/answers/plan/schema.js';
import { lockedPlanWriteRefusal, lockedWriteRefusal, LOCKED_BOOKKEEPING } from '../src/services/LockedPlanGuard.js';
import { timingPinPatch, TIMING_PIN_KEYS, deriveTiming, decisionAnchorYear } from '../src/services/PlanTiming.js';
import { lockedPotsAsOf } from '../src/services/PlanFromToday.js';
import { decisionSettingsChecksum, planOfRecordFor } from '../src/services/PlanCommit.js';
import { compileSteps, defaultSpYear } from '../src/services/IncomeSchedule.js';
import { migrateStressSettings } from '../src/services/PlanReading.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';
import { generateGlidepathSchedule } from '../src/services/GlidepathService.js';
import { recordYearLabel, recordSourceWords, yearRowHtml, firstSetUpPlanYear, lockedStartHtml, moveStartQuestion, moveStartDoneWords, spCountOf, planVsActualWords, LOCKED_STOP_REFUSED } from '../src/ui/planStartUi.js';
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
/** The move as the planner makes it: the run of the moved plan, then the one patch. */
function moved(plan, now = NOW) {
  return at(now, () => {
    const mp = movedPlanOf(plan, { now });
    const run = runForDocument(mp.plan, { today: TODAY, essentials: 0 });
    return movePatch(plan, { now, run });
  });
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

describe('the move on fixture 03 (§7 "the migration")', () => {
  const before = alex();
  const out = moved(before);
  const after = applyPatch(before, out.patch);

  it('is one write of declared paths only, which the guard lets through on the plan as stored', () => {
    expect(out.ok).toBe(true);
    // Firestore refuses `undefined` anywhere in a document
    const hasUndefined = (v) => v === undefined || (Array.isArray(v) ? v.some(hasUndefined) : !!v && typeof v === 'object' && Object.values(v).some(hasUndefined));
    expect(hasUndefined(out.patch)).toBe(false);
    for (const k of Object.keys(out.patch)) expect(MOVE_START_WRITES).toContain(k);
    expect(lockedPlanWriteRefusal(before, out.patch, getDefaultStressSettings())).toBeNull();
    // the preview sends it too, from 6.55.0 (effects/planWrite.js moveStart): every path is among its declared writes
    for (const k of MOVE_START_WRITES) expect(ALL_WRITES).toContain(k);
    // the lock's position is V7's to write only as the move's or as the close's, when the close locks a plan that was not
    // locked (6.56.0)
    for (const list of Object.values(WRITES)) expect(list).not.toContain('decisionTool.settings.lockedPosition');
    expect(ALL_WRITES.filter((k) => k === 'decisionTool.settings.lockedPosition' && !CLOSE_WRITES.includes(k) && !MOVE_START_WRITES.includes(k))).toEqual([]);
    expect(REANCHOR_STRESS_KEYS.map((k) => 'stressTool.settings.' + k).concat(REANCHOR_DECISION_KEYS.map((k) => 'decisionTool.settings.' + k))).toEqual(MOVE_START_WRITES.slice(0, REANCHOR_STRESS_KEYS.length + REANCHOR_DECISION_KEYS.length));
  });
  it('rewrites both anchors to the stop\'s tax year; the steps keep their ages, the first one longer (§6 decision 4); the end age kept', () => {
    for (const s of [after.stressTool.settings, after.decisionTool.settings]) {
      expect(s.firstTaxYear).toBe(2023);
      expect(s.shapeAgeNow).toBe(62);
      expect(s.duration).toBe(24);
      expect(s.incomeSteps).toEqual([{ amount: 34000, fromAge: 62 }, { amount: 29000, fromAge: 72 }, { amount: 24000, decline: 1, fromAge: 79 }]);
    }
    const old = before.stressTool.settings.targetSchedule, now = after.stressTool.settings.targetSchedule;
    expect(now.slice(4)).toEqual(old);                      // every year from the old start on: the figure it was, byte for byte
    expect(now.slice(0, 4)).toEqual([34000, 34000, 34000, 34000]);   // the first step from the stop's tax year
    // The steps, compiled afresh, give the same figures. Close, not equal: a falling step compounds with powers that
    // differ in the last digit between Node versions, while the saved figures above are compared byte for byte.
    const compiled = compileSteps(after.stressTool.settings, 62);
    expect(compiled).toHaveLength(now.length);
    compiled.forEach((v, y) => expect(v).toBeCloseTo(now[y], 6));
    expect(after.decisionTool.settings.targetSchedule).toEqual(now);
    expect(deriveTiming(after.stressTool.settings, NOW).shapeAgeNow + after.stressTool.settings.duration - 1).toBe(85);
    expect(decisionAnchorYear(after.decisionTool.settings, after.decisionTool.taxYears, null, after.stressTool.settings)).toBe(2023);
  });
  it('changes no other setting, and leaves the lock record alone: no unlock, no default of an unlock, the unlock count as it was', () => {
    const ss0 = before.stressTool.settings, ss1 = after.stressTool.settings;
    for (const k of new Set([...Object.keys(ss0), ...Object.keys(ss1)])) if (!REANCHOR_STRESS_KEYS.includes(k)) expect(ss1[k], k).toEqual(ss0[k]);
    const ds0 = before.decisionTool.settings, ds1 = after.decisionTool.settings;
    for (const k of new Set([...Object.keys(ds0), ...Object.keys(ds1)])) if (!REANCHOR_DECISION_KEYS.includes(k)) expect(ds1[k], k).toEqual(ds0[k]);
    expect(ds1.locked).toBe(true);
    expect(ds1.unlockCount).toBe(ds0.unlockCount);
    expect(ds1.unlockedAt).toBe(ds0.unlockedAt);
    expect('chargesPct' in out.patch || 'stressTool.settings.chargesPct' in out.patch || 'stressTool.settings.isaGrowth' in out.patch).toBe(false);
  });
  it('records where the lock\'s pots stood under the new year 0: plan year 3, three months in (locked 1 July 2026)', () => {
    expect(after.decisionTool.settings.lockedPosition).toEqual({ elapsedYears: 3, monthsIntoYear: 3 });
    expect(lockedPotsAsOf(after)).toEqual({ elapsedYears: 3, monthsIntoYear: 3 });
    expect(decisionSettingsChecksum(after.decisionTool.settings)).toBe(decisionSettingsChecksum({ ...after.decisionTool.settings, lockedPosition: null }));
  });
  it('re-stamps every record and rewrites only the derived fields that named the old start — every other byte the same', () => {
    const h0 = before.decisionTool.history, h1 = after.decisionTool.history;
    expect(h1.length).toBe(h0.length);
    const sum = decisionSettingsChecksum(after.decisionTool.settings);
    h1.forEach((h, i) => {
      expect(JSON.stringify(without(h, DERIVED))).toBe(JSON.stringify(without(h0[i], DERIVED)));
      expect(h.yearNum).toBe(i === 0 ? 0 : 3);   // the month work stopped is the plan's first; July to September 2026 its year 3
      expect(h.bridgeYear).toBeUndefined();
      expect(h.planStartYear).toBeUndefined();
      expect(h.strategySource).toBe(MOVED_SOURCE);
      expect(h.strategyNote).toBe(MOVED_NOTE);
      expect(h.settingsChecksum).toBe(sum);
      expect(h0[i].settingsChecksum).not.toBe(sum);
    });
    // the tax years hold no plan year: untouched
    expect(after.decisionTool.taxYears).toEqual(before.decisionTool.taxYears);
  });
  it('archives the document and the plan of record, and writes both again as seen from where the pots stood', () => {
    expect(after.planDocumentArchive.length).toBe((before.planDocumentArchive || []).length + 1);
    expect(without(after.planDocumentArchive.at(-1), ['archivedAt'])).toEqual(before.planDocument);
    expect(after.decisionTool.planOfRecordArchive.length).toBe((before.decisionTool.planOfRecordArchive || []).length + 1);
    expect(without(after.decisionTool.planOfRecordArchive.at(-1), ['archivedAt'])).toEqual(before.decisionTool.planOfRecord);
    const doc = after.planDocument;
    expect(doc.timing.firstTaxYear).toBe(2023);
    expect(doc.pots.asOfPlanYear).toBe(3);
    expect(doc.timing.monthsIntoYear).toBe(3);
    expect('bridgeCash' in doc.assumptions).toBe(false);     // 7.4.2: no extra cash, ever (was: 0 here) // no cash set aside for a start that has passed
    expect(doc.lockedAt).toBe(before.decisionTool.settings.lockedAt);
    expect(doc.note).toBe(noteMoved(2023));
    expect(doc.timeline[0]).toMatchObject({ y: 0, taxYear: '2023/24', age: 62, lived: true });
    expect(doc.timeline.slice(0, 3).map((t) => t.lived)).toEqual([true, true, true]);   // years 0 to 2, lived
    expect(doc.timeline[3].lived).toBeUndefined();
    // the ladder is bought from 2026/27 (the plan year the pots belong to), no lived year bought again
    const ladder = documentLadder(doc, 'full-il-gilt');
    expect(ladder.years[0].Y).toBe(2026);
    expect(ladder.years.every((y) => y.Y >= 2026)).toBe(true);
    expect(doc.strategy.p.runFirstTaxYear).toBe(2026);
    // the plan of record: years 0 to 2 lived (the schedule's own figure), from year 3 on the projection, dated today
    const por = after.decisionTool.planOfRecord;
    expect(por.drawdown.slice(0, 3)).toEqual([0, 1, 2].map((year) => ({ year, lived: true, sippDraw: 34000 })));
    expect(por.drawdown[3].year).toBe(3);
    expect(por.drawdown[3].lived).toBeUndefined();
    expect(por.savedAt).toBe(NOW.toISOString());
    expect(por.settingsChecksum).toBe(decisionSettingsChecksum(after.decisionTool.settings));
  });
  it('adds one journey entry, the stage the move leaves the plan in', () => {
    expect(after.journey.length).toBe(before.journey.length + 1);
    expect(after.journey.slice(0, -1)).toEqual(before.journey);
    expect(after.journey.at(-1)).toMatchObject({ stage: 'running', label: 'The plan’s start moved to 2023/24, the tax year you stopped work', at: NOW.toISOString() });
    // the new document carries it: it says why it was written again
    expect(after.planDocument.journey.at(-1).label).toBe(after.journey.at(-1).label);
  });
  it('a migration of the chain touches none of it (no step may change a locked plan\'s settings, records, document or yardstick)', () => {
    const again = upgradeScenario(copy(after), { now: NOW }).scenario;
    for (const part of [['stressTool', 'settings'], ['decisionTool', 'settings'], ['decisionTool', 'history'], ['decisionTool', 'planOfRecord'], ['planDocument']]) {
      const pick = (o) => part.reduce((x, k) => (x == null ? x : x[k]), o);
      expect(pick(again), part.join('.')).toEqual(pick(after));
    }
  });
  it('the moved plan is offered no second move, and asked nothing', () => {
    expect(moveOfferOf(after, NOW)).toBeNull();
    expect(stopAskOf(after, NOW)).toBe(false);
  });
});

describe('after the move: the history, the strip and the ladder\'s month read the new start', () => {
  const after = applyPatch(alex(), moved(alex()).patch);
  const anchor = decisionAnchorYear(after.decisionTool.settings, after.decisionTool.taxYears, null, after.stressTool.settings);
  it('each record reads as a month of the plan: "Year 3", paid from the cash years, never "before the plan\'s income starts"', () => {
    const [stopMonth, ...lived] = after.decisionTool.history;
    expect(recordYearLabel(stopMonth, anchor)).toBe('Year 0');   // the month work stopped, recorded (7.4.3)
    for (const h of lived) {
      expect(recordYearLabel(h, anchor)).toBe('Year 3');
      expect(recordSourceWords(h, anchor, 'before', 'otherwise')).toBe(MOVED_SOURCE);
    }
  });
  it('the strip: plan year 3 of 24, no months before the start; the ladder\'s month this tax year is a cash year, and its first gilt later', () => {
    const w = whereAmI(after.planDocument, { today: NOW, history: after.decisionTool.history });
    expect(w.planYear).toBe(3);
    expect(w.beforeStart).toBe(false);
    expect(w.planStart).toBe('2023/24');
    const ladder = documentLadder(after.planDocument, 'full-il-gilt');
    const lp = ladderPosition(ladder, { today: NOW });
    expect(lp.phase).toBe('running');
    const advice = ladderMonthAdvice(lp, firstRungOf(ladder), 2833, 3);
    expect(advice.floorLabel).toBe('the cash years bucket');
    expect(advice.note).toContain('Your cash pays until the ladder\'s first gilt, from ' + firstRungOf(ladder).label);
    // a lived month of 2023/24 is before the ladder's first year: cash, a label that names no year
    expect(ladderMonthAdvice(ladderPosition(ladder, { today: new Date(2023, 11, 15) }), firstRungOf(ladder), 2833, 0).floorLabel).toBe('cash, until the first gilt pays');
  });
  it('plan vs actual: the part year set up mid-year is plan year 3 now, never "a first year"; a plan set up in its year 0 says it as before', () => {
    const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
    const ty = after.decisionTool.taxYears, recs = after.decisionTool.history.slice(1), months = ty['26/27'].remainingMonths;   // year 3's months
    expect(months).toBeGreaterThan(0);
    expect(months).toBeLessThan(12);
    const first = firstSetUpPlanYear(ty, anchor);
    expect(first).toBe(3);
    const row = yearRowHtml(3, recs, after.decisionTool.planOfRecord.drawdown[3], ty['26/27'], first, gbp);
    expect(row).toContain('<td>Year 3 <span class="hint">(3 mo of the ' + months + ' months set up for this tax year)</span></td>');
    expect(row).not.toMatch(/first year/);
    expect(yearRowHtml(0, recs, after.decisionTool.planOfRecord.drawdown[3], ty['26/27'], 0, gbp)).toContain('(3 mo of a ' + months + '-month first year)');
    // a lived year: the draw only
    expect(yearRowHtml(1, recs, after.decisionTool.planOfRecord.drawdown[1], null, first, gbp)).toContain('lived before the plan was locked');
  });
});

describe('the guard: `reAnchor` passes only as the move, both copies to the same value', () => {
  const plan = alex();
  const m = planMoveOf(plan, NOW);
  const S = 'stressTool.settings', D = 'decisionTool.settings';
  const write = (stress, decision) => ({ [S]: stress, [D]: decision });
  const refusal = (data) => lockedPlanWriteRefusal(plan, data, getDefaultStressSettings());

  it('the move itself: both copies at once', () => {
    expect(refusal(write(m.stress, m.decision))).toBeNull();
    expect(reAnchorAllowance({ stress: plan.stressTool.settings, decision: plan.decisionTool.settings }, { stress: m.stress, decision: m.decision })).not.toBeNull();
  });
  it('refused: one copy alone, the two copies apart, a year that is not the stop\'s, a later year', () => {
    expect(refusal({ [S]: m.stress })).not.toBeNull();                                         // the Stress copy alone
    expect(refusal({ [D]: m.decision })).not.toBeNull();                                       // the Decision copy alone
    expect(refusal(write({ ...m.stress, firstTaxYear: 2026 }, m.decision))).not.toBeNull();    // apart
    const at26 = { ...plan.stressTool.settings, stoppedWork: '2026-05' };
    const m26 = planMoveOf({ ...plan, stressTool: { settings: { ...at26 } } }, NOW);
    expect(m26.to).toBe(2026);
    expect(refusal(write(m26.stress, m.decision))).not.toBeNull();                             // both moved, to different years
    expect(refusal(write({ ...m.stress, firstTaxYear: 2022 }, { ...m.decision, firstTaxYear: 2022 }))).not.toBeNull();   // not the stop's
    expect(refusal(write({ ...m.stress, firstTaxYear: 2028 }, { ...m.decision, firstTaxYear: 2028 }))).not.toBeNull();   // later, not back
  });
  it('refused: any key the move works out at another value, any other key, the lock record moved, the position made up', () => {
    expect(refusal(write({ ...m.stress, duration: m.stress.duration + 1 }, m.decision))).not.toBeNull();
    expect(refusal(write(m.stress, { ...m.decision, shapeAgeNow: 60 }))).not.toBeNull();
    expect(refusal(write({ ...m.stress, targetSchedule: m.stress.targetSchedule.slice(1) }, m.decision))).not.toBeNull();
    expect(refusal(write({ ...m.stress, baseSalary: 1 }, m.decision))).toEqual(['stress.baseSalary']);
    expect(refusal(write(m.stress, { ...m.decision, equityMin: 1 }))).toEqual(['decision.equityMin']);
    expect(refusal(write(m.stress, { ...m.decision, unlockCount: 1, unlockedAt: 'x' }))).not.toBeNull();
    expect(refusal(write(m.stress, { ...m.decision, lockedPosition: { elapsedYears: 0, monthsIntoYear: 0 } }))).not.toBeNull();
    expect(refusal(write({ ...m.stress, stoppedWork: '2023-13' }, m.decision))).not.toBeNull();
  });
  it('refused: a plan that says it is still to retire (the move is never offered to one)', () => {
    const p = alex(); p.stressTool.settings.retired = false;
    expect(lockedPlanWriteRefusal(p, write(m.stress, m.decision), getDefaultStressSettings())).not.toBeNull();
  });
  it('never through a save of one kind (the repositories\' check sees one copy): a year 0 moved there is refused', () => {
    expect(lockedWriteRefusal('decision', { locked: true, stored: plan.decisionTool.settings, next: m.decision })).not.toBeNull();
    expect(lockedWriteRefusal('stress', { locked: true, stored: plan.stressTool.settings, next: m.stress })).not.toBeNull();
  });
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
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings': m.stress, 'decisionTool.settings': m.decision }, getDefaultStressSettings())).toBeNull();
    // the guard refuses the year moved as if it were one
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings': { ...m.stress, statePensionYear: 16 }, 'decisionTool.settings': m.decision }, getDefaultStressSettings())).not.toBeNull();
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
  it('fixture 03: the ladder\'s first gilt pays the tax year it paid before the move; cash years 2 become 6, in both copies and the strategy block', () => {
    const before = alex();
    const out = moved(before);
    const after = applyPatch(before, out.patch);
    const L0 = documentLadder(before.planDocument, 'full-il-gilt'), L1 = documentLadder(after.planDocument, 'full-il-gilt');
    expect(firstRungOf(L1)).toEqual(firstRungOf(L0));
    expect(L1.years.filter((y) => y.from === 'cash').map((y) => y.Y)).toEqual([2026, 2027, 2028]);
    expect(after.stressTool.settings.strategyParams.cashYears).toBe(6);
    expect(after.decisionTool.settings.strategyParams.cashYears).toBe(6);
    expect(after.strategy.params.cashYears).toBe(6);
    expect(out.patch['strategy.params']).toEqual({ ...before.strategy.params, cashYears: 6 });
    expect(lockedPlanWriteRefusal(before, out.patch, getDefaultStressSettings())).toBeNull();
    // the strategy block moved any other way, or alone, is refused
    expect(lockedPlanWriteRefusal(before, { ...out.patch, 'strategy.params': { ...before.strategy.params, cashYears: 3 } }, getDefaultStressSettings())).not.toBeNull();
    expect(lockedPlanWriteRefusal(before, { 'strategy.params': out.patch['strategy.params'] }, getDefaultStressSettings())).toEqual(['strategy']);
  });
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
      const after = taxYears(at(NOW, () => movedPlanOf(plan, { now: NOW })).plan, id);
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

describe('back-fill: the lived months back to the new start, never over a recorded month (§6 decision 12)', () => {
  const after = applyPatch(alex(), moved(alex()).patch);
  // the months of 2026/27 the fixture records: the month work stopped (recorded too, 7.4.3) left out, so the gap is the whole way back
  const hist = after.decisionTool.history.filter((h) => h.date !== '2023-10');
  const taxYears = after.decisionTool.taxYears;
  const start = planFillStart(2023, '2023-10');
  it('the plan\'s first month is the month work stopped (later than its April), else its April', () => {
    expect(start).toBe('2023-10');
    expect(planFillStart(2023, '2022-06')).toBe('2023-04');
    expect(planFillStart(2023, null)).toBe('2023-04');
    expect(planFillStart(null, '2023-10')).toBeNull();
  });
  it('the chooser reaches the lived months; without the plan\'s first month it reaches as it did', () => {
    expect(earliestFillMonth(hist, taxYears)).toBe('2026-04');
    expect(earliestFillMonth(hist, taxYears, start)).toBe('2023-10');
    const o = fillOffer(hist, '2026-11', { taxYears, taxYearOf: taxYearKeyOf, planStart: start, from: '2023-10' });
    expect(o.choices[0]).toBe('2023-10');
    for (const m of ['2026-07', '2026-08', '2026-09']) expect(o.choices).not.toContain(m);   // recorded: never offered, never written over
    // 2023/24 is not set up: the fill stops before it and says to set it up from the plan's first month
    expect(o.months).toEqual([]);
    expect(o.notSetUp).toEqual({ key: '23/24', month: '2023-10' });
    expect(o.help).toContain('put October 2023, the plan\'s first month, in the month box');
  });
  it('with the tax years from 2023/24 set up, the months from the stop are filled in, across the tax years, recorded months left alone', () => {
    const whole = { yearSetupComplete: true, startMonth: 4, remainingMonths: 12, grossIncomeToDate: 0 };
    const ty = { ...taxYears, '23/24': { yearSetupComplete: true, startMonth: 10, remainingMonths: 6, grossIncomeToDate: 0 }, '24/25': whole, '25/26': whole };
    const o = fillOffer(hist, '2026-11', { taxYears: ty, taxYearOf: taxYearKeyOf, planStart: start, from: '2023-10' });
    expect(o.months[0]).toBe('2023-10');
    for (const m of ['2024-03', '2024-04', '2026-03', '2026-04']) expect(o.months).toContain(m);
    for (const m of ['2026-07', '2026-08', '2026-09']) expect(o.months).not.toContain(m);
    expect(o.months.every((m) => !hist.some((h) => String(h.date).slice(0, 7) === m))).toBe(true);
    // each filled-in month carries the 6.50.0 marks (the design's `copied`): filled in later, and when
    expect(fillMarks(NOW.toISOString())).toEqual({ filledIn: true, filledInOn: NOW.toISOString() });
  });
  it('the help for a year not set up names April when the plan\'s first month is not inside it', () => {
    expect(notSetUpWords('24/25', '2024-04', null, '2023-10')).toContain('put April 2024 in the month box');
  });
});

describe('V7: the question on a locked plan\'s "About you and when", and the move made there (6.55.0)', () => {
  it('asks a locked plan that does not say when work stopped; writes the month, or "Leave it", and nothing else', () => {
    const p = alex(null);
    // 7.4.0: its start is later than this tax year, so the move to this tax year is offered beside the question, and "Leave
    // it" is not (the plan has something to move)
    expect(lockedStartOf(p, { today: TODAY })).toMatchObject({ ask: true, leave: false, move: null, blocked: null, change: null, left: false, nowMove: { yearStop: '2026/27', yearStart: '2027/28', how: { thisYear: true } } });
    const month = stopAskPatch(p, { stopMonth: 'October 2023' }, { today: TODAY });
    expect(month.patch).toEqual({ 'stressTool.settings.stoppedWork': '2023-10' });
    expect(lockedPlanWriteRefusal(p, month.patch, getDefaultStressSettings())).toBeNull();
    expect(stopAskPatch(p, { stopAskLeft: 'yes' }, { today: TODAY }).ok).toBe(false);   // 7.4.0: nothing to leave while the start is later
    // a plan whose start is this tax year, with a month still marked as before it: the plain question, "Leave it" written
    const now0 = alex(null); now0.stressTool.settings.firstTaxYear = 2026; now0.decisionTool.settings.firstTaxYear = 2026;
    expect(lockedStartOf(now0, { today: TODAY })).toMatchObject({ ask: true, leave: true, nowMove: null });
    expect(stopAskPatch(now0, { stopAskLeft: 'yes' }, { today: TODAY }).patch).toEqual({ 'stressTool.settings.stopMonthLeft': true });
    expect(stopAskPatch(p, { stopMonth: '2027-01' }, { today: TODAY }).errors).toEqual({ stopMonth: 'month-ahead' });
    expect(stopAskPatch(p, { stopMonth: 'soon' }, { today: TODAY }).errors).toEqual({ stopMonth: 'notAMonth' });
    expect(stopAskPatch(p, { endAge: '99' }, { today: TODAY }).errors).toEqual({ plan: 'locked' });   // any other box: locked, as before
    const draft = alex(null); draft.decisionTool.settings.locked = false;
    expect(stopAskPatch(draft, { stopMonth: '2023-10' }, { today: TODAY }).ok).toBe(false);
  });
  it('once the month is said, the move is offered there, its confirm line by line; the month stays changeable, before and after a move', () => {
    const ls = lockedStartOf(alex(), { today: TODAY });
    expect({ ...ls, move: { ...ls.move, confirm: undefined } }).toEqual({ ask: false, leave: false, nowMove: null, spShown: '', spError: null, spPlanYear: null, move: { yearStop: '2023/24', yearStart: '2027/28', month: 'October 2023', stepped: true, spAsk: false, records: null, start: 'April 2027', how: {}, confirm: undefined }, blocked: null, change: 'October 2023', left: false });
    // 7.3.3: no line says the months were "before the plan's income starts" (the old 'bridgedAll'): they are months of the plan
    expect(ls.move.confirm.map((l) => l.id)).toEqual(['first', 'steps', 'ends', 'months', 'documentLadder', 'sp', 'moreLadder', 'fill', 'notAffected']);
    expect(lockedStartOf(applyPatch(alex(), moved(alex()).patch), { today: TODAY })).toEqual({ ask: false, leave: false, move: null, nowMove: null, blocked: null, change: 'October 2023', left: false, spShown: '', spError: null, spPlanYear: null });
  });
  it('after "Leave it" the month can still be said, folded, by the same one write: no unlock needed', () => {
    const p = alex(null); p.stressTool.settings.stopMonthLeft = true;
    // 7.4.0: "Leave it" no longer puts the question away while the plan's start is later than this tax year
    expect(lockedStartOf(p, { today: TODAY })).toMatchObject({ ask: true, leave: false, move: null, blocked: null, change: null, left: false });
    const later = stopAskPatch(p, { stopMonth: 'October 2023' }, { today: TODAY });
    expect(later.patch).toEqual({ 'stressTool.settings.stoppedWork': '2023-10' });
    expect(lockedPlanWriteRefusal(p, later.patch, getDefaultStressSettings())).toBeNull();
    expect(stopAskPatch(p, { stopAskLeft: 'yes' }, { today: TODAY }).ok).toBe(false);   // "Leave it" again: nothing to write
    expect(stopAskPatch(p, { stopMonth: '2027-02' }, { today: TODAY }).errors).toEqual({ stopMonth: 'month-ahead' });
    // the month said, the move is offered as for any other
    expect(lockedStartOf(applyPatch(p, later.patch), { today: TODAY }).move).toMatchObject({ yearStop: '2023/24', yearStart: '2027/28' });
  });
  it('the confirm says what the planner\'s own confirm says, from the same facts (PlanMove.moveFactsOf), in the preview\'s words', () => {
    const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
    const plan = alex();
    const m = planMoveOf(plan, NOW);
    const facts = moveFactsOf(plan, m);
    expect(facts).toMatchObject({ stepAmount: 34000, stepped: true, endAge: 85, bridged: 4, runYear: 2026, ladder: true, dated: false, sp: { taxYear: 2028, before: 1, after: 5 } });
    expect(facts.months).toEqual(['2023-10', '2026-07', '2026-08', '2026-09']);   // the month work stopped, recorded (7.4.3)
    const theirs = plain(moveStartQuestion(m, facts).html);
    const C = ABOUT.lockedStart.confirm;
    const fillIn = (s, slots) => s.replace(/\{(\w+)\}/g, (x, k) => (k in slots ? slots[k] : x));
    const ours = lockedStartOf(plan, { today: TODAY }).move.confirm.map((l) => fillIn(C.lines[l.id], l.slots));
    // each fact the planner states, stated here in the same words (only the page names are the preview's own)
    const same = [
      ['The plan’s first tax year becomes 2023/24, the tax year you stopped work (October 2023); it was 2027/28.', 'The plan\'s first tax year becomes 2023/24 , the tax year you stopped work (October 2023); it was 2027/28.'],
      ['The plan stays locked: nothing is unlocked and no setting is added.', 'The plan stays locked: nothing is unlocked and no setting is added.'],
      ['the first step keeps its amount (£34,000 a year) and now runs from 2023/24, at 62; your later steps keep their ages.', 'the first step keeps its amount (£34,000 a year) and now runs from 2023/24, at 62; your later steps keep their ages.'],
      ['The plan still runs to age 85, 4 years longer from its new start.', 'The plan still runs to age 85, 4 years longer from its new start.'],
      ['4 recorded months (October 2023 to September 2026) keep every figure you entered. They now count from the new start, 2023/24.', '4 recorded months (October 2023 to September 2026) keep every figure you entered. They now count from the new start, 2023/24.'],
      ['the gilt ladder is bought from 2026/27 on, no year you have already lived is bought or paid for again', 'the gilt ladder is bought from 2026/27 on, no year you have already lived is bought or paid for again'],
      ['Your State Pension still starts in 2028/29, as before; only the plan’s count of years to it changes (5 from the new start, not 1).', 'Your State Pension still starts in 2028/29, as before; only the plan\'s count of years to it changes (5 from the new start, not 1).'],
      ['the plan counts 4 more years to the same end age, and the ladder’s cost leaves out the years already lived.', 'The plan counts 4 more years to the same end age, and the ladder\'s cost leaves out the years already lived.']
    ];
    for (const [mine, planner] of same) {
      expect(ours.join(' '), mine).toContain(mine);
      expect(theirs, planner).toContain(planner);
    }
    expect(ours.join(' ')).not.toMatch(/before the plan|set aside/);   // 7.3.3
    expect(theirs).not.toMatch(/before the plan|set aside/);
    expect(fillIn(C.yes, { yearStop: '2023/24' })).toBe('Move the start to 2023/24');
    expect(C.no).toBe('Keep it as it is');
    for (const w of ours) expect(bannedHits(w, ['all', 'retired', 'record']), w).toEqual([]);
    for (const w of ours) expect(w).not.toMatch(/\{\w+\}|undefined|null/);
  });
  it('a level income and one recorded month: the words for one, never "1 years" or "1 recorded months"', () => {
    const raw = recordedFromStop(read('04-buckets-running'), '2025-06'); raw.stressTool.settings.stoppedWork = '2025-06';   // its months begin with the stop's (7.4.3)
    const plan = upgradeScenario(raw, { now: NOW }).scenario;
    plan.decisionTool.history = plan.decisionTool.history.slice(0, 1);
    const ls = lockedStartOf(plan, { today: TODAY });
    const ids = ls.move.confirm.map((l) => l.id);
    expect(ids).toContain('level');
    expect(ids).toContain('endsOne');
    expect(ids).toContain('monthOne');
    expect(ids).toContain('moreOne');
    expect(ids).not.toContain('steps');
    const C = ABOUT.lockedStart.confirm;
    const words = ls.move.confirm.map((l) => C.lines[l.id].replace(/\{(\w+)\}/g, (x, k) => (k in l.slots ? l.slots[k] : x))).join(' ');
    expect(words).toContain('Your income: it stays £30,000 a year, now from 2025/26, at');
    expect(words).not.toMatch(/\b1 (years|months|recorded months)\b/);
  });
  it('a month said wrongly is put right while the plan is locked, by the same rules: never ahead, never before 16', () => {
    const p = alex('2015-10');
    expect(stopChangeOf(p, NOW)).toBe('2015-10');
    const fix = stopAskPatch(p, { stopMonth: '2023-10' }, { today: TODAY });
    expect(fix.patch).toEqual({ 'stressTool.settings.stoppedWork': '2023-10' });
    expect(lockedPlanWriteRefusal(p, fix.patch, getDefaultStressSettings())).toBeNull();
    expect(stopAskPatch(p, { stopMonth: '2027-02' }, { today: TODAY }).errors).toEqual({ stopMonth: 'month-ahead' });
    expect(stopAskPatch(p, { stopMonth: '1970-01' }, { today: TODAY }).errors).toEqual({ stopMonth: 'too-early' });   // Alex is 64
    expect(stopAskPatch(p, { stopAskLeft: 'yes' }, { today: TODAY }).ok).toBe(false);   // "Leave it" is the question's, not the change's
    // the planner's box: the same rules, its own words
    expect(lockedStopAnswer('2023-10', NOW, 64)).toEqual({ error: null, value: '2023-10' });
    expect(lockedStopAnswer('1970-01', NOW, 64).error).toBe('too-early');
    expect(lockedStopAnswer('2027-02', NOW, 64).error).toBe('month-ahead');
    for (const k of ['required', 'notAMonth', 'month-ahead', 'too-early']) { expect(LOCKED_STOP_REFUSED[k]).toBeTruthy(); expect(ABOUT.lockedStart.errors[k]).toBeTruthy(); }
    // a draft, or a plan still to retire, is not changed here
    const q = alex(); q.stressTool.settings.retired = false;
    expect(stopChangeOf(q, NOW)).toBeNull();
  });
  it('the locked box has its own help and errors: none sends the person to a choice the locked page does not have', () => {
    expect(ABOUT.lockedStart.help).toBe('Like 2023-10, or October 2023.');
    expect(ABOUT.lockedStart.errors['month-ahead']).not.toMatch(/choose/);
    expect(ABOUT.lockedStart.errors.notAMonth).toContain('2023-10');
  });
});

describe('the words', () => {
  const plain = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
  const m = planMoveOf(alex(), NOW);
  const words = [
    plain(lockedStartHtml({ ask: true, start: 2027 })),
    plain(lockedStartHtml({ offer: m, stepAge: 62, stopped: '2023-10' })),
    plain(lockedStartHtml({ offer: m, stepAge: 62, stepped: false, income: 30000 })),
    plain(lockedStartHtml({ blocked: { stopMonth: '2023-10', from: 2027 }, stopped: '2023-10' })),
    plain(lockedStartHtml({ left: true })),
    ...Object.values(LOCKED_STOP_REFUSED),
    plain(moveStartQuestion(m, { stepAmount: 30000, stepped: false, months: ['2026-07'], bridged: 1, sp: { taxYear: 2028, before: 1, after: 5 } }).html),
    plain(moveStartQuestion(m, { stepAmount: 34000, endAge: 85, months: ['2026-07', '2026-08', '2026-09'], runYear: 2026, ladder: true, dated: true }).html),
    plain(moveStartQuestion(m, { months: [] }).html),
    moveStartDoneWords(m),
    moved(alex()).patch.journey.at(-1).label, moved(alex()).patch.journey.at(-1).note
  ];
  it('every new sentence for a person who has stopped work passes the banned-words list', () => {
    for (const w of words) expect(bannedHits(w, ['all', 'retired']), w).toEqual([]);
  });
  it('the confirm says the plan stays locked, what the steps do, and what moves', () => {
    const q = words.find((w) => w.startsWith('Move the plan\'s start to 2023/24? Here is exactly what changes: The plan\'s first tax year becomes 2023/24') && w.includes('£34,000'));
    expect(q).toContain('The plan stays locked');
    expect(q).toContain('the first step keeps its amount (£34,000 a year) and now runs from 2023/24, at 62; your later steps keep their ages');
    expect(q).toContain('3 recorded months (July 2026 to September 2026)');
    expect(q).toContain('the gilt ladder is bought from 2026/27 on');
    expect(q).toContain('The figures move');
  });
  it('fixture 03 as the planner reads it: the months were marked before the start; the State Pension keeps its tax year, said so', () => {
    const plan = alex();
    const mm = planMoveOf(plan, NOW);
    const hist = plan.decisionTool.history;
    const q = plain(moveStartQuestion(mm, { stepAmount: 34000, months: hist.map((h) => h.date),
      ladder: true, runYear: 2026, sp: spCountOf(plan.stressTool.settings, mm.stress) }).html);
    // 7.3.3: the months count from the new start; no line says they were "before the plan's income starts"
    expect(q).toContain('They now count from the new start, 2023/24.');
    expect(q).not.toMatch(/before the plan|set aside/);
    expect(spCountOf(plan.stressTool.settings, mm.stress)).toEqual({ taxYear: 2028, before: 1, after: 5 });
    expect(q).toContain('Your State Pension still starts in 2028/29, as before; only the plan\'s count of years to it changes (5 from the new start, not 1).');
    expect(q).not.toMatch(/comes later/);
    // the fill is on the planner's own page; only the plan document has a list of previous versions
    expect(q).toContain('on Monthly Entry: set each earlier tax year up first, under Tax Years');
    expect(q).not.toContain('Month by month');
    expect(q).toContain('The earlier plan document stays under Previous versions');
    expect(q).not.toMatch(/ones they replace are kept under previous versions/);
    expect(moveStartDoneWords(mm)).toContain('the earlier plan document is under Previous versions');
  });
  it('fixture 04 (level income, months already in the plan): no steps in the words, and no mark said to be taken off', () => {
    const raw = recordedFromStop(read('04-buckets-running'), '2024-06'); raw.stressTool.settings.stoppedWork = '2024-06';   // its months begin with the stop's (7.4.3)
    const plan = upgradeScenario(raw, { now: NOW }).scenario;
    const mm = planMoveOf(plan, NOW);
    expect(mm).not.toBeNull();
    const line = plain(lockedStartHtml({ offer: mm, stepAge: mm.stress.shapeAgeNow, stepped: false, income: 30000 }));
    expect(line).toContain('Your income stays £30,000 a year, now from 2024/25, at 61.');
    expect(line).not.toMatch(/step/);
    const hist = plan.decisionTool.history;
    const q = plain(moveStartQuestion(mm, { stepAmount: 30000, stepped: false, months: hist.map((h) => h.date), bridged: 0 }).html);
    expect(q).toContain('it stays £30,000 a year, now from 2024/25');
    expect(q).not.toMatch(/first step|later steps/);
    expect(q).toContain('keep every figure you entered. They now count from the new start, 2024/25.');
    expect(q).not.toMatch(/no longer marked/);
  });
  it('the line\'s button rows are blocks, not the banner\'s stretched text spans; a saved month can be changed there', () => {
    const offer = lockedStartHtml({ offer: m, stepAge: 62, stopped: '2023-10' });
    expect(offer).not.toMatch(/<span[^>]*><button/);
    expect(offer).toContain('id="tmMoveStartBtn"');
    expect(offer).toContain('Change the month you stopped work');
    expect(offer).toContain('value="2023-10"');
    expect(lockedStartHtml({ stopped: '2023-10' })).toContain('id="tmLockedStopMonth"');
    expect(lockedStartHtml({})).toBe('');
    // its boxes are drawn as the Timing block's (a row-flex row); a changed month's box is not a second "The month you stopped work"
    expect(lockedStartHtml({ ask: true, start: 2027 })).toContain('<div class="row-flex"');
    expect(offer).toContain('The right month<input type="month" id="tmLockedStopMonth"');
    expect(offer).not.toContain('The month you stopped work');
    // after "Leave it": the month folded under "Say when you stopped work", its own box
    const later = lockedStartHtml({ left: true });
    expect(later).toContain('id="tmLockedStopLater"');
    expect(plain(later)).toContain('Say when you stopped work');
    expect(later).toContain('id="tmLockedStopMonth"');
    expect(later).not.toContain('tmLockedStopLeave');
    expect(plain(lockedStartHtml({ blocked: { stopMonth: '2023-10', from: 2027 }, stopped: '2023-10' }))).toContain('To change the start, unlock the plan.');
  });
  it('plan vs actual\'s heading: the lock\'s date as before, or when a move wrote it again', () => {
    const day = (d) => d.toISOString().slice(0, 10);
    const por = { savedAt: '2026-07-01T08:15:00.000Z', assumedCpi: 0.04 };
    expect(planVsActualWords(por, '2026-07-01T08:15:00.000Z', day)).toEqual({ head: '— against the projection frozen when this plan was locked (2026-07-01, 4% assumed CPI)', foot: 'The plan of record never moves — that\'s its job. Your monthly recommendations always use your real fund values and entered CPI.' });
    const after = applyPatch(alex(), moved(alex()).patch).decisionTool.planOfRecord;
    expect(after.rewrittenFor).toBe(noteMoved(2023));
    const w = planVsActualWords(after, '2026-07-01T08:15:00.000Z', day);
    expect(w.head).toBe('— against the projection written again on 2026-11-04, when the plan\'s start moved to 2023/24 (the plan was locked 2026-07-01; 4% assumed CPI)');
    expect(w.foot).not.toMatch(/never moves/);
  });
  it('the moved document dates its timing sentence by the day it was written, not the lock\'s', () => {
    const doc = applyPatch(alex(), moved(alex()).patch).planDocument;
    expect(writtenWhen(doc)).toMatch(/^As written on 4 November 2026$/);
    expect(writtenWhen(alex().planDocument)).toBe('As written when the plan was locked');
  });
  it('the anchor read for the question is the Decision tool\'s', () => {
    expect(moveAnchorOf({ firstTaxYear: 2027 }, { firstTaxYear: 2028 })).toBe(2028);
    expect(moveAnchorOf({ firstTaxYear: 2027 }, {})).toBe(2027);
    expect(moveAnchorOf({}, {})).toBeNull();
    expect(positionAfterMove(m.stress, null)).toBeNull();
  });
});
