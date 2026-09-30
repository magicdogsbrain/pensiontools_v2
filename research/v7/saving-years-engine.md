# V7 — the saving-years engine (plan P13)

The design for the years **before** someone stops work, and for the four solves that questions A ("When can I
afford to stop work?") and B ("Am I saving enough, and what should I pay in?") need. Written 30 Sep 2026
against v6.17.0. Nothing here is built.

Read for this document: `research/v7/step3-build-brief.md`, `architecture.md`, `answer-C-and-household.md`,
`rail-screens-language.md`, `research/v7-plan-of-plans.md` (3–4, 7–9), the research catalogue (S01, S02, S03,
S04, S10, S12, S17, S22); the code under `src/answers/` (household, toEngine, futures, band, fastEngine, answer
C), `src/v7/`, `tests/v7/`, `e2e/`; `src/services/AccumulationEngine.js`, `src/services/RetireSweep.js`,
`src/strategies/stressTest.js`, `src/strategies/ladderEngine.js` (`bootstrapPaths`, `annualNominal`),
`src/services/SimulationEngine.js`. Section 6 reports a scratch script that was run; every timing in this document
comes from it or from `answerC` as it stands today. The scratch script is not in the repository.

Owner's decisions this document builds on (plan of plans 7; the mandate of 30 Sep): savers first; the saving
years **simulated on the same historical and simulated market paths as the drawing-down years**, with a saving
risk level; "what's my number" gives the pot needed, the monthly payment that gets there at the chosen
confidence, and the choices side by side when it does not fit; question A shows a named stop age's verdict, a
range of ages side by side, what one more year buys, which pot pays the years before the State Pension, and
part-time work as a lever; stopping before 57 paid for from ISA and savings must work; a couple gets short first
questions with full detail on demand; a final-salary pension by its start age; "a bad case" = the worst 1 in 10;
the headline is careful (9 in 10); every number from a pure function with a declared input list; the existing
engine is reused for the drawing-down years through the same adapter and fast path as question C.

Contents: 1 the saving phase · 2 the solves and the computational plan · 3 rules: pension access, the years
before it, State Pension age, part-time work · 4 the input lists and result objects · 5 validation · 6 the
scratch measurement · 7 what changes in existing files · 8 decisions for the owner.

Words: every user-facing string in this document says "while you are saving", "the years before your State
Pension starts", "the years before you can touch your pension", "stop work", "the plan lasted in 9 futures out
of 10". Never accumulation, decumulation, bridge, plan year, horizon, glidepath, lifestyling, Monte Carlo,
percentile. A person who has already stopped work is never shown a countdown; a saver may be shown the age or
the date they are aiming at.

---

## 1. The saving phase

### 1.1 One future = one life

Question C tests a household against futures built from the bundled market history: future `i` of seed `s` is
`bootstrapPaths((s × 100003 + i) × 7919 + 3, years × 12)` — a paired block bootstrap of the real total-return
index and CPI, 60-month blocks — then `annualNominal` to put it on the engine's yearly grid (`futures.js`).

The saving-years engine builds the same thing, longer. A **life** is the market path from today until the
plan-to age, for the younger person of the household:

```
T  = planToAge − ageToday            years in the life (a 30-year-old to 95: 65 years)
life_i = bootstrapPaths(marketSeed(i, seed), T × 12)         the same seed formula as C
```

Two facts make this the right unit:

1. **A life is a prefix-extension of C's future.** `bootstrapPaths` draws its block starts in order from one
   integer generator, so the first `D × 12` months of a `T × 12`-month path are, month for month, the
   `D × 12`-month path C builds from the same seed (checked in the scratch run: 50 seeds, every month equal).
   So with no saving years the engine *is* question C on the same markets — section 5.1 makes that a test.
2. **Every candidate stop age lives on the same life.** For a stop at age `a`, the saving phase is life years
   `0 … S−1` (`S = a − ageToday`) and the drawing-down phase is life years `S … S+D−1` (`D = min(45, planToAge −
   a)`, the engine's 45-year limit). The life's length does not depend on `a`, so the whole range table
   (section 2.5) is fourteen cuts of the same thousand lives, never fourteen thousand new futures. Good years
   and bad years fall at the same calendar points whichever age is being tried, which is what makes "one more
   year of work" a fair comparison and what keeps the table's columns from jumping about between ages.

The list of lives depends only on `seed`, `futures` and `T`, never on any amount, exactly as C's futures do.
Tests replace it with `env.futureReturns(i, years)` as today; a made-up life is just a made-up future of `T`
years.

On the yearly grid the life gives `equity[y]` (nominal return of shares in year `y`) and `inflation[y]` (the
rise in prices during year `y`) for `y = 0 … T−1`. The engine's price convention is kept for the whole life,
because the drawing-down phase already lives by it: the price level `P(0) = 1`, and `P(y) = P(y−1) × (1 +
inflation[y])` for `y ≥ 1` (a year's rise is applied at its start; year 0's is never applied). Everything the
saving phase does in nominal pounds is later divided by `P(S)`, so the drawing-down phase's own price index
(`cumInf`, 1 in its first year) is `P(S + y′) / P(S)` — one continuous price line from today to the end.

The bond model. Today's engine gives bonds a return each month from a random overlay on the year's shares and
inflation (`calculateBondReturn`, five draws a month, a seeded integer generator per future). The life carries
**one bond stream**, drawn once from `seededRng(engineSeed(i, seed))` month by month over all `T × 12` months,
conditional on each life year's inflation and share return, in the order the engine draws them. The saving
phase reads months `0 … 12S−1`; the drawing-down phase reads from month `12S` on. At `S = 0` this is exactly the
engine's own stream (same seed, same first draw), so the C identity holds bit for bit. At `S > 0` the
drawing-down phase's bond noise is the continuation of the life's, not a fresh seed — a deliberate choice: it is
what "one future = one life" means, it costs one draw per life month instead of one per age (section 2.6), and it
holds 6 MB for 1,000 lives instead of 42 MB for fourteen prepared ages. The consequence for testing is stated in
5.1.

Cash. The engine's cash return in a year is `max(0, last year's inflation − 1%)`; in its first year it uses that
year's own inflation, having no previous one. In the life the previous year exists, so drawing-down year 0 at a
stop age `S > 0` uses `inflation[S − 1]`. At `S = 0` there is none and the engine's rule applies. This is the one
place the joined run is not literally `simulate` on the continued path; it is stated, tested in the flat-price
closed forms, and invisible at `S = 0`.

### 1.2 The saving loop, month by month

For one person, one life, one stop age. All amounts nominal until the last line.

```
pot sleeves  E, B, K  (shares, bonds, cash)  start at  pension × mix_saving
for y in 0 … S−1:
    price  = P(y)
    w(y)   = the target mix for this year (1.4: the saving mix, sliding to the retirement mix in the last years)
    for m in 0 … 11:
        E ×= monthly(equity[y]) × chargeM
        B ×= bondMonthly[12y + m]  × chargeM                  the life's bond stream
        K ×= monthly(cash(y))      × chargeM                  cash(y) = max(0, inflation[y−1] − 1%)
        total = E + B + K + contribution(y) × price           payments in, at today's prices, rising with prices
        E, B, K = total × w(y)                                rebalanced to the year's target mix
potAtStop (today's prices) = (E + B + K) / P(S)
```

`monthly(r) = (1 + max(−0.99, r))^(1/12)` and `cash(y)` are the engine's own (`fastEngine.js`, read from
`SimulationEngine.js`). `chargeM = (1 − charge)^(1/12)` (1.5). The ISA pot runs the same loop with its own
contributions and no relief.

**Rebalancing.** The saving phase holds the money *at* the target mix, rebalancing monthly by directing the new
payment and moving the rest. That is what a workplace default fund does, and it is the choice that makes the loop
a scalar recurrence (1.6). The drawing-down engine does not rebalance (its sleeves drift and are fed by the
sourcing rule); the handover at the stop date is at the retirement mix exactly (1.4), so the engine starts from
the sleeves it would have built itself from that pot.

**The yearly grid.** Share returns are applied as the engine applies them, one smoothed monthly factor per year,
not the path's actual monthly moves. The data is monthly and a monthly loop would be more faithful; it is not
done in the first version so the saving years and the drawing-down years are on one grid and one convention.
Listed under what was assumed. A later change to both phases together, with a measured before/after.

### 1.3 Payments in

The short form asks two amounts a month, in today's pounds: **what you pay in** (what leaves your pay) and
**what your employer pays in**. Both rise with prices (contributions tend to follow pay). "Add more detail"
offers: yearly salary (for the relief rate and the allowance warnings); how relief is given (below); a yearly
rise above prices (`escalation`, default 0); savings a month outside a pension (ISA); a year to stop paying in
(the "coast" question, S22); whether pension income has already been taken (the £10,000 limit).

The gross pension purchase each month, reusing `contributionBreakdown` from `AccumulationEngine.js` unchanged:

| Relief given by | Gross pension purchase | Default? | Assumed line |
|---|---|---|---|
| The provider adds basic-rate relief (relief at source) | own ÷ 0.8 + employer | **yes** | "We've added the 20% tax relief the provider claims for you." |
| Taken from pay before tax (net pay) | own ÷ (1 − marginal rate) + employer | with salary | "Your payments go in before tax." |
| Salary sacrifice | own ÷ (1 − marginal rate − NI rate) + employer | with salary | "…and before National Insurance." |

Higher-rate relief under relief at source is **not added** to the pot unless the person says they claim it
(field `claimsHigherRate`, default no); with a salary over £50,270 a note says what the claim is worth a month
(`hrClaimMonthly`). This is the cautious side and matches the module's own comment that the claim is commonly
missed.

Warnings (rules, not caps — the arithmetic never silently reduces a payment):

| id | When | Text |
|---|---|---|
| `annual-allowance` | gross pension purchases over £60,000 a year | "You'd be paying in more than the £60,000 a year the tax rules allow. Unused allowance from the last three years may cover it; otherwise the extra is taxed." |
| `pension-income-limit` | `alreadyTakingPension` and gross over £10,000 a year | "Once you've taken taxable income from a pension, tax relief is limited to £10,000 a year paid in. This plan pays in more." |
| `earnings-limit` | own gross over the salary given (or over £3,600 with no salary) | "Tax relief is only given on payments up to what you earn." |
| `isa-allowance` | ISA saving over £20,000 a year | "The ISA limit is £20,000 a year." |
| `high-income-taper` | salary over £200,000 | "Above £200,000 the yearly allowance may be reduced." |
| `large-pot` | pot at the stop age over £1,073,100 in a middling case | "Above £1,073,100 the tax-free part of a pension is limited to £268,275 in total." |

Figures live in `RULES` (`rules.js`) beside the ones already there, asserted equal to `ACCUMULATION_RULES`.

### 1.4 The saving risk level and the slide to the retirement mix

Two risk levels, one vocabulary. "Risk level" under More detail already describes the mix the money is held in
**while it is being drawn** (Rail 2.2); questions A and B add **"Risk level while you are saving"** with the same
three names and the same mixes (`RISK_PRESETS`: Cautious 30/45/25, Balanced 50/40/10, Adventurous 70/25/5).

- **Default: Balanced for both**, so the short form asks nothing new and the two phases are one mix with no
  slide. The lever "take more investment risk while saving" (question B) sets the saving level to Adventurous.
- **The slide.** When the saving mix differs from the retirement mix, the target weights move in a straight line
  over the **last 10 years** before the stop date, year by year, from the saving mix to the retirement mix, so
  that at the stop date the pot is at the retirement mix and the handover has no change of mix. `SLIDE_YEARS =
  10` is one constant. With fewer than 10 years to go the slide starts today from the saving mix. A person who
  wants none says so (`slide: 'none'`, the mix switches on the stop date), and it is listed either way:

  > "While you are saving, about two thirds in shares, moving to about half in shares over the ten years before
  > you stop." / "…the whole time."

Why a straight line over ten years and not the engine's own tent: the tent (`equityGlide`) is a drawing-down
feature about the years after the stop; the saving slide is about the years before it, and the plain rule is
what default funds do and what a person can be told in one sentence.

### 1.5 Charges

Today's engine takes no charges off in the drawing-down years and C says so (`no-charges`). The saving years
will run for thirty years or more, over which a typical workplace charge is material (0.5% a year takes about
14% off a 30-year pot), and the owner's standing preference is the slightly pessimistic side. So:

- **Saving phase: 0.5% a year**, taken monthly from every sleeve (`chargeM` above), one constant
  `SAVING_CHARGE = 0.005`, editable under More detail (`charge`, 0–2%). Listed: "Charges of 0.5% a year are
  taken off while you are saving."
- **Drawing-down phase: none**, as C, listed as C lists it. The two phases are not made to agree here because C
  is shipped and pinned; making the drawing-down engine take charges is the same one-line change for every
  question and is decision 8.1 for the owner.

### 1.6 The recurrence, and why every payment solve is closed-form

With monthly rebalancing to weights that do not depend on the pot, the three sleeves collapse to one number.
Month `m` of the life multiplies the whole pot by

```
f(m) = ( wE(y) × monthly(equity[y])  +  wB(y) × bondMonthly[m]  +  wK(y) × monthly(cash(y)) ) × chargeM
```

and then adds the month's payment. So for a life `i` and stop age `a`:

```
potAtStop_i(a)  =  P0 × F_i(0 → 12S)  +  Σ_m  c(y(m)) × P(y(m)) × F_i(m+1 → 12S)         all ÷ P(S)
      where  F_i(u → v) = Π_{u ≤ m < v} f_i(m)
```

Two things follow. First, **the pot at the stop date is linear in the payment**: `pot_i(c) = A_i + c × B_i`,
where `A_i` is the pot with nothing paid in and `B_i` is the value at the stop date of £1 a month at today's
prices, rising with prices. The scratch run checked this against the three-sleeve loop: agreement to 1 part in
10¹⁴ over 20 lives. Second, with one number per saving year, `b_{i,y}` = the value at the stop date of £1 a
month paid during year `y` alone, **any pattern of payments is a weighted sum**: stopping after year `N`
(coast) is `Σ_{y<N} b_{i,y}`; a rise above prices of `g` a year is `Σ_y (1+g)^y b_{i,y}`; a lump sum in year `y`
is `L × F_i(12y → 12S)`. The saving phase is run **once per person per stop age** to produce `A_i` and the
vector `b_{i,·}`; every payment question after that is arithmetic on 1,000 × S numbers.

The engine module exposes this as the **kernel** of a stop age: `{ A: Float64Array(n), b: Float64Array(n × S),
priceAtStop: Float64Array(n) }`. It never reaches a result object.

### 1.7 The handover into the drawing-down adapter

At the stop date each person has a pension pot and an ISA pot, in today's prices, **one pair per life**. The
household model, the adapter (`enginePlan`, `configsAt`, `breakdownAt`), the fast path and the band solver are
reused as they are, with one addition: the pots are per future.

- `enginePlan(household, env)` is built once per stop age from the household **as it will be at the stop
  date**: ages advanced by `S`, `stopWork: already`, pots set to the **largest** pension and ISA over the lives
  (used only for the search's ceiling `kMax` and the fixed-order key). Everything else in the plan — the start,
  the years, each person's incomes by year, the periods, the base configs — does not depend on the pot.
- A **per-future runner** replaces `createFastRunner`: `run(r, i, config)` swaps in life `i`'s pots before the
  run (`equityStart/Min`, `bondStart/Min`, `cashStart/Target` = the person's pension pot in life `i` × the
  retirement mix; `isaBalance` = their ISA in life `i`), prepares the run's per-year tables once per `(r, i)`
  as `createFastRunner` does, and reads the life's drivers from month `12S`. `fastEngine.js` gains
  `prepareFutureFrom(life, offsetMonths, years)` beside `prepareFuture` (the same fields, drivers taken from
  the life instead of drawn), and `createFastRunner` gains an optional `potsFor(r, i)`; with neither given, both
  behave exactly as today, which the existing identity tests keep true.
- The **shares** of the household's need between two people (`per.shares`) depend on each person's money at
  the start, so for a couple `configsAt` is evaluated per life: `configsAt(plan, H, i)` with `plan.moneyFor(i)`.
  For one person the share is 1 and the config is the same for every life; the solver's config cache is keyed
  by `(k, i)` only for a couple.
- The **target schedule** is the household take-home `X` at today's prices (or the amount being searched),
  exactly as C: guaranteed income fills it first, the pots pay the rest, each person's before-tax target from
  `netToGross`. The State Pension amount, final-salary pension and tax bands are in today's prices and rise with
  the drawing-down phase's own price index, which is the life's continued (1.1).
- The result of the drawing-down phase for one life is the fast path's `{ failed, failMonth }`, as today.

Nothing about the drawing-down arithmetic changes: at `S = 0` the per-future runner's pots are today's pots in
every life, `prepareFutureFrom(life, 0, D)` is `prepareFuture`, and the whole thing is `answerC`.

**What "no jump" means, precisely.** At the stop month: the pot value is the saving loop's last value (no
withdrawal and no growth are applied twice); the sleeves are at the retirement mix (the slide is complete); the
price level continues (`P(S)` is the divisor, and the engine's first-year index of 1 stands for it); the share
returns continue (drawing-down year 0 is life year `S`); the bond stream continues; the cash rate reads the true
previous year. The only discontinuity in kind is the one the engine already has between any two of its own
years: the smoothed monthly factor changes at the year boundary.

---

## 2. The solves and the computational plan

All amounts are household take-home a month at today's prices, in whole £10 as C. "Lasted" means the drawing-
down phase reached the plan-to age without a month the pots could not pay. "In a bad case" is the 1-in-10 point
of the sorted outcomes, C's definition, one constant (`BAND`).

### 2.1 The verdict at a named stop age and a named spend (question A, step 2)

Inputs: the stop age `a`, the spend `X`. For every life: the saving phase to `a` (the kernel), then one
drawing-down run at `X`. Result: the share that lasted; the run-out age in a bad case (sorted run-out ages,
position `floor(n/10)`; the plan-to age if that life lasted); the verdict word:

| `lasted` | Verdict | Headline |
|---|---|---|
| ≥ 0.90 | `yes` | "Yes. Stopping at 60 on £2,000 a month lasted to 95 in 9 futures out of 10." |
| 0.75 – 0.89 | `marginal` | "Close. Stopping at 60 on £2,000 a month lasted to 95 in 8 futures out of 10. In a bad case it runs out at 87." |
| < 0.75 | `no` | "Not yet. Stopping at 60 on £2,000 a month lasted to 95 in 5 futures out of 10. In a bad case it runs out at 79." |

The thresholds are one constant (`VERDICT = { yes: 0.9, marginal: 0.75 }`), decision 8.2. Cost: one run per
life (2.6).

### 2.2 The sustainable take-home at a stop age (the range table's column)

C's band solver, unchanged, on the per-future runner: the careful, middling and good amounts, and the bad-case
run-out age at each. The solver's `estimate` (the three amounts from a previous pass, which it uses only to
order its runs) is fed with the **previous stop age's** amounts when the table is built in age order, which
brings the search to about 4.5 runs per life per age (measured, 2.6). The amounts a first pass found are kept
for the final pass per age, as C keeps them.

### 2.3 The pot needed at the stop age (question B, "your number")

For a target take-home `X` at stop age `a` and the chosen confidence `p` (default careful, 9 in 10):
the smallest pot `P` such that, **placed at the stop date in every life**, `X` lasts in a share `≥ p`.
`lasted(P)` is monotone in `P` (more pot never fails sooner in any life — the same fact that makes C's search
valid), so a bisection over `P` in steps of £1,000 between 0 and the lesser of £10,000,000 and 60 × `X`
takes at most 14 verdicts. The pension/ISA split of `P` is the person's own projected split at `a` in a middling
case (so a mostly-ISA saver's number is an ISA number), and the drawing-down phase's guaranteed incomes are as
the household says (State Pension at its age, final-salary pension at its start age). Result: `P`, rounded up to
£1,000, with the amount per month it delivers at that confidence (C's careful figure at exactly `P`, which is
≥ `X` by construction and ≤ `X + £10` by the search step).

The number is stated as a pot at the stop age at today's prices, and the sentence says so:
"You'd need about £380,000 at 65, in today's money, for £2,000 a month after tax to last to 95 in 9 futures out
of 10."

### 2.4 The monthly payment that gets there (question B, "what to pay in")

Given `P`, the kernel gives each life's pot for any payment: `pot_i(c) = A_i + c × B_i`. The payment that
reaches `P` in life `i` is `c_i = (P − A_i) / B_i` (0 when `A_i ≥ P`). The smallest payment that reaches `P` in a
share `p` of lives is the `p`-quantile of the `c_i`: sort upwards, take position `ceil(p × n) − 1`. **No search,
no runs**: a thousand divisions and a sort. It is exact by construction (5.4), and reported as the gross pension
purchase a month, split back into own payment, relief and employer through the relief method chosen (1.3), each
rounded up to £5. "Coast" (S22) is the same formula with `B_i` replaced by `Σ_{y<N} b_{i,y}`, and "if I stop
paying in today" is `A_i` alone: the share of lives with `A_i ≥ P`.

Two confidences, stated once each. The pot `P` is the number that gives `X` in 9 futures out of 10 once you have
it; the payment `c` is the one that reaches `P` in 9 futures out of 10 while you save. Taken together they are
more careful than 9 in 10 on the whole life — the lives where saving goes badly are not the lives where drawing
goes badly — and the engine also reports the **whole-life share**: with payment `c` to age `a` and then `X` a
month, the share of lives that lasted (one run per life with each life's own pot; 2.1). The screen leads with
`P` and `c` and shows the whole-life share as the check line: "Paying in £450 a month until 65 and then taking
£2,000 a month lasted to 95 in 9 futures out of 10." Decision 8.3 offers the alternative (solve `c` on the
whole-life share directly, a bisection of about 12 verdicts).

**When it does not fit.** "Does not fit" = the payment is above what the person said they can afford (field
`canAfford`, optional), or over the yearly allowance, or the pot at the stop age in a middling case is under `P`
with the payments as they are. Then the five choices are shown side by side, each a pure function of what is
already computed:

| Choice | How it is worked out | Cost beyond the first pass |
|---|---|---|
| Stop later | 2.3 and 2.4 again at `a + 1 … a + 5` (the kernel per age; the pot search per age) | 5 × (kernel + ≤ 14 verdicts) |
| Pay in more | `c` itself, and the pot it reaches in a bad case, `A_i + c × B_i` at position `floor(n/10)` | none |
| Spend less | the careful take-home at the pot the current payments reach: the band (2.2) at `a` with the person's own kernel | one band solve |
| Take more investment risk while saving | the kernel again with the saving mix Adventurous (a second saving pass) then 2.4 | kernel + none |
| Accept a stated chance of falling short | the share of lives reaching `P` at the affordable payment, and the whole-life share at it | none / one run per life |

The choices are shown as a table, each row one sentence with its figure ("Stop at 67 instead: £310 a month" /
"Pay in £610 a month instead of £450" / "Spend £1,780 a month instead of £2,000" / "Take more investment risk
while saving: £390 a month, with a worse bad case" / "Keep paying £450: reaches the number in 6 futures out of
10"). No row is a recommendation; the screen says so.

### 2.5 The range of ages, what one more year buys, the earliest safe age (question A, steps 3–4)

For candidate ages `a = a_lo … a_hi` (default: from the later of next year and 55 — or from the age the ISA and
savings could pay for if the person has any, section 3.2 — to the later of 68 and the named age + 3, capped at
75; fourteen rows for a typical 45-year-old):

| Column | From |
|---|---|
| Pot at that age (careful / middling / good, today's prices) | the kernel |
| At £X a month: lasted in N out of 10; runs out at (bad case) | 2.1 |
| You could take (careful / middling / good) | 2.2 |
| One more year buys | `careful(a+1) − careful(a)` a month, and `lasted(a+1) − lasted(a)` at `X` (S17) |
| Which pot pays the years before your State Pension | `breakdownAt` phases at `careful(a)` — the pot or the savings, until each income starts (3.2) |

The **earliest age at the chosen confidence** is the first row with `lasted ≥ p` at `X`, read off the table
(S03); when none reaches it, the row with the highest share is named and the sentence says so. The named age's
row is the verdict of 2.1 and is always in the table, so the two never disagree.

Monotonicity is *not* assumed by the reading: a later age is checked in its own row. In the scratch run every
column rose with age at 1,000 lives (2.6); 5.3 makes "the careful take-home never falls as the stop age rises" a
check on the fixtures and a finding, not an assertion, because the lives are shared and a 1-in-10 point can dip
in principle.

### 2.6 What it costs, measured

Apple M4, Node 24, one thread, `fastEngine.js` as shipped in 6.17.0 (question C itself: 55 ms at 100 futures,
304 ms at 1,000, forum-guest case, 8 evaluations per future including the run-out months). One person, Balanced
both phases, 0.5% charge, 10-year slide, 1,000 lives unless said.

| Piece | Measured | Per life |
|---|---|---|
| Lives: `bootstrapPaths` for 65 years (780 months) | 7 ms | 7 µs |
| Life-wide bond stream + yearly returns for 65 years | 126 ms | 0.13 ms |
| Saving phase, 35 years, three sleeves month by month, drawing its own bonds | 88 ms | 88 µs |
| Saving phase with the bond stream already drawn (the kernel) | 1–2 ms per age | ~2 µs |
| One drawing-down run of 35 years (the fast path) | 16 ms per 1,000 | **16 µs** |
| Preparing a future for the drawing-down phase, bond draws included, per age | 105 ms | 0.1 ms |
| The band solve at one stop age, no estimate | 143 ms; 3.3 runs per life (4.4 with the run-out months) | |
| The verdict at one age and one spend (one run per life, fresh preparation) | 94 ms | |
| The pot needed at 65 for £24,000 a year, 9 in 10: 11 bisection steps | 326 ms (£378,000) | 30 ms a step |
| **The whole range table, ages 55–68, verdict + band per age, estimate chained** | **3.09 s at 1,000; 0.97 s at 300; 0.35 s at 100** | 5.5 runs per life per age |
| The task's headline: 1,000 lives × 35 saving years + the drawing-down solve for one age | **270 ms** | |

The largest single cost in the table is not the runs: it is drawing the bond model afresh for every age (105 ms
of each age's ~200 ms). With the life-wide stream of 1.1, that cost is paid once (126 ms for the whole life) and
the table falls to an estimated **1.6 s at 1,000 lives** (the runs and the per-run tables remain: about 14 × 90
ms). Taking a mid-range phone as four times slower, the brief's convention:

| Pass | Lives | Ages | On the Mac | On a phone (×4) |
|---|---|---|---|---|
| 1 | 100 | every age, verdict + band | 0.35 s (0.2 s with the shared stream) | ~1.4 s (~0.8 s) |
| 2 | 1,000 | the named age and its two neighbours, verdict + band; every other age verdict only | ~0.5 s | ~2 s |
| 3 | 1,000 | the rest of the bands, outward from the named age | ~1.1 s | ~4.5 s |

So: **the whole table at 1,000 lives is not under 3 seconds on a phone**; the first look at every age is, and
the final figures for the age the person asked about are within the next two. The schedule:

1. **Pass 1 (100 lives).** Lives and stream built; kernel per age; every age's verdict and band. Shown at once,
   every figure labelled as a first look (C's `first` state: "about", nearest £50).
2. **Pass 2 (1,000 lives).** The 100 lives are the first 100 of the 1,000 (C's rule), so pass 1's amounts seed
   each age's search. The named age and `a ± 1` in full; every other age's verdict at `X` (one run per life).
   Rows replace their first look as they land; `answer/first` → `answer/final` per row, the state holding a
   `rows[age].status`.
3. **Pass 3 (1,000 lives).** The remaining bands, in age order outward from the named age, each row landing as
   it finishes. The rail's next sentence does not wait for pass 3.

Each pass is one call of the pure function with `env.futures` and `env.detail: 'all' | 'named'`; the runner
(`effects/run.js`) makes three calls instead of C's two and drops stale results by key as now. What is kept
between calls, as C keeps its estimate: the lives and the stream (keyed by seed, `T` and `futures`), each age's
kernel (keyed by the household's saving inputs), and each age's three amounts. A change to the payment or the
spend re-uses everything but the runs it needs (a spend change: verdicts only, 14 × 16 µs × 1,000 = 0.22 s on
the Mac); a change to the pot, the ages or the risk level rebuilds the kernels (cheap) and the searches.

Memory for 1,000 lives: yearly returns 2 × 87 doubles, the bond stream up to 1,044 doubles: about 10 MB. The
monthly index paths are dropped after `annualNominal`. A couple doubles the runs, not the lives.

Bounds on the work, for the tests that assert them: kernel = 1 saving pass per person per age; verdict = 1 run
per person per life per age; band ≤ 6 runs per life per age with the estimate (the solver's own tests bound it
at 8 without); pot needed ≤ 14 verdicts; payment = 0 runs.

---

## 3. Rules

### 3.1 Pension access, 55 or 57, by date of birth

`firstOpenAge(age, today, yearsFromNow)` and `accessAgeOn(date)` already give the first age a person can touch a
pension: 55 if they reach 55 before 6 April 2028, else 57. With age only (this slice, as C), the birthday is
taken as today; month and year of birth, when the form gains it, feed `pensionAccessAge(born, date)` unchanged.
A candidate stop age below that age is allowed (3.2); it is never rejected by the form.

### 3.2 Stopping before the pension opens: the ISA and savings pay

For question A the start of the drawing-down phase **is the stop age**. C moves the start to the day the pension
opens (`startWhenPensionsOpen`, when less than half the pension money is open) because C has no saving years and
says "your pot as it stands". The saving-years engine passes the household to `enginePlan` with one option,
`{ start: 'asGiven' }`: the start never moves, every pension still closed at the start is `lockedUntil` its
holder's first open age, and the adapter does what it already does for a closed pension — the pension run draws
nothing and stays invested until it opens, and the holder's ISA is a run of its own that pays their share
(`toEngine.js`, "a person whose pension is closed at the start"). Without the option `enginePlan` is unchanged,
which C's pinned outputs keep true.

What the person sees for a stop at 53 with a pension opening at 57:

- the phases: "53 to 56: £1,900 a month, all from your ISA and savings. From 57: £1,900 a month from your
  pension pot. From 67: £1,046 State Pension + £854 from your pension pot."
- when the savings cannot pay to 57 in a bad case: the run fails in that month and the verdict names it: "In a
  bad case your savings run out at 55, before you can touch your pension at 57." (`runOutAge` is the household's
  as now; a flag `beforeAccess: true` on the verdict when the bad-case run-out is earlier than every pension
  holder's open age.)
- the range table starts from the youngest age the savings could pay for at `X` in a middling case, so someone
  with a large ISA sees 50, 51, 52 as real rows and someone without sees the table begin at 55 or 57 with a
  line saying why: "Before 57 you cannot touch your pension, and you have no other savings to live on."

The engine grows the ISA at its fixed 3% during the drawing-down years (`RULES.savingsGrowth`; C's known gap,
listed). In the saving years the ISA is in the mix chosen (1.2).

### 3.3 State Pension age by date of birth

`statePensionAge(born)` and `wholeStatePensionAge` unchanged; the amount defaults to the full new State Pension
as C; listed as C lists it. "Which pot pays the years before your State Pension starts" is C's `phases` with
`beforeStatePension: true`, and the sentence names the pot: "Until 67: £2,000 a month, all from your pension
pot" / "…from your ISA and savings".

### 3.4 Part-time work for N years (question A step 6; S10, S12)

Fields: `partTime.monthly` (before tax, today's prices) and `partTime.years`, from the stop age. It becomes
`otherIncome: [{ kind: 'work', amountPerYear, fromAge: a, toAge: a + N }]` in the household and an entry of
`extraIncomes` with `startYear: 0, endYear: N − 1, indexation: 'cpi'` in the engine config. The engine already
handles it (`prepareRun` reads `endYear`); `fastEligible` today refuses an `extraIncomes` entry with an `endYear`,
so it gains that case, and the identity test (`speed.identity.test.js`) gains part-time households. Earnings
are taxed as income with no National Insurance, and listed (C's `work-tax`). The lever is shown as its own row
of the range table for the named age and as a step: "Working part-time for 3 years on £1,200 a month: lasted in
9 futures out of 10 instead of 7; in a bad case runs out at 91 instead of 84." Payments into the pension while
working part-time are not modelled (a note), and `pension-income-limit` fires if they are entered alongside a
pension already being drawn.

### 3.5 Final-salary pensions and the State Pension in the drawing-down phase

As C: `dbStartYear` from the start age minus the age at the start; the amount rises with prices capped at 5%
in the household's rows and the pot pays only its own share (the ruling of 30 Sep). A final-salary pension that
starts before the stop age is in payment from the start. Nothing new.

### 3.6 Couples

Short form: each person's age, pension pot, what they pay in and what their employer pays in (four numbers more
than one person, plus the "whose?" on the final-salary row, as HH 1.3); one stop age, both stop together
(`both-stop-together`), one household spend. Full detail: each person's own stop age. When they differ the
household's start is the earlier stop; the later stopper's earnings until their own stop are `otherIncome`
of kind `work` (their salary, asked under full detail), and **their payments in after the household start are
not counted** — the pot they bring to the start is their saving phase to that date. Listed: "We've stopped
counting your partner's payments in from the year you stop." It is the cautious side; the accurate version puts
those later payments into the drawing-down engine as dated lump sums (`windfalls`, which `simulate` has and the
fast path does not) and is decision 8.5. Each person's saving phase runs on the household's lives (one life =
one market for both), with their own kernel; the drawing-down phase is C's two-person run with per-future
pots for both.

---

## 4. The input lists and the result objects

Typed as JSDoc in `src/answers/shared/contract.js` like C's. Plain data only: no functions, no Dates, nothing
undefined, no per-life arrays. Every result carries `assumed[]`, `warnings[]`, `sentences`, `basis` and `units`
with C's shapes.

### 4.1 Fields shared by A and B (`src/answers/shared/savingSchema.js`, merged into `SCHEMA_A`, `SCHEMA_B`)

```js
// No words here. Labels, help, errors: src/v7/copy/{a,b}.js.
{ path: 'you.pot',              type: 'money', min: 0, max: 10_000_000, required: true, group: 'you' },     // pension pots today
{ path: 'you.age',              type: 'age',   min: 18, max: 100, required: true, group: 'you' },
{ path: 'you.payIn.own',        type: 'money', min: 0, max: 20_000, default: 0, group: 'you',              // a month, from your pay
  boundaries: [0, 1, 240, 300, 4_000, 5_000] },
{ path: 'you.payIn.employer',   type: 'money', min: 0, max: 20_000, default: 0, group: 'you' },
{ path: 'you.savings',          type: 'money', min: 0, max: 10_000_000, default: 0, group: 'you' },         // ISAs and savings today
{ path: 'you.statePension.kind' … 'you.finalSalary.fromAge' }                                             // as SCHEMA_C
{ path: 'stop.age',             type: 'age',   min: 18, max: 100, required: true, group: 'stop',
  boundaries: [50, 54, 55, 56, 57, 60, 66, 67, 68, 75] },                                                 // B: the target stop age
{ path: 'spend',                type: 'money', min: 0, max: 50_000, required: true, group: 'spend' },       // a month, after tax, today's prices
{ path: 'spend.level',          type: 'choice', options: ['basic', 'moderate', 'comfortable'], default: null, group: 'spend' }, // PLSA_2024 instead of a figure
// Add more detail (all optional; every default listed)
{ path: 'you.salary',           type: 'money', min: 0, max: 1_000_000, default: null, group: 'more' },
{ path: 'you.relief',           type: 'choice', options: ['provider', 'beforeTax', 'salarySacrifice'], default: 'provider', group: 'more' },
{ path: 'you.claimsHigherRate', type: 'yesNo', default: false, when: { 'you.relief': 'provider' }, group: 'more' },
{ path: 'you.payIn.savings',    type: 'money', min: 0, max: 20_000, default: 0, group: 'more' },           // a month into ISAs
{ path: 'you.payIn.rise',       type: 'percent', min: 0, max: 10, default: 0, group: 'more' },             // a year above prices
{ path: 'you.payIn.untilAge',   type: 'age', min: 18, max: 100, default: null, group: 'more' },            // coast: stop paying in at this age
{ path: 'you.alreadyTakingPension', type: 'yesNo', default: false, group: 'more' },
{ path: 'saveRisk',             type: 'choice', options: ['same', 'cautious', 'balanced', 'adventurous'], default: 'same', group: 'more' },
{ path: 'slide',                type: 'choice', options: ['tenYears', 'none'], default: 'tenYears', group: 'more' },
{ path: 'charge',               type: 'percent', min: 0, max: 2, default: 0.5, group: 'more' },
{ path: 'risk', path: 'endAge' }                                                                          // as SCHEMA_C
{ path: 'confidence',           type: 'choice', options: ['nineInTen', 'fourInFive', 'threeInFour'], default: 'nineInTen', group: 'more' },
// the partner block: the same `you.*` paths under `partner.*`, each with when: { household: 'couple' }; plus
{ path: 'partner.stop.age',     type: 'age', min: 18, max: 100, default: { rule: 'stopTogether' }, when: { household: 'couple' }, group: 'partner' },
```

Question A adds `{ path: 'partTime.monthly' … }`, `{ path: 'partTime.years', min: 1, max: 20 }` (both optional,
the lever), and `ages.from` / `ages.to` (optional, default by rule 2.5). Question B adds `canAfford` (a month,
optional) and `target` — the take-home wanted at the stop age (`spend` under another label; B and A share the
path). Rules: `stop-not-before-now`, `end-after-stop`, `until-not-after-stop`. A single person on A types four
things (pot, age, stop age, spend) and B types the same four with the payments in defaulting to 0 (a "what if I
paid in nothing" answer is valid and says so) — within the limit of five, counted by a test.

### 4.2 `SavingOutcome` — one per person, in every A and B result

```js
{ who: 'you' | 'partner',
  stopAge, yearsSaving,                                // S
  potToday: { pension, savings },
  payIn: { own, relief, employer, total, savings },    // £ a month, gross purchase, today's prices; rounded to the pound
  reliefMethod: 'provider' | 'beforeTax' | 'salarySacrifice', higherRateClaimAMonth: number | 0,
  potAtStop: { pension: { careful, middling, good }, savings: { careful, middling, good }, total: { careful, middling, good } },
                                                       // today's prices; careful = the 1-in-10 low; whole £1,000
  paidInAltogether: { own, employer, relief },         // over the saving years, today's prices
  mix: { saving: 'balanced', retirement: 'balanced', slideYears: 10 | 0 },
  chargeAYear: 0.005,
  untilAge: number | null }                            // coast
```

### 4.3 `AgeRow` — one per candidate age (A)

```js
{ age,                                                 // of `whose` (the younger; 'you' when single)
  ages: { you, partner? },
  pot: { careful, middling, good },                    // household total at the stop, today's prices
  atSpend: { perMonth, lasted, outOfTen, runOutAge, verdict: 'yes' | 'marginal' | 'no', beforeAccess: boolean },
  takeHome: { careful, middling, good } | null,        // null until its band has landed (pass 2/3)
  runOutAge: { careful, middling, good } | null,
  oneMoreYear: { takeHome: number, lasted: number } | null,   // against the row above
  phases: [Phase] | null,                              // C's Phase, at the careful amount; the named age always has them
  status: 'first' | 'final' }
```

### 4.4 `AnswerA`

```js
{ status: 'ok' | 'invalid' | 'none', problems?,
  inputs, whose,
  saving: [SavingOutcome],
  named: AgeRow,                                       // the stop age asked about
  ages: [AgeRow],                                      // in order; includes `named`
  earliest: { age, lasted, met: boolean } | null,      // the first row with lasted ≥ confidence
  partTime: null | { monthly, years, atSpend: { lasted, outOfTen, runOutAge }, instead: { lasted, runOutAge } },
  guaranteed: { monthlyAfterTax },
  assumed, warnings, sentences: { head, sub, line, bad, earliest, oneMore, before, partTime, … },
  basis: { …C's, lifeYears: T, savingYears: S, drawYears: D, confidence, detail: 'all' | 'named', stream: 'life' },
  units }
```

### 4.5 `AnswerB`

```js
{ status, problems?, inputs, whose,
  saving: [SavingOutcome],
  target: { perMonth, source: 'entered' | 'level' },
  number: { pot, atStopAge, delivers: { perMonth, lasted } },                  // 2.3; pot whole £1,000, today's prices
  payIn: { needed: { total, own, relief, employer }, now: { total }, reaches: { lasted } },   // 2.4; £ a month, rounded up to £5
  wholeLife: { lasted, outOfTen, runOutAge },          // paying `needed` to the stop age then taking `target`
  onCourse: 'yes' | 'close' | 'no',                    // with today's payments: pot in a middling case ≥ number / within 10% / under
  fits: boolean,
  choices: null | { later: [ { age, payIn, number } ], more: { payIn }, less: { perMonth }, risk: { payIn, potCareful },
                    accept: { lasted, wholeLife } },   // 2.4's table; null when it fits
  coast: null | { fromAge, lasted, potCareful },       // when payIn.untilAge is given
  assumed, warnings, sentences, basis, units }
```

Both answers are `answerA(inputs, env)` / `answerB(inputs, env)` in `src/answers/a/answer.js` and
`src/answers/b/answer.js`, registered in `src/answers/index.js`, sentences in their own `sentences.js` with
C's `Sentence` shape (`text === parts joined`), and the same `Env` plus `detail`. Pure: no clock, no storage, no
`Math.random`; the boundaries test extends to them unchanged.

### 4.6 The assumed lines (ids; wording proposed, owner to approve with the fixtures)

`payments-rise-with-prices` · `relief-provider` ("We've added the 20% tax relief the provider claims for
you.") · `no-higher-rate-claim` · `charges-saving` ("Charges of 0.5% a year are taken off while you are
saving.") · `no-charges` (drawing down, C's) · `save-risk-same` / `save-risk` + `slide` (1.4) ·
`saving-rebalanced` ("Your savings are kept at that mix as you go.") · `yearly-grid` ("Markets are applied
year by year, as the rest of the plan is.") · `stop-together` · `partner-payments-stop` (3.6) · `isa-fixed-
growth` (drawing down, C's gap) · `spend-level` ("A moderate lifestyle costs about £X a month for one person
(Retirement Living Standards).") · `confidence` ("Careful means it lasted in 9 futures out of 10.") · plus C's
list where it applies (`state-pension-full`, `plan-to`, `todays-prices`, `tax-rules`, `futures`, …).

---

## 5. Validation

Every check below is a test in `tests/v7/{a,b}/` or `tests/v7/shared/saving.test.js`, written before the code.

### 5.1 Identities with what exists

1. **No saving years = question C.** For every C fixture and every named state, `answerA` with `stop.age` =
   today's age, `payIn` 0, `detail: 'named'` gives `named.takeHome`, `runOutAge` and `phases` **equal to
   `answerC`'s** `monthly`, `runOutAge`, `phases` — byte for byte on the raw numbers, at 40 and at 1,000 futures.
   This is the prefix property (1.1) plus the runner at `S = 0`. It is the join test.
2. **The drawing-down phase is the engine.** With an all-shares mix (`env.mix`, as C's closed forms use it — the
   bond stream then plays no part) and any `S`, each life's `{ failed, failMonth }` from the per-future runner
   equals `simulate(config_i, annualNominal(life_i, 12S, D), seed_i)` on the same config with that life's pots.
   With bonds in the mix and `S > 0` the streams differ by design (1.1), so that case is checked the other way:
   the per-future runner with `prepareFutureFrom(life, 12S, D)` against `prepareFuture` fed the same stream
   slice — the same arithmetic, the same months.
3. **`enginePlan` unchanged without the option**; `fastEligible` unchanged for every config C builds; C's pinned
   outputs and `speed.identity` untouched.
4. **Today's fixed-rate projection as a special case.** `env.futureReturns` gives every life the same flat path
   (shares 5% nominal every year, prices 2.5%), the mix all shares, no charge, no slide: `potAtStop.middling` (=
   careful = good) equals `projectAccumulation(...)`'s `potMid` at that age to within 0.3% over 35 years — the
   two differ only in their monthly compounding (`(1+r)^(1/12)` here, `r/12` there); with the oracle written
   with `(1+r)^(1/12)` they agree to the penny. Likewise the low and high FCA lines at 2% and 8%.

### 5.2 Closed forms (`env.futureReturns`, `env.mix`)

| Case | Expected |
|---|---|
| CF-S1: shares return 0, flat prices, all shares, no charge | pot at the stop = `P + 12 × c × S` exactly (checked in the scratch run) |
| CF-S2: as S1 with charge `q` a year | `P × Q^(12S) + c × Q × (Q^(12S) − 1) / (Q − 1)`, `Q = (1 − q)^(1/12)` |
| CF-S3: shares return `r` every year, flat prices, all shares | compound interest with monthly factor `(1+r)^(1/12)`: the standard annuity-due formula, to the penny |
| CF-S4: as S3 with prices rising `π` a year | nominal as S3 with payments `× P(y)`, then `÷ P(S)`; and `potAtStop` in today's prices is independent of `π` when `r` is replaced by the real rate — i.e. the real pot at flat prices with `r′ = (1+r)/(1+π) − 1` equals it |
| CF-S5: the slide | with shares 0 and cash at its floor, the pot is unchanged by the slide (it only moves weights, never value) |
| CF-S6: the kernel | `A_i + c × B_i` equals the three-sleeve loop for random `c`, mixes, charges and slides, to 1e-9 relative; `Σ_y b_{i,y} = B_i` |
| CF-S7: coast | `untilAge` = today's age gives `A_i`; = the stop age gives `A_i + c × B_i` |
| CF-S8: pot needed | on a flat path, the pot needed for `X` at 9 in 10 equals the one at 5 in 10 (every life is the same), and equals C's level-withdrawal annuity closed form (C's CF) inverted, within £1,000 |
| CF-S9: relief | own £240 under `provider` → gross £300; under `beforeTax` at a 40% marginal rate → £400; employer added unchanged |

### 5.3 Invariants (fast-check on generated households, 200 lives; nightly at 1,000)

Hard (asserted, life by life where stated):

1. **More paid in never gives a smaller pot** — in *every* life (`A_i + c × B_i` is increasing in `c`; the loop
   version too), and therefore in careful, middling and good.
2. **More pot today never gives a smaller pot at the stop**, in every life.
3. **A higher charge never gives a larger pot**, in every life.
4. **More pot at the stop never fails sooner**, in every life (the engine's monotonicity, which the pot search
   relies on); **more spend never lasts longer**.
5. **The band is in order** and `lasted.careful ≥ 0.9` (C's I-rules, applied per age row).
6. **Round trips.** The payment `needed` fed back reaches `number.pot` in a share `≥ p` of lives, and `needed −
   £5` in a share `< p`. `number.pot` placed at the stop age gives a careful amount `≥ target` and `number.pot
   − £1,000` gives `< target`. The earliest age's row has `lasted ≥ p` and the row before it `< p`.
7. **A partner with nothing changes nothing**; **swapping the two people changes nothing**; **a stop age equal
   to today's age with payments equals C** (5.1.1).
8. **Nothing negative or undefined**; every row's phases add up; every `Sentence.text` equals its parts; no
   banned word; no countdown wording in any A/B sentence for a person whose `stop.kind` is `already`.
9. **Work bounds** of 2.6 hold (runs counted through the runner).

Soft (checked on the fixtures and the nightly set; a failure is a finding written to `exceptions.md`, not a red
test): the careful take-home in the range table never falls as the stop age rises; `lasted` at `X` never falls
as the stop age rises; the pot at the stop in a middling case rises with the stop age.

### 5.4 Determinism and sameness

- The same inputs and `env` give the same bytes on a second call (as C), with the clock moved across 5/6 April,
  and with the memo of kernels and estimates warm or cold (the memo may change the order of runs, never a
  number — the solver's own guarantee).
- The lives depend only on `seed`, `futures` and `T`; a test changes every amount and asserts the lives' hash
  is unchanged.
- Cross-browser (Chrome, Safari, Firefox, `e2e/sameness.spec.js` extended to A and B): decisions, displayed
  figures and sentences exactly equal; raw money within 1p — C's standard. The saving loop adds `Math.pow` for
  the monthly and charge factors, the same class of operation C already depends on; the block bootstrap and
  the bond stream are integer generators.

### 5.5 Fixtures (one per research scenario, approved once by the owner)

S01 stop soon (58, £320k, ISA £40k, stop at 60, £2,000 a month) · S02 my number (45, £120k, £300 + £250 a month,
stop at 65, £2,000) · S03 range (50, £250k, no fixed date) · S04 the years before the State Pension (56, £400k,
ISA £60k, stop at 58, final-salary £9,000 from 65) · S10 part-time (60, £350k, three years on £1,200) · S17 one
more year (57, £600k) · S22 coast (40, £180k, stop paying in at 45) · S12 forced out (55, £140k, lump sum
£30,000 into savings, £1,300 a month) · a couple on S02 and on S03 · an ISA-funded stop at 52. Each pins the
sentences and the figures at 1,000 lives, as C's do.

---

## 6. The scratch measurement

A throwaway script (not in the repository) built the saving phase of 1.2 on the lives of 1.1 — three sleeves,
monthly rebalancing, 0.5% charge, the 10-year slide, the bond model drawn with the engine's own
`calculateBondReturn` from a copy of `fastEngine.js` — and then ran the drawing-down solve for one stop age by
handing `createBandSolver` a per-future runner that swaps each life's pot into the fast path's run tables.
Nothing in `src/` was edited; the copy of `fastEngine.js` only exported its internals.

**The headline case asked for**: 1,000 lives, a 30-year-old with £20,000 paying in £500 a month (gross), stop at
65, Balanced both phases, plan to 95 (life 65 years; saving 35; drawing down 30).

| Step | ms |
|---|---|
| 1,000 lives of 780 months | 6 |
| Saving phase, 35 years × 12 months × 1,000 lives, bonds drawn as it goes | 89 |
| Drawing-down returns from month 420 of each life | 2 |
| Band solve at 65 (3.2 runs per life) | 155 |
| Run-out months at the three amounts | 18 |
| **Total** | **270** |

Results (today's prices): pot at 65 — bad case £249,000, middling £407,000, good £656,000; you could take
careful £1,790, middling £2,480, good £3,590 a month; at £1,790 the plan lasted in 90.1% of lives. (The pot's
deflator is `P(S)`, 1.1; the first run of the script divided by `P(S−1)` and gave pots 2–3% higher — worth
noting because it is exactly the kind of one-year slip the join tests of 5.1 exist to catch.)

**The range table**: a 45-year-old with £120,000 paying in £625 a month gross, spend £24,000 a year, ages 55–68.
3.09 s for the whole table at 1,000 lives (0.97 s at 300, 0.35 s at 100), 5.5 runs per life per age, the band
seeded with the previous age's amounts. Every column rose with age: careful take-home £1,180 at 55 to £2,100 at
68; lasted at £24,000 from 6% at 55 to 94% at 68; the earliest age at 9 in 10 is 67. The verdict alone at one
age costs 66–96 ms, of which about 60 ms is drawing the bond model for that age's drawing-down years — the
motive for the life-wide stream (1.1, 2.6).

**The pot needed**: 45-year-old, stop at 65, £24,000 a year take-home, 9 in 10: £378,000 in 11 bisection steps,
326 ms (30 ms a step after the first, which pays for the bond draws).

The C-prefix property and the linearity of the pot in the payment were checked in the same script (1.1, 1.6).

---

## 7. What changes in existing files

| File | Change | Guarded by |
|---|---|---|
| `src/answers/shared/fastEngine.js` | `prepareFutureFrom(life, offsetMonths, years)`; `createFastRunner(plan, futures, { potsFor })`; `fastEligible` accepts `extraIncomes[].endYear` | `speed.identity.test.js` unchanged and extended (part-time; offset 0 = `prepareFuture`) |
| `src/answers/shared/toEngine.js` | `enginePlan(household, env, { start: 'asGiven' })`; `configsAt(plan, H, i)` for per-life shares; `plan.moneyFor(i)` | C's pinned outputs; a test that the option-less call is byte-identical |
| `src/answers/shared/futures.js` | `livesList(count, T, env)` and `lifeReturns(i, T, env)` beside `futuresList`; `bondStream(life)` | the prefix test; the "depends only on seed, count, T" test |
| `src/answers/shared/rules.js` | allowance figures (asserted equal to `ACCUMULATION_RULES`), `SAVING_CHARGE`, `SLIDE_YEARS`, `VERDICT`, `CONFIDENCE` | `schema.test.js` |
| `src/answers/shared/band.js` | none (the solver takes its runner already) | — |
| `src/services/AccumulationEngine.js` | none; `contributionBreakdown` and `contributionWarnings` reused. `projectAccumulation` stays as the current app's fixed-rate line until cutover | — |
| `src/services/RetireSweep.js` | none now; retired with the old shell at cutover (the range table replaces it) | — |
| `src/v7/effects/run.js`, `answerWorker.js` | three passes for A; `detail` in `env`; per-row status | `shell/run.test.js` |

New: `src/answers/shared/{lives,saving,stopAge,ages}.js` (lives and stream; the kernel; the per-future plan
and runner, verdict, pot needed; the range table and its schedule), `src/answers/{a,b}/{schema,answer,
sentences,toHousehold}.js`, `tests/v7/{a,b}/…`, `tests/v7/shared/saving.test.js`, fixtures of 5.5, the four A
screens and five B screens of Rail 1.5 (their drawings are a separate document).

---

## 8. Decisions for the owner

1. **Charges.** 0.5% a year in the saving years (listed, editable), none in the drawing-down years as C. Or
   make both take 0.5% by giving the drawing-down engine a charge — one change for every question, moving C's
   pinned figures down by a few percent. Proposed: saving only now; both at the first release after 7.0.
2. **The verdict words and thresholds**: yes ≥ 9 in 10, close 7½–9 in 10, not yet under 7½ in 10. Confirm.
3. **Two confidences or one** for "what to pay in" (2.4): proposed the pot at 9 in 10 and the payment reaching
   it at 9 in 10, with the whole-life share shown as the check line. The alternative solves the payment on the
   whole-life share alone (fewer words, less careful).
4. **Saving risk default = the retirement risk level (Balanced)**, with a 10-year straight-line slide when they
   differ. The alternative default is what most workplace funds do (Adventurous while saving, sliding to
   Balanced), which gives a larger number for most people and is the less careful side.
5. **A couple stopping at different ages**: the later stopper's payments after the household's start are dropped
   and said so (3.6), until the fast path takes dated lump sums. Accept for the first A/B release?
6. **The range table's budget**: the first look at every age within about 1.5 s on a phone, the asked-for age
   final within about 2 s more, the rest landing over the next 5 s — against the 3 s asked for. Accept, or
   restrict the final pass to 300 lives (every age final in about 2 s on a phone, the careful amount then
   within about £20 of the 1,000-lives figure on C's measurements)?
7. **Higher-rate relief** not added unless the person says they claim it. Confirm.
8. **The yearly grid** for the saving years (1.2) rather than the data's own monthly moves, so both phases share
   one convention. Confirm, or ask for a measured monthly variant of both phases together later.
9. **The bond stream continues across the stop date** (1.1), so a drawing-down phase after saving years is not
   literally `simulate` with a fresh seed; the identity with the engine is proved at no saving years and with an
   all-shares mix. Accept.
10. The **verdict thresholds, `SLIDE_YEARS`, `SAVING_CHARGE`, `VERDICT`, `CONFIDENCE`** are single constants;
    none is an input in the short form. Confirm which, if any, should be.
