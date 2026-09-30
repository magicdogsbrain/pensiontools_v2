/**
 * The draft store: what was typed is kept in this tab only (sessionStorage key pt_v7_draft). Reload keeps the draft;
 * a storage that throws is survived; the only key written is pt_v7_draft. And the clock, the one read of the date.
 */
import { describe, it, expect } from 'vitest';
import { DRAFT_KEY, loadDraft, saveDraft, startDraftStore, sessionStore } from '../../../src/v7/effects/draftStore.js';
import { today } from '../../../src/v7/effects/clock.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { A } from '../../../src/v7/state/actions.js';
import { fresh, set, route, result, fakeStorage, TODAY } from './_shell.js';

const throwing = () => ({
  getItem() { throw new Error('denied'); },
  setItem() { throw new Error('full'); },
  removeItem() { throw new Error('denied'); }
});

/** A page: state from the clock and whatever the tab kept, a store, the draft effect. */
function page(storage) {
  const store = createStore(initialState({ today: TODAY, build: 'test', draft: loadDraft(storage) }), reduce);
  const stop = startDraftStore(store, storage);
  return { store, stop };
}

describe('the draft store', () => {
  it('the key is pt_v7_draft', () => {
    expect(DRAFT_KEY).toBe('pt_v7_draft');
  });
  it('reload keeps the draft, exactly as typed', () => {
    const storage = fakeStorage();
    const first = page(storage);
    first.store.dispatch(set('you.pot', '25,00'));
    first.store.dispatch(set('you.age', '58'));
    first.store.dispatch(set('household', 'couple'));
    first.store.dispatch(set('partner.finalSalary.has', true));
    first.store.dispatch({ type: A.DRAFT_TOUCH, q: 'c', path: 'you.pot' });
    first.store.dispatch({ type: A.DRAFT_ASK, q: 'c' });

    const second = page(storage);                          // the reload
    expect(second.store.getState().draft).toEqual(first.store.getState().draft);
    expect(second.store.getState().draft.c.values).toEqual({ 'you.pot': '25,00', 'you.age': '58', household: 'couple', 'partner.finalSalary.has': true });
    expect(second.store.getState().draft.c.touched).toEqual(['you.pot']);
    expect(second.store.getState().draft.c.asked).toBe(true);
  });
  it('the answer is not kept: it is worked out again', () => {
    const storage = fakeStorage();
    const first = page(storage);
    first.store.dispatch(set('you.pot', '250000'));
    first.store.dispatch({ type: A.ANSWER_WORKING, q: 'c', inputsKey: 'K' });
    first.store.dispatch({ type: A.ANSWER_FINAL, q: 'c', inputsKey: 'K', result: result() });
    expect(storage.getItem(DRAFT_KEY)).not.toMatch(/1380|monthly|answers/);
    expect(page(storage).store.getState().answers.c.status).toBe('idle');
  });
  it('the only key written is pt_v7_draft, whatever happens', () => {
    const storage = fakeStorage();
    const { store } = page(storage);
    store.dispatch(set('you.pot', '250000'));
    store.dispatch(set('you.age', '58'));
    store.dispatch({ type: A.DRAFT_ASK, q: 'c' });
    store.dispatch({ type: A.ROUTE_SET, route: route('step', 'c', 'numbers') });
    store.dispatch({ type: A.ANSWER_WORKING, q: 'c', inputsKey: 'K' });
    store.dispatch({ type: A.ANSWER_FINAL, q: 'c', inputsKey: 'K', result: result() });
    store.dispatch({ type: A.UI_TOGGLE, id: 'more' });
    store.dispatch({ type: A.DRAFT_RESET, q: 'c' });
    expect(storage.writes.length).toBeGreaterThan(0);
    expect([...new Set(storage.writes)]).toEqual([DRAFT_KEY]);
    expect([...storage.data.keys()].filter((k) => k !== DRAFT_KEY)).toEqual([]);
  });
  it('writes only when the draft changed', () => {
    const storage = fakeStorage();
    const { store } = page(storage);
    store.dispatch({ type: A.ROUTE_SET, route: route('step', 'c', 'numbers') });
    store.dispatch({ type: A.UI_TOGGLE, id: 'more' });
    expect(storage.writes).toEqual([]);
    store.dispatch(set('you.pot', '1'));
    expect(storage.writes).toEqual([DRAFT_KEY]);
  });
  it('an emptied draft leaves nothing behind in the tab', () => {
    const storage = fakeStorage();
    const { store } = page(storage);
    store.dispatch(set('you.pot', '250000'));
    expect(storage.getItem(DRAFT_KEY)).not.toBe(null);
    store.dispatch({ type: A.DRAFT_RESET, q: 'c' });
    expect(storage.getItem(DRAFT_KEY)).toBe(null);
    expect(loadDraft(storage)).toBe(null);
  });
  it('after it is stopped it writes nothing', () => {
    const storage = fakeStorage();
    const { store, stop } = page(storage);
    stop();
    store.dispatch(set('you.pot', '1'));
    expect(storage.writes).toEqual([]);
  });
});

