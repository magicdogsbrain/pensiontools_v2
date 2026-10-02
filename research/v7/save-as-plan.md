# Save as a plan — from a V7 answer into a named plan (design, 1 Oct 2026)

Owner, 1 Oct 2026: "there needs to be a way to feed this user input into a plan but we must allow the user to name
the plan or name it something that could allow them to try something else — ie not 'my plan'. The auto naming of the
plan could include the retirement age and monthly amount maybe?"

## What the person sees

At the foot of every answer (C, A, B), under "What next?":

> **Save this as a plan**
> Name `[ Stop at 67 · £1,850 a month ]`  ← filled in, can be changed
> [Save as a plan]
> You can save as many as you like and compare them. Saving needs an account (or carries on in the guest trial).

After saving: "Saved as 'Stop at 67 · £1,850 a month'. Try something else and save that too." with a link to open it.

## The suggested name

Built from the answer, never "My plan". In today's money, whole £10s, at most 50 characters.

| Where | Pattern | Example |
|---|---|---|
| C, still working | Stop at {start age} · £{careful} a month | Stop at 67 · £1,850 a month |
| C, drawing now | From {age now} · £{careful} a month | From 62 · £1,400 a month |
| A | Stop at {shown age} · £{spend} a month | Stop at 60 · £1,800 a month |
| B | Stop at {age} · £{spend} a month · paying £{pay-in} | Stop at 62 · £2,000 a month · paying £950 |
| Couple | Stop at {you} and {partner} · … | Stop at 60 and 58 · £3,500 a month |

- A and B name the spend the person tried (a name describes the try, not a promise); C names the careful figure.
- If the name is already used, " (2)", " (3)" … is added at save time.
- The box can be edited; an empty name or one over 60 characters is refused with a plain message.

## Where the plan goes (until V7 has its own planner)

The plan is created in **today's planner** (v6), which has the detail: strategies, the stress test, the plan
document, the lock, the monthly record. V7 has no storage of its own yet, so:

