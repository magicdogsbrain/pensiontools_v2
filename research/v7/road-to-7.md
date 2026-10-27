# The road to 7.0: moving completely to V7 (21 Oct 2026)

The owner, 21 Oct 2026: "Review where we are and move completely to v7. Go through all steps necessary to get there."
This is the plan for that: where V7 stands, the steps left, what each builds and writes, the gates the switch must pass,
and the decisions taken on the way. It follows the road the owner approved on 17 Oct (v6-usability-audit.md §4) and the
cutover rule of architecture.md §3.9. Earlier documents stay the designs; this page is the order and the checklist.

---

## 0. Where we are

**Done (6.23.0 – 6.31.0, 17 Oct):** road steps 1–5.

| # | Step | Release |
|---|---|---|
| 1 | Fix release in the planner (15 audit decisions) | 6.23.0 |
| 2 | One "will it last" answer per plan | 6.24.0 |
| 3 | Who draws what, and the pooled household verdict | 6.25.0 |
| 4 | "Your plans" and "Your plan" in V7, read-only, on a rail for every life stage | 6.26.0 |
| 5 | Editing in V7: About you and when; Money that comes in anyway; What you spend; Your pots and tax; Does it last? | 6.27.0 – 6.31.0 |

**Done while V7 was paused (6.32.0 – 6.37.0, 18–20 Oct):** the strategy-blind sweep — every check through each plan's
own test (survivor, care, Scenarios), a guard test against direct engine calls, no percentage that rounds across a verdict,
unpaid rungs at accreted value, the money left over paying a rotated year, the couples check seeing every strategy's cut.

**What V7 has today** (`/v7/`): the front door and questions C, A and B with Keep; `#/plans` and `#/plan/<id>` on ten rail
steps (month, where, plan, pot, saving, budget, lock, hold, move, household) — each read-only but for the five editing
sub-steps under "Your plan" (`/about`, `/income`, `/spend`, `/pots`, `/lasts`); the one test in V7's own worker.

**What still happens only in the planner:** locking, unlocking and the plan document; question D; the nine strategies,
the mix and Try a change; the household; what you hold and the move; Month by month; plan actions (new, rename, copy,
download, delete); the account page; the guest meter; What's new; the example plan.

**Parity ledger** (`tests/v7/parity/ledger.json`, 174 rows): 78 built, 40 designed, 46 planned, 10 retired. Each step
below names the rows it closes; the switch needs no planned row left.

---

## 1. How the run works

- **One builder at a time.** Each step is one worktree agent with a written brief; the lead reviews, merges (merge, never
  rebase), builds, runs both suites, releases and deploys. Each step is its own release (6.38.0 onward) and goes live at
  `/v7/` as it lands, so the owner can look at each piece. 7.0.0 is the switch.
- **The pattern of steps 5a–5e holds:** a pure reader/writer under `src/answers/plan/`, a screen under
  `src/v7/screens/plan/`, the step's declared field paths in `src/answers/plan/schema.js`, every write through
  `src/v7/effects/planWrite.js` past the lock guard, the boundary rules (tests/v7/boundaries.test.js), a render test, a
  property test on the writes, a browser spec, the banned-words check, the ledger rows flipped to built, a release note.
- **Figures:** every "will it last" figure comes from `stressTestStrategy` through `OneAnswer` (tests/oneTestOnly.test.js);
  a locked plan is never changed; an absent setting means the old behaviour; nothing is deleted automatically.
- **The repository is public:** no owner names, dates or figures; fixtures are Alex and Sam; the owner's plan stays in
  `tests/fixtures/local/`.
- **Cost, stated plainly:** each step is roughly half a million to a million and a half tokens of agent work; the whole road
  about six to nine million. Every release stands on its own, so the run can stop after any step.

---

## 2. The steps

### Step 6 — Lock as a step; "Your plan as locked"; "Where you are" (6.38.0)

The design: v6-usability-audit.md §2.6; your-plan.md §1.3, §7 and owner question 4(a); rail-screens-language.md §1.6;
the write rules of editing-in-v7.md §1.

