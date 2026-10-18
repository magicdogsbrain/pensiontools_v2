/**
 * The Household tab's survivor and care checks through each plan's OWN strategy's one test (household sweep, Oct 2026).
 * Until then both ran the Pots & Valves engine directly on each plan's equity/bond/cash, whatever its strategy: a gilt
 * ladder + rotation that leaves about £0.7M in its own test was said to leave about £1.5M — a growth portfolio's median,
 * the pension's and the ISA's medians summed from different futures, raised into nominal pounds beside today's spending.
 *
 * Small Monte Carlo counts (the arithmetic is the engines' own); the clock is pinned.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { stressTestStrategy, planFromSettings } from '../src/strategies/stressTest.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { runSurvivorCheck, runCareCheck, leftAtYear, careRowsFor, scheduleOf, startOffset, combineHouseholdStrategies } from '../src/services/HouseholdService.js';
import { householdDrawSplit } from '../src/services/HouseholdDraw.js';
import { oneAnswer } from '../src/services/OneAnswer.js';
import { grossToNet } from '../src/services/TaxCalculator.js';
import { survivorResultHtml, careResultHtml } from '../src/ui/householdView.js';

const NOW = new Date('2026-10-17T10:00:00Z');
const fixture = (n) => JSON.parse(readFileSync('tests/fixtures/plans/' + n, 'utf8')).stressTool.settings;
const BASE = fixture('03-gilt-ladder-runup.json');
/** The ladder of the owner's report, as generic figures: the run-up fixture's ladder on a rotation, its pots as the pots. */
const ladder = (strategyId) => ({ ...BASE, strategyId, equityMin: 606000, bondMin: 484800, cashTarget: 121200, strategyParams: { ...BASE.strategyParams, sippTotal: 0, isaTotal: 0 } });
const pnv = fixture('09-couple-a.json');            // a Pots & Valves corpus plan (Alex)
const pnvDb = fixture('12-lumpy-db-gia.json');      // a Pots & Valves corpus plan with a final-salary pension (Sam)

const planOf = (st) => ({ ...planFromSettings(st, simulationConfigFromSettings({}, st), { startAge: +st.shapeAgeNow || 57, now: NOW }), mcRuns: 120, stride: 24 });
const test = (st, cfg, id) => { const p = planOf(st); return { r: stressTestStrategy(id, p), p }; };
const own = (st) => test(st, null, st.strategyId);

describe('survivor: what the deceased leaves is their own test\'s wealth, today\'s money', () => {
  for (const id of ['gilt-rotation', 'full-il-gilt']) {
    it(id + ' dies: the inheritance is the ladder\'s own cone p50 / p10 at that plan year, plus the ISA the plan holds aside', () => {
      const dc = ladder(id);
      const res = runSurvivorCheck({ survivorSettings: pnv, deceasedSettings: dc, deathYear: 10, spendFraction: 0.7, dbSurvivorPct: 0.5, now: NOW }, test);
      expect(res.affordable).toBe(true);
      const D = own(dc);
      const y = 10 - startOffset(dc, NOW);
      expect(res.deceasedYear).toBe(y);
      expect(D.p.isaHold).toBe(true);
      const held = D.p.isa;
      expect(held).toBeGreaterThan(0);
      expect(res.inherited.heldIsa).toBe(held);
      expect(res.inherited.middling.total).toBeCloseTo(D.r.cones.wealth.p50[y] + held, 6);
      expect(res.inherited.bad.total).toBeCloseTo(D.r.cones.wealth.p10[y] + held, 6);
      // the held ISA passes as ISA; the ladder's own money as pension
      expect(res.inherited.middling.isa).toBe(held);
      expect(res.inherited.middling.pension).toBeCloseTo(D.r.cones.wealth.p50[y], 6);
      // the owner's figure shape: far below what a growth portfolio of the same pots is said to leave
      const asGrowth = stressTestStrategy('pots-and-valves', planOf({ ...dc, strategyId: 'pots-and-valves' }));
      expect(res.inherited.middling.total).toBeLessThan(0.8 * asGrowth.cones.wealth.p50[y]);
      expect(res.inherited.middling.total).toBeLessThan(1000000);
    }, 120000);
  }

  it('a Pots & Valves plan dies: its cone already holds the ISA (nothing added), split pension/ISA in its starting shares', () => {
    const res = runSurvivorCheck({ survivorSettings: ladder('gilt-rotation'), deceasedSettings: pnv, deathYear: 6, now: NOW }, test);
    const D = own(pnv);
    const y = 6 - startOffset(pnv, NOW);
    expect(res.inherited.heldIsa).toBe(0);
    expect(res.inherited.middling.total).toBeCloseTo(D.r.cones.wealth.p50[y], 6);
    expect(res.inherited.bad.total).toBeCloseTo(D.r.cones.wealth.p10[y], 6);
    expect(res.inherited.middling.isa / res.inherited.middling.total).toBeCloseTo(D.p.isa / (D.p.pot + D.p.isa), 9);
  }, 120000);
});

