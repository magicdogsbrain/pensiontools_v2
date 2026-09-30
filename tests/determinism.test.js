/**
 * Determinism (V7 step 1, "safety net"): the numbers must not depend on the day the tests — or the app — run.
 *
 *  (a) same inputs + same injected `now` → the same output, twice, AND under a different wall clock
 *      (the injected clock really is the only clock the calculation reads);
 *  (b) 4 April 2027 vs 8 April 2027 (either side of the tax-year boundary): outputs differ ONLY in the fields
 *      listed here, each of which is a tax-year fact. A new path appearing in one of these lists is a new
 *      dependence on today's date — decide whether it is meant before adding it;
 *  (c) no module under src/services or src/strategies calls Math.random (every random stream is seeded), and
 *      none reads the wall clock except as the DEFAULT of an injectable parameter;
 *  (d) the seeded random stream is pinned to literal values, so it is the same on every engine and CPU.
 *
 * Market data is the bundled snapshot (nothing here calls loadLiveGilts), so the gilt prices are pinned by the repo.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { at, BEFORE_TAX_YEAR as BEFORE, AFTER_TAX_YEAR as AFTER, frozen, plain, diffPaths } from './helpers/clock.js';
import { planFromSettings, stressTestStrategy } from '../src/strategies/stressTest.js';
import { buildGiltLadder } from '../src/strategies/GiltLadderPlan.js';
import { activeLinkers } from '../src/services/LinkerUniverse.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { deriveTiming } from '../src/services/PlanTiming.js';
import { deriveStage } from '../src/services/LifeStage.js';
import { projectAccumulation, contributionWarnings } from '../src/services/AccumulationEngine.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { targetHoldings } from '../src/services/TransitionPlanner.js';
import { sweepRetirementAges } from '../src/services/RetireSweep.js';
import { seededRng, gaussianRandom } from '../src/utils/MathUtils.js';

// ---- fixtures: one person, three timing situations -------------------------------------------------------------
const base = {
  currentAge: 60, currentAgeAsOf: '2026-09-10', duration: 30, equityMin: 900000, bondMin: 300000, cashTarget: 100000, isaBalance: 50000,
  baseSalary: 40000, incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }, { fromAge: 75, amount: 32000 }],
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', spStartDate: '10 September 2033', spWeeklyAmount: 230, strategyParams: {}
};
const RETIRED = { ...base, retired: true, firstTaxYear: 2027, shapeAgeNow: 60 };   // the start is SAVED (6.4.0): what a locked plan looks like
const RETIRED_NO_ANCHOR = { ...base, retired: true };                              // no saved firstTaxYear: the start is "next April", re-derived from today
const SAVER = { ...base, currentAge: 50, retired: false, retireAge: 60, spStartDate: '10 September 2043' };
const ACC = { netMonthly: 1200, salary: 60000, schemeType: 'ras', employerMonthly: 375, potNow: 400000 };
const FAR_WALL_CLOCK = at(2031, 1, 15);   // "the tests ran on some other day"

// src/storage has no injectable clock yet (not this step's files): its config is built with the wall clock frozen at `now`.
const cfgFor = (s, now) => frozen(now, () => createSimulationConfigFromSettings({}, s));
function run(s, strategyId, now) {
  const p = planFromSettings(s, cfgFor(s, now), { now });
  p.mcRuns = 40; p.stride = 24;   // small but real: 40 block-bootstrapped futures + the historical windows
  const r = stressTestStrategy(strategyId, p);
  return { p, r };
}
const result = (s, id, now) => { const { r } = run(s, id, now); const { configs, ...rest } = r; return rest; };
const planOf = (s, id, now) => { const { now: _clock, ...p } = run(s, id, now).p; return p; };   // the clock itself is not an output
const docFor = (s, now) => { const { p, r } = run(s, 'full-il-gilt', now); return buildPlanDocument({ settings: { ...s, strategyId: 'full-il-gilt' }, p, r, now }); };
const scenario = (s, locked) => ({ stressTool: { settings: s }, decisionTool: { settings: { locked }, history: [] } });

/** (a): twice the same, and the same again with the wall clock somewhere else entirely. */
function expectDeterministic(fn) {
  const first = plain(fn());
  expect(plain(fn())).toEqual(first);
  expect(plain(frozen(FAR_WALL_CLOCK, fn))).toEqual(first);
}
/** (b): the exact set of paths that change across 6 April 2027. */
const changed = (fn) => diffPaths(plain(fn(BEFORE)), plain(fn(AFTER))).sort();

