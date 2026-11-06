/**
 * The ways of drawing that count years from the plan's year 0, read from today (6.55.0; research/plan-start.md §3).
 *
 * Ladder & ratchet's ladder years and Bridge & engine's cash years are counted from the plan's year 0: the Decision tool's
 * month reads them against the plan year, and a move of the plan's start moves them with year 0 (PlanMove.laterParams). A
 * plan whose year 0 is behind it is run as seen from today (PlanFromToday.js) — until 6.55.0 those two counts were still
 * counted from the run's own first year, so a plan two years in held its ladder, or its cash, two years too long. They are
 * now the years left of them from today, never below none, as the full gilt ladder's cash years already were
 * (ladderAsSeenFromToday). An unset ladder is worked out from the plan's whole length from year 0, not the years left of it
 * (PlanFromToday.ladderYearsFromYear0), so the run, the Decision tool's month and a move all end it in the same year.
 *
 * The subject is Alex (fixture 13, fictional) as a draft on 30 September 2026: year 0 2024/25, two tax years lived. The
 * yardstick is the same plan made today — year 0 2026/27, the age reached, two years shorter, the income from plan year 2
 * on — with each count two fewer: it must run exactly as the plan two years in does. The pins (`PINS`) are the figures
 * the plan two years in gives for both ways, taken on the code of this change.
 *
 * With no year lived nothing moves: tests/planFromToday.identity.test.js holds every saved plan to its figures.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { effectiveStressSettings } from '../src/services/PlanReading.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { planFromSettings, stressTestStrategy } from '../src/strategies/stressTest.js';
import { deriveCompareConfigs, ladderYearsOfPlan } from '../src/strategies/compareRunner.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { dialDefaults } from '../src/answers/plan/waysRun.js';
import { withoutPotsAsOf, countLeftFromToday, reviewMonthsFromToday, COUNTS_FROM_YEAR0, ladderYearsFromYear0, planYearsOf } from '../src/services/PlanFromToday.js';
import { realYieldForYear, setLinkersOverride } from '../src/services/LinkerUniverse.js';
import { setEquityOverride } from '../src/services/EquityIndex.js';

const PLANS = join(process.cwd(), 'tests', 'fixtures', 'plans');
const read = (name) => JSON.parse(readFileSync(join(PLANS, name + '.json'), 'utf8'));
const GILTS = JSON.parse(readFileSync(join(PLANS, 'market', 'gilts.json'), 'utf8'));
const EQUITY = JSON.parse(readFileSync(join(PLANS, 'market', 'equity.json'), 'utf8'));
const ALEX = read('13-stopped-drawing-since');
const NOW = new Date('2026-09-30T11:00:00.000Z');   // plan year 2, five months gone (UTC by the middle of the UK day)

function at(now, fn) {
  vi.useFakeTimers({ toFake: ['Date'], now });
  setLinkersOverride(GILTS, now);
  try { return fn(); } finally { vi.useRealTimers(); }
}
const draftOf = (raw) => ({ ...raw, decisionTool: { ...raw.decisionTool, settings: { ...raw.decisionTool.settings, locked: false } } });
const planOf = (s) => planFromSettings(s, simulationConfigFromSettings({}, s, NOW), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now: NOW });
const quick = (p) => ({ ...p, mcRuns: 60, stride: 12 });
/** A way's config with its functions read over the run (k = 0 … N + 1), the yield curve and the seed left out (the same function on both). */
const sampled = (cfg, N) => {
  if (!cfg) return cfg;
  const out = {};
  for (const [k, v] of Object.entries(cfg)) {
    if (typeof v !== 'function') out[k] = v;
    else if (['drawNetOfSp', 'floorDraw', 'amountAt'].includes(k)) out[k] = Array.from({ length: N + 2 }, (_, i) => v(i));
  }
  return out;
};
/** A run's figures, without what only names the plan's place (its year 0, the offset) — compared between two plans. */
const figures = (r) => ({ affordable: r.affordable, ruin: r.ruin, worst12: r.worst12, terminal: r.terminal, cones: r.cones, guaranteedToAge: r.guaranteedToAge, failAges: r.failAges });

let s;   // Alex's settings as a draft on the corpus day: seen from today
beforeAll(() => { setEquityOverride(EQUITY); s = at(NOW, () => effectiveStressSettings(upgradeScenario(draftOf(ALEX), { now: NOW }).scenario, { now: NOW })); });
afterAll(() => { setLinkersOverride(null); setEquityOverride(null); vi.useRealTimers(); });

