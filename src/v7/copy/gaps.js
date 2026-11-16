/**
 * The words of "Keep this" and "What is covered, year by year" (7.6.0): a line the person keeps instead of the plan's rung, a
 * line kept by choice, money expected later, and what that means year by year (answers/plan/gaps.js gapSentences fills them;
 * the classic planner says the same sentences). Data only — this file imports nothing. Placeholders are written {likeThis}.
 * Consequences, never advice (src/v7/copy/banned.js is the law): what lasts until when, never what to do about it.
 */
export const GAPS = {
  title: 'What is covered, year by year',
  lead: 'Your plan stays as locked. This reads it with what you chose to keep instead.',
  // 7.11.1: read with what you actually hold — no "Keep this" needed for a line to count
  leadHeld: 'Your plan stays as locked. This reads it with what you hold.',
  // a plan drawn from a pot (no years bought ahead): what is kept and expected, with no years to read
  titlePot: 'What you keep, and money you expect',
  leadPot: 'Your plan stays as locked. This says what you chose to keep beside it.',
  // the plan stays the same strategy; a clause with nothing in it is left out
  strategyBoth: 'Your ladder, with {n} {years} held another way and {k} {holdings} you keep by choice.',
  strategyYears: 'Your ladder, with {n} {years} held another way.',
  strategyKept: 'Your ladder, with {k} {holdings} you keep by choice.',
  strategyNone: 'Your ladder, as locked.',
  yearOne: 'year', yearMany: 'years', holdingOne: 'investment', holdingMany: 'investments',
  fixed: '{label} pays a fixed {pays}; it does not rise with prices.',
  fixedReal: '{label} pays a fixed {pays}; it does not rise with prices, so when it is paid it is worth {real} at today’s prices.',
  spare: '{label} pays {spare} more than the years it stands in for need; that is counted as the pension’s cash for the years after.',
  noGap: 'Every year to {year} is covered by what you hold.',
  noGapToBuy: 'Every year to {year} is covered once the plan’s buys are made: {toBuy} is still to buy.',
  withoutExpected: 'Without the money you expect, ',
  lastsUntil: '{year}’s money lasts until about {month}.',
  shortFrom: '{year}’s money is not covered from {month}.',
  totalGap: 'Not yet covered to {year}: {gap} in all.',
  withExpected: 'With it, every year to {year} is covered.',
  withExpectedShort: 'With it, {short} is still not covered to {year}.',
  late: '{label} is expected by {by}, after the money runs short in {month}.',
  expectedNoLabel: 'The money you expect',
  fundsGaps: 'Counted toward the gaps: {list}, {total} at today’s value.',
  fundsPlan: 'Counted toward the plan’s money: {list}, {total} at today’s value.',
  withAll: 'With the money you expect and what you count toward the gaps, every year to {year} is covered.',
  withAllShort: 'With the money you expect and what you count toward the gaps, {short} is still not covered to {year}.',
  withKept: 'With what you count toward the gaps, every year to {year} is covered.',
  withKeptShort: 'With what you count toward the gaps, {short} is still not covered to {year}.',
  canFall: 'What you keep by choice can fall in value; if it is worth less when you sell, the gap is bigger.',
  // 7.11.1: a gilt outside the plan's rungs that has matured: its money is the pension's cash
  giltCashNow: '{label} matured in {month}, after your record was taken, so the {pays} it paid is counted as your pension’s cash.',
  giltPaid: '{label} matured in {month}; once paid, its money is the pension’s cash, so it is not counted again.',
  // 7.11.1: everything else in the pension beside the plan's rungs and cash — gilts, shares, funds — is money available: set
  // against no year (only you can say which years a line is for), never ignored
  availableBoth: 'Also in your pension, at today’s value: gilts {gilts}, shares and funds {funds}, not set against any year.',
  availableGilts: 'Also in your pension, at today’s value: gilts {gilts}, not set against any year.',
  availableFunds: 'Also in your pension, at today’s value: shares and funds {funds}, not set against any year.',
  withHeld: 'At today’s value, that would cover every year to {year}.',
  withHeldShort: 'At today’s value, that would cover {cover} of it, leaving {short} not covered to {year}.',
  withHeldExpected: 'With the money you expect, and that at today’s value, every year to {year} is covered.',
  withHeldExpectedShort: 'With the money you expect, and that at today’s value, {short} is still not covered to {year}.',
  outsideCanFall: 'Shares and funds can fall in value; if they are worth less when sold, they cover less.',
  outsideCanFallGilts: 'Shares and funds can fall in value, and so can a gilt sold before it matures; if they are worth less when sold, they cover less.',
  cashLeft: 'After {year}, {amount} of your pension’s cash is left.',
  // 7.11.1: a year the plan needs nothing from the pension for, and a lump sum the plan already counts
  noNeed: '{year} needs nothing from your pension: {why}.',
  whyLump: 'a lump sum the plan counts that year pays it',
  whyLumpEarlier: 'a lump sum the plan counts, carried from an earlier year, pays it',
  whySp: 'your State Pension pays it',
  whySpOther: 'your State Pension and other income the plan counts pay it',
  whyOther: 'other income the plan counts pays it',
  whyElse: 'other money the plan counts pays it',
  lumpExpected: 'The plan already counts a lump sum of {amount} in {year}; if the money you expect is that money, it is not extra.',
  canFallPot: 'What you keep by choice can fall in value; if it falls, the plan has less to draw on.',
  columns: { year: 'Tax year', need: 'The plan needs', held: 'Held for it', gap: 'Not yet covered' },
  // the needs and what is held are at today’s prices
  money: 'At today’s prices.',
  thisYear: '{year} ({months} month{s} to come)',
  heldParts: { rungs: 'gilts', cash: 'cash', toBuy: '{amount} still to buy' },
  none: '—',
  // "Keep this" on a line of What you hold
  keep: {
    button: 'Keep this',
    change: 'Change what this is kept as',
    stop: 'Stop keeping it',
    asked: 'What is this kept as?',
    rung: 'It stands in for the plan’s money for some years',
    mine: 'I am keeping it by choice',
    years: 'The tax years it stands in for',
    yearsTyped: 'Tax years it stands in for (like 2027/28, 2028/29)',
    fundsGaps: 'Count it toward the gaps',
    fundsPlan: 'Count it toward the plan’s money',
    save: 'Keep it',
    cancel: 'Cancel',
    standsIn: 'Kept: stands in for {years}.',
    byChoice: 'Kept by choice.',
    byChoiceGaps: 'Kept by choice, counted toward the gaps.',
    byChoicePlan: 'Kept by choice, counted toward the plan’s money.',
    noYears: 'Choose at least one tax year.'
  },
  // money expected later
  expected: {
    title: 'Money you expect later',
    lead: 'A pension elsewhere you expect to move in, say. It may not arrive, so it is never counted as held.',
    none: 'Nothing expected.',
    item: '{label}: {amount}, expected by {by}.',
    itemNoBy: '{label}: {amount}.',
    remove: 'Remove',
    add: 'Add money you expect',
    fields: { label: 'What it is', amount: 'Amount, in pounds', by: 'Expected by (month)' },
    unnamed: 'Money expected'
  },
  // the move page
  move: {
    standIn: 'Held another way',
    standInOne: '{label} stands in for {years}: pays {pays}.',
    kept: 'Kept by you',
    keptOne: '{label} ({wrapper}, {value}){gaps}',
    keptGaps: ', counted toward the gaps',
    keptPlan: ', counted toward the plan’s money',
    covered: '{label} for {years}: held another way.'
  },
  home: '{year}: {gap} not yet covered — see What you hold.'
};
