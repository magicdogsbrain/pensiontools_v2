# Decision / Stress Engine Unification — Differences & Target Design

Roadmap item **[0]**. Goal: one income/tax/withdrawal engine that both tools call,
strictly more robust and complete than the best of the current implementations.

## The current mess — who computes what

| Path | Where | Tax quality | Live? |
|------|-------|-------------|-------|
| **`calcDecisionPWA`** | inline in `index.html` (~3669) | **Crude** — flat 20/40, no 45%, no PA taper (`grossToNetIncome`) | ✅ **This is what the Decision Tool "Calculate" button runs** |
| **`DrawdownService` monthly** (`calculateDrawdownRecommendation`) | `src/services` via `DecisionService` → `app.js` | **Proper** (`TaxCalculator`) | Imported into `app.js`/`DecisionPanel`, but not what the visible Calculate uses — a parallel path |
| **`DrawdownService.generateDrawdownSchedule`** | `src/services` | Proper | ✅ Used for the multi-year schedule/glidepath projection only |
| **`SimulationEngine`** | `src/services` | Proper for tax, but its own draw/protection/glidepath/SP code | ✅ The Stress Tester |

So there are **two parallel decision implementations** (inline crude vs module proper)
plus a **separate stress implementation**, each re-deriving the same concepts slightly
differently. That is the root problem.

---

## Every difference (decision inline vs module vs stress)

Legend for **Target**: what the unified engine should do (the superset / "best of").

| # | Concern | `calcDecisionPWA` (live) | `DrawdownService` (module) | `SimulationEngine` (stress) | Target |
|---|---------|--------------------------|----------------------------|------------------------------|--------|
| 1 | **Income tax bands** | 20% & 40% only; **no 45%**, **no PA taper** | Full 20/40/45 + PA taper (`calculateTax`) | Full (`calculateTax`) | **Proper bands everywhere** (module) |
| 2 | **net⇄gross** | `grossToNetIncome` (crude, one-way) | `grossToNet` (proper) | `grossToNet` | Proper `grossToNet` + new `netToGross` |
| 3 | **Tax thresholds source** | Explicit per-tax-year config (`taxYearConfig.pa/brl`); HRL absent | Inflate base PA/BRL/HRL by `cumulativeInflation` (or frozen) | Inflate base (frozen/inflates) | **Support both**: `bandsForTaxYear()` resolves explicit per-year config *or* inflate-from-base |
| 4 | **Cumulative inflation** | Hardcoded tax-year walk starting `26/27`, default CPI **4%** | `cumulativeInflation` passed in; other capped 4% | `cumInf` passed in; other capped 4% | Inflation passed in; **no hardcoded start year**; per-year CPI from config |
| 5 | **Target income** | `confirmedSalary` per tax year (wizard) × cumInf | `baseSalary` × cumInf (no per-year confirm) | `baseSalary` × cumInf | Support per-year confirmed salary (PWA) **and** a **net-budget target** (new) |
| 6 | **Standard SIPP** | `taxYearConfig.expectedMonthly.sipp.gross` (wizard) else BRL-headroom fallback using `grossIncomeToDate` | `min(toBRL, toTarget)`; ignores `grossIncomeToDate` in the draw | `min(BRL, target) − fixed` | Single computation; honour wizard `expectedMonthly` when present; use `grossIncomeToDate` |
| 7 | **State Pension** | **Date-based** (`getStatePensionForTaxYear` / our fixed `StatePensionUtils`) | **Year-number** legacy (`statePensionYear`) | Both (`spStartYear` new + legacy) | **One date-based SP path** (StatePensionUtils) for all |
| 8 | **Protection detection** | Inline (consecutive cash draws, recovery buffer) | Passed in as `inProtection` (computed elsewhere) | Inline, its own version | **`ProtectionService` is the single source**; all callers use it |
| 9 | **Glidepath minimums** | Inline `calcGlidepathMin` | Not computed (optional param) | `calculateGlidepath` | **`GlidepathService` single source** |
| 10 | **ISA top-up** | `min(isaNeeded, allocation/remMonths)`, but net via crude tax | Same shape, net via proper tax | No ISA at all | One ISA function using proper tax |
| 11 | **Annual tax projection** | YTD SIPP + this month + **stdSipp × monthsRemaining** (count-based `12−(historyCount+1)`) | This month's draw **× 12** (assumes flat all year) | Draw × 12 implicitly | **YTD + projected-remaining** (PWA is better) with **proper bands** (module is better) |
| 12 | **`remainingMonths`** | `16−month` (incl. current); *plus* a **count-based** `12−(historyCount+1)` for projection | `getRemainingTaxYearMonths` (`16−month`) | `15−monthInYear` (**0-indexed**, April=3) | One helper, date-based, documented convention; kill the count-based variant |
| 13 | **Tax-boost threshold** | Apply only if boost **> £50** | Apply if **> £0** | Own logic, `> 15000` surplus gate | One rule (parameterised) |
| 14 | **Boost "surplus"** | `totalGrowth − minGrowth − recoveryBuffer` | `(equity+bond) − adjEquityMin − adjBondMin` (no recovery buffer) | `> minGrowth + 15000` | One definition (recovery-buffer-aware) |
| 15 | **Boost projection math** | sum(YTD sipp) + sipp×remMonths | `avg(historySipp)×12 + …` (**averaging quirk**) | own | The YTD-sum method (PWA), proper bands |
| 16 | **Withdrawal sourcing** | Full: Growth vs Cash, equity/bond split, rebalancing, cash replenish, alerts | **None** (amounts only) | Cash-vs-growth only, no rebalancing UI | Extract to one **`WithdrawalSourcing`** module (superset of PWA + `ProtectionService.determineWithdrawalSource`) |
| 17 | **ISA double-count guard** | Excludes current month's existing ISA on recalc | Caller passes `cumulativeIsaSavingsUsed` | n/a | Engine takes explicit YTD-excluding-current; document it |
| 18 | **PCLS / UFPLS (25% tax-free)** | **Not modelled** (SIPP fully taxable) | **Not modelled** | **Not modelled** | **New** — `PensionAccess` levers wired into the strategy |
| 19 | **Output vocabulary** | `note` strings + `alerts[]` | `mode` + `reason` | sim stats | One result schema (mode/reason/alerts) both tools map from |
| 20 | **Granularity** | Monthly | Monthly (+ annual schedule) | Annual (monthly compounding) | Strategy is period-agnostic; orchestrators choose monthly vs annual |

