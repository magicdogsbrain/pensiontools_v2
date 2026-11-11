/**
 * The words of a saver's check-in (research/saving-enough-and-check-in.md 5.4–5.7; release step R3). Data only — this
 * file imports nothing. Placeholders are written {likeThis} and filled by the screen; the figures are never here. The
 * saver rules hold: what goes in, never a contribution; on course, never on track; lasted in N futures out of 10; a bad
 * case is the worst 1 in 10 and a good case the best 1 in 10, said on the same screen; the history is a record, so its
 * figures are exact. The words follow what worked in the small-steps research the design names: start from today, small
 * steps, already on your way.
 */
export const CHECKIN = {
  /** 7.3.0: no check-in due — the last result and the next date; the form only when asked for. */
  anyway: 'Check in now anyway',
  title: 'Check in',
  lead: 'Tell your plan where you are today — your pot, your pay and what goes in — and see whether you are still on course, how your pot compares with where the plan expected it to be, and what has changed since last time.',
  firstLead: 'This is your first check-in. It draws your saving path from today’s figures, so each check-in after it has something fixed to be read against.',
  /** A plan that has stopped work (design 5.8): the page is its saving years, read only. */
  savingYearsTitle: 'Your saving years',
  notSaving: 'Your plan says you have stopped work, so there is no check-in here: Month by month took over from the month you stopped.',
  savingYears: 'Your check-ins from your saving years are kept below.',
  noAge: 'Your plan does not have your age today and the age you stop yet, so there is no check-in here. Add them first:',
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  locked: 'Your plan is locked, and a check-in changes nothing in it: your pot and what you pay in are read against the saving path drawn when you locked it.',
  /**
   * The limit carried from a plan drawn on and closed (research/plan-start.md §2 J), as What you pay in says it (the same
   * sentence as services/FlexibleAccess.js flexibleAccessWords, held to it by a test). Over it: what the last check-in said
   * goes in (`allowanceOver`), or before the first check-in what the plan says goes in (`allowanceOverPlan`).
   */
  allowance: 'Since you took money from your pension flexibly in {month}, what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply.',
  allowanceOver: 'What you said goes in comes to {yearly} a year, more than £10,000: the part above it is taxed back.',
  allowanceOverPlan: 'What goes in now comes to {yearly} a year, more than £10,000: the part above it is taxed back.',
  /** A saving plan made on going back to work, its change-over still to come: the months until then are the previous plan's. */
  notYet: 'This plan carries on from {month}, when you go back to work: check in with it from then. Until then your months are recorded on your previous plan.',
  noVerdict: {
    noAim: 'Your plan has no income set for when you stop, so a check-in records your pot and reads it against your saving path, but cannot say yet whether you are on course.',
    invalid: 'Some of your plan’s figures are outside what the test can take, so a check-in records your pot and reads it against your saving path, but cannot say yet whether you are on course.',
    notSaving: ''
  },
  noAimLink: 'Say what you would want to spend',
  aboutLink: 'About you and when',
  elsewhere: 'Anything else — your State Pension forecast, a final-salary pension, the age you have in mind, what you want to spend — is in your plan; a check-in does not change it.',
  elsewhereLinks: { about: 'About you and when', income: 'Money that comes in anyway', spend: 'What you spend' },
  sections: { where: 'Where you are today', changed: 'Has anything changed?', note: 'A note', often: 'How often', history: 'Your check-ins' },
  savedValue: '(last time: {value})',
  source: 'From your last check-in, or your plan',
  fields: {
    'ci.pension':     { label: 'Your pension pot today, in pounds', help: 'All your pension pots together, from your provider’s website or app, or your latest statement.' },
    'ci.isa':         { label: 'Your ISAs and savings today, in pounds', help: 'Blank if you would rather not say; 0 if there is nothing in them.', helpFirst: 'Blank if you would rather not say: your saving path then counts your pension only. 0 if there is nothing in them.', helpNeeded: 'Your saving path counts your ISAs and savings, so the check-in needs them. 0 if there is nothing in them.' },
    'ci.other':       { label: 'Anything else, in pounds (optional)', help: 'Other savings and investments, such as an ordinary investment account.' },
    'ci.pay':         { label: 'Your pay a year, before tax, in pounds', help: 'Blank if you pay in a fixed amount and would rather not say.' },
    'ci.kind':        { label: 'What goes into your pension each month', options: { share: 'A share of your pay', split: 'Your part and your employer’s, in pounds', total: 'One figure, in pounds' } },
    'ci.ownPct':      { label: 'Your part, % of your pay', help: 'With the tax the government adds back included: the figure on your payslip.' },
    'ci.employerPct': { label: 'Your employer’s part, % of your pay' },
    'ci.own':         { label: 'Your part, a month, in pounds', help: 'What lands in your pension from your pay, with the tax the government adds back included.' },
    'ci.employer':    { label: 'Your employer’s part, a month, in pounds' },
    'ci.total':       { label: 'All together, a month, in pounds', help: 'Everything that lands in your pension each month, including any employer’s part.' },
    'ci.savingsIn':   { label: 'Into ISAs and savings, a month, in pounds', help: 'From your take-home pay. 0 if nothing goes in.' },
    'ci.since':       { label: 'If what goes in changed since your last check-in: from which month?', labelAfterPause: 'At your last check-in you had stopped paying in. If you have started again, or what goes in changed: from which month?', help: 'Like 2027-03, or March 2027. Blank if it did not change, or changed this month.' },
    'ci.paused':      { label: 'Did you stop paying in for a while?', options: { no: 'No', yes: 'Yes, I stopped paying in for a while' } },
    'ci.pausedFrom':  { label: 'Stopped from (month)', help: 'Like 2027-03, or March 2027.' },
    'ci.pausedTo':    { label: 'Started again in (month)', help: 'Like 2027-09, or September 2027. Blank if you have not started again yet.' },
    'ci.note':        { label: 'For you: what changed, in a few words (optional)', help: 'Please leave out anything about your health. Up to 280 characters. It is kept with this check-in, goes in your plan’s download and is deleted with the plan.' },
    'ci.every':       { label: 'How often would you like to check in?', labelAgain: 'How often you check in', options: { year: 'Once a year (most people)', quarter: 'Each quarter', month: 'Each month' }, help: 'Once a year matches the yearly statement your pension sends. Checking much more often can make the ups and downs look bigger than they are.' }
  },
  errors: {
    'ci.pension':     { required: 'Type your pension pot today, for example 74,600. Type 0 if there is none yet.', notANumber: 'Figures only, like 74,600.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' },
    'ci.isa':         { required: 'Your saving path counts your ISAs and savings: type what is in them, or 0.', notANumber: 'Figures only, like 12,000.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' },
    'ci.other':       { notANumber: 'Figures only, like 5,000.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' },
    'ci.pay':         { required: 'A share needs the pay it is of: type your pay a year before tax, for example 38,000.', notANumber: 'Figures only, like 38,000.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £5,000,000, please.' },
    'ci.kind':        { notAnOption: 'One of the three, please.' },
    'ci.ownPct':      { required: 'Type your part as a percentage of your pay, for example 5. Type 0 if you pay nothing.', notANumber: 'A percent, like 5 or 6.5.', range: 'A percent from 0 to 100, please.' },
    'ci.employerPct': { required: 'Type your employer’s part as a percentage of your pay, for example 3. Type 0 if they pay nothing.', notANumber: 'A percent, like 3 or 4.5.', range: 'A percent from 0 to 100, please.', overLimit: 'Your part and your employer’s part together can be up to £10,000 a month.' },
    'ci.own':         { required: 'Type what lands from your pay each month, for example 450. Type 0 if nothing does.', notANumber: 'Figures only, like 450.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £10,000 a month, please.' },
    'ci.employer':    { required: 'Type what your employer pays in each month, for example 250. Type 0 if they pay nothing.', notANumber: 'Figures only, like 250.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £10,000 a month, please.', overLimit: 'Your part and your employer’s part together can be up to £10,000 a month.' },
    'ci.total':       { required: 'Type what goes into your pension each month, for example 700. Type 0 if nothing does.', notANumber: 'Figures only, like 700.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £10,000 a month, please.' },
    'ci.savingsIn':   { notANumber: 'Figures only, like 200.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £10,000 a month, please.' },
    'ci.since':       { notAMonth: 'A month like 2027-03 or March 2027, please.', inFuture: 'A month up to this one, please.', beforeLast: 'A month after your last check-in, please.' },
    'ci.paused':      { notAnOption: 'No or yes, please.' },
    'ci.pausedFrom':  { required: 'The month you stopped paying in, like 2027-03 or March 2027.', notAMonth: 'A month like 2027-03 or March 2027, please.', inFuture: 'A month up to this one, please.' },
    'ci.pausedTo':    { notAMonth: 'A month like 2027-09 or September 2027, please.', inFuture: 'A month up to this one, please.', beforeFrom: 'A month after the one you stopped, please.' },
    'ci.note':        { tooLong: 'Up to 280 characters, please.' },
    'ci.every':       { notAnOption: 'One of the three, please.' }
  },
  button: 'Check in',
  again: 'Checking in again this month replaces this month’s check-in.',
  working: 'Working out where you are…',
  dropWarning: 'Your oldest check-in will be dropped to make room. Download your plan from “Your plans” to keep a copy of every one.',

  /** The result (5.5), in this order: the verdict from here, what would be enough, against the path, what changed. */
  result: {
    checkedIn: 'Checked in for {month}',
    lastTitle: 'Your last check-in: {month}',
    enoughTitle: 'To be on course from here',
    pathTitle: 'Against your saving path',
    changedTitle: 'Since your last check-in ({month})',
    /** The frozen reading (a check-in read again later): said from what was kept, the band first. */
    band: { yes: 'On course', close: 'Close', no: 'Not on course' },
    lasted: '{band}: paying in as you did then, your money lasted {words}.',
    spend: 'Paying in as then, you could spend {bad} a month from when you stop in 9 futures out of 10 ({middling} in a middling case), against the {aim} a month you want, after tax at today’s prices.',
    gap: 'That is {gap} a year less than you want.',
    /** 7.8.0: a reading of the level (kept while the figures are weighted by how long people live); older readings keep the lines above */
    lastedW: '{band} at {level}: paying in as you did then, counting how long people your age live, your money lasted as long as you do {words}.',
    lastedFixedW: '{band} at {level}: paying in as you did then, your money lasted {words}.',
    spendW: 'Paying in as then, you could spend {atLevel} a month from when you stop at {level}, against the {aim} a month you want, after tax at today’s prices.',
    enoughW: {
      share: '{pct}% of your pay in all ({amount} a month) would put you on course at {level}.',
      pounds: '{amount} a month going into your pension would put you on course at {level}.',
      outOfReach: 'Even all of your pay going in would not be on course. Stopping later or spending less are the other ways: see What you pay in.'
    },
    enough: {
      share: '{pct}% of your pay in all ({amount} a month) would put you on course, which is 9 in 10.',
      pounds: '{amount} a month going into your pension would put you on course, which is 9 in 10.',
      outOfReach: 'Even all of your pay going in would not be on course. Stopping later or spending less are the other ways: see What you pay in.'
    },
    four: {
      share: 'For 3 futures out of 4: {pct}% of your pay in all ({amount} a month).',
      pounds: 'For 3 futures out of 4: {amount} a month.',
      fourNow: 'For 3 futures out of 4, what you paid in was already enough.'
    },
    /** Beside the verdict, as What you pay in says them. */
    couple: 'This reads your plan on its own; reading two linked plans together comes later.',
    rise: 'This reads what you pay in as going up with prices; your plan raises it by {pct}% a year.',
    riseNone: 'This reads what you pay in as going up with prices; your plan keeps it the same in pounds each year.',
    seeSaving: 'The other ways, and the answer worked out again on today’s figures:',
    seeSavingLink: 'What you pay in',
    path: {
      start: 'Your saving path starts at this check-in: it is drawn from these figures, so the check-ins after it are read against something fixed.',
      below: 'Your {what} of {actual} is below the bad-case line ({low}) the plan expected by now.',
      lower: 'Your {what} of {actual} is between the bad-case line ({low}) and the middle ({expected}) the plan expected by now.',
      upper: 'Your {what} of {actual} is between the middle ({expected}) and the good-case line ({high}) the plan expected by now.',
      above: 'Your {what} of {actual} is above the good-case line ({high}) the plan expected by now.',
      at: 'In 9 futures out of 10 it expected at least {low}.',
      /** Read again after the path has been drawn anew: the band and the middle figure that were kept. */
      keptBelow: 'Your {what} was below the bad-case line; the middle the plan expected then was {expected}.',
      keptLower: 'Your {what} was between the bad-case line and the middle the plan expected then ({expected}).',
      keptUpper: 'Your {what} was between the middle the plan expected then ({expected}) and the good-case line.',
      keptAbove: 'Your {what} was above the good-case line; the middle the plan expected then was {expected}.',
      what: { pot: 'pot', pension: 'pension' },
      lines: 'The bad-case line is the worst 1 in 10 of the futures the path was drawn on; the good-case line is the best 1 in 10.',
      /** A path drawn before 6.22.0 is in the prices of the day it was drawn: its lines are said in the pot's own pounds. */
      prices: 'Your saving path was drawn in the prices of {from}. Its figures here are raised by 2.5% a year since then, as the path itself assumes, so they are in the same pounds as your pot in {month}.',
      both: 'Behind the path and on course can both be true: the plan had room to spare.'
    },
    changed: {
      pot: 'Your {what} went from {from} to {to}.',
      paid: 'Paid in, as recorded: into your pension {runs}, {total} in all.',
      paidNothing: 'Paid in, as recorded: nothing into your pension.',
      savings: 'Into ISAs and savings {runs}, {total} in all.',
      savingsNothing: 'Into ISAs and savings, nothing.',
      run: '{perMonth} a month for {months} month{s}',
      and: ' and ',
      rest: 'Markets, charges and anything not recorded: {sign}{rest}.',
      paused: 'You stopped paying in from {from}.',
      pausedTo: 'You stopped paying in from {from} and started again in {to}.',
      pausedBefore: 'You had stopped paying in from {from}. The month you started again is not recorded, so nothing is counted as paid in since.'
    },
    thenNow: 'Then: lasted {then}. Now: {now}.',
    thenNowEnough: 'To be on course then: {then}; now: {now}.',
    enoughShort: { share: '{pct}% of your pay in all', pounds: '{amount} a month', outOfReach: 'out of reach by paying in' },
    caution: 'A pot can move a lot in a year. The path’s bad-case and good-case lines show how far, in 9 futures out of 10.',
    next: 'Next check-in: {month}.',
    calendar: 'Add to my calendar',
    calendarHelp: 'Saves a calendar file that holds the date of your next check-in and the words “PensionTools check-in”: no figures, no email.',
    useInPlan: {
      share: 'You now pay in {now}% in all; your plan says {plan}%.',
      pounds: 'You now pay in {now} a month; your plan says {plan}.',
      savings: 'You now put {now} a month into ISAs and savings; your plan says {plan}.'
    },
    useButton: { share: 'Use {now}% in my plan', pounds: 'Use {now} a month in my plan', savings: 'Use {now} a month in my plan' },
    useHelp: 'This changes What you pay in, and nothing else. A locked plan stays locked.',
    pathDiffers: 'The path was drawn paying in {drawn} a month; you now pay in {now}.',
    restart: 'Start the path again from today',
    restartHelp: 'Draws a new saving path from your last check-in’s figures. The old one is kept, and your check-ins stay as they were read.',
    noPath: 'There is no saving path to read your pot against yet: it is drawn once your plan has your age today and the age you stop.'
  },

  /** "Your check-ins" (5.7): one row a check-in, newest first; exact figures (a record). */
  history: {
    none: 'No check-ins yet.',
    columns: { month: 'Month', pot: 'Your pot', pay: 'Pay', payIn: 'What goes in', path: 'Against the path', lasted: 'Lasted', enough: 'To be on course', note: 'Note' },
    pot: '{pension} pension',
    potIsa: '{pension} pension, {isa} ISAs and savings',
    payIn: {
      share: '{pct}% of your pay in all ({amount} a month)',
      split: '{amount} a month (you {own}, your employer {employer})',
      total: '{amount} a month'
    },
    savingsIn: ', {amount} a month into ISAs and savings',
    paused: 'Stopped from {from}',
    pausedTo: 'Stopped from {from} to {to}',
    path: { below: 'Below the bad-case line', lower: 'Between the bad-case line and the middle', upper: 'Between the middle and the good-case line', above: 'Above the good-case line', start: 'Where the path starts' },
    pathMiddle: ' (middle {expected})',
    lasted: { yes: 'On course, {words}', close: 'Close, {words}', no: 'Not on course, {words}' },
    enough: { share: '{pct}% of your pay in all', pounds: '{amount} a month', outOfReach: 'Out of reach by paying in' },
    none2: '—',
    pathFrom: 'Read against the path from {month} ({why})',
    why: { lock: 'the lock', first: 'your first check-in', again: 'started again' }
  },

  buttons: { back: 'Back to your plan', undo: 'Undo', close: 'Close' },
  toast: {
    checkedIn: 'Checked in for {month}.',
    pathAgain: 'Your saving path starts again from {month}.',
    usedInPlan: 'What you pay in is now as your check-in says.',
    useSame: 'Your plan already says this.',
    undone: 'Put back as it was.',
    unchanged: 'Nothing has changed.',
    savedShort: 'Saved.'
  },
  problems: {
    notSaving: 'Your plan says you have stopped work, so a check-in is not offered here. Nothing was changed.',
    notYet: 'This plan carries on from a later month, so a check-in is not taken here yet. Nothing was changed.',
    noWorker: 'This browser cannot work out the check-in here, so nothing was written. Try again in another browser.',
    noRun: 'Sorry, the check-in could not be worked out. Nothing was written: try again.',
    locked: 'This plan is locked, so nothing was changed.',
    restartOld: 'The path starts again from a check-in made this month. Check in first, then start it again. Nothing was changed.',
    notHere: 'That plan is not in this account. Nothing was changed.',
    usedUp: 'Your free time without an account is used up. Sign in to keep and change this plan.',
    nobody: 'Sign in to change this plan. Nothing was changed.',
    storage: 'This browser would not keep the check-in. Nothing was changed.',
    failed: 'Sorry, the check-in could not be kept. Nothing was changed.',
    problems: 'Have a look at the boxes marked above.',
    readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.'
  }
};
