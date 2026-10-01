/**
 * The words of question B — "Am I saving enough, and what should I pay in?". Data only — this file imports nothing.
 *
 * Labels, help and error sentences are keyed by the field paths of SCHEMA_B (src/answers/b/schema.js); step labels
 * and next sentences by the ids of src/v7/rail/b.js. The sentences that state the answer are NOT here: the answer
 * function builds them (src/answers/b/sentences.js).
 *
 * Source: research/v7/screens-A-B.md 2.2, 4, 5, 6 and 9 (verbatim where it gives the words), with the step 4 brief's
 * changes (conflicts 11, 14, 20–28, 34–38, 42, 44–47). Placeholders are written {likeThis} and filled by the
 * component that shows the string. Every string passes the banned list in every scope B is shown in.
 */
export const B = {
  title: 'Am I saving enough, and what should I pay in?',

  steps: {
    numbers: { label: 'What have you saved, and what are you paying in?', short: 'Your numbers' },
    /** The budget step (research/v7/budget-step.md). Its own words are in copy/budget.js. */
    spend:   { label: 'What would you spend?', short: 'What you spend' },
    answer:  { label: 'Am I on course, and what should I pay in?', short: 'What to pay in' },
    choices: { label: 'What if I stop later, or pay in more, or both?', short: 'Two levers together' },
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

  /** One per state; the first that applies wins, in the order of NEXT_B in src/v7/rail/b.js. */
  next: {
    'b.retired':  'This question is for people who are still paying in. Your figures say you have stopped.',
    'b.failed':   'Next: try again. Your numbers are still here.',
    'b.working':  'Working out your answer.',
    'b.blank':    'Next: your age, your pot, what goes in each month and the age you have in mind.',
    'b.spend':    'Next: what would you spend? Work it out line by line, or put in one figure.',
    'b.fix':      'Next: check the figure marked below.',
    'b.fix.unmarked': 'Next: fill in the box that is still empty, then press "Show what I need".',
    'b.ready':    'Next: press "Show what I need".',
    'b.keep':     'Next: check the name, then press "Save as a plan".',
    /** b.keep when this answer cannot be saved. */
    'b.keep.not': 'Next: back to your answer.',
    /** On the grid step itself (two levers together). */
    'b.choices':  'Next: press a cell to put that stop age and that pay-in in your numbers, or go back to your answer.',
    'b.choices.couple': 'Next: compare the stop ages and pay-ins, then go back to your answer.',
    'b.none':     'Next: try a later age or a lower amount below.',
    'b.short':    'Next: pick one of the ways to make it fit below, or try two together.',
    'b.onCourse': 'Next: you are on course. Try a change below, or save this as a plan so you can come back to it.',
    unbuilt:      'Next: back to your answer.'
  },

  /** Button and link words, by the label ids the rail uses and by the test ids of the brief (4.13). */
  buttons: {
    show: 'Show what I need',
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
    choices: 'Two levers together',
    /** The rail's button on "short" (b.action.together): to step 3. */
    together: 'Two levers together',
    tryTwo: 'Try two together',
    tryLever: 'Try',
    willItLast: 'Will it last, and could I spend more?',
    imWorking: 'That’s wrong — I’m working',
    'next.a': 'When could I afford to stop?',
    'next.c': 'What is that a month?'
  },

  numbers: {
    intro: 'Rough figures are fine. You can change any of them afterwards.',
    partnerTitle: 'Your partner',
    partnerDone: 'You both stop in the same year. The number and what to pay in are for the two of you together.',
    moreTitle: 'More detail (all optional)',
    stays: 'Your figures stay in this browser until you choose to save them as a plan.',
    levelIs: '{level}: {amount} a month for {who} (Retirement Living Standards).',
    levelWho: { single: 'one person', couple: 'a couple' }
  },

  /** The Retirement Living Standards levels as a month, to the pound (RULES.plsa ÷ 12; checked by the render test). */
  levels: {
    single: { minimum: '£1,200', moderate: '£2,608', comfortable: '£3,592' },
    couple: { minimum: '£1,867', moderate: '£3,592', comfortable: '£4,917' }
  },

  carried: {
    'c→b': 'We have brought your figures over from "What is that a month?". Add what goes into your pension each month and the age you have in mind.',
    'a→b': 'We have brought your figures over from "When can I afford to stop work?". Check them, and add what goes into your pension each month.',
    /** The same when what goes in each month came over too: check it, never "add" it. */
    'c→b.payIn': 'We have brought your figures over from "What is that a month?", with {amount} a month going into your pension. Check them, and fill in anything left empty.',
    'a→b.payIn': 'We have brought your figures over from "When can I afford to stop work?", with {amount} a month going into your pension. Check them.'
  },

  retired: {
    title: 'This question is for people who are still paying in.',
    body: 'Your figures say you have stopped: the money starts now and your State Pension is being paid.',
    note: '"That’s wrong" sets the money to start from an age you choose, and this question opens as usual.'
  },

  answer: {
    needFive: 'We need five things to work this out.',
    needFix: 'One of your figures needs another look before we can work this out.',
    sensible: 'Everything else starts from a sensible assumption that you can change.',
    updating: 'Updating',
    first: 'This is a first figure. We are still trying it against more futures.',
    payInWorking: 'Working out what to pay in…',
    failedTitle: 'Sorry, we could not work that out.',
    failedBody: 'Nothing has been lost. Your numbers are still here:',
    summary: { pot: 'Pot', age: 'age', in: 'a month in', stop: 'stop at', aMonth: 'a month', partner: 'and a partner' },

    /** Over the number when the pay-in is the answer: a guide, not a second answer (the reviewers' finding, 1 Oct 2026). */
    guideTitle: 'A guide: the pot that would pay for it',

    potsTitle: 'What the pot could be by',
    potsNote: '(at today’s prices)',
    potsKey: 'bad case = the worst 1 in 10 · good case = the best 1 in 10',

    leversTitle: 'Ways to make it fit',
    leversNote: '(each on its own: press "Try" to put it in your numbers)',
    lever: {
      stopLater: 'Stop later',
      payMore: 'Pay in more',
      spendLess: 'Spend less',
      moreRisk: 'More risk while saving',
      accept: 'Accept the chance'
    },
    /** The screen-reader words of a lever's button: "Try: Stop later". */
    tryLever: 'Try: {name}',

    assumedTitle: 'What we assumed',
    assumedNote: '(press "Change" to alter one)',
    assumedChange: 'Change',
    assumedSingle: 'Worked out for you alone.',
    assumedCouple: 'Worked out for the two of you.',
    assumedAll: 'See all of them',
    assumedFewer: 'Show fewer',

    tryTitle: 'Try a change',
    tryPayIn: 'Pay in',
    tryPayInCouple: 'You pay in',
    tryPayInDown: 'Pay in {amount} less a month',
    tryPayInUp: 'Pay in {amount} more a month',
    tryPartnerPayIn: 'Partner pays in',
    tryPartnerPayInDown: 'Partner pays in {amount} less a month',
    tryPartnerPayInUp: 'Partner pays in {amount} more a month',
    tryStop: 'Stop age',
    tryStopDown: 'Stop 1 year earlier',
    tryStopUp: 'Stop 1 year later',
    trySpend: 'Spending',
    trySpendDown: 'Spending down by {amount}',
    trySpendUp: 'Spending up by {amount}',
    trySavingRisk: 'Risk while saving',
    tryConfidence: 'How often it should last',
    before: 'Before:',
    noBefore: 'nothing yet',
    aMonth: 'a month',
    /** The start of "Before / Now": what was changed between the two answers: [before the old figure, before the new one, after it]. */
    changed: {
      lead: 'You changed',
      and: 'and',
      stop: ['the stop age from', 'to'],
      pot: ['the pot from', 'to'],
      payIn: ['what goes in each month from', 'to'],
      partnerPayIn: ['what goes into your partner’s pension each month from', 'to'],
      spend: ['the spending from', 'to'],
      savingRisk: ['the risk while saving from', 'to'],
      risk: ['the risk once stopped from', 'to'],
      confidence: ['how often it should last from', 'to'],
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

  /** Step 3, the grid of stop age against pay-in (screens-A-B.md 4.3). */
  choices: {
    spending: 'Spending',
    spendingEnd: 'a month after tax from the age you stop, to',
    spendingEndCouple: 'a month after tax from the age you both stop, until the younger of you is',
    stopAt: 'Stop at',
    needs: 'Pot that pays it',
    payIn: 'Pay in a month',
    now: '(now)',
    /** The column that is what it needs, when the grid holds it. */
    neededMark: '(needed)',
    /** Under the grid when no cell is on the careful line. */
    none: 'None of these reach the careful line of 9 futures out of 10.',
    key: 'Each cell: in how many futures out of 10 your money lasted, stopping at that age and paying in that much a month until then. 9 in 10 or better is the careful line.',
    /** The wide screen's extra column, explained (it is not drawn on a phone, so neither is this). */
    keyGuide: '"Pot that pays it" is a guide: the pot that, with exactly that at the stop age, pays the spending in 9 futures out of 10.',
    press: 'Press a cell to put that stop age and that pay-in in your numbers.',
    onCourse: 'You are on course at what you pay in now. The table shows how other stop ages and pay-ins compare.',
    working: 'Working out every stop age and pay-in together…',
    cell: 'Stop at {age} and pay in {amount} a month: your money lasted {words}.',
    count: '{n} in 10',
    countJustUnder: 'just under 9 in 10',
    countFewer: 'fewer than 1 in 10',
    countMore: 'more than 9 in 10',
    countEvery: 'every one',
    countNone: 'none'
  },

  /**
   * Every field of SCHEMA_B, by path. `label` is the visible label (the legend of a choice); `options` the words
   * for each option; `help` the words under the box; `errors` the sentence for a messageId of validate.js.
   */
  fields: {
    household: { label: 'Who is this for?', options: { single: 'Just me', couple: 'Me and my partner' } },

    'you.pot': {
      label: 'Your pension pot',
      help: 'All your pension pots added together.',
      errors: {
        required: 'Type the size of your pension pot, for example 180,000. A rough figure is fine. Type 0 if you have none.',
        notANumber: 'We could not read that as an amount. Use figures only, for example 180,000.'
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
      help: 'Everything that lands in your pension each month, including your employer’s part. It is on your statement or in your pension app.',
      errors: {
        required: 'Type what goes into your pension each month, for example 700. Type 0 if nothing does.',
        notANumber: 'Use figures only, for example 700. Type 0 if nothing goes in.'
      }
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

    'stop.age': {
      label: 'The age you would stop work',
      labelCouple: 'Your age when you both stop work',
      errors: {
        required: 'Type the age you would stop work, for example 60.',
        notANumber: 'Type the age you have in mind, for example 60.',
        tooLow: 'Choose an age later than you are now. If you have stopped work, "Will it last?" is the question for you.',
        tooHigh: 'We can work with ages up to 75. Type 75 or less.',
        'stop-after-now': 'Choose an age later than you are now. If you have stopped work, "Will it last?" is the question for you.'
      }
    },

    'spend.kind': {
      label: 'What you want to spend',
      options: { amount: 'An amount', level: 'I don’t know — pick a level' },
      help: 'What it costs to live, at today’s prices.'
    },
    'spend.amount': {
      label: 'A month, after tax, from then',
      errors: {
        required: 'Type what you would spend a month, for example 2,000. Or pick a level.',
        notANumber: 'Use figures only, for example 2,000.',
        tooLow: 'With nothing to spend there is nothing to work out. Type an amount, or pick a level.'
      }
    },
    'spend.level': { label: 'The level', options: { minimum: 'Basic', moderate: 'Moderate', comfortable: 'Comfortable' } },

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

    savings: {
      label: 'Other savings you would spend',
      help: 'ISAs, cash, investments. 0 if none.',
      errors: { notANumber: 'We could not read that as an amount. Use figures only, for example 20,000.' }
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
    },
    confidence: {
      label: 'How often your money should last',
      options: { nineInTen: 'In 9 futures out of 10', threeInFour: 'In 3 futures out of 4' }
    }
  },

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