- **`#/plan/<id>/lock`**, the "Lock the plan" rail step made real. It says three things in plain words: what the lock
  fixes (the plan's settings, both tools); what stays changeable (records, what you hold, the budget, how often you draw,
  what you pay in); what you get (the plan document, "Where you are", month-by-month records). One button: "Lock this
  plan". A saver may lock while still saving (the plan then follows the pot each month).
- **Locking in V7** runs the plan's one test in the worker (lastsRun), builds the plan document with the planner's own
  `buildPlanDocument`, and writes in ONE update: `planDocument`, `decisionTool.settings.locked / lockedAt / lockedBy`
  ('v7-lock'), `decisionTool.planOfRecord` (the planner's yardstick, `buildPlanOfRecord`'s shape), and the `journey` date —
  the same fields the planner's lock writes, declared as `LOCK_WRITES`.
- **Unlocking in V7**, once only, on "Your plan as locked" (question 4(a)): the document goes to `planDocumentArchive`
  (last ten), the plan of record to its archive, `locked: false`, `unlockedAt`, `unlockCount + 1` — the planner's
  `unlockPlan`, field for field, after a confirm that says what unlocking keeps.
- **"Write a new version from today's settings"** on a locked plan, after a confirm that says the current document is kept
  as a past version: the document goes to the archive (last ten) and a new one is built and written, as the planner's
  own button does.
- **"Your plan as locked"** opens on sentences: the money before and after tax by age, the State Pension and whether it
  is assumed, the bad case, the rules for cutting income. It reads the document only (already so since 6.26).
- **"Where you are"** compares like with like: taken so far, what the plan said for those months, the difference and
  its cause (a cut, in pounds) — dates, never a countdown.
- Ledger rows closed: `s5-lock` (2), `s4-open-plan` document rows, `s1-safety`.

### Step 7 — D, and V7 makes its own plans (6.39.0)

The design: answer-D.md (minus §9's hand-over), v6-usability-audit.md §3.3, the 2 Oct decisions (D gives its own verdict
and an explanation line against a locked plan, never suggests unlocking, includes "shares fall by a fifth").

- **D is the retired person's way in.** From the front door: with a plan in the account or window, D opens it at
  `#/plan/<id>/lasts` (a list to pick from when there are several). With no plan, D's short first form — age, stopped
  when, the pots, what comes in anyway, what you take a month — then the answer, then Keep. As built (21 Oct): with a plan, D's form is
  headed by a "You have a plan already" block linking each plan's own test rather than a redirect (the front door does
  not load the plan source); the spending is on the one form, so D's rail is numbers → answer → keep.
- **"Does it last?" gains D's three levers**, try-only, run in the worker on a copy of the plan: "Could I spend more?"
  (the most the plan pays and still lasts in 9 futures out of 10), "Would some work help?" (£X a month for N years),
  "What if shares fell by a fifth?". On a locked plan the levers run against today and the document's figure stays
  beside them.
- **V7 makes a plan itself.** Rule 3c of the boundary test widens by one name — `addDoc` (chosen over `setDoc` on 21 Oct:
  it cannot replace an existing document by construction): `planWrite.js` may `addDoc` a NEW plan
  under the account (create only — a property test proves the id is fresh and no existing plan changes), or add one to
  this window's list (up to three without an account). Keep for A, B, C and D goes through it; the seed hand-over to the
  planner (`src/v7/effects/planSeed.js`, `#new-plan`) is retired. One way to make a plan.
- **A, B, C and D's Keep end with "Lock this plan?"**, a link to the new plan's lock step (step 6's screen), now that V7
  knows the plan's id.

### Step 8 — Way of drawing, mix, and Try a change (6.40.0, 6.41.0) — the largest step

Design first, short: `research/v7/way-and-mix.md` — E's answer contract (all nine strategies answer in V7's one verdict;
the score under "More columns"), the cards, each strategy's dials with one set of defaults, how a switch keeps each
strategy's own inputs (`StrategyState.switchStrategy`), and Try's "What's different".

