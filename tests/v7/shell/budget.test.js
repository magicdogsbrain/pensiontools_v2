/**
 * The budget step in the shell (research/v7/budget-step.md): "The budget is a guide. The spending figure is always the
 * person's own."
 *
 *  - the figure in use never moves when the budget changes (random edits);
 *  - every answer equals the answer with the same figure typed by hand: "Use £X a month" is the budget's one way in,
 *    and it only types the figure; the checked inputs, their key and the answer itself are the same;
 *  - the "you are skipping the budget" note is shown once, while the figure is the person's own with no budget;
 *  - the numbers step goes on to the spend step only with its own boxes right; the spend step asks for the spending only;
 *  - the household's one sheet: started once, shared by A and B, kept in the tab.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import fc from 'fast-check';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import {
  parsedDraft, currentKey, figureInUse, spendView, skipNoteDue, budgetView, budgetAgainstC, spendDone, numbersDone, errorsToShow
} from '../../../src/v7/state/select.js';
import { starterSheet } from '../../../src/answers/keep/budgetSheet.js';
import { spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { DRAFT_KEY, loadDraft, saveDraft, draftOf, startDraftStore } from '../../../src/v7/effects/draftStore.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { fresh, run, set, route, at, typedA, typedB, typedC, answered, TODAY } from './_open.js';
import { fakeStorage } from './_shell.js';

const how = (q, h) => ({ type: A.SPEND_HOW, q, how: h });
const line = (id, field, value) => ({ type: A.BUDGET_LINE, id, field, value });
const use = (q) => ({ type: A.BUDGET_USE, q });
const idOf = (state, label) => state.budget.lines.find((l) => l.label === label).id;
/** A sheet with these amounts a month (by catalogue label), started from A's spend step. */
function withBudget(state, amounts, q = 'a') {
  let s = reduce(at(state, q, 'spend'), how(q, 'lines'));
  for (const [label, amount] of Object.entries(amounts)) s = reduce(s, line(idOf(s, label), 'amount', amount));
  return s;
}

describe('the spend step\'s choice, and the household\'s one sheet', () => {
  it('"line by line" starts the sheet once — the catalogue\'s lines, every amount blank; "one figure" starts nothing', () => {
    const s = reduce(at(typedA(), 'a', 'spend'), how('a', 'lines'));
    expect(s.draft.a.spendHow).toBe('lines');
    expect(s.budget).toEqual(starterSheet());
    const edited = reduce(s, line('l1', 'amount', '900'));
    expect(reduce(reduce(edited, how('a', 'one')), how('a', 'lines')).budget).toBe(edited.budget);   // never started again
    const one = reduce(at(typedA(), 'a', 'spend'), how('a', 'one'));
    expect(one.budget).toBe(null);
    expect(one.draft.a.spendHow).toBe('one');
  });
  it('A and B share the one sheet; C has no spend step', () => {
    const s = withBudget(typedB(typedA()), { 'Council tax': '150' });
    const b = reduce(at(s, 'b', 'spend'), how('b', 'lines'));
    expect(b.budget).toBe(s.budget);
    expect(budgetView(b, 'b').totals.monthly).toBe(150);
    expect(() => reduce(typedC(), how('c', 'lines'))).toThrow();
    expect(() => reduce(typedC(), use('c'))).toThrow();
    expect(() => reduce(typedC(), { type: A.DRAFT_ONWARD, q: 'c' })).toThrow();
  });
  it('a starter line keeps the catalogue\'s label; an added line takes one; lines and one-off costs come and go', () => {
    let s = withBudget(typedA(), {});
    expect(reduce(s, line('l1', 'label', 'Not rent')).budget).toBe(s.budget);
    s = reduce(s, { type: A.BUDGET_ADD, heading: 'food' });
    const added = s.budget.lines.find((l) => !l.starter);
    expect(added).toMatchObject({ heading: 'food', label: '', amount: '', period: 'mo', essential: false });
    // added after the last food line, so the sheet stays in heading order
    const order = s.budget.lines.map((l) => l.heading);
    expect(order.lastIndexOf('food')).toBe(s.budget.lines.indexOf(added));
    s = run(s, line(added.id, 'label', 'Coffee'), line(added.id, 'amount', '40'), line(added.id, 'period', 'yr'), line(added.id, 'essential', true));
    expect(s.budget.lines.find((l) => l.id === added.id)).toMatchObject({ label: 'Coffee', amount: '40', period: 'yr', essential: true });
    expect(reduce(s, line(added.id, 'period', 'week')).budget).toBe(s.budget);
    s = reduce(s, { type: A.BUDGET_REMOVE, id: added.id });
    expect(s.budget.lines.some((l) => l.id === added.id)).toBe(false);
    s = reduce(s, { type: A.BUDGET_ADD_ONE_OFF });
    const o = s.budget.oneOffs[s.budget.oneOffs.length - 1];
    s = run(s, { type: A.BUDGET_ONE_OFF, id: o.id, field: 'amount', value: '9,000' }, { type: A.BUDGET_ONE_OFF, id: o.id, field: 'year', value: '2030' });
    expect(budgetView(s, 'a').oneOffs.find((x) => x.id === o.id)).toMatchObject({ amount: '9,000', year: '2030' });
    expect(budgetView(s, 'a').totals.monthly).toBe(0);                                    // one-offs are never added
    expect(reduce(s, { type: A.BUDGET_REMOVE_ONE_OFF, id: o.id }).budget.oneOffs.some((x) => x.id === o.id)).toBe(false);
  });
  it('a problem in the sheet shows once its box has been left', () => {
    let s = withBudget(typedA(), { 'Council tax': 'lots' });
    const id = idOf(s, 'Council tax');
    const row = (st) => budgetView(st, 'a').headings.flatMap((h) => h.rows).find((r) => r.id === id);
    expect(row(s).problem).toBe(null);
    s = reduce(s, { type: A.BUDGET_TOUCH, id, field: 'amount' });
    expect(row(s).problem).toBe('notANumber');
  });
});