describe('a storage that misbehaves is survived', () => {
  it('one that throws on every call', () => {
    const storage = throwing();
    expect(loadDraft(storage)).toBe(null);
    expect(saveDraft(storage, fresh().draft)).toBe(false);
    const { store } = page(storage);
    expect(() => store.dispatch(set('you.pot', '250000'))).not.toThrow();
    expect(() => store.dispatch({ type: A.DRAFT_RESET, q: 'c' })).not.toThrow();
    expect(store.getState().draft.c.values).toEqual({});
  });
  it('no storage at all', () => {
    expect(loadDraft(null)).toBe(null);
    expect(saveDraft(null, fresh().draft)).toBe(false);
    const { store } = page(null);
    expect(() => store.dispatch(set('you.pot', '250000'))).not.toThrow();
  });
  it('a window that refuses to hand over its storage', () => {
    const win = { get sessionStorage() { throw new Error('SecurityError'); } };
    expect(sessionStore(win)).toBe(null);
    expect(sessionStore({})).toBe(null);
    const storage = fakeStorage();
    expect(sessionStore({ sessionStorage: storage })).toBe(storage);
  });
  it.each([
    ['not JSON', '{oops'],
    ['not an object', '"text"'],
    ['null', 'null'],
    ['an array', '[1,2]'],
    ['the wrong shape', '{"c":{"values":[1],"touched":"x","asked":"yes"}}'],
    ['values of the wrong type', '{"c":{"values":{"you.pot":250000,"you.age":{"a":1},"you.finalSalary.has":true,"risk":"balanced"},"touched":[1,"you.pot"],"asked":true}}']
  ])('what is there is %s', (_name, text) => {
    const storage = fakeStorage({ [DRAFT_KEY]: text });
    const draft = loadDraft(storage);
    const state = initialState({ today: TODAY, build: 'test', draft });
    for (const v of Object.values(state.draft.c.values)) expect(['string', 'boolean']).toContain(typeof v);
    expect(Array.isArray(state.draft.c.touched)).toBe(true);
    expect(typeof state.draft.c.asked).toBe('boolean');
    expect(JSON.parse(JSON.stringify(state))).toEqual(state);
  });
  it('a field that is no longer on the input list is dropped on the way in', () => {
    const storage = fakeStorage({ [DRAFT_KEY]: JSON.stringify({ c: { values: { 'you.pot': '1', 'you.shoeSize': '9' }, touched: ['you.shoeSize', 'you.pot'], asked: false } }) });
    expect(loadDraft(storage)).toEqual({ c: { values: { 'you.pot': '1' }, touched: ['you.pot'], asked: false, revealed: [] } });
  });
});

describe('the clock', () => {
  it('gives the local date as YYYY-MM-DD', () => {
    expect(today(new Date(2026, 8, 30, 23, 59))).toBe('2026-09-30');
    expect(today(new Date(2027, 0, 1, 0, 0))).toBe('2027-01-01');
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('is what the state is started from', () => {
    expect(initialState({ today: today(new Date(2028, 3, 6)) }).env.today).toBe('2028-04-06');
  });
});