describe('(a) same inputs + same injected now → identical output, whatever day it is', () => {
  it('deriveTiming', () => { for (const s of [RETIRED, RETIRED_NO_ANCHOR, SAVER]) expectDeterministic(() => deriveTiming(s, BEFORE)); });
  it('deriveStage', () => { for (const s of [RETIRED, SAVER]) for (const locked of [true, false]) expectDeterministic(() => deriveStage(scenario(s, locked), BEFORE)); });
  it('projectAccumulation (reads no clock at all) and contributionWarnings', () => {
    expectDeterministic(() => projectAccumulation({ currentAge: 50, retirementAge: 60, potNow: 400000, totalMonthly: 1875, escalationPct: 2 }));
    expectDeterministic(() => contributionWarnings({ annualGrossTotal: 70000, salary: 60000, currentAge: 50, retirementAge: 56, now: BEFORE }));
  });
  it('planFromSettings → the plan every strategy is judged on', () => { for (const s of [RETIRED, SAVER]) expectDeterministic(() => planOf(s, 'pots-and-valves', BEFORE)); });
  it('a gilt-ladder plan (planFromSettings → stressTestStrategy full-il-gilt): order sheet and cost', () => {
    expectDeterministic(() => result(RETIRED, 'full-il-gilt', BEFORE));
    const r = result(RETIRED, 'full-il-gilt', BEFORE);
    expect(r.affordable).toBe(true);            // the fixture must actually buy a ladder, or the test proves nothing
    expect(r.plan.orders.length).toBeGreaterThan(10);
  });
  it('a Pots & Valves Monte Carlo: seeded futures, not Math.random', () => {
    expectDeterministic(() => result(RETIRED, 'pots-and-valves', BEFORE));
    const r = result(RETIRED, 'pots-and-valves', BEFORE);
    expect(r.n.mc).toBe(40);
    expect(Number.isFinite(r.ruin.mc)).toBe(true);
  });
  it('the plan document and targetHoldings read from it', () => {
    expectDeterministic(() => docFor(RETIRED, BEFORE));
    const doc = docFor(RETIRED, BEFORE);
    expect(doc.strategy.p.now).toBeUndefined();   // the injected clock never lands in the saved document
    expectDeterministic(() => targetHoldings(doc, { today: BEFORE }));
  });
  it('sweepRetirementAges threads its one clock to the plan (config from src/storage built under the same frozen clock)', () => {
    const sweep = () => frozen(BEFORE, () => sweepRetirementAges({ settings: { ...SAVER, strategyId: 'pots-and-valves' }, accumulation: ACC, ages: [60, 65], mcRuns: 20, stride: 24, now: BEFORE }));
    const first = plain(sweep());
    expect(first.rows.length).toBe(2);
    expect(plain(sweep())).toEqual(first);
  });
});

