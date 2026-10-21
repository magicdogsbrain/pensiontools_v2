/**
 * The machinery of "Your household" (research/v7/road-to-7.md step 9): the reducer (the pooled run, the survivor's and the
 * care's filed under the pair's key and their boxes; a stale result dropped; the confirms; the plans leaving memory clears it;
 * state/replace; readyMark), the runner with a fake client (the pooled run in the household lane with the limit and progress;
 * the survivor and care lanes; failed and no worker; the pair moving under a run ends it), the worker handler's three
 * messages, the client's lanes, and the one write file: the link (kind 'link'), "Keep things as they are" (kind 'dismiss'),
 * the budget shared (kind 'budgetShare': the write on the partner's plan), the split (kind 'split': one write per unlocked plan
 * of exactly the five keys, Undo putting both back; copies through the ONE create when a plan is locked, linked to each other,
 * never locked, the originals untouched), and the step's own save (who pays) — every path declared, past the guard, the
 * window's plans byte-identical elsewhere; a property test: whatever is typed, every path written is declared.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyHousehold, emptyLasts } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { readyMark, planHouseholdView } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startHouseholdRunner } from '../../../src/v7/effects/household.js';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { pairKeyOf, splitPatches, linkPatch, whoPaysPatches, checkHousehold, boxesOf, shareBudgetPatches } from '../../../src/answers/plan/household.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { HOUSEHOLD_WRITES, HOUSEHOLD_FIELDS, isHouseholdPath, isPlanEditPath, ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { SPLIT_KEYS } from '../../../src/services/HouseholdSplitApply.js';
import { isLockedSettings } from '../../../src/services/LockedPlanGuard.js';
import { planProblems } from '../../../src/answers/keep/planCreate.js';
import { corpus, entryOf, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
/** Alex's and Sam's plans (the couple fixtures), linked both ways; `unequal` makes the split apply (gate 9's pair). */
function couple({ unequal = false, lockSam = false, link = 'both' } = {}) {
  const alex = copy(C['09-couple-a']), sam = copy(C['10-couple-b']);
  alex.id = 'AlexC1'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = true;
  sam.id = 'SamC2'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = false;
  alex.household = link === 'theirs' ? undefined : { partnerScenarioId: 'SamC2' };
  sam.household = link === 'mine' ? undefined : { partnerScenarioId: 'AlexC1' };
  if (link === 'theirs') delete alex.household;
  if (link === 'mine') delete sam.household;
  if (unequal) { const s = alex.stressTool.settings; s.equityMin *= 4; s.bondMin *= 4; s.cashTarget *= 4; s.baseSalary = 70000; }
  if (lockSam) sam.decisionTool.settings = { ...sam.decisionTool.settings, locked: true, lockedAt: '2026-09-01T00:00:00.000Z' };
  return { alex, sam };
}
/** A made-up pooled result in the run's shape: the split applies when `applies`. */
function fakeRun({ applies = false, fingerprint = 'fp1' } = {}) {
  const combined = { runs: 1000, jointSuccess: 0.9, successA: 0.93, successB: 0.95, pooled: { success: 0.95, coveredByA: 10, coveredByB: 40, fromAgeMedian: 88, fromAgeEarliest: 80 }, potFan: [{ year: 0, p10: 1, p50: 2, p90: 3 }] };
  const sched = (n, v) => Array.from({ length: n }, () => v);
  const split = { names: { a: 'Alex’s plan', b: 'Sam’s plan' }, smaller: 'b', larger: 'a', untilAge: 67, untilC: 5, applies, unchanged: !applies, limit: null, fingerprint,
    saving: { year: applies ? 4932 : 0, until: applies ? 29595 : 0, whole: applies ? 121757 : 0 }, tax: { firstYear: applies ? { own: 20000, together: 15000, year: 0 } : null, until: { own: 1, together: 1 }, whole: { own: 1, together: 1 } },
    pots: { a: 1422000, b: 287542 }, unused: { over: 20000, allowanceUnused: 12570, bandUnused: 30000, bandMost: true }, note2028: '', ladderNote: '',
    steps: { a: [{ fromAge: 66, amount: 50270 }], b: [{ fromAge: 62, amount: 32798 }] },
    schedules: { own: { a: sched(31, 70000), b: sched(33, 18000) }, together: { a: sched(31, applies ? 50270 : 70000), b: sched(33, applies ? 32798 : 18000) } },
    needs: { own: { a: sched(31, 1), b: sched(33, 1) }, together: { a: sched(31, 1), b: sched(33, 1) } } };
  return { ok: true, names: split.names, offsets: { a: 2, b: 4 }, split, own: { combined, rA: { affordable: true, ruin: { mc: 7 }, terminal: { p10: 1, p50: 2, p90: 3 } }, rB: { affordable: true, ruin: { mc: 5 }, terminal: { p10: 1, p50: 2, p90: 3 } } },
    together: applies ? { combined, rA: { affordable: true, ruin: { mc: 6 } }, rB: { affordable: true, ruin: { mc: 5 } } } : null, fig: null, timeline: [{ year: 0, needA: 1, needB: 1, spA: 0, spB: 0, db: 0, other: 0, drawNeed: 2, bridge: true, workingA: false, workingB: true }], basis: { today: TODAY, engine: 'one-test', runs: applies ? 4 : 2 } };
}
const SURVIVOR_BOXES = { who: 'a', atAge: 74, spendPct: 70, dbPct: 50 };
const SURVIVOR = { affordable: true, who: 'a', atAge: 74, deathYear: 10, spendPct: 70, dbPct: 50, middling: { a: { share: 0.9 } }, bad: { a: { share: 0.8 } }, inherited: { middling: { total: 100 }, bad: { total: 50 }, heldIsa: 0 }, spending: { gross: 30000, net: 26000 }, names: { a: 'Alex’s plan', b: 'Sam’s plan' }, basis: { runs: 3 } };
const CARE = { affordable: true, who: 'A', fromAge: 79, startYear: 15, years: 3, annualCost: 90000, totalCareCost: 270000, totalCareGross: 300000, baseline: { jointSuccess: 0.9, pooled: { success: 0.95 } }, care: { jointSuccess: 0.8, pooled: { success: 0.85 } }, rows: [], basis: { runs: 3 } };

