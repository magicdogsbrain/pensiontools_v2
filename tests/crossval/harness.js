/**
 * Cross-validation harness: replay a Stress-Tester Monte-Carlo trajectory month-by-month
 * through the Decision engine and compare, Firebase-free.
 *
 * Why this works: since build 3b/3c both engines draw through the SAME DrawdownStrategy
 * (planDrawdown). This harness drives the *actual* Decision engine (calcDecisionPWA) over a
 * real trajectory and checks it lands on the same monthly SIPP+ISA draw the Stress sim made.
 * Any divergence therefore comes only from how each engine *prepares* its inputs
 * (tax-year config vs sim config, cumInf-from-cpi vs cumInf-from-returns) or from the
 * protection/boost overlays — which is exactly what we want to surface.
 *
 * Alignment: trajectories start in April 2026 so a sim year (floor(month/12)) coincides with
 * a UK tax year (6-April boundary), making sim `year` == decision `yearNum`. We set each tax
 * year's cpi = the trajectory's inflation so cumInf matches the sim exactly, confirmedSalary =
 * baseSalary (decision then recomputes the same inflated target), and bake the sim's inflated
 * tax bands / other income / State Pension into the per-year config.
 */

import { simulateTraced, monteCarloReturns } from '../../src/services/SimulationEngine.js';
import { calcDecisionPWA, getTaxYearFromDate } from '../../src/services/legacyDecision.js';

