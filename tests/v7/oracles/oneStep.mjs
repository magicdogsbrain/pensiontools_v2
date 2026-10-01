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

