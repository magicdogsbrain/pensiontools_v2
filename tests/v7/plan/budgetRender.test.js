/**
 * The budget on a saved plan, drawn (research/v7/road-to-7.md step 11b): on #/plan/<id>/budget as its own screen, the budget
 * step current on the rail; the totals against the national guide levels; the level the typical amounts aim at and "Fill the
 * blanks"; the lines in two groups with their boxes, the typical hint, the nudge when an amount looks wrong, from and to an
 * age, the parts, Remove; "Did you miss anything?"; the one-off costs; who pays over time on a shared budget; the file (download,
 * open, replace); "Start again" with its confirm on the screen. Typing dispatches plan/edit; leaving a changed box dispatches
 * ONE plan/budget change; a press dispatches its change at once. A locked plan is editable (the budget is outside the lock);
 * a plan shown as saved has no box. No banned word in any scope a plan page is shown in; never "about £". Drawn from the
 * corpus through stateWith (no named state file: the budget is small and the drawing is checked here).
 */
import { describe, it, expect } from 'vitest';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { viewFor } from '../../../src/v7/effects/planSource.js';
import { PLAN_BUDGET as W } from '../../../src/v7/copy/planBudget.js';
import { normalisedBudget, readBudget } from '../../../src/answers/plan/budget.js';
import { budgetToSave, cleanBudgetForSave, fillTypicalAmounts, idMaker, resetBudgetLines, typicalMonthlyFor } from '../../../src/services/BudgetModel.js';
import { corpus, entryOf, household, stateWith, TODAY } from './_plans.js';

const C = corpus();
const RETIRED = ['all', 'record', 'retired', 'planner'];
const SAVER = ['all', 'record', 'saver', 'planner'];
const T = 'plan.budget';
const copy = (v) => JSON.parse(JSON.stringify(v));

function withBudget(raw, { shared = false } = {}) {
  const plan = copy(raw);
  const base = normalisedBudget({ ...(plan.budgetTool && plan.budgetTool.settings), sharedWithPartner: shared });
  let b = resetBudgetLines(base, idMaker(base));
  b = fillTypicalAmounts(b).budget;
  b.lines.find((l) => typicalMonthlyFor(l.label, b) != null).annual = 20;   // far below typical: the nudge
  b.oneOffs[0].amount = 18000; b.oneOffs[0].atAge = 66;
  b.oneOffs[1].amount = 2500; b.oneOffs[1].atAge = 65; b.oneOffs[1].everyYears = null;
  plan.budgetTool = { ...(plan.budgetTool || {}), settings: budgetToSave(cleanBudgetForSave(b)) };
  return plan;
}
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

