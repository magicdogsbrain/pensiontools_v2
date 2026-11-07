/**
 * Say when you stopped work (6.51.0; research/plan-start.md §2 C/D/E, §3, §5 item 2, §6, §7): a draft can start the
 * plan's income in the tax year work stopped, however long ago, and every page says where the plan stands.
 *
 * Covered here (the planner's and the engines' side; V7's About step is in tests/v7/plan/about.test.js):
 *  - every lock path records where the pots stood (the engines step's hand-over, item a): the preview's lock and the
 *    planner's full lock write a document with `pots.asOfPlanYear` and `timing.monthsIntoYear`; the first Month-by-month
 *    record and a tax-year set-up lock with no document and record the position beside the flag (`lockedPosition`), and
 *    the plan is then read from there on every later day, and a document written later records that same position; a
 *    plan locked in its year 0 or before, and every plan locked before 6.51.0 (which recorded nothing), is untouched;
 *  - the document says what its year 0 of a running plan is (item b): the twelve months from the day of the pots;
 *  - a seed carrying `since` makes a plan whose year 0 is the stop's tax year;
 *  - the planner's words for a record before the plan's income starts come from the plan's year 0 as it is now;
 *  - the ladder's month in the Decision tool is placed by the ladder's own years.
 *
 * The subject is the corpus's fixture 13 (Alex, fictional: stopped work in October 2024, year 0 2024/25, a full
 * index-linked gilt ladder) made a draft again and read on 2 October 2026: plan year 2, six months of it gone.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { planFromSettings, stressTestStrategy } from '../src/strategies/stressTest.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { lockedPotsAsOf, potsAsOfFor, lockPositionOf, potsDayOf } from '../src/services/PlanFromToday.js';
import { deriveTiming, describeTiming } from '../src/services/PlanTiming.js';
import { planDocumentHtml, potsAsOfWords } from '../src/ui/components/PlanDocumentView.js';
import { lockPatch, applyPatch } from '../src/answers/plan/lock.js';
import { runForDocument } from '../src/answers/plan/lastsRun.js';
import { recordBeforeStart, recordYearLabel, recordSourceWords, livedYearRowHtml, firstSetUpPlanYear, wizardStop } from '../src/ui/planStartUi.js';
import * as planStartUi from '../src/ui/planStartUi.js';
import { ladderMonthAdvice, firstRungOf, ladderPosition } from '../src/services/LadderPosition.js';
import { seedToScenario, checkSeed } from '../src/services/PlanSeed.js';
import { TODAY as SEED_TODAY, CREATED_AT, NOW_MS, seedCNow } from './integration/fixtures/planSeeds.js';
import { realYieldForYear, setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { setEquityOverride } from '../src/services/EquityIndex.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');
const read = (name) => JSON.parse(readFileSync(join(PLANS, name + '.json'), 'utf8'));
const GILTS = JSON.parse(readFileSync(join(PLANS, 'market', 'gilts.json'), 'utf8'));
const EQUITY = JSON.parse(readFileSync(join(PLANS, 'market', 'equity.json'), 'utf8'));
const PLANLOCK_SRC = readFileSync(join(process.cwd(), 'src', 'services', 'PlanLock.js'), 'utf8');
const ALEX = read('13-stopped-drawing-since');
const TODAY = '2026-10-02';
const NOW = new Date(2026, 9, 2, 12);                 // plan year 2 (2026/27), six months gone (April … September)
const LATER = new Date(2027, 1, 15, 12);              // the same plan year, ten months gone
const NEXT_YEAR = new Date(2027, 9, 15, 12);          // plan year 3

/** The same saved plan as a draft that says when work stopped: unlocked, no document, no plan of record, nothing recorded. */
function draftC() {
  const p = JSON.parse(JSON.stringify(ALEX));
  p.stressTool.settings.stoppedWork = '2024-10';
  p.decisionTool.settings = { ...p.decisionTool.settings, locked: false };
  delete p.decisionTool.settings.lockedAt; delete p.decisionTool.settings.lockedBy;
  delete p.decisionTool.planOfRecord; delete p.planDocument; delete p.journey;
  p.decisionTool.history = []; p.decisionTool.taxYears = {};
  return p;
}
const settingsOf = (plan, now) => effectiveStressSettings(upgradeScenario(plan, { now }).scenario, { now });
/**
 * What PlanLock.lockPlanIfNeeded leaves (the first Month-by-month record, a tax-year set-up): the flag, its date and the
 * position it records from the Stress settings the planner reads (lockPositionOf) — no document.
 */
