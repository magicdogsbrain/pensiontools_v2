# Exceptions to the rules of question C

Empty is the goal. A line here is a rule (`checkAnswer`, a property or a metamorphic relation) that a real
case breaks for a reason that was understood and accepted, with the case, the rule and the reason. A line
added here is a line in the release note.

## Exceptions

### One step in "more never pays less" (the owner's decision, 1 Oct 2026, on step 4 brief section 10, J16)

Today's engine is not monotone at the £10 grain for some households (engine behaviour 6 below: a future that runs out at
£14,020 a month, lasts at £14,030 and runs out again at £14,040), and the band search assumes it is. So the relations of
the family "more in never pays less" are asserted to ONE step — £10 of each of the three amounts — and no more
(tests/v7/oracles/oneStep.mjs):

| Relation | Before | Now |
|---|---|---|
| M1 more in your pot | one step for a couple, exact for one person | one step for both |
| M1b more in your partner's pot | one step | one step |
| M2 more State Pension or final-salary pension | exact | one step |
| M7 the same pension in two names | one step | one step |
| M3 a longer life to cover: no higher (the mirror) | exact | one step |
| M4 one year older: no lower (M3 from the other side) | exact | one step |

M3 is the mirror of the family — more to cover never pays more — and misses by one step even for a small household,
because the plan's length is one of the strategy's own inputs: one person of 18 with £250,000 and a £25,416 final-salary
pension from 70, cautious, the money from 57 — to 76 instead of 75 raised the middling amount from £1,900 to £1,910 (a
NIGHTLY=1 run, 1 Oct 2026, seed 1669423791); a couple, to 80 instead of 79 — the careful amount £3,270 → £3,280 (seed
644221435). M4 is held the same way. M3 leaves out a household whose final-salary pension starts at or after its
holder's age at the end: one more year brings that pension into the plan, and the amounts rightly rise (seed 1320496810:
a couple, you 40 with a £35,516 final-salary pension from 75, your partner 66 with £1,073,100, to 75 — to 76 moved the
middling amount from £5,020 to £5,040; A's PA10 the same), and like M1 and M2 keeps below the £100,000 point (seed
-925439073: a £200,000 final-salary pension from 68 — to 80 instead of 79 moved the careful amount £7,340 → £7,360). The guaranteed income and everything else no search makes stay
exact; M5, M6, M10–M12 and the rest are strict.
For one person no strict miss of M1 or M2 turned up in 330 random households hunted on 1 Oct 2026 (80 of them with
£1,000,000 or more):
the step is the decision's allowance, held to the same width for everyone.

### An amount of £10,000 a month or more: M1, M1b, M2, M3 and M4 report its move, they do not assert it

