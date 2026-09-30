/**
 * The fast path for the answer's engine runs (question C's band search).
 *
 * Today's engine (services/SimulationEngine.js simulate) is run thousands of times per answer: one run per
 * future per amount tried. Most of each run is spent on things that do not depend on the amount — the bond
 * model's random draws (five a month, the same stream for every run of a future), the month's growth factors,
 * the year's inflated floors and tax bands, the tax sum for a target that does not change within a year. This
 * module does exactly what `simulate` does for the ONE config shape the adapter builds (toEngine.js:
 * pots-and-valves, protection off, no glidepath tent, no windfalls, no taxable sleeve, no HODL, no diversifiers),
 * with everything the amount does not touch worked out once per future and shared between the runs.
 *
 * It is a replica, not a re-modelling: every figure is produced by the same arithmetic in the same order, so
 * the month a future runs out is the month `simulate` would give — bit for bit. tests/v7/c/speed.identity.test.js
 * runs the two side by side on random households and every fixture, and the reference solver (bandReference.js)
 * keeps the old path alive for that test. If `simulate` ever changes in a way this file does not follow, that
 * test fails; nothing here changes the engine itself.
 *
 * A config the replica does not cover (fastEligible false) is run by `simulate` as before.
 *
 *   createFastRunner(plan, futures) → { run(r, i, config, needMonth?) → { failed, failMonth }, eligible }
 */
import { seededRng, gaussianRandom } from '../../utils/MathUtils.js';
import { simulate } from '../../services/SimulationEngine.js';
import { calculateGlidepath } from '../../services/GlidepathService.js';
import { planDrawdown } from '../../services/DrawdownStrategy.js';
import { SOURCING_DEFAULTS } from '../../services/WithdrawalSourcing.js';
import { spendingSmileFactor } from '../../services/SpendingModel.js';
import { ISA_DEFAULTS } from '../../constants.js';

const CASH_REAL_SPREAD = -0.01;           // SimulationEngine.CASH_REAL_SPREAD
const LSA = 268275;                       // the UFPLS lifetime Lump Sum Allowance the engine starts from
const DEFAULT_HRL = 125140;

/** SimulationEngine.cashNominalReturn, as written there. */
function cashNominalReturn(prevInflation) {
  return Math.max(0, prevInflation + CASH_REAL_SPREAD);
}

/** SimulationEngine.calculateBondReturn, as written there (it is not exported). */
function calculateBondReturn(inf, eqReturn, prevInf, rng) {
  let linkerWeight = 0.15;
  let nomBondWeight = 0.30;
  let propertyWeight = 0.20;
  let commodityWeight = 0.10;
  let cashWeight = 0.10;
  let equityWeight = 0.15;

  const laggedInf = prevInf !== undefined ? prevInf : inf;
  const highInflation = laggedInf > 0.045;
  const veryHighInflation = laggedInf > 0.07;

  if (highInflation) {
    const reactionQuality = rng() > 0.30 ? 1.0 : 0.5;
    if (veryHighInflation) {
      linkerWeight = 0.15 + (0.35 * reactionQuality);
      nomBondWeight = 0.30 - (0.20 * reactionQuality);
      equityWeight = 0.15 - (0.10 * reactionQuality);
      commodityWeight = 0.10 + (0.05 * reactionQuality);
    } else {
      linkerWeight = 0.15 + (0.20 * reactionQuality);
      nomBondWeight = 0.30 - (0.10 * reactionQuality);
      equityWeight = 0.15 - (0.05 * reactionQuality);
    }
  }

  if (highInflation && rng() < 0.15) {
    linkerWeight = 0.20;
    nomBondWeight = 0.25;
    equityWeight = 0.12;
  }

  const linkerReturn = inf + 0.005 + gaussianRandom(0, 0.03, rng);
  const nomBondReturn = 0.04 - (inf > 0.04 ? (inf - 0.04) * 0.5 : 0) + gaussianRandom(0, 0.05, rng);
  const propertyReturn = 0.03 + inf * 0.3 + gaussianRandom(0, 0.08, rng);
  const commodityReturn = inf * 0.8 + gaussianRandom(0, 0.15, rng);
  const cashReturn = cashNominalReturn(prevInf);
  const equityReturn = eqReturn * 0.5 + gaussianRandom(0, 0.02, rng);

  const bondReturn = linkerWeight * linkerReturn +
         nomBondWeight * nomBondReturn +
         propertyWeight * propertyReturn +
         commodityWeight * commodityReturn +
         cashWeight * cashReturn +
         equityWeight * equityReturn;

  const rho = equityBondRho(inf, eqReturn);
  const eqZ = (eqReturn - 0.10) / 0.17;
  return bondReturn + rho * eqZ * 0.055;
}

