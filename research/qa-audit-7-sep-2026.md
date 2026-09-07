# QA audit — Stress Tester and Decision tool, 7 September 2026 (v6.1.0)

Driven through the real app (dev server, signed in as the admin test account) with a browser
harness: ten persona plans created, every Stress Tester tab and strategy page run on each, the
couples checks, the allocation optimiser, own-funds mode, then a 26-month walk through the
Decision tool on one plan (three tax years, protection and tax-boost cycles, a taxable account,
quarterly batching, an entry deletion, an unlock). Console errors were captured throughout:
**none** — every finding below is a wrong number, a stale state, a hang or a copy problem, not a
crash. All QA plans were deleted afterwards.

## Personas run

| Plan | Combination | Result |
|---|---|---|
| P1 | £600k balanced, ISA £100k Option A, SP 2035, 30y, Pots & Valves; later own-funds mode (6 tagged holdings incl. gold, money market, ISA-wrapped) + optimiser | clean |
| P2 | UFPLS 5y + PCLS to ISA, band-fill recycle, declining spend, longevity ISA, Buckets in order | B4, G3 |
| P3 | ISA on hold, £200k gilt GIA, bed-and-ISA (greyed), recycle warning, £150k house-sale windfall yr10 (shares), £30k car yr2, Full IL gilt | B7 |
| P4 | 3 income steps, DB £12k from yr8, part-time £10k yrs0–4, diversifiers, bond tent, Ladder & Ratchet | G1 (diversifiers doubled), B7 |
| P6 | £100k pot, £40k/yr, 5 years, HODL, no SP, Floor to an age | G4, C3 |
| P7 | £1.3M, 45y, frozen bands, £400k share GIA higher-rate, earnings, recycle, cuts off, inherited pension + ISA yr6, Bridge & engine | B7, B10 |
| P8a/b | couple: P&V + Floor the schedule (hold ISA), household / survivor / care checks | PERF2, C4 |
| P9 | £1M Gilt ladder + rotation, inherited pension yr12 | B1, B7 |

## Findings

### Bugs (wrong numbers or broken state)
- **B2 — Drawdown/Glidepath tabs corrupt the plan's horizon.** `showDrawdownScheduleUI` and
  `showGlidepathUI` (index.html ~12035/12073) assign their own duration box onto the shared cached
  settings object. After visiting either tab, the Strategies comparison, Try-a-strategy, Household and
  the next Save all run that horizon. Reproduced: a 30-year plan compared as 35 years. The two boxes
  are also not pre-filled from the plan. Fix: `{ ...settings, duration }`; pre-fill from the plan.
- **B4 — Pots & Valves row equals Buckets in order when the saved strategy is Buckets.**
  `createSimulationConfigFromSettings` puts `sourcingMode:'ordered'` into cfg for a Buckets plan
  (StressRepository.js:331) and the P&V strategy runs `p.pnvCfg` as-is. P2's table: both 94% / 1.67
  / £466,757. Fix: the P&V strategy forces `sourcingMode`/`bucketBand` off (Buckets already forces on).
