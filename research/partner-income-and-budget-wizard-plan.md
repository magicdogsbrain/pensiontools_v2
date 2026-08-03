# Couples model + guided Budget wizard (plan for sign-off) — v2

**v2 supersedes v1 of this doc.** v1 designed "partner income streams" (partner's salary/pension/SP
as time-phased net income offsetting the household draw). Rejected after product review: it models
income for a person who isn't the user, and dragged in partner tax treatment. The chosen model is
simpler and mostly already shipped.

## The couples decision (settled)

**Each person models their own plan; the budget splits the household.**

- Research: IFA tools (Voyant, CashCalc, Timeline) model the full household — both partners,
  individually taxed, joint expenses, survivor analysis — because an adviser has a paid hour to
  gather two people's finances. Wrong benchmark for self-serve; James Shack's household spreadsheet
  needs both people's full data up front for the same reason.
- This app's unit is **one person**: the engines simulate the owner's pots against the owner's
  **share** of household spending. A couple = two accounts/plans, one shared budget logic. No joint
  tax optimisation (deliberately dropped — the "500x" swamp), no partner income modelling at all.
- Already shipped in Stage 0 (`BudgetModel.js`): `paidBy: 'me'|'partner'|'shared'` per line,
  `mySharePct` (global) for shared lines, `myShareFactor` / `myAnnualNetAtAge`, and
  `suggestedGrossAnnual` already feeds **the owner's share** to the target handoff.

### Remaining work (small)
1. **Partner's share summary.** Budget review shows: "Household £X/mo → your share £Y · partner's
   share £Z" (`Z = household − myShare`, per tier). Plus a line inviting the partner to create
   their own plan using £Z as *their* target. This is the whole "what will it cost your partner"
   deliverable.
2. **Per-line share override.** Today one global `mySharePct` applies to every `shared` line. Add
   optional per-line `mySharePct` (default = global). One-line change in `myShareFactor` + a small
   % control on shared lines. Tests: per-line overrides, mixed budgets.
3. **Honest caveat in the UI** (copy, not code): the plan doesn't verify the partner can fund
   their share; a survivor scenario (expenses don't halve when one income stops) is future work —
   the one thing the IFA household model genuinely does better. Candidate future stress preset.
4. Wizard copy: when "me + a partner" is chosen, explain the model in one sentence ("you'll plan
   your own money against your share of the joint budget — your partner can do the same").

### Explicitly rejected / deferred
- Partner income streams & partner tax (v1 of this doc) — not needed under the per-person model.
- Two-pot joint drawdown & joint tax optimisation — deferred indefinitely.
- Account linking between two users — never; two independent accounts sharing nothing but the
  budget *conventions* (each enters the household budget in their own plan; a future
  "export/share budget" affordance could remove the double entry — note as an idea only).

## Guided Budget wizard (unchanged from v1 — the "very very helpful" walkthrough)

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
6. **Couple-aware** — each line gets the me/partner/shared control (+ per-line % when shared) in
   the flow itself, so the your-share/partner-share split falls out of the walkthrough naturally.

## Engine debts logged during this investigation (independent of the above)
- `spFirstYearRatio` uses the calendar-year remainder, not plan-year (`StressRepository.js:286`).
- Decision multi-year projection `generateDrawdownSchedule` ignores date-based SP
  (`DrawdownService.js:447-450`).
- `applyBudgetToPlan` (`index.html:6275`) writes only Decision `baseSalary`, never Stress.

## Build order
1. Per-line share override + partner-share summary card (+ tests). Small, ships first.
2. Guided budget wizard (the main effort; independent track).
3. Wizard copy + caveat text.

## Open confirmations before coding
1. Partner-share summary in the budget review (+ "invite partner to plan with £Z") — agree?
2. Per-line % override with global default — agree, or keep the single global split?
3. Budget wizard scope as specced — anything to add/cut before build?
