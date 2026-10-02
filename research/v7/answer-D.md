# Question D: "I've stopped work. Will it last, could I spend more, would some work help?" (design, 2 Oct 2026)

Status: design only. Nothing is built and no product code was changed. Written against 6.20.0.

**How it was made.** It started from a map of the code, two competing designs (a third was missing and one was cut off)
and a critique of both. Every claim below was then checked against the code. Figures marked *measured* come from
scratch runs of the built code, kept outside the repository:

- 1,000 futures, seed 0, today 2 October 2026;
- Balanced, the 0.5% charge, to age 95.

Every household in this document is made up, and paths are relative to the repo.

**What it builds on.** D is step 6 of `research/v7-plan-of-plans.md`. It uses the one joint test of A, B and C:

- a life runs from today;
- careful = lasted in 9 futures out of 10;
- a bad case = the worst 1 in 10;
- charges are per plan, 0.5% a year by default;
- a couple may stop in different years.

**Documents it follows:**

- `answer-C-and-household.md` (HH);
- `answer-A-and-B.md` (AB);
- `saving-years-engine.md`;
- `couples-different-years.md`;
- `budget-step.md`;
- `save-as-plan.md`;
- `rail-screens-language.md` (the rail, the words and the banned list).

---

## Why people come

These are the people this question serves:

- They are retired and drawing money. Some stopped 18 months ago, some ten years ago.
- Some have a locked plan in today's planner, with months recorded. Others are starting over.
- Some are thinking about going back to work.
- Some are couples where one has stopped and the other still works.

They ask three things, in their own words:

1. "Will it last at what I spend?"
2. "Could I spend more?" (or "how much less?")
3. "Would some work help?"

**What a retired person has that a saver does not is a past.** Most have already had their tax-free cash. Some have
bought an annuity or built a gilt ladder. Many get their State Pension already. Some have a locked plan with months
recorded.

**What today's planner does, and what it cannot do.** It follows a locked plan well: the month-by-month record, the plan
document, the "Where you are" strip, the ladder's monthly instruction and the rotation status. What it cannot do is
test the plan again from today's pots at today's age. Its "Try a strategy" panel changes the pot, the ISA, the income
and the years on a copy, but keeps the plan's start age and timing (`index.html` 6413-6460).

D adds that test, and it never touches the plan.

---

## 1. The idea

- **D is C's "from now" turned round.** C starts from a pot and gives a monthly figure. D starts from what the person
  spends. It says whether that lasted, how much more or less lasted, and what some work, or a fall in shares, would do.
- **D is A's "stop now" row.** The route is the one A already uses:
  - `stopAtPlan(household, ageToday, env)` sets up the run;
  - `verdictAt` gives the answer at the spend;
  - `bandAt` gives the careful, middling and good amounts (`src/answers/shared/stopAt.js`).

  At a stop of today's age this gives C's band on C's futures, to the bit (the stopAt.js header).
- **This was measured.** One person, 68, with £300,000 in a pension, £40,000 of savings and the full State Pension
  being paid:

  | Check | C from now | A stopping at 68 |
  |---|---|---|
  | Careful / middling / good | £1,960 / £2,290 / £2,680 | £1,960 / £2,290 / £2,680 |
  | At £1,900 a month | lasted 94.3%, bad case 95 | lasted 94.3%, bad case 95 (Yes) |
  | At £2,100 a month | lasted 75.8%, bad case 90 | lasted 75.8%, bad case 90 (Close) |

  Each answer took 0.2 to 0.6 seconds on the development Mac.
- **What D needs is new inputs, not a new engine:**
  - the spend;
  - income already bought (an annuity, or a ladder's bonds still to pay out);
  - the tax-free part, answered;
  - work from today;
  - spending less (or more) from a later age.
- **A locked plan is read and never written.** Its latest figures fill D's boxes, with their dates. The spend box
  is never filled for the person.
- **The words follow the `retired` scope of the banned list:** no countdown, no "when you retire", no "years to go". Ages
  are given for the future, and dates for things already arranged ("your ladder pays from April 2029").

---

## 2. Three things that ship first, each in its own release

D does not depend on them to work. Each one, though, either fixes money that is wrong today or stops D from showing a
wrong answer to the people it serves.

### 2.1 "Where you are" compares like with like (today's planner, a patch)

This is a live wrong statement, found while reading for D. The strip compares two different things:

- **The pot.** It takes the pension pot alone: the latest record's equity, bond and cash (`whereAmI`,
  `src/services/PlanDocument.js`).
- **The band.** It compares that pot with the plan's band of all pots, pension and ISA together (`stressTest.js:217`:
  `potByYear + isaByYear`).

So someone with an ISA can be told in bold "below the plan's 1-in-10 bad line" when they are not
(`src/ui/components/PlanDocumentView.js:199`).

**The fix:**

- Add the ISA (from What you hold, or the plan document) to the pot before the comparison.
- If no ISA figure exists, compare nothing, and say "Add your ISA under What you hold to compare".
- For a ladder plan the band is "growth part + unpaid rungs" (`stressTest.js:319`). There the pot must be the same
  thing.

**Test:** a made-up plan with an ISA, where the pension alone is below the 1-in-10 line and pension plus ISA is above it,
must not show "below".

### 2.2 How ISAs and savings grow (every question; the owner's question 1)

**Today.** Every question grows savings at a fixed 3% a year, whatever prices do:

- `ISA_DEFAULTS.RETURN`, `src/constants.js:38`;
- read at `fastEngine.js:361` and `SimulationEngine.js:444`.

Cash inside the pension earns last year's price rise less 1% (`fastEngine.js` `cashNominalReturn`). So savings are
treated neither as cash nor as investments:

- in a future where prices rise 1% a year, savings beat the pension's cash;
- in one where prices rise 8% a year (where bad cases live), savings lose about 5% a year of buying power.

**Measured.** One person, 68, £100,000 pension, £250,000 savings, spending £2,100 a month:

| Savings grow at | Verdict | Lasted | Bad case | Careful |
|---|---|---|---|---|
| 0% a year | No | 8.7% | 85 | £1,630 |
| 3% a year (today) | No | 60.9% | 89 | £1,890 |
| 5% a year | Yes | 91.1% | 95 | £2,110 |

Retired people often hold large ISAs, so this one figure can decide their answer.

**The recommended change:** one tap under the savings box, for C, A, B and D alike.

- "Mostly cash" (the default): savings follow the engine's own cash rule, last year's price rise less 1%, never below
  0. This is the planner's cash model.
- "Invested like my pension": savings take the plan's mix on the same futures. That means:
  - shares from the life's share return;
  - bonds from the life's own bond stream;
  - cash by the cash rule.
  - **No new random draws.** `SimulationEngine`'s existing `isaMix` path does draw new random numbers for its bonds
    (`SimulationEngine.js:430-442`), and the fast path refuses it (`fastEligible`). So this is a new, simpler option
    (`isaGrowth: 'cash' | 'mix'`), not `isaMix`.

**How it is built:**

- The option is absent by default, so today's planner and every locked plan run exactly as before. That is the pattern
  6.19.0 used for charges.
- It is accepted by `fastEligible` and held to `simulate` by `speed.identity`.
- C's, A's and B's figures move on purpose. The release note says by how much, measured on the fixtures.

If the owner keeps the fixed 3%, D shows the warning `d-savings-cash` (6.4).

### 2.3 Incomes that stay the same, exact in each future (engine)

**Today.** The adapter tells the engine that every guaranteed income rises with prices (`ind = () => 'cpi'`,
`toEngine.js:282`). An annuity or a gilt ladder that pays the same number of pounds each year would then be counted as
if it rose with prices, in every future. That is optimistic every time, not just in rare high-inflation futures.

**What exists already:**

- `simulate` already handles an income that stays the same (`indexation: 'level'`, `SimulationEngine.js:896, 908`).
- The fast path refuses it (`fastEligible`: `cpi` only).

**The change:**

- The fast path learns `'level'` for `extraIncomes`. It is held to `simulate` by an identity test.
- The engine then makes up the lost buying power from the pots, in each future, by that future's own prices.

**Why this is right here.** The final-salary ruling ("the pot pays only its own share") was about a cap that bites only
in futures with high inflation. A level income loses buying power in every future, and someone spending a level amount
really does have to make it up.

