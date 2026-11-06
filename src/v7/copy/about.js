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
    sex:       { label: 'For a', options: { m: 'man', f: 'woman' } },
    chance:    { label: 'How cautious', options: { 10: '1 in 10 live beyond it (cautious)', 25: '1 in 4 live beyond it', 50: 'Half of people live beyond it' } }
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
    /** After "Suggest": the age it filled in and why. {who}: men or women; {chance}: 10, 25 or 50. */
    result: { 10: 'Age {age}: 1 in 10 {who} of {ageNow} live beyond it.', 25: 'Age {age}: 1 in 4 {who} of {ageNow} live beyond it.', 50: 'Age {age}: half of {who} of {ageNow} live beyond it.' },
    note: 'Rounded figures of the kind the Office for National Statistics publishes. Planning only to the half-way age gives a 1 in 2 chance of outliving the plan.'
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
  toast: { saved: 'Saved. Your plan now runs {years} years, to age {endAge}.', staleLeft: 'Left as it is, starting in {yearSaved}. You will not be asked again for that year.', savedShort: 'Saved.', undone: 'Put back as it was.', unchanged: 'Nothing has changed.',
    stopSaved: 'Saved: you stopped work in {month}.', stopLeft: 'Left as it is. You will not be asked again; you can still say it under “Say when you stopped work”.',
    /** The move of a locked plan's start, written (no Undo: the planner offers none). */
    moved: 'The plan’s start is now {year}, the tax year you stopped work. The plan document and plan vs actual were written again; the earlier plan document is kept as a past version.',
    movedNow: 'The plan’s start is now {year}, this tax year. The plan document and plan vs actual were written again; the earlier plan document is kept as a past version.' },
  /**
   * A locked plan's start (6.53.0): the month work stopped, asked once (the plan stays locked; the month changes no figure by
   * itself), and the move to the tax year work stopped — made here from 6.55.0, after a confirm that says what the planner's
   * own confirm says, line for line (answers/plan/about.js moveConfirmOf).
   */
  lockedStart: {
    ask: 'When did you stop work? Your plan stays locked, and saying the month changes no figure by itself.',
    askHelp: 'Once it is said, your plan can start from the tax year you stopped.',
    /** Only where the plan has nothing to move: the plain question can be put away. */
    leaveHelp: 'Leave it and you will not be asked again.',
    /** No month said, on a plan set to start later than this tax year (7.4.0): start it now instead. */
    now: 'Already drawing from your pension? Your plan is set to start in {yearStart}. It can start this tax year, {yearStop}, from where it stands today. The plan stays locked.',
    nowOpen: 'I’m already drawing: start it this tax year…',
    /** The State Pension given only as a plan year (7.4.0): its date is asked, and written with the move. */
    spLabel: 'When does your State Pension start?',
    spHelp: 'The date on your State Pension forecast, like 14 March 2032. It is saved with the move, so your State Pension keeps its own tax year.',
    spError: 'That is not a date we can read: try 14 March 2032.',
    /** The tax year the plan pays the State Pension from as it stands, named beside the box (7.4.0). */
    spPlanYear: 'Your plan pays it from {year} as it stands. A date in another tax year moves it there.',
    /** The box's own help: the unlocked step's speaks of a choice this page does not have. */
    help: 'Like 2023-10, or October 2023.',
    save: 'Save the month',
    leave: 'Leave it',
    /** The month already said, put right while the plan is locked. */
    change: 'Change the month you stopped work',
    /** After "Leave it": not asked again, but the month can still be said, without unlocking. */
    later: 'Say when you stopped work',
    move: 'You stopped work in {month}, and your plan is set to start in {yearStart}. It can start from {yearStop}, the tax year you stopped: your months since then are read against the plan. Your first income step keeps its amount and runs from {yearStop}; your later steps keep their ages. The plan stays locked.',
    moveLevel: 'You stopped work in {month}, and your plan is set to start in {yearStart}. It can start from {yearStop}, the tax year you stopped: your months since then are read against the plan. Your income stays the same, now from {yearStop}, and the plan still ends at the same age. The plan stays locked.',
    moveHelp: 'Before anything is written, this page says exactly what changes: the plan document and plan vs actual are written again from the new start, and the earlier ones are kept.',
    blocked: 'You stopped work in {month}, and your plan is set to start in {yearStart}. Its start cannot be moved while the plan is locked: your State Pension is set by the plan’s count of years, and moved it would read as starting at 67. To change the start, unlock the plan.',
    open: 'Move the plan’s start…',
    /** The confirm (the planner's moveStartQuestion, in the same words): one line for each thing that changes, and what does not. */
    confirm: {
      title: 'Move the plan’s start to {yearStop}?',
      intro: 'Here is exactly what changes:',
      lines: {
        first: 'The plan’s first tax year becomes {yearStop}, the tax year you stopped work ({month}); it was {yearStart}. The plan stays locked: nothing is unlocked and no setting is added.',
        firstNow: 'The plan’s first tax year becomes {yearStop}, this tax year; it was {yearStart}. The plan stays locked: nothing is unlocked, and no month you stopped work is saved.',
        spDate: 'Your State Pension is saved as starting on {date}, so it keeps its own tax year.',
        spDateMoved: 'That date is in {dateTaxYear}; the plan had paid your State Pension from {paidFrom}, so it now starts in {dateTaxYear}.',
        steps: 'Your income: the first step keeps its amount ({amount} a year) and now runs from {yearStop}, at {age}; your later steps keep their ages.',
        stepsBare: 'Your income: the first step keeps its amount and now runs from {yearStop}; your later steps keep their ages.',
        level: 'Your income: it stays {amount} a year, now from {yearStop}, at {age}.',
        levelBare: 'Your income: it stays as it is, now from {yearStop}.',
        ends: 'The plan still runs to age {endAge}, {n} years longer from its new start.',
        endsOne: 'The plan still runs to age {endAge}, one year longer from its new start.',
        dated: 'Your lump sums, one-off spends, other income and final-salary pension keep their tax years.',
        months: '{n} recorded months ({first} to {last}) keep every figure you entered. They now count from the new start, {yearStop}.',
        monthOne: 'One recorded month ({first}) keeps every figure you entered. It now counts from the new start, {yearStop}.',
        document: 'The plan document and plan vs actual are written again from the new start, from your pots as they stood when you locked the plan: no year you have already lived is bought or paid for again. The earlier plan document is kept as a past version, and the earlier plan vs actual with the plan’s saved figures.',
        documentLadder: 'The plan document and plan vs actual are written again from the new start, from your pots as they stood when you locked the plan: the gilt ladder is bought from {runYear} on, no year you have already lived is bought or paid for again. The earlier plan document is kept as a past version, and the earlier plan vs actual with the plan’s saved figures.',
        sp: 'Your State Pension still starts in {spYear}, as before; only the plan’s count of years to it changes ({after} from the new start, not {before}).',
        spNoBefore: 'Your State Pension still starts in {spYear}, as before; only the plan’s count of years to it changes ({after} from the new start).',
        more: 'The figures move: the plan counts {n} more years to the same end age, and the years already lived are no longer run again.',
        moreOne: 'The figures move: the plan counts one more year to the same end age, and the years already lived are no longer run again.',
        moreLadder: 'The figures move: the plan counts {n} more years to the same end age, and the ladder’s cost leaves out the years already lived.',
        moreLadderOne: 'The figures move: the plan counts one more year to the same end age, and the ladder’s cost leaves out the years already lived.',
        fill: 'Months you did not record since you stopped can then be filled in, in Month by month: set each earlier tax year up first.',
        notAffected: 'Not affected: what you hold, what you spend, and the tax years you set up.'
      },
      yes: 'Move the start to {yearStop}',
      no: 'Keep it as it is',
      working: 'Moving the plan’s start and writing the plan document again…',
      progress: 'How far the working has got'
    },
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
    readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
    // the move of a locked plan's start (6.55.0)
    noMove: 'This plan’s start cannot be moved: it is not locked, or it does not say a month you stopped work earlier than its first tax year. Nothing was changed.',
    notLocked: 'This plan is not locked, so its start moves with its own Save. Nothing was changed.',
    noWorker: 'This browser cannot run the plan’s test in the background, so the plan document cannot be written here. The classic planner moves the same plan’s start. Nothing was changed.',
    noRun: 'Sorry, the plan’s test gave no figures to write. Nothing was changed.'
  },
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  saving: 'Saving…'
};
