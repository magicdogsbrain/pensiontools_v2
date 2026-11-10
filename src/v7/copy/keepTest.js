/**
 * The words of "Test what you keep against your plan" and "I accept this risk" (7.7.0): what the plan's own test says when it
 * is run with what the person actually holds, side by side with the plan as locked, and the agreement that records they saw it.
 * answers/plan/keepTest.js keepTestOf says which sentence and fills the slots; both apps use these words. Data only — this
 * file imports nothing. Placeholders are written {likeThis}. Consequences, never advice (src/v7/copy/banned.js is the law).
 */
export const KEEPTEST = {
  title: 'Test what you keep against your plan',
  lead: 'Your plan was locked without what you chose to keep. This runs the plan’s own test again with what you actually hold, beside the plan as locked. The plan and its document do not change.',
  how: 'What you keep by choice and do not count toward the plan is left out of the plan’s money. What you count is tested as its kind of money: shares, one company’s included, on the same futures as a world share fund, which can understate how far one company falls; the lines under the table show a fall by half (and, for one company’s shares, to nothing). The rest is tested in the plan’s own mix. Money you expect is tested with it and without it.',
  run: 'Test what you keep against your plan',
  again: 'Test it again',
  running: 'Testing — this takes a few seconds.',
  failed: 'The test could not run. Try again.',
  noWorker: 'This browser cannot run the test in the background, so it cannot be run here.',
  // the side-by-side table
  columns: { what: 'The plan’s test', locked: 'As locked', held: 'With what you keep', without: 'Without the money you expect' },
  rows: { lasts: 'Lasts', bad: 'In a bad case, the worst 1 in 10' },
  lasts: 'Lasts {words}',
  badLasts: 'lasts to {age}',
  badShort: 'runs short at {age}, in {year}',
  badShortNoYear: 'runs short at {age}',
  firstShort: 'Before what you keep and the money you expect, {year} is the first tax year not covered by the plan’s own money: {gap} short at today’s prices.',
  // the plain shocks to what is kept by choice
  shockTitle: 'If what you keep by choice fell',
  shockHalf: 'If what you keep by choice fell by half: the plan lasts {words}; in a bad case, the worst 1 in 10, it {bad}.',
  shockNothing: 'If {list} were worth nothing: the plan lasts {words}; in a bad case, the worst 1 in 10, it {bad}.',
  shockNotCounted: 'You have not counted what you keep by choice toward the plan, so a fall in it changes what you have, not what the plan pays.',
  single: '{list} matches no fund we know, so it may be one company’s shares. The table tests it on the same futures as a world share fund; one company’s shares can fall much further than that, and can be worth nothing.',
  // the agreement
  accept: 'I accept this risk',
  acceptLead: 'This records that you have seen these figures and keep what you hold with them. Your plan and its document stay as locked; the agreement is kept beside them, dated today, and you can withdraw it.',
  acceptYes: 'Yes, I accept this risk',
  acceptNo: 'Not now',
  agreedOn: 'You agreed to this on {date}.',
  withdraw: 'Withdraw this',
  undo: 'Undo',
  // the one line on the plan's home and About, and on each kept line
  line: {
    untested: 'You keep something your plan did not have; it is not yet tested against your plan.',
    agreedLasts: 'Your plan, as locked on {locked}, with what you chose to keep (agreed {agreed}): lasts to {age} in a bad case, the worst 1 in 10 (was {was}).',
    agreedShort: 'Your plan, as locked on {locked}, with what you chose to keep (agreed {agreed}): runs short at {age} in a bad case, the worst 1 in 10 (was {was}).',
    stale: 'What you hold has changed since you agreed to it on {agreed}, so that agreement is out of date: test it again.',
    lapsed: 'You no longer keep what you agreed to on {agreed}, so that agreement is out of date; you can withdraw it.'
  },
  keptUntested: 'Kept — not yet tested against your plan.',
  todo: 'Test what you keep against your plan'
};
