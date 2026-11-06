# Month by month, in the new app — the design for 7.2.0 (part 1) and 7.3.0 (part 2)

Written 5 Nov 2026 from a fact map of the classic planner's Decision tool: index.html (its tabs, Monthly Entry,
calcDecisionWithDeps, decisionStrategyOverlay, handleDecisionSubmit, saveCurrentDecision, togglePaidThisMonth), the set-up
(src/ui/components/TaxYearSetupWizard.js, services/TaxYearWizardService.js), services/{DecisionService, MonthlyEntry,
MonthFill, legacyDecision, PlanLock, LockedPlanGuard, LifeStage}.js, models/{Decision, TaxYear}.js,
storage/DecisionRepository.js, src/ui/{monthFillEntry, monthlyEntry, lockedStartUi}.js, the plan document's whereAmI, the
parity ledger's rows month.* and lock.plan-of-record / lock.arrival, and the new app's plan rail and its hand-overs
(answers/plan/read.js monthStep, services/OpenPlace.js PLACES.month / taxyear). Every example is fictional (Alex, Sam).

## 0. Who it is for, and the name

A person living on their plan comes back every month: "What do I draw this month, and from where? I missed a few months —
fill them in since April. How am I doing against the plan?" Until now the new app could only point them at the classic
planner, whose Decision tool is hard to find.

**The name: "Month by month".** It is what the classic planner calls the tool, so people who used it recognise it; it
says what the tool is for in three plain words; and it covers what part 2 adds (the months recorded, the year's
spreadsheet) as well as this month. "Decision tool" is the old internal name and "drawdown" is jargon to many. The
rail step keeps its id and address (`#/plan/<id>/month`, so no saved link breaks) and is now labelled "Month by month";
the page's own heading is "Month by month", and the first section is "This month".

It is one tool with a home page, reached three ways:
- the rail of a drawing plan, where it is the first step (bridge and running stages — it was already first);
- the rail of a retired plan that is not locked yet (`draft-retired`), as an optional step: its page says why months are
  recorded against a locked plan and links to "Lock the plan";
- "Your plans": every drawing plan's row has a plain "Month by month" link beside "Open".

## 1. What the person sees, in order

The home page of the tool, top to bottom. Each part is shown only when it applies.

1. **The plan's line** (as every plan page has it) and, on a locked plan, "Locked on …". On a plan kept in this window,
   the window warning.
2. **Not locked yet** (a retired plan not locked): "Months are recorded against a locked plan: its settings are fixed so
   every month is read against the same plan. Lock the plan first." and the "Lock the plan" link. Nothing else below.
   (The classic planner locks a plan by itself at its first record, with no plan document; the new app locks first, with
   the document, so "Where you are" has something to read the months against. Same outcome, one lock path.)
3. **Months not recorded** (a nudge at the top, when there are any): "3 months are not recorded: July 2026 to September
   2026." with "Fill them in with this month's figures" — which ticks the fill below and moves focus to it.
4. **The month.** A month chooser (every month the plan may record that is not recorded, from the earliest fill month to
   next month; it opens on this month, or the earliest month not recorded when this month is), and "This month's payment
   has already been made — plan from next month" (the classic tick: the month moves on one and the record says so).
5. **Set up the tax year** — when the chosen month's tax year is not set up. The classic set-up's three screens on one
   form, in the same order: this year's figures (last year's price rise, the suggested income before tax and where it came
   from, income before tax for the year, other taxable income, gains already made; part-way through a year, income and tax
   received so far), the tax-free top-up (what is needed to stay in the 20% band, how much the ISA or savings can give,
   and the three-way choice when it falls short), the bands as an assumption with "Change", then "What reaches your bank
   each month" (before tax, tax, after tax, by source) and **"Set up 2026/27"**. When the year is set up, one line says so:
   "2026/27 is set up from April: £40,000 a year before tax." Editing a set-up year stays in the classic planner (7.3.0).
6. **What your platform shows** — the boxes, pre-filled from the record before the chosen month with the note saying so:
   pension total, of which cash, of which bonds or gilts (a gilt-ladder plan: of which cash only), of which gold and trend
   (a plan with that sleeve); the ISA; the ordinary investment account and what it cost (a plan that has one). "Enter by
   type instead" switches to shares / bonds / cash (/ gold and trend), as the classic entry does.
7. **What to draw this month, and from where** — worked out as the boxes are typed, once the year is set up and the boxes
   add up: the pension withdrawal before tax, the tax on it, what reaches the bank after tax; the ISA top-up; any
   taxable-account sale and its capital gains tax; where the money comes from (shares, bonds, cash; or, for a gilt ladder,
   the rung or the cash bucket and what not to spend); whether income is cut this month and why (the plan's own rule);
   what to move between pots. A quarterly or yearly drawer is told that this page records one month at a time until
   7.3.0 (the classic planner records the batch).
8. **Fill in the months not recorded** — when months are missing before the chosen month: the tick "Fill in 3 months you
   did not record, July 2026 to September 2026, with these figures", "Start from" (every month back to the plan's first
   month or the April of the earliest tax year set up), and the help: one record each, worked out in order with these
   figures, marked as filled in later; a fair picture, not exact. Months before a part-way set-up take their share of what
   was entered there. A tax year not set up among them stops the fill before it, and says to set that year up first.
