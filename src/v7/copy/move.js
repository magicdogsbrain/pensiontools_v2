/**
 * The words of "Moving to your plan's mix" (research/v7/holdings-and-move.md §3; road-to-7.md step 10). Data only — this
 * file imports nothing. Placeholders are written {likeThis} and filled by the screen. The figures are never here: they are
 * the planner's own (TransitionPlanner, GiltLadderPlan.orderSheetRows, RotationStatus) read through answers/plan/move.js;
 * the one run is the one test's through OneAnswer. Never "transition", "wrapper", "run-up", "nominal" or "approx"
 * (src/v7/copy/banned.js is the law); the last line is always "Illustration, not advice. Nothing here places an order."
 */
export const MOVE = {
  title: 'Moving to your plan’s mix',
  lead: 'From what you hold to the plan as locked: what to buy and sell, the cash to hold, and when. A tick on each line records the order as placed.',
  optional: 'Optional. Skipping it means what you hold may not match what the plan was tested on.',
  notLocked: 'Set when the plan is locked. The move is worked out against the plan document, which the lock makes.',
  noRecord: 'Nothing recorded yet — record what you hold first. Until then everything below reads as “to buy”.',
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  notRun: 'The plan could not be read against its document.',
  target: { ladder: 'The target: a gilt ladder — every rung and the cash years, in units.', buckets: 'The target: a mix in pounds — any world share fund, gilt fund or money-market fund fills its part.', isaHold: 'The ladder is bought in the pension; the ISA is held aside and not part of it.', isaDraw: 'The ladder is bought in the pension; the ISA is drawn by its own rule and not part of it.' },
  status: {
    done: 'Done — what you hold matches the plan’s mix.',
    doneLadder: 'Done — every rung the plan still needs is held.',
    held: '{held}% of the plan’s mix held; {done} of {moves} moves ticked off.',
    gilts: '{bought} of {rungs} gilts bought; {held}% of the plan’s mix held.',
    next: 'Next: {action} {label}{units}{amount}.',
    runUp: 'Until your plan pays you draw {monthly} a month from your pension cash, for {months} more month{s}: {value} of the cash to hold now.',
    starts: 'The buying is spread over the next {months} month{s}, to {when}.'
  },
  waiting: {
    line: 'You stop work in about {years} years. Until about five years before, the move is just where new money goes.',
    newMoney: 'New money goes: {parts} — {monthly} a month in all.',
    newMoneyPart: '{amount} a month to {word}',
    newMoneyNone: 'No new money a month is on the record yet: add it line by line under What you hold.',
    planMix: 'The plan’s mix: shares {shares}%, bonds {bonds}%, cash {cash}%.',
    heldMix: 'What you hold, in your pension: shares {shares}%, bonds {bonds}%, gold and trend {diversifiers}%, cash {cash}%.',
    starts: 'The move itself starts around {when}.'
  },
  cost: {
    title: 'What skipping it costs',
    ladder: '{n} tax year{s} ({years}) {have} no gilt bought yet.',
    ladderNone: 'Every tax year the ladder funds has its gilt bought.',
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
      runUp: 'The months before your plan pays: {months} month{s} at {monthly}',
      cashYear: 'Cash year {year}',
      cashYearLump: 'Cash year {year} ({lump} of it paid by a lump sum expected that year)'
    },
    columns: { what: 'What for', amount: 'Amount' },
    total: 'To hold',
    held: 'You hold',
    spare: 'Spare',
    short: 'Short',
    spending: 'Cash: {held} held against {target} for the cash years still ahead ({years}) — being spent as the plan intends, so it is not a move.',
    spendingNone: 'Cash: {held} held; no cash years left — your spending float, not a target.'
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
    notInPlan: 'not in the plan — the proceeds pay for the ladder',
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
    short: 'Short by {short}: the plan was priced on a bigger pot than the record holds, or lines are missing from the record.',
    step: 'By {when}: {action} {label}{units}{amount}.',
    buy: 'buy',
    sell: 'sell',
    units: ', {units} units',
    amount: ' ({amount})',
    passed: 'Your plan is already paying: what is left is spread over the next {months} month{s}.'
  },
  how: {
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
    order: 'How to give the order: say the number of units — 1 unit is £1 of face value; if the screen counts £100 lots, use the figure in brackets. Ordering by amount also works, but the units you get then depend on the price that day, so the income is only close to the figure shown.',
    columns: { n: '#', buy: 'Buy', code: 'Code', sedol: 'SEDOL', matures: 'Matures', pays: 'Pays', years: 'For tax years', units: 'Units to order', price: 'Price at lock', cost: 'Cost at lock', bought: 'Bought' },
    lots: '({lots} if the screen counts £100 lots)',
    surplus: '(the surplus held in cash)',
    bought: { bought: 'bought', part: 'part bought', 'not yet': 'not yet', paid: 'paid out', sold: 'sold by the rotation' },
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
    switchLead: 'Made the switch? The planner records it: the plan moves to “Floor to an age, then decide” at {cutAge}, with the income sold on record.',
    switchButton: 'Make the switch in the planner'
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
