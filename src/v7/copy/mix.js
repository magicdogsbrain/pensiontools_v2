/**
 * The words of "The mix" (research/v7/way-and-mix.md 3; road-to-7.md step 8b). Data only — this file imports nothing.
 * Placeholders are written {likeThis} and filled by the screen. The figures are never here: they are the one test's own,
 * read through the planner's OneAnswer.js. The planner says "allocation", "equities", "sub-asset", "sleeve"; the preview
 * says the mix, shares, and "gold and trend funds held flat and sold first" (src/v7/copy/banned.js is the law).
 */
export const MIX = {
  title: 'The mix',
  lead: 'How your pension is held: the split between shares, bonds, gold and trend funds, and cash that every run of the one test starts from. Change it here and save; nothing is kept until you do.',
  savedValue: '({value})',
  source: { saved: 'From your plan, saved {date}', savedUndated: 'As saved in the plan', locked: 'Fixed when you locked the plan on {date}.' },
  /** The seven bought ways (3.1): one paragraph, with the link to the way step. */
  bought: {
    body: '{name} buys your income; the mix does not apply. To change the way the money is taken, open ‘How the money is taken’.',
    link: 'How the money is taken'
  },
  sections: {
    held: 'How it is held',
    sleeve: 'Gold and trend funds, held flat',
    funds: 'The funds to test',
    tent: 'The bond tent',
    compare: 'Which mix lasts best?'
  },
  notes: {
    held: 'A risk level is a split the planner names; your own split is any four figures that add to 100; the funds to test are a list of real funds, each one counted as shares, bonds, gold and trend, or cash.',
    pot: 'On this plan’s pension of {pot}. The pots step changes the total; this step changes how it is split.',
    sleeve: 'A slice of gold and trend funds, held flat and sold first in a downturn. It tends to hold up when shares fall; it is protection against the worst years, not a free lunch — try it and compare.',
    funds: 'The list the plan is tested on when “the funds to test” is chosen. Each line is counted as shares, bonds, gold and trend, or cash; lines held in an ISA fill the ISA instead of the pension. It is a list to test, not a record of what you hold. Each way of drawing keeps its own list; switching the way puts it away and switching back brings it back.',
    tent: 'Shares start lower and rise to your mix over the first {years} years. It usually helps the worst cases and slightly lowers typical growth.',
    tentFunds: 'With a funds list the list is the start: the tent raises shares over time to the level chosen here.',
    tentBuckets: 'Buckets in order ignores the tent: it holds its three buckets as they are and refills them in order.',
    compare: 'Each cell is the one test — every real stretch of markets since 1871 and 1,000 possible futures, your own cuts setting, your full length — with the pension split that way: your own mix with the tent off and on, then the three levels. More shares usually lasts in a few more futures but gives a rougher ride; the tent mainly lifts the bad case (the worst 1 in 10). The level you are comfortable with is yours to choose; nothing here is changed for you.'
  },
  fields: {
    held:    { label: 'Hold the pension', options: { level: 'At a risk level', split: 'As your own split', funds: 'As the funds to test' } },
    level:   { label: 'The level', options: { cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' } },
    shares:       { label: 'Shares, %' },
    bonds:        { label: 'Bonds, %' },
    diversifiers: { label: 'Gold and trend funds, %' },
    cash:         { label: 'Cash, %', help: 'The four add up to 100.' },
    sleeve:  { label: 'Keep a slice in gold and trend funds', options: { yes: 'Yes', no: 'No' } },
    tent:    { label: 'Use the bond tent', options: { yes: 'Yes', no: 'No' } },
    endgame: { label: 'Rise to this level', options: { cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' } }
  },
  /** Beside each level: the £ each gives on this pot (3.2a). */
  levelAmounts: '{shares} shares, {bonds} bonds, {cash} cash',
  levelAmountsSleeve: '{shares} shares, {bonds} bonds, {diversifiers} gold and trend, {cash} cash',
  splitAmounts: 'On this pot: {shares} shares, {bonds} bonds, {diversifiers} gold and trend, {cash} cash.',
  errors: {
    held:  { notAnOption: 'One of the three, please.' },
    level: { required: 'Choose a level.', notAnOption: 'One of the three, please.' },
    shares:       { required: 'A whole percent, like 50.', notANumber: 'A whole percent, please, like 50.', tooLow: 'A percent of 0 or more.', tooHigh: 'Up to 100.' },
    bonds:        { required: 'A whole percent, like 40.', notANumber: 'A whole percent, please, like 40.', tooLow: 'A percent of 0 or more.', tooHigh: 'Up to 100.' },
    diversifiers: { required: 'A whole percent, like 0.', notANumber: 'A whole percent, please, like 10.', tooLow: 'A percent of 0 or more.', tooHigh: 'Up to 100.' },
    cash:         { required: 'A whole percent, like 10.', notANumber: 'A whole percent, please, like 10.', tooLow: 'A percent of 0 or more.', tooHigh: 'Up to 100.', notHundred: 'The four add up to 100: change one of them.' },
    sleeve:  { notAnOption: 'Yes or no.' },
    tent:    { notAnOption: 'Yes or no.' },
    endgame: { notAnOption: 'One of the three, please.' }
  },
  /** The funds to test (3.2c): the cards, the search, the paste, the example list. */
  funds: {
    one: 'Fund {n}',
    none: 'No funds on the list yet. Search for one, add a line, or paste a list from your platform.',
    noFunds: 'Choose “As the funds to test” only with at least one fund on the list.',
    fields: {
      ticker:   { label: 'Ticker' },
      name:     { label: 'Name (optional)' },
      value:    { label: 'Value, in pounds' },
      wrapper:  { label: 'Held in', options: { SIPP: 'The pension', ISA: 'An ISA', GIA: 'An ordinary account' } },
      category: { label: 'Counted as' }
    },
    errors: {
      ticker:   { required: 'A ticker, or say what it is under “Counted as”.', notATicker: 'Letters and figures only, up to 12.' },
      name:     {},
      value:    { required: 'Type the value, for example 50,000.', notANumber: 'Figures only, like 50,000.', tooLow: 'At least £1.', tooHigh: 'An amount up to £50,000,000, please.' },
      wrapper:  { notAnOption: 'One of the three, please.' },
      category: { notACategory: 'One of the choices, please.', whatIsThis: 'This fund is not in our list: say what it is counted as.' }
    },
    categoryNone: 'Not set',
    buckets: { shares: 'Shares', bonds: 'Bonds', diversifiers: 'Gold and trend', cash: 'Cash' },
    recognised: 'In our list: counted as {category}.',
    notRecognised: 'Not in our list.',
    remove: 'Remove',
    add: 'Add a line',
    search: { label: 'Search a ticker or a name', help: 'Our own list of funds: nothing is looked up outside this page.', add: 'Add {ticker}', none: 'Nothing in our list matches. Add a line and say what it is counted as.' },
    summary: 'The list comes to {pot} in the pension ({shares} shares, {bonds} bonds, {diversifiers} gold and trend, {cash} cash) and {isa} in an ISA.',
    untagged: 'Not counted yet: {list}.',
    paste: {
      title: 'Paste a list from your platform',
      lead: 'Open the page on your platform that lists what you own, select the table, copy, and paste it here. Any layout works: the page looks for a name, units, a value and a ticker. Nothing you paste leaves this page.',
      label: 'The pasted table',
      wrapper: 'Treat these lines as held in',
      read: 'Read it',
      whatIsThis: 'What is this?',
      whats: { shares: 'Shares', bonds: 'Bonds', cash: 'Cash', diversifiers: 'Gold and trend', unknown: 'Don’t know' },
      readAs: 'Read as {name}.',
      answered: 'Counted as your answer.',
      unknown: 'Marked “don’t know”: on the list, counted in the total, not in the mix until you say what it is.',
      unrecognised: 'Not recognised: say what it is.',
      leftOutTitle: 'Left out, and why',
      leftOut: 'Line {line} “{text}”: {why}.',
      whys: { total: 'a total line, not a fund', cashHeading: 'a cash heading with no value', noName: 'no name or ticker on the line', noValue: 'no value on the line', other: 'the page could not read it' },
      summary: '{read} line{s} read, {total} in all.',
      summaryRecognised: '{recognised} recognised ({recognisedTotal}).',
      summaryUnrecognised: '{unrecognised} not recognised ({unrecognisedTotal}): say what each is under “What is this?” and they count.',
      summaryUnknown: '{unknown} marked “don’t know” ({unknownTotal}): on the list, in the total, not in the mix until you say what they are.',
      add: 'Add these lines to the list',
      cancel: 'Clear the paste'
    },
    example: {
      button: 'Show an example list for this level (not advice)',
      hide: 'Hide the example list',
      title: 'An example list for {level} (not advice)',
      lead: 'An example of the kind of funds that match this level — not advice. Any similar fund doing the same job works; compare ongoing charges. It fills nothing in: add the funds you choose yourself.',
      columns: { fund: 'Example fund', job: 'Job in the mix', pct: '%' }
    }
  },
  /** "What it does in a bad case" (3.2b, 3.2d): one extra run of the one test, the slice or the tent the other way. */
  tries: {
    title: 'What it does in a bad case',
    sleeve: { button: 'Try the slice the other way', lead: 'One run of the one test with the slice of gold and trend funds the other way.' },
    tent: { button: 'Try the tent the other way', lead: 'One run of the one test with the bond tent the other way.' },
    working: 'Trying it…',
    failed: 'Sorry, that could not be tried. Nothing has changed.',
    noWorker: 'This browser cannot run the test in the background, so this cannot be tried here.',
    close: 'Put it away',
    lines: {
      'sleeve.withTried': 'With the slice of gold and trend funds, in a bad case (the worst 1 in 10) {withBad} is left at the end; without, {withoutBad}. With it the plan lasts {triedWords}; without, {ownWords}.',
      'sleeve.withOwn': 'With the slice of gold and trend funds, in a bad case (the worst 1 in 10) {withBad} is left at the end; without, {withoutBad}. With it the plan lasts {ownWords}; without, {triedWords}.',
      'tent.withTried': 'With the tent, in a bad case (the worst 1 in 10) {withBad} is left at the end; without, {withoutBad}. With it the plan lasts {triedWords}; without, {ownWords}.',
      'tent.withOwn': 'With the tent, in a bad case (the worst 1 in 10) {withBad} is left at the end; without, {withoutBad}. With it the plan lasts {ownWords}; without, {triedWords}.',
      'sleeve.alone': 'With the slice of gold and trend funds {on}, in a bad case (the worst 1 in 10) {bad} is left at the end; the plan lasts {words}.',
      'tent.alone': 'With the tent {on}, in a bad case (the worst 1 in 10) {bad} is left at the end; the plan lasts {words}.',
      unaffordable: 'This way of drawing cannot be bought with the plan’s pots, so there is no figure.',
      document: 'The plan as locked on {date} is the figure beside it; nothing here changes the locked plan.'
    },
    ran: { one: 'Tried in 1 run.', two: 'Tried in 2 runs: the plan as saved, and the other way.', timed: 'Tried in {runs} run{s} ({ms} s).' }
  },
  /** "Which mix lasts best?" (3.2e): the grid, the best cell, "Use this mix" and its confirm. */
  compare: {
    button: 'Which mix lasts best?',
    again: 'Run it again',
    working: 'Running the one test on eight splits…',
    progress: 'How far the working has got',
    failed: 'Sorry, the eight splits could not be run. Nothing has changed.',
    noWorker: 'This browser cannot run the test in the background, so the splits cannot be compared here.',
    ran: 'Tried in 8 runs ({ms} s).',
    ranUntimed: 'Tried in 8 runs.',
    columns: { mix: 'Mix', flat: 'Tent off', tent: 'Tent on' },
    rows: { own: 'Your mix', cautious: 'Cautious', balanced: 'Balanced', adventurous: 'Adventurous' },
    cell: '{words} futures out of 10',
    cellSub: '{pct}% · typically {typical} left · bad case {bad}',
    cellAmounts: '{shares} shares, {bonds} bonds, {cash} cash',
    cannot: 'cannot be bought',
    best: '{row}, tent {tent}, lasts best: {words} ({pct}%).',
    thisIs: 'This is your mix as saved.',
    use: 'Use this mix',
    confirm: {
      title: 'Use this mix?',
      body: 'Your plan’s mix becomes {row}, tent {tent}: {shares} shares, {bonds} bonds, {cash} cash.',
      funds: 'The funds to test are put away for this way of drawing.',
      undo: 'You can undo this straight away.',
      yes: 'Use it',
      notNow: 'Not now'
    },
    boughtRefused: 'Your plan’s way of drawing buys its income, so there is no split to compare.'
  },
  tentOnOff: { on: 'on', off: 'off' },
  derivedTitle: 'What this works out to',
  derived: {
    'held.level': 'Held at the {level} level, on a pension of {pot}.',
    'held.split': 'Held as your own split, on a pension of {pot}.',
    'held.funds': 'Held as the funds to test: {pot} in the pension and {isa} in an ISA.',
    amounts: '{shares} in shares, {bonds} in bonds, {cash} in cash{div}.',
    'sleeve.on': 'A slice of {amount} in gold and trend funds, held flat and sold first in a downturn.',
    'sleeve.off': 'No slice of gold and trend funds.',
    'tent.on': 'The bond tent is on: shares start lower and rise to this mix over the first {years} years.',
    'tent.off': 'The bond tent is off: the mix is held flat.',
    'tent.buckets': 'The bond tent is not used by Buckets in order.'
  },
  locked: {
    lead: 'This plan is locked, so its mix is fixed. The tries and the comparison still run; nothing here changes the plan.',
    document: 'The plan as locked on {date} lasts {words}; in a bad case (the worst 1 in 10) {bad} is left at the end.'
  },
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  notRun: 'This plan is shown as it was saved, so nothing is run here. Nothing has been lost.',
  buttons: { save: 'Save the mix', cancel: 'Cancel', undo: 'Undo', close: 'Close', back: 'Back to your plan', tryAgain: 'Try again' },
  saving: 'Saving…',
  toast: {
    mix: 'Saved. The pension is held as {held}: {shares} shares, {bonds} bonds, {cash} cash. “Does it last?” runs again on the saved plan.',
    use: 'Saved. The plan’s mix is now {row}, tent {tent}. “Does it last?” runs again on the saved plan.',
    savedShort: 'Saved.', undone: 'Put back as it was.', unchanged: 'Nothing has changed.'
  },
  heldWords: { level: 'a risk level', split: 'your own split', funds: 'the funds to test' },
  problems: {
    locked: 'This plan is locked, so nothing was changed. Unlock it from ‘Your plan as locked’ to change its mix.',
    notHere: 'That plan is not in this account. Nothing was changed.',
    usedUp: 'Your free time without an account is used up. Sign in to keep and change this plan.',
    nobody: 'Sign in to change this plan. Nothing was changed.',
    storage: 'This browser would not keep the change. Nothing was changed.',
    failed: 'Sorry, the change could not be saved. Nothing was changed.',
    problems: 'Have a look at the boxes marked above.',
    noRun: 'The comparison is not held for this plan as saved: run it again, then choose a cell.',
    readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.'
  }
};
