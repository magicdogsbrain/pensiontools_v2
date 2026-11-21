/**
 * One short label per figure (lead4.md R7; step F1): every fact id of the register (src/reading/facts.js) has ONE label
 * and ONE basis, used by both views wherever the figure is named. Longer prose may differ between the views; it may not
 * contradict these.
 *
 *   LABELS[id]   { label, basis }   basis: what the figure is in ("today's money", "a year before tax", "a month after tax",
 *                                   "a chance", "an age", "a month", "words") — '' where the label says it
 *   labelOf(id)  the label of a fact id or of an indexed id made from a pattern ('income.step.2.beforeTax'); '' if none
 *
 * The stage words are three, the same in both views: Saving, Moving, Living on it (STAGE_WORDS).
 */
import { FACT, patternOf } from './facts.js';

const TODAY = "today's money";

export const STAGE_WORDS = Object.freeze(['Saving', 'Moving', 'Living on it']);
/** The lock's two words, the same in both views (lead4.md R7; step F3): the full view's chip and the simple view's Lock line. */
export const LOCK_WORDS = Object.freeze({ locked: 'Locked', notLocked: 'Not locked' });
/** The stage words by LifeStage.stageOf's key (and a closed plan's): the reading's stage (src/reading/timing.js) draws these. */
export const STAGE_WORD_OF = Object.freeze({ saving: STAGE_WORDS[0], moving: STAGE_WORDS[1], drawing: STAGE_WORDS[2], closed: 'Closed' });

