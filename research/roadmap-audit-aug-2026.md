# Roadmap Audit & Forward Plan — August 2026

_Deep audit of `research/roadmap.md` against the code at HEAD `679a8e3` (323 tests), plus
market research on comparable UK tools and 2026/27 accumulation rules. Two questions:
should the roadmap items be built as stated, and what should an Accumulation tab be?_

---

## Part 1 — Headline findings

### Three LIVE accuracy bugs found during the audit (fix before anything else)

**A. Decision plans inflate at 4%, Stress plans at 2.5% — the "plans not comparable" bug
believed fixed is still live.** `legacyDecision.js:77` was unified to `DEFAULT_CPI` (2.5%),
but `DecisionRepository.js:238` writes `cpi: 0.04` into **every new tax-year config**, and the
stored value wins over the default. Also emitted at `index.html:8865` (`|| 0.04`),
`TaxYearSetupWizard.js:765` (`|| 4`). A real user's Decision tool compounds a different
inflation than their Stress test. **Effort: S.**

**B. The Drawdown & Glidepath sub-tabs are running a third, wrong engine.**
`DrawdownService.generateDrawdownSchedule` (live on both sub-tabs via `index.html:7976/:8014`):
reads the **legacy** `statePensionYear`/`statePension` fields (so a user with a real SP date
sees SP at year 12/£12k here and the correct date in Monte Carlo), applies **no 4% cap** to
other income, and calls `planDrawdown` **without `taxFreeFraction`** — the UFPLS/phased-access
feature is invisible on these tabs. **Effort: S.**

**C. The recovery buffer never reaches the stress engine.**
`StressRepository.createSimulationConfigFromSettings` never emits `recoveryBuffer`, so
`SimulationEngine` always uses 10 000 regardless of what the user set (Decision side defaults
15 000; `index.html` disagrees with itself: line 3657 says 10 000, line 6449 says 15 000).
A user who tunes the buffer is stress-testing a different protection rule with no way to
know. **Effort: S.**

### Roadmap items already DONE (close them)

- **[2] Net-budget mode** — done (app is net-first end to end).
- **[4] Bucket composition** — done under a different name. `SUB_ASSET_PROFILES` is an
  18-class registry with 11 calibrated fields each, user weights via the 150-fund tagging UI,
  admin-tunable at runtime. Richer than the roadmap's proposed `{label, realMean, vol, corr}`.
- **[5] Cholesky correlation** — superseded. Per-sleeve, regime-dependent correlation via a
  variance-preserving transform (mathematically a 2-variable Cholesky) is live in
  `SubAssetReturns.js`, plus structural bond/equity co-movement through the gilt-yield path.
- **[1] Tax levers** — UFPLS/PCLS primitives AND wiring done (access method + phased access,
  Aug 2026). Remaining slice: band-fill-and-recycle (below).

**Housekeeping from this:** `SubAssetModel.js` headers still claim the module is
"NOT yet wired / intentionally INERT / SUB_ASSET_ENABLED = false" — all false; and
`ScenarioRepository.js:74/:99` claims the ISA pot is "not yet read by the engine" — false.
Fix the lies; delete the unread `SUB_ASSET_ENABLED` flag.

### Roadmap items that are WRONG as stated

- **Unification item (8) "delete most of DrawdownService" would break two live tabs.**
  `generateDrawdownSchedule` powers the Drawdown and Glidepath sub-tabs; it needs FIXING
  (bug B), not deleting. The genuinely dead ~390 lines are `calculateSIPPDraw` +
  `calculateDrawdownRecommendation` (plus `ProtectionService.js`, most of
  `DecisionService.js`, `BOND_MODEL`, `SimulationConfig` legacy builder, the
  `services/index.js` barrel, `STATE_PENSION_FLOOR`, and the never-read `isaContribution`).
- **Item (9) "MarketModel registry" is mostly obsolete** — the sub-asset work IS the
  registry. What remains is narrow: delete `BOND_MODEL` + hardcoded `calculateBondReturn`
  weights once `subAsset` is default-on, and bring equity (still a raw historical replay)
  behind the same interface. S/M, not M/L.
