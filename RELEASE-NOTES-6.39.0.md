# 6.39.0 — "I'm retired. Will it last?" is the way in, and the preview makes a plan itself (road step 7)

Draft release note for `src/releases.js` (the bump and the entry are the lead's: `package.json` and `src/releases.js` are not changed on this branch). Engine unchanged (6.37.0).

## Title

"I'm retired. Will it last?" is a question of its own, with three levers — on your figures and on your saved plan — and "Keep this as a plan" makes the plan in the preview itself

## Summary

The preview at /v7/ now answers the retired person's question directly. "I'm retired. Will it last? Could I spend more? Would some work help?" opens one short form — whether you have stopped, your age, what is left in your pension pots, whether you have had the tax-free part, your savings and what you take a month, a partner who has also stopped — and gives the verdict at what you take, with the band in full ("Could I spend more?"). Two levers are tried on the answer's own futures without leaving it: "Would some work help?" (pay a year for one to five years) and "What if shares fell by a fifth?". The same three levers are on every saved plan's "Does it last?", tried in the preview's worker on a copy of the plan; a lever writes nothing. Someone with a plan already is shown the way to its own test first. And "Keep this as a plan" now makes the plan in the preview itself — in the account, or in this browser window without one — and offers "Lock this plan?" at once; the hand-over of a seed to the planner is retired.

## Changes

- Preview, "I'm retired. Will it last?" (#/d/numbers): the retired person's way in. One form, the spending on it; "Not yet" under "Have you stopped work?" points, in the box's own sentence, at "When can I afford to stop work?". A couple: both of you have stopped; a partner still working is the stop-work question about them. The tax-free part is one tap of three (no, yes, some of it) and never guessed: "some" is counted as all taken, the cautious side. More detail: the risk level, the one charge, the age the money is tested to (the later of 95 and five years on, up to 105).
- Preview, the answer (#/d/answer): "Yes — £2,100 a month lasted" / "Close — … is tight" / "Not at … on these figures", word for word the stop-now row of "When can I afford to stop work?"; the sentence, the bad case, the warnings; "Could I spend more?" — about £X a month more (or less, or about what lasts) and the careful, middling and good amounts — the band question C gives from today, to the pound; what it is made of; what was assumed, each default with its "Change".
- Preview, the levers on the answer, tried on the same futures: "Would some work help?" — pay a year before tax for 1 to 5 years from today (the same mechanism as part-time work in "When can I afford to stop work?"): the verdict with the work, year by year to five, and what the work would let you spend; "What if shares fell by a fifth?" — the shares part of what you typed cut by a fifth: the verdict and the careful amount after it. A lever not opened costs nothing; "Take the work away" and "Put the shares back" give the answer as it was.
- Preview, "Does it last?" on a saved plan: "Try a change" — the same three levers on a copy of the plan, each the one test in the worker: "Could I spend more?" finds the most the plan's income can be scaled by and still last in 9 futures out of 10 (a bounded search of at most seven runs; the cost is said); "Would some work help?" adds the pay as a row of the planner's own extra incomes from the plan's first year (the field named on screen); "What if shares fell by a fifth?" cuts the shares part of each pot — the pension's, an ISA's where it is invested like the pension, a taxable account's held in shares, a saver's projected pot — the mix kept. Put away with one press. On a locked plan the document's figure stays above and one line sets it beside today's test; nothing suggests unlocking.
- Preview, "Keep this as a plan" (every answer of A, B, C and D): the preview makes the plan itself through its one write file — in the account, one new document per plan (never an update of another); in this browser window without an account, appended to the window's plans with the planner's own ids, every other plan byte-identical. The plan is the planner's own shape, field for field (the same mapping the planner's reader of a seed uses, lifted into a pure module), brought up to date and checked before anything is written. A couple's answer is two linked plans, the partner's first; if yours cannot be made the partner's stays and the panel says so — nothing is deleted. The first plan in the account or window is made the active one; no other plan's flag is touched. Then "Kept as ‘name’ in your account." (or "in this browser window."), "Lock this plan?" leading to the new plan's lock step, and "Your plans". "Keep", never "Save".
- Preview, "Keep this as a plan" without an account: refused once the window holds its three plans (the example plan does not count; a couple needs room for two) with the planner's own words, and once the free time is used up with the editing steps' words. The name box is filled with the answer's suggestion; a name already taken gets " (2)", as the planner does.
- Preview, "Will it last?" with a plan in the account or this window: D's form is headed by "You have a plan already…" with "Open ‘name’: does it last?" for each plan, the form below for a test afresh. D with a locked plan in the account keeps "a separate plan" and offers no lock sentence: the locked plan stays the one you follow.
- Preview, the front door: the D line opens #/d/numbers (it was "not in the preview yet"); "Will it last?" from the retired view of A and B, and from C's "What next?", opens D. The error for "I've already stopped" alone in A and B now points at "Will it last?".

## Corrections

- The retired view of "When can I afford to stop work?" and "Am I saving enough?" led to "not in the preview yet"; it leads to "Will it last?" now.

## Effects, per tool, on saved plans

- Stress tester (Drawdown Planner): none for existing plans. A plan kept from the preview arrives configured as a plan made from a seed by the planner's own reader: the same settings, the same income shape, the same "from answer" record.
- Strategies: none.
- Month by month (Decision tool): none. A plan kept from the preview is unlocked; "Lock this plan?" in the preview, or the planner's own lock, locks it as before.
- Household: a couple's answer kept from the preview is two plans linked one way (yours to your partner's), as the planner's reader of a seed makes them.
- Accumulation: none.
- Budget: none. A plan kept from an answer whose spending came from the budget sheet carries the sheet, as before.

## Actions

- None for anyone with an account. A plan kept in the preview is in "Your plans" at once.

## Notes

- The hand-over of a seed to the planner (#new-plan) is retired on the preview's side: the preview no longer writes `pt_v7_plan_seed` or reads a receipt, and nothing is left in the browser for a day. The planner's own reader of a seed is untouched this release and goes with the switch to 7.0.
- The boundary rule widened by one name: the one write file may `addDoc` a new plan (once, on the account's plans) beside its one `updateDoc`; `setDoc`, `deleteDoc`, `writeBatch` and `runTransaction` stay banned everywhere the preview can reach.
- The planner's mapping of a seed to a plan (`seedToScenario`, the default plan and strategy block) now lives in `src/services/PlanFromSeed.js`, pure; the repositories and `src/services/PlanSeed.js` keep every name by re-export, byte for byte.
- A lever on a saved plan prices a gilt ladder on the bundled yield curve (the preview loads no live prices), as "Does it last?" does. Nothing is deleted anywhere; a locked plan is changed only by the unlock and by a new version of its document.
