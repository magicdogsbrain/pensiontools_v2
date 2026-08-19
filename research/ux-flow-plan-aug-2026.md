# UX Flow Audit & Couples-Completion Plan — August 2026

_Brief: implement time-varying budget split, survivor one-shot stress, and the
allowance-filling nudge — WITHOUT complicating the current flow. Audit every path from first
contact; simplify and direct. Both the simple user and the complex user must succeed without
"going on a course"._

---

## 1. Flow audit — how a user moves through the site today

**First contact:** Landing page (3-step story: Budget → Stress → Decisions, plus an
accumulation paragraph) → Create account / Sign in → Onboarding page (tool explanations,
plan concept, lock concept) → Setup wizard (net-first minimal plan creation, intent router)
→ lands in the app.

**The app: five main tabs, currently ordered** `Decision Tool | Stress Tester | Budget |
Accumulation | Household`.

### Findings (problems, in severity order)

**A1 — USER-REPORTED: the drawdown/UFPLS choice is invisible in own-funds mode.** The
"Your 25% tax-free cash" picker (with phased UFPLS and band-fill recycle) was placed inside
the risk-level block, which `setAllocMode` hides when "Use my own funds" is selected. A
plan-defining, locked setting must never disappear because of an unrelated display mode.

**A2 — Tab order fights the story.** The landing page teaches Budget (step 1) → Stress
(step 2) → Decisions (step 3), then the app presents tabs in the opposite order with
Decision first. A new user's eye lands on the most advanced tool.

**A3 — No guidance between stations.** After finishing the budget, nothing points to the
stress tester. After a stress run, nothing points at the decision tool. Each tool is good
once found; the connective tissue is missing. The setup wizard routes once at sign-in and
then never helps again.

**A4 — The couples path is explained only inside the Household tab.** Creating a partner
plan requires knowing the plan menu (▾) exists.

**A5 — Advanced options sit at the same visual level as basics.** Bond tent, diversifiers,
HODL, recycle, phased UFPLS, DB indexation are all excellent — and all visible at once.
The simple user reads a wall; the complex user is fine.

### What already works (don't touch)
- Net-first inputs everywhere; the budget walk-through wizard; risk presets vs own funds;
  plan lock with checksum; the monthly decision wizard; two-way settings copy.

## 2. The design ("directed freedom")

One principle fixes A2–A4 without complicating anything: **the app should always be able to
answer "what should I do next?" in one sentence, in one place, per tab** — and otherwise
stay out of the way.

1. **Reorder tabs to the journey:** `Budget | Stress Tester | Decision Tool | Accumulation |
   Household`. Landing story and app now agree. (Existing users lose nothing — same tabs.)
2. **Next-step banner (the "guide rail"):** one slim, dismissible banner at the top of each
   tab, computed from actual state:
   - Budget empty → "Start here: walk through your spending — 10 minutes, typical UK figures
     included." [Start walk-through]
   - Budget filled, target not applied → "Your budget adds up to £X/mo. Make it your plan's
     target →" [Set as target]
   - Target set, stress not configured → "Now see if your pension can pay for it." [Open
     Stress settings]
   - Stress run, decision not configured → "Ready for the monthly tool? It tells you what to
     draw, from where, each month." [Set up Decision Tool]
   - All configured → banner hidden (returning users see nothing).
   One banner, one sentence, one button. Grandma follows the rail; the expert dismisses it
   once and never sees it again (persisted per plan).
3. **Pension access gets its own always-visible section** ("How you'll take this pension")
   directly under the Spending need in both tools — fixes A1, and it's where a plan-defining
   choice belongs. Advanced sub-options (phased years, PCLS-to-ISA, recycle) stay inside it,
   collapsed behind the UFPLS selection / a details block (fixes part of A5).
4. **Couples entry point where couples look:** the Household tab keeps its how-to; ADD a
   "Create partner plan" button there that creates a named plan directly (no plan-menu
   spelunking), copying tax bands + CPI defaults, and switches you to its settings.

## 3. The three couples features (kept out of the main flow)

