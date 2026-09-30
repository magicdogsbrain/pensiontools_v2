/**
 * The words of question C — "I've got about £X — what is that a month?". Data only — this file imports nothing.
 *
 * Labels, help and error sentences are keyed by the field paths of SCHEMA_C (src/answers/c/schema.js); step labels
 * and next sentences by the ids of src/v7/rail/c.js. The sentences that state the answer are NOT here: the answer
 * function builds them (src/answers/c/sentences.js).
 *
 * Source: research/v7/rail-screens-language.md 1.4, 2.2–2.6 and Part 3, with the changes of the build brief.
 * Placeholders are written {likeThis} and filled by the component that shows the string.
 */
export const C = {
  title: 'What is that a month?',

  steps: {
    numbers: { label: 'What have you got?', short: 'Your numbers' },
    answer:  { label: 'What does it pay a month?', short: 'What it pays' },
    ways:    { label: 'What are the ways to take it?', short: 'Ways to take it' },
    keep:    { label: 'Keep this plan?', short: 'Keep this plan' }
  },

  rail: {
    nav: 'Your steps',
    position: 'Step {n} of {of}:',
    optional: 'optional',
    marks: { current: 'You are here', done: 'Done', open: 'Not done yet' },
    close: 'Close',
    another: 'Ask a different question'
  },

  /** One per state; the first that applies wins, in the order of NEXT_C in src/v7/rail/c.js. */
  next: {
    'c.failed':   'Next: try again. Your numbers are still here.',
    'c.working':  'Working out your answer.',
    'c.blank':    'Next: two numbers are enough. Then press "Show what it pays".',
    'c.fix':      'Next: check the figure marked below.',
    /** The same state while no box is marked yet (a box that has not been left, or one that opened after a first answer). */
    'c.fix.unmarked': 'Next: fill in the box that is still empty, then press "Show what it pays".',
    'c.ready':    'Next: press "Show what it pays".',
    'c.answered': 'Next: try a change below. To add a partner or more detail, change your numbers on step 1.',
    /** Drawn in place of the sentence above on a step that is not in the preview yet (ways, keep). */
    unbuilt:      'Next: back to what it pays.'
  },

  /** Button and link words, by the label ids the rail uses and by the test ids of the brief (4.9). */
  buttons: {
    show: 'Show what it pays',
    retry: 'Try again',
    keep: 'Keep this plan',
    keepNotYet: 'Keep this plan (not in the preview yet)',
    back: 'Back to what it pays',
    change: 'Change my numbers',
    addPartner: 'Add a partner',
    removePartner: 'Remove',
    moreDetail: 'Add more detail',
    hideDetail: 'Hide more detail',
    closeMore: 'Close',
    fullDetail: 'Answer everything in full',
    fullDetailCouple: 'Answer in full detail for both of us',
    otherQuestionsFirst: 'Answer the other questions first',
    takeShow: 'Show how long that lasts',
    ways: 'What are the ways to take it?'
  },

  numbers: {
    intro: 'Rough figures are fine. You can change any of them afterwards.',
    partnerTitle: 'Your partner',
    partnerDone: 'That is all we need for a first answer for the two of you.',
    moreTitle: 'More detail (all optional)',
    stays: 'Your figures stay in this browser until you choose to keep the plan.',
    tooYoung: 'You cannot normally take a pension before {age}. We have started at {age}.'
  },

  answer: {
    needTwo: 'We need two numbers to work this out.',
    needFix: 'One of your figures needs another look before we can work this out.',
    sensible: 'Everything else starts from a sensible assumption that you can change.',
    working: 'Working out your answer…',
    trying: 'Trying your numbers against many possible futures.',
    slow: 'Still working. This can take a little longer on a phone.',
    progress: 'How far the working has got',
    updating: 'Updating',
    first: 'This is a first figure. We are still trying it against more futures.',
    failedTitle: 'Sorry, we could not work that out.',
    failedBody: 'Nothing has been lost. Your numbers are still here:',
    summary: { pot: 'Pot', age: 'age', partner: 'and a partner' },
    madeOfTitle: 'What it is made of',
    madeOfNote: "(a month, after tax, at today's prices)",
    /** The key under the three amounts. Its counts are the answer's own (BAND in src/answers/shared/rules.js). */
    rangeKey: 'careful = lasts in 9 futures out of 10 · middling = 5 out of 10 · good = the best 1 in 10',
    assumedTitle: 'What we assumed',
    assumedNote: '(press "Change" to alter one)',
    assumedChange: 'Change',
    assumedSingle: 'Worked out for you alone.',
    assumedCouple: 'Worked out for the two of you.',
    assumedAll: 'See all of them',
    assumedFewer: 'Show fewer',
    tryTitle: 'Try a change',
    tryPot: 'Pot',
    tryPotCouple: 'Your pot',
    tryPotDown: 'Pot down by {amount}',
    tryPotUp: 'Pot up by {amount}',
    tryStart: 'Start age',
    tryStartNow: 'now',
    tryStartDown: '1 year earlier',
    tryStartUp: '1 year later',
    tryRisk: 'Risk level',
    /** Under the risk buttons: what moves with the level. Pieces around figures drawn by Money. */
    riskMovesAt: 'At this level:',
    riskMiddling: 'middling',
    riskGood: 'good',
    riskRunOut: 'Taking the middling amount, a bad case (the worst 1 in 10) runs out at age',
    tryTakeNote: 'shows how long that lasts',
    /** "Before / Now" about an amount named under "take". Pieces around figures drawn by Money. */
    takeLastsTo: 'lasts to',
    takeEvenBad: 'even in a bad case (the worst 1 in 10)',
    takeRunsOut: 'in a bad case (the worst 1 in 10) it runs out at age',
    before: 'Before:',
    now: 'Now:',
    about: 'about',
    aMonth: 'a month',
    noBefore: 'nothing yet',
    nextTitle: 'What next?',
    stillWorking: 'Still working?',
    stopped: 'Already stopped?',
    whenStop: 'When can I afford to stop work?',
    savingEnough: 'Am I saving enough, and what should I pay in?',
    willItLast: 'Will it last, and could I spend more?',
    keepWhy: 'so you can come back to it and carry on'
  },

  /**
   * Every field of SCHEMA_C, by path. `label` is the visible label (the legend of a choice); `options` the words
   * for each option; `help` the words under the box; `errors` the sentence for a messageId of validate.js.
   */
  fields: {
    household: { label: 'Who is this for?', options: { single: 'Just me', couple: 'Me and my partner' } },

    'you.pot': {
      label: 'Your pension pot',
      help: 'All your pension pots added together.',
      errors: {
        required: 'Type the size of your pension pot, for example 250,000. A rough figure is fine.',
        notANumber: 'We could not read that as an amount. Use figures only, for example 250,000.'
      }
    },
    'you.age': {
      label: 'Your age',
      errors: {
        required: 'Type your age in years.',
        notANumber: 'Type an age between 18 and 100.',
        tooLow: 'Type an age between 18 and 100.',
        tooHigh: 'Type an age between 18 and 100.'
      }
    },
    'start.kind': { label: 'Start taking it', options: { now: 'Now', age: 'From age' } },
    'start.age': {
      label: 'The age to start at',
      errors: {
        'start-not-before-now': 'That is younger than you are now. Choose "Now" or a later age.',
        'start-not-before-access': 'You cannot normally take a pension before {age}. Choose {age} or later.'
      }
    },
    'you.statePension.kind': { label: 'State Pension', options: { full: 'The full amount', forecast: 'My forecast', none: 'None' } },
    'you.statePension.yearly': {
      label: 'Your forecast, a year',
      errors: { required: 'Type the yearly amount from your State Pension forecast, for example 9,000.', notANumber: 'Use figures only, for example 9,000.' }
    },
    'you.finalSalary.has': { label: 'A final-salary or career-average pension?', options: { no: 'No', yes: 'Yes' } },
    'you.finalSalary.yearly': {
      label: 'The amount a year',
      help: 'The yearly amount before tax, as your scheme states it.',
      errors: { required: 'Type the yearly amount before tax, for example 9,000.', notANumber: 'Use figures only, for example 9,000.' }
    },
    'you.finalSalary.fromAge': {
      label: 'The age it starts',
      errors: { required: 'Type the age your final-salary pension starts. It is on your yearly statement.' }
    },

    'partner.age': {
      label: "Partner's age",
      errors: {
        required: "Type your partner's age in years.",
        notANumber: 'Type an age between 18 and 100.',
        tooLow: 'Type an age between 18 and 100.',
        tooHigh: 'Type an age between 18 and 100.'
      }
    },
    'partner.pot': {
      label: "Partner's pension pot",
      help: '0 if none.',
      errors: { notANumber: 'We could not read that as an amount. Use figures only, for example 90,000.' }
    },
    'partner.statePension.kind': { label: "Partner's State Pension", options: { full: 'The full amount', forecast: 'Forecast', none: 'None' } },
    'partner.statePension.yearly': {
      label: "Partner's forecast, a year",
      errors: { required: "Type the yearly amount from your partner's State Pension forecast, for example 9,000.", notANumber: 'Use figures only, for example 9,000.' }
    },
    'partner.finalSalary.has': { label: "Partner's final-salary pension?", options: { no: 'No', yes: 'Yes' } },
    'partner.finalSalary.yearly': {
      label: 'The amount a year',
      help: 'The yearly amount before tax, as the scheme states it.',
      errors: { required: 'Type the yearly amount before tax, for example 9,000.', notANumber: 'Use figures only, for example 9,000.' }
    },
    'partner.finalSalary.fromAge': {
      label: 'The age it starts',
      errors: { required: "Type the age your partner's final-salary pension starts. It is on the yearly statement." }
    },

    savings: {
      label: 'Other savings you would spend',
      help: 'ISAs, cash, investments.',
      errors: { notANumber: 'We could not read that as an amount. Use figures only, for example 20,000.' }
    },
    risk: {
      label: 'Risk level',
      options: { cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' },
      optionHelp: { cautious: 'about a third in shares', balanced: 'about half in shares', adventurous: 'about two thirds in shares' }
    },
    endAge: {
      label: 'Make it last to age',
      errors: { 'end-after-start': 'That is not later than the age the money starts. Choose a later age.' }
    },
    take: {
      label: 'Take, a month',
      help: 'Any amount you have in mind.',
      errors: { notANumber: 'Use figures only, for example 1,500.' }
    }
  },

  /** Used when a field has no sentence of its own for a messageId. {min} and {max} are the field's own limits. */
  errors: {
    money: {
      required: 'Type an amount in pounds.',
      notANumber: 'Use figures only, for example 9,000.',
      tooLow: 'Type an amount of {min} or more.',
      tooHigh: 'That is more than we can work with here. Type an amount up to {max}.'
    },
    age: {
      required: 'Type an age in years.',
      notANumber: 'Type an age between {min} and {max}.',
      tooLow: 'Type an age between {min} and {max}.',
      tooHigh: 'Type an age between {min} and {max}.'
    },
    other: 'Choose one of these.'
  }
};
