# Parity ledger: everything today's app does, and where it is in V7

Generated from `tests/v7/parity/ledger.json` by `node tests/v7/parity/write-md.mjs`. Do not edit this page by hand: change
the ledger and run the script. `tests/v7/parity/ledger.test.js` fails when a key today's app saves has no row,
when a row says built but names no file, when a row is retired without a reason, and when this page is out of date.

Checked against 6.20.2 on 2026-10-02.

**The owner's rule (2 Oct 2026):** "We NEED to have the same or better optionally than V6. We MUST offer as many steps and tapers as V6! ... In general - optional it must be at least v6. We must have Gogo, goslow and nogo years."

One row for every thing a person can see, set or press in today's app, and for every key it saves. The rows started from section 4 of the square-one audit (research/v7/square-one-audit.md) and were completed from the code: the test reads every key today's app saves straight from the code and the twelve test plans, so a new key fails the test until it has a row here.

**Built** means the /v7/ preview offers it, named by file. **Building now** marks work under way (none at present: the spending shape's steps and tapers are built, and its other parts are designed). **Designed** names the V7 document and section. **Planned** names the step that delivers it; "no V7 design yet" marks the ones no V7 document gives a place, which by the owner's rule stay unless the owner retires them. **Retired** gives the release-note reason; a retired option waits for the owner.

Where only part of a thing is in V7, the row is split (the part V7 has is built, the rest planned) or its note says what is missing. Line numbers are today's working copy (6.20.2) and will drift; the names beside them are the lasting reference. The spending shape's rows were checked in a browser on 2 Oct 2026, at 390 and 1280 px, beside today's planner's editor (guest only); the other rows' V7 files were read, not exercised.

## The count

| | Rows | Things a person sees or sets | Saved settings | Records | Machinery |
|---|---|---|---|---|---|
| Built | 53 | 37 | 15 | 0 | 1 |
| Building now | 0 | 0 | 0 | 0 | 0 |
| Designed | 45 | 43 | 0 | 2 | 0 |
| Planned | 64 | 52 | 2 | 2 | 8 |
| Retired | 10 | 3 | 0 | 0 | 7 |
| **All** | 172 | 135 | 17 | 4 | 16 |

Planned with no V7 design yet: **43** rows. Retired, waiting for the owner: **3**.

## The steps that deliver them

| Step | What | Rows |
|---|---|---|
| `done` | Built in the /v7/ preview (plan of plans steps 3-5; 6.18.0-6.20.0) | 53 |
| `now-spending-shape` | V7's spending shape, with every step and taper today's planner has (built in the /v7/ preview, 2 Oct 2026) (owner, 2 Oct 2026) | 0 |
| `shape-next` | The spending shape's parts not built yet: one-off costs by age, lump sums and turning one into income, the layers, the budget's total and the floor note while the steps are set, the markers, and the motion (owner, 2 Oct 2026; the review of the built shape, 2 Oct 2026; spending-shape.md §15-§17) | 8 |
| `s1-safety` | Safety fixes in today's app (square-one audit §5 item 1; 6.20.x) | 1 |
| `s2-saver-reading` | The saver's reading made trustworthy (square-one audit §5 item 2) | 0 |
| `s4-open-plan` | V7 opens a saved plan, read-only, with a "Your plan" rail for every life stage (square-one audit §5 item 4) | 12 |
| `s5-lock` | Lock from V7 (square-one audit §5 item 5) | 2 |
| `s6-design` | Design before building: E's answer contract, "Holdings and the move", the switch-over plan (square-one audit §5 item 6) | 0 |
| `s7-d` | Question D, reading the plan directly (square-one audit §5 item 7) | 0 |
| `s8-e` | Question E built one section at a time: about you, pots and income, spending, strategy and mix, the test against history, compare, lock and the document (square-one audit §5 item 8; plan of plans step 7) | 64 |
| `s9-switch` | The switch to 7.0: plan menu, What's new and account controls in V7's shell; release notes for anything retired (square-one audit §5 item 9; plan of plans step 8) | 26 |
| `s10-after` | After 7.0: question F, property and equity release, the annuity comparison, trust pages (square-one audit §5 item 10; plan of plans step 9) | 1 |
| `v6-retired` | Already retired inside today's app: nothing for V7 to carry (today's code) | 5 |

## Ways in, and finding your way

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Landing page, welcome tour and set-up wizard** | Shows a new person what the app does, then asks name, single or couple, ages and retirement age, and where to start: work out my budget, can I afford to retire, this month's withdrawal, or I'm already drawing. | LandingPage.js, OnboardingPage.js, SetupWizard.js:226-270 | New people | **Built**: `src/v7/screens/FrontDoor.jsx`, `src/v7/rail/questions.js`. Replaced by the six questions in the person's own words. The wizard's "I'm already drawing" door is question D (step s7-d). | `done` | — |
| **Try it without an account** | Lets a visitor see answers before signing up. | "Just try it — no account" (index.html:5036-5071) | Visitors | **Built**: `src/v7/effects/draftStore.js`, `src/v7/screens/FrontDoor.jsx`. Better: V7 answers on the visitor's own figures with no account; what was typed stays in the tab. | `done` | — |
| **A ready-made example plan** | Opens a worked example plan (about £1m, already retired) to look around every tool before typing anything. | Guest example plan and the ?demo=1m link (index.html:5036-5084) | Visitors | **Planned** (no V7 design yet): V7's answers on your own figures are the new way in; an example to look around has no V7 home yet. | `s9-switch` | — |
| **Guest mode: three active hours, reminders, then hand-over into an account** | A visitor can build a whole plan without an account for three active hours, is reminded as time runs out, and keeps the plan when they sign up. | GuestMeter.js; the guest store in FirestoreService.js; the guest banner (index.html) | Visitors | **Planned** (no V7 design yet): V7's answers do not count against the three hours; the audit recommends keeping that and recording it (square-one-audit.md §6 question 5). The meter itself needs a place in V7's shell. | `s9-switch` | `browser.pt_guest_minutes` `browser.pt_guest_nag_level` `browser.pt_guest_handoff` `browser.pt_guest_scenarios` |
| **Next-step banner** | One sentence at the top saying what to do next for this plan, with a button, dismissable per plan. | index.html:8143-8196; NextStep.js | Everyone | **Designed**: research/v7/rail-screens-language.md §1.6. The rail's "next" sentence, by question and by stage (also §1.4). | `s4-open-plan` | `browser.nextStepDismissed:` |
| **Life stages lead the way** | Works out from dates whether the plan is saving, approaching, committed while saving, retired in its run-up or running, and opens the right tool for it. | LifeStage.js deriveStage; tabs led by stage (index.html:8866-8870) | Everyone | **Designed**: research/v7/rail-screens-language.md §1.3. Stages in V7's words, and which questions each stage is offered (§1.5 table). Needs V7 to open a saved plan. | `s4-open-plan` | — |
| **Journey: when the plan moved between stages** | Keeps the dates on which the plan's stage changed (saving, approaching, committed, running). | scenario.journey (ScenarioRepository.saveActiveJourney) | Everyone | **Planned**: Carried as stored: V7 reads and writes the same saved plan (architecture.md §3.9: no change to the shape of saved plans at 7.0). | `s4-open-plan` | `plan.journey` |
| **Finding your way on a phone** | A bottom bar (Budget, Stress, Strategies, Decide) and a More menu for the other tabs. | index.html:2235-2240, 8250-8284; mobileMenu.js | Everyone | **Built**: `src/v7/components/Rail.jsx`. The rail is one line under the header that opens as a sheet. The locked plan's rail on a phone is designed (rail-screens-language.md §1.7). | `done` | — |
| **Open today's app on a given tab** | A one-off note in the tab that tells today's app which tab to open next (used when another page sends someone in). | sessionStorage pt_open_tab (index.html:4663-4664) | Everyone | **Planned**: "Change this" on V7's plan rail opens today's tool on the right tab through it (square-one-audit.md §5 item 4). | `s4-open-plan` | `browser.pt_open_tab` |

## Budget

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Spending lines** | Lists what you spend, line by line, each a month or a year, after tax, at today's prices; lines can be added, named and removed. | Budget tab: Essential and Lifestyle spending (index.html:3887-3953; BudgetModel.js) | Savers, retired | **Built**: `src/v7/components/Budget.jsx`, `src/v7/state/budget.js`, `src/answers/keep/budgetSheet.js`. The budget step of A and B; a plan made from an answer carries the lines into the plan's Budget. | `done` | `plan.budgetTool` `budget.lines` `budget.lines[].id` `budget.lines[].label` `budget.lines[].annual` `budget.lines[].period` |
| **Lines grouped by heading** | Groups lines under headings (home and bills, food, getting about, holidays, health, family and giving, other). | Walk-through groups (index.html BUD_WIZ_GROUPS); a heading carried from V7 | Savers, retired | **Built**: `src/answers/keep/budgetSheet.js`, `src/v7/components/Budget.jsx` | `done` | `budget.lines[].heading` `budget.lines[].wizGroup` |
| **Essential or lifestyle, and the essentials total** | Marks each line essential or lifestyle and shows the essentials as their own total. | Budget tab: two lists (index.html:3887-3906) | Savers, retired | **Built**: `src/v7/components/Budget.jsx`, `src/answers/keep/budgetSheet.js`. In V7 the essentials total is for the person's own judgement; it never becomes a floor (owner, 1 Oct 2026). | `done` | `budget.lines[].tier` `budget.oneOffs[].tier` |
| **Typical UK amounts as hints** | Shows beside each line what a typical household spends on it, at the chosen national level. | Budget tab and walk-through "use this" chips (BudgetModel.typicalMonthlyFor) | Savers, retired | **Built**: `src/v7/components/Budget.jsx`, `src/answers/keep/budgetSheet.js` | `done` | `budget.lines[].hint` `budget.oneOffs[].hint` |
| **Fill the blanks with typical amounts** | One press fills every empty line with the typical UK amount, to edit from there. | Budget tab: "Fill blanks with typical UK amounts" (index.html:3911) | Savers, retired | **Planned** (no V7 design yet): budget-step.md shows typical amounts as hints only, never filled in. By the rule of 2 Oct the one-press fill stays unless the owner retires it. | `s8-e` | — |
| **National guide levels** | Minimum, moderate and comfortable retirement spending for one or two people, to aim at or compare with. | Budget tab: "What are you aiming for?" (index.html:3888-3895) | Savers, retired | **Built**: `src/answers/shared/schemaParts.js`, `src/v7/components/Budget.jsx`. A guide beside the spending box, or the figure itself when picked. | `done` | `budget.plsaTier` |
| **Guided walk-through** | Takes you through the budget category by category, with a tip for each (care costs, holidays in the early years, car replacement). | Budget → Guided walk-through (index.html:12190-12600) | Savers, retired | **Planned** (no V7 design yet): V7's sheet covers the lines by heading on one page; the step-by-step walk-through with its tips has no V7 design. | `s8-e` | — |
| **Break a line into sub-items** | A small calculator under a line: list the parts (e.g. each insurance), and their total becomes the line. | Budget lines "break it down" (index.html:12488-12540) | Budget keepers | **Planned** (no V7 design yet) | `s8-e` | `budget.lines[].breakdown` `budget.lines[].breakdown[].label` `budget.lines[].breakdown[].amount` `budget.lines[].breakdown[].period` |
| **Sums in the amount boxes** | An amount box takes a sum such as =200*12 or 1,200 and works it out. | BudgetModel.evalAmountExpr | Budget keepers | **Planned** (no V7 design yet) | `s8-e` | — |
| **A line from or to an age** | A line can start or stop at an age, e.g. the mortgage ends at 63, or care costs from 85. | Budget line age band (index.html:11641-11670; BudgetModel.lineActiveAtAge) | Retired, approaching | **Planned**: D adds one later amount (answer-D.md §5.3); lines by age need E's spending section, alongside the spending shape. | `s8-e` | `budget.lines[].fromAge` `budget.lines[].toAge` |
| **One-off and every-few-years costs** | Lists costs that come at an age or every few years (a car every 8 years, a roof). | Budget: One-off & periodic costs (index.html:3940-3946) | Savers, retired | **Built**: `src/v7/components/Budget.jsx`, `src/answers/keep/budgetSheet.js`. Shown as a guide beside the figure, not added to it (budget-step.md). | `done` | `budget.oneOffs` `budget.oneOffs[].id` `budget.oneOffs[].label` `budget.oneOffs[].amount` `budget.oneOffs[].atAge` `budget.oneOffs[].everyYears` |
| **Horizon: age today, retirement age, plan to age** | The three ages the budget is worked over; whether you have retired; when the age was given. | Budget: Horizon (index.html:3842-3856) | Everyone | **Built**: `src/answers/shared/schemaParts.js`, `src/answers/a/schema.js`, `src/answers/b/schema.js`. V7 asks the ages once, in each question. | `done` | `budget.currentAge` `budget.retirementAge` `budget.endAge` `budget.retired` `budget.agesSetByUser` `budget.currentAgeAsOf` |
| **Partner's age, retirement age, retired or not** | The partner's ages, kept on the budget for a couple. | Set-up wizard and Household → Create their plan (index.html:4900-4926, 10877-10887) | Couples | **Built**: `src/answers/shared/schemaParts.js`. V7 asks the partner's age and stop on the first screen (partnerStopFields). | `done` | `budget.partnerAge` `budget.partnerRetirementAge` `budget.partnerRetired` |
| **Who pays: me, partner or shared, and my share** | For a couple, each line and one-off is paid by me, my partner or shared, with my share as a percentage (budget-wide or per line). | Budget: Sharing with a partner (index.html:3859-3883) | Couples | **Planned** (no V7 design yet): V7's budget is the household's (budget-step.md). | `s8-e` | `budget.sharedWithPartner` `budget.mySharePct` `budget.lines[].paidBy` `budget.lines[].mySharePct` `budget.oneOffs[].paidBy` `budget.oneOffs[].mySharePct` |
| **Who pays, changing over time** | My share of shared costs can change at an age, e.g. 70% until her pension starts at 63, then 50/50. | Budget: "Change who pays over time" (index.html:3876-3880; BudgetModel.budgetSharePctAtAge) | Couples | **Planned** (no V7 design yet) | `s8-e` | `budget.splitPhases` `budget.splitPhases[].fromAge` `budget.splitPhases[].mySharePct` |
| **Headroom on top of the budget** | Adds a monthly margin on top of the budget's total when it becomes the plan's target. | Budget: Your spending need (index.html:12167-12170) | Savers, retired | **Retired**: The spending figure is now always your own, with the budget as a guide beside it (owner, 1 Oct 2026), so there is no budget total to add a margin to: type the figure with the margin you want. (Owner: to confirm (follows from the rule of 1 Oct 2026 that the budget is a guide; budget-step.md)) | `s9-switch` | `budget.targetHeadroomMonthly` |
| **Use the budget's total as the spending figure** | Copies the budget's total into the plan's spending figure. | Budget: "Use as the start of my income shape" (index.html:12172-12200; BudgetToPlan.js) | Everyone | **Built**: `src/v7/state/budget.js`, `src/v7/state/reduce.js`, `src/v7/components/Budget.jsx`. Changed on purpose: one tap copies the total into the box and the person can change it; nothing else flows from the budget (owner, 1 Oct 2026). Today's button also writes the essentials into Floor & Flex. | `done` | — |
| **Export and import the budget as a spreadsheet** | Downloads the whole budget as a CSV that opens in Google Sheets or Excel, and reads an edited one back, with one undo. | Budget: Export CSV / Import CSV (index.html:3912-3913; BudgetModel.budgetToCsv, parseBudgetCsv) | Budget keepers | **Planned** (no V7 design yet) | `s8-e` | — |
| **Did you miss anything?** | Suggests common costs not yet in the budget, one press to add each. | Budget: "Did you miss anything?" (BudgetModel.missingSuggestions) | Savers, retired | **Planned** (no V7 design yet) | `s8-e` | — |
| **A nudge when an amount looks wrong** | Flags an amount that is far below or far above what households typically spend on that line (a nudge, never a block). | Budget lines and walk-through (BudgetModel.typicalSanityFlag) | Savers, retired | **Planned** (no V7 design yet) | `s8-e` | — |
| **Reset, duplicate a line, undo a removal** | Start the budget again (ages kept), duplicate a line or one-off, and undo a line removed by mistake. | Budget (index.html:12024-12080) | Budget keepers | **Planned** (no V7 design yet) | `s8-e` | — |

