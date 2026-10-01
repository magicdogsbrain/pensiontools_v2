# The budget step (design, 1 Oct 2026)

Owner, 1 Oct 2026: "where does the budget come into this? We seem to have almost abandoned that in favour of
simplicity. At some point we need to put them through a budget step but they should be able to just bypass it by
putting a single value in there (would be good to make it clear when doing that that they are bypassing it and it
would be better for them to do it). Also — don't use the budget to formulate how much they need — that's a guide for
the user when deciding how much."

## The rule

**The budget is a guide. The spending figure is always the person's own.** Every calculation uses the one figure in
the "What you would spend" box. The budget's total is shown beside that box; one tap copies it in, and the person can
change it. Nothing else flows from the budget into the numbers: no automatic copying, no "needs" worked out from it,
no essentials turned into a floor, no headroom added. Editing the budget later never moves the figure in use; it shows
"Your budget now adds up to £2,500 a month; this uses £2,340. [Use £2,500]".

## Where it sits

A step on the rail of every question that asks what you would spend (A, B, and later D and the plan), between "Your
numbers" and the answer:

> **What would you spend?**
> ( ) Work it out line by line — recommended, about 5 minutes
> ( ) Just put in one figure
>
> [ £ ____ a month, after tax, at today's prices ]

Choosing one figure shows, under the box, once, in plain words:

> You are skipping the budget. That is fine for a first look, but most people spend more than they think, and the
> answer is only as good as this figure. You can work it out line by line at any time; your answer will keep this
> figure until you choose to change it.

The answer screen keeps a quiet line while the budget is skipped: "Spending: £2,000 a month, your own figure (no
budget yet) — work it out line by line". The national guide levels (minimum / moderate / comfortable for one or
two people) stay as a second guide beside the box, never as the figure itself unless the person picks one.

C ("what is that a month") does not ask for spending; when a budget exists its answer adds one line: "Your budget adds
up to £2,340 a month — this gives £490 a month less" (or more).

## The budget sheet

Reuses today's budget model (`src/services/BudgetModel.js`: lines, typical amounts, starter lines) through a pure
adapter, so the figures and the saved shape stay one:

- Lines by heading (home, bills, food, getting about, holidays, health, family and giving, other), each a monthly
  or yearly amount, after tax, today's prices. Starter lines with typical amounts shown as hints, never filled in.
- Each line can be marked "essential" — shown as a sub-total for the person's own judgement only.
- One-off costs (a car every 8 years, a roof) listed with their year — shown as a guide, not added to the monthly
  figure.
- A couple's budget is the household's.
- Total a month, and the same total a year, and how it compares with the national guide levels.

## Saved where

In V7's state and draft store while the person is working; carried by "Save this as a plan" into the plan's budget
(`budgetTool`), so today's planner shows the same lines. The plan's spending target is the figure the person chose,
not the budget total.

## Tests

- The figure in use never changes when the budget changes (property test over random edits).
- Every answer equals the answer with the same figure typed by hand (the budget has no other path into the numbers;
  checked by a test that answers never read budget fields).
- "Skip" note shown once on skip, the answer's "no budget yet" line shown while skipped, gone once a budget exists.
- Couple budget totals; monthly/yearly lines; one-offs excluded from the monthly total; essentials sub-total.
- Round trip through "Save this as a plan": the plan's budget lines equal the sheet's; the plan's target equals the
  chosen figure.

## Today's app (v6), noted

Today's "Use as the start of my income shape" copies the grossed-up budget total into the plan and also writes the
essentials into the Floor & Flex dial. The second part is the budget deciding a figure. Left as it is until V7's
planner replaces it, unless the owner wants it changed now.
