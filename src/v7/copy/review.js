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
    success: 'At your last two reviews that worked out the chance, the money lasted as long as you do {a} and then {b} times in 20; your line is {line} in 20. Below is what you can change.',
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
    untagged: 'We could not tell what {name} holds, so it is left out of these figures. You can say what it holds on What you hold.',
    noReading: 'We could not tell what any line of your pension holds, so there is nothing to compare yet. You can say what each holds on What you hold.',
    ladder: 'Your ladder holds {held} of the {needed} gilts your plan still needs.',
    ladderYears: 'Not held yet: the gilts for {years}.',
    ladderLater: 'The ladder’s years show once the plan is locked.',
    moveLink: 'Moving to your plan’s mix'
  },

  living: {
    asksTitle: 'Where you are today',
    fields: {
      'rv.pension': { label: 'What your pension pots hold today, in pounds', help: 'All your pension pots together, from your provider’s website or app.' },
      'rv.isa': { label: 'What your ISAs hold today, in pounds', help: '0 if you have none.' },
      'rv.other': { label: 'Anything else you draw on, in pounds', help: 'Such as an ordinary investment account. 0 if there is nothing.' },
      'rv.took': { label: 'What you have taken from your pots since 6 April {year}, before tax, in pounds', help: 'From your provider’s statements or your bank.' },
      'rv.choice': { label: 'For the year ahead, you can:', options: { less: 'Take a little less', keep: 'Keep to the plan', more: 'Take a little more' } }
    },
    errors: { required: 'Enter what your pension pots hold, in pounds.', notANumber: 'Enter an amount in pounds, like 250000.', tooLow: 'Enter 0 or more.', tooHigh: 'That is more than this page can take.', notAnOption: 'Choose one.' },
    fromRecord: 'Each box starts from {month}, the last month you recorded.',
    fromPlan: 'Each box starts from your plan’s own figures.',
    tookFromRecord: 'What you have taken starts from the {n} you recorded since 6 April.',
    unlocked: 'The band and the rate against the start show once the plan is locked.',
    later: 'Your plan is set to start in April {year}, so nothing here is read against it until then.',
    readingTitle: 'Against your plan as locked',
    band: {
      below: 'What your pots hold, {pot} once prices since your plan began are taken out, is below the plan’s bad-case line for now ({low}).',
      lower: 'What your pots hold, {pot} once prices since your plan began are taken out, is between the plan’s bad-case line for now ({low}) and its middle ({mid}).',
      upper: 'What your pots hold, {pot} once prices since your plan began are taken out, is between the plan’s middle for now ({mid}) and its good-case line ({high}).',
      above: 'What your pots hold, {pot} once prices since your plan began are taken out, is above the plan’s good-case line for now ({high}).'
    },
    taken: 'Taken since 6 April: {took} before tax; your plan says {planned} for {year}.',
    takenEntered: 'Taken since 6 April, as you entered it: {took} before tax; your plan says {planned} for {year}.',
    note: 'This is noted with your review and changes nothing in the plan. You can try a change on Does it last?',
    tryLink: 'Try a change'
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
    read: 'We read this from what you hold; choose one and the plan works it out that way.',
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
    usedUp: 'Your free time is used up, so nothing was saved.'
  },
  /** What a save or a choice says once written. */
  toast: {
    saved: 'Saved. Your next review is {month}.',
    savedAny: 'Saved. You can review your plan again whenever you like.',
    moveWindow: 'Your move window is now {n}.',
    level: 'Saved: while you save, the plan works out your pension as invested {level}.',
    every: 'Saved: your review falls {every}.',
    rule: 'Saved: when we say you are off course.',
    undone: 'Put back as it was.',
    unchanged: 'Nothing to save: it was already that.'
  },
  back: 'Back to your plan',
  buttons: { undo: 'Undo', close: 'Close' }
};
