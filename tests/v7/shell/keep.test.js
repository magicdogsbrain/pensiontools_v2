/**
 * "Save this as a plan" in the shell (research/v7/save-as-plan.md, Contract C.2): when an answer can be saved, the
 * name box, the checks, the effect that writes the plan seed and opens the planner — and what V7 says on coming back.
 *
 * Safety rules checked here: the address V7 opens is exactly '../#new-plan' (no figure in it, ever); the seed is
 * written only under 'pt_v7_plan_seed', only after "Save as a plan", and is the contract's own (buildPlanSeed); a
 * browser that refuses storage gets a plain sentence and no navigation; V7 deletes any seed over a day old at start-up
 * and says "Saved as" only on the planner's receipt that it made the plan (review, 1 Oct 2026).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { keepView } from '../../../src/v7/state/select.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { startPlanSeed, seedOutcome, purgeStale, PLANNER_ADDRESS, localStore } from '../../../src/v7/effects/planSeed.js';
import { railFor } from '../../../src/v7/rail/index.js';
import { startDraftStore, loadDraft, DRAFT_KEY } from '../../../src/v7/effects/draftStore.js';
import { buildPlanSeed, SEED_KEY, RECEIPT_KEY, seedProblems } from '../../../src/answers/keep/planSeed.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { fakeStorage } from './_shell.js';
import { TODAY } from './_open.js';

const states = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
/** A pinned answer state, through the reducer's own door (state/replace), as the test hook draws it. */
const loaded = (q, name) => reduce(initialState({ today: TODAY, build: 'test' }), { type: A.STATE_REPLACE, state: states(q, name) });
const NOW = new Date('2026-09-30T14:03:22.511Z');

describe('when an answer can be saved', () => {
  it('a final answer, for what is typed now, of status ok: the box holds the suggested name', () => {
    const v = keepView(loaded('a', 'answer-A1'), 'a');
    expect(v).toMatchObject({ can: true, why: null, suggested: 'Stop at 60 · £1,900 a month', name: 'Stop at 60 · £1,900 a month', problem: null, saving: false });
    expect(keepView(loaded('c', 'answer-F1'), 'c').name).toBe('From 58 · £1,350 a month');
    expect(keepView(loaded('b', 'answer-B1'), 'b').name).toBe('Stop at 60 · £2,000 a month · paying £700');
  });
  it('not while there is nothing, a first figure, or a figure for what was typed before; not for an answer of no pot', () => {
    expect(keepView(loaded('a', 'answer-nothing-entered'), 'a').why).toBe('noAnswer');
    expect(keepView(loaded('a', 'answer-working'), 'a').why).toBe('noAnswer');
    expect(keepView(loaded('a', 'answer-first'), 'a').why).toBe('notFinal');
    expect(keepView(loaded('a', 'answer-updating'), 'a').why).toBe('notCurrent');
    expect(keepView(loaded('a', 'answer-failed'), 'a').why).toBe('noAnswer');
    expect(keepView(loaded('a', 'answer-retired'), 'a').why).toBe('retired');
    expect(keepView(loaded('c', 'answer-pensions-only'), 'c').why).toBe('notOk');
    expect(keepView(loaded('c', 'answer-closed-years'), 'c').why).toBe('closedYears');
    expect(keepView(loaded('b', 'answer-out-of-reach'), 'b').why).toBe('notOk');
    expect(keepView(loaded('a', 'answer-no'), 'a').can).toBe(true);                       // a "no" is still a try
    const typedSince = reduce(loaded('a', 'answer-A1'), { type: A.DRAFT_SET, q: 'a', path: 'stop.age', value: '61' });
    expect(keepView(typedSince, 'a')).toMatchObject({ can: false, why: 'notCurrent', name: '' });
  });
  it('what was typed in the box stays, whatever the answer does next', () => {
    let s = reduce(loaded('a', 'answer-A1'), { type: A.KEEP_NAME, q: 'a', value: 'The early one' });
    expect(keepView(s, 'a').name).toBe('The early one');
    s = reduce(s, { type: A.DRAFT_SET, q: 'a', path: 'stop.age', value: '61' });
    expect(s.keep.a.name).toBe('The early one');
  });
});