One step is not enough at that size, and every miss of more than one step found on 1 Oct 2026 was there, none below. A
couple's pots drain in a fixed ratio (engine behaviour 4), and more for ONE of the two — a pot, a pension — moves the ratio,
so the band can fall in proportion to the amount (0.2% to 1.3% where measured, A's exceptions.md); and one person drawing
very large amounts meets the £100,000 point fixed in pounds of the day (1) where the engine is not monotone. Each of the three
amounts is taken on its own: one of £10,000 a month or more before the change has its move printed as a finding and not
asserted, the others are held to one step (oneStep.mjs, `amountsToAStep`; a couple with a careful amount of £8,070 and a
good one of £20,040 moved the good one £30, A's PA5). Counterexample (a hunt of 250 random households, 1 Oct 2026, 20 futures): a
couple, you 57 with £1,846,801 and a £9,000 final-salary pension from 60, your partner 18 with £10,000,000 and £700 a month
going in, £1,366,739 of savings, the money from your 88, balanced, to 105 — £5,995 a year more final-salary pension moved
the careful amount from £26,490 to £26,450.

### A couple's fixed-ratio drain with a charge over 1% a year: M1, M1b and M2 report its move for a couple, they do not assert it

Found when the fund and platform charge joined C (6.19.0, the owner's decision of 1 Oct 2026; 0.5% a year unless
changed). A couple's two runs drain in a fixed ratio (engine behaviour 4) and the household is short the moment either
is. When one person's State Pension fills their personal allowance and the other's does not, the first person's
pension draws are taxed from the first pound, so their run spends its pot faster than the other's. With a charge of 2%
or more that run is the one that binds in the bad cases, and more money in THAT person's pot can lower the band by more
than one step — the charge does not cause it (every pot is charged alike), it decides which run binds. Counterexamples
(C's properties, seed 20260930, 40 and 20 futures): you 18 with £1,073,100 and no State Pension, your partner 18 with the
full one, the money from 57, cautious, to 105 — at 2%, £1 → £6,814 in the partner's pot moved the careful amount from
£2,530 to £2,500; at 3%, £4,000 → £20,000 from £2,180 to £2,130 (at 0% and 0.5% it rose: £3,210 → £3,230, £3,020 → £3,040).
You 54 with £1,073,100 and no State Pension, a partner of 57 with £15 and the full one, the money from your 67, at 2%:
£1,973 more in the partner's pot moved the careful amount from £3,100 to £3,000. With the partner's forecast at £8,000
(room left in the allowance), or a State Pension for both, no fall. At 1% and under no such fall turned up (60 random
couples at 0, 0.5 and 1%, and every seeded run), and the relations hold to one step there as before. A model limit (the
need is shared by pots, not by what each person's draws cost in tax), not a fault of the charge; for the owner.

### Narrowed: what the relations claim was not what they drew (test faults, found by NIGHTLY=1 runs, 1 Oct 2026)

- **M1 for a couple, and M1b: a pot that is there already** (as A's PA2). A first pound in a pot adds a pension run to the
  household — another shape of plan, the need now shared between the runs. You 18 with £34 and your partner 55 with
  nothing, cautious, to 75 (seed 1745809990): £1 in the partner's pot moved the careful amount from £1,050 to £1,040 and
  the good one from £1,060 to £1,040. You 91 with nothing, a partner of 35 with £10,000,000 still paying in £5,000 a month
  (a hunt): £1 in your pot moved the careful amount from £24,720 to £16,500.
- **M7: below the £100,000 point in fact.** It filtered final-salary pensions over £60,000 but not what the pot pays on top.
  One person of 74 with £250,000 and a £50,270 final-salary pension, cautious, to 75 (seed 1588601866): drawing £250,000 in
  one year in one name loses one personal allowance, in two names two, so the even split rightly takes home £160 a month
  less (£21,440 against £21,600); and 58 with a £20,000 State Pension forecast beside the same, £110,000 a year in all
  (seed -2110052139). M7 now holds the household to £60,000 a year (£5,000 a month), where each of the two stays under the
  point for the whole plan.
- **OT's households (tests/v7/cross/oneTest.test.js): only households C takes.** Nobody still paying in past 75 at the stop
  — C refuses that start (`pay-in-past-75-partner`, J21): you 59 stopping at 71, a partner of 64 paying in until 76 (seed
  -1430971866); and savings to live on when every pension the household has is closed at the stop — C refuses that too
  (`start-not-before-access`, per person, J18): you 31 with no pension, a partner of 30 paying in, stopping at your 57,
  their 56 after the 2028 rise (seed -1188032892). The generator checked only your own pension.

## Fixed on 1 Oct 2026 (not exceptions): the same inputs, two answers

C kept the amounts of its last search and started the next search of the same household from them (`remembered`, a hint).
Where the engine is not monotone a search started there can end elsewhere, so the same inputs asked twice gave two answers:
£3,000,000 and a £200,000 final-salary pension, the money from 100, to 105 (a NIGHTLY=1 run, seed 338460746, M16) — the
good amount £336,300 the first time and £336,630 the second, 33 steps apart; one step could not have covered it. Now only a
pass over FEWER futures is a hint (the first figure's 100 for the final 1,000: answer.js and onLives.js), so the same inputs
on the same futures start the same search every time, and M8, M13 and M16 are byte for byte again. Question A had the same
fault and the same fix (A's exceptions.md).

## Engine behaviours the trace oracle allows for (not exceptions: the answer is right about what the engine does)

These are properties of today's engine that the month-by-month check (`tests/v7/oracles/fromTrace.mjs`) models
by hand so that "the household gets the careful amount every month, to the pound" can still be asserted. Each is
a candidate engine fix outside this slice.

1. **The £100,000 point where the allowance shrinks is a fixed figure in pounds of the day** (`TAX_DEFAULTS.PA_TAPER_THRESHOLD`
   in `calculateTax`), while the bands rise with prices. The engine aims at a before-tax target and works out its
   after-tax value in the pounds of the day, so once that target passes £100,000 in a future's pounds the take-home
   falls short by the allowance withdrawn (about £2 a month at the end of a 35-year plan for a £1,850-a-month
   household in a high-inflation future; more for larger incomes).
2. **A final-salary pension rises with prices up to 5% a year** (`pricesCapped5`, the household's default and what
   the assumed line says), and nothing makes the difference up in a future where prices rise faster: the engine is
   told the pension rises in full, so that the pot's job stays its own share of the household's need (with the cap
   inside the run the engine would drain the pot making it good — a £100,000 pot beside a £20,000 pension then added
   nothing at the careful amount, and a pot of £1 sank a household; see `src/answers/shared/toEngine.js`). The
   month-by-month rows carry the capped pension, so the household's take-home in such a future is short by the
   erosion after tax, which the oracle works out by hand and allows for.
5. **A pension closed at the start** (its holder under the earliest pension age, while at least half the household's
   pension money is open — `household.js startWhenPensionsOpen`) draws nothing until it opens; its holder's savings
   are a run of their own for the whole plan, like a person with savings only, because the engine cannot keep a
   pension shut while the ISA beside it is spent. Those savings drain in a fixed ratio with the other pots (item 4).
   When less than half is open the start moves to the first opening that makes it so, as it always did for one person.
3. **Tax-free cash in the month the £268,275 limit is reached**: the engine takes the full quarter in that month and
   then stops, so the sum over a plan can pass the limit by up to one month's quarter. The oracle allows one month.
4. **A couple's pots drain in a fixed ratio.** The household is short the moment one person's pot cannot pay,
   whatever the other still holds; the run-out month is that month, and the other person's months after it are not
   shown. This stays so for a couple who stop in the same year (their answers are 6.19.0's, figure for figure). A
   couple who stop in different years (6.20.0) is not held to it after the second stop: when one person's money runs
   out, the other's pays all of what the pots pay from that month, and the household runs out only when both have
   (`toEngine.js` passOnAt, `stopAt.js` runApart; the engine's call of 2 Oct 2026). Without it, a first stopper who came
   to the second stop with a few hundred pounds of savings — the case of one spending cash down before a later income —
   sank the household decades early, and more money could give less (couples-different-years.md 4.3 f).
6. **"Lasts at an amount" is not always monotone at £10 steps** (found by the nightly run of
   `tests/v7/cross/questions.test.js` X1 on 1 Oct 2026, seed 2127017665). For one person of 71 with £2,327,718, £150,000
   of savings and a £200,000-a-year final-salary pension from 75 (40 futures), future 8 runs out at £14,020 a month,
   lasts at £14,030 and runs out again at £14,040 (most likely the tax where the allowance is withdrawn, above £100,000,
   moving where the engine draws from; not traced further). The band search (`band.js`) assumes monotone brackets. Here the AMOUNTS came out the same whatever the
   search order (in principle they could move a step too), but the COUNT of futures at an amount was one apart between a search that starts from the
   remembered hint (C's second call on the same household; the 1,000-future pass after the 100) and one that does not:
   36 or 37 of 40 at the careful £14,030, both "9 futures out of 10" in words. It was in C before step 4 (the committed C,
   afe1ea4, answers the same way). X1 allows the one-future difference only where the engine is shown not to be monotone
   near the amounts (`nonMonotoneNear`), and asserts byte equality everywhere else. A candidate engine fix outside this
   slice; the households it touches are far outside the slice's. *Since 1 Oct 2026 (above, "Fixed"): a search of the same
   size is no longer started from the last one's amounts, so C's two calls and A's start the same search and count alike
   (the band 36 of 40 at £14,030, the take at £14,030 37 of 40, in both); X1's allowance stays as a guard. The engine is still not monotone there, which is why "more never pays less" is
   held to one step (above).*
