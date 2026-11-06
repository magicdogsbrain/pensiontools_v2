/**
 * "Delete several" on Your plans (6.59.0): the person's own tidy-up of plans they no longer want — never ours. Ticks on the
 * rows, ONE confirm that names each ticked plan and the count, then each through the one delete (planWrite.js removeOne)
 * with its own refusals (never the last plan; a main plan's heir past the guard); a plan refused is named with why; nothing
 * not ticked is touched. In the account (one deleteDoc each) and in this window (each one setItem, every other plan byte for
 * byte). The fixtures are the committed test plans (fictional).
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
import { PLAN } from '../../../src/v7/copy/plan.js';
import { severalPlan } from '../../../src/v7/state/select.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { corpus } from '../plan/_plans.js';

const C = corpus();
const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const tick = async (n = 12) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const W = PLAN.list.actions;

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k), raw: (k) => map.get(k) };
}
/** The account as a server: the deletes and writes land on one list, which the fresh read reads. */
function page({ raws, session = 'in' }) {
  const docs = raws.map(copy);
  const deletes = [], writes = [];
  const fb = {
    doc: (db, ...path) => ({ path: path.join('/'), id: path[path.length - 1] }),
    collection: (db, ...path) => ({ path: path.join('/') }),
    updateDoc: (ref, data) => { writes.push({ id: ref.id, data: copy(data) }); return Promise.resolve(); },
    addDoc: () => Promise.reject(new Error('no create here')),
    deleteDoc: (ref) => { deletes.push(ref.id); const i = docs.findIndex((d) => String(d.id) === ref.id); if (i >= 0) docs.splice(i, 1); return Promise.resolve(); }
  };
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const sess = storage(session === 'in' ? {} : { [GUEST_PLANS_KEY]: JSON.stringify(raws) });
  const read = () => {
    const list = session === 'in' ? docs : JSON.parse(sess.getItem(GUEST_PLANS_KEY));
    store.dispatch({ type: A.PLANS_SET, list: upgradedList(copy(list), NOW), source: session === 'in' ? 'account' : 'window', readAt: '14:03' });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  };
  read();
  store.subscribe((s, a) => { if (a.type === A.PLANS_READING) Promise.resolve().then(read); });
  const handles = () => ({ auth: {}, db: session === 'in' ? { name: 'db' } : null, user: session === 'in' ? { uid: 'u1', email: 'a@b.c', emailVerified: true } : null, reread: () => { read(); return Promise.resolve(); } });
  const stop = startPlanWrite(store, { win: null, session: sess, local: storage(), now: () => NOW, fb, client: null, handles });
  const ids = () => (session === 'in' ? docs : JSON.parse(sess.getItem(GUEST_PLANS_KEY))).map((p) => String(p.id));
  return { store, docs, deletes, writes, sess, stop, ids, ui: () => store.getState().ui };
}
const tickAll = (p, list) => { p.store.dispatch({ type: A.PLANS_SEVERAL, on: true }); for (const pl of list) p.store.dispatch({ type: A.PLANS_TICK, planId: String(pl.id), on: true }); };
const FIVE = ['01-fresh-default', '02-pnv-draft', '04-buckets-running', '12-lumpy-db-gia', '13-stopped-drawing-since'].map((k) => C[k]);
const notActive = (p) => ({ ...copy(p), isActive: false });

describe('Delete several: the reducer', () => {
  it('nothing is deleted without the confirm that names each ticked plan; ticks only while the ticks are out', () => {
    const p = page({ raws: FIVE.map(notActive) });
    p.store.dispatch({ type: A.PLANS_TICK, planId: String(FIVE[0].id), on: true });
    expect(p.ui().several).toBe(null);
    p.store.dispatch({ type: A.PLANS_DELETE_SEVERAL });
    expect(p.ui().saving).toBe(null);
    tickAll(p, FIVE.slice(0, 2));
    expect(p.ui().several).toEqual({ ticked: [String(FIVE[0].id), String(FIVE[1].id)], confirm: false });
    p.store.dispatch({ type: A.PLANS_DELETE_SEVERAL });
    expect(p.ui().saving).toBe(null);
    p.store.dispatch({ type: A.PLANS_TICK, planId: String(FIVE[1].id), on: false });
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    expect(p.ui().several).toEqual({ ticked: [String(FIVE[0].id)], confirm: true });
    // a tick changed after the confirm opened closes it: the confirm always names what will go
    p.store.dispatch({ type: A.PLANS_TICK, planId: String(FIVE[2].id), on: true });
    expect(p.ui().several.confirm).toBe(false);
    // nothing ticked: no confirm
    p.store.dispatch({ type: A.PLANS_SEVERAL, on: true });
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    expect(p.ui().several.confirm).toBe(false);
    p.stop();
  });
});

