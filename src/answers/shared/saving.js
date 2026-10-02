/**
 * The saving years (step 4 brief 4.3; saving-years-engine.md 1.2–1.6): from today to the stop, month by month, on
 * each life's markets — the same yearly grid, the same monthly factors and the same bond stream as the drawing years.
 *
 * One person, one life, S whole years. Each pot (the pension; ISAs and savings) is held at the year's target mix and
 * rebalanced monthly; the month's payment, at today's prices rising with prices, goes in at the START of the month,
 * before that month's growth; the household's charge (household.chargesPct, 0.5% a year by default — the same charge the
 * drawing years take, 6.19.0) comes off monthly from every sleeve. Because the
 * weights never depend on the pot, a month multiplies the whole pot by one factor
 *
 *   f(m) = (wE(y) × monthly(equity[y]) + wB(y) × bond[m] + wK(y) × monthly(cash(y))) × chargeM
 *
 * so the pot at the stop is exactly linear in the payment: pot_i(c) = A_i + c × B_i (today's prices), with
 * B_i = Σ_y b_{i,y}, b_{i,y} the value at the stop of £1 a month paid in year y alone. That is the KERNEL of a person
 * at a stop age — { A, b, B, priceAtStop } over the lives — and every pay-in question after it is arithmetic: no runs.
 * The pension and the savings of a person grow by the same f (one mix, one charge), so they share b and B.
 *
 *   P(0) = 1, P(y) = P(y − 1) × (1 + inflation[y])        the engine's price level (a year's rise applied at its start)
 *   cash(y) = max(0, inflation[y − 1] − 1%)                (inflation[0] when y = 0: the engine's rule)
 *   w(y)    the saving mix, then a straight line to the drawing mix over the last SLIDE_YEARS (reaching it at y = S);
 *           with fewer years the slide starts at y = 0; equal mixes, no slide
 *
 *   savingPlan(household, stopAge, env)          → { S, people, mixByYear, chargeM, charge, chargesPct, mixes, slideYears }
 *   savingKernel(plan, person, lives, which?)    → { A, b, B, priceAtStop }   which: 'pension' (default) | 'savings'
 *   potsByPerson(plan, lives)                    → per person { pension: Float64Array, savings: Float64Array } at the stop, today's prices
 *   potsAtStop(plan, lives)                      → { byLife, spread }
 *   payInFor(kernel, target, share)              → the least whole £10 a month reaching `target` in a share of lives
 *   reachCount(kernel, c, target)                → the number of lives with A_i + c × B_i ≥ target
 *   savingRows(plan, person, life)               → SaveRow[] (the trace)
 *
 * Pure, clock-free, no Math.random. Inflation of exactly nought is read as the engine reads it (2.5%); made-up
 * futures keep flat prices flat (futures.js).
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 4.2): each person saves until their
 * OWN stop (`people[].until`, from the household: stopYearsFor), their pay-ins going in and the charge coming off until
 * then; someone who has stopped (until 0) holds the pots given. One growth pass per distinct stop, each with its own
 * slide to the drawing mix — two passes when apart, one otherwise (a same-year plan is today's, figure for figure).
 *
 * How ISAs and savings grow (6.22.0; services/IsaGrowth.js; research/saver-lock-and-savings-growth.md 3.6): the household's
 * one choice, `household.isaGrowth`, read here for the saving years as the drawing runs read it (toEngine.js).
 *   - 'invested' ("Invested like my pension"), and no choice at all: the savings grow by the pension's own f, as they
 *     always have here — the same kernel, bit for bit;
 *   - 'cash' ("Mostly cash"): the savings grow by the month's cash factor, g_s(m) = monthly(cash(y)), and the charge:
 *     a kernel of their own (savingKernel(…, 'savings')), from the same lives and prices. The pension never depends on it.
 * The cash pass reads no bond stream and is not counted in kernelPasses (the work bound counts the mix passes).
 */
