# Stage 0 — Budget tool (net-first), build plan for sign-off

Part of the net-native cashflow direction in `budget-and-income-model-research.md`. Stage 0 ships the
**budgeting tool** and the **plan's spending data model** without touching the tested engines. It is
independently useful and lays the data foundation Stages 1–3 build on.

## Working assumptions (flag any you disagree with)
- **Net-native, staged** is the direction (Stage 0 changes no engine; golden master stays byte-identical).
- Budget produces **two figures: essential + comfortable** monthly net.
- Lives in a **new top-level "Budget" tab** (beside Decision Tool / Stress Tester), with a **wizard** for
  first setup and an **editable page** to revisit.
- Structure borrows James Shack's Cashflow Plan: **age-banded expenditure phases** + **per-year lump sums**.

## Stage 0 scope
**In:**
1. A **Budget data model** stored per plan (scenario), couples-ready in shape (single-person built now).
2. A **Budget tab**: setup wizard + editable page, with **PLSA benchmark** chips for sanity.
3. Expenditure entered as **essential vs discretionary**, each line optionally **age-banded** (from/to age;
   default = retirement→end). Sum → **essential** and **comfortable** annual/ monthly net.
4. **Lumpy / one-off items** list: label, amount (today's money), first age/year, optional *recur every N
   years* (e.g. car £25k every 8y), tier.
5. A **non-invasive hand-off** to the existing plan: the tool computes a suggested **gross annual target**
   from the comfortable net (a transparent, clearly-approximate gross-up using the plan's tax bands) and
   offers a one-click **"Use as my plan's target income"** — it does **not** silently overwrite the engine.
6. Unit tests for the budget math (phase summation, recurrence expansion, net↔gross helper).

**Out (later stages):** the net cashflow engine that draws from pots to meet the need (Stage 1); GIA/CGT and
lump-sum in/out events in the projection (Stage 2); two-person pooled drawdown (Stage 2); making net the
primary target everywhere and retiring the gross path (Stage 3).

## Data model (`budget`, per scenario)
```
budget: {
  version: 1,
  currentAge, retirementAge, endAge,          // planning horizon (endAge default 100)
  // Recurring expenditure — age-banded phases (today's money, annual)
  lines: [
    { id, label, tier: 'essential'|'discretionary',
      annual,                                   // £/yr in today's money
      fromAge|null, toAge|null }               // null = whole retirement
  ],
  // Irregular / lumpy items (today's money)
  oneOffs: [
    { id, label, tier, amount, atAge, everyYears|null }   // everyYears null = single
  ],
  // cached, recomputed on save (display + hand-off)
  derived: { essentialMonthlyNet, comfortableMonthlyNet, essentialAnnualNet, comfortableAnnualNet }
}
// COUPLES-READY: a later `partner` block mirrors identity/assets/income; expenditure (this object) stays
// household/joint. Stage 0 stores only the primary; the schema doesn't need to change for couples.
```

## Budget tab — UI
**Wizard (first-time / "redo budget"):**
1. Horizon — current age, target retirement age (prefill from plan), end age.
2. Essentials — categorised rows (Housing, Utilities, Food, Transport, Health, Insurance…) with £/yr or
   £/mo toggle; running total.
3. Lifestyle (discretionary) — Eating out, Holidays, Hobbies, Gifts/Family, Pets…; running total.
4. Phases (optional) — "does any of this change with age?" add a from/to age to a line, or add a reduced
   later-life band (defaults sensibly so a user can skip).
5. One-offs — add lumpy items (car every N years, roof, big trip, helping kids…).
6. Review — **Essential £X/mo · Comfortable £Y/mo**, PLSA chips (Min/Moderate/Comfortable) for comparison,
   a timeline strip of one-offs, and the **"Use as my plan's target"** button.

**Editable page** (revisit): the same sections as cards (reuse `.settings-section`), inline-editable, live
totals + PLSA chips. Respects the **plan lock** (a locked plan's budget is read-only with the same
unlock/new-plan rules — budget is part of the plan definition).

## Storage & wiring
- New `src/storage/BudgetRepository.js` (mirrors Decision/Stress repos): `getActiveBudgetAsync`,
  `saveActiveBudget`, defaults, migration; add a `budget` blob to the scenario via `ScenarioRepository`.
- New `src/services/BudgetModel.js` (pure, unit-tested): `monthlyNet(budget)` → essential/comfortable;
  `expandOneOffs(budget, years)` → per-year lump schedule; `grossUpAnnual(net, taxBands)` interim helper.
- `index.html`: new Budget tab + wizard wiring + editable page; reuse number-format overlay, cards, wizard
  patterns (SetupWizard/TaxYearSetupWizard).
- Hand-off: "Use as my plan's target" sets the Decision (and optionally Stress) `baseSalary` via existing
  save paths — going through the normal (lock-aware) save, so nothing bypasses the plan lock.

## Testing
- `tests/BudgetModel.test.js`: phase summation across age bands; essential vs comfortable totals; one-off
  recurrence expansion (car every 8y within horizon); £/yr↔£/mo; gross-up round-trips within tolerance.
- **Golden master untouched** — Stage 0 adds no engine path; existing 260 tests must stay green.

## Couples-readiness (design-now, build-later)
Stage 0 stores only the primary person's identity/assets and the **joint** expenditure. The schema already
treats expenditure as household, so adding a `partner` block later (assets/income/retirement age, with
per-person tax) needs no rework of the budget object — only the Stage 2 cashflow engine learns to draw
across both people's pots against their **individual** allowances (the couples tax win).

## Files
- New: `src/services/BudgetModel.js`, `src/storage/BudgetRepository.js`, `tests/BudgetModel.test.js`,
  UI blocks in `index.html`.
- Modified: `src/storage/ScenarioRepository.js` (budget blob), `index.html` (tab + wizard + page),
  `src/app.js` (re-exports).
```
```
## Open confirmations before coding
1. Placement = **new top-level Budget tab** (vs setup-wizard step / Decision sub-tab)?
2. Show **PLSA benchmark** numbers in the review step?
3. Hand-off = **suggest + one-click apply** to the plan target (recommended, non-invasive) vs auto-set?
4. Scope check: OK to include **age-banded phases + one-offs** in Stage 0, or start with a **flat
   essential/comfortable** pair and add phases/one-offs in Stage 0.1?
```
