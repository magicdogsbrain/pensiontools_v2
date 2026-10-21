# The way of drawing, the mix, and Try a change — road step 8 (6.40.0 and 6.41.0)

Written 21 Oct 2026 by the lead for `research/v7/road-to-7.md` step 8, on the planner's code as it is (file and line
pointers were checked that day). Two releases: **8a the way** (6.40.0) and **8b the mix, Try a change and the income
picture rows** (6.41.0). The rules that bind every step hold here: every option of today's planner exists in V7 at least
as fully (the parity ledger is the gate); V7's words, never the planner's jargon; nothing is written that the person did
not press a button for; a locked plan is never changed; an absent setting means the old behaviour; the one write file,
the one create, the guard before the write (tests/v7/boundaries.test.js rules 3a–3f are not widened by this step).

Words. The planner says "strategy"; V7 says **the way of drawing** (the rail label is already "How the money is taken",
src/v7/copy/plan.js 232). The planner says "allocation"; V7 says **the mix**. The nine ways keep the planner's names
(`STRATEGY_NAMES`, src/strategies/stressTest.js 31): "Pots & Valves", "Buckets in order", "Ladder & Ratchet", "Bridge &
engine", "Floor & Flex", "Floor the schedule", "Floor to an age, then decide", "Full index-linked gilt ladder", "Gilt
ladder + rotation". Each card opens with the way's `promise` (src/strategies/registry.js) and closes with its `failure`.

---

## 1. E's answer contract — all nine ways answer in V7's one verdict

