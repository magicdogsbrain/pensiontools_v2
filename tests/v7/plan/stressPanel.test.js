/**
 * 7.9.0 "Try the bad years", the pure parts (answers/plan/stressPanel.js; OneAnswer.planShortfallOf): which rows a plan
 * shows and what is known before a run, spending a tenth more, when a row changes nothing, what the panel draws from the
 * results held (no run, no write), and when / how long / how much read off a run. The runs are stressPanelRun.slow.test.js.
 * Fictional plans only (the test corpus, and made-up results).
 */
import { describe, it, expect } from 'vitest';
import { rowsFor, stressSpendOf, sameAs, stressPanelView, stressKeyOf, referenceOf, ROW_IDS, ROW_CHANGE } from '../../../src/answers/plan/stressPanel.js';
import { planShortfallOf, oneAnswer } from '../../../src/services/OneAnswer.js';
import { planFor } from '../../../src/answers/plan/lastsRun.js';
import { scaledIncome } from '../../../src/answers/plan/spend.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { lifeOfSettings } from '../../../src/answers/plan/life.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const plan0 = (name) => JSON.parse(JSON.stringify(entryOf(C[name]).plan));
const single = { wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } };
const world = { wrapper: 'SIPP', ticker: 'VWRL', name: 'Vanguard FTSE All-World', subClass: 'worldGrowth', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } };

describe('the rows a plan shows', () => {
  it('the five on any plan; the held three only when a line is kept by choice, "nothing" only for what may be one company\'s shares', () => {
    const plan = plan0('02-pnv-draft');
    expect(rowsFor(plan, { today: TODAY })).toEqual([
      { id: 'asPlanned', ref: null, na: null }, { id: 'fall', ref: 'asPlanned', na: null }, { id: 'lower', ref: 'asPlanned', na: null },
      { id: 'spend', ref: 'asPlanned', na: null }, { id: 'prices', ref: 'asPlanned', na: null }]);
    const keeps = plan0('04-buckets-running');
    keeps.holdings.lines.push(single);
    expect(rowsFor(keeps, { today: TODAY }).map((r) => [r.id, r.ref])).toEqual([['asPlanned', null], ['fall', 'asPlanned'], ['lower', 'asPlanned'], ['spend', 'asPlanned'], ['prices', 'asPlanned'], ['asHeld', 'asPlanned'], ['heldHalf', 'asHeld'], ['heldNothing', 'asHeld']]);
    const fund = plan0('04-buckets-running');
    fund.holdings.lines.push(world);
    expect(rowsFor(fund, { today: TODAY }).map((r) => r.id)).toEqual(['asPlanned', 'fall', 'lower', 'spend', 'prices', 'asHeld', 'heldHalf']);
    expect(ROW_IDS.length).toBe(8);
    expect(referenceOf('heldNothing')).toBe('asHeld');
    expect(referenceOf('asHeld')).toBe('asPlanned');
  });
  it('a locked ladder: the market rows are not tried; prices only on the two ways worked out with a price path', () => {
    expect(rowsFor(plan0('03-gilt-ladder-locked'), { today: TODAY }).filter((r) => r.na).map((r) => [r.id, r.na])).toEqual([['fall', 'lockedLadder'], ['lower', 'lockedLadder'], ['spend', 'lockedLadder'], ['prices', 'lockedLadder']]);
    const plan = plan0('02-pnv-draft');
    for (const id of ['ladder-and-ratchet', 'floor-and-flex', 'full-il-gilt', 'gilt-rotation', 'bridge-and-engine']) {
      const s = { ...effectiveStressSettings(plan, { now }), strategyId: id };
      expect(rowsFor(plan, { settings: s }).find((r) => r.id === 'prices').na, id).toBe('todaysPrices');
    }
    for (const id of ['pots-and-valves', 'buckets-in-order']) expect(rowsFor(plan, { settings: { ...effectiveStressSettings(plan, { now }), strategyId: id } }).find((r) => r.id === 'prices').na).toBe(null);
  });
  it('the rows\' changes: a fall of 30% and prices 2% faster from the run\'s first month, 1% a year less, a tenth more', () => {
    expect(ROW_CHANGE.fall.shock).toEqual({ kind: 'fall', share: 0.3, from: 0 });
    expect(ROW_CHANGE.prices.shock).toEqual({ kind: 'prices', add: 0.02, from: 0 });
    expect(ROW_CHANGE.lower.returnDragPct).toBe(1);
    expect(ROW_CHANGE.spend.spend).toBe(1.1);
  });
});

