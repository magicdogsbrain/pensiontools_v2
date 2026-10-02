# V7 opens a saved plan, read-only: "Your plan" (design, 2 Oct 2026)

Written against 6.22.0 (main at 016ae67). No product code was written or changed. This is the chosen design: one
design, its critique, and the corrections the critique proved against the code. It delivers item 4 of
square-one-audit.md section 5, approved by the owner on 2 Oct 2026 (v7-plan-of-plans.md:196-203).

"The planner" means today's app (V6). "V7" means the preview at `/v7/`.

**What was run.** Only read-only scripts in the scratchpad:

1. An import walk from V7's two entry points (`src/v7/main.jsx`, `src/v7/effects/answerWorker.js`). Today V7 reaches
   135 files. None is under `src/storage`, `src/firebase`, `src/workers` or `src/ui`. Only `planSeed.js` and
   `draftStore.js` name browser storage.
2. The same walk from the plan-reading functions.
   - `deriveStage` reaches 36 files. None is storage, Firebase or screen code.
   - `whereAmI`'s file (PlanDocument.js:16) also reaches `src/ui/incomeLayersGraphic.js`, which is pure.
   - Today's upgrade (`upgradeScenario`) reaches three files under `src/firebase` and `src/storage`. All three are
     pure.
3. Sizes (esbuild, minified, gzip -9):
   - Firebase app and sign-in with the read-only "Lite" database code: 49 KB.
   - The same with the full database code: 98 KB.
   - The plan-reading functions: 62 KB.
4. From the design's own run: today's upgrade and `deriveStage` on the committed test plans, at 2 Oct 2026, 5 Apr 2027
   and 6 Apr 2027.
   - The locked-ladder test plan (03) moves from `bridge` to `running` on 6 April 2027.
   - Every committed test plan comes back from the upgrade marked `write: true`, because none carries a
     `schemaVersion`.

Every other claim comes from reading the file and line cited.

---

## 0. The design in ten lines

1. Every V7 page has "Your plans" in its header. Signing in carries over from the planner: one site, one Firebase
   project, kept on this device (src/firebase/config.js:21-28, 44-46).
2. V7 reads the account's plans with one read, through one file, and nothing V7 can reach can write a plan.
3. Each plan is brought up to date **in memory only**, by today's own pure upgrade.
4. The stage comes from today's `deriveStage`, run on the settings exactly as the planner reads them.
5. A plan opens on a short step list for its life stage, showing the plan's own figures, exact, each with its source.
6. A locked plan is read from its plan document. Its settings say "Fixed when you locked the plan".
7. "Change this" opens the planner in the same window, on the right plan, page and section, already filled in. A
   link leads back.
8. The other partner's plan opens **in that window only**. The account's open plan, other windows and other devices
   do not move (owner question 2).
9. Today's planner gets one patch release for this: a hand-over module, and one rule for "which plan is open here"
   (owner question 1).
10. Tests prove that browsing changes nothing:
    - every plan address is walked, with the stored plans compared byte for byte;
    - signed-in reading runs against the Firebase emulator;
    - the owner's two plans run the same checks, on his machine only.

---

## 1. What the person sees

### 1.1 Getting to the plans

- **The way in.** "Your plans" sits in the header of every V7 page. It opens `#/plans`.
- **When Firebase loads.** Only on `#/plans` and `#/plan/…`. The front door and questions A, B and C never wait for a
  sign-in check.
- **States.** The plan pages show one of these:

| State | What the page says |
|---|---|
| Checking | "Opening your plans…" |
| Signed in | The list (1.2) |
| Email not confirmed | "Your email address is not confirmed yet, so your plans cannot be read. Confirm it from the email we sent, or open the planner to send it again." [Open the planner] |
| Nobody signed in | "Sign in to see your plans." [Sign in]. Below it: "No account? Ask a question: an answer needs no account." |
| Could not read | "Sorry, we could not read your plans. Nothing was changed." [Try again] |

- **Email not confirmed.** The server refuses an unconfirmed reader (firestore.rules:17-21), so V7 does not try.
- **Signing in.** [Sign in] goes through the hand-over (section 5) to the planner's sign-in screen. Afterwards the
  planner shows "Signed in. [Back to your plans in the preview]". V7 builds no sign-in screen of its own until the
  switch (parity row `acct.sign-in`).
- **Signing out.** "Sign out" appears in the header of plan pages.

### 1.2 The list (`#/plans`)

```text
+----------------------------------------------------------------------------+
| PensionTools   Preview        Your plans   Ask a question   [ Sign out ]  |
+----------------------------------------------------------------------------+
| Your plans                                  Read at 14:03   [ Read again ] |
|                                                                            |
| YOUR HOUSEHOLD                                                             |
|   ‘{Ladder plan}’     Retired. Your ladder pays from April 2027.           |
|                       Locked {1 Jul 2026}.                        [ Open ] |
|   ‘{Saving plan}’     Still saving.                               [ Open ] |
|                                                                            |
| OTHER PLANS                                                                |
|   ‘{Stop at 58}’      Stopping work within five years.            [ Open ] |
|                       Made from your answer on {1 Oct 2026}.               |
+----------------------------------------------------------------------------+
```

- **Names.** Each name appears exactly as the person typed it, even "My Plan" (scenarioMigration.js:77). V7 never
  renames anything. Two plans with the same name are told apart by "locked {date}" or "made {date}".
- **Groups, in this order:**
  1. **"Your household".** Plans joined by `household.partnerScenarioId`, in **either** direction (section 6).
  2. **"Other plans".** The most recently changed first.
  3. **"Kept in this window only, without an account".** Shown only when nobody is signed in (owner question 5).
- **Marks on a row:**
  - "Shown as saved" on a plan saved by a newer version, or one that could not be upgraded.
  - Nothing about which plan the planner is open on. With question 2 answered "this window only", the person never
    needs to know.
- **Empty.** "There are no plans in this account yet. Ask a question, then keep the answer as a plan."
- **Unknown plan.** An unknown or deleted plan id shows "That plan is not in this account. [Your plans]".

### 1.3 A plan (`#/plan/<id>`)

A locked, retired plan (like test plan 03), on 2 Oct 2026:

```text
+----------------------------------------------------------------------------+
| YOUR PLAN  ‘{Ladder plan}’                                                 |
| Retired. Your ladder pays from April 2027.        Locked {1 Jul 2026}.     |
|                                                                            |
| [>] This month              October 2026 is not recorded yet               |
| [x] Where you are           {3} months recorded in 2026/27: £{a} taken     |
|                             before tax; the plan says £{b} for the year    |
| [x] Your plan as locked     £{c} a year before tax; your ladder pays from  |
|                             April 2027 (tax year 2027/28)                  |
| [x] What you hold           Pension £{d}, ISA £{e}. Updated {date}  optional|
| [ ] Moving to your plan's   {6} of {18} gilts bought             optional   |
|     mix                                                                    |
| [ ] What you spend          Not worked out. A guide only          optional |
| [x] Your household          With ‘{Saving plan}’: still saving             |
|                                                                            |
| Next: record October 2026.          [ Record October in the planner ]      |
+----------------------------------------------------------------------------+
```

