/**
 * Release notes — the one record of what each version changed, what it corrected, how it
 * affects the plans users have already saved in each tool, and what they may need to do.
 *
 * This file is DATA the app renders (the once-only "What's new" pop-up and the What's new page)
 * and a CONTRACT the test suite enforces (tests/releases.test.js): the top entry's version must
 * equal package.json's version, so a version bump without notes — or notes without a bump —
 * fails the build. See RELEASING.md for the checklist.
 *
 * Entry shape (newest first):
 *   version        'x.y.z' — the app version (package.json). Patch releases (z > 0) are listed
 *                  on the page but do not pop up unless `announce: true`.
 *   date           ISO date the release went live.
 *   engineVersion  src/strategies/version.js ENGINE_VERSION shipped with it (pinned on plan lock).
 *   title, summary one line + one paragraph, plain English, no jargon.
 *   changes[]      what is new.
 *   corrections[]  what was wrong before and is now right — say so plainly.
 *   effects{}      per tool (TOOL_IDS): how a plan saved under the previous version now reads.
 *                  An empty array = "no effect"; say so rather than omitting the tool.
 *   actions[]      what a user may need to do (enter something new, re-run something, review a setting).
 *   notes[]        anything else: rules used, data notes, known limits still open.
 *   announce       optional override of the minor/major rule.
 *   affects(scenario, ctx) optional: plan-specific bullets for one saved scenario. MUST tolerate
 *                  any shape ({} included) — old plans predate most fields.
 */
import { ENGINE_VERSION } from './strategies/version.js';
import { deriveTiming } from './services/PlanTiming.js';

export const TOOL_IDS = ['budget', 'stress', 'strategies', 'decision', 'accumulation', 'household'];
export const TOOL_LABELS = {
  budget: 'Budget Planner', stress: 'Stress Tester', strategies: 'Strategies (compare & switch)',
  decision: 'Decision tool (monthly)', accumulation: 'Accumulation planner', household: 'Household (couples)'
};

const pctText = (v) => String(Math.round((+v || 0) * 100) / 100);
const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

