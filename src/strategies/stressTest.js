/**
 * ONE stress test for every strategy — the single source of truth behind both the Stress tab
 * (when a plan is locked to a strategy) and the Strategies compare table. Whatever strategy the
 * user switches to, the numbers they see come from THIS function on THIS plan, so the compare
 * row and the locked-plan result can never disagree (tests/strategySwitch.test.js pins it).
 *
 * All three strategies run on the same real-terms Shiller history (every window) and the same
 * block-bootstrapped Monte-Carlo futures (deterministic seeds). Each returns the same shape:
 *   ruin {hist, mc}, worst12 {min, median}, guaranteedToAge, terminal {p10, p50, p90},
 *   cones: wealth (p10/p25/p50/p75/p90 by plan year, today's money) and income (same),
 *   plus a strategy-specific `signature` and the derived config used.
 */

import { getRtr, getCpi, bootstrapPaths, annualNominal, pct, curvePricer, flatYieldPricer } from './ladderEngine.js';
import { getStrategy } from './registry.js';
import { runLadderWindows, runLadderMonteCarlo } from './LadderAndRatchet.js';
import { runFlexWindows, runFlexMonteCarlo } from './FloorAndFlex.js';
import { deriveCompareConfigs } from './compareRunner.js';
import { grossToNet, netToGross } from '../services/TaxCalculator.js';
import { scheduleFromSteps } from '../storage/StressRepository.js';
import { buildGiltLadder } from './GiltLadderPlan.js';
import { activeLinkers } from '../services/LinkerUniverse.js';

export const STRATEGY_NAMES = {
  'pots-and-valves': 'Pots & Valves', 'ladder-and-ratchet': 'Ladder & Ratchet', 'floor-and-flex': 'Floor & Flex', 'floor-the-schedule': 'Floor the schedule', 'floor-to-age': 'Floor to an age, then decide', 'full-il-gilt': 'Full index-linked gilt ladder'
};

/** Percentile bands (p10/p25/p50/p75/p90) of a set of per-year series. */
export function coneOf(seriesList, years) {
  const out = { years: Array.from({ length: years + 1 }, (_, i) => i), p10: [], p25: [], p50: [], p75: [], p90: [] };
  for (let y = 0; y <= years; y++) {
    const vals = seriesList.map((s) => (s && s[y] != null && Number.isFinite(s[y])) ? s[y] : 0);
    out.p10.push(pct(vals, 0.10)); out.p25.push(pct(vals, 0.25)); out.p50.push(pct(vals, 0.50));
    out.p75.push(pct(vals, 0.75)); out.p90.push(pct(vals, 0.90));
  }
  return out;
}

/**
 * The plan every strategy is judged on, built ONCE from the app's stress settings + the P&V
 * simulation config (createSimulationConfigFromSettings). Honours the strategy parameters the
 * user saved in Settings (ladder years, bolted draw, essentials, horizon, sleeve rate) and the
 * plan's real State Pension start year — never a hard-coded "year 10".
 */
