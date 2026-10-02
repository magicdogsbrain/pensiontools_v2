/**
 * The reducer with A, B and C open (step 4 brief 4.11): the draft actions on A's and B's lists, state/replace of a
 * three-question state, and any sequence of actions — the new ones included — over the three questions: the state
 * survives JSON, plan and session never change, and a result only ever comes from the key it is filed under.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import fc from 'fast-check';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A, ACTION_TYPES, OPENABLE } from '../../../src/v7/state/actions.js';
import { CARRY } from '../../../src/v7/state/carry.js';
import { SCHEMAS, parsedDraft, currentKey } from '../../../src/v7/state/select.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { fresh, run, set, route, typedA, typedB, resultA, resultB, answered, TODAY } from './_open.js';

const Q = ['a', 'b', 'c'];

describe('the actions', () => {
  it('draft/carry and answer/extend are actions the reducer knows', () => {
    expect(A.DRAFT_CARRY).toBe('draft/carry');
    expect(A.ANSWER_EXTEND).toBe('answer/extend');
    expect(ACTION_TYPES).toContain('draft/carry');
    expect(ACTION_TYPES).toContain('answer/extend');
  });
  it('every field of A\'s and B\'s lists can be set; one that is not on the list is refused', () => {
    for (const q of ['a', 'b']) {
      for (const f of SCHEMAS[q].fields) {
        if (f.type === 'steps') continue;                                    // the spending shape's steps: shape/* (below)
        const v = f.type === 'yesNo' ? true : f.type === 'choice' ? f.options[0] : '1';
        expect(reduce(fresh(), set(q, f.path, v)).draft[q].values[f.path]).toBe(v);
      }
      expect(() => reduce(fresh(), set(q, 'take', '1'))).toThrow();          // C's field, not A's or B's
    }
    expect(() => reduce(fresh(), set('b', 'partTime.has', true))).toThrow(); // A's, not B's
  });
  it('draft/ask on A or B moves to that question\'s answer step when the draft parses', () => {
    expect(reduce(typedA(), { type: A.DRAFT_ASK, q: 'a' }).route).toEqual(route('step', 'a', 'answer'));
    expect(reduce(typedB(), { type: A.DRAFT_ASK, q: 'b' }).route).toEqual(route('step', 'b', 'answer'));
    const half = reduce(fresh(), set('b', 'you.age', '45'));
    expect(reduce(half, { type: A.DRAFT_ASK, q: 'b' }).route.screen).toBe('front');
  });
  it('state/replace draws a three-question state, each question\'s own shape filled in', () => {
    const wanted = run(answered(typedA(), 'a', resultA()), { type: A.DRAFT_CARRY, from: 'a', to: 'b' });
    const s = reduce(fresh(), { type: A.STATE_REPLACE, state: wanted });
    expect(s).toEqual(wanted);
    const partial = JSON.parse(JSON.stringify(wanted));
    delete partial.draft.b;
    delete partial.answers.a.detail;
    delete partial.draft.a.carriedFrom;
    const t = reduce(fresh(), { type: A.STATE_REPLACE, state: partial });
    expect(t.draft.b).toEqual({ values: {}, touched: [], asked: false, revealed: [], carriedFrom: null, spendHow: null, skipNoted: false });
    expect(t.answers.a.detail).toBe(null);
    expect(t.draft.a.carriedFrom).toBe(null);
    const prod = initialState({ today: TODAY });
    expect(reduce(prod, { type: A.STATE_REPLACE, state: wanted })).toBe(prod);
  });
});

// ---- any sequence of actions over the three questions ------------------------------------------------------------

const typed = fc.oneof(fc.constantFrom('', '250,000', '£1', 'abc', '45', '50', '58', '60', '67', '70', '0', '700', '2,000', '0.5%', 'couple', 'single', 'amount', 'level', 'age', 'ages', 'moderate'), fc.boolean());
const key = fc.constantFrom('K1', 'K2', null, 'NOW');
const question = fc.constantFrom(...Q);
const fieldOf = question.chain((q) => fc.constantFrom(...SCHEMAS[q].fields.filter((f) => f.type !== 'steps').map((f) => f.path)).map((path) => [q, path]));
const anyRoute = fc.constantFrom(route('front'), route('step', 'a', 'numbers'), route('step', 'a', 'spend'), route('step', 'a', 'answer'), route('step', 'a', 'ages'),
  route('step', 'a', 'keep'), route('step', 'b', 'spend'), route('step', 'b', 'answer'), route('step', 'b', 'choices'), route('step', 'c', 'answer'), route('step', 'c', 'keep'),
  route('soon', 'a'), route('soon', 'd'));
const saver = fc.constantFrom('a', 'b');
const lineId = fc.constantFrom('l1', 'l2', 'l9', 'l38', 'l40', 'l99');
const oneOffId = fc.constantFrom('o1', 'o4', 'o5', 'o9');
const budgetText = fc.constantFrom('', '150', '£1,200', '11.99+8.99', 'abc', '-5', '2031', '8', 'New boiler');
const resultFor = (q, n, detail) => (q === 'a' ? resultA({ detail: detail || 'chart', middling: n }) : q === 'b' ? resultB({ detail: detail || 'answer', careful: n }) : { status: 'ok', monthly: { careful: n }, basis: {} });
const carries = Object.keys(CARRY).map((k) => k.split('→'));

const anyAction = fc.oneof(
  anyRoute.map((r) => ({ type: A.ROUTE_SET, route: r })),
  fc.tuple(fieldOf, typed).map(([[q, path], value]) => set(q, path, value)),
  fc.constant('fillA'), fc.constant('fillB'),
  fieldOf.map(([q, path]) => ({ type: A.DRAFT_TOUCH, q, path })),
  question.map((q) => ({ type: A.DRAFT_ASK, q })),
  question.map((q) => ({ type: A.DRAFT_RESET, q })),
  fc.constantFrom(...carries).map(([from, to]) => ({ type: A.DRAFT_CARRY, from, to })),
  fc.tuple(question, key).map(([q, inputsKey]) => ({ type: A.ANSWER_WORKING, q, inputsKey })),
  fc.tuple(question, key).map(([q, inputsKey]) => ({ type: A.ANSWER_PROGRESS, q, inputsKey, done: 3, total: 100 })),
  fc.tuple(question, key, fc.integer({ min: 0, max: 900000 })).map(([q, inputsKey, n]) => ({ type: A.ANSWER_FIRST, q, inputsKey, result: resultFor(q, n) })),
  fc.tuple(question, key, fc.integer({ min: 0, max: 900000 }), fc.constantFrom(null, 'all', 'grid')).map(([q, inputsKey, n, d]) => ({ type: A.ANSWER_FINAL, q, inputsKey, result: resultFor(q, n, d) })),
  fc.tuple(fc.constantFrom('a', 'b'), key).map(([q, inputsKey]) => ({ type: A.ANSWER_EXTEND, q, inputsKey })),
  fc.tuple(question, key).map(([q, inputsKey]) => ({ type: A.ANSWER_FAILED, q, inputsKey })),
  question.map((q) => ({ type: A.ANSWER_SLOW, q })),
  question.map((q) => ({ type: A.ANSWER_RETRY, q })),
  fc.constantFrom(...OPENABLE).map((id) => ({ type: A.UI_TOGGLE, id })),
  fc.boolean().map((open) => ({ type: A.UI_RAIL, open })),
  fc.boolean().map((online) => ({ type: A.UI_ONLINE, online })),
  fc.constantFrom('2026-09-30', '2028-04-06').map((today) => ({ type: A.ENV_SET, patch: { today } })),
  fc.constant(null).map(() => ({ type: A.STATE_REPLACE, state: { ...fresh(), plan: { id: 'x' }, session: { kind: 'user', uid: 'u' } } })),
  // the budget step (budget-step.md) and "Save this as a plan" (save-as-plan.md)
  saver.map((q) => ({ type: A.DRAFT_ONWARD, q })),
  fc.tuple(saver, fc.constantFrom('lines', 'one')).map(([q, how]) => ({ type: A.SPEND_HOW, q, how })),
  fc.tuple(lineId, fc.constantFrom('amount', 'period', 'essential', 'label'), fc.oneof(budgetText, fc.constantFrom('mo', 'yr'), fc.boolean()))
    .map(([id, field, value]) => ({ type: A.BUDGET_LINE, id, field, value })),
  fc.constantFrom('home', 'bills', 'food', 'other').map((heading) => ({ type: A.BUDGET_ADD, heading })),
  lineId.map((id) => ({ type: A.BUDGET_REMOVE, id })),
  fc.tuple(oneOffId, fc.constantFrom('label', 'amount', 'year', 'everyYears'), budgetText).map(([id, field, value]) => ({ type: A.BUDGET_ONE_OFF, id, field, value })),
  fc.constant({ type: A.BUDGET_ADD_ONE_OFF }),
  oneOffId.map((id) => ({ type: A.BUDGET_REMOVE_ONE_OFF, id })),
  fc.tuple(fc.oneof(lineId, oneOffId), fc.constantFrom('amount', 'label', 'year')).map(([id, field]) => ({ type: A.BUDGET_TOUCH, id, field })),
  saver.map((q) => ({ type: A.BUDGET_USE, q })),
  fc.tuple(question, fc.constantFrom('', 'Stop at 60', 'x'.repeat(70))).map(([q, value]) => ({ type: A.KEEP_NAME, q, value })),
  question.map((q) => ({ type: A.KEEP_SAVE, q })),
  question.map((q) => ({ type: A.KEEP_SENT, q, name: 'Stop at 60', createdAt: '2026-09-30T08:00:00.000Z' })),
  fc.tuple(question, fc.constantFrom('storage', 'notReady')).map(([q, problem]) => ({ type: A.KEEP_FAILED, q, problem })),
  fc.tuple(question, fc.constantFrom('taken', 'waiting', 'gone', 'declined', 'notMade', 'unknown'), fc.constantFrom(null, 'Stop at 60 (2)'))
    .map(([q, outcome, name]) => ({ type: A.KEEP_BACK, q, outcome, ...(name ? { name } : {}) })),
  // the spending shape (research/v7/spending-shape.md 4.3): A's and B's spend step, C's more detail; a step index past the
  // end is a press on a step already gone, and changes nothing
  fc.tuple(question, fc.integer({ min: 0, max: 3 }), fc.constantFrom('fromAge', 'amount', 'fallsPct', 'then'), fc.constantFrom('', '75', '85', '2,000', '85', '1', '0.25', 'abc'))
    .map(([q, i, f, value]) => {
      const field = f === 'amount' ? (q === 'c' ? 'share' : 'perMonth') : f;
      return { type: A.SHAPE_STEP, q, i, field, value: field === 'then' ? ['level', 'falls', 'glides'][value.length % 3] : value };
    }),
  fc.tuple(question, fc.integer({ min: 0, max: 3 }), fc.constantFrom('fromAge', 'fallsPct', 'then')).map(([q, i, field]) => ({ type: A.SHAPE_TOUCH, q, i, field })),
  question.map((q) => ({ type: A.SHAPE_ADD, q })),
  fc.tuple(question, fc.integer({ min: 0, max: 3 })).map(([q, i]) => ({ type: A.SHAPE_REMOVE, q, i })),
  question.map((q) => ({ type: A.SHAPE_SORT, q })),
  question.map((q) => ({ type: A.SHAPE_SUGGEST, q })),
  fc.tuple(question, fc.constantFrom('level', 'slowly')).map(([q, id]) => ({ type: A.SHAPE_PRESET, q, id })),
  question.map((q) => ({ type: A.SHAPE_UNDO, q })),
  question.map((q) => ({ type: A.SHAPE_RESCALE, q }))
);

/** 'NOW' is the key of what is typed at that moment, as the runner would send it; 'fillA'/'fillB' type a whole draft. */
function concrete(state, a) {
  if (a === 'fillA') return { type: 'fill', q: 'a' };
  if (a === 'fillB') return { type: 'fill', q: 'b' };
  if (a && a.inputsKey === 'NOW') return { ...a, inputsKey: currentKey(state, a.q) };
  return a;
}
function apply(state, a) {
  const action = concrete(state, a);
  if (action.type === 'fill') return action.q === 'a' ? typedA(state) : typedB(state);
  return reduce(state, action);
}