describe('Delete several: the deletes, each the one delete', () => {
  it('an account: three ticked of five — those three gone (one deleteDoc each), the other two untouched', async () => {
    const p = page({ raws: FIVE.map(notActive) });
    const three = [FIVE[0], FIVE[2], FIVE[4]];
    tickAll(p, three);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    // two of them are locked: the one confirm is not enough, as a single delete of one is not
    p.store.dispatch({ type: A.PLANS_DELETE_SEVERAL });
    expect(p.ui().saving).toBe(null);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true, step: 2 });
    p.store.dispatch({ type: A.PLANS_DELETE_SEVERAL });
    expect(p.ui().saving).toMatchObject({ kind: 'deleteSeveral', planIds: three.map((x) => String(x.id)) });
    await tick();
    expect(p.deletes.sort()).toEqual(three.map((x) => String(x.id)).sort());
    expect(p.writes).toEqual([]);
    expect(p.ids().sort()).toEqual([FIVE[1], FIVE[3]].map((x) => String(x.id)).sort());
    expect(p.ui().severalDone).toEqual({ deleted: three.map((x) => ({ id: String(x.id), name: x.planDetails.name })), refused: [] });
    expect(p.ui().several).toBe(null);
    p.stop();
  });

  it('a locked plan ticked: nothing goes without the second confirm; no second confirm without a locked plan', () => {
    const p = page({ raws: FIVE.map(notActive) });
    tickAll(p, [FIVE[0], FIVE[1]]);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    // none locked: the second confirm is not opened, and the one confirm deletes
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true, step: 2 });
    expect(p.ui().several.step).toBeUndefined();
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: false });
    p.store.dispatch({ type: A.PLANS_TICK, planId: String(FIVE[2].id), on: true });
    // the second confirm only from the first
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true, step: 2 });
    expect(p.ui().several.confirm).toBe(false);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    p.store.dispatch({ type: A.PLANS_DELETE_SEVERAL });
    expect(p.ui().saving).toBe(null);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true, step: 2 });
    expect(p.ui().several).toMatchObject({ confirm: true, step: 2 });
    // a tick changed closes both confirms
    p.store.dispatch({ type: A.PLANS_TICK, planId: String(FIVE[3].id), on: true });
    expect(p.ui().several).toEqual({ ticked: [FIVE[0], FIVE[1], FIVE[2], FIVE[3]].map((x) => String(x.id)), confirm: false });
    p.stop();
  });

  it('every plan ticked: one has to stay, so it is left out before anything goes (the main plan here) — named, never deleted, still the main plan', async () => {
    const raws = [FIVE[0], FIVE[1], FIVE[3]].map((x, i) => ({ ...copy(x), isActive: i === 0 }));
    const p = page({ raws });
    tickAll(p, raws);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    expect(severalPlan(p.store.getState())).toEqual({ going: [String(raws[1].id), String(raws[2].id)], stays: String(raws[0].id), locked: [] });
    p.store.dispatch({ type: A.PLANS_DELETE_SEVERAL });
    expect(p.ui().saving.planIds).toEqual([String(raws[1].id), String(raws[2].id)]);
    await tick();
    expect(p.ids()).toEqual([String(raws[0].id)]);
    const done = p.ui().severalDone;
    expect(done.deleted.map((d) => d.name)).toEqual([raws[1].planDetails.name, raws[2].planDetails.name]);
    expect(done.refused).toEqual([]);
    expect(p.writes).toEqual([]);
    p.stop();
  });

  it('this window: the ticked plans gone from the list, every other plan byte for byte', async () => {
    const raws = FIVE.slice(0, 3).map(notActive).map((x, i) => ({ ...x, id: 'guest-0000000' + i }));
    const p = page({ raws, session: 'nobody' });
    tickAll(p, [raws[0], raws[2]]);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true, step: 2 });
    p.store.dispatch({ type: A.PLANS_DELETE_SEVERAL });
    await tick();
    expect(JSON.parse(p.sess.raw(GUEST_PLANS_KEY))).toEqual([raws[1]]);
    expect(p.ui().severalDone.deleted.length).toBe(2);
    p.stop();
  });

  // the main plan and the plan next in line to take its place both ticked: a plan that stays becomes the main one — in the
  // account (read again before each delete) and in this window (the plans taken as stored, not as first read)
  for (const session of ['nobody', 'in']) {
    it(`the main plan and the next in line both ticked (${session === 'in' ? 'an account' : 'this window'}): a plan that stays is the main plan after`, async () => {
      const raws = ['01-fresh-default', '02-pnv-draft', '07-pre-6.13-flat-params', '12-lumpy-db-gia'].map((k, i) => ({ ...copy(C[k]), isActive: i === 0, ...(session === 'in' ? {} : { id: 'guest-0000000' + i }) }));
      const p = page({ raws, session });
      tickAll(p, raws.slice(0, 2));
      p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
      p.store.dispatch({ type: A.PLANS_DELETE_SEVERAL });
      await tick();
      const left = session === 'in' ? p.docs.map((d) => ({ ...d, ...(p.writes.filter((w) => w.id === String(d.id)).reduce((o, w) => ({ ...o, ...w.data }), {})) })) : JSON.parse(p.sess.raw(GUEST_PLANS_KEY));
      expect(left.map((d) => String(d.id))).toEqual(raws.slice(2).map((d) => String(d.id)));
      expect(left.filter((d) => d.isActive === true).map((d) => String(d.id))).toEqual([String(raws[2].id)]);
      expect(p.ui().severalDone.refused).toEqual([]);
      p.stop();
    });
  }
});

