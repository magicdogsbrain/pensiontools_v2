# Rotation plan & design audit — 29 Aug 2026

Owner: Chris. Status: plan agreed in principle, app work pending.
All £ in Aug-2026 money. Illustration from the app's own engines, not advice.

## 0. Where the design stands

**Bought and verified.** 23 index-linked rungs, £950k, buying £1.21M of real income to age 91
(tax years 2030/31–2061/62). Three cash years (27/28–29/30) in CSH2 + SIPP cash, £226k held
against £240k needed; £64k expected from another SIPP, fallback £58.7k/yr for three years.
Manual + 73 calendar entries shipped. Ladder verified against the AJ Bell holdings PDF.

**Decided since.** The ladder is not the end state. It is a *floor plus optionality*: the long
rungs are dry powder that pays ~2.5% real to wait, and they get swapped into equities on a
pre-defined equity drawdown. The end state is "floor to age N + equity engine beyond".

## 1. The rotation plan

**Trigger.** Global/US equities ≥30% below their all-time high (any path — crash or grind).
Fire on the month it first crosses. No second condition, no valuation screen, no confirmation.

**What is sold.** The whole block of rungs funding ages 76–91: TR46, T47, TG48, TR50, TG51,
TG52, TG54, TR8F, TR56, T58. £262k today, growing ~2.5%/yr real while unsold.

**How much at once.** All of it, in one go. Tranching tested and rejected (see §2).

**Price discipline.** Sell whatever the gilt price. The block's value at the trigger date moves
the odds by a few points, not the decision (§2). Do NOT pre-sell into a linker rally and sit in
cash — the gilts are the waiting room and they pay 2.5% real; cash costs ~2.8%/yr.

**Rebuy.** None assumed. The plan is judged on never rebuying. Rebuying if the chance arises is
upside, not a requirement (round trip separately modelled: 10-year hold, 95–100% restores the
floor with £200–290k left over).

**Floor that is never sold.** Rungs funding ages ≤75 stay, always. With the State Pension from
67 that guarantees £65k to 67, £45k to 74 and £40k at 75 — every year fully covered until 75,
whatever markets do.

**If the trigger never fires.** Do nothing. The ladder pays as bought. There is no time-out and
no obligation to act: the un-rotated plan is already 100%/£70k-left. The rotation is optional
upside, not a repair.

**What it converts into.** Full linker cover to 75 + State Pension + equities beyond 75 —
i.e. the app's "Floor to an age then decide" shape.

## 2. Evidence

Sell the ages 76–91 block at the trigger, buy equities, never rebuy, draw £27,520/yr real
ages 76–91 (£440k total). Every historical month the market first crossed −30% below its ATH:

| Trigger age | Pays in full | Median left at 91 | vs swapping at a random month |
|---|---|---|---|
| 57 | 100% | £1,129k | 100% / £673k |
| 62 | 100% | £1,138k | 89% / £623k |
| 67 | 98% | £1,098k | 83% / £471k |
| 72 | 94% | £669k | 78% / £352k |

The trigger adds 11–16 points of success over acting at a random time and roughly doubles what
is left. Bootstrapped futures give 81–85% flat at every age — but bootstrap paths are
unconditional, so they cannot see the trigger at all; that column is the "trigger adds nothing"
floor. Honest range: **~84% pessimistic, ~98% on history.**

Robustness to the gilt price at the trigger date (block ±25%):

| Trigger age | Block −25% | As modelled | Block +25% |
|---|---|---|---|
| 62 | 96% | 100% | 100% |
| 67 | 91% | 98% | 100% |
| 72 | 84% | 94% | 100% |

**Episode by episode** (crossing months only, n=16, sell-to-75, all-in):
every episode paid at trigger-age 62. The ONLY failures are **1929-11 and 1930-06**, and only
when the trigger fires at 67 or 72. 1974-07 — the stagflation analogue — paid in all three
(£1,084k / £1,322k / £309k left).

**Tranching rejected.** Thirds at −30/−40/−50 with a 24-month timeout scored *worse* than
all-in on both success and leftover (e.g. trigger at 67: 81% vs 88%; median left £426k vs
£599k). The deeper levels often never arrive, so the timeout deploys later at higher prices
while the powder earns 2.5% instead of the rebound. Tranching's real value is behavioural, not
financial — if it is the difference between executing and freezing, use halves at −30/−45.

