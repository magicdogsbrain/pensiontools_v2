# One product, two modes, three stages — the design (6 Nov 2026)

> **Superseded from 7.8.0 on (11 Nov 2026).** The route below was built to 7.6.0. The plan from 7.8.0 is
> `replan-nov-2026.md`: one plan, three phases (Saving, Moving, Living on it), Simple and Full views, three detail
> levels, and a success definition advisers would recognise. Read that first.


The design we agreed on 6 Nov 2026 after 7.2.1, from three independent designs (journeys, data and risk, the simplest product) and two judges (product fit, the safety of saved plans) run against the code at 7.2.1. It supersedes `after-7.md` §4 ("the classic planner retires at 7.3.0": it stays, as Expert mode) and `road-to-7.md` decision 5. Every example is fictional (Alex, Sam).


## Context

pensiontools.uk runs two apps over the same saved plans: the question-led app at the site root (`src/v7`) and the
classic planner at `/classic/` (`index.html` + `src/ui`). After 7.0–7.2 shipped, we walked the site as a person
with a plan and found it treats everyone as a first-time visitor: a locked plan opens on a form, Month by month offers
next month when nothing is due, "Ask a question" and "Keep this as a plan" are pushed on someone carrying out a plan,
and the classic planner is called "the previous version" although it is the only place with every setting.

Our direction (6 Nov 2026), settled through eleven decisions:

1. **Four user types**, each with a journey: a saver decades away; approaching retirement; retired and drawing;
   couples first-class at every stage.
2. **Two modes over ONE plan**, switchable any time: **Standard** (the root app: hand-holding, typical UK figures
   shown as "we assumed …" with one tap to change, "answer everything in full" available) and **Expert** (the classic
   planner renamed; same home and stage; its tabs and dials stay; no new Expert features). A per-account preference;
   "Open in Expert" on every Standard screen.
