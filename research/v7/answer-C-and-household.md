# V7 — the household input model, and the answer contract for question C

Spec only. Nothing here is built. Written 30 Sep 2026 against v6.15.0 (`schemaVersion` 1).
Sources: `research/v7-plan-of-plans.md` (sections 1–8), `product-plan.md` Part 1, the workflow inventories
(engine, tests, shell, gap matrix W27/W32/W44–W47, research scenarios S16, M1, M2), and the code read for this
document: `src/strategies/stressTest.js`, `src/storage/StressRepository.js`, `src/services/HouseholdService.js`,
`src/services/SimulationEngine.js`, `src/services/DrawdownStrategy.js`, `src/services/BudgetModel.js`,
`src/services/GlidepathService.js`, `src/utils/StatePensionUtils.js`, `src/services/PlanTiming.js`,
`src/storage/schema.js`, `src/storage/migrations.js`, `src/firebase/scenarioMigration.js`.

Every number in section 2.10 came from a scratch script that calls the existing engine unchanged
(`simulate`, `bootstrapPaths`, `annualNominal`, `planDrawdown`, `createSimulationConfigFromSettings`,
`planFromSettings`, `stressTestStrategy`). The script is not in the repository.

Contents

1. The household and guaranteed-income input model
2. The answer contract for question C
3. Decisions for the owner, and open questions

---

## 1. The household and guaranteed-income input model

### 1.1 Rules the model follows

- **One model for every door.** A, B, C, D and E all take the same `Household` object. A door may ignore fields
  (C ignores spending), but no door adds its own shape.
- **Ages and dates, never position in the plan.** The person says "from age 60" or "June 2027". Converting to the
  engine's year numbers happens in one adapter and nowhere else.
- **Tax is per person; spending and the answer are per household.** UK tax and pensions are individual, so the
  engine keeps running one person at a time (as `HouseholdService` does today). The household layer sits above it.
- **A single person is a household of one.** There is no separate single-person path to keep in step.
- **Short form and full form are the same object.** The short form fills a few fields and the rest take named
  defaults. Every default that was used is reported back in the answer's "what we assumed" list.
- **Take-home money in today's prices** is the unit for spending and for every answer. The engine's target is
  a before-tax figure; the adapter converts with the existing `netToGross` / `grossToNet`.
- **Pure and clock-free.** Every function takes `now` as an argument. Nothing reads the wall clock, storage
  or the screen.

### 1.2 The full form

Written as a type sketch. `?` marks an optional field; the default is in section 1.4.

```
Household {
  inputVersion: 1
  people: [Person] | [Person, Person]        // 1 or 2; order carries no meaning (see 2.9, swap rule)
  spending: Spending                         // not used by C; used by A, B, D
  planToAge: number                          // default 95; for a couple: until the YOUNGER person is this age
  portfolio: Portfolio
  strategy: { id: string }                   // default 'steady' (see 1.6)
}

Person {
  label: string                              // "You", "Your partner", or a first name
  born?: { month: 1–12, year: number }       // preferred
  age?: number                               // allowed instead of born; whole years today
  stopWork: { kind: 'already' }
          | { kind: 'date', month, year }
          | { kind: 'age', age }
  pots: Pots
  statePension: {
    amountPerYear: number                    // today's prices; default the full new State Pension
    startAge: { years, months }              // derived from born (1.5); editable
    startDate?: 'YYYY-MM-DD'                 // from a forecast letter; wins over startAge when given
    source: 'default' | 'entered'
  }
  finalSalary: [ {
    label?: string
    amountPerYear: number                    // before tax, today's prices, at startAge
    startAge: number
    increases: 'prices' | 'pricesCapped5' | 'none'
  } ]
  otherIncome: [ {                           // part-time work, rent, an annuity already bought
    label: string
    amountPerYear: number                    // before tax, today's prices
    fromAge: number
    toAge: number | null                     // null = for life
    kind: 'work' | 'other'
  } ]
  pensionTaxFreeCash: 'notTakenYet' | 'alreadyTaken'   // default 'notTakenYet'
}

Pots {
  total?: number                             // the single-total shortcut; treated as pension (1.4)
  pension?: number                           // all money-purchase pensions added together
  isa?: number
  otherSavings?: number                      // investments outside a pension or ISA
  cash?: number                              // bank and building society savings
}

Spending {
  kind: 'amount', perMonthTakeHome: number
| kind: 'lifestyle', level: 'minimum' | 'moderate' | 'comfortable'   // PLSA_2024 in BudgetModel.js
| kind: 'budget'                                                     // read from the plan's Budget
}

Portfolio {
  kind: 'risk', level: 'cautious' | 'balanced' | 'adventurous'       // RISK_PRESETS in GlidepathService.js
| kind: 'funds', funds: [ { ticker, name, pct } ]                    // the INTENDED retirement portfolio
}
```

Notes on the choices.

- **`pots` is the money to plan with, as amounts.** It is a pot size, not a list of holdings. "What you hold"
  stays the separate record (`scenario.holdings`), by the owner's ruling of 16 Sep. `Portfolio.funds`, when
  given, is the portfolio the person intends to retire on. Neither is ever copied into the other by this model.
- **`finalSalary` is a list** because people often have two (an old scheme and a current one). The engine's
  single `dbAmount` slot takes the first; the rest go through `extraIncomes`, which has the same rules.
- **`otherIncome.kind: 'work'`** exists so later doors can treat earnings differently (National Insurance, pension
  contributions while working). The first slice taxes it as ordinary income and says so.
- **`stopWork`** belongs to the person. The household's start is derived (1.5).
- **No sex or health field.** `planToAge` is one visible number with a default; `LongevityModel` can suggest a
  value later without changing the shape.

### 1.3 The short form

The questions asked first. Wording is proposed user-facing text.

**One person — five fields**