describe('Delete several: drawn', () => {
  it('the ticks, the count, ONE confirm naming each plan (a locked one said so) and the count, then what was done; the words pass', async () => {
    const raws = [notActive(FIVE[0]), notActive(FIVE[1]), notActive(FIVE[4])];
    const p = page({ raws });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const draw = () => render(h(App, { state: p.store.getState(), dispatch: p.store.dispatch }), root);
    const one = (id) => root.querySelector(`[data-testid="${id}"]`);
    draw();
    expect(one('plans.several').textContent).toBe(W.several);
    expect(one(`plans.tick.${raws[0].id}`)).toBe(null);
    p.store.dispatch({ type: A.PLANS_SEVERAL, on: true });
    draw();
    expect(one('plans.severalCount').textContent).toBe(W.severalCount.none);
    expect(one('plans.severalGo').disabled).toBe(true);
    // while the ticks are out, the rows' own menus stand aside
    expect(one(`plans.delete.${raws[0].id}`)).toBe(null);
    const box = one(`plans.tick.${raws[0].id}`);
    expect(box.closest('label').textContent).toBe('Delete ‘' + raws[0].planDetails.name + '’');
    p.store.dispatch({ type: A.PLANS_TICK, planId: String(raws[0].id), on: true });
    p.store.dispatch({ type: A.PLANS_TICK, planId: String(raws[2].id), on: true });
    draw();
    expect(one('plans.severalCount').textContent).toBe('2 plans ticked.');
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    draw();
    const confirm = one('plans.severalBox');
    expect(confirm.getAttribute('data-count')).toBe('2');
    expect(confirm.querySelector('p').textContent).toBe('Delete these 2 plans? Their settings, records and budgets go with them. This cannot be undone.');
    const items = [...confirm.querySelectorAll('li')].map((li) => li.textContent);
    expect(items[0]).toBe('‘' + raws[0].planDetails.name + '’');
    expect(items[1]).toMatch(new RegExp('^‘' + raws[2].planDetails.name + '’ — locked \\('));
    expect(one('plans.severalYes').textContent).toBe('Yes, delete these 2 plans');
    expect(bannedHits(visibleText(root), ['all', 'record', 'retired', 'saver'])).toEqual([]);
    one('plans.severalYes').click();
    draw();
    // one of them is locked: asked again, by name, before anything goes
    expect(p.deletes).toEqual([]);
    expect(one('plans.severalBox').getAttribute('data-step')).toBe('2');
    expect(one('plans.severalBox').querySelector('p').textContent).toMatch(new RegExp('^‘' + raws[2].planDetails.name + '’ is locked \\(.+\\)\\. Delete it all the same\\?'));
    expect(one('plans.severalYes').textContent).toBe(W.severalLockedYes.one);
    expect(bannedHits(visibleText(root), ['all', 'record', 'retired', 'saver'])).toEqual([]);
    one('plans.severalYes').click();
    await tick();
    draw();
    expect(one('plans.severalDeleted').textContent).toBe('Deleted: ‘' + raws[0].planDetails.name + '’ and ‘' + raws[2].planDetails.name + '’.');
    expect(p.ids()).toEqual([String(raws[1].id)]);
    one('plans.severalDoneClose').click();
    draw();
    expect(one('plans.severalDone')).toBe(null);
    render(null, root); root.remove();
    p.stop();
  });

  it('every plan ticked: the count and the yes are for the plans that can go, and the one that stays is named before the yes', () => {
    const raws = [FIVE[0], FIVE[1], FIVE[3]].map((x, i) => ({ ...copy(x), isActive: i === 1 }));
    const p = page({ raws });
    const root = document.createElement('div');
    document.body.appendChild(root);
    tickAll(p, raws);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    render(h(App, { state: p.store.getState(), dispatch: p.store.dispatch }), root);
    const one = (id) => root.querySelector(`[data-testid="${id}"]`);
    expect(one('plans.severalBox').getAttribute('data-count')).toBe('2');
    expect(one('plans.severalBox').querySelector('p').textContent).toBe('Delete these 2 plans? Their settings, records and budgets go with them. This cannot be undone.');
    expect([...one('plans.severalBox').querySelectorAll('li')].map((li) => li.getAttribute('data-plan-id'))).toEqual([String(raws[0].id), String(raws[2].id)]);
    expect(one('plans.severalStays').textContent).toBe('One plan always has to stay, so ‘' + raws[1].planDetails.name + '’ stays.');
    expect(one('plans.severalYes').textContent).toBe('Yes, delete these 2 plans');
    render(null, root); root.remove();
    p.stop();
  });

  it('the example plan is named by what it is — the tick, the confirm and what was done — never by its stored name', async () => {
    const example = { ...copy(C['11-guest-demo']), example: true, isActive: false };
    const raws = [example, ...[FIVE[0], FIVE[1]].map((x, i) => ({ ...copy(x), id: 'guest-0000000' + i, isActive: i === 0 }))];
    const p = page({ raws, session: 'nobody' });
    const root = document.createElement('div');
    document.body.appendChild(root);
    const draw = () => render(h(App, { state: p.store.getState(), dispatch: p.store.dispatch }), root);
    const one = (id) => root.querySelector(`[data-testid="${id}"]`);
    p.store.dispatch({ type: A.PLANS_SEVERAL, on: true });
    draw();
    expect(one(`plans.tick.${example.id}`).closest('label').textContent).toBe(W.severalTickExample);
    tickAll(p, [example, raws[2]]);
    p.store.dispatch({ type: A.PLANS_SEVERAL_ASK, ask: true });
    draw();
    expect([...one('plans.severalBox').querySelectorAll('li')].map((li) => li.textContent)).toEqual(['the example plan', '‘' + raws[2].planDetails.name + '’']);
    one('plans.severalYes').click();
    await tick();
    draw();
    expect(one('plans.severalDeleted').textContent).toBe('Deleted: the example plan and ‘' + raws[2].planDetails.name + '’.');
    expect(root.textContent).not.toContain(example.planDetails.name);
    render(null, root); root.remove();
    p.stop();
  });
});
