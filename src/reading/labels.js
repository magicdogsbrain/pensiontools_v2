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

export const LABELS = Object.freeze({
  [FACT.STAGE]: { label: 'Stage', basis: 'words' },
  [FACT.PLAN_NAME]: { label: 'Plan', basis: 'words' },
  [FACT.STOP_MONTH]: { label: 'You stop work in', basis: 'a month' },
  [FACT.YEARS_TO_GO]: { label: 'To go', basis: 'years and months' },
  [FACT.AGE_TODAY]: { label: 'Age today', basis: 'an age' },
  [FACT.END_AGE]: { label: 'The plan runs to age', basis: 'an age' },
  [FACT.LOCKED]: { label: 'Locked', basis: 'words' },
  [FACT.LOCK_DATE]: { label: 'Locked on', basis: 'a day' },
  [FACT.DUE_NEXT]: { label: 'Next', basis: 'words' },
  [FACT.POT_TODAY]: { label: 'Pension today', basis: TODAY },
  [FACT.ISA_TODAY]: { label: 'ISA today', basis: TODAY },
  [FACT.GIA_TODAY]: { label: 'General account today', basis: TODAY },
  [FACT.CASH_TODAY]: { label: 'Cash today', basis: TODAY },
  [FACT.POT_AGAINST_PLAN]: { label: 'Your pot, against the plan', basis: "the prices the plan's figures are in" },
  [FACT.POT_AT_STOP]: { label: 'Pension when you stop, middle case', basis: TODAY },
  [FACT.POT_AT_STOP_LOW]: { label: 'Pension when you stop, bad case', basis: TODAY },
  [FACT.POT_AT_STOP_HIGH]: { label: 'Pension when you stop, good case', basis: TODAY },
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
  [FACT.SP_START]: { label: 'State Pension from', basis: 'a tax year' },
  [FACT.DB_AMOUNT]: { label: 'Final-salary pension', basis: 'a year' },
  [FACT.DB_AGE]: { label: 'Final-salary pension from age', basis: 'an age' },
  [FACT.LUMP_AMOUNT]: { label: 'Lump sum', basis: TODAY },
  [FACT.LUMP_AGE]: { label: 'Lump sum at age', basis: 'an age' },
  [FACT.SPEND_ESSENTIALS]: { label: 'Essentials', basis: 'a month' },
  [FACT.SPEND_TOTAL]: { label: 'All in', basis: 'a month' },
  [FACT.YEAR_SET_UP]: { label: 'This tax year, as set up', basis: 'a year before tax' },
  [FACT.YEAR_PLAN_SAYS]: { label: 'This tax year, as the plan says', basis: 'a year before tax' },
  [FACT.MONTH_TAKE]: { label: 'This month, after tax', basis: 'a month after tax' },
  [FACT.MONTH_TAKE_PENSION]: { label: 'This month, from the pension', basis: 'a month before tax' },
  [FACT.MONTH_FROM]: { label: 'Taken from', basis: 'words' },
  [FACT.TAKEN_YEAR]: { label: 'Taken this tax year', basis: 'before tax' },
  [FACT.WAY_NAME]: { label: 'Way of drawing', basis: 'words' },
  [FACT.WAY_COST]: { label: 'What it costs', basis: TODAY },
  [FACT.MARKET_GILTS]: { label: 'Priced on', basis: 'words' },
  [FACT.WITHDRAWAL_RATE]: { label: 'Drawn this year', basis: 'a share' },
  [FACT.GILTS_HELD]: { label: 'Gilts held', basis: 'a count' },
  [FACT.MIX_PLAN]: { label: "The plan's mix", basis: 'a share' },
  [FACT.MIX_HELD]: { label: 'What you hold', basis: 'a share' },
  [FACT.HOLDINGS_TOTAL]: { label: 'Held in all', basis: TODAY },
  [FACT.HOLDINGS_WRAPPER]: { label: 'Held', basis: TODAY },
  [FACT.PARTNER_CHANCE]: { label: "Your partner's plan lasts", basis: 'a chance' },
  [FACT.HOUSEHOLD_CHANCE]: { label: 'Together, it lasts', basis: 'a chance' }
});

export function labelOf(id) {
  const p = patternOf(id);
  return p && LABELS[p] ? LABELS[p].label : '';
}
