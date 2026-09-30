# V7 step 4 — the build brief for questions A and B on the saving-years engine

**A — "When can I afford to stop work?"**  **B — "Am I saving enough, and what should I pay in?"** — built on one
new saving-years engine that runs on the same futures as the drawing-down years, beside the shipped question C, with
every test layer attached. Written 1 Oct 2026 against v6.17.0 (question C published unlinked at `/v7/`). Nothing
here is built.

This is the one document builders follow. It settles every point on which the four specification documents for A
and B disagree, and where any of them disagrees with what the C slice built. **Where this brief and another document
differ, this brief wins.** The others remain the detailed reference for the parts this brief points to:

| Document | Still the reference for |
|---|---|
| `step3-build-brief.md` | Everything question C does that A and B reuse: the layers, the state, the runner, the test seams, the C contracts |
| `saving-years-engine.md` | The measurement (section 6), the kernel algebra (1.6), the cost table (2.6), the relief rules kept for later (1.3) |
| `answer-A-and-B.md` | The reasoning behind the yardstick (0.4), the worked examples (1.12, 2.12 — placeholder figures), the chain algebra kept for the record (3.2) |
| `screens-A-B.md` | The drawings (3, 4, 6), the hand-over map (5), the language additions and the banned entries (9) |
| `test-plan-A-B.md` | Each test's assertions (3–7), the pairs dimensions (8), the persona fixtures (9), the browser journeys (11), CI budgets (13–14), planted faults (15) |
| `architecture.md`, `answer-C-and-household.md`, `rail-screens-language.md` | As the C brief says |

Contents: 1 the architecture in one page · 2 every conflict and its resolution · 3 the file tree · 4 the contracts ·
5 the work packages · 6 tests written first · 7 done means · 8 out of scope · 9 decisions taken for the owner.

Words: every user-facing string says "while you are saving", "the years before your State Pension", "stop work",
"pay in", "what goes in each month", "on course", "£70,000 short", "a bad case (the worst 1 in 10)". Never
accumulation, decumulation, bridge, plan year, contribution, projection, on track, coast, semi-retire. A person who
has stopped work is never shown a countdown; a saver is shown ages, never "in N years".

---

## 1. The architecture in one page

- **One future is one life.** Future `i` of seed `s` is `bootstrapPaths(marketSeed(i, s), T × 12)` from today to
  the end age, on question C's seed formula. C's futures are prefixes of the lives, so a stop at today's age is
  question C byte for byte, and every stop age in a range is a cut of the same thousand lives.
- **The saving years are a scalar recurrence.** Each pot (pension, savings) is held at a target mix and rebalanced
  monthly; payments in at today's prices rise with prices and go in at the start of the month; a charge comes off
  monthly. The pot at the stop date is exactly linear in the payment, `A_i + c × B_i`, so "what to pay in", "pay in
  until age N" and "if I stop paying in" are closed-form quantiles with no engine runs.
- **The drawing years are today's engine through C's adapter and fast path**, with three additions owned by V7:
  per-future starting pots, drivers read from the life at the stop month (the bond stream continues across the
  stop), and a pension that is **closed for its first L months** inside the one run its holder has — so stopping
  before 55/57 is paid from ISA and savings by the same run, and a run-out while the pension is closed is a real
  run-out. The start is never moved (unlike C).
- **One yardstick**: "lasted" = the share of lives in which the household take-home lasted to the end age. Careful
  = 9 in 10 (fails in at most `floor(n/10)` lives). Verdict: **yes** at 9 in 10, **close** at 3 in 4, **no** below.
  "A bad case" is the worst 1 in 10 everywhere.
- **Every number from a pure function**: `answerA(inputs, env)` and `answerB(inputs, env)` in `src/answers/{a,b}/`,
  with `SCHEMA_A`, `SCHEMA_B` beside them; sentences built there from the same numbers. The screen works out nothing.
- **The shell grows, it does not change shape**: two more questions on the rail, the same reducer, one new action
  for hand-overs (`draft/carry`) and one for a bigger answer on an optional step (`answer/extend`). C's two passes
  stay (100 futures → first, 1,000 → final); an optional step asks for one more pass at 1,000 with more detail.
- **Nothing is saved.** No sign-in, no Firebase. The import rule of the C brief stands.

```
lives.js ──► saving.js (kernel per person per stop age) ──► stopAt.js (per-future runner: toEngine + fastEngine + band)
                                                                   │
                        answerA / answerB (pure) ◄─────────────────┘
                              │ result (plain data)
   worker ◄── run.js ──► reducer ──► App(state) ──► screens/a, screens/b (Preact; no arithmetic)
```

---

## 2. Every conflict between the documents, resolved

"Engine" = `saving-years-engine.md`; "Answers" = `answer-A-and-B.md`; "Screens" = `screens-A-B.md`; "Tests" =
`test-plan-A-B.md`; "C" = the built slice and `step3-build-brief.md`.

### 2.1 The engine

