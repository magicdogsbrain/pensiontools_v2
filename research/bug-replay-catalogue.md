# Bug-replay catalogue — September 2026

Step 1 of the V7 plan ("safety net"): every bug a person found by hand in September, and whether a test would catch it if it came back. Written 30 September 2026 against v6.13.3.

## The answer

- **96 bugs** were found by hand between 7 and 23 September (the QA audit and the "corrections" in release notes 6.2.0 to 6.13.3). 86 were fixed; 10 are still open. (The V7 plan says 61; this count is fuller because it takes every release-note correction and every open item as its own line.)
- **47 of the 96 are caught by a test today (49%)**: 36 were already guarded by a test written with the fix, and 11 more have a replay written now.
- Of the 86 that were fixed, 47 are caught (55%).
- 26 wait for the browser layer (step 3), 12 for the wording check, and 1 (G3) is not caught because its fix does not do what the release note says.
- **44 were proved**: the fix was taken out in a scratch copy and a test failed. The list is below.
- Writing the replays found **three things that are wrong today**. They are under Findings; each has a skipped test carrying the evidence.

The replay suite is `tests/replay/` — 9 files, 64 tests (61 pass, 3 are skipped on purpose: the three findings). Run it with `npx vitest run tests/replay`. Every test name starts with the bug id from the table, so `npx vitest run tests/replay -t P13` runs one.

## How to read the table

- **Id**: the audit's own label where it gave one (B, G, C, PERF, P). `R6.x.y` is a correction from that release's note. `N` is an unlabelled note from 9 September. The audit numbered P8 to P14 but skipped P12; two unnumbered findings are P12 and P15 here. P1 to P7 in the audit are people, not findings, so their findings are P1a, P4b and so on.
- **Layer**: where the bug lived. *Engine combination* = right parts, wrong together. *Rule module* = one calculation wrong. *Saved state and form wiring* = the form, the save or the saved plan. *Navigation and stage* = what is shown when. *Wording and rendering* = the sentence or the picture. *Layout*. *Performance*.
- **Status**: *Already guarded* = a test written with the fix exists (named). *Replay written now* = new in `tests/replay/`. *Needs the browser layer* = cannot be tested until step 3's scripted browser. *Needs the wording check* = a rule run over every rendered screen. *Open* = never fixed, so there is nothing to replay yet.
- **Proved**: yes = the fix was reverted in a scratch copy and the named test failed.

## The catalogue

