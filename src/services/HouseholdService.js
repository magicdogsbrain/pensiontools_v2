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

/**
 * Survivor one-shot stress: "if one of you dies in year N, is the survivor still OK?"
 * No free UK tool offers this. Mechanics — everything reuses the standard engine:
 *  1. The deceased's REMAINING wealth at year N is taken from their own Monte Carlo
 *     (median pots + ISA at that year — their genuinely simulated depletion, not a guess),
 *     converted to nominal at 2.5%/yr, and injected into the survivor's simulation as a
 *     windfall at year N (pension pots pass tax-free before 75; ISA via APS — simplified
 *     to a like-for-like transfer, noted in the UI).
 *  2. The survivor's spending steps at year N from their own share to a fraction of the
 *     former HOUSEHOLD spending (default 70% — two can live cheaper than twice one).
 *  3. The deceased's DB pension continues at its survivor rate via extraIncomes.
 * Then one standard Monte Carlo of the survivor's modified plan.
 */
export function runSurvivorCheck({
  survivorCfg, survivorSettings, deceasedCfg, deceasedSettings,
  deathYear, spendFraction = 0.7, dbSurvivorPct = 0.5, runs = 500
}) {
  // Deceased's median remaining wealth at the year of death (today's money → nominal)
  const potVals = [], isaVals = [];
  const horizon = Math.max(deathYear + 1, deceasedCfg.years);
  for (let i = 0; i < runs; i++) {
    const r = simulate(deceasedCfg, monteCarloReturns({ years: horizon }, i), i + 900000);
    const idx = Math.min(deathYear, (r.potByYear || []).length - 1);
    potVals.push((r.potByYear && r.potByYear[idx]) || 0);
    isaVals.push((r.isaByYear && r.isaByYear[idx]) || 0);
  }
  const median = (a) => { const s2 = [...a].sort((x, y) => x - y); return s2[Math.floor(s2.length / 2)]; };
  const toNominal = Math.pow(1.025, deathYear);
  const inheritedPots = median(potVals) * toNominal;
  const inheritedIsa = median(isaVals) * toNominal;

  // Survivor spending: their own plan until year N, then a fraction of the joint spending.
  // The spending profile is BAKED into this schedule, so the constructed config runs 'flat'
  // (otherwise the engine would apply the profile twice).
  const dur = survivorSettings.duration || 35;
  const durDeceased = deceasedSettings.duration || 35;
  const schedule = [];
  for (let y = 0; y <= dur; y++) {
    const own = targetForYear(survivorSettings, y);
    if (y < deathYear) schedule.push(own);
    else schedule.push((own + (y <= durDeceased ? targetForYear(deceasedSettings, y) : 0)) * spendFraction);
  }

  const extraIncomes = [...(survivorCfg.extraIncomes || [])];
  if (deceasedSettings.dbAmount > 0 && dbSurvivorPct > 0) {
    extraIncomes.push({
      startYear: Math.max(deathYear, deceasedSettings.dbStartYear || 0),
      annual: deceasedSettings.dbAmount * dbSurvivorPct,
      indexation: deceasedSettings.dbIndexation || 'lpi5'
    });
  }

  const cfg = {
    ...survivorCfg,
    targetSchedule: schedule,
    spendingProfile: 'flat',
    windfalls: [
      ...(survivorCfg.windfalls || []),
      { year: deathYear, amount: inheritedPots },
      { year: deathYear, amount: inheritedIsa, toIsa: true }
    ].filter((w) => w.amount > 0),
    extraIncomes
  };

  let ok = 0;
  for (let i = 0; i < runs; i++) {
    if (!simulate(cfg, monteCarloReturns({ years: cfg.years }, i), i + 700000).failed) ok++;
  }
  return {
    survivorSuccess: ok / runs,
    inheritedPots,
    inheritedIsa,
    survivorAnnualAfter: schedule[Math.min(deathYear, dur)]
  };
}

/**
 * Allowance-filling nudge: each plan's year-0 taxable position vs its basic-rate limit.
 * Display-only — "you choose, we model": if one partner pays 40% while the other has unused
 * 20% band, shifting who funds spending saves the rate difference on the shifted slice.
 */
export function allowanceNudge(setA, setB, nameA = 'You', nameB = 'Partner') {
  const brl = 50270;
  const pos = (set) => {
    const sp = spFor(set);
    const fixed = (sp.startYear <= 0 ? sp.annual : 0) + (set.other || 0)
      + (set.dbAmount > 0 && (set.dbStartYear || 0) <= 0 ? set.dbAmount : 0);
    const target = targetForYear(set, 0);
    const f = set.accessMethod === 'ufpls' ? 0.25 : 0;
    // Approximate taxable position: fixed income + the taxable share of the SIPP draw
    const sippGross = Math.max(0, target - fixed);
    return { taxable: fixed + sippGross * (1 - f), target };
  };
  const a = pos(setA), b = pos(setB);
  const unusedA = Math.max(0, brl - a.taxable);
  const unusedB = Math.max(0, brl - b.taxable);
  const overA = Math.max(0, a.taxable - brl);
  const overB = Math.max(0, b.taxable - brl);
  let message = null;
  if (overA > 0 && unusedB > 1000) {
    const shift = Math.min(overA, unusedB);
    message = nameA + ' pays 40% tax on about £' + Math.round(overA).toLocaleString() + '/yr while ' + nameB
      + ' has £' + Math.round(unusedB).toLocaleString() + ' of unused 20% band. Funding £' + Math.round(shift).toLocaleString()
      + ' more of the spending from ' + nameB + '’s pots could save ~£' + Math.round(shift * 0.2).toLocaleString() + '/yr.';
  } else if (overB > 0 && unusedA > 1000) {
    const shift = Math.min(overB, unusedA);
    message = nameB + ' pays 40% tax on about £' + Math.round(overB).toLocaleString() + '/yr while ' + nameA
      + ' has £' + Math.round(unusedA).toLocaleString() + ' of unused 20% band. Funding £' + Math.round(shift).toLocaleString()
      + ' more of the spending from ' + nameA + '’s pots could save ~£' + Math.round(shift * 0.2).toLocaleString() + '/yr.';
  }
  return { unusedA, unusedB, overA, overB, message };
}
