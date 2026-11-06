/**
 * Month by month through the one write file (research/v7/months-in-v7.md §3; 7.2.0): "Record" and "Set up 2026/27" are each
 * ONE write of the records and the tax years — the window's text changed only there (the other plan byte-identical), an
 * account's plan by those field paths and the stamp — equal to the pure writer's patch, past the lock guard and held to
 * Month by month's own keys. A locked plan records its months and its settings stay byte-identical. Undo puts the plan back
 * byte for byte. Refused, with nothing written: a plan not locked, a tax year not set up, the example plan. And the guard's
 * allow-list itself. Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { MONTH_WRITES, ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { MONTH_KEYS, monthWriteRefusal, lockedPlanWriteRefusal } from '../../../src/services/LockedPlanGuard.js';
import { monthRecordPatch, taxYearPatch } from '../../../src/answers/plan/month.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { getDefaultStressSettings } from '../../../src/storage/stressDefaults.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { corpus, noon } from './_plans.js';

const C = corpus();
const TODAY = '2026-10-02';
const STAMP = TODAY + 'T14:03:00.000Z';
const tick = async (n = 10) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return { calls, getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; }, setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); }, removeItem(k) { map.delete(k); }, raw: (k) => map.get(k) };
}
function fakeLite() {
  const writes = [];
  return { writes, doc: (db, ...path) => ({ db, path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); } };
}
/** Alex (fictional), from the corpus's running plan: April to September recorded; `edit` shapes the copy. */
function alex(edit = (p) => p) { const p = copy(C['04-buckets-running']); p.id = 'AlexMonth01'; p.planDetails.name = 'Alex’s plan'; delete p.household; p.lastModified = '2026-09-30T08:00:00.000Z'; return edit(p); }

function page({ raws, planId, session = 'nobody', typed = {}, fb = fakeLite() }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/month') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, noon(TODAY)), source: session === 'in' ? 'account' : 'window', readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  const sess = storage(session === 'in' ? {} : { [GUEST_PLANS_KEY]: JSON.stringify(raws) });
  const handles = () => ({ db: session === 'in' ? { name: 'db' } : null, user: session === 'in' ? { uid: 'u1', email: 'a@b.c', emailVerified: true } : null, reread: () => Promise.resolve() });
  const stop = startPlanWrite(store, { win: null, session: sess, local: storage(), now: () => new Date(STAMP), fb, handles });
  return { store, fb, session: sess, stop };
}
const POTS = { 'mo.mode': 'type', 'mo.equity': '380000', 'mo.bond': '150000', 'mo.cashT': '45000' };
const upgraded = (raw) => upgradeScenario(copy(raw), { now: noon(TODAY) }).scenario;

describe('the guard\'s allow-list for Month by month', () => {
  it('the records, the tax years and the journey, and nothing else; the declared writes are the same keys and the stamp', () => {
    expect(MONTH_KEYS).toEqual(['decisionTool.history', 'decisionTool.taxYears', 'journey']);
    expect(MONTH_WRITES).toEqual([...MONTH_KEYS, 'lastModified']);
    for (const k of MONTH_WRITES) expect(ALL_WRITES).toContain(k);
    expect(monthWriteRefusal({ 'decisionTool.history': [], 'decisionTool.taxYears': {}, journey: [], lastModified: 'x' })).toBe(null);
    expect(monthWriteRefusal({ 'decisionTool.history': [], 'decisionTool.settings.locked': false })).toEqual(['decisionTool.settings.locked']);
    expect(monthWriteRefusal({ 'decisionTool.settings': {}, planDocument: null, 'stressTool.settings.baseSalary': 1 })).toEqual(['decisionTool.settings', 'planDocument', 'stressTool.settings.baseSalary']);
  });
  it('a locked plan: its month write passes the whole guard too; the same write carrying a setting does not', () => {
    const plan = upgraded(alex());
    const p = monthRecordPatch(plan, { 'mo.month': '2026-10', ...POTS }, { today: TODAY, nowIso: STAMP });
    expect(p.ok).toBe(true);
    expect(lockedPlanWriteRefusal(plan, p.patch, getDefaultStressSettings())).toBe(null);
    expect(lockedPlanWriteRefusal(plan, { ...p.patch, 'decisionTool.settings.baseSalary': 1 }, getDefaultStressSettings())).toEqual(['decision.baseSalary']);
  });
  it('a closed plan refuses a month after its close, by the whole guard (18: closed at March 2025)', () => {
    const plan = upgraded(C['18-moved-to-new-plan']);
    const history = [...plan.decisionTool.history, { ...plan.decisionTool.history[0], date: '2025-05', taxYear: '25/26' }];
    expect(lockedPlanWriteRefusal(plan, { 'decisionTool.history': history }, getDefaultStressSettings())).not.toBe(null);
  });
});

