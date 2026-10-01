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
 *   createFastRunner(plan, futures, opts?) → { run(r, i, config) → { failed, failMonth, … }, eligible }
 *
 * Questions A and B (step 4 brief 4.5, 4.6) add, each a no-op when not asked for:
 *   - prepareFutureFrom(life, offsetMonths, years): a future's drivers read from a life (lives.js) at the stop — the
 *     price level from 1, shares and the life's bond stream continued, the first year's cash from the true previous
 *     year. At offset 0 it is prepareFuture to the bit (the bond stream IS the engine's).
 *   - createFastRunner(plan, futures, { potsFor, driversFor }): start values per run per future (the pots differ by
 *     future), and drivers supplied by the caller.
 *   - the locked run (config.lockedMonths, config.lockedSchedule): a pension closed for its first months inside its
 *     holder's one run. While closed the run draws nothing from the pension sleeves (they grow untouched), the month's
 *     target is the savings-only target and the ISA pays it exactly as a savings-only run's ISA does; a shortfall the
 *     ISA cannot meet is a run-out. From the month it opens the ordinary path runs. `simulate` cannot run it, so the
 *     runner refuses to hand one to `simulate`. tests/v7/saving/locked.test.js proves it against a chain of `simulate`.
 *   - fastEligible accepts an income that ends (extraIncomes[].endYear), a finite isaReturn and lockedMonths.
 *
 * Fund and platform charges (6.19.0, services/Charges.js): config.chargesPct (percent a year; absent = none) is taken
 * off the pension's sleeves and the ISA every month straight after the month's growth — while drawing and while a
 * pension is closed — by the same factor and in the same order as `simulate`. fastEligible takes a valid charge only.
 */
import { seededRng, gaussianRandom } from '../../utils/MathUtils.js';
import { simulate } from '../../services/SimulationEngine.js';
import { calculateGlidepath } from '../../services/GlidepathService.js';
import { planDrawdown } from '../../services/DrawdownStrategy.js';
import { SOURCING_DEFAULTS } from '../../services/WithdrawalSourcing.js';
import { spendingSmileFactor } from '../../services/SpendingModel.js';
import { monthlyChargeFactor, isChargesPct } from '../../services/Charges.js';
import { ISA_DEFAULTS } from '../../constants.js';

const CASH_REAL_SPREAD = -0.01;           // SimulationEngine.CASH_REAL_SPREAD
const LSA = 268275;                       // the UFPLS lifetime Lump Sum Allowance the engine starts from
const DEFAULT_HRL = 125140;

/** SimulationEngine.cashNominalReturn, as written there. */
export function cashNominalReturn(prevInflation) {
  return Math.max(0, prevInflation + CASH_REAL_SPREAD);
}

/** SimulationEngine.calculateBondReturn, as written there (it is not exported). Also the saving years' bond model (lives.js). */
export function calculateBondReturn(inf, eqReturn, prevInf, rng) {
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
export const monthly = (r) => Math.pow(1 + (Number.isFinite(r) ? Math.max(-0.99, r) : -0.99), 1 / 12);

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
    && isZero(c.diversifierStart) && c.subAsset === undefined && c.isaMix === undefined && (c.isaReturn === undefined || finite(c.isaReturn))
    && c.isaDrawdownStrategy === undefined && ISA_DEFAULTS.DRAWDOWN_STRATEGY === 'minimiseEarlyTax' && (c.isaBalance === undefined || finite(c.isaBalance))
    && isZero(c.taxableStart) && emptyList(c.windfalls)
    && (c.accessMethod === 'ufpls' || c.accessMethod === 'drawdown') && !c.ufplsYears && !c.ufplsThenPcls && !c.bandFillRecycle
    && (c.dbAmount === undefined || finite(c.dbAmount)) && (!(c.dbAmount > 0) || c.dbIndexation === 'cpi')
    && (c.extraIncomes === undefined || (Array.isArray(c.extraIncomes) && c.extraIncomes.every((e) => e && e.indexation === 'cpi' && finite(e.annual) && (e.endYear === undefined || e.endYear === null || Number.isInteger(e.endYear)))))
    && (c.lockedMonths === undefined || (Number.isInteger(c.lockedMonths) && c.lockedMonths >= 0
      && (c.lockedSchedule === undefined ? c.lockedMonths === 0 : (Array.isArray(c.lockedSchedule) && c.lockedSchedule.length === c.years && c.lockedSchedule.every(finite)))))
    && c.equityGlide === undefined && c.sourcingMode === undefined
    && (c.spendingProfile === undefined || c.spendingProfile === 'flat')
    && (c.chargesPct === undefined || isChargesPct(c.chargesPct))   // 6.19.0: a charge the engine takes as given, or none
    && c.trace !== true;
}

/**
 * What a future gives every run of it, whatever the amount: the bond model's return each month (its random
 * stream is the engine's, seeded as the engine seeds it), the monthly growth factors, and the price level at
 * the start of each year, all worked out as the engine works them out.
 */
export function prepareFuture(future, years) {
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

/**
 * A future's drivers read from a life at a stop (step 4 brief 4.6): the same fields as prepareFuture. The years are the
 * life's years S … S + years − 1 (offsetMonths = 12S); the price level is 1 in the first of them; the bond model's
 * months are the life's stream from the offset on (drawn once for the whole life, lives.js); the first year's cash rate
 * reads the year before the stop (the life's true previous year, `prevInflation`; at offset 0 the engine's own rule).
 * @param {{ returns: { equity: object, inflation: object }, stream: Float64Array }} life
 * @param {number} offsetMonths   a whole number of years, in months
 * @param {number} years
 * @param {{ prevInflation?: number }} [opts]   default: the life's inflation in the year before the stop (offset > 0)
 */
export function prepareFutureFrom(life, offsetMonths, years, opts = {}) {
  const S = offsetMonths / 12;
  if (!Number.isInteger(S) || S < 0) throw new Error(`prepareFutureFrom: offset ${offsetMonths} is not a whole number of years`);
  const returns = life.returns;
  const months = years * 12;
  if (!(life.stream && life.stream.length >= offsetMonths + months)) throw new Error('prepareFutureFrom: the life is shorter than the drawing years');
  const cumInf = new Float64Array(years);
  const mEq = new Float64Array(years);
  const mCash = new Float64Array(years);
  const inf = new Float64Array(years);
  const eq = new Float64Array(years);
  const prevInf = new Float64Array(years);
  const before = Number.isFinite(opts.prevInflation) ? opts.prevInflation : S > 0 ? (returns.inflation[S - 1] || 0.025) : null;
  let c = 1;
  for (let y = 0; y < years; y++) {
    if (y > 0) { const infForYear = returns.inflation[S + y] || 0.025; c *= (1 + infForYear); }
    cumInf[y] = c;
    eq[y] = returns.equity[S + y] || 0;
    inf[y] = returns.inflation[S + y] || 0.025;
    prevInf[y] = y > 0 ? (returns.inflation[S + y - 1] || 0.025) : (before === null ? inf[y] : before);
    mEq[y] = monthly(eq[y]);
    mCash[y] = monthly(cashNominalReturn(prevInf[y]));
  }
  return { cumInf, mEq, mCash, inf, eq, prevInf, mBond: life.stream.subarray(offsetMonths, offsetMonths + months), bondMonths: months, rng: null, months };
}

/** prepareFuture with every month of the bond model drawn (tests: compared with prepareFutureFrom at offset 0). */
export function prepareFutureFull(future, years) {
  const pf = prepareFuture(future, years);
  if (pf.months > 0) bondMonthsTo(pf, pf.months - 1);
  return pf;
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
function runFast(config, pf, pr, start = null) {
  const years = config.years;
  const months = years * 12;
  const schedule = Array.isArray(config.targetSchedule) ? config.targetSchedule : null;
  const ufpls = config.accessMethod === 'ufpls';
  const isaFactor = Math.pow(1 + (config.isaReturn ?? ISA_DEFAULTS.RETURN), 1 / 12);
  // SimulationEngine's charge factor, worked out the same way (services/Charges.js): 1 without a charge, and then the
  // charge blocks below are skipped, so an uncharged run is the run it always was.
  const chargeM = monthlyChargeFactor(config.chargesPct);
  const strategy = config.isaDrawdownStrategy || ISA_DEFAULTS.DRAWDOWN_STRATEGY;

  let equity = start ? start.equity : config.equityStart;
  let bond = start ? start.bond : config.bondStart;
  let cash = start ? start.cash : config.cashStart;
  let isa = start ? start.isa : (config.isaBalance || 0);
  let lsaRemaining = ufpls ? LSA : 0;
  let failed = false;
  let failMonth = null;

  // The locked run (questions A and B): the pension closed for the first `lockedMonths`. 0 = today's run, unchanged.
  const lockedMonths = config.lockedMonths > 0 ? Math.min(config.lockedMonths, months) : 0;
  const lockedSchedule = lockedMonths > 0 ? config.lockedSchedule : null;
  let lpYear = -1, lpIsa = -1, lp = null;

  // planDrawdown, remembered within a year: with the default ISA strategy (uncapped) its answer depends on the ISA
  // balance only through min(net gap, balance), so a balance at or above the remembered gap gives the same plan.
  let planYear = -1, planF = -1, planIsa = -1, plan = null;
  const sourcing = { fromEquity: 0, fromBond: 0, fromCash: 0, shortfall: 0, replenish: 0 };

  for (let month = 0; month < months; month++) {
    const year = (month / 12) | 0;
    const cumInf = pf.cumInf[year];

    if (month < lockedMonths) {
      // The pension is closed: the run is a savings-only run (C's adapter's, for the holder's share of the need) whose
      // pension sleeves sit invested and untouched. Exactly what `simulate` does on a savings-only config, whose
      // pots are empty: the pension draw planDrawdown asks for is all shortfall, which the ISA rescues or the run fails.
      const lockedTarget = lockedSchedule[year] * cumInf * pr.sf[year] + 0;
      if (!(year === lpYear && (isa === lpIsa || (lp.isaDraw < lpIsa && isa >= lp.isaDraw)))) {
        lp = planDrawdown({
          targetGross: lockedTarget,
          fixedIncome: 0,
          pa: pr.pa[year], brl: pr.brl[year], hrl: pr.hrl[year],
          isaBalance: isa,
          strategy,
          yearsUntilSp: pr.yearsUntilSp[year],
          taxFreeFraction: 0
        });
        lpYear = year; lpIsa = isa;
      }
      const lockedSipp = lp.sippGross / 12;
      const lockedIsa = lp.isaDraw / 12;
      const lockedTax = lp.tax;
      if (month >= pf.bondMonths) bondMonthsTo(pf, month);
      equity *= pf.mEq[year];
      bond *= pf.mBond[month];
      cash *= pf.mCash[year];
      if (isa > 0) isa = isa * isaFactor;
      // the month's charges, as `simulate` takes them (a closed pension is still held in funds, so it is charged)
      if (chargeM !== 1) {
        equity *= chargeM;
        bond *= chargeM;
        cash *= chargeM;
        if (isa > 0) isa *= chargeM;
      }
      if (!Number.isFinite(lockedSipp)) { failed = true; failMonth = month; break; }
      let shortfall = lockedSipp > 1e-9 ? Math.max(0, lockedSipp) : 0;
      let lockedRescue = 0;
      if (shortfall > 1e-6 && isa > 0) {
        const grossYear = lockedSipp * 12;
        const netFactor = grossYear > 0 && lockedTax > 0 ? Math.max(0.55, 1 - lockedTax / grossYear) : 1;
        const netShort = shortfall * netFactor;
        lockedRescue = Math.min(isa, netShort);
        shortfall = Math.max(0, shortfall - lockedRescue / netFactor);
      }
      if (shortfall > 1e-6) { failed = true; failMonth = month; }
      isa = Math.max(0, isa - Math.min(Math.max(0, lockedIsa - 0) + lockedRescue, isa)) + 0;
      equity = Math.max(0, equity);
      bond = Math.max(0, bond);
      cash = Math.max(0, cash);
      if (failed) break;
      continue;
    }

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
    // SimulationEngine's charge block, at the same point and in the same order: (x × growth) × charge, never
    // x × (growth × charge), so the two engines stay equal to the bit at every charge.
    if (chargeM !== 1) {
      equity *= chargeM;
      bond *= chargeM;
      cash *= chargeM;
      if (isa > 0) isa *= chargeM;
    }

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
 * @param {object[]} futures  futuresList(...) (for a stop: each life's drawing years, { returns, seed })
 * @param {{ potsFor?: (r: number, i: number) => { equity: number, bond: number, cash: number, isa: number },
 *           driversFor?: (i: number) => object }} [opts]
 *   potsFor: the start values of run r in future i (the pots differ by future, step 4). The floors and the cash
 *   target are the same values — the adapter holds a pot at its mix, so start and floor are one figure.
 *   driversFor: future i's prepared drivers (prepareFutureFrom), else prepareFuture(futures[i]).
 */
export function createFastRunner(plan, futures, opts = {}) {
  const years = plan.years;
  const potsFor = opts.potsFor || null;
  const driversFor = opts.driversFor || null;
  const eligible = plan.runs.map((run) => fastEligible(run.base));
  const prepared = new Array(futures.length).fill(null);            // per future
  const runTables = plan.runs.map(() => new Array(futures.length).fill(null));   // per run, per future
  const forFuture = (i) => prepared[i] || (prepared[i] = driversFor ? driversFor(i) : prepareFuture(futures[i], years));
  const baseFor = (r, start) => (start ? { ...plan.runs[r].base, equityMin: start.equity, bondMin: start.bond, cashTarget: start.cash } : plan.runs[r].base);
  const forRun = (r, i) => {
    let t = runTables[r][i];
    if (!t) {
      const start = potsFor ? potsFor(r, i) : null;
      t = runTables[r][i] = { pr: prepareRun(baseFor(r, start), forFuture(i), years), start };
    }
    return t;
  };
  return {
    eligible,
    /** @returns {{ failed: boolean, failMonth: number|null }} */
    run(r, i, config) {
      if (!eligible[r] || config.years !== years || config.trace) {
        // `simulate` cannot keep a pension shut: a locked config is never handed to it
        if (config.lockedMonths > 0) throw new Error('fastEngine: a run with a closed pension (lockedMonths) can only be run by the fast path');
        const start = potsFor ? potsFor(r, i) : null;
        const c = start ? { ...config, equityStart: start.equity, bondStart: start.bond, cashStart: start.cash, equityMin: start.equity, bondMin: start.bond, cashTarget: start.cash, isaBalance: start.isa } : config;
        const s = simulate(c, futures[i].returns, futures[i].seed);
        return { failed: s.failed, failMonth: s.failMonth, equity: s.finalEquity, bond: s.finalBond, cash: s.finalCash, isa: s.finalIsa };
      }
      const t = forRun(r, i);
      return runFast(config, forFuture(i), t.pr, t.start);
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

/** The same on drivers already prepared (prepareFutureFrom): the run of one config in one life's drawing years. */
export function simulateFastFrom(config, pf) {
  if (!fastEligible(config)) return null;
  const pr = prepareRun(config, pf, config.years);
  return runFast(config, pf, pr);
}
