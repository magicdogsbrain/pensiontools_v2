# Square one: where we stand (audit, 2 Oct 2026)

Written against 6.20.1 and the /v7/ preview. No product code was changed. Every claim points to a file and line,
or to a section of a document. "Today's app" means the live app (v6). "V7" means the preview at /v7/.

You asked four things. Here are the short answers.

1. **Are we still on the square-one road?** For the first part of the journey, yes, and V7 does it better than
   today's app. For the rest of the journey, no, not yet: every V7 answer ends by handing you to today's Stress
   tester settings. That is the screen square one set out to replace.
2. **Are we keeping everything today's app does?** Today, yes, because nothing has been taken away: today's app is
   unchanged and every plan still lives in it. At the switch to 7.0 the answer is "not safely". About a dozen of
   today's functions have no home in any V7 design, and nothing in the switch-over check would notice if one went
   missing.
3. **Can someone lock a plan before retiring, while still saving?** In today's app, yes: the stage is called
   "Committed, still saving". But nobody is told it exists. Its reading of the saver's pot drifts with price rises
   and counts the pension only. And a saver can lock a plan by accident. In V7, no: V7 cannot open a saved plan, and
   none of its built questions can lock one.
4. **What would keep every function and add V7's better experience?** Five small things now, then let V7 open a
   saved plan before building D. The details are in section 5. The open decisions, explained in plain words
   (including the 2028 one), are in section 6.

---

## 1. How people begin today, and where the budget sits

### The ways in

| Way in | What the person sees first | Budget first? |
|---|---|---|
| Landing page → sign up → welcome tour → setup wizard | Name, single or couple, ages, retirement age (required). Then "Where would you like to start?" with four choices (SetupWizard.js:226-270) | Only if they pick "Work out my budget", marked Recommended |
| Wizard: "See if I can afford to retire" / "Decide this month's withdrawal" | That tool's Settings page (index.html:4941-4943) | No |
| Wizard: "I'm already drawing my pension" | Stress tester; the plan starts this tax year (SetupWizard.js:737-741) | No |
| "Just try it — no account" | Someone else's ready-made example plan, on the Strategies overview (index.html:5036-5071) | No |
| `?demo=1m` link | The same example plan (index.html:5073-5084) | No |
| Saved from V7 ("Save this as a plan") | A new, unlocked plan opened on Stress tester → Settings (NewPlanFromSeed.js:91-92) | The budget comes along only as a guide |
| Returning visitor | The Decision tool, whatever their stage (index.html:4666) | No |
| "+ New plan" | The tour again, then the same wizard (index.html:5413-5435) | As the wizard |

There is **no "I'm still saving" choice** in the wizard (SetupWizard.js:226-270). Nothing on the live site links to
/v7/ (architecture.md:23).

### The budget's place

- **In today's app the budget is the story's first step.** It is Step 1 on the landing page
  (LandingPage.js:47-53), "Start here" in the tour (OnboardingPage.js:78-85), the wizard's recommended choice, which
  says "it drives everything else" (SetupWizard.js:239), and the first two steps of the next-step banner
  (index.html:8160-8168). Its total, with tax added on, becomes the plan's spending target through "Use as the
  start of my income shape" (index.html:12201-12254). It is never a gate: every tool works without it.
- **In V7 the budget is a guide, by your rule of 1 Oct** (budget-step.md:9-15). It is a step in A and B, between
  your numbers and the answer. It is recommended and can be skipped with one figure, and the person is told they
  are skipping it. The figure in the box is always the person's own; the budget's total sits beside it.
- So both apps let people start with the budget or skip it. The difference is that in V7 the budget no longer
  sets the target. That is a deliberate change of direction, not a loss.

### By kind of person: today's route and where it goes wrong

