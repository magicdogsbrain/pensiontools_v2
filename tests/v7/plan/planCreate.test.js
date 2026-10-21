/**
 * "Keep this as a plan" makes the plan itself (research/v7/road-to-7.md step 7; save-as-plan.md Contract C.3 for the
 * shape): the one write file's create. A fake firestore/lite records every call, so every write is seen:
 *   - signed in: the account read again first, then ONE addDoc on users/{uid}/scenarios of the plan the planner's own
 *     mapping makes (services/PlanFromSeed.js seedToScenario, lifted; the planner's name PlanSeed.seedToScenario gives the
 *     same document), stamped as FirestoreService.createScenario stamps, brought up to date by today's upgrade, with no
 *     problem Firestore would refuse; never an updateDoc; `isActive` only for the first plan; the name made different from
 *     the names taken; a couple: the partner's plan first, then yours with the link; yours failing leaves the partner's
 *     ('partial'), nothing deleted;
 *   - nobody signed in: the window's plans, the new one appended with a guest id, every other plan byte-identical, one
 *     setItem; refused when the window holds its three ('full' — the example plan not counted; a couple needs two), when
 *     the free time is used up ('usedUp'), when storage refuses ('storage');
 *   - an unconfirmed email ('unverified'); the plans not readable ('failed'); the sign-in check still running: the keep
 *     waits; a keep pressed before the file was loaded is picked up at start;
 *   - then keep/made and the plans read again; the panel's words follow (tests/v7/screens/keepPanel.test.js).
 *   - a property: random answers × random existing lists → a fresh id, no updateDoc, the existing plans byte-identical,
 *     the written plan passes seedProblems, the window never exceeds three own plans.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { startPlanWrite, GUEST_PLANS_KEY, guestPlanId } from '../../../src/v7/effects/planWrite.js';
import { upgradedList } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { keepView } from '../../../src/v7/state/select.js';
import { buildPlanSeed, seedProblems } from '../../../src/answers/keep/planSeed.js';
import { plansFromSeed, withPartnerId, planProblems } from '../../../src/answers/keep/planCreate.js';
import { seedToScenario as plannerSeedToScenario, checkSeed, uniqueName } from '../../../src/services/PlanSeed.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { GUEST_MAX_PLANS, guestOwnPlans } from '../../../src/services/GuestPlans.js';
import { KEY_MINUTES, GUEST_ALLOWANCE_MINUTES } from '../../../src/services/GuestMeter.js';
import { corpus } from './_plans.js';

const C = corpus();
const TODAY = '2026-09-30';
const NOW = new Date('2026-09-30T14:03:22.511Z');
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const states = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
/** A pinned answer state, through the reducer's own door (state/replace). */
const loaded = (q, name) => reduce(initialState({ today: TODAY, build: 'test' }), { type: A.STATE_REPLACE, state: states(q, name) });
/** The answers kept here: one person and a couple of each question. */
const ANSWERS = [['c', 'answer-F1'], ['c', 'answer-F2'], ['a', 'answer-A1'], ['a', 'answer-A2-couple'], ['b', 'answer-B1'], ['b', 'answer-B5-couple'], ['d', 'answer-D1'], ['d', 'answer-D2-couple']];
const COUPLES = ['answer-F2', 'answer-A2-couple', 'answer-B5-couple', 'answer-D2-couple'];
/** A predictable "random": the window ids are the same every run. */
const seededRand = (seed = 1) => () => { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646; };

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return {
    calls,
    getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); },
    removeItem(k) { calls.push(['removeItem', k]); map.delete(k); },
    raw: (k) => map.get(k)
  };
}
/** The fake firestore/lite: doc, updateDoc, addDoc and collection; every call recorded; `failAt` makes the nth addDoc reject. */
function fakeLite({ failAt = 0 } = {}) {
  const adds = [];
  const updates = [];
  return {
    adds, updates,
    doc: (db, ...path) => ({ db, path: path.join('/') }),
    collection: (db, ...path) => ({ db, path: path.join('/') }),
    updateDoc: (ref, data) => { updates.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); },
    addDoc: (coll, data) => {
      const n = adds.length + 1;
      if (failAt === n) return Promise.reject(new Error('offline'));
      adds.push({ path: coll.path, data: copy(data) });
      return Promise.resolve({ id: 'New' + n + 'PlanId' });
    }
  };
}