| # | Asked as | Fills |
|---|---|---|
| 1 | "How old are you?" | `age` |
| 2 | "Have you stopped work?" — Yes / No, I plan to stop at age __ | `stopWork` |
| 3 | "Roughly how much have you got in pensions and savings?" — one box, with "Split it up" beneath | `pots.total` (or the four boxes) |
| 4 | "Do you have a final-salary pension?" — No / Yes: £__ a year from age __ | `finalSalary[0]` |
| 5 | "How much risk are you comfortable with?" — Cautious / Balanced / Adventurous | `portfolio` (Balanced pre-selected) |

**A couple — the same five, plus four**

| # | Asked as | Fills |
|---|---|---|
| 0 | "Is this for you, or for two of you?" | `people.length` |
| 1b | "How old is your partner?" | `people[1].age` |
| 3a | "Your pensions" | `people[0].pots.pension` |
| 3b | "Your partner's pensions" | `people[1].pots.pension` |
| 3c | "ISAs and other savings between you" | split evenly (1.4) |
| 4b | Final-salary pension: a "whose?" choice on the same row | `people[n].finalSalary[0]` |

So a couple answers nine things: four more than a single person, plus a "whose?" choice on the final-salary row.
The plan of plans estimated five extra fields.
A couple is asked for pensions separately because that is what each person's statement shows, and because whose
name the pension is in changes the tax (two allowances or one). ISAs and savings are tax-free to draw, so one
joint figure is enough to start.

Question C does not ask for spending. Doors A, B and D add one more question: "What do you spend a month?" with
"I don't know — pick a lifestyle" beneath (Minimum / Moderate / Comfortable, single or couple figures from
`PLSA_2024`).

Every field has an "Answer in more detail" link that opens the full form at that field. Going into detail and
coming back never loses what was entered.

### 1.4 How the short form becomes the full form

`expandHousehold(short, now)` returns the full form plus `assumed[]`, one entry per default used. Each entry has
an id, the plain sentence shown to the person, and the field it can be changed at.

| Field | Default when not given | Sentence shown | Why this default |
|---|---|---|---|
| `born` | From `age`: the birthday is taken to be today | — (not shown) | Age only fixes the year; the next rows state what follows from it |
| `statePension.startAge` | From `born` by the rules in 1.5 | "Your State Pension starts at 67." | Law |
| `statePension.amountPerYear` | The full new State Pension, £241.30 a week in 2026/27 (£12,548 a year) | "We've assumed the full State Pension of £1,045 a month. Check your forecast on gov.uk and change it if yours is different." | Most people; stated plainly because many get less |
| `pots.total` given | All of it is treated as pension money | "We've treated all of it as pension money." | The cautious choice: pension withdrawals are taxed, ISA money is not |
| Couple's "ISAs and other savings between you" | Half each, as ISA | "We've split your savings evenly between you." | Tax-free either way, so the split barely matters |
| `pensionTaxFreeCash` | `notTakenYet` | "A quarter of each pension withdrawal is tax-free." | True for an untouched pot; someone already drawing can switch it |
| `finalSalary[].increases` | `pricesCapped5` | "Your final-salary pension rises with prices (up to 5% a year)." | The commonest scheme rule; matches the engine default |
| `stopWork` for a partner | Same as person 1's start | "We've assumed you both stop at the same time." | Short form asks once |
| `otherIncome` | None | — | |
| `planToAge` | 95 | "We've planned for the money to last until you are 95." (couple: "until the younger of you is 95") | A cautious age, visible and editable; `LongevityModel` can suggest another |
| `portfolio` | `balanced` (50% shares, 40% bonds, 10% cash) | "Invested half in shares, the rest in bonds and cash." | The middle preset |
| `strategy` | `steady` | "You take the same amount every month, rising with prices." | See 1.6 |
| `spending` (A, B, D) | `lifestyle: moderate` only if the person picks it; never silently | — | A spending figure is never invented |

The short form never blocks: a person who fills only age and pot gets an answer.

### 1.5 Values derived from the model

All in one pure module, each taking `now`.

**State Pension age from date of birth** — `statePensionAge(born)`:

| Born | State Pension age |
|---|---|
| Before 6 April 1960 | 66 (anyone this old has already reached it) |
| 6 April 1960 – 5 March 1961 | 66 and 1 to 11 months (one month later for each month of birth) |
| 6 March 1961 – 5 April 1977 | 67 |
| 6 April 1977 – 5 April 1978 | between 67 and 68 (the legislated timetable) |
| From 6 April 1978 | 68 |

With month and year only, a birthday that falls in a changeover month takes the later age (the cautious side).
When only `age` is given, the birthday is taken as today, so a person of 66 today is treated as already
receiving it. `startDate` from a forecast letter overrides everything.

**Earliest age a pension can be touched** — `pensionAccessAge(born, onDate)`: 55 before 6 April 2028, 57 from
that date. The function answers for a date, so someone who is 55 in 2027 and 56 in April 2028 is handled
correctly (access, then no access until 57).

**The household's start** — `householdStart(household, now)`: the later of today and the earliest `stopWork` among
the people. Year 0 of every engine run is the twelve months from that date. A person who stops later than
the start has their earnings in `otherIncome` (`kind: 'work'`, `toAge` = their stop age); the short form does
not ask for this and assumes both stop together.

**Each person's age in each year**, the year each State Pension and final-salary pension starts, and the share of
the first year it is paid for. These come from the same adapter that builds the engine input (1.6), so the
answer and any saved plan always agree. The scratch run showed why this matters: the same person solved with
"State Pension for the whole of its first year" and then run through today's saved-plan path (which pays 52% of
it in the first year for a 30 September birthday) went from 1 future in 10 failing to 1.2 in 10.

**Household years to run**: `planToAge` minus the younger person's age at the start, capped at 45 (the engine's
limit in `planFromSettings`). Under 50 at the start, the cap bites and a warning says so.

### 1.6 How the model maps onto today's engine

One adapter: `toEngine(household, takeHomePerYear, now)` returns one engine config per person who has money to
draw, plus the household timeline used for the breakdown. It produces exactly the flat config that
`createSimulationConfigFromSettings` produces today, so everything downstream (`planFromSettings`,
`stressTestStrategy`, the worker) is unchanged.

