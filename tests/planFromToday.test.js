/**
 * The plan as seen from today (research/plan-start.md §1, §3, §7 "the transformation"): a plan whose pots belong to a
 * later plan year than its year 0 is handed to the engines from that plan year, at the age reached in it, for the years
 * left, on those pots — the years already lived are never bought or run a second time.
 *
 * Which plan year the pots belong to is said by the readers (PlanFromToday.potsAsOfFor, as `potsAsOf` on the effective
 * settings): a draft whose year 0 is behind it is seen from today; a locked plan from where it stood when it was locked
 * (so it runs as committed on every day it is read); anything else from year 0, as every plan always was.
 *
 * The subject is the corpus's fixture 13 (tests/fixtures/plans/13-stopped-drawing-since.json — Alex, fictional): the
 * plan's year 0 the tax year Alex stopped in (2024/25), a locked index-linked gilt ladder with four cash years from
 * year 0 (first rung 2028/29), a flat income with one step down at 75, the State Pension from 11 May 2030 (plan year 6).
 * It was locked in its year 0, so as saved it runs from year 0 for good; the transformation is read on the same plan as a
 * draft (`draftOf`) — what the plan is once its pots are entered again — on the corpus day, 30 September 2026: plan
 * year 2, two years lived and five months of the third gone (and in December 2025, plan year 1, with one year lived).
 *
 * The identity for every plan with no year lived (every saved plan until now) is proved fixture by fixture in
 * planFromToday.identity.test.js; this file is what changes when a year has been lived, and that nothing does without one.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { planFromSettings, stressTestStrategy } from '../src/strategies/stressTest.js';
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';
import { buildPlanDocument, whereAmI, bandAt, pricesSinceStart } from '../src/services/PlanDocument.js';
import { planOfRecordFor, seedDecisionFromStress } from '../src/services/PlanCommit.js';
import { householdDrawSplit, splitFingerprint } from '../src/services/HouseholdDraw.js';
import { startOffset, householdIncomeTimeline } from '../src/services/HouseholdService.js';
import { deriveTiming, taxYearMonthsGone } from '../src/services/PlanTiming.js';
import { planAsSeenFromToday, settingsAsSeenFromToday, ladderAsSeenFromToday, lockedPotsAsOf, potsAsOfFor, withoutPotsAsOf, runPositionOf, POTS_TODAY } from '../src/services/PlanFromToday.js';
import { glideShareForYear } from '../src/services/GlidepathService.js';
import { livedYearRowHtml, yearRowHtml } from '../src/ui/planStartUi.js';
import { yearsToMaturity } from '../src/strategies/GiltLadderPlan.js';
import { realYieldForYear, setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { setEquityOverride } from '../src/services/EquityIndex.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');
const read = (name) => JSON.parse(readFileSync(join(PLANS, name + '.json'), 'utf8'));
const GILTS = JSON.parse(readFileSync(join(PLANS, 'market', 'gilts.json'), 'utf8'));
const EQUITY = JSON.parse(readFileSync(join(PLANS, 'market', 'equity.json'), 'utf8'));
const INDEX_HTML = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const ALEX = read('13-stopped-drawing-since');
// Instants in UTC by the middle of the UK day: the same local date in any zone the suite runs in.
const CORPUS_DAY = new Date('2026-09-30T11:00:00.000Z');      // plan year 2, five months gone
const IN_YEAR_0 = new Date('2024-12-15T12:00:00.000Z');       // plan year 0: nothing lived yet
const IN_YEAR_1 = new Date('2025-12-15T12:00:00.000Z');       // plan year 1, eight months gone: one year lived
const LATER_IN_YEAR_2 = new Date('2027-01-15T12:00:00.000Z'); // plan year 2, nine months gone
const AFTER_T27 = new Date('2027-12-15T12:00:00.000Z');       // plan year 3: the gilt that paid 2028/29 has matured

/** Run `fn` with Date (and the gilt universe's own clock) at `now`. */
function at(now, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now });
  setLinkersOverride(GILTS, now);
  try { return fn(); } finally { vi.useRealTimers(); }
}
/** The same saved plan, unlocked: a draft, whose pots are taken as today's (what the plan is once they are entered again). */
const draftOf = (raw) => ({ ...raw, decisionTool: { ...raw.decisionTool, settings: { ...raw.decisionTool.settings, locked: false } } });
/** The same saved plan, locked again in its plan year 2 on the corpus day: the document its lock made says so. */
const lockedInYear2 = (raw) => ({ ...raw, planDocument: { ...raw.planDocument, pots: { ...raw.planDocument.pots, asOfPlanYear: 2 }, timing: { ...raw.planDocument.timing, planYearNow: 2, elapsedYears: 2, monthsIntoYear: 5 } } });
const settingsOf = (raw, now) => effectiveStressSettings(upgradeScenario(raw, { now }).scenario, { now });
const planOf = (s, now) => planFromSettings(s, simulationConfigFromSettings({}, s, now), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now });
const quick = (p) => ({ ...p, mcRuns: 60, stride: 12 });

beforeAll(() => { setEquityOverride(EQUITY); });
afterAll(() => { setLinkersOverride(null); setEquityOverride(null); vi.useRealTimers(); });