export function planFromSettings(settings, cfg, { yieldForYear, essentialsAnnual, startAge = 57 } = {}) {
  const params = settings.strategyParams || {};
  const alloc = (cfg.equityStart || 0) + (cfg.bondStart || 0) + (cfg.cashStart || 0) + (cfg.diversifierStart || 0);
  // The strategy settings can pin the SIPP/ISA totals fed to the ladder; otherwise the plan's pots.
  const pot = params.sippTotal > 0 ? params.sippTotal : alloc;
  const isa = params.sippTotal > 0 ? (params.isaTotal || 0) : (cfg.isaBalance || 0);
  const target = settings.baseSalary || 0;
  const spWeekly = cfg.spWeeklyAmount || settings.spWeeklyAmount || 0;
  const spAnnual = spWeekly ? spWeekly * 52 : (cfg.statePension || settings.statePension || 0);
  const spStartYear = cfg.spStartYear ?? cfg.statePensionYear ?? settings.statePensionYear ?? 99;
  const durationYears = Math.min(settings.duration || cfg.duration || 35, 35);
  // Stepped income (60k to 72, 50k to 80, 40k after): the saved per-year schedule wins; if a plan
  // saved steps but no schedule (an old save-order bug), compile it here so nothing runs flat.
  const targetSchedule = Array.isArray(cfg.targetSchedule) && cfg.targetSchedule.length ? cfg.targetSchedule : scheduleFromSteps(settings, startAge);
  return {
    pot, isa, targetAnnual: target,
    essentialsAnnual: params.essentialsAnnual || essentialsAnnual || Math.round(target * 0.55),
    durationYears, startAge, spAnnual, spStartYear,
    incomeShape: settings.incomeShape, incomeSteps: settings.incomeSteps, shapeAgeNow: settings.shapeAgeNow,
    targetSchedule,
    params: {
      ladderYears: params.ladderYears, drawAnnual: params.drawAnnual, triggerMode: params.triggerMode,
      bandThreshold: params.bandThreshold, horizonAge: params.horizonAge, sleeveRate: params.sleeveRate,
      floorToAge: params.floorToAge, cashYears: params.cashYears, bridgeCash: params.bridgeCash
    },
    spFirstYearRatio: cfg.spFirstYearRatio ?? 1,
    firstTaxYear: settings.firstTaxYear || (new Date().getFullYear() + 1),
    stride: 2, mcRuns: 1000,   // identical on both surfaces: compare row == locked-plan run
    pnvCfg: { ...cfg, startAge, targetSchedule },   // the plan's own tax mode / ISA rate: it runs nominally now
    yieldForYear
  };
}

/**
 * One P&V run on a NOMINAL path (real equity history × that window's own inflation), exactly as the
 * Monte Carlo tab runs it — tax bands, cash and bond models all see real inflation — with the
 * outputs converted to today's money. (An earlier version fed the engine inflation≈0 and frozen
 * bands, which let the nominal bond/cash models read as REAL returns and flattered P&V by
 * several points of ruin.)
 */
function pnvRun(cfg, returns, seed, planYears, startAge) {
  const eng = getStrategy('pots-and-valves').engine;
  const r = eng.simulate({ ...cfg, years: planYears, trace: true }, returns, seed);
  const t = r.trace || [];
  // Income on a GROSS-EQUIVALENT basis so it is comparable with the £ target and with the ladder
  // strategies (whose draw is the gross target): SIPP draws are gross; ISA top-ups are net, so
  // they are grossed up at the plan's own average rate for the year (target ÷ net-of-target).
  // Previously ISA £ were added at net value, which read a full-income month as a shortfall.
  const inc = t.map((row) => {
    const pi = row.planInputs || {};
    const taxableYr = ((row.effectiveSipp || 0) + (pi.fixed || 0) / 12) * 12;
    const isaYr = (row.effectiveIsa ?? row.isaMonthly ?? 0) * 12;
    if (!(pi.pa > 0)) return (taxableYr + isaYr) / 12;
    const netYr = grossToNet(taxableYr, pi.pa, pi.brl, pi.hrl) + isaYr;   // what lands in the bank
    return netToGross(netYr, pi.pa, pi.brl, pi.hrl) / 12 / (row.cumInf || 1);   // gross-equivalent, today's money
  });
  let worst12 = Infinity, run = 0;
  for (let i = 0; i < inc.length; i++) {
    run += inc[i];
    if (i >= 12) run -= inc[i - 12];
    if (i >= 11) worst12 = Math.min(worst12, run);
  }
  if (r.failed || !Number.isFinite(worst12)) worst12 = 0;
  const incomeByYear = [];
  for (let y = 0; y < planYears; y++) { let s = 0; for (let m = 0; m < 12; m++) s += inc[12 * y + m] || 0; incomeByYear.push(s); }
  incomeByYear.push(incomeByYear[incomeByYear.length - 1] || 0);
  const wealth = (r.potByYear || []).map((v, y) => (v == null ? 0 : v) + (r.isaByYear && r.isaByYear[y] != null ? r.isaByYear[y] : 0));
  return {
    failed: r.failed, failAge: r.failed ? startAge + r.failMonth / 12 : null,
    terminal: r.failed ? 0 : (r.finalReal + (r.finalIsa || 0) / (r.cumInflation || 1)),   // today's money
    worst12, protMonths: r.protMonths, wealthByYear: wealth, incomeByYear
  };
}