/**
 * A page on question q's answer with the plans read: signed in ('in', source 'account'), nobody ('nobody', the window's
 * text in sessionStorage), 'unverified', or 'checking' (the sign-in check still running: no plans).
 */
function page(q, name, { session = 'in', raws = [], local = storage(), sess = null, fb = fakeLite(), win = null, rereadList = null, plansFailed = false, before = null } = {}) {
  const store = createStore(loaded(q, name), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse(`#/${q}/keep`) });
  if (session !== 'none') store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' || session === 'unverified' ? 'a@b.c' : null } });
  if (plansFailed) store.dispatch({ type: A.PLANS_FAILED });
  else if (session === 'in' || session === 'nobody') store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, NOW), source: session === 'in' ? 'account' : 'window', readAt: '14:03' });
  if (before) before(store);
  const rereads = [];
  // what planSource would hand in: its user and handle follow the sign-in check (the store's session, for the tests)
  const handles = () => ({
    db: { name: 'db' },
    user: store.getState().session.kind === 'in' ? { uid: 'u1', email: 'a@b.c', emailVerified: true } : null,
    reread: () => { rereads.push(1); if (rereadList) store.dispatch({ type: A.PLANS_SET, list: upgradedList(rereadList, NOW), source: 'account', readAt: '14:04' }); return Promise.resolve(); }
  });
  const sessionStore = sess || storage(session === 'in' ? {} : { [GUEST_PLANS_KEY]: JSON.stringify(raws) });
  const actions = [];
  store.subscribe((s, a) => actions.push(a.type));
  const stop = startPlanWrite(store, { win, session: sessionStore, local, now: () => NOW, fb, client: null, handles, rand: seededRand() });
  return { store, fb, session: sessionStore, local, rereads, actions, stop, keep: () => store.dispatch({ type: A.KEEP_SAVE, q }) };
}

/** What the create must write for a state, worked out independently of the effect: the planner's own documents. */
function expectedPlans(state, q, { takenNames = [], first = false } = {}) {
  const view = keepView(state, q);
  const seed = buildPlanSeed({ source: q, result: state.answers[q].result, env: state.env, name: { suggested: view.suggested, chosen: view.check.name }, budget: state.budget || null, spendHow: (state.draft[q] && state.draft[q].spendHow) || null, createdAt: NOW.toISOString() });
  expect(seedProblems(seed)).toEqual([]);
  expect(checkSeed(seed, NOW.getTime()).ok).toBe(true);
  const made = plansFromSeed(seed, { now: NOW, takenNames, first });
  return { seed, made, ready: (plan) => upgradeScenario(plan, { now: NOW }).scenario };
}