describe('keep/save checks first', () => {
  it('an empty name, or one over 60 characters, is refused with the plain message\'s id; the box keeps the text', () => {
    const empty = run(loaded('a', 'answer-A1'), { type: A.KEEP_NAME, q: 'a', value: '   ' }, { type: A.KEEP_SAVE, q: 'a' });
    expect(empty.keep.a).toMatchObject({ problem: 'empty', saving: false, name: '   ' });
    const long = run(loaded('a', 'answer-A1'), { type: A.KEEP_NAME, q: 'a', value: 'x'.repeat(61) }, { type: A.KEEP_SAVE, q: 'a' });
    expect(long.keep.a.problem).toBe('tooLong');
    expect(reduce(long, { type: A.KEEP_NAME, q: 'a', value: 'Shorter' }).keep.a.problem).toBe(null);   // typing clears it
  });
  it('an answer that cannot be saved is refused, never sent', () => {
    expect(reduce(loaded('a', 'answer-first'), { type: A.KEEP_SAVE, q: 'a' }).keep.a).toMatchObject({ problem: 'notReady', saving: false });
  });
  it('all right: saving, once — a second press while it is under way changes nothing', () => {
    const s = reduce(loaded('b', 'answer-B1'), { type: A.KEEP_SAVE, q: 'b' });
    expect(s.keep.b).toMatchObject({ saving: true, problem: null });
    expect(reduce(s, { type: A.KEEP_SAVE, q: 'b' })).toBe(s);
  });
});

function run(state, ...actions) { return actions.reduce((s, a) => reduce(s, a), state); }

/** A page: the store, the tab's storage and the browser's, the plan seed effect, and where it would go. */
function page(state, { storage = fakeStorage(), session = fakeStorage(), now = () => NOW } = {}) {
  const store = createStore(state, reduce);
  const went = [];
  const order = [];
  const sessionWrites = session.writes;
  const stopDraft = startDraftStore(store, session);
  const stop = startPlanSeed(store, { storage, session, now, go: (a) => { order.push(`go:${sessionWrites.length}`); went.push(a); } });
  return { store, storage, session, went, order, stop: () => { stop(); stopDraft(); } };
}
const settle = () => new Promise((r) => setTimeout(r, 0));

