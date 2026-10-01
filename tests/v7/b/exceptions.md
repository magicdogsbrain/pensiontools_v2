# Exceptions to the rules of question B

Empty is the goal. A line here is a rule (`checkAnswerB`, a property or a metamorphic relation) that a real case
breaks for a reason that was understood and accepted, with the case, the rule and the reason. A line added here is a
line in the release note.

## Exceptions

(none)

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
