/**
 * A keep that reached the server but whose answer was lost (effects/planWrite.js keep; the stamp kept as keep[q].pending).
 * Before, the panel said "Nothing was kept", the name stayed in the box, and each retry made another plan: Alex, Alex (2),
 * Alex (3). Now the create carries a stamp chosen once (the new plan's createdAt), kept in the draft until the plan is told
 * as made: after a lost answer the account is read again and the plan found; a retry, even after a reload, finds it too and
 * never makes a second; and "Nothing was kept" is said only when the account as read holds nothing. The same for V7's "Move
 * to a new plan" whose close failed after its new plan was made: trying again carries on with that plan.
 * A fake server is shared by the create and the fresh read. Fictional: "Alex"; fixture 13 for the move.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { draftOf, saveDraft, loadDraft } from '../../../src/v7/effects/draftStore.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { KEEP } from '../../../src/v7/copy/keep.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus } from './_plans.js';

const C = corpus();
const TODAY = '2026-09-30';
const BASE = Date.parse('2026-09-30T14:03:22.511Z');
const tick = async (n = 12) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const states = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
const loaded = (q, name) => reduce(initialState({ today: TODAY, build: 'test' }), { type: A.STATE_REPLACE, state: states(q, name) });
const memory = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

/**
 * The server: one list of plans, read by the fresh read and written by the create and the write. Each create and each write
 * takes the next way from its queue: 'ok'; 'lost' (written, then the answer is lost: a rejection); 'hang' (written, no answer
 * ever); 'notSent' (rejected, nothing written). `readFails` makes the fresh read fail.
 */
function server(raws = []) {
  const s = { docs: raws.map(copy), adds: [], updates: [], addWays: [], updateWays: [], readFails: false, n: 0 };
  s.fb = {
    doc: (db, ...path) => ({ path: path.join('/'), id: path[path.length - 1] }),
    collection: (db, ...path) => ({ path: path.join('/') }),
    addDoc: (coll, data) => {
      const how = s.addWays.shift() || 'ok';
      if (how === 'notSent') return Promise.reject(new Error('offline'));
      const id = 'Srv' + (++s.n) + 'PlanId';
      s.docs.push({ ...copy(data), id });
      s.adds.push(id);
      if (how === 'lost') return Promise.reject(new Error('the answer was lost'));
      if (how === 'hang') return new Promise(() => {});
      return Promise.resolve({ id });
    },
    updateDoc: (ref, data) => {
      const how = s.updateWays.shift() || 'ok';
      if (how === 'notSent') return Promise.reject(new Error('offline'));
      const i = s.docs.findIndex((d) => String(d.id) === ref.id);
      if (i >= 0) s.docs[i] = applyPatch(s.docs[i], copy(data));
      s.updates.push({ id: ref.id, data: copy(data) });
      return how === 'lost' ? Promise.reject(new Error('the answer was lost')) : Promise.resolve();
    },
    deleteDoc: () => Promise.resolve()
  };
  s.names = () => s.docs.map((d) => d.planDetails.name);
  return s;
}

/** A page signed in, on question q's keep step (or Your plans), its plans read from the server; a clock that moves on. */
function page(srv, { q = 'b', name = 'answer-B1', state = null, route = null } = {}) {
  const store = createStore(state || loaded(q, name), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse(route || `#/${q}/keep`) });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  const at = (t) => new Date(BASE + t * 1000);
  let t = 0;
  const read = () => {
    if (srv.readFails) store.dispatch({ type: A.PLANS_FAILED });
    else store.dispatch({ type: A.PLANS_SET, list: upgradedList(copy(srv.docs), at(t)), source: 'account', readAt: '14:03' });
  };
  read();
  store.subscribe((s) => { if (s.plans && s.plans.status === 'read' && !s.plans.view && s.route.screen === 'plans') store.dispatch({ type: A.PLANS_VIEW, view: viewFor(s) }); });
  const handles = () => ({ db: { name: 'db' }, user: { uid: 'u1', email: 'a@b.c', emailVerified: true }, reread: () => { read(); return Promise.resolve(); } });
  const stop = startPlanWrite(store, { win: null, session: memory(), local: memory(), now: () => at(++t), fb: srv.fb, client: null, handles, rand: Math.random });
  return { store, stop, read, keep: () => store.dispatch({ type: A.KEEP_SAVE, q }), k: () => store.getState().keep[q] };
}
const named = (p, name) => p.store.dispatch({ type: A.KEEP_NAME, q: 'b', value: name });