Decision 3 of the road (the owner's, 2 Oct): every way of drawing answers in the one verdict, and the score stays under
"More columns".

**The run.** `runWays(plan, { today, onProgress })` in a new pure module `src/answers/plan/waysRun.js`, loaded in the
worker's lazy chunk beside `lastsRun.js`: `planFor` as `runLasts` builds it (the bundled yield curve, `priced:
'bundled'`), then `deriveCompareConfigs(p)` (src/strategies/compareRunner.js 85) once, then `stressTestStrategy` for each
of the nine in `STRATEGY_NAMES` key order — the same functions, the same `mcSeed`, the same 1,000 futures and stride as
the planner's `cmpRun` (index.html 8897). Every way reads the ACTIVE way's parameter bag, as the planner's compare does
(stressTest.js 155, 196–203); a way's stash in `strategyState` is used only when that card is opened (section 2.3).
`onProgress(i, 9)` after each way; the cards fill in as they finish. The result per way: `{ id, affordable, reason, a:
oneAnswer(r, p), coverage, spentMedian, vol, vac, terminal, worst12 }` — plain data (it survives JSON; no samples).
Cost: nine runs of the one test, about five seconds on a laptop; said on screen as "Ran the nine ways in N s".

**The verdict.** Each card's first line is `verdictOf(result)` from `src/answers/plan/lasts.js` 296, the plan's own
words: "Lasts in 9 futures out of 10" / "just under 9" / "7 futures out of 10" (`futuresOutOfTen`), with the sub line
`pctText(chancePct, 1, CHANCE_BARS)` (never rounded across a bar) or `lasts.subContract` for the two contract ways
(`CONTRACT` in lasts.js 47). Then: "Typically £X left · in a bad case £Y" (`terminal.p50`, `p10`); for a bought way "Costs
£Z of your pot today, £W left to grow"; for a way that cannot be afforded, no figures and the planner's `reason` in V7's
words ("Your pot cannot buy this: the ladder would cost £X, you have £Y").

**The ranking.** The planner's default: by futures out of 10 first, then coverage (`rankingCardHtml`'s 'lasts' key,
`share * 1000 + coverage`, src/ui/oneAnswerView.js 142–171); unaffordable ways last, in their own group. The planner's
other orders — what is left, the score, coverage — are the "Rank by" choice under "More columns", never the default.

**"More columns".** One quiet button below the cards opens a table of the nine with the planner's extra columns, in the
planner's names made plain: "Worst 12 months", "Years covered", "Coverage", "Spent over the plan", "Bumpiness (% a
year)", "Score" (`vac` from `scoreStrategy`, stressTest.js 855). The score is explained in one sentence beside the table
("The score weighs what is paid, how much is left and how bumpy the ride was; higher is better. It never decides the
order of the cards.").

**Gate 8a (the road's).** A Node identity test, `tests/v7/plan/waysIdentity.test.js`: on every unlocked fixture in
tests/fixtures/plans (the twelve), `runWays` gives, for each way, the same `ruin.mc`, `terminal`, `coverage` and
`affordable` as the planner's own loop — the loop is lifted from `cmpRun` into a pure `compareAll(p, ids)` in
`src/strategies/compareRunner.js` that both call, so the gate is "same function, same inputs", proven by running both on
the fixtures through the bundled curve (the planner loads live data; the test pins the curve for both sides as
tests/v7/plan/lastsRun.test.js L2 does). The order of the cards equals the planner's Overview order under the same
"Rank by".

---

## 2. 8a — `#/plan/<id>/way`: "How the money is taken" (6.40.0)

### 2.1 Place on the plan

`way` joins `PLAN_SUB_STEPS` (src/v7/router/routes.js 29: about, income, spend, pots, lasts, **way**, and in 8b **mix**).
The plan page's read-only section "How the money is taken" (read.js 361–367) gains `sub: 'way', href: '#/plan/<id>/way'`
like the other edited sections; its lines stay as they are. The rail shows the sub-step as the others are shown. The
section's "Change" leads here on an unlocked plan; on a locked plan the section reads from the document and the link
says "Try another way (nothing changes)".

### 2.2 The screen

Headed "How the money is taken". First, **your plan's way** as an open card: its name, its promise, the verdict as "Does
it last?" gave it (the same run; a plan whose "Does it last?" ran in this session shows that figure at once), its dials
(2.3) with the plan's values. Below, "The other eight, on this plan" — a card each, ranked (section 1), closed: name, the
promise, the verdict line, the left/cost line. A closed card has one button, "Open". Opened, it shows its dials at the
plan's stashed values for that way if there are any (`strategyState[id].strategyParams`), else the defaults (2.3), the
verdict for those values, "Use this way of drawing" (2.4) and the way's `failure` sentence under "How it fails".
Changing a dial re-runs that one way ("Tried in 1 run"); the card keeps the tried figures until closed. Only one card is
open at a time. "More columns" sits under the cards. Nothing here writes until 2.4's confirm.

Two ways need the mix and say so on their card: "Its mix — the split between shares, bonds, diversifiers and cash — is
on 'The mix'." (8b; until 8b ships the sentence names the planner's Settings, as "Does it last?" did for the lock before
step 6). The other seven hide the mix, as the planner does (`data-pnv-only`).

The screen is read from a `page.way` view built by planSource.js from the read and the ways run: `{ current, cards[],
more, running, ran }`; the effect `effects/ways.js` runs `runWays` through a new worker lane `ways` (answerWorker.js
message 'ways', workerClient.js `ways()`), on the plan of the read held, dropping a stale result as `effects/lasts.js`
does. The result is kept per plan and per `lastModified` so a second visit does not re-run; a save of the plan clears it.

### 2.3 The dials — ONE set of defaults

Every dial the planner shows anywhere for a way (its Settings box or its strategy page) is on the card, with the
planner's own label made plain, its range and step; nothing is left to the planner. The default is the one the engine
uses when the value is absent (compareRunner.js / stressTest.js), so a card opened and used without touching a dial runs
exactly as the planner would run that way on this plan. Where the planner's Settings box and its strategy page disagree,
the engine's default wins and the disagreement is listed in 6.40.0's corrections.

