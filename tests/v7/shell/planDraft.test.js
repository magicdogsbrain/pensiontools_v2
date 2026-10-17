/**
 * E7 (research/v7/editing-in-v7.md 4, 5): the plan draft — what was typed into "About you and when" for ONE plan.
 *  - plan/edit keeps text as typed and refuses an unknown path; a value that is not text empties the box;
 *  - the draft belongs to one plan: another plan's address clears it, and so do Save (after the write), Cancel and the
 *    plans leaving memory;
 *  - the draft store keeps it under pt_v7_draft with the other drafts and cleans it on the way in: the id, text by a known
 *    path, the boxes left, asked — never the plan;
 *  - the toast and the save problem follow the plan, and go when the plan changes.
 */
import { describe, it, expect } from 'vitest';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { initialState, emptyPlanDraft } from '../../../src/v7/state/initial.js';
import { parse } from '../../../src/v7/router/routes.js';
import { loadDraft, saveDraft, draftOf, startDraftStore, DRAFT_KEY } from '../../../src/v7/effects/draftStore.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { ABOUT_PATHS } from '../../../src/answers/plan/schema.js';
import { fresh, run, fakeStorage } from './_shell.js';

const at = (hash) => ({ type: A.ROUTE_SET, route: parse(hash) });
const edit = (planId, path, value) => ({ type: A.PLAN_EDIT, planId, path, value });

describe('plan/edit and plan/touch', () => {
  it('keeps text as typed, by path, for one plan; an unknown path is refused; a value that is not text empties the box', () => {
    const s = run(fresh(), at('#/plan/p1/about'), edit('p1', 'age', '5'), edit('p1', 'age', '58'), edit('p1', 'stopped', 'age'), edit('p1', 'stopAge', '6 2'));
    expect(s.draft.plan).toEqual({ id: 'p1', values: { age: '58', stopped: 'age', stopAge: '6 2' }, touched: [], asked: false });
    expect(() => reduce(s, edit('p1', 'pot', '1'))).toThrow(/no field "pot"/);
    expect(() => reduce(s, edit('', 'age', '1'))).toThrow(/needs a plan id/);
    expect(reduce(s, edit('p1', 'age', 58)).draft.plan.values.age).toBeUndefined();
    expect(reduce(s, edit('p1', 'age', '58'))).toBe(s);   // nothing changed: the same state
    for (const p of ABOUT_PATHS) expect(reduce(s, edit('p1', p, 'x')).draft.plan.values[p]).toBe('x');
  });
  it('the second step\'s paths (editing-in-v7.md 7.2): the single boxes, a list\'s order, a card\'s boxes by id; anything else refused', () => {
    const s = run(fresh(), at('#/plan/p1/income'), edit('p1', 'spKind', 'none'), edit('p1', 'fs.ids', '0,n1'), edit('p1', 'fs.n1.amount', '3,000'), edit('p1', 'lumps.0.atAge', '69'), edit('p1', 'streams.n2.toAge', ''));
    expect(s.draft.plan.values).toEqual({ spKind: 'none', 'fs.ids': '0,n1', 'fs.n1.amount': '3,000', 'lumps.0.atAge': '69', 'streams.n2.toAge': '' });
    for (const p of ['fs', 'fs.0.toAge', 'lumps.x.amount', 'pots.0.amount', 'fs.ids.0']) expect(() => reduce(s, edit('p1', p, '1')), p).toThrow(/no field/);
    expect(() => reduce(s, { type: A.PLAN_TOUCH, planId: 'p1', path: 'lumps.x.amount' })).toThrow();
    expect(run(s, { type: A.PLAN_TOUCH, planId: 'p1', path: 'fs.n1.amount' }).draft.plan.touched).toEqual(['fs.n1.amount']);
    // the same plan's about step keeps it; another plan's income step clears it
    expect(reduce(s, at('#/plan/p1/about')).draft.plan.values['fs.ids']).toBe('0,n1');
    expect(reduce(s, at('#/plan/p2/income')).draft.plan).toEqual(emptyPlanDraft());
    // the draft store keeps and cleans them the same way
    const storage = fakeStorage();
    expect(saveDraft(storage, draftOf(s))).toBe(true);
    expect(JSON.parse(storage.getItem(DRAFT_KEY)).plan.values).toEqual(s.draft.plan.values);
    const dirty = fakeStorage({ [DRAFT_KEY]: JSON.stringify({ plan: { id: 'p1', values: { 'fs.n1.amount': '3,000', 'fs.zz.amount': '1', 'lumps.0.atAge': 69 }, touched: ['lumps.0.atAge', 'nope'], asked: false } }) });
    expect(loadDraft(dirty).plan).toEqual({ id: 'p1', values: { 'fs.n1.amount': '3,000' }, touched: ['lumps.0.atAge'], asked: false });
  });
  it('typing for another plan starts afresh; plan/touch marks a box once', () => {
    const s = run(fresh(), at('#/plan/p1/about'), edit('p1', 'age', '58'));
    const t = reduce(s, edit('p2', 'age', '60'));
    expect(t.draft.plan).toEqual({ id: 'p2', values: { age: '60' }, touched: [], asked: false });
    const u = run(s, { type: A.PLAN_TOUCH, planId: 'p1', path: 'age' }, { type: A.PLAN_TOUCH, planId: 'p1', path: 'age' });
    expect(u.draft.plan.touched).toEqual(['age']);
    expect(() => reduce(s, { type: A.PLAN_TOUCH, planId: 'p1', path: 'nope' })).toThrow();
  });
});

