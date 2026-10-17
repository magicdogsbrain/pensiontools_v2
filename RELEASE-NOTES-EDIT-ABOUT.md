# Release notes to carry into `src/releases.js` — "About you and when": the first editing step in the preview (17 Oct 2026)

Not yet bumped: `package.json` and `src/releases.js` are untouched on this branch (the brief). The bullets below are the
entry for the release that ships this. Design: research/v7/editing-in-v7.md (the audit's decision 1(a), approved: after
"Your plan", the planner's editing moves into V7 one step at a time; this is the first step).

## Changes

- **"About you and when" can be changed in the preview** (`/v7/#/plan/<id>/about`, from "Your plan" → "Change this
  here"). Each fact once, by age, in plain English: your age today; stopped, or stopping at an age or in a month; when
  the plan's income starts (this tax year or next April) for someone who has stopped; the age to plan to, with "Suggest
  from how long people live" (the planner's own helper: a man or a woman; 1 in 10, 1 in 4 or half live beyond it).
  Beside each box, the saved value and where it came from ("From your plan, saved 22 August 2026 (58)"). Under the boxes,
  what it works out to — "You stop work in January 2030, at 62.", "The plan's first tax year is 2029/30, from 6 April 2029.",
  "Your plan runs 32 years, from January 2030 to age 93.", "Income steps start at age 62." — shown, never asked.
  Problems in plain words. Save, Cancel, and after a save an Undo toast for fifteen seconds that puts the plan back as it
  was, byte for byte.
- **It writes the same saved settings the planner's Timing block writes** — the age and its date, retired or the stop
  age, the first tax year, the derived start age, the length, the Decision copy's first tax year, and the budget's copy of
  the ages — and nothing else. A test proves every path written is on the step's declared list and that every other
  byte of the stored plan is unchanged.
- **After a change, the plan page says its ‘will it last’ answer is older than its inputs** ("Your ‘will it last’ answer
  was worked out on 20 September 2026, before the plan was changed on 30 September 2026.") and the next sentence becomes
  "check it still lasts", which opens the run in the planner. The rule reads the answer's own record of its inputs, so a
  change made in the planner is caught the same way. Until the preview's "Does it last?" step exists, the run stays in the
  planner.
- **Couples:** your partner's ages are on your partner's plan; the page says so and links there. One save writes one plan.
- **A locked plan is never changed.** Its "About you and when" is read-only ("Fixed when you locked the plan on …"), and
  every write passes the lock guard before anything is sent, even when the screen is bypassed. Signed in, the account's
  plans are read again just before a save, so a plan locked from another device is seen as locked.
- **Without an account,** this window's plans can be changed the same way while the free time is not used up; nothing is
  written once it is.

## Corrections

- "Your plan" now says the age the plan runs to as the planner's Timing block does (start age + years − 1): a 35-year
  plan from 57 runs "to age 91", not 92.
- "Add your age" and "Update it" on the plan page's next sentence open "About you and when" in the preview instead of the
  planner.

## Effects on saved plans

- None until you press Save on "About you and when". A save writes only that step's keys (research/v7/editing-in-v7.md 3)
  and stamps `lastModified`, as every save of the planner does. Undo writes the previous values back, the stamp included.
- A locked plan: no effect, ever. A plan saved by a newer version: shown as saved, not changed.

## Actions

- None needed. To change your ages or the plan's length from the preview: Your plans → the plan → Your plan → "Change
  this here".

## Notes

- Privacy: no new processor, no new data category, no new browser key. Typed text waits in this tab's `pt_v7_draft`
  with the other drafts and is cleared on save, cancel or leaving the plan; it never holds the plan.
- The preview's import boundary changed deliberately (tests/v7/boundaries.test.js rule 3): one file,
  `src/v7/effects/planWrite.js`, may write, by `doc` and `updateDoc` only; `setDoc`, `addDoc`, `deleteDoc`, `writeBatch`
  and `runTransaction` stay banned everywhere the preview can reach.
- Not in this release: pots at the stop (typed), which comes with "Your pots and tax"; "Money that comes in anyway",
  "What you spend", "Your pots and tax" and "Does it last?" as editing steps; the emulator-backed signed-in browser tests.