import { RISK_PRESETS } from '../../services/GlidepathService.js';
import { SAVING } from './rules.js';
import { mixOf } from './toEngine.js';
import { bandIndexes } from './band.js';
import { monthly, cashNominalReturn } from './fastEngine.js';
import { monthlyChargeFactor, isChargesPct } from '../../services/Charges.js';
import { isaGrowthOf, isIsaGrowthMix } from '../../services/IsaGrowth.js';
import { stopsOf } from './household.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const infOf = (returns, y) => returns.inflation[y] || 0.025;
const sameMix = (a, b) => a.equity === b.equity && a.bond === b.bond && a.cash === b.cash;
const plainMix = (m) => ({ equity: m.equity || 0, bond: m.bond || 0, cash: m.cash || 0 });

/** The saving mix and the drawing mix: env.savingMix / env.mix (tests), else the household's levels. */
function mixesOf(household, env) {
  const drawing = env && env.mix ? plainMix(env.mix) : mixOf(household.portfolio);
  const sv = household.saving || {};
  const level = sv.risk || (household.portfolio && household.portfolio.kind === 'risk' ? household.portfolio.level : 'balanced');
  const saving = env && env.savingMix ? plainMix(env.savingMix) : plainMix(RISK_PRESETS[level] || RISK_PRESETS.balanced);
  return { saving, drawing, savingLevel: level };
}

/** The target mix of each saving year (4.3.1). */
export function mixByYearOf(S, saving, drawing) {
  const out = new Array(S);
  if (sameMix(saving, drawing)) { for (let y = 0; y < S; y++) out[y] = { ...saving }; return out; }
  const from = Math.max(0, S - SAVING.slideYears);
  for (let y = 0; y < S; y++) {
    if (y < from) { out[y] = { ...saving }; continue; }
    const t = (y - from) / (S - from);
    out[y] = {
      equity: saving.equity + (drawing.equity - saving.equity) * t,
      bond: saving.bond + (drawing.bond - saving.bond) * t,
      cash: saving.cash + (drawing.cash - saving.cash) * t
    };
  }
  return out;
}

/**
 * The household's fund and platform charge (6.19.0): `household.chargesPct`, percent a year — the ONE charge, taken
 * while saving and while drawing (the drawing runs get it from toEngine.js) — by the factor today's engine uses
 * (services/Charges.js). Before 6.19.0 the charge lived on `household.saving.charge` as a share a year, for the saving
 * years only; a household that still carries only that is read as before (the same factor, to the bit), and one with
 * neither gets the shared default (0.5%), as the saving years always have.
 * @returns {{ charge: number, chargesPct: number, chargeM: number }}   charge as a share a year (0.005), chargesPct as a percent
 */
function chargeOf(household) {
  if (isChargesPct(household.chargesPct)) {
    const pct = household.chargesPct;
    return { charge: pct / 100, chargesPct: pct, chargeM: monthlyChargeFactor(pct) };
  }
  const sv = household.saving;
  const charge = sv && isNum(sv.charge) ? sv.charge : SAVING.charge;
  return { charge, chargesPct: charge * 100, chargeM: Math.pow(1 - charge, 1 / 12) };
}

/** What a person pays in, a month at today's prices: into the pension (the total; own + employer when split) and into savings. */
function payInOf(person) {
  const sv = person.saving;
  if (!sv) return { total: 0, own: null, employer: null, savings: 0 };
  const p = sv.payIn || {};
  const own = isNum(p.own) ? p.own : null;
  const employer = isNum(p.employer) ? p.employer : null;
  const total = isNum(p.total) ? p.total : (own || 0) + (employer || 0);
  return { total, own, employer, savings: isNum(sv.savingsIn) ? sv.savingsIn : 0 };
}

/**
 * Each person's whole years from today until they stop, as the saving years and the drawing years read them
 * (couples-different-years.md 4.2, 4.3 l). One person, or a couple who stop in the same year: everyone stops at the stop
 * asked about, S = stopAge − your age, as before (the household's own stop is not read: A's rows and the tests move it).
 * A couple who stop in different years: each at their own (household.js stopsOf), and `stopAge` — the stop the answer is
 * about — must be one of the two; S is then the household's start, the first stop.
 * @returns {{ S: number, own: number[], apart: boolean }}   own: per person, in household order
 */
