/**
 * The budget step's screens (research/v7/budget-step.md), drawn in jsdom and held to checkScreen's rules:
 *   - "What would you spend?": the choice (line by line — better; one figure), the box, the skip note once, the
 *     budget's total beside the box with "Use £X a month", the national guide levels;
 *   - the sheet: headings, monthly and yearly lines, the essential tick and sub-total, one-off costs listed and never
 *     added, a couple's budget the household's, the total a month and a year, where it sits against the guide levels;
 *   - under A's and B's answer: the spending used, and "no budget yet" — or "your budget now adds up to …";
 *   - under C's answer, once a budget exists: "this gives £X a month less / more".
 * The states are the pinned named states with the route and the sheet set here.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen } from '../c/_c.js';
import { checkScreen, draw, visibleText, expectedInputs, bannedHits, scopesFor } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { HEADINGS, starterSheet } from '../../../src/answers/keep/budgetSheet.js';
import { money } from '../../../src/answers/shared/format.js';
import { spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';
import { BUDGET } from '../../../src/v7/copy/budget.js';
import { A } from '../../../src/v7/copy/a.js';
import { B } from '../../../src/v7/copy/b.js';

vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

const load = (q, name) => JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states', q, `${name}.json`), 'utf8'));
const replaced = (state) => reduce(initialState({ today: state.env.today, build: 'test' }), { type: ACT.STATE_REPLACE, state });
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const fire = (el, type) => el.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }));
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);

/** A pinned state, on question q's spend step, with `values` over its draft, a spend choice and these amounts a month. */
function onSpend(q, name, { values = null, how = null, amounts = null, skipNoted = false } = {}) {
  const s = load(q, name);
  s.route = { screen: 'step', q, step: 'spend', planId: null, focus: null };
  if (values) s.draft[q].values = { ...s.draft[q].values, ...values };
  s.draft[q].spendHow = how;
  s.draft[q].skipNoted = skipNoted;
  if (amounts) {
    const sheet = starterSheet();
    for (const l of sheet.lines) if (l.label in amounts) Object.assign(l, typeof amounts[l.label] === 'object' ? amounts[l.label] : { amount: amounts[l.label] });
    s.budget = sheet;
  }
  return replaced(s);
}