### Correctness bugs surfaced (not just style)
- **#1/#2**: the live Decision Tool under-taxes anyone in the 45% band or the £100k+
  taper — and disagrees with the Stress Tester for the same person.
- **#12**: three different "months remaining" conventions (1-indexed incl-current,
  count-based, 0-indexed) — a latent off-by-one across tools.
- **#15**: the module's `calculateTaxBoost` annualises by *averaging* history
  (`sum×12/length`), which distorts the boost when months are missing.

---

## Target design — a universal module set

Pure, per-person, single-source-of-truth modules. Both tools' orchestrators call the
**same** strategy, so they agree by construction. Each is independently unit-testable.

```
                 ┌───────────────────────────────────────────────┐
                 │  PlanContext (normalised settings + tax-year   │
                 │  config + person) — one shape both tools build │
                 └───────────────────────────────────────────────┘
                                     │
   ┌──────────────┬─────────────────┼──────────────────┬───────────────────┐
   ▼              ▼                 ▼                  ▼                   ▼
TaxEngine    IncomeModel       Glidepath        ProtectionService     PensionAccess
(bands,      (other CPI-cap,   (minimums)       (detect protection)   (UFPLS/PCLS,
 tax, g→n,   date-based SP,                                            tax-free levers)
 n→g,        grossIncomeToDate)
 marginal)
   └──────────────┴─────────────────┬──────────────────┴───────────────────┘
                                     ▼
                          DrawdownStrategy  ← the single algorithm
                 (target mode: gross-equiv OR net-budget;
                  fill-to-BRL + ISA + UFPLS tax-free + boosts;
                  protection reduction; YTD+projected annual tax)
                                     │
                                     ▼
                          WithdrawalSourcing
                 (Growth vs Cash, equity/bond split,
                  rebalancing, cash replenishment, alerts)
                                     │
              ┌──────────────────────┴───────────────────────┐
              ▼                                               ▼
   computeMonthlyDecision(ctx)                       simulateYear(ctx)
   (Decision Tool orchestrator —                     (Stress orchestrator —
    replaces calcDecisionPWA)                         replaces calculateMonthlyDraw
                                                      + inline sim draw logic)
```

