# Exceptions to the rules of question C

Empty is the goal. A line here is a rule (`checkAnswer`, a property or a metamorphic relation) that a real
case breaks for a reason that was understood and accepted, with the case, the rule and the reason. A line
added here is a line in the release note.

## Exceptions

(none)

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
   shown.
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
   slice; the households it touches are far outside the slice's.
