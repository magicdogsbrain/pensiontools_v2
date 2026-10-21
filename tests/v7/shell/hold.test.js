/**
 * The machinery of "What you hold" (research/v7/holdings-and-move.md §2.2, §7; road-to-7.md step 10): the reducer (plan/hold
 * sets the one write file going with its change; the hold paths typed into the plan draft; the paste box opened and closed
 * with the page), the reading on the page (planHoldView), and the one write file: ONE change of the record as the whole
 * `holdings` field plus the stamp — a line added, edited, removed, a paste merged with its answers — equal to hold.js
 * holdPatch (HoldingsRecord.holdingsWith / HoldingsPaste.applyPaste, the planner's own handlers lifted); past the guard,
 * which lets it through on a LOCKED plan as the planner's own save does, while every other write to that plan stays refused;
 * Undo the exact reverse (a record the plan did not have goes back as null on an account, and is deleted in the window's
 * text); the window's plans byte-identical elsewhere. A property test: whatever is typed into the boxes, the checks never
 * throw and every path written is declared.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { planHoldView } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { holdPatch, checkHold, holdOf, holdRecordOf } from '../../../src/answers/plan/hold.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { HOLD_WRITES, HOLD_FIELDS, HOLD_WRAPPERS, isHoldPath, isPlanEditPath, ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { holdingsWith, normaliseHoldings, LINE_FIELDS } from '../../../src/services/HoldingsRecord.js';
import { applyPaste, parsePaste } from '../../../src/services/HoldingsPaste.js';
import { isLockedSettings } from '../../../src/services/LockedPlanGuard.js';
import { corpus, entryOf, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const bytes = (v) => JSON.stringify(sortKeys(v));
const PASTE = 'Investment\tTicker\tUnits\tValue\niShares Core MSCI World\tSWDA\t3,150\t£284,000.00\nA fund of my own\t\t10\t£1,000\nTotal\t\t\t£285,000';
const LINE = { wrapper: 'ISA', ticker: 'VWRP', name: 'Vanguard FTSE All-World (Acc)', sedol: null, units: 8, value: 1000, ocf: 0.19, contribution: null, subClass: null, kind: 'fund', asOf: null };

/** A store on the hold step of a plan, the plans read (an account or this window), the reading done as the plan source does. */
function pageOn(raws, planId, { step = 'hold', source = 'account', session = 'in', typed = {} } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/' + step) });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source, readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  let last = null;
  store.subscribe((state) => {
    const now = [state.move, state.draft.plan, state.plans && state.plans.list];
    if (state.plans && state.plans.status === 'read' && (!state.plans.view || !last || now.some((v, i) => v !== last[i]))) { last = now; store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); }
  });
  return { store, list, plan: list.find((e) => String(e.plan.id) === String(planId)).plan };
}
function fakeFb() {
  const writes = [];
  return { writes, fb: { doc: (db, ...path) => ({ path: path.join('/') }), collection: (db, ...path) => ({ path: path.join('/') }), updateDoc: async (ref, data) => { writes.push({ ref: ref.path, data: copy(data) }); }, addDoc: async () => ({ id: 'NewPlanId' }) } };
}
const at = new Date('2026-10-02T14:03:00.000Z');
const handlesFor = (store, uid = 'u1') => () => ({ db: {}, user: store.getState().session.kind === 'in' ? { uid } : null, reread: async () => store.dispatch({ type: A.PLANS_SET, list: store.getState().plans.list, source: 'account', readAt: '14:04' }) });
const started = (p, fb, { session = null } = {}) => startPlanWrite(p.store, { win: null, session, local: null, now: () => at, fb: fb.fb, client: null, handles: session ? () => ({ db: null, user: null, reread: async () => {} }) : handlesFor(p.store), rand: () => 0.42 });
const planted = (raw, id) => ({ ...copy(raw), id, planDetails: { ...(raw.planDetails || {}), name: 'A plan' }, isActive: false, household: undefined });

