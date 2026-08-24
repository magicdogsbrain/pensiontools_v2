# Pensiontools — strategy engine, income profiles, triggers, and three named strategies
## Implementation brief for a Claude Code session — v4 (supersedes v3)

---

## 0. How to work on this

1. **Explore the repo first.** Locate the simulation engine, the existing pot/valve drawdown logic, the stress tester, the tax-wrapper layer, plan storage, and the UI framework. Follow existing conventions — this brief is stack-agnostic.
2. **Understand before touching.** Phase A produces a written + visual distillation of the *current* strategy and stops for user review.
3. **The current strategy must keep working inside the whole app.** Regression is proven with integration-level golden tests through the same code paths the tools use, not unit tests alone.
4. Work the phases in order (§9). Each phase leaves the app shippable. Stop points are marked.
5. Reference implementations and golden numbers are in Appendices A/B — port semantics exactly.
6. Ask the user before architectural decisions not covered here.

## 1. Product vision and architecture

Four orthogonal components, deliberately separated so any strategy composes with any profile, any trigger and any wrapper policy:

1. **Income profiles** (engine-level, §4a) — the shape of spending over time: `phases` (go-go / go-slow / no-go) or `taper` (the existing 1%-a-year reduction). Every strategy consumes the same profile object.
2. **Trigger component** (shared, §4b) — when and how equity surplus is converted into linker rungs: `band` (continuous, fires at a **configurable** percentage above the glide path) or `calendar` (fixed review dates). Used by both ladder strategies; Pots & Valves has its own valves and does not use it.
3. **Wrapper & funding policy** (engine-level, §4f) — which account (SIPP, ISA, GIA, cash) funds each year's income. **User-directed, never forced**: tax-optimal ordering is a suggestion the tool can display, not a rule it imposes. Deliberately tax-inefficient configurations — such as preserving an ISA in risky assets for years to maximise tax-free compounding — are first-class plans, not warnings.
4. **Strategies** (§4c–e) — how income is funded. Three ship:

| Internal id | Name | Promise line | Honest failure line |
|---|---|---|---|
| `pots-and-valves` | **Pots & Valves** | "One flexible portfolio. Rules decide which pot pays you this month." | "A long bad run can drain the pots faster than they refill." |
| `ladder-and-ratchet` | **Ladder & Ratchet** | "Your full income bolted to the calendar. Growth ratchets more years on." | "If markets never boom, the growth pot arrives small at the far end." |
| `floor-and-flex` | **Floor & Flex** | "The bills are paid to a chosen age by contract. Everything else flexes with the market." | "Treats shrink in long bad markets — and the floor is only as right as your essentials number." |

Every plan **locks exactly one strategy** with its profile and trigger settings. The stress tester compares any subset of strategies **on identical simulated paths and the identical income profile**. A visual explainer set (Phase E) teaches all three with the same house style: sentence case, plain British English, both the promise and the failure line always shown, jargon only behind an "under the bonnet" disclosure. Secured/contractual money is always drawn as solid filled shapes; market money as outlined/translucent.

## 2. Phase A — distill the current strategy (STOP for review after)

Unchanged from v3: read the code, produce `docs/strategies/pots-and-valves.md` (≤300 words plain spec including the existing taper option exactly as coded), parameter inventory, a Mermaid flow of one simulated month, the 4-panel storyboard ("Your money sits in pots, each with a floor." / "Each month, the pot that can best afford it pays you." / "In bad markets, the safe pots take over." / "In good markets, the pots refill and floors are restored."), and an explicit list of any coded behaviour that contradicts the user's mental model. **STOP.**

## 3. Phase B — abstraction across the whole app (STOP after)

- Strategy interface: `Strategy.init(state, params)` / `Strategy.step(t, marketState) → {trades, cashflow}` / `Strategy.describe()`.
- Existing logic becomes `PotsAndValves` behind the interface; a **strategy registry** supplies every tool. No tool reaches around the interface.
- **Income profiles and the trigger component are engine-level modules**, injected into strategies — not private strategy code.
- Plan schema: `plan.strategy = { id, params, lockedAt, engineVersion }`, `plan.incomeProfile`, `plan.trigger`, `plan.externalFlows`, plus `plan.wrappers` (the accounts, their holdings and which strategy components run in each) and `plan.fundingPolicy` (§4f) — named income and expense streams beyond the strategy itself (state pension, DB pensions, rental, one-offs, recurring costs). The engine nets them for simulation, but they are **stored and reported as separate named layers, never netted in output** (§6). Migrate existing plans to `pots-and-valves`, `lockedAt` = migration time.
- Lock semantics: locked plans pin parameters and engine version; never silently re-simulated; changing strategy = explicit unlock with warning or clone to a new plan; comparisons spawn shadow runs only.
- Regression: golden matrix through the app's real entry points, byte/number-identical pre/post refactor. **STOP.**