describe('a keep whose answer was lost makes one plan, and says so', () => {
  it('written, then the answer lost: the account read again finds the plan — "Kept as", never "Nothing was kept"', async () => {
    const srv = server([C['01-fresh-default']]);
    const p = page(srv);
    named(p, 'Alex');
    srv.addWays.push('lost');
    p.keep();
    await tick();
    expect(srv.names()).toEqual([C['01-fresh-default'].planDetails.name, 'Alex']);
    expect(p.k()).toMatchObject({ saving: false, problem: null, pending: null, made: { id: srv.adds[0], name: 'Alex', where: 'account' } });
    p.stop();
  });

  it('written, the answer lost, and the account cannot be read: "could not tell", and the retry finds the plan instead of making a second', async () => {
    const srv = server();
    const p = page(srv);
    named(p, 'Alex');
    srv.addWays.push('lost');
    const keepRead = srv.fb;
    // the read after the lost answer fails (the line is down)
    const realAdd = keepRead.addDoc;
    keepRead.addDoc = (...a) => { const r = realAdd(...a); srv.readFails = true; return r; };
    p.keep();
    await tick();
    expect(p.k().problem).toBe('unsure');
    expect(p.k().pending).toMatch(/^2026-09-30T14:03:/);
    expect(KEEP.problems.unsure).not.toMatch(/Nothing was kept/);
    // pressed again while the account still cannot be read: nothing is made
    p.keep();
    await tick();
    expect(p.k().problem).toBe('unsure');
    expect(srv.adds.length).toBe(1);
    // the line is back: pressed again, the plan the first press made is the plan kept
    keepRead.addDoc = realAdd;
    srv.readFails = false;
    p.keep();
    await tick();
    expect(srv.names()).toEqual(['Alex']);
    expect(p.k()).toMatchObject({ problem: null, pending: null, made: { id: srv.adds[0], name: 'Alex' } });
    // the same figures as the plan was made from: nothing more is said
    expect(p.k().made.earlier).toBeUndefined();
    p.stop();
  });

  it('written, no answer ever, the page reloaded: the stamp comes back from the draft and the next press finds the plan', async () => {
    const srv = server();
    const p = page(srv);
    named(p, 'Alex');
    srv.addWays.push('hang');
    p.keep();
    await tick();
    expect(p.k().saving).toBe(true);
    const pending = p.k().pending;
    expect(pending).toMatch(/^2026-09-30T14:03:/);
    expect(srv.docs[0].createdAt).toBe(pending);
    // the reload: the tab's draft store keeps the stamp; the answer is worked out again (the pinned answer stands in for it)
    const tab = memory();
    expect(saveDraft(tab, draftOf(p.store.getState()))).toBe(true);
    const back = initialState({ today: TODAY, build: 'test', draft: loadDraft(tab) });
    expect(back.keep.b).toMatchObject({ name: 'Alex', saving: false, made: null, pending });
    p.stop();
    const again = page(srv, { state: reduce(loaded('b', 'answer-B1'), { type: A.STATE_REPLACE, state: { ...states('b', 'answer-B1'), keep: { b: { name: 'Alex', made: null, pending } } } }) });
    expect(again.k().pending).toBe(pending);
    again.keep();
    await tick();
    expect(srv.names()).toEqual(['Alex']);
    expect(again.k()).toMatchObject({ problem: null, pending: null, made: { id: srv.adds[0], name: 'Alex' } });
    again.stop();
  });

  it('not sent at all: "Nothing was kept" (the account as read holds nothing), and the retry makes exactly one', async () => {
    const srv = server();
    const p = page(srv);
    named(p, 'Alex');
    srv.addWays.push('notSent');
    p.keep();
    await tick();
    expect(p.k().problem).toBe('failed');
    expect(KEEP.problems.failed).toMatch(/Nothing was kept/);
    expect(srv.docs).toEqual([]);
    p.keep();
    await tick();
    expect(srv.names()).toEqual(['Alex']);
    expect(p.k().made).toMatchObject({ name: 'Alex' });
    p.stop();
  });

  it('a couple: the partner\'s plan made, yours not — the retry makes yours alone, linked to it', async () => {
    const srv = server();
    const p = page(srv, { name: 'answer-B5-couple' });
    named(p, 'Alex');
    srv.addWays.push('ok', 'notSent');
    p.keep();
    await tick();
    expect(p.k()).toMatchObject({ problem: 'partial', partnerKept: 'Alex · partner' });
    expect(srv.names()).toEqual(['Alex · partner']);
    p.keep();
    await tick();
    expect(srv.names()).toEqual(['Alex · partner', 'Alex']);
    const yours = srv.docs[1];
    expect(yours.household.partnerScenarioId).toBe(srv.adds[0]);
    expect(p.k()).toMatchObject({ problem: null, pending: null, made: { id: srv.adds[1], name: 'Alex', partnerId: srv.adds[0], partnerName: 'Alex · partner' } });
    p.stop();
  });

  it('a couple: the partner\'s plan made, yours not sent twice, then sent — one partner plan, under one stamp, linked', async () => {
    const srv = server();
    const p = page(srv, { name: 'answer-B5-couple' });
    named(p, 'Alex');
    srv.addWays.push('ok', 'notSent', 'notSent');
    p.keep();
    await tick();
    const stamp = p.k().pending;
    expect(p.k()).toMatchObject({ problem: 'partial' });
    p.keep();
    await tick();
    // the second try joined the partner's plan under the first stamp: the stamp kept is still that one
    expect(p.k()).toMatchObject({ problem: 'partial', pending: stamp });
    p.keep();
    await tick();
    expect(srv.names()).toEqual(['Alex · partner', 'Alex']);
    expect(srv.docs.map((d) => d.createdAt)).toEqual([stamp, stamp]);
    expect(srv.docs[1].household.partnerScenarioId).toBe(srv.adds[0]);
    expect(p.k()).toMatchObject({ problem: null, pending: null, made: { id: srv.adds[1], name: 'Alex', partnerId: srv.adds[0], partnerName: 'Alex · partner' } });
    p.stop();
  });

  it('a couple: the partner\'s plan made, yours not; the retry\'s answer lost — both found by the one stamp, told as made with the partner', async () => {
    const srv = server();
    const p = page(srv, { name: 'answer-B5-couple' });
    named(p, 'Alex');
    srv.addWays.push('ok', 'notSent', 'lost');
    p.keep();
    await tick();
    p.keep();
    await tick();
    expect(srv.names()).toEqual(['Alex · partner', 'Alex']);
    expect(p.k()).toMatchObject({ problem: null, pending: null, made: { id: srv.adds[1], partnerId: srv.adds[0], partnerName: 'Alex · partner' } });
    p.stop();
  });

  it('a plan an earlier press made, found by a later press with other figures on screen: "Kept as" says it holds the figures tried before', async () => {
    const srv = server();
    const p = page(srv);
    named(p, 'Alex');
    srv.addWays.push('lost');
    const realAdd = srv.fb.addDoc;
    srv.fb.addDoc = (...a) => { const r = realAdd(...a); srv.readFails = true; return r; };
    p.keep();
    await tick();
    expect(p.k().problem).toBe('unsure');
    // the plan made holds other figures than the ones on screen now (the person tried others in between)
    srv.docs[0].fromAnswer.inputs.you.pot += 1000;
    srv.fb.addDoc = realAdd;
    srv.readFails = false;
    p.keep();
    await tick();
    expect(srv.adds.length).toBe(1);
    expect(p.k().made).toMatchObject({ id: srv.adds[0], name: 'Alex', earlier: true });
    expect(KEEP.madeEarlier).toMatch(/figures you tried before/);
    p.stop();
  });

  it('a couple: both written, yours\' answer lost — both found, told as made', async () => {
    const srv = server();
    const p = page(srv, { name: 'answer-B5-couple' });
    named(p, 'Alex');
    srv.addWays.push('ok', 'lost');
    p.keep();
    await tick();
    expect(srv.names()).toEqual(['Alex · partner', 'Alex']);
    expect(p.k()).toMatchObject({ problem: null, made: { id: srv.adds[1], partnerId: srv.adds[0] } });
    p.stop();
  });
});