function pnvTest(p, configs) {
  const rtr = getRtr(), cpi = getCpi();
  const planYears = p.durationYears;
  const END = configs.END;
  const hist = [];
  for (let s = 0; s < rtr.length - END; s += (p.stride || 1)) hist.push({ s, ...pnvRun(p.pnvCfg, annualNominal(rtr, cpi, s, planYears), s, planYears, p.startAge) });
  const mc = [];
  const runs = p.mcRuns || 400;
  for (let i = 0; i < runs; i++) { const path = bootstrapPaths(i * 31337 + 11, END); mc.push(pnvRun(p.pnvCfg, annualNominal(path.rtr, path.cpi, 0, planYears), i, planYears, p.startAge)); }
  const terms = mc.map((w) => w.terminal);
  return {
    affordable: true,
    ruin: { hist: 100 * hist.filter((w) => w.failed).length / hist.length, mc: 100 * mc.filter((w) => w.failed).length / mc.length },
    worst12: { min: Math.min(...hist.map((w) => w.worst12)), median: pct(hist.map((w) => w.worst12), 0.5) },
    guaranteedToAge: p.spAnnual > 0 ? `State Pension only (from age ${p.startAge + (p.spStartYear || 0)})` : 'None — market-dependent',
    terminal: { p10: pct(terms, 0.10), p50: pct(terms, 0.5), p90: pct(terms, 0.90), histMedian: pct(hist.map((w) => w.terminal), 0.5) },
    cones: { wealth: coneOf(mc.map((w) => w.wealthByYear), planYears), income: coneOf(mc.map((w) => w.incomeByYear), planYears) },
    failAges: mc.filter((w) => w.failed).map((w) => w.failAge),
    signature: { protMonthsMedian: pct(hist.map((w) => w.protMonths), 0.5) },
    n: { hist: hist.length, mc: runs },
    wealthLabel: 'All pots (SIPP + ISA), today\'s money'
  };
}

/** PV at year y of the ladder rungs still to be paid (years y+1 .. lastRung). */
function ladderPvAt(y, lastRung, drawForYear, pricer) {
  let v = 0;
  for (let k = y + 1; k <= lastRung; k++) v += pricer(k, y * 12);
  return v;
}

function ladderTest(p, configs) {
  const lr = configs.lr;
  if (!lr) return { affordable: false, reason: `the base ladder costs ${Math.round(configs.baseLadderCost)} — more than the ${Math.round(p.pot + (p.isa || 0))} available` };
  const planYears = p.durationYears;
  const drawForYear = lr.drawNetOfSp;
  const pricer = lr.yieldForYear ? curvePricer(drawForYear, lr.yieldForYear) : flatYieldPricer(drawForYear, lr.realYield);
  const h = runLadderWindows(lr);
  const hist = h.windows.slice(0, h.meta.fullN);
  const mc = runLadderMonteCarlo(lr, p.mcRuns || 400);
  const enrich = (w) => {
    const wealth = [], income = [];
    for (let y = 0; y <= planYears; y++) {
      const sleeve = w.sleeveByYear[y] ?? 0;
      // Rungs owned at year y: the base ladder plus whatever the ratchet had bought BY then.
      const securedBy = (w.trades || []).filter((t) => t.t <= 12 * y).reduce((a, t) => a + t.bought, 0);
      const lastRung = Math.min(lr.ladderYears + securedBy, planYears);
      wealth.push(sleeve + ladderPvAt(y, lastRung, drawForYear, pricer));
      const failedBy = w.survived === false && w.failAge != null && (p.startAge + y) >= w.failAge;
      income.push(failedBy ? 0 : drawForYear(y + 1) + ((y >= (p.spStartYear ?? 99)) ? p.spAnnual : 0));
    }
    return { wealth, income };
  };
  const mcE = mc.windows.map(enrich);
  const terms = mc.windows.map((w) => w.terminal ?? 0);
  return {
    affordable: true,
    ruin: { hist: 100 * hist.filter((w) => w.survived === false).length / hist.length, mc: 100 - (mc.stats.survivalPct ?? 100) },
    ruinMcHalfWidthPp: mc.stats.survivalHalfWidthPp,
    worst12: { min: hist.every((w) => w.survived) ? lr.minDraw : 0, median: lr.minDraw },
    guaranteedToAge: `${p.startAge + lr.ladderYears} by contract; median ratchets to ${p.startAge + lr.ladderYears + h.stats.securedMedian}`,
    terminal: { p10: pct(terms, 0.10), p50: pct(terms, 0.5), p90: pct(terms, 0.90), histMedian: h.stats.terminalMedian },
    cones: { wealth: coneOf(mcE.map((e) => e.wealth), planYears), income: coneOf(mcE.map((e) => e.income), planYears) },
    failAges: mc.windows.filter((w) => w.survived === false).map((w) => w.failAge),
    signature: {
      neverPct: h.stats.neverPct, fullySecuredPct: h.stats.fullySecuredPct, securedMedian: h.stats.securedMedian,
      securedMedianMc: mc.stats.securedMedian, sellEventsMedian: h.stats.sellEventsMedian,
      sleeveMedian: h.stats.sleeveMedian, sleeveWorst: h.stats.sleeveWorst, baseLadderCost: configs.baseLadderCost, ladderYears: lr.ladderYears
    },
    n: { hist: hist.length, mc: mc.windows.length },
    wealthLabel: 'Growth sleeve + unpaid ladder rungs, today\'s money'
  };
}

