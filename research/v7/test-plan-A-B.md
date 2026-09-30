# V7 steps 4 and 5 — the test plan for the saving engine and questions A and B

**A — "When can I afford to stop work?"** and **B — "Am I saving enough, and what should I pay in?"**, on one
new saving engine, reusing everything question C built. Draft for the owner, 30 Sep 2026, written against
v6.17.0 with the C slice shipped unlinked at `/v7/`. Nothing in this plan is built.

It is written so the tests can be written **before** the code. It reuses the C harness file for file
(`tests/v7/c/*`, `tests/v7/gen/*`, `tests/v7/oracles/*`, `tests/v7/render/checkScreen.js`, `tests/v7/states/`,
`e2e/helpers/*`, the three workflows) and adds what the saving years and the two questions need. Where this
plan and `test-plan-slice-C.md` say the same thing, C's text is not repeated: the section is named.

Contents: 0 what stands and what is new · 1 the engine and the two answers in one page · 2 the input lists ·
3 the saving engine's tests · 4 question A's tests · 5 question B's tests · 6 between two answers, and between
questions · 7 independent checks · 8 generated cases · 9 the four people (fixtures) · 10 screens, words, rail ·
11 the browser · 12 the same answer everywhere · 13 time · 14 what runs when · 15 planted faults · 16 the gate ·
17 files · 18 order of writing · 19 questions for the owner.

## Read this first: what was found while writing the plan

1. **The futures are prefix-consistent, so one market can serve every stop age.** `bootstrapPaths(seed, months)`
   draws 60-month blocks in order from one seeded stream, so a 20-year future is the first 20 years of the
   35-year future of the same seed and index. That is what lets a range of stop ages be compared "on the same
   market": future `i` is the market from today; the stop age only says where drawing starts on it. Section
   3.2 turns it into a test so it can never silently stop being true.
