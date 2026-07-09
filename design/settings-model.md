# Settings Model — one schema, two instances

Grounded in a full field inventory of the current Decision / Stress / tax-year settings
(see the `settings-model-design` workflow). This is the UI-facing view of the same
`PlanContext` the engine unification is building (`engine-unification.md`).

## The decision (what we're building)

- **One settings *schema*** (same inputs, same names), used as **two independent
  instances**:
  - **Decision = the committed, locked plan** (edit-guarded; changing a plan parameter is
    a re-plan event).
  - **Stress = a sandbox** (freely editable what-ifs), **seeded from the Decision plan**
    ("Copy from Decision") so shared data is entered once, then diverges freely.
- **ISA is a real depleting pot** (a fund that can run dry) in *both* engines — this is
  what lets the Stress Tester answer *"does the SIPP hold up, with my ISA helping?"*.
- **One name per concept** (reconcile `protectionFactor` vs `protectionMult`, the two
  State-Pension formats, and the per-tax-year vs settings-level location of other-income
  and tax bands).

This resolves the apparent tension ("single settings for convenience" vs "lock Decision,
play on Stress"): you enter the shared base **once** in the Decision Tool; the Stress
Tester **inherits** it and you tweak the copy without touching the locked plan.

## Why — the split exists but has drifted

Today `decisionTool.settings` and `stressTool.settings` are already separate, but they are
**not the same inputs**: ISA lives only per-tax-year on the Decision side and is **absent**
in Stress; other-income and tax bands live per-tax-year for Decision but in settings for
Stress; State Pension exists in two formats; protection strength is stored in two
different units. The work is to **converge the shape and fill the gaps**, not to split
them apart.

## The unified schema — `PlanSettings`

`appliesTo`: **both** = shared, seeded; **decision-only** = committed-plan resolution
(the Decision instance carries `taxYears` overrides + history the sandbox doesn't need);
**stress-only** = sandbox/run knobs.

### Pots, glidepath & horizon
| Field | Type | appliesTo | Replaces / notes |
|---|---|---|---|
| `equityMin` | £ | both | year-0 equity floor + glidepath baseline (also seeds stress `equityStart`) |
| `bondMin` | £ | both | year-0 bond floor |
| `cashTarget` | £ | both | cash target (inflates, does not deplete) |
| `duration` | yrs | both | glidepath decay length (distinct from stress run-layer `years`) |

### Income & tax bands
| Field | Type | appliesTo | Replaces / notes |
|---|---|---|---|
| `baseSalary` | £/yr gross | both | target gross total income |
| `confirmedSalary` | £/yr\|null | decision-only | per-year wizard override of baseSalary |
| `other` | £/yr | both | other income. **Decision:** actual figure captured **per tax year** (the April wizard) — not auto-inflated. **Stress:** a base (seeded from Decision) that it **projects forward with CPI-capped inflation**. |
| `other_override` | £/yr | decision-only | optional per-year override; defaults to `other` |
| `pa` / `brl` / `hrl` | £ | both | tax-band **bases**, entered once (was stress-settings + decision per-year) |
| `bands_override` | {pa,brl,hrl} | decision-only | per-year resolved bands for the committed plan |
| `taxMode` | `inflates`\|`frozen` | both | inflate bands with CPI vs freeze (Decision gains this) |
| `cpi` | decimal | decision-only | per-year inflation chain; **canonical default 0.025** (kill the 0.04) |
| `grossIncomeToDate` | £ | decision-only | mid-year income already earned (reduces BRL headroom) |
| `isTaxEfficient` | bool | decision-only | per-year gate on using ISA to cap SIPP at BRL |

### State Pension  *(one canonical source)*
| Field | Type | appliesTo | Replaces / notes |
|---|---|---|---|
| `spStartDate` | date string | both | **single** SP source; each engine derives its own form (date-based for Decision, `spStartYear`+ratio for Stress). Add to defaults. |
| `spWeeklyAmount` | £/wk (today) | both | annual & `spStartYear` are **derived, never stored** (drop the annual display fields) |

Legacy `statePension`/`statePensionYear` kept **read-time fallback only** (never written).

### ISA — a depleting pot with a glidepath *(the key new modelling)*
| Field | Type | appliesTo | Replaces / notes |
|---|---|---|---|
| `isaBalance` | £ | both | **opening ISA pot** — a real depleting fund carried across months/years, seeded into Stress. Supersedes the per-year `isaSavingsAllocation` *budget*. |
| `isaContribution` | £/yr | both (per-year override on Decision) | **money paid INTO the ISA that year** — the tax-year wizard asks for it; grows the pot alongside returns. Settings-level annual base; Decision overrides per tax year. |
| `isaMin` | £ | both | **ISA glidepath baseline** — a declining target balance over the plan (like equity/bond mins) that guides how fast ISA is drawn. |
| `isaReturn` | decimal | both | growth = **money-market / cash rate** (modest, deliberately conservative — reuse the cash-return assumption). |
| `isaDrawdownStrategy` | enum | both | `maximiseLongevity` \| `minimiseEarlyTax` — how to spread a *scarce* ISA over time; **State-Pension-aware** (see mechanics). User-selectable in both tools. |
| `isaUsedToDate` | £ (derived) | decision-only | per-year cumulative ISA drawn (from history); reconciles against the pot. |

### Protection, reserve
| Field | Type | appliesTo | Replaces / notes |
|---|---|---|---|
| `protectionReductionPct` | 0–100 | both | **one unit**: percent (default 20). Stress derives `mult = 1 − pct/100`. Migrate `0.8 → 20`. |
| `recoveryBuffer` | £ | both | **canonical default 15000** (kill the 10000/15000/5000 disagreements); wire the sim's hardcoded buffers to it |
| `consecutiveLimit` | int | both | cash draws before protection (already identical; default 3) |
| `disableProtection` | bool | both | play toggle (Decision engine should finally honour it) |
| `hodlEnabled` / `hodlValue` | bool / £ | both | break-glass reserve (the plan carries one HODL policy) |

### Meta / transient (not part of the shared seed)
- **Decision-only meta:** `expectedMonthly` (wizard-precomputed, keep `.isa` consistent with the pot), `yearSetupComplete`.
- **Decision transient (entry form):** `entryMonth`, `entryEquity/Bond/Cash`, **new `entryIsa`** (prefilled from `isaBalance`) — per-month what-ifs, not persisted.
- **Stress-only provenance:** `seededFrom`, `seededAt`, `decisionChecksum` (drift banner).
- **Stress run overrides (transient):** `equityStart/bondStart/cashStart/isaStart/years` — per-run knobs over the stress instance; `isaStart` defaults to `isaBalance`; `years` overrides the loop horizon only (glidepath `duration` stays from settings).

## ISA as a depleting pot — mechanics

- **Balance over time:** the ISA pot evolves as
  `balance ← balance + contribution + growth − draw`, carried across periods and seeded
  once into Stress. It sits alongside equity/bond/cash in the pot state.
  - **Contributions** (`isaContribution`): money paid *in* each year (per-tax-year on
    Decision, an annual assumption on Stress) — so the pot can be built up in early/
    semi-retirement years as well as drawn down.
  - **Growth** (`isaReturn`): the **money-market / cash rate** (modest; reuse the cash
    assumption). Stress adds a `monthly(r)` line mirroring the HODL block; Decision applies
    the same rate deterministically.
  - **Glidepath** (`isaMin`): a declining target balance over the plan (like the equity/
    bond minimums) that the drawdown aims to track — the default "how much ISA to still be
    holding at year N", which the strategy below modulates.
- **Stress uses ISA — the BRL cap alone is wrong.** Today the Stress Tester draws SIPP to
  BRL and stops (no ISA, no tax). That understates the real plan. Both engines now: draw
  taxable SIPP up to the BRL cap, compute the **net** shortfall to target, then draw ISA
  tax-free to fill it. ISA draws never enter taxable income (added straight to net), as
  Decision does today.
- **Run-dry (the point of "does the SIPP hold up?"):** when `isaBalance` hits 0 the
  tax-free top-up stops; the engine draws more **taxable** SIPP above BRL — recomputing
  higher tax and a lower net (Stress must compute **real tax** here, wiring the currently-
  dead `hrl`) — or registers shortfall. **A run must not "succeed" on phantom ISA**: Stress
  folds ISA depletion into its failure semantics; Decision warns (like "Cash low!") and
  recomputes tax.

### ISA drawdown strategy (State-Pension-aware)

When the ISA is small relative to the plan, *how* to spend it matters — so it's a
user-selectable choice in both tools:

- **`maximiseLongevity`** — spread the ISA thinly (track/stay above the `isaMin`
  glidepath) so it lasts as long as possible, cushioning SIPP draws across more years.
- **`minimiseEarlyTax`** — spend the ISA aggressively in the **high-tax-pressure early
  years**, keeping SIPP at/under BRL and avoiding 40% tax, accepting the ISA depletes
  sooner.

Both are **State-Pension-aware**: the income the SIPP+ISA must cover is largest *before*
State Pension starts and smaller after (SP fills part of the gap, though it also consumes
BRL headroom). So the strategy sizes ISA draws against the **per-year net gap**, which
already reflects when SP kicks in. Example: ISA that only covers ~10 years of the full gap
in a 35-year plan is concentrated into the pre-SP years, where it offsets the most tax /
the biggest gap, because SP "takes up the slack" later. (The exact allocation algorithm is
part of the `DrawdownStrategy` work; both modes reduce to the same per-period draw once the
target profile is set.)

## Two instances — seed, drift, re-sync

- **Structure:** `scenario.plan.decision.{settings, taxYears, history}` (committed) and
  `scenario.plan.stress.settings` (sandbox).
- **Seed ("Copy from Decision"):** deep-clone the Decision settings into Stress; stamp
  `seededFrom/seededAt/decisionChecksum`. The two are then **independent copies** — no live
  binding — so Stress diverges freely.
- **Drift:** on load, re-hash the Decision settings vs `decisionChecksum`; if changed, show
  a *"Decision changed since you seeded"* banner offering re-sync.
- **Re-sync (two modes):** overwrite-all (full reseed) or pull-unchanged-only (reseed only
  fields the user hasn't deliberately changed in Stress, via per-field dirty flags).

## Lock vs play (role-parameterised UI)

One `lockOrPlay` table on the schema; the **instance role** decides how it's honoured.
- **Lock** (plan parameters — pots, glidepath, duration, salary, other, bands, SP, cpi,
  `isaBalance`, `isaReturn`, recoveryBuffer, consecutiveLimit): edit-guarded in Decision
  (change = re-plan), freely editable in Stress.
- **Play** (`taxMode`, `protectionReductionPct`, `disableProtection`, HODL, `isaStrategy`,
  run overrides): free in Stress; pinned/hidden in Decision.
- **UI rule:** render from `(role, lockOrPlay)` — one form, role-parameterised, replacing
  today's asymmetric split.

## Migration (from today's split)

- Restructure `decisionTool`/`stressTool` → `plan.decision`/`plan.stress`; seed stress.
- Protection `protectionMult 0.8 → protectionReductionPct 20`; force `recoveryBuffer 15000`.
- Promote `spStartDate`/`spWeeklyAmount` to canonical (add to defaults); dedupe; keep
  legacy SP fields as read-only fallback.
- Seed settings `other` and `pa/brl/hrl` from the latest per-year values; keep per-year as
  overrides. Collapse CPI defaults to 0.025.
- **ISA:** there is **no opening balance to migrate** (`isaSavingsAllocation` was a budget,
  `TaxYear.isaBalance` was always 0) → **prompt for opening `isaBalance`**. Convert
  `isaSavingsAllocation → isaDrawCap`, `isaSavingsUsed → isaUsedToDate` (recomputed).
- Drop dead fields (`settings.startDate`, the annual SP display fields). Run the existing
  `migrateStressDB` renames first.
- **Engine unification caveat:** the live `legacyDecision.js` is the reference; the parallel
  `DecisionService`/`DrawdownService` path must consume the same `PlanContext` or be
  retired — ISA-as-pot in only one path would re-introduce divergence.

## Future placeholders (leave room, don't build now)

- `pcls: { taken, amount }` and `ufpls: { enabled, schedule }` → the tax-lever work
  (`PensionAccess` primitives already built).
- `adHocWithdrawals: []` → one-off/lump-sum withdrawals (capital-expenditure roadmap item).
- `assetComposition` / `property` → the bucket-composition / asset-class registry.
- `isaContributions` → accumulation-phase ISA (out of scope; this design is decumulation
  with a fixed opening balance).

## Decisions made (user, 2026-07)

- **Opening ISA balance:** one-time prompt on first load of the new model; thereafter the
  pot is built/reduced by per-year `isaContribution` + growth − draws (no inference).
- **ISA growth:** the **money-market / cash rate** (modest, conservative); grows in both
  the deterministic Decision projection and Stress.
- **Other income:** captured **per tax year** on the Decision Tool (the April wizard, as
  an actual figure — not auto-inflated); the Stress Tester projects a base forward with a
  **CPI-capped inflation rate**. (This is the correct pattern, not a divergence to remove —
  same as tax bands: Decision holds actuals, Stress projects from a base. So this is close
  to today's behaviour, not a change to committed-plan numbers.)
- **Stress uses ISA:** the BRL-cap-only draw is wrong; Stress models SIPP→BRL then ISA, and
  computes **real tax** (wiring `hrl`) once ISA is exhausted.
- **ISA glidepath** (`isaMin`) in both tools; **ISA drawdown strategy** (`maximiseLongevity`
  vs `minimiseEarlyTax`, SP-aware) is user-selectable in both.
- **Per-year ISA contribution** captured by the tax-year wizard.
- **Drawdown algorithm = Option A ("tax-efficient / band management") by default**, with
  Option B ("maximise ISA longevity") as an optional toggle. **IHT-driven ordering is NOT
  modelled** (the April 2027 change bringing pensions into the estate makes the old
  "preserve the pension" logic moot — one fewer thing to build). See below.

### Drawdown algorithm (research-informed)

Grounded in a multi-source review of UK best practice and tools (Vanguard VCMM, abrdn,
CashCalc, Fidelity/RBC bridge worked-examples; see the deep-research report). The
universal core is **annual tax-band management**, which the Decision Tool *already*
implements (draw SIPP up to BRL — filling the personal allowance + basic-rate band — then
top income up with tax-free ISA, never crossing 40%). It is **State-Pension-aware by
construction**: once SP arrives it fills the band, shrinking the SIPP-to-BRL room, so ISA
naturally covers more of the gap ("SP takes over").

- **Option A — tax-efficient / band management (default, `minimiseEarlyTax`).** SIPP→BRL,
  ISA tops up to the net target (tax-free), **depleting the pot as needed**. When the ISA
  pot is exhausted, hold income at target by drawing SIPP **above BRL** and paying the tax
  ("use the ISA until we can't"). This matches every surveyed tool/adviser.
- **Option B — maximise ISA longevity (toggle, `maximiseLongevity`).** Cap the yearly ISA
  draw so the pot lasts — level it across the pre-SP **bridge years** (biggest gap) or
  follow the `isaMin` glidepath — accepting some 40% tax earlier.

The one refinement the research adds: the personal allowance is use-it-or-lose-it, so in
the pre-SP bridge years the tool should ensure the SIPP draw fills it (it does, via
SIPP→BRL). No IHT ordering.

## Still open

1. **`isaContribution` meaning** — confirm it's money paid *into* the ISA that year (builds
   the pot), *not* a per-year cap on ISA spend. (Assumed the former.)
2. **`isaMin` glidepath shape** — deplete to £0 at `duration` like equity/bond, or to a
   floor? And precedence when it conflicts with the drawdown strategy.
3. **taxMode vs per-year bands** — when Decision has `bands_override` *and*
   `taxMode='inflates'`, which wins?
4. **Stress per-year semantics** — with "always SIPP→BRL then ISA", Stress likely doesn't
   need `isTaxEfficient`; confirm it can drop per-year tax rows entirely.
5. **Re-sync granularity** — per-field dirty-tracking, or full-reseed-with-confirm?

_Last updated 2026-07. Feeds `engine-unification.md` (this schema = one `PlanContext`
instance per tool)._
