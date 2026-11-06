/**
 * "I'm going back to work" in V7 (research/plan-start.md §2 J; services/PlanClose.js reason 'working') through the one write
 * file (effects/planWrite.js closePlan): the same close as "Move to a new plan" — the new plan through the ONE create, then
 * ONE write of the close's two keys — the new plan a saving plan stopping again at the month or age the box was given; the
 * reducer's and the write file's checks of the stop; the row's menu and box drawn; and the saving plan's pages (What you pay
 * in, the check-in, the plan page) and the closed plan's line, drawn from fixture 19, saying the limit carried and the
 * reason, in words banned.js lets through. Fixture 13 (Alex, locked, drawing since 2024) is the plan closed here.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
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
import { savingOf, askFillOf } from '../../../src/answers/plan/saving.js';
import { flexibleAccessWords } from '../../../src/services/FlexibleAccess.js';
import { keepView, currentKey } from '../../../src/v7/state/select.js';
import { keptDraft } from '../../../src/v7/state/initial.js';
import { saveDraft, loadDraft, draftOf } from '../../../src/v7/effects/draftStore.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkInOf } from '../../../src/answers/plan/checkIn.js';
import { saverInputsOf, saverDraftOf } from '../../../src/answers/plan/saverInputs.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { SAVING } from '../../../src/v7/copy/saving.js';
import { CHECKIN } from '../../../src/v7/copy/checkin.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { corpus, entriesAt, stateWith } from '../plan/_plans.js';

const C = corpus();
const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const tick = async (n = 10) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const seededRand = (seed = 7) => () => { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646; };

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  return { getItem(k) { return map.has(k) ? map.get(k) : null; }, setItem(k, v) { map.set(k, String(v)); }, removeItem(k) { map.delete(k); }, raw: (k) => map.get(k) };
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
function page({ raws, fb = fakeLite() }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, NOW), source: 'account', readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  const handles = () => ({ auth: {}, db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
  store.subscribe((s) => { if (s.plans && s.plans.status === 'read' && !s.plans.view) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(s) }); });
  const stop = startPlanWrite(store, { win: null, session: storage(), local: storage(), now: () => NOW, fb, client: null, handles, rand: seededRand() });
  return { store, fb, stop, problem: () => store.getState().ui.saveProblem, toast: () => store.getState().ui.toast };
}
const LADDER = C['13-stopped-drawing-since'];
const DRAFT = C['02-pnv-draft'];
const notActive = (p) => ({ ...copy(p), isActive: false });
const askWorking = (p, plan) => p.store.dispatch({ type: A.PLAN_ACTION, planId: String(plan.id), kind: 'close', reason: 'working' });
const close = (p, stop, month = '2026-11') => p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month, name: 'Saving again', pots: null, partner: false, reason: 'working', stop });

describe('I\'m going back to work: the same close, a saving plan made', () => {
  it('an account: ONE addDoc of the saving plan (the shared rules), then ONE updateDoc of closedAt and nextPlanId; the toast says it saves', async () => {
    const p = page({ raws: [notActive(DRAFT), notActive(LADDER)] });
    askWorking(p, LADDER);
    expect(p.store.getState().ui.action).toEqual({ planId: LADDER.id, kind: 'close', step: 1, text: '', reason: 'working' });
    close(p, { month: 'June 2030', age: '' });
    expect(p.store.getState().ui.saving).toMatchObject({ kind: 'close', reason: 'working', stop: { month: 'June 2030', age: '' } });
    await tick();
    expect(p.fb.adds.length).toBe(1);
    const made = p.fb.adds[0].data;
    const plan = upgradeScenario(LADDER, { now: NOW }).scenario;
    const want = upgradeScenario({ ...successorOf(plan, { month: '2026-11', name: 'Saving again', now: NOW, reason: 'working', stop: { month: '2030-06' } }), createdAt: NOW.toISOString(), lastModified: NOW.toISOString() }, { now: NOW }).scenario;
    expect(made).toEqual(want);
    expect(made.stressTool.settings).toMatchObject({ retired: false, stoppedWork: '2030-06', firstTaxYear: 2030 });
    expect(made.before).toEqual({ kind: 'working', from: '2026-11' });
    expect(made.flexibleAccess).toEqual({ since: '2024-11', fromPlanId: LADDER.id });
    expect(planProblems(made)).toEqual([]);
    expect(p.fb.writes).toEqual([{ path: 'users/u1/scenarios/' + LADDER.id, data: { closedAt: '2026-10', nextPlanId: 'New1PlanId', lastModified: NOW.toISOString() } }]);
    for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(ALL_WRITES).toContain(k);
    expect(lockedPlanWriteRefusal(plan, p.fb.writes[0].data, getDefaultStressSettings())).toBe(null);
    expect(p.toast()).toMatchObject({ kind: 'done', op: 'closedWorking', slots: { name: 'Saving again', old: 'Linkers since 2024', month: 'November 2026' } });
    p.stop();
  });
  it('an age instead of a month: no month kept, the age decides', async () => {
    const p = page({ raws: [notActive(LADDER)] });
    askWorking(p, LADDER);
    close(p, { month: '', age: '66' });
    await tick();
    expect(p.fb.adds[0].data.stressTool.settings).toMatchObject({ retired: false, stoppedWork: null, retireAge: 66 });
    p.stop();
  });
  it('the reducer keeps the box open with no stop given; the write file refuses a stop that is not one, before anything is made', async () => {
    const p = page({ raws: [notActive(LADDER)] });
    askWorking(p, LADDER);
    close(p, { month: ' ', age: '' });
    expect(p.problem()).toEqual({ planId: LADDER.id, problem: 'stopNone' });
    expect(p.store.getState().ui.action).toMatchObject({ kind: 'close', reason: 'working' });
    // an age that is not ahead is refused as an age ('stopAgeSoon'), so the words say the age is the problem
    for (const [stop, problem] of [[{ month: 'Junetember 2030', age: '' }, 'stopMonth'], [{ month: 'October 2026', age: '' }, 'stopSoon'], [{ month: '', age: 'sixty' }, 'stopAge'], [{ month: '', age: '63' }, 'stopAgeSoon']]) {
      askWorking(p, LADDER);
      close(p, stop);
      await tick();
      expect(p.problem(), JSON.stringify(stop)).toMatchObject({ planId: LADDER.id, problem });
    }
    expect(p.fb.adds).toEqual([]);
    expect(p.fb.writes).toEqual([]);
    for (const k of ['stopNone', 'stopMonth', 'stopAge', 'stopSoon', 'stopAgeSoon', 'stopLate', 'noAge']) expect(PLAN.list.actions.problems[k]).toBeTypeOf('string');
    expect(PLAN.list.actions.problems.stopAgeSoon).toBe('Give an age older than you are today, which you reach after the month you go back to work.');
    p.stop();
  });
  it('a plain move is as it was: no reason on the box, no stop asked', () => {
    const p = page({ raws: [notActive(LADDER)] });
    p.store.dispatch({ type: A.PLAN_ACTION, planId: LADDER.id, kind: 'close' });
    expect(p.store.getState().ui.action).toEqual({ planId: LADDER.id, kind: 'close', step: 1, text: '' });
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: LADDER.id, month: '2026-11', name: 'Next', pots: null, partner: false, reason: 'working', stop: { month: '2030-06' } });
    expect(p.store.getState().ui.saving).toEqual({ planId: LADDER.id, kind: 'close', month: '2026-11', name: 'Next', pots: null, partner: false });
    p.stop();
  });
});

describe('drawn', () => {
  const SCOPES = ['all', 'record', 'retired', 'planner'];
  it('the row offers it beside the move; its box asks when work starts again and stops again, and says the limit carried', async () => {
    const p = page({ raws: [notActive(DRAFT), notActive(LADDER)] });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const draw = () => render(h(App, { state: p.store.getState(), dispatch: p.store.dispatch }), root);
    draw();
    expect(root.querySelector(`[data-testid="plans.closeWorking.${LADDER.id}"]`).textContent).toBe('I’m going back to work');
    expect(root.querySelector(`[data-testid="plans.closeWorking.${DRAFT.id}"]`)).toBe(null);
    askWorking(p, LADDER);
    draw();
    await tick(2);
    const box = root.querySelector(`[data-testid="plans.closeBox.${LADDER.id}"]`);
    expect(box.getAttribute('data-reason')).toBe('working');
    expect([...box.querySelector('[data-testid="plans.close.month"]').options].map((o) => o.textContent).slice(0, 2)).toEqual(['October 2026', 'November 2026']);
    expect(box.querySelector('[data-testid="plans.close.stopMonth"]')).not.toBe(null);
    expect(box.querySelector('[data-testid="plans.close.stopAge"]')).not.toBe(null);
    expect(box.querySelector('[data-testid="plans.close.name"]').value).toBe('Linkers since 2024, back to work from October 2026');
    expect(box.querySelector('[data-testid="plans.close.flexible"]').textContent).toBe('Since you took money from your pension flexibly in November 2024, what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply. The new plan carries this.');
    expect(box.querySelector('[data-testid="plans.close.yes"]').textContent).toBe('Close this plan and start saving');
    expect(bannedHits(visibleText(box), SCOPES)).toEqual([]);
    render(null, root); root.remove();
    p.stop();
  });
  it('fixture 19: the closed plan says why, under "Previous plans"; the saving plan says what came before it and is a saver', () => {
    const entries = entriesAt(TODAY);
    const root = document.createElement('div');
    render(h(App, { state: stateWith(entries, '#/plans'), dispatch: () => {} }), root);
    const previous = root.querySelector('[data-testid="plans.group.previous"]');
    expect(previous.textContent).toContain('Closed June 2025: back to work; carried on as ‘Saving again from July 2025’.');
    render(h(App, { state: stateWith(entries, '#/plan/' + C['19-back-to-work-saving'].id), dispatch: () => {} }), root);
    expect(root.querySelector('[data-testid="plan.before"]').textContent).toContain('Under your previous plan ‘Drawing from 57’ until June 2025 — its months are there.');
    expect(root.querySelector('[data-testid="plan.stageLine"]').textContent).toContain(PLAN.stageLines.approaching);
    expect(bannedHits(visibleText(root), ['all'])).toEqual([]);
    render(null, root);
  });
  it('What you pay in and the check-in say the limit carried, and when what goes in is more; a plan without it says nothing new', () => {
    const entries = entriesAt(TODAY);
    const id = C['19-back-to-work-saving'].id;
    const v = savingOf(entries, id, { today: TODAY });
    expect(v.allowance).toEqual({ month: 'October 2023', over: false, yearly: '£9,000' });
    expect(v.warnings).toEqual([]);
    expect(savingOf(entries, id, { today: TODAY, typed: { netMonthly: '700' } }).allowance).toMatchObject({ over: true, yearly: '£13,500' });
    expect(savingOf(entries, C['05-saver-committed'].id, { today: TODAY }).allowance).toBe(null);
    expect(checkInOf(entries, id, { today: TODAY }).allowance).toEqual({ month: 'October 2023', over: false, yearly: '£9,000' });
    // the plan's verdict, and "Am I saving enough?" opened from it, read the person as already drawing (B's own yes/no)
    const plan = entries.find((e) => e.plan.id === id).plan;
    expect(saverInputsOf(plan, { today: TODAY }).inputs.you.alreadyDrawing).toBe(true);
    expect(saverDraftOf(plan, { today: TODAY }).values['you.alreadyDrawing']).toBe(true);   // "Am I saving enough?" opened with the plan's figures
    expect(saverInputsOf(entries.find((e) => e.plan.id === C['05-saver-committed'].id).plan, { today: TODAY }).inputs.you.alreadyDrawing).not.toBe(true);
    const root = document.createElement('div');
    render(h(App, { state: stateWith(entries, '#/plan/' + id + '/saving'), dispatch: () => {} }), root);
    const line = root.querySelector('[data-testid="plan.saving.allowance"]');
    expect(line.textContent).toBe('Since you took money from your pension flexibly in October 2023, what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply.');
    expect(line.getAttribute('data-over')).toBe('0');
    render(h(App, { state: stateWith(entries, '#/plan/' + id + '/checkin'), dispatch: () => {} }), root);
    expect(root.querySelector('[data-testid="plan.checkin.allowance"]').textContent).toBe(line.textContent);
    render(null, root);
  });
  it('every new word passes banned.js', () => {
    const W = PLAN.list.actions;
    const words = [W.closeWorking, W.closeWorkingIntro, W.closeWorkingNew, W.closeWorkingMonth, W.closeStopAsk, W.closeStopMonth, W.closeStopAge, W.closeFlexible, W.closeWorkingYes, W.done.closedWorking,
      ...['stopNone', 'stopMonth', 'stopAge', 'stopSoon', 'stopAgeSoon', 'stopLate', 'noAge'].map((k) => W.problems[k]),
      PLAN.stageLines['closed-working'], PLAN.stageLines['closing-working'],
      SAVING.allowance, SAVING.allowanceOver, SAVING.notYet, SAVING.errors['record.month'].beforePlan,
      CHECKIN.allowance, CHECKIN.allowanceOver, CHECKIN.allowanceOverPlan, CHECKIN.notYet, CHECKIN.problems.notYet].map((t) => t.replace(/\{(\w+)\}/g, (m, k) => ({ month: 'March 2029', name: 'Saving', old: 'Drawing', yearly: '£12,000' }[k] || 'x')));
    for (const t of words) expect(bannedHits(t, ['all', 'retired', 'record', 'saver', 'planner', 'result']), t).toEqual([]);
  });
});

describe('the rule said one way, in the words both apps use', () => {
  it('V7\'s copies of the sentence are the planner\'s (services/FlexibleAccess.js flexibleAccessWords), month for month', () => {
    const at = (t) => t.replace('{month}', 'October 2023');
    expect(at(SAVING.allowance)).toBe(flexibleAccessWords('2023-10'));
    expect(at(CHECKIN.allowance)).toBe(flexibleAccessWords('2023-10'));
    expect(at(PLAN.list.actions.closeFlexible)).toBe(flexibleAccessWords('2023-10') + ' The new plan carries this.');
    expect(flexibleAccessWords('2023-10')).toContain('pay into pension pots');
  });
  it('over the limit: "more than £10,000", and before the first check-in what the plan says goes in', () => {
    expect(SAVING.allowanceOver).toBe('What goes in now comes to {yearly} a year, more than £10,000: the part above it is taxed back.');
    expect(CHECKIN.allowanceOverPlan).toBe(SAVING.allowanceOver);
    expect(CHECKIN.allowanceOver).toBe('What you said goes in comes to {yearly} a year, more than £10,000: the part above it is taxed back.');
    expect(PLAN.list.actions.closeWorkingNew).toContain('on its page ‘What you pay in’');
    // the saving plan paying in more than the limit, with no check-in yet: the check-in says what the plan says goes in
    const raws = Object.values(C).map((r) => (r.id === C['19-back-to-work-saving'].id ? { ...copy(r), accumulationTool: { ...copy(r.accumulationTool), settings: { ...copy(r.accumulationTool.settings), netMonthly: 700 } } } : r));
    const entries = entriesAt(TODAY, raws);
    const id = C['19-back-to-work-saving'].id;
    const v = checkInOf(entries, id, { today: TODAY });
    expect(v).toMatchObject({ first: true, allowance: { over: true } });
    const root = document.createElement('div');
    render(h(App, { state: stateWith(entries, '#/plan/' + id + '/checkin'), dispatch: () => {} }), root);
    const line = root.querySelector('[data-testid="plan.checkin.allowance"]');
    expect(line.getAttribute('data-over')).toBe('1');
    expect(line.textContent).toContain('What goes in now comes to ' + v.allowance.yearly + ' a year, more than £10,000');
    expect(line.textContent).not.toContain('What you said');
    render(null, root);
  });
});

describe('a change-over still to come (V7)', () => {
  const plan = upgradeScenario(LADDER, { now: NOW }).scenario;
  const made = { ...successorOf(plan, { month: '2027-06', name: 'Saving from June', now: NOW, reason: 'working', stop: { month: '2030-06' } }), id: 'SavingAhead01', createdAt: NOW.toISOString(), lastModified: NOW.toISOString() };
  it('What you pay in and the check-in say when the plan begins; the check-in takes no month before it', async () => {
    const entries = entriesAt(TODAY, [made, { ...copy(LADDER), closedAt: '2027-05', nextPlanId: made.id }]);
    const root = document.createElement('div');
    render(h(App, { state: stateWith(entries, '#/plan/' + made.id + '/checkin'), dispatch: () => {} }), root);
    expect(root.querySelector('[data-testid="plan.checkin.notYet"]').textContent).toBe('This plan carries on from June 2027, when you go back to work: check in with it from then. Until then your months are recorded on your previous plan.');
    expect(root.querySelector('[data-region="plan-checkin"]')).toBe(null);
    render(h(App, { state: stateWith(entries, '#/plan/' + made.id + '/saving'), dispatch: () => {} }), root);
    expect(root.querySelector('[data-testid="plan.saving.notYet"]').textContent).toBe('This plan carries on from June 2027, when you go back to work: record your pot here from then. Until then your months are recorded on your previous plan.');
    render(null, root);
    // pressed all the same (an old page): refused before anything is run or written
    const p = page({ raws: [notActive(made), { ...notActive(LADDER), closedAt: '2027-05', nextPlanId: made.id }] });
    p.store.dispatch({ type: A.PLAN_CHECK_IN, planId: made.id });
    await tick();
    expect(p.problem()).toEqual({ planId: made.id, problem: 'notYet' });
    expect(p.fb.writes).toEqual([]);
    p.stop();
  });
});

describe('the name box follows the month (V7)', () => {
  it('while it holds the default name it follows the month chosen; typed over, it stays', async () => {
    const p = page({ raws: [notActive(LADDER)] });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const draw = () => render(h(App, { state: p.store.getState(), dispatch: p.store.dispatch }), root);
    for (const working of [true, false]) {
      if (working) askWorking(p, LADDER); else p.store.dispatch({ type: A.PLAN_ACTION, planId: LADDER.id, kind: 'close' });
      draw();
      await tick(2);
      const box = root.querySelector(`[data-testid="plans.closeBox.${LADDER.id}"]`);
      const sel = box.querySelector('[data-testid="plans.close.month"]');
      const name = box.querySelector('[data-testid="plans.close.name"]');
      const said = (m) => (working ? 'Linkers since 2024, back to work from ' : 'Linkers since 2024 from ') + m;
      expect(name.value).toBe(said('October 2026'));
      sel.value = '2026-12';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      expect(name.value).toBe(said('December 2026'));
      name.value = 'My own name';
      sel.value = '2027-01';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      expect(name.value).toBe('My own name');
      render(null, root);
      p.store.dispatch({ type: A.PLAN_ACTION, planId: LADDER.id, kind: null });
    }
    root.remove();
    p.stop();
  });
});

describe('"Am I saving enough?" opened on the saving plan, kept as a plan', () => {
  const states = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
  const id = C['19-back-to-work-saving'].id;
  const FACT = { since: '2023-10', fromPlanId: C['19-back-to-work'].id };
  it('opened from the plan, B\'s draft carries the person\'s fact; it is kept across a reload and only B takes it', () => {
    const fill = askFillOf(entriesAt(TODAY), id, { today: TODAY });
    expect(fill.b.flexibleAccess).toEqual(FACT);
    expect('flexibleAccess' in askFillOf(entriesAt(TODAY), C['05-saver-committed'].id, { today: TODAY }).b).toBe(false);
    let s = reduce(initialState({ today: TODAY, build: 'test' }), { type: A.DRAFT_LOAD, q: 'b', values: fill.b.values, ...(fill.b.mixes ? { mixes: fill.b.mixes } : {}), flexibleAccess: fill.b.flexibleAccess });
    expect(s.draft.b.flexibleAccess).toEqual(FACT);
    expect(s.draft.b.values['you.alreadyDrawing']).toBe(true);
    const st = storage();
    saveDraft(st, draftOf(s));
    expect(keptDraft(loadDraft(st), 'b').flexibleAccess).toEqual(FACT);
    // refused: only B is opened from a saving plan (the test build throws on a refused action)
    expect(() => reduce(initialState({ today: TODAY, build: 'test' }), { type: A.DRAFT_LOAD, q: 'a', values: {}, flexibleAccess: FACT })).toThrow(/cannot take this fact/);
    expect(() => reduce(initialState({ today: TODAY, build: 'test' }), { type: A.DRAFT_LOAD, q: 'b', values: {}, flexibleAccess: { since: 'soon' } })).toThrow(/cannot take this fact/);
  });
  /** B's pinned answer, as if opened from the saving plan: the person has drawn (B's own yes/no), the fact with the draft. */
  function keepPage({ drawn, fact }) {
    const raw = states('b', 'answer-B1');
    raw.draft.b.values['you.alreadyDrawing'] = drawn;
    raw.answers.b.result.inputs.you.alreadyDrawing = drawn;
    if (fact) raw.draft.b.flexibleAccess = fact;
    let s = reduce(initialState({ today: raw.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: raw });
    raw.answers.b.inputsKey = currentKey(s, 'b');
    s = reduce(initialState({ today: raw.env.today, build: 'test' }), { type: A.STATE_REPLACE, state: raw });
    const store = createStore(s, reduce);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/b/keep') });
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([], NOW), source: 'account', readAt: '14:03' });
    const fb = fakeLite();
    const handles = () => ({ auth: {}, db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => Promise.resolve() });
    const stop = startPlanWrite(store, { win: null, session: storage(), local: storage(), now: () => NOW, fb, client: null, handles, rand: seededRand() });
    return { store, fb, stop };
  }
  it('the plan kept carries the fact, as a close does; not when the answer says the person has not drawn, nor without the fact', async () => {
    for (const [drawn, fact, carried] of [[true, FACT, true], [false, FACT, false], [true, null, false]]) {
      const p = keepPage({ drawn, fact });
      expect(keepView(p.store.getState(), 'b').can).toBe(true);
      p.store.dispatch({ type: A.KEEP_SAVE, q: 'b' });
      await tick();
      expect(p.fb.adds.length).toBe(1);
      const made = p.fb.adds[0].data;
      if (carried) expect(made.flexibleAccess).toEqual(FACT); else expect('flexibleAccess' in made).toBe(false);
      expect(planProblems(made)).toEqual([]);
      p.stop();
    }
  });
});