const lockedNoDocument = (plan, at) => ({ ...plan, decisionTool: { ...plan.decisionTool, settings: { ...plan.decisionTool.settings, locked: true, lockedAt: at.toISOString(), lockedBy: 'first monthly entry', lockedPosition: lockPositionOf(settingsOf(plan, at), at) } } });
/** The same lock made before 6.51.0: the flag and its date, nothing recorded. */
const lockedBefore651 = (plan, at) => ({ ...plan, decisionTool: { ...plan.decisionTool, settings: { ...plan.decisionTool.settings, locked: true, lockedAt: at.toISOString(), lockedBy: 'first monthly entry' } } });
const planOf = (s, now) => planFromSettings(s, simulationConfigFromSettings({}, s, now), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now });
function at(now, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now });
  setLinkersOverride(GILTS, now);
  try { return fn(); } finally { vi.useRealTimers(); }
}
/** The planner's buildPlanDocumentNow on the settings its repository reads (strategyPlanFor, the strategy run, the document). */
const plannerDocument = (plan, now) => at(now, () => {
  const s = settingsOf(plan, now);
  const p = { ...planOf(s, now), mcRuns: 60, stride: 12 };
  return buildPlanDocument({ planName: 'Alex', settings: s, p, r: stressTestStrategy(s.strategyId, p), lockedAt: plan.decisionTool.settings.lockedAt || null, now });
});

beforeAll(() => { setEquityOverride(EQUITY); });
afterAll(() => { setLinkersOverride(null); setEquityOverride(null); vi.useRealTimers(); });

describe('the draft: year 0 the tax year Alex stopped in, read where it stands today', () => {
  it('derives year 0 2024/25 from the stop month alone, plan year 2 now, and is not out of date', () => {
    const p = draftC(); delete p.stressTool.settings.firstTaxYear;
    const t = deriveTiming(p.stressTool.settings, NOW);
    expect([t.firstTaxYear, t.planYearNow, t.monthsIntoYear, t.stoppedWork]).toEqual([2024, 2, 6, '2024-10']);
    expect(potsAsOfFor(draftC(), settingsOf(draftC(), NOW), NOW)).toBe('today');
  });
});