function flexTest(p, configs) {
  const ff = configs.ff;
  if (!ff) return { affordable: false, reason: `the essentials floor costs ${Math.round(configs.ffFloorCost)} — more than the ${Math.round(p.pot + (p.isa || 0))} available` };
  const planYears = p.durationYears;
  const floorDraw = ff.floorDraw;
  const pricer = ff.yieldForYear ? curvePricer(floorDraw, ff.yieldForYear) : flatYieldPricer(floorDraw, 0.023);
  const h = runFlexWindows(ff);
  const mc = runFlexMonteCarlo(ff, p.mcRuns || 400);
  const enrich = (w) => {
    const wealth = [], income = [];
    for (let y = 0; y <= planYears; y++) {
      wealth.push((w.sleeveByYear[y] ?? 0) + ladderPvAt(y, planYears, floorDraw, pricer));
      income.push(floorDraw(y + 1) + ((y >= (p.spStartYear ?? 99)) ? p.spAnnual : 0) + (w.dByYear[Math.min(y, w.dByYear.length - 1)] ?? 0));
    }
    return { wealth, income };
  };
  const mcE = mc.windows.map(enrich);
  const terms = mc.windows.map((w) => w.terminal);
  return {
    affordable: true,
    ruin: { hist: 0, mc: 0 },   // essentials are bought; a %-of-pot sleeve cannot deplete
    worst12: { min: p.essentialsAnnual + h.stats.worstMin, median: p.essentialsAnnual + h.stats.worstMedian },
    guaranteedToAge: `${ff.horizonAge} by contract (essentials)`,
    terminal: { p10: pct(terms, 0.10), p50: pct(terms, 0.5), p90: pct(terms, 0.90), histMedian: h.stats.terminalMedian },
    cones: { wealth: coneOf(mcE.map((e) => e.wealth), planYears), income: coneOf(mcE.map((e) => e.income), planYears) },
    failAges: [],
    signature: {
      year1Flex: h.stats.year1D, worstFlexMedian: h.stats.worstMedian, worstFlexP10: h.stats.worstP10,
      shareLeanYears: h.stats.shareYearsUnder(10000), floorCost: configs.ffFloorCost, horizonAge: ff.horizonAge
    },
    n: { hist: h.stats.n, mc: mc.windows.length },
    wealthLabel: 'Flex sleeve + unpaid floor rungs, today\'s money'
  };
}