describe('spending a tenth more', () => {
  it('every income amount the planner reads, and a pinned draw or essentials floor, a tenth more; the plan\'s need a tenth more', () => {
    for (const name of ['02-pnv-draft', '12-lumpy-db-gia', '04-buckets-running']) {
      const s = effectiveStressSettings(plan0(name), { now });
      const more = stressSpendOf(s, 1.1);
      expect(more.baseSalary).toBe(scaledIncome(s, 1.1).baseSalary);
      const a = planFor(s, now), b = planFor(more, now);
      // (the need is the income plus the plan's one-off spends, which are not income: only the income part grows)
      const extra = a.extraNeedByYear || [];
      b.needByYear.forEach((v, y) => expect(Math.abs((v - (extra[y] || 0)) - 1.1 * (a.needByYear[y] - (extra[y] || 0))), name + ' ' + y).toBeLessThan(2 + 0.11 * Math.abs(a.needByYear[y])));
      expect(b.needByYear.reduce((t, v) => t + v, 0)).toBeGreaterThan(a.needByYear.reduce((t, v) => t + v, 0));
    }
    const pinned = { baseSalary: 30000, strategyId: 'ladder-and-ratchet', strategyParams: { drawAnnual: 30000, essentialsAnnual: 20000, ladderYears: 10 } };
    expect(stressSpendOf(pinned, 1.1).strategyParams).toEqual({ drawAnnual: 33000, essentialsAnnual: 22000, ladderYears: 10 });
    expect(pinned.strategyParams.drawAnnual).toBe(30000);   // the settings given are never changed
    expect(stressSpendOf({ baseSalary: 30000, strategyParams: { ladderYears: 10 } }, 1.1).strategyParams).toEqual({ ladderYears: 10 });
  });
});

/** A made-up row result, runStressRow's shape. */
const res = (key, a = {}, shortfall = { when: { typical: 88, worst: 84, worstLasts: false }, howLong: { paid: 22, of: 31 }, howMuch: 0.9 }) => ({
  key, na: null, shortfall, ran: { family: true, cutsOn: false },
  a: { weighted: 0.9, sumW: 100, n: 1000, fixedAge: 0.85, share: 0.85, futures: 1000, typicalLeft: 1000, badCaseLeft: 0, goodCaseLeft: 5000, floor: { age: 88, yearly: 100 }, cuts: null, level: 'balanced', verdict: 'yes', ...a }
});