describe('survivor: the survivor\'s plan through their own test, with the planner\'s own keys', () => {
  const cases = [['gilt-rotation', ladder('gilt-rotation'), pnvDb], ['full-il-gilt', ladder('full-il-gilt'), pnvDb], ['pots-and-valves', pnv, ladder('gilt-rotation')]];
  for (const [label, survivor, deceased] of cases) {
    it(label + ' survives: each result is stressTestStrategy on the modified plan, run with the middling and with the bad-case inheritance', () => {
      const res = runSurvivorCheck({ survivorSettings: survivor, deceasedSettings: deceased, deathYear: 8, spendFraction: 0.7, dbSurvivorPct: 0.5, now: NOW }, test);
      expect(res.affordable).toBe(true);
      for (const k of ['middling', 'bad']) {
        const st = res.settings[k];
        const S = own(st);
        expect(res[k].a).toEqual(oneAnswer(S.r, S.p));
        // the inheritance as two windfalls in today's money ('cpi', never 'level'), at the survivor's plan year
        const inh = st.windfalls.filter((w) => /^Inherited/.test(w.label));
        expect(inh.every((w) => w.indexation === 'cpi' && w.year === res.survivorYear)).toBe(true);
        expect(inh.reduce((t, w) => t + w.amount, 0)).toBeCloseTo(res.inherited[k].total, -1);
        expect(inh.find((w) => w.wrapper === 'pension').amount).toBe(Math.round(res.inherited[k].pension));
        // the engines read the schedule: before the death year the survivor's own, after it the household share
        expect(st.targetSchedule.slice(0, res.survivorYear)).toEqual(scheduleOf(survivor).slice(0, res.survivorYear));
      }
      expect(res.middling.a.share).toBeGreaterThanOrEqual(res.bad.a.share);   // more money, never less lasting
      // spending: 70% of what both spend after tax, grossed up on the survivor's own bands; said before and after tax
      const y = res.survivorYear, yd = Math.max(0, y + startOffset(survivor, NOW) - startOffset(deceased, NOW));
      const net = (g) => grossToNet(g, 12570, 50270, 125140);
      const want = 0.7 * (net(scheduleOf(survivor)[y]) + net(scheduleOf(deceased)[yd]));
      expect(res.spending.net).toBeCloseTo(want, -1);
      expect(res.spending.gross).toBeGreaterThan(res.spending.net);
    }, 180000);
  }

  it('a final-salary pension continues at the survivor\'s rate, as an income stream on the survivor\'s plan', () => {
    const res = runSurvivorCheck({ survivorSettings: pnv, deceasedSettings: pnvDb, deathYear: 5, dbSurvivorPct: 0.5, now: NOW }, test);
    const db = res.settings.middling.extraIncomes.find((x) => x.label === 'Survivor\'s pension');
    expect(db.annual).toBe(Math.round(pnvDb.dbAmount * 0.5));
    expect(db.startYear).toBeGreaterThanOrEqual(res.survivorYear);
    const none = runSurvivorCheck({ survivorSettings: pnv, deceasedSettings: pnvDb, deathYear: 5, dbSurvivorPct: 0, now: NOW }, test);
    expect(none.settings.middling.extraIncomes.some((x) => x.label === 'Survivor\'s pension')).toBe(false);
  }, 120000);

  it('the words: futures out of 10, both inheritance cases, today\'s money, before tax', () => {
    const res = runSurvivorCheck({ survivorSettings: pnv, deceasedSettings: ladder('gilt-rotation'), deathYear: 10, now: NOW }, test);
    const html = survivorResultHtml({ res, survivorName: 'Alex', deceasedName: 'Sam', years: 10, spendPct: 70, strategyNames: { survivor: 'Pots & Valves', deceased: 'Gilt ladder + rotation' } });
    expect(html).toMatch(/Alex's plan lasts in .* futures? out of 10|Alex's plan lasts in every future/);
    expect(html).toMatch(/in a middling case, .* in a bad case \(the worst 1 in 10\), today's money/);
    expect(html).toMatch(/a year before tax<\/strong> \(about £[\d,]+ after tax\), today's money/);
    expect(html).not.toMatch(/nominal|median remaining pots|% of 500 futures/);
  }, 120000);
});

describe('care: the cost through the planner\'s one-off cost key, each plan through its own test, pooled first', () => {
  it('the care rows: a year before tax on top of that year\'s figure, today\'s money, one per care year', () => {
    const rows = careRowsFor(pnv, { fromYear: 4, years: 3, annualCost: 60000 });
    expect(rows.map((r) => r.year)).toEqual([4, 5, 6]);
    for (const r of rows) {
      expect(r.indexation).toBe('cpi');
      const g = scheduleOf(pnv)[r.year];
      const net = (x) => grossToNet(x, 12570, 50270, 125140);
      expect(net(g + r.amount) - net(g)).toBeGreaterThan(60000 - 30);
      expect(net(g + r.amount) - net(g)).toBeLessThan(60000 + 30);
    }
  });

  for (const [label, A, B, who] of [['gilt-rotation', ladder('gilt-rotation'), pnv, 'B'], ['full-il-gilt', ladder('full-il-gilt'), pnv, 'B'], ['pots-and-valves', pnv, ladder('gilt-rotation'), 'A']]) {
    it(label + ' household, care for the Pots & Valves partner: the pooled verdict from combineHouseholdStrategies on each plan\'s own test', () => {
      const split = householdDrawSplit({ settings: A, name: 'Alex' }, { settings: B, name: 'Sam' }, { now: NOW });
      const res = runCareCheck({ setA: A, setB: B, who, startYear: 8, years: 3, annualCost: 90000, needs: split.needs.own, now: NOW }, test);
      expect(res.affordable).toBe(true);
      const rA = own(A), rB = own(B), rC = own(res.settings);
      expect(res.settings.extraWithdrawals.slice(-res.rows.length)).toEqual(res.rows);
      const base = combineHouseholdStrategies(rA.r, rB.r, { needA: split.needs.own.a, needB: split.needs.own.b, startAgeA: rA.p.startAge, startAgeB: rB.p.startAge });
      expect(res.baseline.jointSuccess).toBe(base.jointSuccess);
      expect(res.baseline.pooled).toEqual(base.pooled);
      const careR = who === 'A' ? [rC.r, rB.r] : [rA.r, rC.r];
      expect(res.care.jointSuccess).toBe(combineHouseholdStrategies(careR[0], careR[1]).jointSuccess);
      expect(res.care.pooled).toBeTruthy();
      expect(res.care.pooled.success).toBeLessThanOrEqual(res.baseline.pooled.success + 1e-12);
      expect(res.totalCareCost).toBe(270000);
      const html = careResultHtml({ res, name: who === 'A' ? 'Alex' : 'Sam', years: 3, startIn: 8, annualCost: 90000 });
      expect(html).toMatch(/the household's money lasts in .* without care/);
      expect(html).toMatch(/a year after tax, £270,000 in all, today's money/);
    }, 180000);
  }
});
