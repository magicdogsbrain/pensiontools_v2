/**
 * ONE STEP — the owner's decision of 1 Oct 2026 on step 4 brief section 10, J16.
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
 * together — a run of pension only binds when 85p of the household's whole money is short, whatever its own size — so the
 * fall needs savings beside the pension; the charged couple's fall (the same section) is the same mechanism with the
 * charge picking the binding run. The relations that raise one person's money print a fall for such a couple as a
 * finding, not an assertion.
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
 * run's after-tax means (sharesOf) — the owner's decision, noted in both ledgers.
 */
export function drawTaxedAtStart(phases, who) {
  const first = Array.isArray(phases) && phases.length ? phases[0] : null;
  const me = first && Array.isArray(first.byPerson) ? first.byPerson.find((x) => x.who === who) : null;
  if (!me) return false;
  const guaranteed = ((me.statePension || 0) + (me.finalSalary || 0)) * 12;
  if (guaranteed >= RULES.personalAllowance - 12 * STEP.amount) return true;
  return (me.tax || 0) * 12 > ukTax(guaranteed + (me.work || 0) * 12) + 1;
}