describe('when a row changes nothing, and what the panel draws', () => {
  it('same only when every reported figure is the reference\'s: a plan that lasts in every future on both but leaves less is drawn in full', () => {
    const k = 'k';
    expect(sameAs(res(k), res(k))).toBe(true);
    expect(sameAs(res(k, { typicalLeft: 999 }), res(k))).toBe(false);
    expect(sameAs(res(k, { sumW: null, weighted: null }), res(k, { sumW: null, weighted: null }))).toBe(true);
    expect(sameAs(res(k, { floor: { age: 87, yearly: 100 } }), res(k))).toBe(false);
    expect(sameAs(res(k, {}, { when: { typical: 88, worst: 83, worstLasts: false }, howLong: { paid: 22, of: 31 }, howMuch: 0.9 }), res(k))).toBe(false);
    const lasts = { when: null, howLong: null, howMuch: 1 };
    expect(sameAs(res(k, { fixedAge: 1, sumW: 0, typicalLeft: 400000 }, lasts), res(k, { fixedAge: 1, sumW: 0, typicalLeft: 500000 }, lasts))).toBe(false);
    expect(sameAs(null, res(k))).toBe(false);
  });
  it('the view reads results for today\'s key only, at the level asked for with no run, beside the reference; accept only where it could be accepted', () => {
    const plan = plan0('02-pnv-draft');
    const key = stressKeyOf(plan, TODAY);
    const rows = { asPlanned: res(key), fall: res(key, { fixedAge: 0.7, share: 0.7, sumW: 300, verdict: 'no' }), lower: res(key), spend: res('old|key') };
    const v = stressPanelView(plan, rows, { today: TODAY });
    const by = Object.fromEntries(v.rows.map((r) => [r.id, r]));
    expect(by.asPlanned).toMatchObject({ status: 'done', kind: 'confidence', same: false, canAccept: true });
    expect(by.fall).toMatchObject({ status: 'done', same: false, canAccept: true, refA: { fixedAge: 0.85 } });
    expect(by.lower).toMatchObject({ status: 'done', same: true, canAccept: false });
    expect(by.spend).toMatchObject({ status: 'idle', a: null, canAccept: false });
    expect(by.prices.status).toBe('idle');
    // a new level re-reads the verdict with no run
    const careful = stressPanelView(plan, rows, { today: TODAY, level: 'careful' });
    expect(careful.level).toBe('careful');
    expect(careful.rows.find((r) => r.id === 'fall').a.level).toBe('careful');
    expect(v.agreements).toEqual([]);
    expect(JSON.stringify(v)).not.toMatch(/NaN|undefined/);
  });
  it('the held rows show the keep agreement\'s state and never offer an accept', () => {
    const plan = plan0('04-buckets-running');
    plan.holdings.lines.push(single);
    const key = stressKeyOf(plan, TODAY);
    const v = stressPanelView(plan, { asHeld: res(key), heldHalf: res(key, { fixedAge: 0.6, share: 0.6 }) }, { today: TODAY });
    for (const id of ['asHeld', 'heldHalf', 'heldNothing']) {
      const row = v.rows.find((r) => r.id === id);
      expect(row.kind).toBe(null);
      expect(row.canAccept).toBe(false);
      expect(row.keep).toEqual({ status: 'untested', line: { id: 'line.untested', slots: {} } });
    }
  });
});

