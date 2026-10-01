/**
 * Question C on the rail (V7 build brief 4.7). Data only.
 * Labels, short labels and the next sentences are in copy/c.js under the same ids.
 * `needs` lists field paths of SCHEMA_C, or 'answer' (a final answer for the inputs as typed).
 */
export const QUESTION_C = {
  id: 'c',
  steps: [
    { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
    { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.pot', 'you.age'] },
    { id: 'ways',    optional: true,  built: false, end: false, needs: ['answer'] },
    // "Save this as a plan" (research/v7/save-as-plan.md): the panel, on a step of its own as well as under the answer.
    { id: 'keep',    optional: true,  built: true,  end: true,  needs: ['answer'] }
  ]
};

/** The ids of the next sentences, in the order they are tried (first match wins). */
export const NEXT_C = ['c.failed', 'c.working', 'c.blank', 'c.fix', 'c.ready', 'c.keep', 'c.answered'];