**F1 — Time-varying budget split.** `budget.splitPhases: [{fromAge, mySharePct}]` (optional;
absent = today's single `mySharePct`). `myShareFactor(item, budget, age)` resolves the phase
for that age; `targetScheduleFromBudget` passes the year's age (already computed), so the
per-year schedule handed to the stress tester automatically reflects "I pay 70% until Wendy
retires at 63, then 50/50". UI: one "Change who pays over time" details block inside the
budget's existing partner-split card — invisible unless sharing is on and expanded.
Per-item `mySharePct` overrides still win (unchanged).

**F2 — Survivor one-shot stress.** Opt-in section at the bottom of Household results:
"What if one of you dies?" — who, at what year, survivor spending (default 70% of household,
editable), DB survivor % (default 50%). Mechanics, reusing everything:
- Small golden-safe engine additions: `config.windfalls: [{year, amount}]` (pot injection at
  the start of year N — same plumbing pattern as the PCLS-at-switch transfer) and
  `config.extraIncomes: [{startYear, annual, indexation}]` (generalises the DB floor;
  `dbAmount` folds into it internally, byte-identical when absent).
- Survivor run = ONE standard Monte Carlo of a constructed config: survivor's own plan, plus
  a windfall at year N equal to the deceased's **median remaining pots at year N from the
  paired household run** (their real simulated depletion, not a guess), plus
  `extraIncomes: [{startYear: N, annual: deceasedDB × survivor%}]`, and a `targetSchedule`
  that steps from the survivor's current share to the survivor-alone budget at year N.
- Output: survivor success %, the three tight-years, and a one-line verdict. Clearly labelled
  as a stress check, not advice.

**F3 — Allowance-filling nudge.** Pure display inside Household results: for year 0 (and the
first post-SP year), compute each plan's taxable position from its own `planDrawdown` inputs;
if one partner pays higher-rate tax while the other has unused basic-rate band, show:
"Between you, £X of 20% band goes unused while [name] pays 40% on £Y. Shifting spending
funding toward [other name]'s pots could save up to ~£Z/yr. (You choose — we model.)" No
optimiser, no new settings.

## 4. Self-review loop (the overview test)

*Pass 1 concern:* does the banner nag? → Fixed: state-driven (disappears when the step is
done), dismissible per plan, never more than one sentence.
*Pass 2 concern:* five tabs + a banner + a wizard — three guidance systems? → No: the wizard
runs once at first sign-in; the banner takes over afterwards; tab order is passive. One
active guide at any moment.
*Pass 3 concern:* survivor check needs four inputs — too complex? → Defaults make it
one-click (dies: partner, year: 10, 70% spending, 50% DB); inputs are there to adjust after.
*Pass 4 concern:* does splitPhases complicate the budget wizard? → It never appears in the
wizard; only in the budget page's partner card, behind a details toggle.
*Grandma test:* she lands on Budget (first tab), one banner says start the walk-through, the
wizard holds her hand, then the banner walks her to Stress and then Decisions. She never
needs the plan menu, never sees UFPLS unless she opens "How you'll take this pension".
*Expert test:* everything from before plus phases/survivor/nudge; nothing moved except the
access picker (now MORE visible); banner dismissed once.
Verdict: coherent — proceed.

## 5. Implementation stages

- **Stage A:** Move pension-access section out of the risk block (both tools) — fixes A1.
- **Stage B:** Tab reorder + next-step banner engine (state checks + per-plan dismissal).
- **Stage C:** splitPhases (model + schedule + budget UI details block + tests).
- **Stage D:** Engine: `extraIncomes` + `windfalls` (golden-safe, tested).
- **Stage E:** Survivor check UI + construction logic + tests.
- **Stage F:** Allowance nudge in Household results.
- **Stage G:** Create partner plan button in Household.
- **Stage H:** Deploy; full site walkthrough: budget → target → stress (Chris - plan 1,
  £4,002/mo net, drawdown) → partner plan (Wendy - plan 1, £1,200/mo net, UFPLS whole-plan)
  → household check → decision tool + tax years for both plans.

Each stage: build + full test suite + commit. Deploy at the end of the batch.
