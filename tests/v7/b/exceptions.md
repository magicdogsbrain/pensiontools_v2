# Exceptions to the rules of question B

Empty is the goal. A line here is a rule (`checkAnswerB`, a property or a metamorphic relation) that a real case
breaks for a reason that was understood and accepted, with the case, the rule and the reason. A line added here is a
line in the release note.

## Exceptions

### One step in "more never needs more" (our decision, 1 Oct 2026, on step 4 brief section 10, J16)

Today's engine is not monotone at the £10 grain for some households (tests/v7/c/exceptions.md, engine behaviour 6), and
the pot search and the pay-in search assume it is. The relations of the family "more in never needs more, less spent
never needs more" are asserted to ONE step — £1,000 of a number, £10 of a pay-in, one life of a count — and no more
(tests/v7/oracles/oneStep.mjs):

| Relation | What may move one step | Counterexample (20 futures, NIGHTLY=1 runs of 1 Oct 2026) |
|---|---|---|
| M-B1 more State Pension, final-salary pension or employer's part | the number up £1,000, a pay-in up £10, the count (employer) down one life | One person of 18 with nothing, nothing going in, stopping at 50, spending £8,234 a month, cautious, 1% charge, to 75 (seed -2069838574): a £100-a-year final-salary pension from 50 raised the pay-in at 9 in 10 from £4,380 to £4,390 and at 3 in 4 from £2,880 to £2,890 |
| M-B2 / M-B5 a lower spend | the number up £1,000, a pay-in up £10 | One person of 18 with nothing, stopping at 31, spending £22,860 a month, cautious, no charge, to 75 (seed -1058045961): £10 less a month raised the middling number from £85,000 to £86,000 |
| PB1 more pay-in | the count at the number and the whole-life count down one life | the same cause; the number and the pay-ins needed do not depend on what goes in now and stay exact |
| PB2 more in the pot today | the count down one life, a pay-in up £10 | the same cause; the number stays exact |
| PB4 a higher spend | the number down £1,000, a pay-in down £10, the counts up one life | the same cause (PB4 keeps its narrowing to spends of £5,000 a month or less, below: the £10,000-a-month case moved the number £3,000; a household whose closed years reach the £100,000 point in pounds of the day has its move printed, not asserted — below, 2 Nov 2026) |

Everything a search does not make stays exact (the pots at the stop, the guaranteed income), and every other relation is
strict. B keeps nothing between calls, so "the same answer twice" (PB8) always held exactly and is unchanged.

**Spending £10,000 a month or more: reported, not asserted** (M-B1, M-B2, PB1, PB2; PB4 keeps its own narrowing to
£5,000). One step is not enough there (tests/v7/oracles/oneStep.mjs, `largeHousehold`): NIGHTLY=1 runs, 1 Oct 2026 — one
person of 18 with nothing, stopping at 50 on £10,264 a month, cautious while saving, adventurous once stopped, to 75: £10 a
month less raised the middling number £2,000 (£1,246,000 → £1,248,000, seed 1869286316); the same at exactly £10,000 a
month, to 105 (£1,721,000 → £1,723,000, seed 1524597785). At that size these relations print the move as a finding.

### The £100,000 point fixed in pounds of the day, reached while the savings alone pay: PB4 and M-B2 report the move, they do not assert it (2 Nov 2026)

Found by the night run of 2 Nov 2026 (PB4 at FC_RUNS 2000, seed 1515732724; the night ran on 6.45.0's input list, so its path
no longer walks to the household — it is rebuilt by hand in found.cases.json): one person of 18 with nothing in the pot and
nothing going in, stopping at 19, no savings, cautious, no charge, to 95 (the plan capped at 45 years, so to 64: the pension
opens at 57 for a seven-year tail and the State Pension never arrives). The pension is closed for 38 of the 45 drawing years
and the savings floor carries them: £1,251,000 at £2,608 a month against a flat draw of £1,189,248. The careful number — the
pension at the stop that pays the seven open years behind that floor in 9 lives of 10 — is £25,000 at £2,608 and £23,000 at
£3,108 (two steps the wrong way), and over the spends PB4 draws it is a V: £26,000 at £2,748–£2,868, then £1,000 lower every
£110 or so to £20,000 at £3,488, then up to £34,000 at £4,108. Out of reach (no pay-in up to £10,000 a month gets there),
middling and good £0.