function scheduleFloorTest(p, configs) {
  const c = configs.fs;
  if (!c) return { affordable: false, reason: `buying the whole schedule costs ${Math.round(configs.fsFloorCost)} — more than the ${Math.round(p.pot + (p.isa || 0))} available` };
  const planYears = p.durationYears;
  const pricer = c.yieldForYear ? curvePricer(c.floorDraw, c.yieldForYear) : flatYieldPricer(c.floorDraw, 0.023);
  const h = runFlexWindows(c);
  const mc = runFlexMonteCarlo(c, p.mcRuns || 400);
  const enrich = (w) => {
    const wealth = [], income = [];
    for (let y = 0; y <= planYears; y++) {
      wealth.push((w.sleeveByYear[y] ?? 0) + ladderPvAt(y, planYears, c.floorDraw, pricer));
      income.push(c.floorDraw(y + 1) + ((y >= (p.spStartYear ?? 99)) ? p.spAnnual : 0));   // = the schedule, by contract
    }
    return { wealth, income };
  };
  const mcE = mc.windows.map(enrich);
  const terms = mc.windows.map((w) => w.terminal);
  const sleeveAt = (y) => { const v = mc.windows.map((w) => w.sleeveByYear[Math.min(y, planYears)] ?? 0); return { p10: pct(v, 0.1), p50: pct(v, 0.5), p90: pct(v, 0.9) }; };
  return {
    affordable: true,
    ruin: { hist: 0, mc: 0 },   // every year of the schedule is bought; the sleeve is never drawn
    worst12: { min: c.minDraw, median: c.minDraw },
    guaranteedToAge: `${c.horizonAge} by contract (the whole schedule)`,
    terminal: { p10: pct(terms, 0.10), p50: pct(terms, 0.5), p90: pct(terms, 0.90), histMedian: h.stats.terminalMedian },
    cones: { wealth: coneOf(mcE.map((e) => e.wealth), planYears), income: coneOf(mcE.map((e) => e.income), planYears) },
    failAges: [],
    signature: {
      floorCost: configs.fsFloorCost, sleeveE0: c.E0, shareOfPot: configs.fsFloorCost / (p.pot + (p.isa || 0)),
      sleeveAt10: sleeveAt(10), sleeveAt23: sleeveAt(23), sleeveAtEnd: sleeveAt(planYears), horizonAge: c.horizonAge,
      rule: 'Once a year: if the reserve is more than double its glide line (starting value x 1.05^years), spend the excess on rungs beyond the horizon or on raising the later years; otherwise leave it.'
    },
    n: { hist: h.stats.n, mc: mc.windows.length },
    wealthLabel: 'Reserve sleeve + unpaid schedule rungs, today\'s money'
  };
}

