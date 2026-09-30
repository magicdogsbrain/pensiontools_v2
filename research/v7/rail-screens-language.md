# V7 — the rail, the screens for the first slice, and the language guide

Draft for the owner, 30 Sep 2026. Nothing here is built. This is sub-plan "Rail and screen design" plus
sub-plan "Language guide" from `research/v7-plan-of-plans.md` section 5, written for step 3 (question C,
"I've got about £X — what is that a month?").

It has three parts:

1. **The rail as data** — the steps for each question, which are optional, what a locked plan sees, and the
   one "next" sentence for every state.
2. **The screens for the first slice** — front door, the question-C form, the answer, and the empty, working
   and failed states, each drawn at desktop and phone width with the real words.
3. **The language guide** — names, the banned-words list (written so it can become an automated check),
   sentence templates, how numbers and risk are written, and the advice line.

Three things to know before reading:

- **Every figure in a drawing is made up** to show layout and wording. None is the owner's and none was
  computed. Real figures come from the answer function.
- **The drawings use plain keyboard characters.** `[x]` done, `[>]` you are here, `[ ]` not done yet, `[=]`
  locked, `(o)` a chosen option, `v` something that opens. Real screens use proper ticks and dashes.
- **Two architecture drafts exist** (`research/v7/architecture-A.md` and `-B.md`) and they spell addresses
  differently. This document fixes the *step ids* and the *words*; whichever architecture is chosen decides
  how an id appears in the address bar. Figures never appear in an address in either.

---

## Part 1 — The rail as data

### 1.1 What the rail is

The rail replaces the tab bar. It is the list of steps for the question you asked, in order, with a mark
against each, a short result under each finished step, and **one sentence that says what to do next**.
There is no other navigation between steps.

Rules (each becomes a test):

| # | Rule |
|---|---|
| R1 | The rail is a data table plus one pure function. Input: the question, the plan, the life stage from `deriveStage`, today's date. Output: the steps with their state, and the next sentence. No screen decides any of this. |
| R2 | The life stage is worked out, never asked for and never chosen (`src/services/LifeStage.js`). |
| R3 | **No step is ever blocked.** A step that needs a figure you have not given shows a short form for just those figures, on that step. There is no "set up another screen first". |
| R4 | Every step says whether it is optional, on the rail itself. |
| R5 | Every state has exactly one next sentence. A step is either the end of its question or has a next step. No dead ends. |
| R6 | Looking around never changes a locked plan. On a locked plan the planner steps become "try a change" only: they read the plan, they write nothing. |
| R7 | A step that is hidden for your stage still opens if you type its address. It shows one sentence saying why it is not on your rail and a way back. |
| R8 | The rail shows the person's own numbers once they exist. It never shows a number the answer function did not produce. |
| R9 | The rail never draws on `stage.label`, `stage.chip` or `stage.banner` from `LifeStage.js`. Those hold today's wording ("Stress tester", "run-up", "7 months to go", "Decision tool", "plan start"), all of which part 3 bans. V7 uses `stage.key` and the dates only, with its own words from 1.3. The same goes for the text returned by `decisionEntryAllowed` ("plan year 0"). |

### 1.2 The states a step can be in

| State | Mark | Meaning |
|---|---|---|
| `current` | `[>]` | The step on screen now |
| `done` | `[x]` | Has what it needs; its short result is shown under its name |
| `open` | `[ ]` | Not done yet; can be opened at any time |
| `try-only` | `[=]` | The plan is locked. The step opens, shows the plan's figures, and lets you try a change that is not saved |
| `hidden` | — | Not shown for this life stage (rule R7 still applies) |

"Optional" is a property of the step, not a state: an optional step shows the word "optional" beside its
name in every state.

### 1.3 Life stages, in V7's words

The key is what `deriveStage` returns. The words on the right are the only stage words V7 shows.

| `stage.key` | How it is worked out today | V7 says | Never says |
|---|---|---|---|
| `unknown` | no age given | (nothing — no stage line) | "Getting started" |
| `saving` | not retired, not locked, more than 5 years from stopping | "Still saving" | "accumulation" |
| `approaching` | not retired, not locked, 5 years or less | "Stopping work within five years" | "approaching retirement" is allowed; "plan start" is not |
| `committed-saving` | not retired, locked, before the stop month | "Plan locked. Still working until {June 2030}." | "Committed", "N years to go" as a chip |
| `draft-retired` | retired, not locked | "Retired. Plan not locked yet." | "designing the plan" |
| `bridge` | retired, locked, before the plan's first tax year | "Retired. Your {ladder} pays from {April 2027}." | "bridge", "run-up", "N months to go", "plan starts" |
| `running` | locked, plan under way | "Retired. Living on the plan." | "Running the plan" |

A saver may be shown a date to aim at ("until June 2030"). A retired person is never shown a countdown:
for `draft-retired`, `bridge` and `running` the rail gives **dates** ("pays from April 2027"), never a
length of time still to wait.

### 1.4 Question C in full

**C — "I've got about £X — what is that a month?"**

| # | Step id | Label on the rail (a plain question) | Short label (phone, and when space is tight) | Optional | What it needs first | Short result shown when done | End of the question? |
|---|---|---|---|---|---|---|---|
| 1 | `numbers` | What have you got? | Your numbers | no | nothing | "£250,000, age 58" (add "and a partner" for two) | no |
| 2 | `answer` | What does it pay a month? | What it pays | no | pot and age — asked on this step if missing | "about £1,050 a month" | no |
| 3 | `ways` | What are the ways to take it? | Ways to take it | yes | the answer | the way chosen, or nothing | no |
| 4 | `keep` | Keep this plan? | Keep this plan | yes | the answer | "Kept 30 Sep 2026" | yes |

Notes on the four steps:

- `numbers` is the short form (2.2). "Add a partner" and "Add more detail" open on the same step; they are
  not steps of their own.
- `answer` is the screen in 2.3. "What it is made of", the assumptions and the try-a-change row are parts
  of this step, not separate steps, so the first answer is two screens from the front door.
- `ways` is the plain comparison of drawing it down, buying an annuity and cashing it in. It is on the rail
  from day one so the shape is fixed, but **its screen is not drawn in this document** (see open question 3).
- `keep` saves the plan. With no account it offers a free account (the figures are carried over, as guest
  plans are today) and, as the other choice, a file to download.

The same table as data (names of fields are a proposal; the step ids and the words are what is being fixed):

```js
// src/v7/rail/questionC.js  (path depends on the architecture chosen)
export const QUESTION_C = {
  id: 'C',
  ask:   "I've got about £X — what is that a month?",   // the front door, in the visitor's words
  title: 'What is that a month?',                        // heading of the rail
  steps: [
    { id: 'numbers', label: 'What have you got?',            short: 'Your numbers',
      optional: false, needs: [],             result: 'numbers.summary', end: false },
    { id: 'answer',  label: 'What does it pay a month?',     short: 'What it pays',
      optional: false, needs: ['pot', 'age'], result: 'monthly.careful',  end: false },
    { id: 'ways',    label: 'What are the ways to take it?', short: 'Ways to take it',
      optional: true,  needs: ['answer'],     result: 'way.chosen',       end: false },
    { id: 'keep',    label: 'Keep this plan?',               short: 'Keep this plan',
      optional: true,  needs: ['answer'],     result: 'plan.keptOn',      end: true  }
  ],
  // state of each step by plan state and life stage; anything not listed is 'open'
  when: {
    locked: { numbers: 'try-only', answer: 'try-only', ways: 'try-only', keep: 'hidden' }
  },
  next: 'C'   // key into the next-sentence table below
};
```

**Question C by plan state and life stage**

| Plan | Stage keys | `numbers` | `answer` | `ways` | `keep` |
|---|---|---|---|---|---|
| Nothing entered | `unknown` | current | open (asks for pot and age itself) | open | open (asks for pot and age itself) |
| Draft, not kept | any unlocked | done / current | open → done | open | open |
| Draft, kept | `saving`, `approaching`, `draft-retired`, `unknown` | done | done | open | done |
| Locked | `committed-saving`, `bridge`, `running` | try-only, filled from the plan document | try-only | try-only | hidden — replaced by "Keep this as a separate plan" |

On a locked plan the heading over the C rail reads **"Your plan is locked. Anything you try here is not
saved to it."** and the figures in step 1 come from the plan document, not from live settings.

**The next sentence for question C** — one per state, first match wins. `{…}` are filled from state.

