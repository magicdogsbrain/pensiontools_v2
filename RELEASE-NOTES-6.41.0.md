# Release note draft — 6.41.0 (road step 8b: "The mix" and Try a change in the preview)

For the lead: the finished `src/releases.js` entry, in the shape of 6.40.0's, to paste at the top of the list with the
version bump in `package.json`. `tests/releases.test.js` holds the two in step. Engine unchanged (6.37.0).

```js
  {
    version: '6.41.0', date: '2026-10-21', engineVersion: '6.37.0',
    title: '"The mix": how the pension is held, in the preview — a risk level, your own split or the funds to test, the slice of gold and trend funds and the bond tent each tried in a bad case, "Which mix lasts best?" with "Use this mix"; and Try a change of your own on "Does it last?" with "Use this" and "Keep as a separate plan"',
    summary: 'The preview at /v7/ now has "The mix" on any saved plan drawn as Pots & Valves or Buckets in order: how the pension is held — at a risk level (cautious, balanced, adventurous, each with the £ it gives on this plan\'s pot), as your own split (four percents to 100, shown in £), or as the funds to test (typed with the bundled search, or a list pasted from your platform, each line counted as shares, bonds, gold and trend, or cash, with "What is this?" for a line not recognised and "Left out, and why"). The slice of gold and trend funds and the bond tent each have "What it does in a bad case": one run of the one test with it the other way, the bad case (the worst 1 in 10) beside the plan\'s own. "Which mix lasts best?" runs the one test on eight splits — your mix and the three levels, tent off and on — and says each in futures out of 10 with what is typically left and the bad case, the best marked; "Use this mix" writes that split in one write with Undo. On "Does it last?", "Try a change of your own" is the planner\'s whole Try a strategy in plain words — the way the money is taken, the pension pot, the ISA and whether it is held back, the income as shaped or a flat figure a month after tax, the years, cuts in a slump and how deep and for how long — tried in one run on a copy of the plan, "What\'s different" line by line, "Use this" as one write of exactly the fields that differ with Undo, and "Keep as a separate plan" for a copy of the plan as tried, named "{name} · tried", never locked. A locked plan reads its lines from the plan document, tries everything and changes nothing. The income picture on "What you spend" now draws the rows of money that comes in anyway under the steps while they are set, the budget\'s total as a mark, lump sums and one-off spends as marks at their years, and says "Below the income you get anyway" while a step is.',
    changes: [
      'Preview, "The mix" (#/plan/<id>/mix) for Pots & Valves and Buckets in order (the seven bought ways say why the mix does not apply, with the link to "How the money is taken"): "How it is held" — a risk level (the planner\'s three presets, each saying "£X shares, £Y bonds, £Z cash" on this pot; with the slice on, the planner\'s diversifier presets), your own split (shares, bonds, gold and trend funds, cash as whole percents adding to 100, the £ said under them), or the funds to test. Stored exactly as the planner stores it: the £ amounts and allocMode risk for a level and a split, allocMode funds for a list.',
      'Preview, the funds to test: a line typed (ticker or name through the planner\'s own bundled search, the value, held in the pension, an ISA or an ordinary account, "Counted as" from the catalogue or your answer) or a table pasted from a platform (any layout: the page looks for a name, units, a value and a ticker; every line read is listed, each line not recognised asks "What is this?", "Left out, and why" names every line that did not become a fund and the reason; "Add these lines to the list" merges them as the planner does). The list becomes the split the plan is tested on, ISA lines filling the ISA (PortfolioTagger.mixFromFunds, the planner\'s own rebuild); one list per way of drawing, put away and brought back with the way. "Show an example list for this level (not advice)": the planner\'s model list for the level, filling nothing in.',
      'Preview, "Keep a slice in gold and trend funds" (yes/no) and "Use the bond tent" (yes/no, "Shares start lower and rise to your mix over the first N years", the level the tent rises to for a funds list; "Buckets in order ignores the tent" said and no tent try offered there), each with "What it does in a bad case": one run of the one test with it the other way — "With the tent, in a bad case (the worst 1 in 10) £X is left at the end; without, £Y. With it the plan lasts {words}; without, {words}." The plan\'s own figure comes from "Does it last?" when it is held, else the plan as saved is run too and "Tried in 2 runs" says so.',
      'Preview, "Which mix lasts best?": the planner\'s Compare allocations with the plan\'s own mix first — your mix with the tent off and on, then cautious, balanced and adventurous with the tent off and on — eight runs of the one test in the worker with a progress bar, each cell in futures out of 10 with the share of futures, what is typically left, the bad case and the £ of the split, the best cell marked, "Tried in 8 runs (N s)". "Use this mix" on any other cell, with a confirm naming the split in £ (and that a funds list is put away for this way), writes the cell\'s amounts, allocMode risk and the tent in one write with Undo; then "Does it last?" runs again on the saved plan.',
      'Preview, "Save the mix": one write of exactly the eleven mix fields that change (stressTool.settings equityMin, bondMin, cashTarget, diversifierStart, subAsset, allocMode, taggedFunds, isaBalance, equityGlideEnabled, glideEndgame, strategyState — the way\'s stash as the planner\'s switch writes it) and lastModified, past the lock guard, with Undo; the plan page\'s "Your plan" gains a "The mix" section with "Change this here"; "How the money is taken" no longer names the planner\'s Settings for the split.',
      'Preview, "Try a change of your own" on a saved plan\'s "Does it last?" (closed until pressed): every box of the planner\'s Try a strategy in plain words — the way the money is taken (the nine), the pension pot (the shares, bonds and cash scaled to it in their saved proportions, the slice left as it is), the ISA and whether it is held back, the income as shaped or a flat figure a month after tax (saved as a figure a year before tax through the plan\'s own tax sum), the years (5 to 45), cuts in a slump (as saved, on, off), how deep the cut is, the months at half the cut. "Try it" runs the one test once on a copy of the plan in the worker — the verdict in the plan\'s own band, "Tried in 1 run" — and "What\'s different" names every box that differs from the plan as saved, one line each; with none, "This is your plan as saved, run through {way}". A box moved after the try marks the result stale until "Try it" again.',
      'Preview, "Use this" on a tried change (unlocked plans), with a confirm saying in how many ways the plan changes: ONE write of exactly the fields that differ, composed from the steps\' own lists — the way through the planner\'s switch (its dials, the stash, the strategy block), the pots, the ISA and its policy, a flat income as the planner\'s own level shape (the base figure, no steps, no schedule), the years, the cuts and their depth and months — past the lock guard, with Undo; then "Does it last?" runs again on the saved plan.',
      'Preview, "Keep as a separate plan" on a tried change: the planner\'s "Try this strategy in a copy" — the plan as tried written as a new plan through the one create (the account\'s plans, or this browser window without an account: the same room, the same free-time rule as "Keep this as a plan"), named "{name} · tried" made unique, not the active plan, never locked (a locked plan\'s copy is made unlocked, its document, record and archives not carried, its history empty); then "Kept as ‘name’ in your account/this browser window", "Open it" and "Lock this plan?".',
      'Preview, "What you spend" on a saved plan: the picture draws the rows of money that comes in anyway (the State Pension, a pension that pays itself, other income) under the steps while they are set, the budget\'s total a month as a short dashed mark named in the key (a guide only), lump sums coming in and one-off spends going out as marks under their years with the amount in the key, and "Below the income you get anyway from age N" while a step is below those rows. Drawing only: nothing is written.',
      'Planner: the mix\'s reading and writing, the funds list\'s rebuild, the fund search, the Compare allocations grid, the Try a strategy copy and its "What-if, not your plan" list now run the same code the preview runs (src/services/GlidepathService.js mixFromLevel, levelOfMix, mixCells; src/services/PortfolioTagger.js mixFromFunds; src/services/FundCatalogue.js searchFunds; src/strategies/compareRunner.js compareMixes; src/answers/plan/lastsRun.js trySettingsOf; src/answers/plan/lasts.js tryDifferencesOf): one reading, one rebuild, one copy — the same figures, the same fields.'
    ],
    corrections: [
      'Try a strategy, the planner\'s "What-if, not your plan" list: it named the strategy, the pot, the ISA, a flat income, the years and the cuts on/off, and left out three boxes it runs — the ISA policy, the cut depth and the escalation months. All nine are now listed, in the preview and in the planner.',
      'Try a strategy, the planner\'s pot box: it started at the shares, bonds and cash added up, so a plan whose pension total is pinned (sippTotal) tried a different pot from the one the plan runs on unless the box was retyped. It now starts at the plan\'s pinned pension total, falling back to the three pots; "What\'s different" reads the same figure.',
      'Try a strategy: a cuts difference was said for Pots & Valves only; it is now said for both ways of the family (Buckets in order runs the same cuts). A flat-income difference was said only when the plan had steps; a flat figure that differs from a flat plan\'s own is now said too.',
      'The planner\'s "Which mix lasts best?" grid (Compare allocations) keeps its six cells; the preview adds the plan\'s own mix with the tent off and on as the first row, so a plan held as its own split is compared as it is.'
    ],
    effects: {
      stress: ['None for existing plans. A plan whose mix is saved in the preview arrives exactly as the planner\'s Settings would leave it: the £ amounts, allocMode, the funds list, the ISA balance a list gives, the tent and its endgame, and the way\'s stash. A plan changed through "Use this" arrives as the planner\'s own switch, Settings and income boxes would leave it. A copy kept from a try is a new, unlocked plan; the plan it came from is untouched.'],
      strategies: ['The mix\'s presets, the funds rebuild, the compare grid and the what-if copy moved into pure modules the planner calls; no figure changes. The planner\'s what-if list gains three lines (above).'],
      decision: ['None. A flat income tried and used writes the Decision copy of the base income as the planner\'s income box does.'],
      household: [],
      accumulation: [],
      budget: ['None. The budget\'s total is read for the mark on the picture; nothing is written to it.']
    },
    actions: [],
    notes: [
      'The preview\'s mix never looks a fund up outside the page: the search is the bundled catalogue, a pasted table is read on the page, and nothing pasted leaves it.',
      'The costs are said where the figures are: a bad-case try is one run (two when "Does it last?" is not held for the plan), "Which mix lasts best?" eight, a change tried one. The results are kept per plan and per save; a second visit does not run again.',
      'The ISA policy\'s third choice in the planner ("Draw as configured") is the planner\'s only; the preview offers "as saved" and "held back", since a saved plan already carries its own policy.',
      'The three parts of the spending picture that are not cheap stay where they were: the motion between shapes, "Turn a lump sum into income" and dated lump sums as a write go to the step-11 sweep.',
      'Engine unchanged (6.37.0): the lifts move code, they do not change numbers (gate 8b, tests/v7/plan/tryIdentity.test.js, holds the tried copy and the tried verdict to the planner\'s on every fixture, each box moved alone and all together).'
    ]
  },
```

