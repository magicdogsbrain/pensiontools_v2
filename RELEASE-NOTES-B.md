# Release-note bullets — batch B (Stress settings, results, the lock and the plan document)

From the v6 usability audit (research/v7/v6-usability-audit.md §1 problems 3, 4, 5, 7, 10; §2.4–2.6; §5 decisions 3 and 4),
approved by the owner 17 Oct 2026. For `src/releases.js` when the version is bumped; no bump in this batch.

## changes

- **Recording a first month asks first — everyone.** The Decision tool's first monthly entry, or its tax-year set-up,
  no longer locks an unlocked plan without a word. You are asked "This locks the plan. Lock it now?". Yes runs the same
  lock as Stress tester → Settings → "Lock plan & create the plan document": your Stress settings are copied across to
  the Decision tool, the plan is locked and the plan document is written — then the month is recorded. "Not now" leaves
  the month unrecorded. A plan is never locked against the Decision tool's own defaults again.
- **How often you draw is a preference, not a plan setting.** Monthly, quarterly or yearly drawing can be changed on a
  locked plan, and changing it never marks a recorded month as "recorded under previous settings". (It is saved as
  `decisionTool.cadence`; a plan saved before this change is read as before and its stored settings are not touched.)
  "This month's payment has already been made" was never a setting and stays changeable too.
- **Final-salary pension: start asked by age.** The box that asked for a "plan year, 0 = now" asks for the age the
  pension starts, and says what that means beside it ("that is age 70, plan year 13 (tax year 2040/41)"). A start
  before the plan is said plainly; a start after the plan's end — which was saved and silently never paid — is
  refused on Save with the last age the plan runs to.
- **Bought strategies show every setting their engines use.** Choosing a ladder, floor or rotation strategy used to
  hide six settings the engines still read: the plan's length, fund and platform charges, how the ISA grows, the
  taxable account, relevant earnings and bed-and-ISA. They now stay in view for every strategy; the taxable account
  shows in fund-list mode too. A setting a way of drawing really ignores says "Not used by this way of drawing" beside
  it (for the bought strategies: earnings and bed-and-ISA; how the ISA grows once the plan is running).
- **The State Pension the plan assumes is said wherever it is used.** With no State Pension entered, Settings says
  "every run assumes £12,000 a year from age 67"; the gilt order sheet, on the Strategies page and the full-ladder page,
  carries the same note and marks the "+ SP" cells "(assumed)"; the plan document's assumptions say it too.
- **"Try a strategy" runs the plan's full length.** The 35-year cap is gone: a what-if runs for the plan's own
  duration (up to the engines' 45 years), so its figure is comparable with the plan's.
- **The plan document: "Write a new version from today's settings"** (was "Refresh the document"), and the page asks
  first — the current document becomes a past version under "Previous versions"; nothing is lost.
- **The plan document's words follow the way of drawing.** A ladder plan's document no longer describes Pots & Valves
  mechanics (glidepath tracks, protection), and a Pots & Valves plan's "Where you are" no longer speaks of "the
  ladder's rungs" in a run-up month. Each of the nine strategies has its own sentences; a document written before the
  strategy id was kept reads as it always did. Documents are not rewritten.
- **Dates in UK words.** The order sheet's maturity months, the saving records, the plan document's "recorded" and
  "as of" dates and the Decision tool's "frozen on" date read as "September 2026" or "6 April 2027" — never "2026-09"
  or in US order.
- **Words brought up to date.** "Six strategies" is gone: the count comes from the strategy registry (nine today). The
  abolished lifetime allowance is no longer mentioned; the tax-free cash note names the £268,275 lump sum allowance.

## corrections

- A final-salary pension whose start was typed as an age into the plan-year box (65, say) was saved and never paid,
  with no warning.
- The first monthly entry locked a plan on the Decision tool's defaults (£500,000, a £31,200 target, 35 years) and
  wrote no plan document.
- The plan document's "Where you are" mentioned "the ladder's rungs" on plans with no ladder; section 4 described
  Pots & Valves mechanics on ladder plans.
- "Try a strategy" capped every what-if at 35 years, so a 40-year plan's what-if did not match the plan.
- The gilt order sheet was sized on a State Pension nobody entered, without saying so.

## effects on saved plans

- **Locked plans:** nothing stored changes — settings, checksum, plan document, history and plan of record stay
  byte-identical. Changing how often you draw writes `decisionTool.cadence` only.
- **Unlocked plans:** the next Save of the Stress settings writes `dbStartAge` beside `dbStartYear` (the year the
  engines read is unchanged unless the age is changed).
- **Decision tool:** a plan's first month now asks before locking; a plan already locked is not asked.

## actions

- If you had typed an age into the old "DB Starts (plan year)" box, open Stress tester → Settings → Other income and
  check the age shown; the words beside it say when the pension pays.
- If no State Pension is entered, enter your forecast date and weekly amount in Settings — every strategy's figures
  are otherwise sized on the assumed £12,000 a year from 67.

## notes

- Logic lives in modules: `src/services/DrawCadence.js`, `src/services/StrategyWords.js`, `src/ui/dbStartSetting.js`,
  `src/ui/strategySettingsUse.js`, `src/ui/ukDates.js`, `src/ui/plannerWords.js`; `src/ui/decisionLockAsk.js` runs the
  full lock (`window.commitPlanLock` in index.html, shared with the Stress settings' button). index.html's inline
  script is 3 lines shorter (10,498).
- Tests updated because they pinned the old behaviour: `tests/decisionLockAsk.test.js` (only savers were asked),
  `tests/lockedPlanWrites.test.js` and `tests/lockedPlanGuard.test.js` (the cadence was refused on a locked plan),
  `tests/safetyFixes.ui.test.js` (the picker wrote the settings), `tests/saverLock.test.js` and `tests/holdings.test.js`
  (ISO dates in the strip), `tests/replay/aprilSlideAndLockedLadder.test.js` (a moved anchor), the parity ledger
  (`decision.cadence` → `plan.decisionTool.cadence`; `stress.dbStartAge` added; markdown regenerated).
