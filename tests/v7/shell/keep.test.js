/**
 * "Keep this as a plan" in the shell (research/v7/save-as-plan.md; road-to-7.md step 7 — the preview makes the plan itself):
 * when an answer can be kept, the name box, the checks, what the reducer does when the one write file says the plan is
 * made (keep/made) or could not be (keep/failed), what the draft store keeps of it, the rail's "Kept", and what the test
 * hook may draw. The create itself — the plan written to the account or this window — is tests/v7/plan/planCreate.test.js.
 *
 * Retired with step 7: the seed written to localStorage, the planner opened at ../#new-plan, the receipt read on coming
 * back. tests/v7/boundaries.test.js holds that none of it is left anywhere in V7.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { keepView, lockedPlanInAccount } from '../../../src/v7/state/select.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { railFor } from '../../../src/v7/rail/index.js';
import { startDraftStore, loadDraft, DRAFT_KEY } from '../../../src/v7/effects/draftStore.js';
import { initialState, cleanMade } from '../../../src/v7/state/initial.js';
import { fakeStorage } from './_shell.js';
import { TODAY } from './_open.js';

const states = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
/** A pinned answer state, through the reducer's own door (state/replace), as the test hook draws it. */
const loaded = (q, name) => reduce(initialState({ today: TODAY, build: 'test' }), { type: A.STATE_REPLACE, state: states(q, name) });
const run = (state, ...actions) => actions.reduce((s, a) => reduce(s, a), state);
const MADE = { id: 'Kq8LwT2mJv5PzYc9BnRd', name: 'Stop at 60 (2)', where: 'account' };

