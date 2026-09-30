# V7 — the plan of plans (draft for the owner, 30 Sep 2026)

Nothing here is built. This is the map: what we want, what we have, how testing is designed in, the order of
work, the sub-plans still to write, and the decisions only the owner can make. Sources: product-plan.md, the
"why people come" research, four inventories of the current code, two testing designs, and three critics
(a test engineer, a solo-founder engineer, and a reviewer reading as the owner). Full detail is in the
workflow outputs; this is the merged, cut-down version.

## 1. What we want (72 testable requirements, in six groups)

- **Front door and rail**: six questions instead of tools; a journey rail replaces the tab bar; "Drawdown
  Planner"; first answer on your own figures in under two minutes; every screen reachable directly.
- **A. When can I afford to stop?** A verdict at a named age, a range of ages side by side, what one more year
  buys, which pot pays the years before State Pension, part-time as a lever.
- **B. Am I saving enough?** The number, the monthly amount that gets there, and the options if it does not fit
  (later, less, more risk while saving, or accept a stated chance of falling short).
- **C. I've got about £X — what is that a month?**
- **D. I'm retired — will it last, can I spend more, would some work help?**
- **E. Test my plan and compare strategies.  F. Single decisions** (tax-free cash order, annuity, final-salary
  early or late, mortgage).
- **Across all of them**: couples and a final-salary pension in the first questions; the planner asks for a pot
  and a risk level, and any fund list there is the intended retirement portfolio; "What you hold" is separate;
  the move between them is a step, with a copy once it is done; no countdown for the retired; every headline
  has a plain sentence and a bad-case figure; every saved plan has a version; locked plans never break.

## 2. What we have

**Keep as it is**: the retirement-phase engine (monthly simulator, one stress test for all nine strategies,
tax, tax-free cash, ISA and taxable account), the monthly decision engine, holdings, transition and rotation
modules, the plan document, guest mode, and 848 passing tests.

**The five real gaps**
1. **The saving years have no engine.** Three fixed growth rates. No chance of shortfall, no solving for the
   monthly amount. Question B needs it and so does the front half of A.
2. **Couples are bolted on.** Two complete plans are needed before anything is said.
3. **No fast answers.** Nothing turns a pot into a monthly figure, or solves what a retired person can draw.
4. **The screen code is one 10,400-line script** with 345 global functions, no addresses for screens, and no
   test of any of it. 39 of the 61 bugs found by hand in September lived here.
5. **No plan version, no browser tests, nothing checking changes before they publish.** The nightly data
   update pushes to the live branch without running the tests.

## 3. How testing is designed in

**The rule that makes it possible**: every number comes from a pure function with a declared list of inputs;
every screen is drawn from the plan's state and has its own address; the screen computes nothing.

### Numbers
"All possible inputs" cannot be literal: pots and dates are continuous and sixty inputs multiply beyond any
run. What gives equivalent confidence, in the order it pays off:
1. **Replay of known bugs.** The 61 September findings become tests. Every new kind of check is measured by how
   many it would have caught. This is the proof the machinery works.
2. **Declared inputs with boundary values**: zero, tax thresholds (12,570 / 50,270 / 100,000 / 125,140), ages
   55 / 57 / 66 / 67 / 75, dates either side of 5 April.
3. **Generated combinations**: every pair of options appears together in at least one case; the core
   (strategy × stage × single or couple × final-salary yes or no) in every combination.
4. **Rules that must hold for any input**, on thousands of random cases nightly: money is conserved, nothing is
   negative, tax never exceeds income, more pot never gives a worse answer, a deselected strategy's dials never
   change the result, a solved figure fed back in reproduces itself.
5. **Independent answers**: every headline recomputed from the month-by-month trace by separate code; HMRC
   worked examples including mid-year cases; closed-form cases; the existing Decision-against-Stress replay.
6. **A fixture per research scenario** with its expected plain sentence, reviewed once by the owner.
7. **Pinned outputs** with every change explained in a release note.

The monthly decision step and tax-year setup go into the generated set in the first wave: it is the owner's
live path and was the most-corrected code in September.

Cut on the critics' advice: mutation testing, coverage percentages as gates, and scaling everything by two.

### As a user
1. **Scripted people in a real browser**: saver at 45, stopping next June with a partner, retired with a ladder
   in its run-up, retired and worried, a forum guest with two minutes. Each walks its whole journey.