/** A store on the household step of a plan, the plans read (an account or this window), the reading done as the plan source does. */
function pageOn(raws, planId, { source = 'account', session = 'in', typed = {} } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/household') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source, readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  let last = null;
  store.subscribe((state) => {
    const now = [state.household, state.draft.plan, state.plans && state.plans.list];
    if (state.plans && state.plans.status === 'read' && (!state.plans.view || !last || now.some((v, i) => v !== last[i]))) { last = now; store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); }
  });
  const plan = list.find((e) => String(e.plan.id) === String(planId)).plan;
  const partner = list.find((e) => String(e.plan.id) !== String(planId));
  return { store, key: partner ? pairKeyOf(plan, partner.plan) : null, list, plan, partner: partner ? partner.plan : null };
}
/** The pooled run held for the pair, so the split's and the budget's writes have a run to stand on. */
function ran(p, result = fakeRun()) {
  p.store.dispatch({ type: A.HH_RUN, key: p.key, limit: null });
  p.store.dispatch({ type: A.HH_DONE, key: p.key, limit: null, result, ms: 1200 });
}

describe('the reducer: the household\'s runs in page memory', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('starts empty; the pooled run is filed under its key and its limit, with progress, done or failed; a stale result is dropped; another key empties the rest', () => {
    expect(s0.household).toEqual(emptyHousehold());
    let s = reduce(s0, { type: A.HH_RUN, key: 'h1', limit: null });
    expect(s.household).toMatchObject({ key: 'h1', status: 'working', limit: null });
    expect(reduce(s, { type: A.HH_RUN, key: 'h1', limit: null })).toBe(s);
    s = reduce(s, { type: A.HH_PROGRESS, key: 'h1', done: 1, total: 2 });
    expect(s.household.progress).toEqual({ done: 1, total: 2 });
    expect(reduce(s, { type: A.HH_PROGRESS, key: 'h2', done: 1, total: 2 })).toBe(s);
    expect(reduce(s, { type: A.HH_DONE, key: 'h2', limit: null, result: fakeRun(), ms: 1 })).toBe(s);                                       // stale key
    expect(reduce(s, { type: A.HH_DONE, key: 'h1', limit: { kind: 'untilAge', who: 'b', age: 67 }, result: fakeRun(), ms: 1 })).toBe(s);     // stale limit
    expect(() => reduce(s, { type: A.HH_DONE, key: 'h1', limit: null, result: null })).toThrow(/needs a result/);
    s = reduce(s, { type: A.HH_DONE, key: 'h1', limit: null, result: fakeRun(), ms: 1200.4 });
    expect(s.household).toMatchObject({ status: 'done', ms: 1200, progress: null });
    const f = reduce(reduce(s0, { type: A.HH_RUN, key: 'h1', limit: null }), { type: A.HH_FAILED, key: 'h1', limit: null, reason: 'noWorker' });
    expect(f.household).toMatchObject({ status: 'failed', reason: 'noWorker', result: null });
    // a run with a limit after one without: the result goes, the key stays
    const lim = reduce(s, { type: A.HH_RUN, key: 'h1', limit: { kind: 'untilAge', who: 'b', age: 67 } });
    expect(lim.household).toMatchObject({ status: 'working', result: null, limit: { kind: 'untilAge' } });
    // another key under the runs: everything goes
    const moved = reduce(s, { type: A.HH_RUN, key: 'h2', limit: null });
    expect(moved.household).toMatchObject({ key: 'h2', status: 'working', survivor: null, care: null, pick: null });
    expect(() => reduce(s0, { type: A.HH_RUN, limit: null })).toThrow(/needs a key/);
  });
  it('the survivor and care questions: filed by key and boxes, done or failed, closed; a stale answer dropped; the confirm picked only after a run', () => {
    let s = reduce(s0, { type: A.HH_SURVIVOR, key: 'h1', boxes: SURVIVOR_BOXES });
    expect(s.household).toMatchObject({ key: 'h1', survivor: { status: 'working', boxes: SURVIVOR_BOXES } });
    expect(reduce(s, { type: A.HH_SURVIVOR, key: 'h1', boxes: SURVIVOR_BOXES })).toBe(s);
    expect(reduce(s, { type: A.HH_SURVIVOR_DONE, key: 'h1', boxes: { ...SURVIVOR_BOXES, atAge: 75 }, result: SURVIVOR, ms: 1 })).toBe(s);   // stale boxes
    s = reduce(s, { type: A.HH_SURVIVOR_DONE, key: 'h1', boxes: SURVIVOR_BOXES, result: SURVIVOR, ms: 900.6 });
    expect(s.household.survivor).toMatchObject({ status: 'done', result: SURVIVOR, ms: 901 });
    s = reduce(s, { type: A.HH_CARE, key: 'h1', boxes: { who: 'b', fromAge: 85, years: 3, cost: 90000 } });
    s = reduce(s, { type: A.HH_CARE_FAILED, key: 'h1', boxes: { who: 'b', fromAge: 85, years: 3, cost: 90000 } });
    expect(s.household.care).toMatchObject({ status: 'failed', reason: null });
    expect(s.household.survivor.status).toBe('done');
    const closed = reduce(s, { type: A.HH_CLOSE, what: 'care' });
    expect(closed.household.care).toBe(null);
    expect(reduce(closed, { type: A.HH_CLOSE, what: 'care' })).toBe(closed);
    expect(() => reduce(s, { type: A.HH_CLOSE, what: 'odd' })).toThrow(/survivor or care/);
    expect(reduce(s0, { type: A.HH_PICK, what: 'split' })).toBe(s0);                                                   // only a split that ran
    const done = reduce(reduce(s0, { type: A.HH_RUN, key: 'h1', limit: null }), { type: A.HH_DONE, key: 'h1', limit: null, result: fakeRun({ applies: true }), ms: 1 });
    expect(reduce(done, { type: A.HH_PICK, what: 'split' }).household.pick).toBe('split');
    expect(reduce(done, { type: A.HH_PICK, what: 'share' }).household.pick).toBe('share');
    expect(() => reduce(done, { type: A.HH_PICK, what: 'odd' })).toThrow(/no confirm/);
    expect(reduce(reduce(done, { type: A.HH_PICK, what: 'share' }), { type: A.HH_PICK, what: null }).household.pick).toBe(null);
  });
  it('the writes set the one write file going and clear the pick: the link, the split (only after a run), the dismissal, the budget shared; the copies kept are remembered', () => {
    const done = reduce(reduce(s0, { type: A.HH_RUN, key: 'h1', limit: null }), { type: A.HH_DONE, key: 'h1', limit: null, result: fakeRun({ applies: true }), ms: 1 });
    const picked = reduce(done, { type: A.HH_PICK, what: 'split' });
    const split = reduce(picked, { type: A.PLAN_SPLIT, planId: 'p1' });
    expect(split.ui.saving).toEqual({ planId: 'p1', kind: 'split' });
    expect(split.household.pick).toBe(null);
    expect(reduce(s0, { type: A.PLAN_SPLIT, planId: 'p1' }).ui.saving).toEqual({ planId: 'p1', kind: 'split' });   // without a run the write file says noRun
    expect(reduce(split, { type: A.PLAN_LINK, planId: 'p1', partnerId: 'p2' })).toBe(split);                            // one write at a time
    expect(reduce(s0, { type: A.PLAN_LINK, planId: 'p1', partnerId: 'p2' }).ui.saving).toEqual({ planId: 'p1', kind: 'link', partnerId: 'p2' });
    expect(reduce(s0, { type: A.PLAN_LINK, planId: 'p1', partnerId: null }).ui.saving).toEqual({ planId: 'p1', kind: 'link', partnerId: null });
    expect(() => reduce(s0, { type: A.PLAN_LINK, planId: 'p1', partnerId: 'a b' })).toThrow(/not a plan id/);
    expect(reduce(s0, { type: A.PLAN_DISMISS, planId: 'p1', dismiss: false }).ui.saving).toEqual({ planId: 'p1', kind: 'dismiss', dismiss: false });
    expect(reduce(s0, { type: A.PLAN_BUDGET_SHARE, planId: 'p1', share: true }).ui.saving).toEqual({ planId: 'p1', kind: 'budgetShare', share: true });
    const kept = reduce(split, { type: A.SPLIT_KEPT, planId: 'p1', ids: { a: 'NewA', b: 'NewB' }, names: { a: 'A — drawing together', b: 'B — drawing together' }, where: 'account' });
    expect(kept.household.kept).toEqual({ ids: { a: 'NewA', b: 'NewB' }, names: { a: 'A — drawing together', b: 'B — drawing together' }, where: 'account' });
    expect(kept.ui.saving).toBe(null);
    expect(() => reduce(s0, { type: A.SPLIT_KEPT, planId: 'p1', ids: { a: 'x' }, names: {}, where: 'account' })).toThrow(/two ids/);
  });
  it('plan/saved with op split clears "Does it last?"\'s result and carries the partner\'s previous values for Undo; the plans leaving memory clears the household; state/replace takes a household state (cleaned) or starts empty; the state survives JSON', () => {
    let s = reduce(reduce(s0, { type: A.HH_RUN, key: 'h1', limit: null }), { type: A.HH_DONE, key: 'h1', limit: null, result: fakeRun(), ms: 1 });
    s = reduce(reduce(s, { type: A.LASTS_WORKING, key: 'L' }), { type: A.LASTS_DONE, key: 'L', result: { strategyId: 'pots-and-valves', a: null } });
    const saved = reduce(s, { type: A.PLAN_SAVED, planId: 'p1', previous: { 'stressTool.settings.baseSalary': 1 }, line: { id: 'split', slots: {} }, op: 'split', others: [{ planId: 'p2', previous: { 'stressTool.settings.baseSalary': 2 } }, { bad: true }] });
    expect(saved.lasts).toEqual(emptyLasts());
    expect(saved.ui.toast).toMatchObject({ kind: 'saved', op: 'split', others: [{ planId: 'p2', previous: { 'stressTool.settings.baseSalary': 2 } }] });
    const undo = reduce(saved, { type: A.PLAN_UNDO, planId: 'p1' });
    expect(undo.ui.saving).toMatchObject({ kind: 'undo', op: 'split', others: [{ planId: 'p2', previous: { 'stressTool.settings.baseSalary': 2 } }] });
    // a toast whose only previous values are the partner's still offers Undo
    const only = reduce(s, { type: A.PLAN_SAVED, planId: 'p1', previous: {}, line: { id: 'shared', slots: {} }, op: 'budgetShare', others: [{ planId: 'p2', previous: { 'budgetTool.sharedFrom': null } }] });
    expect(only.ui.toast.kind).toBe('saved');
    expect(reduce(s, { type: A.PLANS_CLEAR }).household).toEqual(emptyHousehold());
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    const r = reduce(s0, { type: A.STATE_REPLACE, state: { ...s, household: { ...s.household, survivor: { status: 'done', boxes: SURVIVOR_BOXES, result: SURVIVOR, ms: 9 }, care: { status: 'odd' }, pick: 'split', kept: { ids: { a: 'A1', b: 'B1' }, names: { a: 'A', b: 'B' }, where: 'window' } } } });
    expect(r.household).toMatchObject({ key: 'h1', status: 'done', ms: 1, pick: 'split', survivor: { status: 'done', ms: 9 }, care: null, kept: { ids: { a: 'A1', b: 'B1' }, where: 'window' } });
    expect(reduce(s0, { type: A.STATE_REPLACE, state: { ...s, household: { key: 3 } } }).household).toEqual(emptyHousehold());
    // leaving the page closes the confirm and the open blocks; the runs stay
    const open = reduce(reduce(reduce(s, { type: A.ROUTE_SET, route: parse('#/plan/p1/household') }), { type: A.UI_TOGGLE, id: 'hhWhoPays' }), { type: A.HH_PICK, what: 'share' });
    const left = reduce(open, { type: A.ROUTE_SET, route: parse('#/plan/p1/lasts') });
    expect(left.ui.open).toEqual([]);
    expect(left.household.pick).toBe(null);
    expect(left.household.status).toBe('done');
  });
  it('readyMark: the pooled run, the survivor\'s or the care\'s under way is not ready; planHouseholdView carries the open blocks and the partner', () => {
    const { alex, sam } = couple();
    const p = pageOn([alex, sam], alex.id);
    expect(readyMark(p.store.getState()).ready).toBe('1');
    p.store.dispatch({ type: A.HH_RUN, key: p.key, limit: null });
    expect(readyMark(p.store.getState()).ready).toBe('0');
    p.store.dispatch({ type: A.HH_DONE, key: p.key, limit: null, result: fakeRun(), ms: 1 });
    expect(readyMark(p.store.getState()).ready).toBe('1');
    p.store.dispatch({ type: A.HH_CARE, key: p.key, boxes: { who: 'a', fromAge: 80, years: 3, cost: 90000 } });
    expect(readyMark(p.store.getState()).ready).toBe('0');
    p.store.dispatch({ type: A.HH_CARE_DONE, key: p.key, boxes: { who: 'a', fromAge: 80, years: 3, cost: 90000 }, result: CARE, ms: 1 });
    expect(readyMark(p.store.getState()).ready).toBe('1');
    const v = planHouseholdView(p.store.getState());
    expect(v).toMatchObject({ found: true, id: alex.id, partner: { id: sam.id, name: 'Sam’s plan', linkedBy: 'both' }, status: 'done', whoPaysOpen: false, detailOpen: false });
    expect(v.verdict.words).toBe('in more than 9 futures out of 10');
    expect(v.care.status).toBe('done');
    p.store.dispatch({ type: A.UI_TOGGLE, id: 'hhWhoPays' });
    expect(planHouseholdView(p.store.getState()).whoPaysOpen).toBe(true);
    expect(planHouseholdView(reduce(p.store.getState(), { type: A.ROUTE_SET, route: parse('#/plans') })).found).toBe(false);
  });
});

