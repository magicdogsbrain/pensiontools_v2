/**
 * Question D on the rail — "I'm retired. Will it last?" (research/v7/answer-D.md 3; road-to-7.md step 7). Data only.
 * Labels, short labels and the next sentences are in copy/d.js under the same ids.
 *
 * Three steps: the numbers (what you have and what you take a month — one form, the spending on it: a retired person is
 * spending now, so there is no budget step before the first answer), the answer with its three levers (try only), and
 * "Keep this as a plan?". `needs` lists field paths of SCHEMA_D, or 'answer' (a final answer for the inputs as typed). A
 * needed field that does not apply to what is typed (spend.amount under a level) counts as met.
 */
export const QUESTION_D = {
  id: 'd',
  steps: [
    { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
    { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.age', 'you.pot', 'you.taxFreeTaken', 'spend.amount'] },
    // "Keep this as a plan" (research/v7/save-as-plan.md; road-to-7.md step 7): the panel, on a step of its own as well as under the answer.
    { id: 'keep',    optional: true,  built: true,  end: true,  needs: ['answer'] }
  ]
};

/** The ids of the next sentences, in the order they are tried (first match wins). */
export const NEXT_D = ['d.failed', 'd.working', 'd.blank', 'd.fix', 'd.ready', 'd.keep', 'd.yes', 'd.close', 'd.no'];