describe('"Record" and "Set up" through the one write file', () => {
  it('without an account: ONE setItem, the plan equal to the pure patch folded on, the other plan byte-identical, the settings untouched; Undo byte for byte', async () => {
    const a = alex(), other = copy(C['12-lumpy-db-gia']);
    const typed = { 'mo.month': '2026-10', ...POTS };
    const p = page({ raws: [a, other], planId: a.id, typed });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.store.dispatch({ type: A.PLAN_MONTH_RECORD, planId: a.id });
    await tick();
    const sets = p.session.calls.filter((c) => c[0] === 'setItem');
    expect(sets).toHaveLength(1);
    const list = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    const want = monthRecordPatch(upgraded(a), typed, { today: TODAY, nowIso: STAMP });
    expect(JSON.stringify(list[0])).toBe(JSON.stringify(applyPatch(a, { ...want.patch, lastModified: STAMP })));
    expect(JSON.stringify(list[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
    expect(JSON.stringify(list[0].decisionTool.settings)).toBe(JSON.stringify(a.decisionTool.settings));
    expect(list[0].decisionTool.history.map((h) => h.date)).toContain('2026-10');
    const t = p.store.getState().ui.toast;
    expect(t).toMatchObject({ kind: 'saved', op: 'month', line: { id: 'recorded' } });
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(list, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: a.id });
    await tick();
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    p.stop();
  });

  it('signed in: ONE updateDoc of the records, the tax years and the stamp, nothing else', async () => {
    const a = alex();
    const p = page({ raws: [a], planId: a.id, session: 'in', typed: { 'mo.month': '2026-10', ...POTS, 'mo.fill': 'yes' } });
    p.store.dispatch({ type: A.PLAN_MONTH_RECORD, planId: a.id });
    await tick();
    expect(p.fb.writes).toHaveLength(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/AlexMonth01');
    expect(Object.keys(p.fb.writes[0].data).sort()).toEqual(['decisionTool.history', 'decisionTool.taxYears', 'lastModified']);
    p.stop();
  });

  it('a tax year set up: ONE write of the tax years, equal to the pure patch; then the month records against it', async () => {
    const a = alex((x) => { x.decisionTool.taxYears = {}; x.decisionTool.history = []; return x; });
    const typed = { 'mo.month': '2026-10', 'ty.toDate': '18000', 'ty.taxToDate': '1500' };
    const p = page({ raws: [a], planId: a.id, typed });
    p.store.dispatch({ type: A.PLAN_TAX_YEAR, planId: a.id });
    await tick();
    const list = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    const want = taxYearPatch(upgraded(a), typed, { today: TODAY });
    expect(JSON.stringify(list[0])).toBe(JSON.stringify(applyPatch(a, { ...want.patch, lastModified: STAMP })));
    expect(list[0].decisionTool.taxYears['26/27']).toMatchObject({ yearSetupComplete: true, startMonth: 10, remainingMonths: 6, grossIncomeToDate: 18000, taxPaidToDate: 1500 });
    expect(p.store.getState().ui.toast).toMatchObject({ op: 'taxYear', line: { id: 'setUp' } });
    p.stop();
  });

  it('refused, nothing written: a plan not locked; a tax year not set up; the example plan', async () => {
    const draft = copy(C['02-pnv-draft']); draft.id = 'DraftPlan02';
    const p1 = page({ raws: [draft], planId: draft.id, typed: { ...POTS } });
    p1.store.dispatch({ type: A.PLAN_MONTH_RECORD, planId: draft.id });
    await tick();
    expect(p1.session.calls.filter((c) => c[0] === 'setItem')).toHaveLength(0);
    expect(p1.store.getState().ui.saveProblem).toMatchObject({ problem: 'notLocked' });
    const bare = alex((x) => { x.decisionTool.taxYears = {}; return x; });
    const p2 = page({ raws: [bare], planId: bare.id, typed: { 'mo.month': '2026-10', ...POTS } });
    p2.store.dispatch({ type: A.PLAN_MONTH_RECORD, planId: bare.id });
    await tick();
    expect(p2.session.calls.filter((c) => c[0] === 'setItem')).toHaveLength(0);
    expect(p2.store.getState().ui.saveProblem).toMatchObject({ problem: 'notSetUp' });
    const ex = alex((x) => { x.example = true; return x; });
    const p3 = page({ raws: [ex], planId: ex.id, typed: { 'mo.month': '2026-10', ...POTS } });
    p3.store.dispatch({ type: A.PLAN_MONTH_RECORD, planId: ex.id });
    await tick();
    expect(p3.session.calls.filter((c) => c[0] === 'setItem')).toHaveLength(0);
    for (const p of [p1, p2, p3]) p.stop();
  });
});