| Person | Route today | Where it goes wrong (still open) |
|---|---|---|
| Saver, years away | Wizard → Budget → Stress settings (Timing: "I will retire at") → run. Accumulation is the 5th tab, under More on a phone | Must type a retirement age before they can find one (SetupWizard.js:713-716). The banner then says "set up the monthly Decision Tool" (index.html:8173-8176); their own stage advice waits behind it (index.html:8181). Ages are typed in three places. Next visit lands on Decision |
| Approaching (within 5 years) | Stress → Strategies → lock → Transition | The lock button is at the foot of a long page. On a phone, Transition is in neither the bottom bar nor More (index.html:2235-2240, 8281-8284) |
| Locked while still saving | See section 3 | Not told the stage exists; the readings drift (section 3) |
| Retiring now, income from next April | "Already retired" fixes the start at this tax year; the run-up is a box deep in Timing (index.html:3151-3167) | The wizard never offers "my plan starts next April" |
| Retired years ago | "Pick up from here" → Stress → lock → Decision | Until a budget exists, the banner says "Start here: walk through what retirement will actually cost" (index.html:8160-8163), though they know what they spend |
| Final-salary pension, small pot | Stress settings, "Other income", 9th block, start as a plan year not an age (index.html:3508-3534) | Hard to find; the wizard never asks |
| Couple at different stages | Budget split → own Stress settings → Household tab → "Create their plan" → partner's settings → run | Five steps across three tabs; guests blocked (index.html:10897) |
| Visitor with no account | A stranger's example plan | To see their own figures they must overwrite it |
| Arriving from V7 | A plan already set up, opened on Stress settings | With no budget: told to "Start here" with the budget (index.html:8156-8163). With a budget: told to set up the Decision tool, even as a saver. The Budget page says "a guide" beside a button that changes the target (index.html:12010) |

Fixed since August, from the QA notes: the saver who got 100% on the default pots (6.10.2), the countdown to the tax
year instead of the stop month (6.10.3), the locked plan told to start the budget (6.10.4), couples' budget lines all
set to "me", and Household crashes (research/qa-audit-7-sep-2026.md:211-233; persona-test-2-aug-2026.md:34).

---

## 2. What V7 has done so far, against the brief