- **8a `#/plan/<id>/way`:** the nine strategies as cards, ranked by futures out of 10 on THIS plan (the one test per
  strategy in the worker, `deriveCompareConfigs`); opening one shows all its dials; "Use this way of drawing" writes
  `stressTool.settings.strategyId`, `strategyParams` and `strategyState` as the planner's switch does. Locked: try-only.
- **8b `#/plan/<id>/mix`** and **Try a change on a plan:** a risk level or your own split; funds to test (typed or pasted,
  every line counts, per strategy); diversifiers and the bond tent with "what it does in a bad case"; "Which mix lasts
  best?" with your own split first. Try: every field of today's Try over the full length, "What's different", then "Use
  this" (unlocked) or "Keep as a separate plan" (step 7's create).
- The cheap `shape-next` rows ride along: the layers and the budget mark on the spend picture, the lump-sum marks.
- Ledger rows closed: the `s8-e` strategy, mix, funds, bond tent, optimiser, Try and schedule rows (about 25).

### Step 9 — Your household in V7 (6.42.0)

The design: v6-usability-audit.md §2.10; your-plan.md §6; household-draw-split (built in the planner, 6.25.0).

- **`#/plan/<id>/household`:** link a partner's plan (`household.partnerScenarioId`, either way); the pooled verdict
  first (`combineHouseholdStrategies`), each plan alone second; **Who draws what** (`householdDrawSplit`,
  `applySplit` — copies when a plan is locked); the survivor and care questions in ages on each plan's own test
  (`runSurvivorCheck`, `runCareCheck`); one budget shared, with "Keeping money separate?" as the option. Guests can use
  all of it; the last result is kept, dated.
- Ledger rows closed: the `s9-switch` survivor and care rows; the budget's who-pays rows (`s8-e`).

### Step 10 — What you hold, and the move (6.43.0; design first)

Design: `research/v7/holdings-and-move.md` — the owner's ruling that the tested fund list is never what you hold
(scenario.holdings is the one ledger), every pasted line counts ("What is this?" for a line it cannot place), the move is
optional and says what skipping costs, a saver sees where new money goes and no "buy now" until about five years out,
the order sheet waits for the person's own State Pension figure.

- **`#/plan/<id>/hold`:** the ledger line by line by wrapper, typed or pasted; **`#/plan/<id>/move`:** the buy and sell
  list against the plan's mix, the cash to hold, the schedule and tick-offs; for a ladder plan the gilt order sheet and,
  for ladder + rotation, the rotation watch and the guided switch.
- Ledger rows closed: the `s8-e` holdings, move, ladder-cost, order-sheet and rotation rows.

### Step 11 — The shell for 7.0 (6.44.0, 6.45.0)

Everything a person needs so that the planner's page is no longer on their path. Built in two halves, each under its own
release and brief, and cited as such ("step 11a", "step 11b") in the code, the tests and the ledger:

- **Step 11a — the shell (6.44.0):** the plan actions on "Your plans", the account page, the visitors' hours and the
  hand-over, the read-only example, What's new, the name "Drawdown Planner" (ledger step `s11-shell`).
- **Step 11b — the remaining rows (6.45.0):** every planned or designed row the ledger still had — the budget on a saved
  plan, "What you pay in", the out-of-date draft, the State Pension date, where a lump sum lands and a lump sum into the
  steps, the years one by one, the pots' floors and the named stresses on "Does it last?", "Assumptions and data"; the lock
  and month-by-month rows built on the classic page by the owner's decision; two retirements (ledger step `s11-rows`).

- **Plan actions on "Your plans":** new, open, rename, make a copy, download, open a downloaded copy, delete (rule 3c
  widens once more: `deleteDoc` of one plan, after a confirm that names it).
- **An account page:** email, password, "Download everything", "Delete my account", the privacy policy; sign-in and
  sign-up in V7's own words; the idle sign-out as now.
- **Visitors:** the guest meter in V7's shell (three active hours, the reminders, the hand-over into an account on
  sign-in), up to three plans without an account, "Look around an example" read-only.
