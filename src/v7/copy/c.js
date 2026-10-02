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
    keep:    { label: 'Save this as a plan?', short: 'Save as a plan' }
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
    'c.keep':     'Next: check the name, then press "Save as a plan".',
    /** c.keep when this answer cannot be saved (nothing from a pot, or the years before a pension opens hold it down). */
    'c.keep.not': 'Next: back to what it pays.',
    'c.answered': 'Next: try a change below. To add a partner or more detail, change your numbers on step 1.',
    /** Drawn in place of the sentence above on a step that is not in the preview yet (ways). */
    unbuilt:      'Next: back to what it pays.'
  },

  /** Button and link words, by the label ids the rail uses and by the test ids of the brief (4.9). */
  buttons: {
    show: 'Show what it pays',
    retry: 'Try again',
    keep: 'Save this as a plan',
    keepNotYet: 'Save this as a plan (not in the preview yet)',
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
    stays: 'Your figures stay in this browser until you choose to save them as a plan.',
    tooYoung: 'You cannot normally take a pension before {age}. We have started at {age}.',
    /** Still paying in, and "Start taking it" left alone: the form starts the money at the State Pension age. */
    payingInStart: 'As you are still paying in, we have started at your State Pension age, {age}. Change it to the age you will stop paying in.'
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
    summary: { pot: 'Pot', age: 'age', in: 'a month going in', partner: 'and a partner' },
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
    /** Still paying in: what goes in each month, £50 at a time (your part when it is split, else the one figure). */
    tryPayInOwn: 'Your part, a month',
    tryPayInTotal: 'Going in, a month',
    tryPayInDown: 'Paying in down by {amount} a month',
    tryPayInUp: 'Paying in up by {amount} a month',
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
    /** You have stopped and your partner stops later (couples-different-years.md 5.4): the same two questions, about them. */
    partnerWorking: 'Your partner still working?',
    whenPartnerStop: 'When could my partner afford to stop?',
    partnerSavingEnough: 'Is my partner saving enough for this?',
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
        'start-not-before-access': 'You cannot normally take a pension before {age}. Choose {age} or later.',
        /** Two people: no pension of either of you open by then, and no savings (the rule is per person). */
        'start-not-before-access-couple': 'Your pensions cannot be touched before you are {age}, and there are no savings to live on until then. Choose {age} or later, or add your savings under "Add more detail".',
        'pay-in-past-75': 'You would be over 75 by then, and paying in can only be counted until 75: after that the government adds no tax back. Choose 75 or younger, or answer No to still paying in.',
        'pay-in-past-75-partner': 'Your partner would be over 75 by then, and paying in can only be counted until 75: after that the government adds no tax back. Choose an earlier age, or answer No to their paying in.'
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

    // ---- "Still paying in" (step 4 brief section 10, J8). Owned by the numbers package: labels, help and errors of
    // C's pay-in fields only. Every other word of C is the screens package's. -----------------------------------------
    'you.payIn.has': { label: 'Are you still paying into this pension?', options: { no: 'No', yes: 'Yes' } },
    'you.payIn.kind': { label: 'What goes in', options: { split: "Your part and your employer's", total: 'One figure' } },
    'you.payIn.own': {
      label: 'Your part, a month',
      help: 'What lands in your pension from your pay each month, with the tax the government adds back included. It goes in until the age you start taking the money.',
      errors: { required: 'Type what goes in from your pay each month, for example 500. Type 0 if none.', notANumber: 'Use figures only, for example 500.' }
    },
    'you.payIn.employer': {
      label: "Your employer's part, a month",
      help: 'What your employer puts in each month. 0 if none.',
      errors: { required: "Type your employer's part each month, for example 300. Type 0 if none.", notANumber: 'Use figures only, for example 300.', 'pay-in-over-limit': "Your part and your employer's part together can be up to £10,000 a month." }
    },
    'you.payIn.total': {
      label: 'Going into your pension, a month',
      help: "Everything that lands in your pension each month: your part, your employer's part and the tax the government adds back.",
      errors: { required: 'Type what goes into your pension each month, for example 800. Type 0 if nothing.', notANumber: 'Use figures only, for example 800.' }
    },
    'partner.payIn.has': { label: 'Is your partner still paying into their pension?', options: { no: 'No', yes: 'Yes' } },
    'partner.payIn.kind': { label: 'What goes in', options: { split: "Their part and their employer's", total: 'One figure' } },
    'partner.payIn.own': {
      label: "Your partner's part, a month",
      help: 'What lands in their pension from their pay each month, with the tax the government adds back included.',
      errors: { required: 'Type what goes in from their pay each month, for example 300. Type 0 if none.', notANumber: 'Use figures only, for example 300.' }
    },
    'partner.payIn.employer': {
      label: "Their employer's part, a month",
      help: 'What their employer puts in each month. 0 if none.',
      errors: { required: "Type their employer's part each month, for example 200. Type 0 if none.", notANumber: 'Use figures only, for example 200.', 'pay-in-over-limit': "Their part and their employer's part together can be up to £10,000 a month." }
    },
    'partner.payIn.total': {
      label: 'Going into their pension, a month',
      help: "Everything that lands in their pension each month: their part, their employer's part and the tax the government adds back.",
      errors: { required: 'Type what goes into their pension each month, for example 500. Type 0 if nothing.', notANumber: 'Use figures only, for example 500.' }
    },
    // ---- end of the "still paying in" block ----------------------------------------------------------------------

    // ---- Couples who stop work in different years (research/v7/couples-different-years.md 2.1, 2.3). C is read by
    // people who have stopped: "stops", never "stop work at 56"; ages, never waits. ------------------------------------
    'partner.stop.kind': {
      label: 'When does your partner stop work?',
      options: { same: 'When you start taking money', already: 'They already have', age: 'At an age' }
    },
    'partner.stop.age': {
      label: 'Their age when they stop',
      errors: {
        required: "Type your partner's age when they stop, for example 56.",
        notANumber: "Type your partner's age when they stop, for example 56.",
        tooLow: 'Type an age between 18 and 75.',
        tooHigh: 'We can work with ages up to 75. Type 75 or less.',
        'partner-stop-not-before-now': 'That is younger than your partner is now. Type their age now or a later one.'
      }
    },
    /** The pay line: `line` is what is drawn, with Change, until it is answered — by what not answering means. */
    untilBothStop: {
      label: "Until you've both stopped, their pay covers:",
      options: { half: 'Half of what you spend', all: 'All of it', none: 'None of it' },
      help: "Whatever their pay doesn't cover comes from the money of the one who has stopped.",
      line: {
        half: "Until you've both stopped, the one still working covers half of what you spend from their pay, and keeps paying in.",
        all: "Until you've both stopped, the one still working covers all of what you spend from their pay, and keeps paying in.",
        none: "Until you've both stopped, the one still working keeps paying in, and the money of the one who has stopped pays all of what you spend."
      },
      change: 'Change'
    },
    'you.taxFreeTaken': {
      label: 'Already had the tax-free part of your pension?',
      options: { no: 'No', yes: 'Yes' },
      help: 'Usually a quarter of the pot. If it has gone, everything taken out is taxed.'
    },
    'partner.taxFreeTaken': {
      label: "Already had the tax-free part of your partner's pension?",
      options: { no: 'No', yes: 'Yes' },
      help: 'Usually a quarter of the pot. If it has gone, everything taken out is taxed.'
    },
    // ---- end of the different-years block -------------------------------------------------------------------------

    savings: {
      label: 'Other savings you would spend',
      help: 'ISAs, cash, investments.',
      errors: { notANumber: 'We could not read that as an amount. Use figures only, for example 20,000.' }
    },
    /**
     * How the savings grow (6.22.0; the same words in C, A and B): asked once there is money in savings, straight under
     * the savings box. "Mostly cash" is the pension's own cash rule; "Invested like my pension" follows the pension's mix.
     */
    isaGrowth: {
      label: 'How your savings grow',
      options: { cash: 'Mostly cash', invested: 'Invested like my pension' },
      optionHelp: { cash: 'they grow by about last year\'s rise in prices, less 1%', invested: 'the same mix as your pension, in the same futures' }
    },
    risk: {
      label: 'Risk level',
      options: { cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' },
      optionHelp: { cautious: 'about a third in shares', balanced: 'about half in shares', adventurous: 'about two thirds in shares' }
    },
    charge: {
      label: 'Charges (funds and platform), a year',
      help: 'What your funds and your platform take each year, as a share of what you hold, while you save and while you draw. Not taken off State Pension or final-salary pensions: there is no such charge on those.'
    },
    endAge: {
      label: 'Make it last to age',
      errors: {
        'end-after-start': 'That is not later than the age the money starts. Choose a later age.',
        /** The same rule for a couple whose stops are their own: the end comes after both, and the stops less than 45 years apart. */
        'end-after-start-apart': 'That is not after you have both stopped. Choose a later age. The two of you also need to stop less than 45 years apart.'
      }
    },
    // the spending shape (research/v7/spending-shape.md 3.2, 7.3): drawn by its own block (components/StepsField.jsx, with
    // the words of copy/shape.js); these are the input list's own words, for the checks and the hand-overs
    'shape.then': {
      label: 'What happens from the start',
      options: { level: 'stays the same', falls: 'falls by a percentage a year', glides: 'moves evenly to the next step' },
      errors: { glidesLast: 'There is no later step to move towards. Add one, or choose another.' }
    },
    'shape.fallsPct': {
      label: 'Falls by, a year',
      errors: {
        required: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.',
        notANumber: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.',
        tooLow: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.',
        tooHigh: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.'
      }
    },
    'shape.steps': {
      label: 'Later ages, as a share of what you start on',
      errors: {
        'shape-steps': 'Check the ages of your steps: each later than the one before, after the start and before the end of the plan.',
        tooMany: 'That is more steps than years in the plan. Remove one.',
        notAnOption: 'Check your steps by age.'
      }
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
    percent: {
      required: 'Type a figure such as 0.5.',
      notANumber: 'Type a figure in steps of 0.05, such as 0.5 or 0.45.',
      tooLow: 'Type a figure from {min} to {max}.',
      tooHigh: 'Type a figure from {min} to {max}.'
    },
    other: 'Choose one of these.'
  }
};
