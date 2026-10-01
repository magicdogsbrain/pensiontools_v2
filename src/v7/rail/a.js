/**
 * Question A on the rail (step 4 brief 4.12). Data only.
 * Labels, short labels and the next sentences are in copy/a.js under the same ids.
 * `needs` lists field paths of SCHEMA_A, or 'answer' (a final answer for the inputs as typed). A needed field that does
 * not apply to what is typed (spend.amount under a level) counts as met.
 */
export const QUESTION_A = {
  id: 'a',
  steps: [
    { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
    { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.age', 'you.pot', 'stop.age', 'spend.amount'] },
    { id: 'ages',    optional: true,  built: true,  end: false, needs: ['answer'] },
    { id: 'keep',    optional: true,  built: false, end: true,  needs: ['answer'] }
  ]
};

/** The ids of the next sentences, in the order they are tried (first match wins). */
export const NEXT_A = ['a.retired', 'a.failed', 'a.working', 'a.blank', 'a.fix', 'a.ready', 'a.no', 'a.close', 'a.yes', 'a.ages', 'a.ages.none'];
