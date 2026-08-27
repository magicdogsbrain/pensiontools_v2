# Regression + mobile pass — 27 Aug 2026 (after strict CSP / inline-handler interpreter)

Flows replayed with real clicks on pensiontools.uk (admin@usefulish.uk), desktop then 390px harness.
Test plans created: **Regress Ray** (58→60, P&V, diversifiers, 9 months recorded Aug 26–Apr 27, locked) and
**Regress Pat2** (retired 62, now 64, income steps 34k/29k/24k, Full IL gilt via "Use this strategy",
then funds mode VWRP/VAGP, 1 month recorded). Delete when done.

## Bugs found and fixed (all deployed)
- R1 Mid-year start: engine netted pre-drawdown salary off the annual target (£897/mo instead of £2,397).
  Now the remaining months are planned on their own; prior income only consumes allowance/band.
- R2 Tax-year wizard preview taxed the draw as a clean full year (£270/mo vs £479). Same fix.
- R3 Silent "State Pension from age 72" default (statePensionYear 12) → 67 − income-start age; Stress
  tabs now show an amber "SP not entered — assuming £X from 67" note. Household uses the same default.
- R4 Household check aligned on calendar years: a still-working partner's plan starts `offset` years
  later (returns shifted), timeline shows "still working", bridge sentence uses the last bridge year.
- R5 Try-a-strategy pot prefill dropped the diversifiers sleeve (382,500 vs 450,000).
- R6 Next-step banner "Open Stress Tester settings" landed on Monte Carlo.
- R7 Decision result panel + typed fund values persisted across plan switch.
- R8 Income-shape "essentials/budget" reference lines leaked from the previous plan.
- R9 "+ Add custom ticker" ignored the typed search text.
- R10 Surplus text said "−0.8% above target" → below/above.
- R11 Plan-vs-actual partial first year compared planned tax (8 mo) with a 12× pace.
- Mobile: settings selects overflowed the viewport; decision result cards +8px; wide tables now scroll
  as one piece with a swipe hint; result charts keep 600px and scroll; strategy matrix = stacked
  labelled cards; budget rows and wizard rows one control line; Strategies overview computes one
  strategy per event-loop turn with a progress line (still blocks per strategy — see follow-ups).

## Open / follow-ups
- Heavy sync compute (Strategies overview, Household check, MC) freezes a phone for 10–60s. Real fix:
  Web Worker for stressTestStrategy / runHouseholdMonteCarlo.
- Setup wizard copy says "Welcome… create your first plan" for users who already have plans.
- Duplicate stays on the original plan (copy created but not activated); dialog says "starts as an
  editable draft" even when history is copied (copy-with-records locks).
- "Why this recommendation? Below min" leaks P&V wording under a contract-strategy overlay.
- Household year table is 6 columns on a phone (scrolls); could become cards like the matrix.
- B30 (budget chips can't reach PLSA comfortable) and B44 (scenario decade repeat) still open.

## 27 Aug PM — two new strategies (from the Gemini discussion)
- **Bridge & engine** (`bridge-and-engine`): cash years + one linker per year to the bridge age (default SP age),
  engine = rest in equities untouched; after the bridge total-return draws net of SP, no re-buy/trigger/ratchet.
  Engine: `bridgeTest` in stressTest.js on `configs.be` (compareRunner). Graphic: src/ui/bridgeEngineGraphic.js.
- **Buckets in order** (`buckets-in-order`): P&V engine with `config.sourcingMode='ordered'` →
  `planSourcingOrdered` (WithdrawalSourcing.js): equities pay while ≥ their absolute £ path
  (calculateGlidepath(equityStart)), sweep above band into cash up to target, else cash → defensive → equities;
  no glide rebalancing. Graphic: src/ui/bucketsGraphic.js. Decision tool honours it via StressRepository config
  (sourcingMode) — legacyDecision (the monthly advice) still uses planSourcing: FOLLOW-UP.
- Eight-way, "Chris compare" (SIPP £1.212M, ISA £60k held, 80/65/45/40 to 91, SP Aug 2037, level footing):
  P&V 45/35/20 24% ruin · Buckets 31% · L&R 16% (72 by contract) · Bridge 16% (66 by contract, engine median
  £993k at 66, typically fails by 84) · F&F 0% (bills to 91) · Floor the schedule 0% (89% of pot) ·
  Floor-to-67 17% cut · Full gilt £1.6k over the pot.

## Roadmap (pencilled 27 Aug 2026, from the TPAW comparison)
1. Valuation-adjusted futures: shift the bootstrapped equity/bond distributions to current CAPE and real yields
   (TPAW's approach), as a toggle with the raw-history run kept alongside.
2. "Amortise the pot" strategy (TPAW / amortisation-based variable withdrawal): spend what the pot can afford over
   the remaining horizon at the expected return, recomputed yearly; risk-aversion dial; spending tilt; floor/ceiling.
3. Lead every strategy page with the spending fan by age; pass-in-full second.
4. Floor the schedule to use the real order-sheet pricing (so it differs from the full gilt ladder only in the reserve rule).