- **B7 — "Worst 12 months" for bought strategies ignores income the lump / DB pension pays.**
  stressTest.js:271 uses `lr.minDraw` (minimum of the BOUGHT schedule). A windfall, an inherited
  pension or a DB floor zeroes or reduces the bought amount for those years, so Floor the schedule shows
  100% paid in full with "£0" (P3, P7, P9) or "£28,000" on a £40k-minimum plan (P4). Use total income
  (bought + other income incl. the lump's use), as the P&V path does (stressTest.js:185-191).
- **B1 — "chance of a cut after undefined".** index.html:8947 reads `signature.floorToAge` for every
  strategy with a ruin label; Gilt ladder + rotation carries `rotateCutAge`. Fix: `floorToAge ?? rotateCutAge`.
- **B6 — Historical tab spinner never stops on contract strategies.** `runStrategyWindowsUI`
  appends its result under the loading block it inserted (`target.innerHTML = (target.innerHTML||'') + html`)
  for any target other than `strategyRunResults`. Seen on every non-P&V plan.
- **B11 — a stalled Firestore write shows "Saving…" forever.** The April 2027 tax-year wizard's final
  write sat for minutes with the button disabled and no toast; a direct write to another document
  succeeded meanwhile; it flushed later on its own. There is no timeout, retry or error path around
  `saveScenario` / `saveDecisionDB` / `finishWizard`. Not reproducible on demand (did not recur on the
  April 2028 wizard) — treat as a robustness gap.
- **B10 — stale strategy card after a plan switch.** `#strategyRunResults` keeps the previous plan's
  card until Run is pressed (P6's Floor-to-an-age card under P7). The switch handler clears `mcResults` only.
- **B12 — deleting a history entry trips the duplicate guard.** After Delete on Jul 2028 a toast said
  "May 2028 already has a saved decision. Delete it from the History tab first to recalculate." (the
  month still typed in the entry form). Observed once; cause not traced.

### Gotchas (behaves as coded, hurts users)
- **G1 — risk-preset mode silently rewrites saved fund minimums.** In "Pick a risk level" the form snaps
  the saved split to the NEAREST preset on load (`nearestPresetKey`, ~7729) and Save persists it: every
  persona's split changed on first save (300/250/50 → 300/240/60; 400/200/100 → 350/280/70; P4's £60k
  diversifiers became £123k). Any plan seeded from the Decision tool, or with hand-set minimums, is
  altered the moment Stress Settings is saved. Needs a "Custom" preset (keep the saved split) or a
  visible "snapped to Balanced" notice with a keep-my-split action.
- **G2 — "age today" is invisible.** Stress settings take `currentAge` from the Budget (default 45 if
  the Budget was never set up) with no field on the form; with retirement at 62 the SP date of 2035 read
  as already in payment. Show it, or flag when it is the default.
- **G3 — Buckets in order + spending cuts on.** Protection entry needs "growth below minimum AND N
  consecutive cash draws"; ordered sourcing always draws cash first, so the streak is always satisfied and
  cuts hinge on growth < minimum alone. P2: 83% of futures cut; Lost Decade scenario 394 of 396 months in
  protection. Review whether the streak test should apply to ordered sourcing at all.
- **G4 — no State Pension entered = £12,000 from year 0.** With the date blank the engine falls back to
  the legacy `statePension: 12000` default at `defaultSpYear` (year 0 for a 70-year-old). The stress tabs
  warn; the comparison copy says "State Pension only (from age 70)" as if entered.
- **Design note** — with a £32k GROSS target under the BRL, Option A never touches a £100k ISA and the
  monthly "Total Monthly Income" (£2,492) sits below target/12 (£2,667); the Drawdown table shows the same.
  A new user reads it as under-payment. Say so on the panel ("target is gross; ISA is not needed below the BRL").

### Performance (main-thread freezes)
- **PERF1** Try-a-strategy with Pots & Valves on a 35-year plan: > 60 s synchronous, no progress text.
- **PERF2** Household survivor check (500 futures) and care check: each > 45 s synchronous.
- Scenarios tab and the allocation optimiser also run long on the main thread (optimiser 75 s) but yield.

### Cosmetic
- C1 "£0.00" beside whole-pound figures (Drawdown table, Scenarios "Final: £0.00").
- C3 Floor-to-an-age copy on an unaffordable plan: "0% paid in full … No simulated future ran out".
- C4 Survivor "inheriting about £924,615 (median remaining pots)" on a £660k start — confirm today's money.
- C5 Allocation line "56% shares" (pot + ISA) beside the fund summary's "Shares 65%" (SIPP) in own-funds mode.
- C6 "Withdraw From" reads "GrowthBond" / "CashFund" / "GrowthEquity" (words concatenated).
- C7 Calculation reason "Protection | Protection".
- Unaffordable strategies vanish from the ranked table without a line saying which and why (P6: 6 of 9; P7: 7 of 9).

### Verified working (no change needed)
Settings round-trip for every field on every persona (UFPLS/PCLS/recycle, hold ISA with greyed
bed-and-ISA and the recycle warning, GIA + mix + band, windfalls with wrapper and "held as", extra
incomes/withdrawals, DB, steps, diversifiers, tent, HODL, frozen bands, blank SP); MC / Historical /
Scenarios / Drawdown / Glidepath on P&V, Buckets, all seven bought strategies; the nine-strategy overview
with correct horizons when B2 is not triggered; own-funds mode; the optimiser; couples, survivor and care
checks; Decision tool: settings save, 7-step and 6-step wizards, CPI-uplifted targets, protection entry
after three cash draws with growth below minimum, tax-boost catch-up to year end, GIA fields persisted and
pre-filled, bed-and-ISA advice on the first entry of a tax year, CGT exemption from the wizard, quarterly
batch save, entry delete, History month strip, Plan vs actual, unlock → edit → re-lock → "23 entries
recorded under previous settings". Not tested: CSV export / print (downloads need your permission), the
Accumulation tab, the fund-suggestion queue.

## Status — shipped as v6.2.0 (7 Sep 2026)

Fixed and tested: B1, B2, B4, B6, B7, B10, B11 (20 s timeout + one retry + error toast), G1 (Custom
keeps the saved split; a typed Pot rescales it), G2 (age-today note under the State Pension inputs),
G4 (assumption flagged on the plan, the P&V card and the ranked table), PERF1/PERF2 (worker), C1, C7.
Tests: `tests/qaFixes.test.js`; decision golden regenerated for the reason text only.
G3 fixed in v6.2.1: Buckets in order judges the whole SIPP against the whole glidepath track (dead band of one recovery buffer on entry, same on exit; months-below-track persistence), in both engines. Not changed: B12 (observed once, not
traced), C3/C4/C5 (copy), C6 (was a text-scrape artefact — the panel shows "Growth" and "Bond: £…" on
separate lines; not a bug). The unaffordable-strategies line already existed under the table.

## Plan — v6.2.0 "Trustworthy comparisons" (as planned before the fixes)

Ship as one minor release (pops up once): every item changes numbers users see or removes a stall.

1. **Fix B2** (clone settings; pre-fill dd/gp duration from the plan) — test: visiting Glidepath does not
   change `getStressSettingsAsync().duration`; overview `durationYears` equals the plan's.
2. **Fix B4** (P&V strategy forces `sourcingMode: undefined, bucketBand: undefined`) — test: a Buckets
   plan's P&V row differs from its Buckets row.
3. **Fix B7** (worst-12 for bought strategies = min over years of bought + other income, incl. windfall
   use) — test: P3/P7 shapes give the target, P4 gives £40,000.
4. **Fix B1** (`floorToAge ?? rotateCutAge`) — test: no "undefined" in the overview HTML for a rotation plan.
5. **Fix B6** (replace, don't append; or remove the loading block first) — test: no `.spinner` left in
   `histResults` after a contract-strategy run.
6. **G1** — add a "Custom (keep my split)" state to the risk picker: on load, if the saved split is not
   within 1% of a preset, select Custom and show the saved amounts; Save keeps them. Test: the eight
   persona splits round-trip byte-identical.
7. **B11** — wrap `saveScenario` in a 20 s timeout with one retry and an error toast; the wizard's
   Confirm re-enables with "try again" on failure. Test: a mocked hanging `updateDoc` surfaces the toast.
8. **B10 / B12** — plan switch clears `#strategyRunResults`; delete-entry does not re-submit the form.
9. **G4** — comparison copy and the ranked table say "no State Pension entered — assuming £12,000 from
   age N" (same warning as the stress tabs), or drop the legacy default in favour of £0 + warning.
10. **G2** — show "Age today (from your Budget): 45" on Stress Settings with a link to change it, and a
    warning when it is the untouched default.
11. **PERF1/PERF2** — run Try-a-strategy, survivor and care through the engine worker with the same
    progress text the overview uses.
12. **G3** — decide the rule for ordered sourcing (protection on growth<min only, or off by default for
    Buckets) and write it on the Buckets page.
13. Cosmetics C1–C7 and the "not shown: N strategies unaffordable" line under the ranked table.
14. Release note: effects per tool (Stress: ranked-table figures move for plans with lump sums, DB
    pensions, Buckets, or that visited Glidepath; Decision: none) and the actions (re-run the overview;
    check your allocation if you saved Stress Settings since August).

Ordering: 1–5 first (numbers), then 6–7 (data safety), then the rest.