describe('every lock path records where the pots stood (the engines step\'s hand-over, item a)', () => {
  it('the preview\'s lock: its document says plan year 2, six months in; read on a later day, the plan runs from there', () => {
    const plan = upgradeScenario(draftC(), { now: NOW }).scenario;
    const run = at(NOW, () => runForDocument(plan, { today: TODAY }));
    const P = lockPatch(plan, { now: NOW, run, entries: [] });
    expect(P.ok).toBe(true);
    expect(P.patch.planDocument.pots.asOfPlanYear).toBe(2);
    expect(P.patch.planDocument.timing.monthsIntoYear).toBe(6);
    const after = applyPatch(plan, P.patch);
    expect(lockedPotsAsOf(after)).toEqual({ elapsedYears: 2, monthsIntoYear: 6 });
    for (const d of [LATER, NEXT_YEAR]) expect(at(d, () => settingsOf(after, d)).potsAsOf).toEqual({ elapsedYears: 2, monthsIntoYear: 6 });
  });
  it('the planner\'s full lock (Stress settings, or the Decision tool\'s question): locked first, then the document from the settings its repository reads', () => {
    // commitPlanLock: lockPlanIfNeeded, then buildPlanDocumentNow — which, if the copy in memory went, reads a plan locked
    // with no document yet: the position is the lock's own day, so the document records it all the same
    const locked = lockedNoDocument(draftC(), NOW);
    const doc = plannerDocument(locked, NOW);
    expect(doc.pots.asOfPlanYear).toBe(2);
    expect(doc.timing.monthsIntoYear).toBe(6);
    expect(doc.strategy.p).toMatchObject({ yearOffset: 2, monthsIntoYear: 6, runFirstTaxYear: 2026, firstTaxYear: 2024 });
  });
  it('the first Month-by-month record and a tax-year set-up lock with no document: the position recorded, read on every later day', () => {
    // PlanLock.lockPlanIfNeeded writes the flag, its date and where the pots stood, and no document (index.html asks first
    // and writes one; this is every other way in): the plan must not fall back to year 0 on its year-2 pots
    // with the open plan (6.56.0: the plan that carries a closed one on reads its pots as today's from its first month)
    expect(PLANLOCK_SRC).toMatch(/lockedPosition = lockPositionOf\(await getStressSettingsAsync\(\), now, await getActiveScenarioAsync\(\)\)/);
    expect(PLANLOCK_SRC).toMatch(/saveDecisionSettings\(\{ locked: true, lockedAt: now\.toISOString\(\), lockedBy: reason, lockedPosition \}\)/);
    const locked = lockedNoDocument(draftC(), NOW);
    expect(locked.decisionTool.settings.lockedPosition).toEqual({ elapsedYears: 2, monthsIntoYear: 6 });
    expect(lockedPotsAsOf(locked)).toEqual({ elapsedYears: 2, monthsIntoYear: 6 });
    for (const d of [LATER, NEXT_YEAR]) {
      const s = at(d, () => settingsOf(locked, d));
      expect(s.potsAsOf).toEqual({ elapsedYears: 2, monthsIntoYear: 6 });
      const p = at(d, () => planOf(s, d));
      expect([p.yearOffset, p.monthsIntoYear, p.runFirstTaxYear, p.startAge]).toEqual([2, 6, 2026, 63]);
    }
  });
  it('a document written months after such a lock records the lock\'s position, not the day it was written', () => {
    const locked = lockedNoDocument(draftC(), NOW);
    const doc = plannerDocument(locked, LATER);
    expect(doc.pots.asOfPlanYear).toBe(2);
    expect(doc.timing.monthsIntoYear).toBe(6);                // the lock's, though written ten months into the year
    expect(lockedPotsAsOf({ ...locked, planDocument: doc })).toEqual({ elapsedYears: 2, monthsIntoYear: 6 });
  });
  it('a plan locked in its year 0 or before, with or without a document, runs from year 0 as it always did', () => {
    expect(lockedPotsAsOf(ALEX)).toBeNull();                                                     // locked in year 0, with its document
    const { planDocument, ...noDoc } = ALEX;
    expect(lockedPotsAsOf(noDoc)).toBeNull();                                                    // locked 12 November 2024: plan year 0
    // Re-written in review (6.51.0): the same draft, which says when work stopped, locked in December of its year 0 records
    // year 0 with its months gone — nothing is shifted (elapsedYears 0), but its pots are year 0's, after that year's April,
    // so its ladder sets no cash aside to it on any later day (PlanFromToday.runUpCashSpent)
    expect(lockedPotsAsOf(lockedNoDocument(draftC(), new Date(2024, 11, 1, 12)))).toEqual({ elapsedYears: 0, monthsIntoYear: 8 });
    expect(lockedPotsAsOf(lockedNoDocument(draftC(), new Date(2024, 2, 1, 12)))).toBeNull();     // locked before its year 0: nothing recorded
    expect(lockedPotsAsOf({ decisionTool: { settings: { locked: true } }, stressTool: { settings: {} } })).toBeNull();   // no date
    for (const name of ['20-locked-start-after-stop', '04-buckets-running', '05-saver-committed', '06-pre-6.4-no-timing']) {
      const raw = read(name); const { planDocument: _d, ...bare } = raw;
      expect(lockedPotsAsOf(bare), name).toBeNull();
    }
  });
  it('a plan locked with no document before 6.51.0 recorded nothing: it runs from year 0 as it did, even with its year 0 passed', () => {
    // A draft saved as "this tax year" in 2025/26 and locked by its first monthly record in 2026/27 (a review of 6.51.0): the
    // lock day falls in its year 1, but the version that locked it ran it from year 0, and a later version must not move
    // its figures by working out a position it never recorded.
    const d = draftC(); delete d.stressTool.settings.stoppedWork;
    d.stressTool.settings.firstTaxYear = 2025; d.decisionTool.settings.firstTaxYear = 2025;
    const old = lockedBefore651(d, NOW);
    expect(lockedPotsAsOf(old)).toBeNull();
    for (const day of [NOW, NEXT_YEAR]) {
      const s = at(day, () => settingsOf(old, day));
      expect(s.potsAsOf).toBeUndefined();
      expect(at(day, () => planOf(s, day)).yearOffset).toBeUndefined();
    }
    // the same lock made now records where it stood, and is read from there
    expect(lockedPotsAsOf(lockedNoDocument(d, NOW))).toEqual({ elapsedYears: 1, monthsIntoYear: 6 });
  });
});