describe('"What would you spend?" — the spend step', () => {
  it('blank: the choice, nothing ticked; the box; the guide levels; "Show"; no sheet, no note', () => {
    const s = onSpend('a', 'numbers-blank');
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('a.spend');
    expect(root.querySelector('h1').textContent).toBe(A.steps.spend.label);
    expect(root.textContent).toContain(BUDGET.spend.lead);
    expect(one(root, 'a.spendHow.lines').checked).toBe(false);
    expect(one(root, 'a.spendHow.one').checked).toBe(false);
    expect(one(root, 'a.spendHow.lines').closest('.option').textContent).toContain(BUDGET.spend.how.lines);
    expect(one(root, 'a.spend.amount')).not.toBe(null);
    expect(one(root, 'a.spend.kind.level')).not.toBe(null);                                  // the levels: a second guide, still a choice
    expect(root.querySelector('[data-region="budget"]')).toBe(null);
    expect(one(root, 'a.spend.skipNote')).toBe(null);
    expect(one(root, 'a.spend.levels').textContent).toBe(fill(BUDGET.spend.levels, { who: 'one person', minimum: money(spendLevelAMonth('single', 'minimum')),
      moderate: money(spendLevelAMonth('single', 'moderate')), comfortable: money(spendLevelAMonth('single', 'comfortable')) }));
    expect(one(root, 'a.action.show').getAttribute('type')).toBe('submit');
    expect(one(root, 'a.action.show').textContent).toBe(A.buttons.show);
  });
  it('choosing sends spend/how; "Show" asks', () => {
    const { root, actions } = draw(onSpend('b', 'numbers-blank'));
    one(root, 'b.spendHow.lines').click();
    one(root, 'b.spendHow.one').click();
    fire(one(root, 'b.action.show').closest('form'), 'submit');
    expect(actions).toEqual([{ type: 'spend/how', q: 'b', how: 'lines' }, { type: 'spend/how', q: 'b', how: 'one' }, { type: 'draft/ask', q: 'b' }]);
  });
  it('one figure of their own and no budget: the note, once, in the design\'s words', () => {
    const s = onSpend('a', 'numbers-blank', { values: { 'spend.amount': '2,000' }, how: 'one' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.spend.skipNote').textContent).toBe(BUDGET.spend.skipNote);
    expect(one(root, 'a.spendHow.one').checked).toBe(true);
    const noted = onSpend('a', 'numbers-blank', { values: { 'spend.amount': '2,000' }, how: 'one', skipNoted: true });
    expect(one(renderScreen(noted), 'a.spend.skipNote')).toBe(null);
    // typed without choosing is skipping too: the note says so
    expect(one(renderScreen(onSpend('a', 'numbers-blank', { values: { 'spend.amount': '2,000' } })), 'a.spend.skipNote')).not.toBe(null);
  });
  it('line by line: the sheet, heading by heading, every starter line with its typical amount as a hint — never filled in', () => {
    const s = onSpend('a', 'numbers-blank', { how: 'lines', amounts: {} });
    const root = renderScreen(s);
    clean(root, s);
    const sheet = root.querySelector('[data-region="budget"]');
    expect([...sheet.querySelectorAll('[data-heading]')].map((el) => el.getAttribute('data-heading'))).toEqual(HEADINGS);
    expect([...sheet.querySelectorAll('h3')].slice(0, HEADINGS.length).map((h) => h.textContent)).toEqual(HEADINGS.map((h) => BUDGET.sheet.headings[h]));
    const lines = starterSheet().lines;
    expect(sheet.querySelectorAll('[data-line]').length).toBe(lines.length);
    for (const l of lines) {
      expect(one(root, `budget.${l.id}.amount`).value).toBe('');
      expect(root.querySelector(`label[for="budget.${l.id}.amount"]`).textContent).toBe(l.label);
      expect(one(root, `budget.${l.id}.period`).value).toBe(l.period);
      expect(one(root, `budget.${l.id}.essential`).checked).toBe(l.essential);
    }
    const tax = lines.find((l) => l.label === 'Council tax');
    expect(root.querySelector(`[id="budget.${tax.id}.help"]`).textContent).toMatch(/^Typical: £\d+ a month$/);
    const yearly = lines.find((l) => l.label === 'Home insurance');                       // a yearly line: its typical amount a year
    expect(root.querySelector(`[id="budget.${yearly.id}.help"]`).textContent).toMatch(/^Typical: £\d+ a year$/);
    expect(one(root, 'budget.total').textContent).toContain(BUDGET.sheet.noTotal);
    expect(one(root, 'a.spend.use')).toBe(null);
  });
  it('with amounts: monthly and yearly lines, the sub-totals, the essentials, the total a month and a year, where it sits — and "Use £X a month"', () => {
    const s = onSpend('a', 'numbers-blank', { how: 'lines', amounts: { 'Council tax': '150', 'Groceries & household': '400', 'Main holiday': { amount: '3,000', period: 'yr' } } });
    const root = renderScreen(s);
    clean(root, s);
    const monthly = 150 + 400 + 3000 / 12;
    expect(one(root, 'budget.home.subtotal').textContent.trim()).toBe('£150 a month');
    expect(one(root, 'budget.holidays.subtotal').textContent.trim()).toBe('£250 a month');
    expect(one(root, 'budget.total').textContent).toContain(fill(BUDGET.sheet.total, { amount: money(monthly), yearly: money(monthly * 12) }));
    expect(one(root, 'budget.total').textContent).toContain(fill(BUDGET.sheet.essentials, { amount: money(550) }));
    expect(one(root, 'budget.where').textContent).toBe(fill(BUDGET.sheet.where.belowMinimum, { who: 'one person' }));
    expect(one(root, 'a.spend.budget').textContent).toBe(fill(BUDGET.spend.budgetIs, { amount: '£800' }));
    expect(one(root, 'a.spend.use').textContent).toBe('Use £800 a month');
    expect(one(root, 'a.spend.amount').value).toBe('');                                    // the total is beside the box, never in it
  });
  it('one-off costs are listed with their year — and the total says they are not in it', () => {
    const s = onSpend('a', 'numbers-blank', { how: 'lines', amounts: { 'Council tax': '150' } });
    s.budget = { ...s.budget, oneOffs: [{ id: 'o1', label: 'New car', amount: '18,000', year: '2031', everyYears: '8' }] };
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'budget.o1.amount').value).toBe('18,000');
    expect(one(root, 'budget.o1.year').value).toBe('2031');
    expect(root.textContent).toContain(BUDGET.sheet.oneOffsNote);
    expect(one(root, 'budget.total').textContent).toContain(fill(BUDGET.sheet.total, { amount: '£150', yearly: '£1,800' }));
  });
  it('a couple\'s budget is the household\'s: one sheet, typical amounts for two, the couple\'s guide levels', () => {
    const s = onSpend('a', 'numbers-couple-open', { how: 'lines', amounts: { 'Council tax': '170' } });
    const root = renderScreen(s);
    clean(root, s);
    expect(root.textContent).toContain(BUDGET.sheet.couple);
    expect(root.querySelector('[data-region="budget"] .note').textContent).toContain('a couple');
    expect(one(root, 'a.spend.levels').textContent).toContain(money(spendLevelAMonth('couple', 'moderate')));
  });
  it('editing sends budget actions only — never a draft — and the total\'s button sends budget/use', () => {
    const s = onSpend('a', 'numbers-blank', { how: 'lines', amounts: { 'Council tax': '150' } });
    const { root, actions } = draw(s);
    const id = s.budget.lines.find((l) => l.label === 'Gas').id;
    const amount = one(root, `budget.${id}.amount`);
    amount.value = '60'; fire(amount, 'input'); fire(amount, 'blur');
    const period = one(root, `budget.${id}.period`);
    period.value = 'yr'; fire(period, 'change');
    one(root, `budget.${id}.essential`).click();
    one(root, `budget.${id}.remove`).click();
    one(root, 'budget.add.food').click();
    one(root, 'budget.addOneOff').click();
    one(root, 'a.spend.use').click();
    expect(actions.map((a) => a.type)).toEqual(['budget/line', 'budget/touch', 'budget/line', 'budget/line', 'budget/remove', 'budget/add', 'budget/addOneOff', 'budget/use']);
    expect(actions.filter((a) => a.type.startsWith('draft/'))).toEqual([]);
    expect(actions[0]).toEqual({ type: 'budget/line', id, field: 'amount', value: '60' });
    expect(actions[7]).toEqual({ type: 'budget/use', q: 'a' });
  });
  it('a figure already in the box that the budget no longer matches: "Your budget now adds up to … this uses …"', () => {
    const s = onSpend('b', 'numbers-split-open', { values: { 'spend.amount': '2,340' }, how: 'lines', amounts: { 'Council tax': '150', 'Groceries & household': '2,350' } });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'b.spend.budget').textContent).toBe(fill(BUDGET.spend.budgetNow, { amount: '£2,500', used: '£2,340' }));
    expect(one(root, 'b.spend.use').textContent).toBe('Use £2,500 a month');
    expect(one(root, 'b.spend.amount').value).toBe('2,340');
  });
  it('the boxes in order: the choice, the sheet, the spending box; then "Use", then "Show"', () => {
    const s = onSpend('a', 'numbers-blank', { values: { 'spend.amount': '700' }, how: 'lines', amounts: { 'Council tax': '150' } });
    const root = renderScreen(s);
    const stops = [...root.querySelectorAll('main input, main select, main button, main a[href]')];
    const at = (id) => stops.findIndex((el) => el.getAttribute('data-testid') === id);
    expect(at('a.spendHow.lines')).toBeLessThan(at('budget.l1.amount'));
    expect(at('budget.addOneOff')).toBeLessThan(at('a.spend.kind.amount'));
    expect(at('a.spend.amount')).toBeLessThan(at('a.spend.use'));
    expect(at('a.spend.use')).toBeLessThan(at('a.action.show'));
    expect([...root.querySelectorAll('main input, main select')].map((el) => el.getAttribute('data-testid')).sort()).toEqual(expectedInputs(s).sort());
  });
  it('someone who has stopped: the retired view, as on every step of A and B', () => {
    const s = load('a', 'answer-retired');
    s.route = { ...s.route, step: 'spend' };
    const root = renderScreen(s);
    clean(root, s);
    expect(root.querySelector('main').getAttribute('data-view')).toBe('retired');
  });
  it('every word on these screens passes the banned list, by scope', () => {
    const cases = [onSpend('a', 'numbers-blank', { how: 'lines', amounts: { 'Council tax': '150' } }), onSpend('b', 'numbers-blank', { values: { 'spend.amount': '1' }, how: 'one' })];
    for (const s of cases) {
      const root = renderScreen(s);
      expect(bannedHits(visibleText(root), scopesFor(s))).toEqual([]);
    }
  });
});