## Spending shape: income steps and tapers

The owner, 2 Oct 2026: "We MUST offer as many steps and tapers as V6! … We must have Gogo, goslow and nogo years." Every option of today's "Your income shape", and the dated extra spends drawn on it, is a row of its own. The steps, the three tapers and go-go, go-slow and no-go are built in the preview; the parts that are not are rows of their own, each designed in spending-shape.md §15-§17 and listed under "The spending shape: not yet in V7" below. The test holds every row built or designed, none retired, and none waiting on a thing with no V7 design.

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Steps by age: "from age X take £Y a year"** | The spending shape: each step is the total income wanted from an age on (State Pension, other pensions and the pot together), as many steps as wanted. One step is level for life. | Stress tester → Settings → Your income shape (index.html:3198-3215, 9118-9162; IncomeSchedule.js) | Approaching, retired, savers planning | **Built**: `src/answers/shared/shape.js`, `src/answers/shared/schemaParts.js`, `src/answers/shared/validate.js`, `src/v7/components/StepsField.jsx`, `src/v7/screens/a/SpendScreen.jsx`, `src/v7/screens/c/NumbersScreen.jsx`, `src/answers/shared/toEngine.js`. A and B: on the spend step, under the figure, "Does what you spend change as you get older?" → "Change it with age": any number of steps by age (up to one a year of the plan), each a month after tax. C: the same block under "Add more detail", each step a share of what you start on. Each year's figure is today's own IncomeSchedule.amountAtAge (imported). A couple's ages are yours, with your partner's beside each step. | `done` | `stress.incomeShape` `stress.incomeSteps` `decision.incomeShape` `decision.incomeSteps` `incomeSteps[].fromAge` `incomeSteps[].amount` |
| **Add a step, remove a step** | "+ Add a step" adds one ten years after the last and £10,000 lower; any step but the first can be removed. No limit on how many. | window.addIncomeStep / rmIncomeStep (index.html:9156-9162) | Approaching, retired | **Built**: `src/v7/components/StepsField.jsx`, `src/v7/state/shapeDraft.js`, `src/v7/state/reduce.js`. "+ Add a step" adds one 10 years after the last and 10% lower (today: £10,000 a year lower), and puts the keyboard in its age box; "Remove the step from 75" on every step after the first. No limit but one a year of the plan. | `done` | — |
| **A taper within a step: falling by a real % a year** | Each step can fall each year by 0% to 5% in today's money, in quarter-point steps, compounding (£60,000 at 1% pays £59,400 the next year). | The slider on each step (index.html:9133-9136; IncomeSchedule.amountAtAge) | Approaching, retired | **Built**: `src/answers/shared/shape.js`, `src/v7/components/StepsField.jsx`, `src/answers/shared/validate.js`. Every step, the first included, "falls by …% a year": 0.25% to 10% in quarter points (today's slider stops at 5%), compounding at today's prices, by today's own amountAtAge. | `done` | `incomeSteps[].decline` |
| **A taper to the next step: glide evenly** | Instead of a cliff, a step can walk down in a straight line to the next step's amount, arriving as that step starts. | "glide evenly to the next step" on each step (index.html:9137; IncomeSchedule.amountAtAge) | Approaching, retired | **Built**: `src/answers/shared/shape.js`, `src/v7/components/StepsField.jsx`, `src/answers/shared/validate.js`. "moves evenly to the next step" on every step but the last: a straight line in pounds arriving as the next step starts, by today's own amountAtAge. | `done` | `incomeSteps[].glideToNext` |
| **Go-go, go-slow and no-go years** | Explains the three phases of retirement spending, go-go (travel, projects, while fit), go-slow (from the mid-70s, typically drifting down 1-2% a year) and no-go (the basics, and care if it comes), and colours the years of the picture by phase (to 75, 75 to 85, 85 on). | Your income shape: the words above the steps and the bar colours (index.html:3199-3200; incomeShapeGraphic.js) | Approaching, retired | **Built**: `src/v7/copy/shape.js`, `src/v7/components/ShapeChart.jsx`, `src/answers/shared/shape.js`. The words above the steps name go-go (travel, projects), go-slow (from the mid-70s) and no-go (less again, though care can cost more); the picture draws the three bands at 75 and 85 (a couple: of the younger of you). | `done` | — |
| **Suggest go-slow and no-go steps** | One press adds suggested later steps from the first: 15% lower from 75 and 30% lower from 85, never below the budget's essentials, rounded to £500. Typical, not yours: edit freely. | "Suggest go-slow & no-go steps" (index.html:8412-8419; incomeShapeGraphic.suggestSteps) | Approaching, retired | **Built**: `src/answers/shared/shape.js`, `src/v7/state/reduce.js`, `src/v7/components/StepsField.jsx`. "Suggest go-go, go-slow and no-go years": today's suggestSteps in V7's units: 15% less from 75 and 30% less from 85, never below the budget's essentials, to the nearest £10 a month (today: £500 a year); for a couple, from when the younger of you is 75 and 85. Says what it filled in, and has Undo (today's has none). The preset "Slowly less" is today's old "declining with age" (smileToSteps). | `done` | — |
| **Start from my budget** | Sets the first step from the budget's total with tax added on. | "Start from my budget" (index.html:8394-8404) | Everyone | **Built**: `src/v7/components/Budget.jsx`, `src/v7/state/reduce.js`, `src/v7/components/StepsField.jsx`. "Use £X a month" copies the budget's total into the figure (the budget stays a guide: owner, 1 Oct 2026); later steps are kept, as today, and "Move the later steps in proportion" is offered. | `done` | — |
| **Start from a number** | Sets the first step from a figure typed in. | "or a number: … Use it" (index.html:8405-8411) | Everyone | **Built**: `src/v7/screens/a/SpendScreen.jsx`, `src/answers/shared/schemaParts.js`, `src/v7/components/StepsField.jsx`. The figure box on the spend step is the first amount; "The same every year" clears the steps (today's "or a number" replaces them all). | `done` | — |
| **The staircase picture** | Draws the shape as a bar for each year of age, coloured by go-go, go-slow and no-go, with a line along the tops. | incomeStaircaseSvg (src/ui/incomeShapeGraphic.js; index.html:8322-8350) | Everyone | **Built**: `src/v7/components/ShapeChart.jsx`, `src/v7/state/select.js`. A bar a year from the start to the end of the plan, at 390 px with no sideways scroll; tap or point at a bar to read that year; "Show each year" opens a table. The motion as the steps change is its own row (income.staircase-motion), not built. | `done` | — |
| **The picture moves from the old shape to the new one** | When a step changes, the bars ease from their old heights to the new ones (about half a second) instead of jumping. | animateIncomeShape (src/ui/incomeShapeGraphic.js; called from renderIncomeShapePreview, index.html:8322-8350) | Everyone | **Designed**: research/v7/spending-shape.md §15.4. Not built: V7's picture jumps to the new shape. Designed: each bar scales from its old height to its new one, and not at all for anyone who has asked their device for less motion. | `shape-next` | — |
| **State Pension and other income as layers** | Inside each year's bar: the State Pension from its date, other income and a final-salary pension, income streams for their years, and on top what the pot must supply. | incomeStaircaseSvg sp / other / events (index.html:8327-8346) | Everyone | **Built**: `src/v7/components/ShapeChart.jsx`, `src/v7/state/select.js`, `src/answers/shared/shapeAnswer.js`. On the answer's picture (A, B and C): each year's bar has the State Pension and other pensions (and pay or part-time work) after tax drawn lighter, and what the pension and savings pay darker, from the answer's own year-by-year rows. The same layers while the steps are set (income.layers-editing), the budget's total (income.budget-mark) and the markers for lump sums and one-off spends (income.markers) are rows of their own, not built. | `done` | — |
| **The layers while you set the steps** | As the steps are set, before any test is run, the picture already shows the State Pension and other income inside each bar, and what the pot must supply on top. | renderIncomeShapePreview → incomeStaircaseSvg sp / other (index.html:8322-8350) | Everyone | **Designed**: research/v7/spending-shape.md §15.1. Not built: the spend step's picture shows the shape alone ("Each bar is one year of your life"); the layers come with the answer. Designed: the spend step reads the year-by-year income you get anyway from the plan the inputs already make (yearsOf, no engine run), once a stop age is known. | `shape-next` | — |
| **The budget's total marked on the picture** | A short line at the left of the picture marks the budget's total (with tax added), so the first step can be read against it. | incomeStaircaseSvg budgetGross (src/ui/incomeShapeGraphic.js) | Everyone | **Designed**: research/v7/spending-shape.md §15.1. Not built as a mark: V7 says it in words beside each later step ("85% of the start, 71% of your budget (a guide)"). Designed: a short dashed mark at the budget's total a month, named in the key, a guide only. | `shape-next` | — |
| **Lump sums and one-off spends marked at their ages** | A lump sum arriving (▲) and a one-off spend (▼, with its years) are drawn on the picture at their ages, with their amounts. | incomeStaircaseSvg events (src/ui/incomeShapeGraphic.js:74-80) | Approaching, retired | **Designed**: research/v7/spending-shape.md §15.3 (waits for: `inc.extra-spends`, `inc.lump-sums`). Waits for one-off costs (§16) and lump sums (§17), which V7 does not have yet. Designed: a mark under the bar of that year, its amount in the year's line and in the table. | `shape-next` | — |
| **Below the essentials turns orange** | The budget's essentials are a line on the picture; a step below them turns orange and a note says the floor strategies will not buy less than the bills. | incomeStaircaseSvg essentials; incomeShapeNote (index.html:8380-8385) | Everyone | **Built**: `src/v7/components/ShapeChart.jsx`, `src/v7/state/select.js`, `src/v7/components/StepsField.jsx`, `src/v7/copy/shape.js`. With a budget: the essentials are a dashed line, a year below them is marked in the warning colour, and a note says so in words ("That is allowed: it is your figure"). A guide only: never a floor (owner, 1 Oct 2026). | `done` | — |
| **Never below guaranteed income** | A year whose step would fall below the income that arrives anyway (State Pension, other pensions) is held there, with a note from which age. | guaranteedAtYear; incomeShapeNote (index.html:8340-8383) | Everyone | **Built**: `src/answers/shared/toEngine.js`, `src/answers/shared/shapeAnswer.js`. The engine takes nothing from the pots in a year whose State Pension and other pensions (after tax) pay more than the step; the answer's note "shape-below-income" says from which age, and the picture shows that year's bar as the income itself. Today's editor also says it while the steps are set: that is its own row (income.below-income-live), not built. | `done` | — |
| **"Below the income you get anyway", said while setting the steps** | While the steps are set, an orange note says from which age a step is below the income that arrives anyway (State Pension, other pensions), which then pays instead. | incomeShapeNote (index.html:8375) | Everyone | **Designed**: research/v7/spending-shape.md §15.2. Not built: V7 says it on the answer only. Designed: the same words on the spend step, from the same year-by-year income as the layers (§15.1). | `shape-next` | — |
| **Each later step as a share of the budget** | Beside each later step: its amount as a % of the budget (or of "your budget (a guide)" on a plan made from a V7 answer). | renderIncomeSteps (index.html:9127-9129) | Everyone | **Built**: `src/v7/state/select.js`, `src/v7/components/StepsField.jsx`, `src/v7/copy/shape.js`. Beside each later step: "85% of the start", and with a budget "85% of the start, 71% of your budget (a guide)", as today's "— 85% of today's budget". | `done` | — |
| **The first step's take-home a month** | Says what the first step leaves a month after tax at today's bands. | incomeShapeNote (index.html:8383-8385) | Everyone | **Built**: `src/v7/screens/a/SpendScreen.jsx`, `src/v7/copy/shape.js`. Not needed as a separate line: every V7 figure is typed and shown after tax, a month (today's line turns its before-tax step into take-home). The answer's "what it is made of" shows the tax. | `done` | — |
| **Turn a lump sum into income** | For each lump sum: what it could add a year if spread over the years left, and one press to add that to the steps from its age (the lump stays as the money that pays for it). | incomeShapeLumps; window.spendLumpSum (index.html:8352-8392) | Approaching, retired | **Designed**: research/v7/spending-shape.md §17.3 (waits for: `inc.lump-sums`). Waits for lump sums (inc.lump-sums, designed in spending-shape.md §17). Then "Turn it into income" gives what the lump sum could add a month over the years left, after tax, and one tap raises the step in force at its age and every later one by that (raiseFrom(age, a month): today's "Add £X/yr to my income from 67", spending-shape.md §2 T16). The test of it is marked to-do (tests/v7/screens/shapeParity.test.js T16). | `shape-next` | — |
| **Extra spends in a given year** | A car, a roof, a wedding: an amount drawn on top of the income shape in a plan year (or several), taxed like income, which every strategy must fund. | Income streams & lump sums: + Extra spend (index.html:10636-10637) | Approaching, retired | **Designed**: research/v7/spending-shape.md §16. Not built. Designed inside the spending shape: "Any one-off costs?" under the steps (A, B, D; C under "Add more detail"): an amount after tax at an age, once or every year for a number of years, going up with prices or a fixed sum, with a name. Each year's need is the shape's figure plus that year's costs; kept plans get today's extraWithdrawals, exact to the year. The budget's one-off costs stay a guide: one tap copies them. | `shape-next` | `stress.extraWithdrawals` `extraWithdrawals[].label` `extraWithdrawals[].amount` `extraWithdrawals[].year` `extraWithdrawals[].years` `extraWithdrawals[].indexation` |
| **The year-by-year figure every tool reads** | The shape compiled to one figure a year from the plan's start age, read by every strategy, the stress tests and the Decision tool; the first step is the Decision tool's target. | compiledTargetSchedule on save (index.html:11294-11333; IncomeSchedule.compileSteps) | Everyone | **Built**: `src/answers/shared/toEngine.js`, `src/answers/shared/shape.js`, `src/answers/keep/planSeed.js`, `src/services/PlanSeed.js`. Every V7 answer (C, A, B) works out each year's figure from the shape and tests it year by year. "Save this as a plan" writes seed version 3 for a shaped answer, and today's planner turns it into its own income steps (compressSteps) that give the answer's after-tax figure in every year, to the pound. | `done` | `stress.targetSchedule` `decision.targetSchedule` `stress.baseSalary` `decision.baseSalary` `stress.shapeAgeNow` `decision.shapeAgeNow` |
| **Amounts before tax, in today's money** | Every step is £ a year before tax at today's prices; tax comes out of it. | Your income shape (index.html:9139) | Everyone | **Built**: `src/services/PlanSeed.js`, `src/answers/keep/planSeed.js`. V7 asks after tax, a month (square-one-audit.md §5); the kept plan carries today's before-tax, a-year steps, each year grossed up by today's own grossUpAnnual, so both readings hold. | `done` | — |
| **What you want to spend, take-home, a month or a year** | The spending need typed as take-home, a month or a year, with the gross worked out and a chip to use the budget's figure. | Decision tool → Settings → Spending need (index.html:2553-2575); the hidden Stress box | Everyone | **Built**: `src/answers/shared/schemaParts.js`, `src/v7/screens/a/SpendScreen.jsx`, `src/v7/screens/b/SpendScreen.jsx`. One figure a month after tax, or a national level. Today's box also takes the figure a year; V7 asks a month only. | `done` | — |

## Who, and when the plan starts

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Age today** | Your age now, dated, which with the State Pension date pins every plan year to a tax year and an age. | Stress → Settings → When your plan starts (index.html:3150-3166) | Everyone | **Built**: `src/answers/shared/schemaParts.js`. Asked in every question. | `done` | `stress.currentAge` `stress.currentAgeAsOf` |
| **Retired already, or retiring at an age** | "I have already retired" or "I will retire at age X". | Stress → Settings → When your plan starts (index.html:3153-3154) | Everyone | **Built**: `src/answers/shared/schemaParts.js`, `src/answers/a/schema.js`, `src/answers/b/schema.js`, `src/answers/c/schema.js`. A and B ask the stop age (or "I've already stopped"); C asks when the money starts. | `done` | `stress.retired` `stress.retireAge` |
| **Plan starts this tax year or next April** | Which tax year is the plan's year 0; months before it are bridge months, lived on cash. | Stress → Settings → "Plan starts" (index.html:3155; PlanTiming.js) | Retired, approaching | **Planned**: square-one-audit.md §5: offer "I've stopped; my plan's income starts next April" as a plain choice. | `s8-e` | `stress.firstTaxYear` `decision.firstTaxYear` `stress.legacyFirstTaxYear` |
| **Pots at retirement, projected** | For someone still working, projects the pots to the retirement age from today's pots and payments. | When your plan starts: the projection line (index.html:8953-8957) | Savers, approaching | **Built**: `src/answers/shared/saving.js`, `src/v7/components/Pots.jsx`. Better: the saving-years engine gives a middling and a bad case. | `done` | — |
| **Pots at retirement, typed in** | Overrides the projection with the pension and ISA you expect to have on the day, in today's money. | When your plan starts: "Or SIPP at retirement", "ISA at retirement" (index.html:3160-3161) | Approaching | **Planned** (no V7 design yet): A plan made from a V7 answer writes the middling pot here (PlanSeed.js); no V7 form lets the person type it. | `s8-e` | `stress.potAtRetirement` `potAtRetirement.sipp` `potAtRetirement.isa` `potAtRetirement.source` |
| **How long the plan runs** | The plan's length in years (the age it runs to). | Stress → Settings → Duration; Decision → Depletion Duration | Everyone | **Built**: `src/answers/shared/schemaParts.js`. Asked as the age to plan to (endAge, 75 to 105, 95 by default). | `done` | `stress.duration` `decision.duration` |
| **Suggest a plan length from longevity** | Suggests the length from age and sex: a 1-in-10 chance of living beyond (cautious), 1 in 4, or average. | Stress → Settings → "Suggest from longevity" (index.html:3311-3326; LongevityModel.js) | Everyone | **Planned** (no V7 design yet) | `s8-e` | — |
| **"Update this draft to today"** | A draft whose start year has passed is offered an update to today; "Leave it" is remembered. | Stale-draft banner (index.html:2954, 9020-9050) | Retired drafts | **Planned** (no V7 design yet) | `s8-e` | `stress.staleDraftDismissedFor` |

## Pots and the drawing mix

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Pension pot, split into shares, bonds and cash** | The pension total and how it splits into the three pots the plan draws from; their floors run down over the plan (the glidepath). | Stress and Decision → Settings → Your allocation (index.html:3329-3333) | Everyone | **Built**: `src/answers/shared/schemaParts.js`, `src/answers/shared/toEngine.js`. V7 asks the pension total; the split follows the risk level. | `done` | `stress.equityMin` `stress.bondMin` `stress.cashTarget` `decision.equityMin` `decision.bondMin` `decision.cashTarget` |
| **Risk level: cautious, balanced, adventurous** | Sets the mix of shares, bonds and cash, or switches to testing a list of funds. | Your allocation: Pick a risk level / Test on a list of funds (index.html:3303-3306, 3379-3393) | Everyone | **Built**: `src/answers/shared/schemaParts.js`, `src/answers/shared/toEngine.js`. V7 has a risk level while drawing and another while saving. | `done` | `stress.allocMode` `decision.allocMode` |
| **Test on a list of funds** | A list of funds, each tagged to a bucket and a sub-class (searched, typed or pasted from a platform), becomes the allocation the plan is tested on. Each strategy keeps its own list. | Your allocation → Test on a list of funds (index.html:3407-3430; PortfolioTagger.js, FundCatalogue.js) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "mix" step: a pot and a risk level; a fund list there is the intended retirement portfolio. | `s8-e` | `stress.taggedFunds` `decision.taggedFunds` `stress.subAsset` `decision.subAsset` `taggedFunds[].ticker` `taggedFunds[].value` `taggedFunds[].wrapper` `taggedFunds[].subClass` `taggedFunds[].ocf` `taggedFunds[].contribution` |
| **An example ETF portfolio for the risk level** | Shows an illustrative fund portfolio for the chosen level (not advice). | "See an example ETF portfolio for this level" (index.html:3398-3401; ModelPortfolios.js) | Approaching, retired | **Planned** (no V7 design yet) | `s8-e` | — |
| **Diversifiers sleeve: gold and trend/macro** | Carves a slice into assets that tend to hold up when shares fall, held flat and sold first in a downturn; the target rises with prices and runs down like the others. | Your allocation: Diversifiers sleeve (index.html:3394-3397) | Approaching, retired | **Planned** (no V7 design yet) | `s8-e` | `stress.diversifierStart` `decision.diversifierStart` |
| **Bond tent** | Shares rise over time: bond-heavy early, when the pot is largest and most exposed to an early crash, share-heavy later, centred on the risk level; a tagged plan sets its end mix. | Your allocation: Bond tent (index.html:3452-3462) | Approaching, retired | **Planned** (no V7 design yet) | `s8-e` | `stress.equityGlideEnabled` `decision.equityGlideEnabled` `stress.glideEndgame` `decision.glideEndgame` |
| **ISA (and savings) total** | The ISA held beside the pension, drawn as its own pot. | Your allocation: Total in your ISA (index.html:3335) | Everyone | **Built**: `src/answers/a/schema.js`, `src/answers/b/schema.js`, `src/answers/c/schema.js`. Asked as savings (ISAs and other savings). | `done` | `stress.isaBalance` `decision.isaBalance` |
| **How the ISA is used** | Tax-efficient (tops up income before higher-rate tax), make it last to the State Pension, or hold it (never drawn for income; it still rescues a plan whose pension runs out). | Your allocation: How the ISA is used (index.html:3337-3343) | Approaching, retired | **Planned** (no V7 design yet) | `s8-e` | `stress.isaDrawdownStrategy` `decision.isaDrawdownStrategy` |
| **How the ISA and savings grow, and the ISA's floor** | One choice per plan: "Mostly cash" (the default; like the pension's cash, last year's rise in prices less 1%, never below nothing) or "Invested like my pension" (the pension's mix of shares, bonds and cash, in the same futures). A plan locked before the choice keeps a fixed 3% a year (isaReturn) until it is unlocked. Also the floor the ISA is drawn down towards (isaMin). | Stress tester → Settings → How your ISA and savings grow (index.html #ssIsaGrowthGroup; src/ui/isaGrowthSetting.js, src/services/IsaGrowth.js); the floor in the settings defaults (constants.js ISA_DEFAULTS) | Everyone | **Built**: `src/services/IsaGrowth.js`, `src/answers/shared/schemaParts.js`, `src/answers/shared/saving.js`, `src/answers/shared/toEngine.js`, `src/answers/shared/savingsGrowth.js`. One choice under the savings box in C, A and B ("Mostly cash" or "Invested like my pension"), carried between them and into a plan made from the answer; today's planner has the same choice in Stress tester → Settings from 6.22.0 (schema version 3 writes "Mostly cash" into every unlocked plan). The floor (isaMin) is saved but read by no engine in either app: both draw the ISA down to nothing. | `done` | `stress.isaGrowth` `stress.isaReturn` `stress.isaMin` `decision.isaReturn` `decision.isaMin` |
| **A taxable account (GIA)** | Money held outside a pension or ISA: how much, what it holds (shares, gilts, bond funds, a mix, cash) and the tax band it is taxed at; it is drawn first and taxed each year. | Your allocation: Taxable investments today (index.html:3347-3376; TaxableSleeve.js) | Approaching, retired | **Planned** (no V7 design yet): answer-D.md §9.2 reads the ordinary account from a locked plan's holdings; no V7 form asks for it. | `s8-e` | `stress.taxableStart` `stress.taxableMix` `stress.giaTaxBand` `decision.taxableStart` `decision.taxableMix` `decision.giaTaxBand` |
| **Charges (funds and platform), % a year** | One charge a year taken off monthly from funds and cash, while saving and while drawing. | Stress → Settings → Charges (6.19.0; Charges.js) | Everyone | **Built**: `src/answers/shared/schemaParts.js`, `src/services/Charges.js`, `src/answers/shared/toEngine.js` | `done` | `stress.chargesPct` |

## State Pension, final salary, other income and lump sums

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **State Pension amount** | The State Pension from the forecast: full, a forecast amount, or none. | Stress and Decision → Settings → State Pension (index.html:3546-3561) | Everyone | **Built**: `src/answers/shared/schemaParts.js` | `done` | `stress.spWeeklyAmount` `decision.spWeeklyAmount` |
| **State Pension start date, typed from the forecast** | The exact date it starts, as on the forecast (also the birthday the plan reckons ages from). | State Pension: SP Start Date (index.html:3550) | Everyone | **Planned** (no V7 design yet): V7 works the date out from age (schemaParts.statePensionAgeOf) and does not ask it. | `s8-e` | `stress.spStartDate` `decision.spStartDate` |
| **Final-salary pension: amount and start** | A defined-benefit pension: how much a year, in today's money, and when it starts. | Other income: Defined-Benefit Pension, DB Starts as a plan year (index.html:3508-3534) | Everyone | **Built**: `src/answers/shared/schemaParts.js`, `src/answers/shared/household.js`. Better: V7 asks the start by age, not plan year, for each person. | `done` | `stress.dbAmount` `stress.dbStartYear` |
| **How a final-salary pension rises** | Rises with prices capped at 5%, with full prices, or not at all. | Other income: DB Increases (index.html:3528-3532) | Everyone | **Planned** (no V7 design yet): V7's household takes all three (household.js) but the forms always say prices capped at 5%. | `s8-e` | `stress.dbIndexation` |
| **Other income or pension** | Another taxable income a year from now, rising with prices capped at 4%. | Other income: Other Income/Pension (index.html:3512) | Everyone | **Planned** (no V7 design yet): D designs income you have bought (answer-D.md §5.2); a general other income has no V7 form. | `s8-e` | `stress.other` |
| **Part-time work for some years** | Earnings for a number of years after stopping. | Income streams (index.html:3537-3542) | Approaching | **Built**: `src/answers/a/schema.js`, `src/answers/a/answer.js`. A's "Would some part-time work help?"; D designs the same for the retired (answer-D.md §3.6). | `done` | — |
| **Income for some years** | Any taxable income between two plan years (rent that ends, part-time work, a small pension), with how it rises. | Stress → Settings → Income streams & lump sums (index.html:3535-3545, 10635-10641) | Approaching, retired | **Planned** (no V7 design yet): Only part-time work from the stop is asked in V7 (row above). | `s8-e` | `stress.extraIncomes` `extraIncomes[].label` `extraIncomes[].annual` `extraIncomes[].startYear` `extraIncomes[].endYear` `extraIncomes[].indexation` |
| **One-off lump sums** | Money arriving in a plan year (an inheritance, downsizing): where it can legally go (ISA allowance, pension up to earnings or the £10,000 limit, the rest taxable), what it is held in, and the Decision tool's advice in its year. | Income streams & lump sums: + One-off lump sum (index.html:10639-10660; TaxableSleeve.routeWindfall) | Approaching, retired | **Designed**: research/v7/spending-shape.md §17. Not built. Designed: "Money you expect to come in" on the pots step (A, B; C under "Add more detail"): an amount at an age, and what it is (cash, an inherited pension, an inherited ISA). Where it can go is today's own routeWindfall (the ISA allowance, the pension within its limit, the rest a taxable account); kept plans get today's windfalls. | `shape-next` | `stress.windfalls` `decision.windfalls` `windfalls[].label` `windfalls[].amount` `windfalls[].year` `windfalls[].wrapper` `windfalls[].mix` `windfalls[].toIsa` |

## Tax and the tax-free part

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Tax thresholds** | Personal allowance, basic-rate limit and higher-rate limit for year 0, which can be changed. | Stress → Settings → Tax thresholds (index.html:3476-3500) | Approaching, retired | **Planned** (no V7 design yet): V7 uses today's bands (toEngine.js BANDS) and they cannot be changed. | `s8-e` | `stress.pa` `stress.brl` `stress.hrl` |
| **Thresholds rise with prices, or stay frozen** | Whether the tax bands rise with inflation or stay where they are. | Tax thresholds: Tax Threshold Mode (index.html:3492-3497) | Approaching, retired | **Planned** (no V7 design yet) | `s8-e` | `stress.taxMode` |
| **The 25% tax-free part: in each withdrawal, or kept separate** | Take a quarter of every withdrawal tax-free (UFPLS), or count every withdrawal as taxable because the tax-free sum is taken or kept for something else. | How you'll take this pension (index.html:2982-2994) | Approaching, retired | **Built**: `src/answers/shared/schemaParts.js`, `src/answers/shared/toEngine.js`. V7 takes a quarter of each withdrawal tax-free unless you say it is already taken. | `done` | `stress.accessMethod` `decision.accessMethod` |
| **Tax-free part for some years, then the rest into the ISA** | Take the tax-free quarter for a number of years, then move the remaining 25% into the ISA before switching to drawdown. | How you'll take this pension: UFPLS for how many years (index.html:3002-3014) | Approaching, retired | **Planned** (no V7 design yet): F's "tax-free cash and which pot first" is the decision page (rail-screens-language.md §1.5); the plan's own setting needs E. | `s8-e` | `stress.ufplsYears` `stress.ufplsThenPcls` `decision.ufplsYears` `decision.ufplsThenPcls` |
| **Fill the basic-rate band and recycle into the ISA** | Draws extra pension up to the 20% band even when spending does not need it, and moves the net into the ISA (up to £20,000 a year). | How you'll take this pension: band fill (index.html:3016-3025) | Approaching, retired | **Planned** (no V7 design yet): No test plan uses it yet (square-one-audit.md §4). | `s8-e` | `stress.bandFillRecycle` `decision.bandFillRecycle` |
| **Bed-and-ISA £20,000 a year** | Moves £20,000 a year from the taxable account into the ISA whenever the allowance is unused. | Your allocation (index.html:3377-3380) | Approaching, retired | **Planned** (no V7 design yet) | `s8-e` | `stress.bedAndIsa` `decision.bedAndIsa` |
| **Relevant UK earnings** | Earnings this year, which set how much of a lump sum can go into the pension. | Your allocation: Relevant UK earnings (index.html:3365-3370) | Approaching | **Planned** (no V7 design yet) | `s8-e` | `stress.relevantEarnings` `decision.relevantEarnings` |

## Cuts in a slump, and the reserve

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Cuts in a slump** | After a set number of months below the glidepath, income is cut by a set share (half the cut for the first months, the whole cut if it lasts), the cash buffer is kept, and missed income is made up later. | Stress and Decision → Settings → Protection (index.html:3584-3611; ProtectionStrategy.js) | Approaching, retired | **Planned** (no V7 design yet): V7's answers run with cuts off (save-as-plan.md §C.3). | `s8-e` | `stress.consecutiveLimit` `stress.protectionMult` `stress.protectionEscalateMonths` `stress.recoveryBuffer` `stress.disableProtection` `decision.consecutiveLimit` `decision.protectionFactor` `decision.protectionEscalateMonths` `decision.recoveryBuffer` `decision.disableProtection` |
| **Emergency reserve ("Break Glass HODL")** | A reserve touched only when the plan would otherwise fail. | Stress → Settings → Break Glass HODL (index.html:3613-3630) | Approaching, retired | **Planned** (no V7 design yet): No test plan uses it yet (square-one-audit.md §4). | `s8-e` | `stress.hodlEnabled` `stress.hodlValue` |

## Strategies and their dials

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Pots & Valves** | One flexible portfolio in three pots; rules decide which pot pays each month, with floors that run down over the plan and cuts in a slump. | Stress → Settings → Income strategy; Strategies → Pots & Valves | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. V7's answers draw this way today, with the cuts off. | `s8-e` | `strategies.pots-and-valves` |
| **Buckets in order** | Cash pays first, then bonds, then shares; surplus refills from above when it is more than a set band over its path. Dials: the band, and the pension and ISA totals. | Income strategy: Buckets in order (index.html:3170-3175) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. | `s8-e` | `strategies.buckets-in-order` `strategyParams.buckets-in-order.bucketBand` `strategyParams.buckets-in-order.sippTotal` `strategyParams.buckets-in-order.isaTotal` |
| **Ladder & Ratchet** | Buys index-linked gilts for the first years of income and rides the rest in shares, selling only when shares are well above their path or on a calendar. Dials: years bought, the income bolted on, the trigger, the band, the pension and ISA totals. | Income strategy: Ladder & Ratchet (index.html:3218-3256) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. | `s8-e` | `strategies.ladder-and-ratchet` `strategyParams.ladder-and-ratchet.ladderYears` `strategyParams.ladder-and-ratchet.drawAnnual` `strategyParams.ladder-and-ratchet.triggerMode` `strategyParams.ladder-and-ratchet.bandThreshold` `strategyParams.ladder-and-ratchet.sippTotal` `strategyParams.ladder-and-ratchet.isaTotal` |
| **Bridge & engine** | Every year to the bridge age (usually the State Pension) bought now, cash first then one gilt a year; the rest rides in shares untouched, then pays by withdrawals. Dials: the bridge age, years in cash, the pension and ISA totals. | Income strategy: Bridge & engine; Your pot (index.html:3166-3169) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. | `s8-e` | `strategies.bridge-and-engine` `strategyParams.bridge-and-engine.bridgeAge` `strategyParams.bridge-and-engine.cashYears` `strategyParams.bridge-and-engine.sippTotal` `strategyParams.bridge-and-engine.isaTotal` |
| **Floor & Flex** | Buys the essentials as a floor to an age with gilts; the rest is a flex sleeve paying a set share each year; booms can extend or raise the floor. Dials: essentials, the floor's end age, the sleeve rate, the treats rule, the ratchet, the pension and ISA totals. | Income strategy: Floor & Flex (index.html:3258-3296) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. V7 never fills the essentials from the budget (owner, 1 Oct 2026). | `s8-e` | `strategies.floor-and-flex` `strategyParams.floor-and-flex.essentialsAnnual` `strategyParams.floor-and-flex.horizonAge` `strategyParams.floor-and-flex.sleeveRate` `strategyParams.floor-and-flex.treatsRule` `strategyParams.floor-and-flex.ratchet` `strategyParams.floor-and-flex.sippTotal` `strategyParams.floor-and-flex.isaTotal` |
| **Floor the schedule** | Buys the whole income shape, year by year, with index-linked gilts. Dials: the pension and ISA totals. | Income strategy: Floor the schedule | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. | `s8-e` | `strategies.floor-the-schedule` `strategyParams.floor-the-schedule.sippTotal` `strategyParams.floor-the-schedule.isaTotal` |
| **Floor to an age, then decide** | Buys the income shape to an age with gilts and leaves the decision about the years after it for later. After a rotation is carried out the plan moves here, keeping a record of the income it sold (the borrowed floor) and what it would cost today to buy back. Dials: the age, the borrowed floor, the pension and ISA totals. | Income strategy: Floor to an age; Your pot (index.html:3165) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. | `s8-e` | `strategies.floor-to-age` `strategyParams.floor-to-age.floorToAge` `strategyParams.floor-to-age.borrowedFloor` `strategyParams.floor-to-age.sippTotal` `strategyParams.floor-to-age.isaTotal` |
| **Full index-linked gilt ladder** | Every year of the income shape bought with index-linked gilts, with the first years from cash. Dials: years from cash, the pension cash to the first April, the pension and ISA totals. | Income strategy: Full index-linked gilt ladder (index.html:3184-3192) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. | `s8-e` | `strategies.full-il-gilt` `strategyParams.full-il-gilt.cashYears` `strategyParams.full-il-gilt.bridgeCash` `strategyParams.full-il-gilt.sippTotal` `strategyParams.full-il-gilt.isaTotal` |
| **Gilt ladder + rotation** | The full ladder, plus one agreed escape: if shares fall 30% below their high, the rungs beyond an age are sold to buy them cheap. Dials: years from cash, pension cash to April, the age kept to, the trigger and when it disarms, the pension and ISA totals. | Income strategy: Gilt ladder + rotation (index.html:3186-3189; strategies/GiltRotation.js) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "compare" step; E's answer contract is not written yet (square-one-audit.md §5 item 6). Owner's decision pending: all nine answer in V7's words. | `s8-e` | `strategies.gilt-rotation` `strategyParams.gilt-rotation.cashYears` `strategyParams.gilt-rotation.bridgeCash` `strategyParams.gilt-rotation.rotateCutAge` `strategyParams.gilt-rotation.rotateTrigger` `strategyParams.gilt-rotation.rotateDisarmYears` `strategyParams.gilt-rotation.sippTotal` `strategyParams.gilt-rotation.isaTotal` |
| **Choose the plan's strategy; switch and come back** | Picks one strategy for the plan; switching puts each strategy's own inputs away and brings them back when you return. | Income strategy buttons (index.html:3137-3148); StrategyState.js | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "mix" and "compare" steps. | `s8-e` | `stress.strategyId` `stress.strategyParams` `stress.strategyState` `decision.strategyId` `decision.strategyParams` `strategyState.strategyParams` `strategyState.allocMode` `strategyState.taggedFunds` `strategyState.savedAt` |
| **What a ladder or floor costs today, against your pot** | As the dials change: the cost of the gilts at today's real yields, what is left for shares, the first year's treats, and an illustrative ladder, or "not affordable". | refreshStrategyCosts (index.html:9729-9796) | Approaching, retired | **Planned** (no V7 design yet): Part of each strategy's dials in E's "compare" step; no V7 design draws it. | `s8-e` | — |
| **Compare all nine on your plan** | Ranks the strategies on your plan by a score, paid in full, coverage and the worst 12 months. | Strategies → Overview (index.html:10146-10237) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. Owner's decision pending: one kind of verdict ("lasts in 9 futures out of 10") for all nine (square-one-audit.md §6 question 2). | `s8-e` | — |
| **A page for each strategy** | For each strategy: how the machine works, its dials, three real starts in history, and how it fails. | Strategies → one page per strategy | Approaching, retired | **Planned** (no V7 design yet): E's outline names "compare" but no V7 design draws a page per strategy. | `s8-e` | — |
| **Try this strategy in a copy of the plan** | Makes a copy of the plan on another strategy, with the pot totals carried over; the original is untouched. | "Try this strategy in a COPY of this plan" (index.html:3216-3217, 9707-9727) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.6. "Keep a try-a-change result as a separate plan". | `s8-e` | — |
| **Gilt ladders explained, with a worked example** | What a gilt ladder is and what one costs today, for an amount and a number of years. | Strategies → Gilt ladders explained; Stress → Drawdown (index.html:2904-2916) | Approaching | **Designed**: research/v7/rail-screens-language.md §1.5. E's "move" step. | `s8-e` | — |
| **Gilt order sheet** | Which gilts to buy and how many (SEDOLs and nominal amounts), priced at the latest prices. | Strategy pages; gilt ladder pricing (index.html:6203-6250; GiltLadderPlan.js, LinkerUniverse.js) | Approaching, running | **Designed**: research/v7/rail-screens-language.md §1.5. E's "move" step. | `s8-e` | — |
| **Rotation watch and ticket** | For gilt ladder + rotation: how far shares are below their high, the ticket to act on when the trigger fires, and the guided switch that sells the block, buys shares and records the income sold. | RotationStatus.js; strategy page; executeRotation (index.html:9385) | Running | **Designed**: research/v7/rail-screens-language.md §1.6. The locked rail's "move" station. | `s8-e` | — |
| **Assumptions and data** | Where every figure comes from: the return history, inflation, gilt prices, and what is assumed. | Strategies → Assumptions & data | Everyone | **Planned**: The trust pages (product-plan.md); V7 already says what each answer assumed (src/v7/components/Assumed.jsx). | `s10-after` | — |

## Testing the plan

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Monte Carlo: a thousand futures** | Runs the plan through 1,000 simulated futures and shows how often it lasts, with cones of income and wealth. | Stress → Monte Carlo (index.html:2779-2815) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "answer" step. V7's answers already run futures (src/answers/shared/futures.js) on the 9-in-10 bar. | `s8-e` | — |
| **Every start year in history** | Runs the plan from every start year in the record and shows the worst sequences. | Stress → Historical (index.html:2840-2860) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "answer" step: "Does it come through the bad times?" | `s8-e` | — |
| **Named stress scenarios** | Runs the plan through named crashes and bad decades. | Stress → Scenarios (index.html:2862-2881) | Approaching, retired | **Designed**: research/v7/rail-screens-language.md §1.5. E's "answer" step. | `s8-e` | — |
| **Try a strategy, never saved** | A what-if on any strategy, pot, ISA, income, years and cuts, run without changing the plan (works on a locked plan too); "Use this strategy for my plan" adopts it on an unlocked one. | Stress → Monte Carlo → Try a strategy (index.html:2818-2836) | Everyone, locked plans too | **Designed**: research/v7/rail-screens-language.md §1.6. "Test the plan: try-only". V7's answers have Try a change (src/v7/components/TryAChange.jsx), and with a spending shape "Try it the same every year" and "Put back my steps by age" (today's "Income: … A flat amount"). | `s8-e` | — |
| **"What is this doing?"** | A plain explanation beside each test of what it runs and what its figures mean. | Stress → Monte Carlo, Historical, Scenarios: "What is this doing?" (openStressExplainer) | Approaching, retired | **Planned** (no V7 design yet): V7 says what each answer assumed (src/v7/components/Assumed.jsx); an explanation of each test needs E. | `s8-e` | — |
| **Compare allocations and apply the best split** | Searches the share, bond and cash split for Pots & Valves and offers to apply it. | Stress → "Compare allocations (Pots & Valves)" (index.html:6683-6834) | Approaching, retired | **Planned** (no V7 design yet) | `s8-e` | — |
| **Drawdown schedule and the ISA bridge table** | Year by year: what is drawn from the pension and ISA, tax, and what is left; for a bought strategy its own schedule (income middle and 1 in 10). | Stress → Drawdown (index.html:2882, 7168, 13216-13240) | Approaching, retired | **Planned** (no V7 design yet): A's "What pays the bills before my State Pension starts?" (rail-screens-language.md §1.5) is a summary, not built. | `s8-e` | — |
| **The glidepath picture** | Draws the pots' floors running down over the plan at an assumed inflation. | Stress → Glidepath (index.html:2925-2945) | Approaching, retired | **Planned** (no V7 design yet) | `s8-e` | — |

## Lock and the plan document

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Lock the plan and make the plan document** | Freezes the settings of both tools and writes the plan as committed; the first Decision record also locks it. | Stress → Settings → "Lock plan & create the plan document" (index.html:3636, 8510-8541; PlanLock.js) | Approaching, locked | **Designed**: research/v7/rail-screens-language.md §1.5. E's "lock" step; A and B (and later D) end with "Lock this plan?" (square-one-audit.md §5 item 5). | `s5-lock` | `decision.locked` `decision.lockedAt` `decision.lockedBy` |
| **Unlock to change the plan** | Unlocking keeps the plan document as a past version (last ten) and counts the unlocks. | Lock banner "Unlock to edit" (index.html:13070-13090) | Locked plans | **Designed**: research/v7/rail-screens-language.md §1.6. "Unlock to change the plan" keeps the document as a past version. | `s5-lock` | `decision.unlockedAt` `decision.unlockCount` `plan.planDocumentArchive` `plan.decisionTool.planOfRecordArchive` |
| **The plan document** | The plan as committed: timeline, steps, the strategy's verdict, pots and assumptions; printed or saved as a PDF; refreshed on demand. | Decision → Plan document (index.html:2700-2706; PlanDocument.js, PlanDocumentView.js) | Locked plans | **Designed**: research/v7/rail-screens-language.md §1.6. The "Your plan" station reads the document only, never live settings. A plan locked while saving from 6.22.0 holds a version 3 saving path drawn on V7's saving-years engine (SavingPath.js): 1,000 futures, pension and ISA, the middle line and the 1-in-10 bad and good lines. | `s4-open-plan` | `plan.planDocument` |
| **The ladder card** | For a locked gilt plan: what arrives when, what has been bought, and what the same gilts would cost today, as a comparison only. | Plan document and strategy page (LadderPosition.js) | Locked plans with a ladder | **Designed**: research/v7/rail-screens-language.md §1.6. The "Your plan" and "Moving to your plan's mix" stations ("6 of 18 gilts bought"). | `s4-open-plan` | — |
| **The plan of record** | The drawdown and glidepath projection frozen when the Decision plan locked: a yardstick that does not move. | ScenarioRepository.saveActivePlanOfRecord | Nobody sees it directly | **Planned**: Carried as stored: V7 reads and writes the same saved plan (architecture.md §3.9: no change to the shape of saved plans at 7.0). | `s4-open-plan` | `plan.decisionTool.planOfRecord` |
| **Where you are** | Reads the recorded months against the document: took this, the plan said that. | Plan document strip (PlanDocument.whereAmI) | Locked plans | **Designed**: research/v7/rail-screens-language.md §1.6. The "Where you are" station. | `s4-open-plan` | — |
| **Arrival check** | The first month after a plan locked while saving reaches its stop: your pot against the plan's, then carry on or unlock and plan again. | LifeStage.js:136-147; index.html:6023-6033 | Locked savers at their stop | **Designed**: research/v7/rail-screens-language.md §1.6. P.arrived. From 6.22.0 today's planner reads the arrival with the saver's reading (SaverReading.js): the pot at the first month after the stop against the locked path's middle line, in the path's own pounds, pension and ISA on a path drawn from 6.22.0. | `s4-open-plan` | — |
| **"Saved by a newer version"** | A plan saved by a newer version of the app is shown read-only, with a reload button. | planNewerBanner (index.html; storage/schema.js) | Everyone | **Designed**: research/v7/rail-screens-language.md §1.6. P.readonly. | `s4-open-plan` | `plan.schemaVersion` |
| **Nothing changes a locked plan** | Every button that writes settings refuses on a locked plan and says where the unlock is; records, holdings and the budget stay editable. | LockedPlanGuard.js (6.20.2, in progress) | Locked plans | **Designed**: research/v7/rail-screens-language.md §1.6. "What a locked plan can and cannot do on the rail". | `s1-safety` | — |

## Month by month (the Decision tool) and tax years

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Record a month** | This month's fund values (by bucket, or fund by fund), the ISA, diversifiers, the taxable account and its cost; "paid this month already". | Decision → Monthly Entry (index.html:2291-2393; DecisionPanel.js) | Run-up, running | **Designed**: research/v7/rail-screens-language.md §1.6. The "This month" station. Owner's decision pending: 7.0 may ship with Month by month on today's screen (square-one-audit.md §6 question 3). | `s9-switch` | `plan.decisionTool.history` |
| **What to draw and from where** | The month's recommendation: how much, from which pot, what to sell or rebalance, the tax summary. | Decision → Monthly Entry → Calculate (legacyDecision.js) | Run-up, running | **Designed**: research/v7/rail-screens-language.md §1.6 | `s9-switch` | — |
| **How often you draw** | Monthly, quarterly or a year at a time. | Decision → Monthly Entry: How often you draw (index.html:2301-2310, 5960-5970) | Run-up, running | **Designed**: research/v7/rail-screens-language.md §1.6 | `s9-switch` | `decision.cadence` |
| **History, plan against actual** | Every recorded month by tax year, against the plan; delete a year or everything. | Decision → History (index.html:2707-2740) | Running | **Designed**: research/v7/rail-screens-language.md §1.6. The "Where you are" station. | `s9-switch` | — |
| **A spreadsheet per tax year, and PDFs** | Downloads each tax year's records and prints the documents. | Decision → History / Tax Years (index.html:2707-2750) | Running | **Planned**: Carried over with Month by month (square-one-audit.md §4). | `s9-switch` | — |
| **Set up a tax year** | Each April: the bands, last year's price rise, other income, the ISA to use, the tax-efficiency choice, income and tax already this year, the start month and the confirmed target; edit a year or set it up again. | TaxYearSetupWizard.js; Decision → Tax Years (index.html:14420-14470) | Run-up, running | **Designed**: research/v7/rail-screens-language.md §1.6. P.taxyear: "Next: set up the {2027/28} tax year." | `s9-switch` | `plan.decisionTool.taxYears` `taxYear.pa` `taxYear.brl` `taxYear.hrl` `taxYear.cpi` `taxYear.other` `taxYear.cgtExemptionUsed` `taxYear.isaSavingsAllocation` `taxYear.isaSavingsUsed` `taxYear.isTaxEfficient` `taxYear.taxEfficiencyChoice` `taxYear.grossIncomeToDate` `taxYear.taxPaidToDate` `taxYear.startMonth` `taxYear.confirmedSalary` `taxYear.remainingMonths` `taxYear.statePension` `taxYear.expectedMonthly` `taxYear.yearSetupComplete` |
| **Copy settings between the two tools** | "Copy from Decision Tool" seeds the Stress tester from the committed plan; "Use ALL Stress settings" or "Copy target amount only" goes the other way. | Stress → Settings (index.html:3563-3567); Decision → Settings (index.html:2648-2660) | Approaching, retired | **Retired**: V7 keeps one plan and tries changes without saving them (rail-screens-language.md §1.6), so there are no two tools to copy between: every figure the copy carried is in the one plan. (Owner: to confirm) | `s9-switch` | — |

## Saving years (Accumulation)

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **What you pay in, and your employer** | What you pay each month from take-home, and what your employer adds. | Accumulation → Contributions (index.html:3677-3702) | Savers | **Built**: `src/answers/shared/schemaParts.js`, `src/v7/components/PayInSplit.jsx`. One figure that lands in the pension, or split into your part and your employer's. | `done` | `accumulation.netMonthly` `accumulation.employerMonthly` |
| **What goes into ISAs and savings each month** | A monthly amount into ISAs and other savings, from take-home pay (no tax relief), raised each year like the pension payments; it counts in the pots at retirement, the age spin and a plan locked while saving. | Accumulation → Contributions → Into ISAs and savings (index.html #acIsaMonthly, 6.22.0) | Savers | **Built**: `src/answers/shared/schemaParts.js`. V7 asked for it first ("savingsIn"); a plan made from an answer now keeps it in the planner's box. | `done` | `accumulation.isaMonthly` |
| **How tax relief works, and your salary** | Relief at source, net pay or salary sacrifice, with your salary, so the higher-rate reclaim and the NI saving are shown. | Accumulation → How relief works; Salary (index.html:3682-3692; AccumulationEngine.contributionBreakdown) | Savers | **Planned** (no V7 design yet): V7 takes what lands in the pension, the tax added back included; it does not ask how relief is given. | `s8-e` | `accumulation.schemeType` `accumulation.salary` |
| **Raise payments by a % a year** | Payments rise by a set percentage each year. | Accumulation → Raise contributions by (index.html:3700) | Savers | **Planned** (no V7 design yet) | `s8-e` | `accumulation.escalationPct` |
| **Age, retiring age, pension today** | The Accumulation planner's own age, retirement age and pot today. | Accumulation → About you (index.html:3678-3681) | Savers | **Built**: `src/answers/shared/schemaParts.js`, `src/answers/b/schema.js` | `done` | `accumulation.currentAge` `accumulation.retirementAge` `accumulation.potNow` |
| **The Accumulation planner's part of the plan** | Where the saving years' settings are kept on the plan. | scenario.accumulationTool.settings | Nobody sees it directly | **Built**: `src/answers/keep/planSeed.js`, `src/services/PlanSeed.js`. A plan made from a V7 answer with money still going in carries it. | `done` | `plan.accumulationTool` `plan.accumulationTool.settings` |
| **Projection to the retirement age** | The pot at each age at 2%, 5% and 8%, with what was paid in. | Accumulation → Projection (AccumulationEngine.js:41) | Savers | **Built**: `src/answers/shared/saving.js`, `src/v7/components/Pots.jsx`. Replaced, better: the saving-years engine with a middling and a bad case. | `done` | — |
| **A projection at your own holdings' mix** | A fourth projection line at the expected return of what you hold, net of its costs. | Accumulation → Projection: Your mix (6.7.0) | Savers | **Planned** (no V7 design yet): V7 projects at a risk level while saving (savingRisk). | `s8-e` | — |
| **When could I retire?** | Which age clears the bar for an income wanted, if saving carries on. | Accumulation → When could I retire? (RetireSweep.js) | Savers, approaching | **Built**: `src/answers/a/answer.js`, `src/v7/screens/a/AgesScreen.jsx`, `src/v7/components/AgesChart.jsx`. A's every-age table, on the saving-years engine. | `done` | — |
| **Am I on course?** | The pot needed for the plan's target and whether the saving gets there. | Accumulation → Am I on course? (index.html "Am I on course?"; src/services/OnCourse.js, src/ui/accumulationProjection.js) | Savers | **Built**: `src/answers/b/answer.js`, `src/v7/screens/b/AnswerScreen.jsx`, `src/v7/screens/b/ChoicesScreen.jsx`. B, with the monthly amount that gets there and the options if it does not fit. One bar everywhere from 6.22.0: on course = lasts in 9 futures out of 10 (OnCourse.ON_COURSE_SHARE = V7's BAND.careful). | `done` | — |
| **Payment warnings** | Warns when payments pass the annual allowance, the £10,000 limit after drawing, or relevant earnings. | Accumulation (AccumulationEngine.contributionWarnings) | Savers | **Built**: `src/answers/b/answer.js`, `src/answers/shared/schemaParts.js`. Annual allowance, the £10,000 limit, the ISA allowance, and paying in past 75. | `done` | — |
| **Record this month's pot** | One line a month while saving (pension, ISA, taxable), read against the locked plan's saving path. | Accumulation → Record this month's pot (index.html:3728-3739, 8795-8830) | Locked savers | **Planned**: A saver's station, "This month's pot" (square-one-audit.md §5 item 4). The reading was fixed first (item 2, 6.22.0): read at the record's month, from the path's own start, in the path's pounds; plans locked from 6.22.0 draw the path on V7's saving-years engine (pension and ISA, 1-in-10 lines; src/services/SavingPath.js, SaverReading.js). | `s4-open-plan` | `plan.accumulationTool.history` |

## What you hold, and the move (Transition)

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **What you hold** | One record of what you actually hold, line by line by wrapper (pension, ISA, taxable, cash): ticker, name, SEDOL, units, value, cost, payments, sub-class, kind, date; typed or pasted from a platform; never the funds a strategy is tested on. | Transition → What you hold; Accumulation → Record what I hold (TransitionView.js:41-89; HoldingsRecord.js, HoldingsPaste.js) | Everyone | **Designed**: research/v7/rail-screens-language.md §1.5. E's "hold" step and the locked rail's "What you hold" station (§1.6). The "Holdings and the move" sub-plan is not written (square-one-audit.md §5 item 6). | `s8-e` | `plan.holdings` `holdings.version` `holdings.updatedAt` `holdings.source` `holdings.offerDismissed` `holdings.lines` `holdings.lines[].wrapper` `holdings.lines[].ticker` `holdings.lines[].name` `holdings.lines[].sedol` `holdings.lines[].units` `holdings.lines[].value` `holdings.lines[].ocf` `holdings.lines[].contribution` `holdings.lines[].subClass` `holdings.lines[].kind` `holdings.lines[].asOf` |
| **Moving to the plan's mix** | The buy and sell list, the cash to hold, the schedule and the tick-offs as each move is placed. | Transition (TransitionView.js:90-163; TransitionPlanner.js) | Approaching, locked | **Designed**: research/v7/rail-screens-language.md §1.5. E's "move" step, which says on its face that it is optional and what skipping it costs. | `s8-e` | `plan.transition` |

## Couples (Household)

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **The partner's linked plan** | Links this plan to the partner's own plan, or creates theirs and switches to it. | Household → The two plans (index.html:3766-3830) | Couples | **Built**: `src/answers/shared/household.js`, `src/services/PlanSeed.js`. Better: a couple's figures on the first screen; saving makes the two linked plans. | `done` | `plan.household` `household.partnerScenarioId` |
| **Will the money last for both of us?** | Runs the two plans together. | Household → Run the household check (HouseholdService.js) | Couples | **Built**: `src/answers/shared/household.js`, `src/answers/shared/toEngine.js`. Every V7 answer is the household's; 6.20.0 adds couples who stop in different years. | `done` | — |
| **Survivor check** | What happens to the money if one of you dies. | HouseholdService.js:163-237 | Couples | **Planned**: Gets a station at the switch (square-one-audit.md §5 item 9); "today's planner keeps them" until then (answer-D.md §8). | `s9-switch` | — |
| **Care-cost check** | Whether the money stands a spell of care costs for one of you. | HouseholdService.js:163-237 | Couples | **Planned**: Gets a station at the switch (square-one-audit.md §5 item 9). | `s9-switch` | — |

## Plan and account

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **Your plans: switch, new, duplicate, rename** | A menu of plans: open one, start a new one, duplicate one, rename it and describe it. | Header plan menu (index.html:2205-2221) | Everyone | **Planned**: Plan menu in V7's shell (square-one-audit.md §5 item 9). | `s9-switch` | `plan.isActive` `plan.planDetails` `planDetails.name` `planDetails.description` |
| **Download a plan** | Saves a copy of the plan (JSON) on your own computer. | Plan menu → Download this plan (PlanExport.js) | Everyone | **Planned**: Plan menu in V7's shell. | `s9-switch` | — |
| **Save a V7 answer as a new plan** | A V7 answer becomes a named plan in today's planner; a couple's becomes two linked plans; the answer it came from is kept with it. | NewPlanFromSeed.js; PlanSeed.js (6.18.0) | Everyone | **Built**: `src/answers/keep/planSeed.js`, `src/v7/effects/planSeed.js`, `src/v7/components/KeepPanel.jsx`, `src/services/PlanSeed.js` | `done` | `plan.fromAnswer` `browser.pt_v7_plan_seed` `browser.pt_v7_plan_receipt` |
| **What's new** | A once-only pop-up for each minor release, and every release listed on a page. | Version chip; Strategies → What's new (src/releases.js) | Everyone | **Planned**: What's new in V7's shell (square-one-audit.md §5 item 9). | `s9-switch` | `profile.lastSeenVersion` `browser.pt_lastSeenVersion` |
| **Sign in and out** | Email and password or Google, a verified email, and signing out after an hour idle across tabs. | AuthPanel.js; index.html:5640-5700 | Everyone | **Planned**: Must exist in V7 at the switch (data protection; square-one-audit.md §4). | `s9-switch` | `browser.pt_lastActivity` |
| **Delete the account, or reset** | Deletes the account and every plan, or deletes all data and starts again. | Header: Delete Account, Reset (index.html:2228-2231) | Everyone | **Planned**: Must exist in V7 at the switch (data protection). | `s9-switch` | — |
| **Reset a tool's settings to the defaults** | Puts the Stress tester's or the Decision tool's settings back to the defaults (refused on a locked plan). | Stress and Decision → Settings → Reset to Defaults | Everyone | **Planned** (no V7 design yet) | `s8-e` | — |
| **Which tools a plan shows** | Turns tools on or off for a plan, with a short wizard when a tool is added. | Plan settings; add-a-tool wizard (index.html:5585-5620) | Everyone | **Retired**: V7 has no tool tabs: the rail shows the steps the plan's stage needs, so there is nothing to switch on or off. (Owner: to confirm) | `s9-switch` | `plan.enabledTools` |
| **Administration** | The owner's panel: the fund catalogue, the typical amounts, the queue of unknown tickers. | Header gear (index.html:12840-12900) | The owner | **Planned** (no V7 design yet): Owner only; could stay on the previous version's page. | `s9-switch` | — |

## Machinery: keys no person sees

| What | What it does | Where in today's app | Who needs it | V7 | Step | Saved as |
|---|---|---|---|---|---|---|
| **The budget's version and stored totals** | A version mark, and the totals (essentials, comfortable, suggested gross) worked out again on every save. | BudgetRepository.saveBudget (derived); BudgetModel.defaultBudget (version) | Nobody sees it | **Planned**: Carried as stored: V7 reads and writes the same saved plan (architecture.md §3.9: no change to the shape of saved plans at 7.0). | `s9-switch` | `budget.version` `budget.derived` |
| **Whether a line's panels were left open** | Whether a line's age band or breakdown was open on screen when it was saved. | Budget lines (index.html:11660-11670, 12491) | Nobody sees it | **Retired**: Screen state saved with the line by accident, not a setting: V7 keeps open panels in the screen itself. Nothing a person set is lost. | `s9-switch` | `budget.lines[]._bandOpen` `budget.lines[].breakdownOpen` |
| **The old State Pension fields** | The State Pension as an annual figure from a plan year, from before the start date was asked; read only when a plan has no date. | design/settings-model.md (read-time fallback) | Nobody sees it | **Planned**: V7 must read an old plan the same way (fallback only, never asked). | `s4-open-plan` | `stress.statePension` `stress.statePensionYear` `decision.statePension` `decision.statePensionYear` |
| **Where a copy came from** | Which tool a settings copy came from, when, and a fingerprint of the source (for a "changed since you copied" note). | seedStressFromDecision / seedDecisionFromStress (ScenarioRepository.js) | Nobody sees it directly | **Retired**: Belongs to "Copy settings between the two tools" (retired with it, once the owner agrees); old plans keep these keys untouched. | `s9-switch` | `stress.seededFrom` `stress.seededAt` `stress.decisionChecksum` `decision.seededFrom` |
| **The plan's own fields** | The plan's id, when it was made and last changed. | FirestoreService.js | Nobody sees it | **Planned**: Carried as stored: V7 reads and writes the same saved plan (architecture.md §3.9: no change to the shape of saved plans at 7.0). | `s9-switch` | `plan.id` `plan.createdAt` `plan.lastModified` |
| **The parts a plan is kept in** | The Stress tester's, the Decision tool's and the Budget's parts of a plan. | ScenarioRepository.js | Nobody sees it | **Planned**: Carried as stored: V7 reads and writes the same saved plan (architecture.md §3.9: no change to the shape of saved plans at 7.0). | `s9-switch` | `plan.stressTool` `plan.stressTool.settings` `plan.decisionTool` `plan.decisionTool.settings` `plan.budgetTool.settings` |
| **The plan's strategy block** | Which strategy the plan runs, with its dials, when it was chosen and the engine version. | ScenarioRepository.defaultStrategyBlock / setActiveStrategy | Nobody sees it directly | **Planned**: Carried as stored: V7 reads and writes the same saved plan (architecture.md §3.9: no change to the shape of saved plans at 7.0). | `s9-switch` | `plan.strategy` `strategy.id` `strategy.params` `strategy.lockedAt` `strategy.engineVersion` |
| **Settings have been saved once** | Marks a plan whose settings have been through Settings at least once, so the tool opens straight away. | saveStressSettingsUI / saveDecisionSettingsUI | Nobody sees it | **Planned**: Carried as stored: V7 reads and writes the same saved plan (architecture.md §3.9: no change to the shape of saved plans at 7.0). | `s9-switch` | `stress.configured` `decision.configured` |
| **The old "Declining with age" spending profile** | A spending profile that drifted down with age, applied on top of the income steps. | Settings → Spending (until 6.2.1); IncomeSchedule.smileToSteps | Nobody sees it now | **Retired**: Retired in 6.2.1: "Declining with age" became a slope on the income steps, with the same figures; old plans are folded in when opened. The taper itself is kept: in V7 it is the preset "Slowly less" (src/answers/shared/shape.js slowlyLess, today's smileToSteps). | `v6-retired` | `stress.spendingProfile` `decision.spendingProfile` `stress.spendingMigratedFrom` `decision.spendingMigratedFrom` |
| **Old names of the three pot floors** | The names the shares, bonds and cash floors had before they were renamed. | storage/migrations.js toV1; StressRepository.js:223-230 | Nobody sees it | **Retired**: Renamed before 6.15.0 to equityMin, bondMin and cashTarget; kept beside the new names on old plans and read only to fill a missing new one. | `v6-retired` | `stress.pacwMin` `stress.cgtMin` `stress.csh2Target` |
| **Copies under dotted names** | Copies of a plan's parts that an old storage fault wrote under names with dots in them. | tests/fixtures/plans/08-dotted-keys.json; normalizeScenario | Nobody sees it | **Retired**: Never a setting: copies a storage fault wrote, folded back into the plan when it is opened. | `v6-retired` | `plan.dotted:decisionTool.settings` `plan.dotted:decisionTool.history` `plan.dotted:decisionTool.taxYears` `plan.dotted:stressTool.settings` `plan.dotted:planDetails.name` |
| **riskMode on the example plan** | A field written only by the guest example plan. | Guest example plan (index.html:5048) | Nobody sees it | **Retired**: Read by nothing in today's app; the example plan's allocMode carries the same thing. | `v6-retired` | `stress.riskMode` |
| **The Decision tool's old start date** | An early Decision field for when the plan started, always empty. | DecisionRepository.getDefaultDecisionDB | Nobody sees it | **Retired**: Read by nothing; the plan's start is its first tax year (design/settings-model.md lists it as a dead field). | `v6-retired` | `decision.startDate` |

## Every saved key

One line for each key today's app saves, with the row that carries it. The test holds this list to the keys it
reads from today's code and test plans, so nothing saved today can be missed at the switch.

### `plan`: the plan document itself (its top-level fields)

| Key | Row | V7 |
|---|---|---|
| `plan.accumulationTool` | The Accumulation planner's part of the plan | Built |
| `plan.accumulationTool.history` | Record this month's pot | Planned |
| `plan.accumulationTool.settings` | The Accumulation planner's part of the plan | Built |
| `plan.budgetTool` | Spending lines | Built |
| `plan.budgetTool.settings` | The parts a plan is kept in | Planned |
| `plan.createdAt` | The plan's own fields | Planned |
| `plan.decisionTool` | The parts a plan is kept in | Planned |
| `plan.decisionTool.history` | Record a month | Designed |
| `plan.decisionTool.planOfRecord` | The plan of record | Planned |
| `plan.decisionTool.planOfRecordArchive` | Unlock to change the plan | Designed |
| `plan.decisionTool.settings` | The parts a plan is kept in | Planned |
| `plan.decisionTool.taxYears` | Set up a tax year | Designed |
| `plan.dotted:decisionTool.history` | Copies under dotted names | Retired |
| `plan.dotted:decisionTool.settings` | Copies under dotted names | Retired |
| `plan.dotted:decisionTool.taxYears` | Copies under dotted names | Retired |
| `plan.dotted:planDetails.name` | Copies under dotted names | Retired |
| `plan.dotted:stressTool.settings` | Copies under dotted names | Retired |
| `plan.enabledTools` | Which tools a plan shows | Retired |
| `plan.fromAnswer` | Save a V7 answer as a new plan | Built |
| `plan.holdings` | What you hold | Designed |
| `plan.household` | The partner's linked plan | Built |
| `plan.id` | The plan's own fields | Planned |
| `plan.isActive` | Your plans: switch, new, duplicate, rename | Planned |
| `plan.journey` | Journey: when the plan moved between stages | Planned |
| `plan.lastModified` | The plan's own fields | Planned |
| `plan.planDetails` | Your plans: switch, new, duplicate, rename | Planned |
| `plan.planDocument` | The plan document | Designed |
| `plan.planDocumentArchive` | Unlock to change the plan | Designed |
| `plan.schemaVersion` | "Saved by a newer version" | Designed |
| `plan.strategy` | The plan's strategy block | Planned |
| `plan.stressTool` | The parts a plan is kept in | Planned |
| `plan.stressTool.settings` | The parts a plan is kept in | Planned |
| `plan.transition` | Moving to the plan's mix | Designed |

### `planDetails`: planDetails: the plan's name and description

| Key | Row | V7 |
|---|---|---|
| `planDetails.description` | Your plans: switch, new, duplicate, rename | Planned |
| `planDetails.name` | Your plans: switch, new, duplicate, rename | Planned |

### `stress`: stressTool.settings: the Stress tester (Drawdown Planner) settings

| Key | Row | V7 |
|---|---|---|
| `stress.accessMethod` | The 25% tax-free part: in each withdrawal, or kept separate | Built |
| `stress.allocMode` | Risk level: cautious, balanced, adventurous | Built |
| `stress.bandFillRecycle` | Fill the basic-rate band and recycle into the ISA | Planned (no V7 design yet) |
| `stress.baseSalary` | The year-by-year figure every tool reads | Built |
| `stress.bedAndIsa` | Bed-and-ISA £20,000 a year | Planned (no V7 design yet) |
| `stress.bondMin` | Pension pot, split into shares, bonds and cash | Built |
| `stress.brl` | Tax thresholds | Planned (no V7 design yet) |
| `stress.cashTarget` | Pension pot, split into shares, bonds and cash | Built |
| `stress.cgtMin` | Old names of the three pot floors | Retired |
| `stress.chargesPct` | Charges (funds and platform), % a year | Built |
| `stress.configured` | Settings have been saved once | Planned |
| `stress.consecutiveLimit` | Cuts in a slump | Planned (no V7 design yet) |
| `stress.csh2Target` | Old names of the three pot floors | Retired |
| `stress.currentAge` | Age today | Built |
| `stress.currentAgeAsOf` | Age today | Built |
| `stress.dbAmount` | Final-salary pension: amount and start | Built |
| `stress.dbIndexation` | How a final-salary pension rises | Planned (no V7 design yet) |
| `stress.dbStartYear` | Final-salary pension: amount and start | Built |
| `stress.decisionChecksum` | Where a copy came from | Retired |
| `stress.disableProtection` | Cuts in a slump | Planned (no V7 design yet) |
| `stress.diversifierStart` | Diversifiers sleeve: gold and trend/macro | Planned (no V7 design yet) |
| `stress.duration` | How long the plan runs | Built |
| `stress.equityGlideEnabled` | Bond tent | Planned (no V7 design yet) |
| `stress.equityMin` | Pension pot, split into shares, bonds and cash | Built |
| `stress.extraIncomes` | Income for some years | Planned (no V7 design yet) |
| `stress.extraWithdrawals` | Extra spends in a given year | Designed |
| `stress.firstTaxYear` | Plan starts this tax year or next April | Planned |
| `stress.giaTaxBand` | A taxable account (GIA) | Planned (no V7 design yet) |
| `stress.glideEndgame` | Bond tent | Planned (no V7 design yet) |
| `stress.hodlEnabled` | Emergency reserve ("Break Glass HODL") | Planned (no V7 design yet) |
| `stress.hodlValue` | Emergency reserve ("Break Glass HODL") | Planned (no V7 design yet) |
| `stress.hrl` | Tax thresholds | Planned (no V7 design yet) |
| `stress.incomeShape` | Steps by age: "from age X take £Y a year" | Built |
| `stress.incomeSteps` | Steps by age: "from age X take £Y a year" | Built |
| `stress.isaBalance` | ISA (and savings) total | Built |
| `stress.isaDrawdownStrategy` | How the ISA is used | Planned (no V7 design yet) |
| `stress.isaGrowth` | How the ISA and savings grow, and the ISA's floor | Built |
| `stress.isaMin` | How the ISA and savings grow, and the ISA's floor | Built |
| `stress.isaReturn` | How the ISA and savings grow, and the ISA's floor | Built |
| `stress.legacyFirstTaxYear` | Plan starts this tax year or next April | Planned |
| `stress.other` | Other income or pension | Planned (no V7 design yet) |
| `stress.pa` | Tax thresholds | Planned (no V7 design yet) |
| `stress.pacwMin` | Old names of the three pot floors | Retired |
| `stress.potAtRetirement` | Pots at retirement, typed in | Planned (no V7 design yet) |
| `stress.protectionEscalateMonths` | Cuts in a slump | Planned (no V7 design yet) |
| `stress.protectionMult` | Cuts in a slump | Planned (no V7 design yet) |
| `stress.recoveryBuffer` | Cuts in a slump | Planned (no V7 design yet) |
| `stress.relevantEarnings` | Relevant UK earnings | Planned (no V7 design yet) |
| `stress.retireAge` | Retired already, or retiring at an age | Built |
| `stress.retired` | Retired already, or retiring at an age | Built |
| `stress.riskMode` | riskMode on the example plan | Retired |
| `stress.seededAt` | Where a copy came from | Retired |
| `stress.seededFrom` | Where a copy came from | Retired |
| `stress.shapeAgeNow` | The year-by-year figure every tool reads | Built |
| `stress.spStartDate` | State Pension start date, typed from the forecast | Planned (no V7 design yet) |
| `stress.spWeeklyAmount` | State Pension amount | Built |
| `stress.spendingMigratedFrom` | The old "Declining with age" spending profile | Retired |
| `stress.spendingProfile` | The old "Declining with age" spending profile | Retired |
| `stress.staleDraftDismissedFor` | "Update this draft to today" | Planned (no V7 design yet) |
| `stress.statePension` | The old State Pension fields | Planned |
| `stress.statePensionYear` | The old State Pension fields | Planned |
| `stress.strategyId` | Choose the plan's strategy; switch and come back | Designed |
| `stress.strategyParams` | Choose the plan's strategy; switch and come back | Designed |
| `stress.strategyState` | Choose the plan's strategy; switch and come back | Designed |
| `stress.subAsset` | Test on a list of funds | Designed |
| `stress.taggedFunds` | Test on a list of funds | Designed |
| `stress.targetSchedule` | The year-by-year figure every tool reads | Built |
| `stress.taxMode` | Thresholds rise with prices, or stay frozen | Planned (no V7 design yet) |
| `stress.taxableMix` | A taxable account (GIA) | Planned (no V7 design yet) |
| `stress.taxableStart` | A taxable account (GIA) | Planned (no V7 design yet) |
| `stress.ufplsThenPcls` | Tax-free part for some years, then the rest into the ISA | Planned (no V7 design yet) |
| `stress.ufplsYears` | Tax-free part for some years, then the rest into the ISA | Planned (no V7 design yet) |
| `stress.windfalls` | One-off lump sums | Designed |

### `decision`: decisionTool.settings: the Decision tool (Month by month) settings

| Key | Row | V7 |
|---|---|---|
| `decision.accessMethod` | The 25% tax-free part: in each withdrawal, or kept separate | Built |
| `decision.allocMode` | Risk level: cautious, balanced, adventurous | Built |
| `decision.bandFillRecycle` | Fill the basic-rate band and recycle into the ISA | Planned (no V7 design yet) |
| `decision.baseSalary` | The year-by-year figure every tool reads | Built |
| `decision.bedAndIsa` | Bed-and-ISA £20,000 a year | Planned (no V7 design yet) |
| `decision.bondMin` | Pension pot, split into shares, bonds and cash | Built |
| `decision.cadence` | How often you draw | Designed |
| `decision.cashTarget` | Pension pot, split into shares, bonds and cash | Built |
| `decision.configured` | Settings have been saved once | Planned |
| `decision.consecutiveLimit` | Cuts in a slump | Planned (no V7 design yet) |
| `decision.disableProtection` | Cuts in a slump | Planned (no V7 design yet) |
| `decision.diversifierStart` | Diversifiers sleeve: gold and trend/macro | Planned (no V7 design yet) |
| `decision.duration` | How long the plan runs | Built |
| `decision.equityGlideEnabled` | Bond tent | Planned (no V7 design yet) |
| `decision.equityMin` | Pension pot, split into shares, bonds and cash | Built |
| `decision.firstTaxYear` | Plan starts this tax year or next April | Planned |
| `decision.giaTaxBand` | A taxable account (GIA) | Planned (no V7 design yet) |
| `decision.glideEndgame` | Bond tent | Planned (no V7 design yet) |
| `decision.incomeShape` | Steps by age: "from age X take £Y a year" | Built |
| `decision.incomeSteps` | Steps by age: "from age X take £Y a year" | Built |
| `decision.isaBalance` | ISA (and savings) total | Built |
| `decision.isaDrawdownStrategy` | How the ISA is used | Planned (no V7 design yet) |
| `decision.isaMin` | How the ISA and savings grow, and the ISA's floor | Built |
| `decision.isaReturn` | How the ISA and savings grow, and the ISA's floor | Built |
| `decision.locked` | Lock the plan and make the plan document | Designed |
| `decision.lockedAt` | Lock the plan and make the plan document | Designed |
| `decision.lockedBy` | Lock the plan and make the plan document | Designed |
| `decision.protectionEscalateMonths` | Cuts in a slump | Planned (no V7 design yet) |
| `decision.protectionFactor` | Cuts in a slump | Planned (no V7 design yet) |
| `decision.recoveryBuffer` | Cuts in a slump | Planned (no V7 design yet) |
| `decision.relevantEarnings` | Relevant UK earnings | Planned (no V7 design yet) |
| `decision.seededFrom` | Where a copy came from | Retired |
| `decision.shapeAgeNow` | The year-by-year figure every tool reads | Built |
| `decision.spStartDate` | State Pension start date, typed from the forecast | Planned (no V7 design yet) |
| `decision.spWeeklyAmount` | State Pension amount | Built |
| `decision.spendingMigratedFrom` | The old "Declining with age" spending profile | Retired |
| `decision.spendingProfile` | The old "Declining with age" spending profile | Retired |
| `decision.startDate` | The Decision tool's old start date | Retired |
| `decision.statePension` | The old State Pension fields | Planned |
| `decision.statePensionYear` | The old State Pension fields | Planned |
| `decision.strategyId` | Choose the plan's strategy; switch and come back | Designed |
| `decision.strategyParams` | Choose the plan's strategy; switch and come back | Designed |
| `decision.subAsset` | Test on a list of funds | Designed |
| `decision.taggedFunds` | Test on a list of funds | Designed |
| `decision.targetSchedule` | The year-by-year figure every tool reads | Built |
| `decision.taxableMix` | A taxable account (GIA) | Planned (no V7 design yet) |
| `decision.taxableStart` | A taxable account (GIA) | Planned (no V7 design yet) |
| `decision.ufplsThenPcls` | Tax-free part for some years, then the rest into the ISA | Planned (no V7 design yet) |
| `decision.ufplsYears` | Tax-free part for some years, then the rest into the ISA | Planned (no V7 design yet) |
| `decision.unlockCount` | Unlock to change the plan | Designed |
| `decision.unlockedAt` | Unlock to change the plan | Designed |
| `decision.windfalls` | One-off lump sums | Designed |

### `taxYear`: decisionTool.taxYears[year]: one tax year's set-up

| Key | Row | V7 |
|---|---|---|
| `taxYear.brl` | Set up a tax year | Designed |
| `taxYear.cgtExemptionUsed` | Set up a tax year | Designed |
| `taxYear.confirmedSalary` | Set up a tax year | Designed |
| `taxYear.cpi` | Set up a tax year | Designed |
| `taxYear.expectedMonthly` | Set up a tax year | Designed |
| `taxYear.grossIncomeToDate` | Set up a tax year | Designed |
| `taxYear.hrl` | Set up a tax year | Designed |
| `taxYear.isTaxEfficient` | Set up a tax year | Designed |
| `taxYear.isaSavingsAllocation` | Set up a tax year | Designed |
| `taxYear.isaSavingsUsed` | Set up a tax year | Designed |
| `taxYear.other` | Set up a tax year | Designed |
| `taxYear.pa` | Set up a tax year | Designed |
| `taxYear.remainingMonths` | Set up a tax year | Designed |
| `taxYear.startMonth` | Set up a tax year | Designed |
| `taxYear.statePension` | Set up a tax year | Designed |
| `taxYear.taxEfficiencyChoice` | Set up a tax year | Designed |
| `taxYear.taxPaidToDate` | Set up a tax year | Designed |
| `taxYear.yearSetupComplete` | Set up a tax year | Designed |

### `budget`: budgetTool.settings: the Budget

| Key | Row | V7 |
|---|---|---|
| `budget.agesSetByUser` | Horizon: age today, retirement age, plan to age | Built |
| `budget.currentAge` | Horizon: age today, retirement age, plan to age | Built |
| `budget.currentAgeAsOf` | Horizon: age today, retirement age, plan to age | Built |
| `budget.derived` | The budget's version and stored totals | Planned |
| `budget.endAge` | Horizon: age today, retirement age, plan to age | Built |
| `budget.lines` | Spending lines | Built |
| `budget.lines[]._bandOpen` | Whether a line's panels were left open | Retired |
| `budget.lines[].annual` | Spending lines | Built |
| `budget.lines[].breakdown` | Break a line into sub-items | Planned (no V7 design yet) |
| `budget.lines[].breakdownOpen` | Whether a line's panels were left open | Retired |
| `budget.lines[].breakdown[].amount` | Break a line into sub-items | Planned (no V7 design yet) |
| `budget.lines[].breakdown[].label` | Break a line into sub-items | Planned (no V7 design yet) |
| `budget.lines[].breakdown[].period` | Break a line into sub-items | Planned (no V7 design yet) |
| `budget.lines[].fromAge` | A line from or to an age | Planned |
| `budget.lines[].heading` | Lines grouped by heading | Built |
| `budget.lines[].hint` | Typical UK amounts as hints | Built |
| `budget.lines[].id` | Spending lines | Built |
| `budget.lines[].label` | Spending lines | Built |
| `budget.lines[].mySharePct` | Who pays: me, partner or shared, and my share | Planned (no V7 design yet) |
| `budget.lines[].paidBy` | Who pays: me, partner or shared, and my share | Planned (no V7 design yet) |
| `budget.lines[].period` | Spending lines | Built |
| `budget.lines[].tier` | Essential or lifestyle, and the essentials total | Built |
| `budget.lines[].toAge` | A line from or to an age | Planned |
| `budget.lines[].wizGroup` | Lines grouped by heading | Built |
| `budget.mySharePct` | Who pays: me, partner or shared, and my share | Planned (no V7 design yet) |
| `budget.oneOffs` | One-off and every-few-years costs | Built |
| `budget.oneOffs[].amount` | One-off and every-few-years costs | Built |
| `budget.oneOffs[].atAge` | One-off and every-few-years costs | Built |
| `budget.oneOffs[].everyYears` | One-off and every-few-years costs | Built |
| `budget.oneOffs[].hint` | Typical UK amounts as hints | Built |
| `budget.oneOffs[].id` | One-off and every-few-years costs | Built |
| `budget.oneOffs[].label` | One-off and every-few-years costs | Built |
| `budget.oneOffs[].mySharePct` | Who pays: me, partner or shared, and my share | Planned (no V7 design yet) |
| `budget.oneOffs[].paidBy` | Who pays: me, partner or shared, and my share | Planned (no V7 design yet) |
| `budget.oneOffs[].tier` | Essential or lifestyle, and the essentials total | Built |
| `budget.partnerAge` | Partner's age, retirement age, retired or not | Built |
| `budget.partnerRetired` | Partner's age, retirement age, retired or not | Built |
| `budget.partnerRetirementAge` | Partner's age, retirement age, retired or not | Built |
| `budget.plsaTier` | National guide levels | Built |
| `budget.retired` | Horizon: age today, retirement age, plan to age | Built |
| `budget.retirementAge` | Horizon: age today, retirement age, plan to age | Built |
| `budget.sharedWithPartner` | Who pays: me, partner or shared, and my share | Planned (no V7 design yet) |
| `budget.splitPhases` | Who pays, changing over time | Planned (no V7 design yet) |
| `budget.splitPhases[].fromAge` | Who pays, changing over time | Planned (no V7 design yet) |
| `budget.splitPhases[].mySharePct` | Who pays, changing over time | Planned (no V7 design yet) |
| `budget.targetHeadroomMonthly` | Headroom on top of the budget | Retired |
| `budget.version` | The budget's version and stored totals | Planned |

### `accumulation`: accumulationTool.settings (and .history): the Accumulation planner

| Key | Row | V7 |
|---|---|---|
| `accumulation.currentAge` | Age, retiring age, pension today | Built |
| `accumulation.employerMonthly` | What you pay in, and your employer | Built |
| `accumulation.escalationPct` | Raise payments by a % a year | Planned (no V7 design yet) |
| `accumulation.isaMonthly` | What goes into ISAs and savings each month | Built |
| `accumulation.netMonthly` | What you pay in, and your employer | Built |
| `accumulation.potNow` | Age, retiring age, pension today | Built |
| `accumulation.retirementAge` | Age, retiring age, pension today | Built |
| `accumulation.salary` | How tax relief works, and your salary | Planned (no V7 design yet) |
| `accumulation.schemeType` | How tax relief works, and your salary | Planned (no V7 design yet) |

### `holdings`: holdings: what you hold (the one ledger)

| Key | Row | V7 |
|---|---|---|
| `holdings.lines` | What you hold | Designed |
| `holdings.lines[].asOf` | What you hold | Designed |
| `holdings.lines[].contribution` | What you hold | Designed |
| `holdings.lines[].kind` | What you hold | Designed |
| `holdings.lines[].name` | What you hold | Designed |
| `holdings.lines[].ocf` | What you hold | Designed |
| `holdings.lines[].sedol` | What you hold | Designed |
| `holdings.lines[].subClass` | What you hold | Designed |
| `holdings.lines[].ticker` | What you hold | Designed |
| `holdings.lines[].units` | What you hold | Designed |
| `holdings.lines[].value` | What you hold | Designed |
| `holdings.lines[].wrapper` | What you hold | Designed |
| `holdings.offerDismissed` | What you hold | Designed |
| `holdings.source` | What you hold | Designed |
| `holdings.updatedAt` | What you hold | Designed |
| `holdings.version` | What you hold | Designed |

### `household`: household: the partner's plan link

| Key | Row | V7 |
|---|---|---|
| `household.partnerScenarioId` | The partner's linked plan | Built |

### `strategy`: strategy: the plan's strategy block

| Key | Row | V7 |
|---|---|---|
| `strategy.engineVersion` | The plan's strategy block | Planned |
| `strategy.id` | The plan's strategy block | Planned |
| `strategy.lockedAt` | The plan's strategy block | Planned |
| `strategy.params` | The plan's strategy block | Planned |

### `strategyState`: stressTool.settings.strategyState[id]: one strategy's put-away inputs

| Key | Row | V7 |
|---|---|---|
| `strategyState.allocMode` | Choose the plan's strategy; switch and come back | Designed |
| `strategyState.savedAt` | Choose the plan's strategy; switch and come back | Designed |
| `strategyState.strategyParams` | Choose the plan's strategy; switch and come back | Designed |
| `strategyState.taggedFunds` | Choose the plan's strategy; switch and come back | Designed |

### `strategyParams`: stressTool.settings.strategyParams: the active strategy's dials, by strategy

| Key | Row | V7 |
|---|---|---|
| `strategyParams.bridge-and-engine.bridgeAge`: the age the bridge is bought to (default 67) | Bridge & engine | Designed |
| `strategyParams.bridge-and-engine.cashYears`: years paid from cash before the first gilt (default 3) | Bridge & engine | Designed |
| `strategyParams.bridge-and-engine.isaTotal`: the ISA total this strategy may use | Bridge & engine | Designed |
| `strategyParams.bridge-and-engine.sippTotal`: the pension total this strategy buys with (blank: the allocation's total) | Bridge & engine | Designed |
| `strategyParams.buckets-in-order.bucketBand`: how far above its path (%) a bucket must be before its surplus refills the next one (default 10) | Buckets in order | Designed |
| `strategyParams.buckets-in-order.isaTotal`: the ISA total this strategy may use | Buckets in order | Designed |
| `strategyParams.buckets-in-order.sippTotal`: the pension total this strategy buys with (blank: the allocation's total) | Buckets in order | Designed |
| `strategyParams.floor-and-flex.essentialsAnnual`: the essentials bought as a floor, £ a year before tax | Floor & Flex | Designed |
| `strategyParams.floor-and-flex.horizonAge`: the age the floor is paid to (92, 95 or 100) | Floor & Flex | Designed |
| `strategyParams.floor-and-flex.isaTotal`: the ISA total this strategy may use | Floor & Flex | Designed |
| `strategyParams.floor-and-flex.ratchet`: off; extend the floor past its end age; or raise the floor when markets boom | Floor & Flex | Designed |
| `strategyParams.floor-and-flex.sippTotal`: the pension total this strategy buys with (blank: the allocation's total) | Floor & Flex | Designed |
| `strategyParams.floor-and-flex.sleeveRate`: the share of the flex sleeve paid out each year (3% to 5%, default 4%) | Floor & Flex | Designed |
| `strategyParams.floor-and-flex.treatsRule`: treats as a share of the sleeve, or a fixed amount (the target less the essentials) | Floor & Flex | Designed |
| `strategyParams.floor-the-schedule.isaTotal`: the ISA total this strategy may use | Floor the schedule | Designed |
| `strategyParams.floor-the-schedule.sippTotal`: the pension total this strategy buys with (blank: the allocation's total) | Floor the schedule | Designed |
| `strategyParams.floor-to-age.borrowedFloor`: after a rotation: the income sold, kept to buy back later | Floor to an age, then decide | Designed |
| `strategyParams.floor-to-age.floorToAge`: the age the schedule is bought to (default 80) | Floor to an age, then decide | Designed |
| `strategyParams.floor-to-age.isaTotal`: the ISA total this strategy may use | Floor to an age, then decide | Designed |
| `strategyParams.floor-to-age.sippTotal`: the pension total this strategy buys with (blank: the allocation's total) | Floor to an age, then decide | Designed |
| `strategyParams.full-il-gilt.bridgeCash`: pension cash held to pay until the first April | Full index-linked gilt ladder | Designed |
| `strategyParams.full-il-gilt.cashYears`: years funded from cash before the first gilt (default 2) | Full index-linked gilt ladder | Designed |
| `strategyParams.full-il-gilt.isaTotal`: the ISA total this strategy may use | Full index-linked gilt ladder | Designed |
| `strategyParams.full-il-gilt.sippTotal`: the pension total this strategy buys with (blank: the allocation's total) | Full index-linked gilt ladder | Designed |
| `strategyParams.gilt-rotation.bridgeCash`: pension cash held to pay until the first April | Gilt ladder + rotation | Designed |
| `strategyParams.gilt-rotation.cashYears`: years funded from cash before the first gilt (default 2) | Gilt ladder + rotation | Designed |
| `strategyParams.gilt-rotation.isaTotal`: the ISA total this strategy may use | Gilt ladder + rotation | Designed |
| `strategyParams.gilt-rotation.rotateCutAge`: rungs paying for ages above this are the block sold in a rotation (default 75) | Gilt ladder + rotation | Designed |
| `strategyParams.gilt-rotation.rotateDisarmYears`: how many years before the sold block starts paying the trigger switches off (default 8) | Gilt ladder + rotation | Designed |
| `strategyParams.gilt-rotation.rotateTrigger`: how far shares must fall below their high to trigger a rotation, % (default 30) | Gilt ladder + rotation | Designed |
| `strategyParams.gilt-rotation.sippTotal`: the pension total this strategy buys with (blank: the allocation's total) | Gilt ladder + rotation | Designed |
| `strategyParams.ladder-and-ratchet.bandThreshold`: how far above the path counts as well above (times the path, default 1.2) | Ladder & Ratchet | Designed |
| `strategyParams.ladder-and-ratchet.drawAnnual`: the income bolted on, £ a year before tax (blank: the plan's target) | Ladder & Ratchet | Designed |
| `strategyParams.ladder-and-ratchet.isaTotal`: the ISA total this strategy may use | Ladder & Ratchet | Designed |
| `strategyParams.ladder-and-ratchet.ladderYears`: years of income bought up front with index-linked gilts (default 15) | Ladder & Ratchet | Designed |
| `strategyParams.ladder-and-ratchet.sippTotal`: the pension total this strategy buys with (blank: the allocation's total) | Ladder & Ratchet | Designed |
| `strategyParams.ladder-and-ratchet.triggerMode`: "band": sell only well above the path; "calendar": review every 5 years | Ladder & Ratchet | Designed |

### `strategies`: the nine strategies a plan can run (one key per strategy)

| Key | Row | V7 |
|---|---|---|
| `strategies.bridge-and-engine` | Bridge & engine | Designed |
| `strategies.buckets-in-order` | Buckets in order | Designed |
| `strategies.floor-and-flex` | Floor & Flex | Designed |
| `strategies.floor-the-schedule` | Floor the schedule | Designed |
| `strategies.floor-to-age` | Floor to an age, then decide | Designed |
| `strategies.full-il-gilt` | Full index-linked gilt ladder | Designed |
| `strategies.gilt-rotation` | Gilt ladder + rotation | Designed |
| `strategies.ladder-and-ratchet` | Ladder & Ratchet | Designed |
| `strategies.pots-and-valves` | Pots & Valves | Designed |

### `incomeSteps`: stressTool.settings.incomeSteps[]: one step of the income shape

| Key | Row | V7 |
|---|---|---|
| `incomeSteps[].amount` | Steps by age: "from age X take £Y a year" | Built |
| `incomeSteps[].decline` | A taper within a step: falling by a real % a year | Built |
| `incomeSteps[].fromAge` | Steps by age: "from age X take £Y a year" | Built |
| `incomeSteps[].glideToNext` | A taper to the next step: glide evenly | Built |

### `extraIncomes`: stressTool.settings.extraIncomes[]: income for some years

| Key | Row | V7 |
|---|---|---|
| `extraIncomes[].annual` | Income for some years | Planned (no V7 design yet) |
| `extraIncomes[].endYear` | Income for some years | Planned (no V7 design yet) |
| `extraIncomes[].indexation` | Income for some years | Planned (no V7 design yet) |
| `extraIncomes[].label` | Income for some years | Planned (no V7 design yet) |
| `extraIncomes[].startYear` | Income for some years | Planned (no V7 design yet) |

### `windfalls`: stressTool.settings.windfalls[]: a one-off lump sum

| Key | Row | V7 |
|---|---|---|
| `windfalls[].amount` | One-off lump sums | Designed |
| `windfalls[].label` | One-off lump sums | Designed |
| `windfalls[].mix` | One-off lump sums | Designed |
| `windfalls[].toIsa` | One-off lump sums | Designed |
| `windfalls[].wrapper` | One-off lump sums | Designed |
| `windfalls[].year` | One-off lump sums | Designed |

### `extraWithdrawals`: stressTool.settings.extraWithdrawals[]: an extra spend

| Key | Row | V7 |
|---|---|---|
| `extraWithdrawals[].amount` | Extra spends in a given year | Designed |
| `extraWithdrawals[].indexation` | Extra spends in a given year | Designed |
| `extraWithdrawals[].label` | Extra spends in a given year | Designed |
| `extraWithdrawals[].year` | Extra spends in a given year | Designed |
| `extraWithdrawals[].years` | Extra spends in a given year | Designed |

### `taggedFunds`: stressTool.settings.taggedFunds[]: one fund on the "funds to test" list

| Key | Row | V7 |
|---|---|---|
| `taggedFunds[].contribution` | Test on a list of funds | Designed |
| `taggedFunds[].ocf` | Test on a list of funds | Designed |
| `taggedFunds[].subClass` | Test on a list of funds | Designed |
| `taggedFunds[].ticker` | Test on a list of funds | Designed |
| `taggedFunds[].value` | Test on a list of funds | Designed |
| `taggedFunds[].wrapper` | Test on a list of funds | Designed |

### `potAtRetirement`: stressTool.settings.potAtRetirement: the pots at the stop, typed in

| Key | Row | V7 |
|---|---|---|
| `potAtRetirement.isa` | Pots at retirement, typed in | Planned (no V7 design yet) |
| `potAtRetirement.sipp` | Pots at retirement, typed in | Planned (no V7 design yet) |
| `potAtRetirement.source` | Pots at retirement, typed in | Planned (no V7 design yet) |

### `profile`: users/{uid}/profile/settings: per-person preferences

| Key | Row | V7 |
|---|---|---|
| `profile.lastSeenVersion` | What's new | Planned |

### `browser`: the browser's own storage (this device only)

| Key | Row | V7 |
|---|---|---|
| `browser.nextStepDismissed:` | Next-step banner | Designed |
| `browser.pt_guest_handoff` | Guest mode: three active hours, reminders, then hand-over into an account | Planned (no V7 design yet) |
| `browser.pt_guest_minutes` | Guest mode: three active hours, reminders, then hand-over into an account | Planned (no V7 design yet) |
| `browser.pt_guest_nag_level` | Guest mode: three active hours, reminders, then hand-over into an account | Planned (no V7 design yet) |
| `browser.pt_guest_scenarios` | Guest mode: three active hours, reminders, then hand-over into an account | Planned (no V7 design yet) |
| `browser.pt_lastActivity` | Sign in and out | Planned |
| `browser.pt_lastSeenVersion` | What's new | Planned |
| `browser.pt_open_tab` | Open today's app on a given tab | Planned |
| `browser.pt_v7_plan_receipt` | Save a V7 answer as a new plan | Built |
| `browser.pt_v7_plan_seed` | Save a V7 answer as a new plan | Built |

## The spending shape: not yet in V7 (7 of 24)

The parts of today's income shape, and the dated extra spends drawn on it, that the /v7/ preview does not have yet.
Each is designed; none is retired. By the owner's rule each comes before V7 replaces today's planner.

- **The picture moves from the old shape to the new one** (animateIncomeShape (src/ui/incomeShapeGraphic.js; called from renderIncomeShapePreview, index.html:8322-8350)). Designed: research/v7/spending-shape.md §15.4. Step `shape-next`.
- **The layers while you set the steps** (renderIncomeShapePreview → incomeStaircaseSvg sp / other (index.html:8322-8350)). Designed: research/v7/spending-shape.md §15.1. Step `shape-next`.
- **The budget's total marked on the picture** (incomeStaircaseSvg budgetGross (src/ui/incomeShapeGraphic.js)). Designed: research/v7/spending-shape.md §15.1. Step `shape-next`.
- **Lump sums and one-off spends marked at their ages** (incomeStaircaseSvg events (src/ui/incomeShapeGraphic.js:74-80)). Designed: research/v7/spending-shape.md §15.3. Waits for: Extra spends in a given year; One-off lump sums. Step `shape-next`.
- **"Below the income you get anyway", said while setting the steps** (incomeShapeNote (index.html:8375)). Designed: research/v7/spending-shape.md §15.2. Step `shape-next`.
- **Turn a lump sum into income** (incomeShapeLumps; window.spendLumpSum (index.html:8352-8392)). Designed: research/v7/spending-shape.md §17.3. Waits for: One-off lump sums. Step `shape-next`.
- **Extra spends in a given year** (Income streams & lump sums: + Extra spend (index.html:10636-10637)). Designed: research/v7/spending-shape.md §16. Step `shape-next`.

## Planned, with no V7 design yet

Each of these is something today's app does that no V7 document gives a place yet. By the owner's rule each one
stays (or comes back better) unless the owner agrees to retire it.

- **A ready-made example plan** (Guest example plan and the ?demo=1m link (index.html:5036-5084)). Step `s9-switch`. V7's answers on your own figures are the new way in; an example to look around has no V7 home yet.
- **Guest mode: three active hours, reminders, then hand-over into an account** (GuestMeter.js; the guest store in FirestoreService.js; the guest banner (index.html)). Step `s9-switch`. V7's answers do not count against the three hours; the audit recommends keeping that and recording it (square-one-audit.md §6 question 5). The meter itself needs a place in V7's shell.
- **Fill the blanks with typical amounts** (Budget tab: "Fill blanks with typical UK amounts" (index.html:3911)). Step `s8-e`. budget-step.md shows typical amounts as hints only, never filled in. By the rule of 2 Oct the one-press fill stays unless the owner retires it.
- **Guided walk-through** (Budget → Guided walk-through (index.html:12190-12600)). Step `s8-e`. V7's sheet covers the lines by heading on one page; the step-by-step walk-through with its tips has no V7 design.
- **Break a line into sub-items** (Budget lines "break it down" (index.html:12488-12540)). Step `s8-e`.
- **Sums in the amount boxes** (BudgetModel.evalAmountExpr). Step `s8-e`.
- **Who pays: me, partner or shared, and my share** (Budget: Sharing with a partner (index.html:3859-3883)). Step `s8-e`. V7's budget is the household's (budget-step.md).
- **Who pays, changing over time** (Budget: "Change who pays over time" (index.html:3876-3880; BudgetModel.budgetSharePctAtAge)). Step `s8-e`.
- **Export and import the budget as a spreadsheet** (Budget: Export CSV / Import CSV (index.html:3912-3913; BudgetModel.budgetToCsv, parseBudgetCsv)). Step `s8-e`.
- **Did you miss anything?** (Budget: "Did you miss anything?" (BudgetModel.missingSuggestions)). Step `s8-e`.
- **A nudge when an amount looks wrong** (Budget lines and walk-through (BudgetModel.typicalSanityFlag)). Step `s8-e`.
- **Reset, duplicate a line, undo a removal** (Budget (index.html:12024-12080)). Step `s8-e`.
- **Pots at retirement, typed in** (When your plan starts: "Or SIPP at retirement", "ISA at retirement" (index.html:3160-3161)). Step `s8-e`. A plan made from a V7 answer writes the middling pot here (PlanSeed.js); no V7 form lets the person type it.
- **Suggest a plan length from longevity** (Stress → Settings → "Suggest from longevity" (index.html:3311-3326; LongevityModel.js)). Step `s8-e`.
- **"Update this draft to today"** (Stale-draft banner (index.html:2954, 9020-9050)). Step `s8-e`.
- **An example ETF portfolio for the risk level** ("See an example ETF portfolio for this level" (index.html:3398-3401; ModelPortfolios.js)). Step `s8-e`.
- **Diversifiers sleeve: gold and trend/macro** (Your allocation: Diversifiers sleeve (index.html:3394-3397)). Step `s8-e`.
- **Bond tent** (Your allocation: Bond tent (index.html:3452-3462)). Step `s8-e`.
- **How the ISA is used** (Your allocation: How the ISA is used (index.html:3337-3343)). Step `s8-e`.
- **A taxable account (GIA)** (Your allocation: Taxable investments today (index.html:3347-3376; TaxableSleeve.js)). Step `s8-e`. answer-D.md §9.2 reads the ordinary account from a locked plan's holdings; no V7 form asks for it.
- **State Pension start date, typed from the forecast** (State Pension: SP Start Date (index.html:3550)). Step `s8-e`. V7 works the date out from age (schemaParts.statePensionAgeOf) and does not ask it.
- **How a final-salary pension rises** (Other income: DB Increases (index.html:3528-3532)). Step `s8-e`. V7's household takes all three (household.js) but the forms always say prices capped at 5%.
- **Other income or pension** (Other income: Other Income/Pension (index.html:3512)). Step `s8-e`. D designs income you have bought (answer-D.md §5.2); a general other income has no V7 form.
- **Income for some years** (Stress → Settings → Income streams & lump sums (index.html:3535-3545, 10635-10641)). Step `s8-e`. Only part-time work from the stop is asked in V7 (row above).
- **Tax thresholds** (Stress → Settings → Tax thresholds (index.html:3476-3500)). Step `s8-e`. V7 uses today's bands (toEngine.js BANDS) and they cannot be changed.
- **Thresholds rise with prices, or stay frozen** (Tax thresholds: Tax Threshold Mode (index.html:3492-3497)). Step `s8-e`.
- **Tax-free part for some years, then the rest into the ISA** (How you'll take this pension: UFPLS for how many years (index.html:3002-3014)). Step `s8-e`. F's "tax-free cash and which pot first" is the decision page (rail-screens-language.md §1.5); the plan's own setting needs E.
- **Fill the basic-rate band and recycle into the ISA** (How you'll take this pension: band fill (index.html:3016-3025)). Step `s8-e`. No test plan uses it yet (square-one-audit.md §4).
- **Bed-and-ISA £20,000 a year** (Your allocation (index.html:3377-3380)). Step `s8-e`.
- **Relevant UK earnings** (Your allocation: Relevant UK earnings (index.html:3365-3370)). Step `s8-e`.
- **Cuts in a slump** (Stress and Decision → Settings → Protection (index.html:3584-3611; ProtectionStrategy.js)). Step `s8-e`. V7's answers run with cuts off (save-as-plan.md §C.3).
- **Emergency reserve ("Break Glass HODL")** (Stress → Settings → Break Glass HODL (index.html:3613-3630)). Step `s8-e`. No test plan uses it yet (square-one-audit.md §4).
- **What a ladder or floor costs today, against your pot** (refreshStrategyCosts (index.html:9729-9796)). Step `s8-e`. Part of each strategy's dials in E's "compare" step; no V7 design draws it.
- **A page for each strategy** (Strategies → one page per strategy). Step `s8-e`. E's outline names "compare" but no V7 design draws a page per strategy.
- **"What is this doing?"** (Stress → Monte Carlo, Historical, Scenarios: "What is this doing?" (openStressExplainer)). Step `s8-e`. V7 says what each answer assumed (src/v7/components/Assumed.jsx); an explanation of each test needs E.
- **Compare allocations and apply the best split** (Stress → "Compare allocations (Pots & Valves)" (index.html:6683-6834)). Step `s8-e`.
- **Drawdown schedule and the ISA bridge table** (Stress → Drawdown (index.html:2882, 7168, 13216-13240)). Step `s8-e`. A's "What pays the bills before my State Pension starts?" (rail-screens-language.md §1.5) is a summary, not built.
- **The glidepath picture** (Stress → Glidepath (index.html:2925-2945)). Step `s8-e`.
- **How tax relief works, and your salary** (Accumulation → How relief works; Salary (index.html:3682-3692; AccumulationEngine.contributionBreakdown)). Step `s8-e`. V7 takes what lands in the pension, the tax added back included; it does not ask how relief is given.
- **Raise payments by a % a year** (Accumulation → Raise contributions by (index.html:3700)). Step `s8-e`.
- **A projection at your own holdings' mix** (Accumulation → Projection: Your mix (6.7.0)). Step `s8-e`. V7 projects at a risk level while saving (savingRisk).
- **Reset a tool's settings to the defaults** (Stress and Decision → Settings → Reset to Defaults). Step `s8-e`.
- **Administration** (Header gear (index.html:12840-12900)). Step `s9-switch`. Owner only; could stay on the previous version's page.

## Retired, and why

- **Headroom on top of the budget**: The spending figure is now always your own, with the budget as a guide beside it (owner, 1 Oct 2026), so there is no budget total to add a margin to: type the figure with the margin you want. Owner: to confirm (follows from the rule of 1 Oct 2026 that the budget is a guide; budget-step.md).
- **Whether a line's panels were left open**: Screen state saved with the line by accident, not a setting: V7 keeps open panels in the screen itself. Nothing a person set is lost.
- **Copy settings between the two tools**: V7 keeps one plan and tries changes without saving them (rail-screens-language.md §1.6), so there are no two tools to copy between: every figure the copy carried is in the one plan. Owner: to confirm.
- **Where a copy came from**: Belongs to "Copy settings between the two tools" (retired with it, once the owner agrees); old plans keep these keys untouched.
- **Which tools a plan shows**: V7 has no tool tabs: the rail shows the steps the plan's stage needs, so there is nothing to switch on or off. Owner: to confirm.
- **The old "Declining with age" spending profile**: Retired in 6.2.1: "Declining with age" became a slope on the income steps, with the same figures; old plans are folded in when opened. The taper itself is kept: in V7 it is the preset "Slowly less" (src/answers/shared/shape.js slowlyLess, today's smileToSteps).
- **Old names of the three pot floors**: Renamed before 6.15.0 to equityMin, bondMin and cashTarget; kept beside the new names on old plans and read only to fill a missing new one.
- **Copies under dotted names**: Never a setting: copies a storage fault wrote, folded back into the plan when it is opened.
- **riskMode on the example plan**: Read by nothing in today's app; the example plan's allocMode carries the same thing.
- **The Decision tool's old start date**: Read by nothing; the plan's start is its first tax year (design/settings-model.md lists it as a dead field).
