/**
 * The words of "Moving to your plan's mix" (research/v7/holdings-and-move.md §3; road-to-7.md step 10). Data only — this
 * file imports nothing. Placeholders are written {likeThis} and filled by the screen. The figures are never here: they are
 * the planner's own (TransitionPlanner, GiltLadderPlan.orderSheetRows, RotationStatus) read through answers/plan/move.js;
 * the one run is the one test's through OneAnswer. Never "transition", "wrapper", "run-up", "nominal" or "approx"
 * (src/v7/copy/banned.js is the law); the last line is always "Illustration, not advice. Nothing here places an order."
 */
export const MOVE = {
  title: 'Moving to your plan’s mix',
  lead: 'From what you hold to your plan as locked. Optional: your plan was tested on its own mix, and what you hold may differ.',
  notLocked: 'Set when the plan is locked. The move is worked out against the plan document, which the lock makes.',
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  notRun: 'The plan could not be read against its document.',
  unread: 'We could not tell what your pension holds from what you recorded, so it is not read against the plan’s mix. You can say what each line holds on What you hold.',
  target: { ladder: 'A gilt ladder: every gilt and the cash years, in units.', buckets: 'The target: a mix in pounds — any world share fund, gilt fund or money-market fund fills its part.' },
  // which money pays for the ladder (7.12.0): one rule with the engine — the ISA counts unless it is held aside
  isa: {
    in: 'Your plan pays for the ladder from your pension and your ISA together. Which account each gilt sits in is yours to choose.',
    hold: 'Your plan pays for the ladder from your pension. Your ISA is held aside.',
    none: 'Your plan pays for the ladder from your pension.'
  },
  status: {
    done: 'Done — what you hold matches the plan’s mix.',
    doneLadder: 'Done — every rung the plan still needs is held.',
    doneKept: 'Done — every rung is held, or covered by what you chose to keep.',
    held: '{held}% of the plan’s mix held; {done} of {moves} moves done.',
    // totals only (7.12.0, the moving brief S4): nothing listed under What you hold, and nothing needs to be
    unlisted: 'You have not listed what your pension holds, and you do not need to. Your plan has {pension} in your pension ({from}).',
    unlistedIsa: 'You have not listed what your pension holds, and you do not need to. Your plan has {pension} in your pension and {isa} in your ISA ({from}).',
    gilts: '{bought} of {rungs} gilts bought. {held}% of your plan’s mix is held.',
    giltsPart: '{bought} of {rungs} gilts bought, and {part} part bought. {held}% of your plan’s mix is held.',
    // (never "about £" on this page, and never "before you stop work": the page is also read by people who have stopped)
    pace: 'Work stops in {when}, in {months} months. To finish the buying by then is {perMonth} a month, to the nearest £100.',
    paceOne: 'Work stops in {when}, next month. To finish the buying by then is {perMonth}, to the nearest £100.',
    timing: 'You can buy the gilts at any time before you stop. The prices here are from the day you locked; buying earlier fixes the price you pay.'
  },
  /** Paying for it (7.12.0, a ladder): one reading of what pays for the buys (answers/plan/moveWords.js payingOf), in order. */
  paying: {
    title: 'Paying for it',
    need: 'The buys come to {need}.',
    youHold: 'You hold {available} that your plan does not use.',
    enough: '{toRaise} of it pays for the buys; you choose which to sell.',
    leftOver: 'The other {leftOver} is not needed for the ladder.',
    heldShares: 'Your plan counts it as money left over, and was tested with it in a world share fund.',
    heldValue: 'Your plan counts it as money left over, and was tested with it keeping its value.',
    leave: 'You can leave it as it is.',
    enoughAll: 'All of it pays for the buys; you choose which to sell first.',
    short: 'That is {short} less than the buys cost.',
    newMoney: 'New money paid in before then, {newMoney}, is counted first.',
    shortRest: 'The rest waits until the money is there.',
    cash: 'Your pension’s spare cash covers them.',
    unlisted: 'You have not listed what your pension holds, and you do not need to.',
    planHas: 'Your plan has {pension} in your pension ({from}).',
    planHasIsa: 'Your plan has {pension} in your pension and {isa} in your ISA ({from}).',
    planEnough: '{toRaise} of it pays for the buys; you choose which to sell. The other {leftOver} is not needed for the ladder.',
    planShort: 'That is {short} less than the buys cost.',
    from: { plan: 'from your plan', checkIn: 'from your check-in', record: 'from your last record' }
  },
  /** What is held that the plan does not use (7.12.0, a ladder): the lines outside it, and a gilt's units above its place. */
  outside: {
    title: 'What you hold that your plan does not use',
    columns: { what: 'What', value: 'Value today', note: 'Note' },
    notes: {
      gilt: 'Matures on {date} and pays {pays}.',
      giltReal: 'Matures on {date} and pays {pays} (worth {real} at today’s prices).',
      sellOr: 'You can sell it, or',
      sayYears: 'say which years it is for',
      cashYear: '{year} is a year your plan pays from cash.',
      giltUnknown: 'We cannot tell when it matures from its name. Its code or SEDOL on What you hold would tell us.',
      overRung: '{excess} units more than its place in the ladder needs ({amount} at the prices when you locked).'
    }
  },
  waiting: {
    line: 'You stop work in about {years} years. Until your move window opens in {opens}, the move is just where new money goes.',
    lineSoon: 'You stop work in about {years} years. Until your move window opens, the move is just where new money goes.',
    newMoney: 'New money goes: {parts} — {monthly} a month in all.',
    newMoneyPart: '{amount} a month to {word}',
    newMoneyNone: 'No new money a month is on the record yet: add it line by line under What you hold.',
    planMix: 'The plan’s mix: shares {shares}%, bonds {bonds}%, cash {cash}%.',
    heldMix: 'What you hold, in your pension: shares {shares}%, bonds {bonds}%, gold and trend {diversifiers}%, cash {cash}%.',
    starts: 'The move itself starts around {when}.'
  },
  cost: {
    title: 'What skipping it costs',
    titleLadder: 'What is not bought yet',
    ladder: '{n} tax year{s} ({years}) {have} no gilt bought yet.',
    ladderNone: 'Every tax year the ladder funds has its gilt bought.',
    part: '{label}, for {years}: {held} of {units} units held.',
    lead: 'One run of the one test on a copy of the plan with the mix as you hold it in your pension — the way of drawing and everything else unchanged. Nothing is written.',
    button: 'What if I keep what I hold?',
    again: 'Run it again',
    working: 'Running the plan on the mix you hold…',
    failed: 'Sorry, that could not be run. Nothing has changed.',
    noWorker: 'This browser cannot run the test in the background, so this cannot be run here.',
    result: 'Tested on the mix you hold today (shares {shares}%, bonds {bonds}%, gold and trend {diversifiers}%, cash {cash}%), the plan lasts {words}; on its own mix, {ownWords}.',
    left: 'On the mix you hold, in a bad case (the worst 1 in 10) {bad} is left at the end; {typical} in a middling case.',
    unaffordable: 'On the mix you hold the plan could not be run as set{reason}.',
    reasonWas: ' ({reason})',
    ran: 'Tried in 1 run ({ms} s).',
    ranUntimed: 'Tried in 1 run.',
    nothing: 'Nothing recorded yet — record what you hold first.'
  },
  cash: {
    title: 'Cash to hold now',
    lead: 'A money-market fund or cash in the pension:',
    rows: {
      cashYear: 'Cash year {year}',
      cashYearLump: 'Cash year {year} ({lump} of it paid by a lump sum expected that year)',
      cashYearBeside: 'Cash year {year}, beside what you keep for it',
      cashYearCovered: 'Cash year {year}: paid by what you keep for it'
    },
    besideNeed: '{gap} after what {label} pays',
    columns: { what: 'What for', need: 'The year needs', amount: 'To hold now' },
    over: '‘To hold now’ is a little more than the year needs when cash is expected to fall behind prices before it is spent.',
    total: 'To hold',
    held: 'You hold',
    spare: 'Spare',
    short: 'Short',
    spending: 'Cash: {held} held against {target} for the cash years still ahead ({years}) — being spent as the plan intends, so it is not a move.',
    spendingNone: 'Cash: {held} held; no cash years left — your spending float, not a target.'
  },
  /**
   * What is held, as information (7.11.1): Living on it, or Moving once what is held was accepted, the page is never a move —
   * no list of things to buy or sell, no schedule. answers/plan/move.js heldInfo fills these on a pot plan; a ladder's page is
   * "Your plan's mix" (7.12.0, src/v7/copy/held.js).
   */
  held: {
    // (a walk of 7.11.1: never "nothing here is a list of things to buy or sell" — the plan's order sheet stays on the page)
    lead: 'What you hold, beside your plan as locked, and what each part of it is doing.',
    agreed: 'On {date} you said this is how you want to hold it.',
    takeBack: 'Take this back',
    notFull: '{n} of the {total} gilts your plan uses are not bought in full. Those years are paid from what you hold instead, and its value can fall.',
    notFullOne: '1 of the {total} gilts your plan uses is not bought in full. That year is paid from what you hold instead, and its value can fall.',
    noRecord: 'Nothing recorded yet. You can record what you hold on What you hold, and this page reads it against your plan.',
    mixTitle: 'What you hold, against your plan’s mix',
    bucket: {
      shares: 'Shares: {held}% of your pension now; your plan’s mix has {plan}%.',
      bonds: 'Bonds: {held}% of your pension now; your plan’s mix has {plan}%.',
      cash: 'Cash: {held}% of your pension now; your plan’s mix has {plan}%.',
      diversifiers: 'Gold and trend: {held}% of your pension now; your plan’s mix has {plan}%.'
    },
    unknown: 'We could not tell what {name} holds, so it is left out of these figures. You can say what it holds on What you hold.',
    review: 'You can test what you hold against your plan, and accept it as your plan, on',
    // ISA, taxable-account and bank lines: outside the pension, so outside the plan's mix
    outsideTitle: 'Outside your pension',
    outsideOne: '{label} ({wrapper}, {value}): outside your pension, so not part of the plan’s mix.',
    reviewLink: 'Your review'
  },
  lists: {
    buy: 'Buy',
    sell: 'Sell',
    held: 'Already held',
    keep: 'Left alone',
    columns: { done: 'Done', what: 'What', units: 'Units', amount: 'Amount', why: 'Why', held: 'Held', target: 'Target' },
    tick: 'Tick when the order is placed',
    ticked: 'Placed {date}',
    heldUnits: '{units} units',
    spare: '({spare} spare — kept, not a sale)',
    keepOne: '{label} ({wrapper}, {value}): {why}.',
    totals: 'Totals: buy {buy}, sell {sell}.',
    totalsLadder: 'Totals: buy {need}; paid from what your plan does not use, {toRaise}; left as it is, {leftOver}.',
    totalsShort: 'Totals: buy {need}; you hold {available} toward it; {short} waits for new money.',
    short: ' Short by {short} before new money.',
    paid: 'Already paid: {list} — matured rungs, no longer targets.',
    matured: 'Still on your record but matured: {list}.',
    sold: 'Sold by the rotation: {list} — no longer targets; the fund the proceeds bought is kept.',
    stale: 'Still on your record but sold: {list}.',
    fix: 'If a line under What you hold is not yours — a pasted statement can mis-read a code — remove it there and this page follows.'
  },
  why: {
    rung: 'the rung for {years}',
    moreThanRung: 'more than the rung needs',
    cashYears: 'the cash years',
    bringUp: 'bring {bucket} up to {pct}% of the pot',
    bringDown: 'bring {bucket} down to {pct}% of the pot',
    notInMix: 'not in the plan’s mix',
    isaKept: 'ISA — kept as it is',
    cashKept: 'cash in the bank — outside the pension, kept as it is',
    giaKept: 'other account — kept as it is',
    rotationKept: 'bought by the rotation — kept',
    matured: 'matured and paid in {years} — remove it from your record',
    soldByRotation: 'sold by the rotation — remove it from your record',
    other: '{text}'
  },
  buckets: { shares: 'shares', bonds: 'bonds', cash: 'cash', diversifiers: 'gold and trend' },
  wrappers: { SIPP: 'pension', ISA: 'ISA', GIA: 'other account', CASH: 'cash' },
  schedule: {
    title: 'When',
    lead: 'Cash first, then the near rungs before the far ones, then the mix; sales spread over {tranches} tranche{s} so no single month’s price decides it; new money is used before sales.',
    funded: 'Paid for by sales{newMoney}.',
    fundedNewMoney: ' and new money',
    leadLadder: 'Cash first, then the near gilts before the far ones. The buying is spread over {tranches} dates so no single month’s price decides it. New money is used before sales.',
    step: 'By {when}: {action} {label}{units}{amount}.',
    raise: 'By {when}: raise {amount} from what your plan does not use.',
    buy: 'buy',
    sell: 'sell',
    units: ', {units} units',
    amount: ' ({amount})',
    passed: 'Your plan is already paying: what is left is spread over the next {months} month{s}.'
  },
  how: {
    // a ladder's first item (7.12.0): which accounts pay for it, in the one sentence (MOVE.isa), then the rest of the item
    accountsLadder: 'Accounts. {isa} Other-account and bank lines are left alone; money moved between accounts is a payment in (a pension takes £10,000 a year once you have drawn flexibly; an ISA £20,000 a year), not a sale.',
    open: 'How to read this',
    close: 'Hide how to read this',
    items: [
      'Accounts. The ladder and the mix live in your pension. ISA and other-account lines are left alone; money the plan needs moved between accounts is a payment in (a pension takes £10,000 a year once you have drawn flexibly; an ISA £20,000 a year), not a sale.',
      'Tax on sales. Inside a pension or an ISA, none. In an ordinary account, gains above the £3,000 exemption are taxed — gilts are exempt.',
      'Gilt units. Order gilts by units (the face value), not by amount; the order sheet carries the codes. Prices and index ratios move daily: the pound figures here are a guide.',
      'Decision points. A planned sale (a house, a business) that pays for part of the ladder is a date on the schedule, not a certainty — buy the near rungs first and leave the far ones until the money is real.'
    ]
  },
  sheet: {
    title: 'The order sheet',
    lead: 'The rungs as your plan was locked on {date}: what to buy, its codes, when it matures, what it pays, the units to order. The prices are the day’s at lock; a live re-price is not here.',
    // living on the plan (7.11.1): the same sheet, read as what the plan holds
    leadHeld: 'The rungs as your plan was locked on {date}: each gilt, its codes, when it matures, what it pays and its units; Bought says which you hold.',
    gilt: 'Gilt',
    units: 'Units',
    order: 'How to give the order: say the number of units — 1 unit is £1 of face value; if the screen counts £100 lots, use the figure in brackets. Ordering by amount also works, but the units you get then depend on the price that day, so the income is only close to the figure shown.',
    columns: { n: '#', buy: 'Buy', code: 'Code', sedol: 'SEDOL', matures: 'Matures', pays: 'Pays', years: 'For tax years', units: 'Units to order', price: 'Price at lock', cost: 'Cost at lock', bought: 'Bought' },
    lots: '({lots} if the screen counts £100 lots)',
    surplus: '(the surplus held in cash)',
    bought: { bought: 'bought', part: 'part bought', 'not yet': 'not yet', paid: 'paid out', sold: 'sold by the rotation', covered: 'held another way' },
    gate: 'This sheet is sized on an assumed State Pension of {annual} a year from {atAge}. Enter your State Pension forecast — the figure and the date — under About you and when, and lock the plan again before buying.',
    gateHeld: 'The units and the cost are held back until then.',
    showAnyway: 'Show the sheet anyway',
    hideAnyway: 'Hide the units and the cost again',
    withheld: '—'
  },
  explained: {
    open: 'Gilt ladders explained',
    close: 'Hide gilt ladders explained',
    lines: [
      'You buy one gilt maturing in each year you want income. When it matures the government repays its face value — that year’s money.',
      'Index-linked gilts repay the face value uplifted by inflation, so a ladder of them pays the same amount at today’s prices every year; conventional gilts repay a fixed sum.',
      'What £1 in a later year costs today is set by the yield for that year: far years are cheap when real yields are high.',
      'A gilt ladder promises only the money it pays if every gilt is held to maturity: prices move daily, and selling early can lose money.'
    ],
    example: 'From this plan: its first rung is {name} ({code}) — {nominal} units cost {cost} at lock and pay {pays} in {years}, when the gilt matures on {matures}.',
    not: 'A gilt ladder is not the plan for everyone; the nine ways on “How the money is taken” are the honest comparison.'
  },
  watch: {
    title: 'The rotation watch',
    armed: 'Armed: if world shares close {trigger}% below their all-time high while you are {disarmAge} or younger, the rungs funding ages above {cutAge} are sold and buy the share fund. Nothing to do until then.',
    disarmed: 'Disarmed: past {disarmAge} the trigger no longer fires, so the rungs above {cutAge} are held to maturity whatever the market does. The ladder runs as bought.',
    fired: 'Fired{on}: the rungs above {cutAge} were sold and the proceeds bought the share fund. Income above {cutAge} now depends on that fund; the income sold is on record on the plan.',
    firedOn: ' on {date}',
    block: 'The block: {rungs} rungs funding ages {from} to {to}, worth {value} at the prices at lock, paying {income} of income across {years}. It earns its yield while you wait.',
    rule: 'The rule, agreed in advance: while the market is within {trigger}% of its all-time high, do nothing. On the first month it closes {trigger}% or more below, sell the whole block at market — whatever the gilt price — and buy the share fund with all of it.',
    market: '{symbol}: {below}% below its all-time high — {level} on {asOf}, against a high of {ath}{athOn}. The trigger fires at {fireLevel}.',
    marketNoSymbol: 'The index: {below}% below its all-time high — {level} on {asOf}, against a high of {ath}{athOn}. The trigger fires at {fireLevel}.',
    athOn: ' on {athOn}',
    indexAsOf: 'Index as of {asOf}.',
    noIndex: 'No index figure could be read today, so the watch cannot say where the market stands.',
    live: 'The trigger is live: {below}% below the high. Sell the whole block at market and buy the share fund with all of it — do not split it, and do not wait for a deeper fall.',
    quiet: 'No action: the market is {below}% below its high.',
    ticket: {
      title: 'The sell ticket',
      lead: 'Sell by units, not by amount: the units are the face value (1 unit is £1; some tickets count a penny as one unit). What you are quoted will include accrued interest on top of the figure here. Prices move: the proceeds are a guide, at the prices at lock.',
      columns: { n: '#', sell: 'Sell', sedol: 'SEDOL', code: 'Code', matures: 'Matures', units: 'Units to sell', proceeds: 'Proceeds', pays: 'Income given up', years: 'For tax years' },
      total: 'Total ({n} gilts)',
      note: 'Every rung not on this ticket stays. The proceeds buy the world share fund the same day — the point of the rule is not to negotiate with it.'
    },
    switchLead: 'Made the switch? The full view records it: the plan moves to “Floor to an age, then decide” at {cutAge}, with the income sold on record.',
    switchButton: 'Make the switch in the full view'
  },
  /** "This is how I want to hold it" (7.12.0): one press and a confirm, Moving, while the move is not done. */
  sayHeld: {
    title: 'Want to hold it your own way?',   // (never "holding": a banned word on planner pages)
    lead: 'You can say that what you hold now is how you want it. This page then shows what you hold beside your plan, with no list to buy.',
    button: 'This is how I want to hold it',
    confirm: 'From now on this page shows what you hold beside your plan, and stops listing things to buy. Your plan and its document stay as locked. You can take this back at any time.',
    yes: 'Yes, this is how I want it',
    no: 'Go back'
  },
  footer: 'Illustration, not advice. Nothing here places an order.',
  toast: {
    ticked: 'Saved. ‘{label}’ ticked as placed.',
    unticked: 'Saved. ‘{label}’ unticked.',
    undone: 'Put back as it was.',
    unchanged: 'Nothing to save.',
    savedShort: 'Saved.'
  },
  problems: {
    locked: 'This plan is locked, so this could not be written.',
    notLocked: 'This plan is not locked, so there is no move to tick.',
    noRun: 'The plan could not be read against its document.',
    notHere: 'That plan is not in this {store}. Nothing was written.',
    usedUp: 'The free time without an account is used up. Nothing was written.',
    nobody: 'Nobody is signed in and this plan is not in this window. Nothing was written.',
    storage: 'This browser would not keep the change. Nothing was written.',
    failed: 'The change could not be written. Nothing has changed.',
    problems: 'That line is not one of the moves. Nothing was written.',
    readonly: 'This plan is shown as it was saved and cannot be changed here.',
    store: { account: 'account', 'window': 'window' }
  },
  buttons: { undo: 'Undo', close: 'Close', back: 'Back to your plan', lock: 'Lock the plan', hold: 'What you hold', about: 'About you and when' },
  saving: 'Saving…'
};