describe('under the answer: the spending used, and whether a budget is behind it', () => {
  const withSheet = (q, name, amounts) => {
    const s = load(q, name);
    const sheet = starterSheet();
    for (const l of sheet.lines) if (l.label in amounts) l.amount = amounts[l.label];
    s.budget = sheet;
    return replaced(s);
  };
  it('A, no budget yet: "your own figure (no budget yet)" and the way to work it out line by line', () => {
    const s = replaced(load('a', 'answer-A1'));
    const root = renderScreen(s);
    clean(root, s);
    const line = one(root, 'a.spend.line');
    expect(line.getAttribute('data-budget')).toBe('no');
    expect(line.textContent).toContain(fill(BUDGET.answer.noBudget, { amount: '£1,900' }));
    const link = one(root, 'a.spend.workItOut');
    expect(link.getAttribute('href')).toBe('#/a/spend');
    expect(line.closest('[data-region="answer"]')).toBe(null);                           // the answer's region holds only its own figures
  });
  it('B, a budget that adds up to something else: "Your budget now adds up to …", with "Use"', () => {
    const s = withSheet('b', 'answer-B1', { 'Council tax': '150', 'Groceries & household': '2,000' });
    const { root, actions } = draw(s);
    clean(root, s);
    expect(one(root, 'b.spend.line').textContent).toContain(fill(BUDGET.spend.budgetNow, { amount: '£2,150', used: '£2,000' }));
    one(root, 'b.spend.use').click();
    expect(actions).toEqual([{ type: 'budget/use', q: 'b' }]);
  });
  it('a budget that matches: "your budget\'s total", with the way to it', () => {
    const s = withSheet('a', 'answer-A1', { 'Council tax': '150', 'Groceries & household': '1,750' });
    const root = renderScreen(s);
    clean(root, s);
    expect(one(root, 'a.spend.line').textContent).toContain(fill(BUDGET.answer.fromBudget, { amount: '£1,900' }));
    expect(one(root, 'a.spend.see').getAttribute('href')).toBe('#/a/spend');
  });
  it('C, once a budget exists: what the careful amount gives against it — less, more or about the same', () => {
    const c = (amounts) => withSheet('c', 'answer-F1', amounts);
    expect(one(renderScreen(replaced(load('c', 'answer-F1'))), 'c.budget.against')).toBe(null);
    const less = c({ 'Council tax': '150', 'Groceries & household': '1,500' });
    const root = renderScreen(less);
    clean(root, less);
    expect(one(root, 'c.budget.against').textContent).toBe(fill(BUDGET.answer.c.less, { amount: '£1,650', diff: '£270' }));
    expect(one(root, 'c.budget.against').closest('[data-region="answer"]')).toBe(null);
    expect(one(renderScreen(c({ 'Council tax': '150', 'Groceries & household': '1,000' })), 'c.budget.against').textContent).toBe(fill(BUDGET.answer.c.more, { amount: '£1,150', diff: '£230' }));
    expect(one(renderScreen(c({ 'Council tax': '1,380' })), 'c.budget.against').textContent).toBe(fill(BUDGET.answer.c.same, { amount: '£1,380' }));
  });
});