describe('the figure in use never moves when the budget changes', () => {
  const ids = starterSheet().lines.map((l) => l.id);
  const edit = fc.oneof(
    fc.tuple(fc.constantFrom(...ids), fc.oneof(fc.integer({ min: 0, max: 3000 }).map(String), fc.constantFrom('', 'abc', '1,200', '9.99+5'))).map(([id, v]) => line(id, 'amount', v)),
    fc.tuple(fc.constantFrom(...ids), fc.constantFrom('mo', 'yr')).map(([id, v]) => line(id, 'period', v)),
    fc.tuple(fc.constantFrom(...ids), fc.boolean()).map(([id, v]) => line(id, 'essential', v)),
    fc.constantFrom('home', 'food', 'other').map((heading) => ({ type: A.BUDGET_ADD, heading })),
    fc.constantFrom(...ids).map((id) => ({ type: A.BUDGET_REMOVE, id })),
    fc.constant({ type: A.BUDGET_ADD_ONE_OFF }),
    fc.tuple(fc.constantFrom('o1', 'o2', 'o5'), fc.constantFrom('amount', 'year'), fc.constantFrom('18,000', '2031', 'x')).map(([id, field, value]) => ({ type: A.BUDGET_ONE_OFF, id, field, value })),
    fc.tuple(fc.constantFrom(...ids), fc.constantFrom('amount', 'label')).map(([id, field]) => ({ type: A.BUDGET_TOUCH, id, field })),
    fc.constantFrom('lines', 'one').map((h) => how('a', h)),
    fc.constantFrom('#/a/spend', '#/a/answer', '#/b/spend', '#/c/answer').map((h) => ({ type: A.ROUTE_SET, route: route('step', h.split('/')[1], h.split('/')[2]) }))
  );
  it('random edits to the sheet: the draft, the checked inputs and their key are untouched, in A and in B', () => {
    fc.assert(fc.property(fc.constantFrom('1,850', '2,000', '3,592'), fc.array(edit, { maxLength: 40 }), (figure, edits) => {
      const start = withBudget(typedB(typedA(fresh(), { spend: figure }), { spend: figure }), { 'Council tax': '150' });
      let s = start;
      for (const e of edits) s = reduce(s, e);
      for (const q of ['a', 'b']) {
        expect(s.draft[q].values).toBe(start.draft[q].values);
        expect(figureInUse(s, q)).toBe(figureInUse(start, q));
        expect(currentKey(s, q)).toBe(currentKey(start, q));
      }
    }), { numRuns: 200 });
  });
  it('an answer held for the figure stays current through any edit to the budget', () => {
    const s = answered(withBudget(at(typedA(), 'a', 'answer'), { Gas: '80' }), 'a', { status: 'ok', basis: {} });
    const edited = run(s, line(idOf(s, 'Gas'), 'amount', '95'), { type: A.BUDGET_ADD, heading: 'other' });
    expect(edited.answers.a).toBe(s.answers.a);
    expect(currentKey(edited, 'a')).toBe(s.answers.a.inputsKey);
  });
  it('what it says instead: "your budget now adds up to … this uses …", with the button to use it', () => {
    const s = withBudget(typedA(fresh(), { spend: '2,340' }), { 'Council tax': '150', 'Groceries & household': '2,350' });
    const v = spendView(s, 'a');
    expect(v.figure).toBe(2340);
    expect(v.budget).toMatchObject({ total: 2500, differs: true });
    expect(v.canUse).toBe(true);
    const same = withBudget(typedA(fresh(), { spend: '2,500' }), { 'Council tax': '150', 'Groceries & household': '2,350' });
    expect(spendView(same, 'a').budget.differs).toBe(false);
    expect(spendView(same, 'a').canUse).toBe(false);
  });
});

