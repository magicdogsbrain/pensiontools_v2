/**
 * The words of "How the money is taken" (research/v7/way-and-mix.md 2; road-to-7.md step 8a). Data only — this file
 * imports nothing. Placeholders are written {likeThis} and filled by the screen. The figures are never here: they are the
 * one test's own, read through the planner's OneAnswer.js.
 *
 * The nine names are the planner's (stressTest.js STRATEGY_NAMES, pinned by a test). Each way's promise and what can go
 * wrong are the registry's sentences (src/strategies/registry.js) in V7's words: the registry says "equities", "fails"
 * and "real yields", which the banned list does not allow on a V7 screen (src/v7/copy/banned.js), so they are said here
 * as "shares", "runs out" and "today's prices" — the same sentence, the words the guide asks for.
 */
export const WAY = {
  title: 'How the money is taken',
  lead: 'Nine ways of turning your pots into an income, each run on this plan through the one test: every real stretch of markets since 1871 and 1,000 possible futures. Your plan’s way first; the other eight below, ranked by how many futures out of 10 they last.',
  /** The nine, as the planner names them. */
  names: {
    'pots-and-valves': 'Pots & Valves',
    'buckets-in-order': 'Buckets in order',
    'ladder-and-ratchet': 'Ladder & Ratchet',
    'bridge-and-engine': 'Bridge & engine',
    'floor-and-flex': 'Floor & Flex',
    'floor-the-schedule': 'Floor the schedule',
    'floor-to-age': 'Floor to an age, then decide',
    'full-il-gilt': 'Full index-linked gilt ladder',
    'gilt-rotation': 'Gilt ladder + rotation'
  },
  /** What each way promises (the registry's `promise`, in V7's words). */
  promise: {
    'pots-and-valves': 'One flexible portfolio. Rules decide which pot pays you this month.',
    'buckets-in-order': 'Three buckets, one order: cash pays first, then bonds, then shares. Money above the path spills down: shares above their line refill bonds, bonds above their target refill cash. Nothing is sold in a slump.',
    'ladder-and-ratchet': 'Your full income bolted to the calendar. Growth ratchets more years on.',
    'bridge-and-engine': 'Every year to your State Pension bought today: cash first, then one index-linked gilt a year. The rest rides in shares untouched, then pays the rest of your life by ordinary withdrawals.',
    'floor-and-flex': 'The bills are paid to a chosen age by contract. Everything else flexes with the market.',
    'floor-the-schedule': 'Your whole income plan, year by year, bought up front. Nothing to decide each month.',
    'floor-to-age': 'Your income bought by contract to an age you choose. The rest rides in world shares until then.',
    'full-il-gilt': 'Every year of your income bought today. A gilt matures before each April; you draw it monthly. Nothing to decide, ever.',
    'gilt-rotation': 'The full ladder, plus one pre-agreed escape: if shares ever fall 30% below their all-time high, the rungs beyond 75 are sold to buy them cheap.'
  },
  /** What can go wrong (the registry's `failure`, in V7's words). */
  wrong: {
    'pots-and-valves': 'A long bad run can drain the pots faster than they refill.',
    'buckets-in-order': 'A slump longer than cash and bonds together forces shares to be sold at the bottom, late and after two buffers; and the buffers cost a little growth every year.',
    'ladder-and-ratchet': 'If markets never boom, the growth pot arrives small at the far end.',
    'bridge-and-engine': 'If the engine arrives small at the age the rungs end, the later years are drawn from a small pot: it can run out, late.',
    'floor-and-flex': 'Treats shrink in long bad markets, and the floor is only as right as your bills figure.',
    'floor-the-schedule': 'It costs most of the pot; the reserve grows, but the plan itself can never grow, and selling rungs early can lose money.',
    'floor-to-age': 'If the reserve arrives small at that age, the later years are bought at a lower level: a cut, not a cliff.',
    'full-il-gilt': 'It costs the whole pot at today’s prices; there is no upside, and the only inflation it tracks is the official index.',
    'gilt-rotation': 'If the crash never comes the leftover is the ladder’s. If it comes late (a 1929 after 65), the rotated years can be cut; the floor to 75 and the State Pension never run short.'
  },
  yours: 'Your plan’s way of drawing',
  others: 'The other eight, on this plan',
  othersLead: 'Each ran your plan, its pots, its spending and its full length through the same one test. Ranked by how many futures out of 10 it lasts; a way your pot cannot buy is last.',
  /** The lines of a card, by id. */
  card: {
    lastsYours: 'Your plan lasts {words}.',
    lasts: 'On this plan it lasts {words}.',
    sub: '{pct}% of {futures} futures; {histories} real starts since 1871.',
    subContract: 'Every year is bought by contract, so no future and no start year can run it out; {years} years, to {toAge}.',
    left: 'Left at the end, at today’s prices: typically {typical}; in a bad case (the worst 1 in 10) {bad}.',
    cost: 'Costs {cost} of your pot today; {left} left to grow.',
    costAll: 'Costs {cost} of your pot today; nothing left to grow.',
    cannot: 'Your pot cannot buy this: it would cost {cost}, {short} more than the pot. So there is no figure.',
    cannotGilt: 'Your pot cannot buy this on this plan: no index-linked gilt reaches far enough for its last years. So there is no figure.',
    /** On a locked plan, once another way is open (2.4): the document's figure beside the tried one; never a word of unlocking. */
    compare: 'Your plan as locked lasts {docWords} on {docWay}; {way} would have lasted {words}.',
    /** The two ways of the Pots & Valves family (2.2, 3.1): the mix is on its own step, "The mix" (6.41.0). */
    mix: 'Its mix, the split between shares, bonds, gold and trend funds, and cash, is on ‘The mix’.',
    mixLink: 'Open ‘The mix’',
    noTent: 'The bond tent is not used by this way of drawing.',
    bundled: 'Gilts priced on the bundled yield curve here; the planner prices them on the day’s live figures when it has them.',
    wrongTitle: 'What can go wrong',
    verdictWord: { yes: 'On course', close: 'Close', no: 'Not yet' }
  },
  /** The dials (2.3): every one the planner shows for the way, in plain words. */
  dials: {
    title: 'Its dials',
    lead: 'Move a dial and this way is tried again on your plan; nothing is kept until you press “Use this way of drawing”.',
    leadLocked: 'Move a dial and this way is tried again on your plan. Nothing here changes the locked plan.',
    none: 'No dials: the income comes from your spending shape and the plan’s length.',
    labels: {
      protectionOn: 'Cut spending in bad runs',
      cutPct: 'How deep the cut is, %',
      consecutiveLimit: 'Months below the path before it cuts',
      bucketBand: 'How far above the path before the cash bucket refills, %',
      ladderYears: 'Years of income bought up front',
      drawAnnual: 'Income to bolt on, a year before tax',
      triggerMode: 'When it buys more years',
      bandThreshold: 'How far above the path before it sells (times)',
      bridgeAge: 'Every year bought to age',
      cashYears: 'Years paid from cash first',
      essentialsAnnual: 'The bills, a year',
      horizonAge: 'Bills paid to age',
      sleeveRatePct: 'What the rest pays out, % a year',
      ratchet: 'When markets are kind',
      treatsRule: 'Treats',
      floorToAge: 'Buy the income to age',
      bridgeCash: 'Cash kept to the first April',
      spareGrowth: 'Money left over',
      rotateCutAge: 'Keep the rungs to age',
      rotateTrigger: 'The escape: % below the all-time high',
      rotateDisarmYears: 'Years before the escape is put away'
    },
    options: {
      protectionOn: { yes: 'Yes', no: 'No: pay the plan in full until the money runs out' },
      triggerMode: { band: 'When shares are well above their path', calendar: 'Every five years' },
      ratchet: { off: 'Nothing changes', extend: 'Extend the floor past its age', raise: 'Raise the income' },
      treatsRule: { share: 'A share of the rest each year', fixed: 'A fixed sum: the plan above the bills' },
      spareGrowth: { kept: 'Kept, so it keeps its value', invested: 'Invested in shares' }
    },
    help: {
      bridgeAge: 'Usually your State Pension age: the rungs pay until then, the engine after.',
      ratchet: 'Kept with the plan; the one test runs the floor without it.',
      cashYears: 'The first years, where no gilt matures in the right window.'
    },
    errors: {
      required: 'Type a figure.',
      notANumber: 'Figures only, please.',
      tooLow: 'At least {min}.',
      tooHigh: 'Up to {max}, please.',
      notAnOption: 'One of the choices, please.'
    }
  },
  buttons: {
    open: 'Open',
    use: 'Use this way of drawing',
    confirm: 'Use it',
    notNow: 'Not now',
    more: 'More columns',
    fewer: 'Fewer columns',
    back: 'Back to your plan',
    undo: 'Undo',
    close: 'Close',
    tryAgain: 'Try again',
    inPlanner: 'Run them in the planner'
  },
  /** The cost of the runs, said where the figures are (2.5). */
  ran: {
    nine: 'Ran the nine ways in {s} s.',
    one: 'Tried in 1 run.',
    oneTimed: 'Tried in 1 run ({s} s).'
  },
  working: {
    title: 'Running the nine ways on your plan…',
    body: 'Each is the one test: every real start since 1871 and 1,000 possible futures. The cards fill in as they finish.',
    progress: 'How far the working has got',
    slow: 'Still working. This can take a little longer on a phone.',
    one: 'Trying it…'
  },
  failed: {
    title: 'Sorry, we could not run the nine ways.',
    body: 'Nothing has been lost. Your plan is still here.',
    noWorker: 'This browser cannot run the test in the background, so the nine ways cannot be run here. The planner runs the same nine.',
    one: 'Sorry, that could not be tried. Nothing has changed.'
  },
  notRun: 'This plan is shown as it was saved, so it is not run here. Nothing has been lost.',
  /** "More columns" (1): the planner's other columns and its other orders, never the default. */
  table: {
    lead: 'The planner’s other columns, on the same runs.',
    rankBy: 'Rank by',
    orders: { lasts: 'How many futures it lasts', left: 'What is typically left', score: 'Score', coverage: 'Coverage' },
    columns: { way: 'Way of drawing', lasts: 'Lasts', worst12: 'Worst 12 months', left: 'Typically left', covered: 'Years covered', coverage: 'Coverage', spent: 'Spent over the plan', bumpiness: 'Bumpiness (% a year)', score: 'Score' },
    score: 'The score weighs what is paid, how much is left and how bumpy the ride was; higher is better. It never decides the order of the cards.',
    none: '—',
    cannot: 'cannot be bought'
  },
  /** The confirm (2.4), on the same screen. */
  confirm: {
    title: 'Use this way of drawing?',
    body: 'Your plan will be drawn as {name}. Its dials as shown are kept with it; {old}’s own settings are put away and come back if you return to it. The pots, the income and the mix do not change.',
    undo: 'You can undo this straight away.'
  },
  locked: {
    lead: 'This plan is locked, so its way of drawing is fixed. Open any card to see how another way would do on the same plan; nothing here changes the plan.',
    fixed: 'Fixed when you locked the plan on {date}.'
  },
  readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.',
  saving: 'Saving…',
  toast: {
    way: 'Saved. The plan is now drawn as {name}. “Does it last?” runs again on the saved plan.',
    undone: 'Put back as it was.',
    unchanged: 'Nothing has changed.'
  },
  problems: {
    locked: 'This plan is locked, so nothing was changed. Unlock it from ‘Your plan as locked’ to change its way of drawing.',
    notHere: 'That plan is not in this account. Nothing was changed.',
    usedUp: 'Your free time without an account is used up. Sign in to keep and change this plan.',
    nobody: 'Sign in to change this plan. Nothing was changed.',
    storage: 'This browser would not keep the change. Nothing was changed.',
    failed: 'Sorry, the change could not be saved. Nothing was changed.',
    problems: 'Have a look at the dials marked on the card.',
    readonly: 'This plan is shown as it was saved and cannot be changed here. Nothing has been lost.'
  }
};