## 4. Phase C — the components and the two ladder strategies

### 4a. Income profiles (engine-level)

A profile is the **target income in today's money per plan-year**, with the state-pension offset applied as the engine already does.

- **`phases`** (new, default): go-go at the full amount for `gogo_years` (default 10, configurable); go-slow from `goslow_age` at `goslow_amount` (£ or % of go-go); optional no-go from `nogo_age` at `nogo_amount`. Boundaries as ages or plan-years. UI: phase editor, presets ("classic 10-year go-go"), stepped income preview.
- **`taper`** (existing, preserved): reductions of `taper_rate` (default 1%/yr real) from `taper_start` (default year 5) to `taper_floor_age`.
- Interactions: Ladder & Ratchet sizes every rung — initial and trigger-bought — to `P(k)` for the year it funds, so a no-go rung is smaller and cheaper. Floor & Flex may apply a profile to the **floor itself** (essentials can step down in no-go). Pots & Valves simply draws the profile. The user's live plan (£60k for 10 years, then £36.5k + state pension to 80) must be expressible with no workarounds — this is an acceptance criterion.

### 4b. Trigger component (shared)

Converts equity-sleeve surplus into forward linker rungs. Configuration:

- `mode: band` (default) — evaluated **every month**: fires whenever sleeve value ≥ `band_threshold × G(t)`, where `G(t) = E0×(1+g)^t` and **`band_threshold` is fully configurable** (default 1.2; any value > 1). Action: skim down to `skim_target` (default the path; configurable as `path × s`). Geometry: a skim from `b×G` to `G` sells at most `1 − 1/b` of the sleeve (≈17% at 1.2), so the band itself enforces keep-most-invested; expose the implied max-sale figure in the UI as the user changes `b`.
- `mode: calendar` — reviews at fixed dates; cadence `every_n_years` (default 5), `annual`, or `monthly`; skim policy `to_path` or `max_rungs_per_review = N`.
- Both modes: whole rungs only, sequential years, each rung priced `P(k)×(1+y)^-(k−t)`, stop at the horizon cap. Optional `triggers_continue_in_decumulation` (default false; goldens produced without it). What a trigger **buys** is strategy-defined: extension years for Ladder & Ratchet; floor raises or horizon extensions for Floor & Flex (§4e).
- **Surplus destination** — `surplus_use: lock (default) | spend | ask`. `lock` buys rungs as above. `spend` adds the skimmed surplus to that year's income instead; the sleeve still resets to the skim target, so the glide-path mechanics are identical either way. `ask` is interactive-only (Monitor mode); simulations treat it as `lock`. **Every trigger event reports the counterfactual both ways** — "this skim = 2 locked years, or £X of spending this year" — whichever destination is configured.
- **`spendable_surplus(t)`** is a first-class engine output series in every mode: `max(0, sleeve − G(t))`, emitted continuously, not only at triggers. This is the anti-underspending instrument — the number the UI's "safe to spend" line draws (UX brief §3.3) — and it exists whether or not the user ever acts on it.
- Monitoring note for the eventual Monitor mode: band mode implies a monthly check or an alert (sleeve vs `b×G` line); the tool should draw both lines and offer an email alert at crossing.

### 4c. Ladder & Ratchet (C1)

As Appendix A: real-terms simulation; rungs are certain real cashflows held to maturity, sized to the profile; flat real yield `y` (default 2.3%) for pricing; tax-year-aligned mode (rung matures on or before a configurable income date, default 6 April; missing years covered by doubled second slices with a parked-cash real rate, default 0%); linker universe from the bundled snapshot with gap years derived from data. Decumulation: secured rungs pay their years; thereafter the sleeve pays the profile monthly; sleeve ≤ 0 is failure at that age; the never-triggered branch is reported separately. Golden sets A and B (Appendix B) must pass, including cadence generalisation and band geometry.

