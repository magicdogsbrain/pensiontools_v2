/**
 * The plan document's words, by way of drawing (v6 usability audit, problem 5 "wrong in the document", 17 Oct 2026).
 *
 * The document described every plan in Pots & Valves terms ("keeps the pots on their glidepath tracks and applies
 * protection in a downturn") unless it was a contract strategy, and said "the ladder's rungs begin at year 0" in every
 * run-up month — on plans with no ladder. These sentences follow the strategy id the document carries. A document
 * written before the id was kept reads as Pots & Valves, as it always did.
 *
 * Pure: strings in, strings out. No HTML.
 */
import { STRATEGY_IDS } from '../strategies/registry.js';

const S = STRATEGY_IDS;

/** What the Decision tool recommends each month under this way of drawing (section 4 of the document). */
const DECISION_RUN = {
  [S.POTS_AND_VALVES]: 'The recommendation draws to the tax bands, keeps the pots on their glidepath tracks and applies protection in a downturn.',
  [S.BUCKETS_IN_ORDER]: 'The recommendation draws to the tax bands and takes the month from the buckets in order — cash first, then bonds, then shares — with no rebalancing between them.',
  [S.LADDER_AND_RATCHET]: 'The recommendation is the year\'s rung divided over the months left while the base ladder pays; the growth sleeve is left to ride, and when it is ahead of its path the ratchet buys the next rung. Pot floors do not apply.',
  [S.BRIDGE_AND_ENGINE]: 'The recommendation is the year\'s rung (or the cash years) divided over the months left until the bridge age; the engine is left to ride untouched until then. Pot floors do not apply.',
  [S.FLOOR_AND_FLEX]: 'The recommendation is the essentials floor the ladder pays, plus what the flex sleeve can afford this year; nothing is sold to pay the floor. Pot floors do not apply.',
  [S.FLOOR_THE_SCHEDULE]: 'The recommendation is the year\'s rung divided over the months left. Nothing is sold; pot floors and rebalancing do not apply.',
  [S.FLOOR_TO_AGE]: 'The recommendation is the year\'s rung divided over the months left until the age the schedule is bought to; the reserve is left to ride until then. Pot floors do not apply.',
  [S.FULL_IL_GILT]: 'The recommendation is the year\'s rung (or the cash years) divided over the months left. Nothing is sold; pot floors and rebalancing do not apply.',
  [S.GILT_ROTATION]: 'The recommendation is the year\'s rung (or the cash years) divided over the months left, and the rotation watch says whether the pre-agreed escape has been triggered. Nothing else is sold; pot floors and rebalancing do not apply.'
};

/** What the run-up months are, and what begins at year 0 (the "where you are" strip before the plan starts). */
const RUN_UP = {
  [S.POTS_AND_VALVES]: 'Drawn from your SIPP cash; the pots\' tracks and the rules for cutting income begin at year 0.',
  [S.BUCKETS_IN_ORDER]: 'Drawn from your SIPP cash; the buckets are drawn in order from year 0.',
  [S.LADDER_AND_RATCHET]: 'Drawn from your SIPP cash; the base ladder\'s rungs begin at year 0.',
  [S.BRIDGE_AND_ENGINE]: 'Drawn from your SIPP cash; the bridge\'s cash years and rungs begin at year 0.',
  [S.FLOOR_AND_FLEX]: 'Drawn from your SIPP cash; the essentials floor begins at year 0.',
  [S.FLOOR_THE_SCHEDULE]: 'Drawn from your SIPP cash; the ladder\'s rungs begin at year 0.',
  [S.FLOOR_TO_AGE]: 'Drawn from your SIPP cash; the ladder\'s rungs begin at year 0.',
  [S.FULL_IL_GILT]: 'Drawn from your SIPP cash; the ladder\'s cash years and rungs begin at year 0.',
  [S.GILT_ROTATION]: 'Drawn from your SIPP cash; the ladder\'s cash years and rungs begin at year 0.'
};

/** The sentence under "Target mix by plan year" (the strategies that hold a mix rather than a ladder alone). */
const MIX = {
  [S.POTS_AND_VALVES]: 'Cash is held flat; shares and bonds glide inside the growth sleeve',
  [S.BUCKETS_IN_ORDER]: 'The buckets start at this split and are drawn in order — cash, then bonds, then shares — with no rebalancing',
  [S.LADDER_AND_RATCHET]: 'The growth sleeve holds this mix beside the base ladder; the ratchet moves money from the sleeve into new rungs',
  [S.BRIDGE_AND_ENGINE]: 'The engine holds this mix beside the bridge, untouched until the bridge age',
  [S.FLOOR_AND_FLEX]: 'The flex sleeve holds this mix beside the essentials floor',
  [S.FLOOR_TO_AGE]: 'The reserve holds this mix beside the ladder until the age the schedule is bought to'
};

const known = (id) => (id && Object.values(S).includes(id) ? id : S.POTS_AND_VALVES);

export function decisionRunWords(strategyId) { return DECISION_RUN[known(strategyId)]; }
export function runUpWords(strategyId) { return RUN_UP[known(strategyId)]; }
export function mixWords(strategyId, { allocMode = null } = {}) {
  const base = MIX[known(strategyId)] || MIX[S.POTS_AND_VALVES];
  return base + (allocMode === 'funds' ? '. The funds below set the starting split.' : '.');
}

/** "Months before it are the run-up: paid from your SIPP cash (…)" — the bracket only on a plan with cash years. */
export function runUpCashWords(assumptions) {
  const A = assumptions || {};
  return 'Months before it are the run-up: paid from your SIPP cash' + (A.cashYears != null ? ' (the money-market fund the cash years also use)' : '') + '; nothing is sold.';
}
