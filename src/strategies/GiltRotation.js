/**
 * Gilt ladder + rotation — the full index-linked ladder with ONE pre-agreed escape:
 * while equities are within `trigger` (default 30%) of their running all-time high, the ladder
 * runs exactly as bought; on the first month the equity index closes at or below
 * (1 − trigger) × ATH, every rung whose years all fund ages above `cutAge` (default 75) is sold
 * at its accreted value and the proceeds buy the equity fund. Ages ≤ cutAge stay contracted for
 * ever; ages above cutAge are then drawn from the equity sleeve. No rebuy is assumed.
 *
 * Evidence and the decision rule: research/rotation-plan-aug-2026.md. Two documented
 * approximations: (1) the trigger runs on the app's real TOTAL-RETURN series (the rule was
 * measured on the price index — a TR index makes new highs more often, so this fires slightly
 * less: conservative); (2) the sold block's value accretes each rung toward par at the real
 * yield implied by its purchase price (a yields-unchanged assumption; ±25% price sensitivity
 * moves the historical odds by single digits — see the research doc).
 */
import { getRtr, bootstrapPaths } from './ladderEngine.js';
import { monthlyChargeFactor } from '../services/Charges.js';
import { accretedValue, yearsToMaturity, ladderWealthByYear } from './GiltLadderPlan.js';

/**
 * Split a buildGiltLadder plan at cutAge.
 * @returns {{ keptYears, soldYears, soldOrders, blockCostToday, soldIncomeTotal }}
 */
export function splitLadderAtAge(plan, cutAge) {
  const soldYears = plan.years.filter((y) => y.age > cutAge && y.from !== 'cash' && y.from !== 'none');
  const keptYears = plan.years.filter((y) => !soldYears.includes(y));
  const soldTidms = new Set(soldYears.map((y) => y.from));
  // A rung is sold only when EVERY year it funds is above the cut (never split one gilt's job).
  const soldOrders = plan.orders.filter((o) => o.taxYears.every((Y) => {
    const yr = plan.years.find((y) => y.Y === Y); return yr && yr.age > cutAge;
  }) && soldTidms.has(o.tidm));
  const soldSet = new Set(soldOrders.map((o) => o.tidm));
  const actuallySoldYears = plan.years.filter((y) => soldSet.has(y.from));
  const blockCostToday = soldOrders.reduce((s, o) => s + o.cost, 0);
  const soldIncomeTotal = actuallySoldYears.reduce((s, y) => s + y.need, 0);
  return { keptYears, soldYears: actuallySoldYears, soldOrders, blockCostToday, soldIncomeTotal };
}

/**
 * The money left over after the ladder is bought (`plan.spare`), when the plan puts it in the growth part
 * (strategyParams.spareGrowth, 6.35.0): a world-equity fund on the same real total-return series as the rotation's
 * sleeve, charged like it. Its value at the START of each plan year 0..N, so year 0 is the spare itself, as every
 * ladder figure counts it. It is never drawn for income: the ladder pays the income; this is what is left over.
 * Without the setting the spare is held at its real value (absent = the old behaviour).
 */
export function spareGrowthPath(series, off, N, spare, chargeM = 1) {
  const c = Number.isFinite(chargeM) && chargeM > 0 && chargeM <= 1 ? chargeM : 1;
  const out = [];
  let v = spare;
  for (let y = 0; y <= N; y++) {
    out.push(v);
    for (let m = y * 12; m < (y + 1) * 12 && off + m + 1 < series.length; m++) { v *= series[off + m + 1] / series[off + m]; if (c !== 1) v *= c; }
  }
  return out;
}

/** spareGrowthPath over the one test's real starts (every month since 1871) and its futures (seed i × 7919 + 3). */
export function spareGrowthRuns(N, spare, chargeM, runs = 400) {
  const months = (N + 1) * 12;
  const hist = getRtr(), h = [], mc = [];
  for (let s = 0; s + months < hist.length; s++) h.push(spareGrowthPath(hist, s, N, spare, chargeM));
  for (let i = 0; i < runs; i++) mc.push(spareGrowthPath(bootstrapPaths(i * 7919 + 3, months + 1, 60).rtr, 0, N, spare, chargeM));
  return { hist: h, mc };
}

/**
 * Run the rotation over one monthly real-TR series.
 * @param {number[]} series  monthly index, series[off] is month 0
 * @param {number} off       start offset into series
 * @param {object} ctx       precomputed context (see rotationPathsCtx)
 * @returns {{ wealth:number[], income:number[], failAge:number|null, triggeredYear:number|null, paidShort:number }}
 */
