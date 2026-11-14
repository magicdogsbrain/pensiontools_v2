// @vitest-environment node
/**
 * 7.9.0 "Try the bad years", the runs (answers/plan/stressPanelRun.js runStressRow; the build spec's §1.2–§1.4, §9):
 *  - As planned is "Does it last?" (runLasts) on every figure the futures give, on every corpus plan;
 *  - each row's change reaches the run it should (the drag on the run followed on, faster prices on Pots & Valves only, a
 *    pinned draw spent a tenth more); the held rows are the keep test's own figures;
 *  - order on the same futures: on plans with the cuts off a fall or lower returns never makes a future last longer, nor
 *    count for less; spending more never raises the chance; what is kept falling never helps; with the cuts on, in
 *    aggregate; the gilt rotation and the prices row are exceptions (tests/v7/plan/stress-exceptions.md);
 *  - the time each row takes against the budget (1,000 futures: first row ≤ 1.5 s, each ≤ 1.2 s, the panel ≤ 9.6 s).
 * Fictional plans only (the test corpus).
 */
import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { runStressRow } from '../../../src/answers/plan/stressPanelRun.js';
import { rowsFor } from '../../../src/answers/plan/stressPanel.js';
import { runLasts, planFor, rowPlanOf } from '../../../src/answers/plan/lastsRun.js';
import { runKeepRetest } from '../../../src/answers/plan/keepRun.js';
import { stressTestStrategy } from '../../../src/strategies/stressTest.js';
import { headYearsOf } from '../../../src/services/OneAnswer.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { normaliseHoldings } from '../../../src/services/HoldingsRecord.js';
import { lifeOf, survivalFrom } from '../../../src/answers/plan/life.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const now = noon(TODAY);
const plan0 = (name) => JSON.parse(JSON.stringify(entryOf(C[name]).plan));
const row = (plan, id) => runStressRow(plan, { today: TODAY, row: id });
const FALL = { shock: { kind: 'fall', share: 0.3, from: 0 } };
const LOWER = { returnDragPct: 1 };
/** The figures the futures give (the build spec's §1.4): As planned's must be "Does it last?"'s, to the bit. */
const MC = ['share', 'chancePct', 'futures', 'typicalLeft', 'badCaseLeft', 'goodCaseLeft', 'coverage', 'cuts', 'weighted', 'sumW', 'n', 'fixedAge', 'floor', 'left', 'verdict'];
const fails = (a) => Math.round((1 - a.share) * a.futures);

describe('As planned is "Does it last?" on every figure the futures give', { timeout: 600_000 }, () => {
  for (const name of Object.keys(C)) {
    it(name, () => {
      const plan = entryOf(C[name]).plan;
      const lasts = runLasts(plan, { today: TODAY });
      const r = row(plan, 'asPlanned');
      if (!lasts.a) { expect(r.na).toBe('unaffordable'); return; }
      for (const k of MC) expect(r.a[k], `${name} ${k}`).toEqual(lasts.a[k]);
      // no figure of the real histories on a row
      for (const k of ['histories', 'histStrideMonths', 'histRanOutPct', 'histRanOutN', 'worst12']) expect(r.a).not.toHaveProperty(k);
      expect(JSON.stringify(r)).not.toMatch(/NaN|undefined|1,000,000,000/);
      if (r.a.floor) expect(r.shortfall.when.typical).toBe(r.a.floor.age);
    });
  }
});