describe('(b) 4 April 2027 vs 8 April 2027: only tax-year facts move', () => {
  it('deriveTiming, start saved: the offered start years and "years to start" (counted in tax years) — nothing else', () => {
    expect(changed((now) => deriveTiming(RETIRED, now))).toEqual(['startOptions.0', 'startOptions.1', 'yearsToStart']);
    expect(changed((now) => deriveTiming(SAVER, now))).toEqual(['startOptions.0', 'startOptions.1', 'yearsToStart']);
    expect(deriveTiming(RETIRED, BEFORE).firstTaxYear).toBe(2027);
    expect(deriveTiming(RETIRED, AFTER).firstTaxYear).toBe(2027);
    expect([deriveTiming(RETIRED, BEFORE).yearsToStart, deriveTiming(RETIRED, AFTER).yearsToStart]).toEqual([1, 0]);
  });
  it('deriveStage: a locked retiree moves from the run-up to Running on 6 April; a saver only loses a tax year of waiting', () => {
    expect(changed((now) => deriveStage(scenario(RETIRED, true), now))).toEqual(['banner', 'beforeStart', 'chip', 'key', 'label', 'leads.1', 'yearsToStart']);
    expect([deriveStage(scenario(RETIRED, true), BEFORE).key, deriveStage(scenario(RETIRED, true), AFTER).key]).toEqual(['bridge', 'running']);
    expect(changed((now) => deriveStage(scenario(SAVER, true), now))).toEqual(['yearsToStart']);
  });
  it('projectAccumulation and contributionWarnings: nothing (no tax-year input)', () => {
    expect(changed((now) => frozen(now, () => projectAccumulation({ currentAge: 50, retirementAge: 60, potNow: 400000, totalMonthly: 1875, escalationPct: 2 })))).toEqual([]);
    expect(changed((now) => contributionWarnings({ annualGrossTotal: 70000, salary: 60000, currentAge: 50, retirementAge: 56, now }))).toEqual([]);
  });
  it('the plan with a saved start: only yearsToStart; the gilt ladder and the Monte Carlo do not move at all', () => {
    for (const s of [RETIRED, SAVER]) {
      expect(changed((now) => planOf(s, 'pots-and-valves', now))).toEqual(['yearsToStart']);
      expect(changed((now) => result(s, 'full-il-gilt', now))).toEqual([]);
      expect(changed((now) => result(s, 'pots-and-valves', now))).toEqual([]);
    }
  });
  it('the plan document: its stamps, the timing facts above and the sentence that states them', () => {
    expect(changed((now) => docFor(RETIRED, now))).toEqual(['assumptions.giltPricesAsOf', 'createdAt', 'lockedAt', 'strategy.p.yearsToStart',
      'timing.startOptions.0', 'timing.startOptions.1', 'timing.text', 'timing.yearsToStart']);
  });
  it('targetHoldings of a LOCKED ladder: on 6 April the plan is running, so the cash target drops the run-up drag and is reported, not diffed', () => {
    const doc = docFor(RETIRED, BEFORE);   // one document, read on two days
    expect(changed((today) => targetHoldings(doc, { today }))).toEqual(['cash.spending', 'cash.value', 'note', 'running', 'thisTaxYear']);
    const saverDoc = docFor(SAVER, BEFORE);
    expect(changed((today) => targetHoldings(saverDoc, { today }))).toEqual(['thisTaxYear']);
  });
  it('sweepRetirementAges: nothing moves (ages, pots and confidence are in whole years from the age today)', () => {
    const sweep = (now) => frozen(now, () => sweepRetirementAges({ settings: { ...SAVER, strategyId: 'pots-and-valves' }, accumulation: ACC, ages: [60], mcRuns: 20, stride: 24, now }));
    expect(changed(sweep)).toEqual([]);
  });
});