/** "YYYY-MM" for sim month m, counting from April 2026 (month 0). */
export function aprilDate(m) {
  const idx = 3 + m; // March=2, April=3 (0-based month index)
  const year = 2026 + Math.floor(idx / 12);
  const month = (idx % 12) + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

/**
 * Build Decision-engine deps (settings + allTaxYears) that reproduce the sim's world.
 * @param {object} config - the stress simulation config
 * @param {object[]} trace - per-month trace from simulateTraced
 * @param {object} returns - the trajectory's yearly returns (for cpi = inflation)
 */
export function buildDecisionContext(config, trace, returns) {
  // One config per sim year, taken from that year's first trace row (planInputs are constant
  // within a year). Keyed by the same "26/27" string the engine derives from the date.
  const allTaxYears = {};
  const firstRowOfYear = new Map();
  for (const row of trace) {
    if (!firstRowOfYear.has(row.year)) firstRowOfYear.set(row.year, row);
  }
  for (const [year, row] of firstRowOfYear) {
    const key = getTaxYearFromDate(aprilDate(year * 12));
    const pi = row.planInputs;
    allTaxYears[key] = {
      // cpi = trajectory inflation for the *next* index so decision cumInf matches the sim's
      // (sim multiplies inf[1..Y]; decision multiplies cpi[year 0..Y-1]).
      cpi: returns.inflation[year + 1] ?? 0.025,
      // No confirmedSalary: the decision engine's UNCONFIRMED fallback (baseSalary × cumInf)
      // mirrors the Stress engine's baseSalary × cumInf exactly. (Wizard-confirmed salaries are
      // nominal-for-their-year since the double-uplift fix; setting one here would freeze the
      // target and break parity by design, not by bug.)
      confirmedSalary: null,
      pa: pi.pa, brl: pi.brl, hrl: pi.hrl, // sim's inflated bands baked in (decision uses static)
      other: pi.other,                     // sim's other income for the year
      isTaxEfficient: true
    };
  }

  const settings = {
    baseSalary: config.baseSalary,
    equityMin: config.equityMin, bondMin: config.bondMin, cashTarget: config.cashTarget,
    duration: config.duration,
    isaDrawdownStrategy: config.isaDrawdownStrategy,
    protectionFactor: Math.round((1 - (config.protectionMult ?? 0.8)) * 100),
    recoveryBuffer: config.recoveryBuffer ?? 10000,
    consecutiveLimit: config.consecutiveLimit ?? 3
  };

  return { settings, allTaxYears };
}

/**
 * Stateless replay (v1): drive the Decision engine per month with the sim's start-of-month
 * fund values and ISA balance, empty history (so protection never fires on either side —
 * the sim uses disableProtection). Isolates the pure drawdown math: SIPP + ISA to target.
 * @returns {Promise<{rows: object[], failed: boolean, months: number}>}
 */
export async function replayStateless(config, seed) {
  const simConfig = { ...config, disableProtection: true };
  const returns = monteCarloReturns(simConfig, seed);
  const sim = simulateTraced(simConfig, seed);
  const { settings, allTaxYears } = buildDecisionContext(simConfig, sim.trace, returns);

  const rows = [];
  for (const t of sim.trace) {
    const dateStr = aprilDate(t.month);
    const spAmount = t.planInputs.statePension;
    const dec = await calcDecisionPWA(dateStr, t.equityStart, t.bondStart, t.cashStart, {
      settings,
      history: [], // stateless: no protection, no YTD accumulation
      allTaxYears,
      spInfo: { amount: spAmount },
      isaBalance: t.isaStart
    });
    rows.push({
      month: t.month, date: dateStr,
      simSipp: t.sippMonthly, decSipp: dec.sippDraw,
      simIsa: t.isaMonthly, decIsa: dec.isaDraw,
      dSipp: dec.sippDraw - t.sippMonthly,
      dIsa: dec.isaDraw - t.isaMonthly,
      isaBalance: t.isaStart
    });
  }
  return { rows, failed: sim.failed, months: sim.trace.length, final: sim.final };
}

/**
 * Stateful replay (v2): the full picture the user asked for. Protection stays ON. Each month
 * we feed the Decision engine the sim's own start-of-month fund values (per "use the sim's own
 * monthly path") plus the Decision history accumulated so far, record its recommendation as a
 * history entry, and build up the tax-year configs — so `history` and `taxYears` come out
 * exactly as the Decision Tool would show them. We compare the Decision engine's *effective*
 * draw (after its protection/boost overlay) to the sim's effective draw. Divergences localize
 * where the two protection/boost implementations differ — nothing to do with the shared
 * drawdown math (v1 proves that agrees to the penny).
 * @returns {Promise<{rows, history, taxYears, failed, months, final}>}
 */
export async function replayStateful(config, seed) {
  const returns = monteCarloReturns(config, seed);
  const sim = simulateTraced(config, seed);
  const { settings, allTaxYears } = buildDecisionContext(config, sim.trace, returns);

  const history = [];
  const rows = [];
  for (const t of sim.trace) {
    const dateStr = aprilDate(t.month);
    const dec = await calcDecisionPWA(dateStr, t.equityStart, t.bondStart, t.cashStart, {
      settings,
      history,          // stateful: protection/boost/YTD see prior months
      allTaxYears,
      spInfo: { amount: t.planInputs.statePension },
      isaBalance: t.isaStart
    });
    // Append a history entry in the shape the Decision engine reads back.
    history.push({
      date: dateStr, taxYear: dec.taxYear, source: dec.source,
      inProtection: dec.inProtection, sipp: dec.sippDraw, stdSipp: dec.stdSipp,
      isa: dec.isaDraw, boostAmount: dec.boostAmount
    });
    rows.push({
      month: t.month, date: dateStr,
      simSipp: t.effectiveSipp, decSipp: dec.sippDraw,
      simIsa: t.effectiveIsa, decIsa: dec.isaDraw,
      dSipp: dec.sippDraw - t.effectiveSipp,
      dIsa: dec.isaDraw - t.effectiveIsa,
      simProt: t.inProtection, decProt: dec.inProtection,
      simBoost: t.boostAmount || 0, decBoost: dec.boostAmount || 0,
      isaBalance: t.isaStart
    });
  }
  return { rows, history, taxYears: allTaxYears, failed: sim.failed, months: sim.trace.length, final: sim.final };
}

/** Aggregate divergence stats across many seeds' rows. */
export function summarize(allRows) {
  let maxDSipp = 0, maxDIsa = 0, worst = null;
  let sumAbsSipp = 0, sumAbsIsa = 0, n = 0;
  let nonFiniteRows = 0;
  for (const r of allRows) {
    if (!Number.isFinite(r.decSipp) || !Number.isFinite(r.decIsa)) { nonFiniteRows++; continue; }
    const aS = Math.abs(r.dSipp), aI = Math.abs(r.dIsa);
    sumAbsSipp += aS; sumAbsIsa += aI; n++;
    if (aS > maxDSipp) maxDSipp = aS;
    if (aI > maxDIsa) maxDIsa = aI;
    const worstMag = Math.max(aS, aI);
    if (!worst || worstMag > worst.mag) worst = { ...r, mag: worstMag };
  }
  return {
    rows: allRows.length, compared: n, nonFiniteRows,
    maxAbsSippDivergence: maxDSipp, maxAbsIsaDivergence: maxDIsa,
    meanAbsSippDivergence: n ? sumAbsSipp / n : 0,
    meanAbsIsaDivergence: n ? sumAbsIsa / n : 0,
    worst
  };
}
