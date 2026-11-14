/**
 * 7.9.0 "Try the bad years" under C's and D's answers: the time the strip takes at the final answer's 1,000 futures (the build
 * spec's §1.4: the strip ≤ 2.5 s on C and D, idle). In plain Node, the faster of two tries — the machine is shared, so a try
 * under load is not the strip's time. Fictional households (the named states): C from now, C with a take named, C on the
 * lives (paying in until a later age), D alone and D as a couple.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runStressStrip } from '../../../src/answers/shared/stressStrip.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerD } from '../../../src/answers/d/answer.js';
import { stripAmountOf } from '../../../src/v7/state/select.js';

const STRIP_BUDGET_MS = 2_500;
const stateOf = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, name + '.json'), 'utf8'));

describe('the strip\'s time at 1,000 futures (≤ 2.5 s)', () => {
  it.each([['c', 'answer-F1'], ['c', 'answer-take'], ['c', 'answer-paying-in'], ['d', 'answer-D1'], ['d', 'answer-D2-couple']])('%s %s', (q, name) => {
    const r = stateOf(q, name).answers[q].result;
    const env = { today: r.basis.today, futures: 1000, seed: r.basis.seed ?? 0 };
    const perMonth = stripAmountOf(q, (q === 'c' ? answerC : answerD)(r.inputs, env));
    const times = [];
    for (let k = 0; k < 2; k++) {
      const t0 = performance.now();
      const s = runStressStrip(q, r.inputs, env, { perMonth });
      times.push(performance.now() - t0);
      expect(s.rows).toHaveLength(5);
    }
    const best = Math.min(...times);
    console.log(`strip ${q}/${name}: ${Math.round(best)} ms (tries ${times.map((t) => Math.round(t)).join(', ')})`);
    expect(best).toBeLessThanOrEqual(STRIP_BUDGET_MS);
  }, 60_000);
});