function equityBondRho(inf, eqReturn) {
  if (inf > 0.045) return 0.4;
  if (eqReturn < -0.15) return -0.3;
  return 0.1;
}

/** SimulationEngine's monthly factor from an annual return. */
const monthly = (r) => Math.pow(1 + (Number.isFinite(r) ? Math.max(-0.99, r) : -0.99), 1 / 12);

/**
 * WithdrawalSourcing.planSourcing for the shape here — no diversifiers, no HODL, never in protection — with
 * the same arithmetic in the same order, writing the four figures the pots need into `out` (no labels).
 * The cascade's order of the two sleeves is the stable sort of [bond, equity] by value over target, most
 * overweight first: equity before bond only when its ratio is strictly the larger.
 */
function sourceMonth(draw, equity, bond, cash, eqMin, bdMin, csTarget, out) {
  let remaining = draw;
  let fromEquity = 0, fromBond = 0, fromCash = 0, shortfall = 0, replenish = 0;
  const eqSurplus = Math.max(0, equity - eqMin);
  const bdSurplus = Math.max(0, bond - bdMin);
  const growthSurplus = eqSurplus + bdSurplus;
  if (growthSurplus > 0) {
    const fromGrowth = Math.min(remaining, growthSurplus);
    fromEquity = fromGrowth * eqSurplus / growthSurplus;
    fromBond = fromGrowth * bdSurplus / growthSurplus;
    remaining -= fromGrowth;
    if (remaining <= 1e-9) {
      const cashShortfall = csTarget - cash;
      const excess = growthSurplus - fromGrowth;
      if (cashShortfall > 0 && excess > SOURCING_DEFAULTS.REPLENISH_GATE) {
        replenish = Math.min(cashShortfall * SOURCING_DEFAULTS.REPLENISH_SHORTFALL_FRAC, excess * SOURCING_DEFAULTS.REPLENISH_SURPLUS_FRAC);
      }
      out.fromEquity = fromEquity; out.fromBond = fromBond; out.fromCash = fromCash; out.shortfall = shortfall; out.replenish = replenish;
      return;
    }
  }
  const takeCash = Math.min(remaining, cash);
  fromCash = takeCash;
  remaining -= takeCash;
  if (remaining > 1e-9) {
    const bondValue = Math.max(0, bond - fromBond), bondTarget = Math.max(1, bdMin);
    const equityValue = Math.max(0, equity - fromEquity), equityTarget = Math.max(1, eqMin);
    const equityFirst = bondValue > 0 && equityValue > 0 && (equityValue / equityTarget) - (bondValue / bondTarget) > 0;
    for (let pass = 0; pass < 2; pass++) {
      if (remaining <= 1e-9) break;
      const equityTurn = pass === 0 ? equityFirst : !equityFirst;
      if (equityTurn) {
        if (equityValue > 0) { const take = Math.min(remaining, equityValue); fromEquity += take; remaining -= take; }
      } else if (bondValue > 0) { const take = Math.min(remaining, bondValue); fromBond += take; remaining -= take; }
    }
    shortfall = Math.max(0, remaining);
  }
  out.fromEquity = fromEquity; out.fromBond = fromBond; out.fromCash = fromCash; out.shortfall = shortfall; out.replenish = replenish;
}

const isZero = (v) => v === 0 || v === undefined || v === null;
const emptyList = (v) => v === undefined || v === null || (Array.isArray(v) && v.length === 0);

/**
 * Whether a run's base config is exactly the shape this replica covers. Every field the engine reads is
 * checked, so a config that switches anything on falls back to `simulate`.
 */
