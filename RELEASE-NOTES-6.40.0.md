# Release note draft — 6.40.0 (road step 8a: "How the money is taken")

A draft for the lead to fold into `src/releases.js` in the shape of 6.39.0's entry (title, summary, changes, corrections,
effects per tool, actions, notes). `package.json` and `src/releases.js` are not touched on the branch.

```js
{
  version: '6.40.0', date: '2026-10-21', engineVersion: '6.37.0',
  title: '"How the money is taken": the nine ways of drawing on your plan, each in the one verdict, with its dials; "Use this way of drawing" switches the plan in the preview',
  summary: 'The preview at /v7/ now shows the way the money is taken. "How the money is taken" on any saved plan runs all nine ways of drawing on that plan through the one test — every real stretch of markets since 1871 and 1,000 possible futures — and says each in the plan\'s own words: "lasts in 9 futures out of 10", what is typically left and the bad case (the worst 1 in 10), and for a way that buys its income what it costs of the pot today and what is left to grow. Your plan\'s way comes first, open, with every dial the planner shows for it anywhere; the other eight are ranked by how many futures out of 10 they last, with "Open" to see their dials, their figures for those dials and what can go wrong. A dial moved tries that one way again ("Tried in 1 run"). "Use this way of drawing" is the planner\'s own switch, field for field, in one write with Undo. A locked plan runs every card and never changes; a card opened there sets its figure beside the plan document\'s in one line.',
  changes: [
    'Preview, "How the money is taken" (#/plan/<id>/way): the nine ways of drawing — Pots & Valves, Buckets in order, Ladder & Ratchet, Bridge & engine, Floor & Flex, Floor the schedule, Floor to an age, then decide, Full index-linked gilt ladder, Gilt ladder + rotation — each run on THIS plan (its pots, its spending shape, its full length, its cut rules) through the one test, exactly the planner\'s Strategies Overview run; the cards fill in as they finish and "Ran the nine ways in N s" is said under them.',
    'Preview, each card: the way\'s promise in plain words; "lasts in N futures out of 10" with the on-course word and bar, the share of futures and the real starts (or "Every year is bought by contract" for the two contract ways); "Left at the end, at today\'s prices: typically £X; in a bad case (the worst 1 in 10) £Y"; for a bought way "Costs £Z of your pot today; £W left to grow"; for a way the pot cannot buy, the cost and the shortfall and no figure. The other eight ranked by futures out of 10, coverage breaking ties (the planner\'s own order); the ways that cannot be bought last.',
    'Preview, the dials (one set, the engine\'s defaults): Pots & Valves and Buckets in order carry the cut dials of "Does it last?" (cut spending in bad runs, how deep, the months below the path) and Buckets its refill band; Ladder & Ratchet the years bought up front, the income bolted on, when it buys more years (the band, or every five years) and the band; Bridge & engine the age the years are bought to and the years paid from cash first; Floor & Flex the bills a year, the age they are paid to, what the rest pays out (1–10% a year in quarter steps), the treats rule and the ratchet; Floor to an age its age; the two gilt ladders the years paid from cash first, the cash kept to the first April and whether the money left over is kept or invested; the rotation its age kept to, the escape (% below the all-time high) and the years before it is put away. The pension and ISA totals are the plan\'s pots, never dials. A card opened for a way the plan has a stash for starts from that stash; a dial moved tries the way again on the plan, "Tried in 1 run"; the tried figures stay until the card is closed. One card open at a time.',
    'Preview, "Use this way of drawing" with a confirm on the same screen ("Your plan will be drawn as {name}. Its dials as shown are kept with it; {old}\'s own settings are put away and come back if you return to it. The pots, the income and the mix do not change."): the planner\'s switch field for field in ONE write — the way, its params (the dials typed on the card over its stash), every way\'s stash with the outgoing way put away and dated, the mix\'s mode and funds list, the pots a restored funds list gives, the cut dials, and the plan\'s strategy block as the planner writes it — past the lock guard, with Undo; then "Does it last?" runs again on the saved plan.',
    'Preview, "More columns" under the cards: the planner\'s other columns on the same runs — worst 12 months, years covered, coverage, spent over the plan, bumpiness (% a year), the score — with "Rank by" (how many futures it lasts, what is typically left, the score, coverage) for the table only, and the score explained in one sentence: it never decides the order of the cards.',
    'Preview, a locked plan: every card runs, "Use this way of drawing" is never drawn, a card opened says one line — "Your plan as locked lasts {n} on {way}; {other} would have lasted {m}" — and nothing suggests unlocking. "Your plan as locked" links here as "Try another way (nothing changes)".',
    'Preview, "Your plan": the "How the money is taken" section now opens the step inside the preview ("Change this here"), as every other section does; no section hands over to the planner any more.',
    'Planner: the Strategies Overview, its engine worker and the strategy switch run the same code the preview runs (src/strategies/compareRunner.js compareAll, src/services/OneAnswer.js rankWays, src/services/PlanCommit.js switchPatch): one loop over the nine, one ranking, one switch — the same figures, the same fields.'
  ],
  corrections: [
    'Gilt ladder + rotation, the planner\'s strategy page: "Cash years first" started at 3; everywhere else (Settings, the engine when the value is absent) it is 2. The preview\'s card and the page now start at the engine\'s 2.',
    'Floor & Flex: the Settings box offered the sleeve rate from 3% to 5% and the strategy page from 1% to 10%; the preview takes the engine\'s wider range (1–10%, in quarter steps) and says the rate as a percent a year.',
    'Gilt ladder + rotation, the planner\'s strategy page: "Use this strategy" copied only some of the dials turned (the age kept to and the trigger, not the years before the escape is put away) and the page\'s own what-if run ignored the rotation dials altogether; both now go through the one switch reading (PlanCommit.dialParams: every key the strategy may keep), so the rotation dials run on the page and are kept by the switch. The same reading carries the ladder\'s trigger mode, the floor\'s age and the spare\'s growth, which the hand-written list left out.',
    'Floor & Flex\'s "bills paid to age": the Settings box started at 92 and the strategy page at the plan\'s own end; the preview starts at the engine\'s value when none is saved — the plan\'s end.',
    'The planner\'s Overview without a worker (the inline fallback) used to pause 30 ms between strategies to let the page breathe; it now runs the one loop straight through, saying each strategy\'s name before it. The figures are unchanged.'
  ],
  effects: {
    stress: ['None for existing plans. A plan whose way of drawing is switched in the preview arrives exactly as the planner\'s own switch leaves it: the new strategy and its params, the old one stashed under strategyState, the allocation re-derived from a restored funds list, the strategy block.'],
    strategies: ['The Overview\'s loop, its ranking and the switch moved into pure modules the planner calls; no figure changes. The rotation\'s page what-if now honours its three rotation dials.'],
    decision: ['None. The Decision copies of the strategy travel with the lock\'s seed as before.'],
    household: [],
    accumulation: [],
    budget: []
  },
  actions: [],
  notes: [
    'The preview prices a gilt ladder on the bundled yield curve (it loads no live prices); the planner prices it on the day\'s live figures when it has them, so a ladder\'s cost can differ there. The card says so.',
    'Opening the step costs nine runs of the one test (about five seconds on a laptop, in the worker); a dial costs one; the counts are written where the figures are. The result is kept per plan and per save, so a second visit does not run again.',
    'The two ways of the Pots & Valves family name the planner\'s Settings for the mix until "The mix" ships (road step 8b, 6.41.0).',
    'The registry\'s sentences for each way say "equities", "fails" and "real yields"; the preview says them as "shares", "runs out" and "today\'s prices" — the same sentence in the words the preview\'s guide allows.',
    'Engine unchanged (6.37.0): the lifts move code, they do not change numbers (gate 8a, tests/v7/plan/waysIdentity.test.js, holds the nine cards to the planner\'s loop on every unlocked fixture).'
  ]
}
```

