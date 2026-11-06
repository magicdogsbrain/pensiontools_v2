/**
 * "Move to a new plan" in V7 (6.56.0, research/plan-start.md §2 I; services/PlanClose.js) through the one write file
 * (effects/planWrite.js closePlan): the new plan through the ONE create, then ONE write of the close's two keys to the old
 * plan, then — on the person's say — ONE write of the partner's link; every path declared, the guard asked before anything is
 * made; the reducer's checks of the box; and the row's box drawn. Fixture 13 (Alex, locked, records, a holdings record) is the
 * plan moved; 09/10 (a couple) the partner's link.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { successorOf } from '../../../src/services/PlanClose.js';
import { lockedPlanWriteRefusal } from '../../../src/services/LockedPlanGuard.js';
import { getDefaultStressSettings } from '../../../src/storage/stressDefaults.js';
import { planProblems } from '../../../src/answers/keep/planCreate.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { corpus } from '../plan/_plans.js';

const C = corpus();
const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const tick = async (n = 10) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const seededRand = (seed = 7) => () => { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646; };

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return { calls, getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; }, setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); }, removeItem(k) { map.delete(k); }, raw: (k) => map.get(k) };
}
function fakeLite() {
  const writes = [], adds = [];
  return {
    writes, adds,
    doc: (db, ...path) => ({ db, path: path.join('/') }),
    collection: (db, ...path) => ({ db, path: path.join('/') }),
    updateDoc: (ref, data) => { writes.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); },
    addDoc: (coll, data) => { adds.push({ path: coll.path, data: copy(data) }); return Promise.resolve({ id: 'New' + adds.length + 'PlanId' }); },
    deleteDoc: () => Promise.resolve()
  };
}
function page({ raws, session = 'in', fb = fakeLite() }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const source = session === 'in' ? 'account' : 'window';
  store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, NOW), source, readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  const user = session === 'in' ? { uid: 'u1', email: 'a@b.c', emailVerified: true } : null;
  const handles = () => ({ auth: {}, db: session === 'in' ? { name: 'db' } : null, user, reread: () => Promise.resolve() });
  const sess = storage(session === 'in' ? {} : { [GUEST_PLANS_KEY]: JSON.stringify(raws) });
  store.subscribe((s) => { if (s.plans && s.plans.status === 'read' && !s.plans.view) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(s) }); });
  const stop = startPlanWrite(store, { win: null, session: sess, local: storage(), now: () => NOW, fb, client: null, handles, rand: seededRand() });
  return { store, fb, sess, stop, problem: () => store.getState().ui.saveProblem, toast: () => store.getState().ui.toast };
}
const LADDER = C['13-stopped-drawing-since'];
const DRAFT = C['02-pnv-draft'];
const notActive = (p) => ({ ...copy(p), isActive: false });
const ask = (p, plan) => p.store.dispatch({ type: A.PLAN_ACTION, planId: String(plan.id), kind: 'close' });

describe('Move to a new plan: the new plan, then the close, each the one write', () => {
  it('an account: ONE addDoc of the new plan (the shared rules), then ONE updateDoc of closedAt and nextPlanId; the guard lets exactly these through; the toast names both', async () => {
    const p = page({ raws: [notActive(DRAFT), LADDER] });
    ask(p, LADDER);
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2027-04', name: 'Shares and cash', pots: null, partner: false });
    expect(p.store.getState().ui.saving).toMatchObject({ kind: 'close', month: '2027-04', name: 'Shares and cash' });
    await tick();
    expect(p.fb.adds.length).toBe(1);
    const made = p.fb.adds[0].data;
    const plan = upgradeScenario(LADDER, { now: NOW }).scenario;
    const want = upgradeScenario({ ...successorOf(plan, { month: '2027-04', name: 'Shares and cash', now: NOW }), createdAt: NOW.toISOString(), lastModified: NOW.toISOString() }, { now: NOW }).scenario;
    expect(made).toEqual(want);
    expect(made.stressTool.settings.firstTaxYear).toBe(2027);
    expect(made.decisionTool.settings.locked).toBe(false);
    expect(made.before).toEqual({ kind: 'plan', planId: LADDER.id, from: '2027-04' });
    expect(planProblems(made)).toEqual([]);
    // the close, then — the closed plan was the main plan — the new plan made the main one (makeMain's two writes of the flag)
    expect(LADDER.isActive).toBe(true);
    expect(p.fb.writes).toEqual([
      { path: 'users/u1/scenarios/' + LADDER.id, data: { closedAt: '2027-03', nextPlanId: 'New1PlanId', lastModified: NOW.toISOString() } },
      { path: 'users/u1/scenarios/' + LADDER.id, data: { isActive: false } },
      { path: 'users/u1/scenarios/New1PlanId', data: { isActive: true } }
    ]);
    for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(ALL_WRITES).toContain(k);
    expect(lockedPlanWriteRefusal(plan, p.fb.writes[0].data, getDefaultStressSettings())).toBe(null);
    expect(p.toast()).toMatchObject({ kind: 'done', op: 'closed', slots: { name: 'Shares and cash', id: 'New1PlanId', old: 'Linkers since 2024', month: 'April 2027' } });
    p.stop();
  });
  it('this window: the new plan appended with a window id, then the close folded onto the old plan; every other plan byte-identical', async () => {
    const p = page({ raws: [notActive(DRAFT), LADDER], session: 'nobody' });
    ask(p, LADDER);
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2026-11', name: '', pots: null, partner: false });
    await tick();
    const list = JSON.parse(p.sess.raw(GUEST_PLANS_KEY));
    expect(list.length).toBe(3);
    const made = list[2];
    expect(made.id).toMatch(/^guest-/);
    expect(made.planDetails.name).toBe('Linkers since 2024 from November 2026');
    expect(made.stressTool.settings.firstTaxYear).toBe(2026);
    const old = list.find((x) => x.id === LADDER.id);
    expect(old.closedAt).toBe('2026-10');
    expect(old.nextPlanId).toBe(made.id);
    expect([old.isActive, made.isActive]).toEqual([false, true]);   // the main plan moved with the close
    expect(JSON.stringify(list[0])).toBe(JSON.stringify(notActive(DRAFT)));
    expect(p.fb.adds).toEqual([]);
    p.stop();
  });
  it('the partner\'s link moves on the person\'s say: ONE more write, of the link alone, to the partner\'s plan', async () => {
    const partner = notActive(C['10-couple-b']);
    const ours = { ...copy(LADDER), household: { partnerScenarioId: partner.id } };
    const p = page({ raws: [ours, { ...partner, household: { partnerScenarioId: LADDER.id } }] });
    ask(p, ours);
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2027-04', name: 'Next', pots: null, partner: true });
    await tick();
    expect(p.fb.adds[0].data.household.partnerScenarioId).toBe(partner.id);
    expect(p.fb.writes.map((w) => w.path).slice(0, 2)).toEqual(['users/u1/scenarios/' + LADDER.id, 'users/u1/scenarios/' + partner.id]);
    expect(p.fb.writes[1].data).toEqual({ 'household.partnerScenarioId': 'New1PlanId', lastModified: NOW.toISOString() });
    p.stop();
  });
  it('refused before anything is made: a month the box did not offer, a plan not offered the move, a closed plan', async () => {
    const p = page({ raws: [notActive(DRAFT), LADDER, C['18-moved-to-new-plan']] });
    ask(p, LADDER);
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2030-01', name: '', pots: null, partner: false });
    await tick();
    expect(p.problem()).toMatchObject({ planId: LADDER.id, problem: 'notClosable' });
    p.store.dispatch({ type: A.PLAN_ACTION, planId: DRAFT.id, kind: 'close' });
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: DRAFT.id, month: '2026-10', name: '', pots: null, partner: false });
    await tick();
    expect(p.problem()).toMatchObject({ planId: DRAFT.id, problem: 'notClosable' });
    const closedId = C['18-moved-to-new-plan'].id;
    p.store.dispatch({ type: A.PLAN_ACTION, planId: closedId, kind: 'close' });
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: closedId, month: '2026-10', name: '', pots: null, partner: false });
    await tick();
    expect(p.problem()).toMatchObject({ planId: closedId, problem: 'notClosable' });
    expect(p.fb.adds).toEqual([]);
    expect(p.fb.writes).toEqual([]);
    p.stop();
  });
  it('the reducer: only from the row\'s own box; a month that is not one, and a pension pot that is not a figure, said in words', () => {
    const p = page({ raws: [LADDER] });
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2027-04', name: '', pots: null, partner: false });
    expect(p.store.getState().ui.saving).toBe(null);   // no box open
    ask(p, LADDER);
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2027-13', name: '', pots: null, partner: false });
    expect(p.problem()).toEqual({ planId: LADDER.id, problem: 'notClosable' });
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2027-04', name: '', pots: { pension: 'lots', isa: '', gia: '' }, partner: false });
    expect(p.problem()).toEqual({ planId: LADDER.id, problem: 'noPots' });
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2027-04', name: '  Next  ', pots: { pension: '£250,000', isa: '', gia: '0' }, partner: false });
    expect(p.store.getState().ui.saving).toEqual({ planId: LADDER.id, kind: 'close', month: '2027-04', name: 'Next', pots: { pension: 250000, isa: 0, gia: 0 }, partner: false });
    p.stop();
  });
});

describe('the row\'s box, drawn', () => {
  it('says what happens, offers the months with their tax years, the name, the pots held; the closed plan sits under "Previous plans" with no move', async () => {
    const p = page({ raws: [notActive(DRAFT), LADDER, C['18-moved-to-new-plan'], C['18-moved-to-new-plan-next']] });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const draw = () => render(h(App, { state: p.store.getState(), dispatch: p.store.dispatch }), root);
    draw();
    expect(root.querySelector(`[data-testid="plans.close.${C['18-moved-to-new-plan'].id}"]`)).toBe(null);
    expect(root.querySelector(`[data-testid="plans.close.${DRAFT.id}"]`)).toBe(null);
    expect(root.querySelector('[data-testid="plans.group.previous"]').textContent).toContain('Closed March 2025; carried on as ‘Pots and valves from April 2025’.');
    ask(p, LADDER);
    draw();
    await tick(2);
    const box = root.querySelector(`[data-testid="plans.closeBox.${LADDER.id}"]`);
    expect(box).not.toBe(null);
    const month = box.querySelector('[data-testid="plans.close.month"]');
    expect(month.value).toBe('2026-10');
    expect([...month.options].map((o) => o.textContent).slice(0, 2)).toEqual(['October 2026 (tax year 2026/27)', 'November 2026 (tax year 2026/27)']);
    expect(box.querySelector('[data-testid="plans.close.name"]').value).toBe('Linkers since 2024 from October 2026');
    // always asked, filled in from the newest figure for each pot, each said where it came from
    expect(box.querySelector('[data-testid="plans.close.from"]').textContent).toBe('Put in what you hold today. The boxes are filled in from your record for September 2026 for the pension; What you hold (8 November 2024) for the ISAs; this plan’s own figure for the ordinary investment account. What you hold moves to the new plan.');
    expect(box.querySelector('[data-testid="plans.close.pension"]').value).toBe('429700');
    expect(box.querySelector('[data-testid="plans.close.isa"]').value).toBe('15030');
    const words = visibleText(box);
    expect(bannedHits(words, ['all', 'record', 'retired'])).toEqual([]);
    render(null, root); root.remove();
    p.stop();
  });
});