A saver's plan that is not locked:

```text
+----------------------------------------------------------------------------+
| YOUR PLAN  ‘{Saving plan}’                                                 |
| Still saving.                                                              |
|                                                                            |
| [>] What you pay in         £{f} a month from you, £{g} from your employer |
| [ ] This month's pot        Not recorded yet                     optional  |
| [x] Your plan               Stopping work at {60}, in {June 2037}          |
| [ ] What you spend          Not worked out. A guide only          optional |
| [ ] Lock the plan           Not locked                            optional |
| [ ] What you hold           Not recorded yet                      optional |
| [x] Your household          With ‘{Ladder plan}’: retired. Their ladder    |
|                             pays from April 2027.                          |
|                                                                            |
| Next: check you are on course.     [ Am I on course? (in the planner) ]    |
+----------------------------------------------------------------------------+
```

- **On a phone.** The rail is one line that opens, as rail-screens-language.md 1.7 describes. It reads
  "Your plan: This month" with the next sentence below it.
- **What a step opens.** Pressing a step opens its panel beside the rail on a wide screen, or below the line on a
  phone.
- **What each panel holds.** The figures and their sources, and one button for each thing it shows that can be
  changed.

### 1.4 Changing something

1. **Pressing the button.** The person presses, for example, "Change what you pay in (in the planner)".
2. **The request.** V7 leaves a request in this window: the plan's id, the place and the way back. It holds no
   figures and no name. Then V7 opens the planner in the same window.
3. **The planner opens the place.** It opens that plan in this window and goes to the page by pressing the page's own
   button, so the boxes fill as they always do. Then it scrolls to the section and shows one line at the top:
   - "Opened from the preview. [Back to ‘{Saving plan}’]"
   - If this is not the plan the account opens on, it adds: "‘{Saving plan}’ is open in this window only. Your other
     windows and devices stay on ‘{Ladder plan}’."
4. **Coming back.** The person uses Back or the link. V7 reads the plans again and shows the same step with the
   changed figure.

- **Without an account.** After a reload the planner shows its landing page, because guest mode lives only in the
  page's memory (AuthService.js:89-92). "Just try it — no account" carries on with the window's plans
  (NewPlanFromSeed.js:134-153). V7 warns before leaving: "In the planner, press ‘Just try it — no account’ to carry
  on with this plan."
- **A locked plan's settings** have no Change button. Each section says "Fixed when you locked the plan on {date}."
  Where "Unlock" appears is owner question 4.
- **Records stay changeable on a locked plan**, exactly as in the planner today (rail-screens-language.md:320-327).
  They are:
  - a month;
  - a tax year;
  - the pot record;
  - What you hold;
  - the budget, which is a guide.

### 1.5 The owner's household

One partner is retired and drawing, with a locked gilt-ladder plan in its run-up. The other is still working. No names
or figures appear here.

1. **The list.**
   - **If the two plans are linked** in either direction, they sit together under "Your household".
   - **If they are not linked**, both appear under "Other plans". The locked plan's household step then says:
     "No partner's plan is linked. [Link one in the planner]".
   - The planner's "Create their plan & switch to it" makes a new plan and does **not** link it
     (index.html:3811, 10883-10906). That is why V7 looks for a link in both directions.
2. **The retired partner's plan.**
   - **Where it opens.** On "This month".
   - **Stage line until 6 April 2027:** "Retired. Your ladder pays from April 2027." From that day: "Retired. Living
     on the plan." The next sentence then first asks for the 2027/28 tax year to be set up.
   - **No countdown,** ever.
   - **Recording a month.** "Record October in the planner" opens Monthly Entry on this plan. That is the month the
     planner itself opens on (index.html:4400).
3. **The working partner's plan.**
   - **Where it opens.** On "What you pay in" (stage `saving`), or on "Your plan" when work stops within five years
     (`approaching`).
   - **Changing a figure** opens that plan in this window only. The retired partner's phone, and any other planner
     window, stay on the locked plan.
4. **Back on the locked plan.** "Record November in the planner" puts this window back on the locked plan. No
   question is asked, because nothing is written to choose a plan.
5. **What still needs care.** In a window opened on the working partner's plan, a month recorded there would go to
   that plan, and would lock it. Two things guard against this:
   - The planner asks first, because that plan is a saver's (LifeStage.js:142-157).
   - The line "‘…’ is open in this window only" stays at the top until another plan is chosen from the plan menu.

---

## 2. The steps for each life stage

### 2.1 The stage

- **Never asked.** The stage is worked out (rail-screens-language.md:41, R2) by `deriveStage` (LifeStage.js:60-108).
- **On which settings.** It runs on the **effective** Stress settings, as the planner's `refreshLifeStage` does
  (index.html:8835-8842), not on the stored copy.
- **What "effective" means.** The stored settings after:
  - the defaults are merged in;
  - old field names are renamed;
  - the old "declining" profile is folded into steps;
  - the Budget's newer age is folded in;
  - the plan start is pinned;
  - the strategy block is filled in;
  - a plan with no Stress settings gets the defaults that suit whether it is locked.

  The code for these lives at StressRepository.js:42, 131-165 and 216-266, and ScenarioRepository.js:303-308 and
  652-658.
- **Where that code goes.** Today it is private, and its load path writes the start pin (StressRepository.js:160-164).
  It moves into one pure function that both apps call (section 4.2, package P0).
- **Words.** V7 uses only `stage.key`, the dates and the flags (R9, rail-screens-language.md:48), with the fixed stage
  lines of rail-screens-language.md:63-79. It never shows `label`, `chip`, `banner`, the `reason` of
  `decisionEntryAllowed` or the `message` of `arrivalCheck`.

