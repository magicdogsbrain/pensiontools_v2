# V7 — the answer contracts for question A and question B

**A — "When can I afford to stop work?"**  **B — "Am I saving enough? And what should I pay in?"**

Spec only. Nothing here is built. Written 30 Sep 2026 against v6.17.0, with the question-C slice built and
published unlinked at `/v7/`. Where this document and `answer-C-and-household.md` (HH) or `step3-build-brief.md`
(the brief) differ on something question C already does, the brief wins for C and this document wins for A and B.

Sources: `research/v7-plan-of-plans.md` sections 3–4 and 7–9 (the owner's decisions of 30 Sep: savers first, a bad
case is the worst 1 in 10, couples get a short first set of questions, 7.0 includes B); the research catalogue
(S01 can I stop soon, S02 what's my number, S03 a range of ages, S04 the years before State Pension, S10 part-time,
S17 one more year, S22 coast, S12 forced out); HH sections 1–2; the brief sections 2–4; `rail-screens-language.md`
1.5 (the steps of A and B), 3.2 (the banned list) and 3.3 (the headline pattern); and the code read for this
document: `src/answers/c/{answer,schema,sentences,toHousehold}.js`, `src/answers/shared/{household,toEngine,
futures,band,fastEngine,rules,validate,format,contract}.js`, `src/services/{AccumulationEngine,RetireSweep,
BudgetModel,GlidepathService,SimulationEngine,TaxCalculator}.js`, `src/strategies/ladderEngine.js`,
`tests/v7/c/invariants.js`, `tests/v7/fixtures/c/*.json`, `e2e/*.spec.js`.

**Every figure in sections 1.12 and 2.12 came from a scratch script** (not in the repository) that reuses today's
engine unchanged for the drawing-down years — `simulate`, `bootstrapPaths`, `annualNominal`, `grossToNet`,
`netToGross`, `RISK_PRESETS`, `wholeStatePensionAge`, `accessAgeOn`, the same seeds as C — and a **placeholder**
for the saving years, because the saving engine does not exist yet. Section 0.6 says exactly what is placeholder.
The scratch was checked against `answerC` on a stop-now row: identical to the pound (section 1.12, example 3).

The owner's decisions that shape everything below: savers first; the saving years are **simulated on the same
futures as the drawing years** (the three fixed FCA lines are gone); a saving risk level; "what's my number" gives
the pot, the pay-in that gets there, and the options side by side when it does not fit; question A shows a named
age's verdict, a range of ages, what one more year buys, which pot pays the years before the State Pension, and
part-time work as a lever; stopping before 57 paid from ISA and savings must work; a couple gets short first
questions with full detail on demand; a final-salary pension by its start age; a bad case is the worst 1 in 10;
the headline is the careful figure (9 in 10); every number from a pure function with a declared input list; the
existing engine is reused for the drawing years through the same adapter and fast path as C.

Contents

0. What A and B share — the journey model
1. Question A — "When can I afford to stop work?"
2. Question B — "Am I saving enough? And what should I pay in?"
3. Changes to the shared modules (household, adapter, futures, band, rules)
4. Decisions for the owner, and open questions

---

## 0. What A and B share — the journey model

### 0.1 One future is one path, saving years then drawing years

Question C tests a pot as it stands. A and B test a **journey**: some years of saving, then the drawing-down years,
on **one** possible future. Future `i` is one bootstrapped path from the bundled market history since 1871, long
enough for both parts:

```
path(i)      = bootstrapPaths(marketSeed(i, seed), (S + D) × 12)      // S saving years, D drawing years
saving(i)    = annualNominal(path.rtr, path.cpi, 0,      S)           // years 0 … S−1
drawing(i)   = annualNominal(path.rtr, path.cpi, S × 12, D)           // years S … S+D−1
```

`marketSeed` is `futures.js`'s formula unchanged, so future `i` is the **same market** in A, B, C and the strategy
comparison. When `S = 0` (the person has already stopped, or stops this year) `drawing(i)` is exactly C's future
`i`, which is what makes rule M-A1 below hold to the pound. Prices are one series along the whole path: the pot at
the stop age is stated at today's prices by dividing by the price level the path reached at the stop date, and the
drawing years then inflate from there exactly as they do in C.

Consequences the sentences and tests must respect:

- **"Saving as you are now" is not one line.** It is a spread: a bad-case pot (the worst 1 in 10 at the stop age),
  a middling pot and a good-case pot (the best 1 in 10). The old `projectAccumulation` (2% / 5% / 8%) is not called
  by any V7 answer and is retired with the old page.
- **A bad case for the whole journey is not "a bad saving run then a bad drawing run".** Along one path the two
  parts are separate blocks of history, so a poor decade while saving is rarely followed by a poor decade after
  stopping. Section 2.3 shows what this does to "the pay-in that gets there" and asks the owner to choose.
- **Stopping a year later moves the drawing years along the same path by a year**, so a later stop age can, on a
  single future, draw on worse markets than an earlier one. The band read off 1,000 futures still rises with the
  stop age in every case measured (1.12), but the test for it is a tolerance test, not a strict one (1.10, M-A4).

### 0.2 The stages of the drawing years — a chain of today's engine

Today's engine runs one person from one start with pots that are open from day one. A journey needs more: a
pension that cannot be touched until 57 while savings pay; a partner whose pension opens two years after the
other's; part-time earnings for a few years. HH 1.6 listed "the engine would draw a pension at 53" as a gap and C
answered it by moving the start. **A and B never move the start** — the stop age is the stop age — and instead
run the drawing years as a **chain of stages**, each stage today's engine unchanged on a slice of the future:

1. Stages are cut at every age at which someone's pension opens (and, later, wherever another kind of event needs
   a cut). A person who has already reached the earliest pension age at the stop has one stage.
2. **ISA and savings money follows the open pensions.** It is tax-free to draw, so whose name it is in changes no
   figure. In a stage where at least one pension is open, the household's savings sit inside the open pension
   runs (in proportion to those pensions) and top up what the pension does not deliver, as they do in C. In a
   stage where **no** pension is open, one savings-only run pays the whole household need (HH 1.6's
   `savingsTargetFor`), and each closed pension is a run with a target of nought — invested, growing, untouched.
3. Each stage hands its closing pots (the engine's `finalEquity`, `finalBond`, `finalCash`, `finalIsa`) to the
   next as its opening pots. Targets, tax bands and pension amounts for a later stage are multiplied by the price
   level the future reached at the stage's start, so the household take-home stays level at today's prices across
   the whole chain.
4. The glidepath floors of a later stage are re-based to `base × price level × (1 − L/D)` for a stage starting at
   year `L` of `D`. With the engine's linear run-down this reproduces the floor of an unsplit run **exactly** (the
   algebra is in 3.2), so splitting a run into stages changes nothing about the mix it holds.
5. The month a stage's run cannot pay is the household's run-out month (`L × 12 + failMonth`); the chain stops
   there.

What the chain does **not** reproduce bit for bit: the engine's bond model draws its random numbers from a stream
seeded once per run, so a chain of two stages uses two streams (`seed`, then `seed + k × 1,000,003` for stage `k`)
where one run used one. The market — shares and prices — is identical; only the bond model's month-to-month noise
is re-drawn at a stage boundary. The tax-free-cash limit (`£268,275`) is also counted afresh in each stage. Both are
stated in `basis`, and a test measures the drift (3.2). Where the chain has one stage it **is** today's engine.

This is why "stopping before 57 funded from ISA and savings" works with no engine change: a person of 55 with a
pension and an ISA is two stages — two years of a savings-only run beside an untouched pension, then the pension
with whatever savings are left inside it. Measured effect (1.12, example 2): the same couple stopping at 55 with
both pensions closed gets a careful figure of **£2,720** a month through the chain, against **£1,610** when the
savings are asked for a fixed share for life, which is what a single run of today's adapter gives (its savings run
carries 9% of the household need for 40 years and runs out in year 5 while the pensions are full). The fixed-ratio
gap HH 1.6 accepted for C is closed for A and B by the chain, not by a change to the engine.

### 0.3 The saving-years engine — `saveYears`

New, in `src/answers/shared/saveYears.js`. Pure. One person, one future, `S` whole years, month by month:

- **Pots**: the pension pot and, separately, ISA saving. Each is held in the **saving mix** — a risk level
  (`cautious` / `balanced` / `adventurous`, the same `RISK_PRESETS` shares as the drawing mix) — and re-set to that
  mix at the start of every year (a default fund holds a fixed mix; nothing else is assumed about what is held).
- **Returns**: shares at the future's own yearly return, spread over the year as the engine spreads it; **bonds
  from the engine's own bond model** (`calculateBondReturn` with the future's random stream — exported from
  `SimulationEngine.js` or copied as `fastEngine.js` already copies it, with the identity test extended); cash at
  `max(0, last year's price rise − 1%)`, the engine's rule. No charges (as C).
- **Paying in**: a monthly amount in today's prices, rising with prices each year, added at the end of each
  month: own + employer + basic-rate relief where the scheme adds it (0.3 below). An optional ISA amount a month
  the same way.
- **Output** for the stop date: each pot at today's prices (`÷ the price level at the stop date`) and in the
  pounds of that date, split by sleeve; the total paid in; the price level. Nothing else — no tax is due on the
  way in beyond what relief assumes, and nothing is drawn.

The person's pot at the stop age in today's prices is what the chain's first stage opens with. With `S = 0` the
function returns the pots as given, so the chain is C's run.

**Pay-in as the person sees it.** The form asks for the amount on the payslip (own) and the employer's amount. A
choice under "more detail" says how relief works: `payslip` (net pay or salary sacrifice — the amount shown is
already the whole amount; the default) or `reliefAtSource` (the provider adds a quarter: £80 becomes £100). The
answer works with the whole amount going into the pot, `payIn.total`, and always shows the split it used. Higher-rate
relief claimed later, National Insurance saved by salary sacrifice, and the £2,000 sacrifice cap from April 2029
are **not** modelled; they are a note (1.7 / 2.7), because they change what the pay-in costs the person, not what
lands in the pot.

### 0.4 The one yardstick

"Lasts" means: at the household take-home target, going up each year with prices, nobody's run failed before the
end age (95 by default; a couple: until the younger is 95). The three counts C uses are the three counts here:

| Word | Share of futures the plan lasted in | In steps of `n` futures |
|---|---|---|
| careful / **yes** | at least 9 in 10 | fails in at most `floor(n/10)` |
| **marginal** | at least 3 in 4 but under 9 in 10 | fails in `floor(n/10) + 1` … `floor(n/4)` |
| **no** | under 3 in 4 | fails in more than `floor(n/4)` |

The **verdict** of question A at a named age is this rule applied to the count of futures that lasted at the
target. The **careful amount** at an age is the largest take-home (whole £10 a month) that lasted in 9 out of 10 —
C's band, read at that stop age. The two agree by construction: a "yes" means the careful amount is at least the
target less the £10 rounding (1.10, I-A5). The **pay-in that gets there** in B is the smallest monthly amount
(whole £10) at which the whole journey lasted in 9 out of 10 (section 2.3 has the alternative the owner may
prefer). "Accept a 1-in-4 (1-in-3) chance of falling short" is the same solve with `floor(n/4)` (`floor(n/3)`)
failures allowed.

### 0.5 Words

Everything a person reads passes `src/v7/copy/banned.js` in every state. In particular, for A and B:

- "stop work", never "retire" as a verb; "pay in" and "what you pay in", never "contribute" or "contribution";
  "while you are saving", never "accumulation"; "the years before your State Pension starts", never "bridge";
  "after tax" and "before tax", never "net" or "gross"; ages, never "year 3"; "a month", never "per month".
- "a bad case (the worst 1 in 10)" and "a good case (the best 1 in 10)", the bracket on first use on a screen;
  "lasted in 9 futures out of 10"; "fell short in 3 futures out of 10".
- The verdict words are **Yes**, **Marginal** and **Not at {age}**; the sentence under them carries the count.
- A retired person never sees either question: the rail hides A and B once a plan says work has stopped
  (Rail 1.5, rule R7), and the hidden-step sentence there stands. Inside A and B, ages are used, never "in N
  years": "stopping at 60", "by 60", "until you are 95".
- "Annual allowance" appears only with its meaning beside it: "the most you can pay into pensions with tax relief
  in a year, £60,000". The £10,000 limit after taking taxable pension money is said in those words; the initials
  never appear.