**Ships with 2.2.** This removes any fixed "3% a year" guess from D.

**If it slips:** the adapter counts a level income at its buying power falling 4% a year (the planner's own figure,
`PLAN_OF_RECORD_CPI`, which is on the cautious side), and says so.

---

## 3. What the person sees

### 3.1 The rail

| # | Step id | Label | Short | Optional | Short result when done |
|---|---|---|---|---|---|
| 1 | `numbers` | What have you got? | Your numbers | no | "£300,000 and £40,000" |
| 2 | `spend` | What do you spend? | What you spend | no (one figure is enough) | "£2,100 a month, your own figure" |
| 3 | `answer` | Will it last? | Will it last | no | "Close: lasted in only 8 futures out of 10" |
| 4 | `spend-more` | Could I spend more? | Spend more? | no | "about £140 a month less lasted" |
| 5 | `work` | Would some work help? | Some work | yes | "until 73: lasted in 9 futures out of 10" |
| 6 | `fall` | What if shares fell? | A fall | yes | "lasted in only 6 futures out of 10 after a fall" |
| 7 | `keep` | Keep this as a plan? | Keep | yes | "Kept 2 Oct 2026" |

**Changes from `rail-screens-language.md`'s first sketch of D:**

- **"What you spend" becomes its own step**, as in A (the budget step).
- **The `lock` step becomes `keep`.** Locking lives in today's planner until 7.0.
- **Step 6 depends on the owner's question 4.**

**On a locked plan:**

- every step up to `fall` is try-only;
- `keep` reads "Keep this as a separate plan" (R6).

### 3.2 Your numbers

```text
What have you got?

Is this for you, or for two of you?        ( ) Just me   ( ) The two of us
How old are you?                           [ 68 ]
What's left in your pension pots today?    £[ 300,000 ]
   Leave out an annuity, and the bonds in a gilt ladder: add those under
   "Income you've bought".
ISAs and other savings                     £[ 40,000 ]
   Are these mostly cash, or invested?     ( ) Mostly cash  ( ) Invested like my pension
Have you already had the tax-free part of your pension?
   ( ) Yes   ( ) No, not yet   ( ) Some of it
   If it has all gone, everything you take out is taxed. If not, a quarter of
   each amount you take out is tax-free.
What State Pension are you paid?           ( ) The full one  ( ) An amount  ( ) None
A final-salary pension?                    ( ) No  ( ) Yes
Income you've bought                       [ Add an annuity or a gilt ladder ]
   An annuity is a guaranteed income for life. A gilt ladder is UK government
   bonds that pay out one year after another.

[ More detail: your mix of shares, bonds and cash · charges · until what age ]
                                                        [ Next: what you spend ]
```

**How each box behaves:**

- **"What State Pension are you paid?"** is C's wording for someone past State Pension age (`spPaidToday`). Under that
  age the label is "Your State Pension" and the help line gives the age it starts ("from 67").
- **The savings question** shows only when savings are more than £0. It belongs to section 2.2.
- **The tax-free question has no default and must be answered.** It is one tap, not a typed figure. Having no default
  keeps D in step with C and A on the same household: C assumes "not taken" when the question is left unanswered, and
  for £300,000 the two assumptions differ by £50 a month (*measured*: careful £1,960 not taken, £1,910 taken).
- **"Income you've bought" opens rows:**

  ```text
  Income you've bought
  £[ 6,000 ] a year before tax
  From   ( ) now  ( ) age [  ]
  Until  ( ) for life  ( ) age [  ]
  Goes up with prices?  ( ) Yes  ( ) No
  [ Add another ]
  ```

  - "Add another" adds a row, up to six rows.
  - A plan reading can fill all six (9.3).
- **The partner block** is C's person block plus:
  - "Has your partner stopped work?" with "Yes" or "Not yet, at age [ ]". Not answered means "Yes".
  - The pay line once they are still working (6.20.0).
  - Their tax-free question once they have stopped.
  - Their own "Income you've bought".
