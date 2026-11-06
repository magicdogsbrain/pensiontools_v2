/**
 * Helpers shared by the shell tests (V7 package 3). Not a test file.
 */
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';

export const TODAY = '2026-09-30';

/** A fresh state in the test build (where an unknown action throws). */
export const fresh = (o = {}) => initialState({ today: TODAY, build: 'test', ...o });

/** Apply actions in order. */
export const run = (state, ...actions) => actions.reduce((s, a) => reduce(s, a), state);

export const set = (path, value, q = 'c') => ({ type: A.DRAFT_SET, q, path, value });

/** A state with the two figures a single person must give. */
export const typed = (pot = '250,000', age = '58') => run(fresh(), set('you.pot', pot), set('you.age', age));

export const route = (screen, q = null, step = null, focus = null) => ({ screen, q, step, planId: null, focus });
export const onAnswer = (state) => reduce(state, { type: A.ROUTE_SET, route: route('step', 'c', 'answer') });

/** A result that looks like an answer, without running anything. */
export const result = (careful = 1380, extra = {}) => ({
  status: 'ok',
  monthly: { careful, middling: careful + 210, good: careful + 480 },
  basis: { historyEnd: '2025-12' },
  ...extra
});

/** A promise that the test settles by hand. */
export function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

/** A storage stand-in that records every write. */
export function fakeStorage(start = {}) {
  const data = new Map(Object.entries(start));
  const writes = [];
  return {
    writes,
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { writes.push(k); data.set(k, String(v)); },
    removeItem: (k) => { writes.push(k); data.delete(k); }
  };
}

/** A window stand-in for the address effect: hash changes made by the page fire "hashchange" at once. */
export function fakeWindow(hash = '') {
  const listeners = {};
  const entries = [hash];
  const fire = (type) => (listeners[type] || []).slice().forEach((fn) => fn({ type }));
  const win = {
    entries,
    location: {
      get hash() { return entries[entries.length - 1]; },
      set hash(v) {
        const next = v.startsWith('#') ? v : '#' + v;
        if (next === entries[entries.length - 1]) return;
        entries.push(next);
        fire('hashchange');
      }
    },
    history: {
      replaceState(_s, _t, url) { entries[entries.length - 1] = url; },   // no event, as in a browser
      back() { if (entries.length > 1) { entries.pop(); fire('hashchange'); } }
    },
    addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
    removeEventListener(type, fn) { listeners[type] = (listeners[type] || []).filter((f) => f !== fn); },
    /** What a person does: type an address or follow a link. */
    go(v) { win.location.hash = v; },
    listeners
  };
  return win;
}