**Deeper triggers rejected.** Entering at 45%+ below peak scored worse than 30% over a 10-year
hold — those months include the way down. −50% has only a 20% chance of occurring within five
years vs 58% for −30%.

**Cut age.** Selling to 72 leaves the most (£722k median at trigger-67) at the same 88%;
selling to 80 is the most conservative and leaves least. 75 chosen as the balance: it keeps a
guaranteed floor through the go-slow years and still frees £262k.

## 3. Risks, stated plainly

1. **A 1929-scale collapse arriving after 65.** The one failure mode in 150 years of data.
   Mitigation: none available inside this plan; the fallback is spending flexibility in the 80s.
2. **No modern episodes in the test.** Data ends 2023-06, so a 30-year horizon excludes 2000
   and 2008 triggers entirely. n=16 episodes, all pre-1975.
3. **Behaviour.** Every number assumes the swap is executed in the worst week of a decade and
   then held for 15–30 years without touching it. This is the largest unmodelled risk.
4. **No floor beyond 75 after the swap.** Income above the State Pension becomes market-
   dependent from 76. In the failing 2–16% that means trimming in the 80s.
5. **RPI→CPIH from Feb 2030** reduces the uplift on every unsold rung by ~1%/yr.
6. **Capacity.** A borrowed floor that exists only in Chris's head cannot be inherited. It must
   be visible in the app and in the manual.

## 4. Decision rule, one paragraph

> While equities are within 30% of their all-time high: do nothing, run the ladder as bought.
> On the first month equities close 30% or more below their all-time high: sell the entire
> ages 76–91 rung block at market, whatever the price, and buy the global equity fund with all
> of it. Never sell a rung funding age 75 or younger. Rebuy the sold rungs only if real yields
> and the equity sleeve later make it free. If the trigger never fires, the plan stands as is.

---

# Design audit — 29 Aug 2026

## A. The ladder itself — sound

- 23 rungs verified against the AJ Bell holdings PDF; every rung at or above the sheet's nominal.
- Real IRR 1.65% (coupons included); per-rung real yields run 0.73% (2029) to ~2.5% (2050s).
- Engine bug found and fixed: the State Pension's first-year share was computed on the CALENDAR
  year while rungs are bought per TAX year. `spTaxYearFirstRatio()` added
  (`src/utils/StatePensionUtils.js`), used by `fullGiltTest`. TG36 now sizes at 33,200 nominal
  (£53,033) not 35,200 — Chris holds 35,200, so ~£3.3k spare in 2037/38. Shipped.
- Remaining gap: cash years need £240k, £226k held (£64k expected from another SIPP; fallback
  £58.7k/yr for three years). Not a ladder problem.

## B. Decision tool — the real finding

**The Decision tool has no concept of any strategy other than Pots & Valves.** Non-P&V strategies
were presentation-only: the engine always ran the P&V cascade and an overlay relabelled the number.

| # | Bug | Where | Fixed |
|---|---|---|---|
| D1 | `seedDecisionFromStress` dropped `strategyId`/`strategyParams`/income shape, so "Use ALL Stress settings" silently converted a full-IL-gilt plan into a P&V one | `src/storage/ScenarioRepository.js` | yes — strategy, params, income shape, `shapeAgeNow`, `firstTaxYear` now travel with the copy, + tests |
| D2 | `#dsStrategyPanel` was hidden whenever a strategy had no bespoke body (`display = html ? 'block' : 'none'`), so full-il-gilt got no panel above the entry form at all | `index.html` | yes — always shown |
| D3 | Plan year computed relative to *today* rather than the plan's first tax year, so it was always 0 — the overlay always said "the cash years bucket" | `index.html` overlay | yes — now `firstTaxYear`-relative |
| D4 | `{...settings.strategyParams}` spread on the Decision side was always empty (Decision settings had no such field); params came only from the scenario block, which is `{}` for most strategies | `index.html` `calcDecisionWithDeps` | yes — Stress → Decision → scenario, most specific wins |
| D5 | The monthly figure for a contract ladder was `decision.sippDraw` (P&V tax-band output) relabelled as "this year's matured rung" — a different number from what the ladder actually contracted | `index.html` overlay | yes — now the ladder's own schedule ÷ months left |

