/**
 * Rules on the saving years (test plan 3.1 with the step 4 brief's SaveRow), and the small builders the saving tests
 * share: a saver household made straight through the household model (answer A's and B's toHousehold are P2's and
 * P3's; these tests do not wait for them), made-up lives, and the three-sleeve loop the kernel is checked against.
 *
 *   saver(opts)                    a full household (expandHousehold) with the saving fields filled
 *   flatLife(r, pi)                env.futureReturns for one flat path: shares `r` a year, prices `pi` a year
 *   threeSleeves(plan, life, pot, c)   the brief's loop (4.3), sleeve by sleeve, rebalanced at the start of each month
 *   checkSaving(rows, want)        S1–S10 on a SaveRow trace → a list of problems (empty = all hold)
 */
import { expandHousehold } from './_saving.js';

export const TODAY = '2026-09-30';

/**
 * A saver household. Every amount is a figure the person would give: a pension pot, ISA money, what lands in the
 * pension each month, what goes into savings each month; the stop age of the first person (both stop together).
 */
export function saver({
  age = 45, pot = 100_000, isa = 0, payIn = 0, savingsIn = 0, stopAge = 60, endAge = 95,
  risk = 'balanced', savingRisk = risk, charge = 0.005, mix = null, sp = 'full', finalSalary = null, work = null,
  partner = null, today = TODAY
} = {}) {
  const S = Math.max(0, stopAge - age);
  const person = (who, p) => ({
    who, age: p.age, pots: { pension: p.pot || 0, isa: p.isa || 0 },
    statePension: p.sp === 'none' ? { amountPerYear: 0 } : {},
    finalSalary: p.finalSalary ? [{ amountPerYear: p.finalSalary.yearly, startAge: p.finalSalary.fromAge, increases: 'pricesCapped5' }] : [],
    stopWork: { kind: 'age', age: p.age + S },
    saving: { payIn: { total: p.payIn || 0, own: null, employer: null }, savingsIn: p.savingsIn || 0, alreadyDrawing: false },
    otherIncome: p.work ? [{ kind: 'work', label: 'part-time', amountPerYear: p.work.yearly, fromAge: p.age + S, toAge: p.age + S + p.work.years }] : []
  });
  const people = [person('you', { age, pot, isa, payIn, savingsIn, sp, finalSalary, work })];
  if (partner) people.push(person('partner', { sp: 'full', ...partner }));
  const short = {
    people, planToAge: endAge,
    portfolio: mix ? { kind: 'mix', ...mix } : { kind: 'risk', level: risk },
    strategy: { id: 'steady' },
    saving: { risk: savingRisk, charge },
    spending: null
  };
  return expandHousehold(short, today).household;
}

/** One made-up path for every life: shares `r` a year, prices `pi` a year (0 is kept flat). */
export const flatLife = (r = 0, pi = 0) => (i, years) => {
  const equity = {}, inflation = {};
  for (let y = 0; y < years; y++) { equity[y] = r; inflation[y] = pi; }
  return { equity, inflation };
};

/** A life's price level at the start of each year, as the engine counts it (4.3): 1, then × (1 + that year's rise). */
export function priceLevels(life, upTo) {
  const P = [1];
  for (let y = 1; y <= upTo; y++) P.push(P[y - 1] * (1 + (life.returns.inflation[y] || 0.025)));
  return P;
}

const monthlyOf = (r) => Math.pow(1 + (Number.isFinite(r) ? Math.max(-0.99, r) : -0.99), 1 / 12);

/**
 * The saving years sleeve by sleeve (brief 4.3), written from the brief and not from saving.js: shares, bonds and cash,
 * the month's payment at the start of the month at today's prices rising with prices, the whole pot rebalanced to the
 * year's mix as the payment goes in, each sleeve grown by its own factor and charged. → the pot at the stop in today's prices.
 * @param {object} plan   savingPlan(...) (for S, mixByYear and chargeM only)
 */
