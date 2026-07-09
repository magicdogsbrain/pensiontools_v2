# Whole-Engine Audit & Single-Implementation Blueprint

Master audit across every functional area of the calculation engine, and the plan to
collapse it to one implementation. Companion to `decision-engine-unification.md` (which
holds the tax/drawdown deep-dive and the 20-row difference table). Roadmap item **[0]**.

---

## The meta-finding: three layers, and the good one is dead

Every functional area has the **same three-way split**:

1. **Live Decision Tool** — inline `calcDecisionPWA` in `index.html` (~3669). Hand-rolled.
2. **Live Stress Tester** — `SimulationEngine.js`. Hand-rolled, separately.
3. **A cleanly-factored module layer** — `ProtectionService`, `DrawdownService`,
   `DecisionService` — that is **imported only via `app.js` and never wired to the live
   UI**. The unit tests exercise *this* layer. So the best-structured code is **dead**,
   and the two live tools each re-derive everything slightly differently.

Consequence: there is no single source of truth for *any* concept — tax, inflation,
protection, glidepath, state pension, sourcing — and the two live tools disagree.

---

## Area-by-area summary

### 1. Tax & drawdown — see `decision-engine-unification.md`
Live decision uses a crude inline tax (`grossToNetIncome`: flat 20/40, **no 45%, no PA
taper**); stress and the dead module use the proper `TaxCalculator`. → **Canonical: `TaxCalculator`**, delete `grossToNetIncome`.

### 2. Asset returns & inflation
- **Returns** are stress-only (the Decision Tool takes live fund values, doesn't model
  returns). Bond blend is a hardcoded 6-asset model; the `BOND_MODEL` constant is **dead**
  (weights re-declared inside `calculateBondReturn`). Cash has **two different formulas**
  (`inf+0.012` portfolio vs `inf+0.005` inside the bond blend).
- **Inflation** has 3+ copies with **different missing-CPI defaults: 2.5% (stress) vs 4%
  (decision)** — so the two tools aren't comparable on the same plan. Live decision also
  **hardcodes the start year `26/27`** and **omits the 4% other-income cap** that stress
  applies.
- → **Canonical: one `InflationModel`** (one default, one cumulative helper, one
  other-income cap, one threshold-inflation for all of PA/BRL/HRL) + a **`MarketModel`
  asset-class registry** that makes `BOND_MODEL` real and unifies the cash formula — this
  is the seam for the planned bucket-composition feature.

### 3. Protection mode & tax-boost
- Three implementations. **Recovery buffer has three values in force** (decision 10000,
  *and* 15000 in a different part of the same file; stress hardcodes 5000 exit / 15000
  boost; module 15000). Protection magnitude stored as **`protectionFactor` (%) in
  decision vs `protectionMult` (multiplier) in stress** — desync on any edit. Protection
  **scope differs**: decision reduces SIPP only; stress scales the whole draw. Entry
  **timing differs** (decision reduces the triggering month; stress the month after).
  `disableProtection` isn't implemented in the decision path. Month indexing is
  **0-indexed (April=3) in stress vs 1-indexed (April=4) in decision**.
- → **Canonical: `ProtectionService` (fixed)** for detection + **one `calculateTaxBoost`**.

### 4. Glidepath & State Pension
- **Glidepath formula is identical** across all three (good) — only inputs diverge
  (decision **rounds** minimums, others don't → protection boundary evaluated on
  different numbers; CPI default 4% vs 2.5%). → keep `GlidepathService`, delete the inline
  copy, move rounding to presentation.
- **State Pension**: date-based (decision, correct) vs year-number (`DrawdownService`,
  legacy/dead) vs sim `spStartYear`. First-year pro-rata is computed **two incompatible
  ways** — weeks-to-tax-year-end (correct) vs **days-to-31-Dec ÷ 365 (wrong)** in the sim.
  `spStartYear` is derived from **`now`, not the tax-year grid**, so the two tools can
  start SP **a year apart**. Conversion is duplicated (`StressRepository` ≈ inline
  `index.html`) with the same bug. → **Canonical: `StatePensionUtils` (date-based)**, sim
  driven per-year off it.

### 5. Withdrawal sourcing, rebalancing, replenishment
- **No "Mixed" source in the live paths** → when growth surplus is just below the draw,
  the *entire* draw comes from cash, over-drawing it and accelerating protection. The
  module has the correct `Mixed` branch — but it's dead. The **net-surplus gate strands a
  healthy bucket** (equity surplus cancelled by a bond deficit → forced to cash).
  Replenishment is **advice-only in decision but auto-executed in stress** (with a
  *different* threshold) → stress success rates are optimistic vs the tool's own advice.
  Rebalancing: absolute-£ (decision) vs ratio (module) vs **none** (stress).
- → **Canonical: new `WithdrawalSourcing`** using floored per-bucket surplus + real Mixed
  branch, one threshold set, an `execute` flag (off for decision, on for stress).