describe('the document says what its year 0 is, for a plan locked once it had started (item b)', () => {
  it('"Plan started", the pots\' month, the twelve months from it at that plan year\'s figures, and the lived years marked', () => {
    const doc = plannerDocument(lockedNoDocument(draftC(), NOW), NOW);
    expect(potsAsOfWords(doc)).toEqual({ planYear: 2, month: 'October 2026', monthsLeft: 6 });
    const h = planDocumentHtml(doc);
    expect(h).toContain('Plan started');
    expect(h).toContain('locked in plan year 2, on the pots as they stood in October 2026 (6 months of that year still to pay)');
    expect(h).toContain('plan year 2 here is the twelve months from that month, at plan year 2\'s figures');
    expect(h).toContain('<span class="hint">lived</span>');
    expect(h).not.toContain('money set aside');                        // no months before the plan's income starts
    expect(h).not.toMatch(/run-up|SIPP cash to the first April/i);
    // the header, seen first and in the PDF, says it too (a review of 6.51.0 found "Plan starts" there)
    expect(h).toMatch(/<td>Plan started<\/td><td>2024\/25 \(locked in plan year 2\)<\/td>/);
    // a document locked in year 0 says none of the lived years; locked after that year's 6 April (12 November 2024) its
    // plan had started, so it says "Plan started" too (re-written in review: it said "Plan starts" for a start then behind it)
    expect(potsAsOfWords(ALEX.planDocument)).toBeNull();
    const h0 = planDocumentHtml(ALEX.planDocument);
    expect(h0).not.toContain('locked in plan year');
    expect(h0).toMatch(/<td>Plan started<\/td><td>2024\/25<\/td>/);
    // and one locked before its year 0 still starts
    const before = planDocumentHtml({ ...ALEX.planDocument, lockedAt: '2024-03-01T12:00:00.000Z' });
    expect(before).toMatch(/<td>Plan starts<\/td><td>2024\/25<\/td>/);
    expect(before).not.toContain('Plan started');
  });
});

describe('a seed may say when work stopped (`since`): the plan\'s year 0 is that tax year', () => {
  const MADE = new Date(2026, 9, 2, 9, 30);
  it('the stop\'s tax year, the years since added so the plan ends where the answer\'s years end; nothing else moves', () => {
    const base = seedCNow();
    const plain = seedToScenario(base, MADE).yours.stressTool.settings;
    const since = { ...base, stop: { ...base.stop, since: '2024-10' }, people: base.people.map((p) => ({ ...p, stop: { ...p.stop, since: '2024-10' } })) };
    expect(checkSeed(since, NOW_MS)).toEqual({ ok: true });
    const S = seedToScenario(since, MADE).yours.stressTool.settings;
    expect(S.stoppedWork).toBe('2024-10');
    expect(S.firstTaxYear).toBe(2024);
    expect(S.duration).toBe(plain.duration + 2);
    expect(S.shapeAgeNow + S.duration).toBe(plain.shapeAgeNow + plain.duration);   // the same end age
    expect(plain.stoppedWork).toBeUndefined();
    expect(seedToScenario(since, MADE).yours.decisionTool.settings.firstTaxYear).toBe(2024);
  });
  it('refused for a stop to come, a month after the seed\'s day, or not a month', () => {
    const base = seedCNow();
    const withSince = (v, stop = base.stop) => ({ ...base, stop: { ...stop, since: v }, people: base.people.map((p) => ({ ...p, stop: { ...p.stop, since: v } })) });
    expect(checkSeed(withSince(SEED_TODAY.slice(0, 7)), NOW_MS)).toEqual({ ok: true });   // this month: stopped now
    expect(checkSeed(withSince('2099-01'), NOW_MS)).toMatchObject({ ok: false, detail: 'stop.since' });
    expect(checkSeed(withSince('October 2024'), NOW_MS)).toMatchObject({ ok: false, detail: 'stop.since' });
    expect(checkSeed(withSince('2024-10', { kind: 'later', yearsFromNow: 3 }), NOW_MS).ok).toBe(false);
    expect(Date.parse(CREATED_AT)).toBeLessThan(NOW_MS);
  });
});

