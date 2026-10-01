/**
 * The words of question A — "When can I afford to stop work?". Data only — this file imports nothing.
 *
 * Labels, help and error sentences are keyed by the field paths of SCHEMA_A (src/answers/a/schema.js); step labels
 * and next sentences by the ids of src/v7/rail/a.js. The sentences that state the answer are NOT here: the answer
 * function builds them (src/answers/a/sentences.js).
 *
 * Source: research/v7/screens-A-B.md 2.1, 3, 5, 6 and 9 (verbatim where it gives the words), with the step 4 brief's
 * changes (conflicts 20–24, 41, 44–47). Placeholders are written {likeThis} and filled by the component that shows
 * the string. Every string passes the banned list in every scope A is shown in — the saver and retired rules included.
 */
export const A = {
  title: 'When can I afford to stop work?',

  steps: {
    numbers: { label: 'What have you got, and when would you stop?', short: 'Your numbers' },
    /** The budget step (research/v7/budget-step.md). Its own words are in copy/budget.js. */
    spend:   { label: 'What would you spend?', short: 'What you spend' },
    /** The answer step's label follows the numbers step: an age in mind, "show me ages", or nothing typed yet. */
    answer:  { label: 'Could I stop at {age}?', labelAges: 'Which ages could I stop at?', labelNone: 'Could I stop?', short: 'Could I stop?' },
    ages:    { label: 'What about every other age?', short: 'Every age' },
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

  /** One per state; the first that applies wins, in the order of NEXT_A in src/v7/rail/a.js. */
  next: {
    'a.retired':    'This question is for people who are still working. Your figures say you have stopped.',
    'a.failed':     'Next: try again. Your numbers are still here.',
    'a.working':    'Working out your answer.',
    'a.blank':      'Next: three things are enough — your age, your pot and the age you have in mind.',
    'a.spend':      'Next: what would you spend? Work it out line by line, or put in one figure.',
    'a.fix':        'Next: check the figure marked below.',
    /** The same state while no box is marked yet. */
    'a.fix.unmarked': 'Next: fill in the box that is still empty, then press "Show if it works".',
    'a.ready':      'Next: press "Show if it works".',
    'a.keep':       'Next: check the name, then press "Save as a plan".',
    /** a.keep when this answer cannot be saved. */
    'a.keep.not':   'Next: back to your answer.',
    'a.no':         'Next: the earliest age that worked is {earliest}. Try it below, or see every age.',
    /** a.no when no age up to 75 worked, so there is no earliest age to name. */
    'a.no.later':   'Next: no age up to 75 worked. Try spending less below, or see every age.',
    'a.close':      'Next: try one more year, or a little less spending, below.',
    'a.yes':        'Next: see what one more year buys, or save this as a plan so you can come back to it.',
    'a.ages':       'Next: press an age in the table to see it in full.',
    'a.ages.none':  'Next: try spending less below, or see what you could spend a month.',
    /** Drawn in place of the sentence above on a step that is not in the preview yet. */
    unbuilt:        'Next: back to your answer.'
  },

  /** Button and link words, by the label ids the rail uses and by the test ids of the brief (4.13). */
  buttons: {
    show: 'Show if it works',
    retry: 'Try again',
    keep: 'Save this as a plan',
    keepNotYet: 'Save this as a plan (not in the preview yet)',
    /** The numbers step's button: on to the spend step (draft/onward). */
    onward: 'Next: what you would spend',
    /** The rail's button to the spend step. */
    spend: 'What would you spend?',
    back: 'Back to your answer',
    change: 'Change my numbers',
    addPartner: 'Add a partner',
    removePartner: 'Remove',
    moreDetail: 'Add more detail',
    hideDetail: 'Hide more detail',
    closeMore: 'Close',
    fullDetail: 'Answer everything in full',
    fullDetailCouple: 'Answer in full detail for both of us',
    otherQuestionsFirst: 'Answer the other questions first',
    seeAges: 'See every age',
    willItLast: 'Will it last, and could I spend more?',
    imWorking: 'That’s wrong — I’m working',
    'next.b': 'Am I saving enough for this?',
    'next.c': 'What is that a month?'
  },

  numbers: {
    intro: 'Rough figures are fine. You can change any of them afterwards.',
    partnerTitle: 'Your partner',
    partnerDone: 'You both stop in the same year. That is all we need for a first answer for the two of you.',
    moreTitle: 'More detail (all optional)',
    stays: 'Your figures stay in this browser until you choose to save them as a plan.',
    /** Under the spending choice once a level is picked: the level's figure, by household (see `levels`). */
    levelIs: '{level}: {amount} a month for {who} (Retirement Living Standards).',
    levelWho: { single: 'one person', couple: 'a couple' }
  },

  /**
   * The Retirement Living Standards levels as a month, to the pound — the figure the answer tests (RULES.plsa ÷ 12).
   * tests/v7/a/render.test.js checks each one against the rule, so the two can never drift apart.
   */
  levels: {
    single: { minimum: '£1,200', moderate: '£2,608', comfortable: '£3,592' },
    couple: { minimum: '£1,867', moderate: '£3,592', comfortable: '£4,917' }
  },

  /** The line under the heading of a numbers step whose figures were carried in (screens-A-B.md 5), by carry. */
  carried: {
    'c→a': 'We have brought your figures over from "What is that a month?". Add the age you have in mind and what you would spend.',
    'b→a': 'We have brought your figures over from "Am I saving enough?". Check them: the age in mind is {age} and the spending {amount} a month.',
    /** b→a when the spending was a level or the age was not given: no figures to name. */
    'b→a.plain': 'We have brought your figures over from "Am I saving enough?". Check them.'
  },

  /** "This question is for people who are still working" (screens-A-B.md 6.4). */
  retired: {
    title: 'This question is for people who are still working.',
    body: 'Your figures say you have stopped: the money starts now and your State Pension is being paid.',
    note: '"That’s wrong" sets the money to start from an age you choose, and this question opens as usual.'
  },

  answer: {
    needFour: 'We need four things to work this out.',
    needFix: 'One of your figures needs another look before we can work this out.',
    sensible: 'Everything else starts from a sensible assumption that you can change.',
    updating: 'Updating',
    first: 'This is a first figure. We are still trying it against more futures.',
    failedTitle: 'Sorry, we could not work that out.',
    failedBody: 'Nothing has been lost. Your numbers are still here:',
    summary: { pot: 'Pot', age: 'age', stop: 'stop at', ages: 'show me ages', aMonth: 'a month', in: 'in', partner: 'and a partner' },

    rangeTitle: 'What you could spend from',
    rangeNote: '(a month, after tax, at today’s prices)',
    /** The key under the three amounts. Its counts are the answer's own (BAND in src/answers/shared/rules.js). */
    rangeKey: 'careful = lasts in 9 futures out of 10 · middling = 5 out of 10 · good = the best 1 in 10',

    yearsTitle: 'The years before your State Pension',
    yearsNote: '(what you spend, a month, after tax, at today’s prices)',

    chartTitle: 'Other ages, side by side',
    chartTitleAges: 'Ages, side by side',
    chartSpending: 'Spending',
    chartAge: 'Age',
    /** For two: each row is your age, with your partner's in brackets. */
    chartAgeCouple: 'Age (partner’s)',
    chartSpend: 'Could spend',
    chartLasted: 'Lasted to',
    chartVerdict: 'On these figures',
    chartNow: 'now',
    chartKey: '"Could spend" is the careful amount: the most that lasted in 9 futures out of 10 if you stopped at that age. 9 in 10 or better is a yes.',
    chartPress: 'Press an age to see it in full.',
    chartWorking: 'Working out the other ages…',
    /** A count out of 10 in a chart row, and its two words-only ends. */
    count: '{n} in 10',
    countJustUnder: 'just under 9 in 10',
    /** Under 1 in 20: the bar beside it is empty, so never "1 in 10". From 95%, short of every one: the bar is full. */
    countFewer: 'fewer than 1 in 10',
    countMore: 'more than 9 in 10',
    countEvery: 'every one',
    countNone: 'none',
    /** The word for a row's verdict — the same three as the headline, never only a colour. */
    verdictWord: { yes: 'yes', close: 'close', no: 'not on these figures' },

    tableTitle: 'Every age, side by side',
    /** Under the table, when it has ages before a pension can be touched (the age drawn by Money after each). */
    tableClosed: {
      single: 'A pension cannot be touched before',
      you: 'Your pension cannot be touched before',
      partner: 'Your partner’s pension cannot be touched before',
      then: 'Stopping earlier, the years until then are paid from other savings alone; with none, nothing pays them.'
    },
    /** Under the table, for someone under 50: why it jumps from the age now to 50. */
    tableFrom50: 'Ages under 50 are left out, apart from your age now: the table starts at 50.',
    tableRunOut: 'In a bad case (the worst 1 in 10) it runs out at',
    tablePot: 'Pot by then, middling',
    tableLasts: 'lasts',

    oneMoreTitle: 'One more year',

    assumedTitle: 'What we assumed',
    assumedNote: '(press "Change" to alter one)',
    assumedChange: 'Change',
    assumedSingle: 'Worked out for you alone.',
    assumedCouple: 'Worked out for the two of you.',
    assumedAll: 'See all of them',
    assumedFewer: 'Show fewer',

    tryTitle: 'Try a change',
    tryStop: 'Stop age',
    tryStopDown: 'Stop 1 year earlier',
    tryStopUp: 'Stop 1 year later',
    tryStopAges: 'show me ages',
    tryPot: 'Pot',
    tryPotCouple: 'Your pot',
    tryPotDown: 'Pot down by {amount}',
    tryPotUp: 'Pot up by {amount}',
    tryPartnerPot: 'Partner’s pot',
    tryPartnerPotDown: 'Partner’s pot down by {amount}',
    tryPartnerPotUp: 'Partner’s pot up by {amount}',
    trySpend: 'Spending',
    trySpendDown: 'Spending down by {amount}',
    trySpendUp: 'Spending up by {amount}',
    tryPartTime: 'Part-time',
    tryPartTimeNone: 'none',
    tryPartTimeYears: '{n} years',
    tryPartTimeYear: '1 year',
    tryPartTimeDown: 'Part-time work: take away a year',
    tryPartTimeUp: 'Part-time work: add a year',
    tryPartTimeAt: 'at',
    tryPartTimeYearly: 'Part-time earnings, a year before tax',
    trySavingRisk: 'Risk while saving',
    tryRisk: 'Risk once stopped',
    before: 'Before:',
    noBefore: 'nothing yet',
    aMonth: 'a month',
    /** The start of "Before / Now": what was changed between the two answers: [before the old figure, before the new one, after it]. */
    changed: {
      lead: 'You changed',
      and: 'and',
      stop: ['the stop age from', 'to'],
      pot: ['the pot from', 'to'],
      partnerPot: ['your partner’s pot from', 'to'],
      payIn: ['what goes in each month from', 'to'],
      spend: ['the spending from', 'to'],
      partTimeYears: ['part-time work from', 'to'],
      partTimeYearly: ['part-time earnings from', 'to', 'a year'],
      savingRisk: ['the risk while saving from', 'to'],
      risk: ['the risk once stopped from', 'to'],
      other: 'your numbers'
    },

    nextTitle: 'What next?',
    /** The hand-over to C: "What could I spend a month from 60?" (the age drawn by Money). */
    toCStart: 'What could I spend a month from',
    toCEnd: '?',
    /** Under that link when C does not ask everything this answer was given (handOver.c.same false). */
    toCDiffers: '"What is that a month?" does not ask about money going into savings each month, part-time work or a different risk while saving, so its figure can differ from this one.',
    keepWhy: 'so you can come back to it and carry on'
  },

  /**
   * Every field of SCHEMA_A, by path. `label` is the visible label (the legend of a choice); `options` the words
   * for each option; `help` the words under the box; `errors` the sentence for a messageId of validate.js.
   */
  fields: {
    household: { label: 'Who is this for?', options: { single: 'Just me', couple: 'Me and my partner' } },

    'you.pot': {
      label: 'Your pension pot',
      help: 'All your pension pots added together.',
      errors: {
        required: 'Type the size of your pension pot, for example 250,000. A rough figure is fine. Type 0 if you have none.',
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

    'you.payIn.kind': {
      label: 'Going in each month',
      options: { total: 'One figure', split: 'Split into your part and your employer’s' }
    },
    'you.payIn.total': {
      label: 'All together, a month',
      help: 'Everything that lands in your pension each month, including your employer’s part. Leave it blank if nothing goes in.',
      errors: { notANumber: 'Use figures only, for example 600. Leave it blank if nothing goes in.' }
    },
    'you.payIn.own': {
      label: 'Your part, a month',
      help: 'What lands in your pension from your pay, with the tax the government adds back included.',
      errors: { required: 'Type what you pay in each month, for example 450. Type 0 if you pay nothing.', notANumber: 'Use figures only, for example 450.' }
    },
    'you.payIn.employer': {
      label: 'Your employer’s part, a month',
      errors: { required: 'Type what your employer pays in each month, for example 250. Type 0 if they pay nothing.', notANumber: 'Use figures only, for example 250.', 'pay-in-over-limit': 'Your part and your employer’s part together can be up to £10,000 a month.' }
    },
    'you.alreadyDrawing': {
      label: 'Have you already taken money from a pension pot, beyond the tax-free part?',
      options: { no: 'No', yes: 'Yes' },
      help: 'If you have, the most that can go in each year falls to £10,000.'
    },

    savings: {
      label: 'Other savings you would spend',
      help: 'ISAs, cash, investments. 0 if none.',
      errors: { notANumber: 'We could not read that as an amount. Use figures only, for example 40,000.' }
    },

    'stop.kind': {
      label: 'When do you have in mind?',
      options: { age: 'An age', ages: 'I have no age in mind — show me ages' },
      errors: { 'stop-ages-past-75': 'We show ages up to 75, and you are older than that. To see what your money could pay from now, ask "What is that a month?"' }
    },
    'stop.age': {
      label: 'The age you have in mind',
      errors: {
        required: 'Type the age you have in mind, for example 60. Or choose "show me ages".',
        notANumber: 'Type the age you have in mind, for example 60.',
        tooLow: 'That is younger than you are now. Type your age or a later one.',
        tooHigh: 'We can show ages up to 75. Type 75 or less, or choose "show me ages".',
        'stop-not-before-now': 'That is younger than you are now. Type your age or a later one.'
      }
    },

    'spend.kind': {
      label: 'What you would spend',
      options: { amount: 'An amount', level: 'I don’t know — pick a level' },
      help: 'What it costs to live, at today’s prices.'
    },
    'spend.amount': {
      label: 'A month, after tax',
      errors: {
        required: 'Type what you would spend a month, for example 2,000. Or pick a level.',
        notANumber: 'Use figures only, for example 2,000.',
        tooLow: 'With nothing to spend there is nothing to test. Type an amount, or pick a level.'
      }
    },
    'spend.level': { label: 'The level', options: { minimum: 'Basic', moderate: 'Moderate', comfortable: 'Comfortable' } },

    'partTime.has': { label: 'Some part-time work after you stop?', options: { no: 'No', yes: 'Yes' } },
    'partTime.yearly': {
      label: 'Earning a year, before tax',
      help: 'Taxed as income. National Insurance is not included.',
      errors: { required: 'Type what the work would pay a year before tax, and how many years, for example 12,000 for 3 years.', notANumber: 'Use figures only, for example 12,000.' }
    },
    'partTime.years': {
      label: 'For how many years',
      errors: {
        required: 'Type what the work would pay a year before tax, and how many years, for example 12,000 for 3 years.',
        notANumber: 'Type a whole number of years, from 1 to 15.',
        tooLow: 'Type a whole number of years, from 1 to 15.',
        tooHigh: 'Type a whole number of years, from 1 to 15.'
      }
    },

    'partner.age': {
      label: 'Partner’s age',
      errors: {
        required: 'Type your partner’s age in years.',
        notANumber: 'Type an age between 18 and 100.',
        tooLow: 'Type an age between 18 and 100.',
        tooHigh: 'Type an age between 18 and 100.'
      }
    },
    'partner.pot': {
      label: 'Partner’s pension pot',
      help: '0 if none.',
      errors: { notANumber: 'We could not read that as an amount. Use figures only, for example 90,000.' }
    },
    'partner.statePension.kind': { label: 'Partner’s State Pension', options: { full: 'The full amount', forecast: 'Forecast', none: 'None' } },
    'partner.statePension.yearly': {
      label: 'Partner’s forecast, a year',
      errors: { required: 'Type the yearly amount from your partner’s State Pension forecast, for example 9,000.', notANumber: 'Use figures only, for example 9,000.' }
    },
    'partner.finalSalary.has': { label: 'Partner’s final-salary pension?', options: { no: 'No', yes: 'Yes' } },
    'partner.finalSalary.yearly': {
      label: 'The amount a year',
      help: 'The yearly amount before tax, as the scheme states it.',
      errors: { required: 'Type the yearly amount before tax, for example 9,000.', notANumber: 'Use figures only, for example 9,000.' }
    },
    'partner.finalSalary.fromAge': {
      label: 'The age it starts',
      errors: { required: 'Type the age your partner’s final-salary pension starts. It is on the yearly statement.' }
    },
    'partner.payIn.kind': {
      label: 'Going into your partner’s pension each month',
      options: { total: 'One figure', split: 'Split into their part and their employer’s' }
    },
    'partner.payIn.total': {
      label: 'All together, a month',
      help: 'Including their employer’s part. Leave it blank if nothing goes in.',
      errors: { notANumber: 'Use figures only, for example 300. Leave it blank if nothing goes in.' }
    },
    'partner.payIn.own': {
      label: 'Their part, a month',
      help: 'What lands in their pension from their pay, with the tax the government adds back included.',
      errors: { required: 'Type what your partner pays in each month. Type 0 if nothing.', notANumber: 'Use figures only, for example 200.' }
    },
    'partner.payIn.employer': {
      label: 'Their employer’s part, a month',
      errors: { required: 'Type what your partner’s employer pays in each month. Type 0 if nothing.', notANumber: 'Use figures only, for example 100.', 'pay-in-over-limit': 'Their part and their employer’s part together can be up to £10,000 a month.' }
    },
    'partner.alreadyDrawing': {
      label: 'Has your partner already taken money from a pension pot, beyond the tax-free part?',
      options: { no: 'No', yes: 'Yes' }
    },

    savingsIn: {
      label: 'Going into ISAs and savings each month',
      help: '0 if none.',
      errors: { notANumber: 'Use figures only, for example 300.' }
    },
    savingRisk: {
      label: 'Risk level while you are saving',
      options: { cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' },
      optionHelp: { cautious: 'about a third in shares', balanced: 'about half in shares', adventurous: 'about two thirds in shares' }
    },
    risk: {
      label: 'Risk level once you have stopped',
      options: { cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' },
      optionHelp: { cautious: 'about a third in shares', balanced: 'about half in shares', adventurous: 'about two thirds in shares' }
    },
    charge: {
      label: 'Charges (funds and platform), a year',
      help: 'What your funds and your platform take each year, as a share of what you hold, while you save and while you draw. Not taken off State Pension or final-salary pensions: there is no such charge on those.'
    },
    endAge: {
      label: 'Make it last to age',
      errors: { 'end-after-stop': 'That is not later than the age you stop. Choose a later age.' }
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
    count: {
      required: 'Type a whole number.',
      notANumber: 'Type a whole number from {min} to {max}.',
      tooLow: 'Type a whole number from {min} to {max}.',
      tooHigh: 'Type a whole number from {min} to {max}.'
    },
    other: 'Choose one of these.'
  }
};
