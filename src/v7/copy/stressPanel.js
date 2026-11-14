/**
 * The words of "Try the bad years" (7.9.0; research/v7/replan-nov-2026.md §5): the panel on a plan's "Does it last?", the
 * strip under C's and D's answers, and "I accept this risk" for a row. answers/plan/stressPanel.js and
 * answers/shared/stressStrip.js say which sentence and fill the slots (already in pounds, ages and twentieths), a row's
 * short lines through answers/shared/stressRowWords.js; both apps use these words. Data only — this file imports nothing. Placeholders are written {likeThis}; a slot may itself be a sentence
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
      title: 'A holding we cannot match goes to nothing',
      titleMany: 'Holdings we cannot match go to nothing',
      what: '{list} matches no fund we know, so it may be one company’s shares. Here it is worth nothing.',
      whatMany: '{list} match no fund we know, so they may be one company’s shares. Here they are worth nothing.'
    }
  },
  // why a row has no figure
  na: {
    todaysPrices: 'Not tried for this way of drawing: we work it out in today’s prices throughout, so we cannot show what faster-rising prices would do. Fixed sums, pensions whose rises are capped and tax bands that do not rise would all buy less.',
    // said once, above the rows (the four rows keep their title and what they change)
    lockedLadder: 'A locked ladder’s income is fixed on the day it is locked, by the gilts and their prices that day, so these four are not tried on it: a fall at the start, lower returns, spending a tenth more and prices rising faster.{keep}',
    lockedLadderKeep: ' What you chose to keep is tried below.',
    unaffordable: 'This way of drawing cannot be bought after this change, so there is no figure.',
    notCounted: 'You have not counted what you keep by choice toward the plan, so a fall in it changes what you have, not what the plan pays.',
    same: 'This changes nothing in this plan’s figures.',
    sameAnswer: 'This changes nothing in this answer’s figures.'
  },
  // a row in short (answers/shared/stressRowWords.js fills these, for the panel, the strip and the classic planner alike):
  // its chance with the count to one named age beside it, where it runs out, each beside the reference's figure; what still
  // comes in said once above the rows; everything else under "More about this line" (the `lines` below)
  short: {
    more: 'More about this line',
    join: '; ',
    // "The money lasts as long as you do, 16 times in 20 (as planned 18)" + "; " + "if you live to 99, it lasts that long in 9 of
    // 20 futures we tried (as planned 13)." — a figure the reference says too reads "(the same as planned)"
    weighted: '{lasts}, {chance}{ref}',
    lasts: {
      ranOut: 'The money lasts as long as you do',
      ranOutCouple: 'The money lasts as long as one of you is alive',
      cut: 'Your income is paid in full as long as you live',
      lean: 'You have no lean year while you are alive'
    },
    fixed: 'if you live to {age}, {verb} {count}{ref}.',
    fixedCouple: 'if one of you is still alive when the younger of you is {age}, {verb} {count}{ref}.',
    verb: { ranOut: 'it lasts that long', cut: 'it is paid in full that long', lean: 'you have no lean year that long' },
    // a row with no weighted figure: its fixed-age sentence alone
    fixedOnly: '{words}{ref}.',
    ref: ' ({as} {n})',
    // (a no-break space inside each, and before a bracket's last age, so a line never ends on a lone "planned)." or "93).")
    as: { asPlanned: 'as\u00a0planned', asHeld: 'as\u00a0held' },
    same: ' (the same {as})',
    n: { every: 'in every one', none: 'in none', moreThan19: 'more than 19', fewerThan1: 'fewer than 1' },
    // "Where it runs out: typically at 96, the worst 1 in 10 by 90 (as planned 97 and 93)." When the worst 1 in 10 still lasts
    // to the plan's age, the chance line's count to that age already says so: only the typical age is said, unless the
    // reference's worst 1 in 10 runs out (then that is news)
    runsOut: 'Where it runs out: typically {typical}{refTypical}, the worst 1 in 10 {worst}{refWorst}.',
    runsOutBoth: 'Where it runs out: typically {typical}, the worst 1 in 10 {worst} ({as} {age1} and\u00a0{age2}).',
    runsOutBothSame: 'Where it runs out: typically {typical}, the worst 1 in 10 {worst} (both the same {as}).',
    runsOutTypical: 'Where it runs out: typically {typical}{refTypical}.',
    runsOutLasts: 'Where it runs out: typically {typical}{refTypical}; in the worst 1 in 10 it still lasts to {age}{refWorst}.',
    stillLasts: 'In the worst 1 in 10 it still lasts to {age}{refWorst}.',
    at: 'at {age}',
    atYounger: 'when the younger of you is {age}',
    by: 'by {age}',
    byYounger: 'by the time the younger of you is {age}',
    refTypical: ' ({as}\u00a0{age})',
    refTypicalNone: ' (none run out {as})',
    refWorstBy: ' ({as} by\u00a0{age})',
    refWorstLasts: ' (it still lasts to {age}\u00a0{as})',
    // said once, above the rows, from As planned: without an age when something comes in (a row whose own differs says it
    // under "More about this line")
    floor: {
      plan: 'If {runsOut}, you would still have {amount} a year after tax from the income you get anyway{assumed}.',
      assumed: ', with the State Pension we assumed (none is entered)',
      runsOut: { ranOut: 'the money runs out', cut: 'your income is first cut', lean: 'you have your first lean year' },
      answer: 'If the money runs out, you would still have {amount} a year after tax{between}, {from}{survivor}.',
      between: ' between you',
      from: { pensions: 'from your pensions', statePensions: 'from your State Pensions', statePension: 'from your State Pension' },
      survivor: '; if one of you has died by then, at least {amount}',
      survivorNone: '; if one of you has died by then, the one left could have nothing coming in from a pension'
    }
  },
  // a row's lines under "More about this line": the 7.8.0 sentences, each with its reference beside it. When, how long and
  // how much name the futures each counts, as the answers do (shared/lastsWords.js): "when" the futures that run out before
  // the age they are followed on to, the worst 1 in 10 all of them, how long and how much those that run out before the
  // plan's own age. A row beside a reference (the …Ref sentences) also says how many futures each set holds and the
  // reference's figure, so a set grown with later run-outs never reads as a better year.
  lines: {
    plain: '{words}',
    when: 'In the futures where the money runs out before {weightAge}, it typically runs out at {typical}. In the worst 1 in 10 of all the futures, by {worst}.',
    whenStillLasts: 'In the futures where the money runs out before {weightAge}, it typically runs out at {typical}. In the worst 1 in 10 of all the futures it still lasts to {age}.',
    whenRef: 'In the futures where the money runs out before {weightAge} ({count} of the {n}; {refCount}), it typically runs out at {typical} ({refTypical}). In the worst 1 in 10 of all the futures, by {worst} ({refWorst}).',
    whenStillLastsRef: 'In the futures where the money runs out before {weightAge} ({count} of the {n}; {refCount}), it typically runs out at {typical} ({refTypical}). In the worst 1 in 10 of all the futures it still lasts to {age} ({refWorst}).',
    closedYear: 'In every future we tried, the income for {taxYear} is not paid in full.',
    howLong: 'In the futures where it runs out before {age}, it still pays for {paid} of the {of} years to {age}.',
    howLongAnyway: 'In the futures where it runs out before {age}, what the plan pays is still met in {paid} of the {of} years to {age}, with what comes in anyway.',
    howLongRef: 'In the futures where it runs out before {age} ({count} of the {n}; {refCount}), it still pays for {paid} of the {of} years to {age} ({refPaid}).',
    howLongAnywayRef: 'In the futures where it runs out before {age} ({count} of the {n}; {refCount}), what the plan pays is still met in {paid} of the {of} years to {age}, with what comes in anyway ({refPaid}).',
    howMuch: 'Across those futures, £{tenths} of every £10 of income the plan pays is still paid.',
    howMuchLess: 'Across those futures, less than £1 of every £10 of income the plan pays is still paid.',
    howMuchRef: 'Across those futures, £{tenths} of every £10 of income the plan pays is still paid ({refTenths}).',
    howMuchLessRef: 'Across those futures, less than £1 of every £10 of income the plan pays is still paid ({refTenths}).',
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
    cutsSome: 'in {n}',
    // the reference's own figure beside when, how long and how much (in the …Ref sentences)
    noneRunOut: 'none run out',
    none: 'none',
    by: 'by {age}',
    stillLasts: 'it still lasts to {age}',
    tenths: '£{tenths}',
    lessThanOne: 'less than £1'
  },
  // "I accept this risk" (As planned and the four market rows)
  agreement: {
    accept: 'I accept this risk',
    confirm: 'You are saying you have seen what this does to the plan: {figures}. Nothing about the plan changes, and you can withdraw this at any time. This is a note for your own records. It is not advice, and we have not judged whether the plan suits you.',
    yes: 'Yes, I accept it',
    no: 'Go back',
    accepted: 'You accepted this on {date}, when the money lasted as long as you do, {chance}',
    acceptedFixed: ' (if you live to {age}, it lasted that long {fixed}).',
    acceptedOnly: 'You accepted this on {date}, when the money lasted to {age} {fixed}.',
    // on a tried row whose agreement still stands: its figures are the row's own, just above
    acceptedShort: 'You accepted this on {date}.',
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
  // the held rows: the keep agreement's state, said once (on "As you hold it") as information, and the way to What you hold,
  // where it is accepted or withdrawn — the link names the one thing that can be done there now
  held: {
    untested: 'What you chose to keep is not yet accepted as a risk on this plan.',
    agreed: 'You accepted what you chose to keep on {date}.',
    stale: 'What you accepted on {date} no longer stands: what you hold has changed since.',
    lapsed: 'You no longer keep what you accepted on {date}.',
    accept: 'Accept it on What you hold.',
    // on As you hold it, a locked ladder whose count is below As planned's: why (keepTest.ladderGapsOf, What you hold's own gaps)
    gap: 'What you hold for the plan’s own money does not cover every year it pays: {taxYear}, when you are {age}, is the first not covered ({amount} short at today’s prices).',
    acceptAgain: 'Accept it again on What you hold.',
    withdraw: 'Withdraw it on What you hold.'
  },
  // "Test what you keep against your plan": its link to the panel
  keepLink: 'See it beside the other bad years',
  // what is accepted before the lines are tried again
  acceptedTitle: 'What you have accepted',
  // the guardrail reading in "Where you are" (services/PlanDocument.js guardrailOf): this year's draw from the pots as a share of
  // what they hold, beside the share the plan as locked began with; a fifth above or below is the line, a tenth less or more
  // what would bring it back. Both apps.
  guardrail: {
    within: 'This year your plan takes {draw} from your pots: {pct} of what they hold now. In {startYear}, when the plan as locked began, it took {startPct} of what they held. If it reaches {upperPct} of what they hold (a fifth above that), taking a tenth less would bring it back under that line.',
    above: 'This year your plan takes {draw} from your pots: {pct} of what they hold now, more than a fifth above the {startPct} it took in {startYear}, when the plan as locked began. Taking a tenth less, {less}, would make it {lessPct} of what they hold.',
    below: 'This year your plan takes {draw} from your pots: {pct} of what they hold now, more than a fifth below the {startPct} it took in {startYear}, when the plan as locked began. You could take a tenth more, {more}, and it would be {morePct} of what they hold.',
    cuts: 'Your plan’s own rule for cuts is above; this is another way to read the same draw.'
  }
};