Why: tests/v7/c/exceptions.md, engine behaviour 1 — the point where the allowance is withdrawn is £100,000 in pounds of the
day while the bands rise with prices. In the closed years the locked run is given the before-tax equivalent of what the
savings must pay (toEngine.js `savingsTargetFor`) and the ISA pays its after-tax value month by month (fastEngine.js, the
locked months): once that target, inflated, passes £100,000 in a life, the engine's tax on it has the taper in it, the ISA
pays less than the need, and the life does not run out — it quietly gets less. So in a high-inflation life the closed years
cost LESS per pound of draw the higher the spend. Measured life by life (the per-life floor that carries the 38 years with
a £5,000,000 pension behind, as `savingsNeeded` finds it): the worst life, 4, needs 1.052 of the flat draw at £2,608,
1.049 at £3,108, 1.042 at £3,488, 1.017 at £4,108, 0.989 at £6,000 (gross £99,000 on day one) and 1.052 again at £8,000
(past £125,140 from day one: the taper fully applied by the adapter's gross-up and the engine alike); the lives that bend
(4, 6, 14, 16, 17, 18) are exactly the lives in which £35,978 gross passes £100,000 in the day's pounds during the closed
years, and the lives that never do (0, 2, 3, 5, 7, 9, 12 …) are straight to the fourth decimal. With the point pushed out of
reach (TAX_DEFAULTS.PA_TAPER_THRESHOLD at 10^15 in a scratch run) every life is straight — life 4 1.0528 → 1.0522, life 17
0.9460 → 0.9452 — and the number rises with the spend: £32,000, £35,000, £38,000, £43,000, £51,000, £72,000. The number falls
because it is a residual: the floor the worst life sets, less what that floor leaves the third-worst life (17: over £100,000
in 11 of its closed years, over £125,140 in 7), against seven years of spend — £25,000 behind £1,251,000 — so when the two
lives' costs bend at different rates a per cent of the floor is many steps of the number. Not the search's grain (the
floor's £1,000 is worth £700 of the number), not a shape change, not a fault in the answer: the figures are right about what
the engine does.

What changed: `tests/v7/oracles/oneStep.mjs` `pointReachedInClosedYears(answer, env)` is true when, in some life, the
closed years' before-tax target (`outside.amount` a year, grossed up at today's bands as the adapter does) passes
RULES.taperFrom in that life's pounds of the day during the closed years, on the engine's own price level from the stop
(fastEngine.js prepareFutureFrom; priceIndexByYear over sliceReturns). PB4 reads it on the higher spend and M-B2 on its
higher spend (the original), and for such a household a move of more than a step is printed as a finding, as the
£10,000-a-month households' are; every other household is asserted to one step as before. PB4's narrowing to £5,000 a month
is the same point read in today's pounds — a closed stretch of decades at high inflation carries a £2,608 household past it
anyway, and the guard fires only for a pension closed for something like ten years and more at the stop (a stop in the
forties and under on an ordinary spend; two closed years need a spend near £6,000, above the narrowing). The household is
kept in found.cases.json with its floor and number pinned: the day the engine's point rises with prices the pin goes red
and the guard can come off.

For us, unchanged: the point fixed in pounds of the day is the engine's (TAX_DEFAULTS.PA_TAPER_THRESHOLD, read by
`calculateTax`), and raising it with prices would move every figure in every question and the planner too — a candidate
engine fix outside this slice, as engine behaviour 1 already says.

*The same night's M-B2 case (seed -1416503290, the mirror relation, settled in the same merge): one person of 18 with nothing in the
pot and nothing going in, stopping at 21, £4,953 a month, no savings, cautious, no charge, to 75 — £118 a month less moved the
middling guide figure from nought to £2,000 (the careful one from £119,000 to £115,000, the good one nought both ways): at
£4,953 the tenth life needs £6 less than the worst life's floor and so lasts on savings alone; at £4,835 the floor falls faster
than that life's need and it wants £1,520 of pension, read as £2,000 at the number's £1,000 grain. `pointReachedInClosedYears`
is true on both answers; the move is printed, not asserted.*

### OPEN FAULT (not an exception): the guide number for a couple both closed at the stop

