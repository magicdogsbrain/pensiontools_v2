# Couples who stop work in different years (design, 1 Oct 2026)

Status (2 Oct 2026): built for 6.20.0, not yet released, with the owner's three questions taken as recommended below.
What the reviews changed while building is marked "2 Oct 2026" where it applies: the pass-on after the second stop
(4.3 f), C's "from now" and the partner's pay-in (5.1), the carry from C and A's links (5.4), I3's one exception and I10
(9.1), the work bound (10) and where the 2028 line shows (12). This is the design for the owner's decision of 1 October
2026:

> "Yes couples stopping in different years."

It was put together from two competing designs and a critique of both, checked against the code. Paths are relative
to the repo. Line numbers are as of 1 October 2026, with the 6.19.0 charges work partly in the working tree; re-check
them once that work lands.

---

## Why people come

Most couples do not stop work on the same day. Often one has already stopped and lives on their pension, and the other
works on for a year or a few.

Today the three quick answers ("What is that a month?", "When can I afford to stop work?" and "Am I saving enough?")
assume a couple stop in the same year (step 4 brief, decision 10), and say so on screen. For a couple where one has
already stopped, that answer describes a household that does not exist. It leaves the stopped partner's money untouched
until the other stops. It ignores what that money is paying for today. It also drops half of what the couple put into
savings each month.

This design lets each of you stop on your own date, with **one new question**. When you stop in the same year,
**nothing changes**: every figure stays exactly what it is today.

**The case it must answer well.** One partner stopped some time ago and draws from their pension now, with cash set
aside for the years before a later income starts. The other is in their mid-fifties, still working, and stops next
summer. Either of them may be the one filling in the form, and both must get the same figures.

---

## 1. The idea

- **Each of you stops on your own date.** Until then your money is in its saving years: invested, with your pay-ins
  going in, on the same future as your partner's.
- **On the day you stop, your money joins the household's.** From then on it is tested on the same markets, in the same
  calendar years, as your partner's.
- **While one of you has stopped and the other is still working:**
  - the worker's pay covers half of what you spend, and they keep paying in;
  - the money of the one who has stopped pays the other half;
  - if that money cannot pay its half (their pension cannot be touched yet, or their cash runs out), the worker's pay
    covers the rest. That is not counted as running out.
- **From the day the second of you stops, today's rule applies, on what each of you has then.**
- **Stopping in the same year is today, bit for bit.**

For a couple, the form gains one question: "When does your partner stop work?" There are two details:

- how much of what you spend the worker's pay covers until you have both stopped (half, all of it, or none of it);
- whether the tax-free part of a pension has already been taken.

---

## 2. What the person sees

### 2.1 The new question (A, B and C)

It sits in the partner block, after the partner's age and pot.

> **When does your partner stop work?**
> ( ) When you do  *(C: "When you start taking money")*
> ( ) They already have
> ( ) At an age  [ 56 ]

- **Nothing is ticked to begin with, and nothing needs to be.** Not answered means "when you do". The answer's list of
  what was assumed says so ("You both stop in the same year"), with Change, as it does today.
- **Choosing "They already have" hides the partner's pay-in boxes.** Nothing goes into a pension after a stop.
- **Choosing "They already have" or "At an age" shows one line under the question:**

  > Until you've both stopped, the one still working covers half of what you spend from their pay, and keeps paying
  > in. [Change]

  Change opens:

  > **Until you've both stopped, their pay covers:**
  > ( ) Half of what you spend   ( ) All of it   ( ) None of it
  > *Whatever their pay doesn't cover comes from the money of the one who has stopped.*

### 2.2 "I've already stopped" (A and B, a couple only)

A's stop question gains a third option for a couple:

> **When do you have in mind?**
> ( ) An age  ( ) I have no age in mind — show me ages  ( ) I've already stopped

B's stop age gains the same choice for a couple: "The age you would stop work [ ]" or "I've already stopped".

Choosing "I've already stopped" turns the partner's question into the one the answer is about:

> **When would your partner like to stop work?**
> ( ) An age [ 56 ]  ( ) No age in mind — show me ages *(A only)*

- **The answer is then about your partner.** "Yes — your partner could stop at 56" (A), or "Your partner is on course"
  (B).
- **Nobody is asked to swap names.** "You" stays the person at the keyboard, so a plan saved from the answer keeps the
  right names.
- **When you have both stopped**, A and B show their retired view, which points to "What is that a month?". It reads
  "You have both stopped. 'What is that a month?' answers what your money could pay."

### 2.3 The tax-free part (More detail)

The question is asked only for someone who has stopped:

- "you" in C from now;
- "you" in A and B with "I've already stopped";
- the partner with "They already have".

> **Already had the tax-free part of your pension?** ( ) No ( ) Yes
> *Usually a quarter of the pot. If it has gone, everything taken out is taxed.*

The partner's version reads "…of your partner's pension?". Not answered means not taken, which is today's
`quarter-tax-free` line. Part-taken is not asked.

### 2.4 The answer, in words

