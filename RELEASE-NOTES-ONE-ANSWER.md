# Release-note bullets: one "will it last" answer per plan

For the next `src/releases.js` entry (a MINOR bump: figures a user can see move). Written 17 Oct 2026 against
research/v7/v6-usability-audit.md §1 problem 1, §1 problem 7, §2.5 and §5 decision 2, option (a), approved by the owner.
`package.json` and `src/releases.js` are NOT touched by this change; these are the words to put in.

## title / summary

- **title:** One answer to "will the money last?"
- **summary:** Every screen of a plan now shows the same chance of lasting — the one stress test all nine strategies
  use, run with your own spending-cuts setting and your plan's full length. The first tab, the strategy page, the
  Strategies ranking, Try a strategy, the couples check and the plan document can no longer disagree. The bad case is
  always the worst 1 in 10; History and Scenarios explain the test instead of giving a second figure.

## changes

- The Stress tester's first tab (now "Will it last?") shows the one test's figures: the chance of lasting over 1,000
  possible futures, said in plain words ("lasts in 9 futures out of 10"); what is typically left and what is left in a
  bad case (the worst 1 in 10); and the income cuts — in how many futures income was cut, by how much a year, for how
  long. For Pots & Valves and Buckets in order a line underneath says what the same futures would do without the cuts.
- The History tab ("What if you had retired into a bad year?") replays the one test's own real start years: the hardest
  starts in the record since 1871, shown as an unfair test, and the famous bad years (1929, 1937, 1966, 1973, 2000,
  2008) one at a time. It gives no second percentage and never says "FAILED".
- The Scenarios tab explains the named stresses — what each decade did to shares and prices, and what retiring into it
  would have done to this plan, read from the one test's real history starting that year. The synthetic worst case is
  described, not run. The full gilt ladder keeps its inflation table.
- The Strategies ranking lists the nine strategies by how many futures out of 10 each lasts, in plain words, with
  what is typically left and the bad case beside it. The volatility-adjusted score, the coverage ratio, "spent over the
  plan" and bumpiness are kept under "More columns".
- "Compare allocations (Pots & Valves)" runs each of the six splits through the same one test and shows futures out of
  10 with the bad case, instead of its own 1,000-run sweep.
- The plan document keeps the figure it was locked with — it is never rewritten. When today's test on the same plan
  gives a different figure, the document page says so in one line ("worked out under the earlier test").
- The explainer ("What is this doing?") describes the one test.

## corrections

- One plan gave a different chance of lasting on almost every screen. The Monte Carlo tab ran its own futures (5-year
  blocks of 1928–2024), the Historical tab its own start years from 1928, the Scenarios tab five looped decades, the
  Strategies ranking ran with the cuts switched off ("level footing"), the couples check ran its own Monte Carlo for
  two Pots & Valves plans, and "Am I on course?" searched the old Monte Carlo for a Pots & Valves plan. All of these
  are retired; every figure is the one test's.
- "The worst case" meant the worst of 1,000 futures on the Monte Carlo tab and the worst 1 in 10 elsewhere. It is the
  worst 1 in 10 everywhere now.
- The Historical and Scenarios tabs marked real start years "FAILED" and marked a 1966 start "OK" while 375 of 468
  months were cut. Neither word is used; a start that ran out says at what age, and a cut says how much and for how long.
- The ranking's "level footing" toggle quietly changed the Pots & Valves and Buckets rows against what the plan's own
  page showed. The rows now run the plan's own cuts setting, and the page says what that setting is. A what-if with
  the cuts switched off is still one click away in Try a strategy.

## effects (a plan saved under the previous version)

- **stress:** the figure on the first tab moves to the one test's: for a Pots & Valves or Buckets plan with cuts on it
  is usually a point or two higher than the old Monte Carlo tab (the old run used a shorter history and different
  blocks); the Historical tab's 100% is gone (it was a different, kinder test); the Scenarios tab's "FAILED" rows are
  gone. The per-tab "Simulation years" boxes are gone: the plan's full length runs everywhere. Nothing in the plan's
  saved settings changes.
- **strategies:** the ranking's Pots & Valves and Buckets rows now run with the plan's cuts setting — for a plan with
  cuts on they read higher than before (the guest example: 91% → 96%); the order can change. The score is unchanged in
  value and lives under "More columns". The strategy page's figure is unchanged (it already ran the one test).