| # | Conflict | Decided |
|---|---|---|
| 1 | The drawing years when a pension is closed at the stop: a chain of engine stages cut at each opening with pots carried and floors re-based (Answers), the existing separate savings run beside a closed pension (Engine, Tests), or something else | **A pension closed for its first `L` months inside the holder's one run** (`config.lockedMonths`, `config.lockedSchedule`): the replica draws nothing from the pension sleeves while closed, the run's own ISA pays the target as a savings-only run pays it, and the ordinary path takes over the month it opens. No chain, no separate savings run, no carried pots, one bond stream, one tax-free limit. The reference for the identity test is a two-stage chain of `simulate` (test-only), exact with an all-shares mix. C keeps its own rule (`startWhenPensionsOpen`); the locked run is built only under `enginePlan(…, { start: 'asGiven' })` |
| 2 | Rebalancing while saving: monthly to the target mix (Engine) or re-set once a year (Answers) | **Monthly** — it is what a default fund does, and it is what makes the pot linear in the payment |
| 3 | When the payment goes in: end of the month after growth (Engine 1.2, Answers 0.3) or start of the month before growth (Tests 1.1; and Engine's own closed forms CF-S2/S3 are annuity-due) | **Start of the month, before that month's growth.** The closed forms are annuity-due |
| 4 | Charges: 0.5% a year while saving, editable (Engine); none (Answers, Tests) | **0.5% a year while saving**, one field `charge` (0–2%) under more detail, taken monthly from every sleeve, listed. None in the drawing years, as C (pinned) |
| 5 | Bonds in the saving years: the engine's model from one life-wide stream (Engine), the engine's model re-seeded (Answers), "the same as the drawing engine would use" (Tests) | **One stream per life**, drawn once from `seededRng(engineSeed(i, seed))` month by month for all `T × 12` months; the saving phase reads months `0 … 12S − 1`, the drawing phase reads on from `12S`. At `S = 0` it is the engine's own stream. Stated in `basis.bondDraws: 'life'` |
| 6 | The cash rate in drawing year 0: the engine's rule (its own year's inflation) or the life's true previous year | **The true previous year** (`inflation[S − 1]`) when `S > 0`; the engine's rule at `S = 0`. Stated in `basis.cashRule` |
| 7 | Saving risk: household-level `saveRisk: same\|…` (Engine), `you.savingRisk` per person (Answers), `savingRisk` household-level (Screens, Tests) | **`savingRisk`, household-level, `cautious \| balanced \| adventurous`, default `balanced`**; the drawing mix is `risk` as C. The three mixes are `RISK_PRESETS` |
| 8 | The slide from the saving mix to the drawing mix: 10 years straight line (Engine); none mentioned (others) | **Kept, one constant `SLIDE_YEARS = 10`**, in effect only when `savingRisk ≠ risk`; no field. The assumed line says it |
| 9 | Savings (ISA) while saving: in the saving mix (Engine) or the engine's fixed 3% (Tests) | **In the saving mix**, no relief, its own kernel. In the drawing years the engine's fixed 3% stands (C's gap, listed `isa-fixed-growth`) |
| 10 | Grid: yearly (Engine, Answers) or the data's monthly moves | **Yearly**, the engine's convention, both phases. `basis.grid: 'yearly'`; not an assumed line |
| 11 | Pay-in meaning: own ÷ 0.8 + employer with relief method and salary (Engine, Tests); `payslip \| reliefAtSource` (Answers); one figure, what lands in the pension incl. employer and the tax top-up (Screens) | **What lands in the pension**: one short-form figure `payIn.total`; "Split it up" gives `payIn.own` and `payIn.employer` (their sum is the total). No grossing up, no salary, no relief method in this slice; assumed line `pay-in-as-given`. The allowance warnings apply to the total |
| 12 | Allowance rules: warnings on £60,000, £10,000 (after taking pension money), earnings, taper, ISA £20,000, higher-rate claim (Engine, Tests) | **`annual-allowance`** (total × 12 > £60,000) and **`mpaa`** (`alreadyDrawing` and total × 12 > £10,000) only; **`isa-allowance`** (savingsIn × 12 > £20,000). The rest need a salary: later |
| 13 | "The pay-in that gets there": the smallest at which the whole life lasted in 9 in 10 (Answers); the smallest that reaches the pot needed in 9 in 10 lives (Engine, Screens, Tests) | **Reaches the number in 9 in 10 lives** (closed form). It is the literal reading of the owner's "the monthly contribution that gets there", it is what the screen says ("reached £470,000 by 60 in 9 futures out of 10"), and it costs nothing. The whole-life count (one run per life: paying in as now, then spending the target) is computed and shown once as a check line |
| 14 | Confidence: `nineInTen\|fourInFive\|threeInFour` (Engine), `9in10\|3in4\|2in3` (Answers), `9\|7\|5` (Tests), none (Screens) | **`confidence: nineInTen \| threeInFour`**, default `nineInTen`, under more detail (B only). `payIn.at` carries both figures whatever is chosen (free) |
| 15 | The pot needed: bisection on the pot with one run per life per step (Engine) or a band solve per step (Answers, Tests) | **One verdict per step** (does the target last in ≥ 9 in 10 lives with pot `P`): ≤ 14 steps of £1,000, ≈ 0.25 s at 1,000 lives. Three numbers (careful, middling, good) by the same search at the three fail counts |
| 16 | Verdict thresholds: close from 3 in 4 (Engine, Answers), 7 in 10 (Screens), 5 in 10 (Tests); words Marginal / Close / "It is close" | **Counts, not shares**: `yes` when fails ≤ `floor(n/10)`; `close` when fails ≤ `floor(n/4)`; `no` otherwise. Words: "Yes — you could stop at 60" / "Close — stopping at 60 is tight" / "Not at 60 on these figures". Ids `yes \| close \| no` |
| 17 | A couple stopping in different years (Engine 3.6, Answers, Screens "more detail") | **Both stop in the same year** in this slice (`both-stop-together`). `partner.stop.*` is not on the form |
| 18 | Which pot the pot-needed search moves for a couple | The household's **pension** total, split between the two in the proportion of their middling pots at the stop age; each life's ISA as projected |

### 2.2 The inputs

| # | Conflict | Decided |
|---|---|---|
| 19 | Person block shared with C: literal copy (Engine), `saverFields(who)` in `schemaParts.js` (Tests), "as SCHEMA_C" (Answers) | **`src/answers/shared/schemaParts.js`**: `personFields(who)` (C's block by value; a test asserts it deep-equals `SCHEMA_C`'s), `saverFields(who, opts)` (the pay-in block), `moreFields()`. `SCHEMA_C` is not edited |
| 20 | Stop: `stop.kind: age\|range\|now` + `stop.age` (Answers); `stop.kind: age\|date\|ages` with month/year (Screens); `stopAge` (Engine, Tests) | **`stop.kind: 'age' \| 'ages'`** and **`stop.age`** (A); **`stop.age`** only (B). No month, no "now" (stopping now = `stop.age` equal to today's age) |
| 21 | Spending: `spend.perMonth` / `spend.level: minimum…` (Answers), `spend.amount` / `basic…` (Screens), `spend.monthly` and B's `target.*` (Tests) | **`spend.kind: 'amount' \| 'level'`, `spend.amount`, `spend.level: 'minimum' \| 'moderate' \| 'comfortable'`** — the same paths in A and B (B's label differs, the path does not). Levels are `PLSA_2024` ÷ 12, single or couple by `household` |
| 22 | Part-time: `partTime.monthly` (Engine), `you.work.perYear/untilAge` (Answers), `partTime.yearly/years` (Screens, Tests) | **`partTime.has`, `partTime.yearly` (before tax, a year), `partTime.years` (1–15)**, the first person only, from the stop age |
| 23 | Savings on the short form (A, Screens) or under more detail (C, B) | A: `savings` in group `you` (on the short form, default 0); B: group `more`. Same path as C. `savingsIn` (a month, into ISAs and savings) under more detail in both |
| 24 | Age limits: 25–70 / stop 50–70 (Tests) or 18–100 / stop to 75 (others) | `you.age` 18–100 (C's field); `stop.age` 18–75; A: `stop.age ≥ you.age`; B: `stop.age > you.age` |
| 25 | Field types: `percent`, `count`, `when: 'given'` (Tests) | `percent` (for `charge`) and `count` (for `partTime.years`) are added to `validate.js`. No `'given'` form of `when` (no salary field) |
| 26 | B requires a pay-in (Screens, Answers) while A defaults it to 0 | `saverFields(who, { payInRequired: true })` for B. The deep-equality test of shared fields exempts `required`/`default` on `you.payIn.total` |
| 27 | `alreadyDrawing` (Answers) / `alreadyTakingPension` (Engine) / `takenPension` (Tests) | **`you.alreadyDrawing`** (and `partner.`), yes/no, more detail, default false; feeds the `mpaa` warning only |
| 28 | The pay-in ceiling: £5,000 (Answers) or £10,000 (Screens) a month | **£10,000** = the field's maximum. Pot search: £1,000 steps up to £5,000,000 |

### 2.3 The results

| # | Conflict | Decided |
|---|---|---|
| 29 | Pot spread names: `bad/middling/good` (Answers), `careful/middling/good` (Screens, Tests) | **`careful / middling / good`** for pots as for amounts: positions `floor(n/10)`, `floor(n/2)`, `n − ceil(n/10)` of the sorted values (`bandIndexes`) |
| 30 | A's rows: `range[]` of `StopAge` (Answers), `ages[]` of `AgeRow` (Engine), `ages[]` short rows (Screens), `ages[]` with a `band` block (Tests) | **`ages: AgeRow[]`** (4.7) — every row a full band block plus verdict, pot at stop and one-more-year; `shown` is the row the headline is about and deep-equals its `ages[]` entry |
| 31 | The rows: every whole age to State Pension age ≤ 20 (Answers); ~14 from 55 (Engine); seven by rule (Screens); `env.rows` (Tests) | **`agesToShow(inputs, env)`, a rule in `SCHEMA_A`**: `detail: 'chart'` → the named age, two before, two after, five on, the State Pension age (and for "show me ages": today's age, 55, 57, 60, 62, 65, 67, the State Pension age, and the earliest age that worked), clipped to `[you.age, 75]`, sorted, no repeats; `detail: 'all'` → every whole age from `max(you.age, 50)` to 75, plus today's age. Tests may pass `env.ages` to narrow it |
| 32 | The verdict at the top: `verdict` incl. `'ages'`/`'none'` (Screens), `named.verdict` (Answers, Tests) | **`headline: { kind: 'named' \| 'earliest' \| 'noneWorked' \| 'nothing', age, verdict, lasted, runOutAge }`** and **`shown: AgeRow`**; every row has its own `verdict` |
| 33 | Phases: at the target in the bad-case future (Screens) or `breakdownAt` at the target (Answers) | **`breakdownAt(plan, spend × 12)`** — C's deterministic phases at today's prices, with `pensionOpen: false` on a closed period and a `fromWork` column. `savingsNeeded` (the closed periods' savings draw, summed) comes from them. `savingsLeft` (needs one future's trace) is dropped |
| 34 | B's `number`: one pot (Answers, Engine) or three (Screens) | **`number: { careful, middling, good }`** — the pot at which the target is the careful / middling / good amount; the headline is `number.careful` |
| 35 | B's chance: `onCourse.lasted` = pot reaches the number (Tests, Screens) or the whole life lasted (Answers) | **`chance.lasted`** = share of lives whose projected pension total at the stop ≥ `number.careful`; `onCourse = fails ≤ floor(n/10)`. **`wholeLife.lasted`** = the whole-life count, shown once |
| 36 | Levers: five with `helps` and later2/later4/plus100… (Answers, Engine) or five named `stopLater/payMore/spendLess/moreRisk/accept` (Screens) | **Screens' five**, each `null` when it cannot be found or does not apply; `stopLater` is the least later age (≤ stop + 10, ≤ 75) at which today's pay-in reaches that age's number in 9 in 10; `moreRisk` says plainly when it does not help |
| 37 | B's step 3: a grid of stop age × pay-in (Screens) or the levers re-solved as `choices` (Answers) | **The grid** (`grid`, `detail: 'grid'`): rows by `gridToShow` (the stop age, two before, five after, within 75), columns today's pay-in and four steps of £100 (£50 under £500); each cell a reach-count from the kernel — no runs beyond the per-row number |
| 38 | B before the pension opens: `isaForGap` (Answers), `b.outside`/`payIn.outside` (Screens) | **`outside: { amount, untilAge }`** and **`payIn.outside`**: the savings the closed years draw (from the phases, today's prices), and the monthly saving into ISAs that reaches it in 9 in 10 lives (the savings kernel, closed form). The pension search then runs with each life's ISA at the stop no lower than `outside.amount` |
| 39 | Rounding pots: nearest £1,000 with "about" | Pots are held to the pound; sentences use part kind `'pot'` → `format.pot(n)` = nearest £1,000 with the £ sign; `number.*` is a whole £1,000 by construction (the least that works) |
| 40 | `Sentence`, `Assumed`, `Warning`, `Phase`, `basis`, `units`: as C | As C, unchanged. `Phase` gains `fromWork`, `pensionOpen` and `shown.fromWork` |

### 2.4 The screens and the shell

| # | Conflict | Decided |
|---|---|---|
| 41 | A's steps: six (Rail 1.5, Tests) or four (Screens) | **Four**: `numbers`, `answer`, `ages`, `keep`. One-more-year, the years before the State Pension and part-time are parts of the answer screen |
| 42 | B's steps: five (Rail 1.5, Tests) or four (Screens) | **Four**: `numbers`, `answer`, `choices`, `keep` |
| 43 | The runner: three passes with per-row status (Engine), named-then-rows with `env.ages` (Answers), `partial` (Tests) | **C's two passes** (100 → `answer/first`, 1,000 → `answer/final`) for the answer step, both at the step's default `detail`; **one more pass** at 1,000 when an optional step needs more (`ages` → `'all'`, `choices` → `'grid'`): `answer/extend` then `answer/final`. `#app[data-answer="partial"]` while extending |
| 44 | The retired screen id: `data-screen="a.retired"` (Screens) | The route stays a step, so `data-screen` stays `"a.answer"` (or whichever step) and the root carries **`data-view="retired"`**. The rule is a pure reader `alreadyStopped(inputs, today)` in `schemaParts.js` |
| 45 | Hand-over map paths (Screens 5) | As Screens 5 with this brief's paths: `take` → `spend.amount` (+ `spend.kind: 'amount'`), `start.age` → `stop.age` (+ `stop.kind: 'age'`), `{ result: 'shown.potAtStop.middling' }` → `you.pot` (A → C), `{ result: 'number.careful' }` → `you.pot` (B → C) |
| 46 | C's "What next?" links open `Soon` for A and B | They carry and open A's or B's numbers step. C's named state `soon-a` becomes `soon-d`; C's pictures are re-approved |
| 47 | Banned list additions (Screens 9.3, 22 entries; Tests' countdown-anywhere rule) | All 22, plus a `countdown-any` entry (`\b\d+ (more )?(years?\|months?) (to go\|until\|till\|before\|from now)\b`) in a new scope **`saver`**, applied to every A and B state. The `retired` scope is applied to A and B when `stop.age` equals `you.age` |
| 48 | Test ids for the levers, chart, grid (Screens 8) | As Screens 8 (4.13) |

### 2.5 Tests

| # | Conflict | Decided |
|---|---|---|
| 49 | Files: `tests/v7/shared/saving.test.js` (Engine) or `tests/v7/saving/*`, `a/*`, `b/*`, `cross/*` (Tests) | **Tests' layout** (section 3) |
| 50 | Identity of the drawing years with the engine | Three assertions: (i) `S = 0`, real futures: A's stop-now row equals `answerC` byte for byte (M-A1 / X1); (ii) any `S`, all-shares `env.mix`: each life's `{ failed, failMonth }` equals `simulate` on the same config with that life's pots and `annualNominal(life, 12S, D)`; (iii) a locked run equals the two-stage `simulate` chain (test-only), all-shares mix, exact. With bonds and `S > 0` the streams differ by design and only determinism is asserted |
| 51 | Growth convention of today's Accumulation tab (Tests finding 4) | The old tab is not touched; SV4 is within 2% and says why |
| 52 | Verdict on the fixtures: exact monotonicity across ages (Tests A6) or a finding (Engine 5.3, Answers M-A4) | A **finding** on random cases (`exceptions.md`), asserted to one step (£10, one life) on the fixtures at 1,000 lives |

---

## 3. The file tree

`P0` = the lead's stubs (section 5). Package letters as in section 5. Nothing outside this tree is created.

```
src/answers/
  shared/
    schemaParts.js               P0   personFields(who), saverFields(who, opts), moreFields(), agesToShow, gridToShow, alreadyStopped
    lives.js                     P1   livesList(count, T, env), lifeReturns(i, T, env), bondStream(life)
    saving.js                    P1   savingPlan, savingKernel, potsAtStop, payInFor, reachCount, savingRows
    stopAt.js                    P1   stopAtPlan, createStopRunner, verdictAt, bandAt, potNeeded, phasesAt, monthlyAt
    chain.mjs                    —    (tests only; see tests/v7/saving/chain.mjs)
  a/
    schema.js                    P0   SCHEMA_A (complete)
    toHousehold.js               P2
    answer.js                    P0→P2  stub first (tests/v7/stubs/a-result.json), then real
    sentences.js                 P2
  b/
    schema.js                    P0   SCHEMA_B (complete)
    toHousehold.js               P3
    answer.js                    P0→P3  stub first, then real
    sentences.js                 P3

src/v7/
  rail/a.js  rail/b.js           P0   QUESTION_A, NEXT_A, QUESTION_B, NEXT_B (4.12)
  state/carry.js                 P0   CARRY (data)
  screens/a/NumbersScreen.jsx  AnswerScreen.jsx  AgesScreen.jsx                     P5
  screens/b/NumbersScreen.jsx  AnswerScreen.jsx  ChoicesScreen.jsx                  P5
  components/Verdict.jsx  AgesChart.jsx  OutOfTenBar.jsx  Pots.jsx  Levers.jsx  Grid.jsx  PayInSplit.jsx  Carried.jsx  Retired.jsx   P5
  copy/a.js  copy/b.js           P5

tests/v7/
  stubs/a-result.json  b-result.json                       P0   hand-made AnswerA / AnswerB of the contract's shape
  saving/_saving.js  a/_a.js  b/_b.js                      P0   the adapters (the only test files that know real paths)
  a/schema.test.js  b/schema.test.js  shared/schemaParts.test.js   P0
  saving/invariants.js  futures.test.js  growth.test.js  closedForm.test.js  kernel.test.js  payIn.test.js
  saving/stopAt.test.js  saving/locked.test.js  saving/chain.mjs                                   P1
  c/identity.js  c/speed.identity.test.js  c/speed.identity.slow.test.js  (extended)               P1
  a/invariants.js  closedForm.test.js  trace.test.js  properties.test.js  metamorphic.test.js  pairs.test.js
  a/fixtures.test.js  feedback.slow.test.js  cases.pairs.json  found.cases.json  exceptions.md     P2
  fixtures/a/A1-stop-soon.json  A2-couple-before-57.json  A3-forced-out.json  A4-from-savings.json  P2
  gen/dimensionsA.mjs  oracles/fromTrace.mjs (recomputeSaving)                                    P2
  b/invariants.js  closedForm.test.js  roundTrip.test.js  solve.test.js  properties.test.js  metamorphic.test.js
  b/pairs.test.js  fixtures.test.js  cases.pairs.json  found.cases.json  exceptions.md             P3
  fixtures/b/B1-my-number.json  B2-coast.json  B3-late-start.json  B4-young.json  B5-couple.json   P3
  gen/dimensionsB.mjs                                                                              P3
  shell/carry.test.js  shell/extend.test.js  (reduce/select/run/routes tests extended)  rail/rail.test.js (L9–L11)   P4
  render/checkScreen.js (R13–R16, scopes)  a/render.test.js  b/render.test.js  a/roundTrip.test.js  b/roundTrip.test.js
  wording/wording.test.js  styles/contrast.test.js  states/a/*.json  states/b/*.json  states/build-states.mjs        P5
  cross/questions.test.js  e2eRules.test.js                                                        P6

e2e/  a-stop-soon.spec.js  a-couple.spec.js  a-from-savings.spec.js  b-my-number.spec.js  b-coast.spec.js
      crawl / keyboard / screens / sameness / production / old-app-unchanged (extended)  helpers/*              P6
.github/workflows/{test,nightly,screenshots}.yml  playwright.config.js  RELEASING.md                                P6
```

**Existing files edited, and by whom — nobody else touches them**

| File | Package | Change |
|---|---|---|
| `src/answers/shared/validate.js` | P0 | types `percent` (a number with up to one decimal; "%" and spaces accepted) and `count` (a whole number); `checkRules` gains A's and B's rule ids (4.1) |
| `src/answers/shared/rules.js` | P0 | 4.2's constants |
| `src/answers/shared/contract.js` | P0 | JSDoc: `SavingOutcome`, `AgeRow`, `AnswerA`, `AnswerB`, `SaveRow`, the `Phase` additions, `Env` additions |
| `src/answers/shared/format.js` | P0 | `pot(n)` (nearest £1,000), part kind `'pot'`; `outOfTen` unchanged |
| `src/answers/index.js` | P0 | `ANSWERS.a`, `ANSWERS.b` (stubs, then real by re-export — the file itself does not change again) |
| `src/v7/rail/questions.js` | P0 | `a`, `b` become `built: true`; `BUILT` gains both |
| `src/v7/state/actions.js`, `state/initial.js` | P0 | `DRAFT_CARRY`, `ANSWER_EXTEND`; drafts and answers for `a`, `b`; `answers[q].detail`, `.extending`; `OPENABLE` gains `split`, `partTime`, `pots`, `levers`, `chart` |
| `src/answers/shared/household.js` | P1 | `Person.saving`, `otherIncome` kind `'work'` honoured, `HOUSEHOLD_LIMITS` additions, `expandHousehold` defaults (4.10). `startWhenPensionsOpen` untouched |
| `src/answers/shared/toEngine.js` | P1 | `enginePlan(household, env, opts)` with `start: 'asGiven'` and `pots: 'perFuture'`; the locked run; part-time in the periods; `configsAt(plan, H, pots?)`; `breakdownAt` gains `fromWork`, `pensionOpen` (4.5) |
| `src/answers/shared/fastEngine.js` | P1 | `prepareFutureFrom(life, offsetMonths, years, opts)`, `createFastRunner(plan, futures, { potsFor, driversFor })`, locked months in `runFast`, `fastEligible` accepts `extraIncomes[].endYear`, a finite `isaReturn`, `lockedMonths` (4.6) |
| `src/answers/shared/band.js` | P1 | `createBandSolver(plan, futures, { …, configsFor })`; nothing else |
| `src/answers/shared/futures.js` | — | **not edited** (`lives.js` imports `marketSeed`, `engineSeed`) |
| `src/v7/rail/index.js`, `state/select.js`, `state/reduce.js`, `effects/run.js`, `effects/workerClient.js`, `testing/hooks.js` | P4 | 4.11 |
| `src/v7/screens/index.js`, `App.jsx`, `components/index.js`, `components/{Field,TryAChange,Assumed,MadeOf,Rail}.jsx`, `screens/c/AnswerScreen.jsx` (the "What next?" links), `copy/common.js`, `copy/banned.js`, `styles/*` | P5 | 4.13; the 22 + 1 banned entries and the `saver` scope |
| `tests/v7/states/c/soon-a.json` → `soon-d.json`, C's pictures | P5 | conflict 46 |
| `package.json` | P6 | `v7:cases` runs the three lists; nothing else |
| `src/answers/c/*`, `src/services/*`, `src/strategies/*`, `src/workers/*`, `src/storage/*`, `src/firebase/*`, `src/ui/*`, `index.html` | — | **not edited** |

---

## 4. The contracts

### 4.1 The input lists

```js
// src/answers/shared/schemaParts.js — no words. Labels, help, errors: src/v7/copy/{a,b}.js.
export function personFields(who) {}      // C's block for `who`: age, pot, statePension.kind/.yearly, finalSalary.has/.yearly/.fromAge
                                          // (the partner's carry when: { household: 'couple' }; partner.pot default 0; partner.age required)
export function saverFields(who, { payInRequired = false } = {}) {
  const w = who === 'partner' ? { household: 'couple' } : {};
  return [
    { path: `${who}.payIn.kind`,     type: 'choice', options: ['total', 'split'], default: 'total', when: { ...w }, group: who },
    { path: `${who}.payIn.total`,    type: 'money', min: 0, max: 10_000, ...(payInRequired ? { required: true } : { default: 0 }),
      when: { ...w, [`${who}.payIn.kind`]: 'total' }, group: who, boundaries: [0, 1, 100, 500, 700, 1_500, 5_000, 10_000] },
    { path: `${who}.payIn.own`,      type: 'money', min: 0, max: 10_000, required: true, when: { ...w, [`${who}.payIn.kind`]: 'split' }, group: who,
      boundaries: [0, 1, 250, 5_000, 10_000] },
    { path: `${who}.payIn.employer`, type: 'money', min: 0, max: 10_000, required: true, when: { ...w, [`${who}.payIn.kind`]: 'split' }, group: who,
      boundaries: [0, 1, 250, 5_000, 10_000] },
    { path: `${who}.alreadyDrawing`, type: 'yesNo', default: false, when: { ...w }, group: 'more' }
  ];
}
export function moreFields() {
  return [
    { path: 'savingsIn',  type: 'money', min: 0, max: 10_000, default: 0, group: 'more', boundaries: [0, 1, 500, 1_667, 10_000] },   // a month, into ISAs and savings
    { path: 'savingRisk', type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'risk',       type: 'choice', options: ['cautious', 'balanced', 'adventurous'], default: 'balanced', group: 'more' },
    { path: 'charge',     type: 'percent', min: 0, max: 2, default: 0.5, group: 'more', boundaries: [0, 0.5, 1, 2] },                 // a year, while saving
    { path: 'endAge',     type: 'age', min: 75, max: 105, default: 95, group: 'more', boundaries: [75, 95, 100, 105] }
  ];
}
export const SPEND_FIELDS = [
  { path: 'spend.kind',   type: 'choice', options: ['amount', 'level'], default: 'amount', group: 'spend' },
  { path: 'spend.amount', type: 'money', min: 1, max: 50_000, required: true, when: { 'spend.kind': 'amount' }, group: 'spend',
    boundaries: [1, 500, 1_200, 1_867, 2_608, 3_592, 4_917, 10_000, 50_000] },                                   // PLSA 2024 ÷ 12
  { path: 'spend.level',  type: 'choice', options: ['minimum', 'moderate', 'comfortable'], required: true, when: { 'spend.kind': 'level' }, group: 'spend' }
];
/** The stop ages a result carries (conflict 31). Pure; returns whole ages, sorted, no repeats, within [you.age, 75]. */
export function agesToShow(inputs, env, detail /* 'chart' | 'all' */, earliestYes /* number|null, 'ages' only */) {}
/** The grid rows (stop ages) and columns (pay-in totals) for B's choices step (conflict 37). */
export function gridToShow(inputs, env) {}       // → { ages: number[], payIns: number[] }
/** True when the draft describes someone who has stopped: stop.age ≤ you.age and you.age ≥ their State Pension age (birthday taken as today). */
export function alreadyStopped(inputs, today) {}
```

```js
// src/answers/a/schema.js
export const SCHEMA_A = {
  id: 'a',
  fields: [
    { path: 'household', type: 'choice', options: ['single', 'couple'], default: 'single', group: 'who' },
    ...personFields('you'), ...saverFields('you'),
    { path: 'savings', type: 'money', min: 0, max: 10_000_000, default: 0, group: 'you', boundaries: [0, 1, 60_000, 150_000, 10_000_000] },
    { path: 'stop.kind', type: 'choice', options: ['age', 'ages'], default: 'age', group: 'stop' },
    { path: 'stop.age',  type: 'age', min: 18, max: 75, required: true, when: { 'stop.kind': 'age' }, group: 'stop',
      boundaries: [18, 50, 52, 53, 54, 55, 56, 57, 58, 60, 62, 65, 66, 67, 68, 75] },
    ...SPEND_FIELDS,
    { path: 'partTime.has',    type: 'yesNo', default: false, group: 'work' },
    { path: 'partTime.yearly', type: 'money', min: 1, max: 200_000, required: true, when: { 'partTime.has': true }, group: 'work',
      boundaries: [1, 12_000, 12_570, 12_571, 30_000, 50_270, 200_000] },
    { path: 'partTime.years',  type: 'count', min: 1, max: 15, required: true, when: { 'partTime.has': true }, group: 'work', boundaries: [1, 2, 3, 5, 10, 15] },
    ...personFields('partner'), ...saverFields('partner'),
    ...moreFields()
  ],
  rules: [
    { id: 'stop-not-before-now', fields: ['stop.age', 'you.age'] },   // stop.age ≥ you.age
    { id: 'end-after-stop',      fields: ['endAge'] }                  // endAge > the younger person's age at the stop
  ],
  agesToShow, gridToShow: null
};
// src/answers/b/schema.js — the same with: saverFields('you', { payInRequired: true }); no stop.kind (stop.age required, group 'stop');
// no partTime.*; savings in group 'more'; plus
//   { path: 'confidence', type: 'choice', options: ['nineInTen', 'threeInFour'], default: 'nineInTen', group: 'more' }
// rules: { id: 'stop-after-now', fields: ['stop.age', 'you.age'] } (stop.age > you.age), 'end-after-stop'. gridToShow set, agesToShow null.
```

Counted: a single person on A types **four** things (`you.age`, `you.pot`, `stop.age`, `spend.amount`), three with a
level; on B **five** (`you.payIn.total` too), four with a level. A couple adds `partner.age`. The limit is five; a test
counts the required fields that apply (the partner's age is counted separately, as C counts).

Checked inputs are the nested object with defaults filled and fields that do not apply removed, as C:

```js
{ household: 'single', you: { age: 50, pot: 250000, payIn: { kind: 'total', total: 600 }, alreadyDrawing: false,
    statePension: { kind: 'full' }, finalSalary: { has: false } },
  savings: 40000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2000 }, partTime: { has: false },
  savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95 }
```

### 4.2 Rules — `src/answers/shared/rules.js` additions

```js
RULES.annualAllowance = 60000;            // asserted equal to ACCUMULATION_RULES.ANNUAL_ALLOWANCE while that file exists
RULES.moneyPurchaseAllowance = 10000;     // = ACCUMULATION_RULES.MPAA
RULES.isaAllowance = 20000;
RULES.largePot = 1073100;                 // = ACCUMULATION_RULES.LSA_POT_THRESHOLD
RULES.plsa = { single: { minimum: 14400, moderate: 31300, comfortable: 43100 }, couple: { minimum: 22400, moderate: 43100, comfortable: 59000 } };
                                          // asserted equal to BudgetModel.js PLSA_2024; the yearly update checklist gains them
RULES.stopAgeMax = 75;
export const SAVING = { charge: 0.005, slideYears: 10, payInCeiling: 10000, potStep: 1000, potMax: 5_000_000, laterYears: 10 };
export const VERDICT = { yes: 0.10, close: 0.25 };   // the share of lives that may fail: yes = floor(n × 0.10), close = floor(n × 0.25)
export const verdictOf = (fails, n) => (fails <= Math.floor(n * VERDICT.yes) ? 'yes' : fails <= Math.floor(n * VERDICT.close) ? 'close' : 'no');
```

### 4.3 The saving years — `src/answers/shared/saving.js`

Pure, clock-free, no `Math.random`. One person, one life, `S` whole years, month by month, on the engine's yearly
grid: `equity[y]`, `inflation[y]` from the life; `P(0) = 1`, `P(y) = P(y − 1) × (1 + inflation[y])`; the bond factor
of month `m` from the life's stream; `cash(y) = max(0, inflation[y − 1] − 1%)` (`inflation[0]` when `y = 0`);
`monthly(r) = (1 + max(−0.99, r))^(1/12)`; `chargeM = (1 − charge)^(1/12)`.

```
sleeves E, B, K = pot × w(0)                          w(y): the target mix of year y (4.3.1)
for y in 0 … S−1, m in 0 … 11:
    E += c × P(y) × wE(y);  B += c × P(y) × wB(y);  K += c × P(y) × wK(y)      the month's payment, at today's prices rising with prices
    E ×= monthly(equity[y]) × chargeM;  B ×= bond[12y + m] × chargeM;  K ×= monthly(cash(y)) × chargeM
    E, B, K = (E + B + K) × w(y)                                                 rebalanced to the year's mix
potAtStop (today's prices) = (E + B + K) / P(S)
```

Because the weights do not depend on the pot, the month multiplies the whole pot by
`f(m) = (wE × monthly(equity) + wB × bond[m] + wK × monthly(cash)) × chargeM`, so
`pot_i(c) = A_i + c × B_i` with `A_i = pot × F(0 → 12S) / P(S)` and `B_i = Σ_m P(y(m)) × F(m → 12S) / P(S)`,
`F(u → v) = Π_{u ≤ m < v} f(m)`. Per-year `b_{i,y}` (the value at the stop of £1 a month paid in year `y` only)
gives every payment pattern as a weighted sum. The **kernel** of a person at a stop age is
`{ A: Float64Array(n), b: Float64Array(n × S), priceAtStop: Float64Array(n) }` and never reaches a result.

**4.3.1 The mix.** `w(y)` is the saving mix (`RISK_PRESETS[savingRisk]`) for `y < S − SLIDE_YEARS`, then a straight
line to the drawing mix (`RISK_PRESETS[risk]`) reaching it at `y = S`; with fewer than `SLIDE_YEARS` years the slide
starts at `y = 0`. When the two levels are equal there is no slide. Tests may pass `env.savingMix` and `env.mix`
(exact mixes) as C's closed forms do.

**4.3.2 Signatures**

```js
savingPlan(household, stopAge, env)                       // → { S, people: [ { who, pot, savings, payIn: { total, savings }, until: S } ], mixByYear, chargeM }
savingKernel(plan, person, lives)                         // → { A, b, priceAtStop } for the pension; the same function for savings with payIn.savings
potsAtStop(plan, lives)                                   // → { byLife: [ { you: { pension, savings }, partner? } ], spread: { pension, savings, total } }  (careful/middling/good by bandIndexes)
payInFor(kernel, target, share)                           // → the least monthly total (whole £10, up) reaching `target` in a share ≥ `share` of lives: the quantile of c_i = (target − A_i) / B_i; 0 when A_i ≥ target there; null above SAVING.payInCeiling
reachCount(kernel, c, target)                             // → the number of lives with A_i + c × B_i ≥ target
savingRows(plan, person, life)                            // → SaveRow[] (trace): { who, m, age, potStart, paidIn: { total, savings }, growth, charge, potEnd, savingsStart, savingsIn, savingsEnd, priceIndex }
```

`S = stopAge − you.age` for both people (they stop in the same year); a stop at today's age has `S = 0` and every
kernel is `{ A: pot, b: [], priceAtStop: 1 }`.

**4.3.3 Closed forms the engine must satisfy** (`env.futureReturns`, `env.savingMix`, `charge` set by the field):

| Case | Expected |
|---|---|
| CF-S1 | 0% on everything, flat prices, charge 0: pot at the stop `= P + 12 × S × c` to 1p |
| CF-S2 | as S1 with charge `q`: `P × Q^(12S) + c × Q × (Q^(12S) − 1) / (Q − 1)`, `Q = (1 − q)^(1/12)` |
| CF-S3 | shares `r` every year, flat prices, all shares, charge 0: `P × q^(12S) + c × q × (q^(12S) − 1) / (q − 1)`, `q = (1 + r)^(1/12)` (annuity-due), for `S ∈ {1, 15, 40}`, `P ∈ {0, 120000}`, `c ∈ {0, 687.5}`, `r ∈ {2%, 5%, 8%}` |
| CF-S4 | as S3 with prices `π` a year: the pot in today's prices equals S3 at the real rate `r′ = (1 + r) / (1 + π) − 1`, within 1p |
| CF-S5 | shares 0, cash at its floor: the slide changes nothing |
| CF-S6 | `A_i + c × B_i` equals the three-sleeve loop to 1e-9 relative for random `c`, mixes, charges, slides; `Σ_y b_{i,y} = B_i` |
| CF-S7 | `payInFor(kernel, A_i + 400 × B_i, 1) === 400` on one flat life; `+ 1` → `410` |
| CF-S8 | today's Accumulation tab: within 2% of `projectAccumulation(...)`'s `potLow/Mid/High` at 2/5/8% with prices at 2.5%, charge 0, and the message states the two conventions |
| CF-S9 | savings: `savingsIn` £500 on S1 gives savings `= savings + 500 × 12S`; a couple: each person's pot as S1, the household twice it |

### 4.4 Lives — `src/answers/shared/lives.js`

```js
lifeReturns(i, T, env)          // { equity: { [y] }, inflation: { [y] } } for years 0 … T−1: annualNominal(bootstrapPaths(marketSeed(i, seed), T × 12), 0, T); env.futureReturns(i, T) replaces it (tests)
livesList(count, T, env)        // [ { id, returns, seed: engineSeed(i, seed), stream: Float64Array(T × 12) } ] — the stream drawn once (bondStream) in month order with the engine's calculateBondReturn (fastEngine.js's copy) on (inflation[y], equity[y], prevInf(y))
sliceReturns(life, S, D)        // { equity, inflation } for years S … S+D−1, re-keyed from 0 — what annualNominal(path, 12S, D) gives (a test asserts it)
```

`T` for an answer = `max over the rows of (S + D)`, `D = min(45, endAge − youngerAgeToday − S)`. Every row reads a
prefix. The list depends only on `seed`, `count` and `T`; a test changes every amount and asserts the hash is
unchanged. **Prefix test**: `lifeReturns(i, T1)` deep-equals the first `T1` years of `lifeReturns(i, T2)`, and the
first `12 × T1` entries of the stream are equal, for 20 seeds — this is what makes A equal to C at `S = 0`.

### 4.5 The join — `src/answers/shared/stopAt.js`, and the adapter

```js
stopAtPlan(household, stopAge, env)      // → { S, D, T, plan: enginePlan(householdAtStop, env, { start: 'asGiven', pots: 'perFuture' }), saving: savingPlan(...) }
                                         //   householdAtStop: ages + S, stopWork: already; pensions closed at the stop → lockedMonths; pots = the largest over the lives (the search ceiling only)
createStopRunner(sp, lives, kernels)     // → { run(r, i, config), potsFor(r, i), configsFor(k, i), evaluations }
                                         //   potsFor: life i's pension and savings for run r's person, today's prices; drivers = prepareFutureFrom(life, 12S, D)
verdictAt(sp, runner, spendAYear)        // → { fails, lasted, verdict, runOutAge, runOutMonths } — one run per life at the amount
bandAt(sp, runner, estimate)             // → C's { k, fails } through createBandSolver(plan, lives, { runner, estimate, configsFor }); the three amounts, lasted, runOutAge
potNeeded(sp, runner, spendAYear, fails) // → the least whole £1,000 P (household pension total, split by middling pots) with verdictAt(...).fails ≤ fails; null above SAVING.potMax; bisection ≤ 14 steps
phasesAt(sp, spendAYear)                 // → Phase[] from breakdownAt (C's phasesOf), plus pensionOpen, fromWork, shown.fromWork
monthlyAt(sp, runner, potsFixed)         // → the careful amount with every life's pension set to a given household total (B's monthlyIfShort): bandAt with potsFor overridden
```

**`enginePlan(household, env, opts)`** — `opts.start: 'asGiven'`: the start is `householdStart` (the stop), never
moved; a holder under the earliest pension age on the stop date has `lockedMonths = 12 × (firstOpenAge − ageAtStart)`
and **one run** carrying their pension and their ISA (no separate savings run); `periods` are still cut where the
pension opens. `opts.pots: 'perFuture'`: `run.base` holds the largest pots over the lives; `configsAt(plan, H, pots)`
takes an optional per-person `{ pension, isa }` and rebuilds the sleeves and, for a couple, the period shares from
them. Without `opts`, `enginePlan` is byte-identical to today (C's pinned outputs and `speed.identity` keep it so).
Part-time earnings: `otherIncome[{ kind: 'work', amountPerYear, fromAge, toAge }]` enters `periods[].byPerson` as a
third income (`work`, taxed as income with no National Insurance, `net()` on the sum), cuts a period at `toAge`, and
goes into the pension run's `extraIncomes` as `{ startYear, endYear: years − 1, annual, indexation: 'cpi' }`.

**The locked run, in the replica.** For `month < lockedMonths`: the month's target is `config.lockedSchedule[year]`
(the savings-only target of C's adapter: `savingsTargetFor(share × R)`); `planDrawdown` is called with
`fixedIncome: 0` and the run's ISA; any `sippGross > 0` it asks for is a shortfall (the pension cannot be touched)
→ `failed` that month; the ISA pays `isaDraw`; the pension sleeves grow untouched; `lsaRemaining` is not used.
From `month === lockedMonths` the ordinary path runs on the sleeves as they then stand. With `lockedMonths: 0`
(or absent) `runFast` is unchanged, line for line. `fastEligible` accepts `lockedMonths` (a whole number ≥ 0) with
`lockedSchedule` (an array of `years` numbers), `extraIncomes[].endYear` (a whole number or null) and a finite
`isaReturn`. A config the replica does not cover is still run by `simulate` — and `simulate` cannot run a locked
config, so the adapter builds a locked config only in the covered shape (a test asserts every config the adapter
builds under `asGiven` is `fastEligible`).

**Identity (tests/v7/saving/chain.mjs, test-only).** A locked run `{ lockedMonths: 12L }` in life `i` equals a
chain of two `simulate` runs on the all-shares mix: stage 1 = a savings-only config over `L` years with the ISA
and `lockedSchedule`; stage 2 = the pension config over `D − L` years with `isaBalance = stage 1's finalIsa`, floors
re-based to `base × P(L) × (1 − L/D)` (answer-A-and-B.md 3.2), targets and bands × `P(L)`, `spStartYear`,
`dbStartYear`, `extraIncomes[].startYear/endYear` less `L` floored at 0, and `annualNominal(life, 12(S + L), D − L)`.
`failed`, `failMonth` (stage 2's + `12L`) and the end pots equal to 1e-9 relative. With bonds in the mix the two
differ by the stream and only determinism is asserted.

**Prefix identities.** `prepareFutureFrom(life, 0, D)` gives the same tables as `prepareFuture(future, D)` for the
same seed (asserted to the bit); at `S = 0` with `pots: 'perFuture'` and every life's pots equal to today's, the
band solve equals C's (this is X1).

### 4.6 `fastEngine.js` and `band.js` — the signatures

```js
prepareFutureFrom(life, offsetMonths, years, { prevInflation })   // the same fields as prepareFuture: cumInf (1 in year 0, then life inflation[S + y]), mEq, mCash (year 0 from prevInflation), inf, eq, prevInf; mBond copied from life.stream[offset …]; bondMonths = months
createFastRunner(plan, futures, { potsFor, driversFor })          // potsFor(r, i) → { equity, bond, cash, isa } start values for run r in future i (else the config's); driversFor(i) → a prepared future (else prepareFuture). run(r, i, config) as today
createBandSolver(plan, futures, { onProgress, estimate, runner, configsFor })   // configsFor(k, i) → configsAt entries for future i (a couple with per-future shares); default configsAt(plan, k × STEP × 12)
```

Work bounds asserted by tests through `runner.evaluations`: kernel = 1 pass per person per stop age; verdict = 1 run
per life; band ≤ 6 runs per life per age with an estimate (8 without); pot needed ≤ 14 verdicts; pay-in = 0 runs.

### 4.7 Question A — `src/answers/a/answer.js`

```js
/** Pure. Same inputs and env → the same result on every device. Never throws for a bad value. */
export function answerA(inputs, env) {}
// env: C's (today, futures, seed, trace, onProgress, futureReturns) plus
//   detail: 'chart' | 'all'      default 'chart' (conflict 31)
//   ages?: number[]              tests only: exactly these stop ages
//   mix?, savingMix?             tests only: exact mixes
//   savingsGrowth?               tests only: the drawing years' ISA rate (config.isaReturn); default the engine's 3%
//   solver?: 'reference'         tests only, as C
```

How it is computed:

1. `checkInputs(SCHEMA_A)`; `toHousehold` (4.10); `validateHousehold`. Bad → `status: 'invalid'`.
2. The target: `spend.amount`, or `RULES.plsa[household][level] / 12` rounded to the pound (assumed `spend-level`).
3. The rows: `agesToShow(inputs, env, detail, earliestYes)`; for `stop.kind: 'ages'` first a verdict sweep at every
   whole age from `you.age` to 75 (one run per life per age) to find `earliestYes` (and `earliestClose`).
4. Lives: `livesList(futures, T, env)` with `T = max(S + D)` over the rows.
5. For each row `a`: `stopAtPlan`; kernels per person; `createStopRunner`; `verdictAt(spend)` → `verdict, lasted,
   runOutAge`; `bandAt(estimate = the previous row's k)` → `monthly, lastedAt, runOutAgeAt`; `potsAtStop` →
   `potAtStop`; `phasesAt(spend)` for the shown row. Part-time (`partTime.has`): the shown row is computed with the
   earnings and once more without (`partTime.without`); `partTime.oneMore` is the shown row with `years + 1`.
6. `oneMoreYear` on every row that has the next age in `ages[]`: differences of the two rows, `sameish` when
   `|extraMonthly| ≤ 20`.
7. `shown`: the named row (`kind: 'age'`); for `'ages'` the `earliestYes` row, else the last row (`noneWorked`).
   `headline` from it. No pots, no savings and nothing paid in → `status: 'guaranteed-only' | 'none'` as C, the rows
   collapse to what starts when.
8. Sentences, assumed, warnings from the result only (4.9). `JSON.parse(JSON.stringify(...))` with `-0` removed, as C.

```js
// AnswerA — plain data; JSON.stringify-safe; nothing undefined; no per-life arrays outside `trace`.
{
  status: 'ok' | 'invalid' | 'guaranteed-only' | 'none', problems?,
  inputs, whose: 'you' | 'partner',
  spend: { perMonth, perYear, kind: 'amount' | 'level', level: null | 'minimum' | 'moderate' | 'comfortable' },
  stop:  { kind: 'age' | 'ages', age },                       // age = shown.age
  headline: { kind: 'named' | 'earliest' | 'noneWorked' | 'nothing', age, verdict: 'yes' | 'close' | 'no', lasted, outOfTen, runOutAge },
  shown: AgeRow,                                              // deep-equals the ages[] entry for stop.age (asserted)
  ages: [ AgeRow ],                                           // in age order, no repeats
  earliest: { yes: number | null, close: number | null },
  pensionOpens: { you: number, partner?: number },            // the age each person can first touch a pension
  gapYears: number,                                           // years from the stop until the first pension opens (0 = none)
  savingsNeeded: null | { amount, untilAge },                 // the closed periods' savings draw, today's prices (from phases)
  partTime: null | { yearly, years, fromAge, toAge, lastedWith, lastedWithout, runOutWith, runOutWithout,
                     without: { verdict, lasted, runOutAge, monthly: { careful } }, oneMore: { years, lasted, runOutAge } },
  saving: [ SavingOutcome ],                                  // per person, for the shown row
  guaranteed: { monthlyAfterTax },
  assumed: [ Assumed ], warnings: [ Warning ],
  sentences: { head, sub, line, bad, after?, range, pot, pays: [Sentence], savingsNeeded?, chart: [Sentence], oneMore?, oneMoreMoves?, partTime?, partTimeOneMore?, change?, none?, nothing?, late? },
  basis: { today, futures, seed, failuresAllowed, closeAllowed, historyEnd, engineVersion, endAge, detail, lifeYears: T,
           bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly', strategyId: 'pots-and-valves', cutsSwitchedOff: true,
           split: [ { who, share } ] },
  units: { money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' },
  trace?: { saving: { atCareful: { futureId, rows: [SaveRow] } }, drawing: C's traceOf at the shown row and the spend,
            lives: [ { id, potAtStop, runOutMonth, most } ] }
}

// AgeRow — one stop age
{ age, ages: { you, partner? }, stopYear: 'YYYY', status: 'final',
  verdict: 'yes' | 'close' | 'no', lasted, outOfTen: { words, only }, runOutAge,      // at `spend`; runOutAge = endAge when it lasted
  monthly: { careful, middling, good }, yearly: { … }, lastedAt: { … }, runOutAgeAt: { … },   // C's band at this stop age
  spare: number,                                                                        // max(0, monthly.careful − spend.perMonth)
  potAtStop: { careful, middling, good, byPerson: [ { who, pension, savings } ] },      // household pension + savings, today's prices, whole £; byPerson at the middling position
  paidIn: { total, byPerson: [ { who, amount } ] },                                    // over the saving years, today's prices
  yearsSaving: S, gapYears,
  phases: [ Phase ] | null,                                                             // the shown row only, at `spend`
  oneMoreYear: null | { toAge, extraMonthly, lastedFrom, lastedTo, runOutFrom, runOutTo, potExtra, sameish } }

// SavingOutcome — one per person
{ who, stopAge, yearsSaving, potToday: { pension, savings },
  payIn: { total, own: number | null, employer: number | null, savings },               // £ a month, today's prices, as given
  potAtStop: { pension: { careful, middling, good }, savings: { … }, total: { … } },
  paidIn: { total },
  mix: { saving: 'balanced', drawing: 'balanced', slideYears: 10 | 0 }, chargeAYear: 0.005 }

// Phase — C's with three fields added
{ …C's, fromWork, pensionOpen: boolean, shown: { takeHome, fromPots, statePension, finalSalary, fromWork } }
```

### 4.8 Question B — `src/answers/b/answer.js`

```js
export function answerB(inputs, env) {}
// env as A's, with detail: 'answer' | 'grid' (default 'answer')
```

How it is computed:

1. Check, expand, validate as A. Target as A. `S = stop.age − you.age ≥ 1`.
2. Lives for `T = S + D`; `stopAtPlan`; kernels per person (pension, savings); `potsAtStop` → `potAtStop.now`.
3. **The number**: `potNeeded(sp, runner, spend × 12, fails)` at `floor(n/10)`, `floor(n/2)`, `n − ceil(n/10)` →
   `number.careful / middling / good`; `null` (status `out-of-reach`) when `SAVING.potMax` is not enough. Where the
   State Pension and final-salary pension alone cover the target from the stop age: `number.* = 0`, status
   `guaranteed-only`. For a stop before the pension opens: `outside` first (conflict 38), then the search with every
   life's ISA no lower than `outside.amount`.
4. **The chance**: `chance.lasted` = `reachCount(kernel, payIn.total, number.careful) / n` on the household pension
   kernel; `onCourse` = fails ≤ `floor(n/10)`. `already` = today's pension pot ≥ `number.careful`.
5. **The pay-in**: `payIn.at.nineInTen = payInFor(kernel, number.careful, 0.9)`, `payIn.at.threeInFour` at 0.75;
   `payIn.needed = payIn.at[confidence]`; `payIn.extra = needed − now` (never below 0); `potAtStop.needed` from the
   kernel at `needed`; `payIn.outside` from the savings kernel when `outside` is set. `null` above the ceiling
   (status `out-of-reach`).
6. `short = max(0, number.careful − potAtStop.now.careful)`; `monthlyIfShort = monthlyAt(sp, runner, potAtStop.now.careful)`
   (one band solve).
7. `wholeLife`: one run per life with each life's own pots at today's pay-in, at the target → `lasted, outOfTen, runOutAge`.
8. **Levers** (each null when it does not apply; never when on course... the block is present but the screen hides it):
   `stopLater` — for `a = stop + 1 … min(stop + SAVING.laterYears, 75)`: kernel and `potNeeded(a)`; the first `a` whose
   number today's pay-in reaches in ≥ 9 in 10 → `{ age, number, lasted }`; `payMore = { payIn: needed, lasted }`;
   `spendLess = { spend: monthlyIfShort, number: potNeeded at that spend, lasted: reach count }`; `moreRisk` —
   `savingRisk` one level up (null when adventurous): the kernel again → `{ level, payIn, lasted, helps }`;
   `accept = { lasted: chance.lasted, short, monthlyIfShort }`.
9. `detail: 'grid'`: for each row age of `gridToShow`: kernel, `number` (careful only), and for each column pay-in
   the reach count → `grid.ages[k].cells[j].lasted`.
10. `phases` at the target from the stop age with the pension at `number.careful` (middling split).
11. Sentences, assumed, warnings; stringify as A.

```js
// AnswerB
{
  status: 'ok' | 'invalid' | 'guaranteed-only' | 'out-of-reach' | 'none', problems?,
  inputs, whose,
  spend: { perMonth, perYear, kind, level }, stop: { age, year: 'YYYY' }, ages: { you, partner? }, years: { saving: S, drawing: D },
  pensionOpens: { you, partner? }, gapYears,
  saving: [ SavingOutcome ],
  number: { careful, middling, good, byPerson: [ { who, pot } ] } | null,      // whole £1,000, today's prices; the pension pot(s) at the stop
  already: boolean,                                                            // today's pension pot ≥ number.careful
  chance: { lasted, outOfTen, fails },  onCourse: boolean,
  payIn: { now, own: number | null, employer: number | null, needed: number | null, extra, confidence: 'nineInTen' | 'threeInFour',
           at: { nineInTen: number | null, threeInFour: number | null }, outside: number | null },   // £ a month, whole £10 up
  potAtStop: { now: { careful, middling, good }, needed: { careful, middling, good } | null },       // household pension + savings, today's prices
  short, monthlyIfShort,
  wholeLife: { lasted, outOfTen, runOutAge },
  outside: null | { amount, untilAge },
  levers: { stopLater: null | { age, number, lasted }, payMore: null | { payIn, lasted }, spendLess: null | { spend, number, lasted },
            moreRisk: null | { level, payIn, lasted, helps }, accept: { lasted, short, monthlyIfShort } },
  grid: null | { ages: [ { age, number, cells: [ { payIn, lasted, outOfTen } ] } ], payIns: [number] },
  phases: [ Phase ], guaranteed: { monthlyAfterTax },
  assumed, warnings,
  sentences: { head, sub, line, bad, payInHead?, payInSub?, payInLine?, payInBad?, potsNow, potsNeeded?, wholeLife, outside?, lever: { … }, gridCell?, change?, none?, have?, nothing? },
  basis: { …A's, potStep: 1000, potMax: 5000000, payInCeiling: 10000, laterYears: 10 },
  units, trace?
}
```

### 4.9 Sentences, assumed lines, warnings

Templates are `screens-A-B.md` 7.2 with this brief's keys, in `src/answers/a/sentences.js` and `b/sentences.js`:
`{ id, text, parts }`, `text === partsText(parts, result)`, part kinds `money | age | pot`, every string passing the
banned list in every scope that applies (`all`, `first`, `planner`, `result`, `saver`, and `retired` at stop-now).
Ids (A): `a.head.yes | .close | .no | .earliest | .noneWorked | .couple`, `a.sub`, `a.line`, `a.line.earliest`,
`a.line.justUnder` (lasted in 85–90%: "in just under 9 futures out of 10" — the count never contradicts the verdict),
`a.bad`, `a.bad.yes`, `a.bad.earliest`, `a.after`, `a.range`, `a.pot`, `a.pot.noPayIn`, `a.pot.now`, `a.pays.*`
(C's made-of lines plus `a.pays.locked`, `a.pays.locked.out`, `a.pays.work`, `a.pays.short`), `a.savingsNeeded`,
`a.chart.row`, `a.oneMore`, `a.oneMore.moves`, `a.oneMore.same`, `a.partTime`, `a.partTime.oneMore`, `a.change`,
`a.none`, `a.nothing`, `a.late`. Ids (B): `b.head`, `b.head.couple`, `b.head.onCourse`, `b.sub`, `b.sub.onCourse`,
`b.line`, `b.line.nothingIn`, `b.bad`, `b.bad.onCourse`, `b.payIn.head`, `b.payIn.sub`, `b.payIn.line`,
`b.payIn.less`, `b.payIn.bad`, `b.pots.now`, `b.pots.needed`, `b.wholeLife`, `b.outside`, `b.lever.stopLater |
.payMore | .spendLess | .moreRisk | .moreRisk.no | .accept | .row`, `b.grid.cell`, `b.change`, `b.none`, `b.have`,
`b.nothing`. Rules: Rail 3.3 plus Screens 9.2 (a verdict is three words before the dash; "working until 61 instead
of 60"; "from lasting in 8 futures out of 10 to 9"; "about" once a sentence; "£70,000 short"; ages, never "in N years").
`b.wholeLife`: "Paying in {payIn.now} a month as you do now and then spending {spend.perMonth} a month, your money
lasted until you are {endAge} {outOfTen(wholeLife.lasted)}."

**Assumed lines** (ids; C's apply where their inputs apply, `pot-as-is` and `start-later` never): `pay-in`,
`nothing-paid-in`, `pay-in-as-given`, `pay-in-split` (couple), `savings-in`, `risk-saving`, `risk-drawing` (C's
`risk` reworded "Once stopped: …"), `slide` (only when the levels differ), `charge-saving`, `same-futures`,
`saving-rebalanced`, `stop-age`, `stop-together`, `spend-level`, `spend-steady`, `work-tax`, `no-part-time`,
`pension-closed-until`, `isa-fixed-growth`, `number-is-careful` (B), `confidence` (B), `outside-first` (B). A line
with `source: 'default'` always has a `field`.

**Warnings** (id · when · severity): `pension-closed` · a holder is under the earliest pension age at the stop ·
important; `savings-run-short` · the bad-case run-out is before the first pension opens · important;
`no-savings-for-gap` · pension closed at the stop and no ISA, savings or `savingsIn` · important; `access-age-rises`
· the person is 53–56 today and the stop straddles 6 April 2028 · note; `annual-allowance` · total × 12 > £60,000
(B: the solved figure too) · important; `mpaa` · `alreadyDrawing` and total × 12 > £10,000 · important;
`isa-allowance` · savingsIn × 12 > £20,000 · note; `state-pension-assumed` · note; `target-below-pensions` · note;
`not-in-range` (A, no `yes` row) · important; `out-of-reach` (B) · important; `large-pot` · a pot over £1,073,100 in a
good case or `number.good` · note; C's `long-plan`, `higher-rate`, `one-name`, `small-pot` as C.

### 4.10 The household — `src/answers/shared/household.js` additions

```
Person.saving?: { payIn: { total, own: number|null, employer: number|null }, savingsIn, alreadyDrawing }   // absent = nothing paid in
Person.otherIncome[]: { label, amountPerYear, fromAge, toAge, kind: 'work' | 'other' }                        // A's part-time → kind 'work'
Household.spending: { kind: 'amount', perMonthTakeHome } | { kind: 'lifestyle', level }
Household.saving: { risk, charge }                                                                             // household-level
HOUSEHOLD_LIMITS: payInAMonth { 0, 10_000 }, savingsInAMonth { 0, 10_000 }, charge { 0, 0.02 }, workAYear { 0, 200_000 }, workYears { 1, 15 }
```

`expandHousehold` notes `nothing-paid-in` (no `saving`), `risk-saving` (no `saving.risk`), `charge-saving` (no
`saving.charge`); `validateHousehold` checks the new ranges and that `stopWork` agrees between the people (same year).
`toHousehold` for A and B: C's mapping plus `stop.age` → `people[*].stopWork = { kind: 'age', age: theirAge + S }`;
`spend.*` → `spending`; `payIn.*`, `alreadyDrawing` → `saving`; `savingsIn`, `savingRisk`, `charge` → household;
`partTime.*` → `people[0].otherIncome[{ kind: 'work', amountPerYear: yearly, fromAge: stop.age, toAge: stop.age + years }]`.

### 4.11 The shell — state, actions, readers, runner, hand-over

```js
// state additions (initial.js)
draft:   { c, a, b }                          // each emptyDraft(); a and b also carry carriedFrom: null | 'c' | 'a' | 'b'
answers: { c, a, b }                          // each emptyAnswer() plus detail: null | string, extending: false
// actions.js
DRAFT_CARRY:   'draft/carry'    // { from, to }             copies by CARRY[from→to] into draft[to].values as text; result keys read from answers[from].result; marks touched; sets carriedFrom
ANSWER_EXTEND: 'answer/extend'  // { q, inputsKey }         extending: true (status stays 'final'); the next answer/final for the key sets detail from result.basis.detail and clears it
// answer/first and answer/final also store result.basis.detail as answers[q].detail
// select.js
SCHEMAS = { c: SCHEMA_C, a: SCHEMA_A, b: SCHEMA_B }
STEP_DETAIL = { a: { answer: 'chart', ages: 'all' }, b: { answer: 'answer', choices: 'grid' } }
DETAIL_ORDER = { a: ['chart', 'all'], b: ['answer', 'grid'] }
needsRun(state, q)      // as C on the answer step; on an optional step: true when a final answer for the key is held whose detail is lower than STEP_DETAIL and not extending
wantedDetail(state, q)  // the detail the runner should ask for
isRetired(state, q)     // alreadyStopped(parsedDraft(state, q).inputs, state.env.today) — the retired view (A, B only)
readyMark(state)        // answer: 'partial' while extending; ready '0' then
// run.js
PASSES stay [100, 1000]; env gains detail: wantedDetail; an optional-step run is one pass at 1000 after answer/extend; stale-key rules as C
```

`select.js` may import `schemaParts.js` (for `alreadyStopped`) beside the schemas, `validate.js` and `format.js`;
`boundaries.test.js` lists the four files.

**`CARRY`** (`src/v7/state/carry.js`, data): Screens 5 with conflict 45's paths. Entries are `[fromPath, toPath]` or
`[{ result: key }, toPath]`. `a→c` and `b→c` route to `#/c/answer` (C runs from a complete draft); every other carry
routes to the target's numbers step with `?focus=`. The reducer never runs an answer.

### 4.12 The rail — `src/v7/rail/a.js`, `b.js`

```js
export const QUESTION_A = { id: 'a', steps: [
  { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
  { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.age', 'you.pot', 'stop.age', 'spend.amount'] },   // a needed field that does not apply counts as met
  { id: 'ages',    optional: true,  built: true,  end: false, needs: ['answer'] },
  { id: 'keep',    optional: true,  built: false, end: true,  needs: ['answer'] } ] };
export const NEXT_A = ['a.retired', 'a.failed', 'a.working', 'a.blank', 'a.fix', 'a.ready', 'a.no', 'a.close', 'a.yes', 'a.ages', 'a.ages.none'];
export const QUESTION_B = { id: 'b', steps: [
  { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
  { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.age', 'you.pot', 'you.payIn.total', 'stop.age', 'spend.amount'] },
  { id: 'choices', optional: true,  built: true,  end: false, needs: ['answer'] },
  { id: 'keep',    optional: true,  built: false, end: true,  needs: ['answer'] } ] };
export const NEXT_B = ['b.retired', 'b.failed', 'b.working', 'b.blank', 'b.fix', 'b.ready', 'b.none', 'b.short', 'b.onCourse'];
```

Words, the next sentences and buttons: Screens 2.1–2.2, keyed by these ids in `copy/a.js`, `copy/b.js`. The rail's
short results: numbers "£250,000, age 50, stop at 60, £2,000 a month"; A's answer "Yes at 60" / "Close at 60" /
"Not at 60" / "Earliest that worked: 61"; B's answer "About £470,000 by 60" / "On course for 60". `railFor(state)`
becomes one function over `BUILT[route.q]`, `NEXT_*`, and a per-question short-result builder; C's behaviour is
pinned by its tests and must not change.

Addresses: `#/a/numbers`, `#/a/answer`, `#/a/ages`, `#/a/keep`, `#/b/numbers`, `#/b/answer`, `#/b/choices`,
`#/b/keep` (all through `routes.js` as it is, since `BUILT` grows); `#/soon/a`, `#/soon/b` → not found.
`screenName`: `a.numbers`, `a.answer`, `a.ages`, `b.numbers`, `b.answer`, `b.choices`, `notBuilt` for `keep`.

### 4.13 What the page carries for tests

Everything C's brief 4.9 lists, with `a` and `b` in place of `c`, plus:

| On the page | Rule |
|---|---|
| Screen root | `data-screen` as 4.12; `data-question="a" \| "b"`; `data-view="retired"` on the retired view |
| `#app` | `data-answer="partial"` while an optional step's pass runs; `data-ready="1"` only when everything on the screen is final |
| Headlines | A: `<section data-headline="verdict">` holding the band (`data-verdict="yes\|close\|no"`, visible words), `[data-sentence="verdict"]`, the bad-case line, `ADVICE_SHORT`. B: `data-headline="number.careful"` and `data-headline="payIn.needed"` (one when on course). The headline rule runs per section |
| The chart | `[data-region="answer"] [data-chart="ages"]` with one `[data-age="61"]` row per `ages[]` entry in order; `data-key="ages.3.monthly.careful"` on the amount; `data-key="ages.3.lasted"` on the bar; `aria-current="true"` on the shown age; the bar is `OutOfTenBar`: exactly ten cells, `aria-label` = `outOfTen` words |
| The ages table (step 3) | `[data-table="ages"]`, one row per entry, `data-key`s into `ages.k.*` of the same `k` |
| The levers | `[data-levers]` with one `[data-lever="stopLater\|payMore\|spendLess\|moreRisk\|accept"]` per lever that is not null; `b.lever.<id>.try` on each button; `accept` has none |
| The grid | `[data-grid]` with `[data-cell="62:800"]`, `data-key="grid.ages.4.cells.1.lasted"` |
| Pots | `[data-pots]` with `data-key="potAtStop.now.careful"` … |
| Inputs | `data-testid="a.<path>"`, `"b.<path>"`; radios `a.stop.kind.age`, `a.spend.kind.level`, `b.you.payIn.kind.split` … |
| Buttons | `a.action.show`, `a.action.addPartner`, `a.action.removePartner`, `a.action.moreDetail`, `a.action.fullDetail`, `a.action.seeAges`, `a.action.retry`, `a.action.change`, `a.action.imWorking`, `a.action.willItLast`, `a.try.stop.down\|up`, `a.try.pot.down\|up`, `a.try.spend.down\|up`, `a.try.partTime.down\|up`, `a.try.partTime.yearly`, `a.try.savingRisk.<level>`, `a.try.risk.<level>`; `b.action.show`, `b.action.split`, `b.action.together`, `b.action.back`, `b.action.imWorking`, `b.action.willItLast`, `b.try.payIn.down\|up` (£50), `b.try.stop.down\|up`, `b.try.spend.down\|up`, `b.try.savingRisk.<level>`, `b.try.confidence.<id>` |
| Hand-over | `c.next.a`, `c.next.b`, `a.next.b`, `a.next.c`, `b.next.a`, `b.next.c`; `[data-testid="a.carried"]` on the receiving line; `data-carried-from` on the numbers form |
| Counts the answer wrote | `<span data-fixed>` on "9", "10", "1", "every", the ten bar cells |

Named states to pin (`tests/v7/states/a/*.json`, `b/*.json`): A — `numbers-blank`, `numbers-carried-from-c`,
`numbers-part-time-open`, `numbers-couple-open`, `numbers-more-open`, `answer-nothing-entered`, `answer-working`,
`answer-first`, `answer-A1` (close), `answer-yes`, `answer-no`, `answer-ages`, `answer-ages-none`, `answer-A4`
(before 57), `answer-A3-part-time`, `answer-A2-couple`, `answer-stop-now` (retired wording), `answer-updating`,
`answer-partial` (ages step arriving), `answer-failed`, `answer-retired`, `ages-A1`, `not-built-keep`. B —
`numbers-blank`, `numbers-split-open`, `numbers-level`, `answer-nothing-entered`, `answer-working`, `answer-first`,
`answer-B1` (short), `answer-B2-on-course`, `answer-B4-before-57`, `answer-out-of-reach`, `answer-have`,
`answer-B5-couple`, `answer-failed`, `answer-retired`, `choices-B1`, `choices-on-course`.

### 4.14 The worker and the adapters

The worker's messages are C's: `{ id, type: 'answer', q: 'a' | 'b', inputs, env }`; `env` carries `detail`.
`ANSWERS = { c, a, b }`.

```js
// tests/v7/a/_a.js (b/_b.js the same; saving/_saving.js exports the engine's functions and stopAt.js's)
export { answerA } from '../../../src/answers/a/answer.js';
export { SCHEMA_A } from '../../../src/answers/a/schema.js';
export const TEST_ENV = { today: '2026-09-30', futures: 40, seed: 0, trace: false, detail: 'chart' };
export { get, renderScreen } from '../c/_c.js';
export function readForm(root, q = 'a') {}
```

---

## 5. The work packages

One prerequisite package and six that run side by side. File lists are section 3's and do not overlap. A change
to a contract in section 4 is made by the slice lead, in this brief first, then in P0's files — never by a package
on its own.

```
P0 stubs and lists ──┬─► P1 the saving engine and the join ──┐
                     ├─► P2 answer A ────────────────────────┤
                     ├─► P3 answer B ────────────────────────┼─► joining up ─► the gate (A), the gate (B)
                     ├─► P4 the shell ───────────────────────┤
                     ├─► P5 screens and words ───────────────┤
                     └─► P6 cross tests, browser, CI ────────┘
```

### P0 — stubs and the input lists (the slice lead; lands first, in two days)

Delivers, complete: `schemaParts.js`, `SCHEMA_A`, `SCHEMA_B`, the `validate.js` types and rules, `rules.js`,
`contract.js`, `format.pot`, `rail/a.js`, `rail/b.js`, `questions.js`, `carry.js`, `actions.js`, `initial.js`,
the three adapters, `tests/v7/stubs/{a,b}-result.json` (hand-made from the drawings in Screens 3.2 and 4.2, every
key of 4.7/4.8 present, sentences and assumed included), and their first tests (section 6).

Delivers as stubs: `src/answers/a/answer.js` and `b/answer.js` return the stub result with `inputs` and
`basis.today/detail` filled (`invalid` for bad inputs); `ANSWERS.a`, `ANSWERS.b` registered. The shell builds and
`#/a/numbers` draws the C shell's `NotBuilt` until P5 lands.

Done when: `npm run build:v7` passes; the whole existing suite is green (C untouched); `a/schema.test.js`,
`b/schema.test.js`, `shared/schemaParts.test.js` green.

### P1 — the saving engine and the join (needs P0)

`lives.js`, `saving.js`, `stopAt.js`; the additions to `household.js`, `toEngine.js`, `fastEngine.js`, `band.js`;
`tests/v7/saving/*`; the identity extensions. Reference: Engine 1–2 with conflicts 1–10 and 4.3–4.6 of this brief.

On the first day the runner works, time at 1,000 lives: one row of A (kernel + verdict + band), the chart of seven,
the pot needed, the stop-later search; write the figures in the pull request against Engine 2.6.

Done when: section 6's P1 tests are green; every config the adapter builds under `asGiven` is `fastEligible`;
`speed.identity` unchanged and extended; C's pinned outputs unchanged; the C identity at `S = 0` (X1's engine half:
`bandAt` on today's pots equals `createBandSolver` on `futuresList`) green.

### P2 — answer A (needs P0; joins P1 when it lands, builds against its adapter meanwhile)

`src/answers/a/{toHousehold,answer,sentences}.js`, `tests/v7/a/*` (not `render`/`roundTrip`), the four A fixtures,
`gen/dimensionsA.mjs`, `oracles/fromTrace.mjs` (`recomputeSaving`). Reference: Answers 1 with conflicts 16, 20–24,
29–33; the templates of Screens 7.2.

Done when: P2's tests are green with the real function; the four fixtures reproduce and their sentences are pinned;
X1 (A at stop now equals C) green.

### P3 — answer B (needs P0; joins P1 when it lands)

`src/answers/b/{toHousehold,answer,sentences}.js`, `tests/v7/b/*`, the five B fixtures, `gen/dimensionsB.mjs`.
Reference: Answers 2 with conflicts 13–15, 34–38.

Done when: P3's tests green; X2 (the number round-trips through C at or after the access age; through `stopAt` below
it) and X3 (B's `wholeLife` equals A's row at the stop age) green.

### P4 — the shell (needs P0)

`rail/index.js`, `select.js`, `reduce.js`, `run.js`, `workerClient.js`, `hooks.js`; `tests/v7/shell/*`,
`rail/rail.test.js`. Works against the stubs. Owns `data-answer="partial"`, `draft/carry`, `answer/extend`, and the
retired reader.

Done when: P4's tests green; on `npm run dev:v7` a carry from C fills A's draft, reload keeps it, the ages step
triggers one more pass, and a stale `answer/final` never reaches the state.

### P5 — screens, components, words, styles (needs P0)

Everything a person sees on A and B: Screens 3, 4, 6 with conflicts 41–48; the language additions of Screens 9;
`build-states.mjs` for `a` and `b`; C's "What next?" links; C's `soon-a` state. `Field` is the only way to draw an
input; `Money`, `Sentence`, `OutOfTenBar` the only way to draw a number.

Done when: P5's tests green over every named state (first with the stubs); the owner has looked at A's and B's
answer screens on a real phone.

### P6 — cross-question tests, browser tests, CI (needs P0; fully green at joining up)

`tests/v7/cross/questions.test.js` (X1–X4), `e2eRules.test.js`, the five journeys, the crawl, keyboard, sameness,
pictures, `production` and `old-app-unchanged` extended, `playwright.config.js`, the workflows (nightly to 60
minutes), `RELEASING.md`, `package.json`'s `v7:cases`. Reference: Tests 11–14 with this brief's ids.

Done when: the `browser` job is green in CI on the joined-up branch.

### Joining up (the slice lead)

1. Swap the stub answers for P2's and P3's; delete `tests/v7/stubs/`.
2. `build-states.mjs --question a` and `--question b`; re-run C's states (`soon-d`).
3. All of P6 green; first pictures approved after the owner has seen the screens on a real phone.
4. The planted faults of Tests 15 (with "the start moved", "the pension drawn while closed", "the pay-in solved on
   the whole life", "the number rounded down", "row k shows row k + 1" among them), one at a time, each red where
   expected.
5. The gate of section 7, once for A, once for B (B may ship with A; A may ship without B).

---

## 6. The tests each package writes first

Each package writes these before the code they test; they start red.

| Package | First tests | What they fix in place |
|---|---|---|
| **P0** | `a/schema.test.js`, `b/schema.test.js` — C's checks over each list; every shared path deep-equal across A, B and `SCHEMA_C` (`when`, and `required`/`default` on `you.payIn.total`, aside); stop-age boundaries include 53–57; `parseDraft` on `'0.5'`, `'0.5%'`, `' 1 '` for a percent and `'3'`, `'three'` for a count; the level figures equal `RULES.plsa ÷ 12`; a single person has at most 5 required fields (A: 4, B: 5). `shared/schemaParts.test.js` — `agesToShow` and `gridToShow` on boundary inputs (age 40, 50, 74, 75; kind `ages`); `alreadyStopped` at 66/67/68 either side of the birthday rule. `shared/validate.test.js` extended; `shared/format.test.js` for `pot` | The contracts themselves |
| **P1** | `saving/futures.test.js` (the prefix, the stream prefix, independence from amounts, determinism) · `saving/closedForm.test.js` (CF-S1–S9) · `saving/kernel.test.js` (CF-S6, S7; `payInFor` round trips at 0.9 / 0.75 on 30 random households at 40 lives; `null` above the ceiling; 0 when already there) · `saving/invariants.js` `checkSaving` (Tests S1–S10 with this brief's `SaveRow`: `potEnd = potStart + paidIn.total + growth − charge` to 1p; paid in at the start of the month; no pay-in after the stop; the last row's age = stop − 1) · `saving/growth.test.js` (Tests 3.3: with `payIn = 0`, charge 0, the pot at the stop equals `simulate` on a config with the same pot, an all-shares mix and a target of 0 over `S` years, to 1p; and with the balanced mix through `prepareFutureFrom` at offset 0) · `saving/stopAt.test.js` (the prefix identity `prepareFutureFrom(life, 0, D) === prepareFuture`; X1's engine half; `verdictAt` = 1 run per life; `potNeeded` monotone and ≤ 14 steps; `potNeeded − 1000` fails) · `saving/locked.test.js` (the chain identity of 4.5 on the all-shares mix for `L ∈ {1, 2, 4}`; `lockedMonths: 0` byte-identical to today's `runFast`; no savings → fails in month 0; ISA that lasts `L` years → opens on time) · `c/speed.identity.test.js` extended: per-future pots, an income that ends (`N ∈ {1, 3, 10}`), a finite `isaReturn`, each `bothWays` byte-identical | What the number means |
| **P2** | `a/invariants.js` `checkAnswerA` (Tests A1–A15 renamed: `shown` deep-equals its `ages[]` row; the start is the stop; verdict = the count; verdict and band agree (`yes` ⟹ `monthly.careful ≥ spend − 10`; `monthly.careful < spend` ⟹ not `yes`); rows in order; `earliest.yes` the first `yes`; `oneMoreYear` a difference of rows; phases add up, `pensionOpen: false` ⟹ `fromPension = 0`; `potAtStop.careful ≤ middling ≤ good`, at `S = 0` all equal the pots typed; `paidIn.total = payIn.total × 12 × S`; part-time never hurts and `oneMore.lasted ≥ lastedWith`; every default listed; sentences equal their parts; no banned word incl. `retired` at stop-now; determinism and the 5/6 April clock) · `a/closedForm.test.js` (Tests AF1–AF10 with `spend.amount`, `stop.age`; AF4/AF5/AF6 through the locked run: savings at 57 = 60,000 − 31,200, run-out 78; savings £20,000 → run-out 56 and `savings-run-short`; no savings → `no`, run-out 55, `no-savings-for-gap`; AF9 = X1 at 40 futures) · the four fixtures' inputs with sentence drafts · `a/trace.test.js` (Tests 4.3 on the fixtures, the core and the stop-age cases) · then `gen/dimensionsA.mjs`, `a/pairs.test.js`, `a/properties.test.js` (PA1–PA13), `a/metamorphic.test.js` (M-A2–M-A7, M-A9; M-A4 a finding), `a/feedback.slow.test.js` (Tests 7.3) | The verdict, the range, the years before |
| **P3** | `b/invariants.js` `checkAnswerB` (I-B1–I-B10 renamed; `chance.fails` = the count of lives with pension ≥ `number.careful` from `trace.lives`; `onCourse` ⟺ `payIn.at.nineInTen ≤ payIn.now` to one £10 step; `at.nineInTen ≥ at.threeInFour`; `short = max(0, number.careful − potAtStop.now.careful)`; `already` ⟺ pot today ≥ number; `levers.moreRisk` null when adventurous; `helps` true iff its pay-in is lower; grid cells non-decreasing along a row and non-increasing down a column) · `b/closedForm.test.js` (Tests BF1–BF6 with this brief's paths: BF1's `number.careful = 416,000`, `payIn.needed = 1,320` is now `the least £10 multiple p with 120,000 + 180 × p ≥ 416,000` = £1,650 — the test computes it from the sum since the pay-in is what lands; `spendLess.spend = 500`; BF3 with five flat and five falling lives at `nineInTen` and `threeInFour`) · `b/roundTrip.test.js` (Tests 5.1: the number through `answerC` at or after the access age, exact; below it through `stopAt` with the ISA; `number % 1000 === 0`) · `b/solve.test.js` (Tests 5.2 renamed) · then `gen/dimensionsB.mjs`, pairs, properties (PB1–PB8), metamorphic (M-B1–M-B6, M-B9–M-B11) | The number, the pay-in, the levers |
| **P4** | `shell/reduce.test.js` extended (each new action; `draft/carry` copies exactly the map, marks touched, sets `carriedFrom`, never touches the source, reads a result key as text; a stale `answer/final` ignored; `answer/extend` then `answer/final` sets `detail`; the state survives JSON after any sequence) · `shell/select.test.js` (`needsRun` on optional steps; `wantedDetail`; `isRetired`; `readyMark` `partial`) · `shell/run.test.js` (three-pass sequence with a fake worker; a change mid-extend ends it) · `shell/routes.test.js` (every A and B address round-trips; `#/soon/a` is not found; no digit in any address) · `rail/rail.test.js` (L1–L8 over the three questions; L9 the carry; L10 the optional steps' working form; L11 the short results; random walks crossing questions) | Wiring and the stale-figure class of bug |
| **P5** | `render/checkScreen.js` (R13–R16; `scopesFor` gives `saver` for A and B, `retired` at stop-now) · `a/render.test.js`, `b/render.test.js` over every named state (first with the stubs) · `a/roundTrip.test.js`, `b/roundTrip.test.js` (fast-check form round trips) · `wording/wording.test.js` (the banned list over `copy/a.js`, `copy/b.js`, both sentences files, every drawn A/B state; every field path has a label; `ADVICE_SHORT` under every headline section) · `styles/contrast.test.js` (the verdict tokens) · the verdict word on screen equals the rule on `lasted`; the chart's ages equal `agesToShow`; the bar's filled cells equal `round(lasted × 10)`; the carried figure equals the map's key as text; two headlines on B each with a sentence and bad-case line, one when on course | What a person reads |
| **P6** | `cross/questions.test.js` — X1 (A at stop-now equals C: `shown.monthly/yearly/lastedAt/runOutAgeAt/phases/guaranteed` and, with `take := spend`, C's `take` equals `shown.{lasted, runOutAge}`; precondition `c.basis.start === today`); X2; X3 (B's `wholeLife` equals A's row at the stop age with `spend := spend`, exact); X4 (`shown` equals the row) · `e2e/production.spec.js`, `old-app-unchanged.spec.js` (green on day one) · then the journeys J4–J7 of Tests 11.1 renamed (`a-stop-soon`, `a-couple`, `b-coast` replaces `b-too-late` as the B journey and `b-my-number` is J4's second half, `a-from-savings`), `crawl`, `keyboard`, `sameness` (about 30 cases: the fixtures at 40 futures with `env.ages` of three, the 13 stop-age cases, BF1–BF4, CF-S1–S3), `screens` (+36), `e2eRules` | The real page, the real policy |

---

## 7. Done means

The A slice (and then the B slice) is done, and `/v7/` may be re-published unlinked, when all of these hold on one
commit:

1. **Both CI jobs green**, in CI.
2. **The C slice and the current app untouched**: every C test green with no pinned file changed except those a
   listed engine extension moves (named in the pull request: the identity test's new shapes, `fastEligible`,
   C's `soon-a` state and pictures); `planCorpus`, `ownerPlan.local`, `indexMarkup`, `releases`, the old-app walk
   unchanged; `src/services/`, `src/strategies/`, `src/workers/`, `src/storage/`, `src/firebase/`, `src/ui/`,
   `index.html` show no difference from the commit the slice started on.
3. **No rule fails**: `checkSaving`, `checkAnswerA` / `checkAnswerB` and every property report nothing on the pairs,
   the core, the stop-age cases, the found cases and the last night's random run; `exceptions.md` empty or every
   line explained in the pull request.
4. **The independent checks agree**: the closed forms exact; the saving months and the drawing months recomputed
   from the trace; growth equal to the drawing engine's; the fast path equal to the reference on the new shapes; the
   locked run equal to the chain on the all-shares mix; A's bad-case row fed back through today's plan path within
   the stated share.
5. **The cross-question checks hold**: C equals A at stop now (byte for byte); B's number round-trips; B's whole-life
   count equals A's row; the shown row equals the table's.
6. **The fixtures reproduce** (four A, five B) and the owner has approved their sentences and figures and the first
   pictures, having seen the screens on a real phone.
7. **The first answer is counted** on the published build: A at most 4 typed things, 3 screens, 8 clicks; B at most
   5, 3, 8; no sign-up or pop-up; first figure within 3 s and the answer step's final figure within 15 s with the
   processor slowed four times; the optional step within 30 s more, arriving as `partial`; the owner's stopwatch
   figure in `RELEASING.md`.
8. **The same answer in three browsers**: decisions, displayed figures and sentences exactly equal; raw money
   within 1p; the £1,000 rounding of a pot never flips (a flip is pinned and the rounding made robust).
9. **V7 cannot change a plan**: the import rule green; the locked fixture byte-identical after the crawl; no hook in
   the published build.
10. **Every planted fault went red** where expected.
11. **Every word passes the list**, in the strings and on every drawn state, the stop-now state under the retired
    rules and no countdown anywhere in A or B.
12. **Sizes and times written down**: the compressed size of A, B and the worker; the measured cost of the chart,
    the number and the levers at 1,000 lives on the Mac.

---

## 8. Out of scope for this slice

| Not built | What stands in its place |
|---|---|
| Relief methods, salary, the earnings and taper limits, the higher-rate claim, salary sacrifice | The pay-in is what lands in the pension (`pay-in-as-given`); `annual-allowance` and `mpaa` warn on the total |
| A couple stopping in different years; the later stopper's earnings and payments | `both-stop-together`; the partner's own stop age is a later field |
| A stop month and year ("next June") | Ages only; C's birthday-is-today rule |
| Month and year of birth | Still age only (the C brief's decision 11); `access-age-rises` warns at 53–56 |
| National Insurance on part-time earnings; still paying in while part-time | `work-tax` says NI is not included; pay-in stops at the stop age |
| `savingsLeft` (savings at the State Pension age in a bad case) | `savingsNeeded` from the phases |
| A charge in the drawing years | C's `no-charges` stands (owner decision 2) |
| A `twoStage`/journey second figure for the pay-in | `wholeLife` is the one check line |
| Keeping a plan, sign-in, `keep` steps; questions D, E, F; the `a→d`/`b→d` carry | `keep` on the rail, not built; `Soon` for D–F; `#/soon/d` |
| Live prices | Bundled market history only |
| The old Accumulation tab and `RetireSweep.js` | Untouched until cutover; CF-S8 within 2% |
| Release note for V7 | None until 7.0.0 (the engine extensions are V7-only files; no 6.x release is needed by this slice) |

---

## 9. Decisions taken for the owner (the recommended default, for the record)

Builders proceed on these. Each is a small change if made before joining up.

1. **A closed pension is modelled inside its holder's one run** (`lockedMonths` in the fast replica), proven against
   a two-stage chain of today's engine on an all-shares mix — not the chain of stages itself, and not the separate
   savings run C uses. The pension cannot be touched while closed; the run fails if the savings cannot pay.
2. **Charges of 0.5% a year while saving** (editable, listed); none in the drawing years, as C.
3. **Verdict**: yes at 9 in 10, close at 3 in 4 (not 7 in 10, not 5 in 10), no below; the words "Yes —", "Close —",
   "Not at {age} on these figures".
4. **"Going in each month" is what lands in the pension** (employer's part and tax top-up inside); no grossing up,
   no salary, in this slice.
5. **The pay-in that gets there reaches the number in 9 in 10 lives** (two-stage, closed form); the whole-life count
   is shown once as a check line, never as the headline.
6. **Saving risk defaults to Balanced** (the same as the drawing risk), with a 10-year straight-line slide only when
   the two differ. Not Adventurous.
7. **Monthly rebalancing** while saving; **the payment at the start of the month**; **the yearly grid**.
8. **The bond stream continues across the stop**; the cash rate in the first drawing year reads the true previous year.
9. **Savings are held in the saving mix while saving**; the engine's fixed 3% stands in the drawing years.
10. **Both stop in the same year**; no stop month; age only.
11. **The chart holds seven rule-fixed ages**; step 3 shows every age from 50 (or today's age) to 75, arriving as
    `partial`; today's age is always a row (it is question C).
12. **Confidence**: 9 in 10 by default, 3 in 4 under B's more detail; no 2 in 3.
13. **B before the pension opens** shows the outside-pension part of the number and a second monthly figure into
    savings.
14. **Levers**: five, `stopLater` searched to ten years on or 75; `accept` has no button; `moreRisk` stays and says
    when it does not help.
15. **The banned list gains the 22 entries of Screens 9.3** plus "no countdown anywhere in A or B"; `on track` is
    banned in favour of `on course`.
16. **Ceilings**: pay-in £10,000 a month; pot search £1,000 steps to £5,000,000; stop age 75.
17. **Budgets**: first figure 3 s, answer step final 15 s, optional step 30 s more, processor slowed four times;
    the futures count and the £10 / £1,000 steps are never cut; if B's levers miss the budget, `stopLater` moves to
    the optional step's pass.
18. **Steps 3 of A and B are built** in this slice.
19. **`alreadyDrawing`** is asked under more detail for the £10,000 warning only.
20. **The old Accumulation tab's growth convention is left alone**; the 2% tolerance test states the difference.
21. **The nightly workflow's limit rises to 60 minutes**; the push suite may grow by 150 seconds.
22. **No 6.x release is needed**: `calculateBondReturn` is used through `fastEngine.js`'s existing copy.
