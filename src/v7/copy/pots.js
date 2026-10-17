/**
 * The words of "Your pots and tax" (research/v7/editing-in-v7.md 9). Data only — this file imports nothing. Placeholders
 * are written {likeThis} and filled by the screen. The figures are never here.
 */
export const POTS = {
  title: 'Your pots and tax',
  lead: 'What you hold today, how it grows and how it is taxed. Each fact once. The split of your pension, the risk level and the funds to test are set with the way of drawing and mix.',
  savedValue: '({value})',
  source: { saved: 'From your plan, saved {date}', savedUndated: 'As saved in the plan', locked: 'Fixed when you locked the plan on {date}.' },
  sections: { pension: 'Your pension pot', stop: 'At the day you stop', isa: 'ISAs and savings', taxable: 'Your ordinary account', charges: 'Charges', tax: 'Tax' },
  /** Under a section's heading. */
  notes: {
    pension: 'One figure for the whole pot. How it is split into shares, bonds and cash is set with the way of drawing and mix.',
    stop: 'Leave both blank to use the planner’s own figures for the day you stop, worked out from what you pay in.',
    taxable: 'Money held outside a pension or ISA: an ordinary investment or savings account. It is drawn before the ISA and taxed each year.',
    charges: 'What your funds and your platform take each year, as a share of what you hold. It comes off every month, from the money in funds and cash in your pension, ISAs and ordinary account.',
    tax: 'The thresholds the plan taxes with in its first year, and how you take the tax-free part of your pension. What each choice saves in tax over the plan comes from ‘Does it last?’, later.'
  },
  /** The labels, options and help, by field path. */
  fields: {
    pension:      { label: 'Your pension pot today, in pounds', help: 'Everything in your pension pots, at today’s value.' },
    stopSipp:     { label: 'Your pension at the day you stop, in pounds (or leave blank)' },
    stopIsa:      { label: 'Your ISAs and savings at the day you stop, in pounds (or leave blank)' },
    isa:          { label: 'ISAs and savings today, in pounds', help: '0 if none.' },
    isaGrowth:    { label: 'How your ISAs and savings grow', options: { cash: 'Mostly cash: like cash, by last year’s rise in prices less 1% a year, never below nothing', invested: 'Invested like my pension: the same mix of shares, bonds and cash, in the same futures' } },
    isaUse:       { label: 'How the ISA is used', options: { minimiseEarlyTax: 'Tax-efficient: top up income from the ISA before paying higher-rate tax', maximiseLongevity: 'Make it last: level the ISA across the years to your State Pension', hold: 'Hold it: never drawn for income; it still rescues the plan if the pension runs out' } },
    taxable:      { label: 'Money in your ordinary account today, in pounds', help: '0 if none.' },
    taxableMix:   { label: 'What it holds', options: { equity: 'Shares (dividends taxed; tax on gains when sold)', gilt: 'Gilts (no tax on gains; a tiny coupon)', bond: 'Bond funds (interest taxed; tax on gains when sold)', balanced: 'A mix (60% shares, 20% bonds, 20% gilts)', cash: 'Cash (interest taxed)' } },
    giaBand:      { label: 'Your tax band for that account', options: { basic: 'Basic rate', higher: 'Higher rate' } },
    earnings:     { label: 'Earnings this year, before tax, in pounds (if still working)', help: 'Sets how much of a lump sum can go into your pension. 0 if none.' },
    bedAndIsa:    { label: 'Move £20,000 a year from the ordinary account into the ISA whenever the allowance is unused', options: { yes: 'Yes', no: 'No' } },
    charges:      { label: 'Charges (funds and platform), % a year', help: 'For example a 0.2% tracker on a 0.25% platform is 0.45. 0.5 is a typical total. From 0 to 3, in steps of 0.05.' },
    pa:           { label: 'Tax-free allowance, in pounds' },
    brl:          { label: 'Basic rate up to, in pounds' },
    hrl:          { label: 'Higher rate up to, in pounds' },
    taxMode:      { label: 'The thresholds', options: { inflates: 'Rise with prices', frozen: 'Stay frozen' } },
    taxFree:      { label: 'Your 25% tax-free part', options: { drawdown: 'Kept separate, or already taken: every draw is taxed in full', ufpls: 'Part of my income: a quarter of every draw is tax-free, until the £268,275 allowance is used' } },
    ufplsYears:   { label: 'For how many years (blank for the whole plan)' },
    ufplsThenIsa: { label: 'Then move the remaining quarter, tax-free, into my ISA', options: { yes: 'Yes', no: 'No' } },
    bandFill:     { label: 'Fill the basic-rate band and move the rest into my ISA', help: 'Draws extra from your pension up to the top of the 20% band even when you do not need it, and moves what is left after tax into your ISA (up to £20,000 a year): 20% now so that money comes out tax-free later.', options: { yes: 'Yes', no: 'No' } }
  },
  /** The problems, in plain words, by field path and message id. */
  errors: {
    pension:      { required: 'Type what is in your pension pots today, for example 250,000.', notANumber: 'Figures only, like 250,000.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' },
    stopSipp:     { notANumber: 'Figures only, like 400,000, or leave it blank.', tooLow: 'At least £1, or leave it blank.', tooHigh: 'An amount up to £50,000,000, please.' },
    stopIsa:      { notANumber: 'Figures only, like 40,000, or leave it blank.', tooLow: 'At least £1, or leave it blank.', tooHigh: 'An amount up to £50,000,000, please.' },
    isa:          { notANumber: 'Figures only, like 40,000, or 0.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' },
    isaGrowth:    { required: 'Choose how your ISAs grow.', notAnOption: 'Choose one of the two.' },
    isaUse:       { notAnOption: 'Choose one of the three.' },
    taxable:      { notANumber: 'Figures only, like 20,000, or 0.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £50,000,000, please.' },
    taxableMix:   { notAnOption: 'Choose what the account holds.' },
    giaBand:      { notAnOption: 'Choose basic or higher rate.' },
    earnings:     { notANumber: 'Figures only, like 30,000, or 0.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £10,000,000, please.' },
    bedAndIsa:    { notAnOption: 'Yes or no.' },
    charges:      { required: 'Type the charge, for example 0.5.', notANumber: 'A figure like 0.5, please.', range: 'A charge from 0 to 3% a year, please.' },
    pa:           { required: 'Type the tax-free allowance, for example 12,570.', notANumber: 'Figures only, like 12,570.', tooLow: 'An amount of £1 or more.', tooHigh: 'An amount up to £1,000,000, please.' },
    brl:          { required: 'Type where the basic rate ends, for example 50,270.', notANumber: 'Figures only, like 50,270.', tooLow: 'An amount of £1 or more.', tooHigh: 'An amount up to £1,000,000, please.', belowAllowance: 'The basic rate must end above the tax-free allowance.' },
    hrl:          { required: 'Type where the higher rate ends, for example 125,140.', notANumber: 'Figures only, like 125,140.', tooLow: 'An amount of £1 or more.', tooHigh: 'An amount up to £1,000,000, please.', belowBasic: 'The higher rate must end above the basic rate.' },
    taxMode:      { notAnOption: 'Choose one of the two.' },
    taxFree:      { notAnOption: 'Choose one of the two.' },
    ufplsYears:   { notANumber: 'Whole years, please, or leave it blank.', tooLow: 'At least 1 year, or leave it blank.', tooHigh: 'Up to 60 years, please.' },
    ufplsThenIsa: { notAnOption: 'Yes or no.' },
    bandFill:     { notAnOption: 'Yes or no.' }
  },
  /** Under a box: a setting this way of drawing ignores, or a note the planner shows beside its own box. */
  notUsed: 'Not used by this way of drawing.',
  useNotes: {
    pinned: 'This way of drawing is sized on its own pot and ISA figures, set with the way of drawing (in the planner); the figure here is what the plan holds today.',
    isaGrowthBought: 'Not used by this way of drawing once it is running: it spends the ISA as part of its own pot. Until the day you stop, it still sets how your ISAs grow.',
    isaFunds: 'Follows the ISA funds in your list of funds to test, set with the way of drawing and mix.',
    isaGrowthLocked: 'A fixed 3% a year: this plan was locked before this choice was added. Unlocking it offers the choice.',
    chargesLocked: 'None: this plan was locked before charges were added. Unlocking it sets 0.5% a year.'
  },
  derivedTitle: 'What this works out to',
  derived: {
    'pots.today': 'Pension {pension} and ISAs and savings {isa} today.',
    'pots.todayTaxable': 'Pension {pension} and ISAs and savings {isa} today; {taxable} in your ordinary account.',
    'pots.split': 'Split as saved: {shares} shares, {bonds} bonds, {cash} cash{div}. The split, the risk level and the funds to test are set with the way of drawing and mix (in the planner).',
    'pots.fromFunds': 'Your pension pot of {pension} comes from your list of funds to test: change it with the way of drawing and mix (in the planner).',
    'pots.pinned': 'This way of drawing is sized on its own figures: {pension} pension and {isa} ISAs, set with the way of drawing (in the planner).',
    'stop.typed': 'At the day you stop, as you typed it: {sipp} pension and {isa} ISAs and savings.',
    'stop.projection': 'The planner works out {sipp} pension and {isa} ISAs and savings at the day you stop, from what you pay in. Type your own above to use it instead.',
    'stop.answer': 'From your answer: {sipp} pension and {isa} ISAs and savings at the day you stop in a middling future; in a bad case (the worst 1 in 10) {sippBad} and {isaBad}.',
    'stop.none': 'What you will have at the day you stop comes from ‘Does it last?’, later; until then every run uses today’s pots.',
    'stop.blanked': 'Left blank: every run uses today’s pots, and the planner works out its own figures for the day you stop the next time it draws your plan.',
    'isa.cash': 'Your ISAs and savings grow mostly as cash: by last year’s rise in prices, less 1% a year, never below nothing.',
    'isa.invested': 'Your ISAs and savings grow like your pension: its mix of shares, bonds and cash, in the same futures.',
    'isa.fixed': 'Your ISAs and savings grow at a fixed 3% a year: this plan was locked before the choice was added.',
    'isa.funds': 'Your ISAs grow as the ISA funds in your list of funds to test do.',
    'isa.use.minimiseEarlyTax': 'The ISA tops up your income before you pay higher-rate tax.',
    'isa.use.maximiseLongevity': 'The ISA is spread evenly across the years to your State Pension.',
    'isa.use.hold': 'The ISA is held, never drawn for income, and nothing new is moved into it; it still rescues the plan if the pension runs out.',
    'charges.some': 'Charges of {pct}% a year come off your funds and cash every month — not off gilts you hold directly, annuities, or final-salary and State Pensions.',
    'charges.none': 'No charges come off: 0% a year.',
    'charges.locked': 'No charges come off: this plan was locked before charges were added.',
    'tax.bands': 'Tax-free allowance {pa}; basic rate up to {brl}; higher rate up to {hrl}; {mode}.',
    'tax.free.drawdown': 'Every draw from your pension is taxed in full: the tax-free part is kept separate, or already taken.',
    'tax.free.ufpls': 'A quarter of every draw from your pension is tax-free{years}{then}.',
    'tax.bandFill': 'Extra is drawn up to the top of the basic-rate band and what is left after tax moved into your ISA.',
    'tax.saves': 'What each choice saves in tax over the plan comes from ‘Does it last?’, later.'
  },
  /** Words for a derived line's slots. */
  modes: { inflates: 'the thresholds rise with prices', frozen: 'the thresholds stay frozen' },
  ufplsYears: { some: ' for {years} years', whole: ' for the whole plan' },
  ufplsThen: { yes: ', then the remaining quarter goes into your ISA tax-free', no: '' },
  partner: '{name}’s pots and tax are on {name}’s plan.',
  partnerLink: 'Open ‘{name}’: your pots and tax',
  buttons: { save: 'Save', cancel: 'Cancel', undo: 'Undo', close: 'Close', back: 'Back to your plan' },
  toast: {
    saved: 'Saved. Pension {pension}, ISAs and savings {isa}. Charges {charges}% a year.',
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