describe('when, how long and how much, read off the runs a row made', () => {
  const LIFE = lifeOfSettings({ currentAge: 66, currentAgeAsOf: '2026-05-01' }, now, { startAge: 66 });
  const P = { startAge: 66, durationYears: 31, spAnnual: 12000, spStartYear: 1, needByYear: Array(32).fill(30000), otherIncomeByYear: Array(32).fill(0) };
  /** A made-up run: `lost` the futures that failed, by run year. */
  const fake = (lost, n = 20, more = {}) => {
    const survivedMc = Array.from({ length: n }, (_, i) => !(i in lost));
    const headYear = survivedMc.map((ok, i) => (ok ? null : lost[i]));
    return { strategyId: 'pots-and-valves', affordable: true, ruin: { mc: 100 * Object.keys(lost).length / n, hist: 0 }, n: { mc: n, hist: 10 }, terminal: { p10: 0, p50: 150000, p90: 600000 }, survivedMc, futuresMc: { failYear: headYear, ...more } };
  };
  it('nothing failing: no when, no how long, all of it paid', () => {
    const r = fake({});
    expect(planShortfallOf(r, P, oneAnswer(r, P, { life: LIFE }))).toEqual({ when: null, howLong: null, howMuch: 1 });
  });
  it('typical is the floor\'s age; the worst is the 1-in-10th earliest over all futures, read on the same run; how long and how much over the futures failed in the plan', () => {
    const r = fake({ 0: 10, 1: 20, 2: 24, 3: 28 });
    const a = oneAnswer(r, P, { life: LIFE, floorAt: () => 9000 });
    const s = planShortfallOf(r, P, a);
    expect(s.when.typical).toBe(a.floor.age);
    expect(s.when).toEqual({ typical: 66 + 20, worst: 66 + 24, worstLasts: false });   // sorted 10, 20, 24, 28, never…: index floor(20 / 10)
    // a year in which the State Pension meets the need counts as paid; the need less the State Pension is what goes unpaid
    expect(s.howLong.of).toBe(31);
    expect(s.howLong.paid).toBe(Math.floor((10 + 20 + 24 + 28) / 4));
    const unpaid = [10, 20, 24, 28].reduce((t, fy) => t + (31 - fy) * 18000, 0);
    expect(s.howMuch).toBeCloseTo(1 - unpaid / (4 * 31 * 30000), 12);
    // the worst lasts when the 1-in-10th future lasted: said to the plan's age
    const late = fake({ 0: 30 });
    expect(planShortfallOf(late, P, oneAnswer(late, P, { life: LIFE })).when).toEqual({ typical: 96, worst: 97, worstLasts: true });
  });
  it('the worst 1 in 10 counts a future that runs out only after the plan\'s last year as lasting, as the answers do: never later than the plan-to age', () => {
    // the run followed on to the weighting age (rW, 40 years): three futures run out after the plan's 31 years, one within it
    const r = fake({ 0: 25 });
    const rW = fake({ 0: 25, 1: 33, 2: 35, 3: 38 }, 20);
    const a = oneAnswer(r, P, { life: LIFE, rW, wYears: 40 });
    const s = planShortfallOf(r, P, a, { rW, wYears: 40 });
    // typical is still over every future that ran out on the run followed on (the floor's set): 25, 33, 35, 38
    expect(s.when.typical).toBe(66 + 33);
    // sorted within the plan: 25, then every other future lasting to 97; the 1-in-10th (index 2) lasted
    expect(s.when).toMatchObject({ worst: 97, worstLasts: true });
    expect(s.when.worst).toBeLessThanOrEqual(a.planToAge);
    // with more failing inside the plan, the worst is read inside it
    const rW2 = fake({ 0: 25, 1: 28, 2: 30, 3: 38 }, 20);
    expect(planShortfallOf(r, P, oneAnswer(r, P, { life: LIFE, rW: rW2, wYears: 40 }), { rW: rW2, wYears: 40 }).when).toMatchObject({ worst: 66 + 30, worstLasts: false });
  });
  it('a strategy that says what it left unpaid is read as it says; Pots & Valves with cuts on adds each future\'s cut', () => {
    const r = fake({ 0: 10 }, 20, { unpaid: [5000, ...Array(19).fill(null)] });
    expect(planShortfallOf(r, P, oneAnswer(r, P)).howMuch).toBeCloseTo(1 - 5000 / (31 * 30000), 12);
    const cut = fake({ 0: 10 }, 20, { cutReal: [7000, ...Array(19).fill(0)] });
    const on = { ...P, pnvCfg: { disableProtection: false } }, off = { ...P, pnvCfg: { disableProtection: true } };
    expect(planShortfallOf(cut, on, oneAnswer(cut, on)).howMuch).toBeCloseTo(1 - (21 * 18000 + 7000) / (31 * 30000), 12);
    expect(planShortfallOf(cut, off, oneAnswer(cut, off)).howMuch).toBeCloseTo(1 - (21 * 18000) / (31 * 30000), 12);
  });
  it('a year the closed pension leaves unpaid in every future is its own line, never the worst', () => {
    const r = fake({ 0: 12 }, 20, { headYear: [12, ...Array(19).fill(null)] });
    r.futuresMc.failYear = Array(20).fill(2);
    const p = { ...P, firstTaxYear: 2026, pensionLock: { unpaid: [0, 0, 4000], paid: [8000, 8000, 4000] } };
    const s = planShortfallOf(r, p, oneAnswer(r, p));
    expect(s.closedYear).toEqual({ year: 2, taxYear: 2028 });
    expect(s.when.worst).toBe(66 + 31);   // the 1-in-10th future lasted by its own test: the closed year is not the worst
    expect(s.when.worstLasts).toBe(true);
  });
});
