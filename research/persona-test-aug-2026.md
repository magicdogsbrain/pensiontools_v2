# Persona test session — bug log (26 Aug 2026)
Persona: "Sam", 55, plans to retire at 60. SIPP £450k, ISA £80k, salary £60k, pays £600/mo net (RAS), employer £400/mo.
Budget: PLSA 2024 comfortable single = £43,100/yr net → +20% = £51,720 net (~£4,310/mo).

## Open
- [B1] Decision Settings "Use ALL Stress settings" → SP start date blank afterwards; tax-year wizard said "0 years until state pension". (seen with Test plan A; verify)

## Fixed during session
- seededRng(0) fixed point; checksum key order; layered chart gilt band; unlock modal HTML; chip refresh; stale note position; decades chart title; sw cache stamp.
- [B2] Budget wizard "Comfortable" typical chips sum to ~£2,400/mo (£29k/yr) vs PLSA comfortable single £43,100 the tier claims to reflect. Even +20% lands at £34.7k. Chips under-cover (no housing? holidays low?). Review the typical amounts per tier.
- [B3] Income shape "Your age now" field shows 60 for a 55-year-old (it is the plan/retirement start age). Relabel "Income starts at age".
- [B4] Accumulation "Each £1 invested costs you 52p" = 600/1150, ignores the £150/mo higher-rate reclaim it mentions in the same sentence (should be ≈39p, or say "before reclaim").
- [B5] MAJOR: strategy engines assume the plan starts at age 57 (planFromSettings startAge default). Persona retires at 60: L&R "to age 72" (57+15), "State Pension only (from age 68)" (should be 67), Floor-to-age/gilt horizons all shifted. strategyPlanFor must pass settings.shapeAgeNow (retirement age).
- [B6] Floor & Flex essentials = £25,014 = 0.55 × target fallback; the budget's essential floor (£16,896 net ≈ £18k gross) was not carried into strategyParams.essentialsAnnual by the hand-off.
- [B7] Budget hand-off leaves Decision baseSalary 45,480 but Decision SP date/amount not seeded (check when opening Decision settings).
- [B8] Try-a-strategy: for P&V, ISA policy hold vs draw give identical numbers because target < BRL (minimiseEarlyTax never tops up). Not a bug but worth a note in the UI ("your ISA is never touched under this policy at this income").
- [B9] MAJOR: two targets in one plan. Decision settings baseSalary = £45,480 (budget hand-off) but the tax-year wizard took £40,000 from the Stress income steps; plan-of-record uses baseSalary (planned £3,790/mo) so "Plan vs actual" shows +£1,924 in year 0 against the app's own recommendation. One target (the income shape) should drive both; Decision settings should display it read-only or the wizard should say which it used.
- [B10] MAJOR: mid-year tax-year start (Sep, 7 months) spreads the ANNUAL target over the remaining months (£40,000/7 = £5,714/mo) and then taxes each month on 1/12 bands → £1,238/mo tax (40% band hit) vs the £784/mo (£5,486/yr) the year actually owes; projected annual tax shows £5,486 while "actual tax pace" shows £9,405/yr. Either draw the monthly need (£3,333) for the remaining months (income to date = 0 means unused PA — the tool could use it, but that's a choice to explain), or tax cumulatively. Net-in-pocket shown (£4,476) is wrong either way.
- [B11] Monthly Entry accepts negative fund values (cash −£37,683) silently; should refuse or warn.
- [B12] 27/28 & 28/29 arithmetic verified correct: £41,600 = 40,000×1.04; tax £484/mo = (41,600−12,570)×20%/12; £43,264 next year; net figures match.
- [B13] History "Year 0 (7 mo)" planned draw £3,790 = 45,480/12 — should be the schedule figure for that year (£40,000/12 = £3,333) — same root as B9.
- [B14] Floor & Flex year-0 wealth £727,920 > pot £660k. ladderPvAt() values unpaid rungs with floorDraw (gross essentials) while the floor COST nets off the State Pension; after SP starts the rung PV is overstated. Same helper used by floor-the-schedule/floor-to-age — check.
- [B15] Setting income steps programmatically without "Use it" leaves ssBaseSalary at the default (30,000) → Decision copy got 30k while the shape says 40k. Verify whether the UI step editor keeps baseSalary in sync with step 1; if not, that's the B9 root.
- [B16] MAJOR: Decision Tool monthly recommendation ignores the plan's strategy. Plan B (Floor & Flex, ISA hold) shows the F&F floor panel but the recommendation is identical to P&V (draw £5,714 from Cash, same tax). For F&F the essentials should come from the maturing rung and only treats from the sleeve; for a gilt ladder nothing should be "withdrawn from pots" at all.
- [B10 detail] engine: stdSipp = plan.sippGross / deliverMonths (annual target delivered over remaining months — deliberate design), and monthlyTax = (annualTax − tax(preStart)) / deliverMonths where annualTax seems to be computed on an annualised figure (tax 1,238×7 = 8,666 ⇒ taxable ≈ £53k, not £40k). Reproduce in a unit test: target 40k, Sep start, 7 months, income to date 0 → expect 5,486 total.
- [B17] Loop interruption: switching sub-tab while a calculation loop runs is my harness, not the app. Ignore.
- [B18] Gilt order sheet header says "(settlement —)" — settlement date blank.
- [B19] Mid-year handling differs between plans with the SAME Sep start: plans A/B drew the annual target over 7 months (£40,000/7), plan C drew the monthly need (£28,000/12) with the same 7-month wizard. Different code paths → find why (wizard confirmedSalary vs expectedMonthly?).
- [B20] Duplicate plan and delete use native prompt()/confirm() — blocks automation and is inconsistent with appConfirm elsewhere.
- [B21] History "Plan vs actual": plan C year 0 (7 mo) actual tax pace £1,290/yr vs £257/mo × 12 = £3,086 expected (planned £3,086). Pace formula wrong for partial years.
- [B22] MAJOR: Household check crashes ("monteCarloReturns is not a function") when either plan's strategy is not Pots & Valves — HouseholdService uses the P&V engine API on whatever engine the registry returns.
- [B23] Gilt-ladder plan in the Decision tool: "Cash low! Move £282,000 Bond→Equity" — P&V rebalancing advice on a plan that holds gilts to maturity (part of B16).
- [B25] MAJOR: strategy pot fields (stratSipp/stratSippFf/miniSipp…) are seeded only when EMPTY and are never cleared when another plan loads → plan B inherited Test plan A's £800,000 as sippTotal (F&F wealth £800k on a £660k plan). FIXED: cleared on applyStrategyToUI.

## Status after fix loop (26 Aug)
FIXED: B3, B4, B5 (startAge), B7, B10/B19 (monthly need + engine tax in panel), B11, B14 (rung horizon), B16 (overlay), B22, B23, B24 (SP offset via currentAge), B25, B2 (calibrated), B9 (draft-plan target sync), B13 (follows B9 for new saves), B21 (history stores engine tax; panel now shows the same figure).
OPEN: B6 (essentials into strategyParams on hand-off — verify), B8 (UI note), B15 (n/a), B18 (settlement dash), B20 (native prompt/confirm), B12 (verified OK).