describe('the effect: the seed, then the planner', () => {
  it.each([['c', 'answer-F1'], ['c', 'answer-F2'], ['a', 'answer-A1'], ['a', 'answer-A2-couple'], ['b', 'answer-B1'], ['b', 'answer-B5-couple']])(
    '%s %s: writes the contract\'s seed under its key, says it was sent, then opens ../#new-plan — and nothing else', async (q, name) => {
      const p = page(loaded(q, name));
      p.store.dispatch({ type: A.KEEP_NAME, q, value: '  My first   try ' });
      p.store.dispatch({ type: A.KEEP_SAVE, q });
      const text = p.storage.getItem(SEED_KEY);
      expect(text).not.toBe(null);
      const seed = JSON.parse(text);
      const state = p.store.getState();
      expect(seed).toEqual(buildPlanSeed({ source: q, result: state.answers[q].result, env: state.env, name: { suggested: keepView(loaded(q, name), q).suggested, chosen: 'My first try' },
        budget: null, spendHow: null, createdAt: NOW.toISOString() }));
      expect(seedProblems(seed)).toEqual([]);
      expect(state.keep[q]).toMatchObject({ name: null, saving: false, problem: null, sent: { name: 'My first try', createdAt: NOW.toISOString() } });   // the next try gets its own name
      expect(p.went).toEqual([]);                                     // not yet: after every listener has seen keep/sent
      await settle();
      expect(p.went).toEqual([PLANNER_ADDRESS]);
      expect(PLANNER_ADDRESS).toBe('../#new-plan');
      expect(/\d/.test(PLANNER_ADDRESS)).toBe(false);
      expect(p.storage.writes).toEqual([SEED_KEY]);                   // the browser's storage: the seed and nothing else
      // the tab had already kept the save before the page moved on, so coming back can say so
      expect(loadDraft(p.session).kept[q].sent).toEqual({ name: 'My first try', createdAt: NOW.toISOString() });
      expect(p.order).toEqual([`go:${p.session.writes.length}`]);
      p.stop();
    });
  it('carries the budget sheet and how the spending was chosen — a passenger: the figures are the answer\'s', async () => {
    let s = loaded('a', 'answer-A1');
    s = run(s, { type: A.SPEND_HOW, q: 'a', how: 'lines' }, { type: A.BUDGET_LINE, id: 'l2', field: 'amount', value: '150' });
    expect(keepView(s, 'a').can).toBe(true);                        // the sheet changed nothing the answer was worked out from
    const p = page(s);
    p.store.dispatch({ type: A.KEEP_SAVE, q: 'a' });
    const seed = JSON.parse(p.storage.getItem(SEED_KEY));
    expect(seed.spend).toMatchObject({ perMonth: 1900, from: 'budget', budgetSkipped: false });
    expect(seed.budget.lines).toEqual([{ heading: 'home', label: 'Council tax', annual: 1800, period: 'mo', essential: true }]);
    p.stop();
  });
  it('a browser that will not keep it: the plain sentence, no navigation, nothing in an address', async () => {
    const refusing = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); }, removeItem: () => {}, writes: [] };
    const p = page(loaded('a', 'answer-A1'), { storage: refusing });
    p.store.dispatch({ type: A.KEEP_SAVE, q: 'a' });
    await settle();
    expect(p.store.getState().keep.a).toMatchObject({ saving: false, problem: 'storage', sent: null });
    expect(p.went).toEqual([]);
    const none = page(loaded('a', 'answer-A1'), { storage: null });
    none.store.dispatch({ type: A.KEEP_SAVE, q: 'a' });
    await settle();
    expect(none.store.getState().keep.a.problem).toBe('storage');
    expect(none.went).toEqual([]);
  });
  it('nothing is written or opened unless "Save as a plan" was pressed', async () => {
    const p = page(loaded('c', 'answer-F1'));
    for (const a of [{ type: A.KEEP_NAME, q: 'c', value: 'x' }, { type: A.UI_TOGGLE, id: 'more' }, { type: A.ROUTE_SET, route: { screen: 'step', q: 'c', step: 'keep', planId: null, focus: null } }]) p.store.dispatch(a);
    await settle();
    expect(p.storage.writes).toEqual([]);
    expect(p.went).toEqual([]);
  });
  it('a window that will not hand over its storage', () => {
    expect(localStore({ get localStorage() { throw new Error('SecurityError'); } })).toBe(null);
    expect(localStore({})).toBe(null);
    const s = fakeStorage();
    expect(localStore({ localStorage: s })).toBe(s);
  });
});