1. V7 writes a **plan seed** (the checked inputs, the answer's key figures, the suggested name, the V7 version) to
   localStorage on the same site (pensiontools.uk serves both / and /v7/). **Never in the address bar** — no
   personal figures in URLs.
2. It opens `/#new-plan`. Today's app reads the seed, asks the person to sign in or carry on as a guest if needed,
   shows the name again to confirm, then creates a **new** plan (never overwrites one, never touches a locked plan),
   makes it the active plan, and deletes the seed. A seed older than a day is discarded.
3. A pure mapping, `src/services/PlanSeed.js` (`seedToScenario(seed, today)`), turns the seed into the plan:
   pot(s), ages, State Pension, final-salary pension, savings as ISA, risk level, the age you stop as the plan's first
   tax year, the monthly spend as the target, pay-ins into the saving section, couple → the partner's plan as today's
   app does it. Tested on its own; the created plan passes the schemaVersion checks.

## The figures in the plan

Today's planner tests the drawing years from a pot at the start. With money still going in, the plan starts from
the **middling pot** the saving years give at the stop age (recommended; using the careful pot and then testing
again would count the caution twice — the fault just fixed between A and B). The plan records "from £X at 67, a
middling case; £Y in a bad case" so the person sees both.

The planner's own stress test will not give exactly V7's figure (it does not vary the saving years). The plan says so
once, in one line. When V7's planner replaces today's, the figures become one.

## Tests

- Name builder: every pattern, couple, rounding, 50-char cut, duplicate suffix, never "My plan".
- seedToScenario: each field lands where today's app reads it; C/A/B seeds; single/couple; pay-in 0; already
  drawing; stop before 57 with savings; created plan passes migrations and the plan-corpus checks.
- Browser: save from C, A and B as guest and signed in (test account), two saves give two plans, the seed is gone
  afterwards, a locked plan is untouched, nothing personal in any URL.
- GDPR: a new kind of write to Firestore from a new entry point — checked against compliance/GDPR_TODO.md; the seed
  in localStorage is listed in the privacy policy's browser-storage line if it is not covered already.

## Contract (build to this)

Both sides build to this section: V7 writes the seed, and today's app reads it and makes the plan. It was read against
1e5529e (6.17.0) in these files: `ScenarioRepository.js` (getDefaultScenario, createNewScenario, duplicateScenario),
`FirestoreService.js` (the guest store, createScenario, setActiveScenarioDoc), `GuestMeter.js` and the hand-off,
`startGuest`, `handleWizardComplete` and `createPartnerPlanReal` in index.html, `HouseholdService.js`, `PlanTiming.js`,
`StressRepository.js` (createSimulationConfigFromSettings, potScaleOf), `BudgetModel.js`, `AccumulationEngine.js`,
`schema.js` and `migrations.js`, and the answers (`contract.js`, `a|b|c/answer.js`, `c/onLives.js`, `shared/toEngine.js`,
`shared/household.js`). Nothing was run.

"Careful" pot means the 1-in-10 low position of the pots at the stop. "Middling" means the middle position. Both are
whole £ at today's prices.

### C.1 The seed

The seed is one plain JSON object. It holds no `undefined`, no functions, no Dates and no arrays inside arrays, so it
can go to Firestore almost unchanged. One pure function builds it:
`buildPlanSeed({ source, result, env, name, budget, spendHow, createdAt })` in `src/answers/keep/planSeed.js`. The
effect passes `createdAt` in, because answers read no clock. A seed is offered only when `status` is `'ok'` and the
answer on screen is for the inputs as they stand now (it is not greyed "Updating").

```js
{
  seedVersion: 1,
  createdAt: '2026-10-01T14:03:22.511Z',    // ISO, from V7's effect clock
  today: '2026-10-01',                       // env.today: every age and date in the plan is reckoned from this day
  source: 'a',                               // 'c' | 'a' | 'b'
  v7: { appVersion: '6.17.0', engineVersion: '…', historyEnd: '…' },   // env.appVersion; result.basis.*
  name: { suggested: 'Stop at 60 · £1,800 a month', chosen: 'Stop at 60 · £1,800 a month' },
  inputs: { },                               // result.inputs (checked, defaults filled): kept as a record; the mapping never reads it
  household: 'single',                       // | 'couple'
  stop: { kind: 'later', yearsFromNow: 4 },  // kind 'now' = taking money from today
  endAge: 95,                                // the younger person's, for a couple
  years: 35,                                 // drawing years = min(45, endAge − the younger's age at the stop), as enginePlan
  risk: 'balanced',                          // the mix while drawing = the intended portfolio (never holdings)
  spend: { perMonth: 1800, from: 'typed', level: null, budgetSkipped: true },   // from: 'careful' (C) | 'typed' | 'level' | 'budget'
  people: [ /* Person: 'you' first, then the partner */ ],
  answer: { monthly: null, lasted: 0.93, runOutAge: 95, verdict: 'yes', potAtStop: { careful: 288500, middling: 364000 }, number: null, payInNeeded: null },
  budget: null                               // or the checked budget sheet (C.5)
}

// Person
{
  who: 'you',                                                                  // | 'partner'
  ageToday: 56, ageAtStop: 60, pensionOpensAge: 57,
  pension: { today: 250000, atStop: { careful: 268000, middling: 341000 } },   // whole £, today's prices
  savings: { today: 20000,  atStop: { careful: 20500,  middling: 23000 } },    // ISAs and cash
  payIn: { kind: 'split', total: 800, own: 500, employer: 300, savingsIn: 0 }, // £ a month into the pension, tax added back included; null = none
  alreadyDrawing: false,
  statePension: { yearly: 12547.6, fromAge: 67, fromDate: '2037-10-01' },      // null = none
  finalSalary: { yearly: 9000, fromAge: 60, increases: 'pricesCapped5' },      // before tax; null = none
  taxFreeQuarter: true,
  partTime: null,                                                              // A, 'you' only: { yearly, years }, before tax, from the stop
  takeHome: [{ fromAge: 60, perMonth: 1800 }]                                  // this person's part of spend.perMonth: after tax, today's prices
}
```

Where each field comes from. For A, "the result" means the `shown` row. Index `j` is the person's place in `saving[]`.

| Seed field | C | A | B |
|---|---|---|---|
| stop.kind | `'now'` when basis.startAge equals inputs[whose].age (no wait and no moved start); else `'later'` | `'now'` when shown.age equals you.age | `'later'` |
| ageAtStop | ageToday + (basis.startAge − inputs[whose].age) | shown.ages[who] | ages[who] |
| pension, savings .atStop | `'now'`: careful = middling = today. `'later'`: `saving[j].potAtStop.pension` and `.savings` | `saving[j].potAtStop` | `saving[j].potAtStop` |
| savings.today | inputs.savings ÷ the number of people (the even split household.js makes) | same | same |
| pensionOpensAge | rules.firstAccessAge(ageToday, today) | pensionOpens[who] | pensionOpens[who] |
| statePension | from expandHousehold: yearly = amountPerYear (0 → null); fromAge = startAge.years, plus 1 if months > 0; fromDate = addYears(today, fromAge − ageToday) | same | same |
| finalSalary.increases | the household default, `'pricesCapped5'` (the form does not ask) | same | same |
| spend | perMonth = monthly.careful; from `'careful'`; budgetSkipped null | spend.perMonth; from `'level'` if spend.kind is `'level'`, `'budget'` if spendHow is `'lines'`, else `'typed'` | as A |
| takeHome | One person: `[{ fromAge: ageAtStop, perMonth: spend.perMonth }]`. Two people: one row per phase of `phases`, `{ fromAge: phase.ages[who].from, perMonth: byPerson[who].takeHome }`; neighbouring rows less than £1 apart are merged into one | as C, from `shown.phases` | as C, from `phases` |
| answer | monthly; lasted.careful; runOutAge.careful; verdict null; potAtStop = potAtStart (careful, middling), or null from now | shown.monthly, .lasted, .runOutAge, .verdict, .potAtStop (careful, middling) | lasted = chance.lasted; runOutAge = wholeLife.runOutAge; verdict = verdictOf(chance.fails, basis.futures); number; payInNeeded = payIn.needed |

### C.2 Where the seed is kept, and the way in

- **Key:** `localStorage['pt_v7_plan_seed']`. It holds one seed at a time. V7 writes it, and only today's app reads it
  and deletes it. Both run on the same origin.
- **Address:** `../#new-plan`, relative to `/v7/`. That is `/#new-plan` on pensiontools.uk, and the mirror's own root
  on the mirror. No figure is ever in an address.
- **When it is deleted:**
  - as soon as the plan is made;
  - on "Not now";
  - on any read that finds it older than 24 hours, dated more than 5 minutes in the future, unreadable, or of a
    `seedVersion` the app does not know;
  - on sign-out, Reset and Delete Account.

  Today's app runs that read every time it starts, whether or not the address ends in `#new-plan`.

**V7.** `src/v7/effects/planSeed.js` is the only V7 file that touches localStorage. Boundary rule 4 already allows it in
effects, and rule 3 (no src/storage or src/firebase imports) is unchanged.
1. Check the name with checkPlanName, build the seed and call `setItem`. If the browser refuses, show "This browser would
   not keep your figures, so the plan could not be made." Nothing else is tried; above all, the figures never go into
   the address.
2. Call `location.assign('../#new-plan')` in the same tab. Back then returns to V7 with the tab's draft
   (`pt_v7_draft`) still there.

**Today's app.** `src/services/PlanSeed.js` is pure: `SEED_KEY`, `readSeed(storage, nowMs)`, `checkSeed`,
`seedToScenario`. `src/ui/components/NewPlanFromSeed.js` holds the steps. index.html gets an import and the calls only.
1. At start, `readSeed` returns `{ seed }` or `{ problem }`, and deletes the seed on any problem. If the address is
   `#new-plan`, `history.replaceState` removes the hash so that a reload does not ask twice.
2. No seed: show "There was nothing waiting to be saved. If you pressed Save more than a day ago, please do it again."
   Then carry on as normal.
3. **Signed in and email verified:** go to the confirm step. The guest hand-off (`importGuestHandoff`) runs first, as it
   does now. A brand-new account goes to the confirm step instead of onboarding.
4. **Signed out:** show the sign-in screen with the line "Sign in or make a free account to keep this plan, or carry on
   without an account (kept in this tab only)."
5. **Carrying on without an account** uses a new `startGuestForSeed()`. It starts guest mode and the meter. It does not
   call `startGuest`, which deletes the tab's guest plans and adds the demo plan. If the guest time is used up, the
   existing hard stop shows and the seed waits.
6. **The confirm step:**
   - a name box filled with `name.chosen`;
   - one line on what is in the plan, such as "Stop at 60, £1,800 a month, a pension of about £341,000 then";
   - the buttons [Save as a new plan] and [Not now].

   The name check is the same as V7's.
7. **Save:**
   1. `seedToScenario(seed, today)` returns `{ yours, partner }`.
   2. Each name gets `withDuplicateSuffix`.
   3. A new repository function, `createPlansFromSeed`, creates the partner's plan first (inactive).
   4. It then creates yours with `household.partnerScenarioId` set, and calls `setActiveScenarioDoc(yours)`.
   5. If your plan fails to save, the partner plan it has just made is deleted with `deleteScenarioDoc`.
   6. `guestOnePlanGate` does not apply here.
   7. The seed is deleted.
8. **After saving:** the app opens on your plan at Stress tester → Settings. It shows "Saved as '…'. [Back to the
   question] to try something else and save that too." The link is `./v7/#/{source}/answer`.
