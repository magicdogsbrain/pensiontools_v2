/**
 * The words of the spending shape — "Does what you spend change as you get older?" (research/v7/spending-shape.md 7.1,
 * 7.3, 7.4). Data only — this file imports nothing.
 *
 * The owner's rule (2 Oct 2026): V7 offers at least what today's planner offers on the income shape — any number of steps
 * by age, each staying the same, falling by a percentage a year, or moving evenly to the next — and the go-go, go-slow
 * and no-go years, one tap away. These words are where a person meets that.
 *
 * The block sits on the spend step of A and B (amounts a month) and under C's "Add more detail" (each later step a share
 * of what C works out you could start on). The sentences that state an answer are NOT here: the answer functions build
 * them (src/answers/<q>/sentences.js).
 *
 * Placeholders are written {likeThis} and filled by the component that shows the string. Every string passes the
 * banned list in every scope it is shown in — A's and B's saver and retired scopes, and all of C's (retired)
 * (tests/v7/wording/shapeWords.test.js). Nothing here says "net", "gross", "per", "real terms", "compound", "glide path",
 * "recommend", "we suggest" or "will last".
 */
export const SHAPE = {
  legend: 'Does what you spend change as you get older?',

  /** The block, closed: one line and the button that opens it. */
  closed: {
    level: 'No: the same every year, going up with prices.',
    /** With a shape: what it holds, in a few words ({list}: "from 62: the figure above; from 75: £2,130 a month …"). */
    shaped: 'Yes, as you set it: {list}.'
  },
  open: 'Change it with age',
  close: 'Close',

  /** The block, open. */
  lead: 'Many people spend more in the first years after they stop (the go-go years: travel, projects), less from their mid-70s (go-slow), and less again later (no-go), though care can cost more. Set steps by age. Every figure is after tax, at today’s prices, and goes up with prices.',
  /** C works the starting amount out: the later steps are shares of it. */
  leadC: 'Many people spend more in the first years (the go-go years: travel, projects), less from their mid-70s (go-slow), and less again later (no-go), though care can cost more. Your answer is what you could spend a month at the start. Set later ages as a share of it: 85% means 15% less.',

  suggest: 'Suggest go-go, go-slow and no-go years',
  /** After "Suggest": what was filled in. {floor} is `suggestFloor` when the budget's essentials held a step up. */
  suggestDone: 'Filled in: 15% less from {age75} and 30% less from {age85}{floor}. A typical pattern from research on how people spend, not a figure for you: change any of it.',
  suggestDoneOne: 'Filled in: 30% less from {age85}{floor}. A typical pattern from research on how people spend, not a figure for you: change any of it.',
  suggestFloor: ', not below your budget’s essentials of {amount} a month',
  suggestCouple: 'For two of you, the ages are from when the younger of you is 75 and 85.',
  suggestNone: 'You start after 85, so there is nothing to fill in. Add your own steps if you like.',
  /** C: no amount yet, so the go-slow and no-go years are shares. */
  suggestDoneC: 'Filled in: 85% of what you start on from {age75} and 70% from {age85}. A typical pattern from research on how people spend, not a figure for you: change any of it.',
  suggestDoneOneC: 'Filled in: 70% of what you start on from {age85}. A typical pattern from research on how people spend, not a figure for you: change any of it.',
  /** Before there is a first amount to work from (A and B). */
  suggestNeedsFirst: 'Type what you would spend a month first, then press it again.',

  presets: 'Or:',
  presetLevel: 'The same every year',
  presetLevelDone: 'Back to the same every year.',
  presetSlowly: 'Slowly less',
  presetSlowlyHelp: 'The same for 5 years, then 1% less each year for 20 years, then the same.',
  presetSlowlyDone: 'Filled in: the same for 5 years, then 1% less each year for 20 years, then the same. Change any of it.',
  /** "Show me ages": there is no stop yet for "Slowly less" to count its 5 years from (today's counts from the plan's start). */
  slowlyNeedsStop: '‘Slowly less’ counts its years from when you stop, and ‘show me ages’ has no stop yet. Choose an age to stop at, then press it again, or set your own steps by age.',
  undo: 'Undo',
  undone: 'Put back as it was.',

  /** The first row: the figure typed above (A, B), from the stop; or now, for anyone who has stopped; or C's start. */
  firstRow: 'From when you stop at {age}',
  firstRowNow: 'From now, at {age}',
  firstRowAges: 'From when you stop',
  /** A couple whose stops are their own, the partner stopping first: the household's money starts then (your age). */
  firstRowApart: 'From when the first of you stops, when you are {age}',
  firstRowC: 'From the start',
  firstAmount: '{amount} a month (the figure above)',
  firstAmountNone: 'the figure above',
  firstShareC: '100% of what you start on',

  step: {
    /** Each later step's age box. A couple's ages are yours, with your partner's beside them. */
    age: 'From age',
    ageCouple: 'From when you are',
    partner: '(your partner {age})',
    amount: 'Amount a month',
    amountHelp: 'a month',
    share: 'Share of what you start on',
    shareHelp: 'of what you start on',
    ofStart: '{pct}% of the start',
    /** With a budget (a guide): today's planner shows each later step as a share of the budget too. */
    ofStartBudget: '{pct}% of the start, {budgetPct}% of your budget (a guide)',
    title: 'Step from {age}',
    titleNew: 'New step'
  },

  then: {
    label: 'then',
    /** The pick-list's label, read out by a screen reader: what this step does from its age to the next. */
    labelOf: 'What happens from {age}',
    labelFirst: 'What happens from the start',
    level: 'stays the same',
    falls: 'falls by a percentage a year',
    glides: 'moves evenly to the next step',
    fallsBox: 'Falls by',
    fallsHelp: 'a year, at today’s prices'
  },

  add: '+ Add a step',
  remove: 'Remove',
  removeOf: 'Remove the step from {age}',
  removeNew: 'Remove this step',

  rescale: 'Move the later steps in proportion',
  rescaleNote: 'You changed the figure above. Your later steps are as you typed them.',
  rescaled: 'Later steps moved in proportion.',

  /** "Try a change" on an answer whose spending changes with age (spending-shape.md 6.5; today's T19). */
  try: {
    spendStart: 'Spending at the start',
    /** A's stop past a step: the step is the start, so the box is the figure typed for before any step. */
    spendTyped: 'Spending you typed, before any step',
    moves: 'Your later steps move with it, in proportion.',
    level: 'Try it the same every year',
    back: 'Put back my steps by age',
    kinds: { shaped: 'steps by age', level: 'the same every year' }
  },

  /**
   * On an answer whose spending changes with age (spending-shape.md 6, 7.2): the picture of every year at the amount the
   * answer is about (A and B: as you set it; C: the careful amount), drawn beside the answer, never inside it.
   */
  answer: {
    title: 'Each year, as you set it',
    titleC: 'Each year, at the careful amount',
    lead: 'After tax, at today’s prices: {list}.',
    leadC: 'The careful amount at the start, and your later ages in proportion, after tax, at today’s prices: {list}.',
    agesColumn: 'Could spend at the start',
    agesKey: '"Could spend at the start" is the careful amount at that age: the most that lasted in 9 futures out of 10 if you stopped at that age. Your later steps move with it, as you set them. 9 in 10 or better is a yes.',
    spendingShaped: 'a month at the start, then as you set it',
    /** "Show me ages" with a step some stops are past: those stops start on the step (spending-shape.md 6.3). */
    spendingShapedByAge: 'a month from when you stop, then as you set it by age. Stopping at or after a step, you start on that step’s figure.'
  },

  /** Shown under the steps (screen only): from the budget's essentials, a guide (spending-shape.md 7.4). */
  belowEssentials: 'From {age} this is less than your budget’s essentials ({amount} a month). That is allowed: it is your figure.',

  chart: {
    title: 'What you would spend each year, after tax, at today’s prices',
    titleC: 'Your shape: each year as a share of what you start on',
    key: 'Lighter: your State Pension and other pensions, after tax. Darker: from your pension and savings.',
    keyShapeOnly: 'Each bar is one year of your life.',
    keyEssentials: 'Dashed: your budget’s essentials (a guide).',
    bands: { goGo: 'go-go', goSlow: 'go-slow', noGo: 'no-go' },
    axis: 'Your age',
    axisCouple: 'Your age (your partner is {gap} {younger})',
    years: '{n} years',
    oneYear: '1 year',
    younger: 'younger',
    older: 'older',
    year: 'At {age}: {amount} a month.',
    yearSplit: 'At {age}: {amount} a month: {income} from your State Pension and other pensions, {pots} from your pension and savings.',
    yearShare: 'At {age}: {pct}% of what you start on.',
    yearBelow: 'Less than your budget’s essentials.',
    pick: 'Tap or point at a year to see it.',
    /** The one-sentence description a screen reader hears for the whole picture. */
    describe: 'A bar for each year from {from} to {to}: {list}.',
    table: 'Show each year',
    tableHide: 'Hide the years',
    tableAge: 'Age',
    tableAmount: 'A month',
    tableShare: 'Share of the start',
    tableIncome: 'From pensions you get anyway',
    tablePots: 'From your pension and savings'
  },

  /** In a summary or a list: one step. */
  list: {
    start: '{amount} a month from {age}',
    startNone: 'the figure above from {age}',
    startNow: '{amount} a month from now',
    startShare: 'what you start on from {age}',
    step: '{amount} from {age}',
    stepShare: '{pct}% from {age}',
    falls: 'falling {pct}% a year',
    glides: 'moving evenly to the next',
    fallsTo: 'falling {pct}% a year to {amount} at {age}',
    glidesTo: 'moving evenly to {amount} at {age}',
    and: 'and',
    more: '{n} more steps'
  },

  /** Under each box (spending-shape.md 7.3). */
  errors: {
    fromAge: {
      required: 'Type the age this step starts, for example 75.',
      notANumber: 'Type the age as a whole number, for example 75.',
      order: 'Each step starts later than the one before: make this later than {age}.',
      beforeStop: 'This is not later than when you stop, at {age}. Make it later, or change the figure above instead.',
      beforeFirstStop: 'This is not later than when the first of you stops, when you are {age}. Make it later, or change the figure above instead.',
      beforeNow: 'This is not later than your age today, {age}. Make it later.',
      beforeStart: 'This is not later than when the money starts, at {age}. Make it later.',
      afterEnd: 'This is after the end of the plan, at {age}. Make it earlier, or remove it.'
    },
    perMonth: {
      required: 'Type what you would spend a month from this age, for example 2,000.',
      notANumber: 'Use figures only, for example 2,000.',
      tooLow: 'Type at least £1 a month. To stop a step, remove it.',
      tooHigh: 'That is more than we can work with here. Type up to £50,000 a month.'
    },
    share: {
      required: 'Type a share of what you start on, for example 85.',
      notANumber: 'Use figures only, for example 85.',
      tooLow: 'Type a share of at least 1%. To stop a step, remove it.',
      tooHigh: 'Type a share of up to 500%.'
    },
    fallsPct: {
      range: 'Type a fall from 0.25% to 10% a year, in steps of 0.25, for example 1.'
    },
    then: {
      glidesLast: 'There is no later step to move towards. Add one, or choose another.',
      notAnOption: 'Choose what happens from this age.'
    },
    steps: {
      tooMany: 'That is more steps than years in the plan. Remove one.'
    },
    other: 'Check this figure.'
  }
};
