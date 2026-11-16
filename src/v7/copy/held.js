/**
 * The words of "Your plan's mix" while living on a locked gilt ladder (7.12.0): both views draw the page from these, filled by
 * answers/plan/held.js sayHeld from heldLadderView's keys and slots. Data only — this file imports nothing. Placeholders are
 * written {likeThis}. Facts and what they change, never advice (src/v7/copy/banned.js is the law): nothing here says buy, sell
 * or order.
 */
export const HELD = {
  // the head of the page
  lead: 'What you hold, beside your plan as locked. Where they differ, we take it that is what you want. This page says the difference and what it changes.',
  agreed: 'You accepted what you hold as your plan on {date}.',
  noRecord: 'Nothing is recorded under What you hold yet. Your plan stays as locked; record what you hold and this page sets it beside the plan.',
  holdLink: 'What you hold',

  // the plan's gilts
  giltsTitle: 'The gilts your plan pays from',
  allSame: 'All {total} of your plan’s gilts are held, in the plan’s units.',
  allHeld: 'All {total} of your plan’s gilts are held.',
  over: '{over} {isAre} held above the plan’s units.',
  someHeld: '{held} of your plan’s {total} gilts are held.',
  under: '{under} {isAre} held below the plan’s units.',
  underNone: '{under} {isAre} held below the plan’s units, and {none} {noneIsAre} not held.',
  none: '{none} {isAre} not held.',
  giltColumns: { gilt: 'Gilt', years: 'Pays for', plan: 'Plan’s units', held: 'You hold', difference: 'Difference' },
  same: '—',
  diffOver: '+{units}',
  diffUnder: '−{units}',
  diffNone: 'not held',
  moreYear: '(about {money} more that year)',
  moreYears: '(about {money} more over those years)',
  lessYear: '(about {money} less that year)',
  lessYears: '(about {money} less over those years)',
  belowOver: 'Units above the plan’s pay out with their gilt, in the years shown.',
  belowUnder: 'Where you hold fewer units than the plan has, those years pay less than the plan says.',
  paid: 'Matured and paid out: {list}.',
  stale: 'Still on What you hold but matured: {list}. You can remove the line there.',

  // the cash years
  cashTitle: 'Your cash years',
  need: 'Your plan pays {years} from cash: {need} still to come.',
  cashColumns: { year: 'Tax year', amount: 'From the plan’s cash' },
  year: '{year}',
  yearPart: '{year} ({months} month{s} to come)',
  zero: '£0: {why}',
  whyLump: 'a lump sum the plan counts pays it',
  whyLumpEarlier: 'a lump sum the plan counts, carried from an earlier year, pays it',
  whySp: 'your State Pension pays it',
  whySpOther: 'your State Pension and other income the plan counts pay it',
  whyOther: 'other income the plan counts pays it',
  whyElse: 'other money the plan counts pays it',
  stateCash: 'Your pension holds {cash} in cash: {more} more than these years need.',
  holdsCash: 'Your pension holds {cash} in cash.',
  holds: 'Beside the plan’s gilts, your pension holds {parts}, at today’s value: {available} in all.',
  partCash: '{cash} in cash',
  partGilts: '{gilts} in other gilts',
  partFunds: '{funds} in shares and funds',
  stateCashGilts: 'The cash and gilts are {more} more than these years need.',
  stateAll: 'Together that is {more} more than these years need. Part of it is in shares and funds.',
  stateLess: 'That is {less} less than these years need.',
  timing: 'The plan pays {R} from cash by {dueBy}; your pension’s cash is {cash}.',
  next: 'The next of your gilts to mature is {label}, on {date}.',
  setYears: 'You set {label} against {years}.',
  noCashYears: 'No cash years are left: your plan’s gilts pay every year from here. Your pension’s cash is {cash}.',

  // what else the pension holds
  alsoTitle: 'Also in your pension',
  alsoColumns: { what: 'What', value: 'Value today', matures: 'Matures', pays: 'Pays then' },
  notListedCell: 'not on our list',
  unknownCell: 'not known',
  maturedCell: 'matured {month}',
  paysFixed: '{amount}, fixed',
  paysIndexLinked: 'rises with prices',
  notListed: '{label} is not on our list of gilts still to pay, so it may have matured already. If it has, its money is in your cash or was paid out, and you can remove the line on What you hold.',
  unknown: '{label}: we cannot tell when it matures from its name. Its code or SEDOL on What you hold would tell us.',
  paidNote: '{label} matured in {month}. Once paid, its money is your pension’s cash, and the line can come off What you hold.',
  cashNow: '{label} matured in {month}, after your record was taken, so the {pays} it paid counts as your pension’s cash.',
  riskGilts: 'A gilt held until it matures pays a fixed amount on a known day. Sold before then, it sells at that day’s price, which can be lower. A fixed amount does not rise with prices.',
  riskFunds: 'Shares and funds can fall in value. One company’s shares can fall further than a fund.',

  // outside the pension
  outsideTitle: 'Outside your pension',
  outsideOne: '{label} ({wrapper}, {value}): outside your pension, so not part of the plan’s mix.',

  // money expected later
  expectedTitle: 'Money you expect',
  expected: '{label}: {amount}, expected by {by}. It is not counted, because it may not arrive.',
  expectedNoBy: '{label}: {amount}. It is not counted, because it may not arrive.',
  expectedNoLabel: 'Money you expect',
  lumpCounted: 'Your plan already counts a lump sum of {amount} in {year}. If the money you expect is that money, it is not extra.',

  footer: 'An illustration from your figures, not advice. Nothing here places an order.',

  // What you hold, in the held phase (the table is on Your plan's mix only)
  holdCash: 'Your cash years need {need}. Beside the plan’s gilts your pension holds {available} at today’s value.',
  holdCounts: 'Everything here counts as yours, as it is.',
  holdLinkMix: 'Your plan’s mix',
  // the one optional field on a pension line that is neither one of the plan's gilts nor cash
  forYearsLabel: 'For which tax years? (optional)',
  forYearsPlaceholder: 'like 2028/29',
  forYearsHelp: 'Only you can say. We never work it out from when it matures.',
  forYears: 'For {years} (your choice)',

  // the plan's home, only when the money held is less than the cash years need
  homeLess: 'Your plan’s cash years need {less} more than your pension holds at today’s value: see Your plan’s mix.'
};