describe('"Use £X a month" — the budget\'s one way to the figure', () => {
  it('types the total, to the pound, into the box (an amount), and marks the spending as worked out line by line', () => {
    // the TV licence is a yearly line in the catalogue: 150 + 174.50 ÷ 12 + 400.40 = £564.94 a month
    const s = withBudget(typedA(fresh(), { spend: '' }), { 'Council tax': '150', 'TV licence': '174.50', 'Groceries & household': '400.40' });
    const t = reduce(s, use('a'));
    expect(t.draft.a.values['spend.amount']).toBe('565');
    expect(t.draft.a.values['spend.kind']).toBe('amount');
    expect(t.draft.a.spendHow).toBe('lines');
    expect(t.draft.a.touched).toContain('spend.amount');
    expect(t.budget).toBe(s.budget);
    expect(figureInUse(t, 'a')).toBe(565);
  });
  it('from a level, it switches to the amount', () => {
    const s = withBudget(run(typedA(fresh(), { spend: '' }), set('a', 'spend.kind', 'level'), set('a', 'spend.level', 'moderate')), { 'Council tax': '150' });
    expect(figureInUse(s, 'a')).toBe(spendLevelAMonth('single', 'moderate'));
    const t = reduce(s, use('a'));
    expect(t.draft.a.values).toMatchObject({ 'spend.kind': 'amount', 'spend.amount': '150' });
  });
  it('does nothing with no budget, a total of £0, or a total the box cannot take', () => {
    const none = at(typedA(), 'a', 'spend');
    expect(reduce(none, use('a'))).toBe(none);
    const blank = withBudget(typedA(), {});
    expect(reduce(blank, use('a'))).toBe(blank);
    const huge = withBudget(typedA(), { 'Rent / mortgage': '60,000' });
    expect(spendView(huge, 'a').canUse).toBe(false);
    expect(reduce(huge, use('a'))).toBe(huge);
  });
  it('every answer equals the answer with the same figure typed by hand (random budgets; the answer itself, once)', () => {
    const labels = ['Council tax', 'Gas', 'Groceries & household', 'Main holiday', 'Pets', 'Clothes'];
    fc.assert(fc.property(fc.array(fc.tuple(fc.constantFrom(...labels), fc.integer({ min: 1, max: 1500 })), { minLength: 1, maxLength: 6 }), (rows) => {
      const amounts = Object.fromEntries(rows.map(([l, n]) => [l, String(n)]));
      const viaBudget = reduce(withBudget(typedA(fresh(), { spend: '' }), amounts), use('a'));
      const total = viaBudget.draft.a.values['spend.amount'];
      const byHand = run(typedA(fresh(), { spend: '' }), set('a', 'spend.kind', 'amount'), set('a', 'spend.amount', total));
      expect(parsedDraft(viaBudget, 'a').inputs).toEqual(parsedDraft(byHand, 'a').inputs);
      expect(currentKey(viaBudget, 'a')).toBe(currentKey(byHand, 'a'));
    }), { numRuns: 100 });
    const viaBudget = reduce(withBudget(typedA(fresh(), { spend: '' }), { 'Council tax': '150', 'Groceries & household': '1,700' }), use('a'));
    const byHand = typedA(fresh(), { spend: '1,850' });
    const env = { today: TODAY, futures: 40, seed: 0, trace: false, detail: 'chart' };
    expect(answerA(parsedDraft(viaBudget, 'a').inputs, env)).toEqual(answerA(parsedDraft(byHand, 'a').inputs, env));
  });
});

