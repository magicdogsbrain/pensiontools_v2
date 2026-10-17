# Editing in V7, one step at a time: "About you and when" first (design, 17 Oct 2026)

The owner's rule: V7 is "V6 made much more usable", not wizards to V6. "Your plan" (your-plan.md, shipped 6.26.0) shows a
saved plan read-only. The audit (v6-usability-audit.md §2.4, §3.1–3.4; decision 1(a) of §5, approved) moves the planner's
editing into V7 after it, one step at a time: About you and when; Money that comes in anyway; What you spend; Your pots and
tax; Does it last?. **Each writes the same saved settings as today, so the data model does not change.** This document is
the first step, and the rule change every later step builds on.

Companion documents: your-plan.md (the read-only plan pages, the hand-over, the sign-in session); architecture.md §3.2 (the
draft); rail-screens-language.md and src/v7/copy/banned.js (the words).

---

## 1. The write rule, after this change

Until now rule 3 of tests/v7/boundaries.test.js proved that V7 could reach **no** write (your-plan.md §4.1). From this step
V7 writes a plan, on purpose, under a rule that is as strict in a different way:

- **3a. Reach** is unchanged: the walk from V7's entry points reaches nothing under src/storage, src/firebase or src/workers
  but the five pure files.
- **3b. Firebase: two files, each with its own names.**
  - `src/v7/effects/planSource.js` reads: `firebase/app` (`initializeApp`), `firebase/auth` (`getAuth`, `setPersistence`,
    `browserLocalPersistence`, `onAuthStateChanged`, `signOut`), `firebase/firestore/lite` (`getFirestore`, `collection`,
    `getDocs`).
  - `src/v7/effects/planWrite.js` writes: `firebase/firestore/lite`, and from it **only `doc` and `updateDoc`**.
  - Every other imported name, in either file, fails the test; no third V7 file may import a firebase package.
- **3c. Write words.** `updateDoc` may appear in `planWrite.js` only. `setDoc`, `addDoc`, `deleteDoc`, `writeBatch` and
  `runTransaction` may appear nowhere V7 can reach. So V7 can update fields of a plan that exists; it cannot create, delete
  or replace one, and cannot touch two plans in one write.
- **3d. Browser storage.** The table gains a row: `planWrite.js` may name `pt_guest_scenarios` and is the only V7 file that
  may write it (`setItem`), and then only the plan being edited: every other plan in the text is byte-identical after a
  write (tested). `planSource.js` still reads it with `getItem` only.
- **3e. Field paths (new).** Every write `planWrite.js` sends is a map of dotted field paths. Each path is in the step's
  declared list (`src/answers/plan/schema.js` `ABOUT_WRITES`) or is the planner's own bookkeeping (`lastModified`, the stamp
  `FirestoreService.saveScenario` puts on every save, so the planner reads the plan as its own). A property test
  (tests/v7/plan/planWrite.test.js) drives the effect with random typed boxes and random plans and fails on any other path.
- **3f. The lock.** Every write passes `src/services/LockedPlanGuard.js` (`isLockedSettings`, then
  `lockedPlanWriteRefusal` on the plan as read) before anything is sent; a locked plan is refused even when the screen is
  bypassed and an action is dispatched by hand. Signed in, the account's plans are read again (one `getDocs`) just before the
  guard runs, so a plan locked from another device since this page opened is seen as locked. The server rules allow the
  owner to write, so these tests are the guarantee, as before.
- **3g. The session.** Whether anyone is signed in, and the unverified-email case, are `planSource.js`'s (your-plan.md
  §4.3). `planWrite.js` takes its Firestore handle and the signed-in user from `planSource.js` and makes no Firebase app of
  its own. Nobody signed in and no plan in the window: nothing is written. Without an account: written only when the free
  time is not used up (`pt_guest_minutes`, read as `planSource.js` reads it).

What a later step inherits: the one write file, the declared-paths test, the guard, the guest path, the draft rules of §6.
A later step adds its own declared list and its own pure reader/writer under `src/answers/plan/`; it never adds a Firebase
name.

