/**
 * The words of "Does it last?" (research/v7/editing-in-v7.md 10). Data only — this file imports nothing. Placeholders
 * are written {likeThis} and filled by the screen. The figures are never here: they are the one test's own, read through
 * the planner's OneAnswer.js.
 */
export const LASTS = {
  title: 'Does it last?',
  lead: 'The one test every screen of the planner shows: your plan, its own way of drawing, its own cuts, its full length, through every real stretch of markets since 1871 and 1,000 possible futures.',
  savedValue: '({value})',
  source: { saved: 'From your plan, saved {date}', savedUndated: 'As saved in the plan', locked: 'Fixed when you locked the plan on {date}.' },
  /** The band and the rows under it, by id. */
  verdict: {
    'lasts.headline': 'Your plan lasts {words}.',
    'lasts.sub': '{pct}% of {futures} futures; {histories} real starts since 1871; {years} years, to {toAge}.',
    'lasts.subContract': 'Every year is bought by contract, so no future and no start year can run it out; {years} years, to {toAge}.',
    'lasts.unaffordable': 'This way of drawing cannot be bought with this plan’s pots, so there is no figure. Change the pots, the spending or the way of drawing.',
    word: { yes: 'On course', close: 'Close', no: 'Not yet' }
  },
  rows: {
    left: 'Left at the end, at today’s prices: typically {typical}; in a bad case (the worst 1 in 10) {bad}; in a good case (the best 1 in 10) {good}.',
    'cuts.some': 'Income cuts: in {n} of {of} futures{ranOut}, typically {perYear} a year less for about {years} year{s} ({total} in all; the most in any future {worst}). A cut is a tax year in which more than 1% of the planned income went unpaid and was never caught up.',
    'cuts.none': 'Income cuts: none — in every one of the {of} futures the plan was paid in full.',
    'cuts.bought': 'Income cuts: none — this way of drawing pays the plan in full until it cannot.',
    'cuts.flex': 'Income cuts: none — the treats flex instead; the honest risk is a lean year, not running out.',
    'ran.cuts': 'Run with the spending cuts you set: up to {pct}% after {months} month{s} in a row below the plan’s line.',
    'ran.cutsOff': 'Run with the spending cuts switched off, as you set it: the plan is paid in full until the money runs out.',
    'ran.bundled': 'Gilts priced on the bundled yield curve here; the planner prices them on the day’s live figures when it has them, so a ladder’s cost can differ there.'
  },
  /** Where the figures came from. */
  ran: { now: 'Worked out just now, on the plan as saved {date}.', nowUndated: 'Worked out just now, on the plan as saved.', document: 'Worked out when the plan was locked on {date}.', today: 'Today’s test on the same plan:' },
  /** While the run is under way, and when it cannot be. */
  working: { title: 'Working out your answer…', trying: 'Trying your plan against every real start since 1871 and 1,000 possible futures.', slow: 'Still working. This can take a little longer on a phone.', progress: 'How far the working has got' },
  failed: { title: 'Sorry, we could not work that out.', body: 'Nothing has been lost. Your plan is still here.', tryAgain: 'Try again',
    noWorker: 'This browser cannot run the test in the background, so the preview cannot run it here. The planner runs the same test.', inPlanner: 'Run it in the planner' },
  notRun: 'This plan is shown as it was saved, so it is not run here. Nothing has been lost.',
  /** History: "what if you had retired into a bad year?" — the one test's own real starts. */
  history: {
    title: 'What if you had retired into a bad year?',
    lead: 'The same {histories} real starts the test counted, {ranOut} of which ran out. These are where the figure above comes from, not a second figure.',
    leadCut: 'The same {histories} real starts the test counted. The plan was cut in {ranOut} of them; it never runs out. These are where the figure above comes from, not a second figure.',
    leadLean: 'The same {histories} real starts the test counted, {ranOut} of which had a lean year. The bills were paid in every one. These are where the figure above comes from, not a second figure.',
    leadContract: 'Every year of this plan is bought by contract, so no start year can run it out.',
    worstTitle: 'The hardest starts in the record — an unfair test',
    worstLead: 'Nobody retires into the worst month of 150 years on purpose, and the test counts every one of them all the same. Read these as the edge of what has ever happened, not as what will happen.',
    namedTitle: 'Named starts',
    namedLead: 'The famous bad years, each replayed from its January with your own plan, its own cuts setting and its full length. Every figure at today’s prices.',
    lowest: 'Lowest 12 months {lowest}',
    left: 'left {left}',
    rows: {
      'hist.ranOut': 'ran out at {age}',
      'hist.lastedCut': 'lasted; income cut in {n} year{s} ({total} in all)',
      'hist.lasted': 'lasted, never cut',
      'hist.ladderRanOut': 'the money kept to grow ran out at {age} after the ladder',
      'hist.ladder': 'the ladder paid by contract; the ratchet secured {secured} more year{s}',
      'hist.rotationFired': 'the market fell 30% below its high at {fired}: the long rungs were sold for shares; paid in full',
      'hist.rotationFiredShort': 'the market fell 30% below its high at {fired}: the long rungs were sold for shares; the later years ran short from {age}',
      'hist.rotationHeld': 'the market never fell 30% below its high in time: the whole ladder paid by contract',
      'hist.rotationHeldShort': 'the whole ladder paid by contract, but the later years ran short from {age}',
      'hist.flex': 'the floor paid by contract; the leanest treat-year was {leanest}',
      'hist.contract': 'every year is bought by contract — the start year changes nothing but the pounds that arrive',
      'hist.contractShares': 'every year of income is bought by contract — the start year changes only what the money left over in shares is worth',
      'hist.none': 'no start-year replay for this way of drawing yet: its history figure above is the one test’s',
      'hist.tooShort': 'real history since {year} is not long enough yet for a plan of this length; the futures the test stitches from it carry it on'
    },
    scenarios: 'The named stresses as whole decades — what each did to shares and prices — are explained in the planner.',
    scenariosButton: 'See the named stresses in the planner'
  },
  sections: { cuts: 'Cuts in a slump', reserve: 'Emergency reserve' },
  notes: {
    cuts: 'What the plan does in a slump instead of running dry: after some months in a row below its line, income is cut by a share, half of it at first and the whole of it if the slump lasts; missed income is made up later. Every run above counts the cuts as you set them.',
    reserve: 'Money kept aside and touched only when the plan would otherwise run out.'
  },
  fields: {
    cutsOn:            { label: 'Cut spending in a slump', options: { yes: 'Yes', no: 'No: pay the plan in full until the money runs out' } },
    cutAfterMonths:    { label: 'After how many months in a row below the plan’s line' },
    cutPct:            { label: 'Cut income by, %', help: 'Half of it for the first months below; the whole of it if the slump lasts.' },
    deeperAfterMonths: { label: 'Months at half the cut before the whole cut', help: '0 means the whole cut from the first month.' },
    buffer:            { label: 'Keep this much above the line before the cut ends, in pounds' },
    reserveOn:         { label: 'Keep an emergency reserve', options: { yes: 'Yes', no: 'No' } },
    reserveAmount:     { label: 'The reserve, in pounds' }
  },
  errors: {
    cutsOn:            { notAnOption: 'Yes or no.' },
    cutAfterMonths:    { required: 'How many months in a row, for example 3.', notANumber: 'Whole months, please, like 3.', tooLow: 'At least 1 month.', tooHigh: 'Up to 24 months, please.' },
    cutPct:            { required: 'The cut as a percent, for example 20.', notANumber: 'A whole percent, please, like 20.', tooLow: 'A percent of 0 or more.', tooHigh: 'Up to 95%, please.' },
    deeperAfterMonths: { required: 'How many months, for example 12 (or 0).', notANumber: 'Whole months, please, like 12.', tooLow: 'A number of months of 0 or more.', tooHigh: 'Up to 60 months, please.' },
    buffer:            { notANumber: 'Figures only, like 15,000, or 0.', tooLow: 'An amount of £0 or more.', tooHigh: 'An amount up to £1,000,000, please.' },
    reserveOn:         { notAnOption: 'Yes or no.' },
    reserveAmount:     { required: 'Type the reserve, for example 25,000.', notANumber: 'Figures only, like 25,000.', tooLow: 'At least £1.', tooHigh: 'An amount up to £50,000,000, please.' }
  },
  notUsed: 'Not used by this way of drawing.',
  derivedTitle: 'What this works out to',
  derived: {
    'cuts.staged': 'In a slump, after {months} months in a row below the plan’s line, income is cut by {half}% for {first} months and by {full}% if it lasts; the cut ends once the pots are {buffer} above the line again, and missed income is made up later.',
    'cuts.flat': 'In a slump, after {months} months in a row below the plan’s line, income is cut by {full}%; the cut ends once the pots are {buffer} above the line again, and missed income is made up later.',
    'cuts.off': 'No cuts: the plan is paid in full until the money runs out.',
    'reserve.on': 'An emergency reserve of {amount}, touched only when the plan would otherwise run out.',
    'reserve.off': 'No emergency reserve.',
    'notUsed.bought': 'Not used by this way of drawing: it pays the plan in full until it cannot. The dials are kept for the day you switch to Pots and valves or Buckets in order.',
    'notUsed.flex': 'Not used by this way of drawing: the treats flex instead. The dials are kept for the day you switch to Pots and valves or Buckets in order.'
  },
  partner: '{name}’s plan is tested on {name}’s plan.',
  partnerLink: 'Open ‘{name}’: does it last?',
  together: 'The two plans together — who draws what, and whether the household lasts — are checked in the planner.',
  togetherButton: 'Check the two plans together in the planner',
  buttons: { save: 'Save', cancel: 'Cancel', undo: 'Undo', close: 'Close', back: 'Back to your plan' },
  toast: {
    lasts: 'Saved. Cuts of up to {pct}% after {months} months; {reserve}. The test is running again on the saved plan.',
    lastsOff: 'Saved. No cuts; {reserve}. The test is running again on the saved plan.',
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
