/**
 * Question B on the rail (step 4 brief 4.12). Data only.
 * Labels, short labels and the next sentences are in copy/b.js under the same ids.
 * `needs` lists field paths of SCHEMA_B, or 'answer' (a final answer for the inputs as typed). A needed field that does
 * not apply to what is typed (you.payIn.total under "split it up"; spend.amount under a level) counts as met.
 */
export const QUESTION_B = {
  id: 'b',
  steps: [
    { id: 'numbers', optional: false, built: true,  end: false, needs: [] },
    { id: 'answer',  optional: false, built: true,  end: false, needs: ['you.age', 'you.pot', 'you.payIn.total', 'stop.age', 'spend.amount'] },
    { id: 'choices', optional: true,  built: true,  end: false, needs: ['answer'] },
    { id: 'keep',    optional: true,  built: false, end: true,  needs: ['answer'] }
  ]
};

/** The ids of the next sentences, in the order they are tried (first match wins). */
export const NEXT_B = ['b.retired', 'b.failed', 'b.working', 'b.blank', 'b.fix', 'b.ready', 'b.choices', 'b.none', 'b.short', 'b.onCourse'];