export function stopYearsFor(household, stopAge, today) {
  const people = household.people;
  const S = Math.max(0, Math.round(stopAge - people[0].age));
  if (people.length < 2) return { S, own: people.map(() => S), apart: false };
  const stops = stopsOf(household, today);
  if (new Set(stops.map((s) => s.S)).size <= 1) return { S, own: people.map(() => S), apart: false };
  if (!stops.some((s, j) => people[j].age + s.S === stopAge)) {
    throw new Error(`saving: the stop age ${stopAge} is neither person's own stop (${stops.map((s, j) => people[j].age + s.S).join(', ')})`);
  }
  const own = stops.map((s) => s.S);
  return { S: Math.min(...own), own, apart: true };
}

/**
 * Everything about the saving years that does not depend on a life.
 * @param {import('./household.js').Household} household   the full form (expandHousehold), ages today
 * @param {number} stopAge   the stop the answer is about: the first person's age at it when both stop in the same year
 *   (S = stopAge − you.age); a couple apart each save to their own stop (stopYearsFor), and S is the first stop
 * @param {{ mix?: object, savingMix?: object, today?: string }} env
 */
export function savingPlan(household, stopAge, env = {}) {
  const stops = stopYearsFor(household, stopAge, env.today);
  const S = stops.S;
  const { saving, drawing, savingLevel } = mixesOf(household, env);
  const { charge, chargesPct, chargeM } = chargeOf(household);
  const mixByYear = mixByYearOf(S, saving, drawing);
  const isaGrowth = isaGrowthOf(household);
  return {
    S, stopAge,
    people: household.people.map((p, index) => ({
      who: p.who, index, ageToday: p.age,
      pot: (p.pots && p.pots.pension) || 0,
      savings: (p.pots && p.pots.isa) || 0,
      payIn: payInOf(p),
      until: stops.own[index]
    })),
    mixByYear, charge, chargesPct, chargeM,
    // how the savings grow (6.22.0): 'cash' gives them a kernel of their own; 'invested', the pension's. Only when the
    // household says: without a choice the plan is today's, key for key (and the savings follow the pension, as always).
    ...(isaGrowth ? { isaGrowth } : {}),
    mixes: { saving, drawing }, savingLevel,
    slideYears: sameMix(saving, drawing) ? 0 : Math.min(SAVING.slideYears, S)
  };
}

/** The price level of a life at the start of each year 0 … S (P(S) is the stop's). */
function priceLevels(returns, S) {
  const P = new Float64Array(S + 1);
  P[0] = 1;
  for (let y = 1; y <= S; y++) P[y] = P[y - 1] * (1 + infOf(returns, y));
  return P;
}

/** The target mix of each saving year for a person who stops S years from now (the plan's own S: its mixByYear). */
const mixesTo = (plan, S) => (S === plan.S ? plan.mixByYear : mixByYearOf(S, plan.mixes.saving, plan.mixes.drawing));

/** The growth factors of the saving months of one life, without the charge: g(m) = Σ w × the sleeve's month. */
function growthOf(plan, life, out, S = plan.S, mixByYear = plan.mixByYear) {
  const r = life.returns;
  for (let y = 0; y < S; y++) {
    const w = mixByYear[y];
    const mEq = monthly(r.equity[y] || 0);
    const prev = y > 0 ? infOf(r, y - 1) : infOf(r, 0);
    const mCash = monthly(cashNominalReturn(prev));
    for (let m = 0; m < 12; m++) out[12 * y + m] = w.equity * mEq + w.bond * life.stream[12 * y + m] + w.cash * mCash;
  }
  return out;
}

/**
 * "Mostly cash" savings (6.22.0): the growth factors of the saving months without the charge, g_s(m) = monthly(cash(y)) —
 * the very cash factor growthOf weighs by w.cash, so a pension held all in cash and these savings grow alike.
 */
function cashGrowthOf(life, out, S) {
  const r = life.returns;
  for (let y = 0; y < S; y++) {
    const prev = y > 0 ? infOf(r, y - 1) : infOf(r, 0);
    const mCash = monthly(cashNominalReturn(prev));
    for (let m = 0; m < 12; m++) out[12 * y + m] = mCash;
  }
  return out;
}

/** The growth factors of one pot's saving months: 'cash' (savings held mostly in cash) or the plan's mix (the pension's). */
const growthFor = (plan, life, out, S, kind, mixByYear) => (kind === 'cash' ? cashGrowthOf(life, out, S) : growthOf(plan, life, out, S, mixByYear));