describe('the reducer: the hold step\'s actions and paths', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('plan/hold sets the one write file going with its change (add, edit, remove, paste), one write at a time; a change it does not know is refused', () => {
    const s = reduce(s0, { type: A.PLAN_HOLD, planId: 'p1', change: { kind: 'add', line: LINE } });
    expect(s.ui.saving).toEqual({ planId: 'p1', kind: 'hold', change: { kind: 'add', line: LINE } });
    expect(reduce(s, { type: A.PLAN_HOLD, planId: 'p1', change: { kind: 'remove', index: 0 } })).toBe(s);
    for (const change of [{ kind: 'edit', index: 0, field: 'value', value: '1' }, { kind: 'remove', index: 0 }, { kind: 'paste', text: 'a', wrapper: 'SIPP', answers: {} }]) expect(reduce(s0, { type: A.PLAN_HOLD, planId: 'p1', change }).ui.saving.change).toEqual(change);
    expect(() => reduce(s0, { type: A.PLAN_HOLD, planId: 'p1', change: { kind: 'odd' } })).toThrow(/add, edit, remove or paste/);
    expect(() => reduce(s0, { type: A.PLAN_HOLD, change: { kind: 'add' } })).toThrow(/plan id/);
    expect(s.ui.toast).toBe(null);
    expect(s.ui.saveProblem).toBe(null);
  });
  it('the hold paths are plan-draft paths: the add box, the paste and its answers, a line\'s boxes, the remove asked; anything else is refused', () => {
    for (const f of HOLD_FIELDS) { expect(isHoldPath(f.path)).toBe(true); expect(isPlanEditPath(f.path)).toBe(true); }
    for (const p of ['line.0.units', 'line.12.value', 'line.3.contribution', 'line.0.ocf', 'line.1.subClass', 'line.0.wrapper', 'paste.2.what', 'paste.15.what']) expect(isHoldPath(p), p).toBe(true);
    for (const p of ['line.0.foo', 'line.x.value', 'paste.what', 'holdings', 'line.0.units.x', 'remove']) expect(isHoldPath(p), p).toBe(false);
    for (const f of LINE_FIELDS) expect(isHoldPath('line.0.' + f), f).toBe(true);
    const s = reduce(s0, { type: A.PLAN_EDIT, planId: 'p1', path: 'line.0.value', value: '300,000' });
    expect(s.draft.plan).toMatchObject({ id: 'p1', values: { 'line.0.value': '300,000' } });
    expect(() => reduce(s0, { type: A.PLAN_EDIT, planId: 'p1', path: 'line.0.foo', value: '1' })).toThrow(/no field/);
    // the paste box opens and closes with the page
    const open = reduce(reduce(s0, { type: A.ROUTE_SET, route: parse('#/plan/p1/hold') }), { type: A.UI_TOGGLE, id: 'holdPaste' });
    expect(open.ui.open).toEqual(['holdPaste']);
    expect(reduce(open, { type: A.ROUTE_SET, route: parse('#/plan/p1/move') }).ui.open).toEqual([]);
    expect(reduce(open, { type: A.ROUTE_SET, route: parse('#/plan/p1/hold') }).ui.open).toEqual(['holdPaste']);
    // the write kinds the toast knows
    expect(reduce(s0, { type: A.PLAN_SAVED, planId: 'p1', previous: { holdings: null }, line: { id: 'added', slots: {} }, op: 'hold' }).ui.toast).toMatchObject({ kind: 'saved', op: 'hold' });
  });
  it('planHoldView: the reading with the paste box open, the write under way, the problem and the toast; a line\'s problem shown once its box is left', () => {
    const p = pageOn([planted(C['05-saver-committed'], 'S1')], 'S1');
    let v = planHoldView(p.store.getState());
    expect(v).toMatchObject({ found: true, id: 'S1', pasteOpen: false, locked: true, editable: true, count: 3 });
    expect(v.groups.map((g) => g.wrapper)).toEqual(['SIPP', 'ISA']);
    p.store.dispatch({ type: A.PLAN_EDIT, planId: 'S1', path: 'line.0.units', value: 'many' });
    v = planHoldView(p.store.getState());
    expect(v.groups[0].lines[0].fields.units.error).toBe(null);
    p.store.dispatch({ type: A.PLAN_TOUCH, planId: 'S1', path: 'line.0.units' });
    expect(planHoldView(p.store.getState()).groups[0].lines[0].fields.units.error).toBe('notANumber');
    p.store.dispatch({ type: A.PLAN_EDIT, planId: 'S1', path: 'paste.text', value: PASTE });
    expect(planHoldView(p.store.getState()).pasteOpen).toBe(true);
    expect(planHoldView(reduce(p.store.getState(), { type: A.ROUTE_SET, route: parse('#/plans') })).found).toBe(false);
  });
});