describe('coming back', () => {
  const sentState = (createdAt = NOW.toISOString()) => {
    const s = loaded('a', 'answer-A1');
    return reduce(s, { type: A.KEEP_SENT, q: 'a', name: 'Stop at 60', createdAt });
  };
  /** This tab's session storage holding the planner's receipt for the seed sent at NOW. */
  const receipt = (r, at = NOW.toISOString()) => fakeStorage({ [RECEIPT_KEY]: JSON.stringify({ [at]: r }) });
  it('the seed still there, as sent: waiting in the planner', () => {
    const storage = fakeStorage({ [SEED_KEY]: JSON.stringify({ createdAt: NOW.toISOString() }) });
    expect(seedOutcome(storage, NOW.toISOString(), NOW.getTime() + 60_000)).toEqual({ outcome: 'waiting' });
    const p = page(sentState(), { storage });
    expect(p.store.getState().keep.a.back).toBe('waiting');
    expect(keepView(p.store.getState(), 'a').back).toBe('waiting');
  });
  it('"Saved as …" only on the planner\'s word that it made the plan — under the name it was made with', () => {
    expect(seedOutcome(fakeStorage(), NOW.toISOString(), NOW.getTime(), receipt({ outcome: 'made', name: 'Stop at 60 (2)' }))).toEqual({ outcome: 'taken', name: 'Stop at 60 (2)' });
    const p = page(sentState(), { storage: fakeStorage(), session: receipt({ outcome: 'made', name: 'Stop at 60 (2)' }) });
    expect(p.store.getState().keep.a).toMatchObject({ back: 'taken', sent: { name: 'Stop at 60 (2)', createdAt: NOW.toISOString() } });
    expect(railFor(p.store.getState(), 'a').steps.find((x) => x.id === 'keep').state).toBe('done');
  });
  it('"Not now" in the planner (found 1 Oct 2026: V7 said "Saved as" and ticked the step): declined, and the step is not done', () => {
    const p = page(sentState(), { storage: fakeStorage(), session: receipt({ outcome: 'declined' }) });
    expect(p.store.getState().keep.a).toMatchObject({ back: 'declined', sent: { name: 'Stop at 60' } });
    expect(railFor(p.store.getState(), 'a').steps.find((x) => x.id === 'keep').state).not.toBe('done');
  });
  it('figures the planner could not use, or a sign-out deleted: not made', () => {
    for (const outcome of ['refused', 'cleared']) {
      expect(seedOutcome(fakeStorage(), NOW.toISOString(), NOW.getTime(), receipt({ outcome }))).toEqual({ outcome: 'notMade' });
      const p = page(sentState(), { storage: fakeStorage(), session: receipt({ outcome }) });
      expect(p.store.getState().keep.a.back).toBe('notMade');
    }
  });
  it('gone or replaced with no word from the planner: nothing is claimed either way, and the save is forgotten', () => {
    expect(seedOutcome(fakeStorage(), NOW.toISOString(), NOW.getTime())).toEqual({ outcome: 'unknown' });
    expect(seedOutcome(fakeStorage({ [SEED_KEY]: JSON.stringify({ createdAt: '2026-09-30T15:00:00.000Z' }) }), NOW.toISOString(), NOW.getTime())).toEqual({ outcome: 'unknown' });
    expect(seedOutcome(fakeStorage({ [SEED_KEY]: '{oops' }), NOW.toISOString(), NOW.getTime(), fakeStorage({ [RECEIPT_KEY]: '{oops' }))).toEqual({ outcome: 'unknown' });
    expect(seedOutcome(null, NOW.toISOString(), NOW.getTime(), null)).toEqual({ outcome: 'unknown' });
    const p = page(sentState(), { storage: fakeStorage() });
    expect(p.store.getState().keep.a).toMatchObject({ back: null, sent: null });
  });
  it('a seed of its own over a day old is deleted, and nothing is claimed', () => {
    const storage = fakeStorage({ [SEED_KEY]: JSON.stringify({ createdAt: NOW.toISOString() }) });
    const later = NOW.getTime() + 24 * 60 * 60 * 1000 + 1;
    expect(seedOutcome(storage, NOW.toISOString(), later)).toEqual({ outcome: 'gone' });
    expect(storage.getItem(SEED_KEY)).toBe(null);
    const again = fakeStorage({ [SEED_KEY]: JSON.stringify({ createdAt: NOW.toISOString() }) });
    const p = page(sentState(), { storage: again, now: () => new Date(later) });
    expect(p.store.getState().keep.a).toMatchObject({ sent: null, back: null });
  });
  it('a seed over a day old is deleted at start-up WHICHEVER tab wrote it (privacy: never used after a day); a fresh one is left', () => {
    const old = fakeStorage({ [SEED_KEY]: JSON.stringify({ createdAt: '2026-08-31T09:00:00.000Z', people: [{ budget: 'Personal health' }] }) });
    page(initialState({ today: TODAY, build: 'test' }), { storage: old });
    expect(old.getItem(SEED_KEY)).toBe(null);
    const junk = fakeStorage({ [SEED_KEY]: '{oops' });
    page(initialState({ today: TODAY, build: 'test' }), { storage: junk });
    expect(junk.getItem(SEED_KEY)).toBe(null);
    const fresh = fakeStorage({ [SEED_KEY]: JSON.stringify({ createdAt: new Date(NOW.getTime() - 60_000).toISOString() }) });
    const p = page(initialState({ today: TODAY, build: 'test' }), { storage: fresh });
    expect(fresh.getItem(SEED_KEY)).not.toBe(null);
    expect(fresh.writes).toEqual([]);
    expect(purgeStale(null, NOW.getTime())).toBe(false);
    p.stop();
  });
  it('a page shown again from the back-forward cache (no start-up) looks again', () => {
    const storage = fakeStorage({ [SEED_KEY]: JSON.stringify({ createdAt: NOW.toISOString() }) });
    const session = fakeStorage();
    const store = createStore(sentState(), reduce);
    let shown = null;
    let stopped = false;
    const stop = startPlanSeed(store, { storage, session, now: () => NOW, go: () => {}, onShow: (fn) => { shown = fn; return () => { stopped = true; }; } });
    expect(store.getState().keep.a.back).toBe('waiting');
    storage.removeItem(SEED_KEY);                                    // the planner took it meanwhile …
    session.setItem(RECEIPT_KEY, JSON.stringify({ [NOW.toISOString()]: { outcome: 'made', name: 'Stop at 60' } }));   // … and said so
    shown();
    expect(store.getState().keep.a.back).toBe('taken');
    stop();
    expect(stopped).toBe(true);
  });
  it('a reload keeps the last save sent from this tab (the draft store), and nothing else of it', () => {
    const session = fakeStorage();
    const store = createStore(sentState(), reduce);
    startDraftStore(store, session);
    store.dispatch({ type: A.KEEP_NAME, q: 'a', value: 'Typed' });
    const kept = loadDraft(session);
    expect(kept.kept).toEqual({ a: { name: 'Typed', sent: { name: 'Stop at 60', createdAt: NOW.toISOString() } } });
    expect(session.getItem(DRAFT_KEY)).not.toMatch(/careful|middling|monthly|result|1,770|417982/);   // what was typed, never the answer's figures
    const back = initialState({ today: TODAY, build: 'test', draft: kept });
    expect(back.keep.a).toEqual({ name: 'Typed', problem: null, saving: false, sent: { name: 'Stop at 60', createdAt: NOW.toISOString() }, back: null });
  });
});

