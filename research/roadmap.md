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
| 1 | **Tax-lever engine** — primitives ✅; UFPLS/PCLS wired into BOTH tools 17 Aug 2026 (access method + phased access). Remaining: band-fill-and-recycle strategy | B | S | Med (tax correctness) | 0 | Mostly done |
| 2 | ~~Net-budget income mode~~ | B | M | Low | 1 | **Done Aug 2026** |
| 3 | **Person-scoped data model** (household = 1–2 people) | A+B | M | Med (touches data model) | — (fold into 1–2) | Next |
| 3b | **Unified settings model** (one schema, two instances; ISA as a depleting pot; seed-from-Decision) — design in `design/settings-model.md` | A+B | L | Med | 0, 3 | Next |
| 4 | ~~Bucket composition~~ — superseded by SUB_ASSET_PROFILES (18-class registry, user weights via fund tagging, admin-tunable) | A+B | L | Med | — | **Done Aug 2026** |
| 5 | ~~Equity/bond correlation~~ — superseded: per-sleeve regime-dependent ρ via variance-preserving transform in SubAssetReturns | A | S | Low | 4 | **Done Aug 2026** |
| 6 | **Capital expenditure** (lumpy one-off spends, e.g. car every 4 yrs) | A+B | S | Low | 2 | Later |
| 7 | **Couples build** (dual allowances, who-draws-what optimisation) | A+B | L | High | 3 | Later |
| 8 | Composition auto-optimisation in stress optimiser | A | XL | High | 4 | **Deferred** (rabbit hole) |

Effort: S ≈ hours, M ≈ a day or two, L ≈ multi-day, XL ≈ weeks.

---

## Now → Next → Later

### 🔵 Now
- **[0] STATUS UPDATE (16 Aug 2026 audit):** unification is ~70% done — tax, planDrawdown,
  protection DETECTION, tax-boost, glidepath, inflation, spending smile and the ISA pot are all
  shared modules called by BOTH live engines, and the central bug (stress modelling a different
  withdrawal) is fixed with golden + crossval suites pinning parity (312 tests). REMAINING to hit
  the DoD, in order (sizes S/M/L): (1)S one protection unit (factor% vs mult, disableProtection in
  decision); (2)S one recovery-buffer constant + pass-through; (3)S stress SP year/pro-rata off the
  tax-year grid; (4)S Drawdown sub-tab reads date-based SP + capped other-income (user-visible bug
  today); (5)S/M fold the tax-inefficient branch into planTaxBoost/planDrawdown; (6)M/L extract
  WithdrawalSourcing (Mixed branch, one replenishment threshold-set with execute flag, rebalance,
  one spill order); (7)L PlanContext + DrawdownStrategy.decide() (one remainingMonths convention,
  kill the 2026 epoch + '26/27' key-walk); (8)S ~~delete the dead layer~~ DONE 17 Aug 2026 (ProtectionService,
  DecisionService except saveDecision, DrawdownService's dead calculateSIPPDraw/
  calculateDrawdownRecommendation — generateDrawdownSchedule is LIVE and was FIXED not
  deleted, BOND_MODEL, SimulationConfig legacy builder, services barrel, STATE_PENSION_FLOOR,
  isaContribution); (9)S/M equity into the SubAsset registry (the registry itself shipped —
  see audit); (10)S refresh the two design/*.md audits. Items (1)-(4) DONE 17 Aug 2026
  (protection unit seam + disableProtection in decision; recovery buffer single-sourced
  15000 + pass-through + stress UI field; SP sim-config shared helper; Drawdown sub-tab
  date-based SP + capped other + UFPLS-aware). CPI: decision-side unentered-year assumption
  unified to DECISION_ASSUMED_CPI (4%) — entered CPI is authoritative (user knows current
  CPI; the stress tester assumes). **See research/roadmap-audit-aug-2026.md for the
  authoritative tiered plan.**
- **[0] Unify the whole engine.** (original framing — see status above) Full audit in `design/engine-unification.md` (+
  tax/drawdown deep-dive in `design/decision-engine-unification.md`). Every functional
  area — tax, inflation, returns, protection, glidepath, State Pension, sourcing — has
  **three parallel implementations** (live inline decision, live stress, and a
  cleanly-factored module layer that is **dead code**). The two live tools disagree,
  including a central issue: **the Stress Tester models a different withdrawal than the
  Decision Tool** (gross-to-BRL, no tax/ISA, vs net-target with ISA), so it isn't
  testing the plan the user runs. See the prioritised **bug register** (7 high-severity)
  in the audit. **DoD:** one `PlanContext` + one `DrawdownStrategy.decide()` both tools
  call, parity-pinned, all duplicates deleted. Unblocks every lever below (build once).
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
- ~~**Landing page: showcase all THREE tools**~~ DONE 15 Aug 2026 (commit on branch, not
  yet deployed to pensiontools.uk): landing + post-signin onboarding now present Budget
  Planner first, then Stress Tester (Tool 2) and Decision Tool (Tool 3); net-first
  wording; stale "choose which tools" copy fixed; Accumulation Planner stays Coming Soon.
- **Privacy policy: single canonical URL** (user, 15 Aug 2026). Treat **pensiontools.uk**
  as THE app URL in the privacy policy — drop the GitHub Pages framing (Cloudflare is
  the primary host; keep processors accurate). Update `compliance/PRIVACY_POLICY.md` +
  `public/privacy.html` together.
- ~~⚠️ HOLD deployments to pensiontools.uk~~ — hold LIFTED 16 Aug 2026; deploy after every
  merge to main (Cloudflare does not auto-deploy).
- ~~**[2] Net-budget mode.**~~ DONE Aug 2026 — the whole app is net-first now (budget
  target flows into both tools; net⇄gross solved in the engines, incl. the UFPLS
  bisection inverter).
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

_Last updated: 2026-08-17 — access method (drawdown/UFPLS) + phased access shipped to both tools; [1] reduced to band-fill-and-recycle; [2] done._
