/**
 * Phase D — the N-way strategy compare (strategy brief §6, UX brief §3.3).
 *
 * THE central promise: every strategy is judged on IDENTICAL markets and ONE income profile.
 * All three run on the same Shiller real-terms historical windows: the ladder strategies
 * natively; Pots & Valves through its own production engine fed the window's real annual
 * returns (epsilon inflation, frozen bands — i.e. the plan in today's money). One window index
 * = one market history for all strategies.
 *
 * Outputs per strategy: the four-row plain table (worst 12-month income; income guaranteed to
 * age; chance of running out; typical amount left) + signature stats + a layered-spending
 * breakdown for a representative (median-terminal) window, with contractual income separated
 * from market income (the solid-vs-translucent law).
 */

import { getRtr, bootstrapRtr, pct } from './ladderEngine.js';
import { getStrategy } from './registry.js';
import { runLadderWindows, runLadderMonteCarlo } from './LadderAndRatchet.js';
import { runFlexWindows, runFlexMonteCarlo, floorCost } from './FloorAndFlex.js';
import { profileTargetForYear } from '../services/IncomeProfile.js';
import { stressTestAll } from './stressTest.js';

/** Annualised real returns for one window (planYears entries). */
function windowAnnualReturns(rtr, s, planYears) {
  const eq = {}, inf = {};
  for (let y = 0; y < planYears; y++) {
    eq[y] = rtr[s + 12 * (y + 1)] / rtr[s + 12 * y] - 1;
    inf[y] = 1e-9;   // real terms: inflation is epsilon (0 reads as unset)
  }
  return { equity: eq, inflation: inf };
}

/**
 * Pots & Valves over the same historical windows, in today's money.
 * cfg: the plan's REAL config (pots, floors, target, SP...) with taxMode 'frozen'.
 */
export function runPnvWindows(cfg, { END, stride = 1 } = {}) {
  const rtr = getRtr();
  const planYears = Math.round(END / 12);
  const n = rtr.length - END;
  const eng = getStrategy('pots-and-valves').engine;
  const windows = [];
  for (let s = 0; s < n; s += stride) {
    const returns = windowAnnualReturns(rtr, s, planYears);
    const r = eng.simulate({ ...cfg, years: planYears, taxMode: 'frozen', trace: true }, returns, s);
    // Worst rolling-12-month income from the trace (SIPP + ISA + fixed floors), then drop it.
    let worst12 = Infinity;
    const t = r.trace || [];
    if (t.length >= 12) {
      let run = 0;
      const inc = t.map((row) => (row.effectiveSipp || 0) + (row.effectiveIsa ?? row.isaMonthly ?? 0)
        + ((row.planInputs && row.planInputs.fixed) || 0) / 12);
      for (let i = 0; i < inc.length; i++) {
        run += inc[i];
        if (i >= 12) run -= inc[i - 12];
        if (i >= 11) worst12 = Math.min(worst12, run);
      }
    }
    if (r.failed) worst12 = 0;   // a busted plan's worst year is no income at all
    windows.push({
      s,
      failed: r.failed,
      failAge: r.failed ? (cfg.startAge ?? 57) + r.failMonth / 12 : null,
      terminal: r.failed ? 0 : (r.finalEquity + r.finalBond + r.finalCash + r.finalDiversifier + r.finalIsa),
      worst12,
      protMonths: r.protMonths
    });
  }
  return { n: windows.length, windows };
}

/** P&V Monte Carlo on block-bootstrapped REAL paths — the beyond-history lens the compare
 *  must show next to the historical one (history alone reads as "never fails" at modest
 *  withdrawal rates; the bootstrap constructs worse sequences than history served). */
export function runPnvMonteCarlo(cfg, { END, runs = 400 } = {}) {
  const planYears = Math.round(END / 12);
  const eng = getStrategy('pots-and-valves').engine;
  let failedN = 0;
  for (let i = 0; i < runs; i++) {
    const path = bootstrapRtr(i * 31337 + 11, END);
    const eq = {}, inf = {};
    for (let y = 0; y < planYears; y++) { eq[y] = path[12 * (y + 1)] / path[12 * y] - 1; inf[y] = 1e-9; }
    const r = eng.simulate({ ...cfg, years: planYears, taxMode: 'frozen' }, { equity: eq, inflation: inf }, i);
    if (r.failed) failedN++;
  }
  return { runs, ruinPct: 100 * failedN / runs };
}

/**
 * Derive per-strategy default configurations from the plan's own numbers (real terms).
 * @param {object} p { pot, isa, targetAnnual, essentialsAnnual, durationYears, startAge,
 *                     spAnnual, spStartYear, pnvCfg }
 */