## Decisions taken on the branch that the design left open (for the lead)

1. `WAY_WRITES` also carries `stressTool.settings.{disableProtection, protectionMult, consecutiveLimit}`: the Pots & Valves and Buckets cards have the cut dials (design 2.3) and the planner's strategy page writes them through the same switch (useSpecStrategy's patch, folded into `switchPatch`).
2. The root `strategy` block is written with `params` = the cleaned params the plan runs with (the Settings page's Save does this; the planner's strategy page writes `{}`), dated by the write's clock.
3. Only the dials typed on a card go into the switch, as the planner's page sends only the dials turned, so a key the plan lacks stays absent (an absent setting means the old behaviour); "kept" typed explicitly for the spare stores `false`.
4. A card opened runs once more only when the values its dials show are not the ones the comparison ran it with (a stash of its own, or a dial typed); the plan's own card never does. A dial is tried once it has stood still for 350 ms, one run per change, never per keystroke.
5. The promise and "what can go wrong" sentences live in `src/v7/copy/way.js` in V7's words (the registry's say "equities" and "fails", banned on a V7 screen); a test holds every way to having both, and the nine names equal `STRATEGY_NAMES`.
6. "Bridge to age" is labelled "Every year bought to age" (the word "bridge" is banned outside the way's name); "How it fails" is headed "What can go wrong" (the planner's own column heading; "fails" is banned in the result scope).
7. The `ways.journey` row is flipped under step `s5-lock` (the lock writes the journey since 6.38.0), the twelve strategy rows under a new step `s8-way`.