describe('known date dependence, pinned so a change is noticed (findings of the step-1 audit — behaviour NOT fixed here)', () => {
  it('a retired plan with NO saved firstTaxYear slides a whole year on 6 April: start, ages and every rung of the ladder', () => {
    expect(changed((now) => deriveTiming(RETIRED_NO_ANCHOR, now))).toEqual(['bridgeMonths', 'firstTaxYear', 'shapeAgeNow', 'startMonth', 'startOptions.0', 'startOptions.1']);
    expect(changed((now) => planOf(RETIRED_NO_ANCHOR, 'full-il-gilt', now))).toEqual(['firstTaxYear', 'pnvCfg.startAge', 'startAge']);
    const before = result(RETIRED_NO_ANCHOR, 'full-il-gilt', BEFORE), after = result(RETIRED_NO_ANCHOR, 'full-il-gilt', AFTER);
    expect([before.plan.firstTaxYear, after.plan.firstTaxYear]).toEqual([2027, 2028]);
    expect(after.signature.total).not.toBe(before.signature.total);
  });
  it('the gilt ladder is priced on the day it is run: the date moves ONLY each order\'s dealing spread (its years-to-maturity band) and so its cost', () => {
    const plan = (todayIso) => buildGiltLadder({ pot: 1300000, startAge: 60, durationYears: 30, amountAtAge: () => 40000, spAnnual: 0, spStartAge: 99,
      firstTaxYear: 2027, linkers: activeLinkers().gilts, cashYears: 2, todayIso });
    const paths = diffPaths(plain(plan('2026-09-10')), plain(plan('2028-09-10')));
    expect(paths.length).toBeGreaterThan(0);   // two years on, the 2032 and 2042 gilts have crossed the 5- and 15-year bands
    for (const k of paths) expect(k).toMatch(/^(orders\.\d+\.(spread|cost)|giltsCost|total|spare|reason)$/);
    expect(plan('2026-09-10')).toEqual(plan('2026-09-10'));
    expect(plain(buildGiltLadder({ pot: 1300000, startAge: 60, durationYears: 30, amountAtAge: () => 40000, firstTaxYear: 2027, linkers: activeLinkers().gilts, now: at(2026, 9, 10) })))
      .toEqual(plain(plan('2026-09-10')));   // `now` and `todayIso` are the same clock
  });
});

