# What you spend, changing with age: V7's spending shape (design, 2 Oct 2026)

Design only. No product code was changed. Written against 6.20.1 and the /v7/ preview. "Today's planner" means the live
app's Stress tester → Settings → "Your income shape". "V7" means the question pages at /v7/.

**The owner's rule (2 Oct 2026, verbatim):** "We NEED to have the same or better optionally than V6. We MUST offer as
many steps and tapers as V6! ... In general - optional it must be at least v6. We must have Gogo, goslow and nogo years."

**Rules already in force that this design keeps:** the budget is a guide only (it never sets the figure; one tap copies
its total); plain English; flat and same-year answers stay byte for byte; C, A and B agree to the pound; charges per
plan; couples may stop apart; the 2028 drawdown note now shows for everyone it applies to (its own package, see 11.4).

---

## 0. The decisions, in short

1. **V7 offers everything today's planner offers on income shape, and a little more** (section 2 lists each item and
   its V7 home). Any number of steps by age. Each step, including the first, then **stays the same**, **falls by N% a
   year**, or **moves evenly to the next step**. "Suggest go-go, go-slow and no-go years" gives today's 15% less from 75
   and 30% less from 85, never below the budget's essentials. Two presets have plain names, and there is a chart at
   390 px.
2. **One meaning for "falls" and "moves evenly", taken from today's planner.** V7 builds the year-by-year figure with
   today's own function, `IncomeSchedule.amountAtAge`. The arithmetic is the same: compounding falls at today's prices,
   and a straight line in pounds that reaches the next step as it starts. The one difference is that V7's amounts are
   after tax and a month, where today's are before tax and a year.
3. **Where it sits.** On the spend step of A and B (and D when it is built), under the amount box, as one line that
   opens: "Does it change as you get older? No: the same every year. [Change it with age]". In C, under "Add more
   detail", with each later step as a share of the starting amount ("From 75: 85% of what you start on"), because C
   works out the starting amount.
4. **Couples: one shape for the household, by your age.** "You" is the person at the keyboard, and your partner's age
   is shown beside each step. The suggestion uses the younger of you (from when the younger is 75 and 85). That is the
   cautious side, and it matches "until the younger of you is 95".
5. **Engine: a target for each year, no new engine.** The household's after-tax amount in plan year y is H × r(y),
   where H is the year-0 amount and r is the shape's ratio to year 0. The tax per person and the share of the pots
   between the people are worked out as today, for each year. `fastEngine.js` and `SimulationEngine.js` already read a
   target for each year, so neither changes. A flat shape takes today's code path, so its answers stay byte for byte.
6. **Every solve finds the year-0 amount and moves the whole shape with it.** The words are "about £2,300 a month at
   the start, then as you set it: £1,950 from 75 and £1,610 from 85." C's careful, middling and good amounts, A's "could
   spend", D's "could I spend more?" and "Try a change" all move the shape in proportion. B's pay-in solve and A's
   verdict use the shape as typed.
7. **Keep as a plan is exact to the year.** The seed carries each person's after-tax amount for every year it changes.
   Today's planner turns those amounts into income steps using its own `grossUpAnnual`, as now. Level stretches become
   one step, stretches that move evenly use "glide", and falling stretches become one step a year. Today's planner
   then targets the same after-tax figure every year, to within 50p a month, even after it is saved again. Seed version
   3 is written only when the shape is not flat; a flat spend still writes version 2, byte for byte.
8. **Tests come first.** The flat-answers corpus is pinned before any code moves, as was done for couples apart. Then
   come V6-parity tests (the same function, the same suggestion), closed forms, properties, and a save round trip
   exact to 50p for every year.
9. **Six build packages with no shared files** (section 10). The order is the model, then the engine and the inputs in
   parallel, then the answers, then the screens and the save in parallel.

---

## 1. Today's planner, exactly (read from the code)

| # | Capability | Exactly what it does | Where |
|---|---|---|---|
| T1 | Steps by age | Any number of steps `{ fromAge, amount }`, £ a year **before tax**, today's prices. One step = level for life. The first step's age is the plan's start and cannot be edited; it moves when the plan's start moves | index.html:9109-9138, 8976; `cleanSteps` IncomeSchedule.js:17-19 |
| T2 | A step is the TOTAL income | "Each step is your TOTAL gross income for the year — State Pension, other pensions and the pot together" | index.html:9135 |
| T3 | Falls within a step | `decline`, % a year at today's prices, compounding: year k of the step pays amount × (1 − d)^k. Slider 0 to 5 in steps of 0.25; the model accepts 0 to 50 | IncomeSchedule.js:41-42; index.html:9130 |
| T4 | Glide to the next step | `glideToNext`: a straight line in £ from this step's amount to the next step's, arriving as that step starts. Not offered on the last step; it switches the slider off | IncomeSchedule.js:37-40; index.html:9130-9132 |
| T5 | Add a step | New step 10 years after the last, £10,000 a year less (not below 0) | index.html:9139-9143 |
| T6 | Remove a step | Any step but the first | index.html:9124, 9162 |
| T7 | Start from my budget | First step's amount = the budget's all-in total plus headroom, grossed up. Later steps are kept as they are. Also fills Floor & Flex's essentials if empty | index.html:8394-8404; BudgetToPlan.js:26-46 |
| T8 | Or a number | Replaces ALL steps with one step at that amount | index.html:8405-8411 |
| T9 | Suggest go-slow & no-go | `suggestSteps(first, ageNow, essentials)`: replaces all steps with the first (no decline), then from 75 max(85% of first, essentials) and from 85 max(70%, essentials), each rounded to £500 a year. 75 is added only if the start is before 75, and 85 only if before 85. The toast says "these are typical, not yours" | incomeShapeGraphic.js:23-30; index.html:8412-8419 |
| T10 | The go-go / go-slow / no-go words | Shown with the editor: go-go is travel and projects; go-slow is from the mid-70s, drifting down 1-2% a year; no-go is the basics, and care if it comes | index.html:3200 |
| T11 | The staircase chart | One bar a year, coloured go-go (<75), go-slow (75-84) and no-go (85+). Layers inside each bar: State Pension, other income (other income, final-salary pension, income streams), then the pot. The line follows the shape. Below essentials turns orange, with a dashed essentials line and a marker for the budget. ▲ lump sums and ▼ one-off spends are drawn at their ages. Tooltips per bar; animates between shapes | incomeShapeGraphic.js:37-113; index.html:8322-8377 |
| T12 | Never below the income you get anyway | Each year's target is max(shape, State Pension + other income + final-salary pension + income streams), with an orange note from the age it happens | index.html:9169-9187, 8375 |
| T13 | Below essentials note | "A step is below your budget's essentials … That is allowed" | index.html:8372-8376 |
| T14 | Share of the budget beside each step | "— 85% of today's budget" on each later step | index.html:9123 |
| T15 | First step after tax | "First step £X/yr gross ≈ £Y/mo take-home" | index.html:8373-8376 |
| T16 | Lump sum into income | "Add £X/yr to my income from 67" raises that step and every later one | index.html:8352-8366, 8380-8393 |
| T17 | One shape for everything | Saved as `incomeShape: 'phases'`, `incomeSteps`, and the compiled per-year `targetSchedule` (floored, rounded). Every strategy, the stress test, the ladders' rung sizes, the Decision tool's target (first step and schedule, while unlocked), the tax-year set-up, the plan document's staircase, the Household tab and the compare page's summary all read it | index.html:11299-11333, 10231-10232; stressTest.js:135; HouseholdService.js:93-99; TaxYearWizardService.js:317; PlanDocumentView.js:84-86 |
| T18 | The old "declining with age" setting | Level for 5 years, then 1% less a year for 20 years, then level. Turned into steps on load by `smileToSteps` | IncomeSchedule.js:60-75; StressRepository.js:241-254 |
| T19 | Try a strategy with a flat income | "Income: My income shape (as saved) / A flat amount", in a what-if only | index.html:2825, 6454 |
| T20 | £0 steps | Ignored (`cleanSteps` drops them): a £0 step is not a step | IncomeSchedule.js:18 |
| T21 | One-off costs ("Extra spend") | In "Income streams & lump sums": a name, an amount (before tax, £), a plan year, "for N yr(s)", and "Today's money" or "Fixed £ (nominal)". Added on top of that year's target and taxed like income; every strategy pays it; drawn ▼ on the staircase (added 2 Oct 2026, from the review: it is a way spending changes with age) | index.html:10636-10637; SimulationEngine.js:819 `extraWithdrawalFor`; incomeShapeGraphic.js:74-80 |