function floorToAgeTest(p, configs) {
  const c = configs.fa;
  if (!c) return { affordable: false, reason: `buying the schedule to ${configs.fa ? c.floorToAge : (p.params?.floorToAge || 80)} costs ${Math.round(configs.faFloorCost)} — more than the ${Math.round(p.pot + (p.isa || 0))} available` };
  const N = p.durationYears, A = c.A;
  const pricer = c.yieldForYear ? curvePricer(c.floorDraw, c.yieldForYear) : flatYieldPricer(c.floorDraw, 0.023);
  const spAt = (y) => ((y >= (p.spStartYear ?? 99)) ? p.spAnnual : 0);
  const h = runFlexWindows(c);
  const mc = runFlexMonteCarlo(c, p.mcRuns || 400);
  // AT age A the reserve buys the rest of the schedule if it can; else the level income it can buy.
  const decide = (w) => {
    const sA = w.sleeveByYear[A] ?? 0;
    const full = sA >= c.restCostFull;
    const level = full ? null : sA / c.annuityFactor;                    // £/yr net of SP, level, to the horizon
    const leftover = full ? sA - c.restCostFull : 0;
    const wealth = [], income = [];
    for (let y = 0; y <= N; y++) {
      if (y <= A) {
        wealth.push((w.sleeveByYear[y] ?? 0) + ladderPvAt(y, A, c.floorDraw, pricer));
        income.push(c.floorDraw(y + 1) + spAt(y));
      } else {
        const grow = (w.sleeveByYear[y] ?? 0) / Math.max(1e-9, sA);
        const rungsPv = full
          ? (() => { let v = 0; for (let k = y + 1; k <= N; k++) v += Math.max(0, c.amountAt(k) - (k > (p.spStartYear ?? Infinity) ? p.spAnnual : 0)) * Math.pow(1 + (c.yieldForYear ? c.yieldForYear(k - y) : 0.023), -(k - y)); return v; })()
          : (() => { let v = 0; for (let k = y + 1; k <= N; k++) v += level * Math.pow(1 + (c.yieldForYear ? c.yieldForYear(k - y) : 0.023), -(k - y)); return v; })();
        wealth.push(leftover * grow + rungsPv);
        income.push((full ? Math.max(0, c.amountAt(y + 1) - spAt(y)) : level) + spAt(y));
      }
    }
    return { sA, full, level, leftover, wealth, income, worst: Math.min(...income) };
  };
  const hE = h.windows.map(decide), mcE = mc.windows.map(decide);
  const pctCut = (arr) => 100 * arr.filter((e) => !e.full).length / arr.length;
  const sAt = (arr) => { const v = arr.map((e) => e.sA); return { p10: pct(v, 0.1), p50: pct(v, 0.5), p90: pct(v, 0.9) }; };
  const reserveCone = Array.from({ length: A + 1 }, (_, y) => { const v = mc.windows.map((w) => w.sleeveByYear[y] ?? 0); return { p10: pct(v, 0.1), p50: pct(v, 0.5), p90: pct(v, 0.9) }; });
  const canBuy = (amount) => { const cost = c.restCost(() => amount); return { amount, cost, hist: 100 * hE.filter((e) => e.sA >= cost).length / hE.length, mc: 100 * mcE.filter((e) => e.sA >= cost).length / mcE.length }; };
  const lowest = Math.min(...Array.from({ length: N - A }, (_, i) => c.amountAt(A + 1 + i)));
  const terms = mcE.map((e) => e.wealth[N]);
  return {
    affordable: true,
    // Never runs out: the reserve always buys SOMETHING at A. 'ruin' here = the plan is CUT after A.
    ruin: { hist: pctCut(hE), mc: pctCut(mcE) },
    ruinLabel: 'chance the plan is cut after ' + c.floorToAge + ' (it never runs out — the reserve buys a smaller income)',
    worst12: { min: Math.min(...hE.map((e) => e.worst)), median: pct(hE.map((e) => e.worst), 0.5) },
    guaranteedToAge: `${c.floorToAge} by contract; the rest decided at ${c.floorToAge} with a known price`,
    terminal: { p10: pct(terms, 0.10), p50: pct(terms, 0.5), p90: pct(terms, 0.90), histMedian: pct(hE.map((e) => e.wealth[N]), 0.5) },
    cones: { wealth: coneOf(mcE.map((e) => e.wealth), N), income: coneOf(mcE.map((e) => e.income), N) },
    failAges: [],
    signature: {
      floorToAge: c.floorToAge, A, floorCost: configs.faFloorCost, sleeveE0: c.E0, shareOfPot: configs.faFloorCost / (p.pot + (p.isa || 0)),
      sleeveAtA: sAt(mcE), sleeveAtAHist: sAt(hE), restCostFull: c.restCostFull, reserveCone,
      amountsByAge: Array.from({ length: N }, (_, k) => ({ age: p.startAge + k, gross: c.amountAt(k + 1), sp: spAt(k) })),
      canBuy: [canBuy(c.amountAt(A + 1)), canBuy(lowest)].filter((x, i, a) => i === 0 || x.amount !== a[0].amount),
      levelIfCut: { p10: pct(mcE.filter((e) => !e.full).map((e) => e.level + p.spAnnual), 0.1) || null, p50: pct(mcE.filter((e) => !e.full).map((e) => e.level + p.spAnnual), 0.5) || null },
      rule: `Nothing to decide until ${c.floorToAge}. At ${c.floorToAge}: price the remaining years on that day's real-yield curve (or an RPI annuity quote); buy the schedule if the reserve covers it, otherwise the level income it does cover.`
    },
    n: { hist: h.stats.n, mc: mc.windows.length },
    wealthLabel: 'Reserve + unpaid rungs to ' + c.floorToAge + ' (after ' + c.floorToAge + ': what the reserve bought + what is left), today\'s money'
  };
}