export function runRotationPath(series, off, ctx) {
  const { N, startAge, cutAge, trigger, split, keptWealthByYear, blockWealthByYear, needAt, otherAtY, spAtY, lastRotateYear } = ctx;
  const chargeM = Number.isFinite(ctx.chargeM) && ctx.chargeM > 0 && ctx.chargeM <= 1 ? ctx.chargeM : 1;
  let ath = series[off], sleeve = 0, rotated = false, triggeredMonth = null;
  // The spare in the growth part (spareGrowthPath, the same series and charges), in place of the flat spare the ladder holds.
  const spareFlat = ctx.spareGrowth ? ctx.spare : 0;
  let spare = spareFlat;
  const wealth = [], income = [];
  let failAge = null, paidShort = 0, owed = 0;
  for (let y = 0; y <= N; y++) {
    const spareNow = spare;   // the start of the plan year, as the ladder's own figures count it
    // walk this plan year's months
    for (let m = y * 12; m < (y + 1) * 12 && off + m + 1 < series.length; m++) {
      if (spareFlat) { spare *= series[off + m + 1] / series[off + m]; if (chargeM !== 1) spare *= chargeM; }
      const lvl = series[off + m];
      if (lvl > ath) ath = lvl;
      if (!rotated && y <= lastRotateYear && lvl <= (1 - trigger) * ath) {
        rotated = true; triggeredMonth = m;
        // sell the block at its accreted value; proceeds become the equity sleeve
        sleeve = split.soldOrders.reduce((s, o) => s + accretedValue(o, m / 12, o.yearsToMaturity), 0);
      }
      if (rotated) {
        sleeve *= series[off + m + 1] / series[off + m];
        // the equity sleeve is held in a fund: the month's fund and platform charges (6.19.0). The trigger above reads
        // the market, never the sleeve; the rungs before the rotation are gilts held directly and are not charged.
        if (chargeM !== 1) sleeve *= chargeM;
      }
    }
    const age = startAge + y;
    const need = needAt(y);
    let paid = need;                                   // contracted while the rung is still owned
    if (age > cutAge) {
      if (rotated) {
        const take = Math.min(sleeve, need); sleeve -= take; paid = take;
      } else {
        // not rotated (yet): the rung is still owned and pays by contract
        paid = need;
      }
      owed += need;
      if (paid < need - 1) { paidShort += need - paid; if (failAge == null) failAge = age; }
    }
    income.push(paid + spAtY(y) + otherAtY(y));
    // wealth: kept rungs left to pay + (sleeve if rotated, else the block's years not yet paid, as the full ladder holds
    // them). Until 6.34.0 an unfired block stayed at its full accreted value after its rungs had paid out, so a future
    // that never rotated ended with the block's whole income on top of what the full ladder leaves.
    const blockVal = rotated ? sleeve : blockWealthByYear[y];
    wealth.push(keptWealthByYear[y] + blockVal - spareFlat + spareNow);
  }
  return { wealth, income, failAge, triggeredYear: triggeredMonth == null ? null : Math.floor(triggeredMonth / 12), paidShort, owed };
}

export function rotationPathsCtx(plan, p, { cutAge, trigger }) {
  const N = p.durationYears;
  const split = splitLadderAtAge(plan, cutAge);
  // years to maturity per sold order (from the plan's first tax year)
  const firstTY = plan.firstTaxYear;
  // Both ends in UTC (yearsToMaturity): a local 6 April is an hour (UK) to half a day (elsewhere) off, which moved the
  // cones by a few pounds between time zones.
  for (const o of split.soldOrders) o.yearsToMaturity = yearsToMaturity(o, firstTY);
  // The rungs kept are valued as the full ladder values them (accreted, never at cost); the sold block on its own below.
  const keptWealthByYear = ladderWealthByYear(plan, N, new Set(split.soldOrders.map((o) => o.tidm)));
  const fullWealthByYear = ladderWealthByYear(plan, N);
  const blockWealthByYear = fullWealthByYear.map((w, y) => w - keptWealthByYear[y]);   // never fired: the full ladder exactly
  const needAt = (y) => { const yr = plan.years[Math.min(y, plan.years.length - 1)]; return yr ? yr.need : 0; };
  // The whole point of the rotation is RUNWAY: proceeds must have years to grow before the sold
  // years start drawing. Firing late is selling the floor into the fire, and the sweep in
  // research/rotation-plan-aug-2026.md §F shows the asymmetry plainly: the late rotations add
  // NOTHING to the median outcome and all of the tail risk (disarm at cut−1y: 8% of histories
  // cut; cut−8y: 0.7%). So the trigger disarms `rotateDisarmYears` (default 8) before the
  // block's first draw. A rotation foregone is not a failure — it is simply the full ladder.
  const disarm = p.params?.rotateDisarmYears > 0 ? p.params.rotateDisarmYears : 8;
  return { N, startAge: p.startAge, cutAge, trigger, split, keptWealthByYear, blockWealthByYear, needAt,
    spareGrowth: !!(p.params && p.params.spareGrowth) && plan.spare > 0, spare: plan.spare,
    chargeM: monthlyChargeFactor(p.chargesPct),   // the plan's fund and platform charges, on the sleeve after a rotation (6.19.0)
    lastRotateYear: Math.max(0, (cutAge - disarm) - p.startAge),
    otherAtY: (y) => (p.otherIncomeByYear && p.otherIncomeByYear[y]) || 0,
    spAtY: (y) => { const yr = plan.years[Math.min(y, plan.years.length - 1)]; return yr ? Math.max(0, yr.gross - yr.need) : 0; } };
}

export function runRotationWindows(ctx) {
  const hist = getRtr();
  const months = (ctx.N + 1) * 12;
  const out = [];
  for (let s = 0; s + months < hist.length; s++) out.push(runRotationPath(hist, s, ctx));
  return out;
}

export function runRotationMonteCarlo(ctx, runs = 400) {
  const months = (ctx.N + 1) * 12;
  const out = [];
  for (let i = 0; i < runs; i++) {
    const { rtr } = bootstrapPaths(i * 7919 + 3, months + 1, 60);   // the shared per-future market
    out.push(runRotationPath(rtr, 0, ctx));
  }
  return out;
}
