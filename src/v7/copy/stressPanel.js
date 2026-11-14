/**
 * The words of "Try the bad years" (7.9.0; research/v7/replan-nov-2026.md §5): the panel on a plan's "Does it last?", the
 * strip under C's and D's answers, and "I accept this risk" for a row. answers/plan/stressPanel.js and
 * answers/shared/stressStrip.js say which sentence and fill the slots (already in pounds, ages and twentieths); both apps use
 * these words. Data only — this file imports nothing. Placeholders are written {likeThis}; a slot may itself be a sentence
 * of this file ({ id, slots }). Consequences, never advice (src/v7/copy/banned.js is the law).
 */
export const STRESS = {
  title: 'Try the bad years',
  run: 'Try the bad years',
  again: 'Try them again',
  lead: 'Each line runs this plan again on the same 1,000 futures with one thing made worse, so you can see what it does to the money. Nothing here changes your plan, and nothing is saved unless you say so.',
  working: 'Trying line {i} of {n}…',
  failed: 'These could not be tried. Nothing has changed.',
  noWorker: 'This browser cannot run the test in the background, so the bad years cannot be tried here.',
  // the strip under C's and D's answers
  strip: {
    title: 'Try the bad years',
    lead: 'Each line works this answer out again on the same futures with one thing made worse, at the {amount} a month it stands behind.',
    button: 'Try the bad years',
    again: 'Try them again',
    working: 'Trying each line on the same futures…',
    failed: 'These could not be tried. Nothing has changed.'
  },
  // classic's Scenarios page: the hint under the rows, above the decades it explains
  classicHint: 'The lines above make one thing worse on purpose. The decades below are real history, explained, not run again.',
  // the hand-over under the fall row: the classic planner's real starts, one at a time
  handOver: 'Real bad starts, one at a time',
  // each row: its title and what it changes
  rows: {
    asPlanned: { title: 'As planned', what: 'This plan as it stands.', answer: 'This answer as it stands.' },
    fall: {
      title: 'A fall at the start',
      what: 'Shares lose at least 30% of their value, after rising prices, in the first year the money is drawn on.',
      whatDrawing: 'Shares lose at least 30% of their value, after rising prices, in the coming year.'
    },
    lower: {
      title: 'Lower returns',
      what: 'Everything held in funds and cash grows by 1% a year less, after rising prices, from when the money is drawn on.',
      saver: 'The years until then are as your plan has them.'
    },
    spend: {
      title: 'Spending a tenth more',
      what: 'The plan pays a tenth more income every year, before tax.',
      answer: 'You spend a tenth more: {amount} a month after tax.'
    },
    prices: {
      title: 'Prices rising faster',
      what: 'Prices rise 2% a year faster in every future. In this line shares keep up with prices; fixed sums, and pensions whose rises are capped, fall behind.'
    },
    asHeld: { title: 'As you hold it', what: 'What you hold now, with what you chose to keep and the money you expect later.' },
    heldHalf: { title: 'What you chose to keep falls by half', what: 'What you marked as yours to keep loses half its value.' },
    heldNothing: {
      title: 'If what may be one company’s shares went to nothing',
      what: '{list} matches no fund we know, so it may be one company’s shares. Here it is worth nothing.',
      whatMany: '{list} match no fund we know, so they may be one company’s shares. Here they are worth nothing.'
    }
  },
  // why a row has no figure
  na: {
    todaysPrices: 'Not tried for this way of drawing: we work it out in today’s prices throughout, so we cannot show what faster-rising prices would do. Fixed sums, pensions whose rises are capped and tax bands that do not rise would all buy less.',
    lockedLadder: 'Not tried on a locked ladder: its gilts were bought at the prices of the day it was locked, and we never price them again. What you chose to keep is tried below.',
    unaffordable: 'This way of drawing cannot be bought after this change, so there is no figure.',
    notCounted: 'You have not counted what you keep by choice toward the plan, so a fall in it changes what you have, not what the plan pays.',
    same: 'This changes nothing in this plan’s figures.',
    sameAnswer: 'This changes nothing in this answer’s figures.'
  },
  // a row's lines: the 7.8.0 sentences, each with its reference beside it
  lines: {
    weighted: '{words} ({ref}).',
    fixed: '{words} ({ref}).',
    plain: '{words}',
    when: 'Where the money runs out, it typically runs out at {typical}. In the worst 1 in 10 futures, by {worst}.',
    whenStillLasts: 'Where the money runs out, it typically runs out at {typical}. In the worst 1 in 10 futures it still lasts to {age}.',
    stillLasts: 'In the worst 1 in 10 futures it still lasts to {age}.',
    closedYear: 'In every future we tried, the income for {taxYear} is not paid in full.',
    howLong: 'In those futures it still pays for {paid} of the {of} years to {age}.',
    howLongAnyway: 'In those futures what the plan pays is still met in {paid} of the {of} years to {age}, with what comes in anyway.',
    howMuch: 'Across those futures, £{tenths} of every £10 of income the plan pays is still paid.',
    howMuchLess: 'Across those futures, less than £1 of every £10 of income the plan pays is still paid.',
    howMuchAnswer: 'Across those futures, £{tenths} of every £10 you planned to spend is still paid.',
    howMuchAnswerLess: 'Across those futures, less than £1 of every £10 you planned to spend is still paid.',
    cuts: 'Income cuts: in {n} of {of} futures, typically {perYear} a year less for about {years} year{s} ({ref}).',
    cutsNone: 'Income cuts: none in the {of} futures ({ref}).',
    cutsOwn: 'Income cuts: in {n} of {of} futures, typically {perYear} a year less for about {years} year{s}.',
    cutsNoneOwn: 'Income cuts: none in the {of} futures.',
    badLeft: 'In the worst 1 in 10 futures, what is left at {age} is {left}.'
  },
  // the reference beside a figure: As planned for the market rows and As held; As held for the held shocks
  ref: {
    asPlanned: 'as planned: {n}',
    asHeld: 'as held: {n}',
    cutsAsPlanned: 'as planned: {n}',
    cutsAsHeld: 'as held: {n}',
    cutsNone: 'none',
    cutsSome: 'in {n}'
  },
  // "I accept this risk" (As planned and the four market rows)
  agreement: {
    accept: 'I accept this risk',
    confirm: 'You are saying you have seen what this does to the plan: {figures}. Nothing about the plan changes, and you can withdraw this at any time. This is a note for your own records. It is not advice, and we have not judged whether the plan suits you.',
    yes: 'Yes, I accept it',
    no: 'Go back',
    accepted: 'You accepted this on {date}, when the money lasted as long as you do {chance}',
    acceptedFixed: ' (if you live to {age}, it lasted that long {fixed}).',
    acceptedOnly: 'You accepted this on {date}, when the money lasted to {age} {fixed}.',
    stale: 'The plan’s figures have changed since, so it no longer stands.',
    withdraw: 'Withdraw this',
    withdrawn: 'Withdrawn: what you accepted on {date} is no longer on this plan.',
    acceptedNow: 'Accepted on {date}. You can withdraw it at any time.',
    saving: 'Saving…',
    problems: {
      oldResult: 'The plan changed after these lines were tried. Try them again, then accept.',
      same: 'This line changes nothing in the plan’s figures, so there is nothing to accept.',
      nothingFails: 'In this line the money runs out in none of the futures, so there is nothing to accept.',
      failed: 'That could not be saved. Nothing has changed.'
    }
  },
  // the held rows: the keep agreement's state, accepted on What you hold
  held: { onHold: 'Accept or withdraw this on What you hold.' },
  // "Test what you keep against your plan": its link to the panel
  keepLink: 'See it beside the other bad years',
  // what is accepted before the lines are tried again
  acceptedTitle: 'What you have accepted'
};