export const RELEASES = [
  {
    version: '6.36.0', date: '2026-10-20', engineVersion: '6.36.0',
    title: 'Gilt ladder + rotation: money left over in shares pays a year before it is cut',
    summary: 'On the gilt ladder + rotation with "Money left over" set to "Invested in shares", that money now pays any rotated year the sleeve cannot, and the year counts as cut only once it is spent. Until now the test never drew it, so a cut was counted even with the money there. On a test plan with £518,811 left over, the chance of a cut fell from 13% of futures to about 1%, and from 4.3% of real histories to none. Older slips in the rotation are also put right. It drew one year past the end of the plan. On some cut ages it paid one year twice. It valued its sleeve a year ahead of the gilts beside it. And the couples check treated its cut futures as never cut.',
    changes: [
      'Gilt ladder + rotation with "Money left over: Invested in shares": a rotated year the sleeve cannot pay is paid from that money first. The chance of a cut, the strategy page, "Will it last?", History and the cones all count it. What is left in a bad case is lower, because that money has been spent. Money left over that is kept, holding its value, is still never drawn, as before.',
      'The setting\'s help, the strategy page and a plan document locked with the setting say so. A document locked under 6.35.0 still says the money is never drawn, as it was locked.'
    ],
    corrections: [
      'Gilt ladder + rotation drew one more year than the plan has. A 30-year plan buys ages 60 to 89, but the rotation also drew for age 90 and could count that year as cut. It now stops with the plan. On a test plan with the money left over kept, the chance of a cut fell from 13% of futures to 11.8% (4.3% to 3.6% of real histories).',
      'Gilt ladder + rotation: once the trigger had fired, what the plan held each year counted the sleeve after that year\'s growth and draw, a year ahead of the gilts beside it, and "left at the end" was a year after the plan ended. Both are now counted at the start of each year, like the gilts. Mid-plan, the cone of what would be left is narrower. At the end, the typical amount can be higher (a test plan: £133,523 to £157,283) and the best 1 in 10 lower (another: £2,345,969 to £2,217,483), because the extra year\'s draw and growth are both gone.',
      'Gilt ladder + rotation: when a gilt pays two years either side of the cut age, it is kept, not sold, so its year above the cut age is still paid by contract. The sleeve paid that year as well, and could count it as cut. It now pays only the years whose gilts it sold. On a test plan cut at 73, with both fixes, the chance of a cut fell from 10.5% of futures to 7.8% (4.7% to 2.5% of real histories). At the default cut age of 75 the test plans were not affected.',
      'Household couples comparison, "if one plan falls short, can the other carry it?": a gilt ladder + rotation that was cut was read as never cut, because what it held never reached nothing (its kept money left over is not drawn). So every cut future counted as carried by the other plan. Each future now says the year it was first cut, and the other plan has to cover the rest of the need from then.',
      'Stress tester and Strategies, on a gilt ladder with "Invested in shares": the note on what the ladder is bought from said the money left over "is counted at its value today, not grown", and left it out of where the charges come off. It now says the money is in shares, and that the charges come off it too.',
      'Household → add a plan: the example name in the box is now an invented one.'
    ],
    effects: {
      stress: ['Gilt ladder + rotation: the chance of a cut is a little lower, and the cone of what is left reads at the start of each year. With the money left over in shares, the chance of a cut can be much lower.'],
      strategies: ['Gilt ladder + rotation, as above. Other strategies unchanged.'],
      decision: ['None. Locked plans and their documents are unchanged.'],
      household: ['A gilt ladder + rotation in the couples comparison moves with its own test. If one plan is a gilt ladder + rotation, the chance the other carries it can be lower: its cut futures are no longer counted as carried.'],
      accumulation: [],
      budget: []
    },
    actions: [],
    notes: [
      'Money left over that is kept is still never drawn for a rotated year, so with "Kept" the chance of a cut leaves it out. Engine 6.36.0.'
    ]
  },
  {
    version: '6.35.0', date: '2026-10-20', engineVersion: '6.35.0',
    title: 'A gilt ladder\'s money left over can go into shares',
    summary: 'The full gilt ladder and the ladder + rotation buy every year of your income, and until now whatever was left after buying it was kept, holding its value. A new setting, Stress tester → Settings → "Money left over", can put it in shares instead: a world-equity fund, charged like your other funds, run through the same histories and futures as everything else. It is never drawn for income, so your income and the chance the plan lasts do not change; what you would have left rides the market — more in most futures, less in a bad one. In the Household couples comparison, money freed when a gilt ladder is asked to draw less joins it. Plans without the setting read exactly as before.',
    changes: [
      'Stress tester → Settings, Full gilt ladder and Gilt ladder + rotation: "Money left over" — "Kept, holding its value" (as before, and what a plan without the setting does) or "Invested in shares (a growth part)". It is saved with the plan.',
      'With it on, the strategy page, "Will it last?", the cones and the one-line-per-future picture show what would be left in a bad, a typical and a good case. A plan locked with it says so in its plan document and asks for the money left over in shares each month, recorded as equity.',
      'Household couples comparison: when the comparison has a gilt ladder draw less, it sizes the ladder to the lower draw, as if the rungs not needed were sold today. The money that frees joins the money left over in shares when the plan is set that way, and stays as cash otherwise; the note says which, plan by plan.'
    ],
    corrections: [
      'Household couples comparison: the note called every plan that buys its income — a floor, a bridge — "a gilt ladder", and said the money freed "stays as cash in the pension" for all of them. It now says that only of a gilt ladder; a floor is said to buy its income at the lower draw, and a plan that buys part of its income and invests the rest (Floor & flex, Bridge & engine, Ladder & Ratchet) is said to be run at the lower draw.',
      'History: "N starts, two months apart" was said of every strategy, but only Pots & Valves and Buckets in order run their real starts two months apart; every other strategy runs a start every month. It now says which.'
    ],
    effects: {
      stress: ['None unless you choose "Invested in shares". History says how far apart the real starts are.'],
      strategies: ['None unless you choose "Invested in shares".'],
      decision: ['A plan locked with the setting asks for the money left over in shares each month. Locked plans are unchanged.'],
      household: ['The couples note is reworded. With the setting on, a gilt ladder\'s freed money grows in shares in the comparison.'],
      accumulation: [],
      budget: []
    },
    actions: ['If you hold, or mean to hold, your gilt ladder\'s spare money in shares, choose "Invested in shares" under Money left over and save.'],
    notes: [
      'The money left over is never drawn for income in the test — not even in a future where the rotation cuts the years after its cut age — so the chance of a cut does not count on it. Engine 6.35.0.'
    ]
  },
  {
    version: '6.34.0', date: '2026-10-20', engineVersion: '6.34.0',
    title: 'The sweep, part three: what a gilt ladder holds, counted once and as it is held; and "cut" where nothing ran out',
    summary: 'Gilt ladder + rotation counted too much money left over: in every future where its trigger never fired, the long gilts it would have sold were still counted after they had paid out, so the money left at the end included their whole income a second time. On a test plan the typical amount left at the end was £519,853 and is £133,523. Both gilt-ladder strategies also counted a gilt not yet repaid at what it cost, for as long as it was held, which put the middle years too low. Several pages said "ran out" of strategies that never run out (they cut instead), and the Household total left out an ISA held aside. All corrected. The income and the chance of lasting are unchanged.',
    changes: [],
    corrections: [
      'Gilt ladder + rotation: in a future where the trigger never fired, the rungs it would have sold stayed in "what is left" after they had paid their years, so the money left in the later years and at the end included their income a second time. "Typically left at the end", the cone of what would be left, the survivor check after the cut age and the Household figures were all too high — on a test plan the typical amount left at the end was £519,853 and is £133,523. A rotation that never fires now holds exactly what the full ladder holds. The chance the rotated years are cut and the income are unchanged. The sentence beside it now also gives the best 1 in 10 futures, where a rotation left money in shares.',
      'Full gilt ladder and Gilt ladder + rotation: what the plan holds each year counted the gilts not yet repaid at what they cost. Each is now valued as rising from its cost to what it repays, at the real yield its price implied when bought (interest rates unchanged); on a test plan the full ladder\'s figure is about 6% higher after 5 years, 15% after 10 and 27% after 20. It does not move the income, the chance of lasting or what the full ladder leaves at the end, when every gilt has been repaid. The rotation also counted its first cash years at what they pay rather than what they cost; it now counts them as the full ladder does.',
      'Strategy pages, Floor to an age and Gilt ladder + rotation: the headline said "chance the plan is paid in full (never runs out)", as if the two were the same, beside "No simulated future ran out". It now says "chance the plan is paid in full, with no year cut", and the "When it failed" row is "When it was cut": "Of the futures that were cut, half were cut before age …". Floor & flex says "no lean year" in the words beside its figure.',
      'History, and the history under "Does it last?" in the new version: "the money ran out in N of them" was said of strategies that cut instead of running out. They now say "the plan was cut in N of them" (Floor & flex: "N of them had a lean year").',
      'Household: "When one pot is empty, the other pays … one pot ran out and the other paid" was said of plans that never run out. It now says "when one plan falls short (its money runs out, or a strategy that cuts instead cuts it)", and each plan\'s own row reads "plan on its own". The note on what "lasts" means named only Floor to an age; it now names the rotation and Floor & flex too.',
      'Household → "What you\'d have left, combined" said "both pots + ISAs" but left out an ISA held aside by a plan that buys its income (a gilt ladder, a floor, a bridge): its test leaves it out. The held ISA is now added as the plan holds it — untouched, at its value at the start — as the survivor check already did.',
      'Stress tester → Settings with the ISA on hold: the note said a held ISA "is only used once the SIPP and the taxable account have both run out", and the ISA growth note said the strategy "spends the ISA as part of its own pot". Both are true of Pots & Valves, not of a strategy that buys its income, which leaves a held ISA out. Each now says what the plan\'s own strategy does, and follows a change of strategy or of the ISA choice at once. The new version\'s pots step said a held ISA "still rescues the plan if the pension runs out" on a bought plan; it now says the plan never draws it.',
      'Where you are, on a gilt ladder: a plan locked from this version counts its gilts as held until they repay, and the note says so; a plan locked earlier still counts them at what they cost, and the note still says that. There is still no ahead-or-behind verdict, because your record is at market prices, which move with interest rates.'
    ],
    effects: {
      stress: ['Gilt ladder + rotation: "typically left at the end" and the later years of what would be left are lower — much lower on some plans. Full gilt ladder: what would be left is higher in the middle years and the same at the end. On both, the income and the chance of lasting are unchanged. Every other strategy: words only.'],
      strategies: ['As in the Stress tester: the rotation\'s money left is lower, the full ladder\'s middle years higher; the ranking by chance of lasting is unchanged. Everything else is words only.'],
      decision: ['Where you are: the gilt-ladder note is reworded for plans locked from now on; still no verdict either way. A locked plan keeps its plan document and the figures it was locked with.'],
      household: ['With a gilt-ladder plan: the survivor check, the combined figure and each person\'s pot in the couples table move as above, and the combined figure now includes an ISA held aside. With a Gilt ladder + rotation plan the household verdict can be lower: that plan was counted as having more left to cover the other with than it had.'],
      accumulation: [],
      budget: []
    },
    actions: [],
    notes: [
      'A gilt not yet repaid is valued on the real yield its price implied when it was bought, with interest rates unchanged, not at today\'s market price. The year is measured from the April before the plan\'s first tax year, so a gilt reaches what it repays up to a year late in these figures: they err a little low. Engine 6.34.0.',
      'Still to come: an option for a gilt ladder to put spare money, and money a rung pays beyond what is drawn, into a growth part.'
    ]
  },
  {
    version: '6.33.0', date: '2026-10-20', engineVersion: '6.22.0',
    title: 'The sweep, part two: no figure rounds to 100% while something fell short, and one strategy name everywhere',
    summary: 'A plan that paid 99.8% of its years beside income cuts said "100% of the plan\'s years covered"; a plan that lasted in 89.6% of futures said "90%" beside "not on course yet". Percentages now never round a near miss into 100% or a trace into 0%, and never across a line the words beside them change at (9 in 10 above all). The planner also read the strategy\'s name from one saved copy and ran the test on another; both now come from the one the test runs. No figure the test works out has changed; Monthly Entry changes only on a plan whose two copies disagreed (see below).',
    changes: [],
    corrections: [
      'Will it last? and every strategy page: "100% of the plan\'s years covered" was shown beside income cuts when 99.5% or more was covered. It now says the figure as it is (for example 99.8%). The same holds for the chance the money lasts, the share of futures cut, and the share of histories that ran out: a 0.3% chance of a cut no longer reads "0%".',
      'A chance of lasting just under 9 in 10 (for example 89.6%) was rounded to "90%" beside "not on course yet" — on the strategy pages, the Strategies ranking, the Household checks and "When could I retire?". It now keeps the decimal that shows it is under the line.',
      '"When could I retire?" rounded each age\'s chance before checking it against your bar, so an age at 89.6% was named as on course. It now checks the figure itself. The same table named the strategy by its internal code; it now uses its name.',
      'Stress tester → Compare allocations could say "10.0 futures out of 10" for a mix that failed in a few, and "9.0" for one just under 9 in 10; it now says 9.9 and 8.9.',
      'The pictures on the strategy pages ("runs out in 0% of futures", "(0% fail)" beside "ran out by", "reserve covers it in 100% of futures", the risk bars on Strategies) and the rotation\'s "0% of futures rotate" were rounded the same way; they now say the figure as it is.',
      'Household: the household and each pot\'s "N in 10" counted every share from 95% as "10 in 10" and from 85% as "9 in 10". They now say it in words ("more than 9 futures out of 10", "just under 9 futures out of 10").',
      'The planner kept the plan\'s strategy in two saved places: one for the test, one for the names on the pages and for Monthly Entry. Every switch writes both, but a plan could carry them apart, and a page then named one strategy above a figure worked out for another. Names and Monthly Entry now read the strategy the test runs.'
    ],
    effects: {
      stress: ['Words only: the same figures, said without rounding to 100% or 0%.'],
      strategies: ['Words only: the same figures, said without rounding to 100% or 0% or across 9 in 10.'],
      decision: ['On a plan whose two saved copies of the strategy disagreed, Monthly Entry now follows the strategy the test runs (on a gilt ladder that means no spending cut in a slump, as its test assumes). Plans whose copies agree — every plan switched since 6.13 — are unchanged.'],
      accumulation: ['"When could I retire?" may name a later age as the first on course, where an age just under 9 in 10 was rounded up before. An unused calculation was removed; nothing you see comes from it.'],
      household: ['Words only: the shares of futures beside each verdict are said in words and without rounding across 9 in 10.'],
      budget: []
    },
    actions: [],
    notes: ['A figure is still rounded to a whole percent when it is not near 0, 100 or the 9-in-10 line.']
  },
  {
    version: '6.32.0', date: '2026-10-18', engineVersion: '6.22.0',
    title: 'A sweep for plans that are not invested for growth: the survivor and care checks, and every gilt-ladder page',
    summary: 'On the Household tab, "What if one of you dies?" and "What if one of you needs care?" ran every plan as a portfolio of shares, bonds and cash, whatever its way of drawing — so a gilt ladder was tested as if it were invested for growth. The survivor check also added the median pension and the median ISA from different futures and raised the result by 2.5% a year into future pounds, beside spending in today\'s money: on a gilt-ladder plan the inheritance it showed was about double what the plan leaves. Both checks now run each plan through its own strategy\'s test — the same one test as Will it last?, the Strategies page and the household verdict — and say the result in the planner\'s words, in today\'s money.',
    changes: [
      'Survivor check: the inheritance is what the other person\'s own plan has left in that year in its own test: about £X in a middling case and £Y in a bad case (the worst 1 in 10), today\'s money. A gilt-ladder plan that holds its ISA aside adds the ISA as it holds it. The survivor\'s plan is then run through its own strategy\'s test twice, with each inheritance, and the result is said as "lasts in N futures out of 10" for each.',
      'Survivor check: the survivor\'s spending from that year is the chosen share of what you both spend after tax, grossed up again on the survivor\'s own tax bands, and shown as a figure a year before tax with what it leaves after tax beside it. The inheritance arrives as a pension that stays a pension and an ISA that passes as an ISA; a final-salary survivor\'s pension continues as an income stream, as before.',
      'Care check: the care cost is entered as a figure a year after tax, in today\'s money, and added to that person\'s plan as one-off costs — the same key the planner\'s own one-off costs use, grossed up on top of that year\'s spending. Both plans run through their own tests, paired future for future, and the household verdict comes first (when one pot is empty, the other pays), with care and without; both plans each lasting on their own is shown beside it.',
      'The year boxes now read "Years from now", and each plan\'s own year is found from it (a partner who has not started drawing starts later).'
    ],
    corrections: [
      'Monthly Entry showed the rotation watch — the rule to sell the long rungs for shares in a crash — on a full gilt ladder and on Floor the schedule, as a rule "agreed in advance". Only a plan whose way of drawing is the gilt ladder + rotation agreed it; the others no longer show it (it stays described as an optional extra on the full ladder\'s Strategies page).',
      'Stress tester → Drawdown and Glidepath drew the fund boxes\' schedule and glidepath on plans that buy gilts or a floor and never use them. They are now shown only for Pots & Valves and Buckets in order.',
      'History and Scenarios said "No start-year replay for this strategy yet" for the gilt ladder + rotation. Each named year is now replayed from the very windows its test walks: when the market fell 30% below its high and the long rungs were sold for shares, whether the later years were paid in full, the lowest year and what was left.',
      'The plan document\'s header said "Priced on £X + ISA £Y" for a plan whose ISA is held aside and never buys rungs; it now says the ISA is held aside. Its timing sentence (for example "in 9 months") was counted on the lock date but sat under today\'s "Where you are"; it now says it is as written when the plan was locked.',
      'Transition said both "6 months away" and "5 months to go" for different things; the second now says it is the months the buying is spread over.',
      'Monthly Entry and History called the after-tax figure "Total Monthly Income" under before-tax withdrawals; it now says after tax.',
      'Survivor check: a gilt ladder (full or with rotation), a floor or a bridge was tested as a growth portfolio. Each plan now runs on its own strategy. On a gilt ladder + rotation that leaves about £0.73M in its own test ten years in, the check said it left about £1.48M.',
      'Survivor check: the inheritance was the median pension plus the median ISA, taken from different futures, then raised by 2.5% a year into future pounds and shown beside spending in today\'s money. It is now the middle and the worst 1 in 10 of the total the plan leaves, in today\'s money.',
      'Survivor check: the survivor\'s spending was 70% of the two plans\' before-tax figures added together. It is now 70% of what you both have after tax, taxed again as one person.',
      'Care check: both plans were tested as growth portfolios, the cost was added before tax although care fees are paid from money after tax, and the result counted only futures in which both pots lasted on their own. Each plan now runs its own test, the cost is grossed up, and the household verdict (when one pot is empty, the other pays) comes first.'
    ],
    effects: {
      household: [
        'The survivor and care checks give different figures: lower inheritances on gilt-ladder, floor and bridge plans (often about half), and on every plan an inheritance in today\'s money rather than future pounds. Nothing is saved: both checks are what-ifs and never change a plan, locked or not.'
      ],
      stress: ['Words and which pages show: no figure changes. Gilt ladder + rotation plans gain start-year replays on History and Scenarios.'],
      decision: ['Monthly Entry no longer shows the rotation watch on a plan that did not choose the rotation; labels only.'],
      strategies: [], accumulation: [], budget: []
    },
    actions: ['If you ran the survivor or care check before, run it again: the earlier figures came from a different model.'],
    notes: [
      'Simplifications still made: pensions are inherited tax-free (death before 75); the ISA passes as ISA (the spouse\'s extra allowance); the inheritance is split between pension and ISA in the shares the plan started with; gilts still held count at what they cost; the bad case sets the worst 1 in 10 of what is left against every one of the survivor\'s futures rather than future by future (cautious); care fees are added in full and no means-testing is modelled.',
      'Nothing outside the one test may now run the drawdown engine directly; a test fails the build if anything does.'
    ]
  },
  {
    version: '6.31.1', date: '2026-10-18', engineVersion: '6.22.0',
    title: 'Gilt-ladder plans: the line above the runs says what the ladder is bought from',
    summary: 'On a plan whose way of drawing is the full index-linked gilt ladder or the gilt ladder + rotation, the line above Will it last?, History and Scenarios described a growth strategy: starting balances split into shares, bonds and cash, and an ISA growing as the ISA funds in your list. The ladder test does neither. It now says what the test does.',
    changes: [],
    corrections: [
      'Gilt-ladder plans: the line now says the ladder is bought from one total — your pension (the strategy\'s own pinned total, or the total of your Settings fund boxes) and your ISA unless it is held back — that the shares/bonds/cash split does not apply to the gilts, and that money left over after buying the ladder is counted at its value today, not grown. Charges are said as the ladder takes them: off the cash years and, after a rotation, the share fund; never off the gilts.',
      'It no longer says the ISA grows as the ISA funds in your list of funds to test: in the ladder test the ISA either helps buy the ladder or, held back, never buys rungs.'
    ],
    effects: { stress: ['Words only: no figure changes.'], strategies: [], decision: [], accumulation: [], household: [], budget: [] },
    actions: [],
    notes: ['The pots the line names are tested equal to the pots the ladder test itself is sized on. Reinvesting left-over money in the growth part, rather than holding it at its value, is still to come.']
  },
  {
    version: '6.31.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The preview runs "Does it last?"',
    summary: 'The fifth and last part of a plan you can change in the preview (/v7/) instead of the planner, and the first that works something out: "Does it last?" runs the one test every screen of the planner shows — your plan, its own way of drawing, its own spending cuts, its full length, through every real stretch of markets since 1871 and 1,000 possible futures — and says it the preview\'s way: "Your plan lasts in 9 futures out of 10", what is typically left, a bad case (the worst 1 in 10) and a good case, how often and by how much income is cut, and what would have happened had you retired into the hardest real starts and the famous bad years. The figures are the planner\'s own, to the pound. Under them, the spending cuts in a slump and the emergency reserve, each once, with the saved value and where it came from, with Undo. A locked plan is never changed: it shows the figure it was locked with and today\'s test beside it.',
    changes: [
      '"Does it last?" (/v7/#/plan/<id>/lasts, from Your plan → "Does it last?", or "Check it still lasts" after a change): the plan\'s one test, run in the preview\'s own background worker, with a progress bar while it works. The band says how many futures out of 10 the plan lasts in (the planner\'s own words), with the ten-cell bar and a word — On course at 9 in 10 or better, Close from 85%, else Not yet; under it the count of futures, the real starts since 1871 and the plan\'s length to the age it ends; what is left at the end at today\'s prices (typically, in a bad case — the worst 1 in 10 — and in a good case); the income cuts (in how many futures, how much a year less, for how long, the most in any future); the cuts setting the run used; and when it was worked out and on which saved plan.',
      '"What if you had retired into a bad year?": the five hardest real starts in the record, marked as an unfair test, and the six named starts (1929, 1937, 1966, 1973, 2000, 2008) each replayed with your own plan — read from the same run, as the planner\'s History page reads them. The named decades as whole stresses stay in the planner, and the page says so.',
      'The dials under the band: cut spending in a slump (yes or no), after how many months in a row below the plan\'s line, the cut as a percent (the planner\'s multiplier the other way: 0.8 is a 20% cut), the months at half the cut before the whole cut, the buffer the pots must be above the line before the cut ends; and the emergency reserve, on or off, and its amount. Beside each box, the saved value and where it came from. A ladder, a floor or a rotation says "Not used by this way of drawing" under each, as the planner hides them.',
      'Save, Cancel, and after a save an Undo for fifteen seconds that puts the plan back as it was, byte for byte. After a save the test runs again on the saved plan, so the band is always the plan\'s own.',
      'It writes the same saved settings the planner\'s Stress Save writes for the Protection and Break Glass boxes — disableProtection, consecutiveLimit, protectionMult, protectionEscalateMonths, recoveryBuffer, hodlEnabled, hodlValue — and nothing else; the Decision form\'s own copies are not written, as the planner does not write them. The run writes nothing at all: the planner keeps no run result on an unlocked plan, so the preview keeps the result in page memory and works it out again when the plan changes. A test proves every path written is on the step\'s declared list, that every other byte of the stored plan is unchanged, and that the planner\'s own engine config reads what the preview showed.',
      'The figures are the planner\'s own: the preview calls the planner\'s stressTestStrategy on the plan every planner screen runs (the same settings loader, the same engine config, the same real-yield curve, the same fixed futures) and reads it through the planner\'s OneAnswer. A test runs every corpus plan both ways and holds the chance, what is left, the cuts and the history equal to the pound; the browser test holds what the page shows equal to the same run in Node.',
      'The engine loads lazily: the strategy registry, the nine strategies, the market history and the gilt data reach the preview\'s worker only when "Does it last?" is opened, in a chunk of their own. The shell and the worker\'s own chunk are the same size as before; a test keeps it so.',
      'The plan page: "Does it last?" replaces "Test it in the planner" on an unlocked plan; "Next: check it lasts, then lock it when it is right." and the stale line\'s "Check it still lasts" lead here, with no hand-over to the planner. A locked plan keeps "Test the plan in the planner" for the planner\'s what-ifs and gains "Does it last? (as locked, and today)".',
      'Couples: this step runs this plan; your partner\'s plan is tested on your partner\'s plan, and the page links there. The two plans together — who draws what, whether the household lasts — stay in the planner\'s Household page, one button away.',
      'A locked plan is never changed: its "Does it last?" shows the figure the plan document was locked with ("Worked out when the plan was locked on …"), runs today\'s test on the same frozen plan as the planner\'s document page does (a locked gilt ladder is not re-priced), and says in one line when the two differ; the dials are read-only, and every write passes the lock guard before anything is sent. Without an account, this window\'s plans run and can be changed the same way while the free time is not used up.'
    ],
    corrections: [],
    effects: {
      stress: ['None until you press Save on "Does it last?"; a save writes that step\'s keys only and stamps the plan as every save of the planner does. The run itself writes nothing.'],
      decision: ['None: the planner\'s Stress Save does not copy the Protection boxes to the Decision settings, and neither does the preview.'],
      budget: [], strategies: ['None: a ladder, a floor or a rotation ignores the cuts and the reserve, and the page says so. In the preview a ladder is priced on the bundled yield curve (the preview loads no live prices), so its cost can differ from the planner\'s on a day the live file has moved; the page says that too.'], accumulation: [], household: []
    },
    actions: ['None. To see whether your plan lasts, or change the cuts and the reserve, from the preview: Your plans → the plan → Your plan → "Does it last?".'],
    notes: [
      'The one test takes about half a second on a laptop for a Pots & Valves plan (a ladder plan well under a tenth); on a phone four times slower, two to three seconds. The engine itself is untouched: the progress bar moves at the plan built and at the history replays, not inside the futures.',
      'The engine config builder moved from the Stress repository to a service of its own (src/services/SimulationConfig.js), unchanged line for line; the repository keeps its old name as a wrapper. No figure moves.',
      'The draft of this step is text by box, kept in this tab with the other drafts and cleared on save, cancel or leaving the plan. The run\'s result is page memory only and leaves with the plans. No new browser key.',
      'Not yet in the preview: the named decades (Scenarios), the year-by-year table, the cones, "Try a change" on a saved plan, the way of drawing and mix. Engine version unchanged (6.22.0).'
    ]
  },
  {
    version: '6.30.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The preview can change "Your pots and tax"',
    summary: 'The fourth part of a plan you can change in the preview (/v7/) instead of the planner: your pension pot today (and, if you are still working, what you expect to have at the day you stop), your ISAs and savings and how they grow and are used, your ordinary account, charges, the tax thresholds and whether they rise, and how you take the tax-free part of your pension. Each fact is asked once, in plain English, with the saved value and where it came from beside it; the split of your pension, the risk level and the funds to test stay with the way of drawing and mix, and the page says so. A save writes the same settings the planner\'s "Your allocation", "Charges", "Tax thresholds" and "How you\'ll take this pension" boxes write, and nothing else, with Undo. A locked plan is never changed.',
    changes: [
      '"Your pots and tax" (/v7/#/plan/<id>/pots, from Your plan → "Change this here" beside "Pots"): your pension pot today as one figure; if you are still working, what you expect to have at the day you stop (or leave it blank for the planner\'s own figures, worked out from what you pay in and shown beside the boxes); your ISAs and savings today, how they grow ("Mostly cash" or "Invested like my pension") and how the ISA is used; your ordinary account — how much, what it holds, your tax band for it — your earnings this year and whether £20,000 a year is moved into the ISA; charges (funds and platform) as a percent a year; the tax-free allowance and the two thresholds, rising with prices or frozen; your 25% tax-free part (kept separate or already taken, or a quarter of each draw, for how many years, then the rest into the ISA); and band fill. Beside each box, the saved value and where it came from.',
      'Under the boxes, what it works out to: the pots today, the split as saved ("£280,000 shares, £120,000 bonds, £40,000 cash") with where to change it, the pots at the day you stop (typed, the planner\'s own figures, or your answer\'s own middling and bad-case figures), how the ISAs grow, what the charge comes off, the bands, and how each draw is taxed.',
      'A setting your way of drawing ignores says so under its box — "Not used by this way of drawing" — as the planner says beside its own boxes: for a ladder, a floor or a rotation the tax-free part, band fill, earnings and bed-and-ISA; and how the ISAs grow once the plan is running. A way of drawing sized on its own pot figures says that those are set with the way of drawing.',
      'What each tax choice saves over the plan is not a figure the plan holds, so the page says it comes from "Does it last?", later, and never works it out itself.',
      'Save, Cancel, and after a save an Undo for fifteen seconds that puts the plan back as it was, byte for byte.',
      'It writes the same saved settings the planner\'s Stress Save writes for these boxes — the three pots your pension is held in (your total in the proportions already saved, so the mix is untouched), the pots at the stop, the ISA and its two choices, the ordinary account and its mix and band, earnings, bed-and-ISA, the charge, the three thresholds and whether they rise, the tax-free part and band fill — and nothing else. A key the plan did not have is written only when you choose something other than what the plan already read it as. A test proves every path written is on the step\'s declared list, that every other byte of the stored plan is unchanged, and that the planner\'s own readers of each setting see what the preview showed.',
      'Couples: your partner\'s pots and tax are on your partner\'s plan; the page says so and links there. One save writes one plan.',
      'A locked plan is never changed: its "Your pots and tax" is read-only (the figures from the plan document), a plan locked before charges or the ISA growth choice were added says so and keeps its figures, and every write passes the lock guard before anything is sent. Without an account, this window\'s plans can be changed the same way while the free time is not used up.'
    ],
    corrections: [
      'The plan page\'s "will it last" stale line now also notices a changed pension pot or ISA when the plan was made from a preview answer (the answer\'s own record against the plan\'s pots, to the pound).'
    ],
    effects: {
      stress: ['None until you press Save on "Your pots and tax"; a save writes that step\'s keys only and stamps the plan as every save of the planner does. A pension total typed here is split into the three pots in the proportions the plan already holds; on a plan with no pots yet, the balanced split, as the planner would.'],
      decision: ['None: the planner\'s Stress Save does not copy these boxes to the Decision settings, and neither does the preview.'],
      budget: [], strategies: ['None: the split of the pension, the risk level, the funds to test, the diversifiers, the bond tent and every strategy\'s own dials stay with the way of drawing and mix.'], accumulation: [], household: []
    },
    actions: ['None. To change your pots, charges or tax settings from the preview: Your plans → the plan → Your plan → "Pots" → "Change this here".'],
    notes: [
      'A typed figure for the pots at the day you stop is saved exactly as the planner\'s Timing block saves it; both boxes left blank on a plan that had typed figures goes back to the planner\'s own figures, which it works out the next time it draws the plan (until then every run uses today\'s pots, as a plan without the figures always has).',
      'A charge typed between the planner\'s steps of 0.05 lands on the nearest step, as the planner\'s own Save puts it.',
      'The draft of this step is text by box, kept in this tab with the other drafts and cleared on save, cancel or leaving the plan. No new browser key.',
      'Not yet: "Does it last?" as an editing step; the way of drawing and mix. Engine version unchanged (6.22.0).'
    ]
  },
  {
    version: '6.29.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The preview can change "What you spend"',
    summary: 'The third part of a plan you can change in the preview (/v7/) instead of the planner: what you spend a month after tax from the start, how it changes as you get older — any number of later steps by age, each staying the same, falling by a percentage a year or moving evenly to the next, with "Suggest go-go, go-slow and no-go years" — and one-off costs at an age. The before-tax figure the plan saves is shown under every amount, never asked. Your budget sits beside it as a guide only. A save writes the same settings the planner\'s "Your income shape" and "Extra spend" boxes write, and nothing else, with Undo. A locked plan is never changed.',
    changes: [
      '"What you spend" (/v7/#/plan/<id>/spend, from Your plan → "Change this here" beside "What the plan pays"): the figure from the plan\'s first year, a month after tax at today\'s prices, and what happens from it (stays the same, falls by a percentage a year, moves evenly to the next step); later steps as cards, each from an age, with its share of the start; one-off costs as cards (what it is, the amount a year after tax, at age, for how many years, going up with prices or a fixed sum). Beside each box, the saved value and where it came from; under every amount, the figure before tax as the plan saves it ("£38,000 a year before tax").',
      'As many steps and tapers as the planner: any number of steps by age, a fall of 0.25% to 10% a year in quarter points (the planner\'s slider stops at 5%; the plan reads any), "moves evenly to the next step" on every step but the last, and the first row\'s own fall. "Suggest go-go, go-slow and no-go years" is the planner\'s own rule (15% less from 75 and 30% less from 85, to the nearest £500 a year before tax, never below your budget\'s essentials), said a month after tax.',
      'The picture of every year: one bar a year from the plan\'s start, the part your State Pension and other pensions pay lighter, the go-go, go-slow and no-go bands, your budget\'s essentials dashed (a guide), and "Show each year" as a table. A year the pensions pay more than the shape is drawn at what they pay, and a line says so — the planner\'s "never below the income you get anyway".',
      'Your budget, as a guide: its all-in total and essentials a month after tax beside the boxes, with "Use £X a month at the start" (one tap into the first row; you can change it) and "Change the budget lines (in the planner)". It is never used to work out what you need: the plan uses the figures in the boxes. Not worked out: the page says you are choosing by one figure and that working it out line by line is the better way.',
      'Under the boxes, what it works out to: "From age 60: £3,410 a month after tax (£48,000 a year before tax), moving evenly to £2,476 at 76.", each one-off cost with its tax year and its before-tax figure on top of that year.',
      'Save, Cancel, and after a save an Undo for fifteen seconds that puts the plan back as it was, byte for byte.',
      'It writes the same saved settings the planner\'s Stress Save writes for these boxes — the income steps (the shape), the year-by-year schedule every engine reads, the first figure, the Decision copy\'s first figure and schedule, and the one-off costs — and nothing else; a row you did not touch is kept byte for byte. A test proves every path written is on the step\'s declared list and that every other byte of the stored plan is unchanged, and that the planner\'s own reading of the plan shows the steps the preview showed.',
      'Couples: your partner\'s spending is on your partner\'s plan; the page says so and links there. One save writes one plan.',
      'A locked plan is never changed: its "What you spend" is read-only (the figures and the picture from the plan document), and every write passes the lock guard before anything is sent. Without an account, this window\'s plans can be changed the same way while the free time is not used up.'
    ],
    corrections: [
      'The plan page\'s "will it last" stale line now also notices a changed first figure when the plan was made from a preview answer (the answer\'s own take-home row against the plan\'s first step, through the same tax sum, within £1 a month).'
    ],
    effects: {
      stress: ['None until you press Save on "What you spend"; a save writes that step\'s keys only and stamps the plan as every save of the planner does. A plan saved before 6.2.0 with the old "declining with age" setting has it set to "flat" with the steps on that save, exactly as the planner\'s own Save does (the taper lives on the steps).'],
      decision: ['The first figure and the year-by-year schedule are kept in step with the Stress settings on a save, as the planner\'s Save does while a plan is unlocked.'],
      budget: ['None: the budget is read as a guide and never written from this step.'],
      strategies: [], accumulation: [], household: []
    },
    actions: ['None. To change what you spend from the preview: Your plans → the plan → Your plan → "What the plan pays" → "Change this here".'],
    notes: [
      'The planner saves each step a year before tax; the preview asks a month after tax and converts with the planner\'s own tax sum at the plan\'s own bands, so a figure typed reads back as typed and an untouched figure keeps its saved before-tax amount to the pound. A one-off cost\'s before-tax figure is the planner\'s marginal sum on top of that year\'s figure, so a cost left untouched keeps its saved row whatever else changed.',
      'The essentials Floor & Flex buys as a floor stay with the way of drawing, in the planner; the page says so on a Floor & Flex plan.',
      'The draft of this step is text by box, kept in this tab with the other drafts and cleared on save, cancel or leaving the plan. No new browser key.',
      'Not yet: "Your pots and tax" and "Does it last?" as editing steps; editing the budget\'s lines inside the preview. Engine version unchanged (6.22.0).'
    ]
  },
  {
    version: '6.28.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The preview can change "Money that comes in anyway"',
    summary: 'The second part of a plan you can change in the preview (/v7/) instead of the planner: your State Pension (the full amount, your forecast, or none), each final-salary pension by the age it starts and how it rises, other income that comes in anyway, income for some years by start and end age, and the lump sums you expect, by age. Each fact is asked once, by age, before tax, in plain English; what it works out to — the State Pension\'s age and tax year, each pension\'s first tax year — is shown, never asked. A save writes the same settings the planner\'s "Other income", "Income streams & lump sums" and "State Pension" boxes write, and nothing else, with Undo. A locked plan is never changed.',
    changes: [
      '"Money that comes in anyway" (/v7/#/plan/<id>/income, from Your plan → "Change this here" beside the new "Money that comes in anyway" section): your State Pension as the full amount, your forecast (pounds a week, before tax) or none; final-salary pensions as cards, each with the amount a year, the age it starts and how it rises; other income for the whole plan; income for some years as cards (what it is, the amount, from age, to age or for the rest of the plan, how it rises); lump sums as cards (what it is, the amount, at age, a cash lump sum or an inherited pension or ISA). Beside each box, the saved value and where it came from. Under the boxes, what it works out to: "State Pension: £11,973 a year before tax from age 67 (tax year 2034/35)".',
      'A plan with no State Pension figure says what the planner then assumes — "every run assumes £12,000 a year before tax from age 67" — and offers "Leave it as assumed for now" beside the three choices until one is made.',
      'Ages, not plan years: every start, end and arrival is asked as an age and stored as the planner\'s own plan year, the rule the planner\'s "Final-salary pension starts at age" box already uses; a start before the plan\'s first year is allowed and said; a start after its end is refused as the planner refuses it.',
      'The April 2028 note where it applies: "Move into drawdown what you will need before 57 by 5 April 2028: after that, nothing new can be taken until you are 57."',
      'Save, Cancel, and after a save an Undo for fifteen seconds that puts the plan back as it was, byte for byte.',
      'It writes the same saved settings the planner\'s Stress Save writes for these boxes — the weekly State Pension amount (and, for none, the yearly figure set to 0 so nothing is assumed), the final-salary amount, start year and age and rises, other income, the income streams list and the lump sums list — and nothing else. A saved State Pension date is never changed. A test proves every path written is on the step\'s declared list and that every other byte of the stored plan is unchanged.',
      'Your plan\'s "Pots and other income" section is now two: "Pots" (still changed in the planner) and "Money that comes in anyway" (changed in the preview), the latter listing income for some years and lump sums too.',
      'Couples: your partner\'s State Pension and pensions are on your partner\'s plan; the page says so and links there. One save writes one plan.',
      'A locked plan is never changed: its "Money that comes in anyway" is read-only, and every write passes the lock guard before anything is sent. Without an account, this window\'s plans can be changed the same way while the free time is not used up.'
    ],
    corrections: [
      'The plan page\'s "will it last" stale line now also notices a changed State Pension or final-salary pension when the plan was made from a preview answer; before, only the ages and the plan\'s length were compared.'
    ],
    effects: {
      stress: ['None until you press Save on "Money that comes in anyway"; a save writes that step\'s keys only and stamps the plan as every save of the planner does. A second or third final-salary pension is kept in the planner\'s own "Income streams" list as income for the rest of the plan, labelled "Final-salary pension".'],
      decision: ['None: the planner\'s Stress Save does not copy these boxes to the Decision settings, and neither does the preview.'],
      budget: [], strategies: [], accumulation: [], household: []
    },
    actions: ['None. To change your State Pension, pensions, other income or lump sums from the preview: Your plans → the plan → Your plan → "Money that comes in anyway" → "Change this here".'],
    notes: [
      'Where a cash lump sum can legally go (the ISA allowance, the pension within its limit, the rest in an ordinary account) and what its taxable part is held in stay the planner\'s: the preview keeps them as saved and never asks.',
      'The draft of this step is text by box, kept in this tab with the other drafts and cleared on save, cancel or leaving the plan. No new browser key.',
      'Not yet: "What you spend", "Your pots and tax" and "Does it last?" as editing steps. Engine version unchanged (6.22.0).'
    ]
  },
  {
    version: '6.27.1', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'Preview: a fast move between pages no longer bounces back',
    summary: 'In the preview, moving to another page a moment after landing on an unknown address could send you back to the "could not find that page" door on a slow connection. Fixed.',
    changes: [],
    corrections: [
      'The preview\'s address code wrote the page it was leaving back over the page you had just asked for when anything else changed in that moment. It now waits for the browser to confirm the new address first.'
    ],
    effects: { stress: [], strategies: [], decision: [], accumulation: [], household: [], budget: [] },
    actions: [],
    notes: ['Seen first as a browser test failing on a slow runner (every address visited in turn). No change to any plan or figure.']
  },
  {
    version: '6.27.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The preview can change "About you and when"',
    summary: 'The first part of a plan you can change in the preview (/v7/) instead of the planner: your age, whether you have stopped work or when you will, when the plan\'s income starts, and the age to plan to, with a suggestion from how long people live. Each fact is asked once, by age, in plain English; what it works out to — the stop month, the first tax year, how long the plan runs — is shown, never asked. A save writes the same settings the planner\'s Timing block writes and nothing else, with Undo. A locked plan is never changed. After a change, the plan page says its "will it last" answer is older than its inputs and offers to check it again.',
    changes: [
      '"About you and when" (/v7/#/plan/<id>/about, from Your plan → "Change this here"): your age today; stopped, or stopping at an age or in a month; when the plan\'s income starts (this tax year or next April) for someone who has stopped; the age to plan to, with "Suggest from how long people live" (a man or a woman; 1 in 10, 1 in 4 or half live beyond it). Beside each box, the saved value and where it came from. Under the boxes, what it works out to: "You stop work in January 2030, at 62.", "The plan\'s first tax year is 2029/30.", "Your plan runs 32 years, from January 2030 to age 93."',
      'Save, Cancel, and after a save an Undo for fifteen seconds that puts the plan back as it was, byte for byte.',
      'It writes the same saved settings the planner\'s Timing block writes — the age and its date, retired or the stop age, the first tax year, the derived start age, the length, the Decision copy\'s first tax year and the budget\'s copy of the ages — and nothing else. A test proves every path written is on the step\'s declared list and that every other byte of the stored plan is unchanged.',
      'After a change, the plan page says "Your \u2018will it last\u2019 answer was worked out on {date}, before the plan was changed on {date}" and the next sentence becomes "check it still lasts", which opens the run in the planner. A change made in the planner is caught the same way.',
      'Couples: your partner\'s ages are on your partner\'s plan; the page says so and links there. One save writes one plan.',
      'A locked plan is never changed: its "About you and when" is read-only, and every write passes the lock guard before anything is sent. Signed in, the account\'s plans are read again just before a save, so a plan locked from another device is seen as locked.',
      'Without an account, this window\'s plans can be changed the same way while the free time is not used up.'
    ],
    corrections: [
      '"Your plan" now says the age the plan runs to as the planner\'s Timing block does (start age + years − 1): a 35-year plan from 57 runs "to age 91", not 92.',
      '"Add your age" and "Update it" on the plan page open "About you and when" in the preview instead of the planner.'
    ],
    effects: {
      stress: ['None until you press Save on "About you and when"; a save writes that step\'s keys only and stamps the plan as every save of the planner does.'],
      decision: ['The plan\'s first tax year is kept in step with the Stress settings on a save, as the planner does.'],
      budget: ['The budget\'s copy of the ages is kept in step on a save, as the planner does.'],
      strategies: [], accumulation: [], household: []
    },
    actions: ['None. To change your ages or the plan\'s length from the preview: Your plans → the plan → Your plan → "Change this here".'],
    notes: [
      'The preview\'s import boundary changed on purpose: one file may write, by updating fields of an existing plan only; creating, replacing or deleting a plan stays impossible from the preview, and a test fails on any other write name it can reach.',
      'Typed text waits in this tab\'s draft with the other drafts and is cleared on save, cancel or leaving the plan; it never holds the plan. No new browser key.',
      'Not yet: pots at the stop (comes with "Your pots and tax"); "Money that comes in anyway", "What you spend", "Your pots and tax" and "Does it last?" as editing steps. Engine version unchanged (6.22.0).'
    ]
  },
  {
    version: '6.26.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The preview shows your saved plans',
    summary: 'The new-look preview (/v7/) now opens the plans you have saved in the planner, read-only. "Your plans" sits in the header of every preview page. Each plan opens on a short list of steps for its stage of life — saving, locked and still working, retired — with every figure taken from the plan\'s own record, exact, with where it came from and its date. Nothing on these pages can be typed into: "Change this" opens today\'s planner on the right plan, page and section with the boxes filled, and brings you back. Browsing the preview writes nothing to any plan.',
    changes: [
      '"Your plans" (/v7/#/plans): signed in to the planner on this device, the account\'s plans grouped as "Your household" (plans linked to each other) and "Other plans", each by its own name with one stage line, for example "Retired. Your ladder pays from April 2027." Nobody signed in: the plans this window kept without an account, read-only.',
      'Each plan opens on the steps its stage needs — This month, Where you are, Your plan, This month\'s pot, What you pay in, What you spend, Lock the plan, What you hold, Moving to your plan\'s mix, Your household — the optional ones marked. Every figure says where it came from ("From your record, September 2026"; "From your plan as locked, 1 July 2026"); a figure over three months old is flagged. One "Next: …" sentence at the bottom. A retired person is never shown a countdown.',
      'A locked plan is read from its plan document. Its settings say "Fixed when you locked the plan on {date}", with the prices they were worked out at; unlocking is mentioned once, on "Your plan as locked".',
      '"Everything else this plan uses" lists every setting the plan has moved away from the planner\'s starting values, in plain words, with "Show every setting" for the rest — nothing a plan carries is invisible in the preview.',
      '"Change this" opens the planner on the right plan, page and section with the boxes filled; a line at the top says "Opened from the preview" with the way back. Your partner\'s plan opens in that window only: your other windows and devices stay on the account\'s open plan.'
    ],
    corrections: [
      'The planner\'s "which plan is open" now reads the window\'s own choice first, then the account\'s open plan as before; the plan menu, What\'s new and Download read it the same way.'
    ],
    effects: {
      stress: [], strategies: [], decision: [], accumulation: [], household: [], budget: []
    },
    actions: ['None. To see your plans in the preview, open /v7/#/plans while signed in to the planner on this device.'],
    notes: [
      'Browsing the preview writes nothing: plans are brought up to date in memory only, and a test walks every import the preview can reach and fails on any write.',
      'Two new browser keys, this window only and holding no figures: the hand-over note (pt_open_place, gone once used) and the window\'s open plan (pt_open_plan). One sentence added to the privacy policy under "Storage in your browser".',
      'Not yet in the preview: signing in from inside it (the "Sign in" button opens the planner\'s own sign-in screen and comes back); testing a plan and "One decision" link to the planner for now. Engine version unchanged (6.22.0).'
    ]
  },
  {
    version: '6.25.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'Couples: who draws what, and one household verdict',
    summary: 'For a couple with two linked plans, the Household tab now works out the split of your household\'s spending that pays the least tax — the lower-taxed person fills their allowance and 20% band first, the other draws the rest — and shows it against each of you drawing for your own plan: the tax saved each year and until the smaller pot\'s State Pension, what it costs the smaller pot, and what each way leaves at 90. When the saving is over £1,000 a year the headline is at the top of the tab. The household verdict now comes first: when one pot is empty the other pays, and the household runs out only when both have. It is your choice; neither way is wrong, and nothing changes in either plan until you say so.',
    changes: [
      'Household → "Who draws what": year by year, in today\'s prices, the lowest-tax split of your household\'s after-tax spending, worked out with the planner\'s own tax sums. Each person is capped at the top of their 20% band where the money allows, never more than a pot holds, and never past a limit you set ("keep [name]\'s pot until 67" or "keep at least £X in it").',
      'The headline: "Drawing together saves about £X a year in tax — about £Y by the time [name] is 67", the cost to the smaller pot, then a table: tax in the first year, until the State Pension and over the plan; each pot at 67, 75 and 90; the money lasts in N of 10; what is left at 90 in a middling and a bad case. Then: "Paying the tax keeps [name]\'s pot, and your money more separate. This is your choice; neither is wrong."',
      'Both ways run through the one stress test, each plan on its own strategy, paired future for future.',
      'The verdict puts the household first: when one pot is empty the other pays that share. Each pot\'s own reading follows.',
      '"Use this split" writes the split into both plans\' income shapes after a confirm, with Undo. A locked plan is never changed: you are offered copies of both plans with the split instead. "Keep things as they are" dismisses it until either plan changes.',
      'One budget for the household: share this plan\'s budget with your partner\'s plan; each keeps its own "who pays" and ages. The Budget page says when it is shared.',
      'The April 2028 note when one of you is 55 or 56 on 6 April 2028 and draws before then.'
    ],
    corrections: [
      'The old "A tax thought" sentence understated the saving: 20% of the slice moved, in year 0 only, with nothing on what the smaller pot gives up. The real difference is 40% against about 15% where a quarter is tax-free, every year until the smaller pot\'s State Pension.',
      '"Both together" counted only futures in which each plan lasted on its own, so one partner\'s money never paid the other\'s share.'
    ],
    effects: {
      household: ['The tab opens with the comparison when it applies; the couples check\'s headline is the pooled household figure, with the each-on-its-own figure beneath it.'],
      budget: ['A partner\'s plan can read the household\'s budget through the other plan; nothing changes unless you share it.'],
      stress: [], strategies: [], decision: [], accumulation: []
    },
    actions: ['Couples: open the Household tab, run the check, read the headline. Nothing in either plan changes until you choose "Use this split".'],
    notes: [
      'The smaller pot is counted down at its real value with no growth for the cap (cautious by design); the strategy runs then judge both pots properly.',
      'Gilt-ladder plans: money a bought rung pays beyond the lower draw stays as cash in the pension, as the engine keeps it today; the tab says so. An option to reinvest it in the growth part is planned.',
      'Engine version unchanged (6.22.0). Two new saved keys only when you choose them: household.splitDismissed and budgetTool.sharedFrom.'
    ]
  },
  {
    version: '6.24.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'One answer to "will the money last?"',
    summary: 'Every screen of a plan now shows the same chance of lasting: the one stress test all nine strategies use, run with your own spending-cuts setting and your plan\'s full length. The first tab (now "Will it last?"), the strategy page, the Strategies ranking, Try a strategy, the couples check and the plan document can no longer disagree. The bad case is always the worst 1 in 10. History and Scenarios explain the test instead of giving a second figure. The test itself has not changed: no strategy\'s arithmetic moved; what changed is which test each screen shows.',
    changes: [
      'Stress tester → "Will it last?": the chance of lasting over 1,000 possible futures, in plain words ("lasts in 9 futures out of 10"); what is typically left and what is left in a bad case (the worst 1 in 10) and a good case; the income cuts — in how many futures income was cut, by how much a year and for how long. For Pots & Valves and Buckets in order, a line says what the same futures would do without the cuts.',
      'History ("What if you had retired into a bad year?") replays the one test\'s own real start years: the hardest starts since 1871 as an unfair test, and 1929, 1937, 1966, 1973, 2000 and 2008 one at a time. No second percentage; never "FAILED".',
      'Scenarios explains the named stresses — what each decade did to shares and prices and what retiring into it would have done to this plan — read from the one test\'s real history.',
      'The Strategies ranking lists the nine strategies by how many futures out of 10 each lasts, with what is typically left and the bad case beside it. The score, coverage ratio, "spent over the plan" and bumpiness live under "More columns".',
      '"Compare allocations" runs each split through the same one test. "Am I on course?" searches the one test for every strategy.',
      'The plan document keeps the figure it was locked with. When today\'s test on the same plan gives a different figure, the document page says so in one line.'
    ],
    corrections: [
      'One plan gave a different chance of lasting on almost every screen: the Monte Carlo tab ran its own futures (5-year blocks of 1928–2024), the Historical tab its own start years from 1928, the Scenarios tab five looped decades, the ranking ran with the cuts switched off, and the couples check ran its own Monte Carlo. The example plan read 90%, 100%, 86%, 93% and 96%. All are retired; every figure is the one test\'s (the example now reads 96% everywhere).',
      '"The worst case" meant the worst of 1,000 futures on one tab and the worst 1 in 10 elsewhere. It is the worst 1 in 10 everywhere.',
      'The Historical and Scenarios tabs marked real start years "FAILED", and marked a 1966 start "OK" while 375 of 468 months were cut. A start that ran out now says at what age; a cut says how much and for how long.',
      'The ranking\'s "level footing" toggle quietly ran Pots & Valves and Buckets without their cuts, against what the plan\'s own page showed. The rows now run the plan\'s own cuts setting and say so.'
    ],
    effects: {
      stress: ['The first tab\'s figure moves to the one test\'s: for a Pots & Valves or Buckets plan with cuts on, usually a point or two higher than the old Monte Carlo tab. The Historical tab\'s 100% is gone (a kinder, separate test). The per-tab "Simulation years" boxes are gone: the plan\'s full length runs everywhere. Nothing in the saved settings changes.'],
      strategies: ['The ranking\'s Pots & Valves and Buckets rows run with the plan\'s cuts setting, so for a plan with cuts on they read higher than before (the example: 91% → 96%) and the order can change. The score is unchanged in value.'],
      decision: ['Recorded months do not change. The plan document keeps its stored figure; the page may show the "earlier test" line beside it.'],
      accumulation: ['"Am I on course?" for a Pots & Valves plan searches the one test (200 futures, every sixth history, as other strategies already did): the pot it names can move by a few thousand pounds.'],
      household: ['The couples check runs both plans through the one test, paired future for future, whatever the strategies; a partner still working is no longer year-shifted inside the run (the Timing block projects their pots instead).'],
      budget: []
    },
    actions: ['Nothing to enter. Re-run "Will it last?" once to see the one figure. If you used the ranking\'s level-footing view, run Try a strategy with "Spending cuts: Off" for the same what-if.'],
    notes: [
      'Every strategy\'s arithmetic, the golden outputs, the plan corpus and the app-paths pin are byte-identical to 6.23.0.',
      'The quick questions in the preview (/v7/) ask a different question — "from today, over my whole life", with cuts off — and can still differ from the planner\'s figure; "Save this as a plan" states both.',
      'Deleted: the Monte Carlo tab\'s own run, the Historical tab\'s own run, the looped Scenarios, the allocation optimiser and its "Apply this split", the ranking\'s level-footing toggle and the couples check\'s own Monte Carlo.',
      'Engine version unchanged (6.22.0).'
    ],
    affects: (scenario) => {
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      if (!s) return [];
      const id = scenario.strategy && scenario.strategy.id;
      if (id === 'pots-and-valves' || id === 'buckets-in-order' || !id) return ['This plan\'s "Will it last?" figure now comes from the one test with your cuts setting: expect it a point or two different from the old Monte Carlo tab. A locked plan\'s document keeps its figure.'];
      return [];
    }
  },
  {
    version: '6.23.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The planner made plainer: no silent locks or overwrites, settings in view, a monthly entry that asks what your platform shows',
    summary: 'The first batch of fixes from a full review of the planner. Nothing locks or rewrites your plan without asking: a first monthly entry asks before it locks the plan and then runs the full lock; the budget\'s button into the plan asks first, changes one thing and offers Undo; writing a new plan document asks first. The seven ladder and floor strategies show the settings their engines use. A final-salary pension start is asked by age, and the plan says when it assumes a State Pension. The monthly entry asks for your pension total, cash and gilts or bond funds, with last month\'s figures filled in, and the tax-year set-up is three screens. Visitors start with a plan of their own and can keep three, and the example plan is read-only. Five things with no modern purpose are retired. Nothing in a locked plan changes.',
    changes: [
      'Recording a first month asks "This locks the plan. Lock it now?" — everyone, not only savers. Yes runs the same lock as Stress tester → Settings (settings copied across, plan document written), then records the month. "Not now" leaves the month unrecorded.',
      'How often you draw (monthly, quarterly, yearly) is a preference: changeable on a locked plan, and changing it never marks recorded months as "under previous settings".',
      'Budget: "Use £X a month as my spending" asks first ("was £Y"), changes only the plan\'s spending figure, and offers Undo for 15 seconds. A "+10%" button beside it replaces the "Optional headroom" box. The page says plainly: the budget is a guide; only that button changes the plan.',
      'Stress tester → Settings: the ladder, floor and rotation strategies now show the plan\'s length, charges, how the ISA grows, the taxable account, earnings and bed-and-ISA — their engines use them. A setting a way of drawing ignores says "Not used by this way of drawing".',
      'Final-salary pension: its start is asked by age, with the plan year and tax year said beside it; a start past the plan\'s end is refused instead of silently never paying.',
      'With no State Pension entered, Settings, the gilt order sheet and the plan document all say "assumed £12,000 a year from 67".',
      'Month by month asks for what your platform shows: pension total, of which cash, of which gilts or bond funds (shares are the rest; a ladder plan asks only total and cash). Last month\'s figures are filled in. "Enter by type instead" keeps the old boxes.',
      'The tax-year set-up is three screens: it no longer asks for tax bands the app knows (shown as "we assume …, change"), says "income before tax" instead of "target salary", and says the right thing about your State Pension instead of "0 years until state pension".',
      'Pasting your holdings: every line counts. A line the app cannot recognise asks "What is this?" (shares, bonds, cash, gold and trend, don\'t know); the summary says what was read and what was left out and why.',
      '"Try a strategy" runs the plan\'s full length, not a 35-year cap.',
      'The plan document: "Write a new version from today\'s settings" (was "Refresh the document") asks first; the current document becomes a past version. Its words follow the way of drawing (a ladder plan\'s document no longer describes Pots & Valves mechanics).',
      'Dates read as "September 2026" or "6 April 2027" everywhere. "Six strategies" is counted from the registry (nine). The abolished lifetime allowance is no longer mentioned.',
      'Visitors: "Just try it" starts a plan of your own; "Look around an example" opens the read-only £1M example. Without an account you can keep up to three plans in this browser window. One rule everywhere: "Kept in this browser window until you close it. Make a free account to keep it for good."',
      'Landing page: "New: answer one question in about two minutes (preview)" links to the preview\'s questions.',
      'Retired, with nothing in their place: the welcome tour, the old per-tool wizard, "⚙ Edit Tools" (every tab is on for every plan), the Copy from Stress / Copy from Decision buttons, and the budget\'s headroom box.'
    ],
    corrections: [
      'The first monthly entry locked an unlocked plan without asking, against the Decision tool\'s defaults (£500,000, 35 years), and wrote no plan document.',
      'A final-salary pension start typed as an age (65) into the "plan year" box was saved and never paid, with no warning.',
      'Budget, couples: a blank "Change who pays over time" row counted as "from age 0, my share 0%" and wiped your share. Blank or half-filled rows are ignored. "vs PLSA (couple)" compared one share with the couple standard; it now compares the household.',
      'The budget\'s words promised that age bands, one-off costs and "who pays over time" fed the plan; none did. The words are corrected and the unused code removed. "Use as the start of my income shape" also silently rewrote the Floor & Flex essentials; it no longer touches them.',
      'The tax-year set-up said "0 years until state pension" when the pension was in payment or its date was missing.',
      'Pasting holdings dropped lines it did not recognise: £282,550 pasted became a £97,300 pot. Every line now counts or is listed as left out.',
      'Guest wording contradicted itself ("nothing saved" beside "Saved ✓"); a guest was offered Delete Account; "Just try it" emptied the window of any other guest plan.',
      'The plan document\'s "Where you are" spoke of "the ladder\'s rungs" on plans with no ladder.'
    ],
    effects: {
      budget: ['A saved headroom figure is no longer read (it stays in the saved budget). Words change; no figure moves until you press the button.'],
      stress: ['Unlocked plans: the next Save writes the final-salary start age beside the plan year. Bought strategies show six more settings; their figures do not change. The Copy from Decision button is gone.'],
      strategies: ['The order sheet marks an assumed State Pension; figures unchanged. "Try a strategy" what-ifs run the plan\'s full length, so a what-if on a plan longer than 35 years can read differently from before.'],
      decision: ['A first month on an unlocked plan now asks before locking. How often you draw is saved as a preference outside the locked settings. New records keep what you typed and the split it became; old records are unchanged. The Copy from Stress buttons are gone.'],
      accumulation: [],
      household: []
    },
    actions: [
      'If you typed an age into the old "DB Starts (plan year)" box, check Stress tester → Settings → Other income: the words beside the box say when the pension pays.',
      'If no State Pension is entered, enter your forecast date and weekly amount in Settings.',
      'If you used "Optional headroom", press "+10%" beside the budget\'s Use button instead.'
    ],
    notes: [
      'Locked plans: settings, checksum, plan document, history and recorded months stay exactly as they were. Changing how often you draw writes only decisionTool.cadence.',
      'The "What is this?" answers map to plain stand-ins: shares → world growth, bonds → global bonds (£-hedged), cash → money market, gold and trend → gold.',
      'Engine version unchanged (6.22.0): no strategy\'s arithmetic changed.'
    ],
    affects: (scenario) => {
      const out = [];
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      if (s && +s.dbAmount > 0 && s.dbStartAge == null) out.push('This plan has a final-salary pension: check the start age now shown in Settings → Other income.');
      if (s && !(+s.spWeeklyAmount > 0) && !(+s.statePension > 0)) out.push('This plan has no State Pension entered: every run assumes £12,000 a year from 67. Enter your forecast in Settings.');
      return out;
    }
  },
  {
    version: '6.22.0', date: '2026-10-02', engineVersion: '6.22.0',
    title: 'Choose how your ISA grows; a plan locked while saving reads true; one bar for "on course"',
    summary: 'Until now every ISA grew at a fixed 3% a year, whatever prices did. Each plan now says how its ISA and savings grow: "Mostly cash" (the default) grows like the cash in your pension, by last year\'s rise in prices less 1%, never below nothing; "Invested like my pension" follows your pension\'s mix of shares, bonds and cash in the same futures. A plan you locked earlier keeps its figures. If you locked your plan while still saving, the monthly reading now compares like with like: your pot is put into the same prices as the locked path and read at the month you recorded it, refreshing the plan document starts its path again, and plans locked from now on count your ISA and what you pay into it. "On course" now means the money lasts in 9 futures out of 10 everywhere.',
    changes: [
      'Stress tester → Settings: "How your ISA and savings grow", with two choices. "Mostly cash" suits cash ISAs, savings accounts and money-market funds; "Invested like my pension" suits a stocks and shares ISA held like your pension. Pots & Valves and Buckets in order use it; the other strategies spend the ISA as part of their own pot, so it does not change them. The line above Monte Carlo, History and Scenarios says which it is, and so do Strategies → Background → Assumptions, the Drawdown table (which grows the ISA like cash at your assumed rise in prices, and now says when your runs grow it otherwise) and the plan document.',
      'Accumulation planner: a new box, "Into ISAs and savings (£/mo)", and an "ISA and savings" column in the projection. Your pots at retirement in the Timing block and the "When could I retire?" spin count it, and so do the runs — even when you have no ISA today.',
      'The monthly pot record keeps a blank ISA box as "no figure" (shown as a dash), not £0, so the reading asks for your ISA instead of counting it as empty. Type 0 if your ISA really is empty.',
      'A plan locked from now on while you are still saving draws its saving path on the preview\'s saving-years engine: 1,000 futures, a middle line and the 1-in-10 bad and good lines, counting your pension and your ISA and what goes into each.',
      '"Am I on track?" is now "Am I on course?", and looks for the pot that lasts in 9 futures out of 10. The "When could I retire?" spin reads "9 in 10 (on course)" first; its other choices are still there.',
      'Preview at /v7/: the same choice under the savings box in all three questions ("How your savings grow"), carried between them and into a plan you save. It applies while you save and once you stop.'
    ],
    corrections: [
      'ISAs and savings grew at a fixed 3% a year whatever prices did: in a future where prices rose 8% a year, where bad cases are, they lost about 5% a year of buying power; where prices rose 1%, they beat cash. With "Mostly cash" the chance of lasting can go up or down. In our tests, for someone with a £250,000 ISA and a £100,000 pension it went from 85% to 96% with cuts in a slump, and from 45% to 24% with no cuts. The amount typically left usually falls a little. With "Invested like my pension" most figures rise.',
      'A plan locked while still saving compared your pot, in pounds of the month you recorded it, with a path in the pounds of the day it was locked. After ten years a pot exactly on course read about 28% ahead ("above the strong line"), and the check when you reach your stop could offer to unlock and re-plan. Your pot is now put into the path\'s own prices, the 2.5% a year it was drawn with, and read at the month you recorded it.',
      'Refreshing the plan document drew a new path from your pot that day, but the reading still counted from the first lock, so you looked behind. It now counts from the document\'s own day.',
      'With no ISA today, an ISA at retirement in the Timing block (typed in its boxes) was left out of every run: the runs scale today\'s ISA, and £0 scales to £0. It now counts. In our tests, for someone retiring at 60 with £49,000 in an ISA at retirement and nothing in it today, the chance of lasting at £36,000 a year went from 47% to 69%.',
      '"On track" meant lasting in 85% of futures on the Accumulation planner and in the couples, survivor and care checks, but 90% in the age spin, while the preview used 9 in 10. All now use 9 in 10, so "Am I on course?" asks for a bigger pot than before: about 4% to 14% bigger on our test plans.'
    ],
    effects: {
      budget: [],
      stress: [
        'Unlocked plans: the ISA grows like cash unless you choose "Invested like my pension". The chance of lasting may rise or fall, and the amount left usually falls a little (on our test plans the chance of running out moved by 0.3 points or less, and the typical amount left fell by about 2% at most).',
        'Plans already locked: unchanged. The setting reads "A fixed 3% a year (this plan was locked before this choice was added; unlock to change)".'
      ],
      strategies: ['Pots & Valves and Buckets in order move with the ISA. The ladder, rotation and floor strategies are unchanged: they spend the ISA as part of their own pot.'],
      decision: [
        'Months already recorded do not change.',
        'If you locked while still saving, the first month after you stop compares your pot with the locked path in the same pounds, and counts your ISA on plans locked from 6.22.0. Leave the ISA box blank (or at £0) and your pension is compared with the path\'s own pension line instead.'
      ],
      accumulation: [
        '"Am I on course?" looks for the pot that lasts in 9 futures out of 10 (it used 85%), so it may now say you are short.',
        'The monthly reading against a locked path is in the same prices as the path, and is read at the month you recorded.',
        'A month recorded before 6.22.0 with ISA £0 is read as "no ISA figure" (the old form saved a blank box as £0): if the path counts your ISA, the strip asks you to add it.',
        'Pots at retirement saved in the Timing block change only when you next save the Timing block.'
      ],
      household: ['The couples, survivor and care checks call a plan on course from 9 futures in 10 (it was 85%). Each partner\'s plan uses its own ISA setting.']
    },
    actions: [
      'Check "How your ISA and savings grow" in Stress tester → Settings: choose "Invested like my pension" if your ISA is invested.',
      'If you are still saving, enter what you pay into ISAs each month on the Accumulation planner, and save the Timing block.',
      'If you locked your plan while saving and want the new path, which counts your ISA, refresh the plan document. The old one is kept under previous versions.'
    ],
    notes: [
      '"Mostly cash" is the same rule as the cash in your pension: last year\'s rise in prices less 1%, never below nothing. "Invested like my pension" uses your pension\'s shares, bonds and cash in the same futures, with no separate draw of its own; your diversifiers and reserve are not part of it.',
      'An ISA made of the ISA funds in your list of funds to test still follows those funds in the runs. The Timing block, the Accumulation planner and the spin project it as they did before (the middle rate), adding what you pay in; a saver\'s locked path grows it at those funds\' own mix.',
      'Plans made from a quick answer (preview) with no savings today now keep £0 as the ISA today, and the savings at the stop as the ISA at retirement; until now the savings at the stop stood in for both, so the new projections would have counted what you pay in twice. A plan saved that way before is put right when first opened (unlocked plans only); its runs start from the same ISA as before.',
      'The plan\'s fund and platform charge still comes off the ISA either way.',
      'Preview: anyone with savings sees new figures. For example, stopping at 55 with £95,000 of savings and £800 a month going in: the careful amount moves from £2,090 to £2,130 a month and the middle savings at the stop from £217,518 to £164,124. A couple living on savings until 57 sees the bridge years run short more often.',
      'Saved plans: schema version 3. Every unlocked plan is given "Mostly cash"; a locked plan is not touched and keeps a fixed 3% until it is unlocked. Plan documents: version 3 for plans locked from now on; earlier documents are never rewritten.',
      'Engine version 6.22.0: how the ISA grows changed (it changes a result only when the plan has the setting).'
    ],
    affects: (scenario) => {
      const s = scenario && typeof scenario === 'object' ? scenario : {};
      const st = s.stressTool && typeof s.stressTool === 'object' && s.stressTool.settings && typeof s.stressTool.settings === 'object' ? s.stressTool.settings : null;
      const out = [];
      const locked = !!(s.decisionTool && s.decisionTool.settings && s.decisionTool.settings.locked);
      const par = st && st.potAtRetirement && typeof st.potAtRetirement === 'object' ? st.potAtRetirement : null;
      const isaLater = st && st.retired === false && par && (+par.isa || 0) > 0 ? +par.isa : 0;
      if (st && ((+st.isaBalance || 0) > 0 || isaLater > 0)) {
        const which = (+st.isaBalance || 0) > 0 ? 'Your ISA of ' + gbp(st.isaBalance) : 'Your ISA at retirement of ' + gbp(isaLater);
        if (st.isaGrowth === 'cash') out.push(which + ' now grows like cash ("Mostly cash"). If it is invested, choose "Invested like my pension" in Stress tester → Settings.');
        else if (st.isaGrowth === 'invested') out.push('Your ISA follows your pension\'s mix ("Invested like my pension").');
        else if (locked) out.push('This plan is locked, so its ISA keeps growing at a fixed 3% a year and its figures do not move. Unlock it and it grows like cash from then on.');
      }
      // A plan made from a quick answer before 6.22.0 with money going into savings: the planner did not keep that figure.
      const fa = s.fromAnswer && typeof s.fromAnswer === 'object' && Array.isArray(s.fromAnswer.people) ? s.fromAnswer.people[0] : null;
      const savingsIn = fa && fa.payIn && +fa.payIn.savingsIn > 0 ? +fa.payIn.savingsIn : 0;
      const accS = s.accumulationTool && s.accumulationTool.settings && typeof s.accumulationTool.settings === 'object' ? s.accumulationTool.settings : null;
      if (!locked && savingsIn > 0 && !(accS && +accS.isaMonthly > 0)) out.push('This plan was made from a quick answer with ' + gbp(savingsIn) + ' a month going into savings. Enter it in "Into ISAs and savings" on the Accumulation planner so the Timing block and the spin count it.');
      const doc = s.planDocument && typeof s.planDocument === 'object' ? s.planDocument : null;
      if (locked && doc && doc.accumulation && typeof doc.accumulation === 'object' && doc.accumulation.version !== 3) {
        out.push('This plan was locked while you were saving: its monthly reading now puts your pot into the path\'s own prices and reads it at the month you recorded it. Refresh the plan document for a path that counts your ISA.');
      }
      return out;
    }
  },
  {
    version: '6.21.0', date: '2026-10-02', engineVersion: '6.19.0',
    title: 'Spending that changes with age in the preview questions, and the 2028 drawdown note for everyone it applies to',
    summary: 'In the preview questions (pensiontools.uk/v7/) you can now say how your spending changes as you get older, with as many steps and tapers as Stress tester → Your income shape: any number of steps by age, each staying level, falling by a percentage a year, or moving evenly to the next step, and "Suggest go-go, go-slow and no-go years". Answers say what you could spend at the start and at each step, and a chart shows every year. A plan saved from such an answer arrives in this planner with the same steps. The note about moving pension money into drawdown before 6 April 2028 now shows for everyone it applies to. Nothing in your existing plans changes.',
    changes: [
      'Preview: any number of spending steps by age. After each step, spending stays the same, falls by a percentage a year (up to 10%), or moves evenly to the next step.',
      'Preview: "Suggest go-go, go-slow and no-go years" fills in 15% less from 75 and 30% less from 85, never below your budget\'s essentials (the same rule as this planner\'s "Suggest go-slow & no-go steps"), with Undo. "Slowly less" is the old "declining with age" setting.',
      'Preview: each step shows its share of the starting amount and, if you have a budget, of your budget (a guide). The chart fits a phone screen, and "Show each year" opens a table.',
      'Preview: if the age you look at is at or after one of your steps, the answer, the table of ages, the hand-over to the other questions and a saved plan all start from that step\'s figure.',
      'Saved as a plan: the steps arrive in Stress tester → Your income shape and give the answer\'s after-tax amount every year. A fall of up to 5% a year (the most this planner\'s slider shows) is one step; a faster fall is saved as one step a year.',
      'Preview: the note "Move into drawdown what you will need before 57 by 5 April 2028" now shows for anyone aged 55 or 56 on that date who starts drawing before then, not only for couples who stop work in different years.'
    ],
    corrections: [],
    effects: { budget: [], stress: [], strategies: [], decision: [], accumulation: [], household: [] },
    actions: [],
    notes: [
      'Still to come in the preview, all designed: one-off costs by age, lump sums and "Turn a lump sum into income", the State Pension layers and budget mark while you set the steps, and the markers on the chart. Every option of this planner\'s income shape must be in the new version before it replaces this one.',
      'A checklist of every option and saved setting in this planner now guards the new version: a test fails if any of them has no home there or no recorded decision.',
      'Engine version unchanged (6.19.0).'
    ]
  },
  {
    version: '6.20.2', date: '2026-10-02', engineVersion: '6.19.0',
    title: 'A locked plan stays as you locked it',
    summary: 'Once a plan is locked, its Stress tester and Decision tool settings are meant to stay as they were. Only the two Settings forms checked that. The Budget, the optimiser, a few other buttons, and a browser tab opened before the plan was locked could still change them. Now every save checks first. On a locked plan, a button that would change the settings says "This plan is locked: unlock it in Stress tester → Settings to change it" and does nothing else. If you are still saving, you are asked before a Decision tool month locks your plan. The banner at the top suggests a next step that fits where you are, and the welcome tour now says correctly when a plan locks.',
    changes: [
      'If you are still saving and your plan is not locked, the Decision tool asks before a month locks it. It explains that locking freezes the plan, and that savers record their pot each month on the Accumulation tab, which locks nothing. Plans for people who have already retired work as before.',
      'The banner at the top of the planner suggests a next step that fits where you are. If you are saving, it points you to the Accumulation planner, not the Decision tool. For a plan made from an answer on the preview pages, the budget is offered as a guide beside the amount you chose, never as "Start here".',
      'Transition is in the phone\'s More menu.',
      'The welcome tour says when a plan locks, what freezes, what still works, and how to undo it.'
    ],
    corrections: [
      'On a locked plan, the Budget\'s "Use as the start of my income shape" and the walk-through\'s "Set as my plan\'s target" changed the Stress tester settings. The optimiser\'s "Apply this split", "Copy from Decision", the add-a-tool wizard and the Decision tool\'s "Reset" could change them too. Each is now refused, and the plan is left exactly as it was.',
      'On a locked plan, the Monthly Entry\'s "how often" choice (monthly, quarterly, a year at a time) changed the plan\'s settings. On a plan that had been unlocked before, that marked every month you had already recorded as "recorded under previous settings". The choice is now refused on a locked plan, and the picker goes back to what is saved.',
      'A browser tab or device that opened a plan before it was locked somewhere else, for example the first month recorded on your phone with a desktop tab left open, could still change the plan\'s settings and strategy. Saving a tax year from it could even unlock the plan. Each save now checks the plan as stored, just before it is written.',
      'Trying the app without signing in: the age on your Budget could be copied into a locked plan\'s Stress tester settings by an unrelated save, and carried into your account when you signed in. It now stays on the Budget.',
      'The welcome tour said "the Budget and Stress Tester never lock". That has been wrong since 6.5.0, when the Stress tester\'s settings began to lock with the plan.'
    ],
    effects: {
      budget: ['On a locked plan, "Use as the start of my income shape" and "Set as my plan\'s target" now say the plan is locked and change nothing. The budget itself still saves as you type.'],
      stress: ['On a locked plan, "Apply this split", "Copy from Decision" and adding a tool now say the plan is locked and change nothing. "Try a strategy" what-ifs still run.'],
      strategies: ['A locked plan\'s strategy cannot be switched from any tab, including a tab opened before the plan was locked.'],
      decision: [
        'On a locked plan, "how often" months are recorded can no longer be changed. To change it, unlock the plan in Stress tester → Settings.',
        'If you are still saving and your plan is not locked, recording a month or setting up its tax year asks first.'
      ],
      accumulation: [],
      household: []
    },
    actions: [
      'To change a locked plan, unlock it in Stress tester → Settings (you are shown first what unlocking changes), or duplicate it.',
      'If you use the app on more than one device and are told a plan is locked when you did not expect it, it was locked on another device. Reload the page to see it as it is.'
    ],
    notes: [
      'This release changes nothing that is already saved. Locked plans, their checksums, plan documents and monthly records stay exactly as they were.',
      'A locked plan can still change: its start date, which is saved the first time it is worked out; the unlock; its monthly records and tax years; its plan document; what you hold; your pot record; and your Budget.',
      'Limit: if you tried the app without signing in before this release and signed in with a locked plan, its Stress tester settings may carry the age from your Budget rather than the age it was locked with. That is the age you gave. Nothing in this release changes it.',
      'Engine version 6.19.0: the engine and strategies are unchanged.'
    ]
  },
  {
    version: '6.20.1', date: '2026-10-02', engineVersion: '6.19.0',
    title: 'Where you are: your pot is now set against the plan\'s band like with like',
    summary: 'On a locked plan, the "Where you are" line set your pension pot alone, in today\'s pounds, against the plan\'s band, which also counts your ISA and taxable account and is in prices at the start of the plan. So someone with an ISA could be told in bold "below the plan\'s 1-in-10 bad line" when they were not, and a few years of rising prices could make a pot look further ahead than it was. The pot is now made of the same accounts as the band, put into the plan\'s prices, and read at its own month. When a figure the band needs is missing, nothing is compared and the line says what to add. A full gilt ladder, or a ladder with rotation, now shows the figures without a verdict.',
    changes: [
      'The pot counts what the plan\'s band counts. Pots & Valves and Buckets: your pension, your ISA and your taxable account. A ladder plan: the growth part and the gilts still to pay, plus your ISA unless it is held aside. Each part says where it came from and when.',
      'The pot is put into prices at the start of the plan, which are the prices the plan\'s figures are in. It uses the CPI you entered for each tax year in the Decision tool, and 4% a year where none was entered. The line shows both figures.',
      'The band is read at the month of your figure, not at the start of the tax year. In the plan\'s first year it widens the way markets can move, instead of in a straight line.',
      'When a figure is missing, the line says what to add, for example "Add your ISA under What you hold, on the Transition tab, to compare."',
      'A figure more than three months old is named, with what to update.'
    ],
    corrections: [
      'The pension pot alone was set against a band of all your pots. With an ISA of £120,000, a pension of £600,000 read "below the plan\'s 1-in-10 bad line" (£650,000), when the £720,000 you have was above the plan\'s 1-in-10 good line.',
      'The pot was in today\'s pounds and the band in prices at the start of the plan. After three years of prices rising 4% a year, a pot exactly on the plan\'s median read "above the plan\'s 1-in-10 good line".',
      'Full gilt ladder and Gilt ladder + rotation: the plan counts the gilts at what they cost, and your monthly figure is what they would sell for today. Any dip in gilt prices, even £1, could read in bold as "below the plan\'s 1-in-10 bad line", although every rung still pays. These plans now show the figures without a verdict; the ladder line says whether the rungs are on track.',
      'Early in a plan\'s first year the band was drawn too narrow, so an ordinary dip of a few per cent in the first months could read "below the plan\'s 1-in-10 bad line".',
      'Pots & Valves with diversifiers: the pot could be taken from an old What you hold figure when newer monthly figures existed. The newer one is now used, with the diversifiers taken from What you hold.',
      '"At the start of the plan, priced on …; the cone opens from next year" appeared in later months and years, where it was not true. It now appears only in April of the plan\'s first year.'
    ],
    effects: {
      budget: [],
      stress: [],
      strategies: [],
      decision: ['A locked plan\'s "Where you are" line may now read differently: it counts your ISA and taxable account, puts the pot into the plan\'s prices, and gives no verdict on a full gilt ladder or a ladder with rotation. The plan, its document and your monthly records are unchanged.'],
      accumulation: [],
      household: []
    },
    actions: [
      'If the line asks for your ISA or taxable account, add it under What you hold on the Transition tab.',
      'When you set up each tax year in the Decision tool, enter last year\'s CPI. The pot is then put into the plan\'s prices at the real rate rather than at 4%.'
    ],
    notes: [
      'Nothing saved is changed: not the plan, its checksum, its document or your monthly records. Only the line is worked out differently.',
      'The other ladder plans (Ladder & ratchet, Floor & flex, Bridge & engine, Floor to an age, Floor the schedule) value the gilts still to pay at the yields the plan was locked on. A move in gilt prices since the lock is not taken out of your figure, so it can move your reading a little.',
      'Engine version 6.19.0: the engine and strategies are unchanged.'
    ]
  },
  {
    version: '6.20.0', date: '2026-10-02', engineVersion: '6.19.0',
    title: 'Couples who stop work in different years: each of you at your own stop',
    summary: 'The three preview questions (pensiontools.uk/v7/) used to take a couple as stopping work in the same year, and said so. Now each of you can stop on your own date: "When does your partner stop work?" — when you do, they already have, or at an age. Until you have both stopped, the one still working covers half of what you spend from their pay (or all of it, or none of it: one tap away) and keeps paying in; if the money of the one who has stopped cannot pay its part, their pay covers the rest, and the answer says from what age that happens in a bad case. If you have already stopped, "When can I afford to stop work?" and "Am I saving enough?" answer about your partner. An answer saved as a plan makes two linked plans, each beginning at its own person\'s stop. A couple who stop in the same year, and one person on their own, get exactly the answers they got before.',
    changes: [
      'Preview, all three questions: "When does your partner stop work?" in the partner block, with "They already have" (their pay-in is then not asked) and "At an age". Either shows one line — "Until you\'ve both stopped, the one still working covers half of what you spend from their pay, and keeps paying in" — with Change for "All of it" or "None of it".',
      'Preview, "When can I afford to stop work?" and "Am I saving enough?": "I\'ve already stopped" for a couple. The answer is then about your partner ("Yes — your partner could stop at 56"), and "you" stays you, so a plan saved from it has the right names. If you have both stopped, they point to "What is that a month?".',
      'Preview, More detail: "Already had the tax-free part of your pension?" for someone who has stopped. Yes means everything taken out is taxed.',
      'Preview, what the answer is made of: the years apart have a line of their own, for example "Until you are 57, while your partner is still working: £1,810 from your money + £1,810 from your partner\'s pay."',
      'Preview: savings between you go with whoever stops first, so they can be drawn on from then; money put into ISAs each month is split between those of you still working, each until their own stop.',
      'Preview: the links between the three questions carry your partner\'s stop, the pay line and the tax-free answers. "What is that a month?" from now, with your partner stopping later, opens the other two as "I\'ve already stopped".',
      'Preview, a couple who stop in different years: when a pension first opens before 6 April 2028 at 55 or 56, a note says to move into drawdown what will be needed before 57 by 5 April 2028.',
      '"Save this as a plan" from such an answer: two linked plans, each beginning at its own person\'s stop and both ending in the same tax year; the savings between you are in the plan of whoever stops first. Household tab: a line says when one plan begins later than the other, and what is counted until then.'
    ],
    corrections: [
      'Preview: for a couple where one of you has already stopped, every answer took you as stopping in the same year, so the money of the one who had stopped sat untouched until the other stopped, what it is paying for today was left out, and their half of what you put into savings each month never went in. Answers now take each of you at your own stop. For example, you 56, stopped, with £500,000; your partner 55 with £450,000, paying in £850 a month and stopping next year: the careful amount, once you have both stopped, is about £3,620 a month (it was £3,540 with the two of you taken to stop now).'
    ],
    effects: {
      budget: [],
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      household: ['Linked plans that begin in different tax years now carry a line on the Household tab saying when the later one begins, and that until then its person\'s pay covers their part. The check itself is unchanged; plans that begin in the same tax year say nothing.']
    },
    actions: [
      'If one of you has already stopped, or you will stop in different years, ask "What is that a month?" again with "When does your partner stop work?" answered.'
    ],
    notes: [
      'The money rules: until you have both stopped, the money of the one who has stopped pays its part (half unless you change it), and whatever it cannot pay is covered by the other\'s pay — that is not counted as running out. From the second stop the usual rules apply, on what each of you has then; if one of your pots runs out after that, the other pays all of it, so the money has run out only when both have. A couple who stop in the same year keep the rules they had.',
      'Stops are in whole years: next June counts as next year. A State Pension or final-salary pension paid to the one still working goes with their pay until they stop.',
      'The 2028 note shows only for a couple who stop in different years. Someone of 55 or 56 stopping now on their own, or a couple stopping together, does not see it yet, although the rule applies to them too.',
      'Saved plans are unchanged. A preview page opened before this release still saves its answer as it did (the old form of the hand-over is still read).',
      'Engine version 6.19.0: the planner\'s engine and strategies are unchanged.'
    ]
  },
  {
    version: '6.19.0', date: '2026-10-01', engineVersion: '6.19.0',
    title: 'Fund and platform charges are now taken off: 0.5% a year unless you change it',
    summary: 'Until now no charges were taken off once money was being drawn, which made every plan look better than it is likely to be. Each plan now has one setting, "Charges (funds and platform), % a year", starting at 0.5%. It comes off every month, while you save and while you draw, from the money held in funds and cash in your pension, ISA and taxable account. It does not come off gilts you hold directly, annuities, final-salary or State Pensions. A plan that was already locked keeps its figures: it runs without charges until you unlock it.',
    changes: [
      'Stress tester → Settings → Your allocation: "Charges (funds and platform), % a year", from 0% to 3% in steps of 0.05%. Put in what your funds charge plus what your platform charges (for example, a 0.2% tracker on a 0.25% platform is 0.45%). The line under the box shows what the funds you hold charge, so you only add the platform\'s fee.',
      'Monte Carlo, History, Scenarios, every strategy, the Strategies comparison, the Household checks, the drawdown schedule, the Accumulation planner, the Timing block\'s pots at retirement and the retire-at-what-age sweep all take the charge off. The line above Monte Carlo, History and Scenarios says what charge the runs take.',
      'A plan document written from now on records the charge it was worked out at, under Assumptions.',
      'New plans and plans reset to defaults start at 0.5%; a plan made from a preview answer starts at the charge that answer used (0.5% unless you changed it).',
      'Preview at /v7/: the same setting under "Add more detail" in all three questions. It is now taken off while you draw as well as while you save.'
    ],
    corrections: [
      'Fund and platform charges were not taken off once money was being drawn (the Assumptions page listed them as "not modelled"), so every plan looked better than it is likely to be. At 0.5% a year, a plan close to the edge loses about 4 to 15 points of its chance of lasting, and even a comfortable plan can lose up to about 6 points on the History tab. The amount typically left falls by about a fifth to two fifths: by more when little is left, and by less when the plan runs for fewer years. Gilts held directly are not charged, so plans built on them move least. For example, the guest demo (£1M, £40,000 a year rising) goes from lasting in 94% of futures to 90%, and the amount it typically leaves falls by about 30%.'
    ],
    effects: {
      budget: [],
      stress: [
        'Unlocked plans: 0.5% a year is now taken off, so the chance of lasting and the amount left go down.',
        'Plans already locked: unchanged. The setting reads "0% (this plan was locked before charges were added; unlock to change)" and the runs say no charges are taken off. A plan locked from now on keeps the charge it had when it was locked.'
      ],
      strategies: [
        'Unlocked plans: every strategy\'s figures move. The parts held in funds and cash are charged; gilts held directly are not, so a gilt ladder moves least. The cash years before a ladder\'s first rung cost a little more. The rotation trigger still reads the market, not your holding.'
      ],
      decision: [
        'No effect: months already recorded, your balances, the plan-versus-actual yardstick and a locked plan\'s document keep their figures. Charges are a projection input only.'
      ],
      accumulation: [
        'Projections to retirement now take the charge off every month. The "your mix" line uses the plan\'s charge in place of your funds\' own charges, so they are not counted twice.',
        'A "pots at retirement" figure saved in the Timing block changes only when you next save the Timing block.'
      ],
      household: ['Each partner\'s plan uses its own charge. A partner plan that was already locked stays at 0% until it is unlocked.']
    },
    actions: [
      'Check the charge in Stress tester → Settings: your funds\' yearly charge plus your platform\'s fee.',
      'If you are retiring later, open the Timing block and save it, so the pots at retirement include charges.',
      'A plan that was already locked stays at 0%. To have charges taken off, unlock it: it then takes 0.5% a year, which you can change. To keep its record as it is, duplicate it instead (the copy starts at the plan\'s own 0%, which you can change).'
    ],
    notes: [
      'Not charged: State Pensions, final-salary pensions and annuities, which have no such charge, and gilts you hold directly (a ladder\'s rungs, the gilts in a taxable account), for which platforms usually charge a small fixed fee. Money held back for later rungs (a windfall, a ladder\'s spare) is held at its real value and not charged.',
      'Each charged pot is multiplied by (1 − c)^(1/12) after each month\'s growth, so twelve months take off exactly c. At 0% every figure is exactly what it was.',
      'Saved plans: schema version 2. On first load, every unlocked plan is given 0.5% in its Stress settings. A plan locked at that point is not touched at all: its settings, plan document, archives and history stay as they were, and its Decision checksum does not move.',
      'The −1.5 points a year cut on US share returns stands for world shares, not costs; it is unchanged.',
      'Engine version 6.19.0: every strategy\'s arithmetic changed (it changes a result only when the plan has a charge).'
    ],
    affects: (scenario) => {
      const s = scenario && typeof scenario === 'object' ? scenario : {};
      const st = s.stressTool && typeof s.stressTool === 'object' ? s.stressTool.settings : null;
      if (!st || typeof st !== 'object') return [];
      const locked = !!(s.decisionTool && s.decisionTool.settings && s.decisionTool.settings.locked);
      const v = st.chargesPct;
      const pct = typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 3 ? v : null;
      if (pct === null) {
        return locked ? ['This plan is locked, so it is held at 0%: its figures do not move. Unlock it and 0.5% a year is taken off from then on (Stress tester → Settings).'] : [];
      }
      if (pct === 0) return ['This plan takes no charges off (0% in Stress tester → Settings), so its figures are as they were.'];
      return ['This plan now takes ' + pctText(pct) + '% a year off for fund and platform charges, so its chance of lasting and the amount left are lower than before. Change it in Stress tester → Settings.'];
    }
  },
  {
    version: '6.18.0', date: '2026-10-01', engineVersion: '6.17.0',
    title: 'Keep an answer from the preview as a plan, five corrections, and faster tax sums',
    summary: 'An answer from the preview question pages (pensiontools.uk/v7/) can now become a plan here, under a name you choose — we suggest one such as "Stop at 60 · £1,800 a month", never "My plan". It is always a new plan beside your others: nothing you have is overwritten and a locked plan is never touched. Your figures wait in this browser until the plan is made, are never used after a day, and never go into the page address. Five corrections reach every user: the pots a plan retiring later starts from are now stated correctly, the Household table follows a stepped income shape, start years are right west of Greenwich, and "Just try it" no longer deletes plans already in the tab. Working out the before-tax amount for a take-home figure is now three to four times faster, with identical results.',
    changes: [
      'From a preview answer ("What is that a month?", "When can I afford to stop work?", "Am I saving enough?") to a new plan: you confirm the name, and the plan opens at Stress tester → Settings with a note saying where it came from and why its own test can differ from the quick answer, giving the quick answer\'s figure (for example "the money lasted to 95 in 4 futures out of 10 (43%)"). A couple gets two linked plans, each saying whose part of the monthly amount it holds.',
      'On a plan made from a preview answer, the Budget page shows your budget as a guide beside the target you chose, and the income-shape chart marks it "your budget (a guide)". The budget never sets the target unless you press "Use as the start of my income shape".',
      'In a browser tab that already holds plans made without an account, the landing page offers "Carry on with the plans in this tab".',
      'The before-tax amount for a take-home figure is found three to four times faster. Every result is the same to the last digit: the old search is kept in the tests and compared on hundreds of thousands of figures.',
      'Preview at /v7/: "When can I afford to stop work?" and "Am I saving enough?" join "What is that a month?", which now asks whether you are still paying in (your part and your employer\'s). The three give the same figure for the same household. A "What would you spend?" step lets you work out a budget line by line or put in one figure; the figure used is always your own.'
    ],
    corrections: [
      'Plans retiring later with pots at retirement set: the line above Monte Carlo, History and Scenarios said the runs start from your pots today; they start from the pots at retirement, and the line now says so (the results themselves are unchanged).',
      'With pots at retirement typed into the Timing block, its line said every strategy was priced on the planner\'s own projection. It is priced on the figures you typed; the line now says so and shows the projection for comparison.',
      'Household tab: for a plan whose income shape is a set of steps with no saved year-by-year schedule, the year-by-year table, the survivor and care checks and the tax note used the first step in every year. They now follow the steps, as the plan\'s own test does.',
      'In time zones west of Greenwich (the Americas), an age recorded on the same day and month as the State Pension date counted that day as an extra birthday, so the plan started a tax year early. Dates are now read as the day you are in.',
      '"Just try it — no account" in a tab that already held plans made without an account deleted all but one of them. It now carries on with them.'
    ],
    effects: {
      budget: ['A plan made from a preview answer: the summary shows the budget\'s total as a guide beside the plan\'s own target. Every other plan: unchanged.'],
      stress: ['Plans retiring later with pots at retirement: the starting-balances line now gives the pots at retirement the runs use; no figure moves. Plans with pots at retirement typed in the Timing block: its line now says those figures price the strategies. Only west of Greenwich, where the age was recorded on the State Pension date\'s day and month: the start year moves to the right one, and the results with it.'],
      strategies: ['Only the time-zone case above: the start year, and with it the ladder and costs, move to the right year.'],
      decision: ['No effect: months already recorded, the saved start year and a locked plan\'s document keep their figures.'],
      accumulation: [],
      household: ['Plans whose income shape is steps without a saved schedule (every plan made from a preview answer): the year-by-year table and the survivor, care and tax checks now follow the steps.']
    },
    actions: ['If you live west of Greenwich, check your plan\'s start year in Stress tester → Settings → Timing.', 'If you use the Household tab with a stepped income shape, run the check again.'],
    notes: ['Plans made from a preview answer are ordinary plans, kept where your other plans are: no new kind of data and no new service. The privacy policy now describes the figures held in the browser while a plan is made, and the note left in the tab saying whether a plan was made.', 'Engine version unchanged (6.17.0): no strategy\'s arithmetic changed.'],
    affects: (scenario) => {
      const out = [];
      if (scenario && scenario.fromAnswer) out.push('This plan was made from a preview answer: its description gives the quick answer\'s own figure beside the planner\'s.');
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      if (s && s.retired === false && s.potAtRetirement) out.push('This plan retires later: Monte Carlo now says it starts from your pots at retirement.');
      return out;
    }
  },
  {
    version: '6.17.0', date: '2026-09-30', engineVersion: '6.17.0',
    title: 'Diversifiers run down everywhere, tax-free plans run twice as fast, and a preview of the next version',
    summary: 'Three engine changes and a first look at the next version of PensionTools. Your diversifiers sleeve now runs down over the plan like shares and bonds in the Glidepath table and in the "which pot pays" decision, as it already did in the protection test. Plans that take a quarter of each withdrawal tax-free run about twice as fast, with identical results. The last copies of the old tax sum are gone. And a preview of the next version is at pensiontools.uk/v7/ — one question so far, "I\'ve got about £X, what is that a month?" — separate from this app and unable to touch a saved plan.',
    changes: [
      'Glidepath table and "which pot pays": the diversifiers sleeve is measured against a target that rises with prices and runs down to nothing by the end of the plan, in the simulations and in the monthly advice alike. Before, the two could name different pots to pay the same month.',
      'Plans with a quarter of each withdrawal tax-free: the monthly sum is worked out exactly instead of by a search. A £250,000, 37-year plan takes 0.27 s for 1,000 futures instead of 0.54 s. Results are unchanged to the penny.',
      'The tax-year wizard uses the 45% threshold you enter.',
      'Preview of the next version at /v7/: answers "what is that a month" for one person or a couple in under two minutes, with every assumption listed. Nothing you type there is saved. It is unlinked and not yet finished.'
    ],
    corrections: [
      'A saved Decision record or panel made without the engine\'s own tax figure used an old sum that ignored the withdrawal of the allowance above £100,000: at £110,000 a year the tax is £33,432, not £31,432.',
      'The Budget tool\'s before-tax income for a take-home above £72,568 was too low: £80,000 take-home needs £118,580 before tax, not £112,387.'
    ],
    effects: {
      decision: ['Plans with a diversifiers sleeve: the sleeve is ranked against its run-down target when choosing which pot pays. Months already recorded keep their figures.'],
      stress: ['Plans with a diversifiers sleeve move a little: on a £300,000 plan with a £45,000 sleeve the chance of running out is unchanged and the typical amount left moves by under 2%. Other plans: unchanged.'],
      strategies: ['Glidepath table: the diversifiers column now falls over the plan; year 30 shows £0 rather than the starting value. A locked plan\'s document keeps its figures.'],
      household: [], budget: ['Before-tax income is corrected above £72,568 of take-home.'], accumulation: []
    },
    actions: ['If your plan has a diversifiers sleeve, re-run the stress test.'],
    notes: ['The preview at /v7/ is the first of several steps; it cannot open or save a plan yet (6.18.0 added that).'],
    affects: (scenario) => {
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      return (s && +s.diversifierStart > 0) ? ['This plan has a diversifiers sleeve: the Glidepath table and "which pot pays" now use its run-down target. Re-run the stress test.'] : [];
    }
  },
  {
    version: '6.16.0', date: '2026-09-30', engineVersion: '6.16.0',
    title: 'Income tax above £100,000 is now worked out correctly',
    summary: 'If your taxable income in any year goes above £100,000, the app was charging too little tax. Above £100,000 you lose £1 of tax-free allowance for every £2 of income; the app taxed that lost allowance at 20% when the rule is 40%. It is now right to the penny against the published rates. If your income never goes above £100,000 in any year of your plan, nothing has changed.',
    changes: [
      'Tax above £100,000 follows the published rules exactly: the 20% band stays £37,700 wide, 40% applies up to £125,140 and 45% above.',
      'The tax-year set-up in the Decision tool uses the same single tax sum as the rest of the app; its own copy stopped at 40%.',
      'A new check compares the app\'s tax with hand-worked figures for fourteen incomes from £0 to £200,000, to the penny, every time the app is tested.'
    ],
    corrections: [
      'Too little tax: £1,000 a year at £110,000, and £2,514 a year at £125,140 and above. At £150,000 the app said £51,189; the right figure is £53,703.',
      'The tax-year set-up wizard ignored the loss of the allowance and the 45% rate: at £150,000 it said £47,432.'
    ],
    effects: {
      decision: ['Only tax years with taxable income above £100,000: the tax shown is higher and the take-home lower. Months already recorded keep their figures.'],
      stress: ['Plans that draw more than £100,000 in a year change slightly. So do long plans whose income passes £100,000 in later years\' money, because the £100,000 point is held fixed (it has not moved since 2010) while other bands rise with prices. On a £59,450-a-year plan the lifetime tax rose by under 1%.'],
      strategies: ['As for the Stress tester. A locked plan\'s document keeps its figures.'],
      household: [], budget: [], accumulation: []
    },
    actions: ['If a lump-sum withdrawal or a high-income year is part of your plan, re-run it to see the corrected tax.'],
    notes: ['The Budget\'s quick take-home estimate is still approximate above £100,000.']
  },
  {
    version: '6.15.0', date: '2026-09-30', engineVersion: '6.15.0',
    title: 'Diversifiers get a glidepath, protection to the penny, an offer for out-of-date drafts, and plan download',
    summary: 'The diversifiers sleeve now has a glidepath like shares and bonds, and the protection test is made in whole pennies. A draft plan whose start year has gone by offers to move to this tax year instead of reading as "already running". You can download a copy of a plan to your own computer. Every saved plan is now stamped with a version so that future changes to how plans are stored can be made safely.',
    changes: [
      'Protection (Pots & Valves): the diversifiers glidepath rises with inflation and runs down over the plan, exactly like shares and bonds. Before, it was flat in pounds.',
      'Protection is judged in whole pennies: a pot sitting on its glidepath to the penny is on it, not below it.',
      'A draft whose start year has passed asks: "This plan was set to start in 2027/28, which has passed. Update it to start now?" Update moves it to this tax year; Leave it keeps it and does not ask again. Nothing is moved or deleted automatically. Locked plans and plans with recorded months are never asked.',
      'Download this plan: the plan menu saves the active plan to your computer as a file. It holds your figures but no account ID or email.',
      'Every plan is saved with a version number. An older plan is brought up to date once when opened; if that fails the saved plan is left exactly as it was.',
      'A tab left open on an older version of the app will not save over a plan a newer version has updated; it asks you to reload.'
    ],
    corrections: [
      'One protection month in the tests was decided by a rounding error of less than a billionth of a pound.',
      'A diversifiers sleeve that had fallen behind inflation still read as on target.',
      'The "Plan starts" drop-down could be blank; it now shows the saved year.',
      'Labels that still described protection as counting cash draws.'
    ],
    effects: {
      decision: ['Plans with a diversifiers sleeve: protection may start or end in a different month. Months already recorded keep their figures. A locked plan\'s settings, recorded months and plan document are not touched by the version stamp.'],
      stress: ['Plans without a diversifiers sleeve: no change (13 test plans gave identical figures). With a sleeve, results move a little in either direction: on a £300k plan with a £45k sleeve, futures entering protection went from 63 to 62 in 100.'],
      strategies: ['Buckets in order and the bought strategies are unchanged.'],
      household: [], budget: [], accumulation: []
    },
    actions: ['If your plan has a diversifiers sleeve, re-run the stress test to see the updated figures.'],
    notes: ['Still open: the Glidepath table shows the diversifiers column flat, and "which pot pays" ranks the sleeve against its starting value. Both will follow the new glidepath in a later release.'],
    affects: (scenario) => {
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      return (s && +s.diversifierStart > 0) ? ['This plan has a diversifiers sleeve: its protection results will move a little. Re-run the stress test.'] : [];
    }
  },
  {
    version: '6.14.0', date: '2026-09-30', engineVersion: '6.14.0',
    title: 'Protection by the glidepath rule, start years that stay put, and locked ladders that stay locked',
    summary: 'Five things the new automatic tests found. Protection mode for Pots & Valves now follows one plain rule: a month counts when shares plus bonds plus diversifiers add up to less than the sum of their glidepaths, and protection switches on after the set number of such months in a row. Which pot paid that month no longer matters, and the diversifiers sleeve is counted. A plan\'s start year is now saved the first time it is worked out, so an old plan no longer moves a year every 6 April. A locked gilt ladder shows the ladder in its plan document, not one re-priced at today\'s gilt prices. A plan with no age entered is no longer treated as a 45-year-old. And pasting holdings can no longer merge a gilt into a fund.',
    changes: [
      'Protection (Pots & Valves): months in a row with the growth pots below their glidepaths, diversifiers included. Leaving protection is unchanged. The simulations and the monthly advice now agree on every month.',
      'Protection is not applied to the monthly figure of a bought gilt ladder: its income is already paid for.',
      'Locked gilt-ladder plans: order sheet, costs, spare and monthly figure come from the plan document everywhere. One line marked "Comparison only" shows what the remaining gilts would cost today.',
      'Opening a plan saves its start year once if it was never saved.'
    ],
    corrections: [
      'A retired plan last saved before 6.4 moved its start year, ages and every ladder rung on 6 April; a saved start year that had passed was thrown away.',
      'A locked gilt ladder drifted from its plan document as gilt prices moved.',
      'The blank Budget\'s placeholder age of 45 was read as the user\'s age.',
      'A pasted gilt recognised by name could be folded into a fund line sharing a stray code.',
      'An old Pots & Valves plan could be sized on a pot total left behind by a deselected ladder.'
    ],
    effects: {
      decision: ['Pots & Valves plans: protection may start a month or two earlier or later than before. Gilt-ladder plans: the monthly figure is never trimmed by protection. Records already saved keep their figures; a locked plan\'s settings fingerprint does not change.'],
      stress: ['Pots & Valves results move a little. Without a diversifiers sleeve, the share of futures entering protection changes by about one point and the chance of lasting did not change on the plans tested. With a sleeve the change is larger: on a £300k plan with a £45k sleeve, futures entering protection fell from 77 to 63 in 100.'],
      strategies: ['Buckets in order and the bought strategies are unchanged. A locked plan\'s document keeps the figures it was locked with.'],
      household: [], budget: ['The age boxes still show 45 and 60 until you change them, but they no longer count as your age.'], accumulation: []
    },
    actions: ['If your plan shows age 45 and you never entered it, correct your age in the Timing block.'],
    notes: ['These were found by the automatic tests added in September 2026, which now run before every change is published.']
  },
  {
    version: '6.13.4', date: '2026-09-30', engineVersion: '6.13.4', announce: true,
    title: 'Monte Carlo results are now identical on every device',
    summary: 'Monte Carlo results are now identical on every device. Until today the same plan could show slightly different Monte Carlo figures on a phone, a Mac and a Windows PC: the random futures were drawn with a formula built on the sine function, and browsers and processors do not all agree on the last decimal place of a sine. The formula magnified that last digit into a different set of random futures, so the fan charts differed by about 0.5% to 3% between machines. The random futures now come from a standard whole-number generator that every browser and processor computes exactly alike. Because the set of random futures is a new one, Monte Carlo figures move slightly this once, by no more than re-running with a different random seed would move them. Nothing about how a plan is modelled has changed.',
    changes: [
      'The same plan now gives the same Monte Carlo answer on every device and browser, to the pound.',
      'The same plan now gives the same answer in every time zone (it could differ by £1 to £15 on a cone between a device set to UK time and one set to another zone).'
    ],
    corrections: [
      'Monte Carlo figures differed from one device to another (about 0.5% to 3% on the fan charts), because the random numbers came from a sine-based formula whose last digit varies between browsers and processors.',
      'The share of the State Pension paid in its first tax year was measured in hours rather than whole days, so a start date in winter came out one hour short of the days to 6 April (clocks change in between): about £1 of State Pension in that one year.',
      'A plan with no start tax year saved (made before v6.4.0, with no age entered) and a State Pension date in summer time counted one day too many of State Pension in the year it starts: about £30, in that one year only.',
      'Gilt rotation measured each gilt\'s time to maturity from a 6 April one hour out.',
      'A State Pension date typed as 2037-04-17 could be read as the day before on a device set to a time zone west of the UK.'
    ],
    effects: {
      stress: [
        'Monte Carlo figures move slightly the next time a plan is run, because the random futures are a new set. On the plans we test with: chance of success within 0.3 of a percentage point; median end pot within about 1%; the poor-markets line (the worst 1 in 10) within about 6%. The Monte Carlo tab\'s own run can move a little more on a plan near the edge: up to about 2 points on the chance of success and about 7% on the median end pot. That is the ordinary spread between one set of 1,000 random futures and another, not a change to the model.',
        'Historical results move by a smaller amount: the bond fund\'s year-to-year variation comes from the same random numbers.',
        'From now on the figures do not change from one device to another.'
      ],
      strategies: [
        'Pots & Valves and Buckets in order: ruin rate, fan charts and end-pot figures move slightly, by the amounts above. The ranking of strategies in the comparison can change only where two were already within that margin of each other.',
        'The gilt-ladder strategies (full ladder, rotation, floors, ladder & ratchet, bridge & engine) already used a whole-number generator: their figures move by a few pounds at most, from the State Pension day-count correction.',
        'A locked plan\'s plan document is untouched. It is the record of the plan as you committed it, with the figures and the engine version of that day, and it is never recalculated.'
      ],
      decision: ['Nothing is re-judged. Recorded months keep their figures. In the one tax year a State Pension starts, a winter start date pays about £1 more over the year than before.'],
      accumulation: ['The Monte Carlo range for the pot at retirement moves slightly, for the same reason.'],
      household: ['Joint Monte Carlo results move slightly, for the same reason.'],
      budget: []
    },
    actions: ['Nothing to do. If you keep your own note of a Monte Carlo figure, expect it to read slightly differently on the next run and then to stay put on every device.'],
    notes: [
      'Generator: sfc32 (32-bit whole-number arithmetic only), seeded by hashing the run number. Run i still draws its market years with seed i × 12345 and its bond variation with seed i, as before.',
      'Device-to-device agreement is to well under a penny rather than to the last binary digit: the power, logarithm and cosine functions used elsewhere in the model can still differ in their last digit between browsers, but nothing magnifies that difference.',
      'Engine version 6.13.4 (was 6.4.0). Plans locked earlier keep the engine version they were locked under.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const id = ss.strategyId || scenario?.strategy?.id || 'pots-and-valves';
      if (ss.configured && (id === 'pots-and-valves' || id === 'buckets-in-order')) out.push('This plan\'s Monte Carlo figures will read slightly differently the next time it is run (chance of success typically within half a percentage point), and then the same on every device.');
      if (scenario?.planDocument) out.push('This plan\'s plan document is unchanged: it keeps the figures it was locked with.');
      return out;
    }
  },
  {
    version: '6.13.3', date: '2026-09-23', engineVersion: '6.4.0',
    title: 'Transition in plain words for someone already retired',
    summary: 'For a retiree whose ladder starts next April the page talked about "the plan starting" and "months to go" as if a retirement date were coming, and sized the run-up on the plan\'s first step (£6,667) rather than the £7,000 a month actually drawn. It now opens with "You are already retired. Your gilt ladder pays from tax year 2027/28 (6 months away). Until then you draw £7,000 a month from your SIPP cash", uses the Decision tool\'s actual monthly payment for the run-up, and shows a small table of the cash to hold now: the run-up months, each cash year, and how much of a year a lump sum pays.',
    changes: ['Transition: "Cash to hold now" table; the cash line is simply "Money-market fund / cash (e.g. CSH2)".', 'Stage label: "Retired — run-up to the plan\'s first tax year".'],
    corrections: ['Run-up sized on the plan\'s first step instead of the actual monthly draw.'],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] }, actions: [], notes: []
  },
  {
    version: '6.13.2', date: '2026-09-23', engineVersion: '6.4.0',
    title: 'Transition: the run-up months count as cash to hold; readable input boxes',
    summary: 'Before a plan\'s year 0 the cash target on the Transition tab covered the cash years only, so someone six months from the start with £40,000 of run-up draws still to pay saw that money as spare. The months still to pay are now part of the target (each month\'s draw from the plan\'s year-0 row, capped at the cash set aside), and drop out as they pass. The What-you-hold card\'s boxes were browser-default white with grey text; they now match the rest of the app.',
    changes: ['Transition cash line: "… + the 6 run-up months still to pay (£40,000)".'], corrections: ['What-you-hold input styling.'],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] }, actions: [], notes: []
  },
  {
    version: '6.13.1', date: '2026-09-16', engineVersion: '6.4.0',
    title: 'No question about the Stress tester\'s list',
    summary: '6.13.0 asked, once, whether the Stress tester\'s fund list was what you hold. Even the question treated that list as a candidate for your holdings, and for a gilt-ladder plan the list is not used at all. The question is gone: what you hold starts empty and you paste or type it.',
    changes: [], corrections: ['Transition tab: the one-time "is that what you actually hold?" question.'],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] }, actions: [], notes: []
  },
  {
    version: '6.13.0', date: '2026-09-16', engineVersion: '6.4.0',
    title: 'What you hold is its own record; each strategy keeps its own inputs',
    summary: 'One list in the Stress tester\'s Settings, "My funds", was doing two jobs: the portfolio a pot strategy is TESTED on, and the record of what you actually hold that the Transition tool, the Accumulation planner and the plan document read. A test list from an old experiment was being read as holdings. The two are now separate. WHAT YOU HOLD is recorded on the Transition tab (paste it from your platform or type the lines), belongs to the plan, is never written by any strategy and is never frozen by the lock. The Stress list is renamed FUNDS TO TEST and says what it is; every strategy keeps its own funds, alloc mode and dials — switching strategy puts them away and switching back restores them, so nothing from a deselected strategy bleeds into another. Transition reads what you hold against the locked plan: rungs already paid drop out of the target, and a ladder fully in place reads "Complete — nothing to do", with a rotation watch line only on the rotation strategy.',
    changes: [
      'Transition tab: a "What you hold" card — paste from your platform, add, edit or remove lines; every change saves when you leave the box. The moves, the schedule and "complete" read from it.',
      'Accumulation planner and the Decision tool\'s "enter per fund" links read what you hold — and only that.',
      'Plan document: "What you held when the plan was locked" for every strategy; the pot-strategy fund table is retitled "Funds the strategy was tested on".',
      'Stress tester → Settings: "Test on a list of funds" replaces "Use my own funds"; the list is per strategy.',
      'Strategies pages and what-ifs: adopting a strategy restores its own dials, never another\'s.'
    ],
    corrections: [
      'The Stress tester\'s fund list was read as what you hold (Transition, Accumulation, plan document, retire spin).',
      'Strategy dials from a deselected strategy persisted in the saved plan and could reach another strategy\'s run and the plan document.',
      'Adopting Pots & Valves or Buckets with allocation dials wiped the fund list.'
    ],
    effects: {
      decision: ['"Enter per fund" lists what you hold; it is empty until you record it on the Transition tab.'],
      stress: ['Nothing is assumed about what you hold: record it on the Transition tab. Strategy runs are unchanged.'],
      strategies: ['Each strategy\'s dials are its own from the first save after this release; stray keys from earlier switches are dropped then.'],
      household: [], budget: [], accumulation: ['Proportions and the pension pot today read what you hold; empty until you record it.']
    },
    actions: ['On the Transition tab, record what you hold: paste your platform\'s holdings table or type the lines.'],
    notes: ['Nothing is deleted: the Stress tester\'s list stays as the funds that strategy is tested on.'],
    affects: (scenario) => {
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      const out = [];
      if (s && Array.isArray(s.taggedFunds) && s.taggedFunds.length) {
        const n = s.taggedFunds.length;
        out.push('This plan\'s Stress tester fund list (' + n + ' fund' + (n === 1 ? '' : 's') + ') is now "Funds to test" for its current strategy only. Nothing is assumed about what you hold: record that on the Transition tab.');
      }
      if (s && s.strategyParams && Object.keys(s.strategyParams).length > 0) out.push('This plan\'s strategy dials become the current strategy\'s own on its next save; anything left behind by an earlier strategy is put under that strategy, not dropped.');
      return out;
    }
  },
  {
    version: '6.12.6', date: '2026-09-16', engineVersion: '6.4.0',
    title: 'My funds can be corrected while the plan is locked',
    summary: 'A locked plan froze the whole of the Stress tester\'s Settings, including the My funds list — so a wrong or stale line (a test entry, a mis-read paste) could not be removed without unlocking. What you hold is not a plan setting: Save Settings on a locked plan now saves the My funds list and nothing else, and the Transition and Accumulation pages update from it.',
    changes: ['Stress tester → Settings → Save on a locked plan: holdings saved, other settings left as they were.'], corrections: [],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] }, actions: [], notes: []
  },
  {
    version: '6.12.5', date: '2026-09-16', engineVersion: '6.4.0',
    title: 'Already retired: Household and Transition say so',
    summary: 'Three things for someone already retired whose ladder starts next April. Household called them "still working" until year 0 — it now reads the Timing block\'s "already retired" and counts their run-up need from today (a partner who really is still working keeps "still working"). Transition now opens with "You are already retired: the months until 2027/28 are the run-up, paid from your SIPP cash" so "months to go" is not read as a retirement date, and says where the holdings it shows come from (My funds) and how to remove one that is not yours. Pasting a statement: a stray code in the ticker column ("CGT", "P&L") can no longer tag a line as a fund whose name it does not share.',
    changes: ['Transition: run-up note and the source of the holdings list.'],
    corrections: ['Household "still working" for retired plans in the run-up.', 'Paste matcher: ticker-column codes must agree with the fund name.'],
    effects: { decision: [], stress: [], strategies: [], household: ['Retired plans\' run-up years now show their need and State Pension instead of "still working".'], budget: [], accumulation: [] },
    actions: ['If your My funds list shows funds you do not hold, remove them under Stress tester → Settings → My funds.'], notes: []
  },
  {
    version: '6.12.4', date: '2026-09-12', engineVersion: '6.4.0',
    title: 'Tablet header: the version chip is a chip again',
    summary: 'On an iPad the "what\'s new" version chip had grown to the 44px height of the touch buttons beside it. It is a small chip again.',
    changes: [], corrections: ['Version chip height on 701–1100px screens.'],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] }, actions: [], notes: []
  },
  {
    version: '6.12.3', date: '2026-09-12', engineVersion: '6.4.0',
    title: 'Tablet header: title, plan button and Beta chip packed left',
    summary: 'Follow-up to 6.12.2: on tablets the title now has room before "Plan:", the plan button stops stretching across the row, and the Beta chip sits beside it rather than at the far edge. The account controls keep their own row underneath.',
    changes: ['Header layout for 701–1100px wide screens.'], corrections: [],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] }, actions: [], notes: []
  },
  {
    version: '6.12.2', date: '2026-09-12', engineVersion: '6.4.0',
    title: 'The header on an iPad, and the plan name back in its button',
    summary: 'The stage chip inside the plan button had squeezed the plan\'s NAME to nothing at every screen size, so the button read "🔒 locked · Running the plan" with no plan name. On an iPad mini in either orientation the title also wrapped onto two lines and the account controls spilled into three ragged rows. The name now keeps its space (the chip shortens instead), the title stays on one line, and on tablets the account controls sit in their own row under the title and plan button.',
    changes: ['Header layout for 701–1100px wide screens.'], corrections: ['Plan name hidden by the stage chip.'],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] }, actions: [], notes: []
  },
  {
    version: '6.12.1', date: '2026-09-12', engineVersion: '6.4.0',
    title: 'The protection-off comparison says what it compares',
    summary: 'The new cut tile\'s bracket read "(52 in 100 without protection)" beside "85 in 100" — as if protection made things worse. Without protection nothing trims the draw, so the only way to fall short is to run out; the bracket now reads "(without protection: 52 in 100 ran out, 48% lasted)" against the plan\'s own chance of lasting.',
    changes: ['Monte Carlo and Historical cards: clearer protection-off bracket.'], corrections: [],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] }, actions: [], notes: []
  },
  {
    version: '6.12.0', date: '2026-09-12', engineVersion: '6.4.0',
    title: '"Had to cut back" now means income actually cut — and what protection is worth',
    summary: 'The Stress Tester\'s "futures where the plan had to cut back spending" counted every future in which protection engaged at all. Protection engages whenever the pots dip below their glidepath, which with the usual floors is almost every future — so the tile read "100 in 100" for plans that paid every pound. A cut is now a tax year in which more than 1% of the planned income went unpaid and was never caught up by the tax boost, or the money ran out. Beside it, the same futures are run with protection switched off, so you can see how many would have run short without it.',
    changes: ['Monte Carlo and Historical cards: "N in 100 futures where income was actually cut (M in 100 without protection)"; how often protection engaged is in the help text.'],
    corrections: ['"100 in 100 had to cut back" on plans whose floors equal their allocation.'],
    effects: { decision: [], stress: ['The tile changes on every plan; the simulation itself is unchanged. Each run now also runs once with protection off, so it takes about twice as long.'], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.6', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Mid-year State Pension taxed in the monthly recommendation; the CPI you type moves a schedule suggestion',
    summary: 'The monthly recommendation taxed only a share of the year\'s State Pension when it starts part-way through the year (£121 a month instead of £179 for a November start): the whole partial-year amount lands in the months to come, and is now taxed as such. Plans already receiving it, and plans without a start date, are unchanged. In the tax-year setup, when the suggested income came from your plan\'s schedule and last year\'s CPI had never been entered, the CPI you typed changed nothing (the assumed 4% stayed in the uplift) — it now replaces the assumption for last year.',
    changes: [],
    corrections: ['Monthly recommendation tax in the year a State Pension starts.', 'Tax-year setup: the typed CPI applies to a schedule-based suggestion when last year\'s CPI was assumed.'],
    effects: { decision: ['Only the tax year in which your State Pension starts, and only its tax line. Records already saved keep their figures.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.5', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'What is left at the end counts the ISA; a State Pension starting mid-year is taxed',
    summary: 'Two corrections from today\'s scenario walk. The Stress Tester\'s "typically left at the end" counted the pension pot only, so a plan whose house-sale money had been moved into the ISA over the years read "£0 typically left" with £400,000 in the ISA — it now counts every pot (pension, ISA, taxable account) and says how much is the pension pot. In the tax-year setup, a State Pension starting later in the year was left out of the year\'s tax (£41 a month instead of £179); the confirmation now taxes the whole year\'s State Pension and the "Other income" step says "Starts 9 November 2026: £997/month (£4,834 this tax year)". The wizard\'s suggested income now says it comes from your plan\'s schedule, not "the Budget tool", when it came from the Stress Tester\'s steps.',
    changes: ['Monte Carlo card: "left at the end" is all pots; the pension-pot figure is shown beside it.'],
    corrections: ['Year\'s tax in the tax-year setup when the State Pension starts after the start month.', '"From your budget\'s plan" wording when the schedule came from the income steps.'],
    effects: { decision: ['Only the expected monthly tax shown at setup changes; the monthly recommendation already taxed the year correctly.'], stress: ['Headline "left at the end" rises for plans holding an ISA; nothing in the simulation changed.'], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.4', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Run-up wording finished; lump sums and the pot strategies; rent counts in the run-up',
    summary: 'Three follow-ups from today\'s scenario walk. The Decision tool\'s run-up note still said "the cash you set aside to reach it" — it now says SIPP cash. A plan on Pots & Valves or Buckets with an inheritance on the way showed the inheritance\'s money as "Other / DB" income in the plan document; the pot takes the lump, so the pot pays and the row now says so. And in the run-up year the tax-year setup\'s "the cash to April covers about N payments" ignored income streams such as rent; it now nets them off like the DB pension.',
    changes: [],
    corrections: ['Decision overlay run-up note wording.', 'Plan document year-by-year for Pots & Valves and Buckets plans with a lump sum after year 0.', 'Run-up cover months with income streams.'],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.3', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Ladders with a lump sum on the way: no £0 orders, and the lump named',
    summary: 'When a house sale or an inheritance is expected later, the ladder builders let it pay the years from its arrival (since 6.4). The order sheet still listed a gilt for each of those years — paying £0, with a £20 fee — and the plan document called the money it pays "other income". Now the sheet lists only gilts that pay something and says which tax years the lump covers and when to buy their rungs; the Transition tool no longer asks you to hold those gilts; and the plan document\'s year-by-year table has a "from a lump sum" column.',
    changes: ['Order sheet: "Nothing to buy for 2032/33 – 2051/52: a lump sum expected later pays them — Sale of the flat (£600,000, plan year 5)".', 'Plan document: lump-sum years show the amount under "From a lump sum", not "Other / DB".'],
    corrections: ['Zero-pay gilt rows on the order sheet and in the Transition target.'],
    effects: { decision: [], stress: [], strategies: ['Only plans with a lump sum after year 0 change; the sums are the same.'], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.2', date: '2026-09-11', engineVersion: '6.4.0',
    title: '"Tax saved" means tax-free money used, nothing else',
    summary: 'The History and monthly record compared the year\'s tax with the tax on your TARGET drawn entirely from the SIPP. Any month the SIPP draw fell short of the target for another reason — protection, the run-up before year 0, a month already paid — showed a "saving" that was not one (a September run-up month reported £1,462 a year saved with nothing tax-free in it). The comparison is now the money actually delivered this tax year, had all of it been taxable SIPP income: an ISA draw, a GIA slice or an UFPLS tax-free slice can save tax; nothing else can.',
    changes: [],
    corrections: ['"Tax saved" reported for months with no tax-free money in them.'],
    effects: { decision: ['The tax-saved line on new records is nil unless an ISA, GIA or tax-free slice was used; the recommendation and the tax due are unchanged. Old records keep the figure they stored.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.1', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'The months before year 0 are the run-up, paid from your SIPP cash',
    summary: 'The app called the months before a plan\'s first tax year "bridge months" and their money "bridge cash", as if it were something separate. It is not: for a retiree who has already stopped work it is the same SIPP cash (a money-market fund such as CSH2) the cash years will use, and nothing bridges anything. They are now the "run-up" and the source reads "SIPP cash". The sums are unchanged.',
    changes: ['Stage chip, Decision alert, plan document, History source column and the tax-year setup now say "run-up" and "SIPP cash to the first April" instead of "bridge".'],
    corrections: [],
    effects: { decision: [], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.11.0', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'State Pension: the monthly payment from the month it starts',
    summary: 'In the tax year your State Pension begins, the Decision tool and the tax-year setup used to spread the year\'s partial total over twelve months — £402 a month for a pension that actually pays £997 from November. Now the months before the start show nothing from it and the SIPP covers the gap; from the start month the full monthly payment arrives and the SIPP draw drops. The year\'s tax still uses the true partial total.',
    changes: ['Monthly recommendation: State Pension shown as the amount actually received that month.', 'Tax-year setup: the confirmation says "£997/month from 9 November 2026 — the months before it are drawn from the SIPP".'],
    corrections: ['First-year State Pension was averaged over twelve months.'],
    effects: { decision: ['Only the tax year in which your State Pension starts changes, and only the split between SIPP and State Pension month by month. Later years are unchanged.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.10.5', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Pasting gilts, and reconciling a ladder that is already running',
    summary: 'From the retrospective-adopter walk-through: pasting a gilt ladder into My funds could make the settings save fail outright, a pasted gilt whose code had to be guessed did not match its rung, and the Transition tab told a running plan it had "1 month to go".',
    changes: ['Transition on a plan already running: the schedule is spread over the next six months (a reconcile), and a future retiree\'s deadline is the retirement month.', 'Paste holdings on a draft plan that has been stress-tested but not locked: rungs are matched against the last run\'s order sheet.'],
    corrections: ['Applying a paste could leave empty fields on a holding that the database refuses, and the whole Settings save failed with "Failed to save stress data". Fixed.', 'A pasted gilt known only by name (or a guessed code such as T31) now matches its rung by maturity year, so it reads as held rather than as a sale plus a purchase.'],
    effects: { stress: ['If a save failed after a paste, paste again — it saves now.'], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.10.4', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Locking commits the whole plan to the Decision tool',
    summary: 'Found by walking seven made-up people through the stages. The big one: locking from the Stress tester froze the settings but never copied the plan\'s pots, floors, ISA and State Pension into the Decision tool, which kept the defaults it was created with — a £380k plan was judged "24% below target" against £500k floors. Locking now seeds the Decision settings from the Stress plan first. Three smaller ones with it.',
    changes: ['Transition tab stays available while the plan is Running (a plan locked and started the same day still has its ladder to buy; a running ladder needs reconciling now and then).'],
    corrections: [
      'Lock from Stress settings: the Decision tool now runs the plan as locked — pots, floors, ISA policy, State Pension, strategy, taxable account — not its defaults. Plans locked before this fix: unlock, then lock again from the Stress settings page.',
      'A locked, running plan no longer shows the "start the budget walk-through" banner.',
      'The where-you-are strip no longer calls a pot-strategy plan "bought by contract" in its first year (every cone is flat at year 0; the test now looks at the whole run).',
      'A "Tax Saved -£0.00" row no longer appears from floating-point dust.'
    ],
    effects: { decision: ['Plans locked from the Stress tester after this release run on the plan\'s own pot floors. Earlier locked pot-strategy plans: unlock and re-lock once.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: ['If you locked a Pots & Valves, Buckets, Floor-to-age, Bridge & engine or Ladder & ratchet plan before today and the Decision tool shows pot minimums you never set: unlock (Decision → Settings), then lock again from Stress → Settings.'],
    notes: [],
    affects(scenario) {
      const ds = scenario?.decisionTool?.settings || {};
      const ss = scenario?.stressTool?.settings || {};
      if (!ds.locked || !Object.keys(ss).length) return [];
      const diff = ['equityMin', 'bondMin', 'cashTarget'].some((k) => +ds[k] > 0 && +ss[k] > 0 && Math.abs(+ds[k] - +ss[k]) > 1);
      return diff ? ['This locked plan\'s Decision pot floors differ from its Stress plan — unlock and re-lock from Stress → Settings to bring them in line.'] : [];
    }
  },
  {
    version: '6.10.3', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Retiring later: the month you retire, not just the tax year',
    summary: 'The plan\'s years are tax years, because the gilt ladder buys whole ones, but a person retires on a birthday. Someone 59 in September with an October birthday, retiring at 61, has plan year 0 in 2027/28 — and retires in October 2027, thirteen months away, not "in seven months". The Timing summary, the stage chip, the "committed, still saving" countdown and the Decision tool\'s gate now all use the retirement month; the ladder and the plan document keep the tax year.',
    changes: ['Timing summary for retire-later plans: "You retire in October 2027 at 61, 13 months away; the plan\'s year 0 is tax year 2027/28".', 'A plan locked while still saving stays "committed, still saving" until the retirement month, and the Decision tool opens that month, even if plan year 0\'s April has passed.'],
    corrections: ['The countdown and the Decision gate used 6 April of plan year 0, which for many people is months before they actually stop work.'],
    effects: { stress: ['Retire-later plans: the summary line changes; nothing in the numbers.'], decision: ['Committed-while-saving plans: entries open in the retirement month rather than the preceding April.'], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.10.2', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Retiring later: the plan is priced on the pots you typed, not the defaults',
    summary: 'Found while walking new plans through the stages. On a plan created moments earlier, the Timing block projected the pots at retirement from the saved settings — which for a new plan are the £1m defaults — rather than from the pot typed into the form. A £180k saver was stress-tested as a £1.5m one. The block now reads the form as it stands, and the settings save re-derives the timing from the whole form (pots, ages, State Pension date) at the moment of saving.',
    changes: ['The Timing block re-renders when the State Pension date is typed, since that date sets the birthday the plan-start year is counted from.'],
    corrections: ['Retire-later plans saved before this fix may carry a wrong "pot at retirement". Open Stress → Settings and press Save once; the figure is recomputed from the form.', 'The plan-start year could come out a year late when the State Pension date was entered after the Timing block had rendered. Saving now recomputes it.'],
    effects: { stress: ['Retire-later plans only; already-retired plans are unaffected. After a re-save the cones and ladders price on the right pots.'], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: ['If you have a plan with "I will retire at age X": open its Stress settings and press Save Settings once.'],
    notes: []
  },
  {
    version: '6.10.1', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Stage always shown; ladder CSV without pot targets; printable PDFs',
    summary: 'Three fixes reported by a user: a plan whose next-step banner had been dismissed never got its life stage worked out (so the Accumulation tab stayed visible for a retiree and the chip said only "locked"); the Tax Years CSV carried Pots & Valves targets and a rebalance column for gilt-ladder plans; and the Decision PDFs printed the app\'s dark colours and its buttons, which came out illegible on an iPad.',
    changes: ['The plan chip names the stage: "🔒 locked · Bridge to the plan start · 7 months to go". Click it for why, and what the stage does to the tabs.'],
    corrections: [
      'The life stage is now worked out on every load, whether or not the next-step banner is dismissed. Retirees no longer see the Accumulation tab (its figures were derived from the Budget and My funds, never entered).',
      'Tax Years → Export CSV on a gilt-ladder plan: columns are date, paid from, SIPP draw, ISA draw, gilt ladder value, cash, total, tax and net. No targets, no rebalance.',
      'Download PDF (monthly record, tax year, plan document): black text on white, no buttons or delete controls, coloured only for good/bad verdicts.'
    ],
    effects: { decision: ['CSV and PDF exports of ladder plans change shape as above; pot-strategy plans are unchanged.'], accumulation: ['Hidden for retirees, as intended since 6.6.0.'], stress: [], strategies: [], household: [], budget: [] },
    actions: [], notes: []
  },
  {
    version: '6.10.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: '"When could I retire?" — the quick spin for savers',
    summary: 'A new card at the top of the Accumulation planner. Type the income you want (or leave it to your income shape), pick the confidence you want, and it spins every age from next year to 75: your pension pot projected to that age from what you hold and pay in, then your strategy run from that age. The answer reads "at £40,000 a year you could retire at 61 with 90% confidence, or at 58 with 75%". Re-run it every year as the numbers move.',
    changes: [
      'Accumulation planner → "When could I retire?": income, confidence target, Spin. A table per age with the pot it was priced on, the chance the money lasts, years covered and the worst 12 months; the earliest age clearing your target is highlighted.',
      'Runs in the background worker with progress; 200 futures per age and every sixth history — a compass, not the full stress test. For the age you pick, set it in the Timing block and run the Stress tester proper.'
    ],
    corrections: [],
    effects: { accumulation: ['New card; nothing else on the tab changes.'], stress: [], strategies: [], decision: [], household: [], budget: [] },
    actions: ['Savers: make sure the Timing block has your age today and My funds has what you hold (paste it), then spin.'],
    notes: ['The income shape\'s steps are moved to start at each candidate age, so "£40k to 75 then £32k" keeps its shape whichever year you stop. A typed income is flat for life.']
  },
  {
    version: '6.9.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Paste your holdings from any platform',
    summary: 'Copy the holdings table from your platform\'s page or export — AJ Bell, HL, ii, Vanguard, a workplace scheme, anything — and paste it into My funds. The tool reads names, units, values and SEDOLs in whatever layout it finds, matches each line to the fund catalogue or to your plan\'s gilt order sheet, shows a preview you check, then merges into your holdings: lines you already have are updated, new ones added, lines missing from the paste are listed for you to remove if sold.',
    changes: [
      'My funds (Stress tester Settings): a "Paste holdings from your platform" button with a preview (pasted line, read as, units, value, match) and one Apply.',
      'Gilts are matched to the plan\'s order sheet by SEDOL, by code (TR30), or by maturity year and "index-linked"; funds by ticker then name; money-market funds as cash. Unrecognised lines are kept for you to categorise.',
      'Transition tab: "Paste my holdings" when the ledger is empty.',
      'Merges never touch other wrappers, and keep the cost and £/month you had entered on a line.'
    ],
    corrections: [],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: ['A pasted SIPP fills "pot today" and the proportions on the Accumulation planner.'] },
    actions: ['Open Stress tester → Settings → My funds → Paste holdings; pick the wrapper the paste belongs to; check the preview; Apply; Save Settings.'],
    notes: ['Everything is parsed in your browser; nothing pasted is sent anywhere. Per-platform CSV importers were considered and rejected: workplace pensions have no export, and DIY-platform formats drift — one layout-agnostic parser serves them all.'],
  },
  {
    version: '6.8.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Transition tool: from what you hold to the plan',
    summary: 'A new Transition tab, shown from "approaching retirement" until the plan starts. It takes the plan document\'s target — every rung of a gilt ladder in units plus the cash years, or the year-0 mix in pounds for a pot strategy — and diffs it against what you hold under My funds: buy, sell, already held, left alone. Then it lays the moves out on a dated schedule to the plan start (cash years first, near rungs before far ones, sales in tranches, new contributions before sales) and lets you tick each order off as you place it.',
    changes: [
      'Transition tab (Approaching, Committed-while-saving, Bridge, and Retired-designing stages): target, buy/sell/hold tables with tick-offs, a dated schedule, progress ("62% of the target is held; next: buy the 2031 rung"), and the assumptions the schedule makes (wrappers, tax on sales, gilt units, decision points).',
      'Gilts in My funds: enter the gilt code (e.g. TR30, TG36) with units and value; the tool matches rungs by code or SEDOL. A rung within 2% of its target counts as held.',
      'Retrospective adopters: a ladder that is already mostly held reads as a reconcile — top-ups and surpluses only.'
    ],
    corrections: [],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: ['The Transition tab reads the same ledger as the Accumulation planner; contributions entered there fund the schedule before sales.'] },
    actions: ['Lock the plan, then open Transition and enter what you hold under My funds (ticker or gilt code, value, units for gilts, wrapper). Tick each order off as you place it.'],
    notes: ['Nothing here places an order, and the pound figures are indicative — gilt prices and index ratios move daily. CSV import of platform holdings (AJ Bell first) is next.'],
    affects(scenario) {
      const locked = !!scenario?.decisionTool?.settings?.locked;
      const tf = scenario?.stressTool?.settings?.taggedFunds || [];
      if (locked && scenario?.planDocument && !tf.length) return ['This plan is locked with a plan document but has no holdings entered — the Transition tab will read everything as "to buy" until you enter what you hold.'];
      return [];
    }
  },
  {
    version: '6.7.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Holdings ledger: tickers in, proportions modelled — and a monthly pot record while you save',
    summary: 'Your holdings are entered once, under "My funds" in the Stress tester\'s Settings, and every tool reads the same list. Each line now carries its cost and the money going into it each month. The Accumulation planner shows what those holdings roll up to — so much in shares, bonds, diversifiers and cash — and projects a fourth line at your own mix, net of costs, beside the FCA bands. Multi-asset funds (LifeStrategy, HSBC Global Strategy) split into their parts. A plan locked while you are still saving now keeps the projected path in its plan document, and a one-line-a-month pot record reads against it.',
    changes: [
      'My funds: two new columns — cost (% a year) and £ a month going in. Optional; used for the "your mix" line and to say where new money lands.',
      'Fund catalogue: Vanguard LifeStrategy 20/40/60/80/100 and HSBC Global Strategy Cautious/Balanced/Dynamic split across shares and bonds by their mix.',
      'Accumulation planner: "What you hold" (proportions, cost, expected real return at long-run assumptions, contribution destinations); pot today filled from the ledger; the projection gains a "your mix" column.',
      'Accumulation planner: "Record this month\'s pot" — pension pot, ISA, taxable — with a "where you are" strip against the locked path once the plan is locked.',
      'Plan document: section 4b, "Getting there", the locked accumulation path; the where-am-I strip for savers reads the latest record against it; the arrival check uses it when the plan starts.'
    ],
    corrections: ['A LifeStrategy or Global Strategy fund used to count as one asset class. It now counts as its actual split, so the shares/bonds proportions and the engine\'s bond sub-weights are right for holders of multi-asset funds.'],
    effects: {
      stress: ['Plans holding a multi-asset fund under My funds: the bucket roll-up changes to the fund\'s real split (e.g. LifeStrategy 80 → 80% shares, 20% bonds), which can move the cones slightly. Single-class funds are unchanged.'],
      accumulation: ['A new "your mix" projection line when holdings are tagged; otherwise unchanged.'],
      decision: [], strategies: [], household: [], budget: []
    },
    actions: ['If you hold a multi-asset fund, check its ticker is in the catalogue (VLS80 etc.) so it splits; add cost and £/month to the lines you contribute to.'],
    notes: ['The planner models proportions of asset classes, never a fund\'s own return — a world tracker is a world tracker. Tickers matter again at the transition, where the next release turns today\'s holdings into the plan\'s target portfolio.'],
    affects(scenario) {
      const tf = scenario?.stressTool?.settings?.taggedFunds || [];
      const multi = tf.filter((f) => /^(VLS(20|40|60|80|100)|HSBCGS[BCD])$/i.test(String(f.ticker || '')));
      return multi.length ? ['This plan holds ' + multi.map((f) => f.ticker).join(', ') + ' — now split into shares and bonds; the roll-up and cones may move a little.'] : [];
    }
  },
  {
    version: '6.6.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'The app knows where you are: saving, approaching, committed, bridge, running',
    summary: 'Every plan now has a life stage, worked out from your age today, the plan start and the lock — never asked. The stage decides which tools lead, which are frozen with the lock, and which do not apply (a retiree has nothing to accumulate). The next-step banner speaks for the stage, the plan chip shows it, and the plan document keeps the dated journey through the stages. A plan locked while you are still saving now waits for its start date before the Decision tool takes months, and checks the pot you arrive with against the pot it was priced on.',
    changes: [
      'Stages: Saving (more than five years out), Approaching (within five years), Committed while still saving, Bridge (retired, before the plan start), Running, and Retired-designing. The leading tools are underlined; tools frozen with the lock are dimmed; the Accumulation planner is hidden for retirees.',
      'Setup wizard: a new starting point, "I\'m already drawing my pension — pick up from here", for someone retired for a while: the plan starts this tax year with what you hold, then Stress → lock → Decision, with no back-filling.',
      'Decision tool: a plan locked while still saving takes no monthly entries before its start (record your pot on the Accumulation planner until then). The first month after the start runs an arrival check: if the real pot is more than 10% from the pot the plan was priced on, you choose between running the locked plan on what you have and unlocking to re-plan.',
      'Plan document: section 5, "Journey", lists each stage change with its date.',
      'Stress tester, retiring later: the Timing summary says that funds entered under "My funds" are today\'s holdings and set the starting mix only — the plan is priced on the pots at retirement.'
    ],
    corrections: [],
    effects: {
      stress: ['Nothing in the numbers. Locked plans already had a read-only Settings page; it is now also dimmed in the tab bar.'],
      accumulation: ['Hidden on plans whose Timing block says "already retired". Change the Timing block to bring it back.'],
      decision: ['Committed-while-saving plans: entries before the start are refused with the start date. Everyone else: unchanged.'],
      strategies: [], household: [], budget: []
    },
    actions: ['Check the plan chip next to the plan name: it now says which stage the app thinks you are in. If it is wrong, the Timing block in Stress → Settings is where the app reads it from.'],
    notes: ['Next: a holdings ledger shared by the Accumulation planner, the Stress tester and a transition tool that turns today\'s holdings into the plan\'s target portfolio by the start date.'],
    affects(scenario) {
      const ss = scenario?.stressTool?.settings || {};
      const locked = !!scenario?.decisionTool?.settings?.locked;
      if (!Object.keys(ss).length) return [];
      if (!(+ss.currentAge > 0)) return ['No age today on this plan, so its stage reads "Getting started" until you enter one in the Timing block.'];
      if (ss.retired === true) return ['Retired: the Accumulation planner is hidden on this plan' + (locked ? '; the stage is Bridge or Running depending on the plan start.' : '.')];
      if (ss.retired === false && locked) return ['Locked while still saving: the Decision tool waits for the plan start; record your pot on the Accumulation planner until then.'];
      return [];
    }
  },
  {
    version: '6.5.4', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Already taken this month\'s payment? Plan from next month',
    summary: 'The tool has always assumed you enter a month BEFORE its payment goes out: the recommendation is that payment, and "payments to come" counts it (April shows 12). If this month\'s payment has already been made, a new tick box on Monthly Entry moves the entry to next month: give the balances after the payment, and the tax-year setup asks for income and tax to date including this month. Labels now say "payments to come (incl. this month)" instead of "remaining months".',
    changes: [
      'Monthly Entry: "This month\'s payment has already been made — plan from next month" tick box (with a help tip on the month frame). March cannot roll into April — start with April\'s setup instead.',
      'Tax-year setup, History and Tax Years: "Remaining months" is now "Payments to come this tax year (including this month\'s)".',
      'Bridge year: the suggested target is the plan\'s first income step (the rate the bridge cash was sized for), with a note on how many of the payments to come the bridge cash covers.'
    ],
    corrections: ['The bridge-year suggestion spread the whole bridge cash over the months left, overstating the rate for anyone already part-way through the year.'],
    effects: { decision: ['No change to saved entries or recommendations. The tick box only sets which month you are entering.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: ['If you recorded this month after its payment had already gone out: delete that entry (and its tax-year setup if it was the first), tick the box, and re-enter from next month with post-payment balances.'],
    notes: []
  },
  {
    version: '6.5.3', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'History view: ladder plans no longer fall back to pot floors',
    summary: 'On a gilt-ladder plan, opening History before the Monthly Entry screen had drawn could still show glidepath targets and a "surplus" on a saved month. The record view now looks the plan\'s strategy up itself.',
    changes: [],
    corrections: ['History → a month\'s record: the strategy is resolved from the plan when the page opens, not from whatever the Monthly Entry screen last rendered, so contract strategies always get the ladder view (no pot floors, no rebalancing, source = cash bucket / bridge cash).'],
    effects: { decision: ['Ladder plans only; display only.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.5.2', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Tax-year page speaks plainly',
    summary: 'The Tax Years detail used payroll words that did not fit a pension: "Target annual salary", "Income before pension start", "Tax-Inefficient". They now say what they mean, and the tax already paid (entered in the mid-year setup) is shown.',
    changes: ['Tax Years → year detail: "Target income for the year (gross, all sources)", "Income received earlier this tax year", "Tax already paid on it (PAYE)" when entered, and the mode reads "Full target from the SIPP" or "Tax-efficient — SIPP to the basic-rate limit, ISA tops up".'],
    corrections: [],
    effects: { decision: ['Wording only; the figures and the recommendation are unchanged.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.5.1', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Tax-year page: no target mix for gilt-ladder plans',
    summary: 'The Tax Years page showed "This Year\'s Target Mix" — a Pots & Valves card — for plans on a gilt ladder, where there is no mix to keep. It is now hidden for contract strategies, as it already was on the monthly record.',
    changes: [],
    corrections: ['Tax Years → a year\'s detail no longer shows the target-mix / rebalance card for gilt-ladder plans (Full index-linked gilt ladder, Gilt ladder + rotation, Floor the schedule).'],
    effects: { decision: ['Ladder plans only: one card fewer on the Tax Years page. Nothing else changes.'], stress: [], strategies: [], household: [], budget: [], accumulation: [] },
    actions: [], notes: []
  },
  {
    version: '6.5.0', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Lock your plan and keep the plan document',
    summary: 'When you are happy with the stress test, press "Lock plan & create the plan document" on the Stress tester\'s Settings page. Your settings freeze for both tools, and the app writes the plan document: your age against the tax years, the income steps as a picture and a table, who pays each year, the strategy verdict and cones, the pots and the shopping list, the assumptions, and how the Decision tool will run it. It is kept as the record of what you committed to, and the Decision tool shows where you are against it each month.',
    changes: [
      'Stress tester → Settings: a Lock button beside Save. Locking saves, runs your strategy, freezes the settings for both tools and writes the plan document. The same lock the Decision tool applies on its first entry — one lock, one chip.',
      'Decision tool → new "Plan document" tab: a "Where you are" strip (plan year and age, the step you are on and the next one, this year\'s income so far against the plan, your pot against the plan\'s cone, the ladder position for gilt plans), then the document itself, with Download PDF and previous versions.',
      'Monthly Entry shows the same "where you are" line under each recommendation.',
      'Plans locked before this release: the Stress settings banner and the Plan document tab offer "Create the plan document now".',
      'Unlocking a plan now unlocks the Stress settings too and moves the plan document to previous versions; a new one is written when you lock again.'
    ],
    corrections: [
      'The Stress tester\'s settings and the strategy could be changed on a locked plan, so a locked Decision plan could quietly diverge from the Stress plan it was built on. Both are now frozen together; "Try a strategy" what-ifs still run.',
      'The plan-lock explainer said the Stress tester is never locked. It now describes the lock you can set yourself.'
    ],
    effects: {
      stress: ['Locked plans: the Settings page is read-only until you unlock (the banner explains what changes). Draft plans are unaffected.'],
      strategies: ['Switching strategy on a locked plan asks you to unlock or duplicate first.'],
      decision: ['Nothing changes in the recommendation. The new Plan document tab reads the document against your recorded months.'],
      household: [], budget: [], accumulation: []
    },
    actions: ['If your plan is already locked: open Decision tool → Plan document → "Create the plan document now", then download the PDF and keep it.', 'If you have not locked yet: finish the stress test, then press Lock on the Stress settings page.'],
    notes: ['The document is a snapshot: it does not change when markets, prices or the app move. Refresh it deliberately (the old version is kept) if you re-plan.'],
    affects(scenario) {
      const locked = !!scenario?.decisionTool?.settings?.locked;
      if (locked && !scenario?.planDocument) return ['This plan is locked but has no plan document yet — create it from the Plan document tab.'];
      return [];
    }
  },
  {
    version: '6.4.2', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Saved monthly records match the live screen for gilt-ladder plans',
    summary: 'The saved record and its PDF for a plan on a gilt ladder (or any contract strategy) no longer show Pots & Valves pot floors, a "surplus" or rebalancing moves, and the source reads "the cash bucket" or "bridge cash" rather than "sell bonds". Months before the plan starts are labelled bridge months.',
    changes: [
      'Saved records carry how the month was paid (contract strategy source and note) and whether it was a bridge month; the History view and PDF use them. Older records fall back to the plan\'s current strategy.',
      'Live recommendation in a bridge month on a ladder plan: the source is the bridge cash — nothing is sold, no rung is due yet.'
    ],
    corrections: [
      'The "tax saved" comparison for a plan with a State Pension or other income counted that income twice, inventing a saving of a few hundred pounds a month. Full-target-from-SIPP months now show no saving, as they should.',
      'History cards and PDFs said "Year 0" for a month before the plan started; they now say "Bridge year (plan starts 2027/28)".'
    ],
    effects: {
      decision: ['Ladder plans: re-download any monthly PDF — the pot-floor and rebalancing sections are gone and the source is correct. The recommendation figures are unchanged. "Tax saved" falls for plans with a State Pension or other income (it was overstated).'],
      stress: [], strategies: [], household: [], budget: [], accumulation: []
    },
    actions: [],
    notes: []
  },
  {
    version: '6.4.1', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Mid-year tax-year setup: tell it the tax you have already paid',
    summary: 'The tax-year wizard\'s mid-year step now takes the PAYE already deducted this year (from your payslips) alongside the income received. The tax still to come is then the year\'s total less what is paid — right for someone who has been drawing a pension since April. Left blank, the old assumption stands.',
    changes: [
      'Mid-year step: a second box, "tax already deducted on that income". It is saved with the tax year and the monthly recommendation\'s tax figure uses it too.',
      'The confirmation screen names the two modes plainly: "Full target from the SIPP" rather than "Tax-Inefficient".'
    ],
    corrections: [
      'For a retiree already drawing under PAYE, the mid-year setup assumed the income to date had been taxed on its own bands and so pushed the whole higher-rate band into the months left — overstating the tax to come by several hundred pounds a month and understating the expected take-home. The gross draw was never affected.',
      'In a partial first year, other income and the State Pension were counted in full on top of the income to date (which already held their earlier months) — a small double count of tax, now pro-rated to the months left.'
    ],
    effects: {
      decision: ['Tax years already set up are unchanged until you re-run the setup: Tax Years → the year → "Reconfigure via Wizard" lets you enter the tax paid.'],
      stress: [], strategies: [], household: [], budget: [], accumulation: []
    },
    actions: ['If you are setting up a mid-year first year and have been drawing since April: enter the PAYE to date from your payslip\'s "to-date totals" so the expected tax and take-home match what you actually receive.'],
    notes: []
  },
  {
    version: '6.4.0', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Your plan knows when it starts',
    summary: 'A new "When your plan starts" block at the top of the Stress tester settings: your age today, whether you have already retired or will retire at a given age, and the tax year your plan starts in. That start is saved with the plan and is year 0 for every tool — the gilt ladders, the cones, and the Decision tool — instead of being assumed to be "next April" every time the app was opened.',
    changes: [
      'Timing block in Stress tester → Settings: age today (shared with the Budget page), "already retired" or "retire at age X", and the plan start (this tax year or next 6 April for retirees; the year you reach the age for future retirees). The income steps start at the age you reach in that year.',
      'Retiring later: the pots you enter are today\'s. The plan is priced on the pots projected to retirement in today\'s money — from your Accumulation planner contributions at the middle band, or a figure you type in — and the gilt ladders say they are indicative, priced at today\'s real yields.',
      'Decision tool: tax years before the plan starts are bridge years. The tax-year wizard says so and suggests your bridge cash spread over the months left (or the plan\'s first step); the monthly view flags the bridge; "plan vs actual" leaves bridge months out of the comparison.',
      'Lump sums and one-off spends show the tax year their plan year means ("in year 1 · 2028/29"), so a year means the same thing everywhere.',
      'Duration shows the age it runs to, and moving the plan start keeps the end age constant.'
    ],
    corrections: [
      'The plan\'s first tax year was never saved and fell back to "the calendar year after today", so every plan silently moved a year later each 1 January — a gilt ladder built in 2026 for 2027/28 would have re-priced itself for 2028/29 on New Year\'s Day. It is now saved.',
      'The Decision tool counted plan years from a hard-coded 2026/27 in three places and from "the first tax year set up" in two others. It now counts from the plan\'s start everywhere, so a plan starting 2027/28 steps its income down in the right April and its pot tracks line up with the Stress tester.',
      'The State Pension\'s plan year is now the tax year its date falls in minus the plan start (exact), and its first-year share is measured against 6 April. The settings preview and the engine used to disagree about it for anyone not yet retired.'
    ],
    effects: {
      stress: ['Plans with an age today (from the Budget page or the setup wizard) get a saved start derived from it — for most that is the same next-April start as before, so nothing moves. Plans without an age today keep the old assumption until you enter one.', 'Anyone not yet retired: the State Pension lands in the right plan year in the preview and the run alike; the cones may move slightly where it did not before.'],
      strategies: ['Gilt ladders and rotation are priced for the saved start year — the same rungs as before for a plan starting next April, and no longer a year late after 1 January.'],
      decision: ['Plan year 0 is the plan\'s start. If your Decision tool history began in 2026/27 and your plan starts then too, nothing changes. If your plan starts later, months before it are now bridge months and the yearly targets, inflation chain and pot tracks are read from the right year.'],
      household: [], budget: ['Age today is shared with the Timing block — change it in either place.'], accumulation: ['Its projected pot now feeds the Stress tester when you say you will retire later.']
    },
    actions: ['Open Stress tester → Settings → "When your plan starts" and check three things: your age today, retired or not, and the start tax year. Save. Then check the income steps still start at the age you meant.', 'If you use the Decision tool and your plan starts after the current tax year, expect the tax-year wizard to call this year a bridge year.'],
    notes: ['Next: "when can I retire?" — sweep candidate retirement ages and show the confidence at each, with the earliest age that clears 90%.'],
    affects(scenario) {
      const s = scenario?.stressTool?.settings || {};
      const out = [];
      if (!Object.keys(s).length) { /* nothing set up yet */ }
      else if (!(+s.currentAge > 0)) out.push('This plan has no age today, so it keeps the old assumption (starts next April with the steps from age ' + (s.shapeAgeNow || 57) + '). Enter your age in the Timing block to pin it.');
      else {
        const t = deriveTiming(s);
        out.push('Plan start: tax year ' + t.firstTaxYear + '/' + String(t.firstTaxYear + 1).slice(2) + (t.mode === 'future' ? ' (retiring at ' + t.retireAge + ')' : ' (already retired)') + ' — the same next-April start as before unless you change it.');
        if (+s.shapeAgeNow > 0 && t.shapeAgeNow !== +s.shapeAgeNow) out.push('Your income steps were labelled from age ' + s.shapeAgeNow + '; the age you actually reach in that first plan year is ' + t.shapeAgeNow + ', so the steps now start there and each later step lands ' + Math.abs(t.shapeAgeNow - s.shapeAgeNow) + ' year' + (Math.abs(t.shapeAgeNow - s.shapeAgeNow) === 1 ? '' : 's') + (t.shapeAgeNow > s.shapeAgeNow ? ' earlier' : ' later') + ' in plan time. Check the step ages in Settings.');
      }
      const ty = scenario?.decisionTool?.taxYears || {};
      if (Object.keys(ty).length) out.push('Decision tool: plan year 0 is now the plan\'s start; tax years before it are bridge years.');
      return out;
    }
  },
  {
    version: '6.3.0', date: '2026-09-09', engineVersion: '6.2.1',
    title: 'Guest mode is a trial — and your guest work comes with you when you sign in',
    summary: 'Guest mode ("Just try it") now measures active use in this browser: gentle reminders along the way, and after three hours of use it stops until you sign in. Whichever way you sign in — from a reminder, the banner, or the stop — the plan, budget and settings you built as a guest are copied into your account. Nothing is lost.',
    changes: [
      'The guest banner shows how much of the three free hours you have used and offers two buttons: create an account and keep this work, or sign in to an existing one and keep it.',
      'Reminders at 15, 45, 90 and 150 minutes of active use (a tab left open does not count). The last two are a dialog you can dismiss.',
      'At three hours guest mode stops. Signing in (or creating an account) copies your guest plans into the account as "… (from guest)" — you are asked first.',
      '"Create a free account to keep it" used to wipe the guest plan on the way to sign-up. It now keeps it.'
    ],
    corrections: [],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: ['If you have been using guest mode: sign in once and take your work with you. It is the only way it is kept, and the only way we can support you.'],
    notes: ['The meter and the hand-off live in your browser only (see the privacy policy). Only signed-in users can be supported; guest mode remains a try-before-you-sign-in.']
  },
  {
    version: '6.2.7', date: '2026-09-08', engineVersion: '6.2.1',
    title: 'Cash years in the gilt ladders are priced honestly',
    summary: 'The "years funded from cash first" dial on the Full index-linked gilt ladder and Bridge & engine treated cash as holding its value. It now costs inflation minus 1% a year — the same assumption every other strategy already uses for cash — so a long cash run shows its true cost instead of looking free. The dial is capped at 5 and explains itself.',
    changes: ['The dial says what it is for (the first year or two, where no gilt matures in the right window) and is capped at 5.'],
    corrections: ['Cash set aside for year k now costs 1.01^(k−1) per £1 of need. Two cash years move the ladder\'s cost by well under 1%; fifteen would have been about 7% too cheap, with no index-linking.'],
    effects: {
      stress: ['Plans on the Full index-linked gilt ladder or Bridge & engine: the ladder cost and spare move slightly (a few hundred pounds on a typical two-year float); a plan set to more than 5 cash years is clamped to 5 next time you open its dials.'],
      strategies: ['The ranked table\'s "what you pay today" for those two strategies moves the same way.'],
      decision: [], household: [], budget: [], accumulation: []
    },
    actions: ['If you had set more than 3 cash years, look at the dial: it was never meant to be a cash-bucket strategy — Bridge & engine or Buckets in order model a large cash sleeve properly.'],
    notes: ['Engine version 6.2.1: a strategy\'s arithmetic changed.']
  },
  {
    version: '6.2.6', date: '2026-09-08', engineVersion: '6.2.0',
    title: 'Turn a lump sum into income, if you want to',
    summary: 'A lump sum pays for your income shape; it does not raise it. The strategies already use it (more rungs, bigger pots), but the income line only rises if you raise a step — and nothing said so. Under the picture each lump sum now says what it could support per year from its age, with a button that adds that to your steps.',
    changes: [
      'Under the income shape: "▲ £600,000 Sell the rental at 65 pays for the shape above — it is not added to it. Spread evenly over the 25 years left it could support about £24,000/yr more" with an "Add £24,000/yr to my income from 65" button.',
      'The button adds a step at that age (or raises the one already there) and every later step by the same amount. The lump sum stays in the plan as the money that pays for it. Today\'s money, no growth assumed — slightly cautious, and what the ladder strategies assume too.',
      'The same line says where the money lands that year — the ISA slice, the SIPP room, and the taxable account held as gilts (CGT-free) or shares (dividends and gains taxed) — because that is how the strategies grow and tax it while it waits to be spent.'
    ],
    corrections: [],
    effects: { stress: ['Nothing changes unless you press the button; if you do, your income shape rises and every strategy prices the higher schedule against the pot plus the lump sum.'], strategies: [], decision: ['If you raise the shape, the Decision tool\'s target follows on the next Stress save (draft plans) or your next tax-year set-up (locked plans).'], household: [], budget: [], accumulation: [] },
    actions: [],
    notes: []
  },
  {
    version: '6.2.5', date: '2026-09-08', engineVersion: '6.2.0',
    title: 'Income streams, lump sums and one-off spends on the income shape',
    summary: 'The income-shape picture now draws your income streams (rent, part-time work) as layers for their years, and marks each lump sum and one-off spend at the age it happens. Editing them refreshes the picture at once.',
    changes: [
      'Income streams appear as grey layers inside the bars for the years they run, like the DB pension.',
      'Lump sums (▲) and one-off spends (▼) are marked at their age with the amount and label. A lump sum is not income — it lands in your pots or taxable account and the strategies spend it over the years — so it is a marker, not a layer.',
      'Changing anything under Income streams & lump sums redraws the picture immediately.'
    ],
    corrections: ['Streams were counted in the schedule\'s guaranteed-income floor but not drawn, so the picture and the arithmetic disagreed.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: [],
    notes: []
  },
  {
    version: '6.2.4', date: '2026-09-07', engineVersion: '6.2.0', announce: true,
    title: 'The income shape shows its slopes — and never dips below your State Pension',
    summary: 'The income-shape picture now draws the slope of every step and animates to the new shape when you move a slider; the schedule can never fall below the guaranteed income of the year (State Pension, DB pension, other income); and an audit confirmed every engine, strategy and projection reads the same sloped schedule.',
    changes: [
      'Your income shape: bars follow each step\'s slope, a line traces the path over them, and both ease into place when you change a slider or tick "glide".',
      'A step is your TOTAL income for the year — State Pension, other pensions and the pot together — and the editor now says so. If a slope would take the shape below the guaranteed income that year, it is held there and a note tells you from which age.'
    ],
    corrections: [
      'The picture used its own flat-step arithmetic, so it ignored the slopes the engines were running (6.2.1 to 6.2.3).',
      '"Use as my plan\'s target" from the Budget page rebuilt the schedule with the same flat arithmetic, dropping the slopes on a plan re-seeded from the Budget. It now uses the engines\' compiler.'
    ],
    effects: {
      stress: ['Plans re-seeded from the Budget in 6.2.1–6.2.3 with sloped steps: the schedule was flat then and is sloped now — the Stress Tester and every strategy follow it. Plans whose slope dipped below the State Pension are held at that floor.'],
      strategies: ['Same as the Stress Tester.'],
      decision: ['The tax-year wizard suggests from the (now correct) schedule copy; recorded months are untouched.'],
      household: [], budget: [], accumulation: []
    },
    actions: ['Open Stress Settings → Your income shape once and look at the picture: it is now what the engines run.'],
    notes: ['Audit of every schedule consumer: both engines, the nine strategies, the drawdown and glidepath projections, the tax-year wizard, the couples check, the layered charts and the Decision copy all read the compiled schedule.'],
    affects(scenario) {
      const ss = scenario?.stressTool?.settings || {};
      const sloped = Array.isArray(ss.incomeSteps) && ss.incomeSteps.some((x) => x && ((+x.decline > 0) || x.glideToNext));
      return sloped ? ['This plan\'s steps carry slopes: check the picture in Stress Settings and re-save if the schedule looks flat (it was, if you re-seeded from the Budget).'] : [];
    }
  },
  {
    version: '6.2.3', date: '2026-09-07', engineVersion: '6.2.0',
    title: 'Hotfix: lump-sum amount box',
    summary: 'The one-off lump sum amount box under Income streams and lump sums lost focus after every digit (since 6.1.0 the row re-drew itself to update its "where it goes" note). The note now updates in place.',
    changes: [],
    corrections: ['Typing a lump-sum amount no longer stops after one digit.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: [],
    notes: []
  },
  {
    version: '6.2.2', date: '2026-09-07', engineVersion: '6.2.0',
    title: 'Hotfix: missing sub-tabs',
    summary: 'In 6.2.1 the Stress Tester, Budget and Strategies tabs lost their content and sub-tab ribbons; only the Decision tool showed its ribbon. A stray closing tag from removing the old spending control. Fixed within the hour.',
    changes: [],
    corrections: ['Removing the Decision tool\'s "Spending over retirement" control took one closing tag too many, nesting every later tab inside the Decision settings grid. A structure test now guards the tab panels.'],
    effects: { stress: [], strategies: [], decision: [], household: [], budget: [], accumulation: [] },
    actions: ['Reload once if a tab still looks empty.'],
    notes: []
  },
  {
    version: '6.2.1', date: '2026-09-07', engineVersion: '6.2.0', announce: true,
    title: 'Income steps with a slope; fairer cuts for Buckets in order',
    summary: 'The "Spending over retirement" control is gone: each income step now carries its own slope, so you say how fast each phase drifts down (or glides into the next). And Buckets in order now decides on spending cuts by looking at the whole pot against the whole plan track, not at a signal it triggered by design.',
    changes: [
      'Your income shape: every step has a slider — how much it falls each year in today\'s money (0 to 5%) — and a "glide evenly to the next step" tick box that walks the income down smoothly instead of a cliff. The preview and every strategy follow it.',
      'The separate "Spending over retirement" (level / declining) control has been removed from Stress and Decision settings. Plans that had "Declining with age" were converted to steps that reproduce the same curve exactly.',
      'Buckets in order + spending cuts: cuts now start when the whole SIPP has sat below the whole glidepath track for the configured number of months, and end when it is back above the track plus the recovery buffer — the same test the Decision tool applies for a Buckets plan.'
    ],
    corrections: [
      'Buckets in order draws from cash first by design, so the old "three cash draws in a row" test was always true and cuts fired on any dip below the growth floors. A test plan showed cuts in 83 of 100 futures and 394 of 396 months in the Lost Decade scenario — most of that was the rule, not the market.'
    ],
    effects: {
      stress: [
        'Plans on Buckets in order with spending cuts on: fewer cut months, so the Monte Carlo, Historical and Scenarios results improve; the "as configured" ranked comparison moves too (level footing is unchanged).',
        'Plans that used "Declining with age": your steps now show the drift explicitly (a step at year 5 falling 1% a year, level again from year 25). Numbers are identical; you can now change the slope.'
      ],
      strategies: ['Ranked figures move only for Buckets plans with cuts on. Nothing else changed.'],
      decision: [
        'Buckets plans: the monthly protection decision uses the same whole-pot test (a "below track" flag is now saved on each record; the streak starts counting from your next entry).',
        'A Decision copy of a "Declining" plan keeps its schedule (the curve is baked into it) and the tax-year wizard suggests the same figures as before.'
      ],
      household: [], budget: [], accumulation: []
    },
    actions: [
      'If you had "Declining with age", open Stress Settings → Your income shape and check the slopes are what you meant; adjust the sliders or tick "glide" where a cliff was never intended.',
      'Buckets in order plans with cuts on: re-run the Stress Tester to see the corrected results.'
    ],
    notes: ['Engine version 6.2.0: a strategy\'s arithmetic changed (Buckets in order protection).'],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      if (ss.spendingMigratedFrom === 'declining' || ss.spendingProfile === 'declining') out.push('This plan used "Declining with age": its steps now carry that slope explicitly (same numbers).');
      if (ss.strategyId === 'buckets-in-order' && ss.disableProtection === false) out.push('This plan is Buckets in order with spending cuts on: its cut months will fall — re-run the Stress Tester.');
      return out;
    }
  },
  {
    version: '6.2.0', date: '2026-09-07', engineVersion: '6.1.0',
    title: 'Trustworthy comparisons',
    summary: 'A day of testing every Stress Tester tab and three years of the Decision tool found eight bugs and four traps. None crashed anything; several put the wrong number in front of you, and one quietly rewrote saved allocations. All fixed. The Decision tool itself was clean.',
    changes: [
      'Stress Settings keeps a saved allocation that is not a preset as "Custom — your saved split" (with the exact amounts) instead of snapping it to the nearest risk level. Pick a risk card only if you want to change it.',
      'Stress Settings shows the "age today" it uses (from the Budget page) under the State Pension inputs, and says when it is not set.',
      'Try a strategy, the survivor check and the care check run in the background worker, so the page no longer freezes for a minute.',
      'The Drawdown and Glidepath tabs start from the plan\'s own horizon.',
      'Saving now times out after 20 seconds, retries once, and tells you if it failed — instead of "Saving…" for ever.'
    ],
    corrections: [
      'Visiting the Drawdown or Glidepath tab changed the plan\'s horizon for everything that ran afterwards — the ranked comparison, Try a strategy, the couples check. A 30-year plan was compared over 35 years.',
      'For a plan saved on Buckets in order, the Pots & Valves row of the ranked table WAS Buckets in order (identical to the pound).',
      '"Worst 12 months" for the bought strategies (Floor the schedule, Ladder & Ratchet, Floor to an age) counted only the rungs bought — a year a lump sum or a DB pension paid showed as £0 or £28,000 on a plan whose income never dipped. It is now the income you actually receive.',
      'The risk summary read "chance of a cut after undefined" for Gilt ladder + rotation.',
      'The Historical tab on a contract strategy left a spinner running above the finished result.',
      'Switching plan left the previous plan\'s strategy card on the Monte Carlo tab.',
      'With no State Pension entered, the comparison used a £12,000 default from year 0 and said "State Pension only (from age N)" as if you had entered it. It now says it is an assumption, in the table and on every card.',
      'Zero amounts rendered as "£0.00"; the Decision tool\'s calculation reason read "Protection | Protection".'
    ],
    effects: {
      stress: [
        'The ranked comparison changes for plans with a lump sum, a DB pension, or an inherited pension (worst-12 figures rise to the real income), for plans saved on Buckets in order (the Pots & Valves row now differs), and for anyone who opened Glidepath or Drawdown before comparing (the horizon is now the plan\'s).',
        'Saved fund minimums that were not a preset are shown and kept exactly. If you saved Stress Settings since mid-August and had a custom split, check the Custom amounts — the earlier build snapped them.'
      ],
      strategies: ['Same as the Stress Tester: ranked figures move for the plans above. Nothing else about a strategy changed.'],
      decision: ['No numbers change. The calculation reason text is tidier.'],
      household: ['Survivor and care checks give the same answers, faster and without freezing the page.'],
      budget: [],
      accumulation: []
    },
    actions: [
      'Open Stress Settings once: if your allocation now reads "Custom — your saved split", the amounts shown are what was saved — keep them or pick a risk level.',
      'Re-run the Strategies overview if your plan has a lump sum, a DB pension, uses Buckets in order, or you had opened Glidepath before comparing.',
      'If your State Pension line says "assumed — none entered", enter your forecast date and weekly amount in Settings.'
    ],
    notes: [
      'Full findings, with the code locations and tests: research/qa-audit-7-sep-2026.md.',
      'Still open from that audit: Buckets in order with spending cuts on treats every month as a cash-draw month, so cuts hinge on growth alone (a modelling decision to make, not a defect); the CSV export was not exercised.',
      'Engine version unchanged (6.1.0): no strategy\'s arithmetic changed, only what is measured and shown.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const pot = (+ss.equityMin || 0) + (+ss.bondMin || 0) + (+ss.cashTarget || 0) + (+ss.diversifierStart || 0);
      const presets = [[0.3, 0.45, 0.25], [0.5, 0.4, 0.1], [0.7, 0.25, 0.05]];
      if (pot > 0 && ss.allocMode !== 'funds') {
        const f = [(+ss.equityMin || 0) / pot, (+ss.bondMin || 0) / pot, (+ss.cashTarget || 0) / pot];
        const isPreset = presets.some((pr) => pr.every((v, i) => Math.abs(v - f[i]) <= 0.011));
        if (!isPreset) out.push('This plan\'s allocation (' + Math.round(f[0] * 100) + '/' + Math.round(f[1] * 100) + '/' + Math.round(f[2] * 100) + ') is not a preset: it now shows as Custom and is kept exactly.');
      }
      if (ss.strategyId === 'buckets-in-order') out.push('This plan uses Buckets in order: the Pots & Valves row in its ranked table was a copy of Buckets — re-run the overview to see the real comparison.');
      const lumps = (Array.isArray(ss.windfalls) ? ss.windfalls.filter((w) => w && w.amount > 0).length : 0) + (+ss.dbAmount > 0 ? 1 : 0);
      if (lumps) out.push('This plan has a lump sum or DB pension: the bought strategies\' "worst 12 months" figure now counts that income.');
      if (pot > 0 && !ss.spStartDate && !(+ss.spWeeklyAmount > 0)) out.push('No State Pension is entered on this plan: the comparison now says the £12,000-from-67 figure is an assumption.');
      return out;
    }
  },
  {
    version: '6.1.0', date: '2026-09-07', engineVersion: '6.1.0',
    title: 'Taxable accounts and lump sums',
    summary: 'Money held outside a pension or ISA is now modelled properly: an investment account you already hold, and lump sums that arrive during retirement (an inheritance, a house sale, a maturing policy) — including the tax each actually suffers and the limits on where the money can legally go. It reaches both engines and every strategy.',
    changes: [
      'Stress Tester settings: a "Taxable investments today" section — the balance, what it holds (shares, gilts, bond funds, mixed or cash), your tax band, relevant earnings, and whether to move £20,000 a year into the ISA (bed-and-ISA).',
      'Income streams and lump sums: each lump sum now says what it is (cash, an inherited pension, an inherited ISA) and, for cash, what its taxable part will be held in. Cash is routed through this year\'s ISA allowance and pension room; the rest stays taxable.',
      'The taxable account is drawn before the ISA (least tax-efficient money first), net of capital gains tax. Gilts held there are CGT-free, so a gilt account is close to tax-free while a share account is not.',
      'Decision tool: the monthly entry takes the taxable account\'s balance and cost; the tool sells from it before the ISA, works out the CGT with the £3,000 exemption tracked per tax year, and carries the cost forward to next month. Lump sums and bed-and-ISA are advice alerts — it never moves money silently.',
      'Every strategy sees the taxable account: the ladder and floor strategies now count it (and lump sums) as money that buys rungs, not only the Pots & Valves engine.',
      'The "?" help pop-ups on the settings forms work on hover and on touch.',
      'The Assumptions & data page lists the taxable-account rules.'
    ],
    corrections: [
      'The pension contribution cap for anyone already drawing a pension is £10,000 (the MPAA), not £60,000 — a lump sum can shelter far less into a SIPP than the previous build allowed.',
      'The ISA allowance was being used up to three times in one year (a lump sum\'s slice, bed-and-ISA and band-fill recycling each assumed a fresh £20,000). One allowance per tax year now.',
      'Lump sums were treated as fixed pounds while the form said "today\'s money". They now rise with inflation to the year they arrive (choose "level" for a fixed sum).',
      'Survivor check: an inherited pension stays a pension and an inherited ISA passes into the survivor\'s ISA. A 6 September build briefly pushed both into a taxable account.',
      'The taxable account\'s tax was calculated and then dropped from the totals; it is now in lifetime tax.',
      'The ladder and floor strategies ignored lump sums entirely (one-off spends were modelled, one-off receipts were not) — a bias against every ladder in the ranked table.',
      'With the ISA policy set to Hold, the plan was still moving money INTO the ISA (bed-and-ISA and a lump sum\'s ISA slice), locking spendable money in a pot it had promised not to draw. It no longer does.'
    ],
    effects: {
      stress: [
        'Plans with no taxable account and no lump sums are unchanged to the penny.',
        'Plans with a lump sum will show different numbers: the ISA slice once a year, the sum rising with inflation, and the taxable remainder taxed. Expect slightly lower wealth and a more realistic result.',
        'Plans whose ISA policy is Hold: bed-and-ISA is now ignored (the checkbox greys out) and a cash lump sum\'s ISA slice stays taxable. An inherited ISA still joins the held ISA.'
      ],
      strategies: [
        'The ranked comparison now credits ladders and floors with lump sums and an existing taxable account, so the order of strategies can change for plans that have either.'
      ],
      decision: [
        'Plans with no taxable account are unchanged. The two new monthly-entry boxes default to £0.',
        'Locked plans: nothing recorded is re-judged. The new boxes simply appear on your next entry.',
        'The tax-year wizard has a new optional box for capital gains already realised this year.'
      ],
      household: [
        'The survivor check routes an inherited pension and ISA into the right wrappers again; results for couples with a partner\'s pension or ISA may move.'
      ],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you hold investments outside a pension or ISA, enter them in Stress Settings → Your pot → Taxable investments today, and say what the account holds.',
      'Decision tool users: enter the taxable account\'s balance and what it cost on your next monthly entry (the cost is pre-filled from then on).',
      'If you expect an inheritance or a house sale, add it under Income streams and lump sums with what it is and how the taxable part will be held.',
      'If your ISA policy is Hold, read the note under bed-and-ISA; if band-fill recycling is also on, decide whether you really want recycled money going into an ISA you will not draw.',
      'Re-run the Stress Tester and the Strategies overview to see the updated numbers for plans with a lump sum or a taxable account.'
    ],
    notes: [
      'Rules used: ISA £20,000 a year; MPAA £10,000; pension relief floor £3,600 gross; dividend allowance £500 (8.75% / 33.75%); savings allowance £1,000 / £500; CGT exemption £3,000 (18% / 24%); UK gilts exempt from CGT; inherited pension = beneficiary drawdown; inherited ISA = additional permitted subscription.',
      'Still open: gilts in the taxable account grow at the engine\'s bond return rather than the real-yield curve the ladders price on; losses are not carried forward; the history CSV export does not yet include the taxable-account columns.',
      'Engine version 6.1.0.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const ds = scenario?.decisionTool?.settings || {};
      const windfalls = Array.isArray(ss.windfalls) ? ss.windfalls.filter((w) => w && w.amount > 0) : [];
      const hold = ss.isaDrawdownStrategy === 'hold';
      if (+ss.taxableStart > 0) out.push('This plan holds ' + gbp(ss.taxableStart) + ' in a taxable account: it is now drawn before the ISA and taxed on its dividends and gains (' + (ss.taxableMix === 'gilt' ? 'gilts, so CGT-free' : 'held as ' + (ss.taxableMix || 'shares')) + ').');
      if (windfalls.length) out.push('This plan expects ' + windfalls.length + ' lump sum' + (windfalls.length > 1 ? 's' : '') + ' (' + windfalls.map((w) => gbp(w.amount) + ' in year ' + (w.year ?? '?')).join(', ') + '): each is now routed through the ISA allowance and pension room, with the rest taxable.');
      if (hold && ss.bedAndIsa !== false && (+ss.taxableStart > 0 || windfalls.length)) out.push('The ISA is on Hold, so bed-and-ISA no longer happens for this plan and a cash lump sum\'s ISA slice stays in the taxable account.');
      if (hold && ss.bandFillRecycle) out.push('Band-fill recycling is on while the ISA is on Hold: recycled money lands in an ISA this plan never draws — review one of the two.');
      if (ds.locked) out.push('The Decision plan is locked' + (scenario?.strategy?.engineVersion ? ' (engine ' + scenario.strategy.engineVersion + ' at lock)' : '') + ': recorded months are not re-judged; the taxable-account boxes appear on your next entry.');
      return out;
    }
  }
];

// ---------------------------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------------------------

/** 'x.y.z' → [x, y, z], or null when it is not a plain semver. */
export function parseVersion(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(v || '').trim());
  return m ? [+m[1], +m[2], +m[3]] : null;
}

/** Standard three-part compare: negative when a < b, 0 when equal, positive when a > b. */
export function compareVersions(a, b) {
  const pa = parseVersion(a) || [0, 0, 0], pb = parseVersion(b) || [0, 0, 0];
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
  return 0;
}

/** Announced = pops up once. Default: minor and major releases (patch 0); `announce` overrides. */
export function isAnnounced(rel) {
  if (!rel) return false;
  if (typeof rel.announce === 'boolean') return rel.announce;
  const p = parseVersion(rel.version);
  return !!p && p[2] === 0;
}

/** Announced releases newer than the version the user last saw (null/'' = never seen any). */
export function releasesSince(lastSeen, releases = RELEASES) {
  return releases.filter((r) => isAnnounced(r) && (!lastSeen || compareVersions(r.version, lastSeen) > 0));
}

export function latestRelease(releases = RELEASES) { return releases[0] || null; }

export { ENGINE_VERSION };