function fullGiltTest(p, configs) {
  const N = p.durationYears;
  const sched = Array.isArray(p.targetSchedule) && p.targetSchedule.length ? p.targetSchedule : null;
  const amountAtAge = (age) => { const k = age - p.startAge; return sched ? (sched[Math.min(k, sched.length - 1)] ?? p.targetAnnual) : p.targetAnnual; };
  const firstTaxYear = p.firstTaxYear || new Date().getFullYear() + 1;
  const plan = buildGiltLadder({
    pot: p.pot + (p.isa || 0), startAge: p.startAge, durationYears: N, amountAtAge,
    spAnnual: p.spAnnual, spStartAge: p.startAge + (p.spStartYear ?? 99), spFirstYearRatio: p.spFirstYearRatio ?? 1,
    firstTaxYear, linkers: activeLinkers().gilts, cashYears: p.params?.cashYears ?? 2, bridgeCash: p.params?.bridgeCash || 0
  });
  if (!plan.affordable) return { affordable: false, reason: plan.reason, plan };
  // Deterministic: income = the schedule; wealth = unpaid rungs at cost (+ spare) — no market exposure.
  const income = [], wealth = [];
  const costByYear = {}; for (const o of plan.orders) for (const Y of o.taxYears) costByYear[Y] = (costByYear[Y] || 0) + o.cost / o.taxYears.length;
  for (let y = 0; y <= N; y++) {
    const age = p.startAge + y; income.push(amountAtAge(Math.min(age, p.startAge + N - 1)));
    let w = plan.spare; for (const yr of plan.years) if (yr.Y >= firstTaxYear + y) w += yr.from === 'cash' ? yr.need : (costByYear[yr.Y] || 0);
    wealth.push(w);
  }
  const flat = (arr) => ({ years: arr.map((_, i) => i), p10: arr, p25: arr, p50: arr, p75: arr, p90: arr });
  const minInc = Math.min(...income.slice(0, N));
  return {
    affordable: true, plan,
    ruin: { hist: 0, mc: 0 },
    worst12: { min: minInc, median: minInc },
    guaranteedToAge: (p.startAge + N - 1) + ' by contract (every year bought today)',
    terminal: { p10: plan.spare, p50: plan.spare, p90: plan.spare, histMedian: plan.spare },
    cones: { wealth: flat(wealth), income: flat(income) },
    failAges: [],
    signature: { cash: plan.cash, giltsCost: plan.giltsCost, total: plan.total, spare: plan.spare, orders: plan.orders.length, doubleDrops: plan.orders.filter((o) => o.taxYears.length > 1).length, firstTaxYear, cashYears: plan.cashYears.length },
    n: { hist: 1, mc: 1 },
    wealthLabel: "Unpaid rungs at cost + cash, today's money (no market exposure)"
  };
}

/** Stress-test ONE strategy on the plan. */
export function stressTestStrategy(strategyId, p, configs = deriveCompareConfigs(p)) {
  const fn = { 'pots-and-valves': pnvTest, 'ladder-and-ratchet': ladderTest, 'floor-and-flex': flexTest, 'floor-the-schedule': scheduleFloorTest, 'floor-to-age': floorToAgeTest, 'full-il-gilt': fullGiltTest }[strategyId];
  if (!fn) throw new Error('unknown strategy ' + strategyId);
  const r = fn(p, configs);
  return { strategyId, name: STRATEGY_NAMES[strategyId], ...r, configs };
}

/** All three on the identical plan (the Strategies compare). */
export function stressTestAll(p) {
  const configs = deriveCompareConfigs(p);
  const strategies = {};
  for (const id of Object.keys(STRATEGY_NAMES)) strategies[id] = stressTestStrategy(id, p, configs);
  return { configs, strategies };
}
