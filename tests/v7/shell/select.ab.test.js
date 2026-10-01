/**
 * The pure readers for questions A and B (step 4 brief 4.11): needsRun on the optional steps, wantedDetail,
 * isRetired, readyMark's 'partial', and the step states of A and B. C's behaviour is pinned in select.test.js.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import {
  SCHEMAS, STEP_DETAIL, DETAIL_ORDER, currentKey, needsRun, wantedDetail, isRetired, readyMark, stepStates
} from '../../../src/v7/state/select.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { alreadyStopped } from '../../../src/answers/shared/schemaParts.js';
import { fresh, run, set, at, typedA, typedB, typedC, resultA, resultB, answered } from './_open.js';

const extend = (s, q) => reduce(s, { type: A.ANSWER_EXTEND, q, inputsKey: currentKey(s, q) });
const states = (s, q) => Object.fromEntries(stepStates(s, q).map((x) => [x.id, x.state]));

describe('the tables', () => {
  it('SCHEMAS holds the three input lists', () => {
    expect(SCHEMAS).toEqual({ c: SCHEMA_C, a: SCHEMA_A, b: SCHEMA_B });
  });
  it('STEP_DETAIL and DETAIL_ORDER as the brief', () => {
    expect(STEP_DETAIL).toEqual({ a: { answer: 'chart', ages: 'all' }, b: { answer: 'answer', choices: 'grid' } });
    expect(DETAIL_ORDER).toEqual({ a: ['chart', 'all'], b: ['answer', 'grid'] });
  });
});

describe('needsRun and wantedDetail', () => {
  it('the answer step: as C — figures that parse and no answer for them', () => {
    expect(needsRun(typedA(), 'a')).toBe(false);                            // not on the step
    expect(needsRun(at(fresh(), 'a', 'answer'), 'a')).toBe(false);          // nothing typed
    const s = at(typedA(), 'a', 'answer');
    expect(needsRun(s, 'a')).toBe(true);
    expect(wantedDetail(s, 'a')).toBe('chart');
    const done = answered(s, 'a', resultA());
    expect(needsRun(done, 'a')).toBe(false);
    expect(needsRun(reduce(done, set('a', 'you.pot', '1')), 'a')).toBe(true);
    expect(wantedDetail(at(typedB(), 'b', 'answer'), 'b')).toBe('answer');
  });
  it('an optional step with figures and no answer yet: the answer step\'s passes first, at its detail', () => {
    const s = at(typedA(), 'a', 'ages');
    expect(needsRun(s, 'a')).toBe(true);
    expect(wantedDetail(s, 'a')).toBe('chart');
    const b = at(typedB(), 'b', 'choices');
    expect(needsRun(b, 'b')).toBe(true);
    expect(wantedDetail(b, 'b')).toBe('answer');
  });
  it('an optional step with a final answer at a lower detail: one more pass, at the step\'s detail', () => {
    const s = answered(at(typedA(), 'a', 'ages'), 'a', resultA({ detail: 'chart' }));
    expect(needsRun(s, 'a')).toBe(true);
    expect(wantedDetail(s, 'a')).toBe('all');
    const b = answered(at(typedB(), 'b', 'choices'), 'b', resultB({ detail: 'answer' }));
    expect(needsRun(b, 'b')).toBe(true);
    expect(wantedDetail(b, 'b')).toBe('grid');
  });
  it('not while it is extending, nor once the detail is there, nor while the first figure is still on its way', () => {
    const s = answered(at(typedA(), 'a', 'ages'), 'a', resultA({ detail: 'chart' }));
    expect(needsRun(extend(s, 'a'), 'a')).toBe(false);
    const all = answered(at(typedA(), 'a', 'ages'), 'a', resultA({ detail: 'all' }));
    expect(needsRun(all, 'a')).toBe(false);
    expect(needsRun(at(all, 'a', 'answer'), 'a')).toBe(false);             // more than the answer step needs is enough
    expect(needsRun(answered(at(typedA(), 'a', 'ages'), 'a', resultA(), A.ANSWER_FIRST), 'a')).toBe(false);
  });
  it('not after a failure until "try again"', () => {
    const s = at(typedA(), 'a', 'ages');
    const key = currentKey(s, 'a');
    const failed = run(s, { type: A.ANSWER_WORKING, q: 'a', inputsKey: key }, { type: A.ANSWER_FAILED, q: 'a', inputsKey: key });
    expect(needsRun(failed, 'a')).toBe(false);
    expect(needsRun(reduce(failed, { type: A.ANSWER_RETRY, q: 'a' }), 'a')).toBe(true);
  });
  it('never on a step that is not built, or on another question\'s step', () => {
    expect(needsRun(answered(at(typedA(), 'a', 'keep'), 'a', resultA()), 'a')).toBe(false);
    expect(needsRun(at(typedA(), 'b', 'answer'), 'a')).toBe(false);
    expect(needsRun(answered(at(typedC(), 'c', 'ways'), 'c', { status: 'ok', basis: {} }), 'c')).toBe(false);
  });
});

describe('isRetired — the retired view of A and B', () => {
  const retiredA = (age, stop = age) => typedA(fresh(), { age: String(age), stop: String(stop) });
  const retiredB = (age, stop = age) => typedB(fresh(), { age: String(age), stop: String(stop) });

  it('the draft says the person has stopped and is past their State Pension age', () => {
    expect(isRetired(retiredA(70), 'a')).toBe(true);
    expect(isRetired(retiredA(70, 72), 'a')).toBe(false);                  // still working until 72
    expect(isRetired(retiredA(50), 'a')).toBe(false);                      // stopping now, but years before the State Pension
    expect(isRetired(typedA(), 'a')).toBe(false);
  });
  it('agrees with alreadyStopped on the inputs as typed', () => {
    for (const age of [60, 65, 66, 67, 68, 75]) {
      for (const stop of [age, age + 1]) {
        const s = retiredA(age, Math.min(75, stop));
        expect(isRetired(s, 'a'), `${age}/${stop}`).toBe(alreadyStopped({ you: { age }, stop: { age: Math.min(75, stop) } }, s.env.today));
      }
    }
  });
  it('B: a stop at today\'s age breaks B\'s own rule, and still reads as retired (carried from C, say)', () => {
    expect(isRetired(retiredB(70), 'b')).toBe(true);
    expect(isRetired(retiredB(45), 'b')).toBe(false);
  });
  it('"show me ages", nothing typed, and C: never', () => {
    expect(isRetired(run(retiredA(70), set('a', 'stop.kind', 'ages')), 'a')).toBe(false);
    expect(isRetired(fresh(), 'a')).toBe(false);
    expect(isRetired(typedC(fresh(), '250000', '70'), 'c')).toBe(false);
  });
  it('the retired view runs nothing, so the page is ready', () => {
    const s = at(retiredA(70), 'a', 'answer');
    expect(needsRun(s, 'a')).toBe(false);
    expect(readyMark(s)).toEqual({ ready: '1', answer: 'none' });
    expect(needsRun(at(retiredA(70), 'a', 'ages'), 'a')).toBe(false);
  });
});

describe('readyMark — partial', () => {
  it('while an optional step\'s pass is due or running: partial, not ready', () => {
    const s = answered(at(typedA(), 'a', 'ages'), 'a', resultA({ detail: 'chart' }));
    expect(readyMark(s)).toEqual({ ready: '0', answer: 'partial' });
    const ext = extend(s, 'a');
    expect(readyMark(ext)).toEqual({ ready: '0', answer: 'partial' });
    const done = reduce(ext, { type: A.ANSWER_FINAL, q: 'a', inputsKey: ext.answers.a.inputsKey, result: resultA({ detail: 'all' }) });
    expect(readyMark(done)).toEqual({ ready: '1', answer: 'final' });
  });
  it('extending off the optional step (gone back to the answer) is still partial until it lands', () => {
    const ext = at(extend(answered(at(typedB(), 'b', 'choices'), 'b', resultB()), 'b'), 'b', 'answer');
    expect(readyMark(ext)).toEqual({ ready: '0', answer: 'partial' });
  });
  it('the answer step at its own detail is ready as C', () => {
    const s = at(typedA(), 'a', 'answer');
    expect(readyMark(s)).toEqual({ ready: '0', answer: 'none' });
    expect(readyMark(answered(s, 'a', resultA(), A.ANSWER_FIRST))).toEqual({ ready: '0', answer: 'first' });
    expect(readyMark(answered(s, 'a', resultA()))).toEqual({ ready: '1', answer: 'final' });
  });
});

describe('stepStates for A and B', () => {
  it('A: numbers done when its own boxes parse; the spending when there is a figure; the answer when final; ages only once the full detail is there', () => {
    const s = at(typedA(), 'a', 'numbers');
    expect(states(s, 'a')).toEqual({ numbers: 'current', spend: 'done', answer: 'open', ages: 'open', keep: 'open' });
    expect(states(at(typedA(fresh(), { spend: '' }), 'a', 'spend'), 'a')).toEqual({ numbers: 'done', spend: 'current', answer: 'open', ages: 'open', keep: 'open' });
    expect(states(at(typedA(fresh(), { pot: '' }), 'a', 'spend'), 'a')).toMatchObject({ numbers: 'open', spend: 'current' });
    const done = at(answered(s, 'a', resultA({ detail: 'chart' })), 'a', 'answer');
    expect(states(done, 'a')).toEqual({ numbers: 'done', spend: 'done', answer: 'current', ages: 'open', keep: 'open' });
    const all = at(answered(done, 'a', { ...resultA({ detail: 'all' }) }), 'a', 'numbers');
    expect(states(extend(at(done, 'a', 'numbers'), 'a'), 'a').ages).toBe('open');
    const full = reduce(extend(at(done, 'a', 'numbers'), 'a'), { type: A.ANSWER_FINAL, q: 'a', inputsKey: currentKey(done, 'a'), result: resultA({ detail: 'all' }) });
    expect(states(full, 'a')).toEqual({ numbers: 'current', spend: 'done', answer: 'done', ages: 'done', keep: 'open' });
    expect(states(all, 'a').numbers).toBe('current');
  });
  it('B: choices done once the grid is there', () => {
    const s = answered(at(typedB(), 'b', 'answer'), 'b', resultB());
    expect(states(s, 'b')).toEqual({ numbers: 'done', spend: 'done', answer: 'current', choices: 'open', keep: 'open' });
    const ext = extend(s, 'b');
    const full = reduce(ext, { type: A.ANSWER_FINAL, q: 'b', inputsKey: ext.answers.b.inputsKey, result: resultB({ detail: 'grid' }) });
    expect(states(full, 'b')).toEqual({ numbers: 'done', spend: 'done', answer: 'current', choices: 'done', keep: 'open' });
    expect(states(reduce(full, set('b', 'you.pot', '1')), 'b').choices).toBe('open');
  });
});