describe('the fixture: Alex, year 0 2024/25, a locked gilt ladder, months recorded in three tax years', () => {
  it('is what the design names (research/plan-start.md §7) and was locked in its year 0', () => {
    const s = ALEX.stressTool.settings;
    expect([s.retired, s.firstTaxYear, s.shapeAgeNow, s.duration, s.strategyId, s.strategyParams.cashYears, s.strategyParams.bridgeCash]).toEqual([true, 2024, 61, 29, 'full-il-gilt', 4, 0]);
    expect(ALEX.decisionTool.settings.locked).toBe(true);
    expect(ALEX.decisionTool.settings.firstTaxYear).toBe(2024);
    expect([...new Set(ALEX.decisionTool.history.map((h) => h.taxYear))].sort()).toEqual(['24/25', '25/26', '26/27']);
    // Not every month is recorded: the summer of the second tax year is a gap.
    expect(ALEX.decisionTool.history.map((h) => h.date).filter((d) => d >= '2025-04' && d <= '2025-12')).toEqual(['2025-04', '2025-05', '2025-06', '2025-10', '2025-11', '2025-12']);
    const doc = ALEX.planDocument;
    expect(doc.timing.elapsedYears).toBe(0);                    // locked in November 2024: no year behind it then
    expect(doc.pots.asOfPlanYear).toBeUndefined();
    const ladder = doc.strategy.r.plan;
    expect(ladder.firstTaxYear).toBe(2024);
    expect(ladder.years.filter((y) => y.from === 'cash').map((y) => y.Y)).toEqual([2024, 2025, 2026, 2027]);
    expect(ladder.years.find((y) => y.from !== 'cash').Y).toBe(2028);   // the first rung pays 2028/29
  });
});

describe('where today stands in the plan (deriveTiming: planYearNow, elapsedYears, monthsIntoYear)', () => {
  it('a plan in its year 2, five months in, on the corpus day; year 0 and year 1 in the Decembers before; year 3 the December after', () => {
    for (const [now, want] of [[CORPUS_DAY, [2, 2, 5]], [IN_YEAR_0, [0, 0, 8]], [IN_YEAR_1, [1, 1, 8]], [AFTER_T27, [3, 3, 8]]]) {
      const t = at(now, () => deriveTiming(settingsOf(ALEX, now), now));
      expect([t.planYearNow, t.elapsedYears, t.monthsIntoYear]).toEqual(want);
      expect(t.firstTaxYear).toBe(2024);                        // year 0 stays the plan's: only today's place in it moves
    }
  });
  it('a plan that starts later is behind its start (negative), nothing lived and no months counted', () => {
    const now = CORPUS_DAY;
    const saver = at(now, () => deriveTiming(settingsOf(read('05-saver-committed'), now), now));
    expect(saver.planYearNow).toBeLessThan(0);
    expect([saver.elapsedYears, saver.monthsIntoYear]).toEqual([0, 0]);
    const runUp = at(now, () => deriveTiming(settingsOf(read('20-locked-start-after-stop'), now), now));
    expect([runUp.planYearNow, runUp.elapsedYears, runUp.monthsIntoYear]).toEqual([-1, 0, 0]);
  });
  it('a plan whose year 0 is this tax year has lived nothing until 6 April, and one year from it', () => {
    const before = new Date('2027-04-05T11:00:00.000Z'), after = new Date('2027-04-06T11:00:00.000Z');
    const a = at(before, () => deriveTiming(settingsOf(read('04-buckets-running'), before), before));
    const b = at(after, () => deriveTiming(settingsOf(read('04-buckets-running'), after), after));
    expect([a.planYearNow, a.elapsedYears, a.monthsIntoYear]).toEqual([0, 0, 11]);
    expect([b.planYearNow, b.elapsedYears, b.monthsIntoYear]).toEqual([1, 1, 0]);
  });
  it('months of the tax year gone, from a date: April 0 … March 11, 1–5 April still the year before', () => {
    expect(taxYearMonthsGone(new Date(2026, 3, 5, 12))).toBe(11);
    expect(taxYearMonthsGone(new Date(2026, 3, 6, 12))).toBe(0);
    expect(taxYearMonthsGone(new Date(2026, 8, 30, 12))).toBe(5);
    expect(taxYearMonthsGone(new Date(2027, 2, 1, 12))).toBe(11);
  });
});

describe('which plan year the pots belong to: what the readers say (potsAsOf)', () => {
  it('a plan locked in its year 0 says nothing, on any day: it runs from year 0, as committed', () => {
    for (const now of [IN_YEAR_0, CORPUS_DAY, AFTER_T27]) expect(at(now, () => settingsOf(ALEX, now)).potsAsOf).toBeUndefined();
    expect(lockedPotsAsOf(ALEX)).toBeNull();
  });
  it('a draft whose year 0 is behind it is seen from today; one in its year 0 or before says nothing', () => {
    for (const now of [CORPUS_DAY, IN_YEAR_1]) expect(at(now, () => settingsOf(draftOf(ALEX), now)).potsAsOf).toBe(POTS_TODAY);
    expect(at(IN_YEAR_0, () => settingsOf(draftOf(ALEX), IN_YEAR_0)).potsAsOf).toBeUndefined();
    for (const name of ['20-locked-start-after-stop', '04-buckets-running', '05-saver-committed']) expect(at(CORPUS_DAY, () => settingsOf(draftOf(read(name)), CORPUS_DAY)).potsAsOf).toBeUndefined();
    // 7.4.0: 12 says when work stopped (July 2026) and its year 0 is that tax year, after whose April its pots were entered
    expect(at(CORPUS_DAY, () => settingsOf(draftOf(read('12-lumpy-db-gia')), CORPUS_DAY)).potsAsOf).toBe(POTS_TODAY);
  });
  it('a plan locked in a later plan year is seen from where it stood that day, whatever today is', () => {
    expect(lockedPotsAsOf(lockedInYear2(ALEX))).toEqual({ elapsedYears: 2, monthsIntoYear: 5 });
    for (const now of [CORPUS_DAY, LATER_IN_YEAR_2, AFTER_T27]) expect(at(now, () => settingsOf(lockedInYear2(ALEX), now)).potsAsOf).toEqual({ elapsedYears: 2, monthsIntoYear: 5 });
  });
  it('the readers derive it every time: one saved by mistake decides nothing, and it is never what is saved', () => {
    const stray = { ...ALEX, stressTool: { ...ALEX.stressTool, settings: { ...ALEX.stressTool.settings, potsAsOf: { elapsedYears: 3, monthsIntoYear: 2 } } } };
    expect(at(CORPUS_DAY, () => settingsOf(stray, CORPUS_DAY)).potsAsOf).toBeUndefined();
    const s = { a: 1, potsAsOf: POTS_TODAY };
    expect(withoutPotsAsOf(s)).toEqual({ a: 1 });
    const plain = { a: 1 };
    expect(withoutPotsAsOf(plain)).toBe(plain);
    expect(potsAsOfFor(ALEX, ALEX.stressTool.settings, CORPUS_DAY)).toBeNull();
  });
  it('settings with no word on it run from year 0, whatever the clock; "today" reads the run\'s own clock', () => {
    expect(runPositionOf({}, { elapsedYears: 2, monthsIntoYear: 4 })).toEqual({ elapsedYears: 0, monthsIntoYear: 0 });
    expect(runPositionOf({ potsAsOf: POTS_TODAY }, { elapsedYears: 2, monthsIntoYear: 4 })).toEqual({ elapsedYears: 2, monthsIntoYear: 4 });
    expect(runPositionOf({ potsAsOf: { elapsedYears: 1, monthsIntoYear: 5 } }, { elapsedYears: 2, monthsIntoYear: 4 })).toEqual({ elapsedYears: 1, monthsIntoYear: 5 });
  });
  it('the household split\'s "keep things as they are" is dismissed against the settings as saved, not the position', () => {
    const s = ALEX.stressTool.settings, b = read('10-couple-b').stressTool.settings;
    expect(splitFingerprint({ ...s, potsAsOf: POTS_TODAY }, b)).toBe(splitFingerprint(s, b));
  });
});

