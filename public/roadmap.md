# PensionTools — Product Roadmap

_Living document. Open it, pick the top unblocked item under **Now**, build it, tick it off._

---

## Mission — the two jobs

Every feature is judged against exactly two questions. If it doesn't make one of
these better, it's a distraction.

- **Job A — "Can I afford to retire?"** The Stress Tester: long-horizon Monte Carlo
  and historical projection of whether the money lasts.
- **Job B — "What do I draw this month?"** The Decision Tool: monthly, tax-year-aware
  guidance on how to source income following the user's bucket rules.

## Principles

1. **Engine first, UI last.** Build tested pure functions in the domain layer before
   wiring any screen. UI is the easy part and must not lead.
2. **Per-person primitives.** Tax/withdrawal calculations operate on one person's
   numbers. A "household" is 1–2 people; single is a household of one. This keeps
   couples support cheap to add later without a rewrite.
3. **No false precision.** Assumptions (returns, vols, correlations, tax rules) must
   be sourced and shown to the user. Made-up numbers are worse than none.
4. **Modelling, not advice.** Audience is the public, so we never make personalised
   recommendations. The user chooses; we model the consequences. Show disclaimers and
   "this is not financial advice / tax rules change / consult an adviser."
5. **Parity-tested refactors.** Any invisible refactor (asset registry, household
   model) must reproduce current numbers under test before extending behaviour.
6. **One engine, two tools.** The Stress Tester and Decision Tool must compute income,
   tax, and withdrawals through the *same* code. Any feature added once should be felt
   in both. No parallel/inline copies of tax logic.

---

## Backlog

| # | Item | Job | Effort | Risk | Depends on | State |
|---|------|-----|--------|------|-----------|-------|
| 0 | **Unify the income/tax/withdrawal engine** (one engine both tools call) | A+B | M | Med | — | **Now (prerequisite)** |
| 1 | **Tax-lever engine** — primitives done ✅; wiring into tools | B | M | Med (tax correctness) | 0 | Primitives done; wiring blocked on 0 |
| 2 | **Net-budget income mode** (enter net £/month → back-solve draw mix) | B | M | Low | 1 | Next |
| 3 | **Person-scoped data model** (household = 1–2 people) | A+B | M | Med (touches data model) | — (fold into 1–2) | Next |
| 4 | **Bucket composition** (asset-class registry; user weights) | A+B | L | Med (assumptions) | — | Later |
| 5 | **Equity/bond correlation** (Cholesky, per Feb model review) | A | S | Low | 4 | Later |
| 6 | **Capital expenditure** (lumpy one-off spends, e.g. car every 4 yrs) | A+B | S | Low | 2 | Later |
| 7 | **Couples build** (dual allowances, who-draws-what optimisation) | A+B | L | High | 3 | Later |
| 8 | Composition auto-optimisation in stress optimiser | A | XL | High | 4 | **Deferred** (rabbit hole) |

Effort: S ≈ hours, M ≈ a day or two, L ≈ multi-day, XL ≈ weeks.

---

## Now → Next → Later

### 🔵 Now
- **[0] Unify the income/tax/withdrawal engine.** Today there are three tax
  implementations: the proper `TaxCalculator` (used by the Stress Tester and
  `DrawdownService`), and a **crude inline copy** (`calcDecisionPWA` /
  `grossToNetIncome` in `index.html`, flat 20/40% with no additional rate and no PA
  taper) that the **live Decision Tool "Calculate" actually runs**. The two tools can
  already disagree above ~£100k income. Point the Decision Tool at `DrawdownService`
  and delete the inline duplicate. **DoD:** one engine, both tools call it, parity
  tests pin the numbers, inline `calcDecisionPWA`/`grossToNetIncome` gone. This
  unblocks every lever below (implement once, not 2–3×).
- **[1] Tax-lever engine.** The Decision Tool currently offers one path only: draw
  SIPP fully taxable to the basic-rate limit, top up with ISA. It ignores the 25%
  tax-free entitlement entirely — so the "optimal tax-efficient drawdown" promise is
  incomplete at its core. Build the missing per-person primitives:
  - `netToGross()` inverter (needed by net-budget mode).
  - **UFPLS**: each withdrawal is 25% tax-free / 75% taxable at marginal rate.
  - **PCLS**: 25% tax-free cash on crystallisation, capped by the Lump Sum Allowance
    (£268,275), remainder into drawdown.
  - Net-target inversions (what gross UFPLS nets a target £).
  - **DoD:** pure functions in `src/services/PensionAccess.js` + `netToGross` in
    `TaxCalculator.js`, fully unit-tested, no UI. Round-trip tests prove correctness.

### 🟡 Next
- **[2] Net-budget mode.** "Enter target gross salary" is backwards — people know
  "£3,200 in the bank", not a gross figure. Add a second entry mode that takes a net
  monthly target and back-solves the drawdown/ISA/UFPLS mix. Builds directly on [1].
- **[3] Person-scoped data model.** Refactor scenario settings so pots, allowances,
  ISA, and State Pension date belong to a *person*; a scenario holds a household of
  1–2. Single-person behaviour must be byte-for-byte unchanged (parity tests). Do this
  as groundwork while wiring [1]/[2] so we don't accrue "everything assumes one person"
  debt. **We are architecting for couples now; building couple features later.**

### 🟢 Later
- **[4] Bucket composition.** Generalise the (currently hidden, hardcoded) blends into
  a first-class `ASSET_CLASSES` registry — `{ label, realMean, vol, corrToEquity }`.
  A bucket becomes a weighted list of asset classes. Refactor existing buckets to use
  it with matching numbers first (parity), then expose weights in the UI: equity →
  bonds → cash. This is also the correct home for the Feb model-review fixes.
  Assumptions from Dimson-Marsh-Staunton / Vanguard capital-market assumptions, shown
  transparently.
- **[5] Correlation.** Add equity/bond correlation via Cholesky (spec already in
  `docs/model-review-feb-2026.md`). Slots into [4]'s return engine.
- **[6] Capital expenditure.** A list of `{ amount, everyNYears, from }` the projection
  subtracts (Job A) and the monthly tool plans a lump sum for (Job B).
- **[7] Couples build.** With [3] in place, add dual-allowance optimisation: which
  spouse draws what to fill both personal allowances and basic-rate bands — one of the
  biggest tax wins in UK retirement. Handle transitions (one retired → both retired).

### ⛔ Deferred
- **[8] Composition auto-optimisation.** Letting the stress optimiser search *within*
  buckets (not just across them) is a high-dimensional problem with poor payoff for
  now. Users pick composition; the model reflects it. Revisit much later.

---

## Notes & guardrails
- **Regulatory line:** [1], [3], [7] touch tax and allocation — exactly where a tool
  drifts toward regulated advice. Keep everything framed as "you choose, we model."
- **Assumptions are the credibility crux** for [4]/[5], not the code. Budget real time
  for sourcing numbers and showing them.
- **Tax figures** currently hardcode 2024/25 bands in `constants.js`; per-tax-year
  overrides already exist in the Decision Tool and should flow into the new levers.

_Last updated: 2026-07 — Step 1 (tax-lever engine) in progress._