/** Alex's plan with a way of drawing and its dials (the pinned totals kept). */
const withWay = (settings, id, dials) => ({ ...settings, strategyId: id, strategyParams: { sippTotal: 450000, isaTotal: 15000, ...dials } });
/** The same plan made today: year 0 the current tax year, the age reached, two years shorter, the income from plan year 2. */
const madeToday = (settings) => ({ ...withoutPotsAsOf(settings), firstTaxYear: 2026, shapeAgeNow: settings.shapeAgeNow + 2, duration: settings.duration - 2, targetSchedule: settings.targetSchedule.slice(2) });

describe('the subject: Alex two tax years into the plan, seen from today', () => {
  it('runs from plan year 2: two years lived, at 63, for 27 years', () => {
    const p = at(NOW, () => planOf(withWay(s, 'bridge-and-engine', { cashYears: 3 })));
    expect([p.yearOffset, p.startAge, p.durationYears, p.firstTaxYear, p.runFirstTaxYear]).toEqual([2, 63, 27, 2024, 2026]);
  });
});

describe('Bridge & engine: its cash years are the years left of them from today', () => {
  it('three cash years from year 0, two lived: one left — the current plan year — and then the rungs', () => {
    const p = at(NOW, () => planOf(withWay(s, 'bridge-and-engine', { cashYears: 3 })));
    const c = deriveCompareConfigs(p);
    expect(c.be.cashYears).toBe(1);
    expect(c.be.bridgeAge).toBe(67);                            // an age: the same as at year 0 (the State Pension's)
    expect(c.be.B).toBe(4);                                     // 63 to 67
  });
  it('not set: the engine\'s three, from year 0, as the Decision tool and the move count them — one left', () => {
    const c = at(NOW, () => deriveCompareConfigs(planOf(withWay(s, 'bridge-and-engine', {}))));
    expect(c.be.cashYears).toBe(1);
  });
  it('all lived: none left, never fewer (two from year 0, two lived)', () => {
    const c = at(NOW, () => deriveCompareConfigs(planOf(withWay(s, 'bridge-and-engine', { cashYears: 2 }))));
    expect(c.be.cashYears).toBe(0);
    expect(c.be.floorCost).toBeGreaterThan(0);                  // the bridge is all rungs now
  });
  it('runs exactly as the same plan made today with one cash year', () => {
    const p = at(NOW, () => planOf(withWay(s, 'bridge-and-engine', { cashYears: 3 })));
    const q = at(NOW, () => planOf(withWay(madeToday(s), 'bridge-and-engine', { cashYears: 1 })));
    expect(q.yearOffset).toBeUndefined();
    expect([q.startAge, q.durationYears, q.spStartYear]).toEqual([p.startAge, p.durationYears, p.spStartYear]);
    const c = deriveCompareConfigs(p), d = deriveCompareConfigs(q);
    expect(sampled(c.be, p.durationYears)).toEqual(sampled(d.be, q.durationYears));
    expect(c.beCost).toBe(d.beCost);
    const r = at(NOW, () => stressTestStrategy('bridge-and-engine', quick(p))), r0 = at(NOW, () => stressTestStrategy('bridge-and-engine', quick(q)));
    expect(figures(r)).toEqual(figures(r0));
    expect(r.signature.cashYears).toBe(1);
  });
  it('the plan document records the run from today: one cash year, the plan\'s own dial of three beside it', () => {
    const settings = withWay(s, 'bridge-and-engine', { cashYears: 3 });
    const p = at(NOW, () => quick(planOf(settings)));
    const r = at(NOW, () => stressTestStrategy('bridge-and-engine', p));
    const doc = at(NOW, () => buildPlanDocument({ planName: 'Alex', settings, p, r, lockedAt: '2026-09-30T11:00:00.000Z', lockedBy: 'test', journey: [], accumulation: {}, holdings: null, now: NOW }));
    expect(doc.strategy.r.signature.cashYears).toBe(1);
    expect(doc.strategy.params.cashYears).toBe(3);
  });
});