export const LABELS = Object.freeze({
  [FACT.STAGE]: { label: 'Stage', basis: 'words' },
  [FACT.PLAN_NAME]: { label: 'Plan', basis: 'words' },
  [FACT.STOP_MONTH]: { label: 'You stop work in', basis: 'a month' },
  [FACT.YEARS_TO_GO]: { label: 'To go', basis: 'years and months' },
  [FACT.AGE_TODAY]: { label: 'Age today', basis: 'an age' },
  [FACT.END_AGE]: { label: 'Plan to age', basis: 'an age' },   // both views' box (step F1)
  [FACT.LOCKED]: { label: 'Locked', basis: 'words' },
  [FACT.LOCK_DATE]: { label: 'Locked on', basis: 'a day' },
  [FACT.LADDER_MONTHLY]: { label: 'Your plan pays', basis: 'a month before tax' },
  [FACT.STEP_FROM_AGE]: { label: 'Step starts at', basis: 'an age' },
  [FACT.PRICES_FROM]: { label: 'In the prices of', basis: 'a month' },
  [FACT.PLAN_YEAR]: { label: 'Years into the plan', basis: 'a count' },
  [FACT.PLAN_YEARS]: { label: 'Tax years in the plan', basis: 'a count' },
  [FACT.DUE_NEXT]: { label: 'Next', basis: 'words' },
  [FACT.POT_TODAY]: { label: 'Pension today', basis: TODAY },
  [FACT.ISA_TODAY]: { label: 'ISA today', basis: TODAY },
  [FACT.GIA_TODAY]: { label: 'General account today', basis: TODAY },
  [FACT.CASH_TODAY]: { label: 'Cash today', basis: TODAY },
  [FACT.POT_AGAINST_PLAN]: { label: 'Your pot, against the plan', basis: "the prices the plan's figures are in" },
  [FACT.POT_PLAN_MIDDLE]: { label: 'The plan expects by now', basis: "the prices the plan's figures are in" },
  [FACT.POT_PLAN_LOW]: { label: 'The plan’s 1-in-10 bad line for now', basis: "the prices the plan's figures are in" },
  [FACT.POT_AT_STOP]: { label: 'Pension when you stop, middle', basis: TODAY },   // the band's words in both views
  [FACT.POT_AT_STOP_LOW]: { label: 'Pension when you stop, low end', basis: TODAY },
  [FACT.POT_AT_STOP_HIGH]: { label: 'Pension when you stop, high end', basis: TODAY },
  [FACT.PAY]: { label: 'Pay', basis: 'a year before tax' },
  [FACT.PAY_IN_TAKE_HOME]: { label: 'From your take-home pay', basis: 'a month' },
  [FACT.PAY_IN_EMPLOYER]: { label: 'From your employer', basis: 'a month' },
  [FACT.PAY_IN_TOTAL]: { label: 'Going in, in all', basis: 'a month' },
  [FACT.PAY_IN_PCT]: { label: 'As a share of your pay', basis: 'a share' },
  [FACT.WANT_INCOME]: { label: 'You want', basis: 'a month after tax' },
  [FACT.WANT_STOP_AGE]: { label: 'From age', basis: 'an age' },
  [FACT.SAVER_VERDICT]: { label: 'Paying in enough?', basis: 'words' },
  [FACT.SAVER_CHANCE]: { label: 'Chance it lasts', basis: 'a chance' },
  [FACT.SAVER_ENOUGH]: { label: 'Enough would be', basis: 'a month' },
  [FACT.SAVER_ENOUGH_PCT]: { label: 'Enough would be', basis: 'a share' },
  [FACT.SAVER_INCOME_AT_STOP]: { label: 'Income when you stop', basis: 'a month after tax' },
  [FACT.LASTS_CHANCE]: { label: 'Chance the money lasts', basis: 'a chance' },
  [FACT.LASTS_FIXED]: { label: 'Lasts to the age named', basis: 'a count of futures' },
  [FACT.RUN_OUT_AGE]: { label: 'If it ran out, at', basis: 'an age' },
  [FACT.LEFT]: { label: 'Left at the end, typically', basis: TODAY },
  [FACT.LEFT_BAD]: { label: 'Left at the end, bad case', basis: TODAY },
  [FACT.LEFT_GOOD]: { label: 'Left at the end, good case', basis: TODAY },
  [FACT.WORST_12]: { label: 'Worst 12 months', basis: TODAY },
  [FACT.YEAR_PRICES]: { label: 'Prices rising', basis: 'a share a year' },
  [FACT.COVERAGE]: { label: "Of the plan's years covered", basis: 'a share' },
  [FACT.LEVEL]: { label: 'Judged at', basis: 'words' },
  [FACT.LASTS_VERDICT]: { label: 'Does it last?', basis: 'words' },
  [FACT.FLOOR_INCOME]: { label: 'Income that comes anyway', basis: 'a year' },
  [FACT.LIVE_LONGER]: { label: 'If you live longer', basis: 'words' },
  [FACT.FOLLOW_TO]: { label: 'Followed to age', basis: 'an age' },
  [FACT.STEP_BEFORE_TAX]: { label: 'Taken', basis: 'a year before tax' },
  [FACT.STEP_MONTH_AFTER_TAX]: { label: 'Reaches your bank', basis: 'a month after tax' },
  [FACT.MONTH_AFTER_TAX]: { label: 'Reaches your bank', basis: 'a month after tax' },
  [FACT.SP_WEEK]: { label: 'State Pension', basis: 'a week' },
  [FACT.SP_YEAR]: { label: 'State Pension', basis: 'a year' },
  [FACT.SP_AGE]: { label: 'State Pension from age', basis: 'an age' },
  [FACT.SP_START]: { label: 'State Pension from', basis: 'a day' },   // the person's own date (step F2)
  [FACT.DB_AMOUNT]: { label: 'Final-salary pension', basis: 'a year' },
  [FACT.DB_AGE]: { label: 'Final-salary pension from age', basis: 'an age' },
  [FACT.LUMP_AMOUNT]: { label: 'Lump sum', basis: TODAY },
  [FACT.LUMP_AGE]: { label: 'Lump sum at age', basis: 'an age' },
  [FACT.SPEND_ESSENTIALS]: { label: 'Essentials', basis: 'a month' },
  [FACT.SPEND_TOTAL]: { label: 'All in', basis: 'a month' },
  [FACT.YEAR_SET_UP]: { label: 'This tax year, as set up', basis: 'a year before tax' },
  [FACT.YEAR_PLAN_SAYS]: { label: 'This tax year, as the plan says', basis: 'a year before tax' },
  [FACT.YEAR_PER_MONTH]: { label: 'This tax year, as set up', basis: 'a month before tax' },
  [FACT.YEAR_TOTAL]: { label: 'This tax year, as set up, in all', basis: 'before tax' },
  [FACT.YEAR_FROM]: { label: 'This tax year, set up from', basis: 'a month' },
  [FACT.YEAR_SET_UP_ON]: { label: 'This tax year, set up on', basis: 'a day' },
  [FACT.MONTH_TAKE]: { label: 'This month, after tax', basis: 'a month after tax' },
  [FACT.MONTH_TAKE_PENSION]: { label: 'This month, from the pension', basis: 'a month before tax' },
  [FACT.MONTH_FROM]: { label: 'Taken from', basis: 'words' },
  [FACT.TAKEN_YEAR]: { label: 'Taken this tax year', basis: 'before tax' },
  [FACT.WAY_NAME]: { label: 'Way of drawing', basis: 'words' },
  [FACT.WAY_COST]: { label: 'What it costs', basis: TODAY },
  [FACT.WAY_EACH_NAME]: { label: 'Way of drawing', basis: 'words' },
  [FACT.WAY_VERDICT]: { label: 'Lasts', basis: 'futures out of 10' },
  [FACT.WAY_LEFT]: { label: 'Typically left', basis: TODAY },
  [FACT.WAY_BAD_LEFT]: { label: 'Bad case (the worst 1 in 10)', basis: TODAY },
  [FACT.WAY_WORST_12]: { label: 'Worst 12 months', basis: TODAY },
  [FACT.WAY_COVERED]: { label: 'Years covered', basis: 'a share' },
  [FACT.WAY_SPENT]: { label: 'Spent over the plan', basis: TODAY },
  [FACT.WAY_BUMPINESS]: { label: 'Bumpiness', basis: 'a share, a year' },
  [FACT.WAY_BOUGHT]: { label: 'Bought', basis: 'words' },
  [FACT.MARKET_GILTS]: { label: 'Priced on', basis: 'words' },
  [FACT.WITHDRAWAL_RATE]: { label: 'Drawn this year', basis: 'a share' },
  [FACT.GILTS_HELD]: { label: 'Gilts held', basis: 'a count' },
  [FACT.MIX_PLAN]: { label: "The plan's mix", basis: 'a share' },
  [FACT.MIX_HELD]: { label: 'What you hold', basis: 'a share' },
  [FACT.HOLDINGS_TOTAL]: { label: 'Held in all', basis: TODAY },
  [FACT.HOLDINGS_WRAPPER]: { label: 'Held', basis: TODAY },
  [FACT.STRESS_CHANCE]: { label: 'This line: the money lasts as long as you do', basis: 'a chance' },
  [FACT.STRESS_FIXED]: { label: 'This line: lasts to the age named', basis: 'a count of futures' },
  [FACT.STRESS_RUNS_OUT]: { label: 'This line: where it runs out', basis: 'ages' },
  [FACT.STRESS_VERDICT]: { label: 'This line', basis: 'words' },
  [FACT.STRESS_CHANGE]: { label: 'What this line changes', basis: 'a share' },
  [FACT.STRESS_FLOOR]: { label: 'If it runs out, still comes in', basis: 'a year after tax' },
  [FACT.MIX_BEST]: { label: 'Lasts best', basis: 'a share' },
  [FACT.PARTNER_CHANCE]: { label: "Your partner's plan lasts", basis: 'a chance' },
  [FACT.HOUSEHOLD_CHANCE]: { label: 'Together, it lasts', basis: 'a chance' }
});

/** The columns of the year tables (src/reading/yearTable.js), one label each, both views (the simple view's copy reads these). */
export const YEAR_COLUMNS = Object.freeze({ year: 'Year', age: 'Age', pension: 'From the pension', state: 'State Pension', otherIncome: 'Other income', tax: 'Tax', net: 'After tax, before the ISA', isa: 'From the ISA', gia: 'From other savings', spendable: 'To spend', isaLeft: 'ISA left', incomeMid: 'Income (middle)', incomeBad: 'Income (1 in 10 bad)', leftMid: 'Left (middle)' });
export const FLOOR_COLUMNS = Object.freeze({ year: 'Year', age: 'Age', shares: 'Shares floor', bonds: 'Bonds floor', cash: 'Cash', diversifiers: 'Gold and trend', reserve: 'Reserve', sharesPct: 'Shares % of the pot', isa: 'ISA', total: 'All floors' });

export function labelOf(id) {
  const p = patternOf(id);
  return p && LABELS[p] ? LABELS[p].label : '';
}
