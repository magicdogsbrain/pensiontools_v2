/**
 * answer/extend and the detail an answer holds (step 4 brief 4.11, conflict 43).
 *
 * The answer step is worked out at its default detail (A 'chart', B 'answer') by C's two passes; an optional step
 * that needs more (A's ages → 'all', B's choices → 'grid') asks for one more pass at 1,000: answer/extend, then
 * answer/final. While it runs the status stays 'final' (the headline is on screen) and `extending` is true.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { currentKey } from '../../../src/v7/state/select.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { run, set, typedA, typedB, typedC, resultA, resultB, answered, TODAY } from './_open.js';

const extend = (s, q, key = currentKey(s, q)) => reduce(s, { type: A.ANSWER_EXTEND, q, inputsKey: key });
const final = (s, q, result, key = currentKey(s, q)) => reduce(s, { type: A.ANSWER_FINAL, q, inputsKey: key, result });

describe('the detail an answer holds', () => {
  it('answer/first and answer/final store result.basis.detail', () => {
    const key = currentKey(typedA(), 'a');
    let s = run(typedA(), { type: A.ANSWER_WORKING, q: 'a', inputsKey: key });
    expect(s.answers.a.detail).toBe(null);
    s = reduce(s, { type: A.ANSWER_FIRST, q: 'a', inputsKey: key, result: resultA({ detail: 'chart' }) });
    expect(s.answers.a).toMatchObject({ status: 'first', detail: 'chart', extending: false });
    s = final(s, 'a', resultA({ detail: 'chart' }));
    expect(s.answers.a).toMatchObject({ status: 'final', detail: 'chart', extending: false });
    expect(answered(typedB(), 'b', resultB({ detail: 'answer' })).answers.b.detail).toBe('answer');
  });
  it('a result with no detail stores null', () => {
    expect(answered(typedA(), 'a', { status: 'ok', basis: {} }).answers.a.detail).toBe(null);
  });
  it('C\'s answer keeps C\'s shape: no detail, no extending', () => {
    const s = answered(typedC(), 'c', { status: 'ok', monthly: { careful: 1 }, basis: { detail: 'x' } });
    expect(Object.keys(s.answers.c).sort()).toEqual(['before', 'inputsKey', 'progress', 'result', 'slow', 'status']);
  });
});

describe('answer/extend', () => {
  const done = () => answered(typedA(), 'a', resultA({ detail: 'chart' }));

  it('on a final answer for what is typed: extending, the status and the result stay', () => {
    const before = done();
    const s = extend(before, 'a');
    expect(s.answers.a).toMatchObject({ status: 'final', extending: true, detail: 'chart', inputsKey: before.answers.a.inputsKey });
    expect(s.answers.a.result).toBe(before.answers.a.result);
  });
  it('then answer/final for the key: the bigger result, its detail, extending cleared', () => {
    const s = final(extend(done(), 'a'), 'a', resultA({ detail: 'all' }));
    expect(s.answers.a).toMatchObject({ status: 'final', extending: false, detail: 'all', slow: false, progress: null });
    expect(s.answers.a.result.basis.detail).toBe('all');
    const b = final(extend(answered(typedB(), 'b', resultB()), 'b'), 'b', resultB({ detail: 'grid' }));
    expect(b.answers.b).toMatchObject({ status: 'final', extending: false, detail: 'grid' });
    expect(b.answers.b.result.grid).not.toBe(null);
  });
  it('is ignored for an old key, a run that is not final, or one already extending', () => {
    const s = done();
    expect(extend(s, 'a', 'old')).toBe(s);
    expect(extend(s, 'a', null)).toBe(s);
    const working = reduce(typedA(), { type: A.ANSWER_WORKING, q: 'a', inputsKey: currentKey(typedA(), 'a') });
    expect(extend(working, 'a')).toBe(working);
    const first = answered(typedA(), 'a', resultA(), A.ANSWER_FIRST);
    expect(extend(first, 'a')).toBe(first);
    const ext = extend(s, 'a');
    expect(extend(ext, 'a')).toBe(ext);
  });
  it('C has no optional pass: refused (throws in the test build, ignored when published)', () => {
    const c = answered(typedC(), 'c', { status: 'ok', monthly: { careful: 1 }, basis: {} });
    expect(() => extend(c, 'c')).toThrow();
    const prod = initialState({ today: TODAY });
    expect(reduce(prod, { type: A.ANSWER_EXTEND, q: 'c', inputsKey: 'K' })).toBe(prod);
    expect(() => reduce(c, { type: A.ANSWER_EXTEND, q: 'z', inputsKey: 'K' })).toThrow();
  });
  it('while extending: progress and "slow" reach the state; a first figure never does', () => {
    let s = extend(done(), 'a');
    const key = s.answers.a.inputsKey;
    s = reduce(s, { type: A.ANSWER_PROGRESS, q: 'a', inputsKey: key, done: 300, total: 1000 });
    expect(s.answers.a.progress).toEqual({ done: 300, total: 1000 });
    s = reduce(s, { type: A.ANSWER_SLOW, q: 'a' });
    expect(s.answers.a.slow).toBe(true);
    expect(reduce(s, { type: A.ANSWER_FIRST, q: 'a', inputsKey: key, result: resultA({ detail: 'all' }) })).toBe(s);
  });
  it('a stale answer/final while extending never reaches the state', () => {
    const s = extend(done(), 'a');
    expect(final(s, 'a', resultA({ detail: 'all' }), 'old')).toBe(s);
  });
  it('a final answer that is not extending is not replaced by another final', () => {
    const s = done();
    expect(final(s, 'a', resultA({ detail: 'all' }))).toBe(s);
  });
  it('a change mid-extend: answer/working ends it, and the old final never lands', () => {
    const ext = extend(done(), 'a');
    const oldKey = ext.answers.a.inputsKey;
    let s = reduce(ext, set('a', 'you.pot', '300,000'));
    const newKey = currentKey(s, 'a');
    s = reduce(s, { type: A.ANSWER_WORKING, q: 'a', inputsKey: newKey });
    expect(s.answers.a).toMatchObject({ status: 'working', extending: false, inputsKey: newKey });
    expect(final(s, 'a', resultA({ detail: 'all' }), oldKey)).toBe(s);
  });
  it('a failed extension: failed, extending cleared; "try again" starts over', () => {
    const ext = extend(done(), 'a');
    let s = reduce(ext, { type: A.ANSWER_FAILED, q: 'a', inputsKey: ext.answers.a.inputsKey });
    expect(s.answers.a).toMatchObject({ status: 'failed', extending: false });
    expect(s.draft).toBe(ext.draft);
    s = reduce(s, { type: A.ANSWER_RETRY, q: 'a' });
    expect(s.answers.a).toMatchObject({ status: 'idle', inputsKey: null, extending: false });
    expect(reduce(ext, { type: A.ANSWER_FAILED, q: 'a', inputsKey: 'old' })).toBe(ext);
  });
  it('draft/reset empties the answer, detail and extending included', () => {
    const s = reduce(extend(done(), 'a'), { type: A.DRAFT_RESET, q: 'a' });
    expect(s.answers.a).toEqual({ status: 'idle', inputsKey: null, result: null, before: null, progress: null, slow: false, detail: null, extending: false });
  });
  it('the state survives JSON while extending', () => {
    const s = extend(done(), 'a');
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
  });
});
