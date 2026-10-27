/**
 * Road step 11b's writes through the one write file (research/v7/road-to-7.md step 11b), with fakes so every call is seen:
 *   - the budget: one change → ONE updateDoc of `budgetTool.settings` whole on the plan whose lines they are (a shared budget:
 *     the holder's lines and this plan's own side, two writes, both put back by one Undo); a locked plan still written (the
 *     budget is outside the lock); the window's text byte-identical elsewhere; Undo byte for byte; a spreadsheet chosen is read
 *     into the draft; "Download it as a spreadsheet" saves the planner's own file;
 *   - "What you pay in": Save on the saving step writes `accumulationTool.settings` whole, a locked saver too; "Record it"
 *     writes `accumulationTool.history` whole with the month added and nothing deleted; Undo puts each back;
 *   - the reducer: plan/budget and plan/record wait while another write is under way; the file read lands in the draft.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { startDownloads, budgetCsvFileName } from '../../../src/v7/effects/download.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { budgetPatch, normalisedBudget, readBudget } from '../../../src/answers/plan/budget.js';
import { recordPatch, savingPatch } from '../../../src/answers/plan/saving.js';
import { budgetToSave, cleanBudgetForSave, fillTypicalAmounts, idMaker, resetBudgetLines, budgetToCsv } from '../../../src/services/BudgetModel.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { ownSideOf, sharedBudgetView } from '../../../src/services/PlanCommit.js';
import { BUDGET_WRITES, SAVING_WRITES } from '../../../src/answers/plan/schema.js';
import { corpus, household, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const STAMP = '2026-10-02T14:03:00.000Z';

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return { calls, getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; }, setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); }, removeItem(k) { calls.push(['removeItem', k]); map.delete(k); }, raw: (k) => map.get(k) };
}
function fakeLite() {
  const writes = [];
  return { writes, doc: (db, ...path) => ({ db, path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); } };
}
function withBudget(raw) {
  const plan = copy(raw);
  const base = normalisedBudget(plan.budgetTool && plan.budgetTool.settings);
  let b = resetBudgetLines(base, idMaker(base));
  b = fillTypicalAmounts(b).budget;
  plan.budgetTool = { ...(plan.budgetTool || {}), settings: budgetToSave(cleanBudgetForSave(b)) };
  return plan;
}
function page({ raws, planId, step, session = 'in', typed = {}, fb = fakeLite(), win = null }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/' + step) });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  const source = session === 'in' ? 'account' : 'window';
  store.dispatch({ type: A.PLANS_SET, list, source, readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  const user = session === 'in' ? { uid: 'u1', email: 'a@b.c', emailVerified: true } : null;
  const handles = () => ({ db: session === 'in' ? { name: 'db' } : null, user, reread: () => Promise.resolve() });
  const sess = storage(session === 'in' ? {} : { [GUEST_PLANS_KEY]: JSON.stringify(raws) });
  const stop = startPlanWrite(store, { win, session: sess, local: storage(), now: () => new Date(STAMP), fb, handles });
  store.subscribe((state) => { if (state.plans && state.plans.status === 'read' && !state.plans.view) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
  return { store, fb, session: sess, stop };
}

const RAW = withBudget(C['12-lumpy-db-gia']);
const LOCKED = withBudget(C['03-gilt-ladder-runup']);
const SAVER = C['05-saver-committed'];

describe('the budget on a saved plan: one write of the whole budget', () => {
  it('an account: one updateDoc of budgetTool.settings plus the stamp, equal to budgetPatch; the toast carries the previous object; Undo writes it back', async () => {
    const p = page({ raws: [RAW], planId: RAW.id, step: 'budget' });
    const plan = p.store.getState().plans.list[0].plan;
    const B = normalisedBudget(readBudget(plan, []).budget);
    const change = { kind: 'line', id: B.lines[0].id, field: 'amount', value: 2400 };
    p.store.dispatch({ type: A.PLAN_BUDGET, planId: RAW.id, change });
    await tick();
    expect(p.fb.writes.length).toBe(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/' + RAW.id);
    const want = budgetPatch(plan, [{ plan }], change, { today: TODAY }).writes[0];
    expect(p.fb.writes[0].data).toEqual({ ...want.patch, lastModified: STAMP });
    for (const k of Object.keys(p.fb.writes[0].data)) expect([...BUDGET_WRITES]).toContain(k);
    const t = p.store.getState().ui.toast;
    expect(t).toMatchObject({ planId: RAW.id, kind: 'saved', op: 'budget', line: { id: 'line' } });
    expect(t.previous['budgetTool.settings']).toEqual(RAW.budgetTool.settings);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: applyPatch(plan, p.fb.writes[0].data), newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: RAW.id });
    await tick();
    expect(p.fb.writes.length).toBe(2);
    expect(p.fb.writes[1].data).toEqual({ 'budgetTool.settings': RAW.budgetTool.settings, lastModified: RAW.lastModified });
    p.stop();
  });

  it('a locked plan is still written: the budget is outside the lock', async () => {
    const p = page({ raws: [LOCKED], planId: LOCKED.id, step: 'budget' });
    p.store.dispatch({ type: A.PLAN_BUDGET, planId: LOCKED.id, change: { kind: 'add', tier: 'essential', label: 'Allotment' } });
    await tick();
    expect(p.store.getState().ui.saveProblem).toBe(null);
    expect(p.fb.writes.length).toBe(1);
    expect(Object.keys(p.fb.writes[0].data)).toEqual(['budgetTool.settings', 'lastModified']);
    p.stop();
  });

  it('the window: the plan folded, the other byte-identical, Undo byte for byte; the file read lands in the draft; the download is the planner\'s file', async () => {
    const p = page({ raws: [LOCKED, RAW], planId: RAW.id, step: 'budget', session: 'nobody' });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.store.dispatch({ type: A.PLAN_BUDGET, planId: RAW.id, change: { kind: 'add', tier: 'essential', label: 'Allotment' } });
    await tick();
    expect(p.fb.writes).toEqual([]);
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(JSON.parse(before)[0]));
    expect(after[1].budgetTool.settings.lines.length).toBe(RAW.budgetTool.settings.lines.length + 1);
    expect(after[1].budgetTool.settings.lines.slice(-1)[0]).toMatchObject({ label: 'Allotment', tier: 'essential' });
    expect(p.store.getState().draft.plan.id, 'the draft (the name box) is cleared by the save').toBe(null);
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: RAW.id });
    await tick();
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(JSON.parse(before), noon(TODAY)), source: 'window', readAt: '14:05' });   // the window read again, as the source does after a write
    // the file: read on the page into the draft, where the reading reads it
    const file = { size: 100, text: () => Promise.resolve('Type,Section,Item,Amount,Period\nItem,Essential,Gas,50,mo') };
    p.store.dispatch({ type: A.PLAN_BUDGET_FILE, planId: RAW.id, file });
    await tick();
    expect(p.store.getState().draft.plan.values['import.text']).toContain('Gas');
    expect(p.store.getState().ui.saving).toBe(null);
    p.store.dispatch({ type: A.PLAN_BUDGET_FILE, planId: RAW.id, file: { size: 100, text: () => Promise.reject(new Error('no')) } });
    await tick();
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: RAW.id, problem: 'badFile' });
    // the download
    const saved = [];
    const win = { Blob: class { constructor(parts, opts) { this.text = parts.join(''); this.type = opts.type; } }, URL: { createObjectURL: (b) => { win.last = b; return 'blob:x'; }, revokeObjectURL: () => {} }, document: { body: { appendChild: () => {} }, createElement: () => { const a = { click() { saved.push({ name: a.download, text: win.last.text, type: win.last.type }); }, remove() {} }; return a; } }, setTimeout: (fn) => fn() };
    const stopDl = startDownloads(p.store, { win, now: () => new Date(STAMP) });
    p.store.dispatch({ type: A.PLANS_VIEW, view: viewFor(p.store.getState()) });
    p.store.dispatch({ type: A.PLAN_BUDGET_DOWNLOAD, planId: RAW.id });
    expect(p.store.getState().ui.saveProblem, 'the bad file\'s problem stands; the download raised none').toEqual({ planId: RAW.id, problem: 'badFile' });
    expect(saved.length).toBe(1);
    expect(saved[0].name).toBe(budgetCsvFileName(RAW.planDetails.name, new Date(STAMP)));
    expect(saved[0].type).toBe('text/csv;charset=utf-8;');
    expect(saved[0].text).toBe(budgetToCsv(normalisedBudget(readBudget(p.store.getState().plans.list[1].plan, []).budget)));
    stopDl();
    p.stop();
  });

  it('a shared budget: the holder\'s lines and this plan\'s own side, two writes on an account, both put back by one Undo', async () => {
    const { ladder, saver } = household();
    const holder = withBudget(ladder);
    holder.budgetTool.settings.sharedWithPartner = true;
    const reader = copy(saver);
    // its own side as the planner's first save settles it (every own-side key present), so a line changes the holder alone
    reader.budgetTool = { sharedFrom: holder.id, settings: ownSideOf(normalisedBudget(sharedBudgetView(holder.budgetTool.settings, { sharedWithPartner: true, mySharePct: 40 }, holder.id))) };
    const p = page({ raws: [holder, reader], planId: reader.id, step: 'budget' });
    const plans = p.store.getState().plans.list.map((e) => e.plan);
    const B = normalisedBudget(readBudget(plans[1], plans.map((x) => ({ plan: x }))).budget);
    p.store.dispatch({ type: A.PLAN_BUDGET, planId: reader.id, change: { kind: 'line', id: B.lines[0].id, field: 'amount', value: 999 } });
    await tick();
    expect(p.fb.writes.map((w) => w.path)).toEqual(['users/u1/scenarios/' + holder.id]);
    expect(p.fb.writes[0].data['budgetTool.settings'].lines[0].annual).toBe(999 * (B.lines[0].period === 'mo' ? 12 : 1));
    p.store.dispatch({ type: A.PLAN_BUDGET, planId: reader.id, change: { kind: 'phaseAdd' } });
    await tick();
    // who pays over time: this plan's own side (the holder is written only when its `derived` follows the saved view, as the planner's save does)
    const later = p.fb.writes.slice(1);
    const own = later.find((w) => w.path === 'users/u1/scenarios/' + reader.id);
    expect(own.data['budgetTool.settings'].splitPhases).toEqual([{ fromAge: '', mySharePct: '' }]);
    // (the list in the store is as read before the first write — the account's listener brings the written holder back in real use)
    for (const w of later.filter((x) => x !== own)) { expect(w.path).toBe('users/u1/scenarios/' + holder.id); expect(w.data['budgetTool.settings'].lines).toEqual(p.store.getState().plans.list[0].plan.budgetTool.settings.lines); expect('splitPhases' in w.data['budgetTool.settings']).toBe(false); }
    expect(p.store.getState().ui.toast.previous['budgetTool.settings']).toEqual(reader.budgetTool.settings);
    p.stop();
  });

  it('the reducer: a change waits while another write is under way; nothing without a plan id or a kind', () => {
    const s0 = page({ raws: [RAW], planId: RAW.id, step: 'budget' }).store.getState();
    const busy = reduce(s0, { type: A.PLAN_LOCK, planId: RAW.id });
    expect(reduce(busy, { type: A.PLAN_BUDGET, planId: RAW.id, change: { kind: 'fill' } })).toBe(busy);
    expect(() => reduce(s0, { type: A.PLAN_BUDGET, planId: RAW.id, change: null })).toThrow();
    expect(() => reduce(s0, { type: A.PLAN_RECORD, planId: '' })).toThrow();
    const read = reduce(s0, { type: A.PLAN_BUDGET_FILE_READ, planId: RAW.id, text: 'a,b' });
    expect(read.draft.plan.values['import.text']).toBe('a,b');
    expect(read.ui.saving).toBe(null);
  });
});

describe('"What you pay in": the settings whole, the record list whole', () => {
  it('Save on the saving step writes accumulationTool.settings whole as savingPatch says; a locked saver too; Undo the stored object', async () => {
    const p = page({ raws: [SAVER], planId: SAVER.id, step: 'saving', typed: { escalationPct: '3', isaMonthly: '150' } });
    const plan = p.store.getState().plans.list[0].plan;
    expect(plan.decisionTool.settings.locked, 'the committed saver is locked').toBe(true);
    p.store.dispatch({ type: A.PLAN_SAVE, planId: SAVER.id });
    await tick();
    expect(p.store.getState().ui.saveProblem).toBe(null);
    expect(p.fb.writes.length).toBe(1);
    const want = savingPatch(plan, { escalationPct: '3', isaMonthly: '150' }, { today: TODAY });
    expect(p.fb.writes[0].data).toEqual({ ...want.patch, lastModified: STAMP });
    for (const k of Object.keys(p.fb.writes[0].data)) expect([...SAVING_WRITES]).toContain(k);
    expect(p.fb.writes[0].data['accumulationTool.settings']).toEqual({ ...SAVER.accumulationTool.settings, escalationPct: 3, isaMonthly: 150 });
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', line: { id: 'saving' } });
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: applyPatch(plan, p.fb.writes[0].data), newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: SAVER.id });
    await tick();
    expect(p.fb.writes[1].data).toEqual({ 'accumulationTool.settings': SAVER.accumulationTool.settings, lastModified: SAVER.lastModified });
    p.stop();
  });

  it('"Record it" writes accumulationTool.history whole with the month added (recordPatch), nothing deleted; a wrong box writes nothing and says so', async () => {
    const typed = { 'record.month': '2026-10', 'record.pension': '325,000', 'record.isa': '41,900', 'record.gia': '' };
    const p = page({ raws: [SAVER], planId: SAVER.id, step: 'saving', typed });
    const plan = p.store.getState().plans.list[0].plan;
    p.store.dispatch({ type: A.PLAN_RECORD, planId: SAVER.id });
    await tick();
    expect(p.fb.writes.length).toBe(1);
    const want = recordPatch(plan, typed, { today: TODAY });
    expect(p.fb.writes[0].data).toEqual({ ...want.patch, lastModified: STAMP });
    expect(p.fb.writes[0].data['accumulationTool.history'].length).toBe(SAVER.accumulationTool.history.length + 1);
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'potRecord', line: { id: 'recorded' } });
    expect(p.store.getState().ui.toast.previous['accumulationTool.history']).toEqual(SAVER.accumulationTool.history);
    const q = page({ raws: [SAVER], planId: SAVER.id, step: 'saving', typed: { 'record.month': '2026-10', 'record.pension': 'lots' } });
    q.store.dispatch({ type: A.PLAN_RECORD, planId: SAVER.id });
    await tick();
    expect(q.fb.writes).toEqual([]);
    expect(q.store.getState().ui.saveProblem).toEqual({ planId: SAVER.id, problem: 'problems' });
    expect(q.store.getState().draft.plan.touched).toContain('record.pension');
    p.stop(); q.stop();
  });

  it('property: over random budget changes on the window\'s plans, every key written is declared, the other plan is byte-identical, and nothing goes to Firestore', async () => {
    const B = normalisedBudget(RAW.budgetTool.settings);
    const ids = B.lines.map((l) => l.id);
    const change = fc.oneof(
      fc.record({ kind: fc.constant('line'), id: fc.constantFrom(...ids), field: fc.constantFrom('amount', 'period', 'essential'), value: fc.oneof(fc.integer({ min: 0, max: 3000 }), fc.constantFrom('mo', 'yr', true, false)) }),
      fc.record({ kind: fc.constantFrom('fill', 'reset') }),
      fc.record({ kind: fc.constant('add'), tier: fc.constantFrom('essential', 'discretionary'), label: fc.constantFrom('', 'Allotment') }),
      fc.record({ kind: fc.constant('remove'), id: fc.constantFrom(...ids) })
    );
    await fc.assert(fc.asyncProperty(fc.array(change, { minLength: 1, maxLength: 3 }), async (changes) => {
      const p = page({ raws: [LOCKED, RAW], planId: RAW.id, step: 'budget', session: 'nobody' });
      const before = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
      for (const c of changes) {
        p.store.dispatch({ type: A.PLAN_BUDGET, planId: RAW.id, change: c });
        await tick();
        p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
        const list = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
        p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(list, noon(TODAY)), source: 'window', readAt: '14:04' });
      }
      const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(before[0]));
      expect(p.fb.writes).toEqual([]);
      const strip = (x) => { const o = copy(x); delete o.budgetTool; delete o.lastModified; return JSON.stringify(o); };
      expect(strip(after[1])).toBe(strip(before[1]));
      p.stop();
    }), { numRuns: 12 });
  });
});