- **What's new:** the once-only pop-up and the page, from `src/releases.js`, `lastSeenVersion` as now.
- **The name:** "Drawdown Planner"; the page title; the manifest.
- **Month by month stays on the classic page** (owner, 17 Oct), reached from the rail's "This month" and "Set up the tax
  year" through the existing hand-over (OpenPlace), with its 6.23.0 fixes.
- **The budget's remaining rows** (the walk-through, fill the blanks, break a line down, sums in a box, a line from or
  to an age, the spreadsheet in and out): each gets its V7 home here or a retirement with a release note.
- Ledger rows closed: `s9-switch` (the rest), the budget rows of `s8-e`.

### Step 12 — The switch: 7.0.0

**Gates, all of them (architecture.md §3.9):**

1. The twelve committed fixtures and the owner's local fixture give identical figures through the classic path and V7's,
   to the pound (tests/v7/cross, e2e/sameness.spec.js, the lasts-in-Node checks).
2. A stored plan is byte-identical after being opened and browsed in V7.
3. Every rail step of every stage has a screen; `NotBuilt` is unreachable from a plan.
4. The parity ledger has no planned row: each is built or retired with a release note.
5. The owner has used V7 for one real monthly record (through the rail's hand-over to the classic page).

**Mechanics:**

- V7 builds to `docs/` (the root); the classic app to `docs/classic/`. A "Use the previous version" link stays for at
  least two releases. The classic page is deleted only when the owner says.
- **The service worker is the real hazard:** `docs/sw.js` caches the classic page at the root on every installed phone.
  7.0.0 ships a new `sw.js` with a new cache name that drops the old caches on activate and serves V7 network-first; a
  phone with the old worker gets V7 on its next open. Tested in the browser suite with a planted old cache.
- `manifest.json`: the name and `start_url`; `_headers`: `noindex` moves from `/v7/*` to `/classic/*`; the CSP is the
  same on both.
- The browser suite: `production.spec` runs at the root, `old-app-unchanged.spec` at `/classic/`; the GitHub Pages
  mirror follows `docs/` as now.
- The release note for 7.0.0 lists everything retired, with its reason.
- Rollback: swap the two outputs back from the same commit and deploy. Never redeploy an older build.

### After 7.0 (not in this run unless the owner asks)

Month by month rebuilt in V7 (then the classic page can go); question F; property and equity release; the annuity
comparison; the trust pages.

---

## 3. Decisions taken for this run (the owner can overturn any of them)

1. **V7 makes, copies and deletes plans itself** from step 7 (create) and step 11 (delete); each new Firebase name gets
   its own property test. The seed hand-over to the planner goes. Reason: at 7.0 the planner is off the path.
2. **Unlocking lives in V7**, once only, on "Your plan as locked" (question 4(a)); the same reason.
3. **All nine strategies answer in V7's one verdict** (the 2 Oct decision); the score stays under "More columns".
4. **Month by month stays on the classic page at 7.0** (the owner's 17 Oct decision); it is rebuilt after.
5. **The classic page stays at `/classic/` for at least two releases** and is deleted only when the owner says.

---

## 4. The order, the releases, the gates

| Step | Release | Builder | Gate before the next step |
|---|---|---|---|
| 6 Lock | 6.38.0 | one agent | both suites green; a plan locked in V7 reads in the planner as one the planner locked |
| 7 D + create | 6.39.0 | one agent | a plan made by V7 opens in the planner unchanged; the seed path gone |
| 8a Way | 6.40.0 | design (lead), one agent | the nine cards equal the planner's ranking on the twelve fixtures |
| 8b Mix + Try | 6.41.0 | one agent | Try equals the planner's Try to the pound |
| 9 Household | 6.42.0 | one agent | the pooled verdict and the split equal the Household tab's |
| 10 Hold + move | 6.43.0 | design (lead), one agent | the ledger round-trips byte for byte |
| 11 Shell | 6.44.0 | one agent | no planned row in the ledger |
| 12 Switch | 7.0.0 | lead | the five gates of step 12 |

Progress is logged in v7-plan-of-plans.md §9 as each release lands.
