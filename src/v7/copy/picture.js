/**
 * The words of the first visit's pictures and controls (7.5.0; research/v7/mockups/README.md): the slider on an answer,
 * the three figures under the verdict, the pot over a life with its legend and table, and the "Keep this as a plan" line.
 * Data only — this file imports nothing. Placeholders are written {likeThis} and filled by the component that shows them.
 * "Bad case" always goes with "the worst 1 in 10" on the same screen (the banned list's rule).
 */
export const PICTURE = {
  /** The slider: what it moves, then its value. {value} is the figure; {employer} the employer's share of pay. */
  slider: {
    total: 'What goes into your pension a month',
    own: 'What you pay in a month (your employer’s part stays as it is)',
    share: 'Your share of pay going in (your employer adds {employer}%)',
    take: 'What if you took this a month?',
    spend: 'What you take a month',
    hint: 'Slide it, or use the arrow keys. The answer is worked out again as it moves.'
  },
  /** The three figures, by the id state/pictures.js answerTiles gives each. {age} is filled with an age. */
  tiles: {
    label: 'The answer in three figures',
    aim: 'pot to aim for at {age}, at today’s prices',
    nowBad: 'where paying in as now gets you by {age} in a bad case (the worst 1 in 10)',
    enough: 'a month going in that would be enough',
    enoughShare: 'of your pay going in that would be enough',
    payInNow: 'a month going in now',
    careful: 'a month, lasting in 9 futures out of 10',
    middling: 'a month in middling years',
    good: 'a month in good years',
    take: 'a month you take, after tax',
    could: 'a month you could take, lasting to {age} in 9 futures out of 10',
    runsOut: 'the age the money runs out in a bad case (the worst 1 in 10)',
    lasts: 'still there at this age, even in a bad case (the worst 1 in 10)'
  },
  /** The pot over a life. */
  pot: {
    titleB: 'Your pot over your life',
    titleD: 'What is left over the years ahead',
    labelB: 'Your pension pot over your life: rising while you pay in, then drawn on from {age}. The bad case is shaded.',
    labelD: 'What is left of your pension and savings over the years ahead, at what you take. The bad case is shaded.',
    legend: {
      enough: 'what would be enough',
      now: 'paying in as now',
      bad: 'a bad case (the worst 1 in 10)',
      enoughBad: 'enough, in a bad case',
      middling: 'middling years',
      you: 'you, today',
      aim: 'the pot to aim for'
    },
    stop: 'stop at {age}',
    /** The line under the picture: what it is drawn from. */
    note: 'Drawn to scale through your answer’s own figures. Between them the lines are a guide; the figures are in the table.',
    show: 'Show the figures',
    hide: 'Hide the figures',
    /** The table: one row each, the answer's own figures. {pot}, {middling}, {bad}, {amount} are figures; {age} an age. */
    rows: {
      today: 'Today, at {age}: {pot}.',
      now: 'At {age}, paying in as now: {middling} in middling years, {bad} in a bad case.',
      enough: 'At {age}, paying in what would be enough: {middling} in middling years, {bad} in a bad case.',
      aim: 'The pot to aim for at {age}: {pot}.',
      nowOut: 'Paying in as now, in a bad case the money runs out at {age}.',
      nowLasts: 'Paying in as now, the money lasts to {age} even in a bad case.',
      dToday: 'Today, at {age}: {pot} in your pension and savings.',
      dOut: 'At what you take, in a bad case the money runs out at {age}.',
      dLasts: 'At what you take, the money lasts to {age} even in a bad case.',
      dMiddling: 'In middling years, {amount} a month would last to {age}.'
    }
  },
  /** The line that keeps an answer: the one create path is the question's own "Keep" step. */
  keep: {
    keep: 'Keep this as a plan',
    use: 'Use these in your plan',
    line: 'Trying never needs an account. To keep a plan for good, make a free one.'
  }
};
