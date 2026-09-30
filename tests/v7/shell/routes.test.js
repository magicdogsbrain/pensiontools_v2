/**
 * Addresses (V7 build brief 4.8): the round trip for every row, unknown → not found, no figure in any address,
 * and the address effect (the only code that reads or writes the address).
 */
import { describe, it, expect } from 'vitest';
import { parse, format, href, screenName, ROUTES, NOT_FOUND } from '../../../src/v7/router/routes.js';
import { QUESTIONS, BUILT } from '../../../src/v7/rail/questions.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { startAddress } from '../../../src/v7/effects/address.js';
import { SCHEMA_C } from '../c/_c.js';
import { fresh, set, route, fakeWindow, run, result } from './_shell.js';

const r = route;

/** Every row of the table in 4.8. */
const ROWS = [
  ['#/', r('front'), 'front'],
  ['#/c/numbers', r('step', 'c', 'numbers'), 'c.numbers'],
  ['#/c/answer', r('step', 'c', 'answer'), 'c.answer'],
  ['#/c/ways', r('step', 'c', 'ways'), 'notBuilt'],
  ['#/c/keep', r('step', 'c', 'keep'), 'notBuilt'],
  ...['a', 'b', 'd', 'e', 'f'].map((q) => [`#/soon/${q}`, r('soon', q), 'soon'])
];
const FOCUSED = [
  ['#/c/numbers?focus=you.age', r('step', 'c', 'numbers', 'you.age')],
  ['#/c/numbers?focus=partner.statePension.yearly', r('step', 'c', 'numbers', 'partner.statePension.yearly')],
  ['#/c/answer?focus=take', r('step', 'c', 'answer', 'take')],
  ['#/?focus=you.pot', r('front', null, null, 'you.pot')]
];
const UNKNOWN = ['#/plan/abc123/c/answer', '#/c', '#/c/', '#/c/nowhere', '#/soon/c', '#/soon/z', '#/soon', '#/x/y/z', '#nonsense',
  '#/c/answer/extra', '#/c/numbers?focus=', '#/c/numbers?focus=you.pot=250000', '#/c/numbers?pot=250000', '#/C/numbers', '#/c/numbers?focus=1'];

describe('parse and format', () => {
  it.each(ROWS)('%s', (address, wanted, screen) => {
    expect(parse(address)).toEqual(wanted);
    expect(format(wanted)).toBe(address);
    expect(format(parse(address))).toBe(address);
    expect(parse(format(wanted))).toEqual(wanted);
    expect(screenName(wanted)).toBe(screen);
  });
  it.each(FOCUSED)('%s', (address, wanted) => {
    expect(parse(address)).toEqual(wanted);
    expect(format(parse(address))).toBe(address);
    expect(parse(format(wanted))).toEqual(wanted);
  });
  it('an empty address is the front door', () => {
    for (const h of ['', '#', '#/', undefined, null]) expect(parse(h)).toEqual(r('front'));
  });
  it.each(UNKNOWN)('unknown: %s → not found, which draws the front door', (address) => {
    expect(parse(address)).toEqual(NOT_FOUND);
    expect(screenName(parse(address))).toBe('front');
    expect(parse(format(parse(address)))).toEqual(NOT_FOUND);
  });
  it('unset fields are null, never undefined', () => {
    for (const [address] of [...ROWS, ...FOCUSED]) {
      const got = parse(address);
      expect(Object.keys(got).sort()).toEqual(['focus', 'planId', 'q', 'screen', 'step']);
      for (const v of Object.values(got)) expect(v).not.toBe(undefined);
    }
  });
  it('every kind of address in ROUTES is covered by a row above', () => {
    const screens = new Set([...ROWS.map(([, w]) => w.screen), 'notFound']);
    expect([...new Set(ROUTES.map((x) => x.screen))].sort()).toEqual([...screens].sort());
  });
  it('the shorthands build the same addresses', () => {
    expect(href.front()).toBe('#/');
    expect(href.step('c', 'numbers', 'you.age')).toBe('#/c/numbers?focus=you.age');
    expect(href.soon('e')).toBe('#/soon/e');
  });
});

