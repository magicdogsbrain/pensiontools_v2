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
    /** The same box under "I have stopped work" (6.51.0): optional, a month this one or earlier, however long ago. */
    stoppedMonth: { label: 'The month you stopped', help: 'If you know it. Like 2023-10, or October 2023. The tax year you stopped in is then your plan’s first year; the plan runs from where it stands today.' },
    // nowStopped: the 'now' choice when work stopped this tax year — the planner names that year the same way (6.51.0)
    // other: the years between the stop's and this one, folded into one choice with a list when there are many (6.51.0)
    startWhen: { label: 'Your plan’s first tax year', options: { stop: '{yearStop}, the tax year you stopped work', now: 'This tax year, {yearNow}', saved: '{yearSaved}, as saved', other: 'Another tax year' }, notSaved: '{yearSaved}', nowStopped: 'This tax year, {yearNow}, the tax year you stopped work', otherList: 'The tax year' },
    endAge:    { label: 'Plan to age', help: 'The age the money has to last to.' },
    sex:       { label: 'For a', options: { notSaid: 'person (not said)', m: 'man', f: 'woman' } },
    chance:    { label: 'How cautious', options: { 10: '1 in 10 live beyond it (cautious)', 25: '1 in 4 live beyond it' } }
  },
  /** The problems, in plain words, by field path and message id. */
  errors: {
    age:       { required: 'Type your age today.', notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 100.' },
    stopped:   { required: 'Say whether you have stopped work.', notAnOption: 'Choose one of the three.' },
    stopAge:   { required: 'Type the age you stop.', notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 85, please.', 'stop-before-age': 'The age you stop cannot be below your age today.' },
    stopMonth: { required: 'Type the month you stop, like 2030-06 or June 2030.', notAMonth: 'That is not a month we can read: try 2030-06 or June 2030.', 'month-passed': 'That month has passed. If you have stopped work, choose the first answer and type it there.', 'month-ahead': 'That month is still ahead. For a stop to come, choose “I will stop in a month”.', 'too-early': 'That is before you were 16. Type the month you stopped work.' },
    startWhen: { required: 'Choose your plan’s first tax year.', notAnOption: 'Choose one of the years offered.' },
    endAge:    { required: 'Type the age to plan to.', notANumber: 'Whole years, please.', tooLow: 'An age the plan can run to, please.', tooHigh: 'An age up to 110, please.', 'too-short': 'The plan has to run at least {min} years: an age of {minAge} or more.' },
    sex:       { notAnOption: 'Choose one.' },
    chance:    { notAnOption: 'Choose one.' }
  },
  suggest: {
    title: 'Suggest from how long people live',
    button: 'Suggest',
    /** After "Suggest": the age it filled in and why. {who}: men or women; {chance}: 10 or 25. */
    result: { 10: 'Age {age}: 1 in 10 {who} of {ageNow} live beyond it.', 25: 'Age {age}: 1 in 4 {who} of {ageNow} live beyond it.' },
    /** 7.8.0: the sex left unsaid reads the women's figures */
    notSaid: 'We used the figures for women, who tend to live longer, because you did not say.',
    note: 'From the Office for National Statistics’ figures for how long people born in each year are likely to live (England and Wales). Planning only to the half-way age would give a 1 in 2 chance of outliving the plan, so it is not offered.'
  },
  /** The derived figures (2): shown, never asked. */
  derivedTitle: 'What this works out to',
  derived: {
    noAge: 'Without your age, the plan cannot be pinned to a tax year. Type your age to pin it.',
    stopIn: 'You stop work in {month}, at {age}.',
    monthAs: 'Your plan takes that as stopping at {age}, in {month}.',
    firstYear: 'The plan’s first tax year is {year}, from 6 April {y}.',
    runs: 'Your plan runs {years} years, from {from} to age {endAge}.',
    stepsFrom: 'Income steps start at age {age}.',
    stoppedIn: 'You stopped work in {month}.',
    /** A draft saved with a later start than it should have (7.4.0): read from the earlier year until it is saved. */
    laterStop: 'Your plan runs from {year}, the tax year you stopped work.',
    laterNow: 'Your plan runs from {year}, this tax year.',
    started: 'Your plan’s income started in {year}. It is worked out from where it stands today: tax year {yearNow}, at {ageNow}, for the years that are left.'
  },
  notUsed: 'Not used by this way of drawing.',
  partner: '{name}’s ages are on {name}’s plan.',
  partnerLink: 'Open ‘{name}’: about you and when',
  buttons: { save: 'Save', cancel: 'Cancel', undo: 'Undo', close: 'Close', back: 'Back to your plan' },
  /** After a save. */
  toast: { saved: 'Saved. Your plan now runs {years} years, to age {endAge}.', runsToPot: 'Saved. Your plan now runs {years} years, to age {endAge}. Stopping at {stopAge}, your pension then could be {potAfter} ({potBefore} stopping at {stopBefore}).', staleLeft: 'Left as it is, starting in {yearSaved}. You will not be asked again for that year.', savedShort: 'Saved.', undone: 'Put back as it was.', unchanged: 'Nothing has changed.',
    stopSaved: 'Saved: you stopped work in {month}.', stopLeft: 'Left as it is. You will not be asked again; you can still say it under “Say when you stopped work”.' },
  /**
   * A locked plan's start (6.53.0): the month work stopped, asked once (the plan stays locked; the month changes no figure by
   * itself). The move of the start under the lock (6.55.0 to 7.9.0) is gone: the start changes by unlock and a new lock.
   */
  lockedStart: {
    ask: 'When did you stop work? Your plan stays locked, and saying the month changes no figure by itself.',
    askHelp: 'It is kept with your plan. To start the plan from the tax year you stopped, unlock it, change the start here and lock it again.',
    leaveHelp: 'Leave it and you will not be asked again.',
    /** The box's own help: the unlocked step's speaks of a choice this page does not have. */
    help: 'Like 2023-10, or October 2023.',
    save: 'Save the month',
    leave: 'Leave it',
    /** The month already said, put right while the plan is locked. */
    change: 'Change the month you stopped work',
    /** After "Leave it": not asked again, but the month can still be said, without unlocking. */
    later: 'Say when you stopped work',
    /**
     * A locked plan stored with a start later than this tax year (7.10.0): said, with how the start changes. It is never moved
     * under the lock any more (research/v7/replan-nov-2026.md §2 principle 13).
     */
    laterLocked: 'Your plan is set to start in {start}. To change its start, unlock it from “Your plan as locked”, change the start here, and lock it again.',
    /** The box's own errors: the unlocked step's speak of a stop still to come. */
    errors: {
      required: 'Type the month you stopped work, like 2023-10 or October 2023.',
      notAMonth: 'That is not a month we can read: try 2023-10 or October 2023.',
      'month-ahead': 'That month is still ahead: type the month you stopped, this one or an earlier one.',
      'too-early': 'That is before you were 16. Type the month you stopped work.'
    }
  },
  /** An out-of-date draft (the planner's own offer): the start year has passed. */
  stale: {
    line: 'This plan was set to start in {yearSaved}, which has passed. Update it to start now ({year})?',
    update: 'Update it to start in {year}',
    leave: 'Leave it',
    help: 'Update sets “I have stopped work” and “This tax year” in the boxes and saves; the steps and the figures by year move with it. Leave it keeps everything as saved and does not ask again for that year.'
  },
  /** Why a save did not happen (4). Nothing is ever written when one of these is shown. */
  problems: {
    locked: 'This plan is locked, so nothing was changed. To change it, unlock it from “Your plan as locked”.',
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