### 4d. Pots & Valves

Unchanged behaviour behind the new interface; consumes profiles; does not use the trigger component.

### 4e. Floor & Flex (C2) — full specification

Funds **essentials by contract and discretionary by market**, generalising the design to any user.

- **Floor**: a linker ladder paying the essentials amount (profile-capable) from year 1 to `floor_horizon_age` (default 92; offer 95/100), with the state-pension offset. "Lifelong" is offered honestly: linkers run out around 2073, longevity past the horizon is not insurable with gilts, so the UI says "to age N by contract" and Phase G adds the optional late-life annuity swap as the true lifelong tail. Tax-year alignment, gap doubling, and pricing exactly as 4c.
- **Flex sleeve**: the remainder in equities, paying discretionary income by rule: `sleeve_rate` (default 4%) of the sleeve value, reset each plan-year, paid monthly; optional collars `flex_min` / `flex_max` in £. Percentage-of-pot cannot deplete the sleeve; the honest risk is lean years, so lean-year metrics are first-class outputs (§6).
- **Optional ratchet**: `floor_ratchet` (default **off**, matching the pure design). When on, the trigger component (band or calendar) runs on the sleeve and a firing buys **floor raises** (uplifting future floor rungs toward a target, cheapest-first) or **horizon extensions** past `floor_horizon_age` — user chooses which the ratchet feeds.
- **Sensitivity surfaced in the UI**: at current yields every £1k/yr of essentials ≈ £24k of floor cost (compute live from the curve); show it beside the essentials input, and prompt the user to derive essentials from 12 months of actual spending.
- Storyboard (4 panels, ≤12 words each): "The bills are bought up front, to an age you choose." / "A second pot pays for everything fun." / "Good years, bigger treats. Bad years, smaller ones." / "The bills never notice either way."

### 4f. Wrappers and funding order (engine-level)

A plan can span several wrappers — SIPP, ISA, GIA, cash — and strategy components are **scoped per wrapper**: the reference case is a SIPP holding the ladder and the equity sleeve while a separate ISA sits 100% in risky assets and is deliberately left untouched to maximise tax-free compounding. That case must be expressible with no workarounds; it is an acceptance criterion alongside the phases profile.

- **Funding policy**: an ordered, per-plan rule set stating which wrapper funds each year's income, with per-wrapper hold rules ("preserve ISA until age X / until value ≥ £Y / until manually released"). The engine's tax-optimal ordering runs only as an **advisor**: it may compute and display, once per configuration, the estimated £ cost or benefit of the chosen policy against its own suggestion — informational, shown a single time, never nagged, never auto-applied.
- **Annual decision node**: at the start of each tax year (6 April) the engine exposes a decision point per wrapper — take, skip or resize that wrapper's withdrawals for the year, with ISA deferral the canonical example. In **simulation** the node is driven by the plan's rules and every decision is logged in the run output; in **Monitor mode** it is a real once-a-year prompt. A deferred wrapper's contribution is backfilled from the next wrapper in the funding order, and the tax consequences flow through the existing wrapper layer.
- **Reporting**: per-wrapper balances and withdrawals appear as named layers in the layered spending chart (§6), so a preserved ISA is visible growing untouched alongside the income the other wrappers are paying.

## 5. Parameters and defaults

| Parameter | Default | Notes |
|---|---|---|
| Income profile | phases: go-go 10 yrs | taper selectable; amounts per profile |
| Trigger mode | band | calendar (5-yearly / annual / monthly) selectable |
| `band_threshold` | 1.2 | **configurable, any value > 1**; implied max sale shown |
| `skim_target` | path | configurable path × s |
| `surplus_use` | lock | spend / ask; counterfactual always reported |
| External flows | per plan | DB pensions, rental, one-offs; layered in output |
| Glide-path rate `g` | 5%/yr real | 4% / 6% presets |
| Real yield `y` | 2.3% flat | slider; stochastic in Phase G |
| L&R ladder end | chosen age (e.g. 80) | |
| F&F `floor_horizon_age` | 92 | 95 / 100 offered |
| F&F `sleeve_rate` | 4% of sleeve, annual reset | optional £ collars |
| F&F `floor_ratchet` | off | on → raises or extensions |
| Equity fund OCF | ~0.1% | |
| Funding policy | user-defined order | tax-optimal shown as advice only, once |
| Wrapper hold rules | ISA: preserve | until age / value / manual release; 6-April decision node |

