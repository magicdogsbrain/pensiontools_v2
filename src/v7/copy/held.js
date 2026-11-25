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
  changeLink: 'Change what you hold',

  // the plan's gilts
  giltsTitle: 'The gilts your plan pays from',
  allSame: 'All {total} of your plan’s gilts are held, in the plan’s units.',
  allHeld: 'All {total} of your plan’s gilts are held.',
  over: '{over} {isAre} held above the plan’s units.',
  someHeld: '{held} of {total} of your plan’s gilts are held.',
  // (ruling Z3) a gilt held in part is held: the count says how many in full and how many below the plan's units
  someHeldParts: '{held} of {total} of your plan’s gilts are held: {parts}.',
  partFull: '{n} in full',
  partUnder: '{n} below the plan’s units',
  partOver: '{n} above the plan’s units',
  parts2: '{a}, {b}',
  parts3: '{a}, {b}, {c}',
  noneHeld: '{none} {isAre} not held.',
  under: '{under} {isAre} held below the plan’s units.',
  underNone: '{under} {isAre} held below the plan’s units, and {none} {noneIsAre} not held.',
  none: '{none} {isAre} not held.',
  giltColumns: { gilt: 'Gilt', years: 'Pays for', plan: 'Plan’s units', held: 'You hold', difference: 'Difference' },
  same: '—',
  diffOver: '+{units}',
  diffUnder: '−{units}',
  diffNone: 'not held',
  moreYear: '({money} more that year)',
  moreYears: '({money} more over those years)',
  lessYear: '({money} less that year)',
  lessYears: '({money} less over those years)',
  belowOver: 'Units above the plan’s pay out with their gilt, in the years shown.',
  belowUnder: 'Where you hold fewer units than the plan has, those years pay less than the plan says.',
  // once what is held was accepted as the plan (step F6): a gilt held in part, or not held, is how the person chose to hold it
  chosenYear: '(that year is paid from what else you hold, as you chose)',
  chosenYears: '(those years are paid from what else you hold, as you chose)',
  belowChosen: 'Where you hold fewer of the plan’s units, those years are paid from what else you hold, as you chose: what that pays then moves with its value, not a fixed gilt payment.',
  paid: 'Matured and paid out: {list}.',
  stale: 'Still on What you hold but matured: {list}. You can remove the line there.',

  // the page in one line, first (7.12.0 round 3)
  summary: 'In one line: {gilts}, and {cash}.',
  summaryGilts: 'In one line: {gilts}.',
  sumAll: 'all {total} of your plan’s gilts are held',
  sumSome: '{held} of {total} of your plan’s gilts are held',
  sumCash: 'your pension’s cash pays your cash years',
  sumArrives: 'what you hold pays your cash years, if you keep your gilts until they pay',
  sumAllMoney: 'what you hold pays your cash years, part of it from shares and funds at today’s value',
  sumLess: 'what you hold is {less} less than your cash years need',
  summaryGap: 'One difference in timing: {due} is due {when}, before {label} pays on {date}.',

  // the cash years: one dated table of when money is due and when it arrives (7.12.0 round 3)
  cashTitle: 'Your cash years',
  need: 'Your plan pays {years} from cash: {need} still to come.',
  cashColumns: { when: 'When', due: 'Due from the plan’s cash', arrives: 'Arrives in your pension' },
  now: 'Now',
  whenRun: '{from} to {to}',
  whenOne: '{month}',
  year: '{year}',
  yearPart: '{year} ({months} month{s} to come)',
  dueMonths: '{due} ({n} × {per})',
  none: '—',
  total: 'In all',
  arriveCash: '{cash} in cash',
  arrive: '{amount}: {label}',
  arriveOn: '{amount} on {date}: {label}',
  linkedAmount: '{value} at today’s value (it rises with prices)',
  setOn: '(you set it against {years})',
  setEnds: '(you set it against {years}, which ends before it pays)',
  zero: '£0: {why}',
  whyLump: 'a lump sum the plan counts pays it',
  whyLumpEarlier: 'a lump sum the plan counts, carried from an earlier year, pays it',
  whySp: 'your State Pension pays it',
  whySpOther: 'your State Pension and other income the plan counts pay it',
  whyOther: 'other income the plan counts pays it',
  whyElse: 'other money the plan counts pays it',
  stateCash: 'Your pension holds {cash} in cash: {more} more than these years need.',
  stateArrives: 'Held until the day they pay, the cash and these gilts come to {arrives}: {more} more than these years need.',
  stateAll: 'What arrives by then is {arrives}. With what else you hold, at today’s value, that is {more} more than these years need. Part of it is in shares and funds.',
  stateAllCash: 'Your pension holds {cash} in cash. With what else you hold, at today’s value, that is {more} more than these years need. Part of it is in shares and funds.',
  stateLess: 'What you hold, at today’s value, is {less} less than these years need.',
  // (ruling Z5a) someone living on a ladder is never told to sell: the line says only what is not yet paid for
  timing: 'One difference from the plan is the timing: {due} is due {when}, before {label} pays on {date}, and your pension holds {cash} in cash. Those months are not yet paid for by cash or by a gilt that pays in them.',
  timingNoNext: 'One difference from the plan is the timing: {due} is due {when}, and no gilt you hold pays before then. Those months are not yet paid for by cash or by a gilt that pays in them.',
  fixedRisk: 'Held until they mature, these gilts pay fixed sums on known days, as the plan’s cash would. A fixed sum does not rise with prices; the plan’s cash would not have either.',
  setYears: 'You set {label} against {years}.',
  noCashYears: 'No cash years are left: your plan’s gilts pay every year from here. Your pension’s cash is {cash}.',

  // what else the pension holds
  alsoTitle: 'Also in your pension',
  alsoTitleIsa: 'Also in your pension and ISA',
  alsoColumns: { what: 'What', value: 'Value today', matures: 'Matures', pays: 'Pays by then, with interest' },
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
  forYearsPlaceholder: 'e.g. 2028/29',
  forYearsHelp: 'Only you can say. We never work it out from when it matures.',
  forYears: 'For {years} (your choice)',

  // the plan's home, only when the money held is less than the cash years need
  homeLess: 'Your plan’s cash years need {less} more than your pension holds at today’s value: see Your plan’s mix.'
};