describe('the planner\'s words for a record before the plan\'s income starts come from the plan\'s year 0 as it is now', () => {
  const stamped = { taxYear: '25/26', yearNum: -1, bridgeYear: true, planStartYear: 2026, strategySource: 'SIPP cash (the plan\'s year 0 is 2026/27)' };
  it('a month stamped before the start under an old year 0 reads as a plan month under the year 0 it has now', () => {
    expect(recordBeforeStart(stamped, 2026)).toBe(true);
    expect(recordYearLabel(stamped, 2026)).toBe('Tax year 2025/26');   // 7.3.3: by its tax year (and month), never "before the plan"
    expect(recordYearLabel({ ...stamped, date: '2025-11' }, 2026)).toBe('November 2025 · tax year 2025/26');
    expect(recordBeforeStart(stamped, 2024)).toBe(false);
    expect(recordYearLabel(stamped, 2024)).toBe('Year 1');
    expect(recordSourceWords(stamped, 2024, 'before', 'the cash bucket')).toBe('the cash bucket');   // never the stamped old start
    expect(recordSourceWords(stamped, 2026, 'before', 'the cash bucket')).toBe('before');   // the old start's own stamped words are never shown
    expect(recordSourceWords({ ...stamped, strategySource: 'this year\'s matured rung' }, 2026, 'before', 'x')).toBe('this year\'s matured rung');
    expect(recordBeforeStart(stamped, null)).toBe(false);                                            // no anchor: the stamp is not read (7.4.2)
    expect(recordYearLabel({ taxYear: '26/27' }, 2024)).toBe('Year 2');
  });
  it('plan vs actual: a lived year on its draw alone; the months before a later start; the part year is the first year set up', () => {
    const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
    expect(livedYearRowHtml(1, [{ sipp: 2300 }, { sipp: 2100 }], { sippDraw: 26400 }, gbp)).toBe('<tr><td>Year 1 <span class="hint">(2 mo; lived before the plan was locked)</span></td><td>£2,200/mo</td><td>£2,200/mo <span class="hint">(+£0)</span></td><td>—</td><td>—</td><td>—</td></tr>');
    expect(planStartUi.beforeStartNoteHtml).toBeUndefined();   // 7.4.2: months before a later start are skipped quietly; the to-do moves the start
    expect(firstSetUpPlanYear({ '24/25': { yearSetupComplete: true }, '26/27': { yearSetupComplete: true } }, 2024)).toBe(0);
    expect(firstSetUpPlanYear({ '26/27': { yearSetupComplete: true }, '27/28': {} }, 2024)).toBe(2);
    expect(firstSetUpPlanYear({ '25/26': { yearSetupComplete: true } }, 2026)).toBe(0);              // a year before the start is not a plan year
    // 7.3.3: the Decision settings no longer say the months before year 0 are "recorded, not compared" — the sentence is gone
    expect(planStartUi.decisionStartNote).toBeUndefined();
  });
  it('the setup wizard: a stop month that fits moves year 0 back and keeps the end age; "pick up from here" keeps this tax year', () => {
    const w = wizardStop({ stopMonth: '2024-10' }, { cur: 63, retire: 61, alreadyRetired: true, today: '2026-10-02', now: NOW });
    expect(w.extra).toEqual({ stoppedWork: '2024-10' });
    expect(w.movedBack({ firstTaxYear: 2024 })).toBe(3);                   // next April (2027/28) back to 2024/25
    expect(wizardStop({ stopMonth: '2024-10', pickUp: true }, { cur: 63, retire: 61, alreadyRetired: true, today: '2026-10-02', now: NOW }).movedBack({ firstTaxYear: 2026 })).toBe(0);
    expect(wizardStop({ stopMonth: '2028-06' }, { cur: 63, retire: 61, alreadyRetired: true, today: '2026-10-02', now: NOW }).extra).toEqual({});   // a month ahead does not fit "already retired"
    const later = wizardStop({ stopMonth: '2029-06' }, { cur: 58, retire: 60, alreadyRetired: false, today: '2026-10-02', now: NOW });
    expect(later.extra).toEqual({ stoppedWork: '2029-06' });
    expect(later.retireAge).toBe(60);                                      // the age reached by the end of June 2029 (58 on 2 October 2026)
  });
});

