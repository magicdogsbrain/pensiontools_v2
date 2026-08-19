/**
 * Household Service — the couples view (Tier 4 v1, Aug 2026).
 *
 * DESIGN: UK pensions and tax are strictly individual, so the ENGINES stay per-person — a
 * household is two per-person plans presented together (the same architecture Guiide chose,
 * and the documented DIY workaround on the MSE forums). What two separate plans cannot answer
 * is "can WE afford to retire, together?" — that is this module's job.
 *
 * The joint success rate runs BOTH plans on the SAME Monte-Carlo market paths (both partners
 * hold the same equity market — failures correlate). Summing or multiplying two independent
 * success rates misstates joint risk; the paired-path P(both survive) is the honest number.
 * Idiosyncratic noise inside each simulation gets a DIFFERENT seed per partner (same market,
 * different funds).
 */

import { simulate, monteCarloReturns } from './SimulationEngine.js';
import { spendingSmileFactor } from './SpendingModel.js';
import { spSimConfigFromSettings } from '../utils/StatePensionUtils.js';

/**
 * Paired-path Monte Carlo across two plan configs.
 * @returns {{runs, jointSuccess, successA, successB, independenceAssumed,
 *            potFan: Array<{year, p10, p50, p90}>}}  pot fan = household wealth (pots + ISA,
 *            today's money); a finished shorter plan carries its final value flat.
 */
export function runHouseholdMonteCarlo(configA, configB, runs = 1000) {
  const yearsMax = Math.max(configA.years, configB.years);
  let both = 0, okA = 0, okB = 0;
  const perYear = Array.from({ length: yearsMax + 1 }, () => []);

  for (let i = 0; i < runs; i++) {
    const returns = monteCarloReturns({ years: yearsMax }, i);
    // Same yearly market path; different in-sim seeds so idiosyncratic residuals differ.
    const ra = simulate(configA, returns, i);
    const rb = simulate(configB, returns, i + 500000);
    if (!ra.failed) okA++;
    if (!rb.failed) okB++;
    if (!ra.failed && !rb.failed) both++;

    const wealthAt = (r, y) => {
      const len = (r.potByYear || []).length;
      const idx = Math.min(y, len - 1);
      const pot = (r.potByYear && r.potByYear[idx] != null) ? r.potByYear[idx] : 0;
      const isa = (r.isaByYear && r.isaByYear[idx] != null) ? r.isaByYear[idx] : 0;
      return pot + isa;
    };
    for (let y = 0; y <= yearsMax; y++) perYear[y].push(wealthAt(ra, y) + wealthAt(rb, y));
  }

  const pct = (arr, p) => {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
  };
  const potFan = perYear.map((vals, year) => ({
    year, p10: pct(vals, 0.10), p50: pct(vals, 0.50), p90: pct(vals, 0.90)
  }));

  return {
    runs,
    jointSuccess: both / runs,
    successA: okA / runs,
    successB: okB / runs,
    independenceAssumed: (okA / runs) * (okB / runs), // what naive multiplication would claim
    potFan
  };
}

/** Per-person yearly gross target (today's money): schedule/baseSalary × spending profile. */
function targetForYear(settings, year) {
  const anchor = Array.isArray(settings.targetSchedule) && settings.targetSchedule[year] != null
    ? settings.targetSchedule[year]
    : (settings.baseSalary || 0);
  return anchor * spendingSmileFactor(year, settings.spendingProfile || 'flat');
}

/** State Pension start year + annual amount (today's money) from either settings format. */
function spFor(settings) {
  const cfg = spSimConfigFromSettings(settings);
  if (cfg) return { startYear: cfg.spStartYear, annual: cfg.spWeeklyAmount * 52 };
  if (settings.statePensionYear != null && settings.statePension > 0) {
    return { startYear: settings.statePensionYear, annual: settings.statePension };
  }
  return { startYear: Infinity, annual: 0 };
}

/**
 * Deterministic household income timeline (today's money, gross-equivalent): what the household
 * needs each year, what is guaranteed (two State Pensions, DB floors, other income), and what
 * must come from the pots — with the bridge years (before both SPs are in payment) flagged.
 * @returns {Array<{year, needA, needB, need, spA, spB, db, other, guaranteed, drawNeed, bridge}>}
 */
export function householdIncomeTimeline(setA, setB, labelYears = null) {
  const durA = setA.duration || 35;
  const durB = setB.duration || 35;
  const years = labelYears ?? Math.max(durA, durB);
  const a = spFor(setA), b = spFor(setB);
  const rows = [];
  for (let y = 0; y <= years; y++) {
    const needA = y <= durA ? targetForYear(setA, y) : 0;
    const needB = y <= durB ? targetForYear(setB, y) : 0;
    const spA = y >= a.startYear ? a.annual : 0;
    const spB = y >= b.startYear ? b.annual : 0;
    const db = (setA.dbAmount > 0 && y >= (setA.dbStartYear || 0) ? setA.dbAmount : 0)
             + (setB.dbAmount > 0 && y >= (setB.dbStartYear || 0) ? setB.dbAmount : 0);
    const other = (setA.other || 0) + (setB.other || 0);
    const need = needA + needB;
    const guaranteed = spA + spB + db + other;
    rows.push({
      year: y, needA, needB, need, spA, spB, db, other, guaranteed,
      drawNeed: Math.max(0, need - guaranteed),
      bridge: (a.annual > 0 && y < a.startYear) || (b.annual > 0 && y < b.startYear)
    });
  }
  return rows;
}