describe('a locked plan runs as committed: the same run on every day of a year (finding: the lock-day pots were read as today\'s)', () => {
  it('fixture 04 (locked, year 0 2026/27): in June and in September of its year 1, the run is the one it was locked on', () => {
    const name = '04-buckets-running';
    const runOn = (now) => at(now, () => {
      const s = settingsOf(read(name), now);
      const cfg = simulationConfigFromSettings({}, s, now);
      const p = planOf(s, now);
      const r = stressTestStrategy(s.strategyId, { ...p, mcRuns: 100, stride: 12 });
      return { s, cfg, p, r };
    });
    const june = runOn(new Date('2027-06-01T11:00:00.000Z')), sept = runOn(new Date('2027-09-01T11:00:00.000Z'));
    expect(june.s.potsAsOf).toBeUndefined();
    expect([june.p.yearOffset, june.p.firstTaxYear, june.p.durationYears]).toEqual([undefined, 2026, sept.p.durationYears]);
    expect(june.cfg).toEqual(sept.cfg);
    expect(june.p.startAge).toBe(sept.p.startAge);
    expect(june.r.spentMedian).toBe(sept.r.spentMedian);
    expect(june.r.coverage).toBe(sept.r.coverage);
    expect(june.r.cones.wealth.p50).toEqual(sept.r.cones.wealth.p50);
  });
  it('fixture 13 (locked in its year 0) in its year 1, year 2 and year 3: the ladder from 2024/25, no year offset — as the document', () => {
    for (const now of [IN_YEAR_1, CORPUS_DAY, AFTER_T27]) {
      const p = at(now, () => planOf(settingsOf(ALEX, now), now));
      expect([p.yearOffset, p.runFirstTaxYear, p.startAge, p.durationYears]).toEqual([undefined, undefined, 61, 29]);
    }
    const r = at(CORPUS_DAY, () => stressTestStrategy('full-il-gilt', quick(planOf(settingsOf(ALEX, CORPUS_DAY), CORPUS_DAY))));
    expect(r.plan.firstTaxYear).toBe(2024);
    expect(r.plan.pricedAt).toBeUndefined();
    expect(r.plan.years.filter((y) => y.from === 'cash').map((y) => y.Y)).toEqual([2024, 2025, 2026, 2027]);
  });
  it('a plan locked in its year 2 runs from the day it was locked, months later too', () => {
    const cfgOn = (now) => at(now, () => { const s = settingsOf(lockedInYear2(ALEX), now); return simulationConfigFromSettings({}, s, now); });
    const onLockDay = cfgOn(CORPUS_DAY), later = cfgOn(LATER_IN_YEAR_2);
    expect([onLockDay.yearOffset, onLockDay.monthsIntoYear]).toEqual([2, 5]);
    expect(later).toEqual(onLockDay);
    const p = at(AFTER_T27, () => planOf(settingsOf(lockedInYear2(ALEX), AFTER_T27), AFTER_T27));
    expect([p.yearOffset, p.monthsIntoYear, p.runFirstTaxYear, p.startAge]).toEqual([2, 5, 2026, 63]);
  });
});

