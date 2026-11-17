/**
 * "What you pay in" saves a box when it is left (7.12.0, lead decisions 1 and 9; the second walk, walker 1: Jo typed £2,000
 * and 65 under "What you want", the answer followed, but the plan's name, the rail and the pot table did not, the Save was
 * 1,000 pixels lower, and leaving lost it). Now a box left with a change that is ready to save starts the same one write as
 * Save (an "autosave"): what was typed meanwhile stays typed and goes next, a month being recorded is never touched, and
 * nothing is written when nothing changed. Save stays and does the same. Fictional saver (the corpus's 05, unlocked).
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { emptyPlanDraft } from '../../../src/v7/state/initial.js';
import { household, TODAY, noon } from '../plan/_plans.js';
import { applyPatch } from '../../../src/answers/plan/about.js';

const tick = async (n = 10) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const STAMP = '2026-10-02T14:03:00.000Z';
const SAVER = household().saver;   // unlocked, saving, stopping at 60

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k), raw: (k) => map.get(k) };
}
function fakeLite() {
  const writes = [];
  let release = null;
  return { writes, hold: () => { let r; const p = new Promise((res) => { r = res; }); release = r; return p; }, go: () => release && release(),
    doc: (db, ...path) => ({ db, path: path.join('/') }),
    updateDoc(ref, data) { writes.push({ path: ref.path, data: copy(data) }); return this.wait || Promise.resolve(); } };
}
function page({ typed = {}, fb = fakeLite() } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + SAVER.id + '/saving') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  store.dispatch({ type: A.PLANS_SET, list: upgradedList([SAVER], noon(TODAY)), source: 'account', readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId: SAVER.id, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  store.subscribe((state, action) => { if (action.type === A.PLAN_EDIT || action.type === A.PLANS_SET) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
  // the account read again just before each write (as planWrite does): the plan as the writes so far left it
  const reread = () => { let plan = copy(SAVER); for (const w of fb.writes) plan = applyPatch(plan, w.data); store.dispatch({ type: A.PLANS_SET, list: upgradedList([plan], noon(TODAY)), source: 'account', readAt: '14:04' }); return Promise.resolve(); };
  const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread });
  const stop = startPlanWrite(store, { session: storage(), local: storage(), now: () => new Date(STAMP), fb, handles });
  return { store, fb, stop };
}
const auto = { type: A.PLAN_SAVE, planId: SAVER.id, auto: true };

describe('the reducer: a save started by leaving a box', () => {
  const typedState = () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/plan/' + SAVER.id + '/saving') });
    s = reduce(s, { type: A.PLAN_EDIT, planId: SAVER.id, path: 'want.monthly', value: '2500' });
    return reduce(s, { type: A.PLAN_EDIT, planId: SAVER.id, path: 'record.pension', value: '91000' });
  };
  it('starts the one write, remembering what it sends; never marks every box "asked"', () => {
    const s = reduce(typedState(), auto);
    expect(s.ui.saving).toEqual({ planId: SAVER.id, kind: 'save', auto: true, sent: { 'want.monthly': '2500', 'record.pension': '91000' } });
    expect(s.draft.plan.asked).toBe(false);
  });
  it('a box left while a write is under way is saved next (saveAgain), and a press of Save then is still one write at a time', () => {
    const s = reduce(typedState(), auto);
    const again = reduce(reduce(s, { type: A.PLAN_EDIT, planId: SAVER.id, path: 'want.stopAge', value: '58' }), auto);
    expect(again.ui.saving).toEqual(s.ui.saving);
    expect(again.ui.saveAgain).toBe(SAVER.id);
    expect(reduce(again, { type: A.PLAN_SAVE, planId: SAVER.id }).ui.saving).toEqual(s.ui.saving);
  });
  it('when it is written: what was sent goes from the draft; what was typed meanwhile and a month being recorded stay', () => {
    let s = reduce(typedState(), auto);
    s = reduce(s, { type: A.PLAN_EDIT, planId: SAVER.id, path: 'want.stopAge', value: '58' });
    const saved = reduce(s, { type: A.PLAN_SAVED, planId: SAVER.id, previous: { x: 1 }, line: null, op: 'saving' });
    expect(saved.draft.plan.values).toEqual({ 'record.pension': '91000', 'want.stopAge': '58' });
    expect(saved.ui.saving).toBe(null);
  });
  it('Save pressed (not left): as before, the whole draft goes and every box is asked', () => {
    const s = reduce(typedState(), { type: A.PLAN_SAVE, planId: SAVER.id });
    expect(s.ui.saving).toEqual({ planId: SAVER.id, kind: 'save' });
    expect(reduce(s, { type: A.PLAN_SAVED, planId: SAVER.id, previous: {}, line: null }).draft.plan).toEqual(emptyPlanDraft());
  });
});

describe('the write: one at a time, nothing lost', () => {
  it('a box left during a write is written straight after it, with what it shows', async () => {
    const fb = fakeLite();
    const p = page({ typed: { isaMonthly: '150' }, fb });
    p.store.dispatch(auto);
    p.store.dispatch({ type: A.PLAN_EDIT, planId: SAVER.id, path: 'escalationPct', value: '3' });
    p.store.dispatch(auto);
    await tick(20);
    // the write reads the plan and the boxes just before it goes: both figures are in the plan, whether in one write or two
    expect(fb.writes.length).toBeGreaterThanOrEqual(1);
    let plan = copy(SAVER);
    for (const w of fb.writes) plan = applyPatch(plan, w.data);
    expect(plan.accumulationTool.settings.isaMonthly).toBe(150);
    expect(plan.accumulationTool.settings.escalationPct).toBe(3);
    expect(p.store.getState().draft.plan.values).toEqual({});
    expect(p.store.getState().ui.saveAgain || null).toBe(null);
    p.stop();
  });
});

describe('the page: leaving a box with a change starts the save', () => {
  const draw = (state, dispatch) => { const root = document.createElement('div'); root.id = 'app'; document.body.appendChild(root); render(h(App, { state, dispatch }), root); return root; };
  it('"What you want": a new amount, left — the save starts; left again with nothing new — nothing', () => {
    const p = page({ typed: { 'want.monthly': '2500' } });
    const sent = [];
    const root = draw(p.store.getState(), (a) => sent.push(a));
    const box = root.querySelector('[data-testid="plan.saving.want.monthly"]');
    expect(box).not.toBe(null);
    box.dispatchEvent(new Event('blur'));
    expect(sent).toContainEqual({ type: 'plan/save', planId: SAVER.id, auto: true });
    p.stop();
    const q = page();
    const sent2 = [];
    const root2 = draw(q.store.getState(), (a) => sent2.push(a));
    root2.querySelector('[data-testid="plan.saving.want.monthly"]').dispatchEvent(new Event('blur'));
    expect(sent2.filter((a) => a.type === 'plan/save')).toEqual([]);
    q.stop();
  });
  it('what goes in: a new pay-in, left — the save starts', () => {
    const p = page({ typed: { netMonthly: '400' } });
    const sent = [];
    const root = draw(p.store.getState(), (a) => sent.push(a));
    root.querySelector('[data-testid="plan.saving.netMonthly"]').dispatchEvent(new Event('blur'));
    expect(sent).toContainEqual({ type: 'plan/save', planId: SAVER.id, auto: true });
    p.stop();
  });
});
void GUEST_PLANS_KEY;