describe('the ladder\'s month in the Decision tool is placed by the ladder\'s own years, never the plan year alone', () => {
  const plan = ALEX.planDocument.strategy.r.plan;
  const rung = firstRungOf(plan);
  it('the first gilt is the ladder\'s own: 2028/29 for a ladder whose year 0 is 2024/25 with four cash years', () => {
    expect(rung).toEqual({ Y: 2028, label: '2028/29' });
    expect(firstRungOf({ years: [{ Y: 2026, from: 'cash' }] })).toBeNull();
  });
  it('before the ladder\'s first year: cash, a label that names no year; in a cash year: the cash years until the first gilt', () => {
    const before = ladderMonthAdvice({ phase: 'before', upcoming: { label: '2026/27' } }, rung, 2100, 2);   // a month lived before a running plan's ladder
    expect(before.floorMonthly).toBe(2100);
    expect(before.floorLabel).not.toMatch(/\d{4}/);
    expect(before.note).toContain('your ladder\'s first gilt pays from 2028/29');
    const cashYear = ladderMonthAdvice({ phase: 'running', monthly: 2200, source: 'cash', taxYearLabel: '2026/27', age: 63, instruction: 'Instruct the broker.' }, rung, 2100, 2);
    expect([cashYear.floorMonthly, cashYear.floorLabel]).toEqual([2200, 'the cash years bucket']);
    expect(cashYear.note).toContain('Your cash pays until the ladder\'s first gilt, from 2028/29.');
    expect(cashYear.note).not.toMatch(/run-up|SIPP cash/);
    expect(ladderMonthAdvice(null, null, 1800, -1).floorLabel).toBe('cash, until the first gilt pays');   // no ladder, before the start
    expect(ladderMonthAdvice(null, null, 1800, 1).floorLabel).toBe('this year\'s matured rung');
  });
});

describe('the ladder\'s month for someone who stopped this tax year or earlier: the year begun before the pots\' day over twelve months', () => {
  // A review of 6.51.0: the engines run the year the pots' day falls in as the twelve months from it, at that year's
  // figures; the Decision tool told the person to draw the whole year's need over the months left to 5 April (£7,600 a
  // month on a £38,000 year with five months left). Fixture 02's shape (Sam, fictional) on the full ladder, read on
  // 15 November 2026.
  const DAY = new Date(2026, 10, 15, 12);
  const position = (stop) => at(DAY, () => {
    const raw = read('02-pnv-draft');
    const ss = { ...raw.stressTool.settings, strategyId: 'full-il-gilt', strategyParams: { cashYears: 2, bridgeCash: 0 }, retired: true };
    delete ss.firstTaxYear;
    if (stop) ss.stoppedWork = stop; else delete ss.stoppedWork;   // 7.4.0: fixture 02 now says its own month
    const s = settingsOf({ ...raw, stressTool: { ...raw.stressTool, settings: ss } }, DAY);
    const r = stressTestStrategy('full-il-gilt', { ...planOf(s, DAY), mcRuns: 60, stride: 12 });
    const lp = ladderPosition(r.plan, { today: DAY, potsDay: potsDayOf(s, { now: DAY }) });
    return { s, lp, need: r.plan.years[0].need, firstY: r.plan.years[0].Y };
  });
  it('stopped in September of this tax year: year 0 is this tax year, paid at a twelfth of its need a month', () => {
    const { s, lp, need, firstY } = position('2026-09');
    expect([s.potsAsOf, firstY, lp.phase, lp.monthsLeft]).toEqual(['today', 2026, 'running', 5]);
    expect(lp.spread).toBe(true);
    expect(lp.monthly).toBeCloseTo(need / 12, 6);
    expect(lp.instruction).toContain('over the twelve months from November 2026, the month its pots were entered');
    expect(lp.remaining).toBeCloseTo(need, 6);                 // the year's money not yet drawn is all still held
  });
  it('stopped in an earlier tax year: the ladder bought from this tax year is paid the same way', () => {
    const { s, lp, need, firstY } = position('2024-07');
    expect([s.potsAsOf, firstY, lp.phase]).toEqual(['today', 2026, 'running']);
    expect(lp.monthly).toBeCloseTo(need / 12, 6);
  });
  it('no stop month (year 0 this tax year, 7.4.0) and any later tax year: over the months left to 5 April, as always', () => {
    // 7.4.0: a retiree with no saved year and no stop month starts this tax year (it was next April, with nothing to draw
    // until then); the year is read as a plan that picked up from here always was: its need over the months left
    const { s, lp, need, firstY } = position(null);
    expect([s.potsAsOf, firstY, lp.phase, lp.spread]).toEqual([undefined, 2026, 'running', false]);
    expect(lp.monthly).toBeCloseTo(need / 5, 6);
    const plan = { years: [{ Y: 2026, need: 12000, gross: 12000, age: 64, from: 'cash' }, { Y: 2027, need: 12000, gross: 12000, age: 65, from: 'cash' }], orders: [] };
    const nextYear = ladderPosition(plan, { today: new Date(2027, 4, 15, 12), potsDay: DAY });
    expect([nextYear.spread, nextYear.monthsLeft, nextYear.monthly]).toEqual([false, 11, 12000 / 11]);
  });
});

