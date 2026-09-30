/**
 * The pure readers (V7 build brief 4.5) and the inputs key.
 */
import { describe, it, expect } from 'vitest';
import { parsedDraft, currentKey, isCurrent, errorsToShow, stepStates, needsRun, readyMark } from '../../../src/v7/state/select.js';
import { inputsKey, stableText } from '../../../src/v7/state/inputsKey.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { fresh, run, set, typed, onAnswer, result, route } from './_shell.js';

const touch = (path) => ({ type: A.DRAFT_TOUCH, q: 'c', path });
const answered = (s, kind = A.ANSWER_FINAL) => {
  const key = currentKey(s, 'c');
  return run(s, { type: A.ANSWER_WORKING, q: 'c', inputsKey: key }, { type: kind, q: 'c', inputsKey: key, result: result() });
};

describe('inputsKey', () => {
  const env = { today: '2026-09-30', appVersion: '6.16.0' };
  it('does not depend on the order of the keys', () => {
    expect(inputsKey({ a: 1, b: { c: 2, d: [1, { x: 1, y: 2 }] } }, env)).toBe(inputsKey({ b: { d: [1, { y: 2, x: 1 }], c: 2 }, a: 1 }, env));
  });
  it('changes with any value, with the date and with the version', () => {
    const base = inputsKey({ you: { pot: 250000, age: 58 } }, env);
    expect(inputsKey({ you: { pot: 250001, age: 58 } }, env)).not.toBe(base);
    expect(inputsKey({ you: { pot: 250000, age: 58 } }, { ...env, today: '2026-10-01' })).not.toBe(base);
    expect(inputsKey({ you: { pot: 250000, age: 58 } }, { ...env, appVersion: '6.16.1' })).not.toBe(base);
  });
  it('does not include the number of futures: the first and final passes share a key', () => {
    const inputs = { you: { pot: 1 } };
    expect(inputsKey(inputs, { ...env, futures: 100 })).toBe(inputsKey(inputs, { ...env, futures: 1000 }));
  });
  it('tells null from nought from nothing typed', () => {
    expect(stableText({ take: null })).not.toBe(stableText({ take: 0 }));
    expect(stableText({ a: undefined, b: 1 })).toBe(stableText({ b: 1 }));
    expect(stableText({ a: '1' })).not.toBe(stableText({ a: 1 }));
  });
});

describe('parsedDraft, currentKey, isCurrent', () => {
  it('nothing typed: not ok, and no key', () => {
    const s = fresh();
    expect(parsedDraft(s, 'c').ok).toBe(false);
    expect(parsedDraft(s, 'c').errors).toMatchObject({ 'you.pot': 'required', 'you.age': 'required' });
    expect(currentKey(s, 'c')).toBe(null);
    expect(isCurrent(s, 'c')).toBe(false);
  });
  it('two figures typed: ok, defaults filled in, a key', () => {
    const s = typed('£250,000', '58');
    const p = parsedDraft(s, 'c');
    expect(p.ok).toBe(true);
    expect(p.inputs).toMatchObject({ household: 'single', you: { pot: 250000, age: 58 }, risk: 'balanced', endAge: 95, take: null });
    expect(currentKey(s, 'c')).toBe(inputsKey(p.inputs, s.env));
  });
  it('the same figures typed another way give the same key', () => {
    expect(currentKey(typed('250000', '58'), 'c')).toBe(currentKey(typed('£250,000', ' 58 '), 'c'));
    expect(currentKey(typed('250001', '58'), 'c')).not.toBe(currentKey(typed('250000', '58'), 'c'));
  });
  it('the key follows the date', () => {
    const s = typed();
    const later = reduce(s, { type: A.ENV_SET, patch: { today: '2026-10-01' } });
    expect(currentKey(later, 'c')).not.toBe(currentKey(s, 'c'));
  });
  it('an answer is current only while what is typed is what it was worked out from', () => {
    const s = answered(typed());
    expect(isCurrent(s, 'c')).toBe(true);
    const changed = reduce(s, set('you.pot', '260000'));
    expect(isCurrent(changed, 'c')).toBe(false);
    expect(isCurrent(reduce(changed, set('you.pot', '250,000')), 'c')).toBe(true);
    expect(isCurrent(reduce(s, set('you.age', '')), 'c')).toBe(false);
  });
  it('a question that does not exist has no draft', () => {
    expect(parsedDraft(fresh(), 'z').ok).toBe(false);
    expect(currentKey(fresh(), 'z')).toBe(null);
  });
  it('reading twice gives the same thing, and never changes the state', () => {
    const s = typed();
    const copy = JSON.stringify(s);
    expect(parsedDraft(s, 'c')).toEqual(parsedDraft(s, 'c'));
    expect(JSON.stringify(s)).toBe(copy);
  });
});

