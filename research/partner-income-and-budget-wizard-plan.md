# Stage 1a — Partner income streams + guided Budget wizard (plan for sign-off)

Two sibling features in the net-first arc (see `budget-and-income-model-research.md`,
`user-flow-redesign.md`). Both are additive: no engine formula changes when the new inputs are
empty — golden master stays byte-identical.

The incoherence being fixed: the wizard and Budget tab are couple-aware (household, partner ages,
per-person spend lines) but the engines model one person — the partner's *income* exists nowhere.
Full two-pot couples simulation is deliberately **out** (later stage); this stage models the
partner as **time-phased net income** that reduces what the household must draw from the owner's
pots. Covers: partner still working → retires onto private pension → private + State Pension —
and every other combination — with one primitive.

## 1. The primitive: age-banded income streams

Same idea as the budget's age-banded expense lines and James Shack's income rows
(Start Age · End Age · Amount). Stored in `budgetTool.settings` (the established home for
household facts — `partnerAge`, `partnerRetirementAge`, `partnerRetired` already live there):

```
partnerIncome: [
  { id, label,                      // "Salary", "NHS pension", "State Pension"…
    type: 'salary'|'pension'|'statePension'|'other',
    amount, period: 'mo'|'yr',      // today's money
    gross: bool,                    // see tax treatment below
    fromAge, toAge|null,            // PARTNER's own age; null = for life
    inflationLinked: bool }         // true: full CPI; false: capped like 'other' income
]
```