**Still open (design, not bugs):**
- The strategy registry has no decision surface. `getStrategy(id)` exposes `simulate`,
  `runMonteCarlo`, `runWindows`, `floorCost` — all simulation. The growing
  `if (st.id === '…')` chain in `renderDecisionStrategyPanel` should become
  `getStrategy(sid).decisionView?.(ctx)`. Not urgent; three branches so far.
- Decision settings form is entirely P&V-shaped (pot floors, valves, rebalancing, risk cards).
  For a contract ladder most of it is meaningless. It should collapse to: income shape,
  State Pension, cash years, and the tax-year figures.
- The monthly entry form still requires Equity/Bond/Cash/ISA/Diversifier values. For a ladder
  plan only cash matters.
- Household still runs P&V-family engines for a ladder plan via config.

## C. What was built

- `src/services/LadderPosition.js` (+ 9 tests) — pure `(plan, date, balances) → position`:
  tax year, income step, State Pension split, ladder amount, months left, monthly instruction,
  parked money that must not be spent, cash reconciliation, next maturity and how long it sits.
- Decision tool now renders a **"Your gilt ladder — tax year X, age N"** card: the income step,
  the exact monthly figure to instruct the broker, which rung or bucket pays it, a warning listing
  money that is parked for later tax years, the next maturity, and a Check button that
  re-spreads the remainder over the months left and reconciles a typed cash balance.
- **Rotation watch** panel: the rule in one paragraph, an index-vs-all-time-high check, and the
  historical record. It is the only discretionary decision in the plan and it now has a home.

## D. Honest limits of the rotation evidence

n=16 trigger episodes, all pre-1975 (a 30-year horizon plus data ending 2023-06 excludes 2000 and
2008 entirely). Overlapping windows. US S&P with a world-equity haircut; UK linkers have no
history before 1981, so the gilt leg is arithmetic, not history. The bootstrap lens cannot see the
trigger at all and returns the un-triggered odds (~84%) — treat that as the floor, not the estimate.

---

## E. Implemented — 30 Aug 2026

Shipped as the ninth strategy **`gilt-rotation` ("Gilt ladder + rotation")** plus execution tooling:

- **Engine** `src/strategies/GiltRotation.js` + `rotationTest` (stressTest.js): the full ladder,
  trigger = first month the real-TR series closes ≥30% below its running ATH, DISARMED 3 years
  before the sold block's first draw (the runway guard — without it, late-firing windows sell the
  floor into the fire and hist ruin runs ~17%; with it ~7%, MC ~16% = the untriggered floor).
  Approximations documented in the module header: TR-index trigger (fires less than price ⇒
  conservative) and yields-unchanged accretion of the block.
- **Nightly equity feed**: fetch-gilt-data.mjs now also writes equity.json / equitySnapshot.js
  (FRED SP500, Yahoo fallback, ATH carried forward across refreshes); `src/services/EquityIndex.js`
  serves it; the Rotation watch shows the live drawdown automatically.
- **Rotation watch** (Decision ladder card + full-il-gilt page block 6): block derived from the
  plan (splitLadderAtAge), live trigger status, manual override boxes.
- **Sell ticket**: `giltSellTicketHtml` — units to SELL per rung, sell-side proceeds
  (× (1−spread) − fee, never the buy-side `cost`), income given up.
- **Guided switch** `executeRotation()`: appConfirm → strategy becomes floor-to-age(cut) and
  `strategyParams.borrowedFloor` records date/tidms/years/proceeds/trigger. `borrowedFloorStatus`
  (LadderPosition.js) prices restoring it on today's curve; an un-missable line shows on the
  Decision panel and the floor-to-age page until it is rebought.

On Chris's plan shape the model says: block £249k covering £413k, trigger fires in 77% of futures,
rotated years cut in 16% of futures / 7% of histories, median left at 91 ≈ £417k vs £4k un-rotated.
