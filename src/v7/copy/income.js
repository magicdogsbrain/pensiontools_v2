/**
 * The words of "Money that comes in anyway" (research/v7/editing-in-v7.md 7). Data only — this file imports nothing.
 * Placeholders are written {likeThis} and filled by the screen. The figures are never here.
 */
export const INCOME = {
  title: 'Money that comes in anyway',
  lead: 'The State Pension, any final-salary pension, other income and lump sums you expect — each once, by age, before tax, at today’s prices. The plan works out the rest and shows it below.',
  savedValue: '({value})',
  source: { saved: 'From your plan, saved {date}', savedUndated: 'As saved in the plan', locked: 'Fixed when you locked the plan on {date}.' },
  sections: { sp: 'State Pension', fs: 'Final-salary pensions', other: 'Other income for the whole plan', streams: 'Income for some years', lumps: 'Lump sums you expect' },
  /** The planner's fallback when a plan has no State Pension figure (7.1), said in its own words. */
  assumedNote: 'Nothing entered: every run assumes {yearly} a year before tax from age {age}, and every figure that uses the State Pension says so. Choose the full amount, your forecast, or none.',
  assumedNoteNoAge: 'Nothing entered: every run assumes {yearly} a year before tax from your State Pension age, and every figure that uses the State Pension says so. Choose the full amount, your forecast, or none.',
  fields: {
    spKind:   { label: 'Your State Pension', options: { full: 'The full amount, {full} a year', forecast: 'My forecast', none: 'None', assumed: 'Leave it as assumed for now' }, help: 'Before tax. The plan takes it from your State Pension age; a saved date from your forecast is kept.' },
    spWeekly: { label: 'A week, before tax, from your forecast', help: 'Pounds a week, as the forecast letter gives it.' },
    spDate:   { label: 'The date it starts, from your forecast', help: 'As the letter gives it, like 6 May 2040. Blank: the plan takes your State Pension age, counted from the day your age was recorded. Every age in the plan is reckoned from this date.' },
    other:    { label: 'Other income for the whole plan, a year before tax', help: 'Pounds a year, from the plan’s first year on, going up with prices capped at 4% a year. Leave it blank for none.' }
  },
  errors: {
    spKind:   { required: 'Choose the full amount, your forecast, or none.', notAnOption: 'Choose one of the options offered.' },
    spWeekly: { required: 'Type the weekly amount from your forecast.', notANumber: 'Figures only, like 230.25.', tooLow: 'An amount of at least 1 a week.', tooHigh: 'An amount up to 1,000 a week, please.' },
    spDate:   { notADate: 'A date like 6 May 2040, please.', looksLikeBirth: 'That looks like a date of birth. The date your State Pension starts is on your forecast letter.' },
    other:    { notANumber: 'Figures only, like 1,200.', tooLow: 'An amount of 0 or more.', tooHigh: 'An amount up to 1,000,000 a year, please.' }
  },
  /** The lists of cards (7.2): one card's name, its boxes, its problems, add and remove. */
  lists: {
    fs: {
      one: 'Final-salary pension {n}', add: 'Add a final-salary pension', remove: 'Remove this pension', none: 'No final-salary pension in this plan.',
      fields: {
        amount:  { label: 'A year, before tax, at today’s prices' },
        fromAge: { label: 'Starts at age' },
        rises:   { label: 'How it rises', options: { lpi5: 'With prices, capped at 5% a year', cpi: 'With prices', level: 'Not at all' } }
      },
      errors: {
        amount:  { required: 'Type the pension a year.', notANumber: 'Figures only, like 9,400.', tooLow: 'An amount of at least 1 a year.', tooHigh: 'An amount up to 1,000,000 a year, please.' },
        fromAge: { required: 'Type the age it starts.', notANumber: 'Whole years, please.', tooLow: 'An age of 40 or more.', tooHigh: 'An age up to 100, please.', afterEnd: 'That is after the plan ends at age {endAge} — the pension would never pay. An age up to {endAge}, or lengthen the plan.' },
        rises:   { notAnOption: 'Choose one.' }
      }
    },
    streams: {
      one: 'Income for some years {n}', add: 'Add income for some years', remove: 'Remove this income', none: 'No income for some years in this plan.',
      fields: {
        label:   { label: 'What it is', help: 'Like “Part-time work” or “Rent”.' },
        amount:  { label: 'A year, before tax, at today’s prices' },
        fromAge: { label: 'From age' },
        toAge:   { label: 'To age', help: 'Leave it blank for the rest of the plan.' },
        rises:   { label: 'How it rises', options: { lpi5: 'With prices, capped at 5% a year', cpi: 'With prices', level: 'Not at all' } }
      },
      errors: {
        label:   { tooLong: 'Up to 60 letters, please.' },
        amount:  { required: 'Type the amount a year.', notANumber: 'Figures only, like 7,200.', tooLow: 'An amount of at least 1 a year.', tooHigh: 'An amount up to 1,000,000 a year, please.' },
        fromAge: { required: 'Type the age it starts.', notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 110, please.', afterEnd: 'That is after the plan ends at age {endAge}. An age up to {endAge}, please.' },
        toAge:   { notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 110, please.', beforeFrom: 'The age it ends cannot be before the age it starts.' },
        rises:   { notAnOption: 'Choose one.' }
      }
    },
    lumps: {
      one: 'Lump sum {n}', add: 'Add a lump sum', remove: 'Remove this lump sum', none: 'No lump sum in this plan.',
      fields: {
        label:   { label: 'What it is', help: 'Like “Inheritance” or “Downsizing”.' },
        amount:  { label: 'Amount, once, at today’s prices' },
        atAge:   { label: 'At age' },
        wrapper: { label: 'What kind', options: { cash: 'A cash lump sum', pension: 'An inherited pension', isa: 'An inherited ISA' }, help: 'Where a cash lump sum can go — the ISA allowance, the pension within its limit, the rest in a taxable account — is said under the card.' }
      },
      errors: {
        label:   { tooLong: 'Up to 60 letters, please.' },
        amount:  { required: 'Type the amount.', notANumber: 'Figures only, like 90,000.', tooLow: 'An amount of at least 1.', tooHigh: 'An amount up to 10,000,000, please.' },
        atAge:   { required: 'Type the age it arrives.', notANumber: 'Whole years, please.', tooLow: 'An age of 18 or more.', tooHigh: 'An age up to 110, please.', beforeStart: 'The plan’s first year is at age {ageNow}: money arriving before then counts as part of your pots today. An age of {ageNow} or more, please.', afterEnd: 'That is after the plan ends at age {endAge}. An age up to {endAge}, please.' },
        wrapper: { notAnOption: 'Choose one.' }
      },
      /** Where it lands, in the year it arrives (the planner's own rule, TaxableSleeve.routeWindfall): by the parts it has. */
      landing: {
        'lump.pension': 'It joins your pension, taxed as pension income when drawn.',
        'lump.isa': 'It joins your ISA, tax-free.',
        'lump.cash.ipt': 'That year: {isa} into the ISA, {pension} into the pension and {taxable} into a taxable account held as {mix}, taxed as such while it waits.',
        'lump.cash.it': 'That year: {isa} into the ISA and {taxable} into a taxable account held as {mix}, taxed as such while it waits.',
        'lump.cash.pt': 'That year: {pension} into the pension and {taxable} into a taxable account held as {mix}, taxed as such while it waits.',
        'lump.cash.t': 'That year: {taxable} into a taxable account held as {mix}, taxed as such while it waits.',
        'lump.cash.ip': 'That year: {isa} into the ISA and {pension} into the pension; nothing left over for a taxable account.',
        'lump.cash.i': 'That year: {isa} into the ISA; nothing left over for a taxable account.',
        'lump.cash.p': 'That year: {pension} into the pension; nothing left over for a taxable account.'
      },
      mix: { gilt: 'gilts', equity: 'shares', bond: 'bond funds', balanced: 'a 60/20/20 mix', cash: 'cash' }
    }
  },
  /** The rises and the kinds, in words, for the derived lines. */
  rises: { lpi5: 'going up with prices, capped at 5% a year', cpi: 'going up with prices', level: 'not going up' },
  wrappers: { cash: 'a cash lump sum', pension: 'an inherited pension', isa: 'an inherited ISA' },
  derivedTitle: 'What this works out to',
  derived: {
    'sp.none': 'No State Pension: the plan counts none.',
    'sp.assumed': 'State Pension: nothing entered, so every run assumes {yearly} a year before tax from age {age}.',
    'sp.assumedNoAge': 'State Pension: nothing entered, so every run assumes {yearly} a year before tax from your State Pension age.',
    'sp.paid': 'State Pension: {yearly} a year before tax from age {age} (tax year {year}).',
    'sp.noDate': 'State Pension: {yearly} a year before tax from age {age} (tax year {year}), the plan’s usual State Pension age — no date is saved.',
    'sp.noDateNoAge': 'State Pension: {yearly} a year before tax from your State Pension age.',
    'sp.before': 'State Pension: {yearly} a year before tax, already being paid in the plan’s first year (from {date}).',
    'fs.line': 'Final-salary pension {n}: {amount} a year before tax from age {age} (tax year {year}), {rises}.',
    'fs.before': 'Final-salary pension {n}: {amount} a year before tax from age {age}, counted as already being paid in the plan’s first year at {ageNow}, {rises}.',
    'other.line': 'Other income: {amount} a year before tax from the plan’s first year on, going up with prices capped at 4% a year.',
    'stream.line': '{label}: {amount} a year before tax from age {from} to age {to} ({years}), {rises}.',
    'stream.life': '{label}: {amount} a year before tax from age {from} for the rest of the plan, {rises}.',
    'lump.line': '{label}: {amount} at age {age} (tax year {year}), {what}.',
    'drawdown2028': 'Move into drawdown what you will need before {from} by {day}: after that, nothing new can be taken until you are {from}.'
  },
  notUsed: 'Not used by this way of drawing.',
  partner: '{name}’s State Pension and pensions are on {name}’s plan.',
  partnerLink: 'Open ‘{name}’: money that comes in anyway',
  buttons: { save: 'Save', cancel: 'Cancel', undo: 'Undo', close: 'Close', back: 'Back to your plan' },
  toast: {
    saved: 'Saved. State Pension: {sp}. Final-salary pensions: {fs}. Income for some years: {streams}. Lump sums: {lumps}.',
    sp: { none: 'none', assumed: 'as assumed, {yearly} a year from age {age}', paid: '{yearly} a year from age {age}', paidNoAge: '{yearly} a year' },
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
