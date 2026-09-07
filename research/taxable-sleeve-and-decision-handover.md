# Taxable sleeve (GIA) and windfalls — what shipped, what was reviewed, what is left

Written 6 Sep 2026; **updated 7 Sep 2026** when the Decision-tool side shipped and the Stress
Tester side was reviewed and corrected. Everything in sections 1–4 is DONE and tested.

## 1. Why any of this exists

A lump sum in retirement (downsizing, inheritance, maturing policy) **cannot legally be put in a
pension or an ISA at any useful speed**:

| Route | Limit |
|---|---|
| ISA | **£20,000 / yr** (one allowance across everything that feeds the ISA) |
| SIPP | the LOWER of: 100% of relevant UK earnings (floor **£3,600 gross**), and the annual allowance — **£10,000 (MPAA)** once a DC pension has been flexibly accessed, else £60,000 |
| Everything else | has to sit **unwrapped and taxable** (a GIA) |

**The MPAA is the binding cap for essentially every user of this app**: a drawdown plan has by
definition flexibly accessed, so £10,000 applies, not £60,000. `mpaaTriggered` defaults to `true`.

**Except when the money is not cash.** An inherited PENSION stays in a pension (beneficiary
drawdown — no contribution limit applies) and a late spouse's ISA passes into the survivor's ISA
under the Additional Permitted Subscription. Windfalls therefore carry a `wrapper` field:
`'cash'` (default, limited as above) | `'pension'` | `'isa'`. See `routeWindfall()`.

Worked example, £100k cash lump sum:

| Person | ISA | SIPP | Taxable |
|---|---|---|---|
| Retired, no earnings | £20,000 | £3,600 | **£76,400** |
| Retired, £30k earnings | £20,000 | £10,000 | **£70,000** |
| Not yet flexibly accessed, £30k earnings | £20,000 | £30,000 | £50,000 |

## 2. The module — `src/services/TaxableSleeve.js`

- `newSleeve(value, mix, basis?)` — `mix` is `{ equity, bond, gilt, cash }` or a one-word
  choice via `mixFromChoice()` ('equity' | 'gilt' | 'bond' | 'cash' | 'balanced'; unknown = all
  equity, the pessimistic default). `basis` (cost) may start below value for an existing account.
- `sleeveIncome` / `incomeTaxOnSleeve(sleeve, band)` — dividends above £500 (8.75%/33.75%),
  savings income above £1,000/£500 (20%/40%).
- `withdrawFromSleeve(sleeve, amount, band, cgtUsed)` — pro-rata sale, CGT above the £3,000
  exemption (18%/24%). **Gilts are CGT-exempt**: the chargeable gain is scaled by `1 - mix.gilt`.
  This is the whole reason tax is modelled rather than approximated with a flat drag: a GIA gilt
  ladder is near tax-free, a GIA equity portfolio is not, and a flat haircut gets that backwards.
- `topUpFromSleeve(sleeve, netAmount, band, cgtUsed)` — deliver a NET amount, grossing up for the
  CGT on the way (iterates; residual under a penny).
- `payTaxFromSleeve(sleeve, tax)` — a bill paid out of the sleeve is a sale: basis falls pro-rata.
- `bedAndIsa(sleeve, allowance, band, cgtUsed)`, `sippRoomFor(...)`, `shelterLumpSum(...)`,
  `routeWindfall(w, room)` (wrapper-aware; reports the ISA allowance / SIPP room it consumed).

## 3. Stress Tester — shipped 6 Sep, REVIEWED AND CORRECTED 7 Sep

Review findings on the 6 Sep code, all fixed:

1. **ISA allowance double-spent.** A windfall's £20k ISA slice, the bed-and-ISA transfer and
   band-fill recycling each assumed a fresh £20k in the same year (£40k+ of subscriptions). One
   tracker per tax year now (`isaLumpsThisYear` + `isaRecycledThisYear`); the recycle planner is
   handed what is left. Two windfalls in one year also shared one SIPP room.
2. **Windfalls were nominal while the UI said "today's money".** Now inflated by cumulative
   inflation like extra withdrawals; `indexation: 'level'` keeps a fixed nominal £ (the survivor
   check pre-converts and sets this).