## 6. Outputs and metrics

- Trigger statistics: % never selling; sell-event counts (band) or per-date rates (calendar); histogram of extra years secured (L&R signature — bimodal under 5-yearly calendar, mass shifts to fully-secured under band).
- Sleeve at ladder end / horizon: median, p10, worst; never-triggered subset separately.
- Survival to horizon per branch; depletion ages for failures.
- **Floor & Flex lean-year metrics**: worst-year discretionary per path (median / p10 / min), share of all path-years below a user threshold (default £10k), terminal sleeve distribution. Essentials survival is 100% by construction and the UI should say so.
- Same-seed, same-profile N-way comparison: P(ruin), income-secured-to-age, worst 12-month income, median and p10 terminal wealth.
- **Layered total-spending view** (first-class, all strategies): every income source is a named layer — ladder rungs, state pension, DB and other external flows, cash bridge, equity/flex draw, and spent surpluses — stacked to a single total-spending line. Flows the user entered separately are never netted away in reporting, even where they cancel by design; seeing the whole stack is the point.
- **`spendable_surplus` series** charted against the glide path in every run, with per-trigger counterfactuals ("locked 2 years / could have spent £X") in the single-path inspector.
- Per-wrapper layers in the spending chart and balance history; the funding-policy £ delta vs the tax-optimal suggestion, computed and shown once per configuration; the log of 6-April wrapper decisions per simulated path.
- Order sheet at t=0 and at each simulated trigger (single-path inspector): rung year, gilt(s) with gap bracketing, face to buy, estimated cost — live feed when present, else bundled snapshot.

## 7. Acceptance tests — Appendices B (numerical) and D (methodology)

## 8. Phase E — choose & lock UX

Learn → Compare → Lock, now across three strategies: one screen each (name, promise line, 4-panel storyboard, "when it shines", the failure line with one concrete example, under-the-bonnet parameters), the N-way compare pre-run on the user's own inputs, then explicit lock writing `plan.strategy` per Phase B semantics.

## 9. Phase order and stop points

A (distill, **stop**) → B (abstraction + profiles + trigger module + integration regression + the Appendix D harness skeleton, **stop**) → C1 (Ladder & Ratchet, both trigger modes, golden sets A+B) → C2 (Floor & Flex, golden set C) → D (N-way compare in the stress tester) → E (choose & lock UX, **stop for design review**) → F (live linker data feed, unchanged from v3 / Appendix C) → G (extensions: stochastic real yields, spending-flex overlays, `triggers_continue_in_decumulation`, transaction costs, late-life annuity swap for Floor & Flex).

---

## Appendix A — reference implementation

All amounts real. Config A/B constants reproduce the golden runs; the production port generalises `DRAW` to the profile `P(k)`.

