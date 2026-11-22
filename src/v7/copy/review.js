/**
 * The words of "Your review" (7.10.0; research/v7/replan-nov-2026.md §6; spec-7100 §8): one page in every phase. Data only —
 * this file imports nothing. Placeholders are written {likeThis} and filled by the screen; the figures are never here. A
 * review reads where the plan stands and changes nothing unless the person presses a named button; a move is never a
 * deviation, and a tactical choice is never "leaving the plan". Every % says what it is a share of.
 *
 * Audiences (wording.test.js): `living.*` a person who has stopped work; `moving.*`, `agreement.*`, `window.*` and `level.*` a
 * saver; everything else both.
 */
export const REVIEW = {
  title: 'Your review',
  /** Under the title: how often it falls. */
  often: { taxYear: 'Due once a tax year', year: 'Due once a year', quarter: 'Due every three months', month: 'Due every month' },
  next: 'Your next review: {month}.',
  nextAny: 'Review your plan whenever you like.',
  dueNow: 'Your review is due now.',
  last: 'Your last review was on {on}.',
  /** A plan that closes, a closed one, the example, a plan shown as saved. */
  closing: 'This plan closes at the end of {month}. Reviews carry on with the plan that carries it on.',
  closed: 'This plan is closed. Reviews carry on with the plan that carries it on.',
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  example: 'This is the example plan: a review cannot be saved on it. A copy of it can be reviewed.',
  noAge: 'Your plan does not have your age today and the month you stop work yet, so it cannot be reviewed. Add them on About you and when.',
  aboutLink: 'About you and when',
  /** Off course by the person's own rule, said at the top of the page. */
  offCourse: {
    success: 'At your last two reviews that worked out the chance, the money lasted as long as you do {a} and then {b}; your line is {line} in 20. Below is what you can change.',
    plain: 'At your last two reviews that worked out the chance, the money did not last as long as you do often enough for your line of {line} in 20. Below is what you can change.',
    guardrails: 'At your last two reviews your plan took more than a fifth more of what your pots hold than it took when the plan as locked began. Below is what you can change.'
  },
  change: 'Change',
  cancel: 'Keep it as it is',

  moving: {
    lead: 'You are in your move window: {left} left, to {stop}. This shows how far what you hold is from the mix your plan moves to, and what that does to the money. Nothing about your plan changes unless you say so.',
    leadNoStop: 'You are in your move window. This shows how far what you hold is from the mix your plan moves to, and what that does to the money. Nothing about your plan changes unless you say so.',
    confirmStop: 'Did you stop work in {stop}? If you have, say so on About you and when; if not, change the month there.',
    noRecord: 'You have not recorded what you hold. You can record it when you like; until then this reads the plan as it stands.',
    holdLink: 'What you hold',
    title: 'What you hold, against the mix your plan moves to',
    bucket: {
      shares: 'Shares: {held}% of your pension now; your plan moves to {plan}%.',
      bonds: 'Bonds: {held}% of your pension now; your plan moves to {plan}%.',
      cash: 'Cash: {held}% of your pension now; your plan moves to {plan}%.',
      diversifiers: 'Other investments: {held}% of your pension now; your plan moves to {plan}%.'
    },
    onTrack: 'At this pace the move finishes by {stop}.',
    behind: 'At this pace the move is behind: £{n} in every £100 of your pension is still to move. You can move some now, or accept what you hold below.',
    untagged: 'We could not tell what {name} holds, so it is counted as shares in these figures, as What you hold counts it. You can say what it holds there.',
    noReading: 'We could not tell what any line of your pension holds, so there is nothing to compare yet. You can say what each holds on What you hold.',
    ladder: 'Your ladder: {held} of {needed} of your plan’s gilts are held.',
    ladderYears: 'Not held yet: the gilts for {years}.',
    ladderPart: 'Held in part: the gilt for {years}.',
    ladderPartAgreed: 'Held in part, as you chose to hold it: the gilt for {years}.',
    ladderLater: 'The ladder’s years show once the plan is locked.',
    moveLink: 'Moving to your plan’s mix',
    /** The run, on a press: what is held (whole) against the plan as planned, or the plan as it stands. */
    run: { held: 'Test with what I hold', asPlanned: 'Test the plan as it stands', working: 'Testing…' },
    result: {
      held: 'With what you hold, counting how long people your age live, the money lasts as long as you do {chance} (as planned: {ref}). If you live to {age}, it lasts that long {fixed}.',
      heldFixed: 'With what you hold, if you live to {age}, the money lasts that long {fixed} (as planned: {refFixed}).',
      heldLeft: 'Typically {left} is left at {age} (as planned: {refLeft}).',
      heldLeftNone: 'In more than half the futures nothing is left at {age} (as planned: {refLeft}).',
      asPlanned: 'The plan as it stands, counting how long people your age live: the money lasts as long as you do {chance}. If you live to {age}, it lasts that long {fixed}.',
      asPlannedFixed: 'The plan as it stands: if you live to {age}, the money lasts that long {fixed}.',
      left: 'Typically {left} is left at {age}.',
      leftNone: 'In more than half the futures nothing is left at {age}.'
    }
  },

  living: {
    asksTitle: 'Where you are today',
    fields: {
      'rv.pension': { label: 'What your pension pots hold today, in pounds', help: 'All your pension pots together, from your provider’s website or app.' },
      'rv.isa': { label: 'What your ISAs hold today, in pounds', help: '0 if you have none.' },
      'rv.other': { label: 'Anything else you draw on, in pounds', help: 'Such as an ordinary investment account. 0 if there is nothing.' },
      // the plan's own income for the year (its draws from the pension, the State Pension and other income, before tax: the
      // figure the plan sets it against, whereAmI's), never what came out of an ISA
      'rv.took': { label: 'Your income since 6 April {year}, before tax, in pounds', help: 'What your pension paid you, your State Pension and any other income, added up, from statements or your bank. Not what you took from ISAs.' },
      'rv.choice': { label: 'For the year ahead, you can:', options: { less: 'Take a little less', keep: 'Keep to the plan', more: 'Take a little more' } }
    },
    errors: { required: 'Enter what your pension pots hold, in pounds.', notANumber: 'Enter an amount in pounds, like 250000.', tooLow: 'Enter 0 or more.', tooHigh: 'That is more than this page can take.', notAnOption: 'Choose one.' },
    fromRecord: 'Each box starts from {month}, the last month you recorded.',
    fromPlan: 'Each box starts from your plan’s own figures.',
    tookFromRecord: 'Your income since 6 April starts from the {n} you recorded.',
    unlocked: 'The band and the rate against the start show once the plan is locked.',
    later: 'Your plan is set to start in April {year}, so nothing here is read against it until then.',
    readingTitle: 'Against your plan as locked',
    band: {
      below: 'What your pots hold, {pot} once prices since your plan began are taken out, is below the plan’s bad-case line for now ({low}).',
      lower: 'What your pots hold, {pot} once prices since your plan began are taken out, is between the plan’s bad-case line for now ({low}) and its middle ({mid}).',
      upper: 'What your pots hold, {pot} once prices since your plan began are taken out, is between the plan’s middle for now ({mid}) and its good-case line ({high}).',
      above: 'What your pots hold, {pot} once prices since your plan began are taken out, is above the plan’s good-case line for now ({high}).'
    },
    taken: 'Your income since 6 April: {took} before tax; your plan says {planned} for {year}.',
    takenEntered: 'Your income since 6 April, as you entered it: {took} before tax; your plan says {planned} for {year}.',
    note: 'This is noted with your review and changes nothing in the plan. You can try a change on Does it last?',
    tryLink: 'Try a change',
    tryUnlocked: 'You can see what a change does on Does it last?',
    /** What is held against the plan's own mix (7.10.0): information, never a sale; what "Test with what I hold" tries. */
    held: {
      title: 'What you hold, against your plan’s mix',
      bucket: {
        shares: 'Shares: {held}% of your pension now; your plan’s mix has {plan}%.',
        bonds: 'Bonds: {held}% of your pension now; your plan’s mix has {plan}%.',
        cash: 'Cash: {held}% of your pension now; your plan’s mix has {plan}%.',
        diversifiers: 'Other investments: {held}% of your pension now; your plan’s mix has {plan}%.'
      }
    },
    /** The run, on a press: the plan from today, on the pots in the boxes — and, with a record, as they are held. */
    run: { button: 'Work out the chance from today', held: 'Test with what I hold', working: 'Working it out…' },
    result: {
      today: 'From today, {on}: counting how long people your age live, the money lasts as long as you do {chance}. If you live to {age}, it lasts that long {fixed}.',
      todayFixed: 'From today, {on}: if you live to {age}, the money lasts that long {fixed}.',
      held: 'From today, {on}, with what you hold: counting how long people your age live, the money lasts as long as you do {chance} (in your plan’s own mix: {ref}). If you live to {age}, it lasts that long {fixed}.',
      heldFixed: 'From today, {on}, with what you hold: if you live to {age}, the money lasts that long {fixed} (in your plan’s own mix: {refFixed}).',
      heldLeft: 'Typically {left} is left at {age} (in your plan’s own mix: {refLeft}).',
      heldLeftNone: 'In more than half the futures nothing is left at {age} (in your plan’s own mix: {refLeft}).',
      left: 'Typically {left} is left at {age}.',
      leftNone: 'In more than half the futures nothing is left at {age}.',
      on: { entered: 'on the pots you entered', recorded: 'on your pots as last recorded', plan: 'on your plan’s own pots' }
    },
    ladder: 'Your plan holds gilts bought for its years: the review keeps the figures it was locked with, never priced again.'
  },
  /** "I accept this as my plan" (Moving): a note for the person's own records, never advice, and withdrawn at any time. */
  agreement: {
    title: 'Your plan as you hold it',
    /** With no pension record to read (`how: 'nothing'`): the plan as it stands was accepted, never "what you hold". */
    titleAsItStands: 'Your plan as it stands',
    what: { held: 'what you held as your plan', asItStands: 'your plan as it stood' },
    accept: 'I accept this as my plan',
    notYet: 'Not yet',
    confirm: 'You are saying you have moved what you intend to move, and you have seen what the money does with what you hold now: {clauses}. From the month you stop work, the plan is read as living on it. Nothing else about the plan changes, and you can withdraw this at any time. This is a note for your own records. It is not advice, and we have not judged whether the plan suits you.',
    confirmLiving: 'You are saying you have seen what the money does with what you hold now: {clauses}. Nothing about the plan changes, and you can withdraw this at any time. This is a note for your own records. It is not advice, and we have not judged whether the plan suits you.',
    confirmAsItStands: 'You are saying you have seen what the money does with your plan as it stands: {clauses}. From the month you stop work, the plan is read as living on it. Nothing else about the plan changes, and you can withdraw this at any time. This is a note for your own records. It is not advice, and we have not judged whether the plan suits you.',
    clauses: 'counting how long people your age live, the money lasts as long as you do {chance}; if you live to {age}, it lasts that long {fixed}',
    clausesFixed: 'if you live to {age}, the money lasts that long {fixed}',
    yes: 'Yes, this is my plan',
    no: 'Go back',
    accepted: 'On {date} you accepted {what}, when the money lasted as long as you do {chance}, with typically {left} left at {age}.',
    acceptedNoneLeft: 'On {date} you accepted {what}, when the money lasted as long as you do {chance}; in more than half the futures nothing was left at {age}.',
    acceptedNoLeft: 'On {date} you accepted {what}, when the money lasted as long as you do {chance}.',
    acceptedFixed: 'On {date} you accepted {what}, when, if you lived to {age}, the money lasted that long {fixed}.',
    acceptedPlain: 'On {date} you accepted {what}.',
    stale: {
      moved: 'What you hold has moved more than 5 points from what you accepted on {date}. What you accepted still stands; you can test what you hold now.',
      version: 'The plan has a new version since you accepted it on {date}. You can test it again.',
      strategy: 'You accepted this when the plan drew by {old}; it now draws by {now}, so it no longer stands.'
    },
    withdraw: 'Withdraw this'
  },
  /** The run's own problems. */
  run: {
    noWorker: 'This browser could not start the part of the page that works this out, so nothing was tried.',
    failed: 'That could not be worked out just now. You can try again.',
    na: 'This could not be worked out on these figures.',
    kept: 'What this worked out is kept with the review when you save it.'
  },

  /** "Save this review" (Moving and Living on it). */
  save: {
    button: 'Save this review',
    working: 'Saving…',
    note: 'We keep the date and the figures you entered with this plan, so your next review can compare. Nothing else changes.',
    problem: 'Some boxes need a look before this review can be saved.'
  },

  /** The choices, each its own write. */
  rule: {
    title: 'When we say you are off course',
    success: 'When the money lasts as long as you do fewer than {n} times in 20',
    guardrails: 'When the share of your pots the plan takes in a year is more than a fifth above the share it took when the plan as locked began',
    never: 'We say so only after two reviews in a row that worked out the chance, never after one bad year.'
  },
  every: {
    title: 'How often',
    options: { year: 'Once a tax year, from 6 April', quarter: 'Every three months', month: 'Every month' },
    /** Once a year in Moving: twelve months from the last review (Living on it falls by the tax year). */
    yearPlain: 'Once a year',
    saving: 'Your check-in says how often it falls.'
  },
  moveWindow: {
    title: 'Your move window',
    line: 'Your move window: the last {n} years of saving, up to the month you stop work. Inside it, the home shows how far what you hold is from the mix your plan draws on.',
    lineOne: 'Your move window: the last year of saving, up to the month you stop work. Inside it, the home shows how far what you hold is from the mix your plan draws on.',
    when: 'It runs from {from} to {to}.',
    options: { 1: '1 year', 2: '2 years', 3: '3 years', 4: '4 years', 5: '5 years' }
  },
  level: {
    title: 'While you save',
    line: {
      cautious: 'While you save, the plan works out your pension as invested cautiously.',
      balanced: 'While you save, the plan works out your pension as invested in a balanced way.',
      adventurous: 'While you save, the plan works out your pension as invested adventurously.'
    },
    /** Until one is chosen: where the level is read from (Phases.derivedLevelFrom), in the engine's own order. */
    read: {
      held: 'We read this from what you hold; choose one and the plan works it out that way.',
      savingMix: 'We read this from the saving mix your plan was made with; choose one and the plan works it out that way.',
      drawing: 'We read this from the mix your plan draws on; choose one and the plan works it out that way.',
      default: 'Until you choose one, the plan reads a balanced way; choose one and the plan works it out that way.'
    },
    options: { cautious: 'Cautiously', balanced: 'In a balanced way', adventurous: 'Adventurously' }
  },

  /** Problems a press can meet. */
  problems: {
    closed: 'This plan has a close, so a review cannot be saved on it. Reviews carry on with the plan that carries it on.',
    example: 'The example plan cannot be changed. A copy of it can.',
    notNow: 'This plan cannot be reviewed here just now.',
    problems: 'Some boxes need a look before this review can be saved.',
    locked: 'This plan could not take that change.',
    failed: 'That did not save. Nothing was changed. You can try again.',
    storage: 'This window could not keep that. Nothing was changed.',
    readonly: 'This plan is shown as it was saved and cannot be changed here.',
    nobody: 'You are no longer signed in, so nothing was saved.',
    notHere: 'That plan is not here any more.',
    usedUp: 'Your free time is used up, so nothing was saved.',
    noResult: 'Test with what you hold first: the agreement is made on what that shows.',
    oldResult: 'The plan or what you hold changed since the test. You can test it again.',
    none: 'There is no agreement to withdraw.'
  },
  /** What a save or a choice says once written. */
  toast: {
    saved: 'Saved. Your next review is {month}.',
    savedAny: 'Saved. You can review your plan again whenever you like.',
    moveWindow: 'Your move window is now {n}.',
    level: 'Saved: while you save, the plan works out your pension as invested {level}.',
    every: 'Saved: your review falls {every}.',
    rule: 'Saved: when we say you are off course.',
    agreed: 'Saved: you accepted what you hold as your plan.',
    agreedAsItStands: 'Saved: you accepted your plan as it stands.',
    agreeWithdrawn: 'Withdrawn. The plan is read from its dates again.',
    undone: 'Put back as it was.',
    unchanged: 'Nothing to save: it was already that.'
  },
  back: 'Back to your plan',
  buttons: { undo: 'Undo', close: 'Close' }
};
