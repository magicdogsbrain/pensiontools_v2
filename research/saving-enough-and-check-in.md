# Saving enough, and checking in (design, 4 Nov 2026)

*Written from two readers' reports of 4 Nov 2026: one on what the app does today for someone still saving (V7's
question B, the plan rail, the classic planner), one on how other tools answer "am I saving enough?" and run a regular
review. Written against main at 287f55e1 (6.49.0). Nothing here is built. The app is not financial advice: it runs
calculations on figures the user enters. Every person below is fictional (Alex, Sam). Sam's figures in sections 1–3
were worked out with B's own answer function (`answerB`, 1,000 futures, seed 0, today 4 Nov 2026) in a scratch script
that is not in the repository. Revised the same day after a review: the bands now follow V7's own `verdictOf`, the
"close" example is measured, and the check-in gained a size budget, an exact "what changed" and the old monthly step
for plans that never chose how often.*

## 0. The problem

We walked a saving plan for a person years from retirement, with an age in mind to stop work and an income they wanted
from then, paying in a share of their pay (their part plus an employer's part). Four things went wrong.

1. **"Am I paying in enough?" had no plain answer.** You had to look closely to see that what went in did not reach the
   aim. The verdict must say it straight: on what goes in now, what you could have from your stop age in a middling
   future and in a bad one, against your aim; the gap in pounds a year; and in how many futures out of 10 the aim is met.
2. **"What would be enough?" could not be answered.** A saver wants the share of pay (and the pounds a month) that gives
   a good chance of the aim, with the other ways beside it: stop later, aim lower, a one-off sum now.
3. **The app kept pushing a saver off saving**: into recording what they hold, into moving it to the plan's mix, into
   the lock, and into Month by month, which is a tool for drawing money out and does not fit a saver.
4. **A saver has no check-in of their own**: a regular moment to tell the plan where they are and see whether they are
   still on course against the plan's own path, what changed, and what to do if behind, kept as a history.

### Where it comes from (why, before what)

- **B has a verdict and a solver, but leads with neither.** On course is worked out (`src/answers/b/answer.js:388`) and
  the pay-in that gets there is solved for both 9 in 10 and 3 in 4 on every answer (`answer.js:261-293`, `:391`). But
  when not on course the headline is the pay-in (`src/v7/screens/b/AnswerScreen.jsx:49`, `:84-96`); the words "not on
  course" appear only in the "Try a change" row (`src/answers/b/sentences.js:317-321`). The middling income at today's
  pay-in is worked out by `bandAt` (`src/answers/shared/stopAt.js:328-358`; called at `answer.js:403`) and never said:
  only the bad-case figure is (`sentences.js:110-114`; `answer.js:404`). No gap is said in pounds: `result.short` is a
  pot gap (`answer.js:401`), and a "£… short of it" line was removed on purpose because it set two different bad cases
  against each other (`sentences.js:204-207`).
- **Never in shares of pay**, even when the pay is typed (`src/answers/shared/payIn.js:24-44`). Every "Try" door writes
  pounds (`src/v7/components/payInTo.js:12-14`, `:40-43`), and keeping the answer writes pounds
  (`src/services/PlanFromSeed.js:671-687`).
- **A saved saver's plan has no verdict at all.** V7's "What you pay in" shows fixed-rate rows and hands "Am I on
  course?" to the classic page (`src/answers/plan/read.js:503`; `src/services/OpenPlace.js:49`), which sets a needed pot
  against three fixed-rate rows (`index.html:3710-3719`; `src/services/OnCourse.js:56-62`). Keeping a B answer keeps
  today's pay-in; the solved figure is frozen in `fromAnswer.answer.payInNeeded` (`src/answers/keep/planSeed.js:308`)
  and no plan page reads it.
- **The push is in many small places**, each listed in section 4: the lock is the first button after keeping
  (`src/v7/components/KeepPanel.jsx:42`); the next step for anyone within five years says "lock it and move what you hold
  to its mix" (`src/v7/copy/plan.js:385`); a locked saver must record a pot every month (`src/answers/plan/steps.js:20`;
  `read.js:656`; `copy/plan.js:380`); the classic page opens on Month by month's entry for everyone (`index.html:2216`,
  `:2227`); its setup wizard offers "Decide this month's withdrawal" and no saver's door
  (`src/ui/components/SetupWizard.js:252`); a plan whose ages are typed only on the Accumulation tab is told to "set up
  the monthly Decision Tool" (`src/services/NextStep.js:24`, `:68`).
- **The only thing like a check-in is a monthly pot record** (`accumulationTool.history`,
  `src/answers/plan/saving.js:49`, `:159-176`). Nothing reads it while the plan is unlocked; once locked it is read
  against the path's middle line (`src/services/SaverReading.js:135-170`), and nothing says what changed or what to do.

Two facts decide the shape of the fix:

1. **There is one test.** "On course" means the money lasts to the end age, through the saving years and the drawing
   years, in 9 futures out of 10, everywhere (`OnCourse.js:15`; `answer.js:315`, `:388`), held by
   `tests/onCourse.test.js`. In B the verdict, the pay-in that gets there, stop later and spend less are slices of one
   function on the same lives (`answer.js:4-15`). Every new figure here is that test at another pay-in, pot or age.
