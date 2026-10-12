# Today's planner, made much more usable: an audit for V7 (12 Oct 2026)

Written against PensionTools 6.22.0 and the /v7/ preview. "The planner" (V6) is the live app; "V7" is the preview.

## How this was done

Four audits drove a built copy of the whole site in a headless browser on 12 Oct 2026:

- **As a guest only.** There was no sign-in, and every outside request was blocked.
- **At two widths:** 1280 px (desktop) and 390 px (phone).
- **Over every screen and setting**, in four areas:
  - ways in, Budget and Household;
  - Stress settings and Strategies;
  - results, the lock, the plan document and the Decision tool;
  - Accumulation, Transition, guest mode and the V7 preview.

The tour and the setup wizard need an account, so they were read from the code instead.

The audit builds on these documents and does not repeat them:

- square-one-audit.md
- parity-ledger.md
- the September QA notes
- the August persona tests
- ux-flow-plan-aug-2026.md
- v7-plan-of-plans.md §9–10
- household-draw-split.md

No product code was changed.

**Reading it.** Sections 1, 3, 4 and 5 are the core, about 15 minutes. Section 2 goes area by area, for reference.

**Your aim (12 Oct):** "think it through from the point of view that we are improving V6 and making it much more
usable. Look at V6 completely." The standing rules still apply:

- V7 is not "easy start wizards" to V6.
- Every V6 option is in V7 at least as fully.
- Plain English.
- The budget is a guide.
- Couples see the tax saved by drawing together.

## The short answer

**Is V7 on course to be V6 made much more usable? Partly.**

**What V7 already fixes:** the first ten minutes.

- Six questions fit on the first phone screen.
- You get an answer on your own figures in seconds.
- Money is after tax, dates are ages, and a partner can be added on the first screen.
- There is one verdict ("lasts in 9 futures out of 10"), in plain words.

**What it does not fix yet:**

- Every V7 path still ends in the planner's Stress settings form, which has about 50 controls.
- The next agreed step, "Your plan", only *shows* a plan; every change is still made in the planner.

On that road, V7 stays "easy start wizards to V6" until E, near the end.

**Where the worst problems are:** in the planner's editing screens, not its front door.

- One fact is typed into up to six boxes.
- Before-tax and after-tax figures are mixed.
- Dates are "plan years".
- One plan gets six different answers.
- A couple never pools its money.

These go only when the editing moves into V7. So the main change I recommend is the **order of work** (section 4,
decision 1):

1. a week of fixes in the planner;
2. one answer per plan;
3. "Who draws what" for couples;
4. "Your plan";
5. then the planner's editing moved into V7, one step at a time, **before** question D.

---

## 1. The ten biggest usability problems, ranked

Ranked by harm: contradictory numbers first, then hidden settings, then confusion and slowness.

**1. One plan gives many different answers.**