describe('any sequence of actions over the three questions', () => {
  it('the generator covers every action type', () => {
    const seen = new Set(fc.sample(anyAction, 3000).filter((a) => typeof a === 'object').map((a) => a.type));
    expect([...seen].sort()).toEqual([...ACTION_TYPES].sort());
  });
  it('the state survives JSON; plan and session never change; every answer is in a known state', () => {
    fc.assert(fc.property(fc.array(anyAction, { maxLength: 30 }), (actions) => {
      let s = fresh();
      for (const a of actions) {
        s = apply(s, a);
        expect(s.plan).toBe(null);
        expect(s.session).toEqual({ kind: 'none' });
      }
      expect(JSON.parse(JSON.stringify(s))).toEqual(s);
      expect(Object.keys(s.draft).sort()).toEqual(Q);
      for (const q of Q) {
        expect(['idle', 'working', 'first', 'final', 'failed']).toContain(s.answers[q].status);
        if (q !== 'c') {
          expect(typeof s.answers[q].extending).toBe('boolean');
          if (s.answers[q].extending) expect(s.answers[q].status).toBe('final');
          expect([null, 'c', 'a', 'b']).toContain(s.draft[q].carriedFrom);
        } else {
          expect('extending' in s.answers.c).toBe(false);
          expect('carriedFrom' in s.draft.c).toBe(false);
        }
        expect(Object.keys(s.keep[q]).sort()).toEqual(['back', 'name', 'problem', 'saving', 'sent']);
      }
      if (s.budget) expect(Object.keys(s.budget).sort()).toEqual(['lines', 'oneOffs', 'touched', 'version']);
    }), { numRuns: 300 });
  });
  it('a result only ever comes from the key it is filed under, in every question', () => {
    fc.assert(fc.property(fc.array(anyAction, { maxLength: 30 }), (actions) => {
      let s = fresh();
      const filed = { a: null, b: null, c: null };
      for (const a of actions) {
        const action = concrete(s, a);
        const next = apply(s, a);
        for (const q of Q) {
          if (next.answers[q].result !== s.answers[q].result) {
            if ((action.type === A.ANSWER_FIRST || action.type === A.ANSWER_FINAL) && action.q === q) {
              filed[q] = action.inputsKey;
              expect(action.inputsKey).toBe(s.answers[q].inputsKey);
            } else filed[q] = null;
          }
          if (next.answers[q].status === 'first' || next.answers[q].status === 'final') expect(next.answers[q].inputsKey).toBe(filed[q]);
        }
        s = next;
      }
    }), { numRuns: 300 });
  });
  it('a carry never changes its source draft, and never an answer', () => {
    fc.assert(fc.property(fc.array(anyAction, { maxLength: 20 }), fc.constantFrom(...carries), (actions, [from, to]) => {
      let s = fresh();
      for (const a of actions) s = apply(s, a);
      const next = reduce(s, { type: A.DRAFT_CARRY, from, to });
      expect(next.draft[from]).toBe(s.draft[from]);
      expect(next.answers).toBe(s.answers);
      expect(parsedDraft(next, to)).toBeTruthy();
    }), { numRuns: 200 });
  });
});