describe('the budget on a saved plan, drawn', () => {
  const raw = withBudget(C['12-lumpy-db-gia']);
  const entries = [entryOf(raw, TODAY)];
  const id = raw.id;
  const B = normalisedBudget(readBudget(entries[0].plan, []).budget);
  const first = B.lines[0];
  const low = B.lines.find((l) => l.annual === 20);

  it('its own screen, the step current on the rail; the totals, the level, the groups, the one-offs, the file, the reset; every box labelled; no banned word, no "about £"', () => {
    const { root, text, words } = draw(stateWith(entries, '#/plan/' + id + '/budget'));
    expect(root.querySelector('main').getAttribute('data-screen')).toBe('plan.budget');
    expect(one(root, 'plan.step.budget').textContent).toBe(W.title);
    expect(root.querySelector('[data-testid="rail.plan.budget"]').getAttribute('aria-current')).toBe('step');
    expect(one(root, `${T}.totals`).getAttribute('data-has')).toBe('1');
    expect(one(root, `${T}.totals.line`).textContent).toMatch(/^£[\d,]+ a month after tax \(£[\d,]+ a year\), essentials £[\d,]+\.$/);
    expect(one(root, `${T}.totals.levels`).textContent).toContain('The national guide levels for one person');
    expect(one(root, `${T}.totals.singles`)).not.toBe(null);
    expect(one(root, `${T}.tier.moderate`).checked).toBe(true);
    expect(one(root, `${T}.fill`)).not.toBe(null);
    expect(all(root, '.budget-line').length).toBe(B.lines.length);
    expect(one(root, `${T}.group.essential`).querySelector('h2').textContent).toContain('Essentials');
    expect(one(root, `${T}.group.discretionary`).querySelector('h2').textContent).toContain('Lifestyle');
    expect(one(root, `${T}.line.${first.id}.amount`).value).toBe(first.annual == null ? '' : String(Math.round(first.annual / 12)));
    expect(one(root, `${T}.line.${low.id}.amount`).value).toBe(low.period === 'mo' ? '2' : '20');
    expect(one(root, `${T}.line.${low.id}.typical`).textContent).toMatch(/^Typical: £[\d,]+ a (month|year)$/);
    expect(one(root, `${T}.line.${low.id}.sanity`).textContent).toBe(W.line.sanity.low);
    expect(one(root, `${T}.missed`)).not.toBe(null);
    expect(all(root, `[data-testid^="${T}.missed."]`).length).toBeGreaterThan(3);
    expect(all(root, '.budget-oneoff').length).toBe(B.oneOffs.length);
    expect(one(root, `${T}.download`)).not.toBe(null);
    expect(one(root, `${T}.open`)).not.toBe(null);
    expect(one(root, `${T}.reset`)).not.toBe(null);
    expect(one(root, `${T}.phases`), 'not shared: no who-pays').toBe(null);
    expect(one(root, `${T}.toSpend`).getAttribute('href')).toBe('#/plan/' + id + '/spend');
    expect(labelled(root)).toEqual([]);
    expect(bannedHits(words, RETIRED)).toEqual([]);
    expect(text).not.toMatch(/about £|around £|undefined|NaN|\{\w+\}/);
    expect(text).toContain(W.totals.guide.split('{')[0].trim());
    expect(one(root, `${T}.add.essential`)).not.toBe(null);
    expect(one(root, `${T}.addOneOff`)).not.toBe(null);
  });

  it('typing dispatches plan/edit with the text; leaving a changed box dispatches one plan/budget change; a wrong figure is said and carries none; the tick, the period and the presses write at once', () => {
    const base = draw(stateWith(entries, '#/plan/' + id + '/budget'));
    const box = one(base.root, `${T}.line.${first.id}.amount`);
    box.value = '=200*12';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    expect(base.actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: `line.${first.id}.amount`, value: '=200*12' });
    const typed = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_EDIT, planId: id, path: `line.${first.id}.amount`, value: '=200*12' });
    const box2 = one(typed.root, `${T}.line.${first.id}.amount`);
    expect(box2.value).toBe('=200*12');
    box2.dispatchEvent(new FocusEvent('blur'));
    const sent = typed.actions.filter((a) => a.type === 'plan/budget');
    expect(sent).toEqual([{ type: 'plan/budget', planId: id, change: { kind: 'line', id: first.id, field: 'amount', value: 2400 } }]);
    const wrong = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_EDIT, planId: id, path: `line.${first.id}.amount`, value: 'lots' });
    expect(wrong.root.querySelector(`[data-error-for="${T}.line.${first.id}.amount"]`).textContent).toBe(W.errors.notANumber);
    one(wrong.root, `${T}.line.${first.id}.amount`).dispatchEvent(new FocusEvent('blur'));
    expect(wrong.actions.some((a) => a.type === 'plan/budget')).toBe(false);
    // the tick
    const tick = one(base.root, `${T}.line.${first.id}.essential`);
    expect(tick.checked).toBe(true);
    tick.click();
    expect(base.actions.find((a) => a.type === 'plan/budget')).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'line', id: first.id, field: 'essential', value: false } });
    // the period
    const period = one(base.root, `${T}.line.${first.id}.period`);
    period.value = 'yr';
    period.dispatchEvent(new Event('change', { bubbles: true }));
    expect(base.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'line', id: first.id, field: 'period', value: 'yr' } });
    // the presses
    one(base.root, `${T}.line.${first.id}.remove`).click();
    expect(base.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'remove', id: first.id } });
    one(base.root, `${T}.line.${first.id}.parts`).click();
    expect(base.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'partToggle', id: first.id } });
    // a new line is named first: the press with no name touches the box (its problem shows), with a name it adds; Enter in the box presses
    one(base.root, `${T}.add.essential.press`).click();
    expect(base.actions.pop()).toEqual({ type: 'plan/touch', planId: id, path: 'add.essential' });
    const nameBox = one(base.root, `${T}.add.essential`);
    nameBox.value = 'Allotment';
    nameBox.dispatchEvent(new Event('input', { bubbles: true }));
    expect(base.actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'add.essential', value: 'Allotment' });
    const named = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_EDIT, planId: id, path: 'add.essential', value: 'Allotment' });
    one(named.root, `${T}.add.essential.press`).click();
    expect(named.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'add', tier: 'essential', label: 'Allotment' } });
    one(named.root, `${T}.add.essential`).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    expect(named.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'add', tier: 'essential', label: 'Allotment' } });
    const nameless = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_TOUCH, planId: id, path: 'add.discretionary' });
    expect(nameless.root.querySelector(`[data-error-for="${T}.add.discretionary"]`).textContent).toBe(W.errors.required);
    expect(nameless.root.querySelector(`[data-error-for="${T}.add.essential"]`)).toBe(null);
    const cost = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_EDIT, planId: id, path: 'add.oneOff', value: 'A boiler' });
    one(cost.root, `${T}.addOneOff.press`).click();
    expect(cost.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'addOneOff', label: 'A boiler' } });
    one(base.root, `${T}.fill`).click();
    expect(base.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'fill' } });
    one(base.root, `${T}.tier.comfortable`).click();
    expect(base.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'tier', tier: 'comfortable' } });
    all(base.root, `[data-testid^="${T}.missed."]`)[0].click();
    const sug = base.actions.pop();
    expect(sug.type).toBe('plan/budget'); expect(sug.change.kind).toBe('suggest'); expect(typeof sug.change.label).toBe('string');
    one(base.root, `${T}.download`).click();
    expect(base.actions.pop()).toEqual({ type: 'plan/budgetDownload', planId: id });
    // the age range opens on the page, closes with a write
    one(base.root, `${T}.line.${first.id}.ages`).click();
    expect(base.actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: `line.${first.id}.ages`, value: '1' });
    const opened = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_EDIT, planId: id, path: `line.${first.id}.ages`, value: '1' });
    expect(one(opened.root, `${T}.line.${first.id}.agesBox`)).not.toBe(null);
    one(opened.root, `${T}.line.${first.id}.ages`).click();
    expect(opened.actions.filter((a) => a.type === 'plan/budget')).toEqual([{ type: 'plan/budget', planId: id, change: { kind: 'ages', id: first.id, open: false } }]);
    // the reset asks first, on the screen
    one(base.root, `${T}.reset`).click();
    expect(base.actions.pop()).toEqual({ type: 'ui/toggle', id: 'budgetReset' });
    const asked = draw(stateWith(entries, '#/plan/' + id + '/budget', { open: ['budgetReset'] }));
    expect(one(asked.root, `${T}.resetConfirm`).textContent).toContain(W.tools.resetAsk);
    one(asked.root, `${T}.resetConfirm.yes`).click();
    expect(asked.actions.filter((a) => a.type === 'plan/budget')).toEqual([{ type: 'plan/budget', planId: id, change: { kind: 'reset' } }]);
  });

  it('the parts open: each part\'s boxes, the total, add and remove; a spreadsheet read: the summary and "Replace the budget with it"', () => {
    const parts = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_EDIT, planId: id, path: `line.${first.id}.open`, value: '1' });
    expect(one(parts.root, `${T}.line.${first.id}.partsBox`)).not.toBe(null);
    expect(one(parts.root, `${T}.line.${first.id}.partsTotal`).textContent).toMatch(/^Adds up to £/);
    one(parts.root, `${T}.line.${first.id}.partAdd`).click();
    expect(parts.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'partAdd', id: first.id } });
    const csv = entries[0].plan && readBudget(entries[0].plan, []).budget ? 'Type,Section,Item,Amount,Period\nItem,Essential,Gas,50,mo\nItem,Discretionary,Pets,20,mo\nOne-off,Essential,New car,18000,,,,,,66,8' : '';
    const read = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_EDIT, planId: id, path: 'import.text', value: csv });
    expect(one(read.root, `${T}.import.read`).textContent).toBe('Read 2 lines and 1 one-off cost.');
    one(read.root, `${T}.import.replace`).click();
    expect(read.actions.pop()).toEqual({ type: 'plan/budget', planId: id, change: { kind: 'spreadsheet', text: csv } });
    one(read.root, `${T}.import.cancel`).click();
    expect(read.actions.pop()).toEqual({ type: 'plan/edit', planId: id, path: 'import.text', value: '' });
    const none = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_EDIT, planId: id, path: 'import.text', value: 'nothing,to,see' });
    expect(one(none.root, `${T}.import.read`).textContent).toBe(W.tools.readNone);
    expect(one(none.root, `${T}.import.replace`)).toBe(null);
  });

  it('a shared budget: who pays on every line and one-off, a copy for the partner, who pays over time with add and remove; the holder named', () => {
    const { ladder, saver } = household();
    const holderRaw = withBudget(ladder, { shared: true });
    const readerRaw = copy(saver);
    readerRaw.budgetTool = { sharedFrom: holderRaw.id, settings: { sharedWithPartner: true, mySharePct: 40, splitPhases: [{ fromAge: 63, mySharePct: 50 }], currentAge: 48, retirementAge: 60 } };
    const pair = [entryOf(holderRaw, TODAY), entryOf(readerRaw, TODAY)];
    const { root, words, actions } = draw(stateWith(pair, '#/plan/' + readerRaw.id + '/budget'));
    expect(one(root, `${T}.sharedFrom`).textContent).toContain('‘Ladder plan’’s');
    const lid = pair[0].plan.budgetTool.settings.lines[0].id;
    expect(one(root, `${T}.line.${lid}.paidBy`)).not.toBe(null);
    expect(one(root, `${T}.line.${lid}.duplicate`)).not.toBe(null);
    expect(one(root, `${T}.phases`)).not.toBe(null);
    expect(one(root, `${T}.phase.0.fromAge`).value).toBe('63');
    expect(one(root, `${T}.phaseAdd`)).not.toBe(null);
    expect(bannedHits(words, SAVER)).toEqual([]);
    const paidBy = one(root, `${T}.line.${lid}.paidBy`);
    paidBy.value = 'partner';
    paidBy.dispatchEvent(new Event('change', { bubbles: true }));
    expect(actions.pop()).toEqual({ type: 'plan/budget', planId: readerRaw.id, change: { kind: 'line', id: lid, field: 'paidBy', value: 'partner' } });
    const holder = draw(stateWith(pair, '#/plan/' + holderRaw.id + '/budget'));
    expect(one(holder.root, `${T}.sharedWith`).textContent).toContain('‘Saving plan’');
    expect(bannedHits(holder.words, RETIRED)).toEqual([]);
  });

  it('a locked plan is editable (the budget is outside the lock) and says so; a plan shown as saved has no box; the toast with Undo, the problem line', () => {
    const lockedRaw = withBudget(C['03-gilt-ladder-runup']);
    const locked = [entryOf(lockedRaw, TODAY)];
    const { root } = draw(stateWith(locked, '#/plan/' + lockedRaw.id + '/budget'));
    expect(one(root, `${T}.locked`).textContent).toBe(W.locked);
    expect(all(root, '.budget-line input').length).toBeGreaterThan(0);
    const newer = draw(stateWith(entries.map((e) => ({ ...e, newer: true })), '#/plan/' + id + '/budget'));
    expect(one(newer.root, `${T}.readonly`)).not.toBe(null);
    expect(newer.root.querySelector('input, select, textarea')).toBe(null);
    expect(one(newer.root, `${T}.fill`)).toBe(null);
    const saved = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_SAVED, planId: id, previous: { 'budgetTool.settings': raw.budgetTool.settings }, line: { id: 'removed', slots: { name: 'Gas' } }, op: 'budget' });
    expect(one(saved.root, `${T}.toast`).textContent).toContain('Saved. ‘Gas’ removed.');
    one(saved.root, `${T}.undo`).click();
    expect(saved.actions.pop()).toEqual({ type: 'plan/undo', planId: id });
    const problem = draw(stateWith(entries, '#/plan/' + id + '/budget'), { type: A.PLAN_SAVE_FAILED, planId: id, problem: 'badFile' });
    expect(one(problem.root, `${T}.problem`).textContent).toBe(W.problems.badFile);
  });

  it('the plan page\'s budget section links here ("Change this here"), and "What you spend" on the plan no longer hands the budget to the planner', () => {
    const page = draw(stateWith(entries, '#/plan/' + id + '/plan'));
    const budgetStep = page.state.plans.view.page.steps.find((s) => s.id === 'budget');
    expect(budgetStep.buttons).toEqual([{ id: 'changeBudget', href: '#/plan/' + id + '/budget', slots: {} }]);
    const rail = draw(stateWith(entries, '#/plan/' + id + '/budget'));
    expect(one(rail.root, `${T}.back`).getAttribute('href')).toBe('#/plan/' + id + '/plan');
  });
});
