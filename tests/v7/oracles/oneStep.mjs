/**
 * ONE STEP — our decision of 1 Oct 2026 on step 4 brief section 10, J16.
 *
 * Today's engine is not monotone at the £10 grain for some households: "this future lasts at £k a month" can be true at
 * k and false at a lower k (tests/v7/c/exceptions.md, engine behaviour 6 — very large pots and savings, spends above
 * £10,000 a month, a tax edge). The band search, the pot search and the pay-in search all assume it is monotone, so
 * where it is not, "more never pays less" can come out one step the wrong way: more in, and the careful amount £10
 * lower, the number £1,000 higher, the pay-in £10 higher, one life fewer.
 *
 * Those relations — more in (a pot, a pension, a pay-in, part-time pay) never pays less; less spent never needs more —
 * allow ONE step, and no more: £10 a month of an amount or a pay-in, £1,000 of a pot, one life of a count. A verdict may
 * be a grade lower only with the count it follows, and a bad-case age is asserted while the count holds. Everything a
 * search does not make stays exact (the pots at the stop, the guaranteed income, the verdict at a spend — one run per
 * life). Every other relation is strict, "the same answer twice" included: a second call no longer starts its search
 * from the first one's amounts (only a pass over fewer futures is a hint: C's and A's answer.js), so it is exact again.
 * Each relation that uses this says so in its name, and the question's exceptions.md lists it with its counterexample.
 */

import { RULES } from '../../../src/answers/shared/rules.js';
import { ukTax } from './ukTax.mjs';
import { BANDS } from '../../../src/answers/shared/toEngine.js';
import { livesList, sliceReturns } from '../../../src/answers/shared/lives.js';
import { priceIndexByYear } from '../../../src/answers/shared/futures.js';
import { netToGross } from '../../../src/services/TaxCalculator.js';

export const STEP = Object.freeze({ amount: 10, payIn: 10, pot: 1000 });

/** One life of n, as a share (with room for the float). */
export const oneLife = (n) => 1 / n + 1e-9;

/**
 * An amount of £10,000 a month or more (each of the three amounts on its own; a household's counts go by its careful
 * amount; for B, the spend). One step is not enough there, and the NIGHTLY=1 runs of 1 Oct 2026 found every miss of more
 * than one step at that size, none below (B's number moved £2,000 for £10 less at exactly £10,000 a month, seed 1524597785):
 *   - a couple's two pots drain in a fixed ratio (tests/v7/c/exceptions.md 4), and more for ONE of them — a pot, a
 *     pension, part-time pay — moves the ratio, so the band can fall in proportion to the amount (0.2% to 1.3% measured:
 *     more than £10 only above about £10,000 a month) — a real property of today's model, not a search artefact;
 *   - one person drawing £100,000 a month and more (a one-year plan on £1,000,000; the £100,000 point fixed in pounds of
 *     the day, exceptions.md 1) and B's number at spends over £10,000 a month moved two steps and more.
 * J16 saw the same: its misses were at spends of £10,000 to £13,000 a month and pots of £1,000,000 to £10,000,000. So the
 * relations of the family print a fall above that size as a finding instead of asserting it; below it, one step holds.
 */
export const LARGE_A_MONTH = 10_000;
export const largeHousehold = (amountAMonth) => amountAMonth >= LARGE_A_MONTH;

/**
 * Each of the three amounts no lower than before, to one step — or, for an amount of £10,000 a month or more, a fall of
 * more than a step handed to `onFinding(which)` instead of asserted. `assert(which, floor)` makes the assertion.
 */
export function amountsToAStep(from, to, assert, onFinding) {
  for (const k of ['careful', 'middling', 'good']) {
    if (largeHousehold(from[k])) { if (to[k] < from[k] - STEP.amount) onFinding(k); }
    else assert(k, from[k] - STEP.amount);
  }
}