/** Which growth a person's pot follows: the savings of a "Mostly cash" household their own; everything else the mix. */
const kindOf = (plan, which) => (which === 'savings' && plan.isaGrowth === 'cash' ? 'cash' : 'mix');

/**
 * The growth of the saving years over the lives, shared by every person and both pots who stop at the same time (one
 * mix, one charge): F_i = F(0 → 12S) / P(S), b_{i,y}, B_i, P_i(S). One pass per stop, kept per (plan, S, lives): one
 * per stop age when the people stop together, one per person's own stop when they stop apart.
 */
const UNITS = new WeakMap();
const PASSES = new WeakMap();
/** How many saving passes a plan has made (one per distinct stop and set of lives: the work bound of brief 4.6). */
export function kernelPasses(plan) {
  return PASSES.get(plan) || 0;
}
function unitKernel(plan, lives, S = plan.S, kind = 'mix') {
  let byS = UNITS.get(plan);
  if (!byS) { byS = new Map(); UNITS.set(plan, byS); }
  const key = kind === 'cash' ? `cash:${S}` : S;                  // "Mostly cash" savings: a pass of their own (6.22.0)
  let byLives = byS.get(key);
  if (!byLives) { byLives = new WeakMap(); byS.set(key, byLives); }
  let u = byLives.get(lives);
  if (u) return u;
  const n = lives.length;
  const mixByYear = kind === 'cash' ? null : mixesTo(plan, S);
  const F = new Float64Array(n);
  const b = new Float64Array(n * S);
  const B = new Float64Array(n);
  const priceAtStop = new Float64Array(n);
  const g = new Float64Array(12 * S);
  for (let i = 0; i < n; i++) {
    const life = lives[i];
    if (S > 0 && !(life.stream && life.stream.length >= 12 * S && life.years > S)) throw new Error('saving: the lives are shorter than the saving years');
    const P = priceLevels(life.returns, S);
    growthFor(plan, life, g, S, kind, mixByYear);
    let G = 1;                                             // F(m → 12S), built from the stop backwards
    for (let m = 12 * S - 1; m >= 0; m--) {
      G *= g[m] * plan.chargeM;
      const y = (m / 12) | 0;
      b[i * S + y] += P[y] * G;
    }
    const PS = P[S];
    let sum = 0;
    for (let y = 0; y < S; y++) { b[i * S + y] /= PS; sum += b[i * S + y]; }
    F[i] = G / PS;
    B[i] = sum;
    priceAtStop[i] = PS;
  }
  u = { F, b, B, priceAtStop, n, S };
  byLives.set(lives, u);
  if (kind !== 'cash') PASSES.set(plan, (PASSES.get(plan) || 0) + 1);
  return u;
}

const personOf = (plan, person) => (typeof person === 'number' ? plan.people[person]
  : typeof person === 'string' ? plan.people.find((p) => p.who === person) : plan.people[person.index]);

/**
 * The kernel of one person's pot at their stop, over the lives (4.3): pot_i(c) = A_i + c × B_i at today's prices for
 * c a month at today's prices. With S = 0 it is { A: the pot, b: [], B: 0, priceAtStop: 1 } in every life. The stop is
 * the person's own (`until`: the plan's S when the people stop together). The savings of a "Mostly cash" household
 * (plan.isaGrowth 'cash', 6.22.0) have a kernel of their own on the cash factors; otherwise they share the pension's.
 * @param {'pension' | 'savings'} [which]
 */
export function savingKernel(plan, person, lives, which = 'pension') {
  const p = personOf(plan, person);
  const S = p.until;
  const u = unitKernel(plan, lives, S, kindOf(plan, which));
  const start = which === 'savings' ? p.savings : p.pot;
  const A = new Float64Array(u.n);
  for (let i = 0; i < u.n; i++) A[i] = S === 0 ? start : start * u.F[i];
  return { A, b: u.b, B: u.B, priceAtStop: u.priceAtStop, S, n: u.n };
}

/** Each person's pension and savings at the stop in every life, today's prices, at their pay-ins as given. */
export function potsByPerson(plan, lives) {
  return plan.people.map((p) => {
    const kp = savingKernel(plan, p, lives, 'pension');
    const ks = savingKernel(plan, p, lives, 'savings');
    const pension = new Float64Array(kp.n);
    const savings = new Float64Array(kp.n);
    for (let i = 0; i < kp.n; i++) {
      pension[i] = kp.A[i] + p.payIn.total * kp.B[i];
      savings[i] = ks.A[i] + p.payIn.savings * ks.B[i];
    }
    return { who: p.who, pension, savings };
  });
}