describe('when an answer can be kept', () => {
  it('a final answer, for what is typed now, of status ok: the box holds the suggested name', () => {
    const v = keepView(loaded('a', 'answer-A1'), 'a');
    expect(v).toMatchObject({ can: true, why: null, suggested: 'Stop at 60 · £1,900 a month', name: 'Stop at 60 · £1,900 a month', problem: null, saving: false, made: null, separate: false });
    expect(keepView(loaded('c', 'answer-F1'), 'c').name).toBe('From 58 · £1,350 a month');
    expect(keepView(loaded('b', 'answer-B1'), 'b').name).toBe('Stop at 60 · £2,000 a month · paying £700');
    expect(keepView(loaded('d', 'answer-D1'), 'd').name).toBe('From 68 · £2,100 a month');
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
    expect(keepView(loaded('d', 'answer-pensions-only'), 'd').why).toBe('notOk');
    expect(keepView(loaded('a', 'answer-no'), 'a').can).toBe(true);                       // a "no" is still a try
    expect(keepView(loaded('d', 'answer-no'), 'd').can).toBe(true);
    const typedSince = reduce(loaded('a', 'answer-A1'), { type: A.DRAFT_SET, q: 'a', path: 'stop.age', value: '61' });
    expect(keepView(typedSince, 'a')).toMatchObject({ can: false, why: 'notCurrent', name: '' });
  });
  it('what was typed in the box stays, whatever the answer does next', () => {
    let s = reduce(loaded('a', 'answer-A1'), { type: A.KEEP_NAME, q: 'a', value: 'The early one' });
    expect(keepView(s, 'a').name).toBe('The early one');
    s = reduce(s, { type: A.DRAFT_SET, q: 'a', path: 'stop.age', value: '61' });
    expect(s.keep.a.name).toBe('The early one');
  });
  it('D with a locked plan in the account keeps a separate plan (answer-D.md 3.8); the other questions do not', () => {
    const locked = { plan: { id: 'Kq8LwT2mJv5PzYc9BnRd', planDetails: { name: 'Ladder' }, decisionTool: { settings: { locked: true } } }, newer: false, failed: false };
    const open = { plan: { id: 'guest-k3v9x1qa', planDetails: { name: 'Open' }, decisionTool: { settings: { locked: false } } }, newer: false, failed: false };
    const withPlans = (state, list) => run(state, { type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } }, { type: A.PLANS_SET, list, source: 'account', readAt: '14:03' });
    expect(lockedPlanInAccount(loaded('d', 'answer-D1'))).toBe(null);
    expect(lockedPlanInAccount(withPlans(loaded('d', 'answer-D1'), [open]))).toBe(false);
    expect(lockedPlanInAccount(withPlans(loaded('d', 'answer-D1'), [open, locked]))).toBe(true);
    expect(keepView(withPlans(loaded('d', 'answer-D1'), [locked]), 'd').separate).toBe(true);
    expect(keepView(withPlans(loaded('d', 'answer-D1'), [open]), 'd').separate).toBe(false);
    expect(keepView(withPlans(loaded('a', 'answer-A1'), [locked]), 'a').separate).toBe(false);
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
  it('an answer that cannot be kept is refused, never sent', () => {
    expect(reduce(loaded('a', 'answer-first'), { type: A.KEEP_SAVE, q: 'a' }).keep.a).toMatchObject({ problem: 'notReady', saving: false });
  });
  it('all right: saving, once — a second press while it is under way changes nothing', () => {
    const s = reduce(loaded('b', 'answer-B1'), { type: A.KEEP_SAVE, q: 'b' });
    expect(s.keep.b).toMatchObject({ saving: true, problem: null });
    expect(reduce(s, { type: A.KEEP_SAVE, q: 'b' })).toBe(s);
  });
});

describe('keep/made and keep/failed: what the one write file says', () => {
  it('made: the plan\'s id, name and where it is are kept; the box goes back to following the answer; the rail says "Kept" and the step is done', () => {
    const saving = reduce(loaded('a', 'answer-A1'), { type: A.KEEP_SAVE, q: 'a' });
    const s = reduce(run(saving, { type: A.KEEP_NAME, q: 'a', value: 'Typed' }), { type: A.KEEP_MADE, q: 'a', ...MADE });
    expect(s.keep.a).toEqual({ name: null, problem: null, saving: false, partnerKept: null, made: { ...MADE, partnerId: null, partnerName: null, separate: false } });
    expect(keepView(s, 'a')).toMatchObject({ name: 'Stop at 60 · £1,900 a month', made: { id: MADE.id, name: 'Stop at 60 (2)', where: 'account' } });
    const rail = railFor(s);
    expect(rail.steps.find((x) => x.id === 'keep')).toMatchObject({ state: 'done', result: { text: 'Kept' } });
    // a couple: the partner's plan beside it; D: a separate plan
    const couple = reduce(loaded('a', 'answer-A2-couple'), { type: A.KEEP_MADE, q: 'a', ...MADE, partnerId: 'guest-k3v9x1qa', partnerName: 'Stop at 60 (2) · partner', where: 'window' });
    expect(couple.keep.a.made).toEqual({ ...MADE, where: 'window', partnerId: 'guest-k3v9x1qa', partnerName: 'Stop at 60 (2) · partner', separate: false });
    expect(reduce(loaded('d', 'answer-D1'), { type: A.KEEP_MADE, q: 'd', ...MADE, separate: true }).keep.d.made.separate).toBe(true);
  });
  it('made with nothing to show for it is refused: an id, a name and where are needed; junk in them is dropped', () => {
    const s = loaded('a', 'answer-A1');
    expect(() => reduce(s, { type: A.KEEP_MADE, q: 'a', name: 'x', where: 'account' })).toThrow();
    expect(() => reduce(s, { type: A.KEEP_MADE, q: 'a', id: 'p1', name: '', where: 'account' })).toThrow();
    expect(() => reduce(s, { type: A.KEEP_MADE, q: 'a', id: 'p1', name: 'x', where: 'elsewhere' })).toThrow();
    expect(() => reduce(s, { type: A.KEEP_MADE, q: 'a', id: 'no spaces here', name: 'x', where: 'account' })).toThrow();
    expect(cleanMade({ id: 'p1', name: 'x', where: 'window', partnerId: 'bad id', partnerName: 'y' })).toEqual({ id: 'p1', name: 'x', where: 'window', partnerId: null, partnerName: null, separate: false });
    expect(cleanMade(null)).toBe(null);
  });
  it('failed: the problem is kept, saving ends, the box and the figures stay; an unknown problem reads as "failed"', () => {
    const saving = reduce(loaded('b', 'answer-B1'), { type: A.KEEP_SAVE, q: 'b' });
    for (const problem of ['notReady', 'full', 'usedUp', 'unverified', 'storage', 'failed']) {
      const s = reduce(saving, { type: A.KEEP_FAILED, q: 'b', problem });
      expect(s.keep.b).toMatchObject({ saving: false, problem, made: null, partnerKept: null });
      expect(s.answers.b).toBe(saving.answers.b);
    }
    expect(reduce(saving, { type: A.KEEP_FAILED, q: 'b', problem: 'sideways' }).keep.b.problem).toBe('failed');
    const partial = reduce(saving, { type: A.KEEP_FAILED, q: 'b', problem: 'partial', name: 'Ours · partner' });
    expect(partial.keep.b).toMatchObject({ problem: 'partial', partnerKept: 'Ours · partner' });
    expect(keepView(partial, 'b').partnerKept).toBe('Ours · partner');
    // the next try clears it
    expect(reduce(reduce(partial, { type: A.KEEP_SAVE, q: 'b' }), { type: A.KEEP_MADE, q: 'b', ...MADE }).keep.b.partnerKept).toBe(null);
  });
  it('the retired actions are gone: keep/sent and keep/back are not actions the reducer knows', () => {
    expect(A.KEEP_SENT).toBeUndefined();
    expect(A.KEEP_BACK).toBeUndefined();
    expect(() => reduce(loaded('a', 'answer-A1'), { type: 'keep/sent', q: 'a', name: 'x', createdAt: '2026-09-30T08:00:00.000Z' })).toThrow();
    expect(() => reduce(loaded('a', 'answer-A1'), { type: 'keep/back', q: 'a', outcome: 'taken' })).toThrow();
  });
});

describe('the draft store keeps the name as typed and the plan made — so a reload still says "Kept as"', () => {
  it('a reload keeps them, and nothing else of the answer', () => {
    const session = fakeStorage();
    const store = createStore(reduce(loaded('a', 'answer-A1'), { type: A.KEEP_MADE, q: 'a', ...MADE }), reduce);
    startDraftStore(store, session);
    store.dispatch({ type: A.KEEP_NAME, q: 'a', value: 'Typed' });
    const kept = loadDraft(session);
    expect(kept.kept).toEqual({ a: { name: 'Typed', made: { ...MADE, partnerId: null, partnerName: null, separate: false } } });
    expect(session.getItem(DRAFT_KEY)).not.toMatch(/careful|middling|monthly|result|1,770|417982/);   // what was typed, never the answer's figures
    const back = initialState({ today: TODAY, build: 'test', draft: kept });
    expect(back.keep.a).toEqual({ name: 'Typed', problem: null, saving: false, partnerKept: null, made: { ...MADE, partnerId: null, partnerName: null, separate: false } });
    // the old shape of a kept save ({ sent }) is simply not read
    const old = initialState({ today: TODAY, build: 'test', draft: { kept: { a: { name: 'Old', sent: { name: 'Old', createdAt: '2026-09-30T08:00:00.000Z' } } } } });
    expect(old.keep.a).toEqual({ name: 'Old', problem: null, saving: false, partnerKept: null, made: null });
  });
});

describe('the test hook draws a state with its budget and its keeps — cleaned as the tab\'s own store would be', () => {
  it('state/replace keeps a sheet and a plan made, and drops what neither can hold', () => {
    const s = states('a', 'answer-A1');
    s.budget = { version: 1, lines: [{ id: 'l1', heading: 'home', label: 'Council tax', amount: '150', period: 'mo', essential: true, starter: true, junk: 1 }], oneOffs: [], touched: [] };
    s.keep = { a: { name: 'Mine', made: { ...MADE, junk: 1 }, problem: 'storage', saving: true, sent: { name: 'x' } }, c: { back: 'sideways', problem: 'oops' } };
    const t = reduce(initialState({ today: TODAY, build: 'test' }), { type: A.STATE_REPLACE, state: s });
    expect(t.budget.lines).toEqual([{ id: 'l1', heading: 'home', label: 'Council tax', amount: '150', period: 'mo', essential: true, starter: true }]);
    expect(t.keep.a).toEqual({ name: 'Mine', problem: 'storage', saving: false, partnerKept: null, made: { ...MADE, partnerId: null, partnerName: null, separate: false } });
    expect(t.keep.c).toEqual({ name: null, problem: null, saving: false, partnerKept: null, made: null });
    expect(t.keep.b).toEqual({ name: null, problem: null, saving: false, partnerKept: null, made: null });
    expect(t.keep.d).toEqual({ name: null, problem: null, saving: false, partnerKept: null, made: null });
  });
});