9. **Failure:** the seed is kept for the rest of its day. Show "Could not save the plan: … Your figures are still
   waiting; try again."

**Writes.** Only `createScenario`, which makes new documents, and the root `isActive` flag that
`setActiveScenarioDoc` flips on the plan that was active (Q12). Nothing else in any existing plan is written, and a
locked plan is never opened for writing.

### C.3 From the seed to today's plan

`seedToScenario(seed, today)` lives in `src/services/PlanSeed.js` and is pure. It uses `today` only for
`fromAnswer.savedOn`. Every other date comes from `seed.today`, parsed as a local date (`new Date(y, m − 1, d)`, never
`new Date('YYYY-MM-DD')`). It starts from `getDefaultScenario(...)`, so the plan is born at `SCHEMA_VERSION`. No
migration is needed: every new key is optional and is read with a default.

**What is made.**
- **One person:** one plan.
- **A couple:** two plans, the way today's app already holds a partner.
  - Your plan carries `household.partnerScenarioId`, pointing to the partner's plan. As today, the link goes one way only.
  - Each plan holds one person's pots, pensions, pay-ins and their part of the spending.
  - Both run for `seed.years`, so they end in the same year.

`S` stands for `stressTool.settings`. `p` is people[0] for your plan and people[1] for the partner's plan.

