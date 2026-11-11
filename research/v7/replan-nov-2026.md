# PensionTools: one plan, three phases, two views, as much detail as you like

A re-plan written on 10 Nov 2026 after a research pass (UK forums, regulator, adviser practice, the UK tool market,
privacy attitudes, adviser Monte Carlo practice) and three read-only maps of the code as it stands at 7.6.0 live /
7.7.0 merged-but-unpushed. It replaces the 6 Nov design's route from 7.8.0 on. It is written for Opus to build from,
release by release. Every example is fictional (Alex, Sam). Nothing in it is shaped to one person's plan.

## 1. Context: what went wrong, and what the research says people need

**What we concluded (10 Nov).** The last fortnight's What's new reads as reactions to single cases, not product thinking. The
Standard/Expert split asked for on 6 Nov was never built; the site still says "new version / previous version".
People should be able to use the product without telling it exactly what they hold (amounts and rough asset classes
are enough); forcing holdings in alienates the privacy-conscious. A different asset mix from the strategy, or a
tactical trade, must never mean "abandon the plan". The transition "lasts forever and hangs over you, telling you to
do things you have already done". A plan should have three phases a person can enter at any point: Saving (am I
buying the right assets, on track, should pay-ins change?), Moving (a 1–5 year window before the stop: am I moving
the right mix at the right time, on track to finish?), then an explicit agreement to the new risk (running out AND
dying rich), then Drawing (on track? how is the glidepath? which pots pay?). An adventurous saving strategy with a
gilt-ladder drawing strategy must be allowed, and a change of mind at any time with the new risk/reward accepted.
We are deciding whether the site earns its keep.

**What the code maps found (the causes, not the symptoms).**
- The stage is derived from holdings: `stageOf` (`src/services/LifeStage.js:186-209`) reads Moving from
  `diffHoldings().complete === false`, so any drift reopens the move for ever. Nothing about phases is stored; the
  6 Nov design's agreements (`agreedMove`, `transition.finished`, `stage`) were never built.
- The move fights real portfolios: `targetMix` has no diversifier bucket so held diversifiers are always a "sell"
  (`src/services/TransitionPlanner.js:518`); a multi-asset fund whose bucket is unknown is counted as 100% shares
  (`:499`); the tolerance is 2% (`TRANSITION_TOLERANCE :27`) where advisers use 5–10 point bands; the pot target is
  the *projected* pot at retirement (`:315`), so a saver sees "short by" against today's smaller pot; tick-offs in
  `transition.done` never expire, so drift turns a done move into "update what you hold" (`read.js:853-897`); two
  to-dos (`hold.gap`, `hold.keepTest`) cannot be dismissed, and the three dismissals that exist live in
  sessionStorage and come back on every device.
- Three unaligned clocks: 5 years "approaching" (`APPROACHING_YEARS`), a 12-month invite, a 10-year modelled slide
  (`SAVING.slideYears`, `src/answers/shared/rules.js:51`). No transition window exists.
- Saving has no strategy of its own and the saver's verdict always runs pots-and-valves
  (`src/answers/shared/toEngine.js:346`, `src/answers/b/answer.js:593`) whatever drawing strategy the plan chose.
- Success = never running out before a fixed age (95 by default; `schemaParts.js:206-210`), "careful" = the 10th
  percentile; one dollar short at 94 counts the same as running out at 75.