describe('the runner: the pooled run, the survivor and the care question, each in its own lane on the pair the page names', () => {
  const fakeClient = (fns = {}, stopped = []) => ({ ...fns, stop: (q) => stopped.push(q) });
  it('household/run → client.household(plan, partner, { today, limit }) with progress → household/done, timed; the key moving ends it; a failure; no worker', async () => {
    const { alex, sam } = couple();
    const p = pageOn([alex, sam], alex.id);
    const calls = [];
    let t = 1000;
    const stopped = [];
    const client = fakeClient({ household: (plan, partner, env, onProgress) => { calls.push({ a: plan.id, b: partner.id, env }); onProgress(1, 2); t += 1400; return Promise.resolve(fakeRun()); } }, stopped);
    const stop = startHouseholdRunner({ store: p.store, client, now: () => t });
    p.store.dispatch({ type: A.HH_RUN, key: p.key, limit: null });
    await tick();
    expect(calls).toEqual([{ a: alex.id, b: sam.id, env: { today: TODAY, limit: null } }]);
    expect(p.store.getState().household).toMatchObject({ status: 'done', ms: 1400 });
    expect(viewFor(p.store.getState()).page.household.verdict.words).toBe('in more than 9 futures out of 10');
    // with a limit: the limit goes with it
    p.store.dispatch({ type: A.HH_RUN, key: p.key, limit: { kind: 'untilAge', who: 'b', age: 67 } });
    await tick();
    expect(calls[1].env).toEqual({ today: TODAY, limit: { kind: 'untilAge', who: 'b', age: 67 } });
    stop();
    // the pair changing under a run: the old run is ended, its answer dropped
    const p2 = pageOn([alex, sam], alex.id);
    const resolvers = [];
    const stopped2 = [];
    const stop2 = startHouseholdRunner({ store: p2.store, client: fakeClient({ household: () => new Promise((resolve) => resolvers.push(resolve)) }, stopped2) });
    p2.store.dispatch({ type: A.HH_RUN, key: p2.key, limit: null });
    await tick();
    const changed = copy(sam);
    changed.lastModified = '2026-10-02T14:03:00.000Z';
    p2.store.dispatch({ type: A.PLANS_SET, list: upgradedList([alex, changed], noon(TODAY)), source: 'account', readAt: '14:04' });
    p2.store.dispatch({ type: A.UI_RAIL, open: true });
    await tick();
    expect(stopped2).toContain('household');
    resolvers[0](fakeRun());
    await tick();
    expect(p2.store.getState().household.key).toBe(p2.key);
    expect(p2.store.getState().household.status, 'the old answer is dropped').toBe('working');
    stop2();
    const p3 = pageOn([alex, sam], alex.id);
    const stop3 = startHouseholdRunner({ store: p3.store, client: fakeClient({ household: () => Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER })) }) });
    p3.store.dispatch({ type: A.HH_RUN, key: p3.key, limit: null });
    await tick();
    expect(p3.store.getState().household).toMatchObject({ status: 'failed', reason: 'noWorker' });
    stop3();
  });
  it('household/survivor and household/care → their lanes with the boxes; stale boxes dropped; a failure', async () => {
    const { alex, sam } = couple();
    const p = pageOn([alex, sam], alex.id);
    const calls = [];
    let n = 0;
    const client = fakeClient({
      householdSurvivor: (plan, partner, env) => { calls.push(['s', env]); return Promise.resolve(SURVIVOR); },
      householdCare: (plan, partner, env) => { calls.push(['c', env]); return ++n === 1 ? Promise.resolve(CARE) : Promise.reject(new Error('boom')); }
    });
    const stop = startHouseholdRunner({ store: p.store, client, now: () => 5 });
    p.store.dispatch({ type: A.HH_SURVIVOR, key: p.key, boxes: SURVIVOR_BOXES });
    await tick();
    expect(calls[0]).toEqual(['s', { today: TODAY, boxes: SURVIVOR_BOXES }]);
    expect(p.store.getState().household.survivor).toMatchObject({ status: 'done', result: SURVIVOR });
    expect(viewFor(p.store.getState()).page.household.survivor.result.deceased).toBe('Alex’s plan');
    const careBoxes = { who: 'b', fromAge: 85, years: 3, cost: 90000 };
    p.store.dispatch({ type: A.HH_CARE, key: p.key, boxes: careBoxes });
    await tick();
    expect(p.store.getState().household.care).toMatchObject({ status: 'done', result: CARE });
    p.store.dispatch({ type: A.HH_CLOSE, what: 'care' });
    p.store.dispatch({ type: A.HH_CARE, key: p.key, boxes: careBoxes });
    await tick();
    expect(p.store.getState().household.care).toMatchObject({ status: 'failed', reason: null });
    stop();
  });
});