- **The guest example plan (Pots & Valves)** gives a different chance of lasting on almost every screen:
  - Monte Carlo tab: 90%
  - Historical tab: 100%
  - Strategies ranking: 86%
  - its own strategy page, and the plan document: 93% (the document claims it was "run exactly as the Monte Carlo
    tab runs it")
  - Try a strategy, with nothing changed: 96%
- **A saver made in V7** (45, £180,000, paying £800 a month, spending £2,500 a month from 60):
  - V7: the money lasts in 4 of 10 futures.
  - The same plan in the planner: 21% on the Monte Carlo tab, 7% at 60 under "When could I retire?".
- **A couple:** 6 in 10 in V7, 5 in 10 in the save dialog, 44% on the Household tab.
- **Why the numbers differ:**
  - two different histories;
  - cuts in a slump on in some places and off in others;
  - Try capped at 35 years (index.html:6475);
  - "worst" meaning the worst of 1,000 futures in some places and the worst 1 in 10 in others;
  - fixed growth rates for savers in the planner, but V7's saving engine in V7.

Nobody can tell which figure is their plan's.

**2. The same fact is typed in many places, and the copies disagree.**

- **How many places:**
  - the pension pot: 8 boxes;
  - the ISA: 6;
  - the plan's length: 6 (4 of them on result tabs, never saved);
  - ages: 5 places.
- **Ages:** the example's Budget says 45 and retiring at 60, while its Stress settings say 56 and already retired.
- **Pots:** I typed a saver's £180,000 into Accumulation while Stress still held £1,000,000.
  - Stress put the pension at 60 at £1.35M–£1.5M, and its Monte Carlo tab said 99%.
  - Accumulation said "short by £566,964".
  - After the lock, the document said "Priced on £1,000,000", while Transition said "buy £1,046,731 of shares".
- **Pasted holdings:** pasting £282,550 of holdings set the pot to £97,300, the recognised funds only
  (index.html:8797).
  - A common Vanguard tracker was "not recognised".
  - There is no way to say what it is.

**3. Before and after tax are mixed, and dates are "plan years".**

- **Before and after tax**
  - The landing page promises "Everything works in take-home terms … No gross-salary puzzles".
  - The budget is after tax, a month. The income shape is before tax, a year. To get £2,500 a month you guess:
    £36,000 gave £2,610.
  - Household "NEEDS", "Where you are" and the plan document are before tax.
- **Plan years instead of ages**
  - I typed 65 into the final-salary start, "plan year, 0 = now". It was saved, and the pension never arrives, with
    no warning.
  - Income streams, lump sums and the survivor and care checks are in plan years too.
- **Money in two kinds of pounds:** the Drawdown table is in future pounds, everything else in today's.

**4. Settings that change the answer are hidden, split or buried.**

- **Hidden.** Choosing any of the seven "bought" strategies hides six settings: plan length, charges, ISA growth,
  the taxable account, earnings and bed-and-ISA. The engines still use them (stressTest.js:134, :79;
  ladderEngine.js:155).
- **Split.**
  - Dials are split between Settings and each strategy's page, with different defaults: one floor age is 92 in one
    place and 95 in the other.
  - There are four ways to switch strategy.
- **Buried.**
  - The form has 73 visible controls over 4,129 px (8,794 px on a phone), with Save at the foot.
  - Typing a State Pension date quietly moved my retirement from October to May.

**5. The lock is hard to find, happens by accident, and is easy to spoil.**

- **Hard to find.** The lock button is 4,480 px down a 4,588 px page.
- **By accident.** On the unlocked retired example, recording one month locked the plan with no question.
  - It locked on the Decision tool's defaults (£500,000, a £31,200 "target salary", 35 years), not the plan's £1M and
    £40,000.
  - No document was written.
  - Since 6.20.2 only savers are asked first.
- **Easy to spoil.** "Refresh the document" retakes the committed snapshot in one tap, with no confirm.
- **Too rigid.** Changing how often you draw needs an unlock.
- **Missing and wrong in the document.**
  - It leaves out the rules for cutting income.
  - It mentions "the ladder's rungs" on a plan with no ladder.
  - It gives State Pension age 68 where the Monte Carlo tab says 67.

**6. The first ten minutes: a stranger's plan, the wrong page, dead ends.**

- **A stranger's plan.**
  - "Just try it" opens someone else's £1M retired plan.
  - It opens on a nine-column ranking that starts with an "Estrada volatility-adjusted coverage ratio".
  - A guest may keep one plan only, so trying their own figures means overwriting it.
- **Hard to get started.**
  - On a phone, the landing page's buttons are two and a half screens down.
  - The setup wizard demands a retirement age, and offers "Decide this month's withdrawal" to savers.
- **The wrong page.**
  - Returning visitors land on the Decision tool, whatever their stage.
  - The retired example is told "Start here: walk through what retirement will actually cost".
  - ✕ hides all later guidance for good.
- **In V7.**
  - "Answer everything in full" says "not in the preview yet".
  - Saving asks for the name twice, then lands on the settings form.

**7. The results hide the income cuts and the bad case.**

- **Monte Carlo tab.**
  - It says "Very likely to last — 90%".
  - Lower down: "69 in 100 futures where income was actually cut", with no word on how much or how long.
- **Historical tab.** It says 100%, yet a 1966 start had 375 of 468 months cut, marked "OK".
- **Scenarios tab.** It says FAILED in 4 of 5 cases.
- **The worst case.** "Worst simulated future" is the worst of 1,000, not the worst 1 in 10 you chose.
- **A cut month in the Decision tool.** It says "Protection Mode … Why? Protection". It never says:
  - that the cut was £333;
  - why it happened;
  - when it ends;
  - that the money is made up later.

**8. Couples are two separate plans, and drawing together is invisible.**

- **Hard to set up.** Five steps across three tabs, and guests can't use the tab at all.
- **Named by plans, not people:** "If Stop at 60 and 57 · £5,800 a month · partner dies".
- **No pooling.**
  - "Both together" counts only futures in which each plan lasts on its own.
  - So one partner's money never pays the other's share.
  - A test couple read 25% and 40% alone, and 25% together.
- **No tax advice worth having.**
  - Drawing together saves about £12,800 a year in the design's example.
  - The app shows one line about year 0, and the line was missing for a V7-made couple.
  - Its advice changes nothing.
- **Two budgets that disagree:** £980 and £0 a month.
- **"vs PLSA (couple)"** compares one share with a whole household's standard.
- **A bug:** a blank "who pays over time" row counts as a 0% share (BudgetModel.js:306-315).
- **V7 makes it worse:** it splits a couple's spending by pot size, which pushed one partner into the 40% band.

**9. The budget promises what the plan never does.**

- **Promises that never happen.**
  - "Who pays over time … follows this automatically" is false.
  - Age bands ("mortgage ends at 63") never lower the plan.
  - One-off costs never reach it. The function that would do it is imported and never called (index.html:4127).
- **A silent overwrite.**
  - "Use as the start of my income shape" replaced the example's £40,000 with £30,818, with only a toast and no undo.
  - It also rewrote the Decision target and the Floor & Flex essentials.
- **A false alarm.** An empty budget says "below the Minimum".
- **Too long on a phone.** The tab is nearly ten screens. V7's budget step is worse: 11.8 screens and 186 controls.

**10. Expert words, and screens built for a desk.**

- **Jargon.** V7's banned-words check flags 136 phrases in the plan document, 34 in the tax-year wizard and 33 on the
  Monte Carlo tab. Examples: UFPLS, BRL, "Protection Multiplier 0.8", "Break Glass HODL", "target salary".
- **Out of date.** The planner says "six strategies" (there are nine) and mentions the abolished lifetime allowance.
- **On a phone:**
  - the ranking is 1,476 px wide;
  - the Stress sub-tabs push Settings off screen;
  - the monthly recommendation cuts off the Cash pot;
  - the life stage shows only as a 2-px underline.

---

## 2. Area by area: what is hard, and how V7 does it better

Every option keeps a V7 home at least as full as today's. Step names are from section 3.

### 2.1 Ways in: landing page, guest mode, tour, setup wizard

**What is hard** (besides problem 6)

- Guest wording contradicts itself:
  - "nothing saved" beside "Saved ✓";
  - a guest is offered Delete Account;
  - Reset as a guest shows "Welcome, Guest! Your account is set up".
- The wizard has no saver's door and no "my income starts next April".
- The wizard says the budget "drives everything else".

**How V7 does it better**

- **The front door replaces the landing page, tour and wizard.**
  - The six questions come first.
  - The trust lines (free, beta, not advice) sit below them.
  - "Already have plans? Your plans" sits at the top.
- **The wizard's jobs move into each question's first step:**
  - ages, asked once;
  - "I have no age in mind — show me ages";
  - B as the saver's door;
  - "my income starts next April" in D and E;
  - the plan's name, asked once.
- **The example plan becomes read-only**, behind "Look around an example" (decision 7).
- **One rule for guests:** "Kept in this browser window until you close it. Make a free account to keep it for good."

### 2.2 Your plans, stages and "what next"

**What is hard**

- **The plan menu** is icons only (✎ ⚙ ×).
- **Plans can't be reopened or compared.** You can download a plan but never open it again, or compare two.
- **New plans** replay the whole tour.
- **The stage** shows only as a word on the chip ("draft", "run-up") and an underline.
- **There is no account page:** no way to change your email or password, and no way to download everything.

**How V7 does it better**

- **"Your plans"** (your-plan.md §1.2) groups plans as "Your household", "Other plans" and "Kept in this window".
- **Actions in words:** Open, Rename, Make a copy, Download, Delete.
  - New: **Open a downloaded copy**.
  - New: **Compare two plans**.
- **The stage is the plan's first line:** "Still saving. Stopping work in June 2041." with "That's wrong — change it".
- **The next sentence follows the stage**, and the budget never blocks it.
  - "Not now" closes one sentence, not all of them.
  - The sentence comes back when the stage changes.
- **An account page:** email, password, "Download everything", "Delete my account", and the privacy policy.

### 2.3 Budget

**What is hard** (besides problem 9)

- **Words differ between the apps.**
  - The budget keeps its own copy of the ages.
  - It says "floor", "headroom" and "PLSA".
  - V6 says "Minimum" where V7 says "Basic".
  - V6 sets one-offs by age; V7 by calendar year.
- **Slow to fill in.**
  - The walk-through needs one tap per typical amount.
  - "Fill blanks" fills 33 lines with only a toast.

**How V7 does it better** ("What you spend", and in questions A, B and D)

- **Three doors.**
  - Keep V7's two: line by line, or one figure (with its skip note).
  - Add **"Walk me through it"**: the same sheet, one heading at a time.
  - Each heading has a tip, "Use the typical amounts for this heading", "Often forgotten", and the total.
- **Controls in words:**
  - "a month / a year";
  - "Only for some ages…", filled in from the plan's ages;
  - "Split into parts";
  - "Remove", with Undo;
  - sums still work.
- **On a phone, headings fold** ("Home £612 a month ▸").
- **The budget reaches the plan only when you choose.**
  - A dashed line on the spending chart shows what the budget says you spend at each age, with "Use these steps".
  - One-off costs come with "Add these to your plan".
  - "Use £2,264 a month" says what it replaces, has Undo, and obeys the lock.
- **A "More" menu** holds the spreadsheet in and out, and "Start again".
- **Couples share one household budget**, with "Keeping money separate?" as an option.

**V7 has:**

- the two doors and the skip note;
- eight headings;
- typical amounts shown, never filled in;
- the national levels;
- one-off costs;
- "Use £X a month".

### 2.4 Drawdown planner settings (today's Stress tester → Settings)

**What is hard** (besides problems 2, 3 and 4)

- Fund-list mode hides the taxable account and the ISA.
- The tax note "SIPP Draw = Target − Other − SP" is wrong when the ISA is held back.

**How V7 does it better:** each fact is asked once, by age, after tax, in today's money, in these steps of "Your plan".

| Step | Asks |
|---|---|
| About you and when | Ages; stopped, or stopping at an age or month; "income starts now / next April"; plan to age N, with "Suggest from how long people live" |
| Money that comes in anyway | State Pension: full, forecast or none ("assumed £11,973 from 67" shown wherever it is used). Each final-salary pension: its **start age** and how it rises. Other pensions. Income for some years and expected lump sums, by age |
| What you spend | V7's spending shape (built, at full parity). One-off costs at an age. The before-tax figure is shown, never asked |
| Your pots and tax | Pension: "about £X at the day you stop, bad case £Y — or type your own". ISAs and how they grow. The ordinary account. Charges. Tax bands. The tax-free part. Each tax option says "saves about £X over the plan" |
| Way of drawing and mix | See 2.5 |

A setting a strategy ignores says "not used by this way of drawing". Nothing that changes the answer is hidden.

**V7 has:**

- ages asked once;
- couples;
- spending at parity (6.21.0);
- charges;
- savings growth;
- final-salary pensions by age;
- the saving engine;
- "What we assumed", with Change.

### 2.5 Results and the strategies

**What is hard** (besides problems 1 and 7)

- **The score ranks the full ladder (£84k left) above Floor the schedule (£1.08M left), on "bumpiness" alone.** People
  will read that as advice.
- **The gilt order sheet** is sized on a State Pension nobody entered.

**How V7 does it better**

- **One answer** (decision 2): the plan's own cuts, its full length, and the bad case as the worst 1 in 10.
- **"Does it last?" comes in four parts:**
  1. **Will it last?** A sentence such as: "Your plan pays £2,876 a month after tax (£3,333 before tax) until you are
     95. It lasts in 9 futures out of 10. In a bad case (the worst 1 in 10) your income is cut by up to £333 a month
     for about 3 years." Then "What it is made of", by age.
  2. **How often is your income cut, and by how much?** The five cut dials and the emergency reserve, as things to try.
  3. **What if you had retired into a bad time?** Named start years. The worst decades are kept as "an unfair test",
     never "FAILED".
  4. **Year by year.** One table by age, before and after tax. It replaces Drawdown and Glidepath.
- **Way of drawing:**
  - all nine strategies, listed by how many futures out of 10 each lasts, as cards on a phone;
  - the score kept under "More columns";
  - opening a strategy shows **all** its dials, with one set of defaults;
  - one button: "Use this way of drawing".
- **Mix:**
  - a risk level, or your own split;
  - extras, each with "what it does in a bad case";
  - "Which mix lasts best?", with your own split as the first row.
- **Try a change:**
  - every field of today's Try, over the full length;
  - "What's different" lists exactly what changed;
  - then "Keep as a separate plan" or "Use this".

**V7 has:**

- the verdict and the 9-in-10 bar;
- sentences built from the figures;
- "What it is made of", "What we assumed" and "Try a change".

The cuts part is new work: V7's answers run with cuts off.

### 2.6 The lock, the plan document and "Where you are"

**What is hard** (besides problem 5)

- **"Where you are" compares unlike things.** It sets £19,000 taken so far against "£3,333 a month planned", and
  never mentions the £1,000 lost to cuts.
- **Retired people see a countdown.**

**How V7 does it better**

- **"Lock the plan" is a step near the top of every unlocked plan.** A, B and D end with "Lock this plan?". The step
  says three things:
  - what the lock fixes;
  - what stays changeable: records, holdings, the budget, and how often you draw;
  - what you get.
- **It is the only way to lock.** A first monthly entry asks first (decision 3).
- **"Your plan as locked" opens on sentences:**
  - money before and after tax, by age;
  - the State Pension, and whether it is assumed;
  - the bad case;
  - **the rules for cutting income**.
- **"Refresh" becomes "Write a new version from today's settings"**, with a confirm.
- **"Where you are" compares like with like:** "£19,000 taken; the plan said £20,000 for those months; £1,000 less
  because income was cut." It shows dates, never a countdown.

### 2.7 Month by month (today's Decision tool)

**What is hard**

- **Monthly entry asks for totals by type**, which no platform shows. A ladder plan has to add up 22 lines.
- **The six-screen tax-year wizard:**
  - asks for tax bands the app already knows;
  - says "target salary";
  - says "0 years until state pension" (open since August).
- **Plan vs actual** compares two months with a whole year.

**How V7 does it better.** 7.0 may keep this screen (your 2 Oct decision). So fix it there first, then rebuild it as
"This month".

- **Ask what a platform shows** (decision 10).
- **Answer with an instruction.** For example: "Take £3,000 before tax from your cash fund; about £2,786 reaches your
  bank. That is £333 less than planned because your shares have been below the plan's floor for 3 months."
- **Set up the tax year on one screen.** Ask only what the app cannot know.
- **Records compare the same months**, and show each cut month's cost in pounds.
- **Couples get one "This month"** for both plans.

### 2.8 Saving years (today's Accumulation tab)

**What is hard**

- **Copies.** The age and pot here are copies of other tabs, and they disagree.
- **Lost work.** Typed figures are lost on reload unless you press Save, though the pot record on the same page saves
  at once.
- **Two projections.** Fixed growth rates give one person's pot at 60 as £385,270 here and £448,029 in their saved
  V7 plan.
- **A target that doesn't exist.** "Am I on course?" names a "budget-derived target" when there is no budget.

**How V7 does it better**

- **"What you pay in"** is B's first step, already built. It asks:
  - your part and your employer's;
  - ISA saving;
  - risk while saving;
  - charges;
  - whether the £10,000 limit after drawing applies.
- **Kept behind "More detail":**
  - salary;
  - how tax relief works, with "each £1 costs you 38p" and the higher-rate reclaim;
  - a yearly rise in what you pay in;
  - the allowance warnings.
- **One saving engine** everywhere, including the locked path.
- **New homes for today's three panels:**
  - A's "ages side by side" replaces "When could I retire?";
  - B's options replace "Am I on course?";
  - "This month's pot" holds the pot record.

### 2.9 What you hold, and the move (today's Transition tab)

**What is hard**

- **A saver locked 15 years out is told to start now.** The screen says "Next: buy Shares (£1,046,731)" and sets out
  bond purchases from now, in 60 quarterly tranches, with "180 months to go".
- **Pasted lines it doesn't recognise drop out.** The paste says "pick a category after applying", but nothing lets
  you. Unrecognised lines silently drop out of the counts.
- **Nothing says whether the move is optional.**

**How V7 does it better**

- **Every pasted line counts.** An unrecognised line asks "What is this?" (shares, bonds, cash, gold and trend, don't
  know).
- **"Moving to your plan's mix" says what it is:** "Optional. Skipping it means what you hold may not match what the
  plan was tested on."
- **A saver sees where new money goes, never "buy now",** until about five years before they stop.
- **The order sheet waits** until the person's own State Pension forecast is in.
- **The overdue design for this step comes first.**

### 2.10 Couples (today's Household tab)

**What is hard** (besides problem 8)

- **Results are lost when you leave.**
- **Figures are falsely exact.** For example: "about £1,195,283".
- **The survivor and care checks** run 500 futures against the headline's 1,000.

**How V7 does it better**

- **One household:** two linked plans, two optional names, and one budget, with "Keeping money separate?" as an
  option.
- **The pooled verdict comes first:** when one pot is empty, the other pays, as V7 already does for couples who stop
  apart. Each pot on its own is the second line.
- **New step: "Who draws what?"** (household-draw-split.md).
  - "Drawing together saves about £12,800 a year in tax."
  - Then what it costs the smaller pot, and "This is your choice; neither is wrong".
  - Limits you can set.
  - "Use this split", which makes copies if a plan is locked.
- **Survivor and care questions, asked in ages:**
  - "If [name] died at 70…";
  - "care from 85 for 3 years";
  - the same 1,000 futures as the headline.
- **Guests can use all of it.** The last result is kept, dated.

---

## 3. The shape of V7: the planner, made much more usable

### 3.1 Seven rules

1. **Each fact is asked once**: by age, after tax, in today's money.
2. **One plan, one answer**: how many futures out of 10 it lasts, a bad case (the worst 1 in 10), and the money
   left. Other views explain this answer; they never compete with it.
3. **The plan at the centre.** You land on "Your plan", with a step list for your stage. Questions are ways in, and
   each one ends in a plan.
4. **Nothing that changes the answer is hidden.** Detail sits behind "More detail", or is marked "not used".
5. **A couple is one household**: one budget, one verdict first, and who draws what as a choice you can see.
6. **Locking is a step you choose**, and it says what it fixes.
7. **Phone first**: no sideways scrolling, no meaning kept in a tooltip, and cards instead of wide tables.

### 3.2 A step list for each stage

- **The stage is worked out**, never asked. It comes from the planner's own rules (`deriveStage`).
- **Bold** marks the step a plan opens on.
- **Optional steps say so**, and no step is ever blocked.

| Stage, in V7's words | Steps, in order |
|---|---|
| Still saving | **What you pay in**, This month's pot, Your plan, Does it last?, What you spend, Lock the plan, What you hold, Your household |
| Stopping work within five years | **Your plan**, Does it last?, Way of drawing and mix, What you pay in, What you spend, Lock the plan, What you hold, Moving to your plan's mix, Your household |
| Plan locked, still working | **This month's pot**, Where you are, Your plan as locked, What you pay in, What you spend, What you hold, Moving to your plan's mix, Your household |
| Retired, plan not locked | **Your plan**, Does it last?, Way of drawing and mix, What you spend, Lock the plan, What you hold, Moving to your plan's mix, Your household |
| Retired, plan starts in April, or living on it | **This month**, Where you are, Your plan as locked, Set up the tax year (when due), What you hold, Moving to your plan's mix, What you spend, Your household |

**On every rail:**

- "Try a change" (never saved; works on locked plans too);
- "Ask a question";
- "What next?".

"Your plan" opens into the steps of 2.4. It always carries "Everything else this plan uses" (your-plan.md §2.5), so
no saved setting is ever invisible.

### 3.3 The questions as ways in

| Question | Ends in |
|---|---|
| A. When can I afford to stop? | "Your plan", then "Lock this plan?" |
| B. Am I saving enough? | "What you pay in" |
| C. I've got £X: what is that a month? | "Your plan" |
| D. I'm retired: will it last? | Your own plan, at "Does it last?" |
| E. Test my plan | **Is** the "Your plan" steps (no separate wizard) |
| F. One decision | A page per decision, after 7.0 |

Two endings change:

- "Answer everything in full" becomes "Keep and carry on in full".
- "Save this as a plan" asks the name once, then opens "Your plan", never a settings form.

### 3.4 Where every V6 function goes

| V7 place | Takes over |
|---|---|
| Front door | Landing page, "Just try it", the example (read-only), the wizard's doors |
| Your plans; the account page | Plan menu (switch, rename, copy, delete, download), **open a downloaded copy**, **compare two plans**, guest plans, Reset, sign-in, delete account, What's new |
| Top of every plan | Life stage, chip, banner, journey dates, "update this draft to today", arrival check |
| About you and when | All the ages, Timing, the 6 length boxes, longevity, pots at the stop |
| Money that comes in anyway | State Pension, final-salary pensions, other income, income for some years, lump sums, the 2028 note |
| What you spend | The whole Budget tab; the income shape (steps, tapers, glides, go-go suggestion, layers); extra spends; Floor & Flex essentials |
| What you pay in; This month's pot | The whole Accumulation tab |
| Your pots and tax | Pots, ISA use and growth, taxable account, charges, earnings, bed-and-ISA, tax-free part, band fill, tax bands |
| Does it last? | The Monte Carlo, Historical, Scenarios, Drawdown and Glidepath tabs; cut dials; emergency reserve |
| Way of drawing and mix | The Strategies tab, nine strategy pages and their dials, costs, risk level, custom split, funds to test, diversifiers, bond tent, optimiser |
| Try a change | Try a strategy; "Try in a copy" |
| Lock; Your plan as locked; Where you are | Lock, unlock and archive, plan document, PDF, past versions, saver path |
| What you hold; Moving to your plan's mix | The whole Transition tab, order sheet, rotation watch |
| This month; tax year; records | The Decision tool; its separate settings fold into the plan |
| Your household | The Household tab, survivor and care checks, budget sharing, **Who draws what** |
| Retired, if you agree (decision 9) | Welcome tour, old per-tool wizard, Edit Tools, budget headroom, Copy between tools |

### 3.5 What V7 has, and what V7 itself still gets wrong

**Built and good:**

- **The front door:** it fits a phone, and answers need no account and come in seconds (C about 6 s, B 7, A 15).
- **Answers in sentences**, the 9-in-10 bar, and the bad case as the worst 1 in 10.
- **Three ways to open up an answer:** "What it is made of", "What we assumed" and "Try a change".
- **Couples** on the first screen, including couples who stop at different times.
- **Spending at parity**, with the budget as a guide.
- **Two checks:** the banned-words check and the parity-ledger test.

**Designed, not built:** "Your plans", "Your plan", the stage rails, E's outline, and "Who draws what".

**V7's own problems:**

- **Long on a phone.** The budget step runs to 11.8 screens, because every line repeats "a month / a year /
  Essential / Remove". B's answer runs to 6.2 screens.
- **A dead end.** "Answer everything in full" has no page yet.
- **Saving asks for the name twice.**
- **Couples are split by pot size**, with no word about tax.
- **Words that don't match the planner:** "Basic" against "Minimum", and calendar years against ages.

---

## 4. A revised road to 7.0

**The 2 Oct order:** V7 opens saved plans, then D, then E one section at a time, then 7.0.

**What this audit changes:**

- fix the planner's wrong numbers now;
- give each plan one answer before V7 shows any figure;
- move editing into V7 straight after "Your plan", before D.

Sizes are rough weeks of focused work.

| # | What | What a person gets | Size |
|---|---|---|---|
| 1 | **Fix release in the planner (6.22.x)**, listed below | No false promises or silent overwrites; a first month asks before locking; Try uses the full length | about 1 week |
| 2 | **One answer per plan** (decision 2) | The same "will it last" everywhere, including the document and V7 | 1–2 weeks |
| 3 | **Who draws what, and a pooled verdict, in the Household tab** (decision 5); the rule built once in `src/services` | Couples see the tax saved, its cost to the smaller pot, and a household verdict | 1–2 weeks |
| 4 | **"Your plans" and "Your plan" in V7, read-only** (decisions 11–15) | Your own plan, at your stage, with one next sentence and every setting in words | 2–3 weeks |
| 5 | **Editing in V7, one step at a time** (decision 1): About you and when; Money that comes in anyway; What you spend; Your pots and tax; Does it last? | Each fact typed once, by age, after tax. As each step lands, that part of the old form leaves the person's path | 6–8 weeks |
| 6 | **Lock as a step; "Your plan as locked"; "Where you are"** | Locking understood, chosen and summarised | 1–2 weeks |
| 7 | **D** opens the retired person's plan at "Does it last?" | The retired re-plan, with no hand-over code | 1–2 weeks |
| 8 | **Way of drawing, mix and Try a change** | Nine strategies compared on a phone, in plain words | 4–5 weeks |
| 9 | **Your household in V7** | Couples as one household | 2–3 weeks |
| 10 | **What you hold, and the move** (design first) | Funds you can name; a move that makes sense for savers | 2–3 weeks |
| 11 | **Switch to 7.0:** plan actions, account page, guest meter, What's new, the "Drawdown Planner" name; Month by month stays on today's screen, with its fixes | One app, at least as full as V6 | 3–4 weeks |
| after | Month by month rebuilt; F; property and equity release; annuities; trust pages | | |

**Step 1 in full.** These are fixes, which the frozen planner allows.

- **Budget:**
  - the blank-row bug;
  - household compared with household;
  - the three false promises removed;
  - the income-shape button asks first, has Undo and writes only the figure (decision 6).
- **Settings:**
  - the final-salary start checked;
  - "assumed" beside the order sheet's State Pension;
  - the strategy counts corrected;
  - bought strategies show the settings they use.
- **Results and the lock:**
  - Try's 35-year cap removed;
  - a confirm before "Refresh";
  - UK dates;
  - a first month asks before locking (decision 3);
  - how often you draw stays editable (decision 4);
  - the document's words follow the strategy.
- **Visitors:**
  - clear guest wording, with no Delete Account for guests;
  - the paste says what it left out;
  - a link to the preview (decision 8).

**Overall:** about 25–35 weeks to 7.0, in line with the plan of plans' 30. D comes later but is smaller. People see the
planner's worst problems go in steps 1–5.

---

## 5. Decisions only you can make

Each stands on its own. The first two set the order.

**1. Move the planner's editing into V7 straight after "Your plan", before question D.**

- *About:* The agreed order has V7 showing plans read-only, with every change made in the planner, then D, then E.
  So for months every V7 path ends in the planner's settings form: the "easy start wizards to V6" you said V7 must
  not be. The worst problems stay until E: one fact in many boxes, before-tax and after-tax figures mixed, plan
  years.
- *The choice:*
  - (a) After "Your plan", build its parts as V7 editing screens, in this order: About you and when; Money that comes
    in anyway; What you spend; Your pots and tax; Does it last? Each writes the same saved settings as today, so the
    data model does not change. D becomes a thin question that opens the retired person's own plan.
  - (b) Keep the order: D, then E.
- *Recommendation:* (a).
- *If (b):* D needs its own copies of these screens and a hand-over, and the problems stay until near the end.

**2. One "will it last" answer per plan.**

- *About:* One plan shows 90%, 100%, 86%, 93% and 96% on different screens. The causes are two histories, cuts on in
  some views and off in others, a 35-year cap, and two meanings of "worst".
- *The choice:*
  - (a) Every figure comes from the one stress test all nine strategies use, with the plan's own cuts and full length.
    - The Monte Carlo tab's separate path (5-year blocks of 1928–2024) is retired or made identical.
    - Historical and Scenarios become explanations, with no rival percentage.
    - The bad case is the worst 1 in 10 in the planner too.
    - Strategies are listed by how many futures out of 10 they last, with the score kept as an option.
  - (b) Keep the separate paths, and label each figure with how it was made.
- *Recommendation:* (a). Figures will move, so it ships with a release note. Locked documents keep their figure, with
  a note.
- *If (b):* every screen needs a "why this differs" line, and V7's "Your plan" shows one figure while the planner
  shows several.

**3. Recording a first month on an unlocked plan.**

- *About:* The first monthly entry or tax-year set-up locks a plan without asking; only savers are asked. It locks
  against the Decision tool's defaults (£500,000, a £31,200 "target salary", 35 years), and writes no document.
- *The choice:*
  - (a) Everyone is asked "This locks the plan. Lock it now?". Yes runs the full lock (settings copied across,
    document written). No leaves the month unrecorded.
  - (b) Keep it as it is.
- *Recommendation:* (a).
- *If (b):* a retired person can lock a £1M plan against £500,000 defaults without knowing it.

**4. How often you draw, on a locked plan** (open since 2 Oct).

- *About:* Monthly, quarterly or yearly drawing, and "already paid this month", are frozen by the lock. Changing them
  means unlocking, which retires the plan document.
- *The choice:*
  - (a) They are preferences, and stay changeable when locked.
  - (b) They stay frozen.
- *Recommendation:* (a).
- *If (b):* changing a habit costs the person their plan document.

**5. Couples: one household, money pooled, "who draws what".**

- *About:* The Household tab says "both last" only when each plan lasts on its own, so one partner's money never pays
  the other's share. Each plan has its own household budget. The tax saved by drawing together is one line about
  year 0.
- *The choice:*
  - (a) A household view:
    - The headline is the household's: when one pot is empty, the other pays, as V7 does for couples who stop at
      different times. Each pot's own reading is the second line.
    - One household budget for both plans, with "who pays" kept as an option.
    - "Who draws what" (household-draw-split.md) is built once, first in the Household tab, then in V7.
    - Two optional names replace plan names.
  - (b) Keep two separate plans, and add only "Who draws what".
- *Recommendation:* (a). Couples' verdicts change, so it ships with a release note.
- *If (b):* a couple's verdict stays as weak as the weaker plan, and their two budgets keep disagreeing.

**6. What the budget does to the plan.**

- *About:* The Budget says its age bands, "who pays over time" and one-off costs flow into the plan. They do not. "Use
  as the start of my income shape" overwrites three things with only a toast: the first step, the Decision target and
  the Floor & Flex essentials.
- *The choice:*
  - (a) The budget stays a guide.
    - Now: remove the false lines. The button asks first, shows "was £40,000", has Undo, and writes only the spending
      figure.
    - In V7: the spending chart shows the budget's spending at each age as a dashed guide, with "Use these steps".
      One-off costs come with "Add these to your plan".
    - Each is the person's choice.
  - (b) Make the budget drive the plan automatically.
- *Recommendation:* (a). It keeps your rule of 1 Oct that the budget is a guide.
- *If (b):* that rule is reversed, and the plan moves every time a budget line changes.

**7. Visitors: the example plan, and how many plans a guest may keep.**

- *About:* "Just try it" puts a stranger's £1M retired plan in front of every visitor. A guest may keep only one plan,
  so trying your own figures means overwriting it. A couple cannot be tried at all.
- *The choice:*
  - (a) The example becomes read-only, behind "Look around an example". A guest may keep up to three plans in the
    window, still within the three free hours.
  - (b) Keep it as it is.
- *Recommendation:* (a).
- *If (b):* guests can never try the Household tab, and every first impression is someone else's plan.

**8. Link the preview's questions from today's landing page now.**

- *About:* Nothing on the live site links to /v7/. Its questions A, B and C answer on your own figures in seconds and
  fit a phone's first screen. Today's landing-page buttons sit two and a half phone screens down.
- *The choice:*
  - (a) One line at the top of the landing page: "New: answer one question in about two minutes (preview)".
  - (b) Wait for 7.0.
- *Recommendation:* (a).
- *If (b):* the preview has no real visitors before 7.0, and the switch is its first test in the wild.

**9. Retire five things, each with a release note.**

- *About:* By your parity rule nothing goes without your agreement. Proposed for retirement:
  1. the welcome tour;
  2. the old per-tool wizard;
  3. Edit Tools, since the rail shows what a stage needs;
  4. the budget's "Optional headroom" box, replaced by a "+10%" button beside "Use";
  5. the "Copy from Stress / Copy from Decision" buttons, since one plan has one set of settings.

  Items 3–5 have waited since 2 Oct.
- *The choice:* retire each, or keep it.
- *Recommendation:* retire all five.
- *If kept:* each needs a V7 home, and items 4 and 5 keep duplicated settings alive.

**10. The monthly entry asks for what your platform shows.**

- *About:* Monthly entry asks for totals by type (shares, bonds, cash, diversifiers), which no platform shows. A
  ladder plan asks for "Gilt ladder value (unpaid rungs)", which means adding up 22 lines. You raised this on 9 Sep.
- *The choice:*
  - (a) Offer "pension total, of which cash, of which bond funds or gilts" (for a ladder, the total less cash), with
    last month's figures filled in. Entry by type or by fund stays as an option. It ships in today's Month by month,
    since 7.0 keeps that screen.
  - (b) Keep it as it is.
- *Recommendation:* (a).
- *If (b):* the monthly routine stays the slowest part of the app for those who use it most.

**11. A small patch so that V7's "Change this" opens the planner in the right place** (your-plan.md; open since 9 Oct).

- *About:* "Change this" in V7 must open the planner on the right plan, page and section, with the boxes filled.
  Today's hand-over cannot name a plan or a sub-page, and it skips the page's loader. So Accumulation would open
  empty, and its Save would write blanks over your saved pay-ins.
- *The choice:*
  - (a) One patch release, with a note, that adds a small hand-over to the planner.
  - (b) No edit: each button says "Open the planner" plus directions in words.
- *Recommendation:* (a). Under 1(a) it is needed only until each step can be edited in V7.
- *If (b):* every change means finding your own way in the planner, and question 12 falls away.

**12. Your partner's plan opens in that window only.**

- *About:* A household keeps a locked plan and a working partner's plan in one account. Changing the partner's plan
  from V7 means the planner must open it.
- *The choice:*
  - (a) In that window only. Nothing is written, and your phone and other windows stay on your plan.
  - (b) The whole account switches, after a question that names both plans.
- *Recommendation:* (a). It needs 11(a).
- *If (b):* each switch writes to your locked plan's record, and your phone then opens on your partner's plan. A
  month could be saved into the wrong plan.

**13. V7's founding rule becomes "nothing V7 can reach can write a plan".**

- *About:* V7 was built on a rule that no V7 file touches the planner's storage or Firebase code. Listing your plans
  needs Firebase, to read them.
- *The choice:*
  - (a) Exactly one V7 file reads from Firebase, read-only. A test fails if any write call is within V7's reach.
  - (b) Keep the rule. The planner hands V7 one plan at a time through the browser window.
- *Recommendation:* (a).
- *If (b):* V7 has no list of your plans and no household view. A second hand-over format must be kept up, then thrown
  away at 7.0.

**14. Where V7 offers to unlock a locked plan.**

- *About:* A locked plan's settings are fixed. You ruled that D "never suggests unlocking".
- *The choice:*
  - (a) Once only: one link on "Your plan as locked". It says unlocking keeps the document as a past version, and it
    asks first.
  - (b) Never.
  - (c) On every locked setting.
- *Recommendation:* (a).
- *If (b) or (c):* (b) gives no route to changing a locked plan. (c) offers unlocking five times on one screen, which
  reads as a nudge.

**15. Show plans kept in a window without an account.**

- *About:* Without an account, a plan can be kept in one browser window, metered to three active hours. Looking at it
  in V7 is not the same as V7's answers, which you ruled are not metered.
- *The choice:*
  - (a) Show such plans read-only, only when nobody is signed in. Looking is not metered. After the three hours, V7
    says "Sign in or create an account to keep and see this plan".
  - (b) Show only plans in an account.
- *Recommendation:* (a).
- *If (b):* someone who kept an answer as a plan without an account cannot see it in the preview.

---

## Limits of this audit

- **Guest only.** Screens that need an account were read from the code, not run.
- **Mostly one plan.** Most findings come from the guest example plan and plans made from it. A partner plan was added
  by editing the guest store.
- **One day's figures.** They are from 12 Oct 2026 and will drift.
- **"Who needs it" is by life stage, not usage.**
- **Sizes are judgements.**
- **One figure is unchecked:** the budget's typical TV licence is £240 a year, against a fixed fee of about £175.