2. **Question C moves the start when a pension is closed; question A must not.** `startWhenPensionsOpen`
   (`src/answers/shared/household.js`) moves a household's start to the first pension opening when less than
   half of its pension money is open, and "savings alone do not hold the start". C asks what the money pays,
   so a moved start is an answer. A asks about a date the person chose: stopping at 55 from ISA money with a
   pension closed until 57 (the owner's requirement) means the start stays at 55, the pension is closed, and
   the savings pay. This is one rule with two settings, decided by the question (1.4), and it is why "C equals
   A at stop now" is asserted only when C's start did not move (6.3).
3. **The fast engine cannot yet run an income that ends.** `fastEligible` in `src/answers/shared/fastEngine.js`
   accepts `extraIncomes` only with no `endYear`. Part-time work for N years is exactly an income that ends.
   Either the replica is extended (and the identity test `speed.identity.test.js` covers the new shape) or
   the part-time runs go through the reference path. The plan assumes the first; 3.6 has the test either way.
4. **Today's saving projection and today's drawing engine grow money differently.** `projectAccumulation`
   (`src/services/AccumulationEngine.js`) uses a monthly rate of `r/12` with the pay-in added at the end of the
   month; `SimulationEngine` uses the twelfth root, `(1+r)^(1/12)`. At 5% a year the two differ by 0.12% a
   year, about 1.7% of a pot over 15 years. The saving engine must use one convention and the drawing engine's
   is the right one (one path, one arithmetic). So "the FCA 2 / 5 / 8% projection reproduced when each future
   is a flat path" is exact against the formula in the engine's own convention (3.4, SV3) and **within 2%**
   against today's Accumulation tab (SV4), with the difference explained. Section 19 asks the owner whether
   the old tab should be brought into line.
5. **Timing is the risk, not correctness.** Measured on 30 Sep 2026 (Node on the owner's Mac, one run each):
   `answerC` takes 28 ms at 40 futures, 23 ms at 100, 195 ms at 1,000 for one person; 299 ms at 1,000 for a
   couple. A range of seven stop ages is seven band searches; B's pot-needed is a search over searches. The
   budgets in section 13 are built from these figures and the plan says what to cut, in what order, if they
   are missed.

## 0. What stands and what is new

### 0.1 Reused as it is

| From the C slice | Reused for |
|---|---|
| `tests/v7/c/_c.js` (the adapter pattern) | `tests/v7/a/_a.js`, `tests/v7/b/_b.js`, `tests/v7/saving/_saving.js`: the only files that know real names |
| `tests/v7/c/invariants.js` `checkAnswer` (I1–I15) | Called unchanged on every band block inside an A or B answer (each row of A's range, each of B's drawing-down results is a C-shaped block, 4.1) |
| `tests/v7/gen/pairs.mjs`, `build-cases.mjs`, `arbitrary.mjs` | New dimension tables for A and B; the same generator, the same `arbitraryInputs` over `SCHEMA_A` / `SCHEMA_B` |
| `tests/v7/oracles/ukTax.mjs`, `fromTrace.mjs`, `hmrc-income-tax-2026-27.json`, `tax.test.js` | The tax in every drawing-down month; extended with the saving months (7.1) and a relief table (7.2) |
| `tests/v7/c/closedForm.test.js` (the FLAT env: one made-up future, 0% on everything, all in cash, flat prices) | The same `env.futureReturns` and `env.mix` seams give the saving engine its closed forms |
| `tests/v7/c/speed.identity.test.js` (fast path = reference path, byte for byte) | Extended to per-future starting pots and to an income that ends (3.6) |
| `tests/v7/c/feedback.slow.test.js` (the careful amount fed back through today's saved-plan path) | The same for A's named-age row: the pot at the stop age in a bad case, saved as a plan, fails in at most 1 in 10 |
| `tests/v7/c/fixtures.test.js` (pinned answer, `approved` block, two time zones) | Four new fixtures, one per person of section 9 |
| `tests/v7/render/checkScreen.js` R1–R12, `wording/wording.test.js`, `src/v7/copy/banned.js` | Every A and B state; two scope rules added (10.3) |
| `tests/v7/rail/rail.test.js` L1–L8 | A's six steps and B's five (10.4) |
| `tests/v7/states/build-states.mjs` | Named states for A and B under `tests/v7/states/a/`, `states/b/` |
| `e2e/helpers/{app,serve,answerInNode}.js`, `crawl`, `keyboard`, `screens`, `sameness`, `production`, `old-app-unchanged` | New journeys and pictures; the crawl and sameness lists grow; nothing in the helpers changes shape |
| `tests/helpers/clock.js` (`at`, `frozen`, `diffPaths`), the corpus market files, `CORPUS_NOW` | Every dated test; the date sweep (14.2) |
| `.github/workflows/{test,nightly,screenshots}.yml`, `playwright.config.js` | Unchanged in shape; budgets in 14 |

### 0.2 What the shell must give the tests, beyond C

| Seam | Meaning |
|---|---|
| `answerA(inputs, env)`, `answerB(inputs, env)` in `src/answers/a/answer.js`, `src/answers/b/answer.js` | Pure. Same `env` as C plus `env.rows` (which stop ages, tests only) and `env.stage: 'named' \| 'all'` (the runner asks for the headline first, then the rest) |
| `SCHEMA_A`, `SCHEMA_B` beside them | The declared input lists (section 2). The person block is shared: `src/answers/shared/schemaParts.js` |
| The saving engine, `src/answers/shared/saving.js` | Pure functions (1.3). Reads futures from `futures.js`, nothing else from outside |
| `stopAt(household, stopAge, futures, env)` in `src/answers/shared/joined.js` | The one function that joins saving years to drawing-down years for one stop age (1.2). Both A and B call it; the tests call it directly |
| The adapter takes per-future starting pots | `enginePlan(household, env, { potsByFuture })` and `createBandSolver(plan, futures, { potsByFuture })`; the identity test covers it |
| `#app[data-answer]` gains `"partial"` | A's range and B's choices arrive after the headline; `data-ready="1"` only when everything on the screen is final |
| Test hooks | `__pt.answer(q, inputs, env)` already takes any question id; `__pt.saving(person, stopAge, env)` added for the sameness run |

### 0.3 Working shape of the two answers (to be replaced by each question's answer contract)

The names below are this plan's working names. As with C, if the contract chooses others, only the adapter
files change. Money is £ a month, after tax, today's prices, household, unless said otherwise.

```js
// A band block — exactly C's monthly/yearly/lasted/runOutAge/phases/guaranteed/basis for one stop age,
// so tests/v7/c/invariants.js checkAnswer runs on it unchanged.
BandBlock = { monthly: { careful, middling, good }, yearly, lasted, runOutAge, whose, guaranteed, phases, basis, units, take? }

answerA(inputs, env) → {
  status: 'ok' | 'invalid' | 'nothing',              // 'nothing': no pot, no savings, no pay-in, no pension income
  inputs,
  named: {                                           // the stop age asked about
    stopAge, verdict: 'yes' | 'close' | 'no',        // spend lasts in ≥ 9/10 · in 5/10 up to 9/10 · under 5/10
    spend: { perMonth, lasted, runOutAge, covered },  // the spend fed to the band block's `take`
    band: BandBlock,                                  // what the household could take from that age (C's definition)
    potAtStop: { careful, middling, good, byWho },    // £ today's prices, pension + savings, in a bad / middling / good case
    beforeStatePension: { years, phases: [ { fromAge, toAge, paidBy: 'savings' | 'pension' | 'both' | 'part-time', shown } ] },
    pensionClosedUntil: null | { who, age }
  },
  ages: [ { stopAge, verdict, spend, band, potAtStop } ],   // the range, one row per age, the named age among them
  earliestYes: null | number,                        // the first row with verdict 'yes'
  oneMoreYear: [ { fromAge, toAge, extraMonthly: { careful, middling, good }, lastedFrom, lastedTo, potExtra } ],
  partTime: null | { yearly, years, named: { verdict, spend, band } },   // the named age with earned income for N years
  assumed, warnings, sentences, basis, units,
  trace?: { saving: { atCareful: { futureId, rows: [SaveRow] } }, drawing: C's trace for the named age,
            futures: [ { id, potAtStop, runOutMonth } ] }
}

// SaveRow — one month for one person in the saving years, pounds of that month
{ who, m, age, potStart, paidIn: { own, relief, employer, capped }, growth, potEnd, savingsStart, savingsIn, savingsEnd, priceIndex }

answerB(inputs, env) → {
  status, inputs,
  target: { perMonth, source: 'entered' | 'level' },
  potNeeded: number,                                 // £, today's prices, at the stop age, to the £1,000 above (5.1)
  onCourse: { lasted, verdict: 'yes' | 'close' | 'no', potAtStop: { careful, middling, good } },   // share of futures in which the pot reaches potNeeded
  payInNeeded: { perMonth, atConfidence: 9 | 7 | 5 }, // own money from take-home a month, £10 steps, at the chosen confidence
  joined: { lasted, band: BandBlock },               // the whole path (save, then draw the target) — A's row for this stop age
  choices: [                                         // side by side, only when onCourse.verdict !== 'yes'
    { id: 'stop-later',   stopAge, payIn: current },
    { id: 'pay-in-more',  payIn: payInNeeded.perMonth },
    { id: 'spend-less',   perMonth },                // the target the current pay-in reaches at the confidence
    { id: 'more-risk',    savingRisk: 'adventurous', lasted, payInNeeded },
    { id: 'accept',       lasted }                   // "reaches it in N futures out of 10"
  ],
  assumed, warnings, sentences, basis, units, trace?
}
```

Working rules the tests assume, each of which the contracts must confirm or replace:

- **One market per future, from today.** Future `i` of seed `s` is the same path for every stop age, every
  question and every row (3.2). The saving years run on years `0..S−1` of it, the drawing-down years on
  `S..end`. C's futures, which start at the start, are the first years of the same path, so "stop now" is
  identical (6.3).
- **Pay-in stops at the stop age.** Never a month later, never a month earlier. Part-time work does not
  restart it (the person may in life; the answer says under what was assumed that it is not counted).
- **A bad case is the worst 1 in 10**, in every count: futures the spend lasts in, pots at the stop age,
  futures that reach the pot needed. `floor(N/10)`, the same helper as C (`bandIndexes`).
- **The headline is careful.** A's `named.band.monthly.careful`; B's `potNeeded` is the pot whose careful
  amount meets the target; B's `payInNeeded` defaults to 9 futures out of 10.
- **The verdict comes from the spend, not from the band.** `lasted` is the share of futures in which
  spending `spend` a month from the stop age lasts to the end age; the band is shown beside it.
- **Figures shown**: monthly amounts as C (whole £10, careful rounded down); pots to the nearest £1,000
  (`potNeeded` up, a pot in a bad case down); ages whole years; shares of futures as Rail 3.4's table.
- **Nothing is a countdown.** Ages and dates only. When the stop age equals today's age, every A or B string
  must pass the retired rules (10.3).

## 1. The engine and the two answers in one page

### 1.1 The saving years, per person, per future

For a person still working, each month from today to the stop age:

1. Pay-in from take-home `own` (£ a month, today's prices, rising with that future's prices each year); basic-rate
   relief added by the provider at source: `gross = own / 0.8`. Higher-rate relief is **not** added (it must
   be claimed; the answer says so when pay is over £50,270 — warning `claim-relief`). `employer` = `pay ×
   employer% / 12` when pay is given, else 0.
2. The year's cap: `own gross + employer ≤ £60,000` in pounds of the day (the allowance is a fixed figure, not
   rising with prices); `≤ £10,000` when the person has already taken money flexibly from a pension
   (`takenPension: true`); `own gross ≤ pay` when pay is given and above £3,600, else `≤ £3,600` when pay is
   given as 0. What the cap removes is counted (`paidIn.capped`) and warned about (`over-allowance`), never
   silently dropped.
3. The pension pot grows by the month's factor for the person's **saving mix** (`savingRisk`: the same three
   presets as drawing down, `RISK_PRESETS`), on the same equity return, bond return and cash return that
   month of that future as the drawing engine would use. Savings (ISA money) grow at the engine's fixed
   savings rate (`RULES.savingsGrowth`, 3% a year), as they do in C; `savingsIn` (£ a month into savings) is
   an optional field, default 0.
4. The pot at the stop age is deflated by that future's price index at the stop month to today's prices.

Money paid in goes in at the start of the month, before that month's growth, in the drawing engine's
convention (twelfth-root monthly factor). This is declared so the closed forms are exact (3.4).

### 1.2 The join

`stopAt(household, S, futures, env)`:

1. `savingYears(household, S, futures, env)` → for each future, each person's pension and savings at the stop
   age, in pounds of the day and at today's prices.
2. The household at the stop age: ages `+ (S − age)`, State Pension and final-salary start ages unchanged,
   `stopWork` fixed at `S` for the first person (the partner stops at the same time unless given their own
   stop age). **The start never moves.** A pension whose holder is under the earliest pension age on the stop
   date is closed until they reach it (`lockedUntil`, as C already models); their savings pay meanwhile.
3. `enginePlan(householdAtS, env, { potsByFuture })` and the band solver over the drawing-down years
   `S..end` of the same futures, with each future's own starting pots. Everything from here is C's arithmetic:
   the most per future, the three amounts, the run-out months at a given `take` (the spend).
4. Returned: a `BandBlock`, `spend` (when a spend is given), `potAtStop`.

A's range is `stopAt` once per row; A's part-time lever is `stopAt` once more with `otherIncome` `[ { kind:
'work', amountPerYear, fromAge: S, toAge: S + N − 1 } ]` on the first person, which the adapter maps to
`extraIncomes` with an `endYear`. B's `joined` is `stopAt` at the stop age with the target as the spend;
B's `potNeeded` is a search over **C's** answer function (5.1), and B's `payInNeeded` a search over
`savingYears` alone.

### 1.3 The pure functions the tests import

```js
// src/answers/shared/saving.js — pure, clock-free, no Math.random (boundaries.test.js already scans src/answers/)
savingPlan(household, stopAge, env)                 // everything that does not depend on a future: months, caps, gross pay-in by year (today's prices)
grossPayIn(person, year, rules)                     // { own, relief, employer, capped, total } for one year, £ of the day given a price index
savingYears(household, stopAge, futures, env)       // → { byFuture: [ { who: { pension, savings }, priceIndex } ], potAtStop: { careful, middling, good } }
savingRows(household, stopAge, future, env)         // the SaveRow[] for one future (trace)
payInFor(household, stopAge, futures, potNeeded, share, env)   // the least own pay-in (£10 steps) that reaches potNeeded in `share` of futures

// src/answers/shared/joined.js
stopAt(household, stopAge, futures, env, { spend, otherIncome })   // 1.2

// src/answers/b/solve.js
potNeededFor(householdAtS, target, env)             // the least pot (£1,000 steps) whose careful amount through answerC's path meets the target
```

### 1.4 One rule, two settings

| | Question C | Questions A and B |
|---|---|---|
| The start | Chosen (`start.kind`), **moved** to the first pension opening when less than half the pension money is open | The stop age, **never moved** |
| A closed pension | Closed until it opens; savings pay | The same |
| Nothing open and no savings at the start | Cannot happen (the start moved) | Verdict `no`, warning `nothing-open-until`, the range shows the first age that works |
| Pay-in | None | Until the stop age |
| Part-time work | Not asked | A's lever: earned income for N years from the stop age |

## 2. The input lists

### 2.1 The shared person block — `src/answers/shared/schemaParts.js`

Every A and B form uses the same person fields, from one function, so the two never drift (a test asserts the
field objects are deep-equal across the two lists for every shared path). `who` is `you` or `partner`; the
partner block has `when: { household: 'couple' }` on every field, as in C.

```js
saverFields(who) → [
  { path: `${who}.age`, type: 'age', min: 25, max: 70, required: true,          // never a default
    boundaries: [25, 30, 40, 45, 47, 50, 53, 54, 55, 56, 57, 58, 60, 65, 66, 67, 70] },
  { path: `${who}.pot`, type: 'money', min: 0, max: 3_000_000, required: true,  // the partner: default 0
    boundaries: [0, 1, 10_000, 90_000, 120_000, 250_000, 1_073_100, 3_000_000] },
  { path: `${who}.payIn`, type: 'money', min: 0, max: 5_000, default: 0, group: 'you',       // £ a month from take-home pay
    boundaries: [0, 1, 240, 300, 400, 1_000, 4_000, 5_000] },                    // 240 = the £3,600-gross floor as take-home
  { path: `${who}.pay`, type: 'money', min: 0, max: 1_000_000, default: null, group: 'more',  // yearly, before tax; null = not given
    boundaries: [0, 3_600, 12_570, 45_000, 50_270, 50_271, 100_000, 125_140, 260_000, 1_000_000] },
  { path: `${who}.employer`, type: 'percent', min: 0, max: 15, default: 0, group: 'more',
    when: { [`${who}.pay`]: 'given' }, boundaries: [0, 3, 5, 8, 10, 15] },
  { path: `${who}.takenPension`, type: 'yesNo', default: false, group: 'more' },   // money already taken flexibly → the £10,000 cap
  { path: `${who}.statePension.kind`, … }, { path: `${who}.statePension.yearly`, … },        // as SCHEMA_C
  { path: `${who}.finalSalary.has`, … }, { path: `${who}.finalSalary.yearly`, … }, { path: `${who}.finalSalary.fromAge`, … }   // as SCHEMA_C
]
```

`when: { 'you.pay': 'given' }` is a new form of `when` (the field applies when the other is not null); `validate.js`
gains it and `schema.test.js` checks that every `when` value is an option, a boolean or `'given'`. The type
`percent` is new: a whole number, boundaries include `min` and `max`, drawn with a `%` sign by `Field`.

### 2.2 `SCHEMA_A`

```js
export const SCHEMA_A = {
  id: 'a',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single' },
    ...saverFields('you'),
    { path: 'stopAge', type: 'age', min: 50, max: 70, required: true,
      boundaries: [50, 54, 55, 56, 57, 58, 60, 62, 65, 66, 67, 68, 70] },
    { path: 'spend.kind', type: 'choice', options: ['amount', 'level'], default: 'amount' },
    { path: 'spend.monthly', type: 'money', min: 500, max: 8_000, required: true, when: { 'spend.kind': 'amount' },
      boundaries: [500, 1_200, 1_867, 2_608, 3_592, 4_917, 8_000] },       // PLSA 2024 single and couple, ÷ 12, rounded
    { path: 'spend.level', type: 'choice', options: ['minimum', 'moderate', 'comfortable'], required: true, when: { 'spend.kind': 'level' } },
    ...saverFields('partner').map(withWhen({ household: 'couple' })),      // partner.pot default 0; partner.age required
    { path: 'partner.stopAge', type: 'age', min: 50, max: 70, default: { rule: 'stopTogether' }, when: { household: 'couple' } },
    { path: 'savings', type: 'money', min: 0, max: 3_000_000, default: 0, group: 'more', boundaries: [0, 1, 60_000, 150_000, 3_000_000] },
    { path: 'savingsIn', type: 'money', min: 0, max: 5_000, default: 0, group: 'more', boundaries: [0, 1, 500, 5_000] },
    { path: 'savingRisk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'risk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'endAge', type: 'age', min: 75, max: 105, default: 95, group: 'more', boundaries: [75, 95, 100, 105] },
    { path: 'partTime.has', type: 'yesNo', default: false, group: 'try' },
    { path: 'partTime.yearly', type: 'money', min: 1, max: 100_000, required: true, when: { 'partTime.has': true }, group: 'try',
      boundaries: [1, 12_570, 12_571, 20_000, 50_270, 100_000] },
    { path: 'partTime.years', type: 'count', min: 1, max: 10, required: true, when: { 'partTime.has': true }, group: 'try', boundaries: [1, 2, 3, 5, 10] }
  ],
  rules: [
    { id: 'stop-not-before-now',      fields: ['stopAge', 'you.age'] },            // stopAge >= you.age
    { id: 'partner-stop-not-before-now', fields: ['partner.stopAge', 'partner.age'] },
    { id: 'end-after-stop',           fields: ['endAge'] },                        // endAge > the younger person's age at the stop
    { id: 'employer-needs-pay',       fields: ['you.employer', 'you.pay'] }        // employer > 0 needs pay > 0 (and the partner's)
  ],
  defaultRules: { stopTogether(values) { return values['partner.age'] + Math.max(0, values['stopAge'] - values['you.age']); } }
};
```

A single person types **four** things (age, pot, stop age, spend); a couple **five** (the partner's age). The
count test's limit is five. The level names map to `PLSA_2024[household][level] / 12`, rounded to the pound,
and the answer lists the figure under what was assumed with `source: 'rule'`.

### 2.3 `SCHEMA_B`

The same person block, `stopAge` (same limits), `target.kind` / `target.monthly` / `target.level` (the same
limits and boundaries as A's `spend.*`), the partner block with `partner.stopAge`, `savings`, `savingsIn`,
`savingRisk`, `risk`, `endAge`, and one more:

```js
{ path: 'confidence', type: 'choice', options: ['9', '7', '5'], default: '9', group: 'more' }   // out of 10: what payInNeeded solves for
```

Required: the same four (five). No `partTime`. `spend` and `target` are different paths on purpose (the
words differ: "what you want to spend" against "what you are aiming for"), and 6.4 says how they meet.

### 2.4 The lists' own tests (`tests/v7/a/schema.test.js`, `tests/v7/b/schema.test.js`)

C's `schema.test.js` checks, run over each list, plus:

- Every shared path's field is deep-equal between `SCHEMA_A` and `SCHEMA_B` (`when` aside).
- The stop-age boundaries include 55, 56 and 57; the age boundaries include 53, 54, 55, 56 and 57 (the rise
  to 57 on 6 April 2028 is crossed by age today and by stop age separately: a 54-year-old stopping at 55
  reaches 55 on 30 Sep 2027 and is open; a 53-year-old stopping at 55 reaches it on 30 Sep 2028 and waits
  until 57 — both are named cases in 8.1).
- `parseDraft` on `'5%'`, `'5'`, `' 5 '` for a percent; `'2 days a week'` is `notANumber`.
- Defaults by rule: `partner.stopAge` for a partner 3 years younger and 3 years older; `spend.level` figures
  equal `PLSA_2024` ÷ 12 for single and couple.
- `you.pay` of `0` and `null` are different values (given as nothing, and not given), and `employer` applies
  only to the first.

## 3. The saving engine's tests

### 3.1 Rules on one result: `checkSaving(result, plan)` in `tests/v7/saving/invariants.js`

| # | Rule | Exact assertion |
|---|---|---|
| S1 | Nothing missing or negative | As I1, I2 over the whole result; `paidIn.*`, `potStart`, `potEnd`, `savingsEnd` all `>= 0` |
| S2 | The months add up | Each `SaveRow`: `potEnd === potStart + paidIn.own + paidIn.relief + paidIn.employer + growth` to 1p; `savingsEnd === savingsStart + savingsIn + savings growth` to 1p; `potStart` of a month equals `potEnd` of the one before; the first `potStart` is the pot typed |
| S3 | Relief is a quarter on top | Every month `paidIn.relief === paidIn.own / 4` to 1p, before the cap; with the cap, `own + relief` is scaled together (the provider adds relief to what is paid) |
| S4 | The caps hold, in pounds of the day | Per person per tax year (from 6 April; the first year part): `own + relief + employer ≤ 60,000` (`≤ 10,000` when `takenPension`); `own + relief ≤ max(3,600, pay)` when pay is given; `capped` is exactly what the rule took off, and `capped > 0` in any year ⇒ warning `over-allowance` names the person |
| S5 | Pay-in rises with prices and stops at the stop age | Month `m` of year `y`: `own === payIn × priceIndex[y]` to 1p (before the cap); no row after the stop month has any `paidIn`; the last row's `age` is the stop age − 1 (the month before the birthday, birthday taken as today) |
| S6 | The pot at the stop age is what the last row says | `byFuture[i].who.pension === last row potEnd / priceIndex` to 1p; `potAtStop.careful ≤ middling ≤ good`; `careful` is the entry at `floor(N/10)` of the sorted pots (bandIndexes); pots shown are whole £1,000 |
| S7 | No pay-in, no growth, no change | With `payIn = 0`, `employer = 0`, `savingsIn = 0` in the FLAT env, `potEnd === pot` in every row |
| S8 | Same futures for every input | `byFuture.length === env.futures`; the price index of future `i` at year `y` equals `priceIndexByYear(futureReturns(i))[y]` (the drawing engine's own reading of the future) |
| S9 | The ordering is by content | Two people given in either order give the same household pots; only `who` labels move |
| S10 | Can be saved | JSON round trip; a result without a trace under 100,000 characters |

### 3.2 The futures are one market (`tests/v7/saving/futures.test.js`)

- **Prefix**: for `Y1 < Y2 ≤ 45` and futures `i` in a fixed sample of 20, `futureReturns(i, Y1)` deep-equals the
  first `Y1` years of `futureReturns(i, Y2)`. This is what "on the same market" means for a range of stop
  ages and for "C equals A at stop now". If the block bootstrap ever changes in a way that breaks it, this
  test says so before any answer does.
- **Independence from amounts**: the futures list for `(seed, N, years)` is byte-identical whatever the pots,
  pay-in or stop age (the same as C's rule; asserted again on `savingYears` — a planted "futures depend on
  the pay-in" fault must go red here).
- **The bond model's draws in the saving years** are deterministic and come from `seededRng` on a seed derived
  from `engineSeed(i)` only. Two runs are byte-identical; `frozen(FAR_WALL_CLOCK)` changes nothing (M15).
  Whether the drawing engine's draws continue that stream or restart at the stop is the contract's choice
  (19.3); the test asserts only that the choice is deterministic and written under `basis.bondDraws`.

### 3.3 Growth is the drawing engine's growth (`tests/v7/saving/growth.test.js`)

For 20 sampled futures and a person with `payIn = 0`: run the saving years with the pot in each preset, and
run today's `simulate` on a config with the same pot, the same mix and a target of 0 (draw nothing) over the
same years. Assert the pot at the end agrees to 1p (the same monthly factors in the same order). If the
saving engine keeps its own copy of the growth arithmetic (as `fastEngine.js` does), this is the test that
keeps the copy honest. It is also run with `savingRisk` ≠ `risk` to prove the two mixes are independent.

### 3.4 Closed forms (`tests/v7/saving/closedForm.test.js`)

The FLAT env of `closedForm.test.js` (one made-up future; `env.mix` for the saving mix as well — `env.savingMix`),
plus a second made-up future family with a flat return `r` and flat prices, and a third with flat prices
rising at 2.5%. One seam is new: **`env.savingsGrowth`** (tests only) replaces the engine's fixed 3% on
savings (`config.isaReturn`, which `simulate` already honours — an explicit 0 means 0) in the saving engine
and in the adapter's configs, so a closed form with savings in it can be exact; `fastEligible` must accept a
finite `isaReturn` and the identity test (3.6) covers it. The FLAT env sets it to 0. `own` is the monthly
pay-in as typed, `g = own / 0.8`, `E` the employer's monthly amount, `c = g + E`, `S` years to the stop,
`M = 12S` months.

| Case | Inputs | Exact answer |
|---|---|---|
| SV1 nothing grows | 0%, flat prices; 45 → 60; pot £120,000; own £400; no pay | Pot at 60 `= 120,000 + 180 × 500 = £210,000` exactly (to 1p); relief `£100` a month every month; `capped = 0`; `potAtStop.careful === middling === good` |
| SV2 the employer | As SV1 with pay £45,000 and employer 5% | `E = 187.50`; pot `= 120,000 + 180 × 687.50 = £243,750` |
| SV3 compound interest, the FCA rates | Flat `r ∈ {2%, 5%, 8%}`, flat prices, all in shares (`savingMix: { equity: 1 }`); pot `P`, pay-in `c` a month at the start of the month | Pot `= P·(1+r)^S + c·q·((1+r)^S − 1)/(q − 1)` with `q = (1+r)^(1/12)`, within 1p; run for `S = 1, 15, 40` and `P ∈ {0, 120,000}`, `c ∈ {0, 687.50}` |
| SV4 today's Accumulation tab | The same three rates with prices at 2.5% a year, deflated | Within **2%** of `projectAccumulation({ currentAge: 45, retirementAge: 60, potNow: 120000, totalMonthly: 687.5 })`'s `potLow/potMid/potHigh` at age 60 — and a line in the test's message stating the two conventions (finding 4). Exact if the old tab is brought into line (19.1) |
| SV5 the £60,000 cap | 0%, flat prices; pay £200,000, employer 15% (`E = 2,500`), own £4,000 (`g = 5,000`) | Yearly total `90,000`; kept `60,000`; `capped = 30,000` a year; pot after one year `= pot + 60,000`; warning `over-allowance` |
| SV6 the £10,000 cap | As SV5 with `takenPension: true` | Kept `10,000` a year; `capped = 80,000`; warning names the £10,000 rule |
| SV7 the earnings cap | Pay £3,000 (given), own £300 (`g = 375`, `4,500` a year) | Kept `3,600` a year (the floor); capped `900`; pay £12,570, own £1,000 → kept `12,570` of `15,000` |
| SV8 pay not given | Pay `null`, own £4,000 | No earnings cap; the `60,000` cap only; assumed line `pay-not-given` |
| SV9 prices | 0% return, prices +10% a year, own £400 | Year 2's `own` is `440` a month in pounds of the day; the pot at the stop in **today's** prices `= Σ own_y × 12 ÷ priceIndex[S]`; the cap is tested in pounds of the day: own £4,000 with employer 0 is under the cap in year 1 and over it from the year `5,000 × 12 × priceIndex > 60,000` |
| SV10 a stop age of today's age | 60 → 60 | Zero saving months; `byFuture[i].who.pension === pot` for every `i`; `potAtStop.careful === pot` |
| SV11 savings too | 0%; savings £60,000, `savingsIn` £500 | Savings at the stop `= 60,000 + 500 × M` with `env.savingsGrowth: 0`; with the engine's real fixed 3% (`env.savingsGrowth` unset), `= 60,000 × 1.03^S + 500 × q·(1.03^S − 1)/(q − 1)`, `q = 1.03^(1/12)`, within 1p |
| SV12 a couple | Two people, both SV1 | Each person's pot equals SV1's; the household pot is twice it; caps are per person (two £60,000s) |

### 3.5 The pay-in search (`tests/v7/saving/payIn.test.js`)

`payInFor(household, S, futures, potNeeded, share, env)`:

- In the FLAT env, `potNeeded = 210,000` for SV1's person gives exactly `£400`; `210,001` gives `£410`
  (the £10 step, rounded up).
- Round trip on 30 random households (fast-check, 40 futures): with `payIn := payInFor(…, 0.9)`, the pot at
  the stop reaches `potNeeded` in at least `N − floor(N/10)` futures; with `payInNeeded − 10` (when it is not
  0), in fewer. The same at shares 0.7 and 0.5, and `payInFor(…, 0.5) ≤ payInFor(…, 0.7) ≤ payInFor(…, 0.9)`.
- `payInFor` returns `0` when the pot reaches `potNeeded` with no pay-in, and `null` with warning
  `cannot-reach` when £5,000 a month (the field's limit) does not — never a figure over the limit.
- The cap is respected: a pay-in the cap would remove is never "needed" (the search stays under the cap and
  says `cannot-reach` if the cap is why).

### 3.6 The fast path is the reference path (extends `tests/v7/c/speed.identity.test.js`)

Two new shapes, each run both ways (`bothWays` of `tests/v7/c/identity.js`) and asserted byte-identical:

- **Per-future starting pots**: `createBandSolver(plan, futures, { potsByFuture })` against the reference
  solver with the same pots; 40 random households at 12 futures, the four fixtures at 40, one at 1,000
  (slow file).
- **An income that ends**: configs with `extraIncomes: [ { startYear: 0, endYear: N − 1, annual, indexation: 'cpi' } ]`
  through `simulateFast` against `simulate`, run by run: `failed`, `failMonth` and the end pots to the bit,
  for `N ∈ {1, 3, 10}` and `annual ∈ {1, 12,570, 50,000}`. If the replica is not extended, `fastEligible`
  must return `false` for the shape and this test asserts the solver fell back (a counter on the runner), so
  a config is never run by a replica that does not cover it.

## 4. Question A's tests

### 4.1 Rules on one answer: `checkAnswerA(answer, given)` in `tests/v7/a/invariants.js`

Every band block (`named.band`, each `ages[k].band`, `partTime.named.band`) is passed to C's `checkAnswer`
first, with its own `inputs` view; then:

| # | Rule | Exact assertion |
|---|---|---|
| A1 | The start is the stop age | `named.band.basis.startAge === inputs.stopAge` (for a couple: the younger's age on the stop date); `basis.start` is today + `(stopAge − you.age)` years; never moved; no `start-moved` line under what was assumed |
| A2 | The verdict is the count | `verdict === 'yes'` iff `spend.lasted ≥ 0.9 − 1e-12`; `'close'` iff `0.5 ≤ lasted < 0.9`; `'no'` otherwise. `spend.covered === (verdict === 'yes')`. `spend.runOutAge === endAge` iff covered |
| A3 | The verdict agrees with the band | `verdict === 'yes'` ⇒ `spend.perMonth ≤ band.monthly.careful + 10` (the £10 step); `spend.perMonth ≤ band.monthly.middling` ⇒ verdict is `yes` or `close`; `spend.perMonth > band.monthly.good` ⇒ verdict `no` |
| A4 | The named age is in the range, and is the same object | `ages.some(r => r.stopAge === named.stopAge)` and that row deep-equals `named` minus `beforeStatePension` and `pensionClosedUntil` (which are named-only) — **byte for byte**, not recomputed |
| A5 | The range is whole and in order | `ages` sorted by `stopAge`, no repeats, every age between the first and last present; first `≥ you.age`; last `≤ 70`; the named age's row present (A4); `env.rows` can narrow it (tests) |
| A6 | Later never worse, on the same market | For consecutive rows (single): `band.monthly.*` non-decreasing; `spend.lasted` non-decreasing; `potAtStop.*` non-decreasing. A couple: to one £10 step and one future (C's M1 caveat: two pots drained in a fixed ratio). A row after State Pension age: `guaranteed.monthlyAfterTax` the same as the row before |
| A7 | `earliestYes` is what it says | `null` iff no row has verdict `yes`; else the smallest `stopAge` with verdict `yes`, and every later row is `yes` (follows from A6; asserted so a fault in A6's tolerance cannot hide it) |
| A8 | One more year is a difference of rows | `oneMoreYear[k]` is `ages[k+1] − ages[k]` for `extraMonthly.*` (may be 0, never negative), `lastedFrom/To` the two `lasted`s, `potExtra` the difference of `potAtStop.middling` — recomputed by the test from `ages`, exact |
| A9 | The years before the State Pension are the phases | `beforeStatePension.years === (State Pension age of the first person to get one) − stopAge` (0 when past it); `phases` are the band block's phases up to that age with a `paidBy` derived only from `fromPots`, `fromPension`, `fromSavings`, `byPerson.locked` and the part-time income: `savings` when `fromPension === 0 && fromSavings > 0`, `pension` when the reverse, `both`, `part-time` when earned income covers the whole phase's need; `shown` figures add up (I4) |
| A10 | A closed pension is closed | `pensionClosedUntil` is set iff a person with a pot is under the earliest pension age on the stop date; equals `{ who, age }` with `age === firstOpenAge(...)`; the first phases show `locked` for them; the trace has no `fromPension > 0` for them before that age (I14) |
| A11 | Nothing open and nothing to draw | If every pension is closed at the stop and `savings === 0` and no part-time income and no pension income before the first opening: verdict `no`, `spend.runOutAge === stopAge`, warning `nothing-open-until` with the first opening age, and `earliestYes` (if any) `≥` that age |
| A12 | Part-time never hurts | When `partTime` is present: `partTime.named.spend.lasted ≥ named.spend.lasted`; `runOutAge ≥`; `band.monthly.* ≥ named.band.monthly.*` (£10 step; couple one future); the trace shows the income exactly `years × 12` months from the stop, then nothing |
| A13 | Pay-in stops at the stop | In the trace: no `paidIn` after the stop month; the drawing-down rows start the month after the last saving row; `potStart` of the first drawing row `===` the last saving row's `potEnd` (pounds of the day) for each person, to 1p |
| A14 | Every default is listed | I10's rule with A's ids: `pay-in-rises`, `relief-basic`, `pay-not-given`, `employer-none`, `saving-risk`, `stop-together`, `no-part-time`, `spend-level`, plus C's always-there lines. `savingRisk` listed only when there is a pot or a pay-in |
| A15 | Sentences | I11 over `sentences.*`: `a.head` names the verdict and the stop age; `a.range` has one figure per row (`ages.k.band.monthly.careful`); `a.oneMore` names `fromAge`, `toAge` and `extraMonthly.careful`; `a.before` names `beforeStatePension.years` only as an age ("until you are 67"), never as "N years to go" |

### 4.2 Closed forms (`tests/v7/a/closedForm.test.js`)

The FLAT env (0%, flat prices, all cash, `savingMix` all cash too), `env.rows` fixed. `NO_SP = { kind: 'none' }`.

| Case | Inputs | Exact answer |
|---|---|---|
| AF1 the sum | Single, 45, pot £120,000, own £400, no pay, stop 60, spend £1,000, `NO_SP`, to 95 | Pot at 60 `£210,000` (SV1); 35 years × 12 × £1,000 = £420,000 needed; verdict `no`; `spend.runOutAge === 77` (210,000 ÷ 1,000 = 210 months = 17.5 years → age 77); `band.monthly.careful === 500` (210,000 ÷ 420 months = 500, taxable part under the allowance) |
| AF2 yes | AF1 with spend £500 | Verdict `yes`; `lasted === 1`; `runOutAge === 95`; the last drawing row's `potEnd < 12 × 35 × 3.34` (what the £10 step leaves) |
| AF3 the range | AF1 with `env.rows: [58, 59, 60, 61, 62]` | Pots at the stop `198,000 · 204,000 · 210,000 · 216,000 · 222,000`; careful amounts `198,000/444 → 440`, `204,000/432 → 470`, `500`, `216,000/408 → 520`, `222,000/396 → 560` (each rounded down to £10); `oneMoreYear[2].extraMonthly.careful === 20`; `earliestYes === null` |
| AF4 from savings before 57 | Single, 47, pot £300,000 (closed until 57: reaches 55 on 30 Sep 2034), savings £60,000, no pay-in, stop 55, spend £1,300 (`15,600` a year: three quarters of it is under the allowance, so no tax and the order the pots are drawn in does not matter), `NO_SP` | `pensionClosedUntil === { who: 'you', age: 57 }`; first phase `paidBy: 'savings'`, `fromPension === 0` for 24 months; savings at 57 `= 60,000 − 31,200 = 28,800`; from 57 the pension pays; `runOutAge`: `(300,000 + 28,800) ÷ 1,300 = 252.9` months from 57 → 21 years → age 78; verdict `no` (95 wanted); every drawing row before age 57 has `fromPension === 0` |
| AF5 not enough savings | AF4 with savings £20,000 | `runOutAge === 56` (20,000 ÷ 1,300 = 15.4 months → runs out in the 16th month, age 56); warning `savings-run-out-before-pension` naming 57; with `env.rows: [55, 56, 57, 58]`, rows 57 and 58 have `runOutAge` from the whole sum and `earliestYes` is `null` (nothing lasts to 95 on these figures) |
| AF6 nothing open | AF4 with savings £0 | Verdict `no`; `runOutAge === 55`; warning `nothing-open-until` with 57; A11 |
| AF7 State Pension pays the rest | Single, 60, pot £84,000 (open: 60 today), no savings, stop 60, spend £1,000, full State Pension from 67 | 84 months × £1,000 from the pot to 67 exactly (`12,000` a year, three quarters under the allowance: no tax); from 67 the State Pension (`£1,046` a month after tax, C's CF4 figure) exceeds the spend; verdict `yes`; `beforeStatePension.years === 7`, one phase `paidBy: 'pension'`; the last drawing row before 67 has `potEnd < 12` |
| AF8 part-time | AF1 with `partTime: { has: true, yearly: 12,570, years: 3 }` and spend `£1,047.50` | Earned income £1,047.50 a month (no tax: under the allowance) covers the spend for 36 months: nothing drawn; `partTime.named.spend.runOutAge === named.spend.runOutAge + 3` when the spend then drains the pot at the same rate (spend 1,047.50: named runs out at 60 + 210,000/1,047.5 = 200.5 months → age 76; with part-time, 79) |
| AF9 stop now equals C | Single, 60, pot £250,000, stop 60, spend £1,000, everything else default, the real futures (not FLAT), 40 futures | `named.band` deep-equals `answerC({ you: { pot: 250000, age: 60 } }, env)`'s band fields (6.3) |
| AF10 a couple | Two people, both AF2, stopping together | Each pot as SV1; `named.band.monthly.careful === 1,000` (two × 500); `basis.split` half each |

### 4.3 The trace check (`tests/v7/a/trace.test.js`)

`tests/v7/oracles/fromTrace.mjs` gains `recomputeSaving(rows)`, imports nothing from `src/`:

| Recomputed from the trace | Compared with | How close |
|---|---|---|
| Each saving month: `potStart + own + relief + employer + growth` | `potEnd` | 1p |
| Each tax year: `Σ (own + relief + employer)` | `≤ 60,000` (`10,000` with `takenPension`); `≤ max(3,600, pay)` when pay given | exact |
| Each month: `relief` | `own / 4` | 1p |
| The last saving row's `potEnd`, each person | The first drawing row's `potStart` | 1p |
| The pot at the stop in today's prices | `potAtStop` of that future (`trace.futures[i].potAtStop`) | £1 |
| The drawing-down rows | C's whole `checkTrace` (3.1 of the C plan) on `trace.drawing` | as C |
| Sort `trace.futures` by run-out month at the spend; count those that ran out | `spend.lasted × N` | exact |

Run on the four fixtures, the 48 core cases and the 13 stop-age cases with `env.trace: true`.

## 5. Question B's tests

### 5.1 The pot needed is C's inverse

`potNeededFor(householdAtS, target, env)` searches the pot `P` (£1,000 steps, from 0 to £3,000,000) for the
least `P` with `answerC({ …householdAtS, you.pot: P, start: { kind: 'age', age: S } }, env).monthly.careful ≥
target`. It runs C's function on C's futures — a market from the start, not from today — so the figure means
"what a person with this pot at that age could take", the same as C would tell them. The market from today is
`joined`'s business (5.3). The search is monotone (C's M1) and the tests say so.

`tests/v7/b/roundTrip.test.js`:

- **Round trip through C**: for the four fixtures and 30 random households (40 futures): `answerC` with
  `potNeeded` at the stop age has `monthly.careful ≥ target.perMonth`; with `potNeeded − 1,000` (when
  `potNeeded > 0`) it has `< target.perMonth`. Exact, not within a tolerance: the two calls are the same
  function on the same futures.
- **Whole thousands**: `potNeeded % 1000 === 0`; `potNeeded === 0` iff the pension income alone meets the
  target at the stop age (then `sentences.head` is the `b.already` sentence).
- **Cannot be reached**: a target above what £3,000,000 gives → `status: 'ok'` with `potNeeded: null` and
  warning `target-too-high`; nothing else is `null`.
- **The confidence does not move the pot needed** (it is a careful figure by definition); it moves
  `payInNeeded` (5.2).

### 5.2 The pay-in needed and the choices (`tests/v7/b/solve.test.js`)

- `payInNeeded.perMonth === payInFor(household, S, futures, potNeeded, confidence/10, env)` — the same
  function, asserted equal; the round trip of 3.5 holds on the answer's own figures.
- `payInNeeded.perMonth ≤ inputs.you.payIn` ⇔ `onCourse.verdict === 'yes'` when `confidence === '9'`
  (both count the same futures; a fault that counts them differently shows here).
- `choices` present iff `onCourse.verdict !== 'yes'`; each choice's figure is recomputable from the answer:
  `stop-later.stopAge` is the least age in `stopAge+1..70` whose pot-needed is reached with the current
  pay-in in `confidence` futures (or `null` with the sentence "not by 70"); `pay-in-more.payIn ===
  payInNeeded.perMonth`; `spend-less.perMonth === joined.band.monthly.careful` (what the current path
  supports); `more-risk` re-runs `savingYears` with `savingRisk: 'adventurous'` and reports `lasted` and its
  own `payInNeeded`; `accept.lasted === onCourse.lasted`.
- `more-risk` is absent when `savingRisk` is already `adventurous`; `stop-later` absent when `stopAge === 70`.

### 5.3 Rules on one answer: `checkAnswerB(answer, given)` in `tests/v7/b/invariants.js`

C's `checkAnswer` on `joined.band`; then:

| # | Rule | Exact assertion |
|---|---|---|
| B1 | The target | `target.perMonth` equals the amount typed or the level's figure; `source` says which; the level figure is listed under what was assumed (`target-level`) |
| B2 | The pot needed is C's | 5.1, on the answer's own figures (one call of C inside the test) |
| B3 | On course is a count | `onCourse.lasted === (futures in which potAtStop_i ≥ potNeeded) / N` from `trace.futures`; verdict thresholds as A2 |
| B4 | The joined path is A's row | `joined.band` deep-equals `answerA(sameHousehold with spend = target, env.rows: [stopAge]).named.band` — byte for byte (6.4) |
| B5 | Pay-in needed round-trips | 5.2 |
| B6 | Choices are honest | 5.2; `choices` empty when `yes`; no choice repeats the current inputs |
| B7 | Every default is listed | A14's ids plus `confidence-9`, `target-level` |
| B8 | Sentences | `b.head` carries `potNeeded` and the stop age; `b.payIn` carries `payInNeeded.perMonth` and the confidence as "in 9 futures out of 10"; `b.onCourse` carries `onCourse.lasted` through `outOfTen`; each choice one sentence, each with its own figure (I11) |

### 5.4 Closed forms (`tests/v7/b/closedForm.test.js`)

| Case | Inputs | Exact answer |
|---|---|---|
| BF1 the number | FLAT; single, 45, pot £120,000, own £400, stop 60, target £990 (not £1,000: `420,000` over 420 months would sit on the knife-edge of the last month), `NO_SP` | `potNeeded === 416,000`: the least whole thousand whose careful amount is `≥ 990` (`416,000 / 420 = 990.48 → 990`; at `415,000`, `988.10 → 980`); `onCourse.lasted === 0` (the pot at 60 is `210,000`); `payInNeeded.perMonth === 1,320` — **the test computes it**: the least £10 multiple `p` with `120,000 + 180 × p / 0.8 ≥ 416,000` (`p ≥ 1,315.56`); at `1,310` the pot is `414,750`; `choices` has five entries; `spend-less.perMonth === 500` (AF1's careful amount: the joined path at 60 with `210,000`); `stop-later.stopAge` is the least age whose pot needed is reached with £400 a month, computed by the test from the same sums |
| BF2 already there | BF1 with pot £416,000 and own £0 | `onCourse.lasted === 1`, verdict `yes`, `payInNeeded.perMonth === 0`, no choices |
| BF3 the confidence | BF1 with ten made-up futures, flat prices: five at 0% a year and five at −10% a year (`env.futureReturns` by index) | `'9'` (one failure allowed of ten) solves on the −10% futures: `payInNeeded` is the figure the test computes from the −10% sum; `'5'` (five allowed) solves on the 0% futures: `1,320` as BF1; `'7'` (three allowed) is the −10% figure again. `potNeeded` is `416,000` in all three; `onCourse.lasted === 0.5` when the pot at 60 on the 0% futures reaches it and on the −10% futures does not |
| BF4 pension income alone | Single, 60, stop 67, target £1,000, full State Pension | `potNeeded === 0`; sentence `b.already`; `payInNeeded.perMonth === 0`; `onCourse.verdict === 'yes'` |
| BF5 too high | BF1 with target £8,000 | `potNeeded === null`; warning `target-too-high`; `choices` still lists `spend-less` and `stop-later` |
| BF6 a couple | Two people, both BF1, target £1,980 | `potNeeded === 832,000`, one household figure, split between the two pots in the proportion of their pots at the stop age in a middling case (here half each: `416,000` each gives `990` each; the rule is listed under what was assumed as `pot-needed-split`); `payInNeeded` is one household figure, `2,640`, split evenly (`pay-in-split-evenly`) |

## 6. Between two answers, and between questions

`tests/v7/a/properties.test.js`, `tests/v7/b/properties.test.js`, `tests/v7/cross/questions.test.js`. Each is a
fast-check property over `arbitraryInputs(SCHEMA_A | SCHEMA_B, ENV)` on the same seed for both runs, with
C's `belowTaper` filter where tax cliffs apply. "No worse" means `≥` on `monthly.*`, `lasted`, `runOutAge`,
`potAtStop.*` together; couples to one £10 step and one future.

### 6.1 Question A

| # | Change | What must happen |
|---|---|---|
| PA1 | More pay-in (`you.payIn + extra`, under the cap) | No worse; `guaranteed` unchanged; `potAtStop.*` strictly no lower |
| PA2 | More pot today | No worse |
| PA3 | A later stop age (`stopAge + 1`, `≤ 70`, end age fixed) | `named` no worse; and `named` deep-equals the old answer's `ages` row for that age when it was in the range (the row and the named age are one function) |
| PA4 | A lower spend | `verdict` no worse (`no → close → yes` order), `lasted` no lower, `band` identical (the band does not depend on the spend) |
| PA5 | Adding part-time work | `partTime.named` no worse than `named`; `named` itself identical to the answer without part-time |
| PA6 | `spend.kind: 'level'` against `'amount'` with the level's figure | Identical answers except `assumed` (`spend-level` line) and `target.source` |
| PA7 | A field that does not apply (employer when pay is null; partner fields when single; part-time fields when `has: false`) | Byte-identical |
| PA8 | Swap the people | Household figures identical (C's M5); `pensionClosedUntil.who` swaps |
| PA9 | A partner with nothing, same age, same stop | Identical to the single answer (C's M6) |
| PA10 | `endAge + 1` | `band.monthly.*` no higher; `lasted` no higher |
| PA11 | Run twice; the wall clock moved to 2031 with `env.today` unchanged; the gilt file swapped | Identical (C's M14–M16) |
| PA12 | The day changes from 4 to 8 April 2027, ages typed the same | `diffPaths` names only `basis.today`, the tax year in `assumed`, and — for a person whose stop date crosses 6 April 2028 — `pensionClosedUntil` (a new path in the list is a new dependence on the date, decided on purpose) |
| PA13 | More saving risk | Nothing asserted about direction (more shares is not "better"); `guaranteed` and `band.basis` unchanged; `potAtStop.good` no lower **and** `potAtStop.careful` allowed lower — reported, not asserted |

### 6.2 Question B

| # | Change | What must happen |
|---|---|---|
| PB1 | More pay-in | `potNeeded` identical; `onCourse.lasted` no lower; `payInNeeded` identical; `joined` no worse |
| PB2 | More pot today | `potNeeded` identical; `onCourse.lasted` no lower; `payInNeeded.perMonth` no higher |
| PB3 | A later stop age | `potNeeded` no higher (fewer years to fund; the State Pension age is fixed); `payInNeeded` no higher |
| PB4 | A higher target | `potNeeded` no lower; `payInNeeded` no lower; `onCourse.lasted` no higher |
| PB5 | Confidence `9 → 7 → 5` | `payInNeeded.perMonth` non-increasing; `potNeeded` identical; `onCourse` identical |
| PB6 | Feed back: `you.payIn := payInNeeded.perMonth` | `onCourse.lasted ≥ confidence/10` (exactly the count), verdict `yes` when confidence is 9; `choices` empty |
| PB7 | Feed back: `you.pot := potNeeded`, `stopAge := you.age` (stop now with the pot needed) | `joined.band.monthly.careful ≥ target.perMonth`; equals `answerC` on the same household (6.3) |
| PB8 | `target.kind` level against amount; fields that do not apply; swap; a partner with nothing; date and clock | As PA6–PA12 |

### 6.3 C equals A at "stop now"

`tests/v7/cross/questions.test.js`, X1: for random A inputs with `stopAge := you.age` (and `partner.stopAge :=
partner.age`), `savings` as given, `payIn` anything (it stops today, so nothing is paid): let `c = answerC`
on the C-shaped household (pot, age, savings, State Pension, final-salary, risk, end age; `start.kind:
'now'`). **Precondition**: `c.basis.start === today` (C did not move the start — when it would, A's fixed
start is a different question; those cases are counted and must be under a third of the sample, else the
generator is skewed). Then `a.named.band.monthly`, `.yearly`, `.lasted`, `.runOutAge`, `.phases`,
`.guaranteed`, `.basis` (except `basis.futures` naming and `engineVersion`) deep-equal `c`'s. Byte for byte:
the saving years are zero months long, the futures are the same prefix, the band search is the same code.
Also with `take := spend` on C: `c.take` deep-equals `a.named.spend`.

### 6.4 B's pot needed reproduces the target through C; B's joined path is A's row

X2 (in the same file): `potNeeded` through C (5.1) — on the four fixtures and 30 random B households. X3:
`answerB(...).joined.band` deep-equals `answerA(A-shaped inputs with spend := target).named.band`, byte for
byte, on 30 random households. X4: A's `ages` row for `stopAge` deep-equals A's `named` (A4) — listed here
again because a planted "recompute the named age with a fresh seed" fault must go red in both.

### 6.5 Nightly only: does the headline depend on luck?

C's 2.3, for A and B: the four fixtures at the full number of futures on five seeds. `named.verdict` must not
flip; `named.band.monthly.careful` and `potNeeded` as displayed must not differ by more than 5% between
seeds; `payInNeeded.perMonth` by more than £20. A flip is a design finding, reported and failing the night.

## 7. Independent checks

### 7.1 The month-by-month trace

Section 4.3 (the saving months by hand, the drawing months by C's oracle). The oracle's tax on the drawing
months is C's `ukTax.mjs`; on the part-time years it adds the earned income to the taxable total — one more
row in `fromTrace.mjs`'s per-year sum, no new oracle.

### 7.2 Relief and the caps: HMRC's rules as a table (`tests/v7/oracles/hmrc-relief-2026-27.json`, `relief.test.js`)

Each row with a source and the date it was checked (gov.uk "Tax on your private pension contributions" and
the annual allowance page), checked before the file is committed:

| Own, a month | Pay, a year | Employer | Taken pension already | Gross own a year | Employer a year | Kept | Capped | Note |
|---|---|---|---|---|---|---|---|---|
| 400 | not given | — | no | 6,000 | 0 | 6,000 | 0 | relief at source: 4,800 + 1,200 |
| 400 | 45,000 | 5% | no | 6,000 | 2,250 | 8,250 | 0 | |
| 4,000 | 200,000 | 15% | no | 60,000 | 30,000 | 60,000 | 30,000 | the £60,000 cap |
| 4,000 | 200,000 | 15% | yes | 60,000 | 30,000 | 10,000 | 80,000 | the £10,000 cap |
| 300 | 3,000 | 0 | no | 4,500 | 0 | 3,600 | 900 | the £3,600 floor |
| 1,000 | 12,570 | 0 | no | 15,000 | 0 | 12,570 | 2,430 | 100% of pay |
| 240 | 0 | 0 | no | 3,600 | 0 | 3,600 | 0 | no pay, the floor exactly |
| 4,000 | 260,000 | 0 | no | 60,000 | 0 | 60,000 | 0 | the taper is **not** modelled: warning `taper-not-modelled` above £200,000 of pay, listed under what was assumed |
| 1,000 | 60,000 | 0 | no | 15,000 | 0 | 15,000 | 0 | higher rate: warning `claim-relief` with `(0.4 − 0.2) × 15,000 = 3,000` a year to claim, not counted |

The table runs against `grossPayIn` (the saving engine) and — for the rows without a cap — against today's
`contributionBreakdown({ schemeType: 'ras' })` so the two agree on the gross figure to the penny while both
exist.

### 7.3 The answer fed back through today's saved-plan path (`tests/v7/a/feedback.slow.test.js`)

C's `feedback.slow.test.js` pattern: A's named-age band in a bad case — the pot at the stop age in a bad case
(`potAtStop.careful`) and the careful amount — saved in today's settings shape as a plan starting at the stop
age (`firstTaxYear` from the stop date), run through `createSimulationConfigFromSettings → planFromSettings →
stressTestStrategy('pots-and-valves')` at the same number of futures: the careful amount fails in at most
12 in 100 (C's measured tax-year share difference; the same first-year share caveat, asserted both ways as
C does). This is the only place A's figures meet the old engine's own plan path.

### 7.4 Today's Accumulation tab, while it exists

SV4 (within 2%), and `requiredPotForSuccess` on F1's household at 85% against B's `potNeeded` with a
confidence of… **not compared**: the old function searches a different quantity (success of a saved plan's
strategy) on different futures. Listed so nobody adds the comparison later thinking it was forgotten.

## 8. Generated cases

### 8.1 The pairs for A (`tests/v7/gen/dimensionsA.mjs`, `cases.pairs.json` under `tests/v7/a/`)

| Dimension | Values |
|---|---|
| Household | single · couple |
| Your age | 25 · 40 · 45 · 47 · 53 · 54 · 55 · 56 · 57 · 60 · 65 · 70 |
| Stop age | same as age (stop now) · 55 · 56 · 57 · 60 · 65 · 67 · 70 (only values ≥ age; the generator's `compatible`) |
| Your pot | 0 · 1 · 10,000 · 120,000 · 250,000 · 1,073,100 · 3,000,000 |
| Pay-in | 0 · 240 · 400 · 1,000 · 5,000 |
| Pay and employer | not given · 45,000 and 0 · 45,000 and 5% · 200,000 and 15% · 3,000 and 0 |
| Taken pension already | no · yes |
| Savings | 0 · 60,000 · 150,000 |
| Spend | 500 · 1,200 (minimum) · 2,608 (moderate) · 3,592 (comfortable) · 8,000 · level: moderate |
| Saving risk | cautious · balanced · adventurous |
| Risk | cautious · balanced · adventurous |
| State Pension | none · full · part (£6,000) |
| Final-salary | none · £9,000 from 60 · £9,000 from 65 · £60,000 from 60 |
| End age | 95 · 100 |
| Part-time | none · £12,570 for 3 years · £30,000 for 1 year · £30,000 for 10 years |
| Partner's age | n/a · 53 · 58 · 62 |
| Partner's pot | n/a · 0 · 150,000 |
| Partner's pay-in | n/a · 0 · 400 |
| Partner's stop | n/a · together · 60 · 67 |

Expect roughly 90 to 120 cases (the two largest dimensions are 12 × 8). **Core in every combination**:
household (2) × final-salary (2) × State Pension (2) × saving risk (3) × part-time (2) on one
middle-of-the-road person (45, £120,000, £400 a month, stop 60, spend £2,608): 48. **Stop-age boundaries one
at a time**: for a 53-year-old and a 54-year-old, stop at 54, 55, 56, 57 and 58 (ten cases: the rise to 57
crossed both ways, and "stop now" for the 54-year-old), and for the 54-year-old stop at 60, 66 and 67 (three
more): 13 cases, each single, £250,000, £400 a month, spend £1,200, everything else left alone — this is
where "closed until 57" is exercised in isolation, so a failure names the age. The same files and rules as C's `pairs.test.js`: regenerate and compare, the double
loop, `checkAnswerA` on every case at 20 futures with `env.rows: [stopAge]` (the full range only on the
core cases).

### 8.2 The pairs for B

The same dimensions without part-time and spend, with target (the same six values) and confidence (9 · 7 · 5).
Core: household × final-salary × State Pension × saving risk × confidence on the same person: 72. The same
13 stop-age cases.

### 8.3 Random cases

`arbitraryInputs(SCHEMA_A, ENV)` and `(SCHEMA_B, ENV)` from `gen/arbitrary.mjs` as they are (the generator
reads the list; the new `percent` and `count` types and the `'given'` form of `when` are the only additions to
`fieldArb`). Found cases go to `tests/v7/a/found.cases.json` and `tests/v7/b/found.cases.json`, run for ever
by the pairs tests.

## 9. The four people (fixtures)

`tests/v7/fixtures/a/*.json`, `tests/v7/fixtures/b/*.json`, in C's shape (inputs, env, `expect`, `approved`,
`pinned`); `fixtures.test.js` for each question. The sentence drafts below are pinned letter for letter on the
first green run and approved once by the owner; the answer contracts may reword them first. `{…}` are keys of
the result, as displayed. Every string must pass the banned list: "pay in", never "contribute"; "stop work",
never "retire" as a verb; ages and dates, never a count of years to wait.

### P1 — 45, wants to stop at 60 (`a/A1-forty-five.json`, `b/B1-forty-five.json`, one household)

Inputs: single, 45, pot £120,000, pays in £400 a month, pay £45,000, employer 5%, stop 60, spend / target
moderate (£2,608 a month), everything else left alone.

- A headline: "Not at 60 on these figures." / "It is close at 60." / "Yes, at 60." — one of three, chosen by
  `named.verdict`; then "Spending {named.spend.perMonth} a month from 60 lasted to 95 {outOfTen(lasted)}. In
  a bad case (the worst 1 in 10) it would run out at age {named.spend.runOutAge}."
- The band: "From 60 you could have about {named.band.monthly.careful} a month after tax, in 9 futures out
  of 10. By then your pot could be about {named.potAtStop.middling}; in a bad case about
  {named.potAtStop.careful}."
- The range: one line per row: "At {stopAge}: about {band.monthly.careful} a month — {verdict word}." and
  "The earliest age that works is {earliestYes}." (or "None of these ages works on these figures.")
- One more year: "Working from 60 to 61 adds about {extraMonthly.careful} a month, every month."
- Before the State Pension: "Until you are {State Pension age} the money comes from your pot. From then your
  State Pension pays {shown.statePension} of it."
- B headline: "You would need about {potNeeded} by 60." · "You are on course to have it {outOfTen(onCourse.lasted)}."
  · "To get there in 9 futures out of 10, pay in about {payInNeeded.perMonth} a month from take-home pay."
  Then, when not on course, the five choices, one line each, side by side on the screen.
- What was assumed, extra lines: "Your provider adds basic-rate relief to what you pay in. Any higher-rate
  relief you claim is not counted." · "Your employer pays in 5% of £45,000." · "What you pay in goes up each
  year with prices, and stops at 60." · "While you save, your pot is invested at balanced risk: about half in
  shares." · "The £60,000 yearly limit on pension saving applies."

### P2 — 55, stopping next June, with a partner (`a/A2-next-june.json`)

Inputs: couple; you 55, pot £420,000, pays in £600, pay £52,000, employer 8%, stop 56 (June 2027 is age 56
in the model's whole years — the screen offers "next June" and shows the age it means); partner 53, pot
£180,000, pays in £300, stops together; savings £40,000; spend £3,592 (comfortable, couple); both full State
Pension; you: final-salary £9,000 from 65.

- Must show: your pension open at 56 (you reach 55 before 6 April 2028); the partner's pension **closed until
  57** (they reach 55 on 30 Sep 2028) with the line "Your partner's pension cannot be touched until they are
  57. Until then your pot and your savings pay." `pensionClosedUntil === { who: 'partner', age: 57 }`; the
  start not moved (A1); the phases before 67 with `paidBy`; the higher-rate `claim-relief` warning for you
  (£52,000 > £50,270).
- Headline as P1; the couple wording ("the two of you", "the younger of you is 95").

### P3 — 58, "is it too late?" (`b/B2-too-late.json`, `a/A3-too-late.json`)

Inputs: single, 58, pot £90,000, pays in £300, pay £32,000, employer 3%, stop 65, target £1,800, full State
Pension (from 67), savings £15,000.

- B: `potNeeded` (the pot at 65 that carries £1,800 a month to 95 with the State Pension from 67);
  `onCourse.verdict` expected `no`; the five choices with figures; the plain tone the research asked for
  (S12): no "too late" in any string — "On these figures the pot falls short by 65. Here is what closes the
  gap." Pinned: `choices[0].id === 'stop-later'` with a stop age or "not by 70".
- A3 (the same household, spend £1,800): the range 62..70 and `earliestYes`; the before-State-Pension phases
  (65 to 67 from the pot, then the State Pension pays most of it).

### P4 — 47, the FIRE reader stopping at 55 from ISA money (`a/A4-fire.json`)

Inputs: single, 47, pot £310,000, pays in £1,500, pay £70,000, employer 10%, savings £95,000, savings-in £800,
stop 55, spend £2,200, State Pension full, risk adventurous, saving risk adventurous.

- Must show: `pensionClosedUntil === { who: 'you', age: 57 }` (55 on 30 Sep 2034, after the change); the
  first phase `paidBy: 'savings'` to 57; the sentence "Your pension cannot be touched until you are 57. From
  55 to 57 your savings pay: about {phase.shown.takeHome} a month, {beforeStatePension.years-as-age…}" — as
  an age, "until you are 57"; the `claim-relief` warning; verdict per the pinned run; `partTime` with
  £20,000 for 2 years as the try-a-change shown on the fixture's second screen (`a/A4-fire-part-time`
  named state).
- Must not appear on any screen for this fixture: "bridge", "FIRE", "years to go", "countdown", "in 8 years".

Each fixture runs through `checkAnswerA` / `checkAnswerB`, the trace check, both time zones in the child
process, and is the seeded state for the render tests, the journeys and the pictures.

## 10. Screens, words, rail

### 10.1 Named states (`tests/v7/states/a/*.json`, `states/b/*.json`)

A: `numbers-blank` · `numbers-half-typed` · `numbers-couple-open` · `numbers-more-open` · `answer-A1` ·
`answer-A1-first` (100 futures) · `answer-A1-partial` (headline final, range arriving) · `answer-A2` ·
`answer-A3` · `answer-A4` · `answer-stop-now` (A's inputs with `stopAge === age`; drawn under the retired
rules) · `answer-nothing-open` (AF6) · `answer-nothing` (`status: 'nothing'`) · `ages-A1` · `ages-A4` ·
`one-more-year-A1` · `before-state-pension-A2` · `part-time-A4` · `answer-working` · `answer-failed` ·
`not-built-keep`.

B: `numbers-blank` · `target-blank` · `target-level` · `answer-B1` · `answer-B1-first` · `answer-B2` ·
`answer-already` (BF4) · `answer-too-high` (BF5) · `pay-in-B1` · `pay-in-B2` · `choices-B2` · `choices-none`
(on course: the step says so and offers a way on) · `answer-working` · `answer-failed`.

Built by `build-states.mjs` (one script, a `--question` flag), pinned, and re-run when anything upstream
changes; `render.test.js` per question fails when a fresh run no longer matches.

### 10.2 `checkScreen` R1–R12 on every state, plus

| # | Check | Exact assertion |
|---|---|---|
| R13 | The range is a table a reader can follow | `[data-table="ages"]` has one row per `ages[]` entry, in order; the named age's row carries `aria-current="true"`; each row's `data-key`s point into `ages.k.*` of the same `k` (a planted "row k shows row k+1's figure" goes red here) |
| R14 | The verdict is a word and a colour token, never only a colour | The verdict element has visible text from the three fixed strings and a `data-verdict` attribute; contrast test covers the three tokens |
| R15 | Side by side means side by side | `[data-choices]` has one child per `choices[]` entry with its `id`; at 390 wide they stack, at 744 and up at least two are in one row (browser only, 11.3) |
| R16 | Percent looks like percent | Every `data-kind="percent"` text matches `^\d{1,2}%$`; a pot text matches C's money rule and ends in `,000` when it is a pot the answer worked out |

### 10.3 Words: two scope rules added to `checkScreen.scopesFor(state)`

- **`retired`** applies to any A or B state whose stop age equals today's age (stop now), and to any A
  state after the stop age has passed (`env.today` later than the stop date — the date sweep makes such
  states). In those states no "when you stop work", "years to go", "in N years", "until you retire".
- **Never a countdown anywhere in A or B**, working or not: the pattern `\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b` is banned in scope `all` for the two questions (the C list has it only in `retired`). What was 15 years away is "at 60" or "in 2041".
- Words: "pay in" / "what you pay in" (never "contribute", "contribution"); "stop work" / "stop"; "the years
  before your State Pension starts" (never "bridge"); "while you are saving" (never "accumulation"); "what
  you want to spend" (A) and "what you are aiming for" (B); "on course" (never "on track" — the current
  tab's phrase, so it is not carried over by habit; add `on-track` to the list with `say: 'on course'`).
- `wording.test.js` runs the list over `src/v7/copy/a.js`, `copy/b.js`, `src/answers/a/sentences.js`,
  `src/answers/b/sentences.js` as text and over every drawn state.

### 10.4 The rail (`tests/v7/rail/rail.test.js`, extended)

A: `numbers` → `answer` → `ages` → `one-more-year` (optional) → `before-state-pension` (optional) →
`part-time` (optional) → `keep` (optional, not built). B: `numbers` → `target` → `answer` → `pay-in` →
`choices` (optional; present only when not on course, else its step says "You are on course; nothing to
change here" with a way on) → `keep`.

L1–L8 as C, over the three questions together, plus:

- L9: from any A answer, "Am I saving enough?" is one link that carries the household across (the draft of B
  is filled from A's; a test dispatches the action and reads B's draft: every shared path equal, `spend` →
  `target`, nothing else set); and from any B answer, "When could I stop?" the other way.
- L10: `#/a/ages` with a draft that parses but no answer yet shows the ages step in its "working" form, never
  a blank table; `#/b/choices` while on course shows the on-course sentence.
- L11: the rail's `result` sentence for A's `answer` step is the verdict and the stop age ("Not at 60"); for
  B's `pay-in` step the figure ("about £1,340 a month").
- Random walks (L7) now cross questions: the ten-line model gains "which question is open".

## 11. The browser

Playwright, the two builds, the same helpers. Journey wrappers assert what C's 7.3 lists, without being
asked; `checkScreen` runs on every step; every `[data-value]` is compared with `answerA` / `answerB` in
Node on the same inputs (`answerInNode.js` takes the question id).

### 11.1 The journeys

| Journey | Build | Sizes | What it does and asserts |
|---|---|---|---|
| **J4 — 45 wanting 60** (`e2e/a-forty-five.spec.js`) | published, hooks off | 390, 1440 | Front door → A; types P1's four things one key at a time (120 ms a key); asks. Asserts the A1 headline, then the range arriving (`data-answer="partial"` then `"final"`), the ages table rows against Node, "one more year" opened, then the link to B, which arrives with the boxes already filled; B1's headline. Counts written to `test-results/first-answer-a.json` and `-b.json` (11.2) |
| **J5 — 55 stopping next June, with a partner** (`e2e/a-next-june.spec.js`) | test | 390, 1440 | Types P2; says "two of us" after the first answer is showing; asserts nothing typed is lost, the partner's boxes, "closed until 57" wording, the before-State-Pension step's phases, the `claim-relief` line; changing the partner's stop age changes every place the household figure appears, together |
| **J6 — 58, is it too late** (`e2e/b-too-late.spec.js`) | test | 390, 744 | Front door → B; P3; the target step with a level chosen then an amount typed over it; the answer (`no`); the pay-in step; the choices side by side (stacked at 390); picks "stop later", which opens A with the household carried across and the later stop age named; asserts A3's verdict at that age is `yes` |
| **J7 — 47, stopping at 55 from savings** (`e2e/a-fire.spec.js`) | test | 390, 1440 | P4; asserts "cannot be touched until you are 57", the savings-first phase, then the part-time step with £20,000 for 2 years; asserts the part-time figures against Node and that the named figures did not move; the fixture's banned words on every screen |
| `crawl.spec.js` | test | four sizes | Every A and B address × every named state (10.1): ready, `checkScreen`, screen equals engine, axe, geometry; the locked corpus plan byte-identical after the crawl; `__pt.writes()` names only `pt_v7_draft` |
| `keyboard.spec.js` | test | 1440 | Tab order over A's and B's boxes (the percent box, the yes/no for part-time), Enter asks, focus lands on the headline, the ages table is reachable and rows are announced with their age; Escape closes the phone rail |
| `sameness.spec.js` | test | three engines | Section 12 |
| `screens.spec.js` | test | per table | Section 11.4 |
| `production.spec.js`, `old-app-unchanged.spec.js` | published | — | Unchanged; the A and B addresses added to the policy walk |

### 11.2 The counted first answer, per question

| Counted | A | B |
|---|---|---|
| Things that must be filled in | at most 5 (expected 4) | at most 5 (expected 4) |
| Screens before the first answer | at most 3 | at most 4 (numbers, target, answer) |
| Clicks or taps | at most 8 | at most 8 |
| Sign-up, pop-up, tour | 0 | 0 |
| Wait to the first figure (100 futures) | under 3 s slowed four times | under 3 s |
| Wait to the headline final (1,000 futures) | under 15 s slowed | under 15 s |
| Wait to everything final (range / choices) | under 30 s slowed; the page usable meanwhile (a click during the wait is handled within 200 ms) | under 30 s |
| Whole journey at typing speed | under 40 s | under 40 s |

Measured as C measures it (full speed × 4, since Chromium cannot slow a worker), written to the results
folder, and the owner's own stopwatch figure once per release in `RELEASING.md`.

### 11.3 Geometry, contrast, keyboard

C's 8.3, plus: the ages table never scrolls sideways at 390 (columns collapse to age · amount · verdict; the
rest opens per row); the five choices are cards that stack at 390 and sit two or more abreast at 744; the
percent box and its sign are one control 44 px tall; the verdict's three colour tokens pass 4.5 : 1 against
the band's background in `styles/contrast.test.js`.

### 11.4 Pictures

| Screen (named state) | 390 | 744 | 1024 | 1440 |
|---|---|---|---|---|
| A numbers, blank | ✓ | ✓ | | ✓ |
| A numbers, couple open, one error | ✓ | | | ✓ |
| A answer, A1 (no) | ✓ | ✓ | ✓ | ✓ |
| A answer, A2 (couple, closed until 57) | ✓ | ✓ | | ✓ |
| A answer, A4 (savings first) | ✓ | | | ✓ |
| A answer, stop now (retired wording) | ✓ | | | |
| A ages, A1 | ✓ | ✓ | | ✓ |
| A one more year, A1 | ✓ | | | ✓ |
| A before State Pension, A2 | ✓ | | | ✓ |
| A part-time, A4 | ✓ | | | ✓ |
| A answer, partial (range arriving) | ✓ | | | |
| B target, level chosen | ✓ | | | ✓ |
| B answer, B1 | ✓ | ✓ | ✓ | ✓ |
| B answer, already there | ✓ | | | |
| B pay in, B1 | ✓ | | | ✓ |
| B choices, B2 | ✓ | ✓ | | ✓ |
| B choices, none (on course) | ✓ | | | |

**36 pictures**, added to C's 25. Same rules: made on the CI machine only, from named states, gate off until
the owner has seen A's and B's screens on a real phone and approved a first set, then `SCREENS_GATE=1`.

## 12. The same answer everywhere

`e2e/sameness.spec.js` gains the two questions and the saving engine. In Chromium, WebKit and Firefox, the
page's `__pt.answer('a' | 'b', inputs, env)`, `__pt.answerInWorker`, and `__pt.saving(person, stopAge, env)`
against Node:

| Part of the answer | Rule |
|---|---|
| Every decision: `verdict`, `earliestYes`, `runOutAge`, `pensionClosedUntil`, `potNeeded`, `payInNeeded.perMonth`, `choices[].id`, every `lasted`, which future is the bad case | **Exactly equal** |
| Every displayed figure and every sentence | **Exactly equal**, letter for letter |
| `potAtStop.*`, the pots in `trace.futures`, raw money | Within 1p or one part in a thousand million (`recordDiffs`'s rule; `Math.pow`'s last digit) — and the **£1,000 rounding of a pot must not flip**: if it does on any case, the case is pinned and the rounding made robust (as C's knife-edge rule) |
| Direct against worker, same browser | Byte-identical |

Cases on every push: the four fixtures at 40 futures with `env.rows` of three ages, the 13 stop-age cases for
A, BF1–BF4 for B, SV1–SV3 for the saving engine (about 30). At night: the whole pairs lists and 200 random
cases from a fresh seed.

The determinism scan (`boundaries.test.js`) already covers `src/answers/`; the saving engine's only random
source is `seededRng`, and its first five values are asserted in each browser as C does.

## 13. Time

### 13.1 What was measured (30 Sep 2026, Node, the owner's Mac, one run each)

| | 40 futures | 100 | 1,000 |
|---|---|---|---|
| `answerC`, one person (F1) | 28 ms | 23 ms | 195 ms |
| `answerC`, a couple (F2) | 23 ms | — | 299 ms |

The saving years are cheap by comparison: 1,000 futures × 45 years × 12 months × 2 people of a few
multiplications is under 20 ms with the growth factors precomputed per future. Everything below is a band
search count times the figures above.

### 13.2 Budgets per answer, in Node at full speed (the worker on a slowed phone is taken as 4×)

| Answer | Band searches | Budget at 1,000 futures | At 100 (first figure) | At 40 (tests) |
|---|---|---|---|---|
| A, named age (the headline) | 1 (+1 with part-time) | 400 ms single, 600 ms couple | 60 ms | 40 ms |
| A, the range (7 rows) | 7 | 2.5 s single, 3.5 s couple | 250 ms | 250 ms |
| B, headline (pot needed + pay-in needed + on course) | about 12 (the pot search through C, with the previous step's estimate as the next step's hint) + 1 (joined) | 2.5 s single, 3.5 s couple | 300 ms | 300 ms |
| B, the choices (stop-later up to 10 rows; more-risk 1) | up to 11 | 3 s | 300 ms | 300 ms |

So on the page: the first figure (100 futures, headline only) within 3 s slowed; the headline final within 15
s slowed (0.4–0.6 s × 4 — comfortable); the range or the choices within 30 s slowed (3.5 s × 4 = 14 s, plus
the headline). Rows and choices arrive one by one (`answer/partial`), so the page is never waiting on the
whole. The worker runs one question at a time; a change of inputs ends the run under way, as C does.

Three things that make this cheaper, in the order to try if a budget is missed: (1) the per-future driver
precompute (`fastEngine.js`) shared across the rows of a range — one precompute for the full path, each row
reading it from its own stop month (the identity test covers it); (2) the estimate handed from row to row
(consecutive stop ages have close amounts, so the gap search of `band.js` needs few runs); (3) the pot search
in B seeded from `potAtStop` and the previous step's careful amount, with a cap of 14 steps. What is never
cut: the number of futures in the final figure, or the £10 / £1,000 steps.

### 13.3 The test suite's time

`tests/v7/{saving,a,b,cross}` adds at most **150 seconds** to the `test` job on every push (measured on the
first green day; `.slow.test.js` files are excluded from `test:fast`). Per-push property runs: 8 per property
at 20 futures (`V7_PROP_FUTURES`), pairs at 20 futures with `env.rows: [stopAge]`; the range and choices in
full only on the fixtures and the 48 + 72 core cases. The whole `test` job stays under 8 minutes (limit 15);
`browser` under 12 minutes (limit 15). If the first measurement is over, cut in this order: property runs
(8 → 5), the core cases' full range (rows: named ± 1), never the fixtures, closed forms, round trips, the
trace check or the cross-question checks.

## 14. What runs when

### 14.1 Every push (`test.yml`)

| Job | Adds | Budget |
|---|---|---|
| `test` | `tests/v7/saving/**` (invariants, futures prefix, growth, closed forms, pay-in search, relief table); `tests/v7/a/**` and `b/**` (schema, closed forms, invariants over pairs + core + stop ages + found, properties at fixed seed, trace, fixtures, render, round trip, wording); `tests/v7/cross/questions.test.js`; the identity extensions; the rail | +150 s |
| `browser` | J4–J7 (Chromium 390 / 1440, J6 at 744), the crawl over the new states at four sizes, keyboard, 36 pictures (gate off until approved), sameness on about 30 cases in three engines | +4 min |

### 14.2 Every night (`nightly.yml`)

| Contents | Budget |
|---|---|
| Random cases from a fresh seed: 2,000 runs of each A and B property and of `checkAnswerA/B`, stopped at 12 minutes; the smallest failing input printed with its seed | 12 min |
| The luck check (6.5): four fixtures × five seeds at 1,000 futures, full range and choices | 4 min |
| The trace check on both pairs lists | 3 min |
| The date sweep on the four fixtures: 31 Dec, 1 Jan, 5 and 6 April 2027, 5 and 6 April **2028** (the rise to 57), the day before and after each person's birthday, the stop date itself and the day after (the state becomes "retired": the wording rules switch) — only the listed fields may move | 2 min |
| `speed.identity.slow.test.js` with the two new shapes at 1,000 futures | 3 min |
| `feedback.slow.test.js` for A | 2 min |
| Sameness: the full lists in three engines; J4 and J7 in WebKit at 390 and 744; J4 in Firefox | 10 min |
| **Total, with C's** | **under 50 minutes** (the workflow's limit rises from 40 to 60) |

### 14.3 Before the two slices are called done (once, by hand)

The planted faults of section 15, one at a time, each going red where expected; the owner's read of the
four fixtures; the gate of section 16.

## 15. Planted faults

| Planted fault | Expected to go red |
|---|---|
| Relief forgotten (`gross = own`) | SV1, S3, the relief table |
| Relief at 25% of own instead of 20% of gross (`own × 1.25` — the same, so this one is **not** a fault; listed so nobody plants it expecting red) | — |
| The £60,000 cap forgotten | SV5, S4, the relief table row 3 |
| The cap applied in today's prices instead of pounds of the day | SV9 |
| Employer % applied to the pay-in instead of pay | SV2, relief table row 2 |
| Pay-in continues after the stop | A13, S5, X1 (stop now would then pay in), the trace check |
| Pay-in stops a year early | S5 (the last row's age), SV1's sum |
| The saving mix used for the drawing years (or the reverse) | 3.3 with `savingRisk ≠ risk`; X1 |
| The start moved for a closed pension (C's rule used in A) | A1, AF4, A4-fire fixture, J7 |
| The pension drawn before 57 | I14 in the drawing rows, A10, AF4 |
| The futures depend on the pay-in or the stop age | 3.2, PA1/PA3 sooner or later, X1 |
| The range rows each on a fresh seed | A6 flickers, X4, sameness |
| The named age recomputed instead of taken from the range | A4 (byte-for-byte), X4 |
| Verdict thresholds swapped (`close` above 0.9) | A2, AF1/AF2, the fixtures' pinned verdicts |
| The verdict from the band instead of the spend | A3 with a spend between careful and middling, PA4 |
| One-more-year taken from a different row | A8 |
| The pot needed solved on the joined path instead of C's | 5.1 round trip through C |
| Pot needed rounded down instead of up | 5.1 (`potNeeded − 1,000` would still meet the target) |
| Confidence ignored | PB5, BF3, 3.5 |
| `payInNeeded` over the field's limit or over the cap | 3.5 |
| `joined` recomputed with a different spend | B4, X3 |
| A choice figure from the wrong inputs (`spend-less` from the named age's good case) | 5.2, BF1 |
| The percent box loses its place after each digit | J4 types one key at a time |
| "contribution", "on track", "bridge", "in 15 years" in a string | wording, R11, J7's banned list |
| "when you stop work" in the stop-now state | 10.3 retired rules, `answer-stop-now` render test |
| The ages table's row `k` shows row `k+1` | R13 |
| The ready mark set when the headline is final but the range is not | J4 (screen equals engine on the table) |
| An income that ends run by a replica that does not cover it | 3.6 |
| The prefix property broken by a change to the bootstrap | 3.2 |

## 16. The gate — for each of the two slices

1. **Both CI jobs green** on the commit, in CI.
2. **The C slice and the current app are untouched**: every C test green with no pinned file changed except
   those a listed engine extension moves (the identity test's new shapes, `fastEligible`), each named in the
   pull request; `planCorpus`, `ownerPlan.local`, `indexMarkup`, `releases`, the old-app walk unchanged.
3. **No rule fails**: `checkSaving`, `checkAnswerA` / `checkAnswerB` and every property report nothing on the
   pairs, the core, the stop-age cases, the found cases and the last night's random run; the exceptions files
   (`tests/v7/a/exceptions.md`, `b/exceptions.md`) empty or every line in the release note.
4. **The independent checks agree**: the closed forms exact; the relief table to the penny; the saving months
   and the drawing months recomputed from the trace; growth equal to the drawing engine's; the fast path equal
   to the reference on the two new shapes; A's bad-case row fed back through today's plan path within the
   stated share.
5. **The cross-question checks hold**: C equals A at stop now; B's pot needed round-trips through C; B's
   joined path equals A's row; the range row equals the named age.
6. **The four people reproduce** and the owner has approved their sentences, figures and the first pictures,
   having seen the screens on a real phone.
7. **The first answer is counted** per question (11.2), with the owner's stopwatch figure written down.
8. **The same answer in three browsers**, last night's full run green on this commit or the one before.
9. **V7 still cannot change a plan**: import rule green; locked fixture byte-identical after the crawl; no
   hook in the published build.
10. **Every word passes the list**, in the strings and on every drawn state, including the stop-now state
    under the retired rules and the date-sweep states after the stop date.
11. **Sizes written down**: the compressed size of questions A and B and of the worker, against
    `architecture.md` 3.8's budgets.

Not gates: coverage, simulated-person scores, reading-ease scores. One charter walk per persona before the
owner's review ("you are 45 with £120,000 and a letter saying your employer pays 5%; find out whether you
can stop at 60 and what to pay in"), notes read, not scored.

## 17. Files to create

**Source the tests assume** (for reference; each question's build brief owns the list)

| File | Purpose |
|---|---|
| `src/answers/shared/schemaParts.js` | `saverFields(who)`; the `percent` and `count` types; the `'given'` form of `when` in `validate.js` |
| `src/answers/shared/saving.js` | 1.3 |
| `src/answers/shared/joined.js` | `stopAt` |
| `src/answers/a/{schema,answer,sentences,toHousehold}.js`, `src/answers/b/{schema,answer,sentences,solve,toHousehold}.js` | The two questions |
| `src/answers/shared/toEngine.js`, `band.js`, `fastEngine.js` | Per-future pots; an income that ends; the shared precompute across rows |
| `src/v7/rail/a.js`, `rail/b.js`, `copy/a.js`, `copy/b.js`, `screens/a/*`, `screens/b/*`, `components/AgesTable.jsx`, `Choices.jsx`, `Verdict.jsx` | The shell side |

**Tests, no browser** (`tests/v7/`)

| File | Purpose |
|---|---|
| `saving/_saving.js` | Adapter: `savingYears`, `savingRows`, `payInFor`, `grossPayIn`, `stopAt`, `TEST_ENV` |
| `saving/invariants.js` | `checkSaving`, S1–S10 |
| `saving/futures.test.js` | 3.2: the prefix, independence from amounts, deterministic draws |
| `saving/growth.test.js` | 3.3 |
| `saving/closedForm.test.js` | SV1–SV12 |
| `saving/payIn.test.js` | 3.5 |
| `a/_a.js`, `b/_b.js` | Adapters |
| `a/schema.test.js`, `b/schema.test.js` | 2.4 |
| `a/invariants.js`, `b/invariants.js` | `checkAnswerA` (A1–A15), `checkAnswerB` (B1–B8) |
| `a/closedForm.test.js`, `b/closedForm.test.js` | AF1–AF10, BF1–BF6 |
| `a/trace.test.js` | 4.3 |
| `b/roundTrip.test.js`, `b/solve.test.js` | 5.1, 5.2 |
| `a/properties.test.js`, `b/properties.test.js` | PA1–PA13, PB1–PB8 |
| `cross/questions.test.js` | X1–X4 |
| `gen/dimensionsA.mjs`, `gen/dimensionsB.mjs`; `gen/build-cases.mjs` gains `--question` | 8.1, 8.2 |
| `a/cases.pairs.json`, `b/cases.pairs.json`, `a/found.cases.json`, `b/found.cases.json`, `a/exceptions.md`, `b/exceptions.md` | Committed lists; found cases; exceptions (start empty) |
| `a/pairs.test.js`, `b/pairs.test.js` | As C's |
| `oracles/fromTrace.mjs` (`recomputeSaving`), `oracles/hmrc-relief-2026-27.json`, `oracles/relief.test.js` | 7.1, 7.2 |
| `a/feedback.slow.test.js` | 7.3 |
| `c/speed.identity.test.js`, `c/speed.identity.slow.test.js` (extended) | 3.6 |
| `fixtures/a/A1-forty-five.json`, `A2-next-june.json`, `A3-too-late.json`, `A4-fire.json`; `fixtures/b/B1-forty-five.json`, `B2-too-late.json` | Section 9 |
| `a/fixtures.test.js`, `b/fixtures.test.js` | Pinned answers, approval, two time zones, luck check (nightly) |
| `states/a/*.json`, `states/b/*.json`; `states/build-states.mjs` (a `--question` flag) | 10.1 |
| `render/checkScreen.js` (R13–R16, the two scope rules), `a/render.test.js`, `b/render.test.js`, `a/roundTrip.test.js`, `b/roundTrip.test.js` (form round trip) | 10.2, 10.3 |
| `wording/wording.test.js` (the new files), `src/v7/copy/banned.js` (`on-track`, the countdown pattern in scope `all` for A and B) | 10.3 |
| `rail/rail.test.js` (L9–L11) | 10.4 |
| `styles/contrast.test.js` (the verdict tokens) | 11.3 |

**Browser** (`e2e/`)

| File | Purpose |
|---|---|
| `a-forty-five.spec.js` (J4), `a-next-june.spec.js` (J5), `b-too-late.spec.js` (J6), `a-fire.spec.js` (J7) | 11.1 |
| `helpers/answerInNode.js` (question id; `saving`), `helpers/app.js` (`fixtureTyping` for A and B; `partial` wait) | — |
| `crawl.spec.js`, `keyboard.spec.js`, `screens.spec.js` (+36), `sameness.spec.js` (+30 cases), `production.spec.js` | Extended |

**Set-up**

| File | Change |
|---|---|
| `playwright.config.js` | The new scripts in the size projects |
| `.github/workflows/nightly.yml` | `timeout-minutes: 60` |
| `RELEASING.md` | The stopwatch line per question; the real-phone look for A and B |
| `package.json` | `v7:cases` runs all three lists |

## 18. Order of writing, test first

1. `saving/_saving.js` with names stubbed; `saving/invariants.js`; `saving/futures.test.js` (green today for
   the prefix — a fact about `bootstrapPaths` — red for the rest); `saving/closedForm.test.js`;
   `oracles/hmrc-relief-2026-27.json` + `relief.test.js`. These define the saving engine before a line of it.
2. The saving engine until 1 is green; `saving/growth.test.js`; `saving/payIn.test.js`.
3. `schemaParts.js`, `SCHEMA_A`, `a/schema.test.js`; `a/invariants.js`; `a/closedForm.test.js`; the four
   fixtures' inputs and sentence drafts; `cross/questions.test.js` X1 (C equals A at stop now) — red until
   `stopAt` and `answerA` exist; the identity test's two new shapes (3.6).
4. `stopAt`, the adapter's per-future pots, `answerA` until 3 is green. Then `a/trace.test.js`, the A
   dimensions, `a/pairs.test.js`, `a/properties.test.js`. **Time the named age and the seven-row range on
   the first day** and set 13.2's figures.
5. `SCHEMA_B`, `b/schema.test.js`, `b/invariants.js`, `b/closedForm.test.js`, `b/roundTrip.test.js`,
   `b/solve.test.js`, X2–X3; then `potNeededFor`, `payInFor` (already there), `answerB` until green; the B
   dimensions, pairs, properties.
6. Named states, `checkScreen` R13–R16 and the scope rules, the words, the rail L9–L11; the screens until the
   render tests are green.
7. Playwright: J4 on the published build first; then J5–J7, the crawl, keyboard, sameness, pictures.
8. The owner on a real phone; first pictures approved; the nightly budget raised.
9. Planted faults; the owner's read of the fixtures; the gate — once for A (step 4 of the plan of plans),
   once for B (step 5). B's slice may ship with A's range already on the page; A's slice may ship without B.

## 19. Questions this plan needs answered

1. **Growth convention.** The saving engine uses the drawing engine's twelfth-root monthly factor (finding 4),
   so today's Accumulation tab's 2 / 5 / 8% lines are reproduced within 2%, not exactly. Bring the old tab
   into line (its own 6.x release note: figures move by up to 2%), or accept the tolerance until cutover?
2. **The start in A never moves** (1.4), unlike C. Confirm: a person who chooses 55 with a closed pension and no
   savings is told "no, nothing can be drawn until 57" and shown the first age that works, rather than having
   the answer quietly start at 57.
3. **The bond model's draws across the stop.** The shares and prices path is one market for every stop age.
   The drawing engine draws its own bond returns from a stream that starts with each run. Either the drawing
   run's stream continues the saving years' stream (the drawing engine's futures then differ from C's by the
   stream offset, and "C equals A at stop now" still holds because the offset is zero), or it restarts (the
   saving years and the drawing years of one future then use different draws for the same calendar month,
   which nobody sees but which is not one market). The plan tests only that the choice is deterministic and
   stated. Recommended: continue the stream.
4. **Higher-rate relief not counted** by default (a `claim-relief` warning instead), on the careful side.
   Or ask "do you claim it?" under more detail?
5. **The taper** above £200,000 of pay is warned about, not modelled. Confirm for the first answer.
6. **The default saving risk is balanced**, the same as the drawing risk. Many people saving at 45 hold more
   shares; "adventurous" as the saving default would change every headline. Which?
7. **The range**: seven rows centred on the named age (clipped to today's age and 70), or a fixed set
   (55 · 57 · 60 · 62 · 65 · 67 · 70) with the named age added? The tests take either through `env.rows`.
8. **The verdict's three words**: "Yes, at 60" / "It is close at 60" / "Not at 60 on these figures". And the
   thresholds: yes at 9 in 10, close from 5 in 10. Confirm or reword.
9. **B's confidence choices**: 9, 7 and 5 out of 10, default 9. Or only 9 in the first slice?
10. **"Next June"**: A asks a stop age; the person of P2 thinks in dates. Offer a month and year on the form
    (mapped to an age by the household model's `stopWork: { kind: 'date' }`), or ages only in this slice?
11. **Pay-in split for a couple** in B's `payInNeeded`: evenly, or in proportion to pay? The plan pins
    "evenly, said under what was assumed".
12. **Part-time and the £10,000 cap**: if someone works part-time after drawing from a pension and keeps
    paying in, the cap applies. The first slice stops pay-in at the stop age, so it never arises; the answer
    says so under what was assumed. Confirm that is enough for now.
13. **The nightly workflow's limit** rises from 40 to 60 minutes. Fine?
14. **May "on track" be banned** in favour of "on course"? The current Accumulation tab says "Am I on track?";
    the two must not both be on screen after cutover.