| The brief asked for (product-plan.md) | Status | Evidence |
|---|---|---|
| First answer in under 2 minutes from about 3 numbers (59-61) | **On course**, measured | C: two figures, 20 seconds (e2e/c-forum-guest.spec.js:22); A and B within 40 seconds. Today's recommended start is a 10-minute budget (index.html:8161) |
| A plain sentence for every headline number (62-63) | **On course** in V7; none in the planner yet | Sentences built from the same numbers (architecture.md:27); bad case = worst 1 in 10 |
| Age, pot and spend as things to try (64-65) | **On course** | A's every-age table, Try a change, B's options |
| Strategy as a thing to try (64-65) | **Not started** | V7 answers use one way of drawing, with the slump cuts off (src/answers/shared/toEngine.js:312-323) |
| A start-here chooser (48-50) | **On course**, in a better form | Six questions instead of "what is your situation" (your decision). Only A, B and C open (src/v7/rail/questions.js:20) |
| Couples and final-salary pensions from the first screen (plan of plans §1) | **On course** | 6.20.0: couples who stop in different years |
| Paths explained: how to go on from where you started (17-24) | **Drifted** | Every question ends at "Keep", which opens today's Stress settings. "Answer everything in full" opens a "not in the preview yet" page and drops the figures (src/v7/screens/a/AnswerScreen.jsx:255 and four more) |
| A journey rail across the tools, ending at the plan document (51-54) | **Drifted** | Built: one rail per question, ending at Keep. Designed but not built: E's rail and the "Your plan" rail by life stage (rail-screens-language.md 1.5-1.6). The built rail "never reads the old app's life stages" (src/v7/rail/index.js:24), deferred on purpose because V7 cannot open a plan (step3-build-brief.md:138) |
| "Does a user have to use the transition plan?" answered on its face (22-24, 57-58) | **Not started** | One line in E's design (rail-screens-language.md:203). The "Holdings and the move" sub-plan is not written. Today's Transition page does not say it is optional |
| Back to square one: reorganise the app, not add help (30-31) | **At risk** | V7 is a new shell, but every plan still lives in the old tabs, which are frozen to fixes (architecture.md:32). Today it is a new front door on the old house |
| Rename "Stress Tester" (25-29) | **Decided, not shipped** | "Drawdown Planner", tied to 7.0 (architecture.md:266-268). Live tab still says "Stress Tester" (index.html:2259); page title still "Pension Planner v6" (index.html:6) |
| Property and equity release, "build first" (111-114) | **Not started, and not in the plan of plans** | Only "the mortgage" under F (v7-plan-of-plans.md:20) |
| Annuity comparison (115-116) | Planned (F; C's "ways" step), not built | rail/c.js:11 |
| Trust pages, title fix, www DNS (156-161) | Not started | Step 9 of the order of work |

**Checkpoints the plan set itself and has passed.** The requirements baseline (due at step 0), the screen-code
extraction map and the cutover plan (both due before step 3) are not written (v7-plan-of-plans.md:114, 121, 123).
Steps 3, 4 and 5 shipped without them.

**What limits progress.** About 18,500 lines of V7 code arrived in three days. Building is not the bottleneck.
The pace is set by designs that do not exist yet (E, holdings and the move, cutover) and by your open decisions.

---

## 3. Locking a plan before retiring, while still saving

### Today's app: yes, since 6.7.0

1. In Stress → Settings → Timing, choose "I will retire at age X". The plan is priced on the pots you will have
   then, typed in or projected (index.html:8953-8957).
2. Press "Lock plan & create the plan document" (index.html:3636, 8510-8541). The document stores a saving path from
   today's pot plus your monthly payments (PlanDocument.js:144-168).
3. The stage becomes "Committed, still saving" (LifeStage.js:27-31).
4. Each month, record your pot on the Accumulation tab. It is read against the locked path
   (index.html:8824-8837; PlanDocument.js:535-550).
5. The Decision tool refuses months before you stop and points you to the pot record (LifeStage.js:118-130).
6. The first month after you stop, an arrival check compares your real pot with the planned one. You then choose:
   run the plan as it is, or unlock and re-plan (LifeStage.js:136-147; index.html:6023-6033).

### What is wrong with it

| Problem | What the person would see | Where |
|---|---|---|
| Nobody is told | The tour says "the Budget and Stress Tester never lock", wrong since 6.5.0. The landing page never mentions it. The wizard has no saving door. The stage's banner button opens the plan document, not the pot record | OnboardingPage.js:168; LifeStage.js:30 |
| Price rises are lost | The path is in prices on the day of the lock (2.5% a year taken off); the pot you record is in that day's pounds. After ten years of prices rising 2.5% a year, a pot exactly on course reads about 28% ahead. The arrival check then offers to unlock and re-plan | AccumulationEngine.js:166-169; PlanTiming.js:269-284; LifeStage.js:139-146 |
| Pension only | The path, the reading and the arrival check count the pension. The ISA is projected with no payments in | PlanDocument.js:149-150, 543; PlanTiming.js:282 |
| "Refresh" breaks the reading | Refreshing the document restarts the path from today's pot, but the clock still runs from the first lock, so the saver looks behind | index.html:8504; PlanDocument.js:538-540 |
| Locking by accident | A saver with an unlocked plan who records one Decision month locks the plan. That lock writes no saving path. Returning visitors land on the Decision tool | DecisionService.js:46-47; PlanLock.js:73-80; index.html:4666 |
| The Budget can change a locked plan | "Use as the start of my income shape" writes the locked plan's Stress settings. So, it seems, does the optimiser's "Apply this split" (index.html:6909-6929). Only the Settings form's own Save button checks the lock | index.html:12201-12229, 11298-11303; StressRepository.js:283-287; ScenarioRepository.js:648-661 |
| Three different bars | "On track" uses 85% (index.html:3746), the age sweep 90% (index.html:3715), V7 9 in 10 | — |

6.20.1 fixed the same two faults (price rises, pension only) for a **retired** person's reading. It left the saver's
reading as it was (PlanDocument.js:442-444).

### V7: no

- "Save this as a plan" makes an **unlocked** plan (save-as-plan.md:243). A and B have no lock step. D's lock step
  was turned into "Keep" (answer-D.md:210). Only E's design has a lock (rail-screens-language.md:201).
- V7 cannot open a saved plan at all; its address for one is reserved and not built (architecture.md:216).
- The design for a locked saver opens on "Your plan" (rail-screens-language.md:225). Its only sentence is "check you
  are still saving enough" (rail-screens-language.md:315). It has **no place to record the monthly pot** and no saving
  path, which today's Accumulation tab has.
- One thing V7 does better: it takes regular saving into ISAs ("savingsIn", src/answers/shared/schemaParts.js:154).
  Today's app has nowhere to keep the monthly amount. A saved plan keeps only the ISA figure it leads to at the stop
  (PlanSeed.js:568-570), so a lock made from it cannot follow the ISA month by month.

---

## 4. Every function of today's app, and where it stands in V7

Status: **Built** = in the /v7/ preview. **Designed** = in a V7 design document. **No home** = no V7 document names
a place for it. "Step" is the step in the order of work (v7-plan-of-plans.md §4): 3-5 done, 6 D, 7 E with holdings
and the move, 8 month by month and the switch, 9 F and trust pages.

| Function (where today) | Who uses it | V7 status | Step |
|---|---|---|---|
| **Ways in** ||||
| Landing, tour, setup wizard (LandingPage.js, OnboardingPage.js, SetupWizard.js) | New people | Replaced by the six-question front door | 3-5 |
| Try without an account, example plan (index.html:5036-5071) | Visitors | Replaced by answers on your own figures with no account; the example plan has no home | 3 |
| Next-step banner and tabs led by life stage (index.html:8143-8196, 8866-8870) | Everyone | Designed (rail sentences, rail by stage); needs V7 to open a plan | none |
| "Land where you left off" (roadmap.md:143-155) | Returning | Not built in either app | none |
| **Budget** ||||
| Lines, typical amounts, walk-through, national guide levels (index.html:3887-3953) | Savers, retired | Built (budget step) | 4-5 |
| One-off costs (index.html:3940-3946) | Savers, retired | Built, as a guide | 4-5 |
| A line from or to an age (BudgetModel.js:237) | Retired, approaching | Not built; D's question 2 would add one later amount | 6 |
| Me / Partner / Shared, and "who pays" changing over time (index.html:3859-3883) | Couples | **No home** (V7's budget is the household's) | none |
| Export and import as a spreadsheet (index.html:3912-3913) | Budget keepers | **No home** | none |
| Budget becomes the target, essentials become the Floor & Flex floor (index.html:12201-12229) | Everyone | Changed on purpose: the budget is a guide (your rule, 1 Oct) | done |
| **Drawdown planner (Stress tester)** ||||
| Timing: age, stop age, plan start, pots at stop (index.html:3150-3166) | Everyone | Built for answers; "income from next April" not offered | 4-5 |
| Income steps by age, decline (index.html:3198-3213) | Retired, approaching | Partly (one level figure; D may add one later amount) | 6-7 |
| Nine strategies, their dials, the compare page, a page per strategy (index.html:3137-3297, 10146-10237) | Approaching, retired | Designed (E) with no written contract | 7 |
| Monte Carlo, history, scenario charts (index.html:2779-2881) | Approaching, retired | Designed (E) | 7 |
| Try a strategy, never saved (index.html:2818-2830) | Everyone, locked plans too | Designed (try-only) | 7 |
| Risk level or a fund list; diversifiers (index.html:3300-3448) | Approaching, retired | Risk level built; fund list designed | 5 / 7 |
| Bond tent (index.html:3452-3462) | Approaching, retired | **No home** | none |
| Optimise allocation (index.html:6683-6834) | Approaching, retired | **No home** | none |
| Tax-free cash method, basic-rate band fill, ISA policy, taxable account (index.html:2982-3026, 3337-3389) | Approaching, retired | Partly; band fill and ISA policy have **no home**; F has tax-free cash order | 7, 9 |
| Final-salary pension, State Pension, other income, lump sums (index.html:3508-3576) | Everyone | Built for first answers (final salary by age) | 3-5 |
| Cuts in a slump (protection) (index.html:3584-3611) | Approaching, retired | Designed (E); off in V7 answers | 7 |
| Emergency reserve, "Break Glass HODL" (index.html:3613-3630) | Approaching, retired | **No home** | none |
| Charges (6.19.0) | Everyone | Built | done |
| Drawdown schedule and ISA bridge table (index.html:2882, 7168) | Approaching, retired | **No home** (A's "before State Pension" step is a summary) | none |
| "Update this draft to today" offer (index.html:2954, 9041) | Retired drafts | **No home** | none |
| Gilt explainer, order sheet, rotation ticket (index.html:2904-2916, 6203-6250) | Approaching, running | Designed (E "move", locked rail) | 7 |
| **Lock and plan document** ||||
| Lock, plan document, unlock and archive (index.html:8510-8559; PlanLock.js) | Approaching, locked | Designed in E only; not in A, B or D | 7 |
| Saving path and monthly pot record (index.html:3728-3739) | Locked savers | **No home** | none |
| Arrival check (LifeStage.js:136-147) | Locked savers at their stop | Designed (rail-screens-language.md:313) | 8 |
| "Where you are" line (PlanDocument.js:528-578) | Locked | Designed (locked rail "where") | 8 |
| **Month by month (Decision tool)** ||||
| Monthly entry, what to draw and from where, tax summary (index.html:2291-2393; DecisionPanel.js) | Run-up, running | Designed (locked rail "month") | 8 |
| Tax-year set-up (TaxYearSetupWizard.js) | Run-up, running | Designed (rail-screens-language.md:311) | 8 |
| History, plan vs actual, spreadsheet per tax year, PDFs (index.html:2707-2750) | Running | Designed (carried over) | 8 |
| **Saving years (Accumulation)** ||||
| Payments with tax relief and employer (index.html:3677-3702) | Savers | Built (B) | 5 |
| Projection at three fixed rates (AccumulationEngine.js:41) | Savers | Replaced by the saving-years engine | 4 |
| "When could I retire?" (RetireSweep.js) | Savers, approaching | Built (A's ages), on a different engine | 4 |
| "Am I on track?" (index.html:3741-3750) | Savers | Built (B) | 5 |
| **Holdings and the move (Transition)** ||||
| What you hold, pasted from a platform (TransitionView.js:41-89) | Everyone | Designed ("hold"); sub-plan not written | 7 |
| Buy/sell list, cash to hold, schedule, rotation watch (TransitionView.js:90-163) | Approaching, locked | Designed ("move"); "is it optional?" unanswered | 7 |
| **Couples (Household)** ||||
| Partner's linked plan, joint check (index.html:3766-3830) | Couples | Built for first answers (two linked plans on save) | 3-5 |
| Survivor check, care-cost check (HouseholdService.js:163-237) | Couples | **No home after 7.0** ("today's planner keeps them", answer-D.md:842) | none |
| **Plan and account** ||||
| New, duplicate, download a plan (index.html:2212-2221) | Everyone | **No home** | none |
| What's new pop-up and page (src/releases.js) | Everyone | **No home** in V7's shell | none |
| Sign in, delete account, reset (index.html:2228-2231) | Everyone | Not in V7 yet; must exist at the switch (data protection) | 8 |
| "Saved by a newer version" banner | Everyone | Designed (P.readonly) | 8 |
| Phone navigation | Everyone | Designed (rail 1.7) | 3+ |

**Why a missing row matters.** The switch-over check (architecture.md:261-264) compares figures for your plan and
12 test plans, and checks that every V7 step has a screen. It does not ask whether each of today's functions has a
home. The 12 test plans use 4 of the 9 strategies (tests/fixtures/plans/build.mjs). None of them uses the emergency
reserve or basic-rate band fill. Your own plan has not been exported yet (v7-plan-of-plans.md:167). Anything lost
at the switch sends experienced people to the "previous version" link, and the old app stays their real home.

---

## 5. Recommendations: every function kept, with V7's better experience

Two proposals came out of the review:

- **A rail laid over today's tabs now.** I do not recommend it. Today's script may only shrink
  (tests/v7/shellRatchet.test.js:18), and the rail would be thrown away at 7.0.
- **Put the plan at the centre: V7 opens a saved plan before D is built.** This is the critic's alternative, and I
  recommend it.

The reason for the second: V7's missing pieces all need V7 to read a plan. These are life stages, the "Your plan"
rail, lock-while-saving, the saver's pot record, and D without a hand-over. D as designed adds a second hand-over
(answer-D.md 9.1: a "Check it from today" button, a reading passed through the browser tab, a third seed format).
That hand-over code would be thrown away once V7 can read a plan.

In order:

| # | What | Cost (rough) | What it changes in the plan of plans |
|---|---|---|---|
| 1 | **Safety fixes in today's app.** Move the lock check into the save functions, so nothing writes a locked plan's settings: the Budget buttons and the optimiser included. Allow only the named bookkeeping writes (the plan-start pin, StressRepository.js:147-156; the stale-draft dismissal). Add Stress settings to the locked-plan rule (architecture.md 2.6). An unlocked saver is asked before a Decision month locks the plan. The banner follows the life stage and treats a V7 plan's budget as a guide. Transition goes into the phone menu. Correct the tour's lock wording | 1-2 days; one noted 6.20.x release | None: these are fixes, allowed in the frozen app |
| 2 | **Make the saver's reading trustworthy.** Set the recorded pot in the path's prices, as 6.20.1 did for the retired, display only, with no saved data changed. "Refresh" restarts the clock. The arrival check uses the same measure. For new locks only: count the ISA and its payments, and draw the path from V7's saving-years engine with its 1-in-10 line. Old locked documents keep their path | 3-5 days; the second part needs a new plan-document version | Adds a "now" item; uses step 4's engine |
| 3 | **The coverage list, with a test.** Every saved setting and every function in section 4 gets a V7 home, or is marked "retired, with a release note". Add test plans for the five untested strategies, the emergency reserve and band fill. Make it a switch-over gate (architecture.md 3.9) | 2-3 days | Writes the overdue requirements baseline; strengthens the cutover rule |
| 4 | **V7 opens a saved plan, read-only, with a "Your plan" rail for every life stage.** Stages are worked out by today's `deriveStage`, in V7's own words. Stations follow the design (rail-screens-language.md 1.5-1.6), plus a saver's station: "This month's pot". Each station shows the plan's own figures, and "Change this" opens today's tool on the right tab (the existing `pt_open_tab` hand-off, index.html:4663-4664). That needs no edit to today's app | 1-2 weeks | New step 6, before D. Relaxes the "no storage" rule for one file, as already foreseen (architecture.md:169) |
| 5 | **Lock from V7.** A and B (and later D) end with "Keep" and then "Lock this plan?", which opens today's lock on the new plan. The front door and B tell savers it exists | 2-3 days after 4 | Lock moves into A and B, not only E |
| 6 | **Design before building:** E's answer contract, "Holdings and the move" (answering "must I use Transition?"), and the switch-over plan. First, your decision on whether all nine strategies answer in V7's words (section 6, question 2) | About a week of design, plus your decisions | Overdue sub-plans written before D |
| 7 | **D**, reading the plan directly | As designed, minus the hand-over | Step 6 becomes step 7 |
| 8 | **E built one section at a time** (about you, pots and income, spending, strategy and mix, the test against history, compare, lock and the document). Each section writes the same saved settings as today, so there is no new data model. The "no home" rows land here (bond tent, reserve, band fill, ISA policy, optimiser, schedule tables, stale-draft offer, the budget's split, ages and spreadsheet), or are retired with a note | Large; it is the planner | Step 7, now with a checklist |
| 9 | **The switch to 7.0.** Plan menu, What's new and account controls in V7's shell. Survivor and care checks get a station. **Option:** ship with Month by month still on today's screen, reached from the rail, and rebuild it after (section 6, question 3) | Medium | Step 8; the option changes the cutover rule |
| 10 | **After 7.0:** F, plus **property and equity release added to the plan** (the brief's "build first" gap), the annuity comparison and the trust pages. The page title ("Pension Planner v6") can be fixed any time as a fix | — | Step 9, with one item added |

**Smaller things to carry through E:**
- Ask ages in one place.
- Ask for a final-salary pension by age, not by plan year.
- Take spending after tax everywhere.
- Offer "I've stopped; my plan's income starts next April" as a plain choice.
- Keep the full budget walk-through reachable from every spend step.
- Use one bar everywhere (9 in 10).

**What this costs overall.** D starts about two weeks later. In return, D's hand-over and seed version 3 are never
written, life stages and lock-while-saving reach V7, and the switch has a checklist. I expect the date of 7.0 to
stay about where it was or come earlier, but that is a judgement, not a measurement.

---

## 6. Decisions waiting for you, in plain words

Each one is a question you can answer with a word or two. My recommendation follows each one.

**New from this audit**

1. **Should V7 open saved plans before we build D?** This means letting V7 show your saved plan with a rail for
   your stage, editing still done in today's tabs, instead of building D next. *Recommend: yes* (section 5,
   items 4-7).
2. **Should all nine strategies answer in V7's words?** Today the Strategies page ranks them by a score, "paid in
   full", coverage and the worst 12 months. V7's answers say "lasts in 9 futures out of 10" and give the worst 1 in
   10. If all nine speak V7's language, every question gets one kind of verdict. If not, the old and new verdicts
   sit side by side, and D's "what if D and the locked plan disagree?" stays a live problem. *Recommend: yes.*
3. **Can 7.0 ship with Month by month still on today's screen?** The person would reach it from the new rail, and
   it would be rebuilt afterwards. Today's switch-over rule says you must first record a real month in V7
   (architecture.md:261-264), which puts the riskiest rebuild on the critical path. *Recommend: yes.*
4. **One bar for "on course": 9 in 10 everywhere?** Today's "Am I on track?" uses 85% and the age sweep 90%.
   Changing them changes words people see, so it ships as a noted release. *Recommend: yes.*
5. **Do V7's answers count against the 3 free hours?** Today they do not: the meter starts only when an answer is
   saved without an account (NewPlanFromSeed.js:100-106). Nobody recorded that as a decision
   (rail-screens-language.md, open question 10). *Recommend: keep it so, and record it.*

**The 2028 question, explained.** From 6 April 2028 the earliest age you can take money from a pension rises from 55
to 57. Someone who is 55 or 56 on that day may keep drawing from money already moved into drawdown. But until they
are 57 they cannot start anything new: no tax-free cash, no more money moved into drawdown, no annuity
(HMRC guidance, not yet law; couples-different-years.md §12). V7 already shows a warning: "Move into drawdown what
you will need before 57 by 5 April 2028". But it shows only for **couples who stop work in different years**. A
single person, or a couple stopping together, who is 55 or 56 then sees nothing, although the rule hits them too.

6. **Should the 2028 warning show for everyone who is 55 or 56 on 6 April 2028?** It would change words people
   already see, so it would ship as its own noted release. *Recommend: yes, everyone.*

**Question D's four (answer-D.md, "Questions for the owner")**

7. **How should ISAs and savings grow?** Today they grow a fixed 3% a year, and for a retired person with large
   savings that one figure can turn "Yes" into "No". *Recommend:* one choice under the savings box, "Mostly cash"
   (the default, following prices less 1%) or "Invested like my pension".
8. **Can someone say they will spend a different amount from a later age?** Example: "from 80, less". Without it D
   tests one level amount for life. *Recommend: yes, one optional later amount.*
9. **When D's quick test and a locked plan disagree, what does D say?** D takes the same amount every month; a
   locked plan may cut in bad years or pay from a ladder. *Recommend:* D gives its own verdict, plus one line with
   the plan's figure and why they differ, and never suggests unlocking.
10. **Does D include "What if shares fell by a fifth tomorrow?"** It is the worried retired person's question.
    *Recommend: yes, as an optional step.*

**Left over from "Save this as a plan"**

11. **On a plan made from a V7 answer, does the Budget page keep "Use as the start of my income shape"?** It is the
    one button that turns the budget into the target, which goes against "the budget is a guide"
    (save-as-plan.md:465). *Recommend:* keep it, renamed to say what it does ("Use my budget's total as my
    spending"), and make it obey the lock (section 5, item 1).

---

## Limits of this audit

Nothing was run in a browser. The problems in sections 1 and 3 that are not marked "fixed" come from reading the
code, and each was checked against the lines cited. "Fixed" means what research/qa-audit-7-sep-2026.md and the
August persona notes record. No usage figures exist, so "who uses it" is by life stage, not by count.