describe('each row\'s change reaches its run', { timeout: 600_000 }, () => {
  it('lower returns: the run followed on to the weighting age is dragged too, so the weighted failures rise (a plan that ends before that age)', () => {
    const plan = plan0('02-pnv-draft');
    const base = row(plan, 'asPlanned'), lower = row(plan, 'lower');
    expect(base.runs).toBe(2);
    expect(lower.runs).toBe(2);
    expect(lower.a.sumW).toBeGreaterThan(base.a.sumW);
    expect(lower.a.fixedAge).toBeLessThan(base.a.fixedAge);
  });
  it('prices: Pots & Valves reads the faster prices; a way worked out in today\'s prices is not tried', () => {
    const plan = plan0('02-pnv-draft');
    const base = row(plan, 'asPlanned'), prices = row(plan, 'prices');
    expect(prices.na).toBe(null);
    expect([prices.a.sumW, prices.a.typicalLeft]).not.toEqual([base.a.sumW, base.a.typicalLeft]);
    const lr = plan0('02-pnv-draft');
    lr.stressTool.settings.strategyId = 'ladder-and-ratchet';
    const t = row(lr, 'prices');
    expect(t).toMatchObject({ na: 'todaysPrices', runs: 0 });
  });
  it('a level income on Ladder & Ratchet with its draw pinned: spending a tenth more draws a tenth more, and the chance falls', () => {
    const plan = plan0('02-pnv-draft');
    const ss = plan.stressTool.settings;
    const income = +ss.baseSalary || 30000;
    Object.assign(ss, { strategyId: 'ladder-and-ratchet', incomeShape: 'level', incomeSteps: [], targetSchedule: null, baseSalary: income, strategyParams: { ...(ss.strategyParams || {}), drawAnnual: income } });
    const base = row(plan, 'asPlanned'), spend = row(plan, 'spend');
    expect(base.na).toBe(null);
    expect(spend.a.sumW > base.a.sumW || fails(spend.a) > fails(base.a)).toBe(true);
  });
  it('the held rows are the keep test\'s own figures: its count, and its bad case', () => {
    const alex = plan0('04-buckets-running');
    alex.holdings.lines.push({ wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } });
    const keep = runKeepRetest(alex, { today: TODAY });
    const sides = { asHeld: keep.asHeld, heldHalf: keep.shock.half, heldNothing: keep.shock.nothing };
    for (const [id, k] of Object.entries(sides)) {
      const r = row(alex, id);
      expect(r.a.share, id).toBe(k.share);
      const w = r.shortfall.when;
      if (k.badCase.lasts) expect(!w || w.worstLasts || w.worst >= r.a.planToAge, id).toBe(true);
      else expect(w.worst, id).toBe(k.badCase.age);
    }
    // a locked ladder kept in place of its last rungs: the walk of its years as held, fixed-age only
    const sam = plan0('20-locked-start-after-stop');
    const lines = sam.holdings.lines.filter((l) => !/^(T29|T30I)$/.test(l.ticker || '')).map((l) => (l.ticker === 'VWRP' ? { ...l, keep: { as: 'mine', fundsGaps: true } } : l));
    sam.holdings = { ...normaliseHoldings({ lines, updatedAt: '2026-10-01', source: 'typed' }) };
    const sk = runKeepRetest(sam, { today: TODAY });
    const held = row(sam, 'asHeld');
    expect(held.a).toMatchObject({ weighted: null, share: sk.asHeld.share });
    expect(row(sam, 'heldHalf').a.share).toBe(sk.shock.half.share);
    expect(row(sam, 'fall').na).toBe('lockedLadder');
    expect(rowsFor(sam, { today: TODAY }).map((r) => r.id)).toEqual(['asPlanned', 'fall', 'lower', 'spend', 'prices', 'asHeld', 'heldHalf']);
  });
});

/** Each future's first failed run year (Infinity: lasted), by the strategy's own test. */
const failYears = (r) => { const h = headYearsOf(r); return r.survivedMc.map((ok, i) => (ok ? Infinity : (h && Number.isFinite(h[i]) ? h[i] : 999))); };