/**
 * A couple's fixed-ratio drain binding on the run taxed from the first pound (tests/v7/c/exceptions.md, "A couple's
 * fixed-ratio drain on the run taxed from the first pound"; the same in tests/v7/a/exceptions.md). The household's need
 * is shared between the runs by their money BEFORE tax (toEngine.js sharesOf), and the runs drain in that ratio. When the
 * pension pounds `who` draws are taxed at the margin — their guaranteed income in payment at the plan's start fills their
 * personal allowance, so every pension pound is taxed from the first (worth about 85p after tax, a quarter tax-free and
 * the rest at 20%), or their draw at the start reaches past what the allowance leaves — while a pound of the savings
 * beside it is worth a pound: more pension in THAT person's run raises its share of the need by more than it raises what
 * the run can pay, and when that run is the one that binds the band can fall by more than a step (a NIGHTLY=1 run, 27 Oct
 * 2026, seed -1409477014: you 67 with £1 and the full State Pension, your partner 18 with £1,073,100, £150,000 of savings
 * held as cash, the money from their 57, no charge — £1,816 more in your pot moved the careful amount from £6,830 to
 * £6,810; future 4's most £6,832 → £6,819 at £1 grain). With pension money alone in a run its means and its share move
 * together — a run of pension only binds when 85p of the household's whole money is short, whatever its own size — so a
 * raise of the POT needs savings beside the pension (a raise of the income that fills the allowance is another matter:
 * it can set a run of pension alone against a cheaper run, raiseTakesRoom below, 3 Nov 2026); the charged couple's
 * fall (the same section) is the same mechanism with the charge picking the binding run. The relations that raise one
 * person's money print a fall for such a couple as a finding, not an assertion.
 *
 * The allowance need not be filled: with room left, the draw's taxable part (three quarters of it) fills the rest, and the
 * marginal pound is taxed just the same. A hunt on the night's household with your State Pension typed as a forecast
 * (27 Oct 2026; £10,000 more in your pot): £12,400 a year moved the careful amount £6,810 → £6,750, £12,000 £6,780 →
 * £6,730, £11,500 £6,740 → £6,700, £11,000 £6,700 → £6,670, £10,500 £6,660 → £6,640; £10,000 no fall; £9,000 and under
 * a rise. With £300,000 of savings and the plan to 90, £50,000 more moved the good amount £6,330 → £6,310 at £9,500 and
 * £6,370 → £6,340 at £10,000. So the boundary is the household's, where its draw meets the tax, and the guard reads it
 * from `who`'s row of the first phase (`phases`: the answer's, £ a month, at the careful amount on the starting pots;
 * byPerson with who, statePension, finalSalary, work, tax): their tax there is above what their guaranteed income (and
 * part-time pay, A) alone would cost (tests/v7/oracles/ukTax.mjs, a pound of room for the pence) — or that income is
 * within a step a month of the allowance on its own (the full State Pension is £22.40 under it), where the display's
 * tax-efficient order may draw the savings first and show no pension draw at all (an income at the basic-rate limit),
 * every pension pound taxed whenever it is drawn. On the grid of that household (savings £150,000 / £300,000 /
 * £1,000,000, to 75 / 90, nine State Pensions, three raises) the predicate is true at every fall; over 600 random M1
 * couples with savings, no charge over 1%, no tax-free part had and under £10,000 a month, the draw's half names 11 the
 * allowance's does not and 28 are left asserted — none of those 39 fell under the three raises, and the one fall found
 * was the allowance's (you 75 with £1 and the full State Pension, your partner 57 with £150,000, £1 of savings: £1,816
 * more in your pot moved the good amount £4,170 → £4,030). The real lever is the answer's — sharing the need by each
 * run's after-tax means (sharesOf) — our decision, noted in both ledgers.
 *
 * The income that fills the allowance can be part-time pay (A's, yours), so the allowance half counts it with the
 * guaranteed income: it is in payment from the stop as they are, for its years. The night run of 2 Nov 2026 (A's PA1,
 * seed 19198510, 20 futures): a couple, you 56 with nothing in the pot and £1,500 a month going in, your partner 57 with
 * £1,073,100 and £1,500 a month, £150,000 of savings held as cash, stopping at 57, spending £1 a month, part-time £15,302
 * a year for seven years, no charge, to 75 — £334 a month more going in moved the careful amount £6,620 → £6,600 (two
 * steps) while the middling held and the good rose. The careful life's most fell £6,620 → £6,609 at £1 grain, your run
 * the one that runs out both times and "lasts at k" monotone at every step around it: the drain above, the pay filling
 * your allowance for the first seven years in place of a State Pension. The tax half could not see it — A's phases are
 * at the spend (answer.js, phasesAt at spendAYear), not the careful amount, and at £1 a month nothing is drawn from any
 * pot, so your tax in the first phase was exactly the pay's own (tests/v7/a/exceptions.md, the same section). C has no
 * part-time pay, so nothing changes for C.
 */
