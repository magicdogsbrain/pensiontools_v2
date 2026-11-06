/**
 * Month by month, drawn (research/v7/months-in-v7.md §1; 7.2.0): on #/plan/<id>/month, its own screen with the step current
 * on the rail. Every state the page has: a locked drawing plan with this month to record (what to draw and from where, the
 * pots pre-filled from the last record, Record); months missed (the nudge, then the fill ticked and its months named on
 * Record); a tax year not set up (the set-up, what reaches the bank, the month worked out as it will be); a top-up that
 * falls short (the three-way choice); a bought ladder (where the money comes from, nothing sold); a plan not locked (lock
 * first); the example plan; a plan shown as saved; the toast after a record. The reducer's two actions and the plans list's
 * link. Every box labelled; no banned word, no countdown, nothing broken. Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { planMonthView } from '../../../src/v7/state/select.js';
import { screenName, parse } from '../../../src/v7/router/routes.js';
import { corpus, entryOf, stateWith } from './_plans.js';

const C = corpus();
const SCOPES = ['all', 'record', 'retired'];
const T = 'plan.month';
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;

function draw(state) {
  const s = reduce(state, { type: A.PLANS_VIEW, view: viewFor(state) });
  const root = document.createElement('div');
  root.id = 'app';
  const out = [];
  render(h(App, { state: s, dispatch: (a) => out.push(a) }), root);
  const words = root.cloneNode(true);
  for (const el of words.querySelectorAll('.plan-name, .plan-stage-line, .plan-rail, nav')) el.remove();
  return { state: s, root, actions: out, text: visibleText(root), words: visibleText(words) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const labelled = (root) => [...root.querySelectorAll('input, select, textarea')].filter((el) => !(el.id && root.querySelector(`label[for="${el.id}"]`)) && !el.closest('fieldset')).map((el) => el.id || el.name);
const clean = (words) => { expect(bannedHits(words, SCOPES)).toEqual([]); expect(words).not.toMatch(COUNTDOWN); expect(words).not.toMatch(/undefined|NaN|\[object|\{\w+\}/); };
const typedState = (state, planId, typed) => Object.entries(typed).reduce((s, [path, value]) => reduce(s, { type: A.PLAN_EDIT, planId, path, value }), state);
const at = (name, today, typed = {}, o = {}) => {
  const entry = entryOf(C[name], today);
  const base = stateWith([entry], '#/plan/' + entry.plan.id + '/month', { today, ...o });
  return { plan: entry.plan, ...draw(typedState(base, entry.plan.id, typed)) };
};

describe('Month by month, drawn', () => {
  it('the address draws its own screen', () => {
    expect(screenName(parse('#/plan/AbC123/month'))).toBe('plan.month');
  });

  it('a locked drawing plan, this month to record: what to draw and where from, the pots pre-filled, Record; every box labelled; no banned word', () => {
    const { root, words } = at('04-buckets-running', '2026-10-02');
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.month');
    expect(one(root, 'plan.step.month').textContent).toBe('Month by month');
    expect(one(root, `${T}.prefilled`).textContent).toContain('September 2026');
    expect(one(root, `${T}.advice`).getAttribute('data-month')).toBe('2026-10');
    expect(one(root, `${T}.pension`).textContent).toMatch(/^£[\d,]+$/);
    expect(one(root, `${T}.afterTax`).textContent).toMatch(/^£[\d,]+$/);
    expect(one(root, `${T}.from`)).not.toBe(null);
    expect(one(root, `${T}.submit`).textContent).toBe('Record October 2026');
    expect(one(root, `${T}.setUp`)).toBe(null);
    expect(one(root, `${T}.yearDone`).textContent).toContain('2026/27');
    expect(labelled(root)).toEqual([]);
    clean(words);
  });

  it('months missed: the nudge names them; filling them in names them on Record', () => {
    const before = at('06-pre-6.4-no-timing', '2026-10-02');
    expect(one(before.root, `${T}.gap`).getAttribute('data-count')).toBe('3');
    expect(one(before.root, `${T}.gap`).textContent).toContain('July 2026 to September 2026');
    clean(before.words);
    const after = at('06-pre-6.4-no-timing', '2026-10-02', { 'mo.fill': 'yes', 'mo.from': '2026-07' });
    expect(one(after.root, `${T}.gap`)).toBe(null);
    expect(one(after.root, `${T}.submit`).textContent).toBe('Record October 2026 and fill in 3 months');
    expect(one(after.root, `${T}.fill`).textContent).toContain('marked as filled in later');
    clean(after.words);
  });

  it('a tax year not set up: the set-up, what reaches the bank, the month worked out as it will be; Set up, not Record', () => {
    const { root, words } = at('04-buckets-running', '2027-04-10');
    expect(one(root, `${T}.setUp`).getAttribute('data-year')).toBe('27/28');
    expect(one(root, `${T}.setUp.submit`).textContent).toBe('Set up 2027/28');
    expect(one(root, `${T}.setUp.bankAfter`).textContent).toMatch(/^£[\d,]+$/);
    expect(one(root, `${T}.preview`)).not.toBe(null);
    expect(one(root, `${T}.submit`)).toBe(null);
    expect(labelled(root)).toEqual([]);
    clean(words);
  });

  it('part-way through a year: the income and tax so far are asked; a top-up that falls short asks which', () => {
    const { root, words } = at('04-buckets-running', '2027-06-10', { 'ty.income': '70000', 'ty.isa': '2000' });
    expect(root.querySelector('[data-field="ty.toDate"]')).not.toBe(null);
    expect(root.querySelector('[data-field="ty.choice"]')).not.toBe(null);
    clean(words);
  });

  it('a bought ladder: where the money comes from, nothing sold', () => {
    const { root, words } = at('03-gilt-ladder-runup', '2026-10-02');
    expect(one(root, `${T}.from`).querySelector('[data-from]').getAttribute('data-from')).toBe('cashBefore');
    expect(words).toContain('Nothing is sold');
    clean(words);
  });

  it('a plan not locked: told to lock first, with the way there, and nothing to type', () => {
    const { root, words } = at('02-pnv-draft', '2026-10-02');
    expect(one(root, `${T}.needsLock`)).not.toBe(null);
    expect(one(root, `${T}.lock`).getAttribute('href')).toContain('/lock');
    expect(root.querySelector('form')).toBe(null);
    clean(words);
  });

  it('kept in this window, no account: the same page, with the window\'s note', () => {
    const { root, words } = at('04-buckets-running', '2026-10-02', {}, { source: 'window', session: 'nobody' });
    expect(one(root, 'plan.windowWarning')).not.toBe(null);
    expect(one(root, `${T}.submit`)).not.toBe(null);
    clean(words);
  });

  it('a plan shown as saved: no Record', () => {
    const entry = { ...entryOf(C['04-buckets-running'], '2026-10-02'), newer: true };
    const { root } = draw(stateWith([entry], '#/plan/' + entry.plan.id + '/month', { today: '2026-10-02' }));
    expect(one(root, `${T}.submit`)).toBe(null);
  });

  it('a drawing plan\'s home leads with "Record October" into Month by month (7.3.0; it opened on the tool itself in 7.2.0); the rail and the next step lead to it inside the new app, never to the classic page', () => {
    const entry = entryOf(C['04-buckets-running'], '2026-10-02');
    const id = entry.plan.id;
    const home = draw(stateWith([entry], '#/plan/' + id, { today: '2026-10-02' }));
    expect(one(home.root, 'plan.home.todo.month.record').getAttribute('href')).toBe('#/plan/' + id + '/month');
    expect(one(home.root, 'plan.home.todo.month.record').textContent).toBe('Record October');
    const opened = draw(stateWith([entry], '#/plan/' + id + '/month', { today: '2026-10-02' }));
    expect(one(opened.root, 'plan.step.month').textContent).toBe('Month by month');
    expect(one(opened.root, `${T}.submit`).textContent).toBe('Record October 2026');
    const other = draw(stateWith([entry], '#/plan/' + id + '/plan', { today: '2026-10-02' }));
    const links = [...other.root.querySelectorAll(`a[href="#/plan/${id}/month"]`)].map((a) => a.textContent);
    expect(links.length).toBeGreaterThan(0);
    expect(links.join(' ')).toContain('Record October');
    expect(other.text).not.toContain('Record October in the classic planner');
  });

  it('Your plans: a "Month by month" link beside every drawing plan, none beside a saver\'s', () => {
    const entries = ['04-buckets-running', '05-saver-committed', '02-pnv-draft'].map((n) => entryOf(C[n], '2026-10-02'));
    const { root } = draw(stateWith(entries, '#/plans', { today: '2026-10-02' }));
    expect(one(root, 'plans.month.' + entries[0].plan.id).getAttribute('href')).toBe('#/plan/' + entries[0].plan.id + '/month');
    expect(one(root, 'plans.month.' + entries[1].plan.id)).toBe(null);
    expect(one(root, 'plans.month.' + entries[2].plan.id)).not.toBe(null);
  });
});

describe('Month by month: the reducer and the view', () => {
  const entry = entryOf(C['04-buckets-running'], '2026-10-02');
  const id = String(entry.plan.id);
  const base = () => { const s = stateWith([entry], '#/plan/' + id + '/month', { today: '2026-10-02' }); return reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) }); };

  it('Record: saving { kind: "month" }, every problem shown; a second press while saving changes nothing', () => {
    const s = reduce(base(), { type: A.PLAN_MONTH_RECORD, planId: id });
    expect(s.ui.saving).toEqual({ planId: id, kind: 'month' });
    expect(s.draft.plan.asked).toBe(true);
    expect(reduce(s, { type: A.PLAN_MONTH_RECORD, planId: id })).toBe(s);
    expect(reduce(s, { type: A.PLAN_TAX_YEAR, planId: id })).toBe(s);
  });
  it('Set up: saving { kind: "taxYear" }', () => {
    expect(reduce(base(), { type: A.PLAN_TAX_YEAR, planId: id }).ui.saving).toEqual({ planId: id, kind: 'taxYear' });
  });
  it('a plan id is needed', () => {
    expect(() => reduce(base(), { type: A.PLAN_MONTH_RECORD })).toThrow();
  });
  it('the write told: the toast for this plan, op "month", with Undo; the draft emptied', () => {
    let s = reduce(base(), { type: A.PLAN_EDIT, planId: id, path: 'mo.total', value: '580,000' });
    s = reduce(s, { type: A.PLAN_MONTH_RECORD, planId: id });
    s = reduce(s, { type: A.PLAN_SAVED, planId: id, previous: { 'decisionTool.history': [] }, line: { id: 'recorded', slots: { month: 'October 2026' } }, op: 'month' });
    expect(s.ui.toast).toMatchObject({ planId: id, kind: 'saved', op: 'month' });
    expect(s.draft.plan.values).toEqual({});
    const v = planMonthView(reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) }));
    expect(v.toast.op).toBe('month');
  });
  it('a box\'s problem shows once it is left, not before', () => {
    let s = reduce(base(), { type: A.PLAN_EDIT, planId: id, path: 'mo.total', value: 'lots' });
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    expect(planMonthView(s).shownErrors['mo.total']).toBe(undefined);
    s = reduce(s, { type: A.PLAN_TOUCH, planId: id, path: 'mo.total' });
    expect(planMonthView(s).shownErrors['mo.total']).toBe('number');
  });
  it('the boxes of Month by month are plan edit paths; nothing else is', () => {
    expect(() => reduce(base(), { type: A.PLAN_EDIT, planId: id, path: 'mo.nonsense', value: '1' })).toThrow();
    expect(reduce(base(), { type: A.PLAN_EDIT, planId: id, path: 'ty.income', value: '30000' }).draft.plan.values['ty.income']).toBe('30000');
  });
});