### 0.6 What the scratch could and could not do (read before trusting a figure)

| Part | In the scratch | In the build |
|---|---|---|
| Drawing years, one stage | Today's `simulate` through a copy of the adapter's config build — **the engine, exact** | The adapter (`toEngine.js`) with `keepStart`, through `fastEngine.js` |
| Drawing years, chained stages | Today's `simulate` per stage, pots carried, floors re-based, ISA following open pensions — **the engine, exact for each stage**; the stage seeding is the one described in 0.2 | `journey.js` (3.2), same rules |
| Futures | `bootstrapPaths` with `marketSeed(i)` on the long path, `annualNominal` at the offset — **as designed** | `futures.js` gains `journeyReturns` (3.3) |
| **Saving years** | **PLACEHOLDER**: shares at the future's yearly return; **bonds at "prices + 1%"** (not the engine's bond model); cash by the engine's rule; monthly pay-in rising with prices; yearly re-set to the mix; ISA at the engine's flat 3% | `saveYears` (0.3) with the engine's bond model |
| Tax on pay-in | None (the amount given is what lands in the pot) | Relief choice (0.3) |
| Futures per figure | 200 (stated on every table); a few rows re-run at 1,000 to show stability | 100 then 1,000, as C |
| Solve for the pay-in | Bisection on the whole-journey count, £10 steps | Per-future thresholds with brackets, as `band.js` (2.11) |

So: every **drawing-years-only** figure in the examples (a stop-now row; a pot needed at a stop age) is today's
engine. Every figure that passes through the saving years (a pot at a future stop age; a pay-in; a chance of
falling short; the "one risk level up" lever) is a **placeholder** and will move when `saveYears` exists — by how
much depends mostly on the bond model. The shapes, orderings and sentences are what this document specifies; the
placeholder figures are there so the owner can see the answers read.

---

## 1. Question A — "When can I afford to stop work?"

### 1.1 The question, and who asks it

Asked by someone still working who wants a date (S01: "I want to stop at 60 — can I?"), or has no date and wants
to see ages side by side (S03), or is over the line and wonders what one more year buys (S17), or is stopping
before their State Pension and final-salary pension start and wants to know what pays until then (S04), or wants to
know whether part-time work for a few years would make the difference (S10), or has had the date chosen for them
(S12). One answer serves all six: a named age's verdict, a range of ages, what one more year buys, which pot pays
which years, and part-time as a lever. Everything is take-home at today's prices, going up each year with prices.

Steps on the rail (Rail 1.5): `numbers` → `answer` (the named age, or the range when no age was named) → `ages`
(the range) → `one-more-year` → `before-state-pension` → `part-time` → `keep`. The last four are views of one
result, not new calculations, except `part-time` when earnings are first typed there.

### 1.2 Inputs beyond the household — `src/answers/a/schema.js`

The household part of the list is `SCHEMA_C`'s `household`, `you.*`, `partner.*`, `savings`, `risk` and `endAge`,
by the same paths, the same limits and the same boundary values (the brief 4.1). `start.*` and `take` are **not**
in A. Added:

```js
// SCHEMA_A — added fields only; no words here. Labels, help and errors: src/v7/copy/a.js.
{ path: 'spend.kind', type: 'choice', options: ['amount', 'lifestyle'], default: 'amount', group: 'spend' },
{ path: 'spend.perMonth', type: 'money', min: 1, max: 50_000, required: true, when: { 'spend.kind': 'amount' }, group: 'spend',
  boundaries: [1, 1_000, 1_200, 1_867, 2_608, 3_592, 4_917, 10_000, 50_000] },          // PLSA tiers a month, single and couple
{ path: 'spend.level', type: 'choice', options: ['minimum', 'moderate', 'comfortable'], required: true,
  when: { 'spend.kind': 'lifestyle' }, group: 'spend' },                                  // PLSA_2024, single or couple by `household`

{ path: 'stop.kind', type: 'choice', options: ['age', 'range', 'now'], default: 'range', group: 'stop' },
{ path: 'stop.age', type: 'age', min: 18, max: 100, required: true, when: { 'stop.kind': 'age' }, group: 'stop',
  boundaries: [40, 54, 55, 56, 57, 60, 65, 66, 67, 68, 75] },

// Paying in while still working — per person; all optional; defaults are named under what was assumed.
{ path: 'you.payIn.own', type: 'money', min: 0, max: 20_000, default: 0, group: 'you', boundaries: [0, 1, 100, 500, 5_000, 20_000] },
{ path: 'you.payIn.employer', type: 'money', min: 0, max: 20_000, default: 0, group: 'you', boundaries: [0, 1, 250, 5_000, 20_000] },
{ path: 'you.payIn.relief', type: 'choice', options: ['payslip', 'reliefAtSource'], default: 'payslip', group: 'more' },
{ path: 'you.payIn.isa', type: 'money', min: 0, max: 20_000, default: 0, group: 'more', boundaries: [0, 1, 1_667, 20_000] },
{ path: 'you.savingRisk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: { rule: 'sameAsRisk' }, group: 'more' },
{ path: 'you.alreadyDrawing', type: 'yesNo', default: false, group: 'more' },            // taxable pension money already taken
// partner.payIn.own, .employer, .relief, .isa, partner.savingRisk, partner.alreadyDrawing — the same, when household = 'couple'
{ path: 'partner.stop.kind', type: 'choice', options: ['same', 'age', 'already'], default: 'same', when: { household: 'couple' }, group: 'partner' },
{ path: 'partner.stop.age', type: 'age', min: 18, max: 100, required: true, when: { household: 'couple', 'partner.stop.kind': 'age' }, group: 'partner' },

// Part-time work as a lever — optional; on the part-time step and the try-a-change row.
{ path: 'you.work.has', type: 'yesNo', default: false, group: 'work' },
{ path: 'you.work.perYear', type: 'money', min: 1, max: 200_000, required: true, when: { 'you.work.has': true }, group: 'work',
  boundaries: [1, 10_000, 12_570, 30_000, 50_270, 200_000] },                           // before tax, today's prices
{ path: 'you.work.untilAge', type: 'age', min: 18, max: 100, required: true, when: { 'you.work.has': true }, group: 'work',
  boundaries: [55, 57, 60, 62, 67] },
// partner.work.* the same, when household = 'couple'
```

Rules (checked by `validate.js`, error on the first field named): `stop-not-before-now` (`stop.age ≥ you.age`);
`stop-before-end` (`stop.age < endAge`); `work-after-stop` (`work.untilAge > the stop age` for that person);
`partner-stop-not-before-now`. There is **no** rule that the stop age must be at or after the earliest pension
age: stopping before it is a valid case the chain handles, with a warning.

Default rules: `sameAsRisk` — the saving risk level is the drawing risk level unless changed.

**Things a person must type**: a single person, three (`you.pot`, `you.age`, `spend.perMonth` or a lifestyle) —
with `stop.kind` left at `range` they get the range without naming an age; naming one is a fourth. A couple,
four (`partner.age` too). The limit of five holds. Paying in is optional: with nothing typed the pot is invested
and nothing is added, and "what we assumed" says so (`no-pay-in`) — it is the one assumption a saver should not
leave alone, and the sentence says why.

The checked inputs are the same paths as a nested object, fields that do not apply removed, defaults filled:

```js
{ household: 'single', you: { pot: 300000, age: 55, statePension: { kind: 'full' }, finalSalary: { has: false },
    payIn: { own: 400, employer: 400, relief: 'payslip', isa: 0 }, savingRisk: 'balanced', alreadyDrawing: false, work: { has: false } },
  spend: { kind: 'amount', perMonth: 2000 }, stop: { kind: 'age', age: 60 }, savings: 60000, risk: 'balanced', endAge: 95 }
```

### 1.3 Signatures

```js
// src/answers/a/answer.js
/** Pure. Same inputs and env → the same result on every device. Never throws for a bad value. */
export function answerA(inputs, env) → AnswerA
// env as C's (brief 4.3): { today, futures, seed?, trace?, onProgress?, futureReturns? }, plus
//   ages?: number[]      — restrict the range to these stop ages (the runner uses it to fill the range progressively)
//   partTimeYears?: number  — how many part-time rows to work out on the part-time step (default 0; the step asks for 5)

// src/answers/a/toHousehold.js
export function toHousehold(inputs, env) → { household, assumed }        // C's mapping plus saving, work and stop fields (3.1)

// src/answers/shared/journey.js  (3.2) — the pieces A and B are built from; pure
export function journeyPlan(household, stopAges, env) → JourneyPlan       // everything that does not depend on an amount or a future
export function stopAgeOf(plan, stopAge, i, H) → { ranOutMonth: number|null, potAtStop: { total, byPerson }, stages }
export function mostAt(plan, stopAge, i) → number                          // £ a month, whole £10: the most that lasts in future i
export function phasesAt(plan, stopAge, H) → Phase[]                       // what H a month is made of, period by period (today's prices)

// src/answers/shared/saveYears.js  (0.3)
export function saveYears(saving, futureSlice, years, seed) → { pension: Sleeves, isa: number, paidIn: number, priceLevel: number, todaysPrices: { pension, isa } }
```

`answerA` imports only `src/answers/shared/*`, the engine, the tax functions and its own sentences; the
boundary tests of the brief apply unchanged.

### 1.4 How it is computed

1. **Check and expand.** `checkInputs(SCHEMA_A, …)`; `toHousehold`; `validateHousehold`. Bad input →
   `status: 'invalid'` with problems, nothing else.
2. **The target.** `spend.kind: 'amount'` → `perMonth` as typed. `'lifestyle'` → `PLSA_2024[single|couple][level]
   / 12`, rounded to the pound, with `assumed: lifestyle-level`. This is the household take-home a month at
   today's prices, `H = target × 12` a year.
3. **The ages to test.** The named age when `stop.kind: 'age'`; the person's age today when `'now'`. The range:
   every whole age from the earliest possible — the person's age today (stopping now) — to their State Pension
   age, the named age included if it lies beyond; never more than 20 rows (a person of 40 gets 40, 42, 44 … 67 and
   the named age). `env.ages` narrows it. For a couple the stop age is `you`'s; the partner stops in the same
   year unless `partner.stop` says otherwise (`assumed: both-stop-together`, as C).
4. **The futures.** One long path per future, as 0.1, long enough for the latest stop age in the range plus
   the drawing years to `endAge` (at most 45 drawing years; over that, `long-plan` as C).
