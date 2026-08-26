# Persona 2 — "Pat", 64, retired at 62 (2 years in), SIPP £320k, ISA £40k, SP 6 Apr 2029 £230.25/wk, wants £42k → failing plan
- Budget Moderate ×1.1 + one-offs (car 18k/9y from 66, redecorating 4k/7y, roof 7k @70, white goods 2k/10y) → £32,608 net → gross-up £37,618 ✓ (my calc (32,608−2,514)/0.8 = 37,618).
- MC on 42k/36k/32k steps: 2% success, typical failure year 18 of 31 ✓ plausible (11.7% initial draw).
- Try sweep: P&V 98.7% ruin (cuts off) both ISA policies; L&R base ladder £399k > pot; F&F 0% (floor to 92 affordable, treats tiny); FtS £595k; FtA(80) £416k; gilt unaffordable.

## Bugs
- [B26] Already-retired plan: the budget hand-off seeded the first income step at age 62 (the age they RETIRED) although Pat is 64 today; for a retired person year 0 = now, so the shape should start at the current age. (shapeAgeNow from budget.retirementAge; should use max(retirementAge, currentAge)).
- Decision loop (bear market −3%/mo × 8): protection fires Nov 2026 (draw £2,100 = 2,333×0.9, first-phase 10% cut, then 20% after PROTECTION_ESCALATE_MONTHS) ✓ by design; ISA untouched under minimiseEarlyTax with target < BRL ✓; SP not yet.
- [B27] Monthly tax while in protection assumes the REMAINING months revert to the standard draw: 26/27 monthly figures 108,108,101,94,87,80,74 sum £652 vs the year's true tax £519 ((7 draws = £15,166 − PA) × 20%); 27/28 shows £272/mo vs £227 if protection persists. History "tax paid" therefore overstates in protection years. Use YTD actuals + this month, project remaining at the CURRENT draw (or show a range).
- Pages: one startup_failure (GitHub infra) re-run; the "cancelled" runs are superseded builds from rapid pushes — noise, not failures.
- Protection deepens to ×0.8 after 12 months (Nov 2027: £1,941 = 2,427×0.8) ✓; draws switch to Bond once cash is gone ✓; year uplifts 28,000→29,120→30,285 ✓.
- [B28] While in protection (income cut 10–20%) the £42k ISA sits idle: minimiseEarlyTax never touches it below the BRL and the rescue only fires at outright SIPP shortfall. A struggling retiree should at least be told "the cut is £X/mo; your ISA could cover it for N years" (or a policy option "ISA bridges protection cuts").
- History: 24 entries, 22 flagged protection ✓; Plan vs actual year 0 avg £2,167 ✓ (2×2,333 + 5×2,100)/7; year 1 £2,083 ✓ (7×2,184 + 5×1,941)/12.
- [B29] Plan-of-record year 2 planned draw £1,725/mo = (30,285 − 0.74 × 12,950 SP)/12: the SP (6 Apr 2029) is counted in plan year 2 because spStartYear = floor(2.6 calendar years from today). The Decision tool's years are TAX years (year 2 = 28/29; Apr 2029 is in 29/30 = year 3), so the plan of record starts the SP a year early. Stress (calendar-year model from today) is fine; DrawdownService/plan-of-record should map the SP date to its tax-year index.
- [B27 detail] year-0 "actual tax pace" £1,119/yr vs true ≈ £890 (519 × 12/7).

## Fixed (26 Aug, persona 2 loop)
B26 retiree income-start age; B27 protection-year tax projection; B28 ISA-bridge advice; B29 Decision-side SP by tax year (plan of record year 2 now £2,524); B20 native prompt() → appPrompt (rename/duplicate/admin/tax year) — verified duplicate modal + "Settings only" copy appears as draft.
Verified: unlock → edit → save → re-lock on Pat's plan; plan vs actual recomputed.

# Persona 3 — "Jo", 58, just retired, SIPP £900k, ISA £250k (drawn), DB £8k from 65, downsizing £100k→ISA at 70, kitchen £30k at 62, steps 60/50/45 @58/70/80, Ladder & Ratchet 12y calendar, first-stage 6 months
- Budget Comfortable ×1.0 + one-offs → £38,139 net → £44,531 gross ✓ ((38,139−2,514)/0.8).
- [B30] Even with EVERY "Comfortable — use" chip pressed the wizard lands at ~£36.7k base vs PLSA £43.1k: the wizard's category screens don't offer chips for every TYPICAL_TIERS line (rent, car purchase, …), so the calibrated sum isn't reachable from the walk-through alone. Show the running PLSA gap on the review screen ("£6k under the Comfortable standard — usually holidays/car").
- L&R: 12 rungs £609,629 ✓ (≈ 60k×7 + 52k×2 + 40k×3 discounted); wealth y0 £1.15m ✓; 17.4% MC ruin plausible.
- [B31] Income cone/"worst 12 months" for ladder & floor strategies omits DB/other income: year 7 shows £52k where £60k arrives (52k rung + 8k DB). The layered chart adds it back, the cone doesn't. Add otherIncomeByYear to the income series in every strategy's enrich().
- Jo Decision Sep 2026 verified: SIPP £4,189 = BRL/12 ✓; ISA top-up £487 = (net 60k 48,568 − SIPP net 42,730)/12 ✓; tax £479 = (7×4,189 − PA)×20%/7 ✓; annual ISA allocation 3,406 = 7×487 ✓; L&R overlay "rung pays £4,189" ✓; first-stage months 6 copied to Decision ✓.
- [B32] FIXED: "Tax Saved" compared a full-year inefficient tax (£11,432) with the 7-month actual → £673/mo; now same-basis (≈ £162/mo in a 7-month year, £324 in a full year).
- [B33] (harness, not app) "slow saves" were Chrome throttling timers in a background tab. REAL bug found in the console instead: `lockPlanIfNeeded is not defined` in DecisionService.saveDecision — the import never landed, so a first monthly ENTRY never auto-locked (tax-year setup still did). FIXED + test.
- Jo 27/28 verified: target 62,400 (×1.04) → tax 7,540 + 0.4×12,130 = 12,392 → net 50,008 → £4,167/mo ✓; SIPP £4,189 (BRL frozen) ✓; ISA top-up £607 ✓; tax £628/mo ✓; tax saved £404/mo = 4,852/12 ✓; ISA allocation 7,278 = 12×607 ✓; L&R overlay "rung pays £4,189" every month ✓.
- Jo 28/29 verified: target 64,896 → net 51,506 → £4,292/mo ✓; ISA £731 ✓; saved £488 = 5,850/12 ✓. History: 24 entries, 0 protection ✓, year-0 actual = planned ✓.
- [B34] FIXED: plan of record used taxMode 'inflates' (BRL × CPI) while the Decision tool draws to the wizard's FROZEN BRL → planned £4,357/£4,531 vs actual £4,189. Plan of record now defaults to frozen bands.