/**
 * One person's saving years year by year in every life (6.22.0; research/saver-lock-and-savings-growth.md 4.2 — the
 * primitive a saver's locked path is drawn from): the same monthly factors as the kernels (the mix's for the pension, and
 * for the savings unless they are "Mostly cash", when they take the cash factors), run forward month by month — each
 * month's payment in at its start, the month's growth, then the charge — with the start of each year recorded.
 *
 * Payments: absent `escalation`, the pay-ins are at today's prices and rise with prices (P(y), V7's rule), so at the stop
 * pension / P(S) and savings / P(S) are potsByPerson's to rounding. With `escalation` (a share a year, 0.02 = 2%) they are
 * pounds of the day raised by that share once a year (today's planner's "Raise contributions by").
 *
 * `savingsMix` ({ equity, bond, cash }, today's planner only — review of 6.22.0): the savings grow at that one mix every
 * year, on the same factors as the pension (the life's own shares, bond stream and cash: no new draw), whatever the plan's
 * choice says — an ISA made of the ISA funds in the planner's list of funds to test, which its runs follow. Absent: as above.
 *
 * @param {{ escalation?: number, savingsMix?: { equity: number, bond: number, cash: number } }} [opts]
 * @returns {{ S: number, n: number, pension: Float64Array, savings: Float64Array, price: Float64Array, paidIn: Float64Array }}
 *   each n × (S + 1), by life then year: [i × (S + 1) + y] is at the start of year y (y = S: the stop), pounds of the day;
 *   price is the life's price level P(y) (1 today); paidIn is what had gone in by then (pension and savings, pounds of the day).
 *   Plain numbers only: no function or life is kept.
 */
export function savingYearsByLife(plan, person, lives, opts = {}) {
  const p = personOf(plan, person);
  const S = p.until;
  const n = lives.length;
  const W = S + 1;
  const esc = Number.isFinite(opts.escalation) ? opts.escalation : null;
  const own = isIsaGrowthMix(opts.savingsMix) ? plainMix(opts.savingsMix) : null;   // the ISA funds' own mix (see above)
  const cash = !own && kindOf(plan, 'savings') === 'cash';
  const mixByYear = mixesTo(plan, S);
  const ownByYear = own ? Array.from({ length: S }, () => own) : null;
  const g = new Float64Array(12 * S);
  const gs = cash || own ? new Float64Array(12 * S) : g;
  const out = { S, n, pension: new Float64Array(n * W), savings: new Float64Array(n * W), price: new Float64Array(n * W), paidIn: new Float64Array(n * W) };
  for (let i = 0; i < n; i++) {
    const life = lives[i];
    if (S > 0 && !(life.stream && life.stream.length >= 12 * S && life.years > S)) throw new Error('saving: the lives are shorter than the saving years');
    const P = priceLevels(life.returns, S);
    growthOf(plan, life, g, S, mixByYear);
    if (cash) cashGrowthOf(life, gs, S);
    else if (own) growthOf(plan, life, gs, S, ownByYear);
    let pot = p.pot, sav = p.savings, paid = 0;
    const at = i * W;
    out.pension[at] = pot; out.savings[at] = sav; out.price[at] = P[0]; out.paidIn[at] = 0;
    for (let y = 0; y < S; y++) {
      const f = esc === null ? P[y] : Math.pow(1 + esc, y);
      const payP = p.payIn.total * f, payS = p.payIn.savings * f;
      for (let m = 12 * y; m < 12 * y + 12; m++) {
        pot = (pot + payP) * g[m] * plan.chargeM;
        sav = (sav + payS) * gs[m] * plan.chargeM;
        paid += payP + payS;
      }
      out.pension[at + y + 1] = pot; out.savings[at + y + 1] = sav; out.price[at + y + 1] = P[y + 1]; out.paidIn[at + y + 1] = paid;
    }
  }
  return out;
}

