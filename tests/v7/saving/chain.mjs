/**
 * TEST ONLY — the reference for the locked run (step 4 brief 4.5, "Identity"). A pension closed for its first L years,
 * run inside its holder's one run (config.lockedMonths = 12L), must equal a chain of today's engine:
 *
 *   stage 1   a savings-only config over L years: no pension sleeves, no State Pension, no final-salary pension in the
 *             run, the ISA, and the locked months' targets (config.lockedSchedule) — what C's adapter builds for a
 *             person with savings only;
 *   (sleeves) the pension sleeves over the same L years with nothing drawn: the same config with a target of nought;
 *   stage 2   the pension config over D − L years, opening on those sleeves and stage 1's ISA; floors re-based to
 *             base × P(L) × (1 − L/D) (answer-A-and-B.md 3.2: exact under the engine's straight-line run-down), the
 *             cash target, targets, tax bands, State Pension, final-salary pension and incomes × P(L); their start
 *             (and end) years less L, floored at 0; the life read on from month 12(S + L).
 *
 * Exact with an all-shares mix (no bond or cash sleeve, so the bond model's stream and the first year's cash rate play
 * no part); with bonds in the mix the two differ by the stream, and only determinism is asserted.
 */
import { simulate, sliceReturns } from './_saving.js';

const zeros = (n) => new Array(n).fill(0);

/** The price level of the drawing years' year L, as the engine counts it (1 in year 0). */
function priceAt(returns, L) {
  let c = 1;
  for (let y = 1; y <= L; y++) c *= (1 + (returns.inflation[y] || 0.025));
  return c;
}

/**
 * @param {object} config   a locked config (lockedMonths 12L > 0, lockedSchedule), the life's pots already in it
 * @param {object} life     from livesList
 * @param {number} S        the saving years before the stop
 * @returns {{ failed: boolean, failMonth: number|null, equity: number, bond: number, cash: number, isa: number, stages: object[] }}
 */
export function chainRun(config, life, S) {
  const D = config.years;
  const L = config.lockedMonths / 12;
  if (!Number.isInteger(L) || L <= 0 || L >= D) throw new Error(`chainRun: lockedMonths ${config.lockedMonths} for ${D} years`);
  const { lockedMonths, lockedSchedule, ...plain } = config;

  const stage1 = {
    ...plain,
    equityStart: 0, bondStart: 0, cashStart: 0, equityMin: 0, bondMin: 0, cashTarget: 0,
    years: L, duration: L, spWeeklyAmount: 0, dbAmount: 0, extraIncomes: [], accessMethod: 'drawdown',
    targetSchedule: lockedSchedule.slice(0, L), baseSalary: lockedSchedule[0]
  };
  const r1 = simulate(stage1, sliceReturns(life, S, L), life.seed);
  if (r1.failed) return { failed: true, failMonth: r1.failMonth, equity: NaN, bond: NaN, cash: NaN, isa: r1.finalIsa, stages: [r1] };

  const idle = { ...plain, years: L, duration: L, targetSchedule: zeros(L), baseSalary: 0, isaBalance: 0, spWeeklyAmount: 0, dbAmount: 0, extraIncomes: [] };
  const g = simulate(idle, sliceReturns(life, S, L), life.seed);

  const P = priceAt(sliceReturns(life, S, D), L);
  const shift = (y) => Math.max(0, (y || 0) - L);
  const stage2 = {
    ...plain,
    years: D - L, duration: D - L,
    equityStart: g.finalEquity, bondStart: g.finalBond, cashStart: g.finalCash,
    equityMin: plain.equityMin * P * (1 - L / D), bondMin: plain.bondMin * P * (1 - L / D), cashTarget: plain.cashTarget * P,
    pa: plain.pa * P, brl: plain.brl * P, hrl: plain.hrl * P,
    spWeeklyAmount: plain.spWeeklyAmount * P, spStartYear: shift(plain.spStartYear),
    dbAmount: (plain.dbAmount || 0) * P, dbStartYear: shift(plain.dbStartYear),
    extraIncomes: (plain.extraIncomes || []).filter((e) => e.endYear == null || e.endYear >= L)
      .map((e) => ({ ...e, annual: e.annual * P, startYear: shift(e.startYear), endYear: e.endYear == null ? null : e.endYear - L })),
    targetSchedule: plain.targetSchedule.slice(L).map((t) => t * P),
    baseSalary: plain.targetSchedule[L] * P,
    isaBalance: r1.finalIsa
  };
  const r2 = simulate(stage2, sliceReturns(life, S + L, D - L), life.seed);
  return {
    failed: r2.failed, failMonth: r2.failed ? r2.failMonth + 12 * L : null,
    equity: r2.finalEquity, bond: r2.finalBond, cash: r2.finalCash, isa: r2.finalIsa,
    stages: [r1, g, r2]
  };
}