### 6. Simulation mechanics & the data context — THE central issue
- **The stress engine and the decision tool model fundamentally different withdrawal
  amounts.** Stress draws **gross SIPP capped at BRL, subtracts *gross* from the pot, and
  models no tax and no ISA**. The Decision Tool models tax **and** ISA top-up to hit a
  target **net**. So *the stress test isn't testing the plan the user is actually
  executing* — it's testing a smaller, different drawdown. This is the single biggest
  reason the two tools can't just "share tax code"; they must share the **whole
  withdrawal decision**.
- **Default stress State Pension is silently dropped**: defaults ship
  `statePension:12000/statePensionYear:12`, but the config builder reads
  `spStartDate/spWeeklyAmount` (absent) → `spStartYear=999` → **no SP in a default stress
  run**, while the UI shows £12k. Plus **two divergent stress config builders**
  (`SimulationConfig.fromStressSettings` legacy vs `StressRepository` date-based).
- → **Canonical: one `PlanContext` + one `DrawdownStrategy.decide()`** both tools call.

---

## Consolidated bug register (prioritised)

**🔴 High — tools materially disagree / silent wrong results**
1. Stress models a different withdrawal (gross-to-BRL, no tax/ISA) than the Decision Tool (net target w/ ISA). *Central.* (`SimulationEngine.calculateMonthlyDraw`)
2. Default stress run silently drops State Pension (`spStartYear=999`) though UI shows £12k. (`ScenarioRepository` defaults vs `StressRepository:254`)
3. Live Decision Tool under-taxes 45%-band / £100k-taper incomes (crude inline tax). (`index.html:3662`)
4. SP first-year pro-rata wrong in stress (days-to-31-Dec÷365 vs weeks-to-5-Apr). (`StressRepository:285`, dup `index.html:4433`)
5. `spStartYear` derived from `now`, not tax-year grid → tools start SP a year apart. (`StressRepository:276`)
6. Missing-CPI default 2.5% (stress) vs 4% (decision) → plans not comparable. (`SimulationEngine:86` vs `index.html:3709`)
7. No "Mixed" source → over-draws cash, accelerates protection entry. (`index.html:3971`, `SimulationEngine:208`)

**🟡 Medium**
8. `protectionFactor` (%) vs `protectionMult` (×) — desync on any user edit; also SIPP-only vs whole-draw scope.
9. Recovery buffer 5000 / 10000 / 15000 inconsistency (incl. within one file). 
10. `DrawdownService.calculateTaxBoost` mis-annualises (`sum*12/length`) and double-counts a year — must NOT be adopted as-is. (`DrawdownService:404`)
11. Module boost/projection uses unfiltered (all-time) history, not the current tax year. (`DecisionService:132`)
12. Other-income 4% CPI cap missing in the live decision path. (`index.html:3748`)
13. Replenishment advice-only (decision) vs auto-executed (stress) with different thresholds → optimistic stress. (`SimulationEngine:194`)
14. Protection entry-timing differs (triggering month reduced or not) between tools.

**🟢 Low / cleanup**
15. `BOND_MODEL` constant dead; `STATE_PENSION_FLOOR` dead; two cash-return formulas; HRL not inflated in stress; glidepath rounding asymmetry; sim emergency spill draws bond before equity; month-index convention split; `Math.max(0,…)` pot clamp can hide a shortfall.

### Update — found during the golden-master audit (2026-07)
- 🔴 **High — a NaN-blowup run is counted as a successful full-term survival.** When a
  Monte-Carlo bond return `r < −1`, the engine computes `(1+r)^(1/12)` on a negative base
  → **NaN**, which propagates to the fund/`final`; `Math.max(0, NaN)` never trips the
  depletion check, so the run reports `failed=false` for the full term with a NaN final.
  This **inflates the success rate** and poisons `finalValue.avg` (→ NaN) and
  `finalValue.min` (→ masked `0`) across every config. (`SimulationEngine.js` return
  application + `analyzeResults`.) Fix: clamp returns to `> −1` (or treat any non-finite
  fund/final as a failed run) and filter non-finite finals before averaging. Pinned by
  `tests/golden/stress.golden.test.js`.
- 🟡 **Medium — higher income is not modelled in the Stress Tester.** The draw caps at
  `min(brl, target)` (`calculateMonthlyDraw`), so `baseSalary` above the basic-rate limit
  has **no effect** on the simulation — a higher-income plan draws exactly as a
  BRL-capped one. The Decision Tool (which adds ISA/UFPLS to reach a higher net) and the
  Stress Tester therefore diverge for any above-BRL plan; the unified `DrawdownStrategy`
  must model the full target, not just the BRL cap.

---

## The single implementation