---

## 2. This step's screen and words

Address: `#/plan/<id>/about`. A sub-step of "Your plan": wherever a stage lists `plan` ("Your plan" / "Your plan as
locked"), the plan step's "About you" section links here (`steps.js` `SUB_STEPS`, `subStepsFor`). The rail is the plan's
rail; the sub-step is not a rail step of its own.

Each fact is asked ONCE, by age, in plain English. Derived figures are shown, never asked.

```text
+----------------------------------------------------------------------------+
| YOUR PLAN  ‘{Saving plan}’                                                 |
| Stopping work within five years.                                          |
|                                                                            |
| About you and when                                                         |
|                                                                            |
| Your age today                 [ 58 ]                                      |
|   From your plan, saved 22 August 2026 (58).                               |
| Have you stopped work?         ( ) I have stopped                          |
|                                (x) I will stop at an age                   |
|                                    The age you stop   [ 62 ]               |
|                                    From your plan, saved 22 August 2026.  |
|                                ( ) I will stop in a month  [ 2030-06 ]     |
| Plan to age                    [ 93 ]                                      |
|   From your plan, saved 22 August 2026 (93).                               |
|   Suggest from how long people live:                                       |
|     ( ) a man  (x) a woman   ( ) 1 in 10 live beyond (cautious)            |
|                              ( ) 1 in 4 live beyond  ( ) half live beyond  |
|     [ Suggest ]  → "Age 97: 1 in 10 women of 58 live beyond it."           |
|                                                                            |
| What this works out to                                                     |
|   You stop work in January 2030, at 62.                                    |
|   The plan's first tax year is 2029/30 (from 6 April 2029).                |
|   Your plan runs 32 years, from January 2030 to age 93.                    |
|   Income steps start at age 62.                                            |
|                                                                            |
| [ Save ]  [ Cancel ]                                                       |
+----------------------------------------------------------------------------+
   after Save: "Saved. Your plan now runs to age 93.  [Undo]"  (15 seconds)
```

- **Boxes** (`src/answers/plan/schema.js` `ABOUT_FIELDS`), by path:
  - `age` (age, 18–100, required): "Your age today".
  - `stopped` (choice: `yes` "I have stopped work", `age` "I will stop at an age", `month` "I will stop in a month").
    "I have stopped work" is read as "taking money from the plan now" too: the planner's `retired` flag has no other meaning.
  - `stopAge` (age; above the age today; at most 85) when `stopped = age`.
  - `stopMonth` (a month, "2030-06" or "June 2030"; after this month) when `stopped = month`. The plan holds an age, not a
    month, so the month is turned into the age reached in it (`PlanTiming.ageOnDate`) and the plan's own month for that age
    is shown back ("Your plan takes that as stopping at 62, in January 2030") — honest about what is saved.
  - `startWhen` (choice: `now` "this tax year, {2026/27}", `april` "next April, {2027/28}", and `saved` "{2025/26}, as saved"
    only when the saved year is neither) when `stopped = yes`. This is the plan's timing anchor, `firstTaxYear`
    (PlanTiming.js; the 6.4.0 Timing block). When stopping later it is not asked: the first tax year is the year the stop age
    is reached, and the derived line says so.
  - `endAge` (age; at least the first year's age + 4, at most 110): "Plan to age". Stored as the planner's `duration`:
    `endAge = shapeAgeNow + duration − 1` (the planner's "— to age" hint, `describeTiming`). The length boxes the planner
    derives (years, the first tax year, the start month, the start age, the months before the start) are shown under "What
    this works out to", never asked.
  - `sex` (choice `m`/`f`) and `chance` (choice `10`/`25`/`50`) feed **"Suggest from how long people live"** — the planner's
    own helper (`LongevityModel.longevityAge`) — which fills `endAge`. Neither is saved.
- **Source lines.** Beside each box: "From your plan, saved {date}" (the plan's `lastModified`; the age's own date,
  `currentAgeAsOf`, for the age box — the age as recorded, which the engines age forward from that day, as the planner's
  own box shows it), or "As saved in the plan" when it has no date; the saved value in words ("(58)"). A locked plan:
  "Fixed when you locked the plan on {date}" once, figures only, no boxes.
- **"Not used by this way of drawing."** `aboutOf` returns `notUsed`: the paths the plan's strategy ignores. Today every
  strategy reads all of these settings, so the list is empty for every strategy; the screen draws the sentence under any
  path listed, and a later step (pots at the stop, cash years) fills it.
- **Problems**, in plain words (`src/v7/copy/about.js` `errors`): a missing or impossible age; a stop age not above the age
  today; a month that has passed; an end age before the plan has run five years. Shown after a box is left or Save is
  pressed, as every V7 form does (the `touched` / `asked` convention).
- **Save and Cancel.** Save checks every box, writes once, reads the plans again, clears the draft and shows the Undo toast
  ("Saved. {one derived sentence} [Undo]", 15 seconds; `src/v7/components/UndoToast.jsx`, the Preact counterpart of
  `src/ui/undoToast.js`). Undo writes the previous values back with one more write, then the toast goes. Cancel clears the
  draft and returns to "Your plan".
- **After a save** the plan's stored "will it last" answer is older than its inputs (§4, "The stale answer"). The plan page
  says "Your ‘will it last’ answer was worked out on {date}, before the plan was changed on {date}." and the next sentence
  becomes "Next: check it still lasts." with "Check it still lasts (in the planner)" — the existing hand-over to the run
  (`openPlace.js`, place `test`) until the V7 "Does it last?" step exists.
- **Phone first.** One column at 390 px, no sideways scroll; every control is a real `<label for>` / `<fieldset>`; Enter
  saves; Escape does nothing surprising.

---

## 3. Keys written

The planner's Timing block and Save write these (index.html `timingSettingsFromForm`, `timingFieldsForSave`,
`syncBudgetAgeFromTiming`, the Stress Save's Decision sync). V7 writes the same keys, as dotted field paths, and nothing
else. A key is sent only when its value changes.

| Path | Value | As the planner writes it |
|---|---|---|
| `stressTool.settings.currentAge` | the age typed, or null | `timingSettingsFromForm` |
| `stressTool.settings.currentAgeAsOf` | kept when the age is unchanged; today's local day when it changed; null with no age | the same |
| `stressTool.settings.retired` | `stopped = yes` → true; an age or month → false; no age → as stored | the same |
| `stressTool.settings.retireAge` | the stop age (or the age reached in the stop month); null when stopped | the same |
| `stressTool.settings.firstTaxYear` | stopped: the year chosen; stopping later: null (derived from the age); no age: as stored | the same |
| `stressTool.settings.shapeAgeNow` | `deriveTiming(next).shapeAgeNow` | `timingFieldsForSave` |
| `stressTool.settings.duration` | `endAge − shapeAgeNow + 1`, at least 5 | the Save's `duration` |
| `decisionTool.settings.firstTaxYear` | `deriveTiming(next).firstTaxYear`, when the plan has an age | the Stress Save's Decision sync (drafts only — a locked plan is never written) |
| `budgetTool.settings.currentAge`, `.currentAgeAsOf`, `.retired`, `.retirementAge` | the age, its date, the flag, the stop age (or the start age) — only when the plan has a budget | `syncBudgetAgeFromTiming` ("Age today lives in two places: whichever was edited last wins") |
| `lastModified` | now, ISO | `FirestoreService.saveScenario` stamps every save |

Not written by this step, and why:

- `potAtRetirement` (pots at the stop, typed): the audit's §3.4 lists it under this step, but it is a pots question in a
  person's words and the typed override is a gap row of its own (`timing.pots-typed`). It comes with "Your pots and tax",
  or a second pass here. Left as stored, it changes nothing on a plan that has stopped (`potScaleOf` runs in `future` mode
  only).
- `spStartDate`: a "money that comes in anyway" fact.
- `staleDraftDismissedFor`, `legacyFirstTaxYear`: bookkeeping the planner's own banner and load path own.
- The partner's ages: on the partner's plan (§4).

The write is `updateDoc(doc(db, 'users', uid, 'scenarios', id), patch)` for an account, and for a window without an
account the same patch folded onto the one plan in `sessionStorage['pt_guest_scenarios']` (a dotted path set on the parsed
plan, as `scenarioMigration.normalizeScenario` folds the planner's own guest saves), the list written back with
`JSON.stringify`, so every other plan's text is unchanged byte for byte.

Undo is the same write with the previous values, the plan's `lastModified` among them: the plan is then as it was, byte for
byte, its last-changed stamp included (the content is the content of that day). A key that was absent before is written
back as `null` on an account (`updateDoc` cannot delete without `deleteField`, which is not an allowed name; every engine
reads null and absent alike for these keys) and deleted in the window's text.

---

## 4. Locked, guest, partner and stale cases

- **Locked** (`decisionTool.settings.locked`): the page is read-only — the figures from the plan document's `timing`
  (`currentAge`, `retireAge`, `mode`, `firstTaxYear`, `shapeAgeNow`), the length from the document's `timeline` or
  `assumptions.duration`; "Fixed when you locked the plan on {date}" once; the unlock sentence once, as "Your plan as
  locked" has it. No box, no Save. The effect refuses a `plan/save` for a locked plan whatever the screen did (§1, 3f).
- **Shown as saved** (newer than this version, or the upgrade failed): read-only, the same sentence as the plan page.
- **Not in this account:** "That plan is not in this account." with the way to the list, as the plan page does.
- **Nobody signed in, plans in the window:** editable while the free time is not used up; "In the planner, press ‘Just
  try it — no account’ to carry on with this plan." stays at the top. Used up: the boxes are drawn but Save says "Your free
  time without an account is used up. Sign in to keep and change this plan." and nothing is written.
- **Nobody signed in, no plans:** the plan page's own "Sign in to see your plans."
- **Couples (linked plans).** The partner's ages live on the partner's plan. The page says "{Sam}'s ages are on {Sam}'s
  plan." with a link to `#/plan/<theirId>/about` for every plan linked either way (your-plan.md §6). One save writes one
  plan; the partner's plan is never written from here.
- **The stale answer.** A plan made from a V7 answer carries `fromAnswer` (PlanSeed.js): the answer as it was, the
  person's `ageToday`, their stop (`stop.kind`, `ageAtStop`) and `years`, and `savedOn`. The answer is **older than its
  inputs** when the plan's settings no longer match them: the age today, whether they have stopped, the stop age, or the
  length. `answerAge(plan, settings)` in `src/answers/plan/about.js` is that rule (pure; no new key is stored: the inputs
  themselves are the record). The plan page then shows the sentence of §2 and the next sentence `P.recheck`, tried after
  `P.working` and before `P.stale`, so a draft whose start year has passed is still told that first. A change made in the
  planner is caught by the same rule. A plan with no stored answer has nothing to be stale.
- **The draft.** `state.draft.plan = { id, values, touched, asked }` holds what was typed for ONE plan, keyed by field
  path, in `pt_v7_draft` with the other drafts (session only). It is cleared when the address names another plan, on Save
  (after the write), on Cancel, and when the plans are cleared from memory (sign-out, pagehide). It holds text typed into
  these boxes and nothing of the plan (your-plan.md §3.8 stands).

---

## 5. Tests

| # | Test | Kind | Proves |
|---|---|---|---|
| E1 | `aboutOf` on the 12 corpus plans × 3 dates: boxes, sources, derived lines; `boxesOf` → `aboutPatch` → `applyPatch` → `boxesOf` is identity (property test over random plans and typed boxes, fast-check); a patch names only `ABOUT_WRITES` paths; every other byte of the plan is unchanged | unit | the pure read and write |
| E2 | `answerAge`: a plan with `fromAnswer` matching its settings is not stale; each of the four facts changed makes it stale; no `fromAnswer` is never stale; `P.recheck` in `NEXT_ORDER` and on the page | unit | the stale rule |
| E3 | `subStepsFor` for every stage × locked × linked; `planPage` on every corpus plan × 3 dates carries `about` on the plan step iff the stage lists `plan` | unit | the step tables |
| E4 | `planWrite.test.js` with a fake `firestore/lite` recording every call: refuses a locked plan (guard), a plan not in the list, nobody signed in with no window plan, the used-up window; writes exactly the declared paths plus `lastModified`; the window's text byte-identical elsewhere; Undo writes the previous values; the account path reads again before the guard | unit | §1 3e–3g |
| E5 | Boundary rule 3 rewritten: 3b per file, 3c `updateDoc` only in `planWrite.js`, 3d the guest key written only there | static | §1 |
| E6 | Render: the about page for every unlocked corpus plan (boxes with labels, sources, derived lines, no banned word, no countdown for a retired stage); a locked plan: no box, "Fixed when…" once; a plan not found; the toast | jsdom | §2, §4 |
| E7 | Reducer: `plan/edit` keeps text as typed and refuses an unknown path; the draft is cleared on another plan's address, on save, on cancel; the draft store keeps and cleans it | unit | §4 |
| E8 | Browser (prod build, guest only, outside requests blocked): plant a plan made from an answer → `#/plan/<id>/about` → change the stop age and the end age → Save → stored text differs only in the declared keys → the plan page shows the stale line and "Check it still lasts" → Undo → byte-identical. At 390 and 1440 | Playwright | the whole step |

Owner-plan tests (`tests/fixtures/local/`) are skipped here: the folder does not exist in this checkout.

---

## 6. What later steps reuse

- `src/v7/effects/planWrite.js`: `startPlanWrite(store, { session, local, now, handles, fb })` and the `plan/save` →
  `plan/saved` / `plan/saveFailed` actions. A later step registers its declared writes (`WRITES` in
  `src/answers/plan/schema.js`) and a pure `patchOf`; the effect stays one file.
- The guard call, the re-read before an account write, the guest fold, the Undo write.
- `src/answers/plan/schema.js`: the field list shape (`path`, `type`, limits, `when`), checked by the same rules as the
  questions' lists where they fit; the derived-lines convention (`derived.lines`, each with an id and words from copy).
- `src/v7/components/UndoToast.jsx` and `EditField.jsx` (a box drawn from a plan field, with its saved value and source
  beside it).
- The parity ledger's `editV7` flag on a row: the file that edits it in V7. "Money that comes in anyway" flags the
  State Pension, final-salary and other-income rows the same way.

---

## 7. "Money that comes in anyway" (the second step, 17 Oct 2026)

The audit's second row (§2.4): the State Pension — full, the forecast amount, or none — with "assumed £X from age N" said
wherever the plan uses it; each final-salary pension by its **start age** and how it rises; other income that comes in
anyway; income for some years, by start and end age; lump sums you expect, by age; and the April 2028 note where it
applies (couples-different-years.md §12). Each fact asked once, by age, in today's money, **before tax** — every key of this
step is a before-tax figure in the planner (the State Pension and a final-salary pension are taxable income; income streams
"fill your bands like other income"; a lump sum is an amount, not income), so every label says "before tax" and nothing here
is after tax. Derived figures shown, never asked. It inherits §1 and §6 whole: one write file, the declared-paths test, the
guard, the guest path, the draft rules.

### 7.1 The screen and words

Address: `#/plan/<id>/income`, a sub-step of "Your plan" beside `about` (`steps.js` `SUB_STEPS.plan`, `routes.js`
`PLAN_SUB_STEPS`). On the plan page the "Pots and other income" section is split: "Pots" keeps the pots (still the planner's
hand-over) and a new section "Money that comes in anyway" lists the State Pension, final-salary pensions, other income, income
for some years and lump sums, with "Change this here" to this step ("See these" on a locked or shown-as-saved plan).

```text
| Money that comes in anyway                                                   |
|                                                                              |
| State Pension                                                                |
|   (x) The full amount, £12,548 a year   ( ) My forecast   ( ) None           |
|       [ 230.25 ] a week before tax, from your forecast  (shown for forecast) |
|       From your plan, saved 22 August 2026 (my forecast, £230.25 a week)      |
|   → State Pension: £11,973 a year before tax from age 67 (tax year 2034/35).  |
|   (a plan with no figure: "Every run assumes £12,000 a year from age 67 …"   |
|    and a fourth choice "Leave it as assumed" is offered until one is chosen)  |
|                                                                              |
| Final-salary pensions                                                        |
|   ┌ Final-salary pension 1 ──────────────────────────────┐                   |
|   │ £ a year before tax, today's money  [ 9,400 ]          │                   |
|   │ Starts at age                        [ 65 ]            │                   |
|   │ How it rises  (x) with prices, capped at 5% a year     │                   |
|   │               ( ) with prices  ( ) not at all          │   [Remove]        |
|   └────────────────────────────────────────────────────────┘                   |
|   [ Add a final-salary pension ]                                             |
|                                                                              |
| Other income for the whole plan       [ 1,200 ] a year before tax            |
|                                                                              |
| Income for some years        (cards: name, £ a year, from age, to age or blank,|
|                               how it rises)   [ Add income for some years ]  |
| Lump sums you expect         (cards: name, £ once, at age, what it is:       |
|                               a cash lump sum / an inherited pension /       |
|                               an inherited ISA)   [ Add a lump sum ]         |
|                                                                              |
| What this works out to                                                       |
|   State Pension: £11,973 a year before tax from age 67 (tax year 2034/35).   |
|   Final-salary pension: £9,400 a year from age 65 (tax year 2032/33), going  |
|     up with prices, capped at 5% a year.                                     |
|   Rental flat: £7,200 a year from age 60 to age 74 (15 years), going up …    |
|   Downsizing: £90,000 at age 69 (tax year 2036/37), a cash lump sum.         |
|   [the 2028 note, when it applies]                                           |
| [ Save ]  [ Cancel ]                                                         |
```

- **State Pension** (`spKind`: `full` the full new State Pension, £241.30 a week (said as £12,548 a year: a plan page shows
  whole pounds) — V7's own figure, `RULES.fullStatePensionWeekly`, the planner has no "full" button; `forecast` with
  `spWeekly`, £ a week before tax as the forecast letter quotes it and as the planner's own key holds it; `none`). A plan with no figure (no date, no weekly amount) is what the planner calls
  **assumed**: every run uses the old yearly figure (`statePension`, £12,000 by default) from the plan year
  `IncomeSchedule.defaultSpYear` gives (age 67 by default). The screen says so in the planner's own words, and a fourth
  choice `assumed` ("Leave it as the planner assumes") is offered only while that is the saved state, as step 1 offers
  "as saved" — so a person adding a lump sum is never forced to settle the State Pension first.
- **The date.** The planner asks for the date on the forecast; it is also the birthday every age is reckoned from
  (`PlanTiming.birthdayOf`), so a saved date is **never changed here**. A plan with no date that chooses full or forecast
  gets one worked out as V7's answers do (`household.js` `bornFromAge`, `wholeStatePensionAge`): the day the person reaches
  their State Pension age, counted from the day their age was recorded (`currentAgeAsOf`) — the very day the planner
  already takes as their birthday, so no age moves. Written as `YYYY-MM-DD` (what `PlanSeed` writes; the planner parses it).
- **Where it is used.** "State Pension: £X a year before tax from age N (tax year Y)" from the planner's own rule for the
  plan year (`spSimConfigFromSettings`: the tax year of the date less the plan's first tax year; the age is the start age
  plus that), the rule every strategy page and order sheet uses; a date before the plan's first year says "already being
  paid when the plan starts".
- **Final-salary pensions** as cards: £ a year before tax in today's money, starts at age, how it rises (`lpi5` with prices
  capped at 5%, `cpi` with prices, `level` not at all — the planner's three). The planner holds **one** such pension
  (`dbAmount`, `dbStartYear`, `dbStartAge`, `dbIndexation`); a second or third goes into the planner's own
  "income for some years" list (`extraIncomes`) as a row with no end and the label "Final-salary pension" — the planner
  reads it as taxable income for life rising the same way, which is what a final-salary pension is to the engine
  (`stressTest.lumpyByYear` treats both alike). Reading back, a row with that label and no end is a final-salary card again.
  A start after the plan's end is refused as the planner refuses it (`dbStartSetting.dbStartWords`); a start before the
  plan's first year is allowed and said ("counted as already being paid from the plan's first year").
- **Other income for the whole plan** (`other`): £ a year before tax from the plan's start, rising with prices capped at 4%
  (the planner's rule, said under the box).
- **Income for some years** as cards (`extraIncomes` rows): name, £ a year before tax, from age, to age (blank = for the rest
  of the plan), how it rises. **Lump sums** as cards (`windfalls` rows): name, £ once, at age, what it is (a cash lump sum,
  an inherited pension, an inherited ISA — the planner's `wrapper`). Where a cash lump sum can legally go and what its taxable
  part is held in (`mix`, `toIsa`) are the planner's (TaxableSleeve.routeWindfall) and are kept as stored, never asked here.
- **Ages, not plan years.** The planner stores plan years for everything but the State Pension. The one rule, the planner's
  own (`dbStartSetting.dbStartYearOfAge`; `PlanDocument.shapeLayersFromSettings` the other way): **plan year = age − the
  plan's start age** (`deriveTiming().shapeAgeNow`, the age reached in the first tax year). Negative means before the plan
  starts. Tested against those functions.
- **The 2028 note.** Shown under "What this works out to" when the plan has a pension pot, the person stops (or has stopped)
  before 6 April 2028, and is 55 or 56 on that day (`apart.js` `before2028`, on the plan's own dated age): "Move into
  drawdown what you will need before 57 by 5 April 2028: after that, nothing new can be taken until you are 57." — the words
  the answers use.
- **Not used by this way of drawing.** `notUsedBy(strategyId)` returns the paths the plan's strategy ignores; every
  strategy reads all of these (`lumpyByYear` feeds the pot engines and the ladders alike), so the list is empty today and the
  screen draws the sentence under any path listed.
- Problems in plain words; Save, Cancel, Undo, the toast ("Saved. State Pension: £11,973 a year from 67. 1 final-salary
  pension, 2 incomes for some years, 2 lump sums.") as step 1. Phone first: one column at 390 px, cards not a table.

### 7.2 The draft: cards without a new shape

The draft stays text by path (keptPlanDraft keeps strings only). A list is a comma-separated list of card ids at
`<list>.ids` ("0,1,n1"): saved cards are `0`, `1`, … in the order read; a new card is `n1`, `n2`, …; Remove drops the id,
Add appends one. A card's boxes are `<list>.<id>.<field>` (`fs.0.amount`, `lumps.n1.atAge`). `schema.js` `isPlanEditPath`
is the one rule the reducer, the draft store and the screen share; `ABOUT_PATHS` stays as it is.

### 7.3 Keys written

`INCOME_WRITES` (schema.js), all under `stressTool.settings`, as the planner's Stress Save writes them (index.html
`saveStressSettings({…})`, lines 10099–10107). The planner's Stress Save does **not** copy these to the Decision settings
(only the target and the first tax year are synced), so no `decisionTool` key is written. A block is written only when its
boxes changed, so a plan saved as it is writes nothing.

| Path | Value | As the planner writes it |
|---|---|---|
| `spWeeklyAmount` | the weekly figure; 0 for none | the Weekly Amount box (`+value || 0`) |
| `spStartDate` | kept; set only on a plan that had none and now has a State Pension | the SP Start Date box |
| `statePension` | 0 for none (else the engine assumes £12,000: `createSimulationConfigFromSettings`); weekly × 52 otherwise | what `PlanSeed` writes for a plan from an answer — the planner's own Save leaves the old field alone |
| `dbAmount`, `dbStartYear`, `dbStartAge`, `dbIndexation` | the first final-salary card (`dbStartYear = age − start age`, `dbStartAge = age`); `dbAmount` 0 with no card | `dbStartAgeForSave`, the hidden year, the select |
| `other` | the box, 0 when blank | `+value` |
| `extraIncomes` | the whole list: the planner's rows kept byte for byte where their card is unchanged, edited rows merged onto the stored row (unknown keys kept), removed cards dropped, new cards appended (`{ label, annual, startYear, endYear, indexation }`) | `window._ssExtraIncomes` filtered to `annual > 0` |
| `windfalls` | the same for lump sums (`{ label, amount, year, wrapper }`, `mix`/`toIsa` kept) | `window._ssWindfalls` filtered to `amount > 0 && year != null` |
| `lastModified` | now, ISO | every save |

Not written: `statePensionYear` (the planner's old plan-year, read only without a date); `decision.*` copies;
`extraWithdrawals` (spending, not income — "What you spend"); the Decision tool's per-year "other income" (actuals).

### 7.4 Locked, guest, partner and stale

As §4. Locked: figures only — the State Pension from the plan document's `assumptions` (`spStartDate`, `spWeeklyAmount`),
the rest from the settings the lock froze — "Fixed when you locked the plan on {date}" once, the unlock sentence once, no
box. The partner's State Pension and pensions are on the partner's plan: "{Sam}'s State Pension and pensions are on
{Sam}'s plan." with the link to `#/plan/<theirId>/income`. The stale-answer rule (`answerAge`) gains two facts the answer's
record carries (`fromAnswer.people[0].statePension`, `.finalSalary`): the State Pension a year (rounded to the pound) and
the final-salary pension a year; a record without them is judged on the timing facts alone, as before. After a save the
plan page's stale line and "check it still lasts" follow unchanged.

### 7.5 Tests

| # | Test | Proves |
|---|---|---|
| I1 | `tests/v7/plan/income.test.js`: `incomeOf` on the 12 corpus plans × 3 dates; read∘write∘read identity over random plans, random cards in any order and random typed boxes (fast-check); only `INCOME_WRITES` paths; every other byte unchanged; Undo byte for byte; age↔year against `dbStartSetting.dbStartYearOfAge`/`dbStartAgeOf` and `PlanDocument.shapeLayersFromSettings`; the written State Pension read back by `spSimConfigFromSettings` at the typed age; the 2028 rule on dated ages | the pure read and write |
| I2 | `tests/v7/plan/incomeRender.test.js`: every corpus plan × 3 dates (boxes with labels, every figure sourced, no banned word, no countdown for the retired); locked = read-only with "Fixed when…" once; cards add and remove; the plan page's section and link | §7.1, §7.4 |
| I3 | `planWrite.test.js`: the income paths on the account and the window path, a locked plan refused, Undo, the property over random boxes | §1 3e–3g for this step |
| I4 | `planDraft.test.js`, `draftStore`: card paths kept and cleaned; `routes`: `#/plan/<id>/income` | §7.2 |
| I5 | `e2e/plan-income.spec.js` at 390 and 1440 (prod build, guest plan planted, outside requests blocked): change the State Pension choice, add a final-salary pension at an age and a lump sum; Save; stored JSON differs only in the declared keys; Undo byte-identical; the planner at `/` shows the new values in its own boxes | the whole step |
| I6 | parity: the rows this step edits carry `editV7`; the ledger page regenerated | §6 |