| Where | Same year (unchanged) | Different years |
|---|---|---|
| A headline | "Yes — you could both stop when you are 60 (your partner 58)" | "Yes — you could stop at 60", then on its own line "Your partner stops at 62, as you said." or "Your partner has already stopped." |
| A headline, you have stopped | — | "Yes — your partner could stop at 56", then "You have already stopped." |
| A sentence | today's | "Stopping at 60, with your partner stopping at 62, and spending £3,200 a month between you, the money lasted until the younger of you was 95 in 9 futures out of 10." |
| First "what it's made of" row | — | "60 to 62, while your partner is still working: £1,600 a month from your money, £1,600 from your partner's pay." |
| B spending line | "…a month after tax from the age you both stop…" | "£3,200 a month after tax once you have both stopped, until the younger of you is 95. Until your partner stops, half of it comes from their pay." |
| B number, both saving | today's | "You need about £410,000 in pensions between you: yours when you stop at 60 and your partner's when they stop at 62." |
| B number, partner stopped | — | "You need about £300,000 in your pension when you stop at 60, with your partner's money as you gave it." |
| B number, you stopped | — | "Your partner needs about £300,000 in their pension when they stop at 56, with your money as you gave it." |
| B `stop.age` label | "Your age when you both stop work" | "The age you would stop work" |
| C sub-line | — | "From when you have both stopped (your partner at 56). Until then, half of it comes from your money and your partner's pay covers the rest." |
| Assumed `stop-apart` (Change → the pay line) | `stop-together` / `both-stop-together` (today) | "You stop at 60 and your partner at 62. Until then, their pay covers half of what you spend and they keep paying in; the other half comes from your money." The other two settings have their own sentences: "…their pay covers all of what you spend, and your money is left alone." / "…your money pays all of it." |
| Assumed `stop-apart-cover` (Half or All) | — | "If the money of the one who has stopped cannot pay its part (say their pension cannot be touched yet), the other's pay covers the rest." |
| Assumed `partner-already` | — | "Your partner has already stopped: their money is drawn on from now, and nothing more goes into it." |
| Assumed `savings-first` | `savings-split` (today) | "Your savings between you are drawn on from when the first of you stops." |
| Assumed `pay-keeps-pensions` (only when it applies) | — | "A State Pension or final-salary pension paid to the one still working goes with their pay until they stop." |
| Warning `apart-cover-used` (only when it happens in the bad case) | — | "In a bad case your money cannot pay its half from 58, so your partner's pay would need to cover all of what you spend until they stop at 60." |
| Warning `partner-stops-with-you` (not answered, partner past State Pension age) | today's | today's, plus "If they have already stopped work, say so under 'When does your partner stop work?'." |
| Plan name suggested | "Stop at 60 and 58 · £3,200 a month" | Both working: "Stop at 60 and 62 · £3,200 a month" (each person's own stop). Partner stopped: "Stop at 60 · £3,200 a month". You stopped: "Partner stops at 56 · £3,200 a month". The person names the plan; this is only the suggestion. |

Every new string passes `src/v7/copy/banned.js`. The words were chosen around three of its rules:

- C is read by people who have stopped, so the copy says "stops at 56", never "stop work at 56" (`retire-date`).
- Ages are given rather than waits (`time-to-wait`).
- The copy says "at today's prices", never "today's money" (`real-terms`).

---

## 3. The inputs

### 3.1 New fields

None of them has a default. **Not answered means today's meaning.** The checked inputs of every existing fixture,
state and saved draft are therefore unchanged, key for key (C's `payIn.has` is the precedent: `schemaParts.js:77-79`).

| Path | Questions | Type | Applies when | Not answered means |
|---|---|---|---|---|
| `partner.stop.kind` | A, B, C | choice `same` \| `already` \| `age` \| `ages` | couple | `same` |
| `partner.stop.age` | A, B, C | age 18–75 | `partner.stop.kind` is `age` | — (required) |
| `untilBothStop` | A, B, C | choice `half` \| `all` \| `none` | couple, and `partner.stop.kind` is one of `already`, `age`, `ages` | `half` |
| `stop.kind` gains `already` | A | (existing field, default `age` kept) | — | — |
| `stop.kind` (new in B) | B | choice `age` \| `already` | — | `age` |
| `you.taxFreeTaken` | A, B, C | yesNo | A, B: `stop.kind` is `already`; C: `start.kind` is `now` | no |
| `partner.taxFreeTaken` | A, B, C | yesNo | couple, and `partner.stop.kind` is `already` | no |

The screen offers only the options that fit:

- **You still working:** `same`, `already`, `age`.
- **You have stopped (A, B):** `age`, plus `ages` in A.

**Hidden by a stop.** With `whenNot`:

- the partner's pay-in block (`saverFields('partner')`, and C's `payingInFields('partner')`) is hidden when
  `partner.stop.kind` is `already`;
- your own pay-in block is hidden when `stop.kind` is `already`;
- B's `stop.age` is hidden when `stop.kind` is `already`.

### 3.2 `validate.js`: one change, used everywhere

- **`when` takes a list as well as a value.** A list means "one of".
- **A new `whenNot` key.** It means "none of".
- **One rule, exported.** `applies(field, values)` is exported from `validate.js`, and `Field.jsx:55` and
  `tests/v7/render/checkScreen.js:198, 220` call it instead of keeping their own copies (three today).
- **`PersonBlock.jsx` nesting.** It reads only plain-value `when` keys. No list is used on the key it nests under.

### 3.3 Rules

Each rule's error goes on the first field it names.

- **`partner-stop-not-before-now`**: `partner.stop.age ≥ partner.age`. An age equal to theirs today means they stop now,
  the same as "They already have".
- **`partner-stop-fits` (A, B)**:
  - with you stopped, the partner's choice must be `age` (or `ages` in A). Not answered asks "Choose when your partner
    would like to stop, or 'show me ages'";
  - with you working, `ages` is refused: "'Show me ages' works for one of you at a time: give your partner's age, or
    choose 'When you do'";
  - both stopped is not an error: it is the retired view (2.2).
- **`already-needs-partner` (A, B)**: "I've already stopped" for one person. The error reads "If you have stopped, 'What
  is that a month?' is the question for you." This is today's rule for one person, given words.
- **`partner-stop-after-now` (B, you stopped)**: the partner must still be working, `partner.stop.age > partner.age`.
  This is B's `stop-after-now` for the person the answer is about.
- **`end-after-stop` / `end-after-start`**: these now look at the **later** stop. The end must come after both stops,
  and the later stop must be under 45 years after the first.
- **`start-not-before-access` (C)**: checked at the **second** stop, where the pay stops covering. Under "None of it"
  it is checked at the first stop.
- **`pay-in-past-75`**: checked per person at their own stop. The partner's own field stops at 75.
- **Removed: `stop-together`** (`household.js:396-400`).

### 3.4 Mapping to the household

The mapping is in `a/toHousehold.js`, `b/toHousehold.js`, `c/toHousehold.js`, and in C's `saverInputsOf`
(`c/onLives.js:90-103`).

**The partner's stop:**

- Not answered, or `same` → `partner.stopWork = { kind: 'age', age: partner.age + S }`, exactly as today. The note
  `both-stop-together` is added only when it was not answered.
- `already` → `{ kind: 'already' }`. The partner's pay-ins are 0.
- `age` → `{ kind: 'age', age: partner.stop.age }`. In A's and B's swept rows, the swept person's stop is the row's.
- **Your own stop:** "I've already stopped" → `you.stopWork = { kind: 'already' }`.
- **`b/toHousehold.js:70` must stop overwriting** every person's stop with the shared one.

**Money and settings:**

- **`household.untilBothStop = { payCovers: 0.5 | 1 | 0 }`.** It is set **only when the two stops differ**, so a
  same-year household deep-equals today's.
- **`pensionTaxFreeCash: 'alreadyTaken'`** when the answer is yes. Otherwise it is unset, as today.
- **Savings between you** (`jointSavings`, `household.js:311-315`):
  - same year → split evenly (today);
  - apart → **all with whoever stops first** (`savings-first`). They are joint money, so they are reachable from the
    first stop. Split evenly, half of a couple's cash would sit untouched behind the worker's stop.
- **Monthly saving into ISAs** (`savingsIn`): split evenly among **those of you still working today**, each until their
  own stop. Today (`a/toHousehold.js:71-72`, `b/toHousehold.js:50`) a partner who has stopped is given half, and that half
  never goes in, because they have no saving years.
- **Part-time work** (A) stays with "you" (`a/toHousehold.js:76-81`). When you have stopped it is hidden, because part-time
  work after a stop belongs to the person stopping.

---

## 4. The money rules (the engine)

### 4.1 Terms

All are whole years from today, as `yearsUntilStop` computes them (`household.js:136-146`). From 1 October 2026, next June
counts as 1.

| Term | Meaning |
|---|---|
| `S_j` | years until person j stops (0 = already, or now) |
| `S0 = min S_j` | the household's start: `householdStart`, unchanged (`household.js:153-157`) |
| `g_j = S_j − S0` | the year, counted from the start, when j's money joins (0 for the first to stop) |
| `G = max g_j` | the years apart. **0 is today's case** |
| `D = min(45, planToAge − (younger's age + S0))`, `T = S0 + D` | unchanged |
| `payCovers` | `household.untilBothStop.payCovers` when G > 0 |

There is a new export in `household.js`: `stopsOf(household, now)` → `[{ who, S, join }]`. Two people at most
(`HOUSEHOLD_LIMITS.people.max`), so there is at most one join.

### 4.2 The saving years: each person to their own stop (`saving.js`)

- **`savingPlan` reads each person's stop from the household.** The field `people[].until` (`saving.js:120`), planned and
  never used, finally carries `S_j`. The `stopAge` argument stays for callers: it is the stop the answer is about, and
  it must agree with the household.
- **One growth pass per distinct stop.** `unitKernel` is keyed by (plan, S, lives). Each pass has its own
  `mixByYearOf(S_j, …)`, so the slide to the drawing mix reaches it at **that person's** stop. There are two passes when
  apart and one otherwise. `kernelPasses` counts per distinct stop.
- **Pay-ins and the charge** go in and come off until each person's own stop.
  - The charge is the household's one setting from 6.19.0 (`household.chargesPct`), taken while saving and while
    drawing, so it needs no special case here.
  - A person with `S_j = 0` gets the stop-now kernel `{ A: the pot, B: 0 }`, as today.
- **`savingRows` runs over the person's own `S_j`.**
- **There is no cache shared across A's rows.** A pass costs a few milliseconds at 1,000 lives, so a shared cache would
  buy nothing and would need a size limit.

### 4.3 The drawing years: each run starts at its holder's stop (`toEngine.js`, `stopAt.js`)

**(a) Runs.**

- As today under A's and B's start (`start: 'asGiven'`), there is one run per person with money.
- Each run gets `offset = g_j`, and `years = duration = D − g_j`.
- Its drivers are the life read from that person's own stop: `prepareFutureFrom(life, 12·S_j, D − g_j)`
  (`fastEngine.js:236-260`).
  - These are the same calendar years and the same bond stream the first person sees in those months, with prices
    re-based at the run's start.
  - Pots and targets are at today's prices, so every run is in the same terms.
- No money arrives partway through a run, and there are no windfalls. The fast path has none
  (`fastEngine.js:184`), so this is the only cheap way to join money, and it is exact.
- This replaces `saving-years-engine.md` 3.6's plan, which treated the later stopper's earnings as `otherIncome` and did
  not count their pay-ins after the first stop.

**(b) Periods** stay on the household clock (years from `S0`), with one more cut at `G`.

- In a period where person j is still working (`from < g_j`), their `byPerson` is
  `{ working: true, statePension: 0, finalSalary: 0, work: 0, gross: 0, net: 0, locked: false }`.
- A State Pension or final-salary pension paid to them meanwhile goes with their pay (`pay-keeps-pensions`). That is the
  cautious side, and it avoids guessing tax on pay that is never asked.

**(c) The need from the pots.**

- `R = max(0, H × share − netTotal)`.
- `share = 1 − payCovers` while anyone is working, and 1 after.
- `netTotal` sums only the people who have stopped.

**(d) Who pays it.**

- `sharesOf` (`toEngine.js:97-106`) runs over the runs of **people who have stopped** only. A working person's run has
  nothing available yet.
- So does its fallback for when nothing at all is available.
- If no run of a stopped person has money, nobody draws:
  - under Half or All the pay covers it;
  - under "None of it" the household runs out in the first month apart, as `withoutRuns` already decides
    (`stopAt.js:167-170`).

**(e) The pay covers a shortfall (cover months).**

- The first stopper's run gets `coverMonths = 12·G` when `payCovers > 0`.
- Both run-out tests in `runFast` gain `&& month >= coverMonths`: the closed-pension branch (`fastEngine.js:400`) and the
  open branch (`:471-474`).
- In those months a shortfall is not a run-out. The pots go to nothing and the run carries on: a closed pension still
  opens later, and a State Pension still starts.
- From the second stop, a shortfall is a run-out, as today.
- "None of it" sets no cover months.
- `fastEligible` accepts an integer `coverMonths` from 0 to the run's months.

**(f) The hand-over at the second stop.** This is the one genuinely new piece.

Today a couple's pots are drawn in fixed shares, set by what each person has at the start. The household runs out the
moment either pot cannot pay its share, whatever the other holds (`tests/v7/c/exceptions.md`, engine behaviour 4).
With different stops that rule would overload the first person, who has been spending for G years. It would also undo
(e): a partner whose cash ran down before the second stop would keep a share set by their old balance, and sink the
household there.

So **at the second stop the shares are set again, on what each of you has then, in each future**:

- **At month `12·G` of the first stopper's run:**
  - their money then (sleeves plus ISA, divided by the run's price level `cumInf[G]`, which puts it at today's prices);
  - and the joiner's pots at their stop;
  - give the shares of every period from G on (the same `sharesOf`, the same closed-pension rule).
- **The first stopper's targets from G on are set there, inside the one run.** The tax-free allowance used so far, the
  floors and the remembered drawdown plan all carry on.
- **The joiner's config is built from the same shares**, and their run starts at their stop.

The mechanism:

- **The hook.** `runFast(config, pf, pr, start, hook)`, where `hook = { month, retarget(state) → schedule }`. At the top
  of `hook.month` it calls `retarget` once and reads the returned schedule from then on. It never mutates the config.
  The hook is a runner argument, not part of the config, so `fastEligible` is unchanged by it.
- **One entry per household.** For an apart household where both runs have money, `configsAt(plan, H, pots)` returns
  **one** entry, `{ who: 'both', index: -1, role: 'joined', config }`.
  - The stop runner's `run(r, i, config)` runs the first stopper with the hook, then the joiner.
  - It returns `{ failed, failMonth }` on the household clock: the earlier of the first stopper's failure and the
    joiner's failure plus `12·G`.
  - So `band.js runFuture` (`:72-84`), `createBandSolver`, `verdictAt`, `potNeeded` and the rest are unchanged.
- **Early exit.** Without `needMonth`, a failure of the first stopper after the join ends that life; the joiner is not
  run.
- **Any other run with an offset** (only one of you has money) is a plain run. The stop runner adds `12·offset` to its
  `failMonth`.
- **When one run has no money** there is nothing to set again: one run with money takes the whole share either way.
- **`simulate` is never handed** a run with cover months or a hook. `createFastRunner.run` refuses, as it already
  refuses a run with a closed pension (`fastEngine.js:533`).

**The pass-on after the second stop (the engine's call, 2 Oct 2026; built).** Shares set again on money alone, and a
household that runs out the moment either run cannot pay its share, were not enough. The reviewers found that a first
stopper who comes to the second stop with a small leftover (a few hundred pounds of savings, after the years apart spent
the cash down: this design's main case) keeps a share of its own, its savings run dry decades early while the other's
money (90–99.98% of the total) lasts to the end, and the household is counted as run out. So a life lasted at £2,740 a
month and ran out at £2,700; £5,000 more of savings lowered every amount; and £45,000 of savings between you added £10 to
the careful amount when the stops differed, against £60 when they did not. The rule now:

- **From the second stop, when one run's money runs out, the other's pays all of what the pots pay from that month.**
  The household runs out only when both have. (`toEngine.js` `passOnAt`: the survivor's schedules with all of the
  need, by the same rule for a pension still closed.)
- The stop runner runs the first stopper (with the hand-over at `12·G`, keeping a record of its state at the top of each
  month from then), then the joiner — with a hook at the first stopper's run-out month when that came first. When the
  joiner's money runs out first, the first stopper's run is **resumed from its record** at that month and pays all from
  then. A resumed run equals the run from the start with the hand-over and the pass-on as two hooks, bit for bit (I10):
  the record holds everything a month carries into the next, and the plan remembered within a year is planned again at
  every hook.
- A couple who stop in the same year keeps today's rule (`tests/v7/c/exceptions.md`, engine behaviour 4): their answers
  are 6.19.0's, figure for figure.
- Measured after it (2 Oct 2026): the reviewers' households are monotone over their whole band; £45,000 of savings adds
  £60–80 apart against £90 together and £100 in a pension (200 lives; before: £20–30); C and A agree to the pound on 236
  random staggered couples.
- **Left as it is (cautious, rare):** a run whose pension is still closed after the second stop, and whose own savings run
  dry before it opens while the other's money is open, stops there, so its pension is not counted afterwards (before the
  pass-on that was a run-out of the household). Measured at the careful amount on 321 made-up households of that shape
  (the first stopper 48–54 and closed after the second stop, the other open): 24 had such lives, 91 of 32,100 in all. A
  rule that kept a closed run's savings back while the other's open money paid was tried and lowered careful amounts by
  £10–40 (more tax on one pension), so it was not kept. A full answer needs the two runs side by side, month by month.

**(g) Pensions that cannot be touched yet are measured from each person's own stop.**

- `opensAt_j = firstOpenAge(age_j, today, S_j)` (`household.js:165-167`), so the 2028 change applies on each person's
  own date.
- The run's `lockedMonths = 12·(opensAt_j − (age_j + S_j))`.
- The household period is cut at `opensAt_j − (age_j + S0)`.
- `startAsGiven` (`household.js:211-226`) works out `lockedUntil` per person, from their own stop.
  `lockedUntil[].years` stays counted from the household start.

**(h) Incomes on each run's own clock.**

- The household's start years are unchanged, because they are age-based (`toEngine.js:150-151`).
- Each run's config subtracts its offset, floored at 0:
  - `spStartYear`;
  - `dbStartYear`;
  - `extraIncomes[].startYear` and `endYear`.
- Each run's `targetSchedule` and `lockedSchedule` are the household's from its offset: `schedule.slice(g_j)`.

**(i) The band's floor** (`guaranteedAtStartAYear`, `toEngine.js:285`):

- it is the least, over the periods the pay does not cover, of `netTotal / share`;
- under "None of it", it is taken over every period;
- `kMax` is unchanged, and a test checks that every life fails there.

**(j) What it is made of** (`breakdownAt`, `phasesAt`).

- While anyone works, each period carries:
  - `fromPay = H × payCovers`;
  - `byPerson[].working`.
- `shown.takeHome = fromPots + statePension + finalSalary + fromWork + fromPay`.
- **For the years after the second stop**, the first stopper's money at the hand-over is taken as the middling over
  the lives at that amount: one part-run of G years per life, once per amount shown.
- **`fromPay` and `working` are left out entirely, not set to 0, when G = 0.**

**(k) `contentKey`** (`toEngine.js:63-65`) gains the stop, **only when the stops differ**.

- That keeps the people in an order set by their content, so swapping "you" and "partner" gives the same runs.
- In a same-year household, the people's `key` strings and order stay exactly as today.

**(l) `stopAtPlan`** (`stopAt.js:63-106`) reads each person's stop from the household.

- `drawingPlan` (`:41-52`) no longer overwrites `stopWork` with `age + S`. It only puts in the pots.
- The drivers are kept per (life, offset), so there are two per life when apart.
- `T` is `S0 + D`, as today.

**(m) The pot needed** (`runnerAtPot`, `stopAt.js:245-247`) scales the pensions of **the people still saving**, each at
their own stop, split by their middling pots.

- The money of a person who has stopped stays as projected.
- When everyone is saving and stops together, it is today's arithmetic exactly.

### 4.4 The same year is today, bit for bit

When every `S_j` is equal:

- `G = 0`, so:
  - `untilBothStop` is absent;
  - there is no new cut;
  - `share` is 1, and `H × 1` is H exactly;
  - there are no cover months, no hook and no joined entry;
  - every offset is 0, so `slice(0)` and the drivers are the same calls.
- There is one saving pass.
- The `contentKey` strings are unchanged.
- The savings and monthly saving are split evenly, as today.

So every config, plan and result deep-equals today's. Section 9 proves this rather than arguing it.

---

## 5. Each question

### 5.1 C: "What is that a month?"

**What it asks.**

- Today's form.
- The partner's stop question (C's own wording).
- The pay line.
- The tax-free part under More detail.

**Which path answers it.**

| Start | Partner | Path |
|---|---|---|
| now | not answered, or `already` | `c/answer.js` as today, **byte for byte**: both have stopped now, as today's C-from-now household already says |
| an age | not answered | `c/onLives.js` as today, byte for byte |
| anything else | — | `onLives`, with each person's own stop |

`usesLives` (`c/onLives.js:45-54`) says yes for that last row. C's start is never moved for a stop the person gave.

**Nor for the partner's pay-in (2 Oct 2026).** "From now" is moved to the day a pension opens when someone still pays in
and no pension of the household can be touched yet (`movedToAccess`). With the partner's stop their own ("they already
have", or at an age), only YOUR paying in can move it: their pay-in runs to their own stop. Before this, "you from now"
with a partner still paying in turned you, who have stopped, into someone working until your pension opens, with "your
pay" covering half — and the link from A's "I've already stopped" opened C on £2,610 a month against A's £990.

**What it answers.**

- The careful amount is what the household can spend **once you have both stopped**. In the years apart, the pots pay
  `1 − payCovers` of it.
- **Either of you can be "you".** "You from now, your partner at 56" and "you at 56, your partner already stopped" give
  one figure.

**What changes in C's code.**

- `closedYearsOf` (`c/onLives.js:164-190`):
  - reads each pension's opening from its holder's own stop;
  - its "start at X instead" moves your start only;
  - `partnerUntil` is the partner's own age then.
- `partnerRetired` (`c/answer.js:216`) and the `both-stop-together` line (`c/sentences.js:486`) apply only when the
  partner question was not answered.

### 5.2 A: "When can I afford to stop work?"

**The person the answer is about** is `askedAbout(inputs)`: "you", or the partner when you chose "I've already
stopped". The sweep moves that person's stop only.

- The other person's stop is fixed.
- With "When you do", it moves alongside, as today.

**Each row (the asked person stopping at age a).**

- `S0(a) = min(a − age_asked, S_other)`.
- `lifeYears(a) = S0(a) + D(a)`.
- `fits(a)` checks the later stop against the end. This replaces `a/answer.js` `fits` and `lifeYears`.

**Facts.**

- Paid-in figures are per person, over their own years (`rowOf`, `paid`).
- `opensOf` (`a/answer.js:78-86`) uses each person's own stop.
- `gapYears` keeps its meaning: the years until a pension opens, after you have both stopped.
- Row `ages` gives each person's own stop age.
- "One more year" is for the asked person.

**Words.** See 2.4.

- The chart's axis reads "Your partner's stop age" when the answer is about them.
- `partnerRetired` (`a/sentences.js:103`) applies only when the partner question was not answered.

### 5.3 B: "Am I saving enough?"

- **The asked person must still be working.**
  - With you still working it is `stop-after-now`, as today.
  - With you stopped it is `partner-stop-after-now`.
- **The number** is the pensions of the people still saving, each at their own stop (4.3 m).
- **The pay-in that gets there:**
  - is shared among the people **still saving**, by today's ratio, or evenly among them when nobody pays in now;
  - is never given to a partner who has stopped. This fixes `b/answer.js:248`, where the even split would give half to
    them;
  - goes in until each person's own stop;
  - has a ceiling of £10,000 a month times the number still saving.
- **The savings that carry the closed years** (`outsideOf`, `b/answer.js:94-102`) are measured from the second stop,
  because before it the pay covers. Under "None of it" they are measured from the first stop.
- **The grid** (`gridToShow`, `schemaParts.js:198-218`) has the asked person's stop ages as rows.
  - The other's stop is fixed, or moves alongside.
  - The stop-later lever is the asked person's.

### 5.4 Shared rules (`schemaParts.js`)

- **Per person, each at their own stop:**
  - `startBeforeEveryPension` (`:228-236`);
  - `payingInPast75` (`:262-267`);
  - `handOverToC` (`:276-287`).
- **`handOverToC`** carries `partner.stop.*`, `untilBothStop` and `taxFreeTaken`. C now asks all three, so `same` stays
  true.
- **`alreadyStopped`** (`:294-299`) is also true when both have stopped (2.2).
- **Carrying between questions** (`src/v7/state/carry.js`):
  - the new paths go into `HOUSEHOLD`;
  - A's and B's "I've already stopped" carries to C as `start.kind: 'now'`, a mapped entry;
  - **and back (2 Oct 2026):** C "from now" with the partner stopping at an age carries to A and B as "I've already
    stopped", the partner at that age with their pay-in, opening on the numbers with no box focused
    (`CARRY_C_YOU_STOPPED`). C's "What next?" then asks "Your partner still working?" with "When could my partner afford
    to stop?" and "Is my partner saving enough for this?".
- **A, about your partner shown stopping now** (their age today, which A accepts: "could my partner stop now
  instead?"): "Is my partner saving enough for this?" is not offered, because B refuses a stop of today
  (`partner-stop-after-now`); the C link stays.

---

## 6. Save as a plan: seed version 2

### 6.1 The seed (`src/answers/keep/planSeed.js`)

- **`SEED_VERSION` becomes 2.** It is the same value in `services/PlanSeed.js:54`.
- **`checkSeed` accepts 1 and 2.**
  - A version 1 seed is read as version 2 with each person at `seed.stop`, so a tab opened before the deploy still
    works.
  - A planner that knows only version 1 refuses version 2 rather than making a wrong plan. It would otherwise reject a
    partner whose `ageAtStop` is not their age today (`PlanSeed.js:165`).
- **Each person gains:**
  - `stop: { kind: 'now' | 'later', yearsFromNow }`: their own stop;
  - `ageAtStop`: their own (version 1 used the household's);
  - `years`: their own, `= seed.years − g_j`, so both plans end in the same tax year;
  - `taxFreeQuarter` from `taxFreeTaken`. This replaces the fixed `true` at `keep/planSeed.js:148`.
- **The seed gains `untilBothStop: { payCovers } | null`.**
- **`seed.stop` and `seed.years` stay the household's** (first stop, `D`).
- **`waitOf`** (`keep/planSeed.js:62-70`) becomes per person.
- **`takeHomeOf`** (`:76-89`) skips phases where the person is `working`. So the first stopper's rows for the years apart
  are their part, and the worker's rows start at their stop.

### 6.2 The plans (`src/services/PlanSeed.js`)

**`planFor`** reads `p.stop`, not `seed.stop` (`:434-520`):

- `retired`, `retireAge`, `firstTaxYear` and `duration = p.years` come from the person's own stop. Each plan starts at
  its own stop, and **both end in the same tax year** (`save-as-plan.md`'s "end in the same year" still holds).
- A later stopper gets `potAtRetirement` as their middling pot at their own stop. They also get the saving section
  until then (`:503-512`), as today's single-stop plan does.
- **Savings between you** go into the first stopper's plan (`savings-first`). A same-year couple's are split evenly, as
  today.
- **Charges**: unchanged (6.19.0, `:494-495`). The answer's one charge goes into both linked plans' `chargesPct`.

**`budgetFor`** (`:336-361`):

- `retired` is per person;
- `partnerRetired = other.stop.kind === 'now'`;
- `partnerRetirementAge = other.ageAtStop`.

**Words.**

- **`seedSummary`**: "You stop at 60 and your partner at 62, £3,200 a month once you've both stopped, …", or "You
  from now and your partner from 56, …".
- **`coupleWords`** (`:398-404`) gains: "Until your partner stops at 62, this plan pays its part of half of what you
  spend; their pay covers the rest. Their plan begins when they stop." Its savings sentence reads "Your savings between
  you are in this plan, because you stopped first."
- **`differenceWords`** is per person.

---

## 7. Today's Household tab

**Already right, with no change to how it works out the figures:**

- `startOffset` lines up calendar years.
- `runHouseholdMonteCarlo` shifts each plan's market path by its offset (`HouseholdService.js:32-49`).
- `householdIncomeTimeline` counts a working partner's need and State Pension as £0 until their plan starts
  (`:134-138`).

That is the same rule as V7's, because the seed puts the half paid by the one who stopped into their own plan.

**Words only** (`index.html`, beside the joint result, around `:10754`), when a plan starts later than the other:

> Your partner's plan begins in 2027/28, when they stop work. Until then their pay covers their part, and what they pay
> in is in that plan's pot at the start. Before then, the chart shows their pot as it is expected to be when they stop.

**Left as it is:**

- The years before a stop are not varied in today's planner. Each plan's description already says so.
- The note that contract strategies are not year-shifted (`index.html:10726`).

---

## 8. The 0.5% charge

This was decided on 1 October, and is being built as 6.19.0 (`research/charges-setting.md`). Couples need nothing
special from it:

- **V7 has one charge for the household** (`household.chargesPct`), for both people, in both phases. Each person's
  saving pass takes it until their own stop, and each run takes it from its own start.
- **In the planner each linked plan has its own setting.** The seed writes the answer's charge into both.

**Order.** Charges land first, then couples, so that the couples identity tests compare against the engine with charges.

---

## 9. Tests

### 9.1 Today, bit for bit

- **I1.** Every fixture and named state: A2-couple-before-57, B5-couple, F2-couple and every single-person one.
  - Every figure, every word and every input key is unchanged.
  - No fixture or state carries the `partner-stops-with-you` note today (checked 1 Oct 2026). Its added sentence
    therefore changes only R16's test (9.8).
- **I2.** `partner.stop.kind: 'age'` with `age = partner.age + S` gives the same household, and every figure, as not
  answering. These are two routes to one answer.
- **I3.** C from now with the partner `already` equals C from now with the question not answered, figure for figure —
  with one exception (settled 2 Oct 2026): where "from now" is moved to the day a pension opens (you still paying in,
  every pension closed today), "they already have" means your partner stopped now and you start at that day, so the
  answer is the apart one (each at their own stop); not answered, both start then.
- **I4.** Same-year households through the new code give `enginePlan`, `configsAt`, `stopAtPlan` pots and
  `breakdownAt` that deep-equal a frozen copy of today's adapter, over random households.
  - The frozen copy is `tests/v7/shared/sameYear.v1/`, deleted one release later.
  - `speed.identity` (fast path against `simulate`) is unchanged.
- **I5.** A joining run with offset g equals the stand-alone run at its own stop, given the same config:
  `simulateFastFrom(config, prepareFutureFrom(life, 12·S_j, D − g))`, with `failMonth + 12g`.
- **I6.** When no cover month is short, a run with `coverMonths > 0` equals the same run without them, bit for bit.
- **I7.** The hook changes nothing but the targets. A joined run equals the same run with the schedule the hook returned
  written in beforehand, bit for bit.
- **I8.** The years after the second stop equal a chain of `simulate`:
  - the first stopper to month `12·G`;
  - then a same-year household starting there on the money the run left, with floors re-based as
    `tests/v7/saving/chain.mjs` already does for a closed pension.
  - It is exact with an all-shares mix and the tax-free part already taken, so there is no allowance to carry.
    Otherwise only determinism is asserted.
- **I9.** One person is untouched.
- **I10 (2 Oct 2026).** The pass-on: the household runs out at the later of the two run-outs; a run resumed from its
  record equals the run from the start with the hand-over and the pass-on as two hooks, bit for bit; hooks that change
  nothing, a record and a resume change nothing. I8 then holds up to the first run-out after the join.

### 9.2 Exact checks in a flat world

These use `env.futureReturns` with no returns, flat prices, savings growth of 0 and a 0% charge.

- **C1.** A stopped partner with savings only, G years apart, on Half: their savings at the join are
  `savings − 12·G·max(0, H/2 − their guaranteed income after tax)`, floored at 0.
- **C2.** On All, the stopped person's money is untouched, and the answer equals the same-year answer at the later stop
  with those pots.
- **C3.** On None, with nothing that can be touched: a run-out in the first month apart.
- **C4.** A stopped partner with a closed pension and no savings, on Half: no run-out before the join, and the answer
  equals All.
- **C5.** The worker's pot at their stop equals the last `potEnd` of `savingRows` at their own `S_j`.
- **C6.** A partner with no pots and nothing paid in: `already` equals `same`, on Half or All, when the 45-year cap does
  not bite.
- **C7.** The hand-over: after the join, the shares equal each run's money then over the total. Checked against
  `sharesOf` fed the run's own state.

### 9.3 Properties (generated households)

Each is held to one £10 step and reported, not asserted, at £10,000 a month or more. This is the rule
`tests/v7/c/exceptions.md` sets, because the engine is not monotone at the £10 grain.

- **P1.** More money for either person never lowers the careful amount. On Half or All, moving the later stop later
  never lowers it either.
- **P2 (swap).** Swapping "you" and "partner", with their stops, leaves C's careful amount, A's verdicts and B's number
  unchanged.
  - In A and B this means "I've already stopped", with the partner at 56, equals the partner already stopped with you
    at 56.
  - The words differ only by who.
- **P3.** The careful amount under None ≤ under Half ≤ under All.
- **P4.** Zero years apart, by any route, equals today.

### 9.4 Questions agree

- **X1.** C at an age, with the partner at a given stop, equals A's row at that age to the pound
  (`tests/v7/cross/oneTest.test.js`).
- **X2.** B's verdict at today's pay-ins equals A's at the same stops.
- **X3.** B's pay-in that gets there, fed into A, lasts.
- **X4.** The hand-overs from A and B to C carry `partner.stop.*`, `untilBothStop` and `taxFreeTaken`, and C shows A's
  careful figure.

### 9.5 Inputs

- `stop-together` is gone: flip `tests/v7/saving/stopAt.test.js:344-345`.
- Every new rule has a boundary test: `partner.stop.age` equal to their age now, equal to 75, and at the end.
- `whenNot` and list `when` are covered, and the one exported `applies` is used by the screen and by `checkScreen.js`.
- The checked inputs of every fixture keep the same keys (no new defaults).

### 9.6 Saved plans

- **K1.** A version 2 round trip. A version 1 seed is still accepted, and is read as the same stop for both.
- **K2.** The two plans end in the same tax year, and each starts at its own stop.
- **K3.** The budget flags are per person.
- **K4.** The `ageAtStop === ageToday` check applies per person.
- **K5.** Savings go into the first stopper's plan when apart, and are split evenly otherwise.

### 9.7 Today's planner and the browser

- **H1.** The Household tab words appear when the offsets differ, and not otherwise (`tests/indexMarkup.test.js`).
- **B1.** Two named states, `numbers-apart` and `answer-apart`, built from the generic case above: one has stopped and
  draws now; the other is in their mid-fifties and stops next summer.
  - B1 checks they give the same figures with either of them as "you".
- **B2.** A journey: fill A as the one who has stopped, see "Yes — your partner could stop at …", save it as a plan, and
  see both plans in today's planner, each starting at its own stop.

### 9.8 Pinned tests that change on purpose

- `tests/v7/saving/stopAt.test.js:344-345`: an apart saver household is now valid.
- `tests/v7/cross/reviewRound3.test.js:325-333` (R16): the note's added sentence.
- `tests/v7/a/invariants.js:336` and the couple line of `tests/v7/b/invariants.js`: `stop-together` only when the partner
  question was not answered; otherwise `stop-apart`.
- `tests/v7/household.test.js:113-117`: stays as it is, because it is the not-answered case. New cases are added beside
  it.

---

## 10. Speed

The budgets are unchanged (step 4 brief, decision 17), with the processor slowed four times:

- first figure: 3 s;
- the answer step's final figure: 15 s;
- an optional step: 30 s more.

What an apart couple costs, per life and amount, compared with the same couple stopping together:

| Work | Same year (today) | Apart |
|---|---|---|
| Engine runs | 2 runs of D years | 1 run of D years + 1 of D − G years (**fewer months**) |
| Hand-over | — | one `sharesOf` and one schedule (a few hundred operations) |
| Saving passes | 1 | 2 (a few ms each at 1,000 lives) |
| Drivers | 1 per life | 2 per life |
| What it is made of | — | G years of one run per life, once per amount shown |

**Targets.**

- **A work bound, checked on every push (it does not depend on timing):** engine months per answer for an apart couple
  are no more than for the same couple stopping together. They are counted by the stop runner, as `evaluations` is
  today. With the pass-on (2 Oct 2026) one evaluation is at most `12·(2D − G) + 1` months (the resumed rest of the first
  stopper's run, from the month the joiner's money ran out, which is counted in both) — still under the same couple's
  `24D` — and exactly `12·(2D − G)` when neither runs out.
- **A timing check (`speed.apart.slow.test.js`, nightly):** at 1,000 lives in Node, each answer step for an apart couple
  takes at most 1.10 × the same couple stopping together (the median of three runs).
- **A's every-age step** for an apart couple is no slower than for the same couple stopping together. A4 (one person,
  already at its 30 s budget) is untouched.

---

## 11. The build, in packages

The packages are listed in order. **Each file belongs to one package only.** Charges (6.19.0) land first.

**P0: the inputs and the household.** Nothing here touches the engine.

- `src/answers/shared/validate.js`: list `when`, `whenNot`, and the exported `applies`.
- `src/answers/shared/schemaParts.js`:
  - `partnerStopFields(question)`, `untilBothStopField()`, `taxFreeFields(question)`;
  - `whenNot` on the pay-in blocks;
  - the per-person rules, `handOverToC`, `alreadyStopped`, and `askedAbout(inputs)`.
- `src/answers/a/schema.js`, `src/answers/b/schema.js`, `src/answers/c/schema.js`.
- `src/answers/shared/household.js`:
  - `stopsOf`;
  - `expandHousehold`: `both-stop-together` only when not answered, `savings-first`, the `untilBothStop` pass-through;
  - `validateHousehold`: `stop-together` dropped, `end-after-start` at the later stop;
  - `startAsGiven` per person.
- `src/answers/a/toHousehold.js`, `src/answers/b/toHousehold.js`, `src/answers/c/toHousehold.js`.
- `src/answers/shared/contract.js`: the new fields and result fields, as types.
- Tests:
  - `tests/v7/household.test.js`, `tests/v7/shared/validate.test.js`;
  - `tests/v7/a/toHousehold.test.js`;
  - `tests/v7/a/schema.test.js`, `tests/v7/b/schema.test.js`, `tests/v7/c/schema.test.js`.

**P1: the engine.** The identity tests are written first and must pass before any figure moves.

- `src/answers/shared/saving.js`, `src/answers/shared/stopAt.js`, `src/answers/shared/toEngine.js`,
  `src/answers/shared/fastEngine.js`. (`band.js` is unchanged.)
- Tests:
  - `tests/v7/saving/*`, including `stopAt.test.js` and a `chainJoin` beside `chain.mjs`;
  - `tests/v7/c/speed.identity.test.js` and `tests/v7/c/speed.identity.slow.test.js`;
  - new `tests/v7/shared/apart.identity.test.js` (I4–I8, with `sameYear.v1/`);
  - new `tests/v7/shared/apart.closedForm.test.js` (C1–C7);
  - new `tests/v7/shared/speed.apart.slow.test.js`.

**P2: the three answers and their sentences.** It needs P0 and P1.

- `src/answers/a/answer.js`, `src/answers/a/sentences.js`.
- `src/answers/b/answer.js`, `src/answers/b/sentences.js`.
- `src/answers/c/answer.js`, `src/answers/c/onLives.js`, `src/answers/c/sentences.js`.
- Tests: each question's `invariants.js`, `properties.test.js`, `metamorphic.test.js` and sentence tests, for A, B and C.

**P3: the screens, the words and the shell.** It needs P0. It joins P2 for the answer screens.

- `src/v7/copy/a.js`, `src/v7/copy/b.js`, `src/v7/copy/c.js`.
- `src/v7/components/Field.jsx`, `src/v7/components/PersonBlock.jsx`, `src/v7/components/Retired.jsx`.
- `src/v7/screens/a/*`, `src/v7/screens/b/*`, `src/v7/screens/c/*`: the second headline line and the chart axis.
- `src/v7/state/select.js` (both stopped), `src/v7/state/carry.js`.
- Tests: `tests/v7/render/checkScreen.js`, `tests/v7/screens/*`, `tests/v7/wording/*`, `tests/v7/shell/carry.test.js`.

**P4: saved plans and today's planner.** It needs P2's result fields.

- `src/answers/keep/planSeed.js`, `src/services/PlanSeed.js`, `src/answers/shared/planName.js`.
- `index.html`: the Household tab's words only.
- Tests: `tests/planSeed.test.js`, `tests/planSeed.v7.test.js`, `tests/v7/keep/*`, `tests/indexMarkup.test.js`.

**P5: the questions together, the browser and the release.** It joins everything.

- Tests: `tests/v7/cross/*`, `tests/v7/fixtures/*` and `tests/v7/states/*` (the new apart fixtures and the two named
  states), and the browser journey B2.
- `src/releases.js`, `package.json`: 6.20.0, a minor release, so the note pops up once.
  - The note says that the quick answers now take each of a couple at their own stop.
  - It says that plans saved from them begin at each person's stop.
  - It says that saved plans are unchanged.

---

## 12. A fact to check before building

**The 2028 rise in the pension age, for someone already drawing at 55 or 56.** The code holds two rules that disagree:

- `rules.js` `firstAccessAge`: 55 for anyone who is 55 before 6 April 2028. It is used for the saved plan's
  `pensionOpensAge` and for `accessRiseAffects`.
- `household.js` `firstOpenAge`: judged only on the stop date. A pension open then is never closed again.

**What needs checking.**

- Whether someone without a protected pension age who starts drawing before 6 April 2028, and is under 57 on that day,
  must stop drawing until 57. Check against the Finance Act 2022 and HMRC's Pensions Tax Manual.
- If they must, the rule belongs in one place (`firstOpenAge`). It needs a closed stretch partway through a run, which
  the fast path cannot do today.
- That is a separate piece of work, because it touches people who stop alone too.

The generic case above (stopping next summer at 56) is touched by a few months at most, which whole years do not show.

**Checked 1 Oct 2026** (HMRC pension schemes newsletter, April 2026, as reported by AJ Bell and Royal London): someone
aged 55 or 56 on 6 April 2028 without a protected pension age who has already moved money into drawdown before that
day may keep taking income from it. They may NOT crystallise anything new — no more money into drawdown, no tax-free
cash, no UFPLS, no new annuity or final-salary pension — until 57. This is published guidance on the planned change,
not yet seen in legislation; re-check before 7.0. For the model: a pension opened before 6 April 2028 stays open for
the money already in drawdown, so `household.js` `firstOpenAge` (open at the stop, never closed again) is right for a
plan that moves the whole pot into drawdown at the stop; the answer should add one line when a person's stop falls
before 6 April 2028 at 55 or 56: "Move into drawdown what you will need before 57 by 5 April 2028: after that, nothing
new can be taken until you are 57."

**Where the line shows (built, 6.20.0) — an owner's decision left open.** It is one of the warnings of a couple who stop
in different years (`apart.js` `apartWarnings`), so it shows only when the two stops differ. Someone aged 55 or 56 who
stops now — one person, a couple stopping together, or "I've already stopped" with the partner stopping now — gets no
line, although the rule applies to them and bites harder at 55. Adding it there changes today's words, which this
work's identity rule forbids. Owner: keep it to couples apart (and say so), or ship it for everyone 55 or 56 on 6 April
2028 as a deliberate, noted change in a release of its own.

---

## 13. Left out on purpose

- Asking the worker's pay, or their National Insurance.
- Stops to the month. Decision 10 stands: "next June" is entered as the age then.
- Someone who has stopped choosing when to start drawing, beyond Half, All or None.
- Tax-free cash taken in part.
- A partner dying. Today's planner has the survivor check.
- Part-time work for the partner.
- Savings split by who owns them.
- Varying the years before a stop in today's planner, or drawing the Household chart's pot rising before a plan
  begins.
- A "your partner's stop age" lever under Try a change (`screens-A-B.md:703-720`). It is the next small step once this
  lands.

---

## Questions for the owner

1. **While one of you is still working, how much of what you spend does their pay cover?**
   I recommend half by default, with "All of it" and "None of it" one tap away under the question. With "All of it" as
   the default, the money of the one who has stopped is left alone until you have both stopped, so answers come out
   higher. With "None of it", their money pays everything from the first stop, so answers come out lower, and often
   "no" for anyone who stopped early. Asking for the worker's take-home pay instead would be more exact, but every such
   couple would have one more figure to type.

2. **If the one who has stopped cannot pay their part before the other stops, does the other's pay make up the
   gap?**
   This happens when their pension cannot be touched yet, or their cash runs out. I recommend yes: the worker's pay
   makes up the gap, and the answer says so, with the age it happens in a bad case. If you would rather count it as the
   money running out, someone who stopped at 53 with little cash would see "no", however much is waiting in their
   pension. Anyone who wants that strict reading can already have it by choosing "None of it".

3. **If you have already stopped and your partner hasn't, should "When can I afford to stop work?" and "Am I saving
   enough?" answer about your partner?**
   I recommend yes: the stop question gains "I've already stopped", and the answer reads "Yes — your partner could stop
   at 56". If not, the person has to enter themselves as the partner and their partner as "you", and any plan they save
   comes out with the names the wrong way round. The other way out is to keep these two questions for the one still
   working only.
