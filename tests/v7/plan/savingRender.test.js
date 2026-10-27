/**
 * "What you pay in", drawn (research/v7/road-to-7.md step 11b): on #/plan/<id>/saving as its own screen, the saving step current
 * on the rail; the boxes with their saved values and sources; "How tax relief works, and your salary" closed until opened, then
 * the person's own figures; what the pot could be by the stop with "Your mix" when something is held; the records with the
 * boxes and "Record it"; "Am I on course?" handed to the planner; Save, Cancel and the Undo toast. The saver rules hold: never
 * a contribution, never "on track", never a countdown. A locked saver is editable (outside the lock); a plan shown as saved
 * has no box. Drawn from the corpus through stateWith.
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { SAVING as W } from '../../../src/v7/copy/saving.js';
import { corpus, entriesAt, stateWith, TODAY } from './_plans.js';

const C = corpus();
const SCOPES = ['all', 'record', 'retired', 'saver', 'planner'];
const T = 'plan.saving';
const COUNTDOWN = /\b\d+ (more )?(years?|months?|weeks?|days?) (to go|to wait|until|till|away|from now|before (your|the) (plan|ladder))\b|\bcount[\s-]?down\b|\bto go\b/i;

function draw(state, ...actions) {
  let s = state;
  for (const a of actions) s = reduce(s, typeof a === 'function' ? a(s) : a);
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  const root = document.createElement('div');
  root.id = 'app';
  const out = [];
  render(h(App, { state: s, dispatch: (a) => out.push(a) }), root);
  const words = root.cloneNode(true);
  for (const el of words.querySelectorAll('.plan-name')) el.remove();
  return { state: s, root, actions: out, text: visibleText(root), words: visibleText(words) };
}
const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const all = (root, sel) => [...root.querySelectorAll(sel)];
const labelled = (root) => all(root, 'input, select, textarea').filter((el) => !(el.id && root.querySelector(`label[for="${el.id}"]`)) && !el.getAttribute('aria-label')).map((el) => el.id || el.name || el.tagName);

describe('"What you pay in", drawn', () => {
  const entries = entriesAt(TODAY);
  const saver = C['05-saver-committed'];
  const id = saver.id;

  it('the saver (05): its own screen, the step current, the boxes with the planner\'s figures, the relief block closed, the pot table with "Your mix", the records; every box labelled; no banned word, no countdown', () => {
    const { root, text, words } = draw(stateWith(entries, '#/plan/' + id + '/saving'));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.saving');
    expect(one(root, 'plan.step.saving').textContent).toBe(W.title);
    expect(root.querySelector('[data-testid="rail.plan.saving"]').getAttribute('aria-current')).toBe('step');
    expect(one(root, `${T}.netMonthly`).value).toBe('600');
    expect(one(root, `${T}.employerMonthly`).value).toBe('450');
    expect(one(root, `${T}.escalationPct`).value).toBe('1');
    expect(one(root, `${T}.schemeType.ras`).checked).toBe(true);
    expect(one(root, `${T}.salary`).value).toBe('68000');
    expect(one(root, `${T}.ages`).textContent).toBe('From age 48 to age 60: 12 years of saving. The ages are on “About you and when”.');
    expect(one(root, `${T}.notFrozen`).textContent).toBe(W.notFrozen);
    expect(one(root, `${T}.relief.box`)).toBe(null);
    expect(one(root, `${T}.pot`).getAttribute('data-mix')).toBe('1');
    expect(all(root, `[data-testid="${T}.pot.table"] tbody tr`).length).toBeGreaterThan(2);
    expect(one(root, `${T}.pot.mix`).textContent).toMatch(/^Your mix: what you hold today — shares \d+%, bonds \d+%/);
    expect(one(root, `${T}.pot.charges`)).not.toBe(null);
    expect(one(root, `${T}.records`).getAttribute('data-count')).toBe(String(saver.accumulationTool.history.length));
    expect(all(root, `[data-testid="${T}.records.table"] tbody tr`).length).toBe(saver.accumulationTool.history.length);
    expect(one(root, `${T}.record`)).not.toBe(null);
    expect(one(root, `${T}.onCourse`)).not.toBe(null);
    expect(labelled(root)).toEqual([]);
    expect(bannedHits(words, SCOPES)).toEqual([]);
    expect(COUNTDOWN.test(words)).toBe(false);
    expect(text).not.toMatch(/undefined|NaN|\{\w+\}/);
    expect(text).not.toMatch(/\bcontribution|on track/i);
    expect(text).toContain('the tax the government adds back');
  });

  it('the relief block opens with the figures; typing dispatches plan/edit; Save dispatches plan/save; "Record it" dispatches plan/record; "Am I on course?" leaves for the planner', () => {
    const open = draw(stateWith(entries, '#/plan/' + id + '/saving', { open: ['savingRelief'] }));
    expect(one(open.root, `${T}.relief.box`)).not.toBe(null);
    expect(open.text).toMatch(/Each month you pay £600; £750 goes into your pension, £150 of it the tax added back\./);
    expect(open.text).toContain('A further £');
    const { root, actions } = draw(stateWith(entries, '#/plan/' + id + '/saving'));
    const box = one(root, `${T}.escalationPct`);
    box.value = '2';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'escalationPct', value: '2' });
    root.querySelector('form.saving-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(actions.find((a) => a.type === 'plan/save')).toEqual({ type: 'plan/save', planId: id });
    one(root, `${T}.record`).click();
    expect(actions.pop()).toEqual({ type: 'plan/record', planId: id });
    one(root, `${T}.onCourse`).click();
    expect(actions.pop()).toEqual({ type: 'plan/change', planId: id, place: 'onCourse', back: '#/plan/' + id + '/saving' });
    one(root, `${T}.relief.open`).click();
    expect(actions.pop()).toEqual({ type: 'ui/toggle', id: 'savingRelief' });
  });

  it('a wrong record box is said after "Record it"; the toast after a record and after a save, with Undo', () => {
    const wrong = draw(stateWith(entries, '#/plan/' + id + '/saving'), { type: A.PLAN_EDIT, planId: id, path: 'record.pension', value: 'lots' }, { type: A.PLAN_RECORD, planId: id });
    expect(wrong.root.querySelector(`[data-error-for="${T}.record.pension"]`).textContent).toBe(W.errors['record.pension'].notANumber);
    const recorded = draw(stateWith(entries, '#/plan/' + id + '/saving'), { type: A.PLAN_SAVED, planId: id, previous: { 'accumulationTool.history': saver.accumulationTool.history }, line: { id: 'recorded', slots: { month: 'October 2026', total: '£325,000' } }, op: 'potRecord' });
    expect(one(recorded.root, `${T}.toast`).textContent).toContain('Recorded October 2026: £325,000 in all.');
    one(recorded.root, `${T}.undo`).click();
    expect(recorded.actions.pop()).toEqual({ type: 'plan/undo', planId: id });
    const saved = draw(stateWith(entries, '#/plan/' + id + '/saving'), { type: A.PLAN_SAVED, planId: id, previous: { 'accumulationTool.settings': saver.accumulationTool.settings }, line: { id: 'saving', slots: { you: '£600', employer: '£450', total: '£1,200' } }, op: null });
    expect(one(saved.root, `${T}.toast`).textContent).toContain('Saved. £600 a month from you, £450 from your employer: £1,200 a month into the pension in all.');
  });

  it('a retired plan: no pot table, the stopped line; a fresh plan: no ages, the line; a plan shown as saved: no box; the plan page links here', () => {
    const retired = draw(stateWith(entries, '#/plan/' + C['12-lumpy-db-gia'].id + '/saving'));
    expect(one(retired.root, `${T}.pot.stopped`).textContent).toBe(W.stopped);
    expect(one(retired.root, `${T}.pot.table`)).toBe(null);
    expect(bannedHits(retired.words, SCOPES)).toEqual([]);
    const fresh = draw(stateWith(entries, '#/plan/' + C['01-fresh-default'].id + '/saving'));
    expect(one(fresh.root, `${T}.pot.noAges`).textContent).toBe(W.agesNone);
    const newer = draw(stateWith(entries.map((e) => (e.plan.id === id ? { ...e, newer: true } : e)), '#/plan/' + id + '/saving'));
    expect(one(newer.root, `${T}.readonly`)).not.toBe(null);
    expect(newer.root.querySelector('input, select, textarea')).toBe(null);
    const page = draw(stateWith(entries, '#/plan/' + id + '/plan'));
    const step = page.state.plans.view.page.steps.find((s) => s.id === 'saving');
    expect(step.buttons[0]).toEqual({ id: 'changeSaving', href: '#/plan/' + id + '/saving', slots: {} });
    const pot = page.state.plans.view.page.steps.find((s) => s.id === 'pot');
    expect(pot.buttons).toEqual([{ id: 'recordPot', href: '#/plan/' + id + '/saving', slots: {} }]);
    expect(page.state.plans.view.page.next.button).toEqual({ id: 'recordPot', href: '#/plan/' + id + '/saving', slots: {} });
  });
});