describe('the worker: the three household messages, and the client\'s lanes', () => {
  const { alex, sam } = couple();
  const plan = entryOf(alex).plan, partner = entryOf(sam).plan;
  const collect = async (handle, msg) => { const out = []; handle(msg, (m) => out.push(m)); await tick(12); return out; };
  it('fake runs through the real handler: the partner passed on beside the plan, the limit and the boxes, progress then plain data; no plan, no partner, no boxes → an error', async () => {
    const seen = [];
    const handle = createHandler(undefined, {
      household: (p, q, { today, limit, onProgress }) => { seen.push(['household', p.id, q.id, today, limit]); onProgress(0, 2); onProgress(2, 2); return { ...fakeRun(), f: () => 1 }; },
      householdSurvivor: (p, q, { today, who, atAge }) => { seen.push(['survivor', p.id, q.id, today, who, atAge]); return SURVIVOR; },
      householdCare: (p, q, { today, who, fromAge }) => { seen.push(['care', p.id, q.id, today, who, fromAge]); return CARE; }
    });
    handle({ id: 1, type: 'init', today: TODAY }, () => {});
    const out = await collect(handle, { id: 2, type: 'household', plan, partner, env: { limit: { kind: 'untilAge', who: 'b', age: 67 } } });
    expect(seen[0]).toEqual(['household', plan.id, partner.id, TODAY, { kind: 'untilAge', who: 'b', age: 67 }]);
    expect(out[0]).toEqual({ id: 2, progress: { done: 0, total: 2 } });
    expect(out.at(-1)).toEqual({ id: 2, result: fakeRun() });
    await collect(handle, { id: 3, type: 'householdSurvivor', plan, partner, env: { today: TODAY, boxes: SURVIVOR_BOXES } });
    expect(seen[1]).toEqual(['survivor', plan.id, partner.id, TODAY, 'a', 74]);
    await collect(handle, { id: 4, type: 'householdCare', plan, partner, env: { today: TODAY, boxes: { who: 'b', fromAge: 85, years: 3, cost: 90000 } } });
    expect(seen[2]).toEqual(['care', plan.id, partner.id, TODAY, 'b', 85]);
    expect(await collect(handle, { id: 5, type: 'household', partner, env: {} })).toEqual([{ id: 5, error: expect.stringMatching(/no plan/) }]);
    expect(await collect(handle, { id: 6, type: 'household', plan, env: {} })).toEqual([{ id: 6, error: expect.stringMatching(/no partner/) }]);
    expect(await collect(handle, { id: 7, type: 'householdCare', plan, partner, env: {} })).toEqual([{ id: 7, error: expect.stringMatching(/no boxes/) }]);
  });
  it('the real run, loaded lazily by the handler: the pooled verdict then plain data, two runs on the couple; the survivor, three', { timeout: 120_000 }, async () => {
    const handle = createHandler();
    const wait = async (out) => { for (let i = 0; i < 2400 && !out.some((m) => 'result' in m || 'error' in m); i++) await new Promise((r) => setTimeout(r, 25)); return out.at(-1); };
    const one = [];
    handle({ id: 7, type: 'household', plan, partner, env: { today: TODAY, limit: null } }, (m) => one.push(m));
    const r1 = await wait(one);
    expect(r1.result, JSON.stringify(r1).slice(0, 300)).toMatchObject({ ok: true, basis: { runs: 2 } });
    expect(r1.result.own.combined.pooled.success).toBeTypeOf('number');
    expect(one.slice(0, -1).every((m) => m.progress)).toBe(true);
    const two = [];
    handle({ id: 8, type: 'householdSurvivor', plan, partner, env: { today: TODAY, boxes: { who: 'b', atAge: 70, spendPct: 70, dbPct: 50 } } }, (m) => two.push(m));
    const r2 = await wait(two);
    expect(r2.result).toMatchObject({ affordable: true, who: 'b', atAge: 70, basis: { runs: 3 } });
  });
  it('the client: the three lanes carry the partner; stop(\'householdSurvivor\') ends the survivor\'s run and leaves the pooled one running', async () => {
    const posted = [];
    let w;
    const makeWorker = () => { w = { postMessage: (m) => posted.push(m), terminate: () => {}, onmessage: null, onerror: null }; return w; };
    const client = createWorkerClient({ makeWorker });
    const pooled = client.household({ id: 'p' }, { id: 'q' }, { today: TODAY, limit: null });
    const one = client.householdSurvivor({ id: 'p' }, { id: 'q' }, { today: TODAY, boxes: SURVIVOR_BOXES });
    expect(posted.map((m) => m.type)).toEqual(['household', 'householdSurvivor']);
    expect(posted[0].partner).toEqual({ id: 'q' });
    client.stop('householdSurvivor');
    await expect(one).rejects.toMatchObject({ code: 'stopped' });
    expect(posted.filter((m) => m.type === 'household')).toHaveLength(2);
    w.onmessage({ data: { id: posted.at(-1).id, result: fakeRun() } });
    await expect(pooled).resolves.toEqual(fakeRun());
  });
});