9. **Record** — "Record October 2026" (or "Record October 2026 and fill in 3 months"). After it: the toast with Undo, and
   the page moves on to the next month to record.
10. **Your recent months** — the last three records: month, after tax, tax, "Filled in later on 5 November 2026" where so.
11. **Coming in 7.3.0** (slots on this page, each a heading with the classic planner's link until then): "Your months
    against the plan" (history, plan against actual, delete), "Each tax year as a spreadsheet" and the printed documents,
    "How often you draw" (monthly, quarterly, yearly batches), "Change a tax year's set-up".

A couple's linked plans: each of you records on your own plan (the classic rule: one plan, one person's pension). The page
names your partner's plan with a link to its Month by month. A closed plan: its months up to the close stay readable and
writable (PlanClosed), nothing after; the plan that carries one on records nothing before its first month — the chooser
and the fill offer use the same floor and ceiling (lockedStartUi.fillPlanBounds, MonthFill.fillOffer).

**The arrival check** (a plan locked while saving, its first month after the stop): a line above Record, the classic
words (LifeStage.arrivalCheck): "Your pension pot is … against … the locked path expects at the stop …". Pressing Record is
"run the locked plan on what I have", and when the pot is outside the plan's 10% the journey gets the classic entry
("Arrival check").

## 2. Every figure and the function that works it out (nothing worked out twice)

The new app calls the classic planner's own functions. Where those read the repositories (the active plan, the signed-in
store), the reading part is lifted into a pure function that both apps call: the repository keeps calling it, with what
it read, so the classic planner works exactly as before.

| Figure | Function |
| --- | --- |
| The month's whole recommendation (SIPP draw, tax, net, ISA, GIA, which pot, protection, rebalance, glidepaths) | legacyDecision `calcDecisionPWA` — split into a synchronous `calcDecision` (same body) so the page can work it out as the boxes are typed; `calcDecisionPWA` stays and calls it |
| The engine's inputs: settings copy with the plan's first tax year, the bond tent, the buckets' order, a ladder's protection off; the history less set-up months; the tax years | new `MonthDecision.engineDeps` — lifted from index.html calcDecisionWithDeps, which now calls it |
| The State Pension for the tax year | new `statePensionInfo` (pure, in utils/StatePensionUtils.js) — DecisionRepository.getStatePensionForTaxYear now calls it |
| The plan year the pots' floors start from | PlanFromToday `runPositionOf(effectiveStressSettings(plan), deriveTiming(…)).elapsedYears` — what lockedStartUi.decisionPotsYear reads |
| Where a non-Pots-and-Valves month is paid from (the rung, the bucket, the sleeve) | new `DecisionOverlay.strategyOverlay` — lifted from index.html decisionStrategyOverlay; the ladder is the plan document's (LadderPosition `documentLadder`, `ladderPosition`, `ladderMonthAdvice`) |
| The boxes, the split, the pre-fill and its note | MonthlyEntry `platformBoxes`, `splitFromPlatform`, `prefillFromHistory`, `prefillNote`, `enteredBlock` |
| Months missing, the fill offer, its words, set-up shares | MonthFill `fillOffer`, `fillWords`, `FILL_HELP`, `setUpWords`, `setUpShares`, `setUpShareDecision`, `historyForEngine`, `refusedMonthWords`, `planFillStart`, `fillMarks`, `filledInLabel`, `recalcWords` |
| The months a plan may record | PlanClosed (`closedAtOf`, `beforeOf`) as lockedStartUi.fillPlanBounds reads them; LifeStage `decisionEntryAllowed` |
| The record itself | models/Decision `decisionToHistory`, with DecisionService.saveDecision's additions (stdSipp, the fill marks, fromSetUp, the settings checksum `decisionSettingsChecksum`) — lifted into `MonthDecision.recordOf`, which saveDecision now calls |
| The ISA used so far in the tax year | DecisionRepository.recalculateIsaSavingsUsed's sum, lifted as `MonthDecision.isaUsedIn` |
| The set-up's suggestion and context | TaxYearWizardService `getWizardData`, split into a pure `wizardDataFrom` that the async one calls |
| The top-up need, the choice, the breakdown, the stored year | TaxYearWizardService `calculateIsaNeeded`, `validateIsaInput`, `calculateMonthlyBreakdown`, `buildTaxYearConfig`; the wizard's own settle-the-choice and build-the-config steps lifted as `settleTopUp` and `setUpConfigOf` (the classic wizard calls them) |
| The arrival check | LifeStage `arrivalCheck` |
| Months recorded and the gap on the rail | answers/plan/read.js monthStep (as now) |