| Way | Dials (key · label on screen · range · default) |
|---|---|
| Pots & Valves | none of its own. "Cut spending in bad runs" (`disableProtection`, inverted) · "How deep the cut is" (`protectionMult` as a % 0–60 step 5, default 20) · "Months below the path before it cuts" (`consecutiveLimit` 1–24, default 3). The split lives on The mix. |
| Buckets in order | `bucketBand` · "How far above the path before the cash bucket refills (%)" · 0–50 step 5 · 10. Plus the cut dials. The bond tent is ignored by this way (stressTest.js 793) and the card says so. |
| Ladder & Ratchet | `ladderYears` · "Years of income bought up front" · 1 to N−1 · min(15, ⌊N/2⌋). `drawAnnual` · "Income to bolt on, a year before tax" · £ · the plan's target. `triggerMode` · "When it buys more years" · band / every 5 years · band. `bandThreshold` · "How far above the path before it sells (×)" · 1.05–2 step 0.05 · 1.2. |
| Bridge & engine | `bridgeAge` · "Bridge to age" · 56–90 · State Pension age, else start + min(10, N−1). `cashYears` · "Years paid from cash first" · 0–10 · 3. |
| Floor & Flex | `essentialsAnnual` · "The bills, a year" · £ · round(target × 0.55). `horizonAge` · "Bills paid to age" · 60–105 · 92. `sleeveRate` · "What the rest pays out (% a year)" · 1–10 step 0.25 · 4. `ratchet` · "When markets are kind" · off / extend the floor / raise the income · off. `treatsRule` · "Treats" · a share / a fixed sum · share. |
| Floor the schedule | none. |
| Floor to an age, then decide | `floorToAge` · "Buy the income to age" · 60–95 · 80. (`borrowedFloor` is written by the rotation's switch, never a dial.) |
| Full index-linked gilt ladder | `cashYears` · "Years paid from cash first" · 0–5 · 2. `bridgeCash` · "Cash kept to the first April" · £ · 0. `spareGrowth` · "Money left over" · kept / invested · kept. |
| Gilt ladder + rotation | the ladder's three, plus `rotateCutAge` · "Keep the rungs to age" · 65–88 · 75. `rotateTrigger` · "The escape: % below the all-time high" · 20–50 step 5 · 30. `rotateDisarmYears` · "Years before the escape is put away" · 1–15 · 8. |

The shared pot sizes (`sippTotal`, `isaTotal`, the planner's "Your pot" box) are not dials: the plan's pots are the pots,
as "Does it last?" uses them. The rotation dials run on the card (the planner's page copies only some keys, index.html
9314 — a correction, not carried into V7).

### 2.4 "Use this way of drawing" — the write

A confirm on the card: "Your plan will be drawn as {name}. Its dials as shown are kept with it; {old name}'s own settings
are put away and come back if you return to it. The pots, the income and the mix do not change." Then ONE write, the
planner's switch field for field: `switchStrategy(settings, id, { savedAt })` (src/services/StrategyState.js 91, pure
already) gives `strategyId`, `strategyParams` (cleaned by `cleanParams`), `strategyState`, `allocMode`, `taggedFunds`;
when the way's stash restores a funds list, also `equityMin`, `bondMin`, `cashTarget`, `diversifierStart`, `subAsset`,
`isaBalance` (`switchStressStrategy`, index.html 9010, lifted pure as `switchPatch(settings, id, dials, { savedAt })` in
`src/services/PlanCommit.js`; the planner calls it); and the root `strategy: { id, params, lockedAt, engineVersion }`
as `setActiveStrategy` writes it (ScenarioRepository.js 740). `WAY_WRITES` in schema.js lists exactly those paths;
`WRITES.way` = `WAY_WRITES`. Undo as every editing step's. A locked plan: the card runs, "Use this" is not drawn, and one
line sets the tried figure beside the document's ("Your plan as locked lasts in 9 out of 10 on {way}; {other way} would
have lasted in 8"). Nothing suggests unlocking.

### 2.5 Cost said on screen

"Ran the nine ways in N s" under the cards; each dial change "Tried in 1 run". The run is at most nine runs on opening
the step, one per dial change, never more.

---

## 3. 8b — `#/plan/<id>/mix`: "The mix" (6.41.0)

### 3.1 Who sees it

Pots & Valves and Buckets in order. For the other seven the step is one paragraph: "{name} buys your income; the mix
does not apply. To change the way the money is taken, open 'How the money is taken'." with the link. (The planner hides
the whole box; V7 says why.)

