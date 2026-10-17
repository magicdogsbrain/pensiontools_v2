/**
 * The V7 side of the hand-over (research/v7/your-plan.md 1.4, 5.2), and the activity effect (4.3).
 *   - "Change this" (plan/change) writes ONE request to this window's session storage — the plan's id, the place, the
 *     way back, the time; no figure, no name — then opens the planner in the same window;
 *   - the sign-in place opens the planner's own sign-in door;
 *   - a browser that refuses storage: nothing opens, the state says so;
 *   - activity is recorded under the planner's key, at most every ten seconds.
 */
import { describe, it, expect } from 'vitest';
import { startOpenPlace, PLANNER, SIGN_IN_DOOR } from '../../../src/v7/effects/openPlace.js';
import { startActivity, ACTIVITY_KEY, lastActivity, THROTTLE_MS } from '../../../src/v7/effects/activity.js';
import { OPEN_PLACE_KEY, readRequest } from '../../../src/services/OpenPlace.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { fakeStorage } from '../shell/_shell.js';
import { TODAY } from './_plans.js';

const NOW = new Date(TODAY + 'T14:03:00.000Z');
const tick = () => new Promise((r) => setTimeout(r, 0));

function page(session) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  const went = [];
  const stop = startOpenPlace(store, { session, now: () => NOW, go: (a) => went.push(a) });
  return { store, went, stop, session };
}

describe('"Change this": the request and the move to the planner', () => {
  it('writes { v, planId, place, back, at } to pt_open_place and opens the planner', async () => {
    const session = fakeStorage();
    const { store, went } = page(session);
    store.dispatch({ type: A.PLAN_CHANGE, planId: 'Kq8LwT2mJv5PzYc9BnRd', place: 'month', back: '#/plan/Kq8LwT2mJv5PzYc9BnRd/month' });
    await tick();
    const text = session.getItem(OPEN_PLACE_KEY);
    expect(JSON.parse(text)).toEqual({ v: 1, planId: 'Kq8LwT2mJv5PzYc9BnRd', place: 'month', back: '#/plan/Kq8LwT2mJv5PzYc9BnRd/month', at: NOW.toISOString() });
    expect(readRequest(text, NOW.getTime()).ok).toBe(true);
    expect(went).toEqual([PLANNER]);
    expect(text).not.toMatch(/£|\d{4,}(?![A-Za-z0-9_-])/);   // no figure: only the id and the time
    expect(store.getState().ui.leaving).toEqual({ planId: 'Kq8LwT2mJv5PzYc9BnRd', place: 'month', back: '#/plan/Kq8LwT2mJv5PzYc9BnRd/month' });
  });
  it('the sign-in place: no plan id, the planner\'s sign-in door', async () => {
    const session = fakeStorage();
    const { store, went } = page(session);
    store.dispatch({ type: A.PLAN_CHANGE, planId: null, place: 'signin', back: '#/plans' });
    await tick();
    expect(JSON.parse(session.getItem(OPEN_PLACE_KEY)).planId).toBe(null);
    expect(went).toEqual([SIGN_IN_DOOR]);
  });
  it('a request that would be refused is not written and nothing opens: an unknown place, a way back that is not a plan page', async () => {
    const session = fakeStorage();
    const { store, went } = page(session);
    store.dispatch({ type: A.PLAN_CHANGE, planId: 'abc', place: 'nowhere', back: '#/plan/abc' });
    store.dispatch({ type: A.PLAN_CHANGE, planId: 'abc', place: 'month', back: '#/c/answer' });
    await tick();
    expect(session.getItem(OPEN_PLACE_KEY)).toBe(null);
    expect(went).toEqual([]);
    expect(store.getState().ui.leaveProblem).toBe('storage');
  });
  it('a browser that refuses storage: nothing opens, the screen is told', async () => {
    const refusing = { getItem() { return null; }, setItem() { throw new Error('denied'); }, removeItem() {} };
    const { store, went } = page(refusing);
    store.dispatch({ type: A.PLAN_CHANGE, planId: 'abc', place: 'month', back: '#/plan/abc' });
    await tick();
    expect(went).toEqual([]);
    expect(store.getState().ui.leaving).toBe(null);
    expect(store.getState().ui.leaveProblem).toBe('storage');
    const none = page(null);
    none.store.dispatch({ type: A.PLAN_CHANGE, planId: 'abc', place: 'month', back: '#/plan/abc' });
    await tick();
    expect(none.went).toEqual([]);
  });
});

describe('activity for the planner\'s idle sign-out (4.3)', () => {
  it('records pt_lastActivity on a person\'s activity, at most every ten seconds, on any page', () => {
    const listeners = {};
    const win = { addEventListener: (e, fn) => { listeners[e] = fn; }, removeEventListener: (e) => { delete listeners[e]; } };
    const storage = fakeStorage();
    let t = 1000;
    const stop = startActivity(win, { storage, now: () => t });
    expect(lastActivity(storage)).toBe(1000);                   // the start counts as activity
    t += 5000; listeners.keydown();
    expect(lastActivity(storage)).toBe(1000);                   // within ten seconds: not written again
    t += THROTTLE_MS; listeners.mousemove();
    expect(lastActivity(storage)).toBe(t);
    expect(Object.keys(listeners)).toContain('touchstart');
    expect(storage.writes.every((k) => k === ACTIVITY_KEY)).toBe(true);
    stop();
    expect(Object.keys(listeners)).toEqual([]);
    expect(startActivity(win, { storage: null })).toBeTypeOf('function');
    expect(lastActivity({ getItem() { throw new Error('denied'); } })).toBe(0);
  });
});
