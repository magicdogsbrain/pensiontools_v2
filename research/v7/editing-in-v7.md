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

---

## 8. "What you spend" (the third step, 17 Oct 2026)

The audit's third row (§2.4 "What you spend": V7's spending shape at full parity, one-off costs at an age, the before-tax
figure shown and never asked; §3.4: the income shape — steps, tapers, glides, the go-go suggestion, the layers — and the
extra spends; §2.3: the budget as a guide). The owner's rules, verbatim: "We MUST offer as many steps and tapers as V6! …
We must have Gogo, goslow and nogo years." and, on the budget, every spend step gets a budget step; a person may skip it
with ONE figure, told plainly that they are skipping and that doing it is better; the budget is a GUIDE only, never used to
work out what they need; the spend used is always the figure in the box. It inherits §1 and §6 whole: one write file, the
declared-paths test, the guard, the guest path, the draft rules of §4 and the cards of §7.2.

### 8.1 What the planner saves, checked

- **The shape** is `stressTool.settings.incomeSteps` — `[{ fromAge, amount, decline, glideToNext }]`, `amount` **a year,
  before tax** (the planner's own editor says "£/yr gross" and "Each step is your TOTAL gross income for the year"),
  `decline` a % a year compounding, `glideToNext` a straight line to the next step (`IncomeSchedule.amountAtAge`; the
  planner's slider runs 0–5 in quarter points and the model accepts any; a glide on the last step is ignored). With it,
  on every Save, the planner writes `incomeShape: 'phases'`, `baseSalary` (the first step's amount — `updIncomeStep` keeps
  the hidden `ssBaseSalary` in step), and **`targetSchedule`**: the shape compiled to one figure a year from the plan's
  start, `duration + 1` entries, each `round(max(0, amountAtAge(steps, startAge + y, baseSalary), guaranteedAtYear(y)))`
  — "never below the income you get anyway" (T12): the State Pension (weekly × 52 from its plan year, by
  `spSimConfigFromSettings`; the planner's annual box is never filled from a plan, so it counts nothing), other income,
  the final-salary pension from its start year and every income stream in range. The engines read the SAVED schedule
  first (`IncomeSchedule.scheduleFromSteps`), so a step written without the schedule would change nothing: this step
  writes both, as the planner does. While unlocked the Stress Save also copies the first step and the schedule to the
  Decision settings (`saveDecisionSettings({ baseSalary, targetSchedule, … })`); a locked plan is never written from
  here, so this step copies them too.
- **The planner's convention is before tax; V7's is after tax.** The planner's own hidden "take-home" box turned a
  monthly after-tax figure into `baseSalary` with the one tax sum (`TaxCalculator.netToGross`, as
  `BudgetModel.grossUpAnnual` still does for the budget hand-off) and showed "≈ £X/yr before tax" beside it. This step
  asks **a month, after tax, at today's prices** (the unit of every V7 question and of the budget) and converts with the
  planner's own two functions at the plan's own tax bands (`pa`, `brl`, `hrl`; the planner's defaults when absent):
  read `round(grossToNet(amount) ÷ 12)`, write `round(grossUpAnnual(monthly × 12))`. Only a changed box is written, so a
  plan saved as it is writes nothing and a figure typed reads back as typed (tested: write∘read∘write is empty). The
  before-tax figure is **shown under every amount box** ("£38,000 a year before tax, as the plan saves it") and in the
  derived lines, never asked. A fall of N% a year is the planner's: on the before-tax figure, year on year.
- **One-off costs** have a saved key: `extraWithdrawals` — `[{ label, amount, year, years, indexation }]`, `amount` a year
  before tax added on top of that year's figure and taxed like income for `years` years from plan year `year`
  (`SimulationEngine.extraWithdrawalFor`; `indexation` 'cpi' rises with prices — the default — or 'level', a fixed sum).
  Asked here as an amount **a year after tax** at an **age**, for a number of years, going up with prices or fixed. The
  before-tax figure is the planner's marginal sum on top of that year's own figure (spending-shape.md §16.4's rule):
  `round(netToGross(netOfYear + x) − netToGross(netOfYear))`, `netOfYear = grossToNet(targetSchedule[year])`; read back the
  other way. A cost card left untouched keeps its stored row byte for byte, whatever else changed.
- **Floor & Flex essentials** (`strategyParams.essentialsAnnual`) is a plain key but lives in the block the planner
  keeps for the active strategy alone (`cleanParams`, 6.13.0) and is set on that strategy's own card; it is left for
  "Way of drawing and mix" and the page says so when the plan's way of drawing is Floor & Flex.
- **The budget** (`budgetTool.settings`) is read only: the all-in total and the essentials a month after tax from its
  cached `derived` (what the planner's own chip and `_shapeRefs` read), with its source. Nothing under `budgetTool` is
  written by this step.

### 8.2 The screen and words

Address: `#/plan/<id>/spend`, a sub-step of "Your plan" beside `about` and `income`. On the plan page the "What the plan
pays" section links here with "Change this here" ("See these" on a locked or shown-as-saved plan) instead of the planner.

```text
| What you spend                                                                 |
| What you spend each month after tax, at today's prices, and how it changes as  |
| you get older. The plan works out the figure before tax and shows it.          |
|                                                                                |
| Your budget, as a guide                                                        |
|   All in: £2,264 a month after tax; essentials £1,610.  From your budget       |
|   (a guide), saved 11 September 2026.                                          |
|   A guide only: the plan uses the figures in the boxes below, never the budget.|
|   Working it out line by line is the better way to choose them.               |
|   [ Use £2,264 a month at the start ]  [ Change the budget lines (planner) ]  |
|   (not worked out: "Your budget is not worked out, so you are choosing by one |
|    figure. That is fine for a first look, but …"  [ Work it out (planner) ])  |
|                                                                                |
| From the start                                                                 |
|   From age 63, the plan's first year   [ 2,641 ] a month after tax            |
|     £38,000 a year before tax, as the plan saves it.                           |
|     From your plan, saved 14 August 2026 (£2,641)                              |
|   then  [ stays the same ▾ ]   (falls by [ 1 ] % a year, at today's prices)    |
|                                                                                |
| Later steps                                                                    |
|   ┌ Step 1 ──────────────────────────────────────────────┐                     |
|   │ From age            [ 75 ]                             │                     |
|   │ A month after tax   [ 2,281 ]  £32,000 a year before…  │                     |
|   │ then  [ falls by a percentage a year ▾ ]  [ 1 ] %      │  [Remove]           |
|   └────────────────────────────────────────────────────────┘                     |
|   [ + Add a step ]  [ Suggest go-go, go-slow and no-go years ]                  |
|   → "Filled in: 15% less from 75 and 30% less from 85 — the planner's own      |
|      suggestion, to £500 a year before tax, never below your budget's          |
|      essentials. Typical, not yours: change any of it. Cancel puts it back."   |
|                                                                                |
| [ the picture: a bar a year, lighter the pensions you get anyway, go-go /      |
|   go-slow / no-go bands, the budget's essentials dashed ]  Show each year      |
|                                                                                |
| One-off costs                                                                  |
|   ┌ One-off cost 1 ───────────────────────────────────────┐                     |
|   │ What it is        [ New roof ]                          │                     |
|   │ A year after tax  [ 19,200 ]   £25,000 a year before…  │                     |
|   │ At age            [ 62 ]     For [ 1 ] year(s)          │                     |
|   │ Prices (x) going up with prices  ( ) a fixed sum        │  [Remove]           |
|   └─────────────────────────────────────────────────────────┘                     |
|   [ Add a one-off cost ]                                                        |
|                                                                                |
| What this works out to                                                         |
|   From age 63: £2,641 a month after tax (£38,000 a year before tax).            |
|   From age 75: £2,281 a month after tax (£32,000 a year before tax), falling   |
|     1% a year to £2,066 at 95.                                                  |
|   From age 72 your State Pension and other pensions pay more than this …        |
|   New roof: £19,200 after tax at age 62 (tax year 2028/29), once — £25,000      |
|     before tax on top of that year's figure, going up with prices.             |
| [ Save ]  [ Cancel ]                                                           |
```

- **The first row** (`first.amount`, money a month 1–50,000; `first.then` level | falls | glides; `first.fallsPct`
  0.25–10 in quarter points): its age is the plan's start and is never asked (the planner disables it: "The first step
  starts when the plan starts"). Read from the first saved step (`cleanSteps` order), or — a flat plan, `incomeShape`
  'level' or no steps — from `targetSchedule[0]` or `baseSalary` at the start age, as "Your plan" reads it
  (`read.js incomeSteps`). "moves evenly" is offered only while there is a later step.
- **Later steps** as cards (`steps.ids`, `steps.<id>.fromAge` above the first row's age and at most the plan's end age,
  no two the same; `.amount`; `.then`; `.fallsPct`), in the order read (the planner sorts by age; so does the write).
  Beside each amount: "{pct}% of the start" and, with a budget, "{pct}% of your budget (a guide)" — the planner's own
  "— 85% of today's budget" (T14). "+ Add a step" adds one 10 years after the last and 10% less, as V7's questions do.
- **"Suggest go-go, go-slow and no-go years"** is the planner's own `suggestSteps(first, startAge, essentials)` on the
  before-tax figures: the first as it is, then from 75 the larger of 85% and the budget's essentials, from 85 the larger
  of 70% and the essentials, each to £500 a year; 75 only when the start is before it, 85 likewise; the budget's
  essentials grossed up as the planner grosses them (`grossUpAnnual(derived.essentialAnnualNet)`). It replaces the later
  steps, as the planner's does; the line under it says what it filled in and that Cancel puts the draft back (there is
  no Undo inside a draft; Cancel is the undo).
- **The picture** is `ShapeChart` (reused, not forked): one bar a year from the start to the end of the plan, the year's
  figure after tax a month from the **compiled schedule** (so the floor shows: a year the pensions pay more than the
  shape is drawn at what they pay), the part the State Pension and other pensions pay lighter (their before-tax floor
  taken through the same tax sum), the go-go / go-slow / no-go bands at 75 and 85, the budget's essentials dashed, a
  year under them in the warning colour with `SHAPE.belowEssentials` under the chart ("That is allowed: it is your
  figure." — a guide, never a floor). "Show each year" opens the table.
- **One-off costs** as cards (`costs.ids`, `costs.<id>.label` up to 60; `.amount` a year after tax 1–1,000,000; `.atAge`
  from the start age to the end age; `.years` 1 to the years left; `.prices` rise | fixed).
- **The budget, as a guide** (the owner's rule, in the step's words): the all-in total and the essentials, "From your
  budget (a guide), saved {date}"; "A guide only: the plan uses the figures in the boxes below, never the budget. Working
  it out line by line is the better way to choose them."; "Use £X a month at the start" (one tap into the first row —
  the planner's own chip, T7 — the person can change it); "Change the budget lines (in the planner)" by the existing
  hand-over (`openPlace.js`, place `budget`). Not worked out: "Your budget is not worked out, so you are choosing by one
  figure. That is fine for a first look, but most people spend more than they think …" and "Work it out (in the planner)".
- **Derived lines** (`copy/spend.js derived`): each step's after- and before-tax figures with where a fall ends
  (the year before the next step or the plan's last year) or where a glide arrives; "From age N your State Pension and
  other pensions pay more than this (£X a month after tax): the plan pays that, and nothing is taken from your pension or
  savings." when the floor bites (T12); each cost with its before-tax figure, its tax year and its rise; the Floor & Flex
  note when that is the way of drawing.
- Problems in plain words; Save, Cancel, Undo, the toast ("Saved. From 63: £2,641 a month after tax. Later steps: 1.
  One-off costs: 2."). Phone first: one column at 390 px, cards not a table.

### 8.3 Keys written

`SPEND_WRITES` (schema.js). The shape block is written when the first row or any step card changed (the planner rewrites
the four together on every Save); the costs when a cost card changed; a key only when its value changes.

| Path | Value | As the planner writes it |
|---|---|---|
| `stressTool.settings.incomeShape` | `'phases'` | `saveStressSettings({ incomeShape })` |
| `stressTool.settings.incomeSteps` | the rows in age order: a stored row kept byte for byte where its card is unchanged, an edited card merged onto its row (`fromAge`, `amount`, `decline`, `glideToNext`; other keys kept), a new card `{ fromAge, amount[, decline][, glideToNext] }`; the first row's age the stored first step's, or the start age | `incomeSteps: _ssIncomeSteps.filter(amount > 0)` |
| `stressTool.settings.targetSchedule` | the compiled schedule, `duration + 1` figures (8.1) | `compiledTargetSchedule` |
| `stressTool.settings.baseSalary` | the first row's before-tax amount | the hidden `ssBaseSalary` kept in step by `updIncomeStep` |
| `stressTool.settings.spendingProfile` | `'flat'`, only on a plan still holding the old `'declining'` setting (the taper lives on the steps, which `effectiveStressSettings` bakes in on load; absent reads as flat and is left absent) | `saveStressSettings({ spendingProfile: 'flat' })` with the steps |
| `decisionTool.settings.baseSalary`, `.targetSchedule` | the same two | the Stress Save's Decision sync (drafts only — a locked plan is never written) |
| `stressTool.settings.extraWithdrawals` | the rows as 7.3 rebuilds a list: unchanged kept, edited merged (`label`, `amount`, `year`, `years`, `indexation`), removed dropped, new appended | `extraWithdrawals: _ssExtraWithdrawals.filter(amount > 0 && year != null)` |
| `lastModified` | now, ISO | every save |

Not written, and why: `budgetTool.*` (a guide; "Change the budget lines" is the planner's page); `spendingProfile` (the
old setting `smileToSteps` already baked into the steps on load); `decisionTool.settings.incomeSteps` (the Decision form's
own copy, which the Stress Save does not touch); `strategyParams.essentialsAnnual` (8.1).

### 8.4 Locked, guest, partner and stale

As §4 and §7.4. Locked: the document's `steps` (`planDocument.steps`: age, before-tax amount, fall, glide) and the
settings the lock froze for the costs, figures only, "Fixed when you locked the plan on {date}" once, the unlock sentence
once, no box; the budget guide still shows (the budget is not frozen by the lock) with its planner button. The partner's
spending is on the partner's plan: "{Sam}'s spending is on {Sam}'s plan." with the link to `#/plan/<theirId>/spend`.
The stale-answer rule (`answerAge`) gains the spend: a record with `takeHome` rows (PlanSeed.js, versions 2 and 3) is
compared on its first row's after-tax figure a month against the plan's first step read back through the same tax sum,
within £1 (the seed grossed it up at the planner's default bands; a plan whose bands were changed later still compares);
a record without rows is judged as before. After a save the plan page's stale line and "check it still lasts" follow.

### 8.5 Tests

| # | Test | Proves |
|---|---|---|
| S1 | `tests/v7/plan/spend.test.js`: `spendOf` on the 12 corpus plans × 3 dates; the lumpy plan's facts (3 steps with a glide, 2 costs) and the flat plans' (the first row from `baseSalary`); read∘write∘read identity over random plans, random cards and random typed boxes (fast-check): only `SPEND_WRITES` paths, every other byte unchanged, Undo byte for byte, the read-back equal to the typed figures (a month after tax to the pound; falls and glides exactly; costs a year after tax to the pound), a second write empty; `shapeLayersFromSettings(written).steps` equal to the steps the screen showed (age, before-tax amount, fall, glide) and `targetSchedule` equal to the planner's own `compileSteps` floored by its own `floorVals`; age↔year against `dbStartYearOfAge`; the suggestion equal to the planner's `suggestSteps`; the problems in their ids; a locked plan writes nothing; the stale rule; the sub-step and the plan page's link | the pure read and write; every V6 shape feature round-trips |
| S2 | `tests/v7/plan/spendRender.test.js`: every corpus plan × 3 dates (the first row, the cards, the chart with one bar a year, the budget guide, every figure sourced, no banned word, no countdown for the retired); locked = read-only with "Fixed when…" once; Add, Remove, Suggest and Use dispatch `plan/edit`; the plan page's section and link | §8.2, §8.4 |
| S3 | `planWrite.test.js`: the spend paths on the account and the window path, a locked plan refused, Undo, the property over random boxes | §1 3e–3g for this step |
| S4 | `e2e/plan-spend.spec.js` at 390 and 1440 (prod build, guest plan planted, outside requests blocked): change the first row's amount, add a step at an age with a fall; Save; stored JSON differs only in the declared keys; Undo byte-identical; the planner at `/` shows the new shape in its own boxes | the whole step |
| S5 | parity: the income-shape rows this step edits carry `editV7`; `inc.extra-spends` built here; the ledger page regenerated; `wording.test.js` over `copy/spend.js` | §6 |

---

## 9. "Your pots and tax" (the fourth step, 17 Oct 2026)

The audit's fourth row (§2.4: the pension "about £X at the day you stop, bad case £Y — or type your own", ISAs and how
they grow, the ordinary account, charges, tax bands, the tax-free part, "each tax option says saves about £X"; §3.4: pots,
ISA use and growth, the taxable account, charges, earnings, bed-and-ISA, the tax-free part, band fill, tax bands). Each
fact once, in plain English, with the saved value and its source beside it; nothing is worked out here that an engine
would work out — the screen never runs a future. It inherits §1 and §6 whole: one write file, the declared-paths test,
the guard, the guest path, the draft rules of §4.

### 9.1 What the planner saves, checked

- **The pension pot today** is three (or four) keys, not one: `equityMin`, `bondMin`, `cashTarget` (and
  `diversifierStart` when a sleeve is on), the pots the plan draws from (`PotsAtRetirement.sippTodayOf` adds them). The
  planner's own box is "Total in your SIPP" (`#ssPot`): on Save `readAlloc` splits the total by the risk level, or keeps a
  custom split's exact pounds; on load `writeAlloc` sums the three back into the box. This step asks the **total** and
  writes the three **in the saved proportions** (each pot's share of the sum as stored; the balanced preset, 50/40/10,
  when the sum is £0 — the planner's own fallback), cash taking the rounding remainder as `PlanSeed` does, so the mix is
  untouched and `sippTodayOf(written) === typed` to the pound. The split itself, the risk level, the funds to test, the
  diversifiers and the bond tent are the planner's "Your allocation" — the mix — and are left for **"Way of drawing and
  mix"**; the page says so where a reader would look for them. A plan whose pots come from its funds list
  (`allocMode: 'funds'`) has its total set by that list: the box is shown read-only with that note. A bought strategy
  (a ladder, a floor, a rotation: the seven `BOUGHT_STRATEGIES` of src/ui/strategySettingsUse.js) sizes itself on its own
  dial (`strategyParams.sippTotal`, `isaTotal`) when one is pinned: the page shows that figure beside the box and says the
  dial is set with the way of drawing.
- **Pots at the stop, typed** (`potAtRetirement`, left out of §3 on purpose): the planner's Timing block writes
  `{ sipp, isa, source: 'override' }` when either box holds a figure, else its own projection (`source: 'accumulation'`),
  else null; a plan that has stopped gets null. Only on a plan stopping later are the two boxes drawn. Typed: exactly the
  planner's object (`sipp: n || null`, `isa: n || null`). Both left blank on a plan whose stored record is a typed
  override: `null` — the planner's own fallback when it has no projection to hand (this step never projects); every
  engine reads null as "start from today's pots" (`potScaleOf` → 1), and the planner re-projects the next time its Timing
  block is drawn and writes it on its next Save. The page says exactly that. A stored projection (`accumulation`,
  `sweep`) with the boxes blank is left as it is and shown: "the planner works out £X pension and £Y ISAs and savings at
  the day you stop, from what you pay in" (the banned list has no "projection" and no "about £": the figure is the record's). A plan made from a preview answer also shows the answer's own record (`fromAnswer.people[0]
  .pension.atStop.middling` / `.careful`, `savings.atStop`): "£X at the day you stop in a middling future; in a bad case
  (the worst 1 in 10) £Y" — the audit's "about £X … bad case £Y", in the words the banned list allows. No saved figure:
  the pot today only, and "the figure at the day you stop comes from ‘Does it last?’, later". Never computed here.
- **ISAs and savings today** (`isaBalance`, the planner's `+value || 0`); **how they grow** (`isaGrowth`, 'cash' |
  'invested', 6.22.0): the choice is drawn only where the plan has it — every unlocked plan does, by schema version 3 —
  and, where the list of funds to test holds ISA funds (`IsaFunds.isaFundsDecide`), the planner's own line stands in for
  it ("follows the ISA funds in your list of funds to test"), read-only. A **locked plan without the key** says "a fixed
  3% a year (locked before this choice was added)" — `isaGrowthOf` reads it as null, the engines run the old rate — and
  **never gains the key** (saver-lock-and-savings-growth.md §3.3, R1). **ISA use** (`isaDrawdownStrategy`: tax-efficient,
  make it last, hold — `ISA_STRATEGIES`): "held" means nothing new is moved into it, so bed-and-ISA is not asked while
  held (the planner disables the box) and the page says why.
- **The ordinary (taxable) account** (`taxableStart`, `taxableMix` 'equity' | 'gilt' | 'bond' | 'balanced' | 'cash',
  `giaTaxBand` 'basic' | 'higher' — `readGiaFields`); what it holds and the band are asked only while it holds money.
  **Earnings this year** (`relevantEarnings`, before tax: how much of a lump sum may go into the pension) and
  **bed-and-ISA** (`bedAndIsa`; absent reads as on: `settings.bedAndIsa !== false`).
- **Charges** (`chargesPct`, percent a year, 0–3 in steps of 0.05): typed text goes through the planner's own
  `normaliseChargesPct` (clamped, on the grid) and `chargesForSave` (blank keeps the plan's own); read back by
  `chargesPctOf`. A locked plan without the key says "none (locked before charges were added)" and never gains one
  (charges-setting.md rule 3). An unlocked plan always has one (schema version 2).
- **Tax bands** (`pa`, `brl`, `hrl`: the planner's "Tax thresholds (year 0)") and **whether they rise** (`taxMode`
  'inflates' | 'frozen'); read back by `createSimulationConfigFromSettings` and `bandsOf`.
- **The tax-free part** (`accessMethod` 'drawdown' = kept separate or already taken, every draw fully taxable; 'ufpls' =
  a quarter of every draw tax-free until the £268,275 allowance is used — the planner's two buttons; `ufplsYears`, a
  count or null = the whole plan; `ufplsThenPcls`, then the remaining quarter into the ISA) and **band fill**
  (`bandFillRecycle`). These are Pots & Valves / Buckets in order machinery (`data-pnv-only`): a bought strategy says
  "Not used by this way of drawing" under each, as the planner's `settingUseNote` says beside its own boxes; so do
  earnings and bed-and-ISA ("a lump sum buys the next years of income instead") and, once the plan is running, how the
  ISA grows ("it still sets how your ISA grows until the day you stop").
- **"Saves about £X over the plan."** The plan holds no such figure per choice (nothing in the settings, the document
  or the records says what a tax option saves), so the choice is shown without one and the page says the figure comes
  from "Does it last?", later. Never run an engine in the screen.
- **Absent means the old behaviour.** A key the plan lacks is written only when the person chooses a value that differs
  from what the engines read for the absent key (bed-and-ISA on, the tax-free part kept separate, no earnings, no
  taxable account, the planner's default bands): a plan saved as it is writes nothing, and a locked pre-charge plan stays
  without `chargesPct`. The Decision settings are not written: the planner's Stress Save copies none of these keys.

### 9.2 The screen and words

Address: `#/plan/<id>/pots`, a sub-step of "Your plan" beside `about`, `income` and `spend`. On the plan page the "Pots"
section links here with "Change this here" ("See these" on a locked or shown-as-saved plan) instead of the planner.

```text
| Your pots and tax                                                               |
| What you hold today, how it grows and how it is taxed. Each fact once; the      |
| split of your pension and the funds are set with the way of drawing and mix.    |
|                                                                                 |
| Your pension pot                                                                |
|   Your pension pot today, £          [ 440,000 ]                                |
|     From your plan, saved 11 September 2026 (440000)                            |
|     Split as saved: £280,000 shares, £120,000 bonds, £40,000 cash. The split,   |
|     the risk level and the funds to test are set with the way of drawing and    |
|     mix (in the planner).                                                       |
|   (stopping later)                                                              |
|   Your pension at the day you stop, £  [        ]   ISAs at the day you stop, £ [   ] |
|     The planner works out £603,941 pension and £54,126 ISAs and savings at the  |
|     day you stop, from what you pay in. Type your own above to use it instead.  |
|                                                                                 |
| ISAs and savings                                                                |
|   ISAs and savings today, £          [ 60,000 ]                                 |
|   How they grow   (x) Mostly cash   ( ) Invested like my pension                |
|   How the ISA is used  (x) Tax-efficient … ( ) Make it last … ( ) Hold it …     |
|                                                                                 |
| Your ordinary account (outside a pension or ISA)                                |
|   Money in it today, £   [ 85,000 ]                                             |
|   What it holds (x) shares ( ) gilts ( ) bond funds ( ) a mix ( ) cash          |
|   Your tax band for it   (x) basic rate  ( ) higher rate                        |
|   Earnings this year, before tax, £  [ 12,000 ]                                 |
|   Move £20,000 a year into the ISA when the allowance is unused  (x) yes ( ) no |
|                                                                                 |
| Charges                                                                         |
|   Charges (funds and platform), % a year  [ 0.5 ]                               |
|                                                                                 |
| Tax                                                                             |
|   Tax-free allowance, £ [ 12,570 ]  Basic rate up to, £ [ 50,270 ]              |
|   Higher rate up to, £ [ 125,140 ]                                              |
|   The thresholds  (x) rise with prices  ( ) stay frozen                         |
|   Your 25% tax-free part  (x) kept separate, or already taken                   |
|                            ( ) a quarter of each draw, tax-free                 |
|       For how many years [    ]  Then the remaining quarter into the ISA (x) no |
|   Fill the basic-rate band and move the rest into the ISA  ( ) yes (x) no       |
|   What each choice saves in tax over the plan comes from ‘Does it last?’, later.|
|                                                                                 |
| What this works out to                                                          |
|   Pension £440,000 and ISAs £60,000 today; £85,000 in your ordinary account.    |
|   Your ISAs grow mostly as cash: by last year's rise in prices, less 1% a year. |
|   Charges of 0.5% a year come off your funds and cash every month.              |
|   Tax-free allowance £12,570; basic rate to £50,270; higher rate to £125,140,   |
|     rising with prices.                                                         |
|   Every draw from your pension is taxed in full (the tax-free part is kept      |
|     separate or already taken).                                                 |
| [ Save ]  [ Cancel ]                                                            |
```

- **Boxes** (`schema.js` `POTS_FIELDS`), by path: `pension` (money, required, 0–50,000,000); `stopSipp`, `stopIsa`
  (money, optional; only while the plan stops later); `isa` (money, blank = 0); `isaGrowth` (choice 'cash' |
  'invested'); `isaUse` (choice: the three `ISA_STRATEGIES`); `taxable` (money, blank = 0); `taxableMix` and `giaBand`
  (choices; drawn while the account holds money); `earnings` (money, blank = 0); `bedAndIsa` (choice 'yes' | 'no'; not
  while the ISA is held); `charges` (percent, 0–3, on the 0.05 grid); `pa`, `brl`, `hrl` (money, 1–1,000,000: the allowance at least £1, since the planner's band reader takes £0 as its default);
  `taxMode` (choice 'inflates' | 'frozen'); `taxFree` (choice 'drawdown' | 'ufpls'); `ufplsYears` (count 1–60,
  optional) and `ufplsThenIsa` (choice 'yes' | 'no') while `taxFree = ufpls`; `bandFill` (choice 'yes' | 'no').
- **Source lines** as §2: "From your plan, saved {date} ({value})"; a locked plan "Fixed when you locked the plan on
  {date}" once, figures only, no boxes.
- **"Not used by this way of drawing."** `notUsedBy(strategyId)` returns the paths a bought strategy ignores (`taxFree`,
  `ufplsYears`, `ufplsThenIsa`, `bandFill`, `earnings`, `bedAndIsa`); `useNotes` carries the planner's own longer words
  for the ISA growth and a pinned pot. Pots & Valves and Buckets in order read everything.
- **Derived lines** (`copy/pots.js derived`): the pots today; the split as saved and the hand-off to the mix; the pots at
  the stop (the typed figures, the planner's own figures, or the answer's record with its bad case; or that the figure
  comes later); how the ISAs grow (the fixed 3% on a locked plan without the choice; the funds' line); the charge (none
  on a locked pre-charge plan); the bands and whether they rise; the tax-free part; band fill; the "saves about £X"
  stand-in.
- Problems in plain words; Save, Cancel, Undo, the toast ("Saved. Pension £440,000, ISAs £60,000. Charges 0.5% a year.").
  Phone first: one column at 390 px.

### 9.3 Keys written

`POTS_WRITES` (schema.js), all under `stressTool.settings`, as the planner's Stress Save writes them (index.html
`saveStressSettings({ … })`: `equityMin`/`bondMin`/`cashTarget` from `readAlloc`, `isaBalance`, `isaDrawdownStrategy`,
`readGiaFields`, `chargesForSave`, `isaGrowthForSave`, `pa`/`brl`/`hrl`/`taxMode`, `accessMethod`/`ufplsYears`/
`ufplsThenPcls`/`bandFillRecycle`, `timingFieldsForSave` → `potAtRetirement`). A key only when its value changes; a key
the plan lacks only on a value that differs from what the engines read for the absent key (9.1).

| Path | Value | As the planner writes it |
|---|---|---|
| `equityMin`, `bondMin`, `cashTarget` (+ `diversifierStart` when the sleeve is on) | the total in the saved proportions, cash the remainder | `readAlloc` (the total × the split) |
| `potAtRetirement` | typed: `{ sipp, isa, source: 'override' }`; a typed override blanked: null; else kept | `timingSettingsFromForm` |
| `isaBalance` | the box, 0 when blank | `+value || 0` |
| `isaGrowth` | the choice; never written to a plan without one | `isaGrowthForSave` |
| `isaDrawdownStrategy` | the choice | the select |
| `taxableStart`, `taxableMix`, `giaTaxBand`, `relevantEarnings`, `bedAndIsa` | the boxes (0, 'equity', 'basic', 0, true when blank) | `readGiaFields` |
| `chargesPct` | `normaliseChargesPct(typed)`; blank keeps the plan's own; never written to a locked plan without one | `chargesForSave` |
| `pa`, `brl`, `hrl`, `taxMode` | the boxes | the Tax thresholds block |
| `accessMethod`, `ufplsYears`, `ufplsThenPcls`, `bandFillRecycle` | 'drawdown' or 'ufpls'; a count or null; the two ticks | the "How you'll take this pension" block |
| `lastModified` | now, ISO | every save |

Not written, and why: `strategyParams.sippTotal` / `isaTotal` and every other per-strategy dial, `allocMode`,
`taggedFunds`, `subAsset`, `equityGlideEnabled`, `glideEndgame`, the risk level (the mix: "Way of drawing and mix");
`isaReturn`, `isaMin` (read by no choice a person makes; the fixed rate is what a plan without the choice runs at);
`decisionTool.*` (the planner's Stress Save copies none of these); `holdings` (what you hold is a record, never a
strategy input: holdings-vs-strategy ruling).

### 9.4 Locked, guest, partner and stale

As §4. Locked: the figures from the plan document's `pots` (`sipp`, `isa`, `gia`, `isaPolicy`, `taxableMix`,
`potAtRetirement`, `allocation`) and `assumptions` (`pa`, `brl`, `hrl`, `taxMode`, `chargesPct`, `isaGrowth`,
`isaFromFunds`), the rest from the settings the lock froze; "Fixed when you locked the plan on {date}" once, the unlock
sentence once, no box. The partner's pots are on the partner's plan: "{Sam}'s pots and tax are on {Sam}'s plan." with the
link to `#/plan/<theirId>/pots`. The stale-answer rule (`answerAge`) gains two facts the answer's record carries
(`fromAnswer.people[0].pension`, `.savings`): the pension pot the seed wrote (`pension.today`, or the middling pot at the
stop when today's was £0 on a plan stopping later — `PlanSeed`'s own rule) against `sippTodayOf(settings)`, and the
savings today against `isaBalance`, each to the pound; a record without them is judged as before. After a save the plan
page's stale line and "check it still lasts" follow.

### 9.5 Tests

| # | Test | Proves |
|---|---|---|
| T1 | `tests/v7/plan/pots.test.js`: `potsOf` on the 12 corpus plans × 3 dates; the lumpy plan's facts (an ordinary account, higher rate, earnings) and the saver's (the projection at the stop); read∘write∘read identity over random editable plans and random typed boxes (fast-check): only `POTS_WRITES` paths, every other byte unchanged, Undo byte for byte, a second write empty; the written plan read by the planner's own readers — `chargesPctOf`, `isaGrowthOf`, `bandsOf`, `sippTodayOf`, `createSimulationConfigFromSettings` (pa/brl/hrl/taxMode/accessMethod/ufpls/bandFill/taxable/bedAndIsa/earnings/isa) — equal to what the screen showed; absent keys stay absent when untouched (a locked pre-charge plan, a plan without the ISA choice); the bought list equals the planner's `BOUGHT_STRATEGIES`; the problems in their ids; a locked plan writes nothing; the stale rule; the sub-step and the plan page's link | the pure read and write |
| T2 | `tests/v7/plan/potsRender.test.js`: every corpus plan × 3 dates (boxes with labels, every figure sourced, no banned word, no countdown for the retired); locked = read-only with "Fixed when…" once; the plan page's section and link | §9.2, §9.4 |
| T3 | `planWrite.test.js`: the pots paths on the account and the window path, a locked plan refused, Undo, the property over random boxes | §1 3e–3g for this step |
| T4 | `e2e/plan-pots.spec.js` at 390 and 1440 (prod build, guest plan planted, outside requests blocked): change the pension pot, the ISA growth choice and the charge; Save; stored JSON differs only in the declared keys; Undo byte-identical; the planner at `/` shows the new values in its own boxes | the whole step |
| T5 | parity: the pots and tax rows this step edits carry `editV7`; the gap rows it closes are built; the ledger page regenerated; `wording.test.js` over `copy/pots.js` | §6 |

---

## 10. "Does it last?" (the fifth and last step, 17 Oct 2026)

The audit's "Does it last?" (§2.5: one answer — the plan's own cuts, its full length, the bad case as the worst 1 in 10;
the four parts; §3.4: the Monte Carlo, Historical, Scenarios, Drawdown and Glidepath tabs, the cut dials, the emergency
reserve; §3.1 rule 2: one plan, one answer). Two things in one step: the plan's **one answer, run in the preview** — the
very test the planner runs (`stressTestStrategy` on the plan's own strategy, through `OneAnswer.js`, 6.24.0) — and the
**dials every strategy of the Pots & Valves family reads when it runs**: the spending cuts in a slump and the emergency
reserve, each once, with the saved value and source beside it. It inherits §1 and §6 whole: one write file, the
declared-paths test, the guard, the guest path, the draft rules of §4. Nothing in this step reimplements a figure: the
run is the planner's own functions, loaded lazily, and the words are read from its result.

### 10.1 What the planner saves and runs, checked

- **The planner persists no run result on an unlocked plan.** `index.html oneTestFor` keeps the result in page memory
  (`window._oneTest`, keyed by the settings' text) and nothing of it is written to the plan: no `stressTool.lastResult`,
  no date of the run, no figure. The only stored "will it last" figures are (a) a plan made from a preview answer, whose
  `fromAnswer` carries the ANSWER's own figure — a different question (§2.5 "What still differs"), never rewritten by a
  planner run — and (b) a locked plan's document, `planDocument.strategy.r` / `.p`, the figure it was locked with, never
  rewritten (6.24.0). So **this step writes nothing after a run**: the result lives in page memory (`state.lasts`), is
  worked out again whenever the plan in memory changes (its id, its last-changed stamp or its Stress settings), and leaves
  with the plans on pagehide, sign-out or nobody. The plan page's stale line (§4: the answer older than its inputs) stays
  until the plan's inputs match the answer's record again; it cannot be "cleared" by a run without inventing a stored key
  the planner does not have, and a V7 run is not the answer's question. What changes is where "Check it still lasts" goes:
  here, no hand-over.
- **The run is `index.html strategyPlanFor` + `oneTestFor`, line for line:** the effective settings the planner's own
  loader reads (`PlanReading.effectiveStressSettings` — defaults merged under, old names renamed, the taper folded into
  the steps, the Budget's newer age, the start pinned in memory), the engine config `createSimulationConfigFromSettings({},
  settings)`, `planFromSettings(settings, cfg, { yieldForYear: realYieldForYear, startAge: settings.shapeAgeNow || 57, now })`,
  `stressTestStrategy(settings.strategyId || 'pots-and-valves', p)`, then `oneAnswer(r, p)`. The futures are the engine's
  own fixed seeds (future i is `i × 7919 + 3`, the same market for every strategy), so there is no seed to save and no
  length-of-test key: `OneAnswer` reads the plan's length from `p.durationYears` (the `duration` "About you and when"
  writes). The charge, how the ISA grows, the cuts, the 2028 rule, the State Pension, the pots at the stop: all come
  through the same config, because it is the same function.
- `createSimulationConfigFromSettings` lived in `src/storage/StressRepository.js`, which imports the Firebase module and
  which V7 may not reach (rule 3a). The function is pure given its settings; it moves to
  **`src/services/SimulationConfig.js`** (`simulationConfigFromSettings(overrides, settings)`), and the repository keeps
  its export as a one-line wrapper that fills the settings from its cache as before. Nothing the planner calls changes.
- **Live gilt and share prices.** The planner's worker loads `data/gilts.json` and `data/equity.json` before a run
  (`engineWorker.js`); V7's worker reads no live data (its rule since the build brief) and the preview's tests block every
  outside request. The run here prices a ladder on the bundled curve (`LinkerUniverse.activeLinkers()` without
  `setLiveGilts`): a ladder or floor plan can read a different cost here from the planner's on a day the live file has
  moved. The Pots & Valves family reads none of it. The page says so under a bought strategy's figure.
- **Progress.** The engine has no hook inside its loops, and it is not touched: the worker posts one progress message
  before the heavy run (the plan built) and one after it (the history replays left), so the bar is drawn, and the shell's
  "slow" sentence follows after five seconds as for every answer. The run itself is short: 0.45–0.65 s for every
  Pots & Valves corpus plan in Node on the reference Mac (a ladder plan 1–45 ms), so a phone four times slower sees the
  figure in 2–3 s, inside the budgets of `e2e/helpers/app.js` (`FIRST_ANSWER_BUDGET.finalMs`, 15 s slowed).
- **The dials.** The planner's Stress Save writes `consecutiveLimit`, `protectionMult`, `protectionEscalateMonths`,
  `disableProtection`, `recoveryBuffer`, `hodlEnabled`, `hodlValue` (index.html `saveStressSettings`, lines 10108–10114)
  and copies none of them to the Decision settings (the Decision form has its own `protectionFactor` and
  `consecutiveLimit`, filled from its own boxes). `createSimulationConfigFromSettings` passes them to the Pots & Valves
  engine (`SimulationEngine`: `assessProtection`, `protectionMultForStreak`, the reserve as `hodl`); every other strategy
  ignores them (`cutsSettingWords`: "no spending cuts — this strategy pays the plan in full until it cannot"; Floor & Flex
  "the treats flex instead"). Absent reads as: cuts on, 3 months, a 20% cut (`protectionMult` 0.8), half the cut for 12
  months, a £15,000 buffer, no reserve.

### 10.2 The screen and words

Address: `#/plan/<id>/lasts`, a sub-step of "Your plan" beside the four others. The plan page's "Next: check it still
lasts" links here; so does the plan step's own button ("Does it last?") on an unlocked plan, in place of "Test it in the
planner", and the P.draft / P.approaching next sentences ("Next: check it lasts, then lock it when it is right.").

```text
| Does it last?                                                                  |
| The one test every screen of the planner shows: your plan, its own way of      |
| drawing, its own cuts, its full length, through every real stretch of markets  |
| since 1871 and 1,000 possible futures.                                         |
|                                                                                |
| [ band ]  Your plan lasts in 9 futures out of 10.   ▮▮▮▮▮▮▮▮▮▯                 |
|           93% of 1,000 futures; 681 real starts since 1871; 39 years, to 95.   |
|   Left at the end, today's money: typically £1,287,917; in a bad case (the     |
|     worst 1 in 10) £49,177; in a good case (the best 1 in 10) £3,100,000.      |
|   Income cuts: in 680 of 1,000 futures (41 of them later ran out), typically   |
|     £4,000 a year less for about 3 years (£12,000 in all; the most in any      |
|     future £31,000). A cut is a tax year in which more than 1% of the planned  |
|     income went unpaid and was never caught up.                                |
|   Run with the spending cuts you set: up to 20% after 3 months in a row below  |
|     the plan's line. Pots and valves, 39 years.                                |
|   Worked out just now, on the plan as saved 11 September 2026.                 |
|                                                                                |
| What if you had retired into a bad year?                                       |
|   The hardest starts in the record — an unfair test: September 1929: ran out   |
|   at 84; lowest 12 months £31,000; left £0.  …  (5 rows)                       |
|   Named starts: the Great Depression (1929): lasted; income cut in 4 years     |
|   (£16,000 in all); left £240,000. … (6 rows)                                  |
|   The named stresses as decades (Scenarios) are explained in the planner.      |
|                                                                                |
| Cuts in a slump                                                                |
|   Cut spending in a slump   (x) Yes  ( ) No      From your plan, saved … (Yes) |
|   After how many months in a row below the plan's line  [ 3 ]                  |
|   Cut income by, %  [ 20 ]   (half the cut for the first [ 12 ] months)        |
|   Keep this much above the line before the cut ends, £  [ 15,000 ]             |
| Emergency reserve                                                              |
|   Keep a reserve touched only when the plan would otherwise run out            |
|     ( ) Yes  (x) No          Amount, £ [ 25,000 ]                              |
|   (a ladder, a floor, a rotation: "Not used by this way of drawing." under each)|
| What this works out to                                                         |
|   In a slump, after 3 months in a row below the plan's line, income is cut by  |
|   10% for 12 months and by 20% if it lasts; missed income is made up later.    |
|   No emergency reserve.                                                        |
| [ Save ]  [ Cancel ]   → after Save the test runs again on the saved plan      |
+--------------------------------------------------------------------------------+
```

- **The verdict band** (`src/answers/plan/lasts.js verdictOf`): the planner's own words `OneAnswer.futuresOutOfTen` ("in
  9 futures out of 10", "in just under 9 futures out of 10", "in every future it tried"); the colour token `yes` at 9 in 10
  or better (the on-course bar every screen uses, `OnCourse.ON_COURSE_SHARE`), `close` from 85% to just under 90%, else
  `no` — a word and a colour, never a colour alone; the ten-cell bar from the share. Under it the count of futures, the
  real starts, the length ("39 years, to 95"). Then what is left (typical, the bad case — the worst 1 in 10, never the
  worst of 1,000 — and the good case), the income cuts as the planner's "Will it last?" tab says them (`cutsRowHtml`),
  the cuts setting the run used, and the way of drawing. A bought strategy with no cuts says "Income cuts: none — this
  way of drawing pays the plan in full until it cannot" and, for a ladder or floor, that the bundled gilt curve priced it.
- **"Worked out just now, on the plan as saved {date}."** — every figure's source. A result is kept only while the plan in
  memory is the one it was run on (10.1): a save of any step, or a change made in the planner and read again, runs it
  again (the key: the plan's id, its last-changed stamp and the text of its Stress settings).
- **History** — "What if you had retired into a bad year?" — comes free from the same run: `OneAnswer.worstStarts` reads
  the test's own per-start history (`r.histWindows`, the five hardest starts, "an unfair test"), and
  `NamedStarts.namedStartRows` replays the six named starts with the plan the family's test ran on (`pnvFamilyPlan`;
  one short run each, under a millisecond apiece). Rows in words: ran out at {age}; lasted, income cut in {n} years
  ({total} in all); the lowest 12 months; what was left. A ladder's and floor's rows as the planner says them; a contract
  strategy: "every year is bought: a start year changes nothing but the pounds that arrive". **Scenarios** (the named
  decades, what each did to shares and prices) need the planner's decade tables and are explained there: one line and
  the planner's hand-over (place `test`). The Drawdown and Glidepath tables are not here either (the audit's "Year by
  year" is its own later step).
- **The dials** (`schema.js LASTS_FIELDS`): `cutsOn` (yes | no); `cutAfterMonths` (count 1–24); `cutPct` (count 0–95,
  whole percent: the planner's box holds the multiplier 0.8, its strategy page "Cut %" = (1 − mult) × 100);
  `deeperAfterMonths` (count 0–60, the planner's "First-stage months (half the cut)"); `buffer` (money 0–1,000,000, the
  planner's "Recovery Buffer"); `reserveOn` (yes | no); `reserveAmount` (money 1–50,000,000, while on). The cut boxes
  are drawn while cuts are on. For a bought strategy (a ladder, a floor, a rotation: `BOUGHT` of pots.js) every dial says
  "Not used by this way of drawing." under it and is still editable, as the planner's own boxes are (`data-pnv-only`
  hides them there; here the words say why).
- **Derived lines** (`copy/lasts.js derived`): the cuts in one sentence, from the values as they would be saved; the
  reserve; "Not used by this way of drawing: {strategy} pays the plan in full until it cannot" for a bought strategy.
- Problems in plain words; Save, Cancel, Undo, the toast ("Saved. Cuts of up to 30% after 3 months; no reserve."). After
  a save the plan's stamp changes, so the test runs again on the saved plan and the band updates. Phone first: one
  column at 390 px, the band and the rows wrap, no table wider than the screen (the history rows are cards).
- **Working.** While the run is under way: the shell's "Working out your answer…" block with the progress bar (the
  worker's messages) and the slow sentence after five seconds; the old band stays greyed when there is one. Failed:
  "Sorry, we could not work that out." with "Try again". A plan the test finds unaffordable on its strategy (a ladder
  that cannot be bought): the planner's own sentence, no figures.

### 10.3 Keys written

`LASTS_WRITES` (schema.js), all under `stressTool.settings`, as the planner's Stress Save writes them. A key only when its
value changes; a key the plan lacks only on a value that differs from what the engines read for the absent key (10.1), so
a plan saved as it is writes nothing and a plan without the reserve never gains `hodlValue` unless the reserve is switched on.

| Path | Value | As the planner writes it |
|---|---|---|
| `disableProtection` | `cutsOn = no` | the "Disable Protection Mode" tick |
| `consecutiveLimit` | the months | the "Months Below Glidepath" box |
| `protectionMult` | `1 − cutPct / 100` | the "Protection Multiplier" box (the strategy page's "Cut %" the other way) |
| `protectionEscalateMonths` | the months | the "First-stage months" box |
| `recoveryBuffer` | the pounds (`|| 15000` as the Save has it: 0 reads as the default) | the "Recovery Buffer" box |
| `hodlEnabled`, `hodlValue` | the tick; the pounds while on (kept as stored while off) | the "Break Glass HODL" boxes |
| `lastModified` | now, ISO | every save |

Not written, and why: `decisionTool.settings.{consecutiveLimit, protectionFactor, protectionEscalateMonths,
recoveryBuffer, disableProtection}` (the planner's Stress Save copies none of them; the Decision form keeps its own);
`strategyParams.*` (the strategy page's own cut dial writes the same Stress keys through `useSpecStrategy` — no
per-strategy copy exists); anything of the run (10.1: nothing is stored).

### 10.4 The run: where the code loads, and how big

- **The worker** (`effects/answerWorker.js`) gains one message, `{ id, type: 'lasts', plan, env: { today } }`, answered by
  `src/answers/plan/lastsRun.js` through a **dynamic import** — the strategy registry, the nine strategies, the market
  history, the gilt data and the one-answer readers load into the worker only when a plan's "Does it last?" is opened.
  The worker's own chunk and the shell carry none of it: `tests/v7/boundaries.test.js` keeps a static walk from
  `main.jsx` and `answerWorker.js` that must not reach `src/strategies/stressTest.js`, and the lazy chunk is walked by
  the full reach rule (3a: nothing under `src/storage`, `src/firebase`, `src/workers` but the pure files). The plan goes
  to the worker as data (`cloneSafe`), after the in-memory upgrade; the result comes back as data (`trimResult` shape:
  no samples, no per-future lists). **No page fallback, on purpose**: a first build with one (`import()` of the run from
  the shell's graph) made Rollup split the modules the run shares with the plan source — the strategies the plan
  document already reaches, until then tree-shaken down to what the reading used — into a shared chunk the plan pages
  load whether or not the step is opened (+121 KB on every plan page). The run is the worker's alone; a browser that
  cannot start a worker is told so (`lasts/failed`, reason `noWorker`) and offered the planner, which runs the same test.
- **The runner** (`effects/lasts.js`): on the step, when `state.lasts` holds no result for the page's `runKey`, dispatch
  `lasts/working`, run, `lasts/done` (or `lasts/failed`); a result for a key no longer wanted is dropped, as the
  questions' runner drops stale answers; `lasts/slow` after five seconds. `readyMark` counts a run under way, so
  `#app[data-ready]` and `pt:done` cover it.
- **Sizes** (the published build, `vite build --config vite.v7.config.js`, bytes, before → after): the shell
  `index-*.js` grows by the screen and its words only, as each editing step has (the engine is not in it: no strategy,
  no one-answer words, no market history — the boundary test's static walk proves it, and a string check of the built
  chunk confirms it); the questions' chunk is unchanged; the worker `answerWorker-*.js` 330,778 → a little larger, because
  the market-history module the questions already share with the run now exports the functions the run needs (Rollup
  hosts a shared module in the chunk both import); the engine proper is the new lazy `lastsRun-*.js`, loaded by the worker
  on the first "Does it last?". The measured figures are in the commit and the report.

### 10.5 Locked, guest, partner and stale

- **Locked** (`decisionTool.settings.locked`): the dials read-only — the figures the lock froze, "Fixed when you locked the
  plan on {date}" once, the unlock sentence once, no box. The band shows the **document's figure** (`planDocument.strategy.r`
  through `oneAnswer`, with the document's `p`: "Worked out when the plan was locked on {date}"), and **today's test on the
  same plan** runs as the planner's document page runs it (`earlierTestCheck`): on the frozen settings; a locked gilt
  ladder is not re-priced (`documentLadder`: the document's own result stands, as `oneTestFor` has it), every other
  strategy runs live. When the two differ, the one line of 6.24.0 (`OneAnswer.earlierTestNote`) says so; when they
  agree, nothing. Never a write.
- **Shown as saved**, **not in this account**, **nobody signed in**: as §4; the run still happens on a plan shown as saved
  (reading is allowed; the dials are read-only) and on this window's plans while the free time is not used up (used up:
  the band runs — a read — but Save says so and writes nothing, as every step).
- **Couples (linked plans).** This step runs THIS plan. "{Sam}'s plan is tested on {Sam}'s plan." with the link to
  `#/plan/<theirId>/lasts`, and "Check the two plans together in the planner" — the household's pooled verdict (who draws
  what, the paired futures) stays in the planner's Household tab for now; the hand-over is the existing one (place
  `household`).
- **The stale answer** (§4): unchanged as a rule; the next sentence's button is a link here. A plan with no stored answer
  has nothing to be stale, and this step is where its answer is.

### 10.6 Tests

| # | Test | Proves |
|---|---|---|
| L1 | `tests/v7/plan/lasts.test.js`: `lastsOf` on the 12 corpus plans × 3 dates; the lumpy plan's and the fresh plan's dials; read∘write∘read identity over random editable plans and random typed boxes (fast-check): only `LASTS_WRITES` paths, every other byte unchanged, Undo byte for byte, a second write empty; the written plan read by `createSimulationConfigFromSettings` shows what the screen showed (`disableProtection`, `consecutiveLimit`, `protectionMult`, `protectionEscalateMonths`, `recoveryBuffer`, `hodlEnabled`, `hodlValue`); absent keys stay absent when untouched; `verdictOf` over the figures (the words are `futuresOutOfTen`'s; yes/close/no at the bar); the run key moves with the stamp and the settings and nothing else; a locked plan writes nothing; the sub-step, the address, the plan page's links | the pure read and write |
| L2 | `tests/v7/plan/lastsRun.test.js` (slow tier): for every corpus plan with an unlocked strategy, `runLasts(plan, { today })` — what the worker runs — gives figures equal to the pound to `oneAnswer(stressTestStrategy(…), p)` built as `index.html strategyPlanFor` builds it (`createSimulationConfigFromSettings` from the repository, `planFromSettings`, `realYieldForYear`, the same `now`); the chance to a tenth of a point, the left figures and the cuts to the pound, the histories' count; a locked plan: the document's figure read back and today's figure, the note '' when they agree; the result is plain data | the worker's run is the planner's |
| L3 | `tests/v7/plan/lastsRender.test.js`: every corpus plan × 3 dates with a made-up result in `state.lasts` (boxes with labels, the band with its word and bar, every figure sourced, the history rows, no banned word, no countdown for the retired); working, slow, failed and unaffordable states; locked = read-only with "Fixed when…" once, the document's figure and the earlier-test line; a plan shown as saved; the plan page's links | §10.2, §10.5 |
| L4 | `planWrite.test.js`: the lasts paths on the account and the window path, a locked plan refused, Undo, the property over random boxes | §1 3e–3g for this step |
| L5 | `tests/v7/shell/lasts.test.js`: the reducer (a result for an old key is dropped; the plans leaving memory clears it; `readyMark`); the runner with a fake client (progress, slow, failed, the page fallback on NO_WORKER, a stale result dropped); the worker handler's `lasts` message through the real handler (lazy import, progress then result, plain data) | §10.4 |
| L6 | `boundaries.test.js`: the static walk from the entry points does not reach `src/strategies/stressTest.js` or `src/services/OneAnswer.js`; the full walk (with the dynamic import) does, and still nothing forbidden; `src/services/SimulationConfig.js` imports no repository; the worker's lazy import is the one place `lastsRun.js` is reached from V7 | §10.4 |
| L7 | `e2e/plan-lasts.spec.js` at 390 and 1440 (prod build, guest plans planted, outside requests blocked): open the step, the band appears with its figures within the slowed budget, every figure equals the Node run on the same plan (a child process, as `answerInNode`), the dials hold the saved facts; change the cut to 30% and the months to 4; Save; stored JSON differs only in the declared keys; the band runs again and the figure moves; Undo byte-identical; the locked plan shows the document's figure and today's; no sideways scroll; the measured times are written to the test's annotations | the whole step |
| L8 | parity: `prot.cuts` and `prot.reserve` built, edited in V7 (`editV7`), their gaps closed; `test.monte-carlo` built on this step; the ledger page regenerated; `wording.test.js` over `copy/lasts.js` | §6 |

Owner-plan tests (`tests/fixtures/local/`) are skipped: the folder does not exist in this checkout.
