/**
 * How many futures, and which, every run of a question takes in both views (lead4.md R6): the same number and the same
 * seed for the same question, and only the full run is ever shown as the figure (both views say they are working it out
 * until it lands). Data only.
 *
 *   RUN_FUTURES   the futures of a figure: 1,000
 *   RUN_SEED      the published seed: 0
 *   SAVER_RUN     the saver's verdict ("Am I on course?", What you pay in, the home of a plan still saving, the headline
 *                 of "Does it last?" while saving): question B on the plan's figures, one pass at RUN_FUTURES
 */
export const RUN_FUTURES = 1000;
export const RUN_SEED = 0;
export const SAVER_RUN = Object.freeze({ futures: RUN_FUTURES, seed: RUN_SEED, trace: false, detail: 'answer' });

/**
 * "When could I stop?" (lead4.md D11): answer A's whole-life function on the plan's figures, "show me ages" with every age
 * (A's ages step, detail 'all'), one pass at RUN_FUTURES, in both views (src/reading/whenStop.js).
 */
export const WHEN_STOP_RUN = Object.freeze({ futures: RUN_FUTURES, seed: RUN_SEED, trace: false, detail: 'all' });
