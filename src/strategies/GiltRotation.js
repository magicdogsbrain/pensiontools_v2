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

/** Per-rung accreted value t years from now, real terms: cost grows toward `pays` at its own implied real yield. */
function accretedValue(order, yearsFromNow, yearsToMaturity) {
  const T = Math.max(0.1, yearsToMaturity);
  const y = Math.pow(order.pays / Math.max(1, order.cost), 1 / T) - 1;   // implied real yield at purchase
  const t = Math.min(yearsFromNow, T);
  return order.cost * Math.pow(1 + y, t);
}

/**
 * Run the rotation over one monthly real-TR series.
 * @param {number[]} series  monthly index, series[off] is month 0
 * @param {number} off       start offset into series
 * @param {object} ctx       precomputed context (see rotationPathsCtx)
 * @returns {{ wealth:number[], income:number[], failAge:number|null, triggeredYear:number|null, paidShort:number }}
 */
export function runRotationPath(series, off, ctx) {
  const { N, startAge, cutAge, trigger, split, keptWealthByYear, needAt, otherAtY, spAtY, lastRotateYear } = ctx;
  let ath = series[off], sleeve = 0, rotated = false, triggeredMonth = null;
  const wealth = [], income = [];
  let failAge = null, paidShort = 0, owed = 0;
  for (let y = 0; y <= N; y++) {
    // walk this plan year's months
    for (let m = y * 12; m < (y + 1) * 12 && off + m + 1 < series.length; m++) {
      const lvl = series[off + m];
      if (lvl > ath) ath = lvl;
      if (!rotated && y <= lastRotateYear && lvl <= (1 - trigger) * ath) {
        rotated = true; triggeredMonth = m;
        // sell the block at its accreted value; proceeds become the equity sleeve
        sleeve = split.soldOrders.reduce((s, o) => s + accretedValue(o, m / 12, o.yearsToMaturity), 0);
      }
      if (rotated) sleeve *= series[off + m + 1] / series[off + m];
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
    // wealth: kept rungs left to pay + (sleeve if rotated, else the block's accreted value)
    const blockVal = rotated ? sleeve : split.soldOrders.reduce((s, o) => s + accretedValue(o, y, o.yearsToMaturity), 0);
    wealth.push(keptWealthByYear[y] + blockVal);
  }
  return { wealth, income, failAge, triggeredYear: triggeredMonth == null ? null : Math.floor(triggeredMonth / 12), paidShort, owed };
}

export function rotationPathsCtx(plan, p, { cutAge, trigger }) {
  const N = p.durationYears;
  const split = splitLadderAtAge(plan, cutAge);
  // years to maturity per sold order (from the plan's first tax year)
  const firstTY = plan.firstTaxYear;
  for (const o of split.soldOrders) o.yearsToMaturity = Math.max(0.1, (new Date(o.matures) - new Date(firstTY - 1, 3, 6)) / (365.25 * 864e5));
  const keptSet = new Set(split.soldOrders.map((o) => o.tidm));
  const costByYear = {}; for (const o of plan.orders) if (!keptSet.has(o.tidm)) for (const Y of o.taxYears) costByYear[Y] = (costByYear[Y] || 0) + o.cost / o.taxYears.length;
  const keptWealthByYear = [];
  for (let y = 0; y <= N; y++) {
    let w = plan.spare;
    for (const yr of plan.years) if (yr.Y >= firstTY + y && !keptSet.has(yr.from)) w += yr.from === 'cash' ? yr.need : (costByYear[yr.Y] || 0);
    keptWealthByYear.push(w);
  }
  const needAt = (y) => { const yr = plan.years[Math.min(y, plan.years.length - 1)]; return yr ? yr.need : 0; };
  // The whole point of the rotation is RUNWAY: proceeds must have years to grow before the sold
  // years start drawing. Firing late is selling the floor into the fire, and the sweep in
  // research/rotation-plan-aug-2026.md §F shows the asymmetry plainly: the late rotations add
  // NOTHING to the median outcome and all of the tail risk (disarm at cut−1y: 8% of histories
  // cut; cut−8y: 0.7%). So the trigger disarms `rotateDisarmYears` (default 8) before the
  // block's first draw. A rotation foregone is not a failure — it is simply the full ladder.
  const disarm = p.params?.rotateDisarmYears > 0 ? p.params.rotateDisarmYears : 8;
  return { N, startAge: p.startAge, cutAge, trigger, split, keptWealthByYear, needAt,
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