- **[3] person-scoped model is NOT "M, fold into 1–2".** The budget layer is already
  genuinely person-scoped (`paidBy` per line, partner facts captured and persisted by the
  wizard) but not one engine argument or settings field is person-aware, and the cost is
  dominated by ~40 flat DOM ids in index.html. It's **L**, and doing it before PlanContext
  (item 7) means paying the UI plumbing twice. **Sequence: PlanContext first.**
- **Band-fill-and-recycle is much smaller than positioned.** It is structurally a variant of
  the existing `planTaxBoost` (3 of its 4 caps are identical; only trigger + destination
  differ), and the PCLS-to-ISA transfer shipped in phased access is the exact plumbing
  precedent for the stress side, `pclsSuggestion` for the decision side. **S/M** — but the
  tax-inefficient branch fold (item 5) is a hard prerequisite, because that branch currently
  bypasses both `planDrawdown` and `planTaxBoost` entirely.

---

## Part 2 — Market research: what comparable tools have (2025–26)

Tools reviewed: Guiide, Timeline (adviser), EvolveMyRetirement, MoneyHelper, Voyant Go,
RetireEasy, Isaac, ProjectionLab, Boldin, FICalc/cFIREsim. Features worth stealing, ranked
by value-to-effort for PensionTools:

| Rank | Feature | Seen in | Fit | Effort |
|---|---|---|---|---|
| 1 | **Couples/household** (two SP ages, two tax bands, survivor step-down) | Voyant, Boldin, Evolve; #1 gap users cite in Guiide | Budget already splits per person | M–L |
| 2 | **DB pension + SP as income floors** | Guiide, MoneyHelper, Voyant | Trivial engine change (fixed indexed income), big user segment | **Low** |
| 3 | **One-off capital events** (car, roof, care, inheritance in) | Voyant, ProjectionLab | Budget already models them — they're just flattened (Part 3) | **Low–M** |
| 4 | **Named guardrails spending rules** (Guyton-Klinger / risk-based) | Timeline, FICalc, Income Lab | Protection mode ≈ already a guardrail; formalise + compare | Low–M |
| 5 | Withdrawal-strategy side-by-side comparison | FICalc | Reuses engine | M |
| 6 | **Longevity percentiles** (ONS cohort: 50/25/10% survival ages) instead of fixed horizon | Timeline, Boldin | Small table + UI; consensus best practice is "fixed horizon set at ~10th-percentile survival age, adjustable" | **Low** |
| 7 | Annuitise-later modelling (secure income at 75/80 with part of pot) | GuiidePath, Evolve | Natural end-state of the bond tent | M |
| 8 | Milestone/condition rules ("if pot < X at 70…") | ProjectionLab | Power feature, UI-heavy | High |
| 9 | Care-cost scenario (3 yrs × £60k late-life) | Boldin, Voyant | ~Free once #3 exists | Low |
| 10 | Year-by-year tax drill-down / Sankey | ProjectionLab, Boldin | Trust builder, pure frontend | M |

Notes: MoneyHelper is rated weakest (no tax modelling); Boldin's Roth-conversion band-filling
is the US mirror of our SIPP-to-BRL logic — we're already strong there. Data point: current
PLSA (Pensions UK) Living Standards are **single £13,900 / £32,700 / £45,400**, couple
£22,500 / £45,400 / £62,700 — check our tier table against these (admin override exists).

---

## Part 3 — Capital expenditure [6]: the modelling exists, the hand-off destroys it

The Budget already models temporary items (`fromAge/toAge`) and recurring lumps
(`oneOffs[] {amount, atAge, everyYears}` with a tested `oneOffSchedule` expander). But
`applyBudgetToPlan` flattens everything to ONE scalar `baseSalary`:

1. `summariseBudget` evaluates spend **only at retirement age** — a 3-year car lease is
   charged for all 35 years; a mortgage ending at 68 never ends.
2. Recurring lumps are annuitised (`amount / everyYears`); the dated `oneOffSchedule` is
   called by no production code.

