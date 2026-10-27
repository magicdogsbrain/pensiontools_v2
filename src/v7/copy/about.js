/**
 * The words of "About you and when" (research/v7/editing-in-v7.md 2, 4). Data only — this file imports nothing.
 * Placeholders are written {likeThis} and filled by the screen. The figures are never here.
 */
export const ABOUT = {
  title: 'About you and when',
  lead: 'Each fact once, by age. The plan works the rest out and shows it below.',
  /** The saved value beside a box, and where it came from. */
  savedValue: '({value})',
  source: { saved: 'From your plan, saved {date}', savedUndated: 'As saved in the plan', locked: 'Fixed when you locked the plan on {date}.' },
  /** The labels, options and help, by field path. */
  fields: {
    age:       { label: 'Your age today', help: 'Whole years.' },
    stopped:   { label: 'Have you stopped work?', options: { yes: 'I have stopped work, or am taking money from the plan now', age: 'I will stop at an age', month: 'I will stop in a month' } },
    stopAge:   { label: 'The age you stop' },
    stopMonth: { label: 'The month you stop', help: 'Like 2030-06, or June 2030.' },
    startWhen: { label: 'When the plan’s income starts', options: { now: 'This tax year, {yearNow}', april: 'Next April, {yearApril}', saved: '{yearSaved}, as saved' } },
    endAge:    { label: 'Plan to age', help: 'The age the money has to last to.' },
    sex:       { label: 'For a', options: { m: 'man', f: 'woman' } },
    chance:    { label: 'How cautious', options: { 10: '1 in 10 live beyond it (cautious)', 25: '1 in 4 live beyond it', 50: 'Half of people live beyond it' } }
  },
  /** The problems, in plain words, by field path and message id. */
  errors: {
    age:       { required: 'Type your age today.', notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 100.' },
    stopped:   { required: 'Say whether you have stopped work.', notAnOption: 'Choose one of the three.' },
    stopAge:   { required: 'Type the age you stop.', notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 85, please.', 'stop-before-age': 'The age you stop cannot be below your age today.' },
    stopMonth: { required: 'Type the month you stop, like 2030-06 or June 2030.', notAMonth: 'That is not a month we can read: try 2030-06 or June 2030.', 'month-passed': 'That month has passed.' },
    startWhen: { required: 'Choose when the plan’s income starts.', notAnOption: 'Choose one of the years offered.' },
    endAge:    { required: 'Type the age to plan to.', notANumber: 'Whole years, please.', tooLow: 'An age the plan can run to, please.', tooHigh: 'An age up to 110, please.', 'too-short': 'The plan has to run at least {min} years: an age of {minAge} or more.' },
    sex:       { notAnOption: 'Choose one.' },
    chance:    { notAnOption: 'Choose one.' }
  },
  suggest: {
    title: 'Suggest from how long people live',
    button: 'Suggest',
    /** After "Suggest": the age it filled in and why. {who}: men or women; {chance}: 10, 25 or 50. */
    result: { 10: 'Age {age}: 1 in 10 {who} of {ageNow} live beyond it.', 25: 'Age {age}: 1 in 4 {who} of {ageNow} live beyond it.', 50: 'Age {age}: half of {who} of {ageNow} live beyond it.' },
    note: 'Rounded figures of the kind the Office for National Statistics publishes. Planning only to the half-way age gives a 1 in 2 chance of outliving the plan.'
  },
  /** The derived figures (2): shown, never asked. */
  derivedTitle: 'What this works out to',
  derived: {
    noAge: 'Without your age, the plan is taken to start next April. Type your age to pin it to a tax year.',
    stopIn: 'You stop work in {month}, at {age}.',
    monthAs: 'Your plan takes that as stopping at {age}, in {month}.',
    firstYear: 'The plan’s first tax year is {year}, from 6 April {y}.',
    runs: 'Your plan runs {years} years, from {from} to age {endAge}.',
    stepsFrom: 'Income steps start at age {age}.'
  },
  notUsed: 'Not used by this way of drawing.',
  partner: '{name}’s ages are on {name}’s plan.',
  partnerLink: 'Open ‘{name}’: about you and when',
  buttons: { save: 'Save', cancel: 'Cancel', undo: 'Undo', close: 'Close', back: 'Back to your plan' },
  /** After a save. */
  toast: { saved: 'Saved. Your plan now runs {years} years, to age {endAge}.', staleLeft: 'Left as it is, starting in {yearSaved}. You will not be asked again for that year.', savedShort: 'Saved.', undone: 'Put back as it was.', unchanged: 'Nothing has changed.' },
  /** An out-of-date draft (the planner's own offer): the start year has passed. */
  stale: {
    line: 'This plan was set to start in {yearSaved}, which has passed. Update it to start now ({year})?',
    update: 'Update it to start in {year}',
    leave: 'Leave it',
    help: 'Update sets “I have stopped work” and “This tax year” in the boxes and saves; the steps and the figures by year move with it. Leave it keeps everything as saved and does not ask again for that year.'
  },
  /** Why a save did not happen (4). Nothing is ever written when one of these is shown. */
  problems: {
    locked: 'This plan is locked, so nothing was changed. The planner unlocks it.',
    notHere: 'That plan is not in this account. Nothing was changed.',
    usedUp: 'Your free time without an account is used up. Sign in to keep and change this plan.',
    nobody: 'Sign in to change this plan. Nothing was changed.',
    storage: 'This browser would not keep the change. Nothing was changed.',
    failed: 'Sorry, the change could not be saved. Nothing was changed.',
    problems: 'Have a look at the boxes marked above.',
    readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.'
  },
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  saving: 'Saving…'
};