export function fastEligible(c) {
  if (!c || typeof c !== 'object') return false;
  const finite = (v) => typeof v === 'number' && Number.isFinite(v);
  return finite(c.equityStart) && finite(c.bondStart) && finite(c.cashStart)
    && finite(c.equityMin) && finite(c.bondMin) && finite(c.cashTarget)
    && Number.isInteger(c.years) && c.years > 0 && c.duration === c.years
    && isZero(c.other) && (c.extraWithdrawals === undefined || emptyList(c.extraWithdrawals))
    && typeof c.spStartYear === 'number' && finite(c.spWeeklyAmount) && (c.spFirstYearRatio === undefined || finite(c.spFirstYearRatio))
    && finite(c.pa) && finite(c.brl) && (c.hrl === undefined || finite(c.hrl)) && c.taxMode === 'inflates'
    && c.disableProtection === true
    && !c.hodlEnabled && isZero(c.hodlStart)
    && isZero(c.diversifierStart) && c.subAsset === undefined && c.isaMix === undefined && c.isaReturn === undefined
    && c.isaDrawdownStrategy === undefined && ISA_DEFAULTS.DRAWDOWN_STRATEGY === 'minimiseEarlyTax' && (c.isaBalance === undefined || finite(c.isaBalance))
    && isZero(c.taxableStart) && emptyList(c.windfalls)
    && (c.accessMethod === 'ufpls' || c.accessMethod === 'drawdown') && !c.ufplsYears && !c.ufplsThenPcls && !c.bandFillRecycle
    && (c.dbAmount === undefined || finite(c.dbAmount)) && (!(c.dbAmount > 0) || c.dbIndexation === 'cpi')
    && (c.extraIncomes === undefined || (Array.isArray(c.extraIncomes) && c.extraIncomes.every((e) => e && e.indexation === 'cpi' && finite(e.annual) && (e.endYear === undefined || e.endYear === null))))
    && c.equityGlide === undefined && c.sourcingMode === undefined
    && (c.spendingProfile === undefined || c.spendingProfile === 'flat')
    && c.trace !== true;
}

/**
 * What a future gives every run of it, whatever the amount: the bond model's return each month (its random
 * stream is the engine's, seeded as the engine seeds it), the monthly growth factors, and the price level at
 * the start of each year, all worked out as the engine works them out.
 */
function prepareFuture(future, years) {
  const returns = future.returns;
  const months = years * 12;
  const rng = seededRng(future.seed);
  const cumInf = new Float64Array(years);
  const mEq = new Float64Array(years);
  const mCash = new Float64Array(years);
  const inf = new Float64Array(years);
  const eq = new Float64Array(years);
  const prevInf = new Float64Array(years);
  let c = 1;
  for (let y = 0; y < years; y++) {
    if (y > 0) { const infForYear = returns.inflation[y] || 0.025; c *= (1 + infForYear); }   // as the engine compounds it
    cumInf[y] = c;
    eq[y] = returns.equity[y] || 0;
    inf[y] = returns.inflation[y] || 0.025;
    prevInf[y] = y > 0 ? (returns.inflation[y - 1] || 0.025) : inf[y];
    mEq[y] = monthly(eq[y]);
    mCash[y] = monthly(cashNominalReturn(prevInf[y]));
  }
  // The bond model's months are drawn as a run first needs them (bondMonthsTo), a year at a time: a run that
  // ends early never pays for the years after it, and the stream is the engine's whatever the order of the runs.
  return { cumInf, mEq, mCash, inf, eq, prevInf, mBond: new Float64Array(months), bondMonths: 0, rng, months };
}

/** Draws the bond model up to and including month `m` (the engine draws it once a month, in month order). */
function bondMonthsTo(pf, m) {
  const upTo = Math.min(pf.months, (Math.floor(m / 12) + 1) * 12);
  for (let t = pf.bondMonths; t < upTo; t++) {
    const y = Math.floor(t / 12);
    pf.mBond[t] = monthly(calculateBondReturn(pf.inf[y], pf.eq[y], pf.prevInf[y], pf.rng));
  }
  pf.bondMonths = upTo;
}