describe('the "you are skipping the budget" note — once', () => {
  it('due on the spend step once a figure of their own is there with no budget behind it, or "one figure" is chosen', () => {
    expect(skipNoteDue(at(typedA(fresh(), { spend: '' }), 'a', 'spend'), 'a')).toBe(false);
    expect(skipNoteDue(reduce(at(typedA(fresh(), { spend: '' }), 'a', 'spend'), how('a', 'one')), 'a')).toBe(true);
    expect(skipNoteDue(at(typedA(), 'a', 'spend'), 'a')).toBe(true);
    expect(skipNoteDue(reduce(at(typedA(), 'a', 'spend'), how('a', 'lines')), 'a')).toBe(false);
    expect(skipNoteDue(withBudget(typedA(), { Gas: '60' }), 'a')).toBe(false);          // a budget: nothing skipped
  });
  it('leaving the step with it on screen marks it shown; it is not shown again', () => {
    const on = at(typedA(), 'a', 'spend');
    for (const leave of [{ type: A.ROUTE_SET, route: route('step', 'a', 'numbers') }, { type: A.DRAFT_ASK, q: 'a' }]) {
      const left = reduce(on, leave);
      expect(left.draft.a.skipNoted).toBe(true);
      expect(skipNoteDue(at(left, 'a', 'spend'), 'a')).toBe(false);
    }
    // leaving with nothing to note marks nothing
    const empty = at(typedA(fresh(), { spend: '' }), 'a', 'spend');
    expect(reduce(empty, { type: A.ROUTE_SET, route: route('front') }).draft.a.skipNoted).toBe(false);
  });
  it('the answer\'s quiet line follows the budget, not the note: no budget yet → spendView says so', () => {
    const s = answered(at(typedA(), 'a', 'answer'), 'a', { status: 'ok', basis: {} });
    expect(spendView(s, 'a').budget).toBe(null);
    expect(spendView(withBudget(s, { Gas: '60' }), 'a').budget).toMatchObject({ total: 60 });
  });
});

describe('the numbers step goes on; the spend step asks for the spending only', () => {
  it('draft/onward: with the numbers right, to the spend step — the spending not asked for yet', () => {
    const s = reduce(at(typedA(fresh(), { spend: '' }), 'a', 'numbers'), { type: A.DRAFT_ONWARD, q: 'a' });
    expect(s.route).toEqual(route('step', 'a', 'spend'));
    expect(errorsToShow(s, 'a')).toEqual({});
    expect(numbersDone(s, 'a')).toBe(true);
    expect(spendDone(s, 'a')).toBe(false);
  });
  it('draft/onward: with a box wrong or empty, stays and marks those boxes — only those', () => {
    const s = reduce(at(typedA(fresh(), { pot: '', stop: '45', spend: '' }), 'a', 'numbers'), { type: A.DRAFT_ONWARD, q: 'a' });
    expect(s.route).toEqual(route('step', 'a', 'numbers'));
    expect(Object.keys(errorsToShow(s, 'a')).sort()).toEqual(['stop.age', 'you.pot']);
    expect(s.draft.a.asked).toBe(false);
    const b = reduce(at(typedB(fresh(), { payIn: '' }), 'b', 'numbers'), { type: A.DRAFT_ONWARD, q: 'b' });
    expect(Object.keys(errorsToShow(b, 'b'))).toEqual(['you.payIn.total']);
  });
  it('draft/ask on the spend step: the spending wrong → stays; right → the answer step, which asks for anything else itself', () => {
    const blank = reduce(at(typedA(fresh(), { spend: '' }), 'a', 'spend'), { type: A.DRAFT_ASK, q: 'a' });
    expect(blank.route).toEqual(route('step', 'a', 'spend'));
    expect(errorsToShow(blank, 'a')).toEqual({ 'spend.amount': 'required' });
    const fine = reduce(at(typedA(), 'a', 'spend'), { type: A.DRAFT_ASK, q: 'a' });
    expect(fine.route).toEqual(route('step', 'a', 'answer'));
    const noPot = reduce(at(typedA(fresh(), { pot: '' }), 'a', 'spend'), { type: A.DRAFT_ASK, q: 'a' });
    expect(noPot.route).toEqual(route('step', 'a', 'answer'));                         // never a bounce back to step 1
    expect(errorsToShow(noPot, 'a')).toEqual({ 'you.pot': 'required' });
  });
});