describe('the Timing block\'s words for a plan that has started say what is past as past (a review of 6.51.0)', () => {
  const DAY = new Date(2026, 8, 30, 12);
  const words = (s) => describeTiming(deriveTiming(s, DAY), s, DAY);
  it('a State Pension paid before year 0 was already paid when the plan started; the income steps started', () => {
    // case H (research/plan-start.md §8): someone who worked past State Pension age and stopped in an earlier tax year
    const sam = { currentAge: 70, currentAgeAsOf: '2026-09-30', retired: true, stoppedWork: '2023-10', spStartDate: '2022-05-10', spWeeklyAmount: 230, duration: 30 };
    const t = words(sam);
    expect(t).toContain('Plan started 6 April 2023 (tax year 2023/24); today is plan year 3 of 30.');
    expect(t).toContain('Income steps started at age 67.');
    expect(t).toContain('State Pension from 2022/23 (already paid when the plan started).');
    expect(t).not.toContain('before the plan starts');
  });
  it('a stop to come said by its month reads "You stop work"; one said by an age alone reads as it always has', () => {
    const month = words({ currentAge: 63, currentAgeAsOf: '2026-09-30', retired: false, retireAge: 66, stoppedWork: '2029-06', duration: 30 });
    expect(month).toMatch(/^You stop work in June 2029 at 66, /);
    expect(words({ currentAge: 63, currentAgeAsOf: '2026-09-30', retired: false, retireAge: 66, duration: 30 })).toMatch(/^You retire in /);
  });
  it('a plan still to start says it as before', () => {
    const later = { currentAge: 70, currentAgeAsOf: '2026-09-30', retired: true, firstTaxYear: 2027, spStartDate: '2022-05-10', duration: 25 };
    const t = words(later);
    expect(t).toContain('Income steps start at age 71.');
    expect(t).toContain('State Pension from 2022/23 (already being paid when the plan starts).');   // 7.3.3
  });
  it('stopped before the pension can be drawn: the age it can be, and the tax year to choose (55 before 6 April 2028, else 57)', () => {
    // research/plan-start.md §8, "stopping before 55 (57 from April 2028) and bridging on savings"
    const long = words({ currentAge: 63, currentAgeAsOf: '2026-09-30', retired: true, stoppedWork: '2006-06', duration: 50 });
    // 7.3.3: the fact and a caveat, never advice to start the plan later
    // 7.4.1 review: the tax year named is the first the plan draws the pension in, the first that starts with them at the age
    expect(long).toContain('Income steps started at age 43. Your pension can be drawn from age 55. This plan first draws it in tax year 2019/20; until then it pays you from your ISA, cash and other savings.');
    const young = words({ currentAge: 52, currentAgeAsOf: '2026-09-30', retired: true, stoppedWork: '2026-06', duration: 40 });
    expect(young).toContain('Your pension can be drawn from age 57. This plan first draws it in tax year 2032/33;');
    // a start chosen at or after that age says nothing of it; nor does a plan that does not say when work stopped
    expect(words({ currentAge: 52, currentAgeAsOf: '2026-09-30', retired: true, stoppedWork: '2026-06', firstTaxYear: 2032, duration: 35 })).not.toContain('can be drawn from age');
    // a start in the tax year the birthday falls in is still before it: the year that starts at 56 draws nothing from the pension
    expect(words({ currentAge: 52, currentAgeAsOf: '2026-09-30', retired: true, stoppedWork: '2026-06', firstTaxYear: 2031, duration: 35 })).toContain('This plan first draws it in tax year 2032/33;');
    expect(words({ currentAge: 52, currentAgeAsOf: '2026-09-30', retired: true, firstTaxYear: 2026, duration: 40 })).not.toContain('can be drawn from age');
  });
});