2. **Pay-in questions are arithmetic, not new runs.** The pot at the stop is exactly linear in what goes in:
   pot_i(c) = A_i + c × B_i (`src/answers/shared/saving.js:10-14`). The unit kernel also holds F_i, the growth of £1
   held from today to the stop, and b_{i,y}, the value at the stop of £1 a month paid in year y alone
   (`saving.js:211-258`; the person's kernel `saving.js:270-278`, A_i = pot × F_i). So a share of pay, a one-off sum
   today, a pause and a yearly step-up are all the one test at other pots at the stop: no second model and no new
   saving-years run.

## 1. The situations

"B" is question B ("Am I saving enough, and what should I pay in?"). "The plan" is a saved plan read on V7's rail.
"Enough" is how the solver's answer is said. Every row runs the same test.

| | Who (fictional) | Asked | Verdict | "Enough" is said as | Ways beside it | Check-in |
|---|---|---|---|---|---|---|
| **A. Early in a career** | Alex, 24, £27,000 pay, £3,000 saved, paying the legal workplace minimum (5% from Alex, 3% from the employer), stop at 67, aim: the "moderate" level | Pay, the two shares (and from R4 whether they are shares of all pay or of the band of pay the law uses) | Count, the two incomes, the gap; the bad and good lines are far apart over 43 years and the words say so | Total share of pay, Alex's part and the employer's as now, and £ a month | A yearly step-up (R4) first; stop later; aim lower | Yearly; the first few read wide bands |
| **B. Mid-career with a pot** | Sam, 41, £38,000 pay, £62,000 saved, 6% + 4% from the employer, stop at 63, £24,000 a year before tax (£1,810 a month after tax) | As A | Measured: not on course, lasted in only 3 futures out of 10; to last in 9 in 10 paying in as now, £1,310 a month from 63 (£1,630 in a middling case), with the State Pension from 68: £6,000 a year less than the aim | Measured: 31% of pay in all (Sam 27%, employer 4%), £982 a month; for 3 in 4, 22% (Sam 18%), £697 | Stop at 73; spend £1,310; a one-off sum; the grid of ages × shares | Yearly |
| **C. Late starter** | Alex, 52, £45,000 pay, £20,000 saved, 8% in all, stop at 67 | As A | Often not on course | The share may be more than all pay: then "even all of your pay going in would not be on course", and the other ways lead | Stop later, aim lower, a one-off sum; the annual allowance warning (`answer.js:550-555`; `sentences.js:487-494`) | Yearly |
| **D. Self-employed, no employer part** | Sam, 38, pays £400 a month from the bank into a personal pension | B's one-figure kind (`src/answers/shared/schemaParts.js:108-110`): what lands, £500 with the tax the government adds back | As B, no employer clause (`sentences.js:236` already leaves it out) | £ a month landing; a share only if a yearly profit is given | All | Yearly; "I stopped paying in for a while" common |
| **E. Fixed sum, employed** | Alex pays £250 a month and the employer £150 | B's split kind | As B | Alex's part = what is needed less the employer's part as entered (as `payInTo.js:40-43` does) | All | Yearly |
| **F. A couple saving into two pensions** | Alex 45 (£52,000, 5% + 5%) and Sam 43 (£31,000, 4% + 3%), one aim between them | Each person's pay-in in their own kind | "between you"; one count for the household | The household total split by today's ratio (`answer.js:328`), each part said in that person's own kind | All but "Try" on pay more (`src/v7/components/Levers.jsx:41`) | Each plan its own; read as a household when linked (R5) |
| **G. A final-salary pension too** | Sam, 50, a final-salary pension of £9,000 a year from 65, and a pot | In B's inputs (`src/answers/b/toHousehold.js:57`); on the plan from the Timing and income settings | Same form; words name it ("with your final-salary pension from 65") | As B | All | Asks only whether its figure changed, as a link to About |
| **H. Salary sacrifice, relief at source, net pay** | Any of the above | Not asked in B | What lands for a share is the same under all three (`payIn.js:12-16`), so the verdict and the share are the same | As B; on the plan, where the scheme is stored (`accumulationTool.settings.schemeType`), the cost to take-home pay as well (`src/services/AccumulationEngine.js:62-97`) | All | As others |
| **I. Stopped paying in for a while** | Sam, 36, on a career break, paying nothing now, expecting to start again | Today's pay-in is £0, often with pay £0; R4 adds "start again at N% from {month}" | At £0 now, and (R4) at the restart | In pounds a month, never as a share of £0 pay and never "even all of your pay" (3.3); from R4, from the restart and as a share of the pay then | All | The pause is recorded (from, to) |
| **J. Already on course** | Alex, 47, a large pot | As B | "On course"; "you could pay in as little as …" (`sentences.js:200-203`) | The least share that stays on course | None needed | Yearly |
| **K. No aim yet** | Anyone | B asks for one; a plan may have no income set | No verdict: what paying in as now could give from the stop, middling and bad | — | The three levels (`src/answers/shared/rules.js:30-33`) as quick picks | Allowed; the reading is the path only |
| **L. Within five years of stopping** | Sam, 59, stop at 63 | As B | As B | As B | As B | Yearly or quarterly; lock, what you hold and the move are on the rail, optional, never the next step |
| **M. Locked while saving** | Sam's plan, locked at 58 | — | As B, at each check-in | As B | As B | Against the plan document's path; Month by month stays closed until the stop month (`src/services/LifeStage.js:119-131`) |
| **N. Pay changed** (a rise, a cut, a new job) | Any | The check-in's pay box | From the new figures | A share follows pay; pounds stay | All | The plan changes only on "Use these in my plan" |
| **O. Already taking money from a pension** | Alex, 57, still working | B's "already drawing" (`schemaParts.js:118`) | As B | As B, checked against £10,000 a year (`answer.js:555`; `rules.js:27`) | All | As others |
| **P. Stopping before a pension can be touched** | Sam, 45, stop at 55, pensions open at 57 | As B | As B; the words name the years from 55 to 57 that savings must carry (`sentences.js:266-270`) | Two parts: a share of pay into the pension and £ a month into ISAs or savings until the stop (`payIn.outside`, `answer.js:261-292`); or the savings part alone, when what goes into the pension is already enough (`savingsOnly`, `sentences.js:222-232`) | All | Yearly; the check-in asks for ISAs and savings and what goes into them (5.4) |

## 2. The verdict

### 2.1 The measure and the three bands

The verdict is B's one test at today's pay-in: the count of futures in which the money lasted to the end age spending
the aim (`answer.js:383-388`; `verdictAt`, `stopAt.js:306-322`). The bands are the three V7 already uses everywhere:
`verdictOf` (`src/answers/shared/rules.js:57-60`, `VERDICT { yes: 0.10, close: 0.25 }`, by counts of lives that
failed, not shares). A and D lead with them (`src/answers/a/sentences.js:266`, `src/answers/d/sentences.js:173`), the
rail says them ("Close at …", `src/v7/rail/index.js:256`, `:300`), and B's kept answer already stores its verdict that
way (`src/answers/keep/planSeed.js:304`). So inside V7 "close" means one thing:

| Band | Lives that failed, out of n | Headline |
|---|---|---|
| On course (`yes`) | at most floor(n/10): 9 in 10 or more | "On course for {aim} a month from {stop}" |
| Close (`close`) | at most floor(n/4): 3 in 4 to under 9 in 10 | "Close — {aim} a month from {stop} is tight" |
| Not on course (`no`) | more than floor(n/4) | "Not on course for {aim} a month from {stop}" |

The first two headlines are A's and D's own words. The third keeps "on course" because that is B's question; A's and
D's "Not at … on these figures" answers theirs ("could I stop at", "could I spend").

The classic page's `OnCourse.js` has a different second bar (`BORDERLINE_SHARE` 0.7, `OnCourse.js:21`) and keeps it:
nothing on the classic page changes (parity), and its top bar, 9 in 10, is the same. Using 0.7 inside V7 would give B
two "close" bars, and the 3-in-4 figure would sometimes sit above today's pay-in inside the middle band. With
`verdictOf`, the middle band is exactly "today's pay-in passes 3 in 4 but not 9 in 10", so its 3-in-4 line is decided by
the count at today's pay-in, not by the solver: "For 3 futures out of 4, what you pay in now is already enough." In
the bottom band today's pay-in fails 3 in 4, and the 3-in-4 figure is said as a pay-in above it.

Beside the count, two incomes and one gap, all already worked out on every answer:

- **Middling** and **bad case** incomes from the stop at today's pay-in: `careNow.monthly.middling` and `.careful`
  (`answer.js:403`; `bandAt`, `stopAt.js:328-358`): the most a month that lasted in 5 and in 9 futures out of 10. They
  are careful spends, not what a bad case would pay: cuts are off (`answer.js:539`), so nobody is paid £1,310 in a bad
  case. The words say them as the test does: "To last in 9 futures out of 10 paying in as now, you could spend …".
- **The gap**: aim less the bad-case income, a month and a year (× 12), never below £0. On course and a gap of £0 agree
  by construction, to B's £10 step: the bad-case income is the most that lasts in 9 in 10, and the aim lasts in 9 in 10
  exactly when it is no more than that (a test in section 8).
- **The bad case at the aim**: spending the aim, the age at which a bad case (the worst 1 in 10) runs out,
  `wholeLife.runOutAge` (`answer.js:385`, `:528`). Already on the result.
- **What the incomes include**: the State Pension from its age, and "the full amount, as assumed" when B defaulted it
  (`facts.people[].spAge`, `.spDefault`, `answer.js:576`), a final-salary pension, and savings, as B's guide-number
  line already names them (`spFromParts`, `sentences.js:87-93`, used at `:180`, `:184`). So a saver can tell the gap is
  not the pot's alone.

Why bands by count, not by how much of the aim is covered (DWP's 80% measure, *Analysis of Future Pension Incomes 2025*,
https://www.gov.uk/government/statistics/analysis-of-future-pension-incomes-2025/analysis-of-future-pension-incomes-2025;
Fidelity's 95/80/65 bands, https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/retirement-preparedness-measure.pdf):
the count is the one test's own output, the top band must be exactly "on course", and a second measure for the lower
bands would be a second bar. The gap in pounds is said in every band below the top, so the depth is never hidden.

### 2.2 The words, state by state

The aim is said in the unit it was given in: B's spend is a month after tax (`answer.js:330-331`), so B says a month
and adds the year for the gap; a plan's income is a year before tax (`read.js:349-358`), so the plan says a year before
tax, turned from the test's after-tax figures by the one tax module (`src/services/TaxCalculator.js:77`, `:121`). "At
today's prices" and "a bad case (the worst 1 in 10)" are explained on the same screen, as the banned-words list asks
(`src/v7/copy/banned.js:136-137`, `:146`).

The first sentence answers both questions at once: how it stands now, and what would be enough (section 3). That was
the complaint: the share that would do was hard to find.

**On course** (Alex, 38, £30,000 saved, a fixed £400 a month going in, no employer part, aim £1,500 a month from 66;
measured: lasted in 9 futures out of 10, bad case £1,520, as little as £380):

> **On course for £1,500 a month from 66**
> Paying in £400 a month as now, your money lasted until you are 95 in 9 futures out of 10. You could pay in as little
> as £380 a month and still be on course.
> To last in 9 futures out of 10, you could spend £1,520 a month from 66 ({middling} in a middling case, 5 futures out
> of 10), with your State Pension from 68 (the full amount, as assumed).

**Close** (Sam paying 22% in all, 18% + 4%; measured: lasted 0.759, so "only 8 futures out of 10" in `outOfTen`'s
words, `src/answers/shared/format.js:34-47`; £1,600 and £2,090; a bad case at the aim runs out at 84):

> **Close — £1,810 a month from 63 is tight**
> Paying in 22% of your pay as now (£697 a month, your employer's 4% included), your money lasted until you are 95 in
> only 8 futures out of 10. 31% of your pay in all (you 27%, £982 a month) would put you on course, which is 9 in 10.
> For 3 futures out of 4, what you pay in now is already enough.
> To last in 9 futures out of 10 paying in as now, you could spend £1,600 a month from 63 (£2,090 in a middling case,
> 5 futures out of 10), with your State Pension from 68 (the full amount, as assumed): £210 a month (£2,520 a year) less
> than you want. Spending £1,810, a bad case (the worst 1 in 10) runs out at 84.

**Not on course** (Sam paying 10% in all, 6% + 4%; measured):

> **Not on course for £1,810 a month from 63**
> Paying in 10% of your pay as now (£317 a month, your employer's 4% included), your money lasted until you are 95 in
> only 3 futures out of 10. 31% of your pay in all (you 27%, £982 a month) would put you on course, which is 9 in 10;
> 22% (you 18%, £697 a month) would do it in 3 futures out of 4.
> To last in 9 futures out of 10 paying in as now, you could spend £1,310 a month from 63 (£1,630 in a middling case,
> 5 futures out of 10), with your State Pension from 68 (the full amount, as assumed): £500 a month (£6,000 a year) less
> than you want. Spending £1,810, a bad case (the worst 1 in 10) runs out at 72.

When the share is out of reach (3.3), the first sentence ends "; even all of your pay going in would not be on course",
and section 3's other ways come next. With no pay given or pay of £0, the first sentence says the pounds a month
instead of a share (3.3).

**No aim given** (a plan with no income set; B always has one):

> **What paying in as now could give you from 63**
> To last in 9 futures out of 10, £1,310 a month; £1,630 in a middling case (5 futures out of 10). After tax at today's
> prices, with your State Pension from 68.
> Say what you would want to spend a month to see whether that is enough, or pick a level: a minimum, a moderate or a
> comfortable retirement.

The two incomes are C's band from the stop at today's pay-in, which C already answers for someone still paying in
(`payIn.js:18-19`; `answer.js:11-12`: "C's careful from that age with that pay-in"). No count, no solver.

**No employer part**: the employer clause goes ("Paying in £400 a month as now, …"), as it already does
(`sentences.js:236`). A share without an employer reads "15% of your pay".

**A couple**: "between you" throughout. "On course for £3,000 a month between you from 62"; "Paying in £1,050 a month
between you as now (you 10% and your partner 7% of your pays, your employers' parts included) …". The count is the
household's, as now.

**Kept as now**: no pot needed ("No pot is needed for £S a month", `sentences.js:142-149`); savings alone pay
(`:158-168`); couples stopping apart and "I've already stopped" (`:173-195`). They gain the two incomes and the gap where
those apply.

### 2.3 What the answer gains

`result.verdict = { band, lasted, outOfTen }`, `result.income = { middling, bad }` (a month, at today's prices after tax),
`result.gap = { month, year }`. All three come from figures already worked out (`answer.js:383-404`): no new run.
`result.verdict.band` is `verdictOf(fails, futures)`, the figure B's kept seed already stores. The order on
`AnswerScreen.jsx` becomes the verdict (whose first sentence already names what would be enough), the incomes and gap,
then section 3's block with the pounds, how long and the other ways, then the guide number (`AnswerScreen.jsx:57-68`)
under more detail, where it already sits in the copy (`src/v7/copy/b.js:138`).

## 3. "What would be enough": the solver

### 3.1 What it solves for

- **A share of pay** (B's `share` kind: pay a year before tax, the person's part and the employer's part as percentages,
  `schemaParts.js:103-121`): the least **total share of pay**, keeping the employer's part as entered, so the person's
  part is the total less the employer's. Said with the pounds a month it lands.
- **A fixed sum** (one figure, or your part and your employer's in pounds): the least pounds a month landing, B's own
  figure (`answer.js:391-395`), with the person's part said as that less the employer's part as entered.
- **On the plan**, a fixed payer whose pay is stored (`accumulationTool.settings.salary`) also hears the share:
  "£980 a month (31% of your pay)".

The share is of **all pay before tax**, and the words say so. The legal 5% + 3% minimum is a share of a band of pay, not
of all of it (*Pension Bible: How much should I pay into my pension?*,
https://www.pensionbible.co.uk/guides/how-much-to-pay-into-pension); R4 adds the choice "of all my pay / of my pay above
the lower limit", with the limits in `rules.js` beside the other yearly figures.

The employer's part stays as entered. An employer that matches more when you pay more would bring the needed share down;
the words say "your employer's part as now" and, under more detail, "if your employer adds more when you pay more, you
would need less".

### 3.2 At what chance

**Recommended default: on course, 9 futures in 10, with the 3-in-4 figure always on the next line.**

- **One bar.** On course is 9 in 10 everywhere, held by a test (`OnCourse.js:15`; `tests/onCourse.test.js`). A
  headline at 3 in 4 would tell a person who follows it, on the same screen, that they are only "close". That is the
  confusion we were told about.
- **"A good chance" is the request.** The words we were given asked for a share that gives a good chance of the aim.
  Hymans Robertson's 2026 tables treat "better than 50/50" as the low threshold and a "good chance" as higher
  (*Minimum, moderate or comfortable? Retirement Living Standards*, July 2026,
  https://www.actuarialpost.co.uk/downloads/cat_1/Hymans-minimum-moderate-or-confortable-retirement-living-2026.pdf);
  Fidelity's savings-rate guidance is set at 90% in poor markets
  (https://www.fidelity.com/viewpoints/retirement/how-much-money-should-i-save).
- **The two mistakes do not cost the same.** Paying in too little, found late, is dear to fix; paying in too much, found
  late, is cheap (pay in less, stop sooner, spend more). We lean slightly pessimistic.
- **Why 3 in 4 sits beside it.** Kitces' work on regular reviews shows that high bars can be over-cautious when the
  person checks and adjusts (*Monte Carlo retirement projection: probability of success, adjustment, minimum odds*,
  https://www.kitces.com/blog/monte-carlo-retirement-projection-probability-success-adjustment-minimum-odds/), and a
  saver who checks in each year can adjust. Showing the 3-in-4 figure makes the cost of more certainty visible: for Sam,
  9 points of pay.
- **Nothing is removed.** B's `confidence` choice (`src/answers/b/schema.js:52`) stays; choosing 3 in 4 changes which
  figure leads, never the verdict's bar (`answer.js:388`, `:393-394`). With the bands of 2.1, today's "That is no more
  than goes into your pension now" (`sentences.js:240-241`) can only appear in the Close band, and it becomes "For 3
  futures out of 4, what you pay in now is already enough", which names its chance.

### 3.3 How it is computed

The solver is `leastPayIn` (`stopAt.js:589-616`) on `lastsWithin` (`stopAt.js:546-549`), exactly as B solves today
(`payInsThatGetThere`, `answer.js:261-293`). What is added:

1. **Shares searched on the grid itself.** For a share kind with pay P and employer share e, the person's part o is
   searched on a grid of 0.5% of pay, by bisection over grid steps, with ok(o) = `lastsWithin` at that share's pounds,
   P × (o + e) / 1,200 (`payInParts`, `payIn.js:28-32`). B's £10 figure c* (the least whole £10 a month that passes) is
   only a hint for the bracket, as `guessFrom` is for `leastPayIn`: the grid steps either side of c*'s pounds are tried
   first, so the usual cost is one or two `lastsWithin`. Nothing is inferred from "more paid in never makes a life
   fail": the engine does not promise it (PB1 allows one life of slack, `tests/v7/b/properties.test.js:42-56`;
   `leastPayIn` records a real case where it does not hold, `stopAt.js:593-596`), so a grid step counts as passing only
   when it was tried. Sam at 3 in 4: c* = £690; 21.5% in all (£680.83) is tried and fails, 22% (£696.67) is tried and
   passes.
2. **The count said is the count at the figure said.** Every share or pound figure the words state is asked once more in
   full at exactly those pay-ins (`verdictAtPayIns`, `stopAt.js:551-554`), and that count is the one in the sentence.
   If the full count at the found share does not pass (a few pounds where the test is not monotone), the share steps up
   one grid step and is counted again, until it passes or reaches the cap: the share said is always one whose full
   count passed. A couple's two shares are each rounded up to the grid, so the household figure rises a little; the
   count is the count at the rounded figures.
3. **Caps.** A person's part is never above 100% of their pay: if it would be, the state is "out of reach by paying
   in", and the other ways lead. B's existing ceiling of £10,000 a month a person stays (`rules.js:47`;
   `answer.js:334`), and the figure is checked against the annual allowance and, for O, the £10,000 allowance
   (`answer.js:550-555`).
4. **No pay, no share.** A share is said only when the pay is above £0. The share kind allows pay £0
   (`schemaParts.js:115`), and then every share lands £0 (`payIn.js:28-32`), so a person on a career break (row I) would
   be told "even all of your pay would not be on course". Instead, with pay £0 or none, "enough" is said in pounds a
   month, the 100%-of-pay cap is never used, and while paused the employer's part is "as you gave it (nothing while you
   are not paying in)". Until R4 the pounds are from now (3.5 says so); from R4 they are from the restart, and can be a
   share of the pay at the restart (3.4).
5. **Stopping before a pension can be touched** (row P). B already solves two parts: the savings a month that carry the
   closed years (`payIn.outside`, `answer.js:261-292`), then the pension pay-in with those savings in place. The share
   is searched for the pension part with the savings part held at B's figure, and the words give both (3.5). When the
   pension part is already enough and only the savings fall short (`savingsOnly`, `sentences.js:222-232`), no share is
   searched: the answer is the savings a month alone.
6. **Couples.** The household total is split by today's ratio (`answer.js:328`), then each part is said in that
   person's own kind.

**Cost.** Measured on our development machine (Node 24, 4 Nov 2026), Sam's whole answer takes 160 ms at 100 futures and
1.23 s at 1,000, including both solves, the stop-later search and the riskier mix (`src/v7/effects/run.js:28` runs the
100 pass, then the 1,000). The shares add, per chance shown, one or two `lastsWithin` when the hint lands (a few more
by bisection when it does not), and one full count per figure stated (two; one more in the rare case of step 2). The
one-off lever below adds one bracketed search, like each of today's two solves. The budget we set: the 1,000-future
answer no more than 25% slower than today, measured on the build (section 8).

### 3.4 The ways beside it

Each is the one test with one thing changed, worked out on the same lives, and said with its own count:

| Way | How | Status |
|---|---|---|
| Stop later | the first later age at which today's pay-in passes (`answer.js:416-421`) | exists |
| Aim lower | the bad-case income at today's pay-in (`answer.js:429-432`) | exists |
| More risk while saving | B again one level up (`answer.js:433-441`) | exists |
| **A one-off sum now** | the least whole £1,000 into the pension today, paying in as now: the pension at the stop becomes (pot + L) × F_i + c × B_i. `runnerAtPayIns` (`stopAt.js:531-543`) takes it as a `pensionOf` change; the kernel exposes F (one word in `saving.js:278`). Bracketed from each life's own least pot, as `guessFrom` does (`answer.js:226-254`, the `least` array from `answer.js:361`). Said "with the tax the government adds back" and checked against the annual allowance (carrying forward unused allowance is not modelled; the words say so) | new, R1 |
| **The grid in shares** | B's stop age × pay-in grid (`schemaParts.js:395-423`; `answer.js:446-467`) with columns in whole shares of pay for a share payer, each cell the count: the table Hymans publishes, for one person's own figures | new, R1 |
| **A yearly step-up** | "raise your part by 1% of pay each year until N% in all": the pension at the stop is A_i + Σ_y c_y × b_{i,y}, so the least N needs no saving run. The same yearly parts give "start again at N% from {month}" for row I (a restart rounded to the next whole saving year, the cautious side) | new, R4 |

A Save More Tomorrow-style step-up is the most effective tested way of raising saving rates (Thaler & Benartzi, JPE
2004,
https://www.chicagobooth.edu/research/rustandy/social-impact-research/research-papers/2004/save-more-tomorrow-using-behavioral-economics-to-increase-employee-saving),
although a later review rated the causal evidence low; we offer it as a way, never as advice.

### 3.5 The words

The verdict's first sentence has already named the share (2.2). This block, straight under the incomes and gap, gives
the pounds, how long, the 3-in-4 figure and the other ways. Sam paying 10% (measured):

> **To be on course: 31% of your pay in all**
> You 27% and your employer 4% as now: £982 a month going into your pension from now until you are 63, going up with
> prices. Your money lasted until you are 95 in 9 futures out of 10.
> For 3 futures out of 4: 22% in all (you 18%), £697 a month.
>
> Other ways, each paying in as now:
> – Stop at 73 instead of 63: lasted in 9 futures out of 10.
> – Spend £1,310 a month from 63 instead: lasted in 9 futures out of 10.
> – Put {lump} into your pension now: lasted in 9 futures out of 10.
> – Mix them: the table of ages and shares of pay.

A fixed payer: "**To be on course: £{amount} a month into your pension**" … "That is £{extra} a month more than now."
(`sentences.js:235-239` as today, moved below the verdict). Out of reach by paying in: "**Even all of your pay going in
would not be on course for £1,810 a month from 63.** These could:" and the ways. On the plan, where the scheme is
stored: "Under relief at source that costs you £{cost} a month from your take-home pay."

Close (Sam paying 22%): the block leads with what is enough for 9 in 10 and says the 3-in-4 line as 2.1 gives it: "For
3 futures out of 4, what you pay in now is already enough."

No pay given, or pay £0 (row I): "**To be on course: {amount} a month into your pension**", with "your employer's part
as you gave it (nothing while you are not paying in)" when one was given. Until R4 the figure is from now, and the words
say "if you start again later, you would need more"; from R4 it is from the restart month (3.4).

Stopping before a pension can be touched (row P, Sam stopping at 55 with pensions open at 57):

> **To be on course: {share} of your pay into your pension, and {savings} a month into ISAs or savings until 55**
> The savings carry the years from 55 to 57, before you can take money from a pension; the pension carries the rest.

And when only the savings part is short:

> **What goes into your pension is enough. The years from 55 to 57 need {savings} a month into ISAs or savings until
> 55.**

(These two are B's `b.payIn.head` and `b.payIn.head.savings` today, `sentences.js:222-232`, said in shares of pay.)

### 3.6 Writing a share back

- **The "Try" doors** (`payInTo.js:39-50`): for a share kind, write the share and keep the kind (`ownPct` from the
  door's figure, the employer's share as entered). The comment at `payInTo.js:12-14` gives as its reason that a figure
  cannot be put as a share of pay without guessing the pay, but a share kind has the pay. The pounds path stays for the
  other kinds.
- **Keeping the answer** asks which pay-in the plan keeps, with two buttons and neither chosen: "Keep: paying in as
  now (10%)" and "Keep: paying in 31% (on course)". Today the kept plan pays in as now, and the suggestion is said once,
  in the confirm line (`src/services/PlanSeed.js:281-288`).

## 4. A saver's rail

### 4.1 The steps

Saver stages are `saving`, `approaching` and `committed-saving` (`steps.js:27`; `LifeStage.js:15`, `:80-95`). A new
step, **`checkin`** ("Check in", section 5), takes the place of `pot` on saver rails. `pot` stays in `ALL_STEPS` and its
address opens the check-in, so no address breaks. A new list, `LATER`, holds steps a saver can open from the rail under
"For later" but which are never marked "Not done yet" and never named by the next sentence.

| Stage | Today (`steps.js:12-14`) | New | For later |
|---|---|---|---|
| `saving` | saving, pot, plan, budget, lock, hold, household | **saving**, **checkin**, plan, budget, household | lock, hold |
| `approaching` | plan, saving, pot, budget, lock, hold, move, household | **saving**, **checkin**, plan, budget, lock, hold, move, household (all but the first two optional) | — |
| `committed-saving` | pot (required), where, plan, saving, budget, hold, move, household | **checkin** (required when due), where, saving, plan, budget, household | hold, move while more than five years from the stop; on the rail, optional, within five |

The "five years" is `APPROACHING_YEARS` (`LifeStage.js:15`), so one rule decides when what you hold starts to matter.
On `committed-saving` with no `checkInEvery` (every plan locked before this ships, and any that never chose), the
`checkin` step is due exactly when `pot` is today: monthly, from the latest record in `accumulationTool.history`, with
no check-in needed for it to fall due (5.2).
The **saving** step ("What you pay in") gains section 2's verdict and section 3's answer inside V7, worked out by
`answerB` on `saverInputsOf` (4.4) in the answer worker, as the questions are (100 futures, then 1,000, `run.js:28`). The hand-over
button (`read.js:503`) becomes a quiet link, "The planner's pot check (fixed rates)", so the classic check stays
reachable.

The rail's results for later steps read "For later" instead of "Not recorded yet" (`read.js:568`) and show no ○
(`src/v7/components/PlanRail.jsx:11`, `:37-41`). The rail's "Ask a question" links open B with the plan's figures
(section 4.4) instead of empty (`PlanRail.jsx:53`).

### 4.2 The next sentence

The rail reads no runs: it reads the latest check-in's stored verdict (section 5.1), else nothing. New ids, tried in this
order for saver stages, after `P.readonly` and `P.noAge` (`steps.js:29`; `read.js:649-683`):

| Id | When | Words | Button |
|---|---|---|---|
| `P.agesFromSaving` | the plan is placed from the Accumulation tab's ages only (4.6) | "Next: check your age today and the age you want to stop work. We took them from the planner's Accumulation tab." | About you and when (prefilled from them) |
| `P.noAim` | no income set | "Next: say what you would want to spend from {stop}, to see whether what you pay in is enough." | Your plan → What you spend |
| `P.pot` | `committed-saving`, no `checkInEvery`, this month's pot not recorded: today's rule, unchanged (`read.js:656`) | today's words, word for word (`copy/plan.js:380`) | opens the check-in, "Each month" kept |
| `P.checkinDue` | a cadence was chosen and a check-in is due (5.2) | "Next: your {yearly / quarterly / monthly} check-in (the last was {month})." | Check in |
| `P.behind` | the last check-in was close or not on course | "At your last check-in ({month}) you were not on course yet. Next: see what would put you on course." | What you pay in |
| `P.recheck` | as today (`read.js:658`) | as today | as today |
| `P.approaching` | `approaching`, on course or not checked | "Next: see how the plan draws from {stop}." | Does it last? |
| `P.saving` | `saving`, never checked in | "Next: see whether what you pay in is enough, then check in once a year." | What you pay in (inside V7) |
| `P.onCourse` | on course at the last check-in | "On course at your last check-in ({month}). Next check-in: {nextMonth}." | none |

Gone for savers: "check you are on course in the planner" (`copy/plan.js:386`), "lock it and move what you hold to its
mix" (`:385`), "check you are still saving enough" (`:381`). "Record this month's pot" (`:380`) stays, word for word,
as `P.pot` for a locked saver who never chose how often: an absent setting keeps the old behaviour, and a fixture test
holds that plan's next sentence byte-identical (section 8). `P.working` stays for that plan too, after `P.pot`, as
today (`steps.js:29`).

### 4.3 Keeping and locking, for a saver

- **After keeping a B answer**: the first button opens the plan's "What you pay in" (the verdict and the share); the
  second starts the first check-in; "Lock this plan?" (`KeepPanel.jsx:42`) becomes a quiet link for savers. Kept answers
  from C, A and D are unchanged.
- **The lock's words for a saver** (`src/v7/copy/lock.js:9`, `:21-24`, `:32`, `:42-43`; `LockScreen.jsx:110-116`): a
  saver's lock says what it does for a saver: "Locking keeps this plan as it is today. What you pay in and your
  check-ins stay yours to change. Your check-ins are then read against the saving path drawn today. Month by month opens
  when you stop work, in {month}." The drawing lines show only to the retired stages. A saver does not need the lock
  for a fixed path: the first check-in draws one (5.3).
- **The classic stage words** (`LifeStage.js:21`, `:26`, `:31`): approaching drops "lock the plan and start moving your
  holdings into it" for "check you are on course (Accumulation), then stress-test the plan you will draw on; locking it
  and moving what you hold come when you are ready". Committed-saving's banner today says "Keep saving and buying the
  target portfolio" (`LifeStage.js:31`), the very push this note removes. It becomes: "Your plan is locked and you stop
  work in {start}. Keep paying in, and check in when it is due; the Decision tool opens when you stop." Within
  `APPROACHING_YEARS` of the stop it adds "Moving what you hold to the plan's mix can start now, if you want to." Its
  button opens the Accumulation tab, not the plan document in the Decision tab (`index.html:7302-7305`). The classic
  page names its own tool ("the Decision tool"); V7's words say "Month by month".

### 4.4 Reading a saved plan with B: `saverInputsOf`

A pure `src/answers/plan/saverInputs.js`, `saverInputsOf(plan, { today, checkIn })` → SCHEMA_B inputs, so the plan's
verdict is `answerB` itself (one test, no second model). It reads:

| B input | From |
|---|---|
| `you.age` | the Timing block's age today (`deriveTiming`, `src/services/PlanTiming.js`), else the Accumulation tab's age (4.6) |
| `you.pot` | the check-in being read, else the newest dated pot (check-in or monthly record, `saverPotOf`, `SaverReading.js:211`), else what the saving path uses (the pension lines under What you hold, else `accumulationTool.settings.potNow`, `src/services/SavingPath.js:86-92`) |
| `you.payIn` | the check-in's, else `accumulationTool.settings`: a share when `payInKind: 'share'` agrees with the pounds (4.5), else your part and your employer's in pounds landing (`contributionBreakdown(...).totalMonthly`, as `SavingPath.js:91`). Read as rising with prices, B's rule, whatever `escalationPct` says (below) |
| `stop.age` | `timing.retireAge` |
| State Pension, final-salary pension | the Stress settings, as the plan's other readers use them |
| `savings`, `savingsIn` | `isaBalance` (or the ISA lines), `accumulationTool.settings.isaMonthly` |
| `risk` | the plan's allocation as an explicit mix (`env.mix`, `toHousehold.js:87`) |
| `savingRisk` | the same saving mix the path uses: what you hold, else the plan's new optional `accumulationTool.settings.savingMix`, else the allocation. B gains `env.savingMix` beside `env.mix` (`toHousehold.js:75`) so no mix is rounded to a level |
| `charge`, `endAge` | `chargesPct`; the plan's age at its last year |
| `spend` | the plan's income steps (a year before tax) as a month after tax by `grossToNet` (`TaxCalculator.js:77`), with the later steps as B's spending shape |

Four notes. First, the verdict is B's test (Pots & Valves, cuts off; `answer.js:539`), not the plan's own way of
drawing. "Does it last?" stays the place for that, and its words for a saver say "from {stop}, the way this plan draws".
Second, a plan kept from B must give back exactly its answer's count and pay-in on the day it was kept (a test in
section 8), so the round trip through the seed (`PlanFromSeed.js:322-323` grosses up; this reads back) is held.

Third, **the saving mix**. Today the seed stores no saving risk (`PlanFromSeed.js:683-686`), and the path's saving mix
is what you hold, else the drawing allocation (`savingPathMixes`, `SavingPath.js:54-59`). Anyone who chose a saving mix
in B different from the drawing mix would get a different count on the day they kept it. So keeping a B answer writes
B's saving mix as `accumulationTool.settings.savingMix` ({ equity, bonds, cash }) when it differs from the drawing mix,
and both `savingPathMixes` and `saverInputsOf` read it after what you hold and before the allocation. Absent means
today's rule. The verdict and the path then grow the money at the same mix.

Fourth, **pay-ins rising**. B's pay-ins rise with prices; the path raises them by `escalationPct` in pounds of the day
(`SavingPath.js:94`, `:121-122`; `saving.js:302-304`), which is 0% on every kept plan today. Until R4 `saverInputsOf`
reads the pay-in as rising with prices whatever `escalationPct` says, and when `escalationPct` is not the planner's price
assumption (2.5%, 4.5) the words say so: "This reads what you pay in as going up with prices. Your plan raises it by
{x}% a year, so its saving path assumes {less / more} goes in later." From R4 the kernel's yearly parts (3.4) take the
plan's own rise, c_y = c × ((1 + x) / 1.025)^y at today's prices, and the sentence goes.

### 4.5 The plan's pay-in as a share

New optional keys on `accumulationTool.settings`: `payInKind: 'share'`, `ownPct`, `employerPct`. Absent means pounds,
the old behaviour. V7 writes the share and the pounds it lands (`salary`, `netMonthly` = own × 0.8 under relief at
source, `employerMonthly`) in one write, so the classic page needs no change and reads the pounds. If the classic page
later changes the pounds, V7 sees the share no longer agrees, to the penny, and reads pounds: the last edit wins and
nothing is guessed. `SETTINGS_KEYS` (`saving.js:51`) and the parity ledger gain the three keys, and `savingMix` (4.4).

The kept plan's pay-in rises with prices, as B's does: this settles decision D6 of
`research/saver-lock-and-savings-growth.md:646-648` (today the seed writes `escalationPct: 0`,
`PlanFromSeed.js:685`). We recommend the D6 option that same note gives: the seed writes 2.5%, the planner's own price
assumption. A share kind on the plan reads "going up with your pay; we assume pay rises with prices".

### 4.6 The classic planner (nothing removed)

- **Opening tab**, for the saver stages only (`SAVER_STAGES`: `saving`, `approaching`, `committed-saving`): the stage's
  first lead tab instead of Decision → Monthly Entry (`index.html:2216`, `:2227`); `saving` leads become
  `['accumulation', 'budget']` (`LifeStage.js:20`). Every other stage opens exactly as now: `bridge` and `running` lead
  with the Decision tool already, and changing `draft-retired` (whose first lead is `stress`, `LifeStage.js:45`) or
  `unknown` (`budget`, `:50`) would be a change outside this design. A test holds them.
- **The setup wizard** gains a door: "I'm still saving: am I paying in enough?" → Accumulation (`SetupWizard.js:228-262`).
- **One placing for both apps.** A plan whose ages are typed only on the Accumulation tab (`index.html:3648-3649`) is
  stage `unknown` today (`LifeStage.js:78-82`, no age in the Timing block), so V7's rail has no saving step
  (`STEPS.unknown`, `steps.js:11`), `checkInAllowed` would refuse it, and the classic page tells it to set up the Decision
  tool (`NextStep.js:24`, `:68`). `deriveStage` itself gains the fallback: an unlocked plan with no age in the Timing
  block but `accumulationTool.settings.currentAge` and a later `retirementAge` is placed by those ages (`saving` or
  `approaching` by the same `APPROACHING_YEARS`), with the reason "ages from the Accumulation tab". So the classic banner,
  the next-step chain, V7's rail, the next sentence and `checkInAllowed` all place it the same way. A locked plan with no
  Timing age stays `running`, as today. The Accumulation age carries no date (the Timing block's does, `currentAgeAsOf`,
  `PlanTiming.js:60-98`), so it is read as typed, and V7's next sentence asks once to confirm the ages
  (`P.agesFromSaving`, 4.2), which writes them into the Timing block through the one write path.
- **The Accumulation tab**: "What you hold" (`index.html:3690-3695`) moves below "Am I on course?", titled "What you
  hold (optional, for when you are closer to stopping)". The age sweep's refusal (`src/services/RetireSweep.js:26`) asks
  for the pot today first and names What you hold second.
- **Kept**: the FCA rows, the sweep and its confidence picker (`index.html:3684`), the pot check, holdings and the move
  (parity rule; `research/saver-lock-and-savings-growth.md` D8).

### 4.7 Parity

Nothing leaves the planner. On V7's rail nothing is removed, only moved under "For later" or out of the next sentence;
every step stays addressable (`ALL_STEPS`, `steps.js:22`). The ledger row `save.on-track`
(`tests/v7/parity/ledger.json:3426-3442`) becomes true for a saved plan, which it is not today.

## 5. The check-in

### 5.1 The data

On the plan, under `accumulationTool` (the saver's home; outside the settings the lock checks,
`src/services/LockedPlanGuard.js:44`; wiped with the plan and the account like everything else in it):

```
accumulationTool.checkInEvery: 'year' | 'quarter' | 'month'      // absent: see 5.2
accumulationTool.checkIns: [ {
  date: 'YYYY-MM-DD',                       // the day of the check-in; its month is the pot record it wrote (below)
  pot: { pension, isa | null, other | null },
  pay: number | null,                       // a year before tax, as typed; null for a fixed payer who gives none
  payIn: { kind: 'share' | 'split' | 'total', ownPct?, employerPct?, own?, employer?, total, savingsIn?, since? },
                                            // total = what lands in the pension a month; savingsIn = what goes into
                                            // ISAs and savings a month (asked when the path counts them, 5.4);
                                            // since: 'YYYY-MM', the month it began, when it changed after the last check-in
  paused: { from: 'YYYY-MM', to: 'YYYY-MM' | null } | null,
  note: string | absent,                    // at most 280 characters
  reading: {                                // frozen and small: the history reads as it was, whatever is redrawn later
    path: { source: 'document' | 'saving', asOf: 'YYYY-MM', version } | null,
    pathBand, expected,                     // SaverReading's band and middle figure at this check-in (5.5)
    band, fails, aim,                       // verdictOf's band; lives that failed out of 1,000; the aim read, one number
                                            // in the plan's unit (a year before tax)
    bad, middling, gap,                     // the two incomes and the gap a year (2.1)
    enough: { nine, nineOwnPct?, four, fourOwnPct? } | null,   // what lands a month for 9 in 10 and 3 in 4, and the shares
    engineVersion
  },
  recordedAt: ISO
} ]                                          // newest last; at most 120 (5.11)
accumulationTool.path         // an unlocked plan's saving path (5.3), the shape of planDocument.accumulation
accumulationTool.pathArchive  // the paths it replaced, newest last, at most 5 and at most 40 KB in all (5.11)
```

The frozen reading keeps only what the history row and "then and now" show: no repeated aim object, no futures or seed
(always 1,000 and 0, named once by `engineVersion`), no low and high lines (the path holds them, by `asOf`).

**One ledger for pot values.** A check-in also writes its pot as that month's pot record in `accumulationTool.history`
(the shape of `potRecordOf`, `SaverReading.js:190-193`; the same month is replaced, `saving.js:168`). So the classic
page's monthly list (`index.html:3697-3709`), the arrival check (`LifeStage.js:193-233`) and "Where you are" read it
with no change. The brief suggested `saving.checkIns[]` at the plan's root; `accumulationTool` is preferred because it
is already the saver's home, already writable on a locked plan, and already carried and wiped with the plan.

### 5.2 How often, and the reminder

- Asked once, at the first check-in: "How often would you like to check in?" — **Once a year (most people)**, Each
  quarter, Each month. Changeable at any check-in. Yearly matches the yearly statement every workplace scheme sends
  (*Statutory guidance: simpler annual pension benefit statements*,
  https://www.gov.uk/government/publications/how-to-provide-simpler-annual-benefit-statements/statutory-guidance-simpler-annual-pension-benefit-statements)
  and Unbiased's advice, which also warns that checking more often can lead to "a rash decision"
  (https://unbiased.co.uk/discover/pensions-retirement/managing-a-pension/how-do-i-check-my-pension-and-how-often-should-i-review-it).
  The research on frequent feedback points the same way (Thaler, Tversky, Kahneman & Schwartz, QJE 1997,
  https://econpapers.repec.org/RePEc:oup:qjecon:v:112:y:1997:i:2:p:647-661).
- **Absent** means the old behaviour. A locked saver (`committed-saving`) keeps the monthly pot step they have today:
  the cadence is read as monthly, and "due" is worked out from the latest record in `accumulationTool.history`, exactly
  as `P.pot` does now (`read.js:656`), so no check-in is needed for it to fall due and the next sentence is today's,
  word for word (4.2). Any other saver is not reminded until they choose.
- **Due**, once a cadence is chosen, when this month is at least the last check-in's month plus 12, 3 or 1. A chosen
  cadence is never due before the first check-in (choosing is part of the first).
- **The reminder is in the app**: the rail's step shows "Due", the next sentence says so (4.2), and the plans list shows
  "Check-in due" beside the plan. "Add to my calendar" saves a calendar file made in the browser that holds the date and
  the words "PensionTools check-in", no figures. No email and no notification: those would need consent and a service we
  do not run.

### 5.3 The path a check-in is read against

The path is the one `SavingPath.js` already draws: 1,000 lives at seed 0, the same lives B uses
(`SavingPath.js:39-41`, `:119-122`), the middle line and the 1-in-10 bad and good lines of pension plus ISA in pounds of
the day (`SavingPath.js:141-156`).

- **Locked**: the plan document's `accumulation`, as today. Its "Refresh" restarts the clock
  (`research/saver-lock-and-savings-growth.md` §4.3).
- **Unlocked**: `accumulationTool.path`, drawn by the same `buildSavingPath` (`SavingPath.js:80-157`) at the first
  check-in, from that check-in's pot and pay-in. As written, `buildSavingPath` cannot do that: it takes the pension pot
  from the holdings ledger first and only then from `accumulation.potNow`, the ISA from the holdings or
  `settings.isaBalance`, and the pay-in from `accumulationTool.settings` (`SavingPath.js:84-93`). So it gains explicit
  inputs, `{ potNow, isaNow, totalMonthly, isaMonthly }`, each used in place of what it reads when given; the holdings
  then decide only the saving mix (`:85`, `:101`). The first check-in passes its own pension, ISA, pay-in and
  `savingsIn`, the head records `potSource: 'check-in'`, and a test holds that the path's year-0 middle line equals the
  check-in's pot. A lock calls it as today, with no explicit inputs, so a locked plan's path is unchanged. The path is
  redrawn only when the person says so ("Start the path again from today", from that check-in's figures), and the old
  one goes to `pathArchive`. A lock draws the document's own path, as today, and check-ins read that one from then on.
  The history shows where the path changed.
- **A check-in never redraws the path**, and never changes a setting. This is the ProjectionLab lesson: progress only
  means something against a plan fixed from an earlier date
  (https://projectionlab.com/help/overlay-actual-progress).

The reading is `saverReading` (`SaverReading.js:131-170`), handed `{ accumulation: path }` for an unlocked plan: the
same function, no second reading.

### 5.4 The screen

1. **Where you are today.** Your pension pot today; your ISAs and savings (asked when the path counts them,
   `pathCountsIsa`); anything else (optional). Prefilled with nothing: these are records, typed.
2. **Has anything changed?** Your pay a year before tax, what goes into your pension each month and, when the path
   counts ISAs and savings, what goes into them each month, each prefilled from the last check-in or the plan, in the
   person's own kind. If what goes in has changed since the last check-in: "From which month?" "I stopped paying in for a while": from and to (or "not started again yet"). Anything else (the State
   Pension forecast, a final-salary pension, the age in mind, what you want to spend) is a link to that part of "Your
   plan"; the check-in does not write it.
3. **A note** (optional): "For you: what changed, in a few words. Please leave out anything about your health."
4. **The first time only**: how often.
5. **Check in** writes the check-in and the month's pot record in one write through the one write path
   (`src/v7/effects/planWrite.js`), then shows the result.

### 5.5 The result

> **Checked in for November 2027**
> **Not on course for £1,810 a month from 63**: paying in 20% of your pay as now, your money lasted until you are 95 in
> only 7 futures out of 10. 29% of your pay in all (you 25%, £918 a month) would put you on course, which is 9 in 10.
> **To be on course from here**: £918 a month going into your pension from now until you are 63, going up with prices;
> for 3 futures out of 4, {share} ({amount} a month). Other ways: …
> **Against your saving path**: your pot of £74,600 is between the middle (£71,000) and the good-case line (£83,000)
> the plan expected by now. In 9 futures out of 10 it expected at least £62,500.
> **Since your last check-in (November 2026)**: your pot went from £62,000 to £74,600. Paid in, as recorded: into your
> pension £317 a month for 1 month and £633 a month for 11 months, £7,280; into ISAs and savings, nothing. Markets,
> charges and anything not recorded: +£5,320.
> Then: lasted in 3 futures out of 10. Now: 7 out of 10. To be on course then: 31% of your pay; now: 29%.
> A pot can move a lot in a year. The path's bad-case and good-case lines show how far, in 9 futures out of 10.
> Next check-in: November 2028. [Add to my calendar]

(Sam a year on, having raised what goes in from 10% to 20% of pay in all from December 2026. The figures are illustrative:
they show the shape, not a measured case.) The parts, in this order:

- **The verdict from here** is section 2 on the check-in's own figures (`saverInputsOf` with the check-in), with what
  would be enough in its first sentence. It is the headline, so "on course" means one thing everywhere.
- **To be on course from here** comes straight after it, before the path and what changed: what would be enough is the
  answer a saver came for. It is section 3's answer from here, and its ways. When on course: "You could pay in as little
  as …" only when it is lower than now.
- **Against the path** is the progress line. The band words name the lines the way V7 already does: below the
  bad-case line (the worst 1 in 10), between the bad-case line and the middle, between the middle and the good-case
  line, above the good-case line (the best 1 in 10) (`SaverReading.js:162`). Behind the path and on course can both be
  true (the plan had a margin); the words say both.
- **What changed** is about the pot the path counts: the pension, plus ISAs and savings when the path counts them
  (`pathCountsIsa`; `SaverReading.js:143`, `:155`). Paid in = each recorded pay-in, into the pension (`total`) and into
  ISAs and savings (`savingsIn`), × the months it applied between the two check-ins (the last check-in's until this
  one's `since`, then this one's; months paused at £0). The rest is "Markets, charges and anything not recorded": money
  moved in or out, money taken out, the lag before the tax added back lands, and any change of pay-in that was not
  recorded all fall there. So the parts add up to the change in that pot exactly, to the pound, and the words never
  claim the rest is markets alone. When the path counts the pension only, so does this line, and it says "your
  pension".

The words follow what worked in Nest Insight's tests: start from today, small steps, "you're already on your way"
(*Small steps to a better future*, Invesco with Nest Insight, https://invesco.com/uk/en/nest-insight-research/small-steps.html).

### 5.6 When pay or what goes in has changed

- The check-in keeps the new pay and pay-in as facts of that date, and the verdict from here uses them.
- The plan's settings change only on an explicit button after the result: "You now pay in 12% in all; your plan says
  10%. **Use 12% in my plan**." That writes `accumulationTool.settings` (allowed on a locked plan,
  `LockedPlanGuard.js:44`).
- The path is not redrawn. When the pay-in differs, the reading says "The path was drawn paying in £317 a month; you
  now pay in £380".
- A pay rise in line with prices changes nothing, because the model is at today's prices (`saving.js:5-6`). A rise
  above prices raises a share payer's pounds at today's prices, and the verdict shows it.
- A pause still running: the verdict at £0 now, and from R4 "if you start again at {share} from {month}" (3.4).

### 5.7 The history

"Your check-ins", read like Month by month's History is for a person drawing. One row a check-in, newest first:
date; pot (pension, ISA); pay; what goes in (share and pounds); against the path (band, and the expected figure);
the verdict (futures out of 10); to be on course (share); the note. Exact figures only (a record: `banned.js:194`).
Rows where the path changed carry a line, "Path from March 2027 (the lock)". The plan's export
(`src/services/PlanExport.js:1-6`: the whole plan as a file) carries the check-ins with no change, so a person's copy of
their data includes them.

### 5.8 Never on a drawdown plan; a locked plan stays locked

- `checkInAllowed(stage)`, beside `decisionEntryAllowed` (`LifeStage.js:119`): only in `SAVER_STAGES` (`steps.js:27`).
  From the stop month the plan is `running`, the check-in screen becomes the read-only "Your saving years", and the
  arrival check (`LifeStage.js:193-233`) and Month by month take over.
- A check-in writes only `accumulationTool.checkIns`, `.history`, `.checkInEvery` and, the first time or on "Start the
  path again", `.path` and `.pathArchive`: never
  `stressTool.settings`, never `decisionTool.settings`, never the plan document. A locked plan stays locked
  (`LockedPlanGuard.js:44`).

### 5.9 The classic planner's equivalent

None to build: 7.0.0 makes V7 the main page and moves the classic one aside (`research/v7/road-to-7.md:171-195`). The
check-in's pot appears in the classic page's monthly list because it is the same record (5.1).

### 5.10 Data protection

Pot values over time are already stored (`accumulationTool.history`), and so are pay and pay-ins
(`accumulationTool.settings.salary`, `netMonthly`, `employerMonthly`; `fromAnswer`, `compliance/GDPR_TODO.md:143-144`).
The policy's "Financial data" row (`compliance/PRIVACY_POLICY.md:25`) names neither pay nor pay-ins, and its purpose is
"run your drawdown plan". A check-in adds a dated history of pay and pay-ins and a free-text note. Recommended:

- `PRIVACY_POLICY.md:25`: add "pay and what you pay into pensions, your saving check-ins and any note you write" to the
  examples, and "and your saving plan" to the purpose. Same lawful basis (contract), same storage, same deletion.
- `GDPR_TODO.md`: one entry. The note is free text and could hold special-category data. The screen asks people to
  leave out health details, the note is capped at 280 characters, it is deleted with the plan and the account, and the
  plan's export includes it.
- No new collection, no new server, no new processor.

### 5.11 Size

A plan is one Firestore document of at most 1 MiB (`src/v7/effects/planWrite.js:138`), and it already holds up to 600
pot records (`RECORDS_KEPT`, `saving.js:49`; about 130 bytes each), the plan document and an archive of up to ten
(`ScenarioRepository.js:638`; about 6 KB each, `research/saver-lock-and-savings-growth.md:629`), Month by month's
history and the holdings. So the check-in has a budget of its own:

- **At most 120 check-ins.** That is 120 years yearly, 30 years quarterly and 10 years monthly; a monthly cadence
  already has the pot records for the months before. When a new check-in would pass the cap, the oldest goes; its
  month's pot record stays in `accumulationTool.history`, so the pot line is unbroken. The screen says so from the
  110th: "Your oldest check-in will be dropped to make room. Download your plan to keep a copy of every one."
- **A small frozen reading** (5.1): one check-in, field names included, is about 0.5 KB without a note and about 1.3 KB
  with a full note in characters that take three bytes each. 120 of them: at most about 160 KB.
- **`pathArchive`** at most 5 paths and at most 40 KB in all; when over, the oldest goes first.
- **A test**: a plan with 120 check-ins with full notes, 600 pot records, a path and a full `pathArchive`, a plan
  document and an archive of ten, measured as Firestore counts a document (field names and values in UTF-8), stays
  under 600 KB, and the check-in's own parts under 250 KB. It runs with the suite, so a later field that grows the
  record fails it.

### 5.12 As built (release step R3, 5 Nov 2026)

Built as written, with these choices made while building, each kept to the one-test rule:

- **The frozen reading's units.** `aim`, `bad` and `middling` are a month after tax at today's prices and `gap` a year,
  exactly as the test reads them (B's `spend.perMonth`, `income`, `gap.year`), so a reading is never turned back into a
  plan figure through the tax sums; the plan's own figure a year before tax is on the plan. `enough` keeps the share in
  all (`nineTotalPct`, `fourTotalPct`) beside the person's part, and `fourNow` when today's pay-in was already enough for 3
  futures out of 4.
- **A path locked before 6.22.0** (version 2) is in the prices of the day it was drawn; `saverReading` places the pot by
  turning it back into those prices. The words set the pot as typed beside the lines, so the lines are raised by the same
  2.5% a year (the frozen `expected` too: it is in the pounds of the check-in's own month), and a note says so. Without
  that, a pot placed below the middle was said beside a middle figure lower than itself.
- **The ISA box is always on the screen**, needed only when the path counts ISAs and savings (5.4); before an unlocked
  plan's first check-in there is no path yet, so it is optional and decides whether the path counts them: left blank,
  the path counts the pension only — neither what is in ISAs and savings nor what goes into them — and the box's help
  says so. "What changed" counts ISAs and savings only when both check-ins gave the figure (a blank is never £0).
- **A second check-in in the same month corrects the first** (the pot record's own rule); while it is the only one, the
  path drawn from it is drawn again from the corrected figures.
- **A pause** is `{ from, to }`, `to` the month paying in started again (null: not yet); its months count £0 in "what
  changed", and a pause still running reads as £0 going in now, in the same kind (a share stays a share).
- **One next sentence more than 4.2's table**: `P.nextCheckIn`, "You checked in for {month}. Next check-in: {nextMonth}."
  (no button), after `P.onCourse` and before `P.saving`. It shows when a cadence was chosen and there is a last check-in
  with no verdict to say — the plan had no aim yet, or figures the test cannot take — so the next sentence still names
  the next check-in rather than falling back to the first step.
- **Where it lives**: `src/answers/plan/checkIn.js` (the screen's reading and the writes), `checkInDue.js` (the due and the
  last band, the light part the rail and the plans list read), `src/v7/screens/plan/CheckInScreen.jsx`,
  `src/v7/copy/checkin.js`; the run in the worker's own `checkIn` lane; the write in `planWrite.js`, held to
  `LockedPlanGuard.CHECK_IN_KEYS`.

## 6. What we must decide

Yes or no, with the answer we recommend.

1. **The solver's headline is "on course" (9 in 10), with the 3-in-4 figure always on the next line?** — **Yes.** The
   other way (3 in 4 first) would have the screen call a person who follows its advice only "close"; to make it
   consistent we would have to give savers a second bar.
2. **The verdict's bands are V7's own `verdictOf` (on course at 9 in 10, close from 3 in 4), with the gap in pounds said
   in both lower bands, and the classic page keeping its own 7-in-10 line?** — **Yes.** The other ways: `OnCourse.js`'s
   7 in 10 (two "close" bars inside V7), or bands by the share of the aim covered in a bad case (80%).
3. **The aim and the gap are said in the unit the aim was given in** (B: a month after tax, plus the gap a year; the
   plan: a year before tax, through `TaxCalculator`)? — **Yes.**
4. **The share is searched on 0.5% steps of pay?** — **Yes.** Whole percentages are the other way: simpler, but up to
   1% of pay more than needed.
5. **R1 says "of all your pay before tax"; the choice of a band of pay comes in R4?** — **Yes.**
6. **The employer's part stays as entered, and matching is not modelled (the words say it would lower the figure)?** —
   **Yes.**
7. **Keeping a B answer asks "as now" or "on course", with neither chosen?** — **Yes.**
8. **The check-in lives under `accumulationTool` (`checkIns`, `checkInEvery`, `path`, `pathArchive`), not a new root
   key?** — **Yes.**
9. **A check-in's pot is also the month's pot record (one ledger)?** — **Yes.**
10. **Default cadence once a year; quarterly and monthly as choices; a locked saver with no choice keeps today's monthly
    pot step, due from the latest pot record, word for word?** — **Yes.**
11. **An unlocked saver gets a path fixed at the first check-in, redrawn only when they say so?** — **Yes.**
12. **The lock is never a saver's next step, and its words for a saver are a saver's?** — **Yes.**
13. **What you hold and the move are "for later" on `saving` (and on `committed-saving` while more than five years from
    the stop), optional and never named by the next sentence on `approaching`?** — **Yes.**
14. **A pay-in seen at a check-in reaches the plan only by "Use these in my plan"?** — **Yes.**
15. **Reminders stay in the app, plus a calendar file made in the browser?** — **Yes.**
16. **A note of at most 280 characters, with the health hint, and the policy line of 5.10?** — **Yes.**
17. **The plan's pay-in rises with prices (D6: the seed writes 2.5%)?** — **Yes.**
18. **The living standards in `rules.js:30-33` (the 2024 figures) are updated through the yearly checklist before
    the "no aim" picks lean on them?** — **Yes.** The 2026 figures reported to us differ (section 9).
19. **R1–R2 ship before 7.0.0; R3 too if it is ready, since 7.0.0's gate 3 asks for a screen for every rail step
    (`road-to-7.md:178`) and `checkin` joins the rail only with R3?** — **Yes.**
20. **At most 120 check-ins, a small frozen reading, and a size test under 600 KB for a full plan (5.11)?** — **Yes.**
    The other way is the pot records' 600, which could take a plan past its 1 MiB.
21. **"What changed" counts the pot the path counts, records what goes into ISAs and savings at each check-in, and calls
    the rest "Markets, charges and anything not recorded"?** — **Yes.** The other way is a pension-only line, simpler
    but blind to ISA saving for anyone whose path counts it.
22. **Keeping a B answer stores its saving mix (`savingMix`), read by the path and by `saverInputsOf`?** — **Yes.**
23. **`deriveStage` places an unlocked plan by the Accumulation tab's ages when the Timing block has none (4.6)?** —
    **Yes.** The other way leaves such a plan "Getting started" in V7 and a saver on the classic page.

**Review findings taken in part** (all sixteen findings of the 4 Nov review were taken; these are where we chose
differently within them):

- The bottom band's headline is "Not on course for …", not A's and D's "Not at … on these figures": B's question is
  whether you are on course, and the band's bar is theirs.
- For "what changed" we chose to record ISA and savings pay-ins (one of the two ways offered), so the line covers the
  same pot the path does.
- For B's saving mix we chose to store it on the plan rather than read `fromAnswer.inputs.savingRisk`: the stored
  inputs go stale as soon as the plan's mix is edited, and the path must read the same mix as the verdict.
- The Accumulation-age fallback applies only to unlocked plans: a locked plan with no Timing age is `running` today
  and has records, and moving it would change a plan that is drawing.

## 7. The release steps

Each step ships on its own, with a release note (`RELEASING.md`; `tests/releases.test.js`). The lead numbers them. Draft
lines for What's new are given in our voice.

1. **R1 — B says it straight and says what would be enough.** The verdict's band (`verdictOf`), the two incomes, the
   gap and the bad case at the aim (`result.verdict`, `.income`, `.gap`), with the State Pension and other incomes
   named; the share that would be enough in the verdict's first sentence; the screen order (verdict, then enough, then
   the guide number); shares of pay for the share kind searched on the grid (3.3), both chances, each count re-asked at
   the figure said; pounds, not shares, when the pay is £0; the two parts for stopping before a pension can be touched;
   the one-off lever; the grid in shares; the "Try" doors keep a share (3.6); Keep asks "as now" or "on course". No
   saved data changes.
   *Note*: "Am I saving enough? now says plainly whether you are on course and, in the same sentence, what share of your
   pay would put you on course. It also says what you could spend from your stop age, with your State Pension, and how
   much less than you want that is, in pounds a year."
2. **R2 — A saver's plan answers it too, and stops pushing.** `saverInputsOf`; the saving step's verdict and answer
   inside V7; the rail's new order, "For later" and next sentences (4.1–4.2); Keep and lock for a saver, and the classic
   stage words (4.3); the saving mix kept and the words on how pay-ins rise (4.4); the share on the plan (4.5) and D6;
   the classic page's opening tab for savers only, wizard door, one placing from the Accumulation ages and "What you
   hold (optional)" (4.6); the parity ledger rows.
   *Note*: "Your saving plan now tells you whether you are on course, and what would get you there, without leaving the
   page. Recording what you hold and moving it to your plan's mix are now for later, not the next step, while you are
   saving."
3. **R3 — Check in.** The data (5.1), the cadence and reminders, with today's monthly step kept when none is chosen
   (5.2), the path for unlocked plans and `buildSavingPath`'s explicit inputs (5.3), the screen, the result, what changed
   and the history (5.4–5.7), the guard (5.8), the policy line (5.10), the size budget (5.11).
   *Note*: "You can now check in with your saving plan once a year, or each quarter: tell it your pot and what you pay
   in, and see whether you are still on course, how your pot compares with where the plan expected it to be, and what
   has changed since last time. Your check-ins are kept as a history."
4. **R4 — Pay-ins that change over time.** The kernel's yearly parts in `runnerAtPayIns` (3.4): a yearly step-up, a
   pause with a restart; shares of all pay or of the band of pay.
   *Note*: "Your saving plan can now show what raising what you pay in a little each year would do, and what starting
   again after a break would do. You can also say whether your share is of all your pay or only the part the workplace
   rules use."
5. **R5 — Couples as a household.** A linked couple's verdict and check-ins read both plans as one household (B's couple
   mode), each part said in its own kind.
   *Note*: "If you and your partner each have a saving plan and have linked them, they are now read together: one answer
   between you, with each of you told what share of pay would put you on course."

## 8. The tests

**The solver** (new, beside `tests/v7/b/properties.test.js` and `tests/v7/b/solve.test.js`; fictional inputs, the
property generators the B suite already has):

- **Monotone in the pay-in, in shares, to one life**: a higher share never lasts in more than one fewer future (PB1,
  `properties.test.js:42-56`, in shares, with its slack).
- **The stated share passes the full count**: asking B again with `ownPct` = the found share is on course with at most
  floor(n/10) failures, always. One grid step less fails, allowed to miss by one life as PB1 does (unless the found
  share is the floor). The same for 3 in 4 at floor(n/4) (PB6 in shares, `properties.test.js:130`).
- **The search tries every step it passes**: in a case built where the test is not monotone at a few pounds (the OT2
  seed, `stopAt.js:593-596`), the share said passes its full count.
- **No pay, no share**: with pay £0 the answer is in pounds, never "even all of your pay", and never a share.
- **The closed years**: stopping before a pension can be touched, the pension share and the savings a month are both
  stated; at them the test passes; the savings-only case states no share.
- **The count it claims is the one test's**: every count in every sentence equals `verdictAtPayIns` at exactly the
  pay-ins that sentence names.
- **Shares and pounds agree**: the share's pounds are at least B's £10 figure and less than it plus one grid step.
- **Never above 100% of pay**: the person's part is in [0, 100]; past that the state is "out of reach by paying in".
- **3 in 4 never needs more than 9 in 10, in shares** (PB5, `properties.test.js:119`).
- **The employer's share is as entered** in every figure said.
- **The one-off sum**: at the found sum the test passes; £1,000 less does not.
- **The gap and the band agree**: on course exactly when the gap is £0 (to B's £10 step); the band equals
  `verdictOf(fails, futures)` for every answer, and equals what B's kept seed stores (`planSeed.js:304`).
- **The Close band's 3-in-4 line**: in the Close band the words say today's pay-in is enough for 3 in 4, and never
  state a 3-in-4 figure above today's pay-in; in the bottom band the 3-in-4 figure is above it.
- **The round trip**: a plan kept from B (fixture below), read by `saverInputsOf` on the day it was kept, gives the same
  count and the same needed pay-in as the answer, including one kept with a saving mix different from the drawing mix.
- **Pay-ins rising**: a plan whose `escalationPct` is not 2.5% gets the sentence of 4.4; one at 2.5% does not.
- **Cost**: the 1,000-future answer for the fixtures' inputs is no more than 25% slower than before R1 (a timing test
  run with the nightly set).

**The rail**: for every saver stage and fixture, the next sentence never names `hold`, `move`, `lock`, `month` or
`taxyear`; `LATER` steps are addressable and unmarked; `pot`'s address opens the check-in; retired stages are
byte-identical to today (`tests/v7/plan/stages.test.js`, `rows11bSteps.test.js`). A plan locked before this change, with
pot records and no `checkIns` or `checkInEvery`, gives a byte-identical next sentence (`P.pot`, then `P.working`)
month by month. A plan with ages only on the Accumulation tab is placed as `saving` or `approaching` by `deriveStage`,
the same on the classic banner and V7's rail; a locked one with no Timing age stays `running`.

**The classic page**: `bridge`, `running`, `draft-retired` and `unknown` open on exactly the tab they open on today;
only the saver stages open on their first lead. The committed-saving banner never says "buying the target portfolio".

**The check-in**: it writes only the `accumulationTool` keys of 5.8 (every other byte of the plan compared); a locked
plan passes `lockedPlanWriteRefusal` and stays locked; the month's pot record is written or replaced; the reading equals
`saverReading` for the same pot; the frozen reading survives a redrawn path; due dates across month ends, leap years and
each cadence; `checkInAllowed` refuses from the stop month; "what changed" (pension and, when the path counts them, ISAs
and savings) adds up to the change in the pot the path counts, to the pound; the path drawn at a first check-in starts
at that check-in's pot (year 0's middle line), with holdings recorded or not; the size test of 5.11; the 121st
check-in drops the oldest and keeps its pot record.

**Words**: every new sentence passes `banned.js` (no "on track", "contribution", "target income", "projection",
"shortfall", "confidence", "paths", "about £" in records) and `tests/v7/e2eRules.test.js`.

**Fixtures** (fictional; next free numbers after those `research/plan-start.md` §7 names): `saver-share-of-pay` (Sam,
41, kept from B), `saver-fixed-self-employed` (Sam, 38), `saver-couple` (Alex and Sam, linked), `saver-before-access` (Sam, 45, stopping
at 55), `saver-ages-accumulation-only` (Alex, 30, ages typed only on the Accumulation tab), and today's
`05-saver-committed.json` with three yearly check-ins and a pause added (today's file, unchanged, stays as the plan
locked before this change).

**Browser** (the test account, fictional data): B for Sam shows "Not on course", 31% in the first sentence, both incomes
with the State Pension named, the gap a year, 22% for 3 in 4,
and the grid in shares; keeping asks "as now" or "on course"; the plan's rail opens on "What you pay in" with the verdict
inside V7, "For later" holds what you hold; a first check-in asks how often and draws the path; a second, a year on (the
test clock), shows the band, what changed and the history row; a locked saver's check-in leaves the lock in place.

## 9. Found along the way

- **The living standards in `rules.js:30-33` are the 2024 figures** ("Update with them (the yearly update
  checklist)", `rules.js:29`). The figures published in June 2026 and reported to us (one person: £13,900 / £32,700 /
  £45,400; two: £22,500 / £45,400 / £62,700; *Which?*, 1 Jul 2026,
  https://www.which.co.uk/money/pensions-and-retirement/starting-to-plan-your-retirement/how-much-will-you-need-to-retire-aNmlv7V7sVe9)
  differ. To check against the source before updating.
- **The "Try" doors' reason for writing pounds** (`payInTo.js:12-14`) does not hold for a share kind, which carries the
  pay (3.6).
- **With 3 in 4 chosen**, a person who is short at 9 in 10 can read "That is no more than goes into your pension now"
  (`sentences.js:240-241`) as being on course. With the bands of 2.1 that sentence can only fall in the Close band, and
  its words name the chance.
- **Second bars differ across the app.** On course is 9 in 10 everywhere, but the line below it is not one rule:
  `verdictOf`'s 3 in 4 (V7's questions and rail), `OnCourse.js`'s 7 in 10 (the classic page), 0.7 in
  `src/answers/plan/household.js:337` and 0.85 in `src/answers/plan/lasts.js:274`. This design uses `verdictOf`. The
  others should be looked at when their screens are next touched; nothing here changes them.
- **The committed-saving banner** on the classic page (`LifeStage.js:31`) tells a locked saver to keep "buying the
  target portfolio" years before the stop (4.3).
- **`buildSavingPath` prefers the holdings ledger** over any other pot (`SavingPath.js:84-93`). Right for a lock; wrong
  for a path drawn from a check-in's own figures, hence its explicit inputs (5.3).
- **The salary sacrifice cap.** From April 2029 the National Insurance saving on salary sacrifice is capped at the first
  £2,000 a year (*Which?*, 26 Nov 2025,
  https://www.which.co.uk/news/article/chancellor-confirms-salary-sacrifice-cap-for-pension-contributions-what-it-means-for-you-a9c5n7u9K0Xa).
  What lands is unchanged, so no verdict moves. The cost to take-home pay that R2 shows from `AccumulationEngine.js` must
  be checked against that rule before it is shown for years from 2029.