describe('an account: one addDoc of the planner\'s own document, after a fresh read; never an updateDoc', () => {
  it.each(ANSWERS.filter(([, n]) => !COUPLES.includes(n)))('%s %s: the plan the planner would make, stamped as createScenario stamps, active as the first plan; then keep/made and plans/reading', async (q, name) => {
    const p = page(q, name, { raws: [] });
    const state = p.store.getState();
    const { seed, made, ready } = expectedPlans(state, q, { first: true });
    p.keep();
    await tick();
    expect(p.rereads.length, 'read again before the create').toBe(1);
    expect(p.fb.updates).toEqual([]);
    expect(p.fb.adds.length).toBe(1);
    expect(p.fb.adds[0].path).toBe('users/u1/scenarios');
    const written = p.fb.adds[0].data;
    expect(written).toEqual(ready(made.yours));
    expect(planProblems(written)).toEqual([]);
    expect(written.isActive).toBe(true);
    expect(written.createdAt).toBe(NOW.toISOString());
    expect(written.lastModified).toBe(NOW.toISOString());
    expect(written.planDetails.name).toBe(keepView(state, q).suggested);
    expect(written.decisionTool.settings.locked).toBeFalsy();
    expect('id' in written).toBe(false);
    // the planner's own name for the mapping gives the same document (services/PlanSeed.js keeps seedToScenario by re-export)
    const theirs = plannerSeedToScenario(seed, NOW, { name: written.planDetails.name }).yours;
    const strip = (plan) => { const { isActive, createdAt, lastModified, id, ...rest } = plan; void isActive; void createdAt; void lastModified; void id; return rest; };
    expect(strip(written)).toEqual(strip(ready({ ...theirs, isActive: true, createdAt: NOW.toISOString(), lastModified: NOW.toISOString() })));
    const k = p.store.getState().keep[q];
    expect(k).toMatchObject({ saving: false, problem: null, name: null, made: { id: 'New1PlanId', name: written.planDetails.name, where: 'account', partnerId: null, partnerName: null, separate: false } });
    expect(p.actions).toContain(A.KEEP_MADE);
    expect(p.actions.indexOf(A.PLANS_READING)).toBeGreaterThan(p.actions.indexOf(A.KEEP_MADE));
    // the window's storage was never touched on the account path
    expect(p.session.calls.filter(([c]) => c !== 'getItem')).toEqual([]);
    p.stop();
  });
  it('with plans in the account already: not active; the name made different from a name already taken (" (2)")', async () => {
    const taken = copy(C['10-couple-b']);
    taken.planDetails.name = 'Stop at 60 · £1,900 a month';          // A1's suggested name
    const p = page('a', 'answer-A1', { raws: [C['03-gilt-ladder-runup'], taken] });
    p.keep();
    await tick();
    expect(p.fb.adds.length).toBe(1);
    const written = p.fb.adds[0].data;
    expect(written.isActive).toBe(false);
    expect(written.planDetails.name).toBe('Stop at 60 · £1,900 a month (2)');
    expect(written.planDetails.name).toBe(uniqueName('Stop at 60 · £1,900 a month', ['Ladder to 90', 'Stop at 60 · £1,900 a month']));
    expect(p.store.getState().keep.a.made.name).toBe('Stop at 60 · £1,900 a month (2)');
    p.stop();
  });
  it('the fresh read is what counts: a plan made elsewhere since the page opened takes the name and the first place', async () => {
    const elsewhere = copy(C['10-couple-b']);
    elsewhere.planDetails.name = 'From 58 · £1,350 a month';         // F1's suggested name
    const p = page('c', 'answer-F1', { raws: [], rereadList: [elsewhere] });
    p.keep();
    await tick();
    expect(p.fb.adds[0].data.planDetails.name).toBe('From 58 · £1,350 a month (2)');
    expect(p.fb.adds[0].data.isActive).toBe(false);
    p.stop();
  });
  it.each(ANSWERS.filter(([, n]) => COUPLES.includes(n)))('%s %s: a couple — the partner\'s plan first (never active), then yours with the link to it', async (q, name) => {
    const p = page(q, name, { raws: [] });
    const { made, ready } = expectedPlans(p.store.getState(), q, { first: true });
    p.keep();
    await tick();
    expect(p.fb.adds.length).toBe(2);
    const [partner, yours] = p.fb.adds.map((a) => a.data);
    expect(partner).toEqual(ready(made.partner));
    expect(partner.isActive).toBe(false);
    expect(yours).toEqual(ready(withPartnerId(made.yours, 'New1PlanId')));
    expect(yours.household).toEqual({ partnerScenarioId: 'New1PlanId' });
    expect(yours.isActive).toBe(true);
    expect(partner.planDetails.name).toBe(yours.planDetails.name + ' · partner');
    expect(p.store.getState().keep[q].made).toMatchObject({ id: 'New2PlanId', name: yours.planDetails.name, where: 'account', partnerId: 'New1PlanId', partnerName: partner.planDetails.name });
    p.stop();
  });
  it('yours cannot be made after the partner\'s was: "partial", the partner\'s name; nothing is deleted, nothing updated', async () => {
    const p = page('a', 'answer-A2-couple', { raws: [], fb: fakeLite({ failAt: 2 }) });
    p.keep();
    await tick();
    expect(p.fb.adds.length).toBe(1);                                 // the partner's plan stays
    expect(p.fb.updates).toEqual([]);
    const k = p.store.getState().keep.a;
    expect(k).toMatchObject({ saving: false, problem: 'partial', made: null });
    expect(k.partnerKept).toBe(p.fb.adds[0].data.planDetails.name);
    expect(p.actions).not.toContain(A.KEEP_MADE);
    p.stop();
  });
  it('the first create failing: "failed", nothing written; the figures are still there', async () => {
    const p = page('b', 'answer-B1', { raws: [], fb: fakeLite({ failAt: 1 }) });
    p.keep();
    await tick();
    expect(p.fb.adds).toEqual([]);
    expect(p.store.getState().keep.b).toMatchObject({ saving: false, problem: 'failed', made: null });
    expect(p.store.getState().answers.b.status).toBe('final');
    p.stop();
  });
  it('an email not yet confirmed: "unverified", nothing written anywhere', async () => {
    const p = page('c', 'answer-F1', { session: 'unverified' });
    p.keep();
    await tick();
    expect(p.fb.adds).toEqual([]);
    expect(p.store.getState().keep.c.problem).toBe('unverified');
    expect(p.session.calls.filter(([c]) => c !== 'getItem')).toEqual([]);
    p.stop();
  });
  it('the plans could not be read: "failed"', async () => {
    const p = page('c', 'answer-F1', { session: 'in', plansFailed: true });
    p.keep();
    await tick();
    expect(p.fb.adds).toEqual([]);
    expect(p.store.getState().keep.c.problem).toBe('failed');
    p.stop();
  });
  it('the sign-in check still running: the keep waits, then goes once the account is known', async () => {
    const p = page('a', 'answer-A1', { session: 'checking' });
    p.keep();
    await tick();
    expect(p.fb.adds).toEqual([]);
    expect(p.store.getState().keep.a.saving).toBe(true);
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    p.store.dispatch({ type: A.PLANS_SET, list: [], source: 'account', readAt: '14:03' });
    await tick();
    expect(p.fb.adds.length).toBe(1);
    expect(p.store.getState().keep.a.made).not.toBe(null);
    p.stop();
  });
  it('a keep pressed before the write file was loaded (it comes with the plan source) is picked up at start', async () => {
    const p = page('c', 'answer-F1', { raws: [], before: (store) => store.dispatch({ type: A.KEEP_SAVE, q: 'c' }) });
    await tick();
    expect(p.fb.adds.length).toBe(1);
    expect(p.store.getState().keep.c.made).toMatchObject({ id: 'New1PlanId', where: 'account' });
    p.stop();
  });
  it('an answer that is no longer current when the keep runs: "notReady", nothing written', async () => {
    const p = page('c', 'answer-F1', { session: 'checking' });
    p.keep();
    p.store.dispatch({ type: A.DRAFT_SET, q: 'c', path: 'you.pot', value: '260,000' });
    p.store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    p.store.dispatch({ type: A.PLANS_SET, list: [], source: 'account', readAt: '14:03' });
    await tick();
    expect(p.fb.adds).toEqual([]);
    expect(p.store.getState().keep.c.problem).toBe('notReady');
    p.stop();
  });
  it('a locked plan in the account and D: a separate plan, and keep/made says so', async () => {
    const p = page('d', 'answer-D1', { raws: [C['03-gilt-ladder-runup']] });
    expect(keepView(p.store.getState(), 'd').separate).toBe(true);
    p.keep();
    await tick();
    expect(p.fb.adds.length).toBe(1);
    expect(p.fb.adds[0].data.isActive).toBe(false);
    expect(p.fb.updates).toEqual([]);                                  // the locked plan is not touched
    expect(p.store.getState().keep.d.made).toMatchObject({ where: 'account', separate: true });
    p.stop();
  });
});

