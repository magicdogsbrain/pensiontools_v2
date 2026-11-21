/**
 * The State Pension choice saves at once (step F2 fix, lead4.md R3; the gate's round trip income.spKind|s2f "needs a press"):
 * on "Money that comes in", choosing the full amount, none, or "leave it as assumed" writes the State Pension's own boxes
 * at once, so the full view shows the choice without a press of Save. Only those boxes go: anything else typed on the page
 * stays typed and waits for Save (a save writes only what the person changed). "My forecast" needs its weekly figure, so it
 * waits for Save as before. Fictional saver (the corpus's 05, unlocked).
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { household, TODAY, noon } from '../plan/_plans.js';
import { applyPatch } from '../../../src/answers/plan/about.js';

const tick = async (n = 10) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const STAMP = '2026-10-02T14:03:00.000Z';
const SAVER = household().saver;
const SP = ['spKind', 'spWeekly', 'spDate'];

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k) };
}
function fakeLite() {
  const writes = [];
  return { writes, doc: (db, ...path) => ({ db, path: path.join('/') }), updateDoc(ref, data) { writes.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); } };
}
function page({ typed = {}, fb = fakeLite() } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + SAVER.id + '/income') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  store.dispatch({ type: A.PLANS_SET, list: upgradedList([SAVER], noon(TODAY)), source: 'account', readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId: SAVER.id, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  store.subscribe((state, action) => { if (action.type === A.PLAN_EDIT || action.type === A.PLANS_SET) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
  const reread = () => { let plan = copy(SAVER); for (const w of fb.writes) plan = applyPatch(plan, w.data); store.dispatch({ type: A.PLANS_SET, list: upgradedList([plan], noon(TODAY)), source: 'account', readAt: '14:04' }); return Promise.resolve(); };
  const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread });
  const stop = startPlanWrite(store, { session: storage(), local: storage(), now: () => new Date(STAMP), fb, handles });
  return { store, fb, stop };
}
const atOnce = { type: A.PLAN_SAVE, planId: SAVER.id, auto: true, only: SP };

describe('the reducer: a save of some boxes alone', () => {
  it('sends those boxes only; the rest stays typed after the write', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.PLAN_EDIT, planId: SAVER.id, path: 'other', value: '500' });
    s = reduce(s, { type: A.PLAN_EDIT, planId: SAVER.id, path: 'spKind', value: 'none' });
    s = reduce(s, atOnce);
    expect(s.ui.saving).toEqual({ planId: SAVER.id, kind: 'save', auto: true, sent: { spKind: 'none' }, only: SP });
    const saved = reduce(s, { type: A.PLAN_SAVED, planId: SAVER.id, previous: { x: 1 }, line: null });
    expect(saved.draft.plan.values).toEqual({ other: '500' });
  });
  it('a path that is not a box is never taken as `only`: the whole draft goes, as a box left does', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.PLAN_EDIT, planId: SAVER.id, path: 'other', value: '500' });
    s = reduce(s, { type: A.PLAN_SAVE, planId: SAVER.id, auto: true, only: ['notABox'] });
    expect(s.ui.saving).toEqual({ planId: SAVER.id, kind: 'save', auto: true, sent: { other: '500' } });
  });
  it('chosen while a write is under way: queued with its boxes, and sent next with them', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.PLAN_EDIT, planId: SAVER.id, path: 'spKind', value: 'full' });
    s = reduce(s, atOnce);
    s = reduce(s, atOnce);
    expect(s.ui.saveAgain).toBe(SAVER.id);
    expect(s.ui.saveAgainOnly).toEqual(SP);
  });
});

describe('the write: the State Pension alone', () => {
  it('"None" chosen with another box typed: the State Pension is written, the other box is not and stays typed', async () => {
    const fb = fakeLite();
    const p = page({ typed: { other: '500', spKind: 'none' }, fb });
    p.store.dispatch(atOnce);
    await tick(20);
    expect(fb.writes.length).toBe(1);
    const plan = applyPatch(copy(SAVER), fb.writes[0].data);
    expect(plan.stressTool.settings.spWeeklyAmount).toBe(0);
    expect(plan.stressTool.settings.statePension).toBe(0);
    expect(plan.stressTool.settings.other).toEqual(SAVER.stressTool.settings.other);
    expect(p.store.getState().draft.plan.values).toEqual({ other: '500' });
    p.stop();
  });
});

describe('the page: choosing starts the save at once', () => {
  const draw = (state, dispatch) => { const root = document.createElement('div'); root.id = 'app'; document.body.appendChild(root); render(h(App, { state, dispatch }), root); return root; };
  it('"None" chosen: the State Pension\'s boxes are saved at once; "My forecast" waits for its weekly figure', () => {
    const p = page();
    const sent = [];
    const root = draw(p.store.getState(), (a) => sent.push(a));
    const none = root.querySelector('[data-testid="plan.income.spKind.none"]');
    expect(none).not.toBe(null);
    none.click();
    expect(sent).toContainEqual({ type: 'plan/edit', planId: SAVER.id, path: 'spKind', value: 'none' });
    expect(sent).toContainEqual({ type: 'plan/save', planId: SAVER.id, auto: true, only: SP });
    sent.length = 0;
    root.querySelector('[data-testid="plan.income.spKind.forecast"]').click();
    expect(sent.some((a) => a.type === 'plan/save')).toBe(false);
    p.stop();
  });
});