/** The per-year figures of one run (base config) in one future: floors, bands, fixed incomes. */
function prepareRun(base, pf, years) {
  const eqMin = new Float64Array(years), bdMin = new Float64Array(years), csTarget = new Float64Array(years);
  const pa = new Float64Array(years), brl = new Float64Array(years), hrl = new Float64Array(years);
  const fixed = new Float64Array(years), sf = new Float64Array(years);
  const yearsUntilSp = new Int32Array(years);
  const hrlBase = base.hrl || DEFAULT_HRL;
  for (let year = 0; year < years; year++) {
    const cumInf = pf.cumInf[year];
    eqMin[year] = calculateGlidepath(base.equityMin, year, base.duration, cumInf, true);
    bdMin[year] = calculateGlidepath(base.bondMin, year, base.duration, cumInf, true);
    csTarget[year] = calculateGlidepath(base.cashTarget, year, base.duration, cumInf, false);
    pa[year] = base.pa * cumInf;
    brl[year] = base.brl * cumInf;
    hrl[year] = hrlBase * cumInf;
    sf[year] = spendingFactorOf(base, year);
    // calculateMonthlyDraw: other (0, capped inflation of nothing) + State Pension + final-salary pension + the rest
    const other = 0;
    let statePension = 0;
    if (year >= base.spStartYear && base.spWeeklyAmount > 0) {
      const spAnnual = base.spWeeklyAmount * 52;
      if (year === base.spStartYear && base.spFirstYearRatio !== undefined) statePension = spAnnual * base.spFirstYearRatio * cumInf;
      else statePension = spAnnual * cumInf;
    }
    let dbPension = 0;
    if (base.dbAmount > 0 && year >= (base.dbStartYear || 0)) dbPension = base.dbAmount * cumInf;
    let extraIncome = 0;
    for (const inc of base.extraIncomes || []) {
      if (inc.annual > 0 && year >= (inc.startYear || 0) && (inc.endYear == null || year <= inc.endYear)) extraIncome += inc.annual * cumInf;
    }
    fixed[year] = other + statePension + dbPension + extraIncome;
    yearsUntilSp[year] = Math.max(0, base.spStartYear - year);
  }
  return { eqMin, bdMin, csTarget, pa, brl, hrl, fixed, sf, yearsUntilSp };
}

/** The engine's spendingFactor: spendingSmileFactor(year, config.spendingProfile || 'flat'). */
function spendingFactorOf(base, year) {
  return spendingSmileFactor(year, base.spendingProfile || 'flat');
}

/**
 * One run: `simulate(config, future.returns, future.seed)` for the covered shape, month by month, stopping the
 * month the pots cannot pay (as the engine stops).
 * @returns {{ failed: boolean, failMonth: number|null, equity: number, bond: number, cash: number, isa: number }}
 */