describe('order on the same futures', { timeout: 600_000 }, () => {
  it('cuts off: a fall or lower returns never makes a future fail later, nor count for less (every way of drawing that runs futures)', () => {
    const cases = [['02-pnv-draft', 'pots-and-valves'], ['04-buckets-running', 'buckets-in-order'], ['05-saver-committed', 'pots-and-valves'], ['02-pnv-draft', 'ladder-and-ratchet'], ['02-pnv-draft', 'bridge-and-engine'], ['02-pnv-draft', 'floor-to-age']];
    for (const [name, id] of cases) {
      const plan = plan0(name);
      const s = { ...effectiveStressSettings(plan, { now }), strategyId: id, disableProtection: true };
      const p = planFor(s, now);
      const S = survivalFrom(lifeOf(plan, now, { settings: s, startAge: p.startAge }));
      const weight = (y) => (Number.isFinite(y) ? S(p.startAge + y - lifeOf(plan, now, { settings: s, startAge: p.startAge }).ageNow) : 0);
      const base = failYears(stressTestStrategy(id, rowPlanOf(p, {})));
      for (const change of [FALL, LOWER]) {
        const f = failYears(stressTestStrategy(id, rowPlanOf(p, change)));
        f.forEach((y, i) => {
          if (y > base[i]) expect.fail(`${name} ${id} ${JSON.stringify(change)}: future ${i} failed in year ${y}, later than ${base[i]}`);
          expect(weight(y) + 1e-12).toBeGreaterThanOrEqual(weight(base[i]));
        });
        expect(f.filter(Number.isFinite).length).toBeGreaterThan(base.filter(Number.isFinite).length);
      }
    }
  });
  it('spending a tenth more never raises the chance; a fall and lower returns on plans with the cuts on, in aggregate', () => {
    for (const name of ['02-pnv-draft', '04-buckets-running', '12-lumpy-db-gia']) {
      const plan = plan0(name);
      const base = row(plan, 'asPlanned');
      for (const id of ['spend', 'fall', 'lower']) {
        const r = row(plan, id);
        expect(r.a.sumW, `${name} ${id}`).toBeGreaterThanOrEqual(base.a.sumW);
        expect(fails(r.a), `${name} ${id}`).toBeGreaterThanOrEqual(fails(base.a));
        // the worst 1 in 10 is never later than As planned's, nor than the plan-to age (a future lasting counts at that age)
        const worst = (x) => (x.shortfall && x.shortfall.when ? x.shortfall.when.worst : x.a.planToAge);
        expect(worst(r), `${name} ${id} worst`).toBeLessThanOrEqual(worst(base));
        expect(worst(r), `${name} ${id} worst`).toBeLessThanOrEqual(r.a.planToAge);
      }
    }
  });
  it('what is kept falling never helps: half ≥ as held, nothing ≥ as held; nothing ≥ half when every kept line may be one company\'s shares', () => {
    const alex = plan0('04-buckets-running');
    alex.holdings.lines.push({ wrapper: 'SIPP', ticker: 'EXMPL', name: 'Example Shares plc', units: 100, value: 60000, keep: { as: 'mine', fundsGaps: true } });
    const held = row(alex, 'asHeld'), half = row(alex, 'heldHalf'), nothing = row(alex, 'heldNothing');
    for (const r of [half, nothing]) { expect(r.a.sumW).toBeGreaterThanOrEqual(held.a.sumW); expect(fails(r.a)).toBeGreaterThanOrEqual(fails(held.a)); }
    expect(nothing.a.sumW).toBeGreaterThanOrEqual(half.a.sumW);
    expect(fails(nothing.a)).toBeGreaterThanOrEqual(fails(half.a));
  });
  it('the gilt rotation (an exception): the fall equals its own 30% trigger, so nearly every future rotates — pinned', () => {
    const plan = plan0('02-pnv-draft');
    const s = { ...effectiveStressSettings(plan, { now }), strategyId: 'gilt-rotation' };
    const p = planFor(s, now);
    const base = stressTestStrategy('gilt-rotation', rowPlanOf(p, {}));
    const fall = stressTestStrategy('gilt-rotation', rowPlanOf(p, FALL));
    expect(base.signature.triggeredShare).toBe(0.395);
    // (whether a future's fall lands on the trigger is decided by the last bit, so it is pinned per engine: Node 20's maths
    // fires one future fewer of the 1,000 than Node 24's — the reason the rotation is an exception to the order tests)
    expect(fall.signature.triggeredShare).toBe(+process.versions.node.split('.')[0] <= 20 ? 0.992 : 0.993);
  });
});

describe('the time each row takes (1,000 futures; idle: first row ≤ 1.5 s, each ≤ 1.2 s, the panel ≤ 9.6 s)', { timeout: 600_000 }, () => {
  it('the slowest corpus plan, with what it keeps (eight rows), in plain Node: the faster of two tries of each row', () => {
    // (a test runner's module transform slows the engine by more than half again, so the time is taken in plain Node;
    // V7_TIMING_SLACK for a loaded machine — a failure under load is rerun alone before it is called red)
    const SLACK = +(process.env.V7_TIMING_SLACK || 1);
    const out = spawnSync(process.execPath, [join(process.cwd(), 'tests/v7/plan/stressTiming.mjs')], { encoding: 'utf8' });
    expect(out.status, out.stderr).toBe(0);
    const { rows, panel } = JSON.parse(out.stdout.trim().split('\n').pop());
    console.log('stress panel rows (ms):', JSON.stringify(rows), 'panel', panel);
    expect(Object.keys(rows)).toEqual(['asPlanned', 'fall', 'lower', 'spend', 'prices', 'asHeld', 'heldHalf', 'heldNothing']);
    expect(rows.asPlanned).toBeLessThan(1500 * SLACK);
    for (const [id, ms] of Object.entries(rows)) expect(ms, id).toBeLessThan(1200 * SLACK);
    expect(panel).toBeLessThan(9600 * SLACK);
  });
});