describe('no figure ever appears in an address', () => {
  // A state full of figures: everything typed, an answer worked out.
  let full = fresh();
  for (const f of SCHEMA_C.fields) {
    const v = f.type === 'yesNo' ? true : f.type === 'choice' ? f.options[f.options.length - 1] : String(f.max ?? 99);
    full = reduce(full, set(f.path, f.path === 'household' ? 'couple' : v));
  }
  full = run(full, { type: A.ANSWER_WORKING, q: 'c', inputsKey: 'K' }, { type: A.ANSWER_FINAL, q: 'c', inputsKey: 'K', result: result(1380) });

  /** Every route a person can be on, with every field as the focus. */
  const reachable = [];
  const places = [r('front'), ...Object.values(BUILT).flatMap((q) => q.steps.map((s) => r('step', q.id, s.id))),
    ...QUESTIONS.filter((q) => !q.built).map((q) => r('soon', q.id)), r('notFound')];
  for (const place of places) {
    reachable.push(place);
    for (const f of SCHEMA_C.fields) reachable.push({ ...place, focus: f.path });
  }

  it('in any route reachable from a state full of figures', () => {
    expect(reachable.length).toBeGreaterThan(200);
    for (const place of reachable) {
      const s = reduce(full, { type: A.ROUTE_SET, route: place });
      const address = format(s.route);
      expect(address, address).not.toMatch(/\d/);
      expect(address).not.toMatch(/£|%/);
    }
  });
  it('nor after the button is pressed', () => {
    const s = reduce(run(fresh(), set('you.pot', '250000'), set('you.age', '58')), { type: A.DRAFT_ASK, q: 'c' });
    expect(format(s.route)).toBe('#/c/answer');
  });
  it('an address that tries to carry a figure is not understood', () => {
    expect(parse('#/c/answer?pot=250000').screen).toBe('notFound');
    expect(parse('#/c/numbers?focus=250000').screen).toBe('notFound');
    expect(format({ ...r('step', 'c', 'numbers'), focus: '250000' })).toBe('#/c/numbers');
  });
});

describe('the address effect', () => {
  const start = (hash) => {
    const win = fakeWindow(hash);
    const store = createStore(fresh(), reduce);
    const stop = startAddress(store, win);
    return { win, store, stop };
  };

  it('reads the address at start-up', () => {
    const { store } = start('#/c/numbers?focus=you.age');
    expect(store.getState().route).toEqual(r('step', 'c', 'numbers', 'you.age'));
  });
  it('an empty address is left alone (no extra entry for the back button)', () => {
    const { store, win } = start('');
    expect(store.getState().route.screen).toBe('front');
    expect(win.entries).toEqual(['']);
  });
  it('a change of address becomes a route', () => {
    const { store, win } = start('#/');
    win.go('#/c/answer');
    expect(store.getState().route).toEqual(r('step', 'c', 'answer'));
    win.go('#/soon/e');
    expect(store.getState().route).toEqual(r('soon', 'e'));
  });
  it('a change of route becomes an address, as a new entry', () => {
    const { store, win } = start('#/c/numbers');
    store.dispatch(set('you.pot', '250000'));
    store.dispatch(set('you.age', '58'));
    expect(win.entries).toEqual(['#/c/numbers']);
    store.dispatch({ type: A.DRAFT_ASK, q: 'c' });
    expect(win.location.hash).toBe('#/c/answer');
    expect(win.entries).toEqual(['#/c/numbers', '#/c/answer']);
  });
  it('back works', () => {
    const { store, win } = start('#/');
    win.go('#/c/numbers');
    win.go('#/c/answer');
    win.history.back();
    expect(store.getState().route).toEqual(r('step', 'c', 'numbers'));
    expect(win.entries).toEqual(['#/', '#/c/numbers']);
  });
  it('an unknown address is tidied in place, so the back button is not trapped', () => {
    const { store, win } = start('#/');
    win.go('#/plan/abc/c/answer');
    expect(store.getState().route.screen).toBe('notFound');
    expect(win.entries).toEqual(['#/', '#/not-found']);
    win.history.back();
    expect(store.getState().route.screen).toBe('front');
  });
  it('after it is stopped it neither reads nor writes', () => {
    const { store, win, stop } = start('#/');
    stop();
    win.go('#/c/answer');
    expect(store.getState().route.screen).toBe('front');
    store.dispatch({ type: A.ROUTE_SET, route: r('soon', 'a') });
    expect(win.location.hash).toBe('#/c/answer');
  });
});