describe('Ladder & ratchet: its ladder years are the years left of them from today', () => {
  it('ten ladder years from year 0, two lived: eight left, the first ratchet rung where year 0 put it', () => {
    const p = at(NOW, () => planOf(withWay(s, 'ladder-and-ratchet', { ladderYears: 10 })));
    const c = deriveCompareConfigs(p);
    expect([c.lr.ladderYears, c.lr.L, c.lr.firstRung]).toEqual([8, 96, 9]);
  });
  it('runs exactly as the same plan made today with eight ladder years', () => {
    const p = at(NOW, () => planOf(withWay(s, 'ladder-and-ratchet', { ladderYears: 10 })));
    const q = at(NOW, () => planOf(withWay(madeToday(s), 'ladder-and-ratchet', { ladderYears: 8 })));
    const c = deriveCompareConfigs(p), d = deriveCompareConfigs(q);
    expect(sampled(c.lr, p.durationYears)).toEqual(sampled(d.lr, q.durationYears));
    expect(c.baseLadderCost).toBe(d.baseLadderCost);
    const r = at(NOW, () => stressTestStrategy('ladder-and-ratchet', quick(p))), r0 = at(NOW, () => stressTestStrategy('ladder-and-ratchet', quick(q)));
    expect(figures(r)).toEqual(figures(r0));
    expect(r.signature.ladderYears).toBe(8);
    expect(r.guaranteedToAge.startsWith('71 by contract')).toBe(true);   // the age the ladder pays to: 61 + 10, as at year 0
  });
  it('all lived: none left — the sleeve pays from today, and the run still runs', () => {
    const p = at(NOW, () => planOf(withWay(s, 'ladder-and-ratchet', { ladderYears: 2 })));
    const c = deriveCompareConfigs(p);
    expect([c.lr.ladderYears, c.lr.L, c.baseLadderCost]).toEqual([0, 0, 0]);
    const r = at(NOW, () => stressTestStrategy('ladder-and-ratchet', quick(p)));
    expect(r.affordable).toBe(true);
    expect(r.signature.ladderYears).toBe(0);
    // nothing is held by contract from today: never "guaranteed to 63", today's age
    expect(r.guaranteedToAge.startsWith('none by contract now: the base ladder has all been paid')).toBe(true);
    expect(r.guaranteedToAge).not.toMatch(/^63 by contract/);
  });
  it('not set: worked out from the plan\'s whole length from year 0 (29 years: 14), and what is left of it run — twelve', () => {
    // Before, an unset ladder was worked out again from the 27 years left (13), so it ran to plan year 14 while year 0 and
    // the Decision tool's month end it with plan year 13.
    const p = at(NOW, () => planOf(withWay(s, 'ladder-and-ratchet', {})));
    expect(p.durationYears + p.yearOffset).toBe(29);
    expect(ladderYearsOfPlan(undefined, s.duration)).toBe(14);
    const c = deriveCompareConfigs(p);
    expect([c.lr.ladderYears, c.lr.firstRung]).toEqual([12, 13]);
    // it runs exactly as the same plan made today with the twelve left as its dial
    const q = at(NOW, () => planOf(withWay(madeToday(s), 'ladder-and-ratchet', { ladderYears: 12 })));
    const d = deriveCompareConfigs(q);
    expect(sampled(c.lr, p.durationYears)).toEqual(sampled(d.lr, q.durationYears));
    expect(c.baseLadderCost).toBe(d.baseLadderCost);
  });
  it('calendar reviews stay on the plan\'s five-year marks: plan years 5, 10 and 15 are run months 36, 96 and 156', () => {
    const p = at(NOW, () => planOf(withWay(s, 'ladder-and-ratchet', { ladderYears: 15, triggerMode: 'calendar' })));
    expect(deriveCompareConfigs(p).lr.trigger.reviews).toEqual([36, 96, 156]);
  });
  it('the preview\'s dial shows an unset ladder\'s years as the dial counts them, from year 0: fourteen', () => {
    const p = at(NOW, () => planOf(withWay(s, 'ladder-and-ratchet', {})));
    expect(dialDefaults('ladder-and-ratchet', p).ladderYears).toBe(14);
    expect(dialDefaults('ladder-and-ratchet', { ...p, yearOffset: undefined }).ladderYears).toBe(13);   // a plan of 27 years from year 0
  });
  it('calendar reviews of an unset ladder: on the marks of its fourteen years from year 0 — plan years 5 and 10', () => {
    const p = at(NOW, () => planOf(withWay(s, 'ladder-and-ratchet', { triggerMode: 'calendar' })));
    expect(deriveCompareConfigs(p).lr.trigger.reviews).toEqual([36, 96]);
  });
});

/**
 * The figures of the plan two years in, for both ways, pinned on the code of this change (to £5 and to a tenth of a
 * percent: Node majors may differ in the last bit of a figure). Before it, the bridge held two more years in cash than its
 * dial gives, and the base ladder bought plan years 2 to 11 for a plan whose ladder ends with plan year 9.
 */
const PINS = {
  'bridge-and-engine': { dials: { cashYears: 3 }, cost: 104471, E0: 360529, ruinHist: 0.3, ruinMc: 3.3, terminalP50: 867209 },
  'ladder-and-ratchet': { dials: { ladderYears: 10 }, cost: 160138, E0: 304862, ruinHist: 23.4, ruinMc: 21.7, terminalP50: 420044 }
};
describe('the pins: Alex two years in, for both ways', () => {
  for (const [id, pin] of Object.entries(PINS)) {
    it(id, () => {
      const p = at(NOW, () => planOf(withWay(s, id, pin.dials)));
      const c = deriveCompareConfigs(p);
      const way = id === 'bridge-and-engine' ? { cost: c.beCost, E0: c.be.E0 } : { cost: c.baseLadderCost, E0: c.lr.E0 };
      expect(way.cost).toBeCloseTo(pin.cost, -1);
      expect(way.E0).toBeCloseTo(pin.E0, -1);
      const r = at(NOW, () => stressTestStrategy(id, quick(p)));
      expect(r.ruin.hist).toBeCloseTo(pin.ruinHist, 1);
      expect(r.ruin.mc).toBeCloseTo(pin.ruinMc, 1);
      expect(r.terminal.p50).toBeCloseTo(pin.terminalP50, -1);
    });
  }
});

