/**
 * The age each future is followed on to, said for what it is (7.12.0, walkers 1 and 3: "runs out before 104 … before 100"
 * side by side, with nothing saying what 104 was). The "when" line now says first that we follow each future on to that age,
 * then counts the futures that run out before then. Only the words move: every count and age is the same as before.
 *
 * Hand-made figures (no plan, no person): followed on to 103, plan-to age 97; typically 88, the worst 1 in 10 by 84.
 */
import { describe, it, expect } from 'vitest';
import { whenParts } from '../../../src/answers/shared/lastsWords.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { STRESS } from '../../../src/v7/copy/stressPanel.js';

const fill = (t, s) => t.replace(/\{(\w+)\}/g, (m, k) => (k in s ? s[k] : m));

describe('the "when" line says the age each future is followed on to, then counts', () => {
  it('one person', () => {
    const lf = { couple: false, planToAge: 97, weightToAge: 103 };
    expect(partsText(whenParts({ when: { typical: 88, worst: 84, worstLasts: false } }, lf), {}))
      .toBe('We follow each future on to 103. In the futures where the money runs out before then, it typically runs out at 88. In the worst 1 in 10 of all the futures, by 84.');
  });

  it('a couple', () => {
    const lf = { couple: true, planToAge: 100, weightToAge: 103 };
    expect(partsText(whenParts({ when: { typical: 90, worst: 85, worstLasts: false } }, lf), {}))
      .toBe('We follow each future on to when the younger of you is 103. In the futures where the money runs out before then, it typically runs out when the younger of you is 90. In the worst 1 in 10 of all the futures, by the time the younger of you is 85.');
  });

  it('beside As planned, the counts stay with the futures they count', () => {
    const lf = { couple: false, planToAge: 97, weightToAge: 103 };
    const cmp = { count: 211, n: 1000, refCount: 150, ref: { when: { typical: 88, worst: 84, worstLasts: false } } };
    expect(partsText(whenParts({ when: { typical: 90, worst: 82, worstLasts: false } }, lf, cmp), {}))
      .toBe('We follow each future on to 103. In the futures where the money runs out before then (211 of the 1,000; as planned: 150), it typically runs out at 90 (as planned: 88). In the worst 1 in 10 of all the futures, by 82 (as planned: by 84).');
  });

  it('the plan\'s "More about this line" says it the same way', () => {
    const L = STRESS.lines;
    expect(fill(L.when, { weightAge: '103', typical: '88', worst: '84' }))
      .toBe('We follow each future on to 103. In the futures where the money runs out before then, it typically runs out at 88. In the worst 1 in 10 of all the futures, by 84.');
    for (const id of ['whenStillLasts', 'whenRef', 'whenStillLastsRef']) expect(L[id], id).toMatch(/^We follow each future on to \{weightAge\}\. In the futures where the money runs out before then/);
  });
});