describe('the plan as seen from today — fixture 13 as a draft on 30 September 2026 (plan year 2, five months gone)', () => {
  const now = CORPUS_DAY;
  let s, cfg, p, gilt;
  beforeAll(() => at(now, () => {
    s = settingsOf(draftOf(ALEX), now);
    cfg = simulationConfigFromSettings({}, s, now);
    p = planFromSettings(s, cfg, { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow, now });
    gilt = stressTestStrategy('full-il-gilt', quick(p));
  }));

  it('the engine config: two years lived, the horizon two shorter, the schedule from plan year 2, each year whole', () => {
    expect([cfg.yearOffset, cfg.monthsIntoYear, cfg.duration, cfg.years]).toEqual([2, 5, 27, 27]);
    // The run's year 0 is the twelve months from the pots' day, carrying plan year 2's figure whole (never a part-year).
    expect(cfg.targetSchedule).toEqual(s.targetSchedule.slice(2));
    expect(cfg.equityStart + cfg.bondStart + cfg.cashStart).toBe(s.equityMin + s.bondMin + s.cashTarget);   // today's pots, unscaled
  });

  it('the plan: from the age reached this tax year, for the years left; the State Pension two plan years sooner; year 0 kept', () => {
    expect(p.startAge).toBe(63);                                // 61 in year 0 (2024/25)
    expect(p.durationYears).toBe(27);
    expect(p.spStartYear).toBe(4);                              // 11 May 2030 is plan year 6: run year 4
    expect(at(IN_YEAR_0, () => planOf(settingsOf(draftOf(ALEX), IN_YEAR_0), IN_YEAR_0)).spStartYear).toBe(6);
    expect([p.firstTaxYear, p.runFirstTaxYear, p.yearOffset, p.monthsIntoYear]).toEqual([2024, 2026, 2, 5]);
    expect([p.pot, p.isa]).toEqual([450000, 15000]);            // the pots entered (the ladder's pinned totals)
  });

  it('the ladder: bought from the current tax year (2026/27, from cash), no year already lived, the first rung where year 0 put it (2028/29)', () => {
    expect(gilt.affordable).toBe(true);
    const ladder = gilt.plan;
    expect(ladder.firstTaxYear).toBe(2026);
    expect(ladder.years.every((y) => y.Y >= 2026)).toBe(true);   // neither 2024/25 nor 2025/26 is bought again
    expect(ladder.years[0]).toMatchObject({ Y: 2026, age: 63, from: 'cash' });
    expect(Math.round(ladder.years[0].need)).toBe(26500);      // the current plan year whole, over the twelve months from today
    expect(ladder.years.filter((y) => y.from === 'cash').map((y) => y.Y)).toEqual([2026, 2027]);
    const locked = ALEX.planDocument.strategy.r.plan;
    expect(ladder.years.find((y) => y.from !== 'cash')).toMatchObject({ Y: 2028, from: locked.years.find((y) => y.Y === 2028).from });
    expect(ladder.pricedAt).toBe('2026-09-30');                // the rungs' lives are measured from the day it is priced
    expect(ladder.orders.every((o) => o.matures > '2026-09-30')).toBe(true);
    expect(ladder.cash).toBeLessThan(locked.cash);             // no cash for the two years lived
    expect(ladder.total).toBeLessThan(locked.total);
  });

  it('with one year lived (December 2025): bought from 2025/26, three cash years to the same first rung (2028/29)', () => {
    const p1 = at(IN_YEAR_1, () => planOf(settingsOf(draftOf(ALEX), IN_YEAR_1), IN_YEAR_1));
    expect([p1.yearOffset, p1.monthsIntoYear, p1.runFirstTaxYear, p1.startAge, p1.durationYears]).toEqual([1, 8, 2025, 62, 28]);
    const r1 = at(IN_YEAR_1, () => stressTestStrategy('full-il-gilt', quick(p1)));
    expect(r1.affordable).toBe(true);
    expect(r1.plan.firstTaxYear).toBe(2025);
    expect(r1.plan.years.filter((y) => y.from === 'cash').map((y) => y.Y)).toEqual([2025, 2026, 2027]);
    expect(r1.plan.years.find((y) => y.from !== 'cash').Y).toBe(2028);
    expect(r1.plan.pricedAt).toBe('2025-12-15');
  });

  it('a gilt that has matured since is never bought, and the year it would have paid comes from cash (December 2027: T27 has matured)', () => {
    const later = at(AFTER_T27, () => stressTestStrategy('full-il-gilt', quick(planOf(settingsOf(draftOf(ALEX), AFTER_T27), AFTER_T27))));
    expect(later.affordable).toBe(true);
    expect(later.plan.firstTaxYear).toBe(2027);
    expect(later.plan.orders.map((o) => o.tidm)).not.toContain('T27');
    expect(later.plan.years.filter((y) => y.from === 'cash').map((y) => y.Y)).toEqual([2027, 2028]);
    expect(later.plan.orders.every((o) => o.matures > '2027-12-15')).toBe(true);
  });

  it('the bought strategies cost the years from today: year k of the run is plan year k + 2, whole', () => {
    // The same plan at the same clock run the old way, from year 0: the same settings with no word on where the pots belong.
    const fromZero = at(now, () => planOf(withoutPotsAsOf(s), now));
    expect(fromZero.yearOffset).toBeUndefined();
    const c = deriveCompareConfigs(p), c0 = deriveCompareConfigs(fromZero);
    for (let k = 1; k <= c.lr.ladderYears; k++) expect(c.lr.drawNetOfSp(k)).toBe(c0.lr.drawNetOfSp(k + 2));
    expect(c.baseLadderCost).toBeLessThan(c0.baseLadderCost);
  });

  it('the cones: index 0 is the pots\' day in plan year 2; one row per year left; the first year a whole one (worst 12 months too)', () => {
    const pv = { ...s, strategyId: 'pots-and-valves', strategyParams: {} };
    const r = at(now, () => stressTestStrategy('pots-and-valves', quick(planOf(pv, now))));
    expect(r.cones.wealth.p50).toHaveLength(28);
    expect(r.cones.wealth.p50[0]).toBeCloseTo(450000 + 15000, 6);   // the pots entered, not year 0's
    expect(r.cones.income.p50[0]).toBeCloseTo(26500, 6);
    expect(gilt.cones.income.p50[0]).toBeCloseTo(26500, 6);
    // The worst twelve months is the plan's smallest step, never the part of a year still to come (finding: 7/12 of the year's figure).
    expect(gilt.worst12.min).toBe(22000);
  });

  it('lump sums, spends and income streams move two years earlier: those already arrived are dropped, the taxable account lands in the run\'s year 0', () => {
    const lumpy = {
      ...s, strategyId: 'pots-and-valves', strategyParams: {}, taxableStart: 40000,
      windfalls: [{ label: 'Arrived', amount: 50000, year: 0, wrapper: 'cash' }, { label: 'Arrived last year', amount: 15000, year: 1, wrapper: 'cash' },
        { label: 'This year', amount: 20000, year: 2, wrapper: 'cash' }, { label: 'Later', amount: 10000, year: 5, wrapper: 'cash' }],
      extraWithdrawals: [{ label: 'Three years of help', amount: 9000, year: 1, years: 3 }, { label: 'Done', amount: 5000, year: 0, years: 2 }],
      extraIncomes: [{ label: 'Ended', annual: 6000, startYear: 0, endYear: 1, indexation: 'cpi' }, { label: 'Rent', annual: 4800, startYear: 0, endYear: 6, indexation: 'cpi' }],
      dbAmount: 7000, dbStartYear: 5
    };
    const c = at(now, () => simulationConfigFromSettings({}, lumpy, now));
    expect(c.windfalls.map((w) => [w.label, w.year])).toEqual([['This year', 0], ['Later', 3]]);
    expect(c.extraWithdrawals.map((w) => [w.label, w.year, w.years])).toEqual([['Three years of help', 0, 2]]);
    expect(c.extraIncomes.map((x) => [x.label, x.startYear, x.endYear])).toEqual([['Rent', 0, 4]]);
    expect(c.dbStartYear).toBe(3);
    const q = at(now, () => planOf(lumpy, now));
    expect(q.windfallByYear[0]).toBeCloseTo(40000 + 20000, 6);   // the taxable account today + the lump arriving this year
    expect(q.windfallByYear[3]).toBeCloseTo(10000, 6);
    expect(q.otherIncomeByYear[0]).toBeGreaterThan(0);
  });

  it('a phased (tax-free part) start that is over is ended; one still running keeps the years left', () => {
    const over = at(now, () => simulationConfigFromSettings({}, { ...s, accessMethod: 'ufpls', ufplsYears: 2, ufplsThenPcls: true }, now));
    expect([over.accessMethod, over.ufplsYears, over.ufplsThenPcls]).toEqual(['drawdown', null, false]);
    const left = at(now, () => simulationConfigFromSettings({}, { ...s, accessMethod: 'ufpls', ufplsYears: 5 }, now));
    expect([left.accessMethod, left.ufplsYears]).toEqual(['ufpls', 3]);
  });
});