export function drawTaxedAtStart(phases, who) {
  const first = Array.isArray(phases) && phases.length ? phases[0] : null;
  const me = first && Array.isArray(first.byPerson) ? first.byPerson.find((x) => x.who === who) : null;
  if (!me) return false;
  const guaranteed = ((me.statePension || 0) + (me.finalSalary || 0)) * 12;
  const pay = (me.work || 0) * 12;                                   // part-time pay (A's, yours): in payment from the stop
  if (guaranteed + pay >= RULES.personalAllowance - 12 * STEP.amount) return true;
  return (me.tax || 0) * 12 > ukTax(guaranteed + pay) + 1;
}

/** `who`'s guaranteed income in payment in the first phase (and part-time pay, A's), £ a year; null when they are not in it. */
function guaranteedAtStart(phases, who) {
  const first = Array.isArray(phases) && phases.length ? phases[0] : null;
  const me = first && Array.isArray(first.byPerson) ? first.byPerson.find((x) => x.who === who) : null;
  return me ? ((me.statePension || 0) + (me.finalSalary || 0) + (me.work || 0)) * 12 : null;
}

/**
 * A raise of `who`'s guaranteed income that sets their run, taxed at the margin, against a cheaper run beside it (the
 * night run of 3 Nov 2026, C's M2, seed 653389393, 20 futures). A couple with no savings: you 66 with £1 in your pot and
 * the full State Pension, your partner 18 with £1,073,100 and the full one, adventurous, no charge, the money from now —
 * moved, as C moves it, to your partner's 57, when the larger pension opens (you are then 105) — to 75. £100 a year more
 * State Pension for you (£12,547.60 → £12,647.60, a forecast) moved the careful amount £6,270 → £6,150, twelve steps,
 * while the middling rose a step and the good held. Your run is £1 of pension beside the State Pension. The full State
 * Pension leaves £22.40 of your allowance, and your share of the need (one in a million, by the money before tax:
 * toEngine.js sharesOf) is about 6p a year, drawn at 0% inside that room; £100 more fills the allowance, so every pound
 * you draw is taxed from the first (the draw £0.0049 → £0.0056 a month), while the partner, with no State Pension until
 * 68, draws about £69,000 a year through a free allowance, the basic band and a slice of the higher, about 88p a pound on
 * average. The two runs drain in a fixed ratio (tests/v7/c/exceptions.md, engine behaviour 4), so the dearer run drains
 * faster and binds: in the careful future your £1 ends the plan with 21p left at £6,270 before the raise and 0.2p at
 * £6,150 after it, while the partner's pot ends with £55,162 to spare — the band is set by whether a £1 pot lasts, and
 * falls a step at a time until it does. The fall is the room the raise takes from your draw, against what your run draws:
 * with £10,000 in your pot it fell three steps, with £100,000 it held; with both allowances filled before the raise (the
 * partner 66 too) the amounts rose; cautious held, the partner's run binding either way; with £150,000 of savings a rise.
 * The 27 Oct line that a fall "needs savings beside the pension" is a raise of the POT's, where a pension run's means and
 * its share move together.
 *
 * So the guard for the relations that raise `who`'s guaranteed income (C's M2) is three halves, read on the first phase:
 * the raise took up room `who`'s income had left in their allowance (raiseTakesRoom: under it before, more after), `who`
 * is taxed at the margin after it (drawTaxedAtStart on the answer with more), and the other person's allowance has room
 * there (allowanceRoomAtStart), so theirs is the cheaper run. A raise for someone whose income already filled the
 * allowance moves nothing onto their draw and is held to one step. Over 4,534 random M2 couples with a pot of yours (two
 * seeds, 20 futures), the three halves together name 56 that the guards before them did not (the draw's and the room's
 * halves without the first would name 142), and each of the three falls found there (all printed already, under the
 * charge, the tax-free part or savings) was a raise that took up room. The lever is the same, the answer's: sharing the
 * need by each run's after-tax means (sharesOf), our decision, noted in both ledgers.
 */