describe('errorsToShow', () => {
  it('nothing until a field has been left', () => {
    expect(errorsToShow(fresh(), 'c')).toEqual({});
    expect(errorsToShow(reduce(fresh(), set('you.pot', 'abc')), 'c')).toEqual({});
  });
  it('only the fields that have been left', () => {
    const s = run(fresh(), set('you.pot', 'abc'), touch('you.pot'));
    expect(errorsToShow(s, 'c')).toEqual({ 'you.pot': 'notANumber' });
  });
  it('all of them once "Show what it pays" has been pressed', () => {
    const s = run(fresh(), set('you.pot', '20000000'), { type: A.DRAFT_ASK, q: 'c' });
    expect(errorsToShow(s, 'c')).toEqual({ 'you.pot': 'tooHigh', 'you.age': 'required' });
  });
  it('nothing when the draft is fine', () => {
    expect(errorsToShow(reduce(typed(), { type: A.DRAFT_ASK, q: 'c' }), 'c')).toEqual({});
  });

  describe('fields that come onto the form after "Show what it pays" was pressed (Wendy: "+ Add a partner" went red at once)', () => {
    const asked = reduce(typed(), { type: A.DRAFT_ASK, q: 'c' });
    const withPartner = reduce(asked, set('household', 'couple'));

    it('the partner\'s empty age is a problem for the answer, but is not shown until it has been left', () => {
      expect(parsedDraft(withPartner, 'c').errors).toEqual({ 'partner.age': 'required' });
      expect(withPartner.draft.c.asked).toBe(true);
      expect(withPartner.draft.c.revealed).toContain('partner.age');
      expect(errorsToShow(withPartner, 'c')).toEqual({});
    });
    it('leaving the box shows its error; so does pressing the button again', () => {
      expect(errorsToShow(reduce(withPartner, touch('partner.age')), 'c')).toEqual({ 'partner.age': 'required' });
      const again = reduce(withPartner, { type: A.DRAFT_ASK, q: 'c' });
      expect(again.draft.c.revealed).toEqual([]);
      expect(errorsToShow(again, 'c')).toEqual({ 'partner.age': 'required' });
    });
    it('a field that was on the form when the button was pressed still shows its error at once', () => {
      const s = reduce(withPartner, set('you.age', ''));
      expect(errorsToShow(s, 'c')).toEqual({ 'you.age': 'required' });
    });
    it('a choice made before the button was pressed reveals nothing', () => {
      const s = reduce(reduce(typed(), set('household', 'couple')), { type: A.DRAFT_ASK, q: 'c' });
      expect(s.draft.c.revealed).toEqual([]);
      expect(errorsToShow(s, 'c')).toEqual({ 'partner.age': 'required' });
    });
    it('"Remove" then "Add" again: still quiet until left', () => {
      const s = run(withPartner, set('household', 'single'), set('household', 'couple'));
      expect(errorsToShow(s, 'c')).toEqual({});
    });
    it('the forecast box opened after the ask is quiet too; a plain figure typed into it is not', () => {
      const s = reduce(asked, set('you.statePension.kind', 'forecast'));
      expect(errorsToShow(s, 'c')).toEqual({});
      expect(errorsToShow(reduce(s, set('you.statePension.yearly', 'lots')), 'c')).toEqual({});   // typing, not yet left
      expect(errorsToShow(run(s, set('you.statePension.yearly', 'lots'), touch('you.statePension.yearly')), 'c')).toEqual({ 'you.statePension.yearly': 'notANumber' });
    });
    it('a state drawn without the list (an older draft) behaves as before', () => {
      const s = JSON.parse(JSON.stringify(reduce(typed('', '58'), { type: A.DRAFT_ASK, q: 'c' })));
      delete s.draft.c.revealed;
      expect(errorsToShow(s, 'c')).toEqual({ 'you.pot': 'required' });
    });
  });
});

