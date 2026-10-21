# Release note for 6.38.0 (to fold into `src/releases.js` — not yet bumped)

The shape of an entry in `src/releases.js`: `version`, `date`, `engineVersion`, `title`, `summary`, `changes[]`,
`corrections[]`, `effects{}` per tool, `actions[]`, `notes[]`. `engineVersion` stays at the engine's current version:
nothing in the engine changed.

## version

`6.38.0` — date: the day it goes live.

## title

The preview locks, unlocks and rewrites the plan document: "Lock the plan" is a step, "Your plan as locked" opens on sentences, "Where you are" compares like with like

## summary

The preview at /v7/ now locks a plan itself. "Lock the plan" is a step on every unlocked plan's rail: it says in plain words what the lock fixes, what stays changeable and what you get, then locks the plan in one step with a confirm on the page. The lock is the planner's own, field for field: the Month-by-month settings seeded from the plan's settings, the lock's date and label, the plan document written from the plan's own test, and the plan's record of its stage. Unlocking is offered once, on "Your plan as locked", and keeps the plan document as a past version; "Write a new version from today's settings" is there too. "Your plan as locked" now opens on four sentences — the money before and after tax by age, the State Pension and whether it is assumed, the bad case, the rules for cutting income — and "Where you are" sets what was taken against what the plan said for those months, with the difference and, where a recorded month says so, that income was cut.

## changes

- Preview, "Lock the plan" (#/plan/<id>/lock): the rail step is now its own screen. It says what the lock fixes (the ages and dates, what comes in anyway, what you spend, the pots and tax, the way of drawing and its dials, the cut rules — for both tools), what stays changeable (your monthly records, what you hold, the budget, how often you draw, what you pay in) and what you get (the plan document at the prices of the lock day, "Where you are", month-by-month records). A saver reads that the plan then follows the pot each month. One button, "Lock this plan", then "Lock it" / "Not now" on the same screen.
- Preview, the lock itself: the plan's own test runs in the preview's worker (the same lazily loaded run as "Does it last?"), the plan document is built with the planner's own builder, and ONE write carries the planner's commitPlanLock field for field — the Month-by-month settings seeded from the plan's settings, `locked`, `lockedAt`, `lockedBy` ("locked in the preview"), the planner's yardstick for its records when the plan has none, the plan document, and the stage change in the plan's journey. The page then goes to "Your plan as locked" with an Undo toast; Undo within the toast's time is the exact reverse (the keys put back, the document removed); after that, unlocking is the way back.
- Preview, "Your plan as locked": unlocking is offered here and nowhere else (owner question 4(a)), as a quiet button with a confirm that says what unlocking keeps. The write is the planner's unlockPlan field for field, in one write: the document and the planner's yardstick each into its archive (ten kept at most), the flag off, the unlock dated and counted, and the usual starting values a plan locked before a setting existed gets on unlocking (the charge, how the ISA grows).
- Preview, "Write a new version from today's settings" on a locked plan, with a confirm that says the current document is kept as a past version; a plan locked before plan documents existed gets "Write the plan document" instead. Only the document changes.
- Preview, "Your plan as locked" opens on sentences read from the document: each step as "From age N: £X a year before tax, £Y a month after tax (tax year …)"; the State Pension and whether it is assumed; the bad case (the worst 1 in 10) and what is typically left, from the document's own verdict; the rules for cutting income (or "none" for a way of drawing that buys its income).
- Preview, "Where you are" on a retired plan: "£19,000 taken; the plan said £20,000 for those months; £1,000 less because income was cut in 2 of them" (or "less than the plan said", "more than the plan said", "the same as the plan said"). Dates, never a countdown.
- Preview: without an account the lock works on this window's plans exactly as the editing steps do, and is refused once the free time is used up, with the same words.
- The planner's lock banner reads "(since dd/mm/yyyy, locked in the preview)" for a plan locked there; everything else it does with a locked plan is unchanged.

## corrections

- Preview, "Does it last?" on a locked plan and the sections of "Your plan as locked" said the planner unlocks a plan and asks first; they now say where the unlock is (on "Your plan as locked"), and that your records stay.

## effects

- budget: none.
- stress: none. (A plan locked in the preview reads on the Settings page exactly as one locked there: the banner, the frozen settings, "Open plan document".)
- strategies: none.
- decision: none for plans already locked. A plan locked in the preview arrives with its Month-by-month settings seeded from the plan's settings, the lock flags and the plan document, as the planner's own lock leaves them; the first monthly record then needs no lock. A plan unlocked in the preview arrives as the planner's unlock leaves it: the document under previous versions, the settings open.
- accumulation: none.
- household: none.

## actions

- None. A plan locked or unlocked in the preview needs nothing done in the planner.

## notes

- The lock in the preview prices a gilt ladder on the bundled yield curve (the preview loads no live prices); the planner prices it on the day's live figures when it has them. The plan document says which curve priced it as before; a ladder plan locked on a day the live file has moved can carry a different cost from one locked in the planner that day.
- The store-side lock guard (LockedPlanGuard) now allows, with an unlock and only then, the two starting values an unlock writes (the charge, how the ISA grows) in the same write; the planner's own unlock, which writes them in a second save, is unchanged.
- The pure parts of the lock moved out of the repositories into `src/services/PlanCommit.js` (the Month-by-month seed, the unlock defaults, the settings checksum, the yardstick builder, the shared-budget view); the repositories keep every name, so nothing the planner calls changes.
- Nothing is deleted automatically; a locked plan is changed only by the unlock and by a new version of its document.