3. **Survivor stress regression.** The deceased partner's pots and ISA were injected as cash
   windfalls, so the new sheltering pushed most of an inherited pension into a taxable GIA.
   `HouseholdService` now tags them `wrapper: 'pension'` / `'isa'`.
4. **The sleeve was not drawn before the ISA** (the stated design) — it only rescued a failed
   SIPP, while the ISA paid every Option-A top-up. The top-up pot is now ISA + sleeve, split
   sleeve-first (net of CGT, grossed up), ISA for the remainder. An ISA on 'hold' stays held; a
   sleeve beside it is still drawn.
5. **Year-start housekeeping charged tax on income not yet earned and credited bed-and-ISA a
   year early**, and skipped year 0 entirely. Moved to the END of each plan year, every year.
6. **Tax paid out of the sleeve left the basis untouched**, overstating later gains. Fixed.
7. **The sleeve's tax was accumulated and then dropped** (`giaTaxPaid` never returned). Now in
   `totalTaxReal` (today's money) plus `giaTaxReal`, `giaDrawnReal`, `finalGia`.
8. **Trace income ignored the sleeve** (`giaRescue` was not reduced from `effectiveSipp`, and
   the compare/worst-12 income series never saw sleeve money). `traceRow.giaNet` is now counted
   like ISA money in `stressTest.js` and `compareRunner.js`.
9. **Ladder strategies ignored windfalls entirely** (one-off spends were modelled, one-off
   receipts were not — a bias against every ladder in the ranked table). `lumpyByYear` now
   returns `windfallByYear`; `applyWindfallsToNeed` lets the lump pay the need from its year
   onward (carry-forward, zero real return — slightly pessimistic, and tax-faithful for a gilt
   sleeve); the unspent carry is added to the bought strategies' wealth cones and terminals.
   The P&V engine still handles its own windfalls through `pnvCfg`.
10. **No UI for an existing GIA.** Stress settings now have: taxable investments today, what
    the account holds, tax band, relevant earnings, bed-and-ISA toggle. The windfall editor has a
    "what is it" select (cash / inherited pension / inherited ISA) and uses `routeWindfall` for
    its note instead of a hard-coded copy of the rule.

Golden hashes: ONE regenerated again — `db-floor-schedule-divers`, the only app path with a
windfall. `risk-balanced-isa` and `ufpls-phased-recycle` are byte-identical (the recycle path
proves the allowance refactor is neutral when nothing else uses the allowance).

## 4. Decision tool — SHIPPED 7 Sep

- **Monthly entry**: "Taxable account (GIA)" balance + "…of which cost" (basis). The basis is
  pre-filled from the last saved month's `giaBasisAfter` (persisted on every history record —
  the longitudinal requirement), and the balance from `giaBalanceAfter` when the box is empty.
- **`legacyDecision.js`**: the top-up pot is ISA + GIA; the sleeve pays first via
  `topUpFromSleeve` (net of CGT, grossed up), the ISA the remainder. **A GIA draw is not taxable
  income** — `sippDraw`, the band arithmetic and `annualTaxable` are identical to the ISA-only
  case (pinned by test). CGT band = basic unless the plan's taxable income exceeds the BRL.
- **CGT exemption per tax year**: `giaGainUsed` on each record is summed for the tax year, plus
  the wizard's new "capital gains already realised this tax year" field
  (`taxYearConfig.cgtExemptionUsed`).
