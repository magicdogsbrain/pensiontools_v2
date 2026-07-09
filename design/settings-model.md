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
| `other` | £/yr | both | **consolidated** other income (was stress-flat + decision per-year) |
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

### ISA — a depleting pot *(the key new modelling)*
| Field | Type | appliesTo | Replaces / notes |
|---|---|---|---|
| `isaBalance` | £ | both | **the "ISA amount"** — a real pot carried across months/years, seeded into Stress. Supersedes the per-year `isaSavingsAllocation` *budget*. |
| `isaReturn` | decimal (opt) | both | growth applied to the pot each period (new assumption in `constants.js`) |
| `isaStrategy` | enum | both | draw order vs SIPP; default `fillNetGapAfterSippToBRL` (today's behaviour); `isaFirst` for what-ifs |
| `isaDrawCap` | £/yr\|null | decision-only | optional annual spend ceiling (so year-1 doesn't drain the pot); was `isaSavingsAllocation` |
| `isaUsedToDate` | £ (derived) | decision-only | per-year cumulative ISA drawn (from history); reconciles against the pot |

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

- **Balance:** `isaBalance` sits alongside equity/bond/cash in the pot state, carried
  across periods and seeded once into Stress.
- **Growth:** `isaReturn` grows it each period (Stress adds a `monthly(r)` line mirroring
  the HODL block; Decision applies a deterministic assumption).
- **Draw order (`fillNetGapAfterSippToBRL`, default = today's behaviour):** each period
  draw taxable SIPP up to the BRL cap, compute the **net** shortfall to target, then draw
  `ISA = min(netGap, isaDrawCap-remaining, isaBalance)` to fill it tax-free. Clamp to the
  balance so the pot can hit exactly zero.
- **Tax-free:** ISA draws never enter taxable income / PA / BRL / HRL — added straight to
  net (as Decision does today), distinct from taxable SIPP and the not-yet-modelled
  UFPLS/PCLS levers.
- **Run-dry (the point):** when `isaBalance` hits 0 the tax-free top-up stops; the engine
  then draws more **taxable** SIPP (recomputing higher tax / lower net) or registers
  shortfall. **A run must not "succeed" on phantom ISA** — Stress folds ISA depletion into
  its failure semantics; Decision warns (like "Cash low!") and recomputes tax.

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

## Open questions (need a decision before/while building)

1. **Opening ISA balance** has nothing to migrate from — prompt every user, default 0 with
   a warning, or infer from unused allocations?
2. **ISA growth** — what `isaReturn` (and stress vol)? Same as equity, a blend, or a user
   input? Does ISA grow in the deterministic Decision projection or only in Stress?
3. **other-income inflation** — Decision applies it flat; Stress CPI-inflates capped 4%.
   Which becomes canonical? (This moves committed-plan numbers.)
4. **taxMode vs per-year bands** precedence — when Decision has `bands_override` *and*
   `taxMode='inflates'`, which wins?
5. **Does Stress need `isTaxEfficient` / per-year semantics**, or is "always SIPP-to-BRL
   then ISA" enough for a fair comparison?
6. **hrl in the sim** — do we finally compute real tax in the stress loop (so ISA-run-dry
   is accurate), or keep the BRL-cap approximation?
7. **Re-sync granularity** — per-field dirty-tracking, or is full-reseed-with-confirm
   enough for a sandbox?

_Last updated 2026-07. Feeds `engine-unification.md` (this schema = one `PlanContext`
instance per tool)._