---

## 2. The rule for V7: at least as much, item by item

| Today (section 1) | V7 | Where in this design |
|---|---|---|
| T1 any number of steps by age | Any number, up to one per year of the plan. Ages are whole and strictly rising | 3.2, 4.2 |
| T2 total income | The same: each figure is all you spend, after tax. Your State Pension and other pensions pay first | 3.1, 5.2 |
| T3 falls 0-5% in 0.25 steps | **0.25% to 10%** in steps of 0.25, on every step including the first | 3.2 |
| T4 glide to next | "moves evenly to the next step", on every step but the last | 3.2 |
| T5 add a step | "+ Add a step": 10 years after the last, 10% less than it (rounded to £10) | 4.3 |
| T6 remove | Any step after the first | 4.3 |
| T7 start from my budget | "Use £X a month" sets the first amount (it exists today). Later steps are kept, as today, and a one-tap "Move the later steps in proportion" appears | 4.3 |
| T8 or a number | The amount box. "The same every year" clears the steps | 4.3 |
| T9 suggest | **"Suggest go-go, go-slow and no-go years"**: 15% less from 75 and 30% less from 85, never below the budget's essentials, editable, with **Undo** (today's has no undo) | 3.4, 4.3 |
| T10 the words | The same three words, in plain sentences | 7.1 |
| T11 the chart | A chart at 390 px: a bar a year, the State Pension and other pensions inside each bar, go-go / go-slow / no-go bands, the budget's essentials as a dashed guide, below-essentials marked. A table of every year for screen readers. **Not built yet** (review, 2 Oct 2026): the layers while the steps are set, the budget's total marked, the markers for lump sums and one-off costs, and the motion between shapes | 4.4; 15 |
| T12 never below income you get anyway | The engine already does it (5.2). A note says so from the age it happens, on the answer. **Not built yet:** the same note while the steps are set | 5.2, 7.4; 15.2 |
| T13 below essentials | The same note, as a guide | 7.4 |
| T14 share beside each step | "(85% of the start)" beside each step | 4.2 |
| T15 first step after tax | Not needed: V7 figures are after tax already. The answer's "what it is made of" shows the tax | — |
| T16 lump sum into income | Waits for lump sums (designed, 17). Then "Turn it into income" and `raiseFrom(age, perMonth)`, the same rule | 17.3 |
| T17 one shape for everything | Every V7 answer reads it; Keep writes today's steps exactly (section 8) | 5, 8 |
| T18 old declining setting | The preset **"Slowly less"**: the same for 5 years, then 1% less each year for 20 years, then the same | 3.4 |
| T19 try a flat income | "Try a change" gains **"Try it the same every year"** | 6.5 |
| T20 £0 steps ignored | Each step must be at least £1 a month (1% in C), so no step is quietly dropped | 3.3 |
| T21 one-off costs | **Designed, not built:** "Any one-off costs?" under the steps: an amount after tax at an age, once or for a number of years, going up with prices or a fixed sum | 16 |

**More than today:** falls on every step up to 10% a year, Undo after a suggestion or preset, the partner's age beside
every step, the shape in C (today's planner has no question C), and the solved shape in words ("£1,950 from 75").

**Not added, on purpose:** "rises N% a year". A higher later step (care from 85) or "moves evenly" up to it covers
that, and every shape must still map exactly into today's planner.

---

## 3. The model

### 3.1 What a shape is

A shape is how the household's spending changes with age:

- **The first amount.** £ a month, after tax, at today's prices, from when the money starts (the stop in A and B, now
  in D). It has its own "then".
- **Later steps.** Each has an age, an amount (A, B and D: £ a month; C: a share of the start), and its own "then".
- **"Then"** is one of three:
  - **stays the same**;
  - **falls by N% a year**: each year N% less than the year before, at today's prices;
  - **moves evenly to the next step**: a straight line in pounds that reaches the next step's amount as it starts.
    It cannot be chosen on the last step.

Every figure goes up with prices, as V7's spending always does. "Falls 1% a year" means 1% less each year, at today's
prices. That is today's planner's meaning (T3).

### 3.2 Inputs (`src/answers/shared/schemaParts.js`)

**A, B and D** (beside `SPEND_FIELDS`, group `spend`):

| Path | Type | Rule |
|---|---|---|
| `spend.then` | choice `level` / `falls` / `glides` | **No default.** Not answered = level, and the checked inputs are today's, key for key (the rule C's `payIn.has` set) |
| `spend.fallsPct` | percent, 0.25-10, step 0.25 | required when `spend.then` is `falls` |
| `spend.steps` | **steps** (new type, 3.3) | no default; absent or empty = no later steps |

**C** (group `more`): `shape.then`, `shape.fallsPct`, `shape.steps`, the same, except that each step carries `share`
(percent, 1-500, step 0.01) in place of `perMonth`.

A step is `{ fromAge, perMonth | share, then, fallsPct? }`, with `then` defaulting to `level` within a step.

### 3.3 The `steps` type (`src/answers/shared/validate.js`)

The input lists hold flat paths and `flatten` already treats arrays as values. A list of steps is one value with one
new type:

- **Parsing:** each item's text is parsed by its own rule: `fromAge` as an age; `perMonth` as money, 1 to 50,000 (the
  limits of `spend.amount`); `share` as a percent; `then` as a choice; `fallsPct` as a percent.
- **Errors** are keyed per item (`spend.steps.2.fromAge`), so the screen puts each one under its box.
- **Rules:**
  - Ages are whole, strictly rising, and later than your age today.
  - In A and B, ages are later than the stop age named. In C, later than the start.
  - Ages are earlier than your age at the end of the plan.
  - `glides` is not allowed on the last step.
  - There are no more steps than years in the plan.