| Id | When | The sentence | Button |
|---|---|---|---|
| `C.locked` | the plan is locked | Your plan is locked, so nothing you try here changes it. Next: {the plan rail's own next sentence, 1.6}. | Back to your plan |
| `C.failed` | the last run failed | Next: try again. Your numbers are still here. | Try again |
| `C.working` | a run is under way | Working out your answer. | — |
| `C.blank` | no pot or no age | Next: two numbers are enough. Then press "Show what it pays". | — |
| `C.fix` | a figure is outside what we can use | Next: check the figure marked below. | — |
| `C.ready` | pot and age given, no answer yet | Next: press "Show what it pays". | Show what it pays |
| `C.answered` | answer shown, plan not kept | Next: try a change below, or keep this plan so you can come back to it. | Keep this plan |
| `C.kept.guest` | kept in this browser only, not signed in | Kept in this browser. Next: make a free account so it is there next time. | Make an account |
| `C.kept.saving` | kept; stage `saving` or `approaching` | Kept. Next: see when you could afford to stop work. | When can I afford to stop? |
| `C.kept.retired` | kept; stage `draft-retired` | Kept. Next: check it lasts at what you spend now. | Will it last? |
| `C.kept` | kept; stage `unknown` | Kept. Next: pick the question closest to yours. | All questions |

### 1.5 The other questions, in outline

These fix the shape. Each gets its own full table (like 1.4) in its "answer contract" plan before its slice
starts. Every question ends with the same optional `keep` step, left out below.

**A — "When can I afford to stop work?"**

| # | Step id | Label | Optional |
|---|---|---|---|
| 1 | `numbers` | What have you got, and what do you want to spend? | no |
| 2 | `answer` | Could I stop at {60}? | no |
| 3 | `ages` | What about other ages? | no |
| 4 | `one-more-year` | What would one more year of work buy? | yes |
| 5 | `before-state-pension` | What pays the bills before my State Pension starts? | yes |
| 6 | `part-time` | Would some part-time work help? | yes |

**B — "Am I saving enough, and what should I pay in?"**

| # | Step id | Label | Optional |
|---|---|---|---|
| 1 | `numbers` | What have you saved, and what are you paying in? | no |
| 2 | `target` | How much will I need? | no |
| 3 | `answer` | Am I on course for it? | no |
| 4 | `pay-in` | What should I pay in each month? | no |
| 5 | `choices` | What if I can't afford that? | yes |

**D — "I'm retired — will it last, can I spend more, would some work help?"**

| # | Step id | Label | Optional |
|---|---|---|---|
| 1 | `numbers` | What have you got, and what do you spend? | no |
| 2 | `answer` | Will it last? | no |
| 3 | `spend-more` | Could I spend more? | no |
| 4 | `work` | Would some work help? | yes |
| 5 | `lock` | Lock this plan and follow it month by month? | yes |

**E — "Test my plan and compare strategies"** (the Drawdown Planner in full)

| # | Step id | Label | Optional |
|---|---|---|---|
| 1 | `plan` | Your plan in full (every question answered in detail) | no |
| 2 | `mix` | What do you intend to hold in retirement? (a pot and a risk level; a fund list here is the intended portfolio) | no |
| 3 | `answer` | Does it come through the bad times? (the stress test against history) | no |
| 4 | `compare` | Which way of taking the money suits the plan? | yes |
| 5 | `lock` | Lock the plan and make the plan document | yes |
| 6 | `hold` | What you hold (today's actual holdings — a separate record) | yes |
| 7 | `move` | Moving to your plan's mix (says on its face: optional, and what skipping it costs) | yes |
| 8 | `month` | Month by month (opens once the plan is locked and you have stopped work) | yes |

**F — "I have one decision to make"**

A short list, then the same three steps for whichever is picked.

| # | Step id | Label | Optional |
|---|---|---|---|
| 0 | `pick` | Which decision? (tax-free cash and which pot first · an annuity, drawdown or some of each · a final-salary pension early or late · the mortgage) | no |
| 1 | `numbers` | What are the figures? | no |
| 2 | `answer` | The two choices side by side | no |
| 3 | `effect` | What does that do to my plan? | yes |

**Which questions a plan's rail offers, by life stage.** The front door always shows all six to a visitor
with no plan; this table applies once there is a plan and therefore a stage.

| Stage key | Opens on | Also offered | Try-a-change only | Hidden (rule R7) |
|---|---|---|---|---|
| `unknown` | the question asked | all six | — | Month by month |
| `saving` | B | A, C, E, F, What you hold | — | D, Month by month |
| `approaching` | A | B, C, E, F, What you hold, Moving to your plan's mix | — | D, Month by month |
| `committed-saving` | Your plan (1.6) | B, F, What you hold, Moving to your plan's mix | A, C, E | D. Month by month shows "Opens in {June 2030}, when you stop work." |
| `draft-retired` | D | C, E, F, What you hold, Moving to your plan's mix | — | A, B. Month by month shows "Opens when you lock the plan." |
| `bridge` | This month (1.6) | F, What you hold, Moving to your plan's mix | C, D, E | A, B |
| `running` | This month (1.6) | F, What you hold, Moving to your plan's mix | C, D, E | A, B |

The sentence a hidden step shows when its address is opened directly:

- A or B while retired: "This question is for people who are still working. Your plan says you have
  stopped. [Back to your plan] [That's wrong — change it]"
- D while still working: "This question is for people who have stopped work. Your plan says you stop in
  {June 2030}. [When can I afford to stop?] [That's wrong — change it]"

### 1.6 A locked plan: the rail with its numbers on it

A locked plan does not open on a question. It opens on **Your plan**, a rail of its own made from the tail
of question E plus the record screens. This is what the owner sees: retired, a gilt ladder paying from tax
year 2027/28, one month recorded each month. Stage today: `bridge`. From April 2027: `running`.

| # | Station id | Label | State when locked | The number on the rail | Comes from |
|---|---|---|---|---|---|
| 1 | `month` | This month | current until the month is recorded, then done | "{September 2026} is not recorded yet" / "{September 2026} recorded on {3 Oct}" | the Month by month history |
| 2 | `where` | Where you are | done | "{1} month recorded. Took £{3,480}; the plan said £{3,500}" | `whereAmI()` on the plan document |
| 3 | `plan` | Your plan | done | "£{3,500} a month now. Ladder pays £{4,200} a month from {April 2027} (tax year {2027/28})" | the plan document only — never live settings |
| 4 | `hold` | What you hold | done or open | "Pension £{612,000}, ISA £{88,000}. Updated {14 Sep 2026}" | the holdings record |
| 5 | `move` | Moving to your plan's mix | open, optional | "{6} of {18} gilts bought" | holdings against the plan document |
| 6 | `test` | Test the plan | try-only | "Locked. You can try a change here. It will not alter your plan" | — |
| 7 | `decide` | One decision | open | — | — |

Figures on this rail are **records**, so they are exact: no "about", no rounding beyond the pound (3.5).

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner    Ask a question   Chris   [ Sign out ] |
+----------------------------------------------------------------------------+
| YOUR PLAN   Locked 12 Sep 2026.  Gilt ladder.  Retired.                    |
|                                                                            |
| [>] This month         September 2026 is not recorded yet                  |
| [x] Where you are      1 month recorded. Took £3,480; the plan said £3,500 |
| [x] Your plan          £3,500 a month now. Ladder pays £4,200 a month from |
|                        April 2027 (tax year 2027/28)                       |
| [x] What you hold      Pension £612,000, ISA £88,000.  Updated 14 Sep 2026 |
| [ ] Moving to your     Optional.  6 of 18 gilts bought                     |
|     plan's mix                                                             |
| [=] Test the plan      Locked.  You can try a change here. It will not     |
|                        alter your plan                                     |
| [ ] One decision       Tax-free cash, an annuity, and more                 |
|                                                                            |
| Next: record September 2026.                        [ Record September ]   |
+----------------------------------------------------------------------------+
```

On a phone this is the same one line that opens (1.7):

```text
+--------------------------------------+
| PensionTools               [ Chris ] |
+--------------------------------------+
| Your plan: This month             v  |
| Next: record September 2026.         |
+--------------------------------------+
| (the line above, opened)             |
|                                      |
| [>] This month                       |
|     September 2026 not recorded      |
| [x] Where you are                    |
|     1 month recorded                 |
| [x] Your plan                        |
|     £3,500 a month now. Ladder pays  |
|     £4,200 a month from April 2027   |
| [x] What you hold                    |
|     £700,000. Updated 14 Sep 2026    |
| [ ] Moving to your plan's mix        |
|     Optional. 6 of 18 gilts bought   |
| [=] Test the plan                    |
|     Locked. Try a change here        |
| [ ] One decision                     |
|                                      |
| [ Ask a question ]                   |
+--------------------------------------+
```

**The next sentence for a locked plan** — first match wins.

| Id | Stage | When | The sentence | Button |
|---|---|---|---|---|
| `P.readonly` | any | the plan was saved by a newer version of the app, or could not be brought up to date | This plan is shown as it was saved and cannot be changed here. Nothing has been lost. | — |
| `P.taxyear` | `bridge`, `running` | a new tax year has started and is not set up | Next: set up the {2027/28} tax year. | Set up {2027/28} |
| `P.month` | `bridge`, `running` | this month is not recorded | Next: record {September 2026}. | Record {September} |
| `P.arrived` | `running` | first month after a plan locked while working; pots differ from the plan by more than the tolerance | Your pot is £{x} against £{y} in the plan. Next: choose whether to carry on with the plan or unlock it and plan again. | Look at the choices |
| `P.idle` | `bridge`, `running` | this month is recorded | {September 2026} is recorded. Nothing to do until {October}. | — |
| `P.working` | `committed-saving` | always | Your plan is locked and you stop work in {June 2030}. Next: check you are still saving enough. | Am I saving enough? |

`P.idle` and `P.month` for the `bridge` stage add the dated line from 1.3 above the rail ("Retired. Your
ladder pays from April 2027."). Nothing on this rail counts months down.

**What a locked plan can and cannot do on the rail**

| Action | Locked plan |
|---|---|
| Open any step of C, D or E | Yes — as try-a-change. A banner says nothing is saved to the plan. |
| Change the strategy or the plan's settings | No. The button reads "Unlock to change the plan" and explains that unlocking keeps the plan document as a past version. |
| Record a month, set up a tax year, edit What you hold | Yes — these are records, not the plan. |
| Keep a try-a-change result | Yes, as a **separate** plan ("Keep this as a separate plan"). |

### 1.7 The rail on a phone: one line that opens

On a phone (under 700px wide, the existing break point) the rail is **one line under the header**:

```text
Step 2 of 4: What does it pay?    v
Next: try a change, or keep this
plan.
```

- The line shows "Step N of M", the step's short label and an arrow. The next sentence sits under it and
  wraps to two lines at most.
- Pressing the line opens the whole rail as a sheet over the screen; pressing a step goes there and closes
  the sheet. "Ask a different question" is always the last thing in the sheet.
- For a locked plan the line reads "Your plan: {station}" instead of "Step N of M".
- There is no bottom bar. One way to move about, in one place.

```text
+--------------------------------------+
| What is that a month?      [ Close ] |
+--------------------------------------+
| [x] 1 What have you got?             |
|       £250,000, age 58               |
| [>] 2 What does it pay a month?      |
|       about £1,050 a month           |
| [ ] 3 What are the ways to take      |
|       it?  (optional)                |
| [ ] 4 Keep this plan? (optional)     |
+--------------------------------------+
| Next: try a change, or keep this     |
| plan.                                |
+--------------------------------------+
| [ Ask a different question ]         |
+--------------------------------------+
```

### 1.8 What the tests read from the rail

| Test | Reads |
|---|---|
| Every question × every stage × locked or not gives a rail with exactly one `current` step and exactly one next sentence | the pure rail function |
| Every step is reachable from the front door; every step is an end or has a next | the rail tables |
| Opening any step's address with nothing entered shows that step with a short form, not an error | browser crawl |
| A locked plan is identical, byte for byte, after every step of every question has been opened and every try-a-change pressed; no save was sent | browser crawl on a locked fixture |
| No rail string for a retired stage matches a retired-scope banned pattern | the wording check (3.2) |
| The number on the rail equals the answer function's number | `data-value` on each short result |

---

## Part 2 — The screens for the first slice

Five screens, each at desktop (78 columns) and phone (40 columns). Addresses are given as step ids; the
figures typed into a form are never part of an address.

| Screen | Step id | Shown when |
|---|---|---|
| The front door | — | No plan, or "All questions" pressed |
| What have you got? | `C/numbers` | Question C chosen |
| What does it pay a month? | `C/answer` | "Show what it pays" pressed, or the address opened |
| … with nothing entered | `C/answer` | The address opened with no pot or age |
| … working / failed | `C/answer` | During and after a run |

### 2.1 The front door

Who sees it and who does not:

| Visitor | Lands on |
|---|---|
| New, not signed in | The front door |
| Not signed in, with a plan kept in this browser | The front door, with one line above the questions: "Carry on where you left off: What is that a month? [ Carry on ]" |
| Signed in, latest plan locked | Straight to **Your plan** (1.6), on the station the next sentence names |
| Signed in, latest plan not locked | Straight to that plan, at the last step they were on |
| Anyone opening a full address | That address. An address always wins. |

A returning user gets back to the six questions from "Ask a question" in the header.

```text
+----------------------------------------------------------------------------+
| PensionTools                         Who runs this   Privacy   [ Sign in ] |
+----------------------------------------------------------------------------+
|                                                                            |
| What would you like to know?                                               |
|                                                                            |
| Pick the question closest to yours. You do not need an account. A first    |
| answer takes about two minutes and a handful of numbers.                   |
|                                                                            |
| +----------------------------------+  +----------------------------------+ |
| | A                                |  | B                                | |
| | When can I afford to stop work?  |  | Am I saving enough?              | |
| |                                  |  | And what should I pay in?        | |
| | See different ages side by side. |  | The amount to aim for, and the   | |
| +----------------------------------+  | monthly saving that gets there.  | |
|                                       +----------------------------------+ |
|                                                                            |
| +----------------------------------+  +----------------------------------+ |
| | C                                |  | D                                | |
| | I've got about  £ [ 250,000  ]   |  | I'm retired. Will it last?       | |
| | What is that a month?            |  | Could I spend more?              | |
| |                                  |  | Would some work help?            | |
| | [ Show me ]                      |  +----------------------------------+ |
| +----------------------------------+                                       |
|                                                                            |
| +----------------------------------+  +----------------------------------+ |
| | E                                |  | F                                | |
| | I have a plan. Test it.          |  | I have one decision to make.     | |
| | Try it against the bad times and |  | Tax-free cash, the mortgage, a   | |
| | compare ways to take the money.  |  | final-salary pension early or    | |
| +----------------------------------+  | late, or buying a guaranteed     | |
|                                       | income for life (an annuity).    | |
|                                       +----------------------------------+ |
|                                                                            |
| Been here before?  [ Sign in to open your plan ]                           |
|                                                                            |
+----------------------------------------------------------------------------+
| PensionTools works things out from the figures you give it. It is an       |
| illustration, not financial advice.                                        |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| What would you like to know?         |
|                                      |
| No account needed. A first answer    |
| takes about two minutes.             |
+--------------------------------------+
| A  When can I afford to stop work?   |
|                                    > |
+--------------------------------------+
| B  Am I saving enough, and what      |
|    should I pay in?                > |
+--------------------------------------+
| C  I've got about £ [ 250,000  ]     |
|    What is that a month?             |
|    [ Show me ]                       |
+--------------------------------------+
| D  I'm retired. Will it last?        |
|    Could I spend more? Would some    |
|    work help?                      > |
+--------------------------------------+
| E  I have a plan. Test it and        |
|    compare ways of taking the        |
|    money.                          > |
+--------------------------------------+
| F  I have one decision to make.    > |
+--------------------------------------+
| Been here before?                    |
| [ Sign in to open your plan ]        |
+--------------------------------------+
| An illustration from your figures,   |
| not financial advice.                |
| Who runs this  -  Privacy            |
+--------------------------------------+
```

Notes:

- The six questions are in the visitor's words and carry no tool names. The letters A–F are shown small, as
  a way to refer to a question; they can be dropped if the owner prefers.
- **Question C takes its first number on the front door.** Typing a pot and pressing "Show me" goes to
  `C/numbers` with the pot filled in and the cursor in "Your age". This saves a screen for the visitor in a
  hurry and is the only field on the front door.
- "Been here before?" is the only mention of an account. There is no sign-up step, tour or pop-up before
  the first answer.
- During the first slice only question C is built. See open question 2 for what the other five do until
  their slices arrive.

### 2.2 Question C, step 1 — "What have you got?"

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| WHAT IS THAT A MONTH?                                                      |
| [>] 1 What have you got?   ---   [ ] 2 What does it pay a month?           |
| [ ] 3 What are the ways to take it? (optional)                             |
| [ ] 4 Keep this plan? (optional)                                           |
| Next: two numbers are enough. Then press "Show what it pays".              |
+----------------------------------------------------------------------------+
|                                                                            |
| What have you got?                                                         |
| Rough figures are fine. You can change any of them afterwards.             |
|                                                                            |
| Your pension pot          £ [ 250,000    ]                                 |
|                           All your pension pots added together.            |
|                                                                            |
| Your age                    [ 58 ]                                         |
|                                                                            |
| Start taking it           (o) Now      ( ) From age [    ]                 |
|                                                                            |
| State Pension             (o) The full amount: £12,500 a year from age 67  |
|                           ( ) My forecast:  £ [        ] a year            |
|                           ( ) None                                         |
|                                                                            |
| A final-salary pension?   (o) No                                           |
|                           ( ) Yes:  £ [        ] a year, from age [    ]   |
|                                                                            |
| [ + Add a partner ]      [ + Add more detail ]                             |
|                                                                            |
| [ Show what it pays ]                                                      |
|                                                                            |
| Your figures stay in this browser until you choose to keep the plan.       |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| What is that a month?                |
| Step 1 of 4: What have you got?   v  |
+--------------------------------------+
| What have you got?                   |
| Rough figures are fine.              |
|                                      |
| Your pension pot                     |
| £ [ 250,000                  ]       |
| All your pension pots together.      |
|                                      |
| Your age                             |
| [ 58 ]                               |
|                                      |
| Start taking it                      |
| (o) Now                              |
| ( ) From age [    ]                  |
|                                      |
| State Pension                        |
| (o) The full amount: £12,500 a       |
|     year from age 67                 |
| ( ) My forecast: £ [      ] a year   |
| ( ) None                             |
|                                      |
| A final-salary pension?              |
| (o) No                               |
| ( ) Yes: £ [       ] a year          |
|     from age [    ]                  |
|                                      |
| [ + Add a partner ]                  |
| [ + Add more detail ]                |
|                                      |
| [       Show what it pays        ]   |
|                                      |
| Your figures stay in this browser    |
| until you choose to keep the plan.   |
+--------------------------------------+
```

**The short form, field by field**

| Field | Starts as | Words under it | Rules |
|---|---|---|---|
| Your pension pot | empty (or the front door's figure) | All your pension pots added together. | Pounds, whole. Commas and a "£" typed by the visitor are accepted. |
| Your age | empty | — | Whole years. |
| Start taking it | "Now" if the age is at or past the earliest pension age; otherwise "From age" filled with the earliest age allowed | If under the earliest age: "You cannot normally take a pension before {55/57}. We have started at {57}." | Never earlier than today's age. |
| State Pension | The full amount | "The full amount: £{x} a year from age {67}" — amount and age for this person, from the engine's own table | "My forecast" takes a yearly figure. |
| A final-salary pension? | No | When Yes: "The yearly amount before tax, as your scheme states it." | Amount a year **and the age it starts**. Asked here, up front, once, and never asked for again on a later step. |

Two typed numbers, three settings that start sensible: inside the limit of five inputs.

**"Add a partner"** opens this block on the same step. Five fields, and nothing else changes on the page.

```text
+----------------------------------------------------------------------------+
| Your partner                                                  [ Remove ]   |
|                                                                            |
| Partner's age                 [ 56 ]                                       |
| Partner's pension pot       £ [ 90,000     ]   (0 if none)                 |
| Partner's State Pension     (o) The full amount   ( ) Forecast £ [      ]  |
|                             ( ) None                                       |
| A final-salary pension?     (o) No   ( ) Yes: £ [      ] a year from [   ] |
|                                                                            |
| That is all we need for a first answer for the two of you.                 |
| [ Answer in full detail for both of us ]                                   |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| Your partner            [ Remove ]   |
|                                      |
| Partner's age                        |
| [ 56 ]                               |
| Partner's pension pot (0 if none)    |
| £ [ 90,000                   ]       |
| Partner's State Pension              |
| (o) The full amount                  |
| ( ) Forecast: £ [      ] a year      |
| ( ) None                             |
| A final-salary pension?              |
| (o) No                               |
| ( ) Yes: £ [       ] a year          |
|     from age [    ]                  |
|                                      |
| [ Answer in full detail for both ]   |
+--------------------------------------+
```

- With a partner added, every label that said "Your" says whose: "Your pension pot" / "Partner's pension
  pot". The button stays "Show what it pays"; the answer speaks of "the two of you".
- "Answer in full detail for both of us" goes to question E, step 1 ("Your plan in full"), carrying every
  figure already typed. It is offered here, on the answer, and on every later step: the full detail is
  always one press away and never required.

**"Add more detail"** opens this block. Everything in it has a starting value shown on the answer as an
assumption, so skipping it costs nothing.

```text
+----------------------------------------------------------------------------+
| More detail (all optional)                                       [ Close ] |
|                                                                            |
| Other savings you would spend  £ [          ]   ISAs, cash, investments    |
| Risk level                     ( ) Cautious  (o) Balanced  ( ) Adventurous |
| Make it last to age              [ 95 ]                                    |
| What you expect to spend       £ [          ] a month   (or pick a level)  |
|                                                                            |
| [ Answer everything in full ]   opens "Your plan in full", keeping these   |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| More detail (all optional) [ Close ] |
|                                      |
| Other savings you would spend        |
| £ [                          ]       |
| Risk level                           |
| ( ) Cautious                         |
| (o) Balanced                         |
| ( ) Adventurous                      |
| Make it last to age                  |
| [ 95 ]                               |
| What you expect to spend a month     |
| £ [                          ]       |
|                                      |
| [ Answer everything in full ]        |
+--------------------------------------+
```

- "Risk level" here describes the mix the money would be held in **while it is being drawn**. If a fund
  list is ever offered on this path it is headed "What you intend to hold in retirement" and never "your
  holdings" (3.1, 3.2 rule `hold-in-planner`).
- "(or pick a level)" offers the three published living standards already in `BudgetModel.js` — shown as
  "Basic", "Moderate", "Comfortable", single or couple.

**What is wrong with a field, in plain words** (shown under the field, in place of the hint):

| When | Words |
|---|---|
| Pot empty on pressing the button | Type the size of your pension pot, for example 250,000. A rough figure is fine. |
| Pot is not a number | We could not read that as an amount. Use figures only, for example 250,000. |
| Pot is 0 | With no pension pot there is nothing to work out here. If your savings are in ISAs or cash, put them under "Add more detail". |
| Age empty | Type your age in years. |
| Age under 18 or over 100 | Type an age between 18 and 100. |
| "From age" earlier than today's age | That is younger than you are now. Choose "Now" or a later age. |
| "From age" earlier than the earliest pension age | You cannot normally take a pension before {57}. Choose {57} or later. |
| Forecast or final-salary amount not a number | Use figures only, for example 9,000. |
| Final-salary "Yes" with no start age | Type the age your final-salary pension starts. It is on your yearly statement. |

The button is never greyed out. Pressing it with something missing moves to the first field that needs
attention and shows its sentence.

### 2.3 Question C, step 2 — the answer

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| WHAT IS THAT A MONTH?                                                      |
| [x] 1 What have you got?   ---   [>] 2 What does it pay a month?           |
| [ ] 3 What are the ways to take it? (optional)                             |
| [ ] 4 Keep this plan? (optional)                                           |
| Next: try a change below, or keep this plan so you can come back to it.    |
+----------------------------------------------------------------------------+
|                                                                            |
| +------------------------------------------------------------------------+ |
| | About £1,050 a month from your pot                                     | |
| | after tax, from now until you are 95, going up each year with prices   | |
| |                                                                        | |
| | About £2,000 a month in all once your State Pension starts at 67       | |
| +------------------------------------------------------------------------+ |
|                                                                            |
| A pot of £250,000 could pay you about £1,050 a month after tax, from now   |
| until you are 95, going up each year with prices. That amount lasted in 9  |
| futures out of 10.                                                         |
|                                                                            |
| In a bad case (the worst 1 in 10), £1,050 a month only just lasts to 95.   |
| If you took £1,300 a month instead, a bad case would run out at age 86.    |
|                                                                            |
| An illustration from your figures, not financial advice.                   |
+----------------------------------------------------------------------------+
| WHAT IT IS MADE OF   (a month, after tax, at today's prices)               |
|   Age 58 to 66    From your pot £1,050                          = £1,050   |
|   Age 67 to 95    From your pot £1,050  +  State Pension £950   = £2,000   |
|   You could take:   careful £1,050   |   middling £1,300   |   good £1,650 |
|   [ See it year by year ]                                                  |
+----------------------------------------------------------------------------+
| WHAT WE ASSUMED   (press any one to change it)                             |
|   [ Lasts to age 95 ]  [ Balanced: about half in shares ]                  |
|   [ Full State Pension, £12,500 a year from 67 ]  [ No final-salary one ]  |
|   [ A steady amount, going up with prices ]  [ 2026/27 tax, England ]      |
|   [ Charges of 0.5% a year ]                         [ See all of them ]   |
+----------------------------------------------------------------------------+
| TRY A CHANGE                                                               |
|   Pot          [ - £25,000 ]   £250,000   [ + £25,000 ]                    |
|   Start age    [ - 1 year ]    now (58)   [ + 1 year ]                     |
|   Take         £ [ 1,050 ] a month        shows how long that lasts        |
|   Risk level   [ Cautious ]  [*Balanced*]  [ Adventurous ]                 |
|   Way of taking it   [ A steady amount  v ]     [ Compare the ways ]       |
|   Before: -                     Now: about £1,050 a month                  |
+----------------------------------------------------------------------------+
| WHAT NEXT?                                                                 |
|   Still working?    [ When can I afford to stop work? ]                    |
|                     [ Am I saving enough, and what should I pay in? ]      |
|   Already stopped?  [ Will it last, and could I spend more? ]              |
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
| What is that a month?                |
| Step 2 of 4: What does it pay?    v  |
| Next: try a change, or keep this     |
| plan.                                |
+--------------------------------------+
| About £1,050 a month                 |
| from your pot, after tax, from now   |
| until you are 95, going up each      |
| year with prices                     |
|                                      |
| About £2,000 a month in all once     |
| your State Pension starts at 67      |
+--------------------------------------+
| A pot of £250,000 could pay you      |
| about £1,050 a month after tax,      |
| from now until you are 95, going up  |
| each year with prices. That amount   |
| lasted in 9 futures out of 10.       |
|                                      |
| In a bad case (the worst 1 in 10),   |
| £1,050 a month only just lasts to    |
| 95. If you took £1,300 a month       |
| instead, a bad case would run out    |
| at age 86.                           |
|                                      |
| An illustration from your figures,   |
| not financial advice.                |
+--------------------------------------+
| What it is made of                v  |
| What we assumed (7)               v  |
+--------------------------------------+
| Try a change                         |
| Pot         [-] £250,000 [+]         |
| Start age   [-] now (58) [+]         |
| Take        £ [ 1,050 ] a month      |
| Risk level  [ Balanced        v ]    |
| Way of taking it                     |
|             [ A steady amount v ]    |
| Before: -                            |
| Now: about £1,050 a month            |
+--------------------------------------+
| What next?                           |
| Still working?                       |
| [ When can I afford to stop?     ]   |
| [ Am I saving enough?            ]   |
| Already stopped?                     |
| [ Will it last? Could I spend    ]   |
| [ more?                          ]   |
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

| Part | What it shows | Source |
|---|---|---|
| Headline band | The careful monthly amount, large. Under it, what the amount is (after tax, from when to when, rising with prices). Then the total once other income starts. | `monthly.careful`; template `C.head` (3.3) |
| The sentence | The headline again as one sentence a person could read aloud, with the pot and the "9 futures out of 10". | template `C.sentence` |
| The bad-case line | Always present, always directly under the sentence, always names "the worst 1 in 10". | template `C.bad` |
| The short advice line | One line under the bad-case line. | `ADVICE_SHORT` (3.7) |
| What it is made of | One row per stretch of years in which the income is the same: where the money comes from and what it adds up to. Then the three amounts: careful, middling, good. "See it year by year" opens the table. | the result's `parts[]` and `range` |
| What we assumed | One chip per assumption the answer function reports — no more and no fewer. Pressing a chip opens that one setting in place; changing it re-runs the answer. "See all of them" lists every assumption in full sentences. | the result's `assumptions[]` |
| Try a change | Four things to try without leaving the screen: the pot, the age it starts (and the amount taken), the risk level, the way of taking it. | see below |
| What next? | The three questions this leads to, sorted under two plain prompts, and "Keep this plan". | rail table 1.4 |
| The full advice line | The closing paragraph, on every answer. | `ADVICE_FULL` (3.7) |

**The try-a-change row**

| Control | Does | Words |
|---|---|---|
| Pot − / + | Steps the pot down or up by a round amount (£25,000 for pots of £100,000 or more; £5,000 below that) | "Pot" |
| Start age − / + | One year earlier or later; stops at today's age and at the earliest pension age | "Start age" |
| Take £[ ] a month | Turns the question round: you name the amount, the answer gives the age it lasts to in a bad case | "Take £{x} a month — shows how long that lasts" |
| Risk level | Cautious / Balanced / Adventurous | "Risk level" |
| Way of taking it | A short list of the ways that make sense from these few figures; "Compare the ways" goes to question E, step 4 | "Way of taking it" |
| Before / Now | After any change the last answer is kept beside the new one: "Before: about £1,050 a month. Now: about £1,150 a month." One step of "before" is kept. "Go back to before" restores it. | template `C.change` |

- On a phone the four controls stack, and "Risk level" and "Way of taking it" become pick-lists.
- In a couple, "Pot" becomes two rows ("Your pot", "Partner's pot") and "Start age" becomes two rows.
- While a change is being worked out the old figures stay on screen, greyed, marked "Updating".
- On a locked plan the row is the whole point of the step, and the line above it reads "Your plan is
  locked. Anything you try here is not saved to it."

**"What next?"** does the job of asking whether the visitor still works, without a form field: the two
prompts "Still working?" and "Already stopped?" sort the three questions. Whichever is pressed opens that
question's first step with every figure already filled in.

**The couple's answer** uses the same screen. The differences are words only:

| Part | One person | Two people |
|---|---|---|
| Headline | About £1,050 a month from your pot | About £1,450 a month from your two pots |
| Sentence | A pot of £250,000 could pay you … | Pots of £250,000 and £90,000 could pay the two of you … |
| Lasts until | until you are 95 | until the younger of you is 95 |
| Made of | one "From your pot" | "From your pot", "From your partner's pot", each State Pension on its own row from its own start |

### 2.4 The answer address opened with nothing entered

No error and no bounce back to step 1: the step asks for what it needs (rule R3).

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| WHAT IS THAT A MONTH?                                                      |
| [ ] 1 What have you got?   ---   [>] 2 What does it pay a month?           |
| Next: tell us your pot and your age and the answer appears here.           |
+----------------------------------------------------------------------------+
|                                                                            |
| What does it pay a month?                                                  |
|                                                                            |
| We need two numbers to work this out.                                      |
|                                                                            |
| Your pension pot          £ [            ]                                 |
| Your age                    [    ]                                         |
|                                                                            |
| [ Show what it pays ]      [ Answer the other questions first ]            |
|                                                                            |
| Everything else starts from a sensible assumption that you can change.     |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| What is that a month?                |
| Step 2 of 4: What does it pay?    v  |
+--------------------------------------+
| We need two numbers to work this     |
| out.                                 |
|                                      |
| Your pension pot                     |
| £ [                          ]       |
| Your age                             |
| [    ]                               |
|                                      |
| [       Show what it pays        ]   |
|                                      |
| Everything else starts from a        |
| sensible assumption that you can     |
| change.                              |
+--------------------------------------+
```

### 2.5 Working

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| WHAT IS THAT A MONTH?                                                      |
| [x] 1 What have you got?   ---   [>] 2 What does it pay a month?           |
| Working out your answer.                                                   |
+----------------------------------------------------------------------------+
|                                                                            |
| Working out your answer ...                                                |
|                                                                            |
| Trying your numbers against many possible futures.                         |
| [==================>                 ]                                     |
|                                                                            |
| (after 5 seconds) Still working. This can take a little longer on a phone. |
| (the previous answer, if there is one, stays on screen, greyed, marked     |
|  "Updating")                                                               |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| What is that a month?                |
| Step 2 of 4: What does it pay?    v  |
+--------------------------------------+
| Working out your answer ...          |
|                                      |
| Trying your numbers against many     |
| possible futures.                    |
| [=============>           ]          |
|                                      |
| Still working. This can take a       |
| little longer on a phone.            |
+--------------------------------------+
```

- "Working out your answer ..." appears at once. The second sentence appears only if the run passes five
  seconds.
- If an answer is already on screen (a try-a-change), there is no separate working screen: the old answer
  greys and is marked "Updating".
- The rail and the header stay usable throughout.

### 2.6 Failed

```text
+----------------------------------------------------------------------------+
| PensionTools  |  Drawdown Planner            All questions    [ Sign in ]  |
+----------------------------------------------------------------------------+
| WHAT IS THAT A MONTH?                                                      |
| [x] 1 What have you got?   ---   [>] 2 What does it pay a month?           |
| Next: try again. Your numbers are still here.                              |
+----------------------------------------------------------------------------+
|                                                                            |
| Sorry, we could not work that out.                                         |
|                                                                            |
| Nothing has been lost. Your numbers are still here:                        |
|   Pot £250,000  -  age 58  -  start now  -  full State Pension             |
|                                                                            |
| [ Try again ]     [ Change my numbers ]     [ Tell us what happened ]      |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| PensionTools           [ Sign in ]   |
+--------------------------------------+
| What is that a month?                |
| Step 2 of 4: What does it pay?    v  |
+--------------------------------------+
| Sorry, we could not work that out.   |
|                                      |
| Nothing has been lost. Your numbers  |
| are still here.                      |
|                                      |
| [ Try again ]                        |
| [ Change my numbers ]                |
| [ Tell us what happened ]            |
+--------------------------------------+
```

- No technical words, no codes, no blame. The figures are shown so the visitor can see they are safe.
- "Tell us what happened" opens the existing feedback route with nothing personal attached unless they add it.

**Other states, words only**

| State | Where | Words |
|---|---|---|
| Offline | a thin line under the header | You are offline. You can still work things out. Keeping a plan needs a connection. |
| The pot is too small for a monthly amount to mean much | under the headline | see the drawing below |
| Nothing lasts to the age chosen | in place of the headline | With these figures there is no monthly amount that lasts to {95}. Try a later start age or a shorter time. |
| A plan that cannot be changed here | over the rail | This plan is shown as it was saved and cannot be changed here. Nothing has been lost. |
| Figures changed on another device | over the rail | This plan was changed somewhere else. [ Show the latest ] |

```text
+----------------------------------------------------------------------------+
| About £40 a month from your pot                                            |
| after tax, from now until you are 95, going up each year with prices       |
|                                                                            |
| A pot of £12,000 is small to spread over 37 years. Many people with a pot  |
| this size take it as one or a few lump sums instead.                       |
| [ What are the ways to take it? ]                                          |
+----------------------------------------------------------------------------+
```

```text
+--------------------------------------+
| About £40 a month from your pot      |
|                                      |
| A pot of £12,000 is small to spread  |
| over 37 years. Many people with a    |
| pot this size take it as one or a    |
| few lump sums instead.               |
| [ What are the ways to take it? ]    |
+--------------------------------------+
```

### 2.7 What the screen must carry for the tests

| Thing on screen | Must carry |
|---|---|
| Every headline figure | `data-headline` with its key (`C.monthly.careful`), and `data-value` with the unrounded number |
| The sentence for a headline | `data-sentence` with the same key; the figure in it must be the rounded `data-value` |
| Every input, button, rail step, chip | a `data-testid` made from the declared input list or the rail's step id |
| The root of the screen | `data-busy` while working, `data-ready` when drawn |
| Every assumption chip | the assumption's key; the count of chips equals `assumptions.length` |

---

## Part 3 — The language guide

One rule above all: **write it the way you would say it to a neighbour over the fence.** If a word would
need explaining to a retired engineer who has never worked in finance, it needs replacing or explaining on
the spot.

### 3.1 Names of things

Each name is written once, in one file, and used from there. The right-hand column is what must never
appear in V7.

| The thing | Its name in V7 | Was / never call it |
|---|---|---|
| The product | PensionTools | — |
| The planner as a whole (question E's steps, and the header) | Drawdown Planner | Stress Tester, stress tester, decumulation planner |
| Trying a plan against past markets | "the stress test against history" — a feature inside the Drawdown Planner, only in question E | "Stress Tester" as a name |
| The six entry points | "questions" ("All questions", "Ask a question") | doors, tools, modules, tabs |
| The steps of a question | "steps" | stations, tabs, sub-tabs, pages |
| The list of steps | (it has no name on screen) | rail, journey, wizard |
| A saved set of figures | "plan" | scenario |
| The record of what is actually owned today | What you hold | holdings ledger, current holdings, portfolio |
| The mix the plan is tested on | "What you intend to hold in retirement" / "your plan's mix" | holdings, funds, "your portfolio" without "intended" |
| Getting from one to the other | Moving to your plan's mix | transition tool, transition plan |
| The monthly record and what the plan says to do | Month by month | Decision tool |
| Fixing the plan | "Lock the plan" / "locked" / "Unlock to change the plan" | commit, freeze, plan of record |
| The snapshot made at locking | "the plan document" | — |
| The strip that compares the plan with today | Where you are | where-am-I |
| The saving years | "while you are saving", "Am I saving enough?" | accumulation, Accumulation planner |
| The spending list | What you spend | Budget tool |
| A strategy | "a way of taking the money" on first answers; "strategy" is allowed from question E on | decumulation strategy |
| A pension built from contributions | "pension pot" | DC, defined contribution, SIPP (on first answers) |
| A pension promised by an employer | "final-salary pension" (first mention on a form: "final-salary or career-average pension") | DB, defined benefit |
| The three risk levels | Cautious (about a third in shares) · Balanced (about half in shares) · Adventurous (about two thirds in shares) | low/medium/high risk, risk score, 30/70 |
| The three outcomes | a bad case (the worst 1 in 10) · a middling case · a good case (the best 1 in 10) | worst case, pessimistic, P10, median |
| The three amounts | careful · middling · good | low / expected / high, safe |
| The age the money must last to | "lasts to age {95}" | plan-to age, horizon, duration |
| Not signed in | "without an account" | guest mode |
| Bringing an old plan up to date | "We have updated how your plan is stored. Nothing in it has changed." | migration, schema, version |

### 3.2 The banned list

This list is written to be run by a machine. Each entry has:

- `id` — a short name, quoted in the failure message.
- `re` — what to look for (a regular expression; `i` means upper or lower case).
- `scope` — where it is banned (below).
- `say` — what to write instead.
- `allow` — exact text that is let through, if any.
- `needs` — for `kind: 'explain'`: the word is allowed only if this explanation is on the same screen.

**Scopes**

| Scope | Means |
|---|---|
| `all` | Every word V7 shows: the strings file, the sentence templates, and every rendered screen |
| `first` | The front door; every question's steps up to and including its first answer; "What next?" |
| `front` | The front door only |
| `retired` | Any string tagged retired, anything rendered while `stage.retired` is true (`draft-retired`, `bridge`, `running`), and all of question D |
| `planner` | Steps that work something out (questions A–F), as opposed to records |
| `record` | Month by month, What you hold, Where you are, the plan document |
| `result` | Sentences and headlines that state an answer |

**Not checked**: the release-notes history (`src/releases.js`), the privacy policy and legal pages, text a
user typed themselves (plan names, notes, fund names), and the "How it is worked out" page, which may use
the technical word **once, after** the plain one. The current app is not checked until cutover.

Strings the visitor is quoted as saying (the six questions) are tagged `question` and are exempt from
`certainty` only.

```js
// research/v7 proposal — becomes src/v7/copy/banned.js (path per the architecture chosen)
export const BANNED = [
  // ---- names that have been replaced -------------------------------------------------------
  { id: 'stress-tester',   re: /stress[\s-]?tester/i,                       scope: 'all',
    say: 'Drawdown Planner' },
  { id: 'stress-test',     re: /\bstress[\s-]?test(s|ed|ing)?\b/i,          scope: 'all',
    say: 'try it against the bad times',
    allow: [/stress[\s-]test(ed)? against history/i] },
  { id: 'decision-tool',   re: /\bdecision[\s-]?tool\b/i,                   scope: 'all',
    say: 'Month by month' },
  { id: 'accumulation',    re: /\baccumulat(e|es|ed|ing|ion)\b/i,           scope: 'all',
    say: 'saving / while you are saving' },
  { id: 'decumulation',    re: /\bdecumulat(e|es|ed|ing|ion)\b/i,           scope: 'all',
    say: 'taking money from your pension / drawdown' },
  { id: 'transition',      re: /\btransition(s|ed|ing)?\b/i,                scope: 'all',
    say: "Moving to your plan's mix" },
  { id: 'scenario',        re: /\bscenarios?\b/i,                           scope: 'all',
    say: 'plan' },
  { id: 'budget-tool',     re: /\bbudget (tool|planner)\b/i,                scope: 'all',
    say: 'What you spend' },
  { id: 'holdings-ledger', re: /\bholdings? (ledger|record)\b/i,            scope: 'all',
    say: 'What you hold' },
  { id: 'hold-in-planner', re: /\b(your |current |my )?holdings?\b/i,       scope: 'planner',
    say: 'what you intend to hold in retirement',
    allow: [/What you hold/] },
  { id: 'plan-of-record',  re: /\bplan of record\b/i,                       scope: 'all',
    say: 'your locked plan' },
  { id: 'guest-mode',      re: /\bguest( mode| plan| user)?\b/i,            scope: 'all',
    say: 'without an account' },
  { id: 'tabs',            re: /\b(sub-?)?tabs?\b/i,                        scope: 'all',
    say: 'the name of the step' },
  { id: 'wizard',          re: /\b(wizard|onboarding|dashboard)\b/i,        scope: 'all',
    say: 'leave it out' },
  { id: 'tool-names',      re: /\b(tools?|planner|calculator|tester)\b/i,   scope: 'front',
    say: 'the question itself',
    allow: [/PensionTools/] },
  { id: 'tech',            re: /\b(schema\w*|checksum|migrat\w+|firestore|firebase|localStorage|sessionStorage|cache[ds]?|payload|sync(ed|ing)?)\b/i,
    scope: 'all', say: 'say what happened to the plan, in plain words' },

  // ---- time ---------------------------------------------------------------------------------
  { id: 'plan-year',       re: /\bplan[\s-]?years?\b/i,                     scope: 'all',
    say: 'an age ("at 61") or a tax year ("2029/30")' },
  { id: 'year-n',          re: /\byear\s?\d{1,2}\b(?!\d)/i,                 scope: 'all',
    say: 'an age ("at 61") or a tax year ("2029/30")' },
  { id: 'bridge',          re: /\bbridg(e|es|ed|ing)\b/i,                   scope: 'all',
    say: 'the years before your State Pension starts / before your ladder pays',
    allow: [/Bridge & engine/] },                       // a strategy's name — see open question 6
  { id: 'run-up',          re: /\brun[\s-]?up\b/i,                          scope: 'all',
    say: 'give the dates' },
  { id: 'countdown',       re: /\bcount[\s-]?down\b/i,                      scope: 'all',
    say: 'give the date' },
  { id: 'time-to-wait',    re: /\b\d+\s+(more\s+)?(years?|months?|weeks?|days?)\s+(to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b/i,
    scope: 'retired', say: 'a date: "pays from April 2027"' },
  { id: 'to-go',           re: /\bto go\b/i,                                scope: 'retired',
    say: 'a date' },
  { id: 'plan-starts',     re: /\b(plan|drawdown) (start(s|ed|ing)?|begin(s)?|start date)\b/i, scope: 'retired',
    say: '"your ladder pays from {date}" or "from {date}"' },
  { id: 'to-retirement',   re: /\b(years?|months?|time|long) (to|until|till|before) (retirement|you retire)\b/i,
    scope: 'retired', say: 'leave it out — they have retired' },
  { id: 'when-you-retire', re: /\b(when|once|after|before|until) you (retire|stop work(ing)?)\b/i, scope: 'retired',
    say: '"since you stopped work", or leave it out' },
  { id: 'retire-date',     re: /\b(retirement|retiring|stop(ping)? work) (date|age|in \d|at \d)/i, scope: 'retired',
    say: 'leave it out — they have retired' },

  // ---- jargon, banned outright --------------------------------------------------------------
  { id: 'db-dc',           re: /\b(DB|DC)\b/,                               scope: 'all',
    say: 'final-salary pension / pension pot' },
  { id: 'defined',         re: /\bdefined[\s-](benefit|contribution)\b/i,   scope: 'all',
    say: 'final-salary pension / pension pot' },
  { id: 'initials',        re: /\b(UFPLS|PCLS|LSA|LSDBA|MPAA|SWR|FAD|TFC|PLSA)\b/, scope: 'all',
    say: 'the thing in words: "tax-free cash", "taking it in slices"' },
  { id: 'initials-first',  re: /\b(SIPP|GIA|CGT|IHT|CPI|RPI|NI|ETF|OCF)\b/,  scope: 'first',
    say: 'pension pot / ordinary investment account / tax on gains / prices' },
  { id: 'crystallise',     re: /\b(un)?crystalli[sz](e|ed|es|ing|ation)\b/i, scope: 'all',
    say: 'start taking' },
  { id: 'wrapper',         re: /\b(tax[\s-])?wrappers?\b/i,                 scope: 'all',
    say: 'type of account (pension, ISA or ordinary account)' },
  { id: 'sequence-risk',   re: /\bsequenc(e|ing)([\s-]of[\s-]returns?)?([\s-]risk)?\b/i, scope: 'all',
    say: 'a bad run of markets early on' },
  { id: 'commutation',     re: /\bcommut(e|ed|ation)\b/i,                   scope: 'all',
    say: 'swapping pension for a lump sum' },
  { id: 'percentile',      re: /\b(percentiles?|quantiles?|deciles?|p(5|10|25|50|75|90|95))\b/i, scope: 'all',
    say: 'the worst 1 in 10 / middling / the best 1 in 10' },
  { id: 'median',          re: /\b(median|mean|average case|expected case|base case)\b/i, scope: 'all',
    say: 'middling' },
  { id: 'worst-case',      re: /\bworst[\s-]case\b/i,                       scope: 'all',
    say: 'a bad case (the worst 1 in 10)' },
  { id: 'success-rate',    re: /\b(success|failure|survival|ruin)\b[\s-]?(rate|probability|chance)?/i, scope: 'result',
    say: '"lasted in N futures out of 10"' },
  { id: 'percent-chance',  re: /\d\s?%\s+(chance|probability|likelihood|of (the )?(futures|simulations|runs|cases|time))/i,
    scope: 'first', say: '"in N futures out of 10"' },
  { id: 'simulations',     re: /\b(monte[\s-]?carlo|simulations?|sims|paths|trials|iterations|cohorts?|bootstrap\w*)\b/i,
    scope: 'all', say: 'futures ("possible futures") / "people who stopped work in 1973"' },
  { id: 'equities',        re: /\bequit(y|ies)\b/i,                         scope: 'all',
    say: 'shares', allow: [/equity release/i] },
  { id: 'fixed-income',    re: /\bfixed[\s-]income\b/i,                     scope: 'all',
    say: 'bonds' },
  { id: 'asset-class',     re: /\b(asset (allocation|class(es)?)|sub-?asset\w*|sleeves?)\b/i, scope: 'all',
    say: 'mix of shares, bonds and cash' },
  { id: 'volatility',      re: /\b(volatil(e|ity)|drawdown risk|standard deviation)\b/i, scope: 'all',
    say: 'ups and downs' },
  { id: 'real-terms',      re: /\b(in )?(real terms|real income|nominal|inflation[\s-]adjusted|today['’]s money)\b/i, scope: 'all',
    say: "at today's prices / going up with prices" },
  { id: 'net-gross',       re: /\b(net|gross)\b/i,                          scope: 'all',
    say: 'after tax / before tax' },
  { id: 'longevity',       re: /\b(longevity|mortality|life expectancy)\b/i, scope: 'all',
    say: 'how long you might live' },
  { id: 'rebalance',       re: /\b(re-?balanc(e|es|ed|ing)|glide[\s-]?paths?)\b/i, scope: 'first',
    say: 'moving gradually from shares to bonds' },

  // ---- allowed only with its explanation on the same screen ---------------------------------
  { id: 'bad-case',        kind: 'explain', re: /\bbad case\b/i,            scope: 'all',
    needs: /the worst 1 in 10/ },
  { id: 'good-case',       kind: 'explain', re: /\bgood case\b/i,           scope: 'all',
    needs: /the best 1 in 10/ },
  { id: 'annuity',         kind: 'explain', re: /\bannuit(y|ies)\b/i,       scope: 'first',
    needs: /guaranteed income for life/i },
  { id: 'gilt',            kind: 'explain', re: /\bgilts?\b/i,              scope: 'first',
    needs: /UK government bonds?/i },
  { id: 'index-linked',    kind: 'explain', re: /\bindex[\s-]linked\b/i,    scope: 'first',
    needs: /(go(es|ing)? up|rise(s)?) with prices/i },
  { id: 'ladder',          kind: 'explain', re: /\bladder\b/i,              scope: 'first',
    needs: /bonds? that pay out one year after another/i },
  { id: 'drawdown',        kind: 'explain', re: /\bdrawdown\b/,             scope: 'front',
    needs: /taking money from your pension/i },          // lower case only: "Drawdown Planner" is a name

  // ---- advice boundary ----------------------------------------------------------------------
  { id: 'recommend',       re: /\b(recommend(s|ed|ing|ation|ations)?|advis(e|es|ed|ing)|our advice|we suggest)\b/i, scope: 'all',
    say: '"what the plan says" / "one option is"',
    allow: [/not financial advice/i, /financial advis[eo]r/i] },
  { id: 'you-should',      re: /\byou (should|ought to|had better|must)\b/i, scope: 'planner',
    say: '"you could"' },
  { id: 'best-for-you',    re: /\b(best|right|ideal|optimal|optimum) (option|choice|strategy|way|answer|plan)( for you)?\b/i, scope: 'all',
    say: 'describe what each does; do not rank for the person' },
  { id: 'safe',            re: /\b(safe(ly)?|safest|guaranteed?|certain(ly)?|risk[\s-]free|secure)\b/i, scope: 'result',
    say: '"lasted in 9 futures out of 10"',
    allow: [/guaranteed income for life/i] },
  { id: 'certainty',       re: /\b(will|won['’]t|will not|is going to) (last|run out|pay|be enough|grow|fall|rise)\b/i, scope: 'result',
    say: '"could", "would", "lasted"' },

  // ---- money and number shape ---------------------------------------------------------------
  { id: 'money-short',     re: /£\s?[\d,.]+\s?(k|m|bn|mn|K|M)\b/,           scope: 'all',
    say: 'the figure in full: £250,000', allow: ['chart axis labels only'] },
  { id: 'per',             re: /(\bper (month|year|annum|week)\b|\b(pm|pcm|pa|p\.a\.|p\/m|p\/a)\b|\/(mo|month|yr|year)\b)/i, scope: 'all',
    say: '"a month" / "a year"' },
  { id: 'pence',           re: /£[\d,]+\.\d{2}\b/,                          scope: 'planner',
    say: 'whole pounds (pence only in records)' },
  { id: 'odd-decimals',    re: /(£[\d,]+\.\d\b|£[\d,]+\.\d{3,}|\d\.\d{3,})/, scope: 'all',
    say: 'round it (3.5)' },
  { id: 'minus-zero',      re: /[-−]\s?£\s?0(\.00)?\b(?![\d,.])/,            scope: 'all',
    say: '£0' },
  { id: 'minus-inside',    re: /£\s?[-−]/,                                  scope: 'all',
    say: '−£250 (the minus before the pound sign)' },
  { id: 'range-dash',      re: /£[\d,]+\s?[-–—]\s?£?[\d,]+/,                scope: 'all',
    say: '"£1,050 to £1,650"' },
  { id: 'double-about',    re: /\babout\b[^.]*\b(about|around|roughly|approximately|circa|c\.)\b/i, scope: 'all',
    say: 'one "about" a sentence' },
  { id: 'approx',          re: /(\b(approx\w*|circa|roughly|around £|c\.\s?£)|~\s?£)/i, scope: 'all',
    say: '"about"' },
  { id: 'about-record',    re: /\b(about|around|roughly) £/i,               scope: 'record',
    say: 'the exact figure — records are not estimates' },

  // ---- broken output ------------------------------------------------------------------------
  { id: 'junk',            re: /(undefined|\bNaN\b|\bnull\b|\[object|Infinity|\{[a-zA-Z_.]+\}|\$\{)/, scope: 'all',
    say: 'a bug — fix the code, not the words' },
  { id: 'one-plural',      re: /\b1 (months|years|futures|pots|gilts|plans|steps|days|weeks|people)\b/, scope: 'all',
    say: '1 month, 1 year …' },
  { id: 'empty-money',     re: /£(?!\s*[\d\[−-])/,                          scope: 'all',
    say: 'a bug — a pound sign with no figure' },
];
```

Notes for whoever builds the check:

1. `scope` is decided by tags on each string (stage and question) for the strings file, and by the state
   the screen was drawn from for rendered screens. A string with no tags is checked as `all` and `first`.
2. An `explain` entry passes when `needs` matches anywhere in the same rendered screen (or, for the
   strings file, in a string with the same screen tag).
3. A failure message names the `id`, the text found, where, and `say`.
4. `allow` is tested against the sentence containing the match. `double-about` is tested one sentence (or
   one separate line of a headline band) at a time, never across them.
5. `empty-money` lets through `£ [` because the drawings and forms put a box after the sign.
6. The list needs the owner's sign-off once; after that a change to it is a change like any other and goes
   in a release note if it alters what users read.
7. Entries `hold-in-planner`, `safe`, `success-rate` and `tool-names` are deliberately wide and will catch
   honest sentences at first. That is intended: each hit is either rewritten or added to `allow` with a
   reason.

**Two checks that are not word lists**

| Check | Rule |
|---|---|
| Every headline has a sentence and a bad-case line | each `data-headline` on a `result` screen has a `data-sentence` with the same key and, on the same screen, text matching "the worst 1 in 10" |
| Every answer carries the advice line | every screen with a `data-headline` contains `ADVICE_SHORT` exactly; every `answer` step also contains `ADVICE_FULL` exactly |

### 3.3 Sentence templates for headline numbers

Every headline is three pieces, always in this order, all produced by the answer function from the same
result so they cannot disagree:

1. **The band** — the figure and what it is.
2. **The sentence** — the same figure in a sentence a person could read aloud, with what went in.
3. **The bad-case line** — what the worst 1 in 10 looks like.

`{…}` are filled from the result. `[…]` is included only when it applies.

**Question C**

| Id | Template |
|---|---|
| `C.head` | About £{careful} a month from your pot |
| `C.head.couple` | About £{careful} a month from your two pots |
| `C.head.sub` | after tax, from {now / age N} until you are {lastsTo}, going up each year with prices |
| `C.head.total` | About £{total} a month in all once your State Pension starts at {spAge} |
| `C.head.total.fs` | About £{total} a month in all once your final-salary pension starts at {fsAge}[ and your State Pension at {spAge}] |
| `C.sentence` | A pot of £{pot} could pay you about £{careful} a month after tax, from {now / age N} until you are {lastsTo}, going up each year with prices. That amount lasted in 9 futures out of 10. |
| `C.sentence.couple` | Pots of £{pot1} and £{pot2} could pay the two of you about £{careful} a month after tax, from {now / when} until the younger of you is {lastsTo}, going up each year with prices. That amount lasted in 9 futures out of 10. |
| `C.bad` | In a bad case (the worst 1 in 10), £{careful} a month only just lasts to {lastsTo}. If you took £{middling} a month instead, a bad case would run out at age {badRunOutAge}. |
| `C.take` (after "Take £x a month") | Taking £{x} a month, the pot lasted to {lastsTo} in {n} futures out of 10. In a bad case (the worst 1 in 10) it would run out at age {badRunOutAge}. |
| `C.take.fine` | Taking £{x} a month, the pot lasted to {lastsTo} in every future we tried, including the bad cases (the worst 1 in 10). |
| `C.change` | Before: about £{before} a month. Now: about £{now} a month. |
| `C.range` | You could take: careful £{careful}, middling £{middling}, good £{good} a month. |
| `C.small` | A pot of £{pot} is small to spread over {years} years. Many people with a pot this size take it as one or a few lump sums instead. |
| `C.none` | With these figures there is no monthly amount that lasts to {lastsTo}. Try a later start age or a shorter time. |

**The other questions — one headline each, to fix the pattern** (final wording belongs to each question's
answer contract)

| Id | Band | Sentence | Bad-case line |
|---|---|---|---|
| `A.yes` | Yes — you could stop at {age} | Stopping at {age} and spending £{spend} a month, your money lasted to {lastsTo} in {n} futures out of 10. | In a bad case (the worst 1 in 10) it would run out at age {badRunOutAge}. |
| `A.close` | Close — stopping at {age} is tight | Stopping at {age} and spending £{spend} a month, your money lasted to {lastsTo} in {n} futures out of 10. | In a bad case (the worst 1 in 10) it would run out at age {badRunOutAge}. Stopping at {age2} instead moves that to {badRunOutAge2}. |
| `A.no` | Not at {age} on these figures | Stopping at {age} and spending £{spend} a month, your money lasted to {lastsTo} in only {n} futures out of 10. | In a bad case (the worst 1 in 10) it would run out at age {badRunOutAge}. The earliest age that lasted in 9 out of 10 is {earliest}. |
| `B.target` | About £{target} by age {age} | To spend £{spend} a month from {age}, you would want a pot of about £{target} by then. | In a bad case (the worst 1 in 10), saving as you are now gets you to about £{badPot}: £{gap} short. |
| `B.payin` | About £{payIn} a month into your pension | Paying in about £{payIn} a month[, including £{employer} from your employer,] reached £{target} by {age} in 9 futures out of 10. | In a bad case (the worst 1 in 10) the same saving reaches about £{badPot}. |
| `D.lasts` | At £{spend} a month it lasts to about {middlingAge} | Spending £{spend} a month as you do now, your money lasted to {lastsTo} in {n} futures out of 10. | In a bad case (the worst 1 in 10) it would run out at age {badRunOutAge}. |
| `D.more` | You could spend about £{extra} a month more | About £{careful} a month lasted to {lastsTo} in 9 futures out of 10. You spend £{spend} now. | In a bad case (the worst 1 in 10), £{careful} a month only just lasts to {lastsTo}. |
| `D.less` | £{spend} a month is about £{cut} more than lasted | About £{careful} a month lasted to {lastsTo} in 9 futures out of 10. You spend £{spend} now. | In a bad case (the worst 1 in 10), £{spend} a month would run out at age {badRunOutAge}. |
| `E.test` | It came through {n} of the {total} starting years since 1871 | Started in each year since 1871, this plan paid its full income in {n} of {total}. | The hardest was starting in {year}: the money would have run out at age {age}. In a bad case (the worst 1 in 10) it runs out at age {badRunOutAge}. |

**Rules for writing a new template**

1. Say "could" or "would", and "lasted" for what the trials showed. Never "will".
2. One figure per clause. No brackets holding figures, except "(the worst 1 in 10)".
3. Address the reader as "you". In a couple: "the two of you", "the younger of you", "your partner".
4. Under 30 words a sentence. No sentence starts with a figure.
5. If a word in the template is on the `explain` list, the explanation is in the same template or the one
   beside it.
6. Templates never contain a stage word. If the stage changes the meaning, there are two templates, each
   tagged with its stage, so the check can read them.

### 3.4 How risk is said

| To say | Write | Not |
|---|---|---|
| It held up in most trials | "lasted in 9 futures out of 10" | "90% success rate", "90% probability" |
| The bad outcome | "in a bad case (the worst 1 in 10)" — the bracket is given the first time on every screen | "worst case", "P10", "pessimistic scenario" |
| The middle outcome | "in a middling case" | "median", "expected", "average" |
| The good outcome | "in a good case (the best 1 in 10)" | "optimistic", "P90" |
| What the trials are | "futures" — "we tried your numbers against many possible futures" | "simulations", "Monte Carlo", "paths" |
| Trials against the past | "started in each year since 1871" / "people who stopped work in 1973" | "historical cohorts", "backtest" |
| The risk itself | an **age**: "would run out at age 86" | a percentage on its own |
| A risk level | Cautious / Balanced / Adventurous, with the share of shares in words | "risk 4 of 7", "60/40" |

**Counting out of 10**

| The share of futures that lasted | Write |
|---|---|
| all of them | "in every future we tried" |
| 95% or more, but not all | "in more than 9 futures out of 10" |
| 85% up to 95% | "in 9 futures out of 10" |
| 15% up to 85% | the nearest whole number: "in 7 futures out of 10" |
| 5% up to 15% | "in only 1 future out of 10" |
| more than none, under 5% | "in fewer than 1 future out of 10" |
| none | "in none of the futures we tried" |

"A bad case" is fixed by the owner's decision as the worst one in ten. It is never the single worst year
in history; where that is shown (question E) it is called "the hardest starting year" and named.

"Only" is added ("in only 6 futures out of 10") when the count is below the 9 the careful figure is built
on. It is the one word of judgement allowed, and it is a statement about the count, not advice.

### 3.5 How numbers are written

| Thing | Rule | Example |
|---|---|---|
| Pounds | "£", commas every three figures, no space | £250,000 |
| A monthly amount in an answer | nearest £10 from £1,000 up; nearest £5 below; "about" in front | about £1,050 a month |
| A yearly amount in an answer | nearest £100 from £10,000 up; nearest £50 below; "about" | about £12,600 a year |
| A pot in an answer | nearest £1,000; "about" | about £312,000 |
| A figure the person typed | exactly as typed, no "about" | A pot of £250,000 |
| A record (Month by month, What you hold, the plan document, Where you are) | exact to the pound — to the penny where the record holds pennies; never "about" | Took £3,480 |
| Rounding direction | to the nearest, except that a **careful** amount is rounded **down** and a run-out age is rounded **down** to a whole year | — |
| Nought | "£0" | never "-£0", "£0.00" in an answer |
| A shortfall | the word, not a minus sign, in sentences: "£4,000 short". In tables: a true minus before the pound sign | −£4,000 |
| A range | "£1,050 to £1,650" — the word "to" | never a dash |
| Per period | "a month", "a year" | never "per month", "pm", "pa", "/mo" |
| Thousands | in full | never "£250k" (chart axes only) |
| An age | "age 86", "at 86", "until you are 95" — whole years | never "86.4", "year 28" |
| A date | "April 2027"; a day as "14 Sep 2026" | never "04/2027" |
| A tax year | "tax year 2027/28", or "2027/28" once the words have appeared on the screen | never "TY27", "year 1" |
| A share of the mix | in words where possible: "about half in shares"; otherwise a whole percentage | never "0.5", "50.0%" |
| A rate or charge | one decimal place at most, with what it is | "charges of 0.5% a year" |
| Before or after tax | every income figure says which, once per block | "after tax" |
| Today's prices | every future amount is at today's prices; said once per block as "at today's prices", and rising income as "going up each year with prices" | never "real", "nominal" |

**"About"**

- Every figure an answer works out carries "about" the first time it appears in a block. Once is enough:
  one "about" a sentence.
- A figure the person typed, a figure fixed by rule (a tax threshold, the State Pension amount), and
  anything in a record never carries "about".
- The large figure in the headline band starts with "About" — the band is where a bare number would look
  most like a promise.
- "About" is the only such word. Not "around", "roughly", "approximately", "circa" or "~".

**The figure in the sentence must equal the figure on the screen.** Both are made by one formatter from
the unrounded `data-value`; the test formats `data-value` itself and compares.

### 3.6 Small words that matter

| Write | Not |
|---|---|
| stop work | retire (as a verb for the future — "retired" as a state is fine) |
| what you spend | expenditure, outgoings, budget |
| pay in | contribute, contribution |
| take (money from the pot) | withdraw, draw down, crystallise |
| lasts / runs out | is sustainable / depletes / fails |
| shares | equities, stocks |
| prices going up | inflation (allowed from question E on) |
| after tax / before tax | net / gross |
| your partner | spouse, second person, person 2 |
| keep (a plan) | save — "save" reads as saving money in this app |
| Show … / Try … / Keep … on buttons | Run, Calculate, Submit, Simulate |
| Sorry, we could not work that out | Error, Failed, Invalid |

### 3.7 The advice line

Two fixed strings. They are written once, in one file, and the check looks for them letter for letter.

**`ADVICE_SHORT`** — directly under the bad-case line of every headline, and in the front-door footer:

> An illustration from your figures, not financial advice.

**`ADVICE_FULL`** — the closing paragraph of every answer step, and of every printed or downloaded page:

> This is an illustration worked out from the figures you entered. It is not financial advice and it does
> not tell you what to do. Pension Wise, from MoneyHelper, gives free guidance to anyone aged 50 or over.

Rules:

1. Every screen that shows a headline shows `ADVICE_SHORT`. Every `answer` step and every printed page also
   shows `ADVICE_FULL`. Neither can be closed, collapsed or dismissed.
2. Neither is shown smaller than the hint text used elsewhere on the screen, and both meet the same
   contrast rule as body text.
3. The strings contain "not financial advice", which the existing print check already looks for.
4. The app describes and compares; it does not rank choices for the person. The `recommend`, `you-should`,
   `best-for-you`, `safe` and `certainty` entries in 3.2 are how that is enforced. In Month by month the
   wording is "what your plan says to do this month", never a recommendation.
5. "PensionTools is run by Usefulish Ltd" and the link to the privacy policy stay in the footer of every
   screen, as now.

---

## Open questions for the owner

1. **Which figure is the headline?** This document makes it the **careful** amount — the one that lasted
   in 9 futures out of 10 — with the middling and good amounts shown beneath, and the bad-case line saying
   what happens if you take the middling amount instead. That matches the standing preference for "slightly
   pessimistic". The alternative is to headline the middling amount, which is larger and runs out in half
   the futures. The answer contract for C must use the same choice.
2. **What do A, B, D, E and F do on the front door during the first slice?** Proposed: they are shown,
   each marked "Opens the current version", and open the matching screen of today's app. The alternative
   is to show only C until the others exist. The switch is only on for the owner at this stage, so either
   is safe.
3. **Is step 3 of C ("What are the ways to take it?": drawdown, annuity, cashing in) part of the first
   slice?** It is on the rail here, but its screen is not drawn and it needs an annuity rate from
   somewhere (typed by the user, or one we maintain). Proposed: leave it out of the first slice and show
   the step as "Coming soon" only in the switched-on preview.
4. **Age, or month and year of birth?** "Your age" is quicker, but State Pension age depends on the date
   of birth, and for people born near a change it moves the answer by a year. Proposed: ask age; if the
   age given is within a year of a change in State Pension age, ask for month and year of birth on the
   spot.
5. **"Lock" stays.** This document keeps "Lock the plan" / "locked" because the owner and existing users
   know it. Say if a plainer word is wanted ("fix", "set").
6. **A strategy is called "Bridge & engine"**, and "bridge" is banned. The list lets that exact name
   through for now. Rename the strategy at cutover, or keep the exception?
7. **"Recommend" is banned everywhere**, including Month by month, where today's app speaks of a
   recommendation. Proposed wording: "what your plan says to do this month". Confirm.
8. **The words "scenario", "simulation", "inflation" and "safe"** are banned or restricted here. These are
   the four most likely to feel heavy-handed in use; each can be relaxed to first-answer screens only.
9. **The letters A–F on the front door**: keep them as small labels, or drop them?
10. **Does a first answer count against the three hours allowed without an account?** Not settled in the
    plan of plans; it changes the words on the `keep` step.
11. **The Pension Wise sentence** in the full advice line names an outside service. Confirm it should be
    there, and that the wording is acceptable to Usefulish Ltd.

## What this document needs from the other sub-plans

| From | Needed |
|---|---|
| Answer contract for C | The result's field names (`monthly.careful`, `monthly.middling`, `monthly.good`, `badRunOutAge`, `lastsTo`, `parts[]`, `assumptions[]`), whether the pot pays a level amount or more before the State Pension starts, and the settled answer to open question 1 |
| Household and guaranteed income | The five partner fields and the final-salary start age as declared inputs; how question C's few figures place a person in a life stage |
| Shell architecture (A or B) | How step ids appear in addresses; where the strings, templates and banned list live |
| Test strategy | The wording check run on every commit against the strings file and on every rendered screen in the browser walks |
| Cutover | When the banned list starts to apply to the screens carried over from today's app (the plan document, Month by month, Moving to your plan's mix), which still use the old names |