describe('the draft belongs to one plan', () => {
  const typed = () => run(fresh(), at('#/plan/p1/about'), edit('p1', 'age', '58'), { type: A.PLAN_TOUCH, planId: 'p1', path: 'age' });
  it('another plan\'s address clears it; the same plan\'s other steps keep it; the front door clears it', () => {
    const s = typed();
    expect(reduce(s, at('#/plan/p1/plan')).draft.plan.values).toEqual({ age: '58' });
    expect(reduce(s, at('#/plan/p1')).draft.plan.values).toEqual({ age: '58' });
    expect(reduce(s, at('#/plan/p2/about')).draft.plan).toEqual(emptyPlanDraft());
    expect(reduce(s, at('#/plans')).draft.plan).toEqual(emptyPlanDraft());
    expect(reduce(s, at('#/')).draft.plan).toEqual(emptyPlanDraft());
  });
  it('Save marks it asked and starts the write; plan/saved clears it and shows the toast; plan/cancel clears it; plans/clear clears it', () => {
    const s = typed();
    const saving = reduce(s, { type: A.PLAN_SAVE, planId: 'p1' });
    expect(saving.draft.plan.asked).toBe(true);
    expect(saving.ui.saving).toEqual({ planId: 'p1', kind: 'save' });
    expect(reduce(saving, { type: A.PLAN_SAVE, planId: 'p1' })).toBe(saving);   // one write at a time
    const saved = reduce(saving, { type: A.PLAN_SAVED, planId: 'p1', previous: { 'stressTool.settings.duration': 32 }, line: { id: 'runsTo', slots: { endAge: 95, years: 34 } } });
    expect(saved.draft.plan).toEqual(emptyPlanDraft());
    expect(saved.ui.saving).toBe(null);
    expect(saved.ui.toast).toEqual({ planId: 'p1', kind: 'saved', previous: { 'stressTool.settings.duration': 32 }, line: { id: 'runsTo', slots: { endAge: 95, years: 34 } } });
    const unchanged = reduce(saving, { type: A.PLAN_SAVED, planId: 'p1', previous: {}, line: null });
    expect(unchanged.ui.toast).toEqual({ planId: 'p1', kind: 'unchanged', previous: null, line: null });
    expect(reduce(s, { type: A.PLAN_CANCEL, planId: 'p1' }).draft.plan).toEqual(emptyPlanDraft());
    expect(reduce(s, { type: A.PLANS_CLEAR }).draft.plan).toEqual(emptyPlanDraft());
  });
  it('a failed save keeps the draft and says why; typing again clears the problem; an unknown problem is refused', () => {
    const s = reduce(typed(), { type: A.PLAN_SAVE, planId: 'p1' });
    const failed = reduce(s, { type: A.PLAN_SAVE_FAILED, planId: 'p1', problem: 'locked' });
    expect(failed.draft.plan.values).toEqual({ age: '58' });
    expect(failed.ui.saving).toBe(null);
    expect(failed.ui.saveProblem).toEqual({ planId: 'p1', problem: 'locked' });
    expect(reduce(failed, edit('p1', 'age', '59')).ui.saveProblem).toBe(null);
    expect(() => reduce(s, { type: A.PLAN_SAVE_FAILED, planId: 'p1', problem: 'meh' })).toThrow();
  });
  it('Undo: only from a saved toast, once; then undone; the toast closes; another plan\'s address takes the toast with it', () => {
    const saved = reduce(reduce(typed(), { type: A.PLAN_SAVE, planId: 'p1' }), { type: A.PLAN_SAVED, planId: 'p1', previous: { 'stressTool.settings.duration': 32 }, line: null });
    expect(reduce(saved, { type: A.PLAN_UNDO, planId: 'p2' })).toBe(saved);
    const undoing = reduce(saved, { type: A.PLAN_UNDO, planId: 'p1' });
    expect(undoing.ui.saving).toEqual({ planId: 'p1', kind: 'undo', previous: { 'stressTool.settings.duration': 32 } });
    expect(undoing.ui.toast.kind).toBe('undoing');
    expect(reduce(undoing, { type: A.PLAN_UNDO, planId: 'p1' })).toBe(undoing);
    const undone = reduce(undoing, { type: A.PLAN_UNDO_DONE, planId: 'p1' });
    expect(undone.ui.saving).toBe(null);
    expect(undone.ui.toast).toEqual({ planId: 'p1', kind: 'undone', previous: null, line: null });
    expect(reduce(undone, { type: A.PLAN_TOAST_CLOSE }).ui.toast).toBe(null);
    expect(reduce(saved, at('#/plan/p2')).ui.toast).toBe(null);
    expect(reduce(saved, at('#/plan/p1/plan')).ui.toast).not.toBe(null);
  });
});