export function deriveCompareConfigs(p) {
  const END = p.durationYears * 12;
  const realYield = 0.023;
  const yf = p.yieldForYear || (() => realYield);   // live linker curve when the caller has one
  const total = p.pot + (p.isa || 0);

  // Ladder & Ratchet: base ladder covers up to 15 years (or half the plan when shorter);
  // ratchet rungs run from there to the horizon. Post-SP rungs are net of the State Pension.
  const prm = p.params || {};
  const ladderYears = Math.max(1, Math.min(prm.ladderYears || Math.min(15, Math.floor(p.durationYears / 2)), p.durationYears - 1));
  const ladderDraw = prm.drawAnnual > 0 ? prm.drawAnnual : p.targetAnnual;
  const drawNet = (k) => Math.max(0, ladderDraw - (k > (p.spStartYear ?? Infinity) ? (p.spAnnual || 0) : 0));
  const baseLadderCost = (() => { let c = 0; for (let k = 1; k <= ladderYears; k++) c += drawNet(k) * Math.pow(1 + yf(k), -k); return c; })();
  const lrE0 = total - baseLadderCost;
  const lr = lrE0 > 0 ? {
    E0: lrE0, ladderYears, L: ladderYears * 12,
    firstRung: ladderYears + 1, maxRung: p.durationYears,
    draw: ladderDraw,
    profile: { type: 'phases', phases: [{ fromYear: 0, amount: ladderDraw }] },
    trigger: prm.triggerMode === 'calendar'
      ? { mode: 'calendar', reviews: Array.from({ length: Math.floor(ladderYears / 5) }, (_, i) => (i + 1) * 60) }
      : { mode: 'band', b: prm.bandThreshold || 1.2 },
    END, realYield, yieldForYear: p.yieldForYear, glideRate: 0.05, startAge: p.startAge,
    baseLadderCost, drawNetOfSp: drawNet
  } : null;

  // Floor & Flex: essentials floor (net of SP) to the horizon; remainder is the flex sleeve.
  const floorDraw = (k) => Math.max(0, p.essentialsAnnual - (k > (p.spStartYear ?? Infinity) ? (p.spAnnual || 0) : 0));
  const ffYears = prm.horizonAge > p.startAge ? Math.min(prm.horizonAge - p.startAge, p.durationYears) : p.durationYears;
  const ffFloorCost = floorCost({ drawForYear: floorDraw, years: ffYears, realYield, yieldForYear: p.yieldForYear });
  const ffE0 = total - ffFloorCost;
  const ff = ffE0 > 0 ? {
    E0: ffE0, rate: prm.sleeveRate || 0.04, END, floorCost: ffFloorCost, floorDraw, yieldForYear: p.yieldForYear,
    horizonAge: p.startAge + ffYears
  } : null;

  return { END, lr, ff, lrAffordable: lrE0 > 0, ffAffordable: ffE0 > 0, baseLadderCost, ffFloorCost };
}

/** Run the full N-way compare — ONE code path with the locked-plan stress test (stressTest.js). */
export function runCompare(p) {
  const all = stressTestAll(p);
  const out = { configs: all.configs, strategies: {} };
  for (const [id, r] of Object.entries(all.strategies)) {
    if (!r.affordable) continue;
    out.strategies[id] = {
      table: {
        worst12Median: r.worst12.median, worst12Min: r.worst12.min, guaranteedToAge: r.guaranteedToAge,
        ruinPct: r.ruin.hist, ruinPctMc: r.ruin.mc, terminalMedian: r.terminal.p50
      },
      signature: r.signature, cones: r.cones, n: r.n.hist, full: r
    };
  }
  return out;
}

/** Outcome of one named vintage (the canned decades: 1966 bust, 1985 boom) per strategy. */
export function cannedDecade(p, year, month) {
  const rtr = getRtr();
  const configs = deriveCompareConfigs(p);
  const [sy] = [1871];
  const s = (year - sy) * 12 + (month - 1);
  const out = {};
  if (s >= 0 && s + configs.END < rtr.length) {
    const pnv = runPnvWindows(p.pnvCfg, { END: configs.END, stride: 1 });
    // cheap: find the window in the already-computed set
    const w = pnv.windows.find((x) => x.s === s);
    if (w) out['pots-and-valves'] = { failed: w.failed, failAge: w.failAge, terminal: w.terminal, worst12: w.worst12 };
    if (configs.lr) {
      const lr = runLadderWindows(configs.lr);
      const lw = lr.windows[s];
      if (lw) out['ladder-and-ratchet'] = { secured: lw.secured, survived: lw.survived, terminal: lw.terminal, sleeveAtLadderEnd: lw.sleeveAtLadderEnd };
    }
    if (configs.ff) {
      const ff = runFlexWindows(configs.ff);
      const fw = ff.windows[s];
      if (fw) out['floor-and-flex'] = { worstYearFlex: fw.worstYearD, terminal: fw.terminal };
    }
  }
  return out;
}
