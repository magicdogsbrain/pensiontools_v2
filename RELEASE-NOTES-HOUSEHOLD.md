# Release-note bullets: who draws what, and one household (no version bump here)

Research: `research/household-draw-split.md` (owner-approved 12 Oct 2026); `research/v7/v6-usability-audit.md` §1 problem 8,
§2.10, §5 decision 5 option (a). These bullets are for the next `src/releases.js` entry; `package.json` is not bumped.

## Changes (for a couple with two linked plans)

- **Who draws what.** The Household tab now works out, year by year in today's prices, the split of your household's
  after-tax spending that pays the least tax: the lower-taxed person fills their allowance and 20% band first (a quarter
  tax-free where that is how they draw), the other draws the rest, each capped at the top of the 20% band where the
  money allows, never more than a pot holds, and never past a limit you set ("keep [name]'s pot until 67", "keep at
  least £X in [name]'s pot"). The tax is the planner's own sum on each year's draws (`planDrawdown`), never a second rule.
- **The headline is unmissable** when the saving is over £1,000 a year, at the top of the tab: "Drawing together saves
  about £X a year in tax — about £Y by the time [name] is 67." Then the cost to the smaller pot, then the table (tax in
  the first full year / until the State Pension / over the whole plan; each pot at 67, 75 and 90 in a middling case;
  the money lasts in N of 10; what is left at 90 in a middling and a bad case), then: "Paying the tax keeps [name]'s
  pot, and your money more separate. Drawing together leaves the household about £Z better off at 90. This is your
  choice; neither is wrong." Every figure is from the runs.
- **Both ways through the one test.** "Each draws for their own plan" and "Drawing together, tax first" are both run
  through the one stress test every screen uses, each plan on its own strategy, paired future for future on the same
  markets.
- **The household verdict comes first.** When one pot is empty the other pays that share; the household runs out only
  when both have. Each pot's own reading is the second line. (Until now "both together" counted only futures in which
  each plan lasted on its own, so one partner's money never paid the other's share.)
- **"Use this split"** writes the split as income steps into both plans after a confirm that lists what changes, with
  Undo. A locked plan is never changed: the offer is then "Make copies of both plans with this split" (unlocked drafts,
  named by you, linked to each other). **"Keep things as they are"** dismisses it for that pair of plans until either
  plan changes.
- **The 2028 note** when one of you is 55 or 56 on 6 April 2028 and draws before then: take the months up to the 57th
  birthday in one go before then, or check for a protected pension age.
- **One budget for the household.** The Household tab says which plan's budget is the household's and offers to share
  it: the partner's plan then reads the same budget lines, with its own share of who pays and its own ages. The Budget
  page says "This is your household's budget, shared with [plan]". Either side can go back to a separate budget.
- **Gilt-ladder plans:** the comparison sizes the ladder to the lower draw; money a bought rung pays beyond the draw
  stays as cash in the pension, as the engine keeps it today — the tab says so in one line.

## Corrections

- The old "A tax thought" sentence understated the saving: it reckoned 20% of the slice moved, looked at year 0 only, and
  said nothing about what the smaller pot gives up. The real difference is 40% against about 15% (a quarter tax-free),
  every year until the smaller pot's State Pension. It is replaced by the comparison above.
- The couples check's "both together" figure is now the pooled household figure; the paired figure (each plan lasting on
  its own) is still shown beneath it.

## Effects on saved plans

- Nothing changes in any plan until you choose "Use this split". Two new keys when you do choose: `household.splitDismissed`
  on your plan for "Keep things as they are", and `budgetTool.sharedFrom` on the partner's plan when the budget is shared.
- Strategy results carry a per-future read-out (`futuresMc`) for the pooled verdict; the plan document never stores it.

## Actions

- Couples: open the Household tab, run the check, and read the headline. The choice is yours; neither way is wrong.

## Notes

- The reference case (generic, no names): £83,650 fully taxed pays £20,892; capped at £50,270 with the partner drawing
  £1,716 a month (a quarter tax-free) pays £8,115 for the same household net within £20 — a saving of £12,777. The
  split finds that year from the planner's own tax sums (`tests/householdDraw.test.js`).
- The smaller pot is counted down at its real value with no growth (pessimistic by design); the larger pot's draws are
  only ever lowered. The strategy runs then judge both pots properly.
- Not done in this change: the ladder engines still hold money a rung pays beyond the draw as cash (no "excess goes to
  the growth part" option); the comparison says so.
