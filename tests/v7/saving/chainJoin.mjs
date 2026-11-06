/**
 * TEST ONLY — the reference for the hand-over at the second stop (research/v7/couples-different-years.md 4.3 f, 9.1 I8).
 * A couple's joined run — the first to stop drawing alone from the household's start, the hand-over at the second stop
 * setting the shares again on what each has then, the other's run from their own stop — must equal a chain of today's
 * engine:
 *
 *   stage 1   the first stopper's config over the G years apart: `simulate` with years G (its duration, and so its floors,
 *             as in the joined run), on the life read from the household's start;
 *   (join)    the hand-over (toEngine.js joinAt) fed stage 1's end pots and the run's price level at year G;
 *   stage 2   the first stopper again, from the second stop: a fresh config over D − G years opening on stage 1's pots,
 *             floors re-based to base × P(G) × (1 − G/D) (exact under the engine's straight-line run-down, as chain.mjs),
 *             the cash target, tax bands, State Pension, final-salary pension and incomes × P(G), their start years less
 *             G (floored at 0), the targets the hand-over set × P(G); the life read on from month 12(S0 + G);
 *   joiner    `simulate` on the joiner's config the hand-over made, on the life read from their own stop.
 *
 * failMonth: the earliest of stage 1's, stage 2's + 12G and the joiner's + 12G (household clock). After the second stop that
 * is the first run-out, where the stop runner's pass-on happens (2 Oct 2026: from that month the other's money pays all),
 * so the joined run equals the chain up to it, and runs out then or later.
 *
 * Exact with an all-shares mix (no bond or cash sleeve, so the bond model's stream and the first year's cash rate play
 * no part) and the tax-free part already taken (no allowance to carry across the cut); under "None of it" (no cover
 * months, which `simulate` cannot run). Elsewhere only determinism is asserted.
 */
import { simulate, sliceReturns } from './_saving.js';
import { joinAt } from '../../../src/answers/shared/toEngine.js';

/** The price level of the drawing years' year L, as the engine counts it (1 in year 0). */
function priceAt(returns, L) {
  let c = 1;
  for (let y = 1; y <= L; y++) c *= (1 + (returns.inflation[y] || 0.025));
  return c;
}

/**
 * @param {object} sp       stopAtPlan(...) of an apart household
 * @param {number} H        the household take-home a year
 * @param {number} i        the life
 * @param {{ joined: object, config: object }} wrapper   the joined entry's config (configsAt / configsAtH)
 */
export function chainJoin(sp, H, i, wrapper) {
  const plan = sp.plan;
  const { joined, config } = wrapper;
  const G = plan.apart.years;
  const D = config.years;
  const life = sp.lives[i];
  const S = sp.S;
  const { coverMonths, ...plain } = config;
  if (coverMonths > 0) throw new Error('chainJoin: `simulate` cannot run cover months (use "None of it")');

  const stage1 = { ...plain, years: G };            // duration D kept: the floors are the joined run's own
  const r1 = simulate(stage1, sliceReturns(life, S, G), life.seed);
  if (r1.failed) return { failed: true, failMonth: r1.failMonth, first: null, join: null, stages: [r1] };

  const P = priceAt(sliceReturns(life, S, D), G);
  const hand = joinAt(plan, H, joined.pots, { equity: r1.finalEquity, bond: r1.finalBond, cash: r1.finalCash, isa: r1.finalIsa, cumInf: P });
  const target = hand.first.targetSchedule;
  const shift = (y) => Math.max(0, (y || 0) - G);
  const stage2 = {
    ...plain,
    years: D - G, duration: D - G,
    equityStart: r1.finalEquity, bondStart: r1.finalBond, cashStart: r1.finalCash, isaBalance: r1.finalIsa,
    equityMin: plain.equityMin * P * (1 - G / D), bondMin: plain.bondMin * P * (1 - G / D), cashTarget: plain.cashTarget * P,
    pa: plain.pa * P, brl: plain.brl * P, hrl: plain.hrl * P,
    spWeeklyAmount: plain.spWeeklyAmount * P, spStartYear: shift(plain.spStartYear),
    dbAmount: (plain.dbAmount || 0) * P, dbStartYear: shift(plain.dbStartYear),
    extraIncomes: (plain.extraIncomes || []).filter((e) => e.endYear == null || e.endYear >= G)
      .map((e) => ({ ...e, annual: e.annual * P, startYear: shift(e.startYear), endYear: e.endYear == null ? null : e.endYear - G })),
    targetSchedule: target.slice(G).map((t) => t * P),
    baseSalary: target[G] * P
  };
  if (stage2.lockedMonths !== undefined) {
    // a pension still closed at the join stays closed for the rest of its months, from the new start
    stage2.lockedMonths = Math.max(0, plain.lockedMonths - 12 * G);
    stage2.lockedSchedule = (hand.first.lockedSchedule || plain.lockedSchedule).slice(G).map((t) => t * P);
    if (stage2.lockedMonths > 0) throw new Error('chainJoin: a pension still closed at the join is not covered by the chain');
    delete stage2.lockedMonths; delete stage2.lockedSchedule;
  }
  const r2 = simulate(stage2, sliceReturns(life, S + G, D - G), life.seed);
  const rj = simulate(hand.join.config, sliceReturns(life, S + G, D - G), life.seed);
  const months = [r2.failed ? r2.failMonth + 12 * G : null, rj.failed ? rj.failMonth + 12 * G : null].filter((m) => m !== null);
  const failMonth = months.length ? Math.min(...months) : null;
  return {
    failed: failMonth !== null, failMonth,
    first: { equity: r2.finalEquity, bond: r2.finalBond, cash: r2.finalCash, isa: r2.finalIsa },
    join: { equity: rj.finalEquity, bond: rj.finalBond, cash: rj.finalCash, isa: rj.finalIsa },
    stages: [r1, r2, rj]
  };
}