describe('the one write file: the record, one change at a time (road-to-7.md step 10)', { timeout: 60_000 }, () => {
  it('a line added to a plan with no record: ONE write of the whole holdings field plus the stamp, equal to holdPatch; the toast with the previous (none); Undo writes the field back as null', async () => {
    const raw = planted(C['02-pnv-draft'], 'H1');
    const p = pageOn([raw], 'H1');
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_HOLD, planId: 'H1', change: { kind: 'add', line: LINE } });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0].ref).toBe('users/u1/scenarios/H1');
    const expected = holdPatch(p.plan, { kind: 'add', line: LINE }, { today: TODAY });
    expect(f.writes[0].data).toEqual({ ...expected.patch, lastModified: at.toISOString() });
    expect(Object.keys(f.writes[0].data).sort()).toEqual([...HOLD_WRITES].sort());
    for (const k of Object.keys(f.writes[0].data)) expect(ALL_WRITES).toContain(k);
    expect(f.writes[0].data.holdings).toMatchObject({ version: 1, updatedAt: TODAY, source: 'typed', offerDismissed: false });
    expect(f.writes[0].data.holdings.lines).toHaveLength(1);
    expect(bytes(f.writes[0].data.holdings)).toBe(bytes(holdingsWith(normaliseHoldings(undefined), { kind: 'add', line: LINE }, { today: TODAY })));
    const toast = p.store.getState().ui.toast;
    expect(toast).toMatchObject({ kind: 'saved', op: 'hold', line: { id: 'added', slots: { name: LINE.name, wrapper: 'ISA' } } });
    expect(toast.previous).toEqual({ holdings: undefined, lastModified: raw.lastModified });
    // the plan as written, read again, then Undo: the field the plan did not have goes back as null (updateDoc cannot delete)
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: applyPatch(p.plan, f.writes[0].data), newer: false, failed: false }], source: 'account', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: 'H1' });
    await tick(12);
    expect(f.writes).toHaveLength(2);
    expect(f.writes[1].data).toEqual({ holdings: null, lastModified: raw.lastModified });
    stop();
  });
  it('a paste merged, a line edited, a line removed on a plan with a pasted record: each ONE write equal to holdPatch (applyPaste, holdingsWith); a change that cannot be made writes nothing ("problems")', async () => {
    const raw = planted(C['12-lumpy-db-gia'], 'H2');
    const p = pageOn([raw], 'H2');
    const f = fakeFb();
    const stop = started(p, f);
    const rec = holdRecordOf(p.plan);
    p.store.dispatch({ type: A.PLAN_HOLD, planId: 'H2', change: { kind: 'paste', text: PASTE, wrapper: 'SIPP', answers: { 2: 'bonds' } } });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    const theirs = applyPaste(rec, parsePaste(PASTE).rows, { 2: 'bonds' }, 'SIPP', { today: TODAY, orders: [] });
    expect(bytes(f.writes[0].data.holdings)).toBe(bytes(theirs.record));
    expect(theirs.updated).toHaveLength(1);
    expect(theirs.added).toHaveLength(1);
    expect(theirs.unseen).toHaveLength(2);
    expect(f.writes[0].data.holdings.lines).toHaveLength(rec.lines.length + 1);
    expect(f.writes[0].data.holdings.lines.at(-1)).toMatchObject({ name: 'A fund of my own', subClass: 'globalAggHedged', wrapper: 'SIPP', value: 1000 });
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'hold', line: { id: 'pasted', slots: { updated: '1', added: '1', wrapper: 'SIPP' } } });
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_HOLD, planId: 'H2', change: { kind: 'edit', index: 1, field: 'value', value: 120000 } });
    await tick(12);
    expect(f.writes).toHaveLength(2);
    expect(bytes(f.writes[1].data.holdings)).toBe(bytes(holdingsWith(rec, { kind: 'edit', index: 1, field: 'value', value: 120000 }, { today: TODAY })));
    expect(f.writes[1].data.holdings.lines[1].value).toBe(120000);
    expect(f.writes[1].data.holdings.source, 'a pasted record stays a pasted record after a typed edit (the planner\'s rule)').toBe('paste');
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_HOLD, planId: 'H2', change: { kind: 'remove', index: 0 } });
    await tick(12);
    expect(f.writes).toHaveLength(3);
    expect(f.writes[2].data.holdings.lines).toHaveLength(rec.lines.length - 1);
    expect(f.writes[2].data.holdings.lines[0].ticker).toBe(rec.lines[1].ticker);
    expect(p.store.getState().ui.toast.previous).toEqual({ holdings: raw.holdings, lastModified: raw.lastModified });
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_HOLD, planId: 'H2', change: { kind: 'remove', index: 99 } });
    await tick(12);
    expect(f.writes).toHaveLength(3);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'H2', problem: 'problems' });
    p.store.dispatch({ type: A.PLAN_HOLD, planId: 'H2', change: { kind: 'add', line: { wrapper: 'SIPP' } } });
    await tick(12);
    expect(f.writes).toHaveLength(3);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'H2', problem: 'problems' });
    stop();
  });
  it('a LOCKED plan (decision 1): the record\'s write passes the guard, as the planner\'s own save does; every other write to that plan stays refused', async () => {
    const raw = planted(C['03-gilt-ladder-runup'], 'H3');
    expect(isLockedSettings(raw.decisionTool.settings)).toBe(true);
    const p = pageOn([raw], 'H3');
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_HOLD, planId: 'H3', change: { kind: 'add', line: LINE } });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0].data.holdings.lines).toHaveLength(9);
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'hold' });
    // the document's snapshot of the record is never touched
    expect('planDocument' in f.writes[0].data).toBe(false);
    expect('planDocument.holdingsAtLock' in f.writes[0].data).toBe(false);
    // Undo on the locked plan: the guard alone decides, and the record is outside the lock
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: applyPatch(p.plan, f.writes[0].data), newer: false, failed: false }], source: 'account', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: 'H3' });
    await tick(12);
    expect(f.writes).toHaveLength(2);
    expect(bytes(f.writes[1].data.holdings)).toBe(bytes(raw.holdings));
    // everything else on the locked plan stays refused: an editing step's save
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_SAVE, planId: 'H3' });
    await tick(12);
    expect(f.writes).toHaveLength(2);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'H3', problem: 'locked' });
    stop();
  });
  it('without an account: the change folds into this window\'s plan, the other plan byte-identical, Undo byte for byte (the field deleted, never null)', async () => {
    const raw = planted(C['02-pnv-draft'], 'W1');
    const other = planted(C['12-lumpy-db-gia'], 'W2');
    const plantedText = JSON.stringify([raw, other]);
    const sessionStore = { text: plantedText, getItem: (k) => (k === GUEST_PLANS_KEY ? sessionStore.text : null), setItem: (k, v) => { if (k === GUEST_PLANS_KEY) sessionStore.text = v; } };
    const p = pageOn([raw, other], 'W1', { source: 'window', session: 'nobody' });
    const f = fakeFb();
    const stop = started(p, f, { session: sessionStore });
    p.store.dispatch({ type: A.PLAN_HOLD, planId: 'W1', change: { kind: 'add', line: LINE } });
    await tick(12);
    expect(f.writes).toEqual([]);
    const after = JSON.parse(sessionStore.text);
    const expected = holdPatch(p.plan, { kind: 'add', line: LINE }, { today: TODAY });
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(raw, { ...expected.patch, lastModified: at.toISOString() })));
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(other));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: 'W1' });
    await tick(12);
    expect(sessionStore.text).toBe(plantedText);
    stop();
  });
  it('property: whatever is typed into the boxes the checks give a value or a problem for every box and never throw; every path a change writes is declared; an edit written and written back leaves the record as it was', () => {
    const plan = entryOf(C['12-lumpy-db-gia']).plan;
    const rec = holdRecordOf(plan);
    const text = fc.oneof(fc.constant(''), fc.constantFrom('SIPP', 'ISA', 'GIA', 'CASH', 'cash', 'vang', 'T29', 'abc', '-1', '0.19', '12,000', PASTE, 'shares', 'bonds', 'unknown'), fc.integer({ min: 0, max: 2000000 }).map(String));
    const paths = [...HOLD_FIELDS.map((f) => f.path), 'line.0.units', 'line.0.value', 'line.1.contribution', 'line.2.ocf', 'line.0.subClass', 'paste.1.what', 'paste.2.what', 'odd.path'];
    const typedArb = fc.dictionary(fc.constantFrom(...paths), text);
    const changeArb = fc.oneof(
      fc.record({ kind: fc.constant('add'), line: fc.record({ wrapper: fc.constantFrom(...HOLD_WRAPPERS, 'odd'), ticker: fc.constantFrom('VWRP', 'T29', '', null), name: fc.constantFrom('A fund', '', null), value: fc.constantFrom(1000, null, 'x') }) }),
      fc.record({ kind: fc.constant('edit'), index: fc.integer({ min: -1, max: 7 }), field: fc.constantFrom(...LINE_FIELDS, 'odd'), value: fc.constantFrom('', '12', 'x', 'ISA', null) }),
      fc.record({ kind: fc.constant('remove'), index: fc.integer({ min: -1, max: 7 }) }),
      fc.record({ kind: fc.constant('paste'), text: fc.constantFrom(PASTE, '', 'Total,,£1'), wrapper: fc.constantFrom(...HOLD_WRAPPERS), answers: fc.constantFrom({}, { 2: 'bonds' }, { 2: 'odd' }) }),
      fc.record({ kind: fc.constant('odd') })
    );
    fc.assert(fc.property(typedArb, changeArb, (typed, change) => {
      const clean = Object.fromEntries(Object.entries(typed).filter(([k]) => isPlanEditPath(k)));
      expect(isHoldPath('odd.path')).toBe(false);
      const c = checkHold(plan, clean, { today: TODAY });
      for (const f of HOLD_FIELDS) expect((f.path in c.values) !== (f.path in c.errors), f.path).toBe(true);
      expect(Array.isArray(c.paste.rows)).toBe(true);
      const view = holdOf([{ plan }], plan.id, { today: TODAY, typed: clean });
      expect(view.found).toBe(true);
      const p = holdPatch(plan, change, { today: TODAY });
      for (const k of Object.keys(p.patch)) expect(HOLD_WRITES).toContain(k);
      if (p.ok) { expect(p.patch.holdings.lines.every((l) => l.ticker || l.name || l.sedol)).toBe(true); expect(JSON.parse(JSON.stringify(p.patch.holdings))).toEqual(p.patch.holdings); expect(HOLD_WRAPPERS).toContain(p.patch.holdings.lines.length ? p.patch.holdings.lines[0].wrapper : 'SIPP'); }
      else expect(p.patch).toEqual({});
      // an edit and its reverse, both stamped with the record's own day: the record as it was
      const edited = holdingsWith(rec, { kind: 'edit', index: 0, field: 'value', value: 1 }, { today: rec.updatedAt });
      const back = holdingsWith(edited, { kind: 'edit', index: 0, field: 'value', value: rec.lines[0].value }, { today: rec.updatedAt });
      expect(bytes(back)).toBe(bytes(rec));
    }), { numRuns: 60 });
  });
});
