/**
 * The words of the budget step — "What would you spend?" — and its sheet (research/v7/budget-step.md). Data only —
 * this file imports nothing. The step's label and next sentences are A's and B's own (copy/a.js, copy/b.js).
 *
 * The rule the words keep: the budget is a guide. The figure every answer uses is the one in the box, the person's
 * own; the budget's total is shown beside it, "Use £X a month" copies it in, and nothing else moves it.
 *
 * Placeholders are written {likeThis} and filled by the component that shows the string. Every string passes the
 * banned list in every scope A and B are shown in (tests/v7/wording/budgetWords.test.js).
 *
 * Note: the design's "recommended" beside "Work it out line by line" is on the banned list ("recommend"), so the
 * option says it is the better way in the owner's own word instead.
 */
export const BUDGET = {
  spend: {
    lead: 'Every answer here uses one figure: what you would spend a month, after tax, at today’s prices. Working out a budget helps you choose it.',
    howLegend: 'How would you like to work it out?',
    how: { lines: 'Work it out line by line', one: 'Just put in one figure' },
    howHelp: { lines: 'better, about 5 minutes', one: 'quicker' },
    /** Shown once, under the box, while the spending is a figure of the person's own with no budget behind it. */
    skipNote: 'You are skipping the budget. That is fine for a first look, but most people spend more than they think, and the answer is only as good as this figure. You can work it out line by line at any time; your answer will keep this figure until you choose to change it.',
    budgetIs: 'Your budget adds up to {amount} a month.',
    budgetNow: 'Your budget now adds up to {amount} a month; this uses {used}.',
    budgetSame: 'This is your budget’s total.',
    use: 'Use {amount} a month',
    /** The national guide levels, beside the box: a second guide, never the figure unless the person picks one. */
    levels: 'The national guide levels (the Retirement Living Standards) for {who}: Basic {minimum}, Moderate {moderate} and Comfortable {comfortable} a month.',
    who: { single: 'one person', couple: 'a couple' }
  },

  sheet: {
    title: 'Your budget, line by line',
    intro: 'What you spend now, or expect to, after tax, at today’s prices. Leave a line blank if it is not yours. The typical amounts are for the {level} level for {who}: a guide, never filled in for you.',
    couple: 'One budget for the household: the two of you together.',
    levelWord: { minimum: 'Basic', moderate: 'Moderate', comfortable: 'Comfortable' },
    headings: {
      home: 'Home', bills: 'Bills', food: 'Food', gettingAbout: 'Getting about', holidays: 'Holidays', health: 'Health',
      family: 'Family and giving', other: 'Other'
    },
    subtotal: '{amount} a month',
    item: 'What it is',
    amountOf: 'Amount for {name}',
    amountNew: 'Amount',
    period: 'How often',
    periods: { mo: 'a month', yr: 'a year' },
    essential: 'Essential',
    remove: 'Remove',
    removeOf: 'Remove {name}',
    add: 'Add a line',
    addTo: 'Add a line to {name}',
    typical: { mo: 'Typical: {amount} a month', yr: 'Typical: {amount} a year' },
    total: 'Your budget adds up to {amount} a month ({yearly} a year).',
    noTotal: 'Your budget adds up to £0 so far. Put an amount against the lines that are yours.',
    essentials: 'Essentials: {amount} a month. A guide for your own judgement; it does not change any figure.',
    /** Where the total sits against the national guide levels (the levels themselves are beside the spending box). */
    where: {
      belowMinimum: 'Against the national guide levels for {who}, that is below Basic.',
      minimumToModerate: 'Against the national guide levels for {who}, that is between Basic and Moderate.',
      moderateToComfortable: 'Against the national guide levels for {who}, that is between Moderate and Comfortable.',
      aboveComfortable: 'Against the national guide levels for {who}, that is at or above Comfortable.'
    },
    oneOffsTitle: 'One-off costs',
    oneOffsNote: 'A car every few years, a new roof: listed here as a guide. They are not added to the figure a month. Leave "Repeats every" blank for a cost that comes once.',
    oneOff: { label: 'What it is', amount: 'Amount', year: 'Year', every: 'Repeats every (years)' },
    addOneOff: 'Add a one-off cost',
    problems: {
      notANumber: 'Use figures only, for example 150.',
      tooLow: 'Type an amount of £0 or more.',
      tooHigh: 'That is more than we can work with here.',
      tooLong: 'Keep it to 60 characters or fewer.',
      notAYear: 'Type a year, for example 2031.',
      yearOutOfRange: 'Type a year from this year on, up to 60 years ahead.',
      yearNeeded: 'Type the year it falls in.',
      notAnEvery: 'Type a whole number of years from 1 to 50, or leave it blank for once.'
    }
  },

  /** Under an answer of A or B, and on C's answer when a budget exists. */
  answer: {
    noBudget: 'Spending: {amount} a month, your own figure (no budget yet).',
    noBudgetLevel: 'Spending: {amount} a month, the {level} level (no budget yet).',
    /** With steps by age (spending-shape.md 7.2): the figure is where the spending begins, then the steps. */
    noBudgetShaped: 'Spending: {amount} a month, then as you set it by age: your own figures (no budget yet).',
    noBudgetLevelShaped: 'Spending: {amount} a month, the {level} level, then as you set it by age (no budget yet).',
    fromBudgetShaped: 'Spending: {amount} a month, your budget’s total, then as you set it by age.',
    workItOut: 'Work it out line by line',
    fromBudget: 'Spending: {amount} a month, your budget’s total.',
    ownWithBudget: 'Spending: {amount} a month, your own figure.',
    changeBudget: 'See your budget',
    c: {
      less: 'Your budget adds up to {amount} a month. This gives about {diff} a month less.',
      more: 'Your budget adds up to {amount} a month. This gives about {diff} a month more.',
      same: 'Your budget adds up to {amount} a month. This gives about the same.'
    }
  }
};