5. **For each stop age `a`** — `S = a − age today` saving years, then the chain:
   a. `saveYears` for each person who has a pot or pays in → pots at the stop age, today's prices, per future.
   b. `stopAgeOf(plan, a, i, H)` for every future `i` → ran out or not, and the month. Count the failures →
      `lasted`, the **verdict** (0.4), and the bad-case run-out age (sort the run-out ages upwards, `endAge`
      where it lasted, take position `floor(n/10)`; the younger person's age, as C).
   c. `mostAt(plan, a, i)` for every future → the band `monthly.careful / middling / good` by C's positions, each
      rounded down to £10; `lasted` for each of the three by the count at that amount.
   d. The spread of the household's pot at the stop age: `potAtStop.bad / middling / good` at positions
      `floor(n/10)`, `floor(n/2)`, `n − ceil(n/10)` of the sorted totals; and `byPerson` at the middling position.
   e. **Which pot pays which years**: `phasesAt(plan, a, H)` — C's periods (cut where an income starts) plus a
      cut where a pension opens and where part-time earnings stop; each period's `fromPension`, `fromSavings`,
      `fromWork`, `statePension`, `finalSalary`, `tax`, `takeHome`; `pensionOpen: false` marks a period in which a
      person's pension is still closed. For the target `H`, not for the careful amount — the person asked about
      **their** spending. When `H` is below what the State Pension and final-salary pension alone provide in a
      period, that period's take-home is the higher figure, as C.
6. **What one more year buys.** For each age `a` with `a + 1` in the range: `monthly.careful[a+1] −
   monthly.careful[a]`; `runOutAge[a] → runOutAge[a+1]`; `lasted[a] → lasted[a+1]`. Computed from the rows, never
   separately; where the difference is within £20 the sentence says "about the same".
7. **The earliest ages**: the first row whose verdict is `yes`, and the first whose verdict is at least
   `marginal`; `null` when none in the range.
8. **Part-time**, when `work.has`: the named age (or every row) is computed **with** the earnings, and once more
   without them, so the result carries both (`partTime.without`). On the part-time step, `env.partTimeYears = 5`
   asks for the same row with the earnings running 1, 2 … 5 years past the stop age (`partTime.byYears`), so
   "what each year of part-time work buys" is a table of five rows, each a full re-run at the target.
9. **No pots and no pay-in** → `status: 'guaranteed-only'` (or `'none'`): the verdict is by whether the State
   Pension and final-salary pension alone cover the target from the stop age, the range collapses to one line per
   age saying what starts when, and no search is run. A household whose target is at or below what those provide
   from the start gets `verdict: 'yes'` at every age with `warning: target-below-pensions`.
10. **Sentences** from the result object only (1.6).

The default way of taking the money, the tax rules, the quarter tax-free, the tax bands rising with prices, no
charges, the same-seed futures: all as C (brief 4.3, points 8 and 2). The only differences from C are the ones in
section 0: the start is never moved; the drawing years are a chain; the pot at the stop age comes from the saving
engine on the same future.

### 1.5 The result object

```js
// AnswerA — plain data; JSON.stringify-safe; nothing undefined; no per-future arrays outside `trace`.
{
  status: 'ok' | 'invalid' | 'guaranteed-only' | 'none',
  problems?: [ { field, messageId } ],

  inputs: { … },                                          // as used, defaults filled in
  target: { perMonth, perYear, kind: 'amount' | 'lifestyle', level: null | 'minimum' | 'moderate' | 'comfortable' },
  whose: 'you' | 'partner',                               // whose age run-out ages and endAge refer to (the younger)

  named: null | StopAge,                                  // the age asked about (stop.kind 'age' or 'now')
  range: [ StopAge ],                                     // in age order; the named age is in it; rows carry no phases
  earliest: { yes: number | null, marginal: number | null },

  pensionOpens: { you: number, partner?: number },        // the age each person can first touch a pension pot
  guaranteed: { monthlyAfterTax },                        // State Pension + final-salary once all have started (C's field)

  partTime: null | {                                      // only when work.has (for `named`, else the first range row)
    perYear, untilAge,
    without: { verdict, lasted, runOutAge, monthly: { careful } },      // the same row with no earnings
    byYears: [ { untilAge, years, verdict, lasted, runOutAge, monthly: { careful } } ]   // env.partTimeYears rows
  },

  assumed:  [ Assumed ],                                  // 1.7, fixed order
  warnings: [ Warning ],                                  // 1.8
  sentences: { head, sub, line, bad, after?, careful, pot, oneMore?, earliest?, range: [Sentence], pays: [Sentence],
               partTime?: [Sentence], nothing?, none? },
  basis: { today, futures, seed, failuresAllowed, historyEnd, engineVersion, savingEngineVersion,
           endAge, years: { saving, drawing }, stages: [ { fromYear, why: 'start' | 'pensionOpens' | 'workEnds', who } ],
           split: [ { who, share } ], strategyId: 'pots-and-valves', cutsSwitchedOff: true, chainSeeding: 'per-stage' },
  units: { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' },
  trace?: { … }                                           // env.trace: per future { id, potAtStop, most, ranOutMonth } and the bad-case future's rows
}

// StopAge — one stop age
{
  stopAge, stopYear: 'YYYY',                              // `you`'s age and the calendar year
  ages: { you: number, partner?: number },                // each person's age at the stop
  verdict: 'yes' | 'marginal' | 'no',
  lasted: number,                                         // share of futures that lasted at the target
  runOutAge: number,                                      // in a bad case (the worst 1 in 10); endAge when it lasted
  monthly: { careful, middling, good },                   // £ a month after tax, today's prices, whole £10
  yearly:  { careful, middling, good },
  lastedAt: { careful, middling, good },                  // share of futures each amount lasted in
  potAtStop: { bad, middling, good, byPerson: [ { who, pension, isa } ] },   // today's prices; whole £; the middling split by person
  paidIn: { total, byPerson: [ { who, amount } ] },       // today's prices, over the saving years
  gapYears: number,                                       // years from the stop until the first pension opens (0 = none)
  phases?: [ Phase ],                                     // named age only; at the TARGET
  oneMoreYear: null | { toAge, perMonth, lasted: { from, to }, runOutAge: { from, to }, sameish: boolean }
}

// Phase — C's Phase (contract.js) with three fields added
{ …C's fields…, fromWork, pensionOpen: boolean, shown: { takeHome, fromPots, statePension, finalSalary, fromWork } }
```

Rounding: the three amounts are whole £10 rounded down (C); `potAtStop` whole pounds, shown by the sentences to
the nearest £1,000 with "about"; `lasted` to three places; ages whole years. The `sameish` flag on `oneMoreYear`
is `|perMonth| ≤ 20`.

### 1.6 The sentences — `src/answers/a/sentences.js`

Templates read only fields of `AnswerA`; `{…}` are keys; `[…]` only when it applies; `text === parts` joined,
as C. Counts use `outOfTen`.

**The named age**

| Id | Template |
|---|---|
| `a.head.yes` | Yes — you could stop at {named.stopAge} |
| `a.head.marginal` | Marginal — stopping at {named.stopAge} is tight |
| `a.head.no` | Not at {named.stopAge} on these figures |
| `a.head.now.*` | the same three with "stop now" / "stopping now" for `stop.kind: 'now'` |
| `a.sub` | spending {target.perMonth} a month after tax, at today's prices, until you are {endAge} |
| `a.sub.couple` | spending {target.perMonth} a month after tax between you, at today's prices, until the younger of you is {endAge} |
| `a.line` | Stopping at {named.stopAge} and spending {target.perMonth} a month after tax, your money lasted until you are {endAge} {outOfTen(named.lasted)}. |
| `a.line.couple` | Stopping when you are {named.stopAge} and spending {target.perMonth} a month between you, your money lasted until the younger of you is {endAge} {outOfTen}. |
| `a.line.justUnder` | (verdict `marginal` while `outOfTen` would say "9 futures out of 10", i.e. lasted in 85% to under 90%) … your money lasted until you are {endAge} in just under 9 futures out of 10. — so the count never contradicts the verdict; the same rule applies to `b.line` |
| `a.bad` | In a bad case (the worst 1 in 10) it would run out at age {named.runOutAge}. |
| `a.bad.lasts` | (verdict `yes`) In a bad case (the worst 1 in 10) it lasts to {endAge}, with {named.monthly.careful} a month the most that would. |
| `a.after` | (when `guaranteed.monthlyAfterTax` > 0 and the verdict is not `yes`) After that you would have {guaranteed.monthlyAfterTax} a month from your State Pension[ and your final-salary pension]. |
| `a.earliest` | (verdict not `yes`) The earliest age that lasted in 9 futures out of 10 is {earliest.yes}. / No age up to {spAge} lasted in 9 futures out of 10 on these figures. |
| `a.careful` | At {stopAge} the careful amount is {monthly.careful} a month: that is what lasted in 9 futures out of 10. {monthly.middling} a month is an even chance. |
| `a.pot` | By {stopAge}, saving as you are now, your pot would be about {potAtStop.middling} at today's prices: about {potAtStop.bad} in a bad case (the worst 1 in 10) and {potAtStop.good} in a good case (the best 1 in 10). |
| `a.pot.noPayIn` | By {stopAge}, with nothing more paid in, your pot would be about {potAtStop.middling} … (the same three figures) |
| `a.pot.now` | (`stop.kind: 'now'`, S = 0) Your pot is {inputs.you.pot} today. |

**One more year** (`oneMoreYear` of the named row, or of each range row on that step)

| Id | Template |
|---|---|
| `a.oneMore` | One more year, stopping at {toAge}, buys about {perMonth} a month more, and moves a bad case from running out at {runOutAge.from} to {runOutAge.to}. |
| `a.oneMore.lasts` | One more year, stopping at {toAge}, buys about {perMonth} a month more, and in a bad case the money then lasts to {endAge}. |
| `a.oneMore.same` | One more year, stopping at {toAge}, changes little: about the same a month, and a bad case runs out at {runOutAge.to} instead of {runOutAge.from}. |

**Which pot pays which years** (`phases`, at the target; one line per period; C's lines plus these)

| Id | Template |
|---|---|
| `a.pays.gap` | Until {openAge}, you can't take money from your pension, so your savings pay all of it: {shown.takeHome} a month. |
| `a.pays.gap.couple` | Until {who} is {openAge}, {who}'s pension can't be touched; {other}'s pension and your savings pay: {shown.fromPots} a month. |
| `a.pays.work` | Until {toAge}: {shown.fromWork} from work before tax + {shown.fromPots} from your {pot / pots / savings}. |
| `a.pays.mixed` … `a.pays.tax` | C's `c.madeOf.*` lines, unchanged wording |
| `a.pays.short` | (when the run-out age in a bad case is before the first pension opens) In a bad case your savings run out at {runOutAge}, before you can touch your pension at {openAge}. |

**Part-time**

| Id | Template |
|---|---|
| `a.partTime` | Working part-time for {perYear} a year before tax until {untilAge}, the money lasted {outOfTen(lasted)} at {target.perMonth} a month, and a bad case runs out at {runOutAge} instead of {without.runOutAge}. |
| `a.partTime.lasts` | … and a bad case then lasts to {endAge}. |
| `a.partTime.row` | (one per `byYears`) Until {untilAge}: lasted {outOfTen}; a bad case runs out at {runOutAge}; careful amount {monthly.careful}. |

**The range** — a table, one row per age: age · careful amount a month · lasted (out of 10) at {target} · a bad
case runs out at · one more year buys. The row sentence for the phone: "At {stopAge}: {monthly.careful} a month is
careful; {target.perMonth} lasted {outOfTen}; a bad case runs out at {runOutAge}."

**No pots** — `a.nothing`: "There is no pot to draw on and nothing being paid in, so this is your State Pension[
and your final-salary pension] only: {guaranteed.monthlyAfterTax} a month after tax from {age}." `a.none` as C.

Wording rules: as C (brief 4.4) and 0.5. Couples: "you" and "your partner" by name of the field, "the two of
you", "the younger of you". No sentence starts with a figure. "Only" is added by `outOfTen` below 9.

### 1.7 What we assumed — every default, named

C's list (HH 2.5 as the brief amends it) applies, **except** `pot-as-is` and `start-later`, which never appear in
A or B: the pot is no longer taken as it stands. Added, in this order after `risk`:

| id | Sentence |
|---|---|
| `saved-on-futures` | Between now and {stopAge} your pot is invested {savingRisk words} and grows or falls with the same futures we test the years after, going up and down with them; nothing is fixed at 2%, 5% or 8%. |
| `pay-in-rises` | What you pay in, {payIn.total} a month in all, rises with prices each year. |
| `pay-in-split` | Of that, {own} is from your pay, {employer} from your employer[ and {relief} tax relief the provider adds]. |
| `no-pay-in` | Nothing more is paid into your pension between now and {stopAge}. Most people still working pay something in — add it under "What you pay in". |
| `saving-risk-same` | While you are saving your money is held the same way as after: {risk words}. |
| `both-stop-together` | You both stop work in the same year. |
| `lifestyle-level` | A {level} lifestyle for {a single person / a couple} is {target.perMonth} a month after tax (Retirement Living Standards, 2024). |
| `spend-level` | You spend the same amount every month, going up with prices, from {stopAge} until you are {endAge}. |
| `work-tax` | Earnings from work are taxed as income; National Insurance is not included. *(when work.has)* |
| `no-relief-claim` | Higher-rate tax relief you claim back, and National Insurance saved by salary sacrifice, are not counted. *(when payIn.total > 0)* |
| `pension-then-savings` | While a pension can't be touched, your ISA and savings pay; once it opens they top it up. *(when gapYears > 0)* |

### 1.8 Warnings

| id | When | Sentence | Severity |
|---|---|---|---|
| `pension-closed` | A pension holder is under the earliest pension age at the stop | You can't take money from a pension until you are {openAge}. Stopping at {stopAge} means {gapYears} years paid from your ISA and savings. | important |
| `savings-run-short` | The bad-case run-out age is before the first pension opens | In a bad case (the worst 1 in 10) your savings run out at {runOutAge}, before you can touch your pension at {openAge}. | important |
| `no-savings-for-gap` | Pension closed at the stop and no ISA or savings at all | You have nothing outside a pension to live on until {openAge}. Stopping at {stopAge} needs savings you can reach. | important |
| `access-age-rises` | The person is 54 to 56 and their stop age straddles 6 April 2028 | The earliest pension age rises from 55 to 57 on 6 April 2028. Someone born after 5 April 1973 waits until 57. | note |
| `annual-allowance` | `payIn.total × 12 > 60,000` | The most you can pay into pensions with tax relief in a year is £60,000 (less for the highest earners). This plan pays in more. | important |
| `pay-in-over-pay` | `salary` given and `payIn.own × 12 > salary` | Tax relief covers pay-ins up to your earnings for the year. | note |
| `mpaa` | `alreadyDrawing` and `payIn.total × 12 > 10,000`; or part-time earnings run in years the pension is drawn and any pay-in continues | Once you take taxable money from a pension pot, the most you can pay into pensions with tax relief falls to £10,000 a year. | important |
| `state-pension-assumed` | `state-pension-full` applied | This assumes the full State Pension from {spAge}. If yours is lower or later, every figure is lower. | note |
| `target-below-pensions` | The target is at or below the State Pension and final-salary take-home from the stop age | Your State Pension[ and final-salary pension] alone cover {target.perMonth} a month from {age}; the pot is not needed for that. | note |
| `not-in-range` | No age in the range gives `yes` | No age up to {spAge} lasted in 9 futures out of 10 at {target.perMonth} a month. The range shows how close each one comes. | important |
| `long-plan`, `higher-rate`, `one-name`, `tax-free-limit`, `small-pot` | as C (HH 2.7) | as C | as C |

C's `pension-locked`, `savings-cover-gap`, `pot-used-before-state-pension`, `start-later` do not appear in A.
`pot-used-before-state-pension` is replaced by the `a.pays.short` sentence and `savings-run-short`.

### 1.9 Try-a-change knobs

On the answer step, each knob dispatches a `draft/set` and the runner recomputes, as C. Every knob maps to a
field; nothing is computed on the screen.

| Knob (test id) | Field | Step | Note |
|---|---|---|---|
| Stop age −1 / +1 (`a.try.stop.down/up`) | `stop.age` | 1 year | Sets `stop.kind: 'age'`; the row is already in `range`, so the screen can show it before the runner returns |
| Spend −£100 / +£100 (`a.try.spend.down/up`) | `spend.perMonth` | £100 | Sets `spend.kind: 'amount'` from the lifestyle figure first |
| Pay in −£100 / +£100 (`a.try.payIn.down/up`) | `you.payIn.own` | £100 | Never below 0 |
| Risk while saving (`a.try.savingRisk.<level>`) | `you.savingRisk` | | |
| Risk after stopping (`a.try.risk.<level>`) | `risk` | | as C |
| Part-time (`a.try.work`) | `you.work.*` | | Opens the two boxes; the part-time step has the five-row table |
| Show a range (`a.try.range`) | `stop.kind: 'range'` | | Moves to the `ages` step |
| Lasts to (`a.try.endAge.<age>`) | `endAge` | 90 / 95 / 100 | as C |

"Before / Now" (the previous final headline greyed beside the new one) is C's `before` mechanism, keyed on the
verdict and the careful amount of the named age.

### 1.10 Invariants and metamorphic relations the tests assert

Invariants (`tests/v7/a/invariants.js`, `checkAnswerA`), on any valid household at 40 futures unless said:

- **I-A1** the shape: nothing undefined, a function, a Date, NaN or infinite; every number ≥ 0 except growth in a
  trace; `status` one of the four; `invalid` carries only problems.
- **I-A2** the band is in order in every row: careful ≤ middling ≤ good; `lastedAt.careful ≥ 0.9 ≥ …`;
  `runOutAge ≤ endAge`; each amount a whole £10 (status `ok`).
- **I-A3** the verdict follows the count: `yes` ⟺ `lasted ≥ 1 − floor(n/10)/n`; `marginal` ⟺ between; `no`
  otherwise. And `verdict: 'yes'` ⟹ `runOutAge === endAge`.
- **I-A4** rows are in age order with no repeats; the named age is in `range`; `earliest.yes` is the first `yes`
  row's age (or null); `earliest.marginal ≤ earliest.yes` when both exist.
- **I-A5** the verdict and the band agree: `yes` ⟹ `monthly.careful ≥ target.perMonth − 10`; `no` ⟹
  `monthly.middling < target.perMonth + 10` is **not** asserted (a `no` can sit above middling when the fail count
  is just over a quarter) — instead: `monthly.careful < target.perMonth` ⟹ verdict ≠ `yes`.
- **I-A6** `oneMoreYear` equals the difference of the two rows it was made from, to the pound, and `sameish`
  ⟺ `|perMonth| ≤ 20`.
- **I-A7** the phases (named age) cover the drawing years once, in order, from the stop age to `endAge`; each
  period's `fromPots + fromWork + statePension + finalSalary − tax = takeHome` to 3p; `byPerson` sums to the
  household; a `pensionOpen: false` period has `fromPension = 0` for that person; `shown` adds up exactly.
- **I-A8** `potAtStop.bad ≤ middling ≤ good`; with `S = 0` all three equal the pots typed (plus savings);
  `byPerson` sums to `potAtStop.middling` to the pound; `paidIn.total = payIn.total × 12 × S` to the pound.
- **I-A9** every sentence's numbers equal its fields (`text === partsText`), and no banned word appears in any
  state, including the retired rules for every string (no countdown, no "when you retire").
- **I-A10** `assumed` holds an entry for every defaulted field named in the table of 1.7, in the fixed order;
  `no-pay-in` and `pay-in-rises` never both appear.
- **I-A11** `partTime.byYears` is in `untilAge` order and `byYears[k].lasted` is non-decreasing in `k` (more
  years of earnings never lasts less, on the same futures with the same stop age — this one is exact: earnings
  only add).
- **I-A12** the same input gives the same output on a second call, and with the clock moved across 5/6 April for
  a household given by age (as C, I-14).

Metamorphic (`tests/v7/a/metamorphic.test.js`, 200 futures on the fixtures, 40 on random pairs):

- **M-A1 A at a stop-now row equals C.** For a household whose pension is open today, with `stop.kind: 'now'`,
  no pay-in and no work: `named.monthly` equals `answerC(...).monthly` **exactly**, `named.lasted` at the target
  equals C's `take.lasted` and `named.runOutAge` equals C's `take.runOutAge`, at the same `env`. (Measured in the
  scratch on example 3: identical.) This is the identity that ties A to the built and tested C.
- **M-A2 more never gives less**: raising any pot, any pay-in, any State Pension or final-salary amount, or adding
  part-time earnings never lowers any row's careful amount or `lasted`, and never lowers a verdict (`no` →
  `marginal` → `yes` is the only direction).
