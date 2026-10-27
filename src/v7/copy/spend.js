/**
 * The words of "What you spend" (research/v7/editing-in-v7.md 8). Data only — this file imports nothing. Placeholders are
 * written {likeThis} and filled by the screen. The figures are never here. The "then" pick-list, the fall box, the picture
 * and the below-essentials line reuse the spending shape's own words (copy/shape.js).
 */
export const SPEND = {
  title: 'What you spend',
  lead: 'What you spend each month after tax, at today’s prices, and how it changes as you get older. The plan works out the figure before tax and shows it; the budget is a guide only.',
  savedValue: '({value})',
  source: { saved: 'From your plan, saved {date}', savedUndated: 'As saved in the plan', locked: 'Fixed when you locked the plan on {date}.' },
  sections: { budget: 'Your budget, as a guide', first: 'From the start', steps: 'Later steps', chart: 'What the plan pays each year', costs: 'One-off costs' },

  /** The budget as a guide (the owner's rule): shown beside the figure, never used to work it out. */
  budget: {
    total: 'All in: {total} a month after tax; essentials {essentials}.',
    totalNoEssentials: 'All in: {total} a month after tax.',
    source: 'From your budget (a guide), saved {date}.',
    sourceUndated: 'From your budget (a guide).',
    guide: 'A guide only: the plan uses the figures in the boxes below, never the budget. Working it out line by line is the better way to choose them.',
    use: 'Use {total} a month at the start',
    change: 'Change the budget lines',
    none: 'Your budget is not worked out, so you are choosing by one figure. That is fine for a first look, but most people spend more than they think, and the plan is only as good as the figures below. Working it out line by line is the better way.',
    workOut: 'Work it out, line by line'
  },
  /** The lump sums coming in, offered as income (the planner's own offer under its picture). */
  lumps: {
    lead: 'Money that comes in during the plan pays for the shape above; it is not added to it. Spread evenly over the years left, each lump sum could support:',
    line: '{label}, {amount} at age {age}: {perYear} a year more before tax over the {years} years left, no growth, at today’s prices.',
    add: 'Add {perYear} a year from age {age}',
    help: 'Raises the step in force at that age and every later one by that amount; the lump sum stays as the money that pays for it. Then Save, or Cancel to put the steps back.'
  },

  /** The first row: its age is the plan's start and is never asked. */
  first: {
    legend: 'From age {age}, the plan’s first year',
    legendFlat: 'From age {age}, the plan’s first year (the same every year until you add a step)',
    amount: 'A month after tax, at today’s prices',
    /** Under the amount box: the before-tax figure the plan saves (shown, never asked). */
    gross: '{gross} a year before tax, as the plan saves it.',
    floorAndFlex: 'The essentials your way of drawing (Floor & Flex) buys as a floor are set with the way of drawing, in the planner.'
  },

  /** The later steps, as cards. */
  steps: {
    one: 'Step {n}', add: '+ Add a step', remove: 'Remove this step', none: 'No later step: the same figure every year, going up with prices.',
    suggest: 'Suggest go-go, go-slow and no-go years',
    suggestHelp: 'Many people spend more in the first years after they stop (the go-go years: travel, projects), less from their mid-70s (go-slow), and less again later (no-go), though care can cost more.',
    /** Under "Suggest": what it fills in (the planner's own rule, on the before-tax figures, to £500 a year). */
    suggestDone: 'Fills in 15% less from {age75} and 30% less from {age85}{floor} — the planner’s own suggestion, worked out before tax to the nearest £500 a year and said here a month after tax. A typical pattern, not a figure for you: change any of it. Cancel puts the steps back as they were.',
    suggestDoneOne: 'Fills in 30% less from {age85}{floor} — the planner’s own suggestion, worked out before tax to the nearest £500 a year and said here a month after tax. A typical pattern, not a figure for you: change any of it. Cancel puts the steps back as they were.',
    suggestFloor: ', not below your budget’s essentials of {amount} a month',
    suggestNone: 'You start after 85, so there is nothing to fill in. Add your own steps if you like.',
    fields: {
      fromAge: { label: 'From age' },
      amount: { label: 'A month after tax, at today’s prices' },
      then: { label: 'then' },
      fallsPct: { label: 'Falls by' }
    },
    /** Under a later step's amount: the before-tax figure and its share of the start (and of the budget, a guide). */
    gross: '{gross} a year before tax, as the plan saves it. {pct}% of the start.',
    grossBudget: '{gross} a year before tax, as the plan saves it. {pct}% of the start, {budgetPct}% of your budget (a guide).',
    errors: {
      fromAge: { required: 'Type the age this step starts, for example 75.', notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 110, please.', beforeStart: 'This is not later than the plan’s first year, at {startAge}. Make it later, or change the figure above instead.', afterEnd: 'This is after the end of the plan, at {endAge}. Make it earlier, or remove it.', sameAge: 'Two steps start at this age. Each step starts at its own age.' },
      amount: { required: 'Type what you would spend a month from this age, for example 2,000.', notANumber: 'Figures only, like 2,000.', tooLow: 'At least £1 a month. To stop a step, remove it.', tooHigh: 'An amount up to £50,000 a month, please.' },
      then: { notAnOption: 'Choose what happens from this age.', glidesLast: 'There is no later step to move towards. Add one, or choose another.' },
      fallsPct: { required: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.', range: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.' }
    }
  },

  /** The one-off costs, as cards. */
  costs: {
    one: 'One-off cost {n}', add: 'Add a one-off cost', remove: 'Remove this cost', none: 'No one-off cost in this plan.',
    lead: 'A car, a roof, a wedding: an amount on top of what you spend, at an age, once or every year for a few years.',
    fields: {
      label:  { label: 'What it is', help: 'Like “New roof” or “A car”.' },
      amount: { label: 'A year after tax, at today’s prices' },
      atAge:  { label: 'At age' },
      years:  { label: 'For how many years', help: '1 for once.' },
      prices: { label: 'Over the years', options: { rise: 'Going up with prices', fixed: 'A fixed sum, not going up' } }
    },
    /** Under a cost's amount: the before-tax figure the plan saves on top of that year's figure. */
    gross: '{gross} a year before tax on top of that year’s figure, as the plan saves it.',
    errors: {
      label:  { tooLong: 'Up to 60 letters, please.' },
      amount: { required: 'Type the amount a year.', notANumber: 'Figures only, like 20,000.', tooLow: 'An amount of at least £1.', tooHigh: 'An amount up to £1,000,000 a year, please.' },
      atAge:  { required: 'Type the age this cost is paid, for example 70.', notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 110, please.', beforeStart: 'The plan’s first year is at age {ageNow}. An age of {ageNow} or more, please.', afterEnd: 'That is after the plan ends at age {endAge}. An age up to {endAge}, please.' },
      years:  { notANumber: 'Whole years, please.', tooLow: 'At least 1 year.', tooHigh: 'Up to 60 years, please.', tooManyYears: 'That runs past the end of the plan at age {endAge}. Fewer years, please.' },
      prices: { notAnOption: 'Choose one.' }
    }
  },

  /** The first row's problems, by path. */
  errors: {
    'first.amount': { required: 'Type what you would spend a month from the start, for example 2,000.', notANumber: 'Figures only, like 2,000.', tooLow: 'At least £1 a month.', tooHigh: 'An amount up to £50,000 a month, please.' },
    'first.then': { notAnOption: 'Choose what happens from the start.', glidesLast: 'There is no later step to move towards. Add one, or choose another.' },
    'first.fallsPct': { required: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.', range: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.' }
  },

  derivedTitle: 'What this works out to',
  derived: {
    'first.level': 'From age {age}: {monthly} a month after tax ({yearly} a year before tax).',
    'first.falls': 'From age {age}: {monthly} a month after tax ({yearly} a year before tax), falling {pct}% a year to {endMonthly} at {endAge}.',
    'first.glides': 'From age {age}: {monthly} a month after tax ({yearly} a year before tax), moving evenly to {toMonthly} at {toAge}.',
    'step.level': 'From age {age}: {monthly} a month after tax ({yearly} a year before tax).',
    'step.falls': 'From age {age}: {monthly} a month after tax ({yearly} a year before tax), falling {pct}% a year to {endMonthly} at {endAge}.',
    'step.glides': 'From age {age}: {monthly} a month after tax ({yearly} a year before tax), moving evenly to {toMonthly} at {toAge}.',
    'floor.from': 'From age {age} your State Pension and other pensions pay more than this ({monthly} a month after tax): the plan pays that, and nothing is taken from your pension or savings.',
    'cost.once': '{label}: {net} after tax at age {age} (tax year {year}), once — {gross} before tax on top of that year’s figure, {prices}.',
    'cost.years': '{label}: {net} a year after tax from age {age} (tax year {year}) for {years} years — {gross} a year before tax on top of each year’s figure, {prices}.',
    'ff.note': 'The essentials your way of drawing (Floor & Flex) buys as a floor are set with the way of drawing, in the planner.'
  },
  prices: { rise: 'going up with prices', fixed: 'a fixed sum' },
  chartTitle: 'What the plan pays each year, after tax, at today’s prices',
  notUsed: 'Not used by this way of drawing.',
  partner: '{name}’s spending is on {name}’s plan.',
  partnerLink: 'Open ‘{name}’: what you spend',
  buttons: { save: 'Save', cancel: 'Cancel', undo: 'Undo', close: 'Close', back: 'Back to your plan' },
  toast: {
    saved: 'Saved. From age {age}: {monthly} a month after tax. Later steps: {steps}. One-off costs: {costs}.',
    savedShort: 'Saved.', undone: 'Put back as it was.', unchanged: 'Nothing has changed.'
  },
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
