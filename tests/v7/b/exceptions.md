# Exceptions to the rules of question B

Empty is the goal. A line here is a rule (`checkAnswerB`, a property or a metamorphic relation) that a real case
breaks for a reason that was understood and accepted, with the case, the rule and the reason. A line added here is a
line in the release note.

## Exceptions

### One step in "more never needs more" (the owner's decision, 1 Oct 2026, on step 4 brief section 10, J16)

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
| PB4 a higher spend | the number down £1,000, a pay-in down £10, the counts up one life | the same cause (PB4 keeps its narrowing to spends of £5,000 a month or less, below: the £10,000-a-month case moved the number £3,000) |

Everything a search does not make stays exact (the pots at the stop, the guaranteed income), and every other relation is
strict. B keeps nothing between calls, so "the same answer twice" (PB8) always held exactly and is unchanged.

**Spending £10,000 a month or more: reported, not asserted** (M-B1, M-B2, PB1, PB2; PB4 keeps its own narrowing to
£5,000). One step is not enough there (tests/v7/oracles/oneStep.mjs, `largeHousehold`): NIGHTLY=1 runs, 1 Oct 2026 — one
person of 18 with nothing, stopping at 50 on £10,264 a month, cautious while saving, adventurous once stopped, to 75: £10 a
month less raised the middling number £2,000 (£1,246,000 → £1,248,000, seed 1869286316); the same at exactly £10,000 a
month, to 105 (£1,721,000 → £1,723,000, seed 1524597785). At that size these relations print the move as a finding.

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

Not changed here: it is B's answer and its floor (a design change to B's figures, for the owner and B's author). Until it
is fixed PB4 and M-B2 leave out a couple whose pensions are both closed at the stop, and the case is pinned as an expected
failure in tests/v7/b/properties.test.js ("PB4 found", `it.fails`), which goes red the day it is fixed. A likely fix: find
the floor with the pension at the number being searched (or split the floor by each person's own closed years), not at
£5,000,000.

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
