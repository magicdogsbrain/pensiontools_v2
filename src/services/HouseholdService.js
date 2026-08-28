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

import { getStrategy } from '../strategies/registry.js';
// Phase B: the household view runs each plan's OWN locked strategy from the registry.
// The household check joins two P&V-shaped simulation configs; ladder/floor strategies have no
// monteCarloReturns/simulate API, so always run the Pots & Valves engine here (the caller says so).
const eng = () => getStrategy('pots-and-valves').engine;
import { planDrawdown } from './DrawdownStrategy.js';
import { spendingSmileFactor } from './SpendingModel.js';
import { spSimConfigFromSettings, currentAgeNow } from '../utils/StatePensionUtils.js';
import { defaultSpYear } from '../services/IncomeSchedule.js';

/**
 * Paired-path Monte Carlo across two plan configs.
 * @returns {{runs, jointSuccess, successA, successB, independenceAssumed,
 *            potFan: Array<{year, p10, p50, p90}>}}  pot fan = household wealth (pots + ISA,
 *            today's money); a finished shorter plan carries its final value flat.
 */
export function runHouseholdMonteCarlo(configA, configB, runs = 1000, offsets = { a: 0, b: 0 }) {
  // Calendar alignment: each plan's year 0 is ITS OWN income start. A partner still working
  // starts `offset` calendar years later, so their plan runs on the market path shifted by that
  // much — the same calendar year sees the same market for both, which is the whole point.
  const offA = Math.max(0, Math.round(offsets?.a || 0));
  const offB = Math.max(0, Math.round(offsets?.b || 0));
  const yearsMax = Math.max(configA.years + offA, configB.years + offB);
  let both = 0, okA = 0, okB = 0;
  const perYear = Array.from({ length: yearsMax + 1 }, () => []);
  const shifted = (returns, off) => {
    if (!off) return returns;
    const out = { equity: {}, inflation: {} };
    for (const k of Object.keys(returns.equity)) {
      const y = Number(k) - off;
      if (y >= 0) { out.equity[y] = returns.equity[k]; out.inflation[y] = returns.inflation[k]; }
    }
    return out;
  };

  for (let i = 0; i < runs; i++) {
    const returns = eng(configA).monteCarloReturns({ years: yearsMax }, i);
    // Same yearly market path; different in-sim seeds so idiosyncratic residuals differ.
    const ra = eng(configA).simulate(configA, shifted(returns, offA), i);
    const rb = eng(configB).simulate(configB, shifted(returns, offB), i + 500000);
    if (!ra.failed) okA++;
    if (!rb.failed) okB++;
    if (!ra.failed && !rb.failed) both++;

    // Wealth in calendar year c: a plan not yet started holds its opening pot (still working).
    const wealthAt = (r, cfg, c, off) => {
      const y = c - off;
      const opening = (cfg.equityStart || 0) + (cfg.bondStart || 0) + (cfg.cashStart || 0) + (cfg.diversifierStart || 0) + (cfg.isaBalance || 0);
      if (y < 0) return opening;
      const len = (r.potByYear || []).length;
      const idx = Math.min(y, len - 1);
      const pot = (r.potByYear && r.potByYear[idx] != null) ? r.potByYear[idx] : 0;
      const isa = (r.isaByYear && r.isaByYear[idx] != null) ? r.isaByYear[idx] : 0;
      return pot + isa;
    };
    for (let c = 0; c <= yearsMax; c++) perYear[c].push(wealthAt(ra, configA, c, offA) + wealthAt(rb, configB, c, offB));
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
  if (settings.statePension > 0) {
    // Same fallback as the simulation config: no SP date => 67 − income-start age.
    return { startYear: defaultSpYear(settings), annual: settings.statePension };
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
  const offA = startOffset(setA), offB = startOffset(setB);
  const years = labelYears ?? Math.max(durA + offA, durB + offB);
  const a = spFor(setA), b = spFor(setB);
  const rows = [];
  // `year` is CALENDAR years from today; each plan's own year is that less its start offset.
  for (let c = 0; c <= years; c++) {
    const yA = c - offA, yB = c - offB;
    const workingA = yA < 0, workingB = yB < 0;
    const needA = (!workingA && yA <= durA) ? targetForYear(setA, yA) : 0;
    const needB = (!workingB && yB <= durB) ? targetForYear(setB, yB) : 0;
    const spA = (!workingA && yA >= a.startYear) ? a.annual : 0;
    const spB = (!workingB && yB >= b.startYear) ? b.annual : 0;
    const db = (setA.dbAmount > 0 && yA >= (setA.dbStartYear || 0) ? setA.dbAmount : 0)
             + (setB.dbAmount > 0 && yB >= (setB.dbStartYear || 0) ? setB.dbAmount : 0);
    const other = (!workingA ? (setA.other || 0) : 0) + (!workingB ? (setB.other || 0) : 0);
    const need = needA + needB;
    const guaranteed = spA + spB + db + other;
    rows.push({
      year: c, needA, needB, need, spA, spB, db, other, guaranteed, workingA, workingB,
      drawNeed: Math.max(0, need - guaranteed),
      bridge: (!workingA && a.annual > 0 && yA < a.startYear) || (!workingB && b.annual > 0 && yB < b.startYear)
    });
  }
  return rows;
}

/** Calendar years until this plan's income starts (0 for someone already retired). */
export function startOffset(settings) {
  const now = currentAgeNow(settings), start = +settings.shapeAgeNow || 0;
  return (now > 0 && start > now) ? Math.round(start - now) : 0;
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
    const r = eng(deceasedCfg).simulate(deceasedCfg, eng(deceasedCfg).monteCarloReturns({ years: horizon }, i), i + 900000);
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
    if (!eng(cfg).simulate(cfg, eng(cfg).monteCarloReturns({ years: cfg.years }, i), i + 700000).failed) ok++;
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
  // Year-0 taxable position from the REAL withdrawal policy (planDrawdown): the SIPP fills to
  // the basic-rate limit and the ISA tops up the rest tax-free, so a large-ISA plan with a
  // big target still pays no 40% tax — the old naive "target − fixed = taxable" version
  // claimed higher-rate tax that was never actually paid.
  const pos = (set) => {
    const sp = spFor(set);
    const fixed = (sp.startYear <= 0 ? sp.annual : 0) + (set.other || 0)
      + (set.dbAmount > 0 && (set.dbStartYear || 0) <= 0 ? set.dbAmount : 0);
    const target = targetForYear(set, 0);
    const f = (set.accessMethod === 'ufpls' && (!set.ufplsYears || set.ufplsYears > 0)) ? 0.25 : 0;
    const plan = planDrawdown({
      targetGross: target,
      fixedIncome: fixed,
      pa: set.pa ?? 12570,
      brl: set.brl ?? 50270,
      hrl: set.hrl ?? 125140,
      isaBalance: set.isaBalance || 0,
      strategy: set.isaDrawdownStrategy,
      yearsUntilSp: 0,
      taxFreeFraction: f
    });
    return { taxable: plan.taxable, target, brl: set.brl ?? 50270 };
  };
  const a = pos(setA), b = pos(setB);
  const unusedA = Math.max(0, a.brl - a.taxable);
  const unusedB = Math.max(0, b.brl - b.taxable);
  const overA = Math.max(0, a.taxable - a.brl);
  const overB = Math.max(0, b.taxable - b.brl);
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

/**
 * Long-term-care one-shot stress: "if one of you needs care from year N for M years at £X/yr
 * (today's money), while the other keeps living normally — do the plans hold?"
 * Deliberately conservative: the care cost is ADDED to that person's plan in full (no offset
 * for reduced normal spending), and we model the COST only — never local-authority
 * means-testing, which is benefits advice. Runs both plans on the same market paths and
 * reports the joint result next to the no-care baseline.
 */
export function runCareCheck({ cfgA, cfgB, setA, setB, who = 'A', startYear = 10, years = 3, annualCost = 90000, runs = 500 }) {
  const bake = (set, addCare) => {
    const dur = set.duration || 35;
    const schedule = [];
    for (let y = 0; y <= dur; y++) {
      let t = targetForYear(set, y);
      if (addCare && y >= startYear && y < startYear + years) t += annualCost;
      schedule.push(t);
    }
    return schedule;
  };
  const mk = (cfg, set, addCare) => ({ ...cfg, targetSchedule: bake(set, addCare), spendingProfile: 'flat' });

  const run = (a, b) => {
    const yearsMax = Math.max(a.years, b.years);
    let both = 0;
    for (let i = 0; i < runs; i++) {
      const returns = eng(a).monteCarloReturns({ years: yearsMax }, i);
      const ra = eng(a).simulate(a, returns, i);
      const rb = eng(b).simulate(b, returns, i + 500000);
      if (!ra.failed && !rb.failed) both++;
    }
    return both / runs;
  };

  const baseA = mk(cfgA, setA, false), baseB = mk(cfgB, setB, false);
  const careA = mk(cfgA, setA, who === 'A'), careB = mk(cfgB, setB, who === 'B');
  return {
    baselineJoint: run(baseA, baseB),
    careJoint: run(careA, careB),
    totalCareCost: annualCost * years
  };
}


/**
 * Household check with each partner on their OWN strategy. Every engine draws future i from the
 * same seeded market (seed i·7919+3), so partner A's future i and partner B's future i are the same
 * markets and "both survive" is read off the paired survival arrays. Wealth is summed from the
 * evenly spaced sample of futures each strategy exposes (the same indices for both when the run
 * counts match). A working partner's later start is NOT year-shifted here (the contract engines
 * generate their own paths) — the caller states that caveat.
 * @param {object} rA - stressTestStrategy result for partner A (needs survivedMc, samples.wealth)
 * @param {object} rB - same for partner B
 */
export function combineHouseholdStrategies(rA, rB) {
  const sa = rA.survivedMc || [true], sb = rB.survivedMc || [true];
  // A deterministic plan (one "future", e.g. the full gilt ladder) is broadcast across the other's futures.
  const bc = (arr, i) => (arr.length === 1 ? arr[0] : arr[i]);
  const n = (sa.length === 1 || sb.length === 1) ? Math.max(sa.length, sb.length) : Math.min(sa.length, sb.length);
  let both = 0, okA = 0, okB = 0;
  for (let i = 0; i < n; i++) { const a = !!bc(sa, i), b = !!bc(sb, i); if (a) okA++; if (b) okB++; if (a && b) both++; }
  const wa = (rA.samples && rA.samples.wealth && rA.samples.wealth.length) ? rA.samples.wealth : [rA.cones.wealth.p50];
  const wb = (rB.samples && rB.samples.wealth && rB.samples.wealth.length) ? rB.samples.wealth : [rB.cones.wealth.p50];
  const m = (wa.length === 1 || wb.length === 1) ? Math.max(wa.length, wb.length) : Math.min(wa.length, wb.length);
  const years = Math.max(wa[0] ? wa[0].length : 0, wb[0] ? wb[0].length : 0);
  const pct = (arr, q) => { const s2 = [...arr].sort((x, y) => x - y); return s2[Math.min(s2.length - 1, Math.floor(q * s2.length))]; };
  const potFan = [];
  for (let y = 0; y < years; y++) {
    const vals = [];
    for (let i = 0; i < m; i++) { const a = bc(wa, i) || [], b = bc(wb, i) || []; vals.push((a[Math.min(y, a.length - 1)] || 0) + (b[Math.min(y, b.length - 1)] || 0)); }
    potFan.push({ year: y, p10: pct(vals, 0.10), p50: pct(vals, 0.50), p90: pct(vals, 0.90) });
  }
  return { runs: n, jointSuccess: n ? both / n : 0, successA: n ? okA / n : 0, successB: n ? okB / n : 0, independenceAssumed: n ? (okA / n) * (okB / n) : 0, potFan, sampleFutures: m, byStrategy: true };
}