- **M-A3 a higher target never lasts more**: raising `spend.perMonth` never raises `lasted` or the verdict in any
  row; the band does not change at all (it does not depend on the target).
- **M-A4 later is not worse, within tolerance**: along the range, `monthly.careful` is non-decreasing to within one
  step (£10) and `lasted` at the target non-decreasing to within `1/n`; strict on the three fixtures at 1,000
  futures. A violation on a random case goes to `exceptions.md` with the future that caused it (0.1 explains why
  strictness cannot be promised).
- **M-A5 a partner with nothing changes nothing**: as C.
- **M-A6 swapping the two people changes nothing**: as C; the stop age is re-expressed for the other person.
- **M-A7 the saving risk level only matters while saving**: with `S = 0`, changing `savingRisk` changes nothing.
- **M-A8 the chain is the run**: for a household with one stage, `journey.js` gives the same run-out month as
  `simulate` on the adapter's config (exact). For a chain cut at year `L` on a household whose pension is open
  throughout (a forced cut, tests only), the run-out month agrees with the unsplit run in at least 95% of futures
  and the careful amount within £20 — the measure of the per-stage bond seeding (0.2).
- **M-A9 the range at 1,000 futures contains the 100-future range's verdicts within one step** — the first pass is
  never contradicted by more than one grade at one age.

Independent answers: the closed-form case (all-cash pot on a constant-inflation made-up future, `env.futureReturns`)
now includes saving years — the pot at the stop age is the annuity-due formula for level real pay-ins at a real
rate of −1% (cash), and the careful amount is the level-withdrawal formula on that pot; the search must land within
£10 a month and the pot within £1. Tax in each phase against the HMRC oracle. The month-by-month trace of the
bad-case future at the target (`trace.atTarget.rows`) sums, deflated, to the target ÷ 12 every month until it ends.

Fixtures reviewed once by the owner: A1 (S01/S17), A2 (S03/S04, a couple, before-57 gap), A3 (S12/S10, forced
out, part-time) — the three worked examples below with their rendered sentences.

### 1.11 Runtime budgets

Measured on the M4 laptop, Node 24, one thread, plain `simulate` (not the fast path), 200 futures, the scratch's
chain. Question C's built fast path solves a 37-year plan at 1,000 futures in **0.21 s** (measured today), so the
figures in the last column are what to expect once A runs through the same runner.

| Case | Ages | Scratch, `simulate`, 200 futures | Expected with the fast path, 1,000 futures |
|---|---|---|---|
| A1 single, £360k, 10 ages | 10 | 5.0 s | about 3 s (10 × C) |
| A2 couple, two stages at the early ages, 9 ages | 9 | 9.9 s | about 5 s |
| A3 single, stop now, 5 ages | 5 | 2.2 s (10.8 s at 1,000) | about 1.5 s |
| A3 part-time, one row with and without | 2 | 0.9 s | about 0.5 s |

The saving years cost about a fifth of a drawing run per future (twelve months a year, three sleeves, no tax); they
are not the budget. The band search at each age is.