```python
import numpy as np

def real_tr_index(df):                     # df: monthly P, D, CPI (Shiller)
    cpiL = df["CPI"].iloc[-1]
    rp = (df["P"] * cpiL / df["CPI"]).values
    rd = (df["D"] * cpiL / df["CPI"]).values
    rtr = np.ones(len(rp))
    for i in range(1, len(rp)):
        rtr[i] = rtr[i-1] * (rp[i] + rd[i]/12) / rp[i-1]
    return rtr

# Config A: DRAW=48500, E0=600000, L=180, HMAX=38, END=456, calendar (60,120,180), RY=.023, GP=.05
# Config B: DRAW=27500 post-ladder, E0=183500, L=276, rungs 24..35, END=420, band b=1.2, monthly
# Config C: floor 35000 yrs 1-10 then 22500 yrs 11-35 at RY -> cost 647426; sleeve E0=552574,
#           sleeve_rate=0.04 annual reset, END=420, no ratchet

def stage1_band(rtr, s, E0, DRAW, L, first_rung, HMAX, b=1.2, RY=0.023, GP=0.05):
    V, nxt, sec, sells = E0, first_rung, 0, 0
    for t in range(1, L+1):
        V *= rtr[s+t] / rtr[s+t-1]
        G = E0 * (1+GP) ** (t/12)
        if V >= b*G and nxt <= HMAX:
            ex = V - G; bought = 0
            while nxt <= HMAX:
                c = DRAW * (1+RY) ** -(nxt - t/12)
                if ex >= c: ex -= c; V -= c; sec += 1; nxt += 1; bought += 1
                else: break
            if bought: sells += 1
    return V, sec, sells

def stage1_calendar(rtr, s, E0, DRAW, reviews, first_rung, HMAX, RY=0.023, GP=0.05):
    V, last, nxt, sec = E0, 0, first_rung, 0
    for t in reviews:
        V *= rtr[s+t] / rtr[s+last]; last = t
        G = E0 * (1+GP) ** (t/12)
        if V > G:
            ex = V - G
            while nxt <= HMAX:
                c = DRAW * (1+RY) ** -(nxt - t/12)
                if ex >= c: ex -= c; V -= c; sec += 1; nxt += 1
                else: break
    return V, sec, last

def stage2(rtr, s, V, L, ladder_years, sec, DRAW, END):
    dstart = (ladder_years + sec) * 12
    for m in range(L, END):
        V *= rtr[s+m+1] / rtr[s+m]
        if m >= dstart:
            V -= DRAW / 12
            if V <= 0: return False, 57 + m/12, 0.0
    return True, None, V

def floor_and_flex(rtr, s, E0, rate=0.04, END=420):
    V, d, path_min = E0, rate*E0, rate*E0
    for m in range(END):
        V *= rtr[s+m+1] / rtr[s+m]
        V -= d/12
        if (m+1) % 12 == 0:
            d = rate * V; path_min = min(path_min, d)
    return V, path_min          # terminal sleeve, worst-year discretionary
```

## Appendix B — acceptance tests

Unit: rung pricing; glide-path values; skim loop (sequential, whole rungs, cap); tax-year alignment and second slices; profile-sized rungs; calendar-cadence generalisation; band geometry (sale fraction ≤ 1 − 1/b for arbitrary b); sleeve-rate annual reset; floor-raise purchase logic (cheapest-first); `surplus_use = spend` conserves the accounting identity and leaves the sleeve exactly at the skim target; external flows appear as layers in output and never alter strategy mechanics; the funding policy is always obeyed over the tax-optimal suggestion, and 6-April deferral nodes fire exactly once per tax year with deferred amounts backfilled per the policy. Golden sets pin `surplus_use = lock` and a single-wrapper (SIPP-only) configuration.

**Golden set A** — calendar, DRAW £48.5k, L 15y, E0 £600k, reviews yr {5,10,15}, cap yr 38, horizon 95 (n≈1,650 / 1,373 windows; tolerances ±2pp, ±3%): triggers ≈ 59/52/48%, never ≈ 20%; secured 0 yrs ≈ 22%, 8+ ≈ 59%, median ≈ 10; equity at 15y median ≈ £1,204k, p10 ≈ £661k, worst ≈ £434k; no-review median ≈ £1,623k; two-stage survival 100% both branches; vintages 1929-09/1966-01/2000-01 never trigger (≈ £556k/£558k/£815k), 2008-06 secures ≈12, 1985-01 to cap; forward 10y after sub-1.2× 15y ≈ 11%/yr vs ≈ 6.5%.

**Golden set B** — band vs calendar, E0 £183.5k, ladder 23y, DRAW £27.5k, rungs 24–35, horizon 92, b 1.2: band never sells ≈ 11%, sell events median 4 max 6, fully secured ≈ 58%, sleeve at 80 median ≈ £505k worst ≈ £142k, survival 100%, terminal median ≈ £906k; calendar {5,10,15,20}: never ≈ 16%, fully secured ≈ 48%, sleeve at 80 median ≈ £569k, terminal median ≈ £1,002k. 23y untouched hold: median ≈ 4.19×, p10 ≈ 2.12×, worst ≈ 1.26×.

**Golden set C** — Floor & Flex, floor £35k yrs 1–10 then £22.5k yrs 11–35 (state-pension offset) at flat 2.3% → cost ≈ £647k; sleeve E0 ≈ £553k, rate 4% annual reset, horizon 92, no ratchet (n≈1,409): year-1 discretionary ≈ £22.1k; worst-year discretionary per path median ≈ £16.5k, p10 ≈ £9.9k, min ≈ £5.1k; share of all path-years under £10k ≈ 0.5%; terminal sleeve median ≈ £1,264k, p10 ≈ £675k, min ≈ £391k; essentials survival 100% by construction.

