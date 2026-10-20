/**
 * Engine version pinned at plan lock. Bump when any strategy's semantics change.
 * It is a STAMP: nothing compares it or re-runs a plan because of it. A plan locked under an earlier
 * engine keeps the version (and the plan document) it was locked with.
 *   6.13.4  the Monte Carlo random stream changed (sfc32 replaces the sine generator — src/utils/MathUtils.js),
 *           and State Pension first-year shares count calendar days (no clock-change hour).
 *   6.15.0  protection (Pots & Valves): the diversifiers sleeve's glidepath is its starting value raised by
 *           inflation and run down over the plan, like shares and bonds (it was flat in pounds); every
 *           protection comparison, entering and leaving, is made in whole pennies — in both engines.
 *   6.34.0  Full gilt ladder / ladder + rotation: a rung not yet repaid is valued at its accreted value (cost rising to
 *           what it pays at its purchase yield), never at cost; the rotation's kept cash years at what they cost; an
 *           unfired rotation block is its unpaid years only (it was counted again after paying out).
 */
export const ENGINE_VERSION = '6.34.0';
