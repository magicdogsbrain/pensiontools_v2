# V7 — the screens for questions A and B

**A — "When can I afford to stop work?"** and **B — "Am I saving enough, and what should I pay in?"**, drawn in
the rail and the language the first slice (question C) established. Written 30 Sep 2026 against v6.17.0, with
question C built and published unlinked at `/v7/`. Nothing in this document is built.

It follows `rail-screens-language.md` (the rail rules, Part 3's language guide and banned list), the build
brief's contracts (`step3-build-brief.md` section 4) and the patterns in `src/v7/screens/c/`,
`src/v7/rail/`, `src/v7/copy/` and `src/answers/c/`. Where it changes something those documents said about
A or B (the outline rails in Rail 1.5, the one-line templates in Rail 3.3), it says so and why. The answer
contract for A and B — the full result objects and the saving-years arithmetic — is a separate document;
section 7 lists only the keys the screens draw, so the drawings can be tested as C's are.

Three things to know before reading:

- **Every figure in a drawing is made up** to show layout and wording. None was computed. Real figures come
  from `answerA` and `answerB`. One made-up household is used throughout each question so the drawings agree
  with each other (A: age 50, £250,000 pot, £40,000 savings, paying in £600 a month, wants to stop at 60 on
  £2,000 a month; B: age 45, £180,000 pot, paying in £700 a month of which £250 is the employer's, wants
  £2,000 a month from 60).
- **The drawings use plain keyboard characters**, as C's did: `[x]` done, `[>]` you are here, `[ ]` not
  done yet, `(o)` a chosen option, `v` something that opens, `#` a filled bar, `.` an empty one.
- **The owner's decisions bind every drawing** (plan of plans section 7, and the brief for this document):
  the saving years are simulated on the same futures as the years after stopping, with a risk level of their
  own; "a bad case" is the worst 1 in 10; the headline is the careful figure (9 in 10); every number is from
  a pure function with a declared input list; the existing engine does the years after stopping through the
  same adapter and fast path as C; a couple gets short first questions with full detail on demand; a
  final-salary pension is asked by start age; stopping before 57 paid from ISA or savings must work; a
  retired person never sees a countdown.

Contents: 1 the two questions in one page · 2 the rail as data · 3 question A's screens · 4 question B's
screens · 5 how C, A and B hand over · 6 empty, working and failed states · 7 the keys the screens draw and
the sentence templates · 8 what the tests read · 9 additions to the language guide and the banned list ·
10 decisions for the owner.

---

## 1. The two questions in one page

| | A — When can I afford to stop work? | B — Am I saving enough, and what should I pay in? |
|---|---|---|
| Who asks it | S01 (a named age in the next 0–5 years), S03 (no fixed age: show me a range), S04 (the years before the State Pension), S10 (part-time), S17 (one more year), S12 (forced out: is what I have enough to a named age) | S02 (what's my number, am I on course, what are my options), S22 (can I ease off paying in) |
| Types, single person | age, pot, the age in mind, what you spend | age, pot, what you pay in, the age in mind (and an amount or a level to spend) |
| Starts sensible | paying in (blank = nothing), savings (0), State Pension (full), final-salary (none), risk while saving (Balanced), risk once stopped (Balanced), lasts to 95, no part-time | savings (0), State Pension (full), final-salary (none), risk while saving (Balanced), risk once stopped (Balanced), lasts to 95, employer's part (inside the figure) |
| The headline | a verdict at the named age: **Yes** / **Close** / **Not at 60 on these figures**; or, with "show me ages", the earliest age that lasted in 9 futures out of 10 | **the number**: the pot wanted by the stop age; then **the pay-in**: the monthly amount that reaches it in 9 futures out of 10 |
| Always beside it | the three amounts you could spend from that age (careful, middling, good); the bad case; the years before the State Pension, pot by pot; a small chart of ages side by side; what one more year buys | the chance of reaching the number at what you pay in now, as "in N futures out of 10"; the bad-case pot and how far short; the ways to make it fit, side by side |
| Try a change | stop age · pot · spending · part-time years · risk while saving · risk once stopped | pay in · stop age · spending · pay in until age · risk while saving |
| Leads to | B ("Am I saving enough for that?"), C ("What is that a month?"), keep | A ("When could I stop?"), C, keep |

**How the number is made** (for the builder; the detail is the answer contract's). One future is one long
market path. Its first months are the saving years: the pot and savings grow on that path in the *saving*
risk mix, with what is paid in added every month and rising with prices. At the stop age the pot as it then
stands is handed to the same drawdown run C uses (`toEngine` → the fast path replica of today's engine,
`fastEngine.js`; `simulate` where the replica does not apply), on the *rest of the same path*, in the
*once-stopped* risk mix. So a crash in the year before stopping and the year after is one crash, seen once.
For A, at each age shown: the most that lasted in 9 futures out of 10 is solved as C solves it, and the
named spending is tested once per future ("lasted"). For B: the number is the pot for which the careful
amount from the stop age equals the spending wanted; the pay-in is the smallest monthly amount that reaches
the number in 9 futures out of 10; each lever is the same solve with one input changed. No fixed 2%, 5% or
8% line appears anywhere.

---

## 2. The rail as data

### 2.1 Question A

The outline in Rail 1.5 had six steps (`numbers`, `answer`, `ages`, `one-more-year`,
`before-state-pension`, `part-time`). This document folds the last three into the answer step, as C folded
"what it is made of" and the assumptions into its answer: **the first answer is two screens from the front
door**, and "one more year", "the years before your State Pension" and "part-time" are parts of it, not
places to go. `ages` stays as the full table for people who want every age; `part-time` becomes a switch on
the numbers step and a row in try-a-change.

| # | Step id | Label on the rail | Short label | Optional | What it needs first | Short result when done | End? |
|---|---|---|---|---|---|---|---|
| 1 | `numbers` | What have you got, and what do you want to spend? | Your numbers | no | nothing | "£250,000, age 50, stop at 60, £2,000 a month" (add "and a partner") | no |
| 2 | `answer` | Could I stop at {60}? / Which ages could I stop at? | Could I stop? | no | pot, age, the age in mind (or "show me ages"), what you spend — asked on this step if missing | "Yes at 60" · "Close at 60" · "Not at 60" · "Earliest that worked: 61" | no |
| 3 | `ages` | What about every other age? | Every age | yes | the answer | "Earliest that worked: 61" | no |
| 4 | `keep` | Keep this plan? | Keep this plan | yes | the answer | "Kept 30 Sep 2026" | yes |

The `answer` label follows the choice on the numbers step: "Could I stop at 60?" when an age or a date was
given (the date reads "Could I stop in June 2030?"), "Which ages could I stop at?" when "show me ages" was
chosen. The label is words from `copy/a.js` with the age filled in; it is never a figure the answer produced.

```js
// src/v7/rail/a.js — data only, as rail/c.js
export const QUESTION_A = {
  id: 'a',
  steps: [
    { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
    { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.pot', 'you.age', 'stop.kind', 'spend.kind'] },
    { id: 'ages',    optional: true,  built: true,  end: false, needs: ['answer'] },
    { id: 'keep',    optional: true,  built: false, end: true,  needs: ['answer'] }
  ]
};
/** The next sentences, in the order they are tried (first match wins). */
export const NEXT_A = ['a.retired', 'a.failed', 'a.working', 'a.blank', 'a.fix', 'a.ready',
                       'a.no', 'a.close', 'a.yes', 'a.ages', 'a.ages.none'];
```

**The next sentence for question A** — one per state, first match wins. `{…}` filled from the state or the
result; a figure in a sentence is drawn by `Money` from the result, as the rail's short results are today.

| Id | When | The sentence | Button |
|---|---|---|---|
| `a.retired` | the figures say the money starts now and a State Pension is already paid (carried from C or D) | This question is for people who are still working. Your figures say you have stopped. | Will it last? (→ D) |
| `a.failed` | the last run failed | Next: try again. Your numbers are still here. | Try again |
| `a.working` | a run is under way | Working out your answer. | — |
| `a.blank` | pot, age, the age in mind or spending missing | Next: four things are enough — your age, your pot, the age you have in mind and what you spend. | — |
| `a.fix` | a figure is outside what we can use | Next: check the figure marked below. | — |
| `a.ready` | everything given, no answer yet | Next: press "Show if it works". | Show if it works |
| `a.no` | answered; verdict `no` | Next: the earliest age that worked is {earliest}. Try it below, or see every age. | See every age |
| `a.close` | answered; verdict `close` | Next: try one more year, or a little less spending, below. | — |
| `a.yes` | answered; verdict `yes` | Next: see what one more year buys, or keep this plan so you can come back to it. | Keep this plan |
| `a.ages` | answered with "show me ages"; at least one age worked | Next: press an age in the table to see it in full. | — |
| `a.ages.none` | answered with "show me ages"; no age up to 75 worked | Next: try spending a little less below, or see what the pot pays a month. | What is that a month? (→ C) |

`a.retired` is Rail 1.5's hidden-step sentence, made a rail state rather than a hidden step: A is never
hidden from the address bar (rule R7), it simply says who it is for and offers D. Its screen is in 6.4.

### 2.2 Question B

Rail 1.5's outline had five steps (`numbers`, `target`, `answer`, `pay-in`, `choices`). This document
folds `target` into `numbers` (the amount or level to spend is one field, asked with the others) and
`pay-in` into `answer` (the number and the pay-in are the two headlines of one screen). `choices` stays: it
is the grid of stop age against pay-in for people who want to try two levers together.

| # | Step id | Label on the rail | Short label | Optional | What it needs first | Short result when done | End? |
|---|---|---|---|---|---|---|---|
| 1 | `numbers` | What have you saved, what are you paying in, and what do you want? | Your numbers | no | nothing | "£180,000, age 45, £700 a month in, stop at 60" | no |
| 2 | `answer` | Am I on course, and what should I pay in? | The number | no | pot, age, pay-in, the age in mind, an amount or a level — asked here if missing | "About £470,000 by 60. Pay in about £1,050 a month" / "On course for 60" | no |
| 3 | `choices` | What if I stop later, or pay in more, or both? | Two levers together | yes | the answer | "Stop at 62 on £700 a month" (the cell pressed, if any) | no |
| 4 | `keep` | Keep this plan? | Keep this plan | yes | the answer | "Kept 30 Sep 2026" | yes |

```js
// src/v7/rail/b.js
export const QUESTION_B = {
  id: 'b',
  steps: [
    { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
    { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.pot', 'you.age', 'payIn.total', 'stop.age', 'spend.kind'] },
    { id: 'choices', optional: true,  built: true,  end: false, needs: ['answer'] },
    { id: 'keep',    optional: true,  built: false, end: true,  needs: ['answer'] }
  ]
};
export const NEXT_B = ['b.retired', 'b.failed', 'b.working', 'b.blank', 'b.fix', 'b.ready',
                       'b.none', 'b.short', 'b.onCourse'];
```

| Id | When | The sentence | Button |
|---|---|---|---|
| `b.retired` | the figures say the money starts now (carried from C or D) | This question is for people who are still paying in. Your figures say you have stopped. | Will it last? (→ D) |
| `b.failed` | the last run failed | Next: try again. Your numbers are still here. | Try again |
| `b.working` | a run is under way | Working out your answer. | — |
| `b.blank` | pot, age, pay-in, the age in mind or spending missing | Next: your age, your pot, what goes in each month, the age you have in mind and what you want to spend. | — |
| `b.fix` | a figure is outside what we can use | Next: check the figure marked below. | — |
| `b.ready` | everything given, no answer yet | Next: press "Show what I need". | Show what I need |
| `b.none` | no pay-in up to the limit reaches the number | Next: try a later age or a lower amount below. | — |
| `b.short` | answered; the chance at today's pay-in is under 9 in 10 | Next: pick one of the ways to make it fit below, or try two together. | Two levers together |
| `b.onCourse` | answered; 9 in 10 or better at today's pay-in | Next: you are on course. Try a change below, or keep this plan so you can come back to it. | Keep this plan |

### 2.3 What changes elsewhere

| File | Change |
|---|---|
| `src/v7/rail/questions.js` | `a` and `b` become `built: true`; `BUILT` gains `a: QUESTION_A, b: QUESTION_B` |
| `src/v7/rail/index.js` | `railFor` reads `BUILT[route.q]`, `NEXT_*` and the short-result builders by question; the C-only checks (`route.q !== 'c'`) go |
| `src/v7/router/routes.js` | `ROUTES` gains `#/a/:step` and `#/b/:step`; `#/soon/a` and `#/soon/b` become not-found (a built question is never "soon") |
| `src/v7/state/select.js` | `SCHEMAS` gains `a: SCHEMA_A, b: SCHEMA_B`; `draft` and `answers` hold `a` and `b` beside `c` |
| `src/v7/copy/a.js`, `copy/b.js` | the words, keyed as `copy/c.js` is |
| `src/answers/index.js` | `ANSWERS.a`, `ANSWERS.b` |
| C's "What next?" | the two "still working" links open `#/a/numbers` and `#/b/numbers` with the figures carried (section 5), not `Soon` |
| The front door | A and B open their numbers step. No box on the front door for either (decision 10.7) |

On a phone the rail is the one line that opens (Rail 1.7), unchanged: "Step 2 of 4: Could I stop?" and the
next sentence under it.

---

## 3. Question A — the screens

### 3.1 Step 1, "What have you got, and what do you want to spend?"

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| WHEN CAN I AFFORD TO STOP WORK?                                            |
| [>] 1 What have you got, and what do you want to spend?                    |
| [ ] 2 Could I stop at 60?   [ ] 3 What about every other age? (optional)   |
| [ ] 4 Keep this plan? (optional)                                           |
| Next: four things are enough - your age, your pot, the age you have in     |
| mind and what you spend.                                                   |
+----------------------------------------------------------------------------+
|                                                                            |
| What have you got, and what do you want to spend?                          |
| Rough figures are fine. You can change any of them afterwards.             |
|                                                                            |
| Your age                    [ 50 ]                                         |
|                                                                            |
| Your pension pot          £ [ 250,000    ]                                 |
|                           All your pension pots added together.            |
|                                                                            |
| Going in each month       £ [ 600        ]                                 |
|                           Everything that lands in your pension each       |
|                           month, including your employer's part. Leave     |
|                           it blank if nothing goes in.                     |
|                                                                            |
| Other savings you         £ [ 40,000     ]                                 |
| would spend               ISAs, cash, investments. 0 if none.              |
|                                                                            |
| When do you have in mind? (o) Age [ 60 ]                                   |
|                           ( ) A month:  [ June   v ] [ 2030 ]              |
|                           ( ) I have no age in mind - show me ages         |
|                                                                            |
| What you would spend      (o) £ [ 2,000   ] a month after tax              |
|                           ( ) I don't know - pick a level:                 |
|                               ( ) Basic  ( ) Moderate  ( ) Comfortable     |
|                           What it costs to live, at today's prices.        |
|                                                                            |
| Some part-time work       (o) No                                           |
| after you stop?           ( ) Yes: earning £ [        ] a year before      |
|                               tax, for [   ] years                         |
|                                                                            |
| State Pension             (o) The full amount: £12,548 a year from age 67  |
|                           ( ) My forecast:  £ [        ] a year            |
|                           ( ) None                                         |
|                                                                            |
| A final-salary or         (o) No                                           |
| career-average pension?   ( ) Yes:  £ [        ] a year, from age [    ]   |
|                                                                            |
| [ + Add a partner ]      [ + Add more detail ]                             |
|                                                                            |
| [ Show if it works ]                                                       |
|                                                                            |
| Your figures stay in this browser until you choose to keep the plan.       |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| When can I afford to stop work?      |
| Step 1 of 4: Your numbers         v  |
+--------------------------------------+
| What have you got, and what do you   |
| want to spend?                       |
| Rough figures are fine.              |
|                                      |
| Your age                             |
| [ 50 ]                               |
|                                      |
| Your pension pot                     |
| £ [ 250,000                  ]       |
| All your pension pots together.      |
|                                      |
| Going in each month                  |
| £ [ 600                      ]       |
| Including your employer's part.      |
| Blank if nothing goes in.            |
|                                      |
| Other savings you would spend        |
| £ [ 40,000                   ]       |
| ISAs, cash, investments. 0 if none.  |
|                                      |
| When do you have in mind?            |
| (o) Age [ 60 ]                       |
| ( ) A month: [ June  v ] [ 2030 ]    |
| ( ) No age in mind - show me ages    |
|                                      |
| What you would spend                 |
| (o) £ [ 2,000   ] a month after tax  |
| ( ) I don't know - pick a level:     |
|     ( ) Basic  ( ) Moderate          |
|     ( ) Comfortable                  |
|                                      |
| Some part-time work after you stop?  |
| (o) No                               |
| ( ) Yes: £ [        ] a year before  |
|     tax, for [   ] years             |
|                                      |
| State Pension                        |
| (o) The full amount: £12,548 a       |
|     year from age 67                 |
| ( ) My forecast: £ [      ] a year   |
| ( ) None                             |
|                                      |
| A final-salary or career-average     |
| pension?                             |
| (o) No                               |
| ( ) Yes: £ [       ] a year          |
|     from age [    ]                  |
|                                      |
| [ + Add a partner ]                  |
| [ + Add more detail ]                |
|                                      |
| [       Show if it works         ]   |
|                                      |
| Your figures stay in this browser    |
| until you choose to keep the plan.   |
+--------------------------------------+
```

**Field by field** (paths of `SCHEMA_A`; words in `copy/a.js`)

| Field | Path | Starts as | Words under it | Rules |
|---|---|---|---|---|
| Your age | `you.age` | empty | — | 18–100, whole years. Asked first on A, because the age in mind is checked against it. |
| Your pension pot | `you.pot` | empty (or carried) | All your pension pots added together. | £0–£10,000,000. 0 is valid: the answer then works from savings alone. |
| Going in each month | `payIn.total` | blank | Everything that lands in your pension each month, including your employer's part. Leave it blank if nothing goes in. | Blank = 0, listed under what was assumed (`nothing-paid-in`). Rises with prices in the answer. Stops at the stop age. |
| Other savings you would spend | `savings` | 0 | ISAs, cash, investments. 0 if none. | Treated as ISA money, as C does. It is on the short form for A (not under "more detail" as in C) because stopping before 57 is paid from it. |
| When do you have in mind? | `stop.kind` = `age` / `date` / `ages`; `stop.age`; `stop.month`, `stop.year` | `age`, box empty | — | An age: today's age to 75. A month: this month to 25 years on; turned into an age by the same rule C uses (the birthday is taken to be today), and the answer speaks of both ("in June 2030, when you are 60"). "Show me ages" needs no figure. |
| What you would spend | `spend.kind` = `amount` / `level`; `spend.amount`; `spend.level` | `amount`, box empty | What it costs to live, at today's prices. | After tax, a month, the household. The three levels are `PLSA_2024` from `BudgetModel.js` shown as their monthly figure once picked ("Moderate: £2,610 a month for one person"). A spending figure is never invented (HH 1.4). |
| Some part-time work after you stop? | `partTime.has`; `partTime.yearly`; `partTime.years` | No | — | Earnings before tax, a year, for a whole number of years from the stop age; taxed as income, National Insurance not included (assumed line `work-tax`). 1–15 years. |
| State Pension | `you.statePension.kind`, `.yearly` | The full amount | The full amount: £{x} a year from age {67} | As C. |
| A final-salary or career-average pension? | `you.finalSalary.has`, `.yearly`, `.fromAge` | No | When Yes: The yearly amount before tax, as your scheme states it. | As C: amount and the age it starts, asked once. |

Four typed things for a single person (age, pot, the age in mind, spending) when a level is not picked;
three when it is. A test counts them; the limit is five.

**"Add a partner"** opens the same block C's does (age, pot, State Pension, final-salary pension) plus one
row, "Going in each month" for the partner. Both stop at the same time unless "Add more detail" says
otherwise. The verdict then reads "Yes — you could both stop when you are 60 (your partner 58)".

**"Add more detail"** (all optional, each with a starting value shown under what was assumed):

```text
+----------------------------------------------------------------------------+
| More detail (all optional)                                       [ Close ] |
|                                                                            |
| Risk level while you are saving   ( ) Cautious (o) Balanced ( ) Adventurous|
|                                   Cautious: about a third in shares.       |
|                                   Balanced: about half. Adventurous: about |
|                                   two thirds.                              |
| Risk level once you have stopped  ( ) Cautious (o) Balanced ( ) Adventurous|
| Make it last to age                 [ 95 ]                                 |
| Your partner stops                (o) When you do   ( ) At age [    ]      |
|                                                                            |
| [ Answer everything in full ]   opens "Your plan in full", keeping these   |
+----------------------------------------------------------------------------+
```

- Two risk levels, because the owner asked for a saving risk level of its own and the mix people hold while
  saving is usually not the one they retire on. Both start at Balanced (decision 10.2).
- "Your partner stops" appears only with a partner added.

**What is wrong with a field, in plain words** (in place of the hint; C's sentences for the fields C has):

| When | Words |
|---|---|
| The age in mind is empty on pressing the button | Type the age you have in mind, for example 60. Or choose "show me ages". |
| The age in mind is under today's age | That is younger than you are now. Type your age or a later one. |
| The age in mind is over 75 | We can show ages up to 75. Type 75 or less, or choose "show me ages". |
| The month is in the past | That month has gone. Choose this month or a later one. |
| Spending empty and no level picked | Type what you would spend a month, for example 2,000. Or pick a level. |
| Spending is 0 | With nothing to spend there is nothing to test. Type an amount, or pick a level. |
| Part-time "Yes" with no earnings or years | Type what the work would pay a year before tax, and how many years, for example 12,000 for 3 years. |
| Going in each month not a number | Use figures only, for example 600. Leave it blank if nothing goes in. |

The button is never greyed out. Pressing it with something missing moves to the first field that needs
attention and shows its sentence (as C).

### 3.2 Step 2, the answer for a named age

The verdict here is **Close** so that every part of the screen has something to say. The `Yes` and `No`
variants change the words of the band and the bad-case line only (section 7.2).

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| WHEN CAN I AFFORD TO STOP WORK?                                            |
| [x] 1 Your numbers   ---   [>] 2 Could I stop at 60?                       |
| [ ] 3 What about every other age? (optional)   [ ] 4 Keep this plan? (opt) |
| Next: try one more year, or a little less spending, below.                 |
+----------------------------------------------------------------------------+
|                                                                            |
| +------------------------------------------------------------------------+ |
| | Close - stopping at 60 is tight                                        | |
| | spending £2,000 a month after tax from 60 until you are 95, going up   | |
| | each year with prices                                                  | |
| +------------------------------------------------------------------------+ |
|                                                                            |
| Stopping at 60 and spending £2,000 a month, your money lasted to 95 in 8   |
| futures out of 10.                                                         |
|                                                                            |
| In a bad case (the worst 1 in 10) it would run out at age 89. After that   |
| you would have £1,045 a month from your State Pension. Stopping at 61      |
| instead lasted in 9 futures out of 10.                                     |
|                                                                            |
| An illustration from your figures, not financial advice.                   |
+----------------------------------------------------------------------------+
| WHAT YOU COULD SPEND FROM 60   (a month, after tax, at today's prices)     |
|   careful £1,900   |   middling £2,300   |   good £2,650                   |
|   careful = lasts in 9 futures out of 10 · middling = 5 out of 10 ·        |
|   good = the best 1 in 10                                                  |
|   By 60 your pot could be about £480,000. In a bad case (the worst 1 in    |
|   10) it is about £390,000; in a good case (the best 1 in 10) about        |
|   £590,000.                                                                |
+----------------------------------------------------------------------------+
| THE YEARS BEFORE YOUR STATE PENSION   (£2,000 a month, in a bad case)      |
|   Age 60 to 66   £1,800 from your pension + £200 from your savings         |
|                  Tax of £90 a month is already taken off.                  |
|   From 67        £1,045 State Pension + £955 from your pension             |
|   Your savings would be down to about £15,000 by 67.                       |
+----------------------------------------------------------------------------+
| OTHER AGES, SIDE BY SIDE   (spending £2,000 a month)                       |
|   Age   Could spend    Lasted to 95                                        |
|    58    £1,650        #####.....   5 in 10   not on these figures         |
|    59    £1,780        ######....   6 in 10   not on these figures         |
|  > 60    £1,900        ########..   8 in 10   close                        |
|    61    £2,050        #########.   9 in 10   yes                          |
|    62    £2,200        ##########   every one yes                          |
|    65    £2,600        ##########   every one yes                          |
|    67    £2,950        ##########   every one yes                          |
|   "Could spend" is the careful amount: the most that lasted to 95 in 9     |
|   futures out of 10 if you stopped at that age.                            |
|   [ See every age ]                                                        |
+----------------------------------------------------------------------------+
| ONE MORE YEAR                                                              |
|   Working until 61 instead of 60 buys about £150 a month more for life.    |
|   It moves £2,000 a month from lasting in 8 futures out of 10 to 9, and    |
|   a bad case (the worst 1 in 10) from running out at 89 to lasting to 95.  |
+----------------------------------------------------------------------------+
| WHAT WE ASSUMED   (press "Change" to alter one)                            |
|   £600 a month goes in until you stop, rising with prices        [Change]  |
|   While saving: Balanced, about half in shares                   [Change]  |
|   Once stopped: Balanced, about half in shares                   [Change]  |
|   The full State Pension of £1,045 a month from age 67           [Change]  |
|   No final-salary pension                                        [Change]  |
|   Lasts to age 95                                                [Change]  |
|   [ See all of them ]                                                      |
+----------------------------------------------------------------------------+
| TRY A CHANGE                                                               |
|   Stop age       [ - 1 year ]     60        [ + 1 year ]                   |
|   Pot            [ - £25,000 ]    £250,000  [ + £25,000 ]                  |
|   Spending       [ - £100 ]       £2,000    [ + £100 ]   a month           |
|   Part-time      [ - 1 year ]     none      [ + 1 year ]  at £ [ 12,000 ]  |
|                                                           a year           |
|   Risk while saving   [ Cautious ]  [*Balanced*]  [ Adventurous ]          |
|   Risk once stopped   [ Cautious ]  [*Balanced*]  [ Adventurous ]          |
|   Before: nothing yet.            Now: close at 60, 8 futures out of 10.   |
+----------------------------------------------------------------------------+
| WHAT NEXT?                                                                 |
|   [ Am I saving enough for this? ]   [ What is £480,000 a month? ]         |
|   [ Keep this plan ]   so you can come back to it and carry on             |
+----------------------------------------------------------------------------+
| This is an illustration worked out from the figures you entered. It is not |
| financial advice and it does not tell you what to do. Pension Wise, from   |
| MoneyHelper, gives free guidance to anyone aged 50 or over.                |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| When can I afford to stop work?      |
| Step 2 of 4: Could I stop?        v  |
| Next: try one more year, or a little |
| less spending, below.                |
+--------------------------------------+
| Close - stopping at 60 is tight      |
| spending £2,000 a month after tax    |
| from 60 until you are 95, going up   |
| each year with prices                |
|                                      |
| Stopping at 60 and spending £2,000   |
| a month, your money lasted to 95 in  |
| 8 futures out of 10.                 |
|                                      |
| In a bad case (the worst 1 in 10) it |
| would run out at age 89. After that  |
| you would have £1,045 a month from   |
| your State Pension. Stopping at 61   |
| instead lasted in 9 futures out of   |
| 10.                                  |
|                                      |
| An illustration from your figures,   |
| not financial advice.                |
+--------------------------------------+
| What you could spend from 60      v  |
| careful £1,900  middling £2,300      |
| good £2,650                          |
+--------------------------------------+
| The years before your State       v  |
| Pension                              |
+--------------------------------------+
| Other ages, side by side             |
| (spending £2,000 a month)            |
|                                      |
| Age Could spend  Lasted to 95        |
|  58  £1,650  #####.....  5 in 10     |
|  59  £1,780  ######....  6 in 10     |
| >60  £1,900  ########..  8 in 10     |
|  61  £2,050  #########.  9 in 10     |
|  62  £2,200  ##########  every one   |
|  65  £2,600  ##########  every one   |
|  67  £2,950  ##########  every one   |
| 9 in 10 or better = yes              |
| [ See every age ]                    |
+--------------------------------------+
| One more year                        |
| Working until 61 instead of 60 buys  |
| about £150 a month more for life.    |
| It moves £2,000 a month from lasting |
| in 8 futures out of 10 to 9, and a   |
| bad case (the worst 1 in 10) from    |
| running out at 89 to lasting to 95.  |
+--------------------------------------+
| What we assumed (9)               v  |
+--------------------------------------+
| Try a change                         |
| Stop age     [-]  60        [+]      |
| Pot          [-]  £250,000  [+]      |
| Spending     [-]  £2,000    [+]      |
| Part-time    [-]  none      [+]      |
|   at £ [ 12,000 ] a year             |
| Risk while saving                    |
|              [ Balanced        v ]   |
| Risk once stopped                    |
|              [ Balanced        v ]   |
| Before: nothing yet.                 |
| Now: close at 60, 8 futures out      |
| of 10.                               |
+--------------------------------------+
| What next?                           |
| [ Am I saving enough for this?   ]   |
| [ What is £480,000 a month?      ]   |
| [ Keep this plan                 ]   |
+--------------------------------------+
| This is an illustration worked out   |
| from the figures you entered. It is  |
| not financial advice and it does     |
| not tell you what to do. Pension     |
| Wise, from MoneyHelper, gives free   |
| guidance to anyone aged 50 or over.  |
+--------------------------------------+
```

**What each part is, and where its words come from**

| Part | What it shows | Source (keys of `AnswerA`, section 7.1) |
|---|---|---|
| Headline band | The verdict, large: "Yes — you could stop at 60" / "Close — stopping at 60 is tight" / "Not at 60 on these figures". Under it, what was tested: the spending, from when, to when, rising with prices. | `verdict`; templates `a.head.*`, `a.sub` |
| The sentence | The verdict as one sentence a person could read aloud, with the age, the spending and the count out of 10. | `a.line`; `lasted` |
| The bad-case line | Always present; names "the worst 1 in 10"; gives the run-out age, what is left after it (State Pension, final-salary pension), and for `close` and `no` the nearest age that lasted in 9 out of 10. For `yes`: "it still lasts to 95", and how much more you could spend. | `a.bad.*`; `runOutAge`, `nearestYes`, `monthly.careful` |
| What you could spend from 60 | The three amounts at the named age, with C's one-line key; then the pot at that age in a bad, middling and good case. | `monthly.*`, `potAtStop.*`; `a.range`, `a.pot` |
| The years before your State Pension | One row per stretch of years in which the income is the same, pot by pot, **at the spending named** in the bad-case future: which pot pays which years. A closed pension says so ("Your pension is closed until 57"). Then the savings left when the State Pension starts. | `phases[]` (as C's, plus `locked`); `a.phase.*`, `a.savingsLeft` |
| Other ages, side by side | Up to seven ages: the careful amount at each, and a bar of how many futures out of 10 the named spending lasted. The named age is marked. The word on the right is the verdict at that age. "See every age" opens step 3. | `ages[]`; `a.ages.row` |
| One more year | What working one more year buys: the extra careful amount a month, and how the count and the bad case move. Absent when the named age is 75. | `oneMoreYear`; `a.oneMore.*` |
| Part-time (when on) | Replaces nothing; adds one line under the sentence: "With £12,000 a year from part-time work for 3 years after you stop, £2,000 a month lasted in 9 futures out of 10. Without it, 8." | `partTime`; `a.partTime` |
| What we assumed | C's list plus A's own lines (section 7.3). | `assumed[]` |
| Try a change | Six things to try without leaving the screen (below). | — |
| What next? | B with the figures carried; C with the middling pot at the stop age carried as its pot and the stop age as its start age; keep. | section 5 |
| The advice lines | `ADVICE_SHORT` under the bad-case line, `ADVICE_FULL` at the foot, letter for letter. | `copy/common.js` |

**The small chart at 40 columns.** Each row is one age: the age, the careful amount, ten characters of
bar, the count. `#` is a future out of 10 that lasted; the bar is drawn from `ages[i].lasted` by the
`OutOfTenBar` component (ten fixed cells, `data-key="ages.2.lasted"` on the row, `aria-label` "8 futures
out of 10"), never from a number the screen worked out. "every one" is Rail 3.4's "in every future we
tried"; "more than 9" for 95% up to all. The named age carries `>` and `aria-current="true"`. The seven ages
are fixed by a rule in `SCHEMA_A` (`agesToShow`): the named age, the two before it, the two after, the age
five on, and the State Pension age — kept within today's age and 75, sorted, without repeats. With "show
me ages" the rule is: today's age (labelled "now"), then 55, 57, 60, 62, 65, 67 and the State Pension age,
kept within the same limits, plus the earliest age that worked, found by the cheap "lasted" test at every
whole age. No screen chooses an age.

**The try-a-change row**

| Control | Does | Words | Test id |
|---|---|---|---|
| Stop age − / + | One year earlier or later; stops at today's age and at 75 | "Stop age" | `a.try.stop.down` / `.up` |
| Pot − / + | As C: £25,000 steps from £100,000, £5,000 below | "Pot" | `a.try.pot.down` / `.up` |
| Spending − / + | £100 a month; stops at £100 | "Spending" | `a.try.spend.down` / `.up` |
| Part-time − / + | Years of part-time work after stopping, 0 to 15, at the yearly amount in the box beside it (starts at £12,000 if none was typed; typing sets `partTime.yearly`) | "Part-time … at £{x} a year" | `a.try.partTime.down` / `.up`, `a.try.partTime.yearly` |
| Risk while saving | Cautious / Balanced / Adventurous | "Risk while saving" | `a.try.savingRisk.<level>` |
| Risk once stopped | Cautious / Balanced / Adventurous | "Risk once stopped" | `a.try.risk.<level>` |
| Before / Now | The last verdict beside the new one: "Before: close at 60, 8 futures out of 10. Now: yes at 61, 9 futures out of 10." One step of "before" is kept, as C. | `a.change` | — |

Every control edits what is typed (`draft/set`), and the runner works the answer out again. While it runs,
the old answer greys and is marked "Updating", as C. On a phone the six controls stack and the two risk
rows become pick-lists.

### 3.3 The answer with "show me ages"

The same screen; the range leads. The band names the earliest age that lasted in 9 futures out of 10, the
sentence gives the count at that age, and the chart shows every anchor age. "One more year" speaks of the
earliest age and the year after it. The years before the State Pension are shown for the earliest age.

```text
+----------------------------------------------------------------------------+
| +------------------------------------------------------------------------+ |
| | You could stop at 61 on these figures                                  | |
| | spending £2,000 a month after tax from 61 until you are 95, going up   | |
| | each year with prices                                                  | |
| +------------------------------------------------------------------------+ |
|                                                                            |
| The earliest age at which £2,000 a month lasted to 95 in 9 futures out of  |
| 10 is 61. At 60 it lasted in 8 futures out of 10.                          |
|                                                                            |
| In a bad case (the worst 1 in 10), stopping at 61 still lasts to 95.       |
| Stopping at 60 instead would run out at age 89.                            |
|                                                                            |
| An illustration from your figures, not financial advice.                   |
+----------------------------------------------------------------------------+
| AGES, SIDE BY SIDE   (spending £2,000 a month)                             |
|   Age   Could spend    Lasted to 95                                        |
|    50    £1,000        ..........   none      not on these figures         |
|    55    £1,350        ##........   2 in 10   not on these figures         |
|    57    £1,520        ####......   4 in 10   not on these figures         |
|    60    £1,900        ########..   8 in 10   close                        |
|  > 61    £2,050        #########.   9 in 10   yes                          |
|    62    £2,200        ##########   every one yes                          |
|    65    £2,600        ##########   every one yes                          |
|    67    £2,950        ##########   every one yes                          |
|   Press an age to see it in full.                                          |
+----------------------------------------------------------------------------+
```

Pressing a row sets `stop.kind` to `age` and `stop.age` to that age (two `draft/set` actions) and the answer
is worked out again for it: the screen becomes 3.2 for that age, with "Before: earliest 61. Now: close at
60, 8 futures out of 10."

When no age up to 75 worked, the band reads "No age up to 75 worked on these figures", the sentence "At 75,
£2,000 a month lasted to 95 in only 6 futures out of 10.", the bad-case line "In a bad case (the worst 1 in
10), stopping at 75 would run out at age 88.", and the chart is shown as usual. The rail's next sentence
(`a.ages.none`) points at spending less or at C.

### 3.4 Stopping before a pension can be touched, paid from savings

The same screen for a person of 50 with £60,000 in savings who has 55 in mind. The engine leaves the pension
alone until 57 (C's `pension-locked` rule); the phases say which pot pays which years, and the important
warning names the age.

```text
+----------------------------------------------------------------------------+
| +------------------------------------------------------------------------+ |
| | Not at 55 on these figures                                             | |
| | spending £2,000 a month after tax from 55 until you are 95, going up   | |
| | each year with prices                                                  | |
| +------------------------------------------------------------------------+ |
|                                                                            |
| Stopping at 55 and spending £2,000 a month, your money lasted to 95 in     |
| only 4 futures out of 10.                                                  |
|                                                                            |
| In a bad case (the worst 1 in 10) it would run out at age 81. After that   |
| you would have £1,045 a month from your State Pension. The earliest age    |
| that lasted in 9 futures out of 10 is 61.                                  |
|                                                                            |
| You can't take money from your pension until you are 57 (April 2028        |
| rules). Until then your savings pay.                                       |
|                                                                            |
| An illustration from your figures, not financial advice.                   |
+----------------------------------------------------------------------------+
| THE YEARS BEFORE YOUR STATE PENSION   (£2,000 a month, in a bad case)      |
|   Age 55 to 56   £2,000 a month, all from your savings. Your pension is    |
|                  closed until 57.                                          |
|   Age 57 to 66   £1,850 from your pension + £150 from your savings         |
|                  Tax of £100 a month is already taken off.                 |
|   From 67        £1,045 State Pension + £955 from your pension             |
|   Your savings would be down to about £9,000 by 57 in a bad case (the      |
|   worst 1 in 10). They need to be about £48,000 at 55 to cover the years   |
|   from 55 to 57 on their own.                                              |
+----------------------------------------------------------------------------+
```

- The rule "which pot pays which years" is the engine's own order (pension up to the basic-rate limit,
  then savings and ISA), read back from `planDrawdown` for the bad-case future, exactly as C's
  `phases[]` are. The screen adds nothing.
- The last line ("They need to be about £48,000 at 55") is `a.savingsNeeded`: the savings draw in the
  closed years, summed, from the same phases. It is what S04's "ISA-bridge planner" came for, in one
  sentence, and it lets a 40-year-old who plans to stop at 52 see what the outside-pension pot must be.
- When the savings run out before the pension opens, the bad-case line already says the run-out age, and
  the phase reads "Age 55 to 56: £2,000 a month, all from your savings, which run out at 56 in a bad case."

### 3.5 Part-time work switched on

The headline is worked out **with** the earnings. One line under the sentence says what the work did, and
"one more year" gains a second sentence about one more year of part-time work.

```text
| Stopping at 60 and spending £2,000 a month, your money lasted to 95 in 9   |
| futures out of 10.                                                         |
|                                                                            |
| That is with £12,000 a year from part-time work for 3 years after you      |
| stop (age 60 to 62), taxed as income. Without it, 8 futures out of 10.     |
```

```text
| ONE MORE YEAR                                                              |
|   Working until 61 instead of 60 buys about £150 a month more for life.    |
|   One more year of part-time work (4 years, to 63) moves £2,000 a month    |
|   from lasting in 9 futures out of 10 to more than 9.                      |
```

The earnings are `otherIncome` of kind `work` in the household model (HH 1.2), from the stop age for the
years given; the assumed line `work-tax` says National Insurance is not included. "Still paying in while
part-time" is not asked in this slice (10.6).

### 3.6 A couple: the same screen, the words

| Part | One person | Two people |
|---|---|---|
| Band | Yes — you could stop at 60 | Yes — you could both stop when you are 60 (your partner 58) |
| Sentence | Stopping at 60 and spending £2,000 a month, your money lasted … | Stopping when you are 60 and your partner is 58, and spending £3,200 a month between you, your money lasted until the younger of you is 95 in 9 futures out of 10. |
| Bad case | … would run out at age 89 | … would run out when the younger of you is 87. After that you would have £2,090 a month from your State Pensions. |
| Ages chart | Age | Your age, with the partner's age beside it in small type ("60 (58)") |
| The years before | Your State Pension | one row from each start: "From when your partner is 67: …" as C's `ageWords` |
| One more year | Working until 61 | Both working until you are 61 |
| Pot at stop | your pot | your two pots together |
| Part-time | after you stop | after you stop (whose earnings: "you" unless the partner's box is used under more detail) |
| Try a change | Stop age, Pot | "Your stop age" and "Partner's stop age" (the second only when they differ under more detail); "Your pot" and "Partner's pot" |

"Answer in full detail for both of us" is on the numbers step and the answer, as C, and opens question E.

---

## 4. Question B — the screens

### 4.1 Step 1, "What have you saved, what are you paying in, and what do you want?"

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| AM I SAVING ENOUGH, AND WHAT SHOULD I PAY IN?                              |
| [>] 1 What have you saved, what are you paying in, and what do you want?   |
| [ ] 2 Am I on course, and what should I pay in?                            |
| [ ] 3 What if I stop later, or pay in more, or both? (optional)            |
| [ ] 4 Keep this plan? (optional)                                           |
| Next: your age, your pot, what goes in each month, the age you have in     |
| mind and what you want to spend.                                           |
+----------------------------------------------------------------------------+
|                                                                            |
| What have you saved, what are you paying in, and what do you want?         |
| Rough figures are fine. You can change any of them afterwards.             |
|                                                                            |
| Your age                    [ 45 ]                                         |
|                                                                            |
| Your pension pot          £ [ 180,000    ]                                 |
|                           All your pension pots added together.            |
|                                                                            |
| Going in each month       £ [ 700        ]    [ Split it up v ]            |
|                           Everything that lands in your pension each       |
|                           month, including your employer's part. It is on  |
|                           your statement or in your pension app.           |
|                                                                            |
|   (opened)  Your part     £ [ 450 ]   Your employer's part  £ [ 250 ]      |
|                                                                            |
| The age you have in mind    [ 60 ]                                         |
|                                                                            |
| What you want to spend    (o) £ [ 2,000   ] a month after tax, from then   |
|                           ( ) I don't know - pick a level:                 |
|                               ( ) Basic  ( ) Moderate  ( ) Comfortable     |
|                           What it costs to live, at today's prices.        |
|                                                                            |
| State Pension             (o) The full amount: £12,548 a year from age 67  |
|                           ( ) My forecast:  £ [        ] a year            |
|                           ( ) None                                         |
|                                                                            |
| A final-salary or         (o) No                                           |
| career-average pension?   ( ) Yes:  £ [        ] a year, from age [    ]   |
|                                                                            |
| [ + Add a partner ]      [ + Add more detail ]                             |
|                                                                            |
| [ Show what I need ]                                                       |
|                                                                            |
| Your figures stay in this browser until you choose to keep the plan.       |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| Am I saving enough?                  |
| Step 1 of 4: Your numbers         v  |
+--------------------------------------+
| What have you saved, what are you    |
| paying in, and what do you want?     |
| Rough figures are fine.              |
|                                      |
| Your age                             |
| [ 45 ]                               |
|                                      |
| Your pension pot                     |
| £ [ 180,000                  ]       |
| All your pension pots together.      |
|                                      |
| Going in each month                  |
| £ [ 700                      ]       |
| Including your employer's part.      |
| [ Split it up v ]                    |
|                                      |
| The age you have in mind             |
| [ 60 ]                               |
|                                      |
| What you want to spend               |
| (o) £ [ 2,000   ] a month after tax  |
| ( ) I don't know - pick a level:     |
|     ( ) Basic  ( ) Moderate          |
|     ( ) Comfortable                  |
|                                      |
| State Pension                        |
| (o) The full amount: £12,548 a       |
|     year from age 67                 |
| ( ) My forecast: £ [      ] a year   |
| ( ) None                             |
|                                      |
| A final-salary or career-average     |
| pension?                             |
| (o) No                               |
| ( ) Yes: £ [       ] a year          |
|     from age [    ]                  |
|                                      |
| [ + Add a partner ]                  |
| [ + Add more detail ]                |
|                                      |
| [       Show what I need         ]   |
|                                      |
| Your figures stay in this browser    |
| until you choose to keep the plan.   |
+--------------------------------------+
```

**Field by field** (paths of `SCHEMA_B`)

| Field | Path | Starts as | Words under it | Rules |
|---|---|---|---|---|
| Your age | `you.age` | empty | — | 18–100. |
| Your pension pot | `you.pot` | empty | All your pension pots added together. | 0 is valid. |
| Going in each month | `payIn.total`; "Split it up" opens `payIn.you`, `payIn.employer` | empty | Everything that lands in your pension each month, including your employer's part. It is on your statement or in your pension app. | Required; 0 is valid ("nothing goes in now" — the answer then solves what would). When split, `total` is the sum and the boxes are read back into it; the employer's part is named in the pay-in headline. The figure is what lands in the pension: the tax added back by the government is already inside it, and the assumed line `pay-in-as-given` says so. |
| The age you have in mind | `stop.age` | empty | — | Today's age + 1 to 75. B always names an age: "show me ages" is A's job, and B's answer offers A. |
| What you want to spend | `spend.kind`, `spend.amount`, `spend.level` | `amount`, empty | What it costs to live, at today's prices. | As A. |
| State Pension, final-salary pension | as C | | | |

Four typed things for a single person (age, pot, pay-in, the age in mind) when a level is picked; five with
an amount typed. A partner adds their age. That is the limit; a test counts them.

**"Add a partner"**: C's block plus "Going in each month" for the partner. The number and the pay-in are
household figures; the pay-in headline says "between you".

**"Add more detail"**: other savings you would spend (£, as C — under more detail here because B is about
the pension), risk level while you are saving, risk level once you have stopped, make it last to age,
"Pay in until age" (starts at the age in mind; earlier stops the paying in sooner — S22's "coast"), partner
stops when you do / at age.

**What is wrong with a field**: A's sentences for the shared fields, plus:

| When | Words |
|---|---|
| Going in each month empty | Type what goes into your pension each month, for example 700. Type 0 if nothing does. |
| Split boxes do not add up to the total | The two parts add up to £{sum}, not £{total}. Change one of them. (shown only when all three have figures) |
| The age in mind is not later than today's age | Choose an age later than you are now. If you have stopped work, "Will it last?" is the question for you. |

### 4.2 Step 2, the answer

Two headlines on one screen: **the number** and **the pay-in**. Each has its band, its sentence and its
bad-case line, so the wording check's rule "every headline has a sentence and a bad-case line" holds twice.
The chance at today's pay-in sits between them, as the number's own sentence.

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| AM I SAVING ENOUGH, AND WHAT SHOULD I PAY IN?                              |
| [x] 1 Your numbers   ---   [>] 2 Am I on course, and what should I pay in? |
| [ ] 3 What if I stop later, or pay in more, or both? (optional)            |
| [ ] 4 Keep this plan? (optional)                                           |
| Next: pick one of the ways to make it fit below, or try two together.      |
+----------------------------------------------------------------------------+
|                                                                            |
| +------------------------------------------------------------------------+ |
| | About £470,000 by age 60                                               | |
| | the pot that pays £2,000 a month after tax from 60 until you are 95,   | |
| | going up each year with prices, with your State Pension from 67        | |
| +------------------------------------------------------------------------+ |
|                                                                            |
| To spend £2,000 a month from 60, you would want a pot of about £470,000    |
| by then. Paying in £700 a month as you do now, you reached that in 6       |
| futures out of 10.                                                         |
|                                                                            |
| In a bad case (the worst 1 in 10), £700 a month gets you to about £400,000 |
| by 60: £70,000 short. From 60 that pays about £1,750 a month instead of    |
| £2,000.                                                                    |
|                                                                            |
| An illustration from your figures, not financial advice.                   |
+----------------------------------------------------------------------------+
| +------------------------------------------------------------------------+ |
| | About £1,050 a month into your pension                                 | |
| | including your employer's £250, from now until you are 60, going up    | |
| | each year with prices                                                  | |
| +------------------------------------------------------------------------+ |
|                                                                            |
| Paying in about £1,050 a month, of which £250 is your employer's part,     |
| reached £470,000 by 60 in 9 futures out of 10. That is £350 a month more   |
| than now.                                                                  |
|                                                                            |
| In a bad case (the worst 1 in 10), £1,050 a month only just reaches        |
| £470,000. In a middling case it reaches about £620,000.                    |
|                                                                            |
| An illustration from your figures, not financial advice.                   |
+----------------------------------------------------------------------------+
| WHAT THE POT COULD BE BY 60   (at today's prices)                          |
|   Paying in £700 as now:     bad case £400,000  |  middling £550,000  |    |
|                              good case £720,000                            |
|   Paying in £1,050:          bad case £470,000  |  middling £620,000  |    |
|                              good case £810,000                            |
|   bad case = the worst 1 in 10 · good case = the best 1 in 10              |
+----------------------------------------------------------------------------+
| WAYS TO MAKE IT FIT   (each on its own; press "Try" to put it in the       |
|                        boxes above)                                        |
|                       What changes            Pay in a month  Reached it   |
|   Stop later          stop at 62, not 60      £700 (as now)   9 in 10 [Try]|
|   Pay in more         nothing else            £1,050          9 in 10 [Try]|
|   Spend less          £1,750 a month, not     £700 (as now)   9 in 10 [Try]|
|                       £2,000                                               |
|   More risk while     about two thirds in     £950            9 in 10 [Try]|
|   saving              shares                                               |
|   Accept the chance   nothing                 £700 (as now)   6 in 10      |
|                       In a bad case (the worst 1 in 10) the pot is         |
|                       £70,000 short: about £1,750 a month from 60.         |
|   [ Try two together ]                                                     |
+----------------------------------------------------------------------------+
| WHAT WE ASSUMED   (press "Change" to alter one)                            |
|   £700 a month goes in until you are 60, rising with prices     [Change]   |
|   The figure you gave is what lands in the pension, with the tax the       |
|   government adds back already inside it                                   |
|   While saving: Balanced, about half in shares                  [Change]   |
|   Once stopped: Balanced, about half in shares                  [Change]   |
|   The full State Pension of £1,045 a month from age 67          [Change]   |
|   No final-salary pension                                       [Change]   |
|   Lasts to age 95                                               [Change]   |
|   [ See all of them ]                                                      |
+----------------------------------------------------------------------------+
| TRY A CHANGE                                                               |
|   Pay in         [ - £50 ]        £700       [ + £50 ]   a month           |
|   Stop age       [ - 1 year ]     60         [ + 1 year ]                  |
|   Spending       [ - £100 ]       £2,000     [ + £100 ]   a month          |
|   Pay in until   [ - 1 year ]     60         [ + 1 year ]                  |
|   Risk while saving   [ Cautious ]  [*Balanced*]  [ Adventurous ]          |
|   Before: nothing yet.       Now: £470,000 by 60, reached in 6 out of 10.  |
+----------------------------------------------------------------------------+
| WHAT NEXT?                                                                 |
|   [ When could I afford to stop? ]   [ What is £470,000 a month? ]         |
|   [ Keep this plan ]   so you can come back to it and carry on             |
+----------------------------------------------------------------------------+
| This is an illustration worked out from the figures you entered. It is not |
| financial advice and it does not tell you what to do. Pension Wise, from   |
| MoneyHelper, gives free guidance to anyone aged 50 or over.                |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| Am I saving enough?                  |
| Step 2 of 4: The number           v  |
| Next: pick one of the ways to make   |
| it fit below, or try two together.   |
+--------------------------------------+
| About £470,000 by age 60             |
| the pot that pays £2,000 a month     |
| after tax from 60 until you are 95,  |
| going up each year with prices, with |
| your State Pension from 67           |
|                                      |
| To spend £2,000 a month from 60, you |
| would want a pot of about £470,000   |
| by then. Paying in £700 a month as   |
| you do now, you reached that in 6    |
| futures out of 10.                   |
|                                      |
| In a bad case (the worst 1 in 10),   |
| £700 a month gets you to about       |
| £400,000 by 60: £70,000 short. From  |
| 60 that pays about £1,750 a month    |
| instead of £2,000.                   |
|                                      |
| An illustration from your figures,   |
| not financial advice.                |
+--------------------------------------+
| About £1,050 a month into your       |
| pension                              |
| including your employer's £250, from |
| now until you are 60, going up each  |
| year with prices                     |
|                                      |
| Paying in about £1,050 a month, of   |
| which £250 is your employer's part,  |
| reached £470,000 by 60 in 9 futures  |
| out of 10. That is £350 a month more |
| than now.                            |
|                                      |
| In a bad case (the worst 1 in 10),   |
| £1,050 a month only just reaches     |
| £470,000. In a middling case it      |
| reaches about £620,000.              |
|                                      |
| An illustration from your figures,   |
| not financial advice.                |
+--------------------------------------+
| What the pot could be by 60       v  |
+--------------------------------------+
| Ways to make it fit                  |
| (each on its own)                    |
|                                      |
| Stop later                    [Try]  |
|   stop at 62, not 60                 |
|   £700 a month as now - 9 in 10      |
| Pay in more                   [Try]  |
|   £1,050 a month - 9 in 10           |
| Spend less                    [Try]  |
|   £1,750 a month, not £2,000         |
|   £700 a month as now - 9 in 10      |
| More risk while saving        [Try]  |
|   about two thirds in shares         |
|   £950 a month - 9 in 10             |
| Accept the chance                    |
|   £700 a month as now - 6 in 10      |
|   In a bad case (the worst 1 in 10)  |
|   the pot is £70,000 short: about    |
|   £1,750 a month from 60.            |
| [ Try two together ]                 |
+--------------------------------------+
| What we assumed (9)               v  |
+--------------------------------------+
| Try a change                         |
| Pay in       [-]  £700      [+]      |
| Stop age     [-]  60        [+]      |
| Spending     [-]  £2,000    [+]      |
| Pay in until [-]  60        [+]      |
| Risk while saving                    |
|              [ Balanced        v ]   |
| Before: nothing yet.                 |
| Now: £470,000 by 60, reached in 6    |
| out of 10.                           |
+--------------------------------------+
| What next?                           |
| [ When could I afford to stop?   ]   |
| [ What is £470,000 a month?      ]   |
| [ Keep this plan                 ]   |
+--------------------------------------+
| This is an illustration worked out   |
| from the figures you entered. It is  |
| not financial advice and it does     |
| not tell you what to do. Pension     |
| Wise, from MoneyHelper, gives free   |
| guidance to anyone aged 50 or over.  |
+--------------------------------------+
```

**What each part is, and where its words come from**

| Part | What it shows | Source (keys of `AnswerB`, section 7.1) |
|---|---|---|
| The number (band) | The pot wanted by the stop age, rounded to £1,000 with "about"; what it is for. | `number.careful`; `b.head`, `b.sub` |
| Its sentence | The number again, then the chance at today's pay-in as a count out of 10. | `b.line`; `chance.lasted` |
| Its bad-case line | The bad-case pot at today's pay-in, how far short, and what that pot pays a month from the stop age (C's careful amount for that pot). Absent when on course. | `b.bad`; `potAtStop.now.careful`, `short`, `monthlyIfShort` |
| The pay-in (band) | The monthly amount into the pension that reaches the number in 9 futures out of 10, rounded to £10; the employer's part named when it was split. | `payIn.needed`; `b.payIn.head`, `b.payIn.sub` |
| Its sentence | The pay-in in a sentence, and the difference from now. | `b.payIn.line`; `payIn.extra` |
| Its bad-case line | "only just reaches" (by construction), then the middling pot at that pay-in. | `b.payIn.bad`; `potAtStop.needed.middling` |
| What the pot could be by 60 | Two rows of three pots: at today's pay-in and at the needed pay-in. | `potAtStop.now.*`, `potAtStop.needed.*`; `b.pots.*` |
| Ways to make it fit | The five levers, each on its own, side by side: what changes, the pay-in, the count. "Try" puts that lever's value into the boxes (`draft/set`) and re-runs. "Accept the chance" has no button and adds its bad-case sentence. Absent when on course. | `levers.*`; `b.lever.*` |
| What we assumed | C's list plus B's own lines (7.3). | `assumed[]` |
| Try a change | Pay in (£50 steps), stop age, spending, pay in until (S22), risk while saving. | — |
| What next? | A with the figures carried; C with the number carried as its pot and the stop age as its start; keep. | section 5 |

**On course.** When the count at today's pay-in is 9 in 10 or better the screen has one band, not two:

```text
| +------------------------------------------------------------------------+ |
| | On course for 60                                                       | |
| | paying in £700 a month as you do now, you reached the £470,000 that    | |
| | pays £2,000 a month from 60 in 9 futures out of 10                     | |
| +------------------------------------------------------------------------+ |
|                                                                            |
| To spend £2,000 a month from 60, you would want a pot of about £470,000    |
| by then. Paying in £700 a month as you do now, you reached that in 9       |
| futures out of 10.                                                         |
|                                                                            |
| In a bad case (the worst 1 in 10), £700 a month only just reaches          |
| £470,000. You could pay in as little as about £560 a month and still get   |
| there in 9 futures out of 10.                                              |
```

The last sentence is S22's answer ("can I ease off?") given without being asked; the try-a-change row "Pay
in until" answers "can I stop paying in from a date?".

**Stopping before a pension can be touched.** When the age in mind is under 57 (55 before April 2028), a
line under the number's bad-case line says what part of the number must be outside the pension:

```text
| Stopping at 55 is before you can take money from a pension (57). About     |
| £48,000 of the £470,000 needs to be in ISAs or savings by 55 to pay the    |
| years from 55 to 57. The pay-in below is into your pension; the savings    |
| part is on top of it.                                                      |
```

`b.outside` reads the closed-years savings draw from the drawdown phases, as A's `a.savingsNeeded` does.
The pay-in headline then reads "into your pension, plus about £1,800 a month into savings" (`payIn.outside`),
the second figure being the monthly saving that reaches the outside part in 9 futures out of 10 on the same
futures in the saving mix.

### 4.3 Step 3, "What if I stop later, or pay in more, or both?"

A grid of stop age against pay-in. Each cell is the count out of 10 at which the number for *that* stop age
was reached — every cell is one cheap "reached" test over the futures, so the whole grid is one run. The
number changes with the stop age (later start, fewer years to pay for), and the row heading says so.

```text
+----------------------------------------------------------------------------+
| WHAT IF I STOP LATER, OR PAY IN MORE, OR BOTH?                             |
| Spending £2,000 a month after tax from the age you stop, to 95.            |
|                                                                            |
|                          Pay in a month                                    |
|   Stop at   Needs        £700 (now)  £800    £900    £1,000  £1,100        |
|     58      £510,000     3 in 10     4       5       6       7             |
|     59      £490,000     5 in 10     6       7       8       8             |
|   > 60      £470,000     6 in 10     7       8       9       9             |
|     61      £450,000     7 in 10     8       9       9       every one     |
|     62      £430,000     9 in 10     9       every   every   every one     |
|     63      £410,000     9 in 10     every   every   every   every one     |
|     65      £370,000     every one   every   every   every   every one     |
|                                                                            |
|   9 in 10 or better is the careful line. Press a cell to put that stop age |
|   and that pay-in in your numbers.                                         |
|   [ Back to the number ]                                                   |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| Stop later, pay in more, or both     |
| Spending £2,000 a month from the     |
| age you stop, to 95.                 |
|                                      |
| Pay in a month, then stop age:       |
|          £700  £800  £900  £1,000    |
|   58       3     4     5     6       |
|   59       5     6     7     8       |
|  >60       6     7     8     9       |
|   61       7     8     9     9       |
|   62       9     9    10    10       |
|   63       9    10    10    10       |
|   65      10    10    10    10       |
| Each cell: futures out of 10 in      |
| which the pot for that age was       |
| reached. 9 or better is careful.     |
| [ Back to the number ]               |
+--------------------------------------+
```

- The columns are today's pay-in and four steps of £100 (£50 under £500). The rows are the age in mind, the
  two before it and the five after, within 75. Both are rules in `SCHEMA_B` (`gridToShow`), not choices the
  screen makes. "every" / "every one" is Rail 3.4's "in every future we tried"; at 40 columns a count is
  shown as its number and "10" for every one, with the key saying so.
- Pressing a cell sets `stop.age` and `payIn.total` (two `draft/set` actions) and returns to the answer,
  which shows "Before: £470,000 by 60, reached in 6 out of 10. Now: £430,000 by 62, reached in 9 out of
  10."
- The rail's short result for this step is the cell pressed, if any.

### 4.4 A couple: the words

| Part | One person | Two people |
|---|---|---|
| The number | About £470,000 by age 60 | About £620,000 between you by the time you are 60 |
| Its sub-line | with your State Pension from 67 | with your State Pensions from 67 and 69 |
| The pay-in | About £1,050 a month into your pension | About £1,400 a month into your pensions between you, split as now (£700 and £700) |
| The chance | you reached that | the two of you reached that |
| Levers | Stop later: stop at 62 | Stop later: both stop when you are 62 |
| Try a change | Pay in | "You pay in" and "Partner pays in" |

The split of the needed pay-in between the two people is in the same proportion as today's pay-ins (or half
each when nothing goes in now), stated under what was assumed (`pay-in-split`). Which name the money goes in
changes the tax later; the answer says so in the `one-name` note C already has.

---

## 5. How C, A and B hand over to each other

Every hand-over is a link on a "What next?" block (or the rail's `a.retired` / `b.retired` button). Pressing
it dispatches one action, `{ type: 'draft/carry', from: 'c', to: 'a' }`, then `route/set` to the target's
numbers step. Figures are never in the address (brief 4.8): the carried values live in `draft.a.values`,
saved in the tab's `pt_v7_draft` with the rest, so a reload after a hand-over keeps them.

`draft/carry` copies by a declared map, `src/v7/state/carry.js`, and nothing else: a field not in the map is
left as it was in the target's draft. The source draft is untouched. A carried field is marked `touched`, so
its error (if any) shows at once, and the target draft gets `carriedFrom: 'c'` so its numbers screen can
say where the figures came from.

```js
// src/v7/state/carry.js — data only
export const CARRY = {
  'c→a': [
    ['household', 'household'], ['you.age', 'you.age'], ['you.pot', 'you.pot'],
    ['you.statePension.kind', 'you.statePension.kind'], ['you.statePension.yearly', 'you.statePension.yearly'],
    ['you.finalSalary.has', 'you.finalSalary.has'], ['you.finalSalary.yearly', 'you.finalSalary.yearly'], ['you.finalSalary.fromAge', 'you.finalSalary.fromAge'],
    ['partner.age', 'partner.age'], ['partner.pot', 'partner.pot'], /* …the partner's pension fields likewise… */
    ['savings', 'savings'], ['risk', 'risk'], ['endAge', 'endAge'],
    ['start.age', 'stop.age'],              // C's "from age" becomes the age in mind; start.kind 'now' carries nothing
    ['take', 'spend.amount']                // an amount named under "take" becomes the spending, and spend.kind 'amount'
  ],
  'c→b': [ /* the same household fields */ ['start.age', 'stop.age'], ['take', 'spend.amount'], ['risk', 'risk'] ],
  'a→b': [ /* household */ ['stop.age', 'stop.age'], ['spend.kind', 'spend.kind'], ['spend.amount', 'spend.amount'], ['spend.level', 'spend.level'],
           ['payIn.total', 'payIn.total'], ['savingRisk', 'savingRisk'], ['risk', 'risk'], ['endAge', 'endAge'] ],
  'b→a': [ /* the mirror of a→b */ ],
  'a→c': [ /* household */ ['stop.age', 'start.age'], ['spend.amount', 'take'],
           [{ result: 'potAtStop.middling' }, 'you.pot'] ],   // a figure from A's answer, carried as text (see below)
  'b→c': [ /* household */ ['stop.age', 'start.age'], ['spend.amount', 'take'], [{ result: 'number.careful' }, 'you.pot'] ]
};
```

**A figure from an answer carried into a form.** "What is £480,000 a month?" on A's answer carries the
middling pot at the stop age into C's pot box, and the stop age into C's "from age", so C answers "what
would that pot pay". The carried figure is written into the draft as text (`"480,000"`), exactly as if
typed, and C's numbers screen says so. C's `pot-as-is` line and `start-later` note then apply, which is
right: C does not grow the pot; A did. The carry map names the result key; the reducer reads it from
`answers.a.result` at the moment of carrying, so no screen copies a number.

**What the receiving numbers screen says** (one line under the heading, `data-testid="<q>.carried"`, gone
once any box is changed):

| From → to | The line |
|---|---|
| C → A | We have brought your figures over from "What is that a month?". Add the age you have in mind and what you would spend. |
| C → B | We have brought your figures over from "What is that a month?". Add what goes into your pension each month and the age you have in mind. |
| A → B | We have brought your figures over from "When can I afford to stop work?". Check them, and add what goes into your pension each month. |
| B → A | We have brought your figures over from "Am I saving enough?". Check them: the age in mind is 60 and the spending £2,000 a month. |
| A → C | This is the pot you could have at 60 in a middling case, from "When can I afford to stop work?". The answer takes it as it stands from then. |
| B → C | This is the number from "Am I saving enough?". The answer takes it as it stands from 60. |

**Where the links are**

| On | Link | Carries | Opens |
|---|---|---|---|
| C answer, "What next?" | When can I afford to stop work? | `c→a` | `#/a/numbers?focus=stop.age` |
| C answer, "What next?" | Am I saving enough, and what should I pay in? | `c→b` | `#/b/numbers?focus=payIn.total` |
| A answer, "What next?" | Am I saving enough for this? | `a→b` | `#/b/numbers?focus=payIn.total` |
| A answer, "What next?" | What is £{potAtStop.middling} a month? | `a→c` | `#/c/answer` (the answer runs at once) |
| B answer, "What next?" | When could I afford to stop? | `b→a` | `#/a/numbers` (the answer runs on "Show if it works") |
| B answer, "What next?" | What is £{number.careful} a month? | `b→c` | `#/c/answer` |
| A or B rail, `*.retired` | Will it last? | `a→d` / `b→d` (defined when D is built; until then `#/soon/d`) | — |

**The rule for a retired person.** C can be asked by someone already drawing their State Pension. If the
draft carried into A or B says the money starts now and a State Pension is already paid (C's
`alreadyStopped` reading of the result, made a pure reader on the inputs: `start.kind === 'now'` and
`you.age` at or past State Pension age), A and B show the `*.retired` state (6.4) and nothing else. No
saver word reaches a retired person, and no countdown exists on A or B in any state (every length of time is
an age).

**What a hand-over never does**: it never runs an answer on the target without the button being pressed
(except `a→c` and `b→c`, whose target is C's answer step, which runs as C does today from a complete
draft); it never writes a plan (the import rule stands: nothing under `src/v7/` imports the save code); it
never puts a figure in the address; it never empties the source draft, so "back" returns to the answer that
was left.

---

## 6. Empty, working and failed states

The components are C's (`Working`, `Problem`, the short form on the answer step); only the words change.

### 6.1 The answer address opened with nothing entered

Rule R3: the step asks for what it needs. A asks for its four things; B for its five.

```text
+----------------------------------------------------------------------------+
| WHEN CAN I AFFORD TO STOP WORK?                                            |
| [ ] 1 Your numbers   ---   [>] 2 Could I stop?                             |
| Next: four things are enough - your age, your pot, the age you have in     |
| mind and what you spend.                                                   |
+----------------------------------------------------------------------------+
|                                                                            |
| Could I stop?                                                              |
|                                                                            |
| We need four things to work this out.                                      |
|                                                                            |
| Your age                    [    ]                                         |
| Your pension pot          £ [            ]                                 |
| When do you have in mind? (o) Age [    ]  ( ) Show me ages                 |
| What you would spend      (o) £ [        ] a month  ( ) Pick a level       |
|                                                                            |
| [ Show if it works ]      [ Answer the other questions first ]             |
|                                                                            |
| Everything else starts from a sensible assumption that you can change.     |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| Am I saving enough?                  |
| Step 2 of 4: The number           v  |
+--------------------------------------+
| We need five things to work this     |
| out.                                 |
|                                      |
| Your age                             |
| [    ]                               |
| Your pension pot                     |
| £ [                          ]       |
| Going in each month                  |
| £ [                          ]       |
| The age you have in mind             |
| [    ]                               |
| What you want to spend               |
| (o) £ [        ] a month             |
| ( ) Pick a level                     |
|                                      |
| [       Show what I need         ]   |
|                                      |
| Everything else starts from a        |
| sensible assumption that you can     |
| change.                              |
+--------------------------------------+
```

Step 3 of either question opened with nothing entered shows the same short form with "Every age" / "Two
levers together" as its heading, and one line: "Once there is an answer, this step shows it for every age."
/ "…for every stop age and pay-in together."

### 6.2 Working

C's `Working`: "Working out your answer…", "Trying your numbers against many possible futures.", the bar,
and after five seconds "Still working. This can take a little longer on a phone." A and B add nothing to it.
Two things differ underneath:

- **A first figure, then the rest.** The first pass (100 futures) gives the verdict at the named age only;
  the band, sentence and bad-case line appear with C's "This is a first figure…" line. The chart block shows
  its heading and "Working out the other ages…" until the final pass (1,000 futures) brings `ages[]`,
  `oneMoreYear` and the phases. For "show me ages", the first pass is the cheap "lasted" sweep at 100
  futures, so the chart's counts appear first and the careful amounts fill in. For B the first pass gives the
  number and the chance; the pay-in and the levers arrive with the final pass ("Working out what to pay
  in…"). `#app[data-answer]` is `first` until every block is final.
- **A try-a-change on an answered screen** greys the old answer and marks it "Updating", as C.

The wait budget is C's (first figure within 3 seconds, final within 15, processor slowed four times) for the
named-age case. The "show me ages" and grid cases are measured on the first day the functions run; if the
final pass misses 15 seconds, the chart's careful amounts move to a third pass and the screen says "Working
out what you could spend at each age…" under the chart until it lands.

### 6.3 Failed

C's `Problem` with the question's own summary line:

```text
+----------------------------------------------------------------------------+
| Sorry, we could not work that out.                                         |
|                                                                            |
| Nothing has been lost. Your numbers are still here:                        |
|   Pot £250,000  -  age 50  -  stop at 60  -  £2,000 a month  -  £600 in    |
|                                                                            |
| [ Try again ]     [ Change my numbers ]     [ Tell us what happened ]      |
+----------------------------------------------------------------------------+
```

For B: "Pot £180,000 - age 45 - £700 a month in - stop at 60 - £2,000 a month". The summary reads the draft
as typed (C's `Problem` does the same); it is not a result.

### 6.4 "This question is for people who are still working"

Shown on any step of A or B when the draft says the money starts now and a State Pension is already paid
(section 5). The rail's next sentence is `a.retired` / `b.retired`.

```text
+----------------------------------------------------------------------------+
| WHEN CAN I AFFORD TO STOP WORK?                                            |
| This question is for people who are still working. Your figures say you    |
| have stopped.                                                     [ Will   |
|                                                                   it last?]|
+----------------------------------------------------------------------------+
|                                                                            |
| This question is for people who are still working.                         |
|                                                                            |
| Your figures say you have stopped: the money starts now and your State     |
| Pension is being paid.                                                     |
|                                                                            |
| [ Will it last, and could I spend more? ]   [ That's wrong - I'm working ] |
|                                                                            |
| "That's wrong" sets the money to start from an age you choose, and this    |
| question opens as usual.                                                   |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| This question is for people who are  |
| still working.                       |
|                                      |
| Your figures say you have stopped:   |
| the money starts now and your State  |
| Pension is being paid.               |
|                                      |
| [ Will it last, and could I spend  ] |
| [ more?                            ] |
| [ That's wrong - I'm working       ] |
+--------------------------------------+
```

"That's wrong — I'm working" sets `stop.kind` to `age` with the box empty and focuses it. Nothing on this
screen is a countdown or a stop-work date; it passes the `retired` scope of the banned list, which is
applied to it in every test.

### 6.5 Other states, words only

| State | Where | Words |
|---|---|---|
| No age worked (A, "show me ages") | in place of the band | No age up to 75 worked on these figures. (then the sentence and bad-case line for 75, and the chart) |
| Nothing lasts at the named age even at 75 (A) | under the bad-case line | The earliest age that lasted in 9 futures out of 10 is later than 75. Spending a little less changes that quickest: try it below. |
| Pot and savings both 0 (A) | in place of the band | With no pot and no savings there is nothing to stop on yet. "Am I saving enough?" works out what to pay in. |
| The pay-in needed is over the limit (B) | in place of the pay-in band | Reaching £470,000 by 55 would take more than £10,000 a month. Try a later age or a lower amount. |
| The number is already in the pot (B) | in place of the pay-in band | You already have more than £470,000. Paying in nothing more, you reached it in every future we tried. "What is that a month?" shows what it pays. |
| Spending level picked (A, B) | under the spending box, and in every sentence | Moderate: £2,610 a month for one person (Retirement Living Standards). The sentences say "£2,610 a month" from then on, never "moderate". |
| Small pot and small pay-in (B) | under the number | With a pot this size and this pay-in, the number is a long way off. The count out of 10 is what matters here. |
| Offline | a thin line under the header | as C |

---

## 7. The keys the screens draw, and the sentence templates

The full result objects belong to the answer contract for A and B. This section lists what the drawings
above need, so that each drawing can be pinned as a named state (`tests/v7/states/a/*.json`,
`states/b/*.json`) and read back key by key, as C's are. Every figure on screen is one of these keys, drawn
by `Money` or `Sentence` with `data-key` and `data-value`; the screen works out nothing.

### 7.1 Keys

**`AnswerA`** — beside C's shape (`status`, `problems`, `inputs`, `assumed`, `warnings`, `basis`, `units`,
`phases[]`, `guaranteed`):

| Key | What |
|---|---|
| `verdict` | `'yes'` (lasted ≥ 0.9) · `'close'` (0.7 ≤ lasted < 0.9) · `'no'` (< 0.7) at the named age; `'ages'` when "show me ages"; `'none'` when nothing to stop on |
| `stop.age`, `stop.date` | the age tested; the month, when one was given |
| `spend` | £ a month after tax, the household, as tested (the level's figure when a level was picked) |
| `lasted` | share of futures in which `spend` lasted to `endAge` from `stop.age` |
| `runOutAge` | in a bad case (the worst 1 in 10); `endAge` when it lasted |
| `monthly.{careful,middling,good}` | what you could spend from `stop.age`, whole £10, careful rounded down — C's band, solved on the joint futures |
| `spare` | `monthly.careful − spend` when positive |
| `potAtStop.{careful,middling,good}` | the pot at `stop.age` in a bad, middling and good saving future, nearest £1,000; the household's pots and savings together |
| `nearestYes` | the earliest age at or after `stop.age` that lasted in 9 out of 10, or `null` |
| `earliest` | with "show me ages": the earliest age at or after today's age that lasted in 9 out of 10, or `null` |
| `ages[]` | `{ age, partnerAge?, careful, lasted, runOutAge, verdict }` for the ages `agesToShow` fixed |
| `oneMoreYear` | `{ fromAge, toAge, extraMonthly, lastedFrom, lastedTo, runOutFrom, runOutTo }` or `null` at 75 |
| `partTime` | `{ yearly, years, fromAge, toAge, lastedWith, lastedWithout, oneMore: { years, lasted } }` or `null` |
| `phases[]` | C's, at `spend` in the bad-case future, with `byPerson[].locked` and `fromSavings` as C has them |
| `savingsLeft` | `{ atAge, amount }`: the savings left when the last State Pension starts, bad case |
| `savingsNeeded` | `{ amount, untilAge }` when the start is before a pension opens: the savings the closed years draw |
| `whose` | as C |

**`AnswerB`**:

| Key | What |
|---|---|
| `onCourse` | `chance.lasted ≥ 0.9` |
| `stop.age`, `spend` | as A |
| `number.{careful,middling,good}` | the pot at `stop.age` for which the careful (middling, good) amount from then equals `spend`; the headline is `number.careful`, nearest £1,000 |
| `chance.lasted` | share of futures in which today's pay-in reached `number.careful` by `stop.age` |
| `payIn.now`, `payIn.employer` | as given; `payIn.employer` null unless split |
| `payIn.needed` | the smallest monthly pay-in that reached `number.careful` in 9 out of 10; whole £10, rounded up |
| `payIn.least` | on course only: the smallest pay-in that still reaches it in 9 out of 10 |
| `payIn.extra` | `payIn.needed − payIn.now` |
| `payIn.outside` | the monthly saving outside the pension when `stop.age` is before a pension opens, or `null` |
| `potAtStop.now.{careful,middling,good}`, `potAtStop.needed.{…}` | the pot at `stop.age` at today's pay-in and at the needed one |
| `short` | `number.careful − potAtStop.now.careful` when positive |
| `monthlyIfShort` | the careful amount from `stop.age` on `potAtStop.now.careful` |
| `outside` | `{ amount, untilAge }`: the part of the number that must be outside a pension, or `null` |
| `levers` | `{ stopLater: { age, lasted }, payMore: { payIn, lasted }, spendLess: { spend, lasted }, moreRisk: { level, payIn, lasted }, accept: { lasted, short, monthlyIfShort } }`; each `null` when it cannot be found within the limits |
| `grid` | `{ ages: [ { age, number, cells: [ { payIn, lasted } ] } ], payIns: [] }` — only on the `choices` step's run |

### 7.2 Sentence templates

As C's (`src/answers/a/sentences.js`, `src/answers/b/sentences.js`): `{…}` are keys; a sentence is
`{ id, text, parts }`; text equals the parts joined by `format.js`. Every string passes the banned list in
every state, including the `retired` scope, because none of these is ever shown to a retired person (6.4)
and none contains a length of time to wait. Counts out of 10 use Rail 3.4's table through `outOfTen`.

**Question A**

| Id | Template |
|---|---|
| `a.head.yes` | Yes — you could stop at {stop.age} |
| `a.head.close` | Close — stopping at {stop.age} is tight |
| `a.head.no` | Not at {stop.age} on these figures |
| `a.head.date` | (a month was given) … at {stop.age}, in {stop.date} |
| `a.head.ages` | You could stop at {earliest} on these figures |
| `a.head.ages.none` | No age up to 75 worked on these figures |
| `a.head.couple` | Yes — you could both stop when you are {stop.age} (your partner {stop.partnerAge}) |
| `a.sub` | spending {spend} a month after tax from {stop.age} until you are {endAge}, going up each year with prices |
| `a.line` | Stopping at {stop.age} and spending {spend} a month, your money lasted to {endAge} {outOfTen(lasted)}. |
| `a.line.ages` | The earliest age at which {spend} a month lasted to {endAge} in 9 futures out of 10 is {earliest}. At {earliest − 1} it lasted {outOfTen}. |
| `a.bad.yes` | In a bad case (the worst 1 in 10) it still lasts to {endAge}. You could spend up to about {monthly.careful} a month and it would still last in 9 futures out of 10. |
| `a.bad` | In a bad case (the worst 1 in 10) it would run out at age {runOutAge}.[ After that you would have {guaranteed.monthlyAfterTax} a month from your State Pension[ and your final-salary pension].][ Stopping at {nearestYes} instead lasted in 9 futures out of 10. / The earliest age that lasted in 9 futures out of 10 is {nearestYes}.] |
| `a.bad.ages` | In a bad case (the worst 1 in 10), stopping at {earliest} still lasts to {endAge}. Stopping at {earliest − 1} instead would run out at age {ages[i−1].runOutAge}. |
| `a.range` | At {stop.age} you could spend: careful {monthly.careful}, middling {monthly.middling}, good {monthly.good} a month. |
| `a.pot` | By {stop.age} your pot could be about {potAtStop.middling}. In a bad case (the worst 1 in 10) it is about {potAtStop.careful}; in a good case (the best 1 in 10) about {potAtStop.good}. |
| `a.phase.pots` / `.mixed` / `.paid` / `.tax` | C's made-of lines, at `spend` |
| `a.phase.locked` | Age {from} to {to}: {takeHome} a month, all from your savings. Your pension is closed until {accessAge}. |
| `a.phase.locked.out` | Age {from} to {to}: {takeHome} a month, all from your savings, which run out at {runOutAge} in a bad case. |
| `a.savingsLeft` | Your savings would be down to about {savingsLeft.amount} by {savingsLeft.atAge}[ in a bad case (the worst 1 in 10)]. |
| `a.savingsNeeded` | They need to be about {savingsNeeded.amount} at {stop.age} to cover the years from {stop.age} to {savingsNeeded.untilAge} on their own. |
| `a.ages.row` | (a row, for screen readers) At {age}, you could spend about {careful} a month; {spend} a month lasted {outOfTen(lasted)}. |
| `a.oneMore` | Working until {toAge} instead of {fromAge} buys about {extraMonthly} a month more for life. |
| `a.oneMore.moves` | It moves {spend} a month from lasting {outOfTen(lastedFrom)} to {count(lastedTo)}[, and a bad case (the worst 1 in 10) from running out at {runOutFrom} to lasting to {endAge} / to running out at {runOutTo}]. |
| `a.partTime` | That is with {partTime.yearly} a year from part-time work for {years} years after you stop (age {fromAge} to {toAge}), taxed as income. Without it, {outOfTen(lastedWithout)}. |
| `a.partTime.oneMore` | One more year of part-time work ({years + 1} years, to {toAge + 1}) moves {spend} a month from lasting {outOfTen(lastedWith)} to {count(oneMore.lasted)}. |
| `a.change` | Before: {verdict word} at {age}, {count} futures out of 10. Now: {verdict word} at {age}, {count} futures out of 10. |
| `a.none` | With no pot and no savings there is nothing to stop on yet. |
| `a.late` | The earliest age that lasted in 9 futures out of 10 is later than 75. Spending a little less changes that quickest: try it below. |

**Question B**

| Id | Template |
|---|---|
| `b.head` | About {number.careful} by age {stop.age} |
| `b.head.couple` | About {number.careful} between you by the time you are {stop.age} |
| `b.head.onCourse` | On course for {stop.age} |
| `b.sub` | the pot that pays {spend} a month after tax from {stop.age} until you are {endAge}, going up each year with prices[, with your State Pension from {spAge}] |
| `b.sub.onCourse` | paying in {payIn.now} a month as you do now, you reached the {number.careful} that pays {spend} a month from {stop.age} in 9 futures out of 10 |
| `b.line` | To spend {spend} a month from {stop.age}, you would want a pot of about {number.careful} by then. Paying in {payIn.now} a month as you do now, you reached that {outOfTen(chance.lasted)}. |
| `b.line.nothingIn` | (pay-in 0) … Paying nothing in, as now, you reached that {outOfTen}. |
| `b.bad` | In a bad case (the worst 1 in 10), {payIn.now} a month gets you to about {potAtStop.now.careful} by {stop.age}: {short} short. From {stop.age} that pays about {monthlyIfShort} a month instead of {spend}. |
| `b.bad.onCourse` | In a bad case (the worst 1 in 10), {payIn.now} a month only just reaches {number.careful}. You could pay in as little as about {payIn.least} a month and still get there in 9 futures out of 10. |
| `b.payIn.head` | About {payIn.needed} a month into your pension |
| `b.payIn.sub` | [including your employer's {payIn.employer}, ]from now until you are {stop.age}, going up each year with prices |
| `b.payIn.line` | Paying in about {payIn.needed} a month[, of which {payIn.employer} is your employer's part,] reached {number.careful} by {stop.age} in 9 futures out of 10. That is {payIn.extra} a month more than now. |
| `b.payIn.bad` | In a bad case (the worst 1 in 10), {payIn.needed} a month only just reaches {number.careful}. In a middling case it reaches about {potAtStop.needed.middling}. |
| `b.pots.now` | Paying in {payIn.now} as now: bad case {potAtStop.now.careful}, middling {potAtStop.now.middling}, good case {potAtStop.now.good}. |
| `b.pots.needed` | Paying in {payIn.needed}: bad case {…}, middling {…}, good case {…}. |
| `b.outside` | Stopping at {stop.age} is before you can take money from a pension ({accessAge}). About {outside.amount} of the {number.careful} needs to be in ISAs or savings by {stop.age} to pay the years from {stop.age} to {outside.untilAge}. The pay-in below is into your pension; the savings part is on top of it. |
| `b.lever.stopLater` | stop at {levers.stopLater.age}, not {stop.age} |
| `b.lever.payMore` | {levers.payMore.payIn} a month |
| `b.lever.spendLess` | {levers.spendLess.spend} a month, not {spend} |
| `b.lever.moreRisk` | {level words}: {levers.moreRisk.payIn} a month |
| `b.lever.accept` | In a bad case (the worst 1 in 10) the pot is {levers.accept.short} short: about {levers.accept.monthlyIfShort} a month from {stop.age}. |
| `b.lever.row` | (for screen readers) {lever name}: {what changes}, paying in {payIn} a month, reached it {outOfTen}. |
| `b.grid.cell` | (for screen readers) Stopping at {age} and paying in {payIn} a month, the {number} that age needs was reached {outOfTen}. |
| `b.change` | Before: {number} by {age}, reached in {count} out of 10. Now: {number} by {age}, reached in {count} out of 10. |
| `b.none` | Reaching {number.careful} by {stop.age} would take more than {limit} a month. Try a later age or a lower amount. |
| `b.have` | You already have more than {number.careful}. Paying in nothing more, you reached it in every future we tried. |

Rules for these are Rail 3.3's: "could", "would", "lasted"; one figure per clause; under 30 words; no
sentence starts with a figure; "the worst 1 in 10" beside every "bad case" and "the best 1 in 10" beside
every "good case". Three templates run over 30 words (`a.bad`, `b.bad`, `b.outside`); each is split at its
full stop into separate sentences in the file, with the parts shown here joined for reading.

### 7.3 What was assumed — A's and B's own lines

C's lines apply where their inputs apply (`state-pension-full`, `state-pension-age`, `quarter-tax-free`,
`steady`, `plan-to`, `todays-prices`, `no-final-salary`, `final-salary-rises`, `both-stop-together`,
`savings-split`, `savings-as-isa`, `both-alive`, `tax-rules`, `futures`, `no-charges`). C's `risk` line
becomes `risk-drawing` ("Once stopped: Balanced, about half in shares."). New:

| id | Sentence | Field |
|---|---|---|
| `pay-in` | {payIn.now} a month goes in until you are {stop.age}, rising with prices. | `payIn.total` |
| `nothing-paid-in` | Nothing more goes into your pension before you stop. | `payIn.total` |
| `pay-in-as-given` | The figure you gave is what lands in the pension, with the tax the government adds back already inside it. | — |
| `pay-in-until` | (B, when set) You pay in until you are {payIn.untilAge}, then nothing. | `payIn.untilAge` |
| `pay-in-split` | (couple) The pay-in that gets there is split between you as it is now. | — |
| `risk-saving` | While saving: Balanced, about half in shares. | `savingRisk` |
| `same-futures` | The years before you stop and the years after are one future: the same markets, seen once. | — |
| `stop-age` | You stop at {stop.age}[, in {stop.date}]. | `stop.age` |
| `spend-level` | (level picked) {level}: {spend} a month for {one person / a couple}, from the Retirement Living Standards. | `spend.level` |
| `work-tax` | (part-time) Earnings from work are taxed as income; National Insurance is not included. | — |
| `no-part-time` | No part-time work after you stop. | `partTime.has` |
| `pension-closed-until` | (start before a pension opens) Your pension is left alone until you are {accessAge}; your savings pay until then. | — |

---

## 8. What the tests read

Everything C's tests read (brief 4.9), with `a` and `b` in place of `c`, plus:

| On the page | Rule |
|---|---|
| Screen root | `data-screen="a.numbers" \| "a.answer" \| "a.ages" \| "b.numbers" \| "b.answer" \| "b.choices"`, `data-question="a" \| "b"` |
| Headlines | A: one `<section data-headline="verdict">` holding the band, `[data-sentence="verdict"]`, the bad-case line and `ADVICE_SHORT`. B: two, `data-headline="number.careful"` and `data-headline="payIn.needed"` (one, `data-headline="number.careful"`, when on course). Every one has its sentence and its bad-case line: the wording check's headline rule is run per section |
| The ages chart | `[data-region="answer"] [data-chart="ages"]` with one `[data-age="61"]` row per entry of `ages[]`, in order; `data-key="ages.3.careful"` on the amount, `data-key="ages.3.lasted"` on the bar, `aria-current="true"` on the named age; the bar has exactly ten cells and `aria-label` "9 futures out of 10" |
| The levers | `[data-levers]` with one `[data-lever="stopLater" \| "payMore" \| "spendLess" \| "moreRisk" \| "accept"]` per lever that exists; `b.lever.<id>.try` on each button; the accept row has no button |
| The grid | `[data-grid]` with `[data-cell="62:800"]` per cell, `data-key="grid.ages.4.cells.1.lasted"`; pressing sets two draft values and returns to the answer |
| Inputs | `data-testid="a.<path>"`, `"b.<path>"`; radio options `a.stop.kind.age` and so on |
| Buttons | `a.action.show`, `a.action.addPartner`, `a.action.moreDetail`, `a.action.fullDetail`, `a.action.seeAges`, `a.action.retry`, `a.action.change`, `a.action.imWorking`, `a.try.*` (3.2), `b.action.show`, `b.action.split`, `b.action.together`, `b.action.back`, `b.try.payIn.down` / `.up`, `b.try.stop.*`, `b.try.spend.*`, `b.try.until.*`, `b.try.savingRisk.<level>` |
| Hand-over | `c.next.a`, `c.next.b`, `a.next.b`, `a.next.c`, `b.next.a`, `b.next.c` on the links; `[data-testid="a.carried"]` on the receiving line; `data-carried-from="c"` on the numbers form |
| The retired screen | `data-screen="a.retired"`, `a.action.willItLast`, `a.action.imWorking` |
| Counts the answer wrote | `<span data-fixed>` on "9", "10", "1", "every", the ten bar cells |

Named states to pin (drawn with the stub result until the functions land, then rebuilt by
`build-states.mjs`): `a/numbers-blank`, `a/numbers-carried-from-c`, `a/numbers-part-time-open`,
`a/numbers-couple-open`, `a/answer-nothing-entered`, `a/answer-working`, `a/answer-first`,
`a/answer-yes`, `a/answer-close` (the drawing in 3.2), `a/answer-no`, `a/answer-ages`, `a/answer-ages-none`,
`a/answer-before-57`, `a/answer-part-time`, `a/answer-couple`, `a/answer-updating`, `a/answer-failed`,
`a/answer-retired`, `a/ages`; `b/numbers-blank`, `b/numbers-split-open`, `b/answer-nothing-entered`,
`b/answer-working`, `b/answer-first`, `b/answer-short` (the drawing in 4.2), `b/answer-on-course`,
`b/answer-before-57`, `b/answer-none`, `b/answer-have`, `b/answer-couple`, `b/answer-failed`,
`b/answer-retired`, `b/choices`.

Tests A's and B's screens add to C's set:

| Test | Reads |
|---|---|
| The verdict word on screen equals the rule on `lasted` (`yes` ≥ 0.9, `close` ≥ 0.7) — the screen never decides it | `verdict` against `lasted` in every pinned state |
| Every age in the chart is one the rule `agesToShow` gives for those inputs, in order, without repeats | `[data-age]` against the rule |
| The bar's filled cells equal `round(lasted × 10)` and its label equals `outOfTen(lasted)` | `[data-chart="ages"]` |
| The number carried into C equals the key named in the carry map, as text | `draft.c.values['you.pot']` after `a→c` |
| A carry then "back" shows the source answer unchanged, with no run | the run effect's calls |
| No string in `copy/a.js`, `copy/b.js` or either sentences file matches a `retired`-scope pattern; no length of time to wait appears in any pinned A or B state | the wording check, with `retired` applied to A and B as well as `all`, `first`, `planner`, `result` |
| The retired screen is drawn, and only it, for every draft in which the money starts now and the State Pension is paid | `a/answer-retired`, and a generated set |
| Two headlines on B each have a sentence and a bad-case line; one when on course | the headline rule per `[data-headline]` |
| The first answer counted: A at most 4 typed things, 3 screens, 6 clicks; B at most 5, 3, 6 | the browser journeys `a-named-age.spec.js`, `a-show-me-ages.spec.js`, `b-short.spec.js`, `b-on-course.spec.js` |

---

## 9. Additions to the language guide and the banned list

### 9.1 Names of things (adds to Rail 3.1)

| The thing | Its name in V7 | Never |
|---|---|---|
| The age someone stops working | "the age you have in mind", "stop at 60", "stop age" (as a label) | retirement age, retirement date, target age (allowed: "State Pension age") |
| Money going into a pension | "what you pay in", "going in each month", "pay in" | contribution, contributions, contribute, contribution rate |
| The employer's money | "your employer's part" | employer contribution, employer match |
| The government's top-up | "the tax the government adds back" | tax relief (allowed once with that explanation beside it) |
| The pot wanted by the stop age | "the number", "the pot you would want by then" | target pot, required pot, retirement fund, your number (except in the quoted question) |
| The pot in the future | "what the pot could be by 60" in a bad, middling and good case | projection, projected, forecast (allowed: "State Pension forecast", the gov.uk letter) |
| Whether the saving gets there | "reached it in 9 futures out of 10", "on course" | on track, probability, confidence, success rate |
| Not getting there | "£70,000 short", "falling short", "the chance of falling short" as "in N futures out of 10" | shortfall, deficit, gap |
| The years before the State Pension | "the years before your State Pension" | the bridge, bridging (already banned) |
| Paying less or nothing in | "pay in until age {50}", "paying nothing in" | coast, coasting, coast FIRE |
| Working less | "part-time work", "some part-time work after you stop" | semi-retire, phased retirement, wind-down |
| One more year | "one more year", "working until 61 instead of 60" | OMY, one-more-year syndrome |
| The two risk levels | "while saving" / "once stopped" | accumulation mix / decumulation mix, glidepath |
| A stop age's outcome | a **verdict** is a code-only word: the screen says "Yes — you could stop at 60", "Close — stopping at 60 is tight", "Not at 60 on these figures" | pass / fail, feasible, affordable |
| What you could spend | "what you could spend from 60" | sustainable income, withdrawal rate, safe withdrawal rate, the 4% rule |
| The three pots | a bad case (the worst 1 in 10) · middling · a good case (the best 1 in 10), as for amounts | poor / median / good markets |

### 9.2 Templates rules that A and B add (to Rail 3.3)

7. A verdict is three words at most before the dash, and the same three everywhere ("Yes —", "Close —",
   "Not at {age}"). It is never softened ("probably", "maybe") and never hardened ("definitely", "safely").
8. "One more year" is always "working until {age + 1} instead of {age}" — two ages, never "a year longer".
9. A count that moves is written "from lasting in 8 futures out of 10 to 9": the phrase in full once, then
   the bare count.
10. A pot is "about £470,000"; "about" once per sentence still holds, so "about £470,000 by 60" and
    "gets you to about £400,000" never share a sentence.
11. "Short" follows the figure: "£70,000 short". Never "a shortfall of", never a minus sign in a sentence.
12. The year the State Pension starts is an age ("from 67"), the stop is an age ("at 60"), the pay-in ends
    at an age ("until you are 60"). No sentence on A or B says "in N years" — the one exception the guide
    allows savers (a date to aim at) is used only where a month was typed ("in June 2030, when you are 60").

### 9.3 Banned list entries to add (to Rail 3.2's `BANNED`)

```js
  // ---- savers: added with questions A and B ----------------------------------------------
  { id: 'contribution',    re: /\bcontribut(e|es|ed|ing|ion|ions|ory)\b/i,       scope: 'all',
    say: 'pay in / what you pay in / what goes in each month' },
  { id: 'employer-contrib',re: /\bemployer('s)? (contribution|match)\b/i,         scope: 'all',
    say: "your employer's part" },
  { id: 'tax-relief',      kind: 'explain', re: /\btax relief\b/i,               scope: 'first',
    needs: /the tax the government adds back/i },
  { id: 'retirement-age',  re: /\bretirement (age|date)\b/i,                     scope: 'all',
    say: 'the age you have in mind / stop at 60', allow: [/State Pension age/i] },
  { id: 'target',          re: /\btarget (pot|age|date|income|fund)\b/i,         scope: 'all',
    say: 'the number / the age you have in mind / what you want to spend' },
  { id: 'projection',      re: /\bproject(ed|ion|ions|ing)\b/i,                  scope: 'all',
    say: 'what the pot could be by 60 in a bad, middling and good case' },
  { id: 'forecast-pot',    re: /\bforecast\b/i,                                  scope: 'result',
    say: 'what the pot could be', allow: [/State Pension forecast/i, /your forecast/i, /their forecast/i] },
  { id: 'on-track',        re: /\bon track\b/i,                                  scope: 'all',
    say: 'on course' },
  { id: 'confidence',      re: /\bconfiden(ce|t|tly)\b/i,                        scope: 'result',
    say: '"in 9 futures out of 10"' },
  { id: 'shortfall',       re: /\b(shortfall|deficit)s?\b/i,                     scope: 'all',
    say: '"£70,000 short" / "falling short"' },
  { id: 'withdrawal-rate', re: /\b((safe |sustainable )?withdrawal|drawdown) rate\b|\b4 ?% rule\b/i, scope: 'all',
    say: 'what you could spend a month' },
  { id: 'sustainable',     re: /\bsustainab(le|ility)\b/i,                       scope: 'all',
    say: 'lasted / what you could spend' },
  { id: 'coast',           re: /\bcoast(ing|s|ed)?\b/i,                          scope: 'all',
    say: 'pay in until age {50} / paying nothing in' },
  { id: 'fire',            re: /\b(FIRE|FI\/RE|OMY)\b/,                          scope: 'all',
    say: 'leave it out' },
  { id: 'semi-retire',     re: /\b(semi|phased|partial)[\s-]?retire\w*\b|\bwind(ing)?[\s-]down\b/i, scope: 'all',
    say: 'part-time work' },
  { id: 'feasible',        re: /\b(feasible|affordable|viable|achievable|realistic)\b/i, scope: 'result',
    say: '"Yes — you could stop at 60" / "lasted in 9 futures out of 10"' },
  { id: 'pass-fail',       re: /\b(pass(es|ed)?|fail(s|ed|ure)?)\b/i,            scope: 'result',
    say: '"lasted" / "ran out"' },
  { id: 'soften-harden',   re: /\b(probably|maybe|definitely|certainly|safely|comfortably) (stop|retire|afford|reach|get there)\b/i, scope: 'result',
    say: 'the verdict word and the count out of 10' },
  { id: 'compound',        re: /\bcompound(ed|ing|s)?\b/i,                       scope: 'all',
    say: 'growing' },
  { id: 'growth-rate',     re: /\b\d(\.\d)? ?% (a year |per year |annual )?(growth|return)\b/i, scope: 'first',
    say: 'tested against many possible futures — never a fixed rate' },
  { id: 'years-from-now',  re: /\bin \d{1,2} years(['’] time)?\b/i,              scope: 'planner',
    say: 'an age ("at 60"), or the month typed ("in June 2030, when you are 60")',
    allow: [/for \d{1,2} years/i] },                    // part-time "for 3 years" is a length, not a wait
  { id: 'a-year-longer',   re: /\b(a|one) year (longer|more|extra)\b/i,          scope: 'result',
    say: '"working until 61 instead of 60"' },
```

Two things to note for whoever builds the check:

1. `time-to-wait`, `to-go`, `when-you-retire` and `retire-date` (scope `retired`) are applied to A's and B's
   strings too, on the argument that every string must pass in every state and A and B never show a string
   to a retired person except the 6.4 screen — which is checked as `retired`. "Stop at 60" and "until you
   are 60" pass those patterns; "stop work in 2030" would not, and is not used.
2. `contribution` will catch "career-average" no more than `equities` catches "equity release" — but it
   will catch the release-notes history, which is not checked, and the "How it is worked out" page, which
   may use it once after the plain word.

### 9.4 Small words that matter (adds to Rail 3.6)

| Write | Not |
|---|---|
| stop at 60 / the age you have in mind | retire at 60 / retirement age / target age |
| pay in / what goes in each month | contribute / contributions / save into (in this app "save" is "keep a plan") |
| your employer's part | employer contribution |
| the number / the pot you would want by then | target / goal / fund needed |
| reached it in 9 futures out of 10 | 90% probability / confidence |
| £70,000 short | a shortfall of £70,000 / −£70,000 |
| on course | on track |
| part-time work | semi-retirement / phasing down |
| while saving / once stopped | accumulation / decumulation |
| Show if it works / Show me the ages / Show what I need (buttons) | Calculate / Run / Check affordability |

---

## 10. Decisions for the owner

Builders proceed on what this document says; each of these is a small change if made before the slice joins
up.

1. **The verdict thresholds.** `yes` at 9 in 10 or better (the careful line); `close` from 7 in 10 up to 9;
   `no` below 7. Confirm the 7.
2. **Two risk levels, both Balanced by default.** Most workplace pensions hold more in shares while saving
   than Balanced does; a default of Adventurous while saving would raise every pot at the stop age and is
   nearer what people actually hold, but it is the less cautious choice. Confirm Balanced, or say
   Adventurous.
3. **What "going in each month" means.** Taken as what lands in the pension (the employer's part and the
   tax added back inside it), because that is the figure on a statement. The alternative asks for the
   payslip figure and grosses it up, which needs a tax band and a scheme type. Confirm.
4. **The ages in the small chart** — seven, fixed by rule (the named age, two before, two after, five on,
   State Pension age), with every age on step 3. Confirm, or name a different set.
5. **The cost of the chart.** Seven careful amounts is seven of C's solves. If the final pass misses the
   15-second budget on a slowed phone, the careful amounts arrive in a third pass (6.2). Accept that, or
   trim the chart to five ages.
6. **Part-time while still paying in** is not asked (the earnings are spent, not saved). Add "still paying
   in while part-time" later, or now?
7. **No box on the front door for A or B** (C keeps its pot box). The alternative is a stop-age box on A's
   card ("I'm thinking of age [ 60 ]"). Keep it plain, or add it?
8. **The "Accept the chance" lever has no button** and states the bad-case pot and what it pays. Confirm
   that this is the right way to show "accept a stated chance of falling short" without ranking it.
9. **"On course" hides the pay-in headline** and gives the smallest pay-in that still works instead.
   Confirm.
10. **A month as well as an age** for the stop ("in June 2030, when you are 60"). It costs two boxes and one
    rule; it is the only place a date appears on A. Keep, or ages only?
11. **`b.outside`**: when the stop age is before a pension opens, the number is split into a pension part
    and a savings part, with a second monthly figure for the savings. Confirm the split is worth its words on
    a first answer, or leave it to "Answer everything in full".
12. **The new banned entries** (9.3), in particular `contribution`, `projection`, `on-track` and
    `sustainable`, which will catch honest sentences on first use. Sign off once, as Rail 3.2's list was.
13. **Step 3 of A ("every age") and of B ("two levers together")** are built in this slice. They are cheap
    (one "lasted" test per cell) and answer S03 and S02's "options" directly. Confirm they are in, or leave
    them on the rail unbuilt as C's `ways` was.
