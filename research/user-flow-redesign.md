# User-flow redesign — first principles

The setup wizard predates the net-first pivot and the Budget tool. It asks "how much money do you want
each year… before tax" (gross salary — a number users don't think in and, post-pivot, a *derived* value),
has no "own funds"/tagged-holdings path, and forces a 6-step pension setup on someone who may just want to
budget. Rethink from scratch.

## What is this app, really?
A UK retirement planner that answers three questions, all driven by just two facts:
- **What you HAVE** — your pots (SIPP / ISA / GIA / Cash), optionally your *actual tagged funds*.
- **What you'll NEED to SPEND** — your *net* budget (money in your pocket), from the Budget planner.

The three questions map to the tabs:
- **Budget** — "What will I actually spend?" → needs almost nothing (ages + expenses).
- **Stress** — "Can I afford to retire / will it last?" → needs pots + the spending need + horizon + State Pension.
- **Decision** — "Where do I draw from this month?" → needs pots + tax + the spending need.
- *(future)* **Cashflow** — year-by-year, multi-pot, lump sums, couples.

**Gross salary is an internal, derived number** (we gross up the budget's net need through the tax bands).
It should never be a front-door question.

## Principles for the flow
1. **Intent-first, not questionnaire-first.** Ask "what do you want to do?" and route there. Don't force a
   full setup on a budgeter.
2. **Lazy setup / progressive disclosure.** A plan can exist with just a name + your ages. Each tool asks for
   *its own* missing inputs when opened (we already do this: Decision settings, the April tax-year wizard).
3. **Net, not gross.** The spending NEED comes from the Budget planner (or a quick "£/month I want to spend"
   fallback if skipped). Gross is derived, never asked.
4. **"What you have" = pots + own funds.** Offer the 4-pot model with an **"tag my real funds"** path (own
   funds) OR **"just amounts + a risk level"** — reusing the allocation control we already built. (Missing today.)
5. **Budget is the natural front door** — spending drives everything and needs the least to start.
6. **Household from the start (optional).** "Just me / me + a partner" early — it drives budget sharing (and,
   later, two-person pots & tax).

## Proposed flow

### A. Minimal plan creation (30 seconds, no money questions)
- Plan name (default "My plan").
- Who: **Just me** / **Me + a partner**.
- Ages: your age now + target retirement age (+ partner's if applicable).
That's enough to create a plan. No salary, no pots.

### B. Intent router — "Where would you like to start?"
Three cards (do any/all later; this just picks the first stop):
- **Work out my budget** → Budget planner. *(default / recommended — needs nothing more.)*
- **See if I can afford to retire** → pot entry (C) → Stress.
- **Decide this month's withdrawal** → pot entry (C) → Decision.

### C. "What you have" (pots) — only when a path needs it
Reuse the allocation control:
- **Use my own funds** → tag real holdings → SIPP / ISA / GIA / Cash + fund list (the net-native 4-pot model).
- **Just amounts + a risk level** → pot totals + a risk preset.
Replaces today's "pot & risk only" step and adds the missing own-funds path.

### D. Target income = derived from the Budget
When Stress/Decision needs a target, use the budget's **all-in comfortable**, grossed up. If there's no budget
yet: **"Set your budget"** (recommended) or **"Just enter a monthly spend"** (quick fallback). Never "gross salary".

### E. Timing & income details (State Pension, other income)
Asked by the tools that need them (the tax-year wizard already does this), not front-loaded.

## Concrete changes to build
1. Replace the 6-step stress setup + the gross-salary question with **minimal creation (A) + intent router (B)**.
2. **Drop the "which tools?" step** — enable all tabs; route by intent instead.
3. **Add the own-funds/tagged path** to pot entry (C) (reuse the allocation mode control).
4. **Kill "gross salary"**; derive the target from the budget; offer a "£/month spend" quick fallback.
5. **Lazy per-tool prompts** for pots / State Pension / other income (extend the existing pattern).
6. Budget becomes the **default landing** for a brand-new plan.

## Open decisions (need your steer)
1. **Budget as the default front door** for new plans — agree?
2. **Drop the "choose tools" step** (enable all three, route by intent) — agree, or keep an explicit choice?
3. **Minimal creation = name + who + ages only** — enough, or anything else mandatory?
4. **Pot entry = own-funds vs risk-level** (reusing the allocation control) — agree?
5. Keep a **"just a monthly spend" quick fallback** for users who skip the full Budget — yes?
6. Scope: rebuild the **new-plan setup wizard** now, or also revisit the **first-run/onboarding** (the pre-login landing) at the same time?
