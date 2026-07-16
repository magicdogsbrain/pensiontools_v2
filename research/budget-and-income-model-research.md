# Budgeting + net income model — research & architecture recommendation

Research for the "money in your pocket" change: replace the gross target-salary input with a
**net (take-home) monthly spending need**, driven by a budgeting tool, and set up for the roadmap
(GIA, property sale/downsizing, lumpy one-off expenses).

Sources: [PLSA/Pensions UK Retirement Living Standards](https://www.retirementlivingstandards.org.uk/details),
[RLS 2024 figures](https://www.retirementlivingstandards.org.uk/news/retirement-living-standards-2024),
[James Shack retirement tools](https://james-shack.co.uk/retirement-tools) &
[Budget Planner 2.0](https://james-shack.co.uk/budget-planner) (landing pages only — spreadsheet internals are
newsletter-gated, so the structure below is reconstructed from his public descriptions + PLSA + standard
cashflow-planning practice), and irregular-expense guidance
([Dungan & LeFevre](https://www.dunganattorney.com/blog/2019/04/irregular-expenses-to-remember-when-retirement-planning-part-1-of-2/),
[Hoxton PM](https://hoxtonpm.com/2026/05/retirement-cash-flow-planning-explained/)).

## What the reference tools do

- **James Shack**: a net **cashflow** model — lists all your pensions/investments, models against past market
  returns, supports **different retirement stages with different spending**, plus a separate **Budget Planner**
  that categorises monthly spend. Net/take-home framed, stage-based.
- **PLSA Retirement Living Standards** (the UK benchmark): three tiers — **Minimum £14.4k / Moderate £31.3k /
  Comfortable £43.1k** single (2024). Assumes home owned outright and **excludes care costs**. Its category
  basket is a ready-made expense taxonomy (below). The three tiers map cleanly onto an **essential vs
  comfortable** split and give us real benchmark numbers to show the user.

## Comprehensive expense taxonomy (the "research all the things" ask)

### A. Recurring — ESSENTIAL (the floor that must never fail)
- **Housing**: rent or mortgage (if any), ground rent / service charge, council tax, buildings & contents insurance
- **Utilities**: gas, electricity, water, broadband, mobile/landline
- **Food & household**: groceries, toiletries, cleaning, basic household goods
- **Transport (essential)**: car running costs (fuel, insurance, VED, MOT, routine servicing) *or* public transport
- **Health**: prescriptions, dental, optical, medical/dental insurance, ongoing medication
- **Personal essential**: basic clothing/footwear
- **Financial**: existing debt repayments, life insurance, funeral plan

### B. Recurring — DISCRETIONARY / LIFESTYLE (the "comfortable" top-up)
- Eating out, takeaways, alcohol
- Holidays & travel (annual)
- Hobbies, leisure, clubs & memberships, streaming/TV subscriptions
- Gifts, family support, charitable giving
- Grooming/beauty, non-essential clothing
- Pets

### C. Periodic / LUMPY (sinking-fund items — cost + frequency, or a target year)
- **Car replacement** (~every 7–10 years) ← user's explicit example
- **Home**: new roof, boiler, kitchen, bathroom, windows, big repairs, redecoration
- **Later-life home**: accessibility adaptations (stairlift, wet room)
- **Milestone trips**: once-in-a-while big holiday, anniversary
- **Family**: weddings, helping children (house deposits), grandchildren education
- **Technology refresh** (every few years)
- **Professional**: legal/will, financial advice, LPA

### D. Late-life / RISK (material, usually excluded — flag, don't silently omit)
- **Long-term / social care** (care home or at-home) — the biggest late-life tail risk; PLSA excludes it
- Acute health shocks

### E. One-off INFLOWS (income side — year-stamped events, roadmap)
- **Property sale / downsizing** lump sum ← user's explicit example
- Inheritance / gifts received
- Tax-free pension lump sum (25% PCLS)
- Endowment / policy maturities

## Income sources to draw in tax order (current + roadmap)
Current engine knows: **SIPP** (taxable), **ISA** (tax-free), **State Pension** (taxable, timed), **other/DB**
(taxable, fixed). Roadmap adds: **GIA** (CGT on gains + dividend tax — different treatment), **cash/savings**,
**part-time work**, and the one-off inflows in (E). The tax-efficient waterfall (fill from tax-free/allowance
first, then basic-rate SIPP, ISA top-up, GIA with CGT allowance…) is the heart of a cashflow engine.

## Retirement phases (ties to work already shipped)
James Shack's "stages" == the **spending smile we already built** (`SpendingModel`: level go-go years → ~1%/yr
slow-go decline → level no-go). So the budget's **comfortable** figure can ride the smile down while the
**essential** floor stays flat — and care-risk rises in the no-go years. Good continuity.

## Architecture: net-native vs keep-the-gross-engine

**Recommendation: go NET-NATIVE, built in safe stages.** Reasoning, driven by the stated roadmap:

The roadmap items — **GIA with its own tax**, **one-off inflows in a specific year** (downsizing), **lumpy
outflows in a specific year** (car, roof), **multiple pots drawn in a tax-efficient order**, and **phased
spending** — are *the definition of a year-by-year cashflow model*, and cashflow models are **net-first**:
each year you compute the household's **net spending need** (recurring smile + that year's lumpy items), then
**fill it from income sources in tax order, grossing up as required**.

- A single **gross "salary" target cannot express** any of: a lump-sum outflow in year 7, a lump-sum inflow in
  year 12, a GIA taxed on gains, or a floor-vs-comfortable distinction. Keeping the gross engine and bolting
  net on top works *only* for the narrow "just relabel the input as net take-home" case, and becomes a dead
  end the moment the roadmap starts — you'd rebuild it then.
- We are unusually well-placed to refactor: the **golden master + cross-validation** suites exist precisely to
  let us change the engine without silent drift, and we can **reuse the TaxCalculator, ISA top-up logic, and
  SpendingModel** wholesale. Net-native is a re-anchoring, not a from-scratch rewrite.

### Staged path (each stage independently shippable, engines protected)
- **Stage 0 — Budget tool (net-first, no engine change).** New Budget tab/wizard producing **essential** +
  **comfortable** monthly net figures and a list of **lumpy/one-off items** (cost + frequency/target year).
  Show PLSA benchmarks alongside. Interim: gross-up the recurring net to today's gross to feed the *existing*
  engine, while storing the richer data for Stage 1. Ships value immediately; golden master untouched.
- **Stage 1 — Net cashflow projection (new engine, alongside the old).** Per year: net need (smile-adjusted
  comfortable, floored at essential) + that year's lumpy items − fixed income (State/DB/other) → fill the gap
  SIPP→ISA in tax order via the existing TaxCalculator → net delivered / shortfall. Cross-validate vs the old
  engine on the no-lump-sum case.
- **Stage 2 — Pots & flows.** Add **GIA** (CGT) and **year-stamped one-off inflows** (downsizing, inheritance)
  and **outflows** (the lumpy items) as first-class events.
- **Stage 3 — Flip primary.** Make net the primary target/report everywhere; retire the gross-anchored path;
  wizards ask for spending need, not gross salary.

### Impact on the wizards (as the user noted)
Setup wizard + April tax-year wizard currently ask **gross salary** and suggest an inflation-adjusted gross.
Under net-native they ask/confirm the **net spending need** (defaulting from the Budget tool), inflate it, and
the engine grosses up. The **spending smile** already nets the decline off the April uplift — same mechanism,
just applied to the net figure. **Plan lock** still applies: the budget IS part of the plan definition.

## James Shack "Cashflow Plan 1.1" — actual structure (extracted from the .xlsx in repo root)

Three sheets: **Input Tab**, **One-Off Contributions/Withdrawals**, **Assumptions**. Everything entered in
**today's money**; the model applies inflation and uses **real returns**. It is **net/expenditure-driven**:
you state your spending need and the model draws from pots (taxing pension withdrawals) to meet it.

**Input Tab — per person (You, then a full duplicate for Your Partner):**
- Identity: *Age today*, *Retirement Target age*.
- **Liquid assets — 4 pots**, each row = *Current Value · Annual Contribution · Annual change in contribution
  (%) · Investment Risk (dropdown) · Real Return (looked up from risk band, net of fees & a wrapper-tax
  adjustment)*:
  1. **Pensions** 2. **ISAs** 3. **Other Investments (not property)** = GIA 4. **Cash**
- **Additional Retirement Income (Gross)** — each row = *Start Age · End Age · Annual Income (today's money)*:
  State Pension, Final Salary/DB, Part-Time Work, Rental (net of costs), + 2 custom.
- **Joint Retirement Expenditure** (shared, household) — each row = *Start Age · End Age · Annual amount*:
  e.g. *General Expenditure 55–75 £40k*, *General Expenditure (age reduction) 76–100 £30k*, *Holidays*, +
  customs. → **spending "phases" are just age-banded rows**, and the smile is done by a lower band later.

**One-Off Contributions/Withdrawals sheet:** a year-by-year grid (per pot, per person) where you drop **+ / −
lump sums in a specific year** — this is where **property sale/downsizing, a car, a new roof** go. Also shows
auto-grown regular contributions and year-end pot values.

**Assumptions sheet:** returns by **risk band** (Low→High, e.g. High = 6.99% nominal / **4.74% real**, sourced
from GBP 25-yr capital-market assumptions); **Cash** 1% / −1.25% real; **wrapper-tax adjustment** (Pension 0,
ISA 0, **Other/GIA −0.05%/yr to proxy CGT + dividend tax**, Cash 0); fees 0.5%/yr; **inflation 2.25%**; a fixed
**drawdown order** (Pension/ISA/Other/Cash, flagged "far from optimum"); full **UK tax bands + PA taper + 25%
tax-free cash**.

**What's worth stealing (not copying wholesale):**
1. **4-pot asset model** incl. GIA as "Other Investments" with a small return drag proxying CGT/dividend tax —
   simple, and matches our roadmap without a full CGT engine at first.
2. **Age-banded expenditure phases** as the expense primitive — one clean idea that covers essential-vs-
   comfortable, the spending smile, and time-limited costs (e.g. a mortgage that ends, help-to-kids for 5 yrs).
3. **One-off +/− per pot per year** for lump sums in/out (downsizing, car, roof).
4. **Real returns by risk band + inflation applied by the model** (we already do this).

## Couples (user: "cater for couples — but I have no idea on this")

James Shack's answer, and the right one: **model each partner's ASSETS, INCOME and RETIREMENT AGE separately,
but keep EXPENDITURE joint (household), and pool the drawdown across both.** Why separate matters:
- **Tax is individual** — a couple has **two Personal Allowances and two basic-rate bands**, so drawing to
  fill *both* people's basic-rate bands is a large, legitimate tax saving a single-person model literally
  cannot express. This is another strong argument for **net-native** (the cashflow engine grosses up each
  person's draw against their *own* bands).
- **State Pension / DB / retirement age are per person** (different ages, different entitlements).
- **Expenditure is shared** — one household spending need, met from either person's pots in a tax-efficient
  order, respecting each person's bands.

Design implication: put an **optional `partner` on the plan** (same asset/income shape as the primary), keep a
single **household expenditure** model, and have the net cashflow engine allocate withdrawals across both
people's pots to minimise total tax. We can **design the data model for couples now and build the two-person
drawdown later** — Stage 1 can ship single-person; couples is a Stage 2 extension of the same engine. The old
gross-salary engine can't represent couples at all, so this is decisive for net-native.

## Open decisions to confirm before building
1. Net-native staged (recommended) vs keep-gross-engine for now.
2. Two targets **essential + comfortable** (recommended — powers "survive on essential, aim for comfortable")
   vs a single net figure.
3. Placement: **new top-level Budget tab** (recommended) vs a step in the setup wizard vs a Decision sub-tab.
4. Show **PLSA benchmark** numbers as guidance in the wizard? (recommended — free credibility + a sanity check.)