| Id | What went wrong | Fixed in | Layer | Status | Where, or what it waits for | Proved |
|---|---|---|---|---|---|---|
| B1 | The risk summary read "chance of a cut after undefined" for Gilt ladder + rotation. | 6.2.0 | Wording and rendering | Needs the wording check | The sentence is built in the page script. The rule "no screen says undefined" catches it. |  |
| B2 | Opening the Drawdown or Glidepath tab changed the plan's length for everything run afterwards: a 30-year plan was compared over 35. | 6.2.0 | Saved state and form wiring | Needs the browser layer | The tab wrote its own box onto the shared settings. Needs a script that visits the tab and re-reads the comparison. |  |
| B4 | For a plan saved on Buckets in order, the Pots & Valves row of the ranked table was Buckets in order, to the pound. | 6.2.0 | Engine combination | Already guarded | tests/qaFixes.test.js — "a Buckets plan's P&V and Buckets rows differ". | yes |
| B6 | The Historical tab left a spinner running above the finished result on gilt strategies. | 6.2.0 | Wording and rendering | Needs the browser layer | Page script appended instead of replacing. Needs a rendered page. |  |
| B7 | "Worst 12 months" for the bought strategies showed £0 or £28,000 in a year a lump sum or DB pension paid. | 6.2.0 | Engine combination | Already guarded | tests/qaFixes.test.js — both B7 tests. | yes |
| B10 | Switching plan left the previous plan's strategy card on the Monte Carlo tab. | 6.2.0 | Navigation and stage | Needs the browser layer | Stale screen state. Needs a script that switches plan. |  |
| B11 | A stalled save showed "Saving…" for ever, with no error and no retry. | 6.2.0 | Saved state and form wiring | Replay written now | tests/replay/strategyStateAndSavedData.test.js — B11 (two tests). | yes |
| B12 | Deleting a History entry once produced "May 2028 already has a saved decision". | never traced | Saved state and form wiring | Open — never fixed | Seen once, cause unknown, not fixed. A browser script that deletes an entry with a month still typed in the form is the way to find it. |  |
| G1 | Opening Stress Settings snapped a saved allocation to the nearest risk preset, and Save kept the snap (a £60k diversifier sleeve became £123k). | 6.2.0 | Saved state and form wiring | Needs the browser layer | Form wiring. The note that tells an affected plan is pinned (tests/replay/releaseNotes.test.js, G1-note); the bug itself needs a load-and-save round trip in the browser. |  |
| G2 | The "age today" the Stress tester used was invisible, and 45 when the Budget was never set up. | 6.2.0 | Saved state and form wiring | Needs the browser layer | A missing field on a form. |  |
| G3 | Buckets in order with spending cuts on: cuts fired on almost any dip (83 in 100 futures; 394 of 396 months in the Lost Decade). | 6.2.1 | Rule module | Not caught (Finding 1) | A guard exists (tests/incomeTaper.test.js) but it passes on the old rule too. See Finding 1: the new rule cuts MORE than the old one on the plans tried. |  |
| G4 | With no State Pension entered the comparison used £12,000 a year from year 0 and described it as if entered. | 6.2.0 | Engine combination | Already guarded | tests/qaFixes.test.js — G4. | yes |
| D1 | A £32,000 gross target under the basic-rate limit shows a monthly income below target ÷ 12; a new user reads it as under-payment. | not fixed | Wording and rendering | Open — never fixed | Design note from the audit; no wording was added. Wording check once the sentence exists. |  |
| PERF1 | Try-a-strategy froze the page for over a minute with no progress text. | 6.2.0 | Performance | Needs the browser layer | Moved to the background worker. Needs a timed script in a real browser. |  |
| PERF2 | The survivor and care checks each froze the page for over 45 seconds. | 6.2.0 | Performance | Needs the browser layer | As PERF1. |  |
| C1 | Zero showed as "£0.00" beside whole-pound figures. | 6.2.0 | Wording and rendering | Already guarded | tests/qaFixes.test.js — C1; also tests/replay/engineAndStrategies.test.js — C1. | yes |
| C3 | Floor-to-an-age on an unaffordable plan said "0% paid in full … No simulated future ran out". | not fixed | Wording and rendering | Open — never fixed | Left as copy. Wording check: a sentence must not contradict its own number. |  |
| C4 | Survivor check: "inheriting about £924,615" on a £660,000 start — is that today's money? | not answered | Engine combination | Open — never fixed | A question for the owner, not yet a test. Once answered it is a pure-module replay. |  |
| C5 | The allocation line said "56% shares" beside the fund summary's "Shares 65%". | not fixed | Wording and rendering | Open — never fixed | Two figures with different bases on one screen. Wording check. |  |
| C7 | The Decision tool's calculation reason read "Protection | Protection". | 6.2.0 | Wording and rendering | Replay written now | tests/replay/taxDecisionMonth.test.js — C7. (The decision golden also pins the string.) | yes |
| N1 | The gilt-dial note "Priced against Your pot above (£1,212,000)" quoted a different pot from the one the strategy uses (£1,260,000). | changed since, no release note | Wording and rendering | Needs the browser layer | "The number on screen equals the engine's number" is a browser-layer check. |  |
| N2 | Guest mode refused "Save Settings" on the Stress tester ("Please sign in"). | not confirmed | Saved state and form wiring | Open — never fixed | Never settled whether guests are meant to save. Browser script as a guest. |  |
| N3 | The Decision entry form opened with the Pots & Valves layout on a gilt-ladder plan (the owner, in production). | not confirmed fixed | Navigation and stage | Open — never fixed | A race between sign-in, the What's-new pop-up and the first draw. Browser script: open Decision straight after sign-in. |  |
| N5 | Order sheet: a gilt held over for several tax years is not charged the cash drag while it waits. | not built | Rule module | Open — never fixed | From the 8 September list. Pure module: the replay can be written with the fix. |  |
| R6.2.2 | Removing one control took a closing tag too many: Stress, Budget and Strategies tabs lost their content. | 6.2.2 | Layout | Already guarded | tests/indexMarkup.test.js — "every .tab-content shares one parent". |  |
| R6.2.3 | The lump-sum amount box lost focus after every digit. | 6.2.3 | Saved state and form wiring | Needs the browser layer | The row re-drew itself on each keystroke. Needs real typing. |  |
| R6.2.4-a | The income-shape picture used its own flat steps and ignored the slopes the engines were running; a slope could also fall below the State Pension. | 6.2.4 | Wording and rendering | Already guarded | tests/incomeTaper.test.js — "the graphic uses the engines' definition"; also tests/replay/engineAndStrategies.test.js — R6.2.4-a, R6.2.4-c. | yes |
| R6.2.4-b | "Use as my plan's target" from the Budget page rebuilt the schedule flat, dropping the slopes. | 6.2.4 | Saved state and form wiring | Needs the browser layer | Button wiring in the page script. |  |
| R6.2.5 | Rent and part-time income counted in the schedule's floor but were not drawn in the picture. | 6.2.5 | Wording and rendering | Already guarded | tests/incomeTaper.test.js — "draws a marker per dated event and a layer for a stream"; also tests/replay/engineAndStrategies.test.js — R6.2.5. |  |
| R6.2.7 | Cash years in the gilt ladders were priced as if cash held its value: fifteen cash years looked about 7% too cheap. | 6.2.7 | Rule module | Already guarded | tests/incomeTaper.test.js — "cash years in the gilt ladder are not free"; also tests/replay/engineAndStrategies.test.js — R6.2.7. | yes |
| R6.3.0 | "Create a free account to keep it" wiped the guest's plan on the way to sign-up. | 6.3.0 | Saved state and form wiring | Needs the browser layer | The hand-off data is guarded (tests/guestMeter.test.js); the button that lost the plan needs a guest-to-account script. |  |
| R6.4.0-a | The plan's first tax year was never saved, so every plan moved a year later each 1 January. | 6.4.0 | Saved state and form wiring | Already guarded | tests/planTiming.test.js — "is date-stable"; also tests/replay/timingAndStage.test.js — R6.4.0-a. | yes |
| R6.4.0-b | The Decision tool counted plan years from 2026/27 in three places and from "the first year set up" in two. | 6.4.0 | Rule module | Already guarded | tests/decisionAnchor.test.js; also tests/replay/taxDecisionMonth.test.js — R6.4.0-b. | yes |
| R6.4.0-c | The State Pension's plan year differed between the settings preview and the engine for anyone not yet retired. | 6.4.0 | Rule module | Already guarded | tests/decisionAnchor.test.js, tests/spOffset.test.js; also tests/replay/statePension.test.js — R6.4.0-c. | yes |
| R6.4.1-a | Mid-year setup overstated the tax to come for someone drawing since April (£2,464 a month shown, about £1,810 real). | 6.4.1 | Rule module | Already guarded | tests/wizardTaxPaid.test.js; also tests/replay/taxDecisionMonth.test.js — R6.4.1-a. | yes |
| R6.4.1-b | In a partial first year, other income and State Pension were counted in full on top of an income-to-date that already held them. | 6.4.1 | Rule module | Replay written now | tests/replay/taxDecisionMonth.test.js — R6.4.1-b. | yes |
| R6.4.1-c | The setup called taking the full target from the SIPP "Tax-Inefficient". | 6.4.1 / 6.5.2 | Wording and rendering | Needs the wording check | A banned phrase for the wording check. |  |
| R6.4.2-a | "Tax saved" counted State Pension and other income twice, inventing a saving of a few hundred pounds a month. | 6.4.2 | Rule module | Already guarded | tests/wizardTaxPaid.test.js (one line); also tests/replay/taxDecisionMonth.test.js — R6.4.2-a. | yes |
| R6.4.2-b | The saved record and PDF of a gilt-ladder month showed pot floors, a "surplus" and "sell bonds". | 6.4.2 | Wording and rendering | Needs the browser layer | The record screen is drawn by the page script. |  |
| R6.4.2-c | A saved month did not record how a ladder plan paid it, or that it fell before year 0. | 6.4.2 | Saved state and form wiring | Replay written now | tests/replay/taxDecisionMonth.test.js — R6.4.2-c. | yes |
| R6.4.2-d | History cards said "Year 0" for a month before the plan started. | 6.4.2 | Wording and rendering | Needs the wording check | Wording check on the History screen. |  |
| R6.5.0-a | Stress settings and the strategy could be changed on a locked plan, so the two tools drifted apart. | 6.5.0 | Saved state and form wiring | Needs the browser layer | The freeze is on the forms. "Browsing never changes a locked plan" is a rail check. |  |
| R6.5.0-b | The lock explainer said the Stress tester is never locked. | 6.5.0 | Wording and rendering | Needs the wording check | Wording check. |  |
| R6.5.1 | The Tax Years page showed a Pots & Valves "target mix" card on gilt-ladder plans. | 6.5.1 | Wording and rendering | Needs the wording check | Wording check: no pot-mix words on a ladder plan's screens. |  |
| R6.5.2 | The Tax Years page used payroll words ("Target annual salary", "Income before pension start"). | 6.5.2 | Wording and rendering | Needs the wording check | Banned phrases. |  |
| R6.5.3 | Opening History before Monthly Entry showed pot floors and a "surplus" on a ladder plan. | 6.5.3 | Navigation and stage | Needs the browser layer | Order-of-visit bug. Rail check: every screen reachable first. |  |
| R6.5.4-a | "Remaining months = 7" in September read as wrong (it counts September's own payment). | 6.5.4 | Wording and rendering | Needs the wording check | Wording check: "payments to come (incl. this month)". |  |
| R6.5.4-b | The run-up suggestion spread the whole run-up cash over the months left, overstating the rate. | 6.5.4 | Rule module | Already guarded | tests/wizardBridge.test.js; also tests/replay/taxDecisionMonth.test.js — R6.5.4-b. | yes |
| R6.7.0 | A LifeStrategy or Global Strategy fund counted as one asset class. | 6.7.0 | Rule module | Already guarded | tests/holdings.test.js; also tests/replay/holdingsAndPaste.test.js — R6.7.0. |  |
| R6.10.1-a | A plan whose next-step banner had been dismissed never had its life stage worked out. | 6.10.1 | Navigation and stage | Needs the browser layer | The stage was computed inside the banner code. Browser script with the banner dismissed. |  |
| R6.10.1-b | The Tax Years CSV for a ladder plan carried Pots & Valves targets and a rebalance column. | 6.10.1 | Wording and rendering | Needs the browser layer | The export is built in the page script and downloaded. |  |
| R6.10.1-c | Decision PDFs printed the app's dark colours and its buttons; illegible on an iPad. | 6.10.1 | Layout | Needs the browser layer | Screenshot in print mode. |  |
| P1a | A new £180k saver was stress-tested as a £1.5m one: the Timing block projected from the saved £1m defaults, not the form. | 6.10.2 | Saved state and form wiring | Needs the browser layer | The form read the wrong source. Scripted person: "saver at 45". |  |
| P1b | The plan-start year came out a year late when the State Pension date was typed after the Timing block drew. | 6.10.2 | Saved state and form wiring | Needs the browser layer | Order of typing. Browser script. |  |
| P3 | "Plan starts in 7 months" for someone retiring on an October birthday 13 months away; the Decision tool opened in April. | 6.10.3 | Navigation and stage | Already guarded | tests/planTiming.test.js, tests/lifeStage.test.js; also tests/replay/timingAndStage.test.js and transition.test.js — P3. | yes |
| P4a | A locked, running plan still showed "Start the budget walk-through". | 6.10.4 | Navigation and stage | Needs the browser layer | The banner is shown or hidden by the page script. |  |
| P4b | The Transition tab was hidden on a plan locked and started the same day, though nothing had been bought. | 6.10.4 | Navigation and stage | Already guarded | tests/lifeStage.test.js — "the Transition tab is never hidden"; also tests/replay/timingAndStage.test.js — P4b. | yes |
| P4c | The where-you-are strip called a pot-strategy plan "bought by contract" in its first year. | 6.10.4 | Wording and rendering | Replay written now | tests/replay/planDocument.test.js — P4c (two tests). | yes |
| P4d | A "Tax Saved −£0.00" row appeared from rounding dust. | 6.10.4 | Wording and rendering | Replay written now | tests/replay/taxDecisionMonth.test.js — P4d. | yes |
| P5 | Locking from the Stress tester never copied the plan into the Decision tool: a £380k plan was judged against £500k default floors. | 6.10.4 | Saved state and form wiring | Needs the browser layer | The Lock button did not call the copy. The copy itself is pinned (tests/replay/strategyStateAndSavedData.test.js, P5-seed) and so is the note to affected plans (P5-note); the button needs the browser. |  |
| P6a | Applying a paste made the whole Settings save fail ("Failed to save stress data"). | 6.10.5 | Saved state and form wiring | Already guarded | tests/holdingsPaste.test.js; also tests/replay/holdingsAndPaste.test.js — P6a. | yes |
| P6b | A pasted gilt with a guessed code (T31 for TR31) read as a sale plus a purchase. | 6.10.5 | Rule module | Already guarded | tests/transitionPlanner.test.js; also tests/replay/transition.test.js and holdingsAndPaste.test.js — P6b. | yes |
| P6c | Transition told a plan that was already running it had "1 month to go". | 6.10.5 | Navigation and stage | Already guarded | tests/transitionPlanner.test.js; also tests/replay/transition.test.js — P6c. | yes |
| P6d | A gilt-ladder card says "Based on 1 simulated futures and 1 real histories". | not fixed | Wording and rendering | Open — never fixed | Cosmetic, left. Wording check. |  |
| P7 | A State Pension starting mid-year was spread over twelve months (£402) instead of paid from its start month (£997). | 6.11.0 | Rule module | Already guarded | tests/wizardTaxPaid.test.js; also tests/replay/statePension.test.js — P7 (two tests). | yes |
| R6.11.1 | The months before year 0 were called a "bridge" paid from "bridge cash"; the owner: "It's coming out of my SIPP." | 6.11.1 | Wording and rendering | Needs the wording check | The stage label and banner are replayed (tests/replay/timingAndStage.test.js — R6.11.1); the Decision alert, History column and setup need the wording check. | yes |
| R6.11.2 | "Tax saved" showed £1,462 a year for a month with nothing tax-free in it. | 6.11.2 | Rule module | Replay written now | tests/replay/taxDecisionMonth.test.js — R6.11.2 (two tests). Goldens pin the figure, not the rule. | yes |
| P8a | The order sheet listed 20 gilts paying £0 with a £20 fee each, and Transition asked the owner to hold them. | 6.11.3 | Rule module | Already guarded | tests/transitionPlanner.test.js; also tests/replay/transition.test.js — P8a. (The order-sheet screen itself needs the browser.) | yes |
| P8b | The plan document showed a house sale's money as "Other / DB £42,000". | 6.11.3 | Wording and rendering | Already guarded | tests/planDocument.test.js; also tests/replay/planDocument.test.js — P8b. | yes |
| R6.11.4-a | The Decision overlay's run-up note still said "the cash you set aside to reach it". | 6.11.4 | Wording and rendering | Needs the wording check | Wording check. |  |
| R6.11.4-b | On Pots & Valves or Buckets an inheritance showed as "Other / DB" income; the pot takes the lump, so the pot pays. | 6.11.4 | Wording and rendering | Already guarded | tests/planDocument.test.js; also tests/replay/planDocument.test.js — R6.11.4-b. | yes |
| R6.11.4-c | History note grammar: "1 month … are the run-up". | 6.11.4 | Wording and rendering | Needs the wording check | Wording check (singular and plural). |  |
| P9 | "The cash to April covers about 5 of the 7 payments" ignored rent. | 6.11.4 | Rule module | Already guarded | tests/wizardBridge.test.js; also tests/replay/taxDecisionMonth.test.js — P9. | yes |
| P10 | The setup said "From your budget's plan" when the schedule came from the Stress tester's steps. | 6.11.5 | Wording and rendering | Needs the wording check | Wording check. |  |
| P11 | The CPI typed in the setup changed nothing when the suggestion came from the schedule (4% stayed in). | 6.11.6 | Rule module | Replay written now | tests/replay/taxDecisionMonth.test.js — P11 (the figure handed to the form). The typing itself needs the browser. | yes |
| P12 | Setup: a State Pension starting later in the year was left out of the year's tax (£41 a month instead of £179). Unnumbered in the audit; numbered here. | 6.11.5 | Rule module | Already guarded | tests/wizardTaxPaid.test.js; also tests/replay/statePension.test.js — P12. | yes |
| R6.11.6-a | The monthly recommendation taxed only 7/12 of a mid-year State Pension (£121 instead of £179). | 6.11.6 | Rule module | Already guarded | tests/wizardTaxPaid.test.js; also tests/replay/statePension.test.js — R6.11.6-a. | yes |
| P13 | "100 in 100 futures had to cut back spending" on plans that paid every pound. | 6.12.0 | Rule module | Replay written now | tests/replay/engineAndStrategies.test.js — P13 (two tests). The test written with the fix asserts too little to catch a revert. | yes |
| P14 | "£0 typically left at the end" with £400,000 sitting in the ISA. | 6.11.5 | Engine combination | Already guarded | tests/SimulationEngine.test.js — finalAllReal; also tests/replay/engineAndStrategies.test.js — P14. | yes |
| P15 | The cone "How your pot changes" leaves the ISA out. | not fixed | Wording and rendering | Open — never fixed | Listed as open after the 11 September walk. Unnumbered in the audit. |  |
| R6.12.1 | The bracket "(52 in 100 without protection)" beside "85 in 100" read as if protection made things worse. | 6.12.1 | Wording and rendering | Needs the wording check | Sentence-equals-number check. |  |
| R6.12.2-a | The stage chip squeezed the plan's name out of its button at every screen size. | 6.12.2 | Layout | Needs the browser layer | Screenshots at phone, iPad and desktop. |  |
| R6.12.2-b | On an iPad the title wrapped and the account controls spilled into three rows. | 6.12.2 / 6.12.3 | Layout | Needs the browser layer | Screenshots. |  |
| R6.12.4 | On tablets the version chip had grown to the 44px height of the touch buttons. | 6.12.4 | Layout | Needs the browser layer | Screenshots. |  |
| R6.12.5-a | Household called a retired person "still working" until the ladder's year 0. | 6.12.5 | Rule module | Already guarded | tests/HouseholdService.test.js; also tests/replay/strategyStateAndSavedData.test.js — R6.12.5-a. | yes |
| R6.12.5-b | Transition read as if the owner had not retired ("months to go"). | 6.12.5 / 6.13.3 | Wording and rendering | Already guarded | tests/transitionView.test.js; also tests/replay/transition.test.js — R6.12.5-b. | yes |
| R6.12.5-c | Pasting a statement: a stray "CGT" or "P&L" in the ticker column tagged a line as Capital Gearing Trust or Personal Assets. | 6.12.5 | Rule module | Already guarded | tests/holdingsPaste.test.js; also tests/replay/holdingsAndPaste.test.js — R6.12.5-c. A part of it is still live: Finding 2. | yes |
| R6.12.6 | The lock blocked saving My funds, so a wrong line could not be removed. | 6.12.6 | Saved state and form wiring | Needs the browser layer | Save-button wiring on a locked plan. |  |
| R6.13.0-a | The Stress tester's fund list was read as what you hold ("it thinks I have PACW, CGT and PNL"). | 6.13.0 | Saved state and form wiring | Already guarded | tests/holdingsRecord.test.js, holdings.test.js, retireSweep.test.js; also tests/replay/holdingsAndPaste.test.js — R6.13.0-a (two tests). | yes |
| R6.13.0-b | Dials from a deselected strategy stayed in the saved plan and could reach another strategy's run and the plan document. | 6.13.0 | Saved state and form wiring | Already guarded | tests/strategyState.test.js, planDocument.test.js; also tests/replay/strategyStateAndSavedData.test.js — R6.13.0-b and planDocument.test.js — R6.13.0-d. A part of it is still live: Finding 3. | yes |
| R6.13.0-c | Adopting Pots & Valves or Buckets wiped the fund list. | 6.13.0 | Saved state and form wiring | Replay written now | tests/replay/strategyStateAndSavedData.test.js — R6.13.0-c (the switch keeps and restores the list). The button that calls it needs the browser. | yes |
| R6.13.1 | 6.13.0 asked "is the Stress tester's list what you actually hold?" — the question itself was the mistake. | 6.13.1 | Wording and rendering | Already guarded | tests/transitionView.test.js; also tests/replay/transition.test.js and holdingsAndPaste.test.js — R6.13.1. |  |
| R6.13.2-a | Six months from the start with £40,000 of run-up draws still to pay, Transition showed that money as spare. | 6.13.2 | Rule module | Already guarded | tests/transitionPlanner.test.js; also tests/replay/transition.test.js — R6.13.2. | yes |
| R6.13.2-b | The What-you-hold boxes were browser-default white with grey text. | 6.13.2 | Layout | Needs the browser layer | Screenshots; contrast check. |  |
| R6.13.3-a | The run-up was sized on the plan's first step (£6,667) rather than the £7,000 a month actually drawn. | 6.13.3 | Rule module | Already guarded | tests/transitionPlanner.test.js; also tests/replay/transition.test.js — R6.13.3-a. | yes |
| R6.13.3-b | For a retiree the page talked about "the plan starting" as if a retirement date were coming. | 6.13.3 | Wording and rendering | Replay written now | tests/replay/timingAndStage.test.js — R6.13.3-b; transition.test.js — R6.12.5-b. | yes |

Left out on purpose: C6 (the audit withdrew it — a text-scrape artefact), the "unaffordable strategies vanish" note (the line already existed), the Jan–Apr birthday convention (ruled not a bug), and requests for something new (SIPP-total entry for ladder plans, a "re-do this year's setup" button). The 6.1.0 corrections are before the range asked for.

## Catch rate today, by layer

| Layer | Bugs | Caught today | Already guarded | Replay written | Browser layer | Wording check | Not caught | Open |
|---|---|---|---|---|---|---|---|---|
| Engine combination | 5 | 4 (80%) | 4 | 0 | 0 | 0 | 0 | 1 |
| Rule module | 23 | 21 (91%) | 17 | 4 | 0 | 0 | 1 | 1 |
| Saved state and form wiring | 20 | 7 (35%) | 4 | 3 | 11 | 0 | 0 | 2 |
| Navigation and stage | 8 | 3 (38%) | 3 | 0 | 4 | 0 | 0 | 1 |
| Wording and rendering | 32 | 11 (34%) | 7 | 4 | 4 | 12 | 0 | 5 |
| Layout | 6 | 1 (17%) | 1 | 0 | 5 | 0 | 0 | 0 |
| Performance | 2 | 0 (0%) | 0 | 0 | 2 | 0 | 0 | 0 |
| **All** | **96** | **47 (49%)** | 36 | 11 | 26 | 12 | 1 | 10 |

What the table says: the calculations are well covered (engine and rule bugs are nearly all caught). Almost nothing about forms, navigation, layout or speed is — that is where September's bugs were hardest to see, and it is exactly what steps 3 onward build.

Of the 36 already guarded, 32 also have a replay in `tests/replay/`, so the suite stands on its own as the record of September.

## What the rest are waiting for

**The browser layer (step 3) — 26 bugs.** B2, B6, B10, G1, G2, PERF1, PERF2, N1, R6.2.3, R6.2.4-b, R6.3.0, R6.4.2-b, R6.5.0-a, R6.5.3, R6.10.1-a, R6.10.1-b, R6.10.1-c, P1a, P1b, P4a, P5, R6.12.2-a, R6.12.2-b, R6.12.4, R6.12.6, R6.13.2-b. By kind:
- A form or button that read or wrote the wrong thing: B2, G1, G2, R6.2.3, R6.2.4-b, R6.3.0, R6.5.0-a, P1a, P1b, P5, R6.12.6. Caught by scripted people who fill the form, save, reload and compare.
- What is shown when: B10, R6.5.3, R6.10.1-a, P4a. Caught by the rail checks (every step reachable, in any order).
- The number or the screen itself: B6, N1, R6.4.2-b, R6.10.1-b. Caught by "the number on screen equals the engine's number".
- Layout: R6.10.1-c, R6.12.2-a, R6.12.2-b, R6.12.4, R6.13.2-b. Caught by screenshots at phone, iPad and desktop.
- Speed: PERF1, PERF2. Caught by the counted first answer (waiting time per question).

**The wording check — 12 bugs.** B1, R6.4.1-c, R6.4.2-d, R6.5.0-b, R6.5.1, R6.5.2, R6.5.4-a, R6.11.1, R6.11.4-a, R6.11.4-c, P10, R6.12.1. One rule set run over every rendered screen: no "undefined", no "-£0.00", no "bridge", no payroll words, no pot-mix words on a ladder plan, singular and plural agree, and a sentence does not contradict its own number. Five of the open ones (D1, C3, C5, P6d, P15) would fall to the same check once someone writes the sentence they should say.

**Open — 10 bugs never fixed.** B12, D1, C3, C4, C5, N2, N3, N5, P6d, P15. B12, N2 and N3 need the browser to reproduce at all. C4 needs the owner's answer. N5 is a pure-module change whose replay can be written with it.

**Not caught — 1.** G3. See Finding 1.

## Proved by taking the fix out

For these 44 the fix was reverted in a scratch copy of `src` (never in the repository) and the named test went red, then the copy was restored:

B4, B7, B11, G4, C1, C7, R6.2.4-a, R6.2.7, R6.4.0-a, R6.4.0-b, R6.4.0-c, R6.4.1-a, R6.4.1-b, R6.4.2-a, R6.4.2-c, R6.5.4-b, P3, P4b, P4c, P4d, P6a, P6b, P6c, P7, R6.11.1, R6.11.2, P8a, P8b, R6.11.4-b, P9, P11, P12, R6.11.6-a, P13, P14, R6.12.5-a, R6.12.5-b, R6.12.5-c, R6.13.0-a, R6.13.0-b, R6.13.0-c, R6.13.2-a, R6.13.3-a, R6.13.3-b.

B4, B7 and G4 were proved against the existing `tests/qaFixes.test.js`; the rest against `tests/replay/`. Where a bug has two halves (P3: the timing and the stage; P7: the setup and the month; P13: the tile and the engine) each half was reverted separately and each was caught.

Not reverted, reasoned from the diff instead: R6.2.2, R6.2.5, R6.7.0, R6.13.1 (each test asserts exactly what the fix commit added).

One revert was NOT caught — G3 — and that is how Finding 1 was found.

## Findings — wrong today

Each has a skipped test (`it.skip`) in `tests/replay/` with the evidence in a comment above it. Nothing in `src` was changed.

**1. G3 — the "fairer cuts for Buckets in order" rule (6.2.1) cuts more, not less.** The release note says Buckets plans get "fewer cut months". Running the engine from the commit before 6.2.1 against the 6.2.1 engine, 300 seeded futures each, floors equal to the pots, 30 years, cuts on:

| Plan | Before 6.2.1 | 6.2.1 and today |
|---|---|---|
| £600k, £32k a year | 64% of futures in protection, 64 months on average | 70%, 89 months |
| £700k, £30k a year | 59%, 37 months | 67%, 61 months |
| £1m, £35k a year | 56%, 30 months | 64%, 43 months |

In a steady 5% a year (2.5% above inflation) the old rule never cut; today's cuts for 15 months. The test written with the fix uses a steady 6%, where both rules give no cut, so it passes either way. The audit's own plan (P2, with UFPLS, recycling and a declining spend) may well have improved — that was never pinned. Since 6.12.0 the headline tile counts income actually unpaid, so this shows up as lower income in those months rather than as the alarming tile. It needs the owner's ruling on what the rule should be. Skipped test: `engineAndStrategies.test.js`, "G3 (LIVE)".

**2. R6.12.5-c — a pasted gilt can still keep a stray code, and then swallow a real fund.** The 6.12.5 fix stops "CGT" choosing the fund. But a gilt recognised by its name alone (no rung for its year on the order sheet, or no order sheet yet) keeps "CGT" as its ticker. If the same paste holds a real Capital Gearing Trust line, the two are merged into one: the gilt's £20,000 disappears and the trust is marked as a gilt with the gilt's units. Where: `src/services/HoldingsPaste.js`, the name-only branch of `matchRows`. Skipped test: `holdingsAndPaste.test.js`, "R6.12.5-c (LIVE)".

**3. R6.13.0-b — a plan not saved since 6.13.0 is still planned on a deselected strategy's pot.** The plan document's own figures are clean. The plan stored inside it is not: `planFromSettings` (`src/strategies/stressTest.js`) reads the saved dials raw. For a Pots & Valves plan that still carries a ladder's "Total in your SIPP" (any plan saved before 6.13.0 and not re-saved — a locked one cannot be), the stored plan has pot £1,179,422 where the allocation is £300,000, ISA £0 where it is £80,000, and the other strategy's dials. That plan is what the strategy card is drawn from and what the bought strategies in the ranked comparison are priced on. Not confirmed on screen — that needs the browser. Skipped test: `planDocument.test.js`, "R6.13.0-b (LIVE)".

## Weak guards noticed on the way

- `tests/incomeTaper.test.js`, "a benign market no longer cuts…" — passes on the rule it was written to replace (Finding 1).
- `tests/SimulationEngine.test.js`, the 6.12.0 "had to cut back" test — it would still pass if the engine never recorded a cut. The P13 replays assert the numbers.
- `tests/holdingsPaste.test.js`, the 6.12.5 test — asserts the gilt is "a gilt" but not what ticker it is left with (Finding 2).

## What the replay suite does not do

- It pins dates itself (September 2026) and does not yet use the shared clock helper another step-1 task is adding (`tests/helpers/clock.js`); moving to it is a rename.
- P5-seed, P5-note, G1-note and R6.4.0-a-note pin the pure half of a wiring bug, or the note that tells an affected plan what to do. They are not counted as catching P5 or G1.
- It is a record of September, not a search for new bugs. The three findings came from asking, of each fix, "would the test fail without it?" — the same question the later layers should be measured by.
