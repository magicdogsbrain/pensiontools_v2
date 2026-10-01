# Exceptions to the rules of question A

Empty is the goal. A line here is a rule (`checkAnswerA`, a property or a metamorphic relation) that a real case
breaks for a reason that was understood and accepted, with the case, the rule and the reason. A line added here is
a line in the pull request (step 4 brief 7, point 3).

## Exceptions

### One step in "more never pays less" (the owner's decision, 1 Oct 2026, on step 4 brief section 10, J16)

Today's engine is not monotone at the £10 grain for some households (tests/v7/c/exceptions.md, engine behaviour 6) and
the band search assumes it is. The relations of the family "more in never pays less, less spent never lasts less" are
asserted to ONE step — £10 of an amount, one life of a count, the verdict a grade lower only with the count it follows,
the bad-case age only while the count holds — and no more (tests/v7/oracles/oneStep.mjs):

| Relation | What may move one step |
|---|---|
| PA1 more going in | the shown row's band (£10) and count (one life) |
| PA2 more in the pot today | the same |
| PA4 a lower spend | the count at the spend (one life), and the verdict and bad-case age with it. The band and the pots stay identical |
| PA5 part-time work | the band and count with it; the careful amount "without" it, which is searched from the row with it, to £10 of the answer without it (its verdict, count and bad-case age are one run per life: exact) |
| A-I10 (checkAnswerA) part-time never hurts | the careful amount £10 (as before); the counts with and without it, and with one more year of it, one life (seed -1221394728: a couple spending £15,190 a month — 11 lives of 20 → 10 with one more year of £30,000 part-time pay); the bad-case age while the count holds |
| M-A2 more State Pension or final-salary pension | the band and count |
| M-A3 a higher spend | the count at the spend (one life) up; the band stays identical |
| PA10 a longer life to cover (the mirror, as C's M3) | the band up £10, the count up one life |

Before this a couple already had one step and one life in PA1, PA2 and PA5 (two pots drained in a fixed ratio); one
person now has the same. The pots at the stop, what is paid in and the guaranteed income are worked out, not searched,
and stay exact; every other relation is strict. No strict miss of M-A2 turned up below £10,000 a month in the hunts of 1 Oct
2026 (210 random households); the step is the decision's allowance, held to the same width for everyone.

### An amount of £10,000 a month or more — reported, not asserted (PA1, PA2, PA4, PA5, PA10, M-A2, M-A3 and A-I10)

One step is not enough at that size, and every miss of more than one step in the NIGHTLY=1 runs and hunts of 1 Oct 2026
was there, none below (tests/v7/oracles/oneStep.mjs). Each of the three amounts is taken on its own (`amountsToAStep`): one
of £10,000 a month or more before the change has its move printed as a finding, not asserted; the others hold to one
step. A household whose careful amount is at or over it has its count, verdict and bad-case age reported the same way (`largeHousehold`),
and so has A-I10's careful amount with and without part-time pay.

- **A couple's fixed-ratio drain.** Part-time pay is the first person's, and a couple's two pots drain in a fixed ratio
  (tests/v7/c/exceptions.md 4); more for one of the two moves the ratio, so the band can fall in proportion to the amount.
  Not a search artefact: for the first case below every life was checked at every £10 for 30 steps either side of the good
  amount, each lasts-at-k was monotone, and the band equals the sorted mosts exactly with and without the pay. For one
  person the pay never lowered the band (the same household as one person: £27,900 → £27,960). Of 320 random couples with
  part-time pay (20 futures) 5 fell by more than a step, all with a careful amount over £18,000 a month and pots of
  £4,900,000 to £55,000,000, by 0.2% to 1.3%.
- **One person drawing very large amounts**, where today's engine is not monotone at £10 and the band depends on where its
  search starts (the £100,000 point fixed in pounds of the day, tests/v7/c/exceptions.md 1).

Counterexamples (NIGHTLY=1 runs, 1 Oct 2026, 20 futures):
- PA5, seed 1899557978: a couple of 54 and 57 with nothing in a pot, £10,000 a month going in and £10,000 a month into
  savings, stopping at 68, adventurous once stopped, to 100, part-time £12,570 for 6 years: the good amount £26,130 →
  £26,110.
- A-I10, seed -1692583095: a couple of 18 and 18, the partner with £150,000, stopping at 75, part-time £5,226 for 15 years,
  adventurous while saving, to 105: the careful amount £10,450 without the pay, £10,430 with it.
- PA1, seed -903263254: a couple, you 55 with nothing, your partner 70 with £10,000,000 and £10,000 a month into savings,
  stopping at 56, part-time £10,814 for 2 years, to 75: £124 a month more going in moved the middling amount from £43,870
  to £43,850.
- PA5, seed 1958488117: a couple, you 40 paying in £5,000 a month, your partner 57 with £1,073,100, stopping at 66,
  cautious, 1% charge, to 100, part-time £12,570 for a year: the careful amount rose (£8,070 → £8,090), the good one
  fell £30 (£20,040 → £20,010) — why each amount is taken on its own.
- PA5, seed -1451045040: one person of 69 with £1,147,935 and a £50,270 final-salary pension, £5,000 a month going in,
  stopping at 75, to 76 (one year of drawing), part-time £6,000 for a year: the careful amount "without" the pay, searched
  from the row with it, came out £140 from the answer without it worked out on its own.

## Fixed on 1 Oct 2026 (not exceptions)

- **The same inputs, two answers.** A second call of the same inputs started its band search from the first call's
  amounts (the remembered hint), and where the engine is not monotone it could end elsewhere: one person of 24 with
  £1,073,100, a £12,570 final-salary pension from 50, stopping at 75 on £5,400 a month (a NIGHTLY=1 run, 20 futures)
  answered a good amount of £48,360, then £48,410. Only a pass over fewer lives is a hint now (answer.js, `smallerPass`:
  the first figure's 100 lives for the final 1,000), so the same inputs start the same search every time. PA7 no longer
  needs its "only where two calls agree" precondition: it is byte for byte again; PA4's and M-A3's "the band does not
  move with the spend" are exact for the same reason; PA11 and PA12 were already strict.
- **"Show me ages" from 76.** The form takes ages to 100 (C's field) but A shows stop ages to 75, so someone of 76 asking
  to be shown ages had no row at all, and the answer threw (`livesList` was asked for a life of -Infinity years) — the
  screen would have said "Sorry, we could not work that out". Found by tests/v7/a/reuse.test.js R1 (seed 20261001). The
  answer now returns `invalid` with `{ field: 'stop.kind', messageId: 'stop-ages-past-75' }`
  (tests/v7/a/foundByRandom.test.js). The form still lets it through: a rule and its words belong to the form
  (validate.js, copy/a.js) — handed to the V7 screens.

### The every-age step from the answer step's rows (step 4 brief 10, J17) — byte for byte, but for amounts over £10,000

The every-age step now takes the rows the answer step worked out (the worker offers its last result as `env.reuse`), and
each other row's search starts from the line through the two rows before it. Neither moves a figure where today's engine
is monotone at £10: the four fixtures give the same bytes as the committed code for the answer step and the every-age step
at 1,000 lives through the real worker handler, and the every-age answer from the held rows is the one worked out cold at
100 lives (tests/v7/a/reuse.test.js R1; R4 checks every row against a search with no hint). Where an amount is over £10,000
a month a band can depend on where its search starts, and there the every-age table now repeats the answer step's rows
exactly. Measured on 34 random households at 100 lives against the committed code, in the worker's order (answer step,
then every age): the answer step was byte for byte the same in all 34, and the every-age step in 31; the other 3 differed
in one row each, over £20,000 a month, by 2 to 4 steps (£96,120 → £96,160, £102,650 → £102,630, £20,640 → £20,610). R1's
random households assert the rows held equal the answer step's always, and the whole answer equal to the cold one below
£10,000 a month; above it a difference is printed (seed -109027457: one person of 42 with £10,000,000, "show me ages").

## Findings, not rules (step 4 brief, conflict 52)

**M-A4, a later stop is not worse.** Along the rows of one answer, the careful amount and the count that lasted at
the spending are expected to rise with the stop age, but the lives are shared between the rows and a stop a year
later draws on a different stretch of the same market (answer-A-and-B.md 0.1), so a 1-in-10 point can dip. On
random cases this is a finding: `tests/v7/a/metamorphic.test.js` prints each case where a later row is more than
one step (£10, one life) worse, and it is recorded here with its inputs and seed. On the four fixtures it is
asserted to one step.

Recorded on 1 Oct 2026 (seed 20261001, 20 futures, the push run of `metamorphic.test.js`):

| Case | Rows | What moved | Why it is accepted as a finding |
|---|---|---|---|
| Couple, you 57 with £1 and £11 a month going in (already drawing), partner 62 with £10,000,000 and £500 a month; £9,999,997 in savings; stop at 62; comfortable; part-time £12,571 a year for 2 years; adventurous while saving, cautious once stopped; 2% charge; to 105 | 61 → 62 | careful £37,570 → £35,420 a month; both lasted in every life | £10,000,000 pots far above the £100,000 point where the allowance is withdrawn (fixed in pounds of the day while the bands rise: tests/v7/c/exceptions.md 1), a 45-year cap on the drawing years that moves with the stop (to 105 from 61 is 44 years, from 62 is 43), and part-time work that starts at each row's own stop. Not a household the slice is for; kept as a finding, not an exception to a rule. |
| The same household | 63 → 64 | careful £36,070 → £34,810 a month | As above. |

On the four fixtures at 100 lives the rows never fall by more than one step (asserted).

### M-A4 explained for the pull request (1 Oct 2026, with step 4 brief section 10, J8–J11)

**What the rule says.** One more year of work should never leave less to spend: along the rows of one answer, the
careful amount at age a + 1 is at least the one at a, to one step (£10, one life).

**Why it can fail, and why that is not a bug.** Every row is the same thousand lives (one future is one life from
today, lives.js). Stopping a year later moves the first drawing year one year along each life, so the worst 1 in 10
at 62 is a different set of lives, in other markets, from the worst 1 in 10 at 61. A sequence of bad years that
lands just after the stop in one row can land a year into the drawing in the next, or the other way round. That is
the honest reading of the history the lives are built from, not an error in the arithmetic: each row is checked on
its own against the engine (X1, the locked chain, the per-future pots identity), and every row is exactly A's own
band. The two cases recorded above are a £10,000,000 couple with part-time work and a 45-year cap that moves with the
stop: three effects that each move the rows on their own.

**What the person reads.** When the next age shows less to spend, A says so rather than "very little":
`a.oneMore.less` — "Working until 62 instead of 61 does not add to what you could spend on these futures: it is about
£2,150 a month less." (`tests/v7/a/sentences.test.js` holds the sentence; the rule that picks it is
`src/answers/a/sentences.js`).

**What is asserted.** On the four fixtures at 100 lives, no row falls by more than a step (metamorphic.test.js). On
random cases the nightly run prints each dip; any dip on a household the slice is for (pots under £2,000,000, no cap
moving) is a failure to look at, not a line to add here.

### The nightly run of 1 Oct 2026 (the slice lead, joining up after J8–J13)

A run of `NIGHTLY=1` over `tests/v7` (before the fixes below) was red in A on three properties; each is now either
fixed or narrowed to where it holds, with the reason:

- **PA1 (more going in is no worse)** — a fault in the test, not the answer: it allowed `own + extra` up to £10,000 while
  the limit is on the person's two parts together, so £8,010 + £1,991 came back invalid. The precondition now adds both
  parts. The form now says so too (J14: `pay-in-over-limit`, on the employer's box, in A, B and C).
- **PA2 (more in the pot is no worse)** — narrowed to a pot that is there already. From no pension to a pension is
  another shape of plan: a pension run joins the savings run, and with part-time pay or a partner the split and the
  tax move. Two cases, both one step (£10) at the middling amount, 20 futures:
  single, 18, no pot, £593,606 of savings, £1 a month into savings, stop at 54, part-time £12,570 for 10 years,
  adventurous then balanced, to 100: a pot of £1 moves the middling from £6,310 to £6,300 (seed −596170595);
  a couple, you 19 with no pot and a final-salary pension, your partner 62 paying in £5,000 a month, £150,000 of
  savings, £10,000 a month into savings, stop at 55, 2% charge, to 100: a pot of £63,708 moves the middling from
  £18,750 to £18,740 (seed 1004875212). Without the part-time pay the single case rises with the pot (£6,010 → £6,080).
- **PA7 (a field that does not apply changes nothing)** — the property holds; what broke it was that two calls with
  the SAME inputs differed (good £390,650 then £390,680 a month) for a £3,000,000 pot and £10,000,000 of savings: the
  search starts from the remembered amounts of the last call, and for this household today's engine is not monotone at
  £10 steps (tests/v7/c/exceptions.md, engine behaviour 6). PA7 now first checks that the household's answer does
  not depend on where the search starts, and compares only then (seed −1821044511). *Later the same day: the cause is
  fixed — a pass of the same size is no longer a hint — and PA7 is byte for byte again (above, "Fixed on 1 Oct 2026").*