**Order of work in the runner** (`effects/run.js`, question `a`): the named age at 100 futures → `answer/first`
(the verdict, the careful amount, the pot); the named age at 1,000 → `answer/final` for that row; then the range,
nearest ages first (`env.ages` one or two at a time), each at 1,000 with the previous row's band as the estimate
(`band.js`'s `estimate` hint carries across ages, since a year changes the amounts by a few percent); the part-time
five rows last and only on that step. `data-answer` on `#app` gains the value `"partial"` while the range is
filling, and each row carries `data-row-state="first" | "final"`.

**The budget to test against** (browser harness, processor slowed four times): the named age's first figure
within 3 s of pressing "Show me"; its final figure within 10 s; the full range (≤ 13 rows) within 30 s, the rows
appearing one at a time; no task on the main thread over 50 ms. A range of 20 rows may take up to 45 s.

### 1.12 Three worked examples

All: 30 Sep 2026; Balanced (50 / 40 / 10) while saving and after; steady withdrawals with the automatic cut
off; a quarter of each pension withdrawal tax-free; full State Pension of £12,548 a year from 67; to age 95; tax
bands rising with prices; **200 futures**; pay-ins rising with prices. Take-home at today's prices. **Saving-years
figures (pots at a future stop age, and everything downstream of them) are placeholders** (0.6). A stop-now row is
today's engine, exact.

**Example A1 — single, 55, £300,000 pension and £60,000 ISA, £800 a month going in (£400 own + £400 employer),
wants £2,000 a month after tax; asks "could I stop at 60?"** (S01, S17)

| Stop at | Careful / middling / good a month | £2,000 lasted | Verdict | Bad case runs out at | Pot at the stop, bad / middling / good | One more year buys |
|---|---|---|---|---|---|---|
| 56 | £1,550 / £1,870 / £2,230 | 3 in 10 | no | 73 | £348k / £382k / £416k | +£60; 73 → 78 |
| 57 | £1,610 / £1,980 / £2,360 | 5 in 10 | no | 78 | £351k / £402k / £459k | +£100; 78 → 81 |
| 58 | £1,710 / £2,090 / £2,510 | 6 in 10 | no | 81 | £359k / £433k / £493k | +£50; 81 → 84 |
| 59 | £1,760 / £2,190 / £2,720 | 7 in 10 | no | 84 | £373k / £454k / £540k | +£80; 84 → 87 |
| **60** | **£1,840** / £2,350 / £2,930 | **8 in 10 (79.5%)** | **marginal** | **87** | £383k / £478k / £574k | +£70; 87 → 91 |
| 61 | £1,910 / £2,520 / £3,120 | 9 in 10 (87.0%) | marginal | 91 | £404k / £501k / £599k | +£140; 91 → 95 |
| 62 | £2,050 / £2,640 / £3,360 | 9 in 10 (92.5%) | **yes** | 95 | £409k / £524k / £641k | +£160 |
| 63 | £2,210 / £2,780 / £3,600 | more than 9 in 10 | yes | 95 | £426k / £554k / £678k | |
| 65 | £2,360 / £3,160 / £4,270 | more than 9 in 10 | yes | 95 | £464k / £614k / £786k | |
| 67 | £2,660 / £3,560 / £4,810 | more than 9 in 10 | yes | 95 | £479k / £676k / £907k | |

At 56 the pension is still closed for a year (this person reaches 57 in 2028, after 6 April), so the first year is
paid from the ISA; `pension-closed` shows on that row. Earliest `yes`: 62; earliest `marginal`: 60.

As it would render: "**Marginal — stopping at 60 is tight.** Spending £2,000 a month after tax, at today's prices,
until you are 95. Stopping at 60 and spending £2,000 a month after tax, your money lasted until you are 95 in
only 8 futures out of 10. In a bad case (the worst 1 in 10) it would run out at age 87. After that you would have
£1,046 a month from your State Pension. The earliest age that lasted in 9 futures out of 10 is 62." / "At 60 the
careful amount is £1,840 a month: that is what lasted in 9 futures out of 10. £2,350 a month is an even chance." /
"By 60, saving as you are now, your pot would be about £478,000 at today's prices: about £383,000 in a bad case
(the worst 1 in 10) and £574,000 in a good case (the best 1 in 10)." / "One more year, stopping at 61, buys about
£70 a month more, and moves a bad case from running out at 87 to 91."

Which pot pays which years, at £2,000 a month stopping at 60: 60 to 66, £2,000 a month all from the pension
(before tax £2,000 × 12 = £24,000 a year, three quarters taxable, tax £1,146 a year); from 67, £1,046 State
Pension + £954 from the pension. *(Placeholder: the split depends on the placeholder pot.)*

**Example A2 — a couple, 52 and 50; pensions £220,000 (52) and £90,000 (50); £80,000 ISA between them; £8,000 a
year final-salary pension from 65 (the 52-year-old); paying in £900 and £400 a month; want £2,800 a month between
them; ask "could we stop at 58?"** (S03, S04: the years before State Pension; a before-57 gap)

| Stop at (52-year-old's age) | Careful / middling / good | £2,800 lasted | Verdict | Bad case runs out at (younger's age) | Pot at the stop | One more year buys |
|---|---|---|---|---|---|---|
| 55 (partner 53) | £2,720 / £3,040 / £3,450 | 8 in 10 (83%) | marginal | 71 | £403k / £483k / £549k | +£130; 71 → 95 |
| 56 (54) | £2,850 / £3,250 / £3,760 | 9 in 10 (93.5%) | yes | 95 | £424k / £511k / £606k | +£110 |
| 57 (55) | £2,960 / £3,400 / £3,950 | more than 9 in 10 | yes | 95 | £439k / £545k / £653k | +£100 |
| **58 (56)** | **£3,060** / £3,570 / £4,230 | **every future** | **yes** | 95 | £468k / £570k / £687k | +£150 |
| 59 (57) | £3,210 / £3,760 / £4,490 | every future | yes | 95 | £476k / £604k / £731k | +£160 |
| 60 (58) | £3,370 / £3,970 / £4,790 | every future | yes | 95 | £500k / £645k / £780k | |
| 62 (60) | £3,680 / £4,450 / £5,620 | every future | yes | 95 | £557k / £727k / £921k | |
| 64 (62) | £4,020 / £4,980 / £6,350 | every future | yes | 95 | £582k / £801k / £1,071k | |
| 67 (65) | £4,670 / £5,910 / £7,490 | every future | yes | 95 | £668k / £910k / £1,284k | |

Stopping at 55: **both** pensions are closed (the 52-year-old reaches 57 in 2031; the partner in 2033); the ISA
pays everything for two years, then the first pension opens with what is left of the ISA inside it, and the
partner's pension opens two years later. Three stages. £2,800 a month over two years is £67,200 from an ISA of
about £86,000 by then (placeholder) — it holds, but a bad drawing run after that runs out at 71. The same row
through one run of today's adapter, the savings asked for a fixed 9% share for life, gives a careful amount of
£1,610 and a run-out in year 5 — the fixed-ratio gap the chain removes (0.2). Earliest `yes`: 56.

As it would render for 58: "**Yes — you could stop at 58.** Spending £2,800 a month after tax between you, at
today's prices, until the younger of you is 95. Stopping when you are 58 and spending £2,800 a month between you,
your money lasted until the younger of you is 95 in every future we tried. In a bad case (the worst 1 in 10) it
lasts to 95, with £3,060 a month the most that would." / Which pot pays which years at 58 / 56: "Until your partner
is 57, your partner's pension can't be touched; your pension and your savings pay: £2,800 a month." "From 65:
£667 final-salary pension + £2,133 from your pensions." "From when you are 67: £1,046 State Pension + …" "From
when your partner is 67: £2,091 State Pensions + £667 final-salary pension + £42 from your pensions." *(the last
two lines' pot figures are placeholders)*

**Example A3 — forced out at 59: £180,000 pension, £15,000 savings, £6,000 a year final-salary pension from 60;
needs £1,800 a month; asks "can I stop now?" and "would part-time help?"** (S12, S10, S17)

The stop-now row is `S = 0`: **today's engine exactly**, and it is identical to `answerC` on the same household
with `take: 1800` — careful £1,660 / middling £1,820 / good £1,970; £1,800 lasted in 58.0% (116 of 200); run-out
78 — the M-A1 identity, measured. At 1,000 futures: £1,660 / £1,800 / £1,980, lasted 52.8%, run-out 78.

| Stop at | Careful / middling / good | £1,800 lasted | Verdict | Bad case runs out at | Pot at the stop | One more year buys |
|---|---|---|---|---|---|---|
| **59 (now)** | **£1,660** / £1,820 / £1,970 | 6 in 10 (58%) | **no** | 78 | £195,000 (as typed) | +£50; 78 → 85 |
| 60 | £1,710 / £1,880 / £2,080 | 7 in 10 (73.5%) | no | 85 | £182k / £202k / £222k | +£50; 85 → 90 |
| 61 | £1,760 / £1,950 / £2,170 | 8 in 10 (83.5%) | marginal | 90 | £179k / £209k / £240k | +£40; 90 → 95 |
| 62 | £1,800 / £2,010 / £2,250 | 9 in 10 (90.0%) | yes | 95 | £180k / £220k / £253k | +£50 |
| 63 | £1,850 / £2,070 / £2,360 | more than 9 in 10 | yes | 95 | £181k / £224k / £274k | |

(The rows from 60 on assume nothing more is paid in — `no-pay-in` — and the pot moves with the markets; the "bad"
pot at 61 is below today's because a bad two years takes more than nothing-in gives back. Placeholder.)

Part-time, £12,000 a year before tax, stopping at 59:

| Earnings until | £1,800 lasted | Verdict | Bad case runs out at | Careful amount |
|---|---|---|---|---|
| — (no work) | 58% | no | 78 | £1,660 |
| 62 (3 years) | 78.5% | marginal | 88 | £1,740 |
| 64 (5 years) | 90.0% | yes | 95 | £1,800 |

As it would render: "**Not at 59 on these figures.** Stopping now and spending £1,800 a month after tax, your money
lasted until you are 95 in only 6 futures out of 10. In a bad case (the worst 1 in 10) it would run out at age 78.
After that you would have £1,447 a month from your State Pension and your final-salary pension. The earliest age
that lasted in 9 futures out of 10 is 62." / "Working part-time for £12,000 a year before tax until 64, the money
lasted in 9 futures out of 10 at £1,800 a month, and a bad case then lasts to 95." (Earnings while a pension is
drawn: warning `mpaa` shows if any pay-in continues; here none does. `work-tax` under what was assumed.)

Timing (scratch, `simulate`): 2.2 s for the five rows at 200 futures; 10.8 s at 1,000; the two part-time rows
0.9 s.

---

## 2. Question B — "Am I saving enough? And what should I pay in?"

### 2.1 The question, and who asks it

The largest group by headcount (S02): still working, paying into a workplace pension, a pot of £10,000 to
£250,000, often no spending figure. They want the number — the pot needed at the age they mean to stop — the
monthly amount that gets there, and the options side by side when it does not fit: stop later, pay in more,
spend less, take more investment risk while saving, or accept a stated chance of falling short. S22 is the same
question from the other end: "if I stop paying in today, does the pot still get there?" — a pay-in of nought, and
the smallest pay-in that still does.

Steps on the rail (Rail 1.5): `numbers` → `target` (the pot needed) → `answer` (on course or not) → `pay-in`
(what to pay in) → `choices` (the levers) → `keep`. `target`, `answer` and `pay-in` are views of one result;
`choices` adds the lever solves.

### 2.2 Inputs beyond the household — `src/answers/b/schema.js`

The household fields as A (1.2), including `you.payIn.*`, `you.savingRisk`, `you.alreadyDrawing`, `savings`,
`risk`, `endAge`, and A's `spend.*` renamed **`target.*`** (`target.kind`, `target.perMonth`, `target.level`,
same limits and boundaries). Added:

```js
{ path: 'stopAge', type: 'age', min: 18, max: 100, required: true, group: 'stop', boundaries: [40, 55, 57, 60, 65, 67, 68, 75] },
{ path: 'you.salary', type: 'money', min: 0, max: 1_000_000, default: null, group: 'more', boundaries: [0, 12_570, 50_270, 60_000, 100_000, 200_000] },
{ path: 'confidence', type: 'choice', options: ['9in10', '3in4', '2in3'], default: '9in10', group: 'try' },   // the yardstick for the pay-in
{ path: 'payInFrom', type: 'choice', options: ['now', 'age'], default: 'now', group: 'try' },                 // coast: stop paying in from an age
{ path: 'payInUntilAge', type: 'age', min: 18, max: 100, required: true, when: { payInFrom: 'age' }, group: 'try' }
```

Rules: `stop-not-before-now` (`stopAge > you.age`; equal is question C); `stop-before-end`; `pay-in-until-in-range`
(`you.age < payInUntilAge ≤ stopAge`). No rule against a stop age under the earliest pension age (2.4, point 8).

**Things a person must type**: `you.pot`, `you.age`, `stopAge`, `target.perMonth` (or a lifestyle), and
`you.payIn.own` — five. `you.payIn.employer` is optional with default 0 and the assumed line `no-employer`
("Your employer pays in nothing. Most do — check your payslip."). A couple types `partner.age` too: six, one over
the limit; the `partner.pot` and `partner.payIn.own` boxes are on the same row and start at 0, so the count of
boxes that must be filled stays at five plus the partner's age. The gate counts what must be filled, not what is
shown.

### 2.3 Signatures, and the two definitions of "gets there"

```js
// src/answers/b/answer.js
export function answerB(inputs, env) → AnswerB
// env as A's, plus  levers?: boolean  (default true; false skips section 2.4 step 7 for the first pass)

// src/answers/shared/journey.js additions (3.2)
export function potNeededAt(plan, stopAge, targetAYear, env) → { pot, carefulAt: number }     // drawing years only
export function payInThreshold(plan, stopAge, targetAYear, i) → number                       // smallest pay-in (whole £10 a month) that lasts in future i
```

**Two things could be called "the pay-in that gets there", and they differ by a lot.** Both were measured (0.6
placeholders, 200 futures):

| Definition | B1 (45, £120k, £2,608 at 60) | B2 (35, £40k, £2,000 at 65) | B3 (48, £350k, £2,500 at 60) |
|---|---|---|---|
| **Journey**: the smallest pay-in at which saving then drawing, on one future, lasted to 95 in 9 out of 10 | **£2,720** | **£560** | **£1,450** |
| **Two-stage**: the smallest pay-in at which the pot at the stop age reaches the pot needed in 9 out of 10 (the bad-case pot lands on the number) | £3,290 | £750 | £2,210 |

The two-stage figure is 20–50% higher because it asks for a bad decade while saving **and** a bad decade after —
along one path they rarely coincide (0.1). At the journey figure, the bad-case pot at the stop is below the pot
needed (B3: £592,000 against £707,000) and the plan still lasts in 9 out of 10, because most of the futures that
saved badly then drew well.