3. **Three stages of one plan**: **Saving → Moving → Drawing**. A plan can start at any stage from the front door
   and can be advanced by hand. "Am I saving enough?" and "When can I stop?" both start Saving ("someone asking
   when is clearly not moving unless they agree to a stress tested drawing plan"); "I've got about £X" starts
   Moving; "I'm retired" starts Drawing.
4. **Moving begins only by agreement.** Within a year of a locked saving plan's stop, and at the stop, the home
   invites the person: on course or behind, "ready to plan the move?". **Agreeing** = confirm the stop month, see
   "Does it last?" on today's pots, lock it as the drawing plan; the stage becomes Moving on that lock. **Declining**
   unlocks the saving plan so the stop date or pay-ins can change; the invitation returns as the new stop nears.
   **Drawing** begins when the person says the move is done, or that there is nothing to move — never on a month alone.
5. **A locked plan opens on a home**: to-dos due now for its stage; then "where you are"; then the steps, read-only.
   Questions are offered, never pushed.
6. **Storage**: only the person's agreements are stored (agreed to move; move finished/skipped; a by-hand "I'm moving
   now"). Everything else is derived from facts the plan holds. **Nothing is written because a plan was opened.**
   No migration.
7. A full route of releases, each shippable alone, first two in most detail.

Three design agents (journeys / data-and-risk / simplest) and two judges (product fit / plan safety) produced and
tested this design against the code at 7.2.1. Their findings that changed it: an unlocked saver past its stop is
stuck as "approaching" forever (`LifeStage.js:116-118`, `PlanTiming.js:275-278`); the store's guard never sees a
root-key write (`LockedPlanGuard.js writeNeedsGuard :262`); any stage riding on the month or tick writes breaks the
month and hold identity gates; any "I have stopped" that flips `retired` without rewriting `firstTaxYear` (stored on
every About save, `about.js:297`, and on back-to-work successors, fixture 19) gives a years-late bridge.

## The concepts (four, on screen)

| Concept | Words on screen | Source |
|---|---|---|
| Your plan | "Your plan", "Your plans" | as today |
| Its stage | **Saving · Moving · Drawing** (+ "Closed {month}" for a previous plan) | `stageOf` (new, derived) |
| What's due | "To do" / "Nothing due until {date}" | `homeOf` (new, pure) |
| Standard / Expert | "Standard", "Expert", "Open in Expert" | profile `mode` |

Banned on screen (`src/v7/copy/banned.js`): accumulation, decumulation, transition, decision tool, stress tester,
wizard, onboarding, dashboard, scenario, preview, Drawdown Planner; "classic planner" and "previous version" join the
list at 7.5.0. "Standard", "Expert", "mode", "Saving/Moving/Drawing" pass.

## The stage model (derived from facts; three stored agreements)

### Mapping from the eight derived placings (`src/services/LifeStage.js deriveStage :83-130`, unchanged)

| Placing | Stage | Rule |
|---|---|---|
| unknown | (none) | home's only item: "add your age" |
| saving, approaching, committed-saving | **Saving** | before the agreed move |
| committed-saving / running (future mode) with `agreedMove` | **Moving** | the person agreed; the drawing lock exists |
| running / bridge with `transition.finished` | **Drawing** | the person said the move is done / nothing to move |
| running / bridge without `transition.finished` | **Moving** if `movePending`, else **Drawing** | `movePending` = holdings recorded and `diffHoldings().complete === false`, or `stage.key === 'moving'` by hand; a plan with no holdings record and no move items is Drawing |
| draft-retired | **Drawing** (not locked) | first to-do: lock |
| closed | Closed | frozen at close |

`stageOf(plan, now)` (new, in `src/services/LifeStage.js`, both apps import it) returns `{ key, since, by, invite }`
where `invite` is the move invitation when due (§ below). Pure; no write.

### The three stored facts (all inside objects already written whole, or one small root key)

1. **`accumulationTool.agreedMove: { at: ISO, stop: 'YYYY-MM', answer: 'yes' } | null`** — written by the agreement
   flow's lock (the same write as the drawing lock, `LOCK_WRITES` + this path). A "no" is not stored: it is the
   unlock (`unlockPatch`, archive as any unlock) and the invitation returns.
2. **`transition.finished: { at: 'YYYY-MM-DD', how: 'done' | 'skipped' } | null`** — whole-object through
   `MOVE_WRITES` (`schema.js:730`) by a new pure `finishMove`/`unfinishMove` in `TransitionPlanner.js`; **never**
   through `tickMove` (`holdIdentity` pins the tick). `copyOf` drops it; `successorOf` already deletes `transition`.
3. **`stage: { key: 'moving', at: ISO, by: 'byHand' } | null`** (root) — the one by-hand override: "I'm moving my
   money now" before a lock (C from the front door; or a saver who wants the move steps early), and "the move is not
   finished after all" (clears `transition.finished` instead; no backwards stage). Honoured by `stageOf` unless a
   later-dated `transition.finished` or a close contradicts it. Dropped by `copyOf` and `successorOf`; in
   `FROZEN_WHEN_CLOSED`; added to `writeNeedsGuard` so the store refuses it on a closed plan from either app.

**Never**: a stage inside `LOCK_WRITES` beyond `agreedMove`, inside `MONTH_WRITES` or the tick write; a settle/backfill
on open; a stage derived from the journey; a `schemaVersion` bump (`tests/migrations.test.js:175` forbids a
clock-dependent step). `migrations.js protectedParts :77-89` gains `transition`, `stage`, `accumulationTool.agreedMove`.

### The move invitation (`invite` from `stageOf`)

Shown on a **locked saving plan** (placing `committed-saving`) when `now >= stop − 12 months`, and as the first to-do
from the stop month. Words: "You stop work in {month} ({n} months). At your last check-in you were {on course / behind}.
Ready to plan the move?" Buttons: **Plan the move** / **Not yet** (hides it until next month; stored in the window only)
/ **Change the date** (= decline: `unlockPatch`, then About opens on the stop date).

**Plan the move** opens `#/plan/<id>/move-on` (new sub-step `agree`): (1) confirm the stop month (`aboutPatch` with
`{stopped:'yes', stopMonth, startWhen:'stop'}` — the existing writer `about.js:280-297`, so `retired`, `stoppedWork`
and `firstTaxYear` are all rewritten to the stop; this is the fix for the "stuck approaching" gap too);
(2) today's pots pre-filled from the latest check-in; (3) "Does it last?" run on them (the existing `lastsRun`);
(4) **Lock as my drawing plan** → `lockPatch` with `agreedMove` → stage Moving; or **Back to saving** (nothing
written beyond the stop confirmation; the invitation stays).

An **unlocked** saver past its stop gets the same invitation with "I have stopped" as step (1) — never a silent
`deriveStage` change.

### Drawing

From the Moving home: "The move is done" (when `diffHoldings().complete`) or "I'm not moving anything" (no holdings
record and no move items) → `finishMove` → Drawing. Months are recordable during Moving (tranches, bridge years).

## The plan home (`#/plan/<id>` for every plan, every stage)

Sections, top to bottom (new `src/v7/screens/plan/HomeScreen.jsx`; `PlanScreen.jsx:149-151` hands to it instead of
to `MonthScreen`; the rail (`PlanRail.jsx`) is not drawn on the home — the home *is* the rail laid out):

1. **The plan's line**: name · stage word · "Locked on {date}" · partner's plan · "Closes at the end of {month}".
2. **To do** — at most three, "and N more"; or the dated nothing-due line (never "nothing to do" without a date).
3. **Where you are** — Saving: latest check-in vs the path (`whereStep` saver branch); Moving: "{held}% of the mix
   held; next: …" (`TransitionPlanner.progress`) + the drawing block once months exist; Drawing:
   `PlanDocument.whereAmI :603` as `whereStep` draws it; Closed: frozen.
4. **Your steps** — the rail's steps read-only with each result line; no ○ "Not done yet" on a locked plan
   (`read.js:902`); a saver's "For later" group stays.
5. **Tools** — Month by month, Check in, Your move, What you hold, Budget, Household, each with its one-line state.
6. **Change the plan / Try something** (collapsed) — Try a change, Try another way/mix (nothing changes), Move to a
   new plan, I'm going back to work, Unlock, "I'm moving my money now" / "The move is not finished after all".
7. **Questions** (collapsed) — "Ask a question with this plan's figures" filtered by stage (B for Saving; A for
   Saving; D for Moving/Drawing; C for Moving). "Keep this as a plan" offered on the way back only when figures differ.
8. Header: **Open in Expert** (a visit, writes no preference).

### The to-do reader: `homeOf(entries, id, { today, source })` (new `src/answers/plan/home.js`, pure)

Reuses, by name, every item already computed; **one engine**: `read.js nextFor :771-859` becomes
`dueFor(C, built)[0]` so the rail's "Next" and the home's first item can never disagree. Priority within a stage:

| rank | id | source | stages | dismissible |
|---|---|---|---|---|
| 1 | `closed.next` | `PlanClosed.closedReading :266` | closed | no |
| 2 | `plan.noAge` / `agesFromSaving` | `nextFor` P.noAge/P.agesFromSaving | all | no |
| 3 | `move.invite` | `stageOf().invite` (≤12 months to stop, or stop passed; unlocked past stop) | saving | "Not yet" (window) |
| 4 | `lock.first` | not locked on a Moving/Drawing plan (`month.js:388` refuses unlocked) | moving, drawing | no |
| 5 | `month.taxYear` | `read.js:260` / `TaxYearSetUp.js`; *soon* from 1 March | moving, drawing | no |
| 6 | `month.arrive` | `LifeStage.arrivalCheck :281` (P.arrive) | moving | no |
| 7 | `month.gap` / `month.record` | `read.js firstGap :216`, `MonthFill.fillOffer`; honours `decisionTool.cadence` from day one | moving, drawing | no |
| 8 | `move.next` | `TransitionPlanner.progress :331` + `sequence :272` ("By {month}", `late` when passed) | moving (lead), drawing (lower) | no |
| 9 | `move.finish` | `diffHoldings().complete && !finished`, or no record & no items ("nothing to move?") | moving | no |
| 10 | `checkin.first` | saving plan with no check-ins ("Your first check-in sets how often") | saving | no |
| 11 | `checkin.due` | `checkInDueOf :58-75` `.due` — **one flag** (legacy monthly included); the plans list adopts it (`read.js:127-128,:162`); pins in `tests/v7/plan/checkIn.test.js:120-125` retaken on purpose | saving | no |
| 12 | `checkin.behind` | P.behind | saving | no |
| 13 | `saving.noAim` | P.noAim | saving | no |
| 14 | `hold.stale` | `read.js sourceOf :193` (>3 months) | moving, drawing | yes (window) |
| 15 | `draft.stale` / `answer.stale` | `PlanTiming.staleDraft :475` (existing `staleDraftDismissedFor`) / `answerAge` | unlocked | yes (existing) |
| 16 | `household.pending` / `household.split` | `read.js householdStep :739`; the split once a plan is locked | all | split: existing `splitDismissed` |
| 17 | `income.starts` | State Pension / DB start next month → the tax-year set-up | drawing | no |
| — | **Also** (not counted): `note.2028` (`income.js note2028 :77`), `note.mpaa` (`FlexibleAccess.mpaaOf :127`) | once, dismissible (window) | | |

Not to-dos: What's new (shell pop-up/footer), close offers and back to work (under "Change the plan").
**No `tasks` root key in the first releases**: dismissals that need to persist use the existing per-item fields; the
rest live in the window (sessionStorage) — revisit at 7.7.0 if they should persist.

Nothing-due per stage: Saving with cadence "Nothing due. Your next check-in is {month}." (+ "Add it to your
calendar"); legacy "{Month}'s pot is recorded. Nothing due until {next}."; Moving "{n} of {m} moves done; next
{label} by {month}."; Drawing "{Month} recorded. Nothing due until {1 next-month}." (P.idle word for word); Closed
"Closed {month}; carried on in ‘{name}’."

### Forms become tools
- **Month by month** (`MonthScreen.jsx`, `month.js :75,:81`): the form shows only when a month is due, chosen, or the
  person presses "Record a different month"; otherwise the idle line, recent months, and "November opens on
  1 December (record it early if the payment has gone)". The March tax-year set-up is reached by its to-do/button only.
- **Check in** (`CheckInScreen.jsx:291`, `checkIn.js:739`): form when due or after "Check in now anyway"; else the last
  result and the next date.
- Locked plans: "Try a change"/"Keep as a separate plan" (`LastsScreen.jsx:274,:312`) and "Try another way/mix"
  (`read.js:552,554`) move under "Try something", collapsed; "Ask a question" leaves the rail (`PlanRail.jsx:72-80`).
- **Landing** (`place.js :50-65,:133-138`): a remembered place on a locked plan lands on the home; `lastLocation`
  keeps `{planId, step}` but `step` is ignored for locked plans. After sign-in on a new device with no way back → the
  last plan's home, not "Your account" (`place.js:121`).

### Couples on the home
The partner's **due** items (ranks ≤ 9) one line each, named by plan ("Record November — Sam's plan"), each opening
that plan's tool; household items once ("Set up 2027/28 — both plans"; "Decide who draws what" once a plan is locked);
the main plan's "Where you are" plus one "Together: …" line from `householdOf`. Figures from the other plan never
shown here (household words rule). Stages are per plan; mixed stages are normal (`startOffset` signed,
plan-start.md §2 G).

## Modes

- `users/{uid}/profile/settings.mode: 'standard' | 'expert'` (absent = standard). Written only by the account page's
  "How you like to work" in either mode and Expert's one-time strip "Make Expert my usual"; through the one merged
  `writeSettings` (`account.js:227-232`; `tests/v7/shell/account.test.js:271-277` gains one call). Window fallback
  `localStorage['pt_mode']` in a new `src/v7/effects/mode.js` (boundaries table gains it).
- **"Open in Expert"** (header, every Standard screen) = the existing hand-over (`effects/openPlace.js`,
  `OpenPlace.makeRequest :76`), writes no preference. `PLACES` (`OpenPlace.js:33-58`) gains `home` (tab from
  `openingTab`, section the Expert home), `checkin`→potRecord, `lasts`→test, `mix`→pots' mix section, `where`→document;
  `tests/openPlace.test.js` reads `index.html` for the ids.
- `landingFor` with `mode === 'expert'`: write a `home` request for the last plan and open `/classic/` (arrives
  signed in since 7.1.0).
- **Expert's home** = the same `homeOf` list drawn by new `src/ui/expertHome.js` into the existing `#nextStepBanner`
  mount (`index.html:2209-2212`), replacing the body of `updateNextStepBanner` (`:6896-6920`) with one call (inline
  shrinks; `shellRatchet MAX_LINES` lowered), plus the where-am-I strip on load (`renderWhereAmILine :7331`, today
  empty until Calculate) and the stage chip. `openingTab` (`LifeStage.js:178`) gains: Moving → Transition tab. Dismiss
  stays. No tab removed; no new Expert feature.
- **Renames (words, never addresses)**: `copy/common.js:37-39 previous` → mode words; `src/ui/classicName.js` →
  "PensionTools Expert" / "Expert"; `vite.layout.js:128,134,140` title and "Back to Standard"; ~40 "the classic
  planner" lines across `src/v7/copy/{plan,month,lasts,pots,saving,move,way,spend,about,assumptions}.js` → "Expert";
  `OpenPlace.OPEN_PLACE_WORDS :105-113`; `public/privacy.html:88`; `banned.js` gains `classic-planner`,
  `previous-version`. `lockedBy` data (`lock.js:45-54`) never rewritten, all labels still recognised. `/classic/`,
  `FOLDERS`, `_headers`, the service worker: unchanged. `e2e/old-app-unchanged.spec.js` → `expert-unchanged.spec.js`
  (parity by presence: every tab, sub-tab and dial present).

## Standard's "we assumed …"

`read.js sourceOf :193` gains kind `'assumed'` when a setting is absent and a default stands in; `PlanFigures.jsx`
prints "We assumed {figure}." with the section's existing "Change this here" (`sections :542-555`). A root
`assumed: { '<field path>': { by: 'standard', version } }` is written at Keep from the question's seed and cleared by
a typed value; frozen at lock (the block then reads the document). Per stage: Saving — full new State Pension from SP
age (`src/utils/StatePensionUtils.js`), 0.5%/yr charges (`Charges.DEFAULT_CHARGES_PCT`), ISA grows as cash
(`IsaGrowth.DEFAULT_ISA_GROWTH`), balanced mix, typical budget tier (`BudgetModel.TYPICAL_TIERS`), yearly check-in,
prices 2.5%; Moving adds the way, go-go/slow-go (`SpendingModel`), tax bands (`TaxYearSetUp.bandsAssumptionText`),
duration; Drawing adds monthly draw cadence. A test reads the constants so the block can never say a stale figure.
**"Answer everything in full"** = `#/plan/<id>/full`: the sub-steps chained about → income → spend → pots → lasts →
way → mix → hold with Next/Back, assumed lines pre-filled and marked, ending "Everything else: Open in Expert". Not a
wizard in words (no progress bar).

## Front door for a signed-in person (`FrontDoor.jsx`, `copy/common.js FRONT :54-84`)

"Your plans" first, each with its stage word and first due; the sign-in line hidden; "Look around an example" reuses
the account's example by `isExamplePlan` (`planWrite.js:1577-1583` makes one per press today). Keep carries the start
stage: B/A → Saving; C → Moving (seed: `retired:true`, `stoppedWork` the month given, `potAtRetirement:null` as
`PlanClose.potsSettings :204`, empty holdings record with `offerDismissed:false`, `stage {key:'moving', by:'byHand'}`);
D → Drawing (first to-do: lock). C and D's Keep ask "Have you taken taxable money from a pension yet? When?" →
`flexibleAccess` (a carried fact, `PlanClose.CARRIED_FACTS :64`) so the MPAA note shows on any plan still paying in.

## Changes agreed after 7.3.0 went live (6 Nov 2026)

**The route, renumbered.** The first visit (the front door, the pictures, no limit on questions without an account;
`mockups/README.md`) comes before the stages: 7.4.0 the first visit; 7.5.0 three stages, by agreement (the section
headed 7.4.0 below); 7.6.0 Standard and Expert; 7.7.0 "we assumed"; 7.8.0 Month by month part 2 with the PDF report;
7.9.0 couples and the long arcs; then 8.0.0. Later the same day "Off course: re-test and recover" (its own section
below) was agreed as its own release straight after the stages, which moves the rest on one: 7.6.0 off course; 7.7.0
Standard and Expert; 7.8.0 "we assumed"; 7.9.0 Month by month part 2 with the PDF report; 7.10.0 couples and the long
arcs; then 8.0.0. The headings below keep their first numbers; read them in this order.

**Drawing while the holdings are not exact (7.3.1).** The mapping table read a retired plan as Moving whenever its
record of what is held did not match the plan's mix exactly (`diffHoldings().complete === false`). Real holdings almost
never match exactly (a rung matures, index ratios move the targets, cash is topped up and spent), so a plan that had been
drawing for a year or more could read Moving for good, with nothing on screen to say otherwise. The rule is now:

| Placing | Stage |
|---|---|
| running / bridge, a month recorded (`decisionTool.history` not empty) | **Drawing**, whatever the holdings say |
| running / bridge, no month recorded yet, holdings recorded and short of the mix | **Moving** |
| running / bridge, otherwise | **Drawing** |

A person recording months is drawing; the word follows what they do. What they still hold differently from the plan is
said, not hidden: on a Drawing plan with a holdings record short of the mix, "Where you are" says how much of the plan's
mix is held and what is different, with the move page one link away. It is information, not a counted to-do and not
the stage. A Drawing plan with no holdings record keeps 7.3.0's lower-ranked "next move" to-do with "Not now". Still
nothing stored, nothing written on open; `deriveStage` unchanged.

**Comparing at the first draw (7.5.0, with the agreement flow).** The point where a person agrees the move is done is
the first draw, and for anyone already drawing, the next visit. One condition covers new drawers, people already
drawing, and months recorded in Expert: *months are being recorded and the holdings have not been accepted*. It shows
as a to-do on the home and, before a first record, in Month by month:
1. **Compare** what they say they hold with the locked plan, in plain words and money: the share of the mix held, the
   rungs or buckets missing or short, and what that means ("a rung is missing, so that year’s income is not
   covered"). Small drift (within the plan's own tolerance) is not a warning.
2. **When the gap is material, offer "Test the plan on what I hold"**: "Does it last?" run on the holdings as recorded,
   read only. A warning alone says the plan no longer matches but not whether that matters.
3. **Choose**: **Carry on as I am** (accept; stored, below); **Finish the move** (the moves stay as to-dos); **Move to a
   new plan** on what they hold (the existing close and carry on).
4. **Store the acceptance** as `transition.finished: { at, how: 'asHeld', heldPct }` (beside 'done' and 'skipped'),
   through the `finish` write kind, its own write, never riding on a month's record (the month identity gate). It is
   the first new thing written to a plan, so it ships with the 7.5.0 write-safety tests listed below.
5. **The move is not one line to follow; it needs buy-in and room to differ.** People move in tranches, pick a
   different fund for a bucket or a neighbouring gilt for a rung, keep a holding they like, or stop part way on
   purpose. Each difference can be accepted on its own ("Keep this as it is"), and the rest left to move; nothing is
   all or nothing. What matters is that they always see the difference: the home and the move page show what is held
   against what was agreed, line by line, with what each difference does (a year of income not covered, more in
   shares than tested), and the accepted ones are marked as theirs, not as things left to do. The stored record carries
   them: `transition.finished.accepted: [{ item, plan, held, at }]`, and an accepted difference can be taken back.
6. **Accepting ends the stage question, not the watching.** The stage never goes back to Moving because holdings
   drift. A new material gap later is a separate, quieter check (at each tax-year set-up), never a change of stage.

## Off course: re-test and recover (agreed 6 Nov 2026; its own release after the stages)

A locked drawing plan is tested before it is locked, and Protection Mode (`ProtectionStrategy.js`: the draw is cut after
three months in a row with the growth pots below their glide paths, until they are back above them plus a buffer) is part
of what was tested. So a dip the plan handles is a dip the plan expected. What is missing: when the pots stay under the
plan's 1-in-10 bad line for a long time, "Where you are" says so (`PlanDocument.whereAmI`, the band verdict) and nothing
more. A saver who falls behind is shown the share of pay that would put them back on course; a person drawing is shown
nothing like it. This release gives a drawing plan the same: notice when the plan as tested no longer describes the
future, test it again from today, and show what each way back does. It can be a large part of what the product is for:
a plan that keeps watching after it is agreed.

### Principles
1. **Never react to noise.** Most dips are inside the band and Protection Mode is already handling them. Asking people to
   act in a normal dip pushes them to sell low. Nothing is said beyond "Where you are" until a trigger below fires.
2. **The first step is a re-test, not a fix.** Often the answer is "it still lasts, at a lower chance", and the person may
   be content with that.
3. **Show what each way back does; never say which to choose.** Options in a fixed order, each with its effect on the
   chance of lasting; no ranking, no "you should". On the worst readings, point to free guidance (MoneyHelper's Pension
   Wise) and regulated advice. Not financial advice.
4. **A locked plan is never changed.** A chosen way back becomes a new plan from today through the existing "Move to a new
   plan" (close and carry on, `PlanClose.js`); the old plan stays as the record of what was agreed.
5. **It works upwards too.** Well ahead of the plan for years is "you could spend more", answered the same way. A feature
   that only ever brings bad news becomes a nag.

### Triggers (derived from the record; read only; thresholds as named constants in one place, tested)
Readings are recorded months only (never a month filled in later, as the band reading already does), against the
locked plan's band (`bandAt`, the √time widening already in it):
- **Below**: the pots under the 1-in-10 bad line at two recorded readings in a row; or Protection Mode on in every
  recorded month of the last twelve (`history[].inProtection`); or under the middle line at the end of three tax years
  in a row.
- **Ahead**: over the 9-in-10 line at the end of two tax years in a row.
- **Gilt ladder plans** (band verdict `gilts-held-to-pay`, a flat band): no band trigger. Their way off course is a
  rung the plan needs that is not held, or cash years not covered: the holdings comparison from 7.5.0, read each tax
  year.
- **Cannot judge**: no pot recorded for six months: the existing to-dos ask for the month / what is held; no trigger.
- After a review (below) the trigger is quiet until the reading is materially worse than at the review (a further step
  down a band, or a new tax year still below), never every month.

### On the home
A to-do ranked after the month to record and before an out-of-date holdings record: "Your pots have been below the
plan's 1-in-10 bad line since {month}. Check the plan still lasts from here." ("Not now" for the window.) Ahead: "Your
pots have been above the plan's 9-in-10 line for two tax years. See what you could spend." Both open the review.

### The review (`#/plan/<id>/review`, a tool page, not a step)
1. **Where you are, as a picture**: the pot over the life, the locked band behind it and the recorded pots drawn as a
   line through it (the mock-ups' "pot over a life"; the line draws itself, the motion rule), the months Protection Mode
   was on marked, the chance it lasts as locked.
2. **Does it still last from here?** The existing test run on the latest recorded pots, from today, for the years left
   (`PlanFromToday.js`, the plan's own way and mix), read only: the chance now against the chance when it was locked,
   and what the bad case leaves.
3. **Ways back, each tested** (the levers `lasts.js` already has, `LEVER_KINDS`): spend less (solved: the draw that
   brings the chance back to the chance it was locked at; also "less for the next few years only"); work a little
   (the existing back-to-work lever); bring in other money (an ISA, cash, a property sale, a pension not yet in the
   plan); change the timing (a pension or the State Pension later); carry on as it is (the chance as it now stands).
   Ahead: spend more (solved to the locked chance), or a one-off spend.
   **Not one line either.** The ways back combine and come in degrees: a little less spending and a year of part-time
   work, a cut for the next few years only, some of a lump sum, or knowingly accepting a lower chance. Each way back has
   its own control (an amount, a number of years), the test runs on the combination, and the screen always shows the
   difference against the plan as locked: the chance then, the chance now, the chance with these changes, and what the
   bad case leaves. The person builds their own way back; we never pick it for them.
4. **Choose**: **Carry on as I am** (stores the review); **Make this my plan from today** (a new plan from today with
   the chosen change: close and carry on, then its own "Does it last?" and lock, as today); **Open in Expert** to work it
   through by hand.
5. **Couples**: the household reading comes first. If the other plan covers the gap, say so before any way back that
   cuts this plan's spending; the household test is one link away.

### Data
- One new stored record, written only by a press on the review: a journey entry `{ event: 'review', at, trigger,
  chanceLocked, chanceNow, chanceChosen, changes: [{ lever, amount, years }], choice: 'carryOn' | 'newPlan' }` through a new write kind `review` held to
  `['journey','lastModified']` (the journey's typed entries and cap fix come with 7.5.0). Frozen when closed. Nothing
  written on open; settings, the plan document and the months byte-identical after a review.
- A new plan from today uses the existing close-and-carry-on chain unchanged (its identity tests as they stand).

### Tests and journeys
- A truth table of the triggers over band × months × Protection × tax years × ladder × reviewed (no cell writes).
- A new fictional fixture (Alex, a drawing plan with two years of recorded months through a fall) and an "ahead" twin.
- Journey j-off-course (signed in): the home shows the to-do → the review → the re-test → spend less, solved → Carry on
  as I am (the review stored; the to-do quiet; a materially worse month brings it back) and, on a copy, Make this my
  plan from today (the old plan closed and read only, the new plan from today locked after its test). A ladder plan
  never gets the band trigger. A couple whose other plan covers is told so first.
- Words: banned list, no recommendation words ("should", "best", "recommend") on the review; the guidance line on the
  worst readings.

### Later
The PDF report (Month by month part 2) carries the reviews as part of the plan's story; the paid report's AI narrative
(to-do in `mockups/README.md`) can explain a review in plain words, with the same advice boundary.

## The route

Every release: full vitest (Node 24 + 20), Playwright at desktop-1440/phone-390, `npm run e2e:signed-in`
(emulator; new specs named below), the rollback-layout check, the privacy scan (no real figures; Alex and Sam), a note
in `src/releases.js` in our voice. Each release ships alone; the live site works at every step.

### 7.3.0 — The plan home (reads only; zero data risk)
- **Journeys**: j4-home-drawing (fixture 04 signed in: root → home → "Record October" → tool → record → home says
  nothing due until 1 November; reload reads the same; settings byte-identical), j5-home-saver (fixture 05: lands on the
  home not the form; pot/check-in due first; no "For later" marks on a locked plan; after recording, dated nothing-due),
  j2b updated (lands on the home).
- **Screens**: `HomeScreen.jsx`; `PlanScreen.jsx:149-151`; `MonthScreen`/`CheckInScreen` gated; `LastsScreen`/`read.js:552`
  pushes collapsed; `PlanRail.jsx` loses "Ask a question" and reads `dueFor[0]`; `PlansScreen` rows show the stage
  word and "N to do"; `place.js` lands on the home; `steps.js` gains `home` first in every list (`routes.js PLAN_STEPS`).
- **Readers**: `src/answers/plan/home.js homeOf`, `dueFor` beside `nextFor` (`read.js`), `stageOf` (derived only;
  `invite` computed but the agreement flow ships in 7.4.0 — the to-do links to About's stop question until then),
  `src/v7/copy/home.js` (P.* sentences kept word for word so fixture pins hold), cadence honoured in `month.record`.
- **Data**: none. Assert `ALL_WRITES` byte-unchanged.
- **Tests**: `tests/v7/plan/home.test.js` (every fixture × three dates → ordered to-do ids; `nextFor === dueFor[0]`
  on every fixture; nothing-due never null for a drawing plan; banned words over `copy/home.js`); `stages.test.js`
  gains the three-word column + STEPS pins retaken (`:96-109`); render states `home-{saving,locked-saver,moving,
  drawing,draft-retired,closed}` in `tests/v7/states` (VERSION restamped as always); gate 2 (stored plan
  byte-identical after browsing) on all fixtures; `e2e/plan-home.spec.js` both widths.
- **Must not break**: every saved link (`#/plan/<id>/month` still the tool); j1–j3; the classic page byte-unchanged.
- **Rollback**: redeploy 7.2.1; nothing stored.

### 7.4.0 — Three stages, by agreement
- **Journeys**: j6-agree-to-move (fixture 05 with the clock 6 months before its stop: invitation on the home → Plan the
  move → confirm stop → Does it last? → Lock as my drawing plan → Moving home, `agreedMove` read back, Stress settings
  byte-identical; a second copy declines → unlocked, About on the stop date, relock → invitation returns at the new
  stop − 12 months), j7-finish-move (03 at its stop: Moving home, ticks, "The move is done" → Drawing; Undo → Moving;
  13: "I'm not moving anything" → Drawing), j8-stopped-unlocked (an unlocked saver past its stop: "I have stopped" →
  `aboutPatch` writes `retired/stoppedWork/firstTaxYear` to the stop's year; on fixture 19 `firstTaxYear` is the stop's
  year, not 2028), j9-two-apps-one-plan (Standard finishes the move; Expert opens the plan, shows the same word, writes
  nothing (`plansOf` before = after); Expert ticks the last line → Standard offers "finished?" rather than advancing;
  the 7.3.0 rollback layout opened on the same plan records a month and leaves `transition.finished` intact).
- **Screens**: `#/plan/<id>/move-on` (new `AgreeScreen.jsx`); the invitation on the home; `MoveScreen` gains "The
  move is done" / "I'm not moving anything"; "Change the plan" gains "I'm moving my money now" / "The move is not
  finished after all"; Keep carries the start stage (C's seed; D's first to-do the lock); `LockScreen` says which
  stage the lock leads to.
- **Data**: `accumulationTool.agreedMove` (in `LOCK_WRITES` only); `transition.finished` via new `finishMove`/
  `unfinishMove` + planWrite kind `finish` held to `['transition','lastModified']`; root `stage` (by-hand only) + kind
  `stage` held to `['stage','journey','lastModified']` with a typed journey entry; `FROZEN_WHEN_CLOSED` + `stage`,
  `accumulationTool.agreedMove` (`PlanClosed.js:135`); `writeNeedsGuard` (`LockedPlanGuard.js:262`) gains
  `writeTouchesStage` so the store refuses it on closed plans from either app; `copyOf` (`PlanCopy.js:48-77`) drops
  `stage`, `transition.finished`, `agreedMove`; `successorOf` (`PlanClose.js:330-380`) already deletes `transition`;
  `migrations.js protectedParts` + the three; classic `ScenarioRepository.saveActiveTransition` already writes
  `transition` whole (Expert gets the same two buttons on its Transition tab via `src/ui/transitionFinish.js`, no
  inline growth); after a classic first record, `index.html:5736-5745` calls `refreshLifeStage()` in place of the chip
  line (so the chip and strip refresh; no growth).
- **Journey cap fix**: `journeyAppend` entries gain `event`; `event:'arrival'` exempt from the 40 cap; `read.js:779`
  stops grepping notes.
- **Tests** (must exist before this ships): the truth table over override × placing × locked × hasRecords × finished ×
  closed → stage, asserting no cell writes; settings/document/history byte-identical after N stage writes on fixtures
  03/04/05/13/18/19 (`decisionSettingsChecksum` equal); property: every planWrite kind's written keys ⊂ its declared
  list ⊂ `ALL_WRITES`, and every `A.PLAN_*` action maps to exactly one list; `T.stopped` patch equals `aboutPatch`;
  store refusal of `stage`/`transition` on a closed plan from the classic path (`tests/lockedPlanStore.test.js`
  pattern); Undo of each new kind leaves the plan readable (`null` root keys read as absent, `planWrite.js:572`);
  identity gates re-run with pins NOT retaken (`lock.test.js:81/:129` and `planWrite.test.js:659` retaken on purpose
  for `agreedMove` in `LOCK_WRITES`); `checkIn.test.js:120-125` retaken for the one-flag rule.
- **Must not break**: `deriveStage` (pinned, unchanged); the close chain; `monthIdentity`, `holdIdentity`.
- **Rollback**: 7.3.0 shows a finished plan as Moving again (ignores `finished`); 7.2.1 ignores all three keys
  (`normalizeScenario` keeps unknown roots).

### 7.5.0 — Standard and Expert
Mode preference, header "Open in Expert" as a visit, `landingFor` honouring Expert, `expertHome.js` in the banner mount
with the strip on load, `PLACES` additions, every rename, `banned.js` entries, `expert-unchanged.spec.js`.
Journey j10-expert-round-trip (set Expert → root lands in Expert signed in on the last plan with the same to-dos →
"Standard" → home; "Open in Expert" from the move step lands on the Transition tab; a visitor's `pt_mode` stays in
the window). Rollback: 7.4.0 ignores `mode`. Supersedes `research/v7/after-7.md` §4 ("classic retires") and
`road-to-7.md` decision 5.

### 7.6.0 — "We assumed", answer everything in full, a front door that knows you
`sourceOf 'assumed'`, root `assumed` map (new `ASSUMED_WRITES` riding each step's write and the create; frozen at lock),
`#/plan/<id>/full`, the signed-in front door, the example reused, `flexibleAccess` asked at C/D Keep, sign-in on a new
device landing on the home. Journeys j1 extended, j11-front-door-signed-in, j12-assumed. Rollback: reads only but the
`assumed` key (ignored by 7.5.0).

### 7.7.0 — Month by month, part 2
`months-in-v7.md` §4 as written: cadence on the tool (quarterly/yearly batches), "Your months" against the plan, delete a
month, the spreadsheet per tax year, print/PDF of the document, changing a set-up year. `monthIdentity` extended to
batches/delete/re-set-up. Ledger rows `month.cadence/history/exports/tax-year` → built. "Open in Expert" becomes a
choice, not a need. Decide here whether to-do dismissals persist (`tasks` root, whole-object, frozen when closed).

### 7.8.0 — Couples and the long arcs
The partner's due lines and the "Together" line on the home; `T.split`; mixed-stage pairs (j13-couple-home on
fixtures 09/10 and a derived pair); back to work from the Drawing home → Saving home with the MPAA note (j14 on
fixture 19); the closed plan's home; `income.starts`; the calendar offer for savers.

### 8.0.0 — One product
No new behaviour: parity ledger rows built or marked `expert` by design (cones, gilt calculator, illustrative ladder,
strategy pages' three real starts, Reset, tools on/off, admin, the rotation guided switch); research notes
(`after-7.md`, `road-to-7.md`, `months-in-v7.md`, `plan-start.md` §8) get "as built" notes; the 8.0.0 note lists every
rename with its reason. `/classic/` stays.

## Critical files
- `src/services/LifeStage.js` — `stageOf` (new) beside `deriveStage :83`, `arrivalCheck :281`, `journeyAppend :333`, `openingTab :178`
- `src/answers/plan/read.js` — `dueFor` beside `nextFor :771-859`; `firstGap :216`, `sourceOf :193`, `monthStep :251`, `whereStep :292`, `checkinStep :599`, `householdStep :739`, `:902` marks
- `src/answers/plan/home.js` (new), `src/v7/screens/plan/HomeScreen.jsx` (new), `AgreeScreen.jsx` (new), `src/v7/copy/home.js` (new)
- `src/answers/plan/steps.js` (`STEPS :24-36`, `laterFor :65`), `src/v7/router/routes.js`, `src/v7/screens/plan/PlanScreen.jsx:149-151`
- `src/answers/plan/lock.js lockPatch :72-109` (+ `agreedMove`), `about.js aboutPatch :280-297` (the stopped write)
- `src/answers/plan/schema.js` — `LOCK_WRITES :383`, `MOVE_WRITES :730`, new `FINISH/STAGE/ASSUMED` lists, `ALL_WRITES :931`
- `src/services/LockedPlanGuard.js` — `writeNeedsGuard :262`, new `writeTouchesStage`, keys lists beside `MONTH_KEYS :143`
- `src/services/PlanClosed.js FROZEN_WHEN_CLOSED :135`; `PlanCopy.js :48-77`; `PlanClose.js successorOf :330`; `migrations.js :77-89`
- `src/services/TransitionPlanner.js` — `finishMove`/`unfinishMove` beside `tickMove :319`, `diffHoldings :185`, `progress :331`
- `src/v7/effects/planWrite.js` — kinds `finish`, `stage`; `:572` null-on-Undo; `:1565-1591` example reuse
- `src/v7/effects/place.js :50-65, :121, :133-138`; `src/v7/effects/account.js :102-112, :227-240`; new `effects/mode.js`
- `src/services/OpenPlace.js PLACES :33-58`; `src/ui/expertHome.js` (new) replacing `index.html:6896-6920`; `src/ui/classicName.js`; `vite.layout.js :128-140`
- `src/v7/copy/banned.js`, `common.js :27-39, :54-84`

## Verification (end to end)
1. Unit: `npx vitest run` on Node 24 and Node 20 — the new truth table, settings-pin, write-kind property, home
   ordering and identity gates all green; pins retaken only where named above.
2. Browser: `npm run e2e:build` then Playwright at desktop-1440 and phone-390, including `plan-home.spec.js` and
   `expert-unchanged.spec.js`.
3. Signed in: `E2E_PORT_PROD=4295 npm run e2e:signed-in` — j1–j3 plus the new j4–j14 as each release adds them;
   j9 proves two apps on one plan never disagree and never write on open.
4. Rollback layout: `LAYOUT=preview SITE_OUT=<scratch> npm run build` + its specs.
5. Privacy scan (`diffscan.py --cached`) before every commit; no real figures.
6. Live after deploy: the `RELEASING.md` checks, then a guest walk of the home on the example plan at both widths, and
   a walk of a real locked plan signed in.

## Still open (not blocking 7.3.0)
- Whether to-do dismissals should persist across devices (a `tasks` root key, 7.7.0) or stay per window.
- The rotation guided switch: Expert-only by design (it writes frozen settings), named in the ledger as the one exception.
- Expert users who never open Standard: their plans still reach Moving/Drawing through the same Transition-tab buttons;
  Expert shows the same to-dos; they are asked their mode once by the strip.