describe('the counts themselves (PlanFromToday)', () => {
  it('a count from year 0 less the years lived, never below none; the same count with none lived', () => {
    expect([countLeftFromToday(3, 0), countLeftFromToday(3, 2), countLeftFromToday(3, 5), countLeftFromToday(10, 2)]).toEqual([3, 1, 0, 8]);
  });
  it('calendar reviews: every five plan years within the ladder, those still to come, on the run\'s months', () => {
    expect(reviewMonthsFromToday(15, 0)).toEqual([60, 120, 180]);
    expect(reviewMonthsFromToday(15, 2)).toEqual([36, 96, 156]);
    expect(reviewMonthsFromToday(10, 5)).toEqual([60]);
    expect(reviewMonthsFromToday(4, 2)).toEqual([]);
  });
  it('the ways that count years from year 0, one table for the move and the run; an unset ladder from the plan\'s length', () => {
    const { 'ladder-and-ratchet': lr, ...rest } = COUNTS_FROM_YEAR0;
    expect(rest).toEqual({ 'full-il-gilt': { cashYears: 2 }, 'gilt-rotation': { cashYears: 2 }, 'bridge-and-engine': { cashYears: 3 } });
    expect(Object.keys(lr)).toEqual(['ladderYears']);
    expect([36, 29, 20, 2].map(lr.ladderYears)).toEqual([15, 14, 10, 1]);
  });
  it('the ladder\'s years from year 0: the dial, else up to 15 or half the plan; the plan\'s length as a run reads it', () => {
    expect([ladderYearsFromYear0(10, 29), ladderYearsFromYear0(40, 29), ladderYearsFromYear0(null, 29), ladderYearsFromYear0(0, 20), ladderYearsFromYear0(null, 1)]).toEqual([10, 28, 14, 10, 1]);
    expect([planYearsOf(29), planYearsOf(undefined), planYearsOf(''), planYearsOf(60)]).toEqual([29, 35, 35, 45]);
  });
});

describe('the run and the Decision tool\'s month agree on which plan years are inside the ladder and the cash', () => {
  // The month (index.html decisionStrategyOverlay) reads the plan year against the count from year 0: Ladder & ratchet's
  // ladder years by the run's own rule (compareRunner.ladderYearsOfPlan), Bridge & engine's cash years 3 when not set.
  // The run's year k is plan year yearOffset + k − 1. Alex as a draft started 0, 1 and 2 tax years ago.
  const startedAgo = (e) => at(NOW, () => effectiveStressSettings(upgradeScenario(((raw) => ({ ...raw,
    stressTool: { ...raw.stressTool, settings: { ...raw.stressTool.settings, firstTaxYear: 2026 - e } },
    decisionTool: { ...raw.decisionTool, settings: { ...raw.decisionTool.settings, locked: false, firstTaxYear: 2026 - e } } }))(ALEX), { now: NOW }).scenario, { now: NOW }));
  for (const e of [0, 1, 2]) {
    it(e + ' years lived', () => {
      const se = startedAgo(e);
      for (const dials of [{ ladderYears: 10 }, { ladderYears: 1 }, { ladderYears: 15 }, {}]) {
        const p = at(NOW, () => planOf(withWay(se, 'ladder-and-ratchet', dials)));
        expect(p.yearOffset || 0).toBe(e);
        const c = deriveCompareConfigs(p);
        const yrs = ladderYearsOfPlan(dials.ladderYears, se.duration);
        for (let k = 1; k <= p.durationYears; k++) expect(k <= c.lr.ladderYears, JSON.stringify(dials) + ' run year ' + k).toBe(e + k - 1 < yrs);
      }
      for (const dials of [{ cashYears: 3 }, {}, { cashYears: 1 }, { cashYears: 5 }]) {
        const c = at(NOW, () => deriveCompareConfigs(planOf(withWay(se, 'bridge-and-engine', dials))));
        for (let k = 1; k <= c.be.B; k++) expect(k <= c.be.cashYears, JSON.stringify(dials) + ' run year ' + k).toBe(e + k - 1 < (dials.cashYears ?? 3));
      }
    });
  }
});