**Fix properly (M, not the roadmap's flatten-only S):** replace the scalar with a per-year
target vector — `targetForYear(config, year)` in `SimulationEngine.calculateMonthlyDraw`
(and the fixed DrawdownService) fed by age-aware `annualNetAtAge` + `oneOffSchedule`.
This one change delivers: real temporary items, real capex, care-cost scenarios (rank 9),
and the correct target curve for accumulation. **Highest realism-per-effort item on the
whole list.**

---

## Part 4 — Accumulation tab

### Why it's cheaper than it looks
The stress engine's monthly loop already does everything accumulation needs — compounding,
glidepath, block-bootstrap returns, inflation chain, ISA pot, per-year snapshots.
**Accumulation is largely a sign flip**: replace the monthly draw with a monthly
contribution and skip sourcing/protection/tax-on-withdrawal. `TaxCalculator` already has
`netToGross` and `marginalTaxOn` (for relief arithmetic); `GlidepathService` can express a
reducing-equity glide; LSA tracking exists. Currently there is **zero** accumulation code —
one "Coming Soon" card post-signin (the landing page doesn't mention it at all).

### What's genuinely new (the UK rules module)
An `AnnualAllowance`/contribution-rules module (2026/27 figures, verified):

| Rule | Figure |
|---|---|
| Annual allowance | £60,000 (personal relief also capped at 100% earnings or £3,600 gross) |
| Taper | threshold £200k / adjusted £260k, £1 per £2, floor £10,000 |
| MPAA | £10,000, irreversible, triggered by UFPLS/flexi income — **we know this from the decision tool** |
| Carry-forward | 3 prior years, earliest first |
| Relief methods | relief-at-source (higher-rate claim-back often missed) / net pay / salary sacrifice (+employee 8%/2% & employer 15% NI — **NI exemption capped at £2,000/yr from April 2029**, Autumn Budget 2025) |
| Auto-enrolment | 8% of qualifying earnings £6,240–£50,270 (3% employer) |
| NMPA → 57 | **6 April 2028 cliff edge** (1971–73 birth cohort has a use-it-early window) |
| SP age | 67 phased Apr 2026–28; full new SP 2026/27 £241.30/wk = £12,548/yr |
| LSA | £268,275 — flag tax-free-cash dilution once projected pot > £1,073,100 |

### Design (three pillars — each is a differentiator no UK consumer tool has)

1. **"On track for YOUR budget", not a rule of thumb.** The user already built a personal
   net budget. The accumulation tab computes the pot that funds *that* budget (net of tax,
   minus SP from SP age, minus any DB) by running the **existing stress engine** from the
   chosen retirement date: "£X/month contributions → 90% success against your own budget
   from age 63." PLSA Minimum/Moderate/Comfortable appear only as reference gridlines.
   Nobody in the UK market closes this loop.

2. **Net-contribution-first with a wrapper/relief view.** "I can spare £500/month net" →
   gross purchase under their scheme type (RAS incl. the unclaimed higher-rate warning /
   net pay / salary sacrifice incl. NI and the 2029 cap), employer-match capture check,
   LISA-vs-SIPP at their marginal rate, AA/taper warnings — and the unique cross-check:
   **"your decision-tool UFPLS withdrawals have capped your contributions at £10,000
   (MPAA)"**. No consumer tool offers that link.

3. **One timeline, one engine.** Accumulation runs through the same stochastic engine and
   allocation machinery; the accumulation glide (de-risk from ~10 years out,
   drawdown-appropriate rather than annuity-targeted lifestyling) joins the existing bond
   tent at the retirement date, which becomes a slider — "when can I stop?" on one chart.
   Cliff edges drawn per person: 57 (Apr 2028), SP at 67, horizon defaulting to a
   longevity percentile rather than a fixed year. Built per-person, this is also the
   groundwork for couples.

**MVP slice (recommended):** deterministic low/mid/high (FCA-style) + stochastic band from
the existing engine; single person; contributions (member+employer, escalation %); RAS +
salary-sacrifice arithmetic; on-track-vs-own-budget dial; MPAA/AA warnings. Defer:
carry-forward calculator, taper edge cases, LISA modelling, DB accrual.

---

## Part 5 — The revised plan

### Tier 0 — Accuracy fixes (days; do immediately, in one batch)
1. CPI 4%/2.5% unification (bug A) — one default + fallbacks + migration note.
2. Drawdown/Glidepath sub-tab: date-based SP, capped other income, pass `taxFreeFraction`
   (bug B).
3. Recovery-buffer pass-through + one constant + one UI story (bug C).
4. Protection unit: one unit (factor %), translate at the seam, honour `disableProtection`
   in the Decision engine.
5. Scoped dead-code delete (the corrected list; keep `generateDrawdownSchedule`).
6. Fix the false module headers (SubAssetModel, ScenarioRepository); close roadmap
   [2]/[4]/[5]; re-scope (9) to "equity into registry + delete BOND_MODEL".

### Tier 1 — Finish the tax story (S/M each, in order)
7. Fold the tax-inefficient branch into `planDrawdown` + `planTaxBoost` (item 5 — also
   fixes: ISA dead in inefficient years, no anti-cram cap in the hand-rolled boost).
8. **Band-fill-and-recycle** as a `planTaxBoost` destination (`'spend' | 'isa'`), stress
   executes (PCLS-transfer plumbing), decision advises (`recycleSuggestion` à la
   `pclsSuggestion`). Optional "spend ISA last" ordering toggle with it.

### Tier 2 — Realism (M each; high value-to-effort from market research)
9. **Per-year target vector** (Part 3) — real temporary items + capex + care scenarios.
10. **DB pension / extra income floors** — `{amount, startAge, indexation}` list beside SP.
11. **Longevity-percentile horizon** — ONS cohort table; default duration = 10% survival
    age, adjustable; per person.

### Tier 3 — Accumulation tab (L; the next big build)
12. As Part 4. Prerequisites: none hard; benefits from 9 (target vector) and 11 (horizon).
    Landing page gains the fourth card when it ships.

### Tier 4 — Deep unification (L; hygiene that unlocks couples)
13. WithdrawalSourcing extraction (restore the Mixed branch from dead ProtectionService;
    one replenishment rule with execute flag; one spill order; decide bond-before-equity
    deliberately).
14. PlanContext + `decide()` (kills 2026 epoch, '26/27' key-walk, three `remainingMonths`
    conventions).
15. Person-scoped model **after** PlanContext (the budget layer is already person-scoped;
    the wizard already captures partner facts).
16. Couples: start with "two per-person plans + the household budget split" (already 80%
    real), THEN dual-allowance optimisation (who draws what to fill both PAs/BRLs) as the
    end-state — the market's #1 requested feature.

### Parked (unchanged)
- Yield-as-income (M): needs an equity price/yield split decision first (double-count
  hazard — equity series is total-return). Cheap first step: display portfolio yield (S).
- Withdrawal-strategy comparison, annuitise-later, milestones, Sankey — after the above.
- Composition auto-optimisation — stays deferred.

---

_Compiled 17 Aug 2026 from a code audit (all claims file:line-verified at `679a8e3`) and
sourced market/rules research. PLSA figures and Budget-2025 NI cap should be re-verified
before hard-coding._

---

## Addendum (19 Aug 2026) — couples research & the Household view

Research verdict (sources in session log): every serious tool converges on "one household
plan, two tax-individuals" — per-person tax/pensions underneath, joint presentation on top.
Guiide (couples = "most requested feature") shipped exactly two-linked-individual-plans;
MoneyHelper has no partner input; only EvolveMyRetirement does mortality properly; no free
UK tool has a survivor check. UK independent taxation legitimises per-person ENGINES, not
per-person PRESENTATION: the walk-away moment is when a couple can't see "can WE retire?".
Two per-person plans + budget split (our model) is the documented MSE workaround — viable
but tolerated, not liked.

**Shipped: Household tab (v1)** — partner plan = another scenario in the account, picked and
persisted (scenario.household.partnerScenarioId). HouseholdService runs both plans on the
SAME Monte-Carlo market paths (different idiosyncratic seeds): joint success = P(both plans
survive), shown against each plan's own rate and the naive independence product (which
misstates joint risk). Plus a household wealth fan (pots+ISAs, today's money, p10/50/90)
and a deterministic income timeline (both SP steps, DB floors, other income, per-year draw
need, bridge years flagged). Individual plan views unchanged.

**Couples-ready remaining (in demand order):** time-varying budget split (a static % breaks
when income shifts between partners); survivor one-shot stress ("X dies in year N: one SP
gone, DB × survivor %, pots inherited, single budget") — cheap and unique among free UK
tools; cross-partner allowance-filling NUDGE (not auto-optimisation — illustration, not
advice).
