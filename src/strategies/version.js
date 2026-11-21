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
 *   6.40.0  (NEXT: the stamp moves to it with the release that ships it, beside that release's notes, which
 *           tests/releases.test.js holds to this constant; until then the constant stays 6.39.0)
 *           The income that comes anyway (State Pension, a final-salary pension, other income: strategies/incomeAnyway.js)
 *           is counted after a run has run out of money: Pots & Valves and Buckets in order (histories, futures, named starts,
 *           the compare's canned decades) and Ladder & Ratchet. Their "worst 12 months" is never £0 while such income is
 *           paid, and the Pots & Valves family's income cone carries it in the years after the money ran out (it was £0).
 *           The guaranteed line names every source of that income ("State Pension (being paid now) and final-salary pension
 *           £6,000 a year (from age 60)"), where it said "State Pension only". The bought ways' line names the same
 *           sources after what the contract buys ("85 by contract (every year bought today); plus State Pension (from age
 *           67)"; Bridge & engine's "then the engine + State Pension" leaves the State Pension to that list). That change
 *           moves no chance, run-out age or amount left.
 *           Year 0 for the months it has: a saver's full gilt ladder (and the ladder + rotation built on it) buys its
 *           first tax year only for the months from the month work stops to March (PlanTiming.year0MonthsOf), less the
 *           State Pension paid in those same months (a State Pension that starts in that tax year pays only the months
 *           both hold). The ladder costs less and the money left over is more, by the months not bought; a plan whose
 *           first year is a whole tax year runs exactly as before. Pots & Valves and Buckets in order do the same
 *           (SimulationEngine `year0Months`): the months of year 0 before the stop month take nothing from the pots, and
 *           their worst 12 months and year 0's income count only the months from the stop; the other bought ways (the
 *           floors, Bridge & engine, Ladder & Ratchet's base ladder) buy and pay that share of year 0 (compareRunner).
 *           A saver whose stop falls after April: less drawn in year 0, so more left at the end and fewer futures run
 *           out.
 *           A part year is one sum in every way (services/PaidYear.js paidYearOf): for a plan year of m months, the
 *           spending for those months, the State Pension and other income that arrive in them, and so what the pots or
 *           the contract pay. The floors, Bridge & engine, Floor & Flex and Ladder & Ratchet took a whole year's State
 *           Pension off a part year 0 and then scaled it (stop in November, State Pension from January: they bought
 *           £6,667 where the ladder and the pots pay £8,667); now every way asks the same need. In any year a State
 *           Pension starts in, the bought ways count the share of that tax year it is paid in, as the ladder and the pots
 *           always did (they took off a whole year's): those years cost a little more to buy. Every way's income cone shows
 *           a part year 0 for its months (with its State Pension and other income for those months; the full gilt ladder's
 *           cone said a whole year), the plan document's year-by-year table says the same year 0 as its cone, Floor & Flex
 *           pays no treats in the months before the plan starts, and no way reads a part year 0 as its worst 12 months.
 *           One axis for the current plan year: a plan whose year 0 is behind it runs its current year from the month of
 *           its pots' day to March, then whole tax years, as the same plan made today does (it ran the twelve months from
 *           the pots' day). A retired plan locked in its year 0 with no position recorded runs year 0 from the month it was
 *           locked (its pots are that day's; it was read from today's month), derived on read.
 *           The household split counts a retired person's years from this tax year, and a State Pension already being
 *           paid as paid (never years away).
 *           A retired plan's year 0 pays for the months it has too: its pots are today's, so year 0 runs from this month (or
 *           a locked plan's recorded month) to March, the months already gone left out (PlanTiming.year0MonthsOf, mode
 *           'retired'). Counted in whole months: this month counts whole, and so does the month a State Pension starts in.
 *           A State Pension already being paid pays every month of that part year (it paid only the share of a year it had
 *           in the tax year it began, and was spread over twelve months); one starting later in it pays from its month to
 *           March (PlanTiming.year0SpMonthsOf; a saver's part year 0 counts its State Pension the same way). A State
 *           Pension begun in a tax year before the plan's first is paid for the whole of year 0 (it was the share of its
 *           own first year). A retired plan read after April: less drawn in year 0, so fewer futures run out; read in
 *           April, nothing moves but that State Pension share. The question answers on the plan path take the same months
 *           (fastEngine covers them, run by run equal to the engine).
 *           The State Pension's first tax year is counted in whole months in every year, not only in a part year 0 (from
 *           6 January: January to March, 3/12; it was 91/366 by days), in Pots & Valves, every bought way and the Decision
 *           tool's year table alike. Money paid before the pots — a lump sum, the taxable account, the ISA in the years the
 *           pension is closed — pays each year's need for the months it has and after the State Pension in them (it was
 *           charged a whole year's need in a part year 0, and a whole need on top of the State Pension in any year): a
 *           £50,000 taxable account with a State Pension of £12,000 lasts years longer on the bought ways, as it does in
 *           Pots & Valves. Floor & Flex's floor takes off the other income (a final-salary pension, an annuity, that money)
 *           as every other way does; it took off only the State Pension and bought the rest twice over.
 *           The months of a part year 0 before it pays (before the stop, or before the pots' day) give the pots nothing:
 *           they are that day's pots, in today's money, so in every way (Pots & Valves and Buckets, the quick engine, the
 *           floors, Bridge & engine, Floor & Flex, Ladder & Ratchet, the gilt ladder's money left over in shares and the
 *           rotation) they take no return and no charge in those months, and the rotation cannot fire in them. The pots
 *           grew through them (up to 11 months of returns more than the plan has: a plan read in November with shares
 *           up 12% in the year started its first paying month with 7% more in shares). Pots & Valves's pots move with
 *           prices only in those months, by the twelfth of the rise it counts at the start of year 1, so in today's money
 *           they hold their worth. Plans whose year 0 is part of a year: less in the pots when year 0 starts paying, so less
 *           left at the end and a few more futures that run out; a whole first year runs exactly as before.
 *           "Try the bad years" starts its fall (and its faster prices) in that first paying month, where the pots are
 *           first held (lastsRun.rowPlanOf); it started in the run's month 0, which is now a month that moves nothing.
 *           A plan still saving runs whole lives in Pots & Valves and Buckets in order (lead4-engine.md ruling 8): each future
 *           is one life that saves its own pots on its own markets (the saving path's lives, services/SavingPath.js) and then
 *           draws from them on the same life's markets from the stop; it drew every future from one middling pot at the stop,
 *           on markets that started again at the stop. The pots at the stop said on the plan are the middle of those same
 *           lives, with their 1-in-10 low and high, as before. The engine's own draws (the bond model) start at the stop, as
 *           every run's do. A plan locked from now keeps those lives' figures with its pots at the stop, so it runs the same
 *           lives as when it was locked. A plan whose pots at the stop the person typed, a plan locked before (its document's
 *           one pot), a stop this year, the real histories and the named starts run on the one pot as before.
 *           The ways that buy their income (the full gilt ladder and the rotation built on it, the floors, Bridge & engine,
 *           Ladder & Ratchet) read the same lives for a plan still saving (ruling 7): each life buys the way with its own
 *           pot at the stop (the pension and the savings it may use, scaled from the middle as a Pots & Valves life is), or
 *           cannot and fails in year 0 with nothing bought or left; a life that buys it lasts as the way's own test at the
 *           middle pot says it does in that future (a sleeve's market is that future's, at the middle pot's sleeve). It
 *           priced one middling pot: a saver's full gilt ladder said "lasts in every future" where some lives' pots at the
 *           stop cannot buy it. The verdict on "What you pay in" reads the plan's own way (it was worked out as pots).
 *           A couple's household run (lead4-engine.md ruling 9) is the two plans' own runs (answers/keep/planPath.js
 *           coupleCaseOf): "Will it last?", "How much can I take?" from now and the "When could I stop?" row at which both
 *           stop today, for a couple, run on the two plans keeping
 *           would write, each its own Pots & Valves run with its own tax bands, State Pension share and glidepath, on the
 *           same futures, the household's money one: once one plan's pots cannot pay its part, the other's pay what that
 *           one's own income that comes anyway does not cover (a pension whose rises are capped buys less when prices rise
 *           faster), and the household runs out when the money left cannot pay both parts; a future is weighed by the chance either
 *           of the two is alive at the start of the year it ran out in (it was the household model's own run, weighed month
 *           by month). Two linked plans say that same household figure (householdRun.householdLastsOf). The answers'
 *           amounts for a couple move, for some by over £100 a month (each plan taxes and shares its own); a one-person household is the plan
 *           test, as before. A couple with someone under the age a pension can be touched today is on the two plans too:
 *           each plan pays its own closed years from its own savings as the household's split gives them, the other's money
 *           after, and the plan-to age is the kept plans' (it ran to the household model's end age). A couple who stop in
 *           different years, and a couple from a later stop stay on the household model's own run for now. Two linked plans
 *           set to different levels read the household's verdict at the more careful of the two (it was the level of the
 *           plan it was read from, so the two plans could give two verdicts for one chance).
 *           Keeping a couple's answer writes two plans whose spending adds up to the amount asked (each one's part cut in
 *           proportion where the incomes that come anyway pay more than it, as one person's plan spends the amount itself);
 *           it wrote each one's take-home as all of their own income that comes anyway. Two linked plans that draw from
 *           different tax years (one still saving) are read on two clocks: each from its own first draw year, a plan still
 *           saving on its whole lives, the ages the younger's from this tax year, a run-out before the other plan draws
 *           ending the household (they were read on one clock from year 0, then refused), its chance weighed from the
 *           household's first draw year in either order. The household figure says the level it was judged at. A couple
 *           who stop in different years or together later is answered from the two plans keeping the answer would write
 *           (When could I stop's later rows, Am I paying in enough, How much can I take from a later start), as a couple
 *           stopping now is; for a couple apart the pay of the one still working makes up what the first to stop's money
 *           cannot until the second stop, as the household's rule says. Still on the household run: a spending shape, a
 *           start moved to when a pension opens, someone past the oldest age a plan holds at their stop, a second stop at
 *           or past the years a kept plan holds, and (until short years count as not lasting) a couple from a later stop
 *           or apart with a pension still closed at its own stop.
 */
export const ENGINE_VERSION = '6.39.0';