describe('the test hook draws a state with its budget and its saves — cleaned as the tab\'s own store would be', () => {
  it('state/replace keeps a sheet and a save, and drops what neither can hold', () => {
    const s = states('a', 'answer-A1');
    s.budget = { version: 1, lines: [{ id: 'l1', heading: 'home', label: 'Council tax', amount: '150', period: 'mo', essential: true, starter: true, junk: 1 }], oneOffs: [], touched: [] };
    s.keep = { a: { name: 'Mine', sent: { name: 'Mine', createdAt: '2026-09-30T14:00:00.000Z' }, back: 'taken', problem: 'storage', saving: true }, c: { back: 'sideways', problem: 'oops' } };
    const t = reduce(initialState({ today: TODAY, build: 'test' }), { type: A.STATE_REPLACE, state: s });
    expect(t.budget.lines).toEqual([{ id: 'l1', heading: 'home', label: 'Council tax', amount: '150', period: 'mo', essential: true, starter: true }]);
    expect(t.keep.a).toEqual({ name: 'Mine', problem: 'storage', saving: false, sent: { name: 'Mine', createdAt: '2026-09-30T14:00:00.000Z' }, back: 'taken' });
    expect(t.keep.c).toEqual({ name: null, problem: null, saving: false, sent: null, back: null });
    expect(t.keep.b).toEqual({ name: null, problem: null, saving: false, sent: null, back: null });
  });
});