### 3.2 Sections, each a Field group with the plan's values

**a. How it is held.** A choice of three: *a risk level* (cautious / balanced / adventurous — `RISK_PRESETS`,
src/services/GlidepathService.js 45, shown with the £ each gives on this plan's pot: "Balanced: £250,000 shares, £200,000
bonds, £50,000 cash"), *your own split* (four boxes, shares / bonds / diversifiers / cash, as % kept to 100, shown in £
too), or *the funds to test* (c). Stored exactly as the planner stores it: the £ amounts `equityMin`, `bondMin`,
`cashTarget`, `diversifierStart` and `allocMode: 'risk'` for both the level and the split (the planner has no 'custom'
value; a split that is not a preset is shown as "your own split", as the planner's "Custom — your saved split"), or
`allocMode: 'funds'` for (c). With the diversifiers sleeve on, a risk level uses `DIVERSIFIER_PRESETS` (index.html
6303, lifted to GlidepathService.js). The pots step keeps writing the pension total in the saved proportions
(`potsPatch`); the mix step writes the proportions.

**b. Diversifiers.** "A sleeve of gold and trend funds, held flat and sold first" on/off (`diversifierStart` > 0, and
`subAsset: {}` when on, as the planner sets it). Beside it, "What it does in a bad case": one extra run of the one test
with the sleeve the other way; the line reads "With the sleeve, in a bad case £X is left at the end; without, £Y" (p10),
"Tried in 1 run".

**c. Funds to test.** The list the plan is tested on when "the funds to test" is chosen (ledger pots.funds-to-test). A
line is typed (ticker or name, value, wrapper SIPP / ISA / GIA) with the planner's search (`src/services/FundSearch` as
the planner uses it, bundled; no outside request) or pasted from a platform: `parsePaste` → `matchRows` → "What is this?"
for each unmatched line (`CATEGORY_CHOICES`, `categorise`) → `pasteSummary` (src/services/HoldingsPaste.js, pure already);
every line is kept or listed under "Left out, and why". The allocation is rebuilt from the tags exactly as the planner's
`rebuildCustomAllocFromFunds` (index.html 6764, lifted pure into `src/services/PortfolioTagger.js` beside
`allocationFromTags`): ISA-wrapped lines go to `isaBalance`, the rest to the four amounts and `subAsset.{bondWeights,
diversifierWeights}`. One list per way of drawing: the list is stashed with the way (`strategyState`, as the planner's
switch stashes it). The example portfolio (ledger pots.example-portfolio, `ModelPortfolios.js`) is offered as "Show an
example list for this level (not advice)", which fills the boxes and nothing else.

**d. The bond tent.** On/off (`equityGlideEnabled`), with the planner's sentence made plain: "Shares start lower and
rise to your mix over the first {max(5, N−20)} years. It usually helps the worst cases and slightly lowers typical
growth." For a funds list the funds are the start and the endgame is chosen (`glideEndgame`, the three levels). "What
it does in a bad case": one run the other way, the same line as (b). Buckets in order ignores the tent and the card says
so.