Integration (Phase B): golden matrix through real entry points, identical pre/post refactor.

## Appendix C — linker universe and live data feed

Unchanged from v3: DMO gilts-in-issue for the universe (including old-style 8-month-lag stocks such as the 4⅛% IL 2030); Tradeweb end-of-day clean+dirty prices (or fit from the BoE real spot curve); nightly job → `linkers.json` { generated_at, gilts: [{isin, name, coupon, maturity, lag, clean, dirty, real_yield}] }; staleness banner >48h; bundled snapshot fallback; manual CSV import; never scrape retail sites; gap years derived from data, and under tax-year alignment computed by the alignment logic, never hard-coded.

## Appendix D — testing methodology: verification and validation

The harness is built **alongside** the engines (its skeleton lands in Phase B), never after them. Two halves, named separately because they fail differently: verification asks whether the code does what this brief says; validation asks whether the model says anything true about the world.

### D1. Verification

1. **Dual implementation, kept alive.** The reference Python in Appendix A is an independent implementation of the strategies. It lives in the repo, runs in CI, and the production engine is cross-checked against it **path by path** (not just summary statistics) to a stated numerical tolerance, across a config grid covering every trigger mode, profile type, and strategy. Two separately written implementations agreeing on ~1,400 historical paths is the strongest single check available; treat any divergence as a defect in one of them until proven otherwise.
2. **Property-based tests** on the pure components — generate random configs and assert invariants, not examples:
   - a band sale never exceeds `1 − 1/b` of the sleeve, for any `b > 1`;
   - skims buy whole rungs, sequentially, and never spend more than the excess above the skim target;
   - in tax-year-aligned mode every funded year has a maturity on or before the income date;
   - linear scaling: doubling all £ inputs exactly doubles all £ outputs;
   - a trigger never reduces survival on any individual path (one-way rules cannot hurt the bad branch).
3. **Metamorphic tests** — no ground truth exists for novel strategies, so test transformations with known consequences:
   - `band_threshold → ∞` reproduces the never-trigger branch exactly;
   - a deterministic return path of exactly `g` never triggers and lands on the closed-form terminal value;
   - a phases profile with all stages equal matches the flat-income run to the penny;
   - `sleeve_rate` percentage draws can never deplete the sleeve;
   - reordering strategies in a comparison run changes nothing (common random numbers actually common).
4. **Accounting identity, asserted every simulated month**: sleeve value + cumulative rung purchases + cumulative income paid = seed + cumulative returns, to tolerance. Conservation violations are how simulator bugs announce themselves; make the assertion cheap and always-on in test builds.
5. **Golden snapshots of the full per-path output vector** (hashed), not just medians — summary statistics can agree while paths quietly diverge. Golden regeneration is an explicit commit with a written justification; CI fails on silent drift. Golden sets A, B, C (Appendix B) are the numerical anchors.

### D2. Validation

1. **Data ingest checks.** Shiller series: pinned row counts, no missing months, CPI strictly positive, spot values checksummed. Linkers feed: schema-validated; bounds on real yields (reject a feed with a 15% or −8% real yield); dirty ≥ clean × (a sane index-ratio floor); maturities within the known universe range.
2. **Reproduce published results from this engine.** It must recover the classic 4%-rule success rates on 30-year US windows, the documented worst 15-year vintages (windows ending 1920 and the early 1980s), and — on the pricing side — a rung priced by the engine for a real gilt on a real date must match a broker quote to within the bid/offer spread.
3. **Sensitivity tornados** across every parameter: outputs must move in the right direction, smoothly, with no unexplained cliffs; publish the tornado in the docs so reviewers can eyeball it.
4. **Monte Carlo convergence**: results stable as path count grows; confidence half-widths computed and **displayed**, not hidden; fixed seeds for reproducibility, seed-sweep for stability.
5. **Assumption register**, in the repo and versioned: US-only history (~10 independent 15-year draws), flat future real yields, RPI = CPIH from 2030, no fees/platform costs/dealing spreads, no tax inside the wrapper, spending exactly on profile. Every line is tied either to a Phase G work item or to a caveat the UI actually displays. The final failure mode is not wrong code — it is a correct engine presented with more confidence than the model deserves, and the register is the guard against it.