**Proposed: the journey definition is the headline**, for three reasons: it is the only one on which "lasted to
95 in 9 futures out of 10" is literally true; it is the same yardstick as A and C, so a saver who later asks A
sees the same verdict; and it is the smaller number, so it does not tell people to save more than the evidence
asks. The pot needed is still shown as **the number** — the pot at the stop age at which the target is the careful
amount for the drawing years alone (the same solve as C, on the pot) — because that is what people ask for and
what they compare with. The bad-case pot at the current pay-in is shown beside it as information, with the gap,
and the sentence beneath says plainly why a pay-in can be enough while a bad-case pot is short. The owner may
prefer the stricter two-stage figure as the headline, or as a second line ("to be sure of the number itself, about
£3,290"); section 4 asks.

### 2.4 How it is computed

1. **Check and expand**, as A. The target as A's step 2. `S = stopAge − you.age` (≥ 1; a partner's `S` from their
   own age and the same stop year).
2. **The futures**: one long path per future, `S + D` years.
3. **The pot needed** (`target` step): a search on the pot at the stop age, today's prices, for which the careful
   amount of the drawing years (C's band read at `stopAge`, on `drawing(i)` of every future) is at least the target
   — bisection on the pot to £1,000, each probe a band solve; the household's other money (ISA typed, the
   partner's pot) held as given, so the number is **this person's pension pot** needed. `potNeeded.pot`; and
   `potNeeded.carefulAt` = the careful amount at that pot (within £10 of the target). When the State Pension and
   final-salary pension alone cover the target from the stop age, the pot needed is £0 and status
   `guaranteed-only` (warning `target-below-pensions`).
4. **Saving as now** (`answer` step): `saveYears` at `payIn.total` for every future → `potAtStop.bad / middling /
   good`; the chain at the target → `lasted`, the shortfall count (`shortfall = 1 − lasted`), the bad-case run-out
   age, and the verdict by 0.4 (**on course** = `yes`; **close** = `marginal`; **not on course** = `no`).
5. **The pay-in that gets there** (`pay-in` step): for each future `i`, `payInThreshold` — the smallest pay-in in
   whole £10 a month at which that future's journey lasts (monotone in the pay-in: I-B4). Sort the `n`
   thresholds upwards; the pay-in at `9in10` is the entry at position `n − floor(n/10) − 1` … precisely: the
   smallest `P` with at most `floor(n/10)` thresholds above `P`. `3in4` and `2in3` read positions `floor(n/4)`
   and `floor(n/3)` from the top of the same list — free. So are the shortfall chances at `payIn.total + £100 /
   £250 / £500`: the count of thresholds above each. The search shares brackets exactly as `band.js` does (2.11).
   `payIn.needed = { total, own, employer, relief }` — the employer's amount held as typed, relief by the choice, the
   rest "from your pay". Where the threshold list's top is above the search ceiling (£5,000 a month), the entry
   is `null` and the sentence says no pay-in up to that amount got there.
6. **Coast**: when `payInFrom: 'age'`, `saveYears` pays in until `payInUntilAge` and nothing after; the same
   solve gives the smallest pay-in until that age. With `payInUntilAge = you.age` (nothing from now) step 4 is
   the answer to "if I stop paying in today"; `levers` gains `stopPayingNow`.
7. **The levers** (`choices` step), each a full re-solve of steps 3–5 with one thing changed, returning the same
   small shape; run after `answer/final`, one at a time, dispatched as `answer/lever`:

   | id | Change | Headline figure |
   |---|---|---|
   | `later2`, `later4` | `stopAge + 2`, `+ 4` | the pay-in that gets there; the shortfall chance at the current pay-in |
   | `plus100`, `plus250`, `plus500` | `payIn.total + £100 / £250 / £500` | the shortfall chance (free, from step 5) |
   | `spend10`, `spend20` | `target × 0.9`, `× 0.8` | the pay-in; the pot needed; the chance at the current pay-in |
   | `riskUp` | `savingRisk` one level up (none when `adventurous`) | the pay-in; the chance at the current pay-in; **may be "does not help"** |
   | `accept1in4`, `accept1in3` | `confidence` | the pay-in (free) |
   | `stopPayingNow` | `payInUntilAge = you.age` | the shortfall chance; the pot at the stop in a bad case |

   Every lever carries `helps: boolean` (its pay-in is lower, or its shortfall chance lower, than the base). The
   scratch found `riskUp` **not** helping at 9 in 10 in two of three cases (B1: £2,650 against £2,720 — barely;
   B3: £1,490 against £1,450 — worse), because a riskier saving mix widens the bad case as much as it lifts the
   middle; the sentence must be able to say so ("Holding more in shares while you save does not help the careful
   figure here: the pay-in would be £1,490. It does lift the middling pot, to £X."). Placeholder bonds; re-measure
   with `saveYears`.
8. **Stopping before the earliest pension age** (`stopAge < pensionOpens.you`): the pay-in solve still puts the
   money into the pension (it is what the question asked), and the chain's first stage is savings-only. If the
   household has no ISA or savings the journey fails in every future at the stop, so the solve cannot land; the
   answer then adds `isaForGap`: the ISA or savings at the stop age, today's prices, that makes the gap years last
   in 9 out of 10 with the pension untouched (a search on the savings-only stage alone), and the pay-in is solved
   with that ISA present. Sentence `b.gap`. `you.payIn.isa` lets the person say they are saving into an ISA too;
   `saveYears` grows it on the same futures.
9. **Sentences** from the result only (2.6).

### 2.5 The result object

```js
// AnswerB — plain data; JSON.stringify-safe.
{
  status: 'ok' | 'invalid' | 'guaranteed-only' | 'none' | 'out-of-reach',      // out-of-reach: no pay-in up to the ceiling gets there
  problems?: [ { field, messageId } ],
  inputs: { … },
  target: { perMonth, perYear, kind, level },
  stopAge, stopYear: 'YYYY', ages: { you, partner? }, years: { saving, drawing },
  whose: 'you' | 'partner',
  pensionOpens: { you, partner? },

  potNeeded: { pot, carefulAt, byPerson?: [ { who, pot } ] },        // today's prices; whole £1,000 shown, whole £ held
  now: {                                                            // saving as you are now
    payIn: { total, own, employer, relief, isa, untilAge },
    potAtStop: { bad, middling, good, byPerson: [ { who, pension, isa } ] },
    gap: { bad: number },                                           // potNeeded.pot − potAtStop.bad, never below 0
    lasted, shortfall, verdict: 'yes' | 'marginal' | 'no', runOutAge,
    paidIn: { total }
  },
  payIn: {                                                          // the pay-in that gets there, at `confidence`
    confidence: '9in10' | '3in4' | '2in3',
    needed: null | { total, own, employer, relief, isa },
    at: { '9in10': number | null, '3in4': number | null, '2in3': number | null },   // total a month, whole £10
    potAtStop: { bad, middling, good },                             // at the needed pay-in
    chanceAt: [ { total, shortfall } ],                             // now, +100, +250, +500
    twoStage?: number | null                                        // the stricter figure (2.3), when the owner wants it shown
  },
  isaForGap: null | { amount, years },                              // stop before the pension opens (2.4 point 8)
  levers: [ { id, helps, payIn: number | null, shortfallAtNow, potNeeded?, stopAge?, target?, level?, sentence: Sentence } ],
  guaranteed: { monthlyAfterTax },
  phases: [ Phase ],                                                // the drawing years at the target from the stop age, at the pot needed
  assumed, warnings, sentences: { target, targetLine, targetBad, head, line, bad, payin, payinLine, payinBad, split, coast?, gap?,
                                  levers: [Sentence], nothing?, none?, outOfReach? },
  basis: { …A's…, potSearchStep: 1000, payInSearchStep: 10, payInCeiling: 5000 },
  units,
  trace?
}
```

### 2.6 The sentences — `src/answers/b/sentences.js`

| Id | Template |
|---|---|
| `b.target` | About {potNeeded.pot} by age {stopAge} |
| `b.target.line` | To have {target.perMonth} a month after tax from {stopAge}, going up each year with prices, you would want a pension pot of about {potNeeded.pot} by then at today's prices[, with your State Pension from {spAge}][ and your final-salary pension from {fsAge}]. |
| `b.target.bad` | In a bad case (the worst 1 in 10), paying in as you do now gets you to about {now.potAtStop.bad} by {stopAge}: {now.gap.bad} short. In a middling case, about {now.potAtStop.middling}. |
| `b.target.bad.enough` | (gap = 0) In a bad case (the worst 1 in 10), paying in as you do now gets you to about {now.potAtStop.bad} by {stopAge}, past the number. |
| `b.head.yes` | On course: {now.payIn.total} a month is enough |
| `b.head.marginal` | Close: {now.payIn.total} a month is tight |
| `b.head.no` | Not on course at {now.payIn.total} a month |
| `b.line` | Paying in {now.payIn.total} a month in all[, {now.payIn.employer} of it from your employer,] from now until {stopAge}, going up with prices, your money lasted until you are {endAge} {outOfTen(now.lasted)} at {target.perMonth} a month. |
| `b.bad` | (verdict not yes) In a bad case (the worst 1 in 10) it would run out at age {now.runOutAge}. |
| `b.bad.lasts` | (yes) In a bad case (the worst 1 in 10) it lasts to {endAge}. |
| `b.payin` | About {payIn.needed.total} a month into your pension |
| `b.payin.line` | Paying in about {payIn.needed.total} a month in all — {payIn.needed.own} from your pay[, {payIn.needed.employer} from your employer][ and {payIn.needed.relief} tax relief] — from now until {stopAge}, going up with prices, your money lasted until you are {endAge} in 9 futures out of 10. You pay in {now.payIn.total} now. |
| `b.payin.less` | (needed < now) You could pay in as little as about {payIn.needed.total} a month and still last in 9 futures out of 10. |
| `b.payin.bad` | In a bad case (the worst 1 in 10) that pay-in reaches about {payIn.potAtStop.bad} by {stopAge}, under the number — and the plan still lasts, because a bad run while saving is rarely followed by a bad run after you stop. |
| `b.payin.why` | (small type, once) A pay-in that reached {potNeeded.pot} even in a bad case would be about {payIn.twoStage} a month. *(only when the owner chooses to show it)* |
| `b.chance` | Paying in {total} a month, the money fell short {outOfTen(shortfall)}. |
| `b.coast` | Stopping paying in now, the money fell short {outOfTen(shortfall)}: in a bad case your pot would be about {potAtStop.bad} by {stopAge}. The smallest pay-in that gets there is about {payIn.needed.total} a month. |
| `b.coast.enough` | You could stop paying in now: with nothing more added, the money lasted until you are {endAge} in 9 futures out of 10. |
| `b.gap` | You can't take money from your pension until you are {pensionOpens.you}. Stopping at {stopAge} means {isaForGap.years} years paid from savings: about {isaForGap.amount} in an ISA or savings by then, on top of the pension. |
| `b.outOfReach` | No pay-in up to {basis.payInCeiling} a month got to {target.perMonth} a month from {stopAge} in 9 futures out of 10. Stopping later or spending less would change that — the choices below show how much. |
| `b.nothing` | (`guaranteed-only`) Your State Pension[ and your final-salary pension] alone give {guaranteed.monthlyAfterTax} a month after tax from {age}, which covers {target.perMonth}. No pot is needed for that. |

**Levers** (one sentence each; `helps` decides the wording)

| id | Template |
|---|---|
| `later2` / `later4` | Stop at {stopAge} instead: about {payIn} a month gets there. Paying in as now, the money fell short {outOfTen}. |
| `plus100` … | Pay in {plus} a month more, {total} in all: the money fell short {outOfTen} instead of {outOfTen(now)}. |
| `spend10` / `spend20` | Spend {target} a month instead: the number becomes about {potNeeded}, and about {payIn} a month gets there. |
| `riskUp` | Hold more in shares while you save ({level words}): about {payIn} a month gets there. / …does not help the careful figure here: the pay-in would be {payIn}. It lifts the middling pot to about {potMiddling}. |
| `accept1in4` / `accept1in3` | Accept a 1 in 4 (1 in 3) chance of falling short: about {payIn} a month. |
| `stopPayingNow` | as `b.coast` |

A table on the `choices` step has the same rows: change · pay-in a month · fell short (out of 10) at what you pay
now · the number. The row sentence is the table's text on a phone.

### 2.7 What we assumed

A's list (1.7) less `both-stop-together`/`spend-level` wording changes, plus:

| id | Sentence |
|---|---|
| `no-employer` | Your employer pays in nothing. Most do — check your payslip and add it. |
| `relief-payslip` | The amount you gave is the whole amount going into your pension (taken from your pay before tax, or by salary sacrifice). If your provider adds tax relief on top, choose "relief at source". |
| `relief-at-source` | Your provider adds a quarter to what you pay in: {own} becomes {own × 1.25}. |
| `pay-in-until-stop` | You keep paying in until you stop at {stopAge}. |
| `number-is-careful` | The number is the pot at which {target.perMonth} a month lasted until you are {endAge} in 9 futures out of 10 — the careful figure, not an even chance. |
| `ceiling` | We searched pay-ins up to {payInCeiling} a month. |

### 2.8 Warnings

A's table (1.8) applies, with `pension-closed` reworded for B ("You can't take money from your pension until you
are {openAge}; stopping at {stopAge} needs savings you can reach for {gapYears} years — see below.") and these
added:

| id | When | Sentence | Severity |
|---|---|---|---|
| `annual-allowance` | `payIn.needed.total × 12 > 60,000` (the solved figure, as well as the current one) | To get there you would pay in more than £60,000 a year, the most that gets tax relief (less for the highest earners). Some of it would be taxed. | important |
| `pay-in-over-pay` | `salary` given and the solved own pay-in > salary | The pay-in that gets there is more than your pay. Stopping later or spending less are the ways left. | important |
| `mpaa` | `alreadyDrawing` and any pay-in over £10,000 a year | as A | important |
| `tax-free-limit` | `potNeeded.pot` or `potAtStop.good` over £1,073,100 | as C | note |
| `out-of-reach` | status | as `b.outOfReach` | important |
| `lifestyle-is-spend` | `target.kind: 'lifestyle'` | The Retirement Living Standards figures are what a household spends; if yours will be different, type an amount instead. | note |

### 2.9 Try-a-change knobs

| Knob | Field | Step |
|---|---|---|
| Stop age −1 / +1 (`b.try.stop.down/up`) | `stopAge` | 1 |
| Pay in −£50 / +£50 (`b.try.payIn.down/up`) | `you.payIn.own` | £50 |
| Spend −£100 / +£100 (`b.try.target.down/up`) | `target.perMonth` | £100 |
| Risk while saving (`b.try.savingRisk.<level>`) | `you.savingRisk` | |
| Risk after (`b.try.risk.<level>`) | `risk` | |
| Confidence (`b.try.confidence.<id>`) | `confidence` | |
| Stop paying in from (`b.try.payInUntil`) | `payInFrom`, `payInUntilAge` | |
| Lasts to (`b.try.endAge.<age>`) | `endAge` | |

Each lever row on the `choices` step also has a "Make this the plan" link that sets the fields it changed and
re-runs, so the lever becomes the answer and the levers are re-solved around it.

### 2.10 Invariants and metamorphic relations

Invariants (`tests/v7/b/invariants.js`, `checkAnswerB`):

- **I-B1** shape, as I-A1; `status` one of the five.
- **I-B2** `potAtStop.bad ≤ middling ≤ good` in `now`, in `payIn` and in every lever; `now.gap.bad =
  max(0, potNeeded.pot − now.potAtStop.bad)` to the pound.
- **I-B3** the verdict follows the count (as I-A3); `now.verdict: 'yes'` ⟺ `payIn.at['9in10'] ≤ now.payIn.total`
  (to one £10 step).
- **I-B4** the pay-in list is in order: `payIn.at['9in10'] ≥ at['3in4'] ≥ at['2in3']` (nulls only at the top);
  `chanceAt` is non-increasing in `total`; the entry for `now.payIn.total` equals `now.shortfall`.
- **I-B5** the pot needed is consistent with C: `answerC` with the pot needed as `you.pot` and `start.age =
  stopAge` gives `monthly.careful` within £10 of the target, and with `potNeeded.pot − 1,000` gives a careful
  amount below the target. (C's `pension-locked` start-moving rule means this holds only for a stop age at or
  after the earliest pension age; below it, the check runs through `journey.js` with one stage.)
- **I-B6** `payIn.needed` splits add up: `own + employer + relief = total`; `relief = own × 0.25` under
  `reliefAtSource`, else 0; `employer` equals what was typed.
- **I-B7** every lever's `id` is in the fixed list, once, in the fixed order; `helps` equals the comparison it
  claims; a `riskUp` lever is absent when `savingRisk` is `adventurous`.
- **I-B8** the phases at the pot needed add up (I-A7) and their first period's take-home equals the target (or the
  higher pensions-only figure).
- **I-B9** sentences equal their fields; no banned word; `b.payin.why` appears only when `payIn.twoStage` is set.
- **I-B10** determinism, as I-A12.

Metamorphic (`tests/v7/b/metamorphic.test.js`):

- **M-B1 more never needs more**: raising `you.pot`, the employer's pay-in, the State Pension or the final-salary
  amount never raises `payIn.at[*]`, `potNeeded.pot` or `now.shortfall`.
- **M-B2 a higher target needs more**: raising `target.perMonth` never lowers `potNeeded.pot` or `payIn.at[*]`.
- **M-B3 stopping later needs less**: `later2.payIn ≤ payIn.at['9in10']` and `later4.payIn ≤ later2.payIn` (to
  one step; strict on the fixtures at 1,000 futures; 0.1's caveat applies and a violation goes to `exceptions.md`).
- **M-B4 accepting more risk of shortfall needs less**: `accept1in3.payIn ≤ accept1in4.payIn ≤ payIn.at['9in10']`
  — exact, from one sorted list.
- **M-B5 spending less needs less**: `spend20.payIn ≤ spend10.payIn ≤ base`, and the same for the pot needed.
- **M-B6 paying in more falls short less**: `chanceAt` non-increasing — exact.
- **M-B7 `riskUp` has no sign promised**; the test asserts only that `helps` reports the truth.
- **M-B8 B agrees with A**: for the same household and stop age, `now.lasted` in B equals `range[stopAge].lasted`
  in A at the target, and `now.potAtStop` equals A's `potAtStop` — exactly (same futures, same chain).
- **M-B9 B at the needed pay-in is on course**: feeding `payIn.needed.own` back as `you.payIn.own` gives
  `now.verdict: 'yes'` and `now.shortfall ≤ floor(n/10)/n`; feeding back one step less gives more failures.
- **M-B10 coast**: `payInUntilAge = you.age` gives the same `now` as `payIn.total = 0`.
- **M-B11 the swap and the empty partner**, as C.

Independent answers: the closed-form saving case (all-cash, constant prices): the pot at the stop age equals the
level-real-pay-in formula to the pound; the pot needed equals C's closed form; the pay-in solve lands on the
formula's pay-in within £10. The HMRC oracle on the drawing years' phases. The trace check on the bad-case future.

Fixtures reviewed once by the owner: B1 (S02, a lifestyle target), B2 (young saver, adventurous), B3 (S22 coast).

### 2.11 Runtime budgets

Scratch (`simulate`, bisection, 200 futures): the pot needed 4–6 s (14 band solves), the pay-in 1–2 s, the ten
levers 3–5 s; 27 s for the pot and the pay-in alone at 1,000 futures for B2. Expected with the fast path and the
per-future threshold search: the pot needed is 14 band solves ≈ 14 × C's 0.21 s ≈ 3 s at 1,000 futures (a coarser
first pass — to £10,000 — halves it); the pay-in ≈ 4 chain runs per future ≈ 1 s; the free levers nothing; the
five re-solving levers ≈ 5 × 4 s. On a phone (four times slower) the first figures need the 100-future pass.

Order in the runner: the pot needed and "saving as now" at 100 futures → `answer/first`; at 1,000 →
`answer/final`; then the pay-in (the `pay-in` step shows "Working out…" if opened before it lands); then the
levers one at a time, the free ones first, `answer/lever` each. Budget (processor slowed four times): the number
and the on-course verdict within 3 s (first) and 12 s (final); the pay-in within 15 s; all levers within 45 s;
no main-thread task over 50 ms.

### 2.12 Three worked examples

Same footing as 1.12: 200 futures, Balanced unless said, pay-ins rising with prices, full State Pension from 67,
to 95. **Every figure that passes through the saving years is a placeholder** (0.6); the pot needed is today's
engine (the drawing years, exact; it moved by £5,000 between 200 and 1,000 futures in B2).

**Example B1 — 45, £120,000 in a workplace pension, pays in £550 a month in all (£300 own + £250 employer), wants a
moderate lifestyle (Retirement Living Standards single, £31,300 a year = £2,608 a month) from 60** (S02)

- **The number**: about **£756,000** by 60 (today's prices). At that pot, £2,608 a month lasted to 95 in 9 futures
  out of 10 with the State Pension from 67.
- **Saving as now** (£550): pot at 60 about £326,000 in a middling case; **£240,000 in a bad case, £516,000
  short**; £466,000 in a good case. The money fell short in **9 futures out of 10** (93%); in a bad case it runs out
  at 68. Verdict: **not on course**.
- **The pay-in that gets there**: about **£2,720 a month in all** (£2,470 from pay with the employer's £250). At
  that pay-in the pot at 60 is £648,000 / £835,000 / £1,118,000 (bad / middling / good) — the bad case is under the
  number and the plan lasts in 9 out of 10 all the same (2.3). The two-stage figure would be £3,290.
- **The choices**:

| Change | Pay-in that gets there | Fell short at £550 | The number |
|---|---|---|---|
| Stop at 62 | £2,050 | 8 in 10 (81%) | |
| Stop at 64 | £1,670 | 7 in 10 (67%) | |
| Pay in £100 more (£650) | — | 9 in 10 (90%) | |
| Pay in £250 more (£800) | — | 8 in 10 (84%) | |
| Pay in £500 more (£1,050) | — | 7 in 10 (73%) | |
| Spend 10% less (£2,347) | £2,170 | 8 in 10 (83%) | about £660,000 |
| Spend 20% less (£2,086) | £1,640 | 7 in 10 (70%) | about £570,000 |
| More in shares while saving (Adventurous) | £2,650 (helps, barely) | 8 in 10 (84%) | |
| Accept 1 in 4 | £2,010 | | |
| Accept 1 in 3 | £1,820 | | |

(The "number" column for spend-less is not from the scratch — it is what the lever re-solve returns; marked to be
filled by the first green run.) Warnings: `annual-allowance` does not fire (£32,640 a year); `pay-in-over-pay`
would if a salary under £30,000 were given; `lifestyle-is-spend`.

As it would render: "**About £756,000 by age 60.** To have £2,608 a month after tax from 60, going up each year with
prices, you would want a pension pot of about £756,000 by then at today's prices, with your State Pension from 67.
In a bad case (the worst 1 in 10), paying in as you do now gets you to about £240,000 by 60: £516,000 short. In a
middling case, about £326,000." / "**Not on course at £550 a month.** Paying in £550 a month in all, £250 of it
from your employer, from now until 60, going up with prices, your money lasted until you are 95 in only 1
future out of 10 at £2,608 a month. In a bad case (the worst 1 in 10) it would run out at age 68." / "**About
£2,720 a month into your pension.** Paying in about £2,720 a month in all — £2,470 from your pay and £250 from
your employer — from now until 60, going up with prices, your money lasted until you are 95 in 9 futures out of
10. You pay in £550 now."

**Example B2 — 35, £40,000, pays in £400 a month in all, wants £2,000 a month from 65, holds an adventurous mix
while saving** (a young saver)

- **The number**: about **£382,000** by 65 (1,000 futures: £387,000).
- **Saving as now** (£400): pot at 65 about £422,000 middling; **£233,000 in a bad case, £149,000 short**;
  £782,000 good. Fell short in **2 futures out of 10** (50 of 200, 25%; 22% at 1,000); a bad case runs out at 83.
  Verdict: **marginal** — 50 failures is exactly the `floor(n/4)` line, the last count that is still "at least 3 in
  4" (0.4). One future more and it would read "not on course"; the sentence carries the count either way.
- **The pay-in that gets there**: about **£560 a month** (£580 at 1,000 futures). The two-stage figure: £750.
- **Choices**: stop at 67 → £440 (fell short 1 in 10 at £400); stop at 69 → £340 (fewer than 1 in 10); +£100 →
  1 in 10 (14%); +£250 → fewer than 1 in 10 (8%); +£500 → 2%; spend 10% less (£1,800) → £420; 20% less (£1,600) →
  £300; accept 1 in 4 → £390 (**already paying more**: "You are past the 1-in-4 line now"); accept 1 in 3 → £320.
  No risk-up lever (already adventurous). Stop paying in now → fell short in 9 futures out of 10 (87%); bad-case pot
  £61,000.

**Example B3 — 48, £350,000 and £20,000 in an ISA, pays in £900 a month, wants £2,500 a month from 60; asks "can
I stop paying in?"** (S22 coast)

- **The number**: about **£707,000** by 60.
- **Saving as now** (£900): pot at 60 about £729,000 middling — past the number in a middling case — but **£512,000
  in a bad case, £195,000 short**; £980,000 good. Fell short in **2 futures out of 10** (38 of 200, 19%); a bad case
  runs out at 87. Verdict: **marginal** (38 failures, between `floor(n/10) + 1 = 21` and `floor(n/4) = 50`):
  "Close: £900 a month is tight".
- **The pay-in that gets there** at 9 in 10: about **£1,450 a month** — more than now. At 1 in 4: £610; at 1 in 3:
  £310. **Stop paying in now**: fell short in 4 futures out of 10 (42%); bad-case pot £382,000; run-out 77.
- **Choices**: stop at 62 → £760 (fell short 1 in 10 at £900); stop at 64 → £400 (fewer than 1 in 10); +£100 →
  16%; +£250 → 14%; +£500 → 10% (**on course at £1,400**); spend 10% less (£2,250) → £770; 20% less (£2,000) →
  £180; more in shares while saving → **£1,490 — does not help**.

As it would render for the coast question: "**Close: £900 a month is tight.** Paying in £900 a month in all from
now until 60, going up with prices, your money lasted until you are 95 in 8 futures out of 10 at £2,500 a month.
In a bad case (the worst 1 in 10) it would run out at age 87." / "Stopping paying in now, the money fell short in
4 futures out of 10: in a bad case your pot would be about £382,000 by 60. The smallest pay-in that gets there is
about £1,450 a month." / "Accept a 1 in 3 chance of falling short: about £310 a month."

The honest answer to S22 here is "not at 9 in 10; at 1 in 3, yes, £310 keeps you there", which is what the levers
table says without ranking the choices.

---

## 3. Changes to the shared modules

### 3.1 The household model — `src/answers/shared/household.js`

Additive; `inputVersion` stays 1 (nothing is saved yet; when saving arrives, `householdInput` carries these
fields and existing V7 drafts without them expand to the defaults).

```
Person {
  … as HH 1.2 …
  stopWork: { kind: 'already' } | { kind: 'age', age } | { kind: 'date', month, year }     // already there; A and B set it
  saving?: {                                              // absent = nothing paid in, held in the drawing mix
    payIn: { own, employer, relief: 'payslip' | 'reliefAtSource', isa }   // £ a month, today's prices
    untilAge: number | null                               // null = until stopWork
    risk: 'cautious' | 'balanced' | 'adventurous'
    salary?: number
    alreadyDrawing: boolean
  }
  otherIncome[]: { label, amountPerYear, fromAge, toAge, kind: 'work' | 'other' }          // already there; A's work → kind 'work'
}
Household.spending: { kind: 'amount', perMonthTakeHome } | { kind: 'lifestyle', level }     // already there; A and B fill it
```

`expandHousehold` gains the defaults `no-pay-in` (no `saving`), `saving-risk-same` (`saving.risk` =
`portfolio.level`), `no-employer`, `relief-payslip`, `pay-in-until-stop`. `validateHousehold` gains the ranges of
1.2 and 2.2. `HOUSEHOLD_LIMITS` grows accordingly and stays the only place a household range is written down.

`toHousehold` for A and B (one file each, `src/answers/a/toHousehold.js`, `b/`): C's mapping plus `spend`/`target`
→ `spending`; `stop.*` → `people[0].stopWork` (`'now'` → `already`; `'range'` → `{ kind: 'age', age: today's }`
with the range handled by `answerA` itself); `partner.stop` → `people[1].stopWork`; `payIn.*`, `savingRisk`,
`alreadyDrawing`, `salary` → `saving`; `work.*` → `otherIncome[{ kind: 'work', fromAge: stop age, toAge:
untilAge }]`.

### 3.2 The adapter and the chain — `toEngine.js` and a new `journey.js`

`enginePlan(household, env, options)` gains `options.keepStart: true`: the start is `householdStart` as given (the
stop), never moved; every pension holder under the earliest pension age at that date is in `lockedUntil`; and
`plan.stages` lists the cuts (`fromYear`, `why`, `who`). C keeps calling it without the option and is unchanged;
`tests/v7/c/*` do not move. `plan.people[].saving` is carried through for `saveYears`.

`src/answers/shared/journey.js` (pure):

- `journeyPlan(household, stopAges, env)` — for each stop age, the `enginePlan` with `keepStart` and the person
  ages at that stop; the long-path length; shared across the range.
- `stageConfigs(plan, stage, carried, H, priceLevel)` — the configs of one stage: for each open pension holder a
  pension run opening on `carried` sleeves with the household's carried ISA in proportion; for each closed holder a
  run with a target of nought; when nobody is open, one savings-only run. Targets are `configsAt`'s targets for the
  periods inside the stage, times `priceLevel`; floors re-based as 0.2 point 4; `spWeeklyAmount`, `dbAmount` and
  `extraIncomes[].annual` times `priceLevel`; `spStartYear`, `dbStartYear`, `extraIncomes[].startYear/endYear` less
  the stage's first year, floored at 0. `accessMethod` as C.
- `runJourney(plan, stopAge, i, H, runner)` — `saveYears` for each person, then the stages in order through
  `runner.run(r, i, config)` (the fast runner where the config is eligible: `fastEligible` needs no change for
  these configs, since they are the same shape; the savings-only run with no pension sleeves is already eligible),
  carrying `{ equity, bond, cash, isa }` between stages; returns `{ ranOutMonth, potAtStop, stages }`.
- `mostAt`, `phasesAt`, `potNeededAt`, `payInThreshold` as 1.3 and 2.3.

The glidepath identity (0.2, point 4), for the record: the engine's floor in year `y` of a `D`-year run is
`base × cumInf(y) × (1 − y/D)`. A stage starting at year `L` with `duration = D − L`, `base' = base × cumInf(L) ×
(1 − L/D)` and its own `cumInf'(y') = cumInf(L + y') / cumInf(L)` gives `base' × cumInf'(y') × (1 − y'/(D − L))
= base × cumInf(L + y') × ((D − L)/D) × ((D − L − y')/(D − L)) = base × cumInf(L + y') × (1 − (L + y')/D)`. The cash
target (`isGrowthFund: false`) has no run-down and needs only the price level. So the mix a chain holds is the mix an
unsplit run holds, year for year.

The bond-model seeding per stage (`seed + k × 1,000,003`) and the tax-free limit counted afresh per stage are the
two known differences from an unsplit run; `tests/v7/shared/journey.test.js` measures them (M-A8) and
`basis.chainSeeding` names the rule so a pinned answer can be explained. A later engine change that lets `simulate`
start its bond stream at a given month would remove the first difference; it is not needed for the slice.

`band.js`: `createBandSolver` takes a `runner` today; a `journeyRunner(plan, stopAge, futures)` whose `run(r, i,
config)` runs the whole chain for future `i` at the amount the config encodes lets the solver's bracket search
work unchanged for A's band at each age (the amount is carried in `config.targetSchedule`; the runner ignores `r`
and returns the household's `{ failed, failMonth }`). The same shape serves B's pay-in thresholds with the pay-in
in place of the amount: `createThresholdSolver(evaluate(i, k) → lasts, n, positions)` is the generalisation, and
`band.js`'s solver becomes one use of it. The estimate hint carries across ages (1.11).

### 3.3 Futures — `futures.js`

`journeyReturns(i, savingYears, drawingYears, env)` → `{ saving, drawing, path }` per 0.1, cached per `(i, S + D)`
across the ages of one answer (the long path is built once for the longest need and sliced). `futuresList` is
unchanged for C. `env.futureReturns` (tests) supplies the long path's yearly returns.

### 3.4 Rules — `rules.js`

Added: `annualAllowance: 60000`, `moneyPurchaseAllowance: 10000` (asserted equal to `ACCUMULATION_RULES` while
that file exists), `reliefAtSource: 0.25`, `payInCeilingAMonth: 5000`, `potSearchStep: 1000`, `plsa: PLSA_2024`
(asserted equal to `BudgetModel.js`'s table; the yearly update checklist gains the Retirement Living Standards
figures beside the State Pension).

### 3.5 What is retired, and what is not touched

`AccumulationEngine.projectAccumulation` and `FCA_RATES` are not called by any V7 answer; `RetireSweep.js` is not
called; both go with the old page at cutover. `contributionBreakdown` and `contributionWarnings` are read for their
rules (relief, the allowances) and those rules move to `rules.js` with tests asserting equality until the old file
is deleted. Nothing under `src/services/`, `src/strategies/`, `src/storage/`, `src/firebase/`, `src/ui/` or
`index.html` is edited by A or B — the brief's rule stands. The one engine export A and B need, the bond model's
`calculateBondReturn`, is either exported from `SimulationEngine.js` (a one-line change shipped as its own 6.x with
no behaviour change) or used through `fastEngine.js`'s existing copy; the identity test covers either.

---

## 4. Decisions for the owner, and open questions

**Decisions**

1. **"Gets there" for the pay-in.** Proposed: the whole-journey definition (2.3) as the headline, with the pot
   needed shown as the number and the bad-case pot beside it. Alternative: the stricter two-stage figure (20–50%
   higher) as the headline, or as a second line. Confirm.
2. **The verdict grades.** Yes at 9 in 10, marginal from 3 in 4, no below — the same counts as C's band. Confirm
   the 3-in-4 line (an alternative is 4 in 5).
3. **The range's rows.** Every year from now to State Pension age, at most 20 rows. For a person of 40 that means
   every second year plus the named age. Confirm, or cap the range at 15 years ahead.
4. **The chain's stage seeding** (0.2) is a known, measured difference from an unsplit run. Accept it for A and B,
   or fund the engine change that lets a run's bond stream start mid-way (its own 6.x release, pinned outputs
   unaffected because nothing calls it yet).
5. **Should C use the chain too?** C moves the start to the day a pension opens (HH 2.3 step 2). With the chain,
   C could instead keep the start and let savings pay the gap, which is what A does. Proposed: not in this step;
   C's rule stays and its tests stand; revisit with question D.
6. **Relief and the payslip** (0.3). The default is that the amount typed is the whole amount. Confirm, or ask the
   relief question in the short form.
7. **`riskUp` may not help** at 9 in 10 (2.4 point 7). Proposed: the lever stays and says so plainly. Confirm.
8. **The pay-in ceiling** of £5,000 a month and the pot search step of £1,000. Confirm.
9. **The saving-years engine's re-set to the mix each year** (0.3) and no charges. Confirm, or add a charges field
   now that it affects thirty years of saving as well as the drawing years (C's open question 6).
10. **Retirement Living Standards figures** as the lifestyle levels, shown as spending, single or couple by the
    household. Confirm; and the yearly update checklist gains them.

**Open questions for the build**

11. `saveYears` needs the engine's bond model: export it, or rely on `fastEngine.js`'s copy with the identity test?
12. The per-stage tax-free-cash limit (0.2): carry `lsaRemaining` into the next stage by adding it to the config
    (an additive engine option, its own 6.x), or accept the reset for the slice and state it?
13. A couple's stop ages: the short form asks one age and assumes both stop that year; `partner.stop` is under
    "more detail". Is a couple who stop in different years common enough (S03 says "often a couple negotiating
    dates") to ask on the first screen?
14. Part-time earnings and National Insurance: `work-tax` states NI is not included. Add the 8% employee rate
    under the upper limit as a rule in `rules.js` for `kind: 'work'` income? It changes the take-home of every
    part-time row by a few percent.
15. The `mpaa` warning fires when part-time earnings run alongside pension withdrawals and any pay-in continues;
    the form does not ask whether the person keeps paying in while part-time. Add `work.stillPayingIn`?
16. Where B's `stopAge` is below the earliest pension age and there is no ISA, `isaForGap` is a second solve. Is
    the sentence enough, or should B offer "pay into an ISA instead for those years" as a lever?
17. Month and year of birth (the brief's decision 11) matters more for A and B than for C: a stop age of 55 or
    56 for someone born in 1971–73 is exactly the access-age window. Bring it forward to this step?