// ---- (c) static scan --------------------------------------------------------------------------------------------
const ROOT = join(__dirname, '..');
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.js') ? [p] : []; });
// Comments out (block, then line — a `//` inside a string literal would be cut short, which can only hide the tail of that line's string).
const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).split('\n').map((l) => l.replace(/(^|[^:'"`\\])\/\/.*$/, '$1'));
const FILES = ['src/services', 'src/strategies'].flatMap((d) => walk(join(ROOT, d)));

// ---- (d) the random stream is the same on every machine ---------------------------------------------------------
// seededRng is 32-bit integer arithmetic (sfc32), which the language defines exactly — so these literal values
// hold on every JS engine, engine version and CPU. They were taken on Apple-silicon Node 24 and checked on
// x64 Node 20. If one fails on a new platform, Monte Carlo results differ there: that is the bug 6.13.4 fixed
// (the old generator was Math.sin(s) × 10000, whose last bit is not the same everywhere). If the generator is
// ever changed on purpose, every Monte Carlo figure moves: that is an engine-version bump and a release note.
describe('(d) seededRng: one stream, bit for bit, everywhere', () => {
  const first3 = (seed) => { const r = seededRng(seed); return [r(), r(), r()]; };
  it('pinned values for whole-number, zero, fractional and negative seeds', () => {
    expect(first3(0)).toEqual([0.5174256332684308, 0.33256870321929455, 0.884305405896157]);
    expect(first3(1)).toEqual([0.9243202137295157, 0.15361752454191446, 0.83528659096919]);
    expect(first3(12345)).toEqual([0.21150362212210894, 0.803150819381699, 0.0739903652574867]);
    expect(first3(0.5)).toEqual([0.7093786436598748, 0.5029148706234992, 0.6268857596442103]);
    expect(first3(-1)).toEqual([0.20918031875044107, 0.8690698267892003, 0.5977415908128023]);
    expect(first3(900000)).toEqual([0.43689159769564867, 0.4229296713601798, 0.20508807455189526]);
    const r = seededRng(7); let x; for (let i = 0; i < 100000; i++) x = r();
    expect(x).toBe(0.15308063314296305);   // still in step after 100,000 draws
  });
  it('a seed that is not a finite number is seed 0; -0 is 0; the same seed repeats', () => {
    for (const bad of [NaN, Infinity, -Infinity, undefined, 'abc', -0]) expect(first3(bad), String(bad)).toEqual(first3(0));
    expect(first3(42)).toEqual(first3(42));
  });
  it('every draw is in [0, 1); a zero seed is not stuck; neighbouring seeds are unrelated streams', () => {
    const r = seededRng(0); const seen = new Set();
    for (let i = 0; i < 10000; i++) { const u = r(); expect(u >= 0 && u < 1).toBe(true); seen.add(u); }
    expect(seen.size).toBeGreaterThan(9990);
    // Run i's market years use seed i × 12345 and its bond noise seed i: first draws across runs must be spread evenly.
    for (const step of [1, 12345]) {
      const bins = new Array(10).fill(0);
      for (let i = 0; i < 5000; i++) bins[Math.floor(seededRng(i * step)() * 10)]++;
      for (const b of bins) { expect(b).toBeGreaterThan(400); expect(b).toBeLessThan(600); }
    }
    let sx = 0, sy = 0, sxy = 0, sxx = 0, syy = 0; const n = 5000;
    for (let i = 0; i < n; i++) { const x = seededRng(i)(), y = seededRng(i + 1)(); sx += x; sy += y; sxy += x * y; sxx += x * x; syy += y * y; }
    const corr = (sxy / n - (sx / n) * (sy / n)) / Math.sqrt((sxx / n - (sx / n) ** 2) * (syy / n - (sy / n) ** 2));
    expect(Math.abs(corr)).toBeLessThan(0.05);
  });
  it('uniform and, through gaussianRandom, standard normal', () => {
    const r = seededRng(2026); let m = 0; const n = 200000;
    for (let i = 0; i < n; i++) m += r();
    expect(m / n).toBeCloseTo(0.5, 2);
    const g = seededRng(2027); let gm = 0, gv = 0;
    for (let i = 0; i < n; i++) { const z = gaussianRandom(0, 1, g); gm += z; gv += z * z; }
    expect(gm / n).toBeCloseTo(0, 2);
    expect(Math.sqrt(gv / n)).toBeCloseTo(1, 2);
  });
  it('no calculation module draws randomness from Math.sin', () => {
    const hits = [];
    for (const f of [...FILES, join(ROOT, 'src/utils/MathUtils.js')]) code(readFileSync(f, 'utf8')).forEach((l, i) => { if (/Math\s*\.\s*sin\b/.test(l)) hits.push(relative(ROOT, f) + ':' + (i + 1)); });
    expect(hits).toEqual([]);
  });
});

describe('(c) static scan of src/services and src/strategies', () => {
  it('finds the modules', () => { expect(FILES.length).toBeGreaterThan(30); });
  it('the comment stripper keeps code and drops comments', () => {
    expect(code('a(); // Math.random\n/* new Date() */ b();').join('|').replace(/\s+/g, '')).toBe('a();|b();');
  });
  it('no Math.random: every random stream takes a seed', () => {
    const hits = [];
    for (const f of FILES) code(readFileSync(f, 'utf8')).forEach((l, i) => { if (/Math\s*\.\s*random|crypto\.getRandomValues/.test(l)) hits.push(relative(ROOT, f) + ':' + (i + 1)); });
    expect(hits).toEqual([]);
  });
  it('the wall clock is read only as the default of an injectable parameter (or a write stamp on the allow-list)', () => {
    // A default the caller can replace: a clock-named PARAMETER default (`now = new Date()`, `nowMs = Date.now()`) or an
    // `injected || new Date()` fallback. `const today = new Date()` is neither, and fails.
    const DEFAULT = /\|\|\s*\(?\s*(?:new Date\(\s*\)|Date\.now\(\s*\))|(?<!\b(?:const|let|var)\s+)\b(?:now|today|clock|nowMs|stashedAt)\s*=\s*(?:new Date\(\s*\)|Date\.now\(\s*\))/g;
    // Stamps written when the user locks/unlocks — metadata, never an input to a calculation.
    const ALLOW = { 'src/services/PlanLock.js': 3 };
    const bare = {};
    for (const f of FILES) code(readFileSync(f, 'utf8')).forEach((l, i) => {
      const n = (l.match(/new Date\(\s*\)|Date\.now\(\s*\)/g) || []).length;
      if (n && (l.match(DEFAULT) || []).length !== n) { const k = relative(ROOT, f).split('\\').join('/'); (bare[k] = bare[k] || []).push(i + 1); }
    });
    const over = Object.entries(bare).filter(([k, lines]) => lines.length !== (ALLOW[k] || 0)).map(([k, lines]) => k + ':' + lines.join(','));
    expect(over).toEqual([]);
  });
});