**e. "Which mix lasts best?"** The planner's "Compare allocations" (ledger test.optimise), with the plan's own mix first:
your mix with the tent off and on, then the three levels with the tent off and on — eight runs of the one test, the grid
in futures out of 10 with "typically left", the best cell marked. Then "Use this mix" on any cell: a confirm ("Your plan's
mix becomes {level}, tent {on/off}: £X shares, £Y bonds, £Z cash. The funds to test, if any, are put away for this way.")
and one write of the amounts, `allocMode: 'risk'` and `equityGlideEnabled`. The planner offers no apply; V7 does (the
ledger row asks for it). Refused in words for the seven bought ways (3.1). "Tried in 8 runs".

### 3.3 The write

`MIX_WRITES`: `stressTool.settings.{equityMin, bondMin, cashTarget, diversifierStart, subAsset, allocMode, taggedFunds,
isaBalance, equityGlideEnabled, glideEndgame, strategyState}` and `lastModified`; `WRITES.mix`. One write per press of
"Save the mix" (the step's one button, as the pots step has), with Undo; "Use this mix" in (e) is its own write with its
own confirm. Locked plan: read-only, the lines read from the document, and (b), (d), (e) still run as try-only with the
document's figure beside them.

---

## 4. 8b — Try a change on a plan (6.41.0)

The step-7 "Try a change" section on "Does it last?" grows into the planner's whole Try (ledger test.try, strat.try-in-
copy): every field of `#tryStrategyCard` (index.html 2759, 6054–6141) and the three levers of step 7.

**The boxes, in V7's words:** the way of drawing (the nine, as saved first); the pot (default the plan's pension total);
the ISA (default the plan's); the ISA policy (as saved / hold it back); the income (as shaped / a flat £ a month after tax);
the years (5–45); the cuts (as saved / on / off), how deep (0–60 %), the escalation months (0–60); and the three levers
(spend more / some work / shares fall). Then "Try it". The settings are made by `tryStrategySettings` lifted pure from
index.html 6076 into `src/answers/plan/lastsRun.js` as `trySettings(plan, boxes, today)` (the planner calls the same
function): a deep copy, the pots rescaled as the planner rescales them (`equityMin`, `bondMin`, `cashTarget` by pot/old
pot; `diversifierStart` left — the planner's rule, kept, and said in "What's different"), `strategyParams = {
...restoredParamsFor, sippTotal, isaTotal }`, a flat income as `incomeShape: 'level'`, the years clamped. The run is the
one test (`runLasts` on the copy), the same length rules and futures. "Tried in 1 run" (the spend-more lever says its
own count).

**"What's different."** Every box that differs from the plan as saved, one line each: the way, the pot, the ISA, the ISA
policy, the income, the years, the cuts, the depth, the escalation months — including the three the planner leaves out
(depth, months, policy; a correction). With none: "This is your plan as saved, run through {way}."

**Then two buttons.** *"Use this"* (unlocked only): a confirm listing "What's different", then ONE write of exactly the
fields that differ, through the existing lists: the way through `WAY_WRITES` (2.4, the switch), the pots through
`POTS_WRITES`, the income through the income step's list, the years through `about`'s, the cuts through `LASTS_WRITES`.
The write is `declaredOnly` as every write is; a Try that changes nothing has no "Use this". *"Keep as a separate plan"*:
the planner's "Try this strategy in a COPY" (index.html 8547) — step 7's create, on a plan document rather than a seed:
`planWrite.js keepCopy(planId, boxes, name)` builds the copy from the tried settings (`readyPlan` as the create does:
upgraded, checked, never locked — a locked plan's copy is made unlocked, its document and record not carried, the
planner's rule), names it "{name} · tried" made unique, `isActive: false`, and writes it through the ONE `F.addDoc(` call
site (`add`) or the window's list. Rule 3c is unchanged: one create word, one call site. The panel then says "Kept as
‘name’ in your account" with "Open it" (its plan page) and "Lock this plan?".

**Gate 8b (the road's).** `tests/v7/plan/tryIdentity.test.js`: on the twelve fixtures and a table of box values
(each box moved alone, then all together), `trySettings` equals the planner's `tryStrategySettings` key for key (the same
function, so the test is that the planner's caller still passes the same inputs: a DOM-free test of the lifted function
against the planner's recorded outputs on the fixtures, pinned once), and the tried verdict equals the planner's Try
verdict to the pound through the bundled curve. e2e: every figure on the Try section equals `trySettings` + `runLasts`
in Node (e2e/helpers/leverInNode.js widened to `tryInNode`).

---

## 5. The income picture rows that ride along (6.41.0)

Drawing only, no writes, on the income step's picture (`incomeStaircaseSvg`, lifted to V7's picture in step 5):
**income.layers-editing** (the State Pension and other income drawn as layers under the steps while the steps are set),
**income.budget-mark** (the budget's total as a mark when a budget sheet exists), **income.markers** (lump sums and
one-off spends as marks at their ages), **income.below-income-live** (the sentence "Below the income you get anyway" when
a step is). The three that are not cheap stay where they are: income.staircase-motion, income.lump-to-steps and
inc.lump-sums (a write) go to step 11's sweep; the road's "left" list says so.

---

## 6. Lifts out of index.html (pure, the planner re-pointed to them, byte-identical results)

| From | To | Used by |
|---|---|---|
| `cmpRun`'s per-way loop (index.html 8897–8924) | `compareAll(p, ids, { onProgress })` in src/strategies/compareRunner.js | the planner's Overview and `runWays` |
| `rankingCardHtml`'s keys (oneAnswerView.js 142–171) | `rankWays(results, by)` in src/services/OneAnswer.js | both |
| `switchStressStrategy`'s patch (index.html 9010–9025) + `restoredParamsFor` (9006) | `switchPatch(settings, id, dials, { savedAt })` in src/services/PlanCommit.js | the planner's switch and 2.4 |
| `useSpecStrategy`'s dial patch (9309–9314) | folded into `switchPatch` (dials in) | both |
| `readAlloc` / `writeAlloc` (6517–6578), `DIVERSIFIER_PRESETS` (6303) | `mixFromLevel(pot, level, { diversifiers })`, `levelOfMix(settings)` in src/services/GlidepathService.js | the planner's Settings and 3.2a |
| `rebuildCustomAllocFromFunds` (6764) | `mixFromFunds(rows)` in src/services/PortfolioTagger.js | both |
| `runCompareStrategiesUI`'s grid (6935–6967) | `compareMixes(p, { own })` in src/strategies/compareRunner.js | the planner's button and 3.2e |
| `tryStrategySettings` (6076–6095) | `trySettings(plan, boxes, today)` in src/answers/plan/lastsRun.js | the planner's Try and section 4 |
| the "What's different" list (6115–6123) | `tryDifferences(plan, boxes)` in src/answers/plan/lasts.js | both (the planner gains the three missing lines) |

Each lift is proven as step 6 and 7 proved theirs: the moved body byte-identical (or the difference listed as a
correction in the release note), the planner's caller a one-line re-point, boundaries' rule 3a reach walk green
(src/services stays pure: no storage, firebase, ui, worker, clock).

---

## 7. Tests, states, pictures, words

- States: `tests/v7/states/plan/way-*.json` and `mix-*.json`, `lasts-try-*.json` by build-states.mjs, stamped with the
  release; render tests under tests/v7/plan/{way,mix,try}Render.test.js hold every screen to checkScreen's rules and the
  `record` scope's words (no "About £" on a plan page; the banned list unchanged).
- Shell tests: tests/v7/shell/{way,mix,try}.test.js — the reducer, the worker lanes (`ways`, the reuse of `lasts` for
  the mix's extra runs and Try), stale results dropped, the writes `declaredOnly`, the guard refusing a locked plan, Undo.
- The two gates (1 and 4) in Node; the states' slow test stays at 1,000 futures.
- e2e: `e2e/plan-way.spec.js` (phone and desktop: the nine cards, open one, a dial, "Use this", the stored plan equals
  `switchPatch` in Node, a locked plan's card has no "Use this"), `e2e/plan-mix.spec.js` (a level, your own split, a
  pasted list with one line left out, the tent's bad-case line, "Which mix lasts best?" and "Use this mix"),
  `e2e/plan-try.spec.js` (every box, "What's different", "Use this", "Keep as a separate plan" → a second window plan,
  the first byte-identical). JOURNEYS_PLAN gains the three.
- Wording: the nine names, the dial labels and every sentence here live in `src/v7/copy/way.js`, `mix.js`, and `lasts.js`
  (Try); wording.test.js pins them; the `record` scope applies to all three screens.

---

## 8. Ledger rows closed

- 6.40.0 (8a): strat.pots-and-valves, strat.buckets, strat.ladder-ratchet, strat.bridge-engine, strat.floor-flex,
  strat.floor-schedule, strat.floor-to-age, strat.full-gilt, strat.gilt-rotation (the way answers, its dials, "Use this");
  strat.choose (the switch keeps each way's own inputs); strat.compare (the ranking, "More columns"); strat.pages (the
  card: how it works, its dials, how it fails — the "three real starts in history" stay a planned note on the row until
  the history view lands); strat.costs (the cost line on a bought card). `ways.journey` flips to built (the lock writes
  the journey since 6.38.0; the way step shows the stage dates on the plan page's "Your plan" line).
- 6.41.0 (8b): pots.funds-to-test, pots.example-portfolio, pots.diversifiers, pots.bond-tent, test.optimise, test.try,
  strat.try-in-copy, test.explainers (the one-sentence explainers beside each run), and the four income rows of section 5.
  test.scenarios (named crashes), test.schedule and test.glidepath are not in step 8: they are the "Does it last?" extras
  of step 11's sweep, and the road's "left" list names them.

---

## 9. Decisions taken for this step (the owner can overturn any)

1. **One set of dial defaults = the engine's** (what runs when a value is absent). The planner's two disagreements
   (rotation's `cashYears` 3 on the page, 2 everywhere else; Floor & Flex's sleeve range 3–5 in Settings, 1–10 on the
   page — V7 takes the wider range with the 0.25 step) go in 6.40.0's corrections.
2. **`allocMode` keeps the planner's two values** ('risk', 'funds'); "your own split" is the £ amounts under 'risk', shown
   as a split when they are not a level. V7's copy value 'custom' is display only.
3. **"Use this mix" applies a cell** of "Which mix lasts best?" — one step beyond the planner (which only shows the grid);
   the ledger row asked for it.
4. **"What's different" lists the cut depth, the escalation months and the ISA policy**, which the planner leaves out;
   the planner's own Try gains the three lines through the lift.
5. **"Keep as a separate plan" from a Try is a create** through step 7's one `addDoc` call site (`keepCopy`), the copy
   unlocked and inactive, named "{name} · tried"; no new Firebase name, no change to rule 3c.
6. **The rotation dials run on the card** (the planner's page ignores two of them: a correction noted, the planner's page
   fixed through the same lift).
7. **The way step and the mix step are sub-steps of the plan page**, not steps of the rail's stage lists (STEPS in
   steps.js unchanged): "How the money is taken" and "The mix" are sections of "Your plan" that open to edit, like
   "About you", "Money that comes in anyway", "What you spend" and "Your pots and tax".
8. **8a does not wait for 8b**: until the mix step exists, a Pots & Valves card names the planner's Settings for the
   split, as the lock step named the planner before step 6.

## 10. Cost of the runs, said on screen

Opening the way step: 9 runs. A dial: 1. The mix's "what it does in a bad case": 1 each. "Which mix lasts best?": 8.
A Try: 1 (the spend-more lever up to 7). Each about half a second on a laptop, in the worker, the page free meanwhile;
every count is written where the figure is.