- **decision:** no change to the recorded months. The plan document keeps its stored figure; the page may now show the
  "earlier test" line beside it.
- **budget:** no effect.
- **accumulation:** "Am I on course?" for a Pots & Valves plan now searches the one test (200 futures, every sixth
  history, as every other strategy already did) for the pot that lasts in 9 futures out of 10; the pot it names can move
  by a few thousand pounds against the old search.
- **household:** the couples check runs both plans through the one test, paired future for future, whatever the
  strategies; for two Pots & Valves plans the three figures move to the one test's (a partner who is still working is no
  longer year-shifted inside the run; the Timing block projects their pots to retirement instead, as everywhere else).

## actions

- Nothing to enter. Re-run the first tab once to see the one figure; a locked plan's document stays as it was.
- If you used the ranking's "level footing" view: run Try a strategy with "Spending cuts: Off" for the same what-if.

## notes

- The test itself has not changed: every strategy's arithmetic, the golden outputs, the plan corpus snapshot and the
  app-paths pin are byte-identical. What changed is which test each screen shows.
- Engine version unchanged.
- V7's answers (the quick questions) are a separate question — "from today, over my whole life", cuts off, V7's own
  saving engine — and can still differ from the planner's figure; the "Save this as a plan" dialog states both. See
  research/v7/v6-usability-audit.md §2.5.
- Deleted: the Monte Carlo tab's own run, the Historical tab's own run, the looped Scenarios, the allocation optimiser
  (and its "Apply this split"), the "Compare allocations" button on the Historical tab, the ranking's level-footing
  toggle, the couples check's own Monte Carlo. index.html's inline script is 786 lines shorter (9,313).

## Before → after on the corpus (chance of lasting, %; evaluated at the corpus clock 2026-09-30, today's market data)

"Old Monte Carlo tab" and "old Historical tab" are the retired runs; "old ranking" is the level-footing row; "page / Try /
document / NEW" is the one test, which the strategy page and the document already showed. For a plan not on Pots &
Valves or Buckets the first tab already showed the one test.

| Fixture | Strategy | Old Monte Carlo tab | Old Historical tab | Old ranking (level footing) | Page / Try / document → NEW everywhere | Typical left → bad case (worst 1 in 10) |
|---|---|---|---|---|---|---|
| 11-guest-demo (the guest example) | Pots & Valves, 39 y, cuts on | 93.8 | 100 | 90.7 | **95.9** | £1,806,699 → £135,978 |
| 02-pnv-draft | Pots & Valves, 33 y | 98.6 | 100 | 94.9 | **98.8** | £917,549 → £210,085 |
| 04-buckets-running | Buckets in order, 30 y | 98.2 | 100 | 95.5 | **98.3** | £968,682 → £157,539 |
| 05-saver-committed | Pots & Valves, 35 y | 91.4 | 96.8 | 83.9 | **94.9** | £751,621 → £67,975 |
| 06-pre-6.4-no-timing | Pots & Valves, 35 y | 99.1 | 100 | 95.5 | **98.8** | £1,251,244 → £283,840 |
| 08-dotted-keys | Pots & Valves, 28 y | 99.8 | 100 | 97.5 | **99.5** | £484,381 → £139,234 |
| 09-couple-a | Pots & Valves, 30 y | 95.4 | 97.1 | 89.1 | **96.6** | £326,979 → £42,360 |
| 10-couple-b | Pots & Valves, 32 y | 99.7 | 100 | 97.2 | **99.5** | £456,549 → £115,781 |
| 12-lumpy-db-gia | Pots & Valves, 32 y | 100 | 100 | 99.5 | **99.9** | £985,715 → £327,450 |
| 03-gilt-ladder-runup | Full index-linked gilt ladder, 33 y | (one test already) | — | 100 | **100** | £104,337 → £104,337 |
| 07-pre-6.13-flat-params | Gilt ladder + rotation, 34 y | (one test already) | — | 86.4 | **86.4** | £527,819 → £125,956 |

01-fresh-default has no configured Stress settings and runs nothing. The audit's 90 / 100 / 86 / 93 / 96 for the
guest example were read on 12 Oct 2026 on that day's market data; the pattern is the same.