describe('the draft store keeps the plan draft, cleaned', () => {
  it('round trip through pt_v7_draft: the id, the text by path, the boxes left, asked — and nothing else', () => {
    const s = run(fresh(), at('#/plan/p1/about'), edit('p1', 'age', '58'), edit('p1', 'stopped', 'yes'), { type: A.PLAN_TOUCH, planId: 'p1', path: 'age' });
    const storage = fakeStorage();
    expect(saveDraft(storage, draftOf(s))).toBe(true);
    const kept = JSON.parse(storage.getItem(DRAFT_KEY));
    expect(kept.plan).toEqual({ id: 'p1', values: { age: '58', stopped: 'yes' }, touched: ['age'], asked: false });
    expect(JSON.stringify(kept)).not.toMatch(/stressTool|planDocument|decisionTool/);
    const loaded = loadDraft(storage);
    expect(loaded.plan).toEqual(kept.plan);
    expect(initialState({ today: '2026-09-30', build: 'test', draft: loaded }).draft.plan).toEqual(kept.plan);
  });
  it('on the way in: an unknown path, a non-text value and a draft without an id are dropped; an empty plan draft leaves nothing', () => {
    const storage = fakeStorage({ [DRAFT_KEY]: JSON.stringify({ plan: { id: 'p1', values: { age: '58', pot: '1', endAge: 95 }, touched: ['age', 'x'], asked: 'yes' } }) });
    expect(loadDraft(storage).plan).toEqual({ id: 'p1', values: { age: '58' }, touched: ['age'], asked: false });
    const noId = fakeStorage({ [DRAFT_KEY]: JSON.stringify({ plan: { values: { age: '58' } } }) });
    expect(loadDraft(noId)).toBe(null);
    const empty = fakeStorage();
    expect(saveDraft(empty, { ...fresh().draft })).toBe(true);
    expect(empty.getItem(DRAFT_KEY)).toBe(null);
  });
  it('the effect writes when the plan draft changes, and removes the key once it is cleared', () => {
    const store = createStore(fresh(), reduce);
    const storage = fakeStorage();
    const stop = startDraftStore(store, storage);
    store.dispatch(at('#/plan/p1/about'));
    store.dispatch(edit('p1', 'endAge', '95'));
    expect(JSON.parse(storage.getItem(DRAFT_KEY)).plan.values).toEqual({ endAge: '95' });
    store.dispatch({ type: A.PLAN_CANCEL, planId: 'p1' });
    expect(storage.getItem(DRAFT_KEY)).toBe(null);
    stop();
  });
});
