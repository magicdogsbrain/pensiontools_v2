# What you hold, and the move — the design for road step 10 (6.43.0)

Written 21 Oct 2026 by the lead, from a fact map of the planner (HoldingsRecord.js, HoldingsPaste.js, Holdings.js,
TransitionPlanner.js, TransitionView.js, GiltLadderPlan.js, RotationStatus.js, index.html 7421–7577 and 8145–8227) and the
design notes (v6-usability-audit.md §2.9, rail-screens-language.md §1.5–1.6, your-plan.md §2.2, roadmap.md 9 and 16 Sep).
It is the brief for one builder. The owner can overturn any decision in §9.

**The words.** "What you hold" (the record of today's actual holdings, line by line by wrapper) and "Moving to your plan's
mix" (the buy and sell list, the cash to hold, the schedule and the tick-offs). On screen the wrappers are "Pension",
"ISA", "Other account" and "Cash". Never "holdings ledger", "transition", "portfolio", "rebalance" (banned.js).

**The owner's ruling that governs the whole step (16 Sep 2026, 6.13.0/6.13.1):** the funds a plan is *tested on* are never
what the person *holds*. `scenario.holdings` is the one record of what you hold; `stressTool.settings.taggedFunds` is
"the funds to test" and nothing more. There is no import path from one to the other — not even as a question. What you
hold starts empty; the person types it or pastes it.

---

## 1. The one record, as the planner keeps it (no new shape)

`scenario.holdings = { version: 1, updatedAt: 'YYYY-MM-DD' | null, source: 'typed' | 'paste' | 'imported' | 'none',
offerDismissed, lines: [] }`; a line is `{ wrapper, ticker, name, sedol, units, value, ocf, contribution, subClass, kind, asOf }`
with `wrapper` in SIPP | ISA | GIA | CASH and `kind` in fund | gilt | cash (HoldingsRecord.js). Every field present, null
not undefined. A line with no ticker, name or SEDOL is dropped by `normaliseLine`. V7 reads and writes exactly this: the
whole `holdings` object as ONE field in one write (the planner's `saveActiveHoldings` writes it whole too), plus
`lastModified`. `updatedAt` is the day of the write (the effect's clock, passed in as `today`); `source` is 'typed' after a
typed change and 'paste' after a paste, 'none' when the last line goes. The lock snapshot `planDocument.holdingsAtLock` is
never touched.

**The lock:** the planner's guard (LockedPlanGuard.js 37–45) leaves `holdings` and the move's tick-offs editable on a
locked plan, because they record what is true today, not what the plan is. V7 does the same (decision 1): these two
writes pass the guard on a locked plan; everything else on a locked plan stays refused.

---

## 2. `#/plan/<id>/hold` — "What you hold"

A plan sub-step (PLAN_SUB_STEPS gains `hold`; the rail step `hold` keeps its place and its number; the plan page's
"What you hold" section gets "Change this here" → the step, and `OpenPlace` keeps `hold` for "Everything else" only).

**2.1 The screen, top to bottom.**
- The headline the plan page already says: "Pension £X, ISA £Y[, other account £Z][, cash £W]. Updated {date}" or
  "Not recorded yet". Under it, one sentence: "What you actually hold today, by account. The plan is tested on its own
  mix; this record is separate, and nothing here is copied from the plan." (the ruling, in the person's words).
- **The lines, grouped by wrapper** in the order Pension, ISA, Other account, Cash. Each line: name (and code), units,
  value in £, "Counted as" (shares / bonds / gold and trend / cash / a gilt by its code / don't know — the kind and
  subClass as the planner's `tagPortfolio` and `categorise` give them), "as of {date}" when the line carries one, and
  for a saver a "New money a month" £ box (`contribution`) and a yearly charge % box (`ocf`), the planner's two extra
  fields. Edit in place; a changed line is one write of the whole record. Remove is a button with a confirm ("Remove
  'VWRL' from your ISA? Nothing is sold; this only changes the record."); it is never automatic.
- **Add a line:** typed — a fund by code or name through the bundled search (`searchFunds`, as the mix step), a gilt by
  code, SEDOL or maturity year (for a ladder plan the plan document's own order sheet is searched first, as
  `matchRows` does), or cash as an amount; the wrapper chosen from the four. A filled line saves at once.
- **Paste a table:** the mix step's paste block, re-pointed at this record: `parsePaste` → `matchRows` → every line
  listed, a line not recognised asks "What is this?" (the five choices), "Left out, and why" names every line that did
  not become a holding (totals, headings, blank cash lines) with the reason; "Add these lines to {wrapper}" merges with
  `mergeLedger` (update by code or SEDOL within the wrapper, else add; never a gilt over a fund). The lines the merge
  did not see this time are listed under "Not in what you pasted — sold?" with a "Remove" each; nothing is removed by
  itself. The wrapper choice offers all four (the planner offers three; CASH is added, decision 3).
- **What you hold, as a mix:** `proportions` → "Shares N%, bonds N%, gold and trend N%, cash N% — on £X across your
  accounts" (`describeMix`), the weighted yearly charge, "Not counted: {lines with 'don't know'}". For a saver: "New money
  goes: £a a month to shares, £b to bonds…" (contributions by bucket) — this is the "where new money goes" sentence the
  move step relies on (§3.4).
- A locked plan: fully editable (§1). The plan document's snapshot is named once: "Your plan was locked with
  {Pension £X…} recorded on {date}."

**2.2 The write.** `HOLD_WRITES = ['holdings', 'lastModified']`; `WRITES.hold`. One write per change, Undo on the toast
(the previous record whole). A window plan (guest) writes through the one setItem. Nothing is run on this step.

**2.3 Nothing runs; nothing is copied.** No "copy the funds to test", no "test on what I hold" (the owner has not asked
for it; roadmap.md 244). The only place the record meets a run is §3.3's optional one-run comparison.

---

## 3. `#/plan/<id>/move` — "Moving to your plan's mix"

A plan sub-step (`move`); the plan page's "Moving to your plan's mix" section opens it. The target is always the **plan
document** (the plan as locked), never live settings: `targetHoldings(doc, { today, params, runUpMonthly })`.

**3.1 Not locked yet.** The step says: "Set when the plan is locked. The move is worked out against the plan document,
which the lock makes." with the link to the lock step; nothing else is drawn (the planner's Transition tab is hidden in
the same stages).

**3.2 On its face, first:** "Optional. Skipping it means what you hold may not match what the plan was tested on." Then
status as the planner's: "Done — what you hold matches the plan's mix", or "{held}% of the plan's mix held", or for a
ladder "{bought} of {rungs} gilts bought", with the run-up months when the plan has them (`moveInputs`).

**3.3 What skipping it costs — one run, optional (decision 4).** For a pot plan (Pots & Valves family, Floor & Flex…):
a button "What if I keep what I hold?" runs the one test once on a copy of the plan with the mix *as held* (proportions
of the record → equityMin/bondMin/cashTarget/diversifierStart on the same pot; the way and everything else unchanged)
and says it beside the plan's own verdict: "Tested on the mix you hold today (shares 71%…), the plan lasts in N futures
out of 10; on its own mix, M." Nothing written; "Tried in 1 run". For a ladder plan no run: the cost is the years the
rungs you have not bought would pay — "{k} tax years ({2031/32}–{2036/37}) have no gilt bought yet"
(`diffHoldings.buy` → `taxYears`). If the record is empty: "Nothing recorded yet — record what you hold first" with the
link; no run.

**3.4 The saver's rule (new in V7; decision 5).** While the plan's start is more than `APPROACHING_YEARS` (5, LifeStage.js)
years away — stage `saving` or `committed-saving` — the buy and sell lists and the schedule are NOT drawn. The step says:
"You stop work in about {N} years. Until about five years before, the move is just where new money goes." and shows
§2.1's "New money goes…" sentence, the plan's mix beside the held mix, and "The move itself starts around {month year}".
From `approaching` on, the full step. The planner keeps its own behaviour (it schedules from today); V7 is the one that
waits.

**3.5 The lists (from `approaching`).** "Cash to hold now" (the document's cash: the run-up, the bridge, the spending
years — each named); then **Buy** and **Sell** as the planner's two tables (`diffHoldings` with the 2% tolerance; ISA,
other account and cash lines always "left alone"; spare pension cash never a sell): what, how many units or how much,
about £, why (one line), and a **Done** tick each. A tick is one write of the whole `transition` object
(`{ done: { [key]: 'YYYY-MM-DD' } }`, the day from the effect's clock); unticking removes the key (one write of the
object without it — never `deleteField`). Then "Already held" and "Left alone"; the totals (to buy £, to sell £, the
shortfall if any); **When** — the schedule (`sequence`: cash first, then rungs by maturity, then the mix; sales in
three-month tranches; new money used first) as "By {month year}: {action}" lines; and the planner's rules on wrappers,
tax, units and decision points as a closed block "How to read this". Last line always: "Illustration, not advice.
Nothing here places an order."

**3.6 A ladder plan: the order sheet.** The rungs from the plan document's `orders` (never recomputed): #, what to buy
(name), code, SEDOL, matures, pays (the tax years it funds), nominal, the price and cost at lock, and "bought" / "not
yet" from the record (via `diffHoldings`). Under it "Gilt ladders explained" as a closed block: the planner's
explanation (index.html 2904–2916, lifted to copy) with the worked example taken from this plan's own first rung
(ledger row `strat.gilts-explained`).
**The State Pension gate (decision 6):** when the document was sized on an assumed State Pension (`spAssumed`), the sheet
opens with its warning first — "This sheet is sized on an assumed State Pension of £X a year. Enter your own forecast
figure and date (About you) and lock the plan again before buying." — and the nominal and cost columns are held back
behind "Show the sheet anyway". The rungs, codes and maturities are always shown. A locked plan is never changed by
this; re-locking is the person's own act.

**3.7 Ladder + rotation: the watch and the ticket.** For `gilt-rotation`, the rotation watch (`rotationStatus`: armed /
disarmed / fired; the block of rungs it would sell and the years; the trigger — a fall of {30}% from the all-time high —
and today's level against it) with the index figures from the equity snapshot the shell already loads: the effect fetches
`./data/equity.json` as the planner does, falls back to the bundled snapshot, and passes `{ level, ath, asOf }` into the
reader; the date is said ("Index as of {date}"). When fired, the sell ticket as the planner prints it (which rungs,
nominals, the proceeds, where the money goes). **The guided switch itself hands over to the planner** (decision 7):
"Make the switch in the planner" → `OpenPlace` place `rotation` (the strategy page's rotation section). The write it
makes (`borrowedFloor` and `floorToAge` into `stressTool.settings`, `planDocument.rotation`) changes a locked plan's
frozen settings; that is the planner's own one exception and the owner's own plan feature, and it stays there until the
owner rules on it for V7.

**3.8 The write list.** `MOVE_WRITES = ['transition', 'lastModified']`; `WRITES.move`. Passes the guard on a locked plan
(§1). Undo on the toast.

---

## 4. The plan page and the hand-overs

- The "What you hold" section: "Change this here" → `#/plan/<id>/hold`. The "Moving to your plan's mix" section: "Open
  it" → `#/plan/<id>/move`. Both lose "in the planner".
- `OpenPlace` PLACES keep `hold` and `move` (the planner's Transition tab) for "Everything else" and for the rotation
  switch (`rotation` added, → the strategy page).
- The locked rail's stations 4 and 5 (rail-screens-language.md §1.6) read as before from `holdStep` / `moveStep`.

---

## 5. Lifts out of index.html (pure, the planner re-pointed, identical results)

| Planner code | Lifted to | Called by |
|---|---|---|
| `persistHoldings` (updatedAt/source stamping) + `addHoldingLine` / `updHolding` / `removeHolding` | `HoldingsRecord.js`: `holdingsWith(record, change, { today })` → the next record (add / edit / remove / merge a paste), `stampHoldings(record, today)` | planner handlers, V7 `hold.js` |
| the paste overlay's apply (`:7464`) | `HoldingsPaste.js`: `applyPaste(record, rows, answers, wrapper, { today })` | planner, V7 |
| `toggleTransitionDone` | `TransitionPlanner.js`: `tickMove(transition, key, dateIso)` / `untickMove(transition, key)` | planner, V7 `move.js` |
| `giltOrderSheetHtml` rows (`:5848–5872`) | `GiltLadderPlan.js`: `orderSheetRows(doc, holdings)` → `[{n, name, tidm, sedol, matures, pays, taxYears, nominal, cleanPrice, cost, bought}]` | planner's HTML, V7 |
| `loadTransitionUI` inputs | already `PlanReading.moveInputs` | — |
| `rotationWatchHtml` figures | `RotationStatus.js`: `rotationWatch(doc, { today, ageToday, index: { level, ath, asOf } })` | planner, V7 |

`today` is always passed in: every lifted function loses its `new Date()` default on the V7 path (the planner wrappers
keep reading the clock). `TransitionPlanner.js` may keep its gilt snapshot import (bundled data, no fetch).

---

## 6. Pure readers and writers under `src/answers/plan/`

- `hold.js`: `holdOf(plan, { today })` (the lines by wrapper, the mix sentence, the saver's new-money sentence, the lock
  snapshot line), `checkHold`, `holdPatch(plan, change, { today })` → `{ ok, patch: { holdings, lastModified }, previous,
  line }`, `readPaste` (shared with mix.js: move the paste reading to `src/answers/plan/paste.js` and import it from
  both). No clock, no window.
- `move.js`: `moveOf(plan, { today, index })` (§3.1–3.7 as data: status, the cost line, the saver's rule, the lists, the
  schedule, the order sheet, the watch and ticket), `tickPatch(plan, key, { today, done })`.
- `moveRun.js` (lazy, worker): `runHeld(plan, { today })` — §3.3's one run on the held mix, through the one test and
  `oneAnswer` only.

---

## 7. Tests, states, pictures, words

- **Gate 10 — "the record round-trips byte for byte"** (`tests/v7/plan/holdIdentity.test.js`): on fixtures 03, 04, 05
  and 12 (the four with a record), reading the record in V7 and writing it back unchanged gives a `holdings` object
  byte-identical to the fixture's; each change kind (add typed, edit, remove, paste-merge of the fixture's own lines
  re-pasted as a table) equals the planner's lifted function on the same input; and on 03 (ladder, 8 lines) and 04/05
  (a mix) the buy/sell/held lists, the progress and the schedule equal `TransitionPlanner` with the same `today`, and the
  order sheet rows equal the planner's. Pins hash with numbers rounded to a millionth (Node 20 and 24 differ in a last
  digit). Keep it under a minute: no stress runs in the gate except one `runHeld` on fixture 04 against `stressTestStrategy`
  on the same settings.
- Render tests `holdRender` / `moveRender`; shell tests `hold` / `move` (reducer, lanes, declaredOnly, the guard letting
  these two writes through on a locked plan and refusing any other, Undo, the paste answers, the tick/untick); the
  property test on the writes; browser specs `plan-hold`, `plan-move` at 390 and 1440 with Node yardsticks.
- States: few and small — `hold-{empty,typed,paste,locked}`, `move-{notLocked,saver,ladder,mix,done}` (reuse 03/04/05/12).
  The plan states already weigh 5.8 MB; add well under 0.5 MB.
- Words: every sentence in `copy/hold.js` and `copy/move.js`; the banned-words test; "Illustration, not advice" fixed.
- No new picture. The held-mix-beside-plan-mix is two lines of words, not a chart (step 11 may draw one).

---

## 8. Ledger rows closed (→ built under `s10-hold`)

`hold.record`, `hold.move`, `strat.order-sheet`, `strat.gilts-explained`, `strat.rotation-watch` (the watch and the
ticket; the switch as a hand-over, said in the row's note), `lock.ladder-card` (the move station's "{6} of {18} gilts
bought" now has its screen). Not this step, said so in the rows: `save.own-mix` and `test.glidepath` (step 11's sweep).

---

## 9. Decisions taken for this step (the owner can overturn any)

1. **What you hold and the tick-offs are editable on a locked plan**, exactly as the planner's guard allows; the plan
   document's `holdingsAtLock` stays frozen. Everything else on a locked plan stays refused.
2. **The whole record is one field, one write**; the whole `transition` object likewise. No per-line paths, no
   `deleteField`.
3. **The paste offers all four wrappers** (the planner offers three; cash lines were being left out).
4. **"What skipping it costs" is one optional run** on the held mix for a pot plan, and the uncovered years for a ladder.
   The sentence on the face of the step stays words.
5. **The saver's rule uses `APPROACHING_YEARS` (5)**: no buy/sell list or schedule until the stage is `approaching`; "where
   new money goes" instead. V7 only; the planner is unchanged.
6. **The order sheet waits for the person's own State Pension figure** by holding back the nominal and cost columns behind
   "Show the sheet anyway" when the document was sized on an assumed one. The document is never changed.
7. **The rotation's guided switch hands over to the planner.** Its write changes frozen settings on a locked plan; V7 shows
   the watch and the ticket and does not make the switch until the owner rules.
8. **Nothing is removed by itself**: a pasted-over line that was not seen is listed as "sold?" with its own Remove.
9. **No copy from the funds to test**, no question about it, no "test on what I hold" button (the ruling; roadmap 244).
10. **Prices on the order sheet are the document's at lock**; a live re-price is after 7.0.
11. **The move step is drawn only for a locked plan**; unlocked says what the lock makes.

---

## 10. Cost of the runs, said on screen

Nothing on "What you hold" runs. On the move: "What if I keep what I hold?" is one run ("Tried in 1 run (N s)"), kept
per plan and per save; the lists, the schedule, the order sheet and the watch are sums, not runs.