### Modules

1. **`TaxEngine`** (evolve `TaxCalculator`). `incomeTax`, `grossToNet`, `netToGross`,
   `marginalTaxOn(slice, existingIncome, bands)`, and `bandsForTaxYear(ctx)` that
   resolves PA/BRL/HRL from explicit per-year config **or** inflate-from-base (unifies
   #3). **Delete `grossToNetIncome`.**
2. **`PensionAccess`** *(done)* — UFPLS / PCLS / tax-free primitives (#18).
3. **`IncomeModel`** — one place for non-pension income: other pension (CPI-capped),
   **date-based State Pension** (#7), `grossIncomeToDate`. Returns fixed-income parts.
4. **`Glidepath`** *(exists)* — the only source of adjusted minimums (#9).
5. **`ProtectionService`** *(exists)* — the only source of protection state (#8);
   inline detection in PWA and sim are deleted and call this.
6. **`DrawdownStrategy`** — the core. Inputs: funds, target (**gross-equiv or net
   budget**, #5), resolved bands, fixed income, ISA allocation, protection state, and
   the levers. Produces the withdrawal breakdown `{ sipp, ufplsTaxFree, ufplsTaxable,
   isa, pcls, tax, net, mode, reason, boost }`. Owns the one correct annual-tax
   projection (YTD + projected-remaining, proper bands — #11/#15) and one boost rule
   (#13/#14).
7. **`WithdrawalSourcing`** — bucket selection, equity/bond split, rebalancing, cash
   replenishment, alerts (#16) — superset of PWA + `ProtectionService.determineWithdrawalSource`.
8. **Orchestrators** (thin): `computeMonthlyDecision(ctx)` replaces `calcDecisionPWA`;
   `simulateYear(ctx)` replaces the stress draw logic. Both wire the same modules.
9. **`PlanContext`** — normalises settings + tax-year config + person into one shape.
   **This is the couples seam**: a household is `PlanContext[]`; a target allocator
   splits the household target across persons, each run through `DrawdownStrategy`.

### Why this beats the best of what exists
- Proper tax **everywhere** (from module) — kills the live under-taxation.
- **Date-based SP everywhere** (from PWA) — kills the module's legacy year-number SP.
- Both threshold mechanisms supported (superset of #3).
- Wizard `expectedMonthly` / `confirmedSalary` honoured (from PWA).
- Integrated sourcing + rebalancing + alerts (from PWA), which the module lacks.
- Correct YTD+projected annual tax (PWA) with proper bands (module) — best of both.
- **New**: UFPLS/PCLS levers, net-budget target mode, capex hooks — completeness.
- Single protection + glidepath source; one `remainingMonths` convention.
- Per-person by construction → couples later with no rewrite.

---

## Migration & verification plan
1. **Pin current behaviour.** Golden-master tests capturing `calcDecisionPWA` outputs
   for a representative matrix (basic-rate & higher-rate & £100k+; protection on/off;
   tax-efficient & inefficient years; early/mid/late tax-year months). Do the same for
   `SimulationEngine` success rates on a fixed seed.
2. **Build the modules** with unit tests (many already exist for pieces).
3. **Swap the Decision Tool** to `computeMonthlyDecision`. Diff against the golden
   master. Where numbers move, they should move **only** in the cases the crude tax got
   wrong (45% / taper) — every such move is reviewed and signed off, not silent.
4. **Swap the Stress Tester** to `simulateYear`; confirm success-rate deltas are
   explained (proper SP/tax) and seed-stable.
5. **Delete** `calcDecisionPWA`, `grossToNetIncome`, and the parallel/averaging code.

_Last updated 2026-07. Feeds roadmap item [0]; unblocks [1] (levers) and [2] (net-budget)._