**The household target, split between people.** For each year *y* (today's prices):

1. Each person's guaranteed income before tax: `G_i(y)` = State Pension + final-salary pensions + other income
   active at their age that year.
2. Each person's guaranteed take-home: `grossToNet(G_i(y))` with their own allowance.
3. What the pots must provide: `R(y)` = the household take-home target minus the sum of step 2, never below zero.
4. Each person's share of `R(y)`: fixed at their share of the household's money at the start
   (`w_i` = their pension + ISA + savings, over the household total).
5. Each person's engine target for the year: `netToGross(step 2 + w_i × R(y))`, written into `targetSchedule[y]`.

The engine then does what it does today: fills the basic-rate band from the pension, tops up from savings and
ISA, pays the tax, and reports failure in the month a withdrawal cannot be met.

**Field by field**

| Model field | Today's setting (`stressTool.settings`) | Engine config key | Conversion |
|---|---|---|---|
| `pots.pension` × risk mix | `equityMin`, `bondMin`, `cashTarget` | `equityStart/Min`, `bondStart/Min`, `cashStart/Target` | pension × the preset's shares (Balanced: 0.50 / 0.40 / 0.10) |
| `pots.isa` | `isaBalance` | `isaBalance` | as is |
| `pots.otherSavings` + `pots.cash` | `taxableStart`, `taxableMix` | same | sum; mix = the risk preset for savings, `cash` for cash, weighted when both |
| `pots.total` | as `pots.pension` | | |
| `born` / `age` | `currentAge`, `currentAgeAsOf` | via `deriveTiming` | age today and the date it was true |
| `stopWork` | `retired`, `retireAge`, `firstTaxYear`, `shapeAgeNow` | `startAge` (in `planFromSettings`) | `already` → `retired: true`; otherwise `retired: false`, `retireAge` |
| `statePension.amountPerYear` | `spWeeklyAmount` | `spWeeklyAmount` | ÷ 52 |
| `statePension.startAge/startDate` | `spStartDate` | `spStartYear`, `spFirstYearRatio` | date = birthday at that age; `spSimConfigFromSettings` does the rest |
| `finalSalary[0]` | `dbAmount`, `dbStartYear`, `dbIndexation` | same | **`dbStartYear` = startAge − age at the start** (the adapter's job; the person never sees it); `prices`→`cpi`, `pricesCapped5`→`lpi5`, `none`→`level` |
| `finalSalary[1..]`, `otherIncome[]` | `extraIncomes[]` | `extraIncomes[]` | `{ startYear, endYear, annual, indexation }` from the ages |
| household take-home | `baseSalary`, `targetSchedule`, `incomeShape: 'phases'` | `targetSchedule` | steps 1–5 above; `baseSalary` = year 0 |
| `planToAge` | `duration` | `years`, `duration` | planToAge − younger age at start, max 45 |
| `pensionTaxFreeCash` | `accessMethod` | `accessMethod` | `notTakenYet`→`ufpls`, `alreadyTaken`→`drawdown` |
| `portfolio.kind: 'funds'` | `taggedFunds`, `allocMode` | bucket starts, `subAsset` | through `tagPortfolio`, as "Test on a list of funds" does today |
| `strategy.id: 'steady'` | `strategyId: 'pots-and-valves'`, `disableProtection: true` | same | see below |
| tax bands | `pa`, `brl`, `hrl`, `taxMode` | same | 12,570 / 50,270 / 125,140, `inflates` (today's defaults) |

**The default strategy, and how it is chosen.** It is not inferred from the person; it is one fixed default for
every first answer: the existing Pots & Valves engine with its automatic spending cut switched off, shown to the
person as "Steady withdrawals: the same amount every month, rising with prices". Reasons:

- The figure quoted is then the figure paid in every month of every future. With the cut switched on, the same
  pot solves to about £110 a month more (measured: £1,490 against £1,380 for the first worked example), but
  only because bad years pay less than the quoted figure. That is an improvement to explain in door E, not a
  number to lead with.
- It is the slightly cautious side, which is the owner's standing preference.
- It needs no settings, so it works from a pot and a risk level.

Door E's compare then shows what each other strategy would do with the same household. The strategy is stored
by its existing id, so nothing about the registry changes.

**What today's engine cannot do, and what the first slice does about it**

| Gap | First slice | Later |
|---|---|---|
| The engine does not know the earliest pension age; it would draw a pension at 53 | `answerC` moves the start to the first date the pension can be touched and says so (2.7) | Door A sequences "savings first, then pension" properly |
| A couple's pots are drained in a fixed ratio; one partner cannot take over when the other's pot runs low | Accepted; both hold the same mix on the same markets, so they drain at close to the same rate | A pooled household run |
| Spending does not fall when one partner dies | Stated in "what we assumed" | The survivor line (`runSurvivorCheck`) on a couple's result |
| Earnings from work are taxed as ordinary income (no National Insurance) | Stated when `otherIncome.kind: 'work'` is present | Door D |
| ISA money grows at the engine's flat cash-like rate unless a fund list is tagged | Accepted and stated; it makes a couple's answer slightly low | The adapter passes `isaMix` from the risk preset (needs a measured before/after) |
| Two simulated-future generators exist: `SimulationEngine.monteCarloReturns` (yearly data from 1928) and `ladderEngine.bootstrapPaths` (monthly data from 1871) | `answerC` uses `bootstrapPaths` with seed `i × 7919 + 3`, the one `stressTestStrategy` uses, so C and E agree on every future | — |
| `HouseholdService.runHouseholdMonteCarlo` uses the other generator | Not called by C | Re-point it when the Household tab is re-homed |

### 1.7 The saved-plan shape

**First slice: no migration, `schemaVersion` stays 1.**

Question C gives its answer without saving anything. The inputs live in the screen's address (so the screen has
its own address and renders from state) and in the session. Nothing is written to Firestore until the person
chooses "Keep this as a plan".

When they do:

| What | Where | Notes |
|---|---|---|
| The `Household` object exactly as entered (full form, with which defaults were used) | New root key `householdInput` on `users/{uid}/scenarios/{id}` | Additive. Absent on every existing plan, which means "not made in V7". `normalizeScenario` and the migration chain already carry unknown root keys untouched, and saves are dot-path updates, so the current app leaves it alone |
| The same household in today's shape | `stressTool.settings` — the keys in the 1.6 table, plus `seededFrom: 'v7-household'` | Written in the same save, by the same adapter. The current app can open, test, lock and run the plan as any other |
| The chosen take-home figure | `stressTool.settings.baseSalary` / `targetSchedule` | Before-tax equivalent, as the engine reads it |
| Strategy | `strategy.id` and `stressTool.settings.strategyId` = `pots-and-valves`, `disableProtection: true` | Today's ids |
| A couple, signed in | Two plans in today's shape, joined by the existing `household.partnerScenarioId`; `householdInput` on the first | The current Household tab works on them |
| A couple, as a guest | One plan (guest mode allows one), with `householdInput` holding both people | The partner's plan is created at sign-in, in the existing hand-off |
| `decisionTool.settings`, `history`, `planDocument` | Untouched | A V7-made plan is an ordinary unlocked draft with default Decision settings |

Rules for the first slice:

- Existing plans are never given a `householdInput`. V7 screens that need one for an existing plan build it in
  memory from `stressTool.settings` (the 1.6 table read right to left) and do not write it back.
- If a V7-made plan is later edited in the current app, the two copies can differ. `householdInput` carries a
  hash of the settings it was written with; when the hash no longer matches, V7 rebuilds the household from the
  settings and says "This plan was changed in the current app".
- A locked plan is never written by this slice at all.

**What needs `schemaVersion` 2 later** (one step or several small ones, per `migrations.js` rules; none of it
touches `decisionTool.settings`, `history` or plan documents of a locked plan):

1. `householdInput` becomes the one home for age, date of birth and stop date, now held three times (Budget,
   Drawdown Planner settings, saving settings).
2. Final-salary pensions and other income stored with ages. For unlocked plans `dbStartYear` and
   `extraIncomes[].startYear/endYear` are converted to ages; locked plans keep their keys and the adapter reads
   both.
3. A couple stored as one household on one plan, instead of a pointer between two plans that dangles on a copy
   or a guest hand-off.
4. One home for the strategy id (held three times today).
5. Spending stored as take-home a month, with the before-tax figure derived.
6. The planner's fund list named as the intended portfolio (`taggedFunds` today).

### 1.8 The declared inputs (for generated tests)

`householdSchema` is a data table exported beside the model: for each field its type, allowed range, default, and
the boundary values the generators must include.

| Field | Range | Boundary values |
|---|---|---|
| age | 18–100 (C: start age 50–90) | 54, 55, 56, 57, 65, 66, 67, 68, 75 |
| born | month and year | each side of 6 April 1960, 6 March 1961, 6 April 1971, 6 April 1977, 6 April 1978 |
| each pot | £0–£10,000,000 | 0, 1, 10,000, 30,000, 268,275 × 4 (tax-free cash limit), 1,073,100 |
| State Pension a year | £0–£20,000 | 0, 12,547.60, 12,570 (the allowance), 12,571 |
| final-salary a year | £0–£200,000 | 0, 12,570, 37,700, 50,270, 100,000, 125,140 |
| final-salary start age | 50–75 | before, at and after the start; 55, 60, 65, State Pension age |
| other income | £0–£200,000; ages 50–100 | ends before the start, spans State Pension age |
| planToAge | 75–105 | 75, 95, start age + 45, start age + 46 |
| risk | three presets, or a fund list | each preset; a one-fund list; an all-cash list |
| people | 1 or 2 | partner with nothing; partner identical; ages 0, 2 and 11 years apart |
| `now` | any date | 5 and 6 April; 31 December and 1 January; 5 and 6 April 2028 |

`validateHousehold` returns problems as data (`[{ field, problem, sentence }]`), never throws for a bad value,
and is the only place a range is checked.

---

## 2. The answer contract for question C

### 2.1 The question

"I've got about £X — what is that a month?"

Asked by someone who may not know the word drawdown (research scenario S16). The answer is a monthly take-home
figure in today's prices, as a band, with what it is made of and what was assumed. It is not a recommendation
and it does not compare annuities or cashing in (wants W28–W30 are later screens on the same rail).

### 2.2 Inputs and signature

```
answerC(household, options) → AnswerC

household : Household                 // section 1; short or full — answerC expands it itself
options   : {
  now:      Date                      // required; never defaulted
  futures?: number                    // simulated futures; default 1000
  onProgress?: (done, total) => void
}
```

Pure, synchronous, deterministic: the same household, `now`, `futures` and market-data version give the same
result on every device (the generator is the integer one shipped in 6.13.4). Spending, strategy settings and
holdings are not read. It lives in a new module (proposed `src/v7/answers/answerC.js`) that imports only the
engine, the tax functions and the household model — no storage, no Firebase, no screen code — so it runs
unchanged in the worker and in tests.

### 2.3 How it is computed

1. **Expand and check.** `expandHousehold` → full form and `assumed[]`. `validateHousehold` → if anything is out
   of range, return `status: 'invalid'` with the problems and no numbers.
2. **Fix the start.** `householdStart`; if a pension holder cannot touch their pension on that date, move the
   start to the first date they can and add a warning (2.7).
3. **Put the people in a fixed order** (by content, not by who was typed first), so that swapping the two
   people cannot change any number.
4. **Build the futures.** For `i` = 0 … futures−1: `bootstrapPaths(i × 7919 + 3, years × 12)` then
   `annualNominal(...)` — the same futures, with the same seeds, that the strategy compare runs.
5. **For each future, find the most the household could take.** A search on the household take-home figure *H*
   (today's prices, a year): build each person's config with `toEngine(household, H, now)`, run
   `simulate` for each person who has money, and call the future "lasted" if nobody's run failed. Halve the
   range until it is within £120 a year (£10 a month). The search starts between zero (which always lasts) and
   the largest guaranteed take-home plus 12% of the pots, widening if needed. People with nothing to draw are
   not simulated; their State Pension and other income still count.
6. **Read the band off those figures.** One sustainable figure per future gives a spread:
   - **low** = the figure one tenth of the way up. It lasts to `planToAge` in 9 futures out of 10.
   - **middle** = the halfway figure. It lasts in 5 out of 10.
   - **high** = the figure three quarters of the way up. It lasts in 1 out of 4.
   Each is rounded **down** to a whole £10 a month.
7. **Find the bad-case age for middle and high.** Run all futures once at each figure; the bad case is the age
   the money ran out one tenth of the way up from the worst (the owner's "worst 1 in 10"). For low it is
   `planToAge` by construction, and this run confirms it.
8. **Build the breakdown** at each of the three figures: the years are cut into periods wherever an income
   starts or stops; in each period `planDrawdown` gives each person's pension withdrawal, tax and take-home
   from the same inputs the engine used.
9. **Write the sentences** from the result object only (2.6).

Household with no pots at all: steps 4–7 are skipped; the band is the guaranteed take-home and a warning says
there is nothing to draw on. (The scratch version got this wrong — with nothing to fail, the search ran to its
ceiling — so it is a named test case.)

**Why "lasts in 9 out of 10" is the low figure and the one the sentence leads with.** The owner defined a bad
case as the worst 1 in 10. A figure that survives the bad case is therefore the one that can be quoted without
a caveat about running out. The middle figure is an even chance and must never be shown without its bad-case
age beside it.

**How the State Pension and final-salary income add on.** They are not added to a pot figure afterwards. The
target is a level household take-home for life; guaranteed income fills it first and the pots pay the rest. So
the pots pay more in the years before the State Pension and less after. Where guaranteed income alone is more
than the figure (a small pot used up before the State Pension starts), the household's income in those later
years is the guaranteed income, and the result shows two levels (third row of the table in 2.10).

**Tax.** Entirely the existing code: `netToGross` turns each person's take-home share into the engine's target;
`planDrawdown` inside the engine takes the pension up to the basic-rate limit, then savings and ISA, and pays
higher-rate tax only if it must; a quarter of each withdrawal is tax-free while `pensionTaxFreeCash` is
`notTakenYet` (the engine's `ufpls` mode, which also tracks the £268,275 limit). Each person has their own
allowance. Tax bands rise with prices (today's default `taxMode: 'inflates'`); see open question 5.

### 2.4 The result object

```
AnswerC {
  status: 'ok' | 'invalid' | 'guaranteed-only'
  problems?: [ { field, problem, sentence } ]          // when invalid

  headline: {
    perMonth: { low, middle, high }                    // take-home, today's prices, whole £10
    perYear:  { low, middle, high }
    lastsToAge: {                                      // in a bad case (worst 1 in 10)
      low:    number,                                  // = planToAge
      middle: number,
      high:   number
    }
    lastedIn: { low, middle, high }                    // share of futures, e.g. 0.906, 0.511, 0.259
    whoseAge: string                                   // label of the person the ages refer to (the younger)
    afterItRunsOut: { perMonth }                       // guaranteed take-home left: State Pension etc.
  }

  madeOf: {                                            // one list for each of low / middle / high
    low | middle | high: [ Period ]
  }
  Period {
    from: [ { label, age } ]                           // each person's age when the period starts
    to:   [ { label, age } ] | null                    // null = to the end
    perMonth: {
      statePension, finalSalary, otherIncome,          // before tax
      fromPension, fromIsaAndSavings,                  // withdrawals
      tax,                                             // on all of the above
      takeHome                                         // the household total for the period
    }
    byPerson: [ { label, statePension, finalSalary, otherIncome, fromPension, fromIsaAndSavings, tax, takeHome } ]
    beforeStatePension: boolean                        // true until the last State Pension has started
  }

  comparedWith: {                                      // PLSA_2024, single or couple
    minimum, moderate, comfortable,                    // a year
    nearest: 'below-minimum' | 'minimum' | 'moderate' | 'comfortable'
  }

  assumed:  [ { id, sentence, changeAt } ]             // every default used, in a fixed order
  warnings: [ { id, sentence, severity: 'note' | 'important' } ]

  basis: {
    futures, engineVersion, marketDataEnd,             // so a pinned output can be explained
    start: 'YYYY-MM', years,
    split: [ { label, share } ]                        // how the pots' part was shared
    strategyId: 'pots-and-valves', cutsSwitchedOff: true
  }
}
```

Nothing in it is a function, a chart series or a raw per-future array, so it can cross the worker boundary, be
pinned in a test and be stored. A chart of pot size by age is a second call (door E's `stressTestStrategy` on
the same config) made when the person opens it.

### 2.5 "What we assumed" — every default, named

Shown in this order, only the ones that applied. Each links to the field that changes it.

| id | Sentence |
|---|---|
| `all-pension` | We've treated all of it as pension money. |
| `state-pension-full` | The full State Pension of £{sp} a month from age {age}. Yours may be different — check your forecast. |
| `state-pension-age` | Your State Pension age of {age} comes from your age. |
| `quarter-tax-free` | A quarter of each pension withdrawal is tax-free. |
| `risk-balanced` | Invested half in shares, the rest in bonds and cash. |
| `steady` | You take the same amount every month, and it rises with prices. No cuts in bad years. |
| `plan-to` | The money needs to last until {whose} {is/are} {planToAge}. |
| `todays-prices` | All figures are in today's prices. |
| `pot-as-is` | Your £{pot} is taken as it stands today — no growth or saving before you start. *(only when the start is in the future)* |
| `final-salary-rises` | Your final-salary pension rises with prices, up to 5% a year. |
| `both-stop-together` | You both stop work at the same time. |
| `savings-split` | Your savings are split evenly between you. |
| `both-alive` | Both of you are alive throughout, and spending stays the same. |
| `work-tax` | Earnings from work are taxed as income; National Insurance is not included. |
| `tax-rules` | Today's tax rules for England, Wales and Northern Ireland, with allowances rising with prices. |
| `futures` | Tested against {futures} possible futures built from market history since 1871. |
| `no-charges` | Fund and platform charges are not taken off. |

`no-charges` is a fact about today's engine that the person should be told; whether to model charges is open
question 6.

### 2.6 The sentences

Templates read only fields of `AnswerC`. `£` values are whole pounds with thousands separators. A test asserts
that every number in a rendered sentence equals the field it came from.

**Headline**

> About **£{low} a month** after tax, for life.

**Under it — the band**

> £{low} is the careful figure: it lasted until {whose} {planToAge} in 9 out of 10 of the futures we tried.
> £{middle} is an even chance. At £{middle}, in a bad case the money runs out at {lastsToAge.middle}, leaving
> £{afterItRunsOut} a month.

When low and middle are within £20: "There is little between the careful figure and the even-chance figure,
because most of this is guaranteed income."

**The high figure** (smaller type)

> £{high} worked in only 1 future in 4. In a bad case it runs out at {lastsToAge.high}.

**What it is made of — one line per period**

> Until {age}: £{takeHome} a month, all from your pension.
> From {age}: £{statePension} State Pension + £{fromPots} from your pension.
> From {age}: £{finalSalary} final-salary pension + £{fromPots} from your pension and savings.

Couples name the person: "From when Sam is 67 …". Tax appears as its own line only when it is not zero:
"Tax of £{tax} a month is already taken off."

**Two-level case** (guaranteed income later exceeds the figure)

> £{low} a month until {age}, then £{guaranteed} a month from your State Pension.

**Compared with**

> For comparison, a {single person / couple} needs about £{moderate} a month for a moderate lifestyle and
> £{minimum} for a basic one (Retirement Living Standards).

**Wording rules for this screen**

- "after tax" or "take-home"; "today's prices"; "a bad case"; "futures"; "runs out"; "final-salary pension".
- Never: decumulation, plan year, bridge, sequence risk, percentile, Monte Carlo, success rate, ruin, SIPP,
  UFPLS, drawdown (as a bare noun), crystallised.
- Ages, never "in N years". For someone who has already stopped work there is no countdown of any kind; "From
  67" is used even if 67 is next year.
- A State Pension already being paid is "your State Pension", with no age.

### 2.7 Warnings

| id | When | Sentence | Severity |
|---|---|---|---|
| `pension-locked` | A pension holder is under the earliest pension age at the start | You can't take money from a pension until you are {57}. These figures start from then. | important |
| `savings-cover-gap` | As above, and there is money outside pensions | Your other savings would cover about {n} months at this level before then. | note |
| `pot-used-before-state-pension` | Guaranteed income later exceeds the low figure | Your pot is used up by {age}; after that you live on your State Pension and other guaranteed income. | important |
| `nothing-to-draw` | No pots | There is no pot to draw on, so this is your guaranteed income only. | note |
| `long-plan` | Years capped at 45 | We can only test 45 years ahead, so this runs to age {age}, not {planToAge}. | important |
| `start-later` | Start more than 12 months away | This ignores growth and saving between now and then. "When can I afford to stop?" includes them. | note |
| `higher-rate` | Any period's withdrawal is taxed at 40% | Some of this is taxed at 40%. Spreading it between you, or over more years, may lower the tax. | note |
| `one-name` | Couple; one person holds over 80% of the pensions and the other has unused allowance | Most of the pension is in one name, so one tax allowance is barely used. | note |
| `state-pension-assumed` | `state-pension-full` applied | This assumes the full State Pension. If yours is lower, the figure will be lower. | note |
| `tax-free-limit` | Pension over £1,073,100 | The tax-free part of a pension is limited to £268,275 in total. That limit is included. | note |
| `small-pot` | Pots under £30,000 | With a pot this size, taking it as cash over a few tax years may suit you better than a monthly income. | note |

### 2.8 Runtime budget

Measured on an Apple M4, Node 24, one thread, engine unchanged. "Solve" is steps 4–6; "total" adds the bad-case
ages (step 7).

| Case | Futures | Quarter tax-free (default): solve / total | Tax-free cash already taken: solve / total |
|---|---|---|---|
| Single, £250k, age 58 (37 years) | 100 | 1.3 s / 1.8 s | 0.28 s / 0.36 s |
| | 300 | 4.0 s / 5.2 s | 0.84 s / 1.1 s |
| | 1,000 | 13.2 s / 17.2 s | 2.8 s / 3.7 s |
| Couple, both with money (38 years) | 300 | 7.3 s / 9.3 s | 2.3 s / 2.8 s |
| | 1,000 | 24.4 s / 31.0 s | 7.6 s / 9.4 s |
| Retired at 66, £180k (29 years) | 100 | 1.0 s / 1.4 s | 0.20 s / 0.27 s |
| | 300 | 3.1 s / 4.1 s | 0.60 s / 0.79 s |
| | 1,000 | 10.2 s / 13.4 s | 2.0 s / 2.7 s |

What this shows:

- One engine run of a 37-year plan costs about 0.3 ms when every withdrawal is taxed, and about 1.3 ms when a
  quarter is tax-free. The difference is inside `planDrawdown`: its tax-free branch finds the withdrawal by an
  80-step search, up to three times, every month. The search has an exact answer by formula.
- The solve needs about 10 engine runs per future per person, plus 3 for the bad-case ages.
- The low figure is stable with few futures: 100 futures gave £1,400, 200 gave £1,370, 300 and 1,000 gave
  £1,380. The retired case gave £1,570 / £1,530 / £1,540.
- No phone was measured. Taking a mid-range phone as four times slower than this machine, the default case at
  300 futures would take about 16 seconds. That misses the budget by a wide margin.

**Proposal**

1. **Always in the worker** (`engineWorker.js` gets a job type `answer-c`; `engineClient.runInWorker` exists).
   The screen shows the form result area with "Working it out…" and a completion signal a test can wait on.
2. **Two passes.** A first estimate from 100 futures, shown rounded to the nearest £50 and labelled "about";
   then 1,000 futures, which replaces it with the final figure to £10. Pinned tests and the round-trip check use
   the 1,000-future result.
3. **Speed up the tax-free branch of `planDrawdown` first** (replace the search with the exact piecewise
   formula). This is an engine change, so it ships in a 6.x release on its own, behind the existing pinned
   outputs with their tolerance, before the slice depends on it. Expected gain: four to five times for every
   plan that uses tax-free withdrawals, not only C.
4. **Trim the solve**: start the search from a closed-form estimate (about 7 runs per future instead of 10), and
   skip the bad-case run for the low figure in the first pass.

With 3 and 4 done, the estimate (not measured) for a single person is about 0.2 s here and under 1 s on a phone
for the first figure, and about 3 s here / 12 s on a phone for the final one; a couple roughly double. Without step 3 the
first figure on a phone is about 5 s and the budget is missed.

**The budget to test against** (browser harness, processor slowed four times): first figure on screen within
3 s of the last input; final figure within 15 s; the page stays responsive throughout (no task on the main
thread over 50 ms).

### 2.9 What the tests will assert

Rules that must hold for any valid household (run on generated cases; 200 futures is enough for these):

1. **More pot never gives less.** Raising any pot, for either person, never lowers low, middle or high.
   Measured for a single person of 58, £ a month (low / middle / high):
   £30k 250 / 320 / 360 · £60k 520 / 660 / 720 · £100k 860 / 1,060 / 1,100 · £150k 1,110 / 1,250 / 1,310 ·
   £200k 1,240 / 1,430 / 1,520 · £250k 1,370 / 1,600 / 1,710 · £300k 1,490 / 1,780 / 1,910 ·
   £400k 1,720 / 2,120 / 2,310 · £600k 2,170 / 2,780 / 3,070 · £1m 3,060 / 4,030 / 4,470 ·
   £2m 4,950 / 6,520 / 7,270.
2. **The band is in order.** low ≤ middle ≤ high; `lastsToAge.low` ≥ `lastsToAge.middle` ≥ `lastsToAge.high`;
   `lastedIn.low` ≥ 0.90.
3. **The solved figure, fed back, lasts as stated.** Build the plan in today's saved shape with the low figure
   (`toEngine` → settings → `createSimulationConfigFromSettings` → `planFromSettings` →
   `stressTestStrategy('pots-and-valves')` at the same number of futures). Its simulated failure share must be
   at most 10%; and a figure £50 a month higher must fail in more than 10% (proposed; not yet measured). Measured: the low figure of £1,360 a month
   (State Pension paid for 52% of its first year, as the saved path has it) gave 9.0% at 300 futures and 8.9% at
   1,000; the same plan on every historical start gave 9.1% of 693.
4. **A partner with nothing changes nothing.** A couple whose second person has no pots and no income gives the
   same band as the single person. Measured: identical (£16,560 / £19,200 / £20,640 a year, 300 futures).
5. **Swapping the two people changes nothing.** Measured: identical once the people are put in a fixed order
   before the run. Without that step the low figure moved by £10 a month, because each person's run takes a
   seed from their position.
6. **Within one future, taking less never fails sooner.** This is what makes step 5 of 2.3 a valid search.
7. **More guaranteed income never gives less**, and a later `planToAge` never gives more.
8. **Nothing is negative or undefined**; every period's parts add up to its take-home to the pound; periods
   cover every year once.
9. **The same input gives the same output**, on a second call and with the clock moved across 5/6 April (for a
   household given by dates of birth).
10. **Every sentence's numbers equal its fields**, and no banned word appears.

Independent answers (the headline recomputed by separate code):

- From the month-by-month trace of one future at the low figure (`simulateTraced`): the household's take-home
  in every month, deflated to today's prices, equals low ÷ 12 to the pound until the run ends.
- A closed-form case: an all-cash pot on a constant-inflation path has an exact level withdrawal by the annuity
  formula (cash earns inflation less 1% in the engine); the search must land within £10 a month of it.
- Tax in each period against a hand-worked HMRC example at the thresholds in 1.8.

Boundary and replay cases named in this document: no pots; a pot used up before the State Pension; pension
locked at the start; ages either side of 55, 57, 66, 67; a State Pension of £12,570 and £12,571; a final-salary
pension that starts before the person's own start; two final-salary pensions; a couple 11 years apart.

Fixture for research scenario S16, reviewed once by the owner: the first worked example below with its
rendered sentences.

As a user (browser layer): the "forum guest with two minutes" script walks question C from the front door —
counted inputs (5), screens (1), and waiting time; the figure on screen equals `headline.perMonth.low`; the
screen reloads to the same result from its address; phone, tablet and desktop screenshots; the wording check.

### 2.10 Three worked examples

All: 30 Sep 2026, Balanced (50 / 40 / 10), steady withdrawals, to age 95, a quarter of each pension withdrawal
tax-free, full State Pension of £12,548 a year, 1,000 futures, engine v6.15.0 unchanged. Figures are take-home
in today's prices.

**Example 1 — single, £250,000, age 58, stops now; State Pension from 67**

| | Low (9 in 10) | Middle (5 in 10) | High (1 in 4) |
|---|---|---|---|
| A month | **£1,380** | £1,590 | £1,720 |
| A year | £16,560 | £19,080 | £20,640 |
| Lasts to, in a bad case | 95 | 76 | 72 |
| Share of futures it lasted | 90.6% | 51.0% | 25.9% |

What the low figure is made of:

| Period | State Pension | From the pension (before tax) | Tax | Take-home a year |
|---|---|---|---|---|
| 58 to 66 | — | £16,560 | £0 | £16,560 |
| From 67 | £12,548 | £4,715 | £703 | £16,560 |

Before 67 there is no tax: three quarters of £16,560 is inside the personal allowance. At the middle figure
the pension pays £19,489 before 67 (tax £409) and £7,680 after (tax £1,148).

Sentences as they would render: "About £1,380 a month after tax, for life. £1,380 is the careful figure: it
lasted until you are 95 in 9 out of 10 of the futures we tried. £1,590 is an even chance. At £1,590, in a bad
case the money runs out at 76, leaving £1,045 a month." / "Until 67: £1,380 a month, all from your pension.
From 67: £1,045 State Pension + £335 from your pension."

Time: 13.2 s to solve, 17.2 s in all (300 futures: 4.0 s / 5.2 s, same low figure).

Variations on the same person (300 futures), low / middle / high a month:
Cautious 1,370 / 1,530 / 1,600 · Adventurous 1,360 / 1,650 / 1,840 · to age 90: 1,410 / 1,650 / 1,770 ·
to age 100: 1,350 / 1,570 / 1,680 · tax-free cash already taken: 1,340 / 1,550 / 1,670 ·
with the automatic cut left on: 1,490 / 1,710 / 1,820 (not comparable: bad years pay less than the figure).

**Example 2 — couple, 59 and 57; £600,000 pension (the 59-year-old's), £150,000 ISA between them, £9,000 a year
final-salary pension from 60 (the 59-year-old's); both State Pensions at 67**

Short-form mapping applied: ISA split £75,000 each; the pots' part of the income shared 90% / 10% by who holds
the money.

| | Low (9 in 10) | Middle (5 in 10) | High (1 in 4) |
|---|---|---|---|
| A month | **£3,610** | £4,000 | £4,290 |
| A year | £43,320 | £48,000 | £51,480 |
| Lasts to, in a bad case (the younger partner's age) | 95 | 83 | 78 |
| Share of futures it lasted | 90.2% | 51.1% | 25.4% |

What the low figure is made of (a year):

| Period (ages younger / older) | State Pensions | Final-salary | From pension (before tax) | From ISAs | Tax | Take-home |
|---|---|---|---|---|---|---|
| 57 / 59 | — | — | £42,911 | £4,332 | £3,923 | £43,320 |
| 58 / 60 to 64 / 66 | — | £9,000 | £35,499 | £3,432 | £4,611 | £43,320 |
| 65 / 67 and 66 / 68 | £12,548 | £9,000 | £24,954 | £2,357 | £5,539 | £43,320 |
| From 67 / 69 | £25,095 | £9,000 | £11,669 | £1,102 | £3,546 | £43,320 |

£43,320 a year is almost exactly the Retirement Living Standards "moderate" figure for a couple (£43,100).

The same money with the pension held £300,000 each (300 futures): **£3,810** / £4,400 / £4,700 a month. Two
tax allowances instead of one are worth about £200 a month here, which is why the short form asks for each
person's pension separately and why the `one-name` warning exists.

Time: 24.4 s to solve, 31.0 s in all (300 futures: 7.3 s / 9.3 s, same low figure).

**Example 3 — retired, 66, £180,000; State Pension already being paid**

A person who is 66 today was born in 1959 or 1960; under the rules in 1.5 their State Pension has started or
starts within months, so it is treated as in payment.

| | Low (9 in 10) | Middle (5 in 10) | High (1 in 4) |
|---|---|---|---|
| A month | **£1,540** | £1,730 | £1,850 |
| A year | £18,480 | £20,760 | £22,200 |
| Lasts to, in a bad case | 95 | 85 | 81 |
| Share of futures it lasted | 90.9% | 51.2% | 26.5% |

What the low figure is made of: State Pension £12,548 + £6,974 from the pension − £1,042 tax = £18,480 a year.
As rendered: "Your State Pension (£1,045 a month) + £495 from your pension."

Time: 10.2 s to solve, 13.4 s in all (300 futures: 3.1 s / 4.1 s; low £1,530).

If the State Pension were a year away instead (start 67), the figures are £1,510 / £1,690 / £1,800, with the
pension paying all £18,120 in the first year.

---

## 3. Decisions for the owner, and open questions

**Decisions**

1. **Which figure leads.** Proposed: the careful figure (lasts in 9 futures out of 10) is the headline, with
   the even-chance figure and its bad-case age directly beneath. The alternative is to lead with the middle
   figure, which reads better and has an even chance of running out early.
2. **What "high" means.** Proposed: worked in 1 future in 4. A "1 in 10" high figure would be about 8% larger
   (£1,850 against £1,720 in example 1) and would run out sooner still in a bad case.
3. **Steady withdrawals as the default for first answers**, with the automatic cut switched off. It gives the
   lower, plainer figure. Confirm.
4. **Plan to 95 by default**, for a couple until the younger is 95. Each five years changes example 1 by about
   £30 a month.
5. **Tax allowances.** Today's default lets them rise with prices. They are in fact frozen for some years yet.
   The engine offers only "rise with prices" or "frozen for the whole plan". Keep today's default for C and say
   so, or add "frozen until a given year" to the engine?
6. **Charges.** The engine takes none off. A 0.5% a year charge would lower every figure here. Add a charges
   field to the portfolio (default to be chosen), or state it as an assumption as proposed?
7. **The full State Pension figure** (£241.30 a week for 2026/27) should be checked against gov.uk before it is
   written into the code as the default, and it needs a place in the yearly update checklist.

**Open questions for the build**

8. The speed-up of the tax-free branch of `planDrawdown` (2.8, step 3) is an engine change with pinned outputs
   to re-confirm. Is it acceptable as its own 6.x release before the slice, or should the first slice ship with
   the 100-future first figure and the slower final figure?
9. A couple's pots are drained in a fixed ratio (1.6). For the second worked example this leaves the younger
   partner's allowance unused for eight years. A smarter split (use the second allowance first) is worth
   measuring before door A; it changes the adapter, not the model.
10. ISA money currently grows at the engine's flat cash-like rate unless funds are tagged. Passing the risk mix
    through `isaMix` is more accurate; the change in the couple's figure needs measuring before it is adopted.
11. When the start is in the future, C takes the pot as it stands today (2.5, `pot-as-is`). Once the saving-years
    engine exists (step 4), should C use it, or stay the simple door and point to "When can I afford to stop?"
12. Guest couples: the current guest mode holds one plan. The proposal keeps both people inside one plan's
    `householdInput` until sign-in. Confirm that the hand-off at sign-in may create the partner's plan.
13. Scotland's tax bands are not in `TaxCalculator`. Until they are, the front door should say the figures use
    the rates for England, Wales and Northern Ireland (`tax-rules` in 2.5).