- Ages are the **partner's own** ages (people think "she retires at 64, SP at 67"), converted to
  plan years via `planYear = fromAge − partnerAge` (partner's age today, already stored). Anchor
  on plan start — do **not** replicate the `new Date()` anchoring bug in
  `StressRepository.js:278` (`calculateSpConfigFromSettings`).
- The typical couple is 2–3 rows: salary `now → retirementAge` (auto-suggested from the wizard
  facts we already collect), private pension `retirementAge → life`, State Pension `SPage → life`.
  Already-retired, no-private-pension, part-time-later etc. are just different rows.

### Tax treatment — the one thing that must not be fudged

The exploration confirmed both engines funnel non-pot income into `fixedIncome`
(`DrawdownStrategy.js:37-81` via `SimulationEngine.js:634` and `legacyDecision.js:127`), and
`fixedIncome` is **taxed against the owner's bands** (`taxable = sippGross + fixedIncome`).
Partner income must NOT go there — it would wrongly consume the owner's PA/BRL headroom.

Instead: partner income is resolved to **net** in the partner's own hands, then subtracted from
the **household net need**. ("Spending is joint, income is per-person.")

- `type:'salary'` → entered **net** (take-home — the number people actually know; sidesteps NI).
- `type:'pension'|'statePension'` → entered **gross** (how they're quoted), taxed through the
  partner's own PA/basic/higher bands with the existing `TaxCalculator.grossToNet` — trivially
  cheap because streams are deterministic (no drawdown decision). All active gross streams in a
  year are taxed **together** (SP + private pension interact through the partner's PA).

New pure function in `BudgetModel.js` (unit-tested):
`partnerNetIncomeByYear(budget, taxBands, horizonYears) → number[]` — today's-money net £/yr per
plan year. Computed once at config-assembly time; the engines stay pure.

## 2. Engine insertion (minimal, guarded)

One new optional parameter end-to-end: a per-year **net offset**.

- **`planDrawdown(…, netOffset = 0)`** (`DrawdownStrategy.js`): after
  `targetNet = grossToNet(targetGross,…)`, apply `targetNet = max(0, targetNet − netOffset)` and
  re-derive the gross-side cap consistently (`sippToBrl` sizing must use the reduced need).
  `netOffset = 0` ⇒ byte-identical behaviour (golden master + cross-validation prove it).
- **Stress** (`SimulationEngine.js` `calculateMonthlyDraw`): config gains
  `partnerNetByYear[]` (today's money); per month:
  `offset = partnerNetByYear[year] × (inflationLinked handling below) `. Inflation: linked
  streams × `cumInf` (like SP); non-linked × `cappedInflation` (like `other`). Practical split:
  build TWO arrays at config time (`partnerNetLinkedByYear`, `partnerNetCappedByYear`) so the
  engine applies the right index to each without re-taxing. Wired in
  `createSimulationConfigFromSettings` (`StressRepository.js`), reading the budget blob.
- **Decision** (`legacyDecision.js`): same offset for the current tax year, resolved by calendar
  tax year (mirroring `getStatePensionForTaxYear`), subtracted from `targetNet` at the `:128`
  site. Per-tax-year `other` stays the owner's own non-pot income.
- **Survivor note** (future stage 3 hook): because partner income is a separate offset — not
  merged into owner tax — a survivor stress test is later just "zero the partner arrays from
  year N + switch budget to single basket". The design leaves that door open.

### Known engine debts adjacent to this work (fix or log, not silently extend)
- `spFirstYearRatio` uses the calendar-year remainder, not plan-year (`StressRepository.js:286`).
- Decision multi-year projection `generateDrawdownSchedule` ignores date-based SP entirely
  (`DrawdownService.js:447-450`).
- `applyBudgetToPlan` (`index.html:6275`) writes only Decision `baseSalary`; widen to offer
  Stress too, and make `summariseBudget`'s `suggestedGrossAnnual` net off partner income first
  (otherwise the suggested target double-counts).

## 3. Partner income UI

A "Partner's income" card in the Budget tab (only when `sharedWithPartner`), rows =
label · amount (£/mo|£/yr) · from-age → to-age · net/gross pill. Pre-seeded from wizard facts:
if partner not retired → a salary row `now→retirementAge` prompting for take-home; a State
Pension row prompting for the forecast (link: gov.uk "Check your State Pension"). Timeline strip
showing the phases ("working → pension → pension + SP") so the user *sees* the coverage story.

## 4. Guided Budget wizard (the "very very helpful" walkthrough)

Pure UI over the tested `BudgetModel` — no engine risk. Principles: one category per screen,
conversational, skippable/resumable, running total + PLSA tier position always pinned.

1. **Open-your-banking-app moment** — screen one instructs: "look at the last 2–3 months of
   statements; real numbers beat guesses." The honest answer to "look up your values".
2. **Arithmetic inputs** — every amount field accepts expressions (`11.99+8.99+5.99`, `4×52/12`),
   evaluated on blur. ~20 lines; the calculator lives where the answer goes.
3. **"Break it down" popover** — for composite lines (groceries, car running): named sub-items
   summed into the line; doubles as a forget-nothing checklist (fuel, insurance, MOT, servicing,
   tyres…).
4. **Tap-to-fill typicals** — upgrade ONS/PLSA hints to chips: "Typical couple: £380/mo — use
   this". Fixed UK values (TV licence, VED, water) pre-fill. Curated table in code; no live APIs.
5. **Wise suggestions, three flavours:**
   - omission-catching: surface `missingSuggestions` per-category during the flow, not at the end;
   - sanity nudges: entered value ≪ or ≫ typical range → gentle non-blocking flag;
   - retirement wisdom at the right moment: mortgage ends → age-band it; commuting disappears;
     holidays rise in go-go years; later-life care flag (PLSA excludes it — say so).
6. **Couple-aware** — per-person lines and couple typicals already exist; wizard asks who each
   personal line belongs to and pitches the couple benchmarks.

## 5. Build order & tests

1. `BudgetModel`: `partnerIncome` schema + `partnerNetIncomeByYear` (+ tests: each phase combo,
   gross taxation incl. SP+pension interaction, age→year conversion, horizon clipping).
2. `planDrawdown` netOffset param (+ tests: 0 ⇒ golden identical; offset reduces SIPP first;
   offset > need ⇒ zero draw, no negative).
3. Stress + Decision wiring (+ cross-validation case: partner SP == moving the same amount from
   `other` when bands make net==gross — sanity anchor).
4. Budget tab partner-income card + wizard pre-seed.
5. Guided budget wizard (independent track, can ship before or after 1–4).
6. Widen `applyBudgetToPlan` + net-off `suggestedGrossAnnual`.

## Open confirmations before coding
1. Partner salary entered **net**, partner pensions/SP entered **gross** (taxed via partner's own
   bands) — agree?
2. Streams live in `budgetTool.settings.partnerIncome` (household facts stay together) — agree?
3. Scope check: owner's own pre-SP extra incomes (e.g. owner DB pension with a start age) — leave
   `other` as-is for now, or generalise the same stream primitive to the owner in this stage?
4. Budget wizard: ship as a separate track alongside (recommended), or gate partner streams on it?