| Target | From the seed | Unit |
|---|---|---|
| planDetails.name | name.chosen → checkPlanName → withDuplicateSuffix. The partner's plan: chosen + ' · partner' | text |
| planDetails.description | two lines (below) | text |
| enabledTools | `['budget','stress','decision','accumulation','household']`, as guest and demo plans have | — |
| strategy; S.strategyId, S.strategyParams | defaultStrategyBlock(); `'pots-and-valves'`, `{}`. This is the one strategy V7 runs | — |
| S.configured | true, so no set-up banner shows | — |
| S.currentAge, S.currentAgeAsOf | p.ageToday, seed.today | years, date |
| S.retired, S.retireAge | stop `'now'`: true, null. `'later'`: false, p.ageAtStop | — |
| S.firstTaxYear | `'now'`: taxYearStartOf(seed.today), this tax year (the wizard's "pick up from here"). `'later'`: deriveTiming(S, seed.today).firstTaxYear | tax year |
| S.shapeAgeNow | deriveTiming(S, seed.today).shapeAgeNow | age |
| S.duration | seed.years, the same for both plans | years |
| S.equityMin, bondMin, cashTarget | p.pension.today × RISK_PRESETS[seed.risk] .equity, .bond, .cash, in whole £. If today is £0 on a `'later'` plan, use atStop.middling instead (Q10) | £, today |
| S.allocMode, taggedFunds, diversifierStart, equityGlideEnabled | `'risk'`, `[]`, 0, false. The intended mix is the risk level; there is no fund list and no holdings | — |
| S.potAtRetirement | `'later'`: `{ sipp: p.pension.atStop.middling ‖ null, isa: p.savings.atStop.middling ‖ null, source: 'override' }`. `'now'`: null | £, today's prices |
| S.isaBalance | p.savings.today, £0 included. (Until the review of 6.22.0 a £0 on a `'later'` plan was replaced by atStop.middling (Q10); once 6.22.0 counted what goes into savings each month, that counted it twice. The runs start from potAtRetirement.isa when there is no ISA today: PlanTiming.isaAtRetirementOf.) | £, today |
| S.isaDrawdownStrategy, isaReturn | the defaults, `'minimiseEarlyTax'` and 0.03 (= V7's savings growth) | — |
| S.baseSalary | `Math.round(grossUpAnnual(p.takeHome[0].perMonth × 12))` | £ a year, before tax, today's prices |
| S.incomeShape, incomeSteps | One row: `'level'`, `[{ fromAge: shapeAgeNow, amount: baseSalary }]`. More rows: `'phases'`, each row `{ fromAge, amount: Math.round(grossUpAnnual(perMonth × 12)) }`, with the first fromAge = shapeAgeNow. If the first rows are £0, set baseSalary to 0 and start the steps at the first row above £0. No targetSchedule is written (it is compiled from the steps) | £ a year, before tax |
| S.statePension | yearly, or 0 for none. The 0 matters: without it the default 12,000 would be used | £ a year, before tax |
| S.spStartDate, spWeeklyAmount | fromDate, round2(yearly ÷ 52). None: null, 0 | date, £ a week |
| S.dbAmount, dbStartYear, dbIndexation | finalSalary.yearly; max(0, fromAge − shapeAgeNow); `'prices'`→`'cpi'`, `'pricesCapped5'`→`'lpi5'`, `'none'`→`'level'` | £ a year before tax; plan years |
| S.extraIncomes | partTime: `[{ label: 'Part-time work', startYear: 0, endYear: partTime.years − 1, annual: partTime.yearly, indexation: 'cpi' }]`. Otherwise `[]` | £ a year, before tax |
| S.accessMethod, ufplsYears | `'ufpls'` if taxFreeQuarter, else `'drawdown'`; null. This is a quarter of every withdrawal tax-free, as V7 assumes | — |
| S.disableProtection, hodlEnabled | true, false. V7 runs with its cuts off (Q9) | — |
| S.pa, brl, hrl, taxMode, other | the defaults 12,570, 50,270, 125,140, `'inflates'` and 0. These equal V7's bands | — |
| decisionTool.settings | getDefaultDecisionSettings() plus `{ duration, firstTaxYear }`, as the wizard does. Not configured and not locked (Q11) | — |
| decisionTool.history, taxYears | `[]`, `{}` | — |
| accumulationTool.settings | `'later'` with a pay-in: `{ currentAge: ageToday, retirementAge: ageAtStop, potNow: pension.today, salary: 0, schemeType: 'ras', netMonthly: round2((split ? own : total) × 0.8), employerMonthly: split ? employer : 0, escalationPct: 0 }`. Relief at source makes gross = net ÷ 0.8, so the amount landing in the pension is V7's figure. Otherwise absent | £ a month, today's prices |
| budgetTool.settings | C.5 | £, after tax, today's prices |
| household.partnerScenarioId | your plan only: the new id of the partner's plan | — |
| fromAnswer | the seed without `budget`, with `people` cut down to this plan's person, plus `{ who, savedOn }` | record |
| holdings, planDocument, journey, transition | absent | — |

**The description: two plain lines.**
1. `'later'`: "From 'When can I afford to stop work?' on 1 Oct 2026: a pension of about £341,000 at 60 in a middling case,
   £268,000 in a bad case (the worst 1 in 10)."
   `'now'`: "From 'What is that a month?' on 1 Oct 2026."
2. `'later'`: "This plan starts from the middling figure and does not vary the years before you stop, so its tests will differ
   a little from the answer."
   `'now'`: "Its tests may differ a little from the answer."
   When pensionOpensAge > ageAtStop, also add: "Your pension cannot be touched until 57; this planner does not hold it
   closed."

**The cases.**
- **Couple.** Each plan's target is its own person's takeHome rows. Together the two rows add up, in every stretch of
  years, to the chosen figure (or to the guaranteed income where that is more). Tax is per person, so each row is grossed
  up on its own.
- **Already drawing (`'now'`).**
  - retired is true, from this tax year;
  - the pots are today's (careful = middling);
  - there is no potAtRetirement and no Accumulation settings.
- **Stopping later.**
  - retired is false, and retireAge is set;
  - S holds today's pots, and potAtRetirement holds the middling pots at the stop; the engines scale between them with
    `potScaleOf`;
  - careful is kept in fromAnswer and in the description.
- **Stopping before 57, with savings.** This is mapped as it is: the savings go to isaBalance and potAtRetirement.isa.
  Today's engine has no closed pension, so its test may draw on the pension before it opens. The description says so
  (Q8).
- **Pay-ins.**
  - They go into accumulationTool.settings, with the shape in the table above.
  - The plan's figures come from potAtRetirement with `'override'`, so the Accumulation tool's own projection never
    replaces them.
  - savingsIn, the saving risk, the charge and alreadyDrawing have nowhere to go in today's plan. They are kept in
    fromAnswer only (Q10).
- **The start pot** is the middling pot at the stop. Careful is kept beside it but never used for the start: starting
  from careful and then testing again would count the caution twice.
- **The target** comes from `grossUpAnnual` in BudgetModel, the function today's spend box and budget hand-off use. It
  is applied to perMonth × 12 for each row.

**Must hold (seedToScenario tests).**
1. `grossToNet(amount, DEFAULT_TAX_BANDS) ÷ 12` is within £0.50 of each row's perMonth. One person's baseSalary nets back
   to spend.perMonth. DEFAULT_TAX_BANDS equal V7's BANDS.
2. `upgradeScenario(plan).changed` is false, and `timingPinPatch(S, pinTiming(S, budget, seed.today))` is null, so
   nothing is written when the plan is first opened.
3. `createSimulationConfigFromSettings({}, S)`: equityStart + bondStart + cashStart equals pension.atStop.middling (to
   within £3) on `'later'` plans, and pension.today on `'now'` plans. isaBalance follows the same rule.
4. Changing seed.budget changes nothing outside budgetTool. No field is set from the budget total or its essentials:
   no essentialsAnnual and no targetHeadroomMonthly.
5. No plan comes out locked, or with history, a plan document or holdings. taggedFunds is `[]`.
6. Couple: the takeHome rows of the two people add up to spend.perMonth in every stretch where the guaranteed income is
   below it.

### C.4 Names

`src/answers/shared/planName.js` is pure and imports only format.js. Both V7's box and today's confirm step use it.

```js
export const PLAN_NAME = { suggestMax: 50, typedMax: 60, sep: ' · ' };
export function suggestedPlanName(source, inputs, result)   // → string; '' when result.status !== 'ok'
export function checkPlanName(text)                          // → { ok: true, name } | { ok: false, problem: 'empty' | 'tooLong' }
export function withDuplicateSuffix(name, takenNames)        // → string
```

Money is shown with format.js `money()`, rounded to the nearest £10 (C's careful figure is already a whole £10). Ages
are whole years.

| Source | When | Pattern |
|---|---|---|
| C | money from now (`'now'`) | From {you.age} · £{careful} a month |
| C | starts later, and someone is paying in | Stop at {your age at the start} · £{careful} a month |
| C | starts later, and nobody is paying in | From {your age at the start} · £{careful} a month |
| A | — | Stop at {shown.age} · £{spend} a month |
| A | retired view (alreadyStopped) | From {you.age} · £{spend} a month |
| B | — | Stop at {stop.age} · £{spend} a month · paying £{payIn.now}. The last part is left out when payIn.now is 0 |
| Couple | any | The first part names both people: "Stop at {you} and {partner}" or "From {you} and {partner}", with the partner's age on the same date |

- The suggestion is never "My plan", and never empty when status is `'ok'`.
- A suggestion over 50 characters loses its last part (" · paying …"). The first two parts always fit (37 at most).
- `checkPlanName` cleans the text first: NFC form, control characters and line breaks removed, runs of spaces made one,
  ends trimmed. Then:
  - empty → `'empty'` ("Give the plan a name.");
  - over 60 characters (counted as characters, not bytes) → `'tooLong'` ("Keep the name to 60 characters or fewer.").
- `withDuplicateSuffix` cleans names the same way and ignores case. It compares against every plan name in the account
  (or in this tab, without an account), including the partner plan being made in the same save. It adds " (2)",
  " (3)" and so on, using the lowest number that is free.
  - Only today's app calls it, because only it can see the names.
  - The "Saved as" line shows the final name.
- Names the app builds (with the suffix, or " · partner") may go past 60 characters. Only what a person types is limited.

### C.5 The budget sheet

**V7 state.** There is one sheet, the household's. A and B share it now, and D and the plan will later. It is kept in
`pt_v7_draft` under `budget`, alongside the drafts.

```js
state.budget = {
  version: 1,
  lines: [{
    id: 'l7',                    // stable within the tab
    heading: 'home',             // 'home' | 'bills' | 'food' | 'gettingAbout' | 'holidays' | 'health' | 'family' | 'other'
    label: 'Council tax',        // starter lines use BudgetModel's catalogue label letter for letter, so its hints and typical amounts match
    amount: '150',               // as typed, as text (like draft values)
    period: 'mo',                // 'mo' | 'yr'
    essential: true,             // a starter line takes its catalogue tier
    starter: true
  }],
  oneOffs: [{ id: 'o2', label: 'New car', amount: '18,000', year: '2031', everyYears: '8' }],   // everyYears '' = once
  touched: []
}
state.draft.a.spendHow = null      // | 'lines' | 'one' — outside `values`, so never in the checked inputs (same for b)
state.draft.a.skipNoted = false    // the "you are skipping the budget" note has been shown
```

`values['spend.amount']` stays the one figure every answer uses. "Use £2,500" writes the total into it as text, and
nothing else ever does. SPEND_FIELDS and the answers do not change. A test checks that no file under
`src/answers/{a,b,c,shared}` imports `src/answers/keep/` or names `budget` outside comments.

**The check.** `checkSheet(sheet, { household })` lives in `src/answers/keep/budgetSheet.js`. It is pure and imports
BudgetModel. It returns:
- `lines`: `[{ heading, label, annual, period, essential }]`;
- `oneOffs`: `[{ label, amount, year, everyYears }]`;
- `totals`: `{ monthly, yearly, essentialMonthly }`;
- `problems`.

`monthly` is the sum of the lines' `annual` ÷ 12. One-offs are never added to it. Starter hints come from
`typicalMonthlyFor(label, { plsaTier, sharedWithPartner })`. They are shown and never filled in. The seed's `budget` is
the checked sheet (lines above £0 only) plus `totals` and `plsaTier`.

**Onto budgetTool.settings** (your plan). This uses BudgetModel's own line shape. Today's budget page keeps keys it does
not know, such as `heading`.

| budgetTool.settings | From |
|---|---|
| version, endAge | 1, seed.endAge |
| currentAge, currentAgeAsOf, agesSetByUser | p.ageToday, seed.today, true |
| retirementAge, retired | p.ageAtStop; stop.kind is `'now'` |
| plsaTier | spend.level, or `'moderate'` |
| sharedWithPartner, mySharePct | true for a couple, with `round(100 × you.takeHome[0].perMonth ÷ spend.perMonth)`. One person: false, 50 |
| partnerAge, partnerRetirementAge, partnerRetired | couple: the partner's ageToday, ageAtStop and retired, as createPartnerPlanReal sets them |
| lines[] | `{ label, tier: essential ? 'essential' : 'discretionary', annual, period, fromAge: null, toAge: null, hint: the catalogue hint or '', heading }`, plus `paidBy: 'shared'` for a couple. annual = the monthly amount × 12, exactly |
| oneOffs[] | `{ label, tier: 'essential', hint: '', amount, atAge: ageToday + (year − seed.today's year), everyYears: a number or null }` |

- **No sheet:** `defaultBudget(ageToday, ageAtStop, endAge)` plus the age rows above, and no lines. Today's page adds its
  starter lines the first time it is opened.
- **The partner's plan:** the same age rows from the partner's side, sharedWithPartner true, and no lines. There is one
  sheet, so there is one place to change it.
- **Round trip:** the lines match the sheet line for line. For one person, `annualNetAtAge(budget, ageAtStop) ÷ 12`
  equals totals.monthly.
- **Totals differ.** Today's page adds the yearly average of repeating one-offs to its own total (summariseBudget); V7's
  total does not. Both are only guides (Q14).

### C.6 Open questions, with the answer recommended

| # | Question | Recommended |
|---|---|---|
| 1 | Should the button say "Save this as a plan" (this design) or "Keep" (language guide 3.6, and the `keep` step already on the A, B and C rails)? | Use "Keep this as a plan" and "Kept as '…'" on V7 screens, with the `keep` step holding the box. The owner chooses once. |
| 2 | The line under the button says "guest trial", but "guest" is banned on V7 screens. | "Keeping a plan needs a free account, or you can carry on without one in this tab." |
| 3 | Which pot at the stop does each person get: their own middling (`saving[j].potAtStop`), or their share of the household's middling life (`byPerson`, which only A and C have)? | Their own middling. All three questions have it, and one person gets the same figure either way. |
| 4 | Which pay-in does B carry and name: the one typed, or the one that gets there? | The one typed, because the pots at the stop were worked out from it. To keep the other one, try it in B and save again. |
| 5 | What is C's figure when "Take £x a month" is showing? And when `closedYears` is set, so there is no headline? | Always the careful figure. With `closedYears`, saving is not offered ("Change the start age to keep this"). |
| 6 | Can a result whose status is not `'ok'` be saved (C guaranteed-only, B out of reach, A none)? | No. An A verdict of "no" is still a try, so it can be saved. |
| 7 | Is a couple two linked plans, the partner's named "{name} · partner", with a one-way link? | Yes, as today's app does it. The Household tab does not change. |
| 8 | What happens when someone stops before the pension opens, with savings? Today's planner cannot keep a pension closed. | Map it as it is, and say so in one line on the plan. No hidden approximation. |
| 9 | Which of V7's assumptions go into the plan: a quarter tax-free on every withdrawal, cuts off, final-salary rises? | Carry the first two: they are the answer's assumptions, and the person can change them. Set final-salary rises to what the household states (`'lpi5'` by default), which is how today's planner treats them; V7's engine uses full price rises. |
| 10 | A pot of £0 today with money going in (or savings of £0 with savingsIn) cannot be scaled by potScaleOf. And savingsIn, the saving risk, the charge and alreadyDrawing have no place in the plan. | Write the middling at the stop as the plan's pots, so the scale is 1. Keep the true £0 in fromAnswer and in the Accumulation tool's potNow. Keep the rest in fromAnswer only. |
| 11 | Decision tool settings: the wizard's (duration and first tax year), or a full copy (seedDecisionFromStress)? | The wizard's. Nothing is recorded until the person chooses to, and "Copy from Stress" is one press. |
| 12 | Making the new plan active sets `isActive` to false on the plan that was active, which may be a locked one. | Accept it: it is the same write as choosing a plan in the menu. The locked-plan browser test compares every key except `isActive`. |
| 13 | Without an account a tab keeps one plan (`guestOnePlanGate`), and `startGuest` deletes the tab's plans. | Seed saves skip the gate and use `startGuestForSeed`, so "two saves give two plans" holds without an account too. |
| 14 | Should one-offs go into today's budget, whose total then includes their yearly average? | Yes. Both totals are guides, and neither moves the target. |
| 15 | index.html's inline script is at its limit (10,585 lines; `shellRatchet.test.js`). | Put the logic in the two new modules. The inline script gets only the import and the calls (8 lines at most). Raise MAX_LINES by exactly that in the same change, with the reason. |
| 16 | Does "Not now" delete the seed? | Yes. V7's tab still has the figures: Back, then Keep again. |
| 17 | What if a person types "My plan"? | Allow it: they chose the name. The rule is only that the app never puts it there. |
| 18 | The privacy policy's browser-storage paragraph does not list the seed (figures and budget lines, including health spend, for up to a day) or V7's `pt_v7_draft`. | Add one sentence for each to PRIVACY_POLICY.md and public/privacy.html, plus a GDPR_TODO entry, before the release that ships today's side. Both are cleared by sign-out, Reset and Delete Account. There is no new processor and no new Firestore path (still `users/{uid}/scenarios`, under the same rules). |
| 19 | Which release ships today's side? | A patch release, 6.17.1, listed with a note but no pop-up: live users cannot reach the new way in except from the unlinked preview. It becomes visible at 7.0.0. |
| 20 | What if the seed is used after midnight or across 6 April? | Every date and age comes from seed.today, so the plan matches the answer. |

### C.7 Changes after the review of 1 Oct 2026 (built; supersede C.2–C.3 where they differ)

The persona and adversarial reviews found faults in the built contract. What changed, in contract terms:

- **What became of a seed — the receipt.** V7 took any missing seed to mean "the plan was made", so after "Not now"
  (or Escape, a refused seed, a sign-out, another tab) it said "Saved as …" and ticked the step. Today's app now leaves a
  receipt in the TAB's session storage, `sessionStorage['pt_v7_plan_receipt']` = `{ [createdAt]: { outcome, name? } }`,
  outcome `'made'` (with the final name) | `'declined'` ("Not now", or the box closed) | `'refused'` (a seed it could not
  use, or one used/replaced elsewhere) | `'cleared'` (sign-out). The last eight only; no figure but the name. V7
  (`effects/planSeed.js seedOutcome`) says "Saved as ‘{final name}’" only on `'made'`; "Not saved: you chose not to make
  … in the planner" on `'declined'`; "‘…’ was not saved as a plan" on `'refused'`/`'cleared'`; and nothing at all when
  the seed is gone with no receipt (another tab). The rail's save step is done only on `'made'`.
- **Compare-and-delete.** `clearSeed(storage, createdAt)` removes the stored seed only if it is the one used: an older
  seed's "Not now" or save never deletes a newer one written meanwhile. Sign-out (`dropSeed`) removes whatever is there.
- **Re-read before a save.** `confirmAndCreate` reads the stored seed again after the name is confirmed; if it is gone or
  replaced, nothing is made ("These figures were used or replaced in another window…") — two windows never make two
  plans from one seed.
- **Never used after a day — and deleted.** V7's start-up (and a return from the back-forward cache) deletes a stored
  seed over a day old or unreadable, whichever tab wrote it; today's app already does on every start. Every sign-out
  deletes it (`onAuthStateChange`: a signed-in user becoming nobody — the menu, the idle timer, the verify-email
  screen), not only the menu's Logout. The privacy wording says "never used after a day … deleted … otherwise the next
  time you open PensionTools or the preview pages", which is what the code can promise.
- **Blocked storage.** NewPlanFromSeed reads both storages through one guarded handle; with none it is a do-nothing
  entry, and index.html wraps the start-up call. The page always starts.
- **"Just try it" keeps the tab's plans.** The landing page's no-account button, in a tab that holds plans, carries on
  with them (`tryWithoutAccount`, as "carry on without an account") and says so; `startGuest` never deletes a plan with
  `fromAnswer`.
- **Words (C.3's description and the note).** "may differ a little" is gone. Line 2 gives the reason and the quick
  answer's own figure: "This plan starts from the middling pot at 60 and does not vary the years before you stop, so its
  tests can differ from the quick answer, where the money lasted to 95 in 4 futures out of 10 (43%)." ('now': "The
  planner runs its own test, so its figures can differ …"). A couple's plans get line 3: "This plan holds your part of
  the £2,650 a month (£1,896 from 62, …); your partner's part is in ‘…’. Savings are split evenly between you. The
  Household tab checks the two plans together." (names are the FINAL names). The confirm line says money still going in,
  and for B the pay-in the answer worked out: "paying in £1,050 a month as now (the answer suggested about £4,660)".
- **The planner's own screens on these plans.** The Budget page shows its total as a guide beside the plan's own target
  (never "what your plan funds" / "the target both tools work to"); the income-shape chart marks "your budget (a
  guide)". For every plan retiring later, Monte Carlo/History/Scenarios say the runs start from the pots at retirement
  (they said today's pots), and with pots at retirement in the Timing boxes the line says THOSE price the strategies, the
  projection being for comparison. The Household tab reads the income steps the engines run (it read only a saved
  schedule). PlanTiming reads `currentAgeAsOf` as a local day (west of Greenwich it was a year out).
- **Still the owner's to decide:** whether "Use as the start of my income shape" stays on the Budget page of a plan made
  from a V7 answer (it is the one button that turns the budget into the target); whether the release is 6.17.1 (Q19) or
  6.18.0, now that live users see the corrections above.
