/**
 * The reducer with A, B and C open (step 4 brief 4.11): the draft actions on A's and B's lists, state/replace of a
 * three-question state, and any sequence of actions — the new ones included — over the three questions: the state
 * survives JSON, plan and session never change, and a result only ever comes from the key it is filed under.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import fc from 'fast-check';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A, ACTION_TYPES, OPENABLE } from '../../../src/v7/state/actions.js';
import { CARRY } from '../../../src/v7/state/carry.js';
import { SCHEMAS, parsedDraft, currentKey } from '../../../src/v7/state/select.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { fresh, run, set, route, typedA, typedB, resultA, resultB, answered, TODAY } from './_open.js';

const Q = ['a', 'b', 'c'];

describe('the actions', () => {
  it('draft/carry and answer/extend are actions the reducer knows', () => {
    expect(A.DRAFT_CARRY).toBe('draft/carry');
    expect(A.ANSWER_EXTEND).toBe('answer/extend');
    expect(ACTION_TYPES).toContain('draft/carry');
    expect(ACTION_TYPES).toContain('answer/extend');
  });
  it('every field of A\'s and B\'s lists can be set; one that is not on the list is refused', () => {
    for (const q of ['a', 'b']) {
      for (const f of SCHEMAS[q].fields) {
        if (f.type === 'steps') continue;                                    // the spending shape's steps: shape/* (below)
        const v = f.type === 'yesNo' ? true : f.type === 'choice' ? f.options[0] : '1';
        expect(reduce(fresh(), set(q, f.path, v)).draft[q].values[f.path]).toBe(v);
      }
      expect(() => reduce(fresh(), set(q, 'take', '1'))).toThrow();          // C's field, not A's or B's
    }
    expect(() => reduce(fresh(), set('b', 'partTime.has', true))).toThrow(); // A's, not B's
  });
  it('draft/ask on A or B moves to that question\'s answer step when the draft parses', () => {
    expect(reduce(typedA(), { type: A.DRAFT_ASK, q: 'a' }).route).toEqual(route('step', 'a', 'answer'));
    expect(reduce(typedB(), { type: A.DRAFT_ASK, q: 'b' }).route).toEqual(route('step', 'b', 'answer'));
    const half = reduce(fresh(), set('b', 'you.age', '45'));
    expect(reduce(half, { type: A.DRAFT_ASK, q: 'b' }).route.screen).toBe('front');
  });
  it('state/replace draws a three-question state, each question\'s own shape filled in', () => {
    const wanted = run(answered(typedA(), 'a', resultA()), { type: A.DRAFT_CARRY, from: 'a', to: 'b' });
    const s = reduce(fresh(), { type: A.STATE_REPLACE, state: wanted });
    expect(s).toEqual(wanted);
    const partial = JSON.parse(JSON.stringify(wanted));
    delete partial.draft.b;
    delete partial.answers.a.detail;
    delete partial.draft.a.carriedFrom;
    const t = reduce(fresh(), { type: A.STATE_REPLACE, state: partial });
    expect(t.draft.b).toEqual({ values: {}, touched: [], asked: false, revealed: [], carriedFrom: null, spendHow: null, skipNoted: false });
    expect(t.answers.a.detail).toBe(null);
    expect(t.draft.a.carriedFrom).toBe(null);
    const prod = initialState({ today: TODAY });
    expect(reduce(prod, { type: A.STATE_REPLACE, state: wanted })).toBe(prod);
  });
});

// ---- any sequence of actions over the three questions ------------------------------------------------------------

const typed = fc.oneof(fc.constantFrom('', '250,000', '£1', 'abc', '45', '50', '58', '60', '67', '70', '0', '700', '2,000', '0.5%', 'couple', 'single', 'amount', 'level', 'age', 'ages', 'moderate'), fc.boolean());
const key = fc.constantFrom('K1', 'K2', null, 'NOW');
const question = fc.constantFrom(...Q);
const fieldOf = question.chain((q) => fc.constantFrom(...SCHEMAS[q].fields.filter((f) => f.type !== 'steps').map((f) => f.path)).map((path) => [q, path]));
const anyRoute = fc.constantFrom(route('front'), route('step', 'a', 'numbers'), route('step', 'a', 'spend'), route('step', 'a', 'answer'), route('step', 'a', 'ages'),
  route('step', 'a', 'keep'), route('step', 'b', 'spend'), route('step', 'b', 'answer'), route('step', 'b', 'choices'), route('step', 'c', 'answer'), route('step', 'c', 'keep'),
  route('soon', 'a'), route('soon', 'd'));
const saver = fc.constantFrom('a', 'b');
const lineId = fc.constantFrom('l1', 'l2', 'l9', 'l38', 'l40', 'l99');
const oneOffId = fc.constantFrom('o1', 'o4', 'o5', 'o9');
const budgetText = fc.constantFrom('', '150', '£1,200', '11.99+8.99', 'abc', '-5', '2031', '8', 'New boiler');
const resultFor = (q, n, detail) => (q === 'a' ? resultA({ detail: detail || 'chart', middling: n }) : q === 'b' ? resultB({ detail: detail || 'answer', careful: n }) : { status: 'ok', monthly: { careful: n }, basis: {} });
const carries = Object.keys(CARRY).map((k) => k.split('→'));

const anyAction = fc.oneof(
  anyRoute.map((r) => ({ type: A.ROUTE_SET, route: r })),
  fc.tuple(fieldOf, typed).map(([[q, path], value]) => set(q, path, value)),
  fc.constant('fillA'), fc.constant('fillB'),
  fieldOf.map(([q, path]) => ({ type: A.DRAFT_TOUCH, q, path })),
  question.map((q) => ({ type: A.DRAFT_ASK, q })),
  question.map((q) => ({ type: A.DRAFT_RESET, q })),
  fc.constantFrom(...carries).map(([from, to]) => ({ type: A.DRAFT_CARRY, from, to })),
  fc.tuple(question, key).map(([q, inputsKey]) => ({ type: A.ANSWER_WORKING, q, inputsKey })),
  fc.tuple(question, key).map(([q, inputsKey]) => ({ type: A.ANSWER_PROGRESS, q, inputsKey, done: 3, total: 100 })),
  fc.tuple(question, key, fc.integer({ min: 0, max: 900000 })).map(([q, inputsKey, n]) => ({ type: A.ANSWER_FIRST, q, inputsKey, result: resultFor(q, n) })),
  fc.tuple(question, key, fc.integer({ min: 0, max: 900000 }), fc.constantFrom(null, 'all', 'grid')).map(([q, inputsKey, n, d]) => ({ type: A.ANSWER_FINAL, q, inputsKey, result: resultFor(q, n, d) })),
  fc.tuple(fc.constantFrom('a', 'b'), key).map(([q, inputsKey]) => ({ type: A.ANSWER_EXTEND, q, inputsKey })),
  fc.tuple(question, key).map(([q, inputsKey]) => ({ type: A.ANSWER_FAILED, q, inputsKey })),
  question.map((q) => ({ type: A.ANSWER_SLOW, q })),
  question.map((q) => ({ type: A.ANSWER_RETRY, q })),
  fc.constantFrom(...OPENABLE).map((id) => ({ type: A.UI_TOGGLE, id })),
  fc.boolean().map((open) => ({ type: A.UI_RAIL, open })),
  fc.boolean().map((online) => ({ type: A.UI_ONLINE, online })),
  fc.constantFrom('2026-09-30', '2028-04-06').map((today) => ({ type: A.ENV_SET, patch: { today } })),
  fc.constant(null).map(() => ({ type: A.STATE_REPLACE, state: { ...fresh(), plan: { id: 'x' }, session: { kind: 'user', uid: 'u' } } })),
  // the saved plans, read-only (research/v7/your-plan.md): the session, the plans in page memory, the hand-over
  fc.constantFrom('checking', 'in', 'unverified', 'nobody', 'failed', 'none').map((kind) => ({ type: A.SESSION_SET, session: { kind, email: kind === 'in' ? 'a@b.c' : null } })),
  fc.constant({ type: A.SESSION_OUT }),
  fc.constant({ type: A.PLANS_READING }),
  fc.constantFrom('account', 'window').map((source) => ({ type: A.PLANS_SET, list: [{ plan: { id: 'p1', planDetails: { name: 'One' } }, newer: false, failed: false }, { plan: null }], source, readAt: '14:03' })),
  fc.constant({ type: A.PLANS_FAILED }),
  fc.constant({ type: A.PLANS_VIEW, view: { today: '2026-09-30', rows: [], page: null } }),
  fc.constant({ type: A.PLANS_CLEAR }),
  fc.constant({ type: A.PLAN_CHANGE, planId: 'p1', place: 'month', back: '#/plan/p1' }),
  fc.constant({ type: A.PLAN_CHANGE_FAILED }),
  // editing a saved plan: "About you and when" (research/v7/editing-in-v7.md 4): the draft of one plan, its save, its undo
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom('age', 'stopped', 'stopAge', 'stopMonth', 'startWhen', 'endAge', 'sex', 'chance'), fc.constantFrom('', '58', 'yes', 'age', 'month', '2030-06', 'april', 'abc', null))
    .map(([planId, path, value]) => ({ type: A.PLAN_EDIT, planId, path, value })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom('age', 'stopped', 'stopAge', 'endAge')).map(([planId, path]) => ({ type: A.PLAN_TOUCH, planId, path })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_SAVE, planId })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom(null, {}, { 'stressTool.settings.duration': 32 })).map(([planId, previous]) => ({ type: A.PLAN_SAVED, planId, previous, line: { id: 'runsTo', slots: { endAge: 93, years: 32 } } })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom('locked', 'notHere', 'usedUp', 'nobody', 'storage', 'failed', 'problems', 'readonly', 'notLocked', 'noWorker', 'noRun')).map(([planId, problem]) => ({ type: A.PLAN_SAVE_FAILED, planId, problem })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_CANCEL, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_UNDO, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_UNDO_DONE, planId })),
  fc.constant({ type: A.PLAN_TOAST_CLOSE }),
  // "Lock the plan" (road-to-7.md step 6): the lock, the unlock, a new version; a lock's toast with its moment
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_LOCK, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_UNLOCK, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_DOCUMENT, planId })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom('lock', 'unlock', 'document')).map(([planId, op]) => ({ type: A.PLAN_SAVED, planId, previous: { 'decisionTool.settings.locked': false }, line: { id: 'locked', slots: { date: '2 October 2026' } }, op, lockedAt: '2026-10-02T14:03:00.000Z' })),
  // "Does it last?" (editing-in-v7.md 10.4)
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.LASTS_WORKING, key })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.integer({ min: 0, max: 2 })).map(([key, done]) => ({ type: A.LASTS_PROGRESS, key, done, total: 2 })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom({ strategyId: 'pots-and-valves', a: null }, { strategyId: 'buckets-in-order', a: { share: 0.9 } })).map(([key, result]) => ({ type: A.LASTS_DONE, key, result })),
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.LASTS_FAILED, key })),
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.LASTS_SLOW, key })),
  fc.constant({ type: A.LASTS_RETRY }),
  // the three levers on "Does it last?" (road-to-7.md step 7): typed, tried, done or failed under a key, put away
  fc.tuple(fc.constantFrom('yearly', 'years'), fc.constantFrom('', '15,000', '3', '9', 'abc')).map(([field, value]) => ({ type: A.LEVER_TYPE, field, value })),
  fc.constantFrom('spendMore', 'work', 'fall').map((kind) => ({ type: A.LEVER_TRY, kind })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom('spendMore', 'work', 'fall')).map(([key, kind]) => ({ type: A.LEVER_DONE, key, kind, result: { kind, ok: true, runs: 1, at: { share: 0.9, chancePct: 90 } } })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom('spendMore', 'work', 'fall'), fc.constantFrom(null, 'noWorker')).map(([key, kind, reason]) => ({ type: A.LEVER_FAILED, key, kind, ...(reason ? { reason } : {}) })),
  fc.constantFrom('spendMore', 'work', 'fall').map((kind) => ({ type: A.LEVER_CLOSE, kind })),
  // "How the money is taken" (way-and-mix.md 2.2): the nine ways for one plan by its run key; a card opened, a dial typed, a way tried
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.WAYS_WORKING, key })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.integer({ min: 0, max: 9 })).map(([key, done]) => ({ type: A.WAYS_PROGRESS, key, done, total: 9 })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.integer({ min: 0, max: 20000 })).map(([key, ms]) => ({ type: A.WAYS_DONE, key, result: { strategyId: 'pots-and-valves', ways: [{ id: 'pots-and-valves', affordable: true }] }, ms })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom(null, 'noWorker')).map(([key, reason]) => ({ type: A.WAYS_FAILED, key, ...(reason ? { reason } : {}) })),
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.WAYS_SLOW, key })),
  fc.constant({ type: A.WAYS_RETRY }),
  fc.constantFrom(null, 'pots-and-valves', 'floor-to-age', 'gilt-rotation').map((id) => ({ type: A.WAY_OPEN, id })),
  fc.tuple(fc.constantFrom('floor-to-age', 'gilt-rotation'), fc.constantFrom('floorToAge', 'cashYears'), fc.constantFrom('', '3', '82')).map(([id, key, value]) => ({ type: A.WAY_DIAL, id, key, value })),
  fc.tuple(fc.constantFrom('floor-to-age', 'gilt-rotation'), fc.constantFrom({ floorToAge: 82 }, { cashYears: 3 })).map(([id, values]) => ({ type: A.WAY_TRY, id, values })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom('floor-to-age', 'gilt-rotation'), fc.constantFrom({ floorToAge: 82 }, { cashYears: 3 })).map(([key, id, values]) => ({ type: A.WAY_TRIED, key, id, values, result: { id, affordable: true }, ms: 120 })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom('floor-to-age', 'gilt-rotation'), fc.constantFrom({ floorToAge: 82 }, { cashYears: 3 })).map(([key, id, values]) => ({ type: A.WAY_TRY_FAILED, key, id, values })),
  fc.constantFrom('lasts', 'left', 'score', 'coverage').map((by) => ({ type: A.WAY_RANK, by })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom('floor-to-age', 'gilt-rotation')).map(([planId, id]) => ({ type: A.PLAN_WAY, planId, id })),
  // "The mix" (way-and-mix.md 3.2) and Try a change on a plan (4)
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom('sleeve', 'tent')).map(([key, kind]) => ({ type: A.MIX_TRY, key, kind })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom('sleeve', 'tent')).map(([key, kind]) => ({ type: A.MIX_TRIED, key, kind, result: { kind, on: true, affordable: true, a: { share: 0.9 } }, ms: 400 })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.constantFrom('sleeve', 'tent')).map(([key, kind]) => ({ type: A.MIX_TRY_FAILED, key, kind })),
  fc.constantFrom('sleeve', 'tent').map((kind) => ({ type: A.MIX_TRY_CLOSE, kind })),
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.MIX_COMPARE, key })),
  fc.tuple(fc.constantFrom('k1', 'k2'), fc.integer({ min: 0, max: 8 })).map(([key, done]) => ({ type: A.MIX_COMPARE_PROGRESS, key, done, total: 8 })),
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.MIX_COMPARED, key, result: { cells: [{ key: 'own', tent: false, affordable: true, share: 0.9 }] }, ms: 3000 })),
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.MIX_COMPARE_FAILED, key })),
  fc.constantFrom(null, { key: 'own', tent: false }, { key: 'balanced', tent: true }).map((cell) => ({ type: A.MIX_PICK, cell })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom({ key: 'own', tent: true }, { key: 'cautious', tent: false })).map(([planId, cell]) => ({ type: A.PLAN_MIX, planId, cell })),
  fc.constant({ type: A.TRY_RUN, boxes: { way: 'pots-and-valves', pot: 500000 } }),
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.TRY_DONE, key, boxes: { way: 'pots-and-valves', pot: 500000 }, result: { strategyId: 'pots-and-valves', a: { share: 0.9 } }, ms: 500 })),
  fc.constantFrom('k1', 'k2').map((key) => ({ type: A.TRY_FAILED, key, boxes: { way: 'pots-and-valves', pot: 500000 } })),
  fc.constant({ type: A.TRY_CLOSE }),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_TRY, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.TRY_KEEP, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.TRY_KEPT, planId, id: 'Kq8LwT2mJv5PzYc9BnRd', name: 'One · tried', where: 'account' })),
  // "Your household" (road-to-7.md step 9)
  fc.tuple(fc.constantFrom('h1', 'h2'), fc.constantFrom(null, { kind: 'untilAge', who: 'b', age: 67 })).map(([key, limit]) => ({ type: A.HH_RUN, key, limit })),
  fc.tuple(fc.constantFrom('h1', 'h2'), fc.integer({ min: 0, max: 4 })).map(([key, done]) => ({ type: A.HH_PROGRESS, key, done, total: 4 })),
  fc.tuple(fc.constantFrom('h1', 'h2'), fc.constantFrom(null, { kind: 'untilAge', who: 'b', age: 67 })).map(([key, limit]) => ({ type: A.HH_DONE, key, limit, result: { ok: true, split: { applies: false } }, ms: 1200 })),
  fc.tuple(fc.constantFrom('h1', 'h2'), fc.constantFrom(null, { kind: 'untilAge', who: 'b', age: 67 })).map(([key, limit]) => ({ type: A.HH_FAILED, key, limit })),
  fc.constantFrom('h1', 'h2').map((key) => ({ type: A.HH_SURVIVOR, key, boxes: { who: 'a', atAge: 75, spendPct: 70, dbPct: 50 } })),
  fc.constantFrom('h1', 'h2').map((key) => ({ type: A.HH_SURVIVOR_DONE, key, boxes: { who: 'a', atAge: 75, spendPct: 70, dbPct: 50 }, result: { affordable: true }, ms: 900 })),
  fc.constantFrom('h1', 'h2').map((key) => ({ type: A.HH_SURVIVOR_FAILED, key, boxes: { who: 'a', atAge: 75, spendPct: 70, dbPct: 50 } })),
  fc.constantFrom('h1', 'h2').map((key) => ({ type: A.HH_CARE, key, boxes: { who: 'b', fromAge: 85, years: 3, cost: 90000 } })),
  fc.constantFrom('h1', 'h2').map((key) => ({ type: A.HH_CARE_DONE, key, boxes: { who: 'b', fromAge: 85, years: 3, cost: 90000 }, result: { affordable: true }, ms: 900 })),
  fc.constantFrom('h1', 'h2').map((key) => ({ type: A.HH_CARE_FAILED, key, boxes: { who: 'b', fromAge: 85, years: 3, cost: 90000 } })),
  fc.constantFrom('survivor', 'care').map((what) => ({ type: A.HH_CLOSE, what })),
  fc.constantFrom(null, 'split', 'link', 'unlink', 'share', 'separate').map((what) => ({ type: A.HH_PICK, what })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom(null, 'p2')).map(([planId, partnerId]) => ({ type: A.PLAN_LINK, planId, partnerId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_SPLIT, planId })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.boolean()).map(([planId, dismiss]) => ({ type: A.PLAN_DISMISS, planId, dismiss })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.boolean()).map(([planId, share]) => ({ type: A.PLAN_BUDGET_SHARE, planId, share })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.SPLIT_KEPT, planId, ids: { a: 'Kq8LwT2mJv5PzYc9BnRd', b: 'guest-k3v9x1qa' }, names: { a: 'One — drawing together', b: 'Two — drawing together' }, where: 'window' })),
  // "What you hold" and "Moving to your plan's mix" (road-to-7.md step 10)
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom({ kind: 'add', line: { wrapper: 'ISA', ticker: 'VWRP' } }, { kind: 'remove', index: 0 })).map(([planId, change]) => ({ type: A.PLAN_HOLD, planId, change })),
  // the budget on a saved plan (road-to-7.md step 11b)
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom({ kind: 'line', id: 'b1', field: 'amount', value: 100 }, { kind: 'reset' })).map(([planId, change]) => ({ type: A.PLAN_BUDGET, planId, change })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_BUDGET_FILE, planId, file: null })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom('Type,Item', null)).map(([planId, text]) => ({ type: A.PLAN_BUDGET_FILE_READ, planId, text })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_BUDGET_DOWNLOAD, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_RECORD, planId })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom('gilt:T29', 'bucket:shares'), fc.boolean()).map(([planId, key, done]) => ({ type: A.PLAN_TICK, planId, key, done })),
  fc.constantFrom('m1', 'm2').map((key) => ({ type: A.MOVE_RUN, key })),
  fc.constantFrom('m1', 'm2').map((key) => ({ type: A.MOVE_DONE, key, result: { affordable: true, a: { share: 0.9 }, basis: { runs: 1 } }, ms: 500 })),
  fc.tuple(fc.constantFrom('m1', 'm2'), fc.constantFrom(null, 'noWorker')).map(([key, reason]) => ({ type: A.MOVE_FAILED, key, reason })),
  fc.constantFrom(null, { level: 5000, ath: 7000, asOf: '2026-10-19' }).map((index) => ({ type: A.MOVE_INDEX, index })),
  // the budget step (budget-step.md) and "Save this as a plan" (save-as-plan.md)
  saver.map((q) => ({ type: A.DRAFT_ONWARD, q })),
  fc.tuple(saver, fc.constantFrom('lines', 'one')).map(([q, how]) => ({ type: A.SPEND_HOW, q, how })),
  fc.tuple(lineId, fc.constantFrom('amount', 'period', 'essential', 'label'), fc.oneof(budgetText, fc.constantFrom('mo', 'yr'), fc.boolean()))
    .map(([id, field, value]) => ({ type: A.BUDGET_LINE, id, field, value })),
  fc.constantFrom('home', 'bills', 'food', 'other').map((heading) => ({ type: A.BUDGET_ADD, heading })),
  lineId.map((id) => ({ type: A.BUDGET_REMOVE, id })),
  fc.tuple(oneOffId, fc.constantFrom('label', 'amount', 'year', 'everyYears'), budgetText).map(([id, field, value]) => ({ type: A.BUDGET_ONE_OFF, id, field, value })),
  fc.constant({ type: A.BUDGET_ADD_ONE_OFF }),
  oneOffId.map((id) => ({ type: A.BUDGET_REMOVE_ONE_OFF, id })),
  fc.tuple(fc.oneof(lineId, oneOffId), fc.constantFrom('amount', 'label', 'year')).map(([id, field]) => ({ type: A.BUDGET_TOUCH, id, field })),
  saver.map((q) => ({ type: A.BUDGET_USE, q })),
  fc.tuple(question, fc.constantFrom('', 'Stop at 60', 'x'.repeat(70))).map(([q, value]) => ({ type: A.KEEP_NAME, q, value })),
  question.map((q) => ({ type: A.KEEP_SAVE, q })),
  // the plan made by the preview itself (road-to-7.md step 7): in the account or this window, a couple's partner plan beside it
  fc.tuple(question, fc.constantFrom('account', 'window'), fc.constantFrom(null, 'guest-k3v9x1qa')).map(([q, where, partnerId]) =>
    ({ type: A.KEEP_MADE, q, id: where === 'window' ? 'guest-a1b2c3d4' : 'Kq8LwT2mJv5PzYc9BnRd', name: 'Stop at 60', where, ...(partnerId ? { partnerId, partnerName: 'Stop at 60 · partner' } : {}) })),
  fc.tuple(question, fc.constantFrom('storage', 'notReady', 'full', 'usedUp', 'unverified', 'failed', 'partial', 'sideways')).map(([q, problem]) => ({ type: A.KEEP_FAILED, q, problem, ...(problem === 'partial' ? { name: 'Stop at 60 · partner' } : {}) })),
  // the spending shape (research/v7/spending-shape.md 4.3): A's and B's spend step, C's more detail; a step index past the
  // end is a press on a step already gone, and changes nothing
  fc.tuple(question, fc.integer({ min: 0, max: 3 }), fc.constantFrom('fromAge', 'amount', 'fallsPct', 'then'), fc.constantFrom('', '75', '85', '2,000', '85', '1', '0.25', 'abc'))
    .map(([q, i, f, value]) => {
      const field = f === 'amount' ? (q === 'c' ? 'share' : 'perMonth') : f;
      return { type: A.SHAPE_STEP, q, i, field, value: field === 'then' ? ['level', 'falls', 'glides'][value.length % 3] : value };
    }),
  fc.tuple(question, fc.integer({ min: 0, max: 3 }), fc.constantFrom('fromAge', 'fallsPct', 'then')).map(([q, i, field]) => ({ type: A.SHAPE_TOUCH, q, i, field })),
  question.map((q) => ({ type: A.SHAPE_ADD, q })),
  fc.tuple(question, fc.integer({ min: 0, max: 3 })).map(([q, i]) => ({ type: A.SHAPE_REMOVE, q, i })),
  question.map((q) => ({ type: A.SHAPE_SORT, q })),
  question.map((q) => ({ type: A.SHAPE_SUGGEST, q })),
  fc.tuple(question, fc.constantFrom('level', 'slowly')).map(([q, id]) => ({ type: A.SHAPE_PRESET, q, id })),
  question.map((q) => ({ type: A.SHAPE_UNDO, q })),
  question.map((q) => ({ type: A.SHAPE_RESCALE, q })),
  // the plan menu, the visitor, the account page and What's new (road-to-7.md step 11; tests/v7/shell/plans.test.js and account.test.js hold their rules)
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom(null, 'rename', 'copy', 'delete'), fc.constantFrom(1, 2), fc.constantFrom('', 'One', 'x'.repeat(70))).map(([planId, kind, step, text]) => ({ type: A.PLAN_ACTION, planId, kind, step, text })),
  fc.constantFrom('', 'Two', 'x'.repeat(70)).map((value) => ({ type: A.PLAN_ACTION_TEXT, value })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.constantFrom('', 'Two', 'x'.repeat(70))).map(([planId, name]) => ({ type: A.PLAN_RENAME, planId, name })),
  fc.tuple(fc.constantFrom('p1', 'p2'), fc.boolean()).map(([planId, carry]) => ({ type: A.PLAN_COPY, planId, carry })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_MAIN, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_DELETE, planId })),
  fc.constantFrom('p1', 'p2').map((planId) => ({ type: A.PLAN_DOWNLOAD, planId })),
  fc.constant({ type: A.PLAN_OPEN_FILE, file: { name: 'plan.json' } }),
  fc.constant({ type: A.PLAN_EXAMPLE }),
  fc.tuple(fc.constantFrom('p1', null), fc.constantFrom('renamed', 'copied', 'copiedLocked', 'main', 'deleted', 'opened', 'example', 'brought')).map(([planId, op]) => ({ type: A.PLAN_ACTION_DONE, planId, op, slots: { name: 'One', n: 2 } })),
  fc.tuple(fc.constantFrom('p1', 'p2', null), fc.constantFrom('lastPlan', 'example', 'badFile', 'fileProblems', 'empty', 'tooLong')).map(([planId, problem]) => ({ type: A.PLAN_SAVE_FAILED, planId, problem, detail: 'a problem' })),
  fc.tuple(fc.integer({ min: 0, max: 200 }), fc.boolean(), fc.constantFrom(undefined, null, { level: 1, left: 165 }, { level: 4, left: 30 }, { level: 9, left: 1 })).map(([minutes, usedUp, nag]) => ({ type: A.GUEST_TICK, minutes, usedUp, ...(nag === undefined ? {} : { nag }) })),
  fc.constant({ type: A.GUEST_NAG_CLOSE }),
  fc.integer({ min: 1, max: 3 }).map((count) => ({ type: A.GUEST_OFFER, count })),
  fc.constant({ type: A.GUEST_OFFER_CLOSE }),
  fc.constant({ type: A.GUEST_BRING_IN }),
  fc.constantFrom('signIn', 'signUp', 'reset').map((mode) => ({ type: A.ACCOUNT_MODE, mode })),
  fc.constantFrom('signIn', 'signUp', 'google', 'reset', 'verifyCheck', 'verifySend', 'download', 'delete').map((what) => ({ type: A.ACCOUNT_ASK, what, email: 'a@b.c', password: 'pw' })),
  fc.constantFrom('signIn', 'signUp', 'reset', 'verifySend', 'download').map((what) => ({ type: A.ACCOUNT_DONE, what, slots: { email: 'a@b.c' } })),
  fc.tuple(fc.constantFrom('signIn', 'signUp', 'delete'), fc.constantFrom('auth/wrong-password', 'failed', '')).map(([what, problem]) => ({ type: A.ACCOUNT_FAILED, what, problem })),
  fc.constantFrom(null, 1, 2, 3).map((step) => ({ type: A.ACCOUNT_CONFIRM, step })),
  fc.boolean().map((signInGone) => ({ type: A.ACCOUNT_DELETED, signInGone })),
  fc.constantFrom(null, { lastSeenVersion: '6.40.0' }, { lastSeenVersion: 7 }).map((profile) => ({ type: A.PROFILE_SET, profile })),
  fc.constant({ type: A.NEWS_SHOW, entries: [{ version: '6.44.0', title: 'x', date: '2026-10-27' }] }),
  fc.constant({ type: A.NEWS_DISMISS }),
  fc.constantFrom(null, [{ version: '6.44.0', title: 'x' }]).map((releases) => (releases ? { type: A.NEWS_PAGE, releases, history: [{ version: '6.0.1', title: 'y' }] } : { type: A.NEWS_PAGE, page: null })),
  fc.constantFrom('6.44.0', '6.43.0').map((version) => ({ type: A.NEWS_SEEN, version }))
);

/** 'NOW' is the key of what is typed at that moment, as the runner would send it; 'fillA'/'fillB' type a whole draft. */
function concrete(state, a) {
  if (a === 'fillA') return { type: 'fill', q: 'a' };
  if (a === 'fillB') return { type: 'fill', q: 'b' };
  if (a && a.inputsKey === 'NOW') return { ...a, inputsKey: currentKey(state, a.q) };
  return a;
}
function apply(state, a) {
  const action = concrete(state, a);
  if (action.type === 'fill') return action.q === 'a' ? typedA(state) : typedB(state);
  return reduce(state, action);
}