Found by a NIGHTLY=1 run, 1 Oct 2026 (PB4, seed 1798882345): a couple of 19 and 18 with nothing, nothing going in, stopping
at your 56 (your partner 55), cautious, to 75. Both pensions are closed at the stop, yours for a year and your partner's
for two. Spending £490, £500 and £510 a month, the guide number (careful) is £324,000, £756,000 and £78,000.

Why: the savings floor for the closed years (`outside.careful`, `savingsNeeded` in stopAt.js) is worked out with a pension
of £5,000,000 behind it. A couple's need is shared between the two runs by their pots, so behind so large a pension the
closed partner's share is tiny and £6,000 (exactly the closed years' draw) "carries" the closed years in every life. Behind
a real pension the partner's share is larger, their £3,000 runs out in month 17 while their pension is still closed, and
the number search raises the pension until the share is small enough — £756,000. At £510 the floor rounds up to £7,000
and the number is £78,000. One person has one run, so it is a couple's fault only.

Still open in 6.22.0, moved by £10: the savings set aside now grow as "Mostly cash" (how savings grow, our
decision of 2 Oct 2026), so the floor steps up £10 sooner. At 20 futures the same couple's guide number is £594,000 at
£490 a month and £75,000 at £500 (the floor £6,000, then £7,000); the same saw-tooth runs up every £1,000 of floor (£2,493,000
at £580, £112,000 at £590). The pinned failure moved with it (£490 → £500).