- **Inputs a person types:** age, pot and (on the next step) the spend, plus savings if they have any. That is at most
  four typed figures for one person, and five for a couple (the partner's age is added).

**A note under the heading.** A visitor who is still working sees one line there: "This question is for people who
have stopped work. Still working? [When can I afford to stop?]".

### 3.3 What you spend (the budget step, `budget-step.md`)

```text
What do you spend?
( ) Work it out line by line   (A's built words, copy/budget.js: never "recommended")
( ) Just put in one figure
[ £2,100 a month, after tax, at today's prices ]

Do you expect to spend a different amount later?     ( ) No  ( ) Yes
   From age [ 80 ], £[ 1,600 ] a month
```

**The figure in the box:**

- It is always the person's own.
- The budget's total is shown beside it with "[Use £X]".
- The national guide levels sit beside it as a second guide.
- When the box is left as one figure, the skip note shows once.

**The later amount:**

- It belongs to the owner's question 2.
- It may be lower (less travel) or higher (care).

**On a locked plan:**

- The box stays empty.
- One line offers "[Use £X]" with what the record shows: "You took £2,680 a month after tax, on average, over your last
  9 recorded months."

### 3.4 The answer

```text
Close — £2,100 a month is tight
after tax, going up with prices, until you are 95

Spending £2,100 a month after tax, your money lasted until you are 95 in only
8 futures out of 10.
In a bad case (the worst 1 in 10) it would run out at age 90. After that you
would have about £1,050 a month from your State Pension.

About £1,960 a month lasted in 9 futures out of 10. That is about £140 a month
less than you spend now.

What it is made of                       Your State Pension      £1,046 a month
                                         From your pension and
                                         savings                 £1,054 a month
What we assumed                          (list, 6.3)            [Change]

Try a change    [ −£100 ]  [ +£100 ]      (C's "Before / Now" line after a change)
What next?      Would some work help? · What if shares fell? · Keep this as a plan
```

**The headline is a verdict** (Yes, Close, or "Not at"), built from A's counts (`verdictOf`, `rules.js`). D therefore
agrees with A's "stop now" row word for word.

- It replaces the rail sketch's `D.lasts`, which led with a middling age.
- A middling age is an even chance, so using it broke "careful = 9 out of 10".

**The "about £1,960" line always agrees with the verdict.** The engine is not exact at the £10 step
(`tests/v7/c/exceptions.md`), so the line follows these rules:

| Verdict | Careful vs spend | Kind | Line |
|---|---|---|---|
| yes | careful − spend ≥ £20 | `more` | "You could spend about £{x} a month more." |
| yes | otherwise | `about` | "What you spend is about what lasted…" |
| close or no | spend − careful ≥ £20 | `less` | "That is about £{x} a month less than you spend now." |
| close or no | otherwise | `about` | "What you spend is about what lasted…" |

The difference is rounded to the nearest £10, so "Yes" never sits beside "less lasted".

### 3.5 Could I spend more?

This step gives the band in full, with the pieces of the answer that matter for the yes case.

| Line | Words |
|---|---|
| Yes, more | You could spend about £60 a month more. About £1,960 a month lasted in 9 futures out of 10. |
| Middling | About £2,290 a month lasted in 5 futures out of 10. In a bad case (the worst 1 in 10) it would run out at age 86. |
| With a later amount | About £1,960 a month now and £1,490 from 80 lasted in 9 futures out of 10. |

The later amount moves in proportion to the first (5.3).

### 3.6 Would some work help?

```text
Would some work help?
Pay a year, before tax     £[ 12,000 ]
For how many years         [ 3 ]
```

*Measured* for the same person spending £2,100, on £12,000 a year:

| Work until | Lasted | Bad case | Careful with that work |
|---|---|---|---|
| (none) | 75.8% | 90 | £1,960 |
| 69 | 80.1% | 91 | £1,990 |
| 70 | 84.3% | 92 | £2,010 |
| 71 | 86.2% | 93 | £2,050 |
| 72 | 88.4% | 94 | £2,080 |
| 73 | 90.8% (Yes) | 95 | £2,110 |

**The words:**

> Working until you are 71 on £12,000 a year before tax, £2,100 a month lasted in just under 9 futures out of 10,
> against only 8 without it. In a bad case (the worst 1 in 10) it would run out at age 93 instead of 90.
>
> With that work, about £2,050 a month lasted in 9 futures out of 10.

The rows for 1 to 5 years follow as a small table: "Until 73: lasted in 9 futures out of 10; in a bad case it still
lasted to 95."

**When the answer is already Yes:**

> £1,900 a month already lasted in 9 futures out of 10. That work would let you spend about £{x} a month more.

**A note that always shows:**

> Once you have taken money from a pension that is taxed, the most you can pay into pensions and still get tax back is
> £10,000 a year.

### 3.7 What if shares fell? (the owner's question 4)

**The rule.** Shares fall by a fifth tomorrow, you keep the same mix, and the futures then run as usual. That is exactly
a smaller pot: the pension × (1 − 0.2 × the share held in shares).

- Balanced holds half in shares, so it goes to × 0.90.
- Savings held "invested like my pension" (2.2) take the same rule. Cash does not.
- The State Pension, final-salary pensions and income you've bought do not change.

*Measured:* careful £1,960 → £1,870; £2,100 a month lasted 75.8% → 61%; bad case 90 → 88.

> If shares fell by a fifth tomorrow and you kept the same mix, £2,100 a month lasted in only 6 futures out of 10. In a
> bad case (the worst 1 in 10) it would run out at age 88.
>
> After such a fall, about £1,870 a month lasted in 9 futures out of 10: £90 a month less than now.
>
> Your State Pension would not change.

The last line grows to name each income that applies: "Your State Pension[, your final-salary pension][ and the income
you've bought] would not change."

**On a locked rotation plan,** one more line comes from `rotationStatus(doc)`, in D's words. D does not model the
rotation (E will):

- **Armed:** "Your plan would sell the later bonds and buy shares if shares fell a third from their highest while you are
  {disarmAge} or younger."
- **Fired:** "Your plan sold the later bonds on {date}."
- **Disarmed:** "Your plan now holds its bonds to the end, whatever shares do."

### 3.8 Keep

**No locked plan:**

> **Keep this as a plan**
> Name `[ From 68 · £2,100 a month ]`  [Keep as a plan]

The person names the plan; it is never "My plan" (`save-as-plan.md`).

**After keeping:**

> Kept as "From 68 · £2,100 a month". Next: lock it in the planner to follow it month by month.

**With a locked plan:**

> **Keep this as a separate plan**
> Name `[ From 68 · £2,100 a month (from today) ]`  [Keep as a separate plan]
> Your locked plan stays the one you follow month by month.

**After keeping:**

> Kept as "From 68 · £2,100 a month (from today)". Your locked plan is still the one you follow.

There is no "lock it" sentence on this path (section 10 explains why).

### 3.9 On a locked plan

**The heading of the rail** (R6):

> Your plan is locked. Anything you try here is not saved to it.

**A source note beside each box filled from the plan:**

- "From your record, 30 Sep 2026";
- "From What you hold, 14 Sep 2026";
- "From your plan when it was locked, raised to today's prices".

**A figure older than three months** reads "Check this figure: it is from 12 Mar 2026."

**Under the headline, one comparison line** (the owner's question 3):

> Your locked plan says £2,900 a month after tax for this tax year. From today's figures, about £2,640 a month lasted in
> 9 futures out of 10.

When the plan's way of taking money differs, one more line follows, then a link to test it:

- "Your plan cuts its spending in bad years; this answer keeps the same amount every month, so the two can differ."
- "Your plan pays from a ladder (UK government bonds that pay out one year after another). This answer counts the bonds
  still to pay out as income and tests the rest."
- [Test the plan its own way] opens today's planner. Until E exists, it goes to the planner's strategy test.

**Never shown:** a suggestion to unlock, or any word that the plan is "wrong".

### 3.10 Next sentences, routes in, and the hidden step

**Next sentences** (first match wins):

| Id | Sentence |
|---|---|
| `D.locked` | Your plan is locked, so nothing you try here changes it. Next: {the plan rail's next}. |
| `D.failed` / `D.working` / `D.fix` | C's |
| `D.blank` | Next: your pension, your age and what you spend are enough. |
| `D.spend` | Next: what you spend. |
| `D.ready` | Next: press "Will it last?". |
| `D.yes` | Next: see how much more you could spend. |
| `D.close` / `D.no` | Next: see what spending less, or some work, would do. |
| `D.kept` | 3.8's words |

**Routes in**, once D joins `OPEN` (`src/v7/rail/questions.js`):

- **A's and B's retired view.** `Retired.jsx` changes `href.soon('d')` to `href.step('d', 'numbers')`. It carries the
  household and the spend.
- **C's `C.kept.retired`**, and C's "What next?" for someone taking money from now. It carries the household, never C's
  amount as a spend.
- **A's and B's error for one person** who says "I've already stopped" (`already-needs-partner`). Today it points to C;
  it now says "Will it last?" and points to D.
- **The rail for `draft-retired`** (opens on D), `bridge` and `running` (try-only).
- **The front door's D line** (`copy/common.js`), with `more`: "Test what you spend against what you have today."

**The hidden step.** For a plan whose stage says the person is still working, the rail's own sentence stays:
"This question is for people who have stopped work. Your plan says you stop in {June 2030}."

---

## 4. Inputs

### 4.1 The form (`src/answers/d/schema.js`, SCHEMA_D)

Built from the shared parts, so paths, limits and boundaries are C's and A's. The words live in `src/v7/copy/d.js`,
keyed by path.

| Path | Type, default | Notes |
|---|---|---|
| `household` | single \| couple, single | C's |
| `you.pot`, `you.age` | C's `personFields('you')` | required |
| `you.statePension.*`, `you.finalSalary.*` | C's | the final-salary pension keeps C's rule (prices, up to 5%) |
| `savings` | money, 0 | on the short form (C keeps it under More detail): a retired person's second pot |
| `savingsHeld` | cash \| invested, cash; `whenNot: { savings: 0 }` | from 2.2, shared by every question (`schemaParts.js`) |
| `you.taxFreeTaken` | yes \| no \| some, **required, no default** | D's own field (C's is yes/no) |
| `you.bought.count` | count 0-6, 0 | "Add an annuity or a gilt ladder" sets 1; "Add another" adds one |
| `you.bought.k.yearly` | money 1-200,000, required | row k shown when count > k (a list `when`) |
| `you.bought.k.fromAge` | age, default today's age (= "now") | |
| `you.bought.k.toAge` | age or null (= for life), null | |
| `you.bought.k.rises` | yesNo, true | |
| `spend.kind/amount/level` | `SPEND_FIELDS` | the same paths as A and B |
| `spend.later.has/age/amount` | yesNo false; age; money 1-50,000 | from question 2 |
| partner block | C's `personFields('partner')`, `partner.stop.kind` (already \| age; not answered = already), `partner.stop.age`, the pay line `untilBothStop` (D's own field, shown only for "Not yet, at age": with both stopped there is no pay to cover anything; `schemaParts.js`'s `untilBothStopField` would also show it for "already"), `payingInFields('partner')` while they work, `partner.taxFreeTaken` once stopped (D's own yes/no/some field), `partner.bought.*` | 6.20.0's couples |
| More | `risk` (Balanced), `chargeField()` (0.5), `endAge` | see below for `endAge` |
| Try | `work.has/yearly/years`, `fall.has` | never on the numbers step |

**`endAge`.** The default is the later of 95 and the younger person's age + 5, capped at 105.

- An 82-year-old is still tested to 95. *Measured:* £150,000 and £20,000 gave careful £1,920.
- A 93-year-old is tested to 98.

**Not taken from C:**

- `start.kind` / `start.age`: D always starts today.
- Your own pay-in block: someone who has stopped pays nothing in.
- `take`: the spend box is D's try.

### 4.2 Rules (in `src/answers/shared/validate.js`, by id)

| Rule | Fields | Holds when |
|---|---|---|
| `bought-from-not-before-now` | `you.bought.k.fromAge` | fromAge ≥ age |
| `bought-until-after-from` | `you.bought.k.toAge` | toAge > fromAge |
| `later-after-now` | `spend.later.age` | later.age > you.age |
| `later-before-end` | `spend.later.age` | later.age < endAge |
| `work-before-end` | `work.years` | you.age + years < endAge |
| `end-after-start` | `endAge` | C's |
| `partner-stop-not-before-now` | `partner.stop.age` | C's |

There is deliberately no rule that the person must be past State Pension age, or past the earliest pension age (5.4).

### 4.3 How the form becomes the household (`src/answers/d/toHousehold.js`)

This is A's mapping (`a/toHousehold.js`) with the stop at today's age, plus:

- **Your stop:** `you.stopWork = { kind: 'already' }`. The partner follows A and C: not answered or "Yes" means `already`;
  an age means apart, with `untilBothStop`.
- **The tax-free answer:** `taxFreeTaken` yes or some → `pensionTaxFreeCash: 'alreadyTaken'`. No → unset (a quarter of
  each withdrawal is tax-free).
- **Bought rows** become `otherIncome` entries: `{ kind: 'other', label: 'bought', amountPerYear, fromAge, toAge
  (null = for life), rises }`.
  - `rises` is new, and is read for kind `'other'` only.
  - `household.js`'s typedef stops saying "kind 'other' is not used yet".
- **Work** (the lever) becomes `{ kind: 'work', amountPerYear, fromAge: age today, toAge: age + years }`. This is A's
  `partTime` with the stop at today.
- **The spend** becomes `household.spending`. When a later amount is given, it also gets `later: { fromAge,
  perMonthTakeHome }`.
- **Savings** become `jointSavings`, and `savingsHeld` becomes `household.savingsHeld`.
- **Each person's saving** is `{ payIn: 0 }`, and `household.saving = { risk }`. There are no saving years, so the
  kernels are the pots as given.

---

## 5. The engine: one test, reused

### 5.1 The route (`answerD(inputs, env)`, `src/answers/d/answer.js`)

`answerD` is pure and registered in `src/answers/index.js`. It does no new search.

1. **Check.** `checkInputs(SCHEMA_D)`, then `toHousehold`, then `validateHousehold`. Bad input gives
   `status: 'invalid'`.
2. **Set up.** `sp = stopAtPlan(household, ageToday, env)`. With S = 0 the lives are C's futures and the plan is
   `enginePlan(…, { start: 'asGiven', pots: 'perFuture' })`.
3. **The first figure.** `verdictAt(sp, runner, spend × 12)` gives the fails, the share lasted, the verdict and the
   bad-case run-out age. It is one run per life, so it shows first.
4. **The band.** `bandAt(sp, runner)` gives careful, middling and good, each with its share lasted and its bad-case
   age. These are C's band, unchanged.
5. **Headroom.** Worked out by the rule in 3.4.
6. **What it is made of.** `phasesAt(sp, spend × 12)` at the spend, which is what the person asked about.
7. **Levers.** Each lever builds its own household and calls `stopAtPlan(h, ageToday, env, sp.lives)`, so the lives are
   built once.
8. **Sentences.** Built from the result only.

**What the start-as-given path gives D for free:**

- a pension still closed at the start (someone who stopped at 53 lives on savings until 57: A's locked run);
- work with an end;
- couples apart, with the hand-over and the pass-on;
- pots that differ by future.

### 5.2 Adapter change 1: income you've bought (`toEngine.js`, start-as-given only)

`workOf(p, ageAtStart)` becomes `incomesOf(p, ageAtStart)`. It returns the work rows as today, plus the bought rows
(`kind 'other'`).

**For tax and shares:**

- Each period's `gross` adds the bought rows at today's amount. They are taxed with the person's other income, with no
  National Insurance and no tax-free part.
- Periods are cut where a row starts or ends.

**For the engine:**

- A pension run's `extraIncomes` gains `{ startYear, endYear (null = for life), annual, indexation: rises ? 'cpi' :
  'level' }`.
- The engine then makes up a level row's lost buying power from the pot, future by future (2.3).

**For a person with bought income but no pension pot:**

- Their savings run does not carry their incomes in the engine (the `savingsTargetFor` rule). The adapter counts a
  rising row as it counts their State Pension.
- It counts a level row at its buying power falling 4% a year, and says so (`d-bought-level-savings`). This is the one
  place a fixed rate stays, and it is on the cautious side.

**Not work.** These rows get no work-tax line and no £10,000 note, and the work lever never moves them.

**The band floor** (`guaranteedAtStartAYear`) counts rising rows and leaves level rows out. The floor must be an amount
every future lasts at, and a level row's worth at the end differs by future.

**`contentKey`** adds `otherIncome` only when a `kind 'other'` row is present. That keeps the swap rule for couples (P2),
and leaves every existing key (C, A, B) as it is.

**What stays exactly as it is:**

- C's plain path never reads `otherIncome` (`workOf` runs only under `asGiven`, `toEngine.js:171`), so C's pinned outputs
  do not move.
- A and B never create `kind 'other'`.

### 5.3 Adapter change 2: a different amount later (the owner's question 2)

- **The household.** `household.spending.later = { fromAge, perMonthTakeHome }` cuts a period at that year.
- **Each period** carries `ratio`: 1 before the later amount starts, and later ÷ first from then on.
- **Targets.** `targetsAt` and `configsAt` use `R = max(0, H × ratio − netTotal)`. A couple apart does the same in
  `scheduleOn`, `apartConfigsAt` and `floorApart`.
- **The band floor** becomes the least, over the periods, of `netTotal ÷ ratio`.
- **The search.** `H` is still the first amount: `verdictAt(sp, runner, spend × 12)` keeps its signature, and the band
  search finds the first amount, with the later one in proportion.
- **Nothing else changes.** When `ratio` is absent it is read as 1, so every existing plan is key for key what it is
  today (I-D7).

### 5.4 Who can use D

D takes anyone who says they have stopped, at any age:

- **Under the earliest pension age:** the pension is closed until 55 or 57, and savings pay meanwhile (A's locked run). A
  shortfall then counts as a run-out, and the answer says so (A's `savings-run-short`, in retired words).
- **Under State Pension age:** the State Pension is a future income at an age ("your State Pension from 67").
- **Over 75:** A refuses a stop age over 75, but `stopAtPlan` has no such limit.
- **55 or 56 on 6 April 2028, tax-free part not yet taken:** D shows `d-2028` (6.4) but does not model the closed stretch.
  That would need a pension that closes part-way through a run, which the fast path cannot do. Where the line shows for
  C, A and B is already open with the owner (`couples-different-years.md` 12). D is new, so showing it in D changes no
  existing words.

### 5.5 What D does not change

D does not change any of these:

- the engine's run logic (`SimulationEngine`, `fastEngine`), beyond section 2;
- `band.js`, `futures.js`, `lives.js`;
- C's plain path;
- A's and B's answers.

The shared files D touches are listed under each package in section 13.

---

## 6. The answer

### 6.1 The result (`AnswerD`, plain data, typed in `src/answers/shared/contract.js`)

```text
{ status: 'ok' | 'invalid' | 'guaranteed-only' | 'none', problems?, inputs, whose,       // the younger person, as C
  spend: { perMonth, perYear, kind: 'amount' | 'level', level?, later?: { fromAge, perMonth } },
  verdict: 'yes' | 'close' | 'no', fails, lasted, runOutAge,      // at the spend; runOutAge = endAge when it lasted
  monthly: { careful, middling, good }, yearly, lastedAt, runOutAgeAt,      // C's band, C's names (the first amount)
  later?: { careful, middling, good },                                         // the later amounts, in proportion
  headroom: { kind: 'more' | 'about' | 'less', perMonth },                     // whole £10
  guaranteed: { monthlyAfterTax },          // once every rising income has started (level rows listed in phases)
  phases,                                   // at the spend: C's Phase + A's fromWork, pensionOpen; + bought
  work: null | { yearly, years, toAge, verdict, lasted, runOutAge, monthly: { careful },
                 byYears: [ { years, toAge, verdict, lasted, runOutAge } ] },  // 1..5
  fall: null | { share: 0.2, verdict, lasted, runOutAge, monthly: { careful }, drop },
  fromPlan: null | { locked, lockedOn, strategy: 'steady' | 'cuts' | 'ladder' | 'rotation',
                     planSays: { perMonth, taxYear }, sources: { [path]: { from, asOf } } },
  apart?: 6.20.0's,
  assumed, warnings, sentences, basis, units, trace? }
```

**What it never holds:** a function, a Date or a list over the futures. So it can be pinned, carried to and from the
worker, and saved in a seed.

**`fromPlan`** records where figures came from, and nothing more. The figures themselves are in `inputs`, exactly as if
typed (I-D9).

### 6.2 Sentences (`src/answers/d/sentences.js`, C's Sentence shape: a sentence's text equals its parts joined)

**Rules:**

- Every template is checked against the `retired`, `result` and `first` scopes of `src/v7/copy/banned.js`. That means:
  - no "will last";
  - no "safe" or "guaranteed" in a result;
  - one "about" a sentence;
  - "bad case" always with "(the worst 1 in 10)" on the screen.
- Share words come from `lastedText` (`format.js`), including "just under 9".

**The templates:**

| Id | Template |
|---|---|
| `d.head.yes` | Yes — £{spend} a month lasted |
| `d.head.close` | Close — £{spend} a month is tight |
| `d.head.no` | Not at £{spend} a month on these figures |
| `d.sub` | after tax, going up with prices, until you are {endAge} · couple: "between you, … until the younger of you is {endAge}" |
| `d.sub.later` | …, and £{later} a month from {laterAge} |
| `d.line` | Spending £{spend} a month after tax, your money lasted until you are {endAge} {lastedText}. |
| `d.bad` | In a bad case (the worst 1 in 10) it would run out at age {runOutAge}. After that you would have about £{guaranteed} a month from your State Pension[ and your other pensions]. |
| `d.bad.lasts` | In a bad case (the worst 1 in 10) it still lasted until you are {endAge}. |
| `d.more` | You could spend about £{headroom} a month more. About £{careful} a month lasted in 9 futures out of 10. |
| `d.about` | What you spend is about what lasted in 9 futures out of 10. |
| `d.less` | About £{careful} a month lasted in 9 futures out of 10. That is about £{headroom} a month less than you spend now. |
| `d.middling` | About £{middling} a month lasted in 5 futures out of 10. In a bad case (the worst 1 in 10) it would run out at age {age}. |
| `d.pays.bought` | Income you've bought: £{x} a month before tax[, buying less each year as prices rise]. |
| `d.pays.ladder` | Your ladder (bonds that pay out one year after another) pays from {April 2029}. (a date, from a plan reading; never a wait; the explanation is in the template because the answer step is in the `first` scope) |
| `d.work`, `d.work.careful`, `d.work.row`, `d.work.notNeeded` | 3.6 |
| `d.fall`, `d.fall.careful`, `d.fall.unchanged`, `d.fall.rotation.*` | 3.7 |
| `d.plan.says`, `d.plan.cuts`, `d.plan.ladder` | 3.9 |
| C's `c.madeOf.*`, A's `a.pays.gap` and `a.pays.work` | with "after you stop" removed; a State Pension already paid is "your State Pension", with no age |

**Couples apart** get C's sub-line: "Until your partner stops at {age}, half of it comes from your money and their pay
covers the rest."

### 6.3 What we assumed (a fixed order; only the lines that apply)

The list starts with C's lines:

- `state-pension-full`;
- `quarter-tax-free` or `tax-free-taken`;
- `risk-*`, `steady`, `plan-to`, `todays-prices`, `charges`, `both-alive`, `tax-rules`, `futures`;
- the savings line from 2.2;
- 6.20.0's `stop-apart*`.

Then D's own:

| Id | Sentence |
|---|---|
| `d-from-today` | Everything is worked out from today, on what you have today. |
| `d-spend` | You spend £{spend} a month after tax, going up with prices, until you are {endAge}. |
| `d-spend-later` | From {age} you spend £{later} a month, going up with prices. |
| `d-tax-year` | This tax year is worked out as if it started today. |
| `d-tax-free-some` | You've had some of the tax-free part: we've counted it as all taken, which is the cautious side. |
| `d-bought-taxed` | Income you've bought is taxed as income, with no tax-free part. |
| `d-bought-level` | Your £{x} a year stays the same, so it buys less each year; each future has its own prices. |
| `d-bought-level-savings` | Your £{x} a year stays the same: we've taken it to buy 4% less each year. |
| `d-ladder` | Your ladder is counted as the income its bonds still to pay out will pay. Money it has already paid out is in your pension pot. |
| `d-work-tax` | Pay from work is taxed with your other income. National Insurance is not included. |
| `d-fall` | In "What if shares fell?", shares fall by a fifth tomorrow, you keep the same mix, and the futures then run as usual. |
| `d-end-age` | Your money is tested until you are {endAge}, five years on from your age today. (only when the default moved past 95) |

### 6.4 Warnings

| Id | When | Sentence | Severity |
|---|---|---|---|
| `d-2028` | 55 or 56 on 6 April 2028, tax-free part not all taken | Move into drawdown what you will need before 57 by 5 April 2028: after that, nothing new can be taken from your pension until you are 57. | important |
| `d-savings-run-short` | pension closed at the start; savings run out first in a bad case | A's `savings-run-short` words | important |
| `d-savings-cash` | only if 2.2 is not built; savings over a quarter of the money | Your savings are counted as growing 3% a year whatever prices do. In a future where prices rise fast they lose buying power each year. | important |
| `d-drawn-this-year` | from a plan reading: pension money recorded since 6 April | You've taken £{x} from your pension since 6 April. This tax year's tax may be a little higher than shown. | note |
| `d-ladder-not-pot` | a bought row is present | Leave the bonds in your ladder out of your pension pot: they are counted as the income they pay. | note |
| `d-ordinary-account` | a reading found an ordinary investment account | Your ordinary investment account is counted with your savings, without the tax on its gains. If it is large, this answer is on the high side. | note |
| `d-old-figure` | a figure from a reading is over 3 months old | Some figures are from {date}. Check them before you rely on this answer. | note |
| `d-end-near` | age ≥ endAge − 5 | Your money is tested until you are {endAge}. You can test to a later age under More detail. | note |
| C's `higher-rate`, `one-name`, `tax-free-limit`, `small-pot`, `state-pension-assumed` | as C | as C | as C |

---

## 7. The levers, worked out (try only; nothing is saved)

**Spend ±£100.** This is A's knob on `spend.amount`. "Before / Now" is C's mechanism.

**Work** (you only in D's first release; the partner is left out):

- the verdict with the work at its N years;
- one band with the work, giving the careful amount;
- `byYears` for 1 to 5 years, verdict only, one run per life per row (the row equal to N is reused).

All on `sp.lives`. It equals A's `partTime` at a stop of today (I-D4).

**Fall:**

- a household with the pots scaled (3.7);
- `stopAtPlan(h, ageToday, env, sp.lives)`;
- one verdict and one band.

It equals D on the same smaller pots typed in (I-D5).

**Each lever shown** reuses the lives. A lever not opened costs nothing.

---

## 8. Couples

**Both stopped** (the partner's question is "Yes" or not answered):

- This is C's same-year rule: fixed shares, and the first pot to run out ends it.
- D equals C to the pound (I-D1).
- *Measured*, a couple of 70 and 66 with £250,000 and £150,000 plus £30,000 of savings: careful £3,190, and £2,800 a month
  lasted 99.6%.

**You stopped, your partner still working** ("Not yet, at 66"):

- This is 6.20.0's apart path through the same `stopAtPlan`:
  - each person at their own stop;
  - their pay covers half until then;
  - cover months, hand-over and pass-on.
- *Measured*, you 70 and your partner 63 stopping at 66: careful £3,130, and £2,800 lasted 99.1%.
- "What next?" offers A about the partner: "When could my partner stop?"

**You still working, your partner stopped.** This is not D's person, and the partner block does not offer it. The front
door and D's note send them to A, with "Your partner has already stopped" set.

**Either of you can be "you".** The figures are the same either way, including with bought rows (the `contentKey` rule
in 5.2).

**Work** is yours only in D's first release. Today's planner's survivor and care checks stay where they are.

**Found while designing (not D's to change).** A same-year couple still runs out when the first pot does, even when the
other person's pot is full. 6.20.0's pass-on would fix that for every question at once. It moves C's, A's and B's couple
figures, so it belongs in its own noted release. D follows whatever C does.

---

## 9. A locked plan: read, never written

### 9.1 The way in (a reverse hand-over, mirroring save-as-plan)

V7 may not import `src/storage` or `src/firebase` (`architecture.md`, boundary rule 3). So the plan comes to D, never the
other way round.

1. **In today's planner**, a button "Check it from today" sits on the locked banner and the "Where you are" strip. It
   calls a pure `readingFor(scenario, today, { history, holdings, doc, ladderPos, partner? })` in a new
   `src/services/PlanReading.js`.
2. **The reading is written** to this tab's session storage, `pt_v7_plan_reading`, and never the address bar. The same
   tab then opens `/v7/#/d/numbers`.
3. **V7's effect**, `src/v7/effects/planReading.js`, is the only V7 file that touches the reading. It:
   - reads the reading once and deletes it;
   - fills D's draft, marking each box with its source;
   - sets `fromPlan`;
   - discards a reading that is over a day old, unreadable, or of an unknown version;
   - deletes the reading on sign-out.
4. **Before 7.0, the button is hidden.** It shows only when the planner's address carries `?preview`, which holds no
   figures. That follows the owner's ruling that V7 is built beside today's app and switched on when his plan matches.
   At 7.0 it shows for everyone. The tests use the switch.

### 9.2 Where each figure comes from (the newest dated source wins; its date shows beside the box)

| D's box | Sources |
|---|---|
| `you.age` | the plan's age moved on from `currentAgeAsOf` to today (PlanTiming) |
| `you.pot` | The newest of: (a) the latest month's record, equity + bond + cash, dated (for a ladder plan, cash only: the bond box holds the ladder's unpaid rungs, `index.html` `applyDecisionStrategyMode`); (b) What you hold, the pension lines (`pensionPotFromHoldings`), leaving out lines of kind `'gilt'` for a ladder plan, dated `updatedAt`; (c) the plan document's `pots.sipp`, dated at lock. A record's figures are taken before that month's payment, which is close enough for a monthly record; the source note says "before your {September} payment". |
| `savings`, `savingsHeld` | What you hold's ISA and cash lines (ISA, CASH; gilt lines left out for a ladder plan), else the document's `pots.isa`. Plus the ordinary account (GIA lines, the record's `gia`, or `pots.gia`), with `d-ordinary-account`. `savingsHeld` is "invested" when fund lines outweigh cash lines, else "cash". The record keeps no ISA balance. |
| `you.taxFreeTaken` | `accessMethod 'drawdown'` → yes. `'ufpls'` → no (a quarter of each withdrawal is tax-free, which is what the engine's not-taken path does), unless the recorded tax-free total (`legacyDecision.js` sums `taxFree`) has reached £268,275 → yes. "Some of it" is never filled in. |
| State Pension | the latest record's `state` × 12 when recorded in the last 3 months; else `spWeeklyAmount × 52` raised to today's prices (below). It counts as paid when `spStartDate` ≤ today. |
| Final-salary | `dbAmount` raised to today's prices, from age `shapeAgeNow + dbStartYear` |
| Bought rows | see 9.3 |
| `risk` | the preset nearest the plan's intended mix (`equityMin` ÷ the pot). Never taken from What you hold (the owner's ruling of 16 Sep). |
| `charge` | the document's `chargesPct`. A document from before 6.19.0 has none: D takes 0.5% and says "Your plan was worked out without charges; this answer takes 0.5% a year." |
| `endAge` | `shapeAgeNow + duration`, clamped to 75-105 |
| spend | **never filled.** "[Use £X]" offers the average recorded `monthlyNet` over the last 12 months (at least 3 recorded months), whole £10. With fewer, it offers the plan's step for this tax year after tax, raised to today's prices. A couple adds both plans when both are read. |
| `d-drawn-this-year` | the records of this tax year (`whereAmI(doc).incomeThisYear.drawn`) |
| partner | the linked plan (`household.partnerScenarioId`) when today's app has it loaded; otherwise the partner block is asked |

**Today's prices.** Figures in the plan document are in pounds of the day the plan was locked. They are raised by the
plan's own chain: the price rise typed at each tax year's set-up, and 4% a year where none was typed. That is the same
chain the planner uses (`TaxYearWizardService.js` 311-332, `DECISION_ASSUMED_CPI`). Ten years after lock, an unraised
figure would be about a third too low.

### 9.3 A ladder: each pound counted once

**The rule:**

- The ladder's bonds still to pay out are income.
- Anything the ladder has already paid out is cash, and it is in the pot.

**How the reading applies it:**

- **Rows:** the years in `doc.strategy.r.plan.years` funded by a bond not yet matured (`from !== 'cash'`, `matures` after
  today), at `need` (what the bond pays that tax year), raised to today's prices.
- **What matured but is set aside** for a later tax year (`ladderPosition`'s `parked`) is not a row. It is already in
  the cash box, and so already in the pot.
- **Each row's start** is the first whole year from today at or after its tax year's 6 April. Rounding to the later year
  is the cautious side, and it is how the engine treats a State Pension that starts part-way through a year.
- **Rows with equal amounts** (to the pound) are joined into runs. More than six runs are merged, neighbours with the
  closest amounts first, each merged run at the lowest amount in it (the cautious side). Rows rise with prices for an
  index-linked ladder.
- **Not used:**
  - The document's timeline `contract` column holds the plan's need, not what the bonds pay, for `floor-the-schedule`
    and `gilt-rotation` (`src/ui/incomeLayersGraphic.js:72-78`).
  - "Every tax year from this one" would count this year's paid-out money twice: once in the cash, once as income.
- **Rotation:**
  - When `rotationStatus(doc).state` is `'fired'`, rows after the cut age are dropped: those bonds were sold, and their
    money is in the pot.
  - When it is armed or disarmed, the rows stay, with 3.7's line.

**A closed-form test** proves it: in a flat world, D's pot plus every row equals the plan's money not yet spent, exactly
once (CF-D6).

### 9.4 What never happens

- **No write of any kind.** No `isActive` flip, no history, settings or plan document change, nothing to What you hold.
- **A browser test proves it** (B4): the plan document, the history count, the settings checksum and `isActive` are deep
  equal before and after a full walk through D, with every lever opened.
- **The privacy policy** gains one sentence on the reading kept in this tab's session storage for less than a day.

### 9.5 Today's planner itself

Unchanged, except for:

- the button;
- one line in "Try a strategy"'s hint: "To test from today's pots at your age today, use Check it from today." It sits
  behind the same switch;
- 2.1's fix.

"Try a strategy" keeps its words, because today's app is not word-checked until cutover.

---

## 10. Keep as a plan: seed version 3

**`src/answers/keep/planSeed.js` and `src/services/PlanSeed.js`:**

- **The version.** `SEED_VERSION` becomes 3, and `checkSeed` accepts 1-3. A planner that knows only 2 refuses 3 rather
  than make a wrong plan.
- **The seed** carries `source: 'd'` and `stop.kind: 'now'`: retired from this tax year, pots today, no
  `potAtRetirement`.
- **Bought rows** become `extraIncomes`: `{ label: 'Annuity' | 'Ladder income', startYear: fromAge − ageNow, endYear: toAge
  − ageNow − 1 | null, annual, indexation: rises ? 'cpi' : 'level' }`. Today's engine handles `'level'` in every future.
- **A later amount** becomes the plan's second income step, at its age, grossed up as the first.
- **The tax-free answer:** yes or some → `accessMethod: 'drawdown'`.
- **Work, if kept,** becomes A's part-time `extraIncomes` row from year 0. The fall is never saved.
- **Savings held** go to the plan's ISA setting as the planner knows it: cash → its own ISA rate, invested → an ISA mix.
  One line in the plan's description says which.

**A locked plan is never made inactive by keeping.** `createPlansFromSeed` calls `setActive` today
(`PlanSeed.js:695`).

- If it did that here, the next month's record would go into the new plan, and a first record locks it: the person
  would then hold two locked plans, and their real plan would miss a month.
- So when the active plan is locked, the new plan is made but not made active. The confirm step says "Your locked plan
  stays the one you follow."
- With no locked plan, today's rule stands.

**Names** (`src/answers/shared/planName.js`, at most 50 characters, the last part dropped first; D names the spend tried,
as A does):

| Case | Name |
|---|---|
| One person | From 68 · £2,100 a month |
| With a later amount | From 68 · £2,100 then £1,600 a month |
| With work kept | From 68 · £2,100 a month · working to 71 |
| A couple | From 70 and 66 · £2,800 a month |
| A couple apart | From 70 · partner stops at 66 · £2,800 |
| From a locked plan | {any of the above} (from today) |

**A ladder plan's separate plan** is steady withdrawals on the pot, with the ladder as income rows. Its description
says: "Your ladder is counted as the income it pays; its bonds are not in this plan's pot."

---

## 11. Tests

### 11.1 Identities (exact, at 40 and 1,000 futures; `tests/v7/d/identity.test.js`)

- **I-D1 D's band = C from now.** This holds for every household whose pensions are open today and which has no bought
  rows, no later amount, no work, the same tax-free answer and the same savings answer. `monthly`, `lastedAt` and
  `runOutAgeAt` are equal. *Measured:* £1,960 / £2,290 / £2,680 in both.
- **I-D2 D at the spend = C's take at the same figure.** `lasted` and `runOutAge` are equal, and `verdict === 'yes'`
  exactly when `take.covered`. *Measured:* 0.943 / 95 and 0.758 / 90 in both.
- **I-D3 D = A stopping now.** For ages up to 75, with `stop.age = you.age`: verdict, lasted, run-out age and band are
  equal. *Measured:* equal.
- **I-D4 Work.** D with N years at W = A stopping now with `partTime { yearly: W, years: N }`. *Measured:* the six rows
  of 3.6.
- **I-D5 Fall.** D's fall = D with the pots typed in already scaled.
- **I-D6 One rising bought row for life from now = a final-salary pension of the same amount from today's age.** For one
  person. Both reach the engine as a `cpi` income.
- **I-D7 A later amount equal to the first = no later amount**, bit for bit.
- **I-D8 Couples apart:** D = C from now with the same partner stop (6.20.0's X1).
- **I-D9 A plan reading:** D on a reading = D on the same figures typed in. A test reads the import lines: no file under
  `src/answers/` imports the reading or reads `fromPlan` except to copy it into the result.
- **I-D10 The budget:** the answer never reads the budget (`budget-step.md`'s tests, extended to D).
- **I-D11 A level row in futures where prices never rise = the same row rising with prices**, bit for bit.

### 11.2 Closed forms (`env.futureReturns`, an all-cash mix, 0% charge, savings growth 0)

- **CF-D1, flat prices.** The cash return is max(0, 0 − 1%) = 0. Tax-free part taken, spend under the personal
  allowance:
  - a pot P at spend S lasts exactly ⌊P ÷ S⌋ months;
  - `runOutAge = age + ⌊P ÷ 12S⌋`;
  - careful = ⌊P ÷ (12 × years to endAge) ÷ 10⌋ × 10.
- **CF-D2.** CF-D1 plus work W ≥ 12S, under the allowance, for N years: the run-out moves exactly N years later, and
  `byYears` shows exactly that.
- **CF-D3.** An all-shares mix: the fall equals the pot × 0.8 exactly. Balanced: × 0.9.
- **CF-D4.** Guaranteed income ≥ spend with no pots: status `guaranteed-only`, verdict yes, `runOutAge = endAge`.
- **CF-D5.** Prices rising a fixed i a year, a level row A, the pot in cash earning i − 1%. The pot pays each year exactly
  12S − A ÷ (1 + i)^y in today's prices, to the pound.
- **CF-D6, the ladder each pound once.** A made-up locked ladder plan read in October, in a flat world: the reading's pot
  plus every row's total equals the plan's money not yet spent. Moving today across a bond's maturity moves money from
  a row to the pot, never to both.
- **CF-D7, a later amount.** In CF-D1's world, a later amount at half the first from age a: the run-out is exactly where
  the pot runs dry under that schedule.

### 11.3 Properties (generated households, 200 lives; held to one £10 step, as `tests/v7/c/exceptions.md` sets)

- **P-D1.** More pot or more savings never lowers the careful amount.
- **P-D2.** More spend never raises the share that lasted.
- **P-D3.** Work never lowers the share that lasted, and more years never do either.
- **P-D4.** A fall never raises it.
- **P-D5.** A bought row never lowers the careful amount, and rising ≥ level.
- **P-D6.** The headroom kind always agrees with the verdict (3.4).
- **P-D7 (swap).** For a couple, either of you as "you" gives the same figures, with bought rows too.
- **P-D8.** Every sentence's text equals its parts joined, with no banned word in any scope that applies.

### 11.4 Fixtures (made-up people, each with its expected plain sentence; `tests/v7/d/fixtures.test.js`)

| Id | The person |
|---|---|
| D1 | 68, drawing for a year, £300,000 and £40,000, full State Pension being paid (the worked example) |
| D2 | A couple of 72 and 70, both stopped, one final-salary pension, tax-free part taken |
| D3 | 62, stopped 18 months ago, under State Pension age, an invested ISA larger than the pension |
| D4 | 78, ten years in, a level annuity of £6,000 a year beside a small pot |
| D5 | 53, stopped, the pension closed until 57, savings paying meanwhile (and a bad case where they run short) |
| D6 | 70, an index-linked ladder from a reading, three runs of rows, the cash box holding parked money |
| D7 | 66, thinking about work: £15,000 a year for 3 years |
| D8 | A couple: you 64 and stopped, your partner 58 and working until 61 |
| D9 | 88, near the end age; the default end age moves to 95 → shown with `d-end-near` |
| D10 | 55 on 6 April 2028, tax-free part not taken (`d-2028`) |
| D11 | A locked rotation plan, armed and then fired |
| D12 | Spending less from 80 (from the owner's question 2) |

### 11.5 Plan reading (`tests/planReading.test.js`)

- Each row of 9.2 is tested: its source order, the newest-wins rule, and the date carried.
- Lock-day amounts read ten years on equal the price chain applied.
- A plan from before 6.19.0 → 0.5% and the line.
- A ladder → CF-D6.
- `'ufpls'` → "no" until the limit; `'drawdown'` → "yes".
- No figure is in any address, and a reading over a day old is discarded.

### 11.6 Browser and words

**Named states:** `d-numbers`, `d-answer-yes`, `d-answer-close`, `d-answer-no`, `d-work`, `d-fall`, `d-locked`,
`d-apart`. Each is rendered at phone, iPad and desktop.

**Journeys:**

- **B1, retired and worried:** numbers, one figure, Close, some work → Yes, keep.
- **B2, from A's retired view:** "Will it last?" carries the household.
- **B3, the forum guest with two minutes:** age, pot and spend, and an answer in under two minutes.
- **B4, a locked plan:** with `?preview`, "Check it from today" fills D with the sources shown. Walk every lever, then
  keep a separate plan. The locked plan is deep-equal before and after, and stays active.

**Words:** `tests/v7/wording/wording.test.js` runs the `retired` scope over all of D, and every drawn state passes
`checkScreen`.

### 11.7 Pinned tests that change on purpose

- `tests/v7/shell/*`: D joins `OPEN`.
- The front door's D line.
- `Retired.jsx`'s link (`href.soon('d')` → `href.step('d', 'numbers')`).
- A's and B's `already-needs-partner` words.
- `tests/planSeed*.test.js`: version 3, and "not active when the active plan is locked".
- Section 2's releases each change pinned C, A and B figures, with their own notes.

---

## 12. Speed

The budgets are unchanged (step 4 brief, decision 17), with the processor slowed four times:

- first figure: 3 s;
- the answer step's final figure: 15 s;
- an optional step: 30 s more.

**What D costs.** *Measured* on the development Mac, at 1,000 futures:

| Step | Work | Measured |
|---|---|---|
| Answer: first figure | one verdict: n runs | part of the line below |
| Answer: final | C's band + one verdict | 0.2 s (C from now alone: 0.17 s) |
| Work | one band + one verdict with work + up to 5 verdicts (`byYears`) | A's row with work: 0.6 s; the step under 2 s |
| Fall | one band + one verdict | about the answer's |

**Targets:**

- **A work bound, checked on every push** (it does not depend on timing). Engine evaluations are counted by the stop
  runner, as `evaluations` is today:
  - the answer step ≤ C's from-now evaluations for the same household + n;
  - the work step ≤ one band + 6n;
  - the fall step ≤ one band + n.
- **A timing check** (`tests/v7/d/speed.slow.test.js`, nightly, run alone): D's answer step takes at most 1.10 × C from
  now on the same household (the median of three runs).

---

## 13. The build, in packages

**The order:**

1. Section 2's three releases land first, in order:
   - 2.1, a patch;
   - 2.2 with 2.3, a minor release for every question.
2. D's packages then build on that code.

**Each file below belongs to one package only.**

**D0: inputs and the household.** Nothing here touches the engine.

- `src/answers/d/schema.js` (new), `src/answers/d/toHousehold.js` (new).
- `src/answers/shared/household.js`: `otherIncome kind 'other'` with `rises`; `spending.later`; `validateHousehold` for
  both.
- `src/answers/shared/validate.js`: the rules of 4.2.
- `src/answers/shared/contract.js`: `AnswerD`, the `bought` phase.
- Tests:
  - `tests/v7/d/schema.test.js`, `tests/v7/d/toHousehold.test.js`;
  - `tests/v7/household.test.js`;
  - `tests/v7/shared/validate.test.js`.

**D1: the adapter.** The identity tests are written first and must pass before any figure moves.

- `src/answers/shared/toEngine.js`: `incomesOf`; level rows; `ratio` by period (5.3); `contentKey`; the floors.
- `src/answers/shared/stopAt.js`: `phasesAt`'s bought line; `ratio` in the apart schedule's targets.
- Tests:
  - `tests/v7/d/identity.test.js` (I-D1 to I-D8, I-D11);
  - `tests/v7/d/closedForm.test.js` (CF-D1 to CF-D5, CF-D7);
  - `tests/v7/shared/answers.sameYear.test.js` and `tests/v7/shared/apart.identity.test.js` (no figure moves);
  - `tests/v7/c/speed.identity.test.js`.

**D2: the answer and its words.** Needs D0 and D1.

- `src/answers/d/answer.js`, `src/answers/d/sentences.js` (new).
- `src/answers/index.js`: registers D.
- Tests:
  - `tests/v7/d/invariants.js`, `properties.test.js`, `metamorphic.test.js`, `sentences.test.js`, `fixtures.test.js`;
  - `cases.pairs.json`, `exceptions.md` (empty);
  - `speed.slow.test.js`.

**D3: the screens, the rail and the words.** Needs D0, and joins D2 for the answer screens.

- `src/v7/rail/d.js` (new), `src/v7/rail/questions.js` (D joins `STEP_LISTS` and `OPEN`).
- `src/v7/copy/d.js` (new).
- `src/v7/copy/a.js`, `src/v7/copy/b.js` (the `already-needs-partner` words), `src/v7/copy/common.js` (the front door's
  `more`).
- `src/v7/screens/d/NumbersScreen.jsx`, `AnswerScreen.jsx`, `MoreScreen.jsx`, `WorkScreen.jsx`, `FallScreen.jsx` (new).
  The spend step reuses A's `SpendScreen.jsx` through `src/v7/screens/index.js`.
- `src/v7/components/Retired.jsx`, `src/v7/components/MadeOf.jsx` (the bought line), `src/v7/components/PersonBlock.jsx`
  (bought rows).
- `src/v7/router/routes.js`, `src/v7/state/initial.js`, `src/v7/state/select.js`, `src/v7/state/carry.js`.
- Tests:
  - `tests/v7/screens/*`, `tests/v7/rail/*`, `tests/v7/wording/*`, `tests/v7/render/checkScreen.js`;
  - `tests/v7/shell/carry.test.js`, `tests/v7/shell/routes.test.js`, `tests/v7/shell/select.test.js`;
  - `tests/v7/states/d-*`.

**D4: today's planner** (every file of today's app).

- `src/services/PlanReading.js` (new, pure).
- `src/services/PlanSeed.js`: version 3; bought rows; the later step; not active when the active plan is locked.
- `index.html`: the button behind `?preview`; the hint line; passing "the active plan is locked" to the confirm step.
- `compliance/PRIVACY_POLICY.md`: the session-storage sentence.
- Tests:
  - `tests/planReading.test.js` (new);
  - `tests/planSeed.test.js`, `tests/planSeed.v7.test.js`;
  - `tests/indexMarkup.test.js`.

**D5: keep and the reading, on V7's side.** Needs D2 and builds to D4's seed and reading contract (sections 9 and 10).

- `src/answers/keep/planSeed.js`: version 3 and source `'d'`.
- `src/answers/shared/planName.js`: D's names.
- `src/v7/effects/planReading.js` (new), `src/v7/effects/index.js`.
- `src/v7/state/actions.js`, `src/v7/state/reduce.js`: `draft/fromPlan`.
- `src/v7/components/KeepPanel.jsx`, `src/v7/copy/keep.js`: the separate-plan words.
- Tests:
  - `tests/v7/keep/*`;
  - `tests/v7/shell/keep.test.js`, `tests/v7/shell/reduce.test.js`, `tests/v7/shell/draftStore.test.js`.

**D6: the questions together, the browser and the release.** Joins everything.

- `tests/v7/cross/questions.test.js` and `tests/v7/cross/oneTest.test.js` (D beside C and A).
- `tests/v7/fixtures/*`.
- `e2e/d-retired.spec.js`, `e2e/d-locked.spec.js` (new: B1 to B4); `e2e/screens.spec.js` (D's pictures).
- `src/releases.js` and `package.json`: a minor release. Its note says:
  - the preview gains "Will it last?";
  - plans kept from it can carry an annuity, a ladder and a later amount;
  - a locked plan is never changed or made inactive by it.
- `research/v7-plan-of-plans.md`: the progress line.

---

## 14. Left out on purpose, and why

| Left out | Why, and what instead |
|---|---|
| A one-off spend (a car, a roof) | One today is exactly a smaller pot, so it is cheap to add later. One in a later year needs `extraWithdrawals` on the fast path, which belongs with E. |
| Money already taken this tax year | Stated (`d-tax-year`). A reading adds `d-drawn-this-year`. |
| The tax-free part taken in part | Counted as all taken (the cautious side), and stated. Asking how much of the pot is untouched needs two runs per person. |
| National Insurance on pay from work | Stated. Added for A and D together later (AB's question 14). |
| The partner's work as a lever | A has the same limit. |
| A later State Pension (putting it off) | Question F. |
| The rotation's trigger, cuts in bad years, the plan's own strategy | Question E. D says so in one line (3.9). |
| The survivor and care checks | Today's planner keeps them. |
| A ladder held in an ISA | Taxed as income: the cautious side. |
| The ordinary account's tax on gains | Counted with savings, with `d-ordinary-account`. |
| The mix held (What you hold) as the tested mix | The owner's ruling of 16 Sep: the planner's mix is the intended one. |
| The 2028 closed stretch | Warned (`d-2028`), not modelled. |
| Same-year couples' pass-on | A separate release for every question (section 8). |

---

## Questions for the owner

1. **How should ISAs and other savings grow, in every question?**
   Today they grow 3% a year whatever prices do, and for a retired person with a large ISA that one figure can turn
   "Yes" into "No" (*measured*: £100,000 pension and £250,000 savings at £2,100 a month gave No at 3% and Yes at 5%). I
   recommend one tap under the savings box. "Mostly cash" (the default) follows the planner's own cash rule, last
   year's price rise less 1%. "Invested like my pension" follows the pension's mix on the same futures. This would ship
   for C, A, B and D in its own release before D. If we keep the fixed 3%, D carries a warning, and savings keep losing
   buying power fast in the futures where prices rise fastest, which is where bad cases are.

2. **Can someone say they will spend a different amount from a later age?**
   Many people expect to spend less once they travel less, or more for care, and many locked plans step down with age.
   I recommend one optional later amount on the spend step ("From 80, £1,600 a month"); "Could I spend more?" then
   moves both amounts in proportion. Without it D tests one level amount for life, and for plans that step down it will
   say "Not at £X" more often than the plan itself does.

3. **When D's quick test and a locked plan disagree, what does D say?**
   D takes the same amount every month from today's pots. A locked plan may cut its spending in bad years or pay from a
   ladder, so the two can give different figures. I recommend D shows its own Yes, Close or Not, with one line giving
   the plan's figure, why the two differ, and a link to test the plan its own way. It never suggests unlocking. The
   other way is to show no verdict on a locked plan, only the amounts: that avoids a clash, but tells the person less.

4. **Does D's first release include "What if shares fell by a fifth tomorrow?"**
   It is the worried retired person's question. It costs one more run, and it shows what the State Pension and any
   bought income do when shares fall. I recommend yes, one size (a fifth), as an optional step after "Would some work
   help?". Without it D still gives the bad case (the worst 1 in 10), which includes bad runs of markets, but not what
   happens if the fall comes now.