describe('this window: the new plan appended, every other plan byte-identical, one setItem', () => {
  it.each(ANSWERS.filter(([, n]) => !COUPLES.includes(n)))('%s %s: a guest id, the planner\'s stamps, active as the first plan; keep/made says "window"', async (q, name) => {
    const p = page(q, name, { session: 'nobody', raws: [] });
    const { made, ready } = expectedPlans(p.store.getState(), q, { first: true });
    p.keep();
    await tick();
    expect(p.fb.adds).toEqual([]);
    expect(p.fb.updates).toEqual([]);
    const sets = p.session.calls.filter(([c]) => c === 'setItem');
    expect(sets).toEqual([['setItem', GUEST_PLANS_KEY]]);
    const list = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(list.length).toBe(1);
    const { id, ...rest } = list[0];
    expect(id).toMatch(/^guest-[0-9a-z]{8}$/);
    expect(rest).toEqual(ready(made.yours));
    expect(rest.isActive).toBe(true);
    expect(planProblems(list[0])).toEqual([]);
    expect(p.store.getState().keep[q].made).toMatchObject({ id, where: 'window', partnerId: null });
    expect(p.actions).toContain(A.PLANS_READING);
    p.stop();
  });
  it('with plans in the window already: appended after them, byte for byte as they were; not active', async () => {
    const raws = [C['10-couple-b'], C['05-saver-committed']];
    const p = page('a', 'answer-A1', { session: 'nobody', raws });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.keep();
    await tick();
    const after = p.session.raw(GUEST_PLANS_KEY);
    expect(after.startsWith(before.slice(0, -1))).toBe(true);        // the old text, the closing bracket moved
    const list = JSON.parse(after);
    expect(list.length).toBe(3);
    expect(list.slice(0, 2)).toEqual(raws);
    expect(list[2].isActive).toBe(false);
    expect(list[2].id).not.toBe(list[0].id);
    p.stop();
  });
  it('a couple: two plans appended, the partner\'s first, yours with the link to its window id', async () => {
    const p = page('b', 'answer-B5-couple', { session: 'nobody', raws: [] });
    p.keep();
    await tick();
    const list = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(list.length).toBe(2);
    expect(list[0].isActive).toBe(false);
    expect(list[1].household).toEqual({ partnerScenarioId: list[0].id });
    expect(list[1].isActive).toBe(true);
    expect(list[0].id).not.toBe(list[1].id);
    expect(p.store.getState().keep.b.made).toMatchObject({ id: list[1].id, partnerId: list[0].id, where: 'window' });
    p.stop();
  });
  it('three plans of their own already: "full", nothing written; the example plan does not count', async () => {
    const three = [C['10-couple-b'], C['05-saver-committed'], C['03-gilt-ladder-runup']];
    const p = page('c', 'answer-F1', { session: 'nobody', raws: three });
    p.keep();
    await tick();
    expect(p.session.calls.filter(([c]) => c === 'setItem')).toEqual([]);
    expect(p.store.getState().keep.c.problem).toBe('full');
    const example = { ...copy(C['03-gilt-ladder-runup']), example: true };
    const p2 = page('c', 'answer-F1', { session: 'nobody', raws: [C['10-couple-b'], C['05-saver-committed'], example] });
    p2.keep();
    await tick();
    expect(JSON.parse(p2.session.raw(GUEST_PLANS_KEY)).length).toBe(4);
    expect(p2.store.getState().keep.c.made).not.toBe(null);
    // a couple needs room for two
    const p3 = page('a', 'answer-A2-couple', { session: 'nobody', raws: [C['10-couple-b'], C['05-saver-committed']] });
    p3.keep();
    await tick();
    expect(p3.store.getState().keep.a.problem).toBe('full');
    expect(p3.session.calls.filter(([c]) => c === 'setItem')).toEqual([]);
    p.stop(); p2.stop(); p3.stop();
  });
  it('the free time used up: "usedUp", nothing written', async () => {
    const p = page('c', 'answer-F1', { session: 'nobody', local: storage({ [KEY_MINUTES]: String(GUEST_ALLOWANCE_MINUTES) }) });
    p.keep();
    await tick();
    expect(p.session.calls.filter(([c]) => c === 'setItem')).toEqual([]);
    expect(p.store.getState().keep.c.problem).toBe('usedUp');
    p.stop();
  });
  it('a browser that will not keep it: "storage", and the text as it was', async () => {
    const refusing = storage({ [GUEST_PLANS_KEY]: '[]' });
    refusing.setItem = () => { throw new Error('QuotaExceededError'); };
    const p = page('c', 'answer-F1', { session: 'nobody', sess: refusing });
    p.keep();
    await tick();
    expect(p.store.getState().keep.c.problem).toBe('storage');
    expect(refusing.raw(GUEST_PLANS_KEY)).toBe('[]');
    const none = page('c', 'answer-F1', { session: 'nobody', sess: { getItem: () => null, setItem: () => {}, removeItem: () => {}, calls: [] } });
    none.keep();
    await tick();
    expect(none.store.getState().keep.c.problem).toBe('storage');
    p.stop(); none.stop();
  });
  it('the window ids are the planner\'s shape and never one already taken', () => {
    const rand = seededRand(7);
    const taken = new Set();
    for (let i = 0; i < 200; i++) { const id = guestPlanId(rand, taken); expect(id).toMatch(/^guest-[0-9a-z]{8}$/); expect(taken.has(id)).toBe(false); taken.add(id); }
    const always = guestPlanId(() => 0.999999, new Set());
    expect(always).toBe('guest-zzzzzzzz');
    expect(() => guestPlanId(() => 0, new Set(['guest-00000000']))).toThrow();
  });
});

