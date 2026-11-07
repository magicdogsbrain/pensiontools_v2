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
 *   6.35.0  Full gilt ladder / ladder + rotation: strategyParams.spareGrowth puts the money left over in a world-equity
 *           fund on the test's own futures (never drawn for income); absent = kept, holding its value, as before.
 *   6.36.0  Ladder + rotation with the money left over in shares: that money fills a year the rotated block cannot pay
 *           before the year counts as cut. Kept (no setting): not drawn, as before. Every ladder + rotation: nothing is drawn
 *           past the plan's last bought year (it drew one more, and could count it as cut), and the sleeve is valued at
 *           the start of each year like the rungs beside it (it was a year ahead); the sleeve pays only the years whose
 *           gilts were sold (a gilt straddling the cut age is kept and pays by contract); futuresMc.failYear is the
 *           first cut year (read from wealth, a kept spare hid every cut).
 *   6.37.0  Ladder + rotation: the money left over fills a rotated year the sleeve cannot pay when it is kept too (at its
 *           value). futuresMc carries the first cut year for every strategy (Floor & Flex: the first lean year; Floor to
 *           an age: the first short year after the age; Pots & Valves, Buckets: the fail year, a year earlier than the
 *           start-of-year wealth read it; Ladder & Ratchet: the fail year, which the wealth read late only for a fail in a
 *           year's last month) and, where a cut still pays part of the income, `unpaid`: the
 *           couples check asks the other plan for that, not the whole need.
 *   6.38.0  (app 7.4.1) The minimum pension age (services/PensionLock.js): no engine takes money from a pension in a plan year
 *           its holder is younger than their access age (55, or 57 for anyone not 55 by 6 April 2028): a tax year that
 *           starts with them under it (the year we are in: today) stays closed. Those years are paid from the money outside
 *           the pension — the taxable account first, the ISA last — and what it cannot pay is income cut, never a run out:
 *           every strategy's result counts it as a cut (the bought ones on `cuts` and futuresMc), protection is never on in
 *           them, and the tax-free lump waits for the year the pension opens. The pension grows untouched until it opens.
 *           Every plan whose holder can already draw in the run's first year runs exactly as before.
 *   6.39.0  (app 7.4.2) A gilt ladder's cash years are its only cash. The extra cash an older plan kept beside them
 *           is no longer added to the ladder, the run or the cash to hold, whatever the day of the run's pots:
 *           it was added for a plan whose pots waited for a later first year, and nobody retired has one. Figures move only
 *           for a plan that has some and whose pots did not yet belong to a plan year begun — a retired draft in its year 0
 *           with no stop month, a saver's ladder, a plan stored with a later start: the ladder costs less, the spare is more.
 *           Every other plan runs exactly as before.
 */
export const ENGINE_VERSION = '6.39.0';
