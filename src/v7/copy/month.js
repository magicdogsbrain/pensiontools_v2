/**
 * The words of Month by month (research/v7/months-in-v7.md §1; 7.2.0). Data only — this file imports nothing. Placeholders
 * are written {likeThis} and filled by the screen; the figures are never here. It is a record page: every figure is the
 * classic planner's own, said exactly (never "about £"), before tax and after tax (never gross or net), shares and bonds
 * (never equities), the pension (never a product's initials).
 */
export const MONTH = {
  title: 'Month by month',
  lead: 'Each month: what to draw and where it comes from, then record the month. When a tax year starts, set it up first. Months you missed can be filled in at once.',
  needsLock: 'Months are recorded against a locked plan: its settings are fixed, so every month is read against the same plan. Lock the plan first — you can unlock it later to change it.',
  lockLink: 'Lock the plan',
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  example: 'This is the example plan: it shows how Month by month works, and records nothing. Make a plan of your own to record your months.',
  failed: 'This plan’s months could not be read here. The classic planner still has them.',
  nothing: 'Every month this plan can record is recorded.',
  locked: 'Recording a month changes nothing in your locked plan: the months are read against it.',
  /** The months missed, at the top (MonthFill's offer: every month the fill can reach before the month chosen). */
  gap: { one: '{words} is not recorded.', many: '{count} months are not recorded: {words}.', button: 'Fill them in with this month’s figures' },
  sections: { month: 'This month', setUp: 'Set up {year}', pots: 'What your platform shows', advice: 'What to draw this month, and where it comes from', fill: 'The months you did not record', recent: 'Your recent months', later: 'Coming next to Month by month' },
  yearDone: 'Tax year {year}: set up from {from}.',
  yearDoneIncome: 'Tax year {year}: set up from {from}, {income} a year before tax.',
  yearEdit: 'To change a tax year once it is set up, use the classic planner for now.',
  prefilled: 'Filled in from {month}, the last month recorded: change them to what your platform shows today.',
  cadence: { quarterly: 'Your plan draws each quarter. Here each month is recorded on its own for now; the classic planner records the three months at once.', annual: 'Your plan draws once a year. Here each month is recorded on its own for now; the classic planner records the twelve months at once.' },
  partner: 'Your partner records their months on their own plan, ‘{name}’.',
  partnerLink: 'Open its Month by month',
  fields: {
    'mo.month':        { label: 'The month', help: 'The months not recorded yet.' },
    'mo.paid':         { label: 'Has this month’s payment already been made?', options: { no: 'No', yes: 'Yes — plan from next month' }, help: 'Then enter the pots as they are after it.' },
    'mo.mode':         { label: 'How to enter your pension', options: { platform: 'As your platform shows it', type: 'By type: shares, bonds and cash' } },
    'mo.total':        { label: 'Pension total, in pounds', help: 'What your platform shows for the whole pension.', helpContract: 'What your platform shows for the whole pension: the gilts and the cash together.' },
    'mo.cash':         { label: 'Of which cash, in pounds', help: 'Cash and money-market funds inside the pension.' },
    'mo.bonds':        { label: 'Of which bond funds or gilts, in pounds', help: 'Bond funds and any gilts held directly. Shares are the rest.' },
    'mo.diversifiers': { label: 'Of which gold and trend, in pounds', help: 'What your plan holds in gold and trend funds.' },
    'mo.equity':       { label: 'Shares, in pounds' },
    'mo.bond':         { label: 'Bonds, in pounds' },
    'mo.cashT':        { label: 'Cash, in pounds' },
    'mo.diversifier':  { label: 'Gold and trend, in pounds' },
    'mo.isa':          { label: 'Your ISAs, in pounds', help: 'Blank or 0 if you hold none. Your plan can take from them to keep the pension within the 20% band.' },
    'mo.gia':          { label: 'Ordinary investment account, in pounds', help: 'Carried from your last month, or your plan.' },
    'mo.giaBasis':     { label: 'What it cost you, in pounds', help: 'Carried from your last month. Blank if you do not know: what it is worth is then taken as its cost.' },
    'mo.from':         { label: 'Start from' },
    'ty.cpi':          { label: 'Last year’s price rise, %', help: 'It moves this year’s suggested income.' },
    'ty.income':       { label: 'Income before tax for this year, in pounds', help: 'What you want to live on, counting the State Pension and any other income below.' },
    'ty.other':        { label: 'Other taxable income this year, in pounds', help: 'A workplace pension in payment, rent, part-time work: a year’s worth.' },
    'ty.cgt':          { label: 'Gains already made this tax year outside your plan, in pounds', help: 'They share the £3,000 allowance for gains with any sale from an ordinary investment account.' },
    'ty.toDate':       { label: 'Income before tax already received this tax year (April to {prev}), in pounds', help: 'Pay, rent, dividends, pension already drawn. Leave out {month}’s own payment: it is the first one worked out here.' },
    'ty.taxToDate':    { label: 'Tax already taken off that income, in pounds (optional)', help: 'From payslips or a statement. Blank if you do not know: that income is then taken as taxed on its own.' },
    'ty.pa':           { label: 'Tax-free allowance, in pounds' },
    'ty.brl':          { label: '20% tax up to (taxable income), in pounds' },
    'ty.hrl':          { label: '45% tax above (taxable income), in pounds' },
    'ty.isa':          { label: 'How much can your ISAs or savings give this tax year, in pounds', labelOptional: 'Still want some of this year’s income from your ISAs or savings? In pounds (optional)' },
    'ty.choice':       { label: 'Which would you like?', options: {
      increase: 'Take {need} from your ISAs or savings this year: the pension income stays within the 20% band',
      reduced: 'Take less: {brl} before tax this year, and leave your ISAs and savings to grow',
      inefficient: 'Take the full {income} from the pension, and pay 40% tax on the part above the band'
    } }
  },
  errors: {
    number: 'Enter a figure in pounds, like 250,000.',
    negative: 'This cannot be below 0.',
    big: 'This looks too big: check the figure.',
    march: 'March’s payment is the last of the tax year: record March itself, then April with its new tax year.',
    recorded: 'Next month is already recorded.',
    income: 'Enter the income you want before tax for the year.',
    choose: 'Choose one of these first.',
    other: 'Check this box.'
  },
  /** The pots' own problems (MonthlyEntry.splitFromPlatform's, in these words). */
  potsProblems: {
    noTotal: 'Enter the pension total: the one figure your platform shows for the whole pension.',
    cashOverTotal: 'The cash figure is more than the pension total: check the two figures.',
    partsOverTotal: 'The parts add up to more than the pension total: check the figures.'
  },
  setUp: {
    leadApril: 'A new tax year: the whole year, April to March. Your plan needs this year’s figures before it can work out a month.',
    leadPart: 'Starting in {month}: {n} payments to come this tax year, this month’s included. Your plan needs this year’s figures before it can work out a month.',
    suggestion: {
      chain: 'With prices up {cpi}%, this year’s income before tax would be {amount} a year.',
      declining: 'Your plan’s spending falls a little each year (about {pct}% a year at today’s prices). Last year’s income rises with prices, less that fall, to {amount} a year before tax.',
      'budget-schedule': 'From your plan’s income for this year, raised to this year’s prices: {amount} a year before tax.',
      /** A plan stored with its start later than this tax year: the suggestion is its first income step (its home asks to move the start). */
      firstStep: 'From your plan’s first income step: {amount} a year before tax.',
      cashCover: ' At that rate your cash covers {n} of the {m} payments to come.'
    },
    statePension: {
      none: 'State Pension: none in your plan. Add your forecast under Money that comes in anyway.',
      noAmount: 'State Pension: starts {when}; the amount is not in your plan yet. Add it under Money that comes in anyway.',
      paying: 'State Pension: {monthly} a month ({amount} this tax year).',
      startsThisYear: 'State Pension: starts {when}, {monthly} a month ({amount} this tax year).',
      later: 'State Pension: starts {when}.'
    },
    spLater: 'The State Pension starts {from} at {monthly} a month: the months before it come from the pension.',
    bandsChange: 'Change the tax bands',
    bandsHide: 'Hide the tax bands',
    topUp: {
      title: 'Tax-free top-up',
      notNeeded: 'No tax-free top-up is needed: {income} before tax fits within the 20% band ({brl}).',
      need: 'To keep the pension income within the 20% band ({brl}) for the {n} payments to come and still reach {income} before tax, you need {need} from your ISAs or savings this tax year. Money from an ISA or savings is not taxed.',
      exhausted: 'Your income so far this tax year is already above the 20% band ({brl}), so pension income this year is taxed at 40% or more.',
      short: 'That is {shortfall} short of the {need} needed.',
      /** a tax year the pension cannot be touched (7.4.1): the whole of it comes from the ISAs and other savings */
      closed: 'Before {age} your plan can’t take money from your pension, so this tax year’s {income} before tax comes from your ISAs and other savings: {need} for the {n} payments to come. Money from them is not taxed.'
    },
    bank: { title: 'What reaches your bank each month', from: 'From', before: 'Before tax', tax: 'Tax', after: 'After tax', pension: 'Pension', other: 'Other income', statePension: 'State Pension', isa: 'ISAs or savings (no tax)', total: 'Total', line: '{after} a month reaches your bank.' },
    efficient: 'Pension income kept within the 20% band; ISAs or savings top it up.',
    closedYear: 'Nothing comes from the pension this tax year: ISAs or savings pay it.',
    inefficient: 'The full amount from the pension, with 40% tax on the part above the band.',
    button: 'Set up {year}',
    working: 'Setting up…',
    preview: 'Once {year} is set up with these figures, {month} works out as below.'
  },
  advice: {
    pension: 'From your pension, before tax',
    tax: 'Tax on it',
    afterTax: 'Your income this month, after tax',
    isa: 'From your ISAs (no tax)',
    gia: 'From your ordinary investment account: sell {sold}; {net} reaches you{cgt}.',
    giaCgt: ' after {cgt} tax on the gain',
    other: 'Other income, in the total: {amount}',
    statePension: 'State Pension, in the total: {amount}',
    recycle: 'Of the pension withdrawal, {gross} fills your 20% band: pay {net} of it into your ISA.',
    boost: 'This includes {boost} to make up for income cut in earlier months.',
    cut: 'Income is cut this month: your invested pots are below the line your plan keeps them above, so the plan takes less until they recover.',
    notEfficient: 'This tax year takes the full income from the pension, so some of it is taxed at 40%.',
    fromTitle: 'Where it comes from',
    from: {
      cash: 'Cash', bonds: 'Bonds', shares: 'Shares', diversifiers: 'Gold and trend',
      rung: 'The gilt for {year}, already paid out as cash', thisYear: 'This year’s gilt, already paid out as cash', cashYears: 'The cash set aside for the first years',
      cashBefore: 'Your cash, until the first gilt pays', essentials: 'The gilt that pays for essentials', invested: 'Your invested money', investedRest: 'Your invested money, for the rest'
    },
    bought: 'Nothing is sold: the money is already in cash. The tax is the same, as it is still taken from your pension.',
    movesTitle: 'Moves to make',
    moves: {
      sharesToBonds: 'Move {amount} from shares to bonds.', bondsToShares: 'Move {amount} from bonds to shares.', bondsToCash: 'Move {amount} from bonds to cash.',
      topUpCash: 'Top up your cash: move {amount} from shares and bonds.', lowCash: 'Cash is low: this month takes money from pots below the line your plan keeps them above.'
    },
    recalc: 'With the filled-in months on record, this month works out differently: the figures above include them.'
  },
  fill: {
    tickLabel: 'Fill in the months you did not record?',
    no: 'No, only this month',
    closed: 'Fill in earlier months you did not record, starting from:',
    choose: 'Choose a month',
    help: {
      notSetUpStops: '{year} is not set up, so the fill stops before {month}, and {box} will not be recorded either until it is. Set {year} up first: choose {april} as the month.',
      notSetUpNone: '{year} is not set up, so the months from {month} cannot be filled in until it is: choose {april} as the month and set it up.',
      pending: '{months} can be filled in once {year} is set up: set it up above, with what you received in them.',
      pendingOne: '{months} can be filled in once {year} is set up: set it up above, with what you received in it.'
    }
  },
  refused: {
    recorded: '{month} is already recorded.',
    beforeSetUp: '{month} comes before your {year} set-up (from {from}), which already counts what you received in it. To record it, choose a later month and fill in the earlier months from there: {month} then takes its share.'
  },
  record: { button: 'Record {month}', withFill: 'Record {month} and fill in {n} month{s}', working: 'Recording…' },
  /**
   * Nothing due (7.3.0, research/v7/one-product-design.md "Forms become tools"): the tool says so with the date the next
   * month opens — a month is due from its own 1st — and the form comes only when asked for.
   */
  idle: '{month} is recorded. {next} opens on 1 {next} (record it early if the payment has gone).',
  other: 'Record a different month',
  recent: { row: '{month}: {afterTax} after tax, {tax} tax', none: 'No months recorded yet.' },
  later: {
    items: ['Your months against the plan, by tax year', 'Each tax year as a spreadsheet, and the printed documents', 'Drawing each quarter or once a year', 'Changing a tax year once it is set up'],
    until: 'Until then they are in the classic planner.',
    button: 'Open them in the classic planner'
  },
  problems: {
    notLocked: 'This plan is not locked: lock it first, then record its months.',
    notSetUp: 'Set up the tax year first.',
    refused: 'That month cannot be recorded: see the note above.',
    setUpAlready: 'That tax year is already set up.',
    noMonth: 'There is no month left to record.',
    problems: 'Some boxes need a look first: see the notes beside them.',
    locked: 'This plan was closed, or changed elsewhere, since this page opened: nothing was written. Open it again from Your plans.',
    storage: 'This browser would not keep the change. Nothing was written.',
    nobody: 'You are no longer signed in: nothing was written. Sign in and try again.',
    usedUp: 'Your free time without an account is used up: nothing was written. Make an account to keep going.',
    notHere: 'This plan is no longer here: nothing was written.',
    readonly: 'This plan is shown as it was saved: nothing was written.',
    example: 'The example plan records nothing.',
    failed: 'That did not save. Try again.'
  },
  toast: {
    recorded: '{month} recorded.',
    recordedFilled: '{month} recorded, with {n} month{s} filled in: {months}.',
    stopped: 'Recorded {written} filled-in month(s); the fill stopped before {month} because {year} is not set up. {box} was not recorded.',
    setUp: '{year} set up from {month}.',
    savedShort: 'Saved.',
    undone: 'Put back as it was.',
    unchanged: 'Nothing changed.'
  },
  buttons: { undo: 'Undo', close: 'Close', back: 'Back to your plan' }
};
