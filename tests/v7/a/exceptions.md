# Exceptions to the rules of question A

Empty is the goal. A line here is a rule (`checkAnswerA`, a property or a metamorphic relation) that a real case
breaks for a reason that was understood and accepted, with the case, the rule and the reason. A line added here is
a line in the pull request (step 4 brief 7, point 3).

## Exceptions

(none)

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
  not depend on where the search starts, and compares only then (seed −1821044511).