2. **The number on screen equals the engine's number**, and each sentence equals its number.
3. **Rail checks**: every step reachable, no dead ends, browsing never changes a locked plan.
4. **Wording check** on every rendered screen: no "undefined", no "-£0.00", no countdown for a retired person,
   no leftover "Stress Tester".
5. **Screenshots** at phone, iPad and desktop on about ten key screens, compared with an approved baseline.
   Contrast and keyboard checks alongside.
6. **Counted first answer**: inputs, screens and waiting time per question.
7. **A simulated person exploring before each release**, as was done by hand this month, with the findings
   reported, not scored.

Honest limits: screenshots detect change, not ugliness; scripts only walk paths someone wrote; a bug needing
four particular settings together can still slip through the pairs and will be caught, if at all, by the
nightly random run.

## 4. The order of work

Built as **vertical slices**: each question is taken from inputs to tested screen before the next starts, so
there is something to look at early and the method is proved on a small piece.

| Step | What | You see |
|---|---|---|
| 0 | Decisions below; owner amends the want list | — |
| 1 | Safety net: tests run on every change and before the nightly data update; dates and market data pinned in tests; the September bug replay | A catch-rate report |
| 2 | Plan version (6.14): version stamp, upgrade runner, read-only fallback, tested on a copy of the owner's plan | No visible change |
| 3 | First slice, question C ("£X, what is that a month"), couple-ready, with every test layer attached, in the new rail shell behind a switch | First V7 screen |
| 4 | Question A with the saving-years engine | When can I stop, range of ages |
| 5 | Question B on the same engine | The number and the monthly amount |
| 6 | Question D | Retired re-plan |
| 7 | Question E re-homed; what you hold and the move | Strategies in the rail |
| 8 | Month by month carried over; new shell becomes the default as 7.0; rename | Cutover |
| 9 | Question F modules one at a time; landing and trust pages | — |

The current app stays the default until step 8. The owner's locked plan is checked against the new shell on
every change and the switch does not flip until they match.

**Size, stated plainly**: the planners' estimates sum to about 30 weeks of focused work to 7.0. With agents
doing the building that should compress, but it is a large job and the estimate is not firm.

## 5. Sub-plans still to write

| Plan | Answers | When |
|---|---|---|
| Requirements baseline | Which wants are in 7.0 and what passes each | Step 0 |
| Test strategy | Layers, what runs when, what blocks a release | Step 1 |
| Saved-data upgrade | Version chain, locked-plan protection | Before step 2 |
| Rail and screen design | Steps per question and stage; phone layout | Before step 3 |
| Answer contract per question | Inputs, result, headline, sentence, bad case | Before each slice |
| Household and guaranteed income | How a couple and a final-salary start age are entered | Before step 3 |
| Saving-years engine | Simulation, solve, how saving joins drawdown | Before step 4 |
| Screen-code extraction map | What moves out of the big script, and when | Before step 3 |
| Language guide | Names, banned jargon, sentence templates | Before step 3 |
| Cutover | Running old and new side by side; the rule for switching | Before step 3 ships |
| Holdings and the move | How held, tested and locked portfolios relate | Before step 7 |
| Decision-module briefs | One per module | Before each |

## 6. Decisions for the owner

1. **Testing scope.** Accept section 3 as the meaning of "all possible inputs"?
2. **Your plan as a test case.** May a copy of your locked plan be the main safety fixture? Recommended: kept
   on your machine and out of the repository.
3. **Side by side.** Build V7 behind a switch and flip when your plan matches? Recommended.
4. **Savers early.** Saving-years engine at step 4, ahead of the retired re-plan? Recommended, since most
   first-time users are saving.
5. **"A bad case".** Which case gives the run-out age: the worst history, or the worst one in ten?
6. **The lock.** Leave it where it is stored today? Recommended; moving it risks every locked plan.
7. **Couples.** Five extra fields and one household spending figure for first answers. Enough to start?
8. **Does 7.0 wait for question B**, or ship when A, C, D and E are done?

## 7. Owner's decisions (30 Sep 2026)

1. Testing scope: section 3 accepted as the meaning of "all possible inputs".
2. His locked plan may be the main safety fixture, kept on his machine, never in the repository.
3. Build V7 beside the current app; switch when his plan matches.
4. Savers first: questions A and B with the saving-years engine come straight after the first slice.
5. "A bad case" = the worst one in ten, not the worst in history.
6. Couples: a short first set of questions, with the option to answer in full detail at any point.
7. 7.0 includes "am I saving enough" (it is built second, so it is inside the cutover).
