/**
 * The reducer (V7 build brief 4.6): each action, the "stale figure" rule, and the two things no action may touch.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A, ACTION_TYPES, OPENABLE } from '../../../src/v7/state/actions.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { SCHEMA_C } from '../c/_c.js';
import { fresh, run, set, typed, route, result, TODAY } from './_shell.js';

const working = (s, key = 'K1') => reduce(s, { type: A.ANSWER_WORKING, q: 'c', inputsKey: key });
const first = (s, key = 'K1', r = result()) => reduce(s, { type: A.ANSWER_FIRST, q: 'c', inputsKey: key, result: r });
const final = (s, key = 'K1', r = result()) => reduce(s, { type: A.ANSWER_FINAL, q: 'c', inputsKey: key, result: r });

describe('route/set', () => {
  it('replaces the route and closes the rail sheet', () => {
    const s = run(fresh(), { type: A.UI_RAIL, open: true }, { type: A.ROUTE_SET, route: route('step', 'c', 'numbers', 'you.age') });
    expect(s.route).toEqual(route('step', 'c', 'numbers', 'you.age'));
    expect(s.ui.railOpen).toBe(false);
  });
  it('turns a route that has no address into "not found"', () => {
    expect(reduce(fresh(), { type: A.ROUTE_SET, route: route('step', 'c', 'nowhere') }).route.screen).toBe('notFound');
    expect(reduce(fresh(), { type: A.ROUTE_SET, route: route('soon', 'c') }).route.screen).toBe('notFound');
    expect(reduce(fresh(), { type: A.ROUTE_SET, route: null }).route.screen).toBe('notFound');
  });
  it('never keeps a plan id in this slice', () => {
    const s = reduce(fresh(), { type: A.ROUTE_SET, route: { ...route('step', 'c', 'answer'), planId: 'abc' } });
    expect(s.route.planId).toBe(null);
  });
});

describe('draft/*', () => {
  it('draft/set holds text exactly as typed', () => {
    const s = run(fresh(), set('you.pot', '25,00'), set('you.finalSalary.has', true));
    expect(s.draft.c.values).toEqual({ 'you.pot': '25,00', 'you.finalSalary.has': true });
  });
  it('draft/set does not change the state object it was given', () => {
    const before = fresh();
    const copy = JSON.stringify(before);
    reduce(before, set('you.pot', '1'));
    expect(JSON.stringify(before)).toBe(copy);
  });
  it('setting household to single keeps what was typed for the partner', () => {
    const s = run(fresh(), set('household', 'couple'), set('partner.age', '60'), set('partner.pot', '150000'), set('household', 'single'));
    expect(s.draft.c.values['partner.age']).toBe('60');
    expect(s.draft.c.values['partner.pot']).toBe('150000');
    const again = reduce(s, set('household', 'couple'));
    expect(again.draft.c.values['partner.age']).toBe('60');
  });
  it('a value that is neither text nor yes/no clears the box', () => {
    const s = run(fresh(), set('take', '1500'), set('take', null));
    expect('take' in s.draft.c.values).toBe(false);
  });
  it('a field that is not on the input list is refused (it throws in the test build, is ignored when published)', () => {
    expect(() => reduce(fresh(), set('you.shoeSize', '9'))).toThrow();
    const prod = initialState({ today: TODAY });
    expect(reduce(prod, set('you.shoeSize', '9'))).toBe(prod);
  });
  it('every field of the input list can be set', () => {
    for (const f of SCHEMA_C.fields) {
      const v = f.type === 'yesNo' ? true : f.type === 'choice' ? f.options[0] : '1';
      expect(reduce(fresh(), set(f.path, v)).draft.c.values[f.path]).toBe(v);
    }
  });
  it('draft/touch adds a field once', () => {
    const s = run(fresh(), { type: A.DRAFT_TOUCH, q: 'c', path: 'you.pot' }, { type: A.DRAFT_TOUCH, q: 'c', path: 'you.pot' }, { type: A.DRAFT_TOUCH, q: 'c', path: 'you.age' });
    expect(s.draft.c.touched).toEqual(['you.pot', 'you.age']);
  });
  it('draft/ask on a draft that parses moves to the answer step', () => {
    const s = reduce(typed(), { type: A.DRAFT_ASK, q: 'c' });
    expect(s.draft.c.asked).toBe(true);
    expect(s.route).toEqual(route('step', 'c', 'answer'));
  });
  it('draft/ask on a draft that does not parse stays where it is, with asked set', () => {
    const at = reduce(fresh(), { type: A.ROUTE_SET, route: route('step', 'c', 'numbers') });
    const s = run(at, set('you.pot', 'abc'), { type: A.DRAFT_ASK, q: 'c' });
    expect(s.draft.c.asked).toBe(true);
    expect(s.route).toEqual(route('step', 'c', 'numbers'));
  });
  it('draft/reset empties the draft and the answer', () => {
    const s = reduce(final(working(reduce(typed(), { type: A.DRAFT_ASK, q: 'c' }))), { type: A.DRAFT_RESET, q: 'c' });
    expect(s.draft.c).toEqual({ values: {}, touched: [], asked: false, revealed: [] });
    expect(s.answers.c).toEqual({ status: 'idle', inputsKey: null, result: null, before: null, progress: null, slow: false });
  });
});

describe('answer/*', () => {
  it('working → first → final', () => {
    let s = working(typed());
    expect(s.answers.c).toMatchObject({ status: 'working', inputsKey: 'K1', result: null, before: null });
    s = reduce(s, { type: A.ANSWER_PROGRESS, q: 'c', inputsKey: 'K1', done: 40, total: 100 });
    expect(s.answers.c.progress).toEqual({ done: 40, total: 100 });
    s = first(s, 'K1', result(1370));
    expect(s.answers.c).toMatchObject({ status: 'first', inputsKey: 'K1', progress: null });
    expect(s.answers.c.result.monthly.careful).toBe(1370);
    s = final(s, 'K1', result(1380));
    expect(s.answers.c).toMatchObject({ status: 'final', inputsKey: 'K1', slow: false, progress: null });
    expect(s.answers.c.result.monthly.careful).toBe(1380);
  });
  it('a new run keeps the old result on screen and copies the old final careful amount into "before"', () => {
    const s = working(final(working(typed())), 'K2');
    expect(s.answers.c.status).toBe('working');
    expect(s.answers.c.inputsKey).toBe('K2');
    expect(s.answers.c.result.monthly.careful).toBe(1380);
    expect(s.answers.c.before).toEqual({ monthly: { careful: 1380 }, take: null });
  });
  it('"before" also keeps how long an amount named under "take" lasted, so Before / Now can compare the tried figure', () => {
    const tried = result(1380, { take: { perMonth: 1800, lasted: 0.62, runOutAge: 84, covered: false } });
    let s = working(final(working(typed()), 'K1', tried), 'K2');
    expect(s.answers.c.before).toEqual({ monthly: { careful: 1380 }, take: { perMonth: 1800, runOutAge: 84, covered: false } });
    // A tried amount that lasted: covered is true; the run-out age is the end age.
    s = working(final(s, 'K2', result(1380, { take: { perMonth: 1200, lasted: 0.97, runOutAge: 95, covered: true } })), 'K3');
    expect(s.answers.c.before.take).toEqual({ perMonth: 1200, runOutAge: 95, covered: true });
    expect(JSON.parse(JSON.stringify(s.answers.c.before))).toEqual(s.answers.c.before);
  });
  it('"before" is the last FINAL amount: a run replaced before it finished does not change it', () => {
    let s = working(final(working(typed())), 'K2');       // before = 1380
    s = first(s, 'K2', result(900));
    s = working(s, 'K3');                                  // the K2 run never finished
    expect(s.answers.c.before).toEqual({ monthly: { careful: 1380 }, take: null });
  });
  it('a stale answer/first is ignored', () => {
    const s = working(working(typed(), 'K1'), 'K2');
    expect(first(s, 'K1')).toBe(s);
  });
  it('a stale answer/final is ignored', () => {
    const s = working(working(typed(), 'K1'), 'K2');
    expect(final(s, 'K1')).toBe(s);
    const done = final(first(s, 'K2', result(1000)), 'K2', result(1010));
    expect(final(done, 'K1', result(5))).toBe(done);
    expect(done.answers.c.result.monthly.careful).toBe(1010);
  });
  it('a first figure never replaces a final one', () => {
    const done = final(working(typed()));
    expect(first(done, 'K1', result(5))).toBe(done);
  });
  it('stale progress and a stale failure are ignored', () => {
    const s = working(working(typed(), 'K1'), 'K2');
    expect(reduce(s, { type: A.ANSWER_PROGRESS, q: 'c', inputsKey: 'K1', done: 1, total: 2 })).toBe(s);
    expect(reduce(s, { type: A.ANSWER_FAILED, q: 'c', inputsKey: 'K1' })).toBe(s);
  });
  it('answer/failed leaves the draft alone; answer/retry clears the key so the runner starts again', () => {
    const before = working(typed());
    let s = reduce(before, { type: A.ANSWER_FAILED, q: 'c', inputsKey: 'K1' });
    expect(s.answers.c.status).toBe('failed');
    expect(s.answers.c.inputsKey).toBe('K1');
    expect(s.draft).toBe(before.draft);
    s = reduce(s, { type: A.ANSWER_RETRY, q: 'c' });
    expect(s.answers.c.inputsKey).toBe(null);
    expect(s.answers.c.status).toBe('idle');
    const done = final(working(typed()));
    expect(reduce(done, { type: A.ANSWER_RETRY, q: 'c' })).toBe(done);      // only a failed run can be tried again
  });
  it('answer/slow only while a run is under way', () => {
    expect(reduce(working(typed()), { type: A.ANSWER_SLOW, q: 'c' }).answers.c.slow).toBe(true);
    const done = final(working(typed()));
    expect(reduce(done, { type: A.ANSWER_SLOW, q: 'c' })).toBe(done);
    expect(working(reduce(working(typed()), { type: A.ANSWER_SLOW, q: 'c' }), 'K2').answers.c.slow).toBe(false);
  });
});

describe('ui/*, env/set, state/replace', () => {
  it('ui/toggle adds then removes', () => {
    let s = reduce(fresh(), { type: A.UI_TOGGLE, id: 'more' });
    expect(s.ui.open).toEqual(['more']);
    s = reduce(s, { type: A.UI_TOGGLE, id: 'assumed' });
    s = reduce(s, { type: A.UI_TOGGLE, id: 'more' });
    expect(s.ui.open).toEqual(['assumed']);
    for (const id of OPENABLE) expect(reduce(fresh(), { type: A.UI_TOGGLE, id }).ui.open).toEqual([id]);
    expect(() => reduce(fresh(), { type: A.UI_TOGGLE, id: 'nonsense' })).toThrow();
  });
  it('ui/rail and ui/online', () => {
    expect(reduce(fresh(), { type: A.UI_RAIL, open: true }).ui.railOpen).toBe(true);
    expect(reduce(fresh(), { type: A.UI_ONLINE, online: false }).ui.online).toBe(false);
  });
  it('env/set changes the date and the history month, never the build', () => {
    const s = reduce(fresh(), { type: A.ENV_SET, patch: { today: '2028-04-06', historyEnd: '2025-12', build: 'prod', other: 1 } });
    expect(s.env).toEqual({ today: '2028-04-06', build: 'test', appVersion: fresh().env.appVersion, historyEnd: '2025-12' });
    expect(() => reduce(fresh(), { type: A.ENV_SET, patch: { today: 'tomorrow' } })).toThrow();
  });
  it('state/replace draws any state — in the test build only', () => {
    const wanted = final(working(reduce(typed(), { type: A.DRAFT_ASK, q: 'c' })));
    const s = reduce(fresh(), { type: A.STATE_REPLACE, state: wanted });
    expect(s).toEqual(wanted);
    expect(s).not.toBe(wanted);
    const prod = initialState({ today: TODAY });
    expect(reduce(prod, { type: A.STATE_REPLACE, state: wanted })).toBe(prod);
  });
  it('an unknown action throws in the test build and is ignored in the published build', () => {
    expect(() => reduce(fresh(), { type: 'plan/save' })).toThrow();
    const prod = initialState({ today: TODAY });
    expect(reduce(prod, { type: 'plan/save' })).toBe(prod);
    expect(reduce(prod, undefined)).toBe(prod);
  });
});

// ---- any sequence of actions ------------------------------------------------------------------------------------

const paths = SCHEMA_C.fields.map((f) => f.path);
const text = fc.oneof(fc.constantFrom('', '250,000', '£1', 'abc', '58', '67', '0', '30000', 'couple', 'single', 'forecast', 'age', 'now'), fc.boolean());
const key = fc.constantFrom('K1', 'K2', null);
const anyRoute = fc.oneof(
  fc.constantFrom(route('front'), route('step', 'c', 'numbers'), route('step', 'c', 'answer', 'you.age'), route('step', 'c', 'ways'),
    route('step', 'c', 'keep'), route('soon', 'a'), route('soon', 'c'), route('notFound'), route('step', 'z', 'answer')),
  fc.record({ screen: fc.string(), q: fc.string(), planId: fc.string() })
);
const anyAction = fc.oneof(
  anyRoute.map((r) => ({ type: A.ROUTE_SET, route: r })),
  fc.tuple(fc.constantFrom(...paths), text).map(([path, value]) => set(path, value)),
  fc.constantFrom(...paths).map((path) => ({ type: A.DRAFT_TOUCH, q: 'c', path })),
  fc.constant({ type: A.DRAFT_ASK, q: 'c' }),
  fc.constant({ type: A.DRAFT_RESET, q: 'c' }),
  key.map((inputsKey) => ({ type: A.ANSWER_WORKING, q: 'c', inputsKey })),
  key.map((inputsKey) => ({ type: A.ANSWER_PROGRESS, q: 'c', inputsKey, done: 3, total: 100 })),
  fc.tuple(key, fc.integer({ min: 0, max: 5000 })).map(([inputsKey, n]) => ({ type: A.ANSWER_FIRST, q: 'c', inputsKey, result: result(n) })),
  fc.tuple(key, fc.integer({ min: 0, max: 5000 })).map(([inputsKey, n]) => ({ type: A.ANSWER_FINAL, q: 'c', inputsKey, result: result(n) })),
  key.map((inputsKey) => ({ type: A.ANSWER_FAILED, q: 'c', inputsKey })),
  fc.constant({ type: A.ANSWER_SLOW, q: 'c' }),
  fc.constant({ type: A.ANSWER_RETRY, q: 'c' }),
  fc.constantFrom(...OPENABLE).map((id) => ({ type: A.UI_TOGGLE, id })),
  fc.boolean().map((open) => ({ type: A.UI_RAIL, open })),
  fc.boolean().map((online) => ({ type: A.UI_ONLINE, online })),
  fc.constantFrom('2026-09-30', '2028-04-06').map((today) => ({ type: A.ENV_SET, patch: { today } })),
  fc.constant(null).map(() => ({ type: A.STATE_REPLACE, state: { ...fresh(), plan: { id: 'x' }, session: { kind: 'user', uid: 'u' } } }))
);

describe('any sequence of actions', () => {
  it('the generator covers every action type (draft/carry and answer/extend need A or B open: reduce.ab.test.js)', () => {
    const seen = new Set(fc.sample(anyAction, 2000).map((a) => a.type));
    const step4 = [A.DRAFT_CARRY, A.ANSWER_EXTEND];
    expect([...seen].sort()).toEqual(ACTION_TYPES.filter((t) => !step4.includes(t)).sort());
  });
  it('the state survives JSON, and plan and session never change', () => {
    fc.assert(fc.property(fc.array(anyAction, { maxLength: 30 }), (actions) => {
      let s = fresh();
      for (const a of actions) {
        s = reduce(s, a);
        expect(s.plan).toBe(null);
        expect(s.session).toEqual({ kind: 'none' });
      }
      expect(JSON.parse(JSON.stringify(s))).toEqual(s);
      expect(Object.keys(s).sort()).toEqual(['answers', 'draft', 'env', 'plan', 'route', 'session', 'ui']);
      expect(['idle', 'working', 'first', 'final', 'failed']).toContain(s.answers.c.status);
    }), { numRuns: 300 });
  });
  it('a result only ever comes from the key it is filed under', () => {
    fc.assert(fc.property(fc.array(anyAction, { maxLength: 30 }), (actions) => {
      let s = fresh();
      let filed = null;                                        // the key the stored result was delivered under
      for (const a of actions) {
        const next = reduce(s, a);
        if (next.answers.c.result !== s.answers.c.result) {
          if (a.type === A.ANSWER_FIRST || a.type === A.ANSWER_FINAL) { filed = a.inputsKey; expect(a.inputsKey).toBe(s.answers.c.inputsKey); }
          else filed = null;                                   // reset or replaced
        }
        s = next;
        if (s.answers.c.status === 'first' || s.answers.c.status === 'final') expect(s.answers.c.inputsKey).toBe(filed);
      }
    }), { numRuns: 300 });
  });
});

describe('the store', () => {
  it('holds the state, applies actions, and tells whoever is listening', () => {
    const store = createStore(fresh(), reduce);
    const seen = [];
    const stop = store.subscribe((state, action) => seen.push([action.type, state.draft.c.values['you.pot']]));
    store.dispatch(set('you.pot', '1'));
    store.dispatch(set('you.pot', '12'));
    expect(store.getState().draft.c.values['you.pot']).toBe('12');
    expect(seen).toEqual([[A.DRAFT_SET, '1'], [A.DRAFT_SET, '12']]);
    stop();
    store.dispatch(set('you.pot', '123'));
    expect(seen.length).toBe(2);
  });
  it('says nothing when an action changed nothing', () => {
    const store = createStore(working(working(typed(), 'K1'), 'K2'), reduce);
    let calls = 0;
    store.subscribe(() => calls++);
    store.dispatch({ type: A.ANSWER_FINAL, q: 'c', inputsKey: 'K1', result: result() });
    expect(calls).toBe(0);
  });
  it('an action sent from inside a listener is applied after the one under way, in order', () => {
    const store = createStore(fresh(), reduce);
    const order = [];
    store.subscribe((state, action) => {
      order.push(action.type + ':' + (state.draft.c.values['you.pot'] || ''));
      if (action.type === A.DRAFT_SET && action.path === 'you.pot' && action.value === '1') store.dispatch(set('you.pot', '2'));
    });
    store.subscribe((state, action) => order.push('second:' + action.value));
    store.dispatch(set('you.pot', '1'));
    expect(order).toEqual([A.DRAFT_SET + ':1', 'second:1', A.DRAFT_SET + ':2', 'second:2']);
  });
});
