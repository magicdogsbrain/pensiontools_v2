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