describe('any sequence of actions over the three questions', () => {
  it('the generator covers every action type', () => {
    const seen = new Set(fc.sample(anyAction, 3000).filter((a) => typeof a === 'object').map((a) => a.type));
    expect([...seen].sort()).toEqual([...ACTION_TYPES].sort());
  });
  it('the state survives JSON; plan never changes, the session is a known kind; every answer is in a known state', () => {
    fc.assert(fc.property(fc.array(anyAction, { maxLength: 30 }), (actions) => {
      let s = fresh();
      for (const a of actions) {
        s = apply(s, a);
        expect(s.plan).toBe(null);
        expect(['none', 'checking', 'in', 'unverified', 'nobody', 'failed']).toContain(s.session.kind);
        // the plans never reach the draft store's shape (your-plan.md 3.8): page memory only, under one key
        if (s.plans !== null) expect(['reading', 'read', 'failed']).toContain(s.plans.status);
      }
      expect(JSON.parse(JSON.stringify(s))).toEqual(s);
      // the questions' drafts, and the one plan draft of the editing step (editing-in-v7.md 4): one plan's id, text by path
      expect(Object.keys(s.draft).sort()).toEqual([...Q, 'd', 'plan'].sort());
      expect(s.draft.plan.id === null || typeof s.draft.plan.id === 'string').toBe(true);
      for (const v of Object.values(s.draft.plan.values)) expect(typeof v).toBe('string');
      for (const q of Q) {
        expect(['idle', 'working', 'first', 'final', 'failed']).toContain(s.answers[q].status);
        if (q !== 'c') {
          expect(typeof s.answers[q].extending).toBe('boolean');
          if (s.answers[q].extending) expect(s.answers[q].status).toBe('final');
          expect([null, 'c', 'a', 'b']).toContain(s.draft[q].carriedFrom);
        } else {
          expect('extending' in s.answers.c).toBe(false);
          expect('carriedFrom' in s.draft.c).toBe(false);
        }
        expect(Object.keys(s.keep[q]).sort()).toEqual(['made', 'name', 'partnerKept', 'problem', 'saving']);
      }
      if (s.budget) expect(Object.keys(s.budget).sort()).toEqual(['lines', 'oneOffs', 'touched', 'version']);
    }), { numRuns: 300 });
  });
  it('a result only ever comes from the key it is filed under, in every question', () => {
    fc.assert(fc.property(fc.array(anyAction, { maxLength: 30 }), (actions) => {
      let s = fresh();
      const filed = { a: null, b: null, c: null };
      for (const a of actions) {
        const action = concrete(s, a);
        const next = apply(s, a);
        for (const q of Q) {
          if (next.answers[q].result !== s.answers[q].result) {
            if ((action.type === A.ANSWER_FIRST || action.type === A.ANSWER_FINAL) && action.q === q) {
              filed[q] = action.inputsKey;
              expect(action.inputsKey).toBe(s.answers[q].inputsKey);
            } else filed[q] = null;
          }
          if (next.answers[q].status === 'first' || next.answers[q].status === 'final') expect(next.answers[q].inputsKey).toBe(filed[q]);
        }
        s = next;
      }
    }), { numRuns: 300 });
  });
  it('a carry never changes its source draft, and never an answer', () => {
    fc.assert(fc.property(fc.array(anyAction, { maxLength: 20 }), fc.constantFrom(...carries), (actions, [from, to]) => {
      let s = fresh();
      for (const a of actions) s = apply(s, a);
      const next = reduce(s, { type: A.DRAFT_CARRY, from, to });
      expect(next.draft[from]).toBe(s.draft[from]);
      expect(next.answers).toBe(s.answers);
      expect(parsedDraft(next, to)).toBeTruthy();
    }), { numRuns: 200 });
  });
});