describe('stepStates', () => {
  const states = (s) => Object.fromEntries(stepStates(s, 'c').map((x) => [x.id, x.state]));
  it('nothing entered, on the numbers step', () => {
    const s = reduce(fresh(), { type: A.ROUTE_SET, route: route('step', 'c', 'numbers') });
    expect(states(s)).toEqual({ numbers: 'current', answer: 'open', ways: 'open', keep: 'open' });
  });
  it('figures typed, on the answer step, answer final', () => {
    const s = answered(onAnswer(typed()));
    expect(states(s)).toEqual({ numbers: 'done', answer: 'current', ways: 'open', keep: 'open' });
    const back = reduce(s, { type: A.ROUTE_SET, route: route('step', 'c', 'numbers') });
    expect(states(back)).toEqual({ numbers: 'current', answer: 'done', ways: 'open', keep: 'open' });
  });
  it('an answer for other figures is not "done"', () => {
    const s = reduce(answered(onAnswer(typed())), { type: A.ROUTE_SET, route: route('step', 'c', 'ways') });
    expect(states(s).answer).toBe('done');
    expect(states(reduce(s, set('you.pot', '1'))).answer).toBe('open');
  });
  it('a first figure is not "done" yet', () => {
    const s = reduce(answered(onAnswer(typed()), A.ANSWER_FIRST), { type: A.ROUTE_SET, route: route('step', 'c', 'numbers') });
    expect(states(s).answer).toBe('open');
  });
  it('off the question there is no current step', () => {
    expect(Object.values(states(fresh()))).not.toContain('current');
  });
});

describe('needsRun and the ready mark', () => {
  it('nothing to run away from the answer step, or when the draft does not parse', () => {
    expect(needsRun(typed(), 'c')).toBe(false);
    expect(needsRun(onAnswer(fresh()), 'c')).toBe(false);
    expect(readyMark(fresh())).toEqual({ ready: '1', answer: 'none' });
    expect(readyMark(onAnswer(fresh()))).toEqual({ ready: '1', answer: 'none' });
  });
  it('on the answer step with figures and no answer for them: a run is needed, so the page is not ready', () => {
    const s = onAnswer(typed());
    expect(needsRun(s, 'c')).toBe(true);
    expect(readyMark(s)).toEqual({ ready: '0', answer: 'none' });
  });
  it('working → first → final', () => {
    const s = onAnswer(typed());
    const key = currentKey(s, 'c');
    const w = reduce(s, { type: A.ANSWER_WORKING, q: 'c', inputsKey: key });
    expect(needsRun(w, 'c')).toBe(false);
    expect(readyMark(w)).toEqual({ ready: '0', answer: 'none' });
    const f = reduce(w, { type: A.ANSWER_FIRST, q: 'c', inputsKey: key, result: result() });
    expect(readyMark(f)).toEqual({ ready: '0', answer: 'first' });
    const done = reduce(f, { type: A.ANSWER_FINAL, q: 'c', inputsKey: key, result: result() });
    expect(needsRun(done, 'c')).toBe(false);
    expect(readyMark(done)).toEqual({ ready: '1', answer: 'final' });
  });
  it('a figure changed on the answer step: not ready until the new answer is final', () => {
    const s = reduce(answered(onAnswer(typed())), set('you.pot', '300000'));
    expect(needsRun(s, 'c')).toBe(true);
    expect(readyMark(s).ready).toBe('0');
  });
  it('a failed run is not run again by itself; "try again" asks for one', () => {
    const s = onAnswer(typed());
    const key = currentKey(s, 'c');
    const failed = run(s, { type: A.ANSWER_WORKING, q: 'c', inputsKey: key }, { type: A.ANSWER_FAILED, q: 'c', inputsKey: key });
    expect(needsRun(failed, 'c')).toBe(false);
    expect(readyMark(failed)).toEqual({ ready: '1', answer: 'none' });
    expect(needsRun(reduce(failed, { type: A.ANSWER_RETRY, q: 'c' }), 'c')).toBe(true);
    expect(needsRun(reduce(failed, set('you.pot', '1')), 'c')).toBe(true);
  });
});