- **Windfalls are advice**: when the plan expects a lump sum in this plan year (year 0 = the
  first tax year set up, the wizard's anchor), an alert says how much can go to the ISA (this
  year's unused allowance, net of recycling recorded), the SIPP room, and what must stay taxable.
- **Bed-and-ISA is advice**: on the first entry of each tax year, with money in the GIA and
  allowance unused, an alert gives the move and the CGT it would realise (nil on gilts).
- **Outputs** (only when a GIA or windfall is in play, so plans without one are byte-identical —
  the decision golden fixtures are untouched): `giaBalance/giaBasis/giaDraw/giaCgt/giaNet/
  giaGainUsed/cgtExemptionUsed/giaBalanceAfter/giaBasisAfter/giaIncomeTaxAnnual/windfallAdvice/
  bedAndIsaSuggestion`. `totalMonthlyNet` includes `giaNet`. `DecisionPanel` shows the draw, the
  tax line and the account; the History detail shows the draw.
- **Settings**: Decision settings carry `taxableMix`, `relevantEarnings`, `bedAndIsa`;
  `seedDecisionFromStress` / `seedStressFromDecision` copy `taxableStart, taxableMix,
  giaTaxBand, bedAndIsa, relevantEarnings, windfalls` both ways (the D1 silent-drop trap).

Tests: `tests/DecisionGia.test.js` (9), `tests/ladderWindfall.test.js` (5), additions to
`tests/SimulationEngine.test.js` and `tests/TaxableSleeve.test.js`. Suite: 69 files, 592 tests.

**Verified 7 Sep (morning), in the browser against the dev server**, not only in vitest: both engines
imported into the running app. Decision: £200k GIA (basis £100k, exemption already used) pays the
£459 top-up the ISA used to pay, SIPP draw identical, CGT £45.40 on a £504 sale, windfall alert
routes £100k as £20k ISA / £3,600 SIPP / £76,400 taxable, panel renders the GIA row. Stress: gilt
sleeve pays nil tax, share sleeve £2,549, ISA lasts longer beside a sleeve, an inherited pension
never touches the sleeve. Two corrections made: a sub-penny ISA residual after the sleeve paid the
whole top-up (now exactly 0), and the methodology page's "GIA not modelled" row. The signed-in UI
walk-through (Monthly Entry → Save → next month's basis pre-fill) still needs a real account.

## 4b. Follow-ups from Chris's review, 7 Sep

- **Help pop-ups were dead.** The eight new ⓘ hints used a bare `title` attribute (native tooltip,
  hover-delay only, nothing on touch) while the app's working mechanism is `.hlp[data-tip]` +
  `initHelpTips()`, which was only initialised after a stress run. All eight now use `.hlp`, and
  `initHelpTips()` runs at start-up.
- **Every strategy sees an existing GIA.** `taxableStart` only reached the P&V engine (its sleeve);
  the bought strategies priced on the SIPP (+ISA) alone. `lumpyByYear` now adds the existing GIA to
  `windfallByYear[0]`, so it buys the first rungs exactly like a lump arriving in year 0 and the
  unspent carry counts as wealth. No double count: `pnvCfg` keeps the raw schedule and its own
  `taxableStart`. Test in `ladderWindfall.test.js`.
- **A lump sum carries its own holding.** A windfall (e.g. an inheritance 10 years in) has a
  "taxable part held as" select (same as the account / shares / gilts / bonds / mixed / cash;
  shown for cash lumps only — inherited pensions and ISAs have no taxable part). `addToSleeve`
  blends the sleeve's mix by value, so a house sale parked in gilts beside an inherited share
  portfolio is taxed faithfully (half CGT-free, not all-or-nothing). Windfall `mix` field; the
  Decision-tool advice names the holding. Tax band, earnings and bed-and-ISA stay plan-level —
  they describe the person, not the lump.

## 5. Still open (found, not fixed — deliberately)

- The sleeve's gilt share grows at the engine's nominal bond return, not at the real-yield curve
  the ladder strategies price on. Adequate for a sleeve; revisit if the GIA gilt ladder becomes a
  first-class strategy (Chris's house-sale ladder idea).
- Losses in the sleeve are not carried forward (basis is clamped to value on entry).
- The Decision tool does not yet model the sleeve's dividend/interest tax as a monthly cash
  flow — it is reported as an annual estimate paid out of the account.
- CSV export of history does not include the GIA columns.

## 6. Rules reference
ISA £20,000/yr · MPAA £10,000 · Annual Allowance £60,000 · relief floor £3,600 gross ·
dividend allowance £500 (8.75% / 33.75%) · savings allowance £1,000 basic / £500 higher ·
CGT exemption £3,000 (18% / 24%) · **UK gilts are exempt from CGT** (coupon taxable as income) ·
inherited pension = beneficiary drawdown (no contribution limit) · inherited ISA = APS.