describe('the property: random answers × random existing plans (road-to-7.md step 7)', () => {
  const PLANS = Object.values(C);
  const existing = fc.array(fc.integer({ min: 0, max: PLANS.length - 1 }), { maxLength: 3 }).chain((ix) =>
    fc.tuple(...ix.map(() => fc.constantFrom(null, 'Stop at 60 · £1,900 a month', 'From 58 · £1,350 a month', 'Mine'))).map((names) =>
      ix.map((i, k) => { const p = copy(PLANS[i]); p.id = p.id + k; if (names[k]) { p.planDetails.name = names[k]; if ('planDetails.name' in p) p['planDetails.name'] = names[k]; } return p; })));
  it('a fresh id, no updateDoc, the existing plans byte-identical, the written plan passes seedProblems, the window never exceeds three', async () => {
    await fc.assert(fc.asyncProperty(fc.constantFrom(...ANSWERS), existing, fc.constantFrom('in', 'nobody'), fc.constantFrom('', '   ', 'Mine', 'My own  plan', 'x'.repeat(61), 'Stop at 60 · £1,900 a month'), async ([q, name], raws, session, typedName) => {
      const p = page(q, name, { session, raws });
      if (typedName.trim()) p.store.dispatch({ type: A.KEEP_NAME, q, value: typedName });
      const before = session === 'nobody' ? p.session.raw(GUEST_PLANS_KEY) : null;
      const couple = COUPLES.includes(name);
      const view = keepView(p.store.getState(), q);
      p.keep();
      await tick();
      const k = p.store.getState().keep[q];
      expect(p.fb.updates).toEqual([]);
      if (!view.check.ok) { expect(['empty', 'tooLong']).toContain(k.problem); expect(p.fb.adds).toEqual([]); p.stop(); return; }
      const ownBefore = guestOwnPlans(raws).length;
      if (session === 'nobody' && ownBefore + (couple ? 2 : 1) > GUEST_MAX_PLANS) {
        expect(k.problem).toBe('full');
        expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
        p.stop();
        return;
      }
      expect(k.made, JSON.stringify(k)).not.toBe(null);
      const written = session === 'in' ? p.fb.adds.map((a) => a.data) : JSON.parse(p.session.raw(GUEST_PLANS_KEY)).slice(raws.length);
      expect(written.length).toBe(couple ? 2 : 1);
      const ids = session === 'in' ? p.fb.adds.map((a, i) => 'New' + (i + 1) + 'PlanId') : written.map((w) => w.id);
      for (const id of ids) expect(raws.map((r) => r.id)).not.toContain(id);
      // the names taken are the plans' as read (brought up to date in memory: a stored patch of the name counts)
      const takenNames = upgradedList(raws, NOW).map((e) => e.plan.planDetails.name);
      for (const w of written) {
        expect(planProblems(w)).toEqual([]);
        expect(takenNames).not.toContain(w.planDetails.name);
        expect(w.isActive).toBe(raws.length === 0 && w === written[written.length - 1]);
        expect(w.decisionTool.settings.locked).toBeFalsy();
      }
      if (session === 'nobody') {
        const list = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
        expect(list.slice(0, raws.length)).toEqual(raws);
        expect(guestOwnPlans(list).length).toBeLessThanOrEqual(GUEST_MAX_PLANS);
        expect(p.session.calls.filter(([c]) => c === 'setItem').length).toBe(1);
      } else {
        for (const a of p.fb.adds) expect(a.path).toBe('users/u1/scenarios');
      }
      expect(k.made.name).toBe(written[written.length - 1].planDetails.name);
      if (typedName.trim()) expect(k.made.name.startsWith(typedName.trim().replace(/\s+/g, ' '))).toBe(true);
      p.stop();
    }), { numRuns: 40 });
  }, 120000);
});