export function raiseTakesRoom(before, after, who) {
  const was = guaranteedAtStart(before, who);
  const now = guaranteedAtStart(after, who);
  return was !== null && now !== null && was < RULES.personalAllowance && now > was;
}

/**
 * Whether `who`'s guaranteed income at the start leaves room in their personal allowance (more than a step a month of
 * it): their first pension pounds are drawn at 0%, so the pounds of their run are worth more on average than those of a
 * run taxed from the first (about 85p). The other half of the raise's guard above.
 */
export function allowanceRoomAtStart(phases, who) {
  const guaranteed = guaranteedAtStart(phases, who);
  return guaranteed !== null && guaranteed < RULES.personalAllowance - 12 * STEP.amount;
}

/**
 * The £100,000 point fixed in pounds of the day, reached while the savings alone pay (the night run of 2 Nov 2026, PB4,
 * seed 1515732724: one person of 18 with nothing in the pot and nothing going in, stopping at 19 on £2,608 a month, no
 * savings, cautious, no charge — the careful number £25,000, and £23,000 at £3,108, two steps the wrong way). The engine
 * keeps the point where the allowance is withdrawn at £100,000 in pounds of the day while the bands rise with prices
 * (tests/v7/c/exceptions.md, engine behaviour 1; RULES.taperFrom). In B's closed years — the pension shut at the stop,
 * the savings paying — the locked run is given the before-tax equivalent of what the savings must pay (toEngine.js
 * savingsTargetFor) and the ISA pays its after-tax value month by month (fastEngine.js, the locked months): once that
 * target, inflated, passes £100,000 in a life, the engine's tax on it has the taper in it, the ISA pays less than the
 * need, and the life does not run out — it quietly gets less. So in such a life the closed years cost LESS per pound of
 * draw the higher the spend: that household's worst life needed 1.052 of its flat 38-year draw at £2,608, 1.049 at
 * £3,108, 1.042 at £3,488 and 1.017 at £4,108; with the point pushed out of reach, 1.052 at every spend, and the number
 * rose with the spend (£32,000, £38,000, £43,000, £51,000) instead of falling (£25,000, £23,000, £20,000, £34,000). The
 * number there is a residual: the floor the worst life sets (£1,251,000), less what it leaves the third-worst life,
 * against seven years of spend — £25,000 — so a bend of a per cent in two lives' closed-years costs, each bending at its
 * own rate, is many steps of the number. Not a search artefact and not the answer's fault: the figures are right about
 * what the engine does, and the fix (the point rising with prices) is the engine's and ours to decide, since it would move
 * every figure in every question and the planner too.
 *
 * True when, in some life, the before-tax target of the closed years (what the savings pay a year over them, grossed up
 * at today's bands as the adapter does) passes RULES.taperFrom in that life's pounds of the day during the closed years —
 * the engine's own price level from the stop (fastEngine.js prepareFutureFrom: 1 in the stop's year, then each year's
 * rise as it begins, which priceIndexByYear over the life's years from the stop reproduces). PB4 and M-B2 print a move
 * of more than a step as a finding for such a household and assert every other. PB4's narrowing to spends of £5,000 a
 * month and less is the same point read in today's pounds; a closed stretch of decades at high inflation carries a
 * household past it anyway. Read on the answer with the higher spend (the target is higher, so a life that reaches the
 * point at the lower spend reaches it there too).
 */
export function pointReachedInClosedYears(answer, env) {
  if (!answer || !answer.outside || !(answer.gapYears > 0) || !answer.years) return false;
  const S = answer.years.saving;
  const years = answer.gapYears;
  const need = answer.outside.amount / years;                       // what the savings pay a year over the closed years, today's prices
  const target = need > 0 ? netToGross(need, BANDS.pa, BANDS.brl, BANDS.hrl) : 0;
  if (!(target > 0)) return false;
  const lives = livesList(env.futures, S + years, env);
  return lives.some((life) => priceIndexByYear(sliceReturns(life, S, years), years).some((level) => target * level > RULES.taperFrom));
}