describe('V7\'s "Move to a new plan": the new plan made and the close failed — trying again carries on with that plan', () => {
  const LADDER = C['13-stopped-drawing-since'];
  const move = (p) => {
    p.store.dispatch({ type: A.PLAN_ACTION, planId: String(LADDER.id), kind: 'close' });
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: String(LADDER.id), month: '2027-04', name: 'Shares and cash', pots: null, partner: false });
  };
  it('the close refused once: said by name ("was made, but … could not be closed"); the second try makes no plan and closes onto the first', async () => {
    const srv = server([{ ...copy(LADDER), isActive: false }]);
    const p = page(srv, { state: initialState({ today: '2026-10-02', build: 'test' }), route: '#/plans' });
    srv.updateWays.push('notSent');
    move(p);
    await tick();
    expect(srv.adds.length).toBe(1);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: String(LADDER.id), problem: 'madeNotClosed', detail: 'Shares and cash' });
    expect(PLAN.list.actions.problems.madeNotClosed).toMatch(/was made/);
    move(p);
    await tick();
    expect(srv.adds.length).toBe(1);
    const old = srv.docs.find((d) => String(d.id) === String(LADDER.id));
    expect(old).toMatchObject({ closedAt: '2027-03', nextPlanId: srv.adds[0] });
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'done', op: 'closed', slots: { name: 'Shares and cash', id: srv.adds[0] } });
    p.stop();
  });
  it('the create\'s answer lost: the account read again finds the plan this move made, and the move carries on — never "Nothing was changed"', async () => {
    const srv = server([{ ...copy(LADDER), isActive: false }]);
    const p = page(srv, { state: initialState({ today: '2026-10-02', build: 'test' }), route: '#/plans' });
    srv.addWays.push('lost');
    move(p);
    await tick();
    expect(srv.adds.length).toBe(1);
    expect(p.store.getState().ui.saveProblem).toBe(null);
    expect(srv.docs.find((d) => String(d.id) === String(LADDER.id))).toMatchObject({ closedAt: '2027-03', nextPlanId: srv.adds[0] });
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'done', op: 'closed', slots: { id: srv.adds[0] } });
    p.stop();
  });

  it('the close\'s answer lost: the account read again shows it closed — the main plan moves to the new plan, and it is said as done', async () => {
    const srv = server([{ ...copy(LADDER), isActive: true }, { ...copy(C['01-fresh-default']), isActive: false }]);
    const p = page(srv, { state: initialState({ today: '2026-10-02', build: 'test' }), route: '#/plans' });
    srv.updateWays.push('lost');
    move(p);
    await tick();
    expect(srv.adds.length).toBe(1);
    expect(p.store.getState().ui.saveProblem).toBe(null);
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'done', op: 'closed' });
    const main = srv.docs.filter((d) => d.isActive === true).map((d) => d.id);
    expect(main).toEqual([srv.adds[0]]);
    p.stop();
  });

  it('the close landed, its answer lost and the account not read: the retry does what was left (the main plan), and makes nothing', async () => {
    const srv = server([{ ...copy(LADDER), isActive: true }]);
    const p = page(srv, { state: initialState({ today: '2026-10-02', build: 'test' }), route: '#/plans' });
    srv.updateWays.push('lost');
    const realUpdate = srv.fb.updateDoc;
    srv.fb.updateDoc = (...a) => { const r = realUpdate(...a); srv.readFails = true; return r; };
    move(p);
    await tick();
    expect(p.store.getState().ui.saveProblem).toMatchObject({ problem: 'madeNotClosed' });
    srv.fb.updateDoc = realUpdate;
    srv.readFails = false;
    // the plans read again (the page's "Read again"): the plan shows as closed onto the new one; the move pressed again
    p.read();
    move(p);
    await tick();
    expect(srv.adds.length).toBe(1);
    expect(p.store.getState().ui.saveProblem).toBe(null);
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'done', op: 'closed', slots: { id: srv.adds[0] } });
    expect(srv.docs.filter((d) => d.isActive === true).map((d) => d.id)).toEqual([srv.adds[0]]);
    p.stop();
  });

  it('this window: the close not kept — the retry finds the new plan as stored and makes no second', async () => {
    const tab = memory();
    const raw = { ...copy(LADDER), id: 'guest-ladder01', isActive: true };
    tab.setItem('pt_guest_scenarios', JSON.stringify([raw]));
    let sets = 0;
    const flaky = { ...tab, setItem: (k, v) => { sets += 1; if (sets === 2) throw new Error('full'); tab.setItem(k, v); } };
    const store = createStore(initialState({ today: '2026-10-02', build: 'test' }), reduce);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'nobody', email: null } });
    const read = () => store.dispatch({ type: A.PLANS_SET, list: upgradedList(JSON.parse(tab.getItem('pt_guest_scenarios')), new Date(BASE)), source: 'window', readAt: '14:03' });
    read();
    // the page's list is NOT read again between the tries: the window's plans as stored must be what the retry looks at
    const stop = startPlanWrite(store, { win: null, session: flaky, local: memory(), now: () => new Date(BASE), fb: null, client: null, handles: () => ({}), rand: Math.random });
    const go = () => {
      store.dispatch({ type: A.PLAN_ACTION, planId: raw.id, kind: 'close' });
      store.dispatch({ type: A.PLAN_CLOSE, planId: raw.id, month: '2027-04', name: 'Shares and cash', pots: null, partner: false });
    };
    go();
    await tick();
    expect(store.getState().ui.saveProblem).toMatchObject({ problem: 'madeNotClosed', detail: 'Shares and cash' });
    go();
    await tick();
    const names = JSON.parse(tab.getItem('pt_guest_scenarios')).map((d) => d.planDetails.name);
    expect(names).toEqual([LADDER.planDetails.name, 'Shares and cash']);
    expect(store.getState().ui.toast).toMatchObject({ kind: 'done', op: 'closed' });
    stop();
  });

  it('a move from another month is a move of its own: its own new plan', async () => {
    const srv = server([{ ...copy(LADDER), isActive: false }]);
    const p = page(srv, { state: initialState({ today: '2026-10-02', build: 'test' }), route: '#/plans' });
    srv.updateWays.push('notSent');
    move(p);
    await tick();
    p.store.dispatch({ type: A.PLAN_ACTION, planId: String(LADDER.id), kind: 'close' });
    p.store.dispatch({ type: A.PLAN_CLOSE, planId: String(LADDER.id), month: '2027-05', name: '', pots: null, partner: false });
    await tick();
    expect(srv.adds.length).toBe(2);
    p.stop();
  });
});