| `stage.key` | Stage line |
|---|---|
| `unknown` | none |
| `saving` | "Still saving." |
| `approaching` | "Stopping work within five years." |
| `committed-saving` | "Plan locked. Still working until {June 2037}." |
| `draft-retired` | "Retired. Plan not locked yet." |
| `bridge` | "Retired. Your {ladder / plan} pays from {April 2027}." ("ladder" when the document's strategy is one of `CONTRACT_STRATEGIES`, PlanDocument.js:41) |
| `running` | "Retired. Living on the plan." |

### 2.2 Which steps, in which order

The step a plan opens on is in **bold**.

| Stage | Steps, in order |
|---|---|
| `unknown` | **plan**, budget, hold, household |
| `saving` | **saving**, pot, plan, budget, lock, hold, household |
| `approaching` | **plan**, saving, pot, budget, lock, hold, move, household |
| `committed-saving` | **pot**, where, plan, saving, budget, hold, move, household |
| `draft-retired` | **plan**, budget, lock, hold, move, household |
| `bridge`, `running` | **month**, where, plan, hold, move, budget, household |

- **Optional steps** say so on the rail (R4). They are pot (except in `committed-saving`), budget, lock, hold, move,
  and household.
- **"lock"** shows only on a plan that is not locked.
- **"household"** shows when a link exists, or when the account holds more than one plan.
- **"move"** follows the planner's own rule: the move between holdings leads from `approaching` to `bridge`
  (LifeStage.js:94-99).
- **Steps not on a stage's list.** Their address still opens, and says why the step is not listed (R7).
- **No step is ever blocked** (R3).
- **A retired plan has seven steps at most.** Today's thirteen tabs and sub-pages collapse into "Your plan", which
  holds the settings as sections (2.3).
- **Two stations come later.** "Test the plan" and "One decision" (rail-screens-language.md:237-249) arrive with E
  and F. Until then, "Your plan" carries a link to test the plan in the planner.

### 2.3 What each step shows

"Locked" means `decisionTool.settings.locked`. Every figure shows its source (section 3).

| Step | Name on the rail | One-line result | Panel and source | Buttons |
|---|---|---|---|---|
| `month` | This month | "{October 2026} is not recorded yet" / "{October 2026} recorded: £{x} after tax" | The tax year's set-up ("{2026/27} set up" / "not set up yet"), then the last three records: month, after tax, tax. From `decisionTool.history` (`date`, `monthlyNet`, `monthlyTax`) and `decisionTool.taxYears[key].yearSetupComplete`. **This month** is the calendar month, the one Monthly Entry opens on (index.html:4400). It counts as recorded when the latest record's `date` is this month or later: "paid this month already" dates the entry a month on (index.html:8876-8897). | "Record {October} in the planner"; "Set up {2026/27} in the planner" when not set up |
| `where` | Where you are | Retired: "{3} months recorded in {2026/27}: £{a} taken before tax; the plan says £{b} for the year". Saver: "£{x} on {Sep 2026}; the plan's middle line for then is £{y}" | `whereAmI(doc, inputs)` (PlanDocument.js:545), with inputs from the shared `whereAmIInputs` (4.2). These are exactly what the planner's `whereAmINow` gathers (index.html:8552-8558). The ladder comes from the document only (`documentLadder`, LadderPosition.js:116). If the document holds no ladder, the panel says "The ladder is not in this plan document. The planner shows it at today's prices.", where the planner rebuilds it (index.html:9280-9295). The countdown `monthsToGo` is never shown: dates only. | "See it on the plan document in the planner" |
| `plan` | Your plan as locked (locked) / Your plan | Locked: "£{c} a year before tax; your ladder pays from April 2027 (tax year 2027/28)". Unlocked: "Stopping work at {60}, in {June 2037}" or "Retired. £{c} a year before tax" | Sections: **About you**, **What the plan pays**, **Pots and other income**, **How the money is taken**, **Everything else this plan uses** (2.5). Locked: from the plan document only (`timing`, `steps`, `pots`, `layers`, `strategy`, `assumptions`, `lockedAt`), at the prices of the lock day, said once. Also "Past versions: {n}" from `planDocumentArchive`, and stage changes from `journey`, with dates. An "Arrival check" entry (index.html:6056) shows as "Arrival check on {date}". Unlocked: from the effective settings. Old State Pension fields are read through `spSimConfigFromSettings`. | Unlocked: "Change this in the planner" on each section, each to its own place. Locked: "Open the plan document in the planner" (print, PDF, past versions); "Test the plan in the planner. Nothing you try there changes your locked plan." Unlock: owner question 4 |
| `pot` | This month's pot | "{October}'s pot is not recorded yet" / "£{x} recorded for {October 2026}" | `accumulationTool.history`, via `potRecordOf` and `saverPotOf` (SaverReading.js:190, 211) | "Record this month's pot in the planner" |
| `saving` | What you pay in | "£{f} a month from you, £{g} from your employer", plus "£{h} into ISAs and savings" / "Nothing paid in" | `accumulationTool.settings`: `netMonthly`, `employerMonthly`, `isaMonthly`, `escalationPct` | "Change this in the planner"; "Am I on course? (in the planner)". Pay-ins are not frozen by the lock. |
| `budget` | What you spend | "£{x} a month after tax, £{y} of it essentials. A guide only" / "Not worked out" | `budgetTool.settings` and its stored totals, with the line "A guide beside your plan's own figure. It changes nothing in the plan." The budget is never named in a next sentence. | "Change this in the planner" (on a locked plan too: the budget is a guide) |
| `lock` | Lock the plan | "Not locked" | "Locking fixes the plan and writes the plan document, so you can follow it month by month." A saver also reads: "You can lock it while you are still saving: the plan then follows your pot each month until you stop." That answers "nobody is told" (square-one-audit.md:16). | "Lock it in the planner" |
| `hold` | What you hold | "Pension £{d}, ISA £{e}. Updated {date}" / "Not recorded yet" | `holdings`, via `holdingsSummary` (HoldingsRecord.js:100) | "Change this in the planner" |
| `move` | Moving to your plan's mix | "{6} of {18} gilts bought" / "{4} of {7} moves done" / "Done" / "Set when the plan is locked" | `targetHoldings`, then `diffHoldings`, then `progress` (TransitionPlanner.js:71, 185, 315). The inputs come from the shared `moveInputs` (4.2), the planner's own rule at index.html:8707-8711. "Optional. Skipping it means what you hold may not match what the plan was tested on." | "Open it in the planner" |
| `household` | Your household | "With ‘{name}’: {their stage line}" / "No partner's plan is linked" | Section 6 | "Open ‘{name}’" (in V7); "Check the two plans together in the planner" |

### 2.4 The next sentence (first match wins)

This builds on rail-screens-language.md:306-318, and covers plans that are not locked.

| Id | Stage | When | Sentence | Button |
|---|---|---|---|---|
| `P.readonly` | any | the plan is newer than this version (`isNewerSchema`, schema.js:36-38), or the upgrade failed | "This plan is shown as it was saved and cannot be changed here. Nothing has been lost." | none; Change buttons hidden |
| `P.noAge` | `unknown` | always | "We cannot tell where you are without your age. Next: add it in the planner." | "Add your age in the planner" |
| `P.arrive` | `running` (a plan locked while saving) | no record since the stop month, and no "Arrival check" in the journey | "You stopped work in {June 2030}. Next: record your first month; the planner then compares your pot with the plan's." | "Record {July} in the planner" |
| `P.taxyear` | `bridge`, `running` | this tax year is not set up | "Next: set up the {2027/28} tax year." | "Set up {2027/28} in the planner" |
| `P.month` | `bridge`, `running` | this month is not recorded | "Next: record {October 2026}." | "Record {October} in the planner" |
| `P.idle` | `bridge`, `running` | recorded | "{October 2026} is recorded. Nothing to do until {November}." | none |
| `P.pot` | `committed-saving` | this month's pot is not recorded | "Your plan is locked and you stop work in {June 2037}. Next: record this month's pot." | "Record this month's pot in the planner" |
| `P.working` | `committed-saving` | recorded | "Your plan is locked and you stop work in {June 2037}. Next: check you are still saving enough." | "Am I on course? (in the planner)" |
| `P.stale` | `saving`, `approaching`, `draft-retired`, `unknown` | `staleDraft(...)` is not null (PlanTiming.js:365-377) | "This plan was set to start in {2025/26}, which has passed. Next: update it to today in the planner, or leave it as it is." | "Update it in the planner" |
| `P.draft` | `draft-retired` | always | "Next: test the plan in the planner, and lock it when it is right." | "Test it in the planner" |
| `P.approaching` | `approaching` | always | "Next: test the plan in the planner, then lock it and move what you hold to its mix." | "Test it in the planner" |
| `P.saving` | `saving` | always | "Next: check you are on course in the planner." | "Am I on course? (in the planner)" |

- **The `bridge` stage line** sits above `P.month` and `P.idle` (rail-screens-language.md:317-318).
- **The rail ends with "Ask a question".** Savers get links to A and B. Retired stages get C. These open empty: they do
  not carry the plan's figures yet. Carrying them is D's job (section 12, item 8).

### 2.5 "Everything else this plan uses": the parity section

- **What it lists.** Every setting this plan has moved away from the planner's starting value, in plain words. Each
  has "Change this in the planner", or "Fixed when you locked the plan" on a locked plan. "Show every setting" lists
  them all.
- **Where the list lives.** A pure table, `src/answers/plan/options.js`: id, the saved keys it reads, a test of
  whether it is set, and its value as data. The words live in `src/v7/copy/plan.js` under the same id.
- **What it covers.** The rows of parity-ledger.md:94-201:
  - income for some years, lump sums and extra spends;
  - final-salary rises, and the typed State Pension date;
  - tax thresholds and whether they rise;
  - the tax-free quarter and its years, and basic-rate band fill;
  - bed-and-ISA, and relevant earnings;
  - cuts in a slump (all five dials), the emergency reserve, and diversifiers;
  - the bond tent, the ISA policy and how the ISA grows;
  - the taxable account, and charges;
  - the funds to test, and each strategy's dials;
  - how often you draw, pots at retirement, and plan length.
- **On a locked plan.** The document's value is shown where it holds one. Otherwise the line says "as saved in the
  plan's settings". The lock freezes those settings (LockedPlanGuard.js, since 6.20.2).
- **The test that keeps it complete.** A test fails when any `stress.*` or `decision.*` key in
  tests/v7/parity/ledger.json is shown by no section and no table entry. So a new setting in the planner cannot be
  invisible in V7. This is the cheapest way to honour the parity rule (v7-plan-of-plans.md:191-195) before E rebuilds
  the editing.

---

## 3. Figures: where each comes from, and how it is shown

1. **No input boxes.** Plan pages hold no `input`, `select` or `textarea`. A render test checks this.
2. **Every figure names its source.** One of these:
   - "From your record, {date}";
   - "From What you hold, {date}";
   - "From your plan as locked, {date}";
   - "As saved in the plan";
   - "From your budget (a guide)".
3. **Records are exact.** They are rounded to the pound, never "about" (rail-screens-language.md 3.5). Pennies are
   banned on these screens (src/v7/copy/banned.js, `pence`). Only a figure V7 works out from records carries "about"
   once: for example, the after-tax month worked out from a before-tax step.
4. **Tax and prices are always stated.** Every income figure says "before tax" or "after tax". Locked figures say
   once, per section, "at the prices of {July 2026}".
5. **Old figures are flagged.** A figure more than three months old says "Check this figure: it is from {date}"
   (`stale`, PlanDocument.js:524).
6. **No number without a source.** No figure appears that the plan does not hold or a pure function did not work out
   from it (R8).
7. **Test hooks.** Every figure carries `data-key` and `data-value` (architecture.md:31).
8. **Plans live in page memory only.** They never go into `pt_v7_draft`, the address (except the plan's id), or any
   other storage. They are cleared when the page is hidden (`pagehide`), when the person signs out, and when the
   session ends in any window.

---

## 4. The architecture rule, changed

### 4.1 The rule, before and after

**Today** (architecture.md:30, 172-173; tests/v7/boundaries.test.js:143-156):

> Nothing in `src/v7/` imports `src/storage`, `src/firebase`, `src/workers` or `src/ui/inlineHandlers.js`, or any
> `firebase` package.

The test checks **direct** imports only.

**Proposed** (owner question 3). Rule 3 becomes four checks, all in `tests/v7/boundaries.test.js`:

- **3a. Reach.** Start from `src/v7/main.jsx` and `src/v7/effects/answerWorker.js`, and walk every import: static,
  dynamic, `export from` and worker URLs. No file reached may be under `src/storage`, `src/firebase` or
  `src/workers`, nor be `src/ui/inlineHandlers.js`, with these five pure exceptions:
  - `src/firebase/projectConfig.js` (new: the project's public settings, moved out of config.js:21-28);
  - `src/firebase/scenarioMigration.js` (the upgrade);
  - `src/storage/migrations.js`;
  - `src/storage/schema.js`;
  - `src/storage/stressDefaults.js`.

  Each of the five may import only the others, `src/constants.js`, `src/services`, `src/utils`, `src/strategies` and
  `src/data`.
- **3b. Firebase.** Exactly one V7 file, `src/v7/effects/planSource.js`, imports a `firebase` package. It may use
  only `firebase/app`, `firebase/auth` and `firebase/firestore/lite`, and only these names:
  - `initializeApp`, `getAuth`, `setPersistence`, `browserLocalPersistence`;
  - `onAuthStateChanged`, `signOut`;
  - `getFirestore`, `collection`, `getDocs`;
  - in the test build only, `connectAuthEmulator` and `connectFirestoreEmulator`.

  Every other imported name fails the test. That covers `setDoc`, `updateDoc`, `addDoc`, `deleteDoc`, `writeBatch`,
  `runTransaction` and `doc`.
- **3c. No write words.** No file reached may contain `setDoc`, `updateDoc`, `addDoc`, `deleteDoc`, `writeBatch` or
  `runTransaction`, outside comments.
- **3d. Browser storage.** Only named effects files may touch browser storage:

  | File | May touch |
  |---|---|
  | `planSeed.js` | localStorage (the seed) |
  | `draftStore.js` | sessionStorage (`pt_v7_draft`) |
  | `planSource.js` | localStorage `pt_lastActivity` (write); `pt_v7_plan_seed` (delete on sign-out); sessionStorage `pt_guest_scenarios` (`getItem` only); `pt_guest_minutes` (read only) |
  | `openPlace.js` | sessionStorage `pt_open_place` (write) |

  The test reads each file and fails on any other key, or on `setItem` against the guest key. This extends the
  existing check at boundaries.test.js:199-206.

Rules 1, 2 and 4 are unchanged. Rule 1 still bars `src/answers/**` from importing `src/storage` or `src/firebase`
directly: the upgrade runs in `planSource.js`, before the plans reach the pure code.

**Why this is safe.** Today the walk already passes: 135 files reached, none forbidden. The new reading code adds
the five pure files and the services they use. No write can be reached, and the server-side rules
(firestore.rules:18) cannot be relied on for this, because they allow the owner of the data to write as well as read.

### 4.2 The files

| File | New or changed | What it does |
|---|---|---|
| `src/services/PlanReading.js` | new, pure (the file answer-D.md 9.1 named) | `effectiveStressSettings(scenario, { now })`, the 2.1 steps lifted from StressRepository and ScenarioRepository; `planStage(scenario, { now })`; `whereAmIInputs(scenario, { now })`, which matches index.html:8552-8558 (history ascending, at most 500), with the ladder from the document only and `ladderInDocument`; `moveInputs(scenario, effective, { now })` (index.html:8707-8711); `thisMonth(scenario, { now })`. D later adds `readingFor` here |
| `src/storage/StressRepository.js`, `ScenarioRepository.js`, index.html (`refreshLifeStage`, `whereAmINow`, the transition page) | changed, no visible change | pin, then move, then point at PlanReading (architecture.md:94-96). The inline script gets shorter, not longer (shellRatchet.test.js:26) |
| `src/firebase/projectConfig.js` | new (data only) | The public project settings; config.js imports them |
| `src/v7/effects/planSource.js` | new; loaded with `import()` on plan pages only | Sign-in state, reading, idle sign-out, sign-out (4.3, 4.4) |
| `src/v7/effects/openPlace.js` | new | Writes the hand-over request and opens the planner (5.2) |
| `src/services/OpenPlace.js` | new, pure, used by both apps | The request's key, shape, check and the list of places (5.3) |
| `src/answers/plan/read.js`, `steps.js`, `options.js` | new, pure | Upgraded plans → the list, the groups, the stage, the steps, the next sentence and every figure with its source |
| `src/v7/state/*`, `router/routes.js`, `rail/plan.js` | changed / new | `state.session`, `state.plans` (architecture.md:194 kept them empty until now); addresses `#/plans`, `#/plan/<id>`, `#/plan/<id>/<step>` (`<id>` matches `^[A-Za-z0-9_-]{1,64}$`; `#/plan/<id>/c/answer` stays reserved, architecture.md:226-227) |
| `src/v7/screens/plan/*`, `src/v7/copy/plan.js` | new | Screens and words |

### 4.3 Sign-in inside V7

| What the planner does | Where | What V7 does |
|---|---|---|
| One project; sign-in kept on this device; Firestore with its default memory cache | config.js:21-28, 42-46 | The same project and the same persistence, so the same session. V7 reads with Firestore Lite, which keeps no cache: no plan data is left on the device |
| Sign-out after an hour idle, shared across windows through `localStorage['pt_lastActivity']` | index.html:5659-5722 | Records activity under the same key, at most every 10 s, on **every** V7 page, so an idle planner window cannot sign out someone reading the preview. On plan pages it runs the same one-hour check and signs out |
| A window whose session ends hides its data | index.html:5724-5735 | When the person becomes "nobody", plans are cleared at once |
| Every sign-out deletes the saved-answer seed | NewPlanFromSeed.js:123-131; GDPR_TODO.md:118-124 | V7's own sign-out, and its idle sign-out, delete `pt_v7_plan_seed` and its receipt too |
| A page restored by Back (the browser's page cache) | src/v7/effects/index.js:47-52 | Plans and session are cleared on `pagehide`. A restored page shows "Opening your plans…" until sign-in reports again. Without this, Back after a sign-out in the planner would show figures from memory |

### 4.4 Reading

- **Signed in.** One `getDocs` of `users/{uid}/scenarios`, as the planner does (FirestoreService.js:179-198), but
  nothing is written back.
- **Without an account,** and only when nobody is signed in: `sessionStorage['pt_guest_scenarios']` is read with
  `getItem` and parsed as text, as the planner parses it (FirestoreService.js:164-168).
  - After a normal sign-in that text is not cleared (`clearGuestData` runs only at index.html:5114 and 8202). So
    showing it to a signed-in person would mix old window plans with the account's.
- **Upgrading.** Each plan goes through `upgradeScenario(raw, { now: env.today })` (scenarioMigration.js:99-107) in
  memory. Its `write` flag is ignored. Today's read paths write it back (FirestoreService.js:93-110, 116-128); V7
  never does.
- **Reading again.** The plans are read again when the page opens, when it is shown again (coming back from the
  planner), and on "Read again". The header says "Read at {14:03}".

### 4.5 Speed

| Piece | Loaded | Size (measured, compressed) |
|---|---|---|
| Firebase app, sign-in, Firestore Lite | plan pages only | 49 KB (98 KB with the full Firestore) |
| Plan reading: upgrade, stage, where, ladder, move | plan pages only | 62 KB |

- The front door's 35 KB budget (architecture.md:258-265) is untouched.
- Reading is pure and quick: no futures are run. So it runs on the page, not in the worker.

---

## 5. Today's planner: one patch release (6.22.1)

### 5.1 Why the existing hand-over is not enough

- **What `pt_open_tab` can do.** It is read once after a reload and names one top-level tab of the plan the planner
  is already open on (index.html:4689-4691). It cannot name a plan, a sub-page (Settings, the plan document, Tax
  years) or a section.
- **It skips the tab's loader.** It only switches classes (index.html:4692-4700). The tab loaders run only from the
  tab's click handler (index.html:5843-5849).
- **The result.** `pt_open_tab='accumulation'` would show the Accumulation page with empty boxes, because
  `loadAccumulationUI` (index.html:10926-10943) never ran. That page's Save writes whatever the boxes hold
  (index.html:10945-10950), so the saved pay-ins could be replaced with blanks.
- **So the audit's premise does not hold.** "Needs no edit to today's app" (square-one-audit.md:241) is wrong
  (owner question 1).

### 5.2 The request

- **Where it is kept.** `sessionStorage['pt_open_place']`: this window only.
- **What it holds.** `{ v: 1, planId, place, back, at }`. No figures, no name.
- **When it is refused.** `readRequest` deletes the key on any read. It refuses a request that:
  - is more than 10 minutes old;
  - has an unknown `v`;
  - names a place not on the list;
  - has a `back` that is not `#/plans` or `#/plan/<id>[/<step>]`.
- **The old key.** `pt_open_tab` stays, for the demo link (index.html:4684).
- **If the browser refuses storage,** V7 says: "This browser would not pass the request to the planner. Open the
  planner and choose ‘{name}’ from the plan menu."

### 5.3 The places

Each place names a tab, an optional sub-page and an optional section id. Every id already exists in index.html. A test
reads index.html and fails if one goes missing.

| Place | Opens |
|---|---|
| `about`, `spend`, `way`, `pots`, `income` | Stress → Settings → `#ssTimingBlock`, `#incomeShapeBlock`, `#ssStrategyPick`, `#ssAllocAmounts`, `#ssOther` |
| `lock` | Stress → Settings → `#ssLockBtn` |
| `settings` | Stress → Settings, top (where the lock banner sits) |
| `test` | Stress → Monte Carlo |
| `month`, `taxyear`, `document` | Decision → Monthly Entry / Tax Years / Plan document |
| `potRecord`, `saving`, `onCourse` | Accumulation → `#acRecordSection` / top / "Am I on course?" |
| `hold`, `move` | Transition |
| `budget` | Budget |
| `household` | Household |
| `signin` | No plan: the sign-in screen. If the window holds plans made without an account, it goes through "keep this work" (index.html:8200-8203), so they are carried into the account |

- **Pages the plan does not show.** V7 offers a place only if the plan shows that page. A page can be hidden in two
  ways:
  - by the plan's tools (`enabledTools`; V7 then says "This plan has that page switched off. Switch it on from the
    planner's plan menu.");
  - by the stage (`stage.hidden`, LifeStage.js:98).
- **Checked twice.** The planner checks again, because a hidden tab's button still answers a click.

### 5.4 The planner's steps (`src/ui/components/OpenPlace.js`, new)

1. **At start-up,** read and delete the request, and keep it in memory for this page's life.
2. **When to act.** Only at the **first** `showMainApp` of this page's life (index.html:4630). If start-up ends
   elsewhere, the request is dropped. "Elsewhere" means:
   - the saved-answer flow;
   - onboarding;
   - the landing page left without "Just try it".
3. **Opening the plan.**
   - If `planId` is not in this account or window: show "That plan is not in this account" and the way back. Nothing
     else happens.
   - Otherwise open it **in this window** (5.5) and reload once, as the demo link does (index.html:4684).
4. **Opening the place.**
   - Press the real tab button, then the sub-page button, so the loader runs and every box fills.
   - Scroll the section into view.
   - Show the one line from 1.4, built with DOM calls in a new element. The markup of index.html is untouched.
5. **What's new waits.** The release pop-up does not show on top of a hand-over: the line's element joins the
   pop-up's "blocked" check (index.html:5189). The pop-up shows at the next start instead.
6. **The inline script stays the same length.** The `pt_open_tab` line moves into this module, and
   `showMainApp` gains one call in its place.

### 5.5 "Open in this window only" (owner question 2)

- **The pin.** `ScenarioRepository.getActiveScenarioAsync` (ScenarioRepository.js:407-430) prefers
  `sessionStorage['pt_open_plan']` when it names a plan in the list. Otherwise it falls back to `isActive`, as today.
- **Every "which plan is open" read goes through it.** These read `isActive` directly today:
  - the plan menu (index.html:5270, 5294-5300, 5316);
  - What's new (5227);
  - Download (9080).

  Each changes in place to `getActiveScenarioId()`, so the line count does not grow.
- **What clears the pin:**
  - choosing a plan from the menu (`switchScenario`, ScenarioRepository.js:507-514, then today's switch);
  - making a new plan the open one (483-491);
  - deleting the pinned plan (631-638).
- **No question is asked.** Nothing is written to choose a plan. This is about 20 lines in ScenarioRepository.

### 5.6 What the planner writes

- **The hand-over writes** only `pt_open_place` (deleted) and `pt_open_plan`, both in this window's sessionStorage.
- **Load-time bookkeeping is unchanged.** When the planner opens a plan, it does what it does on any visit, named here
  so the tests can allow exactly this and nothing more:
  - the upgrade rewrite, only for a plan below `SCHEMA_VERSION` (FirestoreService.js:93-110);
  - the plan-start pin, timing keys only (StressRepository.js:160-164);
  - a journey entry when the stage changed (index.html:8846-8851).
- **The owner's plan.** It is opened daily, so it is already upgraded and pinned. For it, the list is empty except on
  the day its stage changes.

---

## 6. Couples

- **The link is often one-way.** It is `household.partnerScenarioId`. The Household page stores it on the open plan
  only (ScenarioRepository.js:924-938; index.html:10674-10692). A plan saved from a V7 answer stores it on "your"
  plan only (PlanSeed.js:815-823).
- **V7 looks both ways.** Plan X's household is the plan X points to, plus every plan that points to X. If several
  qualify, all are listed.
- **The household step.**
  - The other plan's name and stage line, with "Open ‘{name}’" inside V7.
  - "Check the two plans together in the planner" opens the Household page of the plan that holds the link. The
    joint, survivor and care checks stay there for now (HouseholdService.js:163-237; parity-ledger rows
    `couple.survivor`, `couple.care`).
- **A partner in another account.** The step says "Your partner's plan is not in this account." The Household page
  offers only the account's own plans (index.html:10679-10684).
- **No countdown for the retired partner.** The working partner's plan shows dates ("stopping work in June 2029").
  The retired partner's plan shows none. Both pass the banned list's retired and saver patterns
  (src/v7/copy/banned.js).

---

## 7. Locked plans: what cannot happen

| Could browsing change a locked plan? | Why not |
|---|---|
| A write from V7 | V7 can reach no write (4.1). Tests: the reach rule, plus the byte-for-byte browser walks (9) |
| A write from the upgrade | Upgraded in memory only; `write` ignored |
| The plan-start pin or a journey entry | Only the planner writes these, on its own load. V7 computes them in memory |
| The account's open plan switched onto or off the locked plan | Window-only opening (5.5): nothing written |
| A month saved into the wrong plan from another window | Nothing account-wide moves, so other windows keep resolving the same plan (ScenarioRepository.js:407-430, 994-1000) |
| A settings change after the hand-over | The planner refuses it, since 6.20.2 (LockedPlanGuard.js; architecture.md:109-113) |

---

## 8. Data protection

- **Nothing new on the server side.** No new processor, no new Firestore path, no new data category. V7 reads
  `users/{uid}/scenarios` under the existing rules (firestore.rules:17-21).
- **Read-only is enforced by V7's code, not by the server.** The rules allow the data's owner to write too, so the
  tests in section 9 are the guarantee.
- **New browser keys, both this window only, neither holding figures or names:**
  - `sessionStorage['pt_open_place']`: the hand-over request, gone when read or after 10 minutes;
  - `sessionStorage['pt_open_plan']`: which plan this window's planner is on.
- **No plan data stored on the device.** Plans live in V7's page memory only (Firestore Lite keeps no cache), are
  cleared on `pagehide` and at sign-out, and never go into an address. A plan's id does, and it holds no figures.
- **The sign-out rule extends to V7.** V7's own sign-out and idle sign-out delete the saved-answer seed, as the
  planner's do (GDPR_TODO.md:118-124).
- **Policy.** One sentence is added to "Storage in your browser" (compliance/PRIVACY_POLICY.md:34;
  public/privacy.html:76):
  > "When you move from the preview's plan pages to the planner, this browser tab notes which plan and page to open.
  > The note holds no figures and is gone once it is used."

  GDPR_TODO.md gains an entry for this step, as 1 Oct's entry did for "Save this as a plan" (GDPR_TODO.md:112-134).
- **The owner's two plans as test fixtures.** They stay on his machine (v7-plan-of-plans.md:143), as decided. The
  working partner's plan is her data, so it is exported only with her agreement.

---

## 9. Tests

| # | Test | Kind | Proves |
|---|---|---|---|
| T1 | `effectiveStressSettings`, `planStage`, `whereAmIInputs`, `moveInputs` on the 12 committed plans and 2 new ones, at 2 Oct 2026, 5 Apr 2027 and 6 Apr 2027, pinned **before** the move and unchanged after it | unit | One path from saved plan to stage and figures in both apps |
| T2 | The rail function for every stage × locked or not × linked or not × newer or failed upgrade | unit | Exactly one current step and one next sentence; R3, R5, R7; the 2.2 table |
| T3 | Rules 3a-3d (4.1) | static | V7 can reach no write |
| T4 | Options-table completeness against tests/v7/parity/ledger.json | static | Every saved setting is visible in V7 |
| T5 | Render tests on every plan state | jsdom | No input boxes; `data-key`/`data-value` on every figure; a source on every figure; the wording check, with retired rules for retired stages; no countdown |
| T6 | `state.plans` never reaches `pt_v7_draft`; `pagehide` and "nobody" clear it | unit | Memory only |
| T7 | `OpenPlace.readRequest`, plus every place's ids present in index.html | unit, static | The contract |
| T8 | The planner with a request: the right tab, sub-page and section, with its loader run (Accumulation boxes filled from the plan) | jsdom | 5.1 cannot recur |
| T9 | A window pinned to plan B: every `saveActive*` goes to B. A second module instance, unpinned, goes to the `isActive` plan. The menu clears the pin | jsdom | 5.5 |
| T10 | Browser, guest path: the locked plan and the new household pair in `pt_guest_scenarios`; every `#/plan/…` address and step visited, every link followed; stored text byte-identical; only `pt_v7_draft` written. Extends e2e/crawl.spec.js:133-206. The crawl's "no digit in the address" check (crawl.spec.js:34) becomes "no digit outside the plan id" | Playwright | Browsing writes nothing |
| T11 | Browser, signed in: Auth and Firestore emulators with the real firestore.rules (needs `firebase-tools` as a dev dependency and an `emulators` block in firebase.json; config.js:49-53 already connects in development). Seed an account with plans 03, 13 and 14. Sign in through the planner, walk every V7 plan address, compare every document's data and update time before and after. Unconfirmed email: no read is attempted | Playwright | The real read path writes nothing |
| T12 | The round trip in the emulator: Change, then the planner on the right page with boxes filled, then Back, and the step shows the new figure. `isActive` unchanged; the allowed writes are exactly 5.6's list, and empty for an already-current plan | Playwright | The hand-over |
| T13 | Sign out in the planner, then Back to V7: no figure on screen. Idle for an hour in V7: signed out, seed gone | Playwright | 4.3 |
| T14 | The owner's two plans (tests/fixtures/local, never committed): T1, T10 and T12, plus the `where` and `move` figures equal to the planner's to the pound | local | His household, as it really is |

**New committed test plans,** both made up:

- `13-household-ladder.json`: locked full ladder, `bridge`, linked to 14 one way;
- `14-household-saver.json`: not locked, `saving`, no link back.

These are the first committed pair shaped like the owner's household. 09 and 10 are both unlocked.

---

## 10. Build packages

Each package owns its files. No file is shared between packages.

| Pkg | What | Files | Needs | Rough cost (days) |
|---|---|---|---|---|
| P0 | Pure lifts in today's code, no visible change: PlanReading, projectConfig, the pin-move-point of 4.2; T1 | `src/services/PlanReading.js`, `src/firebase/{projectConfig,config}.js`, `src/storage/{Stress,Scenario}Repository.js`, index.html (three call sites) | — | 2 |
| P1 | The planner's hand-over and window-only plan (6.22.1, release note); T7-T9 | `src/services/OpenPlace.js`, `src/ui/components/OpenPlace.js`, `src/storage/ScenarioRepository.js`'s pin, index.html (one call, five reads), `package.json`, `src/releases.js` | P0; owner questions 1 and 2 | 2 |
| P2 | V7's plan source: sign-in, reading, idle, sign-out; T3, T6, T13 | `src/v7/effects/planSource.js`, `src/v7/effects/index.js`, `tests/v7/boundaries.test.js` | P0; owner question 3 | 2 |
| P3 | Pure plan reading and the rail; T2 | `src/answers/plan/{read,steps}.js`, `src/v7/rail/plan.js`, `src/v7/state/*`, `src/v7/router/routes.js` | P0 | 2 |
| P4 | Screens and words; the hand-over effect; T5 | `src/v7/screens/plan/*`, `src/v7/copy/plan.js`, `src/v7/effects/openPlace.js`, `src/v7/App.jsx` | P3; buttons stay hidden until P1 ships | 3 |
| P5 | The parity section, ledger and test; T4 | `src/answers/plan/options.js`, `tests/v7/parity/*`, research/v7/parity-ledger.md (generated) | P3 | 1 |
| P6 | Browser tests, emulator, new fixtures, privacy text; T10-T12, T14 | `e2e/plan-*.spec.js`, `e2e/crawl.spec.js`, firebase.json, tests/fixtures/plans/13-14, compliance/*, public/privacy.html | P2, P4 | 2 |

In total, about two to three weeks. The audit said one to two (square-one-audit.md:241). The difference is P1 and the
emulator.

---

## 11. Parity ledger changes

- **Wholly reading, so they become built:**
  - `ways.life-stages`, `ways.next-step`;
  - `lock.where`, `lock.newer`;
  - `inc.state-pension-old`, read through `spSimConfigFromSettings`.
- **Shown in V7 but changed in the planner:**
  - `lock.document`, `lock.ladder-card`, `lock.arrival`, `save.pot-record`, `ways.journey`.

  These keep their editing step, and each note gains "Shown in V7 from s4 ({file})".
- **`lock.plan-of-record`** stays planned. Nobody sees it.
- **`ways.open-tab`** is replaced by a new row "Open the planner on a plan, page and section", with keys
  `browser.pt_open_place` and `browser.pt_open_plan`.
- **The ledger's key list gains those two browser keys.**

---

## 12. Where this changes earlier documents

1. **square-one-audit.md:241.** "The existing `pt_open_tab` hand-off … needs no edit to today's app": wrong (5.1). A
   patch is needed (owner question 1).
2. **architecture.md:106-113.** "V7 reads saved plans through today's repositories": wrong, because those write on
   read (FirestoreService.js:93-110, 116-128; StressRepository.js:160-164; index.html:8846-8851). V7 reads through
   the pure upgrade and PlanReading.
3. **architecture.md:30 and 172-173,** boundary rule 3: replaced by 4.1 (owner question 3).
4. **architecture.md 3.8.** "Firebase: not in the first slice" becomes "plan pages only, 49 KB".
5. **rail-screens-language.md:391-400.** "Signed in: straight to Your plan" waits for 7.0, so that the front door
   never waits for Firebase. Until then, "Your plans" sits in the header.
6. **rail-screens-language.md 1.6.** The example "September 2026 is not recorded yet", shown in October, names the
   wrong month. The month is the one Monthly Entry opens on: the current calendar month (index.html:4400).
7. **rail-screens-language.md 1.6.** The stations "test" and "decide" come with E and F. In this step "test" is a link
   on "Your plan".
8. **answer-D.md 9.1.** The reverse hand-over (`pt_v7_plan_reading` and a "Check it from today" button) is no longer
   needed. D reads the plan through `planSource.js`. `readingFor` stays a pure function, in PlanReading.js.
9. **parity-ledger.md, row "Open today's app on a given tab".** Replaced (section 11).
10. **e2e/crawl.spec.js:34.** Digits are allowed in the plan-id segment only.

---

## Questions for the owner

**1. May today's planner get one small patch release (6.22.1) so that "Change this" lands in the right place?**

- **About.** Every "Change this" button in V7's plan pages has to open the planner on the right plan and page, with
  the boxes filled in. Today's one-line hand-over (`pt_open_tab`) cannot name a plan or a sub-page. It also skips the
  page's loader, so the Accumulation page would open with empty boxes, and its Save button would then write those
  blanks over your saved pay-ins (index.html:4689-4700, 5843-5849, 10926-10950). The approved plan said this step
  "needs no edit to today's app" (square-one-audit.md:241), and that turns out to be wrong.
- **The choice.**
  - (a) Ship one patch release with a release note. It adds a small hand-over module to the planner: open this plan,
    this page, this section, with a link back.
  - (b) Make no visible edit. V7's buttons open the planner's start page, and each says in words where to go, for
    example "In the planner: Accumulation, then ‘Record this month's pot’".
- **Recommendation:** (a).
- **If (b).** Every button becomes "Open the planner" plus directions. To change the other partner's plan you choose
  it from the planner's plan menu, which switches the plan your whole account opens on (today's behaviour), and
  question 2 falls away. The invisible code moves (section 4.2, P0) happen either way: the architecture already
  allows them.

**2. When you change your partner's plan from the preview, should the planner open it in that window only?**

- **About.** Your household has a locked plan and a working partner's plan in one account. Changing the partner's
  plan means the planner must open it.
- **The choice.**
  - (a) That window only. The planner remembers the plan for that window, and nothing is written to either plan. Your
    other windows, and your phone, stay on the plan the account opens on: your locked plan.
  - (b) The planner switches the plan the whole account opens on, after a question naming both plans.
- **Recommendation:** (a).
- **If (b).** Each switch does three things:
  - It rewrites any plan in the account that needs a format upgrade, and writes the "open" flag onto your locked plan
    (FirestoreService.js:339-365, 93-110).
  - Your phone then opens on your partner's plan.
  - A planner window still showing your locked plan can, after it reloads its copy, save your month into your
    partner's plan (ScenarioRepository.js:407-427, 994-1000).

  Choosing (a) needs question 1 to be (a).

**3. May V7's founding rule ("nothing in V7 touches the saving code") become "nothing V7 can reach can write a plan"?**

- **About.** V7 was built on a rule that no V7 file may import today's storage or Firebase code (architecture.md:30,
  172-173). It is enforced by a test. Showing your saved plans needs Firebase, to read, and today's upgrade code, to
  bring an old plan up to date in memory.
- **The choice.**
  - (a) Replace the rule with a stricter test of a different kind. Exactly one V7 file talks to Firebase, using
    read-only calls only. Five named, pure files of today's code may be reached. A test walks every import V7 can
    reach and fails on any write call, or on any other storage or Firebase file (section 4.1).
  - (b) Keep the rule. Plans reach V7 only when the planner hands over a reading of one plan through the browser
    window, as designed for D (answer-D.md:852-870).
- **Recommendation:** (a).
- **If (b).** There is no list of your plans and no household view in V7. Each plan needs a "Look at it in the
  preview" button in the planner, and V7 shows only the plan the planner was on. A second hand-over format has to be
  maintained, and it is thrown away at 7.0.

**4. On a locked plan, where should V7 offer to unlock it?**

- **About.** A locked plan's settings are fixed. You ruled that question D "never suggests unlocking"
  (v7-plan-of-plans.md:199-200). The rail design offered "Unlock to change the plan" on the strategy
  (rail-screens-language.md:320-327). This plan view has five places where a locked setting is shown.
- **The choice.**
  - (a) Once only. The "Your plan as locked" step has one link, "To change a locked plan, the planner unlocks it
    first. Unlocking keeps this plan document as a past version, and the planner asks before it does it." Every
    setting elsewhere says only "Fixed when you locked the plan on {date}".
  - (b) Never. V7 shows "Fixed when you locked the plan" and nothing more; unlocking is found in the planner.
  - (c) On every locked setting.
- **Recommendation:** (a).
- **If (b).** The preview gives no route to changing a locked plan, and D's ruling covers all of V7. If (c), unlocking
  is offered five times on one screen, which reads as a nudge.

**5. Should the preview show plans kept in a browser window without an account?**

- **About.** Someone without an account can keep a plan in one browser window only. The planner limits that use to
  three active hours and then stops (GuestMeter.js:10, 37). You decided V7's answers do not count against those hours
  (v7-plan-of-plans.md:201). Looking at a kept plan in V7 is a different thing, and it touches how the free time leads
  to signing up.
- **The choice.**
  - (a) Show them, read-only, and only when nobody is signed in. Looking does not count against the three hours. Once
    the three hours are used up, V7 shows only "Your free time without an account is used up. Sign in or create an
    account to keep and see this plan". In both cases, V7's "Sign in" carries the window's plans into the account
    (index.html:8200-8203).
  - (b) Show only plans in an account. Someone without one sees "Sign in to see your plans", even if the window holds
    a plan.
- **Recommendation:** (a).
- **If (b).** A person who kept an answer as a plan without an account cannot look at it in the preview, and the
  "Kept in this window only" group and its tests are dropped. The changing is metered either way, because it happens
  in the planner.