## Decisions taken in the build (the owner can overturn any)

1. **The Try boxes are closed until "Try a change of your own" is pressed** — a locked plan's "Does it last?" keeps its
   "no box before a lever is opened" rule, and the three levers stay first.
2. **The pot box starts at the plan's pinned pension total** (`strategyParams.sippTotal`), else the three pots — in the
   preview and, as a correction, in the planner's reset box. "What's different" reads the same figure, so an untouched
   try says nothing on a plan whose total is its three pots.
3. **The ISA policy offers two choices in the preview** (as saved, held back); the planner's third ("Draw as configured",
   mapped to 'bridge') is kept for the planner only.
4. **Cuts differences for both ways of the family; a flat-income difference whenever the flat figure differs** — listed
   as corrections.
5. **The slice the other way:** off → its money goes back into shares, bonds and cash in their proportions; on → the
   nearest level's four-way table (the planner's diversifier presets).
6. **A bad-case try runs the plan as saved too when "Does it last?" is not held for the plan**, said as "Tried in 2 runs";
   with it held, one run and the plan's own figure beside.
7. **`mixCells` lives in GlidepathService** (compareRunner re-exports it) so the mix's words can recompute a cell's £
   without reaching the engine. The planner's grid stays at six cells (`own: false`); the preview's at eight.
8. **A flat income tried and used is written through the spend step's list** (`SPEND_WRITES`: the base figure, the level
   shape, no steps, no schedule, and the Decision copy of the base figure), since the income step's list holds no
   income-shape key.
9. **`keepCopy` strips the lock record, the plan document and its archive, the plan of record and its archive, the journey,
   the history and the tax years** — the copy is a fresh, unlocked plan; "{name} · tried" is made unique against the names
   taken; `isActive: false`. `F.collection(` and `F.addDoc(` stay at one call site each (`scenariosOf`, `add`).
10. **`mixFromFunds` keeps the planner's `ticker && value > 0` filter.** A card with a category but no ticker passes the
    mix's own check yet is dropped by the rebuild: the card's "Counted as" without a ticker is accepted for the list but
    does not move the split. To resolve in the sweep (either require a ticker or let a category alone count).
11. **"Try it" with a box wrong marks the boxes** (their problems show) and runs nothing — it never asks for a write.
12. **The locked plan's tries** (the slice, the tent, the eight cells, a change) run against today's test with the
    document's figure beside; "Use this mix" and "Use this" are never drawn there; "Keep as a separate plan" is offered
    (the copy is made unlocked).