/** careful / middling / good of a list (bandIndexes positions of the sorted values), whole pounds. */
function spreadOf(values) {
  const s = Array.from(values).sort((a, b) => a - b);
  const at = bandIndexes(s.length);
  return { careful: Math.round(s[at.careful]), middling: Math.round(s[at.middling]), good: Math.round(s[at.good]) };
}

/**
 * The pots at the stop: per life, each person's { pension, savings } (today's prices, to the penny), and the household's
 * spread of the pension, the savings and the two together (careful / middling / good, whole pounds; each sorted on its own).
 */
export function potsAtStop(plan, lives) {
  const per = potsByPerson(plan, lives);
  const n = lives.length;
  const byLife = new Array(n);
  const pension = new Float64Array(n), savings = new Float64Array(n), total = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const row = {};
    for (const q of per) {
      row[q.who] = { pension: q.pension[i], savings: q.savings[i] };
      pension[i] += q.pension[i];
      savings[i] += q.savings[i];
    }
    total[i] = pension[i] + savings[i];
    byLife[i] = row;
  }
  return { byLife, spread: { pension: spreadOf(pension), savings: spreadOf(savings), total: spreadOf(total) } };
}

/** The number of lives a share of n must reach in: n less the failures the share allows (9 in 10 → n − floor(n/10)). */
export function livesNeeded(n, share) {
  return n - Math.floor(n * (1 - share) + 1e-9);
}

/** The number of lives in which A_i + c × B_i reaches `target`. */
export function reachCount(kernel, c, target) {
  let k = 0;
  for (let i = 0; i < kernel.A.length; i++) if (kernel.A[i] + c * kernel.B[i] >= target) k++;
  return k;
}

/**
 * The least monthly pay-in, in whole £10 rounded up, that reaches `target` (today's prices, at the stop) in a share ≥
 * `share` of the lives: the quantile of c_i = (target − A_i) / B_i. 0 when the pot is there already; null when more than
 * SAVING.payInCeiling would be needed (or when nothing paid in can move the pot: a stop now).
 */
export function payInFor(kernel, target, share) {
  const n = kernel.A.length;
  if (!n) return null;
  const need = Math.max(1, livesNeeded(n, share));
  const c = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const gap = target - kernel.A[i];
    c[i] = gap <= 0 ? 0 : kernel.B[i] > 0 ? gap / kernel.B[i] : Infinity;
  }
  c.sort();
  const at = c[need - 1];
  if (!(at <= SAVING.payInCeiling)) return null;
  if (at <= 0) return 0;
  let p = Math.ceil(at / 10 - 1e-9) * 10;
  while (reachCount(kernel, p, target) < need) p += 10;           // a hair of rounding in the division: the count decides
  return p > SAVING.payInCeiling ? null : p;
}

/**
 * The saving months of one person in one life (SaveRow, contract.js): pounds of the month; paid in at the start.
 * potEnd = potStart + paidIn.total + growth − charge. Each person's own months, to their own stop (none for someone
 * who has stopped).
 */
export function savingRows(plan, person, life) {
  const p = personOf(plan, person);
  const S = p.until;
  const P = priceLevels(life.returns, S);
  const g = growthOf(plan, life, new Float64Array(12 * S), S, mixesTo(plan, S));
  // the savings' own factors: the pension's, or the cash factors of a "Mostly cash" household (6.22.0)
  const gs = kindOf(plan, 'savings') === 'cash' ? cashGrowthOf(life, new Float64Array(12 * S), S) : g;
  const rows = [];
  let pot = p.pot;
  let sav = p.savings;
  for (let m = 0; m < 12 * S; m++) {
    const y = (m / 12) | 0;
    const paid = p.payIn.total * P[y];
    const paidS = p.payIn.savings * P[y];
    const grown = (pot + paid) * g[m];
    const charge = grown * (1 - plan.chargeM);
    const potEnd = grown - charge;
    const savEnd = (sav + paidS) * gs[m] * plan.chargeM;
    rows.push({
      who: p.who, m, age: p.ageToday + y,
      potStart: pot, paidIn: { total: paid, savings: paidS }, growth: grown - (pot + paid), charge, potEnd,
      savingsStart: sav, savingsIn: paidS, savingsEnd: savEnd, priceIndex: P[y]
    });
    pot = potEnd;
    sav = savEnd;
  }
  return rows;
}