export function threeSleeves(plan, life, pot, c) {
  const S = plan.S;
  const P = priceLevels(life, S);
  const w0 = plan.mixByYear[0] || { equity: 1, bond: 0, cash: 0 };
  let E = pot * w0.equity, B = pot * w0.bond, K = pot * w0.cash;
  for (let y = 0; y < S; y++) {
    const w = plan.mixByYear[y];
    const eq = monthlyOf(life.returns.equity[y] || 0);
    const prev = y > 0 ? (life.returns.inflation[y - 1] || 0.025) : (life.returns.inflation[0] || 0.025);
    const cash = monthlyOf(Math.max(0, prev - 0.01));
    for (let m = 0; m < 12; m++) {
      const V = E + B + K + c * P[y];
      E = V * w.equity; B = V * w.bond; K = V * w.cash;
      E *= eq * plan.chargeM; B *= life.stream[12 * y + m] * plan.chargeM; K *= cash * plan.chargeM;
    }
  }
  return (E + B + K) / P[S];
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const PENNY = 0.005;

/**
 * S1–S10 on one person's SaveRow trace.
 * @param {object[]} rows   savingRows(plan, person, life)
 * @param {{ pot: number, savings: number, payIn: number, savingsIn: number, stopAge: number, ageToday: number, prices: number[] }} want
 * @returns {string[]}
 */
export function checkSaving(rows, want) {
  const out = [];
  const S = want.stopAge - want.ageToday;
  if (rows.length !== 12 * S) out.push(`S5 ${rows.length} rows for ${S} saving years`);
  rows.forEach((r, k) => {
    const at = `row ${k}`;
    for (const f of ['m', 'age', 'potStart', 'growth', 'charge', 'potEnd', 'savingsStart', 'savingsIn', 'savingsEnd', 'priceIndex']) {
      if (!isNum(r[f])) out.push(`S1 ${at}.${f} is not a number`);
    }
    if (!r.paidIn || !isNum(r.paidIn.total) || !isNum(r.paidIn.savings)) out.push(`S1 ${at}.paidIn`);
    for (const f of ['potStart', 'potEnd', 'savingsStart', 'savingsEnd', 'charge']) if (r[f] < 0) out.push(`S1 ${at}.${f} < 0`);
    if (r.paidIn && r.paidIn.total < 0) out.push(`S1 ${at}.paidIn.total < 0`);
    // S2 the months add up
    if (Math.abs(r.potStart + r.paidIn.total + r.growth - r.charge - r.potEnd) > PENNY) out.push(`S2 ${at} does not add up`);
    if (k === 0 && Math.abs(r.potStart - want.pot) > PENNY) out.push('S2 the first potStart is not the pot typed');
    if (k === 0 && Math.abs(r.savingsStart - want.savings) > PENNY) out.push('S2 the first savingsStart is not the savings typed');
    if (k > 0 && Math.abs(r.potStart - rows[k - 1].potEnd) > PENNY) out.push(`S2 ${at} potStart is not the month before's potEnd`);
    if (k > 0 && Math.abs(r.savingsStart - rows[k - 1].savingsEnd) > PENNY) out.push(`S2 ${at} savingsStart is not the month before's savingsEnd`);
    // S5 the pay-in rises with prices and goes in at the start of the month (growth is earned on it)
    const y = Math.floor(r.m / 12);
    if (r.m !== k) out.push(`S5 ${at} has m ${r.m}`);
    if (r.age !== want.ageToday + y) out.push(`S5 ${at} age ${r.age}`);
    if (want.prices && Math.abs(r.priceIndex - want.prices[y]) > 1e-12 * want.prices[y]) out.push(`S8 ${at} price index`);
    if (Math.abs(r.paidIn.total - want.payIn * r.priceIndex) > PENNY) out.push(`S5 ${at} paid in ${r.paidIn.total}, not ${want.payIn} × prices`);
    if (Math.abs(r.savingsIn - want.savingsIn * r.priceIndex) > PENNY) out.push(`S5 ${at} savings in`);
    if (r.paidIn.total > 0 && r.growth !== 0 && r.potStart + r.paidIn.total > 0) {
      // start of the month: the growth is a factor on (potStart + paidIn), the same factor as the savings'
      const g = (r.potStart + r.paidIn.total + r.growth) / (r.potStart + r.paidIn.total);
      const gs = r.savingsStart + r.savingsIn > 0 ? (r.savingsEnd) / (r.savingsStart + r.savingsIn) : null;
      const gp = r.potEnd / (r.potStart + r.paidIn.total);
      if (gs !== null && Math.abs(gs - gp) > 1e-9) out.push(`S5 ${at} the pension and the savings grew differently (paid at a different time?)`);
      if (!(g > 0)) out.push(`S5 ${at} growth factor ${g}`);
    }
  });
  if (rows.length) {
    const last = rows[rows.length - 1];
    if (last.age !== want.stopAge - 1) out.push(`S5 the last row's age is ${last.age}, not ${want.stopAge - 1}`);
  }
  // S10 can be saved
  const text = JSON.stringify(rows);
  if (JSON.stringify(JSON.parse(text)) !== text) out.push('S10 not JSON-safe');
  return out;
}