describe('every strategy is asked for the same whole years (findings: a made-up schedule for a flat plan; Floor & flex left out)', () => {
  // Sam, fictional: retired, year 0 2025/26, so plan year 1 all through 2026/27; a draft, so seen from today.
  const SAM = { configured: true, retired: true, firstTaxYear: 2025, currentAge: 66, currentAgeAsOf: '2026-10-01', shapeAgeNow: 65, duration: 25,
    equityMin: 300000, bondMin: 150000, cashTarget: 40000, isaBalance: 0, baseSalary: 30000, spStartDate: '10 June 2030', spWeeklyAmount: 200,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', potsAsOf: POTS_TODAY };
  const APRIL = new Date('2026-04-10T11:00:00.000Z'), MAY = new Date('2026-05-10T11:00:00.000Z'), MARCH = new Date('2027-03-10T11:00:00.000Z');
  const configsOn = (settings, now) => at(now, () => { const p = planOf(settings, now); return { p, c: deriveCompareConfigs(p) }; });

  it('a flat plan stays flat: Ladder & ratchet draws its own yearly figure in May as in April', () => {
    const flat = { ...SAM, strategyId: 'ladder-and-ratchet', strategyParams: { drawAnnual: 20000 } };
    const april = configsOn(flat, APRIL), may = configsOn(flat, MAY);
    expect([april.p.yearOffset, april.p.monthsIntoYear, may.p.monthsIntoYear]).toEqual([1, 0, 1]);
    expect(may.p.targetSchedule == null || may.p.targetSchedule.length === 0).toBe(true);
    const draws = (x) => [1, 2, 3, 4].map((k) => x.c.lr.drawNetOfSp(k));
    expect(draws(may)).toEqual(draws(april));
    expect(may.c.lr.drawNetOfSp(1)).toBe(20000);
    expect(may.c.lr.baseLadderCost).toBe(april.c.lr.baseLadderCost);
  });

  it('the floors: Floor the schedule and Floor & flex both buy a whole first year, in April and in March alike', () => {
    const stepped = { ...SAM, strategyId: 'floor-and-flex', strategyParams: { essentialsAnnual: 18000 }, incomeShape: 'phases', incomeSteps: [{ fromAge: 65, amount: 30000 }] };
    const floorsOf = (x) => Object.values(x.c).filter((v) => v && typeof v.floorDraw === 'function');
    for (const now of [APRIL, MARCH]) {
      const x = configsOn(stepped, now);
      expect(x.p.targetSchedule[0]).toBe(30000);
      const draws = floorsOf(x).map((f) => f.floorDraw(1)).sort((a, b) => a - b);
      expect(draws).toContain(30000);                           // the schedule's floor
      expect(draws).toContain(18000);                           // the essentials floor
      expect(draws.every((d) => d === 30000 || d === 18000)).toBe(true);
    }
  });
});

describe('the document, the plan of record and the household read the offset', () => {
  const now = CORPUS_DAY;
  let s, pv, doc, giltDoc, gp;
  beforeAll(() => at(now, () => {
    s = settingsOf(draftOf(ALEX), now);
    pv = { ...s, strategyId: 'pots-and-valves', strategyParams: {} };
    const p = quick(planOf(pv, now));
    doc = buildPlanDocument({ planName: 'Alex', settings: pv, p, r: stressTestStrategy('pots-and-valves', p), lockedAt: '2026-09-30T11:00:00.000Z', now });
    const gs = { ...s, strategyParams: { ...s.strategyParams, bridgeCash: 17500 } };
    gp = quick(planOf(gs, now));
    giltDoc = buildPlanDocument({ planName: 'Alex', settings: gs, p: gp, r: stressTestStrategy('full-il-gilt', gp), lockedAt: '2026-09-30T11:00:00.000Z', now });
  }));

  it('the timeline keeps every plan year from year 0: the lived years from the schedule, the current one the run\'s year 0', () => {
    expect(doc.timeline).toHaveLength(29);
    expect(doc.timeline[0]).toMatchObject({ y: 0, taxYear: '2024/25', age: 61, gross: 26500, lived: true });
    expect(doc.timeline[1]).toMatchObject({ y: 1, taxYear: '2025/26', age: 62, gross: 26500, lived: true });
    expect(doc.timeline[2]).toMatchObject({ y: 2, taxYear: '2026/27', age: 63, gross: 26500 });
    expect(doc.timeline[2].lived).toBeUndefined();
    expect(doc.timeline[2].monthsLeft).toBeUndefined();
    expect(doc.timeline[13]).toMatchObject({ y: 13, age: 74, gross: 26500 });
    expect(doc.timeline[14]).toMatchObject({ y: 14, age: 75, gross: 22000 });   // the step down, at the plan year year 0 put it in
    expect(doc.pots.asOfPlanYear).toBe(2);
    expect(doc.assumptions.duration).toBe(29);
    expect(doc.timing).toMatchObject({ firstTaxYear: 2024, planYearNow: 2, elapsedYears: 2, monthsIntoYear: 5 });
    expect(doc.strategy.p).toMatchObject({ yearOffset: 2, monthsIntoYear: 5, runFirstTaxYear: 2026, firstTaxYear: 2024 });
  });

  it('a running ladder\'s current-year row adds up; an older plan\'s extra cash is in no document and no run (7.4.2)', () => {
    const row = giltDoc.timeline[2];
    expect(row).toMatchObject({ y: 2, gross: 26500, sp: 0, other: 0, contract: 26500, market: 0 });
    expect(row.contract).toBe(Math.round(giltDoc.strategy.r.plan.years[0].need));
    expect('bridgeCash' in giltDoc.assumptions).toBe(false);
    expect(gp.params.bridgeCash).toBeUndefined();              // the run is never handed it
    // In year 0 and before it, the same: the ladder's cash years are its only cash, and nothing records any other.
    const docAt = (now) => at(now, () => { const gs = { ...settingsOf(draftOf(ALEX), now), strategyParams: { ...s.strategyParams, bridgeCash: 17500 } }; const q = quick(planOf(gs, now)); return buildPlanDocument({ planName: 'Alex', settings: gs, p: q, r: stressTestStrategy('full-il-gilt', q), now }); });
    const plainAt = (now) => at(now, () => { const gs = { ...settingsOf(draftOf(ALEX), now), strategyParams: { ...s.strategyParams, bridgeCash: 0 } }; return stressTestStrategy('full-il-gilt', quick(planOf(gs, now))).plan.cash; });
    for (const now of [IN_YEAR_0, new Date('2024-03-15T12:00:00.000Z')]) {
      const d = docAt(now);
      expect('bridgeCash' in d.assumptions).toBe(false);
      expect(d.strategy.r.plan.cash).toBe(plainAt(now));
    }
    expect(docAt(IN_YEAR_0).pots.asOfPlanYear).toBeUndefined();   // no stop month: its pots wait for nothing, as always
  });

  it('6.51.0: a plan that says when work stopped, on pots of its year 0, records them as year 0\'s (pots.asOfPlanYear 0)', () => {
    // The same draft in December of its year 0, saying it stopped work in October 2024 (research/plan-start.md §6 decision
    // 8): its pots are today's, entered after that year's 6 April. Nothing is shifted, the document says where its pots
    // stand, and its ladder's cash is its cash years, as on every plan from 7.4.2.
    const stopped = (raw) => ({ ...raw, stressTool: { ...raw.stressTool, settings: { ...raw.stressTool.settings, stoppedWork: '2024-10', strategyParams: { ...raw.stressTool.settings.strategyParams, bridgeCash: 17500 } } } });
    const runOn = (raw, now, lockedAt = null) => at(now, () => { const gs = settingsOf(raw, now); const q = quick(planOf(gs, now)); return { gs, q, doc: buildPlanDocument({ planName: 'Alex', settings: gs, p: q, r: stressTestStrategy('full-il-gilt', q), lockedAt, now }) }; });
    const noCash = at(IN_YEAR_0, () => { const gs = { ...settingsOf(draftOf(ALEX), IN_YEAR_0), strategyParams: { ...s.strategyParams, bridgeCash: 0 } }; return stressTestStrategy('full-il-gilt', quick(planOf(gs, IN_YEAR_0))).plan.cash; });
    const draft = runOn(stopped(draftOf(ALEX)), IN_YEAR_0);
    expect(draft.gs.potsAsOf).toBe(POTS_TODAY);
    expect(draft.q.yearOffset).toBeUndefined();                // nothing lived: nothing shifted
    expect('runUpSpent' in draft.q).toBe(false);
    expect(draft.doc.strategy.r.plan.cash).toBe(noCash);
    expect(draft.doc.pots.asOfPlanYear).toBe(0);               // written: its pots are year 0's, after its April
    // Locked that day (its document): the same on every later day of year 0, and from year 0 as before
    const lockedInYear0 = { ...stopped(ALEX), planDocument: draft.doc };
    expect(lockedPotsAsOf(lockedInYear0)).toEqual({ elapsedYears: 0, monthsIntoYear: draft.doc.timing.monthsIntoYear });
    const later = runOn(lockedInYear0, new Date('2025-03-15T12:00:00.000Z'), '2024-12-15T12:00:00.000Z');
    expect([later.q.yearOffset, later.doc.pots.asOfPlanYear, later.doc.strategy.r.plan.cash]).toEqual([undefined, 0, noCash]);
    // Locked before its year 0 (its document says nothing of year 0's pots): run from year 0, no position written
    const lockedBefore = { ...stopped(ALEX), planDocument: { ...ALEX.planDocument, pots: { ...ALEX.planDocument.pots } } };
    delete lockedBefore.planDocument.pots.asOfPlanYear;
    expect(lockedPotsAsOf(lockedBefore)).toBeNull();
    const before = runOn(lockedBefore, IN_YEAR_0, '2024-03-15T12:00:00.000Z');
    expect(before.doc.pots.asOfPlanYear).toBeUndefined();
    expect(before.doc.strategy.r.plan.cash).toBe(noCash);
  });

  it('the pot is read on the run\'s own axis: index k is the pots\' day plus k years', () => {
    const wc = doc.strategy.r.cones.wealth;
    const read = (iso, pot) => whereAmI(doc, { today: new Date(iso), potsToday: pot }).pot;
    const sameDay = read('2026-09-30T12:00:00.000Z', 465000);
    expect([sameDay.planYear, sameDay.p50]).toEqual([2, Math.round(wc.p50[0])]);
    expect(sameDay.verdict).toBe('start');
    const january = read('2027-01-15T12:00:00.000Z', 452000);   // four months after the pots' day
    expect(january.p50).toBe(Math.round(bandAt(wc, 0, 4 / 12).p50));
    expect(january.monthsIn).toBe(9);
    const june = read('2027-06-15T12:00:00.000Z', 440000);      // plan year 3, nine months after the pots' day
    expect(june.planYear).toBe(3);
    expect(june.p50).toBe(Math.round(bandAt(wc, 0, 9 / 12).p50));
    // Twelve months on, the band's year-1 point: a pot equal to its middle (in the pots' day's pounds) reads as the middle.
    const factor = pricesSinceStart(doc, '2027-09').factor;
    const yearOn = read('2027-09-15T12:00:00.000Z', wc.p50[1] * factor);
    expect([yearOn.planYear, yearOn.p50, yearOn.p10, yearOn.p90]).toEqual([3, Math.round(wc.p50[1]), Math.round(wc.p10[1]), Math.round(wc.p90[1])]);
    expect(yearOn.verdict).toBe('band');
    expect(yearOn.band).toBe('p50–p90');
  });

  it('prices count from the day the plan was run, not from year 0', () => {
    expect(pricesSinceStart(doc, '2026-09').factor).toBe(1);
    expect(pricesSinceStart(doc, '2027-01').factor).toBeCloseTo(Math.pow(1.04, 4 / 12), 12);
    expect(pricesSinceStart(doc, '2027-06').factor).toBeCloseTo(Math.pow(1.04, 7 / 12 + 2 / 12), 12);
    expect(pricesSinceStart(doc, '2027-09').factor).toBeCloseTo(1.04, 12);
  });

  it('the plan of record of a plan locked in its year 2 keeps its plan-year index; plan vs actual skips the lived years', () => {
    const ds = ALEX.decisionTool.settings;
    const por = planOfRecordFor({ ...ds, ...seedDecisionFromStress(s, ds) }, now);
    expect(por.drawdown).toHaveLength(30);
    expect(por.drawdown[0]).toEqual({ year: 0, lived: true, sippDraw: 26500 });   // no tax or ISA yardstick: never entered
    expect(por.drawdown[1]).toEqual({ year: 1, lived: true, sippDraw: 26500 });
    expect(por.drawdown.every((r, y) => r.year === y)).toBe(true);
    expect(por.drawdown[2]).toMatchObject({ year: 2, sippDraw: 26500, isaBalance: 15000 });
    expect(por.drawdown[2].tax).toBeGreaterThan(0);
    // The planner's "plan vs actual" reads tax and ISA off every row it compares. Re-written in 6.51.0 (research/plan-start.md
    // §6 decision 7): a lived row used to be left out; it is now compared on the draw against the plan's own figure for the
    // year, and its tax and ISA show "—" — never £0, because the pots at that year's start were never entered.
    // (6.53.0: the row is planStartUi.yearRowHtml, which hands a lived year to livedYearRowHtml.)
    expect(INDEX_HTML).toMatch(/if \(plan\) rows \+= yearRowHtml\(y, byYear\[y\], plan, taxYears\[byYear\[y\]\[0\]\.taxYear\] \|\| null, firstSetUpYear, gbp\);/);
    expect(livedYearRowHtml(2, [{ sipp: 2200 }], { year: 2, lived: true, sippDraw: 26400 }, (v) => '£' + v)).toMatch(/<td>—<\/td><td>—<\/td><td>—<\/td><\/tr>$/);
    expect(yearRowHtml(2, [{ sipp: 2200 }], { year: 2, lived: true, sippDraw: 26400 }, null, 0, (v) => '£' + v)).toBe(livedYearRowHtml(2, [{ sipp: 2200 }], { year: 2, lived: true, sippDraw: 26400 }, (v) => '£' + v));
    // In year 0 the same settings give the plan of record they always gave.
    const inYear0 = planOfRecordFor({ ...ds, ...seedDecisionFromStress(s, ds) }, IN_YEAR_0);
    expect(inYear0.drawdown[0].lived).toBeUndefined();
    expect(inYear0.drawdown).toHaveLength(30);
  });

  it('the plan of record moves a State Pension year field whenever the projection reads it (a date with no weekly amount)', () => {
    const ds = ALEX.decisionTool.settings;
    const base = { ...ds, ...seedDecisionFromStress(s, ds), spStartDate: '11 May 2030', spWeeklyAmount: 0, statePension: 12000, statePensionYear: 6 };
    expect(settingsAsSeenFromToday(base, 2).statePensionYear).toBe(4);
    const restated = { ...base, firstTaxYear: 2026, duration: base.duration - 2, targetSchedule: base.targetSchedule.slice(2), statePensionYear: 4 };
    const a = planOfRecordFor(base, now).drawdown.slice(2).map(({ year, ...r }) => r);
    const b = planOfRecordFor(restated, now).drawdown.map(({ year, ...r }) => r);
    expect(a).toEqual(b);
  });

  it('the household: a started plan\'s offset is negative, its calendar years are its plan years from today, and "Use this split" never writes a £0 first step', () => {
    const partner = at(now, () => settingsOf(read('10-couple-b'), now));
    expect(startOffset(s, now)).toBe(-2);
    expect(startOffset(settingsOf(ALEX, now), now)).toBe(0);   // locked in its year 0: as committed, as before
    expect(startOffset(partner, now)).toBeGreaterThanOrEqual(0);
    const split = householdDrawSplit({ settings: s, name: 'Alex' }, { settings: partner, name: 'Sam' }, { now });
    expect(split.profiles.a.off).toBe(-2);
    expect(split.rows[0]).toMatchObject({ year: 0, ageA: 63 });
    for (const y of [0, 1]) {                                   // the lived years at the plan's own figure, both ways
      expect(split.schedules.together.a[y]).toBe(26500);
      expect(split.schedules.own.a[y]).toBe(26500);
    }
    expect(split.settings.a.targetSchedule[0]).toBe(26500);
    expect(split.steps.a[0]).toEqual({ fromAge: 61, amount: 26500 });
    expect(split.needs.own.a).toHaveLength(30);
    const tl = householdIncomeTimeline(s, partner, 3, now);
    expect(tl[0].needA).toBe(26500);                            // calendar year 0 is Alex's plan year 2
  });
});

describe('with no year lived, nothing moves', () => {
  it('the transformation hands back what it was given', () => {
    const cfg = { years: 30, duration: 30, targetSchedule: [1, 2, 3] };
    expect(planAsSeenFromToday(cfg, { duration: 30 }, { elapsedYears: 2, monthsIntoYear: 7 })).toBe(cfg);   // no word on the pots
    expect(planAsSeenFromToday(cfg, { duration: 30, potsAsOf: POTS_TODAY }, { elapsedYears: 0, monthsIntoYear: 7 })).toBe(cfg);
    const s = { duration: 30, firstTaxYear: 2026 };
    expect(settingsAsSeenFromToday(s, 0)).toBe(s);
    // A config that already carries its offset is never moved twice.
    const moved = planAsSeenFromToday(cfg, { duration: 30, potsAsOf: POTS_TODAY }, { elapsedYears: 2, monthsIntoYear: 0 });
    expect(moved.yearOffset).toBe(2);
    expect(planAsSeenFromToday(moved, { duration: 30, potsAsOf: POTS_TODAY }, { elapsedYears: 3, monthsIntoYear: 4 })).toBe(moved);
  });
  it('fixture 13 as a draft in its year 0 runs as it was locked: the ladder from 2024/25, no offset, no pricing day recorded', () => {
    const p = at(IN_YEAR_0, () => planOf(settingsOf(draftOf(ALEX), IN_YEAR_0), IN_YEAR_0));
    expect([p.yearOffset, p.runFirstTaxYear, p.monthsIntoYear, p.startAge, p.durationYears]).toEqual([undefined, undefined, undefined, 61, 29]);
    const r = at(IN_YEAR_0, () => stressTestStrategy('full-il-gilt', quick(p)));
    expect(r.plan.firstTaxYear).toBe(2024);
    expect(r.plan.pricedAt).toBeUndefined();
    expect(r.plan.years.filter((y) => y.from === 'cash').map((y) => y.Y)).toEqual([2024, 2025, 2026, 2027]);
  });
});

describe('ladderAsSeenFromToday: the ladder\'s own timing is counted from year 0, never from today', () => {
  const linkers = [
    { tidm: 'A26', lag: 3, cleanPrice: 100, maturityDateIso: '2026-03-22' },
    { tidm: 'B27', lag: 3, cleanPrice: 100, maturityDateIso: '2027-11-22' },
    { tidm: 'C29', lag: 3, cleanPrice: 100, maturityDateIso: '2029-03-22' }
  ];
  it('the first rung stays at year 0 + cash years; the years from today to it are cash, at least the current one', () => {
    expect(ladderAsSeenFromToday({ planFirstTaxYear: 2025, runFirstTaxYear: 2026, cashYears: 4, linkers, todayIso: '2026-09-30' })).toEqual(expect.objectContaining({ firstTaxYear: 2026, cashYears: 3 }));
    expect(ladderAsSeenFromToday({ planFirstTaxYear: 2020, runFirstTaxYear: 2026, cashYears: 2, linkers, todayIso: '2026-09-30' }).cashYears).toBe(2);   // 2027/28: no gilt still to mature pays it
    expect(ladderAsSeenFromToday({ planFirstTaxYear: 2020, runFirstTaxYear: 2028, cashYears: 2, linkers, todayIso: '2028-09-30' }).cashYears).toBe(1);   // the current year, C29 pays 2029/30
  });
  it('a gilt that has matured is never bought', () => {
    const out = ladderAsSeenFromToday({ planFirstTaxYear: 2025, runFirstTaxYear: 2027, cashYears: 2, linkers, todayIso: '2027-12-15' });
    expect(out.linkers.map((g) => g.tidm)).toEqual(['C29']);
    expect(out.cashYears).toBe(2);                              // 2027/28 and 2028/29: B27 has matured, its money is cash
  });
  it('a rung\'s life is measured from the day the ladder was priced when it records one, else from the April before its first year', () => {
    const order = { matures: '2031-04-06' };
    expect(yearsToMaturity(order, 2027)).toBeCloseTo(5, 2);
    expect(yearsToMaturity(order, 2027, '2026-04-06')).toBeCloseTo(5, 2);
    expect(yearsToMaturity(order, 2027, '2029-04-06')).toBeCloseTo(2, 2);
  });
});

describe('the bond tent glides from the plan\'s year 0, not from today', () => {
  it('a run from plan year N reads the glide at plan year N + k over the plan\'s own length', () => {
    const glide = { start: 0.3, end: 0.6 };
    for (const k of [0, 1, 5, 12]) expect(glideShareForYear({ ...glide, yearOffset: 3, planDuration: 35 }, k, 32)).toBeCloseTo(glideShareForYear(glide, k + 3, 35), 12);
    expect(glideShareForYear(glide, 4, 35)).toBe(glideShareForYear({ ...glide }, 4, 35));
  });
});