**How sameness is tested.** An identity gate (tests/v7/plan/monthIdentity.test.js) on every committed fixture plan that
draws: the classic repositories run against an in-memory store (as tests/lockedPlanStore.test.js does) — the classic
flow, step by step as index.html runs it (getWizardData → the set-up's config → saveTaxYearConfig; calcDecisionPWA with the
deps read from the repositories → saveDecision; the fill as monthFillEntry runs it) — and the new app's pure writers on
the same plan, month and figures. The stored plans must be byte-identical (keys sorted, the clock pinned), and the month's
recommendation equal field for field. Unit tests hold each lifted function to the classic one it came from.

## 3. Every write

All through effects/planWrite.js, each ONE write, declared in answers/plan/schema.js (`MONTH_WRITES`), checked against the
plan as stored just before it goes (a lock made elsewhere is seen):

- **Record a month (and the months filled in with it):** `decisionTool.history` (the whole list, date order, the new
  records added; a month already recorded is refused, as Calculate refuses it) and `decisionTool.taxYears` (the whole
  map, with `isaSavingsUsed` of each tax year touched worked out again from its records) — exactly what saveDecision →
  addHistoryRecord → recalculateIsaSavingsUsed writes. With the arrival check outside 10%, `journey` too.
- **Set up the tax year:** `decisionTool.taxYears` (the whole map with the year's config over the existing or default
  one), as saveTaxYearConfig writes it.
- Undo (from the toast): the previous `decisionTool.history`, `decisionTool.taxYears` (and `journey`) and the stamp.
- `lastModified` with each, as every write.

**The lock.** Monthly records are what a locked plan is for: the guard has always left `decisionTool.history` and
`decisionTool.taxYears` writable on a locked plan, and the classic set-up writes the settings back as stored. The new
app's month writes are held to an allow-list (LockedPlanGuard `MONTH_KEYS` / `monthWriteRefusal`: history, tax years,
journey) so a month can never carry a setting, and on top of that the whole guard runs as on every write (a closed plan
refuses months after its close; the plan that carries one on refuses months before its first). The settings of a locked
plan are byte-identical after any number of months recorded, filled in or undone. An unlocked plan records nothing here
(§1.2): the lock is its own step.

## 4. What part 2 (7.3.0) adds

- **Your months against the plan:** every month recorded, by tax year, against the plan of record and the plan document
  ("took this, the plan said that"), with "filled in later" marks, and delete (a month and the later months of its tax year,
  as MonthFill.recordsToDelete says).
- **Each tax year as a spreadsheet, and the printed documents** (the year's records, the plan document, a month's record).
- **How often you draw:** quarterly and yearly batches — `decisionTool.cadence`, a preference outside the lock — and Record
  writing the batch's months.
- **Change a tax year's set-up** (the classic "Reconfigure via Wizard").
- **An unlocked gilt-ladder plan's month** read from today's prices (the classic planner prices the ladder afresh before a
  lock; the new app reads the plan document's ladder, so it asks for the lock first, which every plan here does).
- Then the classic planner's Month by month has nothing left that the new app lacks, and its link can go.

## 5. As built in 7.2.0 (where the build settled what the design left open)

- **A drawing plan opens on the tool itself.** `#/plan/<id>` of a plan whose first step is Month by month draws the tool, not a
  summary of it; the rail's line ("October 2026 is not recorded yet; September 2026 is.") sits at the top of the page, and
  the rail's and the plan page's buttons ("Record October", "Set up 2027/28") link to `#/plan/<id>/month` — no hand-over.
- **The months not recorded** at the top are every month the classic fill can reach before the month chosen (a gap inside the
  records as well as after them), less a month whose payment the next record says was already made (its `paidAhead` mark, as
  the rail reads it). "Fill them in" ticks the fill from the first of them.
- **Before the year is set up**, the page works the month out as it will be once the set-up is saved, so the person sees what
  the year gives before pressing "Set up"; Record appears once it is.
- **Where the money comes from** is said in the new app's words for each case the classic overlay has (a gilt that has paid
  out, the cash set aside, the cash before the gilts start, the essentials, the invested money), never the classic page's
  own sentences, which use words the new app does not. A bought ladder's position is read from the plan document; a plan
  locked by its first record before the document existed has none, and is told where the money comes from in general words.
- **The tax-year set-up** is one pure step both apps run (services/TaxYearSetUp.js); the classic set-up's screens call it.
- **Not built in 7.2.0** (left for 7.3.0, with §4): quarterly and yearly batches (a plan that draws that way is told each month
  is recorded on its own here for now), changing a set-up year, and an unlocked gilt-ladder plan (asked to lock first).
