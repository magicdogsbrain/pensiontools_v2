/**
 * The words of question D — "I'm retired. Will it last? Could I spend more? Would some work help?" (research/v7/answer-D.md
 * 3; road-to-7.md step 7). Data only — this file imports nothing.
 *
 * Labels, help and error sentences are keyed by the field paths of SCHEMA_D (src/answers/d/schema.js); step labels and
 * next sentences by the ids of src/v7/rail/d.js. The sentences that state the answer are NOT here: the answer function
 * builds them (src/answers/d/sentences.js). Every string passes the banned list in the `retired` scope: no countdown,
 * no "when you retire", no "years to go"; ages for the future. Placeholders are written {likeThis}.
 */
export const D = {
  title: 'Will it last?',

  steps: {
    numbers: { label: 'What have you got, and what do you take?', short: 'Your numbers' },
    answer:  { label: 'Will it last?', short: 'Will it last' },
    keep:    { label: 'Keep this as a plan?', short: 'Keep as a plan' }
  },

  rail: {
    nav: 'Your steps',
    position: 'Step {n} of {of}:',
    optional: 'optional',
    marks: { current: 'You are here', done: 'Done', open: 'Not done yet' },
    close: 'Close',
    another: 'Ask a different question'
  },

  /** One per state; the first that applies wins, in the order of NEXT_D in src/v7/rail/d.js. */
  next: {
    'd.failed':   'Next: try again. Your numbers are still here.',
    'd.working':  'Working out your answer.',
    'd.blank':    'Next: your age, your pension, the tax-free part and what you take a month are enough.',
    'd.fix':      'Next: check the figure marked below.',
    'd.fix.unmarked': 'Next: fill in the box that is still empty, then press "Will it last?".',
    'd.ready':    'Next: press "Will it last?".',
    'd.keep':     'Next: check the name, then press "Keep as a plan".',
    'd.keep.not': 'Next: back to your answer.',
    'd.yes':      'Next: see how much more you could spend, or what some work would do.',
    'd.close':    'Next: see what spending less, or some work, would do.',
    'd.no':       'Next: see what spending less, or some work, would do.',
    unbuilt:      'Next: back to your answer.'
  },

  /** Button and link words, by the label ids the rail uses and by the test ids. */
  buttons: {
    show: 'Will it last?',
    retry: 'Try again',
    keep: 'Keep this as a plan',
    keepNotYet: 'Keep this as a plan (not in the preview yet)',
    back: 'Back to your answer',
    change: 'Change my numbers',
    addPartner: 'Add a partner',
    removePartner: 'Remove',
    moreDetail: 'Add more detail',
    hideDetail: 'Hide more detail',
    closeMore: 'Close',
    otherQuestionsFirst: 'Answer the other questions first',
    fullDetail: 'Answer everything in full',
    fullDetailCouple: 'Answer in full detail for both of us',
    /** The way in (answer-D.md 3.10): your own plan, at "Does it last?". */
    openPlan: 'Open ‘{name}’: does it last?',
    /** Still working: the questions that are theirs. */
    toA: 'When can I afford to stop work?',
    toAPartner: 'When could my partner afford to stop?',
    /** The levers (answer-D.md 3.5–3.7). */
    spendMore: 'Could I spend more?',
    work: 'Would some work help?',
    workTry: 'Try it',
    fall: 'What if shares fell by a fifth?',
    fallOff: 'Put the shares back',
    workOff: 'Take the work away'
  },

  numbers: {
    intro: 'Rough figures are fine. You can change any of them afterwards.',
    /** For someone who has a plan already (answer-D.md 3.10): it is tested at "Does it last?". */
    hasPlan: 'You have a plan already. Its own test, with these three levers, is at "Does it last?".',
    hasPlans: 'You have plans already. Each has its own test, with these three levers, at "Does it last?".',
    orAfresh: 'Or test what you have today, afresh:',
    partnerTitle: 'Your partner',
    partnerDone: 'That is all we need for a first answer for the two of you.',
    moreTitle: 'More detail (all optional)',
    stays: 'Your figures stay in this browser until you choose to keep them as a plan.',
    /** Under the spending choice once a level is picked. */
    levelIs: '{level}: {amount} a month for {who} (Retirement Living Standards).',
    levelWho: { single: 'one person', couple: 'a couple' },
    stillWorking: 'Still working? This question is for people who have stopped. "When can I afford to stop work?" is yours.'
  },

  /** The Retirement Living Standards levels as a month, to the pound — the figure the answer tests (RULES.plsa ÷ 12). */
  levels: {
    single: { minimum: '£1,200', moderate: '£2,608', comfortable: '£3,592' },
    couple: { minimum: '£1,867', moderate: '£3,592', comfortable: '£4,917' }
  },

  answer: {
    needFour: 'We need four things to work this out.',
    needFix: 'One of your figures needs another look before we can work this out.',
    sensible: 'Everything else starts from a sensible assumption that you can change.',
    updating: 'Updating',
    first: 'This is a first figure. We are still trying it against more futures.',
    failedTitle: 'Sorry, we could not work that out.',
    failedBody: 'Nothing has been lost. Your numbers are still here:',
    summary: { pot: 'Pot', age: 'age', aMonth: 'a month', in: 'in', partner: 'and a partner', stop: 'stop at', ages: 'show me ages' },
    madeOfTitle: 'What it is made of',
    madeOfNote: '(a month, after tax, at today’s prices)',
    assumedTitle: 'What we assumed',
    assumedNote: '(press "Change" to alter one)',
    assumedChange: 'Change',
    assumedSingle: 'Worked out for you alone.',
    assumedCouple: 'Worked out for the two of you.',
    assumedAll: 'See all of them',
    assumedFewer: 'Show fewer',
    /** "Could I spend more?" (answer-D.md 3.5): the band in full. */
    moreTitle: 'Could I spend more?',
    moreNote: 'careful = lasted in 9 futures out of 10 · middling = 5 out of 10 · good = the best 1 in 10',
    /** "Would some work help?" (3.6). */
    workTitle: 'Would some work help?',
    workNote: 'Pay from work from today, for a whole number of years, taxed with your other income.',
    workYearly: 'Pay a year, before tax',
    workYears: 'For how many years',
    workRows: 'Year by year:',
    workAllowance: 'Once you have taken money from a pension that is taxed, the most you can pay into pensions and still get tax back is £10,000 a year.',
    /** "What if shares fell by a fifth?" (3.7). */
    fallTitle: 'What if shares fell by a fifth?',
    fallNote: 'Shares fall by a fifth tomorrow, you keep the same mix, and the futures then run as usual.',
    tryTitle: 'Try a change',
    trySpend: 'What you take',
    trySpendDown: 'Take £100 a month less',
    trySpendUp: 'Take £100 a month more',
    tryPot: 'Pension',
    tryPotCouple: 'Your pension',
    tryPotDown: 'Pension down by {amount}',
    tryPotUp: 'Pension up by {amount}',
    before: 'Before:',
    noBefore: 'nothing yet',
    aMonth: 'a month',
    nextTitle: 'What next?',
    /** The way to the other questions, for someone who finds they are still working, or whose partner is. */
    stillWorking: 'Still working?',
    partnerWorking: 'Your partner still working?',
    keepWhy: 'so you can follow it month by month'
  },

  /**
   * Every field of SCHEMA_D, by path. `label` is the visible label (the legend of a choice); `options` the words for
   * each option; `help` the words under the box; `errors` the sentence for a messageId of validate.js.
   */
  fields: {
    household: { label: 'Who is this for?', options: { single: 'Just me', couple: 'Me and my partner' } },
    stopped: {
      label: 'Have you stopped work?',
      options: { yes: 'Yes', notYet: 'Not yet' },
      errors: { 'd-still-working': 'This question is for people who have stopped work. "When can I afford to stop work?" is the question for you.' }
    },
    'you.age': {
      label: 'Your age',
      errors: { required: 'Type your age in years.', notANumber: 'Type an age between 18 and 100.', tooLow: 'Type an age between 18 and 100.', tooHigh: 'Type an age between 18 and 100.' }
    },
    'you.pot': {
      label: 'What is left in your pension pots today',
      help: 'All your pension pots added together. Leave out an annuity (a guaranteed income for life): that comes in anyway. Type 0 if you have none.',
      errors: { required: 'Type what is left in your pension pots, for example 300,000. A rough figure is fine. Type 0 if you have none.', notANumber: 'We could not read that as an amount. Use figures only, for example 300,000.' }
    },
    'you.statePension.kind': { label: 'Your State Pension', options: { full: 'The full amount', forecast: 'An amount', none: 'None' }, help: 'What you are paid, or what your forecast says you will be.' },
    'you.statePension.yearly': {
      label: 'The amount, a year',
      errors: { required: 'Type the yearly amount of your State Pension, for example 11,000.', notANumber: 'Use figures only, for example 11,000.' }
    },
    'you.finalSalary.has': { label: 'A final-salary or career-average pension?', options: { no: 'No', yes: 'Yes' } },
    'you.finalSalary.yearly': {
      label: 'The amount a year',
      help: 'The yearly amount before tax, as your scheme states it.',
      errors: { required: 'Type the yearly amount before tax, for example 9,000.', notANumber: 'Use figures only, for example 9,000.' }
    },
    'you.finalSalary.fromAge': {
      label: 'The age it starts',
      help: 'If it is being paid already, your age today or earlier.',
      errors: { required: 'Type the age your final-salary pension starts, or started.' }
    },
    savings: {
      label: 'ISAs and other savings',
      help: 'ISAs, cash, investments. 0 if none.',
      errors: { notANumber: 'We could not read that as an amount. Use figures only, for example 40,000.' }
    },
    isaGrowth: {
      label: 'How your savings grow',
      options: { cash: 'Mostly cash', invested: 'Invested like my pension' },
      optionHelp: { cash: 'they grow by about last year\'s rise in prices, less 1%', invested: 'the same mix as your pension, in the same futures' }
    },
    'you.taxFreeTaken': {
      label: 'Have you already had the tax-free part of your pension?',
      options: { no: 'No, not yet', yes: 'Yes', some: 'Some of it' },
      help: 'If it has all gone, everything you take out is taxed. If not, a quarter of each amount you take out is tax-free.',
      errors: { required: 'Choose one: it changes the tax on what you take.', notAnOption: 'Choose one of these.' }
    },
    'spend.kind': { label: 'What you take a month', options: { amount: 'An amount', level: 'A level of living' } },
    'spend.amount': {
      label: 'After tax, at today’s prices',
      help: 'What you take from your money each month, after tax, with your State Pension and any other pension counted in.',
      errors: { required: 'Type what you take a month, for example 2,100.', notANumber: 'Use figures only, for example 2,100.', tooLow: 'Type an amount of £1 or more.', tooHigh: 'That is more than we can work with here. Type an amount up to £50,000.' }
    },
    'spend.level': { label: 'Which level', options: { minimum: 'Minimum', moderate: 'Moderate', comfortable: 'Comfortable' }, errors: { required: 'Choose a level.' } },

    'partner.age': {
      label: "Partner's age",
      errors: { required: "Type your partner's age in years.", notANumber: 'Type an age between 18 and 100.', tooLow: 'Type an age between 18 and 100.', tooHigh: 'Type an age between 18 and 100.' }
    },
    'partner.pot': {
      label: "Partner's pension pots today",
      help: '0 if none.',
      errors: { notANumber: 'We could not read that as an amount. Use figures only, for example 90,000.' }
    },
    'partner.statePension.kind': { label: "Partner's State Pension", options: { full: 'The full amount', forecast: 'An amount', none: 'None' } },
    'partner.statePension.yearly': {
      label: "Partner's amount, a year",
      errors: { required: "Type the yearly amount of your partner's State Pension, for example 9,000.", notANumber: 'Use figures only, for example 9,000.' }
    },
    'partner.finalSalary.has': { label: "Partner's final-salary pension?", options: { no: 'No', yes: 'Yes' } },
    'partner.finalSalary.yearly': {
      label: 'The amount a year',
      help: 'The yearly amount before tax, as the scheme states it.',
      errors: { required: 'Type the yearly amount before tax, for example 9,000.', notANumber: 'Use figures only, for example 9,000.' }
    },
    'partner.finalSalary.fromAge': {
      label: 'The age it starts',
      errors: { required: "Type the age your partner's final-salary pension starts, or started." }
    },
    'partner.stopped': {
      label: 'Has your partner stopped work?',
      options: { yes: 'Yes', notYet: 'Not yet' },
      errors: { 'd-partner-working': 'A partner still working is a question for "When can I afford to stop work?": say there that you have already stopped, and it answers about them.' }
    },
    'partner.taxFreeTaken': {
      label: "Has your partner already had the tax-free part of their pension?",
      options: { no: 'No, not yet', yes: 'Yes', some: 'Some of it' },
      errors: { required: 'Choose one: it changes the tax on what they take.', notAnOption: 'Choose one of these.' }
    },

    risk: {
      label: 'Risk level',
      options: { cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' },
      optionHelp: { cautious: 'about a third in shares', balanced: 'about half in shares', adventurous: 'about two thirds in shares' }
    },
    charge: {
      label: 'Charges (funds and platform), a year',
      help: 'What your funds and your platform take each year, as a share of what you hold. Not taken off State Pension or final-salary pensions.'
    },
    endAge: {
      label: 'Make it last to age',
      help: 'The later of 95 and five years on from today unless you say.',
      errors: { 'd-end-after-now': 'That is not later than your age now. Choose a later age.', tooLow: 'Type an age from 75 to 105.', tooHigh: 'Type an age from 75 to 105.' }
    },
    'work.has': { label: 'Some work', options: { no: 'No', yes: 'Yes' } },
    'work.yearly': {
      label: 'Pay a year, before tax',
      errors: { required: 'Type the pay a year before tax, for example 12,000.', notANumber: 'Use figures only, for example 12,000.', tooLow: 'Type an amount of £1 or more.', tooHigh: 'Type an amount up to £200,000.' }
    },
    'work.years': {
      label: 'For how many years',
      errors: { required: 'Type how many years, from 1 to 5.', notANumber: 'Whole years, from 1 to 5.', tooLow: 'From 1 to 5 years.', tooHigh: 'Up to 5 years.', 'd-work-before-end': 'The work would run past the age the money is tested to. Fewer years, or a later age under more detail.' }
    },
    'fall.has': { label: 'Shares fall by a fifth', options: { no: 'No', yes: 'Yes' } }
  },

  /** Used when a field has no sentence of its own for a messageId. {min} and {max} are the field's own limits. */
  errors: {
    money: { required: 'Type an amount in pounds.', notANumber: 'Use figures only, for example 9,000.', tooLow: 'Type an amount of {min} or more.', tooHigh: 'That is more than we can work with here. Type an amount up to {max}.' },
    age: { required: 'Type an age in years.', notANumber: 'Type an age between {min} and {max}.', tooLow: 'Type an age between {min} and {max}.', tooHigh: 'Type an age between {min} and {max}.' },
    percent: { required: 'Type a figure such as 0.5.', notANumber: 'Type a figure in steps of 0.05, such as 0.5 or 0.45.', tooLow: 'Type a figure from {min} to {max}.', tooHigh: 'Type a figure from {min} to {max}.' },
    count: { required: 'Type a whole number.', notANumber: 'Whole numbers only.', tooLow: 'Type a number from {min} to {max}.', tooHigh: 'Type a number from {min} to {max}.' },
    other: 'Choose one of these.'
  }
};
