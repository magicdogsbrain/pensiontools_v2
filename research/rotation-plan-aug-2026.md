# Rotation plan & design audit — 29 Aug 2026

Status: design agreed in principle (built 30 Aug 2026 as the gilt-rotation strategy, section E).
All £ in today's money. Illustrations from the app's own engines, not advice.

## 0. Where the design stands

A full index-linked gilt ladder bought for every year of a plan is not necessarily the end state. It can be a *floor
plus optionality*: the long rungs are dry powder that pays a real yield to wait, and they are swapped into equities on
a pre-defined equity drawdown. The end state is then "floor to age N + equity engine beyond".

## 1. The rotation design

**Trigger.** Global/US equities ≥30% below their all-time high (any path — crash or grind).
Fire on the month it first crosses. No second condition, no valuation screen, no confirmation.

**What is sold.** The whole block of rungs funding ages after the cut age, growing at their real yield while unsold.

**How much at once.** All of it, in one go. Tranching tested and rejected (see §2).

**Price discipline.** Sell whatever the gilt price. The block's value at the trigger date moves
the odds by a few points, not the decision (§2). Do NOT pre-sell into a linker rally and sit in
cash — the gilts are the waiting room and they pay a real yield; cash loses to inflation.

**Rebuy.** None assumed. The plan is judged on never rebuying. Rebuying if the chance arises is
upside, not a requirement.

**Floor that is never sold.** Rungs funding ages up to the cut stay, always: every year to the cut age is fully
covered, whatever markets do, with the State Pension on top from its own date.

**If the trigger never fires.** Do nothing. The ladder pays as bought. There is no time-out and
no obligation to act. The rotation is optional upside, not a repair.

**What it converts into.** Full linker cover to the cut age + State Pension + equities beyond it —
i.e. the app's "Floor to an age then decide" shape.

## 2. Evidence

We ran the rule on a test ladder plan: sell the block above the cut age at the trigger, buy equities, never rebuy,
draw the sold years' income from the equities, over every historical month the market first crossed −30% below its
all-time high, with the trigger at several ages. What it showed:

- The trigger adds 11–16 points of success over acting at a random month and roughly doubles what is left.
  Bootstrapped futures cannot see the trigger at all (their paths are unconditional), so that lens gives the
  "trigger adds nothing" floor. Honest range: pessimistic in the bootstrap lens, high on history.
- Robustness to the gilt price at the trigger date (block ±25%): a few points of success either way, more at later
  trigger ages.
- **Episode by episode** (crossing months only, n=16, all-in): the ONLY failures were **1929-11 and 1930-06**, and only
  when the trigger fires late. 1974-07 — the stagflation analogue — paid in full at every trigger age tried.
- **Tranching rejected.** Thirds at −30/−40/−50 with a 24-month timeout scored *worse* than all-in on both success and
  leftover. The deeper levels often never arrive, so the timeout deploys later at higher prices while the powder earns
  its real yield instead of the rebound. Tranching's real value is behavioural, not financial — if it is the difference
  between executing and freezing, use halves at −30/−45.
- **Deeper triggers rejected.** Entering at 45%+ below peak scored worse than 30% over a 10-year hold — those months
  include the way down. −50% is far less likely to occur within five years than −30%.
- **Cut age.** An earlier cut leaves the most at the same chance of paying in full; a later cut is the most
  conservative and leaves least. The choice trades a guaranteed floor through the go-slow years against what it frees.

## 3. Risks, stated plainly

1. **A 1929-scale collapse arriving late.** The one failure mode in 150 years of data.
   Mitigation: none available inside this plan; the fallback is spending flexibility in the 80s.
2. **No modern episodes in the test.** Data ends 2023-06, so a 30-year horizon excludes 2000
   and 2008 triggers entirely. n=16 episodes, all pre-1975.
3. **Behaviour.** Every number assumes the swap is executed in the worst week of a decade and
   then held for 15–30 years without touching it. This is the largest unmodelled risk.
4. **No floor beyond the cut age after the swap.** Income above the State Pension becomes market-dependent after it.
   In the failing futures that means trimming in the 80s.
5. **RPI→CPIH from Feb 2030** reduces the uplift on every unsold rung by ~1%/yr.
6. **Capacity.** A borrowed floor that exists only in one person's head cannot be inherited. It must
   be visible in the app and in the plan's own record.

## 4. Decision rule, one paragraph

> While equities are within 30% of their all-time high: do nothing, run the ladder as bought.
> On the first month equities close 30% or more below their all-time high: sell the entire
> block of rungs funding ages above the cut age at market, whatever the price, and buy the global equity fund with
> all of it. Never sell a rung funding the cut age or younger. Rebuy the sold rungs only if real yields
> and the equity sleeve later make it free. If the trigger never fires, the plan stands as is.

---

# Design audit — 29 Aug 2026

## A. The ladder itself — sound

- Per-rung real yields run from under 1% (the late 2020s) to ~2.5% (the 2050s).
- Engine bug found and fixed: the State Pension's first-year share was computed on the CALENDAR
  year while rungs are bought per TAX year. `spTaxYearFirstRatio()` added
  (`src/utils/StatePensionUtils.js`), used by `fullGiltTest`. A rung was over-sized by a few thousand pounds on a
  test ladder. Shipped.

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
- ~~Decision settings form entirely P&V-shaped~~ DONE 30 Aug: `applyDecisionStrategyMode(sid)`
  hides the allocation section (risk cards/own funds/diversifiers/bond tent), Protection and the
  spending-profile row for contract plans (full-il-gilt, gilt-rotation, floor-the-schedule).
- ~~Monthly entry form requires Equity/Bond/Diversifiers~~ DONE 30 Aug: for contract plans the
  equity and diversifier fields are hidden (auto-0) and the bond field is relabelled
  "Gilt ladder value (unpaid rungs)" — cash, gilts and ISA are what the plan actually holds.
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

On a test ladder plan the model said: the trigger fires in most futures, the rotated years are cut in a minority of
futures and fewer histories, and the median left at the end is far above the un-rotated ladder's.

## F. Runway sweep — 30 Aug 2026 (the "maximum time to wait" question)

We asked whether a late trigger leaves the bought equities enough time to recover before the
sold years start paying. Sweep of the disarm age on the £1M demo (cut 75, first sold draw 76):

| Trigger allowed until | Min runway | Hist cut % | MC cut % | Median left | Futures that rotate |
|---|---|---|---|---|---|
| 75 | 1y | 8.0 | 19.0 | £579k | 85% |
| 72 (old default) | 4y | 3.8 | 16.7 | £579k | 78% |
| 70 | 6y | 2.0 | 15.7 | £579k | 74% |
| 67 | 9y | 0.7 | 13.8 | £579k | 67% |
| 64 | 12y | 0.0 | 11.1 | £579k | 56% |

The median leftover is IDENTICAL at every row: late rotations add nothing to the middle and all
of the tail. A rotation foregone is not a failure — it is the full ladder. Recovery-to-even from
a −30% entry is fast (median ~1 month, worst 3.8y, n=32 crossings) but "even" is not the bar —
funding 16 years of draws is. **Default changed: `rotateDisarmYears` = 8** (trigger dead within
8 years of the block's first draw; param on strategyParams). Demo effect: MC paid-in-full
83%→86%, hist 96%→99%, rank 5th→3rd.