- **Sorting:** the screen sorts by age when a box loses focus (today's editor sorts too, index.html:9115).

### 3.4 The suggestion and the presets (pure, `src/answers/shared/shape.js`)

**`suggest(first, startAge, olderBy, essentialsPerMonth)`** is today's T9 in V7's units.

- The ages are 75 and 85 of the younger of you, written as your age (75 + your age − the younger's age).
- Each step is added only when the start is before it, as today.
- The amounts are round10(max(0.85 × first, essentials)) and round10(max(0.70 × first, essentials)), each "stays the
  same". This is today's order (the floor, then the rounding), to the nearest £10 a month in place of £500 a year.
- The first amount's "then" becomes "stays the same", and every earlier step is replaced, as today.
- In C there is no amount, so the shares are 85% and 70%, with no floor.
- The essentials come from the budget sheet, through the screen's state, never through an answer. That keeps the rule
  that answers never read the budget (budget-step.md tests). They are used only when a budget with essentials exists.

**Presets** (each fills the steps, which stay editable; each has Undo):

| Name on the button | What it fills in |
|---|---|
| The same every year | No later steps; the first stays the same |
| Go-go, go-slow, no-go | `suggest` (the button above; one control, two places to find it) |
| Slowly less | The same for 5 years; then 1% less each year for 20 years; then the same. Built with today's `smileToSteps` on a one-step shape, so it matches T18 exactly |

### 3.5 The year-by-year figure: today's function, in after-tax units

The year-by-year figure is worked out in `shape.js` by `ratiosOf(shape, first, startAge, years)`, in three steps:

1. **One unit for every question:** each later step's amount becomes a share of the first: `perMonth / first` in A,
   B and D, or `share / 100` in C. It is one division of the two numbers given, so equal shares give the same bits
   whichever question they came from. The first amount is 1.
2. **Build today's step list:** `{ fromAge, amount, decline: then === 'falls' ? fallsPct : 0, glideToNext: then ===
   'glides' }`. The first amount is placed at `startAge` only when no later step's age is at or before `startAge`.
   Otherwise the latest such step is in force from the start, and its fall or glide counts from its own age, as today
   (A's row for a stop at 76 with a step from 75: one year into that step).
3. **Read the ratios:** a(age) = `IncomeSchedule.amountAtAge(list, age)`, today's own function, imported. Then
   r(y) = a(startAge + y) / a(startAge) for y = 0 … years − 1.

**The result is null when every r(y) is 1.** A shape that never changes is no shape, so it takes today's path in full
(5.4).

**`startAge` is your age at the household's start:** the stop in A and B (the first stop for a couple apart), the start
in C, today in D. **The year-0 amount** is a(startAge) × first. This is what A tests, and what every solve reports as
"at the start".

### 3.6 Couples

- **One shape for the household.** V7's spending is the household's (budget-step.md), so the shape is too.
- **Ages are your age.** "You" is the person at the keyboard, as in every V7 sentence ("From when you are 75"). Each
  step shows your partner's age then: "From when you are 75 (your partner 72)". If you have already stopped and the
  answer is about your partner (A and B, switch 3), the ages are still yours. The person at the keyboard never changes.
- **The suggestion uses the younger of you.** That is the cautious side: spending stays higher for longer. It is the
  same rule as "until the younger of you is 95".
- **Couples who stop in different years:** the household's clock starts at the first stop. During the years apart the
  pay covers its share of H × r(y), as it covers H today.

### 3.7 Limits and errors

| Thing | Limit | Error words (7.3) |
|---|---|---|
| Step age | whole; > your age today; > the stop (A, B) or start (C); < your age at the end; rising | 7.3 |
| Step amount | £1 to £50,000 a month (A, B, D); 1% to 500% (C) | 7.3 |
| Falls | 0.25% to 10% a year, in steps of 0.25 | 7.3 |
| Moves evenly | not on the last step | 7.3 |
| Number of steps | at most the plan's years | 7.3 |

---

## 4. The screens

### 4.1 Where it sits

- **A and B, the spend step** (`saverSpend`, src/v7/screens/a/SpendScreen.jsx): a block under the amount box and the
  guide levels, closed by default. A first answer still takes three numbers and two minutes.
- **D, the spend step:** the same component. This answers D's question 2 (answer-D.md 3.3) with the full shape in
  place of "one later amount".
- **C, "Add more detail":** the same block, in shares. It sits after "Already had the tax-free part?" and before
  savings.

### 4.2 The block at 390 px (A shown; 16 px gutters, one column)

```text
Does what you spend change as you get older?
No: the same every year, going up with prices.      [ Change it with age ]

— opened —

Does what you spend change as you get older?
Many people spend more in the first years after they stop (the go-go years:
travel, projects), less from their mid-70s (go-slow), and less again later
(no-go), though care can cost more. Set steps by age. Every figure is after
tax, at today's prices, and goes up with prices.

[ Suggest go-go, go-slow and no-go years ]
Or: [ The same every year ]  [ Slowly less ]

From when you stop at 62
£2,500 a month (the figure above)
then  [ stays the same            ▾ ]

From age [ 75 ]                         [ Remove ]
£ [ 2,130 ] a month   85% of the start
then  [ stays the same            ▾ ]

From age [ 85 ]                         [ Remove ]
£ [ 1,750 ] a month   70% of the start
then  [ stays the same            ▾ ]

[ + Add a step ]

[ chart, 4.4 ]                        [ Show each year ]
```

- **"then"** is a select: "stays the same", "falls by …% a year", or "moves evenly to the next step". Choosing "falls"
  opens a percent box on the same line: "falls by [ 1 ]% a year".
- **Couples:** "From when you are [ 75 ] (your partner 72)".
- **C:** "From age [ 75 ]   [ 85 ]% of what you start on". The first row reads "From the start: 100%".
- Every box is drawn by `Field` from the input list, as now. The step rows are one new component, `StepsField`. Each
  box has its own label, the error under it, and `aria-describedby`. Remove buttons are named "Remove the step from
  75". The keyboard order follows the reading order.

### 4.3 What each control does

| Control | Action (`state/reduce.js`) | Effect |
|---|---|---|
| Change it with age | `ui/toggle 'shape'` | opens the block |
| + Add a step | `shape/add` | a step 10 years after the last, or after the start, and before the end, at 10% less than the step before (round £10). The keyboard goes to its age box |
| Remove | `shape/remove i` | removes it; the keyboard goes to the next step's age, or "+ Add a step" |
| Suggest go-go, go-slow and no-go years | `shape/suggest` | `suggest` (3.4); the note in 7.1 with Undo |
| The same every year / Slowly less | `shape/preset id` | 3.4; Undo |
| Undo | `shape/undo` | the shape as it was before the last suggestion or preset (one level) |
| Use £X a month (the budget) | `budget/use` (today's) | sets the first amount only; later steps kept (T7). Then "Move the later steps in proportion" |
| Move the later steps in proportion | `shape/rescale` | each later amount × new first ÷ old first, round £1. Shown once after the first amount changes while steps exist |
| Pick a level | today's | the level's figure is the first amount; steps as typed |

### 4.4 The chart (`src/v7/components/ShapeChart.jsx`, V7's first SVG)

- **Size:** the full content width (358 px at 390), 180 px tall, `viewBox` scaled. No sideways scroll at any width.
- **Bars:** one a year from the start to the end, so at most 50 bars of at least 6 px. Each bar is the household's
  after-tax amount that year. Inside it, the part paid by the State Pension, final-salary pensions and part-time work
  (after tax) is drawn lighter, and the part from the pension and savings darker. That is today's T11 layering, in
  after-tax pounds.
- **Bands:** "go-go", "go-slow" and "no-go" under the axis, at 75 and 85 of the younger of you, as today colours them.
- **Lines:**
  - three grid lines with £ labels (the axis is the one place "£2k" is allowed, banned.js `money-short`);
  - the budget's essentials, when a budget exists, as a dashed line labelled "your budget's essentials (a guide)";
  - years below it marked in the warning colour, matching the note (7.4).
- **Axis:** age every 5 years; for a couple, your age, with "(your ages)" in the axis title.
- **Tap or hover a bar:** a line under the chart, not a tooltip, so it works on a phone: "At 80: £2,130 a month —
  £1,046 from your State Pension, £1,084 from your pension and savings."
- **Accessible:** the SVG has `role="img"` and a one-sentence `aria-label` built from the steps. "Show each year"
  opens a table (age · a month · from pensions you get anyway · from your pension and savings) that a screen reader
  reads row by row.
- **Data:**
  - On the spend step: from `yearsOf(plan, H)` (5.6). That is pure and cheap, with no engine run, at the named stop
    age. With "show me ages" there is no stop age, so the chart shows the shape alone, with no layers.
  - On an answer: from the result's `years` at the amount the answer is about.
  - The essentials line comes from `state/select.js`, never from the answer.
- **Colours:** four new tokens in tokens.css: `--chart-income`, `--chart-pots`, `--chart-below`, `--chart-guide`. Each
  bar colour has 3:1 contrast against the card, and the warning colour is never the only signal (the note says it too).

### 4.5 What the hand-overs carry (`src/v7/state/carry.js`)

| From → to | Carried |
|---|---|
| A ↔ B | `spend.then`, `spend.fallsPct`, `spend.steps` as typed (the same paths) |
| C → A, B | the first amount = C's careful start; each step's `perMonth` = careful × share, rounded down to the pound; `then` and `fallsPct` as typed |
| A, B → C | `shape.then`, `shape.fallsPct`; each step's `share` = 100 × perMonth ÷ the first amount, to 2 decimal places |

A share that is not exact to two places is rounded to fit the box. The two answers then use ratios that differ by less
than one part in 10^14 of the amount. The hand-over tests hold them to the pound on every fixture, as C and A are held
today (9.6).

---

## 5. The engine: a shape becomes a target for each year

### 5.1 Where the shape lives

- **`household.shape`** (household.js typedef; new, optional): `{ unit: 'perMonth' | 'share', start: { then, fallsPct
  }, steps: [...] }`.
- **`toHousehold`** (a, b, c) writes it from the checked inputs, and only when `ratiosOf` is not null. A flat form
  gives today's household, key for key.
- **`validateHousehold`** checks the steps against `HOUSEHOLD_LIMITS` (3.7).
- **`enginePlan`** (toEngine.js) works out `plan.shape = { r: number[years], startAgeYou, stepYears }` with `ratiosOf`
  at your age at the start. **The key is added only when there is a shape**, like `plan.apart`, so a flat plan is
  today's, key for key.

### 5.2 The target for each year (toEngine.js)

**The year-0 amount stays the solved figure.** `configsAt(plan, H)`, `breakdownAt(plan, H)`, `verdictAt(sp, runner,
H)` and the band solver keep their signatures; H is the household's year-0 take-home a year.

**Periods** are also cut at each step's start year (`stepYears`, inside 0 … years). Shares between the runs depend on
money and closed pensions, never on H, so a cut that comes only from the shape gives the same shares on both sides of
it.

**In year y of period `per`, for run r**, with `potsShare(per)` (1 unless a couple apart has pay covering part):

```text
R_y    = max(0, H × r(y) × potsShare(per) − per.netTotal)
need_y = shares[per][r] × R_y
target = pension run:  closed ? 0 : gross(b.net + need_y)          (tax per person, as today)
         savings run:  savingsTargetFor(need_y)
locked = locked run, closed years: savingsTargetFor(need_y)
```

- **Where it changes:** `targetsAt`, `configsAt`, `scheduleOn` (couples apart), `joinAt` and `passOnAt` (they call
  `scheduleOn`), `unpaidOf` (the first year whose R_y falls on nobody's money), and `apartBreakdownAt` (`fromPay = H ×
  r(from) × payCovers`).
- **Cost:** where r is the same across a period (level steps, now cut at their ages) the figure is worked out once
  per period. That is bit for bit the same inputs, so only falls and moves-evenly years cost a `gross()` each.
- **The income you get anyway still comes first (T12).** In a year where `per.netTotal` ≥ H × r(y), the pots pay
  nothing, and the household has its State Pension and other pensions, as today's floor gives. `breakdownAt`'s
  take-home is max(H × r(from), netTotal).

### 5.3 The band's floor and ceiling (toEngine.js, band.js, stopAt.js)

The solver's lower bracket `kLow` must be an amount that lasts in every future. With a shape, that is the largest
year-0 amount at which the pots pay nothing in **any** year:

```text
guaranteedAtStartAYear = min over years y (skipping years the pay makes up, and years with potsShare 0) of
                         per(y).netTotal / (potsShare × r(y))
```

- Without a shape this is today's figure (the first period's, the lowest over the periods when work ends, or
  `floorApart`).
- **The ceiling `kMax`** must fail in every future. Year 0 has r = 1, so today's formula still holds when it is read
  from year 0's own floor. `plan.firstYearFloorAYear` (added only with a shape) is today's floor for year 0, and
  band.js takes kMax = floor(firstYearFloorAYear / 12 / STEP) + ceil(totalPots / STEP) + 12. Without a shape the two
  floors are the same field, and band.js is unchanged.
- **`withoutRuns`** (stopAt.js): the first year with netTotal < H × r(y).
- **`bandAt` with nothing to draw:** k = floor(guaranteedAtStartAYear / 12 / STEP), shape-aware.

**Why the search still works:** each year's need, H × r(y), rises with H (r ≥ 0), so a household that lasts at H lasts
at any smaller H. That monotone rule is the one band.js rests on.

### 5.4 What does not change, and the identity

- `fastEngine.js`, `SimulationEngine.js`, `lives.js`, `futures.js`, `saving.js`: unchanged. Both engines already read
  `targetSchedule[year]` (fastEngine.js:485, SimulationEngine.js:857), and the hooks already return year-by-year
  schedules.
- **Identity:** with `household.shape` absent, no new key, cut, loop or division is reached. Every plan, config,
  breakdown and answer is today's, byte for byte (9.1).

### 5.5 Year by year, or month by month?

**Year by year.**

- The engine plans each year's target once (fastEngine's tax sum for a year).
- Today's steps are whole ages.
- V7's ages are whole years with the birthday taken as today, so a step "from 75" starts in the plan year in which you
  are 75.
- A monthly target would change both engines and break every identity for no gain a person could see.

### 5.6 New pure readers (toEngine.js)

- **`yearsOf(plan, H)`:** for each year, age, the household amount, the part from income you get anyway (after tax)
  and the part from the pots. No engine run. It feeds the chart.
- **`breakdownByYear(plan, H, pots?, atJoin?)`:** `breakdownAt`'s per-person figures for every year (one
  `planDrawdown` per person per year). It feeds the seed (8.2) and the "Show each year" table.

### 5.7 Cost

| Case | Extra work | Check |
|---|---|---|
| One person (configs cached by k) | about 35 × `gross()` per amount tried: nothing measurable | — |
| Level steps only | none (once per period) | — |
| A couple, falls or moves evenly | ~70 `gross()` per configs per life per amount. At 0.3 µs a call (measured: 10^6 calls in 295 ms) about 0.1 s per stop age, so about 2 s for A's every-age table, about 7 s slowed four times | inside the budgets of step 4's J17, where the couple's every-age step takes 15.9 s slowed against 30 s. Measured by a speed test before merge (9.8) |

---

## 6. The solves: the whole shape moves with one figure

### 6.1 The rule

Every search finds the **year-0 amount** H. The shape moves with it: year y gets H × r(y). The answer reports the start
and each step's start:

> About £2,300 a month at the start, then as you set it: £1,950 from 75 and £1,610 from 85.

- **Each step's figure** is the year-0 amount × r at the step's first year, written by the language guide (3.5):
  nearest £10 from £1,000, £5 below.
- **Careful figures are rounded down**, so no year a person reads is higher than a year that was tested.
- **A falling step** adds where it ends: "£2,300 a month at the start, falling 1% a year to £2,020 at 74".
- **A step that moves evenly** adds "moving evenly to £1,950 at 75".

The result carries `shapeAt: { careful, middling, good }`, each a list of `{ fromAge, perMonth, then, fallsPct?,
endAge?, endPerMonth? }`, unrounded (the formatter rounds), and only when there is a shape.

### 6.2 C

- **Careful, middling and good** come from the band of the year-0 amount, through `createBandSolver` unchanged, with
  configs from `configsAt(plan, k × 120)`.
- The headline stays one figure, the start: "About £2,300 a month". The next sentence gives the steps.
- **Made-of** lines follow the periods, which are now also cut at each step, so each step's first year is shown.
- **The budget line** compares the budget's total with the start amount, as today.

### 6.3 A

- **The verdict** is at the shape as typed: `verdictAt(sp, runner, a(startAge) × first × 12)`, one run per life.
- **"Could spend"** is the band at the stop, worded as in 6.1.
- **The ages table** column becomes "Could spend at the start".
- `spare` compares the careful start with the start as typed.
- **When a row's stop is past a step's age**, that row's start amount is the step in force. The note
  `shape-step-in-force` says so on the shown row.

### 6.4 B

- **The number, the pay-in that gets there, the grid and the levers** all test the shape as typed. No scaling.
- **The "spend less" lever** moves the whole shape to the careful start: "Spend about £2,300 a month at the start
  instead (the later steps in proportion)".

### 6.5 Try a change (A, B, C; D later)

- **"−£100 / +£100"** moves the start by £100 and the later steps in proportion.
- **New: "Try it the same every year"** (T19) tests the start amount level for life and shows the usual Before / Now
  line.
- Neither changes the draft until the person presses "Use this".

### 6.6 D (when built)

- **D's verdict** is at the shape as typed.
- **"Could I spend more?"** is the band, worded as in 6.1.
- answer-D.md 5.3's single `later` amount and its per-period `ratio` are replaced by this design's per-year r.
- D's identity I-D7 ("a later amount equal to the first = no later amount") becomes I-SS2 (9.1).

---

## 7. The words on every screen

All new strings go in `src/v7/copy/shape.js`, data only. They are checked against the banned list in every scope where
they are shown (`first`, `saver`, `retired` for C, `result` for answer sentences). They do not use: net or gross, per,
real terms, today's money, compound, glide path, recommend, "will last", "guaranteed" in a result, "advise", or
"we suggest".

### 7.1 The spend step block

| Key | Words |
|---|---|
| `legend` | Does what you spend change as you get older? |
| `closed.level` | No: the same every year, going up with prices. |
| `closed.shaped` | {first} a month from when you stop, then {n} steps. (one step: "then {amount} from {age}") |
| `open` | Change it with age |
| `lead` | Many people spend more in the first years after they stop (the go-go years: travel, projects), less from their mid-70s (go-slow), and less again later (no-go), though care can cost more. Set steps by age. Every figure is after tax, at today’s prices, and goes up with prices. |
| `lead.c` | Your answer is what you could spend a month at the start. Set later ages as a share of it: 85% means 15% less. |
| `suggest` | Suggest go-go, go-slow and no-go years |
| `suggest.done` | Filled in: 15% less from {age75} and 30% less from {age85}{floor}. A typical pattern from research on how people spend, not a figure for you: change any of it. |
| `suggest.floor` | , not below your budget’s essentials of {amount} a month |
| `suggest.couple` | (for a couple, the ages are from when the younger of you is 75 and 85) |
| `suggest.none` | You start after 85, so there is nothing to fill in. Add your own steps if you like. |
| `presets` | Or: |
| `preset.level` | The same every year |
| `preset.slowly` | Slowly less |
| `preset.slowly.help` | The same for 5 years, then 1% less each year for 20 years, then the same. |
| `undo` | Undo |
| `first.row` | From when you stop at {age}: {amount} a month (the figure above) |
| `first.row.c` | From the start: 100% |
| `first.row.d` | From now: {amount} a month (the figure above) — D, and anyone who has stopped (no "when you stop" in the retired scope) |
| `step.age` | From age |
| `step.age.couple` | From when you are |
| `step.partner` | (your partner {age}) |
| `step.amount` | a month |
| `step.share.c` | % of what you start on |
| `step.ofStart` | {pct}% of the start |
| `then` | then |
| `then.level` | stays the same |
| `then.falls` | falls by …% a year |
| `then.fallsBox` | falls by {box}% a year |
| `then.glides` | moves evenly to the next step |
| `add` | + Add a step |
| `remove` | Remove |
| `remove.named` | Remove the step from {age} |
| `rescale` | Move the later steps in proportion |
| `chart.title` | What you would spend each year, after tax, at today’s prices |
| `chart.key` | Lighter: your State Pension and other pensions, after tax. Darker: from your pension and savings. Dashed: your budget’s essentials (a guide). |
| `chart.year` | At {age}: {amount} a month — {income} from {incomeWords}, {pots} from your pension and savings. |
| `chart.table` | Show each year |

### 7.2 Answers

| Key | Words |
|---|---|
| `c.shape` | That is at the start. Then, as you set it: {list}. |
| `a.couldSpend.shape` | You could spend about {start} a month at the start, then as you set it: {list}. That lasted in 9 futures out of 10. |
| `a.verdict.spend.shape` | Spending {start} a month from {stopAge}, then {list}, the money lasted until you are {endAge} in {count} futures out of 10. (A's existing verdict sentence with its spend part replaced) |
| `b.spend.shape` | To spend {start} a month from {stopAge}, then {list}, … (B's sentences, the spend part) |
| `list` | "£1,950 from 75 and £1,610 from 85". Three or more: "£1,950 from 75, £1,800 from 80 and £1,610 from 85". More than four: "{first two}, and {n} more steps (see the chart)" |
| `list.falls` | "{amount} a month at the start, falling {pct}% a year to {end} at {age}" |
| `list.glides` | "moving evenly to {amount} at {age}" |
| `spendLine.shaped` | Spending: {start} a month from when you stop, {direction} from {age}, your own figure (no budget yet). ({direction}: "less" or "more") |
| `ages.column` | Could spend at the start |
| `ages.key` | "Could spend at the start" is the careful amount at that age: the most that lasted in 9 futures out of 10. Your later steps move with it, as you set them. |
| `try.level` | Try it the same every year |
| `try.less` | Spend £100 a month less at the start (the later steps in proportion) |
| `madeOf.firstYear` | (in its first year) — added to the head of a made-of line whose step falls or moves evenly |

"About" appears once in a sentence. Typed figures never carry it (language guide 3.5). The careful start and every
careful step figure are rounded down.

### 7.3 Errors (each under its box)

| Key | Words |
|---|---|
| `fromAge.required` | Type the age this step starts, for example 75. |
| `fromAge.order` | Each step starts later than the one before: make this later than {age}. |
| `fromAge.beforeStop` | This is before you stop at {age}. Make it later, or change the figure above instead. |
| `fromAge.beforeStart.c` | This is before the money starts at {age}. Make it later. |
| `fromAge.afterEnd` | This is after the end of the plan, at {age}. Make it earlier, or remove it. |
| `perMonth.required` | Type what you would spend a month from this age, for example 2,000. |
| `perMonth.tooLow` | Type at least £1 a month. To stop a step, remove it. |
| `share.required` | Type a share of what you start on, for example 85. |
| `fallsPct.range` | Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1. |
| `glides.last` | There is no later step to move towards. Add one, or choose another. |
| `steps.tooMany` | That is more steps than years in the plan. Remove one. |

### 7.4 Notes (answers' `warnings`, severity `note`)

| Id | When | Words |
|---|---|---|
| `shape-below-income` | some year's netTotal ≥ H × r(y) | From {age} your State Pension and other pensions pay more than this, after tax (about {amount} a month): you would have that, and nothing would be taken from your pension or savings. |
| `shape-step-in-force` | A's shown row starts past a step's age | You stop at {stop}, after your step from {age}, so {amount} a month applies from the start. |
| `shape-after-end` | a step past the end (only from a hand-over; the form refuses it) | Your step from {age} is after the end of the plan, so it is not used. |
| `shape-below-essentials` (screen only: `select.js`) | a budget exists and some year is below its essentials | From {age} this is less than your budget’s essentials ({amount} a month). That is allowed: it is your figure. |

---

## 8. Keep as a plan: exact to the year

### 8.1 The seed (`src/answers/keep/planSeed.js`)

- **A flat spend** writes **version 2, byte for byte as today** (the pinned seeds in tests/v7/keep stay).
- **A spend with a shape writes version 3.** It has every version 2 field, plus:
  - `spend.shape`: `{ unit: 'perMonth', start: { then, fallsPct? }, steps: [{ fromAge, perMonth, then, fallsPct? }] }`.
    This is the household's shape as it was tested: A and B as typed; C at its careful start, unrounded to 2 decimal
    places. It is kept for the record (`fromAnswer`), the name and the description. Nothing is worked out from it.
  - **Each person's `takeHome` rows are exact to the year:** one row each year their after-tax amount changes.
    - **One person:** the rows are the shape itself, H × r(y) ÷ 12, as today's single row is the amount itself. Today's
      planner applies its own floor for the income you get anyway (T12).
    - **A couple:** the rows come from `breakdownByYear` at the answer's own amount, on the middling pots, as today's
      rows come from the phases.
    Within a shaped stretch, neighbours are merged only when equal to the penny. Today's "< £1 apart" merge stays for
    flat stretches.
- **Why bump the version:** a seed that carries a shape must not become a plan whose description leaves the shape out.
  A planner that reads only 1 and 2 refuses version 3, the established rule (PlanSeed.js:38-44). Both apps ship
  together, so this only matters for a tab left open across a release.

### 8.2 Today's planner reads it (`src/services/PlanSeed.js`)

- **`SEED_VERSIONS = [1, 2, 3]`.** Version 3 checks `spend.shape` (kinds, ages rising, amounts ≥ 0). A seed with any
  other problem is refused, as now.
- **The target, per person.** First, g(y) = round(`grossUpAnnual`(perMonth(y) × 12)) for each year of the person's own
  plan. That is today's own function on today's rows (save-as-plan.md, "the target"). Then **`compressSteps(g,
  shapeAgeNow)`**, new and pure, makes the fewest of today's income steps whose compiled amount equals g(y) to the
  pound in every year. It works greedily from year 0:
  - **level** while g repeats;
  - **glide** to a later step while the straight line between the two ends rounds to g at every year between;
  - **decline** while one rate reproduces g to the pound (this happens below the personal allowance, where after tax
    equals before tax);
  - otherwise **one step for that year**.
- **What that gives:**
  - A level step becomes one step.
  - A step that moves evenly within one tax band becomes one glide. Measured: a glide from £30,000 to £24,000 a year
    after tax maps to before tax with an error of £0.00 in every year.
  - Across a band edge it becomes two glides joined at the ages either side of the edge.
  - **A falling step becomes one step a year.** Measured: a single before-tax decline at the same 1% misses the
    after-tax figure by up to £240 a year after 10 years (£30,000 a year) and £2,289 after 20 years (£60,000 a year). A
    rate fitted to the step's last year still misses by up to £471 a year across a band edge. Neither is exact, so
    neither is used.
- **Other settings:** `incomeShape: 'phases'`, `baseSalary` = the first step, and **no `targetSchedule`**, as today (the
  engines compile it from the steps: stressTest.js:135). `targetSchedule` is written only for the £0-row case that
  writes it today.
- **The cost:** in today's planner's editor, a falling stretch shows as one row a year. The description says why: "Your
  spending falls a little each year from 75, so this plan holds it as one step a year; each gives the same after-tax
  amount as the answer." In V7's own planner (E) the shape is shown as the person set it.

### 8.3 The plan's name and description

**Names** (`src/answers/shared/planName.js`, at most 50 characters, the last part dropped first):

| Case | Name |
|---|---|
| A shape, mostly less | Stop at 62 · £2,500 a month, less from 75 |
| A shape, more later | Stop at 62 · £2,500 a month, more from 85 |
| C | From 67 · £2,300 a month, less from 75 |

**Description** (PlanSeed `describe`), one extra line: "Spending, after tax at today's prices: £2,500 a month from 62,
£2,130 from 75, £1,750 from 85." For a falling stretch it adds the sentence in 8.2.

### 8.4 What must hold (tests/planSeed.test.js, extended)

1. **For every person and every year y of their plan:** `grossToNet(round(amountAtAge(incomeSteps, shapeAgeNow + y)))
   ÷ 12` is within £0.50 of that year's `takeHome` row. This is today's must-hold 1, every year in place of every row.
2. **The same after today's planner saves the plan again.** `compileSteps` on the saved steps, and the Stress save's
   own floor-and-round rule, give the same figures within £1 a year. So nothing drifts when the person presses Save.
3. **A couple:** the two people's rows add up to the household's H × r(y) in every year where the income they get
   anyway is below it (today's must-hold 6, every year).
4. Today's must-holds 2-5 unchanged (nothing written on first open, the pots, the budget never a figure, never locked).
5. **A version 2 seed** makes exactly the plans it makes today (the frozen copy test).

---

## 9. Tests (written first; each package's tests land before its code)

### 9.1 Identities, exact

- **I-SS1, the flat corpus.** `tests/v7/shared/answers.flat.json` and `flat.v1/` (frozen copies of toEngine.js,
  band.js, stopAt.js, household.js, validate.js, schemaParts.js as committed before this work). They are written from
  the current answers before any shape code. Every fixture of A, B and C, plus random inputs from each list with the
  shape never answered, hashed whole (the `answers.sameYear` method, with `byNode`). Every case is byte for byte.
- **I-SS2, a shape that never changes is no shape.** A step equal to the start, "stays the same" (or falls by 0 from a
  hand-over): `household.shape` is absent and every figure equals the flat answer. Only the `inputs` echo differs.
- **I-SS3, cuts change nothing.** A plan cut at a step's age with r = 1 on both sides gives the same configs, value for
  value, as the uncut plan.
- **I-SS4, the engine.** The configs for a shape run through `simulate` and through the fast path give the same run-out
  month, bit for bit (speed.identity extended with shaped schedules, falls and moves evenly, couples apart).
- **I-SS5, C/A/B to the pound.** The same shape in shares (C) and amounts (A, B), with shares exact to two decimal
  places, gives the same careful start at the same stop. This is J10's one test, extended.

### 9.2 Parity with today's planner

- **PAR1:** `ratiosOf` × first equals `IncomeSchedule.amountAtAge` on the same steps at every age, the same function.
  The test reads the import, so a copy can never drift.
- **PAR2:** `suggest(first, start, 0, essentials)` × 12 equals today's `suggestSteps(first × 12, start, essentials ×
  12)` before rounding. The ages and which steps are added are the same.
- **PAR3:** the "Slowly less" preset equals `smileToSteps` on a one-step shape, year by year.
- **PAR4:** every capability row of section 1 has a named test or a screen state (a checklist test reads this
  document's table ids T1-T20 and finds each in a test title).

### 9.3 Closed forms (`env.futureReturns`: flat prices, an all-cash mix, 0% charge)

- **CF-SS1:** one person, pot P, no State Pension, spending under the personal allowance. A shape of £S to age a, then
  £S/2. The run-out is exactly where P runs dry under that schedule, by month.
- **CF-SS2:** falls d% a year from the start. The pot pays exactly Σ 12S(1 − d)^y; careful = the largest £10 S that P
  covers to the end.
- **CF-SS3:** moves evenly from S1 to S2. The same with the straight line.
- **CF-SS4:** a State Pension above a late step. The pots pay 0 from that year, and the note shows from that age.

### 9.4 Properties (generated households, 200 lives; held to one £10 step where `exceptions.md` allows)

- **P-SS1:** a shape lower or equal in every year never lasts in fewer futures.
- **P-SS2:** more pot never lowers the careful start.
- **P-SS3:** the band is monotone: careful ≤ middling ≤ good; at kLow every future lasts; at kMax every future fails.
- **P-SS4, scaling:** the careful start for shape S equals that for S × c (every amount × c), within one £10 step after
  the division by c. The shares are the same.
- **P-SS5, swap:** a couple with you and your partner swapped, ages moved so the steps are the same years, gives the
  same figures.
- **P-SS6, sentences:** every sentence's text equals its parts joined; every step figure in a sentence equals the
  formatted `shapeAt` value; no banned word in any scope.

### 9.5 Inputs

- **Schema:** the new fields have no default (C's schema test's named exception list grows by `shape.*`, A's and B's
  by `spend.then` / `spend.fallsPct` / `spend.steps`).
- **Boundaries:** ages at stop ± 1 and end ± 1; amounts 0, 1, 50,000, 50,001; falls 0, 0.25, 10, 10.25, 0.3; glides on
  the last step; two steps at one age; steps = years and years + 1.
- **Pairs:** `cases.pairs.json` gains the dimension "shape: none / one step / suggest / falls / moves evenly / step
  before the stop" in A, B and C.

### 9.6 Hand-overs (tests/v7/cross/handOver.test.js)

Every route of 4.5, both ways:

- The carried figures are as the table says.
- A → C → A gives the same steps when the shares are exact.
- C → A tests a shape no higher than C's in any year, so A's verdict on C's careful amount is "yes".

### 9.7 Screens and the browser

- **States** (tests/v7/states): `a/spend-shape-closed`, `a/spend-shape-open`, `a/spend-shape-suggested`,
  `a/spend-shape-errors`, `a/answer-shape`, `b/answer-shape`, `c/numbers-shape`, `c/answer-shape`,
  `c/answer-shape-couple`. Each is rendered and word-checked.
- **e2e:**
  - `spend-shape.spec.js` at 390, 768 and 1280 px:
    - add three steps by keyboard alone;
    - Suggest, then Undo;
    - each "then";
    - remove a step;
    - "Show each year";
    - no sideways scroll;
    - axe clean.
  - The chart's bars equal `yearsOf` to the pound (the number on screen equals the engine's).
  - `keep.spec.js` gains a shaped save: the plan's steps net back to the answer every year.

### 9.8 Timing (night job, run alone)

- A's every-age step for a couple with a falling shape stays inside J17's budget (30 s slowed).
- C's answer step with a shape stays within 1.15 × C flat.

---

## 10. Build packages (files are disjoint; tests first in each)

| # | Package | Files (only these) | Tests it brings | After |
|---|---|---|---|---|
| S0 | **Pin the flat corpus** | tests/v7/shared/answers.flat.json, flat.v1/*, answers.flat.test.js | I-SS1 | — |
| S1 | **The model** | src/answers/shared/shape.js (new: `ratiosOf`, `suggest`, presets, `rescale`, `shareOf`, `listParts`) | PAR1-PAR3, unit tests of each function | S0 |
| S2 | **The engine** | src/answers/shared/toEngine.js, band.js, stopAt.js, household.js | I-SS2-SS4, CF-SS1-4, P-SS1-5, speed.identity extended | S1 |
| S3 | **The inputs** | src/answers/shared/validate.js (`steps` type), schemaParts.js, a/schema.js, b/schema.js, c/schema.js, a/toHousehold.js, b/toHousehold.js, c/toHousehold.js | 9.5 | S1 (parallel with S2) |
| S4 | **The answers and words** | a/answer.js, b/answer.js, c/answer.js, c/onLives.js, a/sentences.js, b/sentences.js, c/sentences.js, shared/contract.js | I-SS5, P-SS6, fixtures with expected sentences (below) | S2, S3 |
| S5 | **The screens** | src/v7/components/StepsField.jsx, ShapeChart.jsx (new), components/index.js, Budget.jsx (SpendBeside rescale line), TryAChange.jsx, AgesChart.jsx (header), screens/a/SpendScreen.jsx, screens/c/NumbersScreen.jsx, state/reduce.js, state/actions.js, state/select.js, state/carry.js, copy/shape.js (new), copy/a.js, copy/b.js, copy/c.js, styles/tokens.css, styles/components.css | 9.6, 9.7 states and e2e, wording | S4 |
| S6 | **Keep as a plan** | src/answers/keep/planSeed.js, src/answers/shared/planName.js, src/services/PlanSeed.js, src/ui/components/NewPlanFromSeed.js (the description line only) | 8.4, tests/v7/keep/*, tests/planSeed.test.js | S4 (parallel with S5) |

- **Files this work does not touch:** index.html, every repository, DecisionService, PlanLock, LifeStage, the
  onboarding tour (the lock-safety workflow's files), and src/services/IncomeSchedule.js (imported, never edited).
- **The 2028 package** (owner's decision: everyone it applies to) touches apart.js and the three sentences.js files. It
  should land **before S4**. If it lands after, S4 rebases onto it (the two changes are in different functions).
- **Fixtures, each with its expected plain sentence:**

| Id | Case |
|---|---|
| SS1 | 62, stops now, £2,500 a month, Suggest |
| SS2 | A couple, 66 and 60, "Slowly less" |
| SS3 | C from 67, 85% from 75, falls 1% a year from 85 |
| SS4 | B, a step up for care: £3,000 from 85 |
| SS5 | A couple apart with a shape |
| SS6 | Stop at 55 on savings with a falling first amount |
| SS7 | A State Pension above the no-go step (the note) |
| SS8 | A row of A's table past a step |

---

## 11. What this changes in other designs

1. **answer-D.md:**
   - Question 2 ("a different amount from a later age?") is answered by the full shape. 3.3's "later amount" box is
     replaced by 4.2's block.
   - 5.3 is replaced by 5.2 here.
   - `later` in the result becomes `shapeAt`.
   - I-D7 becomes I-SS2; CF-D7 becomes CF-SS1.
   - Seed version 3 is the shape's. D's bought rows take version 4, or join 3 if D ships in the same release.
2. **budget-step.md:**
   - The essentials subtotal gains two uses: the floor of the Suggest button (only when pressed, and the note names
     it), and the chart's dashed guide line.
   - Neither reaches an answer. The "answers never read budget fields" test stands.
3. **E (the planner in V7):**
   - The spending section uses this block and the compressor, so there is one shape editor everywhere and today's
     steps are written exactly.
   - Lump sums bring `raiseFrom` (T16).
   - The shape's words feed the compare page's summary (T17).
4. **The 2028 note:** in force for everyone it applies to (its own package, 10). The shape does not change who it
   applies to, and the note carries no amount, so nothing here touches it.
5. **save-as-plan.md:** the "takeHome" row rule becomes "exact to the year" for shaped seeds (8.1). The target table's
   incomeSteps line becomes `compressSteps` (8.2).

---

## 12. Draft release note (no version bump made; for whoever ships S6)

> **Minor (6.21.0) — Spending that changes with age, in the new questions (preview)**
> - *Changes:* In the preview questions, what you spend can now change with age, as in Stress tester → Your income
>   shape: any number of steps by age, each staying the same, falling by a percentage a year, or moving evenly to the
>   next. "Suggest go-go, go-slow and no-go years" fills in 15% less from 75 and 30% less from 85, not below your
>   budget's essentials. Answers give the amount at the start and each step's amount, and a chart shows every year.
> - *Effects on saved plans:* none. A plan kept from an answer whose spending changes with age gets income steps that
>   give the answer's after-tax amount in every year. Where it falls a little each year, that is one step a year.
> - *Corrections:* none.

---

## 13. Choices made on the owner's standing go-ahead ("go with recommended on most")

Each was decided as recommended. Say if any should change.

1. **Couples' ages are yours, with your partner's beside them, and the suggestion uses the younger of you.** The
   alternative, the older of you, makes go-slow come sooner and the answers a little higher (less cautious).
2. **Keep writes exact steps, one a year where spending falls, not a single "falls 1%" step in today's planner.** The
   alternative reads more neatly in today's editor but misses the answer by up to £2,289 a year (measured, 8.2).
3. **C takes later steps as shares of the start.** C works the start out, so a later amount in pounds would mean
   nothing until the answer exists.
4. **Falls go up to 10% a year** (today's slider stops at 5%).
5. **"−£100" in Try a change moves the whole shape in proportion.** The alternative moves only the start.

---

## 14. As built in the /v7/ preview (2 Oct 2026)

Built as designed, with these differences. The parity ledger (tests/v7/parity/ledger.json, research/v7/parity-ledger.md)
holds every T-row's V7 home; tests/v7/screens/shapeParity.test.js has one test per T-row.

1. **T14, the budget too.** Beside each later step: "85% of the start", and with a budget "85% of the start, 71% of your
   budget (a guide)", as today's "— 85% of today's budget".
2. **The spend step's picture has no layers yet.** There is no year-by-year income figure before the answer is worked
   out (the engine package carries `byYear` on the result in place of a separate `yearsOf`), so the spend step draws the
   shape alone. Section 15.1 designs them, with the floor note while the steps are set (15.2); both are "not yet" in the
   parity ledger. The answer's picture (A, B and C) has the layers: State Pension and other pensions lighter, pension and
   savings darker.
3. **"Try it the same every year" edits what is typed**, like every other control in "Try a change", and "Put back my
   steps by age" undoes it. The Undo, its line and the figure the steps were set against are kept with the draft, so a
   reload of the tab never loses the steps (shapeDraft.js `keptShapeExtras`).
4. **The plan's band ceiling** is `plan.shape.topAYear` and `topShare`, not `firstYearFloorAYear`; `compressSteps` also
   looks for a fall at quarter-point rates — only up to today's slider's 5% a year (`PLANNER_DECLINE`, read from today's
   editor by the test). A faster fall (V7 allows 10%) is one step a year: kept as one step, today's slider showed 5% beside
   a label saying 7.5%, and touching it changed the fall (review, 2 Oct 2026).
5. **T16 (a lump sum into income) waits for lump sums** (ledger row income.lump-to-steps, `waitsFor` inc.lump-sums).
6. **A's and B's answers say the figure is the start.** The verdict band is followed by "That is at the start. Then, as
   you set it: …" (A: under the band; B: after the first headline's sentence that names the spending), and A's "What you
   could spend" gives the careful start with the later steps moved with it. "One more year" says "a month more at the
   start, with the later steps in proportion" (not "for life"); each row of A's ages says "at the start"; B's "paying in as
   now" figure says "with the later steps in proportion". Flat answers keep their words, byte for byte.
7. **Where a fall ends is rounded once**, from the year's own figure (£2,044.77 is "£2,040", never £2,045 and then £2,050).
8. **A stop at or after a step (review, 2 Oct 2026).** In A, "show me ages" lets a step be anywhere after today, so the
   stops past it start on the step (3.5). Everything about such a stop now reads the figure tested there: the line under
   the verdict ("spending £2,377 a month after tax from 67"), the verdict's sentence ("what you spend, as you set it"),
   each row of the ages (`spendAtStart`, the row's own figure, only on a row past a step), the note (a stop AT the step's
   age: "Your step from 64 starts as you stop"), "Try a change" ("Spending you typed, before any step"), and what is kept:
   the seed's `spend.perMonth` is the figure tested and its shape starts on the step in force, so the summary, the name and
   the description start from it, in age order. The hand-overs too: B's stop and C's start after such an answer are past
   the step, so they start on it (carry.js `atStartOf`: the step's fall as the first amount's, the later steps only; B's
   box the figure A tested there, to the pound, down; C's shares of it) — carried as typed, B and C refused the steps
   before their start. A's invariant A-I5 holds each row's band to the figure that row tested.
9. **"Slowly less" asks for a stop under "show me ages".** It counts its five years from when the money starts, as
   today's `smileToSteps` counts from the plan's start; with no stop there is no start, and anchored at today's age it was
   today's setting for no stop shown. "Suggest go-go, go-slow and no-go years" still works there: its ages are ages.

## 15. Not built yet: the picture while you set the steps, the markers, the motion (design, 2 Oct 2026)

The review of the built shape found parts of today's picture the preview does not have (parity ledger: "The spending
shape: not yet in V7"). Each is designed here; none is retired.

### 15.1 The layers, and the budget's total, while you set the steps

- **Today:** the editor's staircase draws the State Pension (from its date) and other income (a final-salary pension,
  income streams) inside each bar as the steps are typed, before any test, and marks the budget's total with a short line
  at the left (`incomeStaircaseSvg` `sp`, `other`, `budgetGross`).
- **V7:** the spend step's picture gains the same two layers, in after-tax pounds, as the answer's picture has them. The
  figures come from the plan the inputs already make: `enginePlan(toHousehold(checked inputs))` and the pure reader
  `yearsOf(plan, H)` of 5.6 (each year: your age, the household's figure, the part the incomes you get anyway pay after
  tax, the part from the pots). No engine run, no lives: a few milliseconds, on the screen's thread.
- **When:** only when the inputs parse and a stop age is known. With "show me ages" there is no start, so the picture stays
  the shape alone, as now, and says so in its key.
- **The budget's total:** with a budget, a short dashed mark at its total a month at the left, named in the key: "Short
  dashed line: your budget's total (a guide)". From `select.js` (`budgetMonthly`), never from an answer.
- **Tests:** the bars' figures equal `yearsOf` to the pound (the screen test reads `data-figure`, `data-income`); the
  layers equal the answer's own `byYear` for the same inputs, year for year; the budget's mark is absent without a budget.

### 15.2 "Below the income you get anyway", while you set the steps

- **Today:** an orange note under the editor: "From age 85 the shape would fall below your guaranteed income …".
- **V7:** the answer's own words (`shape-below-income`, 7.4), shown under the steps from the same `yearsOf` figures (the
  first year whose income you get anyway, after tax, is more than the shape's figure). Screen only (`select.js`); a note,
  never a warning colour alone.

### 15.3 The markers for lump sums and one-off costs

- **Today:** ▲ a lump sum and ▼ a one-off spend (with its years) at their ages, labelled with the amount.
- **V7 (after 16 and 17):** under the bar of that year, a small mark (▲ money coming in, ▼ a one-off cost) with its
  amount in the key line, the year's line under the picture ("At 70: £2,300 a month … and a one-off cost of £20,000, a new
  car") and a column in "Show each year". Never inside the bar's height: the bar stays what is spent from the shape.

### 15.4 The motion between shapes

- **Today:** the bars and the line ease from the old shape to the new one over about half a second.
- **V7:** each bar is drawn at its full height and scaled (`transform: scaleY(value / top)`, from the bottom), so a
  change is a CSS transition of 0.3 s on the transform, which every browser animates; the figure (`data-figure`) is the
  new one at once, so nothing a test or a screen reader reads waits for the motion. None at all under
  `prefers-reduced-motion: reduce`.

## 16. One-off costs by age (today's "Extra spend", T21) (design, 2 Oct 2026)

### 16.1 Where it sits, and what it asks

- **A, B and D:** on the spend step, under the steps: "Any one-off costs? A car, a roof, a wedding." [+ Add a one-off
  cost]. **C:** under "Add more detail", after the shape.
- **Each cost:** a name (optional, up to 40 characters); an amount after tax, at today's prices (£1 to £1,000,000); an
  age (yours; a couple's ages as in 3.6); "once" or "every year for [N] years" (1 to the years left); and "going up with
  prices" (the default) or "a fixed sum" (today's "Fixed £ (nominal)").
- **The budget stays a guide:** when the budget sheet has one-off costs, one tap, "Use the budget's one-off costs",
  copies them in (each at its year's age, "once"); nothing is read from the budget otherwise.

### 16.2 The model and the engine

- **Inputs:** `spend.extras` (A, B, D) and `extras` (C): `[{ label?, amount, atAge, years, prices: 'rise' | 'fixed' }]`,
  checked by the `steps` type's rules (ages whole, after today and after the stop, before the end).
- **Each year's need:** the household's figure H × r(y) plus that year's costs X(y), after tax. The per-person split and
  the tax are worked out as in 5.2: `R_y = max(0, H × r(y) + X(y) − per.netTotal)`. Costs never move with a solve (they
  are not a share of H), so every search is still monotone in H.
- **A fixed sum** is X ÷ the price level reached in that future by that year, per life. The fast path learns today's
  `extraWithdrawals` "level" rule (bit for bit against `simulate`, speed.identity extended); until it does, a plan with a
  fixed sum runs on `simulate`.
- **The band's floor (5.3):** `guaranteedAtStartAYear` becomes the least over the years of `(netTotal − X(y)) ÷ r(y)`,
  not below 0. A cost that cannot be paid even at £0 a month in a bad case is said in a note: "In a bad case your money
  runs out before your one-off cost at 78 (£20,000)."
- **Identity:** no costs, no new key, cut or division: every answer is today's, byte for byte (the flat and shaped
  corpora).

### 16.3 Words

- Made-of lines in a year with a cost: "At 70 there is also a one-off cost of £20,000 (a new car)."
- The answer's shape sentence gains ", with one-off costs of £20,000 at 70 and £15,000 at 78".
- Errors under each box, as 7.3 ("Type the age this cost is paid, for example 70.").

### 16.4 Keep as a plan

- **Today's keys:** each person's `extraWithdrawals`: `{ label, amount, year, years, indexation }`, `year` the plan year
  (age − the plan's start), `indexation` 'cpi' (going up with prices) or 'level' (a fixed sum).
- **The amount is before tax and exact to the year:** for each year, round(grossUpAnnual(row × 12 + x × 12) −
  grossUpAnnual(row × 12)) a year, x being this person's share of the cost; equal neighbouring years are one entry with
  `years`. Must hold: today's target plus `extraWithdrawalFor` nets back to the answer's row plus the cost within 50p a
  month, every year (8.4's rule).
- **Seed:** version 3 gains `spend.extras` (a seed version 4 if it ships after version 3 is live).

### 16.5 Tests and package

- Closed forms (9.3's environment): one person, a cost of £C at age a: the run-out month is exactly where the pot runs dry
  under the schedule; the careful start is the largest £10 the pot covers with the cost taken.
- Properties: a cost never raises the careful start; a larger cost never lasts in more futures.
- Screens and e2e as 9.7: add, remove and edit by keyboard; the markers (15.3); no sideways scroll at 390 px.
- **Package E1** (after this review's fixes): the model and inputs, then the engine, then the words, the screens and Keep,
  as section 10's order.

## 17. Lump sums, and turning one into income (T16) (design, 2 Oct 2026)

### 17.1 Where it sits

- **A and B:** on the pots step, "Money you expect to come in" [+ Add]: an amount, an age, and what it is: "cash" (the
  default), "an inherited pension" or "an inherited ISA". **C:** under "Add more detail". **D:** with the pots.
- A couple: whose it is (you / your partner), as the pots are each person's.

### 17.2 The engine

- **Where it can go is today's own rule:** `routeWindfall` (TaxableSleeve.js, imported): cash first to the ISA allowance
  of that year, then to the pension up to its room (the larger of earnings and £3,600, at most £10,000 once money has
  been taken flexibly, else £60,000: `sippRoomFor`), and the rest to a taxable account; an inherited pension joins the
  pension run, an inherited ISA the savings run.
- **The runs:** the lump arrives in its year in the runs it routes to. The taxable part uses today's taxable sleeve
  (`taxableStart`-style, with its tax), which the fast path must learn bit for bit against `simulate` (or the plan runs on
  `simulate` until it does).
- **A lump before the stop** (A and B) joins the saving years: the pot at the stop includes it in every future.

### 17.3 "Turn it into income" (today's T16)

- Under each lump sum on the spend step: "Spread over the {n} years left, £{x} a month more from {age}" and one tap,
  "Add £{x} a month from {age}". The figure is today's (`amount ÷ years left`), after tax: V7's units.
- **`raiseFrom(age, perMonth)`** (shape.js): the step in force at that age gets a new step at the age, raised by
  `perMonth`, and every later step is raised by the same, as today's `spendLumpSum`. The lump sum stays: it is the money
  that pays for it. Undo, as for a suggestion.
- **Test:** PAR5 — `raiseFrom` × 12 equals today's `spendLumpSum` on the same steps, year by year; the T16 to-do in
  shapeParity.test.js becomes a test.

### 17.4 Keep as a plan

- Each person's `windfalls`: `{ label, amount, year, wrapper, mix, toIsa }` as today's planner writes them, the year the
  plan year; the routing is today's, so the plan and the answer put the money in the same places.