describe('question C: "Your budget adds up to … this gives …"', () => {
  const c = (careful, extra = {}) => answered(at(typedC(), 'c', 'answer'), 'c', { status: 'ok', monthly: { careful, middling: careful + 100, good: careful + 200 }, basis: {}, ...extra });
  it('only once a budget exists, and only for an amount C stands by', () => {
    expect(budgetAgainstC(c(1850))).toBe(null);
    const withSheet = (s) => withBudget(s, { 'Council tax': '150', 'Groceries & household': '2,190' });
    expect(budgetAgainstC(withSheet(c(1850)))).toEqual({ total: 2340, diff: 490, direction: 'less' });
    expect(budgetAgainstC(withSheet(c(2400)))).toEqual({ total: 2340, diff: 60, direction: 'more' });
    expect(budgetAgainstC(withSheet(c(2340)))).toEqual({ total: 2340, diff: 0, direction: 'same' });
    expect(budgetAgainstC(withSheet(c(1850, { closedYears: { from: 55 } })))).toBe(null);
    expect(budgetAgainstC(withSheet(c(1850, { status: 'guaranteed-only' })))).toBe(null);
  });
});

describe('kept in the tab', () => {
  it('a reload keeps the sheet, the spend choice and whether the note was shown — and nothing of them reaches an answer', () => {
    const storage = fakeStorage();
    let s = withBudget(typedA(), { 'Council tax': '150' });
    s = reduce(s, { type: A.ROUTE_SET, route: route('step', 'a', 'answer') });            // the note was on screen: now shown
    expect(saveDraft(storage, draftOf(s))).toBe(true);
    const back = initialState({ today: TODAY, build: 'test', draft: loadDraft(storage) });
    expect(back.budget).toEqual(s.budget);
    expect(back.draft.a.spendHow).toBe('lines');
    expect(back.draft.a.values).toEqual(s.draft.a.values);
    const noted = reduce(at(typedB(), 'b', 'spend'), { type: A.ROUTE_SET, route: route('front') });
    expect(noted.draft.b.skipNoted).toBe(true);
    saveDraft(storage, draftOf(noted));
    expect(initialState({ today: TODAY, build: 'test', draft: loadDraft(storage) }).draft.b.skipNoted).toBe(true);
  });
  it('the store writes when the sheet changes, and only pt_v7_draft', () => {
    const storage = fakeStorage();
    const store = createStore(at(typedA(), 'a', 'spend'), reduce);
    startDraftStore(store, storage);
    store.dispatch(how('a', 'lines'));
    store.dispatch(line('l3', 'amount', '42'));
    expect([...new Set(storage.writes)]).toEqual([DRAFT_KEY]);
    expect(JSON.parse(storage.getItem(DRAFT_KEY)).budget.lines.find((l) => l.id === 'l3').amount).toBe('42');
  });
  it('a kept sheet is cleaned on the way in: no unknown keys, no id twice, nothing but text', () => {
    const storage = fakeStorage({ [DRAFT_KEY]: JSON.stringify({
      a: { values: {}, spendHow: 'sideways', skipNoted: 'yes' },
      budget: { version: 9, lines: [{ id: 'l1', heading: 'nope', label: 7, amount: 150, period: 'week', essential: 'y', starter: true, x: 1 }, { id: 'l1' }, { id: 'zz' }],
        oneOffs: [{ id: 'o1', label: 'Car', amount: '9,000', year: '2030', everyYears: '8', extra: true }], touched: [3, 'l1.amount'] },
      kept: { a: { name: 'x'.repeat(500), sent: { name: 'Stop', createdAt: 'yesterday' } } }
    }) });
    const s = initialState({ today: TODAY, build: 'test', draft: loadDraft(storage) });
    expect(s.draft.a.spendHow).toBe(null);
    expect(s.draft.a.skipNoted).toBe(false);
    expect(s.budget).toEqual({ version: 1, lines: [{ id: 'l1', heading: 'other', label: '', amount: '', period: 'mo', essential: false, starter: true }],
      oneOffs: [{ id: 'o1', label: 'Car', amount: '9,000', year: '2030', everyYears: '8' }], touched: ['l1.amount'] });
    expect(s.keep.a).toEqual({ name: null, problem: null, saving: false, sent: null, back: null });
  });
});
