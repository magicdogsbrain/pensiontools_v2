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
import { deriveTiming, earlyPensionDrawOf } from './services/PlanTiming.js';
import { laterStartEffects } from './services/PlanMove.js';

export const TOOL_IDS = ['budget', 'stress', 'strategies', 'decision', 'accumulation', 'household'];
export const TOOL_LABELS = {
  budget: 'Budget Planner', stress: 'Stress Tester', strategies: 'Strategies (compare & switch)',
  decision: 'Decision tool (monthly)', accumulation: 'Accumulation planner', household: 'Household (couples)'
};

const pctText = (v) => String(Math.round((+v || 0) * 100) / 100);
const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

export const RELEASES = [
  {
    version: '7.4.3', date: '2026-11-07', engineVersion: '6.39.0',
    title: 'A locked plan now starts in the tax year your recorded months begin',
    summary: 'If your plan was locked to start in a later tax year than the months you have already recorded, it now offers to start from the tax year those months begin. Before, it offered the tax year you stopped work, or asked when you stopped first. Your recorded months are kept and read against that year. Nothing changes until you confirm, and the plan stays locked.',
    changes: [
      'A locked plan with recorded months offers to move its start straight to the tax year of its first recorded month, on its home, in About you and when, and beside the saved first tax year.',
      'The confirm names that tax year and says your recorded months are kept.'
    ],
    corrections: [
      'The move no longer goes back to the tax year you stopped work when your recorded months begin in a later tax year, which left a whole year with nothing recorded.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: ['A locked plan whose start is later than its recorded months: once you confirm the move, its first year is the tax year your months begin.'],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['If your plan says it starts later than the months you have recorded, open its home and press “Move the start”.'],
    notes: []
  },
  {
    version: '7.4.2', date: '2026-11-07', engineVersion: '6.39.0',
    title: 'A gilt ladder’s cash years are its only cash',
    summary: 'Some older ladder plans kept extra cash on top of their cash years, for months before the plan. Nobody who has retired has such months, so that extra cash is no longer added. Those ladders can cost less and leave more over. Every other plan works out exactly as before.',
    changes: [
      'A gilt ladder’s cash years, paid from the money-market fund, are now its only cash.',
      'A locked plan saved with a later start now reads as drawing. The one thing it asks is still to move its start to the tax year you stopped work. Opening it changes nothing in it.',
      'An older plan document no longer shows extra cash beside its cash years, because your figures no longer count it. The document still keeps it as saved.'
    ],
    corrections: [
      'That extra cash was still counted in three cases: a retired plan with no stop month, a ladder for someone still saving, and the cash a saver was told to hold while still working. None of them counts it now.'
    ],
    effects: {
      stress: ['Ladder plans that held extra cash on top of their cash years: the ladder no longer adds it, so more is left over.'],
      strategies: ['The same ladders are compared without that extra cash.'],
      decision: ['Months you have recorded are kept exactly as you recorded them. A locked plan’s document is unchanged.'],
      accumulation: ['A saver is no longer told to hold that extra cash while still working.'],
      budget: [],
      household: []
    },
    actions: ['None.'],
    notes: [],
    affects(scenario) {
      const p = scenario?.stressTool?.settings?.strategyParams || {};
      const has = Object.values(p).some((v) => v && typeof v === 'object' && +v.bridgeCash > 0) || +p.bridgeCash > 0;
      return has ? ['This plan’s ladder held extra cash on top of its cash years. It no longer counts, so the ladder costs less and leaves more over.'] : [];
    }
  },
  {
    version: '7.4.1', date: '2026-11-06', engineVersion: '6.38.0', announce: true,
    title: 'Your plan leaves your pension alone until you can take it',
    summary: 'If you stop work before you can take money from a pension (55, or 57 for anyone not 55 by 6 April 2028), your plan now pays those years from your other savings and leaves the pension to grow. If those savings can’t cover the gap, we show it as an income cut. Plans for people who can already take their pension work out exactly as before.',
    changes: [
      'In any tax year that starts before you reach the age, the plan pays you from your taxable savings first, then your ISA. The year your birthday falls in waits for the next.',
      'If your other savings can’t cover those years, every way of drawing counts the gap as an income cut. Your plan’s home and “Does it last?” say by how much a year, and in which years.',
      'The year-by-year table, the tax-year set-up and the monthly figure all leave the pension untouched in those years, and the tax-free lump waits for the year your pension opens.'
    ],
    corrections: [
      'Before this release, a plan for someone who stopped work young could take money from a pension before the law allows it, which made the plan look better than it could be.'
    ],
    effects: {
      stress: ['Only plans for someone under 55 (or 57) during the plan change: those years are paid from other savings, and any gap shows as a cut.'],
      strategies: ['The same plans compare strategies with the pension closed until it can be taken.'],
      decision: ['For those plans, the monthly figure takes nothing from the pension until it can be taken. A locked plan’s document is unchanged.'],
      accumulation: [],
      budget: [],
      household: ['Each partner’s pension is closed by their own age.']
    },
    actions: ['If you stopped work before 55 (or 57), open your plan and look at “Does it last?”. If it shows a cut in the early years, you may need more in your ISA or other savings to cover them.'],
    notes: [],
    affects(scenario) {
      try {
        const e = earlyPensionDrawOf(scenario?.stressTool?.settings || {});
        return e ? ['This plan now pays you from your other savings until ' + e.age + ', not from your pension. Its figures may change.'] : [];
      } catch { return []; }
    }
  },
  {
    version: '7.4.0', date: '2026-11-06', engineVersion: '6.37.0',
    title: 'Once you have stopped work, your plan runs from that tax year',
    summary: 'A plan for someone who has stopped work now runs from the tax year they stopped, or from this tax year. It never starts at a later April. Drafts saved with a later start are read from the earlier year, and locked plans are only moved when you confirm.',
    changes: [
      'A plan you have not locked that was saved to start next April is now read from the earlier tax year. From today one more year is drawn, and your income steps, lump sums and other dated figures keep their ages and tax years. Nothing is saved until you next save the plan.',
      'We never change a locked plan for you. If it is set to start later than this tax year, its home asks when you stopped work, or offers to start it this tax year if you are already drawing. If your State Pension was entered only as a number of years, the move asks for its date and keeps it in the right tax year. The start moves only when you confirm.',
      'If your plan draws from a pension before the age you can usually take one (55, or 57 from April 2028), we now say so beside its figures. The figures do not yet hold your pension back until then.'
    ],
    corrections: [],
    effects: {
      stress: ['A plan you have not locked, saved to start in a later tax year, now runs from the tax year you stopped work, or this tax year. One more year is drawn, so its figures change.'],
      strategies: ['The same plans are compared from the earlier tax year.'],
      decision: ['Locked plans are unchanged until you confirm moving the start.'],
      accumulation: [],
      budget: [],
      household: ['A couple’s split is worked out from each plan’s earlier start.']
    },
    actions: ['If you have a draft that was set to start next April, open it and check its figures, then save it. If a locked plan’s home asks when you stopped work, answer it and confirm the move.'],
    notes: [],
    affects(scenario) {
      try { return laterStartEffects(scenario || {}); } catch { return []; }
    }
  },
  {
    version: '7.3.3', date: '2026-11-06', engineVersion: '6.37.0',
    title: 'No more months “before your plan”',
    summary: 'Once you have stopped work, your plan is your plan from the tax year you stopped. No screen talks about months before it any more, in either app. Plans saved with a later start now show one thing to do instead. No figures change.',
    changes: [
      'If your plan was saved to start in a later tax year than the one you stopped work in, its home and the next-step banner show one thing to do: start it from the tax year you stopped. If we don’t know when you stopped, it asks that first. Moving the start always asks you to confirm.',
      'If your plan is locked and its start can’t be moved yet, it says so and shows why, instead of offering a move it would refuse.',
      'The plan that holds gilts until your State Pension and then shares is now called “Gilts to State Pension, then shares” everywhere, including older plan documents. Only the name has changed.',
      'Next April is no longer offered as a later start. A start year is only called saved if you saved it.'
    ],
    corrections: [
      'Months you recorded before a later start were read against a later year’s figure, or said to be “before the plan”. Until the start is moved, they are now listed with what you took, without a comparison.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['If your home shows “Start it from the tax year you stopped”, press Move the start and check the confirm before you agree.'],
    notes: []
  },
  {
    version: '7.3.2', date: '2026-11-06', engineVersion: '6.37.0',
    title: '“Use the previous version” opens the plan you are looking at, and Remove works under “sold?”',
    summary: 'On a plan’s page, the link to the previous version at the top now opens the same plan there, on the matching page. Before, it opened the plan your account usually opens on, which could be a different plan.',
    changes: [],
    corrections: [
      'From a plan’s page, “Use the previous version” opened the previous version on your account’s usual plan and its last page, not on the plan you were looking at. A change made there could have gone to the other plan. It now opens the plan on screen: its home opens where that plan usually opens (Month by month for a plan you draw from), and each step opens its matching page.',
      'In What you hold, after pasting your holdings, pressing Remove beside a line listed as “Not in what you pasted — sold?” seemed to do nothing: it asked “Remove it?” on that line in the list higher up the page, out of sight. It now asks right beside the line you pressed.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. Nothing in your plans has changed. If you used the link before this release, check which plan the previous version shows at the top before changing anything there.'],
    notes: []
  },
  {
    version: '7.3.1', date: '2026-11-06', engineVersion: '6.37.0',
    title: 'A plan you draw from reads Drawing',
    summary: 'Once you record months from a plan, its home calls it Drawing, even if what you hold is not exactly the plan’s mix. Real holdings almost never match a plan exactly, so a plan that had been drawing for a long time could stay on Moving for good. Any difference is now shown as information, not as a to-do.',
    changes: [
      'If what you hold differs from your plan’s mix, “Where you are” says roughly how much of the mix you hold and what is different, with a link to see the move. It is not added to your to-dos. Small differences inside the plan’s own tolerance are not mentioned.',
      'On a plan you draw from, the move is called “Your plan’s mix” everywhere: on the home, in the list of steps and on its own page. It gives one share held, the same figure everywhere.',
      'The stage bar no longer marks the move as done while part of what you hold still differs from the mix.'
    ],
    corrections: [
      'A plan with months recorded could read Moving, with its next move as the first to-do, because what it held was close to the plan’s mix but not exact. It now reads Drawing.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. Nothing in your plans has changed. A plan that has not recorded its first month still reads Moving, with its next move to do, as before.'],
    notes: ['Choosing to keep what you hold as it is, line by line, comes in a later release.']
  },
  {
    version: '7.3.0', date: '2026-11-06', engineVersion: '6.37.0',
    title: 'Every plan opens on its home: what is due first',
    summary: 'A plan you are carrying out no longer opens on a form or a question. It opens on its home: what is due now, where you are, then everything else folded away. Your plan’s stage is shown in one word, Saving, Moving or Drawing. Opening a plan changes nothing in it.',
    changes: [
      'Every plan opens on its home. “To do” gathers what the plan already knew was due: a month to record, the tax year to set up, the next move to your plan’s mix, your check-in, an out-of-date record of what you hold. It shows up to three at a time, and the first is the one to press.',
      'When nothing is due, the home says until when, for example “October is recorded. Nothing is due until 1 November.”',
      'The home shows your plan’s stage in one word: Saving, Moving or Drawing. It is worked out from what the plan already holds.',
      'On a drawing plan, a year view shows each month of the tax year: what you took against what the plan said, which months were filled in later, and which month is due. Beside it, “Where you are” gives the headline figures, with the full reading one link away.',
      'While you are moving to your plan’s mix, the home counts your moves the same way everywhere.',
      'As your stop date nears, a locked saving plan shows the move to come under “Soon”. From the month you stop, it becomes the first thing to do, with “Not yet” if you are not ready.',
      'Month by month and Check in show their forms only when something is due, or when you ask with “Record a different month” or “Check in now anyway”.',
      'On a locked plan, trying a change, another way or another mix is folded under “Try something”, and the questions are on the home. Nothing is pushed at you while you carry out your plan.',
      'Coming back to the site takes you to a locked plan’s home. Signing in on a new device takes you to the home of the plan you were last on.',
      'Long tests show a ring that fills as the work goes, and the answer waits a moment so it never pops in. Figures count up and the year fills in, unless your device asks for less motion.'
    ],
    corrections: [],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. Nothing in your plans has changed. Every saved link still works: a plan’s address now opens its home, and each step keeps its own address.'],
    notes: ['“Not now” and “Not yet” put a to-do off until you next open the site. They change nothing in your plan.']
  },
  {
    version: '7.2.1', date: '2026-11-06', engineVersion: '6.37.0',
    title: 'The Administration gear follows the account signed in',
    summary: 'In the classic planner, the Administration gear could stay on the screen after someone else signed in on the same page. It now follows whoever is signed in. It was only ever the button: the administration itself was always refused to anyone who is not an administrator.',
    changes: [],
    corrections: [
      'In the classic planner, signing out and signing in as someone else without reloading the page could leave the previous person’s Administration gear showing. We now check again each time a different account signs in.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None.'],
    notes: []
  },
  {
    version: '7.2.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Month by month, on the front pages: what to draw, record the month, fill in the months you missed',
    summary: 'If you draw from your plan, you can now do your monthly records without going to the classic planner. Open a drawing plan and Month by month is the first thing you see: set up the tax year, see what to draw and where it comes from, record the month, and fill in any months you missed in one go. The figures are the same as the classic planner’s.',
    changes: [
      'Open a drawing plan and Month by month is the first thing you see: what to draw this month and where it comes from, then record the month.',
      'When a tax year starts, you set it up on the same page: this year’s income, last year’s price rise, any income and tax so far, and the tax-free top-up from your ISAs or savings. You see what reaches your bank each month before you save it.',
      'Missed a few months? The page names them, and one press fills them all in, each marked as filled in later.',
      'Your plans has a Month by month link beside every drawing plan, and a plan’s “Record” and “Set up” buttons now keep you on these pages instead of sending you to the classic planner.',
      'A plan you have not locked is asked to lock first, with a link to the lock, so every plan you record against has its plan document. A locked plan records its months as before, and its settings stay exactly as they were.',
      'It works the same when you are signed in, with everything kept in your account, and for plans kept in this browser window without an account.'
    ],
    corrections: [],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. Your months recorded in the classic planner are all there.'],
    notes: ['Still in the classic planner for now: your months against the plan by tax year, each tax year as a spreadsheet, the printed documents, drawing quarterly or yearly, and changing a tax year once it is set up. They come next.']
  },
  {
    version: '7.1.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Signed in, it works: back to your plan, and records open signed in',
    summary: 'If you sign in, the site now takes you to your plan and keeps you signed in when you go to the classic planner to record a month. Before, a sign-in on the front pages was not seen by the classic planner, so it opened on its sign-in screen, and keeping a plan then signing in left you on “Your account”. The site is called PensionTools again, and the front page groups its questions by where you are.',
    changes: [
      'The site is called PensionTools on every page, with one line saying what it is for: plan your pension, from saving to living on it. “Drawdown” is now used only where it means drawing money.',
      'The front page groups its questions by where you are: still working, stopping soon or already stopped, or already with a plan.',
      'If you keep a plan without an account and then sign in or make one, we bring you straight back to that plan in your account, at the step you were on. You can also sign in first and keep the plan straight into your account.',
      'When you are signed in and open pensiontools.uk, we take you back to the plan and step you were last on. “All questions” is one click away. If that plan has been closed or deleted, you land on “Your plans”.'
    ],
    corrections: [
      'Going from a plan to the classic planner, to record a month, set up the tax year or change a setting, opened it as if you were not signed in. It now opens signed in, on that plan and page. If you were signed in before this release, you stay signed in.',
      'For accounts made on the front pages, which release notes you had read was not remembered on your other devices. It now is.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None.'],
    notes: ['We now keep one more setting with your account: the plan and step you were last on, so we can take you back there. It holds no figures.']
  },
  {
    version: '7.0.1', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'A way back to Drawdown Planner from the classic planner’s first screens',
    summary: 'The classic planner’s first screen and its sign-in screen now have the “Back to Drawdown Planner” link. Before, it appeared only once you were in the planner, so someone who opened the classic planner without an account had no way back except their browser’s back button.',
    changes: [],
    corrections: [
      'The “Back to Drawdown Planner” link now sits at the top of the classic planner’s first screen and its sign-in screen as well, on a phone too. Once you are in the planner, the link at the top of the planner takes over, so only one shows at a time.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None.'],
    notes: []
  },
  {
    version: '7.0.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Drawdown Planner is now the front page',
    summary: 'The question pages and your plans, until now a preview at their own address, are now the site’s front page: Drawdown Planner. The planner you used before is still here, as the classic planner. Your saved plans are unchanged: both read and save the same plans, under the same sign-in.',
    changes: [
      'Drawdown Planner is the first thing you see. Everything you could do in the preview, you can still do.',
      'The planner you used before is now called the classic planner. “Use the previous version” at the top of every page opens it, and every button that sends you there says “in the classic planner”. Month by month (recording a month, setting up a tax year) and the printed plan document stay there for now.',
      'The classic planner has a “Back to Drawdown Planner” link at the top of every page, on a phone too.',
      'Old links and bookmarks still work. The preview’s old address opens the same page on the front page. Links to the example plan, or to the sign-in and sign-up screens, open them in the classic planner, where they always opened.',
      'If you added the site to your home screen, it now opens Drawdown Planner and is called Drawdown Planner.',
      '“I have a plan. Test it.” now opens your plans: a plan’s own steps test it against the bad times, compare the ways to take the money and let you try a change. “Answer everything in full” under an answer offers to keep that answer as a plan.',
      '“I have one decision to make.” says plainly that it is not answered here yet.',
      'A plan you lock in Drawdown Planner is labelled “locked in Drawdown Planner”. Plans locked before keep the label they were saved with.'
    ],
    corrections: [
      'If a change was refused because the plan is locked, the message told you to unlock the plan in the old planner. It now points to “Your plan as locked”, where you can unlock it. A couple’s plan that was only partly kept now points to “Your plans” to delete the extra copy.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. Your plans are where they were.'],
    notes: [
      'Retired, never built: the “What are the ways to take it?” step after “What is that a month?”. To compare the ways on your own figures, keep your answer as a plan and open “How the money is taken”.',
      'Still in the classic planner only: the budget’s step-by-step walk-through, “Reset to defaults”, switching tools on or off for a plan, and the administrators’ panel.',
      'Our privacy policy now speaks of “the question pages” and of moving “to the classic planner”. We collect nothing new and keep nothing new.'
    ]
  },
  {
    version: '6.59.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Trying figures no longer makes plans',
    summary: 'When you open “Am I saving enough?” from your saving plan, the figures you try now change nothing until you choose to use them in that plan. Before, each keep made a new plan, so trying several sets of figures could leave many copies. A new plan is now made only when you ask for one. We also fixed three ways the site could make extra copies without being asked, and added “Delete several” to clear copies away.',
    changes: [
      'In the preview, “Am I saving enough?” opened from your saving plan now leads with “Use these in ‘your plan’”. It puts the pay-in you chose, as now or what would be enough, into that plan. Nothing else in the plan changes, and you can undo it. Figures you try without pressing it change nothing.',
      '“Keep as a new plan” is now a separate, second choice, with a name that never repeats the plan you came from. After you keep a plan, the page and the steps beside it offer to open that plan, and keeping again is labelled “Keep as another new plan”.',
      'The links on a plan that open “Am I saving enough?” with its figures now show on wider screens too, not only on phones.',
      'Your plans in the preview: “Delete several” lets you tick the plans you no longer want and delete them after one confirmation that names each one. A locked plan is named and asked about a second time, as when you delete one. A plan that cannot be deleted is named with the reason, one plan always stays, and nothing you did not tick is touched.'
    ],
    corrections: [
      'In the planner, pressing a “Where would you like to start?” button again while your new plan was being saved made another plan with the same name each time. The buttons now wait and say your plan is being made. If it cannot be finished, they come back and ask you to look for the plan before you try again.',
      'Keeping a plan on a patchy connection could say “Nothing was kept” when the plan had been saved, and each retry made another copy. A retry now finds the plan instead, for a couple’s two plans too. If we cannot tell whether it was kept, we say so, and pressing again makes no second plan.',
      '“Move to a new plan”: in the planner, a double click could ask twice and make two new plans. It now asks once. In the preview, if the connection drops part-way, we check what happened and carry on with the new plan. We never make a second one, or say nothing changed when it had.',
      'Saying “Yes” to bring plans made without an account into your account, in two planner tabs one after the other, no longer copies them twice.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. If you have several copies of a plan, open Your plans in the preview, choose “Delete several” and tick the copies you do not want. Open each one first if you are not sure which is the plan you use: we never delete plans for you.'],
    notes: []
  },
  {
    version: '6.58.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Going back to work: close the plan you drew on and carry on saving',
    summary: 'If you go back to work after drawing from your pension, you can close the plan you drew on at the month work starts again and carry on in a saving plan made from its figures. The saving plan knows you have taken money flexibly, so it says when what goes into pensions would pass the £10,000 limit.',
    changes: [
      '“I’m going back to work” now sits beside “Move to a new plan” on a plan you have lived on: in the planner under Stress tester → Settings, and in the preview under Your plans. It closes the plan at the month work starts again and carries it on in a saving plan made from its figures. You say when you expect to stop again, as a month or an age. Your income steps keep their ages and the plan still ends at the same age.',
      'The saving plan opens on its saving pages, where you say what you and your employer pay in and check in with it. When you stop again, you lock it as you would any saving plan.',
      'Once you have taken money from a pension flexibly, what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply. A plan made by closing one you drew on carries that fact and the month it began. The planner’s Accumulation page, What you pay in, your check-in and “Am I saving enough?” opened from the plan all state the limit, and warn when more than £10,000 goes in.',
      'A closed plan says it closed because you went back to work, and the saving plan names the plan before it, whose months are kept there.',
      'If the change-over to work is still to come, the saving plan says the month it carries on from. It takes no check-in or pot record for the months before then, because those months belong to the plan you are still drawing on.',
      'When you close a plan, its suggested name follows the month you pick until you type your own.',
      'On a phone, a long question in the planner now scrolls inside its box, so its buttons can always be reached.'
    ],
    corrections: [
      'A plan made by “Move to a new plan” from one you drew on showed the full £60,000 allowance, because it had no drawing records of its own. It now reads the £10,000 limit from the plans before it. A close now counts any income drawn from the pension as taking money flexibly, not only money taken partly tax-free.',
      'Once the £10,000 limit applies, the Accumulation page no longer says that unused allowance from earlier years may cover payments over £60,000. That allowance cannot raise the £10,000 limit.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: ['A plan made by moving on from a plan you drew on may now show the £10,000 limit on its Accumulation page and on What you pay in. Every other plan is unchanged.'],
      budget: [],
      household: []
    },
    actions: ['None. If you have gone back to work after drawing from your pension, open the plan you drew on and choose “I’m going back to work”.'],
    notes: []
  },
  {
    version: '6.57.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Check in with your saving plan',
    summary: 'You can now check in with your saving plan once a year, each quarter or each month: tell it your pot and what you pay in, and see whether you are still on course, how your pot compares with where the plan expected it to be, and what has changed since last time.',
    changes: [
      'Each check-in says what would be enough from here, as a share of your pay or in pounds a month, using the same test as “Am I saving enough?”.',
      'It shows what went in and what markets, charges and anything not recorded did. The two add up to the change in your pot, to the pound, and your check-ins are kept as a history.',
      'Your first check-in sets your saving path from that day’s figures, so later check-ins are compared with something fixed. If your plan is locked, its own saving path is used and the plan stays locked.',
      'When a check-in is due, your plan’s steps, its next step and Your plans say so. You can save a calendar file that holds only the date and the words “PensionTools check-in”, with no figures. We send no emails or notifications.',
      'If what you pay in has changed, “Use these in my plan” puts the new figures into your plan. Nothing else in the plan changes.',
      'A check-in’s pot is also that month’s pot record, so it shows in the planner’s monthly list too. Keeping “Am I saving enough?” as a plan offers to start your first check-in.'
    ],
    corrections: [],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: ['Plans already saved are unchanged until you check in. A plan locked while you were still saving, where you never chose how often to check in, keeps its monthly reminder to record your pot, word for word.'],
      budget: [],
      household: []
    },
    actions: ['None. If you are saving, open your plan and check in to choose how often.'],
    notes: ['Our privacy policy now names your pay, what you pay into pensions, your check-ins and any note you write with them. A note is up to 280 characters; please leave out health details. It is included when you download your plan, and deleted with the plan.']
  },
  {
    version: '6.56.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Move to a new plan from a month you choose, and keep the old one to read',
    summary: 'If you have lived on a plan and want to change how you draw, you can now close it at a month you choose and carry on in a new plan made from its figures. The plan you move from is kept as it was, to read, and each plan points to the other.',
    changes: [
      'In the planner it is in Stress tester → Settings, beside the lock; in the preview it is on Your plans. You choose the month the new plan starts. If that month is still to come, the old plan closes at the end of the month before, and you can keep recording its months until then.',
      'The new plan starts in the tax year of that month. Its income steps keep their ages and the month you stopped work is kept. Its pots are asked, filled in from the newest figures we have for each pot, each saying where it came from. It is not locked, so you can change it before you lock it.',
      'The plan you move from is kept as it was: its months, its plan document and where it stood when it closed. It cannot be unlocked or changed, no month after the close can be recorded on it, and it is listed under Previous plans.',
      'Each plan points to the other: “Closed March 2029; carried on as …” and “Under your previous plan … until March 2029”. What you hold travels with the new plan, and your budget is copied.',
      'If your plan is linked with your partner’s, you choose whether the link, and a budget you share, moves to the new plan. A closed plan is never offered as a partner’s plan.',
      'Duplicating a closed plan, or opening a downloaded copy of one, makes an ordinary plan you can change. Without an account, moving to a new plan counts towards the three-plan limit, as making a new plan does.'
    ],
    corrections: [],
    effects: {
      stress: ['Nothing changes unless you move to a new plan.'],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None.'],
    notes: []
  },
  {
    version: '6.55.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: '“Gilts to State Pension, then shares” and Ladder & ratchet count a started plan’s years from its start',
    summary: 'For a plan whose first tax year has passed, “Gilts to State Pension, then shares” held its cash, and Ladder & ratchet its base ladder, for as many extra years as had already gone by. They now count from the plan’s first year, so the figures for these plans change. The preview can also move a locked plan’s start itself, and a saving plan opens “Am I saving enough?” with its own figures.',
    changes: [
      'In the preview, a locked plan’s “About you and when” can now move the plan’s start back to the tax year you stopped work without leaving the page. It says exactly what changes first, in the same words as the planner.',
      'On a saving plan, the link to “Am I saving enough?” now opens the question with your plan’s figures and its own mix of investments filled in, so it gives the same answer as your plan until you change something.'
    ],
    corrections: [
      'For a plan whose first year is behind it, “Gilts to State Pension, then shares” held its cash, and Ladder & ratchet its base ladder, for as many extra years as had already passed. They now count from the plan’s first year: a plan two years in with three cash years has one cash year left.',
      'Month by month’s advice for Ladder & ratchet counted the base ladder as 15 years when you had not set it, even when the plan bought fewer. It now counts the years the plan buys.',
      'A Ladder & ratchet plan whose base ladder has all been paid no longer says its income is guaranteed by contract to your age today.',
      'Moving a locked Ladder & ratchet plan’s start back no longer ends a base ladder you had not set a year early.',
      'Pasting your holdings again no longer adds a second copy of a plain cash line, merges two cash accounts into one, or lets a cash line take over a money-market fund. Cash lines are now matched by their name within their account.'
    ],
    effects: {
      stress: ['“Gilts to State Pension, then shares” and Ladder & ratchet plans whose first tax year has passed: the cash or base ladder left now counts from the plan’s first year, so their figures change. A locked plan’s plan document keeps its figures until it is written again. Other plans are unchanged.'],
      strategies: [],
      decision: ['Ladder & ratchet’s month advice counts the base-ladder years your plan buys when you had not set them.'],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. If you draw by “Gilts to State Pension, then shares” or Ladder & ratchet and your plan started in an earlier tax year, look again at its figures.'],
    notes: []
  },
  {
    version: '6.54.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Move a locked plan’s start back to the tax year you stopped work',
    summary: 'If you locked a plan whose income starts after the tax year you stopped work, the planner now asks when you stopped and can move the plan’s start back to that tax year without unlocking it. The months you have lived since then become months of your plan, and every figure stays in the tax year it was in.',
    changes: [
      'On a locked plan, “When your plan starts” asks once when you stopped work. “Leave it” is remembered, and you can still give the month later under “Say when you stopped work”. You can change the month while the plan is locked.',
      'If your plan was set to start after you stopped work, “Move the plan’s start…” moves it back to the tax year you stopped. It says exactly what changes first, and the plan stays locked.',
      'After the move, the months you recorded since you stopped are months of your plan: History, plan vs actual and the line that shows where you are count the plan’s years from the tax year you stopped. Months you did not record can be filled in back to the month you stopped; each earlier tax year is set up first, and a month already recorded is never written over.',
      'Your income keeps its shape. The first step keeps its amount and runs from the tax year you stopped; the years added at the front are paid at the amount the step started at. Later steps keep their ages, and the plan ends at the same age.',
      'Your State Pension, lump sums, one-off costs, other income, a final-salary pension, a gilt ladder’s first gilt and its cash years all keep their tax years. Only the plan’s count of years to them changes.',
      'The plan document and plan vs actual are written again from the new start. The earlier plan document stays under Previous versions, and plan vs actual says when it was written again and why.',
      'If a State Pension year you typed yourself cannot be kept exactly, the move is not offered, and the page says you can change the start by unlocking the plan.',
      'In the preview, a locked plan’s “About you and when” asks when you stopped work and opens the planner to move the plan’s start.'
    ],
    corrections: [
      'In the Decision tool, the lower limits on your pots now count from the pots you entered, in the tax year you entered them. Before, a plan locked after its first tax year had begun could show your pots as below their limits straight away.',
      'Plan vs actual no longer calls a later part year “a first year”. It says how many months were set up for that tax year.',
      'Right after a plan’s start changed, History no longer labels your recorded months by the old start until the page is reloaded.'
    ],
    effects: {
      stress: ['Nothing changes unless you move a locked plan’s start. A moved plan counts more years to the same end age, and a gilt ladder’s cost leaves out the years already lived.'],
      strategies: [],
      decision: ['A plan locked after its first tax year had begun now counts its pots’ lower limits, and lump sums, from the tax year its pots were entered. Other plans are unchanged.'],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. If your plan is locked and its income starts after the tax year you stopped work, open “When your plan starts” in the planner’s settings to say when you stopped and move the start.'],
    notes: []
  },
  {
    version: '6.53.0', date: '2026-11-05', engineVersion: '6.37.0',
    title: 'Your saving plan says whether you are paying in enough',
    summary: 'A plan you are still saving into now answers “Are you paying in enough?” on its own figures, the same way “Am I saving enough?” does, and opens on what you pay in. Before, it nudged you towards recording what you hold, locking the plan and the monthly drawing page, which are for when you draw.',
    changes: [
      'A saving plan’s “What you pay in” opens on the same answer as “Am I saving enough?”, worked out on the plan’s own figures: whether you are on course, and what would put you on course. “Are you paying in enough?” is the plan’s first button.',
      'While you are saving, recording what you hold, moving it to your plan’s mix and locking the plan are kept for later, not given as your next step.',
      'In the planner, someone still saving opens on the Accumulation page, not the monthly drawing page. Setup has a new door, “I’m still saving: am I paying in enough?”, and “What you hold” is marked optional while you save.',
      'A plan kept from “Am I saving enough?” raises what goes in each year in step with prices, as the answer did, keeps a share of pay as a share and keeps the saving mix you chose. Keeping it takes you to the plan’s “What you pay in”.',
      'For someone still saving, the lock page says what it fixes without the lines about drawing.',
      'Moving your stop on “About you and when” moves it on “What you pay in” and on the planner’s Accumulation page too.',
      'Couples: if you keep “Am I saving enough?” and you have already stopped work, the next button opens your partner’s “What you pay in”. On a couple’s plan the answer says it reads your plan on its own.'
    ],
    corrections: [
      'A plan whose ages were given only on the planner’s Accumulation page is now treated as a saver’s plan. Before, it was told to set up the monthly drawing tool.',
      'The planner’s banner no longer tells a locked saver to keep buying the plan’s mix years before they stop, and the pot records on the Accumulation page no longer tell you to lock the plan while you are saving.',
      'Keyboard users no longer lose their place on the plan’s steps while an answer is being worked out.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: ['Plans already saved keep their figures. A plan kept from now on raises what goes in each year and keeps a share of pay as a share.'],
      budget: [],
      household: []
    },
    actions: ['None. If you are saving, open your plan’s “What you pay in” to see whether it is enough.'],
    notes: []
  },
  {
    version: '6.52.0', date: '2026-11-04', engineVersion: '6.37.0',
    title: 'Am I saving enough? says plainly whether you are on course, and what would be',
    summary: '“Am I saving enough?” now opens with a straight answer: on course, close, or not, and in the same sentence what share of your pay would put you on course. Before, you had to look closely to see that what went in fell short of your aim, and nothing said what would be enough.',
    changes: [
      'The first sentence says whether you are on course (9 futures out of 10), close (3 out of 4) or not, and what share of your pay in all would put you on course, with the share for 3 futures out of 4 beside it. A fixed pay-in is answered in pounds a month.',
      'It says what you could spend from the age you stop, in a middling and a bad case with your State Pension included, and how far short of your aim that is.',
      'If you give your pay-in as a share of your pay, every answer, “Try” button and the table of ages and pay-ins speaks in shares of your pay.',
      'A new way to get there sits beside stopping later and spending less: a one-off sum into your pension now. Allowance warnings check the figure the answer suggests.',
      'When paying in more cannot get you there, the answer says so and leads with the other ways it found.',
      'Couples: each share is your own part, with your employers’ parts beside it. When only your partner is still saving, the answer talks about their pay and pension.',
      'Keeping an answer that is not on course as a plan asks whether the plan pays in what you pay now or what would put you on course.'
    ],
    corrections: [
      'A browser that still held an old offline copy of the site now clears it on the next visit, so it always opens the latest version.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: ['Plans already saved are unchanged. A plan kept from “Am I saving enough?” pays in what you choose when you keep it.'],
      budget: [],
      household: []
    },
    actions: ['None. If you are saving, ask “Am I saving enough?” again to see what would put you on course.'],
    notes: []
  },
  {
    version: '6.51.0', date: '2026-11-04', engineVersion: '6.37.0',
    title: 'Say when you stopped work, and your plan can start in that tax year',
    summary: 'You can now tell the planner the month you stopped work, even years ago. Your plan’s income then starts in that tax year unless you choose a later one, and the plan is worked out from where it stands today. Every page now says where a plan that has started stands, and the months before a later start are named for what they are.',
    changes: [
      'Timing, the set-up steps and the preview’s “About you and when” take the month you stopped work. The plan’s income starts in that tax year by default; a later year is your choice.',
      'A plan that has started says so: “Plan started 6 April 2023; today is plan year 3 of 30”. It is no longer offered an update to start now, and its plan document marks the years already lived and the plan year it was locked in.',
      'If your plan started later than you stopped, its months until then were recorded but not compared with the plan. The Transition page said the same.',
      'The gilt ladder’s extra cash box says it holds pension cash. Money outside your pension does not go there.',
      'If the income would start before your pension can be drawn (55, or 57 if you reach 55 from 6 April 2028), Timing tells you and names the tax year to choose.',
      'Plan vs actual compares a year lived before you locked the plan on what you drew. It makes no tax or ISA comparison for those years, because the pots at their start were never entered.'
    ],
    corrections: [
      'A month recorded under an earlier start could keep its old label after the start moved. Labels now follow the plan’s start as it is now.',
      'If you stopped work this tax year or earlier, a gilt ladder no longer holds back cash for a first April that has passed. A ladder still waiting for its start, or a plan locked before it, keeps that cash.',
      'When a plan starts part-way through a tax year, the Decision tool’s monthly figure for the ladder’s first year is now a twelfth of that year’s income, as the plan was worked out. Before, it squeezed the year into the months left to 5 April.',
      'A plan locked by its first monthly record after its first year began now keeps where its pots stood that day. Plans locked before this release read exactly as they did.'
    ],
    effects: {
      stress: ['Nothing changes until you say when you stopped work. If you do, on a plan that is not locked, its start moves to that tax year unless you choose another, and its figures follow.'],
      strategies: ['A gilt ladder in a plan that has started no longer holds back cash for a first April that has passed. Every other plan reads as before.'],
      decision: ['Nothing you recorded changes. Month labels follow the plan’s start as it is now.'],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: ['None. If you have stopped work, you can add the month in Timing: check the start year it picks.'],
    notes: []
  },
  {
    version: '6.50.0', date: '2026-11-04', engineVersion: '6.37.0',
    title: 'Fill in the months before your first record, and plans that started earlier run from today',
    summary: 'If you start recording part-way through a tax year, Month by month can now fill in the months before your first record when you ask it to. We also changed how a plan whose first tax year has already passed is run: it now starts from where you are today, so the years you have already lived are not asked of your pot again. Locked plans run exactly as they were committed.',
    changes: [
      'Month by month: “Fill in earlier months you did not record…” lets you choose the month to start from, and names the months it will write before you tick.',
      'Months before a tax year you set up part-way take an even share of the income and tax you entered at the set-up. They are recorded as pension drawn, so the year’s totals stay the same and later months are worked out as before. Only tick it if that money was pension you drew.',
      'Where you are: the income line compares what you took in the months recorded with what the plan said for those same months, and names any months filled in from your set-up.',
      'A plan that is not locked and whose first tax year has passed now runs from the plan year you are in: its steps, ages and State Pension count from today, and a gilt ladder buys only the years still to come.'
    ],
    corrections: [
      'A month before its own tax year’s set-up could be worked out and saved by itself, which counted its income twice and moved every later month. Calculate now explains how to record it instead.',
      'A plan whose first tax year had passed was run as if that year were starting now, so the years already lived were asked of your pot again.'
    ],
    effects: {
      stress: ['If your plan is not locked and its first tax year has passed, its figures now start from the plan year you are in, so they can differ from before. Every other plan reads exactly as before.'],
      strategies: ['Only plans that are not locked and whose first tax year has passed read differently, as above.'],
      decision: ['Nothing you recorded changes. The fill writes only the months you choose.'],
      accumulation: [],
      budget: [],
      household: ['A partner’s plan whose first tax year has passed is now placed at the plan year it is in.']
    },
    actions: ['None, unless your plan is not locked and its first tax year has passed: then look over its figures once.'],
    notes: []
  },
  {
    version: '6.49.0', date: '2026-11-03', engineVersion: '6.37.0',
    title: 'What’s new is shorter and plainer, and examples are general',
    summary: 'We rewrote every What’s new note to say only what changed, why, and what it means for you. Hints and examples now use general wording instead of naming one fund, and “Add a step” starts from your own plan. Your plans and their figures are unchanged.',
    changes: [
      'What’s new: every note, back to the first, now says what changed and why in a few short lines.',
      'Gilt ladder and cash hints say “a money-market fund” instead of naming one particular fund.',
      'Income shape: “Add a step” on an empty list now starts from your plan’s start age and income, not a fixed example.'
    ],
    corrections: [],
    effects: { stress: [], strategies: [], decision: [], accumulation: [], budget: [], household: [] },
    actions: ['None.'],
    notes: []
  },
  {
    version: '6.48.0', date: '2026-11-03', engineVersion: '6.37.0',
    title: 'Missed months can be filled in, Save explains itself, and nobody is signed out',
    summary: 'If you skip recording a month, the new-look pages (preview) now notice and take you to it, and Month by month can fill the gap with the figures you give. We also fixed a fault that signed people out once on opening the planner or the preview, and Save now says why it is off.',
    changes: [
      'Preview, “This month”: the month to record is now the earliest one missed since your first record. Its button opens Month by month on that month, with the figures from the record before it filled in.',
      'Month by month: when months are missing before the one you are recording, a tick (off by default) offers to fill them in with the same figures. Each is worked out in order and marked “filled in later”, a fair picture of that month rather than an exact one.',
      'Month by month never fills in a month that comes before the month its tax year was set up from, because the income received in it was entered in that set-up and would be counted twice. The help says so.',
      'Month by month: a line under Calculate and Save says why Save is off or what was just saved, and Save switches off again as soon as you change a figure or the month.',
      'A record made with “This month’s payment has already been made” is now marked, so the preview no longer asks for the month you skipped on purpose.',
      'What’s new: every note is now written in plain English, without page addresses, file names or code words.'
    ],
    corrections: [
      'Opening the preview or the planner signed people out once, because the previous release looked for your sign-in in only one of the places your browser keeps it. It now looks in all of them.',
      'Once a later month was recorded, the preview gave no way to go back and record a month that was missed. It now leads you to the earliest missed month.',
      'Month by month: after a save, Save stayed off with no explanation, and a failed calculation showed its reason for only three seconds. The reason now stays on the page until you calculate again.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [
        'New records may carry a “filled in later” or “payment already made” mark; records you have already saved are unchanged.'
      ],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'If the planner or the preview signed you out recently, sign in once more; it will not happen again.'
    ],
    notes: []
  },
  {
    version: '6.47.0', date: '2026-11-02', engineVersion: '6.37.0',
    title: 'Couples: “Who draws what” now paces the smaller pension until its State Pension',
    summary: 'When a couple compares who draws from which pension, the first split shown now draws the smaller pension evenly until that person’s State Pension starts, instead of as fast as tax allows, which could empty it early. We also corrected the tax count, which made drawing faster look better than it was.',
    changes: [
      'Household tab and the preview’s “Who draws what”: the first split shown keeps the smaller pension going until that person’s State Pension starts, drawn evenly until then. The faster split is still offered as “Draw it faster”, with what it saves at first, what it costs by State Pension age, and roughly when the smaller pension would run out.',
      'The page now says what stays the same: your income after tax between you is identical both ways, and the only question is which pension pays how much of it. The two columns read “As the two plans are written” and “Paid as a couple, tax first”.',
      'Preview: a box for what you need between you each year after tax. It is a what-if on that page only, unless you press “Use this split”.',
      'Every pound is now compared in order of what it costs in tax, not only the pounds above the basic-rate band, so the split also finds savings inside the band.',
      'The two pensions are named by their plans’ names throughout.'
    ],
    corrections: [
      'The tax count left out the years after the smaller pension had run out, so drawing faster looked better than it was. Those years are now counted, with the larger pension paying at its own tax rate. This could have affected couples who chose the faster split.',
      'Tax “until the State Pension age” wrongly included the first year the State Pension is paid; it now counts only the years before it.',
      'A couple whose smaller pension’s State Pension was already being paid saw nothing to compare. They now see the split with no limit.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: [
        'Saved plans are unchanged until you press “Use this split” again; from now on it writes the paced split, and “Draw it faster” gives the split it wrote before.'
      ]
    },
    actions: [
      'If you used “Use this split” before, check your two plans again: the first split shown is now the paced one, and “Draw it faster” gives the one written before.'
    ],
    notes: [
      'The split is worked out at today’s prices with no growth, so it errs on the cautious side.'
    ]
  },
  {
    version: '6.46.0', date: '2026-11-02', engineVersion: '6.37.0',
    title: 'Without an account, plans open in the planner; pay in by share of pay',
    summary: 'If you are trying the app without an account, a plan you made now opens straight in the planner instead of the sign-in page. You can also give pay-ins as a percentage of your pay, and we fixed “Pay in more”, which dropped your employer’s part from the plan you kept.',
    changes: [
      'Without an account, “Am I on course?”, “Record this month” and the other buttons that hand over to the planner now open your plan there directly, with no landing page and no sign-in.',
      'In “When can I afford to stop work?”, “Am I saving enough?” and “I’ve got about…”, you can give what goes in as a share of pay: your yearly pay before tax, and your part and your employer’s as percentages. What that comes to in pounds is shown under the boxes.'
    ],
    corrections: [
      '“Pay in more”, “+ £50”, “− £50” and the stop-age table wrote your pay-in as one total, so a plan you kept could show nothing from your employer. Your employer’s part is now kept as you typed it.',
      'On Safari, iPhone and iPad, the planner and the preview contacted Google’s sign-in service as soon as a page opened, even if you never signed in with Google. It now does so only when you press “Sign in with Google”.',
      'A slow reply from the sign-in service could swap a plan opened without an account for the sign-in screen. That no longer happens.',
      'Pay-ins typed in pence are now added up exactly to the penny.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [
        'Plans already saved are unchanged; a plan kept from a share of pay starts the saver’s page with both parts in pounds and your pay as the salary.'
      ],
      budget: [],
      household: []
    },
    actions: [
      'If you kept a plan after using “Pay in more”, “+ £50” or the table on a pay-in entered in two parts, open “What you pay in” and check your employer’s part. If it shows nothing, type both parts again and save.'
    ],
    notes: [
      'Without an account, a plan still lives only in this browser window until you close it.'
    ]
  },
  {
    version: '6.45.0', date: '2026-10-27', engineVersion: '6.37.0',
    title: 'The preview gains your budget, pay-ins, year-by-year tables and historical crashes',
    summary: 'The new-look pages (preview) can now do nearly everything the planner does: edit your budget and what you pay in, see your plan year by year, and replay history’s worst decades against your plan. We also fixed the figures shown for couples who stop work in different years.',
    changes: [
      '“What you spend”: your full budget, line by line, against the national guide levels, with typical amounts, one-off costs, who pays on a shared budget, spreadsheet download and upload, and Undo on every change.',
      '“What you pay in”: what you and your employer pay, how tax relief works, what your pot could be when you stop, and “Record this month’s pot”.',
      '“About you and when”: a draft plan whose start year has passed offers “Update it to start in this tax year” or “Leave it”.',
      '“Money that comes in anyway”: enter the State Pension start date from your forecast letter, and see where each lump sum will land (pension, ISA or a taxable account).',
      '“Turn a lump sum into income” shows what each lump sum you expect could pay each year, and can add it to your income steps.',
      '“Does it last?”: the market crashes of 1929, 1973, 2000 and 2008 replayed on your plan, the years one by one, and (for Pots & Valves) the least each pot is meant to hold year by year.',
      '“Assumptions and data”, linked from every page, explains where every figure comes from.',
      'The plan page links to your records by tax year, the spreadsheets and the printed documents. Recording months and setting up a tax year stay in the planner.'
    ],
    corrections: [
      'A gilt entered by its code in “What you hold” was left out of your mix; it now counts as bonds.',
      'For a couple who stop work in different years, once one person’s money had run out and the other had none, later years still showed spending paid from empty pots. Those years now show only the State Pension and any final-salary pension; the verdict was already right.',
      '“Am I saving enough?”, stopping before your pension can be opened: in rare futures with very large spending, the savings needed for the years before it were overstated. They now cover just those years.',
      'A plan for someone already retired no longer shows a projected pot at the stop age.'
    ],
    effects: {
      stress: [
        'A State Pension date typed in the preview is saved as a full date; a date saved earlier as words stays until you type a new one.'
      ],
      strategies: [],
      decision: [
        'A State Pension date typed in the preview also updates the Decision tool’s own copy, where it has one; a locked plan is never changed.'
      ],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'The budget’s guided walk-through and “Reset to Defaults” stay in the planner only. In the preview every change has Undo, and a fresh start is a new plan.'
    ]
  },
  {
    version: '6.44.0', date: '2026-10-27', engineVersion: '6.37.0',
    title: 'The preview gets a plan menu, an account page and a name: Drawdown Planner',
    summary: 'In the new-look pages (preview), now called Drawdown Planner, you can rename, copy, download, open and delete plans, and manage your account, without going back to the planner. Without an account you get the same three free hours as in the planner, and What’s new appears there too.',
    changes: [
      '“Your plans”: a menu on each plan to rename it, make a copy (a copy made with its monthly records, or of a plan with a tax year set up, is locked from the start, as in the planner), make it your main plan, download it to your computer, or delete it after a confirm. Your last plan can never be deleted.',
      '“Open a downloaded copy” brings a plan file back in as a new plan; a file that is not a valid plan is refused with the reason.',
      '“Your account”: see your email, get a password-reset email, download everything you hold with us in one file, or delete your account after two confirms. Signed out, it offers sign-in, sign-up (with Google too) and a forgotten-password form.',
      'Without an account: the planner’s three free hours and its reminders, and a read-only example plan to look around. After you sign in, you are offered to bring the plans you built into your account.',
      'What’s new pops up once after sign-in when there are releases you have not seen, and is linked from the foot of every page.'
    ],
    corrections: [
      'Keeping your work after trying without an account also copied the read-only example plan into your new account. Only your own plans are copied now.',
      'Duplicating the example plan made another read-only example. A copy is now your own plan, which you can change.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'Deleting every plan at once (Reset) stays in the planner. In the preview, delete plans one by one, or delete the account.'
    ]
  },
  {
    version: '6.43.0', date: '2026-10-21', engineVersion: '6.37.0',
    title: 'The preview records what you hold and guides the move to your plan’s mix',
    summary: 'The new-look pages (preview) now let you record what you actually hold, account by account, by typing it or pasting from your platform. For a locked plan, “Moving to your plan’s mix” lists what to buy and sell and when, with a tick for each step done. Nothing here places an order.',
    changes: [
      '“What you hold”: your holdings by account (pension, ISA, other account, cash), typed or pasted from your platform. A line it cannot recognise asks “What is this?”, and holdings missing from a paste are listed for you to remove; nothing is removed by itself. Every change has Undo, and works on a locked plan too.',
      '“What you hold” shows your mix as shares, bonds, gold and trend funds and cash, with the overall yearly charge.',
      '“Moving to your plan’s mix”, for a locked plan: the cash to hold now, what to buy and sell with a Done tick each, what is already held, and a schedule by month. It also shows what skipping the move might cost.',
      'If you are more than five years from stopping work, it shows only where new money goes, and when the move itself should start.',
      'Gilt ladder plans: the order sheet from your plan document, with what each gilt pays and whether it is bought. If the plan assumed a State Pension figure, units and costs are held back until you enter your own forecast and lock the plan again.',
      'Gilt ladder + rotation plans: the rotation watch, the market against its trigger, and the sell ticket when the trigger is live; the switch itself is made in the planner.'
    ],
    corrections: [],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'What you hold is kept separate from the mix your plan is tested on; nothing is copied either way.'
    ]
  },
  {
    version: '6.42.0', date: '2026-10-21', engineVersion: '6.37.0',
    title: 'The preview checks a couple’s plans together, with survivor, care and budget questions',
    summary: 'The new-look pages (preview) now include “Your household”: link your partner’s plan, then check whether your money lasts for both of you, who should draw what to save tax, and what happens if one of you dies first or needs care. It all works without an account.',
    changes: [
      'Link or unlink a partner’s plan from the plans you have.',
      '“Check the two plans together” tests both plans on the same markets and pools them, so the household falls short only when both have run out. Each plan on its own is shown beneath, with the years behind “Show the years”.',
      '“Who draws what” shows in pounds what drawing together saves in tax and what it costs the smaller pot, with an optional limit on the smaller pot. “Use this split” updates both plans, with Undo; for a locked plan it makes linked copies instead.',
      '“If one of you dies first” and “If one of you needs care” are asked in ages, and change nothing in your plans.',
      '“One budget for the household” lets you share one budget between your two plans or keep them separate, and “Who pays what” marks each line as yours, your partner’s or shared.'
    ],
    corrections: [
      'The Household tab read the partner’s plan without bringing its age up to date, so a partner whose age on the Budget page was newer was checked at the wrong age. Both plans are now read the same way.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: [
        'A partner whose age on the Budget page is newer than in their settings is now checked at that age; nothing else changes.'
      ]
    },
    actions: [
      'None.'
    ],
    notes: [
      'Without an account, “Make copies” cannot run, because a browser window holds three plans at most.'
    ]
  },
  {
    version: '6.41.0', date: '2026-10-21', engineVersion: '6.37.0',
    title: 'The preview lets you set your pension’s mix and try changes to your plan',
    summary: 'In the new-look pages (preview) you can now choose how your pension is invested, compare mixes to see which lasts best, and try a change to your plan before deciding to keep it. We also fixed the planner’s “Try a strategy”, which missed some of the differences it tested.',
    changes: [
      '“The mix”, for Pots & Valves and Buckets in order: choose a risk level, your own percentages, or a list of funds typed or pasted from your platform.',
      'See what a slice of gold and trend funds, or the bond tent, does to your plan in a bad case.',
      '“Which mix lasts best?” compares your mix and the three risk levels, each with and without the bond tent; “Use this mix” saves the one you pick, with Undo.',
      '“Does it last?” gains “Try a change of your own”: change the way money is taken, the pot, the ISA, the income, the years or the cuts in a slump, see what is different, then “Use this” or “Keep as a separate plan”.',
      'The income picture on “What you spend” now shows the income you get anyway, your budget total, and lump sums and one-off costs at their years.'
    ],
    corrections: [
      'The planner’s “Try a strategy” left the ISA policy, the depth of cuts and how long cuts last out of its list of what was different. All are now listed.',
      'The planner’s “Try a strategy” started its pot box from the three pots added up rather than the pension total the plan uses, so it could test a different pot. It now starts at the plan’s own figure.',
      '“Try a strategy” now reports a change to cuts for Buckets in order too, and a different flat income for a plan that is already flat.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'Funds you search for or paste are read on the page only; nothing you paste leaves it.'
    ]
  },
  {
    version: '6.40.0', date: '2026-10-21', engineVersion: '6.37.0',
    title: 'The preview shows all nine ways of drawing on your plan, and can switch',
    summary: 'The new-look pages (preview) now run your saved plan through all nine ways of drawing money from it and show each in plain words: how many futures out of 10 it lasts, what is typically left, and a bad case. You can try each way’s settings and switch your plan to another way, with Undo.',
    changes: [
      '“How the money is taken” on a saved plan in the preview runs all nine ways of drawing through the same test the planner uses. Your plan’s own way comes first; the others are ranked by how many futures out of 10 they last.',
      'Each card says what that way promises, how often it lasts, what is typically left at the end and in a bad case (the worst 1 in 10), and, for a way that buys its income, what that costs of your pot today.',
      'Open a card to see and change its settings, the same ones the planner shows; the card runs again on your plan. Nothing is saved unless you switch.',
      '“Use this way of drawing” switches your plan exactly as the planner’s own switch does, after a confirm and with Undo. Your pots, income and mix do not change, and the old way’s settings are kept in case you go back to it.',
      '“More columns” shows the planner’s other comparison figures (worst 12 months, years covered, the score and more), and the table can be ranked by them.',
      'On a locked plan every card runs but nothing can be switched; an opened card sets its result beside your locked plan’s in one line.',
      'In the preview, “Your plan” now opens “How the money is taken” in the preview instead of sending you to the planner.'
    ],
    corrections: [
      'Gilt ladder + rotation: its strategy page started “Cash years first” at 3, while everywhere else it starts at 2; it now starts at 2.',
      'Gilt ladder + rotation: “Use this strategy” on its page did not keep every setting you had changed, and the page’s own what-if ignored the rotation settings. Both now use all of them.',
      'Floor & Flex: the planner offered different ranges and starting values in different places for what the rest pays out and for the age bills are paid to. The preview uses the full 1–10% range and, when nothing is saved, your plan’s end age.'
    ],
    effects: {
      stress: [
        'A plan switched in the preview reads in the planner exactly as one switched there.'
      ],
      strategies: [
        'No figures change. The Gilt ladder + rotation page’s what-if now uses its rotation settings.'
      ],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'The preview prices a gilt ladder on a built-in yield curve rather than the day’s live prices, so a ladder’s cost can differ slightly from the planner’s. The card says so.',
      'Opening the page runs nine tests, about five seconds on a laptop; the result is kept, so a second visit is quick.'
    ]
  },
  {
    version: '6.39.0', date: '2026-10-21', engineVersion: '6.37.0',
    title: '“Will it last?” for people already retired, and preview answers kept as plans',
    summary: 'If you have already stopped work, the new-look pages (preview) now answer “Will it last? Could I spend more?” from one short form. You can try some paid work, or shares falling by a fifth, on the answer and on any saved plan. Any answer can now be kept as a plan straight from the preview.',
    changes: [
      '“I’m retired. Will it last?”: one short form (your age, what is left in your pensions, whether you have taken the tax-free part, your savings, what you take a month, and a partner who has also stopped) gives a verdict at what you take and how much more or less you could spend.',
      'Two levers try a change on the same futures without leaving the answer: “Would some work help?” (pay for one to five years) and “What if shares fell by a fifth?”. Each can be taken away again.',
      '“Does it last?” on a saved plan gains “Try a change”: the same levers plus “Could I spend more?”, run on a copy of your plan. Nothing is saved.',
      '“Keep this as a plan” now makes the plan in the preview itself, in your account or, without an account, in this browser window, then offers to lock it. A couple’s answer becomes two linked plans.',
      'If you already have a plan, “Will it last?” first offers to test that plan.'
    ],
    corrections: [
      'The retired view of “When can I afford to stop work?” and “Am I saving enough?” led to a page that was “not in the preview yet”; it now opens “Will it last?”.'
    ],
    effects: {
      stress: [
        'None. A plan kept from the preview is set up exactly as one the planner makes from the same answer.'
      ],
      strategies: [],
      decision: [
        'None. A plan kept from the preview starts unlocked.'
      ],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'If you say you have taken some of the tax-free part, it is counted as all taken, the cautious side.'
    ]
  },
  {
    version: '6.38.0', date: '2026-10-21', engineVersion: '6.37.0',
    title: 'You can lock and unlock a plan in the preview',
    summary: 'The new-look pages (preview) can now lock a plan, after saying in plain words what the lock fixes and what you can still change. A locked plan opens on a short summary of its plan document, and “Where you are” sets what you have taken against what the plan said. Unlocking keeps the old document as a past version.',
    changes: [
      '“Lock the plan” is now a step of every unlocked plan in the preview. It says what the lock fixes, what you can still change (monthly records, holdings, the budget, how often you draw, what you pay in) and what you get, then locks after a confirm, with Undo. It is the same lock as the planner’s.',
      '“Your plan as locked” opens on plain sentences from the plan document: the income at each age before and after tax, the State Pension, the bad case and what is typically left, and the rules for cutting income.',
      'Unlocking is offered there only, with a confirm that says what is kept; the plan document is kept as a past version. You can also write a new version of the document from today’s settings.',
      '“Where you are” on a retired plan compares what was taken with what the plan said for those months, and says if income was cut.',
      'Without an account, locking works on this browser window’s plans, as the other editing steps do.',
      'In the planner, a plan locked in the preview says so on its lock banner.'
    ],
    corrections: [
      'In the preview, a locked plan’s pages said only the planner could unlock it; they now point to the unlock on “Your plan as locked” and say your records stay.'
    ],
    effects: {
      stress: [
        'A plan locked in the preview reads in the planner exactly as one locked there.'
      ],
      strategies: [],
      decision: [
        'A plan locked in the preview is ready for monthly records, as one locked in the planner is. Plans already locked are unchanged.'
      ],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'When locking, the preview prices a gilt ladder on a built-in yield curve; the planner uses the day’s live prices when it has them. The plan document says which was used.'
    ]
  },
  {
    version: '6.37.0', date: '2026-10-20', engineVersion: '6.37.0',
    title: 'Gilt ladder + rotation: money left over, kept or invested, pays before a cut',
    summary: 'On the gilt ladder + rotation, money left over after buying the ladder now pays any year the rotation cannot, kept or invested, and a year counts as cut only once it is spent. Before, kept money was never used, so a plan could show cuts with money untouched. The couples check also now sees cuts on Floor & Flex and Floor to an age.',
    changes: [
      'Gilt ladder + rotation with money left over “Kept”: a rotated year the rotation’s share fund cannot pay is paid from that money first, before it counts as cut. The chance of a cut can fall a lot; what is left in a bad case is lower, because the money is spent.',
      'Kept or invested, the money is now drawn the same way, so comparing the two shows only what being in shares adds or costs. In a crash, kept money can cover more.',
      'The setting’s help, the strategy page and plan documents locked from now on say so; a document locked earlier reads as it was locked.'
    ],
    corrections: [
      'Household couples check (“if one plan falls short, can the other carry it?”): a Floor & Flex plan in a lean year, or a Floor to an age plan cut to a smaller income, was read as never cut, so nearly every such future counted as carried. Each future now says when the plan was first cut and how much it left unpaid, and the other plan is asked to cover that, with a quarter added for tax.',
      'Household couples check: Pots & Valves, Buckets in order and, in some months, Ladder & Ratchet were read as running out a year late; they now read the year it happened.'
    ],
    effects: {
      stress: [
        'Gilt ladder + rotation with money left over kept: the chance of a cut is lower, often much lower, and what is left in a bad case is lower. With it in shares: unchanged.'
      ],
      strategies: [
        'Gilt ladder + rotation as above; other strategies unchanged.'
      ],
      decision: [
        'None. Locked plans and their documents are unchanged.'
      ],
      accumulation: [],
      budget: [],
      household: [
        'The chance the household is covered can be lower where one plan is Floor & Flex or Floor to an age, a little lower with Pots & Valves, Buckets in order or Ladder & Ratchet, and higher with a gilt ladder + rotation.'
      ]
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.36.0', date: '2026-10-20', engineVersion: '6.36.0',
    title: 'Gilt ladder + rotation: money left in shares pays a year before a cut',
    summary: 'With “Money left over” set to “Invested in shares”, the gilt ladder + rotation now uses that money to pay a year the rotation cannot, before counting the year as cut, so the chance of a cut can be much lower. We also fixed several slips in how the rotation was counted, and in the couples check.',
    changes: [
      'Gilt ladder + rotation, “Invested in shares”: a rotated year the rotation’s share fund cannot pay is paid from the money left over first. Every page that shows the chance of a cut counts this; what is left in a bad case is lower because the money is spent. Kept money is still not drawn.',
      'The setting’s help, the strategy page and plan documents locked with it say so.'
    ],
    corrections: [
      'Gilt ladder + rotation drew one year more than the plan lasts and could count that extra year as cut; it now stops when the plan ends, so the chance of a cut is a little lower.',
      'Gilt ladder + rotation counted what it held after a rotation a year ahead of the gilts beside it. Both are now counted at the start of each year: the range of what is left mid-plan is narrower, and the end figures can move either way.',
      'Gilt ladder + rotation: where a gilt covering the years either side of the cut age was kept, the rotation also paid its later year and could count it as cut; it now pays only years whose gilts it sold. Plans at the default cut age were not affected.',
      'Household couples check: a gilt ladder + rotation that was cut was read as never cut, so every cut future counted as carried by the other plan. The other plan now has to cover the need from the year it was first cut.',
      'Stress tester and Strategies, with “Invested in shares”: the note on what a gilt ladder is bought from said the money left over was not grown and had no charges; it now says it is in shares and charged.',
      'Household → add a plan: the example name in the box is now a made-up one.'
    ],
    effects: {
      stress: [
        'Gilt ladder + rotation: the chance of a cut is a little lower (much lower with money left over in shares), and the range of what is left reads at the start of each year.'
      ],
      strategies: [
        'Gilt ladder + rotation as above; other strategies unchanged.'
      ],
      decision: [
        'None. Locked plans and their documents are unchanged.'
      ],
      accumulation: [],
      budget: [],
      household: [
        'With a gilt ladder + rotation plan, the chance the other plan carries it can be lower.'
      ]
    },
    actions: [
      'None.'
    ],
    notes: [
      'Money left over that is kept is still never drawn for a rotated year, so with “Kept” the chance of a cut leaves it out.'
    ]
  },
  {
    version: '6.35.0', date: '2026-10-20', engineVersion: '6.35.0',
    title: 'A gilt ladder’s money left over can now be invested in shares',
    summary: 'The full gilt ladder and the gilt ladder + rotation kept any money left over after buying the ladder at its value. A new setting can put it in shares instead, charged and tested like your other funds. Your income and the chance the plan lasts do not change; what you might have left moves with markets.',
    changes: [
      'Stress tester → Settings, for the full gilt ladder and the gilt ladder + rotation: “Money left over”, either “Kept, holding its value” (as before) or “Invested in shares”. It is saved with the plan.',
      'With it on, the strategy page, “Will it last?” and the charts show what would be left in a bad, a typical and a good case. A plan locked with it asks for that money’s value each month.',
      'Household couples check: when a gilt ladder is asked to draw less, the money that frees joins the money left over, in shares or kept, as the plan is set.'
    ],
    corrections: [
      'Household couples check: the note called every plan that buys its income “a gilt ladder”; it now describes floors, gilts held to the State Pension, and plans that buy only part of their income correctly.',
      'History said every strategy’s real starts were two months apart; only Pots & Valves and Buckets in order are, and it now says which.'
    ],
    effects: {
      stress: [
        'None unless you choose “Invested in shares”.'
      ],
      strategies: [
        'None unless you choose “Invested in shares”.'
      ],
      decision: [
        'None for plans already locked.'
      ],
      accumulation: [],
      budget: [],
      household: [
        'The couples note is reworded; with the setting on, freed money grows in shares.'
      ]
    },
    actions: [
      'If you hold, or mean to hold, your gilt ladder’s spare money in shares, choose “Invested in shares” under Money left over and save.'
    ],
    notes: [
      'The money left over is never drawn for income, so the chance of a cut does not count on it.'
    ]
  },
  {
    version: '6.34.0', date: '2026-10-20', engineVersion: '6.34.0',
    title: 'Gilt ladders: what is left is counted correctly, and “cut” replaces “ran out”',
    summary: 'The gilt ladder + rotation counted some gilts twice, so its money left at the end was often far too high, and both gilt ladders valued unrepaid gilts too low in the middle years. We fixed both, and pages now say “cut” for strategies that cut rather than run out. Your income and chance of lasting are unchanged.',
    changes: [],
    corrections: [
      'Gilt ladder + rotation: where the rotation never happened, gilts it would have sold were still counted after they had paid out, so what is left in later years and at the end was too high, often by a lot. It now holds exactly what the full ladder holds.',
      'Full gilt ladder and gilt ladder + rotation: gilts not yet repaid were valued at what they cost; they now rise towards what they repay, so what is left in the middle years is higher. The full ladder’s end figure is unchanged.',
      'Floor to an age, Gilt ladder + rotation, Floor & Flex and History said a plan “ran out” when it was cut instead; they now say “cut” (or “a lean year” for Floor & Flex). Household now says “one plan falls short” rather than “one pot ran out”.',
      'Household’s “What you’d have left, combined” left out an ISA held aside by a plan that buys its income; it now includes it.',
      'Stress tester → Settings with the ISA on hold described what Pots & Valves does with a held ISA, even for strategies that never draw it; the note now matches your plan’s strategy.',
      'Where you are, on a gilt ladder: plans locked from now on count gilts as held until they repay, and the note says so. There is still no ahead-or-behind verdict, because your records are at market prices.'
    ],
    effects: {
      stress: [
        'Gilt ladder + rotation: what is left in later years and at the end is lower, sometimes much lower. Full gilt ladder: higher in the middle years, the same at the end. Income and chance of lasting unchanged; other strategies: wording only.'
      ],
      strategies: [
        'As in the Stress tester; the ranking by chance of lasting is unchanged.'
      ],
      decision: [
        'Wording only on Where you are; locked plans keep their documents and figures.'
      ],
      accumulation: [],
      budget: [],
      household: [
        'With a gilt-ladder plan, the survivor check and combined figures move as above and now include an ISA held aside; with a gilt ladder + rotation the household verdict can be lower.'
      ]
    },
    actions: [
      'None.'
    ],
    notes: [
      'An unrepaid gilt is valued as if interest rates stay as they were when it was bought, not at today’s market price, and the figures err a little low.'
    ]
  },
  {
    version: '6.33.0', date: '2026-10-20', engineVersion: '6.22.0',
    title: 'Percentages no longer round a near miss up to 100% or 90%',
    summary: 'A plan covering 99.8% of its years beside income cuts said “100%”, and one lasting in 89.6% of futures said “90%” beside “not on course yet”. Figures near 0%, 100% or the 9-in-10 line now keep the decimal that tells the truth. Pages also always name the strategy that was actually tested.',
    changes: [],
    corrections: [
      '“Will it last?”, strategy pages, the Strategies ranking, Household and “When could I retire?” rounded a figure near 100%, 0% or just under 9 in 10 across the line; they now show the decimal.',
      '“When could I retire?” checked each age’s rounded chance against your bar, so an age just under it could be named on course; it now checks the exact figure, and names the strategy rather than an internal code.',
      'Stress tester → Compare allocations could say “10.0 futures out of 10” for a mix that failed in a few; it now says 9.9.',
      'Household now says “more than 9 futures out of 10” or “just under 9 futures out of 10” instead of rounding.',
      'A plan could hold two saved copies of its strategy that disagreed, so a page could name one strategy above figures for another. Pages and Monthly Entry now always use the strategy that is tested.'
    ],
    effects: {
      stress: [
        'Wording only: the same figures, without rounding to 100% or 0%.'
      ],
      strategies: [
        'Wording only: the same figures, without rounding to 100%, 0% or across 9 in 10.'
      ],
      decision: [
        'Only on a plan whose two saved copies of the strategy disagreed: Monthly Entry now follows the strategy that is tested. Plans switched since version 6.13 are unchanged.'
      ],
      accumulation: [
        '“When could I retire?” may name a later age as the first on course.'
      ],
      budget: [],
      household: [
        'Wording only: shares of futures are said in words, without rounding across 9 in 10.'
      ]
    },
    actions: [
      'None.'
    ],
    notes: [
      'Figures not near 0%, 100% or the 9-in-10 line are still rounded to a whole percent.'
    ]
  },
  {
    version: '6.32.0', date: '2026-10-18', engineVersion: '6.22.0',
    title: 'Household survivor and care checks now test each plan on its own strategy',
    summary: 'On the Household tab, “What if one of you dies?” and “What if one of you needs care?” tested every plan as a growth portfolio, even a gilt ladder, and the survivor check overstated what is inherited. Both now run each plan through its own strategy’s test and give results in today’s money. If you ran them before, run them again.',
    changes: [
      'Survivor check: what is inherited is what the other plan has left that year in its own test, in a middling and a bad case, in today’s money. The survivor’s plan is then tested with each and said as “lasts in N futures out of 10”.',
      'Survivor check: the survivor’s spending is the share you choose of what you both spend after tax, taxed again on one person’s bands.',
      'Care check: the care cost is entered per year, after tax, in today’s money and added to that person’s plan; the household verdict, with and without care, comes first.',
      'History and Scenarios now replay named start years for the gilt ladder + rotation.',
      'The year boxes now read “Years from now”.'
    ],
    corrections: [
      'Survivor and care checks tested gilt ladders, floors and gilts held to the State Pension as growth portfolios; each plan now runs on its own strategy. On a gilt-ladder plan, the inheritance shown was often about double what the plan leaves.',
      'Survivor check: the inheritance mixed figures from different futures and was shown in future pounds beside spending in today’s money; it is now the middle and worst 1 in 10 of what the plan leaves, in today’s money. The survivor’s spending was a share of both plans’ before-tax figures; it is now a share of what you both have after tax, taxed again as one person.',
      'Care check: the cost was added before tax, although care fees are paid from taxed money, and only futures where both pots lasted on their own counted. The cost is now grossed up and the household verdict comes first.',
      'Monthly Entry showed the rotation watch on plans that had not chosen the gilt ladder + rotation, and Stress tester → Drawdown and Glidepath showed fund schedules on plans that never use them. Both now show only where they apply.',
      'The plan document’s header no longer counts an ISA held aside as buying gilts, and its timing sentence says it was written at the lock.',
      'Monthly Entry and History now label the after-tax income as after tax, and Transition says which of its two month counts is which.'
    ],
    effects: {
      stress: [
        'Wording and which pages show only; gilt ladder + rotation plans gain start-year replays on History and Scenarios.'
      ],
      strategies: [],
      decision: [
        'Monthly Entry no longer shows the rotation watch on a plan that did not choose it.'
      ],
      accumulation: [],
      budget: [],
      household: [
        'The survivor and care checks give different figures: lower inheritances on gilt-ladder, floor and gilts-to-State-Pension plans (often about half), all in today’s money. Both are what-ifs and never change a plan.'
      ]
    },
    actions: [
      'If you ran the survivor or care check before, run it again: the earlier figures came from a different model.'
    ],
    notes: [
      'The checks simplify: pensions are inherited tax-free (death before 75), the ISA passes as an ISA, gilts still held count at what they cost, the bad case is set cautiously, and care fees are added in full with no means-testing.'
    ]
  },
  {
    version: '6.31.1', date: '2026-10-18', engineVersion: '6.22.0',
    title: 'Gilt-ladder plans now say correctly what the ladder is bought from',
    summary: 'On gilt-ladder plans, the line above Will it last?, History and Scenarios described a growth portfolio split into shares, bonds and cash. It now says what the ladder test actually does. No figures change.',
    changes: [],
    corrections: [
      'The line now says the ladder is bought from one total (your pension, plus your ISA unless it is held back), that the shares, bonds and cash split does not apply, that money left over is held at its value, and that charges come off the cash years and any share fund, never the gilts.'
    ],
    effects: {
      stress: [
        'Wording only: no figure changes.'
      ],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.31.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: '“Does it last?” now runs in the preview, with your spending-cut settings',
    summary: 'The new-look pages (preview) can now test a saved plan. “Does it last?” runs the same test as the planner, with the same figures, said plainly: how many futures out of 10 it lasts, what is typically left, a bad case and any income cuts. You can change the spending-cut and reserve settings there, with Undo.',
    changes: [
      '“Does it last?” (Your plan → “Does it last?”) runs your plan through every real stretch of markets since 1871 and 1,000 possible futures, as the planner does, and shows how often it lasts, what is left in a typical, bad and good case, and how often and how far income is cut.',
      '“What if you had retired into a bad year?” replays your plan from the five hardest real starts and six famous bad years (1929, 1937, 1966, 1973, 2000 and 2008).',
      'Below the result you can change the spending cuts in a slump and the emergency reserve, with Save, Cancel and Undo; the test then runs again. Strategies that buy their income say these settings are not used.',
      'A locked plan is never changed: it shows the figure it was locked with and today’s test beside it.',
      'Couples: each partner’s plan is tested on its own; the two together stay on the planner’s Household page.',
      'Without an account, plans in this browser window can be tested and changed the same way while the free time lasts.'
    ],
    corrections: [],
    effects: {
      stress: [
        'None until you press Save on “Does it last?”, which saves only the spending-cut and reserve settings.'
      ],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'The test takes about half a second on a laptop and a few seconds on a phone.',
      'The preview prices a gilt ladder on a built-in yield curve rather than the day’s live prices, so its cost can differ slightly from the planner’s; the page says so.'
    ]
  },
  {
    version: '6.30.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'You can change your pots and tax settings in the preview',
    summary: 'The new-look pages (preview) now let you change your pots and tax: your pension today and at the day you stop, ISAs and savings, an ordinary account, charges, tax thresholds and how you take the tax-free part. Each box shows the saved value and where it came from, and a save matches the planner’s, with Undo.',
    changes: [
      '“Your pots and tax” (Your plan → “Pots” → “Change this here”) asks once, in plain English, for your pension today and, if you are still working, what you expect at the day you stop; your ISAs and savings and how they grow and are used; an ordinary account; charges; the tax thresholds and whether they rise; and how you take your tax-free part.',
      'Under the boxes it shows what this works out to: your pots and their split, the pots at the day you stop, what the charges come off and how each draw is taxed.',
      'A setting your way of drawing does not use says so under its box.',
      'Save, Cancel, and Undo for fifteen seconds after a save. A save changes only these settings, and your pension’s split between shares, bonds and cash is kept.',
      'Couples: your partner’s pots and tax are on their own plan, linked from the page.',
      'A locked plan is shown read-only. Without an account, plans in this browser window can be changed the same way while the free time lasts.'
    ],
    corrections: [
      'The plan page’s reminder to test again now also notices a changed pension or ISA on a plan made from a preview answer.'
    ],
    effects: {
      stress: [
        'None until you press Save on “Your pots and tax”. A pension total typed there is split in the proportions your plan already has.'
      ],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'A charge typed between the planner’s steps of 0.05% is rounded to the nearest step, as the planner does.'
    ]
  },
  {
    version: '6.29.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'You can now change what you spend from the new-look pages (preview)',
    summary: 'The new-look pages (preview) can now change what you spend: your monthly spending after tax, how it changes as you get older, and one-off costs by age. A save writes the same settings as the planner’s income shape, with Undo, and a locked plan is never changed.',
    changes: [
      '“What you spend” (Your plan → “Change this here”) asks what you spend a month after tax at the start, then any number of later steps by age, each staying level, falling by a percentage a year or moving evenly to the next. The before-tax figure the plan saves is shown under each amount.',
      '“Suggest go-go, go-slow and no-go years” fills in the same steps as the planner’s own suggestion, never below your budget’s essentials.',
      'One-off costs by age: what it is, the amount a year after tax, the age, for how many years, and whether it rises with prices.',
      'A chart shows every year’s spending with your State Pension and other pensions marked, and “Show each year” opens a table.',
      'Your budget sits beside the boxes as a guide, with a one-tap “Use £X a month at the start”. The plan runs on the figures in the boxes, not on the budget.',
      'Save, Cancel, and Undo for fifteen seconds after a save. A locked plan’s spending is shown read-only, and a partner’s spending is changed on their own plan.'
    ],
    corrections: [
      'The plan page’s line saying its “will it last” answer is out of date now also notices a changed starting spend on plans made from a preview answer.'
    ],
    effects: {
      stress: [
        'Nothing changes until you save “What you spend”; a save changes only your spending steps and one-off costs, as the planner’s own Save would.'
      ],
      strategies: [],
      decision: [
        'On an unlocked plan, a save keeps the Decision tool’s starting spend and year-by-year schedule in step, as the planner does.'
      ],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'On a Floor & Flex plan, the essentials it buys as a floor are still set in the planner; the page says so.'
    ]
  },
  {
    version: '6.28.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'You can now change your State Pension and other income from the new-look pages',
    summary: 'The new-look pages (preview) can now change the money that comes in anyway: your State Pension, final-salary pensions, other income, income for some years and lump sums you expect. Everything is asked by age and before tax, a save writes the same settings as the planner with Undo, and a locked plan is never changed.',
    changes: [
      '“Money that comes in anyway” (Your plan → “Change this here”): your State Pension as the full amount, your forecast in pounds a week, or none; final-salary pensions with the amount, the age they start and how they rise; other income; income for some years by start and end age; and lump sums by age.',
      'Under the boxes it says what your answers work out to, such as the age and tax year your State Pension starts.',
      'A plan with no State Pension figure says what the planner assumes, and lets you leave it as assumed until you choose.',
      'Where it applies, a note says to move into drawdown what you will need before 57 by 5 April 2028, when the minimum pension age rises.',
      'Your plan’s page now shows “Pots” and “Money that comes in anyway” separately, the second listing income for some years and lump sums too.',
      'Save, Cancel, and Undo for fifteen seconds after a save. A locked plan is shown read-only, and a partner’s income is changed on their own plan.'
    ],
    corrections: [
      'The plan page’s line saying its “will it last” answer is out of date now also notices a changed State Pension or final-salary pension on plans made from a preview answer.'
    ],
    effects: {
      stress: [
        'Nothing changes until you save; a save changes only these income settings. A second or third final-salary pension is kept in the planner’s “Income streams” list as income for the rest of the plan.'
      ],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'Where a cash lump sum goes (an ISA, the pension or an ordinary account) is still set in the planner; the new-look pages keep it as saved.'
    ]
  },
  {
    version: '6.27.1', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'Moving quickly between preview pages no longer sends you back',
    summary: 'On a slow connection, moving to another of the new-look pages (preview) just after landing on an unknown address could send you back to the “could not find that page” screen. We fixed it; no plan or figure was affected.',
    changes: [],
    corrections: [
      'A quick move between pages could be overwritten by the page you were leaving; the page you asked for now stays.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.27.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'You can now change your ages and plan dates from the new-look pages',
    summary: 'The new-look pages (preview) can now change “About you and when”: your age, when you stop or stopped work, when the plan’s income starts and the age to plan to. A save writes the same settings as the planner’s Timing block, with Undo, and the plan page then offers to check that your plan still lasts.',
    changes: [
      '“About you and when” (Your plan → “Change this here”): your age, whether you have stopped work or the age or month you will, when income starts if you have stopped, and the age to plan to, with a suggestion from how long people live.',
      'Under the boxes it says what your answers work out to: the month you stop, the plan’s first tax year and how long the plan runs.',
      'After a change, here or in the planner, the plan page says your “will it last” answer is older than the plan and offers to check it again.',
      '“Add your age” and “Update it” on the plan page now open this step instead of the planner.',
      'Save, Cancel, and Undo for fifteen seconds after a save. A locked plan is read-only, including one locked from another device, and a partner’s ages are changed on their own plan.'
    ],
    corrections: [
      '“Your plan” gave the age the plan runs to as one year too old; it now matches the planner’s Timing block.'
    ],
    effects: {
      stress: [
        'Nothing changes until you save; a save changes only these timing settings.'
      ],
      strategies: [],
      decision: [
        'A save keeps the Decision tool’s first tax year in step, as the planner does.'
      ],
      accumulation: [],
      budget: [
        'A save keeps the budget’s copy of your ages in step.'
      ],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.26.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The new-look pages now show your saved plans, read-only',
    summary: 'Signed in on this device, the new-look pages (preview) now open the plans you saved in the planner. Each plan shows the steps for its stage of life, with every figure, where it came from and its date. Nothing can be changed there yet: “Change this” opens the planner in the right place.',
    changes: [
      '“Your plans”, in the header of every page, lists your household’s plans and your other plans, each with a line on its stage. Without an account, it shows the plans this window keeps.',
      'Each plan opens on the steps that fit its stage (saving, locked while still working, or retired), and every figure says where it came from and when; a figure over three months old is flagged.',
      'A locked plan is shown as it was locked, with the date.',
      '“Everything else this plan uses” lists every setting changed from the starting values, with “Show every setting” for the rest.',
      '“Change this” opens the planner on the right plan, page and section, with a way back. A partner’s plan opened this way opens in that window only.'
    ],
    corrections: [
      'The planner now opens the plan chosen in this window first, then your account’s open plan, so two windows on different plans no longer get mixed up.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'The privacy policy now mentions two small notes kept in this browser window, holding no figures, that remember which plan the window has open.'
    ]
  },
  {
    version: '6.25.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'Couples can now see which split of drawing pays the least tax',
    summary: 'For a couple with two linked plans, the Household tab now works out how to split your drawing so the household pays the least tax, and shows what it saves and what it costs the smaller pot. The household verdict also now lets one pot pay when the other runs out. Nothing changes in either plan until you choose.',
    changes: [
      'Household → “Who draws what”: year by year, the split of your household’s spending that pays the least tax, with the lower-taxed of you using the personal allowance and basic-rate band first. You can set a limit, such as keeping a pot untouched until an age or above an amount.',
      'A headline gives the tax saved each year and until the smaller pot’s State Pension, then a table compares both ways: tax, each pot at later ages, how often the money lasts and what is left at 90. A large saving is also shown at the top of the tab.',
      '“Use this split” writes it into both plans after you confirm, with Undo; for a locked plan you are offered copies with the split instead. “Keep things as they are” hides it until either plan changes.',
      'You can share one budget between your two plans; each keeps its own “who pays” and ages.',
      'The note about drawing before 6 April 2028 shows when one of you is 55 or 56 on that date.'
    ],
    corrections: [
      'The old tax hint understated the saving: it counted basic-rate tax in the first year only and ignored the cost to the smaller pot.',
      '“Both together” counted only futures in which each plan lasted on its own, so one partner’s money never covered the other’s share. The household now runs out only when both pots have.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [
        'A partner’s plan can use a shared household budget; nothing changes unless you share it.'
      ],
      household: [
        'The tab opens with the comparison when it applies, and the couples check’s headline is now the household figure, with each plan’s own figure beneath it.'
      ]
    },
    actions: [
      'Couples: open the Household tab and run the check. Neither plan changes until you choose “Use this split”.'
    ],
    notes: [
      'For gilt-ladder plans, money a gilt pays beyond the lower draw stays as cash in the pension; the tab says so.'
    ]
  },
  {
    version: '6.24.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'Every screen now gives the same answer to “will the money last?”',
    summary: 'Different tabs used to give different chances of a plan lasting, because each ran its own calculation. Now every screen shows one stress run, with your own spending-cuts setting over your plan’s full length, and the bad case always means the worst 1 in 10. No strategy’s arithmetic changed.',
    changes: [
      'Stress tester → “Will it last?” (the first tab) gives the chance of lasting over 1,000 possible futures in plain words, what is typically left in a good and a bad case, and how often, by how much and for how long income was cut.',
      'History replays the hardest real start years since 1871 and well-known bad years one at a time, saying at what age the money ran out or how much income was cut, instead of “FAILED”.',
      'The named historical stresses explain what each bad decade did to shares and prices and what retiring into it would have done to your plan.',
      'The Strategies ranking orders the nine strategies by how many futures in 10 each lasts; other measures are under “More columns”.',
      '“Compare allocations”, “Am I on course?”, Try a strategy and the couples check all use the same stress run. The allocation optimiser and the ranking’s “level footing” switch are gone.',
      'A plan document keeps the figure it was locked with, and says in one line when today’s run gives a different one.'
    ],
    corrections: [
      'One plan could show a different chance of lasting on almost every screen; every screen now shows the same figure.',
      '“The worst case” meant the worst of 1,000 futures on one tab and the worst 1 in 10 elsewhere; it is the worst 1 in 10 everywhere.',
      'History could mark a start year “OK” while income was cut for most of the plan; a cut now says how much and for how long.',
      'The ranking ran Pots & Valves and Buckets in order without their spending cuts, unlike the plan’s own page; it now uses your plan’s setting.'
    ],
    effects: {
      stress: [
        'Your first tab’s figure may move: for a Pots & Valves or Buckets in order plan with cuts on, usually a point or two higher. The per-tab “Simulation years” boxes are gone; your saved settings do not change.'
      ],
      strategies: [
        'Pots & Valves and Buckets in order now run with your cuts setting in the ranking, so they may read higher and the order can change.'
      ],
      decision: [
        'Recorded months do not change, and a locked plan’s document keeps its figure.'
      ],
      accumulation: [
        '“Am I on course?” for a Pots & Valves plan can name a pot a few thousand pounds different.'
      ],
      budget: [],
      household: [
        'The couples check runs both plans through the same stress run, future by future.'
      ]
    },
    actions: [
      'Run “Will it last?” once to see the new figure.',
      'If you used the ranking’s “level footing” view, use Try a strategy with spending cuts off for the same comparison.'
    ],
    notes: [
      'The quick questions on the new-look pages (preview) ask a different question (from today, over your whole life, with no cuts), so their figure can differ from the planner’s.'
    ],
    affects: (scenario) => {
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      if (!s) return [];
      const id = scenario.strategy && scenario.strategy.id;
      if (id === 'pots-and-valves' || id === 'buckets-in-order' || !id) return ['This plan’s “Will it last?” figure now comes from one stress test that uses your spending-cuts setting, so it may differ by a point or two from before. A locked plan’s document keeps its figure.'];
      return [];
    }
  },
  {
    version: '6.23.0', date: '2026-10-17', engineVersion: '6.22.0',
    title: 'The planner now asks before it locks or overwrites, and monthly entry is simpler',
    summary: 'We reviewed the whole planner and fixed the places where it changed your plan without asking: locking, using your budget as your spending and rewriting the plan document now all ask first. Monthly entry asks for what your platform shows, the tax-year set-up is shorter, and some old features are gone.',
    changes: [
      'Recording your first month asks “This locks the plan. Lock it now?” and then runs the full lock with its plan document. Writing a new version of the plan document also asks first.',
      'How often you draw (monthly, quarterly or yearly) can be changed on a locked plan without marking past months.',
      'Budget: “Use £X a month as my spending” asks first, changes only that figure and offers Undo. A “+10%” button replaces the “Optional headroom” box.',
      'Stress tester → Settings shows the settings the ladder, floor and rotation strategies use, and says when a setting is not used by your way of drawing. A final-salary pension’s start is asked as an age, and with no State Pension entered the app says what it assumes.',
      'Month by month asks for your pension total, how much of it is cash and how much gilts or bond funds, filled in from last month. The tax-year set-up is three screens and no longer asks for tax bands it already knows.',
      'Pasting your holdings counts every line, asks “What is this?” for one it cannot recognise, and lists anything left out.',
      'Without an account, “Just try it” starts your own plan and you can keep up to three in this window; the example plan is read-only.',
      'The welcome tour, the old add-a-tool wizard, “Edit Tools” and the Copy from Stress / Copy from Decision buttons are gone.'
    ],
    corrections: [
      'The first monthly entry locked a plan without asking, against default figures, and wrote no plan document.',
      'A final-salary pension start typed as an age into the “plan year” box was saved and never paid, with no warning.',
      'Couples’ budget: a blank “who pays over time” row wiped your share, and the comparison with the PLSA couple standard used one share. Blank rows are now ignored and the comparison uses the household.',
      'The budget said its age bands and one-off costs fed the plan, which they did not, and “Use as the start of my income shape” also changed the Floor & Flex essentials. The words are corrected and it no longer does.',
      'Pasting holdings silently dropped lines it did not recognise, so a pot could come out far smaller than what was pasted; every line now counts or is listed as left out.',
      'The tax-year set-up said “0 years until state pension” when the pension was already being paid or its date was missing.',
      'Without an account, the words said “nothing saved” beside “Saved”, Delete Account was offered, and “Just try it” emptied the window of other plans.',
      'The plan document spoke of “the ladder’s rungs” on plans with no ladder.'
    ],
    effects: {
      stress: [
        'On an unlocked plan, the next Save also stores the final-salary start age. Ladder and floor strategies show more settings; their figures do not change.'
      ],
      strategies: [
        '“Try a strategy” now runs the plan’s full length, so a what-if on a plan longer than 35 years can read differently.'
      ],
      decision: [
        'A first month on an unlocked plan asks before locking, and how often you draw is saved as a preference. Recorded months are unchanged.'
      ],
      accumulation: [],
      budget: [
        'A saved headroom figure is no longer used; no figure changes until you press the button.'
      ],
      household: []
    },
    actions: [
      'If you typed an age into the old final-salary “plan year” box, check Stress tester → Settings → Other income, where the words beside the box say when it pays.',
      'If no State Pension is entered, enter your forecast in Settings.',
      'If you used “Optional headroom”, press “+10%” beside the budget’s Use button instead.'
    ],
    notes: [
      'Locked plans stay exactly as they were.'
    ],
    affects: (scenario) => {
      const out = [];
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      if (s && +s.dbAmount > 0 && s.dbStartAge == null) out.push('This plan has a final-salary pension: check the start age now shown in Settings → Other income.');
      if (s && !(+s.spWeeklyAmount > 0) && !(+s.statePension > 0)) out.push('This plan has no State Pension entered, so it assumes £12,000 a year from 67. Enter your forecast in Settings.');
      return out;
    }
  },
  {
    version: '6.22.0', date: '2026-10-02', engineVersion: '6.22.0',
    title: 'Choose how your ISA grows, and “on course” means 9 in 10 everywhere',
    summary: 'Every ISA used to grow at a fixed 3% a year, whatever prices did. Now each plan says how its ISA and savings grow: like cash (the default) or invested like your pension. We also fixed how a plan locked while still saving reads your pot, and “on course” now means lasting in 9 futures out of 10 everywhere.',
    changes: [
      'Stress tester → Settings: “How your ISA and savings grow”. “Mostly cash” grows by last year’s rise in prices less 1%, never below nothing; “Invested like my pension” follows your pension’s mix. Pots & Valves and Buckets in order use it; other strategies spend the ISA within their own pot.',
      'Accumulation planner: a new “Into ISAs and savings” box and an “ISA and savings” column, counted in your pots at retirement and in every run, even with no ISA today.',
      'Month by month keeps a blank ISA box as “no figure”, not £0. Type 0 if your ISA really is empty.',
      'A plan locked from now on while still saving draws its saving path from 1,000 futures, counting your pension, your ISA and what you pay into each.',
      '“Am I on track?” is now “Am I on course?” and looks for the pot that lasts in 9 futures out of 10.',
      'The new-look pages (preview) have the same ISA choice in all three questions, carried into a plan you save.'
    ],
    corrections: [
      'ISAs and savings grew a fixed 3% a year whatever prices did, so they lost buying power when prices rose fast and beat cash when prices barely rose. With the new setting your chance of lasting may go up or down.',
      'A plan locked while still saving compared your pot in today’s pounds with a path in the prices of the day it was locked, so after some years a pot on course could read well ahead. Both are now in the same prices.',
      'Refreshing the plan document drew a new path but kept counting from the first lock, so you looked behind; it now counts from the document’s own date.',
      'An ISA you expect at retirement but do not have today was left out of every run; it now counts.',
      '“On track” meant lasting in 85% of futures in some places and 90% in others; everything now uses 9 in 10, so “Am I on course?” may ask for a bigger pot.'
    ],
    effects: {
      stress: [
        'Unlocked plans: the ISA grows like cash unless you choose otherwise, and the amount typically left usually falls a little. Locked plans are unchanged and keep a fixed 3% until unlocked.'
      ],
      strategies: [
        'Pots & Valves and Buckets in order move with the ISA; the ladder, rotation and floor strategies are unchanged.'
      ],
      decision: [
        'Recorded months do not change. If you locked while still saving, your pot is now compared with the path in the same prices.'
      ],
      accumulation: [
        '“Am I on course?” now aims for 9 in 10, so it may say you are short. A month recorded before this release with an ISA of £0 is read as “no figure”, and saved pots at retirement change only when you next save the Timing block.'
      ],
      budget: [],
      household: [
        'The couples, survivor and care checks call a plan on course at 9 futures in 10 (it was 85%).'
      ]
    },
    actions: [
      'Check “How your ISA and savings grow” in Stress tester → Settings, and choose “Invested like my pension” if your ISA is invested.',
      'If you are still saving, enter what you pay into ISAs each month on the Accumulation planner and save the Timing block.',
      'If you locked your plan while saving and want a path that counts your ISA, refresh the plan document; the old one is kept as a previous version.'
    ],
    notes: [
      'Your plan’s fund and platform charge still comes off the ISA either way.'
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
        if (st.isaGrowth === 'cash') out.push(which + ' now grows like cash (“Mostly cash”). If it is invested, choose “Invested like my pension” in Stress tester → Settings.');
        else if (st.isaGrowth === 'invested') out.push('Your ISA grows in line with your pension’s mix (“Invested like my pension”).');
        else if (locked) out.push('This plan is locked, so its ISA keeps growing at a fixed 3% a year and its figures do not move. If you unlock it, the ISA grows like cash from then on.');
      }
      // A plan made from a quick answer before 6.22.0 with money going into savings: the planner did not keep that figure.
      const fa = s.fromAnswer && typeof s.fromAnswer === 'object' && Array.isArray(s.fromAnswer.people) ? s.fromAnswer.people[0] : null;
      const savingsIn = fa && fa.payIn && +fa.payIn.savingsIn > 0 ? +fa.payIn.savingsIn : 0;
      const accS = s.accumulationTool && s.accumulationTool.settings && typeof s.accumulationTool.settings === 'object' ? s.accumulationTool.settings : null;
      if (!locked && savingsIn > 0 && !(accS && +accS.isaMonthly > 0)) out.push('This plan was made from a quick answer with ' + gbp(savingsIn) + ' a month going into savings, which the planner did not keep. Enter it in “Into ISAs and savings” on the Accumulation planner so the plan counts it.');
      const doc = s.planDocument && typeof s.planDocument === 'object' ? s.planDocument : null;
      if (locked && doc && doc.accumulation && typeof doc.accumulation === 'object' && doc.accumulation.version !== 3) {
        out.push('This plan was locked while you were saving: each month’s reading now compares your pot with the plan’s path in the same prices, at the month you recorded it. Refresh the plan document so the path counts your ISA.');
      }
      return out;
    }
  },
  {
    version: '6.21.0', date: '2026-10-02', engineVersion: '6.19.0',
    title: 'The preview questions now let your spending change as you get older',
    summary: 'On the new-look pages (preview), you can now say how your spending changes with age, with as many steps and tapers as the planner’s income shape. A plan saved from such an answer arrives in the planner with the same steps. The note about drawing before 6 April 2028 now shows for everyone it applies to.',
    changes: [
      'Any number of spending steps by age, each staying level, falling by a percentage a year or moving evenly to the next. “Suggest go-go, go-slow and no-go years” fills them in, with Undo.',
      'Answers say what you could spend at the start and at each step, with a chart that fits a phone screen and “Show each year” for a table.',
      'A plan saved from such an answer has the same steps in Stress tester → Your income shape.',
      'The note to move into drawdown what you will need before 57 by 5 April 2028 now shows for anyone aged 55 or 56 on that date who starts drawing before then.'
    ],
    corrections: [],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.20.2', date: '2026-10-02', engineVersion: '6.19.0',
    title: 'A locked plan now stays exactly as you locked it',
    summary: 'Some buttons, and a browser tab opened before a plan was locked, could still change a locked plan’s settings. Now every save checks the lock first, and a refused change says how to unlock. If you are still saving, you are also asked before a Decision tool month locks your plan.',
    changes: [
      'If you are still saving, the Decision tool asks before a month locks your plan, and explains that savers record their pot on the Accumulation tab, which locks nothing.',
      'The banner at the top suggests a next step that fits where you are; savers are pointed to the Accumulation planner.',
      'Transition is in the phone’s More menu, and the welcome tour explains when a plan locks and how to undo it.'
    ],
    corrections: [
      'On a locked plan, the Budget’s “Use as the start of my income shape”, the optimiser’s “Apply this split”, “Copy from Decision”, the Decision tool’s “Reset” and a few other buttons could change the settings; they are now refused.',
      'On a locked plan, changing how often months are recorded changed the settings and could mark every recorded month as “under previous settings”; it is now refused.',
      'A tab or device that opened a plan before it was locked elsewhere could still change it, and could even unlock it; every save now checks the plan as stored first.',
      'Without an account, your Budget age could be copied into a locked plan’s settings and carried into your account when you signed in; it now stays on the Budget.',
      'The welcome tour wrongly said the Budget and Stress tester never lock.'
    ],
    effects: {
      stress: [
        'On a locked plan, “Apply this split”, “Copy from Decision” and adding a tool change nothing; “Try a strategy” still runs.'
      ],
      strategies: [
        'A locked plan’s strategy cannot be switched from any tab.'
      ],
      decision: [
        'On a locked plan, how often months are recorded cannot be changed, and savers are asked before a month locks an unlocked plan.'
      ],
      accumulation: [],
      budget: [
        'On a locked plan, buttons that would change the plan say it is locked and change nothing; the budget itself still saves.'
      ],
      household: []
    },
    actions: [
      'To change a locked plan, unlock it in Stress tester → Settings, or duplicate it.',
      'If you use more than one device and a plan unexpectedly says it is locked, it was locked on another device: reload the page.'
    ],
    notes: [
      'Nothing already saved is changed.'
    ]
  },
  {
    version: '6.20.1', date: '2026-10-02', engineVersion: '6.19.0',
    title: '“Where you are” now compares your pot with the plan like for like',
    summary: 'On a locked plan, “Where you are” compared your pension alone, in today’s pounds, with a band that counts your ISA and taxable account in the plan’s starting prices, so it could say you were behind when you were not. Now both sides count the same accounts in the same prices, and a missing figure is asked for.',
    changes: [
      'Your pot counts the same accounts as the plan’s band (pension, ISA and taxable account, or for a ladder the growth part and the gilts still to pay) and says where each figure came from.',
      'Your pot is converted into the plan’s prices using the CPI you entered for each tax year, or 4% a year where none was entered; the line shows both figures.',
      'The band is read at the month of your figure, and when a figure is missing or more than three months old the line says what to add or update.',
      'A full gilt ladder, or a ladder with rotation, shows the figures without a verdict; its ladder line says whether the gilts are on track.'
    ],
    corrections: [
      'Your pension alone was set against a band of all your pots, so someone with an ISA could read “below the plan’s 1-in-10 bad line” when they were well above it.',
      'Rising prices could make a pot exactly on the plan’s middle line read “above the 1-in-10 good line”.',
      'On gilt ladders, any small dip in gilt prices could read as “below the bad line” although every gilt still pays.',
      'Early in the first year the band was drawn too narrow, so an ordinary dip could read as below it.',
      'Pots & Valves plans with diversifiers could use an old pot figure when newer monthly ones existed.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [
        'A locked plan’s “Where you are” line may read differently; the plan, its document and your monthly records are unchanged.'
      ],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'If the line asks for your ISA or taxable account, add it under What you hold on the Transition tab.',
      'When you set up each tax year in the Decision tool, enter last year’s CPI so your pot is converted at the real rate rather than 4%.'
    ],
    notes: []
  },
  {
    version: '6.20.0', date: '2026-10-02', engineVersion: '6.19.0',
    title: 'Couples who stop work in different years now get answers that fit',
    summary: 'The questions on the new-look pages (preview) used to assume a couple stopped work in the same year. Now each of you can stop on your own date: until you have both stopped, the one still working covers part of your spending from pay and keeps paying in. Couples stopping together, and people on their own, get the same answers as before.',
    changes: [
      '“When does your partner stop work?” in all three questions: when you do, already, or at an age. Until you have both stopped, the one still working covers half of what you spend from their pay (or all, or none) and keeps paying in.',
      'If you have already stopped, “When can I afford to stop work?” and “Am I saving enough?” answer about your partner.',
      '“Already had the tax-free part of your pension?” for someone who has stopped: yes means everything you take out is taxed.',
      'The answer shows the years apart on a line of their own, and savings between you go with whoever stops first.',
      'Saving such an answer as a plan makes two linked plans, each starting at its own person’s stop; the Household tab says when the later one begins.',
      'For a couple who stop in different years, a note says when to move into drawdown before 5 April 2028.'
    ],
    corrections: [
      'When one of you had already stopped, the answers took you both as stopping now, so the money of the one who had stopped sat unused and their share of savings never went in. Each of you is now taken at your own stop, which can change the careful monthly amount.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      accumulation: [],
      budget: [],
      household: [
        'Linked plans that begin in different tax years now show a line on the Household tab saying when the later one begins; the check itself is unchanged.'
      ]
    },
    actions: [
      'If one of you has already stopped, or you will stop in different years, ask “What is that a month?” again with your partner’s stop answered.'
    ],
    notes: [
      'Stops are counted in whole years, so a stop part-way through a year counts from that year.'
    ]
  },
  {
    version: '6.19.0', date: '2026-10-01', engineVersion: '6.19.0',
    title: 'Fund and platform charges now come off your plan, 0.5% a year by default',
    summary: 'Until now no charges came off once you were drawing, so every plan looked better than it is likely to be. Each plan now has a yearly charge for funds and platform, starting at 0.5%, taken off monthly from money in funds and cash. Plans already locked keep their figures until you unlock them.',
    changes: [
      'Stress tester → Settings → Your allocation: “Charges (funds and platform), % a year”, from 0% to 3%. Add your funds’ charge to your platform’s fee; the line under the box shows what your funds charge.',
      'Every run, strategy, Household check and the Accumulation planner take the charge off, while you save and while you draw. Gilts held directly, annuities, final-salary pensions and the State Pension are not charged.',
      'New plans start at 0.5%; a plan made from a preview answer starts at the charge that answer used. A plan document written from now on records the charge.',
      'The new-look pages (preview) have the same setting, and now take it off while you draw too.'
    ],
    corrections: [
      'Charges were not taken off once money was being drawn. At 0.5% a year a plan close to the edge can lose several points of its chance of lasting, and the amount typically left falls noticeably; plans built on gilts held directly move least.'
    ],
    effects: {
      stress: [
        'Unlocked plans: 0.5% a year now comes off, so the chance of lasting and the amount left go down. Locked plans are unchanged and stay at 0% until unlocked.'
      ],
      strategies: [
        'Unlocked plans: every strategy’s figures move; gilt ladders move least.'
      ],
      decision: [],
      accumulation: [
        'Projections to retirement take the charge off; saved pots at retirement change only when you next save the Timing block.'
      ],
      budget: [],
      household: [
        'Each partner’s plan uses its own charge.'
      ]
    },
    actions: [
      'Check the charge in Stress tester → Settings: your funds’ yearly charge plus your platform’s fee.',
      'If you retire later, save the Timing block again so your pots at retirement include charges.',
      'A locked plan stays at 0%: unlock it to have charges taken off, or duplicate it to keep its record as it is.'
    ],
    notes: [],
    affects: (scenario) => {
      const s = scenario && typeof scenario === 'object' ? scenario : {};
      const st = s.stressTool && typeof s.stressTool === 'object' ? s.stressTool.settings : null;
      if (!st || typeof st !== 'object') return [];
      const locked = !!(s.decisionTool && s.decisionTool.settings && s.decisionTool.settings.locked);
      const v = st.chargesPct;
      const pct = typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 3 ? v : null;
      if (pct === null) {
        return locked ? ['This plan is locked, so its charges stay at 0% and its figures do not move. If you unlock it, 0.5% a year is taken off from then on (Stress tester → Settings).'] : [];
      }
      if (pct === 0) return ['This plan takes no charges off (0% in Stress tester → Settings), so its figures are as they were.'];
      return ['This plan now takes ' + pctText(pct) + '% a year off for fund and platform charges, so its chance of lasting and the amount left are lower than before. You can change it in Stress tester → Settings.'];
    }
  },
  {
    version: '6.18.0', date: '2026-10-01', engineVersion: '6.17.0',
    title: 'Turn an answer from the new-look pages into a plan, plus five fixes',
    summary: 'An answer from the new-look pages (preview) can now become a new plan in the planner, under a name you choose; nothing you already have is overwritten. We also fixed five things, including the Household table with stepped spending and start years for people west of Greenwich.',
    changes: [
      '“Save this as a plan” from any of the three questions makes a new plan, which opens at Stress tester → Settings with a note on where it came from and why its own result can differ from the quick answer. A couple gets two linked plans.',
      'On such a plan, your budget is shown as a guide beside the spending you chose; it sets your spending only if you press “Use as the start of my income shape”.',
      'In a tab that already holds plans made without an account, the landing page offers to carry on with them.',
      'The new-look pages now have three questions: “What is that a month?”, “When can I afford to stop work?” and “Am I saving enough?”, with a step to work out what you would spend.',
      'Pages that work out before-tax amounts are faster, with identical results.'
    ],
    corrections: [
      'For plans retiring later, the line above the results said the runs start from your pots today; they start from your pots at retirement, and now say so.',
      'With pots at retirement typed into the Timing block, its line wrongly said strategies were priced on the planner’s own projection; it now says they use your figures.',
      'The Household tab used the first income step in every year for plans with steps but no saved schedule; it now follows the steps.',
      'West of Greenwich, an age recorded on the same day and month as the State Pension date could start the plan a tax year early; dates now use your own day.',
      '“Just try it” in a tab with plans made without an account deleted all but one of them; it now keeps them.'
    ],
    effects: {
      stress: [
        'Only in the west-of-Greenwich date case above do the start year and results move, to the right year; otherwise no figure moves.'
      ],
      strategies: [
        'Only in the west-of-Greenwich date case: the start year, and with it the ladder and costs, move to the right year.'
      ],
      decision: [],
      accumulation: [],
      budget: [
        'On a plan made from a preview answer, your budget shows as a guide beside the plan’s spending.'
      ],
      household: [
        'Plans with income steps but no saved schedule: the Household table and checks now follow the steps.'
      ]
    },
    actions: [
      'If you live west of Greenwich, check your plan’s start year in Stress tester → Settings → Timing.',
      'If you use the Household tab with stepped spending, run the check again.'
    ],
    notes: [
      'While a plan is being made from an answer, its figures wait in this browser for at most a day and never go into the page address; the privacy policy describes this.'
    ],
    affects: (scenario) => {
      const out = [];
      if (scenario && scenario.fromAnswer) out.push('This plan was made from a quick answer in the preview: its description now shows the quick answer’s figure beside the planner’s.');
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      if (s && s.retired === false && s.potAtRetirement) out.push('This plan retires later: the Monte Carlo tab now says it starts from your pots at retirement.');
      return out;
    }
  },
  {
    version: '6.17.0', date: '2026-09-30', engineVersion: '6.17.0',
    title: 'Diversifiers run down in every table, and a first look at the next version',
    summary: 'Your diversifiers now run down over the plan in the Glidepath table and in choosing which pot pays, as they already did in protection. Plans taking a quarter of each withdrawal tax-free run about twice as fast. And there is a first preview of the next version of PensionTools.',
    changes: [
      'Glidepath table and “which pot pays”: the diversifiers target rises with prices and runs down to nothing by the plan’s end, so the simulations and the monthly advice agree.',
      'Plans that take a quarter of each withdrawal tax-free run about twice as fast, with identical results.',
      'The tax-year set-up uses the 45% threshold you enter.',
      'A preview of the next version answers “What is that a month?” for one person or a couple in under two minutes. Nothing typed there is saved, and it cannot touch your plans.'
    ],
    corrections: [
      'Some Decision records and panels used an old tax sum that ignored the loss of the personal allowance above £100,000, so the tax shown was too low.',
      'The Budget’s before-tax income for a high take-home figure was too low; it is now right.'
    ],
    effects: {
      stress: [
        'Plans with diversifiers move a little; other plans are unchanged.'
      ],
      strategies: [
        'The Glidepath table’s diversifiers column now falls over the plan; a locked plan’s document keeps its figures.'
      ],
      decision: [
        'Plans with diversifiers: the sleeve is ranked against its run-down target when choosing which pot pays; recorded months keep their figures.'
      ],
      accumulation: [],
      budget: [
        'Before-tax income is now right for high take-home figures.'
      ],
      household: []
    },
    actions: [
      'If your plan has diversifiers, run it again in the Stress tester.'
    ],
    notes: [],
    affects: (scenario) => {
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      return (s && +s.diversifierStart > 0) ? ['This plan holds diversifiers: the Glidepath table and “which pot pays” now use their run-down target. Re-run the stress test.'] : [];
    }
  },
  {
    version: '6.16.0', date: '2026-09-30', engineVersion: '6.16.0',
    title: 'Income tax above £100,000 is now worked out correctly',
    summary: 'Above £100,000 you lose £1 of tax-free allowance for every £2 of income. The app taxed that lost allowance at 20% instead of 40%, so it charged too little tax. It is now right to the penny; if your income never goes above £100,000 in any year, nothing changes.',
    changes: [
      'Tax above £100,000 follows the published rules: 40% up to £125,140 and 45% above.',
      'The tax-year set-up in the Decision tool now uses the same tax sum as the rest of the app.'
    ],
    corrections: [
      'Tax was too low by up to £2,514 a year on incomes above £100,000.',
      'The tax-year set-up ignored the lost allowance and the 45% rate.'
    ],
    effects: {
      stress: [
        'Plans drawing more than £100,000 in a year change slightly, as can long plans whose income passes £100,000 in later years, because that limit does not rise with prices.'
      ],
      strategies: [
        'As for the Stress tester; a locked plan’s document keeps its figures.'
      ],
      decision: [
        'Only tax years with taxable income above £100,000: tax is higher and take-home lower; recorded months keep their figures.'
      ],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'If your plan has a high-income year or a large lump-sum withdrawal, run it again to see the corrected tax.'
    ],
    notes: [
      'The Budget’s quick take-home estimate is still approximate above £100,000.'
    ]
  },
  {
    version: '6.15.0', date: '2026-09-30', engineVersion: '6.15.0',
    title: 'Diversifiers get a glidepath, old drafts can move to now, and plans can be downloaded',
    summary: 'Your diversifiers now have a glidepath like shares and bonds in the protection check. A draft whose start year has passed offers to start this tax year instead. And you can download a copy of a plan to your computer.',
    changes: [
      'Protection (Pots & Valves): the diversifiers glidepath rises with inflation and runs down over the plan, like shares and bonds; before, it was flat.',
      'A draft whose start year has passed asks whether to move it to this tax year. Nothing moves without your say, and locked plans or plans with recorded months are never asked.',
      'The plan menu can download the open plan as a file, holding your figures but no account details.',
      'A tab left open on an older version of the app no longer saves over a newer one; it asks you to reload.'
    ],
    corrections: [
      'A diversifiers sleeve that had fallen behind inflation still read as on target.',
      'Protection could be decided by a rounding error of a fraction of a penny; it now works in whole pennies.',
      'The “Plan starts” drop-down could be blank; it now shows the saved year.',
      'Some labels still said protection counted cash draws.'
    ],
    effects: {
      stress: [
        'Plans with diversifiers move a little either way; plans without are unchanged.'
      ],
      strategies: [],
      decision: [
        'Plans with diversifiers: protection may start or end in a different month; recorded months keep their figures.'
      ],
      accumulation: [],
      budget: [],
      household: []
    },
    actions: [
      'If your plan has diversifiers, run it again in the Stress tester.'
    ],
    notes: [],
    affects: (scenario) => {
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      return (s && +s.diversifierStart > 0) ? ['This plan holds diversifiers: its protection results will move a little. Re-run the stress test.'] : [];
    }
  },
  {
    version: '6.14.0', date: '2026-09-30', engineVersion: '6.14.0',
    title: 'One clear protection rule, start years that stay put, and steady locked ladders',
    summary: 'We fixed five problems our automatic checks found. Protection on Pots & Valves now follows one plain rule, an older plan no longer moves its start year every April, and a locked gilt ladder keeps the figures it was locked with.',
    changes: [
      'Pots & Valves protection now starts after the set number of months in a row in which your growth pots (shares, bonds and diversifiers together) sit below their glidepaths. Which pot paid that month no longer matters, and the planner and the monthly advice agree every month.',
      'A bought gilt ladder’s monthly figure is never trimmed by protection, because its income is already paid for.',
      'On a locked gilt-ladder plan, the order sheet, costs, spare and monthly figure all come from the plan document. One line marked “Comparison only” shows what the remaining gilts would cost today.'
    ],
    corrections: [
      'A retired plan last saved before 6.4 moved its start year, ages and every ladder rung each 6 April. Opening a plan now saves its start year once, and it stays put.',
      'A locked gilt ladder drifted from its plan document as gilt prices moved; it no longer does.',
      'The blank Budget’s placeholder age of 45 was read as your age; it no longer counts until you enter one.',
      'A pasted gilt recognised by name could be merged into a fund line sharing a stray code; it now stays its own line.',
      'An older Pots & Valves plan could be sized on a pot total left behind by a gilt ladder you had switched away from; it no longer is.'
    ],
    effects: {
      decision: [
        'Pots & Valves plans: protection may start a month or two earlier or later. Gilt-ladder plans: the monthly figure is never trimmed. Saved records keep their figures.'
      ],
      stress: [
        'Pots & Valves results move a little, more on plans with a diversifiers sleeve, where fewer futures enter protection.'
      ],
      strategies: [
        'A locked plan’s document keeps the figures it was locked with; other strategies are unchanged.'
      ],
      household: [],
      budget: [
        'The age boxes still show 45 and 60 until you change them, but they no longer count as your age.'
      ],
      accumulation: []
    },
    actions: [
      'If your plan shows age 45 and you never entered an age, set your age in “When your plan starts” in the Stress tester settings.'
    ],
    notes: []
  },
  {
    version: '6.13.4', date: '2026-09-30', engineVersion: '6.13.4', announce: true,
    title: 'Monte Carlo results are now the same on every device',
    summary: 'The same plan could show slightly different Monte Carlo figures on a phone, a Mac and a Windows PC, because the random futures came from a formula that devices round differently. We switched to a method every device works out exactly alike, so figures move slightly once and then stay put everywhere.',
    changes: [
      'The same plan now gives the same Monte Carlo answer on every device and browser, and in every time zone.'
    ],
    corrections: [
      'Monte Carlo figures differed between devices by about 0.5% to 3% on the fan charts. They now agree.',
      'Dates could slip by an hour or a day with the clock change or a time zone west of the UK, so a State Pension’s first-year share could be out by between about £1 and £30 in that one year, and gilt rotation’s time to maturity was slightly off. Dates are now counted in whole days.'
    ],
    effects: {
      stress: [
        'Monte Carlo figures move slightly on the next run because the random futures are a new set (usually within a fraction of a point on the chance of success and about 1% on the median end pot), then stay the same on every device. Historical results move by less.'
      ],
      strategies: [
        'Pots & Valves and Buckets in order move by the same small amounts and the gilt-ladder strategies by a few pounds at most. A locked plan’s document is never recalculated.'
      ],
      decision: [
        'Nothing is re-judged and recorded months keep their figures. In the tax year a State Pension starts, a winter start date pays about £1 more over the year.'
      ],
      accumulation: [
        'The Monte Carlo range for the pot at retirement moves slightly, for the same reason.'
      ],
      household: [
        'Joint Monte Carlo results move slightly, for the same reason.'
      ],
      budget: []
    },
    actions: [
      'None.'
    ],
    notes: [
      'If you keep your own note of a Monte Carlo figure, expect it to read slightly differently on the next run, then stay put.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const id = ss.strategyId || scenario?.strategy?.id || 'pots-and-valves';
      if (ss.configured && (id === 'pots-and-valves' || id === 'buckets-in-order')) out.push('This plan’s Monte Carlo figures will read slightly differently the next time it runs (the chance of lasting usually within half a point), and then the same on every device.');
      if (scenario?.planDocument) out.push('This plan’s plan document is unchanged: it keeps the figures it was locked with.');
      return out;
    }
  },
  {
    version: '6.13.3', date: '2026-09-23', engineVersion: '6.4.0',
    title: 'The Transition tab speaks plainly to someone who has already retired',
    summary: 'For someone already retired whose plan starts in a later tax year, the Transition tab talked as if a retirement date were coming, and sized the cash for the months to the plan’s start on its first income step rather than what is actually drawn each month. It now says you are retired, uses your real monthly payment, and shows the cash to hold now.',
    changes: [
      'Transition opens by saying you are already retired, when your gilt ladder starts paying, and that until then you draw from your pension cash.',
      'A “Cash to hold now” table lists the months to the plan’s start, each cash year, and how much of a year a lump sum pays.'
    ],
    corrections: [
      'That cash was sized on the plan’s first income step instead of the monthly amount the Decision tool actually pays; it now uses the actual payment.'
    ],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.13.2', date: '2026-09-23', engineVersion: '6.4.0',
    title: 'Transition counts the months to the plan’s start in the cash you need to hold',
    summary: 'Before a plan starts, the Transition tab’s cash target covered only the cash years, so money still needed for the months to the start looked spare. Those months are now part of the target and drop out as they pass. The boxes on the What you hold card now match the rest of the app.',
    changes: [
      'The Transition tab’s cash line now adds the months to the start still to pay, with their total.'
    ],
    corrections: [
      'The months to the start still to pay were left out of the cash target, so that money showed as spare.',
      'The What you hold card’s boxes were white with grey text; they now match the rest of the app.'
    ],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.13.1', date: '2026-09-16', engineVersion: '6.4.0',
    title: 'No more question about whether the Stress tester’s fund list is what you hold',
    summary: 'The previous release asked once whether the Stress tester’s fund list was what you hold. That list is only for trying strategies, and gilt-ladder plans do not use it at all, so we removed the question: what you hold starts empty and you paste or type it in.',
    changes: [],
    corrections: [
      'The Transition tab’s one-time “is that what you actually hold?” question is gone.'
    ],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.13.0', date: '2026-09-16', engineVersion: '6.4.0',
    title: 'What you hold is its own record; each strategy keeps its settings',
    summary: 'One fund list in the Stress tester was doing two jobs: the funds a strategy is tried on, and the record of what you actually hold. We separated them, so an old trial list is never read as your holdings, and switching strategy no longer carries one strategy’s settings into another.',
    changes: [
      'Transition tab: a “What you hold” card where you paste from your platform or type lines, and edit or remove them. It belongs to the plan, saves as you go and is never frozen by the lock.',
      'The Accumulation planner, the Decision tool’s “enter per fund” and the plan document read what you hold, and only that.',
      'Stress tester → Settings: the fund list now belongs to each strategy; switching strategy puts its settings away and switching back restores them.',
      'The plan document shows what you held when the plan was locked, and the pot strategy’s fund table is retitled “Funds the strategy was tested on”.',
      'Transition reads what you hold against the locked plan: rungs already paid drop out, and a ladder fully in place reads “Complete — nothing to do”.'
    ],
    corrections: [
      'The Stress tester’s fund list was read as what you hold by the Transition tab, the Accumulation planner and the plan document.',
      'Settings from a strategy you had switched away from stayed in the saved plan and could reach another strategy’s results and the plan document.',
      'Adopting Pots & Valves or Buckets in order with allocation dials wiped the fund list.'
    ],
    effects: {
      decision: [
        '“Enter per fund” lists what you hold, and is empty until you record it on the Transition tab.'
      ],
      stress: [
        'Strategy results are unchanged; nothing is assumed about what you hold.'
      ],
      strategies: [
        'From your next save, each strategy keeps only its own settings.'
      ],
      household: [],
      budget: [],
      accumulation: [
        'Proportions and the pension pot today read what you hold, and are empty until you record it.'
      ]
    },
    actions: [
      'On the Transition tab, record what you hold: paste your platform’s holdings table or type the lines.'
    ],
    notes: [
      'Nothing is deleted: the Stress tester’s list stays as the funds that strategy is tried on.'
    ],
    affects: (scenario) => {
      const s = scenario && scenario.stressTool && scenario.stressTool.settings;
      const out = [];
      if (s && Array.isArray(s.taggedFunds) && s.taggedFunds.length) {
        const n = s.taggedFunds.length;
        out.push('This plan’s Stress tester fund list (' + n + ' fund' + (n === 1 ? '' : 's') + ') is now “Funds to test” for its current strategy only. It no longer stands for what you hold: record that on the Transition tab.');
      }
      if (s && s.strategyParams && Object.keys(s.strategyParams).length > 0) out.push('This plan’s strategy settings belong to its current strategy from its next save; settings left from an earlier strategy are kept with that strategy, not lost.');
      return out;
    }
  },
  {
    version: '6.12.6', date: '2026-09-16', engineVersion: '6.4.0',
    title: 'You can correct your funds list while the plan is locked',
    summary: 'A locked plan froze all of the Stress tester settings, so a wrong line in My funds could not be removed without unlocking. What you hold is not a plan setting, so on a locked plan Save now saves the My funds list and nothing else.',
    changes: [
      'Stress tester → Settings → Save on a locked plan saves your holdings and leaves every other setting as it was; the Transition and Accumulation pages update from it.'
    ],
    corrections: [],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.12.5', date: '2026-09-16', engineVersion: '6.4.0',
    title: 'Household and Transition now recognise that you have already retired',
    summary: 'For someone already retired whose plan starts in a later tax year, the Household tab said “still working” and the Transition tab read as if a retirement date were coming. Both now say you are retired. Pasting a statement also no longer tags a line as the wrong fund.',
    changes: [
      'The Transition tab says the months to your plan’s start are paid from your pension cash, and shows where its holdings list comes from and how to remove a line that is not yours.'
    ],
    corrections: [
      'Household called someone already retired “still working” until the plan started; it now reads “already retired” from your timing settings and counts the spending need from today. A partner who really is still working keeps “still working”.',
      'When pasting a statement, a stray code in the ticker column could tag a line as a fund whose name it does not share; the code must now agree with the name.'
    ],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [
        'Retired plans’ years to the start now show their spending need and State Pension instead of “still working”.'
      ],
      budget: [],
      accumulation: []
    },
    actions: [
      'If your My funds list shows funds you do not hold, remove them under Stress tester → Settings → My funds.'
    ],
    notes: []
  },
  {
    version: '6.12.4', date: '2026-09-12', engineVersion: '6.4.0',
    title: 'The version chip in the header is small again on tablets',
    summary: 'On an iPad the “What’s new” version chip had grown to the height of the buttons beside it. It is a small chip again.',
    changes: [],
    corrections: [
      'The version chip was too tall on tablet-sized screens.'
    ],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.12.3', date: '2026-09-12', engineVersion: '6.4.0',
    title: 'Tablet header: title, plan button and Beta chip sit neatly together',
    summary: 'On tablets the title now has room before the plan button, the plan button no longer stretches across the row, and the Beta chip sits beside it. The account controls keep their own row underneath.',
    changes: [
      'A tidier header on tablet-sized screens.'
    ],
    corrections: [],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.12.2', date: '2026-09-12', engineVersion: '6.4.0',
    title: 'The plan name is back in its button, and the header fits an iPad',
    summary: 'The stage label inside the plan button had squeezed the plan’s name out of sight on every screen, and on an iPad mini the title wrapped and the account controls spilled into ragged rows. The name now keeps its space, the title stays on one line, and on tablets the account controls have their own row.',
    changes: [
      'A tidier header on tablet-sized screens, with the account controls in their own row.'
    ],
    corrections: [
      'The plan button showed the lock and stage but not the plan’s name; the name now always shows.'
    ],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.12.1', date: '2026-09-12', engineVersion: '6.4.0',
    title: 'The “without protection” comparison now says clearly what it compares',
    summary: 'Beside the chance your income was cut, the bracket for the same futures without protection read as if protection made things worse. It now says how many of those futures ran out and how many lasted, against your plan’s own chance of lasting.',
    changes: [
      'Monte Carlo and Historical cards: a clearer “without protection” bracket.'
    ],
    corrections: [],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.12.0', date: '2026-09-12', engineVersion: '6.4.0',
    title: '“Had to cut back” now means income actually cut, with protection’s worth shown',
    summary: 'The Stress tester counted every future in which protection switched on as one that “had to cut back”, so many plans read 100 in 100 even when every pound was paid. A cut now means income actually went unpaid, and the same futures are run without protection so you can see what it saves.',
    changes: [
      'Monte Carlo and Historical cards: “futures where income was actually cut”, with the count without protection beside it. How often protection switched on is in the help text.',
      'A cut is a tax year in which more than 1% of the planned income went unpaid and was not caught up later, or the money ran out.'
    ],
    corrections: [
      'Plans whose floors equal their allocation read “100 in 100 had to cut back” although income was never cut.'
    ],
    effects: {
      decision: [],
      stress: [
        'The tile changes on every plan; the simulation itself is unchanged. Each run also runs once without protection, so it takes about twice as long.'
      ],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.11.6', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'A State Pension starting mid-year is taxed correctly, and the inflation you type counts',
    summary: 'In the tax year a State Pension starts part-way through, the monthly recommendation taxed only part of it; the months to come are now taxed correctly. In the tax-year setup, an inflation figure you type for last year now replaces the assumed one in a suggestion taken from your plan.',
    changes: [],
    corrections: [
      'In the year a State Pension starts, the monthly recommendation under-taxed it, because only a share of the year’s amount was counted in the months to come. Plans already receiving it, and plans with no start date, are unchanged.',
      'In the tax-year setup, when the suggested income came from your plan’s schedule and last year’s inflation had never been entered, the figure you typed changed nothing (the assumed 4% stayed). It now replaces the assumption.'
    ],
    effects: {
      decision: [
        'Only the tax line changes, and only in the tax year your State Pension starts; records already saved keep their figures.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.11.5', date: '2026-09-11', engineVersion: '6.4.0',
    title: '“Left at the end” counts your ISA, and setup taxes a mid-year State Pension',
    summary: 'The Stress tester’s “typically left at the end” counted only the pension pot, so a plan that had moved money into its ISA could read £0 left. It now counts every pot. The tax-year setup also now taxes a State Pension that starts later in the year.',
    changes: [
      'Monte Carlo card: “left at the end” counts every pot (pension, ISA and taxable account), with the pension pot’s share shown beside it.'
    ],
    corrections: [
      'The tax-year setup left a State Pension starting after the first month out of the year’s tax; it now taxes the whole year’s State Pension and shows the monthly amount and this tax year’s total.',
      'The setup said a suggested income came from “the Budget tool” when it came from your plan’s income steps; it now says where it came from.'
    ],
    effects: {
      decision: [
        'Only the expected monthly tax shown at setup changes; the monthly recommendation already taxed the year correctly.'
      ],
      stress: [
        '“Left at the end” rises for plans holding an ISA; nothing in the simulation changed.'
      ],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.11.4', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Clearer cash wording, lump sums in pot strategies, and rent counted in the cash cover',
    summary: 'Three follow-up fixes. The Decision tool’s note on the months to the plan’s start now says the money comes from your pension cash, the plan document shows a lump sum feeding a pot strategy correctly, and the cash cover count now allows for income such as rent.',
    changes: [],
    corrections: [
      'The Decision tool’s note on those months still spoke of “the cash you set aside”; it now says pension cash.',
      'For Pots & Valves and Buckets in order plans with a lump sum after the start, the plan document showed the lump sum as “Other / DB” income; the pot takes the lump sum, so the row now shows the pot paying.',
      'In a year before the plan’s first tax year, the tax-year setup’s “the cash to April covers about N payments” ignored income such as rent; it now takes it off, as it already did for a final-salary pension.'
    ],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.11.3', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Gilt ladders paid partly by a later lump sum: no more £0 orders',
    summary: 'When a house sale or inheritance is expected to pay some years of a gilt ladder, the order sheet still listed a gilt for each of those years paying £0, with a dealing fee. It now lists only gilts that pay something and says which years the lump sum covers.',
    changes: [
      'Order sheet: a line naming the lump sum, the tax years it pays for, and when to buy the rungs for those years.',
      'Plan document: a “From a lump sum” column in the year-by-year table, instead of calling that money “Other / DB”.'
    ],
    corrections: [
      'The order sheet and the Transition tab listed gilts paying £0 for the years a lump sum covers; they no longer do.'
    ],
    effects: {
      decision: [],
      stress: [],
      strategies: [
        'Only plans with a lump sum after the start change; the sums are the same.'
      ],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.11.2', date: '2026-09-11', engineVersion: '6.4.0',
    title: '“Tax saved” now counts only tax-free money you actually used',
    summary: 'History and the monthly record showed “tax saved” for months where nothing tax-free was used, such as a month paid from cash or a month under protection. Tax saved now appears only when an ISA, taxable-account or tax-free slice was drawn.',
    changes: [],
    corrections: [
      '“Tax saved” compared the year’s tax with drawing your whole target from the pension, so any month that drew less for another reason showed a saving that was not one. It now compares with the money actually delivered this tax year, as if all of it were taxable pension income.'
    ],
    effects: {
      decision: [
        'On new records, tax saved is nil unless an ISA, taxable account or tax-free slice was used; the recommendation and tax due are unchanged, and old records keep their figure.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.11.1', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Clearer words for the cash paid before a plan’s first tax year',
    summary: 'We spoke of the money paid before a plan’s first tax year as if it were something separate. For someone already retired it is the same pension cash the cash years use, and the words now say so; the sums are unchanged.',
    changes: [
      'The stage label, Decision tool alerts, plan document, History and the tax-year setup say “SIPP cash to the first April”.'
    ],
    corrections: [],
    effects: {
      decision: [],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.11.0', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'In its first year, your State Pension shows from the month it starts',
    summary: 'In the tax year your State Pension begins, the Decision tool spread that year’s part-payment over all twelve months. Now the months before it starts show nothing from it and your pension pot covers the gap; from the start month the full payment arrives and the pot draw falls. The year’s tax still uses the true total.',
    changes: [
      'Monthly recommendation: the State Pension shows the amount actually received that month.',
      'Tax-year setup: the confirmation gives the monthly amount and its start date, and says the months before it are drawn from your pension.'
    ],
    corrections: [
      'The first year’s State Pension was averaged over twelve months.'
    ],
    effects: {
      decision: [
        'Only the tax year your State Pension starts changes, and only the month-by-month split between your pension pot and the State Pension.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.10.5', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Pasting gilts now works, and a ladder already running reconciles properly',
    summary: 'Pasting a gilt ladder into My funds could make the settings save fail, a pasted gilt without a recognised code did not match its rung, and the Transition tab told a running plan it had “1 month to go”. All three are fixed.',
    changes: [
      'Transition on a plan already running spreads the moves over the next six months to reconcile; for someone retiring later, the deadline is the retirement month.',
      'Pasting holdings on a plan that has been run but not locked matches gilts against the last order sheet.'
    ],
    corrections: [
      'After a paste, saving the Stress tester settings could fail with “Failed to save stress data”; it saves now.',
      'A pasted gilt known only by name, or by a guessed code, now matches its rung by maturity year, so it reads as held rather than as a sale plus a purchase.'
    ],
    effects: {
      stress: [
        'If a save failed after a paste, paste again; it saves now.'
      ],
      strategies: [],
      decision: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.10.4', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Locking from the Stress tester now carries the whole plan to the Decision tool',
    summary: 'Locking from the Stress tester froze the settings but never copied the plan’s pots, floors, ISA and State Pension into the Decision tool, which kept its defaults and could judge a plan far below target. Locking now carries the plan across first, and three smaller problems are fixed.',
    changes: [
      'The Transition tab stays available while the plan is running, for a ladder still to buy or to reconcile.'
    ],
    corrections: [
      'Locking from the Stress tester settings now gives the Decision tool the plan as locked (pots, floors, ISA policy, State Pension, strategy and taxable account), not its defaults.',
      'A locked, running plan no longer shows the “start the budget walk-through” banner.',
      'The where-you-are strip no longer calls a pot-strategy plan “bought by contract” in its first year, and a “Tax Saved -£0.00” row no longer appears from rounding.'
    ],
    effects: {
      decision: [
        'Plans locked from the Stress tester from now on run on their own pot floors; pot-strategy plans locked earlier need one unlock and re-lock.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you locked a Pots & Valves, Buckets in order, Floor to an age, “Gilts to State Pension, then shares” or Ladder & Ratchet plan before this release and the Decision tool shows pot minimums you never set: unlock (Decision → Settings), then lock again from Stress tester → Settings.'
    ],
    notes: [],
    affects(scenario) {
      const ds = scenario?.decisionTool?.settings || {};
      const ss = scenario?.stressTool?.settings || {};
      if (!ds.locked || !Object.keys(ss).length) return [];
      const diff = ['equityMin', 'bondMin', 'cashTarget'].some((k) => +ds[k] > 0 && +ss[k] > 0 && Math.abs(+ds[k] - +ss[k]) > 1);
      return diff ? ['This locked plan’s pot floors in the Decision tool differ from its Stress tester settings: unlock and re-lock from Stress tester → Settings to bring them in line.'] : [];
    }
  },
  {
    version: '6.10.3', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Retiring later: the countdown uses the month you retire, not just the tax year',
    summary: 'A plan’s years are tax years, but people retire on a date, which can be months into that tax year. The timing summary, stage label, countdown and Decision tool now use your retirement month; the gilt ladder and plan document keep the tax year.',
    changes: [
      'The timing summary for retire-later plans gives your retirement month, age and months to go, and the tax year the plan starts.',
      'A plan locked while still saving stays “committed, still saving” until your retirement month, and the Decision tool opens that month.'
    ],
    corrections: [
      'The countdown and the Decision tool used 6 April of the plan’s first year, which for many people is months before they stop work.'
    ],
    effects: {
      stress: [
        'Retire-later plans: the summary line changes; the numbers do not.'
      ],
      decision: [
        'Committed-while-saving plans: entries open in the retirement month rather than the April before it.'
      ],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.10.2', date: '2026-09-11', engineVersion: '6.4.0',
    title: 'Retiring later: the plan is priced on the pots you typed, not the defaults',
    summary: 'On a newly created plan, the timing block projected the pots at retirement from the default settings instead of the pot you had just typed, so a small saver could be modelled as a much larger one. It now reads the form as it stands, and saving works the timing out again from the whole form.',
    changes: [
      'The timing block updates as soon as you type the State Pension date, since that date sets the birthday the plan’s start year is counted from.'
    ],
    corrections: [
      'Retire-later plans saved before this fix may carry a wrong “pot at retirement”; saving the Stress tester settings once works it out again from the form.',
      'The plan’s start year could come out a year late when the State Pension date was entered after the timing block had shown; saving now corrects it.'
    ],
    effects: {
      stress: [
        'Retire-later plans only: after one re-save the cones and ladders price on the right pots. Already-retired plans are unaffected.'
      ],
      strategies: [],
      decision: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'If your plan says “I will retire at age X”: open its Stress tester settings and press Save Settings once.'
    ],
    notes: []
  },
  {
    version: '6.10.1', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'The life stage always shows, ladder CSV files are tidier, and PDFs print cleanly',
    summary: 'Three fixes. A plan whose next-step banner had been dismissed never worked out its life stage, so retirees still saw the Accumulation tab. Gilt-ladder CSV exports carried pot targets they do not use. And Decision tool PDFs printed the dark colours and buttons, which were hard to read on an iPad.',
    changes: [
      'The plan chip names your stage and the months to go; click it to see why, and what the stage does to the tabs.'
    ],
    corrections: [
      'The life stage is now worked out every time a plan opens, so retirees no longer see the Accumulation tab.',
      'Tax Years → Export CSV on a gilt-ladder plan no longer includes pot targets or a rebalance column.',
      'Download PDF (monthly record, tax year, plan document) now prints black on white without buttons, coloured only for good and bad verdicts.'
    ],
    effects: {
      decision: [
        'CSV and PDF exports of ladder plans change shape; pot-strategy plans are unchanged.'
      ],
      accumulation: [
        'Hidden for retirees, as intended since 6.6.0.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.10.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'New “When could I retire?” card for people still saving',
    summary: 'A new card at the top of the Accumulation planner tries every retirement age from next year to 75. For each it projects your pot from what you hold and pay in, then runs your strategy from that age, and it highlights the earliest age that meets the confidence you chose.',
    changes: [
      'Accumulation planner → “When could I retire?”: choose an income (or use your income shape) and a confidence level, then press Spin. A table shows, for each age, the pot it was priced on, the chance the money lasts, years covered and the worst 12 months.',
      'It runs in the background with a progress bar and uses fewer futures per age than the Stress tester, so treat it as a guide: for the age you choose, set it in the timing block and run the Stress tester.'
    ],
    corrections: [],
    effects: {
      accumulation: [
        'A new card; nothing else on the tab changes.'
      ],
      stress: [],
      strategies: [],
      decision: [],
      household: [],
      budget: []
    },
    actions: [
      'If you are saving: check your age today in the timing block and your holdings in My funds, then spin.'
    ],
    notes: [
      'Your income steps move to start at each age tried, so their shape is kept whichever year you stop. A typed income stays flat for life.'
    ]
  },
  {
    version: '6.9.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'Paste your holdings straight from any investment platform',
    summary: 'You can now copy the holdings table from your platform’s page or export and paste it into My funds. The app reads names, units, values and codes in whatever layout it finds, matches each line, shows a preview to check, then merges it into your holdings.',
    changes: [
      'My funds (Stress tester settings): a “Paste holdings from your platform” button with a preview and one Apply.',
      'Gilts are matched to the plan’s order sheet by SEDOL, code or maturity year; funds by ticker, then name; money-market funds as cash. Lines it cannot recognise are kept for you to sort.',
      'Lines you already have are updated, new ones added, and lines missing from the paste are listed for you to remove if sold. Other accounts are never touched, and the cost and monthly amount you entered are kept.',
      'Transition tab: “Paste my holdings” when nothing is recorded yet.'
    ],
    corrections: [],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      household: [],
      budget: [],
      accumulation: [
        'A pasted pension fills “pot today” and the proportions on the Accumulation planner.'
      ]
    },
    actions: [
      'Open Stress tester → Settings → My funds → Paste holdings, pick the account the paste belongs to, check the preview, Apply, then Save Settings.'
    ],
    notes: [
      'Everything is read in your browser; nothing you paste is sent anywhere.'
    ],
  },
  {
    version: '6.8.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'New Transition tab: from what you hold to the plan you locked',
    summary: 'A new Transition tab, shown from when retirement is approaching until the plan starts, compares the plan’s target with what you hold under My funds. It lists what to buy, sell and keep, lays the moves out on a dated schedule to the plan start, and lets you tick each order off as you place it.',
    changes: [
      'Transition tab: target, buy, sell and hold tables with tick-offs, a dated schedule (cash years first, near rungs before far ones, sales in stages, new contributions before sales) and your progress towards the target.',
      'Gilts in My funds: enter a gilt’s code with units and value, and it is matched to its rung; a rung within 2% of its target counts as held.',
      'If your ladder is already mostly in place, the tab shows only the top-ups and surpluses.'
    ],
    corrections: [],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      household: [],
      budget: [],
      accumulation: [
        'Transition reads the same record of what you hold as the Accumulation planner, and contributions entered there fund the schedule before any sales.'
      ]
    },
    actions: [
      'Lock the plan, then open Transition and enter what you hold under My funds. Tick each order off as you place it.'
    ],
    notes: [
      'Nothing here places an order, and the pound figures are a guide: gilt prices move daily.'
    ],
    affects(scenario) {
      const locked = !!scenario?.decisionTool?.settings?.locked;
      const tf = scenario?.stressTool?.settings?.taggedFunds || [];
      if (locked && scenario?.planDocument && !tf.length) return ['This plan is locked with a plan document but has no holdings entered, so the Transition tab shows everything as “to buy” until you enter what you hold.'];
      return [];
    }
  },
  {
    version: '6.7.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'One record of your holdings, split by asset class, and a monthly pot record',
    summary: 'Your holdings are entered once, under My funds, and every tool reads them. Each line can now carry its cost and monthly contribution, multi-asset funds count as their real mix of shares and bonds, and a plan locked while you are still saving keeps its projected path to check your pot against.',
    changes: [
      'My funds: two optional columns, cost (% a year) and £ a month going in.',
      'Multi-asset funds such as Vanguard LifeStrategy and HSBC Global Strategy split across shares and bonds by their mix.',
      'Accumulation planner: “What you hold” shows your proportions, cost and expected long-run return, and the projection gains a “your mix” line.',
      'Accumulation planner: “Record this month’s pot”, with a “where you are” strip against the locked path once the plan is locked.',
      'Plan document: a “Getting there” section with the locked path to retirement, checked against your pot when the plan starts.'
    ],
    corrections: [
      'A multi-asset fund counted as a single asset class; it now counts as its real split, so your shares and bonds proportions are right.'
    ],
    effects: {
      stress: [
        'Plans holding a multi-asset fund: the mix changes to the fund’s real split, which can move the cones slightly; single-class funds are unchanged.'
      ],
      accumulation: [
        'A new “your mix” projection line when holdings are tagged; otherwise unchanged.'
      ],
      decision: [],
      strategies: [],
      household: [],
      budget: []
    },
    actions: [
      'If you hold a multi-asset fund, check its ticker is in the catalogue so it splits, and add the cost and £ a month to the lines you pay into.'
    ],
    notes: [
      'The planner models proportions of asset classes, never a single fund’s own return.'
    ],
    affects(scenario) {
      const tf = scenario?.stressTool?.settings?.taggedFunds || [];
      const multi = tf.filter((f) => /^(VLS(20|40|60|80|100)|HSBCGS[BCD])$/i.test(String(f.ticker || '')));
      return multi.length ? ['This plan holds ' + multi.map((f) => f.ticker).join(', ') + ', now split into its shares and bonds, so the totals and the range of outcomes may move a little.'] : [];
    }
  },
  {
    version: '6.6.0', date: '2026-09-10', engineVersion: '6.4.0',
    title: 'The app now knows your life stage, from saving to running your plan',
    summary: 'Every plan now has a life stage, worked out from your age, the plan start and the lock, never asked. The stage decides which tools lead, which are frozen and which do not apply. A plan locked while you are still saving now waits for its start date, then checks the pot you arrive with.',
    changes: [
      'Stages: Saving (more than five years out), Approaching (within five years), Committed while still saving, Retired with the plan locked, Running, and Retired-designing. The leading tools are underlined, frozen ones dimmed, and the Accumulation planner is hidden for retirees.',
      'Setup wizard: a new starting point, “I’m already drawing my pension — pick up from here”, which starts the plan this tax year with what you hold.',
      'Decision tool: a plan locked while still saving takes no monthly entries before it starts. In the first month after, if your real pot is more than 10% from the one the plan was priced on, you choose between running the plan on what you have and unlocking to re-plan.',
      'Plan document: a “Journey” section lists each stage change with its date.'
    ],
    corrections: [],
    effects: {
      stress: [
        'Nothing in the numbers; a locked plan’s settings tab is now also dimmed.'
      ],
      accumulation: [
        'Hidden on plans marked “already retired”; change the timing block to bring it back.'
      ],
      decision: [
        'Committed-while-saving plans refuse entries before the start, giving the start date; everyone else is unchanged.'
      ],
      strategies: [],
      household: [],
      budget: []
    },
    actions: [
      'Check the chip next to your plan’s name: it says which stage the app thinks you are in. If it is wrong, correct the timing block in Stress tester → Settings.'
    ],
    notes: [],
    affects(scenario) {
      const ss = scenario?.stressTool?.settings || {};
      const locked = !!scenario?.decisionTool?.settings?.locked;
      if (!Object.keys(ss).length) return [];
      if (!(+ss.currentAge > 0)) return ['This plan has no age today, so its stage reads “Getting started” until you enter your age in the Timing block.'];
      if (ss.retired === true) return ['This plan is retired, so the Accumulation planner is hidden on it' + (locked ? '; its stage is Running once it is locked.' : '.')];
      if (ss.retired === false && locked) return ['This plan was locked while you are still saving: the Decision tool waits for the plan to start, so record your pot on the Accumulation planner until then.'];
      return [];
    }
  },
  {
    version: '6.5.4', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Already taken this month’s payment? You can now plan from next month',
    summary: 'The Decision tool assumes you enter a month before its payment goes out. If this month’s payment has already been made, a new tick box on Monthly Entry moves the entry to next month. Labels now say “payments to come” instead of “remaining months”.',
    changes: [
      'Monthly Entry: a “This month’s payment has already been made — plan from next month” tick box. March cannot roll into April: start with April’s setup instead.',
      'Tax-year setup, History and Tax Years: “Remaining months” now reads “Payments to come this tax year (including this month’s)”.',
      'A year before the plan’s first tax year: the suggested target is the plan’s first income step, with a note on how many of the payments to come the cash covers.'
    ],
    corrections: [
      'That suggestion spread all the cash over the months left, overstating the rate for anyone already part-way through the year.'
    ],
    effects: {
      decision: [
        'Saved entries and recommendations are unchanged; the tick box only sets which month you are entering.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you recorded this month after its payment had gone out: delete that entry (and its tax-year setup if it was the first), tick the box, and enter from next month with the balances after the payment.'
    ],
    notes: []
  },
  {
    version: '6.5.3', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'History no longer shows pot floors on gilt-ladder plans',
    summary: 'On a gilt-ladder plan, opening History before Monthly Entry could show pot targets and a “surplus” on a saved month. History now looks up the plan’s strategy itself.',
    changes: [],
    corrections: [
      'A month’s record in History now always shows the ladder view for gilt-ladder plans: no pot floors, no rebalancing, and paid from the cash bucket.'
    ],
    effects: {
      decision: [
        'Ladder plans only; display only.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.5.2', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'The Tax Years page uses plain words instead of payroll terms',
    summary: 'The Tax Years detail used payroll words that did not fit a pension, such as “Target annual salary” and “Tax-Inefficient”. They now say what they mean, and the tax already paid this year is shown when you have entered it.',
    changes: [
      'Tax Years → year detail: “Target income for the year (gross, all sources)”, “Income received earlier this tax year” and “Tax already paid on it (PAYE)”; the mode reads “Full target from the SIPP” or “Tax-efficient — SIPP to the basic-rate limit, ISA tops up”.'
    ],
    corrections: [],
    effects: {
      decision: [
        'Wording only; the figures and the recommendation are unchanged.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.5.1', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Tax Years no longer shows a target mix for gilt-ladder plans',
    summary: 'The Tax Years page showed a “This Year’s Target Mix” card, meant for Pots & Valves, on gilt-ladder plans, where there is no mix to keep. It is now hidden for those plans, as it already was on the monthly record.',
    changes: [],
    corrections: [
      'A year’s detail on Tax Years no longer shows the target-mix and rebalance card for the Full index-linked gilt ladder, Gilt ladder + rotation and Floor the schedule.'
    ],
    effects: {
      decision: [
        'Ladder plans only: one card fewer on Tax Years.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.5.0', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Lock your plan and keep a plan document of what you committed to',
    summary: 'When you are happy with the results, you can lock the plan from the Stress tester settings. Your settings freeze in both tools and the app writes a plan document: a record of what you committed to, which the Decision tool checks you against each month.',
    changes: [
      'Stress tester → Settings: “Lock plan & create the plan document” beside Save. It saves, runs your strategy, freezes the settings in both tools and writes the document; it is the same single lock the Decision tool sets on its first entry.',
      'The plan document covers your age against the tax years, your income steps, who pays each year, the strategy verdict and cones, the pots and shopping list, the assumptions, and how the Decision tool will run it.',
      'Decision tool → a new “Plan document” tab: a “Where you are” strip (plan year and age, the step you are on, income so far against the plan, your pot against the cone), the document itself, Download PDF and previous versions.',
      'Monthly Entry shows the same “where you are” line under each recommendation.',
      'Unlocking unlocks both tools and keeps the old document under previous versions; a new one is written when you lock again.'
    ],
    corrections: [
      'A locked plan’s Stress tester settings and strategy could still be changed, so the Decision tool’s plan could quietly drift from the plan it was built on. Both are now frozen together; “Try a strategy” what-ifs still run.',
      'The plan-lock explainer said the Stress tester is never locked; it now describes the lock you can set yourself.'
    ],
    effects: {
      stress: [
        'Locked plans: the settings page is read-only until you unlock; draft plans are unaffected.'
      ],
      strategies: [
        'Switching strategy on a locked plan asks you to unlock or duplicate it first.'
      ],
      decision: [
        'The recommendation is unchanged; the new Plan document tab reads the document against your recorded months.'
      ],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'If your plan is already locked: open Decision tool → Plan document → “Create the plan document now”, then download the PDF and keep it.',
      'If you have not locked yet: when you are happy with the results, press Lock on the Stress tester settings page.'
    ],
    notes: [
      'The document is a snapshot: it does not change when markets, prices or the app change. If you re-plan, refresh it deliberately; the old version is kept.'
    ],
    affects(scenario) {
      const locked = !!scenario?.decisionTool?.settings?.locked;
      if (locked && !scenario?.planDocument) return ['This plan is locked but has no plan document yet: create it from the Plan document tab.'];
      return [];
    }
  },
  {
    version: '6.4.2', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Saved monthly records for gilt-ladder plans now match the live screen',
    summary: 'For a gilt-ladder plan, the saved monthly record and its PDF showed Pots & Valves floors, a “surplus” and rebalancing moves, and said money came from selling bonds. They now show where the month was really paid from. “Tax saved” was also overstated for plans with other income.',
    changes: [
      'Saved records keep how the month was paid, and History and the PDF use them; older records fall back to the plan’s current strategy.',
      'In a month before a ladder plan’s first rung, the recommendation says it is paid from cash: nothing is sold and no rung is due yet.'
    ],
    corrections: [
      '“Tax saved” counted a State Pension or other income twice, inventing a saving of a few hundred pounds a month; months drawn fully from the pension now show no saving.',
      'History cards and PDFs said “Year 0” for a month before the plan’s first tax year; they now say which tax year it is.'
    ],
    effects: {
      decision: [
        'Ladder plans: download any monthly PDF again for the corrected source; the recommended figures are unchanged. “Tax saved” falls for plans with a State Pension or other income.'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.4.1', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Mid-year tax-year setup now takes the tax you have already paid',
    summary: 'If you have been drawing a pension since April, the tax-year setup now takes the PAYE tax already deducted as well as the income received, and the tax still to come is the year’s total less what you have paid. Left blank, the old assumption stands.',
    changes: [
      'Mid-year step: a second box, “tax already deducted on that income”, saved with the tax year and used in the monthly recommendation.',
      'The confirmation names the two modes plainly: “Full target from the SIPP” rather than “Tax-Inefficient”.'
    ],
    corrections: [
      'For someone already drawing under PAYE, the setup pushed the whole higher-rate band into the months left, overstating the tax to come by several hundred pounds a month and understating take-home. The gross draw was never affected.',
      'In a part first year, other income and the State Pension were counted in full on top of the income to date, a small double count of tax; they are now shared over the months left.'
    ],
    effects: {
      decision: [
        'Tax years already set up are unchanged until you run the setup again (Tax Years → the year → “Reconfigure via Wizard”).'
      ],
      stress: [],
      strategies: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you are setting up a mid-year first year and have drawn since April, enter the tax to date from your payslip so the expected tax and take-home match what you receive.'
    ],
    notes: []
  },
  {
    version: '6.4.0', date: '2026-09-09', engineVersion: '6.4.0',
    title: 'Your plan now knows the tax year it starts in',
    summary: 'A new “When your plan starts” block in the Stress tester settings records your age today, whether you have retired or when you will, and the tax year your plan starts. That start is saved and is year 0 for every tool, instead of being worked out again each time the app opened.',
    changes: [
      '“When your plan starts” in Stress tester → Settings: age today (shared with the Budget page), “already retired” or “retire at age X”, and the start tax year. Your income steps start at the age you reach that year.',
      'Retiring later: the pots you enter are today’s, and the plan is priced on the pots projected to retirement in today’s money, from your Accumulation planner contributions or a figure you type. Gilt ladders say they are a guide, priced at today’s yields.',
      'Decision tool: the tax-year wizard suggests a monthly amount for a tax year before the plan’s first, and “plan vs actual” leaves those months out.',
      'Lump sums and one-off spends show the tax year their plan year means, and the plan’s length shows the age it runs to.'
    ],
    corrections: [
      'The plan’s first tax year was never saved, so every plan silently moved a year later each 1 January and a gilt ladder could re-price itself a year late. It is now saved.',
      'The Decision tool counted plan years from a fixed year in some places; it now counts from your plan’s start everywhere, so income steps down in the right April and pot tracks line up with the Stress tester.',
      'The State Pension’s plan year is now exact, with its first-year share counted from 6 April; the settings preview and the calculations used to disagree for anyone not yet retired.'
    ],
    effects: {
      stress: [
        'Plans with an age today get a saved start, for most the same next-April start as before, so nothing moves. Anyone not yet retired may see the cones move slightly as the State Pension lands in the right year.'
      ],
      strategies: [
        'Gilt ladders are priced for the saved start year: the same rungs as before, and no longer a year late after 1 January.'
      ],
      decision: [
        'Plan year 0 is your plan’s start, and yearly targets and pot tracks read from the right year.'
      ],
      household: [],
      budget: [
        'Age today is shared with the timing block; change it in either place.'
      ],
      accumulation: [
        'Its projected pot feeds the Stress tester when you say you will retire later.'
      ]
    },
    actions: [
      'Open Stress tester → Settings → “When your plan starts” and check your age today, whether you are retired, and the start tax year. Save, then check your income steps still start at the age you meant.',
      'If you use the Decision tool, the tax-year wizard reads each tax year against your plan’s first.'
    ],
    notes: [],
    affects(scenario) {
      const s = scenario?.stressTool?.settings || {};
      const out = [];
      if (!Object.keys(s).length) { /* nothing set up yet */ }
      else if (!(+s.currentAge > 0)) out.push('This plan has no age today, so it keeps the old assumption for its start, with the income steps counted from ' + (+s.shapeAgeNow > 0 ? 'age ' + s.shapeAgeNow : 'the planner’s default age') + '. Enter your age in the Timing block to fix it.');
      else {
        const t = deriveTiming(s);
        out.push('Plan start: tax year ' + t.firstTaxYear + '/' + String(t.firstTaxYear + 1).slice(2) + (t.mode === 'future' ? ' (retiring at ' + t.retireAge + ')' : ' (already retired)') + ', the same next-April start as before unless you change it.');
        if (+s.shapeAgeNow > 0 && t.shapeAgeNow !== +s.shapeAgeNow) out.push('Your income steps were labelled from age ' + s.shapeAgeNow + '; the age you actually reach in that first plan year is ' + t.shapeAgeNow + ', so the steps now start there and each later step lands ' + Math.abs(t.shapeAgeNow - s.shapeAgeNow) + ' year' + (Math.abs(t.shapeAgeNow - s.shapeAgeNow) === 1 ? '' : 's') + (t.shapeAgeNow > s.shapeAgeNow ? ' earlier' : ' later') + ' in the plan. Check the step ages in Settings.');
      }
      const ty = scenario?.decisionTool?.taxYears || {};
      if (Object.keys(ty).length) out.push('Decision tool: the plan’s first year is now the year it starts.');
      return out;
    }
  },
  {
    version: '6.3.0', date: '2026-09-09', engineVersion: '6.2.1',
    title: 'Trying the app without an account is a timed trial that keeps your work',
    summary: '“Just try it” now measures active use in this browser, reminds you along the way, and stops after three hours until you sign in. However you sign in, the plans, budget and settings you made are copied into your account, so nothing is lost.',
    changes: [
      'The trial banner shows how much of the three hours you have used, with buttons to create an account or sign in and keep your work.',
      'Reminders at 15, 45, 90 and 150 minutes of active use; a tab left open does not count.',
      'At three hours the trial stops. Signing in copies your trial plans into your account, marked “(from guest)”, after asking you.'
    ],
    corrections: [
      '“Create a free account to keep it” wiped the trial plan on the way to sign-up; it now keeps it.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you have been trying the app without an account, sign in once to keep your work. It is the only way it is kept.'
    ],
    notes: [
      'The timer and the hand-over live in your browser only (see the privacy policy).'
    ]
  },
  {
    version: '6.2.7', date: '2026-09-08', engineVersion: '6.2.1',
    title: 'Cash years in the gilt ladders now cost what holding cash really costs',
    summary: 'The “years funded from cash first” dial on the Full index-linked gilt ladder and “Gilts to State Pension, then shares” treated cash as keeping its value. Cash now grows at inflation minus 1% a year, as it does everywhere else in the app, so a long run of cash years shows its true cost. The dial is capped at 5.',
    changes: [
      'The dial says what it is for (the first year or two, where no gilt matures at the right time) and is capped at 5.'
    ],
    corrections: [
      'Cash set aside for later years was treated as keeping pace with inflation. Two cash years move the ladder’s cost by well under 1%; fifteen would have been about 7% too cheap.'
    ],
    effects: {
      stress: [
        'Full index-linked gilt ladder and “Gilts to State Pension, then shares” plans: the ladder cost and spare move slightly, and a plan set above 5 cash years is set to 5 next time you open its dials.'
      ],
      strategies: [
        'The ranked table’s “what you pay today” for those two strategies moves the same way.'
      ],
      decision: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you had set more than 3 cash years, look at the dial again: for a large cash holding, “Gilts to State Pension, then shares” or Buckets in order model it properly.'
    ],
    notes: []
  },
  {
    version: '6.2.6', date: '2026-09-08', engineVersion: '6.2.0',
    title: 'Turn a lump sum into extra yearly income, if you want to',
    summary: 'A lump sum pays for your income shape; it does not raise it, and nothing said so. Under the income picture each lump sum now says how much a year it could add from its age, with a button that adds that to your income steps.',
    changes: [
      'Under the income shape, each lump sum shows what it could support each year if spread evenly over the years left, with a button to add that to your income from that age.',
      'The button adds a step at that age, or raises the one there, and every later step by the same amount. The figure is in today’s money with no growth assumed, so it is slightly cautious.',
      'The same line says where the money lands that year: your ISA allowance, pension room, and the taxable account held as gilts or shares.'
    ],
    corrections: [],
    effects: {
      stress: [
        'Nothing changes unless you press the button; if you do, every strategy prices the higher income against your pot plus the lump sum.'
      ],
      strategies: [],
      decision: [
        'If you raise your income shape, the Decision tool’s target follows on the next Stress tester save (draft plans) or tax-year setup (locked plans).'
      ],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.2.5', date: '2026-09-08', engineVersion: '6.2.0',
    title: 'Income streams, lump sums and one-off spends now appear on the income picture',
    summary: 'The income-shape picture now draws income streams such as rent or part-time work as layers for the years they run, and marks each lump sum and one-off spend at the age it happens. Editing them redraws the picture at once.',
    changes: [
      'Income streams appear as grey layers in the bars for their years, like a final-salary pension.',
      'Lump sums (▲) and one-off spends (▼) are marked at their age with the amount and label; a lump sum lands in your pots rather than being income, so it is a marker, not a layer.',
      'Changing anything under Income streams & lump sums redraws the picture immediately.'
    ],
    corrections: [
      'Income streams were counted in the figures but not drawn, so the picture and the figures disagreed.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.2.4', date: '2026-09-07', engineVersion: '6.2.0', announce: true,
    title: 'The income picture shows each step’s slope and never dips below your State Pension',
    summary: 'The income-shape picture now draws the slope of every step and moves smoothly to the new shape as you change a slider. Your income can no longer slope below the guaranteed income of that year, and every part of the app reads the same sloped schedule.',
    changes: [
      'Your income shape: the bars follow each step’s slope, with a line tracing the path, and ease into place when you change a slider or tick “glide”.',
      'A step is your total income for the year (State Pension, other pensions and your pot together), and the editor says so. If a slope would take it below that year’s guaranteed income, it is held there and a note says from which age.'
    ],
    corrections: [
      'The picture ignored the slopes the calculations were using (6.2.1 to 6.2.3).',
      '“Use as my plan’s target” on the Budget page dropped the slopes when it rebuilt the schedule; it now keeps them.'
    ],
    effects: {
      stress: [
        'Plans set up from the Budget between 6.2.1 and 6.2.3 with sloped steps were run flat and now follow the slopes; plans whose slope dipped below the State Pension are held at that floor.'
      ],
      strategies: [
        'The same as the Stress tester.'
      ],
      decision: [
        'The tax-year wizard suggests from the corrected schedule; recorded months are untouched.'
      ],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'Open Stress tester settings → Your income shape once and look at the picture: it now shows exactly what is modelled.'
    ],
    notes: [],
    affects(scenario) {
      const ss = scenario?.stressTool?.settings || {};
      const sloped = Array.isArray(ss.incomeSteps) && ss.incomeSteps.some((x) => x && ((+x.decline > 0) || x.glideToNext));
      return sloped ? ['This plan’s income steps slope down over time: check the chart in Stress tester → Settings, and save again if it looks flat (it will, if you refilled the steps from the Budget).'] : [];
    }
  },
  {
    version: '6.2.3', date: '2026-09-07', engineVersion: '6.2.0',
    title: 'Fixed: the lump-sum amount box stopped after every digit',
    summary: 'Since 6.1.0, the amount box for a one-off lump sum lost your place after every digit, because the row redrew itself. The note beside it now updates without interrupting your typing.',
    changes: [],
    corrections: [
      'Typing a lump-sum amount no longer stops after one digit.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'None.'
    ],
    notes: []
  },
  {
    version: '6.2.2', date: '2026-09-07', engineVersion: '6.2.0',
    title: 'Fixed: the Stress tester, Budget and Strategies tabs showed empty',
    summary: 'In 6.2.1 the Stress tester, Budget and Strategies tabs lost their content and sub-tabs, because of a slip in the page layout. It was fixed within the hour.',
    changes: [],
    corrections: [
      'A layout slip in 6.2.1 hid the content of every tab after the Decision tool; all tabs show again.'
    ],
    effects: {
      stress: [],
      strategies: [],
      decision: [],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'Reload once if a tab still looks empty.'
    ],
    notes: []
  },
  {
    version: '6.2.1', date: '2026-09-07', engineVersion: '6.2.0', announce: true,
    title: 'Each income step can now slope, and Buckets in order cuts spending more fairly',
    summary: 'The separate “Spending over retirement” control is gone: each income step now has its own slope, so you choose how fast each phase drifts down or glides into the next. Buckets in order now decides on spending cuts from the whole pot against the whole plan, not a signal that fired by design.',
    changes: [
      'Your income shape: every step has a slider for how much it falls each year in today’s money (0 to 5%), and a “glide evenly to the next step” box for a smooth change instead of a cliff.',
      'The “Spending over retirement” control is removed from both tools. Plans that had “Declining with age” were turned into steps that give exactly the same curve.',
      'Buckets in order with spending cuts: cuts start when the whole pension pot has been below the whole plan track for the set number of months, and end when it is back above, the same check the Decision tool uses.'
    ],
    corrections: [
      'Buckets in order draws from cash first by design, so its old cut check was nearly always met and cuts fired on any dip; most cuts came from the rule, not the market.'
    ],
    effects: {
      stress: [
        'Buckets in order plans with cuts on: fewer cut months, so results improve. Plans that used “Declining with age” give identical numbers, with the slope now visible and editable.'
      ],
      strategies: [
        'Ranked figures move only for Buckets in order plans with cuts on.'
      ],
      decision: [
        'Buckets in order plans use the same whole-pot check from your next entry; a “Declining” plan keeps its schedule and suggestions.'
      ],
      household: [],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you had “Declining with age”, open Stress tester settings → Your income shape and check the slopes are what you meant.',
      'Buckets in order plans with cuts on: run the Stress tester again to see the corrected results.'
    ],
    notes: [],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      if (ss.spendingMigratedFrom === 'declining' || ss.spendingProfile === 'declining') out.push('This plan used “Declining with age”: its income steps now show that slope themselves, with the same figures.');
      if (ss.strategyId === 'buckets-in-order' && ss.disableProtection === false) out.push('This plan uses Buckets in order with spending cuts on: it will show fewer months of cuts. Re-run the Stress Tester.');
      return out;
    }
  },
  {
    version: '6.2.0', date: '2026-09-07', engineVersion: '6.1.0',
    title: 'Fairer strategy comparisons, and eight fixes to figures you see',
    summary: 'We fixed eight problems that could put a wrong number in front of you, including one that quietly changed saved allocations. The strategy comparison now runs every strategy over your plan’s own length and counts all the income you receive.',
    changes: [
      'Stress tester settings keep a saved allocation that matches no preset as “Custom — your saved split”, instead of snapping it to the nearest risk level.',
      'Settings show the age today they use, and say when it is not set.',
      'Try a strategy, the survivor check and the care check run in the background, so the page no longer freezes.',
      'Saving now gives up after 20 seconds, tries once more, and tells you if it failed, instead of showing “Saving…” for ever.'
    ],
    corrections: [
      'Opening the Drawdown or Glidepath tab changed the plan’s length for everything run afterwards, so a 30-year plan could be compared over 35 years.',
      'For a plan saved on Buckets in order, the ranked table’s Pots & Valves row was really Buckets in order.',
      '“Worst 12 months” for the bought strategies counted only the gilts bought, so a year paid by a lump sum or a final-salary pension looked like a dip; it is now the income you receive.',
      'With no State Pension entered, the comparison assumed one without saying so; it now labels it an assumption.',
      'Smaller fixes: an empty age in the rotation risk summary, a spinner left running on the Historical tab, a previous plan’s card left on the Monte Carlo tab, “£0.00” amounts, and a doubled “Protection | Protection” reason.'
    ],
    effects: {
      stress: [
        'The ranked comparison changes for plans with a lump sum or a final-salary or inherited pension, for plans saved on Buckets in order, and for anyone who opened Glidepath or Drawdown first. If you saved settings since mid-August with a custom split, check the amounts.'
      ],
      strategies: [
        'Ranked figures move for the plans above; nothing else about a strategy changed.'
      ],
      decision: [
        'No numbers change; the calculation reason reads more tidily.'
      ],
      household: [
        'The survivor and care checks give the same answers without freezing the page.'
      ],
      budget: [],
      accumulation: []
    },
    actions: [
      'Open Stress tester settings once: if your allocation reads “Custom — your saved split”, the amounts are what you saved; keep them or pick a risk level.',
      'Run the Strategies overview again if your plan has a lump sum or a final-salary pension, uses Buckets in order, or you had opened Glidepath before comparing.',
      'If your State Pension line says “assumed — none entered”, enter your forecast date and weekly amount.'
    ],
    notes: [],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const pot = (+ss.equityMin || 0) + (+ss.bondMin || 0) + (+ss.cashTarget || 0) + (+ss.diversifierStart || 0);
      const presets = [[0.3, 0.45, 0.25], [0.5, 0.4, 0.1], [0.7, 0.25, 0.05]];
      if (pot > 0 && ss.allocMode !== 'funds') {
        const f = [(+ss.equityMin || 0) / pot, (+ss.bondMin || 0) / pot, (+ss.cashTarget || 0) / pot];
        const isPreset = presets.some((pr) => pr.every((v, i) => Math.abs(v - f[i]) <= 0.011));
        if (!isPreset) out.push('This plan’s mix (' + Math.round(f[0] * 100) + '/' + Math.round(f[1] * 100) + '/' + Math.round(f[2] * 100) + ') is not a preset, so it now shows as Custom and is kept exactly as it was.');
      }
      if (ss.strategyId === 'buckets-in-order') out.push('This plan uses Buckets in order: the Pots & Valves row in its ranked table had shown Buckets’ figures. Re-run the overview to see the real comparison.');
      const lumps = (Array.isArray(ss.windfalls) ? ss.windfalls.filter((w) => w && w.amount > 0).length : 0) + (+ss.dbAmount > 0 ? 1 : 0);
      if (lumps) out.push('This plan has a lump sum or a final-salary pension: the “worst 12 months” figure for the strategies that buy an income now counts it.');
      if (pot > 0 && !ss.spStartDate && !(+ss.spWeeklyAmount > 0)) out.push('This plan has no State Pension entered: the comparison now says that its £12,000 a year from 67 is an assumption.');
      return out;
    }
  },
  {
    version: '6.1.0', date: '2026-09-07', engineVersion: '6.1.0',
    title: 'Taxable accounts and lump sums are now modelled, with the tax they really pay',
    summary: 'Money held outside a pension or ISA is now modelled properly: an investment account you already hold, and lump sums that arrive in retirement such as an inheritance or a house sale, with the tax each really pays and the limits on where the money can go. Every strategy and both main tools use it.',
    changes: [
      'Stress tester settings: a “Taxable investments today” section with the balance, what it holds, your tax band, relevant earnings, and whether to move money into your ISA each year (bed-and-ISA).',
      'Each lump sum says what it is (cash, an inherited pension or an inherited ISA) and what any taxable part will be held in; cash goes through this year’s ISA allowance and pension room first.',
      'The taxable account is drawn before the ISA, after capital gains tax; gilts held there are free of capital gains tax.',
      'Decision tool: monthly entry takes the taxable account’s balance and cost, sells from it before the ISA, works out capital gains tax with the yearly exemption, and carries the cost forward. Lump sums and bed-and-ISA are suggestions; it never moves money for you.',
      'Every strategy, including the ladder and floor strategies, now counts the taxable account and lump sums as money it can use.',
      'The “?” help pop-ups work on hover and touch, and the Assumptions & data page lists the taxable-account rules.'
    ],
    corrections: [
      'The pension contribution limit once you are drawing a pension is £10,000 a year (the MPAA), not £60,000, so a lump sum can shelter far less in a pension than before.',
      'The ISA allowance could be used up to three times in one year; it is now one allowance per tax year.',
      'Lump sums were fixed pounds although the form said “today’s money”; they now rise with inflation to the year they arrive (choose “level” for a fixed sum).',
      'The survivor check now keeps an inherited pension as a pension and passes an inherited ISA into the survivor’s ISA.',
      'Tax on the taxable account was worked out and then left out of the totals; it is now in lifetime tax.',
      'The ladder and floor strategies ignored lump sums received, which counted against them in the ranked table.',
      'With the ISA policy set to Hold, money was still moved into the ISA; it no longer is.'
    ],
    effects: {
      stress: [
        'Plans with no taxable account and no lump sums are unchanged. Plans with a lump sum show slightly lower, more realistic wealth; with the ISA policy on Hold, bed-and-ISA is ignored.'
      ],
      strategies: [
        'The ranked comparison now credits ladders and floors with lump sums and a taxable account, so the order can change for plans with either.'
      ],
      decision: [
        'Plans with no taxable account are unchanged. Two new monthly-entry boxes start at £0, the tax-year wizard has an optional box for gains already made this year, and nothing recorded is re-judged.'
      ],
      household: [
        'Results for couples with a partner’s pension or ISA may move, as the survivor check routes them correctly again.'
      ],
      budget: [],
      accumulation: []
    },
    actions: [
      'If you hold investments outside a pension or ISA, enter them in Stress tester settings → Your pot → Taxable investments today.',
      'Decision tool users: enter the taxable account’s balance and cost on your next monthly entry.',
      'If you expect an inheritance or a house sale, add it under Income streams and lump sums, saying what it is.',
      'If your ISA policy is Hold and band-fill recycling is on, decide whether you want recycled money going into an ISA you will not draw.',
      'Run the Stress tester and Strategies overview again if your plan has a lump sum or a taxable account.'
    ],
    notes: [
      'Rules used: ISA £20,000 a year; MPAA £10,000; dividend allowance £500; savings allowance £1,000 or £500; capital gains exemption £3,000 (18% or 24%); UK gilts free of capital gains tax.',
      'Not yet modelled: losses carried forward, and gilts in the taxable account grow at the general bond return rather than the gilt yield curve.'
    ],
    affects(scenario) {
      const out = [];
      const ss = scenario?.stressTool?.settings || {};
      const ds = scenario?.decisionTool?.settings || {};
      const windfalls = Array.isArray(ss.windfalls) ? ss.windfalls.filter((w) => w && w.amount > 0) : [];
      const hold = ss.isaDrawdownStrategy === 'hold';
      if (+ss.taxableStart > 0) out.push('This plan holds ' + gbp(ss.taxableStart) + ' in a taxable account: it is now drawn before the ISA and taxed on its dividends and gains (' + (ss.taxableMix === 'gilt' ? 'gilts, so free of capital gains tax' : 'held as ' + (ss.taxableMix || 'shares')) + ').');
      if (windfalls.length) out.push('This plan expects ' + windfalls.length + ' lump sum' + (windfalls.length > 1 ? 's' : '') + ' (' + windfalls.map((w) => gbp(w.amount) + ' in year ' + (w.year ?? '?')).join(', ') + '): each now goes into your ISA allowance and pension room first, and the rest into the taxable account.');
      if (hold && ss.bedAndIsa !== false && (+ss.taxableStart > 0 || windfalls.length)) out.push('The ISA is on Hold, so this plan no longer moves money into it each year (bed-and-ISA), and the part of a cash lump sum meant for the ISA stays in the taxable account.');
      if (hold && ss.bandFillRecycle) out.push('Band-fill recycling is on while the ISA is on Hold: recycled money lands in an ISA this plan never draws from, so review one of the two settings.');
      if (ds.locked) out.push('This plan is locked in the Decision tool: months already recorded are not worked out again, and the taxable-account boxes appear on your next entry.');
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