- The engine never needed holdings: a plan can be kept, locked and run month by month on a total and a risk level
  (`PlanFromSeed.js:652-666`, `lock.js:65-68`, `MonthlyEntry.js:16-24`). Only a thin layer (the move's diff, two
  nags, the home's "recorded" flag) assumes a holdings record. Standard/Expert: nothing built; `pt_mode` and
  `'expert'` appear nowhere in `src`.

**What the UK research says (sources in `research/v7/what-success-means.md` and the research pass of 10 Nov; a
summary with every URL is to be committed as `research/v7/uk-lifecycle-research.md` in release 1).**
- *Savers* ask "am I on track?", "how much should I pay in?", "what do I do after a bad year?", "what is my default
  fund doing?". 60% don't know their pension is invested (HL/Opinium 2025); 38% don't know their contribution
  (FCA Financial Lives 2025); 33% think the 8% auto-enrolment minimum is a recommendation (Invesco/Nest Insight);
  people describe a pension as provider + fund name + risk number + % split + total, never tickers; they want an
  income in £/yr, not a pot; "you can" works, "you should" does not; fear of mistakes is why the 94% in a default
  do nothing (DWP/Ipsos; TPR 2026).
- *Movers and drawers*: drawdown dominates (401k new drawdown plans vs 100k annuities, 2025/26, FCA); half of
  regular withdrawals run at 8%+ while a quarter of £250k+ pots are drawn under 2% (FCA/IFS); the real questions
  are the cash buffer in years, the bridge to State Pension (gilt ladders now mainstream, "never too late"), SIPP
  vs ISA against the personal allowance, taking one annual withdrawal then living from cash; 26% never review
  (AJ Bell); people prize ownership of their holdings and distrust being moved into "collectives" ("It is YOUR
  SIPP", MSE).
- *Advisers* run one continuous annual review whose agenda changes by phase (PFS/Defaqto); off-course is a firm
  rule (success below 80%, or guardrails 20%/10%), not regulation; lifestyling that starts 15 years out is
  criticised, compressed 5–10 year glidepaths with a chosen end target (drawdown/annuity/cash) are the direction
  (Hymans, Monevator); capacity for loss is calculated separately from attitude to risk; the FCA's cashflow guidance
  (2024) names the stress tests: a fall at the start of drawing, lower real returns, lower-percentile outcomes,
  higher withdrawals; model in real terms, net of tax, to a survival-probability age, for the longer-lived partner;
  its poor-practice example is "95% chance to average life expectancy" (TR24/1).
- *Success in Monte Carlo terms*: no UK regulator or vendor sets a number; Timeline's consumer guide says
  80–90%, UK planners 80–95%, US practice ~80% (Blanchett) with 70% "imprudent"; Timeline weights each run by the
  chance of being alive at the run-out age so a late shortfall counts for less (fixed-horizon 95% ≈ 99% weighted;
  Kitces); coverage ratio (Estrada) and goal completion (Blanchett) say a plan that funds 27 of 30 years is 0.9,
  not 0; the State Pension is ~47–50% of over-70s income (Quilter 2025) and with an inflation-linked floor covers
  essentials for ~9 in 10 households (HL/Oxford Economics 2026); a high headline pot reduces the number who engage
  at all (Goldin et al.; PensionBee on the RLS "£328,000 … many will wince").
- *Tools*: no UK consumer tool asks for holdings; provider calculators take a pot and one growth rate and ignore
  tax; Guiide (4.7/5) wins on a guided plain-English flow and loses on rigidity and no couples; EvolveMyRetirement
  (3.2/5) lost trust as a black box; adviser tools cost £150+/month; forum users fall back to US simulators and
  spreadsheets and complain about US data, no tax, no couples, no lump sums; only one beta tool tracks a plan
  against actuals. **Nobody offers a free, transparent, UK-data, couples-aware, asset-class-level plan explained in
  plain words and tracked against the person's own figures once a year.**
- *Privacy*: ~70% say they are unlikely to share financial data with third parties (Which?); spreadsheet users want
  control and export; trust signals are who runs it and why, no sales motive, data in London, never sold, no
  bank/platform linking, no account needed to look, export; user-input generic tools are outside FCA advice (PERG 8,
  FG15/1) so long as nothing names or ranks products and nothing says "you should".

**The honest answer to "is there anything useful here?"** Yes, but only once the next three releases ship. The
engine (historical cohorts since 1871 + bootstrap, UK tax, couples, gilt ladders, Protection Mode, a plan document and
monthly record) is ahead of every free UK tool. What is missing is the product around it: a success definition
advisers would recognise, a review loop instead of a nag, intake that takes what people are willing to give, and two
views of one plan. After releases 1–3 the site is the only free UK tool that says in £/yr whether the money lasts as
long as you do, shows the FCA's bad years as buttons, takes a rough asset mix, and checks your own figures against the
plan once a year. If only those three ship, it is still worth the domain.

## 2. Product principles (each tied to a finding; these govern every brief)

1. Answer in £/yr against the Pensions UK living standards (2026: single £13,900 / £32,700 / £45,400; couple
   £22,500 / £45,400 / £62,700, after tax, no housing) and the person's own aim; never a single pot headline.
2. Take a pension the way people describe it: provider, fund name as printed, risk number, % split, a total, and
   "I don't know what it's in" as a valid answer. Tickers and pasted holdings are optional, later, and say what they buy.
3. Show the range and name the assumptions in plain words beside the result, never on another page.
4. The review loop is yearly and triggered (tax year, new job, milestone birthday); monthly logging is opt-in.
5. The bridge to State Pension is a first-class object for everyone: years to pension access age and to State
   Pension age per partner, and the three routes people use (cash/gilt ladder, fixed-term annuity, front-loaded draw).
6. "Am I drawing too much?" is two-sided: the running-out risk and the likely-unspent-at-death figure, always together.
7. Couples and UK tax are the bar: both personal allowances side by side, lump sums, DB with and without indexation.
8. Holdings belong to the person: a kept share, trust or gilt is an input to the test, reported as risk and accepted,
   never nagged about or listed as a sale; the test is available on any plan, locked or not.
9. The lifestyling glidepath the person is already in is an input; de-risking follows when the money is needed.
10. The FCA's stress tests are plain buttons; results in real terms, net of tax, to a survival-probability age for
    the longer-lived partner; the off-course rule is the person's to pick.
11. A plan must be runnable by a partner who did not build it: a "simplest version" and a what-to-do-each-year list.
12. "You can", not "you should"; nothing is lost by looking; a home that opens on a list of undone things pushes
    people away.
13. One plan clock: a plan starts in the tax year it is first drawn, derived from the record; no release is ever
    again about moving a locked start.

## 3. The 7.x audit (what stays, what is reworked, what goes)

| Release | Verdict | Why, and what a generic product does instead |
|---|---|---|
| 7.0.0 front page / 7.0.1 / 7.1.0 signed-in / 7.2.1 | keep | Question-led entry, sign-in that survives both apps, land where you left off: generic and researched. |
| 7.2.0 Month by month | rework | Monthly recording is the rhythm of a few; the unit is the yearly review (balance vs plan, what you took, cut/keep/raise). Monthly logging stays as opt-in (`decisionTool.cadence`), never a monthly nag. |
| 7.3.0 plan home | rework | Keep the home and the stage word; derive to-dos from the per-phase review agenda, not from record-keeping. |
| 7.3.1 Drawing fix / 7.3.2 bugs | keep | Right direction (difference as information); replaced properly by bands and phases below. |
| 7.3.3 / 7.4.0 / 7.4.2 / 7.4.3 (start-year moves, "months before the plan", extra ladder cash) | remove the visible mechanics | No research finding describes any user with this problem; three of sixteen releases were about it. Keep the data corrections (read-time re-anchor, the cash fix), delete the confirm flows and to-dos: the start is the first recorded month. |
| 7.4.1 pension access age | keep | Anyone stopping before 55/57 needs it; the FCA names it. Becomes part of the bridge object. |
| 7.5.0 first visit | keep | The three questions UK savers ask, in pounds, with a slider. Gains the living-standard lines. |
| 7.6.0 keep what you hold | rework | Respecting holdings is right; "stand in for tax years" and "money expected later" are one plan's shape. Becomes: holdings by asset class, never listed as a sale; the bridge as a first-class object; expected money as a dated lump sum (already supported). |
| 7.7.0 test what you keep (unpushed) | hold and fold | Its services (`keepTest.js`, `keepRun.js`, `PlanAmendments.js`) are the foundation of the generic stress panel in release 2. Do not push it alone. Revert the local 7.7.0 bump, note and states restamp; keep the four merged commits on main but do not deploy main until release 1, because its `hold.keepTest` to-do and `KeepTest.jsx` are reachable as they stand. Release 2 reworks them. |

## 4. The product in four concepts

| Concept | On screen | Chosen by | Stored |
|---|---|---|---|
| Your plan (one per person; a couple is two linked plans) | "Your plan", "Your plans" | — | as today |
| Its phase: **Saving · Moving · Living on it** (+ Closed) | one word + a strip | the person's agreements, else facts | `phases` (new root, §6) |
| How much detail: **Just the totals · Funds by name · Every holding** | a per-plan choice on "What you hold" | the person | `detail.level` + `holdings.summary/named` (§7) |
| The view: **Simple · Full** | header line; "Show everything" | the person, per account | `profile/settings.view` (§8) |

Mode is presentation only. Detail is how much is known. Phase is where the plan is. One engine, one home, one to-do
reader (`homeOf`) in both views.

## 5. Success and risk: the definition the product uses everywhere

**Metric.** "The chance the money lasts as long as you do": each of the existing 1,000 futures already records its
first short year (`src/strategies/stressTest.js:67-75 futuresOf → failYear`, `unpaid`; answers side
`src/answers/shared/stopAt.js:318-320 runOutMonths`). A run that runs short at age X counts as a failure weighted by
P(alive at X | age today, sex), from ONS cohort tables; couples use P(at least one alive). Beside it, always, the
fixed-age figure ("in 8 of 10 futures it lasts to 97 whatever happens") so nobody reads the weighting as a trick.

**Horizon.** Default = the 1-in-10 survival age for the longer-lived partner (≈96–98 at 65), user-settable and
labelled. Shared rule in one place (today `schemaParts.js:206` says 95, `d/schema.js:34-39` says later-of-95-and-
younger+5, `about.js:673` already uses `LongevityModel`). Never "average life expectancy".

**Confidence.** Default **85%** ("in 17 of 20 futures"); green 80–90, amber 70–80, red <70. Three named levels the
person can pick on any answer or plan: Careful 90 / Balanced 85 (default) / Bold 50 (said as "the best guess; only
if you are willing to cut later"). Replace `VERDICT {yes:0.10, close:0.25}` (`rules.js:61-64`) and `BAND`
(`rules.js:43`), `CHANCE_BARS`/`RUIN_BARS` (`src/services/OneAnswer.js:51-52` → `[80,70,50]`). The B-only
`confidence` field (`b/schema.js:52`) becomes the shared choice on A–D (the separate pay-in switch is retired; one
probability over the whole run).

**What counts as failing, in three dimensions**, read from existing outputs with no new runs: *when* (median and
1-in-10 run-out age), *how long* (coverage ratio, already `r.coverage`; `stressTest.js:461`, `SimulationEngine.js:1280`,
classic verdict `index.html:5859`), *how much* (goal completion from `unpaid`; income after the floor). The **floor**
(State Pension + DB + annuity) is a named line on every result: "If the pot ran out at 91, you would still have
£X a year between you." Also shown: the typical amount left at the horizon in today's money and in the best 1 in 10
(the dying-rich side); 5th/50th/95th pot paths ("Be prepared for this / Plan for this", `potBand`
`SimulationEngine.js:1317`); a year-by-year chance line.

**What each step costs**: "Careful asks for £X more than Balanced; Bold £Y less." For savers the "pot to aim for" is
a **range** at the chosen level, with and without the State Pension, and "if you would trim 10% after bad years"
(Protection Mode's rule already exists, `ProtectionStrategy.js:46`). Never one headline pot.

**The stress panel, "Try the bad years"** (generalises 7.7.0): one lazy module beside `keepRun.js`
(`src/answers/plan/stressPanel.js` + `stressPanelRun.js`) running `stressTestStrategy` on the plan's settings with
named rows: a fall at the start of drawing (−30% real in year 1; `OneAnswer.js NAMED_STARTS` for the historical
equivalents), lower real returns (−1 pt), the 1-in-10 line, higher withdrawals (+10%), prices +2 pts, and "what I
hold by choice falls by half / to nothing" (`keepTest.js SHOCKS`, `heldSettingsOf`). Each row: weighted chance,
run-out age, floor. On any plan, locked or not, and as a strip under C/D answers; classic draws the same rows on its
Scenarios sub-tab (`index.html:2742`).

**Guardrail reading** (no engine change): "the draw is 4.1% of the pot; if it reaches 4.9% (20% up) a 10% trim brings
it back" (Timeline's 20/10), in the review and in Where you are.

**"I accept this risk"** is the one generic agreement: `planAmendments[]` (`src/services/PlanAmendments.js:14-18`)
gains `kind: 'stress' | 'confidence' | 'asHeld' | 'keep'`; entry `{ at, kind, test:{id,inputs}, result:{chance,
runOutAge, coverage, floor, leftMedian}, fingerprint, engineVersion, documentAt }`; `figuresMoved` stays the staleness
rule. Withdrawable. 7.7.0's keep entries are one kind, unchanged.

**Data file.** `src/data/onsCohort2022.json`: ONS 2022-based cohort life tables (England & Wales), q(x) by sex for
ages 50–110, birth cohorts 1950–1985 (~40 KB; interpolate between cohorts). `LongevityModel.js` reads it and its
hand-typed `TABLE` goes. Listed on the Assumptions page with its source.

**Pins.** Every pinned figure that encodes 9-in-10 or a fixed 95 moves, in the release's own commit with a before/
after table: `tests/v7/a/cases.pairs.json`, `found.cases.json`, `drawing-result.json`, the C/D equivalents,
`tests/v7/plan/lastsRun.test.js`, keep seeds. Must not move: `budgetIdentity`, `holdIdentity`, `householdIdentity`,
`monthIdentity` pins, `tests/v7/oracles/tax.test.js`, `tests/v7/parity/ledger.json`. The plan document records the
definition it was tested under (confidence, horizon, weighting) so a 2025 document reads as it was.

## 6. The phase model and the review loop

### 6.1 Phases

- **Saving** — from the first saving strategy (or, for an old plan, from facts) until the move window opens.
  Tested: income at the stop from pay-ins and pot, on the plan's *chosen* drawing strategy.
- **Moving** — the window `[stop − length, stop]`, length 1–5 years, chosen by the person, **default 3** (compressed
  5–10-year lifestyling is the adviser direction; forums call 3–5 "late"; bounded 1–5 as asked). Begins by the clock
  (nobody is nagged to start a window). Ends by agreement: "I have moved what I am going to move; here is what I
  hold; I have seen its risk and accept it" → `phases.moving.agreed = { at, how:'done'|'asHeld'|'nothing', heldPct }`
  plus an `asHeld` amendment carrying the re-test (running-out chance AND median unspent at the horizon).
- **Living on it** (Drawing) — from the stop month, or from recorded months, or from the Moving agreement if earlier.
  Never derived from holdings again.
- **Closed** — as today.

Entering mid-window: Alex, 63, stop 65, no record → "You are in your move window, 24 months left; record what you hold
when you like." Past the window: Sam, 66, retired, untouched pot → Living on it; the difference from the plan's mix is
one information line with "test with what I hold", never a to-do.

**Window data** `phases.moving.window = { years, from, to, at }` written once from "About you and when"; `from`
re-derived on read if the stop moves (follows the stop, only ever widens backwards). Delete the three clocks:
`APPROACHING_YEARS` survives only as the default length; the 12-month invite goes (the window opening *is* the
invitation); `SAVING.slideYears` becomes the window length passed into `mixByYearOf` (`src/answers/shared/saving.js:72-87`)
so what is modelled is what is lived.

**Change of mind.** The locked document is never rewritten. (a) Changing the *next* phase's strategy before it begins
(a saver picks a ladder for drawing; a mover changes the end target): a new agreement in `phases`, through the
existing unlock → re-lock chain (`UNLOCK_WRITES`, archive kept) so the document version advances; reason logged in
`phases.history`. (b) Changing the strategy of the phase being lived (drawing on a ladder, now wants pots-and-valves):
close and carry on (`successorOf`, `src/services/PlanClose.js:330-380`), which already carries holdings, flexible
access and the partner link; add `phases` to what it carries, reset `phases.drawing`. Months recorded under one
strategy cannot be read against another.

### 6.2 Strategy per phase

New `phases.saving.strategy = { level:'adventurous'|'balanced'|'cautious', endTarget:'drawdown'|'annuity'|'cash'|
'ladder', window:years, at }`. `level` maps to `RISK_PRESETS` (the table `savingMixOf`/`mixesOf` already read,
`saving.js:63-69`); `endTarget` decides what the slide lands on (drawdown → the drawing mix; ladder/cash → cash years
and rung money in cash/short gilts by the window end; annuity → long bonds, a new preset). The lifestyling glidepath
the person is already in (from a named workplace fund, §7) pre-fills it.

**The saver's verdict runs on the chosen drawing strategy.** `toEngine.js:346` and `answer.js:593` stop pinning
pots-and-valves: `savingPlan` hands the plan's drawing strategy id and params (`StrategyState.js:17-32`); the fast
engine stays for the pots-and-valves/buckets family, other strategies lazy-load `stressTestStrategy` as `keepRun.js:27`
does; a ladder's saving test is "can the pot at the stop buy the ladder" (`floorCost`), which `OnCourse.
onCourseBasisHtml` already words. `basis.strategyId` then tells the truth.

### 6.3 "On track": one yearly review, agenda by phase

One tool page `#/plan/<id>/review` in every phase (the 6 Nov design sketched it for Drawing). Due yearly by default
(`phases.review.every`, reusing `CADENCES` `schema.js:829`), or on a trigger (new tax year, "my pay changed",
milestone birthday). Not due = nothing on the home. The person picks the **off-course rule** once
(`phases.review.rule`): `{kind:'success', floor:0.80}` (default; target 0.85) or `{kind:'guardrails', drift:0.20,
step:0.10}`; named constants in one place, tested; off course only on two consecutive readings, never one bad month.

| Phase | Asks (minimum) | Shows (3–5 figures) | Offers (consequences, never advice) |
|---|---|---|---|
| Saving | pot, ISA, pay, pay-in, since (the existing check-in `schema.js:831-847`) + optional rough mix | income at the stop in £/yr vs aim and the living-standard lines; chance it lasts (on the chosen drawing strategy); pot vs the saving path band (`SaverReading.js:162`); the pay-in that would be enough (`checkIn.js:601-631`, computed today, never applied) | "You can: pay X% / £Y more a month, or stop Z months later" with the take-home consequence first and one button "Use these in my plan" (`useInPlanPatch`, `SAVING_WRITES`) |
| Moving | what you hold at the chosen detail level | points of drift per bucket vs the window-end target on **today's** pot; months left; "on track to finish" (expected drift = starting drift × months left ÷ window months, on track when actual ≤ expected + band); cash years covered | "Test with what I hold" (`runKeepRetest` on the whole record) → both risks → "I accept this as my plan" / "Not yet" |
| Living on it | this year: what you took, spend now, cut/keep/raise (months opt-in) | pots vs the locked band (`PlanDocument.whereAmI :585`); withdrawal rate now vs start (guardrail); years of essential spend in cash; glidepath drift in points (`legacyDecision.js glidepathsForYear :109-133` vs held buckets); which pot pays (`WithdrawalSourcing.planSourcing :43`, ladders via `LadderPosition`) | the ways back from the 6 Nov "off course" design (levers solved to the chosen chance), the bridge and annuity comparison "at any age" |

**Bands replace the 2% tolerance**: `MOVE_BAND = 0.05` of the pot per bucket inside the window, `DRIFT_BAND = 0.10`
outside it. `diffHoldings` gains `diversifiers` from `diversifierStart` so held diversifiers inside the band are a
hold (`:518` deleted); a multi-asset line with no bucket is split by its catalogue mix (`PortfolioTagger.js:32-35`)
or asked once, never counted as 100% shares; `targetHoldings` uses the record's pot today, not `potAtRetirement`
(`:315`).

### 6.4 The end of the nag: the home's rules

The home shows **the phase, the next review date, and at most one thing that is due**; everything else is
information in the phase strip. Never appears: `P.moveNext`/`P.moveFinish` (one line "in your move window: n months
left", no button pressure), `P.moveLater`, `P.holdStale` unless a review is due, `P.keepTest` once an agreement exists
for the current fingerprint, `P.behind` (the band is information), `P.approaching`, `P.saving`, `P.invite`, anything
already ticked, anything inside a band, anything accepted. Appears, in order: closed/read-only; no age; the month to
record (Living on it only, and only when `decisionTool.cadence` says so: annual draws never produce eleven nags); the
tax-year set-up; **review due**; **off course by your rule**; a partner link missing. That is the whole list.

**Dismissals are stored**, not per window: root `tasks: { dismissed: { [id]: { at, until } } }`, written whole, frozen
when closed, dropped on copy; "Not now" = until next month, "I've done this" = permanent. Replaces `ui.notNow`
(`reduce.js:1797`, sessionStorage) so a partner's device sees the same quiet home. Tactical deviations in Living on it:
one information line ("you hold 8 points more shares than the plan's mix") with "test with what I hold"; accepting it
is an `asHeld` amendment and it goes quiet until `figuresMoved` says otherwise.

### 6.5 `stageOf` after this

closed → Closed; `phases.drawing` agreed / months recorded / stop passed → Living on it; window open and no
`phases.moving.agreed` → Moving; else Saving. Agreements first, facts second; nothing written on open. Old plans:
no `phases` → saving strategy from `savingMix`/portfolio level, window = 3 years from the stop, drawing strategy =
`strategyId`, review rule = success 0.80, `review.next` = lockedAt + 12 months (draft: today + 12); old
`transition.done` ticks shown as the person's checklist, never as the stage; a plan read as Moving by holdings today
reads Moving only inside its derived window, else Living on it with the drift line.

## 7. Intake: as much as you are willing to give

### 7.1 Detail levels (per plan, `detail.level`; each a superset of the last)

| | **Just the totals** (default) | **Funds by name** | **Every holding** |
|---|---|---|---|
| Per pot (SIPP / ISA / GIA / cash) | total; rough mix as four sliders (shares, bonds, index-linked gilts, cash) or "I don't know" → the risk level; as-of month | + provider, fund name as printed, risk number, % split; "I don't know what it's in" is valid | + today's `holdings.lines` (ticker/name/SEDOL/units/value), typed or pasted |
| DB / State Pension / partner | as today (`personFields`) | same | same |
| Engine | `allocMode:'risk'` or `'custom'` (`mix.js:128-129`) | `'custom'` from a small name table; unknown → level | `'funds'` as today |
| Unlocks | everything that matters: the answer, lock, the yearly review, Does it last, the bridge, couples | the lifestyling glidepath as an input; charges by fund where catalogued | the move's line-by-line view, rung matching, keeps |
| Never asks | fund names, tickers, logins, a paste | tickers, units | logins |

**Record**: `holdings.summary: { [wrapper]: { total, mix:{shares,bonds,ilGilts,cash,diversifiers}, asOf, how:
'split'|'level'|'unknown', level? } }` and `holdings.named: [{ wrapper, provider, name, riskNumber, pct, mapped|null,
glide?:{targetAge, into} }]` beside `lines` in `HoldingsRecord.js` (absent key reads as today). `holdingsSummary`
falls back to `summary[w].total`; `stampHoldings` dates from lines or summary. **Fund-name table** `src/services/
NamedFunds.js` (pattern `FundCatalogue.js:243-250`): LifeStrategy 20–100, HSBC Global Strategy, Nest Retirement Date,
L&G Multi-Index, Aviva My Future Focus, Scottish Widows Pension Portfolio 1–5, Standard Life Active Plus, Aegon
Workplace Default, Royal London Governed Portfolio 1–9, each with `{shares,bonds,cash}` and, for lifestyle funds, a
glidepath; provider-prefixed matching, every match shown for correction ("we read this as about 60% shares"); a
reading aid, never a ranking, never in result prose (FG15/1).

**Readers without lines**: `diffHoldings` builds four synthetic `rough:true` bucket rows from `summary.SIPP` and
reports buys/sells *by bucket* ("about £40,000 more into bonds"), never by fund; rung matching and keeps skip rough
rows; `saverPotOf` (`SaverReading.js:211-218`) reads `summary.SIPP.total`; `mix.js savedMix` reads `held:'split'`
from the summary; the check-in gains optional `ci.mix` writing `holdings.summary` (`'holdings'` added to
`CHECKIN_WRITES`); Month by month unchanged (its platform boxes *are* the totals level). Precedence: history for
value, summary for mix. Moving between levels loses nothing; "forget the lines" is a separate explicit delete.

### 7.2 Entry at each phase (minimum questions; the three doors stay)

- Saving (B): age, pot, pay-in, pay optional, aim as a living standard or £. Result in £/yr against the 2026 lines
  (`RULES.plsa`, `rules.js:35`, still 2024 values: update).
- Moving (C): pot **by wrapper** (add `you.isa`, `you.gia` beside `you.pot`; today `savings` is one box,
  `c/schema.js:97`), rough mix or level, stop month, State Pension kind; the bridge derived.
- Living on it (D): pot by wrapper, what you take, State Pension, DB, `taxFreeTaken` (already required).

**Facts asked once and carried**: `plan.facts = { flexibleAccess, taxFreeTaken, statePension:{kind,yearly,
forecastDate}, dbPensions[], accessAge (derived, `PensionAge.js`), spa }` (`FACTS_WRITES`); question screens pre-fill
from it; About/Income read and write the same keys. **"We assumed … change it" on plan pages**: `read.js sourceOf`
gains kind `'assumed'`; root `assumed: { '<dotted plan path>': { by, version, value } }` written at Keep from the
answer's `assumed[]`, cleared by a typed value on that path, frozen at lock; `ASSUMED_WRITES` rides
`BOOKKEEPING_WRITES`; `PlanFigures` prints "We assumed {figure}" with the existing Change link.

### 7.3 The bridge to State Pension (per partner, first-class)

`src/services/Bridge.js bridgeOf(facts, today)` → `{ accessAge, spa, yearsToAccess, yearsToSpa, perYearNeed, routes }`
from `PensionAge.js`, `wholeStatePensionAge`, the spend and DB starts. Stored only as a chosen route `plan.bridge =
{ route:'cash-ladder'|'fixed-annuity'|'front-load'|'none', years }` (`BRIDGE_WRITES`). The three routes side by side
with the tax difference (tax-free-cash-funded vs taxed draw, `TaxCalculator`), never ranked; the engine already has
`ladder-and-ratchet`, `bridge-and-engine`, `PensionLock`. On the home: "Sam: 4 years to 57, 11 to State Pension at 67;
bridge: cash ladder, £18,000 a year"; in Does it last: the bridge years shaded and the early-fall stress acting on them.
7.6.0's "stand in for tax years" becomes a bridge input; "money expected later" becomes the existing dated lump sum.

### 7.4 Couples

Two plans, link made symmetric on write (`linkPatch`, `household.js:17`, both ids in one batch, with a confirm).
One household strip on the home: both partners' facts, ages, access and State Pension ages, both allowances; the
coordinated-draw table "Alex draws £12,570 from pension and £8,000 from ISA; Sam draws …" with the tax both ways
(`HouseholdDraw`, `comparisonFigures` exist). Survivor and care as opt-in checks in V7's household step. **The
survivor's simplest version**: read-only `#/plan/<id>/simple` from `homeOf`: the year's draw, where it comes from,
what to do each April; printable.

### 7.5 Trust and privacy

Front-door trust block under the doors: who runs it (Usefulish Ltd, 17360947; ICO ZC209401), no sales motive and no
product referrals, data in Google's London region, never sold, no bank or platform linking, no account needed to look,
delete everything yourself. The explicit promise on the door and on What you hold: **"Nothing about your funds is
needed. Totals and a rough mix are enough; naming funds or listing holdings is optional and only makes the move's
view finer."** Export of the whole plan already exists (`PlanExport.js`); add CSV of the year table and reviews, a
documented JSON shape, and a closure promise in the policy. `submitFundSuggestion` (`AdminConfigService.js:167-178`)
becomes opt-in (tick, default off). FCA wording in `banned.js`: no fund named or ranked by the site in a result
sentence, "you can"/"this shows" never "you should", no "recommend"; the Assumptions page cites FG15/1 para 3.10 and
signposts MoneyHelper and Pension Wise. The 3-plan window cap stays; the 180-minute guest meter goes for anyone who
has chosen the local path (download/open already works).

## 8. Simple and Full: two views of one plan

- **Names.** "Simple" and "Full" (chosen 10 Nov). Header in Simple: "You are in the simple view. Show everything." In
  Full: "This is the full view. Back to the simple view." Replaces `copy/common.js:37-39 previous`;
  `src/ui/classicName.js` → "PensionTools (full view)"; `vite.layout.js:128,134,140`; `banned.js` gains
  `classic-planner`, `previous-version`, `new-version`, `expert`. `/classic/`, `FOLDERS`, `_headers`, service worker
  unchanged.
- **One home in both.** `homeOf` (`src/answers/plan/home.js`) and `read.js dueFor` are the only source of phase,
  to-dos and Where you are. Classic's `updateNextStepBanner` (`index.html:6899`) body becomes one call into a new
  `src/ui/fullHome.js` drawing `homeOf` into `#nextStepBanner` (`index.html:2209`); the inline script shrinks and
  `shellRatchet MAX_LINES` is lowered. `LifeStage.openingTab` maps Moving → the Transition tab.
- **Preference.** `profile/settings.view: 'simple'|'full'` (absent = simple) through the one merged `writeSettings`
  (`account.js:227-232`); window fallback `localStorage pt_view` in `src/v7/effects/view.js` (boundaries table gains
  it); `landingFor` with `full` writes a `home` hand-over and opens `/classic/`. Written only from the account page
  and a one-time "make this my usual view" strip.
- **"Show everything"** from every Simple screen = the existing hand-over (`OpenPlace.js PLACES :33-58`,
  `effects/openPlace.js`), no preference written; `PLACES` gains `home`, `checkin`→accumulation/on-course,
  `lasts`→test, `mix`→allocation, `where`→document, `stress`→scenarios, `review`→the review mount.
  `tests/openPlace.test.js` reads `index.html` for the ids.
- **Full keeps** every tab, sub-tab and dial (`e2e/old-app-unchanged.spec.js` → `full-view-unchanged.spec.js`, parity
  by presence). **Simple grows** in this order: the stress panel, the guardrail line, living-standard lines on the
  picture, the bridge, the glidepath as input. Nothing is ever only in Full that Simple cannot reach.
- Detail level is per plan; a Simple user can hold an "Every holding" plan made in Full and see totals.

## 9. Data changes (all new keys read as absent on old plans; nothing written on open)

| Key | Shape | Write list | Frozen when closed / dropped on copy |
|---|---|---|---|
| `phases` (root) | `{ saving:{strategy,at}, moving:{window,agreed,at}, drawing:{strategyId,at}, review:{every,rule,next,log[]}, history[] }` | `PHASE_WRITES=['phases','lastModified']` | yes / carried by `successorOf` (saving/moving), reset drawing |
| `tasks` (root) | `{ dismissed:{[id]:{at,until}} }` | `TASK_WRITES` | yes / dropped |
| `planAmendments[]` | gains kinds `stress`, `confidence`, `asHeld` | `AMEND_WRITES` unchanged | as today |
| `holdings.summary`, `holdings.named` | §7.1 | `HOLD_WRITES`; `'holdings'` added to `CHECKIN_WRITES` | as holdings |
| `detail.level` | `'totals'|'funds'|'lines'` | `DETAIL_WRITES` | yes / kept |
| `facts` (root) | §7.2 | `FACTS_WRITES` | yes / carried |
| `assumed` (root) | §7.2 | `ASSUMED_WRITES` via `BOOKKEEPING_WRITES` | frozen at lock |
| `bridge` (root) | `{route, years}` | `BRIDGE_WRITES` | yes / carried |
| `profile/settings.view` | `'simple'|'full'` | the one merged `setDoc` | — |

Add every new root to `FROZEN_WHEN_CLOSED` (`PlanClosed.js:136`), `migrations.protectedParts` (`:77-89`),
`writeNeedsGuard` (`LockedPlanGuard.js:265`), and `ALL_WRITES` (`schema.js`), retaking the `home.test.js:383-391` pin
by exactly the paths added, in its own commit. The lock keeps freezing settings/strategy/document; none of the above
is frozen by the lock.

**Delete**: the stage reading of `transition.done`; `TRANSITION_TOLERANCE` (→ `MOVE_BAND`/`DRIFT_BAND`); the
diversifier sell; `potAtRetirement` in `targetHoldings`; `invite` from `stageOf`; `P.moveNext/Finish/Later`,
`DISMISSIBLE` (`read.js:955`), `ui.notNow`; the 7.3.3/7.4.x start-move to-dos and confirm flows (`PlanMove.
startLaterOf` to-dos; keep the read-time re-anchor); the 180-minute guest meter on the local path; the B-only pay-in
confidence switch; the hand-typed longevity `TABLE`.

## 10. The release route (each shippable alone; sizes S/M/L; every release behind the full checks, the signed-in
emulator journeys, the rollback layout and the privacy scan)

**Before release 1 (housekeeping, no feature)**: revert the local 7.7.0 version bump, release note and states
restamp (keep the four merged commits); commit `research/v7/what-success-means.md` and the new
`research/v7/uk-lifecycle-research.md` (summary + every URL of the 10 Nov research, fictional examples only);
clean the 15 worktrees. Do not deploy main until release 1.

1. **7.8.0 — The chance the money lasts as long as you do** (L). §5 in full: ONS cohort file, mortality-weighted
   metric, 85% default and bands, the three levels on A–D, three failure lines, the floor line, the dying-rich
   figures, joint-life horizon, the pot RANGE on B/C, classic verdict via `oneAnswer` (one source), document records
   the definition. Data: none per user. Tests: new pins with a before/after table, `tests/v7/a..d`, `lastsRun`,
   j1/j4/j5, `e2e/first-visit`. Rollback: constants + layout flag; old documents read as written.
2. **7.9.0 — Try the bad years** (M). The stress panel on any plan and under C/D; 7.7.0's keep test becomes one row;
   the generic agreement record; guardrail reading. Tests: `plan-keep-test` → `plan-stress`, j11. Rollback:
   `AMENDMENT_KINDS` back to `['keep']`, entries ignored.
3. **7.10.0 — Three phases and one yearly review; the end of the nag** (L). §6 in full: `phases`, the window, the
   review page per phase, the off-course rule, bands and the diff fixes, strategy per phase and the saver verdict on
   the chosen drawing strategy, stored dismissals, the home's rule list, months opt-in, `stageOf` on agreements,
   start = first recorded month (7.3.3/7.4.x flows deleted). Tests: a phase truth table (agreements × facts × window)
   asserting no cell writes; `stages.test.js` twins; `home.test.js` NEXT_ORDER retaken; `holdIdentity`/`monthIdentity`
   byte-identical; j3 rewritten as the yearly review; a new j12 (Alex: adventurous saver → window → "I accept this
   as my plan" → Living on it; Sam: enters at 66 past the window). Rollback: `phases`/`tasks` ignored by 7.9.0.
4. **7.11.0 — Simple and Full** (M). §8 in full. Tests: `full-view-unchanged`, `openPlace.test.js`, wording, j2c
   (set Full → root lands in Full on the last plan with the same to-dos → "Back to the simple view"). Rollback: the
   layout name; one preference field.
5. **7.12.0 — A pension as people describe it** (M). §7.1–7.2: detail levels, `summary`/`named`, the fund-name
   table, rough-bucket diff, `facts`, `assumed` on plan pages, C's pots by wrapper, the trust block and promise,
   opt-in fund suggestions, export CSV and the closure promise, the guest meter gone on the local path. Tests: hold
   identity pins unchanged for `lines`; new fixtures at each level; j13 (totals-only plan from door to review).
   Rollback: default `lines`.
6. **7.13.0 — The bridge to State Pension** (L). §7.3: `Bridge.js`, the three routes with the tax difference, the
   home line, Does it last shading, 7.6.0's keeps folded in. Tests: `plan-way`, `plan-pots`, j10 reworked.
7. **7.14.0 — Couples on one home, and the simplest version** (M). §7.4. Tests: j14 on fixtures 09/10.
8. **7.15.0 — Your own glidepath as an input, and the two moves** (M). §6.2's `endTarget` pre-filled from named
   funds; "pay X% more / stop Y years later" closing a shortfall on every saver picture; living-standard lines.

Releases 1–3 change whether the site is worth keeping; 4 keeps the 6 Nov design's promise; 5–8 fill the gaps the research
named. If only 1–3 ship, the site is still better than live.

## 11. Verification (end to end, every release)

1. Unit: `npx vitest run` on Node 24 and Node 20; pins retaken only where the release names them, each in its own
   commit with the reason.
2. Browser: `npm run e2e:build` then Playwright at desktop-1440 and phone-390; rerun timing/crawl/month-fill failures
   alone on an idle machine before calling them red (the 10 Nov runs show load, not faults).
3. Signed in, against the local emulator: j1–j11 plus the new j12–j14 as each release adds them; two apps on one plan
   never disagree and never write on open.
4. Rollback layout check; privacy scan (`scratch privacy/scan.sh`; the facts list lives only outside the repo).
5. After deploy: the live bundle check, a guest walk of each door at both widths, and a walk of a real signed-in journey.
6. Product checks that are not tests: a stranger reaches a £/yr answer in under two minutes at each door; a returning
   person's home shows one thing or nothing; nothing on any screen says "you should".

## 12. Rules for whoever builds this (every brief says so)

- One engine, one reader, both views; never two readings of the same figure.
- Design for the many situations; any one person's plan is one test case, never the spec; no real figures anywhere public.
- Consequences, never advice; "you can", never "you should"; no fund named or ranked by the site.
- Nothing written on open; the locked document never rewritten; every new write in a declared list and the guard.
- Words in plain UK English; `banned.js` is the gate; What's new says what changed and why in general terms.
- A release is done when its signed-in journeys pass, not when its tests count.

## 13. Open questions (not blocking release 1)

- Should the yearly review be allowed to **apply** a pay-in change itself ("Use these in my plan"), or only show it?
  (The plan says: one button, consequence shown first.)
- The fund-name table: who keeps it current, and should matches ever appear in result prose? (Plan: never.)
- Mortality weighting makes most plans look better; the fixed-age figure stays beside it. Is that enough, or should
  the weighted figure be opt-in?
- Whether `phases.saving.strategy` lives under `accumulationTool` (already in `SAVING_WRITES`) or the new root (plan:
  the root, so all three agreements sit in one frozen object).