describe('the one write file: the link, the dismissal, the budget shared, the split and who pays (road-to-7.md step 9)', { timeout: 60_000 }, () => {
  const at = new Date('2026-10-02T14:03:00.000Z');
  function fakeFb() {
    const writes = [], adds = [];
    return { writes, adds, fb: {
      doc: (db, ...path) => ({ path: path.join('/') }),
      collection: (db, ...path) => ({ path: path.join('/') }),
      updateDoc: async (ref, data) => { writes.push({ ref: ref.path, data: copy(data) }); },
      addDoc: async (coll, data) => { adds.push({ path: coll.path, data: copy(data) }); return { id: 'New' + adds.length + 'PlanId' }; }
    } };
  }
  const handlesFor = (store, uid = 'u1') => () => ({ db: {}, user: store.getState().session.kind === 'in' ? { uid } : null, reread: async () => store.dispatch({ type: A.PLANS_SET, list: store.getState().plans.list, source: 'account', readAt: '14:04' }) });
  const started = (p, fb, { session = null, local = null } = {}) => startPlanWrite(p.store, { win: null, session, local, now: () => at, fb: fb.fb, client: null, handles: session ? () => ({ db: null, user: null, reread: async () => {} }) : handlesFor(p.store), rand: () => 0.42 });

  it('the link: one write of household.partnerScenarioId on this plan (the planner\'s setHouseholdPartnerId), a partner not here refused, the unlink, Undo the exact reverse; on a locked plan the guard allows it, as the planner does', async () => {
    const { alex, sam } = couple({ link: 'none' });
    delete alex.household; delete sam.household;
    const p = pageOn([alex, sam], alex.id, { typed: { 'link.choice': sam.id } });
    expect(viewFor(p.store.getState()).page.household.partner).toBe(null);
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_LINK, planId: alex.id, partnerId: 'NoSuchPlan' });
    await tick(12);
    expect(f.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: alex.id, problem: 'notHere' });
    p.store.dispatch({ type: A.PLAN_LINK, planId: alex.id, partnerId: sam.id });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0]).toEqual({ ref: 'users/u1/scenarios/' + alex.id, data: { 'household.partnerScenarioId': sam.id, lastModified: at.toISOString() } });
    expect(f.writes[0].data).toEqual({ ...linkPatch(entryOf(alex).plan, sam.id).patch, lastModified: at.toISOString() });
    const toast = p.store.getState().ui.toast;
    expect(toast).toMatchObject({ kind: 'saved', op: 'link', line: { id: 'linked' } });
    expect(toast.previous).toEqual({ 'household.partnerScenarioId': undefined, lastModified: alex.lastModified });
    // the plan as written is read again: the partner is there, with "this plan points at" it
    const linked = applyPatch(entryOf(alex).plan, f.writes[0].data);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: linked, newer: false, failed: false }, entryOf(sam)], source: 'account', readAt: '14:05' });
    expect(viewFor(p.store.getState()).page.household.partner).toMatchObject({ id: sam.id, linkedBy: 'mine' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: alex.id });
    await tick(12);
    expect(f.writes).toHaveLength(2);
    expect(f.writes[1].data).toEqual({ 'household.partnerScenarioId': null, lastModified: alex.lastModified });
    stop();
    // the unlink on a locked plan: the link is outside the lock (LockedPlanGuard.js), so the guard lets it through, as the planner's own save does
    const { alex: la, sam: ls } = couple({ lockSam: true });
    const q = pageOn([ls, la], ls.id);
    const g = fakeFb();
    const stopQ = started(q, g);
    q.store.dispatch({ type: A.PLAN_LINK, planId: ls.id, partnerId: null });
    await tick(12);
    expect(g.writes).toHaveLength(1);
    expect(g.writes[0].data).toEqual({ 'household.partnerScenarioId': null, lastModified: at.toISOString() });
    expect(q.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'link', line: { id: 'unlinked' } });
    stopQ();
  });

  it('"Keep things as they are": household.splitDismissed on this plan for this partner and this state of both (the planner\'s dismissalFor), only after a run; "Show it again" writes null', async () => {
    const { alex, sam } = couple({ unequal: true });
    const p = pageOn([alex, sam], alex.id);
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_DISMISS, planId: alex.id, dismiss: true });
    await tick(12);
    expect(f.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: alex.id, problem: 'noRun' });
    ran(p, fakeRun({ applies: true, fingerprint: 'fp77' }));
    p.store.dispatch({ type: A.PLAN_DISMISS, planId: alex.id, dismiss: true });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0].data).toEqual({ 'household.splitDismissed': { partnerScenarioId: sam.id, fingerprint: 'fp77', at: at.toISOString() }, lastModified: at.toISOString() });
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'dismiss', line: { id: 'kept' } });
    p.store.dispatch({ type: A.PLAN_DISMISS, planId: alex.id, dismiss: false });
    await tick(12);
    expect(f.writes[1].data).toEqual({ 'household.splitDismissed': null, lastModified: at.toISOString() });
    stop();
  });

  it('the budget shared: ONE write on the PARTNER\'s plan (budgetTool.sharedFrom and its own side), as the planner\'s shareBudgetWith writes it; the toast carries the partner\'s previous values; Undo puts the partner back; "Keep a separate budget" the reverse write', async () => {
    const { alex, sam } = couple();
    const p = pageOn([alex, sam], alex.id);
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_BUDGET_SHARE, planId: alex.id, share: true });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0].ref).toBe('users/u1/scenarios/' + sam.id);
    const expected = shareBudgetPatches(entryOf(alex).plan, entryOf(sam).plan, true);
    expect(f.writes[0].data).toEqual({ ...expected.writes[0].patch, lastModified: at.toISOString() });
    expect(f.writes[0].data['budgetTool.sharedFrom']).toBe(alex.id);
    expect(f.writes[0].data['budgetTool.settings']).toMatchObject({ sharedWithPartner: true, mySharePct: 50 });
    for (const k of Object.keys(f.writes[0].data)) expect([...HOUSEHOLD_WRITES, 'lastModified']).toContain(k);
    const toast = p.store.getState().ui.toast;
    expect(toast).toMatchObject({ kind: 'saved', op: 'budgetShare', line: { id: 'shared' }, others: [{ planId: sam.id }] });
    expect(toast.others[0].previous['budgetTool.settings']).toEqual(entryOf(sam).plan.budgetTool.settings);
    // the partner as written, read again; Undo writes the partner's previous values back
    const shared = applyPatch(entryOf(sam).plan, f.writes[0].data);
    p.store.dispatch({ type: A.PLANS_SET, list: [entryOf(alex), { plan: shared, newer: false, failed: false }], source: 'account', readAt: '14:05' });
    expect(viewFor(p.store.getState()).page.household.budget.to).toBe(true);
    p.store.dispatch({ type: A.PLAN_UNDO, planId: alex.id });
    await tick(12);
    expect(f.writes).toHaveLength(3);
    expect(f.writes[1].ref).toBe('users/u1/scenarios/' + sam.id);
    expect(f.writes[1].data['budgetTool.sharedFrom']).toBe(null);
    expect(f.writes[1].data['budgetTool.settings']).toEqual(entryOf(sam).plan.budgetTool.settings);
    expect(f.writes[2].data).toEqual({ lastModified: alex.lastModified });
    stop();
    // "Keep a separate budget" from the plan that reads the household's: the write on this plan (the planner's stopSharingBudget on it)
    const q = pageOn([entryOf(alex).plan, shared], shared.id);
    const g = fakeFb();
    const stopQ = started(q, g);
    q.store.dispatch({ type: A.PLAN_BUDGET_SHARE, planId: shared.id, share: false });
    await tick(12);
    expect(g.writes).toHaveLength(1);
    expect(g.writes[0].ref).toBe('users/u1/scenarios/' + sam.id);
    expect(g.writes[0].data['budgetTool.sharedFrom']).toBe(null);
    expect(g.writes[0].data['budgetTool.settings'].lines).toEqual(entryOf(alex).plan.budgetTool.settings.lines);
    stopQ();
  });

  it('"Use this split" on two unlocked plans: ONE write per plan of exactly the five keys the income shape changes plus the stamp, both past the guard; the toast carries the partner\'s previous values; Undo puts both back; refused as noRun without a run', async () => {
    const { alex, sam } = couple({ unequal: true });
    const p = pageOn([alex, sam], alex.id);
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_SPLIT, planId: alex.id });
    await tick(12);
    expect(f.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: alex.id, problem: 'noRun' });
    const run = fakeRun({ applies: true });
    ran(p, run);
    p.store.dispatch({ type: A.PLAN_SPLIT, planId: alex.id });
    await tick(12);
    expect(f.writes).toHaveLength(2);
    const expected = splitPatches(entryOf(alex).plan, entryOf(sam).plan, run.split, { today: TODAY });
    expect(expected.mode).toBe('write');
    expect(f.writes[0]).toEqual({ ref: 'users/u1/scenarios/' + alex.id, data: { ...expected.writes[0].patch, lastModified: at.toISOString() } });
    expect(f.writes[1]).toEqual({ ref: 'users/u1/scenarios/' + sam.id, data: { ...expected.writes[1].patch, lastModified: at.toISOString() } });
    for (const w of f.writes) for (const k of Object.keys(w.data)) expect(k === 'lastModified' || SPLIT_KEYS.some((s) => k === 'stressTool.settings.' + s), k).toBe(true);
    expect(f.writes[0].data['stressTool.settings.incomeShape']).toBe('phases');
    expect(f.writes[0].data['stressTool.settings.incomeSteps']).toEqual([{ fromAge: 66, amount: 50270 }]);
    const toast = p.store.getState().ui.toast;
    expect(toast).toMatchObject({ kind: 'saved', op: 'split', line: { id: 'split' }, others: [{ planId: sam.id }] });
    expect(toast.previous).toEqual({ ...expected.writes[0].previous, lastModified: alex.lastModified });
    expect(toast.others[0].previous).toEqual({ ...expected.writes[1].previous, lastModified: sam.lastModified });
    expect(p.store.getState().lasts).toEqual(emptyLasts());
    // the plans as written, read again; Undo: the partner first, then this plan, each with its previous values
    const written = [applyPatch(entryOf(alex).plan, f.writes[0].data), applyPatch(entryOf(sam).plan, f.writes[1].data)];
    p.store.dispatch({ type: A.PLANS_SET, list: written.map((pl) => ({ plan: pl, newer: false, failed: false })), source: 'account', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: alex.id });
    await tick(12);
    expect(f.writes).toHaveLength(4);
    expect(f.writes[2].ref).toBe('users/u1/scenarios/' + sam.id);
    expect(f.writes[3].ref).toBe('users/u1/scenarios/' + alex.id);
    for (const [k, v] of Object.entries(toast.others[0].previous)) expect(f.writes[2].data[k]).toEqual(v === undefined ? null : v);
    for (const [k, v] of Object.entries(toast.previous)) expect(f.writes[3].data[k]).toEqual(v === undefined ? null : v);
    stop();
  });

  it('"Use this split" with the partner locked: TWO addDoc through the one create (never an updateDoc of either plan): each copy with the split\'s settings, named "{name} — drawing together", unlocked, not active, no document, record or archive, the second linked to the first and the first to the second by one write; the originals untouched; then household/splitKept', async () => {
    const { alex, sam } = couple({ unequal: true, lockSam: true });
    const p = pageOn([alex, sam], alex.id);
    expect(viewFor(p.store.getState()).page.household.mode).toBe('copies');
    const f = fakeFb();
    const stop = started(p, f);
    const run = fakeRun({ applies: true });
    ran(p, run);
    const actions = [];
    p.store.subscribe((s, a) => actions.push(a.type));
    p.store.dispatch({ type: A.PLAN_SPLIT, planId: alex.id });
    await tick(12);
    expect(f.adds).toHaveLength(2);
    expect(f.adds.map((a) => a.path)).toEqual(['users/u1/scenarios', 'users/u1/scenarios']);
    const expected = splitPatches(entryOf(alex).plan, entryOf(sam).plan, run.split, { today: TODAY });
    expect(expected.mode).toBe('copies');
    const [a, b] = f.adds.map((x) => x.data);
    expect(a.planDetails.name).toBe('Alex’s plan — drawing together');
    expect(b.planDetails.name).toBe('Sam’s plan — drawing together');
    for (const key of SPLIT_KEYS) { expect(a.stressTool.settings[key]).toEqual(expected.copies[0].settings[key]); expect(b.stressTool.settings[key]).toEqual(expected.copies[1].settings[key]); }
    for (const c of [a, b]) {
      expect(c.isActive).toBe(false);
      expect(isLockedSettings(c.decisionTool.settings)).toBe(false);
      expect(c.planDocument).toBeUndefined();
      expect(c.decisionTool.history).toEqual([]);
      expect('id' in c).toBe(false);
      expect(planProblems(c)).toEqual([]);
      expect(c.createdAt).toBe(at.toISOString());
    }
    expect(b.household).toEqual({ partnerScenarioId: 'New1PlanId' });
    // the first copy's link to the second: the one write, on the copy, never on the originals
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0]).toEqual({ ref: 'users/u1/scenarios/New1PlanId', data: { 'household.partnerScenarioId': 'New2PlanId', lastModified: at.toISOString() } });
    expect(p.store.getState().household.kept).toEqual({ ids: { a: 'New1PlanId', b: 'New2PlanId' }, names: { a: 'Alex’s plan — drawing together', b: 'Sam’s plan — drawing together' }, where: 'account' });
    expect(actions.indexOf(A.PLANS_READING)).toBeGreaterThan(actions.indexOf(A.SPLIT_KEPT));
    expect(f.writes.filter((w) => w.ref.endsWith(alex.id) || w.ref.endsWith(sam.id)), 'the originals untouched').toEqual([]);
    stop();
  });

  it('without an account: the split folds both window plans with the same patches, the rest byte-identical, Undo byte for byte; with the partner locked the copies need room this window has not got (three plans at most, and the pair is two): "full", nothing written, and the reading says so', async () => {
    const { alex, sam } = couple({ unequal: true });
    const planted = JSON.stringify([alex, sam]);
    const sessionStore = { text: planted, getItem: (k) => (k === GUEST_PLANS_KEY ? sessionStore.text : null), setItem: (k, v) => { if (k === GUEST_PLANS_KEY) sessionStore.text = v; } };
    const p = pageOn([alex, sam], alex.id, { source: 'window', session: 'nobody' });
    const f = fakeFb();
    const stop = started(p, f, { session: sessionStore });
    const run = fakeRun({ applies: true });
    ran(p, run);
    p.store.dispatch({ type: A.PLAN_SPLIT, planId: alex.id });
    await tick(12);
    expect(f.writes).toEqual([]);
    const after = JSON.parse(sessionStore.text);
    const expected = splitPatches(entryOf(alex).plan, entryOf(sam).plan, run.split, { today: TODAY });
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(alex, { ...expected.writes[0].patch, lastModified: at.toISOString() })));
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(applyPatch(sam, { ...expected.writes[1].patch, lastModified: at.toISOString() })));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: alex.id });
    await tick(12);
    expect(sessionStore.text).toBe(planted);
    stop();
    const { alex: la, sam: ls } = couple({ unequal: true, lockSam: true });
    const planted2 = JSON.stringify([la, ls]);
    const store2 = { text: planted2, getItem: (k) => (k === GUEST_PLANS_KEY ? store2.text : null), setItem: (k, v) => { if (k === GUEST_PLANS_KEY) store2.text = v; } };
    const q = pageOn([la, ls], la.id, { source: 'window', session: 'nobody' });
    const g = fakeFb();
    const stopQ = started(q, g, { session: store2 });
    ran(q, run);
    expect(viewFor(q.store.getState()).page.household).toMatchObject({ mode: 'copies', copyRoom: false });
    q.store.dispatch({ type: A.PLAN_SPLIT, planId: la.id });
    await tick(12);
    expect(store2.text).toBe(planted2);
    expect(g.writes).toEqual([]);
    expect(g.adds).toEqual([]);
    expect(q.store.getState().ui.saveProblem).toEqual({ planId: la.id, problem: 'full' });
    expect(q.store.getState().household.kept).toBeUndefined();
    stopQ();
    // in an account the copies always have room
    const r = pageOn([la, ls], la.id);
    expect(viewFor(r.store.getState()).page.household.copyRoom).toBe(true);
  });

  it('who pays (the step\'s own save): the sharing flag, the share, the lines with their who-pays and the totals recomputed, on this plan; on a plan that reads the household\'s budget the lines go to the plan that holds them and the share stays here; nothing when nothing changed', async () => {
    const { alex, sam } = couple();
    alex.budgetTool.settings.sharedWithPartner = false;
    const lines = alex.budgetTool.settings.lines = [{ id: 'l1', label: 'Food', amount: 400, period: 'mo', tier: 'essential', paidBy: 'me' }, { id: 'l2', label: 'Car', amount: 200, period: 'mo', tier: 'discretionary' }];
    const typed = { 'budget.shared': 'yes', 'budget.mySharePct': '60', 'budget.lines.l1.paidBy': 'shared', 'budget.lines.l1.mySharePct': '70', 'budget.lines.l2.paidBy': 'partner' };
    const p = pageOn([alex, sam], alex.id, { typed });
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_SAVE, planId: alex.id });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0].ref).toBe('users/u1/scenarios/' + alex.id);
    const expected = whoPaysPatches(entryOf(alex).plan, [entryOf(alex), entryOf(sam)], typed, { today: TODAY });
    expect(expected.ok).toBe(true);
    expect(f.writes[0].data).toEqual({ ...expected.writes[0].patch, lastModified: at.toISOString() });
    expect(f.writes[0].data['budgetTool.settings.sharedWithPartner']).toBe(true);
    expect(f.writes[0].data['budgetTool.settings.mySharePct']).toBe(60);
    expect(f.writes[0].data['budgetTool.settings.lines']).toEqual([{ ...lines[0], paidBy: 'shared', mySharePct: 70 }, { ...lines[1], paidBy: 'partner' }]);
    expect(f.writes[0].data['budgetTool.settings.derived']).toBeTypeOf('object');
    for (const k of Object.keys(f.writes[0].data)) expect(ALL_WRITES).toContain(k);
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', line: { id: 'whoPays' } });
    stop();
    // shared: Sam reads Alex's budget; a who-pays change from Sam's page writes the lines on Alex's plan and the share on Sam's
    const sharedSam = copy(sam);
    sharedSam.budgetTool = { sharedFrom: alex.id, settings: { sharedWithPartner: true, mySharePct: 40 } };
    const q = pageOn([alex, sharedSam], sharedSam.id, { typed: { 'budget.mySharePct': '35', 'budget.lines.l2.paidBy': 'me' } });
    expect(viewFor(q.store.getState()).page.household.whoPays.readsShared).toBe(true);
    const g = fakeFb();
    const stopQ = started(q, g);
    q.store.dispatch({ type: A.PLAN_SAVE, planId: sharedSam.id });
    await tick(12);
    expect(g.writes.map((w) => w.ref)).toEqual(['users/u1/scenarios/' + alex.id, 'users/u1/scenarios/' + sharedSam.id]);
    expect(g.writes[0].data['budgetTool.settings.lines'][1].paidBy).toBe('me');
    expect(g.writes[1].data['budgetTool.settings.mySharePct']).toBe(35);
    expect(q.store.getState().ui.toast.others).toHaveLength(1);
    stopQ();
    const same = pageOn([alex, sam], alex.id);
    const s = fakeFb();
    const stopS = started(same, s);
    same.store.dispatch({ type: A.PLAN_SAVE, planId: alex.id });
    await tick(12);
    expect(s.writes).toEqual([]);
    expect(same.store.getState().ui.toast).toMatchObject({ kind: 'unchanged' });
    stopS();
  });

  it('property: whatever is typed into the boxes, every path the household writes is declared, the checks give an error or a value for every box, and the split patches (when they apply) touch only the five keys', () => {
    const { alex, sam } = couple({ unequal: true });
    const a = entryOf(alex).plan, b = entryOf(sam).plan;
    const run = fakeRun({ applies: true });
    const text = fc.oneof(fc.constant(''), fc.constantFrom('a', 'b', 'yes', 'no', 'none', 'untilAge', 'keepAtLeast', 'me', 'partner', 'shared', 'abc', '-1'), fc.integer({ min: 0, max: 200000 }).map(String));
    const typedArb = fc.dictionary(fc.constantFrom(...HOUSEHOLD_FIELDS.map((f) => f.path), 'budget.lines.l1.paidBy', 'budget.lines.l1.mySharePct', 'odd.path'), text);
    fc.assert(fc.property(typedArb, (typed) => {
      const clean = Object.fromEntries(Object.entries(typed).filter(([k]) => isPlanEditPath(k)));
      expect(isHouseholdPath('odd.path')).toBe(false);
      const c = checkHousehold(a, b, clean, { today: TODAY });
      for (const f of HOUSEHOLD_FIELDS) if (c.applies[f.path]) expect((f.path in c.values) !== (f.path in c.errors), f.path).toBe(true);
      const w = whoPaysPatches(a, [{ plan: a }, { plan: b }], clean, { today: TODAY });
      if (w.ok) for (const x of w.writes) for (const k of Object.keys(x.patch)) expect(HOUSEHOLD_WRITES).toContain(k);
      const p = splitPatches(a, b, run.split, { today: TODAY });
      expect(p.mode).toBe('write');
      for (const x of p.writes) for (const k of Object.keys(x.patch)) { expect(HOUSEHOLD_WRITES).toContain(k); expect(SPLIT_KEYS.some((s) => k === 'stressTool.settings.' + s)).toBe(true); }
      expect(Object.keys(linkPatch(a, 'AnotherPlan').patch)).toEqual(['household.partnerScenarioId']);
      expect(linkPatch(a, b.id).patch).toEqual({});
      const boxes = boxesOf(a, b, { today: TODAY });
      for (const f of HOUSEHOLD_FIELDS) expect(f.path in boxes, f.path).toBe(true);
    }), { numRuns: 60 });
  });
});