### One data context — `PlanContext` (also the couples seam)
```
PlanContext {
  timeHorizon: { years, glidepathDuration }
  policy: {                                   // shared strategy knobs
    consecutiveLimit,
    protection: { factor },                   // ONE unit (fraction); mult = 1 - factor
    recoveryBuffer, boostBuffer,              // replace hardcoded 5000/15000/10000
    disableProtection,
    hodl: { enabled, value }
  }
  incomeTarget: { mode: 'gross'|'net', amount }   // net-budget mode lives here
  timeline: { taxMode, years: [ { cpi, pa, brl, hrl, other, confirmedSalary,
                                  isaAllocation, isTaxEfficient, grossIncomeToDate } ] }
  people: [ PersonContext ]                   // 1 today, 2 for couples
}
PersonContext {
  pots: { equity, bond, cash, isa, hodl }     // isa first-class for BOTH engines
  glidepath: { equityMin, bondMin, cashTarget }
  statePension: { startDate, weeklyAmount }   // ONE canonical (date-based) shape
}
RuntimeState { inProtection, consecCashDraws, taxYearShortfall, cumInf }
```

### Module set (pure, per-person, single-source)
| Module | Owns | Replaces |
|--------|------|----------|
| `TaxEngine` (evolve `TaxCalculator`) | bands, tax, grossToNet, **netToGross**, marginal, `bandsForTaxYear` | `grossToNetIncome`, inline tax |
| `PensionAccess` *(built)* | UFPLS / PCLS / tax-free levers | — (new capability) |
| `InflationModel` | cumulative CPI, capped other-income, threshold inflation, one default | 3 inflation copies |
| `MarketModel` (asset-class registry) | per-bucket return generation | hardcoded bond blend, 2 cash formulas, dead `BOND_MODEL` |
| `GlidepathService` *(exists)* | minimums | inline `calcGlidepathMin` |
| `ProtectionService` *(fix)* | protection state | inline + sim protection |
| `calculateTaxBoost` (one) | boost/catch-up rule | 3 boost copies |
| `StatePensionUtils` *(exists)* | date-based SP | year-number + day-ratio variants |
| `WithdrawalSourcing` (new) | bucket choice, splits, rebalancing, replenishment, alerts | inline sourcing + dead module |
| `IncomeModel` | other pension (capped), SP, grossIncomeToDate | scattered copies |

### The seam — one strategy, two orchestrators
```
DrawdownStrategy.decide(ctx, person, runtime, period) →
  { grossSipp, ufplsTaxFree, ufplsTaxable, isaTopUp, pcls,
    protectionScale, boostAmount, tax, net, source, splits{equity,bond,cash} }

computeMonthlyDecision(ctx)   // Decision Tool: call decide once, format advice, no mutation
simulateYear(ctx)             // Stress Tester: call the SAME decide each month,
                              //   apply returns, subtract grossSipp + isaTopUp from pots
```
After this, the two tools differ **only** in what wraps the strategy: return-modelling +
iteration + metrics (stress) vs single-period formatting (decision). They agree by
construction, and every roadmap lever (UFPLS/PCLS, net-budget, capex, couples) is added
**once**.

---

## Required conventions
- **Tax-year boundary = 6 April** (tax year runs 6 Apr → 5 Apr). The canonical
  `DateUtils.getTaxYear` honours the 6th; the live decision path (`getTaxYearFromDate`,
  `getYearNum`, the `m >= 4` YTD filters) and the stress engine (`monthInYear >= 3`)
  approximate it to 1 April. The unified engine uses `getTaxYear(parseMonth(monthStr))`
  everywhere and deletes the `m >= 4` / `monthInYear >= 3` copies. This is **behaviour-
  neutral at month granularity** — proven for every month 2020–2070 in
  `tests/golden/taxyear-parity.test.js` (`parseMonth` resolves a month to day 15, which
  is always on the correct side of 6 April). Separately, `getYearNum` hard-codes a 2026
  epoch (bug #4-ish) and should derive the year index from the resolved tax year.

## Sequencing to get there (parity-first)
1. **Golden-master harness** — pin current live outputs (`calcDecisionPWA`) and stress
   success rates (fixed seed) across a scenario matrix, before touching anything.
2. **Foundations** (invisible, parity-tested): `TaxEngine` (done-ish) + `InflationModel`
   + `IncomeModel`; delete `grossToNetIncome`, unify CPI default & other-income cap.
3. **Consolidate detectors**: one `ProtectionService`, one `calculateTaxBoost`, one
   glidepath, one date-based SP; fix bugs #2/#4/#5/#10/#11.
4. **`WithdrawalSourcing`** with real Mixed branch (fixes #7); shared thresholds.
5. **`DrawdownStrategy.decide` + `PlanContext`**; wire the Decision Tool to it (retire
   `calcDecisionPWA`), diff vs golden master — every moved number reviewed.
6. **Wire the Stress Tester** through `decide` (fixes #1: stress now models tax+ISA);
   confirm success-rate deltas are explained and seed-stable.
7. **Delete** the dead module duplicates and the inline copies.
8. `MarketModel` registry (feeds bucket-composition), then the levers/net-budget/couples.

_Last updated 2026-07. Item [0]; unblocks all downstream engine work._