function runFast(config, pf, pr) {
  const years = config.years;
  const months = years * 12;
  const schedule = Array.isArray(config.targetSchedule) ? config.targetSchedule : null;
  const ufpls = config.accessMethod === 'ufpls';
  const isaFactor = Math.pow(1 + (config.isaReturn ?? ISA_DEFAULTS.RETURN), 1 / 12);
  const strategy = config.isaDrawdownStrategy || ISA_DEFAULTS.DRAWDOWN_STRATEGY;

  let equity = config.equityStart;
  let bond = config.bondStart;
  let cash = config.cashStart;
  let isa = config.isaBalance || 0;
  let lsaRemaining = ufpls ? LSA : 0;
  let failed = false;
  let failMonth = null;

  // planDrawdown, remembered within a year: with the default ISA strategy (uncapped) its answer depends on the ISA
  // balance only through min(net gap, balance), so a balance at or above the remembered gap gives the same plan.
  let planYear = -1, planF = -1, planIsa = -1, plan = null;
  const sourcing = { fromEquity: 0, fromBond: 0, fromCash: 0, shortfall: 0, replenish: 0 };

  for (let month = 0; month < months; month++) {
    const year = (month / 12) | 0;
    const cumInf = pf.cumInf[year];
    const eqMin = pr.eqMin[year];
    const bdMin = pr.bdMin[year];
    const csTarget = pr.csTarget[year];

    // calculateMonthlyDraw
    const scheduledTarget = schedule && schedule[year] != null ? schedule[year] : config.baseSalary;
    const target = scheduledTarget * cumInf * pr.sf[year] + 0;
    const taxFreeFraction = (ufpls && lsaRemaining > 0) ? 0.25 : 0;
    if (!(year === planYear && taxFreeFraction === planF && (isa === planIsa || (plan.isaDraw < planIsa && isa >= plan.isaDraw)))) {
      plan = planDrawdown({
        targetGross: target,
        fixedIncome: pr.fixed[year],
        pa: pr.pa[year], brl: pr.brl[year], hrl: pr.hrl[year],
        isaBalance: isa,
        strategy,
        yearsUntilSp: pr.yearsUntilSp[year],
        taxFreeFraction
      });
      planYear = year; planF = taxFreeFraction; planIsa = isa;
    }
    const sippMonthly = plan.sippGross / 12;
    const isaMonthly = plan.isaDraw / 12;
    const taxFreeMonthly = (plan.taxFree || 0) / 12;
    const taxAnnual = plan.tax;

    const monthDraw = sippMonthly;
    const isaDrawThisMonth = Math.max(0, isaMonthly - 0);

    // this month's returns
    if (month >= pf.bondMonths) bondMonthsTo(pf, month);
    equity *= pf.mEq[year];
    bond *= pf.mBond[month];
    cash *= pf.mCash[year];
    if (isa > 0) isa = isa * isaFactor;

    if (!Number.isFinite(monthDraw)) {
      failed = true;
      failMonth = month;
      break;
    }

    sourceMonth(monthDraw, equity, bond, cash, eqMin, bdMin, csTarget, sourcing);
    equity -= sourcing.fromEquity;
    bond -= sourcing.fromBond;
    cash -= sourcing.fromCash;

    let isaRescue = 0;
    if (sourcing.shortfall > 1e-6 && isa > 0) {
      const grossYear = sippMonthly * 12;
      const netFactor = grossYear > 0 && taxAnnual > 0 ? Math.max(0.55, 1 - taxAnnual / grossYear) : 1;
      const netShort = sourcing.shortfall * netFactor;
      isaRescue = Math.min(isa, netShort);
      sourcing.shortfall = Math.max(0, sourcing.shortfall - isaRescue / netFactor);
    }
    if (sourcing.shortfall > 1e-6) {
      failed = true;
      failMonth = month;
    }
    if (sourcing.replenish > 0) {
      const eqS = Math.max(0, equity - eqMin), bdS = Math.max(0, bond - bdMin);
      const tot = eqS + bdS;
      if (tot > 0) {
        equity -= sourcing.replenish * eqS / tot;
        bond -= sourcing.replenish * bdS / tot;
        cash += sourcing.replenish;
      }
    }

    isa = Math.max(0, isa - Math.min(isaDrawThisMonth + isaRescue, isa)) + 0;
    if (lsaRemaining > 0) lsaRemaining = Math.max(0, lsaRemaining - (taxFreeMonthly || 0));

    equity = Math.max(0, equity);
    bond = Math.max(0, bond);
    cash = Math.max(0, cash);

    if (failed) break;
  }
  return { failed, failMonth, equity, bond, cash, isa };
}

/**
 * The runner for a plan's runs over a list of futures. `run(r, i, config)` runs plan.runs[r] (whose base is
 * config's base) in futures[i] at `config` (a configsAt entry's config): the fast path when the base is
 * covered, `simulate` otherwise. The futures' drivers are prepared on first use and kept.
 *
 * @param {object} plan       enginePlan(...)
 * @param {object[]} futures  futuresList(...)
 */
export function createFastRunner(plan, futures) {
  const years = plan.years;
  const eligible = plan.runs.map((run) => fastEligible(run.base));
  const prepared = new Array(futures.length).fill(null);            // per future
  const runTables = plan.runs.map(() => new Array(futures.length).fill(null));   // per run, per future
  const forFuture = (i) => prepared[i] || (prepared[i] = prepareFuture(futures[i], years));
  const forRun = (r, i) => runTables[r][i] || (runTables[r][i] = prepareRun(plan.runs[r].base, forFuture(i), years));
  return {
    eligible,
    /** @returns {{ failed: boolean, failMonth: number|null }} */
    run(r, i, config) {
      if (!eligible[r] || config.years !== years || config.trace) {
        const s = simulate(config, futures[i].returns, futures[i].seed);
        return { failed: s.failed, failMonth: s.failMonth, equity: s.finalEquity, bond: s.finalBond, cash: s.finalCash, isa: s.finalIsa };
      }
      return runFast(config, forFuture(i), forRun(r, i));
    }
  };
}

/** A run of one config in one future through the replica alone (tests: side by side with `simulate`). */
export function simulateFast(config, future) {
  if (!fastEligible(config)) return null;
  const pf = prepareFuture(future, config.years);
  const pr = prepareRun(config, pf, config.years);
  return runFast(config, pf, pr);
}