Not changed here: it is B's answer and its floor (a design change to B's figures, for us and B's author). Until it
is fixed PB4 and M-B2 leave out a couple whose pensions are both closed at the stop, and the case is pinned as an expected
failure in tests/v7/b/properties.test.js ("PB4 found", `it.fails`), which goes red the day it is fixed. A likely fix: find
the floor with the pension at the number being searched (or split the floor by each person's own closed years), not at
£5,000,000.

## Fixed on 27 Oct 2026 (not an exception)

- **The closed years' floor carried a life the pension could not.** `outside.careful` (stopAt.js `savingsNeeded`) and
  `payIn.outside` are found with a pension of £5,000,000 behind the savings, standing for one that cannot run out
  (contract.js) — and counted a run-out at any month. Where a life needs more than £5,000,000 (a disaster life on a large
  spend), it ran out long after every pension was open, and the floor was raised for it. Found by M-B2 at NIGHTLY=1
  FC_RUNS=300 (27 Oct 2026, seed 1631952905, the branch check after the night run): one person of 18 with nothing, stopping
  at 53 (closed until 57), the full State Pension, cautious, no charge, to 95, spending £7,635 a month — the worst life ran
  out at 94 with £5,000,000 behind £386,000 of savings, where the closed years need £383,000 (one life's month 47); at £7,625
  the floor was £383,000, and behind the £3,000 of savings the floor did not need — each pension pound past the £100,000
  point worth about 55p — the good number came out £1,683,000 against £1,681,000 at £7,635 (two steps the wrong way; at the
  same floor it fell, £1,681,000 → £1,678,000). Only a run-out before the month every holder's pension is open counts for
  the floor now (until then a closed holder's run has only the savings to pay it; after it, with that pension behind, a
  run-out is the pension's): the floor is £383,000 at both spends, the good number £1,687,000 and £1,683,000. The case is
  pinned in found.cases.json and M-B2 replays it by name ("M-B2 found"). One pinned case of the corpora moved
  (tests/v7/shared, case 84 of both — a couple, the partner's pension closed for 23 years, a 3% charge, to 100): the
  floor's search and the savings pay-in had found nothing at all (null; the floor fell back to the draw, £117,982) because
  a life ran out after every pension was open whatever the savings, and the pension pay-in with them; now £18,130 a month
  into savings and £5,840 into the pension reach 9 in 10 (£0 at 3 in 4) — the one test, exact (M-B9). Its status stays
  out-of-reach (no pension at the stop up to £5,000,000 pays the spend in 9 lives of 10 behind the floor: the number is
  null). No fixture moved. The cutoff is the LAST pension to open, not the first: between the two, with £5,000,000 behind, a
  run-out can only be the still-closed partner's savings (case 75 of the corpora, both closed at the stop, moved under the
  first and is unchanged under the last).

## Fixed on 1 Oct 2026 (not exceptions)

- **"The pay-in that gets there" missed nothing at all.** `leastPayIn` (stopAt.js) is the least £10 in [from, ceiling] at
  which the whole life lasts in 9 lives out of 10. With a bracket from the lives' own figures it never tried `from` itself,
  and where the test is not monotone at a few pounds (a first £5 into an empty pension adds a run to a couple's plan) it
  could land above it: a couple, you 59 with £40,000, your partner 63 with nothing, nothing going in, stopping at 62,
  cautious, spending C's careful £1,460 (a NIGHTLY=1 run, OT2, seed -191910654) — B said "on course" and that the pay-in
  that gets there was £80. It now tries `from` first, with or without a bracket: £0.

## Findings, not rules (asserted only where the arithmetic makes them exact)

These relations hold on the fixtures and in every case measured, but the lives are shared between stop ages and a
1-in-10 point can dip, so they are reported by the nightly run rather than asserted on random cases (brief conflict 52):

1. **Stopping later needs no more** (M-B3): the number at a later stop age, and the pay-in that reaches it. A later
   stop moves the drawing years along the same life by a year, so on one life they can meet worse markets.
2. **A grid column rises down the page**: the count at one pay-in for a later stop age. The same reason.
3. **A couple's number when the pay-in changes**: the number is split between the two by their middling pots at the
   stop (brief conflict 18), and the pay-in moves that split a little, so the household number can move by a step.

### M-B3 and the grid explained for the pull request (1 Oct 2026, with step 4 brief section 10, J9)

Since J9, B's figures are the one test: the pay-in that gets there is the least whole £10 a month at which the whole
life — the saving years, then spending the target — lasts in 9 lives out of 10 (A's "yes" at the stop age); "on course"
is that test at today's pay-in; "stop later" is the first later age at which it passes (A's earliest age that works,
above the stop: tests/v7/cross/oneTest.test.js, OT3).

1. **Stopping later needs no more (M-B3).** It does not hold exactly for the reason M-A4 does not
   (tests/v7/a/exceptions.md): a later stop moves the drawing years one year along the same lives, so the worst 1 in
   10 is other lives in other markets. B's stop-later lever is therefore the FIRST later age that passes, searched
   age by age to 75, never "the next age that is better than this one": an age after it may fail again on these
   futures, and B says only what it found. On the fixtures B1 and B3 at 200 lives, the number and the pay-in at 9 in
   10 one to three years later are no higher, to one step (asserted, metamorphic.test.js).
2. **A grid column rises down the page.** The same reason. A grid ROW does rise to the right, exactly: each cell is
   the one test at that pay-in, and more paid in never makes a life that lasted run out (the cells are counted that
   way: `countsAtPayIns`, src/answers/shared/stopAt.js).
3. **A couple's number when the pay-in changes.** The guide number is split between the two by their middling pots
   at the stop (brief conflict 18), and the pay-in moves that split a little; the number is a guide figure only — the
   pay-in is solved on each person's own pots (J9), so the answer itself does not depend on the split.
4. **A partner with nothing is the single answer (M-B11)** while everything that goes in is the first person's. When
   nothing goes in now, the pay-in that gets there is split evenly between the two of you (pay-in-split), and the
   whole life is taxed person by person, so a couple can need less than one person: a real difference, not a fault.
   Before a pension opens, the savings a month are split between two ISAs in the same way. The relation is asserted
   with today's pay-in all in the first person's name and no closed years.

### The nightly run of 1 Oct 2026 (the slice lead, joining up after J8–J13)

- **PB4 (a higher spend needs no less)** was red at £10,000 a month (one person of 18, nothing in a pot, nothing going
  in, stop at 52, cautious, 20 futures; seed 1574805623): £10 a month more lowered the guide number's middling from
  £1,496,000 to £1,493,000 and the 3-in-4 pay-in from £4,590 to £4,580, the same in a fresh process (not the search's
  starting point). A household spending £120,000 a year after tax draws well past the £100,000 point where the
  allowance is withdrawn, which today's engine holds fixed in pounds of the day (tests/v7/c/exceptions.md 1). PB4 keeps,
  like belowTaper, to spends under that point (£5,000 a month and less), and the case is recorded here.
